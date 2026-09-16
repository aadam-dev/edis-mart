import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordSaleMovement } from "@/lib/stock";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, status } = (await req.json()) as {
    orderId?: string;
    status?: string;
  };
  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });

  // COD / WhatsApp: deduct stock when marked fulfilled (if not already paid-sold)
  if (
    status === "fulfilled" &&
    existing.status !== "fulfilled" &&
    existing.status !== "paid"
  ) {
    for (const item of order.items) {
      if (!item.variantId) continue;
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
      });
      if (!variant) continue;
      await recordSaleMovement({
        variantId: item.variantId,
        quantity: item.quantity,
        unitCostPesewas: variant.avgCostPesewas,
        refType: "order",
        refId: order.id,
        note: `Fulfilled ${order.reference}`,
        createdById: user.id,
      });
    }
  }

  return NextResponse.json({ order });
}
