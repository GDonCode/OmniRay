import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell OmniRay about your project. Send a message and we'll reply by email.",
};

export default function ContactPage() {
  return (
    <main className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-36 pb-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        <h1 className="font-heading text-4xl leading-[1.05] font-medium tracking-tight text-white sm:text-6xl">
          Start a project
        </h1>
        <p className="mt-6 max-w-md font-mono text-[15px] leading-7 tracking-tight text-white/85 sm:text-base sm:leading-8">
          Tell us what you&apos;re trying to build or fix. We&apos;ll read it ourselves and reply by email.
        </p>

        <dl className="mt-10 space-y-6 font-mono text-[15px]">
          <div>
            <dt className="text-[13px] text-white/60">Email</dt>
            <dd className="mt-1">
              <a href={`mailto:${SITE.email}`} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {SITE.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-white/60">Phone</dt>
            <dd className="mt-1">
              <a href={SITE.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {SITE.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-white/60">Instagram</dt>
            <dd className="mt-1">
              <a href={SITE.instagram.href} target="_blank" rel="noopener noreferrer" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {SITE.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <ContactForm />
    </main>
  );
}
