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

/**
 * Side of a legacy canvas node an edge attaches to.
 * @internal
 */
export type TuxMapHandlePosition = "top" | "right" | "bottom" | "left";

/**
 * Legacy level-of-detail tier of the `nodes` / `edges` canvas (the `lodMode` prop).
 * @public
 */
export type TuxMapLoDLevel = "executive" | "resources" | "packages";

/**
 * Pointer tool of the annotation toolbar.
 * @public
 */
export type TuxMapTool = "select" | "pan" | "pen" | "laser" | "note";

/**
 * Operational status of a legacy `TuxMapNode` or one of its resources.
 * @public
 */
export type TuxMapStatus = "ok" | "warning" | "critical" | "maintenance" | "pending";

/**
 * Kind of a resource row on a legacy `TuxMapNode`.
 * @public
 */
export type TuxMapResourceKind = "person" | "vm" | "container" | "database" | "storage" | "gateway";

/**
 * A person or team on a legacy `TuxMapNode`.
 * @public
 */
export interface TuxMapPersonResource {
  id: string;
  kind: "person";
  name: string;
  role: string;
  initials?: string;
  handle?: string;
}

/**
 * A VM, container, database, storage or gateway on a legacy `TuxMapNode`.
 * @public
 */
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

/**
 * A resource row on a legacy `TuxMapNode`.
 * @public
 */
export type TuxMapResource = TuxMapPersonResource | TuxMapComputeResource;

/**
 * A package dependency row on a legacy `TuxMapNode`.
 * @public
 */
export interface TuxMapPackageDep {
  name: string;
  version: string;
  scope?: "internal" | "external" | "runtime";
  port?: number;
  protocol?: string;
}

/**
 * Legacy flat-canvas node (the `nodes` prop); `buildLevelModelFromLegacyNodes` converts a set of them into a level model.
 * @public
 */
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

/**
 * Legacy flat-canvas edge (the `edges` prop).
 * @public
 */
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

/**
 * Legacy environment zone (the `zones` prop).
 * @public
 */
export interface TuxMapZone {
  id: string;
  label: string;
  sublabel?: string;
  tone?: "maroon" | "blue" | "teal" | "green" | "gold" | "neutral";
  /** Optional explicit bounds; if omitted, auto-computed around member nodes */
  bounds?: { x: number; y: number; width: number; height: number };
}

/**
 * One sampled pointer position of an ink stroke or a laser trail.
 * @public
 */
export interface TuxMapStrokePoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

/**
 * A freehand ink stroke (the `strokes` prop and the `update:strokes` event).
 * @public
 */
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

/**
 * A sticky note (the `notes` prop and the `update:notes` event).
 * @public
 */
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

/**
 * A remote collaborator's cursor, tool and laser trail.
 * @public
 */
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

/**
 * Pan and zoom of the legacy canvas.
 * @internal
 */
export interface TuxMapViewport {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Axis-aligned rectangle in world coordinates.
 * @internal
 */
export interface TuxMapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// 1. SEMANTIC ZOOM LEVEL-OF-DETAIL (LoD) RESOLUTION
// ============================================================================

/**
 * Zoom thresholds between the legacy level-of-detail tiers.
 * @internal
 */
export const LOD_THRESHOLDS = {
  resources: 0.65,
  packages: 1.25,
} as const;

/**
 * Legacy level-of-detail tier for a zoom factor.
 * @internal
 */
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
 * @internal
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

/**
 * Screen point to legacy canvas world coordinates.
 * @internal
 */
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

/**
 * Legacy canvas world point to screen coordinates.
 * @internal
 */
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
 * @internal
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
 * @internal
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
 * @internal
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

/**
 * Path and label position returned by the legacy edge path helpers.
 * @internal
 */
export interface SmoothStepEdgeResult {
  path: string;
  labelX: number;
  labelY: number;
}

/**
 * Generates an orthogonal rounded-corner SVG path between two node handles,
 * returning both the SVG `d` string and the optimal midpoint `(labelX, labelY)`
 * for edge protocol badges.
 * @internal
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
 * @internal
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
 * @internal
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
 * @internal
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
 * @internal
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

/**
 * Resets one-shot Section 4/8 deprecation warning state (intended for test suites).
 * @internal
 */
export function resetArchitectureDeprecationWarnings(): void {
  emittedArchitectureDeprecations.clear();
}

/**
 * Computes the upstream (dependencies that feed `rootNodeId`) and downstream
 * (dependents impacted by `rootNodeId`) blast-radius subgraph using directed BFS.
 *
 * @deprecated Use `computeLinkBlastRadius` or `queryArchitectureImpact` instead.
 * @public
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
 * @internal
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

/**
 * Options of `getSmoothedFreehandSvgPath`.
 * @public
 */
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
 * @public
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
 * @public
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

/**
 * A level of the map: 1 Context, 2 Containers, 3 Components, 4 Infrastructure, 5 and deeper for code subgraphs.
 * @public
 */
export type TuxMapLevelNumber = number;

/**
 * What an element is; `TUX_MAP_ELEMENT_KIND_LABELS` holds the label of each kind.
 * @public
 */
export type TuxMapElementKind =
  | "person"
  | "system"
  | "container"
  | "database"
  | "storage"
  | "component"
  | "folder"
  | "file"
  | "function"
  | "class"
  | "constant"
  | "module"
  | "schema"
  | "symbol"
  | "route"
  | "external"
  | "resource";

/**
 * Canonical human-readable labels for `TuxMapElementKind` (`#116`, `#122`).
 * @public
 */
export const TUX_MAP_ELEMENT_KIND_LABELS: Record<TuxMapElementKind, string> = {
  person: "Person",
  system: "Software system",
  container: "Container",
  database: "Container: database",
  storage: "Container: storage",
  component: "Component",
  folder: "folder",
  file: "file",
  function: "function",
  class: "class",
  constant: "constant",
  module: "file",
  schema: "Data schema / index",
  symbol: "function",
  route: "HTTP route",
  external: "External system",
  resource: "Deployment node",
};

/**
 * Lifecycle status of an element or a relationship.
 * @public
 */
export type TuxMapElementStatus = "live" | "paused" | "planned" | "neighbor";

/**
 * Where an element lives in source: repository, path, lines, symbol, and the digests `computeGraphDelta` compares.
 * @public
 */
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

/**
 * Change badge of an element in a branch or pull-request overlay.
 * @public
 */
export interface TuxMapDiffInfo {
  /** Git diff change classification */
  changeType: "added" | "modified" | "deleted";
  /** Number of files or symbols touched inside this node */
  filesChanged?: number;
  /** Optional short summary of the change */
  summary?: string;
}

/**
 * The children of one element at Level 5 or deeper, and the relationships among them.
 * @public
 */
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

/**
 * Live operational facts shown on an element's card.
 * @public
 */
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
 * @public
 */
export type TuxMapLevelRef = Partial<Omit<TuxMapLevelElement, "id" | "ref">> & { id: string; ref: true };

/**
 * One element of the model at any level: a person, system, container, component, folder, file or symbol.
 * @public
 */
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
  /** Optional IDs of vendored copy elements folded into this representative card (`#121`) */
  vendoredCopies?: string[];
  /** True when this card itself is a vendored copy whose canonical source lies outside the view (`#121`) */
  isVendoredCopy?: boolean;
  /** Canonical source element ID when `isVendoredCopy` is true (`#121`) */
  vendoredFrom?: string;
}

/**
 * Consumer-supplied architectural dependency-rule violation (`#123`).
 * @public
 */
export interface TuxMapLinkViolation {
  /** Short rule identifier or title (e.g. `"no-component-cycle"`, `"leaf-lib"`) */
  rule: string;
  /** Optional human-readable explanation of what broke */
  message?: string;
  /** Optional actionable fix guidance supplied by the consumer */
  fix?: string;
  /** Optional severity tier (defaults to `"error"`) */
  severity?: "error" | "warning";
}

/**
 * A relationship drawn between two elements of one level.
 * @public
 */
export interface TuxMapLevelRel {
  from: string;
  to: string;
  label?: string;
  tech?: string;
  status?: TuxMapElementStatus;
  roadmap?: number[];
  /** Optional architectural dependency-rule violations carried by this wire (`#123`) */
  violations?: TuxMapLinkViolation[];
}

/**
 * A firewall rule listed in a deployment node's facts.
 * @public
 */
export interface TuxMapFirewallRule {
  direction: "in" | "out";
  access: "allow" | "deny";
  ports: string[];
  from: string[];
}

/**
 * A resource group inside a Level 4 zone.
 * @public
 */
export interface TuxMapDeploymentGroup {
  id: string;
  zone: string;
  title: string;
  rg?: string;
}

/**
 * A region or zone column of Level 4.
 * @public
 */
export interface TuxMapDeploymentZone {
  id: string;
  title: string;
  column?: "left" | "right" | "center";
  planned?: boolean;
  /** Optional additional zone IDs that also map into this region */
  zones?: string[];
}

/**
 * A Level 4 deployment resource and the containers it hosts.
 * @public
 */
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

/**
 * A link between two Level 4 deployment nodes.
 * @public
 */
export interface TuxMapDeploymentLink {
  from: string;
  to: string;
  label?: string;
  kind?: string;
  state?: "now" | "planned";
}

/**
 * A resource beside the deployment that the model lists but does not own.
 * @public
 */
export interface TuxMapNeighborResource {
  name: string;
  type: string;
  resourceGroup: string;
  reason: string;
}

/**
 * An HTTP route and the handler it resolves to.
 * @public
 */
export interface TuxMapRouteEntry {
  method?: string;
  pattern: string;
  handler: string;
  framework?: string;
}

/**
 * The architecture model the map renders and the query functions read: Levels 1 to 4, code subgraphs and code links.
 * @public
 */
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
  /** Optional pre-partitioned spreading & stopping link tiers (`#126`, `#731`). */
  linkTiers?: {
    spread?: TuxMapLink[];
    stop?: TuxMapLink[];
  };
  /** Optional list of link `kind`s treated as `stop: true` when `link.stop` is omitted (`#126`, `#731`). */
  stopKinds?: string[];
  /** Optional legacy-to-canonical bookmark alias map (`#716`, `#124`). */
  aliases?: Record<string, string>;
  /** Optional HTTP route table linking URL patterns to handler symbols or files (`#120`, `#122`). */
  routes?: TuxMapRouteEntry[];
}

/**
 * How strongly a link couples its two ends; decides which links each blast intent follows.
 * @public
 */
export type TuxMapLinkCoupling =
  | "contract"
  | "runtime"
  | "type-only"
  | "artifact-stamp"
  | "build-exec"
  | "verification"
  | "prose";

/**
 * Where a link's dependency takes effect: production runtime, client bundle, build, CI or docs.
 * @public
 */
export type TuxMapLinkPhase =
  | "prod-runtime"
  | "client-bundle"
  | "build-exec"
  | "ci-test"
  | "doc-only";

/**
 * The kind of change a blast radius is computed for.
 * @public
 */
export type TuxMapBlastIntent =
  | "default"
  | "patch"
  | "refactor"
  | "cut"
  | "supply-chain";

/**
 * One dependency read from code: `from` depends on `to`.
 * @public
 */
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
  /** Optional architectural dependency-rule violations on this link (`#123`) */
  violations?: TuxMapLinkViolation[];
}

/**
 * Pixel metrics of the card grid.
 * @internal
 */
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

/**
 * A placed card rectangle on the grid.
 * @internal
 */
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

/**
 * A placed boundary frame on the grid.
 * @internal
 */
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

/**
 * A routed wire: its two ends and SVG path.
 * @internal
 */
export interface TuxMapRoutedWire {
  id: string;
  from: string;
  to: string;
  d: string;
  planned: boolean;
  /** True when the underlying relationship carries one or more dependency-rule `violations` (`#123`) */
  violating?: boolean;
}

/**
 * A placed wire label.
 * @internal
 */
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
  violating?: boolean;
}

/**
 * Grid cell `[column, row]` to its pixel origin.
 * @internal
 */
export function gridCellToPx(at: [number, number]): { x: number; y: number } {
  const { CW, CH, GX, GY, PAD } = GRID_METRICS;
  return {
    x: PAD + at[0] * (CW + GX),
    y: PAD + 30 + at[1] * (CH + GY),
  };
}

