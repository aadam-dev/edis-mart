import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { absoluteUrl, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Yeskoko / Edis Mart",
  description:
    "Retail questions, Ghana wholesale, or international trade inquiries for Yeskoko dried fruit snacks.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <p className="label-caps text-clay">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl">
          Two doors: Ghana retail & trade
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-forest/70">
          Choose the path that matches your order. Hours {site.hours}, Accra
          time.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <Reveal delay={0.05}>
          <article className="border border-mist bg-oat/50 p-6 md:p-8">
            <p className="label-caps text-sage">Ghana retail & wholesale</p>
            <h2 className="mt-3 font-display text-3xl text-forest">Shop & restock</h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/65">
              Orders, delivery in Accra, MoMo/card/COD questions, and domestic
              wholesale volumes.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-forest/80">
              <li>
                <a className="font-medium hover:text-clay" href={`tel:${site.phones[0]}`}>
                  {site.phones[0]}
                </a>
              </li>
              <li>
                <a className="font-medium hover:text-clay" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/shop">Shop</ButtonLink>
              <a
                href={whatsappLink("Hi Yeskoko — retail / wholesale question:")}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex rounded-full border border-forest/20 px-5 py-3 text-sm font-semibold text-forest"
              >
                WhatsApp
              </a>
            </div>
          </article>
        </Reveal>
        <Reveal delay={0.1}>
          <article className="border border-forest/20 bg-forest p-6 text-oat md:p-8">
            <p className="label-caps text-oat/45">International trade</p>
            <h2 className="mt-3 font-display text-3xl">Importers & distributors</h2>
            <p className="mt-3 text-sm leading-relaxed text-oat/70">
              Buyer pack requests, documentation status, formats, and private-label
              conversations for UK / EU / US markets.
            </p>
            <div className="mt-6">
              <ButtonLink href="/export" className="!bg-oat !text-forest hover:!bg-cream">
                Open export desk
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  );
}
