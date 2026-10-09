<script setup lang="ts">
/**
 * TuxVisionPreferencesModal — Comprehensive accessibility settings modal
 * offering color vision deficiency (CVD) modes, real-time SVG filter simulation,
 * multi-channel chart redundancy controls, and anti-halation astigmatism comfort.
 */
import { computed } from "vue";
import { useTuxVisionPrefs } from "~/composables/useTuxVisionPrefs";

interface Props {
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const { prefs, reset } = useTuxVisionPrefs();

const cvdModes = [
  {
    id: "okabe-ito" as const,
    label: "Universal CVD (Okabe-Ito)",
    badge: "Recommended",
    description: "Deep Blue (#0072B2) and Warm Orange (#E69F00) binary polarity. 100% immune to Protan, Deutan, and Tritan confusion lines.",
    swatches: ["#0072B2", "#E69F00", "#009E73", "#F0E442", "#56B4E9", "#D55E00", "#CC79A7", "#222222"],
  },
  {
    id: "brand" as const,
    label: "TTI Institutional Standard",
    badge: undefined,
    description: "Classic Aggie Maroon and Slate telemetry palette.",
    swatches: ["#500000", "#3F5A6F", "#C7973C", "#6B8E5A", "#8C5A3C", "#5C7080", "#A33A3A", "#3C5A87"],
  },
  {
    id: "deutan-protan" as const,
    label: "Deutan / Protan Optimized",
    badge: "Red-Green Safe",
    description: "Replaces conflicting red/green frequencies with sky blue, vermilion, and high-contrast amber.",
    swatches: ["#0072B2", "#E69F00", "#56B4E9", "#D55E00", "#F0E442", "#009E73", "#CC79A7", "#111111"],
  },
  {
    id: "tritan" as const,
    label: "Tritanopia Safe",
    badge: "Blue-Yellow Safe",
    description: "High-contrast magenta, deep teal, and graphite steps avoiding blue-yellow confusion.",
    swatches: ["#CC79A7", "#009E73", "#D55E00", "#500000", "#0072B2", "#3F5A6F", "#8C5A3C", "#111111"],
  },
  {
    id: "monochrome" as const,
    label: "Achromatopsia & High-Luminance Mono",
    badge: "Monochrome Safe",
    description: "Evenly spaced grayscale steps requiring distinct stroke patterns and geometric markers.",
    swatches: ["#111111", "#444444", "#777777", "#999999", "#bbbbbb", "#dddddd", "#555555", "#000000"],
  },
];

const simulations = [
  { value: "none", label: "Normal Vision (Simulation Disabled)" },
  { value: "deuteranopia", label: "Simulate Deuteranopia (Green-Blind, 6% of males)" },
  { value: "protanopia", label: "Simulate Protanopia (Red-Blind, 2% of males)" },
  { value: "tritanopia", label: "Simulate Tritanopia (Blue-Blind, <1% of population)" },
  { value: "achromatopsia", label: "Simulate Achromatopsia (Complete Colorblindness)" },
];

function onClose() {
  emit("update:open", false);
}
</script>

<template>
  <TuxModal
    :open="open"
    title="Vision & Accessibility Preferences"
    eyebrow="Clinical Accessibility & Display Comfort"
    size="2xl"
    @update:open="emit('update:open', $event)"
  >
    <!-- Hidden Global SVG Filters for Live Simulation -->
    <svg id="tux-cvd-filters" aria-hidden="true" style="position: absolute; width: 0; height: 0; pointer-events: none;">
      <defs>
        <filter id="tux-filter-deuteranopia">
          <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
        </filter>
        <filter id="tux-filter-protanopia">
          <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
        </filter>
        <filter id="tux-filter-tritanopia">
          <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
        </filter>
        <filter id="tux-filter-achromatopsia">
          <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>

    <div class="space-y-6 text-text-primary">
      <!-- Section 1: Color Vision Deficiency Mode -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm uppercase tracking-wider text-text-secondary">
            1. Categorical Color Vision Palette
          </h3>
          <span class="text-xs text-text-muted">Affects charts, heatmaps & telemetry</span>
        </div>

