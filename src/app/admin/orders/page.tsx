import { redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import {
  OrderStatusForm,
  orderStatusLabel,
} from "@/components/ops/OrderStatusForm";

function fulfillmentLabel(order: {
  addressLine1: string | null;
  city: string | null;
}) {
  if (order.addressLine1 || order.city) return "Delivery";
  return "Pickup";
}

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
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Online orders
        </h1>
      </div>
      <div className="overflow-x-auto border border-mist bg-white/40">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-mist bg-mist/30 text-xs uppercase tracking-wider text-forest/55">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Pack</th>
              <th className="px-4 py-3">Pay</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-forest/55"
                >
                  No online orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr
                key={o.id}
                id={`order-${o.id}`}
                className="border-b border-mist/70 align-top"
              >
                <td className="px-4 py-3">
                  <p className="font-medium tabular-nums">{o.reference}</p>
                  <p className="text-xs text-forest/50">
                    {new Date(o.createdAt).toLocaleString("en-GH")}
                  </p>
                  {o.paystackRef && (
                    <p className="text-xs text-forest/50">Ref {o.paystackRef}</p>
                  )}
                  <p className="mt-1 text-xs font-medium text-forest/60">
                    {fulfillmentLabel(o)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{o.customerName}</p>
                  <p className="text-xs text-forest/55">{o.customerPhone}</p>
                  <p className="text-xs text-forest/45">{o.customerEmail}</p>
                  {(o.addressLine1 || o.city) && (
                    <p className="mt-1 text-xs text-forest/55">
                      {[o.addressLine1, o.city, o.region]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {o.notes && (
                    <p className="mt-1 text-xs text-forest/50">Note: {o.notes}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-1 text-xs text-forest/70">
                    {o.items.map((i) => (
                      <li key={i.id}>
                        {i.productName} · {i.size} ×{i.quantity}{" "}
                        <span className="tabular-nums text-forest/45">
                          ({formatGhs(i.lineTotal)})
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 capitalize">{o.paymentMethod}</td>
                <td className="px-4 py-3 tabular-nums">{formatGhs(o.total)}</td>
                <td className="px-4 py-3">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-forest/40">
                    {orderStatusLabel(o.status)}
                  </p>
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
