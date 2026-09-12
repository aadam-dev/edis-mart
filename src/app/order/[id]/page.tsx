import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pendingPay?: string }>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { pendingPay } = await searchParams;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-leaf">
        Order confirmed
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        Thank you, {order.customerName.split(" ")[0]}
      </h1>
      <p className="mt-3 text-ink/70">
        Reference <span className="font-semibold text-ink">{order.reference}</span>
        . Status:{" "}
        <span className="font-semibold text-ink">
          {order.status.replaceAll("_", " ")}
        </span>
        .
      </p>
      {pendingPay && (
        <p className="mt-4 border border-mango/40 bg-mango/10 px-4 py-3 text-sm">
          Paystack keys are not configured yet. Your order is saved as pending.
          Add live keys from <code className="text-xs">docs/06-payments.md</code>.
        </p>
      )}
      <ul className="mt-8 space-y-2 border border-mist bg-white p-5 text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <span>
              {item.productName} ({item.size}) × {item.quantity}
            </span>
            <span>{formatGhs(item.lineTotal)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t border-mist pt-3 font-semibold">
          <span>Total</span>
          <span>{formatGhs(order.total)}</span>
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
        <Link href="/contact" className="text-sm font-semibold text-leaf hover:underline">
          Questions? Contact us
        </Link>
      </div>
    </div>
  );
}
