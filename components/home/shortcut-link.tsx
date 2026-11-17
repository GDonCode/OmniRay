"use client";

import { useEffect, useRef } from "react";

type ShortcutLinkProps = {
  href: string;
  /** Single key that activates the link, shown as a keycap. */
  shortcut: string;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * A CTA button with a keycap hint. Pressing the key anywhere on the page
 * (outside text fields, without modifiers) clicks the link.
 */
export function ShortcutLink({
  href,
  shortcut,
  variant = "primary",
  icon,
  children,
}: ShortcutLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const key = shortcut.toLowerCase();
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      if (event.key.toLowerCase() === key) {
        event.preventDefault();
        ref.current?.click();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut]);

  const styles =
    variant === "primary"
      ? "border-omniray-blue bg-omniray-blue text-omniray-off-white shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset,0_1px_2px_rgb(15_39_71/0.3)] hover:bg-[#183a66]"
      : "border-omniray-blue/15 bg-white text-omniray-blue shadow-[0_1px_2px_rgb(15_39_71/0.06)] hover:border-omniray-blue/30 hover:bg-omniray-off-white";

  const keycap =
    variant === "primary"
      ? "border-white/25 bg-white/10 text-omniray-off-white/90"
      : "border-omniray-blue/15 bg-omniray-off-white text-omniray-slate";

  return (
    <a
      ref={ref}
      href={href}
      aria-keyshortcuts={shortcut.toUpperCase()}
      className={`group inline-flex h-11 items-center gap-2.5 rounded-md border pr-2 pl-4 pointer-coarse:pr-4 font-mono text-[15px] tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-omniray-coral ${styles}`}
    >
      {icon}
      <span>{children}</span>
      <kbd
        aria-hidden
        className={`ml-1 inline-flex pointer-coarse:hidden h-6 min-w-6 items-center justify-center rounded border px-1.5 font-mono text-[11px] ${keycap}`}
      >
        {shortcut.toUpperCase()}
      </kbd>
    </a>
  );
}
