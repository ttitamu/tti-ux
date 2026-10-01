<script setup lang="ts">
/**
 * TuxSpectrumRibbon — The 5-band institutional brand spectrum ribbon.
 *
 * Direct parity with the flagship brand strip featured on my.tti.tamu.edu
 * and across the new TTI Communications design system rollout.
 *
 * Bands:
 *   1. Aggie Maroon
 *   2. Slate Blue
 *   3. Slate Teal
 *   4. Sage Green
 *   5. Ochre Gold
 */

export interface SpectrumBand {
  name: string;
  colorClass: string;
  hex: string;
  label?: string;
}

interface Props {
  /** Height tier of the ribbon for horizontal layout. */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Layout orientation: horizontal strip or vertical column. */
  orientation?: "horizontal" | "vertical";
  /** Whether to render division/category text labels within or beside the bands. */
  showLabels?: boolean;
  /** Whether corners are rounded (sm) or sharp 0px (default). */
  rounded?: boolean;
  /** Accessible label describing the ribbon for assistive technologies. */
  ariaLabel?: string;
  /** Custom list of bands if overriding the canonical five. */
  bands?: SpectrumBand[];
}

const props = withDefaults(defineProps<Props>(), {
  size: "sm",
  orientation: "horizontal",
  showLabels: false,
  rounded: false,
  ariaLabel: "TTI Institutional Brand Spectrum",
  bands: () => [
    { name: "maroon", colorClass: "bg-spectrum-maroon", hex: "var(--color-spectrum-maroon, #701D35)", label: "Operations" },
    { name: "blue", colorClass: "bg-spectrum-blue", hex: "var(--color-spectrum-blue, #566A8A)", label: "Infrastructure" },
    { name: "teal", colorClass: "bg-spectrum-teal", hex: "var(--color-spectrum-teal, #66999B)", label: "Transit & Freight" },
    { name: "green", colorClass: "bg-spectrum-green", hex: "var(--color-spectrum-green, #849974)", label: "Safety & Environment" },
    { name: "gold", colorClass: "bg-spectrum-gold", hex: "var(--color-spectrum-gold, #E5B350)", label: "Policy & Economics" },
  ],
});

const heightClass = computed(() => {
  if (props.orientation === "vertical") return "w-full";
  switch (props.size) {
    case "xs": return "h-1";
    case "sm": return "h-1.5";
    case "md": return "h-3";
    case "lg": return "h-6";
    case "xl": return "h-10";
    default: return "h-1.5";
  }
});

const widthClass = computed(() => {
  if (props.orientation === "horizontal") return "w-full";
  switch (props.size) {
    case "xs": return "w-1";
    case "sm": return "w-1.5";
    case "md": return "w-3";
    case "lg": return "w-6";
    case "xl": return "w-10";
    default: return "w-1.5";
  }
});
</script>

<template>
  <div
    class="tux-spectrum-ribbon overflow-hidden select-none"
    :class="[
      orientation === 'horizontal' ? 'flex flex-row w-full' : 'flex flex-col h-full',
      heightClass,
      widthClass,
      rounded ? 'rounded-md' : 'rounded-none'
    ]"
    role="img"
    :aria-label="ariaLabel"
  >
    <div
      v-for="band in bands"
      :key="band.name"
      class="flex-1 flex items-center justify-center transition-all min-w-0"
      :class="band.colorClass"
      :title="band.label || band.name"
    >
      <span
        v-if="showLabels && band.label && (size === 'lg' || size === 'xl')"
        class="text-[11px] font-bold text-white uppercase tracking-wider px-2 truncate"
      >
        {{ band.label }}
      </span>
    </div>
  </div>
</template>
