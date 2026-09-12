import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function authorized(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  return pwd && pwd === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [products, orders] = await Promise.all([
    prisma.product.findMany({
      include: { variants: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return NextResponse.json({ products, orders });
}
