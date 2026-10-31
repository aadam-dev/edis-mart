/**
 * Read-only integrity checks for commerce ledger.
 * Usage: npx tsx scripts/reconcile-data.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [
    products,
    variants,
    orders,
    sales,
    movements,
    purchases,
    partners,
    inquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.variant.count(),
    prisma.order.count(),
    prisma.sale.count(),
    prisma.stockMovement.count(),
    prisma.purchase.count(),
    prisma.partner.count().catch(() => 0),
    prisma.tradeInquiry.count().catch(() => 0),
  ]);

  console.log("Counts", {
    products,
    variants,
    orders,
    sales,
    movements,
    purchases,
    partners,
    inquiries,
  });

  const variantsWithStock = await prisma.variant.findMany({
    select: { id: true, sku: true, stock: true },
  });
  let mismatches = 0;
  for (const v of variantsWithStock) {
    const agg = await prisma.stockMovement.aggregate({
      where: { variantId: v.id },
      _sum: { qty: true },
    });
    const sum = agg._sum.qty ?? 0;
    if (sum !== v.stock) {
      mismatches += 1;
      console.warn(`Stock mismatch ${v.sku}: cache=${v.stock} ledger=${sum}`);
    }
  }
  console.log(mismatches === 0 ? "Stock ledger OK" : `Stock mismatches: ${mismatches}`);

  const badSales = await prisma.sale.findMany({
    include: { lines: true },
    take: 500,
  });
  let saleIssues = 0;
  for (const s of badSales) {
    const lineTotal = s.lines.reduce((a, l) => a + l.lineTotal, 0);
    if (lineTotal !== s.subtotal && lineTotal !== s.total) {
      // soft check — subtotal may equal lines
      if (lineTotal !== s.subtotal) {
        saleIssues += 1;
        console.warn(`Sale ${s.receiptNumber} line sum ${lineTotal} vs subtotal ${s.subtotal}`);
      }
    }
  }
  console.log(saleIssues === 0 ? "Sale line totals OK (sampled)" : `Sale issues: ${saleIssues}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
