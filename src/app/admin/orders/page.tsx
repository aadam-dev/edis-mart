import { redirect } from "next/navigation";
import Link from "next/link";
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

function payLabel(method: string) {
  if (method === "momo") return "MoMo";
  if (method === "cash") return "Cash";
  if (method === "bank") return "Bank";
  if (method === "split") return "Split";
  return method;
}

function statusBadge(status: string) {
  if (status === "returned" || status === "voided") {
    return "text-clay";
  }
  return "text-forest/55";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; session?: string }>;
}) {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const { tab: tabParam, session: sessionFilter } = await searchParams;
  const tab = tabParam === "online" ? "online" : "till";

  const openSession = await prisma.tillSession.findFirst({
    where: { status: "open" },
    orderBy: { openedAt: "desc" },
  });

  const [sales, orders, sessions] = await Promise.all([
    prisma.sale.findMany({
      where: sessionFilter
        ? { sessionId: sessionFilter }
        : openSession
          ? { sessionId: openSession.id }
          : undefined,
      include: {
        lines: true,
        servedBy: true,
        session: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.tillSession.findMany({
      orderBy: { openedAt: "desc" },
      take: 20,
      include: { _count: { select: { sales: true } } },
    }),
  ]);

  const activeSessionId = sessionFilter || openSession?.id || null;
  const showingAll = !sessionFilter && !openSession;

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps text-sage">Orders</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          {tab === "till" ? "Till sales" : "Online orders"}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-forest/60">
          {tab === "till"
            ? "Session receipts — review, print, modify details, or return stock."
            : "Web checkout orders and fulfillment status."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "till"
              ? "bg-forest text-oat"
              : "border border-mist bg-white/60 text-forest"
          }`}
        >
          Till
        </Link>
        <Link
          href="/admin/orders?tab=online"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "online"
              ? "bg-forest text-oat"
              : "border border-mist bg-white/60 text-forest"
          }`}
        >
          Online
        </Link>
        {tab === "till" && (
          <Link
            href="/pos"
            className="rounded-full border border-mist bg-white/60 px-4 py-2 text-sm font-semibold text-forest"
          >
            Open till →
          </Link>
        )}
      </div>

      {tab === "till" && (
        <>
          <div className="flex flex-wrap gap-2">
            {openSession && (
              <Link
                href="/admin/orders"
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  activeSessionId === openSession.id && !sessionFilter
                    ? "bg-clay text-oat"
                    : "border border-mist bg-white/50"
                }`}
              >
                Current session
              </Link>
            )}
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/admin/orders?session=${s.id}`}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  sessionFilter === s.id
                    ? "bg-clay text-oat"
                    : "border border-mist bg-white/50"
                }`}
              >
                {s.status === "open" ? "Open" : "Closed"} ·{" "}
                {new Date(s.openedAt).toLocaleDateString("en-GH")} ·{" "}
                {s._count.sales} sales
              </Link>
            ))}
            {showingAll && sales.length === 0 && (
              <p className="text-sm text-forest/55">No till sales yet.</p>
            )}
          </div>

          <div className="overflow-x-auto border border-mist bg-white/40">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-mist bg-mist/30 text-xs uppercase tracking-wider text-forest/55">
                <tr>
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Pay</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-forest/55"
                    >
                      No sales in this session.
                    </td>
                  </tr>
                )}
                {sales.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-mist/70 align-top"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium tabular-nums">
                        {s.receiptNumber}
                      </p>
                      <p className="text-xs text-forest/50">
                        {new Date(s.createdAt).toLocaleString("en-GH")}
                      </p>
                      <p className="text-xs text-forest/45">
                        {s.servedBy?.name || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{s.customerName || "Walk-in"}</p>
                      {s.customerPhone && (
                        <p className="text-xs tabular-nums text-forest/55">
                          {s.customerPhone}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ul className="space-y-1 text-xs text-forest/70">
                        {s.lines.map((l) => (
                          <li key={l.id}>
                            {l.productName} · {l.size} ×{l.quantity}
                            {l.returnedQty > 0 && (
                              <span className="text-clay">
                                {" "}
                                (−{l.returnedQty})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <p>{payLabel(s.paymentMethod)}</p>
                      {s.momoRef && (
                        <p className="text-xs text-forest/45">{s.momoRef}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatGhs(s.total)}
                    </td>
                    <td className={`px-4 py-3 capitalize ${statusBadge(s.status)}`}>
                      {s.status}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs font-semibold">
                        <Link
                          href={`/admin/orders/sale/${s.id}`}
                          className="text-clay hover:underline"
                        >
                          Review
                        </Link>
                        <Link
                          href={`/pos/receipt/${s.id}`}
                          target="_blank"
                          className="text-forest/70 hover:underline"
                        >
                          Receipt
                        </Link>
                        <Link
                          href={`/pos/receipt/${s.id}?print=1`}
                          target="_blank"
                          className="text-forest/70 hover:underline"
                        >
                          Print / PDF
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "online" && (
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
                      <p className="text-xs text-forest/50">
                        Ref {o.paystackRef}
                      </p>
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
                      <p className="mt-1 text-xs text-forest/50">
                        Note: {o.notes}
                      </p>
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
                  <td className="px-4 py-3 tabular-nums">
                    {formatGhs(o.total)}
                  </td>
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
      )}
    </div>
  );
}
