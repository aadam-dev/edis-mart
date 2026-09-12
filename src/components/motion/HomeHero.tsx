"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonLink } from "@/components/ButtonLink";

gsap.registerPlugin(ScrollTrigger);

export function HomeHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scale: 1.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-mist/70"
    >
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] items-center gap-12 px-4 pb-20 pt-10 md:grid-cols-12 md:gap-8 md:px-6 md:pb-24 md:pt-14">
        <div className="relative z-10 md:col-span-5 md:pb-8">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="label-caps text-clay"
          >
            Yeskoko by Edis Mart
          </motion.p>

          <h1 className="mt-5 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-forest">
            {(
              reduce
                ? ["Coconut that", "still tastes", "like fruit."]
                : ["Coconut that", "still tastes", "like fruit."]
            ).map((line, i) => (
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
            className="mt-6 max-w-[36ch] text-base leading-relaxed text-forest/65 md:text-lg"
          >
            Flakes and chips, dried in Ghana. No preservatives. Sizes from 50g
            to 1kg.
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

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.1,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative md:col-span-7 md:col-start-6"
        >
          <div
            ref={imageWrapRef}
            className="arch-mask relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden bg-sage/20 md:ml-auto md:max-w-none md:aspect-[5/6]"
          >
            <div
              ref={imageRef}
              className="absolute inset-0 origin-[35%_40%] will-change-transform"
            >
              <Image
                src="/products/yeskoko.jpg"
                alt="Yeskoko coconut flake pouches"
                fill
                priority
                className="object-cover"
                sizes="(max-width:768px) 90vw, 55vw"
              />
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-forest/55 md:ml-auto md:text-right">
            Card, MoMo, or cash on delivery. Accra delivery and pickup.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
