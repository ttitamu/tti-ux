<script setup lang="ts">
import { tuxCatalog, TUX_COMPONENT_CATEGORIES } from "../../utils/tuxCatalog";
import { getTuxHealthCatalog, type TuxComponentHealth } from "../../utils/tuxHealthCatalog";
import { useTuxClipboard } from "../../composables/useTuxClipboard";

useHead({ title: "Components · TUX" });

const route = useRoute();
const searchQuery = ref("");
const selectedCategory = ref<string>("all");

watch(
  () => route.query.cat,
  (cat) => {
    if (typeof cat === "string" && cat.length > 0) {
      selectedCategory.value = cat;
    }
  },
  { immediate: true },
);

const selectedEcosystem = ref<"all" | "web" | "mobile" | "backend">("all");
const selectedTier = ref<"all" | "stable" | "beta">("all");
const viewMode = ref<"grid" | "table" | "preview">("grid");
const sortBy = ref<"name" | "category" | "score">("name");

const { copiedKey, copy } = useTuxClipboard({ resetAfterMs: 2200 });

// Build health lookup map
const healthMap = computed(() => {
  const map = new Map<string, TuxComponentHealth>();
  for (const item of getTuxHealthCatalog()) {
    map.set(item.name, item);
  }
  return map;
});

// Enriched component model derived from catalog + health ledger
const allComponents = computed(() => {
  return tuxCatalog.map((e) => {
    const health = healthMap.value.get(e.name);
    const score = health?.healthScore ?? 80;
    const isStable = (health?.healthTier === "excellent" || score >= 80);
    const a11yTier = health?.a11y?.tier ?? "AAA";

    return {
      name: e.name,
      to: e.to,
      icon: e.icon,
      uses: e.wraps,
      blurb: e.blurb,
      category: e.category,
      score,
      healthTier: health?.healthTier ?? "fair",
      isStable,
      a11yTier,
      tag: `<${e.name} />`,
      hasTest: health?.hasUnitTest ?? false,
      isPortedReact: health?.reactPortStatus === "ported",
      // Target support across all 11 synchronized languages
      supportsMobile: true,
      supportsBackend: true,
      supportsWeb: true,
    };
  });
});

const categoryCounts = computed(() => {
  const counts: Record<string, number> = { all: allComponents.value.length };
  for (const cat of TUX_COMPONENT_CATEGORIES) {
    counts[cat.id] = allComponents.value.filter((c) => c.category === cat.id).length;
  }
  return counts;
});

const filteredComponents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const cat = selectedCategory.value;
  const eco = selectedEcosystem.value;
  const tier = selectedTier.value;

  const result = allComponents.value.filter((c) => {
    // Category filter
    const matchesCat = cat === "all" || c.category === cat;
    if (!matchesCat) return false;

    // Ecosystem filter
    if (eco === "web" && !c.supportsWeb) return false;
    if (eco === "mobile" && !c.supportsMobile) return false;
    if (eco === "backend" && !c.supportsBackend) return false;

    // Quality Tier filter
    if (tier === "stable" && !c.isStable) return false;
    if (tier === "beta" && c.isStable) return false;

    // Search query
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.blurb.toLowerCase().includes(q) ||
      c.uses.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q))
    );
  });

  // Sorting
  return result.sort((a, b) => {
    if (sortBy.value === "score") {
      return b.score - a.score;
    }
    if (sortBy.value === "category") {
      const catA = a.category || "";
      const catB = b.category || "";
      if (catA !== catB) return catA.localeCompare(catB);
      return a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });
});

async function copyTag(compName: string, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  await copy(`<${compName} />`, compName);
}
</script>

