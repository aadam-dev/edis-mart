"use client";

import Image from "next/image";
import Link from "next/link";
import { formatGhs } from "@/lib/site";
import type { CatalogProduct } from "@/data/catalog";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

function priceLabel(product: CatalogProduct) {
  if (product.channel === "inquiry") return "Request a batch";
  if (product.channel === "wholesale") {
    const prices = product.variants
      .map((v) => v.wholesalePrice)
      .filter((p): p is number => p != null);
    if (!prices.length) return "Wholesale";
    return `From ${formatGhs(Math.min(...prices))}`;
  }
  const prices = product.variants
    .map((v) => v.retailPrice)
    .filter((p): p is number => p != null);
  if (!prices.length) return "Quote";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatGhs(min) : `${formatGhs(min)} - ${formatGhs(max)}`;
}

export function ProductCard({
  product,
  variant = "default",
  parallax = 0,
}: {
  product: CatalogProduct;
  variant?: "default" | "editorial";
  parallax?: number;
}) {
  const isEditorial = variant === "editorial";

  const media = (
    <div
      className={`relative overflow-hidden bg-sage/15 ${
        isEditorial
          ? "arch-mask aspect-[4/5]"
          : "aspect-[4/5] rounded-[1.75rem]"
      }`}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        sizes="(max-width:768px) 100vw, 40vw"
      />
    </div>
  );

  return (
    <Link href={`/product/${product.slug}`} className="group focus-ring block">
      {parallax > 0 ? (
        <ParallaxMedia speed={parallax} className="rounded-[inherit]">
          <div className="scale-110">{media}</div>
        </ParallaxMedia>
      ) : (
        media
      )}
      <div className={`space-y-1.5 ${isEditorial ? "mt-5" : "mt-4 px-1"}`}>
        <p className="label-caps text-sage">{priceLabel(product)}</p>
        <p className="font-display text-2xl font-medium tracking-tight text-forest md:text-[1.65rem]">
          {product.name}
        </p>
        <p className="max-w-[32ch] text-sm leading-relaxed text-forest/60">
          {product.tagline}
        </p>
      </div>
    </Link>
  );
}
