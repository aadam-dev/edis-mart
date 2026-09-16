import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { receivePurchase } from "@/lib/stock";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    supplier?: string;
    freightPesewas?: number;
    notes?: string;
    receiveNow?: boolean;
    lines?: { variantId: string; qty: number; unitCostPesewas: number }[];
  };

  if (!body.supplier || !body.lines?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const purchase = await prisma.purchase.create({
    data: {
      supplier: body.supplier,
      freightPesewas: body.freightPesewas ?? 0,
      notes: body.notes,
      createdById: user.id,
      status: "draft",
      lines: {
        create: body.lines.map((l) => ({
          variantId: l.variantId,
          qty: l.qty,
          unitCostPesewas: l.unitCostPesewas,
          lineTotal: l.qty * l.unitCostPesewas,
        })),
      },
    },
  });

  if (body.receiveNow) {
    await receivePurchase({ purchaseId: purchase.id, createdById: user.id });
  }

  const full = await prisma.purchase.findUnique({
    where: { id: purchase.id },
    include: { lines: true },
  });
  return NextResponse.json({ purchase: full });
}
