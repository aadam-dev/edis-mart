import type { Metadata } from "next";
import { getProductsFromDb } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop dried fruit snacks Ghana",
  description:
    "Buy Yeskoko coconut flakes, chia coco, mango and pineapple chips in Ghana — MoMo, card, or cash on delivery.",
  alternates: { canonical: absoluteUrl("/shop") },
};

export default async function ShopPage() {
  const products = await getProductsFromDb();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <p className="label-caps text-clay">Ghana retail</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
          The pantry
        </h1>
        <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-forest/60 md:text-lg">
          Coconut flakes, chia coco, mango chips, and pineapple chips — sized
          for real use. Retail prices in GHS. Domestic volume? Wholesale.
          International sourcing? Export desk.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/wholesale" variant="secondary">
            Ghana wholesale
          </ButtonLink>
          <ButtonLink href="/export" variant="ghost">
            Export / buyer pack
          </ButtonLink>
        </div>
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
