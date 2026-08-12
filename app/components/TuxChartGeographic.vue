<script setup lang="ts">
/**
 * TuxChartGeographic — Texas-flavored geographic charts. Five
 * kinds via `kind` prop, all native SVG (no library):
 *
 *   - `county`       — Texas county choropleth using TIGER/Line
 *                      1:10m simplified geometry (254 counties).
 *                      Sequential 5-step ramp, quantile-binned.
 *                      The flagship for VMT, crash rate, AADT —
 *                      anything county-level.
 *   - `districts`    — TxDOT's 25 engineering districts using
 *                      the official boundary geometry from the
 *                      TxDOT MapServer feature service. Each
 *                      district is labelled with its 1–25
 *                      number at the polygon centroid.
 *   - `us-context`   — All 50 US states + DC using AlbersUsa
 *                      projection (handles AK / HI insets
 *                      natively). The highlighted state shifts
 *                      to maroon brand color; everyone else
 *                      uses the chosen ramp.
 *   - `dot-density`  — Each dot is one event (or N events at a
 *                      fixed scale). Dots are rejection-sampled
 *                      within the actual Texas state outline so
 *                      the distribution looks geographically
 *                      faithful.
 *   - `flow`         — Origin-destination curved arcs between
 *                      the seven primary Texas metros, projected
 *                      from real lat/lng (DFW · HOU · SAT · AUS ·
 *                      ELP · MCA · LBB). Arc width scales with
 *                      volume; arrows mark the destination.
 *
 * Geometry is pre-projected at build time by
 * `scripts/build-geo.mjs` (us-atlas + TxDOT MapServer →
 * Visvalingam-simplified TopoJSON → d3-geoAlbers / d3-geoAlbersUsa
 * → SVG path strings). The component just renders; no runtime
 * projection or topology library. Re-run the build script when
 * upstream sources change.
 *
 * Each kind renders through an async child component
 * (TuxChartGeo<Kind>.vue) that statically imports ONLY its own geo
 * data module, so a consumer rendering `kind="districts"` never
 * downloads county or US-state geometry (~348KB eager before the
 * split; ~9–164KB per kind after). SSR still renders the full SVG —
 * Vue awaits async components server-side — so prerendered pages,
 * the a11y audit, and no-JS readers see the complete map.
 *
 * Wrap in `<TuxChartFrame>` for the eyebrow + Oswald title +
 * source-line rhythm.
 */
type Kind = "county" | "districts" | "us-context" | "dot-density" | "flow";
type Palette = "maroon" | "slate";

interface DistrictDatum { id: number; value: number }
interface USStateDatum { code: string; value: number }
interface CountyDatum { fips: string; value: number }
interface FlowDatum { from: string; to: string; value: number }

interface Props {
  kind: Kind;
  palette?: Palette;
  title?: string;
  legendLabel?: string;
  legendStops?: string[];
  showLegend?: boolean;
  counties?: CountyDatum[];
  districts?: DistrictDatum[];
  states?: USStateDatum[];
  highlight?: string;
  dots?: number;
  dotLegend?: string;
  flows?: FlowDatum[];
  flowLegend?: string;
}

const props = withDefaults(defineProps<Props>(), {
  palette: "maroon",
  title: "",
  legendLabel: "Value",
  legendStops: () => ["Low", "", "", "", "High"],
  showLegend: true,
  counties: () => [],
  districts: () => [],
  states: () => [],
  highlight: "TX",
  dots: 600,
  dotLegend: "1 dot = 100 incidents",
  flows: () => [],
  flowLegend: "Daily trips (thousands)",
});

const KIND_COMPONENTS: Record<Kind, ReturnType<typeof defineAsyncComponent>> = {
  "county": defineAsyncComponent(() => import("./TuxChartGeoCounty.vue")),
  "districts": defineAsyncComponent(() => import("./TuxChartGeoDistricts.vue")),
  "us-context": defineAsyncComponent(() => import("./TuxChartGeoUsContext.vue")),
  "dot-density": defineAsyncComponent(() => import("./TuxChartGeoDotDensity.vue")),
  "flow": defineAsyncComponent(() => import("./TuxChartGeoFlow.vue")),
};

const kindComponent = computed(() => KIND_COMPONENTS[props.kind]);

/** Only the props the active kind's child declares — no fallthrough. */
const childProps = computed(() => {
  const shared = {
    palette: props.palette,
    title: props.title,
    showLegend: props.showLegend,
  };
  const choropleth = {
    legendLabel: props.legendLabel,
    legendStops: props.legendStops,
  };
  switch (props.kind) {
    case "county":
      return { ...shared, ...choropleth, counties: props.counties };
    case "districts":
      return { ...shared, ...choropleth, districts: props.districts };
    case "us-context":
      return { ...shared, ...choropleth, states: props.states, highlight: props.highlight };
    case "dot-density":
      return { ...shared, dots: props.dots, dotLegend: props.dotLegend };
    case "flow":
    default:
      return { ...shared, flows: props.flows, flowLegend: props.flowLegend };
  }
});
</script>

<template>
  <div class="tux-chart-geographic" :data-kind="kind">
    <component :is="kindComponent" v-bind="childProps" />
  </div>
</template>

<style scoped>
.tux-chart-geographic { font-family: var(--font-body); width: 100%; }
/* :deep — the svg root now lives inside the async kind child, behind
   the defineAsyncComponent wrapper, so plain scoped matching can't be
   relied on to reach it. */
.tux-chart-geographic :deep(.tux-chart-geographic__svg) { display: block; max-width: 100%; height: auto; }
</style>
