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
- ~~**TuxChartLine**~~ — shipped 2026-05-21; native SVG single +
  multi-series, end-of-line value labels (default), optional
  previous-period dashed overlay, optional confidence band, markers,
  auto-derived screen-reader summary. See
  [`/visualizations/chart-line`](../app/pages/visualizations/chart-line.vue).
- **TuxChartScatter** — bivariate scatter for corridor data;
  color-by-category.
- ~~**TuxStatComparison**~~ — shipped 2026-05-21; before/after stat
  block with delta + tone, direct/invert/neutral polarity, three
  layouts (row/stack/inline). Pairs with `TuxBigStat`. See
  [`/components/stat-comparison`](../app/pages/components/stat-comparison.vue).
- ~~**chart-foundations doc**~~ — shipped 2026-05-21 as
  [`design/chart-foundations.md`](chart-foundations.md). Palette,
  axis/grid/legend tokens, in-bar vs above value labels, end-of-line
  default, previous-period overlay, confidence bands, brush selector,
  KPI strip composition, accessibility (SR summaries + alt-text
  patterns).

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

- ~~**TuxTabsHorizontal**~~ / ~~**TuxTabsVertical**~~ — shipped
  2026-05-21 as `TuxTabs` (single component, `orientation` prop
  covers both). Wraps `UTabs`; adds maroon active underline + `bold`
  intent for eyebrow-rhythm contexts. See
  [`/components/tabs`](../app/pages/components/tabs.vue).
- ~~**TuxSideSheet**~~ — shipped 2026-05-14 as `TuxSlideover`. Three
  sides (right · left · bottom), built on the native `<dialog>`,
  Batch-J ease-corridor slide animation. See
  [`/components/slideover`](../app/pages/components/slideover.vue).

### Pagination extras — ✅ shipped 2026-05-21

We have basic numbered pagination only — was. Now three more.

- ~~**TuxLoadMore**~~ — shipped 2026-05-21; explicit button with
  remaining count + terminal divider on completion. SEO-friendly
  middle ground between paginated and infinite. See
  [`/components/load-more`](../app/pages/components/load-more.vue).
- ~~**TuxInfiniteScroll**~~ — shipped 2026-05-21; IntersectionObserver
  sentinel + loading state; honors `prefers-reduced-motion` with
  explicit-button fallback. See
  [`/components/infinite-scroll`](../app/pages/components/infinite-scroll.vue).
- ~~**TuxResultCount**~~ — shipped 2026-05-21; "Showing 1–24 of 412
  corridors · 24 per page." Pairs with any of the three pager
  components. See
  [`/components/result-count`](../app/pages/components/result-count.vue).

---

## Priority D — Content patterns

### Comments & feedback

- **TuxCommentThread** — peer-review / editorial-comment threads with
  reply, resolve, mention.
- ~~**TuxReactionBar**~~ — shipped 2026-05-21; light-touch
  acknowledgement strip (helpful · question · disagree default, fully
  configurable). v-modeled active reactions + display-only counts.
  See [`/components/reaction-bar`](../app/pages/components/reaction-bar.vue).

### Tooltips & help

- ~~**TuxTooltip**~~ — shipped 2026-05-21; wraps `UTooltip`. Adds
  optional title + hairline rule + tuned max-width (~22ch) + shortcut
  glyphs via `kbds`. See
  [`/components/tooltip`](../app/pages/components/tooltip.vue).
- **TuxPopover** — richer floating panel (tooltip with title + body +
  action). Consumers currently compose `UPopover` directly; ship a
  TUX wrapper when a richer-than-tooltip pattern is needed across two
  consumer surfaces.
- ~~**TuxKeyboardShortcuts**~~ — shipped 2026-05-14 as
  `TuxShortcutsHelp`. Modal overlay triggered by `?`, auto-classifies
  combo vs sequence rows, uses `TuxKbd` for every key glyph. Mounted
  globally in `app.vue` alongside the command palette. See
  [`/components/kbd`](../app/pages/components/kbd.vue) for the kbd
  primitive and the shell's `defineShortcuts` block for the wired
  bindings.

