# TTI palette — extraction notes

Reference document for `design/tokens.json`. Explains where each hex came from and what to trust when they disagree.

## Sources

| Source | What it gave us |
|---|---|
| `TTI-presentation-template-option-1.pptx` → `ppt/theme/theme1.xml` | Canonical XML-defined accents — authoritative for PPTX-theme slots |
| `TTI-presentation-template-option-2.pptx` / `option-3.pptx` | Alternate approved palettes — emphasize sage/gold over navy/maroon |
| `TTI-presentation-template-highcontrast-508.pptx` | WCAG-tuned palette with grayscale + deepened maroon |
| `tti-overview.pdf`, `tti-factsheet-4pg.pdf`, `tti-rellis-campus.pdf` | Brand colors **in actual marketing use** — pixel-sampled from covers and content pages |

## Reconciled primary palette

| Name | Hex | Source | Notes |
|---|---|---|---|
| `tti.maroon` | `#5C0025` | PDFs (pixel-sampled) | Slightly darker than the PPTX token `#5C0825`. PDFs reflect actual printed/digital output; PPTX is template-level. Use the PDF value. |
| `tti.gold` | `#DDAC37` | PDFs | PPTX variants: `#DEAB37` / `#DCAA37` — all equivalent within print tolerance. Warm ochre, not bright yellow. |
| `tti.navy` | `#15457E` | PPTX option-1 | Used heavily in PPTX option-1 as `dk1`/`accent1`. Less dominant in PDFs. Keep as secondary accent. |
| `tti.teal` | `#4A8892` | PPTX | Tertiary, data-viz category color. |
| `tti.sage` | `#66814F` | PPTX | Tertiary. Option-2/3 templates promote sage as primary — we don't. |
| `tti.charcoal` | `#221F1F` | PDFs | Body copy throughout. Not pure `#000`. |

## Dark theme

The `tti-dark` theme isn't derived from a TTI source artifact — TTI has no published dark palette. It's a tux-original mapping built to keep the editorial system legible after sunset while preserving brand recognition. Values are mirrored in `design/tokens.json` (`themes.tti-dark`) and applied at runtime via `[data-theme="tti-dark"]` in `app/assets/css/tokens.css`.

### Why primary shifts from maroon to lifted teal

Earlier dark drafts kept maroon as the brand primary by lightening it to rose-pink variants (`#e795a8`, `#db859e`). They read **too pink** against the small chrome elements where the accent actually lives — composer borders, focus rings, active-tab text, input outlines. Consolidating the dark-mode accent on **lifted TTI teal** (`#6BB4C0`, base `tti.teal #4A8892` lifted ~15%) gave the studio chrome a single coherent hue and cleared AAA on every dark surface:

| Surface | Hex | Contrast vs `#6BB4C0` |
|---|---|---|
| `surface.page` | `#15100F` | ~8.2:1 |
| `surface.raised` | `#221F1F` | 7.1:1 |
| `surface.sunken` | `#0B0908` | ~8.7:1 |

Gold accent stays unchanged — its job in dark is emphasis, not legibility, and the warm ochre keeps the TTI signature warmth on dark surfaces.

### How maroon brand presence is preserved on dark

Three deliberate channels keep maroon visible even though `brand.primary` resolves to teal:

1. **`brand.fill`** stays `tti.maroon` (`#5C0025`). Marketing panels (`<TuxCTA>`, hero bands) still render white-on-wine. Same hex in every theme except HC.
2. **`chart.1`** is pinned to wine-rose `#c47585` rather than `brand.primary`. The primary chart series stays in the maroon family so a TTI dashboard reads as a TTI dashboard.
3. **Nuxt UI's `--color-maroon-400`** is overridden to `#6BB4C0` so solid primary buttons inherit the teal accent. (Implementation detail in `tokens.css`; not exposed in `tokens.json` because it's a vendor-namespace override.)

### Lifted semantic + chart + map palettes

Every semantic color is lifted to clear AAA (7:1) on `surface.page`. Numbers verified by `/contrast-audit`:

| Semantic | Light base | Dark lifted | Mapping |
|---|---|---|---|
| `success` | `#66814F` (sage) | `#ABCC8E` | mint |
| `warning` | `#DDAC37` (gold) | `#F5D98A` | pale wheat |
| `danger`  | `#5C0025` (maroon) | `#e795a8` | pale rose |
| `info`    | `#4A8892` (teal) | `#9BD4E0` | pale cyan |

The 8-step categorical chart palette and the maroon/slate map ramps follow the same lift pattern — exact values in `tokens.json` under `themes.tti-dark.chart` and `.map`.

### Asymmetry note

`themes.tti` and `themes.tti-hc` only declare `brand` + `surface` + `text` because their semantic / chart / map values inherit from the base `color.semantic` block. `themes.tti-dark` additionally declares `semantic`, `focus`, `chart`, and `map` because every one of those needs lifted values to clear AAA on dark surfaces. That asymmetry is real; don't flatten it by inheriting through to dark.

## Operational status ramp

Separate from the semantic palette, and for a specific reason: `semantic` is a
**sentiment** palette (good / neutral / bad), and it cannot express the five
states an operations surface has to separate at a glance.

Two concrete failures that forced the split, both found building the Nagios
overlay:

- `semantic.success` `#3D5328` is a deep olive tuned to clear AAA *as text on
  white*. Used as a cell tint it loses its hue and reads grey-green.
