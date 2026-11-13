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
    <header className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8">
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-end">
        <nav aria-label="main" className="flex items-end gap-1.5">
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

        <div className="flex flex-1 items-center justify-evenly md:pb-2">
          <Link href="/" aria-label="omniray software solutions">
            <Logo variant="horizontal" on="dark" height={30} priority />
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-[var(--omniray-coral)] px-5 py-2 text-sm font-semibold lowercase text-[var(--omniray-blue)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            contact
          </Link>
        </div>
      </div>
    </header>
  );
}
