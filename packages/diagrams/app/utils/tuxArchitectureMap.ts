/**
 * tuxArchitectureMap — Core Engine for TUX Master Architecture Plan (M.A.P.) & Infinite Canvas.
 *
 * Synthesizes best-in-class open-source algorithms (MIT / Apache-2.0):
 * 1. SmoothStep & Bezier orthogonal/curved SVG edge routing + viewport bounds math
 *    (adapted from @xyflow/system, MIT License).
 * 2. Variable-width pressure-sensitive freehand stroke smoothing & quadratic SVG polygon pathing
 *    (adapted from perfect-freehand by Steve Ruiz & @excalidraw/common, MIT License).
 * 3. Time- & length-decaying ephemeral laser pointer trail geometry
 *    (adapted from @excalidraw/laser-pointer, MIT License).
 * 4. Directed BFS / DFS upstream & downstream dependency blast-radius traversal
 *    and hierarchical DAG auto-layout (adapted from Cytoscape.js & LikeC4, MIT License).
 * 5. Semantic Zoom Level-of-Detail (LoD) C4+M.A.P. model:
 *    - LoD 1 (`executive`, zoom < 0.65): Products / Systems, Center ownership, operational status, aggregate metrics.
 *    - LoD 2 (`resources`, 0.65 <= zoom < 1.3): People/Teams, VMs, Containers, Databases, APIs.
 *    - LoD 3 (`packages`, zoom >= 1.3): Package dependencies (`@tti/*`, npm, containers), versions, ports, & protocols.
 */

export type TuxMapHandlePosition = "top" | "right" | "bottom" | "left";

export type TuxMapLoDLevel = "executive" | "resources" | "packages";

export type TuxMapTool = "select" | "pan" | "pen" | "laser" | "note";

export type TuxMapStatus = "ok" | "warning" | "critical" | "maintenance" | "pending";

export type TuxMapResourceKind = "person" | "vm" | "container" | "database" | "storage" | "gateway";

export interface TuxMapPersonResource {
  id: string;
  kind: "person";
  name: string;
  role: string;
  initials?: string;
  handle?: string;
}

export interface TuxMapComputeResource {
  id: string;
  kind: Exclude<TuxMapResourceKind, "person">;
  name: string;
  spec: string; // e.g. "8 vCPU · 32GB RAM" or "Docker · Node 22"
  /** What the resource does; the deployment card says it when `spec` is empty */
  role?: string;
  status?: TuxMapStatus;
  host?: string; // e.g. "rellis-esxi-04"
}

export type TuxMapResource = TuxMapPersonResource | TuxMapComputeResource;

export interface TuxMapPackageDep {
  name: string;
  version: string;
  scope?: "internal" | "external" | "runtime";
  port?: number;
  protocol?: string;
}

export interface TuxMapNode {
  id: string;
  /** Product or System Name */
  name: string;
  /** Short architectural code or eyebrow, e.g. "SYS-01 · CORE" */
  code?: string;
  /** TTI Center or Division owner */
  division?: string;
  /** Spectrum division accent token id */
  accent?: "maroon" | "blue" | "teal" | "green" | "gold";
  /** Operational health status */
  status: TuxMapStatus;
  /** Brief executive summary shown at LoD 1+ */
  summary: string;
  /** Optional environment zone id this product belongs to */
  zoneId?: string;
  /** Optional explicit world coordinates; auto-layout computes if omitted */
  position?: { x: number; y: number };
  /** Layer/tier hint for deterministic auto-layout (0 = left/top ingress, 1 = core, 2 = data/platform) */
  tier?: number;
  /** LoD 2: Resources required (People, VMs, Containers, DBs) */
  resources: TuxMapResource[];
  /** LoD 3: Package & code dependencies, ports, and runtime manifests */
  packages: TuxMapPackageDep[];
  /** Optional SLA / uptime or metric pill */
  sla?: string;
}

export interface TuxMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  /** Whether to animate telemetry flow along the edge */
  animated?: boolean;
  /** Edge routing style */
  curve?: "smoothstep" | "bezier" | "straight";
  /** Minimum LoD level where this edge is visible (defaults to executive) */
  minLod?: TuxMapLoDLevel;
}

export interface TuxMapZone {
  id: string;
  label: string;
  sublabel?: string;
  tone?: "maroon" | "blue" | "teal" | "green" | "gold" | "neutral";
  /** Optional explicit bounds; if omitted, auto-computed around member nodes */
  bounds?: { x: number; y: number; width: number; height: number };
}

export interface TuxMapStrokePoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

export interface TuxMapInkStroke {
  id: string;
  authorId?: string;
  authorName?: string;
  color: string;
  size: number;
  points: TuxMapStrokePoint[];
  /** Optional level where this stroke was drawn (`1..N`) */
  level?: number;
  /** Optional focused parent container/node ID where this stroke was drawn */
  focusId?: string | null;
  /** Optional target element ID that the stroke starts or ends on */
  targetNodeId?: string | null;
}

export interface TuxMapStickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  author?: string;
  tone?: "gold" | "maroon" | "teal";
  /** Optional level where this sticky note was placed (`1..N`) */
  level?: number;
  /** Optional focused parent container/node ID where this sticky note was placed */
  focusId?: string | null;
  /** Optional target element ID that this sticky note is pinned to */
  targetNodeId?: string | null;
}

export interface TuxMapCollaborator {
  id: string;
  name: string;
  role?: string;
  color: string;
  /** World X coordinate */
  x: number;
  /** World Y coordinate */
  y: number;
  tool?: TuxMapTool;
  /** Optional active laser trail points in world coordinates */
  laserPoints?: TuxMapStrokePoint[];
}

export interface TuxMapViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface TuxMapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// 1. SEMANTIC ZOOM LEVEL-OF-DETAIL (LoD) RESOLUTION
// ============================================================================

export const LOD_THRESHOLDS = {
  resources: 0.65,
  packages: 1.25,
} as const;

export function resolveSemanticLoD(
  zoom: number,
  override: "auto" | TuxMapLoDLevel = "auto",
): TuxMapLoDLevel {
  if (override !== "auto") return override;
  if (zoom < LOD_THRESHOLDS.resources) return "executive";
  if (zoom < LOD_THRESHOLDS.packages) return "resources";
  return "packages";
}

/**
 * Returns the intrinsic world-space dimensions of a node card for a given LoD
 * so edge handles, zone bounding boxes, and minimap stay exact across zoom tiers.
 */
export function getNodeDimensionsForLoD(
  node: TuxMapNode,
  lod: TuxMapLoDLevel,
): { width: number; height: number } {
  if (lod === "executive") {
    return { width: 340, height: 198 };
  }
  if (lod === "resources") {
    const resourceRows = Math.ceil(Math.max(1, node.resources.length) / 2);
    return {
      width: 372,
      height: 196 + resourceRows * 48,
    };
  }
  // LoD 3: Full package & dependency manifest + resources
  const resourceRows = Math.ceil(Math.max(1, node.resources.length) / 2);
  const pkgRows = Math.max(1, node.packages.length);
  return {
    width: 408,
    height: 226 + resourceRows * 48 + pkgRows * 30,
  };
}

// ============================================================================
// 2. VIEWPORT CAMERA & COORDINATE MATRIX (Adapted from @xyflow/system & tldraw)
// ============================================================================

export function screenToWorld(
  screenX: number,
  screenY: number,
  viewport: TuxMapViewport,
): { x: number; y: number } {
  const safeZoom = Math.max(0.05, viewport.zoom);
  return {
    x: (screenX - viewport.x) / safeZoom,
    y: (screenY - viewport.y) / safeZoom,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  viewport: TuxMapViewport,
): { x: number; y: number } {
  return {
    x: worldX * viewport.zoom + viewport.x,
    y: worldY * viewport.zoom + viewport.y,
  };
}

/**
 * Zooms the viewport around a specific screen focal point (e.g. cursor position)
 * so the world point under the cursor stays stationary during wheel/pinch zoom.
 */
export function zoomAroundScreenPoint(
  viewport: TuxMapViewport,
  nextZoom: number,
  focalScreenX: number,
  focalScreenY: number,
  minZoom = 0.25,
  maxZoom = 2.5,
): TuxMapViewport {
  const clampedZoom = Math.max(minZoom, Math.min(maxZoom, nextZoom));
  const worldBefore = screenToWorld(focalScreenX, focalScreenY, viewport);
  return {
    x: focalScreenX - worldBefore.x * clampedZoom,
    y: focalScreenY - worldBefore.y * clampedZoom,
    zoom: Number(clampedZoom.toFixed(4)),
  };
}

/**
 * Computes the bounding rectangle enclosing all given rectangles.
 */
export function getBoundsOfRects(rects: TuxMapRect[]): TuxMapRect {
  if (rects.length === 0) {
    return { x: 0, y: 0, width: 800, height: 600 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const r of rects) {
    if (r.x < minX) minX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.x + r.width > maxX) maxX = r.x + r.width;
    if (r.y + r.height > maxY) maxY = r.y + r.height;
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

/**
 * Computes the ideal viewport `(x, y, zoom)` to fit a world bounding box
 * inside a container of `(containerWidth, containerHeight)` with padding.
 */
export function getViewportForBounds(
  bounds: TuxMapRect,
  containerWidth: number,
  containerHeight: number,
  minZoom = 0.25,
  maxZoom = 2.0,
  padding = 0.14,
): TuxMapViewport {
  const safeW = Math.max(1, containerWidth * (1 - padding * 2));
  const safeH = Math.max(1, containerHeight * (1 - padding * 2));
  const xZoom = safeW / Math.max(1, bounds.width);
  const yZoom = safeH / Math.max(1, bounds.height);
  const zoom = Math.max(minZoom, Math.min(maxZoom, Math.min(xZoom, yZoom)));

  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;

  return {
    x: Math.round(containerWidth / 2 - centerX * zoom),
    y: Math.round(containerHeight / 2 - centerY * zoom),
    zoom: Number(zoom.toFixed(3)),
  };
}

// ============================================================================
// 3. ORTHOGONAL SMOOTHSTEP & BEZIER EDGE ROUTING (Adapted from @xyflow/system)
// ============================================================================

interface XYPoint {
  x: number;
  y: number;
}

const HANDLE_DIRECTIONS: Record<TuxMapHandlePosition, XYPoint> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
};

function ptDistance(a: XYPoint, b: XYPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function isCollinearBetween(a: XYPoint, b: XYPoint, c: XYPoint): boolean {
  return (
    (a.x === b.x && b.x === c.x && (b.y - a.y) * (c.y - b.y) >= 0) ||
    (a.y === b.y && b.y === c.y && (b.x - a.x) * (c.x - b.x) >= 0)
  );
}

function getRoundedBend(a: XYPoint, b: XYPoint, c: XYPoint, size: number): string {
  const bendSize = Math.min(ptDistance(a, b) / 2, ptDistance(b, c) / 2, size);
  const { x, y } = b;

  if ((a.x === x && x === c.x) || (a.y === y && y === c.y) || bendSize < 0.5) {
    return `L${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${(x + bendSize * xDir).toFixed(1)},${y.toFixed(1)} Q ${x.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y + bendSize * yDir).toFixed(1)}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x.toFixed(1)},${(y + bendSize * yDir).toFixed(1)} Q ${x.toFixed(1)},${y.toFixed(1)} ${(x + bendSize * xDir).toFixed(1)},${y.toFixed(1)}`;
}

export interface SmoothStepEdgeResult {
  path: string;
  labelX: number;
  labelY: number;
}

/**
 * Generates an orthogonal rounded-corner SVG path between two node handles,
 * returning both the SVG `d` string and the optimal midpoint `(labelX, labelY)`
 * for edge protocol badges.
 */
export function getSmoothStepEdgePath(params: {
  sourceX: number;
  sourceY: number;
  sourcePosition?: TuxMapHandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: TuxMapHandlePosition;
  borderRadius?: number;
  offset?: number;
}): SmoothStepEdgeResult {
  const {
    sourceX,
    sourceY,
    sourcePosition = "right",
    targetX,
    targetY,
    targetPosition = "left",
    borderRadius = 10,
    offset = 24,
  } = params;

  const source: XYPoint = { x: sourceX, y: sourceY };
  const target: XYPoint = { x: targetX, y: targetY };
  const sourceDir = HANDLE_DIRECTIONS[sourcePosition];
  const targetDir = HANDLE_DIRECTIONS[targetPosition];

  const sourceGapped: XYPoint = {
    x: source.x + sourceDir.x * offset,
    y: source.y + sourceDir.y * offset,
  };
  const targetGapped: XYPoint = {
    x: target.x + targetDir.x * offset,
    y: target.y + targetDir.y * offset,
  };

  const isHorizontal = sourcePosition === "left" || sourcePosition === "right";
  const dirAccessor: "x" | "y" = isHorizontal ? "x" : "y";
  const currDir =
    dirAccessor === "x"
      ? sourceGapped.x < targetGapped.x
        ? 1
        : -1
      : sourceGapped.y < targetGapped.y
        ? 1
        : -1;

  let points: XYPoint[] = [];
  let labelX = (source.x + target.x) / 2;
  let labelY = (source.y + target.y) / 2;

  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    const centerX = (sourceGapped.x + targetGapped.x) / 2;
    const centerY = (sourceGapped.y + targetGapped.y) / 2;
    labelX = centerX;
    labelY = centerY;

    const verticalSplit: XYPoint[] = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y },
    ];
    const horizontalSplit: XYPoint[] = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY },
    ];

    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    const sourceTarget: XYPoint[] = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource: XYPoint[] = [{ x: targetGapped.x, y: sourceGapped.y }];
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    labelX = points[0]!.x;
    labelY = points[0]!.y;
  }

  const rawSeq = [source, sourceGapped, ...points, targetGapped, target];
  const pathPoints: XYPoint[] = [];

  for (const pt of rawSeq) {
    const [a, b] = pathPoints.slice(-2);
    if (a && b && isCollinearBetween(a, b, pt)) {
      pathPoints.pop();
    }
    pathPoints.push(pt);
  }

  let path = `M${pathPoints[0]!.x.toFixed(1)} ${pathPoints[0]!.y.toFixed(1)}`;
  for (let i = 1; i < pathPoints.length - 1; i++) {
    path += getRoundedBend(
      pathPoints[i - 1]!,
      pathPoints[i]!,
      pathPoints[i + 1]!,
      borderRadius,
    );
  }
  const last = pathPoints[pathPoints.length - 1]!;
  path += `L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

  return { path, labelX, labelY };
}

/**
 * Generates a cubic Bezier SVG path between two handles.
 */
export function getBezierEdgePath(params: {
  sourceX: number;
  sourceY: number;
  sourcePosition?: TuxMapHandlePosition;
  targetX: number;
  targetY: number;
  targetPosition?: TuxMapHandlePosition;
  curvature?: number;
}): SmoothStepEdgeResult {
  const {
    sourceX,
    sourceY,
    sourcePosition = "right",
    targetX,
    targetY,
    targetPosition = "left",
    curvature = 0.28,
  } = params;

  const ctrlOffset = (dist: number) =>
    dist >= 0 ? 0.5 * dist : curvature * 25 * Math.sqrt(-dist);

  const getControl = (
    pos: TuxMapHandlePosition,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): [number, number] => {
    switch (pos) {
      case "left":
        return [x1 - ctrlOffset(x1 - x2), y1];
      case "right":
        return [x1 + ctrlOffset(x2 - x1), y1];
      case "top":
        return [x1, y1 - ctrlOffset(y1 - y2)];
      case "bottom":
        return [x1, y1 + ctrlOffset(y2 - y1)];
    }
  };

  const [scx, scy] = getControl(sourcePosition, sourceX, sourceY, targetX, targetY);
  const [tcx, tcy] = getControl(targetPosition, targetX, targetY, sourceX, sourceY);

  const labelX = sourceX * 0.125 + scx * 0.375 + tcx * 0.375 + targetX * 0.125;
  const labelY = sourceY * 0.125 + scy * 0.375 + tcy * 0.375 + targetY * 0.125;

  return {
    path: `M${sourceX.toFixed(1)},${sourceY.toFixed(1)} C${scx.toFixed(1)},${scy.toFixed(1)} ${tcx.toFixed(1)},${tcy.toFixed(1)} ${targetX.toFixed(1)},${targetY.toFixed(1)}`,
    labelX,
    labelY,
  };
}

/**
 * Generates a direct straight SVG path between two handles.
 */
export function getStraightEdgePath(params: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): SmoothStepEdgeResult {
  const { sourceX, sourceY, targetX, targetY } = params;
  return {
    path: `M${sourceX.toFixed(1)},${sourceY.toFixed(1)} L${targetX.toFixed(1)},${targetY.toFixed(1)}`,
    labelX: (sourceX + targetX) / 2,
    labelY: (sourceY + targetY) / 2,
  };
}

/**
 * Automatically selects the best handle pair (`right` -> `left` or `bottom` -> `top`)
 * between two node rectangles and returns the anchor coordinates.
 */
export function resolveOptimalEdgeAnchors(
  sourceRect: TuxMapRect,
  targetRect: TuxMapRect,
): {
  sourceX: number;
  sourceY: number;
  sourcePosition: TuxMapHandlePosition;
  targetX: number;
  targetY: number;
  targetPosition: TuxMapHandlePosition;
} {
  const scx = sourceRect.x + sourceRect.width / 2;
  const scy = sourceRect.y + sourceRect.height / 2;
  const tcx = targetRect.x + targetRect.width / 2;
  const tcy = targetRect.y + targetRect.height / 2;

  const dx = tcx - scx;
  const dy = tcy - scy;

  // Prefer horizontal connection when horizontal separation dominates
  if (Math.abs(dx) >= Math.abs(dy) * 0.75) {
    if (dx >= 0) {
      return {
        sourceX: sourceRect.x + sourceRect.width,
        sourceY: scy,
        sourcePosition: "right",
        targetX: targetRect.x,
        targetY: tcy,
        targetPosition: "left",
      };
    }
    return {
      sourceX: sourceRect.x,
      sourceY: scy,
      sourcePosition: "left",
      targetX: targetRect.x + targetRect.width,
      targetY: tcy,
      targetPosition: "right",
    };
  }

  if (dy >= 0) {
    return {
      sourceX: scx,
      sourceY: sourceRect.y + sourceRect.height,
      sourcePosition: "bottom",
      targetX: tcx,
      targetY: targetRect.y,
      targetPosition: "top",
    };
  }

  return {
    sourceX: scx,
    sourceY: sourceRect.y,
    sourcePosition: "top",
    targetX: tcx,
    targetY: targetRect.y + targetRect.height,
    targetPosition: "bottom",
  };
}

// ============================================================================
// 4. DETERMINISTIC LAYERED DAG AUTO-LAYOUT & BLAST-RADIUS TRAVERSAL
//    (Adapted from Cytoscape.js BFS & LikeC4 topological sort)
// ============================================================================

/**
 * Computes deterministic `(x, y)` coordinates for nodes using topological
 * tier layering when explicit positions are omitted.
 */
export function computeMapAutoLayout(
  nodes: TuxMapNode[],
  edges: TuxMapEdge[],
  lod: TuxMapLoDLevel = "resources",
): Map<string, TuxMapRect> {
  const result = new Map<string, TuxMapRect>();
  if (nodes.length === 0) return result;

  // Determine tier for each node (either explicit `node.tier` or BFS depth from roots)
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of edges) {
    if (adj.has(e.source) && inDegree.has(e.target)) {
      adj.get(e.source)!.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
    }
  }

  const computedTiers = new Map<string, number>();
  const queue: string[] = [];

  for (const n of nodes) {
    if (typeof n.tier === "number") {
      computedTiers.set(n.id, n.tier);
    } else if ((inDegree.get(n.id) ?? 0) === 0) {
      computedTiers.set(n.id, 0);
      queue.push(n.id);
    }
  }

  if (queue.length === 0) {
    for (const n of nodes) {
      if (!computedTiers.has(n.id)) {
        computedTiers.set(n.id, 0);
        queue.push(n.id);
      }
    }
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currTier = computedTiers.get(curr) ?? 0;
    for (const next of adj.get(curr) ?? []) {
      const nextNode = nodes.find((n) => n.id === next);
      if (nextNode && typeof nextNode.tier === "number") {
        computedTiers.set(next, nextNode.tier);
      } else if (!computedTiers.has(next) || (computedTiers.get(next) ?? 0) < currTier + 1) {
        if ((currTier + 1) <= 5) {
          computedTiers.set(next, currTier + 1);
          queue.push(next);
        }
      }
    }
  }

  // Group nodes by tier
  const columns = new Map<number, TuxMapNode[]>();
  for (const n of nodes) {
    const t = computedTiers.get(n.id) ?? 0;
    if (!columns.has(t)) columns.set(t, []);
    columns.get(t)!.push(n);
  }

  const sortedTiers = [...columns.keys()].sort((a, b) => a - b);
  const colGap = 590;
  const rowGap = 86;

  for (let colIdx = 0; colIdx < sortedTiers.length; colIdx++) {
    const tierKey = sortedTiers[colIdx]!;
    const colNodes = columns.get(tierKey)!;
    let cursorY = 80;

    for (const node of colNodes) {
      const dims = getNodeDimensionsForLoD(node, lod);
      const x = node.position?.x ?? 80 + colIdx * colGap;
      const y = node.position?.y ?? cursorY;
      result.set(node.id, {
        x,
        y,
        width: dims.width,
        height: dims.height,
      });
      cursorY = y + dims.height + rowGap;
    }
  }

  return result;
}

const emittedArchitectureDeprecations = new Set<string>();

function warnArchitectureDeprecatedOnce(fnName: string, replacementHint: string): void {
  if (emittedArchitectureDeprecations.has(fnName)) return;
  emittedArchitectureDeprecations.add(fnName);
  console.warn(`[@tti/tti-ux-diagrams] ${fnName}() is deprecated. ${replacementHint}`);
}

/** Resets one-shot Section 4/8 deprecation warning state (intended for test suites). */
export function resetArchitectureDeprecationWarnings(): void {
  emittedArchitectureDeprecations.clear();
}

/**
 * Computes the upstream (dependencies that feed `rootNodeId`) and downstream
 * (dependents impacted by `rootNodeId`) blast-radius subgraph using directed BFS.
 *
 * @deprecated Use `computeLinkBlastRadius` or `queryArchitectureImpact` instead.
 */
export function computeDependencyBlastRadius(
  rootNodeId: string,
  edges: TuxMapEdge[],
): {
  activeNodeIds: Set<string>;
  upstreamNodeIds: Set<string>;
  downstreamNodeIds: Set<string>;
  activeEdgeIds: Set<string>;
} {
  warnArchitectureDeprecatedOnce(
    "computeDependencyBlastRadius",
    "Use computeLinkBlastRadius() or queryArchitectureImpact() instead.",
  );
  const upstreamNodeIds = new Set<string>();
  const downstreamNodeIds = new Set<string>();
  const activeEdgeIds = new Set<string>();

  // Forward BFS (downstream)
  const downQueue = [rootNodeId];
  const visitedDown = new Set<string>([rootNodeId]);
  while (downQueue.length > 0) {
    const curr = downQueue.shift()!;
    for (const e of edges) {
      if (e.source === curr) {
        activeEdgeIds.add(e.id);
        if (!visitedDown.has(e.target)) {
          visitedDown.add(e.target);
          downstreamNodeIds.add(e.target);
          downQueue.push(e.target);
        }
      }
    }
  }

  // Reverse BFS (upstream)
  const upQueue = [rootNodeId];
  const visitedUp = new Set<string>([rootNodeId]);
  while (upQueue.length > 0) {
    const curr = upQueue.shift()!;
    for (const e of edges) {
      if (e.target === curr) {
        activeEdgeIds.add(e.id);
        if (!visitedUp.has(e.source)) {
          visitedUp.add(e.source);
          upstreamNodeIds.add(e.source);
          upQueue.push(e.source);
        }
      }
    }
  }

  const activeNodeIds = new Set<string>([
    rootNodeId,
    ...upstreamNodeIds,
    ...downstreamNodeIds,
  ]);

  return {
    activeNodeIds,
    upstreamNodeIds,
    downstreamNodeIds,
    activeEdgeIds,
  };
}

// ============================================================================
// 5. FREEHAND PEN SMOOTHING & LASER POINTER TRAILS
//    (Adapted from perfect-freehand & @excalidraw/laser-pointer, MIT License)
// ============================================================================

type Vec2 = [number, number];

function vecAdd(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

function vecSub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

function vecMul(a: Vec2, s: number): Vec2 {
  return [a[0] * s, a[1] * s];
}

function vecPerp(a: Vec2): Vec2 {
  return [a[1], -a[0]];
}

function vecLen(a: Vec2): number {
  return Math.hypot(a[0], a[1]);
}

function vecUni(a: Vec2): Vec2 {
  const l = vecLen(a);
  return l > 0.0001 ? [a[0] / l, a[1] / l] : [0, 0];
}

function vecLerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/**
 * Converts a closed polygon outline (array of `[x, y]` points) into a smooth
 * quadratic Bezier SVG path string (`M ... Q ... T ... Z`).
 * Adapted from `@excalidraw/common` `getSvgPathFromStroke` (MIT).
 */
export function getSvgPathFromStrokeOutline(points: Vec2[], closed = true): string {
  const len = points.length;
  if (len < 4) return "";

  let a = points[0]!;
  let b = points[1]!;
  const c = points[2]!;

  const avg = (n1: number, n2: number) => ((n1 + n2) / 2).toFixed(1);

  let result = `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${b[0].toFixed(1)},${b[1].toFixed(1)} ${avg(b[0], c[0])},${avg(b[1], c[1])} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]!;
    b = points[i + 1]!;
    result += `${avg(a[0], b[0])},${avg(a[1], b[1])} `;
  }

  if (closed) {
    result += "Z";
  }
  return result.trim();
}

export interface FreehandStrokeOptions {
  size?: number;
  thinning?: number;
  streamline?: number;
  simulatePressure?: boolean;
  /** Optional custom radius mapper for laser-pointer time/length decay */
  radiusMapper?: (index: number, total: number, pt: TuxMapStrokePoint) => number;
}

/**
 * Generates a smoothed, variable-width polygon SVG path from raw pointer coordinates.
 * Combines streamline low-pass filtering, velocity-simulated pressure thinning,
 * and rounded start/end caps (adapted from `perfect-freehand`, MIT).
 */
