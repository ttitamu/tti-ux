<script setup lang="ts">
/**
 * TuxChartSankey — native SVG multi-stage directed acyclic flow diagram.
 *
 * Zero external graphing dependencies. Automatically infers topological
 * stage columns when `node.stage` is omitted, scales node heights
 * proportionally to `max(inflow, outflow)`, and renders cubic-Bezier
 * flow ribbons with a single-tab-stop keyboard roving cursor.
 */
import { computed } from "vue";
import { useTuxChartHover } from "../composables/useTuxChartHover";
import { useTuxVisionPrefs } from "../composables/useTuxVisionPrefs";
import { tuxExtent, tuxSeriesTone } from "../utils/tuxChartScale";

export interface SankeyNode {
  id: string;
  label: string;
  /** Optional explicit 0-based stage column; inferred topologically when omitted. */
  stage?: number;
  /** Optional 1..8 categorical palette override. */
  toneIndex?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyHoverPayload {
  index: number;
  source: string;
  sourceLabel: string;
  target: string;
  targetLabel: string;
  value: number;
  share: number;
}

export interface TuxChartSankeyProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  palette?: "brand" | "cvd";
  units?: string;
  format?: (n: number) => string;
  ariaSummary?: string;
  tooltip?: boolean;
}

const props = withDefaults(defineProps<TuxChartSankeyProps>(), {
  width: 680,
  height: 340,
  palette: "brand",
  units: undefined,
  format: (n: number) => n.toLocaleString(),
  ariaSummary: undefined,
  tooltip: true,
});

const emit = defineEmits<{
  hover: [payload: SankeyHoverPayload | null];
}>();

const { prefs: visionPrefs } = useTuxVisionPrefs();

const PAD_X = 20;
const PAD_Y = 20;
const NODE_W = 16;
const NODE_GAP = 14;

const f2 = (n: number): number => Math.round(n * 100) / 100;

function formatWithUnits(val: number): string {
  const base = props.format(val);
  return props.units ? `${base} ${props.units}` : base;
}

interface PositionedNode {
  id: string;
  label: string;
  colIdx: number;
  x: number;
  y: number;
  w: number;
  h: number;
  inflow: number;
  outflow: number;
  value: number;
  tone: number;
  toneClass: string;
}

interface PositionedLink {
  index: number;
  source: string;
  sourceLabel: string;
  target: string;
  targetLabel: string;
  value: number;
  share: number;
  path: string;
  midX: number;
  midY: number;
  tone: number;
  toneClass: string;
}

