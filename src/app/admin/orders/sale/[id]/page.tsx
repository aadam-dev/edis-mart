import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import { SaleActions } from "@/components/ops/SaleActions";

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      lines: true,
      servedBy: true,
      session: true,
    },
  });
  if (!sale) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/orders"
          className="text-sm font-semibold text-clay hover:underline"
        >
          ← Till sales
        </Link>
        <p className="label-caps mt-4 text-sage">Sale</p>
        <h1 className="mt-2 font-display text-4xl font-medium tabular-nums text-forest">
          {sale.receiptNumber}
        </h1>
        <p className="mt-2 text-sm text-forest/60">
          {new Date(sale.createdAt).toLocaleString("en-GH")} ·{" "}
          <span className="capitalize">{sale.status}</span> · served by{" "}
          {sale.servedBy?.name || "—"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/pos/receipt/${sale.id}`}
            target="_blank"
            className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-oat"
          >
            Open receipt
          </Link>
          <Link
            href={`/pos/receipt/${sale.id}?print=1`}
            target="_blank"
            className="rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold"
          >
            Print / Save PDF
          </Link>
        </div>
      </div>

      <section className="border border-mist bg-white/50 p-5">
        <h2 className="font-display text-xl font-medium text-forest">
          Breakdown
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {sale.lines.map((l) => (
            <li
              key={l.id}
              className="flex justify-between gap-3 border-b border-mist/50 pb-3"
            >
              <div>
                <p className="font-medium">
                  {l.productName} ({l.size})
                </p>
                <p className="text-xs text-forest/50">
                  {l.sku} · {l.quantity} × {formatGhs(l.unitPrice)}
                  {l.returnedQty > 0 && (
                    <span className="text-clay">
                      {" "}
                      · returned {l.returnedQty}
                    </span>
                  )}
                </p>
              </div>
              <p className="tabular-nums font-medium">{formatGhs(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <p className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatGhs(sale.total)}</span>
          </p>
          <p className="flex justify-between text-forest/60 capitalize">
            <span>Paid · {sale.paymentMethod}</span>
            <span className="normal-case tabular-nums text-right">
              {[
                sale.cashPesewas > 0
                  ? `cash ${formatGhs(sale.cashPesewas)}`
                  : null,
                sale.momoPesewas > 0
                  ? `MoMo ${formatGhs(sale.momoPesewas)}`
                  : null,
                sale.bankPesewas > 0
                  ? `bank ${formatGhs(sale.bankPesewas)}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ") || "—"}
            </span>
          </p>
          {sale.momoRef && (
            <p className="text-xs text-forest/50">Ref {sale.momoRef}</p>
          )}
        </div>
      </section>

      <SaleActions
        saleId={sale.id}
        status={sale.status}
        customerName={sale.customerName || ""}
        customerPhone={sale.customerPhone || ""}
        paymentRef={sale.momoRef || ""}
        lines={sale.lines}
      />
    </div>
  );
}
