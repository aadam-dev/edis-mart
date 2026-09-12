"use client";

import { motion } from "motion/react";

export function Marquee({
  text,
  speed = 40,
}: {
  text: string;
  speed?: number;
}) {
  return (
    <div className="flex w-full overflow-hidden border-y border-mist/70 bg-sage/5 py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        <div className="flex gap-8 pr-8">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="font-display text-xl font-medium tracking-wide text-forest/80 md:text-2xl"
            >
              {text}
            </span>
          ))}
        </div>
        <div className="flex gap-8 pr-8">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="font-display text-xl font-medium tracking-wide text-forest/80 md:text-2xl"
            >
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
