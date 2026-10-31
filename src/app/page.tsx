import { HomeHero } from "@/components/motion/HomeHero";
import { Marquee } from "@/components/motion/Marquee";
import { TaglineReveal } from "@/components/motion/TaglineReveal";
import { StoryReveal } from "@/components/motion/StoryReveal";
import { ScrollRitual } from "@/components/motion/ScrollRitual";
import { PantryPack } from "@/components/motion/PantryPack";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

const ritualBeats = [
  {
    slug: "yeskoko-sweetened-coconut-flakes",
    name: "Coconut flakes",
    line: "Coconut that still tastes like fruit.",
    image: "/products/yeskoko.jpg",
    fromPesewas: 1500,
  },
  {
    slug: "chia-chia-coco",
    name: "Chia coco",
    line: "Coconut, chia, sesame, cinnamon, date, and honey.",
    image: "/products/chia.jpg",
    fromPesewas: 4500,
  },
  {
    slug: "pineapple-chips",
    name: "Pineapple chips",
    line: "Sweet-tangy chips from real pineapple.",
    image: "/products/pineapple.jpg",
    fromPesewas: 3500,
  },
  {
    slug: "mango-chips",
    name: "Mango chips",
    line: "Sun-ripened mango, gently dried.",
    image: "/products/mango.jpg",
    fromPesewas: 3500,
  },
] as const;

const storyPoints = [
  ["No preservatives", "Fruit, dried carefully, packed clean."],
  ["Sizes that make sense", "From 50g snacks to 700g kitchen packs."],
  ["Pay the Ghana way", "Card, MoMo on Paystack, or cash on delivery."],
] as const;

export default function HomePage() {
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
      <Marquee />
      <ScrollRitual beats={[...ritualBeats]} />
      <PantryPack />
      <TaglineReveal />

      <StoryReveal>
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-28 pt-40 md:grid-cols-12 md:gap-10 md:px-6 md:pb-40 md:pt-52">
          <div className="md:col-span-6">
            <p className="label-caps text-oat/45">Accra · Ghana</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Dried in Ghana.
              <br />
              <em className="italic">Packed for your pantry.</em>
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-oat/70 md:text-lg">
              Edis Mart makes Yeskoko for people who want natural snacks without
              the filler. Founders Mavis Walker Blagodzi and Robert Agyeman
              Newman built the line around real fruit, clear sizes, and Accra
              delivery — a Ghana house behind a snack you can trust on the
              shelf.
            </p>
            <div className="mt-10">
              <ButtonLink
                href="/about"
                className="!bg-oat !text-forest hover:!bg-sage/40"
              >
                Meet the makers
              </ButtonLink>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <ul className="space-y-10 border-t border-oat/15 pt-10">
              {storyPoints.map(([title, body]) => (
                <li key={title} className="border-b border-oat/15 pb-10">
                  <p className="font-display text-2xl font-medium md:text-3xl">
                    {title}
                  </p>
                  <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-oat/60">
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StoryReveal>

      <section className="border-t border-mist bg-oat">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 py-20 md:flex-row md:items-end md:justify-between md:px-6 md:py-28">
          <Reveal>
            <h2 className="font-display text-4xl font-medium tracking-tight text-forest md:text-5xl lg:text-6xl">
              Open the pantry.
            </h2>
            <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-forest/60 md:text-lg">
              Pick a size. Checkout with MoMo, card, or cash on delivery.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/shop">Shop the flakes</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
