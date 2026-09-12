import { NextResponse } from "next/server";
import { getOrderRecord, markOrderPaid } from "@/lib/orders";

export async function POST(req: Request) {
  const { reference } = (await req.json()) as { reference?: string };
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.includes("replace")) {
    const updated = markOrderPaid(reference);
    return NextResponse.json({ verified: true, mode: "dev", order: updated });
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );
  const data = await res.json();
  if (!data.status || data.data?.status !== "success") {
    return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
  }

  const order = getOrderRecord(reference);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.total !== data.data.amount) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  const updated = markOrderPaid(reference);
  return NextResponse.json({ verified: true, order: updated });
}
