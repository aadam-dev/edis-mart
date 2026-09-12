import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { reference } = (await req.json()) as { reference?: string };
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.includes("replace")) {
    // Dev mode: mark paid without calling Paystack
    await prisma.order.updateMany({
      where: { reference },
      data: { status: "paid", paystackRef: reference },
    });
    return NextResponse.json({ verified: true, mode: "dev" });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const data = await res.json();
  if (!data.status || data.data?.status !== "success") {
    return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { reference } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.total !== data.data.amount) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "paid", paystackRef: reference },
  });

  return NextResponse.json({ verified: true });
}
