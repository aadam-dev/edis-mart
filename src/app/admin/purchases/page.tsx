import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import { PurchaseForm } from "@/components/ops/PurchaseForm";

export default async function AdminPurchasesPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const [purchases, variants] = await Promise.all([
    prisma.purchase.findMany({
      include: { lines: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.variant.findMany({
      include: { product: true },
      orderBy: [{ product: { sortOrder: "asc" } }, { size: "asc" }],
    }),
  ]);

  const options = variants.map((v) => ({
    id: v.id,
    label: `${v.product.name} · ${v.size} (${v.sku})`,
  }));

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Production</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Finished packs
        </h1>
        <p className="mt-2 max-w-xl text-sm text-forest/60">
          Yeskoko processes fruit into chips and flakes in-house. Record each
          production batch so finished sizes land on the stock ledger.
        </p>
      </div>

      <PurchaseForm variants={options} />

      <section>
        <h2 className="font-display text-2xl text-forest">Batch history</h2>
        <ul className="mt-4 space-y-4">
          {purchases.length === 0 && (
            <li className="py-4 text-sm text-forest/55">
              No production batches yet.
            </li>
          )}
          {purchases.map((p) => (
            <li key={p.id} className="border border-mist bg-white/40 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-medium text-forest">{p.supplier}</p>
                  <p className="text-xs text-forest/55">
                    {p.status} · other costs {formatGhs(p.freightPesewas)} ·{" "}
                    {new Date(p.createdAt).toLocaleString("en-GH")}
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-forest/75">
                {p.lines.map((l) => (
                  <li key={l.id}>
                    {l.variant.product.name} {l.variant.size} × {l.qty} @{" "}
                    {formatGhs(l.unitCostPesewas)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
