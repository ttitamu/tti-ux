# aggieux signature components

Components that make PECAN *look* like aggieux — the rest is just Reka UI primitives with our tokens applied. Build order matches priority.

## 1. `<BigStat>`

Oversized metric. TTI's most recognizable design pattern, lifted from the factsheets.

**Props:**
- `value: string | number` — rendered at `font.size.6xl` or `7xl`
- `label: string` — small-caps, tracking `wider`, positioned above or below the value
- `tone: "maroon" | "gold" | "neutral"` — pulls from `theme.brand.*`
- `trend?: "up" | "down" | "flat"` — optional small glyph beside value

**Use cases:** dashboard headline metrics — total indexed bytes, file count, active scans, scans completed today.

## 2. `<SectionHeader>`

ALL-CAPS section title with a maroon underline rule. Editorial rhythm throughout the app.

**Props:**
- `level: 1 | 2 | 3` — maps to semantic `<h1>`/`<h2>`/`<h3>`
- `subtitle?: string` — regular-case secondary line underneath

**Styling:** `text-transform: uppercase`, `letter-spacing: wider`, 2px bottom border in `brand.primary`.

## 3. `<PathCrumbs>`

The directory hierarchy breadcrumb with inline size pills. On every search result and detail view.

**Props:**
- `path: string` — e.g. `/research/grants/nsf-1234/data/2026`
- `showSizes: boolean` — if true, each segment gets a `<SizePill>` showing cumulative bytes
- `onSegmentClick: (segment: string) => void` — navigation hook

**Behavior:** segments are clickable; current segment is emphasized; long paths collapse the middle with an ellipsis the user can expand.

## 4. `<FacetPanel>`

Left-rail filter panel for search results. Composes a set of facets (extension, owner, type, access tier, grant ID, retention class).

**Props:**
- `facets: Facet[]` — each facet has `name`, `label`, `buckets`
- `selected: Record<string, string[]>` — v-model'd
- `collapsible: boolean`

Uses Reka UI's `CollapsibleRoot` under the hood.

## 5. `<ResultTable>`

Virtualized file-result table. TanStack Table + TanStack Virtual. 10k rows without blinking.

**Columns (default):**
- Name (+ icon by extension)
- Path (truncated middle)
- Size (human-readable, right-aligned, monospaced)
- Owner
- Modified (relative time)
- Type badge

**Behavior:** sortable headers, keyboard nav, row-click opens detail drawer. Column visibility is user-configurable and persisted per-index.

## 6. `<StorageTreemap>`

ECharts-powered directory-size treemap. Replaces diskover's D3 v3 chart.

**Props:**
- `data: TreemapNode[]` — recursive `{ name, size, children? }`
- `maxDepth: number` — default 3
- `colorBy: "size" | "age" | "owner"` — swaps the color scale

**Behavior:** click-to-zoom, tooltip with full path + size + child count, breadcrumb shown at top for current zoom level.

## 7. `<SavedSearches>`

A compact dropdown listing the user's saved queries. Each entry is a chip with name + delete. Selecting one applies the filters + free-text query.

## 8. `<IndexPicker>`

Multi-index switcher in the global header — chooses which OpenSearch index (which scan) the user is viewing. Shows doc count and last-scan time for each.

---

## Build order (checklist)

- [ ] Tokens pipeline — Style Dictionary → CSS vars + Tailwind theme
- [ ] `<BigStat>` + `<SectionHeader>` — they appear in the first dashboard screen
- [ ] `<ResultTable>` + `<PathCrumbs>` — they appear in the first search screen
- [ ] `<FacetPanel>`
- [ ] `<StorageTreemap>`
- [ ] `<IndexPicker>` + `<SavedSearches>` — polish pass

Each component gets a Histoire story on creation — non-negotiable, that's our visual regression net.