---

## Priority E — Foundations & meta

### Accessibility documentation — ✅ shipped 2026-05-21

All four foundation pages live under `/accessibility/*`. Each is
referenced from the [accessibility index](../app/pages/accessibility/index.vue)
with a tile card.

- ~~**`/accessibility/skip-to-content`**~~ — keyboard-first foundations
  page. WCAG 2.4.1 Bypass Blocks; how the skip link is wired, where it
  lands, how to verify.
- ~~**`/accessibility/focus-model`**~~ — visible-focus reference,
  focus-trap behavior in modals/slideovers/popovers, tab-order rules,
  three exceptions (inputs, linked cards, HC theme).
- ~~**`/accessibility/contrast-matrix`**~~ — USWDS-style summary of
  the top 10 token pairs by traffic across light/dark/HC themes.
  Full 282-surface audit at `/contrast-audit`.
- ~~**`/accessibility/breakpoints`**~~ — six-breakpoint scale + the
  container-query preference (ADR-0007) + 200% zoom reflow guarantees.

### Mobile frames

If TTI ships an app, native-feel demo frames help stakeholder reviews.

- **TuxIosFrame** — TTI-themed iPhone frame for screenshots.
- **TuxAndroidFrame** — same for Android.

---

## Polish queue — shipped components

Small follow-ups for components already in the catalog. Each one is
worth less than a fresh component; collect them here so they don't
get lost. Pick from the top when there's a slow afternoon.

- ~~**Wire `TuxTOC` into `TuxReportWebFrame`'s `#toc` slot.**~~ —
  done 2026-05-21. `/reports/web-frame` example now uses
  `<TuxTOC target=".tux-report-web-frame article" />` inside the
  `#toc` slot for IntersectionObserver-driven active-section
  tracking. The fallback (plain anchor list from the `toc` prop)
  still renders when the slot is empty.
- ~~**Refresh `/examples/landscape-dashboard`**~~ — done 2026-05-21.
  Now uses the full sidebar layout + `#aside` slot for the activity
  rail + inline TuxSparkline next to the treemap header + KPI
  deltas in factoid `source` fields.
- ~~**Refresh `/examples/research-landing`**~~ — done 2026-05-21.
  Added a TuxStatComparison year-over-year delta row beneath the
  by-the-numbers factoid; one of the three uses inverted polarity
  (non-compliance going down = success tone).
- **Refresh `/examples/tti-ai-studio-session`** with the same lens —
  most of this page already uses the catalog's chat components
  (TuxChatMessage with #tools, TuxArtifact, TuxBranchNav,
  TuxCitations, TuxContextMeter, TuxComposer). Pending: spot-check
  the message-action row vs the new TuxReactionBar pattern, decide
  whether to swap or leave (current pattern matches the documented
  Conventions exactly).

---

## Recently shipped — platform-aware Tauri build (2026-05-22)

User shifted TUX target from web-only to **Tauri desktop shells on
Windows / macOS / Linux** plus future Tauri Mobile (iOS / Android).
Doctrine doc + 8 components + 2 composables + 1 CSS utility +
safe-area support landed in one sprint. Held the line on 5 visual-
language rejections (Liquid Glass surface, Mica wholesale, Material
tonal palette, elevation-as-color, SF Symbols).

**Doctrine:**

- **[`design/platform-awareness.md`](./platform-awareness.md)** —
  "One component tree, platform-adaptive at the chrome layer." Two-
  layer mental model; 8 dimensions of variation.

**Foundations:**

- **useTuxPlatform()** — composable; sets `[data-platform]` on
  `<html>`.
- **tux-scrollbar.css** — per-platform scrollbar styles.
- **Safe-area-inset CSS** on `default.vue` + `sidebar.vue`.

**Components shipped:**

- **TuxAppFrame** — custom Tauri titlebar with platform-correct
  controls.
