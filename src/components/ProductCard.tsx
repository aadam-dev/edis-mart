import Image from "next/image";
import Link from "next/link";
import { formatGhs } from "@/lib/site";
import type { Product, Variant } from "@prisma/client";

type ProductWithVariants = Product & { variants: Variant[] };

function priceLabel(product: ProductWithVariants) {
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

export function ProductCard({ product }: { product: ProductWithVariants }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group focus-ring block overflow-hidden border border-mist bg-white transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-leaf/40"
    >
      <div className="relative aspect-square overflow-hidden bg-mist">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-2 p-5">
        <p className="font-display text-xl font-semibold tracking-tight text-ink">
          {product.name}
        </p>
        <p className="text-sm text-ink/65">{product.tagline}</p>
        <p className="text-sm font-semibold text-leaf">{priceLabel(product)}</p>
      </div>
    </Link>
  );
}
