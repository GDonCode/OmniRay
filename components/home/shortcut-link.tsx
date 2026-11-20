"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/button";

type ShortcutLinkProps = {
  href: string;
  /** Single key that activates the link, shown as a keycap. */
  shortcut: string;
  variant?: "primary" | "secondary";
  /** Use on dark or shader backgrounds: white text and white edges. */
  onDark?: boolean;
  className?: string;
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
  className,
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

  return (
    <Button
      ref={ref}
      href={href}
      variant={variant}
      className={[onDark && "btn-on-dark", className].filter(Boolean).join(" ") || undefined}
      icon={icon}
      aria-keyshortcuts={shortcut.toUpperCase()}
    >
      {children}
    </Button>
  );
}
