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
  | "route"
  | "external"
  | "resource";

/** Canonical human-readable labels for `TuxMapElementKind` (`#122`). */
export const TUX_MAP_ELEMENT_KIND_LABELS: Record<TuxMapElementKind, string> = {
  person: "Person",
  system: "Software system",
  container: "Container",
  database: "Container: database",
  storage: "Container: storage",
  component: "Component",
  module: "Module / package",
  schema: "Data schema / index",
  symbol: "Code symbol (AST)",
  route: "HTTP route",
  external: "External system",
  resource: "Deployment node",
};

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

export interface TuxMapRouteEntry {
  method?: string;
  pattern: string;
  handler: string;
  framework?: string;
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
  /** Optional HTTP route table linking URL patterns to handler symbols or files (`#120`, `#122`). */
  routes?: TuxMapRouteEntry[];
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
  mini?: boolean;
  side?: "in" | "out";
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

function simplifyOrthogonalPoints(raw: [number, number][]): [number, number][] {
  if (raw.length <= 2) return raw;
  const dedup: [number, number][] = [raw[0]!];
  for (let i = 1; i < raw.length; i++) {
    const prev = dedup[dedup.length - 1]!;
    const cur = raw[i]!;
    if (Math.abs(cur[0] - prev[0]) < 0.01 && Math.abs(cur[1] - prev[1]) < 0.01) continue;
    dedup.push(cur);
  }
  if (dedup.length <= 2) return dedup;
  const out: [number, number][] = [dedup[0]!];
  for (let i = 1; i < dedup.length - 1; i++) {
    const a = out[out.length - 1]!;
    const b = dedup[i]!;
    const c = dedup[i + 1]!;
    const sameX = Math.abs(a[0] - b[0]) < 0.01 && Math.abs(b[0] - c[0]) < 0.01;
    const sameY = Math.abs(a[1] - b[1]) < 0.01 && Math.abs(b[1] - c[1]) < 0.01;
    if (sameX || sameY) continue;
    out.push(b);
  }
  out.push(dedup[dedup.length - 1]!);
  return out;
}

interface GapBand {
  key: string;
  lo: number;
  hi: number;
}

interface CorridorLaneRequest {
  spanLo: number;
  spanHi: number;
  startPos: number;
  endPos: number;
  startDir: -1 | 0 | 1;
  endDir: -1 | 0 | 1;
  apply: (coord: number) => void;
}

function mergeNumericBands(spans: [number, number][]): [number, number][] {
  if (spans.length === 0) return [];
  const sorted = spans.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: [number, number][] = [[sorted[0]![0], sorted[0]![1]]];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i]!;
    const last = merged[merged.length - 1]!;
    if (cur[0] <= last[1] + 1) {
      if (cur[1] > last[1]) last[1] = cur[1];
    } else {
      merged.push([cur[0], cur[1]]);
    }
  }
  return merged;
}

function stubPairCrossings(
  u: CorridorLaneRequest,
  cu: number,
  v: CorridorLaneRequest,
  cv: number,
): number {
  if (cu === cv) return 2;
  let c = 0;
  if (u.startDir !== 0 && v.spanLo + 0.5 < u.startPos && u.startPos < v.spanHi - 0.5) {
    if ((u.startDir === -1 && cv < cu) || (u.startDir === 1 && cv > cu)) c++;
  }
  if (u.endDir !== 0 && v.spanLo + 0.5 < u.endPos && u.endPos < v.spanHi - 0.5) {
    if ((u.endDir === -1 && cv < cu) || (u.endDir === 1 && cv > cu)) c++;
  }
  if (v.startDir !== 0 && u.spanLo + 0.5 < v.startPos && v.startPos < u.spanHi - 0.5) {
    if ((v.startDir === -1 && cu < cv) || (v.startDir === 1 && cu > cv)) c++;
  }
  if (v.endDir !== 0 && u.spanLo + 0.5 < v.endPos && v.endPos < u.spanHi - 0.5) {
    if ((v.endDir === -1 && cu < cv) || (v.endDir === 1 && cu > cv)) c++;
  }
  return c;
}

function assignCorridorLanes(gapLo: number, gapHi: number, reqs: CorridorLaneRequest[]): void {
  if (reqs.length === 0) return;
  const gap = gapHi - gapLo;
  const sorted = reqs
    .slice()
    .sort(
      (a, b) =>
        a.spanLo - b.spanLo ||
        a.startDir + a.endDir - (b.startDir + b.endDir) ||
        b.spanHi - a.spanHi,
    );

  // Split into connected overlap components so independent clusters get wide spacing
  const components: CorridorLaneRequest[][] = [];
  let curComp: CorridorLaneRequest[] = [sorted[0]!];
  let compMaxHi = sorted[0]!.spanHi;
  for (let i = 1; i < sorted.length; i++) {
    const r = sorted[i]!;
    if (r.spanLo > compMaxHi + 0.5) {
      components.push(curComp);
      curComp = [r];
      compMaxHi = r.spanHi;
    } else {
      curComp.push(r);
      if (r.spanHi > compMaxHi) compMaxHi = r.spanHi;
    }
  }
  components.push(curComp);

  for (const comp of components) {
    const m = comp.length;
    if (m === 1) {
      comp[0]!.apply(Number(((gapLo + gapHi) / 2).toFixed(2)));
      continue;
    }

    // Optimal interval-graph greedy colouring in increasing `spanLo` order
    const colours = new Array<number>(m).fill(-1);
    const overlaps: number[][] = Array.from({ length: m }, () => []);
    for (let i = 0; i < m; i++) {
      for (let j = i + 1; j < m; j++) {
        if (Math.max(comp[i]!.spanLo, comp[j]!.spanLo) <= Math.min(comp[i]!.spanHi, comp[j]!.spanHi) + 0.5) {
          overlaps[i]!.push(j);
          overlaps[j]!.push(i);
        }
      }
    }

    let numColours = 0;
    for (let i = 0; i < m; i++) {
      const used = new Set<number>();
      for (const nb of overlaps[i]!) {
        if (colours[nb]! >= 0) used.add(colours[nb]!);
      }
      let c = 0;
      while (used.has(c)) c++;
      colours[i] = c;
      if (c + 1 > numColours) numColours = c + 1;
    }

    // Crossing-minimizing refinement: reassign free tracks and permute colour classes
    if (numColours > 1 && numColours <= 48) {
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < m; i++) {
          const used = new Set<number>();
          for (const nb of overlaps[i]!) used.add(colours[nb]!);
          let bestC = colours[i]!;
          let bestCost = 0;
          for (const nb of overlaps[i]!) {
            bestCost += stubPairCrossings(comp[i]!, bestC, comp[nb]!, colours[nb]!);
          }
          if (bestCost === 0) continue;
          for (let c = 0; c < numColours; c++) {
            if (c === bestC || used.has(c)) continue;
            let cost = 0;
            for (const nb of overlaps[i]!) {
              cost += stubPairCrossings(comp[i]!, c, comp[nb]!, colours[nb]!);
            }
            if (cost < bestCost) {
              bestCost = cost;
              bestC = c;
            }
          }
          colours[i] = bestC;
        }
      }

      // Pairwise colour-class swap pass (preserves exact chromatic number `numColours`)
      for (let c1 = 0; c1 < numColours; c1++) {
        for (let c2 = c1 + 1; c2 < numColours; c2++) {
          let before = 0;
          let after = 0;
          for (let i = 0; i < m; i++) {
            const ci = colours[i]!;
            const nci = ci === c1 ? c2 : ci === c2 ? c1 : ci;
            for (const j of overlaps[i]!) {
              if (j <= i) continue;
              const cj = colours[j]!;
              const ncj = cj === c1 ? c2 : cj === c2 ? c1 : cj;
              if (ci !== c1 && ci !== c2 && cj !== c1 && cj !== c2) continue;
              before += stubPairCrossings(comp[i]!, ci, comp[j]!, cj);
              after += stubPairCrossings(comp[i]!, nci, comp[j]!, ncj);
            }
          }
          if (after < before) {
            for (let i = 0; i < m; i++) {
              if (colours[i] === c1) colours[i] = c2;
              else if (colours[i] === c2) colours[i] = c1;
            }
          }
        }
      }
    }

    const usable = Math.max(0, gap - 12);
    const step = numColours <= 1 ? 0 : Math.min(11, usable / (numColours - 1));
    const start = (gapLo + gapHi) / 2 - (step * (numColours - 1)) / 2;
    const minAllowed = gap >= 12 ? gapLo + 6 : gapLo;
    const maxAllowed = gap >= 12 ? gapHi - 6 : gapHi;
    for (let i = 0; i < m; i++) {
      const rawCoord = start + colours[i]! * step;
      const clamped = Math.max(minAllowed, Math.min(maxAllowed, rawCoord));
      comp[i]!.apply(Number(clamped.toFixed(2)));
    }
  }
}

/**
 * Routes wires at right angles strictly through the gaps between columns and rows,
 * never crossing a card, with per-gap interval-coloured lanes and collision-checked labels (`#113`).
 */
