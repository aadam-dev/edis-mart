import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.includes("replace")) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const hash = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    data: { reference: string; status: string; amount: number };
  };

  if (event.event === "charge.success" && event.data.status === "success") {
    const order = await prisma.order.findUnique({
      where: { reference: event.data.reference },
    });
    if (order && order.total === event.data.amount) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "paid",
          paystackRef: event.data.reference,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
