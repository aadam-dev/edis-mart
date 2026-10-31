import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOpsUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "reviewing", "replied", "closed"]),
  ownerNotes: z.string().max(4000).optional(),
});

export async function PATCH(request: Request) {
  const user = await requireOpsUser();
  if (!user || !can(user, "trade.manage")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const updated = await prisma.tradeInquiry.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      ...(parsed.data.ownerNotes != null
        ? { ownerNotes: parsed.data.ownerNotes }
        : {}),
    },
  });
  await prisma.auditEvent.create({
    data: {
      actorId: user.id,
      actorEmail: user.email,
      action: "trade_inquiry.status",
      entityType: "TradeInquiry",
      entityId: updated.id,
      metadata: JSON.stringify({ status: updated.status }),
    },
  });
  return NextResponse.json({ ok: true });
}
