import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeGhPhone } from "@/lib/site";
import { recordReturnMovement } from "@/lib/stock";

type ReturnLine = { lineId: string; quantity: number };

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      lines: true,
      servedBy: true,
      session: true,
      customer: true,
    },
  });
  if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ sale });
}

/** Update customer / payment reference on a completed sale. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (sale.status !== "completed") {
    return NextResponse.json(
      { error: "Only completed sales can be modified" },
      { status: 400 },
    );
  }

  const body = (await req.json()) as {
    customerName?: string;
    customerPhone?: string;
    paymentRef?: string;
  };

  const name = body.customerName?.trim() ?? sale.customerName ?? "";
  const phoneRaw = body.customerPhone?.trim() ?? sale.customerPhone ?? "";
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

  let customerId = sale.customerId;
  if (phone && name) {
    const customer = await prisma.customer.upsert({
      where: { phone },
      create: { name, phone },
      update: { name },
    });
    customerId = customer.id;
  } else if (!phone) {
    customerId = null;
  }

  const updated = await prisma.sale.update({
    where: { id },
    data: {
      customerId,
      customerName: name || null,
      customerPhone: phone,
      momoRef:
        body.paymentRef !== undefined
          ? body.paymentRef.trim() || null
          : sale.momoRef,
    },
    include: { lines: true, servedBy: true },
  });

  return NextResponse.json({ sale: updated });
}

/** Full or partial return — restocks inventory. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = (await req.json()) as {
    action?: "return" | "void";
    note?: string;
    lines?: ReturnLine[];
  };

  if (body.action !== "return" && body.action !== "void") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: { lines: true },
  });
  if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (sale.status !== "completed") {
    return NextResponse.json(
      { error: "Sale is already " + sale.status },
      { status: 400 },
    );
  }

  const note = body.note?.trim() || null;
  const returnMap = new Map<string, number>();

  if (body.lines?.length) {
    for (const row of body.lines) {
      const line = sale.lines.find((l) => l.id === row.lineId);
      if (!line) {
        return NextResponse.json(
          { error: `Unknown line ${row.lineId}` },
          { status: 400 },
        );
      }
      const qty = Math.round(row.quantity);
      const remaining = line.quantity - line.returnedQty;
      if (!Number.isInteger(qty) || qty < 1 || qty > remaining) {
        return NextResponse.json(
          {
            error: `Return qty for ${line.sku} must be 1–${remaining}`,
          },
          { status: 400 },
        );
      }
      returnMap.set(line.id, qty);
    }
  } else {
    // Full return of remaining qty on every line
    for (const line of sale.lines) {
      const remaining = line.quantity - line.returnedQty;
      if (remaining > 0) returnMap.set(line.id, remaining);
    }
  }

  if (returnMap.size === 0) {
    return NextResponse.json({ error: "Nothing left to return" }, { status: 400 });
  }

  for (const line of sale.lines) {
    const qty = returnMap.get(line.id);
    if (!qty) continue;
    await recordReturnMovement({
      variantId: line.variantId,
      quantity: qty,
      unitCostPesewas: line.costStamped,
      refId: sale.id,
      note: `${body.action === "void" ? "Void" : "Return"} ${sale.receiptNumber}`,
      createdById: user.id,
    });
    await prisma.saleLine.update({
      where: { id: line.id },
      data: { returnedQty: line.returnedQty + qty },
    });
  }

  const refreshed = await prisma.sale.findUniqueOrThrow({
    where: { id },
    include: { lines: true },
  });
  const allReturned = refreshed.lines.every(
    (l) => l.returnedQty >= l.quantity,
  );

  const updated = await prisma.sale.update({
    where: { id },
    data: allReturned
      ? {
          status: body.action === "void" ? "voided" : "returned",
          returnNote: note,
          returnedAt: new Date(),
        }
      : {
          returnNote: note
            ? [sale.returnNote, note].filter(Boolean).join(" · ")
            : sale.returnNote,
        },
    include: {
      lines: true,
      servedBy: true,
      session: true,
    },
  });

  return NextResponse.json({ sale: updated, partial: !allReturned });
}
