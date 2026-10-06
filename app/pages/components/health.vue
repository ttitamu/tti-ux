<script setup lang="ts">
import {
  getTuxHealthCatalog,
  getTuxHealthSummary,
  filterHealthCatalog,
  type TuxComponentHealth,
  type TuxHealthTier,
} from "~/utils/tuxHealthCatalog";
import { TUX_COMPONENT_CATEGORIES, TUX_VIZ_CATEGORIES } from "~/utils/tuxCatalog";

useHead({ title: "Component Health & Qualification · TUX" });

const summary = computed(() => getTuxHealthSummary());
const allItems = computed(() => getTuxHealthCatalog());

// Filters & sorting state
const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedTier = ref("all");
const selectedA11y = ref("all");
const gapsOnly = ref(false);
const missingTestsOnly = ref(false);
const sortColumn = ref<"score" | "name" | "category" | "test" | "a11y">("score");
const sortDirection = ref<"asc" | "desc">("asc");

const { copied, copy } = useTuxClipboard();
const { copied: copiedLink, copy: copyLink } = useTuxClipboard();

onMounted(() => {
  if (route.query.query && typeof route.query.query === "string") {
    searchQuery.value = route.query.query;
  }
  if (route.query.category && typeof route.query.category === "string") {
    selectedCategory.value = route.query.category;
  }
  if (route.query.tier && typeof route.query.tier === "string") {
    selectedTier.value = route.query.tier;
  }
  if (route.query.a11y && typeof route.query.a11y === "string") {
    selectedA11y.value = route.query.a11y;
  }
  if (route.query.gaps === "true") {
    gapsOnly.value = true;
  }
  if (route.query.missingTests === "true") {
    missingTestsOnly.value = true;
  }
  if (route.query.sort && typeof route.query.sort === "string") {
    const s = route.query.sort as any;
    if (["score", "name", "category", "test", "a11y"].includes(s)) {
      sortColumn.value = s;
    }
  }
  if (route.query.dir === "asc" || route.query.dir === "desc") {
    sortDirection.value = route.query.dir;
  }
});

let syncTimer: any = null;
watch(
  [searchQuery, selectedCategory, selectedTier, selectedA11y, gapsOnly, missingTestsOnly, sortColumn, sortDirection],
  () => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      const q: Record<string, string> = { ...route.query } as any;
      if (searchQuery.value) q.query = searchQuery.value;
      else delete q.query;

      if (selectedCategory.value !== "all") q.category = selectedCategory.value;
      else delete q.category;

      if (selectedTier.value !== "all") q.tier = selectedTier.value;
      else delete q.tier;

      if (selectedA11y.value !== "all") q.a11y = selectedA11y.value;
      else delete q.a11y;

      if (gapsOnly.value) q.gaps = "true";
      else delete q.gaps;

      if (missingTestsOnly.value) q.missingTests = "true";
      else delete q.missingTests;

      if (sortColumn.value !== "score") q.sort = sortColumn.value;
      else delete q.sort;

      if (sortDirection.value !== "asc") q.dir = sortDirection.value;
      else delete q.dir;

      router.replace({ query: q });
    }, 150);
  }
);

function shareDeepLink() {
  if (import.meta.client) {
    copyLink(window.location.href);
  }
}

