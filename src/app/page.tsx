import {
  getFeaturedProducts,
} from "@/data/catalog";
import { HomeHero } from "@/components/motion/HomeHero";
import { TaglineReveal } from "@/components/motion/TaglineReveal";
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

      <section className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            The pantry
          </h2>
          <p className="mt-3 max-w-[50ch] text-ink/70">
            Coconut flakes and fruit chips in retail sizes. Wholesale on request.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/shop" variant="secondary">
            View all snacks
          </ButtonLink>
        </div>
      </section>

      <TaglineReveal />

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Dried in Ghana. Packed for your pantry.
          </h2>
          <p className="mt-4 max-w-[55ch] leading-relaxed text-ink/70">
            Edis Mart makes Yeskoko for people who want natural snacks without
            the filler. Founders Mavis Walker Blagodzi and Robert Agyeman Newman
            built the line around real fruit, clear sizes, and Accra delivery.
          </p>
          <div className="mt-8">
            <ButtonLink href="/about">Meet the makers</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="grid gap-4">
            {[
              ["No preservatives", "Fruit, dried carefully, packed clean."],
              ["Sizes that make sense", "From 50g snacks to 1kg kitchen packs."],
              ["Pay the Ghana way", "Card, MoMo on Paystack, or cash on delivery."],
            ].map(([title, body]) => (
              <li
                key={title}
                className="border border-mist bg-white p-5 transition hover:border-leaf/30"
              >
                <p className="font-display text-xl font-semibold">{title}</p>
                <p className="mt-1 text-sm text-ink/65">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
