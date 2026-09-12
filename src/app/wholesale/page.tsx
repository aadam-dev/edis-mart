import type { Metadata } from "next";
import { whatsappLink } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Wholesale coconut flakes Ghana",
  description:
    "Wholesale Yeskoko coconut flakes for retailers and food service.",
};

export default function WholesalePage() {
  const message =
    "Hi Yeskoko, I want wholesale pricing. Business: ... Sizes: ... Volume: ... City: Accra";

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <h1 className="font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
          Stock Yeskoko
        </h1>
        <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-forest/70 md:text-xl">
          Retailers, hotels, and bulk buyers. Tell us sizes and volume. We reply
          on WhatsApp.
        </p>
      </Reveal>
      
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["Sweetened flakes", "50g to 700g wholesale rates"],
          ["Unsweetened flakes", "250g to 1kg kitchen packs"],
          ["Chia chia coco", "Built for food service volume"],
        ].map(([title, body], i) => (
          <Reveal key={title} delay={0.1 + i * 0.05}>
            <div className="border-t border-mist/80 pt-6">
              <p className="font-display text-2xl font-medium text-forest">{title}</p>
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
            className="focus-ring inline-flex items-center justify-center rounded-full bg-clay px-6 py-3.5 text-sm font-semibold tracking-wide text-oat transition duration-500 hover:bg-forest active:scale-[0.98]"
          >
            Message wholesale
          </a>
          <ButtonLink href="/shop" variant="secondary">
            Browse retail
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
