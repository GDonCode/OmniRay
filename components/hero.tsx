import Image from "next/image";
import type { CSSProperties } from "react";
import { Notes } from "@/components/hero-notes";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- right half: showreel, full bleed ---------- */

const SHOTS = [
  { src: "/reel/gameboyrecords.webp", w: 649, h: 2000 },
  { src: "/reel/fllogistics.webp", w: 717, h: 2000 },
];

function Showreel() {
  return (
    <div className="reel-view relative h-[300px] min-h-0 overflow-hidden bg-white md:h-full">
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
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "auto", animationDelay: `${-i * 32}s` }}
        />
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
            stroke="#FF5200"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* exclamation point */}
      <polygon points="54.5,3.5 65.5,3.5 62.5,68.5 57.5,68.5" fill="#FF5200" stroke="#FF5200" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="60" cy="88" r="6.5" fill="#FF5200" />
    </svg>
  );
}

/* ---------- hero ---------- */

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section aria-label="from thought to digital presence" className="relative overflow-hidden">
      <div className="relative z-10 grid overflow-hidden md:h-[min(68vh,620px)] md:grid-cols-2 md:grid-rows-[minmax(0,1fr)]">
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
