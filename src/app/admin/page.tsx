import { redirect } from "next/navigation";
import Link from "next/link";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";

export default async function AdminTodayPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const [orders, lowStock, openSession, todaySales] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: ["pending", "pending_cod", "paid"] } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.variant.findMany({
      where: { stock: { lte: 10 }, product: { channel: { not: "inquiry" } } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.tillSession.findFirst({
      where: { status: "open" },
      orderBy: { openedAt: "desc" },
    }),
    prisma.sale.aggregate({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      _sum: { total: true },
      _count: true,
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Today</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest md:text-5xl">
          Ops desk
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-mist bg-white/50 p-5">
          <p className="text-xs uppercase tracking-wider text-forest/50">Open till</p>
          <p className="mt-2 font-display text-2xl text-forest">
            {openSession ? "Session open" : "No session"}
          </p>
          <Link href="/pos" className="mt-3 inline-block text-sm font-semibold text-clay">
            {openSession ? "Go to till" : "Open till"} →
          </Link>
        </div>
        <div className="border border-mist bg-white/50 p-5">
          <p className="text-xs uppercase tracking-wider text-forest/50">Till sales today</p>
          <p className="mt-2 font-display text-2xl tabular-nums text-forest">
            {formatGhs(todaySales._sum.total ?? 0)}
          </p>
          <p className="mt-1 text-sm text-forest/55">{todaySales._count} sales</p>
        </div>
        <div className="border border-mist bg-white/50 p-5">
          <p className="text-xs uppercase tracking-wider text-forest/50">Unfulfilled online</p>
          <p className="mt-2 font-display text-2xl tabular-nums text-forest">
            {orders.length}
          </p>
          <Link href="/admin/orders" className="mt-3 inline-block text-sm font-semibold text-clay">
            View orders →
          </Link>
        </div>
      </div>

      <section>
        <h2 className="font-display text-2xl text-forest">Online queue</h2>
        <ul className="mt-4 divide-y divide-mist border-t border-mist">
          {orders.length === 0 && (
            <li className="py-4 text-sm text-forest/55">No open online orders.</li>
          )}
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-medium text-forest">{o.customerName}</p>
                <p className="text-forest/55">
                  {o.reference} · {o.paymentMethod} · {o.status}
                </p>
              </div>
              <p className="tabular-nums font-medium">{formatGhs(o.total)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-forest">Low stock</h2>
        <ul className="mt-4 divide-y divide-mist border-t border-mist">
          {lowStock.length === 0 && (
            <li className="py-4 text-sm text-forest/55">All sizes above 10 units.</li>
          )}
          {lowStock.map((v) => (
            <li key={v.id} className="flex justify-between py-3 text-sm">
              <span>
                {v.product.name} · {v.size}
              </span>
              <span className={`tabular-nums font-medium ${v.stock <= 0 ? "text-clay" : "text-mango"}`}>
                {v.stock}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
