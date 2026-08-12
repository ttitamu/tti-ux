<script setup lang="ts">
/**
 * TuxChartGeoCounty — `kind="county"` child of TuxChartGeographic:
 * Texas county choropleth over TIGER/Line simplified geometry
 * (254 counties). Loaded async by the parent so the ~63KB of county +
 * outline path data only ships when this kind renders. Internal to the
 * TuxChartGeo* family; no catalog entry.
 */
import { TX_VIEWBOX, texasOutlinePath } from "../assets/geo/texas-outline";
import { texasCounties } from "../assets/geo/texas-counties";
import type { TuxGeoSharedProps } from "../utils/tuxChartGeo";
import { tuxGeoBucket, tuxGeoDemoValue, tuxGeoRamp } from "../utils/tuxChartGeo";

interface CountyDatum { fips: string; value: number }

interface Props extends TuxGeoSharedProps {
  counties: CountyDatum[];
  legendLabel: string;
  legendStops: string[];
}

const props = defineProps<Props>();

const ramp = computed(() => tuxGeoRamp(props.palette));

const countyValueByFips = computed(() => {
  const map = new Map<string, number>();
  for (const c of props.counties) map.set(c.fips, c.value);
  return map;
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}`"
    width="100%"
    role="img"
    :aria-label="title || 'Texas geographic chart (county)'"
    class="tux-chart-geographic__svg"
  >
    <path
      v-for="county in texasCounties"
      :key="county.fips"
      :d="county.path"
      :fill="ramp[tuxGeoBucket(countyValueByFips.get(county.fips) ?? tuxGeoDemoValue(county.fips))]"
      stroke="var(--surface-page)"
      stroke-width="0.4"
      vector-effect="non-scaling-stroke"
    >
      <title>{{ county.name }} County</title>
    </path>
    <path
      :d="texasOutlinePath"
      fill="none"
      stroke="var(--map-outline)"
      stroke-width="1.5"
      vector-effect="non-scaling-stroke"
    />

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