export function getSmoothedFreehandSvgPath(
  rawPoints: TuxMapStrokePoint[],
  options: FreehandStrokeOptions = {},
): string {
  const {
    size = 8,
    thinning = 0.45,
    streamline = 0.5,
    simulatePressure = true,
    radiusMapper,
  } = options;

  if (rawPoints.length === 0 || size <= 0) return "";

  // Single-point dot fallback
  if (rawPoints.length === 1) {
    const p = rawPoints[0]!;
    const r = size / 2;
    const circlePts: Vec2[] = [];
    for (let i = 0; i < 12; i++) {
      const theta = (i / 12) * Math.PI * 2;
      circlePts.push([p.x + Math.cos(theta) * r, p.y + Math.sin(theta) * r]);
    }
    return getSvgPathFromStrokeOutline(circlePts, true);
  }

  // Step 1: Streamline interpolation (low-pass filter)
  const t = 0.15 + (1 - streamline) * 0.85;
  const streamlined: { pt: Vec2; dist: number; raw: TuxMapStrokePoint }[] = [
    { pt: [rawPoints[0]!.x, rawPoints[0]!.y], dist: 0, raw: rawPoints[0]! },
  ];

  for (let i = 1; i < rawPoints.length; i++) {
    const prev = streamlined[streamlined.length - 1]!.pt;
    const currRaw = rawPoints[i]!;
    const isLast = i === rawPoints.length - 1;
    const nextPt: Vec2 = isLast
      ? [currRaw.x, currRaw.y]
      : vecLerp(prev, [currRaw.x, currRaw.y], t);
    const d = vecLen(vecSub(nextPt, prev));
    if (d < 0.5 && !isLast) continue;
    streamlined.push({ pt: nextPt, dist: d, raw: currRaw });
  }

  if (streamlined.length < 2) {
    const first = streamlined[0]!;
    streamlined.push({
      pt: [first.pt[0] + 1, first.pt[1] + 1],
      dist: 1.4,
      raw: first.raw,
    });
  }

  // Step 2: Build left and right outline contours with simulated pressure
  const leftPts: Vec2[] = [];
  const rightPts: Vec2[] = [];
  let prevPressure = 0.35;
  const total = streamlined.length;

  for (let i = 0; i < total; i++) {
    const curr = streamlined[i]!;
    const prev = streamlined[Math.max(0, i - 1)]!;
    const next = streamlined[Math.min(total - 1, i + 1)]!;

    const dir = vecUni(vecSub(next.pt, prev.pt));
    const normal = vecPerp(dir);

    let radius: number;
    if (radiusMapper) {
      radius = Math.max(0.2, radiusMapper(i, total, curr.raw));
    } else {
      let pressure = curr.raw.pressure ?? 0.5;
      if (simulatePressure) {
        const sp = Math.min(1, curr.dist / size);
        const rp = Math.min(1, 1 - sp);
        pressure = Math.min(1, prevPressure + (rp - prevPressure) * (sp * 0.275));
        prevPressure = pressure;
      }
      radius = size * (0.5 - thinning * (0.5 - pressure));
    }

    leftPts.push(vecSub(curr.pt, vecMul(normal, radius)));
    rightPts.push(vecAdd(curr.pt, vecMul(normal, radius)));
  }

  // Step 3: Add rounded end cap and combine contours in winding order
  const outline: Vec2[] = [...leftPts, ...rightPts.reverse()];
  return getSvgPathFromStrokeOutline(outline, true);
}

/**
 * Generates an ephemeral laser pointer SVG path with time-based and tail-length decay
 * (adapted from Excalidraw `LaserTrails`, MIT License).
 */
export function getLaserPointerSvgPath(
  points: TuxMapStrokePoint[],
  nowMs: number,
  baseSize = 7,
  decayMs = 950,
  maxTailPoints = 48,
): string {
  const active = points.filter((p) => nowMs - (p.timestamp ?? nowMs) < decayMs);
  if (active.length < 2) return "";

  return getSmoothedFreehandSvgPath(active, {
    size: baseSize,
    streamline: 0.42,
    radiusMapper: (idx, total, pt) => {
      const age = nowMs - (pt.timestamp ?? nowMs);
      const timeFactor = Math.max(0, 1 - age / decayMs);
      const tailDist = total - 1 - idx;
      const lengthFactor = Math.max(0, 1 - tailDist / maxTailPoints);
      // Ease-out curve so head is bright and tail tapers smoothly to a point
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 2);
      return baseSize * Math.min(easeOut(timeFactor), easeOut(lengthFactor));
    },
  });
}

// ============================================================================
// 6. MULTI-LEVEL (LEVEL 1 -> 2 -> 3 -> 4) GRID & ORTHOGONAL GAP ROUTING ENGINE
//    (Zero-lag C4 grid router: right-angle wires strictly through column/row gaps)
// ============================================================================

export type TuxMapLevelNumber = number;

export type TuxMapElementKind =
  | "person"
  | "system"
  | "container"
  | "database"
  | "storage"
  | "component"
  | "module"
  | "schema"
  | "symbol"
  | "external"
  | "resource";

export type TuxMapElementStatus = "live" | "paused" | "planned" | "neighbor";

export interface TuxMapSourceRef {
  /** Repository slug or URL (e.g. "nis/forgejo-stack" or "https://code.tti.tamu.edu/tti/tti-ux") */
  repo?: string;
  /** Relative file path inside the repository (e.g. "src/search/retriever.py") */
  path: string;
  /** Optional 1-based `[startLine, endLine]` range */
  lineRange?: [number, number];
  /** Optional symbol/function/class signature */
  symbol?: string;
  /** Optional normalized callable/type signature for `sig-changed` detection across branches */
  signature?: string;
  /** Optional line-number-independent AST/content digest for `body-patched` detection across branches */
  hash?: string;
  /** Optional digest of module-scope statements outside child symbols (distinguishes module-level edits from symbol-only edits) */
  moduleHash?: string;
  /** Optional commit SHA or branch ref (defaults to "main") */
  commitSha?: string;
  /** Optional direct URL override */
  url?: string;
}

export interface TuxMapDiffInfo {
  /** Git diff change classification */
  changeType: "added" | "modified" | "deleted";
  /** Number of files or symbols touched inside this node */
  filesChanged?: number;
  /** Optional short summary of the change */
  summary?: string;
}

export interface TuxMapSubgraph {
  /** Optional human-readable stratum title (e.g. "Level 5 · Modules & Schemas", "Level 6 · AST Symbols") */
  stratum?: string;
  /** Optional summary sentence for this subgraph level */
  summary?: string;
  /** Child elements inside this node */
  elements: TuxMapLevelElement[];
  /** Internal relationships between child elements (or to/from perimeter element IDs) */
  rels?: TuxMapLevelRel[];
}

export interface TuxMapElementLiveInfo {
  state?: "running" | "active" | "present" | "success" | "inactive" | "declared-not-installed" | "failed" | "unknown";
  total?: number;
  running?: number;
  version?: string;
  update?: string;
  updates?: number;
  severity?: string;
  newer_major?: string;
  unit?: string;
  findings?: string;
  last_run?: { result: string; at?: string };
}

/**
 * A Level 2 perimeter reference to a Level 1 element (a person or an outside
 * system). It is drawn with that element's name, kind and details, so it
 * carries only its id, `ref: true` and where it sits.
 */
export type TuxMapLevelRef = Partial<Omit<TuxMapLevelElement, "id" | "ref">> & { id: string; ref: true };

export interface TuxMapLevelElement {
  id: string;
  kind?: TuxMapElementKind;
  name: string;
  tech?: string;
  desc?: string;
  status?: TuxMapElementStatus;
  /** Grid coordinates `[column, row]` */
  at?: [number, number];
  /** Explicit pixel override `[x, y, height]` for compact neighbor stacks */
  px?: [number, number, number];
  /** Whether this element is a perimeter reference to an element defined in Level 1 */
  ref?: boolean;
  /** Target level when zooming into this element (e.g. 2 or 3) */
  zoom?: TuxMapLevelNumber;
  /** Parent container/node ID when inside Level 3+ */
  parent?: string;
  /** Compact perimeter card in Level 3+ ("in" on left, "out" on right) */
  side?: "in" | "out";
  mini?: boolean;
  /** Sequential step link to sibling index in Level 3+ */
  next?: number;
  /** Stack component IDs running inside this container */
  runs?: string | string[];
  /** Level 4 resource IDs where this container/component is deployed */
  deployed?: string | string[];
  /** Linked issue/roadmap numbers */
  roadmap?: number[];
  /** Live operational telemetry */
  live?: TuxMapElementLiveInfo;
  /** Source code file, line range, and symbol binding */
  source?: TuxMapSourceRef;
  /** PR diff / modification state for Blast-Radius inspection */
  diff?: TuxMapDiffInfo;
  /** Inline fractal child elements for N-depth zooming (Level 5, 6, 7...) */
  children?: TuxMapLevelElement[];
  /** Optional relationships among inline `children` */
  childRels?: TuxMapLevelRel[];
  /** Optional URL or key for lazy on-demand subgraph hydration */
  subgraphRef?: string;
}

export interface TuxMapLevelRel {
  from: string;
  to: string;
  label?: string;
  tech?: string;
  status?: TuxMapElementStatus;
  roadmap?: number[];
}

export interface TuxMapFirewallRule {
  direction: "in" | "out";
  access: "allow" | "deny";
  ports: string[];
  from: string[];
}

export interface TuxMapDeploymentGroup {
  id: string;
  zone: string;
  title: string;
  rg?: string;
}

export interface TuxMapDeploymentZone {
  id: string;
  title: string;
  column?: "left" | "right" | "center";
  planned?: boolean;
  /** Optional additional zone IDs that also map into this region */
  zones?: string[];
}

export interface TuxMapDeploymentNode {
  id: string;
  zone?: string;
  group?: string;
  kind: string;
  title: string;
  role: string;
  status?: "now" | "planned" | "neighbor";
  placement?: string;
  /** Container IDs from Level 2 hosted on this Level 4 resource */
  hosts?: string[];
  deps?: string[];
  roadmap?: number[];
  /** Source code / infrastructure manifest binding (e.g. Terraform/Ansible/Dockerfile) */
  source?: TuxMapSourceRef;
  /** PR diff / modification state for Blast-Radius inspection */
  diff?: TuxMapDiffInfo;
  /** Inline fractal child elements for drilling into Level 5+ directly from a Level 4 resource */
  children?: TuxMapLevelElement[];
  /** Optional relationships among inline `children` */
  childRels?: TuxMapLevelRel[];
  /** Optional URL or key for lazy on-demand subgraph hydration */
  subgraphRef?: string;
  facts?: {
    type?: string;
    size?: string;
    sku?: string;
    version?: string;
    nodes?: number;
    ingress?: string;
    images?: string[];
    rules?: TuxMapFirewallRule[];
    [key: string]: unknown;
  };
}

export interface TuxMapDeploymentLink {
  from: string;
  to: string;
  label?: string;
  kind?: string;
  state?: "now" | "planned";
}

export interface TuxMapNeighborResource {
  name: string;
  type: string;
  resourceGroup: string;
  reason: string;
}

export interface TuxMapLevelModel {
  generatedAt?: string;
  issueBaseUrl?: string;
  /** Optional repository base URL for `source.path` links (e.g. "https://code.tti.tamu.edu/tti/tti-ux/src/branch/main") */
  sourceBaseUrl?: string;
  /** Level 1: High-level ecosystem, people, primary systems & external dependencies */
  level1: {
    title?: string;
    summary?: string;
    elements: TuxMapLevelElement[];
    rels: TuxMapLevelRel[];
  };
  /** Level 2: Containers, databases, queues & services inside the primary system boundary */
  level2: {
    title?: string;
    summary?: string;
    boundary: string;
    elements: Array<TuxMapLevelElement | TuxMapLevelRef>;
    rels: TuxMapLevelRel[];
  };
  /** Level 3: Internal components/modules/packages keyed by Level 2 container ID */
  level3: Record<string, TuxMapLevelElement[]>;
  /** Level 4: Physical/cloud deployment topology (regions, resource groups, VMs, firewall rules) */
  level4: {
    title?: string;
    summary?: string;
    /** Optional custom region/zone definitions for Level 4 columns; falls back to TUX defaults when omitted */
    zones?: TuxMapDeploymentZone[];
    /** Optional title for the center resource-groups boundary box (defaults to "Cloud Region · Resource Groups") */
    centerTitle?: string;
    groups: TuxMapDeploymentGroup[];
    nodes: TuxMapDeploymentNode[];
    links: TuxMapDeploymentLink[];
    neighbors?: TuxMapNeighborResource[];
  };
  /**
   * Fractal N-Depth Subgraphs (Level 5, Level 6, Level 7...):
   * Keyed by any parent element ID or Level 4 deployment node ID (e.g. `"ai-search-app"`, `"vector-db-01"`, `"c-api/2"`).
   * Enables infinite semantic zooming down into modules, database schemas, and AST symbols.
   */
  subgraphs?: Record<string, TuxMapSubgraph>;
  /**
   * Fine-grained dependencies between any two elements at any level (an import, a call, a script
   * run, a page loading a script…), usually read from code. The map lifts them onto whatever level
   * is on screen: wires between the cards inside, and in/out cards for what lies outside. The
   * blast radius of a selected element walks them upstream.
   */
  links?: TuxMapLink[];
}

export type TuxMapLinkCoupling =
  | "contract"
  | "runtime"
  | "type-only"
  | "artifact-stamp"
  | "build-exec"
  | "verification"
  | "prose";

export type TuxMapLinkPhase =
  | "prod-runtime"
  | "client-bundle"
  | "build-exec"
  | "ci-test"
  | "doc-only";

export type TuxMapBlastIntent =
  | "default"
  | "patch"
  | "refactor"
  | "cut"
  | "supply-chain";

/** One dependency read from code: `from` depends on `to`. */
export interface TuxMapLink {
  from: string;
  to: string;
  /** e.g. imports, calls, runs, sources, stamps, loads, uses, checks, tests, routes, mentions */
  kind?: string;
  label?: string;
  /** The blast radius takes one step through this link and no further (a test, a doc, a deploy step). */
  stop?: boolean;
  /** Where it was read, as "path:line" */
  at?: string;
  /** All 1-based line numbers in `from` where this link was read, sorted ascending */
  sites?: number[];
  /** Semantic coupling strength for intent-aware blast radius (`patch | refactor | cut | supply-chain`) */
  coupling?: TuxMapLinkCoupling;
  /** Execution or shipping phase of the dependency */
  phase?: TuxMapLinkPhase;
}

export const GRID_METRICS = {
  CW: 212,
  CH: 128,
  GX: 84,
  GY: 56,
  PAD: 28,
  MH: 60,
  NW: 210,
  NH: 92,
} as const;

export interface TuxMapGridCellRect {
  x: number;
  y: number;
  w: number;
  h: number;
  c?: number;
  r?: number;
  bound?: boolean;
}

