// AUTO-GENERATED from app/utils/tuxArchitectureMap.ts by scripts/build-map-runtime.mjs — DO NOT EDIT.
// SPDX-License-Identifier: Apache-2.0 (adapts MIT geometry/graph routines; see app/utils/tuxArchitectureMap.ts)
// SOURCE-SHA256: a74687af6b2d804279ac14448cb4832402d8522b134566e7151c132ffd0e008d
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
    spec: string;
    /** What the resource does; the deployment card says it when `spec` is empty */
    role?: string;
    status?: TuxMapStatus;
    host?: string;
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
    position?: {
        x: number;
        y: number;
    };
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
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
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
export declare const LOD_THRESHOLDS: {
    readonly resources: 0.65;
    readonly packages: 1.25;
};
export declare function resolveSemanticLoD(zoom: number, override?: "auto" | TuxMapLoDLevel): TuxMapLoDLevel;
/**
 * Returns the intrinsic world-space dimensions of a node card for a given LoD
 * so edge handles, zone bounding boxes, and minimap stay exact across zoom tiers.
 */
export declare function getNodeDimensionsForLoD(node: TuxMapNode, lod: TuxMapLoDLevel): {
    width: number;
    height: number;
};
export declare function screenToWorld(screenX: number, screenY: number, viewport: TuxMapViewport): {
    x: number;
    y: number;
};
export declare function worldToScreen(worldX: number, worldY: number, viewport: TuxMapViewport): {
    x: number;
    y: number;
};
/**
 * Zooms the viewport around a specific screen focal point (e.g. cursor position)
 * so the world point under the cursor stays stationary during wheel/pinch zoom.
 */
export declare function zoomAroundScreenPoint(viewport: TuxMapViewport, nextZoom: number, focalScreenX: number, focalScreenY: number, minZoom?: number, maxZoom?: number): TuxMapViewport;
/**
 * Computes the bounding rectangle enclosing all given rectangles.
 */
export declare function getBoundsOfRects(rects: TuxMapRect[]): TuxMapRect;
/**
 * Computes the ideal viewport `(x, y, zoom)` to fit a world bounding box
 * inside a container of `(containerWidth, containerHeight)` with padding.
 */
export declare function getViewportForBounds(bounds: TuxMapRect, containerWidth: number, containerHeight: number, minZoom?: number, maxZoom?: number, padding?: number): TuxMapViewport;
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
export declare function getSmoothStepEdgePath(params: {
    sourceX: number;
    sourceY: number;
    sourcePosition?: TuxMapHandlePosition;
    targetX: number;
    targetY: number;
    targetPosition?: TuxMapHandlePosition;
    borderRadius?: number;
    offset?: number;
}): SmoothStepEdgeResult;
/**
 * Generates a cubic Bezier SVG path between two handles.
 */
export declare function getBezierEdgePath(params: {
    sourceX: number;
    sourceY: number;
    sourcePosition?: TuxMapHandlePosition;
    targetX: number;
    targetY: number;
    targetPosition?: TuxMapHandlePosition;
    curvature?: number;
}): SmoothStepEdgeResult;
/**
 * Generates a direct straight SVG path between two handles.
 */
export declare function getStraightEdgePath(params: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}): SmoothStepEdgeResult;
/**
 * Automatically selects the best handle pair (`right` -> `left` or `bottom` -> `top`)
 * between two node rectangles and returns the anchor coordinates.
 */
export declare function resolveOptimalEdgeAnchors(sourceRect: TuxMapRect, targetRect: TuxMapRect): {
    sourceX: number;
    sourceY: number;
    sourcePosition: TuxMapHandlePosition;
    targetX: number;
    targetY: number;
    targetPosition: TuxMapHandlePosition;
};
/**
 * Computes deterministic `(x, y)` coordinates for nodes using topological
 * tier layering when explicit positions are omitted.
 */
export declare function computeMapAutoLayout(nodes: TuxMapNode[], edges: TuxMapEdge[], lod?: TuxMapLoDLevel): Map<string, TuxMapRect>;
type Vec2 = [number, number];
/**
 * Converts a closed polygon outline (array of `[x, y]` points) into a smooth
 * quadratic Bezier SVG path string (`M ... Q ... T ... Z`).
 * Adapted from `@excalidraw/common` `getSvgPathFromStroke` (MIT).
 */