- **TuxFocusView** — full-viewport content overlay (Teams Stage
  view analog).
- **TuxMenuBar** — in-window File/Edit/View menu for Win/Linux.
- **TuxSplashScreen** — branded app-launch overlay.
- **TuxTabBar** — bottom-anchored 3-5 mobile tabs with maroon
  top-edge active rule.
- **TuxFAB** — Floating Action Button (Material pattern).

**Composables shipped:**

- **useTuxSwipe** — pointer/touch swipe with directional callbacks.
- **useTuxRipple** — Material tap-feedback ripple, opt-in only.

**Enhancements:**

- **TuxKbd** — extended for Super (Linux) / Win (Windows) keys
  via `useTuxPlatform()`.
- **TuxModal** — `size` prop + `variant: 'standard' | 'sheet' |
  'auto'` (mobile sheet from iOS/M3 patterns).

### Still on the platform-aware roadmap (deferred to consumer pull)

- **TuxAppSwitcher** — waffle button + popover grid for hopping
  between TTI consumer apps (Landscape ↔ tti-ai-studio ↔ future).
  Source: Microsoft Fabric "Suite header."
- **TuxSplitPane** — in-page master-detail layout with URL-bound
  selection. Source: Microsoft Fabric "Multiview."
- **TuxChartGauge** — 270° arc with needle. Source: Microsoft Teams
  data viz inventory. Defer; research dashboards rarely use gauges.
- **`design/tauri-bindings.md`** — companion doc enumerating which
  TUX components call which Tauri APIs (share sheet, native
  notification, file dialog) and the web fallback path.

---

## Recently shipped — Figma absorption pass (2026-05-19 / 2026-05-20)

Sequenced absorption of seven high-signal Figma reference systems
(Windows UI kit, Aggie UX, shadcn_ui Jan 2026, Vercel AI Elements,
Primer Web, Microsoft Fluent 2 Web, Backstage). "Absorb the thinking,
skip the chrome" — most findings confirmed TUX's architecture; the
rest landed as net-new components, a layout, build-pipeline additions,
and one MDC infrastructure fix. Per-file findings cached under
[`reference/figma-cache/`](../reference/figma-cache/); each NOTES.md
records the skip/absorb/tension/decisions framework.

### New components (8)

- ~~**TuxSuggestionChips**~~ — horizontal prompt chip row (Vercel)
- ~~**TuxBranchNav**~~ — `‹ N of M ›` response-alternative nav (Vercel)
- ~~**TuxInlineCitation**~~ — academic `[N]` pill + hover popover (Vercel)
- ~~**TuxContextMeter**~~ — token-utilization badge + cost popover (Vercel)
- ~~**TuxArtifact**~~ — container for AI-generated output (Vercel)
- ~~**TuxRemovableChip**~~ — dismissible chip primitive (Primer)
- ~~**TuxInfoLabel**~~ — form-field label + `(i)` help popover (Fluent 2)
- ~~**TuxTeachingPopover**~~ — onboarding/guided-tour tooltip (Fluent 2)

### Enhancements (5)

- ~~**TuxCodeBlock**~~ gained a download button + filename resolution
- ~~**TuxEmptyState**~~ gained `compact` (Primer) + `kind` preset library
  with 5 named cases (Backstage)
- ~~**TuxChatMessage**~~ gained a `#header-trailing` slot surfaced by
  dogfooding the `tti-ai-studio-session.vue` refactor
- ~~**TuxFilterPanel**~~ refactored to consume `TuxRemovableChip`
- ~~**sidebar.vue layout**~~ rewritten on `UDashboardGroup` +
  `UDashboardSidebar` + `UDashboardPanel`; new demo example at
  [`/examples/sidebar-shell`](../app/pages/examples/sidebar-shell.vue)

### Build pipeline + infrastructure

- ~~**Breakpoint tokens**~~ — `breakpoint` block in `design/tokens.json`
  + `@theme --breakpoint-*` in `globals.css`. Sourced from Microsoft's
  Windows UI kit responsive ladder, rebased to TUX's editorial widths.
