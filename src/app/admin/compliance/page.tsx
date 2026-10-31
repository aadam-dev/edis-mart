import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminCompliancePage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");
  if (!can(user, "compliance.manage")) redirect("/admin");

  const [items, equipment, baselines] = await Promise.all([
    prisma.complianceItem.findMany({ orderBy: { title: "asc" } }),
    prisma.equipmentAsset.findMany({ orderBy: { name: "asc" } }),
    prisma.businessBaseline.findMany({ orderBy: { label: "asc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <p className="label-caps text-sage">Compliance</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Quality & equipment
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-forest/60">
          Documented vs roadmap items from the 2024 assessment. Do not publish
          roadmap items as current certifications.
        </p>
      </div>

      <section>
        <h2 className="font-display text-2xl text-forest">Registrations & SOPs</h2>
        <ul className="mt-4 divide-y divide-mist border-t border-mist text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-forest">{item.title}</p>
                <p className="text-forest/55">
                  {item.authority || "—"} · {item.kind}
                </p>
              </div>
              <div className="text-right">
                <p className="label-caps text-sage">{item.status}</p>
                <p className="text-xs text-forest/40">{item.verificationStatus}</p>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-4 text-forest/55">Run the assessment import.</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-forest">Equipment</h2>
        <ul className="mt-4 divide-y divide-mist border-t border-mist text-sm">
          {equipment.map((e) => (
            <li key={e.id} className="flex flex-wrap justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-forest">{e.name}</p>
                <p className="text-forest/55">
                  {e.capacity || "Capacity TBD"}
                  {e.notes ? ` · ${e.notes}` : ""}
                </p>
              </div>
              <p className="label-caps text-sage">{e.status}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-forest">
          Historical baselines
        </h2>
        <p className="mt-2 text-sm text-forest/55">
          Never treat these as live KPIs until verified with current books.
        </p>
        <ul className="mt-4 divide-y divide-mist border-t border-mist text-sm">
          {baselines.map((b) => (
            <li key={b.id} className="py-3">
              <p className="font-medium text-forest">{b.label}</p>
              <p className="text-forest/55">{b.valueJson}</p>
              <p className="text-xs text-forest/40">
                source {b.sourceDate.toISOString().slice(0, 10)} ·{" "}
                {b.verificationStatus}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
