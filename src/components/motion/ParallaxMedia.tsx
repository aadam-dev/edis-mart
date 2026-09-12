"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxMedia({
  children,
  speed = 0.15,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !wrapRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [reduce, speed]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
