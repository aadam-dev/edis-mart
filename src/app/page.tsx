import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollRitual } from "@/components/motion/ScrollRitual";
import { FruitFields } from "@/components/FruitFields";
import { PackYourMix } from "@/components/PackYourMix";
import { ButtonLink } from "@/components/ButtonLink";
import {
  brandVoice,
  buyerRouteSteps,
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

      {/* The line */}
      <section
        id="line"
        className="flex min-h-[100svh] items-center border-t border-mist/80 bg-oat"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 py-20 md:px-6 md:py-28">
          <p className="label-caps text-sage">Yeskoko by Edis Mart</p>
          <h2 className="mt-6 max-w-[16ch] font-display text-4xl font-medium leading-[1.05] tracking-tight text-forest md:text-6xl lg:text-7xl">
            Ghanaian fruit,
            <br />
            clearly made,
            <br />
            <em className="italic">clearly documented.</em>
          </h2>
          <p className="mt-8 label-caps text-forest/45">
            Founded 2015 · Dried foods since 2020 · Female-led · Packed in Accra
          </p>
        </div>
      </section>

      <FruitFields />

      <PackYourMix />

      {/* How it's made */}
      <section
        id="process"
        className="border-t border-mist/80 bg-forest text-oat"
      >
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-12 md:gap-10 md:px-6 md:py-24">
          <div className="md:col-span-5">
            <p className="label-caps text-oat/45">Process</p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
              Six steps <em className="italic">from fruit to pouch.</em>
            </h2>
            <Link
              href="/process"
              className="mt-8 inline-flex text-sm font-semibold text-oat/80 underline-offset-4 transition hover:text-oat hover:underline"
            >
              See the process →
            </Link>
          </div>
          <ol className="grid gap-0 sm:grid-cols-2 md:col-span-7">
            {processSteps.map((step, i) => (
              <li
                key={step.title}
                className="border-t border-oat/15 py-6 sm:odd:pr-6 sm:even:pl-6"
              >
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
            ))}
          </ol>
        </div>
      </section>

      {/* What we can show you */}
      <section
        id="trust"
        className="border-t border-mist/80 bg-oat"
        aria-label="Documentation and proof"
      >
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
          <p className="label-caps text-clay">Quality</p>
          <h2 className="mt-4 max-w-[18ch] font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
            What we can <em className="italic">put on the table.</em>
          </h2>
          <dl className="mt-12 space-y-0">
            {qualityMatrix.map((item) => (
              <div
                key={item.title}
                className="grid gap-2 border-t border-forest/15 py-6 md:grid-cols-12 md:gap-6"
              >
                <dt className="label-caps text-sage md:col-span-3">
                  {item.status}
                </dt>
                <dd className="md:col-span-9">
                  <p className="font-display text-2xl font-medium text-forest">
                    {item.title}
                  </p>
                  <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-forest/65">
                    {item.body}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-forest/55">
            Copies of every document come with the buyer pack.
          </p>
        </div>
      </section>

      {/* From our trays to your shelf */}
      <section id="trade" className="border-t border-mist/80 bg-table">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
          <p className="label-caps text-clay">For buyers</p>
          <h2 className="mt-4 max-w-[16ch] font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
            From our trays <em className="italic">to your shelf.</em>
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-forest/65">
            For importers, distributors and specialty retailers in the UK, EU
            and US.
          </p>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {buyerRouteSteps.map((step, i) => (
              <li key={step.title} className="border-t border-forest/15 pt-5">
                <p className="label-caps text-clay">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-xl font-medium text-forest">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest/60">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <ButtonLink href="/export">Request the buyer pack</ButtonLink>
          </div>
        </div>
      </section>

      {/* The people — tray still; do not claim generated faces as the team */}
      <section
        id="sourcing"
        className="relative min-h-[100svh] overflow-hidden border-t border-mist/80"
      >
        <Image
          src="/film/ghana/03-process/poster.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/35 to-forest/10" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] items-end px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-[40rem] text-oat">
            <p className="label-caps text-oat/55">Sourcing</p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
              Female-led. Farmer-sourced.{" "}
              <em className="italic">Packed in Accra.</em>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-oat/75 md:text-lg">
              Edis Mart began in 2015 and moved into dried foods in 2020.
              Yeskoko snacks are sourced from local farmers and packed in Accra
              for shelves at home and buyers abroad.
            </p>
            <Link
              href="/sourcing"
              className="mt-8 inline-flex text-sm font-semibold text-oat underline-offset-4 hover:underline"
            >
              Read the sourcing story →
            </Link>
          </div>
        </div>
      </section>

      {/* In Ghana? */}
      <section
        id="ghana"
        className="border-t border-mist/80 bg-field-mango text-forest"
      >
        <div className="mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-center px-4 py-16 md:px-6 md:py-24">
          <p className="label-caps text-forest/55">Domestic</p>
          <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-medium tracking-tight md:text-6xl">
            In Ghana? <em className="italic">It&apos;s on the shelf.</em>
          </h2>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-forest/75 md:text-lg">
            Accra, Tamale, Cape Coast and Ho. Or order online: Paystack, MoMo or
            cash on delivery where offered.
          </p>
          <div className="mt-10">
            <ButtonLink href="/shop">Shop Yeskoko</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
