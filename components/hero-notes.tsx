"use client";

import { Caveat } from "next/font/google";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

const hand = Caveat({ subsets: ["latin"], weight: "500" });

const doodle = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Word({
  children,
  s = 1,
  mark,
  coral,
}: {
  children: ReactNode;
  s?: number;
  mark?: "circle" | "squiggle";
  coral?: boolean;
}) {
  return (
    <span
      className="relative block whitespace-pre leading-[1.05]"
      style={{
        fontSize: `calc(clamp(1.25rem, 2.3vw, 1.9rem) * ${s})`,
        color: coral ? "var(--omniray-coral)" : undefined,
      }}
    >
      {children}
      {mark === "circle" && (
        <svg
          className="absolute -left-4 -top-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)]"
          viewBox="0 0 150 60"
          preserveAspectRatio="none"
          {...doodle}
        >
          <path vectorEffect="non-scaling-stroke" d="M14 38 C6 14 60 4 108 8 C148 12 152 40 104 50 C62 58 10 52 8 24" />
        </svg>
      )}
      {mark === "squiggle" && (
        <svg className="absolute -bottom-3 left-0 h-3 w-full" viewBox="0 0 84 12" preserveAspectRatio="none" {...doodle}>
          <path vectorEffect="non-scaling-stroke" d="M2 7 Q12 0 22 7 T42 7 T62 7 T82 7" />
        </svg>
      )}
    </span>
  );
}

function Doodle({ w, view, children }: { w: number; view: string; children: ReactNode }) {
  return (
    <svg style={{ width: `calc(${w}px * var(--doodle-scale, 1))` }} viewBox={view} {...doodle}>
      {children}
    </svg>
  );
}

type Item = { x: number; y: number; r: number; desk?: boolean; node: ReactNode };

const ITEMS: Item[] = [
  { x: 6, y: 6, r: -4, node: <Word s={1.4}>what if…</Word> },
  { x: 38, y: 9, r: 3, node: <Word s={1.15}>an app?</Word> },
  { x: 60, y: 3, r: 8, node: <Word s={2.8}>?</Word> },
  { x: 8, y: 20, r: -3, desk: true, node: <Word s={1.5}>ideas</Word> },
  {
    x: 28, y: 18, r: 6, desk: true,
    node: (
      <Doodle w={34} view="0 0 32 40">
        <path d="M12 28 C3 22 3 8 16 6 C29 8 29 22 20 28 L20 33 H12 Z M13 37 H19 M16 1 V-1" />
      </Doodle>
    ),
  },
  { x: 49, y: 22, r: 4, desk: true, node: <Word s={1.2}>launch?</Word> },
  { x: 6, y: 33, r: 2, node: <Word s={1.05} mark="squiggle">booking?</Word> },
  { x: 32, y: 35, r: -3, node: <Word s={1.2} mark="circle">online store</Word> },
  {
    x: 60, y: 34, r: 0, desk: true,
    node: (
      <Doodle w={34} view="0 0 38 38">
        <path d="M20 20 C20 16 26 16 26 21 C26 28 14 28 14 19 C14 10 30 10 30 22 C30 34 8 34 8 18" />
      </Doodle>
    ),
  },
  {
    x: 45, y: 49, r: 0,
    node: (
      <Doodle w={110} view="0 0 110 50">
        <path d="M4 42 C34 6 74 4 100 26" />
        <path d="M86 22 L102 28 L96 12" />
      </Doodle>
    ),
  },
  { x: 8, y: 47, r: -6, desk: true, node: <Word s={1.25}>design</Word> },
  {
    x: 24, y: 47, r: 8, desk: true,
    node: (
      <Doodle w={20} view="0 0 26 36">
        <path d="M16 2 L4 20 H13 L10 34 L23 13 H14 Z" />
      </Doodle>
    ),
  },
  { x: 6, y: 59, r: -2, node: <Word s={1.1}>how do i…?</Word> },
  { x: 31, y: 61, r: 4, node: <Word s={1.3}>my business!</Word> },
  {
    x: 62, y: 60, r: -8, desk: true,
    node: (
      <Doodle w={30} view="0 0 32 32">
        <path d="M16 28 C2 18 3 6 11 6 C14 6 16 9 16 9 C16 9 18 6 21 6 C29 6 30 18 16 28 Z" />
      </Doodle>
    ),
  },
  {
    x: 4, y: 72, r: -2,
    node: <Word s={1}>{"to do:\n– website\n– store\n– app?"}</Word>,
  },
  { x: 24, y: 72, r: -10, node: <Word s={2}>?</Word> },
  {
    x: 38, y: 72, r: 6, desk: true,
    node: (
      <Doodle w={34} view="0 0 36 36">
        <circle cx="18" cy="18" r="14" />
        <path d="M12 14 V15 M24 14 V15 M11 21 C14 27 22 27 25 21" />
      </Doodle>
    ),
  },
  {
    x: 56, y: 12, r: 0, desk: true,
    node: (
      <Doodle w={58} view="0 0 60 50">
        <path d="M14 30 C2 30 2 14 14 14 C14 4 30 2 34 12 C44 8 54 16 48 26 C46 32 38 32 34 30 Z" />
        <circle cx="24" cy="38" r="2.5" />
        <circle cx="17" cy="45" r="1.5" />
      </Doodle>
    ),
  },
  {
    x: 26, y: 29, r: 0,
    node: (
      <Doodle w={22} view="0 0 20 20">
        <path d="M10 2 V18 M2 10 H18 M4.5 4.5 L15.5 15.5 M15.5 4.5 L4.5 15.5" />
      </Doodle>
    ),
  },
  { x: 30, y: 88, r: 2, desk: true, node: <Word s={1.1}>payments</Word> },
  { x: 58, y: 74, r: -3, desk: true, node: <Word s={1.1}>login?</Word> },
  { x: 50, y: 88, r: 4, desk: true, node: <Word s={1.15}>someday…</Word> },
];

