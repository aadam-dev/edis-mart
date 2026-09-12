"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ButtonLink";

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-mist">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:px-6 md:pb-20 md:pt-16">
        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf"
          >
            Yeskoko by Edis Mart
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-6xl"
          >
            Coconut that still tastes like fruit.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-[42ch] text-base leading-relaxed text-ink/70 md:text-lg"
          >
            Yeskoko flakes and chips, dried in Ghana. No preservatives. Shop 50g
            to 1kg.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/shop">Shop the flakes</ButtonLink>
            <ButtonLink href="/wholesale" variant="secondary">
              Wholesale
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-lg md:max-w-none"
        >
          <div className="absolute inset-6 rounded-full bg-leaf/10 blur-3xl" />
          <div className="relative h-full overflow-hidden border border-mist bg-white shadow-[0_24px_80px_rgba(22,58,40,0.12)]">
            <Image
              src="/products/yeskoko.jpg"
              alt="Yeskoko coconut flake pouches"
              fill
              priority
              className="object-cover"
              sizes="(max-width:768px) 90vw, 45vw"
            />
            <p className="absolute bottom-0 left-0 right-0 bg-forest/80 px-4 py-3 text-sm font-medium text-bone backdrop-blur-sm">
              Pay with card, MoMo, or cash on delivery. Accra delivery and
              pickup.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