export interface TuxMapPlacedBoundary {
  id?: string;
  label: string;
  type?: string;
  cls?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TuxMapRoutedWire {
  id: string;
  from: string;
  to: string;
  d: string;
  planned: boolean;
}

export interface TuxMapRoutedLabel {
  id: string;
  from: string;
  to: string;
  x: number;
  y: number;
  w: number;
  h: number;
  t1: string;
  t2: string;
  forced: boolean;
}

export function gridCellToPx(at: [number, number]): { x: number; y: number } {
  const { CW, CH, GX, GY, PAD } = GRID_METRICS;
  return {
    x: PAD + at[0] * (CW + GX),
    y: PAD + 30 + at[1] * (CH + GY),
  };
}

/**
 * Converts a sequence of orthogonal `[x, y]` points into an SVG path with 9px rounded bends.
 */
export function roundOrthogonalCorners(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  let d = `M${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i]!;
    const a = pts[i - 1]!;
    const b = pts[i + 1]!;
    const r = Math.min(
      9,
      Math.hypot(p[0] - a[0], p[1] - a[1]) / 2,
      Math.hypot(b[0] - p[0], b[1] - p[1]) / 2,
    );
    const u: [number, number] = [
      p[0] - Math.sign(p[0] - a[0]) * r,
      p[1] - Math.sign(p[1] - a[1]) * r,
    ];
    const w: [number, number] = [
      p[0] + Math.sign(b[0] - p[0]) * r,
      p[1] + Math.sign(b[1] - p[1]) * r,
    ];
    d += ` L${u[0]},${u[1]} Q${p[0]},${p[1]} ${w[0]},${w[1]}`;
  }
  const e = pts[pts.length - 1]!;
  return `${d} L${e[0]},${e[1]}`;
}

/**
 * Routes wires at right angles strictly through the gaps between columns and rows,
 * never crossing a card, with lane offsets and collision-checked labels.
 */
export function routeGridWires(
  rels: TuxMapLevelRel[],
  rects: Record<string, TuxMapGridCellRect>,
  els: TuxMapLevelElement[],
): { wires: TuxMapRoutedWire[]; labels: TuxMapRoutedLabel[] } {
  const { GX, GY } = GRID_METRICS;
  const occupied: Record<string, number> = {};
  const lanes: Record<string, number> = {};
  const ports: Record<
    string,
    { p: { rel: TuxMapLevelRel; a: TuxMapGridCellRect; b: TuxMapGridCellRect; s: [string, string]; fa?: number; fb?: number }; key: "fa" | "fb"; o: number }[]
  > = {};
  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const paths: {
    rel: TuxMapLevelRel;
    a: TuxMapGridCellRect;
    b: TuxMapGridCellRect;
    s: [string, string];
    fa?: number;
    fb?: number;
  }[] = [];

  for (const e of els) {
    if (e.at) occupied[`${e.at[0]},${e.at[1]}`] = 1;
  }

  function lane(key: string): number {
    const n = (lanes[key] = (lanes[key] || 0) + 1);
    return (n % 2 ? 1 : -1) * Math.floor(n / 2) * 11;
  }

  for (const k of Object.keys(rects)) {
    const r = rects[k]!;
    if (!r.bound) {
      placed.push({ x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 });
    }
  }
  const cards = placed.slice();

  function segHitsAnyCard(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    ignoreA: TuxMapGridCellRect,
    ignoreB: TuxMapGridCellRect,
  ): boolean {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    for (const k of Object.keys(rects)) {
      const r = rects[k]!;
      if (r === ignoreA || r === ignoreB || r.bound) continue;
      if (maxX > r.x + 2 && minX < r.x + r.w - 2 && maxY > r.y + 2 && minY < r.y + r.h - 2) {
        return true;
      }
    }
    return false;
  }

  function polyHitsAnyCard(
    pts: [number, number][],
    ignoreA: TuxMapGridCellRect,
    ignoreB: TuxMapGridCellRect,
  ): boolean {
    for (let i = 0; i < pts.length - 1; i++) {
      if (segHitsAnyCard(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], ignoreA, ignoreB)) {
        return true;
      }
    }
    return false;
  }

  for (const rel of rels) {
    const a = rects[rel.from];
    const b = rects[rel.to];
    if (a && b) {
      paths.push({ rel, a, b, s: ["r", "l"] });
    }
  }

  function side(a: TuxMapGridCellRect, b: TuxMapGridCellRect): [string, string] {
    if (a.bound) return b.x > a.x + a.w / 2 ? ["r", "l"] : ["l", "r"];
    if (b.bound) return a.x < b.x ? ["r", "l"] : ["l", "r"];
    const ac = a.c ?? 0;
    const ar = a.r ?? 0;
    const bc = b.c ?? 0;
    const br = b.r ?? 0;
    // Route bottom/top when cards share a column OR when one card sits 2+ rows below/above
    // within 1 column horizontally (e.g. Level 1 bottom row external systems below primary system)
    if (ac === bc) {
      return Math.abs(ar - br) > 1 ? ["r", "r"] : br > ar ? ["b", "t"] : ["t", "b"];
    }
    if (Math.abs(br - ar) >= 2 && Math.abs(bc - ac) <= 1) {
      return br > ar ? ["b", "t"] : ["t", "b"];
    }
    return bc > ac ? ["r", "l"] : ["l", "r"];
  }

  for (const p of paths) {
    p.s = side(p.a, p.b);
    const entries: [string, string, TuxMapGridCellRect, "fa" | "fb"][] = [
      [p.rel.from, p.s[0], p.b, "fa"],
      [p.rel.to, p.s[1], p.a, "fb"],
    ];
    for (const x of entries) {
      const k = `${x[0]}:${x[1]}`;
      if (!ports[k]) ports[k] = [];
      ports[k]!.push({
        p,
        key: x[3],
        o: x[1] === "l" || x[1] === "r" ? x[2].y : x[2].x,
      });
    }
  }

  for (const k of Object.keys(ports)) {
    const list = ports[k]!.sort((u, v) => u.o - v.o);
    const total = list.length;
    list.forEach((x, j) => {
      if (total === 1) {
        x.p[x.key] = 0.5;
      } else {
        // Distribute ports evenly across the middle 68% of the card edge (0.16 .. 0.84)
        // so parallel vertical/horizontal stems never bunch together
        x.p[x.key] = 0.16 + (j / (total - 1)) * 0.68;
      }
    });
  }

  function at(r: TuxMapGridCellRect, s: string, f = 0.5): [number, number] {
    if (s === "l") return [r.x, r.y + r.h * f];
    if (s === "r") return [r.x + r.w, r.y + r.h * f];
    if (s === "t") return [r.x + r.w * f, r.y];
    return [r.x + r.w * f, r.y + r.h];
  }

  const wires: TuxMapRoutedWire[] = [];
  const labels: TuxMapRoutedLabel[] = [];
  const wireSegments: [[number, number], [number, number], number][] = [];

  paths.forEach((p, idx) => {
    const { a, b, s } = p;
    let P: [number, number];
    let Q: [number, number];
    let pts: [number, number][];

    if (a.bound || b.bound) {
      const n = a.bound ? b : a;
      const y = n.y + n.h * ((a.bound ? p.fb : p.fa) ?? 0.5);
      P = a.bound ? [s[0] === "r" ? a.x + a.w : a.x, y] : at(a, s[0], p.fa);
      Q = b.bound ? [s[1] === "l" ? b.x : b.x + b.w, y] : at(b, s[1], p.fb);
      pts = [P, Q];
    } else {
      P = at(a, s[0], p.fa);
      Q = at(b, s[1], p.fb);
      const ac = a.c ?? 0;
      const ar = a.r ?? 0;
      const bc = b.c ?? 0;
      const br = b.r ?? 0;

      if (s[0] === "r" && s[1] === "r") {
        const gx = a.x + a.w + GX / 2 + lane(`v${ac}`);
        pts = [P, [gx, P[1]], [gx, Q[1]], Q];
      } else if (s[0] === "b" || s[0] === "t") {
        const down = s[0] === "b";
        const baseMy = (P[1] + Q[1]) / 2 + lane(`hb_${Math.min(ar, br)}_${Math.max(ar, br)}`);
        let cand: [number, number][] = [P, [P[0], baseMy], [Q[0], baseMy], Q];
        if (polyHitsAnyCard(cand, a, b)) {
          const y1 =
            (down ? a.y + a.h + GY / 2 : a.y - GY / 2) +
            lane(`hb_row_${ar}_${down ? "b" : "t"}`);
          const y2 =
            (down ? b.y - GY / 2 : b.y + b.h + GY / 2) +
            lane(`hb_row_${br}_${down ? "t" : "b"}`);
          const midCol = Math.min(ac, bc);
          const gx =
            Math.min(a.x, b.x) +
            GRID_METRICS.CW +
            GX / 2 +
            lane(`v_bt_${midCol}`);
          cand = [P, [P[0], y1], [gx, y1], [gx, y2], [Q[0], y2], Q];
        }
        pts = cand;
      } else {
        const dir = s[0] === "r" ? 1 : -1;
        const x1 =
          (dir > 0 ? a.x + a.w : a.x) +
          (dir * GX) / 2 +
          lane(`v${dir > 0 ? ac : ac - 1}`);
        const x2 =
          (dir > 0 ? b.x : b.x + b.w) -
          (dir * GX) / 2 +
          lane(`v${dir > 0 ? bc - 1 : bc}`);
        let clear = true;
        for (let c = Math.min(ac, bc) + 1; c < Math.max(ac, bc); c++) {
          if (occupied[`${c},${br}`]) clear = false;
        }
        if (Math.abs(ac - bc) === 1) {
          pts = [P, [x1, P[1]], [x1, Q[1]], Q];
        } else if (ar === br && clear) {
          const mx = (P[0] + Q[0]) / 2;
          const cand: [number, number][] = [P, [mx, P[1]], [mx, Q[1]], Q];
          if (!polyHitsAnyCard(cand, a, b)) {
            pts = cand;
          } else {
            const yg = b.y - GY / 2 + lane(`h${br}t`);
            pts = [P, [x1, P[1]], [x1, yg], [x2, yg], [x2, Q[1]], Q];
          }
        } else {
          let yg =
            (br >= ar ? b.y - GY / 2 : b.y + b.h + GY / 2) +
            lane(`h${br}${br >= ar ? "t" : "b"}`);
          let cand: [number, number][] = [P, [x1, P[1]], [x1, yg], [x2, yg], [x2, Q[1]], Q];
          if (polyHitsAnyCard(cand, a, b)) {
            // Try the opposite horizontal corridor (below vs above target row, or near source row)
            const altYg =
              (br >= ar ? a.y + a.h + GY / 2 : a.y - GY / 2) +
              lane(`h_alt_${ar}`);
            const altCand: [number, number][] = [
              P,
              [x1, P[1]],
              [x1, altYg],
              [x2, altYg],
              [x2, Q[1]],
              Q,
            ];
            if (!polyHitsAnyCard(altCand, a, b)) {
              cand = altCand;
            }
          }
          pts = cand;
        }
      }
    }

    for (let si = 0; si < pts.length - 1; si++) {
      wireSegments.push([pts[si]!, pts[si + 1]!, idx]);
    }

    wires.push({
      id: `w-${idx}-${p.rel.from}-${p.rel.to}`,
      from: p.rel.from,
      to: p.rel.to,
      d: roundOrthogonalCorners(pts),
      planned: p.rel.status === "planned",
    });

    if (p.rel.label) {
      const t1 = p.rel.label;
      const t2 = p.rel.tech || "";
      const w = Math.max(t1.length * 6.1, (t2.length + 2) * 5.5) + 14;
      const h = t2 ? 32 : 19;
      const segs: [[number, number], [number, number], number][] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i]!;
        const p1 = pts[i + 1]!;
        segs.push([p0, p1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1])]);
      }
      segs.sort((u, v) => v[2] - u[2]);

      const fractions =
        idx % 2 === 0
          ? [0.5, 0.34, 0.66, 0.24, 0.76, 0.18, 0.82]
          : [0.36, 0.64, 0.5, 0.24, 0.76, 0.18, 0.82];

      let box: { x: number; y: number; w: number; h: number } | null = null;
      for (let j = 0; j < segs.length && !box; j++) {
        const sg = segs[j]!;
        for (const f of fractions) {
          const m: [number, number] = [
            sg[0][0] + (sg[1][0] - sg[0][0]) * f,
            sg[0][1] + (sg[1][1] - sg[0][1]) * f,
          ];
          const cand = { x: m[0] - w / 2, y: m[1] - h / 2, w, h };
          const overlapsPlaced = placed.some(
            (q) =>
              cand.x < q.x + q.w &&
              cand.x + cand.w > q.x &&
              cand.y < q.y + q.h &&
              cand.y + cand.h > q.y,
          );
          if (overlapsPlaced) continue;

          // Also avoid clipping across another wire's segment when a clean spot exists
          const clipsOtherWire = wireSegments.some(([s0, s1, wIdx]) => {
            if (wIdx === idx) return false;
            const minX = Math.min(s0[0], s1[0]) - 2;
            const maxX = Math.max(s0[0], s1[0]) + 2;
            const minY = Math.min(s0[1], s1[1]) - 2;
            const maxY = Math.max(s0[1], s1[1]) + 2;
            return (
              cand.x < maxX &&
              cand.x + cand.w > minX &&
              cand.y < maxY &&
              cand.y + cand.h > minY
            );
          });
          if (!clipsOtherWire) {
            box = cand;
            break;
          }
        }
      }

      // Second pass if every non-overlapping spot crossed another wire segment
      if (!box) {
        for (let j = 0; j < segs.length && !box; j++) {
          const sg = segs[j]!;
          for (const f of fractions) {
            const m: [number, number] = [
              sg[0][0] + (sg[1][0] - sg[0][0]) * f,
              sg[0][1] + (sg[1][1] - sg[0][1]) * f,
            ];
            const cand = { x: m[0] - w / 2, y: m[1] - h / 2, w, h };
            if (
              !placed.some(
                (q) =>
                  cand.x < q.x + q.w &&
                  cand.x + cand.w > q.x &&
                  cand.y < q.y + q.h &&
                  cand.y + cand.h > q.y,
              )
            ) {
              box = cand;
              break;
            }
          }
        }
      }

      const forced = !box;
      if (forced) {
        let best = Infinity;
        for (const sg of segs) {
          for (const f of [0.5, 0.35, 0.65, 0.22, 0.78, 0.15, 0.85]) {
            const c = {
              x: sg[0][0] + (sg[1][0] - sg[0][0]) * f - w / 2,
              y: sg[0][1] + (sg[1][1] - sg[0][1]) * f - h / 2,
              w,
              h,
            };
            let cover = 0;
            for (const q of cards) {
              cover +=
                Math.max(0, Math.min(c.x + w, q.x + q.w) - Math.max(c.x, q.x)) *
                Math.max(0, Math.min(c.y + h, q.y + q.h) - Math.max(c.y, q.y));
            }
            for (let pi = cards.length; pi < placed.length; pi++) {
              const q = placed[pi]!;
              cover +=
                25 *
                Math.max(0, Math.min(c.x + w, q.x + q.w) - Math.max(c.x, q.x)) *
                Math.max(0, Math.min(c.y + h, q.y + q.h) - Math.max(c.y, q.y));
            }
            if (cover < best) {
              best = cover;
              box = c;
            }
          }
        }
      }

      if (box) {
        placed.push({ x: box.x - 2, y: box.y - 2, w: box.w + 4, h: box.h + 4 });
        labels.push({
          id: `lbl-${idx}-${p.rel.from}-${p.rel.to}`,
          from: p.rel.from,
          to: p.rel.to,
          x: Math.round(box.x),
          y: Math.round(box.y),
          w: Math.round(w),
          h: Math.round(h),
          t1,
          t2,
          forced,
        });
      }
    }
  });

  return { wires, labels };
}

/**
 * Routes right-angle wires for Level 4 deployment resource nodes.
 * Pass `selectedId = "*"` to pre-route all links so hover highlighting works with zero recomputation.
 */
export function routeDeploymentWires(
  links: TuxMapDeploymentLink[],
  rects: Record<string, TuxMapGridCellRect>,
  selectedId: string | null = "*",
): TuxMapRoutedWire[] {
  if (!selectedId) return [];
  const routeAll = selectedId === "*";
  const wires: TuxMapRoutedWire[] = [];
  const allRects = Object.entries(rects);

  function hitsAnyCard(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    ignoreA: string,
    ignoreB: string,
  ): boolean {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    for (const [id, r] of allRects) {
      if (id === ignoreA || id === ignoreB || r.bound) continue;
      if (maxX > r.x + 2 && minX < r.x + r.w - 2 && maxY > r.y + 2 && minY < r.y + r.h - 2) {
        return true;
      }
    }
    return false;
  }

  function polyHits(pts: [number, number][], ignoreA: string, ignoreB: string): boolean {
    for (let i = 0; i < pts.length - 1; i++) {
      if (hitsAnyCard(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], ignoreA, ignoreB)) {
        return true;
      }
    }
    return false;
  }

  // Group port assignments by (nodeId, side) so multiple links on a Level 4 resource fan out cleanly
  const activeLinks = links.filter(
    (r) =>
      rects[r.from] &&
      rects[r.to] &&
      (routeAll || r.from === selectedId || r.to === selectedId),
  );

  interface PortEntry {
    linkIdx: number;
    end: "from" | "to";
    otherCoord: number;
  }
  const portsBySide = new Map<string, PortEntry[]>();
  const portFraction = new Map<string, number>();

  activeLinks.forEach((r, idx) => {
    const a = rects[r.from]!;
    const b = rects[r.to]!;
    const right = b.x >= a.x + a.w;
    const left = b.x + b.w <= a.x;
    const down = b.y > a.y;
    const fromSide = right ? "r" : left ? "l" : down ? "b" : "t";
    const toSide = right ? "l" : left ? "r" : down ? "t" : "b";

    const kFrom = `${r.from}:${fromSide}`;
    const kTo = `${r.to}:${toSide}`;
    if (!portsBySide.has(kFrom)) portsBySide.set(kFrom, []);
    if (!portsBySide.has(kTo)) portsBySide.set(kTo, []);
    portsBySide.get(kFrom)!.push({
      linkIdx: idx,
      end: "from",
      otherCoord: fromSide === "l" || fromSide === "r" ? b.y : b.x,
    });
    portsBySide.get(kTo)!.push({
      linkIdx: idx,
      end: "to",
      otherCoord: toSide === "l" || toSide === "r" ? a.y : a.x,
    });
  });

  for (const [, list] of portsBySide.entries()) {
    list.sort((u, v) => u.otherCoord - v.otherCoord);
    const total = list.length;
    list.forEach((item, j) => {
      const frac = total === 1 ? 0.5 : 0.18 + (j / (total - 1)) * 0.64;
      portFraction.set(`${item.linkIdx}:${item.end}`, frac);
    });
  }

  activeLinks.forEach((r, idx) => {
    const a = rects[r.from]!;
    const b = rects[r.to]!;
    const right = b.x >= a.x + a.w;
    const left = b.x + b.w <= a.x;
    const fa = portFraction.get(`${idx}:from`) ?? 0.5;
    const fb = portFraction.get(`${idx}:to`) ?? 0.5;
    const laneShift = ((idx % 5) - 2) * 4;
    let d: string;

    if (right || left) {
      const P: [number, number] = [right ? a.x + a.w : a.x, Math.round(a.y + a.h * fa)];
      const Q: [number, number] = [right ? b.x : b.x + b.w, Math.round(b.y + b.h * fb)];
      const mx = Math.round((P[0] + Q[0]) / 2 + laneShift);
      const directPts: [number, number][] = [P, [mx, P[1]], [mx, Q[1]], Q];
      if (!polyHits(directPts, r.from, r.to)) {
        d = roundOrthogonalCorners(directPts);
      } else {
        // Route around sibling cards via the horizontal gap below/above the card
        const goBelow = b.y >= a.y;
        const Pbot: [number, number] = [
          Math.round(a.x + a.w * fa),
          goBelow ? a.y + a.h : a.y,
        ];
        const yg = (goBelow ? a.y + a.h + 9 : a.y - 9) + ((idx % 3) - 1) * 3;
        const gx = right
          ? Math.max(a.x + a.w + 10, b.x - 18)
          : Math.min(a.x - 10, b.x + b.w + 18);
        const detourPts: [number, number][] = [Pbot, [Pbot[0], yg], [gx, yg], [gx, Q[1]], Q];
        d = roundOrthogonalCorners(detourPts);
      }
    } else {
      const down = b.y > a.y;
      const P2: [number, number] = [Math.round(a.x + a.w * fa), down ? a.y + a.h : a.y];
      const Q2: [number, number] = [Math.round(b.x + b.w * fb), down ? b.y : b.y + b.h];
      const my = Math.round((P2[1] + Q2[1]) / 2 + laneShift);
      d = roundOrthogonalCorners([P2, [P2[0], my], [Q2[0], my], Q2]);
    }
    wires.push({
      id: `dw-${idx}-${r.from}-${r.to}`,
      from: r.from,
      to: r.to,
      d,
      planned: r.state === "planned",
    });
  });
  return wires;
}

/**
 * Converts legacy `TuxMapNode[]` + `TuxMapEdge[]` + `TuxMapZone[]` props into a
 * 4-Level `TuxMapLevelModel` so existing consumers automatically gain 4-level C4 navigation.
 */
export function buildLevelModelFromLegacyNodes(
  nodes: TuxMapNode[],
  edges: TuxMapEdge[],
  zones: TuxMapZone[] = [],
): TuxMapLevelModel {
  const level1Elements: TuxMapLevelElement[] = [
    {
      id: "p-researchers",
      kind: "person",
      name: "Product Users & Analysts",
      desc: "Use web applications, dashboards, and APIs to analyze data and collaborate.",
      at: [0, 0],
    },
    {
      id: "p-ops",
      kind: "person",
      name: "Platform & SRE Leads",
      desc: "Operate cloud environments, deployment pipelines, and security policies.",
      at: [0, 1],
    },
    {
      id: "s-ecosystem",
      kind: "system",
      name: "Enterprise Cloud Platform",
      tech: `${nodes.length} Core Services`,
      desc: "Unified application architecture spanning web portals, APIs, and managed data stores.",
      at: [2, 0],
      zoom: 2,
    },
    {
      id: "x-tamu-sso",
      kind: "external",
      name: "Identity Provider (SSO)",
      desc: "Federated OIDC single sign-on and role group directory.",
      at: [4, 0],
    },
    {
      id: "x-txdot",
      kind: "external",
      name: "External Telemetry Feeds",
      desc: "Real-time partner data streams and webhook integrations.",
      at: [4, 1],
    },
  ];

  const level1Rels: TuxMapLevelRel[] = [
    { from: "p-researchers", to: "s-ecosystem", label: "Uses portals & API", tech: "HTTPS 443" },
    { from: "p-ops", to: "s-ecosystem", label: "Operates & monitors", tech: "HTTPS" },
    { from: "s-ecosystem", to: "x-tamu-sso", label: "Signs users in", tech: "OIDC / SCIM" },
    { from: "x-txdot", to: "s-ecosystem", label: "Streams partner feeds", tech: "TLS / gRPC" },
  ];

  const colCounts = new Map<number, number>();
  const level2Elements: Array<TuxMapLevelElement | TuxMapLevelRef> = [
    { id: "p-researchers", ref: true, at: [0, 0] },
    { id: "p-ops", ref: true, at: [0, 1] },
  ];

  const level3: Record<string, TuxMapLevelElement[]> = {};
  const deployGroups: TuxMapDeploymentGroup[] =
    zones.length > 0
      ? zones.map((z) => ({ id: z.id, zone: "cloud-prod", title: z.label, rg: z.sublabel }))
      : [{ id: "rg-default", zone: "cloud-prod", title: "Production Cloud Region" }];
  const deployNodes: TuxMapDeploymentNode[] = [];
  const deployLinks: TuxMapDeploymentLink[] = [];

  nodes.forEach((n, idx) => {
    const tierCol = (typeof n.tier === "number" ? n.tier : idx % 3) + 1;
    const rowIdx = colCounts.get(tierCol) ?? 0;
    colCounts.set(tierCol, rowIdx + 1);

    const hostIds = n.resources
      .filter((r) => r.kind !== "person")
      .map((r) => r.id);

    level2Elements.push({
      id: n.id,
      kind: n.id.includes("data") || n.id.includes("db") ? "database" : "container",
      name: n.name,
      tech: n.division || n.code,
      desc: n.summary,
      status: n.status === "pending" ? "planned" : n.status === "warning" ? "paused" : "live",
      at: [tierCol, rowIdx],
      deployed: hostIds,
      live: {
        state: n.status === "ok" ? "running" : "inactive",
        version: n.packages[0]?.version,
      },
    });

    level3[n.id] = n.packages.map((p, pIdx) => ({
      id: `${n.id}-pkg-${pIdx}`,
      kind: "component",
      name: p.name,
      tech: `${p.scope ?? "npm"} · v${p.version}${p.port ? ` :${p.port}` : ""}`,
      desc: `Package dependency (${p.scope ?? "external"}) consumed by ${n.name}.`,
    }));

    for (const r of n.resources) {
      if (r.kind === "person") continue;
      if (!deployNodes.some((dn) => dn.id === r.id)) {
        deployNodes.push({
          id: r.id,
          group: n.zoneId || deployGroups[0]!.id,
          kind: r.kind,
          title: r.name,
          role: `${r.spec || r.role || "Compute resource"} supporting ${n.name}.`,
          status: "now",
          hosts: [n.id],
          facts: {
            type: r.kind.toUpperCase(),
            size: r.spec || "Standard",
          },
        });
      }
    }
  });

  const level2Rels: TuxMapLevelRel[] = [
    { from: "p-researchers", to: nodes[0]?.id ?? "", label: "Uses", tech: "HTTPS 443" },
    ...edges.map((e) => ({
      from: e.source,
      to: e.target,
      label: e.label || "Calls",
      tech: e.protocol,
    })),
  ].filter((r) => r.to);

  return {
    generatedAt: new Date().toISOString(),
    level1: { elements: level1Elements, rels: level1Rels },
    level2: { boundary: "s-ecosystem", elements: level2Elements, rels: level2Rels },
    level3,
    level4: { groups: deployGroups, nodes: deployNodes, links: deployLinks, neighbors: [] },
  };
}

/**
 * Default 4-Level Reference Architecture Model (Generic Enterprise Cloud Platform).
 * Uses clear, vendor-neutral terminology without exposing real internal deployments.
 */
// ============================================================================
// 7. CODE LINKS: LIFTING ONTO A VIEW & THE BLAST RADIUS OF A SELECTION
// ============================================================================

/** Link kinds drawn on no stage (they still count in the blast radius): a document naming a part. */
export const TUX_MAP_QUIET_LINK_KINDS: ReadonlySet<string> = new Set(["mentions"]);

/** Canonical link strength order from strongest runtime/contract edge to weakest prose reference. */
export const TUX_MAP_LINK_STRENGTH_ORDER = [
  "calls",
  "imports",
  "runs",
  "sources",
  "stamps",
  "tests",
  "checks",
  "uses",
  "loads",
  "routes",
  "links",
  "mentions",
] as const;

const LINK_STRENGTH_RANK: ReadonlyMap<string, number> = new Map(
  TUX_MAP_LINK_STRENGTH_ORDER.map((k, i) => [k, i]),
);

/** What a link kind means, read from the part it points at ("changing X: Y calls it"). */
export const TUX_MAP_LINK_KIND_LABELS: Record<string, string> = {
  imports: "imports it",
  calls: "calls it",
  runs: "runs it",
  sources: "sources it",
  stamps: "stamps or builds it",
  loads: "loads it",
  uses: "reads or ships it",
  checks: "CI checks it",
  tests: "tests it",
  routes: "routes to it",
  links: "links to it",
  mentions: "mentions it",
};

const MAX_TREE_DEPTH = 64;

const NON_PROSE_LINK_KINDS: ReadonlySet<string> = new Set([
  "calls",
  "imports",
  "runs",
  "sources",
  "stamps",
  "tests",
  "checks",
  "loads",
  "routes",
  "uses",
  "links",
]);

const NON_TYPE_ONLY_LINK_KINDS: ReadonlySet<string> = new Set([
  "calls",
  "runs",
  "sources",
  "stamps",
  "tests",
  "checks",
  "loads",
  "routes",
  "links",
]);

const NON_AUX_CO_CUT_KINDS: ReadonlySet<string> = new Set([
  "system",
  "container",
  "database",
  "storage",
  "component",
  "resource",
  "person",
  "external",
]);

const NON_PROD_HOST_COUPLINGS: ReadonlySet<TuxMapLinkCoupling> = new Set([
  "verification",
  "artifact-stamp",
  "build-exec",
  "prose",
  "type-only",
]);

/** Prototype-safe own-property check (`Object.prototype` keys like `"constructor"` return `false`). */
export function hasOwn(obj: unknown, key: PropertyKey): boolean {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

function setOwnProp<T>(obj: Record<string, T>, key: string, value: T): void {
  if (key === "__proto__") {
    Object.defineProperty(obj, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    obj[key] = value;
  }
}

/** True Unicode code-point comparison (matches Python `str < str` even on supplementary U+10000+ planes). */
export function cmpCodepoint(a: string, b: string): number {
  if (a === b) return 0;
  let ia = 0;
  let ib = 0;
  while (ia < a.length && ib < b.length) {
    const ca = a.codePointAt(ia)!;
    const cb = b.codePointAt(ib)!;
    if (ca !== cb) return ca - cb;
    ia += ca > 0xffff ? 2 : 1;
    ib += cb > 0xffff ? 2 : 1;
  }
  return a.length - b.length;
}

function linkStrengthRank(kind?: string): number {
  return LINK_STRENGTH_RANK.get(kind || "") ?? TUX_MAP_LINK_STRENGTH_ORDER.length;
}

export function compareBlastLinks(a: TuxMapLink, b: TuxMapLink): number {
  return (
    linkStrengthRank(a.kind) - linkStrengthRank(b.kind) ||
    cmpCodepoint(a.from, b.from) ||
    cmpCodepoint(a.to, b.to) ||
    cmpCodepoint(a.at ?? "", b.at ?? "")
  );
}

/** Infers deterministic semantic coupling for links that omit explicit `coupling` (rejecting spoofed downgrades on runtime kinds). */
export function inferLinkCoupling(link: TuxMapLink): TuxMapLinkCoupling {
  const k = link.kind || "";
  if (link.coupling) {
    const c = link.coupling;
    const spoofedProse = c === "prose" && NON_PROSE_LINK_KINDS.has(k);
    const spoofedTypeOnly = c === "type-only" && NON_TYPE_ONLY_LINK_KINDS.has(k);
    if (!spoofedProse && !spoofedTypeOnly) return c;
  }
  if (k === "mentions") return "prose";
  if (k === "tests" || k === "checks") return "verification";
  if (k === "stamps") return "artifact-stamp";
  if (k === "routes" || k === "links") return "contract";
  if (k === "loads" || k === "uses") return "runtime";
  if (k === "imports" || k === "sources") return link.stop ? "verification" : "contract";
  if (k === "calls" || k === "runs") return link.stop ? "verification" : "runtime";
  return link.stop ? "verification" : "runtime";
}

/** Infers deterministic execution/shipping phase for links that omit explicit `phase`. */
export function inferLinkPhase(link: TuxMapLink): TuxMapLinkPhase {
  const c = inferLinkCoupling(link);
  const k = link.kind || "";
  if (link.phase) {
    if (!(link.phase === "doc-only" && c !== "prose" && k !== "mentions")) {
      return link.phase;
    }
  }
  if (c === "prose" || k === "mentions") return "doc-only";
  if (c === "verification" || k === "tests" || k === "checks") return "ci-test";
  if (c === "build-exec") return "build-exec";
  if (c === "artifact-stamp" || k === "stamps" || k === "loads" || k === "links") return "client-bundle";
  return "prod-runtime";
}

/**
 * Classifies how `link` participates in an upstream blast-radius walk at distance `hop`
 * (`hop === 0` means `link.to` is in `seeds`).
 */
export function classifyBlastLink(
  link: TuxMapLink,
  hop: number,
  intent: TuxMapBlastIntent = "default",
  quietSeedOnly = true,
  kinds?: ReadonlySet<string> | null,
): "spread" | "stop" | "skip" {
  const k = link.kind || "uses";
  if (kinds && !kinds.has(k)) return "skip";
  const isQuiet = TUX_MAP_QUIET_LINK_KINDS.has(link.kind || "");
  if (quietSeedOnly && isQuiet && hop > 0) return "skip";

  if (intent === "default") {
    if (isQuiet) return link.stop === false && !quietSeedOnly ? "spread" : "stop";
    return link.stop ? "stop" : "spread";
  }

  const c = inferLinkCoupling(link);
  const p = inferLinkPhase(link);

  if (intent === "patch") {
    if (c === "type-only" || c === "build-exec") return "skip";
    if (c === "prose") return hop === 0 || !quietSeedOnly ? "stop" : "skip";
    if (c === "artifact-stamp" || c === "verification" || link.stop) return "stop";
    return "spread";
  }

  if (intent === "refactor" || intent === "cut") {
    if (c === "prose") return hop === 0 || !quietSeedOnly ? "stop" : "skip";
    if (c === "type-only") return "spread";
    if (c === "build-exec" || c === "artifact-stamp" || c === "verification" || link.stop) return "stop";
    return "spread";
  }

  // intent === "supply-chain"
  if (c === "prose" || c === "type-only" || p === "doc-only") return "skip";
  if (p === "build-exec" || c === "build-exec") return "stop";
  if (c === "artifact-stamp" || k === "stamps") return "stop";
  if (p === "ci-test" || c === "verification") return "stop";
  return link.stop ? "stop" : "spread";
}

function isLevel3Focus(id: string, model: TuxMapLevelModel): boolean {
  if (!hasOwn(model?.level3, id) || !Array.isArray(model.level3[id])) return false;
  return model.level3[id]!.length > 0 || !hasOwn(model.subgraphs, id);
}

/**
 * child → parent for every element below Level 2: Level 3 components under their container,
 * subgraph elements under their key (or `subgraphRef` owner), inline `children` under their element.
 */
export function buildMapParentIndex(model: TuxMapLevelModel): Map<string, string> {
  const parentOf = new Map<string, string>();
  const subgraphOwners = new Map<string, string>();
  const noteSubgraphRef = (ownerId: string, ref?: string) => {
    if (ownerId && ref && ref !== ownerId && !subgraphOwners.has(ref)) {
      subgraphOwners.set(ref, ownerId);
    }
  };
  const inline = (pid: string, kids: TuxMapLevelElement[] | undefined, depth = 0) => {
    if (!kids || depth >= MAX_TREE_DEPTH) return;
    kids.forEach((k, i) => {
      const id = k.id || `${pid}/${i}`;
      if (!parentOf.has(id)) parentOf.set(id, pid);
      noteSubgraphRef(id, k.subgraphRef);
      if (k.children?.length) inline(id, k.children, depth + 1);
    });
  };
  for (const [cid, kids] of Object.entries(model?.level3 || {})) inline(cid, kids, 0);
  for (const e of [...(model?.level1?.elements || []), ...(model?.level2?.elements || [])]) {
    noteSubgraphRef(e.id, e.subgraphRef);
    if (e.children?.length) inline(e.id, e.children, 0);
  }
  for (const n of model?.level4?.nodes || []) {
    noteSubgraphRef(n.id, n.subgraphRef);
    if (n.children?.length) inline(n.id, n.children, 0);
  }
  for (const [key, sg] of Object.entries(model?.subgraphs || {})) {
    const owner = subgraphOwners.get(key) ?? key;
    inline(owner, sg?.elements, 0);
  }
  return parentOf;
}

/**
 * Semantic level that displays the children of `fid`:
 * 3 inside a Level 2 container, 5 inside a Level 3 component or Level 4 deployment node,
 * and +1 for each nested subgraph below that (independent of `model.subgraphs` key order).
 */
export function levelForFocus(
  fid: string,
  model: TuxMapLevelModel,
  parentOf: Map<string, string> = buildMapParentIndex(model),
): number {
  const walk = (id: string, seen: Set<string>): number => {
    if (isLevel3Focus(id, model)) return 3;
    const p = parentOf.get(id);
    if (!p || seen.has(p) || seen.size >= MAX_TREE_DEPTH || isLevel3Focus(p, model)) return 5;
    seen.add(p);
    return walk(p, seen) + 1;
  };
  return walk(fid, new Set([fid]));
}

/** `id` and its ancestors, nearest first. */
export function mapAncestorsOf(id: string, parentOf: Map<string, string>): string[] {
  const chain: string[] = [];
  const seen = new Set<string>();
  let x: string | undefined = id;
  while (x && !seen.has(x) && chain.length < MAX_TREE_DEPTH) {
    seen.add(x);
    chain.push(x);
    x = parentOf.get(x);
  }
  return chain;
}

/** The nearest of `id` and its ancestors that is in `set`, or null. */
export function liftToSet(id: string, set: ReadonlySet<string>, parentOf: Map<string, string>): string | null {
  for (const a of mapAncestorsOf(id, parentOf)) if (set.has(a)) return a;
  return null;
}

/**
 * Extracts fine-grained `TuxMapLink[]` from `model`: returns `model.links` when present (bridging
 * non-planned C4/Level-4 relationships for endpoints without fine-grained code-link coverage unless
 * `bridgeUncovered === false`), or synthesizes links from C4 `rels` and `level4.links` when `model.links`
 * is empty/absent.
 */
export function extractModelLinks(
  model: TuxMapLevelModel,
  opts: { includePlanned?: boolean; includeC4Rels?: boolean; bridgeUncovered?: boolean } = {},
): TuxMapLink[] {
  const includePlanned = opts.includePlanned ?? false;
  const rawLinks = (model?.links ?? []).filter((l) => Boolean(l?.from && l?.to));
  const hasCodeLinks = rawLinks.length > 0;
  if (hasCodeLinks && !opts.includeC4Rels && opts.bridgeUncovered === false) {
    return rawLinks;
  }

  let covered: Set<string> | null = null;
  if (hasCodeLinks && !opts.includeC4Rels) {
    covered = new Set<string>();
    const parentOf = buildMapParentIndex(model);
    const hostBridge = buildHostBridge(model);
    const l2ContainerIds = new Set(
      (model?.level2?.elements ?? []).filter((e) => !e.ref).map((e) => e.id),
    );
    const boundary = model?.level2?.boundary;
    const markCovered = (id: string) => {
      for (const anc of mapAncestorsOf(id, parentOf)) {
        covered!.add(anc);
        if (boundary && l2ContainerIds.has(anc)) covered!.add(boundary);
        const hs = hostBridge.hostsByElement.get(anc);
        if (hs) {
          for (const hid of hs) covered!.add(hid);
        }
      }
    };
    for (const l of rawLinks) {
      markCovered(l.from);
      markCovered(l.to);
    }
  }

  const out: TuxMapLink[] = [...rawLinks];
  const seen = new Set(out.map((l) => `${l.from}\u0000${l.to}\u0000${l.kind || "uses"}`));
  const push = (from: string, to: string, kind: string, label?: string) => {
    if (!from || !to) return;
    if (covered && covered.has(to)) return;
    const normKind = kind || "uses";
    const key = `${from}\u0000${to}\u0000${normKind}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ from, to, kind: normKind, label, coupling: "runtime", phase: "prod-runtime" });
  };
  for (const r of model?.level1?.rels ?? []) {
    if (!includePlanned && r.status === "planned") continue;
    push(r.from, r.to, "uses", r.label);
  }
  for (const r of model?.level2?.rels ?? []) {
    if (!includePlanned && r.status === "planned") continue;
    push(r.from, r.to, "uses", r.label);
  }
  for (const [pid, kids] of Object.entries(model?.level3 ?? {})) {
    (kids ?? []).forEach((k, idx) => {
      if (!includePlanned && k.status === "planned") return;
      if (k.next != null && kids[k.next]) {
        const fromId = k.id || `${pid}/${idx}`;
        const toId = kids[k.next]!.id || `${pid}/${k.next}`;
        push(fromId, toId, "uses");
      }
    });
  }
  for (const sg of Object.values(model?.subgraphs || {})) {
    for (const r of sg?.rels || []) {
      if (!includePlanned && r.status === "planned") continue;
      push(r.from, r.to, "uses", r.label);
    }
  }
  for (const l of model?.level4?.links ?? []) {
    if (!includePlanned && l.state === "planned") continue;
    push(l.from, l.to, l.kind || "uses", l.label);
  }
  return out;
}

