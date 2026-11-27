"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One project's hero plus its glass panels. On desktop the section is taller than the viewport and the stage
 * sticks while you scroll through it: the panels rise from the bottom 20% of the hero and grow to fill the
 * viewport. The progress (0..1) is written to the `--p` CSS variable (see `.work-panels` in globals.css), so
 * scrolling never re-renders React. Below `lg` it is a plain static layout.
 */
export function ProjectStage({
  hero,
  visit,
  panels,
}: {
  hero: ReactNode;
  visit: ReactNode;
  panels: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    const HEADER = 64;
    let frame = 0;
    const update = () => {
      frame = 0;
      const runway = window.innerHeight * 0.8;
      const t = Math.min(
        1,
        Math.max(0, (HEADER - el.getBoundingClientRect().top) / runway),
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
    <div ref={ref} className="lg:h-[calc(180svh-4rem)]">
      <div className="group relative lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)]">
        {hero}
        {visit}
        <div className="work-panels relative z-10 mx-auto -mt-[20svh] grid max-w-6xl gap-6 px-6 lg:mx-0 lg:mt-0 lg:max-w-none lg:px-0">
          {panels}
        </div>
      </div>
    </div>
  );
}
