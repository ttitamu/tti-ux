<script setup lang="ts">
import { tuxCatalog, TUX_COMPONENT_CATEGORIES } from "../../utils/tuxCatalog";

useHead({ title: "Components · TUX" });

const searchQuery = ref("");
const selectedCategory = ref<string>("all");

// Card grid derives from the single catalog source (app/utils/tuxCatalog.ts);
// tests/tux-catalog.test.ts guarantees every shipped component appears here.
const allComponents = tuxCatalog.map((e) => ({
  name: e.name,
  to: e.to,
  icon: e.icon,
  uses: e.wraps,
  blurb: e.blurb,
  category: e.category,
}));

const categoryCounts = computed(() => {
  const counts: Record<string, number> = { all: allComponents.length };
  for (const cat of TUX_COMPONENT_CATEGORIES) {
    counts[cat.id] = allComponents.filter((c) => c.category === cat.id).length;
  }
  return counts;
});

const filteredComponents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const cat = selectedCategory.value;

  return allComponents.filter((c) => {
    const matchesCat = cat === "all" || c.category === cat;
    if (!matchesCat) return false;

    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.blurb.toLowerCase().includes(q) ||
      c.uses.toLowerCase().includes(q)
    );
  });
});
</script>

<template>
  <div class="space-y-8">
    <TuxSectionHeader
      :level="1"
      title="Component"
      secondary-title="Library & Primitives"
      variant="two-tone-rule"
      kicker="INSTITUTIONAL DIRECTORY"
      subtitle="Component library for TTI applications. Implements institutional brand tokens, accessible high-contrast defaults, and specialized research patterns."
    />

    <!-- Operational Filter & Category Ribbon -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative max-w-md w-full">
          <UIcon
            name="lucide:search"
            class="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search all components (name, wraps, blurb)…"
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

        <!-- Health Dashboard Link -->
        <NuxtLink
          to="/components/health"
          class="inline-flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-lg border border-surface-border bg-surface-raised hover:bg-surface-sunken text-text-primary hover:border-brand-primary transition-colors shrink-0"
        >
          <UIcon name="lucide:heart-pulse" class="w-4 h-4 text-brand-primary" />
          <span>Health Dashboard</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-brand-primary/10 text-brand-primary font-bold">3.0</span>
        </NuxtLink>
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
          <span>All Components</span>
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
    </div>

    <!-- Active Filter Summary -->
    <div
      v-if="searchQuery || selectedCategory !== 'all'"
      class="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-surface-border"
    >
      <span>Showing {{ filteredComponents.length }} of {{ allComponents.length }} components</span>
      <button
        type="button"
        class="text-brand-primary hover:underline font-mono text-xs cursor-pointer"
        @click="searchQuery = ''; selectedCategory = 'all'"
      >
        Reset filters
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredComponents.length === 0"
      class="py-12 text-center text-sm text-text-muted space-y-2 bg-surface-sunken/40 rounded-xl border border-surface-border/60"
    >
      <UIcon name="lucide:search-x" class="w-8 h-8 mx-auto text-text-muted/60" />
      <p class="font-medium text-text-primary">No components match your query</p>
      <p class="text-xs">Try adjusting your category selection or search keywords.</p>
    </div>

    <!-- Card Grid -->
    <section v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TuxCard v-for="c in filteredComponents" :key="c.name" :to="c.to" class="group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="eyebrow truncate">wraps {{ c.uses }}</span>
            <span
              v-if="c.category"
              class="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted flex-shrink-0"
            >
              {{ c.category }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-brand-primary/8 text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:text-text-inverse transition-colors">
              <UIcon :name="c.icon" class="w-4 h-4" />
            </div>
            <h2 class="heading--bold text-lg font-bold truncate group-hover:text-brand-primary transition-colors">
              {{ c.name }}
            </h2>
          </div>
          <p class="mt-2 text-sm text-text-secondary line-clamp-2">{{ c.blurb }}</p>
        </div>
      </TuxCard>
    </section>
  </div>
</template>