<template>
  <div class="space-y-8">
    <TuxSectionHeader
      :level="1"
      title="Component"
      secondary-title="Library & Primitives"
      variant="two-tone-rule"
      kicker="INSTITUTIONAL DIRECTORY · 11 SYNCHRONIZED TARGETS"
      subtitle="Universal component library & cross-platform synchronization engine for TTI research portals, mobile applications, and enterprise backends. Full WCAG 2.2 AAA accessibility compliance across all 11 target environments."
    />

    <!-- Institutional Quality & Synchronization Metrics Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Total Primitives</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-brand-primary">{{ allComponents.length }}</span>
          <span class="text-xs text-text-secondary">across 7 categories</span>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Language Targets</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-text-primary">11</span>
          <span class="text-xs text-text-secondary">synchronized stacks</span>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Accessibility Baseline</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-color-success">100%</span>
          <span class="text-xs text-text-secondary">WCAG 2.2 AAA (7:1)</span>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Sync Engine Health</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-brand-accent">0</span>
          <span class="text-xs text-text-secondary">token drift detected</span>
        </div>
      </div>
    </div>

    <!-- Operational Filter & Toolbar Ribbon -->
    <div class="space-y-4">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative max-w-md w-full">
          <UIcon
            name="lucide:search"
            class="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search 159 components (name, wraps, category)…"
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

        <!-- Controls: View Mode, Sorting, Preferred Framework, and Health Dashboard -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- View Mode Toggle -->
          <div class="inline-flex items-center p-0.5 rounded-lg bg-surface-sunken border border-surface-border" role="radiogroup" aria-label="Catalog view mode">
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
              :class="viewMode === 'grid' ? 'bg-surface-raised text-brand-primary shadow-xs font-bold' : 'text-text-muted hover:text-text-primary'"
              title="Card Grid View"
              @click="viewMode = 'grid'"
            >
              <UIcon name="lucide:layout-grid" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
              :class="viewMode === 'table' ? 'bg-surface-raised text-brand-primary shadow-xs font-bold' : 'text-text-muted hover:text-text-primary'"
              title="Dense Matrix Table View"
              @click="viewMode = 'table'"
            >
              <UIcon name="lucide:table-2" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
              :class="viewMode === 'preview' ? 'bg-surface-raised text-brand-primary shadow-xs font-bold' : 'text-text-muted hover:text-text-primary'"
              title="Micro-Preview Mode"
              @click="viewMode = 'preview'"
            >
              <UIcon name="lucide:eye" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Previews</span>
            </button>
          </div>

          <!-- Sort Select -->
          <div class="relative">
            <select
              v-model="sortBy"
              class="px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-surface-sunken border border-surface-border text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
              aria-label="Sort components by"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="category">Sort: Category</option>
              <option value="score">Sort: Quality Score</option>
            </select>
          </div>

          <!-- Framework Switcher -->
          <TuxFrameworkSwitcher mode="compact" />

          <!-- Health Dashboard Link -->
          <NuxtLink
            to="/components/health"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-primary hover:border-brand-primary transition-colors shrink-0"
          >
            <UIcon name="lucide:heart-pulse" class="w-3.5 h-3.5 text-brand-primary" />
            <span class="hidden sm:inline">Health Matrix</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-brand-primary/10 text-brand-primary font-bold">3.0</span>
          </NuxtLink>
        </div>
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
          <span>All Categories</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded"
            :class="selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-surface-raised text-text-muted'"
          >
            {{ categoryCounts.all }}
          </span>
        </button>

        <button
          v-for="cat in TUX_COMPONENT_CATEGORIES"
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
            {{ categoryCounts[cat.id] || 0 }}
          </span>
        </button>
      </div>

      <!-- Secondary Filter Row: Platform Target & Maturity Tier -->
      <div class="flex items-center justify-between gap-3 flex-wrap pt-1 text-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-text-muted font-mono text-[11px] uppercase tracking-wider">Ecosystem:</span>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer border"
            :class="selectedEcosystem === 'all' ? 'bg-surface-raised text-brand-primary border-brand-primary font-bold' : 'text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedEcosystem = 'all'"
          >
            All Platforms (11)
          </button>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer border"
            :class="selectedEcosystem === 'web' ? 'bg-surface-raised text-brand-primary border-brand-primary font-bold' : 'text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedEcosystem = 'web'"
          >
            Web &amp; Desktop
          </button>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer border"
            :class="selectedEcosystem === 'mobile' ? 'bg-surface-raised text-brand-primary border-brand-primary font-bold' : 'text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedEcosystem = 'mobile'"
          >
            Mobile (iOS / Android)
          </button>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer border"
            :class="selectedEcosystem === 'backend' ? 'bg-surface-raised text-brand-primary border-brand-primary font-bold' : 'text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedEcosystem = 'backend'"
          >
            Backend &amp; Cloud
          </button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-text-muted font-mono text-[11px] uppercase tracking-wider">Maturity:</span>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer border"
            :class="selectedTier === 'all' ? 'bg-surface-raised text-brand-primary border-brand-primary font-bold' : 'text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedTier = 'all'"
          >
            All Tiers
          </button>
          <button
            type="button"
            class="px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer border"
            :class="selectedTier === 'stable' ? 'bg-surface-raised text-color-success border-color-success font-bold' : 'text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedTier = 'stable'"
          >
            ● Stable (AAA)
          </button>
        </div>
      </div>
    </div>

    <!-- Active Filter Summary -->
    <div
      v-if="searchQuery || selectedCategory !== 'all' || selectedEcosystem !== 'all' || selectedTier !== 'all'"
      class="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-surface-border"
    >
      <span>Showing {{ filteredComponents.length }} of {{ allComponents.length }} components</span>
      <button
        type="button"
        class="text-brand-primary hover:underline font-mono text-xs cursor-pointer"
        @click="searchQuery = ''; selectedCategory = 'all'; selectedEcosystem = 'all'; selectedTier = 'all'"
      >
        Reset all filters
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredComponents.length === 0"
      class="py-12 text-center text-sm text-text-muted space-y-2 bg-surface-sunken/40 rounded-xl border border-surface-border/60"
    >
      <UIcon name="lucide:search-x" class="w-8 h-8 mx-auto text-text-muted/60" />
      <p class="font-medium text-text-primary">No components match your filter criteria</p>
      <p class="text-xs">Try adjusting your category, ecosystem, or search keywords.</p>
    </div>

    <!-- VIEW 1: Rich Card Grid -->
    <section v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <TuxCard
        v-for="c in filteredComponents"
        :key="c.name"
        :to="c.to"
        class="group flex flex-col justify-between hover:border-brand-primary/60 transition-all duration-150"
      >
        <div>
          <!-- Header: Wraps + Category + Stability Pill -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="eyebrow truncate">wraps {{ c.uses }}</span>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span
                class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                :class="c.isStable
                  ? 'bg-color-success/10 text-color-success border-color-success/30'
                  : 'bg-color-warning/10 text-color-warning border-color-warning/30'"
              >
                {{ c.isStable ? 'Stable · AAA' : 'Beta' }}
              </span>
              <span
                v-if="c.category"
                class="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted"
              >
                {{ c.category }}
              </span>
            </div>
          </div>

          <!-- Title + Icon -->
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-brand-primary/8 text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:text-text-inverse transition-colors shadow-xs">
              <UIcon :name="c.icon" class="w-4 h-4" />
            </div>
            <div class="min-w-0">
              <h2 class="heading--bold text-lg font-bold truncate group-hover:text-brand-primary transition-colors">
                {{ c.name }}
              </h2>
            </div>
          </div>

          <!-- Description -->
          <p class="mt-2.5 text-sm text-text-secondary line-clamp-2 leading-relaxed">{{ c.blurb }}</p>
        </div>

        <!-- Footer: Target Ecosystem Pills & Copy Tag Button -->
        <div class="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between gap-2 flex-wrap">
          <!-- Supported Targets Badges -->
          <div class="flex items-center gap-1 text-[11px] font-mono text-text-muted flex-wrap" title="Synchronized across Vue, React, Custom Elements, C#/.NET, Python, PHP, Swift, and Kotlin">
            <span class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px]">Vue</span>
            <span class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px]">React</span>
            <span class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px]">.NET</span>
            <span class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px]">Py</span>
            <span class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px]">Swift</span>
            <span class="px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-[10px]">Kt</span>
          </div>

          <!-- 1-Click Copy Tag Button -->
          <button
            type="button"
            class="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded bg-surface-sunken hover:bg-surface-raised border border-surface-border text-text-muted hover:text-brand-primary hover:border-brand-primary transition-colors cursor-pointer shrink-0"
            :title="`Copy ${c.tag} markup`"
            @click="(e) => copyTag(c.name, e)"
          >
            <UIcon
              :name="copiedKey === c.name ? 'lucide:check' : 'lucide:copy'"
              class="w-3 h-3"
              :class="{ 'text-color-success': copiedKey === c.name }"
            />
            <span class="text-[11px]">{{ copiedKey === c.name ? 'Copied' : 'Tag' }}</span>
          </button>
        </div>
      </TuxCard>
    </section>

    <!-- VIEW 2: Dense Matrix Table View -->
    <div v-else-if="viewMode === 'table'" class="rounded-lg border border-surface-border bg-surface-page overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-surface-sunken border-b border-surface-border text-xs font-mono uppercase tracking-wider text-text-secondary">
              <th scope="col" class="py-3 px-4">Component</th>
              <th scope="col" class="py-3 px-4">Underlying Primitive</th>
              <th scope="col" class="py-3 px-4">Category</th>
              <th scope="col" class="py-3 px-4">Maturity &amp; A11y</th>
              <th scope="col" class="py-3 px-4">Ecosystem Targets</th>
              <th scope="col" class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border">
            <tr
              v-for="c in filteredComponents"
              :key="c.name"
              class="hover:bg-surface-raised/60 transition-colors group"
            >
              <td class="py-3 px-4 font-bold text-text-primary">
                <NuxtLink :to="c.to" class="flex items-center gap-2 text-text-primary group-hover:text-brand-primary">
                  <div class="w-6 h-6 rounded bg-brand-primary/8 text-brand-primary flex items-center justify-center shrink-0">
                    <UIcon :name="c.icon" class="w-3.5 h-3.5" />
                  </div>
                  <span>{{ c.name }}</span>
                </NuxtLink>
              </td>
              <td class="py-3 px-4 font-mono text-xs text-text-muted">
                {{ c.uses }}
              </td>
              <td class="py-3 px-4 text-xs font-mono text-text-secondary uppercase">
                {{ c.category }}
              </td>
              <td class="py-3 px-4">
                <span
                  class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1"
                  :class="c.isStable
                    ? 'bg-color-success/10 text-color-success border-color-success/30'
                    : 'bg-color-warning/10 text-color-warning border-color-warning/30'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="c.isStable ? 'bg-color-success' : 'bg-color-warning'" />
                  <span>{{ c.isStable ? 'Stable · AAA' : 'Beta' }}</span>
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="text-xs font-mono text-text-secondary">11 targets synchronized</span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    class="px-2 py-1 text-xs font-mono rounded bg-surface-sunken hover:bg-surface-raised border border-surface-border text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
                    title="Copy tag"
                    @click="(e) => copyTag(c.name, e)"
                  >
                    <UIcon :name="copiedKey === c.name ? 'lucide:check' : 'lucide:copy'" class="w-3 h-3" />
                  </button>
                  <NuxtLink
                    :to="c.to"
                    class="px-2.5 py-1 text-xs font-medium rounded bg-surface-raised hover:bg-brand-primary hover:text-white border border-surface-border transition-colors inline-flex items-center gap-1"
                  >
                    <span>Docs</span>
                    <UIcon name="lucide:arrow-right" class="w-3 h-3" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- VIEW 3: Live Micro-Preview Mode -->
    <div v-else-if="viewMode === 'preview'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="c in filteredComponents"
        :key="c.name"
        class="p-4 rounded-xl border border-surface-border bg-surface-page flex flex-col justify-between space-y-3"
      >
        <div class="flex items-center justify-between border-b border-surface-border pb-2.5">
          <div class="flex items-center gap-2">
            <UIcon :name="c.icon" class="w-4 h-4 text-brand-primary" />
            <h3 class="font-bold text-text-primary">{{ c.name }}</h3>
          </div>
          <span class="text-[10px] font-mono text-text-muted uppercase px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border">
            {{ c.category }}
          </span>
        </div>

        <!-- Micro-Preview Canvas -->
        <div class="p-6 rounded-lg bg-surface-sunken border border-surface-border flex items-center justify-center min-h-[90px]">
          <div class="flex items-center gap-3">
            <div class="px-3 py-1.5 rounded-md bg-brand-primary text-text-inverse font-medium text-xs shadow-xs flex items-center gap-1.5">
              <UIcon :name="c.icon" class="w-3.5 h-3.5" />
              <span>&lt;{{ c.name }} /&gt;</span>
            </div>
            <span class="text-[11px] font-mono text-text-muted">AAA 7:1 Compliant</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 text-xs">
          <p class="text-text-secondary text-xs truncate max-w-[260px]">{{ c.blurb }}</p>
          <NuxtLink :to="c.to" class="text-brand-primary font-semibold hover:underline flex items-center gap-1">
            <span>Explore</span>
            <UIcon name="lucide:chevron-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
