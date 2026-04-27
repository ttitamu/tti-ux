# Slides Kit — tti-ux in deck form

A 7-slide 1920×1080 deck that presents tti-ux as an internal design-system announcement. Uses the same tokens (`colors_and_type.css`) as the rest of the design system, so a font or palette change propagates here automatically.

## Slides

| # | Label | Layout |
|---|---|---|
| 01 | Title | Two-column. Maroon block-right with oversized italic glyph + release metadata; italic display title left. |
| 02 | Manifesto | Full-bleed maroon section divider. Oversized italic pull-quote with gold accent word — "Institutional, not instagrammable." |
| 03 | Principles | Three editorial columns, each with a top maroon border + index number + short principle text. |
| 04 | Big Stat | The signature editorial numeral — `$126M` set in display-italic at 560px, paired with the institutional framing. |
| 05 | Components | Two-column: numbered component list left, live demo preview (buttons, badges, card) right. |
| 06 | Palette | 6×2 swatch grid covering maroon, gold, navy, sage, teal, red, charcoal, and the two key surfaces. |
| 07 | Closing | Full-bleed maroon with radial gold wash. Oversized `tx` glyph, sign-off, and the three channels (repo, docs, slack). |

## System

- Title rhythm: Oswald display (`var(--font-display)`), uppercase + tight tracking, 800 weight where used oversized.
- Every slide carries the same footer: small logo + wordmark left, `NN / 07` right, separated from the body by a 1px rule.
- Two backgrounds only — page white, brand maroon. No gradients except the closing slide's corner wash.
- Numerals are always italic + tabular (oldstyle elsewhere, but tabular for stats so they align vertically).

## Navigation

- **Arrow keys / click** — built into `deck-stage.js`.
- **Print** — Cmd/Ctrl-P prints one slide per page at 1920×1080.
- **Programmatic** — `document.querySelector('deck-stage').goTo(n)` (0-indexed).