export interface TuxMapLiftedSide {
  /** The outside part, at the depth of the cards inside (never above what it shares with the focus) */
  id: string;
  /** How many fine-grained links it stands for */
  count: number;
  /** How many of them carry a change on (not `stop`): calls, imports, runs before tests and docs */
  spreading: number;
  wires: { kid: string; label: string }[];
}

function topKinds(kinds: Map<string, number>): string {
  return [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k).join(", ");
}

/**
 * The links lifted onto one view, the children `kidIds` of `focusId`: wires between two children,
 * and the parts outside that children depend on (`outs`) or that depend on them (`ins`), `maxPerSide`
 * of each: those a change travels through (calls, imports, runs) first, then the busiest. An outside
 * part the map does not hold (`isKnown`; by default, anything in `parentOf`) is left out.
 */
export function liftLinksToView(
  links: TuxMapLink[],
  focusId: string,
  kidIds: string[],
  parentOf: Map<string, string>,
  opts: { quiet?: ReadonlySet<string>; maxPerSide?: number; isKnown?: (id: string) => boolean } = {},
): { rels: TuxMapLevelRel[]; ins: TuxMapLiftedSide[]; outs: TuxMapLiftedSide[]; moreIns: number; moreOuts: number } {
  const quiet = opts.quiet ?? TUX_MAP_QUIET_LINK_KINDS;
  // an outside part is drawn only if the map holds it (a link may name one it does not)
  const isKnown = opts.isKnown ?? ((id: string) => parentOf.has(id));
  const max = opts.maxPerSide ?? 8;
  const kids = new Set(kidIds);
  const focusChain = new Set(mapAncestorsOf(focusId, parentOf));
  const kidDepth = mapAncestorsOf(focusId, parentOf).length + 1;
  const outside = (id: string): string | null => {
    if (!isKnown(id)) return null;
    let pick: string | null = null;
    for (const a of mapAncestorsOf(id, parentOf)) {
      if (focusChain.has(a)) break;
      pick = a;
      if (mapAncestorsOf(a, parentOf).length <= kidDepth) break;
    }
    return pick;
  };
  const sib = new Map<string, { from: string; to: string; kinds: Map<string, number> }>();
  // links that spread, per side: a part both sides hold counts each side's own
  const spreading = { ins: new Map<string, number>(), outs: new Map<string, number>() };
  const side = (which: "ins" | "outs", m: Map<string, Map<string, Map<string, number>>>, o: string, kid: string, l: TuxMapLink) => {
    const kind = l.kind || "uses";
    const byKid = m.get(o) ?? new Map<string, Map<string, number>>();
    const kinds = byKid.get(kid) ?? new Map<string, number>();
    kinds.set(kind, (kinds.get(kind) ?? 0) + 1);
    byKid.set(kid, kinds);
    m.set(o, byKid);
    if (!l.stop) spreading[which].set(o, (spreading[which].get(o) ?? 0) + 1);
  };
  const insM = new Map<string, Map<string, Map<string, number>>>();
  const outsM = new Map<string, Map<string, Map<string, number>>>();
  for (const l of links) {
    const kind = l.kind || "uses";
    if (quiet.has(kind)) continue;
    const a = liftToSet(l.from, kids, parentOf);
    const b = liftToSet(l.to, kids, parentOf);
    if (a && b) {
      if (a === b) continue;
      const key = `${a}\u0000${b}`;
      const r = sib.get(key) ?? { from: a, to: b, kinds: new Map<string, number>() };
      r.kinds.set(kind, (r.kinds.get(kind) ?? 0) + 1);
      sib.set(key, r);
    } else if (a) {
      const o = outside(l.to);
      if (o) side("outs", outsM, o, a, l);
    } else if (b) {
      const o = outside(l.from);
      if (o) side("ins", insM, o, b, l);
    }
  }
  const sides = (which: "ins" | "outs", m: Map<string, Map<string, Map<string, number>>>): TuxMapLiftedSide[] =>
    [...m.entries()]
      .map(([id, byKid]) => ({
        id,
        count: [...byKid.values()].reduce((n, k) => n + [...k.values()].reduce((x, y) => x + y, 0), 0),
        spreading: spreading[which].get(id) ?? 0,
        wires: [...byKid.entries()].map(([kid, k]) => ({ kid, label: topKinds(k) })),
      }))
      .sort((x, y) => Number(y.spreading > 0) - Number(x.spreading > 0) || y.count - x.count || x.id.localeCompare(y.id));
  const ins = sides("ins", insM);
  const outs = sides("outs", outsM);
  return {
    rels: [...sib.values()].map((r) => ({ from: r.from, to: r.to, label: topKinds(r.kinds) })),
    ins: ins.slice(0, max),
    outs: outs.slice(0, max),
    moreIns: Math.max(0, ins.length - max),
    moreOuts: Math.max(0, outs.length - max),
  };
}

export interface TuxMapBlastHit {
  /** Steps from the selection: 1 = depends on it directly */
  hop: number;
  /** The link it was reached through */
  via: TuxMapLink;
  /** Primary source location ("path:line") from `via.at`, when present */
  at?: string;
  /** All 1-based line numbers in `from` where `via` occurs, when present */
  sites?: number[];
}

export interface TuxMapBlastOptions {
  /** Maximum hop depth before stopping and reporting `truncated: true` (default: 32) */
  maxHops?: number;
  /** Follow quiet links (`mentions`) only directly from `seeds` (`hop === 0`) (default: true) */
  quietSeedOnly?: boolean;
  /** Optional allowlist of link `kind`s to traverse */
  kinds?: Iterable<string> | ReadonlySet<string>;
  /** Semantic change intent controlling coupling/phase propagation (default: "default") */
  intent?: TuxMapBlastIntent;
  /** Whether to traverse `planned` C4/deployment edges in multi-level queries (default: false) */
  includePlanned?: boolean;
  /** Optional full model used to expand system/host seeds and resolve Level 4 `hostsImpacted` */
  model?: TuxMapLevelModel;
}

export interface TuxMapBlastResult {
  seeds: Set<string>;
  hits: Map<string, TuxMapBlastHit>;
  truncated: boolean;
  /** Direct 1-hop contract/runtime/type-only dependents */
  blockers: string[];
  /** Exclusive test/check/doc/stamp dependents whose non-self repo targets all lie inside `seeds` */
  coCutCandidates: string[];
  /** Reached verification (`tests` / `checks`) targets */
  testsToRun: string[];
  /** Reached artifact-stamp (`stamps` / bundle) targets */
  stampsToRebuild: string[];
  /** Reached `build-exec` targets (install hooks / CI / Studio build tools) */
  buildExecImpacted: string[];
  /** Level 4 deployment node IDs hosting any seed or reached container/component */
  hostsImpacted: string[];
}

function buildHostBridge(model: TuxMapLevelModel): {
  hostsByElement: Map<string, Set<string>>;
  elementsByHost: Map<string, Set<string>>;
} {
  const hostsByElement = new Map<string, Set<string>>();
  const elementsByHost = new Map<string, Set<string>>();
  const linkHost = (elId: string, hostId: string) => {
    if (!elId || !hostId) return;
    let hs = hostsByElement.get(elId);
    if (!hs) {
      hs = new Set();
      hostsByElement.set(elId, hs);
    }
    hs.add(hostId);
    let es = elementsByHost.get(hostId);
    if (!es) {
      es = new Set();
      elementsByHost.set(hostId, es);
    }
    es.add(elId);
  };
  const normArr = (v?: string | string[]): string[] => (!v ? [] : Array.isArray(v) ? v : [v]);
  const visitEls = (els: Array<TuxMapLevelElement | TuxMapLevelRef> | undefined, pid?: string, depth = 0) => {
    if (!els || depth >= MAX_TREE_DEPTH) return;
    els.forEach((e, idx) => {
      const id = e.id || (pid ? `${pid}/${idx}` : "");
      for (const h of normArr(e.deployed)) linkHost(id, h);
      if (e.children?.length) visitEls(e.children, id, depth + 1);
    });
  };
  visitEls(model?.level1?.elements);
  visitEls(model?.level2?.elements);
  for (const [pid, kids] of Object.entries(model?.level3 ?? {})) visitEls(kids, pid);
  for (const [pid, sg] of Object.entries(model?.subgraphs || {})) visitEls(sg?.elements, pid);
  for (const dn of model?.level4?.nodes ?? []) {
    linkHost(dn.id, dn.id);
    for (const h of dn.hosts || []) linkHost(h, dn.id);
    if (dn.children?.length) visitEls(dn.children, dn.id);
  }
  return { hostsByElement, elementsByHost };
}

interface BlastNodeMeta {
  kind?: string;
  path?: string;
  tech?: string;
}

function buildBlastNodeMeta(model?: TuxMapLevelModel): Map<string, BlastNodeMeta> {
  const meta = new Map<string, BlastNodeMeta>();
  if (!model) return meta;
  const visit = (els: Array<TuxMapLevelElement | TuxMapLevelRef> | undefined, pid?: string, fallbackKind?: string, depth = 0) => {
    if (!els || depth >= MAX_TREE_DEPTH) return;
    els.forEach((e, idx) => {
      if (e.ref && meta.has(e.id)) return;
      const id = e.id || (pid ? `${pid}/${idx}` : "");
      if (id && !meta.has(id)) {
        meta.set(id, { kind: e.kind || fallbackKind, path: e.source?.path, tech: e.tech });
      }
      if (e.children?.length) visit(e.children, id, "module", depth + 1);
    });
  };
  visit(model.level1?.elements, undefined, "system");
  visit(model.level2?.elements, model.level2?.boundary, "container");
  for (const [pid, kids] of Object.entries(model.level3 ?? {})) visit(kids, pid, "component");
  for (const dn of model.level4?.nodes ?? []) {
    if (dn.id && !meta.has(dn.id)) {
      meta.set(dn.id, { kind: dn.kind || "resource", path: dn.source?.path, tech: dn.facts?.type });
    }
    if (dn.children?.length) visit(dn.children, dn.id, "module");
  }
  for (const [pid, sg] of Object.entries(model.subgraphs || {})) visit(sg?.elements, pid, "module");
  return meta;
}

function repoPathForNodeId(id: string, meta?: BlastNodeMeta): string {
  if (meta?.path) return meta.path;
  if (id.startsWith("f:")) return id.slice(2);
  if (id.startsWith("s:")) return id.slice(2).split("#")[0] ?? "";
  return "";
}

function isPureDocNode(id: string, meta?: BlastNodeMeta): boolean {
  if (id.startsWith("s:") || meta?.kind === "symbol") return false;
  if (meta?.tech === "Markdown") return true;
  const p = repoPathForNodeId(id, meta).toLowerCase();
  return p.endsWith(".md") || p.endsWith(".mdx") || p.endsWith(".txt") || p.endsWith(".rst");
}

const AUX_NON_PROD_PATH_RE =
  /(?:^|\/)(?:tests?|__tests__|ci)\/|(?:^|\/)test_[^/]*$|\.(?:test|spec)\.[^/]+$|^(?:runner-smoke\/)?\.(?:forgejo|github)\/workflows\//i;

function isAuxNonProdSeed(id: string, meta?: BlastNodeMeta): boolean {
  const p = repoPathForNodeId(id, meta);
  if (!p && !id.startsWith("f:") && !id.startsWith("s:")) return false;
  if (isPureDocNode(id, meta)) return true;
  return AUX_NON_PROD_PATH_RE.test(p);
}

function isWorkflowPathNode(id: string, meta?: BlastNodeMeta): boolean {
  const p = repoPathForNodeId(id, meta);
  return /^(?:runner-smoke\/)?\.(?:forgejo|github)\/workflows\//i.test(p);
}

/**
 * The blast radius of changing `seedOrSeeds`: every element that depends on them or on anything
 * inside them, upstream through `links`.
 *
 * - Spreading links propagate breadth-first up to `maxHops` (default 32).
 * - Stopping links (`tests`, `checks`, `stamps`, whole-file non-root imports) go one step from
 *   everything reached and no further; when `quietSeedOnly` is true (default), `mentions` are
 *   followed only directly from `seeds` (`hop === 0`).
 * - Ties at the same minimum hop break deterministically by `TUX_MAP_LINK_STRENGTH_ORDER`, then
 *   codepoint order on `(from, to, at)`.
 * - Never walks up into a seed's parent container or parent file.
 */
export function computeLinkBlastRadius(
  links: TuxMapLink[],
  seedOrSeeds: string | Iterable<string>,
  parentOf: Map<string, string>,
  opts: TuxMapBlastOptions = {},
): TuxMapBlastResult {
  const rawMaxHops = opts.maxHops === undefined ? 32 : opts.maxHops;
  const maxHops = Number.isFinite(rawMaxHops) ? Math.max(0, Math.floor(rawMaxHops)) : 32;
  const quietSeedOnly = opts.quietSeedOnly ?? true;
  const intent: TuxMapBlastIntent = opts.intent ?? "default";
  const kindsSet: ReadonlySet<string> | null = opts.kinds
    ? opts.kinds instanceof Set
      ? opts.kinds
      : new Set(opts.kinds)
    : null;

  const kidsOf = new Map<string, string[]>();
  for (const [c, p] of parentOf) {
    const k = kidsOf.get(p) ?? [];
    k.push(c);
    kidsOf.set(p, k);
  }

  const rawSeeds = typeof seedOrSeeds === "string" ? [seedOrSeeds] : [...seedOrSeeds];
  const seeds = new Set<string>();
  const dq: string[] = [];
  const addSeed = (id: string) => {
    if (id && !seeds.has(id)) {
      seeds.add(id);
      dq.push(id);
    }
  };
  for (const s of rawSeeds) addSeed(s);

  const hostBridge = opts.model ? buildHostBridge(opts.model) : null;
  const metaById = buildBlastNodeMeta(opts.model);
  if (opts.model) {
    // Expand Level 1 primary boundary seed into its Level 2 containers
    if (opts.model.level2?.boundary && seeds.has(opts.model.level2.boundary)) {
      for (const e of opts.model.level2.elements ?? []) {
        if (!e.ref) addSeed(e.id);
      }
    }
    // Expand Level 4 host/resource seeds into the containers/components hosted on or deployed to them
    const l4NodeIds = new Set((opts.model.level4?.nodes ?? []).map((n) => n.id));
    for (const s of [...seeds]) {
      const hosted = hostBridge?.elementsByHost.get(s);
      if (hosted && l4NodeIds.has(s)) {
        for (const elId of hosted) addSeed(elId);
      }
    }
  }

  while (dq.length) {
    for (const c of kidsOf.get(dq.shift()!) ?? []) {
      addSeed(c);
    }
  }

  const into = new Map<string, TuxMapLink[]>();
  const outByFrom = new Map<string, TuxMapLink[]>();
  for (const l of links) {
    if (!l?.from || !l?.to) continue;
    let arr = into.get(l.to);
    if (!arr) {
      arr = [];
      into.set(l.to, arr);
    }
    arr.push(l);

    if (l.from !== l.to) {
      let outArr = outByFrom.get(l.from);
      if (!outArr) {
        outArr = [];
        outByFrom.set(l.from, outArr);
      }
      outArr.push(l);
    }
  }

  let truncated = false;
  const spreadDist = new Map<string, number>();
  const spreadVia = new Map<string, TuxMapLink>();
  let frontier = [...seeds].sort(cmpCodepoint);
  const q: [string, number][] = frontier.map((id) => [id, 0]);
  let hop = 0;

  // Pass 1: level-synchronous breadth-first traversal across links that spread
  while (frontier.length > 0) {
    if (hop >= maxHops) {
      for (const x of frontier) {
        for (const l of into.get(x) ?? []) {
          const y = l.from;
          if (seeds.has(y) || spreadDist.has(y)) continue;
          if (classifyBlastLink(l, hop, intent, quietSeedOnly, kindsSet) === "spread") {
            truncated = true;
            break;
          }
        }
        if (truncated) break;
      }
      break;
    }

    const nextBest = new Map<string, TuxMapLink>();
    for (const x of frontier) {
      for (const l of into.get(x) ?? []) {
        const y = l.from;
        if (seeds.has(y) || spreadDist.has(y)) continue;
        if (classifyBlastLink(l, hop, intent, quietSeedOnly, kindsSet) !== "spread") continue;
        const prev = nextBest.get(y);
        if (!prev || compareBlastLinks(l, prev) < 0) {
          nextBest.set(y, l);
        }
      }
    }

    const nextIds = [...nextBest.keys()].sort(cmpCodepoint);
    for (const y of nextIds) {
      const chosen = nextBest.get(y)!;
      spreadDist.set(y, hop + 1);
      spreadVia.set(y, chosen);
      q.push([y, hop + 1]);
    }
    frontier = nextIds;
    hop += 1;
  }

  // Pass 2: one step out through stopping links from everything reached, nearest then strongest first
  const stopBest = new Map<string, { hop: number; via: TuxMapLink }>();
  for (const [x, h] of q) {
    if (h >= maxHops) {
      for (const l of into.get(x) ?? []) {
        const y = l.from;
        if (seeds.has(y) || spreadDist.has(y) || stopBest.has(y)) continue;
        if (classifyBlastLink(l, h, intent, quietSeedOnly, kindsSet) === "stop") {
          truncated = true;
          break;
        }
      }
      continue;
    }
    for (const l of into.get(x) ?? []) {
      const y = l.from;
      if (seeds.has(y) || spreadDist.has(y)) continue;
      if (classifyBlastLink(l, h, intent, quietSeedOnly, kindsSet) !== "stop") continue;
      const candHop = h + 1;
      const prev = stopBest.get(y);
      if (
        !prev ||
        candHop < prev.hop ||
        (candHop === prev.hop && compareBlastLinks(l, prev.via) < 0)
      ) {
        stopBest.set(y, { hop: candHop, via: l });
      }
    }
  }

  const combined: Array<[string, TuxMapBlastHit]> = [];
  const mkHit = (h: number, via: TuxMapLink): TuxMapBlastHit => ({
    hop: h,
    via,
    ...(via.at !== undefined ? { at: via.at } : {}),
    ...(via.sites?.length ? { sites: [...via.sites] } : {}),
  });

  for (const [y, h] of spreadDist) {
    combined.push([y, mkHit(h, spreadVia.get(y)!)]);
  }
  for (const [y, s] of stopBest) {
    combined.push([y, mkHit(s.hop, s.via)]);
  }
  combined.sort((a, b) => a[1].hop - b[1].hop || cmpCodepoint(a[0], b[0]));

  const hits = new Map<string, TuxMapBlastHit>(combined);

  const collectSubtree = (rootId: string): Set<string> => {
    const sub = new Set<string>([rootId]);
    const queue: Array<[string, number]> = [[rootId, 0]];
    for (let qi = 0; qi < queue.length; qi++) {
      const [cur, d] = queue[qi]!;
      if (d >= MAX_TREE_DEPTH) continue;
      for (const ch of kidsOf.get(cur) ?? []) {
        if (!sub.has(ch)) {
          sub.add(ch);
          queue.push([ch, d + 1]);
        }
      }
    }
    return sub;
  };

  const canCoCut = (y: string): boolean => {
    if (seeds.has(y) || y.startsWith("d:")) return false;
    const yMeta = metaById.get(y);
    if (yMeta?.kind && NON_AUX_CO_CUT_KINDS.has(yMeta.kind)) return false;
    if (isWorkflowPathNode(y, yMeta)) return false;

    const subtree = collectSubtree(y);
    let hasSeedTarget = false;
    let hasNonProseAuxLink = false;

    for (const u of subtree) {
      const uMeta = metaById.get(u);
      if (uMeta?.kind && NON_AUX_CO_CUT_KINDS.has(uMeta.kind)) return false;
      if (isWorkflowPathNode(u, uMeta)) return false;

      // Zero external dependents outside seeds ∪ subtree(y)
      for (const il of into.get(u) ?? []) {
        if (!seeds.has(il.from) && !subtree.has(il.from)) return false;
      }

      // Closed outgoing targets inside seeds ∪ subtree(y), auxiliary roles only on seed links
      for (const ol of outByFrom.get(u) ?? []) {
        if (subtree.has(ol.to)) continue;
        if (!seeds.has(ol.to)) return false;
        hasSeedTarget = true;
        const ok = ol.kind || "";
        if (ok === "checks") return false;
        const oc = inferLinkCoupling(ol);
        if (oc !== "verification" && oc !== "prose") return false;
        if (oc !== "prose") hasNonProseAuxLink = true;
      }
    }

    if (!hasSeedTarget) return false;
    if (!hasNonProseAuxLink && !isPureDocNode(y, yMeta)) return false;
    return true;
  };

  const blockers: string[] = [];
  const coCutCandidates: string[] = [];
  const testsToRun: string[] = [];
  const stampsToRebuild: string[] = [];
  const buildExecImpacted: string[] = [];

  for (const [y, hit] of hits) {
    const c = inferLinkCoupling(hit.via);
    const p = inferLinkPhase(hit.via);
    const k = hit.via.kind || "";

    if (hit.hop === 1 && (c === "contract" || c === "runtime" || c === "type-only")) {
      blockers.push(y);
    }
    if (c === "verification" || k === "tests" || k === "checks") {
      testsToRun.push(y);
    }
    if (c === "artifact-stamp" || k === "stamps") {
      stampsToRebuild.push(y);
    }
    if (c === "build-exec" || p === "build-exec") {
      buildExecImpacted.push(y);
    }
    if (intent === "cut" && canCoCut(y)) {
      coCutCandidates.push(y);
    }
  }

  blockers.sort(cmpCodepoint);
  coCutCandidates.sort(cmpCodepoint);
  testsToRun.sort(cmpCodepoint);
  stampsToRebuild.sort(cmpCodepoint);
  buildExecImpacted.sort(cmpCodepoint);

  const hostsSet = new Set<string>();
  if (hostBridge) {
    const liftHost = (id: string) => {
      for (const anc of mapAncestorsOf(id, parentOf)) {
        const hs = hostBridge.hostsByElement.get(anc);
        if (hs) {
          for (const h of hs) hostsSet.add(h);
        }
      }
    };
    for (const s of seeds) {
      if (!isAuxNonProdSeed(s, metaById.get(s))) liftHost(s);
    }
    for (const [y, hit] of hits) {
      const p = inferLinkPhase(hit.via);
      const c = inferLinkCoupling(hit.via);
      if (p === "prod-runtime" && !NON_PROD_HOST_COUPLINGS.has(c)) {
        liftHost(y);
      }
    }
  }
  const hostsImpacted = [...hostsSet].sort(cmpCodepoint);

  return {
    seeds,
    hits,
    truncated,
    blockers,
    coCutCandidates,
    testsToRun,
    stampsToRebuild,
    buildExecImpacted,
    hostsImpacted,
  };
}

export type TuxMapElementChangeKind =
  | "added"
  | "deleted"
  | "moved"
  | "sig-changed"
  | "body-patched";

export interface TuxMapNodeDelta {
  id: string;
  /** Previous node ID when `change === "moved"` resulted from a file or symbol rename across IDs */
  previousId?: string;
  change: TuxMapElementChangeKind;
  kind: string;
  name: string;
  baseParentId?: string;
  headParentId?: string;
  source?: TuxMapSourceRef;
}

export interface TuxMapWireDelta {
  from: string;
  to: string;
  kind: string;
  change: "added" | "removed" | "dangling";
  at?: string;
}

export interface TuxMapGraphDeltaOptions {
  /** Whether to allocate and annotate `mergedModel` (default `true`; pass `false` for lean CLI/MCP payloads). */
  includeMergedModel?: boolean;
}

export interface TuxMapGraphDelta {
  nodeChanges: TuxMapNodeDelta[];
  addedIds: string[];
  deletedIds: string[];
  movedIds: string[];
  sigChangedIds: string[];
  bodyPatchedIds: string[];
  addedWires: TuxMapWireDelta[];
  removedWires: TuxMapWireDelta[];
  /** Wires in `headModel` whose `to` target is missing from `headModel` (e.g. deleted from `baseModel`). */
  danglingWires: TuxMapWireDelta[];
  /** Leaf-minimal changed IDs for blast-radius seeding (avoids over-seeding a file when only child symbols changed). */
  blastSeedIds: string[];
  /** Recommended blast intent inferred from the structural delta. */
  recommendedIntent: TuxMapBlastIntent;
  /** `headModel` annotated with `diff` badges and ghosted `deleted` elements re-inserted under their `base` parents. */
  mergedModel: TuxMapLevelModel;
}

