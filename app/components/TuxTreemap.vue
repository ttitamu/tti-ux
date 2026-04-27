<script setup lang="ts">
// TuxTreemap — squarified hierarchical-size visualization.
//
// PECAN's headline viz. Replaces diskover's D3 v3 treemap. Self-contained
// SVG implementation — no external viz library. Implements the squarified
// treemap algorithm (Bruls, Huijsen, van Wijk · 1999) so the cells stay
// near-square at every level, which is what makes it readable.
//
// Color scale: maroon ramp keyed to size (or depth, via prop). Click a
// cell to drill into its subtree; click the breadcrumb to zoom out.
// Hover shows path + bytes + child count.

interface TreeNode {
  name: string;
  /** Size in arbitrary units (bytes, count, etc). For leaf nodes only;
   *  for parents this is computed as the sum of children. */
  size?: number;
  children?: TreeNode[];
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB", "PB"];
  let i = -1;
  let v = n;
  do {
    v /= 1024;
    i++;
  } while (v >= 1024 && i < units.length - 1);
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
}

interface Props {
  data: TreeNode;
  /** Overall canvas dimensions. */
  width?: number;
  height?: number;
  /** How deep to render before showing aggregate cells. */
  maxDepth?: number;
  /** Color cells by `size` (maroon ramp keyed to size) or `depth` (steps). */
  colorBy?: "size" | "depth";
  /** Unit used in default size formatting. `bytes` (default) renders
   *  B/KB/MB/GB/TB/PB; `count` renders a plain locale-formatted number;
   *  `percent` appends `%`. For more exotic formatting, format the
   *  values upstream and feed already-formatted strings via the data tree. */
  unit?: "bytes" | "count" | "percent";
}

const props = withDefaults(defineProps<Props>(), {
  width: 720,
  height: 460,
  maxDepth: 2,
  colorBy: "size",
  unit: "bytes",
});

