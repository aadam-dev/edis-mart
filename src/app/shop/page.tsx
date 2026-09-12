import type { Metadata } from "next";
import { getProducts } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Shop Yeskoko snacks",
  description:
    "Browse coconut flakes, mango chips, and wholesale sizes in GHS.",
};

export default function ShopPage() {
  const products = getProducts();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 md:py-16">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          The pantry
        </h1>
        <p className="mt-3 max-w-[50ch] text-ink/70">
          Pick a size. Retail prices below. Wholesale? Talk to us.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.05}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
