import Image from "next/image";
import type { CSSProperties } from "react";
import { Notes } from "@/components/hero-notes";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- right half: showreel in a raised browser card ---------- */

const SHOTS = [
  { src: "/reel/gameboyrecords.webp", w: 649, h: 2000, label: "gameboyrecords.com" },
  { src: "/reel/fllogistics.webp", w: 717, h: 2000, label: "fllogisticsintl.com" },
];

function Showreel() {
  return (
    <div className="relative flex h-[300px] items-center justify-center md:h-full">
      <div className="reel-card mt-16 flex h-[min(66%,500px)] w-[min(84%,480px)] md:mt-0 md:h-[min(82%,500px)] flex-col overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-[var(--omniray-blue)]/10 px-3 py-2">
          <span className="size-2 rounded-full bg-[var(--omniray-blue)]/20" />
          <span className="size-2 rounded-full bg-[var(--omniray-blue)]/20" />
          <span className="size-2 rounded-full bg-[var(--omniray-blue)]/20" />
          <span className="relative ml-3 h-4 flex-1">
            {SHOTS.map((s, i) => (
              <span
                key={s.label}
                className="reel-label absolute inset-y-0 left-0 text-[11px] leading-4 text-[var(--omniray-slate)]"
                style={{ animationDelay: `${-i * 22}s` }}
              >
                {s.label}
              </span>
            ))}
          </span>
        </div>
        <div className="reel-view relative min-h-0 flex-1 overflow-hidden bg-white">
          {SHOTS.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt=""
              width={s.w}
              height={s.h}
              unoptimized
              priority={i === 0}
              aria-hidden
              className="reel-shot"
              style={{ animationDelay: `${-i * 22}s` }}
            />
          ))}
        </div>
      </div>
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
      <div className="stage-surface relative z-10 grid overflow-hidden md:h-[min(68vh,620px)] md:grid-cols-2">
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
