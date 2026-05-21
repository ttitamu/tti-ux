# Components

The live style guide is the authoritative component reference. Every
component ships with a runnable showcase route under `/components/*`
that demonstrates props, variants, and rendered output side-by-side
with the Vue source.

Run the style guide:

```sh
npm run dev
# → http://localhost:3030/components
```

## What ships today

| Component            | Wraps                    | Route                           |
| -------------------- | ------------------------ | ------------------------------- |
| `TuxAccordion`       | tux native               | `/components/accordion`         |
| `TuxAlert`           | `UAlert`                 | `/components/alert`             |
| `TuxAlphaNav`        | tux native               | `/components/alpha-nav`         |
| `TuxAnnouncementBanner` | tux native            | `/components/announcement-banner` |
| `TuxArtifact`        | tux native               | `/components/artifact`          |
| `TuxBadge`           | `UBadge`                 | `/components/badge`             |
| `TuxBetaRibbon`      | tux native               | `/components/beta-ribbon`       |
| `TuxBigStat`         | tux native               | `/components/big-stat`          |
| `TuxBlockquote`      | tux native               | `/components/blockquote`        |
| `TuxBranchNav`       | tux native               | `/components/branch-nav`        |
| `TuxBreadcrumbs`     | tux native               | `/components/breadcrumbs`       |
| `TuxButton`          | `UButton`                | `/components/button`            |
| `TuxCallout`         | tux native               | `/components/callout`           |
| `TuxCaptionedMedia`  | tux native               | `/components/captioned-media`   |
| `TuxCard`            | tux native               | `/components/card`              |
| `TuxCardCarousel`    | `UCarousel` (embla) wrap | `/components/card-carousel`     |
| `TuxCardSlab`        | tux native               | `/components/card-slab`         |
| `TuxCookieConsent`   | tux native               | `/components/cookie-consent`    |
| `TuxChatMessage`     | tux native               | `/components/chat-message`      |
| `TuxCitations`       | tux native               | `/components/citations`         |
| `TuxCodeBlock`       | Shiki                    | `/components/code-block`        |
| `TuxCodeMaroon`      | tux native               | `/components/code-maroon`       |
| `TuxCommandPalette`  | tux native               | `/components/command-palette`   |
| `TuxContactCard`     | tux native               | `/components/contact-card`      |
| `TuxContextMeter`    | `UPopover`               | `/components/context-meter`     |
| `TuxContextPanel`    | tux native               | `/components/context-panel`     |
| `TuxConversationList`| tux native               | `/components/conversation-list` |
| `TuxComposer`        | tux native               | `/components/composer`          |
| `TuxCTA`             | tux native               | `/components/cta`               |
| `TuxDataTable`       | tux native               | `/components/data-table`        |
| `TuxDescriptionList` | tux native               | `/components/description-list`  |
| `TuxDiagram`         | Mermaid                  | `/components/diagram`           |
| `TuxDocsSidebar`     | tux native               | `/components/docs-sidebar`      |
| `TuxDropdown`        | tux native               | `/components/site-nav`          |
| `TuxEmptyState`      | `TuxCard` composite      | `/components/empty-state`       |
| `TuxErrorPage`       | tux native               | `/components/error-page`        |
| `TuxExample`         | showcase primitive       | (used on every component page)  |
| `TuxFactoid`         | tux native               | `/components/factoid`           |
| `TuxFilterPanel`     | tux native               | `/components/filter-panel`      |
| `TuxFooter`          | tux native               | `/components/footer`            |
| `TuxIconFeature`     | tux native               | `/components/icon-feature`      |
| `TuxIdentity`        | tux native               | `/components/identity`          |
| `TuxInfoLabel`       | `UPopover`               | `/components/info-label`        |
| `TuxInlineCitation`  | `UPopover`               | `/components/inline-citation`   |
| `TuxKbd`             | tux native               | `/components/kbd`               |
| `TuxLinkList`        | tux native               | `/components/link-list`         |
| `TuxLinkSlab`        | tux native               | `/components/link-slab`         |
| `TuxMediaSlab`       | tux native               | `/components/media-slab`        |
| `TuxMegaMenu`        | tux native               | `/components/site-nav`          |
| `TuxModal`           | `UModal`                 | `/components/modal`             |
| `TuxNewsCollection`  | tux native               | `/components/news-collection`   |
| `TuxPageHeader`      | tux native               | `/components/page-header`       |
| `TuxPagination`      | tux native               | `/components/pagination`        |
| `TuxPhotoGrid`       | tux native               | `/components/photo-grid`        |
| `TuxProse`           | tux native               | `/components/prose`             |
| `TuxQACollection`    | tux native               | `/components/qa-collection`     |
| `TuxRemovableChip`   | tux native               | `/components/removable-chip`    |
| `TuxRichDataGrid`    | tux native               | `/components/rich-data-grid`    |
| `TuxSearch`          | tux native               | `/components/search`            |
| `TuxSectionHeader`   | tux native               | `/components/section-header`    |
| `TuxSidebarBlock`    | tux native               | `/components/sidebar-block`     |
| `TuxSignupFeature`   | tux native               | `/components/signup-feature`    |
| `TuxSiteNav`         | tux native               | `/components/site-nav`          |
| `TuxSkeleton`        | tux native               | `/components/skeleton`          |
| `TuxSlideover`       | tux native               | `/components/slideover`         |
| `TuxStepper`         | tux native               | `/components/stepper`           |
| `TuxStatComparison`  | tux native               | `/components/stat-comparison`   |
| `TuxSuggestionChips` | tux native               | `/components/suggestion-chips`  |
| `TuxTable`           | `UTable`                 | `/components/table`             |
| `TuxTabs`            | `UTabs`                  | `/components/tabs`              |
| `TuxTeachingPopover` | tux native               | `/components/teaching-popover`  |
| `TuxTestimonial`     | tux native               | `/components/testimonial`       |
| `TuxTOC`             | tux native               | `/components/toc`               |
| `TuxTooltip`         | `UTooltip`               | `/components/tooltip`           |
| `TuxTree`            | tux native               | `/components/tree`              |
| `TuxTreemap`         | tux native               | `/components/treemap`           |

