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
| `TuxAlert`           | `UAlert`                 | `/components/alert`             |
| `TuxBadge`           | `UBadge`                 | `/components/badge`             |
| `TuxButton`          | `UButton`                | `/components/button`            |
| `TuxCard`            | aggieux native           | `/components/card`              |
| `TuxEmptyState`      | `TuxCard` composite      | `/components/empty-state`       |
| `TuxExample`         | showcase primitive       | (used on every component page)  |
| `TuxModal`           | `UModal`                 | `/components/modal`             |
| `TuxPageHeader`      | aggieux native           | `/components/page-header`       |
| `TuxSectionHeader`   | aggieux native           | `/components/section-header`    |
| `TuxTable`           | `UTable`                 | `/components/table`             |

The showcase pages expose **Vue** (template source), **HTML** (rendered
DOM), and — where applicable — **Source** (the component SFC) tabs via
the `TuxExample` primitive.

## Ideas not yet shipped

| Component          | Intent                                           | Candidate wrapper |
| ------------------ | ------------------------------------------------ | ----------------- |
| `TuxBigStat`       | Oversized metric with TTI-style tracked label    | none              |
| `TuxBreadcrumbs`   | Segmented path with maroon separators            | `UBreadcrumb`     |
| `TuxFilterPanel`   | Left-rail facet panel for list pages             | `UAccordion`      |
| `TuxTreemap`       | Hierarchical visualization                       | Unovis treemap    |
| `TuxCommandPalette`| Global search/jump                               | `UCommandPalette` |

No strict build order — components land when a consuming app needs them.
If you need one listed above, open an issue or ping the maintainer.

## Guidance for adding a new component

1. **Write it against Nuxt UI** where possible — inherit a11y, theming,
   color-mode integration for free. Only go native when a Nuxt UI
   primitive fights TTI branding too hard to override cleanly (see
   `TuxCard` for an example of when that happens).
2. **Add a showcase route** at `/components/<kebab-name>`. Use
   `TuxExample` with at least a `vue` prop so the Vue template is
   exposed. If the component is load-bearing for the brand, also pass
   `source` so readers can see the SFC.
3. **Dogfood `TuxPageHeader`** at the top of the page — keeps visual
   rhythm consistent across every component demo.
4. **Add the entry** to `app/app.vue` nav, `app/pages/index.vue`
   Foundations/Components grid, and `app/pages/components/index.vue`
   table.
5. **Update `CHANGELOG.md`** under Unreleased → Added.

A component that skips any of these is invisible to future readers —
the style guide is its own documentation, so being in the guide is the
definition of "shipped."
