import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import { StockAdjustForm } from "@/components/ops/StockAdjustForm";

export default async function AdminStockPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const [variants, movements] = await Promise.all([
    prisma.variant.findMany({
      include: { product: true },
      orderBy: [{ product: { sortOrder: "asc" } }, { size: "asc" }],
    }),
    prisma.stockMovement.findMany({
      include: { variant: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Stock</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Ledger by size
        </h1>
        <p className="mt-2 max-w-xl text-sm text-forest/60">
          Finished Yeskoko packs. Production batches add stock; till and web sales
          draw it down. Adjust with a note — do not invent numbers.
        </p>
      </div>

      <div className="overflow-x-auto border border-mist bg-white/40">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-mist bg-mist/30 text-xs uppercase tracking-wider text-forest/55">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">On hand</th>
              <th className="px-4 py-3">Avg cost</th>
              <th className="px-4 py-3">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-b border-mist/70">
                <td className="px-4 py-3">
                  <p className="font-medium">{v.product.name}</p>
                  <p className="text-xs text-forest/55">
                    {v.size} · {v.sku}
                  </p>
                </td>
                <td className="px-4 py-3 tabular-nums font-medium">{v.stock}</td>
                <td className="px-4 py-3 tabular-nums">{formatGhs(v.avgCostPesewas)}</td>
                <td className="px-4 py-3">
                  <StockAdjustForm variantId={v.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section>
        <h2 className="font-display text-2xl text-forest">Recent movements</h2>
        <ul className="mt-4 divide-y divide-mist border-t border-mist text-sm">
          {movements.map((m) => (
            <li key={m.id} className="flex flex-wrap justify-between gap-2 py-3">
              <div>
                <p className="font-medium">
                  {m.type} · {m.variant.product.name} {m.variant.size}
                </p>
                <p className="text-xs text-forest/55">
                  {m.note || m.refType || "—"} ·{" "}
                  {new Date(m.createdAt).toLocaleString("en-GH")}
                </p>
              </div>
              <p className={`tabular-nums font-medium ${m.qty < 0 ? "text-clay" : "text-forest"}`}>
                {m.qty > 0 ? `+${m.qty}` : m.qty}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
