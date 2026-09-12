import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function authorized(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  return pwd && pwd === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderId, status } = await req.json();
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return NextResponse.json({ ok: true });
}
