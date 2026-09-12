import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Shipping, payment, and wholesale answers for Yeskoko.",
};

const faqs = [
  {
    q: "How do I pay?",
    a: "Card or Mobile Money through Paystack, cash on delivery in Accra, or WhatsApp order confirmation.",
  },
  {
    q: "Do you deliver in Accra?",
    a: "Yes. A flat Accra delivery fee is added at checkout. Pickup can be arranged when you leave a note.",
  },
  {
    q: "What sizes do you sell?",
    a: "Retail sizes from 50g to 1kg depending on the product. Wholesale packs are available on request.",
  },
  {
    q: "Are there preservatives?",
    a: "Yeskoko snacks are made without preservatives. Ingredients stay close to the fruit.",
  },
  {
    q: "How do wholesale orders work?",
    a: "Message us on WhatsApp with sizes and volume. We quote and confirm delivery from Accra.",
  },
  {
    q: "Is pineapple chips available?",
    a: "Packaging exists. Use Request a batch on the pineapple product page and we will quote.",
  },
];

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
    <div className="mx-auto max-w-[800px] px-4 py-14 md:px-6 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="font-display text-4xl font-semibold tracking-tight">FAQ</h1>
      <dl className="mt-10 space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="border-b border-mist pb-6">
            <dt className="font-display text-xl font-semibold">{f.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
