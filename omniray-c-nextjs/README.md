# OmniRay brand files for Next.js (App Router)

Palette: deep green (ink), orange, yellow and mint. Drop-in layout: the folders match where Next.js expects things, so you can copy them straight into the repo root.

```
app/
  favicon.ico              browser tab (16 / 32 / 48 px)
  icon.svg                 browser tab (vector, simplified small-size mark)
  apple-icon.png           iOS home screen (180 px)
  opengraph-image.png      link preview (1200x630)
  twitter-image.png        same image for X / Twitter cards
  *.alt.txt                alt text for those two images
  manifest.ts              web app manifest
  omniray-colors.css       brand colour variables (plain CSS)
  omniray-theme.css        Tailwind v4 theme tokens (optional)
public/
  icon-192.png, icon-512.png, icon-maskable-512.png    used by manifest.ts
  brand/svg/               every logo as SVG (use these first)
  brand/png/               transparent PNGs of the mark and lockups
components/
  logo.tsx                 <Logo /> component
docs/
  BRAND-COLOR-RULES.md     palette, contrast table and usage rules
CLAUDE-CODE-INSTRUCTIONS.md   how to have Claude Code do the integration
omniray-colors.json        colours for JS / theme config
```

If your project uses a `src/` folder, put `app/` and `components/` under `src/`. `public/` always stays at the repo root. `docs/` can go anywhere.

## Setup

1. Copy `app/`, `public/` and `components/` into the repo. If you already have `app/favicon.ico` or `app/manifest.*`, replace them.
2. Next reads the files in `app/` and writes the `<link>` and `<meta>` tags for the icons, Apple icon, Open Graph image and Twitter image by itself. You don't need to add head tags by hand.
3. In `app/layout.tsx`, set the site URL (needed so the preview image URL is absolute) and the browser theme colour:

```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://YOUR-DOMAIN"), // replace with your real domain
  title: { default: "OmniRay", template: "%s | OmniRay" },
};

export const viewport: Viewport = {
  themeColor: "#0F261F",
};
```

4. Import the colours in `app/globals.css`:

```css
@import "./omniray-colors.css";
```

   On Tailwind v4 also add `@import "./omniray-theme.css";` after `@import "tailwindcss";`, so you can write `bg-omniray-ink`, `text-omniray-orange-deep` and so on.

   On Tailwind v3, put the colours in `tailwind.config`:

```js
theme: {
  extend: {
    colors: {
      omniray: {
        ink: "#0F261F",
        orange: "#FF5200",
        yellow: "#D1BD19",
        mint: "#B5FFC2",
        black: "#000000",
        white: "#FFFFFF",
        paper: "#F1FAF3",
        "ink-muted": "#4F6359",
        "orange-deep": "#C93B00",
        "yellow-deep": "#7A6D00",
      },
    },
  },
},
```

5. Browsers cache favicons hard. After swapping them in, hard refresh (or open a private window) to see the new one.

## Using the logo

```tsx
import { Logo } from "@/components/logo";

// Header on a white or paper page
<Logo variant="horizontal" height={36} priority />

// Header or footer on an ink (deep green) background
<Logo variant="horizontal" tone="reversed" height={36} />

// On an orange, yellow or mint block
<Logo variant="horizontal" tone="ink" height={36} />

// Just the face
<Logo variant="mark" height={48} />
```

`variant` can be `horizontal`, `stacked`, `mark` or `wordmark`. The stacked version includes "Software Solutions". `tone` picks the colour version:

| `tone` | Use on |
|---|---|
| `"color"` (default) | white or paper |
| `"reversed"` | ink (deep green) and other dark backgrounds |
| `"ink"` | orange, yellow and mint backgrounds |
| `"white"` | photos and busy images |

The one-colour `ink` and `white` versions exist for `horizontal` and `mark`. For `stacked` and `wordmark` those two tones fall back to the colour or reversed file, so check that on an orange, yellow or mint background.

The component uses `next/image` with `unoptimized`, since these are SVGs and don't need resizing. If your `@/` import alias isn't set up, use a relative path.

## Colours

The full table, the contrast numbers and the usage rules are in `docs/BRAND-COLOR-RULES.md`. The short version:

| Name | Hex | Role |
|---|---|---|
| Ink (deep green) | `#0F261F` | Text, headings, logo ring, dark sections |
| Orange | `#FF5200` | The one accent: the exclamation point, "Ray", one call to action per screen |
| Yellow | `#D1BD19` | Highlights and "Ray" on dark. Never on white. |
| Mint | `#B5FFC2` | Logo ring and accents on dark, mint blocks. Never on white. |
| Black / White | `#000000` / `#FFFFFF` | Print and one-colour uses / cards and surfaces |
| Paper | `#F1FAF3` | Page background |

Three warnings that catch people out:

- **Yellow and mint on white disappear** (1.9:1 and 1.2:1). They're dark-background colours, or filled blocks with ink text.
- **Orange on a light background is only 3.3:1.** That passes for large text and graphics but not small text. For orange text and links on light, use `#C93B00`. Orange buttons take ink text, not white.
- **Don't pair two bright colours.** Orange on yellow, orange on mint and yellow on mint all fail. Pair each bright colour with ink.

## Heading font

The wordmark is Space Grotesk (Bold for "Omni", Regular for "Ray"). It's free on Google Fonts, so you can use the same face for headings:

```tsx
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
// <html className={spaceGrotesk.variable}> ... then font-family: var(--font-space-grotesk)
```

## Usage notes

- The full mark reads cleanly from about 48 px wide. For anything smaller, use the favicon mark (`app/icon.svg`): heavier ring, no arrowheads, plain `<` `>` eyes.
- Keep clear space of at least 20% of the mark's width on every side.
- Don't put the full-colour logo on orange, yellow or mint. Use the one-colour ink version there. Don't recolour the mark, stretch or rotate it, or retype the wordmark. The text in every SVG is already converted to outlines.
- This layout is for the App Router. On the Pages Router, put the icons in `public/` and add the `<link>` tags in `_document.tsx` yourself.
