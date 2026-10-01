<script setup lang="ts">
import { tuxCatalog, TUX_VIZ_CATEGORIES, type TuxVizCategory } from "../../utils/tuxCatalog";

useHead({ title: "Visualizations · TUX" });

/**
 * /visualizations — Data & Telemetry Catalog Explorer.
 *
 * Sourced directly from the single source of truth (`app/utils/tuxCatalog.ts`).
 * Displays all 16 shipped visualization components across four semantic clusters:
 *   - Timeseries & Trends (lines, areas, bars, gauges, sparklines, editorial frame)
 *   - Geospatial & Maps (Texas county choropleth, TxDOT districts, OD flows, metro insets)
 *   - Statistical & Distributions (scatter, histograms, heatmaps, sunbursts, donuts)
 *   - BI & Analytics Embeds (Tableau/PowerBI iframe wrappers, R plots, small multiples)
 */

const searchQuery = ref("");
const selectedCategory = ref<string>("all");

const vizComponents = tuxCatalog
  .filter((e) => e.family === "visualizations")
  .map((e) => ({
    name: e.name,
    to: e.to,
    icon: e.icon,
    wraps: e.wraps,
    blurb: e.blurb,
    vizCategory: e.vizCategory as TuxVizCategory | undefined,
  }));

const categoryCounts = computed(() => {
  const counts: Record<string, number> = { all: vizComponents.length };
  for (const cat of TUX_VIZ_CATEGORIES) {
    counts[cat.id] = vizComponents.filter((c) => c.vizCategory === cat.id).length;
  }
  return counts;
});

const filteredComponents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const cat = selectedCategory.value;

  return vizComponents.filter((c) => {
    const matchesCat = cat === "all" || c.vizCategory === cat;
    if (!matchesCat) return false;

    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.blurb.toLowerCase().includes(q) ||
      c.wraps.toLowerCase().includes(q)
    );
  });
});

