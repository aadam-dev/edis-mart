"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatGhs, site } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = items.length ? site.shippingAccraPesewas : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center md:px-6">
        <h1 className="font-display text-4xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-ink/70">Fill it with flakes and chips.</p>
        <div className="mt-8">
          <ButtonLink href="/shop">Shop the flakes</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.sku}
              className="flex gap-4 border border-mist bg-white p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-mist">
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="font-semibold hover:text-leaf"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-ink/60">{item.size}</p>
                  </div>
                  <p className="font-semibold">
                    {formatGhs(item.unitPrice * item.quantity)}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-mist">
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() =>
                        setQuantity(item.sku, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() =>
                        setQuantity(item.sku, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-ink/55 hover:text-leaf"
                    onClick={() => removeItem(item.sku)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-mist bg-white p-6">
          <h2 className="font-display text-xl font-semibold">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatGhs(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Accra delivery</dt>
              <dd>{formatGhs(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-mist pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatGhs(total)}</dd>
            </div>
          </dl>
          <ButtonLink href="/checkout" className="mt-6 w-full">
            Checkout
          </ButtonLink>
          <p className="mt-3 text-xs text-ink/55">
            Pickup available. Confirm address at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}
