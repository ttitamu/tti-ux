<script setup lang="ts">
/**
 * Visualization Gallery: TuxECharts — Advanced Storytelling & Telemetry Suite
 *
 * Implements high-impact Apache ECharts visualizations designed for transportation
 * research storytelling, executive proposals, and high-density scientific telemetry.
 * Pre-configured with TUX design tokens and 100% WCAG 2.2 AAA accessibility.
 */
import { GALLERY_PRESETS, type GalleryPreset } from "~/utils/tuxEChartsGallery";

useHead({ title: "TuxECharts · Advanced Storytelling & Telemetry · TUX" });

const categories = [
  { id: "all", label: "All Showcase Presets" },
  { id: "executive", label: "Executive & Policy" },
  { id: "realtime", label: "Real-Time & Racing" },
  { id: "spatial", label: "Spatial & Temporal" },
  { id: "hierarchical", label: "Hierarchical & Composition" },
  { id: "custom", label: "Unstructured & Custom" },
] as const;

const activeCategory = ref<string>("all");
const selectedPresetId = ref<string>("pie-rose");
const showCodeSnippet = ref<boolean>(false);

const filteredPresets = computed(() => {
  if (activeCategory.value === "all") return GALLERY_PRESETS;
  return GALLERY_PRESETS.filter((p) => p.category === activeCategory.value);
});

const currentPreset = computed<GalleryPreset>(() => {
  return GALLERY_PRESETS.find((p) => p.id === selectedPresetId.value) || GALLERY_PRESETS[0];
});

// Reactivity to dark/light theme switch
const isDark = ref(false);
onMounted(() => {
  if (typeof window !== "undefined") {
    isDark.value = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
      document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      isDark.value = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
        document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
  }
});

function selectPreset(id: string) {
  selectedPresetId.value = id;
}
</script>