export function routeGridWires(
  rels: TuxMapLevelRel[],
  rects: Record<string, TuxMapGridCellRect>,
  els: TuxMapLevelElement[],
): { wires: TuxMapRoutedWire[]; labels: TuxMapRoutedLabel[] } {
  const { GX, GY } = GRID_METRICS;
  const elById = new Map<string, TuxMapLevelElement>();
  for (const e of els) elById.set(e.id, e);

  const isOutsideCard = (id: string, r: TuxMapGridCellRect): boolean => {
    const el = elById.get(id);
    return Boolean(r.mini || r.side || el?.mini || el?.side);
  };

  const outsideSideOf = (id: string, r: TuxMapGridCellRect): "in" | "out" | undefined =>
    r.side || elById.get(id)?.side;

  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const cardEntries: Array<[string, TuxMapGridCellRect]> = [];
  for (const k of Object.keys(rects)) {
    const r = rects[k]!;
    if (!r.bound) {
      cardEntries.push([k, r]);
      placed.push({ x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 });
    }
  }
  const cards = placed.slice();

  // Discover exact vertical column gaps and horizontal inner-row gaps from card geometry
  const colBands = mergeNumericBands(cardEntries.map(([, r]) => [r.x, r.x + r.w]));
  const vGaps: GapBand[] = [];
  if (colBands.length > 0) {
    const leftOuterLo = Math.max(2, colBands[0]![0] - GX);
    if (colBands[0]![0] - leftOuterLo >= 14) {
      vGaps.push({ key: "v_outer_l", lo: leftOuterLo, hi: colBands[0]![0] });
    }
    for (let i = 0; i < colBands.length - 1; i++) {
      if (colBands[i + 1]![0] - colBands[i]![1] >= 12) {
        vGaps.push({ key: `v_${i}`, lo: colBands[i]![1], hi: colBands[i + 1]![0] });
      }
    }
    const lastCol = colBands[colBands.length - 1]!;
    vGaps.push({ key: "v_outer_r", lo: lastCol[1], hi: lastCol[1] + GX });
  }

  const innerCardEntries = cardEntries.filter(([id, r]) => !isOutsideCard(id, r));
  const rowSource = innerCardEntries.length > 0 ? innerCardEntries : cardEntries;
  const rowBands = mergeNumericBands(rowSource.map(([, r]) => [r.y, r.y + r.h]));
  const hGaps: GapBand[] = [];
  if (rowBands.length > 0) {
    const topLo = Math.max(2, rowBands[0]![0] - GY);
    if (rowBands[0]![0] - topLo >= 14) {
      hGaps.push({ key: "h_top", lo: topLo, hi: rowBands[0]![0] });
    }
    for (let i = 0; i < rowBands.length - 1; i++) {
      if (rowBands[i + 1]![0] - rowBands[i]![1] >= 12) {
        hGaps.push({ key: `h_${i}`, lo: rowBands[i]![1], hi: rowBands[i + 1]![0] });
      }
    }
    const lastRow = rowBands[rowBands.length - 1]!;
    hGaps.push({ key: "h_bot", lo: lastRow[1], hi: lastRow[1] + GY });
  }

  const vGapRightOf = (r: TuxMapGridCellRect): GapBand => {
    const edge = r.x + r.w;
    let best: GapBand | null = null;
    for (const g of vGaps) {
      if (g.lo >= edge - 1 && (!best || g.lo < best.lo)) best = g;
    }
    return best ?? { key: `vr_${Math.round(edge)}`, lo: edge, hi: edge + GX };
  };

  const vGapLeftOf = (r: TuxMapGridCellRect): GapBand => {
    const edge = r.x;
    let best: GapBand | null = null;
    for (const g of vGaps) {
      if (g.hi <= edge + 1 && (!best || g.hi > best.hi)) best = g;
    }
    return best ?? { key: `vl_${Math.round(edge)}`, lo: Math.max(2, edge - GX), hi: edge };
  };

  const hGapBelow = (r: TuxMapGridCellRect): GapBand => {
    const edge = r.y + r.h;
    let best: GapBand | null = null;
    for (const g of hGaps) {
      if (g.lo >= edge - 1 && (!best || g.lo < best.lo)) best = g;
    }
    return best ?? { key: `hb_${Math.round(edge)}`, lo: edge, hi: edge + GY };
  };

  const hGapAbove = (r: TuxMapGridCellRect): GapBand => {
    const edge = r.y;
    let best: GapBand | null = null;
    for (const g of hGaps) {
      if (g.hi <= edge + 1 && (!best || g.hi > best.hi)) best = g;
    }
    return best ?? { key: `ht_${Math.round(edge)}`, lo: Math.max(2, edge - GY), hi: edge };
  };

  // Strict collision check: non-endpoint cards cannot be hit by any segment; endpoint cards `a` and `b`
  // can ONLY touch segment `0` (at port `P`, moving strictly outward) and the final segment (at port `Q`,
  // approaching strictly from outside) — never passed through by middle runs or backwards stubs!
  function segHitsRect(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    r: TuxMapGridCellRect,
  ): boolean {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    return maxX > r.x + 0.5 && minX < r.x + r.w - 0.5 && maxY > r.y + 0.5 && minY < r.y + r.h - 0.5;
  }

  function stubMovesOutward(port: [number, number], next: [number, number], sideChar: string): boolean {
    if (sideChar === "r") return next[0] >= port[0] - 0.01 && Math.abs(next[1] - port[1]) < 0.01;
    if (sideChar === "l") return next[0] <= port[0] + 0.01 && Math.abs(next[1] - port[1]) < 0.01;
    if (sideChar === "b") return next[1] >= port[1] - 0.01 && Math.abs(next[0] - port[0]) < 0.01;
    return next[1] <= port[1] + 0.01 && Math.abs(next[0] - port[0]) < 0.01;
  }

  function polyIsClean(
    pts: [number, number][],
    a: TuxMapGridCellRect,
    s0: string,
    b: TuxMapGridCellRect,
    s1: string,
  ): boolean {
    if (pts.length < 2) return false;
    if (!a.bound && !stubMovesOutward(pts[0]!, pts[1]!, s0)) return false;
    if (!b.bound && !stubMovesOutward(pts[pts.length - 1]!, pts[pts.length - 2]!, s1)) return false;
    const lastSeg = pts.length - 2;
    for (let i = 0; i <= lastSeg; i++) {
      const p0 = pts[i]!;
      const p1 = pts[i + 1]!;
      for (let ci = 0; ci < cardEntries.length; ci++) {
        const r = cardEntries[ci]![1];
        if (i === 0 && r === a) continue;
        if (i === lastSeg && r === b) continue;
        if (segHitsRect(p0[0], p0[1], p1[0], p1[1], r)) return false;
      }
    }
    return true;
  }

  interface RoutedPathState {
    rel: TuxMapLevelRel;
    a: TuxMapGridCellRect;
    b: TuxMapGridCellRect;
    s: [string, string];
    fa?: number;
    fb?: number;
    pts: [number, number][];
  }

  const paths: RoutedPathState[] = [];
  const ports: Record<string, { p: RoutedPathState; key: "fa" | "fb"; o: number; tie: number }[]> = {};

  for (const rel of rels) {
    const a = rects[rel.from];
    const b = rects[rel.to];
    if (a && b) {
      paths.push({ rel, a, b, s: ["r", "l"], pts: [] });
    }
  }

  const maxCardRight = colBands.length > 0 ? colBands[colBands.length - 1]![1] : 680;
  function side(
    fromId: string,
    a: TuxMapGridCellRect,
    toId: string,
    b: TuxMapGridCellRect,
  ): [string, string] {
    if (a.bound) return b.x > a.x + a.w / 2 ? ["r", "l"] : ["l", "r"];
    if (b.bound) return a.x < b.x ? ["r", "l"] : ["l", "r"];
    // Outside cards ALWAYS attach on left/right ports (#113), never top/bottom across intermediate cards
    if (isOutsideCard(fromId, a) || isOutsideCard(toId, b)) {
      const acx = a.x + a.w / 2;
      const bcx = b.x + b.w / 2;
      if (Math.abs(bcx - acx) > 1) {
        return bcx > acx ? ["r", "l"] : ["l", "r"];
      }
      // Same outside stack: route inward into the adjacent inter-column gap
      const aSide = outsideSideOf(fromId, a) ?? outsideSideOf(toId, b);
      if (aSide === "out" || acx > maxCardRight / 2) return ["l", "l"];
      return ["r", "r"];
    }
    const ac = a.c ?? 0;
    const ar = a.r ?? 0;
    const bc = b.c ?? 0;
    const br = b.r ?? 0;
    if (ac === bc) {
      if (Math.abs(ar - br) > 1) {
        // Prefer an inner inter-column gap over an outer margin when at rightmost column
        const hasRightCol = colBands.length > 1 && a.x + a.w < colBands[colBands.length - 1]![0] - 1;
        return hasRightCol || colBands.length <= 1 ? ["r", "r"] : ["l", "l"];
      }
      return br > ar ? ["b", "t"] : ["t", "b"];
    }
    if (Math.abs(br - ar) >= 2 && Math.abs(bc - ac) <= 1) {
      return br > ar ? ["b", "t"] : ["t", "b"];
    }
    return bc > ac ? ["r", "l"] : ["l", "r"];
  }

  paths.forEach((p, idx) => {
    p.s = side(p.rel.from, p.a, p.rel.to, p.b);
    const entries: [string, string, TuxMapGridCellRect, "fa" | "fb"][] = [
      [p.rel.from, p.s[0], p.b, "fa"],
      [p.rel.to, p.s[1], p.a, "fb"],
    ];
    for (const x of entries) {
      const k = `${x[0]}\u0000${x[1]}`;
      if (!ports[k]) ports[k] = [];
      ports[k]!.push({
        p,
        key: x[3],
        o: x[1] === "l" || x[1] === "r" ? x[2].y + x[2].h / 2 : x[2].x + x[2].w / 2,
        tie: x[1] === "l" || x[1] === "r" ? x[2].x + idx * 0.001 : x[2].y + idx * 0.001,
      });
    }
  });

  for (const k of Object.keys(ports)) {
    const list = ports[k]!.sort((u, v) => u.o - v.o || u.tie - v.tie);
    const total = list.length;
    list.forEach((x, j) => {
      x.p[x.key] = total === 1 ? 0.5 : 0.16 + (j / (total - 1)) * 0.68;
    });
  }

  function at(r: TuxMapGridCellRect, s: string, f = 0.5): [number, number] {
    if (s === "l") return [r.x, Number((r.y + r.h * f).toFixed(2))];
    if (s === "r") return [r.x + r.w, Number((r.y + r.h * f).toFixed(2))];
    if (s === "t") return [Number((r.x + r.w * f).toFixed(2)), r.y];
    return [Number((r.x + r.w * f).toFixed(2)), r.y + r.h];
  }

  const gapRegistry = new Map<string, { band: GapBand; reqs: CorridorLaneRequest[] }>();
  const registerLane = (band: GapBand, req: CorridorLaneRequest) => {
    let entry = gapRegistry.get(band.key);
    if (!entry) {
      entry = { band, reqs: [] };
      gapRegistry.set(band.key, entry);
    }
    entry.reqs.push(req);
  };

  // Pass 1: Choose obstacle-free corridor topology for each wire and register interval-colouring spans
  for (const p of paths) {
    const { a, b, s } = p;
    if (a.bound || b.bound) {
      const n = a.bound ? b : a;
      const y = Number((n.y + n.h * ((a.bound ? p.fb : p.fa) ?? 0.5)).toFixed(2));
      const P: [number, number] = a.bound ? [s[0] === "r" ? a.x + a.w : a.x, y] : at(a, s[0], p.fa);
      const Q: [number, number] = b.bound ? [s[1] === "l" ? b.x : b.x + b.w, y] : at(b, s[1], p.fb);
      p.pts = [P, Q];
      continue;
    }

    const P = at(a, s[0], p.fa);
    const Q = at(b, s[1], p.fb);

    if ((s[0] === "r" && s[1] === "r") || (s[0] === "l" && s[1] === "l")) {
      const vg = s[0] === "r" ? vGapRightOf(a.x + a.w >= b.x + b.w ? a : b) : vGapLeftOf(a.x <= b.x ? a : b);
      const midX = (vg.lo + vg.hi) / 2;
      const pts: [number, number][] = [P, [midX, P[1]], [midX, Q[1]], Q];
      p.pts = pts;
      const stubDir: -1 | 1 = s[0] === "r" ? -1 : 1;
      registerLane(vg, {
        spanLo: Math.min(P[1], Q[1]),
        spanHi: Math.max(P[1], Q[1]),
        startPos: P[1],
        endPos: Q[1],
        startDir: stubDir,
        endDir: stubDir,
        apply: (cx) => {
          pts[1]![0] = cx;
          pts[2]![0] = cx;
        },
      });
      continue;
    }

    if (s[0] === "b" || s[0] === "t") {
      const down = s[0] === "b";
      const hgPrimary = down ? hGapBelow(a) : hGapAbove(a);
      const midY = (hgPrimary.lo + hgPrimary.hi) / 2;
      const simplePts: [number, number][] = [P, [P[0], midY], [Q[0], midY], Q];
      if (polyIsClean(simplePts, a, s[0], b, s[1])) {
        p.pts = simplePts;
        registerLane(hgPrimary, {
          spanLo: Math.min(P[0], Q[0]),
          spanHi: Math.max(P[0], Q[0]),
          startPos: P[0],
          endPos: Q[0],
          startDir: down ? -1 : 1,
          endDir: down ? 1 : -1,
          apply: (cy) => {
            simplePts[1]![1] = cy;
            simplePts[2]![1] = cy;
          },
        });
      } else {
        const hgA = down ? hGapBelow(a) : hGapAbove(a);
        const hgB = down ? hGapAbove(b) : hGapBelow(b);
        const vgCandidates = [
          b.x < a.x ? vGapLeftOf(a) : vGapRightOf(a),
          b.x < a.x ? vGapRightOf(b) : vGapLeftOf(b),
          ...vGaps,
        ];
        let chosenVg = vgCandidates[0]!;
        const y1Init = (hgA.lo + hgA.hi) / 2;
        const y2Init = (hgB.lo + hgB.hi) / 2;
        for (const vg of vgCandidates) {
          const xInit = (vg.lo + vg.hi) / 2;
          const testPts: [number, number][] = [
            P,
            [P[0], y1Init],
            [xInit, y1Init],
            [xInit, y2Init],
            [Q[0], y2Init],
            Q,
          ];
          if (polyIsClean(testPts, a, s[0], b, s[1])) {
            chosenVg = vg;
            break;
          }
        }
        const xInit = (chosenVg.lo + chosenVg.hi) / 2;
        const detourPts: [number, number][] = [
          P,
          [P[0], y1Init],
          [xInit, y1Init],
          [xInit, y2Init],
          [Q[0], y2Init],
          Q,
        ];
        p.pts = detourPts;
        registerLane(hgA, {
          spanLo: Math.min(P[0], xInit),
          spanHi: Math.max(P[0], xInit),
          startPos: P[0],
          endPos: xInit,
          startDir: down ? -1 : 1,
          endDir: y2Init >= y1Init ? 1 : -1,
          apply: (cy) => {
            detourPts[1]![1] = cy;
            detourPts[2]![1] = cy;
          },
        });
        registerLane(chosenVg, {
          spanLo: Math.min(y1Init, y2Init),
          spanHi: Math.max(y1Init, y2Init),
          startPos: y1Init,
          endPos: y2Init,
          startDir: P[0] <= xInit ? -1 : 1,
          endDir: Q[0] <= xInit ? -1 : 1,
          apply: (cx) => {
            detourPts[2]![0] = cx;
            detourPts[3]![0] = cx;
          },
        });
        registerLane(hgB, {
          spanLo: Math.min(xInit, Q[0]),
          spanHi: Math.max(xInit, Q[0]),
          startPos: xInit,
          endPos: Q[0],
          startDir: y2Init >= y1Init ? -1 : 1,
          endDir: down ? 1 : -1,
          apply: (cy) => {
            detourPts[3]![1] = cy;
            detourPts[4]![1] = cy;
          },
        });
      }
      continue;
    }

    // Horizontal port exit/entry: ["r", "l"] or ["l", "r"]
    const dir = s[0] === "r" ? 1 : -1;
    const vgStart = dir > 0 ? vGapRightOf(a) : vGapLeftOf(a);
    const vgEnd = dir > 0 ? vGapLeftOf(b) : vGapRightOf(b);

    // 1. Check if a single vertical gap between `a` and `b` gives a clean 3-segment Z-wire
    const betweenVGaps = vGaps.filter((g) =>
      dir > 0 ? g.lo >= a.x + a.w - 1 && g.hi <= b.x + 1 : g.hi <= a.x + 1 && g.lo >= b.x + b.w - 1,
    );
    let singleVGap: GapBand | null = null;
    if (vgStart.key === vgEnd.key) {
      const gx = (vgStart.lo + vgStart.hi) / 2;
      if (polyIsClean([P, [gx, P[1]], [gx, Q[1]], Q], a, s[0], b, s[1])) {
        singleVGap = vgStart;
      }
    }
    if (!singleVGap && betweenVGaps.length > 0) {
      const targetMidX = (P[0] + Q[0]) / 2;
      const orderedVGaps = betweenVGaps
        .slice()
        .sort((u, v) => Math.abs((u.lo + u.hi) / 2 - targetMidX) - Math.abs((v.lo + v.hi) / 2 - targetMidX));
      for (const vg of orderedVGaps) {
        // Test worst-case edges of `[vg.lo + 6, vg.hi - 6]` so lane shifts cannot clip a card
        const loX = vg.hi - vg.lo >= 12 ? vg.lo + 6 : (vg.lo + vg.hi) / 2;
        const hiX = vg.hi - vg.lo >= 12 ? vg.hi - 6 : (vg.lo + vg.hi) / 2;
        if (
          polyIsClean([P, [loX, P[1]], [loX, Q[1]], Q], a, s[0], b, s[1]) &&
          polyIsClean([P, [hiX, P[1]], [hiX, Q[1]], Q], a, s[0], b, s[1])
        ) {
          singleVGap = vg;
          break;
        }
      }
    }

    if (singleVGap) {
      const gx = (singleVGap.lo + singleVGap.hi) / 2;
      const zPts: [number, number][] = [P, [gx, P[1]], [gx, Q[1]], Q];
      p.pts = zPts;
      registerLane(singleVGap, {
        spanLo: Math.min(P[1], Q[1]),
        spanHi: Math.max(P[1], Q[1]),
        startPos: P[1],
        endPos: Q[1],
        startDir: dir > 0 ? -1 : 1,
        endDir: dir > 0 ? 1 : -1,
        apply: (cx) => {
          zPts[1]![0] = cx;
          zPts[2]![0] = cx;
        },
      });
      continue;
    }

    // 2. Multi-column dogleg `[P, [x1, P[1]], [x1, yg], [x2, yg], [x2, Q[1]], Q]`:
    //    `x1` stays in `vgStart`, `yg` runs in the nearest clean inner-row gap `hg`, and `x2` stays in `vgEnd`.
    const targetMidY = (P[1] + Q[1]) / 2;
    const orderedHGaps = hGaps
      .slice()
      .sort((u, v) => {
        const uMid = (u.lo + u.hi) / 2;
        const vMid = (v.lo + v.hi) / 2;
        // Prefer gaps lying between P[1] and Q[1], then closest to midpoint
        const minPQ = Math.min(P[1], Q[1]);
        const maxPQ = Math.max(P[1], Q[1]);
        const uBetween = uMid >= minPQ - 8 && uMid <= maxPQ + 8 ? 0 : 1;
        const vBetween = vMid >= minPQ - 8 && vMid <= maxPQ + 8 ? 0 : 1;
        return uBetween - vBetween || Math.abs(uMid - targetMidY) - Math.abs(vMid - targetMidY);
      });

    const x1Init = (vgStart.lo + vgStart.hi) / 2;
    const x2Init = (vgEnd.lo + vgEnd.hi) / 2;
    let chosenHGap: GapBand = orderedHGaps[0] ?? hGapBelow(a);
    for (const hg of orderedHGaps) {
      const loY = hg.hi - hg.lo >= 12 ? hg.lo + 6 : (hg.lo + hg.hi) / 2;
      const hiY = hg.hi - hg.lo >= 12 ? hg.hi - 6 : (hg.lo + hg.hi) / 2;
      if (
        polyIsClean([P, [x1Init, P[1]], [x1Init, loY], [x2Init, loY], [x2Init, Q[1]], Q], a, s[0], b, s[1]) &&
        polyIsClean([P, [x1Init, P[1]], [x1Init, hiY], [x2Init, hiY], [x2Init, Q[1]], Q], a, s[0], b, s[1])
      ) {
        chosenHGap = hg;
        break;
      }
    }

    const ygInit = (chosenHGap.lo + chosenHGap.hi) / 2;
    const doglegPts: [number, number][] = [
      P,
      [x1Init, P[1]],
      [x1Init, ygInit],
      [x2Init, ygInit],
      [x2Init, Q[1]],
      Q,
    ];
    p.pts = doglegPts;

    registerLane(vgStart, {
      spanLo: Math.min(P[1], ygInit),
      spanHi: Math.max(P[1], ygInit),
      startPos: P[1],
      endPos: ygInit,
      startDir: dir > 0 ? -1 : 1,
      endDir: x2Init >= x1Init ? 1 : -1,
      apply: (cx) => {
        doglegPts[1]![0] = cx;
        doglegPts[2]![0] = cx;
      },
    });
    registerLane(chosenHGap, {
      spanLo: Math.min(x1Init, x2Init),
      spanHi: Math.max(x1Init, x2Init),
      startPos: x1Init,
      endPos: x2Init,
      startDir: P[1] <= ygInit ? -1 : 1,
      endDir: Q[1] <= ygInit ? -1 : 1,
      apply: (cy) => {
        doglegPts[2]![1] = cy;
        doglegPts[3]![1] = cy;
      },
    });
    registerLane(vgEnd, {
      spanLo: Math.min(ygInit, Q[1]),
      spanHi: Math.max(ygInit, Q[1]),
      startPos: ygInit,
      endPos: Q[1],
      startDir: x2Init >= x1Init ? -1 : 1,
      endDir: dir > 0 ? 1 : -1,
      apply: (cx) => {
        doglegPts[3]![0] = cx;
        doglegPts[4]![0] = cx;
      },
    });
  }

  // Pass 2: Interval-colour every gap and write lane coordinates into `p.pts`
  for (const { band, reqs } of gapRegistry.values()) {
    assignCorridorLanes(band.lo, band.hi, reqs);
  }

  const wires: TuxMapRoutedWire[] = [];
  const labels: TuxMapRoutedLabel[] = [];
  const wireSegments: [[number, number], [number, number], number][] = [];

  paths.forEach((p, idx) => {
    const pts = simplifyOrthogonalPoints(p.pts);
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
 * Routes right-angle wires for Level 4 deployment resource nodes, trying discovered
 * group-gap corridors with `polyHits` before falling back (`#113`).
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
  const cardRects = Object.entries(rects).filter(([, r]) => !r.bound);

  function hitsAnyCard(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    ignoreIdA: string | null,
    ignoreIdB: string | null,
  ): boolean {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    for (const [id, r] of cardRects) {
      if (id === ignoreIdA || id === ignoreIdB) continue;
      if (maxX > r.x + 1 && minX < r.x + r.w - 1 && maxY > r.y + 1 && minY < r.y + r.h - 1) {
        return true;
      }
    }
    return false;
  }

  function polyHits(pts: [number, number][], fromId: string, toId: string): boolean {
    const lastSeg = pts.length - 2;
    for (let i = 0; i <= lastSeg; i++) {
      const igA = i === 0 ? fromId : null;
      const igB = i === lastSeg ? toId : null;
      if (hitsAnyCard(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], igA, igB)) {
        return true;
      }
    }
    return false;
  }

  // Discover vertical and horizontal group-gap corridors across Level 4 placement columns and resource groups
  const xBands = mergeNumericBands(cardRects.map(([, r]) => [r.x, r.x + r.w]));
  const yBands = mergeNumericBands(cardRects.map(([, r]) => [r.y, r.y + r.h]));
  const xCorridors: number[] = [];
  if (xBands.length > 0) {
    xCorridors.push(Math.max(6, xBands[0]![0] - 20));
    for (let i = 0; i < xBands.length - 1; i++) {
      if (xBands[i + 1]![0] - xBands[i]![1] >= 10) {
        xCorridors.push(Math.round((xBands[i]![1] + xBands[i + 1]![0]) / 2));
      }
    }
    xCorridors.push(xBands[xBands.length - 1]![1] + 20);
  }
  const yCorridors: number[] = [];
  if (yBands.length > 0) {
    yCorridors.push(Math.max(6, yBands[0]![0] - 18));
    for (let i = 0; i < yBands.length - 1; i++) {
      if (yBands[i + 1]![0] - yBands[i]![1] >= 10) {
        yCorridors.push(Math.round((yBands[i]![1] + yBands[i + 1]![0]) / 2));
      }
    }
    yCorridors.push(yBands[yBands.length - 1]![1] + 18);
  }
  // Also include per-card local group gaps (16px horizontal / 14-66px vertical gaps inside dual-column groups)
  for (const [, r] of cardRects) {
    xCorridors.push(r.x - 8, r.x + r.w + 8);
    yCorridors.push(r.y - 7, r.y + r.h + 7);
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
      otherCoord: fromSide === "l" || fromSide === "r" ? b.y + b.h / 2 : b.x + b.w / 2,
    });
    portsBySide.get(kTo)!.push({
      linkIdx: idx,
      end: "to",
      otherCoord: toSide === "l" || toSide === "r" ? a.y + a.h / 2 : a.x + a.w / 2,
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
    const laneShift = ((idx % 5) - 2) * 3;
    let chosenPts: [number, number][] | null = null;

    if (right || left) {
      const P: [number, number] = [right ? a.x + a.w : a.x, Math.round(a.y + a.h * fa)];
      const Q: [number, number] = [right ? b.x : b.x + b.w, Math.round(b.y + b.h * fb)];
      const midX = Math.round((P[0] + Q[0]) / 2 + laneShift);
      const xCands = [
        midX,
        ...xCorridors
          .filter((vx) => (right ? vx > P[0] + 4 && vx < Q[0] - 4 : vx < P[0] - 4 && vx > Q[0] + 4))
          .map((vx) => vx + laneShift)
          .sort((u, v) => Math.abs(u - midX) - Math.abs(v - midX)),
      ];
      for (const vx of xCands) {
        const cand: [number, number][] = [P, [vx, P[1]], [vx, Q[1]], Q];
        if (!polyHits(cand, r.from, r.to)) {
          chosenPts = cand;
          break;
        }
      }

      if (!chosenPts) {
        // Try 5-segment group-gap corridors `[P, [vx1, P[1]], [vx1, hy], [vx2, hy], [vx2, Q[1]], Q]`
        const vx1 = right ? a.x + a.w + 8 + ((idx % 3) - 1) * 2 : a.x - 8 + ((idx % 3) - 1) * 2;
        const vx2 = right ? b.x - 8 + ((idx % 3) - 1) * 2 : b.x + b.w + 8 + ((idx % 3) - 1) * 2;
        const midY = (P[1] + Q[1]) / 2;
        const sortedY = yCorridors
          .slice()
          .sort((u, v) => Math.abs(u - midY) - Math.abs(v - midY));
        for (const baseY of sortedY) {
          const hy = baseY + ((idx % 3) - 1) * 2;
          const cand: [number, number][] = [P, [vx1, P[1]], [vx1, hy], [vx2, hy], [vx2, Q[1]], Q];
          if (!polyHits(cand, r.from, r.to)) {
            chosenPts = cand;
            break;
          }
        }

        if (!chosenPts) {
          // Try top/bottom port exit into horizontal group-gap corridor before final fallback
          const goBelow = b.y >= a.y;
          const Pbot: [number, number] = [Math.round(a.x + a.w * fa), goBelow ? a.y + a.h : a.y];
          for (const baseY of sortedY) {
            const hy = baseY + ((idx % 3) - 1) * 2;
            if (goBelow ? hy <= Pbot[1] + 2 : hy >= Pbot[1] - 2) continue;
            const cand: [number, number][] = [Pbot, [Pbot[0], hy], [vx2, hy], [vx2, Q[1]], Q];
            if (!polyHits(cand, r.from, r.to)) {
              chosenPts = cand;
              break;
            }
          }
          if (!chosenPts) {
            const yg = (goBelow ? a.y + a.h + 9 : a.y - 9) + ((idx % 3) - 1) * 3;
            const gx = right ? Math.max(a.x + a.w + 10, b.x - 18) : Math.min(a.x - 10, b.x + b.w + 18);
            chosenPts = [Pbot, [Pbot[0], yg], [gx, yg], [gx, Q[1]], Q];
          }
        }
      }
    } else {
      const down = b.y > a.y;
      const P2: [number, number] = [Math.round(a.x + a.w * fa), down ? a.y + a.h : a.y];
      const Q2: [number, number] = [Math.round(b.x + b.w * fb), down ? b.y : b.y + b.h];
      const midY = Math.round((P2[1] + Q2[1]) / 2 + laneShift);
      const directV: [number, number][] = [P2, [P2[0], midY], [Q2[0], midY], Q2];
      if (!polyHits(directV, r.from, r.to)) {
        chosenPts = directV;
      } else {
        const targetX = a.x + a.w / 2;
        const sortedX = xCorridors
          .slice()
          .sort((u, v) => Math.abs(u - targetX) - Math.abs(v - targetX));
        const hy1 = down ? a.y + a.h + 7 : a.y - 7;
        const hy2 = down ? b.y - 7 : b.y + b.h + 7;
        for (const baseX of sortedX) {
          const vx = baseX + ((idx % 3) - 1) * 2;
          const cand: [number, number][] = [P2, [P2[0], hy1], [vx, hy1], [vx, hy2], [Q2[0], hy2], Q2];
          if (!polyHits(cand, r.from, r.to)) {
            chosenPts = cand;
            break;
          }
        }
        if (!chosenPts) chosenPts = directV;
      }
    }

    wires.push({
      id: `dw-${idx}-${r.from}-${r.to}`,
      from: r.from,
      to: r.to,
      d: roundOrthogonalCorners(simplifyOrthogonalPoints(chosenPts)),
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
  "handled-by",
  "sends",
  "reads",
  "denies",
  "imports",
  "runs",
  "sources",
  "copies",
  "copies-logic-of",
  "forks",
  "reads-format",
  "generates",
  "stamps",
  "provenance",
  "tests",
  "checks",
  "suppresses",
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
  "handled-by": "is handled by it",
  sends: "sends to it",
  reads: "reads it",
  denies: "denies it",
  runs: "runs it",
  sources: "sources it",
  copies: "copies it",
  "copies-logic-of": "copies logic from it",
  forks: "forks it",
  "reads-format": "reads its format",
  generates: "generates from it",
  stamps: "stamps or builds it",
  provenance: "records provenance for it",
  loads: "loads it",
  uses: "reads or ships it",
  checks: "CI checks it",
  tests: "tests it",
  suppresses: "suppresses findings in it",
  routes: "routes to it",
  links: "links to it",
  mentions: "mentions it",
};

const MAX_TREE_DEPTH = 64;

/** Canonical set of valid semantic blast-radius intents (`tti/tti-ux#110` / `#111`). */
export const TUX_MAP_VALID_BLAST_INTENTS: ReadonlySet<TuxMapBlastIntent> = new Set([
  "default",
  "patch",
  "refactor",
  "cut",
  "supply-chain",
]);

const VALID_LINK_COUPLINGS: ReadonlySet<string> = new Set([
  "contract",
  "runtime",
  "type-only",
  "artifact-stamp",
  "build-exec",
  "verification",
  "prose",
]);

const VALID_LINK_PHASES: ReadonlySet<string> = new Set([
  "prod-runtime",
  "client-bundle",
  "build-exec",
  "ci-test",
  "doc-only",
]);

function isPlainRecord(val: unknown): val is Record<string, unknown> {
  return val != null && typeof val === "object" && !Array.isArray(val);
}

function asObjArray<T extends object>(val: unknown): T[] {
  if (!Array.isArray(val)) return [];
  return val.filter((item): item is T => item != null && typeof item === "object" && !Array.isArray(item));
}

const NON_PROSE_LINK_KINDS: ReadonlySet<string> = new Set([
  "calls",
  "handled-by",
  "sends",
  "reads",
  "denies",
  "imports",
  "runs",
  "sources",
  "copies",
  "copies-logic-of",
  "forks",
  "reads-format",
  "generates",
  "stamps",
  "provenance",
  "tests",
  "checks",
  "suppresses",
  "loads",
  "routes",
  "uses",
  "links",
]);

const NON_TYPE_ONLY_LINK_KINDS: ReadonlySet<string> = new Set([
  "calls",
  "handled-by",
  "sends",
  "reads",
  "denies",
  "runs",
  "sources",
  "copies",
  "copies-logic-of",
  "forks",
  "reads-format",
  "generates",
  "stamps",
  "provenance",
  "tests",
  "checks",
  "suppresses",
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
  "route",
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
  if (link.coupling && VALID_LINK_COUPLINGS.has(link.coupling)) {
    const c = link.coupling;
    const spoofedProse = c === "prose" && NON_PROSE_LINK_KINDS.has(k);
    const spoofedTypeOnly = c === "type-only" && NON_TYPE_ONLY_LINK_KINDS.has(k);
    const spoofedRouteLoadContract =
      (k === "routes" || k === "links" || k === "loads") &&
      c !== "contract" &&
      c !== "runtime";
    const spoofedNonStopAux =
      !link.stop &&
      (k === "calls" || k === "runs" || k === "uses" || k === "imports" || k === "sources") &&
      (c === "build-exec" || c === "verification" || c === "artifact-stamp");
    const spoofedCallsBuildStamp =
      k === "calls" && (c === "build-exec" || c === "artifact-stamp");
    if (
      !spoofedProse &&
      !spoofedTypeOnly &&
      !spoofedRouteLoadContract &&
      !spoofedNonStopAux &&
      !spoofedCallsBuildStamp
    ) {
      return c;
    }
  }
  if (k === "mentions") return "prose";
  if (k === "tests" || k === "checks" || k === "suppresses") return "verification";
  if (k === "stamps" || k === "generates" || k === "provenance") return "artifact-stamp";
  if (
    k === "routes" ||
    k === "links" ||
    k === "handled-by" ||
    k === "reads-format" ||
    k === "copies" ||
    k === "copies-logic-of" ||
    k === "forks"
  ) {
    return "contract";
  }
  if (k === "loads" || k === "uses") return "runtime";
  if (k === "imports" || k === "sources") return link.stop ? "verification" : "contract";
  if (k === "calls" || k === "runs" || k === "reads" || k === "sends" || k === "denies") {
    return link.stop ? "verification" : "runtime";
  }
  return link.stop ? "verification" : "runtime";
}

/** Infers deterministic execution/shipping phase for links that omit explicit `phase`. */
export function inferLinkPhase(link: TuxMapLink): TuxMapLinkPhase {
  const c = inferLinkCoupling(link);
  const k = link.kind || "";
  if (link.phase && VALID_LINK_PHASES.has(link.phase)) {
    const spoofedDocOnly = link.phase === "doc-only" && c !== "prose" && k !== "mentions";
    const spoofedNonProdRuntime =
      (c === "runtime" || c === "contract") &&
      (link.phase === "ci-test" || link.phase === "build-exec" || link.phase === "doc-only");
    if (!spoofedDocOnly && !spoofedNonProdRuntime) {
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
  if (!TUX_MAP_VALID_BLAST_INTENTS.has(intent)) {
    throw new RangeError(
      `Invalid blast intent '${String(intent)}'; expected one of: default, patch, refactor, cut, supply-chain.`,
    );
  }
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
    if (k === "links" || c === "type-only" || c === "build-exec") return "skip";
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
  if (k === "links" || c === "prose" || c === "type-only" || p === "doc-only") return "skip";
  if (p === "build-exec" || c === "build-exec") return "stop";
  if (c === "artifact-stamp" || k === "stamps") return "stop";
  if (p === "ci-test" || c === "verification") return "stop";
  return link.stop ? "stop" : "spread";
}

function isLevel3Focus(id: string, model: TuxMapLevelModel): boolean {
  if (!isPlainRecord(model?.level3) || !hasOwn(model.level3, id) || !Array.isArray(model.level3[id])) {
    return false;
  }
  return model.level3[id]!.length > 0 || !isPlainRecord(model.subgraphs) || !hasOwn(model.subgraphs, id);
}

/**
 * Order-independent two-pass `subgraphRef -> ownerId` resolver across Levels 1..N
 * so child-before-parent key order in `model.subgraphs` matches Python `code-graph.py` 1:1.
 */
function collectSubgraphOwners(model?: TuxMapLevelModel): Map<string, string> {
  const subgraphOwners = new Map<string, string>();
  if (!model || typeof model !== "object") return subgraphOwners;
  const noteSubgraphRef = (ownerId: string, ref?: string) => {
    if (ownerId && ref && typeof ref === "string" && ref !== ownerId && !subgraphOwners.has(ref)) {
      subgraphOwners.set(ref, ownerId);
    }
  };
  const scanInline = (pid: string, rawKids: unknown, depth = 0) => {
    if (depth >= MAX_TREE_DEPTH) return;
    const kids = asObjArray<TuxMapLevelElement>(rawKids);
    kids.forEach((k, i) => {
      const id = (typeof k.id === "string" && k.id) || `${pid}/${i}`;
      noteSubgraphRef(id, k.subgraphRef);
      if (Array.isArray(k.children) && k.children.length > 0) {
        scanInline(id, k.children, depth + 1);
      }
    });
  };
  if (isPlainRecord(model.level3)) {
    for (const [cid, kids] of Object.entries(model.level3)) scanInline(cid, kids, 0);
  }
  for (const e of [
    ...asObjArray<TuxMapLevelElement>(model.level1?.elements),
    ...asObjArray<TuxMapLevelElement>(model.level2?.elements),
  ]) {
    if (typeof e.id === "string" && e.id) {
      noteSubgraphRef(e.id, e.subgraphRef);
      if (Array.isArray(e.children) && e.children.length > 0) scanInline(e.id, e.children, 0);
    }
  }
  for (const n of asObjArray<TuxMapDeploymentNode>(model.level4?.nodes)) {
    if (typeof n.id === "string" && n.id) {
      noteSubgraphRef(n.id, n.subgraphRef);
      if (Array.isArray(n.children) && n.children.length > 0) scanInline(n.id, n.children, 0);
    }
  }
  if (isPlainRecord(model.subgraphs)) {
    // Up to 4 passes resolves even chained anonymous `subgraphRef` owners regardless of key order
    for (let pass = 0; pass < 4; pass++) {
      const before = subgraphOwners.size;
      for (const [key, sg] of Object.entries(model.subgraphs)) {
        if (!isPlainRecord(sg)) continue;
        const owner = subgraphOwners.get(key) ?? key;
        scanInline(owner, sg.elements, 0);
      }
      if (subgraphOwners.size === before && pass >= 1) break;
    }
  }
  return subgraphOwners;
}

/**
 * child → parent for every element below Level 2: Level 3 components under their container,
 * subgraph elements under their key (or `subgraphRef` owner), inline `children` under their element.
 */
export function buildMapParentIndex(model: TuxMapLevelModel): Map<string, string> {
  const parentOf = new Map<string, string>();
  const subgraphOwners = collectSubgraphOwners(model);
  const inline = (pid: string, rawKids: unknown, depth = 0) => {
    if (!pid || depth >= MAX_TREE_DEPTH) return;
    const kids = asObjArray<TuxMapLevelElement>(rawKids);
    kids.forEach((k, i) => {
      const id = (typeof k.id === "string" && k.id) || `${pid}/${i}`;
      if (!parentOf.has(id)) parentOf.set(id, pid);
      if (Array.isArray(k.children) && k.children.length > 0) inline(id, k.children, depth + 1);
    });
  };
  if (isPlainRecord(model?.level3)) {
    for (const [cid, kids] of Object.entries(model.level3)) inline(cid, kids, 0);
  }
  for (const e of [
    ...asObjArray<TuxMapLevelElement>(model?.level1?.elements),
    ...asObjArray<TuxMapLevelElement>(model?.level2?.elements),
  ]) {
    if (typeof e.id === "string" && e.id && Array.isArray(e.children) && e.children.length > 0) {
      inline(e.id, e.children, 0);
    }
  }
  for (const n of asObjArray<TuxMapDeploymentNode>(model?.level4?.nodes)) {
    if (typeof n.id === "string" && n.id && Array.isArray(n.children) && n.children.length > 0) {
      inline(n.id, n.children, 0);
    }
  }
  if (isPlainRecord(model?.subgraphs)) {
    for (const [key, sg] of Object.entries(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const owner = subgraphOwners.get(key) ?? key;
      inline(owner, sg.elements, 0);
    }
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
  opts: {
    includePlanned?: boolean;
    includeC4Rels?: boolean;
    bridgeUncovered?: boolean;
    bridgeUncoveredPairs?: boolean;
  } = {},
): TuxMapLink[] {
  const includePlanned = opts.includePlanned ?? false;
  const rawLinks = asObjArray<TuxMapLink>(model?.links).filter(
    (l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to),
  );
  const hasCodeLinks = rawLinks.length > 0;
  if (hasCodeLinks && !opts.includeC4Rels && opts.bridgeUncovered === false) {
    return rawLinks;
  }

  let covered: Set<string> | null = null;
  let coveredPairs: Set<string> | null = null;
  const subgraphOwners = collectSubgraphOwners(model);
  if (hasCodeLinks && !opts.includeC4Rels) {
    const parentOf = buildMapParentIndex(model);
    const hostBridge = buildHostBridge(model, subgraphOwners);
    const l2ContainerIds = new Set(
      asObjArray<TuxMapLevelElement>(model?.level2?.elements)
        .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
        .map((e) => e.id),
    );
    const boundary = typeof model?.level2?.boundary === "string" ? model.level2.boundary : "";
    if (opts.bridgeUncoveredPairs) {
      coveredPairs = new Set<string>();
      const collectAncs = (id: string): string[] => {
        const set = new Set<string>();
        for (const anc of mapAncestorsOf(id, parentOf)) {
          set.add(anc);
          if (boundary && l2ContainerIds.has(anc)) set.add(boundary);
          const hs = hostBridge.hostsByElement.get(anc);
          if (hs) {
            for (const hid of hs) set.add(hid);
          }
        }
        return [...set];
      };
      for (const l of rawLinks) {
        if (TUX_MAP_QUIET_LINK_KINDS.has(l.kind || "")) continue;
        const fromAncs = collectAncs(l.from);
        const toAncs = collectAncs(l.to);
        for (const fa of fromAncs) {
          for (const ta of toAncs) {
            coveredPairs.add(`${fa}\u0000${ta}`);
          }
        }
      }
    } else {
      covered = new Set<string>();
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
  }

  const out: TuxMapLink[] = [...rawLinks];
  const seen = new Set(out.map((l) => `${l.from}\u0000${l.to}\u0000${l.kind || "uses"}`));
  const push = (from: string, to: string, kind: string, label?: string) => {
    if (typeof from !== "string" || typeof to !== "string" || !from || !to) return;
    if (covered && covered.has(to)) return;
    if (coveredPairs && coveredPairs.has(`${from}\u0000${to}`)) return;
    const normKind = kind || "uses";
    const key = `${from}\u0000${to}\u0000${normKind}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ from, to, kind: normKind, label, coupling: "runtime", phase: "prod-runtime" });
  };
  for (const r of asObjArray<TuxMapLevelRel>(model?.level1?.rels)) {
    if (!includePlanned && r.status === "planned") continue;
    push(r.from, r.to, "uses", r.label);
  }
  for (const r of asObjArray<TuxMapLevelRel>(model?.level2?.rels)) {
    if (!includePlanned && r.status === "planned") continue;
    push(r.from, r.to, "uses", r.label);
  }
  if (isPlainRecord(model?.level3)) {
    for (const [pid, rawKids] of Object.entries(model.level3)) {
      const kids = asObjArray<TuxMapLevelElement>(rawKids);
      kids.forEach((k, idx) => {
        if (!includePlanned && k.status === "planned") return;
        if (typeof k.next === "number" && Number.isInteger(k.next) && k.next >= 0 && k.next < kids.length) {
          const fromId = (typeof k.id === "string" && k.id) || `${pid}/${idx}`;
          const toId = (typeof kids[k.next]!.id === "string" && kids[k.next]!.id) || `${pid}/${k.next}`;
          push(fromId, toId, "uses");
        }
      });
    }
  }
  if (isPlainRecord(model?.subgraphs)) {
    for (const sg of Object.values(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      for (const r of asObjArray<TuxMapLevelRel>(sg.rels)) {
        if (!includePlanned && r.status === "planned") continue;
        push(r.from, r.to, "uses", r.label);
      }
    }
  }
  for (const l of asObjArray<TuxMapDeploymentLink>(model?.level4?.links)) {
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

function buildHostBridge(
  model: TuxMapLevelModel,
  subgraphOwners: Map<string, string> = collectSubgraphOwners(model),
): {
  hostsByElement: Map<string, Set<string>>;
  elementsByHost: Map<string, Set<string>>;
} {
  const hostsByElement = new Map<string, Set<string>>();
  const elementsByHost = new Map<string, Set<string>>();
  const linkHost = (elId: string, hostId: string) => {
    if (typeof elId !== "string" || typeof hostId !== "string" || !elId || !hostId) return;
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
  const normArr = (v?: unknown): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && Boolean(x));
    return typeof v === "string" ? [v] : [];
  };
  const visitEls = (rawEls: unknown, pid?: string, depth = 0) => {
    if (depth >= MAX_TREE_DEPTH) return;
    const els = asObjArray<TuxMapLevelElement | TuxMapLevelRef>(rawEls);
    els.forEach((e, idx) => {
      const id = (typeof e.id === "string" && e.id) || (pid ? `${pid}/${idx}` : "");
      if (!id) return;
      for (const h of normArr(e.deployed)) linkHost(id, h);
      if (Array.isArray(e.children) && e.children.length > 0) visitEls(e.children, id, depth + 1);
    });
  };
  visitEls(model?.level1?.elements);
  visitEls(model?.level2?.elements);
  if (isPlainRecord(model?.level3)) {
    for (const [pid, kids] of Object.entries(model.level3)) visitEls(kids, pid);
  }
  if (isPlainRecord(model?.subgraphs)) {
    for (const [pid, sg] of Object.entries(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      visitEls(sg.elements, subgraphOwners.get(pid) ?? pid);
    }
  }
  for (const dn of asObjArray<TuxMapDeploymentNode>(model?.level4?.nodes)) {
    if (typeof dn.id !== "string" || !dn.id) continue;
    linkHost(dn.id, dn.id);
    for (const h of normArr(dn.hosts)) linkHost(h, dn.id);
    if (Array.isArray(dn.children) && dn.children.length > 0) visitEls(dn.children, dn.id);
  }
  return { hostsByElement, elementsByHost };
}

interface BlastNodeMeta {
  kind?: string;
  path?: string;
  tech?: string;
}

function buildBlastNodeMeta(
  model?: TuxMapLevelModel,
  subgraphOwners: Map<string, string> = collectSubgraphOwners(model),
): Map<string, BlastNodeMeta> {
  const meta = new Map<string, BlastNodeMeta>();
  if (!model || typeof model !== "object") return meta;
  const visit = (rawEls: unknown, pid?: string, fallbackKind?: string, depth = 0) => {
    if (depth >= MAX_TREE_DEPTH) return;
    const els = asObjArray<TuxMapLevelElement | TuxMapLevelRef>(rawEls);
    els.forEach((e, idx) => {
      if (e.ref && typeof e.id === "string" && meta.has(e.id)) return;
      const id = (typeof e.id === "string" && e.id) || (pid ? `${pid}/${idx}` : "");
      if (id && !meta.has(id)) {
        meta.set(id, { kind: e.kind || fallbackKind, path: e.source?.path, tech: e.tech });
      }
      if (id && Array.isArray(e.children) && e.children.length > 0) {
        visit(e.children, id, "module", depth + 1);
      }
    });
  };
  visit(model.level1?.elements, undefined, "system");
  visit(model.level2?.elements, model.level2?.boundary, "container");
  if (isPlainRecord(model.level3)) {
    for (const [pid, kids] of Object.entries(model.level3)) visit(kids, pid, "component");
  }
  for (const dn of asObjArray<TuxMapDeploymentNode>(model.level4?.nodes)) {
    if (typeof dn.id === "string" && dn.id && !meta.has(dn.id)) {
      meta.set(dn.id, { kind: dn.kind || "resource", path: dn.source?.path, tech: dn.facts?.type });
    }
    if (typeof dn.id === "string" && dn.id && Array.isArray(dn.children) && dn.children.length > 0) {
      visit(dn.children, dn.id, "module");
    }
  }
  if (isPlainRecord(model.subgraphs)) {
    for (const [pid, sg] of Object.entries(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      visit(sg.elements, subgraphOwners.get(pid) ?? pid, "module");
    }
  }
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
  if (!TUX_MAP_VALID_BLAST_INTENTS.has(intent)) {
    throw new RangeError(
      `Invalid blast intent '${String(intent)}'; expected one of: default, patch, refactor, cut, supply-chain.`,
    );
  }
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
    if (typeof id === "string" && id && !seeds.has(id)) {
      seeds.add(id);
      dq.push(id);
    }
  };
  for (const s of rawSeeds) addSeed(s);

  const subgraphOwners = collectSubgraphOwners(opts.model);
  const hostBridge = opts.model ? buildHostBridge(opts.model, subgraphOwners) : null;
  const metaById = buildBlastNodeMeta(opts.model, subgraphOwners);
  if (opts.model && typeof opts.model === "object") {
    // Expand Level 1 primary boundary seed into its Level 2 containers
    if (typeof opts.model.level2?.boundary === "string" && opts.model.level2.boundary && seeds.has(opts.model.level2.boundary)) {
      for (const e of asObjArray<TuxMapLevelElement>(opts.model.level2.elements)) {
        if (!e.ref) addSeed(e.id);
      }
    }
    // Expand Level 4 host/resource seeds into the containers/components hosted on or deployed to them
    const l4NodeIds = new Set(
      asObjArray<TuxMapDeploymentNode>(opts.model.level4?.nodes)
        .filter((n) => typeof n.id === "string" && Boolean(n.id))
        .map((n) => n.id),
    );
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
  for (const l of asObjArray<TuxMapLink>(links)) {
    if (typeof l.from !== "string" || typeof l.to !== "string" || !l.from || !l.to) continue;
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
  const subgraphOwners = collectSubgraphOwners(model);
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
    const id = typeof e.id === "string" ? e.id : "";
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
    const childArr = asObjArray<TuxMapLevelElement>(e.children);
    if (childArr.length > 0) {
      inlineParentIds.add(id);
      childArr.forEach((k, idx) =>
        addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${id}/${idx}` }, "inline", "component", id, depth + 1),
      );
    }
  };

  for (const e of asObjArray<TuxMapLevelElement>(model?.level1?.elements)) addEl(e, "level1", "system");
  if (typeof model?.level2?.boundary === "string" && model.level2.boundary) {
    validTargetIds.add(model.level2.boundary);
  }
  for (const e of asObjArray<TuxMapLevelElement>(model?.level2?.elements)) {
    if (typeof e.id === "string" && e.id) validTargetIds.add(e.id);
    if (e.ref) continue;
    addEl({ ...e, name: e.name ?? e.id }, "level2", "container", model?.level2?.boundary);
  }
  if (isPlainRecord(model?.level3)) {
    for (const [cid, rawKids] of Object.entries(model.level3)) {
      if (cid) validTargetIds.add(cid);
      asObjArray<TuxMapLevelElement>(rawKids).forEach((k, idx) =>
        addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${cid}/${idx}` }, "level3", "component", cid),
      );
    }
  }
  for (const dn of asObjArray<TuxMapDeploymentNode>(model?.level4?.nodes)) {
    if (typeof dn.id !== "string" || !dn.id) continue;
    validTargetIds.add(dn.id);
    if (!elements.has(dn.id)) {
      elements.set(dn.id, {
        id: dn.id,
        origin: "level4",
        kind: dn.kind || "resource",
        name: dn.title ?? dn.id,
        tech: dn.facts?.type || dn.facts?.sku || dn.facts?.size,
        desc: dn.role,
        parentId: dn.group || dn.zone,
        logicalParentId: dn.group || dn.zone,
        source: dn.source,
        diff: dn.diff,
        rawNode: dn,
      });
    }
    const dnKids = asObjArray<TuxMapLevelElement>(dn.children);
    if (dnKids.length > 0) {
      inlineParentIds.add(dn.id);
      dnKids.forEach((k, idx) =>
        addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${dn.id}/${idx}` }, "inline", "module", dn.id, 1),
      );
    }
  }
  if (isPlainRecord(model?.subgraphs)) {
    for (const [pid, sg] of Object.entries(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const owner = subgraphOwners.get(pid) ?? pid;
      if (pid) validTargetIds.add(pid);
      if (owner) validTargetIds.add(owner);
      asObjArray<TuxMapLevelElement>(sg.elements).forEach((k, idx) =>
        addEl({ ...k, id: (typeof k.id === "string" && k.id) || `${owner}/${idx}` }, "subgraph", "module", owner),
      );
    }
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

  const headSubgraphOwners = collectSubgraphOwners(headModel);
  const annotateEl = <T extends TuxMapLevelElement | TuxMapLevelRef>(
    e: T,
    pid?: string,
    idx?: number,
    depth = 0,
  ): T => {
    if (depth >= MAX_TREE_DEPTH) return e;
    const id = (typeof e.id === "string" && e.id) || (pid && idx !== undefined ? `${pid}/${idx}` : "");
    const d = id ? diffForId(id) : undefined;
    const baseKids = Array.isArray(e.children)
      ? asObjArray<TuxMapLevelElement>(e.children).map((k, ki) => annotateEl(k, id, ki, depth + 1))
      : undefined;
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
  if (isPlainRecord(headModel?.level3)) {
    for (const [cid, rawKids] of Object.entries(headModel.level3)) {
      setOwnProp(
        mergedLevel3,
        cid,
        asObjArray<TuxMapLevelElement>(rawKids).map((k, idx) => annotateEl(k, cid, idx)),
      );
    }
  }
  const mergedSubgraphs: Record<string, TuxMapSubgraph> = {};
  if (isPlainRecord(headModel?.subgraphs)) {
    for (const [pid, sg] of Object.entries(headModel.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const ownerPid = headSubgraphOwners.get(pid) ?? pid;
      setOwnProp(mergedSubgraphs, pid, {
        ...(sg as unknown as TuxMapSubgraph),
        elements: asObjArray<TuxMapLevelElement>(sg.elements).map((k, idx) => annotateEl(k, ownerPid, idx)),
      });
    }
  }

  const headL2ContainerIds = new Set(
    asObjArray<TuxMapLevelElement>(headModel?.level2?.elements)
      .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
      .map((e) => e.id),
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
    ...asObjArray<TuxMapDeploymentNode>(headModel?.level4?.nodes).map((n) => {
      const d = typeof n.id === "string" && n.id ? diffForId(n.id) : undefined;
      const baseKids = Array.isArray(n.children)
        ? asObjArray<TuxMapLevelElement>(n.children).map((k, ki) => annotateEl(k, n.id, ki))
        : undefined;
      const inlineGhosts = typeof n.id === "string" && n.id ? deletedInlineByParent.get(n.id) : undefined;
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
      ...(isPlainRecord(headModel?.level1) ? headModel.level1 : {}),
      rels: asObjArray<TuxMapLevelRel>(headModel?.level1?.rels),
      elements: [
        ...asObjArray<TuxMapLevelElement>(headModel?.level1?.elements).map((e) => annotateEl(e)),
        ...deletedL1Ghosts,
      ],
    },
    level2: {
      ...(isPlainRecord(headModel?.level2) ? headModel.level2 : {}),
      boundary: typeof headModel?.level2?.boundary === "string" ? headModel.level2.boundary : "",
      rels: asObjArray<TuxMapLevelRel>(headModel?.level2?.rels),
      elements: [
        ...asObjArray<TuxMapLevelElement | TuxMapLevelRef>(headModel?.level2?.elements).map((e) =>
          e.ref ? e : annotateEl(e),
        ),
        ...deletedL2Ghosts,
      ],
    },
    level3: mergedLevel3,
    level4: {
      ...(isPlainRecord(headModel?.level4) ? headModel.level4 : {}),
      groups: asObjArray<TuxMapDeploymentGroup>(headModel?.level4?.groups),
      links: asObjArray<TuxMapDeploymentLink>(headModel?.level4?.links),
      nodes: mergedLevel4Nodes,
    },
    ...(Object.keys(mergedSubgraphs).length > 0 || isPlainRecord(headModel?.subgraphs)
      ? { subgraphs: mergedSubgraphs }
      : {}),
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
  depEdgesByFrom: Map<string, TuxMapGraphEdgeRecord[]>;
  depEdgesByTo: Map<string, TuxMapGraphEdgeRecord[]>;
  neighborsByNode: Map<string, Array<{ next: string; edge: TuxMapGraphEdgeRecord }>>;
  effectiveLinks: TuxMapLink[];
}

interface CachedQueryIndex {
  stamp: string;
  index: TuxMapQueryIndex;
}

const MODEL_QUERY_INDEX_CACHE = new WeakMap<TuxMapLevelModel, CachedQueryIndex>();

/**
 * Normalizes supported architecture model JSON inputs (`TuxMapLevelModel`, gateway `architecture.json`
 * `schema: 2`, or raw `code-graph.py --json` subgraphs+links) into a canonical `TuxMapLevelModel`.
 *
 * Rejects non-object payloads, `code-map.json` placement rule files, and (when `allowEmpty === false`)
 * zero-node models with a concise `< 2 KB` diagnostic error (`N-01`, `S-13`).
 */
export function normalizeArchitectureModelInput(
  raw: unknown,
  opts: { allowEmpty?: boolean } = {},
): TuxMapLevelModel {
  if (!isPlainRecord(raw)) {
    throw new TypeError("Invalid architecture model: expected a JSON object.");
  }

  if (
    Array.isArray(raw.rules) &&
    !hasOwn(raw, "level1") &&
    !hasOwn(raw, "level2") &&
    !hasOwn(raw, "c4") &&
    !hasOwn(raw, "subgraphs")
  ) {
    throw new Error(
      "Input looks like a code-map.json placement config, not an architecture graph model. Export a full model with 'python3 branding/architecture/code-graph.py --model-json'.",
    );
  }

  let normalized: TuxMapLevelModel;

  if (isPlainRecord(raw.c4)) {
    // Gateway `architecture.json` (`schema: 2`) produced by `build-data.py`
    const c4 = raw.c4;
    const ctx = isPlainRecord(c4.context) ? c4.context : {};
    const cnt = isPlainRecord(c4.containers) ? c4.containers : {};
    const cmpRaw = isPlainRecord(c4.components) ? c4.components : {};
    const zoomMap: Record<string, TuxMapLevelNumber> = {
      context: 1,
      containers: 2,
      components: 3,
      deployment: 4,
    };
    const normZoom = <T extends TuxMapLevelElement | TuxMapLevelRef>(el: T): T => {
      const z = (el as { zoom?: unknown }).zoom;
      if (typeof z === "string" && hasOwn(zoomMap, z)) {
        return { ...el, zoom: zoomMap[z] };
      }
      return el;
    };
    const level3: Record<string, TuxMapLevelElement[]> = {};
    for (const [cid, kids] of Object.entries(cmpRaw)) {
      setOwnProp(level3, cid, asObjArray<TuxMapLevelElement>(kids).map(normZoom));
    }
    const code = isPlainRecord(raw.code) ? raw.code : undefined;
    const neighbors = asObjArray<Record<string, unknown>>(raw.neighbors).map(
      (n): TuxMapNeighborResource => ({
        name: typeof n.name === "string" ? n.name : "",
        type: typeof n.type === "string" ? n.type : "",
        resourceGroup:
          typeof n.resourceGroup === "string"
            ? n.resourceGroup
            : typeof n["resource group"] === "string"
              ? n["resource group"]
              : "",
        reason: typeof n.reason === "string" ? n.reason : "",
      }),
    );
    const subgraphsRaw = isPlainRecord(raw.subgraphs)
      ? raw.subgraphs
      : isPlainRecord(code?.subgraphs)
        ? code.subgraphs
        : undefined;
    const linksRaw = Array.isArray(raw.codeLinks)
      ? raw.codeLinks
      : isPlainRecord(code) && Array.isArray(code.links)
        ? code.links
        : undefined;
    const routesRaw = Array.isArray(raw.routes)
      ? raw.routes
      : isPlainRecord(code) && Array.isArray(code.routes)
        ? code.routes
        : undefined;

    normalized = {
      generatedAt:
        typeof raw.generatedAt === "string"
          ? raw.generatedAt
          : typeof raw.generated_at === "string"
            ? raw.generated_at
            : undefined,
      issueBaseUrl: typeof raw.issueBaseUrl === "string" ? raw.issueBaseUrl : undefined,
      sourceBaseUrl:
        typeof raw.sourceBaseUrl === "string"
          ? raw.sourceBaseUrl
          : typeof code?.sourceBaseUrl === "string"
            ? code.sourceBaseUrl
            : undefined,
      level1: {
        title: typeof ctx.title === "string" ? ctx.title : "System Context",
        summary: typeof ctx.summary === "string" ? ctx.summary : undefined,
        elements: asObjArray<TuxMapLevelElement>(ctx.elements).map(normZoom),
        rels: asObjArray<TuxMapLevelRel>(ctx.rels),
      },
      level2: {
        title: typeof cnt.title === "string" ? cnt.title : "Containers",
        summary: typeof cnt.summary === "string" ? cnt.summary : undefined,
        boundary: typeof cnt.boundary === "string" ? cnt.boundary : "",
        elements: asObjArray<TuxMapLevelElement | TuxMapLevelRef>(cnt.elements).map(normZoom),
        rels: asObjArray<TuxMapLevelRel>(cnt.rels),
      },
      level3,
      level4: {
        title: "Deployment",
        groups: asObjArray<TuxMapDeploymentGroup>(raw.groups),
        nodes: asObjArray<TuxMapDeploymentNode>(raw.nodes),
        links: asObjArray<TuxMapDeploymentLink>(raw.links),
        neighbors,
      },
      ...(subgraphsRaw ? { subgraphs: subgraphsRaw as Record<string, TuxMapSubgraph> } : {}),
      ...(linksRaw ? { links: asObjArray<TuxMapLink>(linksRaw) } : {}),
      ...(routesRaw ? { routes: asObjArray<TuxMapRouteEntry>(routesRaw) } : {}),
    };
  } else if (
    isPlainRecord(raw.subgraphs) &&
    !hasOwn(raw, "level1") &&
    !hasOwn(raw, "level2") &&
    !hasOwn(raw, "level3") &&
    !hasOwn(raw, "level4")
  ) {
    // Raw `code-graph.py --json` CPG output (`{ subgraphs, links, sourceBaseUrl }`)
    const subgraphs = raw.subgraphs as Record<string, TuxMapSubgraph>;
    const childIds = new Set<string>();
    const refTargets = new Set<string>();
    for (const [k, sg] of Object.entries(subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      asObjArray<TuxMapLevelElement>(sg.elements).forEach((el, idx) => {
        const id = (typeof el.id === "string" && el.id) || `${k}/${idx}`;
        childIds.add(id);
        if (typeof el.subgraphRef === "string" && el.subgraphRef) {
          refTargets.add(el.subgraphRef);
        }
      });
    }
    const stubContainers: TuxMapLevelElement[] = [];
    for (const key of Object.keys(subgraphs)) {
      if (!childIds.has(key) && !refTargets.has(key)) {
        stubContainers.push({
          id: key,
          kind: key.includes("/") ? "component" : "container",
          name: key,
        });
      }
    }
    normalized = {
      generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : undefined,
      sourceBaseUrl: typeof raw.sourceBaseUrl === "string" ? raw.sourceBaseUrl : undefined,
      level1: { elements: [], rels: [] },
      level2: { boundary: "", elements: stubContainers, rels: [] },
      level3: {},
      level4: { groups: [], nodes: [], links: [] },
      subgraphs,
      links: asObjArray<TuxMapLink>(raw.links),
      ...(Array.isArray(raw.routes) ? { routes: asObjArray<TuxMapRouteEntry>(raw.routes) } : {}),
    };
  } else {
    normalized = raw as unknown as TuxMapLevelModel;
  }

  if (opts.allowEmpty === false) {
    const idx = getMapQueryIndex(normalized);
    if (idx.nodes.size === 0) {
      throw new Error(
        "Architecture model contains 0 indexed nodes. Pass a populated TuxMapLevelModel, schema-2 architecture.json, or 'python3 branding/architecture/code-graph.py --model-json' output.",
      );
    }
  }

  return normalized;
}

function modelCacheStamp(model: TuxMapLevelModel): string {
  // Fast two-lane 32-bit FNV-1a structural digest over nodes, hosts, subgraphRefs, and edges (`S-10`)
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const feedStr = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
      h2 = Math.imul(h2 ^ ((c << 1) | 1), 0x85ebca6b) >>> 0;
    }
    h1 = Math.imul(h1 ^ 0xff, 0x01000193) >>> 0;
  };
  const feedArr = (v: unknown) => {
    if (!v) return;
    if (typeof v === "string") {
      feedStr(v);
    } else if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === "string") feedStr(item);
      }
    }
  };
  const feedEls = (rawEls: unknown, depth = 0) => {
    const els = asObjArray<TuxMapLevelElement | TuxMapLevelRef>(rawEls);
    feedStr(`#E:${els.length}`);
    if (depth >= MAX_TREE_DEPTH) return;
    for (const e of els) {
      feedStr(typeof e.id === "string" ? e.id : "");
      feedStr(typeof e.name === "string" ? e.name : "");
      feedStr(typeof e.kind === "string" ? e.kind : "");
      feedStr(typeof e.status === "string" ? e.status : "");
      feedStr(e.ref ? "1" : "0");
      feedStr(typeof e.next === "number" ? String(e.next) : "");
      feedStr(typeof e.subgraphRef === "string" ? e.subgraphRef : "");
      feedStr(typeof e.source?.path === "string" ? e.source.path : "");
      feedStr(typeof e.source?.hash === "string" ? e.source.hash : "");
      feedArr(e.deployed);
      if (Array.isArray(e.children) && e.children.length > 0) {
        feedEls(e.children, depth + 1);
      }
    }
  };
  const feedRels = (rawRels: unknown) => {
    const rels = asObjArray<TuxMapLevelRel>(rawRels);
    feedStr(`#R:${rels.length}`);
    for (const r of rels) {
      feedStr(typeof r.from === "string" ? r.from : "");
      feedStr(typeof r.to === "string" ? r.to : "");
      feedStr(typeof r.label === "string" ? r.label : "");
      feedStr(typeof r.status === "string" ? r.status : "");
    }
  };

  feedEls(model?.level1?.elements);
  feedRels(model?.level1?.rels);
  feedStr(typeof model?.level2?.boundary === "string" ? model.level2.boundary : "");
  feedEls(model?.level2?.elements);
  feedRels(model?.level2?.rels);
  if (isPlainRecord(model?.level3)) {
    const keys = Object.keys(model.level3);
    feedStr(`#L3:${keys.length}`);
    for (const k of keys) {
      feedStr(k);
      feedEls(model.level3[k]);
    }
  }
  const l4Nodes = asObjArray<TuxMapDeploymentNode>(model?.level4?.nodes);
  feedStr(`#L4N:${l4Nodes.length}`);
  for (const n of l4Nodes) {
    feedStr(typeof n.id === "string" ? n.id : "");
    feedStr(typeof n.title === "string" ? n.title : "");
    feedStr(typeof n.kind === "string" ? n.kind : "");
    feedStr(typeof n.status === "string" ? n.status : "");
    feedStr(typeof n.group === "string" ? n.group : "");
    feedStr(typeof n.zone === "string" ? n.zone : "");
    feedStr(typeof n.subgraphRef === "string" ? n.subgraphRef : "");
    feedStr(typeof n.source?.path === "string" ? n.source.path : "");
    feedStr(typeof n.source?.hash === "string" ? n.source.hash : "");
    feedArr(n.hosts);
    if (Array.isArray(n.children) && n.children.length > 0) {
      feedEls(n.children);
    }
  }
  const l4Links = asObjArray<TuxMapDeploymentLink>(model?.level4?.links);
  feedStr(`#L4L:${l4Links.length}`);
  for (const l of l4Links) {
    feedStr(typeof l.from === "string" ? l.from : "");
    feedStr(typeof l.to === "string" ? l.to : "");
    feedStr(typeof l.kind === "string" ? l.kind : "");
    feedStr(typeof l.state === "string" ? l.state : "");
  }
  if (isPlainRecord(model?.subgraphs)) {
    const sgKeys = Object.keys(model.subgraphs);
    feedStr(`#SG:${sgKeys.length}`);
    for (const k of sgKeys) {
      feedStr(k);
      const sg = model.subgraphs[k];
      if (isPlainRecord(sg)) {
        feedEls(sg.elements);
        feedRels(sg.rels);
      }
    }
  }
  const codeLinks = asObjArray<TuxMapLink>(model?.links);
  feedStr(`#CL:${codeLinks.length}`);
  for (const l of codeLinks) {
    feedStr(typeof l.from === "string" ? l.from : "");
    feedStr(typeof l.to === "string" ? l.to : "");
    feedStr(typeof l.kind === "string" ? l.kind : "");
    feedStr(typeof l.at === "string" ? l.at : "");
    feedStr(l.stop ? "1" : "0");
    feedStr(typeof l.coupling === "string" ? l.coupling : "");
    feedStr(typeof l.phase === "string" ? l.phase : "");
  }
  const routes = asObjArray<TuxMapRouteEntry>(model?.routes);
  feedStr(`#RT:${routes.length}`);
  for (const rt of routes) {
    feedStr(typeof rt.method === "string" ? rt.method : "");
    feedStr(typeof rt.pattern === "string" ? rt.pattern : "");
    feedStr(typeof rt.handler === "string" ? rt.handler : "");
    feedStr(typeof rt.framework === "string" ? rt.framework : "");
  }
  return `${h1.toString(16).padStart(8, "0")}:${h2.toString(16).padStart(8, "0")}`;
}

/** Minimal zero-sample fallback model (`tti/tti-ux#114`). */
export const EMPTY_TTI_LEVEL_MODEL: TuxMapLevelModel = {
  level1: { title: "System Context", elements: [], rels: [] },
  level2: { title: "Containers", boundary: "", elements: [], rels: [] },
  level3: {},
  level4: { title: "Deployment", groups: [], nodes: [], links: [] },
};

/**
 * Memoized `O(V + E)` query index per `TuxMapLevelModel` instance so repeated
 * layer, blast-radius, shortest-path, and lease queries do not rebuild graph tables.
 */
export function getMapQueryIndex(model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL): TuxMapQueryIndex {
  const isObjModel = model != null && typeof model === "object";
  const stamp = isObjModel ? modelCacheStamp(model) : "empty";
  const cached = isObjModel ? MODEL_QUERY_INDEX_CACHE.get(model) : undefined;
  if (cached && cached.stamp === stamp) return cached.index;

  const subgraphOwners = collectSubgraphOwners(model);
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
  const depEdges: TuxMapGraphEdgeRecord[] = [];
  const seenHostEdges = new Set<string>();
  const normArr = (v?: unknown): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && Boolean(x));
    return typeof v === "string" && v ? [v] : [];
  };
  const addHostEdge = (elId: string, hid: string) => {
    if (!elId || !hid) return;
    const key = `${elId}\u0000${hid}`;
    if (seenHostEdges.has(key)) return;
    seenHostEdges.add(key);
    const he: TuxMapGraphEdgeRecord = {
      id: `dep-${elId}-${hid}`,
      from: elId,
      to: hid,
      level: 4,
      kind: "hosts",
    };
    edges.push(he);
    depEdges.push(he);
  };

  const addInlineChildren = (parentId: string, rawKids: unknown, depth = 0) => {
    if (!parentId || depth >= MAX_TREE_DEPTH) return;
    const kids = asObjArray<TuxMapLevelElement>(rawKids);
    if (kids.length === 0) return;
    const rawLvl = levelForFocus(parentId, model, parentOf);
    const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
    kids.forEach((k, idx) => {
      const id = (typeof k.id === "string" && k.id) || `${parentId}/${idx}`;
      const deployed = normArr(k.deployed);
      if (!nodes.has(id)) {
        nodes.set(id, {
          id,
          level: childLevel,
          kind: k.kind || "module",
          name: k.name ?? id,
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
          id: `pinl-${parentId}-${id}`,
          from: parentId,
          to: id,
          level: childLevel,
          kind: "parent-child",
        });
      }
      for (const hid of deployed) addHostEdge(id, hid);
      if (Array.isArray(k.children) && k.children.length > 0) {
        addInlineChildren(id, k.children, depth + 1);
      }
    });
  };

  // Level 1
  for (const e of asObjArray<TuxMapLevelElement>(model?.level1?.elements)) {
    if (typeof e.id !== "string" || !e.id) continue;
    const deployed = normArr(e.deployed);
    if (!nodes.has(e.id)) {
      nodes.set(e.id, {
        id: e.id,
        level: 1,
        kind: e.kind || "system",
        name: e.name ?? e.id,
        tech: e.tech,
        desc: e.desc,
        status: e.status,
        deployed: deployed.length > 0 ? deployed : undefined,
        source: e.source,
        diff: e.diff,
        roadmap: e.roadmap,
      });
    }
    for (const hid of deployed) addHostEdge(e.id, hid);
    if (Array.isArray(e.children) && e.children.length > 0) addInlineChildren(e.id, e.children);
  }

  const l1RelRecords: TuxMapGraphEdgeRecord[] = [];
  asObjArray<TuxMapLevelRel>(model?.level1?.rels).forEach((r, idx) => {
    if (typeof r.from !== "string" || typeof r.to !== "string" || !r.from || !r.to) return;
    const rec: TuxMapGraphEdgeRecord = {
      id: `l1-${idx}-${r.from}-${r.to}`,
      from: r.from,
      to: r.to,
      label: r.label,
      tech: r.tech,
      level: 1,
      kind: "rel",
      planned: r.status === "planned",
    };
    edges.push(rec);
    l1RelRecords.push(rec);
  });

  // Level 2
  const boundary = typeof model?.level2?.boundary === "string" ? model.level2.boundary : "";
  for (const e of asObjArray<TuxMapLevelElement | TuxMapLevelRef>(model?.level2?.elements)) {
    if (typeof e.id !== "string" || !e.id) continue;
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
        parentId: boundary || undefined,
        deployed,
        source: e.source,
        diff: e.diff,
        roadmap: e.roadmap,
      });
      if (boundary) {
        edges.push({
          id: `p2-${boundary}-${e.id}`,
          from: boundary,
          to: e.id,
          level: 2,
          kind: "parent-child",
        });
      }
    }
    for (const hid of deployed) addHostEdge(e.id, hid);
    if (Array.isArray(e.children) && e.children.length > 0) addInlineChildren(e.id, e.children);
  }

  const l2RelRecords: TuxMapGraphEdgeRecord[] = [];
  asObjArray<TuxMapLevelRel>(model?.level2?.rels).forEach((r, idx) => {
    if (typeof r.from !== "string" || typeof r.to !== "string" || !r.from || !r.to) return;
    const rec: TuxMapGraphEdgeRecord = {
      id: `l2-${idx}-${r.from}-${r.to}`,
      from: r.from,
      to: r.to,
      label: r.label,
      tech: r.tech,
      level: 2,
      kind: "rel",
      planned: r.status === "planned",
    };
    edges.push(rec);
    l2RelRecords.push(rec);
  });

  // Level 3
  if (isPlainRecord(model?.level3)) {
    for (const [parentId, rawKids] of Object.entries(model.level3)) {
      const kids = asObjArray<TuxMapLevelElement>(rawKids);
      const lvl = levelForFocus(parentId, model, parentOf);
      kids.forEach((k, idx) => {
        const id = (typeof k.id === "string" && k.id) || `${parentId}/${idx}`;
        const deployed = normArr(k.deployed);
        if (!nodes.has(id)) {
          nodes.set(id, {
            id,
            level: lvl,
            kind: k.kind || "component",
            name: k.name ?? id,
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
        for (const hid of deployed) addHostEdge(id, hid);
        if (typeof k.next === "number" && Number.isInteger(k.next) && k.next >= 0 && k.next < kids.length) {
          const nextId = (typeof kids[k.next]!.id === "string" && kids[k.next]!.id) || `${parentId}/${k.next}`;
          const nextEdge: TuxMapGraphEdgeRecord = {
            id: `l3-next-${id}-${nextId}`,
            from: id,
            to: nextId,
            level: lvl,
            kind: "rel",
            planned: k.status === "planned",
          };
          edges.push(nextEdge);
          depEdges.push(nextEdge);
        }
        if (Array.isArray(k.children) && k.children.length > 0) addInlineChildren(id, k.children);
      });
    }
  }

  // Level 4 (`dn.hosts` also emits deduplicated `hosts` edges: `F-05d`)
  for (const n of asObjArray<TuxMapDeploymentNode>(model?.level4?.nodes)) {
    if (typeof n.id !== "string" || !n.id) continue;
    const hosted = normArr(n.hosts);
    if (!nodes.has(n.id)) {
      nodes.set(n.id, {
        id: n.id,
        level: 4,
        kind: n.kind || "resource",
        name: n.title ?? n.id,
        tech: n.facts?.type || n.facts?.sku || n.facts?.size,
        desc: n.role,
        status: n.status,
        parentId: n.group || n.zone,
        hosts: hosted.length > 0 ? hosted : n.hosts,
        source: n.source,
        diff: n.diff,
        roadmap: n.roadmap,
      });
    }
    for (const hostedId of hosted) addHostEdge(hostedId, n.id);
    if (Array.isArray(n.children) && n.children.length > 0) addInlineChildren(n.id, n.children);
  }
  asObjArray<TuxMapDeploymentLink>(model?.level4?.links).forEach((l, idx) => {
    if (typeof l.from !== "string" || typeof l.to !== "string" || !l.from || !l.to) return;
    const depEdge: TuxMapGraphEdgeRecord = {
      id: `l4-${idx}-${l.from}-${l.to}`,
      from: l.from,
      to: l.to,
      label: l.label,
      tech: l.kind,
      level: 4,
      kind: "deployment",
      planned: l.state === "planned",
    };
    edges.push(depEdge);
    depEdges.push(depEdge);
  });

  // Level 5, 6, 7+ Subgraphs (level & owner computed via pre-pass + parent walk so child-before-parent order gets exact depth: `S-08`)
  if (isPlainRecord(model?.subgraphs)) {
    for (const [rawParentId, sg] of Object.entries(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const parentId = subgraphOwners.get(rawParentId) ?? rawParentId;
      const rawLvl = levelForFocus(parentId, model, parentOf);
      const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
      asObjArray<TuxMapLevelElement>(sg.elements).forEach((k, idx) => {
        const id = (typeof k.id === "string" && k.id) || `${parentId}/${idx}`;
        const deployed = normArr(k.deployed);
        if (!nodes.has(id)) {
          nodes.set(id, {
            id,
            level: childLevel,
            kind: k.kind || "module",
            name: k.name ?? id,
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
            id: `psg-${parentId}-${id}`,
            from: parentId,
            to: id,
            level: childLevel,
            kind: "parent-child",
          });
        }
        for (const hid of deployed) addHostEdge(id, hid);
        if (Array.isArray(k.children) && k.children.length > 0) addInlineChildren(id, k.children);
      });
      asObjArray<TuxMapLevelRel>(sg.rels).forEach((r, idx) => {
        if (typeof r.from !== "string" || typeof r.to !== "string" || !r.from || !r.to) return;
        const sgEdge: TuxMapGraphEdgeRecord = {
          id: `lsg-${parentId}-${idx}-${r.from}-${r.to}`,
          from: r.from,
          to: r.to,
          label: r.label,
          tech: r.tech,
          level: childLevel,
          kind: "rel",
          planned: r.status === "planned",
        };
        edges.push(sgEdge);
        depEdges.push(sgEdge);
      });
    }
  }

  // Code links: fine-grained dependencies (`mentions` stay in `edges` for view metadata, excluded from `depEdges`: `F-05c`)
  const validCodeLinks = asObjArray<TuxMapLink>(model?.links).filter(
    (l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to),
  );
  const nonProseCodeLinks: TuxMapLink[] = [];
  validCodeLinks.forEach((l, idx) => {
    if (!nodes.has(l.from) || !nodes.has(l.to)) return;
    const lnkEdge: TuxMapGraphEdgeRecord = {
      id: `lnk-${idx}-${l.from}-${l.to}`,
      from: l.from,
      to: l.to,
      label: l.kind,
      tech: l.at,
      level: nodes.get(l.from)!.level,
      kind: "rel",
    };
    edges.push(lnkEdge);
    if (!TUX_MAP_QUIET_LINK_KINDS.has(l.kind || "") && inferLinkCoupling(l) !== "prose") {
      depEdges.push(lnkEdge);
      nonProseCodeLinks.push(l);
    }
  });

  // Suppress coarse C4 summary rels when refined by Level 2 container rels or fine-grained code links (`N-03`)
  const hasNonProseCodeLinks = nonProseCodeLinks.length > 0;
  const codeCovered = new Set<string>();
  if (hasNonProseCodeLinks) {
    const hostBridge = buildHostBridge(model, subgraphOwners);
    const l2ContainerIds = new Set(
      asObjArray<TuxMapLevelElement>(model?.level2?.elements)
        .filter((e) => !e.ref && typeof e.id === "string" && Boolean(e.id))
        .map((e) => e.id),
    );
    const markCodeCovered = (id: string) => {
      for (const anc of mapAncestorsOf(id, parentOf)) {
        codeCovered.add(anc);
        if (boundary && l2ContainerIds.has(anc)) codeCovered.add(boundary);
        const hs = hostBridge.hostsByElement.get(anc);
        if (hs) {
          for (const hid of hs) codeCovered.add(hid);
        }
      }
    };
    for (const l of nonProseCodeLinks) {
      markCodeCovered(l.from);
      markCodeCovered(l.to);
    }
  }

  const l2RefinedSources = new Set<string>();
  const l2RefinedTargets = new Set<string>();
  for (const r of l2RelRecords) {
    l2RefinedSources.add(r.from);
    l2RefinedTargets.add(r.to);
    if (!(hasNonProseCodeLinks && codeCovered.has(r.from) && codeCovered.has(r.to))) {
      depEdges.push(r);
    }
  }
  for (const r of l1RelRecords) {
    const refinedByL2 =
      Boolean(boundary) &&
      ((r.to === boundary && l2RefinedSources.has(r.from)) ||
        (r.from === boundary && l2RefinedTargets.has(r.to)));
    const coveredByCode = hasNonProseCodeLinks && codeCovered.has(r.from) && codeCovered.has(r.to);
    if (!refinedByL2 && !coveredByCode) {
      depEdges.push(r);
    }
  }

  const edgesByFrom = new Map<string, TuxMapGraphEdgeRecord[]>();
  const edgesByTo = new Map<string, TuxMapGraphEdgeRecord[]>();
  const depEdgesByFrom = new Map<string, TuxMapGraphEdgeRecord[]>();
  const depEdgesByTo = new Map<string, TuxMapGraphEdgeRecord[]>();
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
  for (const e of depEdges) {
    pushMap(depEdgesByFrom, e.from, e);
    pushMap(depEdgesByTo, e.to, e);
  }

  const effectiveLinks = extractModelLinks(model);

  const idx: TuxMapQueryIndex = {
    parentOf,
    kidsOf,
    nodes,
    edges,
    edgesByFrom,
    edgesByTo,
    depEdgesByFrom,
    depEdgesByTo,
    neighborsByNode,
    effectiveLinks,
  };
  if (isObjModel) {
    MODEL_QUERY_INDEX_CACHE.set(model, { stamp, index: idx });
  }
  return idx;
}

/**
 * Indexes a `TuxMapLevelModel` into a unified Code Property Graph (CPG) index
 * spanning Levels 1..N (Context, Containers, Components, Deployment, Modules, Schemas, AST Symbols).
 */
export function buildUnifiedArchitectureGraph(model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL): {
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
  /** Optional cap on summary list arrays (`seeds`, `blockers`, `testsToRun`, `impactedSourceFiles`, etc.) to bound MCP payload size (`N-02`). */
  maxSummaryItems?: number;
  /** Omit redundant `descendantIds` duplicates of `seeds` while preserving `descendantCount` (`N-02`). */
  omitRedundantDescendants?: boolean;
}

export interface TuxMapImpactQueryResult {
  requestedSeeds: string[];
  seedCount: number;
  seeds: string[];
  descendantCount: number;
  descendantIds: string[];
  maxHops: number;
  truncated: boolean;
  totalHitCount: number;
  hitCount: number;
  offset: number;
  hasMore: boolean;
  hits: TuxMapImpactHit[];
  totalBlockerCount: number;
  blockers: string[];
  totalCoCutCount: number;
  coCutCandidates: string[];
  totalTestCount: number;
  testsToRun: string[];
  totalStampCount: number;
  stampsToRebuild: string[];
  totalBuildExecCount: number;
  buildExecImpacted: string[];
  totalHostCount: number;
  hostsImpacted: string[];
  coarseParentSteps: TuxMapCoarseParentStep[];
  downstreamIncluded: boolean;
  totalDownstreamCount: number;
  downstreamDependencies: Array<{ id: string; hop: number; name?: string; level?: number; node?: TuxMapGraphNodeRecord }>;
  totalImpactedFileCount: number;
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

const NODE_ID_PREFIX_RE = /^(?:p:pkg:|[fsdrp]:)/;

/**
 * Ranks up to `maxSuggestions` (capped at 10) close node IDs by prefix, substring, or token overlap.
 */
export function suggestCloseNodeIds(
  unknownId: string,
  nodes: ReadonlyMap<string, TuxMapGraphNodeRecord>,
  maxSuggestions = 10,
): string[] {
  const rawMax = Number.isFinite(maxSuggestions) ? maxSuggestions : 10;
  const cap = Math.min(10, Math.max(0, Math.floor(rawMax)));
  if (cap === 0) return [];
  const q = String(unknownId ?? "").trim().toLowerCase();
  const qStripped = q.replace(NODE_ID_PREFIX_RE, "");
  const tokens = qStripped.split(/[/:.#_-]+/).filter((t) => t.length >= 2);
  if (!q) return [];

  const scored: Array<{ id: string; score: number }> = [];
  for (const n of nodes.values()) {
    const idLower = n.id.toLowerCase();
    const idStripped = idLower.replace(NODE_ID_PREFIX_RE, "");
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
  model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL,
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
    if (level != null && n.level !== level) return false;
    if (kindSet && !kindSet.has(n.kind)) return false;
    if (qLower) {
      const hay = `${n.id}\n${n.name}\n${n.tech ?? ""}\n${n.desc ?? ""}\n${n.source?.path ?? ""}`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }
    return true;
  });

  const compact = opts.compact ?? false;
  const offset = Number.isFinite(opts.offset) ? Math.max(0, Math.floor(opts.offset!)) : 0;
  let effectiveLimit: number | null = null;
  if (opts.limit !== undefined && opts.limit !== null) {
    effectiveLimit = Number.isFinite(opts.limit) ? Math.max(0, Math.floor(opts.limit)) : 0;
  } else if (compact && !focusId && level == null && !kindSet && !qLower) {
    effectiveLimit = 100;
  }
  const pageNodes =
    effectiveLimit !== null
      ? matchedNodes.slice(offset, offset + effectiveLimit)
      : matchedNodes.slice(offset);
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
 * - Unknown node IDs (or invalid `intent`) return a `< 2 KB` error.
 */
export function queryArchitectureImpact(
  seedIds: string | Iterable<string>,
  model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL,
  opts: TuxMapImpactQueryOptions = {},
): TuxMapImpactQueryResult | TuxMapUnknownNodeError {
  if (opts.intent !== undefined && !TUX_MAP_VALID_BLAST_INTENTS.has(opts.intent)) {
    const clippedIntent = clipDisplayId(String(opts.intent), 64);
    return {
      error: `Invalid blast intent '${clippedIntent}'; expected one of: default, patch, refactor, cut, supply-chain.`,
      unknownIds: [],
      suggestions: [...TUX_MAP_VALID_BLAST_INTENTS],
    };
  }

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

  const coarseParentSteps: TuxMapCoarseParentStep[] = [];
  const redirectParentByLink = new WeakMap<TuxMapLink, string>();
  let blastLinks = links;

  // Per-seed C4 coarse-parent redirect links ONLY on a C4-only model when a Level 3 leaf component has zero direct incoming links (`F-09`)
  const hasCodeLinks = asObjArray<TuxMapLink>(model?.links).length > 0;
  if (!hasCodeLinks && opts.allowCoarseParentStep !== false && maxHops >= 1) {
    const incomingTargets = new Set(links.map((l) => l.to));
    const coarseRepresentativeByParent = new Map<string, string>();
    for (const s of rawSeeds) {
      const n = idx.nodes.get(s);
      const pid = idx.parentOf.get(s);
      if (
        n?.level === 3 &&
        (idx.kidsOf.get(s)?.length ?? 0) === 0 &&
        !incomingTargets.has(s) &&
        pid &&
        idx.nodes.has(pid) &&
        incomingTargets.has(pid) &&
        !mapAncestorsOf(pid, idx.parentOf).some((anc) => seenReq.has(anc))
      ) {
        coarseParentSteps.push({
          seedId: s,
          parentId: pid,
          reason: "Component has no direct links; stepped via enclosing container C4 relationships.",
        });
        if (!coarseRepresentativeByParent.has(pid)) {
          coarseRepresentativeByParent.set(pid, s);
        }
      }
    }

    if (coarseRepresentativeByParent.size > 0) {
      const redirected: TuxMapLink[] = [...links];
      for (const [pid, repSeed] of coarseRepresentativeByParent.entries()) {
        for (const l of links) {
          if (l.to === pid && l.from !== repSeed) {
            const synLink: TuxMapLink = {
              ...l,
              to: repSeed,
            };
            redirectParentByLink.set(synLink, pid);
            redirected.push(synLink);
          }
        }
      }
      blastLinks = redirected;
    }
  }

  const blast = computeLinkBlastRadius(blastLinks, rawSeeds, idx.parentOf, { ...opts, maxHops, model });
  const coarseViaByHitId = new Map<string, string>();
  if (coarseParentSteps.length > 0) {
    // `blast.hits` is ordered by ascending `hop`, so hop-1 redirect provenance propagates cleanly to hop 2..N
    for (const [id, h] of blast.hits.entries()) {
      const directParent = redirectParentByLink.get(h.via);
      if (directParent) {
        coarseViaByHitId.set(id, directParent);
      } else {
        const inherited = coarseViaByHitId.get(h.via.to);
        if (inherited) coarseViaByHitId.set(id, inherited);
      }
    }
  }

  const reqSet = new Set(rawSeeds);
  const allSeeds = [...blast.seeds];
  const descendantIds: string[] = [];
  for (const s of allSeeds) {
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
    opts.limit !== undefined && opts.limit !== null
      ? allHits.slice(
          offset,
          offset + (Number.isFinite(opts.limit) ? Math.max(0, Math.floor(opts.limit)) : 0),
        )
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
    const downQ: Array<[string, number]> = allSeeds.map((id) => [id, 0]);
    for (let qi = 0; qi < downQ.length; qi++) {
      const [id, hop] = downQ[qi]!;
      if (hop >= maxHops) continue;
      for (const e of idx.depEdgesByFrom.get(id) ?? []) {
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
  for (const id of [...allSeeds, ...blast.hits.keys(), ...downIds]) {
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

  const capList = <T>(arr: T[]): T[] => {
    if (opts.maxSummaryItems === undefined || opts.maxSummaryItems === null) return arr;
    const cap = Number.isFinite(opts.maxSummaryItems) ? Math.max(0, Math.floor(opts.maxSummaryItems)) : 0;
    return arr.slice(0, cap);
  };

  return {
    requestedSeeds: rawSeeds,
    seedCount: allSeeds.length,
    seeds: capList(allSeeds),
    descendantCount: descendantIds.length,
    descendantIds: opts.omitRedundantDescendants ? [] : capList(descendantIds),
    maxHops,
    truncated: blast.truncated,
    totalHitCount: allHits.length,
    hitCount: pagedHits.length,
    offset,
    hasMore: offset + pagedHits.length < allHits.length,
    hits: pagedHits,
    totalBlockerCount: blast.blockers.length,
    blockers: capList(blast.blockers),
    totalCoCutCount: blast.coCutCandidates.length,
    coCutCandidates: capList(blast.coCutCandidates),
    totalTestCount: blast.testsToRun.length,
    testsToRun: capList(blast.testsToRun),
    totalStampCount: blast.stampsToRebuild.length,
    stampsToRebuild: capList(blast.stampsToRebuild),
    totalBuildExecCount: blast.buildExecImpacted.length,
    buildExecImpacted: capList(blast.buildExecImpacted),
    totalHostCount: blast.hostsImpacted.length,
    hostsImpacted: capList(blast.hostsImpacted),
    coarseParentSteps,
    downstreamIncluded: includeDownstream,
    totalDownstreamCount: downstreamDependencies.length,
    downstreamDependencies: capList(downstreamDependencies),
    totalImpactedFileCount: impactedSourceFiles.length,
    impactedSourceFiles: capList(impactedSourceFiles),
  };
}

/**
 * Finds the shortest directed architectural dependency path between `fromNodeId` and `toNodeId`,
 * descending into code/components below `fromNodeId` when needed without climbing `child -> parent`
 * or shortcutting through unsuppressed coarse C4 summary edges (`tti/tti-ux#111`, `F-05`, `N-03`, `S-11`).
 *
 * Pass `{ direction: "upstream" }` to follow reverse dependency edges (`to -> from`).
 */
export function findArchitecturePath(
  fromNodeId: string,
  toNodeId: string,
  model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL,
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
  const targetDescendantSet = new Set(collectSubtreeDescendants(toNodeId, idx.kidsOf));
  const queue: string[] = [fromNodeId];
  const prev = new Map<string, { prevId: string; edge: TuxMapGraphEdgeRecord }>();
  const visited = new Set<string>([fromNodeId]);

  for (let qi = 0; qi < queue.length; qi++) {
    const curr = queue[qi]!;
    if (curr === toNodeId) break;

    const depEdges =
      direction === "downstream"
        ? (idx.depEdgesByFrom.get(curr) ?? [])
        : (idx.depEdgesByTo.get(curr) ?? []);

    // 1. Follow directed dependency edges first so direct wires win over descending into subgraphs at equal depth
    for (const e of depEdges) {
      if (!includePlanned && e.planned) continue;
      const next = direction === "downstream" ? e.to : e.from;
      if (!visited.has(next)) {
        visited.add(next);
        prev.set(next, { prevId: curr, edge: e });
        if (next === toNodeId) break;
        // Only treat entering a descendant of `toNodeId` as reaching `toNodeId` when `curr` is strictly outside `toNodeId` (`F-05a`, `S-11`)
        if (
          targetDescendantSet.has(next) &&
          !targetDescendantSet.has(curr) &&
          curr !== toNodeId &&
          !visited.has(toNodeId)
        ) {
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

    // 2. Descend `parent -> child` (`"contains"`) ONLY within `fromNodeId`'s own subtree (never climbing `child -> parent`
    //    or fabricating paths from a coarse container rel into arbitrary internal components: `F-05b`, `N-03`).
    if (fromSubtree.has(curr)) {
      for (const e of idx.edgesByFrom.get(curr) ?? []) {
        if (e.kind !== "parent-child") continue;
        const child = e.to;
        if (!visited.has(child)) {
          visited.add(child);
          const labelledEdge: TuxMapGraphEdgeRecord = e.label ? e : { ...e, label: "contains" };
          prev.set(child, { prevId: curr, edge: labelledEdge });
          if (child === toNodeId) break;
          queue.push(child);
        }
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
  model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL,
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
  model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL,
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
  if (blastOpts.intent !== undefined && !TUX_MAP_VALID_BLAST_INTENTS.has(blastOpts.intent)) {
    const clippedIntent = clipDisplayId(String(blastOpts.intent), 64);
    return {
      error: `Invalid blast intent '${clippedIntent}'; expected one of: default, patch, refactor, cut, supply-chain.`,
      unknownIds: [],
      suggestions: [...TUX_MAP_VALID_BLAST_INTENTS],
      availableNodeIds: [],
    };
  }
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
    for (const e of idx.depEdgesByFrom.get(id) ?? []) {
      if (!includePlanned && e.planned) continue;
      impactedEdgeIds.add(e.id);
      if (!blast.seeds.has(e.to) && !downstream.has(e.to)) {
        downstream.set(e.to, hop + 1);
        downQ.push([e.to, hop + 1]);
      }
    }
  }

  for (const id of [...blast.seeds, ...blast.hits.keys()]) {
    for (const e of idx.depEdgesByTo.get(id) ?? []) {
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
  model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL,
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
    const exp = Date.parse(lease.expiresAt);
    if (!Number.isFinite(exp) || exp <= now) {
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

  const model = opts.model || EMPTY_TTI_LEVEL_MODEL;
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

  const rawTtl = opts.ttlSeconds !== undefined && Number.isFinite(opts.ttlSeconds) ? opts.ttlSeconds : 900;
  const clampedTtlSeconds = Math.min(86400, Math.max(1, Math.floor(rawTtl)));
  const ttlMs = clampedTtlSeconds * 1000;
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

// ============================================================================
// 9. CROSS-LEVEL GO-TO SEARCH INDEX & SUBSEQUENCE / PATH-SEGMENT SCORER (#120)
// ============================================================================

export const TUX_MAP_SEARCH_GROUPS = [
  "Components",
  "Folders",
  "Files",
  "Functions",
  "Routes",
] as const;

export type TuxMapSearchGroup = (typeof TUX_MAP_SEARCH_GROUPS)[number];

export interface TuxMapSearchEntry {
  id: string;
  /** Target node ID to reveal on Enter (for HTTP routes, points to the handler when present). */
  revealId: string;
  group: TuxMapSearchGroup;
  level: number;
  kind: string;
  name: string;
  path: string;
  ancestors: string[];
  ancestorsText: string;
  tech: string;
  routePattern?: string;
  handlerName?: string;
  planned?: boolean;
  /** Internal precomputed fields for sub-millisecond scoring over 2,400+ entries. */
  nameLower: string;
  baseLower: string;
  stemLower: string;
  pathLower: string;
  segmentsLower: string[];
  ancestorsLower: string;
  techLower: string;
  kindLower: string;
  routeLower: string;
  charMask: number;
  routeRegex?: RegExp;
}

export interface TuxMapSearchHit {
  entry: TuxMapSearchEntry;
  score: number;
}

export interface TuxMapSearchGroupResult {
  group: TuxMapSearchGroup;
  hits: TuxMapSearchHit[];
  topScore: number;
}

const SEARCH_GROUP_RANK: ReadonlyMap<TuxMapSearchGroup, number> = /* @__PURE__ */ new Map(
  TUX_MAP_SEARCH_GROUPS.map((g, i) => [g, i]),
);

const MODEL_SEARCH_INDEX_CACHE = /* @__PURE__ */ new WeakMap<
  TuxMapLevelModel,
  { stamp: string; entries: TuxMapSearchEntry[] }
>();

const HTTP_ROUTE_TEXT_RE = /^(?:(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+)?(\/[^\s,;]*)$/i;

function computeAsciiMask(s: string): number {
  let mask = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 97 && c <= 122) {
      mask |= 1 << (c - 97);
    } else if (c >= 65 && c <= 90) {
      mask |= 1 << (c - 65);
    } else if (c >= 48 && c <= 57) {
      mask |= 1 << (26 + ((c - 48) & 3));
    } else if (c === 47) {
      mask |= 1 << 30;
    } else if (c === 45 || c === 95 || c === 46) {
      mask |= 1 << 31;
    }
  }
  return mask;
}

/** Compiles OpenAPI/Express/simple-capture route patterns without allowing backtracking ReDoS. */
function compileSafeRouteRegex(pattern: string): RegExp | undefined {
  const trimmed = pattern.trim();
  if (!trimmed || trimmed.length > 256 || !trimmed.includes("/")) return undefined;
  if (!trimmed.includes("{") && !trimmed.includes(":") && !trimmed.includes("([^/]+)")) {
    return undefined;
  }
  const escaped = trimmed
    .replace(/^\^+|\$+$/g, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\{[a-zA-Z0-9_.-]+\\\}/g, "[^/]+")
    .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, "[^/]+")
    .replace(/\\\(\\\[\\\^\/\\\]\\\+\\\)/g, "[^/]+");
  try {
    return new RegExp(`^${escaped}\\/?$`, "i");
  } catch {
    return undefined;
  }
}

function classifySearchGroup(
  id: string,
  kind: string,
  name: string,
  tech?: string,
  hasSourcePath?: boolean,
): TuxMapSearchGroup {
  if (kind === "route" || id.startsWith("r:")) return "Routes";
  if (kind === "symbol" || id.startsWith("s:")) return "Functions";
  if (
    id.startsWith("d:") ||
    (kind === "module" && !hasSourcePath && (name.endsWith("/") || /\bfolder\b/i.test(tech || "")))
  ) {
    return "Folders";
  }
  if (id.startsWith("f:") || kind === "module" || kind === "schema") return "Files";
  return "Components";
}

function makeSearchEntry(raw: {
  id: string;
  revealId: string;
  group: TuxMapSearchGroup;
  level: number;
  kind: string;
  name: string;
  path: string;
  ancestors: string[];
  tech: string;
  routePattern?: string;
  handlerName?: string;
  planned?: boolean;
}): TuxMapSearchEntry {
  const nameLower = raw.name.toLowerCase();
  const normPath = raw.path.replace(/\\/g, "/");
  const pathLower = normPath.toLowerCase();
  const segmentsLower = pathLower ? pathLower.split("/").filter(Boolean) : [];
  const lastSeg = segmentsLower.length > 0 ? segmentsLower[segmentsLower.length - 1]! : nameLower;
  const baseLower = raw.group === "Files" || raw.group === "Folders" ? lastSeg || nameLower : nameLower;
  const stemLower = baseLower
    .replace(/\(\)$/, "")
    .replace(/\/$/, "")
    .replace(/\.[a-z0-9]{1,6}$/i, "");
  const ancestorsText = raw.ancestors.join(" › ");
  const ancestorsLower = ancestorsText.toLowerCase();
  const techLower = raw.tech.toLowerCase();
  const kindLower = raw.kind.toLowerCase();
  const routeLower = (raw.routePattern || "").toLowerCase();
  const combined = `${nameLower}\n${pathLower}\n${ancestorsLower}\n${techLower}\n${kindLower}\n${routeLower}`;
  return {
    ...raw,
    path: normPath,
    ancestorsText,
    nameLower,
    baseLower,
    stemLower,
    pathLower,
    segmentsLower,
    ancestorsLower,
    techLower,
    kindLower,
    routeLower,
    charMask: computeAsciiMask(combined),
    routeRegex: raw.routePattern ? compileSafeRouteRegex(raw.routePattern) : undefined,
  };
}

interface SearchRawNode {
  id: string;
  name: string;
  kind: string;
  level: number;
  parentId?: string;
  tech?: string;
  status?: string;
  source?: TuxMapSourceRef;
}

/**
 * Builds (and WeakMap-caches) the unified Go-To search index across Levels 1–4,
 * all fractal subgraphs, `route` elements, `handled-by` links, and `model.routes` (`tti/tti-ux#120`).
 */
export function buildMapSearchIndex(model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL): TuxMapSearchEntry[] {
  const isObjModel = model != null && typeof model === "object";
  const stamp = isObjModel ? modelCacheStamp(model) : "empty";
  const cached = isObjModel ? MODEL_SEARCH_INDEX_CACHE.get(model) : undefined;
  if (cached && cached.stamp === stamp) return cached.entries;

  const parentOf = buildMapParentIndex(model);
  const subgraphOwners = collectSubgraphOwners(model);
  const nodes = new Map<string, SearchRawNode>();
  const addNode = (n: SearchRawNode) => {
    if (n.id && !nodes.has(n.id)) nodes.set(n.id, n);
  };
  const walkChildren = (ownerId: string, ownerLvl: number, kids?: TuxMapLevelElement[], seen = new Set<string>()) => {
    if (!kids?.length || seen.has(ownerId) || seen.size > MAX_TREE_DEPTH) return;
    seen.add(ownerId);
    for (const c of asObjArray<TuxMapLevelElement>(kids)) {
      if (!c.id) continue;
      addNode({
        id: c.id,
        name: c.name || c.id,
        kind: c.kind || "module",
        level: ownerLvl + 1,
        parentId: ownerId,
        tech: c.tech,
        status: c.status,
        source: c.source,
      });
      walkChildren(c.id, ownerLvl + 1, c.children, seen);
    }
    seen.delete(ownerId);
  };

  for (const e of asObjArray<TuxMapLevelElement>(model?.level1?.elements)) {
    addNode({ id: e.id, name: e.name || e.id, kind: e.kind || "system", level: 1, tech: e.tech, status: e.status, source: e.source });
  }
  const sysBoundary = model?.level2?.boundary || undefined;
  for (const e of asObjArray<TuxMapLevelElement | TuxMapLevelRef>(model?.level2?.elements)) {
    if (e.ref) continue;
    addNode({
      id: e.id,
      name: e.name || e.id,
      kind: e.kind || "container",
      level: 2,
      parentId: sysBoundary,
      tech: e.tech,
      status: e.status,
      source: e.source,
    });
    walkChildren(e.id, 4, e.children);
  }
  if (isPlainRecord(model?.level3)) {
    for (const [cid, comps] of Object.entries(model.level3)) {
      if (!hasOwn(model.level3, cid)) continue;
      for (const e of asObjArray<TuxMapLevelElement>(comps)) {
        addNode({
          id: e.id,
          name: e.name || e.id,
          kind: e.kind || "component",
          level: 3,
          parentId: cid,
          tech: e.tech,
          status: e.status,
          source: e.source,
        });
        walkChildren(e.id, 4, e.children);
      }
    }
  }
  for (const dn of asObjArray<TuxMapDeploymentNode>(model?.level4?.nodes)) {
    addNode({
      id: dn.id,
      name: dn.title || dn.id,
      kind: dn.kind || "resource",
      level: 4,
      parentId: dn.group,
      tech: dn.facts?.type || dn.facts?.sku || dn.facts?.size,
      status: dn.status,
      source: dn.source,
    });
    walkChildren(dn.id, 4, dn.children);
  }
  if (isPlainRecord(model?.subgraphs)) {
    for (const [ownerId, sg] of Object.entries(model.subgraphs)) {
      if (!hasOwn(model.subgraphs, ownerId) || !isPlainRecord(sg)) continue;
      const resolvedOwner = subgraphOwners.get(ownerId) ?? ownerId;
      const lvl = isLevel3Focus(resolvedOwner, model)
        ? 3
        : levelForFocus(resolvedOwner, model, parentOf);
      for (const e of asObjArray<TuxMapLevelElement>(sg.elements)) {
        addNode({
          id: e.id,
          name: e.name || e.id,
          kind: e.kind || "module",
          level: lvl,
          parentId: resolvedOwner,
          tech: e.tech,
          status: e.status,
          source: e.source,
        });
        walkChildren(e.id, lvl, e.children);
      }
    }
  }

  // Map route element ID -> handler node ID from `handled-by` or `routes` code links
  const handlerByRouteId = new Map<string, string>();
  for (const l of asObjArray<TuxMapLink>(model?.links)) {
    if (l.kind === "handled-by" && l.from && l.to && nodes.has(l.to)) {
      if (!handlerByRouteId.has(l.from)) handlerByRouteId.set(l.from, l.to);
    } else if (
      l.kind === "routes" &&
      l.from &&
      l.to &&
      (l.from.startsWith("r:") || nodes.get(l.from)?.kind === "route") &&
      nodes.has(l.to)
    ) {
      if (!handlerByRouteId.has(l.from)) handlerByRouteId.set(l.from, l.to);
    }
  }

  const entries: TuxMapSearchEntry[] = [];
  const seenRouteKeys = new Set<string>();

  const buildAncestors = (id: string): string[] => {
    const chain = mapAncestorsOf(id, parentOf);
    const names: string[] = [];
    for (let i = chain.length - 1; i >= 1; i--) {
      const ancId = chain[i]!;
      const n = nodes.get(ancId);
      names.push(n?.name || ancId);
    }
    if (names.length === 0) {
      const n = nodes.get(id);
      if (n?.parentId) {
        const pNode = nodes.get(n.parentId);
        names.push(pNode?.name || n.parentId);
      }
    }
    return names;
  };

  for (const n of nodes.values()) {
    const srcPath =
      n.source?.path ||
      (n.id.startsWith("f:") ? n.id.slice(2) : "") ||
      (n.id.startsWith("d:") ? n.id.slice(2).split(":").pop() || "" : "");
    const group = classifySearchGroup(n.id, n.kind, n.name, n.tech, Boolean(n.source?.path));
    const ancestors = buildAncestors(n.id);
    const linkedHandlerId = group === "Routes" ? handlerByRouteId.get(n.id) : undefined;
    const handlerNode = linkedHandlerId ? nodes.get(linkedHandlerId) : undefined;
    const routePattern =
      group === "Routes" ? (n.id.startsWith("r:") ? n.id.slice(2) : n.name) : undefined;
    if (routePattern) {
      seenRouteKeys.add(`${routePattern.toLowerCase()}\u0000${linkedHandlerId || n.id}`);
    }
    entries.push(
      makeSearchEntry({
        id: n.id,
        revealId: linkedHandlerId || n.id,
        group,
        level: n.level,
        kind: n.kind,
        name: n.name,
        path: handlerNode?.source?.path || srcPath,
        ancestors,
        tech: n.tech || "",
        routePattern,
        handlerName: handlerNode?.name,
        planned: n.status === "planned",
      }),
    );

    // Also surface HTTP route signatures attached on symbol `tech` / `source.symbol` (e.g. `"POST /v1/orders"`)
    if (group !== "Routes") {
      for (const candidate of [n.tech, n.source?.symbol]) {
        if (!candidate) continue;
        const m = candidate.trim().match(HTTP_ROUTE_TEXT_RE);
        if (!m) continue;
        const method = m[1] ? m[1].toUpperCase() : "";
        const pat = m[2]!;
        const disp = method ? `${method} ${pat}` : pat;
        const rKey = `${disp.toLowerCase()}\u0000${n.id}`;
        if (seenRouteKeys.has(rKey)) continue;
        seenRouteKeys.add(rKey);
        entries.push(
          makeSearchEntry({
            id: `route:${disp}->${n.id}`,
            revealId: n.id,
            group: "Routes",
            level: n.level,
            kind: "route",
            name: disp,
            path: srcPath,
            ancestors: [...ancestors, n.name],
            tech: n.name,
            routePattern: pat,
            handlerName: n.name,
            planned: n.status === "planned",
          }),
        );
      }
    }
  }

  for (const rt of asObjArray<TuxMapRouteEntry>(model?.routes)) {
    if (typeof rt.pattern !== "string" || !rt.pattern.trim()) continue;
    const method = typeof rt.method === "string" && rt.method.trim() ? rt.method.trim().toUpperCase() : "";
    const pat = rt.pattern.trim();
    const disp = method ? `${method} ${pat}` : pat;
    const handlerId = typeof rt.handler === "string" && rt.handler ? rt.handler : "";
    const handlerNode = handlerId ? nodes.get(handlerId) : undefined;
    const revealId = handlerNode ? handlerNode.id : handlerId || `r:${disp}`;
    const rKey = `${disp.toLowerCase()}\u0000${revealId}`;
    if (seenRouteKeys.has(rKey)) continue;
    seenRouteKeys.add(rKey);
    const ancestors = handlerNode ? [...buildAncestors(handlerNode.id), handlerNode.name] : [];
    entries.push(
      makeSearchEntry({
        id: `route:${disp}->${revealId}`,
        revealId,
        group: "Routes",
        level: handlerNode?.level ?? 5,
        kind: "route",
        name: disp,
        path: handlerNode?.source?.path || "",
        ancestors,
        tech: [rt.framework, handlerNode?.name || handlerId].filter(Boolean).join(" · "),
        routePattern: pat,
        handlerName: handlerNode?.name || handlerId || undefined,
        planned: handlerNode?.status === "planned",
      }),
    );
  }

  if (isObjModel) {
    MODEL_SEARCH_INDEX_CACHE.set(model, { stamp, entries });
  }
  return entries;
}

function isWordBoundary(str: string, idx: number): boolean {
  if (idx <= 0) return true;
  const prev = str.charCodeAt(idx - 1);
  // '/', '-', '_', '.', ':', '#', ' '
  return (
    prev === 47 ||
    prev === 45 ||
    prev === 95 ||
    prev === 46 ||
    prev === 58 ||
    prev === 35 ||
    prev === 32
  );
}

/** Zero-allocation ordered character subsequence scorer with consecutive & word-boundary bonuses. */
function subsequenceScore(q: string, target: string): number {
  const qLen = q.length;
  const tLen = target.length;
  if (qLen === 0 || qLen > tLen) return 0;
  let qi = 0;
  let bonus = 0;
  let firstIdx = -1;
  let prevMatchIdx = -2;
  for (let ti = 0; ti < tLen && qi < qLen; ti++) {
    if (target.charCodeAt(ti) === q.charCodeAt(qi)) {
      if (firstIdx < 0) firstIdx = ti;
      if (ti === prevMatchIdx + 1) {
        bonus += 18;
      } else if (isWordBoundary(target, ti)) {
        bonus += 14;
      }
      prevMatchIdx = ti;
      qi++;
    }
  }
  if (qi < qLen) return 0;
  const spanPenalty = Math.min(80, prevMatchIdx - firstIdx + 1 - qLen);
  const startBonus = firstIdx === 0 ? 35 : isWordBoundary(target, firstIdx) ? 20 : 0;
  return Math.max(40, 220 + bonus + startBonus - spanPenalty);
}

/** Scores path-segment matches such as `api/ord` or `src/ret` across `/` segments. */
function pathSegmentScore(qParts: readonly string[], segs: readonly string[]): number {
  if (qParts.length === 0 || segs.length === 0 || qParts.length > segs.length) return 0;
  let si = 0;
  let bonus = 0;
  for (let pi = 0; pi < qParts.length; pi++) {
    const qp = qParts[pi]!;
    let matched = false;
    while (si < segs.length) {
      const seg = segs[si]!;
      si++;
      if (seg === qp) {
        bonus += pi === qParts.length - 1 ? 140 : 70;
        matched = true;
        break;
      }
      if (seg.startsWith(qp)) {
        bonus += pi === qParts.length - 1 ? 110 : 55;
        matched = true;
        break;
      }
      const subIdx = seg.indexOf(qp);
      if (subIdx > 0) {
        bonus += 35;
        matched = true;
        break;
      }
    }
    if (!matched) return 0;
  }
  return 680 + bonus - segs.length * 3;
}

function scoreSearchEntry(
  e: TuxMapSearchEntry,
  q: string,
  qMask: number,
  qSlashParts: readonly string[] | null,
  qUrlPath: string | null,
): number {
  const maskHit = (e.charMask & qMask) === qMask;
  if (!maskHit && !(qUrlPath && e.routeRegex)) return 0;

  let best = 0;

  // 1. Route pattern & concrete URL path matching
  if (e.group === "Routes") {
    if (e.nameLower === q || e.routeLower === q) best = 1480;
    else if (e.routeLower && e.routeLower.startsWith(q)) best = Math.max(best, 1080 - e.routeLower.length);
    else if (e.nameLower.startsWith(q)) best = Math.max(best, 1060 - e.nameLower.length);
    else if (qUrlPath && e.routeRegex && e.routeRegex.test(qUrlPath)) best = Math.max(best, 1020);
    else if (e.nameLower.includes(q)) best = Math.max(best, 760 - e.nameLower.indexOf(q) * 3);
  }

  if (!maskHit) return best;

  // 2. Exact / prefix / word-boundary / substring on basename & display name
  if (e.stemLower === q || e.baseLower === q || e.nameLower === q) {
    best = Math.max(best, 1450 - Math.min(40, e.nameLower.length));
  } else if (e.stemLower.startsWith(q) || e.baseLower.startsWith(q)) {
    best = Math.max(best, 1050 - Math.min(60, e.baseLower.length * 2));
  } else if (e.nameLower.startsWith(q)) {
    best = Math.max(best, 980 - Math.min(60, e.nameLower.length));
  } else {
    const baseIdx = e.baseLower.indexOf(q);
    if (baseIdx > 0) {
      best = Math.max(best, (isWordBoundary(e.baseLower, baseIdx) ? 840 : 660) - baseIdx * 4);
    }
    const nameIdx = e.nameLower.indexOf(q);
    if (nameIdx > 0) {
      best = Math.max(best, (isWordBoundary(e.nameLower, nameIdx) ? 810 : 630) - nameIdx * 3);
    }
  }

  // 3. Multi-segment path scoring (`src/ret`, `api/orders`) and full path substring
  const pathOwnerDiscount = e.group === "Routes" || e.group === "Functions" ? 40 : 0;
  if (qSlashParts && e.segmentsLower.length > 0) {
    const ps = pathSegmentScore(qSlashParts, e.segmentsLower) - pathOwnerDiscount;
    if (ps > best) best = ps;
  }
  if (e.pathLower) {
    if (e.pathLower === q) best = Math.max(best, 1420 - pathOwnerDiscount);
    else {
      const pIdx = e.pathLower.indexOf(q);
      if (pIdx >= 0) {
        best = Math.max(
          best,
          (isWordBoundary(e.pathLower, pIdx) ? 740 : 540) - Math.min(80, pIdx * 2) - pathOwnerDiscount,
        );
      }
    }
  }

  // 4. Ordered character subsequence across basename, name, or path
  if (best < 500 && q.length >= 2) {
    const subBase = subsequenceScore(q, e.baseLower);
    if (subBase > 0) best = Math.max(best, subBase + 160);
    const subName = e.nameLower !== e.baseLower ? subsequenceScore(q, e.nameLower) : 0;
    if (subName > 0) best = Math.max(best, subName + 120);
    const subPath = e.pathLower ? subsequenceScore(q, e.pathLower) : 0;
    if (subPath > 0) best = Math.max(best, subPath + 60);
    if (e.routeLower) {
      const subRoute = subsequenceScore(q, e.routeLower);
      if (subRoute > 0) best = Math.max(best, subRoute + 140);
    }
  }

  // 5. Secondary metadata (`tech`, `ancestors`, `kind`, `id`)
  if (best === 0) {
    if (e.id.toLowerCase().includes(q)) best = 420;
    else if (e.techLower && e.techLower.includes(q)) best = 320;
    else if (e.ancestorsLower && e.ancestorsLower.includes(q)) best = 260;
    else if (e.kindLower && e.kindLower.includes(q)) best = 220;
  }

  if (best > 0) {
    if (e.group === "Files") best += 12;
    else if (e.group === "Components") best += 8;
    else if (e.group === "Routes" && qUrlPath) best += 14;
    if (e.planned) best -= 15;
  }
  return best;
}

/**
 * Searches across Components, Folders, Files, Functions, and Routes in `< 1 ms` over 2,400+ entries.
 * Groups are ordered by top hit score when `query` is non-empty so `Enter` jumps directly to the #1 match.
 */
export function searchArchitectureMap(
  modelOrEntries: TuxMapLevelModel | readonly TuxMapSearchEntry[],
  query: string,
  opts: { includePlanned?: boolean; limitPerGroup?: number } = {},
): {
  query: string;
  totalHits: number;
  groups: TuxMapSearchGroupResult[];
  flatHits: TuxMapSearchHit[];
} {
  const entries = Array.isArray(modelOrEntries)
    ? modelOrEntries
    : buildMapSearchIndex(modelOrEntries as TuxMapLevelModel);
  const includePlanned = opts.includePlanned ?? true;
  const limitPerGroup =
    opts.limitPerGroup !== undefined && Number.isFinite(opts.limitPerGroup)
      ? Math.max(1, Math.floor(opts.limitPerGroup))
      : 200;

  const trimmed = String(query ?? "").trim();
  const q = trimmed.toLowerCase();
  const byGroup = new Map<TuxMapSearchGroup, TuxMapSearchHit[]>();
  for (const g of TUX_MAP_SEARCH_GROUPS) byGroup.set(g, []);

  if (!q) {
    let totalHits = 0;
    for (const e of entries) {
      if (!includePlanned && e.planned) continue;
      const bucket = byGroup.get(e.group)!;
      totalHits++;
      if (bucket.length < limitPerGroup) {
        bucket.push({ entry: e, score: 1 });
      }
    }
    const groups: TuxMapSearchGroupResult[] = [];
    const flatHits: TuxMapSearchHit[] = [];
    for (const g of TUX_MAP_SEARCH_GROUPS) {
      const hits = byGroup.get(g)!;
      if (hits.length === 0) continue;
      groups.push({ group: g, hits, topScore: 1 });
      for (const h of hits) flatHits.push(h);
    }
    return { query: trimmed, totalHits, groups, flatHits };
  }

  const qMask = computeAsciiMask(q);
  const qSlashParts = q.includes("/") ? q.split("/").filter(Boolean) : null;
  const urlMatch = trimmed.match(HTTP_ROUTE_TEXT_RE);
  const qUrlPath = urlMatch ? urlMatch[2]! : trimmed.startsWith("/") ? trimmed : null;

  let totalHits = 0;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    if (!includePlanned && e.planned) continue;
    const score = scoreSearchEntry(e, q, qMask, qSlashParts, qUrlPath);
    if (score <= 0) continue;
    totalHits++;
    byGroup.get(e.group)!.push({ entry: e, score });
  }

  const groups: TuxMapSearchGroupResult[] = [];
  for (const g of TUX_MAP_SEARCH_GROUPS) {
    const hits = byGroup.get(g)!;
    if (hits.length === 0) continue;
    hits.sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.name.length - b.entry.name.length ||
        cmpCodepoint(a.entry.id, b.entry.id),
    );
    const topScore = hits[0]!.score;
    const capped = hits.length > limitPerGroup ? hits.slice(0, limitPerGroup) : hits;
    groups.push({ group: g, hits: capped, topScore });
  }

  groups.sort(
    (a, b) =>
      b.topScore - a.topScore ||
      (SEARCH_GROUP_RANK.get(a.group) ?? 0) - (SEARCH_GROUP_RANK.get(b.group) ?? 0),
  );

  const flatHits: TuxMapSearchHit[] = [];
  for (const grp of groups) {
    for (const h of grp.hits) flatHits.push(h);
  }

  return { query: trimmed, totalHits, groups, flatHits };
}


