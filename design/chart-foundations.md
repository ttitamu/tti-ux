# Chart foundations

> **Status:** skeleton (2026-05-21). Captures the doctrine that the
> upcoming Priority B chart components — `TuxChartLine`, `TuxChartBar`,
> `TuxChartArea`, `TuxChartScatter` — will follow. Fills in with worked
> examples as each component ships.

Reading this before building any chart component is the point. The
patterns here are absorbed from the 2026-05 Figma sweep (Charts UI
Kit, Data Visualization Graphs / Charts Kit, Snow Dashboard) and from
TUX's existing `TuxSparkline` / `TuxChartGeographic` / `TuxChartSunburst`
shipping experience.

---

## 1. Palette — `--chart-1` through `--chart-8`

Eight categorical hues, maroon-anchored, defined in
[`app/assets/css/tokens.css`](../app/assets/css/tokens.css) and re-
remapped per theme (light / dark / high-contrast):

| Token | Light (default) | Hue family |
|---|---|---|
| `--chart-1` | `var(--brand-primary)` (#5C0025 maroon) | brand anchor |
| `--chart-2` | #3F5A6F | slate teal |
| `--chart-3` | #C7973C | wheat |
| `--chart-4` | #6B8E5A | sage |
| `--chart-5` | #8C5A3C | clay |
| `--chart-6` | #5C7080 | fog |
| `--chart-7` | #A33A3A | rust red |
| `--chart-8` | #3C5A87 | deep blue |

**Rules:**
- **Always start at `--chart-1`** for the primary series. The brand
  anchor leads.
- **Don't reuse `--chart-1` for a secondary "previous-period" overlay
  on the same chart.** Overlays use a muted variant (see §5).
- **Don't expand beyond 8 series.** If a chart needs 9+, the data
  belongs in a table, a small-multiples grid (`TuxVizGrid`), or a
  sunburst (`TuxChartSunburst`) — not a single overcrowded chart.
- **Color is not the only encoder.** Always pair color with one of:
  shape (markers), thickness (stroke), or text (end-of-line label).
  See §3 + §6.

The 8-hue × 3-theme matrix was reaffirmed twice in the medium-signal
pass (Charts UI Kit + Data Viz Graphs both converge on this shape).
Don't re-tune.

## 2. Axis, grid, and legend tokens

Settled 2026-09-01, after the charts shipped and the Power BI emitter
(`scripts/build-powerbi-theme.mjs`) forced every one of these choices to
become a literal. Two systems now have to agree on them, which is what
turned the guesses below into decisions.

**No `--chart-*` tokens were minted.** The 2026-05 skeleton expected
four new anchors (`--chart-axis`, `--chart-gridline`, `--chart-label`,
`--chart-legend`). Building both consumers showed they aren't needed —
the surface and text ramps already carry these roles, and aliasing them
would create two names for one value, which `audit:tokens` flags. Use
the anchors directly:

| Role | Web token | Power BI theme |
|---|---|---|
| Axis line | `--surface-border` | `thirdLevelElements` |
| Gridline | `--surface-border` @ `opacity: 0.5` | `gridlineColor` ← `surface.border-subtle` |
| Axis tick text | `--text-secondary` | `categoryAxis`/`valueAxis` `fontColor` |
| Legend text | `--text-secondary` | `legend.labelColor` |
| Data labels | `--text-secondary` | `labels.color` |

The gridline row is the one deliberate divergence. The web charts render
`--surface-border` at half opacity; a Power BI theme has no opacity
channel on `gridlineColor`, so it uses `surface.border-subtle` instead —
`#EFEEED`, which is within a hair of `#E7E6E6` composited at 50% on
white. Same intent, two mechanisms, because one of them can't express
alpha.

### Rules

- **Gridlines on the value axis only.** One horizontal rule per value
  step is enough to read a bar or point against; category-axis gridlines
  add ink without adding information. (`gridlineShow: false` on
  `categoryAxis`, `true` on `valueAxis`.)
- **Axis titles off by default.** The field name is nearly always
  redundant with the visual's own title. Fluent 2 defaults them off too,
  so this is now the platform default rather than a house deviation.
- **Legend on top, no legend title**, for the same redundancy reason.
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) on axis
  ticks and value labels everywhere — aligns with the rest of TUX's data
  density.

