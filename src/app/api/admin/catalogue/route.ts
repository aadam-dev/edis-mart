import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, visible } = (await req.json()) as {
    productId?: string;
    visible?: boolean;
  };
  if (!productId || typeof visible !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { visible },
  });
  return NextResponse.json({ product });
}
