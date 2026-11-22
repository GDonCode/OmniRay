import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected OmniRay projects: a freight forwarding platform and a record label site, shop and members club.",
};

export default function WorkPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-6 pt-36 pb-24">
      <h1 className="font-heading text-4xl leading-[1.05] font-medium tracking-tight text-white sm:text-6xl">
        Selected work
      </h1>
      <p className="mt-6 max-w-xl font-mono text-[15px] leading-7 tracking-tight text-white/85 sm:text-base sm:leading-8">
        Real products for real businesses, built to take orders, collect payments and keep customers coming back.
      </p>

      <div className="mt-16 space-y-24">
        {PROJECTS.map((p) => (
          <article key={p.slug} id={p.slug} className="scroll-mt-28">
            <div className={`grid gap-3 ${p.shots.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {p.shots.map((s, i) => (
                <div
                  key={s.src}
                  className={`relative aspect-[16/10] overflow-hidden ${p.shots.length > 1 && i === 0 ? "sm:col-span-2" : ""}`}
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1152px) 1100px, 100vw"
                    unoptimized={s.src.endsWith(".gif")}
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl font-medium tracking-tight text-white">{p.name}</h2>
                <p className="mt-2 font-mono text-[14px] text-white/85">{p.kind}</p>
                <p className="mt-4 font-mono text-[13px] text-white/60">Client</p>
                <p className="font-mono text-[15px] text-white">{p.client}</p>
                {p.url && (
                  <Link
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-mono text-[15px] text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    {p.url.replace("https://", "")} ↗
                  </Link>
                )}
              </div>

              <div>
                <h3 className="font-mono text-[13px] text-[#ff5f00]">Result</h3>
                <p className="mt-2 font-mono text-[15px] leading-7 tracking-tight text-white">{p.result}</p>

                <h3 className="mt-8 font-mono text-[13px] text-[#ff5f00]">What we built</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-[14px] leading-6 tracking-tight text-white/85 marker:text-white/40">
                  {p.built.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <h3 className="mt-8 font-mono text-[13px] text-[#ff5f00]">Tech</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li key={t} className="border border-white/20 px-2.5 py-1 font-mono text-[12px] text-white/85">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
