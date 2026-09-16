import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhPhoneDisplay } from "@/lib/site";
import { CustomerForm } from "@/components/ops/CustomerForm";

export default async function AdminCustomersPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const customers = await prisma.customer.findMany({
    include: { _count: { select: { sales: true } } },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-sage">Customers</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Walk-in book
        </h1>
        <p className="mt-2 max-w-xl text-sm text-forest/60">
          Names and phones collected on the till show up here and autocomplete next
          time.
        </p>
      </div>

      <CustomerForm />

      <div className="overflow-x-auto border border-mist bg-white/40">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-mist bg-mist/30 text-xs uppercase tracking-wider text-forest/55">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Till sales</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-forest/55"
                >
                  No customers yet. Charge a sale with name + phone on the till.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-mist/70">
                <td className="px-4 py-3 font-medium text-forest">{c.name}</td>
                <td className="px-4 py-3 tabular-nums text-forest/70">
                  {formatGhPhoneDisplay(c.phone)}
                </td>
                <td className="px-4 py-3 tabular-nums">{c._count.sales}</td>
                <td className="px-4 py-3 text-xs text-forest/50">
                  {new Date(c.updatedAt).toLocaleString("en-GH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
