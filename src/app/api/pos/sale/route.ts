import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOnHand, nextReceiptNumber, recordSaleMovement } from "@/lib/stock";
import { normalizeGhPhone, resolveTillPrice } from "@/lib/site";

type PayMethod = "momo" | "cash" | "bank";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    sessionId?: string;
    idempotencyKey?: string;
    paymentMethod?: PayMethod | "split";
    momoRef?: string;
    bankRef?: string;
    cashPesewas?: number;
    momoPesewas?: number;
    bankPesewas?: number;
    customerName?: string;
    customerPhone?: string;
    tendered?: number;
    items?: {
      variantId: string;
      quantity: number;
      unitPrice: number;
    }[];
  };

  if (!body.sessionId || !body.idempotencyKey || !body.items?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const name = body.customerName?.trim() || "";
  const phoneRaw = body.customerPhone?.trim() || "";
  let phone: string | null = null;
  if (phoneRaw) {
    phone = normalizeGhPhone(phoneRaw);
    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid Ghana phone (e.g. 0549092316)" },
        { status: 400 },
      );
    }
  }
  if (name && !phone) {
    return NextResponse.json(
      { error: "Phone is required when a customer name is set" },
      { status: 400 },
    );
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
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json(
        { error: "Each line needs quantity ≥ 1" },
        { status: 400 },
      );
    }
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
    const expected = resolveTillPrice(
      variant.product.channel,
      variant.retailPrice,
      variant.wholesalePrice,
    );
    if (expected == null || expected !== item.unitPrice) {
      return NextResponse.json(
        { error: `Price mismatch for ${variant.sku}` },
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

  let cashPesewas = Math.max(0, Math.round(body.cashPesewas ?? 0));
  let momoPesewas = Math.max(0, Math.round(body.momoPesewas ?? 0));
  let bankPesewas = Math.max(0, Math.round(body.bankPesewas ?? 0));

  // Single-method shorthand: put full total on that method
  if (
    body.paymentMethod &&
    body.paymentMethod !== "split" &&
    cashPesewas + momoPesewas + bankPesewas === 0
  ) {
    if (body.paymentMethod === "cash") cashPesewas = subtotal;
    else if (body.paymentMethod === "momo") momoPesewas = subtotal;
    else if (body.paymentMethod === "bank") bankPesewas = subtotal;
  }

  const paidSum = cashPesewas + momoPesewas + bankPesewas;
  if (paidSum !== subtotal) {
    return NextResponse.json(
      {
        error: `Payments must total ${subtotal} pesewas (got ${paidSum})`,
      },
      { status: 400 },
    );
  }

  const methodsUsed = [
    cashPesewas > 0 ? "cash" : null,
    momoPesewas > 0 ? "momo" : null,
    bankPesewas > 0 ? "bank" : null,
  ].filter(Boolean) as PayMethod[];

  if (methodsUsed.length === 0) {
    return NextResponse.json({ error: "Add a payment amount" }, { status: 400 });
  }

  const paymentMethod: PayMethod | "split" =
    methodsUsed.length > 1 ? "split" : methodsUsed[0];

  const oversellNotes = lineData
    .filter((l) => l.quantity > l.onHand)
    .map((l) => `${l.sku}: sold ${l.quantity}, on-hand ${l.onHand}`);

  const tendered =
    cashPesewas > 0
      ? Math.max(body.tendered ?? cashPesewas, cashPesewas)
      : body.tendered ?? subtotal;
  const changeGiven =
    cashPesewas > 0 ? Math.max(0, tendered - cashPesewas) : 0;

  const paymentRef =
    [body.momoRef?.trim(), body.bankRef?.trim()].filter(Boolean).join(" · ") ||
    null;

  let customerId: string | null = null;
  if (phone && name) {
    const customer = await prisma.customer.upsert({
      where: { phone },
      create: { name, phone },
      update: { name },
    });
    customerId = customer.id;
  }

  const receiptNumber = await nextReceiptNumber();

  const sale = await prisma.sale.create({
    data: {
      sessionId: body.sessionId,
      receiptNumber,
      paymentMethod,
      momoRef: paymentRef,
      cashPesewas,
      momoPesewas,
      bankPesewas,
      customerId,
      customerName: name || null,
      customerPhone: phone,
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
