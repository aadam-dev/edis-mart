"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { formatGhs } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";
import type { StoredOrder } from "@/lib/orders";

export default function OrderClient() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pendingPay = searchParams.get("pendingPay");
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const id = params.id;
    const cached = sessionStorage.getItem(`yeskoko-order-${id}`);
    if (cached) {
      setOrder(JSON.parse(cached) as StoredOrder);
      return;
    }
    fetch(`/api/orders/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        const data = await res.json();
        setOrder(data.order);
      })
      .catch(() => setMissing(true));
  }, [params.id]);

  if (missing) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Order not found</h1>
        <div className="mt-6">
          <ButtonLink href="/shop">Back to shop</ButtonLink>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-ink/60">
        Loading order...
      </div>
    );
  }

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
          Add live keys from docs/06-payments.md.
        </p>
      )}
      <ul className="mt-8 space-y-2 border border-mist bg-white p-5 text-sm">
        {order.items.map((item, i) => (
          <li key={`${item.productSlug}-${i}`} className="flex justify-between gap-3">
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
