"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** The current year, read on the client so the prerendered shell never calls new Date(). */
export function FooterYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => 2026);
  return <>{year}</>;
}
