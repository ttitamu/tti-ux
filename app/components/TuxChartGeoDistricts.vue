<script setup lang="ts">
/**
 * TuxChartGeoDistricts — `kind="districts"` child of TuxChartGeographic:
 * TxDOT's 25 engineering districts from the official MapServer boundary
 * geometry, each labelled with its 1–25 number at the polygon centroid.
 * Loaded async by the parent so the ~118KB of district + outline path
 * data only ships when this kind renders. Internal to the TuxChartGeo*
 * family; no catalog entry.
 */
import { TX_VIEWBOX, texasOutlinePath } from "../assets/geo/texas-outline";
import { txdotDistricts } from "../assets/geo/txdot-districts";
import type { TuxGeoSharedProps } from "../utils/tuxChartGeo";
import { tuxGeoBucket, tuxGeoDemoValue, tuxGeoRamp } from "../utils/tuxChartGeo";

interface DistrictDatum { id: number; value: number }

interface Props extends TuxGeoSharedProps {
  districts: DistrictDatum[];
  legendLabel: string;
  legendStops: string[];
}

const props = defineProps<Props>();

const ramp = computed(() => tuxGeoRamp(props.palette));

const districtValueById = computed(() => {
  const map = new Map<number, number>();
  for (const d of props.districts) map.set(d.id, d.value);
  return map;
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}`"
    width="100%"
    role="img"
    :aria-label="title || 'Texas geographic chart (districts)'"
    class="tux-chart-geographic__svg"
  >
    <path
      :d="texasOutlinePath"
      fill="none"
      stroke="var(--map-outline)"
      stroke-width="1.5"
      vector-effect="non-scaling-stroke"
    />
    <g v-for="d in txdotDistricts" :key="d.id">
      <path
        :d="d.path"
        :fill="ramp[tuxGeoBucket(districtValueById.get(d.id) ?? tuxGeoDemoValue(d.id))]"
        stroke="var(--surface-page)"
        stroke-width="0.6"
        vector-effect="non-scaling-stroke"
      >
        <title>{{ d.id }} · {{ d.name }} ({{ d.abbr }})</title>
      </path>
      <text
        :x="d.centroid[0]"
        :y="d.centroid[1] + 3"
        text-anchor="middle"
        font-size="10"
        fill="#fff"
        font-family="var(--font-mono)"
        font-weight="700"
        style="paint-order: stroke; stroke: rgba(0, 0, 0, 0.45); stroke-width: 2.5px;"
      >{{ d.id }}</text>
    </g>

    <TuxChartGeoTitle v-if="title" :title="title" :x="TX_VIEWBOX[0] - 12" :y="28" />
    <TuxChartGeoChoroplethLegend
      v-if="showLegend"
      :ramp="ramp"
      :label="legendLabel"
      :stops="legendStops"
      :x="24"
      :y="TX_VIEWBOX[1] - 56"
    />
  </svg>
</template>