type DeltaElementOrigin = "level1" | "level2" | "level3" | "level4" | "subgraph" | "inline";

interface IndexedDeltaElement {
  id: string;
  origin: DeltaElementOrigin;
  kind: string;
  name: string;
  tech?: string;
  desc?: string;
  parentId?: string;
  logicalParentId?: string;
  source?: TuxMapSourceRef;
  diff?: TuxMapDiffInfo;
  rawElement?: TuxMapLevelElement;
  rawNode?: TuxMapDeploymentNode;
}

function stripLineSuffix(tech?: string): string {
  if (!tech) return "";
  return tech.replace(/\s*·\s*L\d+(?:[–-]\d+)?(?![0-9A-Za-z_])/g, "").trim();
}

function logicalParentOf(id: string, parentOf: Map<string, string>): string | undefined {
  let p = parentOf.get(id);
  const seen = new Set<string>([id]);
  while (p && p.startsWith("d:")) {
    if (seen.has(p) || seen.size >= MAX_TREE_DEPTH) return undefined;
    seen.add(p);
    p = parentOf.get(p);
  }
  return p;
}

function indexModelForDelta(
  model: TuxMapLevelModel,
  bridgeUncovered = true,
): {
  elements: Map<string, IndexedDeltaElement>;
  parentOf: Map<string, string>;
  outWireKeys: Map<string, Set<string>>;
  validTargetIds: Set<string>;
  inlineParentIds: Set<string>;
  links: TuxMapLink[];
} {
  const parentOf = buildMapParentIndex(model);
  const elements = new Map<string, IndexedDeltaElement>();
  const validTargetIds = new Set<string>(parentOf.keys());
  for (const p of parentOf.values()) if (p) validTargetIds.add(p);
  const inlineParentIds = new Set<string>();

  const addEl = (
    e: TuxMapLevelElement,
    origin: DeltaElementOrigin,
    fallbackKind: string,
    pid?: string,
    depth = 0,
  ) => {
    if (depth >= MAX_TREE_DEPTH) return;
    const id = e.id;
    if (id) validTargetIds.add(id);
    if (!id || id.startsWith("d:") || elements.has(id)) return;
    elements.set(id, {
      id,
      origin,
      kind: e.kind || fallbackKind,
      name: e.name ?? id,
      tech: e.tech,
      desc: e.desc,
      parentId: parentOf.get(id) ?? pid,
      logicalParentId: logicalParentOf(id, parentOf) ?? pid,
      source: e.source,
      diff: e.diff,
      rawElement: e,
    });
    if (e.children?.length) {
      inlineParentIds.add(id);
      e.children.forEach((k, idx) =>
        addEl({ ...k, id: k.id || `${id}/${idx}` }, "inline", "component", id, depth + 1),
      );
    }
  };

  for (const e of model?.level1?.elements ?? []) addEl(e, "level1", "system");
  if (model?.level2?.boundary) validTargetIds.add(model.level2.boundary);
  for (const e of model?.level2?.elements ?? []) {
    if (e.id) validTargetIds.add(e.id);
    if (e.ref) continue;
    addEl({ ...e, name: e.name ?? e.id }, "level2", "container", model?.level2?.boundary);
  }
  for (const [cid, kids] of Object.entries(model?.level3 ?? {})) {
    if (cid) validTargetIds.add(cid);
    (kids ?? []).forEach((k, idx) =>
      addEl({ ...k, id: k.id || `${cid}/${idx}` }, "level3", "component", cid),
    );
  }
  for (const dn of model?.level4?.nodes ?? []) {
    if (dn.id) validTargetIds.add(dn.id);
    if (dn.id && !elements.has(dn.id)) {
      elements.set(dn.id, {
        id: dn.id,
        origin: "level4",
        kind: dn.kind || "resource",
        name: dn.title,
        tech: dn.facts?.type || dn.facts?.sku || dn.facts?.size,
        desc: dn.role,
        parentId: dn.group || dn.zone,
        logicalParentId: dn.group || dn.zone,
        source: dn.source,
        diff: dn.diff,
        rawNode: dn,
      });
    }
    if (dn.children?.length) {
      inlineParentIds.add(dn.id);
      dn.children.forEach((k, idx) =>
        addEl({ ...k, id: k.id || `${dn.id}/${idx}` }, "inline", "module", dn.id, 1),
      );
    }
  }
  for (const [pid, sg] of Object.entries(model?.subgraphs || {})) {
    if (pid) validTargetIds.add(pid);
    (sg?.elements ?? []).forEach((k, idx) =>
      addEl({ ...k, id: k.id || `${pid}/${idx}` }, "subgraph", "module", pid),
    );
  }

  const links = extractModelLinks(model, { bridgeUncovered });
  const outWireKeys = new Map<string, Set<string>>();
  for (const l of links) {
    const key = `${l.kind || "uses"}\u0000${l.to}`;
    let set = outWireKeys.get(l.from);
    if (!set) {
      set = new Set();
      outWireKeys.set(l.from, set);
    }
    set.add(key);
  }
  return { elements, parentOf, outWireKeys, validTargetIds, inlineParentIds, links };
}