        <div class="space-y-2">
          <label
            v-for="mode in cvdModes"
            :key="mode.id"
            class="flex flex-col p-3 border rounded cursor-pointer transition-colors"
            :class="[
              prefs.cvdMode === mode.id
                ? 'border-brand-primary bg-surface-sunken ring-1 ring-brand-primary'
                : 'border-surface-border bg-surface-raised hover:bg-surface-sunken'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <input
                  v-model="prefs.cvdMode"
                  type="radio"
                  name="tux-cvd-mode"
                  :value="mode.id"
                  class="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                >
                <span class="font-semibold text-sm">{{ mode.label }}</span>
                <span
                  v-if="mode.badge"
                  class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary"
                >
                  {{ mode.badge }}
                </span>
              </div>
              <!-- Swatches preview -->
              <div class="flex items-center gap-1" aria-hidden="true">
                <span
                  v-for="(swatch, idx) in mode.swatches.slice(0, 5)"
                  :key="idx"
                  class="w-3.5 h-3.5 rounded-full border border-black/20"
                  :style="{ backgroundColor: swatch }"
                />
              </div>
            </div>
            <p class="mt-1 text-xs text-text-muted pl-6">
              {{ mode.description }}
            </p>
          </label>
        </div>
      </section>

      <!-- Section 2: Live Vision Simulation Filter -->
      <section class="space-y-2 pt-2 border-t border-surface-border">
        <div class="flex items-center justify-between">
          <label for="tux-cvd-sim-select" class="font-bold text-sm uppercase tracking-wider text-text-secondary">
            2. Live Colorblindness Simulation Filter
          </label>
          <span class="text-xs text-brand-primary font-medium">Design & Audit Tool</span>
        </div>
        <p class="text-xs text-text-muted">
          Simulates retinal cone deficiency across the entire viewport using clinical SVG color matrices.
        </p>
        <select
          id="tux-cvd-sim-select"
          v-model="prefs.cvdSimulation"
          class="w-full min-h-[44px] px-3 py-2 bg-surface-raised border border-surface-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option v-for="sim in simulations" :key="sim.value" :value="sim.value">
            {{ sim.label }}
          </option>
        </select>
      </section>

      <!-- Section 3: Multi-Channel Redundancy -->
      <section class="space-y-3 pt-2 border-t border-surface-border">
        <h3 class="font-bold text-sm uppercase tracking-wider text-text-secondary">
          3. Multi-Channel Redundancy (Non-Color Encodings)
        </h3>

        <div class="space-y-2">
          <label class="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
            <input
              v-model="prefs.patterns"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
            >
            <div>
              <span class="text-sm font-semibold block">Distinct Line Dash Patterns</span>
              <span class="text-xs text-text-muted">Cycles solid, dashed, and dotted stroke styles across series so lines are distinguishable in grayscale and monochrome printouts.</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
            <input
              v-model="prefs.distinctMarkers"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
            >
            <div>
              <span class="text-sm font-semibold block">Geometric Point Markers</span>
              <span class="text-xs text-text-muted">Renders distinct geometric shapes (circles ●, squares ■, triangles ▲, diamonds ◆) on data points for triple-redundant identification.</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
            <input
              v-model="prefs.directLabels"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
            >
            <div>
              <span class="text-sm font-semibold block">Direct Value Labels</span>
              <span class="text-xs text-text-muted">Annotates end-of-series data values directly on curves to eliminate back-and-forth legend eye tracking.</span>
            </div>
          </label>
        </div>
      </section>

      <!-- Section 4: Astigmatism & Low-Vision Comfort -->
      <section class="space-y-3 pt-2 border-t border-surface-border">
        <h3 class="font-bold text-sm uppercase tracking-wider text-text-secondary">
          4. Astigmatism & Low-Vision Comfort
        </h3>

        <div class="space-y-2">
          <label class="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
            <input
              v-model="prefs.softDark"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
            >
            <div>
              <span class="text-sm font-semibold block">Anti-Halation Soft Dark Mode</span>
              <span class="text-xs text-text-muted">Replaces pitch-black wells with deep slate-charcoal (#161A22) and softens pure white text to eliminate optical haloing and diffraction in astigmatic eyes.</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-2.5 rounded bg-surface-raised hover:bg-surface-sunken cursor-pointer border border-surface-border min-h-[44px]">
            <input
              v-model="prefs.heavyStrokes"
              type="checkbox"
              class="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
            >
            <div>
              <span class="text-sm font-semibold block">Enhanced Stroke Widths (+1px)</span>
              <span class="text-xs text-text-muted">Bumps chart lines to 3px/3.5px and scales markers for improved visibility and edge discrimination.</span>
            </div>
          </label>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <button
          type="button"
          class="min-h-[44px] px-3 py-1.5 text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
          @click="reset"
        >
          <Icon name="lucide:rotate-ccw" :size="14" />
          Reset Defaults
        </button>
        <button
          type="button"
          class="min-h-[44px] px-4 py-2 bg-brand-primary text-text-on-brand font-semibold text-sm rounded shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-primary inline-flex items-center gap-1.5"
          @click="onClose"
        >
          <Icon name="lucide:check" :size="16" />
          Done
        </button>
      </div>
    </template>
  </TuxModal>
</template>
