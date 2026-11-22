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

The page sits on solid `#111111`. `components/GlowBackground.tsx` (optional `sceneTexture` prop: a canvas, video or ImageBitmap that is warped with everything else) (a fixed, click-through, `-z-[1]` layer inside the `isolate`d `<main>`) draws a night sky and a nebula that the pointer stirs up. Distant stars in two layers (a dim dense one, and a sparse brighter one with halos and faint diffraction spikes on the brightest) sit on jittered, rotated cells, so there is no visible grid. Faint lines join the stars of some cell blocks into constellations. Moving the pointer injects smoke into a small GPU fluid simulation (splat, advect, divergence, Jacobi pressure solve, gradient subtract, vorticity); the smoke density is a mask over a domain-warped noise field, so it reads as gas filaments with dark dust lanes, a rust-to-orange-to-gold ramp and warm highlights on the densest ridges, rather than flat smoke. The pointer also bends everything (a flow warp from the velocity field plus a magnifying lens), and stars and lines brighten inside the glow. Only pointer movement adds smoke, so there is no glow from hover alone. The stars also float and twinkle: a sway field (a broad component plus a finer one, so neighbouring stars move differently) displaces the star lookup, and so the lines, by several px on top of the pointer warp, and each star dips in brightness on its own phase. After about 7 seconds without movement the fluid simulation stops and its textures are cleared; the sky keeps drifting at a low frame rate (`IDLE_FPS`), which is cheap because the display pass is only texture lookups. `components/Cursor.tsx` (mounted in `app/layout.tsx`) adds a clear glass ball follower on top of the native cursor (24px, 72px over links and buttons): a lit rim and specular highlight with almost no blur, so the content underneath stays readable. In Chromium browsers (Chrome, Edge, Opera, Brave) it also magnifies what is under it by `CURSOR_CONFIG.magnify` (1.3) using an SVG displacement filter inside `backdrop-filter`; Safari and Firefox don't support that, so they get the clear glass without the zoom.

Performance: the stars, constellation lines and nebula noise are static in screen space, so they are baked once into textures at load and on resize. The per-frame display pass only samples them at the warped position, which makes it cheaper than a procedural version.

Tunable constants are exported at the top of `GlowBackground.tsx` (and `CURSOR_CONFIG` in `Cursor.tsx`):

| Constant | Default | Effect |
| --- | --- | --- |
| `SIM_RES`, `DYE_RES` | 128, 512 | Velocity and density grid size (px, short side) |
| `SPLAT_RADIUS` | 0.25 | Splat size, % of viewport area (about 80-120px) |
| `SPLAT_FORCE` | 6000 | Velocity injected per unit of pointer travel |
| `DENSITY_GAIN`, `DENSITY_MAX` | 12, 0.22 | Dye added per unit of pointer speed, and its per-frame clamp |
| `DENSITY_DISSIPATION` | 0.99 | Density kept per frame at 60fps (time-based); trail fades in about 2-3s |
| `VELOCITY_DISSIPATION` | 0.98 | Velocity kept per frame at 60fps |
| `PRESSURE`, `PRESSURE_ITERATIONS` | 0.8, 20 | Pressure carry-over and Jacobi iterations |
| `CURL` | 10 | Vorticity confinement (swirl) |
| `WARP_ENABLED` | true | Master switch for the warp |
| `WARP_FLOW_SCALE`, `WARP_MAX_PX` | 0.15, 18 | Flow warp: css px of displacement per velocity unit, and its clamp |
| `LENS_RADIUS`, `LENS_STRENGTH` | 140px, 0.35 | Magnifying bulge under the pointer |
| `LENS_SPEED_REF` | 40 | Pointer css px per frame that gives a full lens |
| `LENS_RISE`, `LENS_FALL` | 0.3, 0.04 | Lens intensity smoothing per frame at 60fps (time-based) |
| `POINTER_LERP` | 0.2 | Smoothing of the lens position |
| `GLOW_MAX_ALPHA` | 0.75 | Maximum smoke opacity |
| `COLORS` | dust `#1f0a02`, deep `#7a2a00`, orange `#ff5f00`, amber `#ffb066`, hot `#ffd9a0` | Nebula ramp: dust lanes, rust, orange, amber, warm highlight |
| `NEBULA_SCALE`, `NEBULA_DUST`, `NEBULA_HOT` | 260px, 0.55, 0.55 | Cloud size, dark dust-lane strength, highlight strength |
| `STAR_COLOR` | `232,220,200` | Base star colour (cream); a few stars are tinted amber or cool white |
| `FAR_STAR_SPACING`, `FAR_STAR_CHANCE`, `FAR_STAR_OPACITY` | 30px, 0.55, 0.6 | Dim dense star layer: cell size, share of cells with a star, brightest opacity |
| `STAR_SPACING`, `STAR_CHANCE`, `STAR_OPACITY`, `STAR_SIZE` | 88px, 0.55, 0.95, 1px | Sparse bright star layer |
| `STAR_DRIFT_PX`, `STAR_DRIFT_SPEED`, `STAR_TWINKLE`, `IDLE_FPS` | 7px, 1.8, 0.35, 30 | Star float amplitude (0 = off), its speed, twinkle depth (0 = steady), and the frame rate once the smoke has faded |
| `STAR_LIT_BOOST` | 1.7 | Star brightness multiplier inside the glow |
| `CONSTELLATION_BLOCK`, `CONSTELLATION_CHANCE`, `CONSTELLATION_EDGES` | 4, 0.4, 0.6 | Block size in cells, share of blocks with a constellation, share of links drawn |
| `LINE_WIDTH`, `LINE_BASE_OPACITY`, `LINE_LIT_OPACITY` | 1px, 0.12, 0.32 | Constellation lines, at rest and inside the glow |
| `lerp` (`Cursor.tsx`) | 0.2 | Ring follower smoothing per frame at 60fps |

Without WebGL2 the glow falls back to a 2D canvas that stamps blurred radial gradients and fades them out. Reduced motion renders no glow, only a static CSS star field. Touch input is accepted as the pointer. Cursor states come from `a, button, [data-cursor]`: links and buttons show the dark hover disc, `data-cursor="drag"` shows chevrons, `data-cursor="view"` (optional `data-cursor-label`) shows an orange label circle, and `data-cursor="alt"` a translucent disc. The follower is hidden on `pointer: coarse` devices.

## Contact form and deployment (Vercel)

The contact form (`app/contact`) is a Server Action that emails enquiries through Resend. Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Required. Without it the form shows a "sending isn't set up" message. |
| `CONTACT_TO_EMAIL` | Where enquiries go (defaults to `rayne@omniray.org`). |
| `CONTACT_FROM_EMAIL` | Sender, on a domain verified in Resend, e.g. `OmniRay <hello@omniray.org>`. Left empty it uses Resend's test sender, which only delivers to your own Resend account email. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile captcha. Set both to turn it on. |

Spam protection, always on: a hidden honeypot field, a timing check (the form must be open for 2.5 seconds), validation, and a rate limit of 3 messages per IP per 10 minutes. The rate limit is in memory, so on Vercel it applies per server instance; Turnstile is the stronger layer.

To deploy: import the repo in Vercel, add the variables above under Project Settings > Environment Variables, and point `omniray.org` at the project. In Resend, add and verify the `omniray.org` domain (DNS records) before setting `CONTACT_FROM_EMAIL`.

Business details live in `lib/site.ts` and project content in `lib/projects.ts`.
