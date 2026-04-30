# ADR 0008 — Data-display stays flat; reports + visualizations are separate sections

- **Date**: 2026-04-28
- **Status**: Accepted (revised 2026-04-28: split Reports from
  Visualizations after first review surfaced that TTI uses the two
  words for distinct things)

## Context

A handful of components in the catalog look like they belong together
under a "data" or "reports" umbrella: TuxBigStat, TuxFactoid,
TuxTreemap, TuxDescriptionList, TuxTable. The argument is that they're
all "display the numbers" components and naming-wise feel like a family.

Separately, the design-kit port (2026-04-28, see `CHANGELOG.md`)
introduced two related but *distinct* surfaces:

- **Reports** — paper / PDF / print. Finished narratives meant to be
  read top-to-bottom. The toolkit: `TuxReportFrame` (page chrome) and
  `TuxReportPrintSheet` (print stylesheet).
- **Visualizations** — interactive data surfaces (BI dashboards, R
  artifacts, future native charts). The reader pivots and filters
  rather than reading top-to-bottom. The toolkit: `TuxVizEmbed`
  (Tableau / Power BI / Superset / Grafana iframe wrapper) and
  `TuxVizRPlot` (R artifact wrapper).

The first cut of this batch lumped all four under one "Reports"
section. First review pushed back: at TTI, *reports* and
*visualizations* are different deliverables with different
audiences. Sponsored-research quarterlies, IRB submissions, and
accreditation packages are reports. Tableau dashboards, Grafana
boards, Power BI exec overviews, and R-rendered facet plots are
visualizations. Conflating them buried the institutional vocabulary.

Three questions to resolve:

1. Should TuxBigStat / TuxFactoid / TuxTreemap / TuxDescriptionList
   move into a new `app/components/reports/` folder?
2. Where do the new report + viz components live, and how do they
   relate to the data-display family?
3. Reports and visualizations — one section or two?

## Decision

**TuxBigStat, TuxFactoid, TuxTreemap, TuxDescriptionList, and TuxTable
stay flat in `app/components/` as general-purpose display primitives.**

**The deliverables-shaped components live flat in `app/components/`**
— naming, file-system shape, and Vue auto-import work the same as
every other `Tux*`. **What's different is route layout: there are
two new route groups, `/reports/` and `/visualizations/`, each with
its own landing and per-component demos.** Two matching sidebar
groups land between "Composition" and "Tooling".

The split:

- **`/reports/`** → `TuxReportFrame` (page chrome) +
  `TuxReportPrintSheet` (print stylesheet). Both are about
  *delivering paper*.
- **`/visualizations/`** → `TuxVizEmbed` (BI iframe wrapper) +
  `TuxVizRPlot` (R artifact wrapper). Both are about *embedding
  interactive data surfaces*. Future native chart components
  (`TuxChartBar`, `TuxChartLine` — see `design/roadmap.md`
  Priority B) will land in the same section.

The earlier `TuxReportEmbed` and `TuxReportRPlot` names were renamed
to `TuxVizEmbed` and `TuxVizRPlot` to match the section vocabulary.

## Why keep data-display flat

Looking at where the four candidates already appear:

- **`/examples/pecan-dashboard`** — BigStat (header hero) + Factoid
  (3-up stats) + Treemap (budget) + DescriptionList (metadata).
- **`/examples/research-landing`** — BigStat (hero) + Factoid
  (achievements row).
- **`/examples/tti-ai-studio-session`** — DescriptionList (session
  metadata) + Factoid (usage).
- **tti-ai-chat kit** — BigFigure (React analog of BigStat) sits in
  the conversation context panel for corpus + usage stats.

These aren't "report" components — they're general display primitives
that happen to show up in dashboards, landings, and chat panels alike.
Splitting them into a `reports/` folder would:

- Fragment discoverability — a developer building a chat side-panel
  shouldn't have to think "is this a reports component?"
