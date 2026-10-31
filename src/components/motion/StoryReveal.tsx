"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export function StoryReveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;
    let frame = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = Math.max(window.innerHeight * 0.7, 1);
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.85 - rect.top) / travel),
      );
      el.style.setProperty("--origin-p", p.toFixed(4));
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
  }, [reduce]);

  return (
    <section
      id="origin"
      ref={ref}
      className="relative overflow-hidden bg-forest text-oat"
      style={{ ["--origin-p" as string]: "0" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8%] z-0 w-[min(72vw,520px)] -translate-x-1/2 md:top-[6%]"
        style={{
          opacity: "calc(0.15 + var(--origin-p) * 0.55)",
          transform:
            "translate3d(-50%, calc((1 - var(--origin-p)) * 36px), 0) scale(calc(0.88 + var(--origin-p) * 0.12))",
          willChange: "transform, opacity",
        }}
      >
        <div className="arch-mask relative aspect-[4/5] overflow-hidden border border-oat/15 bg-sage/20">
          <Image
            src="/products/coconut-banner.jpg"
            alt=""
            fill
            className="object-cover opacity-80"
            sizes="(max-width:768px) 70vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-forest/20" />
        </div>
      </div>

      <div
        className="relative z-10"
        style={{
          clipPath: reduce
            ? undefined
            : "inset(calc((1 - var(--origin-p)) * 10%) calc((1 - var(--origin-p)) * 6%) calc((1 - var(--origin-p)) * 10%) calc((1 - var(--origin-p)) * 6%) round calc((1 - var(--origin-p)) * 2rem))",
        }}
      >
        {children}
      </div>
    </section>
  );
}