- ~~**LaTeX math in MDC**~~ — `remark-math` + `rehype-katex` + KaTeX
  CSS imported globally. `$inline$` and `$$display$$` now render in
  any markdown surface.
- ~~**MDC component resolution fix**~~ — `nuxt.config.ts` now sets
  `components: [{ ..., global: true }]` so `::tux-alert{...}` and other
  Tux\* embeds in markdown actually resolve at runtime. Closes a
  long-standing `[Vue warn]: Failed to resolve component: TuxAlert`
  that fired on every markdown render.

### Conventions

Added "Conventions" section to
[`design/components.md`](components.md) with two documented standards:

- ~~**Chat-message actions**~~ — standard 5-icon set for
  `TuxChatMessage` `#tools`: Copy / Regenerate / Share / Helpful / Off
- ~~**Form validation — when to use which**~~ — decision tree across
  inline field error / inline form summary / blocking dialog / page
  banner / toast

### Carry-forwards

Deferred-with-criterion items (in NOTES.md follow-ups; build when a
consumer surface forces the question):

- `TuxSegmentedControl` (Primer) — only if URadioGroup-as-buttons
  doesn't compose cleanly for a real surface
- `TuxCommentBox` (Primer) — markdown editor with toolbar; bigger
  build, deferred to tti-ai-studio drafting/annotation context
- `TuxSparkline.autoTone` (Backstage) — auto-color by trend direction;
  ~10 LOC if any consumer needs it
- TuxDataTable cross-check against Primer's 17 frames + Fluent 2's
  variant matrix when next material update lands
- `TuxChatMessage` vs `UChatMessage` dead-code audit — verify the TUX
  wrapper still adds TTI-specific value once dust settles

**Medium-signal pass (2026-05-21):** Charts UI Kit + Data Viz Graphs
+ Data Table + Snow Dashboard + Empty State Illustration Kit absorbed.
Net new: **0 components shipped, 1 doc stance added** (no decorative
illustrations in `TuxEmptyState`). New deferred-with-criterion items:

- **TuxChartLine** (Priority B): default end-of-line value labels
  colored to match series; support `withBrush` / `#range` slot for
  time-series scrubbing; support `series.previous` overlay + tooltip
- **TuxChartBar** (Priority B): `valuePlacement: "in-bar" | "above" |
  "auto"` prop (auto: bar pixel-height ≥ 24px → in-bar); support a
  `comparison` series with muted fill for projection-vs-actual
- **TuxChartArea** (Priority B): stacked variant; KPI strip
  composed above by parent template, not baked in
- **TuxRuleBuilder** (new, Priority B candidate): relational query UI
  (`field + op + value` rows, AND/OR groupers). Pairs with the
  existing faceted `TuxFilterPanel`. ~400 LOC + 4 days. Build only
  when a Landscape research-dashboard surface forces the question.
- **TuxRichDataGrid: per-column `headerMenu` slot** for sort / hide /
  pin / filter from the column header (Snow + data-table kit)
- **TuxRichDataGrid: inline column-header filter popover** as a
  second filter mode alongside `TuxFilterPanel`
- **`sidebar.vue`: `#aside` slot** for an optional right rail
  (notifications + activities). Defer until two surfaces request it.
- **`chart-foundations.md` doc** — series palette, axis/grid/legend
  tokens, accessibility (alt-text + screen-reader summaries),
  in-bar vs above value-label decision, brush/previous-period
  patterns. Ship alongside the first TuxChart\* component.
- **"Faceted vs relational filtering — when to use which"** in
  `design/components.md` Conventions, once `TuxRuleBuilder` is on
  the roadmap.

**AI-studio chat-surface pass (2026-05-21):** Chat UI kit + Chat
Input Box + ChatGPT UI Kit + MCP Apps for Claude absorbed. Net new:
**0 components shipped.** The chat surface was saturated after the
prior Vercel AI Elements + Fluent 2 + Primer pass. New deferred-
with-criterion items, mostly anchored on a future MCP integration
in tti-ai-studio:

