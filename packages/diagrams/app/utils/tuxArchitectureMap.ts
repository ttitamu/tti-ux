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

/**
 * Computes the upstream (dependencies that feed `rootNodeId`) and downstream
 * (dependents impacted by `rootNodeId`) blast-radius subgraph using directed BFS.
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

/** One dependency read from code: `from` depends on `to`. */
export interface TuxMapLink {
  from: string;
  to: string;
  /** e.g. imports, calls, runs, sources, loads, uses, checks, tests, routes, mentions */
  kind?: string;
  label?: string;
  /** The blast radius takes one step through this link and no further (a test, a doc, a deploy step). */
  stop?: boolean;
  /** Where it was read, as "path:line" */
  at?: string;
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

/** What a link kind means, read from the part it points at ("changing X: Y calls it"). */
export const TUX_MAP_LINK_KIND_LABELS: Record<string, string> = {
  imports: "imports it",
  calls: "calls it",
  runs: "runs it",
  sources: "sources it",
  loads: "loads it",
  uses: "reads or ships it",
  checks: "CI checks it",
  tests: "tests it",
  routes: "routes to it",
  mentions: "mentions it",
};

/**
 * child → parent for every element below Level 2: Level 3 components under their container,
 * subgraph elements under their key, inline `children` under their element.
 */
export function buildMapParentIndex(model: TuxMapLevelModel): Map<string, string> {
  const parentOf = new Map<string, string>();
  const inline = (pid: string, kids: TuxMapLevelElement[]) => {
    kids.forEach((k, i) => {
      const id = k.id || `${pid}/${i}`;
      if (!parentOf.has(id)) parentOf.set(id, pid);
      if (k.children?.length) inline(id, k.children);
    });
  };
  for (const [cid, kids] of Object.entries(model.level3)) inline(cid, kids);
  for (const e of [...model.level1.elements, ...model.level2.elements]) {
    if (e.children?.length) inline(e.id, e.children);
  }
  for (const n of model.level4.nodes) {
    if (n.children?.length) inline(n.id, n.children);
  }
  for (const [key, sg] of Object.entries(model.subgraphs || {})) inline(key, sg.elements);
  return parentOf;
}

/** `id` and its ancestors, nearest first. */
export function mapAncestorsOf(id: string, parentOf: Map<string, string>): string[] {
  const chain: string[] = [];
  let x: string | undefined = id;
  while (x && !chain.includes(x) && chain.length < 64) {
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
}

/**
 * The blast radius of changing `seedId`: every element that depends on it or on anything inside
 * it, upstream through `links`. The change first travels as far as the links that spread reach;
 * then a `stop` link (a test, a check, a doc) is followed one step out from everything it reached,
 * and no further. So an element both kinds reach is reached through the spreading one, and what
 * depends on it is in the radius too.
 * A link counts against what it names: one to a container of the seed (`N imports M`, with the
 * seed a function in M) is not followed. A link names its target as precisely as it is known.
 */
export function computeLinkBlastRadius(
  links: TuxMapLink[],
  seedId: string,
  parentOf: Map<string, string>,
  opts: { maxHops?: number } = {},
): { seeds: Set<string>; hits: Map<string, TuxMapBlastHit> } {
  const maxHops = opts.maxHops ?? 32;
  const kidsOf = new Map<string, string[]>();
  for (const [c, p] of parentOf) {
    const k = kidsOf.get(p) ?? [];
    k.push(c);
    kidsOf.set(p, k);
  }
  const seeds = new Set<string>([seedId]);
  const dq = [seedId];
  while (dq.length) {
    for (const c of kidsOf.get(dq.shift()!) ?? []) {
      if (!seeds.has(c)) {
        seeds.add(c);
        dq.push(c);
      }
    }
  }
  const into = new Map<string, TuxMapLink[]>();
  for (const l of links) {
    const arr = into.get(l.to) ?? [];
    arr.push(l);
    into.set(l.to, arr);
  }
  const hits = new Map<string, TuxMapBlastHit>();
  // breadth first through the links that spread; `q` ends in hop order
  const q: [string, number][] = [...seeds].map((x) => [x, 0]);
  for (let i = 0; i < q.length; i++) {
    const [x, hop] = q[i]!;
    if (hop >= maxHops) continue;
    for (const l of into.get(x) ?? []) {
      const y = l.from;
      if (l.stop || seeds.has(y) || hits.has(y)) continue;
      hits.set(y, { hop: hop + 1, via: l });
      q.push([y, hop + 1]);
    }
  }
  // then one step out through the links that stop, nearest first
  for (const [x, hop] of q) {
    if (hop >= maxHops) continue;
    for (const l of into.get(x) ?? []) {
      const y = l.from;
      if (!l.stop || seeds.has(y) || hits.has(y)) continue;
      hits.set(y, { hop: hop + 1, via: l });
    }
  }
  return { seeds, hits };
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

/**
 * Indexes a `TuxMapLevelModel` into a unified Code Property Graph (CPG) index
 * spanning Levels 1..N (Context, Containers, Components, Deployment, Modules, Schemas, AST Symbols).
 */
export function buildUnifiedArchitectureGraph(model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL): {
  nodes: Map<string, TuxMapGraphNodeRecord>;
  edges: TuxMapGraphEdgeRecord[];
} {
  const nodes = new Map<string, TuxMapGraphNodeRecord>();
  const edges: TuxMapGraphEdgeRecord[] = [];
  const normArr = (v?: string | string[]): string[] =>
    !v ? [] : Array.isArray(v) ? v : [v];

  // Level 1
  for (const e of model.level1.elements) {
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
  model.level1.rels.forEach((r, idx) => {
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
  for (const e of model.level2.elements) {
    if (e.ref && nodes.has(e.id)) continue;
    const deployed = normArr(e.deployed);
    nodes.set(e.id, {
      id: e.id,
      level: 2,
      kind: e.kind || "container",
      // a reference whose Level 1 element is missing is still named
      name: e.name ?? e.id,
      tech: e.tech,
      desc: e.desc,
      status: e.status,
      parentId: model.level2.boundary,
      deployed,
      source: e.source,
      diff: e.diff,
      roadmap: e.roadmap,
    });
    if (model.level2.boundary) {
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
  model.level2.rels.forEach((r, idx) => {
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
  for (const [parentId, kids] of Object.entries(model.level3)) {
    kids.forEach((k, idx) => {
      const id = k.id || `${parentId}/${idx}`;
      const deployed = normArr(k.deployed);
      nodes.set(id, {
        id,
        level: 3,
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
        level: 3,
        kind: "parent-child",
      });
      if (k.next != null && kids[k.next]) {
        const nextId = kids[k.next]!.id || `${parentId}/${k.next}`;
        edges.push({
          id: `l3-next-${id}-${nextId}`,
          from: id,
          to: nextId,
          level: 3,
          kind: "rel",
          planned: k.status === "planned",
        });
      }
    });
  }

  // Level 4
  for (const n of model.level4.nodes) {
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
  model.level4.links.forEach((l, idx) => {
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

  // Level 5, 6+ Subgraphs
  for (const [parentId, sg] of Object.entries(model.subgraphs || {})) {
    const parentDepth = nodes.get(parentId)?.level ?? 4;
    const childLevel = Math.max(5, parentDepth + 1);
    sg.elements.forEach((k, idx) => {
      const id = k.id || `${parentId}/${idx}`;
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
    });
    (sg.rels || []).forEach((r, idx) => {
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
  (model.links || []).forEach((l, idx) => {
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

  return { nodes, edges };
}

/**
 * Queries a specific semantic level or parent subgraph from a `TuxMapLevelModel`
 * (used by MCP `tux_query_architecture_layer`).
 */
export function queryArchitectureLayer(
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  opts: { level?: number; focusId?: string; includePlanned?: boolean } = {},
) {
  const { nodes, edges } = buildUnifiedArchitectureGraph(model);
  const includePlanned = opts.includePlanned ?? true;
  const focusId = opts.focusId?.trim();
  const level = opts.level;

  const matchedNodes = [...nodes.values()].filter((n) => {
    if (!includePlanned && n.status === "planned") return false;
    if (focusId) return n.parentId === focusId || n.id === focusId;
    if (level != null) return n.level === level;
    return true;
  });

  const matchedIds = new Set(matchedNodes.map((n) => n.id));
  const matchedEdges = edges.filter(
    (e) =>
      (includePlanned || !e.planned) &&
      (matchedIds.has(e.from) || matchedIds.has(e.to)),
  );

  return {
    level: level ?? "all",
    focusId: focusId || null,
    nodeCount: matchedNodes.length,
    edgeCount: matchedEdges.length,
    nodes: matchedNodes,
    edges: matchedEdges,
  };
}

/**
 * Computes multi-level k-hop upstream/downstream blast radius and impacted source files
 * for any node ID across Levels 1..N (used by MCP `tux_get_blast_radius`).
 */
export function queryMultiLevelBlastRadius(
  nodeId: string,
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
  maxHops = 2,
) {
  const { nodes, edges } = buildUnifiedArchitectureGraph(model);
  const root = nodes.get(nodeId);
  if (!root) {
    return {
      error: `Node '${nodeId}' not found in architecture graph.`,
      availableNodeIds: [...nodes.keys()],
    };
  }

  const upstream = new Map<string, number>();
  const downstream = new Map<string, number>();
  const childTree = new Set<string>();
  const impactedEdgeIds = new Set<string>();

  // Collect descendant nodes (components/modules/symbols inside `nodeId`)
  const descQueue = [nodeId];
  while (descQueue.length > 0) {
    const curr = descQueue.shift()!;
    for (const e of edges) {
      if (e.kind === "parent-child" && e.from === curr && !childTree.has(e.to)) {
        childTree.add(e.to);
        descQueue.push(e.to);
      }
    }
  }

  const seedSet = new Set<string>([nodeId, ...childTree]);
  if (root.parentId) seedSet.add(root.parentId);

  // Downstream BFS (nodes that `nodeId` calls/hosts/feeds)
  const downQ: { id: string; hop: number }[] = [...seedSet].map((id) => ({ id, hop: 0 }));
  while (downQ.length > 0) {
    const { id, hop } = downQ.shift()!;
    if (hop >= maxHops) continue;
    for (const e of edges) {
      if (e.kind === "parent-child") continue;
      if (e.from === id) {
        impactedEdgeIds.add(e.id);
        if (!seedSet.has(e.to) && (!downstream.has(e.to) || downstream.get(e.to)! > hop + 1)) {
          downstream.set(e.to, hop + 1);
          downQ.push({ id: e.to, hop: hop + 1 });
        }
      }
    }
  }

  // Upstream BFS (callers/consumers that depend on `nodeId`)
  const upQ: { id: string; hop: number }[] = [...seedSet].map((id) => ({ id, hop: 0 }));
  while (upQ.length > 0) {
    const { id, hop } = upQ.shift()!;
    if (hop >= maxHops) continue;
    for (const e of edges) {
      if (e.kind === "parent-child") continue;
      if (e.to === id) {
        impactedEdgeIds.add(e.id);
        if (!seedSet.has(e.from) && (!upstream.has(e.from) || upstream.get(e.from)! > hop + 1)) {
          upstream.set(e.from, hop + 1);
          upQ.push({ id: e.from, hop: hop + 1 });
        }
      }
    }
  }

  const allTouchedIds = new Set<string>([
    ...seedSet,
    ...upstream.keys(),
    ...downstream.keys(),
  ]);

  const impactedFiles: TuxMapSourceRef[] = [];
  const seenPaths = new Set<string>();
  for (const id of allTouchedIds) {
    const src = nodes.get(id)?.source;
    if (src && !seenPaths.has(src.path)) {
      seenPaths.add(src.path);
      impactedFiles.push(src);
    }
  }

  return {
    rootNode: root,
    maxHops,
    descendantIds: [...childTree],
    upstreamDependents: [...upstream.entries()].map(([id, hop]) => ({
      id,
      hop,
      node: nodes.get(id),
    })),
    downstreamDependencies: [...downstream.entries()].map(([id, hop]) => ({
      id,
      hop,
      node: nodes.get(id),
    })),
    impactedEdgeIds: [...impactedEdgeIds],
    impactedSourceFiles: impactedFiles,
  };
}

/**
 * Finds the shortest architectural dependency path between `fromNodeId` and `toNodeId`
 * across Levels 1..N (used by MCP `tux_find_shortest_path`).
 */
export function findShortestArchitecturePath(
  fromNodeId: string,
  toNodeId: string,
  model: TuxMapLevelModel = DEFAULT_TTI_LEVEL_MODEL,
) {
  const { nodes, edges } = buildUnifiedArchitectureGraph(model);
  if (!nodes.has(fromNodeId)) {
    return { error: `Source node '${fromNodeId}' not found.` };
  }
  if (!nodes.has(toNodeId)) {
    return { error: `Target node '${toNodeId}' not found.` };
  }
  if (fromNodeId === toNodeId) {
    return {
      found: true,
      hops: 0,
      nodePath: [nodes.get(fromNodeId)!],
      edges: [],
    };
  }

  const queue: string[] = [fromNodeId];
  const prev = new Map<string, { prevId: string; edge: TuxMapGraphEdgeRecord }>();
  const visited = new Set<string>([fromNodeId]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === toNodeId) break;
    for (const e of edges) {
      const next = e.from === curr ? e.to : e.to === curr ? e.from : null;
      if (next && !visited.has(next)) {
        visited.add(next);
        prev.set(next, { prevId: curr, edge: e });
        queue.push(next);
      }
    }
  }

  if (!prev.has(toNodeId)) {
    return {
      found: false,
      hops: -1,
      nodePath: [],
      edges: [],
    };
  }

  const pathNodes: TuxMapGraphNodeRecord[] = [];
  const pathEdges: TuxMapGraphEdgeRecord[] = [];
  let cursor: string | undefined = toNodeId;
  while (cursor) {
    const n = nodes.get(cursor);
    if (n) pathNodes.unshift(n);
    const step = prev.get(cursor);
    if (!step) break;
    pathEdges.unshift(step.edge);
    cursor = step.prevId;
  }

  return {
    found: true,
    hops: pathEdges.length,
    nodePath: pathNodes,
    edges: pathEdges,
  };
}

const activeAcpLeases = new Map<string, TuxMapAcpLease>();

/**
 * ACP (Agent Communication Protocol) Subgraph Lease Coordinator:
 * Grants an exclusive, non-overlapping subgraph lease (`rootNodeId` + its descendants)
 * to an AI agent and rejects conflicting locks on overlapping nodes or source files.
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

  // Acquire lease
  const agentId = opts.agentId || "agent-anonymous";
  const rootNodeId = opts.rootNodeId;
  if (!rootNodeId) {
    return { acquired: false, error: "rootNodeId is required to acquire an ACP subgraph lease." };
  }

  const model = opts.model || DEFAULT_TTI_LEVEL_MODEL;
  const blast = queryMultiLevelBlastRadius(rootNodeId, model, 1);
  if ("error" in blast) {
    return { acquired: false, error: blast.error };
  }

  const requestedScope = new Set<string>([rootNodeId, ...blast.descendantIds]);
  const { nodes } = buildUnifiedArchitectureGraph(model);
  const requestedFiles = new Set<string>();
  for (const id of requestedScope) {
    const p = nodes.get(id)?.source?.path;
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

