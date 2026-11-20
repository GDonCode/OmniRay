import { FluidBackground } from "@/components/FluidBackground";
import { Header } from "@/components/header";
import { ShortcutLink } from "@/components/home/shortcut-link";
import { ShowReel } from "@/components/home/show-reel";

const PILLARS = [
  {
    title: "Design",
    body: "Product strategy, UX and interface design that makes complex tools feel simple.",
    icon: (
      <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    ),
  },
  {
    title: "Engineering",
    body: "Web platforms, apps and internal tools built to be fast, tested and easy to grow.",
    icon: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  },
  {
    title: "Partnership",
    body: "One small senior team from first sketch to launch, and on call long after.",
    icon: (
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    ),
  },
];

export default function Home() {
  return (
    <>
    <Header />
    {/* Dark page: solid #111, a faint dot grid and a pointer-driven fluid glow behind the content. */}
    <main className="relative isolate flex-1 overflow-x-clip bg-[#111111] text-white">
      <FluidBackground />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto flex min-h-[min(100svh,860px)] max-w-6xl flex-col justify-center px-6 pt-32 pb-20 sm:pt-36">
          <div>
            <h1 className="font-heading text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:whitespace-nowrap lg:text-[4.25rem]">
              <span className="block text-white">Turn your busywork into</span>
              <span className="block text-[#ff5f00]">software that earns.</span>
            </h1>

            <p className="mt-6 max-w-md font-mono text-[15px] leading-7 tracking-tight text-[#939393] sm:text-base sm:leading-8">
              We build the websites, platforms and tools that take bookings,
              collect payments and keep customers coming back, so you spend
              less time on manual work and more on growth.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
              <ShortcutLink
                href="/contact"
                shortcut="S"
                className="btn-square btn-hero-primary"
                icon={<SquareBullet />}
              >
                Get your free project plan
              </ShortcutLink>
              <ShortcutLink
                href="#work"
                shortcut="W"
                variant="secondary"
                className="btn-square btn-hero-secondary"
                icon={<SquareBullet />}
              >
                See the results
              </ShortcutLink>
            </div>
          </div>
        </div>
      </section>

      {/* Show reel + pillars */}
      <section id="work" className="relative scroll-mt-8 pb-24">
        <h2 className="sr-only">Selected work</h2>
        <ShowReel />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid divide-y divide-white/10 border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PILLARS.map((pillar) => (
              <li key={pillar.title} className="p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-mono text-[15px] text-white">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-4 fill-none stroke-[#ff5f00] stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                  >
                    {pillar.icon}
                  </svg>
                  {pillar.title}
                </h2>
                <p className="mt-2 font-mono text-[13px] leading-6 tracking-tight text-[#939393]">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
    </>
  );
}

function SquareBullet() {
  return (
    <svg aria-hidden viewBox="0 0 18 18" className="size-full">
      <rect x="5" y="5" width="8" height="8" fill="currentColor" />
    </svg>
  );
}
