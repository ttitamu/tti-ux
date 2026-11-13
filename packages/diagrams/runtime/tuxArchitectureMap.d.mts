// AUTO-GENERATED from app/utils/tuxArchitectureMap.ts by scripts/build-map-runtime.mjs — DO NOT EDIT.
// SPDX-License-Identifier: Apache-2.0 (adapts MIT geometry/graph routines; see app/utils/tuxArchitectureMap.ts)
// SOURCE-SHA256: 524196c754ba90138e42b829f3f9000f2caac2f6a40eedc325e23ff375616a4d
/**
 * tuxArchitectureMap — Core Engine for the TUX Modular Architecture Map (M.A.P.) & Infinite Canvas.
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
    spec: string;
    /** What the resource does; the deployment card says it when `spec` is empty */
    role?: string;
    status?: TuxMapStatus;
    host?: string;
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
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
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
/**
 * Zoom thresholds between the legacy level-of-detail tiers.
 * @internal
 */
export declare const LOD_THRESHOLDS: {
    readonly resources: 0.65;
    readonly packages: 1.25;
};
/**
 * Legacy level-of-detail tier for a zoom factor.
 * @internal
 */
export declare function resolveSemanticLoD(zoom: number, override?: "auto" | TuxMapLoDLevel): TuxMapLoDLevel;
/**
 * Returns the intrinsic world-space dimensions of a node card for a given LoD
 * so edge handles, zone bounding boxes, and minimap stay exact across zoom tiers.
 * @internal
 */
export declare function getNodeDimensionsForLoD(node: TuxMapNode, lod: TuxMapLoDLevel): {
    width: number;
    height: number;
};
/**
 * Screen point to legacy canvas world coordinates.
 * @internal
 */
export declare function screenToWorld(screenX: number, screenY: number, viewport: TuxMapViewport): {
    x: number;
    y: number;
};
/**
 * Legacy canvas world point to screen coordinates.
 * @internal
 */
export declare function worldToScreen(worldX: number, worldY: number, viewport: TuxMapViewport): {
    x: number;
    y: number;
};
/**
 * Zooms the viewport around a specific screen focal point (e.g. cursor position)
 * so the world point under the cursor stays stationary during wheel/pinch zoom.
 * @internal
 */
export declare function zoomAroundScreenPoint(viewport: TuxMapViewport, nextZoom: number, focalScreenX: number, focalScreenY: number, minZoom?: number, maxZoom?: number): TuxMapViewport;
/**
 * Computes the bounding rectangle enclosing all given rectangles.
 * @internal
 */
export declare function getBoundsOfRects(rects: TuxMapRect[]): TuxMapRect;
/**
 * Computes the ideal viewport `(x, y, zoom)` to fit a world bounding box
 * inside a container of `(containerWidth, containerHeight)` with padding.
 * @internal
 */
export declare function getViewportForBounds(bounds: TuxMapRect, containerWidth: number, containerHeight: number, minZoom?: number, maxZoom?: number, padding?: number): TuxMapViewport;
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
 * @internal
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
 * @internal
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
 * @internal
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
 * @internal
 */
export declare function computeMapAutoLayout(nodes: TuxMapNode[], edges: TuxMapEdge[], lod?: TuxMapLoDLevel): Map<string, TuxMapRect>;
/**
 * Resets one-shot Section 4/8 deprecation warning state (intended for test suites).
 * @internal
 */
export declare function resetArchitectureDeprecationWarnings(): void;
/**
 * Computes the upstream (dependencies that feed `rootNodeId`) and downstream
 * (dependents impacted by `rootNodeId`) blast-radius subgraph using directed BFS.
 *
 * @deprecated Use `computeLinkBlastRadius` or `queryArchitectureImpact` instead.
 * @public
 */
export declare function computeDependencyBlastRadius(rootNodeId: string, edges: TuxMapEdge[]): {
    activeNodeIds: Set<string>;
    upstreamNodeIds: Set<string>;
    downstreamNodeIds: Set<string>;
    activeEdgeIds: Set<string>;
};
type Vec2 = [number, number];
/**
 * Converts a closed polygon outline (array of `[x, y]` points) into a smooth
 * quadratic Bezier SVG path string (`M ... Q ... T ... Z`).
 * Adapted from `@excalidraw/common` `getSvgPathFromStroke` (MIT).
 * @internal
 */
export declare function getSvgPathFromStrokeOutline(points: Vec2[], closed?: boolean): string;
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
export declare function getSmoothedFreehandSvgPath(rawPoints: TuxMapStrokePoint[], options?: FreehandStrokeOptions): string;
/**
 * Generates an ephemeral laser pointer SVG path with time-based and tail-length decay
 * (adapted from Excalidraw `LaserTrails`, MIT License).
 * @public
 */
export declare function getLaserPointerSvgPath(points: TuxMapStrokePoint[], nowMs: number, baseSize?: number, decayMs?: number, maxTailPoints?: number): string;
/**
 * A level of the map: 1 Context, 2 Containers, 3 Components, 4 Infrastructure, 5 and deeper for code subgraphs.
 * @public
 */
export type TuxMapLevelNumber = number;
/**
 * What an element is; `TUX_MAP_ELEMENT_KIND_LABELS` holds the label of each kind.
 * @public
 */
export type TuxMapElementKind = "person" | "system" | "container" | "database" | "storage" | "component" | "folder" | "file" | "function" | "class" | "constant" | "module" | "schema" | "symbol" | "route" | "external" | "resource";
/**
 * Canonical human-readable labels for `TuxMapElementKind` (`#116`, `#122`).
 * @public
 */
export declare const TUX_MAP_ELEMENT_KIND_LABELS: Record<TuxMapElementKind, string>;
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
    /** Repository slug or URL (e.g. "owner/name" or "https://forge.example/owner/name") */
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
    last_run?: {
        result: string;
        at?: string;
    };
}
/**
 * A Level 2 perimeter reference to a Level 1 element (a person or an outside
 * system). It is drawn with that element's name, kind and details, so it
 * carries only its id, `ref: true` and where it sits.
 * @public
 */
