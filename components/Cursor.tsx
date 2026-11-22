"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* ---------- tunables (see README, "Hero effects") ---------- */
export const CURSOR_CONFIG = {
  /** Lerp toward the pointer per frame at 60fps. */
  lerp: 0.2,
  /** Wrapper box, px. */
  box: 80,
  /** Magnification of the glass ball (1 = none). Chromium browsers only. */
  magnify: 1.3,
} as const;

/* Displacement map for the lens: red falls left to right and green top to bottom, so every pixel of
   the ball reads from a point nearer its centre (neutral grey in the middle). */
const LENS_MAP =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>" +
      "<defs><linearGradient id='r' x1='0' x2='1' y1='0' y2='0'><stop offset='0' stop-color='#f00'/><stop offset='1' stop-color='#000'/></linearGradient>" +
      "<linearGradient id='g' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#0f0'/><stop offset='1' stop-color='#000'/></linearGradient></defs>" +
      "<rect width='100' height='100' fill='#000'/><rect width='100' height='100' fill='url(#r)'/>" +
      "<rect width='100' height='100' fill='url(#g)' style='mix-blend-mode:screen'/></svg>",
  );

/** SVG filters inside backdrop-filter are only honoured by Chromium (Chrome, Edge, Opera, Brave). */
const noSubscribe = () => () => {};
const canMagnify = () =>
  typeof CSS !== "undefined" &&
  /Chrome\//.test(navigator.userAgent) &&
  CSS.supports("backdrop-filter", "url(#a) blur(1px)");

type Mode = "default" | "hover" | "drag" | "label" | "alt";
type Tone = "dark" | "light";

const HIT = "a,button,[data-cursor]";
const RING = "#939393";

/** First non-transparent background up the tree decides whether we are over a light surface. */
function toneAt(el: Element | null): Tone {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
    if (!bg) continue;
    const [r, g, b, a = "1"] = bg.map(Number);
    if (Number(a) < 0.5) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? "light" : "dark";
  }
  return "dark";
}

function modeOf(el: Element | null): { mode: Mode; label: string } {
  const hit = el?.closest<HTMLElement>(HIT);
  if (!hit) return { mode: "default", label: "" };
  const kind = hit.dataset.cursor;
  if (kind === "drag") return { mode: "drag", label: "" };
  if (kind === "alt") return { mode: "alt", label: "" };
  if (kind === "view" || kind === "label") {
    return { mode: "label", label: hit.dataset.cursorLabel || "View" };
  }
  return { mode: "hover", label: "" };
}

export function Cursor() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const half = CURSOR_CONFIG.box / 2;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let started = false;
    let raf = 0;
    let last = 0;
    let probe: Element | null = null;
    let probeRaf = 0;

    const place = () => {
      el.style.transform = `translate3d(${(cur.x - half).toFixed(2)}px, ${(cur.y - half).toFixed(2)}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last || 16.7);
      last = now;
      // Frame-rate independent: equals `lerp` per frame at 60fps.
      const k = reduce.matches ? 1 : 1 - Math.pow(1 - CURSOR_CONFIG.lerp, dt / 16.667);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      place();
      if (Math.hypot(target.x - cur.x, target.y - cur.y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        cur.x = target.x;
        cur.y = target.y;
        place();
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!started) {
        started = true;
        cur.x = target.x;
        cur.y = target.y;
        place();
        el.style.opacity = "1";
      }
      el.style.opacity = "1";
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const next = modeOf(t);
      setMode(next.mode);
      setLabel(next.label);
      probe = t;
      if (!probeRaf) {
        probeRaf = requestAnimationFrame(() => {
          probeRaf = 0;
          setTone(toneAt(probe));
        });
      }
    };

    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(probeRaf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  const big = mode !== "default"; // ring grows to the 72px disc
  const magnify = useSyncExternalStore(noSubscribe, canMagnify, () => false);
  const ringStroke = tone === "light" ? "rgba(0,0,0,.4)" : RING;
  const chars = Array.from(label);

  return (
    <div
      ref={box}
      data-tone={tone}
      data-state={mode}
      aria-hidden
      style={{ opacity: 0 }}
      className="group/cursor pointer-events-none fixed top-0 left-0 z-[100003] size-20 transition-opacity duration-200 will-change-transform [@media(pointer:coarse)]:hidden"
    >
      {/* 5. secondary translucent disc */}
      <div
        className={`absolute inset-0 m-auto size-[72px] rounded-full bg-white/30 transition-[opacity,transform] duration-300 ease-out ${
          mode === "alt" ? "scale-100 opacity-30" : "scale-50 opacity-0"
        }`}
      />

      {/* 1 + 2. glass ball: 24px by default, grows to 72px on hover. Barely blurred, so the content
          underneath stays readable; a lit rim and a specular highlight sell the glass. */}
      <div
        className={`cursor-glass absolute inset-0 m-auto rounded-full transition-[width,height] duration-300 ease-out ${
          big ? "size-[72px]" : "size-6"
        }`}
        data-tone={tone}
        data-lens={magnify ? "on" : undefined}
      />

      {/* Lens filter. primitiveUnits are the ball's own box, so one filter fits both sizes:
          offset = (centre - p) * (1 - 1/magnify), i.e. a zoom of `magnify`. */}
      {magnify && (
        <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
          <defs>
            <filter id="cursor-lens" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
              <feImage href={LENS_MAP} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={1 - 1 / CURSOR_CONFIG.magnify}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* 3. arrow mode: two chevrons for draggable areas */}
      <div
        className={`absolute inset-0 m-auto flex size-[72px] items-center justify-between px-3 transition-opacity duration-300 ${
          mode === "drag" ? "opacity-100" : "opacity-0"
        }`}
      >
        {["M10 3 5 8l5 5", "M6 3l5 5-5 5"].map((d) => (
          <svg key={d} viewBox="0 0 16 16" className="size-4 fill-none" stroke={ringStroke === RING ? "#fff" : "#000"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d={d} />
          </svg>
        ))}
      </div>

      {/* 4. label mode: orange circle with staggered letters */}
      <div
        className={`absolute inset-0 m-auto flex size-[72px] items-center justify-center rounded-full bg-[#ff5f00] transition-transform duration-300 ease-out ${
          mode === "label" ? "scale-100" : "scale-0"
        }`}
      >
        <p className="font-mono text-[12px] font-medium tracking-tight text-black">
          {chars.map((c, i) => (
            <span
              key={`${label}-${i}`}
              className={`inline-block whitespace-pre transition-[opacity,transform] duration-300 ${
                mode === "label" ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              style={{ transitionDelay: mode === "label" ? `${80 + i * 30}ms` : "0ms" }}
            >
              {c}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
