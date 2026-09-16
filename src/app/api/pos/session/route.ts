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
      sales: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  const products = await prisma.product.findMany({
    where: { visible: true, channel: { in: ["retail", "wholesale"] } },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  let expectedCash: number | null = null;
  if (session) {
    const cashFromSales = session.sales.reduce((sum, s) => {
      if (s.status === "returned" || s.status === "voided") return sum;
      if (s.cashPesewas > 0) return sum + s.cashPesewas;
      // Legacy rows before split columns
      if (s.paymentMethod === "cash") return sum + s.total;
      return sum;
    }, 0);
    expectedCash = session.floatCash + cashFromSales;
  }

  return NextResponse.json({ session, products, user, expectedCash });
}

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    action?: "open" | "close";
    floatCash?: number;
    countedCash?: number;
    sessionId?: string;
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
    if (!body.sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }
    const session = await prisma.tillSession.findUnique({
      where: { id: body.sessionId },
      include: { sales: true },
    });
    if (!session || session.status !== "open") {
      return NextResponse.json({ error: "No open session" }, { status: 400 });
    }
    const cashFromSales = session.sales.reduce((sum, s) => {
      if (s.status === "returned" || s.status === "voided") return sum;
      if (s.cashPesewas > 0) return sum + s.cashPesewas;
      if (s.paymentMethod === "cash") return sum + s.total;
      return sum;
    }, 0);
    const expectedCash = session.floatCash + cashFromSales;
    const closed = await prisma.tillSession.update({
      where: { id: session.id },
      data: {
        status: "closed",
        closedAt: new Date(),
        countedCash: body.countedCash ?? expectedCash,
        expectedCash,
      },
    });
    return NextResponse.json({ session: closed, expectedCash });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
