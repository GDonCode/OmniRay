"use client";

import { useEffect, useRef, type ReactNode } from "react";

const HEADER = 56; // px of fixed header the stage tucks under (matches top-14 below)

/**
 * One project: a hero that sticks under the header while a glass card scrolls up over it. As the card rises
 * from the bottom 20% of the hero it widens to full bleed and darkens. Progress (0..1) is written to the `--p`
 * CSS variable (see `.work-card` in globals.css), so scrolling never re-renders React.
 */
export function ProjectStage({
  hero,
  card,
}: {
  hero: ReactNode;
  card: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const cardEl = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !cardEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const span = 0.8 * (window.innerHeight - HEADER); // card starts 20% up from the hero's bottom
      const t = Math.min(
        1,
        Math.max(
          0,
          (HEADER + span - cardEl.getBoundingClientRect().top) / span,
        ),
      );
      el.style.setProperty("--p", String(t * t * (3 - 2 * t))); // smoothstep
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="group relative">
      <div className="relative h-[calc(100svh-3.5rem)] lg:sticky lg:top-14">
        {hero}
      </div>
      <div
        data-card
        className="work-card glass relative z-10 -mt-[20svh] p-6 sm:p-10"
      >
        {card}
      </div>
    </div>
  );
}
