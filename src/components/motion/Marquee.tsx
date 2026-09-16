"use client";

import { useReducedMotion } from "motion/react";

const laneA = [
  { kind: "claim", label: "100% Natural" },
  { kind: "fruit", label: "Coconut" },
  { kind: "claim", label: "No preservatives" },
  { kind: "fruit", label: "Mango" },
  { kind: "claim", label: "Sun-dried" },
  { kind: "fruit", label: "Chia" },
  { kind: "claim", label: "Made in Ghana" },
  { kind: "fruit", label: "Pineapple" },
] as const;

const laneB = [
  { kind: "fruit", label: "Flakes" },
  { kind: "claim", label: "Card · MoMo · COD" },
  { kind: "fruit", label: "Chips" },
  { kind: "claim", label: "Accra delivery" },
  { kind: "fruit", label: "Yeskoko" },
  { kind: "claim", label: "Real fruit crunch" },
  { kind: "fruit", label: "Pantry packs" },
  { kind: "claim", label: "Wholesale ready" },
] as const;

function Seal() {
  return (
    <span
      aria-hidden
      className="mx-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-clay/35 text-[10px] font-medium tracking-[0.12em] text-clay md:h-8 md:w-8"
    >
      YK
    </span>
  );
}

function LeafMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="mx-1 h-4 w-4 shrink-0 text-sage md:h-5 md:w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M12 21c0-8 6-14 10-16-1 7-5 13-10 16Z" />
      <path d="M12 21C12 13 6 7 2 5c1 7 5 13 10 16Z" />
      <path d="M12 21V9" />
    </svg>
  );
}

function Item({
  kind,
  label,
}: {
  kind: "claim" | "fruit";
  label: string;
}) {
  if (kind === "fruit") {
    return (
      <span className="inline-flex shrink-0 items-center gap-3 px-1">
        <LeafMark />
        <span className="font-display text-3xl font-medium italic leading-none tracking-tight text-forest md:text-4xl lg:text-[2.75rem]">
          {label}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-3 px-1">
      <Seal />
      <span className="label-caps text-forest/55">{label}</span>
    </span>
  );
}

function Track({
  items,
  reverse = false,
  duration = 48,
  paused,
}: {
  items: readonly { kind: "claim" | "fruit"; label: string }[];
  reverse?: boolean;
  duration?: number;
  paused: boolean;
}) {
  const sequence = [...items, ...items];

  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex w-max items-center gap-8 pr-8 md:gap-12 ${
          paused ? "" : reverse ? "animate-harvest-reverse" : "animate-harvest"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {sequence.map((item, i) => (
          <Item key={`${item.label}-${i}`} kind={item.kind} label={item.label} />
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Yeskoko pantry highlights"
      className="group relative overflow-hidden border-y border-mist/80 bg-gradient-to-b from-sage/[0.07] via-oat to-clay/[0.06] py-7 md:py-9"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-oat to-transparent md:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-oat to-transparent md:w-28"
      />

      <div className="space-y-5 md:space-y-6">
        <Track items={laneA} duration={52} paused={!!reduce} />
        <div className="mx-auto h-px w-[min(72%,42rem)] bg-gradient-to-r from-transparent via-mist to-transparent" />
        <Track items={laneB} reverse duration={58} paused={!!reduce} />
      </div>
    </section>
  );
}
