"use client";

import Script from "next/script";
import { useActionState, useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/button";
import { PROJECT_TYPES, type ContactState } from "@/lib/contact";
import { sendContact } from "./actions";

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

const subscribe = () => () => {};
let openedAtMs = 0;
const getOpenedAt = () => String((openedAtMs ||= Date.now()));

const initial: ContactState = { status: "idle" };
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const input =
  "block w-full border border-white/20 bg-white/5 px-3.5 py-3 font-mono text-[15px] text-white placeholder:text-white/40 focus:border-[#ff5f00] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5f00] aria-[invalid=true]:border-[#ff5f00]";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  // Read on the client only: a server-side Date would be baked into the prerendered page.
  const openedAt = useSyncExternalStore(subscribe, getOpenedAt, () => "");
  // Turnstile tokens are single-use, so ask for a fresh one after every submit.
  useEffect(() => {
    if (state.status !== "idle") window.turnstile?.reset();
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="border border-white/20 bg-white/5 p-8">
        <h2 className="font-heading text-2xl text-white">Message sent</h2>
        <p className="mt-3 font-mono text-[15px] leading-7 text-white/85">
          Thanks, we&apos;ll reply from rayne@omniray.org soon.
        </p>
      </div>
    );
  }

  const v = state.values;
  const err = state.errors ?? {};
  const label = "mb-2 block font-mono text-[13px] tracking-tight text-white";
  const fieldError = "mt-1.5 font-mono text-[13px] text-[#ff5f00]";

  return (
    <form action={action} noValidate className="space-y-5">
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}

      {state.message && (
        <p role="alert" className="border border-[#ff5f00] bg-[#ff5f00]/10 px-4 py-3 font-mono text-[14px] text-white">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name" className={label}>Name</label>
        <input id="name" name="name" autoComplete="name" required maxLength={100} defaultValue={v?.name}
          aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} className={input} />
        {err.name && <p id="name-error" className={fieldError}>{err.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={v?.email}
          aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} className={input} />
        {err.email && <p id="email-error" className={fieldError}>{err.email}</p>}
      </div>

      <div>
        <label htmlFor="type" className={label}>Project type</label>
        <select id="type" name="type" required defaultValue={v?.type ?? ""}
          aria-invalid={!!err.type} aria-describedby={err.type ? "type-error" : undefined} className={input}>
          <option value="" disabled>Choose one</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t} className="bg-[#111111]">{t}</option>
          ))}
        </select>
        {err.type && <p id="type-error" className={fieldError}>{err.type}</p>}
      </div>

      <div>
        <label htmlFor="message" className={label}>Message</label>
        <textarea id="message" name="message" rows={6} required maxLength={5000} defaultValue={v?.message}
          placeholder="What are you looking to build?"
          aria-invalid={!!err.message} aria-describedby={err.message ? "message-error" : undefined} className={input} />
        {err.message && <p id="message-error" className={fieldError}>{err.message}</p>}
      </div>

      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_site">Leave this empty</label>
        <input id="company_site" name="company_site" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="opened_at" value={openedAt} />

      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />}

      <Button type="submit" disabled={pending} className="btn-square btn-hero-primary" icon={<SendIcon />}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-full fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
