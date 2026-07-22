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
 * Wrap in `<TuxChartFrame>` for the eyebrow + Oswald title +
 * source-line rhythm.
 */
import {
  TX_VIEWBOX,
  texasOutlinePath,
  texasOutlinePolygon,
  txdotDistricts,
  txMetros,
} from "../assets/geo/texas";
import { texasCounties } from "../assets/geo/texas-counties";
import { US_VIEWBOX, usStates } from "../assets/geo/us-states";

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

const ramp = computed(() => {
  if (props.palette === "slate") {
    return [
      "var(--map-seq-slate-1)",
      "var(--map-seq-slate-2)",
      "var(--map-seq-slate-3)",
      "var(--map-seq-slate-4)",
      "var(--map-seq-slate-5)",
    ];
  }
  return [
    "var(--map-seq-maroon-1)",
    "var(--map-seq-maroon-2)",
    "var(--map-seq-maroon-3)",
    "var(--map-seq-maroon-4)",
    "var(--map-seq-maroon-5)",
  ];
});

function bucket(v: number): number {
  return Math.min(4, Math.max(0, Math.floor(v * 5)));
}

/** Deterministic 0..1 demo value derived from a string identifier
 *  so the showcase renders without consumer-passed data. */
function demoValueFor(seed: string | number): number {
  const s = String(seed);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return ((h % 1000) / 1000);
}

const viewBox = computed(() => {
  if (props.kind === "us-context") return `0 0 ${US_VIEWBOX[0]} ${US_VIEWBOX[1]}`;
  return `0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}`;
});
const viewBoxW = computed(() => (props.kind === "us-context" ? US_VIEWBOX[0] : TX_VIEWBOX[0]));
const viewBoxH = computed(() => (props.kind === "us-context" ? US_VIEWBOX[1] : TX_VIEWBOX[1]));

const countyValueByFips = computed(() => {
  const map = new Map<string, number>();
  for (const c of props.counties) map.set(c.fips, c.value);
  return map;
});
const districtValueById = computed(() => {
  const map = new Map<number, number>();
  for (const d of props.districts) map.set(d.id, d.value);
  return map;
});
const stateValueByCode = computed(() => {
  const map = new Map<string, number>();
  for (const s of props.states) map.set(s.code, s.value);
  return map;
});

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
  if (props.kind !== "dot-density") return [];
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

const titlePos = computed(() => ({ x: viewBoxW.value - 12, y: 28 }));
const legendOrigin = computed(() => ({ x: 24, y: viewBoxH.value - 56 }));
const flowLegendOrigin = computed(() => ({ x: viewBoxW.value - 220, y: viewBoxH.value - 60 }));
const dotLegendOrigin = computed(() => ({ x: 24, y: viewBoxH.value - 50 }));
</script>

<template>
  <div class="tux-chart-geographic" :data-kind="kind">
    <svg
      :viewBox="viewBox"
      width="100%"
      role="img"
      :aria-label="title || `Texas geographic chart (${kind})`"
      class="tux-chart-geographic__svg"
    >
      <!-- ── kind="county" — real Texas county polygons ──────── -->
      <template v-if="kind === 'county'">
        <path
          v-for="county in texasCounties"
          :key="county.fips"
          :d="county.path"
          :fill="ramp[bucket(countyValueByFips.get(county.fips) ?? demoValueFor(county.fips))]"
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
      </template>

      <!-- ── kind="districts" — real TxDOT 25 districts ──────── -->
      <template v-else-if="kind === 'districts'">
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
            :fill="ramp[bucket(districtValueById.get(d.id) ?? demoValueFor(d.id))]"
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
      </template>

      <!-- ── kind="us-context" — real AlbersUsa state polygons ── -->
      <template v-else-if="kind === 'us-context'">
        <g v-for="s in usStates" :key="s.code">
          <path
            :d="s.path"
            :fill="s.code === highlight
              ? 'var(--brand-primary)'
              : ramp[bucket(stateValueByCode.get(s.code) ?? demoValueFor(s.code))]"
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
      </template>

      <!-- ── kind="dot-density" — rejection-sampled inside outline ── -->
      <template v-else-if="kind === 'dot-density'">
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
      </template>

      <!-- ── kind="flow" — OD curves between projected metros ── -->
      <template v-else-if="kind === 'flow'">
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
      </template>

      <!-- Title overlay (top-right) -->
      <text
        v-if="title"
        :x="titlePos.x"
        :y="titlePos.y"
        text-anchor="end"
        font-size="11"
        fill="var(--text-muted)"
        font-family="var(--font-bold)"
        letter-spacing="0.1em"
        font-weight="700"
      >{{ title.toUpperCase() }}</text>

      <!-- Choropleth legend -->
      <g
        v-if="showLegend && (kind === 'county' || kind === 'districts' || kind === 'us-context')"
        :transform="`translate(${legendOrigin.x}, ${legendOrigin.y})`"
      >
        <text
          x="0" y="-8"
          font-size="10"
          fill="var(--text-muted)"
          font-family="var(--font-bold)"
          letter-spacing="0.1em"
          font-weight="700"
        >{{ legendLabel.toUpperCase() }}</text>
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
          v-for="(s, i) in legendStops"
          :key="`tk-${i}`"
          :x="i * 30 + 15"
          y="27"
          text-anchor="middle"
          font-size="9"
          fill="var(--text-muted)"
          font-family="var(--font-mono)"
        >{{ s }}</text>
      </g>

      <!-- Dot density legend -->
      <g
        v-if="showLegend && kind === 'dot-density'"
        :transform="`translate(${dotLegendOrigin.x}, ${dotLegendOrigin.y})`"
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

      <!-- Flow legend -->
      <g
        v-if="showLegend && kind === 'flow'"
        :transform="`translate(${flowLegendOrigin.x}, ${flowLegendOrigin.y})`"
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
  </div>
</template>

<style scoped>
.tux-chart-geographic { font-family: var(--font-body); width: 100%; }
.tux-chart-geographic__svg { display: block; max-width: 100%; height: auto; }
</style>
