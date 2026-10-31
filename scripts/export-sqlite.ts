/**
 * Export SQLite commerce tables to JSON for Postgres cutover.
 * Usage: npx tsx scripts/export-sqlite.ts > backups/sqlite-export.json
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const payload = {
    exportedAt: new Date().toISOString(),
    products: await prisma.product.findMany({ include: { variants: true } }),
    orders: await prisma.order.findMany({ include: { items: true } }),
    users: await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    customers: await prisma.customer.findMany(),
    stockMovements: await prisma.stockMovement.findMany(),
    purchases: await prisma.purchase.findMany({ include: { lines: true } }),
    tillSessions: await prisma.tillSession.findMany(),
    sales: await prisma.sale.findMany({ include: { lines: true } }),
    receiptCounter: await prisma.receiptCounter.findMany(),
    settings: await prisma.setting.findMany(),
    partners: await prisma.partner.findMany({
      include: { offerings: true, account: true },
    }),
    tradeInquiries: await prisma.tradeInquiry.findMany(),
    equipment: await prisma.equipmentAsset.findMany(),
    compliance: await prisma.complianceItem.findMany(),
    baselines: await prisma.businessBaseline.findMany(),
  };
  process.stdout.write(JSON.stringify(payload, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
