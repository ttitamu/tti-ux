<script setup lang="ts">
/**
 * Preview Specimens Gallery — TUX
 *
 * Twenty-eight standalone HTML cards, one per token group or component pattern,
 * served from /preview/*.html. Each loads /colors_and_type.css directly —
 * vanilla CSS, zero framework runtime — with live token references.
 */

useHead({ title: "Preview Specimens · TUX" });

interface Specimen {
  file: string;
  label: string;
  height: number;
}

interface SpecimenGroup {
  id: string;
  title: string;
  eyebrow: string;
  specs: Specimen[];
}

const groups: SpecimenGroup[] = [
  {
    id: "typography",
    eyebrow: "type",
    title: "Typography",
    specs: [
      { file: "type-families.html", label: "Four families", height: 280 },
      { file: "type-scale.html", label: "Modular scale", height: 320 },
      { file: "type-display.html", label: "Display heading", height: 200 },
      { file: "type-bold.html", label: "Bold-style heading", height: 200 },
      { file: "type-elegant.html", label: "Elegant-style heading", height: 280 },
      { file: "type-eyebrow.html", label: "Eyebrow + subhead", height: 200 },
      { file: "type-mono.html", label: "Mono — JetBrains", height: 200 },
      { file: "type-style-variants.html", label: "Style variants table", height: 480 },
    ],
  },
  {
    id: "color",
    eyebrow: "color",
    title: "Color",
    specs: [
      { file: "color-brand.html", label: "Brand anchors", height: 220 },
      { file: "color-semantic.html", label: "Semantic roles", height: 220 },
      { file: "color-neutrals.html", label: "Neutrals", height: 220 },
      { file: "color-maroon-ramp.html", label: "Maroon ramp (50–950)", height: 260 },
      { file: "color-dark-theme.html", label: "tti-dark surfaces", height: 240 },
      { file: "color-hc-theme.html", label: "tti-hc · WCAG AAA", height: 240 },
    ],
  },
  {
    id: "spacing",
    eyebrow: "spacing",
    title: "Spacing & Elevation",
    specs: [
      { file: "spacing-ramp.html", label: "4px spacing ramp", height: 220 },
      { file: "spacing-radii.html", label: "Corner radii", height: 200 },
      { file: "spacing-shadows.html", label: "Soft elevation", height: 200 },
    ],
  },
  {
    id: "components",
    eyebrow: "components",
    title: "Components",
    specs: [
      { file: "component-buttons.html", label: "Buttons", height: 140 },
      { file: "component-alerts.html", label: "Alerts", height: 360 },
      { file: "component-badges.html", label: "Badges", height: 160 },
      { file: "component-cards.html", label: "Cards", height: 320 },
      { file: "component-section-header.html", label: "Section header", height: 220 },
      { file: "component-table.html", label: "Table", height: 320 },
      { file: "component-empty-state.html", label: "Empty state", height: 280 },
      { file: "component-forms.html", label: "Form controls", height: 280 },
    ],
  },
  {
    id: "brand",
    eyebrow: "brand",
    title: "Brand Motifs",
    specs: [
      { file: "brand-logo.html", label: "Logo placeholder", height: 160 },
      { file: "brand-voice.html", label: "Voice + casing", height: 280 },
      { file: "brand-card-hover.html", label: "Card-hover signature", height: 280 },
    ],
  },
];

const selectedGroupId = ref<string>("all");
const searchQuery = ref<string>("");

const totalSpecimens = computed(() => {
  return groups.reduce((acc, g) => acc + g.specs.length, 0);
});

