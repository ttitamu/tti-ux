<script setup lang="ts">
/**
 * TuxChartGeoChoroplethLegend — SVG fragment: the 5-swatch sequential
 * ramp legend shared by the county / districts / us-context kind
 * children of TuxChartGeographic. Internal to the TuxChartGeo* family;
 * no catalog entry.
 */
interface Props {
  ramp: string[];
  label: string;
  stops: string[];
  x: number;
  y: number;
}

defineProps<Props>();
</script>

<template>
  <g :transform="`translate(${x}, ${y})`">
    <text
      x="0" y="-8"
      font-size="10"
      fill="var(--text-muted)"
      font-family="var(--font-bold)"
      letter-spacing="0.1em"
      font-weight="700"
    >{{ label.toUpperCase() }}</text>
    <rect
      v-for="(c, i) in ramp"
      :key="`leg-${i}`"
      :x="i * 30"
      y="0"
      width="30"
      height="13"
      :fill="c"
      stroke="var(--surface-page)"
      stroke-width="0.6"
    />
    <text
      v-for="(s, i) in stops"
      :key="`tk-${i}`"
      :x="i * 30 + 15"
      y="27"
      text-anchor="middle"
      font-size="9"
      fill="var(--text-muted)"
      font-family="var(--font-mono)"
    >{{ s }}</text>
  </g>
</template>