**Pagination + result-display family** (added 2026-05-21):

| Component            | Stack                    | Showcase                        |
|----------------------|--------------------------|---------------------------------|
| `TuxResultCount`     | tux native               | `/components/result-count`      |
| `TuxLoadMore`        | tux native               | `/components/load-more`         |
| `TuxInfiniteScroll`  | tux native               | `/components/infinite-scroll`   |
| `TuxReactionBar`     | tux native               | `/components/reaction-bar`      |

**Native chart family** (Priority B):

| Component            | Stack                    | Showcase                        |
|----------------------|--------------------------|---------------------------------|
| `TuxChartLine`       | tux native SVG           | `/visualizations/chart-line`    |

### Reports section

Finished-narrative deliverables — paper, PDF, print, or web-hosted
long-form. The reader reads top-to-bottom; they don't pivot or
filter. Components live in `app/components/` like everything else,
but demos live under `/reports/<kebab>` (with a landing at
`/reports`).

| Component             | Wraps                    | Output medium    | Route                       |
| --------------------- | ------------------------ | ---------------- | --------------------------- |
| `TuxReportFrame`      | tux native               | paper · PDF      | `/reports/frame`            |
| `TuxReportPrintSheet` | `useHead` injection      | print stylesheet | `/reports/print-sheet`      |
| `TuxReportWebFrame`   | tux native               | web (HTML page)  | `/reports/web-frame`        |

### Visualizations section

Interactive data surfaces — BI dashboards, R artifacts, native
charts. The reader pivots, filters, drills in. Same pattern as
Reports (flat components, grouped routes), but a different section
because the chrome and posture are different (provider chip,
sandbox, source caption).

| Component             | Wraps                                  | Route                          |
| --------------------- | -------------------------------------- | ------------------------------ |
| `TuxVizEmbed`         | sandboxed `<iframe>` + poster fallback | `/visualizations/embed`        |
| `TuxVizRPlot`         | `<img>` / `<object>` / `<iframe>`      | `/visualizations/rplot`        |
| `TuxVizGrid`          | tux native (CSS Grid layout shell)     | `/visualizations/grid`         |
| `TuxSparkline`        | tux native (inline SVG)                | `/visualizations/sparkline`    |
| `TuxChartFrame`       | tux native (editorial wrapper)         | (used by `/visualizations/*` showcase pages) |
| `TuxChartGeographic`  | tux native (5-kind Texas map)          | `/visualizations/chart-geographic` |
| `TuxChartSunburst`    | tux native (two-ring radial)           | `/visualizations/chart-sunburst`   |
| `TuxMetroInset`       | tux native (neighborhood grid)         | (used by `/visualizations/chart-geographic`) |

