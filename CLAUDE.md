@AGENTS.md

## Brand (OmniRay)

The website is dark only, in light and dark mode. It does not follow the light-theme palette
rules in `docs/brand/BRAND-COLOR-RULES.md` (those still apply to print and any light surface).

- Page background is solid `#111111` (`color-scheme: dark`). Text is white; secondary text is
  `text-white/85`; hints and labels may use `text-white/60`. Never use dim greys for body copy.
- Accent is orange `#ff5f00`: headings accents, the primary call to action (orange background,
  black text), form focus and errors. One primary call to action per screen.
- Cream `rgb(232,220,200)` is the base star colour. The background is a night sky: stars,
  faint constellation lines and a cursor-driven orange nebula, all drawn by
  `components/GlowBackground.tsx` (no dot grid); its tunables are exported at the top of that
  file. Stars, lines and nebula noise are baked to textures once per resize; keep per-frame
  work in the display shader to texture lookups.
- Header (`components/header.tsx`): tabs sit flush to the top of the page at full header height.
  Live tab (`aria-current`) = filled brand orange with white text; hover = an orange bar grows
  across the top edge. Call / email / build use the same `.tab` styles. Reuse these states for new
  navigation-like controls.
- Buttons: use `<Button>` (`components/button.tsx`). With an icon and a multi-word string label,
  hover folds the label to its first word ("Start a project" -> [icon] Start). Don't hand-roll buttons.
- Text fields are glass (frosted blur, lit top edge, orange focus). It is global CSS on
  `input`/`textarea`/`select`, plus `.glass` for panels, so don't restyle fields per component.
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
