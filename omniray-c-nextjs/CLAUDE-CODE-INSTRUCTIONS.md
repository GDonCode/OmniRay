# Have Claude Code integrate the OmniRay brand package

## 1. Put the package in the repo

Unzip it and place the `omniray-c-nextjs` folder at the repo root, next to `package.json`. It's temporary: Claude Code will copy what's needed and delete the folder at the end.

## 2. Start Claude Code in the repo

```
cd path/to/your-repo
claude
```

## 3. Paste this prompt

```
I added a folder called omniray-c-nextjs/ at the repo root. It's my brand package
(logo, icons, colours) for OmniRay. Integrate it into this Next.js app by
following omniray-c-nextjs/README.md. Use omniray-c-nextjs/docs/BRAND-COLOR-RULES.md
as the colour rules for all UI you write from now on.

Steps:
1. Detect my setup first: App Router or Pages Router, whether I use a src/ folder,
   which Tailwind version (if any), and whether the "@/" import alias works.
   Tell me what you found before changing anything.
2. Copy app/, public/ and components/ from the package into the right places,
   respecting src/. Don't overwrite any existing file that isn't a favicon or
   manifest. List any conflicts and ask me before replacing them.
3. Import omniray-colors.css in globals.css. If Tailwind v4, also import
   omniray-theme.css after tailwindcss. If Tailwind v3, add the colours to
   tailwind.config as shown in the README.
4. In layout.tsx, add metadataBase (ask me for the domain if you don't know it)
   and viewport themeColor "#0F261F". Use the Space Grotesk heading font as
   shown in the README.
5. Replace the current logo in the header and footer with <Logo />: horizontal
   with tone="color" on light backgrounds, tone="reversed" on deep green
   sections.
6. Look through existing pages and components for colours that break the
   rules in BRAND-COLOR-RULES.md (for example yellow or mint text on white, orange
   text under 24px on light backgrounds, white text on orange buttons). List them,
   fix the clear ones, and ask me about the judgement calls.
7. Run the type check and a production build, and fix anything that fails.
8. Move omniray-c-nextjs/docs/BRAND-COLOR-RULES.md to docs/brand/BRAND-COLOR-RULES.md
   in the repo. Then delete the omniray-c-nextjs/ folder.
9. Add the section below to CLAUDE.md (create the file if it's missing).
```

## 4. The CLAUDE.md section Claude Code adds

This is what step 9 adds. It means every future Claude Code session follows the palette without you repeating it.

```md
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
```

## 5. Check the result

- Run `npm run dev` and hard refresh. Browsers cache favicons, so try a private window if the tab icon looks old.
- Share a page link in a chat app, or paste it into a link-preview checker, to confirm the preview image appears. It only works with a real public domain, not localhost.
- Read the diff before you commit, especially `layout.tsx` and the header.
