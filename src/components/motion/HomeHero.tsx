"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ButtonLink";

const chapters = [
  { href: "#ritual", label: "The Ritual" },
  { href: "#pantry-pack", label: "The Packs" },
  { href: "#origin", label: "Accra House" },
] as const;

export function HomeHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !sectionRef.current) return;
    const el = sectionRef.current;
    let frame = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = Math.max(rect.height * 0.65, 1);
      const p = Math.min(1, Math.max(0, -rect.top / travel));
      el.style.setProperty("--hero-p", p.toFixed(4));
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
      ref={sectionRef}
      className="relative isolate min-h-[100dvh] overflow-hidden border-b border-mist/70"
      style={{ ["--hero-p" as string]: "0" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-12%] -z-10"
        style={{
          transform:
            "translate3d(0, calc(var(--hero-p) * -48px), 0) scale(1.06)",
          willChange: "transform",
        }}
      >
        <Image
          src="/brand/bg-botanical.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.34]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-oat/55 via-oat/78 to-oat" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-between px-4 pb-10 pt-8 md:px-6 md:pb-12 md:pt-10">
        <nav
          aria-label="Homepage chapters"
          className="relative z-20 flex flex-wrap items-center justify-end gap-2"
        >
          {chapters.map((chapter) => (
            <a
              key={chapter.href}
              href={chapter.href}
              className="focus-ring label-caps rounded-full border border-forest/12 bg-oat/70 px-3.5 py-2 text-forest/70 backdrop-blur-sm transition hover:border-clay/45 hover:text-clay"
            >
              {chapter.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 grid flex-1 items-center gap-8 py-10 md:grid-cols-12 md:gap-6 md:py-6">
          <div className="md:col-span-5 md:self-end md:pb-8">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="label-caps text-clay"
            >
              Yeskoko by Edis Mart
            </motion.p>

            <h1 className="mt-5 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-forest">
              {["Coconut that", "still tastes", "like fruit."].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.08 + i * 0.09,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {i === 2 ? <em className="italic">{line}</em> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 max-w-[40ch] text-base leading-relaxed text-forest/65 md:text-lg"
            >
              Yeskoko flakes and chips, dried in Accra without preservatives.
              Snack-size pouches to kitchen packs — fruit you can taste.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <ButtonLink href="/shop">Shop the flakes</ButtonLink>
              <ButtonLink href="/wholesale" variant="secondary">
                Wholesale
              </ButtonLink>
            </motion.div>
          </div>

          <div className="relative md:col-span-7 md:col-start-6">
            <p
              aria-hidden
              className="pointer-events-none absolute left-0 top-[8%] z-0 hidden font-display text-[clamp(4.5rem,11vw,9.5rem)] font-medium leading-none tracking-tight text-forest/[0.07] md:block"
              style={{
                transform:
                  "translate3d(calc(var(--hero-p) * -24px), calc(var(--hero-p) * 18px), 0)",
              }}
            >
              Dried
            </p>
            <p
              aria-hidden
              className="pointer-events-none absolute bottom-[6%] right-0 z-0 hidden font-display text-[clamp(4.5rem,11vw,9.5rem)] font-medium italic leading-none tracking-tight text-forest/[0.07] md:block"
              style={{
                transform:
                  "translate3d(calc(var(--hero-p) * 28px), calc(var(--hero-p) * -22px), 0)",
              }}
            >
              in Accra.
            </p>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.1,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 mx-auto w-full max-w-md md:ml-auto md:max-w-xl"
              style={{
                transform:
                  "translate3d(0, calc(var(--hero-p) * -56px), 0) rotate(calc(-3deg + var(--hero-p) * 5deg)) scale(calc(1 + var(--hero-p) * 0.06))",
                willChange: "transform",
              }}
            >
              <div className="arch-mask relative aspect-[4/5] overflow-hidden bg-sage/20 shadow-[0_28px_80px_rgba(35,48,31,0.16)]">
                <Image
                  src="/products/yeskoko.jpg"
                  alt="Yeskoko coconut flake pouches"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:768px) 90vw, 48vw"
                />
              </div>
              <p className="mt-4 max-w-sm text-sm text-forest/55 md:ml-auto md:text-right">
                Card, MoMo, or cash on delivery. Accra delivery and pickup.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-between gap-4">
          <p className="max-w-[28ch] text-sm leading-relaxed text-forest/50">
            Scroll into the pantry film — four packs, one continuous pour.
          </p>
          <a
            href="#ritual"
            className="focus-ring label-caps inline-flex items-center gap-2 text-clay transition hover:text-forest"
          >
            Skip to film
            <span aria-hidden className="text-base leading-none">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
