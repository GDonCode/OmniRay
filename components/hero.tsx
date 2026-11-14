import { Caveat } from "next/font/google";
import type { CSSProperties } from "react";

const hand = Caveat({ subsets: ["latin"], weight: "500" });

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- left half: handwritten notes and doodles (static) ---------- */

type Note = { text: string; x: number; y: number; r: number; s: number; coral?: boolean; mark?: "circle" | "squiggle" };

const NOTES: Note[] = [
  { text: "what if…", x: 8, y: 9, r: -4, s: 1.4 },
  { text: "an app?", x: 44, y: 13, r: 3, s: 1.15 },
  { text: "booking?", x: 9, y: 33, r: 2, s: 1.05, mark: "squiggle" },
  { text: "online store", x: 34, y: 37, r: -3, s: 1.2, mark: "circle" },
  { text: "how do i…?", x: 8, y: 58, r: -2, s: 1.1 },
  { text: "my business!", x: 33, y: 61, r: 4, s: 1.3 },
  { text: "?", x: 60, y: 6, r: 8, s: 2.8 },
  { text: "?", x: 22, y: 76, r: -10, s: 2 },
  { text: "!", x: 61, y: 38, r: 6, s: 2.6, coral: true },
];

const doodle = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Notes() {
  return (
    <div
      className={`${hand.className} relative h-[300px] overflow-hidden text-[var(--omniray-blue)]/70 md:h-full`}
      aria-hidden
    >
      {NOTES.map((n, i) => (
        <span
          key={i}
          className="absolute whitespace-nowrap leading-none"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: `rotate(${n.r}deg)`,
            fontSize: `calc(clamp(1.25rem, 2.3vw, 1.9rem) * ${n.s})`,
            color: n.coral ? "var(--omniray-coral)" : undefined,
          }}
        >
          {n.text}
          {n.mark === "circle" && (
            <svg
              className="absolute -left-4 -top-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)]"
              viewBox="0 0 150 60"
              preserveAspectRatio="none"
              {...doodle}
            >
              <path vectorEffect="non-scaling-stroke" d="M14 38 C6 14 60 4 108 8 C148 12 152 40 104 50 C62 58 10 52 8 24" />
            </svg>
          )}
          {n.mark === "squiggle" && (
            <svg
              className="absolute -bottom-3 left-0 h-3 w-full"
              viewBox="0 0 84 12"
              preserveAspectRatio="none"
              {...doodle}
            >
              <path vectorEffect="non-scaling-stroke" d="M2 7 Q12 0 22 7 T42 7 T62 7 T82 7" />
            </svg>
          )}
        </span>
      ))}

      {/* arrow pointing toward the screen */}
      <svg className="absolute w-[110px]" style={{ left: "47%", top: "50%" }} viewBox="0 0 110 50" {...doodle}>
        <path d="M4 42 C34 6 74 4 100 26" />
        <path d="M86 22 L102 28 L96 12" />
      </svg>
      {/* little stars and a spark */}
      <svg className="absolute w-[22px]" style={{ left: "28%", top: "22%" }} viewBox="0 0 20 20" {...doodle}>
        <path d="M10 2 V18 M2 10 H18 M4.5 4.5 L15.5 15.5 M15.5 4.5 L4.5 15.5" />
      </svg>
      <svg className="absolute w-[18px]" style={{ left: "5%", top: "46%" }} viewBox="0 0 20 20" {...doodle}>
        <path d="M10 2 V18 M2 10 H18" />
      </svg>
      <svg className="absolute w-[20px]" style={{ left: "54%", top: "70%" }} viewBox="0 0 20 20" {...doodle}>
        <path d="M10 2 V18 M2 10 H18 M4.5 4.5 L15.5 15.5 M15.5 4.5 L4.5 15.5" />
      </svg>
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

/* Drop screen-recording clips in public/reel/ and list them here, e.g. ["/reel/one.mp4"].
   While this is empty, the placeholder mock slides below are shown. */
const REEL_CLIPS: string[] = [];

function Showreel() {
  return (
    <div className="hero-reel relative h-[300px] overflow-hidden bg-[var(--omniray-blue)] text-[var(--omniray-off-white)] md:h-full">
      {REEL_CLIPS.map((src, i) => (
        <div key={src} className="reel-slide" style={{ "--d": `${i * 3}s` } as Vars}>
          <video
            src={src}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      ))}
      {REEL_CLIPS.length === 0 && REEL.map((s, i) => (
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

const RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: i * 30,
  long: i % 2 === 0,
  delay: [0, 0.9, 0.4, 1.3, 0.7, 0.1, 1.1, 0.5, 1.5, 0.2, 1.0, 0.6][i],
}));

function MovingLogo() {
  return (
    <svg
      viewBox="12 0 96 120"
      role="img"
      aria-label="OmniRay"
      className="h-full w-full overflow-visible"
    >
      <title>OmniRay</title>
      {/* sun-ray sparks radiating from the dot */}
      <g transform="translate(60 88)">
        {RAYS.map((r) => (
          <path
            key={r.angle}
            d={r.long ? "M0 -9.5 L0 -16.5" : "M0 -9.5 L0 -13.5"}
            transform={`rotate(${r.angle})`}
            pathLength={1}
            className="spark"
            style={{ "--d": `${r.delay}s`, "--t": "1.8s" } as Vars}
            fill="none"
            stroke="#FF5A36"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* exclamation point */}
      <polygon points="54.5,3.5 65.5,3.5 62.5,68.5 57.5,68.5" fill="#FF5A36" stroke="#FF5A36" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="60" cy="88" r="6.5" fill="#FF5A36" />
    </svg>
  );
}

/* ---------- hero ---------- */

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section aria-label="from thought to digital presence" className="relative overflow-hidden">
      <div className="relative z-10 grid overflow-hidden md:h-[min(68vh,620px)] md:grid-cols-2">
        <Notes />
        <Showreel />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-[clamp(190px,24vw,300px)] -translate-x-1/2 -translate-y-1/2">
          <MovingLogo />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
