import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/button";
import { PROJECTS, type Project } from "@/lib/projects";

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
        unoptimized={src.endsWith(".gif")}
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

function ProjectSection({ p, index }: { p: Project; index: number }) {
  const [hero, ...rest] = p.shots;
  // Remaining screenshots follow the text, one per row, alternating sides.
  return (
    <article id={p.slug} className="scroll-mt-16">
      {/* Hero: fills the viewport below the header; a screenshot of the site with a Visit overlay. */}
      <div className="group relative h-[calc(100svh-4rem)] min-h-[480px] overflow-hidden">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          unoptimized={hero.src.endsWith(".gif")}
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

      <div className="mx-auto max-w-6xl px-6">
        {/* Logo and What We Used sit level, overlaid on the bottom ~20% of the hero. */}
        <div className="relative z-10 -mt-[20svh] grid gap-6 lg:grid-cols-2">
          <div className="glass flex flex-col justify-center gap-4 p-6 sm:p-10">
            <ClientMark p={p} />
            <div>
              <p className="font-mono text-[15px] text-white">{p.client}</p>
              <p className="mt-1 font-mono text-[14px] text-white/85">
                {p.kind}
              </p>
            </div>
          </div>
          <div className="glass p-6 sm:p-10">
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
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className={label}>Result</h3>
            <p className="mt-2 font-mono text-[15px] leading-7 tracking-tight text-white">
              {p.result}
            </p>
          </div>
          <div>
            <h3 className={label}>What we built</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-[14px] leading-6 tracking-tight text-white/85 marker:text-white/40">
              {p.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        {rest.map((s, i) => (
          <div
            key={s.src}
            className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div className={i % 2 ? "lg:order-2" : ""}>
              <Shot src={s.src} alt={s.alt} />
            </div>
            <p className="font-mono text-[14px] leading-7 tracking-tight text-white/85">
              {s.alt}
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
