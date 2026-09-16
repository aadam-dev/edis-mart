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
        <p className="label-caps text-sage">Purchases</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Receive stock
        </h1>
      </div>

      <PurchaseForm variants={options} />

      <section>
        <h2 className="font-display text-2xl text-forest">History</h2>
        <ul className="mt-4 space-y-4">
          {purchases.map((p) => (
            <li key={p.id} className="border border-mist bg-white/40 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-medium text-forest">{p.supplier}</p>
                  <p className="text-xs text-forest/55">
                    {p.status} · freight {formatGhs(p.freightPesewas)} ·{" "}
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
