"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SITE } from "@/lib/site";

const LOGO_ALT = "OmniRay Software Solutions";

const TABS = [
  { href: "/", label: "home" },
  { href: "/services", label: "services" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

/* Stroke icons share the .tab-icon style (currentColor). */
const ICONS = {
  call: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  build: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
} as const;

function TabIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden>
      {ICONS[name]}
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
      className={`fixed inset-x-0 top-0 z-50 flex flex-col border-b transition-colors duration-300 md:flex-row ${
        scrolled
          ? "border-white/10 bg-black/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* section 1: nav links */}
      <nav aria-label="main" className="flex h-[46px] items-stretch md:h-auto md:px-2 lg:px-4">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="tab"
            aria-current={pathname === t.href ? "page" : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {/* section 2: logo + call / email / build, styled like the tabs */}
      <div className="flex items-stretch justify-between md:min-h-[60px] md:flex-1 lg:justify-end">
        <Link
          href="/"
          aria-label="omniray software solutions"
          className="flex shrink-0 items-center py-[12.6px] pl-4 md:pl-0 lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:pl-0"
        >
          {/* Dark-background lockups: full nav lockup from sm up, wordmark lockup on narrow
              phones, mark only below 380px. The others stay in the DOM but are display:none. */}
          <Logo variant="nav" tone="web" height={34.65} alt={LOGO_ALT} priority className="hidden lg:block" />
          <Logo variant="horizontal" tone="web" height={34.65} alt={LOGO_ALT} priority className="hidden min-[380px]:block lg:hidden" />
          <Logo variant="mark" tone="web" height={34.65} alt={LOGO_ALT} priority className="min-[380px]:hidden" />
        </Link>
        <div className="flex items-stretch">
          <a href={SITE.phoneHref} className="tab" aria-label={`Call ${SITE.phone}`}>
            <TabIcon name="call" />
            call
          </a>
          <a href={`mailto:${SITE.email}`} className="tab" aria-label={`Email ${SITE.email}`}>
            <TabIcon name="email" />
            email
          </a>
          <Link href="/contact" className="tab" aria-current={pathname === "/contact" ? "page" : undefined}>
            <TabIcon name="build" />
            build
          </Link>
        </div>
      </div>
    </header>
  );
}
