import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AdminReportsPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "owner") redirect("/admin");

  const since30 = daysAgo(30);
  const since7 = daysAgo(7);
  const since1 = daysAgo(0);

  const [tillSales, webOrders, saleLines, variants] = await Promise.all([
    prisma.sale.findMany({
      where: { createdAt: { gte: since30 } },
      include: { lines: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: since30 },
        status: { in: ["paid", "fulfilled"] },
      },
      include: { items: true },
    }),
    prisma.saleLine.findMany({
      where: { sale: { createdAt: { gte: since30 } } },
      include: { variant: { include: { product: true } } },
    }),
    prisma.variant.findMany({ include: { product: true } }),
  ]);

  const sumInRange = (
    rows: { createdAt: Date; total: number }[],
    since: Date,
  ) =>
    rows
      .filter((r) => r.createdAt >= since)
      .reduce((s, r) => s + r.total, 0);

  const tillToday = sumInRange(tillSales, since1);
  const till7 = sumInRange(tillSales, since7);
  const till30 = sumInRange(tillSales, since30);
  const webToday = sumInRange(webOrders, since1);
  const web7 = sumInRange(webOrders, since7);
  const web30 = sumInRange(webOrders, since30);

  let tillCost = 0;
  let tillRevenue = 0;
  const bySku = new Map<
    string,
    { name: string; units: number; revenue: number; cost: number }
  >();

  for (const line of saleLines) {
    tillRevenue += line.lineTotal;
    tillCost += line.costStamped * line.quantity;
    const key = line.sku;
    const cur = bySku.get(key) || {
      name: `${line.productName} ${line.size}`,
      units: 0,
      revenue: 0,
      cost: 0,
    };
    cur.units += line.quantity;
    cur.revenue += line.lineTotal;
    cur.cost += line.costStamped * line.quantity;
    bySku.set(key, cur);
  }

  const skuRows = [...bySku.values()]
    .map((r) => ({
      ...r,
      margin: r.revenue - r.cost,
    }))
    .sort((a, b) => b.margin - a.margin);

  const stockValue = variants.reduce(
    (s, v) => s + Math.max(0, v.stock) * v.avgCostPesewas,
    0,
  );

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Reports</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Owner P&L lens
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Today", tillToday, webToday],
          ["7 days", till7, web7],
          ["30 days", till30, web30],
        ].map(([label, till, web]) => (
          <div key={String(label)} className="border border-mist bg-white/40 p-5">
            <p className="text-xs uppercase tracking-wider text-forest/50">{label}</p>
            <p className="mt-2 font-display text-2xl tabular-nums text-forest">
              {formatGhs(Number(till) + Number(web))}
            </p>
            <p className="mt-2 text-xs text-forest/55">
              Till {formatGhs(Number(till))} · Web {formatGhs(Number(web))}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-mist bg-white/40 p-5">
          <p className="text-xs uppercase tracking-wider text-forest/50">
            Till gross profit (30d stamped cost)
          </p>
          <p className="mt-2 font-display text-3xl tabular-nums text-forest">
            {formatGhs(tillRevenue - tillCost)}
          </p>
          <p className="mt-1 text-sm text-forest/55">
            Revenue {formatGhs(tillRevenue)} · Cost {formatGhs(tillCost)}
          </p>
        </div>
        <div className="border border-mist bg-white/40 p-5">
          <p className="text-xs uppercase tracking-wider text-forest/50">
            Stock value at cost
          </p>
          <p className="mt-2 font-display text-3xl tabular-nums text-forest">
            {formatGhs(stockValue)}
          </p>
        </div>
      </div>

      <section>
        <h2 className="font-display text-2xl text-forest">Best SKUs by margin</h2>
        <ul className="mt-4 divide-y divide-mist border-t border-mist text-sm">
          {skuRows.slice(0, 10).map((r) => (
            <li key={r.name} className="flex justify-between gap-3 py-3">
              <span>
                {r.name} · {r.units} units
              </span>
              <span className="tabular-nums font-medium">{formatGhs(r.margin)}</span>
            </li>
          ))}
          {skuRows.length === 0 && (
            <li className="py-4 text-forest/55">No till sales in the last 30 days.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
