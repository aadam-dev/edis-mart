import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminPartnersPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");
  if (!can(user, "partners.manage")) redirect("/admin");

  const partners = await prisma.partner.findMany({
    orderBy: [{ kind: "asc" }, { name: "asc" }],
    include: { offerings: true, account: true },
  });

  const byKind = (kind: string) => partners.filter((p) => p.kind === kind);

  return (
    <div className="space-y-10">
      <div>
        <p className="label-caps text-sage">Network</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Partners
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-forest/60">
          Retailers, sales agents, and suppliers imported from the September
          2024 assessment. All rows default to needs verification — not public
          site content.
        </p>
      </div>

      {(["retailer", "sales_agent", "supplier"] as const).map((kind) => (
        <section key={kind}>
          <h2 className="font-display text-2xl text-forest">
            {kind === "sales_agent" ? "Sales agents" : `${kind}s`}
          </h2>
          <ul className="mt-4 divide-y divide-mist border-t border-mist text-sm">
            {byKind(kind).length === 0 && (
              <li className="py-4 text-forest/55">None imported yet.</li>
            )}
            {byKind(kind).map((p) => (
              <li key={p.id} className="flex flex-wrap justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-forest">{p.name}</p>
                  <p className="text-forest/55">
                    {p.location || "Location TBD"}
                    {p.relationshipMonths != null
                      ? ` · ${p.relationshipMonths} mo in source`
                      : ""}
                  </p>
                  {p.offerings.length > 0 && (
                    <p className="mt-1 text-xs text-forest/45">
                      {p.offerings.map((o) => o.itemName).join(" · ")}
                    </p>
                  )}
                </div>
                <p className="label-caps text-sage">{p.verificationStatus}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
