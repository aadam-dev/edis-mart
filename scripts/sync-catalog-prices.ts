import { PrismaClient } from "@prisma/client";
import { catalog } from "../src/data/catalog";

const prisma = new PrismaClient();

const costs: Record<string, number> = {
  "YK-SCF-50": 800,
  "YK-SCF-100": 1600,
  "YK-SCF-250": 4000,
  "YK-SCF-700": 9000,
  "YK-CCC-100": 2200,
  "YK-CCC-250": 5500,
  "YK-PC-100": 1800,
  "YK-MC-100": 1800,
  "YK-UCF-250": 3800,
  "YK-UCF-700": 7500,
  "YK-UCF-1K": 11000,
};

const retireSkus = [
  "YK-CCC-700",
  "YK-CCC-1K",
  "YK-MC-1K",
  "YK-PC-250",
  "YK-PC-700",
];

async function main() {
  const existing = await prisma.product.count();
  console.log("products", existing);
  if (!existing) {
    console.log("No DB products; static catalog will serve.");
    return;
  }

  for (const p of catalog) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        image: p.image,
        skuBase: p.skuBase,
        channel: p.channel,
        featured: p.featured,
        visible: true,
        sortOrder: p.sortOrder,
      },
      update: {
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        image: p.image,
        skuBase: p.skuBase,
        channel: p.channel,
        featured: p.featured,
        sortOrder: p.sortOrder,
      },
    });

    const keepSkus = new Set(p.variants.map((v) => v.sku));
    for (const v of p.variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        create: {
          productId: product.id,
          size: v.size,
          sku: v.sku,
          retailPrice: v.retailPrice,
          wholesalePrice: v.wholesalePrice,
          avgCostPesewas: costs[v.sku] ?? 0,
          stock: v.stock,
        },
        update: {
          productId: product.id,
          size: v.size,
          retailPrice: v.retailPrice,
          wholesalePrice: v.wholesalePrice,
          avgCostPesewas: costs[v.sku] ?? 0,
        },
      });
    }

    const orphans = await prisma.variant.findMany({
      where: { productId: product.id, sku: { notIn: [...keepSkus] } },
    });
    for (const o of orphans) {
      await prisma.variant.update({
        where: { id: o.id },
        data: { retailPrice: null, wholesalePrice: null, stock: 0 },
      });
      console.log("retired variant", o.sku);
    }
  }

  for (const sku of retireSkus) {
    const v = await prisma.variant.findUnique({ where: { sku } });
    if (v) {
      await prisma.variant.update({
        where: { sku },
        data: { retailPrice: null, wholesalePrice: null, stock: 0 },
      });
      console.log("retired", sku);
    }
  }

  const rows = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { sortOrder: "asc" },
  });
  for (const r of rows) {
    console.log(
      r.slug,
      r.channel,
      r.featured,
      r.variants
        .map((v) => `${v.sku}:${v.retailPrice}/${v.wholesalePrice}`)
        .join(", "),
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