export type TuxMapLevelRef = Partial<Omit<TuxMapLevelElement, "id" | "ref">> & {
    id: string;
    ref: true;
};
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
 * The schema name of the canonical architecture model, `TuxMapLevelModel`. A producer writes exactly this string
 * in the model's top-level `schema` field; `normalizeArchitectureModelInput` stamps it on what it returns, and
 * `validateMapModel` warns when a level model lacks it or names another one (`tti/tti-ux#162`).
 * @public
 */
export declare const TUX_MAP_SCHEMA: "tux-map/1";
/**
 * The type of `TUX_MAP_SCHEMA`: the one schema name this release reads.
 * @public
 */
export type TuxMapSchemaName = typeof TUX_MAP_SCHEMA;
/**
 * The architecture model the map renders and the query functions read: Levels 1 to 4, code subgraphs and code links.
 * @public
 */
export interface TuxMapLevelModel {
    /**
     * Schema name of this document: `TUX_MAP_SCHEMA` (`"tux-map/1"`). Optional so documents written before the name
     * existed keep rendering; `validateMapModel` reports its absence, or any other value, as a warning.
     */
    schema?: TuxMapSchemaName;
    generatedAt?: string;
    issueBaseUrl?: string;
    /** Optional repository base URL for `source.path` links (e.g. "https://forge.example/owner/name/src/branch/main") */
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
    /** Optional pre-partitioned spreading & stopping link tiers (`#126`). */
    linkTiers?: {
        spread?: TuxMapLink[];
        stop?: TuxMapLink[];
    };
    /** Optional list of link `kind`s treated as `stop: true` when `link.stop` is omitted (`#126`). */
    stopKinds?: string[];
    /** Optional legacy-to-canonical bookmark alias map (`#124`). */
    aliases?: Record<string, string>;
    /** Optional HTTP route table linking URL patterns to handler symbols or files (`#120`, `#122`). */
    routes?: TuxMapRouteEntry[];
}
/**
 * A subgraph after `sanitizeMapModel`: `rels` is always an array.
 * @public
 */
export interface TuxMapNormalizedSubgraph extends TuxMapSubgraph {
    rels: TuxMapLevelRel[];
}
/**
 * A model after `sanitizeMapModel`: what `<TuxArchitectureMap>` lays out and what `collapseModelSubgraphs` returns
 * when it is given one. It is a `TuxMapLevelModel`, so every function that takes a model takes it; the difference is
 * that the fields below marked "filled" are always there, so code that holds a normalized model reads them without
 * a guard, and the compiler checks that (`tti/tti-ux#164`).
 *
 * Required or optional, field by field. "Required" is what the type says and what `validateMapModel` reports when a
 * document lacks it; "filled" is what `sanitizeMapModel` puts there, once, so a document that lacks it still renders.
 *
 * | Field | In a document | `validateMapModel` when absent | In a normalized model |
 * |---|---|---|---|
 * | `level1`, `level2`, `level3`, `level4` | required | issue `missing-level` (`valid: false`) | filled: an empty level |
 * | `level1.elements`, `level1.rels` | required | warning `missing-field` | filled: `[]` |
 * | `level2.elements`, `level2.rels` | required | warning `missing-field` | filled: `[]` |
 * | `level2.boundary` | required | warning `missing-field` | filled: `""` (no boundary drawn) |
 * | `level3[containerId]` | required to be a list | none | filled: `[]` |
 * | `level4.groups`, `level4.nodes`, `level4.links` | required | warning `missing-field` | filled: `[]` |
 * | `subgraphs` | optional | none | filled: `{}` |
 * | `subgraphs[key].elements` | required | warning `missing-field` | filled: `[]` |
 * | `subgraphs[key].rels` | optional | none | filled: `[]` |
 * | `level4.zones`, `level4.neighbors`, `level4.centerTitle` | optional | none | left absent: absence selects the built-in columns and title |
 * | `links`, `linkTiers`, `stopKinds` | optional | none | left absent: read together through `resolveModelRawLinks`, where a present `stopKinds` means something an empty default would not |
 * | `routes`, `aliases` | optional | none | left absent (`aliases` is cleaned when present; `collapseModelSubgraphs` returns the full alias table) |
 * | `schema`, titles, summaries, base URLs | optional | `missing-schema` for `schema`, none for the rest | left absent |
 * | on an element or a deployment node: `kind`, `status`, `at`, `source`, `children`, `childRels`, `hosts`, `deps`, `runs`, `deployed`, `roadmap`, `live`, `diff`, `facts`, … | optional | none | left absent: absence is the value (no source link, no inline children, hosts nothing), and filling them would copy every element of the model |
 * | on a relationship or a link: `label`, `tech`, `status`, `kind`, `stop`, `at`, `sites`, `coupling`, `phase`, `violations` | optional | none | left absent |
 * | `id`, `name` on an element | required | warning `missing-field` (and the existing issues for ids) | filled: `id` is `""` (the readers take it as "has none"), `name` is the id |
 * | `id`, `kind`, `title`, `role` on a deployment node | required | warning `missing-field` | filled: `id`, `kind` and `role` are `""`, `title` is the id |
 * | `from`, `to` on a relationship or link | required | warning `missing-field` (and the existing issues for ends) | not filled: a relationship or link without both ends is dropped |
 * | any other field the types require (`path` of a source, `rule` of a violation, `pattern` and `handler` of a route, …) | required | warning `missing-field` | left absent |
 *
 * The fields left absent are still read with `?.` or `?? []` wherever they are used: that is one guard, on a field
 * whose absence is meaningful. The guards this type removes are the ones on containers.
 *
 * A field that is there with a value of another JSON type than its type here (a number for a `label`, an object
 * for a list) is reported as `invalid-type` and read as absent, before the filling above (`tti/tti-ux#163`). So a
 * normalized model has, in every field these types name, a value of the type they give it or none.
 * @public
 */