/**
 * Converts a sequence of orthogonal `[x, y]` points into an SVG path with 9px rounded bends.
 * @internal
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
 * @internal
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

  // Spatial grid-cell bucketing (`256x192` cells, `#124`) so segment/label obstacle checks stay O(1) on dense views
  const CELL_W = 256;
  const CELL_H = 192;
  const cardBucket = new Map<string, number[]>();
  const placedBucket = new Map<string, number[]>();
  const addBoxToBucket = (
    bucket: Map<string, number[]>,
    idx: number,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    const gx0 = Math.floor(x / CELL_W);
    const gx1 = Math.floor((x + w) / CELL_W);
    const gy0 = Math.floor(y / CELL_H);
    const gy1 = Math.floor((y + h) / CELL_H);
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const key = `${gx},${gy}`;
        let arr = bucket.get(key);
        if (!arr) {
          arr = [];
          bucket.set(key, arr);
        }
        arr.push(idx);
      }
    }
  };

  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const pushPlacedBox = (b: { x: number; y: number; w: number; h: number }) => {
    const idx = placed.length;
    placed.push(b);
    addBoxToBucket(placedBucket, idx, b.x, b.y, b.w, b.h);
  };
  const overlapsPlacedBucket = (cand: { x: number; y: number; w: number; h: number }): boolean => {
    const gx0 = Math.floor(cand.x / CELL_W);
    const gx1 = Math.floor((cand.x + cand.w) / CELL_W);
    const gy0 = Math.floor(cand.y / CELL_H);
    const gy1 = Math.floor((cand.y + cand.h) / CELL_H);
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const hits = placedBucket.get(`${gx},${gy}`);
        if (!hits) continue;
        for (let hi = 0; hi < hits.length; hi++) {
          const q = placed[hits[hi]!]!;
          if (
            cand.x < q.x + q.w &&
            cand.x + cand.w > q.x &&
            cand.y < q.y + q.h &&
            cand.y + cand.h > q.y
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const cardEntries: Array<[string, TuxMapGridCellRect]> = [];
  for (const k of Object.keys(rects)) {
    const r = rects[k]!;
    if (!r.bound) {
      const ci = cardEntries.length;
      cardEntries.push([k, r]);
      addBoxToBucket(cardBucket, ci, r.x, r.y, r.w, r.h);
      pushPlacedBox({ x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 });
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
      const gx0 = Math.floor(Math.min(p0[0], p1[0]) / CELL_W);
      const gx1 = Math.floor(Math.max(p0[0], p1[0]) / CELL_W);
      const gy0 = Math.floor(Math.min(p0[1], p1[1]) / CELL_H);
      const gy1 = Math.floor(Math.max(p0[1], p1[1]) / CELL_H);
      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          const indices = cardBucket.get(`${gx},${gy}`);
          if (!indices) continue;
          for (let ii = 0; ii < indices.length; ii++) {
            const r = cardEntries[indices[ii]!]![1];
            if (i === 0 && r === a) continue;
            if (i === lastSeg && r === b) continue;
            if (segHitsRect(p0[0], p0[1], p1[0], p1[1], r)) return false;
          }
        }
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
    const a = hasOwn(rects, rel.from) ? rects[rel.from] : undefined;
    const b = hasOwn(rects, rel.to) ? rects[rel.to] : undefined;
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
  const hoverOnlyLabels = paths.length > 30;

  paths.forEach((p, idx) => {
    const pts = simplifyOrthogonalPoints(p.pts);
    for (let si = 0; si < pts.length - 1; si++) {
      wireSegments.push([pts[si]!, pts[si + 1]!, idx]);
    }

    const isViolating = Boolean(p.rel.violations?.length);
    wires.push({
      id: `w-${idx}-${p.rel.from}-${p.rel.to}`,
      from: p.rel.from,
      to: p.rel.to,
      d: roundOrthogonalCorners(pts),
      planned: p.rel.status === "planned",
      ...(isViolating ? { violating: true } : {}),
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
      if (!hoverOnlyLabels) {
        for (let j = 0; j < segs.length && !box; j++) {
          const sg = segs[j]!;
          for (const f of fractions) {
            const m: [number, number] = [
              sg[0][0] + (sg[1][0] - sg[0][0]) * f,
              sg[0][1] + (sg[1][1] - sg[0][1]) * f,
            ];
            const cand = { x: m[0] - w / 2, y: m[1] - h / 2, w, h };
            if (overlapsPlacedBucket(cand)) continue;

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
              if (!overlapsPlacedBucket(cand)) {
                box = cand;
                break;
              }
            }
          }
        }
      }

      const forced = hoverOnlyLabels || !box;
      if (!box) {
        if (hoverOnlyLabels && segs.length > 0) {
          const sg = segs[0]!;
          box = {
            x: sg[0][0] + (sg[1][0] - sg[0][0]) * 0.5 - w / 2,
            y: sg[0][1] + (sg[1][1] - sg[0][1]) * 0.5 - h / 2,
            w,
            h,
          };
        } else {
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
      }

      if (box) {
        if (!hoverOnlyLabels) {
          pushPlacedBox({ x: box.x - 2, y: box.y - 2, w: box.w + 4, h: box.h + 4 });
        }
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
          ...(isViolating ? { violating: true } : {}),
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
 * @internal
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
      hasOwn(rects, r.from) &&
      hasOwn(rects, r.to) &&
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
 * @public
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

/**
 * Link kinds drawn on no stage (they still count in the blast radius): a document naming a part.
 * @public
 */
export const TUX_MAP_QUIET_LINK_KINDS: ReadonlySet<string> = new Set(["mentions"]);

/**
 * Canonical link strength order from strongest runtime/contract edge to weakest prose reference.
 * @public
 */
export const TUX_MAP_LINK_STRENGTH_ORDER = [
  "calls",
  "handled-by",
  "sends",
  "reads",
  "denies",
  "forks",
  "copies-logic-of",
  "reads-format",
  "imports",
  "runs",
  "sources",
  "generates",
  "copies",
  "stamps",
  "suppresses",
  "provenance",
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

/**
 * What a link kind means, read from the part it points at ("changing X: Y calls it").
 * @public
 */
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

const QUAL_OWNER_REPO_NODE_ID_RE = /^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+):([cfsdpr]):(.*)$/;
const LEGACY_NODE_ID_RE = /^([cfsdpr]):(.*)$/;
const BARE_REPO_NODE_ID_RE = /^([A-Za-z0-9_.-]{2,}):([cfsdpr]):(.*)$/;

/**
 * Splits repo-qualified (`owner/repo:k:rest` or `repo:k:rest`) and legacy (`k:rest`)
 * node IDs into `{ repo, kind, rest }` (matching Python `_split_node_id` 1:1).
 * @internal
 */
export function splitNodeId(nid: string): {
  repo: string | null;
  kind: string | null;
  rest: string;
} {
  if (typeof nid !== "string" || !nid) {
    return { repo: null, kind: null, rest: "" };
  }
  if (nid.startsWith("p:pkg:") || nid.startsWith("s:pkg:") || nid.startsWith("r:")) {
    return { repo: "", kind: nid[0]!, rest: nid.slice(2) };
  }
  const mQual = QUAL_OWNER_REPO_NODE_ID_RE.exec(nid);
  if (mQual) {
    return { repo: mQual[1]!, kind: mQual[2]!, rest: mQual[3]! };
  }
  const mLeg = LEGACY_NODE_ID_RE.exec(nid);
  if (mLeg) {
    return { repo: "", kind: mLeg[1]!, rest: mLeg[2]! };
  }
  const mBare = BARE_REPO_NODE_ID_RE.exec(nid);
  if (mBare) {
    return { repo: mBare[1]!, kind: mBare[2]!, rest: mBare[3]! };
  }
  return { repo: null, kind: null, rest: nid };
}

/**
 * True when `nid` has node-ID kind `kind` (`'f'`, `'s'`, `'d'`, `'c'`, `'p'`, `'r'`), whether repo-qualified or legacy.
 * @internal
 */
export function isKindNodeId(
  nid: string,
  kind: string | readonly string[] | ReadonlySet<string>,
): boolean {
  const { kind: k } = splitNodeId(nid);
  if (!k) return false;
  if (typeof kind === "string") return k === kind;
  if (kind instanceof Set) return kind.has(k);
  return (kind as readonly string[]).includes(k);
}

/**
 * Strips legacy or repo-qualified kind prefixes (`owner/repo:f:`, `f:`, `p:pkg:`, etc.) for display/matching.
 * @internal
 */
export function stripNodeKindPrefix(nid: string): string {
  if (typeof nid !== "string" || !nid) return "";
  const { kind, rest } = splitNodeId(nid);
  if (!kind) return nid;
  if ((kind === "p" || kind === "s") && rest.startsWith("pkg:")) return rest.slice(4);
  return rest;
}

/**
 * Client-side deterministic link ID (`${kind}:${from}->${to}`, disambiguating duplicates with `#2`, `#3`, ...)
 * so models do not need to serialize explicit `id` fields on every link (`#716` `RO24`).
 * @internal
 */
export function deriveLinkId(
  link: Pick<TuxMapLink, "kind" | "from" | "to">,
  seenCounts?: Map<string, number>,
): string {
  const base = `${link.kind || "uses"}:${link.from}->${link.to}`;
  if (!seenCounts) return base;
  const n = (seenCounts.get(base) ?? 0) + 1;
  seenCounts.set(base, n);
  return n === 1 ? base : `${base}#${n}`;
}

/**
 * Plain human-readable element type label (`folder`, `file`, `function`, `class`, `HTTP route`, etc.: `#116`).
 * @public
 */
export function plainElementKindLabel(
  elOrKind:
    | Pick<TuxMapLevelElement, "id" | "kind" | "name" | "tech" | "source">
    | string
    | undefined,
  opts: { hasSourcePath?: boolean } = {},
): string {
  if (!elOrKind) return "element";
  if (typeof elOrKind === "string") {
    return (TUX_MAP_ELEMENT_KIND_LABELS as Record<string, string>)[elOrKind] || elOrKind;
  }
  const id = typeof elOrKind.id === "string" ? elOrKind.id : "";
  const kind = elOrKind.kind || "";
  const name = typeof elOrKind.name === "string" ? elOrKind.name : "";
  const tech = typeof elOrKind.tech === "string" ? elOrKind.tech : "";
  const hasPath = opts.hasSourcePath ?? Boolean(elOrKind.source?.path);

  if (
    kind === "folder" ||
    isKindNodeId(id, "d") ||
    (kind === "module" && !hasPath && (name.endsWith("/") || /\bfolder\b/i.test(tech)))
  ) {
    return "folder";
  }
  if (kind === "file" || isKindNodeId(id, "f") || (kind === "module" && hasPath)) {
    return "file";
  }
  if (kind === "class") return "class";
  if (kind === "constant") return "constant";
  if (kind === "function") return "function";
  if (kind === "symbol" || isKindNodeId(id, "s")) {
    if (/\bclass\b/i.test(tech)) return "class";
    if (!name.endsWith("()") && /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name)) {
      return "class";
    }
    return "function";
  }
  return (TUX_MAP_ELEMENT_KIND_LABELS as Record<string, string>)[kind] || kind || "element";
}

/**
 * Canonical set of valid semantic blast-radius intents (`tti/tti-ux#110` / `#111`).
 * @public
 */
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
  "folder",
]);

const NON_PROD_HOST_COUPLINGS: ReadonlySet<TuxMapLinkCoupling> = new Set([
  "verification",
  "artifact-stamp",
  "build-exec",
  "prose",
  "type-only",
]);

/**
 * Prototype-safe own-property check (`Object.prototype` keys like `"constructor"` return `false`).
 * @internal
 */
