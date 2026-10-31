import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ghana sourcing and impact",
  description:
    "Local farmer sourcing, female-led production in Accra, and Yeskoko’s Ghana retail footprint — without inventing unverified claims.",
  alternates: { canonical: absoluteUrl("/sourcing") },
};

export default function SourcingPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-[1100px] px-4 pt-16 md:px-6 md:pt-24">
        <Reveal>
          <p className="label-caps text-clay">Sourcing</p>
          <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
            Fruit from Ghana farms. Packs from Accra.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-forest/70 md:text-xl">
            Edis Mart sources coconut and tropical fruit from local farmers and
            packs Yeskoko snacks in Accra. The brand is female-led — founded in
            2015, with dried foods since 2020 — and sold through partners across
            Accra, Tamale, Cape Coast, and Ho.
          </p>
        </Reveal>
      </div>

      <section className="mx-auto mt-16 grid max-w-[1100px] gap-10 px-4 md:mt-24 md:grid-cols-2 md:px-6">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/film/ghana/01-canopy/poster.jpg"
              alt="Ghana palm canopy"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <h2 className="mt-6 font-display text-3xl font-medium text-forest">
            Local farmers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-forest/65">
            Coconut, mango, and pineapple enter production from Ghanaian
            growers. We talk about sourcing specifically — we do not claim
            fair-trade certification or a quantified “100% traceable” chain
            without ledgers to match.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/film/ghana/06-makers/poster.jpg"
              alt="Production team packing dried fruit"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <h2 className="mt-6 font-display text-3xl font-medium text-forest">
            Women-led house
          </h2>
          <p className="mt-3 text-base leading-relaxed text-forest/65">
            Edis Mart is led by founder Mavis Walker Blagodzi. The team trains
            around drying and packing work in Accra — building a Ghana snack
            brand that can stand on export shelves without pretending to be a
            commodity trader.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-[1100px] border-t border-mist px-4 pt-12 md:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-forest md:text-4xl">
            Ghana shelf proof
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-forest/65">
            Yeskoko reaches shoppers through retailers and sales agents in major
            Ghana cities. Individual store names stay private unless partners
            approve public listing.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {["Accra", "Tamale", "Cape Coast", "Ho"].map((city) => (
              <li
                key={city}
                className="border-t border-mist pt-4 font-display text-2xl text-forest"
              >
                {city}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/export">Request buyer pack</ButtonLink>
            <ButtonLink href="/about" variant="secondary">
              About Edis Mart
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
