"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ritualFilm, framePath, type FilmChapter } from "@/lib/film";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const jumpLinks = [
  { href: "#ritual", label: "The Ritual" },
  { href: "#products", label: "Products" },
  { href: "#process", label: "Process" },
  { href: "#trade", label: "Trade" },
] as const;

/** Last portion of each chapter reserved for hold + crossfade into next. */
const BOUNDARY = 0.12;

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

type Scrub = {
  chapter: number;
  frameA: number;
  frameB: number;
  blend: number;
  /** 0 = fully current chapter; 1 = fully next chapter first frame */
  crossfade: number;
  nextChapter: number | null;
};

function scrubFromProgress(progress: number, film: FilmChapter[]): Scrub {
  const n = film.length;
  const scaled = progress * n;
  const chapter = Math.min(n - 1, Math.floor(scaled * 0.999));
  const local = clamp(scaled - chapter);
  const frames = film[chapter].frames;
  const nextChapter = chapter < n - 1 ? chapter + 1 : null;

  // Soft boundary: hold last frame, then crossfade into next chapter frame 0.
  if (nextChapter !== null && local > 1 - BOUNDARY) {
    const t = (local - (1 - BOUNDARY)) / BOUNDARY;
    // First third of boundary: hold; remainder: crossfade.
    const crossfade = clamp((t - 0.28) / 0.72);
    return {
      chapter,
      frameA: frames - 1,
      frameB: frames - 1,
      blend: 0,
      crossfade,
      nextChapter,
    };
  }

  // Scrub frames across the non-boundary portion.
  const scrubLocal = nextChapter !== null ? local / (1 - BOUNDARY) : local;
  const pos = clamp(scrubLocal) * (frames - 1);
  const frameA = Math.floor(pos);
  const frameB = Math.min(frames - 1, frameA + 1);
  const blend = pos - frameA;
  return {
    chapter,
    frameA,
    frameB,
    blend,
    crossfade: 0,
    nextChapter: null,
  };
}

export function ScrollRitual({
  film = ritualFilm,
}: {
  film?: FilmChapter[];
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { progress, setProgress } = useScrollProgress(
    trackRef,
    !reduce && film.length >= 2,
  );
  const scrub = useMemo(
    () => scrubFromProgress(progress, film),
    [progress, film],
  );
  const current = film[scrub.chapter] ?? film[0];
  const next = scrub.nextChapter !== null ? film[scrub.nextChapter] : null;
  const midFrame = Math.floor(((current?.frames ?? 6) - 1) / 2);
  const activeFrame = reduce ? midFrame : scrub.frameA;
  const packLabel =
    current.frameLabels?.[activeFrame] ??
    (scrub.crossfade > 0.5 && next?.frameLabels?.[0]
      ? next.frameLabels[0]
      : null);
  const fitClass =
    current.fit === "cover"
      ? "object-cover object-center"
      : "object-contain object-center";
  const nextFitClass =
    next?.fit === "cover"
      ? "object-cover object-center"
      : "object-contain object-center";

  // Preload next chapter fully before the soft boundary.
  useEffect(() => {
    if (reduce || film.length < 2) return;
    const chapter = scrub.chapter;
    const local =
      progress * film.length - Math.min(film.length - 1, Math.floor(progress * film.length * 0.999));
    if (local > 0.55 && chapter < film.length - 1) {
      const upcoming = film[chapter + 1];
      for (let i = 0; i < upcoming.frames; i++) {
        const img = new window.Image();
        img.src = framePath(upcoming, i);
      }
    }
  }, [progress, scrub.chapter, reduce, film]);

  const jumpToChapter = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const total = Math.max(el.offsetHeight - window.innerHeight, 1);
    // Land mid-chapter so labels/frames are readable, not on the crossfade edge.
    const local = (index + 0.35) / film.length;
    setProgress(clamp(local));
    const target =
      window.scrollY + el.getBoundingClientRect().top + local * total;
    window.scrollTo({ top: target, behavior: "auto" });
    window.dispatchEvent(new Event("yeskoko:scroll"));
    window.setTimeout(() => {
      window.dispatchEvent(new Event("yeskoko:scroll"));
    }, 80);
  };

  const srcA = framePath(current, reduce ? midFrame : scrub.frameA);
  const srcB = framePath(current, reduce ? midFrame : scrub.frameB);
  const blend = reduce ? 0 : scrub.blend;
  const crossfade = reduce ? 0 : scrub.crossfade;
  const srcNext = next ? framePath(next, 0) : null;

  return (
    <section
      id="ritual"
      aria-label="From the tree to the crisp"
      className="relative bg-[#e7d3bf]"
    >
      <h1 className="sr-only">
        Yeskoko — Dried in Ghana. Distinct on shelf. Dried fruit snacks from
        Ghana.
      </h1>
      <div
        ref={trackRef}
        className={
          reduce ? "relative h-auto" : "relative h-[240vh] md:h-[360vh]"
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
                key={crossfade > 0.55 && next ? next.id : current.id}
                className="animate-[fadeRise_0.45s_cubic-bezier(0.22,1,0.36,1)] font-display text-[clamp(2.4rem,5.2vw,4.8rem)] font-medium italic leading-[0.98] tracking-tight text-forest"
              >
                {crossfade > 0.55 && next ? next.title : current.title}
              </p>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-forest/60 md:mt-5 md:text-base">
                {crossfade > 0.55 && next ? next.note : current.note}
              </p>
              {packLabel ? (
                <p className="mt-3 label-caps text-clay">{packLabel}</p>
              ) : null}
              {scrub.chapter === film.length - 1 ? (
                <div className="mt-5">
                  <Link
                    href="/export"
                    className="focus-ring inline-flex rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-oat transition hover:bg-clay"
                  >
                    Request the buyer pack
                  </Link>
                </div>
              ) : null}

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
              <div className="absolute inset-0 overflow-hidden bg-[#e7d3bf]">
                <div
                  className={`relative h-full w-full ${
                    current.fit === "contain"
                      ? "mx-auto max-w-[420px] md:max-w-[480px]"
                      : ""
                  }`}
                >
                  <Image
                    src={srcA}
                    alt=""
                    fill
                    priority={scrub.chapter === 0}
                    className={fitClass}
                    sizes="(max-width:768px) 92vw, 54vw"
                    style={{ opacity: (1 - blend) * (1 - crossfade) }}
                  />
                  <Image
                    src={srcB}
                    alt=""
                    fill
                    className={fitClass}
                    sizes="(max-width:768px) 92vw, 54vw"
                    style={{ opacity: blend * (1 - crossfade) }}
                  />
                  {srcNext ? (
                    <Image
                      src={srcNext}
                      alt=""
                      fill
                      className={nextFitClass}
                      sizes="(max-width:768px) 92vw, 54vw"
                      style={{ opacity: crossfade }}
                    />
                  ) : null}
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
