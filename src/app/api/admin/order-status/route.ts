import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";

function authorized(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  return pwd && pwd === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderId, status } = await req.json();
  const updated = updateOrderStatus(orderId, status);
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
