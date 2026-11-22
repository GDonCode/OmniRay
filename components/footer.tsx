import Link from "next/link";
import { Logo } from "@/components/logo";
import { FooterYear } from "@/components/footer-year";
import { NAV, SITE } from "@/lib/site";

const link = "text-white/85 underline-offset-4 hover:text-white hover:underline";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#111111]/70 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label={SITE.name} className="inline-block">
            <Logo variant="stacked" tone="web" height={96} alt={SITE.name} />
          </Link>
        </div>

        <nav aria-label="footer" className="font-mono text-[15px]">
          <h2 className="text-[13px] text-white/60">Explore</h2>
          <ul className="mt-3 space-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={link}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="font-mono text-[15px]">
          <h2 className="text-[13px] text-white/60">Contact</h2>
          <ul className="mt-3 space-y-2">
            <li><a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a></li>
            <li><a href={SITE.phoneHref} className={link}>{SITE.phone}</a></li>
            <li>
              <a href={SITE.instagram.href} target="_blank" rel="noopener noreferrer" className={link}>
                Instagram {SITE.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-5 font-mono text-[13px] text-white/60">
          &copy; <FooterYear /> {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
