<script setup lang="ts">
/**
 * TuxChartGeoUsContext — `kind="us-context"` child of TuxChartGeographic:
 * all 50 US states + DC via AlbersUsa projection (AK / HI insets), with
 * the highlighted state in brand maroon. Loaded async by the parent so
 * the ~164KB of state path data only ships when this kind renders.
 * Internal to the TuxChartGeo* family; no catalog entry.
 */
import { US_VIEWBOX, usStates } from "../assets/geo/us-states";
import type { TuxGeoSharedProps } from "../utils/tuxChartGeo";
import { tuxGeoBucket, tuxGeoDemoValue, tuxGeoRamp } from "../utils/tuxChartGeo";

interface USStateDatum { code: string; value: number }

interface Props extends TuxGeoSharedProps {
  states: USStateDatum[];
  highlight: string;
  legendLabel: string;
  legendStops: string[];
}

const props = defineProps<Props>();

const ramp = computed(() => tuxGeoRamp(props.palette));

const stateValueByCode = computed(() => {
  const map = new Map<string, number>();
  for (const s of props.states) map.set(s.code, s.value);
  return map;
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${US_VIEWBOX[0]} ${US_VIEWBOX[1]}`"
    width="100%"
    role="img"
    :aria-label="title || 'Texas geographic chart (us-context)'"
    class="tux-chart-geographic__svg"
  >
    <g v-for="s in usStates" :key="s.code">
      <path
        :d="s.path"
        :fill="s.code === highlight
          ? 'var(--brand-primary)'
          : ramp[tuxGeoBucket(stateValueByCode.get(s.code) ?? tuxGeoDemoValue(s.code))]"
        :stroke="s.code === highlight ? 'var(--brand-primary)' : 'var(--surface-page)'"
        :stroke-width="s.code === highlight ? 1.5 : 0.6"
        :opacity="s.code === highlight ? 1 : 0.92"
        vector-effect="non-scaling-stroke"
      >
        <title>{{ s.name }}</title>
      </path>
      <text
        :x="s.centroid[0]"
        :y="s.centroid[1] + 3"
        text-anchor="middle"
        font-size="9"
        :fill="s.code === highlight ? '#fff' : 'var(--text-primary)'"
        font-family="var(--font-mono)"
        font-weight="700"
        style="paint-order: stroke; stroke: rgba(255, 255, 255, 0.6); stroke-width: 2px;"
      >{{ s.code }}</text>
    </g>

    <TuxChartGeoTitle v-if="title" :title="title" :x="US_VIEWBOX[0] - 12" :y="28" />
    <TuxChartGeoChoroplethLegend
      v-if="showLegend"
      :ramp="ramp"
      :label="legendLabel"
      :stops="legendStops"
      :x="24"
      :y="US_VIEWBOX[1] - 56"
    />
  </svg>
</template>
