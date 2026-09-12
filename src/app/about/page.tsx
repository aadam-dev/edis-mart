import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

export const metadata: Metadata = {
  title: "About Edis Mart and Yeskoko",
  description:
    "The Ghana house behind Yeskoko dried fruit snacks.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <p className="label-caps text-sage">
          Who we are
        </p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-forest md:text-6xl lg:text-7xl">
          Edis Mart makes Yeskoko
        </h1>
        <p className="mt-6 max-w-[55ch] text-lg leading-relaxed text-forest/70 md:text-xl">
          Edis Mart makes Yeskoko: coconut flakes, mango chips, and dried fruit
          snacks for people who want natural food without the filler. Founded by
          Mavis Walker Blagodzi with co-founder Robert Agyeman Newman. We source
          carefully, dry without preservatives, and pack in Accra for Ghana and
          beyond.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal delay={0.1}>
          <ParallaxMedia speed={0.08}>
            <div className="arch-mask relative aspect-[4/5] overflow-hidden bg-sage/20">
              <Image
                src="/products/yeskoko.jpg"
                alt="Yeskoko packaging"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </ParallaxMedia>
        </Reveal>
        
        <div className="space-y-12 self-center">
          <Reveal delay={0.2}>
            <h2 className="font-display text-3xl font-medium text-forest">
              Mavis Walker Blagodzi
            </h2>
            <p className="mt-1 text-sm font-medium text-clay">Founder</p>
            <p className="mt-4 text-base leading-relaxed text-forest/65">
              Accounting background, health focus, and a drive to build a
              trusted Ghana snack brand around quality and fair sourcing.
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <h2 className="font-display text-3xl font-medium text-forest">
              Robert Agyeman Newman
            </h2>
            <p className="mt-1 text-sm font-medium text-clay">Co-founder</p>
            <p className="mt-4 text-base leading-relaxed text-forest/65">
              Biochemistry expertise guiding how Yeskoko preserves nutrition and
              taste without additives.
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <div className="pt-4">
              <ButtonLink href="/shop">Shop the flakes</ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
