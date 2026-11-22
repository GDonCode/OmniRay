# OmniRay colour rules

> **Website exception.** The website is dark only (`#111111` background, white text, `#ff5f00`
> accent), in both light and dark mode. The rules below apply to print and to any light
> surface. See the Brand section of `CLAUDE.md` for the website rules.

Palette: deep green (ink), orange, yellow and mint, plus black and white. Contrast ratios below are WCAG 2.1, measured from the exact hex values.

## The palette

| Role | Name | Hex | CSS variable | Tailwind v4 |
|---|---|---|---|---|
| Core | Ink (deep green) | `#0F261F` | `--omniray-ink` | `omniray-ink` |
| Accent | Orange | `#FF5200` | `--omniray-orange` | `omniray-orange` |
| Secondary | Yellow | `#D1BD19` | `--omniray-yellow` | `omniray-yellow` |
| Secondary | Mint | `#B5FFC2` | `--omniray-mint` | `omniray-mint` |
| Neutral | Black | `#000000` | `--omniray-black` | `omniray-black` |
| Neutral | White | `#FFFFFF` | `--omniray-white` | `omniray-white` |
| Page background | Paper | `#F1FAF3` | `--omniray-paper` | `omniray-paper` |
| Muted text on light | Ink muted | `#4F6359` | `--omniray-ink-muted` | `omniray-ink-muted` |
| Orange text and links on light | Orange deep | `#C93B00` | `--omniray-orange-deep` | `omniray-orange-deep` |
| Yellow-family text on light (rare) | Yellow deep | `#7A6D00` | `--omniray-yellow-deep` | `omniray-yellow-deep` |

The first six are your brand colours. Paper is a barely-there mint tint made for page backgrounds. The last three are darker versions of the same hues, made so text stays readable on light backgrounds. Use them instead of putting the brand colours where they fail.

## Usage split

Aim for roughly 60% paper and white, 30% ink, and 10% shared between orange, yellow and mint. Orange is the main accent, so keep it to about 5% and let yellow and mint stay rare.

- **Ink**: headings, body text, dark sections, footers, the logo ring.
- **Orange**: the exclamation point, "Ray", one primary call to action per screen.
- **Yellow**: highlights, badges and "Ray" on dark sections. Mostly a dark-background colour.
- **Mint**: the logo ring on dark, accents on dark sections, and soft mint blocks with ink text.
- **Paper and white**: page backgrounds (paper) and cards (white).
- **Black**: print, stamps and one-colour uses. On screen, prefer ink, because pure black next to deep green looks like a mistake.

## Contrast table

| Combination | Ratio | Use for |
|---|---|---|
| Ink on white | 15.9:1 | Everything. Body text, headings. |
| Ink on paper | 15.0:1 | Everything. Body text, headings. |
| Ink muted on white | 6.4:1 | Secondary text, captions |
| Ink muted on paper | 6.0:1 | Secondary text, captions |
| Orange deep on white | 5.1:1 | Orange text, links, small labels |
| Orange deep on paper | 4.8:1 | Orange text, links, small labels |
| Yellow deep on white | 5.2:1 | Yellow-family text on light (rare) |
| White on ink | 15.9:1 | Text on dark sections |
| Mint on ink | 13.7:1 | Text, icons and the logo ring on dark |
| Yellow on ink | 8.4:1 | Highlights, "Ray" and accents on dark |
| Orange on ink | 4.9:1 | Orange text, icons and buttons on dark |
| Ink on orange | 4.9:1 | Text on orange buttons |
| Black on orange | 6.5:1 | Text on orange, if you prefer black |
| Ink on yellow | 8.4:1 | Text on yellow blocks |
| Ink on mint | 13.7:1 | Text on mint blocks |
| Orange on white | 3.3:1 | **Large text only** (24 px, or 19 px bold) and graphics |
| Orange on paper | 3.1:1 | **Large text only** and graphics, barely |
| White on orange | 3.3:1 | **Large or bold text only.** Prefer ink text on orange. |
| Yellow on white | 1.9:1 | **Never.** |
| Mint on white | 1.2:1 | **Never.** |
| Orange on mint | 2.8:1 | **Never.** |
| Orange on yellow | 1.7:1 | **Never.** |
| Yellow on mint | 1.6:1 | **Never.** |

Text needs 4.5:1 (or 3:1 if it's 24 px or 19 px bold and up). Icons and graphic parts need 3:1.

## Rules

1. **Text is ink.** Headings and body copy are ink on paper or white. Secondary text is ink muted. Never set body text in orange, yellow or mint.
2. **Orange buttons carry ink text** (4.9:1). White text on orange only reaches 3.3:1, so use it for 19 px bold or larger. On white or paper, the button edge against the page is only 3:1, which is fine for a button shape.
3. **Links on light are orange deep** (`#C93B00`), underlined. On dark they're mint or yellow.
4. **Orange text on light uses orange deep** unless the text is large (24 px or 19 px bold and up), where plain orange is acceptable. The big "Ray" in the logo is an example.
5. **Yellow and mint are dark-background colours.** On white or paper they disappear (1.9:1 and 1.2:1). On light backgrounds they only appear as filled blocks with ink text.
6. **Never put two bright colours together.** Orange on yellow, orange on mint and yellow on mint all fail. Pair each bright colour with ink.
7. **Dark sections are ink**, not black. Text on them is white, with mint for secondary text and yellow for highlights.
8. **One orange call to action per screen.** Everything else uses ink, or ink with a mint or yellow fill.
9. **Don't introduce new hues.** For success, warning and error states, use green, amber and red from your UI kit and keep them out of marketing layouts. Note that orange is already the brand accent, so don't use it as an error colour.
10. **Dark mode:** background ink, text white, secondary text mint, accent orange, links mint.

## Logo on colour

| Background | Logo to use | `<Logo>` props |
|---|---|---|
| White or paper | Full colour (ink ring, orange mark, orange "Ray") | `tone="color"` |
| Ink | Reversed (mint ring, orange mark, white "Omni", yellow "Ray") | `tone="reversed"` |
| Orange, yellow or mint | One colour, ink | `tone="ink"` |
| Photo or busy image | One colour, white | `tone="white"` |

Don't place the full-colour logo on orange, yellow or mint, because the orange mark disappears or clashes. Don't recolour the logo by hand.
