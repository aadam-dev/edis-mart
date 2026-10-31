import type { Metadata } from "next";
import { faqs } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Yeskoko ingredients, Ghana payments, wholesale, and export documentation.",
  alternates: { canonical: absoluteUrl("/faq") },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-[860px] px-4 py-16 md:px-6 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="label-caps text-sage">FAQ</p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl">
        Straight answers
      </h1>
      <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-forest/65">
        From Accra retail to international trade — {site.company} keeps claims
        tied to what we can document.
      </p>
      <dl className="mt-12 divide-y divide-mist border-t border-mist">
        {faqs.map((f) => (
          <div key={f.q} className="py-8">
            <dt className="font-display text-2xl font-medium text-forest md:text-3xl">
              {f.q}
            </dt>
            <dd className="mt-3 max-w-[58ch] text-base leading-relaxed text-forest/65">
              {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
