"use server";

import { headers } from "next/headers";
import { PROJECT_TYPES, type ContactState, type ContactValues } from "@/lib/contact";
import { SITE } from "@/lib/site";

/* ---------- spam protection ---------- */
// 1. Honeypot field that humans never see. 2. A form must have been open for a couple of
// seconds. 3. Best-effort rate limit per IP (in memory, so per server instance).
// 4. Cloudflare Turnstile, verified here when TURNSTILE_SECRET_KEY is set.
const MIN_FILL_MS = 2500;
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 6;
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function limited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep the map bounded
  return false;
}

async function turnstileOk(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured: rely on the other checks
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/* ---------- helpers ---------- */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const field = (fd: FormData, key: string) => (typeof fd.get(key) === "string" ? (fd.get(key) as string) : "");

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const now = Date.now();
  const values: ContactValues = {
    name: field(formData, "name").trim(),
    email: field(formData, "email").trim(),
    type: field(formData, "type"),
    message: field(formData, "message").trim(),
  };

  // Bots get a fake success so they don't learn what tripped them.
  const fakeOk: ContactState = { status: "success" };
  if (field(formData, "company_site")) return fakeOk;
  const opened = Number(field(formData, "opened_at"));
  if (!opened || now - opened < MIN_FILL_MS || now - opened > MAX_FORM_AGE_MS) {
    return { status: "error", message: "Please wait a moment and send it again.", values };
  }

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2 || values.name.length > 100) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) {
    errors.email = "Please enter a valid email address.";
  }
  if (!(PROJECT_TYPES as readonly string[]).includes(values.type)) errors.type = "Please choose a project type.";
  if (values.message.length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  if (values.message.length > 5000) errors.message = "Please keep the message under 5,000 characters.";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  // Only valid submissions count towards the limit, so typos don't use it up.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip, now)) {
    return { status: "error", message: `Too many messages. Please try again later or email ${SITE.email}.`, values };
  }

  if (!(await turnstileOk(field(formData, "cf-turnstile-response"), ip))) {
    return { status: "error", message: "We couldn't verify you're human. Please try again.", values };
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return { status: "error", message: `Sending isn't set up yet. Please email ${SITE.email} directly.`, values };
  }

  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  const from = process.env.CONTACT_FROM_EMAIL || `OmniRay <onboarding@resend.dev>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: oneLine(`New enquiry: ${values.type} from ${values.name}`).slice(0, 200),
        text: `Name: ${values.name}\nEmail: ${values.email}\nProject type: ${values.type}\n\n${values.message}`,
        html: `<p><strong>Name:</strong> ${esc(values.name)}<br><strong>Email:</strong> ${esc(values.email)}<br><strong>Project type:</strong> ${esc(values.type)}</p><p style="white-space:pre-wrap">${esc(values.message)}</p>`,
      }),
    });
    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text());
      return { status: "error", message: `Something went wrong sending that. Please email ${SITE.email}.`, values };
    }
  } catch (err) {
    console.error("Contact form: Resend request failed", err);
    return { status: "error", message: `Something went wrong sending that. Please email ${SITE.email}.`, values };
  }
  return { status: "success" };
}