export declare function getSvgPathFromStrokeOutline(points: Vec2[], closed?: boolean): string;
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
export declare function getSmoothedFreehandSvgPath(rawPoints: TuxMapStrokePoint[], options?: FreehandStrokeOptions): string;
/**
 * Generates an ephemeral laser pointer SVG path with time-based and tail-length decay
 * (adapted from Excalidraw `LaserTrails`, MIT License).
 */
export declare function getLaserPointerSvgPath(points: TuxMapStrokePoint[], nowMs: number, baseSize?: number, decayMs?: number, maxTailPoints?: number): string;
export type TuxMapLevelNumber = number;
export type TuxMapElementKind = "person" | "system" | "container" | "database" | "storage" | "component" | "folder" | "file" | "function" | "class" | "constant" | "module" | "schema" | "symbol" | "route" | "external" | "resource";
/** Canonical human-readable labels for `TuxMapElementKind` (`#116`, `#122`). */
export declare const TUX_MAP_ELEMENT_KIND_LABELS: Record<TuxMapElementKind, string>;
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
    last_run?: {
        result: string;
        at?: string;
    };
}
/**
 * A Level 2 perimeter reference to a Level 1 element (a person or an outside
 * system). It is drawn with that element's name, kind and details, so it
 * carries only its id, `ref: true` and where it sits.
 */
export type TuxMapLevelRef = Partial<Omit<TuxMapLevelElement, "id" | "ref">> & {
    id: string;
    ref: true;
};
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
/** Consumer-supplied architectural dependency-rule violation (`#123`). */
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
export type TuxMapLinkCoupling = "contract" | "runtime" | "type-only" | "artifact-stamp" | "build-exec" | "verification" | "prose";
export type TuxMapLinkPhase = "prod-runtime" | "client-bundle" | "build-exec" | "ci-test" | "doc-only";
export type TuxMapBlastIntent = "default" | "patch" | "refactor" | "cut" | "supply-chain";
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
    /** Optional architectural dependency-rule violations on this link (`#123`) */
    violations?: TuxMapLinkViolation[];
}
export declare const GRID_METRICS: {
    readonly CW: 212;
    readonly CH: 128;
    readonly GX: 84;
    readonly GY: 56;
    readonly PAD: 28;
    readonly MH: 60;
    readonly NW: 210;
    readonly NH: 92;
};
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
    /** True when the underlying relationship carries one or more dependency-rule `violations` (`#123`) */
    violating?: boolean;
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
    violating?: boolean;
}
export declare function gridCellToPx(at: [number, number]): {
    x: number;
    y: number;
};
/**
 * Converts a sequence of orthogonal `[x, y]` points into an SVG path with 9px rounded bends.
 */
export declare function roundOrthogonalCorners(pts: [number, number][]): string;
/**
 * Routes wires at right angles strictly through the gaps between columns and rows,
 * never crossing a card, with per-gap interval-coloured lanes and collision-checked labels (`#113`).
 */
export declare function routeGridWires(rels: TuxMapLevelRel[], rects: Record<string, TuxMapGridCellRect>, els: TuxMapLevelElement[]): {
    wires: TuxMapRoutedWire[];
    labels: TuxMapRoutedLabel[];
};
/**
 * Routes right-angle wires for Level 4 deployment resource nodes, trying discovered
 * group-gap corridors with `polyHits` before falling back (`#113`).
 * Pass `selectedId = "*"` to pre-route all links so hover highlighting works with zero recomputation.
 */
export declare function routeDeploymentWires(links: TuxMapDeploymentLink[], rects: Record<string, TuxMapGridCellRect>, selectedId?: string | null): TuxMapRoutedWire[];
/**
 * Converts legacy `TuxMapNode[]` + `TuxMapEdge[]` + `TuxMapZone[]` props into a
 * 4-Level `TuxMapLevelModel` so existing consumers automatically gain 4-level C4 navigation.
 */
export declare function buildLevelModelFromLegacyNodes(nodes: TuxMapNode[], edges: TuxMapEdge[], zones?: TuxMapZone[]): TuxMapLevelModel;
/**
 * Default 4-Level Reference Architecture Model (Generic Enterprise Cloud Platform).
 * Uses clear, vendor-neutral terminology without exposing real internal deployments.
 */