export interface TuxMapNormalizedModel extends TuxMapLevelModel {
    subgraphs: Record<string, TuxMapNormalizedSubgraph>;
}
/**
 * How strongly a link couples its two ends; decides which links each blast intent follows.
 * @public
 */
export type TuxMapLinkCoupling = "contract" | "runtime" | "type-only" | "artifact-stamp" | "build-exec" | "verification" | "prose";
/**
 * Where a link's dependency takes effect: production runtime, client bundle, build, CI or docs.
 * @public
 */
export type TuxMapLinkPhase = "prod-runtime" | "client-bundle" | "build-exec" | "ci-test" | "doc-only";
/**
 * The kind of change a blast radius is computed for.
 * @public
 */
export type TuxMapBlastIntent = "default" | "patch" | "refactor" | "cut" | "supply-chain";
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
    /** First line as drawn: what the link does, shortened by `shortWireLabel`. Empty on a technology label. */
    t1: string;
    /** The link's technology, shortened, on the label at the target end. Empty on the other label. */
    t2: string;
    /** Hidden at rest: another label holds its spot. Shown while its card is lit, hovered or focused. */
    forced: boolean;
    violating?: boolean;
    /** The whole text, `label [tech]`: the accessible name and the tooltip (`#210`). */
    full?: string;
    /** The end of the wire the label sits at; absent on a label that found no spot clear of the cards. */
    end?: "from" | "to";
    /** The side of the card that end's port is on. */
    side?: "l" | "r" | "t" | "b";
    planned?: boolean;
}
/**
 * A wire label's short text: the label itself up to `max` characters, else its leading words that
 * fit, without trailing punctuation, and an ellipsis ("Uses portal & API" reads "Uses portal…" at
 * 16, "Uses…" at 10). A first word longer than that is cut.
 * @internal
 */
export declare function shortWireLabel(text: string, max?: number): string;
/**
 * Grid cell `[column, row]` to its pixel origin.
 * @internal
 */
export declare function gridCellToPx(at: [number, number]): {
    x: number;
    y: number;
};
/**
 * Converts a sequence of orthogonal `[x, y]` points into an SVG path with 9px rounded bends.
 * @internal
 */
export declare function roundOrthogonalCorners(pts: [number, number][]): string;
/**
 * Routes wires at right angles strictly through the gaps between columns and rows,
 * never crossing a card, with per-gap interval-coloured lanes and collision-checked labels (`#113`).
 *
 * Each labelled wire gets a short label beside its ends, at the port where it meets the card,
 * outside the card's box and never over any card (`#210`): what the link does (`label`, or
 * "Planned") at its source end, and its `tech` in brackets at its target end. The short text is
 * `shortWireLabel`'s, at 16 characters where that fits and 10 where it does not; the whole of it
 * is each label's `full`. Labels at one side of a card stack port by port, in the order the wires
 * leave. Where two labels want the same spot the later one moves off its stub to just beside it,
 * then its text is cut shorter, down to 6 characters, then what the link does moves to the wire's
 * other end, and then the label of the lower rank is hidden at rest (`forced`): rule violations
 * first, then live links, then planned
 * ones, then technologies, and the model's order within a rank. A hidden label keeps its place at
 * the port. A box is tested through the layout's grid buckets, not against the whole view (`#159`).
 * @internal
 */
export declare function routeGridWires(rels: TuxMapLevelRel[], rects: Record<string, TuxMapGridCellRect>, els: TuxMapLevelElement[]): {
    wires: TuxMapRoutedWire[];
    labels: TuxMapRoutedLabel[];
};
/**
 * Routes right-angle wires for Level 4 deployment resource nodes, trying discovered
 * group-gap corridors with `polyHits` before falling back (`#113`).
 * Pass `selectedId = "*"` to pre-route all links so hover highlighting works with zero recomputation.
 * @internal
 */
export declare function routeDeploymentWires(links: TuxMapDeploymentLink[], rects: Record<string, TuxMapGridCellRect>, selectedId?: string | null): TuxMapRoutedWire[];
/**
 * Converts legacy `TuxMapNode[]` + `TuxMapEdge[]` + `TuxMapZone[]` props into a
 * 4-Level `TuxMapLevelModel` so existing consumers automatically gain 4-level C4 navigation.
 * @public
 */
export declare function buildLevelModelFromLegacyNodes(nodes: TuxMapNode[], edges: TuxMapEdge[], zones?: TuxMapZone[]): TuxMapLevelModel;
/**
 * Default 4-Level Reference Architecture Model (Generic Enterprise Cloud Platform).
 * Uses clear, vendor-neutral terminology without exposing real internal deployments.
 */
/**
 * Link kinds drawn on no stage (they still count in the blast radius): a document naming a part.
 * @public
 */
export declare const TUX_MAP_QUIET_LINK_KINDS: ReadonlySet<string>;
/**
 * Canonical link strength order from strongest runtime/contract edge to weakest prose reference.
 * @public
 */
export declare const TUX_MAP_LINK_STRENGTH_ORDER: readonly ["calls", "handled-by", "sends", "reads", "denies", "forks", "copies-logic-of", "reads-format", "imports", "runs", "sources", "generates", "copies", "stamps", "suppresses", "provenance", "tests", "checks", "uses", "loads", "routes", "links", "mentions"];
/**
 * What a link kind means, read from the part it points at ("changing X: Y calls it").
 * @public
 */
export declare const TUX_MAP_LINK_KIND_LABELS: Record<string, string>;
/**
 * Splits repo-qualified (`owner/repo:k:rest` or `repo:k:rest`) and legacy (`k:rest`)
 * node IDs into `{ repo, kind, rest }` (matching Python `_split_node_id` 1:1). The answer
 * is kept per id and shared between calls: read it, do not change it.
 * @internal
 */
export declare function splitNodeId(nid: string): {
    repo: string | null;
    kind: string | null;
    rest: string;
};
/**
 * True when `nid` has node-ID kind `kind` (`'f'`, `'s'`, `'d'`, `'c'`, `'p'`, `'r'`), whether repo-qualified or legacy.
 * @internal
 */
