"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ButtonLink";

const sizes = [
  { label: "50g · ₵15", href: "/shop" },
  { label: "100g · ₵30–₵45", href: "/shop" },
  { label: "250g · ₵75–₵120", href: "/shop" },
  { label: "700g · ₵150", href: "/shop" },
] as const;

export function PantryPack() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;
    let frame = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = Math.max(window.innerHeight * 0.85, 1);
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.75 - rect.top) / travel),
      );
      el.style.setProperty("--pack-p", p.toFixed(4));
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
      id="pantry-pack"
      ref={ref}
      aria-label="Take the pantry home"
      className="relative overflow-hidden border-b border-mist/70 bg-oat"
      style={{ ["--pack-p" as string]: "0" }}
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 md:grid-cols-12 md:items-center md:gap-8 md:px-6 md:py-28">
        <div className="md:col-span-5">
          <p className="label-caps text-clay">The packs</p>
          <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[1.05] tracking-tight text-forest">
            Take the pantry <em className="italic">home</em>
          </h2>
          <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-forest/60 md:text-lg">
            One jar for the kitchen. Pouches for the bag. Clear sizes from a
            50g snack to a 700g refill — prices you can finish.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <li key={size.label}>
                <a
                  href={size.href}
                  className="focus-ring label-caps inline-flex rounded-full border border-forest/12 bg-oat px-3.5 py-2 text-forest/70 transition hover:border-clay/45 hover:text-clay"
                >
                  {size.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/shop">Shop the flakes</ButtonLink>
            <ButtonLink href="/wholesale" variant="secondary">
              Wholesale
            </ButtonLink>
          </div>
        </div>

        <div className="relative md:col-span-7">
          <div
            className="relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-sage/15 shadow-[0_28px_80px_rgba(35,48,31,0.14)] md:ml-auto md:rounded-[2rem]"
            style={{
              transform:
                "translate3d(0, calc((1 - var(--pack-p)) * 48px), 0) scale(calc(0.94 + var(--pack-p) * 0.06))",
              opacity: "calc(0.55 + var(--pack-p) * 0.45)",
              willChange: "transform, opacity",
            }}
          >
            <Image
              src="/products/coconut-banner.jpg"
              alt="Yeskoko jar, coconut flakes pouches, and pineapple chips"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 55vw"
            />
          </div>
          <p className="mt-4 text-sm text-forest/50 md:text-right">
            Coconut flakes, chia coco, pineapple, and mango — Accra dried.
          </p>
        </div>
      </div>
    </section>
  );
}
