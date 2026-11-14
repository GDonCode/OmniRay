import type { CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- left half: thoughts, ideas, concepts ---------- */

const THOUGHTS: { text: string; x: number; y: number; d: number; t: number; tone: "blue" | "coral" }[] = [
  { text: "idea", x: 8, y: 14, d: 0, t: 9, tone: "coral" },
  { text: "what if…", x: 38, y: 8, d: 2.2, t: 10, tone: "blue" },
  { text: "concept", x: 12, y: 40, d: 4.1, t: 9.5, tone: "blue" },
  { text: "a new app?", x: 44, y: 32, d: 1.2, t: 11, tone: "coral" },
  { text: "sketch", x: 6, y: 66, d: 6.3, t: 9, tone: "blue" },
  { text: "we need…", x: 36, y: 58, d: 3.3, t: 10.5, tone: "blue" },
  { text: "big idea", x: 56, y: 12, d: 5.4, t: 9, tone: "coral" },
  { text: "someday", x: 58, y: 46, d: 7.2, t: 10, tone: "blue" },
  { text: "thought", x: 22, y: 82, d: 1.8, t: 11, tone: "blue" },
  { text: "plan", x: 52, y: 74, d: 8.1, t: 9.5, tone: "coral" },
];

const BUBBLES = [
  { x: 18, s: 10, d: 0, t: 8 },
  { x: 34, s: 18, d: 2, t: 11 },
  { x: 48, s: 8, d: 4, t: 9 },
  { x: 62, s: 14, d: 1, t: 10 },
  { x: 74, s: 9, d: 5, t: 8.5 },
  { x: 26, s: 12, d: 6, t: 12 },
];

function Thoughts() {
  return (
    <div className="hero-thoughts relative h-[300px] overflow-hidden md:h-full">
      <p className="absolute left-5 top-4 z-10 text-xs lowercase tracking-wide text-[var(--omniray-slate)]">
        thoughts, ideas, concepts
      </p>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{ "--x": `${b.x}%`, "--s": `${b.s}px`, "--d": `${b.d}s`, "--t": `${b.t}s` } as Vars}
        />
      ))}
      {THOUGHTS.map((t) => (
        <span
          key={t.text}
          className="thought"
          data-tone={t.tone}
          style={{ left: `${t.x}%`, top: `${t.y}%`, "--d": `${t.d}s`, "--t": `${t.t}s` } as Vars}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}

/* ---------- right half: showreel (placeholder content) ---------- */

function Bars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="h-2 rounded-sm bg-white/20" style={{ width: `${90 - i * 14}%` }} />
      ))}
    </div>
  );
}

function Slide({ kind }: { kind: "dash" | "store" | "player" | "booking" }) {
  if (kind === "dash")
    return (
      <div className="grid h-full grid-cols-[28%_1fr] gap-3">
        <Bars n={5} className="pt-1" />
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-12 flex-1 rounded bg-white/15" />
            ))}
          </div>
          <div className="flex flex-1 items-end gap-2 rounded bg-white/10 p-3">
            {[40, 65, 50, 80, 60, 92, 70].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm"
                style={{ height: `${h}%`, background: i === 5 ? "var(--omniray-coral)" : "rgb(255 255 255 / .3)" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  if (kind === "store")
    return (
      <div className="grid h-full grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <span
              className="flex-1 rounded"
              style={{ background: i === 1 ? "var(--omniray-coral)" : "rgb(255 255 255 / .16)" }}
            />
            <Bars n={2} />
          </div>
        ))}
      </div>
    );
  if (kind === "player")
    return (
      <div className="grid h-full grid-cols-[40%_1fr] items-center gap-5">
        <span className="relative mx-auto aspect-square w-full rounded-full bg-white/15">
          <span className="absolute inset-[34%] rounded-full bg-[var(--omniray-coral)]" />
        </span>
        <div className="flex flex-col gap-4">
          <Bars n={3} />
          <span className="h-1.5 rounded-full bg-white/15">
            <span className="block h-full w-2/5 rounded-full bg-[var(--omniray-coral)]" />
          </span>
        </div>
      </div>
    );
  return (
    <div className="flex h-full flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-9 rounded border border-white/20 bg-white/5" />
      ))}
      <span className="mt-auto h-10 w-1/3 rounded bg-[var(--omniray-coral)]" />
    </div>
  );
}

