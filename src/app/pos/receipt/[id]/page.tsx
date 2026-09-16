import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PosReceipt } from "@/components/ops/PosReceipt";
import { PrintActions } from "@/components/ops/PrintButton";

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const user = await requireOpsUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const { print } = await searchParams;

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      lines: true,
      servedBy: true,
    },
  });
  if (!sale) notFound();

  return (
    <div className="min-h-dvh bg-oat text-forest print:bg-white">
      <div className="mx-auto max-w-lg px-4 py-6 print:max-w-none print:px-0 print:py-2">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <PrintActions
            receiptNumber={sale.receiptNumber}
            autoPrint={print === "1"}
          />
          <Link
            href="/pos"
            className="rounded-full border border-mist bg-white px-4 py-2.5 text-sm font-semibold"
          >
            Back to till
          </Link>
          <Link
            href={`/admin/orders/sale/${sale.id}`}
            className="rounded-full border border-mist bg-white px-4 py-2.5 text-sm font-semibold"
          >
            Manage sale
          </Link>
        </div>

        <div className="rounded-2xl border border-mist bg-white px-5 py-6 shadow-sm print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none">
          <PosReceipt sale={sale} />
        </div>

        <p className="mt-4 text-center text-[11px] text-forest/45 print:hidden">
          Save PDF: click Save PDF, then choose “Save as PDF” in the system print
          dialog.
        </p>
      </div>
    </div>
  );
}
