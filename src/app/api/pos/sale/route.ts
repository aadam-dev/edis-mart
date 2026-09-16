import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOnHand, nextReceiptNumber, recordSaleMovement } from "@/lib/stock";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    sessionId?: string;
    idempotencyKey?: string;
    paymentMethod?: "momo" | "cash" | "other";
    momoRef?: string;
    customerName?: string;
    customerPhone?: string;
    tendered?: number;
    items?: {
      variantId: string;
      quantity: number;
      unitPrice: number;
    }[];
  };

  if (
    !body.sessionId ||
    !body.idempotencyKey ||
    !body.paymentMethod ||
    !body.items?.length
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (body.paymentMethod === "momo" && !body.momoRef?.trim()) {
    return NextResponse.json({ error: "MoMo reference required" }, { status: 400 });
  }

  const existing = await prisma.sale.findUnique({
    where: { idempotencyKey: body.idempotencyKey },
    include: { lines: true },
  });
  if (existing) {
    return NextResponse.json({ sale: existing, replayed: true });
  }

  const session = await prisma.tillSession.findUnique({
    where: { id: body.sessionId },
  });
  if (!session || session.status !== "open") {
    return NextResponse.json({ error: "Till session not open" }, { status: 400 });
  }

  const lineData: {
    variantId: string;
    productName: string;
    size: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    costStamped: number;
    onHand: number;
  }[] = [];

  for (const item of body.items) {
    const variant = await prisma.variant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    });
    if (!variant) {
      return NextResponse.json(
        { error: `Unknown variant ${item.variantId}` },
        { status: 400 },
      );
    }
    const onHand = await getOnHand(variant.id);
    lineData.push({
      variantId: variant.id,
      productName: variant.product.name,
      size: variant.size,
      sku: variant.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.quantity,
      costStamped: variant.avgCostPesewas,
      onHand,
    });
  }

  const subtotal = lineData.reduce((s, l) => s + l.lineTotal, 0);
  const oversellNotes = lineData
    .filter((l) => l.quantity > l.onHand)
    .map(
      (l) =>
        `${l.sku}: sold ${l.quantity}, on-hand ${l.onHand}`,
    );
  const tendered = body.tendered ?? subtotal;
  const changeGiven =
    body.paymentMethod === "cash" ? Math.max(0, tendered - subtotal) : 0;

  const receiptNumber = await nextReceiptNumber();

  const sale = await prisma.sale.create({
    data: {
      sessionId: body.sessionId,
      receiptNumber,
      paymentMethod: body.paymentMethod,
      momoRef: body.momoRef || null,
      customerName: body.customerName || null,
      customerPhone: body.customerPhone || null,
      subtotal,
      total: subtotal,
      tendered,
      changeGiven,
      oversellNote: oversellNotes.length ? oversellNotes.join("; ") : null,
      idempotencyKey: body.idempotencyKey,
      servedById: user.id,
      lines: {
        create: lineData.map((l) => ({
          variantId: l.variantId,
          productName: l.productName,
          size: l.size,
          sku: l.sku,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          lineTotal: l.lineTotal,
          costStamped: l.costStamped,
        })),
      },
    },
    include: { lines: true },
  });

  for (const line of lineData) {
    await recordSaleMovement({
      variantId: line.variantId,
      quantity: line.quantity,
      unitCostPesewas: line.costStamped,
      refType: "sale",
      refId: sale.id,
      note: `Till ${sale.receiptNumber}`,
      createdById: user.id,
    });
  }

  return NextResponse.json({ sale, oversell: oversellNotes.length > 0 });
}