const filteredItems = computed(() => {
  let list = filterHealthCatalog(allItems.value, {
    query: searchQuery.value,
    category: selectedCategory.value,
    tier: selectedTier.value,
    a11yTier: selectedA11y.value,
    gapsOnly: gapsOnly.value,
    missingTestsOnly: missingTestsOnly.value,
  });

  list.sort((a, b) => {
    let comparison = 0;
    if (sortColumn.value === "score") {
      comparison = a.healthScore - b.healthScore;
    } else if (sortColumn.value === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortColumn.value === "category") {
      comparison = a.categoryLabel.localeCompare(b.categoryLabel);
    } else if (sortColumn.value === "test") {
      comparison = Number(a.hasUnitTest) - Number(b.hasUnitTest);
    } else if (sortColumn.value === "a11y") {
      comparison = a.a11y.tier.localeCompare(b.a11y.tier);
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  return list;
});

function toggleSort(col: "score" | "name" | "category" | "test" | "a11y") {
  if (sortColumn.value === col) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = col;
    sortDirection.value = "asc";
  }
}

function getTierTone(tier: TuxHealthTier) {
  if (tier === "excellent") return "success";
  if (tier === "fair") return "warning";
  return "danger";
}

function getTierColorClass(tier: TuxHealthTier) {
  if (tier === "excellent") return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (tier === "fair") return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20";
}

function exportHealthReport() {
  const lines = [
    `# TTI-UX 3.0 Component Health & Accessibility Report`,
    `Generated: ${new Date().toISOString()}`,
    `Standard: W3C WCAG 2.2 Level AAA (Contrast >= 7.0:1, Target >= 44px, Focus Ring >= 3px)`,
    `Total Components Tracked: ${summary.value.totalComponents}`,
    `Average Health Score: ${summary.value.averageScore}/100`,
    `WCAG 2.2 AAA Compliance: ${summary.value.a11yAAAComplianceCount}/${summary.value.totalComponents} (${summary.value.a11yAAACompliancePercent}%)`,
    `Showcase Coverage: ${summary.value.showcaseCoverageCount}/${summary.value.totalComponents} (${summary.value.showcaseCoveragePercent}%)`,
    `Unit Test Coverage: ${summary.value.testCoverageCount}/${summary.value.totalComponents} (${summary.value.testCoveragePercent}%)`,
    `React Port Coverage: ${summary.value.reactPortCount}/${summary.value.totalComponents} (${summary.value.reactPortPercent}%)`,
    ``,
    `## Quality Tiers`,
    `- Excellent (>=80): ${summary.value.tiers.excellent}`,
    `- Fair (50-79): ${summary.value.tiers.fair}`,
    `- Needs Attention (<50): ${summary.value.tiers.needsAttention}`,
    ``,
    `## Top Gap Candidates (Missing Tests)`,
    ...summary.value.gaps.missingTests.slice(0, 10).map((c) => `- ${c.name} (${c.categoryLabel}) - Score: ${c.healthScore}`),
  ];
  copy(lines.join("\n"));
}
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <TuxPageHeader
        eyebrow="system telemetry"
        title="Component Health & Qualification"
      >
        Enterprise 3.0 readiness monitor across all 175 components and primitives.
        Quantifies coverage across Vitest unit test suites, multi-framework ports,
        and living showcase documentation.
      </TuxPageHeader>

      <div class="flex items-center gap-2 pt-2 flex-wrap sm:shrink-0">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-primary transition-colors cursor-pointer"
          :class="{ 'border-emerald-500 text-emerald-600': copiedLink }"
          @click="shareDeepLink"
          aria-label="Share filtered health view URL"
        >
          <UIcon :name="copiedLink ? 'lucide:check' : 'lucide:share-2'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copiedLink }" />
          <span>{{ copiedLink ? "Copied Link" : "Share View" }}</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-primary transition-colors cursor-pointer"
          @click="exportHealthReport"
        >
          <UIcon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" :class="{ 'text-emerald-500': copied }" />
          <span>{{ copied ? "Copied Report" : "Export Report" }}</span>
        </button>

        <NuxtLink
          to="/components"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-muted hover:text-text-primary transition-colors"
        >
          <UIcon name="lucide:layout-grid" class="w-3.5 h-3.5" />
          <span>All Components</span>
        </NuxtLink>
      </div>
    </div>

    <!-- KPI Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/60 flex flex-col justify-between">
        <span class="text-xs font-mono text-text-muted uppercase tracking-wider">Total Census</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-brand-primary font-mono">{{ summary.totalComponents }}</span>
          <span class="text-xs text-text-muted font-mono">primitives</span>
        </div>
        <p class="mt-2 text-[11px] text-text-muted">149 catalog · 16 internal · 10 desk</p>
      </div>

      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/60 flex flex-col justify-between">
        <span class="text-xs font-mono text-text-muted uppercase tracking-wider">Showcase Coverage</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{{ summary.showcaseCoveragePercent }}%</span>
          <span class="text-xs text-text-muted font-mono">{{ summary.showcaseCoverageCount }}/{{ summary.totalComponents }}</span>
        </div>
        <div class="mt-2 w-full bg-surface-raised h-1.5 rounded-full overflow-hidden">
          <div class="bg-emerald-500 h-full rounded-full" :style="{ width: `${summary.showcaseCoveragePercent}%` }" />
        </div>
      </div>

      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/60 flex flex-col justify-between">
        <span class="text-xs font-mono text-text-muted uppercase tracking-wider">Unit Test Coverage</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{{ summary.testCoverageCount }}</span>
          <span class="text-xs text-text-muted font-mono">suites ({{ summary.testCoveragePercent }}%)</span>
        </div>
        <div class="mt-2 w-full bg-surface-raised h-1.5 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full rounded-full" :style="{ width: `${summary.testCoveragePercent}%` }" />
        </div>
      </div>

      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/60 flex flex-col justify-between">
        <span class="text-xs font-mono text-text-muted uppercase tracking-wider">WCAG 2.2 Level AAA</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{{ summary.a11yAAACompliancePercent }}%</span>
          <span class="text-xs text-text-muted font-mono">{{ summary.a11yAAAComplianceCount }}/{{ summary.totalComponents }}</span>
        </div>
        <div class="mt-2 flex items-center gap-1.5">
          <TuxBadge tone="success" variant="soft" class="text-[10px]">
            <UIcon name="lucide:shield-check" class="w-3 h-3 inline mr-1 text-emerald-500" />
            Institutional AAA
          </TuxBadge>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-surface-border bg-surface-sunken/60 flex flex-col justify-between">
        <span class="text-xs font-mono text-text-muted uppercase tracking-wider">Health Average</span>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold font-mono text-text-primary">{{ summary.averageScore }}</span>
          <span class="text-xs text-text-muted font-mono">/ 100</span>
        </div>
        <div class="mt-2 flex items-center gap-1.5">
          <TuxBadge
            :tone="summary.averageScore >= 50 ? 'warning' : 'danger'"
            variant="soft"
            class="text-[10px]"
          >
            {{ summary.averageScore >= 80 ? 'Production Ready' : summary.averageScore >= 50 ? 'Maturing Tier' : 'Needs Test Expansion' }}
          </TuxBadge>
        </div>
      </div>
    </div>

    <!-- Health Quality Tier Distribution -->
    <div class="p-5 rounded-xl border border-surface-border bg-surface-sunken/40 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
        <div class="flex items-center gap-2">
          <UIcon name="lucide:gauge" class="w-4 h-4 text-brand-primary" />
          <h2 class="text-sm font-semibold text-text-primary">System Quality Distribution</h2>
        </div>
        <span class="text-xs text-text-muted font-mono leading-relaxed">Weighted composite score (Showcase 30% · Test 35% · Ports 20% · Metadata 15%)</span>
      </div>

      <!-- Segmented Bar -->
      <div class="w-full h-3 rounded-full bg-surface-raised overflow-hidden flex">
        <div
          class="bg-emerald-500 transition-all duration-300"
          :style="{ width: `${(summary.tiers.excellent / summary.totalComponents) * 100}%` }"
          :title="`Excellent (>=80): ${summary.tiers.excellent}`"
        />
        <div
          class="bg-amber-500 transition-all duration-300"
          :style="{ width: `${(summary.tiers.fair / summary.totalComponents) * 100}%` }"
          :title="`Fair (50-79): ${summary.tiers.fair}`"
        />
        <div
          class="bg-rose-500 transition-all duration-300"
          :style="{ width: `${(summary.tiers.needsAttention / summary.totalComponents) * 100}%` }"
          :title="`Needs Attention (<50): ${summary.tiers.needsAttention}`"
        />
      </div>

      <!-- Legend -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div
          class="flex items-center justify-between p-2.5 rounded-lg border border-surface-border bg-surface-raised/40 cursor-pointer hover:bg-surface-raised transition-colors"
          :class="{ 'ring-2 ring-emerald-500': selectedTier === 'excellent' }"
          @click="selectedTier = selectedTier === 'excellent' ? 'all' : 'excellent'"
        >
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span class="text-xs font-medium text-text-primary">Tier 1 · Verified (≥80)</span>
          </div>
          <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ summary.tiers.excellent }}</span>
        </div>

        <div
          class="flex items-center justify-between p-2.5 rounded-lg border border-surface-border bg-surface-raised/40 cursor-pointer hover:bg-surface-raised transition-colors"
          :class="{ 'ring-2 ring-amber-500': selectedTier === 'fair' }"
          @click="selectedTier = selectedTier === 'fair' ? 'all' : 'fair'"
        >
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span class="text-xs font-medium text-text-primary">Tier 2 · Maturing (50–79)</span>
          </div>
          <span class="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{{ summary.tiers.fair }}</span>
        </div>

        <div
          class="flex items-center justify-between p-2.5 rounded-lg border border-surface-border bg-surface-raised/40 cursor-pointer hover:bg-surface-raised transition-colors"
          :class="{ 'ring-2 ring-rose-500': selectedTier === 'needs-attention' }"
          @click="selectedTier = selectedTier === 'needs-attention' ? 'all' : 'needs-attention'"
        >
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span class="text-xs font-medium text-text-primary">Tier 3 · Untested (<50)</span>
          </div>
          <span class="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{{ summary.tiers.needsAttention }}</span>
        </div>
      </div>
    </div>

    <!-- Category Breakdown Ribbon -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-text-primary flex items-center gap-2">
          <UIcon name="lucide:layers" class="w-4 h-4 text-brand-primary" />
          <span>Category Health Breakdown</span>
        </h2>
        <span class="text-xs text-text-muted">Click any category card to filter the matrix below</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="cat in summary.byCategory"
          :key="cat.id"
          class="p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between"
          :class="[
            selectedCategory === cat.id
              ? 'border-brand-primary bg-brand-primary/5 shadow-xs'
              : 'border-surface-border bg-surface-sunken hover:bg-surface-raised'
          ]"
          @click="selectedCategory = selectedCategory === cat.id ? 'all' : cat.id"
        >
          <div class="flex items-start justify-between gap-1">
            <div class="flex items-center gap-1.5 truncate">
              <UIcon :name="cat.icon" class="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span class="text-xs font-medium text-text-primary truncate">{{ cat.label }}</span>
            </div>
            <span class="text-[11px] font-mono text-text-muted shrink-0">{{ cat.count }}</span>
          </div>

          <div class="mt-3 space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-mono">
              <span class="text-text-muted">Score</span>
              <span
                class="font-bold"
                :class="cat.avgScore >= 60 ? 'text-emerald-600 dark:text-emerald-400' : cat.avgScore >= 45 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'"
              >
                {{ cat.avgScore }}/100
              </span>
            </div>
            <div class="w-full bg-surface-raised h-1 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :class="cat.avgScore >= 60 ? 'bg-emerald-500' : cat.avgScore >= 45 ? 'bg-amber-500' : 'bg-rose-500'"
                :style="{ width: `${cat.avgScore}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-[10px] text-text-muted pt-0.5">
              <span>Tests: {{ cat.testedCount }}/{{ cat.count }}</span>
              <span>Ported: {{ cat.portedCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Matrix & Filter Toolbar -->
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-text-primary flex items-center gap-2">
          <UIcon name="lucide:table-properties" class="w-4 h-4 text-brand-primary" />
          <span>Component Health Matrix</span>
          <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-raised text-text-muted">
            {{ filteredItems.length }} of {{ allItems.length }}
          </span>
        </h2>

        <!-- Quick Filter Toggles -->
        <div class="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            class="px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer"
            :class="selectedA11y === 'AAA' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40' : 'bg-surface-sunken text-text-muted border-surface-border hover:text-text-primary'"
            @click="selectedA11y = selectedA11y === 'AAA' ? 'all' : 'AAA'"
          >
            <UIcon name="lucide:shield-check" class="w-3 h-3 inline mr-1 text-emerald-600 dark:text-emerald-400" />
            WCAG 2.2 AAA ({{ summary.a11yAAAComplianceCount }})
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer"
            :class="gapsOnly ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40' : 'bg-surface-sunken text-text-muted border-surface-border hover:text-text-primary'"
            @click="gapsOnly = !gapsOnly"
          >
            <UIcon name="lucide:alert-triangle" class="w-3 h-3 inline mr-1" />
            Gaps Only (&lt;80)
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer"
            :class="missingTestsOnly ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40' : 'bg-surface-sunken text-text-muted border-surface-border hover:text-text-primary'"
            @click="missingTestsOnly = !missingTestsOnly"
          >
            <UIcon name="lucide:test-tube" class="w-3 h-3 inline mr-1" />
            Missing Tests Only
          </button>

          <button
            v-if="selectedCategory !== 'all' || selectedTier !== 'all' || selectedA11y !== 'all' || gapsOnly || missingTestsOnly || searchQuery"
            type="button"
            class="px-2.5 py-1 rounded-lg text-text-muted hover:text-text-primary border border-dashed border-surface-border cursor-pointer transition-colors"
            @click="searchQuery = ''; selectedCategory = 'all'; selectedTier = 'all'; selectedA11y = 'all'; gapsOnly = false; missingTestsOnly = false;"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative max-w-md">
        <UIcon
          name="lucide:search"
          class="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Filter matrix (name, category, wraps, blurb)…"
          class="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-surface-sunken border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
          @click="searchQuery = ''"
        >
          <UIcon name="lucide:x" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Health Table -->
      <div class="overflow-x-auto rounded-xl border border-surface-border bg-surface-card">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-surface-border bg-surface-sunken/60 text-text-muted font-mono font-medium">
              <th
                class="py-3 px-4 cursor-pointer hover:text-text-primary select-none"
                @click="toggleSort('name')"
              >
                <div class="flex items-center gap-1.5">
                  <span>Component</span>
                  <UIcon v-if="sortColumn === 'name'" :name="sortDirection === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-brand-primary" />
                </div>
              </th>
              <th
                class="py-3 px-4 cursor-pointer hover:text-text-primary select-none"
                @click="toggleSort('category')"
              >
                <div class="flex items-center gap-1.5">
                  <span>Category / Family</span>
                  <UIcon v-if="sortColumn === 'category'" :name="sortDirection === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-brand-primary" />
                </div>
              </th>
              <th class="py-3 px-4">Showcase Page</th>
              <th
                class="py-3 px-4 cursor-pointer hover:text-text-primary select-none"
                @click="toggleSort('test')"
              >
                <div class="flex items-center gap-1.5">
                  <span>Unit Test</span>
                  <UIcon v-if="sortColumn === 'test'" :name="sortDirection === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-brand-primary" />
                </div>
              </th>
              <th
                class="py-3 px-4 cursor-pointer hover:text-text-primary select-none"
                @click="toggleSort('a11y')"
              >
                <div class="flex items-center gap-1.5">
                  <span>Accessibility</span>
                  <UIcon v-if="sortColumn === 'a11y'" :name="sortDirection === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-brand-primary" />
                </div>
              </th>
              <th class="py-3 px-4">React Port</th>
              <th
                class="py-3 px-4 cursor-pointer hover:text-text-primary select-none text-right"
                @click="toggleSort('score')"
              >
                <div class="flex items-center justify-end gap-1.5">
                  <span>Health Score</span>
                  <UIcon v-if="sortColumn === 'score'" :name="sortDirection === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" class="w-3 h-3 text-brand-primary" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border">
            <tr
              v-for="item in filteredItems"
              :key="item.name"
              class="hover:bg-surface-raised/40 transition-colors"
            >
              <!-- Component Name & Blurb -->
              <td class="py-3 px-4">
                <div class="flex items-start gap-2.5">
                  <div class="pt-0.5">
                    <UIcon
                      :name="item.kind === 'composable' ? 'lucide:code-2' : 'lucide:box'"
                      class="w-3.5 h-3.5 text-text-muted"
                    />
                  </div>
                  <div>
                    <NuxtLink
                      :to="item.to"
                      class="font-mono font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>{{ item.name }}</span>
                      <UIcon name="lucide:external-link" class="w-2.5 h-2.5 opacity-60" />
                    </NuxtLink>
                    <p class="text-[11px] text-text-muted line-clamp-1 mt-0.5 max-w-sm">{{ item.blurb }}</p>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-surface-raised border border-surface-border text-text-muted">
                  {{ item.categoryLabel }}
                </span>
              </td>

              <!-- Showcase -->
              <td class="py-3 px-4">
                <div v-if="item.hasShowcasePage && !item.isShowcaseClustered" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <UIcon name="lucide:check-circle" class="w-3.5 h-3.5" />
                  <span>Dedicated</span>
                </div>
                <div v-else-if="item.hasShowcasePage && item.isShowcaseClustered" class="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                  <UIcon name="lucide:layers" class="w-3.5 h-3.5" />
                  <span>Clustered</span>
                </div>
                <div v-else class="inline-flex items-center gap-1 text-rose-500 font-mono text-[11px]">
                  <UIcon name="lucide:x-circle" class="w-3.5 h-3.5" />
                  <span>Missing</span>
                </div>
              </td>

              <!-- Unit Test -->
              <td class="py-3 px-4">
                <div v-if="item.hasUnitTest" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <UIcon name="lucide:check-circle" class="w-3.5 h-3.5" />
                  <span>Vitest Passed</span>
                </div>
                <div v-else class="inline-flex items-center gap-1 text-text-muted font-mono text-[11px]">
                  <UIcon name="lucide:circle-dashed" class="w-3.5 h-3.5 text-text-muted/60" />
                  <span>Not covered</span>
                </div>
              </td>

              <!-- Accessibility (WCAG 2.2 AAA) -->
              <td class="py-3 px-4">
                <div class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <UIcon name="lucide:shield-check" class="w-3.5 h-3.5" />
                  <span>AAA Certified</span>
                </div>
                <div class="text-[10px] text-text-muted">7:1 · 44px · 3px ring</div>
              </td>

              <!-- React Port -->
              <td class="py-3 px-4">
                <div v-if="item.reactPortStatus === 'ported'" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <UIcon name="lucide:check-circle" class="w-3.5 h-3.5" />
                  <span>Ported</span>
                </div>
                <div v-else-if="item.reactPortStatus === 'stale'" class="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                  <UIcon name="lucide:refresh-cw" class="w-3.5 h-3.5" />
                  <span>Stale</span>
                </div>
                <div v-else class="inline-flex items-center gap-1 text-text-muted/60 font-mono text-[11px]">
                  <span>—</span>
                </div>
              </td>

              <!-- Health Score -->
              <td class="py-3 px-4 text-right">
                <span
                  class="inline-flex items-center justify-center font-mono font-bold px-2 py-0.5 rounded-full text-xs border"
                  :class="getTierColorClass(item.healthTier)"
                >
                  {{ item.healthScore }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredItems.length === 0">
              <td colspan="7" class="py-8 text-center text-text-muted">
                <UIcon name="lucide:search-x" class="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p>No components match your current filters.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Targeted Remediation Action Plan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
        <div class="flex items-center gap-2">
          <UIcon name="lucide:test-tubes" class="w-4 h-4 text-amber-500" />
          <h3 class="text-sm font-semibold text-text-primary">High-Priority Unit Test Expansion</h3>
        </div>
        <p class="text-xs text-text-muted">
          Foundational interaction components currently missing dedicated Vitest suites in <code>tests/components/</code>:
        </p>

        <ul class="space-y-2 pt-1">
          <li
            v-for="c in summary.gaps.missingTests.slice(0, 5)"
            :key="c.name"
            class="flex items-center justify-between p-2 rounded-lg bg-surface-sunken border border-surface-border text-xs font-mono"
          >
            <div class="flex items-center gap-2">
              <span class="text-brand-primary font-semibold">{{ c.name }}</span>
              <span class="text-[10px] text-text-muted">({{ c.categoryLabel }})</span>
            </div>
            <NuxtLink :to="c.to" class="text-text-muted hover:text-text-primary text-[11px] underline">
              View Specs
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
        <div class="flex items-center gap-2">
          <UIcon name="lucide:package-check" class="w-4 h-4 text-brand-primary" />
          <h3 class="text-sm font-semibold text-text-primary">Framework Port Queue</h3>
        </div>
        <p class="text-xs text-text-muted">
          Candidate primitives queued for <code>@tti/tti-ux-react</code>, Web Components, and .NET Razor export:
        </p>

        <ul class="space-y-2 pt-1">
          <li
            v-for="c in summary.gaps.lowestScores.slice(0, 5)"
            :key="c.name"
            class="flex items-center justify-between p-2 rounded-lg bg-surface-sunken border border-surface-border text-xs font-mono"
          >
            <div class="flex items-center gap-2">
              <span class="text-brand-primary font-semibold">{{ c.name }}</span>
              <span class="text-[10px] text-text-muted">Current: {{ c.healthScore }}/100</span>
            </div>
            <NuxtLink :to="c.to" class="text-text-muted hover:text-text-primary text-[11px] underline">
              Inspect
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