const layout = computed(() => {
  const nodeMap = new Map<string, { node: SankeyNode; order: number }>();
  props.nodes.forEach((n, idx) => {
    nodeMap.set(n.id, { node: n, order: idx });
  });

  const validLinks = props.links.filter(
    (l) =>
      Number.isFinite(l.value) &&
      l.value > 0 &&
      l.source !== l.target &&
      nodeMap.has(l.source) &&
      nodeMap.has(l.target),
  );

  if (props.nodes.length === 0) {
    return {
      nodes: [] as PositionedNode[],
      links: [] as PositionedLink[],
      colCount: 0,
      totalFlow: 0,
    };
  }

  // 1. Infer stage depth via bounded topological relaxation
  const rawStages = new Map<string, number>();
  const explicitIds = new Set<string>();
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();
  const inflowMap = new Map<string, number>();
  const outflowMap = new Map<string, number>();

  for (const n of props.nodes) {
    inDegree.set(n.id, 0);
    outDegree.set(n.id, 0);
    inflowMap.set(n.id, 0);
    outflowMap.set(n.id, 0);
    if (n.stage !== undefined && Number.isFinite(n.stage)) {
      rawStages.set(n.id, Math.max(0, Math.floor(n.stage)));
      explicitIds.add(n.id);
    } else {
      rawStages.set(n.id, 0);
    }
  }

  for (const l of validLinks) {
    outDegree.set(l.source, (outDegree.get(l.source) ?? 0) + 1);
    inDegree.set(l.target, (inDegree.get(l.target) ?? 0) + 1);
    outflowMap.set(l.source, (outflowMap.get(l.source) ?? 0) + l.value);
    inflowMap.set(l.target, (inflowMap.get(l.target) ?? 0) + l.value);
  }

  const maxPasses = props.nodes.length;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;
    for (const l of validLinks) {
      if (explicitIds.has(l.target)) continue;
      const uStage = rawStages.get(l.source) ?? 0;
      const vStage = rawStages.get(l.target) ?? 0;
      if (vStage < uStage + 1) {
        rawStages.set(l.target, uStage + 1);
        changed = true;
      }
    }
    if (!changed) break;
  }

  let maxRawStage = 0;
  for (const s of rawStages.values()) {
    if (s > maxRawStage) maxRawStage = s;
  }

  // Justify pure sinks to the final column unless stage was explicitly pinned
  if (maxRawStage > 0) {
    for (const n of props.nodes) {
      if (
        !explicitIds.has(n.id) &&
        (outDegree.get(n.id) ?? 0) === 0 &&
        (inDegree.get(n.id) ?? 0) > 0
      ) {
        rawStages.set(n.id, maxRawStage);
      }
    }
  }

  // Compress occupied stage numbers to contiguous 0..colCount-1 columns
  const uniqueStages = [...new Set(rawStages.values())].sort((a, b) => a - b);
  const stageToCol = new Map<number, number>();
  uniqueStages.forEach((st, idx) => stageToCol.set(st, idx));
  const colCount = uniqueStages.length;

  // 2. Group nodes by column and compute shared vertical scale ky
  const columns: Array<Array<{ node: SankeyNode; order: number; inflow: number; outflow: number; value: number }>> =
    Array.from({ length: colCount }, () => []);

  props.nodes.forEach((n, idx) => {
    const colIdx = stageToCol.get(rawStages.get(n.id) ?? 0) ?? 0;
    const inflow = inflowMap.get(n.id) ?? 0;
    const outflow = outflowMap.get(n.id) ?? 0;
    const value = Math.max(inflow, outflow);
    columns[colIdx]!.push({ node: n, order: idx, inflow, outflow, value });
  });

  const plotW = Math.max(120, props.width - PAD_X * 2);
  const plotH = Math.max(80, props.height - PAD_Y * 2);

  let ky = Infinity;
  for (const col of columns) {
    if (col.length === 0) continue;
    const colSum = col.reduce((s, item) => s + item.value, 0);
    const availH = Math.max(24, plotH - Math.max(0, col.length - 1) * NODE_GAP);
    if (colSum > 0) {
      ky = Math.min(ky, availH / colSum);
    }
  }
  if (!Number.isFinite(ky) || ky <= 0) ky = 1;

  // 3. Position nodes per column
  const positionedById = new Map<string, PositionedNode>();
  const positionedNodes: PositionedNode[] = [];

  columns.forEach((col, colIdx) => {
    const colX =
      colCount <= 1
        ? PAD_X + (plotW - NODE_W) / 2
        : PAD_X + colIdx * ((plotW - NODE_W) / (colCount - 1));

    const gap =
      col.length > 1
        ? Math.min(NODE_GAP, Math.max(4, (plotH * 0.35) / (col.length - 1)))
        : 0;
    const rawHeights = col.map((item) => Math.max(6, item.value * ky));
    const totalRawBarH = rawHeights.reduce((a, b) => a + b, 0);
    const totalGapH = Math.max(0, col.length - 1) * gap;
    const availForBars = Math.max(12, plotH - totalGapH);
    const fitScale = totalRawBarH > availForBars ? availForBars / totalRawBarH : 1;

    const finalHeights = rawHeights.map((h) => h * fitScale);
    const stackH = finalHeights.reduce((a, b) => a + b, 0) + totalGapH;
    let curY = PAD_Y + Math.max(0, (plotH - stackH) / 2);

    col.forEach((item, i) => {
      const h = finalHeights[i]!;
      const tone = tuxSeriesTone(item.order, item.node.toneIndex);
      const pNode: PositionedNode = {
        id: item.node.id,
        label: item.node.label,
        colIdx,
        x: f2(colX),
        y: f2(curY),
        w: NODE_W,
        h: f2(h),
        inflow: item.inflow,
        outflow: item.outflow,
        value: item.value,
        tone,
        toneClass: `tux-chart-sankey__tone--c${tone} tux-chart-tone--c${tone}`,
      };
      positionedById.set(pNode.id, pNode);
      positionedNodes.push(pNode);
      curY += h + gap;
    });
  });

  // Preserve original node order in output array for predictable rendering
  positionedNodes.sort(
    (a, b) => (nodeMap.get(a.id)?.order ?? 0) - (nodeMap.get(b.id)?.order ?? 0),
  );

  // 4. Compute link port offsets & cubic-Bezier ribbon paths
  const totalFlow = validLinks.reduce((s, l) => s + l.value, 0);
  const indexedLinks = validLinks.map((l, idx) => ({ ...l, origIdx: idx }));

  const outByNode = new Map<string, typeof indexedLinks>();
  const inByNode = new Map<string, typeof indexedLinks>();

  for (const l of indexedLinks) {
    if (!outByNode.has(l.source)) outByNode.set(l.source, []);
    outByNode.get(l.source)!.push(l);
    if (!inByNode.has(l.target)) inByNode.set(l.target, []);
    inByNode.get(l.target)!.push(l);
  }

  const srcPort = new Map<number, { y0: number; y1: number }>();
  const tgtPort = new Map<number, { y0: number; y1: number }>();

  for (const [srcId, list] of outByNode.entries()) {
    const srcNode = positionedById.get(srcId)!;
    list.sort((a, b) => {
      const ta = positionedById.get(a.target)!;
      const tb = positionedById.get(b.target)!;
      return ta.y + ta.h / 2 - (tb.y + tb.h / 2);
    });
    const denom = Math.max(srcNode.outflow, srcNode.value, 1e-9);
    let offset = srcNode.y;
    for (const l of list) {
      const th = Math.max(2, (l.value / denom) * srcNode.h);
      srcPort.set(l.origIdx, { y0: offset, y1: Math.min(srcNode.y + srcNode.h, offset + th) });
      offset += th;
    }
  }

  for (const [tgtId, list] of inByNode.entries()) {
    const tgtNode = positionedById.get(tgtId)!;
    list.sort((a, b) => {
      const sa = positionedById.get(a.source)!;
      const sb = positionedById.get(b.source)!;
      return sa.y + sa.h / 2 - (sb.y + sb.h / 2);
    });
    const denom = Math.max(tgtNode.inflow, tgtNode.value, 1e-9);
    let offset = tgtNode.y;
    for (const l of list) {
      const th = Math.max(2, (l.value / denom) * tgtNode.h);
      tgtPort.set(l.origIdx, { y0: offset, y1: Math.min(tgtNode.y + tgtNode.h, offset + th) });
      offset += th;
    }
  }

  const positionedLinks: PositionedLink[] = indexedLinks.map((l, idx) => {
    const sNode = positionedById.get(l.source)!;
    const tNode = positionedById.get(l.target)!;
    const sp = srcPort.get(l.origIdx) ?? { y0: sNode.y, y1: sNode.y + 2 };
    const tp = tgtPort.get(l.origIdx) ?? { y0: tNode.y, y1: tNode.y + 2 };

    const x0 = f2(sNode.x + sNode.w);
    const x1 = f2(tNode.x);
    const mx = f2((x0 + x1) / 2);
    const sy0 = f2(sp.y0);
    const sy1 = f2(sp.y1);
    const ty0 = f2(tp.y0);
    const ty1 = f2(tp.y1);

    const path = `M ${x0} ${sy0} C ${mx} ${sy0}, ${mx} ${ty0}, ${x1} ${ty0} L ${x1} ${ty1} C ${mx} ${ty1}, ${mx} ${sy1}, ${x0} ${sy1} Z`;
    const midX = f2((x0 + x1) / 2);
    const midY = f2(((sy0 + sy1) / 2 + (ty0 + ty1) / 2) / 2);

    return {
      index: idx,
      source: l.source,
      sourceLabel: sNode.label,
      target: l.target,
      targetLabel: tNode.label,
      value: l.value,
      share: totalFlow > 0 ? l.value / totalFlow : 0,
      path,
      midX,
      midY,
      tone: sNode.tone,
      toneClass: sNode.toneClass,
    };
  });

  return {
    nodes: positionedNodes,
    links: positionedLinks,
    colCount,
    totalFlow,
  };
});

