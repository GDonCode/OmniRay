"use client";

import { useEffect, useRef } from "react";

type ShortcutLinkProps = {
  href: string;
  /** Single key that activates the link, shown as a keycap. */
  shortcut: string;
  variant?: "primary" | "secondary";
  /** Use on dark or shader backgrounds: white text and white borders. */
  onDark?: boolean;
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
  onDark = false,
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

  const styles = onDark
    ? variant === "primary"
      ? "border-white bg-black/45 text-white backdrop-blur-sm hover:bg-black/65"
      : "border-white/60 bg-transparent text-white hover:border-white hover:bg-white/10"
    : variant === "primary"
      ? "border-omniray-ink bg-omniray-ink text-omniray-paper shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset,0_1px_2px_rgb(15_38_31/0.3)] hover:bg-[#1d3d33]"
      : "border-omniray-ink/15 bg-white text-omniray-ink shadow-[0_1px_2px_rgb(15_38_31/0.06)] hover:border-omniray-ink/30 hover:bg-omniray-paper";

  return (
    <a
      ref={ref}
      href={href}
      aria-keyshortcuts={shortcut.toUpperCase()}
      className={`group inline-flex h-11 items-center gap-2.5 rounded-md border px-4 font-mono text-[15px] tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${onDark ? "focus-visible:outline-white" : "focus-visible:outline-omniray-orange"} ${styles}`}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
