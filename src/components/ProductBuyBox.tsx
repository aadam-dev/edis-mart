"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingCart, WhatsappLogo } from "@phosphor-icons/react";
import type { CatalogProduct } from "@/data/catalog";
import { useCart } from "@/store/cart";
import { formatGhs, whatsappLink } from "@/lib/site";

type Props = {
  product: CatalogProduct;
};

export function ProductBuyBox({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const sellable = product.variants.filter(
    (v) =>
      (product.channel === "wholesale"
        ? v.wholesalePrice
        : v.retailPrice) != null,
  );
  const [size, setSize] = useState(sellable[0]?.size || product.variants[0]?.size);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.size === size),
    [product.variants, size],
  );

  const unitPrice =
    product.channel === "wholesale"
      ? variant?.wholesalePrice
      : variant?.retailPrice;

  const isInquiry = product.channel === "inquiry" || unitPrice == null;

  const onAdd = () => {
    if (!variant || unitPrice == null) return;
    addItem(
      {
        productSlug: product.slug,
        productName: product.name,
        size: variant.size,
        sku: variant.sku,
        unitPrice,
        image: product.image,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const waText = `Hi Yeskoko, I want ${product.name} (${size}) x${qty}.`;

  return (
    <div className="space-y-6">
      <div className="relative aspect-square overflow-hidden border border-mist bg-mist md:aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-ink/70">{product.tagline}</p>
        <p className="mt-4 font-display text-2xl font-semibold text-leaf">
          {isInquiry ? "Request a quote" : formatGhs(unitPrice)}
        </p>
      </div>

      <p className="max-w-[55ch] text-sm leading-relaxed text-ink/75">
        {product.description}
      </p>

      <div>
        <p className="mb-2 text-sm font-semibold">Choose size</p>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const price =
              product.channel === "wholesale" ? v.wholesalePrice : v.retailPrice;
            const disabled = price == null && product.channel !== "inquiry";
            return (
              <button
                key={v.sku}
                type="button"
                disabled={disabled && product.channel !== "inquiry"}
                onClick={() => setSize(v.size)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  size === v.size
                    ? "border-leaf bg-leaf text-white"
                    : "border-mist bg-white text-ink hover:border-leaf/50"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      {!isInquiry && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-mist bg-white">
            <button
              type="button"
              className="px-3 py-2 text-lg"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              className="px-3 py-2 text-lg"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 text-base font-semibold text-white transition hover:bg-forest active:scale-[0.98] sm:flex-none"
          >
            <ShoppingCart size={18} weight="bold" />
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      )}

      {isInquiry && (
        <a
          href={whatsappLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-base font-semibold text-white hover:bg-forest"
        >
          <WhatsappLogo size={20} weight="fill" />
          {product.channel === "wholesale" ? "Request wholesale" : "Request a batch"}
        </a>
      )}
    </div>
  );
}
