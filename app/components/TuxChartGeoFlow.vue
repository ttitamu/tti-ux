<script setup lang="ts">
/**
 * TuxChartGeoFlow — `kind="flow"` child of TuxChartGeographic:
 * origin-destination curved arcs between the seven primary Texas
 * metros, projected from real lat/lng. Arc width scales with volume;
 * arrows mark the destination. Loaded async by the parent so only the
 * ~9KB outline + metro coordinates ship when this kind renders.
 * Internal to the TuxChartGeo* family; no catalog entry.
 */
import { TX_VIEWBOX, texasOutlinePath } from "../assets/geo/texas-outline";
import { txMetros } from "../assets/geo/tx-metros";
import type { TuxGeoSharedProps } from "../utils/tuxChartGeo";

interface FlowDatum { from: string; to: string; value: number }

interface Props extends TuxGeoSharedProps {
  flows: FlowDatum[];
  flowLegend: string;
}

const props = defineProps<Props>();

const renderedFlows = computed(() => {
  return props.flows
    .map((f) => {
      const o = txMetros.find((m) => m.code === f.from);
      const d = txMetros.find((m) => m.code === f.to);
      if (!o || !d) return null;
      const dx = d.x - o.x;
      const dy = d.y - o.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mx = (o.x + d.x) / 2 + (-dy / dist) * dist * 0.18;
      const my = (o.y + d.y) / 2 + (dx / dist) * dist * 0.18;
      return {
        from: o,
        to: d,
        path: `M ${o.x} ${o.y} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${d.x} ${d.y}`,
        width: 1 + (f.value / 100) * 6,
        value: f.value,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
});

const instanceId = useId();
const arrowMarkerId = `tux-geo-arrow-${instanceId}`;
</script>

<template>
  <svg
    :viewBox="`0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}`"
    width="100%"
    role="img"
    :aria-label="title || 'Texas geographic chart (flow)'"
    class="tux-chart-geographic__svg"
  >
    <path
      :d="texasOutlinePath"
      fill="var(--surface-sunken)"
      stroke="var(--map-outline)"
      stroke-width="1.5"
      vector-effect="non-scaling-stroke"
    />
    <defs>
      <marker
        :id="arrowMarkerId"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--map-flow)" fill-opacity="0.7" />
      </marker>
    </defs>
    <path
      v-for="(f, i) in renderedFlows"
      :key="`flow-${i}`"
      :d="f.path"
      fill="none"
      stroke="var(--map-flow)"
      :stroke-width="f.width"
      stroke-opacity="0.6"
      :marker-end="`url(#${arrowMarkerId})`"
    >
      <title>{{ f.from.code }} → {{ f.to.code }} · {{ f.value }}</title>
    </path>
    <g v-for="m in txMetros" :key="m.code">
      <circle
        :cx="m.x"
        :cy="m.y"
        r="6"
        fill="var(--surface-page)"
        stroke="var(--text-primary)"
        stroke-width="1.5"
      />
      <text
        :x="m.x"
        :y="m.y - 11"
        text-anchor="middle"
        font-size="10"
        fill="var(--text-primary)"
        font-family="var(--font-bold)"
        font-weight="700"
        letter-spacing="0.06em"
        style="paint-order: stroke; stroke: var(--surface-page); stroke-width: 3px;"
      >{{ m.code }}</text>
    </g>

    <TuxChartGeoTitle v-if="title" :title="title" :x="TX_VIEWBOX[0] - 12" :y="28" />
    <g
      v-if="showLegend"
      :transform="`translate(${TX_VIEWBOX[0] - 220}, ${TX_VIEWBOX[1] - 60})`"
    >
      <text
        x="0" y="-6"
        font-size="10"
        fill="var(--text-muted)"
        font-family="var(--font-bold)"
        letter-spacing="0.1em"
        font-weight="700"
      >{{ flowLegend.toUpperCase() }}</text>
      <g v-for="(v, i) in [20, 50, 100]" :key="`fl-${v}`" :transform="`translate(${i * 60}, 10)`">
        <line
          x1="0" y1="0" x2="40" y2="0"
          stroke="var(--map-flow)"
          :stroke-width="1 + (v / 100) * 6"
          stroke-opacity="0.6"
        />
        <text
          x="20" y="16"
          text-anchor="middle"
          font-size="9"
          fill="var(--text-muted)"
          font-family="var(--font-mono)"
        >{{ v }}K</text>
      </g>
    </g>
  </svg>
</template>