/** Link kinds drawn on no stage (they still count in the blast radius): a document naming a part. */
export declare const TUX_MAP_QUIET_LINK_KINDS: ReadonlySet<string>;
/** Canonical link strength order from strongest runtime/contract edge to weakest prose reference. */
export declare const TUX_MAP_LINK_STRENGTH_ORDER: readonly ["calls", "handled-by", "sends", "reads", "denies", "forks", "copies-logic-of", "reads-format", "imports", "runs", "sources", "generates", "copies", "stamps", "suppresses", "provenance", "tests", "checks", "uses", "loads", "routes", "links", "mentions"];
/** What a link kind means, read from the part it points at ("changing X: Y calls it"). */
export declare const TUX_MAP_LINK_KIND_LABELS: Record<string, string>;
/**
 * Splits repo-qualified (`owner/repo:k:rest` or `repo:k:rest`) and legacy (`k:rest`)
 * node IDs into `{ repo, kind, rest }` (matching Python `_split_node_id` 1:1).
 */
export declare function splitNodeId(nid: string): {
    repo: string | null;
    kind: string | null;
    rest: string;
};
/** True when `nid` has node-ID kind `kind` (`'f'`, `'s'`, `'d'`, `'c'`, `'p'`, `'r'`), whether repo-qualified or legacy. */
export declare function isKindNodeId(nid: string, kind: string | readonly string[] | ReadonlySet<string>): boolean;
/** Strips legacy or repo-qualified kind prefixes (`owner/repo:f:`, `f:`, `p:pkg:`, etc.) for display/matching. */
export declare function stripNodeKindPrefix(nid: string): string;
/**
 * Client-side deterministic link ID (`${kind}:${from}->${to}`, disambiguating duplicates with `#2`, `#3`, ...)
 * so models do not need to serialize explicit `id` fields on every link (`#716` `RO24`).
 */
export declare function deriveLinkId(link: Pick<TuxMapLink, "kind" | "from" | "to">, seenCounts?: Map<string, number>): string;
/**
 * Plain human-readable element type label (`folder`, `file`, `function`, `class`, `HTTP route`, etc.: `#116`).
 */
export declare function plainElementKindLabel(elOrKind: Pick<TuxMapLevelElement, "id" | "kind" | "name" | "tech" | "source"> | string | undefined, opts?: {
    hasSourcePath?: boolean;
}): string;
/** Canonical set of valid semantic blast-radius intents (`tti/tti-ux#110` / `#111`). */
export declare const TUX_MAP_VALID_BLAST_INTENTS: ReadonlySet<TuxMapBlastIntent>;
/** Prototype-safe own-property check (`Object.prototype` keys like `"constructor"` return `false`). */
export declare function hasOwn(obj: unknown, key: PropertyKey): boolean;
export declare function setOwnProp<T>(obj: Record<string, T>, key: string, value: T): void;
/** True Unicode code-point comparison (matches Python `str < str` even on supplementary U+10000+ planes). */
export declare function cmpCodepoint(a: string, b: string): number;
export declare function compareBlastLinks(a: TuxMapLink, b: TuxMapLink): number;
/** Infers deterministic semantic coupling for links that omit explicit `coupling` (rejecting spoofed downgrades on runtime kinds). */
export declare function inferLinkCoupling(link: TuxMapLink): TuxMapLinkCoupling;
/** Infers deterministic execution/shipping phase for links that omit explicit `phase`. */
export declare function inferLinkPhase(link: TuxMapLink): TuxMapLinkPhase;
/**
 * Classifies how `link` participates in an upstream blast-radius walk at distance `hop`
 * (`hop === 0` means `link.to` is in `seeds`).
 */
export declare function classifyBlastLink(link: TuxMapLink, hop: number, intent?: TuxMapBlastIntent, quietSeedOnly?: boolean, kinds?: ReadonlySet<string> | null): "spread" | "stop" | "skip";
/**
 * Resolves raw code links from `model.links` and/or `model.linkTiers` (`spread` / `stop`),
 * applying model-declared `model.stopKinds` when `l.stop` is omitted (`tti/tti-ux#126`).
 */
export declare function resolveModelRawLinks(model?: TuxMapLevelModel): TuxMapLink[];
export type TuxMapValidationIssueCode = "missing-level" | "duplicate-id" | "reserved-id" | "parent-cycle" | "max-depth-exceeded" | "unknown-link-end" | "unknown-rel-end";
export interface TuxMapValidationIssue {
    code: TuxMapValidationIssueCode;
    message: string;
    nodeId?: string;
    targetId?: string;
}
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
 */