- There is **no orange**, so UNKNOWN had to borrow `chart.5` `#8C5A3C` — a clay
  brown that reads as a weak red and collides with CRITICAL, after which
  PENDING's neutral grey sat too close to that near-grey brown.

Hues are inherited from what Nagios Core itself ships, because green → yellow →
orange → red is operator muscle memory. `maintenance` is the exception — Nagios
has no colour for it because it is not a severity at all, so it takes TTI's own
blue (`brand.secondary`'s hue) and sits off the ramp:

| State | Nagios stock | `tti` base | `tti` fill | `tti-dark` base | `tti-dark` fill |
|---|---|---|---|---|---|
| ok | `#33FF00` | `#258818` | `#93F387` | `#90F084` | `#86E67A` |
| warning | `#FFFF00` | `#7A7A00` | `#ECEE55` | `#FDFF68` | `#E6E74C` |
| unknown | `#FF9900` | `#BC5B00` | `#FF9B5A` | `#FC8731` | `#FF8A37` |
| critical | `#F83838` | `#A02828` | `#FF544D` | `#F14440` | `#FC4F49` |
| pending | `#ACACAC` | `#747474` | `#DEDEDE` | `#ABABAB` | `#D1D1D1` |
| maintenance | — (TTI blue) | `#0566C7` | `#85BAFF` | `#53A0FF` | `#85BAFF` |

Three roles per state — `base` (text, edges, identity), `fill` (a chip), `ink`
(the word inside it) — because on a light surface a colour dark enough to be
legible as text is necessarily dark, and dark yellow is olive while dark orange
is brown. Hue lives in the fill.

`tti-hc` renders outlined chips instead: fill is the page surface, ink is the
base, and every base clears AAA.

Chip lightness descends with severity across the **warm** hues (warning →
unknown → critical), so severity reads as weight as well as hue — the channel
that still works for a reader who cannot separate them. It stops short of `ok`
on purpose: yellow's natural lightness sits above green's, and forcing it below
turns it olive rather than yellow.

Derivation rules and their guards are in
[ADR-0013](../docs/adr/0013-operational-status-ramp.md); `npm run audit:status`
enforces them and needs neither a browser nor a build.

**Note for BI:** Power BI's `good` / `neutral` / `bad` still resolve to the
*semantic* palette, deliberately — re-pointing them would change every report
already built on `tti-theme.json`. See the ADR's "deliberately not done".

## High-contrast (508) palette

From `TTI-presentation-template-highcontrast-508.pptx`:

| Slot | Hex | Role |
|---|---|---|
| dk1 | `#000000` | text / hi-contrast foreground |
| lt1 | `#FFFFFE` | background |
| dk2 | `#500000` | deepened maroon accent |
| lt2 | `#DCAA37` | gold accent |
| accent5 | `#CBCBCB` | light divider |

Uses Arial (vs Calibri for regular templates) — PPTX-specific, doesn't affect web choice.

## Conflict log (important)

1. **PPTX option-1 makes navy `#15457E` the `dk1`/`accent1`** but the PDFs anchor heavily on maroon `#5C0025`. PPTX templates include multiple approved color *flavors*; PDFs reflect the actual produced brand. **Web UI anchors on maroon + gold.**

2. **PPTX maroon (`#5C0825`) vs PDF-sampled maroon (`#5C0025`)** are 3 points apart in the red channel — within any reasonable Delta-E tolerance. PDF value chosen for the token because it's what readers see.

3. **Gold has three variants** (`#DEAB37`, `#DCAA37`, `#DDAC37`) across artifacts — all within 2 points per channel. `#DDAC37` is the middle value and what PDFs sample; use it.

## Typography — reconciled

| Artifact | Heading | Body |
|---|---|---|
| PPTX (all templates) | Calibri Light | Calibri |
| `tti-rellis-campus.pdf`, `tti-overview.pdf` (older system) | Imago, Franklin Gothic (mixed) | AGaramondPro (serif) / Open Sans |
| `tti-factsheet-4pg.pdf` (newer system) | Franklin Gothic ATF | Franklin Gothic ATF |

**Direction:** the newer (factsheet) system is where TTI is headed. Franklin Gothic ATF is a licensed font — we match the *feel* with **Public Sans** (US Web Design System, open-source, visually close). If TTI licenses Franklin Gothic ATF for web, we swap the token value; no other changes needed.

## Visual identity cues to preserve in tux

- **Big-number stats** — oversized maroon or gold numerals with tiny tracked-out labels. Single most recognizable TTI design move. See `BigStat` in the components doc.
- **ALL-CAPS section headers** — letter-spaced, bold sans-serif. Editorial rhythm throughout the collateral.
- **Maroon square bullets** in lists.
- **Editorial grid**, not card-heavy dashboard. Leave white space.
- **Maroon + gold as primary data-viz pair**, with teal/navy/sage as category extenders.

## Relationship to TAMUS

TTI presents as its **own institutional voice that happens to live in the A&M system**. Boilerplate ("an agency of the State of Texas and member of The Texas A&M University System") appears in body copy, not as a co-branded logo lockup. Aggie maroon is the cue — not a TAMUS logo.

tux follows: themes per institution; TTI is not "a TAMU skin." The `tti` theme and the `tamu` theme are siblings, not parent-child.