See [ADR-0008](../docs/adr/0008-data-display-and-reports-section.md)
for the positioning rationale (why data-display stays flat in
`/components/`, why Reports and Visualizations get their own sections,
and the criteria for adding a future route group).

The showcase pages expose **Vue** (template source), **HTML** (rendered
DOM), and — where applicable — **Source** (the component SFC) tabs via
the `TuxExample` primitive.

## Pattern coverage — "want X? use Y"

If you're about to build something, check this map first. The catalog
covers more than the file names suggest, and shipping a duplicate
component because the existing one had a non-obvious name is the
single most common failure mode.

| Want… | Use… |
|---|---|
| **Tag** (mono-font label chip — `topic:safety`, `pii:us_ssn`) | `<TuxBadge kind="tag">` |
| **Status pill** (live/running/failed/queued + dot) | `<TuxBadge :status="…">` |
| **Classification tier** (Public / Internal / Restricted / ITAR) | `<TuxBadge :tier="…">` |
| **Count badge** (`md (11)` facet count) | `<TuxBadge kind="count" :count="…">` |
| **Page-level admonition** (Docusaurus-style note/tip/warning/danger) | `<TuxAlert variant="…">` — 8 variants |
| **Compliance alert** (ITAR / export-controlled / legal callout) | `<TuxAlert variant="compliance">` |
| **Inline body callout** (single-paragraph aside in flowing prose) | `<TuxCallout kind="fact|stat|quote">` |
| **Standalone pull quote** (focal element, attribution + rules) | `<TuxBlockquote>` |
| **Long-form Q&A** (always-expanded explainer prose) | `<TuxQACollection>` |
| **FAQ** (collapsible question/answer for scanning) | `<TuxAccordion kind="faq">` |
| **Code block in a doc / blog / ADR** | `<TuxCodeBlock>` |
| **Code in a component-demo flow** (Vue + HTML reveal tabs) | `<TuxExample>` |
| **Term/definition list** (event details, file metadata, spec list) | `<TuxDescriptionList>` |
| **Architecture diagram** (boxes + arrows, decision flows) | `<TuxDiagram>` (Mermaid) |
| **Markdown content with Tux components inline** | `@nuxtjs/mdc` + auto-import (see `/markdown` demo) |
| **Form input** (email / select / radio / etc.) | Nuxt UI native — `UInput`, `USelect`, etc. See `/forms`. |
| **Data table** (sortable, virtualizable, status cells) | `<TuxTable>` |
| **Sortable / selectable / expandable data grid** (Landscape-class operational lists with bulk actions, active-filter chips, row expansion) | `<TuxRichDataGrid>` |
| **Static research table** (numbered caption, ± CI uncertainty, footnotes, source citation, optional totals row) | `<TuxDataTable>` |
| **Search bar** (Landscape finder, conversation search) | `<TuxSearch>` |
| **A–Z directory jump bar** | `<TuxAlphaNav>` |
| **Sidebar widget wrapper** (related links, contact box, in-page nav) | `<TuxSidebarBlock>` |
| **Newsletter signup** | `<TuxSignupFeature>` |
| **Big oversized stat** (single headline metric) | `<TuxBigStat>` |
| **Row of oversized stats** ("by the numbers" 3/4/5-up) | `<TuxFactoid>` |
| **Tiny inline trend** (no axes, beside a stat) | `<TuxSparkline>` |
| **Loading placeholder** (cards, lists, tables, articles, stats) | `<TuxSkeleton kind="…">` |
| **404 / 500 / 403 / 503 page** | `<TuxErrorPage code="…">` |
| **Multi-step flow indicator** (funding application, IRB, study onboarding) | `<TuxStepper :steps :current-index>` |
| **Site-wide notice strip** (closure, maintenance, security advisory) | `<TuxAnnouncementBanner>` |
| **"This isn't production" label** (preview env, public beta, sandbox) | `<TuxBetaRibbon variant="…">` |
| **Privacy / cookie consent** (public TTI surface) | `<TuxCookieConsent>` |
| **Quarterly / sponsor PDF report** (paper, print, PDF export) | `<TuxReportFrame>` |
| **Web-hosted long-form report** (annual report, findings page at a permanent URL) | `<TuxReportWebFrame>` |
| **"Print this page" affordance** on an existing screen | `<TuxReportPrintSheet>` |
| **BI dashboard embed** (Tableau, Power BI, Superset, Grafana) | `<TuxVizEmbed>` |
| **R / ggplot artifact** (PNG, SVG, htmlwidget) | `<TuxVizRPlot>` |
| **Side-by-side dashboard tiles** (small-multiples 2/3/4-up) | `<TuxVizGrid>` |
| **Texas-flavored map** (county choropleth, TxDOT districts, in-state dot density, OD flow arcs, AlbersUsa context) | `<TuxChartGeographic kind="…">` |
| **Multi-metro inset grid** (4-up neighborhood drill-down — Houston / DFW / Austin / SAT) | `<TuxMetroInset>` |
| **Two-ring radial breakdown** (sister to treemap; categorical part-to-whole with center total) | `<TuxChartSunburst>` |
| **Editorial wrapper for a multi-exhibit visualizations page** (eyebrow + Oswald title + maroon signature + body + source) | `<TuxChartFrame>` |

