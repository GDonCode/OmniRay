/** Business details used by the footer, contact page, metadata and sitemap. */
export const SITE = {
  name: "OmniRay Software Solutions",
  url: "https://omniray.org",
  email: "rayne@omniray.org",
  phone: "+1 876 792 2584",
  phoneHref: "tel:+18767922584",
  instagram: {
    handle: "@omniraysoftware",
    href: "https://www.instagram.com/omniraysoftware",
  },
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
