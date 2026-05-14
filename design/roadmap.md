# tux roadmap

What's missing from tti-ux today, ordered by impact. Adapted from the
aggieux batch-roadmap (which was React/JSX-specific) into a Vue +
Nuxt-shaped backlog. Each entry lists a working name, what it covers,
and any shipped neighbors that already partly fill the gap.

When you ship one, register it in [`app.vue`](../app/app.vue) nav,
[`pages/components/index.vue`](../app/pages/components/index.vue),
[`pages/index.vue`](../app/pages/index.vue), and the doctrine table in
[`components.md`](components.md). Update [`CHANGELOG.md`](../CHANGELOG.md)
under Unreleased.

---

## Priority A — High-value system-level — ✅ closed 2026-04-29

All three sub-families shipped in one batch. See CHANGELOG
"Priority A roadmap batch (2026-04-29)" for the full inventory.

### Status states — ✅ shipped

The "what shows when nothing's there / something broke / something's
loading" family. Closes a real product gap.

- ~~**TuxEmptyState**~~ — shipped (no-data placeholder).
- ~~**TuxErrorPage**~~ — shipped 2026-04-29; 404 / 500 / 403 / 503
  templates with editorial header + recovery actions.
- ~~**TuxSkeleton**~~ — shipped 2026-04-29; shimmer / pulse / never
  modes; six composed presets; honors `prefers-reduced-motion`.
- ~~**TuxStepper**~~ — shipped 2026-04-29; numbered-circle indicator,
  horizontal/vertical with container-query collapse, error-status
  override per step.

### Banners & tags — ✅ shipped

- ~~**TuxAnnouncementBanner**~~ — shipped 2026-04-29; localStorage-
  backed dismissal; four tones; `urgent` reserves the maroon fill.
- ~~**TuxCookieConsent**~~ — shipped 2026-04-29; bottom-right or
  bottom-strip; surface only (host owns categories via slot);
  decision persisted + emitted.
- ~~**TuxBetaRibbon**~~ — shipped 2026-04-29; corner ribbon · top
  stripe · inline pill; preview/beta/dev tones.

### Form primitives reference — ✅ shipped

The roadmap's intent was breaking the inline `/forms` catch-all
into per-primitive state-matrix pages, **not** new Tux\* wrappers
(the existing `/forms` explicitly stated "No Tux wrappers here yet"
because Nuxt UI's form primitives don't need brand deviation). The
Tux\*-prefixed names below were renamed at delivery to plain
section titles.

- ~~**TuxTextField**~~ → ships as [/forms/text-field](app/pages/forms/text-field.vue).
- ~~**TuxSelect**~~ → ships as [/forms/select](app/pages/forms/select.vue).
- ~~**TuxChoice**~~ → ships as [/forms/choice](app/pages/forms/choice.vue).
- ~~**TuxDatePicker**~~ → ships as [/forms/date-picker](app/pages/forms/date-picker.vue).
- ~~**TuxFileUpload**~~ → ships as [/forms/file-upload](app/pages/forms/file-upload.vue).
- ~~**TuxInlineValidation**~~ → ships as [/forms/inline-validation](app/pages/forms/inline-validation.vue) — masked inputs (phone, NIH grant ID), live character counter, async availability check.

The legacy all-in-one form demo lives at
[/forms/all-in-one](app/pages/forms/all-in-one.vue); `/forms`
itself is now a landing tile page.

---

## Priority B — Data patterns

### Charts & data viz

TTI is a research institute — charting is the most under-served family
in the catalog. Note: simple cases compose `TuxVizEmbed` + a Tableau
or Superset URL. These are for first-class native rendering.

- ~~**TuxSparkline**~~ — shipped (inline mini trend line, no axes;
  pairs with TuxBigStat / TuxFactoid for KPI rows).
- **TuxChartBar** — vertical + horizontal, grouped + stacked.
  Maroon-led palette across light/dark/HC.
- **TuxChartLine** — single + multi-series, markers, confidence band.
- **TuxChartScatter** — bivariate scatter for corridor data;
  color-by-category.
