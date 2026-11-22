import Image from "next/image";
import Link from "next/link";
import { REEL } from "@/lib/projects";

export function ShowReel() {
  // The list is rendered twice so the loop is seamless; the copy is hidden from assistive
  // tech and made inert so its links can't take focus.
  return (
    <div
      className="reel relative overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      style={{ "--reel-duration": `${REEL.length * 12}s` } as React.CSSProperties}
    >
      <ul className="reel-track flex w-max">
        {[...REEL, ...REEL].map((item, i) => (
          <li
            key={`${item.name}-${i}`}
            aria-hidden={i >= REEL.length || undefined}
            inert={i >= REEL.length || undefined}
            className="shrink-0 pr-6 sm:pr-10"
          >
            <figure className="group w-[78vw] max-w-[640px] sm:w-[560px] md:w-[640px]">
              <Link
                href={`/work#${item.project}`}
                data-cursor="view"
                data-cursor-label="View"
                className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <div className="overflow-hidden shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)] transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 768px) 640px, 78vw"
                      unoptimized={item.image.endsWith(".gif")}
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </Link>
              <figcaption className="mt-4 px-1 font-mono text-[13px] text-white/85">{item.name}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
