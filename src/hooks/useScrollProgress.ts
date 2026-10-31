"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Shared scroll progress for sticky scrub tracks.
 * Listens to native scroll + Lenis (`yeskoko:scroll`) so frame scrub stays in sync.
 */
export function useScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  const [progress, setProgress] = useState(0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const total = el.offsetHeight - window.innerHeight;
    return clamp(-el.getBoundingClientRect().top / Math.max(total, 1));
  }, [trackRef]);

  useEffect(() => {
    if (!enabled || !trackRef.current) return;
    let raf = 0;
    let last = -1;

    const update = () => {
      const scrolled = measure();
      const quantized = Math.round(scrolled * 1000) / 1000;
      if (quantized !== last) {
        last = quantized;
        setProgress(quantized);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("yeskoko:scroll", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("yeskoko:scroll", onScroll);
    };
  }, [enabled, trackRef, measure]);

  return { progress, setProgress, measure };
}