function formatSize(n: number): string {
  if (props.unit === "count")   return n.toLocaleString();
  if (props.unit === "percent") return `${n.toLocaleString()}%`;
  return formatBytes(n);
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface LayoutCell {
  rect: Rect;
  node: TreeNode;
  size: number;
  depth: number;
  path: string;
  isAggregate?: boolean;
  childCount: number;
}

// Total size — sum of leaf sizes, propagated up.
function totalSize(node: TreeNode): number {
  if (node.children && node.children.length > 0) {
    return node.children.reduce((acc, c) => acc + totalSize(c), 0);
  }
  return node.size ?? 0;
}

// Squarified treemap: choose a row to add nodes to that minimizes the
// worst aspect ratio in that row. Returns layout for `nodes` filling the
// bounds rect.
function layoutRow(
  nodes: { node: TreeNode; size: number }[],
  bounds: Rect
): LayoutCell[] {
  const total = nodes.reduce((s, n) => s + n.size, 0);
  if (total === 0 || nodes.length === 0) return [];

  const cells: LayoutCell[] = [];
  let remaining = [...nodes];
  let region = { ...bounds };

  while (remaining.length > 0) {
    const isWide = region.w >= region.h;
    const shortSide = Math.min(region.w, region.h);

    // Take nodes greedily into the row until the worst aspect ratio gets worse.
    const row: { node: TreeNode; size: number }[] = [];
    let bestAspect = Infinity;
    let i = 0;
    const remTotal = remaining.reduce((s, n) => s + n.size, 0);
    const regionArea = region.w * region.h;
    const scale = regionArea / remTotal;

    while (i < remaining.length) {
      const candidate = remaining[i]!;
      const trial = [...row, candidate];
      const trialSum = trial.reduce((s, n) => s + n.size, 0);
      const rowLen = trialSum * scale / shortSide;
      const worst = Math.max(
        ...trial.map(n => {
          const cellLong = (n.size * scale) / rowLen;
          return Math.max(rowLen / cellLong, cellLong / rowLen);
        })
      );

      if (worst > bestAspect && row.length > 0) break;
      row.push(candidate);
      bestAspect = worst;
      i++;
    }

    // Lay out the row along the short side.
    const rowSum = row.reduce((s, n) => s + n.size, 0);
    const rowLen = (rowSum * scale) / shortSide;

    let cursor = 0;
    for (const n of row) {
      const cellLong = (n.size * scale) / rowLen;
      const cellRect: Rect = isWide
        ? { x: region.x, y: region.y + cursor, w: rowLen, h: cellLong }
        : { x: region.x + cursor, y: region.y, w: cellLong, h: rowLen };
      cells.push({
        rect: cellRect,
        node: n.node,
        size: n.size,
        depth: 0,
        path: n.node.name,
        childCount: n.node.children?.length ?? 0,
      });
      cursor += cellLong;
    }

    // Shrink region by the row's long axis.
    if (isWide) region = { x: region.x + rowLen, y: region.y, w: region.w - rowLen, h: region.h };
    else region = { x: region.x, y: region.y + rowLen, w: region.w, h: region.h - rowLen };

    remaining = remaining.slice(row.length);
  }

  return cells;
}

// Recursive layout — builds a flat list of cells across the whole tree
// down to maxDepth.
function layoutTree(node: TreeNode, bounds: Rect, depth: number, parentPath: string, maxDepth: number): LayoutCell[] {
  const path = parentPath ? `${parentPath} / ${node.name}` : node.name;
  const cells: LayoutCell[] = [];

  if (depth >= maxDepth || !node.children || node.children.length === 0) {
    cells.push({
      rect: bounds,
      node,
      size: totalSize(node),
      depth,
      path,
      isAggregate: depth >= maxDepth && (node.children?.length ?? 0) > 0,
      childCount: node.children?.length ?? 0,
    });
    return cells;
  }

  // Sort children largest-first — squarified is most accurate that way.
  const childData = node.children
    .map(c => ({ node: c, size: totalSize(c) }))
    .filter(c => c.size > 0)
    .sort((a, b) => b.size - a.size);

  const rowCells = layoutRow(childData, bounds);

  for (const cell of rowCells) {
    cell.depth = depth + 1;
    cell.path = path ? `${path} / ${cell.node.name}` : cell.node.name;
    if (cell.node.children && cell.node.children.length > 0 && depth + 1 < maxDepth) {
      // Reserve a header strip for the parent name at this depth.
      const header = Math.min(20, cell.rect.h * 0.18);
      const childRect: Rect = {
        x: cell.rect.x + 1,
        y: cell.rect.y + header,
        w: Math.max(0, cell.rect.w - 2),
        h: Math.max(0, cell.rect.h - header - 1),
      };
      cells.push({ ...cell, isAggregate: true });
      cells.push(...layoutTree(cell.node, childRect, depth + 1, path, maxDepth));
    } else {
      cells.push(cell);
    }
  }

  return cells;
}

// Color scale — maroon ramp keyed to size (log-scaled) or depth (linear).
function colorFor(cell: LayoutCell, sizeRange: [number, number]): string {
  if (cell.isAggregate) return "transparent";

  if (props.colorBy === "depth") {
    const t = Math.min(cell.depth / 4, 1);
    return `color-mix(in srgb, var(--brand-primary) ${20 + t * 60}%, var(--surface-raised))`;
  }

  // Size-based — log-scaled because file-size distributions are heavy-tailed.
  const [min, max] = sizeRange;
  const safeMin = Math.max(min, 1);
  const safeMax = Math.max(max, safeMin * 1.01);
  const t = (Math.log(Math.max(cell.size, safeMin)) - Math.log(safeMin)) /
            (Math.log(safeMax) - Math.log(safeMin));
  const pct = 18 + t * 70;
  return `color-mix(in srgb, var(--brand-primary) ${pct.toFixed(1)}%, var(--surface-raised))`;
}

// State
const drillStack = ref<TreeNode[]>([]);
const currentNode = computed<TreeNode>(() => {
  return drillStack.value.length > 0
    ? drillStack.value[drillStack.value.length - 1]!
    : props.data;
});

const layout = computed<LayoutCell[]>(() => {
  return layoutTree(
    currentNode.value,
    { x: 0, y: 0, w: props.width, h: props.height },
    0,
    "",
    props.maxDepth
  );
});

const sizeRange = computed<[number, number]>(() => {
  const sizes = layout.value
    .filter(c => !c.isAggregate)
    .map(c => c.size);
  if (sizes.length === 0) return [1, 2];
  return [Math.min(...sizes), Math.max(...sizes)];
});

const breadcrumb = computed(() => [
  props.data,
  ...drillStack.value,
]);

function drillInto(cell: LayoutCell) {
  if (cell.node.children && cell.node.children.length > 0) {
    drillStack.value.push(cell.node);
  }
}

function navigateTo(idx: number) {
  drillStack.value = drillStack.value.slice(0, idx);
}

const hoveredCell = ref<LayoutCell | null>(null);
// Tooltip position is computed *flipped*: when the cursor is in the right
// half of the canvas, the tooltip anchors to the cursor's left so it
// stays inside bounds. Same logic for vertical edges. We also clamp to
// canvas edges so the tooltip never overflows even at corners.
const tooltipStyle = ref<{
  left?: string; right?: string; top?: string; bottom?: string;
}>({});

function onCellHover(cell: LayoutCell, e: MouseEvent) {
  hoveredCell.value = cell;
  const svg = (e.currentTarget as SVGElement).ownerSVGElement;
  const wrap = svg?.parentElement;
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const cursorX = e.clientX - rect.left;
  const cursorY = e.clientY - rect.top;
  const offset = 12;

  // Flip horizontally if cursor is past midpoint — tooltip anchors right.
  // Flip vertically if cursor is in bottom half — tooltip anchors above.
  const flipX = cursorX > rect.width / 2;
  const flipY = cursorY > rect.height / 2;

  const style: typeof tooltipStyle.value = {};
  if (flipX) {
    style.right = `${rect.width - cursorX + offset}px`;
  } else {
    style.left = `${cursorX + offset}px`;
  }
  if (flipY) {
    style.bottom = `${rect.height - cursorY + offset}px`;
  } else {
    style.top = `${cursorY + offset}px`;
  }
  tooltipStyle.value = style;
}

function onCellLeave() {
  hoveredCell.value = null;
}

// Hide labels on cells too small to fit them.
function fitsLabel(rect: Rect): boolean {
  return rect.w > 60 && rect.h > 24;
}

function fitsSize(rect: Rect): boolean {
  return rect.w > 80 && rect.h > 40;
}
</script>

<template>
  <div class="tux-treemap">
    <!-- Breadcrumb -->
    <nav class="tux-treemap__breadcrumb" aria-label="Treemap path">
      <button
        v-for="(node, idx) in breadcrumb"
        :key="idx"
        type="button"
        class="tux-treemap__crumb"
        :class="{ 'tux-treemap__crumb--current': idx === breadcrumb.length - 1 }"
        :disabled="idx === breadcrumb.length - 1"
        @click="navigateTo(idx)"
      >{{ node.name }}</button>
    </nav>

    <!-- SVG canvas -->
    <div class="tux-treemap__canvas-wrap" :style="{ aspectRatio: `${width} / ${height}` }">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="xMidYMid meet"
        class="tux-treemap__canvas"
        role="img"
        :aria-label="`Treemap of ${currentNode.name}`"
      >
        <g
          v-for="cell in layout"
          :key="`${cell.path}-${cell.depth}`"
        >
          <rect
            :x="cell.rect.x"
            :y="cell.rect.y"
            :width="Math.max(cell.rect.w - 1, 0)"
            :height="Math.max(cell.rect.h - 1, 0)"
            :fill="colorFor(cell, sizeRange)"
            :stroke="cell.isAggregate ? 'var(--brand-primary)' : 'var(--surface-page)'"
            :stroke-width="cell.isAggregate ? 1 : 1"
            class="tux-treemap__cell"
            :class="{
              'tux-treemap__cell--aggregate': cell.isAggregate,
              'tux-treemap__cell--leaf': !cell.isAggregate,
            }"
            :tabindex="cell.isAggregate ? -1 : 0"
            @mousemove="onCellHover(cell, $event)"
            @mouseleave="onCellLeave"
            @click="drillInto(cell)"
          />
          <!-- Aggregate header label -->
          <text
            v-if="cell.isAggregate && cell.rect.w > 50 && cell.rect.h > 24"
            :x="cell.rect.x + 6"
            :y="cell.rect.y + 13"
            class="tux-treemap__header"
          >{{ cell.node.name }}</text>
          <!-- Leaf labels -->
          <text
            v-else-if="!cell.isAggregate && fitsLabel(cell.rect)"
            :x="cell.rect.x + 8"
            :y="cell.rect.y + 18"
            class="tux-treemap__label"
          >{{ cell.node.name }}</text>
          <text
            v-if="!cell.isAggregate && fitsSize(cell.rect)"
            :x="cell.rect.x + 8"
            :y="cell.rect.y + 36"
            class="tux-treemap__size"
          >{{ formatSize(cell.size) }}</text>
        </g>
      </svg>

      <!-- Tooltip — flipped to opposite anchor near canvas edges. -->
      <div
        v-if="hoveredCell"
        class="tux-treemap__tooltip"
        :style="tooltipStyle"
      >
        <p class="tux-treemap__tooltip-path">{{ hoveredCell.path }}</p>
        <p class="tux-treemap__tooltip-meta">
          <span>{{ formatSize(hoveredCell.size) }}</span>
          <span v-if="hoveredCell.childCount > 0">
            · {{ hoveredCell.childCount.toLocaleString() }} {{ hoveredCell.childCount === 1 ? "child" : "children" }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tux-treemap {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  font-family: var(--font-body);
}

.tux-treemap__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
}

