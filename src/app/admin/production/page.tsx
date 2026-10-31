import { redirect } from "next/navigation";
import Link from "next/link";
import { requireOpsUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminProductionPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");
  if (!can(user, "production.manage")) redirect("/admin");

  const batches = await prisma.productionBatch.findMany({
    include: { outputs: true, checks: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Production</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Batches & QA
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-forest/60">
          New production batches live here. The legacy finished-pack receive
          flow remains under{" "}
          <Link href="/admin/purchases" className="font-semibold text-clay">
            Production (legacy)
          </Link>{" "}
          until QA release is proven against the stock ledger.
        </p>
      </div>

      <ul className="space-y-4">
        {batches.length === 0 && (
          <li className="border border-dashed border-mist p-6 text-sm text-forest/55">
            No structured batches yet. Record finished packs via the legacy
            Production page, or create batches once operators are ready.
          </li>
        )}
        {batches.map((b) => (
          <li key={b.id} className="border border-mist bg-white/40 p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium text-forest">{b.batchCode}</p>
              <p className="label-caps text-sage">{b.status}</p>
            </div>
            <p className="mt-2 text-forest/60">
              Outputs:{" "}
              {b.outputs.length
                ? b.outputs
                    .map((o) => `${o.productName} ${o.size} ×${o.actualQty}`)
                    .join(" · ")
                : "—"}
            </p>
            <p className="mt-1 text-xs text-forest/45">
              QA checks: {b.checks.length}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
