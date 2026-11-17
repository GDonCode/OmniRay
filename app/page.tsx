import Link from "next/link";
import { Hero } from "@/components/hero";

const WORK = [
  {
    index: "01",
    name: "fl logistics",
    url: "https://fllogisticsintl.com",
    label: "fllogisticsintl.com",
    oneLiner:
      "A custom WordPress/WooCommerce platform for a Jamaica–Florida freight company: bookings, truck routing, payments, live auctions and ecommerce in one site.",
    blurb:
      "FL Logistics needed one site to replace a pile of manual freight work. We designed and built a custom WooCommerce theme with five freight booking forms, a shipment-tracking customer dashboard with per-order chat, a custom Authorize.Net payment page, automatic invoices and bills of lading, truck-aware ground freight quoting, and a race-condition-safe live auction. We still run it today on a monthly retainer.",
    tags: ["woocommerce", "bookings", "payments", "live auction"],
  },
  {
    index: "02",
    name: "gameboy records",
    url: "https://gameboyrecords.com",
    label: "gameboyrecords.com",
    oneLiner:
      "A full-stack website and rewards membership platform for an independent record label, covering music, merch, shows, karaoke and a trivia game.",
    blurb:
      "Gameboy Records is the home on the web for Jamaican artist Alexx A-Game's independent label. We designed and built the site from scratch with Next.js, Supabase and WooCommerce. Visitors flip through the discography in a 3D record crate, shop print-on-demand apparel through a WooCommerce and Tapstitch store, sing along to word-synced karaoke and play a timed trivia game. Members join the Playaz Club to earn points and unlock rewards.",
    tags: ["next.js", "supabase", "woocommerce", "membership"],
  },
];

const CAPABILITIES = [
  {
    title: "custom web platforms",
    text: "Sites that do real work: dashboards, accounts, tracking and admin tools built around how your business operates.",
  },
  {
    title: "ecommerce",
    text: "WooCommerce stores, print-on-demand, custom checkout and payment flows.",
  },
  {
    title: "bookings and automation",
    text: "Booking forms, quoting, invoices and documents generated automatically, so manual work disappears.",
  },
  {
    title: "ongoing support",
    text: "We stay on after launch. Monthly retainers keep your platform fast, safe and improving.",
  },
];

export default function Home() {
  return (
    <>
      {/* hero */}
      <Hero>
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
        <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,5rem)] font-bold lowercase leading-[1.04] tracking-tight">
          turn your thoughts and ideas into a digital presence
          <span className="text-[var(--omniray-coral)]">.</span>
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium lowercase">
          <Link
            href="/contact"
            className="bg-[var(--omniray-blue)] px-6 py-3 text-[var(--omniray-off-white)] transition-opacity hover:opacity-90"
          >
            start a project
          </Link>
          <a href="#work" className="underline underline-offset-4">
            view some examples
          </a>
        </div>
      </section>
      </Hero>

      {/* selected work */}
      <section id="work" className="border-t border-[var(--omniray-blue)]/15">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <p className="mb-12 text-sm font-medium lowercase tracking-wide text-[var(--omniray-slate)]">
            selected work
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {WORK.map((w) => (
              <article
                key={w.name}
                className="flex flex-col bg-[var(--omniray-blue)] p-7 text-[var(--omniray-off-white)] sm:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm text-[var(--omniray-mist)]">{w.index}</span>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm lowercase text-[var(--omniray-mist)] underline-offset-4 hover:text-white hover:underline"
                  >
                    {w.label} ↗
                  </a>
                </div>

                <h2 className="mt-16 text-4xl font-bold lowercase leading-tight tracking-tight sm:text-5xl">
                  {w.name}
                </h2>
                <p className="mt-5 text-lg leading-7">{w.oneLiner}</p>
                <p className="mt-5 text-sm leading-6 text-[var(--omniray-mist)]">{w.blurb}</p>

                <ul className="mt-auto flex flex-wrap gap-2 pt-10">
                  {w.tags.map((t) => (
                    <li
                      key={t}
                      className="border border-white/25 px-3 py-1 text-xs lowercase text-[var(--omniray-off-white)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* capabilities */}
      <section className="border-t border-[var(--omniray-blue)]/15">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <p className="mb-12 text-sm font-medium lowercase tracking-wide text-[var(--omniray-slate)]">
            what we do
          </p>
          <ul>
            {CAPABILITIES.map((c, i) => (
              <li
                key={c.title}
                className="grid gap-3 border-t border-[var(--omniray-blue)]/15 py-8 md:grid-cols-[4rem_1fr_1fr] md:gap-8"
              >
                <span className="text-sm text-[var(--omniray-slate)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-bold lowercase tracking-tight sm:text-3xl">
                  {c.title}
                </h3>
                <p className="leading-7 text-[var(--omniray-slate)]">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* closing cta */}
      <section className="bg-[var(--omniray-blue)] text-[var(--omniray-off-white)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between md:py-28">
          <h2 className="max-w-2xl text-[clamp(2rem,5vw,4rem)] font-bold lowercase leading-[1.05] tracking-tight">
            have something to build?
          </h2>
          <Link
            href="/contact"
            className="bg-[var(--omniray-coral)] px-8 py-4 text-sm font-medium lowercase text-[var(--omniray-blue)] transition-opacity hover:opacity-90"
          >
            get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
