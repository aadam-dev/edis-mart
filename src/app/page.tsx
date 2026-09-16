import Image from "next/image";
import { getFeaturedProducts } from "@/data/catalog";
import { HomeHero } from "@/components/motion/HomeHero";
import { Marquee } from "@/components/motion/Marquee";
import { TaglineReveal } from "@/components/motion/TaglineReveal";
import { StoryReveal } from "@/components/motion/StoryReveal";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export default function HomePage() {
  const products = getFeaturedProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.company,
        brand: "Yeskoko",
        url: site.url,
        email: site.email,
        telephone: site.phones[0],
      },
      {
        "@type": "LocalBusiness",
        name: "Edis Mart (Yeskoko)",
        telephone: site.phones[0],
        email: site.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressCountry: site.country,
        },
        openingHours: site.hoursSchema,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero />
      <Marquee />

      <section className="mx-auto max-w-[1400px] px-4 py-24 md:px-6 md:py-36">
        <Reveal>
          <h2 className="font-display text-4xl font-medium tracking-tight text-forest md:text-5xl lg:text-6xl">
            The pantry
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-forest/60 md:text-lg">
            Coconut flakes and fruit chips in retail sizes. Wholesale on
            request.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-20 md:mt-24 md:grid-cols-12">
          {products.map((product, i) => {
            const placements = [
              "md:col-span-5 md:col-start-1",
              "md:col-span-5 md:col-start-7 md:mt-28",
              "md:col-span-6 md:col-start-3 md:mt-8",
            ];
            const speeds = [0.12, 0.18, 0.1];
            return (
              <Reveal
                key={product.id}
                delay={i * 0.08}
                className={placements[i] ?? "md:col-span-5"}
              >
                <ProductCard
                  product={product}
                  variant="editorial"
                  parallax={speeds[i] ?? 0.12}
                />
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 md:mt-28">
          <ButtonLink href="/shop" variant="secondary">
            View all snacks
          </ButtonLink>
        </div>
      </section>

      <TaglineReveal />

      <StoryReveal>
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-28 md:grid-cols-12 md:gap-10 md:px-6 md:py-40">
          <div className="md:col-span-6">
            <h2 className="font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Dried in Ghana.
              <br />
              <em className="italic">Packed for your pantry.</em>
            </h2>
            <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-oat/70 md:text-lg">
              Edis Mart makes Yeskoko for people who want natural snacks without
              the filler. Founders Mavis Walker Blagodzi and Robert Agyeman
              Newman built the line around real fruit, clear sizes, and Accra
              delivery.
            </p>
            <div className="mt-10">
              <ButtonLink
                href="/about"
                className="!bg-oat !text-forest hover:!bg-sage/40"
              >
                Meet the makers
              </ButtonLink>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <ul className="space-y-10 border-t border-oat/15 pt-10">
              {[
                ["No preservatives", "Fruit, dried carefully, packed clean."],
                [
                  "Sizes that make sense",
                  "From 50g snacks to 1kg kitchen packs.",
                ],
                [
                  "Pay the Ghana way",
                  "Card, MoMo on Paystack, or cash on delivery.",
                ],
              ].map(([title, body]) => (
                <li key={title} className="border-b border-oat/15 pb-10">
                  <p className="font-display text-2xl font-medium md:text-3xl">
                    {title}
                  </p>
                  <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-oat/60">
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-10 md:col-start-2 md:mt-8">
            <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-[2rem] bg-sage/20">
              <Image
                src="/products/coconut-banner.jpg"
                alt="Yeskoko dried coconut and fruit chips"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 80vw"
              />
            </div>
          </div>
        </div>
      </StoryReveal>
    </>
  );
}
