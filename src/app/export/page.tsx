import type { Metadata } from "next";
import { Suspense } from "react";
import { TradeInquiryForm } from "@/components/TradeInquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { brandVoice, qualityMatrix } from "@/lib/content";
import { absoluteUrl, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Export dried fruit from Ghana",
  description:
    "Source Yeskoko coconut flakes, mango and pineapple chips from Edis Mart in Ghana. Request a buyer pack for UK, EU, and US import discussions.",
  alternates: { canonical: absoluteUrl("/export") },
  openGraph: {
    title: "Export Yeskoko dried fruit from Ghana",
    description: brandVoice.exportLine,
    url: absoluteUrl("/export"),
    images: [{ url: "/film/ghana/04-family/poster.jpg" }],
  },
};

export default function ExportPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-mist/80">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(23,59,42,0.12),transparent_50%),radial-gradient(ellipse_at_10%_20%,rgba(224,161,40,0.12),transparent_40%)]"
        />
        <div className="relative mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
          <Reveal>
            <p className="label-caps text-clay">For importers & distributors</p>
            <h1 className="mt-4 max-w-[16ch] font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
              Ghana dried fruit for your market
            </h1>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-forest/70 md:text-xl">
              Yeskoko by Edis Mart supplies coconut flakes, chia coco, mango
              chips, and pineapple chips dried and packed in Accra.{" "}
              {brandVoice.exportLine} Request a buyer pack — we share
              documentation status, formats, and next steps without inventing
              certifications we do not yet hold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#inquiry"
                className="focus-ring inline-flex rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-oat transition hover:bg-clay"
              >
                Request buyer pack
              </a>
              <ButtonLink href="/wholesale" variant="secondary">
                Ghana wholesale instead
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <p className="label-caps text-sage">What we offer</p>
          <h2 className="mt-4 font-display text-4xl font-medium text-forest md:text-5xl">
            Products & formats
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            ["Coconut flakes", "Sweetened and unsweetened retail and kitchen sizes — discuss bulk formats for your channel."],
            ["Chia coco", "Coconut blend with chia, sesame, cinnamon, date, and honey."],
            ["Mango & pineapple chips", "100g retail pouches today; larger formats by conversation."],
            ["Private label", "Contract packing conversations welcome — capability depends on volume and specs."],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={0.05 * i}>
              <article className="border-t border-mist pt-5">
                <h3 className="font-display text-2xl font-medium text-forest">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-forest/65">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest text-oat">
        <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-20">
          <Reveal>
            <p className="label-caps text-oat/45">Quality matrix</p>
            <h2 className="mt-4 font-display text-4xl font-medium md:text-5xl">
              Documented · market proof · roadmap
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {qualityMatrix.map((item) => (
              <article key={item.title} className="border-t border-oat/15 pt-5">
                <p className="label-caps text-oat/45">{item.status}</p>
                <h3 className="mt-2 font-display text-2xl font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-oat/65">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-[60ch] text-sm text-oat/55">
            We do not claim HACCP, ISO, BRC, organic, GSA-certified, or foreign
            market approval unless a current document is in the buyer pack.
          </p>
        </div>
      </section>

      <section id="inquiry" className="mx-auto max-w-[800px] px-4 py-16 md:px-6 md:py-24">
        <Reveal>
          <p className="label-caps text-clay">Buyer pack</p>
          <h2 className="mt-4 font-display text-4xl font-medium text-forest md:text-5xl">
            Tell us your market
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-forest/65">
            Share organization, products, volume band, and certification needs.
            We reply with documentation status and a conversation — not a
            automated quote that invents MOQs or lead times.
          </p>
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<div className="border border-forest/10 bg-oat/60 p-8 text-sm text-forest/60">Loading inquiry form…</div>}>
            <TradeInquiryForm />
          </Suspense>
        </div>
        <p className="mt-6 text-sm text-forest/55">
          Prefer WhatsApp?{" "}
          <a
            className="font-semibold text-forest underline-offset-4 hover:underline"
            href={whatsappLink(
              "Hi Edis Mart / Yeskoko — I am an importer/distributor interested in a buyer pack. Market: ... Products: ...",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message trade on WhatsApp
          </a>
        </p>
      </section>
    </div>
  );
}