const computedAriaSummary = computed(() => {
  if (props.ariaSummary) return props.ariaSummary;
  const { nodes, links, colCount } = layout.value;
  if (links.length === 0) {
    return `Sankey flow diagram: ${nodes.length} nodes across ${colCount} stages.`;
  }
  const [minFlow, maxFlow] = tuxExtent(links.map((l) => l.value));
  return `Sankey flow diagram: ${nodes.length} nodes across ${colCount} stages, ${links.length} links from ${formatWithUnits(minFlow)} to ${formatWithUnits(maxFlow)}. Use Left and Right arrow keys to inspect each flow link.`;
});

function nodeLabelPlacement(node: PositionedNode) {
  const isRightStage = layout.value.colCount > 1 && node.colIdx === layout.value.colCount - 1;
  return {
    x: isRightStage ? f2(node.x - 8) : f2(node.x + node.w + 8),
    y: f2(node.y + node.h / 2),
    anchor: (isRightStage ? "end" : "start") as "start" | "end",
  };
}

// ----- Roving-cursor hover & keyboard contract -----------------------
const {
  hoverIndex,
  setHoverIndex,
  onPointerLeave: onSankeyLeave,
  onKeydown: onSankeyKey,
} = useTuxChartHover({
  count: () => layout.value.links.length,
  enabled: () => props.tooltip,
  indexFromPointer: () => null,
  onChange(idx) {
    if (idx === null) {
      emit("hover", null);
      return;
    }
    const link = layout.value.links[idx];
    if (!link) return;
    emit("hover", {
      index: link.index,
      source: link.source,
      sourceLabel: link.sourceLabel,
      target: link.target,
      targetLabel: link.targetLabel,
      value: link.value,
      share: link.share,
    });
  },
});