<template>
  <div class="space-y-12">
    <!-- Header -->
    <TuxPageHeader
      eyebrow="data viz · advanced storytelling & telemetry"
      title="TuxECharts"
    >
      First-class Apache ECharts integration engineered for high-density Canvas and WebGL
      scientific telemetry, multi-node distributed training benchmarks, and transformative
      research storytelling. Beyond static tables, dynamic charts illuminate findings,
      persuade legislative sponsors, and bring transportation studies to life.
    </TuxPageHeader>

    <!-- Category Filter Tabs -->
    <section aria-labelledby="category-filter-heading">
      <h2 id="category-filter-heading" class="sr-only">
        Visualization Categories
      </h2>
      <div
        class="flex flex-wrap items-center gap-2 p-1.5 bg-surface-sunken border border-surface-border rounded-md"
        role="tablist"
        aria-label="Storytelling visualization categories"
      >
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          role="tab"
          :aria-selected="activeCategory === cat.id"
          class="min-h-[44px] px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-2"
          :class="[
            activeCategory === cat.id
              ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
              : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary hover:border-text-muted',
          ]"
          @click="activeCategory = cat.id"
        >
          <span>{{ cat.label }}</span>
          <span
            class="px-1.5 py-0.5 rounded-full text-[10px] font-mono"
            :class="activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface-sunken text-text-muted'"
          >
            {{ cat.id === 'all' ? GALLERY_PRESETS.length : GALLERY_PRESETS.filter(p => p.category === cat.id).length }}
          </span>
        </button>
      </div>
    </section>

    <!-- Flagship Featured Exhibit Showcase -->
    <section aria-labelledby="featured-exhibit-heading">
      <div class="flex items-center justify-between gap-4 mb-4">
        <div>
          <p class="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Interactive Showcase
          </p>
          <h2 id="featured-exhibit-heading" class="text-xl font-bold font-display uppercase text-text-primary">
            Featured Storytelling Exhibit
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="min-h-[44px] px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-surface-raised border border-surface-border text-text-secondary hover:text-text-primary rounded-xs transition-colors inline-flex items-center gap-1.5"
            @click="showCodeSnippet = !showCodeSnippet"
          >
            <span aria-hidden="true">&lt;/&gt;</span>
            <span>{{ showCodeSnippet ? 'Hide Code' : 'View Code' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Preset Selector Ribbon -->
      <div
        class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin"
        role="group"
        aria-label="Preset quick switcher"
      >
        <button
          v-for="preset in filteredPresets"
          :key="preset.id"
          type="button"
          class="min-h-[44px] px-3 py-2 text-xs font-bold rounded-xs border whitespace-nowrap transition-all flex items-center gap-2 shrink-0"
          :class="[
            selectedPresetId === preset.id
              ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black'
              : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary',
          ]"
          @click="selectPreset(preset.id)"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="selectedPresetId === preset.id ? 'bg-brand-primary' : 'bg-surface-border'"
            aria-hidden="true"
          />
          <span>{{ preset.title }}</span>
        </button>
      </div>

      <!-- Flagship Chart Frame Container -->
      <TuxChartFrame
        :eyebrow="currentPreset.eyebrow"
        :title="currentPreset.title"
        :subtitle="currentPreset.subtitle"
        :source="currentPreset.source"
      >
        <TuxECharts
          :key="`${currentPreset.id}-${isDark}`"
          :options="currentPreset.getOption(isDark)"
          :height="currentPreset.height || '420px'"
          :aria-title="currentPreset.ariaTitle"
          :aria-summary="currentPreset.ariaSummary"
        />
      </TuxChartFrame>

      <!-- Context Narrative & A11y Callout Drawer -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <!-- Story Callout -->
        <div class="p-5 bg-surface-raised border border-surface-border rounded-sm shadow-xs space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-primary" aria-hidden="true" />
            <h3 class="text-xs font-bold uppercase tracking-wider font-display text-text-primary">
              The Research Narrative
            </h3>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            {{ currentPreset.story }}
          </p>
        </div>

        <!-- Accessible Data Summary Callout -->
        <div class="p-5 bg-surface-sunken border border-surface-border rounded-sm shadow-xs space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-chart-1" aria-hidden="true" />
            <h3 class="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
              WCAG 2.2 AAA Screen-Reader Ledger
            </h3>
          </div>
          <p class="text-xs text-text-muted leading-relaxed font-mono">
            {{ currentPreset.ariaSummary }}
          </p>
        </div>
      </div>

      <!-- Copyable Code Snippet Drawer -->
      <div v-if="showCodeSnippet" class="mt-4 p-4 bg-surface-sunken border border-surface-border rounded-md">
        <p class="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 font-bold">
          Nuxt MDC / Component Implementation:
        </p>
        <pre class="p-3 bg-surface-raised rounded-xs border border-surface-border text-xs font-mono text-text-primary overflow-x-auto"><code>&lt;TuxChartFrame
  eyebrow="{{ currentPreset.eyebrow }}"
  title="{{ currentPreset.title }}"
  source="{{ currentPreset.source }}"
&gt;
  &lt;TuxECharts
    :options="chartOptions"
    height="{{ currentPreset.height || '420px' }}"
    aria-title="{{ currentPreset.ariaTitle }}"
    aria-summary="{{ currentPreset.ariaSummary }}"
  /&gt;
&lt;/TuxChartFrame&gt;</code></pre>
      </div>
    </section>

    <!-- Comprehensive Gallery Mosaic -->
    <section aria-labelledby="all-presets-heading" class="pt-6 border-t border-surface-border">
      <div class="mb-6">
        <p class="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
          Complete Catalog
        </p>
        <h2 id="all-presets-heading" class="text-xl font-bold font-display uppercase text-text-primary">
          All Interactive Storytelling Presets ({{ filteredPresets.length }})
        </h2>
        <p class="text-xs text-text-secondary mt-1">
          Explore the full spectrum of Apache ECharts visualizations tailored for institutional transportation reporting.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <article
          v-for="preset in filteredPresets"
          :key="preset.id"
          class="bg-surface-raised border border-surface-border rounded-md p-5 shadow-xs flex flex-col justify-between transition-all hover:border-brand-primary/50"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-sunken text-brand-primary rounded-xs border border-surface-border">
                {{ preset.categoryLabel }}
              </span>
              <span v-if="preset.isAnimated" class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-chart-1/10 text-chart-1 rounded-xs">
                Animated
              </span>
            </div>

            <h3 class="text-base font-bold font-display uppercase text-text-primary">
              {{ preset.title }}
            </h3>
            <p class="text-xs text-text-secondary mt-1 line-clamp-2">
              {{ preset.subtitle }}
            </p>

            <!-- Embedded Live Chart -->
            <div class="my-4">
              <TuxECharts
                :key="`mosaic-${preset.id}-${isDark}`"
                :options="preset.getOption(isDark)"
                :height="preset.height || '360px'"
                :aria-title="preset.ariaTitle"
                :aria-summary="preset.ariaSummary"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
            <span class="text-[11px] font-mono text-text-muted truncate max-w-[240px]">
              {{ preset.source }}
            </span>
            <button
              type="button"
              class="min-h-[44px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all inline-flex items-center gap-1.5 shrink-0"
              @click="selectPreset(preset.id); $nextTick(() => { window.scrollTo({ top: 320, behavior: 'smooth' }) })"
            >
              <span>Feature In Main Stage</span>
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