export declare function isKindNodeId(nid: string, kind: string | readonly string[] | ReadonlySet<string>): boolean;
/**
 * Strips legacy or repo-qualified kind prefixes (`owner/repo:f:`, `f:`, `p:pkg:`, etc.) for display/matching.
 * @internal
 */
export declare function stripNodeKindPrefix(nid: string): string;
/**
 * Client-side deterministic link ID (`${kind}:${from}->${to}`, disambiguating duplicates with `#2`, `#3`, ...)
 * so models do not need to serialize explicit `id` fields on every link.
 * @internal
 */
export declare function deriveLinkId(link: Pick<TuxMapLink, "kind" | "from" | "to">, seenCounts?: Map<string, number>): string;
/**
 * Plain human-readable element type label (`folder`, `file`, `function`, `class`, `HTTP route`, etc.: `#116`).
 * @public
 */
export declare function plainElementKindLabel(elOrKind: Pick<TuxMapLevelElement, "id" | "kind" | "name" | "tech" | "source"> | string | undefined, opts?: {
    hasSourcePath?: boolean;
}): string;
/**
 * Canonical set of valid semantic blast-radius intents (`tti/tti-ux#110` / `#111`).
 * @public
 */
export declare const TUX_MAP_VALID_BLAST_INTENTS: ReadonlySet<TuxMapBlastIntent>;
/**
 * Prototype-safe own-property check (`Object.prototype` keys like `"constructor"` return `false`).
 * @internal
 */
export declare function hasOwn(obj: unknown, key: PropertyKey): boolean;
/**
 * Sets an own data property; safe for keys such as `__proto__`.
 * @internal
 */
export declare function setOwnProp<T>(obj: Record<string, T>, key: string, value: T): void;
/**
 * True Unicode code-point comparison (matches Python `str < str` even on supplementary U+10000+ planes).
 * Without a surrogate in either string, UTF-16 order is code-point order, so the engine compares
 * (`tti/tti-ux#227`). Only the sign of the result means anything.
 * @internal
 */
export declare function cmpCodepoint(a: string, b: string): number;
/**
 * Deterministic order of the links the blast radius walks.
 * @internal
 */
export declare function compareBlastLinks(a: TuxMapLink, b: TuxMapLink): number;
/**
 * Infers deterministic semantic coupling for links that omit explicit `coupling` (rejecting spoofed downgrades on runtime kinds).
 * @public
 */
export declare function inferLinkCoupling(link: TuxMapLink): TuxMapLinkCoupling;
/**
 * Infers deterministic execution/shipping phase for links that omit explicit `phase`.
 * @public
 */
export declare function inferLinkPhase(link: TuxMapLink): TuxMapLinkPhase;
/**
 * Classifies how `link` participates in an upstream blast-radius walk at distance `hop`
 * (`hop === 0` means `link.to` is in `seeds`).
 * @public
 */
export declare function classifyBlastLink(link: TuxMapLink, hop: number, intent?: TuxMapBlastIntent, quietSeedOnly?: boolean, kinds?: ReadonlySet<string> | null): "spread" | "stop" | "skip";
/**
 * Resolves raw code links from `model.links` and/or `model.linkTiers` (`spread` / `stop`),
 * applying model-declared `model.stopKinds` when `l.stop` is omitted (`tti/tti-ux#126`).
 * @public
 */
export declare function resolveModelRawLinks(model?: TuxMapLevelModel): TuxMapLink[];
/**
 * Kind of problem `validateMapModel` reports. `resolved-empty-subgraph` is the one it never
 * reports itself: `<TuxArchitectureMap>` adds it to its own diagnostics, once per card, when
 * `resolveSubgraph` returned elements and sanitizing removed them all (`tti/tti-ux#156`).
 *
 * The last four are what the schema of the model (`schema/tux-map-1.schema.json`, generated from these types)
 * finds, and are only ever in `warnings` (`tti/tti-ux#163`): `missing-field`, a field the types require that is
 * not there; `invalid-type`, a value of another JSON type than the types have; `unknown-kind`, an element `kind`
 * this release does not list; `unknown-enum-value`, any other value outside a closed list (`status`, `coupling`,
 * `phase`, …). A later release may add codes: read the ones you know and show the rest by their `message`.
 * @public
 */
export type TuxMapValidationIssueCode = "missing-level" | "duplicate-id" | "reserved-id" | "parent-cycle" | "max-depth-exceeded" | "unknown-link-end" | "unknown-rel-end" | "resolved-empty-subgraph" | "missing-schema" | "unknown-schema" | "missing-field" | "invalid-type" | "unknown-kind" | "unknown-enum-value";
/**
 * One problem found by `validateMapModel`.
 * @public
 */
export interface TuxMapValidationIssue {
    code: TuxMapValidationIssueCode;
    message: string;
    nodeId?: string;
    targetId?: string;
    /** Where in the document, as a JSON Pointer (`/level1/elements`). Set by the codes that are about a field. */
    path?: string;
    /** How many places in the document have this same problem, when more than the one `path` names. */
    count?: number;
}
/**
 * Result of `validateMapModel`.
 * @public
 */
