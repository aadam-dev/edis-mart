import Image from "next/image";
import { formatGhs, site } from "@/lib/site";
import { OpsCredit } from "@/components/ops/OpsCredit";

export type ReceiptSale = {
  receiptNumber: string;
  status: string;
  paymentMethod: string;
  momoRef: string | null;
  cashPesewas: number;
  momoPesewas: number;
  bankPesewas: number;
  customerName: string | null;
  customerPhone: string | null;
  subtotal: number;
  total: number;
  tendered: number | null;
  changeGiven: number | null;
  oversellNote: string | null;
  returnNote: string | null;
  returnedAt: Date | null;
  createdAt: Date;
  sessionId: string;
  servedBy: { name: string } | null;
  lines: {
    id: string;
    productName: string;
    size: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    returnedQty: number;
  }[];
};

function methodLabel(m: string) {
  if (m === "momo") return "Mobile Money";
  if (m === "cash") return "Cash";
  if (m === "bank") return "Bank transfer";
  if (m === "split") return "Split payment";
  return m;
}

export function PosReceipt({ sale }: { sale: ReceiptSale }) {
  const returned = sale.status === "returned" || sale.status === "voided";

  return (
    <article className="mx-auto w-full max-w-[340px] text-forest print:max-w-[80mm]">
      <header className="flex flex-col items-center text-center">
        <div className="rounded-lg bg-oat/90 p-2 print:bg-transparent print:p-0">
          <Image
            src="/brand/logo.jpg"
            alt="Yeskoko"
            width={160}
            height={51}
            unoptimized
            priority
            className="h-auto w-[140px] object-contain print:w-[120px]"
          />
        </div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-forest/55">
          {site.name} · {site.company}
        </p>
        <p className="mt-1 text-[11px] text-forest/50">
          {site.city} · {site.phones[0]}
        </p>
        {returned && (
          <p className="mt-2 rounded bg-mango/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-clay">
            {sale.status === "voided" ? "Voided" : "Returned"}
          </p>
        )}
      </header>

      <div className="mt-5 space-y-1 border-y border-dashed border-forest/25 py-3 text-[11px]">
        <Row label="Receipt" value={sale.receiptNumber} strong />
        <Row
          label="Date"
          value={new Date(sale.createdAt).toLocaleString("en-GH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        />
        <Row label="Till" value={sale.sessionId.slice(0, 10)} />
        <Row label="Served by" value={sale.servedBy?.name || "—"} />
        {sale.customerName && <Row label="Customer" value={sale.customerName} />}
        {sale.customerPhone && (
          <Row label="Phone" value={sale.customerPhone} mono />
        )}
      </div>

      <table className="mt-4 w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-forest/15 text-[10px] uppercase tracking-wider text-forest/45">
            <th className="pb-1.5 font-medium">Item</th>
            <th className="pb-1.5 text-right font-medium">Amt</th>
          </tr>
        </thead>
        <tbody>
          {sale.lines.map((l) => {
            const activeQty = l.quantity - (l.returnedQty || 0);
            return (
              <tr key={l.id} className="align-top">
                <td className="py-2 pr-2">
                  <p className="font-medium leading-snug">{l.productName}</p>
                  <p className="mt-0.5 text-[10px] text-forest/50">
                    {l.size} · {l.sku}
                  </p>
                  <p className="mt-0.5 tabular-nums text-[10px] text-forest/55">
                    {l.quantity} × {formatGhs(l.unitPrice)}
                    {l.returnedQty > 0 && (
                      <span className="text-clay">
                        {" "}
                        · returned {l.returnedQty}
                      </span>
                    )}
                  </p>
                  {activeQty <= 0 && (
                    <p className="text-[10px] font-medium text-clay">Fully returned</p>
                  )}
                </td>
                <td className="py-2 text-right tabular-nums font-medium">
                  {formatGhs(l.lineTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-3 space-y-1 border-t border-forest/20 pt-3 text-[12px]">
        <Row label="Subtotal" value={formatGhs(sale.subtotal)} />
        <Row label="Total" value={formatGhs(sale.total)} strong />
      </div>

      <div className="mt-3 space-y-1 border-t border-dashed border-forest/20 pt-3 text-[11px]">
        <p className="font-medium text-forest/80">Payment</p>
        <Row label="Method" value={methodLabel(sale.paymentMethod)} />
        {sale.cashPesewas > 0 && (
          <Row label="Cash" value={formatGhs(sale.cashPesewas)} mono />
        )}
        {sale.momoPesewas > 0 && (
          <Row label="MoMo" value={formatGhs(sale.momoPesewas)} mono />
        )}
        {sale.bankPesewas > 0 && (
          <Row label="Bank" value={formatGhs(sale.bankPesewas)} mono />
        )}
        {sale.momoRef && <Row label="Reference" value={sale.momoRef} mono />}
        {sale.tendered != null && sale.cashPesewas > 0 && (
          <>
            <Row label="Tendered" value={formatGhs(sale.tendered)} mono />
            {(sale.changeGiven ?? 0) > 0 && (
              <Row label="Change" value={formatGhs(sale.changeGiven)} mono />
            )}
          </>
        )}
      </div>

      {sale.oversellNote && (
        <p className="mt-3 text-[10px] text-forest/45">Note: {sale.oversellNote}</p>
      )}
      {sale.returnNote && (
        <p className="mt-2 text-[10px] text-clay">
          Return: {sale.returnNote}
          {sale.returnedAt &&
            ` · ${new Date(sale.returnedAt).toLocaleString("en-GH")}`}
        </p>
      )}

      <p className="mt-5 text-center text-[10px] leading-relaxed text-forest/50">
        All sales final on sealed snacks unless faulty on open. Thank you for
        choosing Yeskoko.
      </p>

      <footer className="mt-5 border-t border-forest/10 pt-4 print:mt-3">
        <OpsCredit compact />
      </footer>
    </article>
  );
}

function Row({
  label,
  value,
  strong,
  mono,
}: {
  label: string;
  value: string | number | null | undefined;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <p
      className={`flex justify-between gap-3 ${strong ? "font-semibold" : ""}`}
    >
      <span className="text-forest/55">{label}</span>
      <span className={`text-right ${mono ? "tabular-nums" : ""}`}>{value}</span>
    </p>
  );
}
