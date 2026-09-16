import type { Metadata } from "next";
import { getProductsFromDb } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Shop Yeskoko snacks",
  description:
    "Browse coconut flakes, mango chips, and wholesale sizes in GHS.",
};

export default async function ShopPage() {
  const products = await getProductsFromDb();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <h1 className="font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
          The pantry
        </h1>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-forest/60 md:text-lg">
          Pick a size. Retail prices below. Wholesale? Talk to us.
        </p>
      </Reveal>
      <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal
            key={product.id}
            delay={i * 0.05}
            className={i % 3 === 1 ? "lg:mt-16" : ""}
          >
            <ProductCard product={product} variant="editorial" />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