If your need isn't here, scan `/components` (or
`app/pages/components/index.vue`) — there are ~70 Tux\* components and
this map only highlights the ones with the easiest-to-miss names.

## Conventions

Composition standards for cases where a slot or prop combination
shows up across multiple Tux\* components or consuming apps. Capturing
them here keeps consumers from inventing different icons or labels for
the same affordance.

### Chat-message actions

`TuxChatMessage` exposes a `#tools` slot for the row of small actions
that sit below an assistant response (copy, regenerate, like, etc.).
The Vercel AI Elements `Actions` reference shows the pattern; TUX
standardizes on this five-icon set so consumers don't pick five
different copy icons:

| Action | Icon | Label | Emit (host-wired) | Notes |
|---|---|---|---|---|
| Copy | `lucide:copy` | "Copy" | `copy` | Copies the message body to clipboard |
| Regenerate | `lucide:refresh-cw` | "Regenerate" | `regenerate` | Re-runs the prompt that produced this response |
| Share | `lucide:share-2` | "Share" | `share` | Opens host-chosen share affordance |
| Helpful | `lucide:thumbs-up` | "Helpful" | `feedback` w/ `'up'` | Positive feedback signal |
| Off | `lucide:thumbs-down` | "Off" | `feedback` w/ `'down'` | Negative feedback signal |

Order convention: **Copy · Regenerate · Share · Helpful · Off** when
all five appear. Use a subset if the surface doesn't support an
action (e.g., no regenerate when the response is already final).
[`tti-ai-studio-session.vue`](../app/pages/examples/tti-ai-studio-session.vue)
is the canonical example using a Copy / Helpful / Off subset.

Style: icon + label (label can hide at narrow widths), font-size
`text-xs`, color `text-text-muted`, hover transitions to
`text-brand-primary`. Sits in a flex row below a `border-t` rule.

### Form validation — when to use which

Backstage's design system dedicates 38 frames to form validation
(inline errors, dialogs, banners) because *where* validation lives
matters as much as *what* it says. TUX standardizes on four placements;
the right one depends on scope (field / form / page / session) and
severity (advisory / blocking).

| Placement | Use when | Component(s) | Behavior |
|---|---|---|---|
| **Inline field error** | A single field is invalid. Most common case — wrong format, out of range, required-but-empty | `UFormField` with `error` prop, or compose `<TuxInfoLabel>` + `<UInput>` + an error `<p class="text-text-danger text-xs">` below | Renders red text below the field; non-blocking; clears on next valid input |
| **Inline form summary** | Multiple fields invalid AND the user has tried to submit. Tells them *how many* issues without scrolling | `<TuxAlert variant="danger">` above the form body, with a list of `<a href="#field-id">` jumps to each broken field | Persists until all issues resolved; field-level inline errors remain the source of truth |
| **Blocking dialog** | The action being submitted is destructive or irreversible. Forces explicit confirmation | `<UModal>` (or `<TuxModal>` for editorial chrome) with primary/secondary actions | Blocks the page; "Delete this corpus?" / "Discard 12 unsaved changes?" / "Revoke API key — this can't be undone" |
| **Page/session banner** | The issue is *not* about this form — it's a session-level constraint that affects what the form can do (ITAR scope, expired token, rate limit, server down) | `<TuxAlert variant="compliance" \| "danger" \| "warning">` at the top of the page | Persists across forms on the same page; doesn't compete with field-level errors |
| **Toast (transient confirmation)** | The form succeeded and the user has moved on. Not a "validation" placement per se, but the closing half of the validation lifecycle | `useToast()` (Nuxt UI) → green-tone "Saved" / "Removed" / "Sent" | Auto-dismisses in ~4 seconds; non-blocking |

