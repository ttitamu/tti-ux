# Data table design components. Free UI Kit (Community)

**Source:** Figma file `i00AZzJgOdprJhZxTS70Mg`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-21
**Priority:** medium
**Status:** absorbed — 1 carry-forward (rule-builder pattern)

![cover](./cover.png)

## What it is

A focused data-table kit (17 showcase frames + 30 components) that
documents one product surface — a "Cross-channel analysis" table —
through every state: sort open, column filter panel, row hover, row
menu, rule-builder (multi-row condition UI), embedded vs full-screen.
Renders inspected in `tables/`.

## Pages (3)

- `17:51400` — cover _(skip — author bio)_
- `0:1` — tables & showcases _(17 frames; the real content)_
- `17:51399` — components _(30 frames; design tokens + atoms)_

## Frames inspected

`tables/`:
- `01-base-table-sorting.png` — baseline with sort indicator on `Time`
- `02-base-table-sorting-open.png` — column header opens a dropdown
  with sort-asc / sort-desc / filter / hide / pin options
- `05-col-filter-panel.png` — **inline column-header filter popover**
  (the column header opens a value-selection panel beneath it)
- `07-row-hover.png` — row hover with inline `Cancel`/`Apply` buttons
  on an edited cell
- `08-row-menu.png` — row kebab opens a small menu (Save current,
  Export current) plus the active-filter chip strip above
- `09-rule-builder-multiple.png` — **multi-row condition builder**
  (Name + contains + value; Metric + exactly matches + value; AND/OR
  groupers) — this is the standout artifact
- `filters-palette.png` — palette of all filter affordances across
  the kit (single-row suggestion, list mode, list+sort,
  dynamic embedded filter panel)

## Existing TUX surface (audit before proposing)

- **`TuxTable`** — thin UTable wrap with maroon header
- **`TuxDataTable`** — research-flavored, static, for finished
  deliverables (papers, reports, appendices). Sort is host-driven.
- **`TuxRichDataGrid`** — interactive grid for operational +
  research-dashboard (PECAN-class) apps. Already has: toolbar +
  search + filter / columns / export buttons, **active-filter chip
  strip** (TuxRemovableChip), bulk-action bar, sticky header,
  sortable columns, row selection, expandable rows, pagination.
  State is host-driven.
- **`TuxFilterPanel`** — sidebar/horizontal filter UI consuming
  `TuxRemovableChip`.

The active-filter chip strip + sortable-header + bulk-actions trio
already covers about 70% of what this Figma kit shows. The remaining
30% has one genuinely new pattern (rule builder) and several minor
affordances.

## Skip

- **Their visual character** (loose grid, low-contrast headers,
  cobalt-blue hover tint). TUX uses maroon focus ring + warm-neutral
  surfaces + tabular figures throughout. Not absorbing the chrome.
- **Their two-theme split** ("Brutal theme" vs "Light"). TUX has
  Light / Dark / High-Contrast via tokens; no need for a third.
- **Cell-level inline edit + Cancel/Apply buttons.** Out of scope
  for TUX — we're a design-system layer, not a spreadsheet UI.
  If a consumer needs it, the host wires it into `cell-<key>` slot.
- **The kebab-pinned row menu floating to the right of the row.**
  TuxRichDataGrid already supports per-row actions via slot; the
  specific kebab placement is a host decision.

## Absorb

1. **Column-header dropdown unifying sort / filter / hide / pin.**
   `02-base-table-sorting-open.png` shows the column header itself
   opening a small menu. Today **TuxRichDataGrid** has only a
   sortable header (click toggles direction). Adding a `headerMenu`
   per-column hook would let consumers expose hide/pin/filter from
   the same surface. **Defer the build** — capture as roadmap
   follow-up; this is a multi-day component with a lot of
   prop-surface design (overlap with column-resize, column-pinning
   in UTable v5).

2. **Inline column-header filter popover.** `05-col-filter-panel.png`
   anchors a value-picker beneath the header. TuxRichDataGrid today
   delegates filtering to a separate `TuxFilterPanel`. Anchoring
   filters to the column header is **another mode**, not a
   replacement — useful when "what values are in this column?" is
   the question. **Defer**: capture as roadmap follow-up.

3. **Rule builder (multi-row condition UI).** `09-rule-builder-
   multiple.png` shows 3 rows of `field + operator + value` with
   AND/OR groupers. This is the standout pattern. TUX has no
   equivalent today; **`TuxFilterPanel` is faceted (checkboxes,
   ranges)**, not relational. Real consumer fit: Landscape
   (formerly PECAN) research dashboards where users compose
   ad-hoc queries against trip-level data. **This is a roadmap
   candidate** — capture below; **do not ship now** (component is
   a ~400 LOC typed-state surface; needs a real consumer
   requirement before shape can settle).

## Tension

- **Faceted vs relational filtering.** TUX's current model is
  facets — pick-from-set, no operators. Real research workflows
  often want `metric > 0.7 AND date IN (last 30 days)`. These two
  models are complementary, not competing — facets for discovery,
  rules for query. The decision when to use which would belong in
  the existing "Form validation — when to use which" sibling doc
  pattern. **Don't conflate them in one component.**
- **Inline column filter vs sidebar panel.** Inline is great when
  the user wants to filter one column quickly; sidebar wins when
  multiple cross-column filters are active. TuxRichDataGrid should
  probably support both modes long-term; today it only has
  sidebar/horizontal.

## Decisions

- **No new components built in this pass.** TUX's existing
  Table / DataTable / RichDataGrid / FilterPanel triad covers
  the bulk of patterns; the gaps need real consumer requirements
  before they can land cleanly.
- **Three roadmap follow-ups recorded** (column-header menu, inline
  column-filter, rule builder) — written into Open follow-ups below
  and ready to surface in `design/roadmap.md` if Landscape pushes.
- **Re-affirm host-driven state model.** Both Figma frames keep
  state in the host (sort key, filter values, selection). TUX's
  current API matches; no drift.

## Open follow-ups

- **TuxRichDataGrid: per-column `headerMenu` slot.** Lets consumers
  expose sort / hide / pin / filter from the column header. Defer
  until a Landscape dashboard surface requires column hiding.
- **TuxRichDataGrid: inline column-header filter popover** as a
  second filter mode alongside `TuxFilterPanel`. Defer until a
  consumer surface needs "filter this one column without leaving
  the table."
- **TuxRuleBuilder** (new component, roadmap Priority B candidate)
  — relational query UI (`field + operator + value` rows, AND/OR
  groupers, parens). Pairs with TuxFilterPanel (faceted). Build
  only when Landscape forces the question; estimate ~400 LOC +
  4 days incl. accessibility + keyboard navigation + showcase.
- Document **"Faceted vs relational filtering — when to use which"**
  in `design/components.md` Conventions section once
  TuxRuleBuilder is on the roadmap.
