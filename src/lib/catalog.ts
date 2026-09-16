import { prisma } from "@/lib/prisma";
import { catalog as staticCatalog, type CatalogProduct } from "@/data/catalog";

export type StoreProduct = CatalogProduct & {
  visible?: boolean;
  dbId?: string;
  variants: (CatalogProduct["variants"][number] & {
    id?: string;
    avgCostPesewas?: number;
  })[];
};

function mapDbProduct(p: {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  skuBase: string;
  channel: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  variants: {
    id: string;
    size: string;
    sku: string;
    retailPrice: number | null;
    wholesalePrice: number | null;
    stock: number;
    avgCostPesewas: number;
  }[];
}): StoreProduct {
  return {
    id: p.id,
    dbId: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    image: p.image,
    skuBase: p.skuBase,
    channel: p.channel as StoreProduct["channel"],
    featured: p.featured,
    visible: p.visible,
    sortOrder: p.sortOrder,
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      sku: v.sku,
      retailPrice: v.retailPrice,
      wholesalePrice: v.wholesalePrice,
      stock: v.stock,
      avgCostPesewas: v.avgCostPesewas,
    })),
  };
}

export async function getProductsFromDb(opts?: {
  includeHidden?: boolean;
}): Promise<StoreProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: opts?.includeHidden ? undefined : { visible: true },
      include: { variants: { orderBy: { size: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length) return rows.map(mapDbProduct);
  } catch {
    // fall through to static
  }
  return staticCatalog.map((p) => ({ ...p, visible: true }));
}

export async function getFeaturedProductsFromDb() {
  const products = await getProductsFromDb();
  return products.filter((p) => p.featured);
}

export async function getProductFromDb(slug: string) {
  try {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: { variants: { orderBy: { size: "asc" } } },
    });
    if (row) return mapDbProduct(row);
  } catch {
    // fall through
  }
  return staticCatalog.find((p) => p.slug === slug) ?? null;
}

export async function getVariantBySkuFromDb(sku: string) {
  try {
    const variant = await prisma.variant.findUnique({
      where: { sku },
      include: { product: true },
    });
    if (variant) {
      return {
        product: mapDbProduct({
          ...variant.product,
          variants: [variant],
        }),
        variant: {
          id: variant.id,
          size: variant.size,
          sku: variant.sku,
          retailPrice: variant.retailPrice,
          wholesalePrice: variant.wholesalePrice,
          stock: variant.stock,
          avgCostPesewas: variant.avgCostPesewas,
        },
      };
    }
  } catch {
    // fall through
  }
  for (const product of staticCatalog) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return null;
}