**Decision tree:**

1. **Single field is wrong** → inline field error
2. **Multiple fields wrong + user tried to submit** → inline form summary + keep inline errors
3. **Destructive action being submitted** → blocking dialog
4. **Session-level constraint (ITAR, auth, rate limit)** → page/session banner
5. **Form succeeded** → toast

Anti-patterns to avoid:

- **Modal dialog for a single bad field** — friction without value; the inline error is faster
- **Banner for a single bad field** — wrong scope; the user has to find which field
- **Inline error for a session-level issue** — the user fixes the field but can't progress; root cause lives above
- **Toast for an error** — transient and easily missed; use banner or dialog for anything the user needs to act on

Canonical references for each pattern in real composition:
[`forms/inline-validation.vue`](../app/pages/forms/inline-validation.vue) (field-level),
[`forms/all-in-one.vue`](../app/pages/forms/all-in-one.vue) (form summary),
[`landscape-dashboard`](../app/pages/examples/landscape-dashboard.vue) ITAR alert (session banner).

### First-run AI surfaces — Examples / Capabilities / Limitations

When a consumer surface needs richer first-run framing than the single-
block `TuxEmptyState kind="first-run"` (e.g. tti-ai-studio's new-session
splash), use ChatGPT's canonical three-column taxonomy. Each column
sets a different expectation before the user types their first prompt:

| Column | What it answers | Typical content |
|---|---|---|
| **Examples** | "What should I ask?" | 3 concrete prompt strings the user can click to populate the composer |
| **Capabilities** | "What can it do?" | 3 strengths — corpora it can ground against, formats it can write, languages it understands |
| **Limitations** | "What should I not trust?" | 3 advisory caveats — knowledge cutoff, hallucination risk, ITAR scope boundaries |

Compose with `<TuxFactoid density="3">` (numerical-statistic style) or
a 3-up `<TuxCard>` grid (richer per-cell layout). The taxonomy is the
discipline; the components rendering it are the consumer's choice.
**No dedicated `TuxFirstRunTaxonomy` component is needed** — the value
is the framing, not the chrome.

Anti-patterns to avoid:

- **Single-paragraph welcome.** "Welcome to tti-ai-studio." reads as
  marketing, not orientation. The three columns set expectations
  before the user invests their first prompt.
- **Marketing tone in research IT.** ChatGPT's first-run is a
  consumer surface ("Hi, what's on your mind today?"). Research-IT
  first-run should be quieter and more functional — "Recent session
  was about X · Pick up where you left off." Keep the taxonomy;
  drop the marketing voice.
- **More than three columns.** The discipline is exactly three —
  the gain over a flat "welcome" is the parallelism. Four blurs it.

Reference frame:
[`reference/figma-cache/chatgpt-ui-kit-ai-chat/screens/new-chat.png`](../reference/figma-cache/chatgpt-ui-kit-ai-chat/screens/new-chat.png).
Absorbed 2026-05-21 from the ChatGPT UI Kit Figma file.

### MCP tool output — inline card / inline carousel / full screen

When an MCP (Model Context Protocol) tool inside tti-ai-studio returns
output to render in the chat, three display tiers cover the spectrum.
Each is the canonical TUX composition; pick by the *density* and
*interactivity* of the result.

| Tier | Use when | TUX composition |
|---|---|---|
| **Inline card** | Single result fits a card — a place, a chart, a document, a record. | `<TuxArtifact>` — title + icon + meta header, copy/download/regenerate/share actions, body slot. Drops inline between message turns. |
| **Inline carousel** | 3+ comparable results — list of places, sources, datasets, results. The user scans across, sometimes clicks one. | `<TuxCardCarousel>` with `arrows + dots`, sized to ~280–360px cards. Header eyebrow names the tool (e.g. *nearby trails*) + count. |
| **Full screen** | Rich interaction needed — large data viz, multi-step picker, app-like surface that competes with chat scroll. | Compose `<TuxArtifact>` (or a richer surface) inside `<TuxSlideover>` (side-docked) or `<TuxModal>` (centered). The chat pauses while the user works the surface. |

**Decision tree:**