- **TuxStatComparison** — before/after stat block, trend-arrow stat,
  year-over-year. Pairs with TuxBigStat.
- **chart-foundations doc** — series palette, axis/grid/legend tokens,
  accessibility (alt-text patterns, screen-reader summaries).

### Map & geospatial

TTI does heavy GIS work.

- **TuxMapEmbed** — Mapbox / Leaflet wrapper with TTI tokens
  (basemap palette, marker styles, popup chrome).
- **TuxMapLegend** — choropleth legend with the editorial maroon rule.
- **TuxCorridorStrip** — linear "strip map" diagram for
  highway-corridor reports.

---

## Priority C — Navigation gaps

### Tabs & sectioning

- **TuxTabsHorizontal** — used in research-report pages, tti-ai-chat
  (chat / settings / history).
- **TuxTabsVertical** — for settings panels.
- ~~**TuxSideSheet**~~ — shipped 2026-05-14 as `TuxSlideover`. Three
  sides (right · left · bottom), built on the native `<dialog>`,
  Batch-J ease-corridor slide animation. See
  [`/components/slideover`](../app/pages/components/slideover.vue).

### Pagination extras

We have basic numbered pagination only.

- **TuxLoadMore** — explicit button.
- **TuxInfiniteScroll** — sentinel + "loading more…" pattern.
- **TuxResultCount** — "Showing 1–24 of 412" with page-size controls.

---

## Priority D — Content patterns

### Comments & feedback

- **TuxCommentThread** — peer-review / editorial-comment threads with
  reply, resolve, mention.
- **TuxReactionBar** — light-touch acknowledgement (helpful · question).

### Tooltips & help

- **TuxTooltip** — keyboard-accessible hover-help. Hairline rule as
  visual anchor.
- **TuxPopover** — richer floating panel (tooltip with title + body +
  action).
- ~~**TuxKeyboardShortcuts**~~ — shipped 2026-05-14 as
  `TuxShortcutsHelp`. Modal overlay triggered by `?`, auto-classifies
  combo vs sequence rows, uses `TuxKbd` for every key glyph. Mounted
  globally in `app.vue` alongside the command palette. See
  [`/components/kbd`](../app/pages/components/kbd.vue) for the kbd
  primitive and the shell's `defineShortcuts` block for the wired
  bindings.

---

## Priority E — Foundations & meta

### Accessibility documentation

- **`/accessibility/skip-to-content`** — keyboard-first foundations
  page.
- **`/accessibility/focus-model`** — visible-focus reference,
  focus-trap behavior, tab order.
- **`/accessibility/contrast-matrix`** — which token pairs pass AA /
  AAA, USWDS-style.
- **`/accessibility/breakpoints`** — documented responsive scale
  alongside the existing spacing scale.

### Mobile frames

If TTI ships an app, native-feel demo frames help stakeholder reviews.

- **TuxIosFrame** — TTI-themed iPhone frame for screenshots.
- **TuxAndroidFrame** — same for Android.

---

## Polish queue — shipped components

Small follow-ups for components already in the catalog. Each one is
worth less than a fresh component; collect them here so they don't
get lost. Pick from the top when there's a slow afternoon.

- **Wire `TuxTOC` into `TuxReportWebFrame`'s `#toc` slot.** The
  web-frame currently renders TOC entries as plain anchor links —
  no scroll-spy, no active-section tracking. The slot already
  accepts richer content; an opt-in story like
  `<TuxReportWebFrame><TuxTOC #toc target="…" /></TuxReportWebFrame>`
  would give consumers IntersectionObserver-driven active state
  without changing the default. **Why:** the bare `<a>` list is fine
  for short reports but degrades on long-form (the use case the
  component was built for).
- **Refresh `/examples/pecan-dashboard` to use the new viz family.**
  The dashboard predates `TuxSparkline`, `TuxVizEmbed`, `TuxVizGrid`.
  Replace the hand-rolled trend strips and table-of-charts with the
  real components. Verify it still composes the same way (BigStat +
  Factoid + Treemap stay; sparkline goes inline next to BigStat
  values; viz-grid replaces the manual 2-up). **Why:** examples
  drift from real catalog usage when components ship faster than
  the demos refresh.