function getCategoryLabel(catId?: string) {
  if (!catId) return "Visualization";
  const found = TUX_VIZ_CATEGORIES.find((c) => c.id === catId);
  return found ? found.label : catId;
}
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="telemetry" title="Data & Visualizations">
      Interactive data telemetry surfaces — native SVG charts, geographic projections,
      statistical distributions, and sandboxed BI embeds. Distinct from
      <NuxtLink to="/reports" class="link-tti">Reports</NuxtLink>:
      reports deliver finished linear documents, visualizations deliver
      interactive surfaces readers can inspect, filter, and explore.
    </TuxPageHeader>

    <!-- Operational Filter & Category Ribbon -->
    <div class="space-y-4">
      <!-- Search Input -->
      <div class="relative max-w-md">
        <UIcon
          name="lucide:search"
          class="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search visualizations (name, blurb, wraps)…"
          class="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-surface-sunken border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
          title="Clear search"
          @click="searchQuery = ''"
        >
          <UIcon name="lucide:x" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 border"
          :class="[
            selectedCategory === 'all'
              ? 'bg-brand-primary text-text-inverse border-brand-primary shadow-xs'
              : 'bg-surface-sunken text-text-muted border-surface-border hover:text-text-primary hover:bg-surface-raised'
          ]"
          @click="selectedCategory = 'all'"
        >
          <span>All Visualizations</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded"
            :class="selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-surface-raised text-text-muted'"
          >
            {{ categoryCounts.all }}
          </span>
        </button>

        <button
          v-for="cat in TUX_VIZ_CATEGORIES"
          :key="cat.id"
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 border"
          :class="[
            selectedCategory === cat.id
              ? 'bg-brand-primary text-text-inverse border-brand-primary shadow-xs'
              : 'bg-surface-sunken text-text-muted border-surface-border hover:text-text-primary hover:bg-surface-raised'
          ]"
          @click="selectedCategory = cat.id"
        >
          <UIcon :name="cat.icon" class="w-3.5 h-3.5" />
          <span>{{ cat.label }}</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded"
            :class="selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface-raised text-text-muted'"
          >
            {{ categoryCounts[cat.id] }}
          </span>
        </button>
      </div>
    </div>

    <!-- Active Filter Status -->
    <div
      v-if="selectedCategory !== 'all' || searchQuery"
      class="flex items-center justify-between text-xs text-text-muted px-1"
    >
      <span>
        Showing <strong>{{ filteredComponents.length }}</strong> of
        <strong>{{ vizComponents.length }}</strong> visualization components
        <template v-if="selectedCategory !== 'all'">
          in <em>{{ getCategoryLabel(selectedCategory) }}</em>
        </template>
        <template v-if="searchQuery">
          matching "<em>{{ searchQuery }}</em>"
        </template>
      </span>
      <button
        type="button"
        class="link-tti text-xs hover:underline cursor-pointer"
        @click="searchQuery = ''; selectedCategory = 'all'"
      >
        Reset filters
      </button>
    </div>

    <!-- Cards Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="c in filteredComponents"
        :key="c.name"
        :to="c.to"
        class="card-linked p-5 flex flex-col justify-between group"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-surface-sunken border border-surface-border flex items-center justify-center text-text-brand group-hover:border-brand-primary/40 group-hover:bg-brand-primary/5 transition-colors">
              <UIcon :name="c.icon" class="w-5 h-5" />
            </div>
            <span
              v-if="c.vizCategory"
              class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border border-surface-border text-text-muted bg-surface-sunken"
            >
              {{ c.vizCategory }}
            </span>
          </div>
          <h2 class="heading--bold text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
            {{ c.name }}
          </h2>
          <p class="mt-2 text-sm text-text-secondary leading-relaxed">
            {{ c.blurb }}
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-text-muted">
          <span class="font-mono text-[11px] truncate max-w-[80%]">{{ c.wraps }}</span>
          <UIcon name="lucide:arrow-right" class="w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </NuxtLink>
    </section>

    <!-- Empty State -->
    <div
      v-if="filteredComponents.length === 0"
      class="text-center py-12 border border-dashed border-surface-border rounded-xl bg-surface-sunken space-y-3"
    >
      <UIcon name="lucide:chart-pie" class="w-8 h-8 text-text-muted mx-auto" />
      <p class="text-sm font-semibold text-text-primary">No visualization components found</p>
      <p class="text-xs text-text-muted max-w-sm mx-auto">
        No components matched your search query. Try broadening your terms or resetting your category filter.
      </p>
      <button
        type="button"
        class="btn-secondary text-xs mt-2"
        @click="searchQuery = ''; selectedCategory = 'all'"
      >
        Clear filters
      </button>
    </div>

    <!-- Architecture & Doctrine -->
    <section class="space-y-4 pt-6 border-t border-surface-border">
      <div>
        <p class="eyebrow">architecture</p>
        <h2 class="heading--bold text-lg font-bold">Native SVG vs. Embedded BI Engines</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary leading-relaxed">
        <div class="card-static p-4 space-y-2">
          <div class="flex items-center gap-2 font-bold text-text-primary">
            <UIcon name="lucide:sparkles" class="w-4 h-4 text-brand-primary" />
            <span>Native SVG Components</span>
          </div>
          <p>
            Charts like <code>TuxChartLine</code>, <code>TuxChartArea</code>, <code>TuxChartBar</code>,
            <code>TuxChartScatter</code>, <code>TuxChartGeographic</code>, and <code>TuxChartSunburst</code>
            render zero-dependency, lightweight vector markup. They bind directly to TUX design
            tokens, automatically responding to theme changes, dark mode, high contrast, and
            screen-reader accessibility standards.
          </p>
          <NuxtLink to="/design/chart-foundations" class="link-tti text-xs block pt-1">
            Read Chart Foundations doctrine →
          </NuxtLink>
        </div>

        <div class="card-static p-4 space-y-2">
          <div class="flex items-center gap-2 font-bold text-text-primary">
            <UIcon name="lucide:layout-grid" class="w-4 h-4 text-brand-primary" />
            <span>Sandboxed Embed Framework</span>
          </div>
          <p>
            When complex analytical work requires live BI dashboards or statistical compute artifacts,
            reach for <code>TuxVizEmbed</code> (Tableau, Power BI, Superset, Grafana) or
            <code>TuxVizRPlot</code> (ggplot2, htmlwidgets). They deliver secure sandboxing, loading skeletons,
            error boundaries, poster fallbacks, and multi-pane small-multiples grids via <code>TuxVizGrid</code>.
          </p>
          <NuxtLink to="/visualizations/embed" class="link-tti text-xs block pt-1">
            View BI Embed wrapper →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Power BI Parity Matrix -->
    <section class="space-y-3 pt-6 border-t border-surface-border">
      <p class="eyebrow">power bi</p>
      <h2 class="heading--bold text-lg font-bold">Power BI Parity & Theme Coverage</h2>
      <p class="text-sm text-text-secondary leading-relaxed">
        Charts with a <strong>Power BI</strong> tab carry a ready-to-paste PBIR fragment from
        <NuxtLink to="/install/power-bi" class="link-tti">the Power BI kit</NuxtLink>.
        Implementations are an attribute of a component, not a separate section — so the Power BI
        rendering of a chart lives on that chart's showcase page beside Vue and HTML.
      </p>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-surface-border text-left">
              <th class="py-2 pr-4 font-semibold">Fragment</th>
              <th class="py-2 pr-4 font-semibold">Covers</th>
              <th class="py-2 font-semibold">Where to Find</th>
            </tr>
          </thead>
          <tbody class="align-top divide-y divide-surface-border text-text-secondary">
            <tr>
              <td class="py-2.5 pr-4 font-mono text-xs">chart-cartesian</td>
              <td class="py-2.5 pr-4">bar, column, line, area, scatter</td>
              <td class="py-2.5">Power BI tab on respective chart pages</td>
            </tr>
            <tr>
              <td class="py-2.5 pr-4 font-mono text-xs">table-chrome</td>
              <td class="py-2.5 pr-4">tableEx</td>
              <td class="py-2.5">
                <NuxtLink to="/components/data-table" class="link-tti">Data table showcase</NuxtLink>
              </td>
            </tr>
            <tr>
              <td class="py-2.5 pr-4 font-mono text-xs">card-chrome</td>
              <td class="py-2.5 pr-4">every content visual</td>
              <td class="py-2.5">
                Container rule — see
                <NuxtLink to="/install/power-bi" class="link-tti">setup documentation</NuxtLink>
              </td>
            </tr>
            <tr>
              <td class="py-2.5 pr-4 text-text-muted font-mono text-xs">—</td>
              <td class="py-2.5 pr-4 text-text-muted">donut, gauge, heatmap, histogram, sunburst, geographic</td>
              <td class="py-2.5 text-text-muted">Custom native SVG visual or R plot integration</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