1. **One result + read-only** → inline card.
2. **Multiple comparable results + scanning** → inline carousel.
3. **Interactive UI / heavy data / takes >½ chat width** → full screen.

**Each tier has a skeleton state** for the loading window — Nuxt UI 4's
`UChatShimmer` covers the inline tiers; `TuxSkeleton` covers full-screen
loads.

**Anti-patterns to avoid:**

- **Full-screen for a one-line answer.** The takeover surface is
  expensive; if the response fits a sentence, just render it in the
  chat body.
- **Inline carousel for two items.** Use two side-by-side
  `<TuxArtifact>` blocks (or a single card with a comparison
  callout) — the carousel chrome (arrows, dots, advance buttons)
  overweights two items.
- **Inline card when the result is a list.** A 12-result tool dump
  inside one card is unreadable; promote to inline carousel.

Reference frame:
[`reference/figma-cache/mcp-apps-for-claude/frames/`](../reference/figma-cache/mcp-apps-for-claude/frames/).
Absorbed 2026-05-21 from Anthropic's official MCP Apps UI kit v1.1.

### Empty states — no decorative illustrations

`TuxEmptyState` deliberately avoids the saturated-cartoon illustrations
common in consumer-SaaS empty-state kits. TUX is research-publishing;
editorial restraint outweighs the "consumer SaaS expectation" of a
friendly mascot. Empty states use a Lucide icon + heading + body +
optional CTA. If warmth is needed, place a real photograph
(`TuxPhotoCard`) *next to* — not inside — the empty state.

This stance was reaffirmed against the Empty State Illustration Kit
absorption (2026-05-21). The five `kind` presets (`no-data` /
`no-results` / `not-found` / `no-permissions` / `first-run`) cover
the real scenario taxonomy; 200 generic illustrations would not.

## Ideas not yet shipped

The catalog originally listed several components here. As of the
current cycle, every aspirational entry has shipped. New components land
when a consuming app (Landscape, tti-ai-studio, marcom WordPress kit) needs
them; open an issue or ping the maintainer to add a row.

## Guidance for adding a new component

1. **Write it against Nuxt UI** where possible — inherit a11y, theming,
   color-mode integration for free. Only go native when a Nuxt UI
   primitive fights TTI branding too hard to override cleanly (see
   `TuxCard` for an example of when that happens).
2. **Use container queries, not viewport media queries**, for any
   layout that shifts based on width. Tux components get embedded at
   varying widths — full-page, sidebar tile, narrow article column,
   demo wrapper, modal body. Viewport queries firing on a 1200px
   viewport while the component lives in a 600px column is the
   single most common bug we hit.

   **The pattern:**

   ```css
   .tux-component {
     container-type: inline-size;
     container-name: tux-component;
     /* base styles, mobile-first */
   }

   @container tux-component (min-width: 44rem) {
     .tux-component__layout {
       grid-template-columns: 1.4fr 1fr;
     }
   }
   ```

   Use `cqi` units in `clamp()` for fluid typography that scales with
   the container, e.g.
   `font-size: clamp(2rem, 1.2rem + 4.5cqi, 3.5rem)`.

   **Viewport queries are still right** when the component does
   something inherently page-layout-relative — breaking out of an
   article column with negative margins, or floating into the page
   gutter. `TuxCaptionedMedia`'s `align="wide"` and `align="right"`
   are the canonical examples; both keep `@media` queries with an
   explanatory comment.

3. **Hover/floating UI inside a bounded canvas** (tooltips, popovers,
   dropdowns) should flip placement near canvas edges — anchor with
   `right`/`bottom` past the midpoint instead of `left`/`top`. See
   `TuxTreemap`'s tooltip handler for the canonical pattern.
4. **Add a showcase route** at `/components/<kebab-name>`. Use
   `TuxExample` with at least a `vue` prop so the Vue template is
   exposed. If the component is load-bearing for the brand, also pass
   `source` so readers can see the SFC.
5. **Dogfood `TuxPageHeader`** at the top of the page — keeps visual
   rhythm consistent across every component demo.
6. **Add the entry** to `app/app.vue` nav, `app/pages/index.vue`
   Foundations/Components grid, and `app/pages/components/index.vue`
   table.
7. **Update `CHANGELOG.md`** under Unreleased → Added.

A component that skips any of these is invisible to future readers —
the style guide is its own documentation, so being in the guide is the
definition of "shipped."