- **Refresh `/examples/research-landing` and
  `/examples/tti-ai-studio-session`** with the same lens — anywhere
  a hand-rolled chart or stat row could be a sparkline or a
  viz-grid, swap it. Same reason as above.

---

## Recently shipped — keyboard shortcuts + prose layer + drawer + tree (2026-05-14)

Sliced delivery of the Nuxt UI gap-analysis follow-through. Three of
the five components close explicit roadmap entries above (under
different working names — `TuxSideSheet` → `TuxSlideover`,
`TuxKeyboardShortcuts` → `TuxShortcutsHelp`); the other two
(`TuxKbd`, `TuxProse`, `TuxTree`) emerged from the audit. Each one
followed the four-surface nav wiring rule (sidebar / index grid /
catalog table / doctrine table). See CHANGELOG for the full per-slice
inventory.

- ~~**TuxKbd**~~ — token-styled `<kbd>` with Mac/PC modifier
  normalization, three sizes, built-in glyphs (`enter` → ↵, arrows,
  `tab`, `space`, …). Slice 1.
- ~~**TuxShortcutsHelp**~~ — modal overlay listing wired bindings,
  triggered by `?`. Auto-classifies combo (`meta_k`) vs sequence
  (`g-c`) rows. Slice 1.
- ~~**Global `defineShortcuts` wiring**~~ — `meta_k`, `/`, `?`,
  `g-c`/`g-t`/`g-d`/`g-h` in `app.vue`. `TuxCommandPalette`
  refactored onto the same composable; mounted globally with groups
  derived from `navTree` so sidebar and palette share a source of
  truth. Slice 1.
- ~~**TuxProse**~~ — typographic shell for long-form markdown.
  Consolidates ~400 lines of duplicated `.prose-tux :deep(…)` CSS
  that lived inline in `/changelog`, `/design/[doc]`, `/markdown`.
  Slice 2.
- ~~**`/typography` refresh**~~ — four-family roster, `heading--elegant`
  demo, style-variants triptych, TuxProse sample. Replaces the stale
  Public-Sans-only foundation page. Slice 2.
- ~~**ContentSurround on `/design/[doc]`**~~ — Nuxt-UI-style prev/next
  sibling-doc navigation at article bottom. Slice 2.
- ~~**TuxTree**~~ — recursive hierarchical list (native, not a
  `UTree` wrapper). Sitemap, corpus/filesystem browser, BI dataset
  explorer (per [ADR-0009](../docs/adr/0009-bi-design-system-source-of-truth.md)).
  Mono leaf labels, sand guide lines, sessionStorage persistence,
  `v-model:selected`. Slice 3.
- ~~**TuxSlideover**~~ — edge-anchored `<dialog>` drawer (right /
  left / bottom). Closes the **TuxSideSheet** roadmap entry. Slice 4.

### Carry-forwards

Two items adjacent to this batch worth tracking:

- The TuxTree selected-row background-color uncovered a Tailwind v4
  `@layer base` cascade gotcha (button reset wins over scoped CSS
  even with `!important`). Documented in CLAUDE.md gotchas and the
  `feedback_tailwind_layer_button_reset` memory.
- `defineShortcuts` grammar: `_` for combos, `-` for sequences.
  Documented in CLAUDE.md and the `feedback_define_shortcuts_grammar`
  memory after burning a verification cycle on `g_c` vs `g-c`.

---

## Recently shipped — data density + geographic charts (2026-05)

Two batches plus the token-only prelude that should have shipped
before them. Both batches were rebuilt from chat memory + the
official source of truth (us-atlas + TxDOT MapServer) after a
worktree got wiped pre-commit. See CHANGELOG entries.

**Data density** — neither was on the original roadmap; both were
pulled in because PECAN-class consumers needed them.

- **TuxRichDataGrid** — interactive grid for operational surfaces.
  Sticky header, row selection (with indeterminate header
  checkbox), expandable detail rows, sortable columns, active-
  filter chip strip, bulk-action bar (visible only when ≥1 row
  selected), footer pagination. Host-driven via v-models +
  events; `cell-<key>`, `expanded`, `bulk-actions` slots.
