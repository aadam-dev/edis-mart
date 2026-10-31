import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { processSteps } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Yeskoko dried fruit is made",
  description:
    "From dehusking to nitrogen-flush packing — the Accra process behind Yeskoko coconut flakes and fruit chips.",
  alternates: { canonical: absoluteUrl("/process") },
};

export default function ProcessPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-[1100px] px-4 pt-16 md:px-6 md:pt-24">
        <Reveal>
          <p className="label-caps text-sage">Process</p>
          <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
            Tree to crisp, in six steps
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-forest/70 md:text-xl">
            Yeskoko snacks are dried and packed in Accra without preservatives.
            This is the production sequence Edis Mart runs for coconut flakes
            and tropical fruit chips.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1100px] gap-10 px-4 md:mt-20 md:grid-cols-12 md:px-6">
        <div className="relative aspect-[4/5] overflow-hidden md:col-span-5">
          <Image
            src="/film/ghana/03-process/poster.jpg"
            alt="Dried fruit on dehydration trays"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 40vw"
            priority
          />
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {processSteps.map((step, i) => (
            <Reveal key={step.title} delay={0.04 * i}>
              <li className="border-t border-mist py-7">
                <p className="label-caps text-sage">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-3xl font-medium text-forest">
                  {step.title}
                </h2>
                <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-forest/65">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-16 max-w-[1100px] px-4 md:px-6">
        <Reveal>
          <div className="flex flex-wrap gap-3 border-t border-mist pt-10">
            <ButtonLink href="/export">Talk export</ButtonLink>
            <ButtonLink href="/shop" variant="secondary">
              Shop the snacks
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