- Force decisions on edge cases — TuxTable is used for "exact tabular
  numbers" everywhere, and TuxDescriptionList is used for both
  metadata tables and compliance event details.
- Add zero functional value — file location doesn't change behavior.

## Why give reports and visualizations their own route groups

These components are different in kind from TuxBigStat:

- **Deliverable-specific chrome.** TuxReportFrame draws an 8.5×11
  sheet on screen and goes borderless under `@media print` —
  different mental model from "fits in a flexible Vue layout."
  TuxVizEmbed carries a provider chip, sandbox config, and a poster
  fallback for when the live tenant isn't reachable. TuxVizRPlot
  has a source-line caption gutter for `sessionInfo()`. None of
  this fits the chrome the rest of the catalog ships with.
- **Discoverability follows institutional vocabulary.** A
  research-IT staffer asking "how do I produce a quarterly
  report?" wants Frame + PrintSheet on one landing. A staffer
  asking "how do I embed our Tableau corridor dashboard?" wants
  Embed + RPlot on a different landing. Lumping them buries the
  fact that TTI uses these words for different things.

Keeping the components flat in `app/components/` means auto-import
works as usual (`<TuxReportFrame>`, `<TuxVizEmbed>` from anywhere)
while the route grouping and sidebar groups surface the sections
in the IA.

## When to add another route group

Use this same pattern (flat components, grouped routes) when a family:

1. Carries chrome that's awkward in normal page composition.
2. Has a discoverability story stronger than "I want a button."
3. Has at least four members so the grouping is worth its weight.

Don't do it speculatively — three components plus a tile-of-tiles is
cheaper as a `/components/<kebab>` page with cross-links.

## Decision criteria — Components vs. Reports vs. Visualizations

When adding a new component, ask in this order:

1. **Would a developer composing a generic page reach for this
   first?** (e.g., a button, a card, a stat block, a description
   list.) → **Component.** Sidebar group "Components", route
   `/components/<kebab>`.

2. **Does it deliver a finished narrative meant to leave the app
   on paper or as a PDF?** (Page chrome, print stylesheet, page
   numbers, paper sizes.) → **Report.** Sidebar group "Reports",
   route `/reports/<kebab>`.

3. **Does it embed or render an interactive data surface that
   stays inside the app?** (BI iframe, R artifact, future
   native chart.) → **Visualization.** Sidebar group
   "Visualizations", route `/visualizations/<kebab>`.

If the answer to (1) is yes, stop — don't double-classify. A stat
block lives in `/components/big-stat` even if it ends up being
rendered inside both a Report and a Visualization.

## Consequences

- New folders: `app/pages/reports/` (index + 2 demos) and
  `app/pages/visualizations/` (index + 2 demos).
- Two new sidebar groups: "Reports" then "Visualizations" between
  "Composition" and "Tooling".
- All four deliverable components stay flat in `app/components/`,
  prefixed `Tux*` like everything else.
- TuxBigStat / Factoid / Treemap / DescriptionList / Table stay
  where they are. No migration.
- Future native chart components (`TuxChartBar`, `TuxChartLine`,
  per `design/roadmap.md` Priority B) land in the Visualizations
  section.
- The mid-batch rename (`TuxReportEmbed` → `TuxVizEmbed`,
  `TuxReportRPlot` → `TuxVizRPlot`) is documented in the
  Unreleased CHANGELOG section. No published consumer was on the
  old names yet, so no migration is needed.

## What we considered and rejected

- **Move data-display into `app/components/reports/`.** Would require
  touching every existing example and dashboard import. No functional
  win. Rejected — see "Why keep data-display flat".
- **Put TuxReport\* under `app/components/reports/Tux*.vue`.** Breaks
  Nuxt's flat auto-import without a `components/reports/` config
  override. The route grouping already gives us the IA story; nesting
  the source files just makes imports noisier.
- **No new route group; demo TuxReport\* under `/components/`.**
  Buries the deliverables story. The user explicitly asked for
  reports to be a section, and the four components together are
  enough mass to justify the IA cost.
