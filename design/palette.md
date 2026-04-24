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

## Visual identity cues to preserve in aggieux

- **Big-number stats** — oversized maroon or gold numerals with tiny tracked-out labels. Single most recognizable TTI design move. See `BigStat` in the components doc.
- **ALL-CAPS section headers** — letter-spaced, bold sans-serif. Editorial rhythm throughout the collateral.
- **Maroon square bullets** in lists.
- **Editorial grid**, not card-heavy dashboard. Leave white space.
- **Maroon + gold as primary data-viz pair**, with teal/navy/sage as category extenders.

## Relationship to TAMUS

TTI presents as its **own institutional voice that happens to live in the A&M system**. Boilerplate ("an agency of the State of Texas and member of The Texas A&M University System") appears in body copy, not as a co-branded logo lockup. Aggie maroon is the cue — not a TAMUS logo.

aggieux follows: themes per institution; TTI is not "a TAMU skin." The `tti` theme and the `tamu` theme are siblings, not parent-child.
