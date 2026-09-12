import type { Metadata } from "next";
import { whatsappLink } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "Wholesale coconut flakes Ghana",
  description:
    "Wholesale Yeskoko coconut flakes for retailers and food service.",
};

export default function WholesalePage() {
  const message =
    "Hi Yeskoko, I want wholesale pricing. Business: ... Sizes: ... Volume: ... City: Accra";

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Stock Yeskoko
      </h1>
      <p className="mt-4 max-w-[55ch] text-lg text-ink/70">
        Retailers, hotels, and bulk buyers. Tell us sizes and volume. We reply
        on WhatsApp.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Sweetened flakes", "50g to 700g wholesale rates"],
          ["Unsweetened flakes", "250g to 1kg kitchen packs"],
          ["Chia chia coco", "Built for food service volume"],
        ].map(([title, body]) => (
          <div key={title} className="border border-mist bg-white p-5">
            <p className="font-display text-xl font-semibold">{title}</p>
            <p className="mt-2 text-sm text-ink/65">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex rounded-full bg-leaf px-5 py-3 text-base font-semibold text-white hover:bg-forest"
        >
          Message wholesale
        </a>
        <ButtonLink href="/shop" variant="secondary">
          Browse retail
        </ButtonLink>
      </div>
    </div>
  );
}
