import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "About Edis Mart and Yeskoko",
  description:
    "The Ghana house behind Yeskoko dried fruit snacks.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14 md:px-6 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-leaf">
        Who we are
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Edis Mart makes Yeskoko
      </h1>
      <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-ink/75">
        Edis Mart makes Yeskoko: coconut flakes, mango chips, and dried fruit
        snacks for people who want natural food without the filler. Founded by
        Mavis Walker Blagodzi with co-founder Robert Agyeman Newman. We source
        carefully, dry without preservatives, and pack in Accra for Ghana and
        beyond.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden border border-mist bg-mist">
          <Image
            src="/products/yeskoko.jpg"
            alt="Yeskoko packaging"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-8 self-center">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Mavis Walker Blagodzi
            </h2>
            <p className="mt-1 text-sm font-semibold text-leaf">Founder</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Accounting background, health focus, and a drive to build a
              trusted Ghana snack brand around quality and fair sourcing.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Robert Agyeman Newman
            </h2>
            <p className="mt-1 text-sm font-semibold text-leaf">Co-founder</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Biochemistry expertise guiding how Yeskoko preserves nutrition and
              taste without additives.
            </p>
          </div>
          <ButtonLink href="/shop">Shop the flakes</ButtonLink>
        </div>
      </div>
    </div>
  );
}
