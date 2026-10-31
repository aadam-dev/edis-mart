import type { Metadata } from "next";
import { whatsappLink, absoluteUrl } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Wholesale dried fruit Ghana",
  description:
    "Domestic wholesale Yeskoko coconut flakes and fruit chips for Ghana retailers, hotels, and kitchens.",
  alternates: { canonical: absoluteUrl("/wholesale") },
};

export default function WholesalePage() {
  const message =
    "Hi Yeskoko, I want Ghana wholesale pricing. Business: ... Sizes: ... Volume: ... City: Accra";

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <p className="label-caps text-clay">Ghana wholesale</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
          Stock Yeskoko at home
        </h1>
        <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-forest/70 md:text-xl">
          For Ghana retailers, hotels, and kitchens that restock often. Tell us
          your business, sizes, and volume on WhatsApp — we quote from Accra.
          International importers should use the Export desk instead.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["Coconut flakes", "50g to 700g wholesale rates"],
          ["Chia coco", "100g and 250g food-service packs"],
          ["Pineapple chips", "100g wholesale pricing on request"],
          ["Mango chips", "100g wholesale pricing on request"],
        ].map(([title, body], i) => (
          <Reveal key={title} delay={0.1 + i * 0.05}>
            <div className="border-t border-mist/80 pt-6">
              <p className="font-display text-2xl font-medium text-forest">
                {title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-forest/65">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-16 flex flex-wrap gap-4">
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 text-sm font-semibold tracking-wide text-oat transition duration-500 hover:bg-clay active:scale-[0.98]"
          >
            Message wholesale
          </a>
          <ButtonLink href="/export" variant="secondary">
            International export
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost">
            Browse retail
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
