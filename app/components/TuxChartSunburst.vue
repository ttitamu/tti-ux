<script setup lang="ts">
/**
 * TuxChartSunburst — radial counterpart to `TuxTreemap`. Two-ring
 * hierarchical breakdown where the angular extent of each arc is
 * proportional to its share of the parent total.
 *
 *   - Inner ring = top-level groups (5–8 max for legibility)
 *   - Outer ring = children, opacity stepped within each group
 *   - Center = total (label + bold mono numerals)
 *
 * Use sunburst when the audience needs to *feel* the radial
 * structure of a program — budget breakdown, portfolio
 * composition, capacity inventory. Treemap is better when the
 * comparative size of children matters (sunburst's angular
 * encoding is harder to read for tight ratios). For ranked
 * lists, use `TuxChartBar` — bars are far easier to read.
 *
 * Two rings is the maximum that stays readable; deeper hierarchy
 * (3+ rings) becomes a tree-diagram problem.
 *
 * Wrap in `<TuxChartFrame>` for the eyebrow + Oswald title +
 * source-line rhythm.
 */

interface SunburstChild { label: string; value: number }
interface SunburstGroup { label: string; children: SunburstChild[] }

interface Props {
  data: SunburstGroup[];
  size?: number;
  centerLabel?: string;
  formatTotal?: (total: number) => string;
  formatValue?: (v: number) => string;
  showLegend?: boolean;
  palette?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  size: 320,
  centerLabel: "Total",
  formatTotal: undefined,
  formatValue: undefined,
  showLegend: true,
  palette: undefined,
});

const palette = computed<string[]>(() =>
  props.palette ?? [
    "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
    "var(--chart-4)", "var(--chart-5)", "var(--chart-6)",
  ],
);