function onLinkEnter(idx: number) {
  if (props.tooltip) setHoverIndex(idx);
}

const activeLink = computed(() =>
  hoverIndex.value === null ? null : layout.value.links[hoverIndex.value] ?? null,
);

const tooltipPos = computed(() => {
  const link = activeLink.value;
  if (!link) return null;
  const xPct = (link.midX / Math.max(1, props.width)) * 100;
  const yPct = (link.midY / Math.max(1, props.height)) * 100;
  return {
    xPct: f2(xPct),
    yPct: f2(Math.max(6, Math.min(82, yPct))),
    flip: xPct > 60,
  };
});
</script>

<template>
  <div
    class="tux-chart-sankey"
    :class="[(palette === 'cvd' || visionPrefs.cvdMode !== 'brand') && 'tux-chart--cvd']"
    :data-chart-palette="palette"
    :data-cvd-mode="visionPrefs.cvdMode"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      preserveAspectRatio="xMidYMid meet"
      class="tux-chart-sankey__svg"
      tabindex="0"
      role="img"
      :aria-label="computedAriaSummary"
      @keydown="onSankeyKey"
      @pointerleave="onSankeyLeave"
    >
      <!-- Cubic-Bezier Flow Ribbons -->
      <g class="tux-chart-sankey__links">
        <path
          v-for="(link, i) in layout.links"
          :key="`link-${link.source}-${link.target}-${i}`"
          :d="link.path"
          :class="[
            'tux-chart-sankey__link',
            link.toneClass,
            hoverIndex === i && 'tux-chart-sankey__link--active',
            hoverIndex !== null && hoverIndex !== i && 'tux-chart-sankey__link--dim',
          ]"
          @pointerenter="onLinkEnter(i)"
        >
          <title>{{ link.sourceLabel }} → {{ link.targetLabel }}: {{ formatWithUnits(link.value) }}</title>
        </path>
      </g>

      <!-- Stage Node Bars -->
      <g class="tux-chart-sankey__nodes">
        <g
          v-for="node in layout.nodes"
          :key="`node-${node.id}`"
          class="tux-chart-sankey__node-group"
        >
          <rect
            :x="node.x"
            :y="node.y"
            :width="node.w"
            :height="node.h"
            rx="2"
            :class="[
              'tux-chart-sankey__node',
              node.toneClass,
              activeLink &&
                (activeLink.source === node.id || activeLink.target === node.id) &&
                'tux-chart-sankey__node--active',
            ]"
          >
            <title>{{ node.label }}: {{ formatWithUnits(node.value) }}</title>
          </rect>

          <text
            :x="nodeLabelPlacement(node).x"
            :y="nodeLabelPlacement(node).y - 2"
            :text-anchor="nodeLabelPlacement(node).anchor"
            class="tux-chart-sankey__node-label"
          >
            {{ node.label }}
          </text>
          <text
            :x="nodeLabelPlacement(node).x"
            :y="nodeLabelPlacement(node).y + 11"
            :text-anchor="nodeLabelPlacement(node).anchor"
            class="tux-chart-sankey__node-total"
          >
            {{ formatWithUnits(node.value) }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Branded Auto-Flipping Tooltip Card -->
    <div
      v-if="tooltip && activeLink && tooltipPos"
      class="tux-chart-tooltip tux-chart-sankey__tooltip"
      :class="{ 'tux-chart-tooltip--flip': tooltipPos.flip }"
      role="status"
      aria-live="polite"
      :style="{
        left: `calc(${tooltipPos.xPct}% + ${tooltipPos.flip ? '-10px' : '10px'})`,
        top: `${tooltipPos.yPct}%`,
      }"
    >
      <p :class="['tux-chart-sankey__tooltip-route', activeLink.toneClass]">
        <span class="tux-chart-sankey__tooltip-swatch" />
        <span>{{ activeLink.sourceLabel }} → {{ activeLink.targetLabel }}</span>
      </p>
      <p class="tux-chart-sankey__tooltip-value">
        {{ formatWithUnits(activeLink.value) }}
        <span class="tux-chart-sankey__tooltip-share">
          ({{ (activeLink.share * 100).toFixed(1) }}%)
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.tux-chart-sankey {
  position: relative;
  width: 100%;
  font-family: var(--font-body);
  line-height: 1.5;
}