export function hasOwn(obj: unknown, key: PropertyKey): boolean {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Sets an own data property; safe for keys such as `__proto__`.
 * @internal
 */
export function setOwnProp<T>(obj: Record<string, T>, key: string, value: T): void {
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

/**
 * True Unicode code-point comparison (matches Python `str < str` even on supplementary U+10000+ planes).
 * @internal
 */
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

/**
 * Deterministic order of the links the blast radius walks.
 * @internal
 */
export function compareBlastLinks(a: TuxMapLink, b: TuxMapLink): number {
  return (
    linkStrengthRank(a.kind) - linkStrengthRank(b.kind) ||
    cmpCodepoint(a.from, b.from) ||
    cmpCodepoint(a.to, b.to) ||
    cmpCodepoint(a.at ?? "", b.at ?? "")
  );
}

/**
 * Infers deterministic semantic coupling for links that omit explicit `coupling` (rejecting spoofed downgrades on runtime kinds).
 * @public
 */
export function inferLinkCoupling(link: TuxMapLink): TuxMapLinkCoupling {
  const k = link.kind || "";
  if (link.coupling && VALID_LINK_COUPLINGS.has(link.coupling)) {
    const c = link.coupling;
    const spoofedProse = c === "prose" && NON_PROSE_LINK_KINDS.has(k);
    const spoofedTypeOnly = c === "type-only" && NON_TYPE_ONLY_LINK_KINDS.has(k);
    const spoofedRouteLoadContract =
      (k === "routes" || k === "denies" || k === "handled-by" || k === "links" || k === "loads") &&
      c !== "contract" &&
      c !== "runtime";
    const spoofedNonStopAux =
      !link.stop &&
      (k === "calls" ||
        k === "handled-by" ||
        k === "sends" ||
        k === "reads" ||
        k === "forks" ||
        k === "copies-logic-of" ||
        k === "reads-format" ||
        k === "runs" ||
        k === "uses" ||
        k === "imports" ||
        k === "sources") &&
      (c === "build-exec" || c === "verification" || c === "artifact-stamp");
    const spoofedCallsBuildStamp =
      (k === "calls" ||
        k === "handled-by" ||
        k === "sends" ||
        k === "reads" ||
        k === "forks" ||
        k === "copies-logic-of" ||
        k === "reads-format") &&
      (c === "build-exec" || c === "artifact-stamp");
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
  if (k === "tests" || k === "checks" || k === "suppresses" || k === "provenance") return "verification";
  if (k === "stamps" || k === "generates" || k === "copies") return "artifact-stamp";
  if (
    k === "routes" ||
    k === "denies" ||
    k === "handled-by" ||
    k === "links" ||
    k === "forks" ||
    k === "copies-logic-of" ||
    k === "reads-format"
  ) {
    return "contract";
  }
  if (k === "loads" || k === "uses" || k === "sends") return "runtime";
  if (k === "imports" || k === "sources" || k === "reads") return link.stop ? "verification" : "contract";
  if (k === "calls" || k === "runs") return link.stop ? "verification" : "runtime";
  return link.stop ? "verification" : "runtime";
}

/**
 * Infers deterministic execution/shipping phase for links that omit explicit `phase`.
 * @public
 */
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
 * @public
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
 * Resolves raw code links from `model.links` and/or `model.linkTiers` (`spread` / `stop`),
 * applying model-declared `model.stopKinds` when `l.stop` is omitted (`tti/tti-ux#126`).
 * @public
 */
export function resolveModelRawLinks(model?: TuxMapLevelModel): TuxMapLink[] {
  if (!model || typeof model !== "object") return [];
  const stopKinds = Array.isArray(model.stopKinds)
    ? new Set(model.stopKinds.filter((k): k is string => typeof k === "string" && Boolean(k)))
    : null;
  const direct = asObjArray<TuxMapLink>(model.links);
  const tiers = isPlainRecord(model.linkTiers) ? model.linkTiers : null;
  const tierSpread = tiers ? asObjArray<TuxMapLink>(tiers.spread) : [];
  const tierStop = tiers ? asObjArray<TuxMapLink>(tiers.stop) : [];

  if (tierSpread.length === 0 && tierStop.length === 0 && !stopKinds) {
    return direct.filter(
      (l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to),
    );
  }

  const out: TuxMapLink[] = [];
  const seen = new Set<string>();
  const pushLink = (l: TuxMapLink, defaultStop?: boolean) => {
    if (typeof l.from !== "string" || !l.from || typeof l.to !== "string" || !l.to) return;
    const kind = l.kind || "uses";
    const resolvedStop =
      l.stop !== undefined
        ? l.stop
        : defaultStop !== undefined
          ? defaultStop
          : stopKinds?.has(kind)
            ? true
            : undefined;
    const key = `${l.from}\u0000${l.to}\u0000${kind}\u0000${l.at ?? ""}\u0000${resolvedStop ? "1" : "0"}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (resolvedStop !== undefined && l.stop !== resolvedStop) {
      out.push({ ...l, stop: resolvedStop });
    } else {
      out.push(l);
    }
  };

  for (const l of direct) pushLink(l);
  for (const l of tierSpread) pushLink(l, false);
  for (const l of tierStop) pushLink(l, true);
  return out;
}

/**
 * Kind of problem `validateMapModel` reports. `resolved-empty-subgraph` is the one it never
 * reports itself: `<TuxArchitectureMap>` adds it to its own diagnostics, once per card, when
 * `resolveSubgraph` returned elements and sanitizing removed them all (`tti/tti-ux#156`).
 * @public
 */
export type TuxMapValidationIssueCode =
  | "missing-level"
  | "duplicate-id"
  | "reserved-id"
  | "parent-cycle"
  | "max-depth-exceeded"
  | "unknown-link-end"
  | "unknown-rel-end"
  | "resolved-empty-subgraph";

/**
 * One problem found by `validateMapModel`.
 * @public
 */
export interface TuxMapValidationIssue {
  code: TuxMapValidationIssueCode;
  message: string;
  nodeId?: string;
  targetId?: string;
}

/**
 * Result of `validateMapModel`.
 * @public
 */
export interface TuxMapValidationResult {
  valid: boolean;
  issues: TuxMapValidationIssue[];
  duplicateIds: string[];
  cycleIds: string[];
  unknownEnds: string[];
}

/**
 * Validates a `TuxMapLevelModel` without ever throwing (`tti/tti-ux#124`), reporting:
 * - missing `level1`..`level4` sections,
 * - duplicate node IDs,
 * - parent/subgraph cycles,
 * - hierarchy depth exceeding 64,
 * - unknown relationship or code-link endpoints.
 * @public
 */
export function validateMapModel(model: unknown): TuxMapValidationResult {
  const issues: TuxMapValidationIssue[] = [];
  const duplicateSet = new Set<string>();
  const cycleSet = new Set<string>();
  const unknownSet = new Set<string>();

  if (!isPlainRecord(model)) {
    return {
      valid: false,
      issues: [{ code: "missing-level", message: "Model must be a non-null object." }],
      duplicateIds: [],
      cycleIds: [],
      unknownEnds: [],
    };
  }

  for (const reqKey of ["level1", "level2", "level3", "level4"] as const) {
    if (!isPlainRecord(model[reqKey])) {
      issues.push({
        code: "missing-level",
        message: `Missing required '${reqKey}' section on architecture model.`,
      });
    }
  }

  const m = model as unknown as TuxMapLevelModel;
  const knownIds = new Set<string>();
  const seenPrimaryIds = new Set<string>();
  const rawEdges: Array<[string, string]> = [];

  const reservedSeen = new Set<string>();
  const isReservedStageId = (id: string): boolean => id === "@bound" || id.startsWith("@more-");
  const noteDef = (id: string, parentId?: string) => {
    if (!id) return;
    if (isReservedStageId(id) && !reservedSeen.has(id)) {
      reservedSeen.add(id);
      issues.push({
        code: "reserved-id",
        message: `Element id '${id}' collides with reserved internal stage identifier.`,
        nodeId: id,
      });
    }
    knownIds.add(id);
    if (seenPrimaryIds.has(id)) {
      if (!duplicateSet.has(id)) {
        duplicateSet.add(id);
        issues.push({
          code: "duplicate-id",
          message: `Duplicate element id '${id}'.`,
          nodeId: id,
        });
      }
    } else {
      seenPrimaryIds.add(id);
    }
    if (parentId) rawEdges.push([id, parentId]);
  };

  const walkKids = (pid: string, rawKids: unknown, depth: number) => {
    const kids = asObjArray<TuxMapLevelElement>(rawKids);
    if (kids.length === 0) return;
    if (depth > MAX_TREE_DEPTH) {
      issues.push({
        code: "max-depth-exceeded",
        message: `Element '${pid}' exceeds maximum tree depth (${MAX_TREE_DEPTH}).`,
        nodeId: pid,
      });
      return;
    }
    kids.forEach((k, idx) => {
      const id = (typeof k.id === "string" && k.id) || `${pid}/${idx}`;
      noteDef(id, pid);
      if (Array.isArray(k.children) && k.children.length > 0) {
        walkKids(id, k.children, depth + 1);
      }
    });
  };

  const l1 = isPlainRecord(m.level1) ? m.level1 : undefined;
  const l2 = isPlainRecord(m.level2) ? m.level2 : undefined;
  const l3 = isPlainRecord(m.level3) ? m.level3 : undefined;
  const l4 = isPlainRecord(m.level4) ? m.level4 : undefined;

  if (l1) {
    for (const e of asObjArray<TuxMapLevelElement>(l1.elements)) {
      if (typeof e.id !== "string" || !e.id) continue;
      noteDef(e.id);
      if (Array.isArray(e.children) && e.children.length > 0) walkKids(e.id, e.children, 1);
    }
  }
  if (l2) {
    if (typeof l2.boundary === "string" && l2.boundary) knownIds.add(l2.boundary);
    for (const e of asObjArray<TuxMapLevelElement | TuxMapLevelRef>(l2.elements)) {
      if (typeof e.id !== "string" || !e.id) continue;
      knownIds.add(e.id);
      if (e.ref) continue;
      if (!seenPrimaryIds.has(e.id)) {
        seenPrimaryIds.add(e.id);
      } else if (!asObjArray<TuxMapLevelElement>(l1?.elements).some((x) => x.id === e.id)) {
        if (!duplicateSet.has(e.id)) {
          duplicateSet.add(e.id);
          issues.push({
            code: "duplicate-id",
            message: `Duplicate element id '${e.id}'.`,
            nodeId: e.id,
          });
        }
      }
      if (Array.isArray(e.children) && e.children.length > 0) walkKids(e.id, e.children, 1);
    }
  }
  if (l3) {
    for (const [cid, kids] of Object.entries(l3)) {
      if (cid) knownIds.add(cid);
      walkKids(cid, kids, 1);
    }
  }
  if (l4) {
    for (const g of asObjArray<TuxMapDeploymentGroup>(l4.groups)) {
      if (typeof g.id === "string" && g.id) knownIds.add(g.id);
    }
    for (const n of asObjArray<TuxMapDeploymentNode>(l4.nodes)) {
      if (typeof n.id !== "string" || !n.id) continue;
      noteDef(n.id);
      if (Array.isArray(n.children) && n.children.length > 0) walkKids(n.id, n.children, 1);
    }
  }

  const subgraphOwners = collectSubgraphOwners(m);
  if (isPlainRecord(m.subgraphs)) {
    for (const [key, sg] of Object.entries(m.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const owner = subgraphOwners.get(key) ?? key;
      if (key) knownIds.add(key);
      if (owner) knownIds.add(owner);
      const kids = asObjArray<TuxMapLevelElement>(sg.elements);
      kids.forEach((k, idx) => {
        const id = (typeof k.id === "string" && k.id) || `${owner}/${idx}`;
        if (knownIds.has(id)) {
          // If an element already exists under a parent (e.g. a cycle `a -> b -> a`), still record the parent edge for cycle detection
          rawEdges.push([id, owner]);
          if (!duplicateSet.has(id) && id !== owner) {
            duplicateSet.add(id);
            issues.push({
              code: "duplicate-id",
              message: `Duplicate element id '${id}'.`,
              nodeId: id,
            });
          }
        } else {
          noteDef(id, owner);
        }
        if (Array.isArray(k.children) && k.children.length > 0) walkKids(id, k.children, 1);
      });
    }
  }

  // Detect cycles and depth > 64 across all `child -> parent` edges
  const parentsByChild = new Map<string, string[]>();
  for (const [c, p] of rawEdges) {
    if (!c || !p) continue;
    let arr = parentsByChild.get(c);
    if (!arr) {
      arr = [];
      parentsByChild.set(c, arr);
    }
    if (!arr.includes(p)) arr.push(p);
  }

  const state = new Map<string, 0 | 1 | 2>();
  for (const startId of parentsByChild.keys()) {
    if ((state.get(startId) ?? 0) !== 0) continue;
    const stack: Array<{ id: string; nextIdx: number }> = [{ id: startId, nextIdx: 0 }];
    const onStack = new Set<string>([startId]);
    state.set(startId, 1);

    while (stack.length > 0) {
      if (stack.length > MAX_TREE_DEPTH + 1) {
        const deepId = stack[0]!.id;
        issues.push({
          code: "max-depth-exceeded",
          message: `Parent chain from '${deepId}' exceeds maximum depth (${MAX_TREE_DEPTH}).`,
          nodeId: deepId,
        });
        stack.pop();
        continue;
      }
      const top = stack[stack.length - 1]!;
      const ps = parentsByChild.get(top.id) ?? [];
      if (top.nextIdx >= ps.length) {
        state.set(top.id, 2);
        onStack.delete(top.id);
        stack.pop();
        continue;
      }
      const nextParent = ps[top.nextIdx++]!;
      if (onStack.has(nextParent)) {
        if (!cycleSet.has(nextParent)) {
          cycleSet.add(nextParent);
          issues.push({
            code: "parent-cycle",
            message: `Parent cycle detected involving '${top.id}' -> '${nextParent}'.`,
            nodeId: top.id,
            targetId: nextParent,
          });
        }
        cycleSet.add(top.id);
      } else if ((state.get(nextParent) ?? 0) === 0 && parentsByChild.has(nextParent)) {
        state.set(nextParent, 1);
        onStack.add(nextParent);
        stack.push({ id: nextParent, nextIdx: 0 });
      }
    }
  }

  const checkEnd = (endId: unknown, ownerId: string, code: "unknown-link-end" | "unknown-rel-end") => {
    if (typeof endId !== "string" || !endId) {
      issues.push({
        code,
        message: `Empty endpoint on ${code === "unknown-link-end" ? "link" : "relationship"} from '${ownerId}'.`,
        nodeId: ownerId,
      });
      return;
    }
    if (!knownIds.has(endId)) {
      if (!unknownSet.has(endId)) {
        unknownSet.add(endId);
        issues.push({
          code,
          message: `Unknown ${code === "unknown-link-end" ? "link" : "relationship"} endpoint '${endId}'.`,
          nodeId: ownerId,
          targetId: endId,
        });
      }
    }
  };

  for (const r of asObjArray<TuxMapLevelRel>(l1?.rels)) {
    checkEnd(r.from, String(r.from ?? ""), "unknown-rel-end");
    checkEnd(r.to, String(r.from ?? ""), "unknown-rel-end");
  }
  for (const r of asObjArray<TuxMapLevelRel>(l2?.rels)) {
    checkEnd(r.from, String(r.from ?? ""), "unknown-rel-end");
    checkEnd(r.to, String(r.from ?? ""), "unknown-rel-end");
  }
  for (const dl of asObjArray<TuxMapDeploymentLink>(l4?.links)) {
    checkEnd(dl.from, String(dl.from ?? ""), "unknown-rel-end");
    checkEnd(dl.to, String(dl.from ?? ""), "unknown-rel-end");
  }
  if (isPlainRecord(m.subgraphs)) {
    for (const sg of Object.values(m.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      for (const r of asObjArray<TuxMapLevelRel>(sg.rels)) {
        checkEnd(r.from, String(r.from ?? ""), "unknown-rel-end");
        checkEnd(r.to, String(r.from ?? ""), "unknown-rel-end");
      }
    }
  }
  for (const l of resolveModelRawLinks(m)) {
    checkEnd(l.from, l.from, "unknown-link-end");
    checkEnd(l.to, l.from, "unknown-link-end");
  }

  return {
    valid: issues.length === 0,
    issues,
    duplicateIds: [...duplicateSet].sort(cmpCodepoint),
    cycleIds: [...cycleSet].sort(cmpCodepoint),
    unknownEnds: [...unknownSet].sort(cmpCodepoint),
  };
}

/**
 * Produces a safe, non-throwing `TuxMapLevelModel` alongside its `validateMapModel` diagnostics (`tti/tti-ux#124`),
 * filling missing levels and breaking cyclic subgraph references.
 * @public
 */
export function sanitizeMapModel(raw: unknown): {
  model: TuxMapLevelModel;
  validation: TuxMapValidationResult;
} {
  const validation = validateMapModel(raw);
  if (!isPlainRecord(raw)) {
    return { model: EMPTY_TTI_LEVEL_MODEL, validation };
  }
  const m = raw as unknown as TuxMapLevelModel;
  const cycleSet = new Set(validation.cycleIds);
  const sanitizeId = (id: unknown): string => {
    if (typeof id !== "string" || !id) return "";
    if (id === "@bound" || id.startsWith("@more-")) return `id:${id}`;
    return id;
  };
  const sanitizeRelEndpoints = <T extends { from?: unknown; to?: unknown }>(rawList: unknown): T[] =>
    asObjArray<T>(rawList)
      .filter((r) => typeof r.from === "string" && Boolean(r.from) && typeof r.to === "string" && Boolean(r.to))
      .map((r) => {
        const nf = sanitizeId(r.from);
        const nt = sanitizeId(r.to);
        return nf === r.from && nt === r.to ? r : ({ ...r, from: nf, to: nt } as T);
      });

  const subgraphOwners = collectSubgraphOwners(m);
  const parentOfAccepted = new Map<string, string>();
  const wouldCreateCycle = (childId: string, ownerId: string): boolean => {
    if (!childId || !ownerId) return false;
    if (childId === ownerId) return true;
    let cur: string | undefined = ownerId;
    for (let depth = 0; cur && depth <= MAX_TREE_DEPTH; depth++) {
      if (cur === childId) return true;
      cur = parentOfAccepted.get(cur);
    }
    return false;
  };

  const sanitizeChildElements = (
    rawEls: unknown,
    ownerId: string,
    depth: number,
  ): TuxMapLevelElement[] => {
    if (depth > MAX_TREE_DEPTH) return [];
    const out: TuxMapLevelElement[] = [];
    for (const el of asObjArray<TuxMapLevelElement>(rawEls)) {
      const rawId = typeof el.id === "string" ? el.id : "";
      const id = sanitizeId(rawId);
      if (id && ownerId) {
        if (wouldCreateCycle(id, ownerId)) continue;
        if (cycleSet.has(id) && parentOfAccepted.has(id)) continue;
        if (!parentOfAccepted.has(id)) parentOfAccepted.set(id, ownerId);
      }
      const hasKids = Array.isArray(el.children);
      const hasChildRels = Array.isArray(el.childRels);
      const nextKids = hasKids ? sanitizeChildElements(el.children, id || ownerId, depth + 1) : undefined;
      const nextChildRels = hasChildRels ? sanitizeRelEndpoints<TuxMapLevelRel>(el.childRels) : undefined;
      if (id !== rawId || hasKids || hasChildRels) {
        out.push({
          ...el,
          ...(id !== rawId ? { id } : {}),
          ...(hasKids ? { children: nextKids } : {}),
          ...(hasChildRels ? { childRels: nextChildRels } : {}),
        });
      } else {
        out.push(el);
      }
    }
    return out;
  };

  const l1Els = sanitizeChildElements(m.level1?.elements, "", 0);
  for (const e of l1Els) {
    if (e.id && !parentOfAccepted.has(e.id)) parentOfAccepted.set(e.id, "");
  }

  const l2Els: Array<TuxMapLevelElement | TuxMapLevelRef> = [];
  for (const e of asObjArray<TuxMapLevelElement | TuxMapLevelRef>(m.level2?.elements)) {
    const rawId = typeof e.id === "string" ? e.id : "";
    const id = sanitizeId(rawId);
    if (!e.ref && id && !parentOfAccepted.has(id)) {
      parentOfAccepted.set(id, sanitizeId(m.level2?.boundary) || "");
    }
    const hasKids = !e.ref && Array.isArray((e as TuxMapLevelElement).children);
    const nextKids = hasKids
      ? sanitizeChildElements((e as TuxMapLevelElement).children, id, 1)
      : undefined;
    if (id !== rawId || hasKids) {
      l2Els.push({
        ...e,
        ...(id !== rawId ? { id } : {}),
        ...(hasKids ? { children: nextKids } : {}),
      } as TuxMapLevelElement);
    } else {
      l2Els.push(e);
    }
  }

  const safeLevel3: Record<string, TuxMapLevelElement[]> = Object.create(null);
  if (isPlainRecord(m.level3)) {
    for (const [rawCid, kids] of Object.entries(m.level3)) {
      const cid = sanitizeId(rawCid);
      if (!cid) continue;
      setOwnProp(safeLevel3, cid, sanitizeChildElements(kids, cid, 1));
    }
  }

  const l4Nodes: TuxMapDeploymentNode[] = [];
  for (const n of asObjArray<TuxMapDeploymentNode>(m.level4?.nodes)) {
    const rawId = typeof n.id === "string" ? n.id : "";
    const id = sanitizeId(rawId);
    if (id && !parentOfAccepted.has(id)) parentOfAccepted.set(id, sanitizeId(n.group) || "");
    const hasKids = Array.isArray(n.children);
    const nextKids = hasKids ? sanitizeChildElements(n.children, id, 1) : undefined;
    l4Nodes.push(
      id !== rawId || hasKids
        ? { ...n, ...(id !== rawId ? { id } : {}), ...(hasKids ? { children: nextKids } : {}) }
        : n,
    );
  }

  let safeSubgraphs: Record<string, TuxMapSubgraph> | undefined;
  if (isPlainRecord(m.subgraphs)) {
    const cleaned: Record<string, TuxMapSubgraph> = Object.create(null);
    for (const [rawKey, sg] of Object.entries(m.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const key = sanitizeId(rawKey);
      if (!key) continue;
      const owner = sanitizeId(subgraphOwners.get(rawKey) ?? rawKey) || key;
      const els = sanitizeChildElements(sg.elements, owner, 1);
      const rels = sg.rels !== undefined ? sanitizeRelEndpoints<TuxMapLevelRel>(sg.rels) : undefined;
      setOwnProp(cleaned, key, {
        ...(sg as unknown as TuxMapSubgraph),
        elements: els,
        ...(rels !== undefined ? { rels } : {}),
      });
    }
    safeSubgraphs = cleaned;
  }

  let safeAliases: Record<string, string> | undefined;
  if (isPlainRecord(m.aliases)) {
    const cleanedAliases: Record<string, string> = Object.create(null);
    for (const [ak, av] of Object.entries(m.aliases)) {
      if (typeof av === "string" && ak && av && ak !== av) {
        setOwnProp(cleanedAliases, sanitizeId(ak), sanitizeId(av));
      }
    }
    // Break any alias cycles deterministically
    for (const ak of Object.keys(cleanedAliases)) {
      const seen = new Set<string>([ak]);
      let cur = cleanedAliases[ak];
      while (cur && hasOwn(cleanedAliases, cur)) {
        if (seen.has(cur)) {
          delete cleanedAliases[ak];
          break;
        }
        seen.add(cur);
        cur = cleanedAliases[cur];
      }
    }
    safeAliases = cleanedAliases;
  }

  const safeLinks = Array.isArray(m.links)
    ? sanitizeRelEndpoints<TuxMapLink>(m.links)
    : undefined;

  const safeModel: TuxMapLevelModel = {
    ...m,
    level1: {
      ...(isPlainRecord(m.level1) ? m.level1 : {}),
      elements: l1Els,
      rels: sanitizeRelEndpoints<TuxMapLevelRel>(m.level1?.rels),
    },
    level2: {
      ...(isPlainRecord(m.level2) ? m.level2 : {}),
      boundary: sanitizeId(m.level2?.boundary),
      elements: l2Els,
      rels: sanitizeRelEndpoints<TuxMapLevelRel>(m.level2?.rels),
    },
    level3: safeLevel3,
    level4: {
      ...(isPlainRecord(m.level4) ? m.level4 : {}),
      groups: asObjArray<TuxMapDeploymentGroup>(m.level4?.groups),
      nodes: l4Nodes,
      links: sanitizeRelEndpoints<TuxMapDeploymentLink>(m.level4?.links),
    },
    ...(safeSubgraphs ? { subgraphs: safeSubgraphs } : {}),
    ...(safeAliases ? { aliases: safeAliases } : {}),
    ...(safeLinks !== undefined ? { links: safeLinks } : {}),
  };
  return { model: safeModel, validation };
}

function isFolderLikeElement(e: TuxMapLevelElement): boolean {
  const id = typeof e.id === "string" ? e.id : "";
  if (e.kind === "folder" || isKindNodeId(id, "d")) return true;
  if (
    e.kind === "module" &&
    !e.source?.path &&
    ((typeof e.name === "string" && e.name.endsWith("/")) || /\bfolder\b/i.test(e.tech || ""))
  ) {
    return true;
  }
  return false;
}

/**
 * Collapses single-child folder chains (`a/ -> b/ -> c/` becomes `a/b/c/`) and skips the intermediate
 * `Folders` subgraph level for small components (`<= maxSmallComponentFiles`, default `8`), recording
 * `aliases[skippedFolderId] = resolvedFocusId` so existing `#focus=` bookmarks still resolve (`tti/tti-ux#124`).
 * @public
 */
export function collapseModelSubgraphs(
  model: TuxMapLevelModel,
  opts: { maxSmallComponentFiles?: number } = {},
): { model: TuxMapLevelModel; aliases: Record<string, string> } {
  const aliases: Record<string, string> = Object.create(null);
  if (isPlainRecord(model?.aliases)) {
    for (const [ak, av] of Object.entries(model.aliases)) {
      if (typeof av === "string" && ak && av && ak !== av) {
        setOwnProp(aliases, ak, av);
      }
    }
  }
  if (!isPlainRecord(model?.subgraphs)) {
    return { model, aliases };
  }
  const maxSmallFiles = opts.maxSmallComponentFiles ?? 8;
  const origSubgraphs = model.subgraphs;
  const nextSubgraphs: Record<string, TuxMapSubgraph> = Object.create(null);
  for (const [k, sg] of Object.entries(origSubgraphs)) {
    if (isPlainRecord(sg)) {
      setOwnProp(nextSubgraphs, k, {
        ...(sg as unknown as TuxMapSubgraph),
        elements: [...asObjArray<TuxMapLevelElement>(sg.elements)],
      });
    }
  }

  // 1. Collapse single-child folder chains (`d1 -> d2 -> ... -> dk`)
  const collapsedSkipKeys = new Set<string>();
  const resolveFolderChain = (el: TuxMapLevelElement, ownerKey: string): TuxMapLevelElement => {
    if (!isFolderLikeElement(el) || !el.id || el.id === ownerKey) return el;
    const names: string[] = [(el.name || el.id).replace(/\/+$/, "")];
    const skippedIds: string[] = [];
    let curr = el;
    const seen = new Set<string>([ownerKey, el.id]);

    for (let depth = 0; depth < MAX_TREE_DEPTH; depth++) {
      const sgKey = curr.subgraphRef || curr.id;
      const sg = hasOwn(nextSubgraphs, sgKey) ? nextSubgraphs[sgKey] : undefined;
      if (!sg || sg.elements.length !== 1) break;
      const onlyChild = sg.elements[0]!;
      if (!onlyChild?.id || seen.has(onlyChild.id) || !isFolderLikeElement(onlyChild)) break;
      const childSgKey = onlyChild.subgraphRef || onlyChild.id;
      if (seen.has(childSgKey) || !hasOwn(nextSubgraphs, childSgKey)) break;
      seen.add(onlyChild.id);
      seen.add(childSgKey);
      skippedIds.push(curr.id);
      if (curr.subgraphRef) skippedIds.push(curr.subgraphRef);
      names.push((onlyChild.name || onlyChild.id).replace(/\/+$/, ""));
      curr = onlyChild;
    }

    if (skippedIds.length === 0) return el;
    for (const sid of skippedIds) {
      if (sid !== curr.id) {
        setOwnProp(aliases, sid, curr.id);
        collapsedSkipKeys.add(sid);
      }
    }
    return {
      ...curr,
      name: `${names.join("/")}/`,
    };
  };

  for (const [k, sg] of Object.entries(nextSubgraphs)) {
    sg.elements = sg.elements.map((el) => resolveFolderChain(el, k));
    setOwnProp(nextSubgraphs, k, sg);
  }
  for (const sid of collapsedSkipKeys) {
    if (hasOwn(nextSubgraphs, sid)) {
      delete nextSubgraphs[sid];
    }
  }

  // 2. Skip the `Folders` level for small Level 3 components (`<= maxSmallComponentFiles` total direct files)
  const componentIds = new Set<string>();
  if (isPlainRecord(model.level3)) {
    for (const kids of Object.values(model.level3)) {
      for (const comp of asObjArray<TuxMapLevelElement>(kids)) {
        if (typeof comp.id === "string" && comp.id) {
          componentIds.add(comp.subgraphRef || comp.id);
        }
      }
    }
  }

  for (const compKey of componentIds) {
    if (!hasOwn(nextSubgraphs, compKey)) continue;
    const compSg = nextSubgraphs[compKey]!;
    if (compSg.elements.length === 0) continue;
    const folderKids = compSg.elements.filter(isFolderLikeElement);
    if (folderKids.length === 0) continue;

    // Gather immediate elements inside each folder; only flatten when none of the folders contain nested subfolders
    const flattened: TuxMapLevelElement[] = [];
    const childFolderRels: TuxMapLevelRel[] = [];
    const skippedFolderKeys: string[] = [];
    let canFlatten = true;
    const multiFolders = compSg.elements.length > 1;

    for (const item of compSg.elements) {
      if (!isFolderLikeElement(item)) {
        flattened.push(item);
        continue;
      }
      const fKey = item.subgraphRef || item.id;
      const fSg = hasOwn(nextSubgraphs, fKey) ? nextSubgraphs[fKey] : undefined;
      if (!fSg || fSg.elements.length === 0 || fSg.elements.some(isFolderLikeElement)) {
        canFlatten = false;
        break;
      }
      skippedFolderKeys.push(item.id);
      if (item.subgraphRef) skippedFolderKeys.push(item.subgraphRef);
      if (Array.isArray(fSg.rels)) {
        childFolderRels.push(...asObjArray<TuxMapLevelRel>(fSg.rels));
      }
      const prefix = (item.name || "").replace(/\/+$/, "");
      for (const fileEl of fSg.elements) {
        const needsPrefix =
          multiFolders &&
          prefix &&
          prefix !== "(root)" &&
          !(fileEl.name || "").startsWith(`${prefix}/`);
        flattened.push(
          needsPrefix ? { ...fileEl, name: `${prefix}/${fileEl.name || fileEl.id}` } : fileEl,
        );
      }
    }

    if (canFlatten && flattened.length > 0 && flattened.length <= maxSmallFiles) {
      const skippedSet = new Set(skippedFolderKeys);
      const keptCompRels = asObjArray<TuxMapLevelRel>(compSg.rels).filter(
        (r) => !skippedSet.has(r.from) && !skippedSet.has(r.to),
      );
      const mergedRels = [...keptCompRels, ...childFolderRels];
      setOwnProp(nextSubgraphs, compKey, {
        ...compSg,
        stratum: compSg.stratum && /\bfolders?\b/i.test(compSg.stratum) ? "Files" : compSg.stratum,
        elements: flattened,
        ...(compSg.rels !== undefined || childFolderRels.length > 0 ? { rels: mergedRels } : {}),
      });
      for (const fk of skippedFolderKeys) {
        if (fk !== compKey) setOwnProp(aliases, fk, compKey);
        if (hasOwn(nextSubgraphs, fk)) delete nextSubgraphs[fk];
      }
    }
  }

  const changed = Object.keys(aliases).length > 0;
  if (!changed) return { model, aliases };

  const resolveAliasTarget = (id: string): string => {
    let cur = id;
    const seen = new Set<string>([cur]);
    while (hasOwn(aliases, cur) && seen.size < MAX_TREE_DEPTH) {
      const nxt = aliases[cur]!;
      if (!nxt || seen.has(nxt)) break;
      seen.add(nxt);
      cur = nxt;
    }
    return cur;
  };

  for (const [k, sg] of Object.entries(nextSubgraphs)) {
    if (!Array.isArray(sg.rels) || sg.rels.length === 0) continue;
    const seenPair = new Set<string>();
    const remappedRels: TuxMapLevelRel[] = [];
    for (const r of asObjArray<TuxMapLevelRel>(sg.rels)) {
      const from = resolveAliasTarget(r.from);
      const to = resolveAliasTarget(r.to);
      if (!from || !to || from === to) continue;
      const pk = `${from}\u0000${to}`;
      if (seenPair.has(pk)) continue;
      seenPair.add(pk);
      remappedRels.push(from === r.from && to === r.to ? r : { ...r, from, to });
    }
    setOwnProp(nextSubgraphs, k, { ...sg, rels: remappedRels });
  }

  return {
    model: {
      ...model,
      subgraphs: nextSubgraphs,
      aliases,
    },
    aliases,
  };
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
 * @public
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
 * and +1 for each nested subgraph below that (cycle-safe, iterative, bounded at `MAX_TREE_DEPTH`: `#124`).
 * @public
 */
export function levelForFocus(
  fid: string,
  model: TuxMapLevelModel,
  parentOf: Map<string, string> = buildMapParentIndex(model),
): number {
  if (isLevel3Focus(fid, model)) return 3;
  const seen = new Set<string>([fid]);
  let cur = fid;
  let extraDepth = 0;
  while (seen.size < MAX_TREE_DEPTH) {
    const p = parentOf.get(cur);
    if (!p || seen.has(p) || isLevel3Focus(p, model)) {
      return 5 + extraDepth;
    }
    seen.add(p);
    if (isLevel3Focus(cur, model)) {
      return 3 + extraDepth;
    }
    extraDepth += 1;
    cur = p;
  }
  return 5 + extraDepth;
}

function fnvFeedStr(h: number, s: string): number {
  let out = h;
  for (let i = 0; i < s.length; i++) {
    out = Math.imul(out ^ s.charCodeAt(i), 0x01000193) >>> 0;
  }
  return Math.imul(out ^ 0xff, 0x01000193) >>> 0;
}

interface CachedParentTables {
  stamp: number;
  size: number;
  kidsOf: Map<string, string[]>;
}

const PARENT_TABLES_CACHE = /* @__PURE__ */ new WeakMap<ReadonlyMap<string, string>, CachedParentTables>();

function getParentTables(parentOf: ReadonlyMap<string, string>): CachedParentTables {
  let stamp = 0x811c9dc5;
  for (const [c, p] of parentOf) {
    stamp = fnvFeedStr(fnvFeedStr(stamp, c), p);
  }
  const cached = PARENT_TABLES_CACHE.get(parentOf);
  if (cached && cached.size === parentOf.size && cached.stamp === stamp) return cached;
  const kidsOf = new Map<string, string[]>();
  for (const [c, p] of parentOf) {
    let arr = kidsOf.get(p);
    if (!arr) {
      arr = [];
      kidsOf.set(p, arr);
    }
    arr.push(c);
  }
  const tables: CachedParentTables = {
    stamp,
    size: parentOf.size,
    kidsOf,
  };
  PARENT_TABLES_CACHE.set(parentOf, tables);
  return tables;
}

interface CachedLinkAdjacency {
  len: number;
  stamp: number;
  validLinks: TuxMapLink[];
  into: Map<string, TuxMapLink[]>;
  outByFrom: Map<string, TuxMapLink[]>;
}

const LINK_ADJACENCY_CACHE = /* @__PURE__ */ new WeakMap<readonly TuxMapLink[], CachedLinkAdjacency>();

function getLinkAdjacency(links: readonly TuxMapLink[]): CachedLinkAdjacency {
  if (!Array.isArray(links)) {
    return {
      len: 0,
      stamp: 0,
      validLinks: [],
      into: new Map(),
      outByFrom: new Map(),
    };
  }
  const len = links.length;
  let stamp = 0x811c9dc5;
  for (let i = 0; i < len; i++) {
    const l = links[i];
    if (!l || typeof l !== "object") continue;
    stamp = fnvFeedStr(stamp, typeof l.from === "string" ? l.from : "");
    stamp = fnvFeedStr(stamp, typeof l.to === "string" ? l.to : "");
    stamp = fnvFeedStr(stamp, typeof l.kind === "string" ? l.kind : "");
    stamp = Math.imul(stamp ^ (l.stop ? 0x31 : 0x30), 0x01000193) >>> 0;
  }

  const cached = LINK_ADJACENCY_CACHE.get(links);
  if (cached && cached.len === len && cached.stamp === stamp) {
    return cached;
  }

  const validLinks: TuxMapLink[] = [];
  const into = new Map<string, TuxMapLink[]>();
  const outByFrom = new Map<string, TuxMapLink[]>();

  for (const l of asObjArray<TuxMapLink>(links)) {
    if (typeof l.from !== "string" || typeof l.to !== "string" || !l.from || !l.to) continue;
    validLinks.push(l);
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

  const built: CachedLinkAdjacency = {
    len,
    stamp,
    validLinks,
    into,
    outByFrom,
  };
  LINK_ADJACENCY_CACHE.set(links, built);
  return built;
}

/**
 * `id` and its ancestors, nearest first, in a new array the caller may change.
 * O(depth): this runs several times per link, so it must not touch the whole map.
 * @public
 */
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

/**
 * The nearest of `id` and its ancestors that is in `set`, or null.
 * @internal
 */
export function liftToSet(id: string, set: ReadonlySet<string>, parentOf: Map<string, string>): string | null {
  for (const a of mapAncestorsOf(id, parentOf)) if (set.has(a)) return a;
  return null;
}

/**
 * Extracts fine-grained `TuxMapLink[]` from `model`: returns `model.links` / `model.linkTiers` when present
 * (bridging non-planned C4/Level-4 relationships for endpoints without fine-grained code-link coverage unless
 * `bridgeUncovered === false`), or synthesizes links from C4 `rels` and `level4.links` when `model.links`
 * is empty/absent.
 * @public
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
  const rawLinks = resolveModelRawLinks(model);
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
  const push = (from: string, to: string, kind: string, label?: string, violations?: TuxMapLinkViolation[]) => {
    if (typeof from !== "string" || typeof to !== "string" || !from || !to) return;
    if (covered && covered.has(to)) return;
    if (coveredPairs && coveredPairs.has(`${from}\u0000${to}`)) return;
    const normKind = kind || "uses";
    const key = `${from}\u0000${to}\u0000${normKind}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      from,
      to,
      kind: normKind,
      label,
      coupling: "runtime",
      phase: "prod-runtime",
      ...(violations?.length ? { violations } : {}),
    });
  };
  for (const r of asObjArray<TuxMapLevelRel>(model?.level1?.rels)) {
    if (!includePlanned && r.status === "planned") continue;
    push(r.from, r.to, "uses", r.label, r.violations);
  }
  for (const r of asObjArray<TuxMapLevelRel>(model?.level2?.rels)) {
    if (!includePlanned && r.status === "planned") continue;
    push(r.from, r.to, "uses", r.label, r.violations);
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
        push(r.from, r.to, "uses", r.label, r.violations);
      }
    }
  }
  for (const l of asObjArray<TuxMapDeploymentLink>(model?.level4?.links)) {
    if (!includePlanned && l.state === "planned") continue;
    push(l.from, l.to, l.kind || "uses", l.label);
  }
  return out;
}

/**
 * Dependency wire filter categories (`tti/tti-ux#118`).
 * @public
 */
export type TuxMapWireCategory = "prod" | "tests" | "ci" | "docs";

/**
 * Every `TuxMapWireCategory`, in display order.
 * @public
 */
export const TUX_MAP_WIRE_CATEGORIES: readonly TuxMapWireCategory[] = [
  "prod",
  "tests",
  "ci",
  "docs",
] as const;

/**
 * Classifies a fine-grained `TuxMapLink` into `"prod" | "tests" | "ci" | "docs"` (`tti/tti-ux#118`).
 * @public
 */
export function classifyLinkDependencyCategory(link: TuxMapLink): TuxMapWireCategory {
  const k = link.kind || "uses";
  if (k === "mentions") return "docs";
  const c = inferLinkCoupling(link);
  const p = inferLinkPhase(link);
  if (c === "prose" || p === "doc-only") return "docs";
  if (isPureDocNode(link.from) || isPureDocNode(link.to)) return "docs";
  if (
    k === "checks" ||
    k === "suppresses" ||
    c === "build-exec" ||
    p === "build-exec" ||
    isWorkflowPathNode(link.from) ||
    isWorkflowPathNode(link.to)
  ) {
    return "ci";
  }
  if (k === "tests" || c === "verification" || p === "ci-test" || TEST_ONLY_PATH_RE.test(repoPathForNodeId(link.from))) {
    return "tests";
  }
  return "prod";
}

/**
 * Filters `links` to those matching `categories` (`tti/tti-ux#118`).
 * @public
 */
export function filterLinksByCategories(
  links: readonly TuxMapLink[],
  categories: ReadonlySet<TuxMapWireCategory> | Iterable<TuxMapWireCategory>,
): TuxMapLink[] {
  const catSet = categories instanceof Set ? categories : new Set(categories);
  if (catSet.size === 0) return [];
  if (
    catSet.has("prod") &&
    catSet.has("tests") &&
    catSet.has("ci") &&
    catSet.has("docs")
  ) {
    return [...links];
  }
  return links.filter((l) => catSet.has(classifyLinkDependencyCategory(l)));
}

/**
 * One code link behind a lifted wire, as the wire inspector lists it.
 * @public
 */
export interface TuxMapWireInspectorLinkItem {
  from: string;
  to: string;
  kind: string;
  at?: string;
  sites?: number[];
  stop?: boolean;
  violations?: TuxMapLinkViolation[];
}

/**
 * Everything behind one lifted wire: counts per kind, the links and their violations.
 * @public
 */
export interface TuxMapWireInspectorDetail {
  from: string;
  to: string;
  totalCount: number;
  perKindCounts: Array<{ kind: string; count: number; label: string }>;
  cutKinds: Array<{ kind: string; count: number; label: string }>;
  links: TuxMapWireInspectorLinkItem[];
  violations: TuxMapLinkViolation[];
}

/**
 * An outside part that `liftLinksToView` rolled up into one in/out card.
 * @public
 */
export interface TuxMapLiftedSide {
  /**
   * The outside part: under `lift: "depth"` (default), lifted to the depth of the cards inside
   * (never above what it shares with the focus); under `lift: "lca"`, lifted to the child of its
   * lowest common ancestor with `focusId` (rolling down one level per entry in `splitIds`: `#118`).
   */
  id: string;
  /** How many fine-grained links it stands for */
  count: number;
  /** How many of them carry a change on (not `stop`): calls, imports, runs before tests and docs */
  spreading: number;
  /** Distinct leaf outside parts rolled up into this card (`lift: "lca"`) */
  parts?: number;
  /** True when clicking this outside card splits it into finer child parts (`lift: "lca"`) */
  splittable?: boolean;
  wires: { kid: string; label: string; violations?: TuxMapLinkViolation[] }[];
}

function sortKindEntries(kinds: Map<string, number>): Array<[string, number]> {
  return [...kinds.entries()].sort((a, b) => b[1] - a[1] || linkStrengthRank(a[0]) - linkStrengthRank(b[0]) || cmpCodepoint(a[0], b[0]));
}

function topKinds(kinds: Map<string, number>): string {
  return sortKindEntries(kinds)
    .slice(0, 2)
    .map(([k]) => k)
    .join(", ");
}

function buildWireInspectorDetail(
  from: string,
  to: string,
  kinds: Map<string, number>,
  linksList: TuxMapLink[],
): TuxMapWireInspectorDetail {
  const sorted = sortKindEntries(kinds);
  const perKindCounts = sorted.map(([kind, count]) => ({
    kind,
    count,
    label: TUX_MAP_LINK_KIND_LABELS[kind] || kind,
  }));
  const cutKinds = perKindCounts.slice(2);
  const violations: TuxMapLinkViolation[] = [];
  const seenViol = new Set<string>();
  const items: TuxMapWireInspectorLinkItem[] = linksList.map((l) => {
    const vList = Array.isArray(l.violations) ? l.violations : undefined;
    if (vList) {
      for (const v of vList) {
        if (!v || typeof v.rule !== "string") continue;
        const vk = `${v.rule}\u0000${v.message ?? ""}\u0000${v.fix ?? ""}`;
        if (!seenViol.has(vk)) {
          seenViol.add(vk);
          violations.push(v);
        }
      }
    }
    return {
      from: l.from,
      to: l.to,
      kind: l.kind || "uses",
      ...(l.at ? { at: l.at } : {}),
      ...(l.sites?.length ? { sites: [...l.sites] } : {}),
      ...(l.stop ? { stop: true } : {}),
      ...(vList?.length ? { violations: vList } : {}),
    };
  });
  const totalCount = perKindCounts.reduce((acc, item) => acc + item.count, 0);
  return {
    from,
    to,
    totalCount,
    perKindCounts,
    cutKinds,
    links: items,
    violations,
  };
}

/**
 * The links lifted onto one view, the children `kidIds` of `focusId`: wires between two children,
 * and the parts outside that children depend on (`outs`) or that depend on them (`ins`), `maxPerSide`
 * of each: those a change travels through (calls, imports, runs) first, then the busiest. An outside
 * part the map does not hold (`isKnown`; by default, anything in `parentOf`) is left out.
 *
 * Pass `lift: "lca"` (`tti/tti-ux#118`) to roll outside parts up to the child of their lowest common
 * ancestor with `focusId` (expanding rolled-up cards listed in `splitIds`), keeping at most 24 outside
 * cards per view while counting every dependent.
 * @public
 */
export function liftLinksToView(
  links: TuxMapLink[],
  focusId: string,
  kidIds: string[],
  parentOf: Map<string, string>,
  opts: {
    quiet?: ReadonlySet<string>;
    maxPerSide?: number;
    isKnown?: (id: string) => boolean;
    lift?: "depth" | "lca";
    splitIds?: ReadonlySet<string> | Iterable<string>;
    categories?: ReadonlySet<TuxMapWireCategory> | Iterable<TuxMapWireCategory>;
  } = {},
): {
  rels: TuxMapLevelRel[];
  ins: TuxMapLiftedSide[];
  outs: TuxMapLiftedSide[];
    moreIns: number;
    moreOuts: number;
    moreInsParts: number;
    moreOutsParts: number;
    moreInsLinks: number;
    moreOutsLinks: number;
    overflowInIds: string[];
    overflowOutIds: string[];
    wireDetails: Record<string, TuxMapWireInspectorDetail>;
  } {
  const quiet = opts.quiet ?? TUX_MAP_QUIET_LINK_KINDS;
  const isKnown = opts.isKnown ?? ((id: string) => parentOf.has(id));
  const liftMode = opts.lift ?? "depth";
  const max = opts.maxPerSide ?? (liftMode === "lca" ? 12 : 8);
  const splitSet: ReadonlySet<string> | null = opts.splitIds
    ? opts.splitIds instanceof Set
      ? opts.splitIds
      : new Set(opts.splitIds)
    : null;
  const catSet: ReadonlySet<TuxMapWireCategory> | null = opts.categories
    ? opts.categories instanceof Set
      ? opts.categories
      : new Set(opts.categories)
    : null;

  const kids = new Set(kidIds);
  const focusAncs = mapAncestorsOf(focusId, parentOf);
  const focusChain = new Set(focusAncs);
  const kidDepth = focusAncs.length + 1;

  const resolveDepth = (id: string): { id: string; splittable: boolean } | null => {
    if (!isKnown(id)) return null;
    const chain = mapAncestorsOf(id, parentOf);
    let pick: string | null = null;
    for (const a of chain) {
      if (focusChain.has(a)) break;
      pick = a;
      if (mapAncestorsOf(a, parentOf).length <= kidDepth) break;
    }
    if (!pick) return null;
    if (liftMode === "lca" && splitSet && splitSet.size > 0 && pick !== id) {
      // Allow splitting further down from `pick` toward `id` when `pick` is in `splitSet`
      const subChain: string[] = [];
      for (const a of chain) {
        subChain.push(a);
        if (a === pick) break;
      }
      subChain.reverse(); // [pick, ..., id]
      let idx = 0;
      while (idx + 1 < subChain.length && splitSet.has(subChain[idx]!)) {
        idx += 1;
      }
      const chosen = subChain[idx]!;
      return { id: chosen, splittable: idx + 1 < subChain.length };
    }
    return { id: pick, splittable: liftMode === "lca" && pick !== id };
  };

  const resolveLcaRaw = (id: string): { id: string; splittable: boolean } | null => {
    if (!isKnown(id)) return null;
    const chain = mapAncestorsOf(id, parentOf); // nearest first: [id, p1, ..., top]
    const outsideChainTopDown: string[] = [];
    for (const a of chain) {
      if (focusChain.has(a)) break;
      outsideChainTopDown.push(a);
    }
    outsideChainTopDown.reverse(); // [childOfLca, ..., id]
    if (outsideChainTopDown.length === 0) return null;
    let idx = 0;
    if (splitSet && splitSet.size > 0) {
      while (idx + 1 < outsideChainTopDown.length && splitSet.has(outsideChainTopDown[idx]!)) {
        idx += 1;
      }
    }
    const picked = outsideChainTopDown[idx]!;
    return { id: picked, splittable: idx + 1 < outsideChainTopDown.length };
  };

  interface PairBucket {
    from: string;
    to: string;
    kinds: Map<string, number>;
    links: TuxMapLink[];
  }

  interface SideBucket {
    byKid: Map<string, { kinds: Map<string, number>; links: TuxMapLink[] }>;
    leafParts: Set<string>;
    allKinds: Map<string, number>;
    allLinks: TuxMapLink[];
    splittable: boolean;
    spreading: number;
  }

  const sib = new Map<string, PairBucket>();
  const insM = new Map<string, SideBucket>();
  const outsM = new Map<string, SideBucket>();

  const recordSide = (
    m: Map<string, SideBucket>,
    o: { id: string; splittable: boolean },
    leafId: string,
    kid: string,
    l: TuxMapLink,
  ) => {
    const kind = l.kind || "uses";
    let bucket = m.get(o.id);
    if (!bucket) {
      bucket = {
        byKid: new Map(),
        leafParts: new Set(),
        allKinds: new Map(),
        allLinks: [],
        splittable: false,
        spreading: 0,
      };
      m.set(o.id, bucket);
    }
    bucket.leafParts.add(leafId);
    if (o.splittable) bucket.splittable = true;
    bucket.allKinds.set(kind, (bucket.allKinds.get(kind) ?? 0) + 1);
    bucket.allLinks.push(l);
    if (!l.stop) bucket.spreading += 1;

    let kidEntry = bucket.byKid.get(kid);
    if (!kidEntry) {
      kidEntry = { kinds: new Map(), links: [] };
      bucket.byKid.set(kid, kidEntry);
    }
    kidEntry.kinds.set(kind, (kidEntry.kinds.get(kind) ?? 0) + 1);
    kidEntry.links.push(l);
  };

  interface PendingSideHit {
    raw: { id: string; splittable: boolean };
    leafId: string;
    kid: string;
    link: TuxMapLink;
  }
  const pendingIns: PendingSideHit[] = [];
  const pendingOuts: PendingSideHit[] = [];

  const adj = getLinkAdjacency(links);
  for (const l of adj.validLinks) {
    const kind = l.kind || "uses";
    if (quiet.has(kind) && !(catSet && catSet.has("docs"))) continue;
    if (catSet && !catSet.has(classifyLinkDependencyCategory(l))) continue;
    const a = liftToSet(l.from, kids, parentOf);
    const b = liftToSet(l.to, kids, parentOf);
    if (a && b) {
      if (a === b) continue;
      const key = `${a}\u0000${b}`;
      let r = sib.get(key);
      if (!r) {
        r = { from: a, to: b, kinds: new Map(), links: [] };
        sib.set(key, r);
      }
      r.kinds.set(kind, (r.kinds.get(kind) ?? 0) + 1);
      r.links.push(l);
    } else if (a) {
      const o = liftMode === "lca" ? resolveLcaRaw(l.to) : resolveDepth(l.to);
      if (o) pendingOuts.push({ raw: o, leafId: l.to, kid: a, link: l });
    } else if (b) {
      const o = liftMode === "lca" ? resolveLcaRaw(l.from) : resolveDepth(l.from);
      if (o) pendingIns.push({ raw: o, leafId: l.from, kid: b, link: l });
    }
  }

  const flushSideHits = (pending: PendingSideHit[], targetMap: Map<string, SideBucket>) => {
    if (pending.length === 0) return;
    if (liftMode !== "lca") {
      for (const h of pending) recordSide(targetMap, h.raw, h.leafId, h.kid, h.link);
      return;
    }
    const leavesByRaw = new Map<string, Set<string>>();
    for (const h of pending) {
      let s = leavesByRaw.get(h.raw.id);
      if (!s) {
        s = new Set();
        leavesByRaw.set(h.raw.id, s);
      }
      s.add(h.leafId);
    }
    for (const h of pending) {
      const leafCount = leavesByRaw.get(h.raw.id)?.size ?? 0;
      const resolved = leafCount === 1 ? resolveDepth(h.leafId) ?? h.raw : h.raw;
      recordSide(targetMap, resolved, h.leafId, h.kid, h.link);
    }
  };

  flushSideHits(pendingIns, insM);
  flushSideHits(pendingOuts, outsM);

  const wireDetails: Record<string, TuxMapWireInspectorDetail> = Object.create(null);
  const rels: TuxMapLevelRel[] = [...sib.values()].map((r) => {
    const detail = buildWireInspectorDetail(r.from, r.to, r.kinds, r.links);
    setOwnProp(wireDetails, `${r.from}\u0000${r.to}`, detail);
    return {
      from: r.from,
      to: r.to,
      label: topKinds(r.kinds),
      ...(detail.violations.length > 0 ? { violations: detail.violations } : {}),
    };
  });

  const buildSides = (which: "ins" | "outs", m: Map<string, SideBucket>): TuxMapLiftedSide[] =>
    [...m.entries()]
      .map(([id, bucket]) => {
        const frameFrom = which === "ins" ? id : "@bound";
        const frameTo = which === "ins" ? "@bound" : id;
        const frameDetail = buildWireInspectorDetail(frameFrom, frameTo, bucket.allKinds, bucket.allLinks);
        setOwnProp(wireDetails, `${frameFrom}\u0000${frameTo}`, frameDetail);

        const wires = [...bucket.byKid.entries()].map(([kid, ke]) => {
          const wFrom = which === "ins" ? id : kid;
          const wTo = which === "ins" ? kid : id;
          const wDetail = buildWireInspectorDetail(wFrom, wTo, ke.kinds, ke.links);
          setOwnProp(wireDetails, `${wFrom}\u0000${wTo}`, wDetail);
          return {
            kid,
            label: topKinds(ke.kinds),
            ...(wDetail.violations.length > 0 ? { violations: wDetail.violations } : {}),
          };
        });

        const base: TuxMapLiftedSide = {
          id,
          count: frameDetail.totalCount,
          spreading: bucket.spreading,
          wires,
        };
        if (liftMode === "lca") {
          base.parts = bucket.leafParts.size;
          base.splittable = bucket.splittable;
        }
        return base;
      })
      .sort(
        (x, y) =>
          Number(y.spreading > 0) - Number(x.spreading > 0) ||
          y.count - x.count ||
          x.id.localeCompare(y.id),
      );

  const insAll = buildSides("ins", insM);
  const outsAll = buildSides("outs", outsM);
  const insOverflow = insAll.slice(max);
  const outsOverflow = outsAll.slice(max);

  return {
    rels,
    ins: insAll.slice(0, max),
    outs: outsAll.slice(0, max),
    moreIns: insOverflow.length,
    moreOuts: outsOverflow.length,
    moreInsParts: insOverflow.reduce((acc, s) => acc + (s.parts ?? 1), 0),
    moreOutsParts: outsOverflow.reduce((acc, s) => acc + (s.parts ?? 1), 0),
    moreInsLinks: insOverflow.reduce((acc, s) => acc + s.count, 0),
    moreOutsLinks: outsOverflow.reduce((acc, s) => acc + s.count, 0),
    overflowInIds: insOverflow.map((s) => s.id),
    overflowOutIds: outsOverflow.map((s) => s.id),
    wireDetails,
  };
}

/**
 * Memoized `O(|E_copies|)` cycle-safe canonical resolver for `copies` links (`tti/tti-ux#121`).
 * @internal
 */
export function buildVendoredCopyIndex(
  links: readonly TuxMapLink[],
  elKindById?: ReadonlyMap<string, string>,
): {
  copyToCanonical: Map<string, string>;
  copiesByCanonical: Map<string, string[]>;
} {
  const NON_FOLDABLE_KINDS = new Set(["route", "person", "system", "database", "external"]);
  const safeLinks = asObjArray<TuxMapLink>(links);
  const nonCopyPairs = new Set<string>();
  for (const l of safeLinks) {
    if (!l.from || !l.to || l.from === l.to) continue;
    const k = l.kind || "uses";
    if (k !== "copies" && k !== "provenance" && k !== "stamps") {
      nonCopyPairs.add(`${l.from}\u0000${l.to}`);
    }
  }
  const isNonFoldableEndpoint = (id: string): boolean => {
    if (isKindNodeId(id, "r")) return true;
    const ek = elKindById?.get(id);
    return Boolean(ek && NON_FOLDABLE_KINDS.has(ek));
  };
  const copyToSource = new Map<string, string>();
  for (const l of safeLinks) {
    if (l.kind === "copies" && l.from && l.to && l.from !== l.to) {
      if (isNonFoldableEndpoint(l.from) || isNonFoldableEndpoint(l.to)) continue;
      if (nonCopyPairs.has(`${l.from}\u0000${l.to}`)) continue;
      if (!copyToSource.has(l.from)) copyToSource.set(l.from, l.to);
    }
  }
  const copyToCanonical = new Map<string, string>();
  const copiesByCanonical = new Map<string, string[]>();
  if (copyToSource.size === 0) {
    return { copyToCanonical, copiesByCanonical };
  }

  const memo = new Map<string, string>();
  const resolveCanonical = (startId: string): string => {
    const hit = memo.get(startId);
    if (hit !== undefined) return hit;
    const trail: string[] = [startId];
    const pos = new Map<string, number>([[startId, 0]]);
    let cur = startId;
    while (copyToSource.has(cur) && trail.length <= MAX_TREE_DEPTH) {
      const nxt = copyToSource.get(cur)!;
      if (memo.has(nxt)) {
        cur = memo.get(nxt)!;
        break;
      }
      const cycIdx = pos.get(nxt);
      if (cycIdx !== undefined) {
        // Cycle in `copies`: pick the lexicographically smallest ID on the cycle so all members fold to one deterministic representative
        const cycleMembers = trail.slice(cycIdx);
        cycleMembers.sort(cmpCodepoint);
        cur = cycleMembers[0]!;
        break;
      }
      pos.set(nxt, trail.length);
      trail.push(nxt);
      cur = nxt;
    }
    for (const tid of trail) memo.set(tid, cur);
    return cur;
  };

  for (const cid of copyToSource.keys()) {
    const canon = resolveCanonical(cid);
    if (canon === cid) continue;
    copyToCanonical.set(cid, canon);
    let bucket = copiesByCanonical.get(canon);
    if (!bucket) {
      bucket = [];
      copiesByCanonical.set(canon, bucket);
    }
    bucket.push(cid);
  }
  for (const arr of copiesByCanonical.values()) arr.sort(cmpCodepoint);
  return { copyToCanonical, copiesByCanonical };
}

/**
 * Folds vendored copy cards (`from` of a `kind === "copies"` link) into their canonical source card (`to`)
 * when in view — or folds sibling copies of the same external source into a single card — attaching
 * `vendoredCopies` / `isVendoredCopy` / `vendoredFrom` metadata and deduplicating `rels` & `links` (`tti/tti-ux#121`).
 * @public
 */
export function foldVendoredCopies(
  elements: readonly TuxMapLevelElement[],
  rels: readonly TuxMapLevelRel[],
  links: readonly TuxMapLink[],
): {
  elements: TuxMapLevelElement[];
  rels: TuxMapLevelRel[];
  links: TuxMapLink[];
  foldedToRepresentative: Map<string, string>;
} {
  if (elements.length === 0) {
    return {
      elements: [],
      rels: [...rels],
      links: [...links],
      foldedToRepresentative: new Map(),
    };
  }
  const elKindById = new Map<string, string>();
  for (const e of asObjArray<TuxMapLevelElement>(elements)) {
    if (e.id && e.kind) elKindById.set(e.id, e.kind);
  }
  const { copyToCanonical } = buildVendoredCopyIndex(links, elKindById);
  if (copyToCanonical.size === 0) {
    return {
      elements: [...elements],
      rels: [...rels],
      links: [...links],
      foldedToRepresentative: new Map(),
    };
  }

  const viewIds = new Set<string>();
  const inViewCopiesByCanon = new Map<string, string[]>();
  for (const e of elements) {
    viewIds.add(e.id);
    const canon = copyToCanonical.get(e.id);
    if (canon && canon !== e.id) {
      let arr = inViewCopiesByCanon.get(canon);
      if (!arr) {
        arr = [];
        inViewCopiesByCanon.set(canon, arr);
      }
      arr.push(e.id);
    }
  }

  if (inViewCopiesByCanon.size === 0) {
    return {
      elements: [...elements],
      rels: [...rels],
      links: [...links],
      foldedToRepresentative: new Map(),
    };
  }

  const repByCanon = new Map<string, string>();
  const foldedCopiesByRep = new Map<string, string[]>();
  const externalCanonByRep = new Map<string, string>();
  const foldedToRepresentative = new Map<string, string>();

  for (const [canon, inViewCopies] of inViewCopiesByCanon.entries()) {
    if (viewIds.has(canon)) {
      repByCanon.set(canon, canon);
      foldedCopiesByRep.set(canon, inViewCopies);
      for (const cid of inViewCopies) {
        foldedToRepresentative.set(cid, canon);
      }
    } else {
      const rep = inViewCopies[0]!;
      repByCanon.set(canon, rep);
      externalCanonByRep.set(rep, canon);
      const siblingFolded = inViewCopies.slice(1);
      foldedCopiesByRep.set(rep, siblingFolded);
      for (const cid of siblingFolded) {
        foldedToRepresentative.set(cid, rep);
      }
    }
  }

  const outElements: TuxMapLevelElement[] = [];
  for (const e of elements) {
    if (foldedToRepresentative.has(e.id)) continue;
    const extCanon = externalCanonByRep.get(e.id);
    const copies = foldedCopiesByRep.get(e.id);
    if (extCanon) {
      outElements.push({
        ...e,
        isVendoredCopy: true,
        vendoredFrom: extCanon,
        ...(copies && copies.length > 0 ? { vendoredCopies: copies } : {}),
      });
    } else if (copies && copies.length > 0) {
      outElements.push({
        ...e,
        isVendoredCopy: true,
        vendoredCopies: copies,
      });
    } else {
      outElements.push(e);
    }
  }

  const remapId = (id: string): string => foldedToRepresentative.get(id) ?? id;

  const seenRelPairs = new Set<string>();
  const outRels: TuxMapLevelRel[] = [];
  for (const r of rels) {
    const from = remapId(r.from);
    const to = remapId(r.to);
    if (from === to) continue;
    const key = `${from}\u0000${to}`;
    if (seenRelPairs.has(key)) continue;
    seenRelPairs.add(key);
    outRels.push(from === r.from && to === r.to ? r : { ...r, from, to });
  }

  const seenLinks = new Set<string>();
  const outLinks: TuxMapLink[] = [];
  for (const l of links) {
    if (l.kind === "copies" && (foldedToRepresentative.has(l.from) || foldedCopiesByRep.has(l.to))) {
      const rf = remapId(l.from);
      const rt = remapId(l.to);
      if (rf === rt) continue;
    }
    const from = remapId(l.from);
    const to = remapId(l.to);
    if (from === to) continue;
    const key = `${from}\u0000${to}\u0000${l.kind || "uses"}`;
    if (seenLinks.has(key)) continue;
    seenLinks.add(key);
    outLinks.push(from === l.from && to === l.to ? l : { ...l, from, to });
  }

  return {
    elements: outElements,
    rels: outRels,
    links: outLinks,
    foldedToRepresentative,
  };
}

/**
 * One step of a `TuxMapTraceResult`.
 * @public
 */
export interface TuxMapTraceHop {
  from: string;
  to: string;
  kind: string;
  label: string;
  at?: string;
}

/**
 * Result of `traceSpreadingPath`.
 * @public
 */
export interface TuxMapTraceResult {
  found: boolean;
  nodeIds: string[];
  hops: TuxMapTraceHop[];
}

/**
 * Directed shortest walk over spreading dependency kinds (`!l.stop`, non-quiet) from `fromId` to `toId`
 * (or any descendant of `fromId` to any descendant of `toId`), powering `"Trace to…"` and `"Why?"` (`tti/tti-ux#125`).
 * @public
 */
export function traceSpreadingPath(
  fromId: string,
  toId: string,
  model: TuxMapLevelModel,
  opts: { allowStoppingLastHop?: boolean } = {},
): TuxMapTraceResult {
  if (!fromId || !toId) return { found: false, nodeIds: [], hops: [] };
  if (fromId === toId) return { found: true, nodeIds: [fromId], hops: [] };

  const parentOf = buildMapParentIndex(model);
  const { kidsOf } = getParentTables(parentOf);
  const links = extractModelLinks(model);
  const { outByFrom } = getLinkAdjacency(links);

  const expandSubtree = (root: string): Set<string> => {
    const set = new Set<string>([root]);
    const q = [root];
    for (let i = 0; i < q.length && set.size < 4096; i++) {
      for (const ch of kidsOf.get(q[i]!) ?? []) {
        if (!set.has(ch)) {
          set.add(ch);
          q.push(ch);
        }
      }
    }
    return set;
  };

  const startSet = expandSubtree(fromId);
  const targetSet = expandSubtree(toId);
  const allowStopFirst = opts.allowStoppingLastHop ?? false;

  const runSearch = (permitInitialStop: boolean): TuxMapTraceResult | null => {
    const visited = new Set<string>(startSet);
    const prev = new Map<string, { prevId: string; link: TuxMapLink }>();
    const queue: Array<{ id: string; depth: number }> = [...startSet].sort(cmpCodepoint).map((id) => ({ id, depth: 0 }));

    let hitTarget: string | null = null;
    for (let qi = 0; qi < queue.length; qi++) {
      const { id: cur, depth } = queue[qi]!;
      const outLinks = [...(outByFrom.get(cur) ?? [])].sort((a, b) => {
        const as = a.stop ? 1 : 0;
        const bs = b.stop ? 1 : 0;
        if (as !== bs) return as - bs;
        return compareBlastLinks(a, b);
      });
      for (const l of outLinks) {
        const k = l.kind || "uses";
        if (TUX_MAP_QUIET_LINK_KINDS.has(k)) continue;
        // Pure spreading search (`permitInitialStop === false`) requires `!l.stop` on every hop.
        // Fallback search (`permitInitialStop === true`, for "Why does Test/Bundle A depend on B?")
        // permits a stopping link only on step 0 (`depth === 0`) while requiring `!l.stop` thereafter.
        if (l.stop && !(permitInitialStop && depth === 0)) continue;
        const nxt = l.to;
        if (visited.has(nxt)) continue;
        visited.add(nxt);
        prev.set(nxt, { prevId: cur, link: l });
        if (targetSet.has(nxt)) {
          hitTarget = nxt;
          break;
        }
        queue.push({ id: nxt, depth: depth + 1 });
      }
      if (hitTarget) break;
    }

    if (!hitTarget) return null;

    const nodeIds: string[] = [hitTarget];
    const hops: TuxMapTraceHop[] = [];
    let cursor = hitTarget;
    while (prev.has(cursor)) {
      const step = prev.get(cursor)!;
      const kind = step.link.kind || "uses";
      hops.unshift({
        from: step.prevId,
        to: cursor,
        kind,
        label: TUX_MAP_LINK_KIND_LABELS[kind] || step.link.label || kind,
        ...(step.link.at ? { at: step.link.at } : {}),
      });
      nodeIds.unshift(step.prevId);
      cursor = step.prevId;
    }
    if (nodeIds[0] !== fromId && startSet.has(nodeIds[0]!)) {
      nodeIds.unshift(fromId);
    }
    if (nodeIds[nodeIds.length - 1] !== toId && targetSet.has(nodeIds[nodeIds.length - 1]!)) {
      nodeIds.push(toId);
    }
    return { found: true, nodeIds, hops };
  };

  return runSearch(false) ?? (allowStopFirst ? runSearch(true) : null) ?? { found: false, nodeIds: [], hops: [] };
}

/**
 * How `computeLinkBlastRadius` reached one element.
 * @public
 */
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

/**
 * Options of `computeLinkBlastRadius`.
 * @public
 */
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

/**
 * Result of `computeLinkBlastRadius`.
 * @public
 */
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
  const { repo, kind, rest } = splitNodeId(id);
  if (!kind) return "";
  if (kind === "f" || kind === "p") {
    if (kind === "p" && rest.startsWith("pkg:")) return "";
    return rest;
  }
  if (kind === "s") {
    if (rest.startsWith("pkg:")) return "";
    const hashIdx = rest.lastIndexOf("#");
    return hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
  }
  if (kind === "d") {
    if (repo) {
      const p = rest.split("@", 1)[0] ?? "";
      if (p === "(root)" || p === "(routes)" || p === "x-registries" || p.startsWith("x-registries/")) {
        return "";
      }
      return p;
    }
    const colonIdx = rest.indexOf(":");
    const p = colonIdx >= 0 ? rest.slice(colonIdx + 1) : rest;
    if (p === "(root)" || p === "(routes)" || rest.startsWith("x-registries:")) {
      return "";
    }
    return p;
  }
  return "";
}

function isPureDocNode(id: string, meta?: BlastNodeMeta): boolean {
  if (isKindNodeId(id, "s") || meta?.kind === "symbol" || meta?.kind === "function" || meta?.kind === "class") {
    return false;
  }
  if (meta?.tech === "Markdown") return true;
  const p = repoPathForNodeId(id, meta).toLowerCase();
  return p.endsWith(".md") || p.endsWith(".mdx") || p.endsWith(".txt") || p.endsWith(".rst");
}

const TEST_ONLY_PATH_RE =
  /(?:^|\/)(?:tests?|__tests__)\/|(?:^|\/)test_[^/]*$|\.(?:test|spec)\.[^/]+$/i;

const AUX_NON_PROD_PATH_RE =
  /(?:^|\/)(?:tests?|__tests__|ci)\/|(?:^|\/)test_[^/]*$|\.(?:test|spec)\.[^/]+$|^(?:runner-smoke\/)?\.(?:forgejo|github)\/workflows\//i;

const LOCKFILE_DELTA_RE =
  /(?:^|\/)(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock|uv\.lock|Cargo\.lock|renv\.lock|packages\.lock\.json|actions\.lock)$|\.(?:lock|sum)$/;

function isAuxNonProdSeed(id: string, meta?: BlastNodeMeta): boolean {
  const p = repoPathForNodeId(id, meta);
  if (!p && !isKindNodeId(id, ["f", "s"])) return false;
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
 * @public
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

  const { kidsOf } = getParentTables(parentOf);

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

  const { into, outByFrom } = getLinkAdjacency(links);

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
    if (seeds.has(y) || isKindNodeId(y, "d")) return false;
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

/**
 * How an element changed between two models.
 * @public
 */
export type TuxMapElementChangeKind =
  | "added"
  | "deleted"
  | "moved"
  | "sig-changed"
  | "body-patched";

/**
 * One changed element in a `TuxMapGraphDelta`.
 * @public
 */
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

/**
 * One added, removed or dangling link in a `TuxMapGraphDelta`.
 * @public
 */
export interface TuxMapWireDelta {
  from: string;
  to: string;
  kind: string;
  change: "added" | "removed" | "dangling";
  at?: string;
}

/**
 * Options of `computeGraphDelta`.
 * @public
 */
export interface TuxMapGraphDeltaOptions {
  /** Whether to allocate and annotate `mergedModel` (default `true`; pass `false` for lean CLI/MCP payloads). */
  includeMergedModel?: boolean;
}

/**
 * Result of `computeGraphDelta`: what changed between a base model and a head model.
 * @public
 */
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
  while (p && isKindNodeId(p, "d")) {
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
    if (!id || isKindNodeId(id, "d") || elements.has(id)) return;
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
 * @public
 */
export function computeGraphDelta(
  baseModel: TuxMapLevelModel,
  headModel: TuxMapLevelModel,
  opts: TuxMapGraphDeltaOptions = {},
): TuxMapGraphDelta {
  const includeMergedModel = opts.includeMergedModel ?? true;
  const bothCodeOrNeither =
    resolveModelRawLinks(baseModel).length > 0 || resolveModelRawLinks(headModel).length > 0;
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

  const isSupplyChainDeltaId = (nid: string): boolean => {
    if (!nid) return false;
    if (nid.startsWith("p:pkg:") || nid.startsWith("s:pkg:") || nid.includes(":s:pkg:") || nid.includes(":p:pkg:")) {
      return true;
    }
    if (
      nid === "x-registries" ||
      nid === "e-registries" ||
      nid.endsWith(":x-registries") ||
      nid.endsWith(":d:x-registries") ||
      nid.includes(":d:x-registries/")
    ) {
      return true;
    }
    const bMeta = baseIdx.elements.get(nid);
    const hMeta = headIdx.elements.get(nid);
    const rp =
      hMeta?.source?.path ||
      bMeta?.source?.path ||
      repoPathForNodeId(nid);
    return Boolean(rp && LOCKFILE_DELTA_RE.test(rp));
  };

  const codeDeleted = deletedIds.filter((id) => !isSupplyChainDeltaId(id));
  const codeStructural = [...movedIds, ...sigChangedIds, ...addedIds].filter(
    (id) => !isSupplyChainDeltaId(id),
  );
  const hasSupplyChainChange =
    nodeChanges.some((c) => isSupplyChainDeltaId(c.id)) ||
    [...addedWires, ...removedWires].some(
      (w) => isSupplyChainDeltaId(w.to) || isSupplyChainDeltaId(w.from),
    );

  const recommendedIntent: TuxMapBlastIntent =
    codeDeleted.length > 0
      ? "cut"
      : codeStructural.length > 0
        ? "refactor"
        : hasSupplyChainChange
          ? "supply-chain"
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
    const isPidFolder = isKindNodeId(pid, "d");
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
    } else if (isPidFolder && logPid && hasOwn(mergedSubgraphs, logPid)) {
      mergedSubgraphs[logPid]!.elements.push(ghost);
    } else if (
      isPidFolder &&
      logPid &&
      headIdx.validTargetIds.has(logPid) &&
      !headIdx.inlineParentIds.has(logPid) &&
      logPid !== headModel?.level2?.boundary
    ) {
      setOwnProp(mergedSubgraphs, logPid, { elements: [ghost] });
    } else if (
      !isPidFolder &&
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

/**
 * A node of the unified graph: one element of any level, flattened.
 * @public
 */
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

/**
 * An edge of the unified graph.
 * @public
 */
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

/**
 * A subgraph lease returned by the deprecated `coordinateAcpSubgraphLease`.
 * @public
 */
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
 * Memoized per-model lookup tables behind the query functions.
 * @internal
 */
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
 * @public
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
    const linkTiersRaw = isPlainRecord(raw.linkTiers)
      ? raw.linkTiers
      : isPlainRecord(code?.linkTiers)
        ? code.linkTiers
        : undefined;
    const stopKindsRaw = Array.isArray(raw.stopKinds)
      ? raw.stopKinds
      : isPlainRecord(code) && Array.isArray(code.stopKinds)
        ? code.stopKinds
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
      ...(linkTiersRaw
        ? {
            linkTiers: {
              ...(Array.isArray(linkTiersRaw.spread)
                ? { spread: asObjArray<TuxMapLink>(linkTiersRaw.spread) }
                : {}),
              ...(Array.isArray(linkTiersRaw.stop)
                ? { stop: asObjArray<TuxMapLink>(linkTiersRaw.stop) }
                : {}),
            },
          }
        : {}),
      ...(stopKindsRaw
        ? { stopKinds: stopKindsRaw.filter((k): k is string => typeof k === "string" && Boolean(k)) }
        : {}),
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
      ...(isPlainRecord(raw.linkTiers)
        ? {
            linkTiers: {
              ...(Array.isArray(raw.linkTiers.spread)
                ? { spread: asObjArray<TuxMapLink>(raw.linkTiers.spread) }
                : {}),
              ...(Array.isArray(raw.linkTiers.stop)
                ? { stop: asObjArray<TuxMapLink>(raw.linkTiers.stop) }
                : {}),
            },
          }
        : {}),
      ...(Array.isArray(raw.stopKinds)
        ? { stopKinds: raw.stopKinds.filter((k): k is string => typeof k === "string" && Boolean(k)) }
        : {}),
      ...(Array.isArray(raw.routes) ? { routes: asObjArray<TuxMapRouteEntry>(raw.routes) } : {}),
    };
  } else {
    normalized = raw as unknown as TuxMapLevelModel;
  }
  normalized = sanitizeMapModel(normalized).model;

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
  const codeLinks = resolveModelRawLinks(model);
  feedStr(`#CL:${codeLinks.length}`);
  for (const l of codeLinks) {
    feedStr(typeof l.from === "string" ? l.from : "");
    feedStr(typeof l.to === "string" ? l.to : "");
    feedStr(typeof l.kind === "string" ? l.kind : "");
    feedStr(typeof l.at === "string" ? l.at : "");
    feedStr(l.stop ? "1" : "0");
    feedStr(typeof l.coupling === "string" ? l.coupling : "");
    feedStr(typeof l.phase === "string" ? l.phase : "");
    if (Array.isArray(l.violations)) {
      feedStr(String(l.violations.length));
      for (const v of l.violations) {
        feedStr(typeof v?.rule === "string" ? v.rule : "");
      }
    } else {
      feedStr("0");
    }
  }
  if (Array.isArray(model?.stopKinds)) {
    feedStr(`#SK:${model.stopKinds.length}`);
    for (const sk of model.stopKinds) {
      if (typeof sk === "string") feedStr(sk);
    }
  }
  if (isPlainRecord(model?.aliases)) {
    const ak = Object.keys(model.aliases);
    feedStr(`#AL:${ak.length}`);
    for (const k of ak) {
      feedStr(k);
      feedStr(typeof model.aliases[k] === "string" ? model.aliases[k] : "");
    }
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

/**
 * Minimal zero-sample fallback model (`tti/tti-ux#114`).
 * @public
 */
export const EMPTY_TTI_LEVEL_MODEL: TuxMapLevelModel = {
  level1: { title: "System Context", elements: [], rels: [] },
  level2: { title: "Containers", boundary: "", elements: [], rels: [] },
  level3: {},
  level4: { title: "Deployment", groups: [], nodes: [], links: [] },
};

/**
 * Memoized `O(V + E)` query index per `TuxMapLevelModel` instance so repeated
 * layer, blast-radius, shortest-path, and lease queries do not rebuild graph tables.
 * @internal
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
  const subgraphChildLevelByOwner = new Map<string, number>();
  const seenSgRelPairs = new Set<string>();
  if (isPlainRecord(model?.subgraphs)) {
    for (const [rawParentId, sg] of Object.entries(model.subgraphs)) {
      if (!isPlainRecord(sg)) continue;
      const parentId = subgraphOwners.get(rawParentId) ?? rawParentId;
      const rawLvl = levelForFocus(parentId, model, parentOf);
      const childLevel = isLevel3Focus(parentId, model) ? 5 : rawLvl;
      subgraphChildLevelByOwner.set(parentId, childLevel);
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
        seenSgRelPairs.add(`${parentId}\u0000${r.from}\u0000${r.to}`);
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
  const validCodeLinks = resolveModelRawLinks(model).filter(
    (l) => typeof l.from === "string" && Boolean(l.from) && typeof l.to === "string" && Boolean(l.to),
  );
  const nonProseCodeLinks: TuxMapLink[] = [];
  const seenLinkIds = new Map<string, number>();
  validCodeLinks.forEach((l) => {
    if (!nodes.has(l.from) || !nodes.has(l.to)) return;
    const lnkEdge: TuxMapGraphEdgeRecord = {
      id: deriveLinkId(l, seenLinkIds),
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

  // Lift `model.links` across lowest common subgraph ancestors when `sg.rels` are omitted (`tti/tti-ux#126`)
  // so `findArchitecturePath` shortest paths are unchanged whether generated `sg.rels` are serialized or stripped.
  if (subgraphChildLevelByOwner.size > 0 && nonProseCodeLinks.length > 0) {
    const liftedByOwner = new Map<string, Map<string, { from: string; to: string; kinds: Map<string, number> }>>();
    for (const l of nonProseCodeLinks) {
      const up = mapAncestorsOf(l.from, parentOf);
      const upSet = new Set(up);
      let b: string | undefined;
      let x: string | undefined = l.to;
      const seenTo = new Set<string>();
      while (x && !upSet.has(x) && !seenTo.has(x)) {
        seenTo.add(x);
        b = x;
        x = parentOf.get(x);
      }
      if (b && x && x !== l.from && subgraphChildLevelByOwner.has(x)) {
        const xIdx = up.indexOf(x);
        if (xIdx > 0) {
          const a = up[xIdx - 1]!;
          if (a !== b && !seenSgRelPairs.has(`${x}\u0000${a}\u0000${b}`)) {
            let ownerPairs = liftedByOwner.get(x);
            if (!ownerPairs) {
              ownerPairs = new Map();
              liftedByOwner.set(x, ownerPairs);
            }
            const pairKey = `${a}\u0000${b}`;
            let rec = ownerPairs.get(pairKey);
            if (!rec) {
              rec = { from: a, to: b, kinds: new Map() };
              ownerPairs.set(pairKey, rec);
            }
            const k = l.kind || "uses";
            rec.kinds.set(k, (rec.kinds.get(k) ?? 0) + 1);
          }
        }
      }
    }
    for (const [ownerId, ownerPairs] of liftedByOwner) {
      const childLevel = subgraphChildLevelByOwner.get(ownerId)!;
      let relIdx = 0;
      for (const rec of ownerPairs.values()) {
        const sgEdge: TuxMapGraphEdgeRecord = {
          id: `lsg-${ownerId}-lca-${relIdx++}-${rec.from}-${rec.to}`,
          from: rec.from,
          to: rec.to,
          label: topKinds(rec.kinds),
          level: childLevel,
          kind: "rel",
        };
        edges.push(sgEdge);
        depEdges.push(sgEdge);
      }
    }
  }

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
 * @public
 */
export function buildUnifiedArchitectureGraph(model: TuxMapLevelModel = EMPTY_TTI_LEVEL_MODEL): {
  nodes: Map<string, TuxMapGraphNodeRecord>;
  edges: TuxMapGraphEdgeRecord[];
} {
  const { nodes, edges } = getMapQueryIndex(model);
  return { nodes, edges };
}

/**
 * Returned by a query when an id is not in the model, with close matches.
 * @public
 */
export interface TuxMapUnknownNodeError {
  error: string;
  unknownIds: string[];
  suggestions: string[];
}

/**
 * A `TuxMapGraphNodeRecord` trimmed for small payloads.
 * @public
 */
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

/**
 * Options of `queryArchitectureNodes`.
 * @public
 */
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

/**
 * A step `queryArchitectureImpact` took through a parent because the seed had no code links of its own.
 * @public
 */
export interface TuxMapCoarseParentStep {
  seedId: string;
  parentId: string;
  reason: string;
}

/**
 * One element in a `TuxMapImpactQueryResult`.
 * @public
 */
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

/**
 * Options of `queryArchitectureImpact`.
 * @public
 */
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

/**
 * Result of `queryArchitectureImpact`.
 * @public
 */
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

/**
 * Options of `findArchitecturePath`.
 * @public
 */
export interface TuxMapPathQueryOptions {
  /** `"downstream"` (default) follows `from -> to` dependencies; `"upstream"` reverses dependency direction (`to -> from`). */
  direction?: "downstream" | "upstream";
  includePlanned?: boolean;
  compact?: boolean;
}

/**
 * Result of `findArchitecturePath`.
 * @public
 */
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
 * @internal
 */
export function suggestCloseNodeIds(
  unknownId: string,
  nodes: ReadonlyMap<string, TuxMapGraphNodeRecord>,
  maxSuggestions = 10,
): string[] {
  const rawMax = Number.isFinite(maxSuggestions) ? maxSuggestions : 10;
  const cap = Math.min(10, Math.max(0, Math.floor(rawMax)));
  if (cap === 0) return [];
  const rawTrimmed = String(unknownId ?? "").trim();
  const q = rawTrimmed.toLowerCase();
  const qStripped = stripNodeKindPrefix(rawTrimmed).toLowerCase();
  const tokens = qStripped.split(/[/:.#_-]+/).filter((t) => t.length >= 2);
  if (!q) return [];

  const scored: Array<{ id: string; score: number }> = [];
  for (const n of nodes.values()) {
    const idLower = n.id.toLowerCase();
    const idStripped = stripNodeKindPrefix(n.id).toLowerCase();
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
 * @public
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
 * @public
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
  const hasCodeLinks = resolveModelRawLinks(model).length > 0;
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
 * @public
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
 * @public
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
 * @public
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
 * @public
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
 * @public
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

/**
 * Result groups of the Go-To search, in display order.
 * @public
 */
export const TUX_MAP_SEARCH_GROUPS = [
  "Components",
  "Folders",
  "Files",
  "Functions",
  "Routes",
] as const;

/**
 * A result group of the Go-To search.
 * @public
 */
export type TuxMapSearchGroup = (typeof TUX_MAP_SEARCH_GROUPS)[number];

/**
 * One searchable element in the index `buildMapSearchIndex` builds.
 * @public
 */
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

/**
 * A search entry and its score.
 * @public
 */
export interface TuxMapSearchHit {
  entry: TuxMapSearchEntry;
  score: number;
}

/**
 * The hits of one search group.
 * @public
 */
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
  if (kind === "route" || isKindNodeId(id, "r")) return "Routes";
  if (kind === "symbol" || kind === "function" || kind === "class" || kind === "constant" || isKindNodeId(id, "s")) {
    return "Functions";
  }
  if (
    kind === "folder" ||
    isKindNodeId(id, "d") ||
    (kind === "module" && !hasSourcePath && (name.endsWith("/") || /\bfolder\b/i.test(tech || "")))
  ) {
    return "Folders";
  }
  if (kind === "file" || isKindNodeId(id, "f") || kind === "module" || kind === "schema") return "Files";
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
 * @public
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
  for (const l of resolveModelRawLinks(model)) {
    if (l.kind === "handled-by" && l.from && l.to && nodes.has(l.to)) {
      if (!handlerByRouteId.has(l.from)) handlerByRouteId.set(l.from, l.to);
    } else if (
      l.kind === "routes" &&
      l.from &&
      l.to &&
      (isKindNodeId(l.from, "r") || nodes.get(l.from)?.kind === "route") &&
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
    const srcPath = n.source?.path || repoPathForNodeId(n.id);
    const group = classifySearchGroup(n.id, n.kind, n.name, n.tech, Boolean(n.source?.path));
    const ancestors = buildAncestors(n.id);
    const linkedHandlerId = group === "Routes" ? handlerByRouteId.get(n.id) : undefined;
    const handlerNode = linkedHandlerId ? nodes.get(linkedHandlerId) : undefined;
    const routePattern =
      group === "Routes" ? (isKindNodeId(n.id, "r") ? splitNodeId(n.id).rest : n.name) : undefined;
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
 * @public
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


