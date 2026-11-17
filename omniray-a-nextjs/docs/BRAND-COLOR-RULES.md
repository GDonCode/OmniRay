# OmniRay colour rules

Palette: slate, teal and orange on an off-white page. Contrast ratios below are WCAG 2.1, measured from the exact hex values.

## The palette

| Role | Name | Hex | CSS variable | Tailwind v4 |
|---|---|---|---|---|
| Core | Slate | `#1B3644` | `--omniray-slate` | `omniray-slate` |
| Secondary | Teal | `#008AA1` | `--omniray-teal` | `omniray-teal` |
| Accent | Orange | `#FA9442` | `--omniray-orange` | `omniray-orange` |
| Page background | Off-white | `#F1F5F6` | `--omniray-off-white` | `omniray-off-white` |
| Muted text on light | Slate muted | `#4F6B7A` | `--omniray-slate-muted` | `omniray-slate-muted` |
| Muted text on slate | Mist | `#9FB8C4` | `--omniray-mist` | `omniray-mist` |
| Teal text / links / buttons on light | Teal deep | `#00748A` | `--omniray-teal-deep` | `omniray-teal-deep` |
| Teal text on slate | Teal bright | `#4FC3D8` | `--omniray-teal-bright` | `omniray-teal-bright` |
| Orange text on light | Orange deep | `#B04F08` | `--omniray-orange-deep` | `omniray-orange-deep` |

The first four are the brand colours. The rest are darker or lighter versions of the same hues, made so that text stays readable. Use them instead of putting the brand colours on backgrounds where they fail.

## Usage split

Aim for roughly 60% off-white and white, 30% slate, 8% teal and 2% orange. Orange is the signal colour, so using it sparingly is what makes it work.

- **Slate**: headings, body text, dark sections, footers, the logo ring.
- **Teal**: secondary surfaces, icons, illustrations, charts, the "Ray" in the wordmark.
- **Orange**: one primary call to action per screen, small highlights, the exclamation point.
- **Off-white**: page and section backgrounds. Pure white is fine for cards sitting on it.

## Contrast table

| Combination | Ratio | Use for |
|---|---|---|
| Slate on white | 12.7:1 | Everything. Body text, headings. |
| Slate on off-white | 11.5:1 | Everything. Body text, headings. |
| Slate muted on white | 5.7:1 | Secondary text, captions |
| Slate muted on off-white | 5.2:1 | Secondary text, captions |
| Teal deep on white | 5.4:1 | Teal text, links |
| Teal deep on off-white | 5.0:1 | Teal text, links |
| Orange deep on white | 5.3:1 | Orange text, small labels |
| Orange deep on off-white | 4.8:1 | Orange text, small labels |
| Off-white on slate | 11.5:1 | Text on dark sections |
| Orange on slate | 5.7:1 | Orange text, icons and buttons on dark |
| Teal bright on slate | 6.1:1 | Teal text on dark |
| Mist on slate | 6.1:1 | Secondary text on dark |
| Slate on orange | 5.7:1 | Text on orange buttons |
| Teal on white | 4.1:1 | **Large text only** (24 px, or 19 px bold) and graphics |
| Teal on slate | 3.1:1 | **Graphics only**, not text |
| White on teal | 4.1:1 | **Large or bold text only** |
| Orange on white | 2.2:1 | **Never for text.** Large decorative shapes only. |
| Orange on off-white | 2.0:1 | **Never for text.** Large decorative shapes only. |
| White on orange | 2.2:1 | **Never.** Use slate text on orange. |
| Orange on teal | 1.8:1 | **Never.** |

Text needs 4.5:1 (or 3:1 if it's 24 px or 19 px bold and up). Icons and graphic parts need 3:1.

## Rules

1. **Text is slate.** Headings and body copy are slate on off-white or white. Secondary text is slate muted. Never set body text in teal or orange.
2. **Orange buttons carry slate text.** Never white text on orange. Orange buttons work on white, off-white and slate backgrounds. On white or off-white the button's own edge is 2:1, so it relies on the slate label and its size to stand out.
3. **Teal buttons use teal deep with white text** (5.4:1). The plain brand teal with white text only reaches 4.1:1, so use it only for 19 px bold text or larger.
4. **Links** are teal deep on light backgrounds and teal bright on slate.
5. **Orange on a light background is decoration, not information.** For orange text on light, use orange deep. For the logo's exclamation point, plain orange is fine because it's a large graphic.
6. **Never put orange on teal, or teal on slate, when text is involved.** They're too close in brightness.
7. **Dark sections are slate**, not black. Text on them is off-white, with mist for secondary text.
8. **One accent per view.** Only one primary orange call to action on screen at a time. Everything else uses slate or teal deep.
9. **Don't introduce new hues.** For success, warning and error states, use green, amber and red from your UI kit but keep them out of marketing layouts.
10. **Dark mode:** background slate, text off-white, accent orange, links teal bright. The functional tints already cover every pair.

## Logo on colour

| Background | Logo to use | `<Logo>` props |
|---|---|---|
| White or off-white | Full colour | `tone="color"` |
| Slate | Reversed (off-white ring, orange mark, teal bright "Ray") | `tone="reversed"` |
| Orange | One colour, slate | `tone="slate"` |
| Teal | One colour, white | `tone="white"` |
| Photo or busy image | One colour, white (or slate on a light photo) | `tone="white"` / `"slate"` |

Don't place the full-colour logo on teal or orange, because the orange exclamation point disappears. Don't recolour the logo by hand.
