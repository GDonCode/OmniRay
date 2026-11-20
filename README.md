# OmniRay brand files for Next.js (App Router)

Drop-in layout. The folders match where Next.js expects things, so you can copy them straight into the repo root.

```
app/
  favicon.ico              browser tab (16 / 32 / 48 px)
  icon.svg                 browser tab (vector, simplified small-size mark)
  apple-icon.png           iOS home screen (180 px)
  opengraph-image.png      link preview (1200x630)
  twitter-image.png        same image for X / Twitter cards
  *.alt.txt                alt text for those two images
  manifest.ts              web app manifest
  omniray-colors.css       brand colour variables
public/
  icon-192.png, icon-512.png, icon-maskable-512.png    used by manifest.ts
  brand/svg/               every logo as SVG (use these first)
  brand/png/               transparent PNGs of the mark and lockups
components/
  logo.tsx                 <Logo /> component
omniray-colors.json        colours for JS / theme config
```

If your project uses a `src/` folder, put `app/` and `components/` under `src/`. `public/` always stays at the repo root.

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
  themeColor: "#0F2747",
};
```

4. Import the colours in `app/globals.css`:

```css
@import "./omniray-colors.css";
```

5. Browsers cache favicons hard. After swapping them in, hard refresh (or open a private window) to see the new one.

## Using the logo

```tsx
import { Logo } from "@/components/logo";

// Header on a dark background
<Logo variant="horizontal" on="dark" height={36} priority />

// Footer on a light background
<Logo variant="stacked" on="light" height={120} />

// Just the face
<Logo variant="mark" height={48} />
```

`on` means the background the logo sits on: `"light"` gives the blue version, `"dark"` gives the reversed (off-white) version. `variant` can be `horizontal`, `stacked`, `mark` or `wordmark`. The stacked version includes "Software Solutions".

The component uses `next/image` with `unoptimized`, since these are SVGs and don't need resizing. If your `@/` import alias isn't set up, use a relative path.

## Colours

| Name | Hex | CSS variable | Role |
|---|---|---|---|
| Deep blue | `#0F2747` | `--omniray-blue` | Ring, wordmark, dark backgrounds |
| Coral | `#FF5A36` | `--omniray-coral` | Exclamation point, buttons, highlights |
| Off-white | `#F6F4F1` | `--omniray-off-white` | Light backgrounds, ring on dark |
| Slate | `#5A6B82` | `--omniray-slate` | Secondary text on light |
| Mist | `#9FB0C6` | `--omniray-mist` | Secondary text on dark |

If you use Tailwind v4, add this to your CSS:

```css
@theme {
  --color-omniray-blue: #0F2747;
  --color-omniray-coral: #FF5A36;
  --color-omniray-off-white: #F6F4F1;
  --color-omniray-slate: #5A6B82;
  --color-omniray-mist: #9FB0C6;
}
```

On Tailwind v3, put the same values under `theme.extend.colors.omniray` in `tailwind.config`.

Contrast: blue on off-white 13.6:1, slate on off-white 5.0:1, mist on blue 6.8:1, coral on blue 4.8:1. Coral on a light background is only 2.8 to 3.1:1, so don't use it for body text or small labels there. Use it for large shapes, or for buttons with blue text.

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
- Blue version on light backgrounds, reversed version on dark. Don't recolour the coral, stretch or rotate the mark, or retype the wordmark. The text in every SVG is already converted to outlines.
- This layout is for the App Router. On the Pages Router, put the icons in `public/` and add the `<link>` tags in `_document.tsx` yourself.

## Hero effects

The home page hero combines a fixed WebGL particle blob (`components/ParticleBackground.tsx`) with a cursor follower mounted in `app/layout.tsx` (`components/Cursor.tsx`). The page sits on solid `#111111` with a fixed dot grid; both layers use `-z-[1]` inside the `isolate`d `<main>`. The native cursor is untouched.

Tunable constants (each file exports its config object):

| Constant | File | Default | Effect |
| --- | --- | --- | --- |
| `latRings` x `pointsPerRing` | `ParticleBackground.tsx` (`PARTICLE_CONFIG`) | 90 x 140 (about 12.6k points) | Point count and lattice density |
| `sizeVw`, `minDiameter` | same | 0.273, 260px | Sphere diameter (420px at 1536px wide) |
| `centerX`, `centerY` | same | 0.72, 0.5 | Sphere position in the viewport |
| `noiseAmplitude` | same | 0.18 | Radius displacement from simplex noise (+/-18%) |
| `noiseSpeed` | same | 0.22 | How fast the shape morphs |
| `rotationSpeed`, `tilt` | same | 0.07 rad/s, 0.28 rad | Spin about Y and axis tilt |
| `pointMin`, `pointMax` | same | 1.5, 5 CSS px | Point size range |
| `orangeShare` | same | 0.55 | Orange vs cream points (more orange at the rim) |
| `parallax` | same | 0.12 rad | Pointer parallax (0 disables) |
| `glowDivisor` | same | 16 | Glow canvas is viewport / 16, blurred by CSS |
| `lerp` | `Cursor.tsx` (`CURSOR_CONFIG`) | 0.2 per frame at 60fps | Follower smoothing (time-based) |

Cursor states are set by `mouseover` delegation on `a, button, [data-cursor]`: plain links and buttons give the hover disc, `data-cursor="drag"` shows chevrons, `data-cursor="view"` (optional `data-cursor-label="Open"`) shows the orange label circle, and `data-cursor="alt"` shows the translucent disc. The ring turns dark over light surfaces. Touch devices (`pointer: coarse`) hide the follower, and `prefers-reduced-motion` renders the blob as a single still frame.