.tux-chart-sankey__svg {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.tux-chart-sankey__svg:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.tux-chart-sankey__link {
  fill: var(--tux-chart-tone, var(--chart-1));
  fill-opacity: 0.36;
  stroke: var(--tux-chart-tone, var(--chart-1));
  stroke-opacity: 0.22;
  stroke-width: 0.75;
  cursor: pointer;
  transition: fill-opacity 140ms ease, stroke-opacity 140ms ease;
}

.tux-chart-sankey__link:hover,
.tux-chart-sankey__link--active {
  fill-opacity: 0.76;
  stroke-opacity: 0.95;
  stroke-width: 1.25;
}

.tux-chart-sankey__link--dim {
  fill-opacity: 0.16;
  stroke-opacity: 0.1;
}

.tux-chart-sankey__node {
  fill: var(--tux-chart-tone, var(--chart-1));
  stroke: var(--surface-page);
  stroke-width: 1;
  transition: stroke-width 140ms ease;
}

.tux-chart-sankey__node--active {
  stroke: var(--text-primary);
  stroke-width: 2;
}

.tux-chart-sankey__node-label {
  fill: var(--text-primary);
  font-family: var(--font-bold);
  font-size: 11px;
  font-weight: 700;
  pointer-events: none;
}

.tux-chart-sankey__node-total {
  fill: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

.tux-chart-sankey__tooltip-route {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  margin: 0;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-chart-sankey__tooltip-swatch {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-sm);
  background: var(--tux-chart-tone, var(--chart-1));
  flex-shrink: 0;
}

.tux-chart-sankey__tooltip-value {
  margin: var(--space-2) 0 0 0;
  font-family: var(--font-mono);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.tux-chart-sankey__tooltip-share {
  color: var(--text-muted);
  font-weight: 400;
}

@media (prefers-reduced-motion: reduce) {
  .tux-chart-sankey__link,
  .tux-chart-sankey__node {
    transition: none;
  }
}
</style>