export declare function validateMapModel(model: unknown): TuxMapValidationResult;
/**
 * Produces a safe, non-throwing `TuxMapLevelModel` alongside its `validateMapModel` diagnostics (`tti/tti-ux#124`),
 * filling missing levels and breaking cyclic subgraph references.
 */
export declare function sanitizeMapModel(raw: unknown): {
    model: TuxMapLevelModel;
    validation: TuxMapValidationResult;
};
/**
 * Collapses single-child folder chains (`a/ -> b/ -> c/` becomes `a/b/c/`) and skips the intermediate
 * `Folders` subgraph level for small components (`<= maxSmallComponentFiles`, default `8`), recording
 * `aliases[skippedFolderId] = resolvedFocusId` so existing `#focus=` bookmarks still resolve (`tti/tti-ux#124`).
 */
export declare function collapseModelSubgraphs(model: TuxMapLevelModel, opts?: {
    maxSmallComponentFiles?: number;
}): {
    model: TuxMapLevelModel;
    aliases: Record<string, string>;
};
/**
 * child → parent for every element below Level 2: Level 3 components under their container,
 * subgraph elements under their key (or `subgraphRef` owner), inline `children` under their element.
 */
export declare function buildMapParentIndex(model: TuxMapLevelModel): Map<string, string>;
/**
 * Semantic level that displays the children of `fid`:
 * 3 inside a Level 2 container, 5 inside a Level 3 component or Level 4 deployment node,
 * and +1 for each nested subgraph below that (cycle-safe, iterative, bounded at `MAX_TREE_DEPTH`: `#124`).
 */
export declare function levelForFocus(fid: string, model: TuxMapLevelModel, parentOf?: Map<string, string>): number;
/** `id` and its ancestors, nearest first (memoized per `parentOf` map). */
export declare function mapAncestorsOf(id: string, parentOf: Map<string, string>): string[];
/** The nearest of `id` and its ancestors that is in `set`, or null. */
export declare function liftToSet(id: string, set: ReadonlySet<string>, parentOf: Map<string, string>): string | null;
/**
 * Extracts fine-grained `TuxMapLink[]` from `model`: returns `model.links` / `model.linkTiers` when present
 * (bridging non-planned C4/Level-4 relationships for endpoints without fine-grained code-link coverage unless
 * `bridgeUncovered === false`), or synthesizes links from C4 `rels` and `level4.links` when `model.links`
 * is empty/absent.
 */
export declare function extractModelLinks(model: TuxMapLevelModel, opts?: {
    includePlanned?: boolean;
    includeC4Rels?: boolean;
    bridgeUncovered?: boolean;
    bridgeUncoveredPairs?: boolean;
}): TuxMapLink[];
/** Dependency wire filter categories (`tti/tti-ux#118`). */
export type TuxMapWireCategory = "prod" | "tests" | "ci" | "docs";
export declare const TUX_MAP_WIRE_CATEGORIES: readonly TuxMapWireCategory[];
/** Classifies a fine-grained `TuxMapLink` into `"prod" | "tests" | "ci" | "docs"` (`tti/tti-ux#118`). */
export declare function classifyLinkDependencyCategory(link: TuxMapLink): TuxMapWireCategory;
/** Filters `links` to those matching `categories` (`tti/tti-ux#118`). */
export declare function filterLinksByCategories(links: readonly TuxMapLink[], categories: ReadonlySet<TuxMapWireCategory> | Iterable<TuxMapWireCategory>): TuxMapLink[];
export interface TuxMapWireInspectorLinkItem {
    from: string;
    to: string;
    kind: string;
    at?: string;
    sites?: number[];
    stop?: boolean;
    violations?: TuxMapLinkViolation[];
}
export interface TuxMapWireInspectorDetail {
    from: string;
    to: string;
    totalCount: number;
    perKindCounts: Array<{
        kind: string;
        count: number;
        label: string;
    }>;
    cutKinds: Array<{
        kind: string;
        count: number;
        label: string;
    }>;
    links: TuxMapWireInspectorLinkItem[];
    violations: TuxMapLinkViolation[];
}
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
    wires: {
        kid: string;
        label: string;
        violations?: TuxMapLinkViolation[];
    }[];
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
 */
