import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/button";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectStage } from "./project-stage";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected OmniRay projects: a freight forwarding platform and a record label site, shop and members club.",
};

const label = "font-mono text-[13px] text-[#ff5f00]";

function Shot({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1152px) 560px, 100vw"
        unoptimized={isStatic(src)}
        className="object-cover object-top"
      />
    </div>
  );
}

function ClientMark({ p }: { p: Project }) {
  if (p.logo) {
    return (
      <Image
        src={p.logo.src}
        alt={p.logo.alt}
        width={240}
        height={96}
        className="h-16 w-auto object-contain object-left"
      />
    );
  }
  return (
    <p className="font-heading text-3xl font-medium tracking-tight text-white">
      {p.name}
    </p>
  );
}

const isStatic = (src: string) => src.endsWith(".gif") || src.endsWith(".svg");

function ProjectSection({ p, index }: { p: Project; index: number }) {
  const [hero, ...rest] = p.shots;

  const heroEl = (
    <div className="group relative h-[calc(100svh-4rem)] overflow-hidden lg:absolute lg:inset-0 lg:h-auto">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority={index === 0}
        sizes="100vw"
        unoptimized={isStatic(hero.src)}
        className="object-cover object-top"
      />
      {p.url && (
        <>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0"
          />
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:bg-black/30">
            <Button
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-square pointer-events-auto"
            >
              {`Visit “${p.url.replace("https://", "")}” ↗`}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const panels = (
    <>
      <div className="glass relative flex flex-col gap-8 p-6 sm:p-10">
        <div className="flex flex-col gap-4">
          <ClientMark p={p} />
          <div>
            <p className="font-mono text-[15px] text-white">{p.client}</p>
            <p className="mt-1 font-mono text-[14px] text-white/85">{p.kind}</p>
          </div>
        </div>
        <div>
          <h3 className={label}>Result</h3>
          <p className="mt-2 font-mono text-[15px] leading-7 tracking-tight text-white">
            {p.result}
          </p>
        </div>
      </div>
      <div className="glass relative p-6 sm:p-10">
        <h2 className="font-heading text-3xl font-medium tracking-tight text-white">
          What We Used
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <li
              key={t}
              className="border border-white/20 px-2.5 py-1 font-mono text-[12px] text-white/85"
            >
              {t}
            </li>
          ))}
        </ul>
        <h3 className={`${label} mt-8`}>What we built</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-[14px] leading-6 tracking-tight text-white/85 marker:text-white/40">
          {p.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <article id={p.slug} className="scroll-mt-16">
      <ProjectStage hero={heroEl} panels={panels} />

      <div className="mx-auto max-w-6xl px-6">
        {rest.map((s, i) => (
          <div
            key={`${s.src}-${i}`}
            className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div className={i % 2 ? "lg:order-2" : ""}>
              <Shot src={s.src} alt={s.alt} />
            </div>
            <p className="font-mono text-[14px] leading-7 tracking-tight text-white/85">
              {s.caption ?? s.alt}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function WorkPage() {
  return (
    <main className="relative pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-12">
        <h1 className="font-heading text-4xl leading-[1.05] font-medium tracking-tight text-white sm:text-6xl">
          Selected work
        </h1>
        <p className="mt-6 max-w-xl font-mono text-[15px] leading-7 tracking-tight text-white/85 sm:text-base sm:leading-8">
          Real products for real businesses, built to take orders, collect
          payments and keep customers coming back.
        </p>
      </div>
      <div className="space-y-32">
        {PROJECTS.map((p, i) => (
          <ProjectSection key={p.slug} p={p} index={i} />
        ))}
      </div>
    </main>
  );
}
