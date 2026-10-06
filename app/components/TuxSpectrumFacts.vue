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

function getBandColor(band: string | undefined, index: number): string {
  const b = band || defaultBands[index % defaultBands.length];
  if (props.tone === "dark") {
    switch (b) {
      case "maroon": return "text-red-300";
      case "blue": return "text-blue-300";
      case "teal": return "text-teal-300";
      case "green": return "text-emerald-300";
      case "gold": return "text-amber-300";
      default: return "text-brand-accent";
    }
  }
  switch (b) {
    case "maroon": return "text-spectrum-maroon";
    case "blue": return "text-spectrum-blue";
    case "teal": return "text-spectrum-teal";
    case "green": return "text-spectrum-green";
    case "gold": return "text-spectrum-gold";
    default: return "text-brand-accent";
  }
}

function getBandBorder(band: string | undefined, index: number): string {
  const b = band || defaultBands[index % defaultBands.length];
  switch (b) {
    case "maroon": return "border-spectrum-maroon";
    case "blue": return "border-spectrum-blue";
    case "teal": return "border-spectrum-teal";
    case "green": return "border-spectrum-green";
    case "gold": return "border-spectrum-gold";
    default: return "border-brand-accent";
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
          :class="tone === 'dark' ? 'text-white/70' : 'text-text-muted'"
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
          :class="getBandBorder(item.band, idx)"
        >
          <!-- Icon Header -->
          <div
            v-if="item.icon"
            class="mb-2 p-2 rounded-full"
            :class="tone === 'dark' ? 'bg-white/10' : 'bg-surface-sunken'"
          >
            <Icon
              :name="item.icon"
              class="w-5 h-5 sm:w-6 sm:h-6"
              :class="getBandColor(item.band, idx)"
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
            :class="getBandColor(item.band, idx)"
          >
            {{ item.label }}
          </div>

          <!-- Detail Footnote -->
          <div
            v-if="item.detail"
            class="text-[11px] mt-1 leading-snug"
            :class="tone === 'dark' ? 'text-white/60' : 'text-text-muted'"
          >
            {{ item.detail }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