export declare function liftLinksToView(links: TuxMapLink[], focusId: string, kidIds: string[], parentOf: Map<string, string>, opts?: {
    quiet?: ReadonlySet<string>;
    maxPerSide?: number;
    isKnown?: (id: string) => boolean;
    lift?: "depth" | "lca";
    splitIds?: ReadonlySet<string> | Iterable<string>;
    categories?: ReadonlySet<TuxMapWireCategory> | Iterable<TuxMapWireCategory>;
}): {
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
};
/**
 * Memoized `O(|E_copies|)` cycle-safe canonical resolver for `copies` links (`tti/tti-ux#121`).
 */
export declare function buildVendoredCopyIndex(links: readonly TuxMapLink[], elKindById?: ReadonlyMap<string, string>): {
    copyToCanonical: Map<string, string>;
    copiesByCanonical: Map<string, string[]>;
};
/**
 * Folds vendored copy cards (`from` of a `kind === "copies"` link) into their canonical source card (`to`)
 * when in view — or folds sibling copies of the same external source into a single card — attaching
 * `vendoredCopies` / `isVendoredCopy` / `vendoredFrom` metadata and deduplicating `rels` & `links` (`tti/tti-ux#121`).
 */
export declare function foldVendoredCopies(elements: readonly TuxMapLevelElement[], rels: readonly TuxMapLevelRel[], links: readonly TuxMapLink[]): {
    elements: TuxMapLevelElement[];
    rels: TuxMapLevelRel[];
    links: TuxMapLink[];
    foldedToRepresentative: Map<string, string>;
};
export interface TuxMapTraceHop {
    from: string;
    to: string;
    kind: string;
    label: string;
    at?: string;
}
export interface TuxMapTraceResult {
    found: boolean;
    nodeIds: string[];
    hops: TuxMapTraceHop[];
}
/**
 * Directed shortest walk over spreading dependency kinds (`!l.stop`, non-quiet) from `fromId` to `toId`
 * (or any descendant of `fromId` to any descendant of `toId`), powering `"Trace to…"` and `"Why?"` (`tti/tti-ux#125`).
 */
export declare function traceSpreadingPath(fromId: string, toId: string, model: TuxMapLevelModel, opts?: {
    allowStoppingLastHop?: boolean;
}): TuxMapTraceResult;
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
export declare function computeLinkBlastRadius(links: TuxMapLink[], seedOrSeeds: string | Iterable<string>, parentOf: Map<string, string>, opts?: TuxMapBlastOptions): TuxMapBlastResult;
export type TuxMapElementChangeKind = "added" | "deleted" | "moved" | "sig-changed" | "body-patched";
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
/**
 * Computes a deterministic structural delta between two `TuxMapLevelModel` trees (`baseModel` vs `headModel`),
 * classifying node changes (`added`, `deleted`, `moved`, `sig-changed`, `body-patched`), wire changes
 * (`added`, `removed`, `dangling`), leaf-first `blastSeedIds`, `recommendedIntent`, and a visual `mergedModel`.
 */
export declare function computeGraphDelta(baseModel: TuxMapLevelModel, headModel: TuxMapLevelModel, opts?: TuxMapGraphDeltaOptions): TuxMapGraphDelta;
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
export interface TuxMapQueryIndex {
    parentOf: Map<string, string>;
    kidsOf: Map<string, string[]>;
    nodes: Map<string, TuxMapGraphNodeRecord>;
    edges: TuxMapGraphEdgeRecord[];
    edgesByFrom: Map<string, TuxMapGraphEdgeRecord[]>;
    edgesByTo: Map<string, TuxMapGraphEdgeRecord[]>;
    depEdgesByFrom: Map<string, TuxMapGraphEdgeRecord[]>;
    depEdgesByTo: Map<string, TuxMapGraphEdgeRecord[]>;
    neighborsByNode: Map<string, Array<{
        next: string;
        edge: TuxMapGraphEdgeRecord;
    }>>;
    effectiveLinks: TuxMapLink[];
}
/**
 * Normalizes supported architecture model JSON inputs (`TuxMapLevelModel`, gateway `architecture.json`
 * `schema: 2`, or raw `code-graph.py --json` subgraphs+links) into a canonical `TuxMapLevelModel`.
 *
 * Rejects non-object payloads, `code-map.json` placement rule files, and (when `allowEmpty === false`)
 * zero-node models with a concise `< 2 KB` diagnostic error (`N-01`, `S-13`).
 */
