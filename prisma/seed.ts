import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const products = [
  {
    slug: "yeskoko-sweetened-coconut-flakes",
    name: "Yeskoko sweetened coconut flakes",
    tagline: "Soft sweetness, real coconut crunch.",
    description:
      "Snack from the pouch or fold into breakfast. No preservatives. Dried and packed in Ghana.",
    image: "/products/yeskoko.jpg",
    skuBase: "YK-SCF",
    channel: "retail",
    featured: true,
    sortOrder: 1,
    variants: [
      { size: "50g", sku: "YK-SCF-50", retailPrice: 1500, wholesalePrice: 1200, cost: 800 },
      { size: "100g", sku: "YK-SCF-100", retailPrice: 3000, wholesalePrice: 2500, cost: 1600 },
      { size: "250g", sku: "YK-SCF-250", retailPrice: 7500, wholesalePrice: 6500, cost: 4000 },
      { size: "700g", sku: "YK-SCF-700", retailPrice: 15000, wholesalePrice: 13000, cost: 9000 },
    ],
  },
  {
    slug: "unsweetened-coconut-flakes",
    name: "Unsweetened coconut flakes",
    tagline: "Clean coconut for bowls and baking.",
    description:
      "The fruit without the sugar. Ideal for cooking, granola, and everyday snacking.",
    image: "/products/coconut-banner.jpg",
    skuBase: "YK-UCF",
    channel: "retail",
    featured: true,
    sortOrder: 2,
    variants: [
      { size: "250g", sku: "YK-UCF-250", retailPrice: 7500, wholesalePrice: 6500, cost: 3800 },
      { size: "700g", sku: "YK-UCF-700", retailPrice: 13000, wholesalePrice: 13000, cost: 7500 },
      { size: "1kg", sku: "YK-UCF-1K", retailPrice: null, wholesalePrice: 20000, cost: 11000 },
    ],
  },
  {
    slug: "mango-chips",
    name: "Mango chips",
    tagline: "Sun-ripened mango, gently dried.",
    description:
      "Tangy, chewy mango chips with no additives. A bright Ghana snack from 100g to 1kg.",
    image: "/products/mango.jpg",
    skuBase: "YK-MC",
    channel: "retail",
    featured: true,
    sortOrder: 3,
    variants: [
      { size: "100g", sku: "YK-MC-100", retailPrice: 3500, wholesalePrice: null, cost: 1800 },
      { size: "1kg", sku: "YK-MC-1K", retailPrice: 35000, wholesalePrice: null, cost: 18000 },
    ],
  },
  {
    slug: "chia-chia-coco",
    name: "Chia chia coco",
    tagline: "Wholesale coconut blend for kitchens that buy by the kilo.",
    description:
      "Built for retailers and food service. Message us for volume pricing and delivery.",
    image: "/products/chia.jpg",
    skuBase: "YK-CCC",
    channel: "wholesale",
    featured: false,
    sortOrder: 4,
    variants: [
      { size: "100g", sku: "YK-CCC-100", retailPrice: null, wholesalePrice: 4000, cost: 2200 },
      { size: "250g", sku: "YK-CCC-250", retailPrice: null, wholesalePrice: 10000, cost: 5500 },
      { size: "700g", sku: "YK-CCC-700", retailPrice: null, wholesalePrice: 17000, cost: 9500 },
      { size: "1kg", sku: "YK-CCC-1K", retailPrice: null, wholesalePrice: 25000, cost: 14000 },
    ],
  },
  {
    slug: "pineapple-chips",
    name: "Pineapple chips",
    tagline: "Sweet-tangy chips from real pineapple.",
    description:
      "Packaging is ready. Tell us the size you need and we will quote a batch.",
    image: "/products/coconut-banner.jpg",
    skuBase: "YK-PC",
    channel: "inquiry",
    featured: false,
    sortOrder: 5,
    variants: [
      { size: "250g", sku: "YK-PC-250", retailPrice: null, wholesalePrice: null, cost: 0 },
      { size: "700g", sku: "YK-PC-700", retailPrice: null, wholesalePrice: null, cost: 0 },
    ],
  },
];

async function main() {
  await prisma.saleLine.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.tillSession.deleteMany();
  await prisma.purchaseLine.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.receiptCounter.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "admin@edismart.com",
      name: "Edis Mart Admin",
      passwordHash: hashPassword("admintest"),
      role: "owner",
    },
  });

  await prisma.user.create({
    data: {
      email: "mavis@edismart.com",
      name: "Mavis Walker Blagodzi",
      passwordHash: hashPassword("yeskoko123"),
      role: "owner",
    },
  });

  const owner = admin;

  for (const p of products) {
    const { variants, ...product } = p;
    const created = await prisma.product.create({
      data: {
        ...product,
        visible: true,
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            sku: v.sku,
            retailPrice: v.retailPrice,
            wholesalePrice: v.wholesalePrice,
            avgCostPesewas: v.cost,
            stock: 0,
          })),
        },
      },
      include: { variants: true },
    });

    for (const v of created.variants) {
      const openingQty = p.channel === "inquiry" ? 0 : 100;
      if (openingQty > 0) {
        await prisma.stockMovement.create({
          data: {
            variantId: v.id,
            type: "opening",
            qty: openingQty,
            unitCostPesewas: v.avgCostPesewas,
            refType: "adjust",
            note: "Seed opening stock",
            createdById: owner.id,
          },
        });
        await prisma.variant.update({
          where: { id: v.id },
          data: { stock: openingQty },
        });
      }
    }
  }

  await prisma.receiptCounter.create({
    data: { id: "default", year: new Date().getFullYear(), lastSeq: 0 },
  });

  await prisma.setting.createMany({
    data: [
      { key: "whatsapp", value: process.env.WHATSAPP_NUMBER || "233549092316" },
      { key: "shipping_accra", value: process.env.SHIPPING_ACCRA_FEE_PESEWAS || "2500" },
      { key: "pickup_address", value: "Accra pack house" },
      { key: "momo_note", value: "Use Paystack MoMo or till MoMo ref" },
    ],
  });

  console.log(`Seeded ${products.length} products`);
  console.log("Test logins:");
  console.log("  admin@edismart.com / admintest");
  console.log("  mavis@edismart.com / yeskoko123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
