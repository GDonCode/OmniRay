import Link from "next/link";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "#services", label: "services" },
  { href: "#work", label: "work" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F2747]/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="omniray software solutions" className="flex items-center gap-3">
          <Logo variant="horizontal" on="dark" height={32} priority />
          <span className="hidden h-5 w-px bg-white/20 sm:block" aria-hidden />
          <span className="hidden text-sm lowercase tracking-wide text-[var(--omniray-mist)] sm:block">
            software solutions
          </span>
        </Link>

        <nav aria-label="main" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm lowercase tracking-wide text-[var(--omniray-off-white)]/80 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-[var(--omniray-coral)] px-5 py-2 text-sm font-semibold lowercase text-[var(--omniray-blue)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          get in touch
        </a>
      </div>
    </header>
  );
}
