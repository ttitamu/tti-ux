<script setup lang="ts">
/**
 * TuxChartGeoDotDensity — `kind="dot-density"` child of
 * TuxChartGeographic: one dot per event (or N events at a fixed scale),
 * rejection-sampled inside the actual Texas outline so the distribution
 * reads geographically faithful. Loaded async by the parent so the
 * ~17KB outline path + polygon only ship when this kind renders.
 * Internal to the TuxChartGeo* family; no catalog entry.
 */
import { TX_VIEWBOX, texasOutlinePath } from "../assets/geo/texas-outline";
import { texasOutlinePolygon } from "../assets/geo/texas-outline-polygon";
import type { TuxGeoSharedProps } from "../utils/tuxChartGeo";

interface Props extends TuxGeoSharedProps {
  dots: number;
  dotLegend: string;
}

const props = defineProps<Props>();

function pointInPolygon(point: readonly [number, number], poly: ReadonlyArray<readonly [number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    // Index is guaranteed in range by the loop bounds; `!` quiets
    // noUncheckedIndexedAccess without changing runtime behavior.
    const [xi, yi] = poly[i]!;
    const [xj, yj] = poly[j]!;
    const intersect = ((yi > point[1]) !== (yj > point[1]))
      && (point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const dotPositions = computed(() => {
  const out: { x: number; y: number }[] = [];
  let seed = 0xc0fefe;
  const rng = () => {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let attempts = 0;
  const maxAttempts = props.dots * 50;
  while (out.length < props.dots && attempts < maxAttempts) {
    const x = rng() * TX_VIEWBOX[0];
    const y = rng() * TX_VIEWBOX[1];
    if (pointInPolygon([x, y], texasOutlinePolygon)) {
      out.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
    attempts++;
  }
  return out;
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}`"
    width="100%"
    role="img"
    :aria-label="title || 'Texas geographic chart (dot-density)'"
    class="tux-chart-geographic__svg"
  >
    <path
      :d="texasOutlinePath"
      fill="var(--surface-sunken)"
      stroke="var(--map-outline)"
      stroke-width="1.5"
      vector-effect="non-scaling-stroke"
    />
    <circle
      v-for="(d, i) in dotPositions"
      :key="`dot-${i}`"
      :cx="d.x"
      :cy="d.y"
      r="1.2"
      fill="var(--map-flow)"
      fill-opacity="0.65"
    />

    <TuxChartGeoTitle v-if="title" :title="title" :x="TX_VIEWBOX[0] - 12" :y="28" />
    <g
      v-if="showLegend"
      :transform="`translate(24, ${TX_VIEWBOX[1] - 50})`"
    >
      <text
        x="0" y="-6"
        font-size="10"
        fill="var(--text-muted)"
        font-family="var(--font-bold)"
        letter-spacing="0.1em"
        font-weight="700"
      >{{ dotLegend.toUpperCase() }}</text>
      <circle cx="0" cy="8" r="1.2" fill="var(--map-flow)" fill-opacity="0.65" />
    </g>
  </svg>
</template>