const REEL = [
  { name: "project one", kind: "dash" },
  { name: "project two", kind: "store" },
  { name: "project three", kind: "player" },
  { name: "project four", kind: "booking" },
] as const;

function Showreel() {
  return (
    <div className="hero-reel relative h-[300px] overflow-hidden bg-[var(--omniray-blue)] text-[var(--omniray-off-white)] md:h-full">
      <p className="absolute bottom-4 left-5 z-10 text-xs lowercase tracking-wide text-[var(--omniray-mist)] md:bottom-auto md:left-auto md:right-5 md:top-4">
        digital presence
      </p>
      {REEL.map((s, i) => (
        <div key={s.name} className="reel-slide" style={{ "--d": `${i * 3}s` } as Vars} aria-hidden={i > 0}>
          <div className="w-[min(78%,420px)] overflow-hidden rounded-lg border border-white/15 bg-white/[.06] shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <span className="size-2 rounded-full bg-white/25" />
              <span className="size-2 rounded-full bg-white/25" />
              <span className="size-2 rounded-full bg-white/25" />
              <span className="ml-3 text-[10px] lowercase text-[var(--omniray-mist)]">{s.name}</span>
            </div>
            <div className="h-[170px] p-4 sm:h-[200px]">
              <Slide kind={s.kind} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- centre: the moving logo ---------- */

const SPARKS = [
  { d: "M0 0 L-6 -8 L-2 -12 L-12 -22 L-8 -26", delay: 0, dur: 2.2 },
  { d: "M0 0 L7 -6 L3 -11 L13 -17 L10 -24", delay: 0.7, dur: 2.4 },
  { d: "M0 0 L-8 3 L-14 -2 L-24 4", delay: 1.3, dur: 2 },
  { d: "M0 0 L9 4 L16 0 L25 6", delay: 0.35, dur: 2.6 },
  { d: "M0 0 L-4 9 L-1 14 L-8 22", delay: 1.0, dur: 2.3 },
  { d: "M0 0 L5 9 L2 14 L9 21", delay: 1.6, dur: 2.1 },
];

function MovingLogo() {
  return (
    <svg
      viewBox="-3 -1 126 126"
      role="img"
      aria-label="OmniRay"
      className="h-full w-full overflow-visible"
    >
      <title>OmniRay</title>
      {/* spinning ring + arrowheads, clockwise */}
      <g transform="translate(60 60)">
        <g className="mark-spin">
          <g transform="translate(-60 -60)">
            <path d="M81.92 21.06A50 50 0 1 1 38.08 21.06" fill="none" stroke="#F6F4F1" strokeWidth="13" />
            <polygon points="86.08,12.52 77.76,29.6 73.83,17.11" fill="#F6F4F1" stroke="#F6F4F1" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="33.92,12.52 42.24,29.6 46.17,17.11" fill="#F6F4F1" stroke="#F6F4F1" strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        </g>
      </g>
      {/* exclamation point */}
      <polygon points="54.5,3.5 65.5,3.5 62.5,68.5 57.5,68.5" fill="#FF5A36" stroke="#FF5A36" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="60" cy="88" r="6.5" fill="#FF5A36" />
      {/* electric sparks from the dot */}
      <g transform="translate(60 88)">
        {SPARKS.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            className="spark"
            style={{ "--d": `${s.delay}s`, "--t": `${s.dur}s` } as Vars}
            fill="none"
            stroke="#FF5A36"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
      <g fill="none" stroke="#F6F4F1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="39.7,48 33.7,54 39.7,60" />
        <line x1="74.4" y1="62" x2="79.4" y2="46" />
        <polyline points="85.8,48 91.8,54 85.8,60" />
      </g>
    </svg>
  );
}

/* ---------- hero ---------- */

export function Hero() {
  return (
    <section aria-label="from thought to digital presence">
      <div className="relative grid md:h-[min(68vh,620px)] md:grid-cols-2">
        <Thoughts />
        <Showreel />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex size-[clamp(170px,22vw,260px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--omniray-blue)] shadow-[0_0_0_10px_rgb(248_250_253/0.9)]">
          <div className="size-[68%]">
            <MovingLogo />
          </div>
        </div>
      </div>
    </section>
  );
}
