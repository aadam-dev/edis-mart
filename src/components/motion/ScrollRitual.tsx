"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ButtonLink";
import { formatGhs } from "@/lib/site";

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

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function beatMotion(localP: number, isFirst: boolean, isLast: boolean) {
  // localP: 0 at beat start, 0.5 at center, 1 at end
  const enter = isFirst ? 1 : clamp(localP / 0.32);
  const exit = isLast ? 1 : clamp((1 - localP) / 0.32);
  const presence = Math.min(enter, exit);
  const settled = clamp(localP, 0, 1);
  const travel = isFirst && localP < 0.5 ? 28 : isLast && localP > 0.5 ? 18 : 88;
  const opacity = presence;
  const scale = 0.9 + presence * 0.14;
  const y = (0.5 - settled) * travel;
  const tilt = (0.5 - settled) * (isFirst && localP < 0.5 ? 3 : 8);
  return { opacity, scale, y, tilt };
}

function Accent({ index, localP }: { index: number; localP: number }) {
  const drift = (localP - 0.5) * 56 * 1.35;
  const base =
    index === 0
      ? "M12 4c4 3 7 8 7 12a7 7 0 1 1-14 0c0-4 3-9 7-12Z"
      : index === 1
        ? "M8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm6 2a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-3 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm6-1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        : index === 2
          ? "M12 3c3 3 5 6 5 9a5 5 0 1 1-10 0c0-3 2-6 5-9Zm0 9v7"
          : "M5 14c3-6 7-9 11-10-1 5-3 9-7 13-2-1-3-2-4-3Z";

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="absolute h-10 w-10 text-clay/45 md:h-12 md:w-12"
      style={{
        top: index % 2 === 0 ? "12%" : "68%",
        left: index % 2 === 0 ? "8%" : "78%",
        transform: `translate3d(0, ${drift}px, 0) rotate(${drift * 0.2}deg)`,
        opacity: clamp(1 - Math.abs(localP - 0.5) * 1.6),
      }}
      fill="currentColor"
    >
      <path d={base} className={index === 1 ? "text-sage/55" : undefined} />
    </svg>
  );
}

export function ScrollRitual({ beats }: Props) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const current = beats[active] ?? beats[0];

  useEffect(() => {
    if (reduce || !trackRef.current || beats.length < 2) return;
    const el = trackRef.current;
    let frame = 0;

    const update = () => {
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(-el.getBoundingClientRect().top / Math.max(total, 1));
      const idx = Math.min(
        beats.length - 1,
        Math.floor(scrolled * beats.length * 0.999),
      );
      el.style.setProperty("--ritual-p", scrolled.toFixed(4));
      setProgress(scrolled);
      setActive((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce, beats.length]);

  if (!beats.length) return null;

  const jumpToBeat = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const target =
      el.getBoundingClientRect().top +
      window.scrollY +
      ((index + 0.5) / beats.length) * Math.max(total, 0);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      id="ritual"
      aria-label="The pantry, product by product"
      className="border-y border-mist/70 bg-oat"
    >
      <div
        ref={trackRef}
        className={`relative ${reduce ? "h-auto" : "h-[380vh] md:h-[440vh]"}`}
        style={{ ["--ritual-p" as string]: "0" }}
      >
        <div
          className={`flex flex-col overflow-hidden bg-oat ${
            reduce ? "relative min-h-0" : "sticky top-0 h-dvh"
          }`}
        >
          <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 items-stretch gap-4 px-4 pb-28 pt-20 md:grid-cols-12 md:gap-6 md:px-6 md:pb-28 md:pt-24">
            {/* Copy column — lower on mobile, left on desktop */}
            <div className="relative z-10 order-2 flex flex-col justify-end self-stretch md:order-1 md:col-span-5 md:justify-center">
              <p className="label-caps text-clay tabular-nums">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(beats.length).padStart(2, "0")}
              </p>
              <div
                key={current?.slug}
                className="mt-4 animate-[fadeRise_0.45s_cubic-bezier(0.22,1,0.36,1)] md:mt-6"
              >
                <h2 className="max-w-[16ch] font-display text-[clamp(1.85rem,5.2vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-forest">
                  {current?.line}
                </h2>
                <p className="mt-3 font-display text-xl text-forest/80 md:mt-5 md:text-2xl">
                  {current?.name}
                </p>
                <p className="mt-1 text-sm tabular-nums text-forest/55 md:mt-2">
                  From {formatGhs(current?.fromPesewas)}
                </p>
                <Link
                  href={`/product/${current?.slug}`}
                  className="focus-ring mt-5 inline-flex text-sm font-semibold tracking-wide text-clay underline-offset-4 transition hover:underline md:mt-8"
                >
                  View {current?.name}
                </Link>
              </div>
            </div>

            {/* Pouch stage — upper on mobile, right on desktop */}
            <div className="relative order-1 min-h-[42dvh] md:order-2 md:col-span-7 md:min-h-0">
              {beats.map((beat, i) => {
                const localP = progress * beats.length - i;
                const m = reduce
                  ? {
                      opacity: i === active ? 1 : 0,
                      scale: 1,
                      y: 0,
                      tilt: 0,
                    }
                  : beatMotion(localP, i === 0, i === beats.length - 1);
                return (
                  <div
                    key={beat.slug}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                    style={{
                      opacity: m.opacity,
                      transform: `translate3d(0, ${m.y}px, 0) scale(${m.scale}) rotate(${m.tilt}deg)`,
                      pointerEvents: "none",
                    }}
                  >
                    <Accent index={i} localP={localP} />
                    <div className="relative aspect-[4/5] w-[min(58%,280px)] md:w-[min(52%,420px)]">
                      <Image
                        src={beat.image}
                        alt={beat.name}
                        fill
                        className="object-contain drop-shadow-[0_24px_48px_rgba(35,48,31,0.18)]"
                        sizes="(max-width:768px) 60vw, 420px"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-mist/60 bg-oat/90 backdrop-blur-[2px]">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 py-4 pl-4 pr-28 sm:gap-6 sm:py-5 sm:pl-6 sm:pr-44 md:px-6 md:pr-44">
              <nav aria-label="Pantry steps" className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative h-px flex-1 bg-mist">
                  <div
                    className="absolute inset-y-0 left-0 bg-clay transition-[width] duration-150 ease-out"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-clay shadow-[0_0_0_4px_rgba(180,98,60,0.18)] transition-[left] duration-150 ease-out"
                    style={{
                      left: `calc(${progress * 100}% - 5px)`,
                    }}
                  />
                </div>
                <ol className="hidden gap-1 sm:flex lg:gap-3">
                  {beats.map((beat, i) => (
                    <li key={beat.slug}>
                      <button
                        type="button"
                        onClick={() => jumpToBeat(i)}
                        className={`focus-ring label-caps rounded-full px-2 py-1 transition-colors ${
                          i === active
                            ? "bg-clay/10 text-clay"
                            : "text-forest/35 hover:text-forest/70"
                        }`}
                      >
                        {beat.name.split(" ")[0]}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
              <ButtonLink href="/shop">Shop the flakes</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
