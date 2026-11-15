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
        fontSize: `${s}em`,
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
    <svg style={{ width: `${(w / 30).toFixed(3)}em` }} viewBox={view} {...doodle}>
      {children}
    </svg>
  );
}

type Item = { x: number; y: number; r: number; desk?: boolean; node: ReactNode };

const ITEMS: Item[] = [
  // row 1
  { x: 4, y: 4, r: -4, node: <Word s={1.4}>what if…</Word> },
  { x: 28, y: 6, r: 3, node: <Word s={1.15}>an app?</Word> },
  { x: 45, y: 2, r: 8, node: <Word s={2.8}>?</Word> },
  {
    x: 55, y: 6, r: 0, desk: true,
    node: (
      <Doodle w={64} view="0 0 60 50">
        <path d="M14 30 C2 30 2 14 14 14 C14 4 30 2 34 12 C44 8 54 16 48 26 C46 32 38 32 34 30 Z" />
        <circle cx="24" cy="38" r="2.5" />
        <circle cx="17" cy="45" r="1.5" />
      </Doodle>
    ),
  },
  { x: 68, y: 7, r: 4, desk: true, node: <Word s={1.1}>customers</Word> },
  // row 2
  { x: 5, y: 19, r: -3, desk: true, node: <Word s={1.5}>ideas</Word> },
  {
    x: 21, y: 18, r: 6, desk: true,
    node: (
      <Doodle w={40} view="0 0 32 40">
        <path d="M12 28 C3 22 3 8 16 6 C29 8 29 22 20 28 L20 33 H12 Z M13 37 H19 M16 1 V-1" />
      </Doodle>
    ),
  },
  { x: 31, y: 22, r: 4, desk: true, node: <Word s={1.2}>launch?</Word> },
  {
    x: 53, y: 21, r: -3, desk: true,
    node: (
      <Doodle w={64} view="0 0 44 34">
        <path d="M3 5 H41 V31 H3 Z M3 12 H41 M8 8.5 H8.1 M12 8.5 H12.1 M16 8.5 H16.1" />
      </Doodle>
    ),
  },
  { x: 64, y: 21, r: -2, desk: true, node: <Word s={1.2}>dashboard</Word> },
  // row 3
  { x: 4, y: 34, r: 2, node: <Word s={1.05} mark="squiggle">booking?</Word> },
  {
    x: 22, y: 32, r: -4, desk: true,
    node: (
      <Doodle w={44} view="0 0 36 36">
        <path d="M4 8 H32 V32 H4 Z M4 15 H32 M11 3 V10 M25 3 V10" />
      </Doodle>
    ),
  },
  { x: 33, y: 36, r: -3, node: <Word s={1.2} mark="circle">online store</Word> },
  {
    x: 55, y: 33, r: 5, desk: true,
    node: (
      <Doodle w={50} view="0 0 38 36">
        <path d="M2 4 H8 L12 24 H30 L34 10 H10 M15 30 A2 2 0 1 0 15.1 30 M28 30 A2 2 0 1 0 28.1 30" />
      </Doodle>
    ),
  },
  { x: 66, y: 37, r: 3, desk: true, node: <Word s={1.1}>checkout</Word> },
  // row 4
  { x: 5, y: 47, r: -6, desk: true, node: <Word s={1.25}>design</Word> },
  {
    x: 22, y: 44, r: 0,
    node: (
      <Doodle w={120} view="0 0 110 50">
        <path d="M4 42 C34 6 74 4 100 26" />
        <path d="M86 22 L102 28 L96 12" />
      </Doodle>
    ),
  },
  { x: 42, y: 50, r: 3, desk: true, node: <Word s={1.2}>mobile app</Word> },
  {
    x: 66, y: 46, r: -5, desk: true,
    node: (
      <Doodle w={34} view="0 0 36 40">
        <path d="M10 2 H26 V38 H10 Z M16 34 H20" />
      </Doodle>
    ),
  },
  // row 5
  { x: 4, y: 57, r: -2, node: <Word s={1.1}>how do i…?</Word> },
  { x: 27, y: 59, r: 4, node: <Word s={1.3}>my business!</Word> },
  {
    x: 58, y: 59, r: 4, desk: true,
    node: (
      <Doodle w={48} view="0 0 36 34">
        <path d="M4 4 H32 V22 H16 L8 30 V22 H4 Z" />
      </Doodle>
    ),
  },
  { x: 63, y: 70, r: -3, desk: true, node: <Word s={1.15}>automate it</Word> },
  // row 6
  { x: 4, y: 71, r: -2, node: <Word s={1}>{"to do:\n– website\n– store"}</Word> },
  { x: 33, y: 71, r: -10, node: <Word s={2}>?</Word> },
  { x: 32, y: 86, r: 2, desk: true, node: <Word s={1.1}>payments</Word> },
  { x: 53, y: 88, r: 4, desk: true, node: <Word s={1.15}>someday…</Word> },
  { x: 66, y: 82, r: -3, desk: true, node: <Word s={1.1}>track orders</Word> },
];


export function Notes() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef<{ x: number; y: number }[]>([]);
  const target = useRef<{ x: number; y: number }[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const reach = useRef({ radius: 150, push: 90 });

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
          const { radius, push } = reach.current;
          const f = dist < radius ? (1 - dist / radius) ** 2 * push : 0;
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
      reach.current = {
        radius: Math.min(260, Math.max(110, r.width * 0.22)),
        push: Math.min(140, Math.max(60, r.width * 0.14)),
      };
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
      className={`${hand.className} relative h-[300px] min-h-0 touch-pan-y select-none overflow-hidden text-[var(--omniray-blue)]/70 md:h-full`}
      style={{ fontSize: "clamp(1.25rem, min(2.4vw, 4vh), 3rem)" }}
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