- **TuxDataTable** — research-flavored static table for finished
  deliverables. Numbered caption + Oswald display title +
  tabular figures, uncertainty cells (`value ± CI` when `ciKey`
  is set), footnote anchors, optional row groups + sticky header
  + totals row, source citation.

**Geographic charts (real geometry)** — adjacent to the still-
aspirational `TuxMapEmbed` line in Priority B (Mapbox/Leaflet
wrapper); these ship pre-projected static SVG geometry, not a
slippy-map runtime.

- **TuxChartGeographic** — five Texas-flavored map kinds in one
  component (`county` choropleth from real TIGER/Line, `districts`
  from the TxDOT MapServer feature service, `us-context` via
  AlbersUsa, `dot-density` rejection-sampled inside the actual
  state outline, `flow` OD arcs between primary metros).
- **TuxMetroInset** — 4-up neighborhood-grid companion (Houston /
  DFW / Austin / SAT). Cell pattern seeded by metro name so SSR
  + CSR match.
- **TuxChartSunburst** — two-ring radial breakdown sister to
  `TuxTreemap`. Container-queried legend collapse below 36rem.
- **TuxChartFrame** — editorial wrapper used by `/visualizations/*`
  showcase pages so a multi-exhibit report reads as one document.

**Geometry pipeline (build-time only).** `scripts/build-geo.mjs`
projects us-atlas + the official TxDOT Boundaries MapServer GeoJSON
into static SVG path strings under `app/assets/geo/`. New
devDependencies: `d3-geo`, `topojson-client/server/simplify`,
`us-atlas`. Outputs are checked in; re-run via `npm run build:geo`
when upstream sources change. New tokens for chart palette
(`--chart-1..8`) and map ramps (`--map-seq-maroon-1..5`,
`--map-seq-slate-1..5`, `--map-outline`, `--map-flow`) across
light / dark / HC.

**Visual-language evolution prelude.** Token-only refresh; component
families inherit automatically. Two-ring focus token, transportation-
tempo easings (`--ease-survey/corridor/arrival`), four-tier
elevation system (`--elevation-flat/rest/hover/overlay/pinned`),
warm-neutral ramp extension (12 → 18 stops), survey-rhythm density
tokens (`--rhythm-tight/snug/normal/loose/roomy`), and
`public/identity-primitives.svg` (four `<symbol>`s: tux-star,
tux-chevron, tux-compass, tux-row-grid). Documented in
[`visual-language-evolution.md`](visual-language-evolution.md).

---

## Recently shipped — reports + visualizations sections

Added 2026-04-28 after the design-kit port; rounded out 2026-04-29:

**Reports** — finished narrative deliverables (paper, PDF, print,
or web-hosted long-form). The reader reads top-to-bottom.

- **TuxReportFrame** — page-sized canvas (letter / a4) for PDF + print.
- **TuxReportPrintSheet** — drop-in print stylesheet.
- **TuxReportWebFrame** — long-form web-hosted narrative (cover,
  byline, lede, TOC, body, footer). Screen-native sibling to
  `TuxReportFrame`; same family because it's still a finished
  narrative read top-to-bottom.

**Visualizations** — interactive data surfaces (BI dashboards, R
artifacts, native charts). The reader pivots, filters, drills in.

- **TuxVizEmbed** — branded chrome for Tableau · Power BI · Apache
  Superset · Grafana iframes (renamed from `TuxReportEmbed`).
- **TuxVizRPlot** — branded chrome for R-language plot artifacts
  (PNG · SVG · htmlwidget; renamed from `TuxReportRPlot`).
- **TuxVizGrid** — small-multiples layout primitive (2/3/4-up) for
  comparing several embeds or R plots side-by-side.
- **TuxSparkline** — inline mini trend line, no axes; pairs with
  `TuxBigStat` / `TuxFactoid` for KPI rows.

Plus the chat-primitive batch (TuxChatMessage · TuxCitations ·
TuxComposer · TuxConversationList · TuxContextPanel).
