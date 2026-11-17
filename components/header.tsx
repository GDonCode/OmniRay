"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

const TABS = [
  { href: "/", label: "home" },
  { href: "/services", label: "services" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

function PhoneIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex flex-col-reverse md:flex-row">
      {/* section 1: nav links (mint in light mode, slate-green in dark mode) */}
      <nav
        aria-label="main"
<<<<<<< HEAD
        className="flex h-[46px] items-stretch border-b border-omniray-ink/10 bg-omniray-mint md:h-auto md:px-4 dark:border-white/10 dark:bg-[#3A4A44]"
=======
        className="flex items-stretch border-b border-[var(--omniray-blue)]/10 bg-[var(--paper)] md:h-auto md:px-4 h-[46px] dark:border-white/10 dark:bg-[#0a1c36]"
>>>>>>> c81144e6745e3cf7dc039f5435842bcb76143c7a
      >
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="tab hover-grow"
            aria-current={pathname === t.href ? "page" : undefined}
          >
            <span className="grow-inner">{t.label}</span>
          </Link>
        ))}
      </nav>

<<<<<<< HEAD
      {/* section 2: logo + contact (white in light mode, orange in dark mode) */}
      <div className="flex items-stretch justify-evenly border-b border-omniray-ink/10 bg-white md:flex-1 dark:border-omniray-ink/20 dark:bg-omniray-orange">
=======
      {/* section 2: logo + contact. Off-white with the blue logo in light mode, deep blue with the reversed logo in dark mode. */}
      <div className="flex items-stretch justify-evenly bg-[var(--omniray-off-white)] md:flex-1 dark:bg-[var(--omniray-blue)]">
>>>>>>> c81144e6745e3cf7dc039f5435842bcb76143c7a
        <Link
          href="/"
          aria-label="omniray software solutions"
          className="flex shrink-0 items-center py-[12.6px]"
        >
          <span className="flex items-center gap-[13px]">
<<<<<<< HEAD
            <Logo variant="horizontal" tone="color" height={34.65} priority className="dark:hidden" />
            <Logo variant="horizontal" tone="ink" height={34.65} priority className="hidden dark:block" />
            <span className="hidden h-[23px] w-px bg-omniray-ink/25 sm:block" aria-hidden />
            <span className="hidden text-[16.2px] font-medium lowercase tracking-wide text-omniray-ink sm:block">
=======
            <Logo variant="horizontal" on="light" height={34.65} priority className="dark:hidden" />
            <Logo variant="horizontal" on="dark" height={34.65} priority className="hidden dark:block" />
            <span className="hidden h-[23px] w-px bg-[var(--omniray-blue)]/25 sm:block dark:bg-white/25" aria-hidden />
            <span className="hidden text-[16.2px] font-medium lowercase tracking-wide text-[var(--omniray-blue)] sm:block dark:text-[var(--omniray-off-white)]">
>>>>>>> c81144e6745e3cf7dc039f5435842bcb76143c7a
              software solutions
            </span>
          </span>
        </Link>
        <Link
          href="/contact"
          className="hover-grow flex items-center bg-omniray-orange px-[25px] text-[14.7px] font-medium lowercase text-omniray-ink dark:bg-omniray-ink dark:text-white"
        >
          <span className="grow-inner gap-2">
            <PhoneIcon />
            contact
          </span>
        </Link>
      </div>
    </header>
  );
}
