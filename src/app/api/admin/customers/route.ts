import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeGhPhone } from "@/lib/site";

export async function GET(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q.replace(/\s/g, "") } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ customers });
}

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    name?: string;
    phone?: string;
    note?: string;
  };

  const name = body.name?.trim() || "";
  const phone = normalizeGhPhone(body.phone || "");
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json(
      { error: "Valid Ghana phone required (e.g. 0549092316)" },
      { status: 400 },
    );
  }

  const customer = await prisma.customer.upsert({
    where: { phone },
    create: {
      name,
      phone,
      note: body.note?.trim() || null,
    },
    update: {
      name,
      note: body.note?.trim() || undefined,
    },
  });

  return NextResponse.json({ customer });
}