function sameSet(a?: Set<string>, b?: Set<string>): boolean {
  const sa = a?.size ?? 0;
  const sb = b?.size ?? 0;
  if (sa !== sb) return false;
  if (!a || !b) return true;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/**
 * Computes a deterministic structural delta between two `TuxMapLevelModel` trees (`baseModel` vs `headModel`),
 * classifying node changes (`added`, `deleted`, `moved`, `sig-changed`, `body-patched`), wire changes
 * (`added`, `removed`, `dangling`), leaf-first `blastSeedIds`, `recommendedIntent`, and a visual `mergedModel`.
 */
export function computeGraphDelta(
  baseModel: TuxMapLevelModel,
  headModel: TuxMapLevelModel,
  opts: TuxMapGraphDeltaOptions = {},
): TuxMapGraphDelta {
  const includeMergedModel = opts.includeMergedModel ?? true;
  const bothCodeOrNeither = Boolean(baseModel?.links?.length || headModel?.links?.length);
  const baseIdx = indexModelForDelta(baseModel, !bothCodeOrNeither);
  const headIdx = indexModelForDelta(headModel, !bothCodeOrNeither);

  const allIds = [...new Set([...baseIdx.elements.keys(), ...headIdx.elements.keys()])].sort(cmpCodepoint);
  const nodeChanges: TuxMapNodeDelta[] = [];
  const rawAddedIds: string[] = [];
  const rawDeletedIds: string[] = [];
  const movedIds: string[] = [];
  const sigChangedIds: string[] = [];
  const bodyPatchedIds: string[] = [];

  const sigOf = (el: IndexedDeltaElement): string =>
    el.source?.signature ?? el.source?.symbol ?? (stripLineSuffix(el.tech) || el.name);
  const spanOf = (el: IndexedDeltaElement): number | null =>
    el.source?.lineRange && el.source.lineRange.length >= 2
      ? el.source.lineRange[1]! - el.source.lineRange[0]!
      : null;

  for (const id of allIds) {
    const b = baseIdx.elements.get(id);
    const h = headIdx.elements.get(id);
    if (!b && h) {
      rawAddedIds.push(id);
    } else if (b && !h) {
      rawDeletedIds.push(id);
    } else if (b && h) {
      if ((b.logicalParentId ?? "") !== (h.logicalParentId ?? "")) {
        movedIds.push(id);
        nodeChanges.push({
          id,
          change: "moved",
          kind: h.kind,
          name: h.name,
          baseParentId: b.logicalParentId,
          headParentId: h.logicalParentId,
          source: h.source,
        });
        continue;
      }
      if (b.kind !== h.kind || sigOf(b) !== sigOf(h)) {
        sigChangedIds.push(id);
        nodeChanges.push({
          id,
          change: "sig-changed",
          kind: h.kind,
          name: h.name,
          baseParentId: b.logicalParentId,
          headParentId: h.logicalParentId,
          source: h.source,
        });
        continue;
      }
      const wiresChanged = !sameSet(baseIdx.outWireKeys.get(id), headIdx.outWireKeys.get(id));
      const hasBothHashes = Boolean(b.source?.hash && h.source?.hash);
      const hasBothModHashes = Boolean(b.source?.moduleHash && h.source?.moduleHash);
      const bodyChanged = hasBothHashes
        ? b.source!.hash !== h.source!.hash ||
          (hasBothModHashes && b.source!.moduleHash !== h.source!.moduleHash) ||
          wiresChanged
        : Boolean(h.diff) ||
          spanOf(b) !== spanOf(h) ||
          (b.desc ?? "") !== (h.desc ?? "") ||
          wiresChanged;
      if (bodyChanged) {
        bodyPatchedIds.push(id);
        nodeChanges.push({
          id,
          change: "body-patched",
          kind: h.kind,
          name: h.name,
          baseParentId: b.logicalParentId,
          headParentId: h.logicalParentId,
          source: h.source,
        });
      }
    }
  }

  // 1-pass deterministic rename pairing (`git mv` & cross-file symbol moves)
  const pairedDeleted = new Set<string>();
  const pairedAdded = new Set<string>();
  const pairRename = (delId: string, addId: string) => {
    const b = baseIdx.elements.get(delId)!;
    const h = headIdx.elements.get(addId)!;
    pairedDeleted.add(delId);
    pairedAdded.add(addId);
    movedIds.push(addId);
    nodeChanges.push({
      id: addId,
      previousId: delId,
      change: "moved",
      kind: h.kind,
      name: h.name,
      baseParentId: b.logicalParentId,
      headParentId: h.logicalParentId,
      source: h.source,
    });
  };

  // Pass A: unique 1:1 `(kind, source.hash)` exact content match
  const delByHash = new Map<string, string[]>();
  const addByHash = new Map<string, string[]>();
  for (const delId of rawDeletedIds) {
    const b = baseIdx.elements.get(delId)!;
    if (b.source?.hash) {
      const k = `${b.kind}\u0000${b.source.hash}`;
      const arr = delByHash.get(k) ?? [];
      arr.push(delId);
      delByHash.set(k, arr);
    }
  }
  for (const addId of rawAddedIds) {
    const h = headIdx.elements.get(addId)!;
    if (h.source?.hash) {
      const k = `${h.kind}\u0000${h.source.hash}`;
      const arr = addByHash.get(k) ?? [];
      arr.push(addId);
      addByHash.set(k, arr);
    }
  }
  for (const [k, dList] of delByHash) {
    const aList = addByHash.get(k);
    if (dList.length === 1 && aList?.length === 1) {
      pairRename(dList[0]!, aList[0]!);
    }
  }

  // Pass B: unique 1:1 `(kind, name, sigOf)` match among remaining unmatched
  const delBySig = new Map<string, string[]>();
  const addBySig = new Map<string, string[]>();
  for (const delId of rawDeletedIds) {
    if (pairedDeleted.has(delId)) continue;
    const b = baseIdx.elements.get(delId)!;
    if (b.name) {
      const k = `${b.kind}\u0000${b.name}\u0000${sigOf(b)}`;
      const arr = delBySig.get(k) ?? [];
      arr.push(delId);
      delBySig.set(k, arr);
    }
  }
  for (const addId of rawAddedIds) {
    if (pairedAdded.has(addId)) continue;
    const h = headIdx.elements.get(addId)!;
    if (h.name) {
      const k = `${h.kind}\u0000${h.name}\u0000${sigOf(h)}`;
      const arr = addBySig.get(k) ?? [];
      arr.push(addId);
      addBySig.set(k, arr);
    }
  }
  for (const [k, dList] of delBySig) {
    const aList = addBySig.get(k);
    if (dList.length === 1 && aList?.length === 1) {
      pairRename(dList[0]!, aList[0]!);
    }
  }

  const addedIds: string[] = [];
  for (const addId of rawAddedIds) {
    if (pairedAdded.has(addId)) continue;
    const h = headIdx.elements.get(addId)!;
    addedIds.push(addId);
    nodeChanges.push({
      id: addId,
      change: "added",
      kind: h.kind,
      name: h.name,
      headParentId: h.logicalParentId,
      source: h.source,
    });
  }
  const deletedIds: string[] = [];
  for (const delId of rawDeletedIds) {
    if (pairedDeleted.has(delId)) continue;
    const b = baseIdx.elements.get(delId)!;
    deletedIds.push(delId);
    nodeChanges.push({
      id: delId,
      change: "deleted",
      kind: b.kind,
      name: b.name,
      baseParentId: b.logicalParentId,
      source: b.source,
    });
  }

  movedIds.sort(cmpCodepoint);
  nodeChanges.sort((a, b) => cmpCodepoint(a.id, b.id));

  const baseLinks = baseIdx.links;
  const headLinks = headIdx.links;
  const wireKey = (l: TuxMapLink) => `${l.kind || "uses"}\u0000${l.from}\u0000${l.to}`;
  const baseWireMap = new Map<string, TuxMapLink>();
  for (const l of baseLinks) if (!baseWireMap.has(wireKey(l))) baseWireMap.set(wireKey(l), l);
  const headWireMap = new Map<string, TuxMapLink>();
  for (const l of headLinks) if (!headWireMap.has(wireKey(l))) headWireMap.set(wireKey(l), l);

  const addedWires: TuxMapWireDelta[] = [];
  const removedWires: TuxMapWireDelta[] = [];
  const danglingWires: TuxMapWireDelta[] = [];

  for (const [k, l] of [...headWireMap.entries()].sort((a, b) => cmpCodepoint(a[0], b[0]))) {
    const kind = l.kind || "uses";
    if (!baseWireMap.has(k)) {
      addedWires.push({
        from: l.from,
        to: l.to,
        kind,
        change: "added",
        ...(l.at ? { at: l.at } : {}),
      });
    }
    if (!headIdx.validTargetIds.has(l.to)) {
      danglingWires.push({
        from: l.from,
        to: l.to,
        kind,
        change: "dangling",
        ...(l.at ? { at: l.at } : {}),
      });
    }
  }
  for (const [k, l] of [...baseWireMap.entries()].sort((a, b) => cmpCodepoint(a[0], b[0]))) {
    if (!headWireMap.has(k)) {
      removedWires.push({
        from: l.from,
        to: l.to,
        kind: l.kind || "uses",
        change: "removed",
        ...(l.at ? { at: l.at } : {}),
      });
    }
  }

  // Leaf-minimal blast seeds: if a file is only "body-patched" because a child symbol changed,
  // and neither its own `moduleHash` nor its file-level outgoing links changed, seed only the changed child symbol(s).
  const changeById = new Map(nodeChanges.map((c) => [c.id, c]));
  const changedAncestorsWithChangedChild = new Set<string>();
  for (const c of nodeChanges) {
    const pMap = c.change === "deleted" ? baseIdx.parentOf : headIdx.parentOf;
    for (const anc of mapAncestorsOf(c.id, pMap).slice(1)) {
      if (changeById.has(anc)) changedAncestorsWithChangedChild.add(anc);
    }
  }
  const seedIdSet = new Set<string>();
  for (const c of nodeChanges) {
    let keep = true;
    if (changedAncestorsWithChangedChild.has(c.id) && c.change === "body-patched") {
      const b = baseIdx.elements.get(c.id);
      const h = headIdx.elements.get(c.id);
      const wiresChanged = !sameSet(baseIdx.outWireKeys.get(c.id), headIdx.outWireKeys.get(c.id));
      const modHashChanged =
        Boolean(b?.source?.moduleHash !== undefined && h?.source?.moduleHash !== undefined) &&
        b!.source!.moduleHash !== h!.source!.moduleHash;
      keep = wiresChanged || modHashChanged;
    }
    if (keep) {
      seedIdSet.add(c.id);
      if (c.previousId) seedIdSet.add(c.previousId);
    }
  }
  const blastSeedIds = [...seedIdSet].sort(cmpCodepoint);

  const recommendedIntent: TuxMapBlastIntent =
    deletedIds.length > 0
      ? "cut"
      : movedIds.length > 0 || sigChangedIds.length > 0 || addedIds.length > 0
        ? "refactor"
        : "patch";

  if (!includeMergedModel) {
    return {
      nodeChanges,
      addedIds,
      deletedIds,
      movedIds,
      sigChangedIds,
      bodyPatchedIds,
      addedWires,
      removedWires,
      danglingWires,
      blastSeedIds,
      recommendedIntent,
      mergedModel: headModel,
    };
  }

  // Build visual mergedModel with diff badges + origin-preserving ghosted deleted elements
  const diffForId = (id: string): TuxMapDiffInfo | undefined => {
    const chObj = changeById.get(id);
    if (!chObj) return undefined;
    const ch = chObj.change;
    if (ch === "added") return { changeType: "added", summary: "Added on branch" };
    if (ch === "deleted") return { changeType: "deleted", summary: "Deleted on branch" };
    return {
      changeType: "modified",
      summary:
        ch === "moved"
          ? chObj.previousId
            ? `Moved from ${chObj.previousId}`
            : "Moved component/parent"
          : ch === "sig-changed"
            ? "Signature changed"
            : "Body patched",
    };
  };

  const deletedDiff: TuxMapDiffInfo = { changeType: "deleted", summary: "Deleted on branch" };
  const deletedInlineByParent = new Map<string, TuxMapLevelElement[]>();
  const deletedL1Ghosts: TuxMapLevelElement[] = [];
  const deletedL2Ghosts: TuxMapLevelElement[] = [];
  const deletedL4Ghosts: TuxMapDeploymentNode[] = [];
  const deletedSubgraphOrL3: IndexedDeltaElement[] = [];

  for (const delId of deletedIds) {
    const bEl = baseIdx.elements.get(delId);
    if (!bEl) continue;
    if (bEl.origin === "level4") {
      if (bEl.rawNode) deletedL4Ghosts.push({ ...bEl.rawNode, diff: deletedDiff });
    } else if (bEl.origin === "level1") {
      if (bEl.rawElement) deletedL1Ghosts.push({ ...bEl.rawElement, diff: deletedDiff });
    } else if (bEl.origin === "level2") {
      if (bEl.rawElement) deletedL2Ghosts.push({ ...bEl.rawElement, diff: deletedDiff });
    } else if (bEl.origin === "inline") {
      if (bEl.rawElement && bEl.parentId) {
        const arr = deletedInlineByParent.get(bEl.parentId) ?? [];
        arr.push({ ...bEl.rawElement, diff: deletedDiff });
        deletedInlineByParent.set(bEl.parentId, arr);
      }
    } else {
      deletedSubgraphOrL3.push(bEl);
    }
  }

  const annotateEl = <T extends TuxMapLevelElement | TuxMapLevelRef>(
    e: T,
    pid?: string,
    idx?: number,
    depth = 0,
  ): T => {
    if (depth >= MAX_TREE_DEPTH) return e;
    const id = e.id || (pid && idx !== undefined ? `${pid}/${idx}` : "");
    const d = id ? diffForId(id) : undefined;
    const baseKids = e.children?.map((k, ki) => annotateEl(k, id, ki, depth + 1));
    const inlineGhosts = id ? deletedInlineByParent.get(id) : undefined;
    const kids = baseKids || inlineGhosts ? [...(baseKids ?? []), ...(inlineGhosts ?? [])] : undefined;
    if (!d && !kids) return e;
    return {
      ...e,
      ...(d ? { diff: e.diff ?? d } : {}),
      ...(kids ? { children: kids } : {}),
    };
  };

  const mergedLevel3: Record<string, TuxMapLevelElement[]> = {};
  for (const [cid, kids] of Object.entries(headModel?.level3 ?? {})) {
    setOwnProp(
      mergedLevel3,
      cid,
      (kids ?? []).map((k, idx) => annotateEl(k, cid, idx)),
    );
  }
  const mergedSubgraphs: Record<string, TuxMapSubgraph> = {};
  for (const [pid, sg] of Object.entries(headModel?.subgraphs || {})) {
    setOwnProp(mergedSubgraphs, pid, {
      ...sg,
      elements: (sg?.elements ?? []).map((k, idx) => annotateEl(k, pid, idx)),
    });
  }

  const headL2ContainerIds = new Set(
    (headModel?.level2?.elements ?? []).filter((e) => !e.ref).map((e) => e.id),
  );

  for (const bEl of deletedSubgraphOrL3) {
    if (!bEl.rawElement || !bEl.parentId) continue;
    const ghost: TuxMapLevelElement = {
      ...bEl.rawElement,
      diff: deletedDiff,
    };
    const pid = bEl.parentId;
    const logPid = bEl.logicalParentId;
    if (bEl.origin === "level3") {
      if (hasOwn(mergedLevel3, pid)) {
        mergedLevel3[pid]!.push(ghost);
      } else if (headL2ContainerIds.has(pid)) {
        setOwnProp(mergedLevel3, pid, [ghost]);
      }
      continue;
    }
    if (hasOwn(mergedSubgraphs, pid)) {
      mergedSubgraphs[pid]!.elements.push(ghost);
    } else if (pid.startsWith("d:") && logPid && hasOwn(mergedSubgraphs, logPid)) {
      mergedSubgraphs[logPid]!.elements.push(ghost);
    } else if (
      pid.startsWith("d:") &&
      logPid &&
      headIdx.validTargetIds.has(logPid) &&
      !headIdx.inlineParentIds.has(logPid) &&
      logPid !== headModel?.level2?.boundary
    ) {
      setOwnProp(mergedSubgraphs, logPid, { elements: [ghost] });
    } else if (
      !pid.startsWith("d:") &&
      headIdx.validTargetIds.has(pid) &&
      !headIdx.inlineParentIds.has(pid) &&
      pid !== headModel?.level2?.boundary
    ) {
      setOwnProp(mergedSubgraphs, pid, { elements: [ghost] });
    }
  }

  const mergedLevel4Nodes: TuxMapDeploymentNode[] = [
    ...(headModel?.level4?.nodes ?? []).map((n) => {
      const d = diffForId(n.id);
      const baseKids = n.children?.map((k, ki) => annotateEl(k, n.id, ki));
      const inlineGhosts = deletedInlineByParent.get(n.id);
      const kids = baseKids || inlineGhosts ? [...(baseKids ?? []), ...(inlineGhosts ?? [])] : undefined;
      if (!d && !kids) return n;
      return {
        ...n,
        ...(d ? { diff: n.diff ?? d } : {}),
        ...(kids ? { children: kids } : {}),
      };
    }),
    ...deletedL4Ghosts,
  ];

  const mergedModel: TuxMapLevelModel = {
    ...headModel,
    level1: {
      ...headModel?.level1,
      rels: headModel?.level1?.rels ?? [],
      elements: [
        ...(headModel?.level1?.elements ?? []).map((e) => annotateEl(e)),
        ...deletedL1Ghosts,
      ],
    },
    level2: {
      ...headModel?.level2,
      boundary: headModel?.level2?.boundary ?? "",
      rels: headModel?.level2?.rels ?? [],
      elements: [
        ...(headModel?.level2?.elements ?? []).map((e) => (e.ref ? e : annotateEl(e))),
        ...deletedL2Ghosts,
      ],
    },
    level3: mergedLevel3,
    level4: {
      ...headModel?.level4,
      groups: headModel?.level4?.groups ?? [],
      links: headModel?.level4?.links ?? [],
      nodes: mergedLevel4Nodes,
    },
    ...(Object.keys(mergedSubgraphs).length > 0 || headModel?.subgraphs ? { subgraphs: mergedSubgraphs } : {}),
  };

  return {
    nodeChanges,
    addedIds,
    deletedIds,
    movedIds,
    sigChangedIds,
    bodyPatchedIds,
    addedWires,
    removedWires,
    danglingWires,
    blastSeedIds,
    recommendedIntent,
    mergedModel,
  };
}

// ============================================================================
// 8. MCP / ACP ARCHITECTURE GRAPH QUERY & SUBGRAPH LEASE ENGINE
//    (Deterministic spatial query, k-hop blast-radius, shortest path, and
//     ACP non-overlapping subgraph lease coordinator for multi-agent swarms)
// ============================================================================

export interface TuxMapGraphNodeRecord {
  id: string;
  level: number;
  kind: string;
  name: string;
  tech?: string;
  desc?: string;
  status?: string;
  parentId?: string;
  hosts?: string[];
  deployed?: string[];
  source?: TuxMapSourceRef;
  diff?: TuxMapDiffInfo;
  roadmap?: number[];
}

export interface TuxMapGraphEdgeRecord {
  id: string;
  from: string;
  to: string;
  label?: string;
  tech?: string;
  level: number;
  kind: "rel" | "deployment" | "parent-child" | "hosts";
  planned?: boolean;
}

export interface TuxMapAcpLease {
  leaseId: string;
  agentId: string;
  rootNodeId: string;
  scopeNodeIds: string[];
  lockedFiles: string[];
  acquiredAt: string;
  expiresAt: string;
}

export interface TuxMapQueryIndex {
  parentOf: Map<string, string>;
  kidsOf: Map<string, string[]>;
  nodes: Map<string, TuxMapGraphNodeRecord>;
  edges: TuxMapGraphEdgeRecord[];
  edgesByFrom: Map<string, TuxMapGraphEdgeRecord[]>;
  edgesByTo: Map<string, TuxMapGraphEdgeRecord[]>;
  neighborsByNode: Map<string, Array<{ next: string; edge: TuxMapGraphEdgeRecord }>>;
  effectiveLinks: TuxMapLink[];
}

interface CachedQueryIndex {
  stamp: string;
  index: TuxMapQueryIndex;
}

const MODEL_QUERY_INDEX_CACHE = new WeakMap<TuxMapLevelModel, CachedQueryIndex>();

function modelCacheStamp(model: TuxMapLevelModel): string {
  return [
    model?.level1?.elements?.length ?? 0,
    model?.level1?.rels?.length ?? 0,
    model?.level2?.elements?.length ?? 0,
    model?.level2?.rels?.length ?? 0,
    Object.keys(model?.level3 ?? {}).length,
    model?.level4?.nodes?.length ?? 0,
    model?.level4?.links?.length ?? 0,
    Object.keys(model?.subgraphs ?? {}).length,
    model?.links?.length ?? 0,
  ].join(":");
}

/**
 * Memoized `O(V + E)` query index per `TuxMapLevelModel` instance so repeated
 * layer, blast-radius, shortest-path, and lease queries do not rebuild graph tables.
 */
export function getMapQueryIndex(model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL): TuxMapQueryIndex {
  const stamp = modelCacheStamp(model);
  const cached = MODEL_QUERY_INDEX_CACHE.get(model);
  if (cached && cached.stamp === stamp) return cached.index;

  const parentOf = buildMapParentIndex(model);
  const kidsOf = new Map<string, string[]>();
  for (const [c, p] of parentOf) {
    let arr = kidsOf.get(p);
    if (!arr) {
      arr = [];
      kidsOf.set(p, arr);
    }
    arr.push(c);
  }

  const nodes = new Map<string, TuxMapGraphNodeRecord>();
  const edges: TuxMapGraphEdgeRecord[] = [];
  const normArr = (v?: string | string[]): string[] => (!v ? [] : Array.isArray(v) ? v : [v]);
  const subgraphOwners = new Map<string, string>();
  const noteSubgraphRef = (ownerId: string, ref?: string) => {
    if (ownerId && ref && ref !== ownerId && !subgraphOwners.has(ref)) {
      subgraphOwners.set(ref, ownerId);
    }
  };

  const addInlineChildren = (parentId: string, kids: TuxMapLevelElement[] | undefined, depth = 0) => {
    if (!kids || depth >= MAX_TREE_DEPTH) return;
    const rawLvl = levelForFocus(parentId, model, parentOf);
    const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
    kids.forEach((k, idx) => {
      const id = k.id || `${parentId}/${idx}`;
      noteSubgraphRef(id, k.subgraphRef);
      if (!nodes.has(id)) {
        nodes.set(id, {
          id,
          level: childLevel,
          kind: k.kind || "module",
          name: k.name,
          tech: k.tech,
          desc: k.desc,
          status: k.status,
          parentId,
          deployed: normArr(k.deployed),
          source: k.source,
          diff: k.diff,
          roadmap: k.roadmap,
        });
        edges.push({
          id: `pinl-${parentId}-${id}`,
          from: parentId,
          to: id,
          level: childLevel,
          kind: "parent-child",
        });
      }
      if (k.children?.length) addInlineChildren(id, k.children, depth + 1);
    });
  };

  // Level 1
  for (const e of model?.level1?.elements ?? []) {
    noteSubgraphRef(e.id, e.subgraphRef);
    if (!nodes.has(e.id)) {
      nodes.set(e.id, {
        id: e.id,
        level: 1,
        kind: e.kind || "system",
        name: e.name,
        tech: e.tech,
        desc: e.desc,
        status: e.status,
        source: e.source,
        diff: e.diff,
        roadmap: e.roadmap,
      });
    }
    if (e.children?.length) addInlineChildren(e.id, e.children);
  }
  (model?.level1?.rels ?? []).forEach((r, idx) => {
    edges.push({
      id: `l1-${idx}-${r.from}-${r.to}`,
      from: r.from,
      to: r.to,
      label: r.label,
      tech: r.tech,
      level: 1,
      kind: "rel",
      planned: r.status === "planned",
    });
  });

  // Level 2
  for (const e of model?.level2?.elements ?? []) {
    noteSubgraphRef(e.id, e.subgraphRef);
    if (e.ref && nodes.has(e.id)) continue;
    const deployed = normArr(e.deployed);
    if (!nodes.has(e.id)) {
      nodes.set(e.id, {
        id: e.id,
        level: 2,
        kind: e.kind || "container",
        // a reference whose Level 1 element is missing is still named
        name: e.name ?? e.id,
        tech: e.tech,
        desc: e.desc,
        status: e.status,
        parentId: model?.level2?.boundary,
        deployed,
        source: e.source,
        diff: e.diff,
        roadmap: e.roadmap,
      });
      if (model?.level2?.boundary) {
        edges.push({
          id: `p2-${model.level2.boundary}-${e.id}`,
          from: model.level2.boundary,
          to: e.id,
          level: 2,
          kind: "parent-child",
        });
      }
      for (const hid of deployed) {
        edges.push({
          id: `dep-${e.id}-${hid}`,
          from: e.id,
          to: hid,
          level: 4,
          kind: "hosts",
        });
      }
    }
    if (e.children?.length) addInlineChildren(e.id, e.children);
  }
  (model?.level2?.rels ?? []).forEach((r, idx) => {
    edges.push({
      id: `l2-${idx}-${r.from}-${r.to}`,
      from: r.from,
      to: r.to,
      label: r.label,
      tech: r.tech,
      level: 2,
      kind: "rel",
      planned: r.status === "planned",
    });
  });

  // Level 3
  for (const [parentId, kids] of Object.entries(model?.level3 ?? {})) {
    const lvl = levelForFocus(parentId, model, parentOf);
    (kids ?? []).forEach((k, idx) => {
      const id = k.id || `${parentId}/${idx}`;
      noteSubgraphRef(id, k.subgraphRef);
      const deployed = normArr(k.deployed);
      if (!nodes.has(id)) {
        nodes.set(id, {
          id,
          level: lvl,
          kind: k.kind || "component",
          name: k.name,
          tech: k.tech,
          desc: k.desc,
          status: k.status,
          parentId,
          deployed,
          source: k.source,
          diff: k.diff,
          roadmap: k.roadmap,
        });
        edges.push({
          id: `p3-${parentId}-${id}`,
          from: parentId,
          to: id,
          level: lvl,
          kind: "parent-child",
        });
      }
      if (k.next != null && kids[k.next]) {
        const nextId = kids[k.next]!.id || `${parentId}/${k.next}`;
        edges.push({
          id: `l3-next-${id}-${nextId}`,
          from: id,
          to: nextId,
          level: lvl,
          kind: "rel",
          planned: k.status === "planned",
        });
      }
      if (k.children?.length) addInlineChildren(id, k.children);
    });
  }

  // Level 4
  for (const n of model?.level4?.nodes ?? []) {
    noteSubgraphRef(n.id, n.subgraphRef);
    if (!nodes.has(n.id)) {
      nodes.set(n.id, {
        id: n.id,
        level: 4,
        kind: n.kind || "resource",
        name: n.title,
        tech: n.facts?.type || n.facts?.sku || n.facts?.size,
        desc: n.role,
        status: n.status,
        parentId: n.group || n.zone,
        hosts: n.hosts,
        source: n.source,
        diff: n.diff,
        roadmap: n.roadmap,
      });
    }
    if (n.children?.length) addInlineChildren(n.id, n.children);
  }
  (model?.level4?.links ?? []).forEach((l, idx) => {
    edges.push({
      id: `l4-${idx}-${l.from}-${l.to}`,
      from: l.from,
      to: l.to,
      label: l.label,
      tech: l.kind,
      level: 4,
      kind: "deployment",
      planned: l.state === "planned",
    });
  });

  // Level 5, 6, 7+ Subgraphs (level computed via parent walk so child-before-parent order gets exact depth)
  for (const [rawParentId, sg] of Object.entries(model?.subgraphs || {})) {
    const parentId = subgraphOwners.get(rawParentId) ?? rawParentId;
    const rawLvl = levelForFocus(parentId, model, parentOf);
    const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
    (sg?.elements ?? []).forEach((k, idx) => {
      const id = k.id || `${parentId}/${idx}`;
      noteSubgraphRef(id, k.subgraphRef);
      if (!nodes.has(id)) {
        nodes.set(id, {
          id,
          level: childLevel,
          kind: k.kind || "module",
          name: k.name,
          tech: k.tech,
          desc: k.desc,
          status: k.status,
          parentId,
          deployed: normArr(k.deployed),
          source: k.source,
          diff: k.diff,
          roadmap: k.roadmap,
        });
        edges.push({
          id: `psg-${parentId}-${id}`,
          from: parentId,
          to: id,
          level: childLevel,
          kind: "parent-child",
        });
      }
      if (k.children?.length) addInlineChildren(id, k.children);
    });
    (sg?.rels || []).forEach((r, idx) => {
      edges.push({
        id: `lsg-${parentId}-${idx}-${r.from}-${r.to}`,
        from: r.from,
        to: r.to,
        label: r.label,
        tech: r.tech,
        level: childLevel,
        kind: "rel",
        planned: r.status === "planned",
      });
    });
  }

  // Code links: the fine-grained dependencies, at the level of the part that depends
  (model?.links || []).forEach((l, idx) => {
    if (!nodes.has(l.from) || !nodes.has(l.to)) return;
    edges.push({
      id: `lnk-${idx}-${l.from}-${l.to}`,
      from: l.from,
      to: l.to,
      label: l.kind,
      tech: l.at,
      level: nodes.get(l.from)!.level,
      kind: "rel",
    });
  });

  const edgesByFrom = new Map<string, TuxMapGraphEdgeRecord[]>();
  const edgesByTo = new Map<string, TuxMapGraphEdgeRecord[]>();
  const neighborsByNode = new Map<string, Array<{ next: string; edge: TuxMapGraphEdgeRecord }>>();

  const pushMap = <T>(m: Map<string, T[]>, k: string, v: T) => {
    let arr = m.get(k);
    if (!arr) {
      arr = [];
      m.set(k, arr);
    }
    arr.push(v);
  };

  for (const e of edges) {
    pushMap(edgesByFrom, e.from, e);
    pushMap(edgesByTo, e.to, e);
    pushMap(neighborsByNode, e.from, { next: e.to, edge: e });
    pushMap(neighborsByNode, e.to, { next: e.from, edge: e });
  }

  const effectiveLinks = extractModelLinks(model);

  const idx: TuxMapQueryIndex = {
    parentOf,
    kidsOf,
    nodes,
    edges,
    edgesByFrom,
    edgesByTo,
    neighborsByNode,
    effectiveLinks,
  };
  MODEL_QUERY_INDEX_CACHE.set(model, { stamp, index: idx });
  return idx;
}

/**
 * Indexes a `TuxMapLevelModel` into a unified Code Property Graph (CPG) index
 * spanning Levels 1..N (Context, Containers, Components, Deployment, Modules, Schemas, AST Symbols).
 */
export function buildUnifiedArchitectureGraph(model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL): {
  nodes: Map<string, TuxMapGraphNodeRecord>;
  edges: TuxMapGraphEdgeRecord[];
} {
  const { nodes, edges } = getMapQueryIndex(model);
  return { nodes, edges };
}

export interface TuxMapUnknownNodeError {
  error: string;
  unknownIds: string[];
  suggestions: string[];
}

export interface TuxMapCompactNodeRecord {
  id: string;
  level: number;
  kind: string;
  name: string;
  tech?: string;
  status?: string;
  parentId?: string;
  source?: Pick<TuxMapSourceRef, "path" | "lineRange" | "symbol">;
}

export interface TuxMapNodeQueryOptions {
  level?: number;
  focusId?: string;
  kind?: string | readonly string[];
  query?: string;
  includePlanned?: boolean;
  includeEdges?: boolean;
  compact?: boolean;
  limit?: number;
  offset?: number;
}

export interface TuxMapCoarseParentStep {
  seedId: string;
  parentId: string;
  reason: string;
}

export interface TuxMapImpactHit {
  id: string;
  hop: number;
  kind?: string;
  at?: string;
  sites?: number[];
  stop?: boolean;
  coupling: TuxMapLinkCoupling;
  phase: TuxMapLinkPhase;
  name?: string;
  level?: number;
  coarseParentVia?: string;
  node?: TuxMapGraphNodeRecord;
}

export interface TuxMapImpactQueryOptions extends TuxMapBlastOptions {
  /** Include directed downstream dependencies (default: `false`). */
  includeDownstream?: boolean;
  /** Bridge C4/Level-4 relationships for endpoints without code-link coverage (default: `true`). */
  bridgeUncovered?: boolean;
  /** Allow an explicit coarse-parent step when a C4-only Level 3 component has no direct links (default: `true`). */
  allowCoarseParentStep?: boolean;
  /** Omit full `TuxMapGraphNodeRecord` objects on each hit to bound response size (default: `true`). */
  compact?: boolean;
  /** Explicitly attach full `node` records onto hits (overrides `compact`). */
  includeNodes?: boolean;
  /** Maximum number of hits to return in `hits` (omit for all hits). */
  limit?: number;
  /** Zero-based pagination offset into `hits` (default: `0`). */
  offset?: number;
}

export interface TuxMapImpactQueryResult {
  requestedSeeds: string[];
  seeds: string[];
  descendantIds: string[];
  maxHops: number;
  truncated: boolean;
  totalHitCount: number;
  hitCount: number;
  offset: number;
  hasMore: boolean;
  hits: TuxMapImpactHit[];
  blockers: string[];
  coCutCandidates: string[];
  testsToRun: string[];
  stampsToRebuild: string[];
  buildExecImpacted: string[];
  hostsImpacted: string[];
  coarseParentSteps: TuxMapCoarseParentStep[];
  downstreamIncluded: boolean;
  downstreamDependencies: Array<{ id: string; hop: number; name?: string; level?: number; node?: TuxMapGraphNodeRecord }>;
  impactedSourceFiles: Array<Pick<TuxMapSourceRef, "path" | "repo" | "lineRange" | "symbol">>;
}

export interface TuxMapPathQueryOptions {
  /** `"downstream"` (default) follows `from -> to` dependencies; `"upstream"` reverses dependency direction (`to -> from`). */
  direction?: "downstream" | "upstream";
  includePlanned?: boolean;
  compact?: boolean;
}

export interface TuxMapPathQueryResult {
  found: boolean;
  direction: "downstream" | "upstream";
  hops: number;
  nodeIds: string[];
  nodePath?: TuxMapGraphNodeRecord[];
  edges: TuxMapGraphEdgeRecord[];
}

function clipDisplayId(rawId: string, maxLen = 120): string {
  const s = String(rawId ?? "");
  return s.length <= maxLen ? s : `${s.slice(0, maxLen - 3)}...`;
}

/**
 * Ranks up to `maxSuggestions` (capped at 10) close node IDs by prefix, substring, or token overlap.
 */
export function suggestCloseNodeIds(
  unknownId: string,
  nodes: ReadonlyMap<string, TuxMapGraphNodeRecord>,
  maxSuggestions = 10,
): string[] {
  const cap = Math.min(10, Math.max(0, Math.floor(maxSuggestions)));
  if (cap === 0) return [];
  const q = String(unknownId ?? "").trim().toLowerCase();
  const qStripped = q.replace(/^[fsd]:/, "");
  const tokens = qStripped.split(/[/:.#_-]+/).filter((t) => t.length >= 2);
  if (!q) return [];

  const scored: Array<{ id: string; score: number }> = [];
  for (const n of nodes.values()) {
    const idLower = n.id.toLowerCase();
    const idStripped = idLower.replace(/^[fsd]:/, "");
    const nameLower = (n.name || "").toLowerCase();
    let score = 0;

    if (idLower === q || (qStripped && idStripped === qStripped)) {
      score = 100;
    } else if (idLower.startsWith(q) || (qStripped.length >= 2 && idStripped.startsWith(qStripped))) {
      score = 80;
    } else if (q.length >= 2 && (idLower.endsWith(`/${qStripped}`) || idLower.endsWith(`#${qStripped}`) || nameLower === q)) {
      score = 70;
    } else if (q.length >= 2 && (idLower.includes(q) || (qStripped.length >= 2 && idStripped.includes(qStripped)))) {
      score = 60;
    } else if (q.length >= 2 && nameLower.includes(q)) {
      score = 45;
    } else if (tokens.length > 0) {
      let matchedTokens = 0;
      for (const tok of tokens) {
        if (idLower.includes(tok) || nameLower.includes(tok)) matchedTokens++;
      }
      if (matchedTokens > 0) {
        score = 15 + Math.min(25, matchedTokens * 10);
      }
    }

    if (score > 0) {
      scored.push({ id: clipDisplayId(n.id, 120), score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.id.length - b.id.length || cmpCodepoint(a.id, b.id));
  return scored.slice(0, cap).map((s) => s.id);
}

function buildUnknownNodeError(
  missingIds: string[],
  nodes: ReadonlyMap<string, TuxMapGraphNodeRecord>,
  label = "Node",
): TuxMapUnknownNodeError {
  const clippedMissing = missingIds.slice(0, 10).map((id) => clipDisplayId(id, 120));
  const suggestions: string[] = [];
  const seen = new Set<string>();
  for (const raw of missingIds.slice(0, 5)) {
    for (const cand of suggestCloseNodeIds(raw, nodes, 10)) {
      if (!seen.has(cand)) {
        seen.add(cand);
        suggestions.push(cand);
        if (suggestions.length >= 10) break;
      }
    }
    if (suggestions.length >= 10) break;
  }
  const head = clippedMissing[0] ?? "";
  const msg =
    missingIds.length === 1
      ? `${label} '${head}' not found in architecture graph.`
      : `${missingIds.length} nodes not found in architecture graph (first: '${head}').`;
  return {
    error: msg,
    unknownIds: clippedMissing,
    suggestions,
  };
}

function toCompactNodeRecord(n: TuxMapGraphNodeRecord): TuxMapCompactNodeRecord {
  const out: TuxMapCompactNodeRecord = {
    id: n.id,
    level: n.level,
    kind: n.kind,
    name: n.name,
  };
  if (n.tech !== undefined) out.tech = n.tech;
  if (n.status !== undefined) out.status = n.status;
  if (n.parentId !== undefined) out.parentId = n.parentId;
  if (n.source) {
    out.source = {
      path: n.source.path,
      ...(n.source.lineRange ? { lineRange: n.source.lineRange } : {}),
      ...(n.source.symbol ? { symbol: n.source.symbol } : {}),
    };
  }
  return out;
}

function collectSubtreeDescendants(rootId: string, kidsOf: ReadonlyMap<string, string[]>): string[] {
  const out: string[] = [];
  const seen = new Set<string>([rootId]);
  const q: Array<[string, number]> = [[rootId, 0]];
  for (let qi = 0; qi < q.length; qi++) {
    const [cur, depth] = q[qi]!;
    if (depth >= MAX_TREE_DEPTH) continue;
    for (const ch of kidsOf.get(cur) ?? []) {
      if (!seen.has(ch)) {
        seen.add(ch);
        out.push(ch);
        q.push([ch, depth + 1]);
      }
    }
  }
  return out;
}

/**
 * Queries nodes (and optional matching edges) at a semantic level, parent subgraph, kind, or text filter,
 * supporting compact summaries and `limit`/`offset` pagination (`tti/tti-ux#111`).
 */
export function queryArchitectureNodes(
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  opts: TuxMapNodeQueryOptions = {},
): {
  level: number | "all";
  focusId: string | null;
  totalNodeCount: number;
  nodeCount: number;
  edgeCount: number;
  offset: number;
  hasMore: boolean;
  nodes: Array<TuxMapGraphNodeRecord | TuxMapCompactNodeRecord>;
  edges: TuxMapGraphEdgeRecord[];
} {
  const { nodes, edges } = getMapQueryIndex(model);
  const includePlanned = opts.includePlanned ?? true;
  const focusId = opts.focusId?.trim();
  const level = opts.level;
  const kindSet = opts.kind
    ? new Set(typeof opts.kind === "string" ? [opts.kind] : opts.kind)
    : null;
  const qLower = opts.query?.trim().toLowerCase() || "";

  const matchedNodes = [...nodes.values()].filter((n) => {
    if (!includePlanned && n.status === "planned") return false;
    if (focusId && !(n.parentId === focusId || n.id === focusId)) return false;
    if (level != null && (!focusId || n.id !== focusId) && n.level !== level) return false;
    if (kindSet && !kindSet.has(n.kind)) return false;
    if (qLower) {
      const hay = `${n.id}\n${n.name}\n${n.tech ?? ""}\n${n.desc ?? ""}\n${n.source?.path ?? ""}`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }
    return true;
  });

  const offset = Number.isFinite(opts.offset) ? Math.max(0, Math.floor(opts.offset!)) : 0;
  const pageNodes =
    opts.limit != null && Number.isFinite(opts.limit)
      ? matchedNodes.slice(offset, offset + Math.max(0, Math.floor(opts.limit)))
      : matchedNodes.slice(offset);
  const compact = opts.compact ?? false;
  const includeEdges = opts.includeEdges ?? !compact;

  const pageIds = new Set(pageNodes.map((n) => n.id));
  const matchedEdges = includeEdges
    ? edges.filter(
        (e) =>
          (includePlanned || !e.planned) &&
          (pageIds.has(e.from) || pageIds.has(e.to)),
      )
    : [];

  return {
    level: level ?? "all",
    focusId: focusId || null,
    totalNodeCount: matchedNodes.length,
    nodeCount: pageNodes.length,
    edgeCount: matchedEdges.length,
    offset,
    hasMore: offset + pageNodes.length < matchedNodes.length,
    nodes: compact ? pageNodes.map(toCompactNodeRecord) : pageNodes,
    edges: matchedEdges,
  };
}

/**
 * Computes upstream blast radius and triage buckets across Levels 1..N by delegating directly to
 * `computeLinkBlastRadius` + C4/Level-4 bridge links (`tti/tti-ux#111`).
 *
 * - Supports one or multiple seed IDs.
 * - Never adds `parentId` to seeds; on a C4-only model where a Level 3 component has no direct links,
 *   stepping via the enclosing container's C4 relationships is explicitly surfaced in `coarseParentSteps`.
 * - Downstream dependencies are off by default (`includeDownstream: true` to opt in).
 * - Compact by default (`compact: false` or `includeNodes: true` to attach full node records).
 * - Unknown node IDs return a `< 2 KB` error with at most 10 ranked suggestions.
 */
export function queryArchitectureImpact(
  seedIds: string | Iterable<string>,
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  opts: TuxMapImpactQueryOptions = {},
): TuxMapImpactQueryResult | TuxMapUnknownNodeError {
  const idx = getMapQueryIndex(model);
  const rawSeeds: string[] = [];
  const seenReq = new Set<string>();
  const iter = typeof seedIds === "string" ? [seedIds] : seedIds;
  for (const s of iter) {
    if (s && !seenReq.has(s)) {
      seenReq.add(s);
      rawSeeds.push(s);
    }
  }
  if (rawSeeds.length === 0) {
    return {
      error: "At least one seed node ID is required.",
      unknownIds: [],
      suggestions: [],
    };
  }
  const missing = rawSeeds.filter((id) => !idx.nodes.has(id));
  if (missing.length > 0) {
    return buildUnknownNodeError(missing, idx.nodes);
  }

  const rawMaxHops = opts.maxHops === undefined ? 32 : opts.maxHops;
  const maxHops = Number.isFinite(rawMaxHops) ? Math.max(0, Math.floor(rawMaxHops)) : 32;
  const includePlanned = opts.includePlanned ?? false;
  const bridgeUncovered = opts.bridgeUncovered ?? true;
  const links =
    !includePlanned && bridgeUncovered
      ? idx.effectiveLinks
      : extractModelLinks(model, { includePlanned, bridgeUncovered });

  let blast = computeLinkBlastRadius(links, rawSeeds, idx.parentOf, { ...opts, maxHops, model });
  const coarseParentSteps: TuxMapCoarseParentStep[] = [];
  const coarseViaByHitId = new Map<string, string>();

  // Explicit coarse-parent fallback ONLY on a C4-only model when a Level 3 component has zero direct links
  const hasCodeLinks = (model?.links?.length ?? 0) > 0;
  if (
    !hasCodeLinks &&
    opts.allowCoarseParentStep !== false &&
    blast.hits.size === 0 &&
    maxHops >= 1
  ) {
    const incomingTargets = new Set(links.map((l) => l.to));
    const coarseParents = new Map<string, string>(); // parentId -> first seedId
    for (const s of rawSeeds) {
      const n = idx.nodes.get(s);
      const pid = idx.parentOf.get(s);
      if (
        n?.level === 3 &&
        (idx.kidsOf.get(s)?.length ?? 0) === 0 &&
        !incomingTargets.has(s) &&
        pid &&
        idx.nodes.has(pid) &&
        incomingTargets.has(pid)
      ) {
        coarseParentSteps.push({
          seedId: s,
          parentId: pid,
          reason: "Component has no direct links; stepped via enclosing container C4 relationships.",
        });
        if (!coarseParents.has(pid)) coarseParents.set(pid, s);
      }
    }

    if (coarseParents.size > 0) {
      const parentBlast = computeLinkBlastRadius(links, coarseParents.keys(), idx.parentOf, {
        ...opts,
        maxHops,
        model,
      });
      const firstParent = [...coarseParents.keys()][0]!;
      const shiftedHits = new Map<string, TuxMapBlastHit>();
      for (const [hid, h] of parentBlast.hits.entries()) {
        if (blast.seeds.has(hid)) continue;
        shiftedHits.set(hid, h);
        coarseViaByHitId.set(hid, firstParent);
      }
      blast = {
        ...parentBlast,
        seeds: blast.seeds,
        hits: shiftedHits,
      };
    }
  }

  const reqSet = new Set(rawSeeds);
  const descendantIds: string[] = [];
  for (const s of blast.seeds) {
    if (!reqSet.has(s)) descendantIds.push(s);
  }

  const includeNodes = opts.includeNodes ?? (opts.compact === false);
  const allHits: TuxMapImpactHit[] = [...blast.hits.entries()].map(([id, h]) => {
    const node = idx.nodes.get(id);
    const coarseVia = coarseViaByHitId.get(id);
    const hit: TuxMapImpactHit = {
      id,
      hop: h.hop,
      ...(h.via.kind !== undefined ? { kind: h.via.kind } : {}),
      ...(h.at !== undefined ? { at: h.at } : {}),
      ...(h.sites !== undefined ? { sites: h.sites } : {}),
      ...(h.via.stop ? { stop: true } : {}),
      coupling: inferLinkCoupling(h.via),
      phase: inferLinkPhase(h.via),
      ...(node?.name !== undefined ? { name: node.name } : {}),
      ...(node?.level !== undefined ? { level: node.level } : {}),
      ...(coarseVia ? { coarseParentVia: coarseVia } : {}),
      ...(includeNodes && node ? { node } : {}),
    };
    return hit;
  });

  const offset = Number.isFinite(opts.offset) ? Math.max(0, Math.floor(opts.offset!)) : 0;
  const pagedHits =
    opts.limit != null && Number.isFinite(opts.limit)
      ? allHits.slice(offset, offset + Math.max(0, Math.floor(opts.limit)))
      : allHits.slice(offset);

  const includeDownstream = opts.includeDownstream ?? false;
  const downstreamDependencies: Array<{
    id: string;
    hop: number;
    name?: string;
    level?: number;
    node?: TuxMapGraphNodeRecord;
  }> = [];
  const downIds: string[] = [];

  if (includeDownstream) {
    const downstream = new Map<string, number>();
    const downQ: Array<[string, number]> = [...blast.seeds].map((id) => [id, 0]);
    for (let qi = 0; qi < downQ.length; qi++) {
      const [id, hop] = downQ[qi]!;
      if (hop >= maxHops) continue;
      for (const e of idx.edgesByFrom.get(id) ?? []) {
        if (e.kind === "parent-child") continue;
        if (!includePlanned && e.planned) continue;
        if (!blast.seeds.has(e.to) && !downstream.has(e.to)) {
          downstream.set(e.to, hop + 1);
          downIds.push(e.to);
          downQ.push([e.to, hop + 1]);
        }
      }
    }
    for (const [id, hop] of downstream.entries()) {
      const node = idx.nodes.get(id);
      downstreamDependencies.push({
        id,
        hop,
        ...(node?.name !== undefined ? { name: node.name } : {}),
        ...(node?.level !== undefined ? { level: node.level } : {}),
        ...(includeNodes && node ? { node } : {}),
      });
    }
  }

  const impactedSourceFiles: Array<Pick<TuxMapSourceRef, "path" | "repo" | "lineRange" | "symbol">> = [];
  const seenPaths = new Set<string>();
  for (const id of [...blast.seeds, ...blast.hits.keys(), ...downIds]) {
    const src = idx.nodes.get(id)?.source;
    if (src && !seenPaths.has(src.path)) {
      seenPaths.add(src.path);
      impactedSourceFiles.push({
        path: src.path,
        ...(src.repo ? { repo: src.repo } : {}),
        ...(src.lineRange ? { lineRange: src.lineRange } : {}),
        ...(src.symbol ? { symbol: src.symbol } : {}),
      });
    }
  }

  return {
    requestedSeeds: rawSeeds,
    seeds: [...blast.seeds],
    descendantIds,
    maxHops,
    truncated: blast.truncated,
    totalHitCount: allHits.length,
    hitCount: pagedHits.length,
    offset,
    hasMore: offset + pagedHits.length < allHits.length,
    hits: pagedHits,
    blockers: blast.blockers,
    coCutCandidates: blast.coCutCandidates,
    testsToRun: blast.testsToRun,
    stampsToRebuild: blast.stampsToRebuild,
    buildExecImpacted: blast.buildExecImpacted,
    hostsImpacted: blast.hostsImpacted,
    coarseParentSteps,
    downstreamIncluded: includeDownstream,
    downstreamDependencies,
    impactedSourceFiles,
  };
}

/**
 * Finds the shortest directed architectural dependency path between `fromNodeId` and `toNodeId`,
 * descending into code/components below an element when needed (`tti/tti-ux#111`).
 *
 * Pass `{ direction: "upstream" }` to follow reverse dependency edges (`to -> from`).
 */
export function findArchitecturePath(
  fromNodeId: string,
  toNodeId: string,
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  opts: TuxMapPathQueryOptions = {},
): TuxMapPathQueryResult | TuxMapUnknownNodeError {
  const idx = getMapQueryIndex(model);
  const missing: string[] = [];
  if (!idx.nodes.has(fromNodeId)) missing.push(fromNodeId);
  if (!idx.nodes.has(toNodeId) && toNodeId !== fromNodeId) missing.push(toNodeId);
  if (missing.length > 0) {
    return buildUnknownNodeError(missing, idx.nodes);
  }

  const direction = opts.direction ?? "downstream";
  const includePlanned = opts.includePlanned ?? false;
  const compact = opts.compact ?? false;

  if (fromNodeId === toNodeId) {
    return {
      found: true,
      direction,
      hops: 0,
      nodeIds: [fromNodeId],
      ...(compact ? {} : { nodePath: [idx.nodes.get(fromNodeId)!] }),
      edges: [],
    };
  }

  const fromSubtree = new Set<string>([fromNodeId, ...collectSubtreeDescendants(fromNodeId, idx.kidsOf)]);
  const toAncestorsAndSelf = new Set<string>(mapAncestorsOf(toNodeId, idx.parentOf));
  const targetDescendantSet = new Set(collectSubtreeDescendants(toNodeId, idx.kidsOf));
  const queue: string[] = [fromNodeId];
  const prev = new Map<string, { prevId: string; edge: TuxMapGraphEdgeRecord }>();
  const visited = new Set<string>([fromNodeId]);

  for (let qi = 0; qi < queue.length; qi++) {
    const curr = queue[qi]!;
    if (curr === toNodeId) break;

    const depEdges =
      direction === "downstream"
        ? (idx.edgesByFrom.get(curr) ?? []).filter((e) => e.kind !== "parent-child")
        : (idx.edgesByTo.get(curr) ?? []).filter((e) => e.kind !== "parent-child");

    // 1. Follow directed dependency edges first so direct wires win over descending into subgraphs at equal depth
    for (const e of depEdges) {
      if (!includePlanned && e.planned) continue;
      const next = direction === "downstream" ? e.to : e.from;
      if (!visited.has(next)) {
        visited.add(next);
        prev.set(next, { prevId: curr, edge: e });
        if (next === toNodeId) break;
        // If a directed dependency edge enters a descendant of `toNodeId` from outside `toNodeId`, it reaches `toNodeId`
        if (targetDescendantSet.has(next) && !visited.has(toNodeId)) {
          visited.add(toNodeId);
          prev.set(toNodeId, {
            prevId: next,
            edge: {
              id: `inside-${next}-${toNodeId}`,
              from: next,
              to: toNodeId,
              label: "inside",
              level: idx.nodes.get(toNodeId)!.level,
              kind: "parent-child",
            },
          });
          break;
        }
        queue.push(next);
      }
    }
    if (visited.has(toNodeId)) break;

    // 2. Descend `parent -> child`, labelled `"contains"`, from `fromNodeId` into its own code
    //    or from an already-reached ancestor of `toNodeId` down to `toNodeId` (never climbing `child -> parent`
    //    or escaping through unrelated sibling children of an intermediate container).
    for (const e of idx.edgesByFrom.get(curr) ?? []) {
      if (e.kind !== "parent-child") continue;
      const child = e.to;
      if (!fromSubtree.has(curr) && !toAncestorsAndSelf.has(child)) continue;
      if (!visited.has(child)) {
        visited.add(child);
        const labelledEdge: TuxMapGraphEdgeRecord = e.label ? e : { ...e, label: "contains" };
        prev.set(child, { prevId: curr, edge: labelledEdge });
        if (child === toNodeId) break;
        queue.push(child);
      }
    }
    if (visited.has(toNodeId)) break;
  }

  if (!prev.has(toNodeId)) {
    return {
      found: false,
      direction,
      hops: -1,
      nodeIds: [],
      ...(compact ? {} : { nodePath: [] }),
      edges: [],
    };
  }

  const nodeIds: string[] = [];
  const pathNodes: TuxMapGraphNodeRecord[] = [];
  const pathEdges: TuxMapGraphEdgeRecord[] = [];
  let cursor: string | undefined = toNodeId;
  while (cursor) {
    nodeIds.unshift(cursor);
    if (!compact) {
      const n = idx.nodes.get(cursor);
      if (n) pathNodes.unshift(n);
    }
    const step = prev.get(cursor);
    if (!step) break;
    pathEdges.unshift(step.edge);
    cursor = step.prevId;
  }

  return {
    found: true,
    direction,
    hops: pathEdges.length,
    nodeIds,
    ...(compact ? {} : { nodePath: pathNodes }),
    edges: pathEdges,
  };
}

/**
 * Queries a specific semantic level or parent subgraph from a `TuxMapLevelModel`.
 *
 * @deprecated Use `queryArchitectureNodes` instead.
 */
export function queryArchitectureLayer(
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  opts: { level?: number; focusId?: string; includePlanned?: boolean } = {},
) {
  warnArchitectureDeprecatedOnce("queryArchitectureLayer", "Use queryArchitectureNodes() instead.");
  const res = queryArchitectureNodes(model, {
    level: opts.level,
    focusId: opts.focusId,
    includePlanned: opts.includePlanned,
    compact: false,
    includeEdges: true,
  });
  return {
    level: res.level,
    focusId: res.focusId,
    nodeCount: res.nodeCount,
    edgeCount: res.edgeCount,
    nodes: res.nodes as TuxMapGraphNodeRecord[],
    edges: res.edges,
  };
}

/**
 * Computes multi-level k-hop upstream/downstream blast radius and impacted source files
 * for any node ID across Levels 1..N.
 *
 * @deprecated Use `queryArchitectureImpact` instead.
 */
export function queryMultiLevelBlastRadius(
  nodeId: string,
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  maxHopsOrOpts: number | TuxMapBlastOptions = 32,
) {
  warnArchitectureDeprecatedOnce("queryMultiLevelBlastRadius", "Use queryArchitectureImpact() instead.");
  const idx = getMapQueryIndex(model);
  const root = idx.nodes.get(nodeId);
  if (!root) {
    const err = buildUnknownNodeError([nodeId], idx.nodes);
    return {
      error: err.error,
      unknownIds: err.unknownIds,
      suggestions: err.suggestions,
      availableNodeIds: err.suggestions,
    };
  }

  const blastOpts: TuxMapBlastOptions =
    typeof maxHopsOrOpts === "number" ? { maxHops: maxHopsOrOpts, model } : { ...maxHopsOrOpts, model };
  const rawMaxHops = blastOpts.maxHops === undefined ? 32 : blastOpts.maxHops;
  const maxHops = Number.isFinite(rawMaxHops) ? Math.max(0, Math.floor(rawMaxHops)) : 32;
  const includePlanned = blastOpts.includePlanned ?? false;
  const links = includePlanned ? extractModelLinks(model, { includePlanned: true }) : idx.effectiveLinks;

  const blast = computeLinkBlastRadius(links, nodeId, idx.parentOf, { ...blastOpts, maxHops });

  const childTree = new Set<string>();
  for (const s of blast.seeds) {
    if (s !== nodeId) childTree.add(s);
  }

  const downstream = new Map<string, number>();
  const impactedEdgeIds = new Set<string>();
  const downQ: Array<[string, number]> = [...blast.seeds].map((id) => [id, 0]);
  for (let qi = 0; qi < downQ.length; qi++) {
    const [id, hop] = downQ[qi]!;
    if (hop >= maxHops) continue;
    for (const e of idx.edgesByFrom.get(id) ?? []) {
      if (e.kind === "parent-child") continue;
      if (!includePlanned && e.planned) continue;
      impactedEdgeIds.add(e.id);
      if (!blast.seeds.has(e.to) && !downstream.has(e.to)) {
        downstream.set(e.to, hop + 1);
        downQ.push([e.to, hop + 1]);
      }
    }
  }

  for (const id of [...blast.seeds, ...blast.hits.keys()]) {
    for (const e of idx.edgesByTo.get(id) ?? []) {
      if (e.kind === "parent-child") continue;
      if (!includePlanned && e.planned) continue;
      if (blast.seeds.has(e.from) || blast.hits.has(e.from)) {
        impactedEdgeIds.add(e.id);
      }
    }
  }

  const allTouchedIds = new Set<string>([
    ...blast.seeds,
    ...blast.hits.keys(),
    ...downstream.keys(),
  ]);

  const impactedFiles: TuxMapSourceRef[] = [];
  const seenPaths = new Set<string>();
  for (const id of allTouchedIds) {
    const src = idx.nodes.get(id)?.source;
    if (src && !seenPaths.has(src.path)) {
      seenPaths.add(src.path);
      impactedFiles.push(src);
    }
  }

  return {
    rootNode: root,
    maxHops,
    truncated: blast.truncated,
    descendantIds: [...childTree],
    upstreamDependents: [...blast.hits.entries()].map(([id, h]) => ({
      id,
      hop: h.hop,
      via: h.via,
      at: h.at,
      sites: h.sites,
      node: idx.nodes.get(id),
    })),
    downstreamDependencies: [...downstream.entries()].map(([id, hop]) => ({
      id,
      hop,
      node: idx.nodes.get(id),
    })),
    blockers: blast.blockers,
    coCutCandidates: blast.coCutCandidates,
    testsToRun: blast.testsToRun,
    stampsToRebuild: blast.stampsToRebuild,
    buildExecImpacted: blast.buildExecImpacted,
    hostsImpacted: blast.hostsImpacted,
    impactedEdgeIds: [...impactedEdgeIds],
    impactedSourceFiles: impactedFiles,
  };
}

/**
 * Finds a path between `fromNodeId` and `toNodeId` across Levels 1..N.
 *
 * @deprecated Use `findArchitecturePath` instead.
 */
export function findShortestArchitecturePath(
  fromNodeId: string,
  toNodeId: string,
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
) {
  warnArchitectureDeprecatedOnce("findShortestArchitecturePath", "Use findArchitecturePath() instead.");
  const res = findArchitecturePath(fromNodeId, toNodeId, model, { compact: false });
  if ("error" in res) {
    return { error: res.error, unknownIds: res.unknownIds, suggestions: res.suggestions };
  }
  return {
    found: res.found,
    hops: res.hops,
    nodePath: res.nodePath ?? [],
    edges: res.edges,
  };
}

const activeAcpLeases = new Map<string, TuxMapAcpLease>();

/**
 * ACP (Agent Communication Protocol) Subgraph Lease Coordinator.
 *
 * @deprecated In-process ACP subgraph leases do not coordinate across processes; scope changes with
 * `computeGraphDelta` and `queryArchitectureImpact` instead.
 */
export function coordinateAcpSubgraphLease(
  action: "acquire" | "release" | "list",
  opts: {
    agentId?: string;
    rootNodeId?: string;
    leaseId?: string;
    ttlSeconds?: number;
    model?: TuxMapLevelModel;
  } = {},
) {
  warnArchitectureDeprecatedOnce(
    "coordinateAcpSubgraphLease",
    "In-process ACP leases do not coordinate across processes; use computeGraphDelta() and queryArchitectureImpact() instead.",
  );
  const now = Date.now();
  // Prune expired leases
  for (const [id, lease] of activeAcpLeases.entries()) {
    if (Date.parse(lease.expiresAt) <= now) {
      activeAcpLeases.delete(id);
    }
  }

  if (action === "list") {
    return {
      activeLeaseCount: activeAcpLeases.size,
      leases: [...activeAcpLeases.values()],
    };
  }

  if (action === "release") {
    const removed =
      (opts.leaseId && activeAcpLeases.delete(opts.leaseId)) ||
      (opts.agentId &&
        (() => {
          let count = 0;
          for (const [k, v] of activeAcpLeases.entries()) {
            if (v.agentId === opts.agentId && (!opts.rootNodeId || v.rootNodeId === opts.rootNodeId)) {
              activeAcpLeases.delete(k);
              count++;
            }
          }
          return count > 0;
        })());
    return {
      released: Boolean(removed),
      activeLeaseCount: activeAcpLeases.size,
      leases: [...activeAcpLeases.values()],
    };
  }

  // Acquire lease without invoking deprecated queryMultiLevelBlastRadius
  const agentId = opts.agentId || "agent-anonymous";
  const rootNodeId = opts.rootNodeId;
  if (!rootNodeId) {
    return { acquired: false, error: "rootNodeId is required to acquire an ACP subgraph lease." };
  }

  const model = opts.model || DEFAULT_TTI_LEVEL_MODEL;
  const idx = getMapQueryIndex(model);
  if (!idx.nodes.has(rootNodeId)) {
    const err = buildUnknownNodeError([rootNodeId], idx.nodes);
    return { acquired: false, error: err.error, suggestions: err.suggestions };
  }

  const descendants = collectSubtreeDescendants(rootNodeId, idx.kidsOf);
  const requestedScope = new Set<string>([rootNodeId, ...descendants]);
  const requestedFiles = new Set<string>();
  for (const id of requestedScope) {
    const p = idx.nodes.get(id)?.source?.path;
    if (p) requestedFiles.add(p);
  }

  // Check for conflicts with other agents' active leases
  for (const existing of activeAcpLeases.values()) {
    if (existing.agentId === agentId) continue;
    const nodeOverlap = existing.scopeNodeIds.filter((id) => requestedScope.has(id));
    const fileOverlap = existing.lockedFiles.filter((f) => requestedFiles.has(f));
    if (nodeOverlap.length > 0 || fileOverlap.length > 0) {
      return {
        acquired: false,
        conflict: {
          heldByAgent: existing.agentId,
          leaseId: existing.leaseId,
          rootNodeId: existing.rootNodeId,
          overlappingNodes: nodeOverlap,
          overlappingFiles: fileOverlap,
        },
      };
    }
  }

  const ttlMs = (opts.ttlSeconds ?? 900) * 1000;
  const lease: TuxMapAcpLease = {
    leaseId: `lease-${agentId}-${rootNodeId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    agentId,
    rootNodeId,
    scopeNodeIds: [...requestedScope],
    lockedFiles: [...requestedFiles],
    acquiredAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttlMs).toISOString(),
  };
  activeAcpLeases.set(lease.leaseId, lease);

  return {
    acquired: true,
    lease,
    activeLeaseCount: activeAcpLeases.size,
  };
}

export const DEFAULT_TTI_LEVEL_MODEL: TuxMapLevelModel = {
  generatedAt: "2026-10-28T10:30:00Z",
  issueBaseUrl: "https://github.com/ttitamu/tti-ux/issues",
  sourceBaseUrl: "https://github.com/ttitamu/tti-ux/blob/main",
  level1: {
    title: "Level 1 · Ecosystem & People in Context",
    summary: "The platform, the people who use and operate it, and the external services it connects with.",
    elements: [
      {
        id: "p-users",
        kind: "person",
        name: "Product users & analysts",
        desc: "Sign in to explore dashboards, run reports, manage projects, and collaborate.",
        at: [0, 0],
      },
      {
        id: "p-admins",
        kind: "person",
        name: "Platform admins & SREs",
        desc: "Configure access policies, review system health, and manage releases.",
        at: [0, 1],
      },
      {
        id: "p-guests",
        kind: "person",
        name: "Public visitors",
        desc: "Browse public pages, documentation, and published datasets without signing in.",
        at: [0, 2],
      },
      {
        id: "s-platform",
        kind: "system",
        name: "Enterprise Cloud Platform",
        tech: "Web Portal · Core API · Workers · Data",
        desc: "Primary application platform providing web dashboards, REST APIs, background job processing, and governed data storage.",
        at: [2, 1],
        zoom: 2,
        live: { state: "running", running: 10, total: 10 },
      },
      {
        id: "x-sso",
        kind: "external",
        name: "Identity Provider (SSO)",
        tech: "OIDC · SAML 2.0",
        desc: "Single sign-on, multi-factor authentication, and role group synchronization.",
        at: [4, 0],
      },
      {
        id: "x-registry",
        kind: "external",
        name: "Package & Image Registry",
        tech: "npm · OCI Containers",
        desc: "Upstream software packages and signed container images used during builds.",
        at: [4, 1],
      },
      {
        id: "x-email",
        kind: "external",
        name: "Notification Gateway",
        tech: "SMTP · Webhooks",
        desc: "Delivers transactional email alerts, digest summaries, and outbound webhooks.",
        at: [4, 2],
      },
      {
        id: "x-monitor",
        kind: "external",
        name: "Uptime & Metrics Monitor",
        tech: "HTTPS · OpenTelemetry",
        desc: "External uptime checks, synthetic probes, and on-call alert routing.",
        at: [1, 3],
      },
      {
        id: "x-backup",
        kind: "external",
        name: "Offsite Backup Vault",
        tech: "Encrypted Snapshots",
        desc: "Daily immutable offsite snapshots for disaster recovery.",
        at: [2, 3],
      },
      {
        id: "x-cdn",
        kind: "external",
        name: "Global CDN & WAF",
        tech: "TLS 1.3 · Edge Cache",
        desc: "Caches static assets at the edge and filters malicious traffic.",
        at: [3, 3],
      },
      {
        id: "x-ai",
        kind: "external",
        status: "planned",
        name: "Managed AI Endpoint",
        tech: "LLM Inference API",
        desc: "Planned model inference service for natural-language search and summaries.",
        roadmap: [101, 104],
        at: [4, 3],
      },
      {
        id: "x-warehouse",
        kind: "external",
        status: "planned",
        name: "Analytics Data Warehouse",
        tech: "Columnar Lakehouse",
        desc: "Downstream reporting warehouse receiving nightly anonymized data exports.",
        roadmap: [112],
        at: [2, 0],
      },
    ],
    rels: [
      { from: "p-users", to: "s-platform", label: "Uses web app & API", tech: "HTTPS 443" },
      { from: "p-admins", to: "s-platform", label: "Operates & configures", tech: "HTTPS 443" },
      { from: "p-guests", to: "s-platform", label: "Browses public pages", tech: "HTTPS 443" },
      { from: "s-platform", to: "x-sso", label: "Signs users in; syncs roles", tech: "OIDC / SCIM" },
      { from: "s-platform", to: "x-registry", label: "Pulls base images", tech: "HTTPS" },
      { from: "s-platform", to: "x-email", label: "Sends alerts & digests", tech: "HTTPS / TLS" },
      { from: "x-monitor", to: "s-platform", label: "Checks health", tech: "HTTPS /healthz" },
      { from: "x-backup", to: "s-platform", label: "Snapshots volumes daily", tech: "Incremental snapshot" },
      { from: "x-cdn", to: "s-platform", label: "Forwards origin traffic", tech: "HTTPS 443" },
      { from: "s-platform", to: "x-ai", label: "Sends search queries", tech: "HTTPS", status: "planned", roadmap: [104] },
      { from: "s-platform", to: "x-warehouse", label: "Exports nightly datasets", tech: "Parquet over TLS", status: "planned", roadmap: [112] },
    ],
  },
  level2: {
    title: "Level 2 · Containers & Services",
    summary: "What the platform is made of: each box is an application service, worker pool, or data store inside the platform boundary.",
    boundary: "s-platform",
    elements: [
      { id: "p-users", ref: true, at: [0, 1] },
      { id: "p-admins", ref: true, at: [0, 2] },
      { id: "p-guests", ref: true, at: [0, 3] },
      { id: "x-monitor", ref: true, at: [0, 4] },
      {
        id: "c-edge",
        kind: "container",
        name: "Edge Reverse Proxy",
        tech: "Envoy / Caddy",
        desc: "TLS termination, rate limiting, security headers, and request routing.",
        runs: ["edge-proxy", "rate-limiter"],
        deployed: ["app-vm-01"],
        at: [1, 2],
        live: { state: "running", running: 2, total: 2, version: "2.9.0" },
      },
      {
        id: "c-web",
        kind: "container",
        name: "Web Portal",
        tech: "Nuxt · TypeScript",
        desc: "Interactive user interface, dashboards, project workspaces, and admin views.",
        runs: ["web-ssr", "asset-server"],
        deployed: ["app-vm-01"],
        at: [2, 1],
        live: { state: "running", running: 2, total: 2, version: "3.4.0" },
      },
      {
        id: "c-api",
        kind: "container",
        name: "Core API Service",
        tech: "Go · REST & GraphQL",
        desc: "Domain business logic, permissions, project workflows, and event publishing.",
        runs: ["api-server", "webhook-dispatcher"],
        deployed: ["app-vm-01"],
        at: [2, 2],
        live: { state: "running", running: 2, total: 2, version: "4.2.1" },
        source: { path: "services/api/cmd/server/main.go", lineRange: [1, 148], symbol: "main()" },
        diff: { changeType: "modified", filesChanged: 3, summary: "Updated RBAC token claims & search proxy" },
      },
      {
        id: "c-db",
        kind: "database",
        name: "Primary Database",
        tech: "PostgreSQL 16",
        desc: "Stores user accounts, project records, permissions, and audit history.",
        runs: ["postgres-primary"],
        deployed: ["app-vm-01", "app-data-disk"],
        at: [2, 3],
        live: { state: "running", version: "16.6" },
      },
      {
        id: "c-scheduler",
        kind: "container",
        name: "Scheduled Jobs",
        tech: "System Timers",
        desc: "Runs directory role sync, nightly backup orchestration, and usage summaries.",
        runs: ["role-sync", "backup-runner", "usage-rollup", "session-cleanup"],
        deployed: ["app-vm-01"],
        at: [1, 4],
        live: { state: "running", running: 4, total: 4 },
      },
      {
        id: "c-search",
        kind: "container",
        status: "paused",
        name: "AI Search Service",
        tech: "Python · Vector Index",
        desc: "Semantic search and document Q&A; paused until the AI model endpoint is enabled.",
        deployed: ["ai-search-app", "vector-db-01"],
        at: [3, 1],
        live: { state: "inactive", version: "1.1.0" },
        source: { path: "services/ai-search/src/main.py", lineRange: [1, 96], symbol: "create_search_app()" },
        diff: { changeType: "modified", filesChanged: 2, summary: "Added hybrid RRF reranker & 1536d HNSW index" },
      },
      {
        id: "c-workers",
        kind: "container",
        name: "Background Workers",
        tech: "Worker Pool (2 Nodes)",
        desc: "Executes report exports, document indexing, and outbound notifications.",
        deployed: ["worker-node-01", "worker-node-02"],
        at: [3, 2],
        live: { state: "running", running: 2, total: 2, version: "4.2.1" },
      },
      {
        id: "c-cache",
        kind: "database",
        name: "Cache & Job Queue",
        tech: "Valkey / Redis",
        desc: "Low-latency session cache, rate-limit counters, and background job queues.",
        runs: ["valkey-server"],
        deployed: ["app-vm-01"],
        at: [3, 3],
        live: { state: "running", version: "8.0" },
      },
      {
        id: "c-storage",
        kind: "storage",
        name: "Backup & Object Store",
        tech: "Encrypted Blob Storage",
        desc: "Nightly encrypted database backups, key escrow, and monthly restore verification.",
        deployed: ["blob-backup-store", "secrets-key-vault"],
        at: [2, 4],
        live: { state: "success", last_run: { result: "success", at: "2026-10-27T02:00:00Z" } },
      },
      {
        id: "c-observability",
        kind: "container",
        name: "Observability & Security",
        tech: "OpenTelemetry · Scanner",
        desc: "Aggregates structured logs, traces, dependency vulnerability scans, and audit trails.",
        runs: ["otel-collector", "vuln-scanner", "audit-exporter"],
        deployed: ["app-vm-01"],
        at: [3, 4],
        live: { state: "running", running: 3, total: 3 },
      },
      {
        id: "c-exporter",
        kind: "container",
        status: "planned",
        name: "Warehouse Exporter",
        tech: "Batch ETL Worker",
        desc: "Transforms and streams nightly analytics tables to the data warehouse.",
        roadmap: [112],
        at: [4, 2],
      },
      {
        id: "c-sandbox",
        kind: "container",
        status: "planned",
        name: "Isolated Plugin Runner",
        tech: "Micro-VM Sandbox",
        desc: "Executes custom user scripts inside ephemeral, network-restricted sandboxes.",
        roadmap: [118],
        at: [4, 3],
      },
      { id: "x-ai", ref: true, at: [3, 0] },
      { id: "x-warehouse", ref: true, at: [4, 0] },
      { id: "x-email", ref: true, at: [5, 2] },
      { id: "x-sso", ref: true, at: [1, 5] },
      { id: "x-registry", ref: true, at: [3, 5] },
    ],
    rels: [
      { from: "p-users", to: "c-edge", label: "Uses portal & API", tech: "HTTPS 443" },
      { from: "p-admins", to: "c-edge", label: "Administers", tech: "HTTPS 443" },
      { from: "p-guests", to: "c-edge", label: "Browses", tech: "HTTPS 443" },
      { from: "x-monitor", to: "c-edge", label: "Probes health", tech: "HTTPS /healthz" },
      { from: "c-edge", to: "c-web", label: "Routes UI requests", tech: "HTTP 3000" },
      { from: "c-edge", to: "c-api", label: "Routes /api/*", tech: "HTTP 8080" },
      { from: "c-web", to: "c-api", label: "Fetches data", tech: "REST / GraphQL" },
      { from: "c-web", to: "c-search", label: "Semantic queries", tech: "HTTP" },
      { from: "c-api", to: "c-db", label: "Reads & writes", tech: "SQL 5432" },
      { from: "c-api", to: "c-cache", label: "Caches & enqueues", tech: "RESP 6379" },
      { from: "c-api", to: "x-sso", label: "Verifies tokens", tech: "OIDC" },
      { from: "c-scheduler", to: "x-sso", label: "Syncs user groups", tech: "SCIM / REST" },
      { from: "c-scheduler", to: "c-api", label: "Triggers maintenance", tech: "Internal API" },
      { from: "c-scheduler", to: "c-storage", label: "Runs nightly backup", tech: "Encrypted stream" },
      { from: "c-workers", to: "c-cache", label: "Pulls queued jobs", tech: "RESP 6379" },
      { from: "c-workers", to: "c-db", label: "Writes job results", tech: "SQL 5432" },
      { from: "c-workers", to: "x-email", label: "Sends notifications", tech: "SMTP / TLS" },
      { from: "c-observability", to: "c-api", label: "Collects audit metrics", tech: "OpenTelemetry" },
      { from: "c-observability", to: "x-registry", label: "Checks advisories", tech: "HTTPS" },
      { from: "c-search", to: "x-ai", label: "Requests embeddings", tech: "HTTPS", status: "planned", roadmap: [104] },
      { from: "c-exporter", to: "c-db", label: "Reads replica tables", tech: "SQL 5432", status: "planned", roadmap: [112] },
      { from: "c-exporter", to: "x-warehouse", label: "Uploads Parquet", tech: "HTTPS", status: "planned", roadmap: [112] },
      { from: "c-workers", to: "c-sandbox", label: "Dispatches plugins", tech: "gRPC", status: "planned", roadmap: [118] },
    ],
  },
  level3: {
    "c-edge": [
      { id: "c-edge/0", name: "TLS & HTTP/3 Terminator", tech: "Envoy / Caddy", desc: "Handles automatic certificate renewal, TLS 1.3, and security headers.", live: { state: "running", version: "2.9.0" } },
      { id: "c-edge/1", name: "Rate Limiter & Bot Filter", tech: "Edge Middleware", desc: "Protects public endpoints from burst traffic and automated scrapers.", live: { state: "running", version: "1.4.0" } },
    ],
    "c-web": [
      { id: "c-web/0", name: "SSR Page Renderer", tech: "Nuxt 4 Server", desc: "Renders initial HTML views, navigation shells, and SEO metadata.", live: { state: "running", version: "3.4.0" } },
      { id: "c-web/1", name: "Interactive Dashboard Views", tech: "Vue 3 · ECharts", desc: "Client-side charts, data tables, and real-time status widgets.", live: { state: "running" } },
      { id: "c-web/2", name: "Admin & Policy Console", tech: "Role-Guarded UI", desc: "Configuration screens for system administrators and auditors.", live: { state: "running" } },
    ],
    "c-api": [
      { id: "c-api/0", name: "REST & GraphQL Router", tech: "Go HTTP Server", desc: "Validates request schemas, correlation IDs, and API versioning.", live: { state: "running", version: "4.2.1" }, source: { path: "services/api/internal/http/router.go", lineRange: [24, 182], symbol: "NewRouter()" } },
      { id: "c-api/1", name: "Auth & RBAC Guard", tech: "OIDC JWT Verifier", desc: "Verifies bearer tokens, session cookies, and role-based permissions.", live: { state: "running" }, source: { path: "services/api/internal/auth/rbac.go", lineRange: [18, 134], symbol: "VerifyRBAC()" }, diff: { changeType: "modified", filesChanged: 2, summary: "Enforce scoped subgraph leases" } },
      { id: "c-api/2", name: "Projects & Workflows Engine", tech: "Domain Service", desc: "Core state machine for project items, approvals, and history.", live: { state: "running" }, source: { path: "services/api/internal/workflows/engine.go", lineRange: [40, 260], symbol: "TransitionState()" } },
      { id: "c-api/3", name: "Job Queue Producer", tech: "Async Publisher", desc: "Enqueues background tasks for exports, notifications, and indexing.", live: { state: "running" } },
      { id: "c-api/4", name: "Webhook & Event Dispatcher", tech: "Signed HTTP Post", desc: "Delivers signed domain events to subscribed integrations.", live: { state: "running" } },
      { id: "c-api/5", name: "Audit Log Writer", tech: "Append-Only Stream", desc: "Records security-sensitive actions with actor and timestamp metadata.", live: { state: "running" } },
    ],
    "c-db": [
      { id: "c-db/0", name: "Primary Relational Store", tech: "PostgreSQL 16.6", desc: "Transactional tables, indexes, and write-ahead log on managed SSD.", live: { state: "running", version: "16.6" } },
      { id: "c-db/1", name: "Connection Pooler", tech: "PgBouncer", desc: "Multiplexes database connections across API and worker containers.", live: { state: "running" } },
    ],
    "c-cache": [
      { id: "c-cache/0", name: "Session & Token Store", tech: "Valkey 8.0", desc: "Stores active user sessions and short-lived verification state.", live: { state: "running", version: "8.0" } },
      { id: "c-cache/1", name: "Priority Job Streams", tech: "Redis Streams", desc: "Backs high, default, and bulk queues for worker nodes.", live: { state: "running" } },
    ],
    "c-workers": [
      { id: "c-workers/0", name: "worker-node-01", tech: "Linux Worker VM", desc: "Processes high-priority interactive jobs and webhooks.", deployed: "worker-node-01", live: { state: "running" } },
      { id: "c-workers/1", name: "worker-node-02", tech: "Linux Worker VM", desc: "Processes batch report generation and data exports.", deployed: "worker-node-02", live: { state: "running" } },
    ],
    "c-scheduler": [
      { id: "c-scheduler/0", name: "Directory Group Sync", tech: "Every 30m", desc: "Reconciles external SSO groups with application roles.", live: { state: "success" } },
      { id: "c-scheduler/1", name: "Nightly Backup Trigger", tech: "Daily 02:00 UTC", desc: "Coordinates consistent database dump and encrypted upload.", live: { state: "success" } },
      { id: "c-scheduler/2", name: "Usage & Quota Rollup", tech: "Hourly", desc: "Computes storage and API usage metrics per workspace.", live: { state: "success" } },
    ],
    "c-storage": [
      { id: "c-storage/0", name: "Encrypted Backup Packager", tech: "AES-256 Deduplicated", desc: "Compresses and encrypts nightly snapshots before upload.", live: { state: "success" } },
      { id: "c-storage/1", name: "Geo-Redundant Blob Vault", tech: "Object Storage (GRS)", desc: "Immutable object storage bucket with retention policies.", deployed: "blob-backup-store", live: { state: "present" } },
      { id: "c-storage/2", name: "Encryption Key Escrow", tech: "Managed Key Vault", desc: "Hardware-backed vault holding backup encryption keys.", deployed: "secrets-key-vault", live: { state: "present" } },
    ],
    "c-observability": [
      { id: "c-observability/0", name: "OpenTelemetry Collector", tech: "OTLP Receiver", desc: "Receives traces, metrics, and logs from all containers.", live: { state: "running" } },
      { id: "c-observability/1", name: "Dependency & Image Scanner", tech: "Daily CVE Check", desc: "Scans container images and lockfiles for known vulnerabilities.", live: { state: "success" } },
    ],
    "c-search": [
      { id: "c-search/0", name: "Search Query API", tech: "FastAPI Service", status: "paused", desc: "Retrieves relevant documents and synthesizes answers.", deployed: "ai-search-app" },
      { id: "c-search/1", name: "Vector Embeddings Store", tech: "PostgreSQL + pgvector", desc: "Stores chunked document embeddings and access ACLs.", deployed: "vector-db-01" },
    ],
    "c-exporter": [
      { id: "c-exporter/0", name: "Snapshot Extractor", tech: "Incremental Reader", status: "planned", desc: "Reads changed rows since the last watermark.", roadmap: [112], next: 1 },
      { id: "c-exporter/1", name: "PII Redaction & Schema Check", tech: "Policy Filter", status: "planned", desc: "Strips sensitive fields and validates column types.", roadmap: [112], next: 2 },
      { id: "c-exporter/2", name: "Parquet Writer", tech: "TLS Upload", status: "planned", desc: "Writes partitioned Parquet files to the warehouse bucket.", roadmap: [112] },
    ],
    "c-sandbox": [
      { id: "c-sandbox/0", name: "Sandbox Controller", tech: "gRPC Dispatcher", status: "planned", desc: "Allocates a fresh micro-VM for each plugin execution.", roadmap: [118], next: 1 },
      { id: "c-sandbox/1", name: "Ephemeral Micro-VM", tech: "No-Egress Enclave", status: "planned", desc: "Runs untrusted code with strict CPU, memory, and network limits.", roadmap: [118] },
    ],
  },
  level4: {
    title: "Level 4 · Infrastructure & Deployment",
    summary: "Where everything runs: cloud resource groups, virtual machines, managed storage, and network rules.",
    groups: [
      { id: "rg-app", zone: "cloud-prod", title: "rg-platform-app", rg: "rg-platform-app" },
      { id: "rg-ai", zone: "cloud-prod", title: "rg-platform-search", rg: "rg-platform-search" },
      { id: "rg-workers", zone: "cloud-prod", title: "rg-platform-workers", rg: "rg-platform-workers" },
      { id: "rg-backups", zone: "cloud-prod", title: "rg-platform-backups", rg: "rg-platform-backups" },
    ],
    nodes: [
      { id: "users", zone: "people", kind: "people", title: "Users in a browser", role: "Access web dashboards and interactive workspaces over HTTPS.", status: "now" },
      { id: "api-clients", zone: "people", kind: "people", title: "API & CLI clients", role: "Automate workflows and integrations over HTTPS 443.", status: "now" },
      { id: "anon", zone: "people", kind: "people", title: "Public visitors", role: "Read public portals and documentation behind rate limiting.", status: "now" },
      { id: "sso-app", zone: "entra", kind: "entra-app", title: "Platform SSO App (OIDC)", role: "Federated OpenID Connect sign-in and token issuance.", status: "now" },
      { id: "sso-sync", zone: "entra", kind: "entra-app", title: "Directory Group Sync", role: "Read-only group membership synchronization.", status: "now" },
      {
        id: "app-vm-01",
        group: "rg-app",
        kind: "vm",
        title: "app-vm-01",
        role: "Primary application host running the reverse proxy, web portal, API, cache, and database containers.",
        status: "now",
        hosts: ["c-edge", "c-web", "c-api", "c-db", "c-cache", "c-scheduler", "c-observability"],
        facts: {
          type: "Compute / Virtual Machine",
          size: "8 vCPU, 32 GB RAM",
          os: "Linux LTS",
          rules: [
            { direction: "in", access: "allow", ports: ["443"], from: ["Internet / CDN"] },
            { direction: "in", access: "allow", ports: ["22"], from: ["Bastion subnet"] },
            { direction: "in", access: "allow", ports: ["9100"], from: ["Uptime monitor"] },
          ],
        },
      },
      {
        id: "app-data-disk",
        group: "rg-app",
        kind: "disk",
        title: "app-data-disk",
        role: "Managed SSD volume storing relational database tables and local caches.",
        status: "now",
        hosts: ["c-db"],
        facts: { type: "Managed Block Storage", sku: "Premium SSD", size: "512 GB" },
      },
      {
        id: "ai-search-app",
        group: "rg-ai",
        kind: "containerapp",
        title: "ai-search-app",
        role: "Managed container service for semantic search queries. Scroll or double-click (+) to drill into Level 5 modules and Level 6 AST symbols.",
        status: "now",
        hosts: ["c-search"],
        source: { path: "services/ai-search/Dockerfile", lineRange: [1, 44] },
        diff: { changeType: "modified", filesChanged: 2, summary: "Hybrid retriever + RRF reranker" },
        facts: { type: "Managed Container Service", ingress: "Internal HTTPS" },
      },
      {
        id: "vector-db-01",
        group: "rg-ai",
        kind: "postgres",
        title: "vector-db-01",
        role: "Managed PostgreSQL instance with pgvector extension. Scroll or double-click (+) to drill into Level 5 schemas & HNSW index internals.",
        status: "now",
        hosts: ["c-search"],
        source: { path: "infra/opentofu/vector-db.tf", lineRange: [12, 88] },
        facts: { type: "Managed PostgreSQL", version: "16" },
      },
      {
        id: "worker-node-01",
        group: "rg-workers",
        kind: "vm",
        title: "worker-node-01",
        role: "Stateless background worker node for interactive and webhook jobs.",
        status: "now",
        hosts: ["c-workers"],
        facts: { type: "Compute / Virtual Machine", size: "4 vCPU, 16 GB RAM" },
      },
      {
        id: "worker-node-02",
        group: "rg-workers",
        kind: "vm",
        title: "worker-node-02",
        role: "Stateless background worker node for batch exports and reports.",
        status: "now",
        hosts: ["c-workers"],
        facts: { type: "Compute / Virtual Machine", size: "4 vCPU, 16 GB RAM" },
      },
      {
        id: "blob-backup-store",
        group: "rg-backups",
        kind: "storage",
        title: "blob-backup-store",
        role: "Geo-redundant object storage bucket holding encrypted nightly backups.",
        status: "now",
        hosts: ["c-storage"],
        facts: { type: "Object Storage Account", sku: "Geo-Redundant (GRS)" },
      },
      {
        id: "secrets-key-vault",
        group: "rg-backups",
        kind: "keyvault",
        title: "secrets-key-vault",
        role: "Managed key vault escrowing backup encryption keys and service certificates.",
        status: "now",
        hosts: ["c-storage"],
        facts: { type: "Hardware Key Vault", sku: "Standard" },
      },
      { id: "uptime-monitor", zone: "outside", kind: "external", title: "Uptime Monitor", role: "External synthetic health probes and alert notifications.", status: "now" },
      { id: "offsite-vault", zone: "outside", kind: "backup", title: "Offsite Snapshot Vault", role: "Daily crash-consistent volume snapshot replica.", status: "now" },
      { id: "onprem-cluster", zone: "azure-local", kind: "cluster", status: "planned", title: "On-Premises Failover Cluster", role: "Planned 3-node local cluster for hybrid workload failover.", roadmap: [115] },
      { id: "sandbox-pool", zone: "planned-only", kind: "quarantine", status: "planned", title: "Isolated Sandbox Enclave", role: "Dedicated network-isolated pool for untrusted plugin execution.", placement: "Planned for Phase 2 (#118).", roadmap: [118] },
    ],
    links: [
      { from: "users", to: "app-vm-01", label: "HTTPS 443 → Edge Proxy", kind: "traffic", state: "now" },
      { from: "api-clients", to: "app-vm-01", label: "HTTPS 443", kind: "traffic", state: "now" },
      { from: "anon", to: "app-vm-01", label: "HTTPS 443 → Rate Limiter", kind: "traffic", state: "now" },
      { from: "users", to: "sso-app", label: "Sign in (OIDC)", kind: "auth", state: "now" },
      { from: "app-vm-01", to: "sso-app", label: "OIDC token verify", kind: "auth", state: "now" },
      { from: "app-vm-01", to: "sso-sync", label: "Group sync (30m)", kind: "auth", state: "now" },
      { from: "app-vm-01", to: "app-data-disk", label: "Mounted SSD", kind: "control", state: "now" },
      { from: "app-vm-01", to: "ai-search-app", label: "Search queries", kind: "data", state: "now" },
      { from: "ai-search-app", to: "vector-db-01", label: "Vector SQL", kind: "data", state: "now" },
      { from: "app-vm-01", to: "blob-backup-store", label: "Nightly backup 02:00 UTC", kind: "backup", state: "now" },
      { from: "secrets-key-vault", to: "blob-backup-store", label: "Escrows key", kind: "backup", state: "now" },
      { from: "worker-node-01", to: "app-vm-01", label: "Pulls jobs & writes results", kind: "traffic", state: "now" },
      { from: "worker-node-02", to: "app-vm-01", label: "Pulls jobs & writes results", kind: "traffic", state: "now" },
      { from: "uptime-monitor", to: "app-vm-01", label: "HTTPS /healthz", kind: "traffic", state: "now" },
      { from: "app-data-disk", to: "offsite-vault", label: "Daily snapshot", kind: "backup", state: "now" },
    ],
    neighbors: [
      { name: "shared-bastion-01", type: "virtualMachines", resourceGroup: "rg-platform-app", reason: "Shared administration bastion host; managed separately." },
    ],
  },
  subgraphs: {
    "ai-search-app": {
      stratum: "Level 5 · Internal Subsystems & Modules (ai-search-app)",
      summary: "Inside ai-search-app: FastAPI request pipeline, hybrid dense+BM25 retriever, cross-encoder reranker, and vector DB client.",
      elements: [
        {
          id: "ai-search-app/router",
          kind: "module",
          name: "Search API Router",
          tech: "src/api/routes.py",
          desc: "Validates query payloads, rate limits, and workspace ACL tokens before retrieval.",
          live: { state: "running", version: "FastAPI 0.115" },
          source: { path: "services/ai-search/src/api/routes.py", lineRange: [14, 92], symbol: "POST /v1/search" },
          next: 1,
        },
        {
          id: "ai-search-app/retriever",
          kind: "module",
          name: "Hybrid Retriever",
          tech: "src/search/retriever.py",
          desc: "Executes parallel dense embedding search and sparse BM25 lexical matching. Drill in (+) for Level 6 AST symbols.",
          live: { state: "running" },
          source: { path: "services/ai-search/src/search/retriever.py", lineRange: [1, 184], symbol: "class HybridRetriever" },
          diff: { changeType: "modified", filesChanged: 1, summary: "Added Reciprocal Rank Fusion (RRF)" },
          next: 2,
        },
        {
          id: "ai-search-app/reranker",
          kind: "module",
          name: "Cross-Encoder Reranker",
          tech: "src/search/reranker.py",
          desc: "Scores top-50 candidate chunks for semantic relevance and trims context window.",
          live: { state: "running" },
          source: { path: "services/ai-search/src/search/reranker.py", lineRange: [10, 76], symbol: "rerank_candidates()" },
          diff: { changeType: "added", filesChanged: 1, summary: "New cross-encoder scoring pass" },
        },
        {
          id: "ai-search-app/pgclient",
          kind: "module",
          name: "PgVector Pool Client",
          tech: "src/db/pgvector_pool.py",
          desc: "Async connection pool executing HNSW cosine similarity queries against vector-db-01.",
          deployed: ["vector-db-01"],
          live: { state: "running" },
          source: { path: "services/ai-search/src/db/pgvector_pool.py", lineRange: [22, 118], symbol: "AsyncVectorPool" },
        },
      ],
      rels: [
        { from: "ai-search-app/router", to: "ai-search-app/retriever", label: "Dispatches query", tech: "async call" },
        { from: "ai-search-app/retriever", to: "ai-search-app/pgclient", label: "Queries HNSW index", tech: "SQL / cosine" },
        { from: "ai-search-app/retriever", to: "ai-search-app/reranker", label: "Passes top-50 chunks", tech: "in-memory" },
      ],
    },
    "ai-search-app/retriever": {
      stratum: "Level 6 · Code Symbols & AST Call Graph (retriever.py)",
      summary: "AST-level functions, classes, and constants inside services/ai-search/src/search/retriever.py.",
      elements: [
        {
          id: "ai-search-app/retriever/embed",
          kind: "symbol",
          name: "encode_query_vector()",
          tech: "async def · L28–L64",
          desc: "Normalizes query text and computes 1536-dimensional unit embedding vector.",
          source: { path: "services/ai-search/src/search/retriever.py", lineRange: [28, 64], symbol: "async def encode_query_vector(text: str) -> list[float]" },
          next: 1,
        },
        {
          id: "ai-search-app/retriever/dense",
          kind: "symbol",
          name: "query_hnsw_chunks()",
          tech: "async def · L68–L119",
          desc: "Runs `<=>` cosine distance scan with `hnsw.ef_search = 120` and ACL filter.",
          source: { path: "services/ai-search/src/search/retriever.py", lineRange: [68, 119], symbol: "async def query_hnsw_chunks(vec, acl_groups)" },
          next: 2,
        },
        {
          id: "ai-search-app/retriever/rrf",
          kind: "symbol",
          name: "fuse_reciprocal_ranks()",
          tech: "def · L123–L178",
          desc: "Merges dense vector hits and BM25 lexical hits using k=60 Reciprocal Rank Fusion.",
          source: { path: "services/ai-search/src/search/retriever.py", lineRange: [123, 178], symbol: "def fuse_reciprocal_ranks(dense_hits, bm25_hits, k=60)" },
          diff: { changeType: "modified", filesChanged: 1, summary: "Tuned RRF k=60 weight curve" },
        },
      ],
      rels: [
        { from: "ai-search-app/retriever/embed", to: "ai-search-app/retriever/dense", label: "1536d float32[]", tech: "in-proc" },
        { from: "ai-search-app/retriever/dense", to: "ai-search-app/retriever/rrf", label: "Candidate rows", tech: "list[Chunk]" },
      ],
    },
    "vector-db-01": {
      stratum: "Level 5 · Database Schemas, HNSW Indexes & Storage (vector-db-01)",
      summary: "Inside vector-db-01: relational tables, pgvector HNSW index partitions, ACL join views, and WAL replication.",
      elements: [
        {
          id: "vector-db-01/docs_chunks",
          kind: "schema",
          name: "table: document_chunks",
          tech: "PostgreSQL Table · 1536d vector",
          desc: "Stores chunked document text, source URI, workspace ACL array, and `embedding vector(1536)`.",
          live: { state: "present", version: "4.2M rows" },
          source: { path: "services/ai-search/migrations/004_document_chunks.sql", lineRange: [1, 58], symbol: "CREATE TABLE document_chunks" },
        },
        {
          id: "vector-db-01/hnsw_idx",
          kind: "schema",
          name: "index: idx_chunks_hnsw_cosine",
          tech: "pgvector HNSW (m=16, ef=200)",
          desc: "Approximate nearest-neighbor cosine index partitioned by workspace_id.",
          live: { state: "running" },
          source: { path: "services/ai-search/migrations/005_hnsw_index.sql", lineRange: [1, 32], symbol: "USING hnsw (embedding vector_cosine_ops)" },
          diff: { changeType: "modified", filesChanged: 1, summary: "Raised ef_construction from 128 to 200" },
        },
        {
          id: "vector-db-01/acl_view",
          kind: "schema",
          name: "view: v_authorized_chunks",
          tech: "Row-Level Security View",
          desc: "Enforces user group intersection (`acl_groups && current_setting('app.groups')`) on every vector scan.",
          live: { state: "present" },
          source: { path: "services/ai-search/migrations/006_rls_policies.sql", lineRange: [1, 45], symbol: "CREATE POLICY chunk_isolation" },
        },
        {
          id: "vector-db-01/wal_shipper",
          kind: "storage",
          name: "WAL Archive & Snapshot",
          tech: "Continuous PITR Stream",
          desc: "Streams write-ahead log segments to `blob-backup-store` for point-in-time recovery.",
          deployed: ["blob-backup-store"],
          live: { state: "success" },
        },
      ],
      rels: [
        { from: "vector-db-01/hnsw_idx", to: "vector-db-01/docs_chunks", label: "Indexes vector(1536)", tech: "HNSW" },
        { from: "vector-db-01/acl_view", to: "vector-db-01/docs_chunks", label: "Filters rows by ACL", tech: "RLS" },
        { from: "vector-db-01/docs_chunks", to: "vector-db-01/wal_shipper", label: "Appends WAL blocks", tech: "pg_wal" },
      ],
    },
    "c-api/1": {
      stratum: "Level 4 (Code) · Auth & RBAC Guard Internals (rbac.go)",
      summary: "Inside Auth & RBAC Guard: OIDC JWKS key cache, JWT signature verifier, and subgraph lease evaluator.",
      elements: [
        {
          id: "c-api/1/jwks",
          kind: "symbol",
          name: "JWKSKeyCache",
          tech: "struct · rbac.go:L24",
          desc: "Caches rotating OIDC public keys from the Identity Provider with 15m background refresh.",
          source: { path: "services/api/internal/auth/rbac.go", lineRange: [24, 62], symbol: "type JWKSKeyCache struct" },
        },
        {
          id: "c-api/1/verify",
          kind: "symbol",
          name: "VerifyRBAC()",
          tech: "func · rbac.go:L66",
          desc: "Validates JWT claims, workspace role bindings, and ACP agent subgraph lease permissions.",
          source: { path: "services/api/internal/auth/rbac.go", lineRange: [66, 134], symbol: "func VerifyRBAC(ctx, token)" },
          diff: { changeType: "modified", filesChanged: 1, summary: "Added ACP subgraph lease check" },
        },
      ],
      rels: [
        { from: "c-api/1/verify", to: "c-api/1/jwks", label: "Looks up signing key", tech: "kid" },
      ],
    },
  },
};

