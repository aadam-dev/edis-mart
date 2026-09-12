import { NextResponse } from "next/server";
import { getProducts } from "@/data/catalog";
import { listOrders } from "@/lib/orders";

function authorized(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  return pwd && pwd === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = getProducts().map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    channel: p.channel,
    variants: p.variants.map((v, i) => ({
      id: `${p.id}-${i}`,
      size: v.size,
      sku: v.sku,
      retailPrice: v.retailPrice,
      wholesalePrice: v.wholesalePrice,
      stock: v.stock,
    })),
  }));
  return NextResponse.json({ products, orders: listOrders() });
}
