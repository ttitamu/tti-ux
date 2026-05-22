# Compositions

> **Status:** doctrine (2026-05-22). The "X + Y composes well"
> patterns that emerged across the chart-family, platform-aware,
> and AI-studio sprints. Tux is **composable by design** — most
> consumer surfaces are 5-12 Tux components stitched into a layout.
> This doc captures the combinations that have proven their weight.
>
> Companion to [`components.md`](./components.md) (the catalog),
> [`chart-foundations.md`](./chart-foundations.md) (chart doctrine),
> and [`platform-awareness.md`](./platform-awareness.md) (chrome
> doctrine).

Compositions earn a slot in this doc when they meet three tests:

1. **Two or more components compose more value than they do alone.**
   `TuxBigStat` + `TuxSparkline` is a composition (KPI tile);
   `TuxButton` next to `TuxBadge` isn't (just two atoms in a row).
2. **There's a non-obvious "right" shape.** If a contributor would
   intuit the layout from the JSDoc alone, it's not a composition
   worth doctrine-level documentation.
3. **Real consumer surfaces use it.** Each entry below cites at
   least one consumer file that ships it.

---

## Index

- [Layout shells](#layout-shells)
- [Headlines + summaries](#headlines--summaries)
- [Chart surfaces](#chart-surfaces)
- [Browse + detail surfaces](#browse--detail-surfaces)
- [Chat surfaces](#chat-surfaces)
- [Cross-app navigation](#cross-app-navigation)
- [Editorial surfaces](#editorial-surfaces)

---

## Layout shells

### sidebar layout + #header + #aside

The full app-shell. Used by data-dense surfaces (Landscape,
tti-ai-studio dashboards).

```vue
<NuxtLayout name="sidebar">
  <template #header>
    <UDashboardSidebarToggle />
    <TuxBreadcrumbs :trail="trail" />
    <!-- right side: actions -->
  </template>

  <template #rail-header="{ collapsed }">
    <!-- brand lockup -->
  </template>
  <template #rail="{ collapsed }">
    <UNavigationMenu orientation="vertical" :items="railItems" :collapsed="collapsed" />
  </template>
  <template #rail-footer="{ collapsed }">
    <!-- user chip -->
  </template>

  <!-- default slot: main panel -->
  <div class="p-6 space-y-10">
    <!-- … -->
  </div>

  <template #aside>
    <!-- right-rail: activity, agents, notifications -->
  </template>
</NuxtLayout>
```

**Consumers:** `app/pages/examples/landscape-dashboard.vue` (all
five slots used), `app/pages/examples/sidebar-shell.vue`
(minimal version without `#aside`).

**Notes:** the explicit `<NuxtLayout name="sidebar">` invocation is
**required** to access named slots with typed scope —
`definePageMeta({ layout: "sidebar" })` routes content into the
default slot only.

### TuxAppFrame + TuxMenuBar + content

Tauri desktop shells where TUX draws the titlebar. The Mac path
collapses the menu bar (system menu wins); Windows + Linux render
the in-window strip.

```vue
<TuxAppFrame title="Landscape" :force-chrome="true">
  <template #left>
    <span class="font-bold text-brand-primary">Landscape</span>
  </template>
  <template #right>
    <TuxAppSwitcher :apps="apps" />
    <UButton variant="ghost" icon="lucide:bell" />
  </template>
</TuxAppFrame>

<TuxMenuBar :menus="menus" />

<!-- Page content fills below -->
```

**Consumers:** the showcase routes at `/components/app-frame` and
`/components/menu-bar`. No production Tauri shell yet (deferred
until consumer pull); when one lands it composes these three.

**Notes:** `TuxAppSwitcher` belongs in `#right` of `TuxAppFrame` for
Tauri shells, OR in the utility row of `TuxSiteNav` for plain-web
consumers. Don't put it in both — it's a single floating affordance
per app.

---

## Headlines + summaries

### TuxBigStat row + chart underneath

The canonical "summary + trend" composition absorbed from the
Charts UI Kit and Snow Dashboard. A row of `TuxBigStat` tiles
(Total + per-series) above the chart that breaks it down.

```vue
<div class="grid grid-cols-4 gap-4 tux-mount-in tux-mount-in--stagger">
  <TuxBigStat :value="totalGrand" label="Total" tone="maroon" />
  <TuxBigStat :value="seriesA"   label="PDF" />
  <TuxBigStat :value="seriesB"   label="CSV" />
  <TuxBigStat :value="seriesC"   label="GeoJSON" />
</div>
<TuxChartArea :labels="months" :series="data" variant="stacked" />
```

**Consumers:**
`app/pages/examples/landscape-dashboard.vue` § "Corpus composition".

**Notes:** the totals in the KPI strip should match the right-most
endpoint of the area chart. Drift means the chart and tiles are
fed by different data — fix the source.

### TuxFactoid + TuxStatComparison row

Two-row pattern: headline factoids on top (one-liner takeaways),
year-over-year deltas below (how the numbers moved).

```vue
<TuxFactoid variant="default" :density="3" :items="factoids" />

<div class="mt-8 grid grid-cols-3 gap-6 tux-mount-in tux-mount-in--stagger">
  <TuxStatComparison eyebrow="…" :current="…" :previous="…" />
  <TuxStatComparison eyebrow="…" :current="…" :previous="…" polarity="invert" />
  <TuxStatComparison eyebrow="…" :current="…" :previous="…" />
</div>
```

**Consumers:** `app/pages/examples/research-landing.vue`.

**Notes:** when a delta is "down-is-good" (error rate, latency),
use `polarity="invert"` so the visual cue (color, arrow) matches
the goodness, not the math.

### TuxPageHeader + TuxBigStat in #media

Hero pattern for landing pages where one number is the anchor.

```vue
<TuxPageHeader
  tone="neutral"
  rhythm="hero"
  eyebrow="indices"
  title="/research"
>
  Continuously indexed by 4 agent runtimes.
  <template #media>
    <TuxBigStat :value="47.2" suffix=" TB" label="Indexed across all corpora" tone="maroon" size="lg" />
  </template>
</TuxPageHeader>
```

**Consumers:**
`app/pages/examples/landscape-dashboard.vue`.

---

## Chart surfaces

### TuxFocusView + chart family

"Open this chart in focus mode" pattern. Lets researchers pin a
tile-sized chart to the full viewport for analysis. The chart keeps
all its interactions (brush, tooltip).

```vue
<UButton icon="lucide:maximize" @click="focus = true">Focus</UButton>

<TuxFocusView v-model:open="focus" eyebrow="Exhibit 11.04" title="Monthly ingest rate">
  <template #actions>
    <UButton variant="ghost" icon="lucide:download" />
  </template>
  <TuxChartLine :labels="months" :series="data" :width="1100" :height="500" markers brush />
</TuxFocusView>
```

**Consumers:** `app/pages/visualizations/chart-line.vue` showcase;
intended use case: any dashboard tile with a chart that deserves
inspection.

**Notes:** the focus view's content slot has padding 1.5rem so the
chart needs explicit width/height — `width: 1100, height: 500`
typically reads well on standard laptop viewports.

### TuxChartFrame + chart

Editorial chrome (eyebrow + display-face title + signature rule +
source citation) wrapped around any chart. Use for **report-level
exhibits**; skip in dashboard tiles.

```vue
<TuxChartFrame
  eyebrow="Exhibit 11.04"
  title="Monthly ingest rate"
  subtitle="Files added to the corpus per month — total across all agents"
  source="Source: TTI Landscape index, 2026"
>
  <TuxChartLine :labels="months" :series="data" :width="700" :height="300" />
</TuxChartFrame>
```

**Consumers:** every chart showcase has a "wrapped · editorial
frame" section demonstrating the wrap.

### Chart + TuxRichDataGrid (hover sync via emit)

Master-detail with hover-sync. When a researcher hovers a chart
data point, the matching row in the adjacent table can light up.

```vue
<script setup>
const activeIndex = ref<number | null>(null);
function onChartHover(payload) {
  activeIndex.value = payload?.index ?? null;
}
</script>

<template>
  <TuxChartLine :labels="months" :series="data" @hover="onChartHover" />
  <TuxRichDataGrid
    :rows="rows"
    :row-class="(row, i) => i === activeIndex ? 'tux-row--highlighted' : ''"
  />
</template>
```

**Consumers:** not yet shipped in an example; pattern is captured
here for the next Landscape iteration.

---

## Browse + detail surfaces

### TuxSplitPane + TuxRichDataGrid + #bottom pane

Master-detail at full surface scale. Left pane = list of records
(TuxRichDataGrid or TuxLinkList); right pane = selected record's
detail; optional bottom pane = related context (history, comments,
linked records).

```vue
<TuxSplitPane v-model="selectedId" id="landscape-records" :show-bottom="true">
  <template #list>
    <TuxRichDataGrid :rows="rows" :selected="selectedId" @row-click="selectedId = $event.id" />
  </template>
  <template #detail>
    <TuxPageHeader :eyebrow="`record · ${record.id}`" :title="record.title" />
    <!-- detail body -->
  </template>
  <template #bottom>
    <TuxTabs :tabs="['History', 'Comments', 'Linked']" />
  </template>
</TuxSplitPane>
```

**Consumers:** `/components/split-pane` showcase (uses a simpler
button-list instead of TuxRichDataGrid); intended use case is the
upcoming Landscape "browse records" surface.

**Notes:** URL-bind the selection via Vue Router
(`useRoute().query.id` ↔ `selectedId`) so the deep-link case works
without consumer code in the SplitPane.

### TuxFilterPanel + TuxResultCount + TuxRichDataGrid + TuxPagination

The "faceted browse" stack. Left rail = filters; main content =
result count + table + pagination. Filter changes update the
result count; pagination + filter changes are URL-bound.

```vue
<div class="grid grid-cols-[18rem_1fr] gap-6">
  <TuxFilterPanel v-model="filters" :facets="facets" />
  <div class="space-y-3">
    <TuxResultCount :showing-from="1" :showing-to="24" :total="412" :page-size="24" />
    <TuxRichDataGrid :rows="rows" />
    <TuxPagination v-model="page" :total="412" :page-size="24" />
  </div>
</div>
```

**Consumers:** `app/pages/examples/landscape-dashboard.vue` (the
files-list section uses this stack).

---

## Chat surfaces

### TuxChatMessage + TuxBranchNav (in #header-trailing)

When the assistant produces multiple candidate responses, the
branch navigator lives in `TuxChatMessage`'s `#header-trailing`
slot.

```vue
<TuxChatMessage role="assistant" author="tti-ai-studio" timestamp="12:14:11">
  <template #header-trailing>
    <TuxBranchNav v-model="currentBranch" :total="3" />
  </template>
  <!-- assistant body -->
</TuxChatMessage>
```

**Consumers:** `app/pages/examples/tti-ai-studio-session.vue`.

### TuxChatMessage + TuxArtifact + TuxFocusView (artifact expand)

When an assistant turn produces a generated artifact (code, doc,
exported data), wrap it in `TuxArtifact` and add a "focus mode"
affordance so the researcher can pin it full-viewport.

```vue
<TuxChatMessage role="assistant">
  <p>Here's a script that reproduces the comparison:</p>
  <TuxArtifact title="compare.py" icon="lucide:file-code">
    <template #actions>
      <UButton size="xs" icon="lucide:maximize" @click="focusOpen = true">Focus</UButton>
    </template>
    <TuxCodeBlock :code="comparePy" lang="python" />
  </TuxArtifact>
</TuxChatMessage>

<TuxFocusView v-model:open="focusOpen" title="compare.py">
  <template #actions>
    <UButton icon="lucide:download">Download</UButton>
    <UButton variant="primary" icon="lucide:play">Run</UButton>
  </template>
  <TuxCodeBlock :code="comparePy" lang="python" />
</TuxFocusView>
```

**Consumers:** `app/pages/examples/tti-ai-studio-session.vue`.

**Notes:** the `#actions` slot is the natural home for the focus
button + secondary actions (download, copy). When focus mode opens,
add a "Run" or "Edit" primary action that's awkward in the
inline-tile context.

### TuxChatMessage + TuxReactionBar (feedback footer)

Light-touch helpful/question/disagree reaction. Replaces inline
thumb buttons; counts display-only (consumer increments).

```vue
<TuxChatMessage role="assistant">
  <!-- assistant body -->
  <template #footer>
    <TuxReactionBar
      v-model="reaction"
      :counts="{ helpful: 7, question: 1, disagree: 0 }"
    />
  </template>
</TuxChatMessage>
```

**Consumers:** `app/pages/examples/tti-ai-studio-session.vue`
(refresh 2026-05-22 replaced inline thumbs with this).

### TuxComposer + TuxContextMeter (above the input)

Token-utilization meter pinned visually near the composer so the
user sees their budget while typing.

```vue
<TuxContextMeter :used="used" :max="max" :breakdown="breakdown" />
<TuxComposer @send="onSend" />
```

**Consumers:** `app/pages/examples/tti-ai-studio-session.vue`.

---

## Cross-app navigation

### TuxAppSwitcher placement

In Tauri shells, the switcher lives in `TuxAppFrame`'s `#right`
slot. In plain-web consumers, it lives in `TuxSiteNav`'s utility
row OR in a page-header `#actions` slot (the AI-studio example
uses the page-header path).

**Don't:**
- Render two switchers on the same page.
- Mark more than one app as `current: true`.
- Place inside `TuxSlideover` / `TuxModal` (defeats the "always
  visible" purpose).

---

## Editorial surfaces

### TuxBlockquote + TuxMediaSlab (publication landing)

The "featured publication" rhythm. A pull quote (drop-cap layout)
followed by a full-bleed media moment.

```vue
<TuxBlockquote
  layout="drop-cap"
  quote="…"
  attribution="Hassan et al."
  role="Transportation Research Record · 2025"
/>

<TuxMediaSlab title="…" eyebrow="…" :media="hero" />
```

**Consumers:** `app/pages/examples/research-landing.vue`.

### TuxPageHeader (hero rhythm) + TuxFactoid + TuxIconFeature + TuxCardSlab

The standard research-program landing rhythm — hero, factoids,
focus areas (icon grid), program cards (media-led).

**Consumers:** `app/pages/examples/research-landing.vue`.

**Notes:** keep the rhythm; consumers that drop one section break
the visual cadence. If a page legitimately doesn't have factoids,
use `TuxBigStat` solo with `rhythm="hero"` on the page header
instead.

---

## When in doubt

- Lean on the example pages under `app/pages/examples/`. Each
  ships a real-shape composition that exercises 10+ Tux
  components. If you're building a similar surface, start from
  the closest example and iterate.
- Don't reinvent. If you find yourself building a layout that
  *almost* matches a composition here, ask whether the
  differences are essential or stylistic. Stylistic differences
  belong in tokens / props; essential differences earn a new
  composition entry below.

## Adding to this doc

When you spot a pattern that earns its weight (per the three tests
in the intro), add it below with:

1. **Title** — short, evocative ("Master-detail with hover sync",
   not "Chart + DataGrid linkage").
2. **Code snippet** that's runnable in a consumer.
3. **Consumer citation** — at least one in-repo file that ships
   the pattern.
4. **Notes** — gotchas, alternatives, when not to use.
