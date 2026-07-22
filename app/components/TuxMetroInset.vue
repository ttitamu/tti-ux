<script setup lang="ts">
/**
 * TuxMetroInset — neighborhood-grid inset for a single metro,
 * intended for 4-up side-by-side layouts (Houston · DFW · Austin
 * · San Antonio). Each cell is one census tract, encoded by a
 * 5-step sequential ramp; a dashed highway overlay runs corner-to-
 * corner with a labelled badge at the diagonal midpoint.
 *
 * Sister to `TuxChartGeographic` — when the question is statewide,
 * use the county / district / dot-density / flow kinds; when the
 * question is neighborhood-level inside one metro, this is the
 * surface. Pair them in the same exhibit when you want to drill
 * from state-level pattern down to a representative metro.
 *
 * Stylized abstraction (not real census tracts) — for honest
 * tract-level work pair `TuxVizEmbed` with a Tableau / Carto /
 * Mapbox surface that has the actual geometry.
 */
type Palette = "maroon" | "slate";

interface Props {
  name: string;
  highwayLabel?: string;
  height?: number;
  palette?: Palette;
  seed?: string;
  cols?: number;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  highwayLabel: "",
  height: 220,
  palette: "maroon",
  seed: "",
  cols: 8,
  rows: 6,
});

const ramp = computed(() => {
  if (props.palette === "slate") {
    return [
      "var(--map-seq-slate-1)", "var(--map-seq-slate-2)",
      "var(--map-seq-slate-3)", "var(--map-seq-slate-4)",
      "var(--map-seq-slate-5)",
    ];
  }
  return [
    "var(--map-seq-maroon-1)", "var(--map-seq-maroon-2)",
    "var(--map-seq-maroon-3)", "var(--map-seq-maroon-4)",
    "var(--map-seq-maroon-5)",
  ];
});

function bucket(v: number): number {
  return Math.min(4, Math.max(0, Math.floor(v * 5)));
}

const cellW = 36;
const cellH = 28;

const cells = computed(() => {
  const seedStr = props.seed || props.name;
  const seed = seedStr.length > 0 ? seedStr.charCodeAt(0) : 1;
  const out: { r: number; c: number; v: number }[] = [];
  for (let r = 0; r < props.rows; r++) {
    for (let c = 0; c < props.cols; c++) {
      const v = Math.sin((r * 7 + c * 11 + seed) * 1.3) * 0.5 + 0.5;
      out.push({ r, c, v });
    }
  }
  return out;
});

const totalWidth = computed(() => props.cols * cellW + 40);
const viewBox = computed(() => `0 0 ${totalWidth.value} ${props.height}`);
const highwayStartX = 30;
const highwayStartY = 40;
const highwayEndX = computed(() => totalWidth.value - 20);
const highwayEndY = computed(() => props.height - 30);
</script>

<template>
  <div class="tux-metro-inset">
    <div class="tux-metro-inset__name">{{ name }}</div>
    <svg
      :viewBox="viewBox"
      :height="height"
      width="100%"
      role="img"
      :aria-label="`${name} neighborhood inset`"
      class="tux-metro-inset__svg"
    >
      <rect
        v-for="(cell, i) in cells"
        :key="`c-${i}`"
        :x="20 + cell.c * cellW"
        :y="20 + cell.r * cellH"
        :width="cellW - 1"
        :height="cellH - 1"
        :fill="ramp[bucket(cell.v)]"
        stroke="var(--surface-page)"
        stroke-width="0.5"
      />

      <line
        :x1="highwayStartX" :y1="highwayStartY"
        :x2="highwayEndX" :y2="highwayEndY"
        stroke="var(--text-primary)" stroke-width="2.5" opacity="0.4"
      />
      <line
        :x1="highwayStartX" :y1="highwayStartY"
        :x2="highwayEndX" :y2="highwayEndY"
        stroke="var(--surface-page)" stroke-width="0.8" stroke-dasharray="6 4"
      />

      <template v-if="highwayLabel">
        <rect
          :x="totalWidth / 2 - 16"
          :y="height / 2 - 8"
          width="32" height="14"
          fill="var(--brand-primary)"
        />
        <text
          :x="totalWidth / 2"
          :y="height / 2 + 2"
          text-anchor="middle"
          font-size="8"
          fill="#fff"
          font-family="var(--font-mono)"
          font-weight="700"
        >{{ highwayLabel }}</text>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.tux-metro-inset { font-family: var(--font-body); }
.tux-metro-inset__name {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  font-family: var(--font-bold);
  margin-bottom: 0.5rem;
}
.tux-metro-inset__svg { display: block; max-width: 100%; height: auto; }
</style>