export interface TuxMapValidationResult {
    /** `true` when `issues` is empty. `warnings` never change it. */
    valid: boolean;
    issues: TuxMapValidationIssue[];
    /**
     * Notices that do not make the model invalid: `missing-schema` and `unknown-schema` (`tti/tti-ux#162`), which
     * change nothing in how it renders, and what the schema of the model finds (`tti/tti-ux#163`, `#164`):
     * `missing-field`, `invalid-type`, `unknown-kind` and `unknown-enum-value`. A model with any of these still
     * renders: `sanitizeMapModel` fills what is missing, leaves out a value of the wrong type, and keeps a kind or
     * an enum value it does not know. Kept apart from `issues` so a caller that gates on `valid` or counts `issues`
     * behaves as before.
     */
    warnings: TuxMapValidationIssue[];
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
 *
 * It also fills `warnings`, which never affect `valid` (`tti/tti-ux#162`): `missing-schema` when a level model has
 * no top-level `schema`, and `unknown-schema` when it has one other than `TUX_MAP_SCHEMA`. Both are checked only on
 * a document that has at least one of `level1`..`level4`, so the compatibility inputs of
 * `normalizeArchitectureModelInput` (which are not level models) are not told to carry a name that is not theirs.
 * Pass the document as the producer wrote it: the normalizer's output is already stamped.
 *
 * The other warnings are the shape of the document (`tti/tti-ux#163`, `#164`): it is checked against the JSON
 * Schema generated from the model types, the one published as `schema/tux-map-1.schema.json`, by an interpreter
 * in this file (no code is generated, so a Content Security Policy without `unsafe-eval` is enough).
 * - `missing-field`: a field the types require is not there (or is `null`).
 * - `invalid-type`: a value is of another JSON type than the types have, a tuple has another length, or a value
 *   fits no side of a union.
 * - `unknown-kind`: an element `kind` outside `TuxMapElementKind`.
 * - `unknown-enum-value`: any other value outside a closed list of strings.
 *
 * Each has the `path` (a JSON Pointer) of the value. One rule broken in many places is one warning, with the
 * `path` of the first place and the `count` of them all. A property the types do not name is not reported, and
 * neither is anything already reported above: `schema`, and a level that is missing or is not an object.
 *
 * They are warnings and not issues for two reasons. A document with any of them still renders
 * (`sanitizeMapModel` fills, leaves out or keeps, see `TuxMapNormalizedModel`). And a kind or an enum value
 * this release does not know is what a document written for a later release looks like: reading it as an error
 * would make every consumer that gates on `valid` refuse a model the day its producer is upgraded.
 * @public
 */
export declare function validateMapModel(model: unknown): TuxMapValidationResult;
/**
 * Produces a safe, non-throwing model alongside its `validateMapModel` diagnostics (`tti/tti-ux#124`),
 * filling missing levels and breaking cyclic subgraph references.
 *
 * It is the one place defaults are filled (`tti/tti-ux#164`): the result is a `TuxMapNormalizedModel`, whose
 * doc comment lists every field and its default. Elements, nodes, relationships and links that needed no change
 * are the objects of `raw`, not copies.
 * @public
 */
export declare function sanitizeMapModel(raw: unknown): {
    model: TuxMapNormalizedModel;
    validation: TuxMapValidationResult;
};
/**
 * Collapses single-child folder chains (`a/ -> b/ -> c/` becomes `a/b/c/`) and skips the intermediate
 * `Folders` subgraph level for small components (`<= maxSmallComponentFiles`, default `8`), recording
 * `aliases[skippedFolderId] = resolvedFocusId` so existing `#focus=` bookmarks still resolve (`tti/tti-ux#124`).
 *
 * The result has the type of the model given: a `TuxMapNormalizedModel` stays one (`tti/tti-ux#164`), because
 * this adds no subgraph without `rels` and never removes `subgraphs`. Given any other model it fills nothing in.
 * @public
 */
export declare function collapseModelSubgraphs<M extends TuxMapLevelModel>(model: M, opts?: {
    maxSmallComponentFiles?: number;
}): {
    model: M;
    aliases: Record<string, string>;
};
/**
 * child → parent for every element below Level 2: Level 3 components under their container,
 * subgraph elements under their key (or `subgraphRef` owner), inline `children` under their element.
 * @public
 */
export declare function buildMapParentIndex(model: TuxMapLevelModel): Map<string, string>;
/**
 * A model with its lazily resolved subgraphs merged in, sanitized and collapsed, as
 * `mergeLazyMapSubgraphs` returns it (`tti/tti-ux#157`).
 * @internal
 */
export interface TuxMapLazyMergeState {
    /** The model the subgraphs were merged into, as it was passed. */
    raw: unknown;
    model: TuxMapNormalizedModel;
    aliases: Record<string, string>;
    validation: TuxMapValidationResult;
    /**
     * Set when `model` is `from` plus one subgraph and nothing else: every other subgraph, level and
     * alias is the same object as in `from`. `owner` is the parent of `elements` in the parent index.
     */
    added?: {
        from: TuxMapNormalizedModel;
        key: string;
        owner: string;
        elements: TuxMapLevelElement[];
    };
}
/**
 * `raw` with the lazily resolved subgraphs `lazy` merged in, sanitized and collapsed: the same model,
 * aliases and validation as `collapseModelSubgraphs(sanitizeMapModel(merged).model)` on the merged
 * model (`tti/tti-ux#157`).
 *
 * Given the state it returned last time (`prev`), with the same `raw` and one more key in `lazy`,
 * it sanitizes and collapses only the subgraph that arrived and adds it to the previous model, when
 * it can show the rest of the model is not affected by the arrival. The model is still validated as
 * a whole. Anything else is built from scratch: another `raw`, a key removed or replaced, a subgraph
 * that changes the model's cycles, that owns or is folded into a subgraph already there, or that a
 * folder chain or a small component's flattening would reach.
 *
 * `prev` is used up by the call: pass each state once. A caller that changed `raw` or a resolved
 * subgraph in place passes no `prev`.
 * @internal
 */
export declare function mergeLazyMapSubgraphs(raw: unknown, lazy: Record<string, unknown>, prev?: TuxMapLazyMergeState): TuxMapLazyMergeState;
/**
 * `buildMapParentIndex` of a model that is the model `prev` was built from plus one subgraph, whose
 * `elements` hang under `owner` (`TuxMapLazyMergeState.added`). `prev` is not changed.
 * @internal
 */
export declare function extendMapParentIndex(prev: ReadonlyMap<string, string>, owner: string, elements: TuxMapLevelElement[]): Map<string, string>;
/**
 * Semantic level that displays the children of `fid`:
 * 3 inside a Level 2 container, 5 inside a Level 3 component or Level 4 deployment node,
 * and +1 for each nested subgraph below that (cycle-safe, iterative, bounded at `MAX_TREE_DEPTH`: `#124`).
 *
 * Pass `parentOf` (`buildMapParentIndex(model)`) when the caller already holds it: left out, the index
 * is built on every call (`#160`).
 * @public
 */
export declare function levelForFocus(fid: string, model: TuxMapLevelModel, parentOf?: Map<string, string>): number;
/**
 * `id` and its ancestors, nearest first, in a new array the caller may change.
 * O(depth): this runs several times per link, so it must not touch the whole map.
 * @public
 */
export declare function mapAncestorsOf(id: string, parentOf: Map<string, string>): string[];
/**
 * The nearest of `id` and its ancestors that is in `set`, or null.
 * @internal
 */
export declare function liftToSet(id: string, set: ReadonlySet<string>, parentOf: Map<string, string>): string | null;
/**
 * Extracts fine-grained `TuxMapLink[]` from `model`: returns `model.links` / `model.linkTiers` when present
 * (bridging non-planned C4/Level-4 relationships for endpoints without fine-grained code-link coverage unless
 * `bridgeUncovered === false`), or synthesizes links from C4 `rels` and `level4.links` when `model.links`
 * is empty/absent.
 *
 * `opts.parentOf` is the model's parent index (`buildMapParentIndex(model)`) when the caller already
 * holds it; it is read, never changed, and the result is the same as without it. Left out, the index
 * is built here when the bridging needs it (`#160`).
 * @public
 */
export declare function extractModelLinks(model: TuxMapLevelModel, opts?: {
    includePlanned?: boolean;
    includeC4Rels?: boolean;
    bridgeUncovered?: boolean;
    bridgeUncoveredPairs?: boolean;
    parentOf?: Map<string, string>;
}): TuxMapLink[];
/**
 * `extractModelLinks(model, { includePlanned, bridgeUncoveredPairs: true, parentOf })`, kept so the
 * next call can build on it (`tti/tti-ux#157`).
 *
 * `prev` is the array this function returned last time and `added` what the model gained since
 * (`TuxMapLazyMergeState.added`): when `prev` was built for `added.from` with the same
 * `includePlanned`, only what the arriving subgraph can change is worked out again, and `prev`
 * itself comes back when that is nothing. Anything else is extracted from the whole model.
 *
 * `opts.parentOf` is the parent index of `model`. `prev` is used up by the call: pass each result once.
 * @internal
 */
export declare function extractModelLinksKept(model: TuxMapLevelModel, opts: {
    includePlanned?: boolean;
    parentOf: Map<string, string>;
}, prev?: TuxMapLink[], added?: TuxMapLazyMergeState["added"]): TuxMapLink[];
/**
 * Dependency wire filter categories (`tti/tti-ux#118`).
 * @public
 */
export type TuxMapWireCategory = "prod" | "tests" | "ci" | "docs";
/**
 * Every `TuxMapWireCategory`, in display order.
 * @public
 */
export declare const TUX_MAP_WIRE_CATEGORIES: readonly TuxMapWireCategory[];
/**
 * Classifies a fine-grained `TuxMapLink` into `"prod" | "tests" | "ci" | "docs"` (`tti/tti-ux#118`).
 * @public
 */
export declare function classifyLinkDependencyCategory(link: TuxMapLink): TuxMapWireCategory;
/**
 * Filters `links` to those matching `categories` (`tti/tti-ux#118`). The category of each link is
 * kept against the link object: treat a link as read-only once passed, or pass a new object.
 * @public
 */
export declare function filterLinksByCategories(links: readonly TuxMapLink[], categories: ReadonlySet<TuxMapWireCategory> | Iterable<TuxMapWireCategory>): TuxMapLink[];
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
 *
 * The list of usable links is cached against the `links` array itself and reused while its length
 * is unchanged. After a change in place that keeps the length (a link replaced, or its `from` or
 * `to` rewritten), pass a new array, or `verifyInputs: true` on the next call.
 * @public
 */
export declare function liftLinksToView(links: TuxMapLink[], focusId: string, kidIds: string[], parentOf: Map<string, string>, opts?: {
    quiet?: ReadonlySet<string>;
    maxPerSide?: number;
    isKnown?: (id: string) => boolean;
    lift?: "depth" | "lca";
    splitIds?: ReadonlySet<string> | Iterable<string>;
    categories?: ReadonlySet<TuxMapWireCategory> | Iterable<TuxMapWireCategory>;
    /** Hash `links` on this call and rebuild its cached table if it was changed in place (default: false). */
    verifyInputs?: boolean;
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
 * @internal
 */
export declare function buildVendoredCopyIndex(links: readonly TuxMapLink[], elKindById?: ReadonlyMap<string, string>): {
    copyToCanonical: Map<string, string>;
    copiesByCanonical: Map<string, string[]>;
};
/**
 * Folds vendored copy cards (`from` of a `kind === "copies"` link) into their canonical source card (`to`)
 * when in view — or folds sibling copies of the same external source into a single card — attaching
 * `vendoredCopies` / `isVendoredCopy` / `vendoredFrom` metadata and deduplicating `rels` & `links` (`tti/tti-ux#121`).
 * @public
 */
export declare function foldVendoredCopies(elements: readonly TuxMapLevelElement[], rels: readonly TuxMapLevelRel[], links: readonly TuxMapLink[]): {
    elements: TuxMapLevelElement[];
    rels: TuxMapLevelRel[];
    links: TuxMapLink[];
    foldedToRepresentative: Map<string, string>;
};
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
export declare function traceSpreadingPath(fromId: string, toId: string, model: TuxMapLevelModel, opts?: {
    allowStoppingLastHop?: boolean;
}): TuxMapTraceResult;
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
    /**
     * Hash `links` and `parentOf` on this call and rebuild their cached lookup tables if either was
     * changed in place (default: false). Without it the tables are reused for as long as the same
     * array and the same map come back with the same length and size, so only a change in place that
     * keeps the count needs this: a link replaced or re-pointed, a child moved to another parent.
     * It costs a pass over both inputs on every call that sets it.
     */
    verifyInputs?: boolean;
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
 *
 * The lookup tables behind the walk are cached against the `links` array and the `parentOf` map
 * themselves, and reused while their length and size are unchanged, so a repeat call does not read
 * either of them whole. Treat both as read-only once passed. Growing or shrinking one in place is
 * seen; after a change in place that keeps the count (a link replaced or its `from` or `to`
 * rewritten, a child given another parent) pass a new array or map, or `verifyInputs: true` on the
 * next call.
 * @public
 */
export declare function computeLinkBlastRadius(links: TuxMapLink[], seedOrSeeds: string | Iterable<string>, parentOf: Map<string, string>, opts?: TuxMapBlastOptions): TuxMapBlastResult;
/**
 * How an element changed between two models.
 * @public
 */
export type TuxMapElementChangeKind = "added" | "deleted" | "moved" | "sig-changed" | "body-patched";
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
/**
 * Computes a deterministic structural delta between two `TuxMapLevelModel` trees (`baseModel` vs `headModel`),
 * classifying node changes (`added`, `deleted`, `moved`, `sig-changed`, `body-patched`), wire changes
 * (`added`, `removed`, `dangling`), leaf-first `blastSeedIds`, `recommendedIntent`, and a visual `mergedModel`.
 * @public
 */
export declare function computeGraphDelta(baseModel: TuxMapLevelModel, headModel: TuxMapLevelModel, opts?: TuxMapGraphDeltaOptions): TuxMapGraphDelta;
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
 * The result carries `schema: TUX_MAP_SCHEMA` (`"tux-map/1"`) whichever of the three it was given
 * (`tti/tti-ux#162`). The site document's numeric `schema: 2` is that document's own field and is not copied.
 * One exception: a level model that already names a different schema keeps that name (at run time the field is
 * then outside its declared type), so `validateMapModel` on the result still reports `unknown-schema`.
 *
 * Rejects non-object payloads, `code-map.json` placement rule files, and (when `allowEmpty === false`)
 * zero-node models with a concise `< 2 KB` diagnostic error (`N-01`, `S-13`).
 * @public
 */
export declare function normalizeArchitectureModelInput(raw: unknown, opts?: {
    allowEmpty?: boolean;
}): TuxMapLevelModel;
/**
 * Minimal zero-sample fallback model (`tti/tti-ux#114`).
 * @public
 */
export declare const EMPTY_TTI_LEVEL_MODEL: TuxMapNormalizedModel;
/**
 * Memoized `O(V + E)` query index per `TuxMapLevelModel` instance so repeated
 * layer, blast-radius, shortest-path, and lease queries do not rebuild graph tables.
 * @internal
 */
export declare function getMapQueryIndex(model?: TuxMapLevelModel): TuxMapQueryIndex;
/**
 * Indexes a `TuxMapLevelModel` into a unified Code Property Graph (CPG) index
 * spanning Levels 1..N (Context, Containers, Components, Deployment, Modules, Schemas, AST Symbols).
 * @public
 */
export declare function buildUnifiedArchitectureGraph(model?: TuxMapLevelModel): {
    nodes: Map<string, TuxMapGraphNodeRecord>;
    edges: TuxMapGraphEdgeRecord[];
};
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
/**
 * Ranks up to `maxSuggestions` (capped at 10) close node IDs by prefix, substring, or token overlap.
 * @internal
 */
export declare function suggestCloseNodeIds(unknownId: string, nodes: ReadonlyMap<string, TuxMapGraphNodeRecord>, maxSuggestions?: number): string[];
/**
 * Queries nodes (and optional matching edges) at a semantic level, parent subgraph, kind, or text filter,
 * supporting compact summaries and `limit`/`offset` pagination (`tti/tti-ux#111`).
 * @public
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
 * @public
 */
export declare function queryArchitectureImpact(seedIds: string | Iterable<string>, model?: TuxMapLevelModel, opts?: TuxMapImpactQueryOptions): TuxMapImpactQueryResult | TuxMapUnknownNodeError;
/**
 * Finds the shortest directed architectural dependency path between `fromNodeId` and `toNodeId`,
 * descending into code/components below `fromNodeId` when needed without climbing `child -> parent`
 * or shortcutting through unsuppressed coarse C4 summary edges (`tti/tti-ux#111`, `F-05`, `N-03`, `S-11`).
 *
 * Pass `{ direction: "upstream" }` to follow reverse dependency edges (`to -> from`).
 * @public
 */
export declare function findArchitecturePath(fromNodeId: string, toNodeId: string, model?: TuxMapLevelModel, opts?: TuxMapPathQueryOptions): TuxMapPathQueryResult | TuxMapUnknownNodeError;
/**
 * Queries a specific semantic level or parent subgraph from a `TuxMapLevelModel`.
 *
 * @deprecated Use `queryArchitectureNodes` instead.
 * @public
 */
export declare function queryArchitectureLayer(model?: TuxMapLevelModel, opts?: {
    level?: number;
    focusId?: string;
    includePlanned?: boolean;
}): {
    level: number | "all";
    focusId: string;
    nodeCount: number;
    edgeCount: number;
    nodes: TuxMapGraphNodeRecord[];
    edges: TuxMapGraphEdgeRecord[];
};
/**
 * Computes multi-level k-hop upstream/downstream blast radius and impacted source files
 * for any node ID across Levels 1..N.
 *
 * @deprecated Use `queryArchitectureImpact` instead.
 * @public
 */
export declare function queryMultiLevelBlastRadius(nodeId: string, model?: TuxMapLevelModel, maxHopsOrOpts?: number | TuxMapBlastOptions): {
    error: string;
    unknownIds: string[];
    suggestions: string[];
    availableNodeIds: string[];
    rootNode?: undefined;
    maxHops?: undefined;
    truncated?: undefined;
    descendantIds?: undefined;
    upstreamDependents?: undefined;
    downstreamDependencies?: undefined;
    blockers?: undefined;
    coCutCandidates?: undefined;
    testsToRun?: undefined;
    stampsToRebuild?: undefined;
    buildExecImpacted?: undefined;
    hostsImpacted?: undefined;
    impactedEdgeIds?: undefined;
    impactedSourceFiles?: undefined;
} | {
    rootNode: TuxMapGraphNodeRecord;
    maxHops: number;
    truncated: boolean;
    descendantIds: string[];
    upstreamDependents: {
        id: string;
        hop: number;
        via: TuxMapLink;
        at: string;
        sites: number[];
        node: TuxMapGraphNodeRecord;
    }[];
    downstreamDependencies: {
        id: string;
        hop: number;
        node: TuxMapGraphNodeRecord;
    }[];
    blockers: string[];
    coCutCandidates: string[];
    testsToRun: string[];
    stampsToRebuild: string[];
    buildExecImpacted: string[];
    hostsImpacted: string[];
    impactedEdgeIds: string[];
    impactedSourceFiles: TuxMapSourceRef[];
    error?: undefined;
    unknownIds?: undefined;
    suggestions?: undefined;
    availableNodeIds?: undefined;
};
/**
 * Finds a path between `fromNodeId` and `toNodeId` across Levels 1..N.
 *
 * @deprecated Use `findArchitecturePath` instead.
 * @public
 */
export declare function findShortestArchitecturePath(fromNodeId: string, toNodeId: string, model?: TuxMapLevelModel): {
    error: string;
    unknownIds: string[];
    suggestions: string[];
    found?: undefined;
    hops?: undefined;
    nodePath?: undefined;
    edges?: undefined;
} | {
    found: boolean;
    hops: number;
    nodePath: TuxMapGraphNodeRecord[];
    edges: TuxMapGraphEdgeRecord[];
    error?: undefined;
    unknownIds?: undefined;
    suggestions?: undefined;
};
/**
 * ACP (Agent Communication Protocol) Subgraph Lease Coordinator.
 *
 * @deprecated In-process ACP subgraph leases do not coordinate across processes; scope changes with
 * `computeGraphDelta` and `queryArchitectureImpact` instead.
 * @public
 */
export declare function coordinateAcpSubgraphLease(action: "acquire" | "release" | "list", opts?: {
    agentId?: string;
    rootNodeId?: string;
    leaseId?: string;
    ttlSeconds?: number;
    model?: TuxMapLevelModel;
}): {
    activeLeaseCount: number;
    leases: TuxMapAcpLease[];
    released?: undefined;
    acquired?: undefined;
    error?: undefined;
    suggestions?: undefined;
    conflict?: undefined;
    lease?: undefined;
} | {
    released: boolean;
    activeLeaseCount: number;
    leases: TuxMapAcpLease[];
    acquired?: undefined;
    error?: undefined;
    suggestions?: undefined;
    conflict?: undefined;
    lease?: undefined;
} | {
    acquired: boolean;
    error: string;
    activeLeaseCount?: undefined;
    leases?: undefined;
    released?: undefined;
    suggestions?: undefined;
    conflict?: undefined;
    lease?: undefined;
} | {
    acquired: boolean;
    error: string;
    suggestions: string[];
    activeLeaseCount?: undefined;
    leases?: undefined;
    released?: undefined;
    conflict?: undefined;
    lease?: undefined;
} | {
    acquired: boolean;
    conflict: {
        heldByAgent: string;
        leaseId: string;
        rootNodeId: string;
        overlappingNodes: string[];
        overlappingFiles: string[];
    };
    activeLeaseCount?: undefined;
    leases?: undefined;
    released?: undefined;
    error?: undefined;
    suggestions?: undefined;
    lease?: undefined;
} | {
    acquired: boolean;
    lease: TuxMapAcpLease;
    activeLeaseCount: number;
    leases?: undefined;
    released?: undefined;
    error?: undefined;
    suggestions?: undefined;
    conflict?: undefined;
};
/**
 * Result groups of the Go-To search, in display order.
 * @public
 */
export declare const TUX_MAP_SEARCH_GROUPS: readonly ["Components", "Folders", "Files", "Functions", "Routes"];
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
    /**
     * Target node ID to reveal on Enter. For an HTTP route it is the handler when the model holds it;
     * while it does not (a subgraph not loaded yet), the route's own element, or else the handler's file.
     */
    revealId: string;
    group: TuxMapSearchGroup;
    /** The level that shows `revealId`. */
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
/**
 * Builds (and WeakMap-caches) the unified Go-To search index across Levels 1–4,
 * all fractal subgraphs, `route` elements, `handled-by` links, and `model.routes` (`tti/tti-ux#120`).
 * @public
 */
export declare function buildMapSearchIndex(model?: TuxMapLevelModel): TuxMapSearchEntry[];
/**
 * `buildMapSearchIndex(model)`, kept so the next call can build on it (`tti/tti-ux#157`). It neither
 * reads nor fills that function's cache.
 *
 * `prev` is the array this function returned last time and `added` what the model gained since
 * (`TuxMapLazyMergeState.added`): when `prev` was built for `added.from`, the entries of the
 * arriving subgraph are added to it, when no entry already there can change. Anything else is
 * built from the whole model.
 *
 * `parentOf` is the parent index of `model`. `prev` is used up by the call: pass each result once.
 * @internal
 */
export declare function buildMapSearchIndexKept(model: TuxMapLevelModel, parentOf: Map<string, string>, prev?: TuxMapSearchEntry[], added?: TuxMapLazyMergeState["added"]): TuxMapSearchEntry[];
/**
 * Searches across Components, Folders, Files, Functions, and Routes in `< 1 ms` over 2,400+ entries.
 * Groups are ordered by top hit score when `query` is non-empty so `Enter` jumps directly to the #1 match.
 * @public
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
