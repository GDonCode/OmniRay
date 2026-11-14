import Image from "next/image";
import type { CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- left half: a sky with thought clouds ---------- */

// plain sky clouds drifting across (top %, width px, seconds per crossing, start offset in seconds)
const SKY_CLOUDS = [
  { y: 8, w: 110, t: 80, d: -10, o: 0.9 },
  { y: 22, w: 80, t: 100, d: -55, o: 0.75 },
  { y: 38, w: 140, t: 90, d: -30, o: 0.95 },
  { y: 52, w: 90, t: 110, d: -70, o: 0.7 },
  { y: 66, w: 130, t: 85, d: -45, o: 0.85 },
  { y: 78, w: 100, t: 95, d: -20, o: 0.7 },
  { y: 90, w: 150, t: 105, d: -80, o: 0.8 },
];

// thought clouds with words in them, fading in and out
const THOUGHTS = [
  { text: "idea", x: 8, y: 16, d: 0, t: 9 },
  { text: "what if…", x: 40, y: 8, d: 2.4, t: 10 },
  { text: "concept", x: 12, y: 46, d: 4.5, t: 9.5 },
  { text: "a new app?", x: 44, y: 38, d: 1.2, t: 11 },
  { text: "thought", x: 6, y: 74, d: 6.6, t: 10 },
  { text: "big plan", x: 34, y: 64, d: 3.3, t: 10.5 },
];

function SkyClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {SKY_CLOUDS.map((c, i) => (
        <Image
          key={i}
          src="/hero/cloud.png"
          alt=""
          width={48}
          height={48}
          unoptimized
          className="sky-cloud"
          style={{ top: `${c.y}%`, width: c.w, "--t": `${c.t}s`, "--d": `${c.d}s`, opacity: c.o } as Vars}
        />
      ))}
    </div>
  );
}

function Thoughts() {
  return (
    <div className="relative h-[300px] overflow-hidden md:h-full">
      {THOUGHTS.map((t) => (
        <span
          key={t.text}
          className="thought"
          style={{ left: `${t.x}%`, top: `${t.y}%`, "--t": `${t.t}s`, "--d": `${t.d}s` } as Vars}
        >
          <Image src="/hero/thought-cloud.png" alt="" width={48} height={48} unoptimized aria-hidden />
          <span>{t.text}</span>
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
            d={r.long ? "M0 -11 L0 -26" : "M0 -11 L0 -20"}
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
    <section aria-label="from thought to digital presence" className="hero-sky relative overflow-hidden">
      <SkyClouds />
      <div className="relative z-10 grid md:h-[min(68vh,620px)] md:grid-cols-2">
        <Thoughts />
        <Showreel />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-[clamp(120px,15vw,180px)] -translate-x-1/2 -translate-y-1/2">
          <MovingLogo />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
