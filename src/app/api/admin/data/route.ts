import { NextResponse } from "next/server";
import { requireOpsUser } from "@/lib/auth";
import { getProductsFromDb } from "@/lib/catalog";
import { listOrders } from "@/lib/orders";

export async function GET() {
  const user = await requireOpsUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await getProductsFromDb({ includeHidden: true });
  return NextResponse.json({
    products,
    orders: await listOrders(),
  });
}