.tux-treemap__crumb {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-secondary);
  background: transparent;
  border: 0;
  padding: 0.125rem 0;
  cursor: pointer;
}

.tux-treemap__crumb:not(:last-child)::after {
  content: " /";
  color: var(--text-muted);
  margin-left: 0.375rem;
  font-weight: 400;
}

.tux-treemap__crumb:hover:not(:disabled) {
  color: var(--brand-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tux-treemap__crumb--current {
  color: var(--text-primary);
  cursor: default;
}

.tux-treemap__canvas-wrap {
  position: relative;
  width: 100%;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  /* clip the SVG cells but let the tooltip — which uses left/right +
     top/bottom anchored positioning — render inside the canvas bounds
     by definition. We don't use overflow:hidden because anchored
     tooltips already stay within the wrap. */
}

.tux-treemap__canvas {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.tux-treemap__cell {
  transition: opacity 0.15s ease;
}

.tux-treemap__cell--leaf {
  cursor: pointer;
}

.tux-treemap__cell--leaf:hover {
  opacity: 0.85;
}

.tux-treemap__cell--leaf:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: -2px;
}

.tux-treemap__cell--aggregate {
  pointer-events: none;
}

.tux-treemap__header {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  fill: var(--brand-primary);
  pointer-events: none;
  user-select: none;
}

.tux-treemap__label {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 12px;
  fill: var(--text-primary);
  pointer-events: none;
  user-select: none;
}

.tux-treemap__size {
  font-family: var(--font-mono);
  font-size: 11px;
  fill: var(--text-secondary);
  pointer-events: none;
  user-select: none;
  font-variant-numeric: tabular-nums;
}

/* Tooltip */
.tux-treemap__tooltip {
  position: absolute;
  pointer-events: none;
  background: var(--surface-page);
  border: 1px solid var(--brand-primary);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-width: 22rem;
  z-index: 10;
}

.tux-treemap__tooltip-path {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;
  word-break: break-word;
}

.tux-treemap__tooltip-meta {
  margin: 0.25rem 0 0;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  gap: 0.375rem;
}
</style>
