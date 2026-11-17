@AGENTS.md

## Brand (OmniRay)

- Brand colours live in `app/omniray-colors.css` (CSS variables) and the Tailwind
  theme. Full rules and contrast numbers: `docs/brand/BRAND-COLOR-RULES.md`. Follow them for all UI.
- Always use the `<Logo />` component (`components/logo.tsx`), never hard-coded
  logo files. Tones: `color` on white or paper, `reversed` on deep green,
  `ink` on orange, yellow or mint, `white` on photos.
- Core colour is ink `#0F261F` (deep green): all text, headings and dark sections.
  Orange `#FF5200` is the single accent: one primary call to action per screen.
- Orange buttons use ink text, never white. Orange text on light backgrounds uses
  `#C93B00`, except large text (24px or 19px bold and up).
- Yellow `#D1BD19` and mint `#B5FFC2` are dark-background colours. Never use them
  as text or thin lines on white or paper. On light backgrounds they only appear
  as filled blocks with ink text.
- Never put two bright colours together (orange on yellow, orange on mint,
  yellow on mint). Pair each with ink.
- Dark sections are ink, not black. Page background is paper `#F1FAF3`, cards
  are white.
- Headings use Space Grotesk.
