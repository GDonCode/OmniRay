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
      width="16"
      height="16"
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
    <header className="flex flex-col-reverse md:flex-row">
      {/* section 1: nav links, on paper */}
      <nav
        aria-label="main"
        className="flex h-11 items-stretch border-b border-[var(--omniray-blue)]/10 md:h-auto md:px-4"
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

      {/* section 2: logo + contact, on deep blue */}
      <div className="flex items-stretch justify-evenly bg-[var(--omniray-blue)] md:flex-1">
        <Link
          href="/"
          aria-label="omniray software solutions"
          className="flex shrink-0 items-center py-3"
        >
          <span className="flex items-center gap-[13px]">
            <Logo variant="horizontal" on="dark" height={33} priority />
            <span className="hidden h-[22px] w-px bg-white/25 sm:block" aria-hidden />
            <span className="hidden text-[15.4px] font-medium lowercase tracking-wide text-[var(--omniray-off-white)] sm:block">
              software solutions
            </span>
          </span>
        </Link>
        <Link
          href="/contact"
          className="hover-grow flex items-center bg-[var(--omniray-coral)] px-6 text-sm font-medium lowercase text-[var(--omniray-blue)]"
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
