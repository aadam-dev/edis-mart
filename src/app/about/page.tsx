import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";
import { absoluteUrl, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Edis Mart and Yeskoko",
  description:
    "Female-led Ghanaian food processor behind Yeskoko — founded 2015, dried foods since 2020, Accra production.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <div className="pb-20 md:pb-28">
      <div className="mx-auto max-w-[1100px] px-4 pt-16 md:px-6 md:pt-24">
        <Reveal>
          <p className="label-caps text-sage">Who we are</p>
          <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
            Edis Mart makes Yeskoko
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-forest/70 md:text-xl">
            Yeskoko is the snack brand. Edis Mart is the Accra house behind it —
            a female-led Ghanaian processor founded in 2015 that moved into
            dried foods in 2020. We dry coconut flakes, chia coco, mango chips,
            and pineapple chips without preservatives, for Ghana pantries and
            buyers abroad.
          </p>
        </Reveal>
      </div>

      <section className="mx-auto mt-20 grid max-w-[1100px] gap-12 px-4 md:mt-28 md:grid-cols-2 md:items-center md:px-6">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-sage/20">
            <Image
              src="/film/ghana/04-family/poster.jpg"
              alt="Yeskoko dried fruit product family"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="label-caps text-clay">Timeline</p>
          <ul className="mt-6 space-y-8 border-t border-mist">
            {[
              ["2015", "Edis Mart founded in Accra."],
              ["2020", "Transition into dried coconut and fruit snacks."],
              ["Today", "Yeskoko retail across key Ghana cities; export conversations open."],
            ].map(([year, body]) => (
              <li key={year} className="border-b border-mist py-6">
                <p className="label-caps text-sage">{year}</p>
                <p className="mt-2 font-display text-2xl text-forest">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-[1100px] px-4 md:mt-32 md:px-6">
        <Reveal>
          <p className="label-caps text-sage">Leadership</p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
            Built in Accra
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <h3 className="font-display text-3xl font-medium text-forest">
              Mavis Walker Blagodzi
            </h3>
            <p className="mt-1 text-sm font-medium text-clay">Founder</p>
            <p className="mt-5 text-base leading-relaxed text-forest/65 md:text-lg">
              Accounting roots and a practical eye for quality. Mavis built
              Yeskoko as a Ghana snack brand people can trust — local sourcing,
              clear packs, and a path toward documented export trade.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="font-display text-3xl font-medium text-forest">
              Robert Agyeman Newman
            </h3>
            <p className="mt-1 text-sm font-medium text-clay">Co-founder</p>
            <p className="mt-5 text-base leading-relaxed text-forest/65 md:text-lg">
              Biochemistry informs how Yeskoko keeps taste without additive
              shortcuts. Focus: dry carefully, pack clean, leave the fruit
              tasting like itself.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-forest/45">
              Leadership attributions follow existing public site records;
              spelling and roles are flagged for owner confirmation against the
              2024 assessment.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1100px] border-t border-mist px-4 pt-16 md:mt-32 md:px-6 md:pt-20">
        <Reveal>
          <h2 className="font-display text-3xl font-medium tracking-tight text-forest md:text-4xl">
            Ready to taste it — or source it?
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-forest/65 md:text-lg">
            Shop Ghana retail, message wholesale, or request an international
            buyer pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop">Shop Ghana</ButtonLink>
            <ButtonLink href="/export" variant="secondary">
              Request buyer pack
            </ButtonLink>
            <a
              href={whatsappLink(
                "Hi Yeskoko, I have a question about your snacks.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center rounded-full border border-mist bg-transparent px-6 py-3.5 text-sm font-semibold tracking-wide text-forest transition duration-500 hover:border-clay/40 hover:text-clay active:scale-[0.98]"
            >
              WhatsApp us
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
