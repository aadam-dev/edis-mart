import { notFound, redirect } from "next/navigation";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGhs, site } from "@/lib/site";
import { OpsCredit } from "@/components/ops/OpsCredit";
import { PrintButton } from "@/components/ops/PrintButton";

export default async function ReceiptPage({
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
      session: true,
      servedBy: true,
    },
  });
  if (!sale) notFound();

  return (
    <div className="min-h-dvh bg-white text-forest print:bg-white">
      <div className="mx-auto max-w-[320px] px-4 py-8 print:max-w-[80mm] print:px-2 print:py-2">
        <div className="text-center">
          <p className="font-display text-3xl font-medium tracking-tight">Yeskoko</p>
          <p className="mt-1 text-xs text-forest/60">by Edis Mart</p>
          <p className="mt-2 text-xs text-forest/55">
            {site.city} · {site.phones[0]}
          </p>
        </div>

        <div className="mt-6 space-y-1 border-y border-dashed border-forest/25 py-3 text-xs">
          <p className="flex justify-between">
            <span>Receipt</span>
            <span className="tabular-nums font-medium">{sale.receiptNumber}</span>
          </p>
          <p className="flex justify-between">
            <span>Date</span>
            <span>{new Date(sale.createdAt).toLocaleString("en-GH")}</span>
          </p>
          <p className="flex justify-between">
            <span>Till</span>
            <span className="truncate pl-2">{sale.sessionId.slice(0, 8)}</span>
          </p>
          <p className="flex justify-between">
            <span>Served by</span>
            <span>{sale.servedBy?.name || "—"}</span>
          </p>
          {sale.customerName && (
            <p className="flex justify-between">
              <span>Customer</span>
              <span>{sale.customerName}</span>
            </p>
          )}
          {sale.customerPhone && (
            <p className="flex justify-between">
              <span>Phone</span>
              <span className="tabular-nums">{sale.customerPhone}</span>
            </p>
          )}
          {sale.momoRef && (
            <p className="flex justify-between">
              <span>Payment ref</span>
              <span className="tabular-nums">{sale.momoRef}</span>
            </p>
          )}
        </div>

        <ul className="mt-4 space-y-3 text-sm">
          {sale.lines.map((l) => (
            <li key={l.id}>
              <div className="flex justify-between gap-2">
                <span>
                  {l.productName} ({l.size}) × {l.quantity}
                </span>
                <span className="tabular-nums">{formatGhs(l.lineTotal)}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-forest/20 pt-3 text-sm">
          <p className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatGhs(sale.total)}</span>
          </p>
          <p className="flex justify-between text-xs capitalize text-forest/65">
            <span>
              Paid by {sale.paymentMethod}
              {sale.paymentMethod === "split" && (
                <span className="normal-case">
                  {" "}
                  (
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
                    .join(" · ")}
                  )
                </span>
              )}
            </span>
            {sale.tendered != null && sale.cashPesewas > 0 && (
              <span>
                Tendered {formatGhs(sale.tendered)}
                {sale.changeGiven
                  ? ` · Change ${formatGhs(sale.changeGiven)}`
                  : ""}
              </span>
            )}
          </p>
        </div>

        {sale.oversellNote && (
          <p className="mt-3 text-[10px] text-forest/50">Note: {sale.oversellNote}</p>
        )}

        <p className="mt-6 text-center text-[10px] leading-relaxed text-forest/55">
          All sales final on sealed snacks unless faulty on open. Thank you for
          choosing Yeskoko.
        </p>

        <div className="mt-6 print:mt-4">
          <OpsCredit compact />
        </div>

        <div className="mt-8 flex justify-center gap-3 print:hidden">
          <PrintButton />
          <a
            href="/pos"
            className="rounded-full border border-mist px-4 py-2 text-sm font-semibold"
          >
            Back to till
          </a>
        </div>
      </div>
    </div>
  );
}