const RADIUS = 150; // how far the pointer reaches, in px
const PUSH = 90; // max push distance, in px

export function Notes() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef<{ x: number; y: number }[]>([]);
  const target = useRef<{ x: number; y: number }[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = box.current;
    if (!root || reduce.matches) return;

    pos.current = ITEMS.map(() => ({ x: 0, y: 0 }));
    target.current = ITEMS.map(() => ({ x: 0, y: 0 }));

    const step = () => {
      let moving = false;
      const p = pointer.current;
      els.current.forEach((el, i) => {
        if (!el || el.offsetParent === null) return;
        const t = target.current[i];
        if (p) {
          const cx = el.offsetLeft + el.offsetWidth / 2;
          const cy = el.offsetTop + el.offsetHeight / 2;
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const f = dist < RADIUS ? (1 - dist / RADIUS) ** 2 * PUSH : 0;
          t.x = (dx / dist) * f;
          t.y = (dy / dist) * f;
        } else {
          t.x = 0;
          t.y = 0;
        }
        const c = pos.current[i];
        c.x += (t.x - c.x) * 0.14;
        c.y += (t.y - c.y) * 0.14;
        if (Math.abs(t.x - c.x) > 0.05 || Math.abs(t.y - c.y) > 0.05) moving = true;
        el.style.transform = `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px) rotate(${(c.x * 0.12).toFixed(2)}deg)`;
      });
      raf.current = moving || pointer.current ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf.current) raf.current = requestAnimationFrame(step);
    };

    const move = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      kick();
    };
    const leave = () => {
      pointer.current = null;
      kick();
    };

    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("pointercancel", leave);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointercancel", leave);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  return (
    <div
      ref={box}
      className={`${hand.className} relative h-[300px] touch-pan-y select-none overflow-hidden text-[var(--omniray-blue)]/70 [--doodle-scale:0.8] md:h-full md:[--doodle-scale:1]`}
      aria-hidden
    >
      {ITEMS.map((it, i) => (
        <div
          key={i}
          ref={(el) => {
            els.current[i] = el;
          }}
          className={`absolute will-change-transform ${it.desk ? "hidden md:block" : ""}`}
          style={{ left: `${it.x}%`, top: `${it.y}%` } as CSSProperties}
        >
          <div style={{ transform: `rotate(${it.r}deg)` }}>{it.node}</div>
        </div>
      ))}
    </div>
  );
}
