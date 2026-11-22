@AGENTS.md

## Brand (OmniRay)

The website is dark only, in light and dark mode. It does not follow the light-theme palette
rules in `docs/brand/BRAND-COLOR-RULES.md` (those still apply to print and any light surface).

- Page background is solid `#111111` (`color-scheme: dark`). Text is white; secondary text is
  `text-white/85`; hints and labels may use `text-white/60`. Never use dim greys for body copy.
- Accent is orange `#ff5f00`: headings accents, the primary call to action (orange background,
  black text), form focus and errors. One primary call to action per screen.
- Cream `rgb(232,220,200)` is only for the dot grid. Dots, lines and glow are drawn by
  `components/GlowBackground.tsx`; its tunables are exported at the top of that file.
- Buttons are square-cornered (`btn-square`). Showreel cards have no borders or rounding.
- Always use the `<Logo />` component (`components/logo.tsx`), never hard-coded logo files. On
  the dark site use `tone="web"`: `nav` in the header, `stacked` in the footer.
- Website logo (dark backgrounds only): white mark, ring and code tags; 'Omni' white;
  'Ray' #FF5200; exclamation point #FF5200; 'software solutions' white. Files in
  `public/brand/svg/omniray-logo-web-*.svg`. Never place these on light backgrounds; use the
  full-colour logo there.
- Headings use Space Grotesk.
- Business details (email, phone, Instagram, legal name) live in `lib/site.ts`; real project
  content in `lib/projects.ts`. Don't hard-code them in components.
