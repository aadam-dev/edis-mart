import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { recordAdjust } from "@/lib/stock";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { variantId, qtyDelta, note } = (await req.json()) as {
    variantId?: string;
    qtyDelta?: number;
    note?: string;
  };
  if (!variantId || !qtyDelta || !note?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const movement = await recordAdjust({
    variantId,
    qtyDelta,
    note,
    createdById: user.id,
  });
  return NextResponse.json({ movement });
}
