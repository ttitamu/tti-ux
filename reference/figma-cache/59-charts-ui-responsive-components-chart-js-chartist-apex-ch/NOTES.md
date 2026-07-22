# 59 Charts UI Responsive Components Chart.js / Chartist / Apex / Recharts (Community)

**Source:** Figma file `cgyhVbNMfmCkehk49v6leb`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium → skip (audited; out of scope)
**Status:** absorbed — no new components; chart family already closed

![cover](./cover.png)

> Reviewed during the post-platform-aware sweep. A four-library
> chart sampler (Chart.js, Chartist, Apex Charts, Recharts) — 59
> chart variants in card-shaped containers. TUX's native chart
> family already shipped a more focused set; this file's chart-
> library positioning isn't TUX's path.

## What it is

Two pages of chart-library samples wrapped in identical card
chrome (title + value + plot + legend). The 59 variants span the
common families (line, bar, area, donut, gauge, radar, sparkline)
across four different JavaScript chart libraries.

Pages:
- `5:6381` — All You Need / Help / Start _(6 frames — kit docs)_
- `0:1` — **All Charts Components** _(18 frames — the catalog)_

## Pattern → TUX coverage

| Chart type | TUX coverage |
|---|---|
| Line | `TuxChartLine` (with tooltip + brush + previous-period overlay) |
| Bar (vertical / horizontal / grouped / stacked) | `TuxChartBar` (all four variants + comparison overlay) |
| Area (single / stacked) | `TuxChartArea` (overlay + stacked variants) |
| Donut / Pie | `TuxChartDonut` (donut with center stat slot; pie deliberately omitted — donut preferred for label clarity) |
| Gauge | `TuxChartGauge` (arc + radial-progress variants) |
| Scatter / bubble | `TuxChartScatter` (with optional trendline + R²) |
| Sparkline | `TuxSparkline` (inline mini trend) |
| Radar | Not built; not on TUX roadmap (rarely needed in research surfaces; categorical comparisons better served by grouped `TuxChartBar`) |
| Geographic / world map | `TuxChartGeographic` (Texas-flavored; world ramp not built) |

## Skip

- **Adopting any of the four chart libraries** (Chart.js,
  Chartist, Apex, Recharts). TUX's chart family is
  **native-SVG-rendered**, sized ~3-15 KB per chart, with
  consistent token-driven theming and brand-aligned palettes.
  Wrapping a chart library would mean importing 60-300 KB of
  external code for capability TUX already has.
- **The card-shaped chrome.** TUX uses `TuxChartFrame` for the
  editorial chrome (eyebrow / display title / signature rule /
  source citation) — different visual identity from this kit's
  "card title + value + chart" shape.
- **Radar charts.** Not on the roadmap.

## Absorb

- **Confirmation only.** The 59-variant catalog confirms that
  TUX's eight-chart family (Line / Bar / Area / Donut / Scatter /
  Gauge / Geographic / Sunburst + helpers like Sparkline) covers
  the canonical surface. No gap.

## Tension

- **"Why not use Chart.js / Recharts under the hood?"** Three
  reasons: (1) tree-shake-friendly bundle (native SVG = ~5 KB per
  chart vs 50+ KB for a library wrapper), (2) consistent
  brand-theming via TUX tokens without per-library theme adapters,
  (3) SSR-safe rendering (no canvas, no async hydrate flicker).
  The trade-off is accepted; TUX charts stay native.

## Decisions

- **No new components.**
- **No chart-library adoption.** Native SVG remains the
  architecture.
- **Move file from skip → medium → skip on next rebuild.**
  Confirmation-only; no recurring use.

## Open follow-ups

- None.
