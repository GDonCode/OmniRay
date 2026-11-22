"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

const LOGO_ALT = "OmniRay Software Solutions";

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
  // Transparent over the hero; picks up a dark blurred backing once the page scrolls.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex flex-col-reverse border-b transition-colors duration-300 md:flex-row ${
        scrolled
          ? "border-white/10 bg-black/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* section 1: nav links */}
      <nav aria-label="main" className="flex h-[46px] items-stretch md:h-auto md:px-4">
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

      {/* section 2: logo + contact */}
      <div className="flex items-stretch justify-evenly md:flex-1">
        <Link
          href="/"
          aria-label="omniray software solutions"
          className="flex shrink-0 items-center py-[12.6px]"
        >
          {/* Dark-background lockups: full nav lockup from sm up, wordmark lockup on narrow
              phones, mark only below 380px. The others stay in the DOM but are display:none. */}
          <Logo variant="nav" tone="web" height={34.65} alt={LOGO_ALT} priority className="hidden sm:block" />
          <Logo variant="horizontal" tone="web" height={34.65} alt={LOGO_ALT} priority className="hidden min-[380px]:block sm:hidden" />
          <Logo variant="mark" tone="web" height={34.65} alt={LOGO_ALT} priority className="min-[380px]:hidden" />
        </Link>
        <Link
          href="/contact"
          className="hover-grow flex items-center bg-[#FF5200] px-[25px] text-[14.7px] font-medium lowercase text-black"
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
