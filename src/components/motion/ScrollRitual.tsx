"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonLink } from "@/components/ButtonLink";
import { formatGhs } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

export type RitualBeat = {
  slug: string;
  name: string;
  line: string;
  image: string;
  fromPesewas: number;
};

type Props = {
  beats: RitualBeat[];
};

export function ScrollRitual({ beats }: Props) {
  const reduce = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [canPin, setCanPin] = useState(false);
  const current = beats[active] ?? beats[0];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setCanPin(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (
      !ready ||
      reduce ||
      !canPin ||
      !pinRef.current ||
      !stageRef.current ||
      beats.length < 2
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * beats.length}`,
        pin: stageRef.current,
        scrub: 0.65,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            beats.length - 1,
            Math.floor(self.progress * beats.length * 0.999),
          );
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
    }, pinRef);

    return () => ctx.revert();
  }, [ready, reduce, canPin, beats.length]);

  if (!beats.length) return null;

  // Stack until mounted so SSR and the first paint match.
  const showStack = !ready || !!reduce || !canPin;

  return (
    <section
      aria-label="The pantry, product by product"
      className="border-y border-mist/70 bg-oat"
    >
      {showStack ? (
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
          <header className="max-w-[28ch]">
            <h2 className="font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
              The pantry
            </h2>
            <p className="mt-4 text-base leading-relaxed text-forest/60">
              Four packs. Clear sizes. Prices you can finish.
            </p>
          </header>
          <ol className="mt-14 space-y-16">
            {beats.map((beat, i) => (
              <li key={beat.slug}>
                <BeatCard beat={beat} index={i} total={beats.length} />
              </li>
            ))}
          </ol>
          <div className="mt-16">
            <ButtonLink href="/shop">Shop the flakes</ButtonLink>
          </div>
        </div>
      ) : (
        <div ref={pinRef} className="relative">
          <div
            ref={stageRef}
            className="relative flex h-dvh flex-col justify-between overflow-hidden bg-oat"
          >
            <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-12 items-center gap-6 px-6 py-24">
              <div className="relative z-10 col-span-5 self-center">
                <p className="label-caps text-clay tabular-nums">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(beats.length).padStart(2, "0")}
                </p>
                <div
                  key={current?.slug}
                  className="mt-6 animate-[fadeRise_0.45s_cubic-bezier(0.22,1,0.36,1)]"
                >
                  <h2 className="max-w-[14ch] font-display text-[clamp(2.5rem,4.8vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-forest">
                    {current?.line}
                  </h2>
                  <p className="mt-5 font-display text-2xl text-forest/80">
                    {current?.name}
                  </p>
                  <p className="mt-2 text-sm tabular-nums text-forest/55">
                    From {formatGhs(current?.fromPesewas)}
                  </p>
                  <Link
                    href={`/product/${current?.slug}`}
                    className="focus-ring mt-8 inline-flex text-sm font-semibold tracking-wide text-clay underline-offset-4 transition hover:underline"
                  >
                    View {current?.name}
                  </Link>
                </div>
              </div>

              <div className="relative col-span-7 flex h-full items-center justify-center">
                {beats.map((beat, i) => (
                  <div
                    key={beat.slug}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        i === active ? "scale(1)" : "scale(0.92)",
                      pointerEvents: "none",
                    }}
                  >
                    <div className="relative aspect-[4/5] w-[min(52%,420px)]">
                      <Image
                        src={beat.image}
                        alt={beat.name}
                        fill
                        className="object-contain drop-shadow-[0_24px_48px_rgba(35,48,31,0.18)]"
                        sizes="(max-width:1024px) 40vw, 420px"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 border-t border-mist/60 bg-oat/90 backdrop-blur-[2px]">
              <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5">
                <nav aria-label="Pantry steps" className="flex flex-1 items-center gap-3">
                  <div className="relative h-px flex-1 bg-mist">
                    <div
                      className="absolute inset-y-0 left-0 bg-clay transition-[width] duration-300 ease-out"
                      style={{
                        width: `${((active + 1) / beats.length) * 100}%`,
                      }}
                    />
                  </div>
                  <ol className="hidden gap-4 lg:flex">
                    {beats.map((beat, i) => (
                      <li
                        key={beat.slug}
                        className={`label-caps transition-colors ${
                          i === active ? "text-clay" : "text-forest/35"
                        }`}
                      >
                        {beat.name.split(" ")[0]}
                      </li>
                    ))}
                  </ol>
                </nav>
                <ButtonLink href="/shop">Shop the flakes</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function BeatCard({
  beat,
  index,
  total,
}: {
  beat: RitualBeat;
  index: number;
  total: number;
}) {
  return (
    <Link
      href={`/product/${beat.slug}`}
      className="focus-ring group grid gap-8 sm:grid-cols-12 sm:items-center"
    >
      <div className="sm:col-span-5">
        <p className="label-caps text-clay tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-4 max-w-[16ch] font-display text-3xl font-medium leading-[1.1] tracking-tight text-forest transition group-hover:text-clay md:text-4xl">
          {beat.line}
        </h3>
        <p className="mt-4 font-display text-xl text-forest/75">{beat.name}</p>
        <p className="mt-1 text-sm tabular-nums text-forest/55">
          From {formatGhs(beat.fromPesewas)}
        </p>
      </div>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] sm:col-span-6 sm:col-start-7 sm:max-w-none">
        <Image
          src={beat.image}
          alt={beat.name}
          fill
          className="object-contain"
          sizes="(max-width:640px) 70vw, 320px"
        />
      </div>
    </Link>
  );
}
