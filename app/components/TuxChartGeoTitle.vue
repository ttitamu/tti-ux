<script setup lang="ts">
/**
 * TuxChartGeoTitle — SVG fragment: the tracked, uppercase top-right
 * title overlay shared by every TuxChartGeographic kind child.
 * Internal to the TuxChartGeo* family; no catalog entry.
 */
interface Props {
  title: string;
  x: number;
  y: number;
}

defineProps<Props>();
</script>

<template>
  <text
    :x="x"
    :y="y"
    text-anchor="end"
    font-size="11"
    fill="var(--text-muted)"
    font-family="var(--font-bold)"
    letter-spacing="0.1em"
    font-weight="700"
  >{{ title.toUpperCase() }}</text>
</template>
