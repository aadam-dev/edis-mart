import type { Metadata } from "next";
import Image from "next/image";
import { ScrollRitual } from "@/components/motion/ScrollRitual";
import { ProductWorlds } from "@/components/ProductWorlds";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";
import {
  brandVoice,
  processSteps,
  qualityMatrix,
} from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Yeskoko — Ghanaian dried fruit snacks | Edis Mart",
  },
  description:
    "Yeskoko by Edis Mart: coconut flakes, chia coco, mango and pineapple chips dried in Ghana. Request a buyer pack for UK/EU/US trade, or shop retail in Ghana.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Yeskoko — Dried in Ghana. Distinct on shelf.",
    description: brandVoice.promise,
    url: absoluteUrl("/"),
    images: [{ url: "/film/ghana/04-family/poster.jpg" }],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Yeskoko",
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.company,
        legalName: site.company,
        brand: { "@type": "Brand", name: "Yeskoko" },
        url: site.url,
        email: site.email,
        telephone: site.phones[0],
        logo: absoluteUrl("/brand/logo.jpg"),
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.country,
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#localbusiness`,
        name: "Edis Mart (Yeskoko)",
        parentOrganization: { "@id": `${site.url}/#organization` },
        telephone: site.phones[0],
        email: site.email,
        url: site.url,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
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

      <ScrollRitual />

      {/* Brand promise — dual CTAs immediately under the film */}
      <section
        id="promise"
        className="border-t border-mist/80 bg-cream"
        aria-label="Brand promise"
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-6 md:py-16">
          <Reveal>
            <p className="label-caps text-sage">Yeskoko</p>
            <h2 className="mt-3 max-w-[18ch] font-display text-3xl font-medium tracking-tight text-forest md:text-5xl">
              {brandVoice.exportLine}
            </h2>
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-forest/65">
              {brandVoice.promise} Importers get a clear buyer pack. Ghana
              kitchens get the retail pouch.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/export">Request buyer pack</ButtonLink>
              <ButtonLink href="/shop" variant="secondary">
                Shop Ghana
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <ProductWorlds />

      {/* Trust before long process */}
      <section
        id="trust"
        className="proof-strip border-t border-mist/80"
        aria-label="Quality and documentation"
      >
        <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="label-caps text-clay">Quality</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-3xl font-medium tracking-tight text-forest md:text-4xl">
              Documented where we can. Honest about the roadmap.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {qualityMatrix.map((item, i) => (
              <Reveal key={item.title} delay={0.04 * i}>
                <article className="border-t border-forest/15 pt-5">
                  <p className="label-caps text-sage">{item.status}</p>
                  <h3 className="mt-3 font-display text-xl font-medium text-forest md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-forest/65">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="process"
        className="border-t border-mist/80 bg-forest text-oat"
      >
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-12 md:gap-10 md:px-6 md:py-24">
          <div className="md:col-span-5">
            <Reveal>
              <p className="label-caps text-oat/45">Process</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
                Six steps from fruit to pouch.
              </h2>
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-oat/70">
                Dehusk, slice, wash, steam, dehydrate, nitrogen-flush pack —
                dried in Accra without preservatives.
              </p>
              <div className="mt-8">
                <ButtonLink
                  href="/process"
                  className="!bg-oat !text-forest hover:!bg-cream"
                >
                  See the process
                </ButtonLink>
              </div>
            </Reveal>
          </div>
          <ol className="grid gap-0 sm:grid-cols-2 md:col-span-7">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={0.04 * i}>
                <li className="border-t border-oat/15 py-6 sm:odd:pr-6 sm:even:pl-6">
                  <p className="label-caps text-oat/40">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-display text-2xl font-medium">
                    {step.title}
                  </p>
                  <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-oat/60">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="sourcing"
        className="section-band border-t border-mist/80"
      >
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
          <div className="relative aspect-[4/5] overflow-hidden md:col-span-5 md:aspect-[3/4]">
            <Image
              src="/film/ghana/06-makers/poster.jpg"
              alt="Hands packing dried coconut flakes in Accra"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 40vw"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <p className="label-caps text-sage">Sourcing & impact</p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
                Female-led. Farmer-sourced. Accra packed.
              </h2>
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-forest/65 md:text-lg">
                Edis Mart began in 2015 and moved into dried foods in 2020.
                Yeskoko snacks are sourced from local farmers and packed by a
                Ghanaian team that knows the fruit — building skills and shelf
                presence from Accra to Tamale, Cape Coast, and Ho.
              </p>
              <div className="mt-8">
                <ButtonLink href="/sourcing" variant="secondary">
                  Read the sourcing story
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing dual CTA */}
      <section id="trade" className="border-t border-mist/80 bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-caps text-clay">Trade & retail</p>
                <p className="mt-4 font-display text-3xl font-medium text-forest md:text-5xl">
                  {brandVoice.exportLine}
                </p>
                <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-forest/60">
                  Importers and distributors: request the buyer pack. Ghana
                  kitchens and retailers: shop or message wholesale.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/export">Request buyer pack</ButtonLink>
                <ButtonLink href="/shop" variant="secondary">
                  Shop Ghana
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
