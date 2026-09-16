import { prisma } from "@/lib/prisma";

export type MovementType =
  | "opening"
  | "received"
  | "sold"
  | "adjusted"
  | "damaged"
  | "returned";

export async function getOnHand(variantId: string): Promise<number> {
  const agg = await prisma.stockMovement.aggregate({
    where: { variantId },
    _sum: { qty: true },
  });
  return agg._sum.qty ?? 0;
}

export async function refreshVariantStock(variantId: string) {
  const onHand = await getOnHand(variantId);
  await prisma.variant.update({
    where: { id: variantId },
    data: { stock: onHand },
  });
  return onHand;
}

async function writeMovement(input: {
  variantId: string;
  type: MovementType;
  qty: number;
  unitCostPesewas?: number | null;
  refType?: string;
  refId?: string;
  note?: string;
  createdById?: string | null;
}) {
  const movement = await prisma.stockMovement.create({
    data: {
      variantId: input.variantId,
      type: input.type,
      qty: input.qty,
      unitCostPesewas: input.unitCostPesewas ?? null,
      refType: input.refType,
      refId: input.refId,
      note: input.note,
      createdById: input.createdById ?? null,
    },
  });
  await refreshVariantStock(input.variantId);
  return movement;
}

export async function recordOpening(input: {
  variantId: string;
  qty: number;
  unitCostPesewas?: number;
  createdById?: string;
  note?: string;
}) {
  if (input.unitCostPesewas != null) {
    await prisma.variant.update({
      where: { id: input.variantId },
      data: { avgCostPesewas: input.unitCostPesewas },
    });
  }
  return writeMovement({
    variantId: input.variantId,
    type: "opening",
    qty: input.qty,
    unitCostPesewas: input.unitCostPesewas,
    refType: "adjust",
    note: input.note ?? "Opening stock",
    createdById: input.createdById,
  });
}

export async function recordAdjust(input: {
  variantId: string;
  qtyDelta: number;
  note: string;
  createdById?: string;
}) {
  return writeMovement({
    variantId: input.variantId,
    type: input.qtyDelta < 0 ? "damaged" : "adjusted",
    qty: input.qtyDelta,
    refType: "adjust",
    note: input.note,
    createdById: input.createdById,
  });
}

export async function recordSaleMovement(input: {
  variantId: string;
  quantity: number;
  unitCostPesewas: number;
  refType: "order" | "sale";
  refId: string;
  note?: string;
  createdById?: string;
}) {
  const onHand = await getOnHand(input.variantId);
  const oversell = input.quantity > onHand;
  await writeMovement({
    variantId: input.variantId,
    type: "sold",
    qty: -Math.abs(input.quantity),
    unitCostPesewas: input.unitCostPesewas,
    refType: input.refType,
    refId: input.refId,
    note:
      input.note ??
      (oversell
        ? `Oversell: sold ${input.quantity}, on-hand was ${onHand}`
        : undefined),
    createdById: input.createdById,
  });
  return { oversell, onHandBefore: onHand };
}

/** Restock units from a till return / void. */
export async function recordReturnMovement(input: {
  variantId: string;
  quantity: number;
  unitCostPesewas: number;
  refId: string;
  note?: string;
  createdById?: string;
}) {
  const qty = Math.abs(input.quantity);
  if (qty < 1) return null;
  return writeMovement({
    variantId: input.variantId,
    type: "returned",
    qty,
    unitCostPesewas: input.unitCostPesewas,
    refType: "sale",
    refId: input.refId,
    note: input.note ?? "Till return",
    createdById: input.createdById,
  });
}

export async function receivePurchase(input: {
  purchaseId: string;
  createdById?: string;
}) {
  const purchase = await prisma.purchase.findUniqueOrThrow({
    where: { id: input.purchaseId },
    include: { lines: true },
  });
  if (purchase.status === "received") {
    throw new Error("Purchase already received");
  }

  const goodsTotal = purchase.lines.reduce((s, l) => s + l.lineTotal, 0);
  const freight = purchase.freightPesewas;

  for (const line of purchase.lines) {
    const share =
      goodsTotal > 0
        ? Math.round((line.lineTotal / goodsTotal) * freight)
        : 0;
    const landedUnit =
      line.qty > 0
        ? Math.round((line.lineTotal + share) / line.qty)
        : line.unitCostPesewas;

    const variant = await prisma.variant.findUniqueOrThrow({
      where: { id: line.variantId },
    });
    const onHand = await getOnHand(line.variantId);
    const prevValue = onHand * variant.avgCostPesewas;
    const newValue = line.qty * landedUnit;
    const newQty = onHand + line.qty;
    const newAvg =
      newQty > 0 ? Math.round((prevValue + newValue) / newQty) : landedUnit;

    await prisma.variant.update({
      where: { id: line.variantId },
      data: { avgCostPesewas: newAvg },
    });

    await writeMovement({
      variantId: line.variantId,
      type: "received",
      qty: line.qty,
      unitCostPesewas: landedUnit,
      refType: "purchase",
      refId: purchase.id,
      note: `Received from ${purchase.supplier}`,
      createdById: input.createdById,
    });
  }

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { status: "received", receivedAt: new Date() },
  });
}

export async function nextReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await prisma.receiptCounter.upsert({
    where: { id: "default" },
    create: { id: "default", year, lastSeq: 1 },
    update: {},
  });

  let seq: number;
  if (counter.year !== year) {
    const updated = await prisma.receiptCounter.update({
      where: { id: "default" },
      data: { year, lastSeq: 1 },
    });
    seq = updated.lastSeq;
  } else {
    const updated = await prisma.receiptCounter.update({
      where: { id: "default" },
      data: { lastSeq: { increment: 1 } },
    });
    seq = updated.lastSeq;
  }

  return `YK-${year}-${String(seq).padStart(5, "0")}`;
}