### Known deviation — reconcile before the next chart batch

`TuxChartLine` styles its x/y tick labels `--text-muted`, while
`TuxChartBar` uses `--text-secondary`. Both clear WCAG 2.2 AAA on white
(tokens.json holds them both to 7:1), so this is a consistency defect,
not an accessibility one — but the two charts genuinely render axis text
at different weights of grey today.

`--text-secondary` is canonical, on three grounds: `TuxChartBar` already
uses it, the Power BI theme emits it, and axis ticks carry real
information rather than being de-emphasised chrome. `TuxChartLine` is
the outlier and should move — as its own change with the chart family,
not folded into a doc edit, since it is a visible change to a shipped
component.

## 3. Value-label placement — in-bar vs above

Absorbed from the Data Viz Graphs kit, which documents the choice as
two distinct text styles ("Percent In-bar" / "Percent Out-bar"):

| Placement | When | Style |
|---|---|---|
| **In-bar** | Bar pixel-height ≥ 24px. Label fits inside the bar without truncation. | White on the bar fill (contrast-checked at AA against the darkest chart hue). Tabular-nums. |
| **Above** | Bar pixel-height < 24px, OR consumer wants prose-rhythm alignment. | `--text-primary` on `--surface-page`. Anchored to the bar top with 4px gap. |
| **Auto (recommended default)** | Let the component pick at render time using the 24px rule. | `valuePlacement="auto"` on the future `TuxChartBar`. |

The 24px threshold is the inflection point where in-bar labels start
to feel cramped — verified visually against the kit's reference frames.

## 4. End-of-line labels on line charts

Absorbed from Data Viz Graphs. **The default behavior** for
`TuxChartLine`, not opt-in:

- For each series, render the final value at the right end of the
  line, colored to match the series stroke.
- Below a width threshold (~480px container), hide the labels and
  fall back to the legend.
- Screen-reader summary should always include the final values
  regardless of label visibility.

This is **a real accessibility win** — color-blind users get series
identity from both color AND adjacent text, no legend round-trip
needed. The pattern transfers cleanly from the kit's dark-canvas
treatment to TUX's white paper-grain default.

## 5. Comparison series (current vs previous)

Absorbed from Snow Dashboard. The pattern: render the previous-period
series as a muted/dashed companion to the primary line or bar.

**For `TuxChartLine`:**
- `series.previous` data array of the same length as the primary
  series (or `null` if not provided).
- Render: same hue family, 60% opacity, dashed stroke (`4 4`).
- Tooltip shows current + previous + delta when both are present.

**For `TuxChartBar`:**
- `series.comparison` data array per category.
- Render: same hue family, 40% opacity, drawn behind the primary bar
  with 4px wider footprint, no fill border — the primary bar sits in
  front like a darker silhouette.
- Use case: "projection vs actual," "target vs realized."

**Anti-pattern:** don't use a *different* hue for the previous-period
series. Same hue, muted — that's the visual cue that says "this is
the same metric, prior window." A different hue reads as a different
metric.

## 6. Brush / range selector on time-series

Absorbed from Charts UI Kit. When a time-series spans a long window
and the user needs to scrub:

- A secondary, dimmed strip of the full series renders below the
  primary chart.
- Two draggable handles bracket the active window; the primary
  chart re-renders to the brushed range.
- The strip is ~64px tall; the brushed window is highlighted with
  `color-mix(in srgb, var(--brand-primary) 6%, transparent)`.

Shipped via either a `withBrush` boolean prop on `TuxChartLine` or a
named slot (`#range`) so consumers can drop a custom strip. Final
choice deferred to build time.