const filteredGroups = computed(() => {
  return groups
    .filter((g) => selectedGroupId.value === "all" || g.id === selectedGroupId.value)
    .map((g) => {
      if (!searchQuery.value.trim()) return g;
      const q = searchQuery.value.trim().toLowerCase();
      const filteredSpecs = g.specs.filter(
        (s) => s.label.toLowerCase().includes(q) || s.file.toLowerCase().includes(q)
      );
      return { ...g, specs: filteredSpecs };
    })
    .filter((g) => g.specs.length > 0);
});
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="reference" title="Preview specimens">
      Twenty-eight standalone HTML cards, one per token group or component
      pattern, served from <code>/preview/*.html</code>. Each loads
      <code>/colors_and_type.css</code> directly — no Vue, no Nuxt UI — so a
      designer can lift one into a deck or external doc and have it render
      with the live token values. Click any specimen to open the raw HTML in
      a new tab.
    </TuxPageHeader>

    <!-- Filter & Search Controls Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-4">
      <!-- Group Filter Tabs -->
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          :class="selectedGroupId === 'all' ? 'bg-brand-primary text-text-on-brand' : 'bg-surface-raised border border-surface-border text-text-secondary hover:text-text-primary hover:border-brand-primary'"
          @click="selectedGroupId = 'all'"
        >
          <span>All Specimens</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded-full"
            :class="selectedGroupId === 'all' ? 'bg-brand-maroon-light/30 text-text-on-brand' : 'bg-surface-sunken text-text-muted'"
          >
            {{ totalSpecimens }}
          </span>
        </button>

        <button
          v-for="group in groups"
          :key="group.id"
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          :class="selectedGroupId === group.id ? 'bg-brand-primary text-text-on-brand' : 'bg-surface-raised border border-surface-border text-text-secondary hover:text-text-primary hover:border-brand-primary'"
          @click="selectedGroupId = group.id"
        >
          <span>{{ group.title }}</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded-full"
            :class="selectedGroupId === group.id ? 'bg-brand-maroon-light/30 text-text-on-brand' : 'bg-surface-sunken text-text-muted'"
          >
            {{ group.specs.length }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-64">
        <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter specimens..."
          class="w-full pl-9 pr-8 py-1.5 text-xs bg-surface-raised border border-surface-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-2.5 top-2 text-text-muted hover:text-text-primary text-xs"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Group Sections -->
    <section v-for="group in filteredGroups" :key="group.title" class="space-y-4">
      <div class="flex items-center justify-between border-b border-surface-border/50 pb-2">
        <div>
          <p class="eyebrow">{{ group.eyebrow }}</p>
          <h2 class="heading--bold text-2xl font-bold">{{ group.title }}</h2>
        </div>
        <span class="text-xs font-mono text-text-muted">{{ group.specs.length }} specimens</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <figure
          v-for="spec in group.specs"
          :key="spec.file"
          class="border border-surface-border rounded-md overflow-hidden bg-surface-raised shadow-sm hover:border-brand-primary/50 transition-colors"
        >
          <iframe
            :src="`/preview/${spec.file}`"
            :title="spec.label"
            :height="spec.height"
            class="w-full block border-0 bg-surface-page"
            loading="lazy"
          />
          <figcaption class="flex items-center justify-between px-3 py-2 border-t border-surface-border text-xs bg-surface-sunken">
            <span class="font-medium text-text-primary">{{ spec.label }}</span>
            <a
              :href="`/preview/${spec.file}`"
              target="_blank"
              rel="noopener"
              class="link-tti font-mono text-text-muted hover:text-brand-primary flex items-center gap-1"
            >
              <span>{{ spec.file }}</span>
              <UIcon name="lucide:external-link" class="w-3 h-3" />
            </a>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Empty State -->
    <div
      v-if="filteredGroups.length === 0"
      class="p-12 text-center rounded-lg border border-dashed border-surface-border bg-surface-raised space-y-3"
    >
      <UIcon name="lucide:search" class="w-8 h-8 text-text-muted mx-auto" />
      <h3 class="text-base font-bold text-text-primary">No specimens found</h3>
      <p class="text-sm text-text-secondary max-w-md mx-auto">
        No preview cards matched your search "{{ searchQuery }}". Try clearing your search.
      </p>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-semibold rounded bg-brand-primary text-text-on-brand"
        @click="searchQuery = ''; selectedGroupId = 'all'"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>