export declare function normalizeArchitectureModelInput(raw: unknown, opts?: {
    allowEmpty?: boolean;
}): TuxMapLevelModel;
/** Minimal zero-sample fallback model (`tti/tti-ux#114`). */
export declare const EMPTY_TTI_LEVEL_MODEL: TuxMapLevelModel;
/**
 * Memoized `O(V + E)` query index per `TuxMapLevelModel` instance so repeated
 * layer, blast-radius, and shortest-path queries do not rebuild graph tables.
 */
export declare function getMapQueryIndex(model?: TuxMapLevelModel): TuxMapQueryIndex;
/**
 * Indexes a `TuxMapLevelModel` into a unified Code Property Graph (CPG) index
 * spanning Levels 1..N (Context, Containers, Components, Deployment, Modules, Schemas, AST Symbols).
 */
export declare function buildUnifiedArchitectureGraph(model?: TuxMapLevelModel): {
    nodes: Map<string, TuxMapGraphNodeRecord>;
    edges: TuxMapGraphEdgeRecord[];
};
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
    downstreamDependencies: Array<{
        id: string;
        hop: number;
        name?: string;
        level?: number;
        node?: TuxMapGraphNodeRecord;
    }>;
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
/**
 * Ranks up to `maxSuggestions` (capped at 10) close node IDs by prefix, substring, or token overlap.
 */
export declare function suggestCloseNodeIds(unknownId: string, nodes: ReadonlyMap<string, TuxMapGraphNodeRecord>, maxSuggestions?: number): string[];
/**
 * Queries nodes (and optional matching edges) at a semantic level, parent subgraph, kind, or text filter,
 * supporting compact summaries and `limit`/`offset` pagination (`tti/tti-ux#111`).
 */
export declare function queryArchitectureNodes(model?: TuxMapLevelModel, opts?: TuxMapNodeQueryOptions): {
    level: number | "all";
    focusId: string | null;
    totalNodeCount: number;
    nodeCount: number;
    edgeCount: number;
    offset: number;
    hasMore: boolean;
    nodes: Array<TuxMapGraphNodeRecord | TuxMapCompactNodeRecord>;
    edges: TuxMapGraphEdgeRecord[];
};
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
export declare function queryArchitectureImpact(seedIds: string | Iterable<string>, model?: TuxMapLevelModel, opts?: TuxMapImpactQueryOptions): TuxMapImpactQueryResult | TuxMapUnknownNodeError;
/**
 * Finds the shortest directed architectural dependency path between `fromNodeId` and `toNodeId`,
 * descending into code/components below `fromNodeId` when needed without climbing `child -> parent`
 * or shortcutting through unsuppressed coarse C4 summary edges (`tti/tti-ux#111`, `F-05`, `N-03`, `S-11`).
 *
 * Pass `{ direction: "upstream" }` to follow reverse dependency edges (`to -> from`).
 */
export declare function findArchitecturePath(fromNodeId: string, toNodeId: string, model?: TuxMapLevelModel, opts?: TuxMapPathQueryOptions): TuxMapPathQueryResult | TuxMapUnknownNodeError;
export declare const TUX_MAP_SEARCH_GROUPS: readonly ["Components", "Folders", "Files", "Functions", "Routes"];
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
/**
 * Builds (and WeakMap-caches) the unified Go-To search index across Levels 1–4,
 * all fractal subgraphs, `route` elements, `handled-by` links, and `model.routes` (`tti/tti-ux#120`).
 */
export declare function buildMapSearchIndex(model?: TuxMapLevelModel): TuxMapSearchEntry[];
/**
 * Searches across Components, Folders, Files, Functions, and Routes in `< 1 ms` over 2,400+ entries.
 * Groups are ordered by top hit score when `query` is non-empty so `Enter` jumps directly to the #1 match.
 */
export declare function searchArchitectureMap(modelOrEntries: TuxMapLevelModel | readonly TuxMapSearchEntry[], query: string, opts?: {
    includePlanned?: boolean;
    limitPerGroup?: number;
}): {
    query: string;
    totalHits: number;
    groups: TuxMapSearchGroupResult[];
    flatHits: TuxMapSearchHit[];
};
export {};
