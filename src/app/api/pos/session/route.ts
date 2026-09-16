import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await prisma.tillSession.findFirst({
    where: { status: "open" },
    orderBy: { openedAt: "desc" },
    include: {
      sales: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  const products = await prisma.product.findMany({
    where: { visible: true, channel: { in: ["retail", "wholesale"] } },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ session, products, user });
}

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    action?: "open" | "close";
    floatCash?: number;
    countedCash?: number;
  };

  if (body.action === "open") {
    const existing = await prisma.tillSession.findFirst({
      where: { status: "open" },
    });
    if (existing) {
      return NextResponse.json({ session: existing });
    }
    const session = await prisma.tillSession.create({
      data: {
        floatCash: body.floatCash ?? 0,
        openedById: user.id,
        status: "open",
      },
    });
    return NextResponse.json({ session });
  }

  if (body.action === "close") {
    const session = await prisma.tillSession.findFirst({
      where: { status: "open" },
      include: { sales: true },
    });
    if (!session) {
      return NextResponse.json({ error: "No open session" }, { status: 400 });
    }
    const cashSales = session.sales
      .filter((s) => s.paymentMethod === "cash")
      .reduce((sum, s) => sum + s.total, 0);
    const expectedCash = session.floatCash + cashSales;
    const closed = await prisma.tillSession.update({
      where: { id: session.id },
      data: {
        status: "closed",
        closedAt: new Date(),
        countedCash: body.countedCash ?? expectedCash,
        expectedCash,
      },
    });
    return NextResponse.json({ session: closed });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
