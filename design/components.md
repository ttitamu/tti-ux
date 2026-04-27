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
| `TuxBadge`           | `UBadge`                 | `/components/badge`             |
| `TuxBigStat`         | tux native               | `/components/big-stat`          |
| `TuxBlockquote`      | tux native               | `/components/blockquote`        |
| `TuxBreadcrumbs`     | tux native               | `/components/breadcrumbs`       |
| `TuxButton`          | `UButton`                | `/components/button`            |
| `TuxCallout`         | tux native               | `/components/callout`           |
| `TuxCaptionedMedia`  | tux native               | `/components/captioned-media`   |
| `TuxCard`            | tux native               | `/components/card`              |
| `TuxCardSlab`        | tux native               | `/components/card-slab`         |
| `TuxCodeMaroon`      | tux native               | `/components/code-maroon`       |
| `TuxCommandPalette`  | tux native               | `/components/command-palette`   |
| `TuxContactCard`     | tux native               | `/components/contact-card`      |
| `TuxCTA`             | tux native               | `/components/cta`               |
| `TuxDescriptionList` | tux native               | `/components/description-list`  |
| `TuxEmptyState`      | `TuxCard` composite      | `/components/empty-state`       |
| `TuxExample`         | showcase primitive       | (used on every component page)  |
| `TuxFactoid`         | tux native               | `/components/factoid`           |
| `TuxFilterPanel`     | tux native               | `/components/filter-panel`      |
| `TuxFooter`          | tux native               | `/components/footer`            |
| `TuxIconFeature`     | tux native               | `/components/icon-feature`      |
| `TuxIdentity`        | tux native               | `/components/identity`          |
| `TuxLinkList`        | tux native               | `/components/link-list`         |
| `TuxLinkSlab`        | tux native               | `/components/link-slab`         |
| `TuxMediaSlab`       | tux native               | `/components/media-slab`        |
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
| `TuxSubfooter`       | tux native               | `/components/footer`            |
| `TuxTable`           | `UTable`                 | `/components/table`             |
| `TuxTestimonial`     | tux native               | `/components/testimonial`       |
| `TuxTreemap`         | tux native               | `/components/treemap`           |

The showcase pages expose **Vue** (template source), **HTML** (rendered
DOM), and — where applicable — **Source** (the component SFC) tabs via
the `TuxExample` primitive.

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
