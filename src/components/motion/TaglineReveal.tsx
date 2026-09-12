"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const words = ["Real fruit.", "Real crunch.", "Made in Ghana."];

export function TaglineReveal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });

  return (
    <section
      ref={ref}
      className="border-y border-mist bg-forest px-4 py-24 text-bone md:px-6 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-display text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
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
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  return (
    <motion.span
      style={reduce ? undefined : { opacity }}
      className="mr-[0.28em] inline-block"
    >
      {word}
    </motion.span>
  );
}
