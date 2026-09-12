"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function StoryReveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(12% 8% 12% 8% round 2rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 1,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={ref} className="relative bg-forest text-oat">
      {children}
    </section>
  );
}
