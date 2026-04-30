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
| `TuxBadge`           | `UBadge`                 | `/components/badge`             |
| `TuxBetaRibbon`      | tux native               | `/components/beta-ribbon`       |
| `TuxBigStat`         | tux native               | `/components/big-stat`          |
| `TuxBlockquote`      | tux native               | `/components/blockquote`        |
| `TuxBreadcrumbs`     | tux native               | `/components/breadcrumbs`       |
| `TuxButton`          | `UButton`                | `/components/button`            |
| `TuxCallout`         | tux native               | `/components/callout`           |
| `TuxCaptionedMedia`  | tux native               | `/components/captioned-media`   |
| `TuxCard`            | tux native               | `/components/card`              |
| `TuxCardSlab`        | tux native               | `/components/card-slab`         |
| `TuxCookieConsent`   | tux native               | `/components/cookie-consent`    |
| `TuxChatMessage`     | tux native               | `/components/chat-message`      |
| `TuxCitations`       | tux native               | `/components/citations`         |
| `TuxCodeBlock`       | Shiki                    | `/components/code-block`        |
| `TuxCodeMaroon`      | tux native               | `/components/code-maroon`       |
| `TuxCommandPalette`  | tux native               | `/components/command-palette`   |
| `TuxContactCard`     | tux native               | `/components/contact-card`      |
| `TuxContextPanel`    | tux native               | `/components/context-panel`     |
| `TuxConversationList`| tux native               | `/components/conversation-list` |
| `TuxComposer`        | tux native               | `/components/composer`          |
| `TuxCTA`             | tux native               | `/components/cta`               |
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
| `TuxLinkList`        | tux native               | `/components/link-list`         |
| `TuxLinkSlab`        | tux native               | `/components/link-slab`         |
| `TuxMediaSlab`       | tux native               | `/components/media-slab`        |
| `TuxMegaMenu`        | tux native               | `/components/site-nav`          |
| `TuxModal`           | `UModal`                 | `/components/modal`             |
| `TuxNewsCollection`  | tux native               | `/components/news-collection`   |
| `TuxPageHeader`      | tux native               | `/components/page-header`       |
| `TuxPagination`      | tux native               | `/components/pagination`        |
| `TuxPhotoGrid`       | tux native               | `/components/photo-grid`        |
| `TuxQACollection`    | tux native               | `/components/qa-collection`     |
| `TuxSearch`          | tux native               | `/components/search`            |
| `TuxSectionHeader`   | tux native               | `/components/section-header`    |
| `TuxSidebarBlock`    | tux native               | `/components/sidebar-block`     |
| `TuxSignupFeature`   | tux native               | `/components/signup-feature`    |
| `TuxSiteNav`         | tux native               | `/components/site-nav`          |
| `TuxSkeleton`        | tux native               | `/components/skeleton`          |
| `TuxStepper`         | tux native               | `/components/stepper`           |
| `TuxTable`           | `UTable`                 | `/components/table`             |
| `TuxTestimonial`     | tux native               | `/components/testimonial`       |
| `TuxTOC`             | tux native               | `/components/toc`               |
| `TuxTreemap`         | tux native               | `/components/treemap`           |

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
| **Search bar** (PECAN finder, conversation search) | `<TuxSearch>` |
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

If your need isn't here, scan `/components` (or
`app/pages/components/index.vue`) — there are ~60 Tux\* components and
this map only highlights the ones with the easiest-to-miss names.

## Ideas not yet shipped

The catalog originally listed several components here. As of the
current cycle, every aspirational entry has shipped. New components land
when a consuming app (PECAN, tti-ai-studio, marcom WordPress kit) needs
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
