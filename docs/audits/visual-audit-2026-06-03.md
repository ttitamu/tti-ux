# Visual audit — 2026-06-03

Full-system visual correctness pass over the tux style guide, focused on
**spacing in visualizations** and **light/dark contrast in context**, ahead
of the cross-framework Phase 0 (ADR-0012).

## Method

- **262 full-page screenshots** — 131 routes × {`tti` light, `tti-dark`},
  captured headless against the dev server.
- **8 parallel reviewers** triaged each light/dark pair against a
  spacing / contrast / breakage rubric.
- **Live verification** of every HIGH/MED candidate in-browser — measured
  element geometry and computed contrast ratios (not eyeballing alone).
- **Automated WCAG 2.2 AAA token audit** across all three themes
  (`tti` / `tti-dark` / `tti-hc`).

## Headline

The system is in strong shape. **Visualizations — the primary worry — are
essentially clean** in both themes. The automated token audit passes
**276/276 pairs at AAA across all three themes**. Only four real defects
surfaced; two warrant fixing now.

## Resolution (2026-06-03)

All four defects fixed and verified live in both themes; lint + typecheck pass.

| # | Component | Fix | Verified |
|---|---|---|---|
| 1 | `TuxStepper` | Horizontal layout restructured — circle+text flow into a centered, width-constrained column; connector absolutely positioned between circles. | overlaps 33px → **0** |
| 2 | `TuxCTA` | `background` token swapped `--brand-primary` → `--brand-fill` (stays dark maroon in dark). | 2.36:1 → **14.17:1**; action buttons 7.42 / 11.29 |
| 3 | `useTuxMermaid` | Borders/edges lifted to the dark-mode teal stroke; ER `attributeBackgroundColor*` pinned to dark fills; `nodeTextColor` pinned. | borders visible, ER cells dark, text legible |
| 4 | `TuxReportWebFrame` | Long-form body `:deep(p)` `--text-secondary` → `--text-primary`. | muted → **18.08:1** |

Detail on each original finding follows.

## Confirmed defects (verified live)

### 1. HIGH — `TuxStepper` horizontal: description text overlaps (both themes)
`/components/stepper`. The per-step description under each node overflows
its column and collides with its neighbors. Measured: step-1 description
right edge x=739 vs step-2 left edge x=706 (~33px overlap); the collision
repeats across all six steps at y=563. The vertical/stacked variant is
fine. Identical in light and dark.
**Cause:** horizontal-variant step descriptions are not width-constrained /
centered to their column.

### 2. HIGH — `TuxCTA` maroon variant unreadable in dark mode
`/components/cta` (dark). The maroon CTA panel shifts to a **lifted-teal
fill** `rgb(107,180,192)` in dark, but the eyebrow, dek, and headline stay
**white → 2.36:1** — fails AA (4.5) and AAA (7.0).
**Root cause:** the dark theme's lifted-teal is an *accent / text* color
(light, meant to sit on the dark page), being used here as a *surface fill*
while the on-fill text stays white. The individual tokens are AAA-valid;
the **composition** is wrong.
**Why the token audit missed it:** the AAA audit checks token swatch pairs
on a dedicated page, not real component compositions. → argues for the
component-level visual-parity CI in ADR-0012.
**Check when fixing:** other maroon *filled* surfaces with white text in
dark (announcement-banner, page-header hero, card-slab maroon). Footer
reviewed clean — it uses a dark maroon fill, not the teal.

### 3. MED — `TuxDiagram` (Mermaid) dark mode: low-contrast node/cell text
`/components/diagram` (dark). Mermaid flowchart node text and ER-table cell
text render dim inside dark/red-bordered nodes; diagrams only partially
adopt the dark theme. Light is clean.
**Cause:** Mermaid theme not fully bound to the tux dark tokens.

### 4. LOW — `/reports/web-frame` dark: muted body/source text
Body paragraphs and the "Source:" caption are the lowest-contrast text on
the page — readable, but the weakest spot found.

## Verified NON-issues (do not "fix" correct behavior)

- **`TuxBigStat` dark** — the maroon tone renders as lifted-teal *text* on
  the charcoal page; intentional and high-contrast. Correct as-is.
- **`chart-geographic`** — the teal-highlighted Texas in dark is an
  intentional highlight (`highlight="TX"`), not a theme bug.
- **`/components/diagram` light** — the single capture failure was
  transient; the page renders fine.

## Recommendation

- Fix **#1 (stepper)** and **#2 (CTA dark)** — both small, both real.
- **#2's root cause feeds Phase 0**: the dark-theme tokens must distinguish
  "teal as on-dark text/accent" from "teal as a fill (which needs dark
  on-fill text)." Encode that distinction in `tokens.json` /
  `design/palette.md` so the cross-framework CSS kit can't reproduce it.
- **#3** is a Mermaid theming task; **#4** a minor token nudge.
- Adopt **component-level** (not just token-level) contrast checking — the
  AAA token audit gave a clean bill while a real 2.36:1 composition
  shipped. This is the visual-parity gate ADR-0012 calls for.
