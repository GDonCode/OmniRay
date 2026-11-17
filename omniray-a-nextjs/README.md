# OmniRay brand files for Next.js (App Router)

Palette: slate, teal and orange. Drop-in layout: the folders match where Next.js expects things, so you can copy them straight into the repo root.

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
  themeColor: "#1B3644",
};
```

4. Import the colours in `app/globals.css`:

```css
@import "./omniray-colors.css";
```

   On Tailwind v4 also add `@import "./omniray-theme.css";` after `@import "tailwindcss";`, so you can write `bg-omniray-slate`, `text-omniray-teal-deep` and so on.

   On Tailwind v3, put the colours in `tailwind.config`:

```js
theme: {
  extend: {
    colors: {
      omniray: {
        slate: "#1B3644",
        teal: "#008AA1",
        orange: "#FA9442",
        "off-white": "#F1F5F6",
        "slate-muted": "#4F6B7A",
        mist: "#9FB8C4",
        "teal-deep": "#00748A",
        "teal-bright": "#4FC3D8",
        "orange-deep": "#B04F08",
      },
    },
  },
},
```

5. Browsers cache favicons hard. After swapping them in, hard refresh (or open a private window) to see the new one.

## Using the logo

```tsx
import { Logo } from "@/components/logo";

// Header on a light page
<Logo variant="horizontal" height={36} priority />

// Header or footer on a slate background
<Logo variant="horizontal" tone="reversed" height={36} />

// On an orange block
<Logo variant="horizontal" tone="slate" height={36} />

// Just the face
<Logo variant="mark" height={48} />
```

`variant` can be `horizontal`, `stacked`, `mark` or `wordmark`. The stacked version includes "Software Solutions". `tone` picks the colour version:

| `tone` | Use on |
|---|---|
| `"color"` (default) | white or off-white |
| `"reversed"` | slate or other dark backgrounds |
| `"slate"` | orange backgrounds |
| `"white"` | teal backgrounds and photos |

The one-colour `slate` and `white` versions exist for `horizontal` and `mark`. For `stacked` and `wordmark` those two tones fall back to the colour or reversed file, so check that on an orange background.

The component uses `next/image` with `unoptimized`, since these are SVGs and don't need resizing. If your `@/` import alias isn't set up, use a relative path.

## Colours

The full table, the contrast numbers and the usage rules are in `docs/BRAND-COLOR-RULES.md`. The short version:

| Name | Hex | Role |
|---|---|---|
| Slate | `#1B3644` | Text, headings, logo ring, dark sections |
| Teal | `#008AA1` | Secondary colour, icons, charts, "Ray" |
| Orange | `#FA9442` | The one accent: highlights and one call to action per screen |
| Off-white | `#F1F5F6` | Page background |

Two warnings that catch people out:

- **Orange on a light background is only 2.2:1.** Never use it for text there. For orange text on light, use `#B04F08`. Orange buttons take slate text, not white.
- **Teal on white is 4.1:1.** That passes only for large text. For teal text, links and filled teal buttons on light backgrounds, use `#00748A`.

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
- Don't put the full-colour logo on teal or orange, because the orange exclamation point disappears. Use the one-colour versions there. Don't recolour the mark, stretch or rotate it, or retype the wordmark. The text in every SVG is already converted to outlines.
- This layout is for the App Router. On the Pages Router, put the icons in `public/` and add the `<link>` tags in `_document.tsx` yourself.
