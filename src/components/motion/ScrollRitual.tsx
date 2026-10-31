"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ritualFilm, framePath, type FilmChapter } from "@/lib/film";

const jumpLinks = [
  { href: "#ritual", label: "The Ritual" },
  { href: "#products", label: "Products" },
  { href: "#pantry-pack", label: "The Packs" },
  { href: "#trade", label: "Trade" },
] as const;

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

type Scrub = {
  chapter: number;
  frameA: number;
  frameB: number;
  blend: number;
};

function scrubFromProgress(progress: number, film: FilmChapter[]): Scrub {
  const n = film.length;
  const scaled = progress * n;
  const chapter = Math.min(n - 1, Math.floor(scaled * 0.999));
  const local = clamp(scaled - chapter);
  const frames = film[chapter].frames;
  const pos = local * (frames - 1);
  const frameA = Math.floor(pos);
  const frameB = Math.min(frames - 1, frameA + 1);
  const blend = pos - frameA;
  return { chapter, frameA, frameB, blend };
}

export function ScrollRitual({
  film = ritualFilm,
}: {
  film?: FilmChapter[];
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const scrub = useMemo(
    () => scrubFromProgress(progress, film),
    [progress, film],
  );
  const current = film[scrub.chapter] ?? film[0];
  const midFrame = Math.floor(((current?.frames ?? 6) - 1) / 2);
  const activeFrame = reduce ? midFrame : scrub.frameA;
  const packLabel =
    current.frameLabels?.[activeFrame] ??
    current.frameLabels?.[scrub.frameB] ??
    null;
  const fitClass =
    current.fit === "cover"
      ? "object-cover object-center"
      : "object-contain object-center md:object-right";

  useEffect(() => {
    if (reduce || !trackRef.current || film.length < 2) return;
    const el = trackRef.current;
    let frame = 0;
    let last = -1;

    const update = () => {
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(
        -el.getBoundingClientRect().top / Math.max(total, 1),
      );
      // Avoid redundant paints when Lenis fires many rAFs at the same progress.
      const quantized = Math.round(scrolled * 1000) / 1000;
      if (quantized !== last) {
        last = quantized;
        setProgress(quantized);
      }

      const chapter = Math.min(
        film.length - 1,
        Math.floor(scrolled * film.length * 0.999),
      );
      const local = scrolled * film.length - chapter;
      if (local > 0.45 && chapter < film.length - 1) {
        const next = film[chapter + 1];
        for (const i of [0, 1, 2]) {
          const img = new window.Image();
          img.src = framePath(next, i);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Lenis / virtual scroll sync
    window.addEventListener("yeskoko:scroll", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("yeskoko:scroll", onScroll);
    };
  }, [reduce, film]);

  const jumpToChapter = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const total = Math.max(el.offsetHeight - window.innerHeight, 1);
    const local = (index + 0.28) / film.length;
    setProgress(clamp(local));
    const target =
      window.scrollY + el.getBoundingClientRect().top + local * total;
    window.scrollTo({ top: target, behavior: "smooth" });
    // Re-sync after Lenis settles.
    window.setTimeout(() => {
      window.dispatchEvent(new Event("yeskoko:scroll"));
    }, 420);
  };

  const srcA = framePath(current, reduce ? midFrame : scrub.frameA);
  const srcB = framePath(current, reduce ? midFrame : scrub.frameB);
  const blend = reduce ? 0 : scrub.blend;

  return (
    <section
      id="ritual"
      aria-label="From the tree to the crisp"
      className="relative bg-[#e7d3bf]"
    >
      <h1 className="sr-only">Yeskoko — dried fruit snacks from Ghana</h1>
      <div
        ref={trackRef}
        className={
          reduce ? "relative h-auto" : "relative h-[280vh] md:h-[420vh]"
        }
      >
        <div
          className={
            reduce
              ? "relative flex min-h-[100dvh] flex-col"
              : "sticky top-0 flex h-dvh flex-col overflow-hidden"
          }
        >
          <div className="relative z-20 flex items-center justify-between gap-3 px-4 pt-[4.75rem] md:px-8 md:pt-[5.25rem]">
            <p className="label-caps text-forest/45">From tree to crisp</p>
            <nav
              aria-label="Page sections"
              className="flex flex-wrap justify-end gap-1.5 sm:gap-2"
            >
              {jumpLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`focus-ring label-caps rounded-full px-2.5 py-1.5 transition sm:px-3 ${
                    i === 0
                      ? "border border-forest/25 text-forest"
                      : "text-forest/55 hover:text-forest"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-stretch gap-3 px-5 pb-6 md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:pb-8">
            <div className="order-2 flex flex-col justify-end md:order-1 md:col-span-5 md:justify-center">
              <p
                key={current.id}
                className="animate-[fadeRise_0.45s_cubic-bezier(0.22,1,0.36,1)] font-display text-[clamp(2.4rem,5.2vw,4.8rem)] font-medium italic leading-[0.98] tracking-tight text-forest"
              >
                {current.title}
              </p>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-forest/60 md:mt-5 md:text-base">
                {current.note}
              </p>
              {packLabel ? (
                <p className="mt-3 label-caps text-clay">{packLabel}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="focus-ring inline-flex rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-oat transition hover:bg-clay"
                >
                  Shop the flakes
                </Link>
                <Link
                  href="/export"
                  className="focus-ring inline-flex rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest transition hover:border-forest"
                >
                  Buyer pack
                </Link>
              </div>

              <div className="mt-8 max-w-md md:mt-10">
                <div className="relative h-px bg-forest/15">
                  <div
                    className="absolute inset-y-0 left-0 bg-forest/70"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-forest/30 bg-[#f3e6d4]"
                    style={{ left: `calc(${progress * 100}% - 6px)` }}
                  />
                </div>
                <ol className="mt-3 flex flex-wrap justify-between gap-2">
                  {film.map((chapter, i) => (
                    <li key={chapter.id}>
                      <button
                        type="button"
                        onClick={() => jumpToChapter(i)}
                        aria-current={i === scrub.chapter ? "true" : undefined}
                        className={`focus-ring label-caps transition-colors ${
                          i === scrub.chapter
                            ? "text-forest"
                            : "text-forest/35 hover:text-forest/70"
                        }`}
                      >
                        {chapter.label}
                      </button>
                    </li>
                  ))}
                </ol>
                <p className="label-caps mt-3 tabular-nums text-forest/40">
                  {String(scrub.chapter + 1).padStart(2, "0")} /{" "}
                  {String(film.length).padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="relative order-1 min-h-[42dvh] md:order-2 md:col-span-7 md:min-h-0 md:h-[min(72dvh,640px)]">
              <div className="absolute inset-0 flex items-center justify-center md:justify-end">
                <div className="relative h-full w-full max-w-[560px] md:mr-[3%]">
                  <Image
                    src={srcA}
                    alt=""
                    fill
                    priority={scrub.chapter === 0}
                    className={fitClass}
                    sizes="(max-width:768px) 92vw, 46vw"
                    style={{ opacity: 1 - blend }}
                  />
                  <Image
                    src={srcB}
                    alt=""
                    fill
                    className={fitClass}
                    sizes="(max-width:768px) 92vw, 46vw"
                    style={{ opacity: blend }}
                  />
                </div>
              </div>
              <span className="sr-only" aria-live="polite">
                {current.label}: {current.title}
                {packLabel ? ` — ${packLabel}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
