import { HeroBackground } from "@/components/home/hero-background";
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
    <main className="relative flex-1 overflow-x-clip">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-black text-white">
        <HeroBackground />
        <GuideFrame />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-16 pb-24 text-center sm:pt-24 sm:pb-32">
          <h1 className="font-serif text-5xl leading-[1.05] font-medium tracking-tight text-balance text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] sm:text-7xl">
            Turn your busywork into software that earns
          </h1>

          <p className="mt-6 max-w-xl font-mono text-[15px] leading-7 tracking-tight text-pretty text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.4)] sm:text-base sm:leading-8">
            We build the websites, platforms and tools that take bookings,
            collect payments and keep customers coming back, so you spend
            less time on manual work and more on growth.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <ShortcutLink href="/contact" shortcut="S" onDark icon={<ArrowIcon />}>
              Get your free project plan
            </ShortcutLink>
            <ShortcutLink href="#work" shortcut="W" variant="secondary" onDark icon={<PlayIcon />}>
              See the results
            </ShortcutLink>
          </div>
        </div>
      </section>

      {/* Show reel + pillars */}
      <section id="work" className="relative scroll-mt-8 pb-24">
        <h2 className="sr-only">Selected work</h2>
        <ShowReel />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid divide-y divide-omniray-ink/10 rounded-xl border border-omniray-ink/10 bg-white/80 shadow-[0_1px_2px_rgb(15_38_31/0.04)] backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PILLARS.map((pillar) => (
              <li key={pillar.title} className="p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-mono text-[15px] text-omniray-ink">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-4 fill-none stroke-omniray-orange stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                  >
                    {pillar.icon}
                  </svg>
                  {pillar.title}
                </h2>
                <p className="mt-2 font-mono text-[13px] leading-6 tracking-tight text-omniray-ink-muted">
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

/** Dashed guide lines with diamond markers framing the hero, like a blueprint. */
function GuideFrame() {
  const diamond =
    "absolute size-2 rotate-45 border border-white/50 bg-black";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      <div className="absolute inset-y-0 left-[max(1.5rem,calc(50%-36rem))] border-l border-dashed border-white/20" />
      <div className="absolute inset-y-0 right-[max(1.5rem,calc(50%-36rem))] border-r border-dashed border-white/20" />
      <div className="absolute inset-x-0 top-12 border-t border-dashed border-white/20" />
      <div className="absolute inset-x-0 bottom-0 border-t border-dashed border-white/20" />
      <span className={`${diamond} top-12 left-[max(1.5rem,calc(50%-36rem))] -translate-x-1/2 -translate-y-1/2`} />
      <span className={`${diamond} top-12 right-[max(1.5rem,calc(50%-36rem))] translate-x-1/2 -translate-y-1/2`} />
      <span className={`${diamond} bottom-0 left-[max(1.5rem,calc(50%-36rem))] -translate-x-1/2 translate-y-1/2`} />
      <span className={`${diamond} right-[max(1.5rem,calc(50%-36rem))] bottom-0 translate-x-1/2 translate-y-1/2`} />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l5.5-3.5z" />
    </svg>
  );
}
