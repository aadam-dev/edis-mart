import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import { OrderStatusForm } from "@/components/ops/OrderStatusForm";

export default async function AdminOrdersPage() {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-sage">Orders</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">Online orders</h1>
      </div>
      <div className="overflow-x-auto border border-mist bg-white/40">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-mist bg-mist/30 text-xs uppercase tracking-wider text-forest/55">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Pay</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-mist/70">
                <td className="px-4 py-3">
                  <p className="font-medium tabular-nums">{o.reference}</p>
                  <p className="text-xs text-forest/50">
                    {new Date(o.createdAt).toLocaleString("en-GH")}
                  </p>
                  {o.paystackRef && (
                    <p className="text-xs text-forest/50">Ref {o.paystackRef}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p>{o.customerName}</p>
                  <p className="text-xs text-forest/55">{o.customerPhone}</p>
                </td>
                <td className="px-4 py-3 capitalize">{o.paymentMethod}</td>
                <td className="px-4 py-3 tabular-nums">{formatGhs(o.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusForm orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
