import Image from "next/image";

type Project = {
  name: string;
  kind: string;
  /** Screenshot in /public. When set it replaces the drawn preview. */
  image?: string;
  /** Colours for the drawn preview used until a real screenshot exists. */
  theme: {
    bg: string;
    fg: string;
    muted: string;
    accent: string;
    panel: string;
    banner?: string;
  };
  eyebrow: string;
  headline: string;
};

// Placeholder work. Swap in real projects and screenshots (16:10 works best).
const PROJECTS: Project[] = [
  {
    name: "FL Logistics",
    kind: "Freight forwarding portal",
    image: "/reel/fllogistics.webp",
    theme: { bg: "#fff", fg: "#000", muted: "#666", accent: "#000", panel: "#eee" },
    eyebrow: "",
    headline: "",
  },
  {
    name: "Gameboy Records",
    kind: "Record label e-commerce and membership",
    image: "/reel/gameboyrecords.gif",
    theme: { bg: "#fff", fg: "#000", muted: "#666", accent: "#000", panel: "#eee" },
    eyebrow: "",
    headline: "",
  },
  {
    name: "Gameboy Records: Music",
    kind: "Record label music player",
    image: "/reel/gameboyrecords-music.webp",
    theme: { bg: "#fff", fg: "#000", muted: "#666", accent: "#000", panel: "#eee" },
    eyebrow: "",
    headline: "",
  },
  {
    name: "Gameboy Records: Vibes",
    kind: "Record label lyrics player",
    image: "/reel/gameboyrecords-vibes.webp",
    theme: { bg: "#fff", fg: "#000", muted: "#666", accent: "#000", panel: "#eee" },
    eyebrow: "",
    headline: "",
  },
  {
    name: "Lumen Health",
    kind: "Patient portal",
    theme: {
      bg: "#F7FAF9",
      fg: "#123B36",
      muted: "#5E7C77",
      accent: "#1F9D86",
      panel: "#E3EFEC",
    },
    eyebrow: "Care, simplified",
    headline: "Book, message and manage your care",
  },
  {
    name: "Atlas Pay",
    kind: "Fintech marketing site",
    theme: {
      bg: "#0B0D17",
      fg: "#F1F2F8",
      muted: "#8A8FA8",
      accent: "#7C6CFF",
      panel: "#171A2B",
      banner: "#7C6CFF",
    },
    eyebrow: "Payments infrastructure",
    headline: "Move money across borders in seconds",
  },
  {
    name: "Fieldnote",
    kind: "iOS and web app",
    theme: {
      bg: "#FFF6EF",
      fg: "#2B1A12",
      muted: "#8A6F60",
      accent: "#FF5200",
      panel: "#FBE6D8",
    },
    eyebrow: "Research notebook",
    headline: "Capture interviews, find the patterns",
  },
  {
    name: "Harbor",
    kind: "Internal CMS",
    theme: {
      bg: "#F4F5F7",
      fg: "#1B2330",
      muted: "#6B7685",
      accent: "#2563EB",
      panel: "#E4E7EC",
    },
    eyebrow: "Content operations",
    headline: "Publish to every channel from one place",
  },
];

export function ShowReel() {
  // The list is rendered twice so the loop is seamless; the copy is hidden from assistive tech.
  return (
    <div
      className="reel relative overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      style={{ "--reel-duration": `${PROJECTS.length * 12}s` } as React.CSSProperties}
    >
      <ul className="reel-track flex w-max">
        {[...PROJECTS, ...PROJECTS].map((project, i) => (
          <li
            key={`${project.name}-${i}`}
            aria-hidden={i >= PROJECTS.length || undefined}
            className="shrink-0 pr-6 sm:pr-10"
          >
            <ReelCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReelCard({ project }: { project: Project }) {
  return (
    <figure className="group w-[78vw] max-w-[640px] sm:w-[560px] md:w-[640px]">
      <div className="overflow-hidden border border-omniray-ink/10 bg-white p-1.5 shadow-[0_24px_48px_-16px_rgb(15_38_31/0.28),0_2px_6px_rgb(15_38_31/0.08)] transition-transform duration-500 group-hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name} — ${project.kind}`}
              fill
              sizes="(min-width: 768px) 640px, 78vw"
              unoptimized={project.image.endsWith(".gif")}
              className="object-cover object-top"
            />
          ) : (
            <MockSite project={project} />
          )}
        </div>
      </div>
      <figcaption className="mt-4 px-1 font-mono text-[13px] text-[#939393]">
        {project.name}
      </figcaption>
    </figure>
  );
}

/** A drawn stand-in for a project screenshot. */
function MockSite({ project }: { project: Project }) {
  const t = project.theme;
  return (
    <div
      role="img"
      aria-label={`${project.name} — ${project.kind} (preview)`}
      className="absolute inset-0 flex flex-col text-left"
      style={{ background: t.bg, color: t.fg }}
    >
      {t.banner && (
        <div
          className="py-1 text-center text-[8px] font-semibold tracking-wide sm:text-[10px]"
          style={{ background: t.banner, color: "#fff" }}
        >
          New: live weekly demo, Thursdays at 9am PT
        </div>
      )}
      <div className="flex items-center gap-4 px-[5%] py-[2.5%] text-[8px] sm:text-[10px]">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="size-3 rounded-sm" style={{ background: t.accent }} />
          {project.name}
        </span>
        <span className="hidden gap-3 sm:flex" style={{ color: t.muted }}>
          <span>Product</span>
          <span>Docs</span>
          <span>Pricing</span>
        </span>
        <span
          className="ml-auto rounded px-2 py-1 font-semibold"
          style={{ background: t.accent, color: "#fff" }}
        >
          Get started
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center px-[8%] pt-[5%] text-center">
        <span
          className="text-[7px] font-semibold tracking-[0.18em] uppercase sm:text-[9px]"
          style={{ color: t.muted }}
        >
          {project.eyebrow}
        </span>
        <span className="mt-2 max-w-[22ch] text-[15px] leading-tight font-bold tracking-tight sm:text-[26px]">
          {project.headline}
        </span>
        <span className="mt-3 flex gap-2 text-[8px] font-semibold sm:text-[10px]">
          <span className="rounded px-2.5 py-1" style={{ background: t.accent, color: "#fff" }}>
            Try it free
          </span>
          <span className="px-2.5 py-1" style={{ color: t.fg }}>
            Book a demo →
          </span>
        </span>
        <div
          className="mt-[5%] grid w-[86%] flex-1 grid-cols-[1fr_3fr] gap-2 rounded-t-md p-2"
          style={{ background: t.panel }}
        >
          <div className="flex flex-col gap-1.5">
            {[70, 55, 80, 60].map((w, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full"
                style={{ width: `${w}%`, background: t.muted, opacity: i === 0 ? 0.9 : 0.4 }}
              />
            ))}
          </div>
          <div className="flex items-end gap-1.5">
            {[40, 65, 50, 80, 60, 90, 75, 55].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background: i === 5 ? t.accent : t.muted,
                  opacity: i === 5 ? 1 : 0.35,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