function arcPath(
  cx: number, cy: number,
  rIn: number, rOut: number,
  a0: number, a1: number,
): string {
  const x0o = cx + rOut * Math.cos(a0);
  const y0o = cy + rOut * Math.sin(a0);
  const x1o = cx + rOut * Math.cos(a1);
  const y1o = cy + rOut * Math.sin(a1);
  const x0i = cx + rIn * Math.cos(a0);
  const y0i = cy + rIn * Math.sin(a0);
  const x1i = cx + rIn * Math.cos(a1);
  const y1i = cy + rIn * Math.sin(a1);
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  return `M ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rIn} ${rIn} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const rIn = computed(() => props.size * 0.18);
const rMid = computed(() => props.size * 0.32);
const rOut = computed(() => props.size * 0.49);

const total = computed(() =>
  props.data.reduce(
    (s, d) => s + d.children.reduce((cs, c) => cs + c.value, 0),
    0,
  ),
);

interface RenderedGroup {
  start: number; end: number; color: string;
  label: string; value: number; share: number;
  children: SunburstChild[];
}
interface RenderedChild {
  start: number; end: number; color: string; opacity: number;
  label: string; value: number; share: number; groupIdx: number;
}

const arcs = computed(() => {
  const groupArcs: RenderedGroup[] = [];
  const childArcs: RenderedChild[] = [];
  const t = total.value;
  if (t <= 0) return { groupArcs, childArcs };

  let theta = -Math.PI / 2;
  props.data.forEach((g, gi) => {
    const groupTotal = g.children.reduce((s, c) => s + c.value, 0);
    const groupExtent = (groupTotal / t) * Math.PI * 2;
    const groupStart = theta;
    const groupEnd = theta + groupExtent;
    groupArcs.push({
      start: groupStart, end: groupEnd,
      // Index is `gi % length` so always in range; `!` quiets
      // noUncheckedIndexedAccess.
      color: palette.value[gi % palette.value.length]!,
      label: g.label, value: groupTotal,
      share: groupTotal / t, children: g.children,
    });
    let inner = groupStart;
    g.children.forEach((c, ci) => {
      const ext = (c.value / t) * Math.PI * 2;
      childArcs.push({
        start: inner, end: inner + ext,
        color: palette.value[gi % palette.value.length]!,
        opacity: 0.4 + (ci / Math.max(1, g.children.length)) * 0.5,
        label: c.label, value: c.value,
        share: c.value / t, groupIdx: gi,
      });
      inner += ext;
    });
    theta = groupEnd;
  });
  return { groupArcs, childArcs };
});

const formattedTotal = computed(() =>
  props.formatTotal ? props.formatTotal(total.value) : `$${total.value}M`,
);

function fmtValue(v: number): string {
  return props.formatValue ? props.formatValue(v) : `$${v}M`;
}
</script>

<template>
  <div class="tux-chart-sunburst" :class="{ 'tux-chart-sunburst--bare': !showLegend }">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      :width="size" :height="size"
      role="img"
      :aria-label="`Sunburst chart · ${formattedTotal}`"
      class="tux-chart-sunburst__svg"
    >
      <path
        v-for="(a, i) in arcs.childArcs"
        :key="`c-${i}`"
        :d="arcPath(cx, cy, rMid, rOut, a.start, a.end)"
        :fill="a.color"
        :fill-opacity="a.opacity"
        stroke="var(--surface-page)"
        stroke-width="1"
      >
        <title>{{ a.label }} · {{ fmtValue(a.value) }} · {{ Math.round(a.share * 100) }}%</title>
      </path>

      <path
        v-for="(a, i) in arcs.groupArcs"
        :key="`g-${i}`"
        :d="arcPath(cx, cy, rIn, rMid, a.start, a.end)"
        :fill="a.color"
        stroke="var(--surface-page)"
        stroke-width="1.5"
      >
        <title>{{ a.label }} · {{ fmtValue(a.value) }} · {{ Math.round(a.share * 100) }}%</title>
      </path>

      <text
        :x="cx" :y="cy - 4"
        text-anchor="middle"
        font-size="9"
        fill="var(--text-muted)"
        font-family="var(--font-bold)"
        font-weight="700"
        letter-spacing="0.1em"
      >{{ centerLabel.toUpperCase() }}</text>
      <text
        :x="cx" :y="cy + 12"
        text-anchor="middle"
        font-size="14"
        fill="var(--text-primary)"
        font-family="var(--font-mono)"
        font-weight="700"
        style="font-variant-numeric: tabular-nums;"
      >{{ formattedTotal }}</text>
    </svg>

    <div v-if="showLegend" class="tux-chart-sunburst__legend">
      <div
        v-for="(g, gi) in arcs.groupArcs"
        :key="`leg-${gi}`"
        class="tux-chart-sunburst__legend-group"
      >
        <div class="tux-chart-sunburst__legend-header">
          <span
            class="tux-chart-sunburst__legend-swatch"
            :style="{ background: g.color }"
            aria-hidden="true"
          />
          <span class="tux-chart-sunburst__legend-label">{{ g.label }}</span>
          <span class="tux-chart-sunburst__legend-total">
            {{ fmtValue(g.value) }} · {{ Math.round(g.share * 100) }}%
          </span>
        </div>
        <div class="tux-chart-sunburst__legend-children">
          <div
            v-for="(c, ci) in g.children"
            :key="ci"
            :class="[
              'tux-chart-sunburst__legend-child',
              ci === g.children.length - 1 && 'tux-chart-sunburst__legend-child--last',
            ]"
          >
            <span>{{ c.label }}</span>
            <span class="tux-chart-sunburst__legend-num">{{ fmtValue(c.value) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-chart-sunburst {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  font-family: var(--font-body);
  container-type: inline-size;
  container-name: tux-chart-sunburst;
}
.tux-chart-sunburst--bare { grid-template-columns: auto; }
.tux-chart-sunburst__svg { display: block; }

.tux-chart-sunburst__legend { min-width: 0; }
.tux-chart-sunburst__legend-group { margin-bottom: 0.875rem; }
.tux-chart-sunburst__legend-group:last-child { margin-bottom: 0; }
.tux-chart-sunburst__legend-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}
.tux-chart-sunburst__legend-swatch {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 1px;
  flex-shrink: 0;
}
.tux-chart-sunburst__legend-label {
  font-size: 0.78rem;
  font-family: var(--font-bold);
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.tux-chart-sunburst__legend-total {
  margin-left: auto;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.74rem;
  color: var(--text-muted);
}
.tux-chart-sunburst__legend-children {
  padding-left: 1.25rem;
  font-size: 0.74rem;
  color: var(--text-secondary);
  line-height: 1.7;
}
.tux-chart-sunburst__legend-child {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed var(--surface-border);
  padding: 0.1875rem 0;
}
.tux-chart-sunburst__legend-child--last { border-bottom: none; }
.tux-chart-sunburst__legend-num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

@container tux-chart-sunburst (max-width: 36rem) {
  .tux-chart-sunburst {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 1rem;
  }
  .tux-chart-sunburst__legend { width: 100%; }
}
</style>
