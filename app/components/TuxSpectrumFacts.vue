<script setup lang="ts">
/**
 * TuxSpectrumFacts — The 5-column institutional Quick Facts banner.
 *
 * Direct parity with the flagship metric row from my.tti.tamu.edu.
 * Each column maps to one of the 5 institutional spectrum bands
 * (Maroon, Blue, Teal, Green, Gold), featuring an icon header,
 * bold high-contrast numeral, and colored category label.
 */

export interface SpectrumFactItem {
  /** High-impact metric value, e.g. "$140M", "200+", "700+". */
  value: string;
  /** Primary descriptive label, e.g. "Research Expenditures". */
  label: string;
  /** Optional secondary subtitle or context footnote. */
  detail?: string;
  /** Optional Lucide icon name, e.g. "lucide:dollar-sign". */
  icon?: string;
  /** Spectrum color band override ('maroon' | 'blue' | 'teal' | 'green' | 'gold'). */
  band?: "maroon" | "blue" | "teal" | "green" | "gold";
}

interface Props {
  /** Optional section heading title (e.g. "QUICK FACTS"). */
  title?: string;
  /** Optional subtitle or fiscal year note (e.g. "FY 2025 Institutional Telemetry"). */
  subtitle?: string;
  /** 5 metric items. Defaults to canonical my.tti.tamu.edu institutional statistics. */
  items?: SpectrumFactItem[];
  /** Surface tone: 'dark' (charcoal dark surface) or 'light' (raised neutral surface). */
  tone?: "dark" | "light";
  /** Whether to render the 5-band spectrum ribbon along the top edge. */
  showTopRibbon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "QUICK FACTS",
  subtitle: "",
  tone: "dark",
  showTopRibbon: true,
  items: () => [
    {
      value: "$140M",
      label: "Research Expenditures",
      detail: "Annual research volume",
      icon: "lucide:dollar-sign",
      band: "maroon",
    },
    {
      value: "200+",
      label: "Active Projects",
      detail: "Concurrent investigations",
      icon: "lucide:folder-git-2",
      band: "blue",
    },
    {
      value: "350+",
      label: "Research Sponsors",
      detail: "Federal, state & private",
      icon: "lucide:handshake",
      band: "teal",
    },
    {
      value: "200+",
      label: "Student Researchers",
      detail: "Graduate & undergraduate",
      icon: "lucide:graduation-cap",
      band: "green",
    },
    {
      value: "700+",
      label: "Transportation Staff",
      detail: "Engineers, scientists & staff",
      icon: "lucide:users",
      band: "gold",
    },
  ],
});

const defaultBands: Array<"maroon" | "blue" | "teal" | "green" | "gold"> = [
  "maroon",
  "blue",
  "teal",
  "green",
  "gold",
];

function getBandStyle(band: string | undefined, index: number): { color: string; borderColor: string } {
  const b = band || defaultBands[index % defaultBands.length];
  if (props.tone === "dark") {
    switch (b) {
      case "maroon": return { color: "var(--spectrum-dark-maroon, #FCA5A5)", borderColor: "var(--spectrum-dark-maroon-border, #F87171)" };
      case "blue":   return { color: "var(--spectrum-dark-blue, #93C5FD)", borderColor: "var(--spectrum-dark-blue-border, #60A5FA)" };
      case "teal":   return { color: "var(--spectrum-dark-teal, #5EEAD4)", borderColor: "var(--spectrum-dark-teal-border, #2DD4BF)" };
      case "green":  return { color: "var(--spectrum-dark-green, #86EFAC)", borderColor: "var(--spectrum-dark-green-border, #4ADE80)" };
      case "gold":   return { color: "var(--spectrum-dark-gold, #FCD34D)", borderColor: "var(--spectrum-dark-gold-border, #FBBF24)" };
      default:       return { color: "var(--brand-accent)", borderColor: "var(--brand-accent)" };
    }
  }
  switch (b) {
    case "maroon": return { color: "var(--brand-primary, #5C0025)", borderColor: "var(--spectrum-maroon, #701D35)" };
    case "blue":   return { color: "var(--spectrum-light-blue, #1E3A5F)", borderColor: "var(--spectrum-blue, #566A8A)" };
    case "teal":   return { color: "var(--spectrum-light-teal, #1F4E52)", borderColor: "var(--spectrum-teal, #66999B)" };
    case "green":  return { color: "var(--spectrum-light-green, #2D4A22)", borderColor: "var(--spectrum-green, #7B996B)" };
    case "gold":   return { color: "var(--spectrum-light-gold, #5C4008)", borderColor: "var(--spectrum-gold, #D39A2B)" };
    default:       return { color: "var(--brand-primary)", borderColor: "var(--brand-accent)" };
  }
}
</script>

<template>
  <section
    class="tux-spectrum-facts relative w-full overflow-hidden select-none"
    :class="tone === 'dark' ? 'bg-neutral-900 text-white' : 'bg-surface-raised text-text-primary border border-surface-border shadow-sm'"
    :aria-label="title || 'Institutional Quick Facts'"
  >
    <!-- Top 5-Band Institutional Spectrum Ribbon -->
    <TuxSpectrumRibbon v-if="showTopRibbon" size="sm" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <!-- Section Header -->
      <div v-if="title || subtitle" class="text-center mb-8">
        <h2
          v-if="title"
          class="text-xs sm:text-sm font-extrabold uppercase tracking-widest"
          :class="tone === 'dark' ? 'text-brand-accent' : 'text-brand-primary'"
        >
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="text-xs sm:text-sm mt-1 max-w-2xl mx-auto"
          :class="tone === 'dark' ? 'text-white/85' : 'text-text-secondary'"
        >
          {{ subtitle }}
        </p>
      </div>

      <!-- 5-Column Metrics Grid -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
        <div
          v-for="(item, idx) in items"
          :key="item.label"
          class="flex flex-col items-center text-center p-3 transition-transform hover:-translate-y-0.5 border-t-2"
          :style="{ borderTopColor: getBandStyle(item.band, idx).borderColor }"
        >
          <!-- Icon Header -->
          <div
            v-if="item.icon"
            class="mb-2 p-2 rounded-full"
            :class="tone === 'dark' ? 'bg-white/10' : 'bg-surface-sunken'"
            :style="{ color: getBandStyle(item.band, idx).color }"
          >
            <Icon
              :name="item.icon"
              class="w-5 h-5 sm:w-6 sm:h-6"
              aria-hidden="true"
            />
          </div>

          <!-- Big Stat Numeral -->
          <div
            class="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight leading-none my-1"
            :class="tone === 'dark' ? 'text-white' : 'text-text-primary'"
          >
            {{ item.value }}
          </div>

          <!-- Metric Label -->
          <div
            class="text-xs sm:text-sm font-bold uppercase tracking-wide mt-1"
            :style="{ color: getBandStyle(item.band, idx).color }"
          >
            {{ item.label }}
          </div>

          <!-- Detail Footnote -->
          <div
            v-if="item.detail"
            class="text-[11px] mt-1 leading-snug"
            :class="tone === 'dark' ? 'text-white/80' : 'text-text-muted'"
          >
            {{ item.detail }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