- **`TuxMcpEmbed`** (new, ~150 LOC) — thinner artifact variant for
  *interactive* third-party app output. Anatomy: app icon + name +
  collapse caret + expand + exit X + skeleton + container slot.
  Build when tti-ai-studio adopts MCP. Sister to `TuxArtifact`,
  not a replacement.
- **`TuxCardCarousel`** (new, ~200 LOC, Priority B candidate) —
  horizontal scroll of cards with prev/next + optional pagination
  dots. Re-opens the carousel question we deferred in the shadcn
  absorption — MCP integration is the trigger. Also useful for
  featured-projects / image galleries.
- **MCP three-tier display taxonomy** ("inline card / inline
  carousel / full screen") — document in `design/components.md`
  Conventions when MCP build starts. Captures the decision tree
  before the components ship.
- **`TuxComposer.cancelable`** (carry-forward, defer) — when a
  consumer wraps TuxComposer in a modal and wants explicit
  `[Cancel] [Send]` pair. Build only when forced.
- **First-run AI-surface taxonomy** ("Examples / Capabilities /
  Limitations") — document in `design/components.md` Conventions
  when a consumer surface needs richer first-run framing than
  `TuxEmptyState kind="first-run"`. Compose with TuxFactoid 3-up
  or 3-up TuxCard grid; no new component.

---

## Recently shipped — PECAN → Landscape rebrand (2026-05-21)

The downstream consumer formerly named **PECAN** is now **Landscape**.
TUX touched ~50 files across pages, components, kits, and design docs;
historical record (CHANGELOG, ADRs) was left intact by design.

**Renamed:**
- `app/pages/examples/pecan-dashboard.vue` → `landscape-dashboard.vue`
  (file + route `/examples/landscape-dashboard` + body text + nav entry
  in `app/app.vue` + index card in `app/pages/examples/index.vue`)
- `public/kits/pecan/` → `public/kits/landscape/` (folder + README +
  AppShell + Pages.jsx + index.html; `app/pages/kits.vue` slug + label)

**Prose updated** (first mention per file uses "Landscape (formerly
PECAN)" for continuity; later mentions are bare "Landscape"):
- `README.md`, `design/components.md`, `design/roadmap.md`
- ~30 showcase pages under `app/pages/` (components, examples, forms,
  visualizations, reports, kits)
- 10 component JSDoc blocks (TuxDescriptionList, TuxCodeBlock,
  TuxFilterPanel, TuxPagination, TuxTeachingPopover, TuxTreemap,
  TuxSearch, TuxSiteNav, TuxRichDataGrid, TuxFooter)
- Top-of-file comments in `nuxt.config.ts`, `app/app.vue`,
  `app/layouts/sidebar.vue`
- All `public/kits/aggieux/*.jsx` demo content (banners default
  `productName`, footer demo text, breadcrumbs, overlays)

**Leave alone (historical record, by design):**
- `CHANGELOG.md` — entries refer to the project under its name at the
  time the entry was written. Don't rewrite history.
- `docs/adr/*.md` — architectural decisions reference the name as it
  was when the decision was made.

**Composition refresh shipped alongside:** `landscape-dashboard.vue`
was rebuilt on the sidebar layout (left-rail nav with brand lockup +
two nav groups + user chip) and gained a KPI row with delta-vs-
previous readings, an inline ingest-rate sparkline next to the
treemap section header, and a right-rail aside composing Recent-
activity + Active-agents tiles. Composes ~15 Tux\* + Nuxt UI 4
primitives. Per the Snow Dashboard absorption notes
(`reference/figma-cache/snow-dashboard-ui-kit/NOTES.md`). No new
components — the right rail is a host-driven grid, not a layout
slot. The `sidebar.vue#aside` slot carry-forward waits for a second
consumer surface before being formalized.

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
pulled in because Landscape-class consumers needed them.

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
