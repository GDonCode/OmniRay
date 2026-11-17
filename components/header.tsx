import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0F2747]/10 bg-[#F6F4F1]/90 backdrop-blur dark:border-[#F6F4F1]/10 dark:bg-[#0F2747]/90">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" aria-label="OmniRay home" className="flex items-center">
          {/* Light mode: navy logo on cream. Dark mode: reversed logo on navy. */}
          <span className="block dark:hidden">
            <Logo on="light" height={28} priority className="h-7 w-auto sm:h-9" />
          </span>
          <span className="hidden dark:block">
            <Logo on="dark" height={28} priority className="h-7 w-auto sm:h-9" />
          </span>
        </Link>
      </div>
    </header>
  );
}