## 7. KPI strip composition

Absorbed from Snow Dashboard + Charts UI Kit. When a chart anchors a
section, the parent template composes a KPI strip above:

```vue
<section>
  <TuxFactoid
    density="3"
    :items="[
      { value: 89_529, label: 'Total · this week' },
      { value: 83_529, suffix: ' (-7%)', label: 'Previous week' },
      { value: 5_000,  label: 'Δ delta' },
    ]"
  />
  <TuxChartArea :series="series" stacked />
</section>
```

**The KPIs and the chart are siblings**, not nested inside a
single component. The chart doesn't bake KPI math; the parent reads
the data once, exposes summary stats, and hands the chart the same
data. This keeps `TuxChartArea` honest about its job (renders shapes)
and lets the consumer swap KPI affordances (BigStat / Factoid /
single-stat) without forking the chart.

## 8. Accessibility — alt-text + screen-reader summaries

`TuxSparkline` already ships the pattern; future chart components
follow:

- **SR-only summary** derived from the data: "Trend: 12 points,
  low 18.2, high 24.7, last 23.1 (up 4.9 from first)."
- **`<title>` inside the SVG** for hover/SR readouts.
- **`aria-labelledby` + `aria-describedby`** wiring when the chart
  ships an external caption (e.g. inside `TuxChartFrame`).
- **No relying on color alone** — see §1 rule "Color is not the only
  encoder."

For chart kinds where the SR summary is non-obvious (sunburst, geo
choropleth), components ship an `ariaSummary` prop the consumer can
override with a curated sentence.

## 9. Editorial framing — `TuxChartFrame`

When a chart appears in a report or paper context, wrap it in
`TuxChartFrame` to inherit the editorial chrome:

- Uppercase tracked eyebrow ("Exhibit 11.04")
- Display-face title (Oswald)
- 2px maroon signature rule
- Chart body (the slotted chart component)
- Footnote + source citation lines

In dashboard tiles, drop the frame — the surrounding TuxCard
provides equivalent chrome.

---

## Status by component

| Component | Status |
|---|---|
| `TuxSparkline` | Shipped — inline mini-trend; native SVG; SR summary; tone-aware |
| `TuxChartGeographic` | Shipped — Texas-flavored maps; 5 kinds (county / districts / states / dot / OD) |
| `TuxChartSunburst` | Shipped — two-ring radial |
| `TuxChartFrame` | Shipped — editorial wrapper |
| `TuxChartHeatmap` | Shipped — matrix heatmap on the 5-stop sequential map ramps; equal-interval bins (`tuxQuantizeBin`); 2-D keyboard cursor; honest null cells |
| `TuxChartHistogram` | Shipped — raw-sample distribution; nice 1/2/5 bin edges (`tuxBinEdges`); dashed gold percentile rules (`tuxQuantile`); normalize-to-share mode |
| `TuxChartLine` | Roadmap Priority B — see §4, §5, §6 |
| `TuxChartBar` | Roadmap Priority B — see §3, §5 |
| `TuxChartArea` | Roadmap Priority B — see §7 |
| `TuxChartScatter` | Roadmap Priority B |

Build order is roughly Line → Bar → Area → Scatter, but consumer
pressure (Landscape dashboard data shape) may re-order.

---

## How this doc evolves

When a `TuxChart*` component ships, expand its §section above with
the worked code example and the actual prop shape. The skeleton's
job is to set doctrine; ship-time fills the body.

Cross-references:
- [Components map](components.md)
- [Roadmap — Priority B charts](roadmap.md#charts--data-viz)
- Figma absorption notes:
  [Charts UI Kit](../reference/figma-cache/charts-ui-kit/NOTES.md) ·
  [Data Viz Graphs](../reference/figma-cache/data-visualization-graphs-charts-kit/NOTES.md) ·
  [Snow Dashboard](../reference/figma-cache/snow-dashboard-ui-kit/NOTES.md)
