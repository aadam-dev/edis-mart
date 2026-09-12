"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const words = ["Real fruit.", "Real crunch.", "Made in Ghana."];

export function TaglineReveal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  return (
    <section ref={ref} className="px-4 py-28 md:px-6 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-display text-[clamp(2.5rem,8vw,6.5rem)] font-medium leading-[1.08] tracking-tight text-forest">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={word}
                word={word}
                progress={scrollYProgress}
                start={start}
                end={end}
                reduce={!!reduce}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  start,
  end,
  reduce,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
  reduce: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  return (
    <motion.span
      style={reduce ? undefined : { opacity }}
      className="mr-[0.28em] inline-block"
    >
      {word}
    </motion.span>
  );
}
