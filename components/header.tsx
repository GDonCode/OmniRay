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

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[var(--omniray-blue)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-stretch md:h-16 md:flex-row">
        <nav aria-label="main" className="flex h-12 items-stretch md:h-auto">
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

        <div className="flex h-16 items-center md:flex-1 justify-evenly md:h-auto">
          <Link href="/" className="shrink-0" aria-label="omniray software solutions">
            <Logo variant="horizontal" on="dark" height={30} priority />
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-[var(--omniray-coral)] px-5 py-2 text-sm font-semibold lowercase text-[var(--omniray-blue)] transition hover:brightness-110"
          >
            contact
          </Link>
        </div>
      </div>
    </header>
  );
}
