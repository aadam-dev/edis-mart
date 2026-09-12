"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatGhs, site } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = items.length ? site.shippingAccraPesewas : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center md:px-6">
        <Reveal>
          <h1 className="font-display text-5xl font-medium tracking-tight text-forest">Your cart is empty</h1>
          <p className="mt-4 text-lg text-forest/70">Fill it with flakes and chips.</p>
          <div className="mt-10">
            <ButtonLink href="/shop">Shop the flakes</ButtonLink>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <h1 className="font-display text-5xl font-medium tracking-tight text-forest md:text-6xl">Cart</h1>
      </Reveal>
      
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <Reveal delay={0.1}>
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.sku}
                className="flex gap-6 border-t border-mist/80 pt-6"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1rem] bg-sage/20">
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
                        className="font-display text-2xl font-medium text-forest transition hover:text-clay"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-forest/60">{item.size}</p>
                    </div>
                    <p className="font-medium text-forest">
                      {formatGhs(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-mist/80">
                      <button
                        type="button"
                        className="px-3 py-1 text-forest transition hover:text-clay"
                        onClick={() =>
                          setQuantity(item.sku, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm font-medium text-forest">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1 text-forest transition hover:text-clay"
                        onClick={() =>
                          setQuantity(item.sku, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-forest/50 transition hover:text-clay"
                      onClick={() => removeItem(item.sku)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <aside className="h-fit rounded-[1.5rem] border border-mist/80 bg-mist/20 p-8">
            <h2 className="font-display text-3xl font-medium text-forest">Summary</h2>
            <dl className="mt-6 space-y-3 text-sm text-forest/80">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatGhs(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Accra delivery</dt>
                <dd>{formatGhs(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-mist/80 pt-4 text-base font-medium text-forest">
                <dt>Total</dt>
                <dd>{formatGhs(total)}</dd>
              </div>
            </dl>
            <ButtonLink href="/checkout" className="mt-8 w-full">
              Checkout
            </ButtonLink>
            <p className="mt-4 text-center text-xs text-forest/50">
              Pickup available. Confirm address at checkout.
            </p>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
