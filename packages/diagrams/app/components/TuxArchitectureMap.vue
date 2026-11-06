<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import {
  EMPTY_TTI_LEVEL_MODEL,
  GRID_METRICS,
  TUX_MAP_ELEMENT_KIND_LABELS,
  TUX_MAP_LINK_KIND_LABELS,
  TUX_MAP_QUIET_LINK_KINDS,
  buildLevelModelFromLegacyNodes,
  buildMapParentIndex,
  buildMapSearchIndex,
  cmpCodepoint,
  compareBlastLinks,
  computeLinkBlastRadius,
  extractModelLinks,
  hasOwn,
  levelForFocus as computeLevelForFocus,
  liftLinksToView,
  liftToSet,
  mapAncestorsOf,
  getLaserPointerSvgPath,
  getSmoothedFreehandSvgPath,
  gridCellToPx,
  routeDeploymentWires,
  routeGridWires,
  searchArchitectureMap,
  type TuxMapBlastIntent,
  type TuxMapCollaborator,
  type TuxMapDeploymentNode,
  type TuxMapDeploymentZone,
  type TuxMapDiffInfo,
  type TuxMapEdge,
  type TuxMapElementKind,
  type TuxMapGridCellRect,
  type TuxMapInkStroke,
  type TuxMapLevelElement,
  type TuxMapLevelModel,
  type TuxMapLevelNumber,
  type TuxMapLevelRel,
  type TuxMapLink,
  type TuxMapLoDLevel,
  type TuxMapNode,
  type TuxMapPlacedBoundary,
  type TuxMapSearchEntry,
  type TuxMapSearchGroupResult,
  type TuxMapSearchHit,
  type TuxMapSourceRef,
  type TuxMapStickyNote,
  type TuxMapStrokePoint,
  type TuxMapSubgraph,
  type TuxMapTool,
  type TuxMapZone,
} from "../utils/tuxArchitectureMap";

export type TuxMapViewMode = "diagram" | "list";

export interface TuxArchitectureMapProps {
  /** Optional 4-Level + N-Depth C4 model (Level 1 -> Level 2 -> Level 3 -> Level 4 -> Level 5+). Defaults to EMPTY_TTI_LEVEL_MODEL if neither `model` nor `nodes` is provided. */
  model?: TuxMapLevelModel;
  /** Controlled or initial level (1, 2, 3, 4, 5...) */
  level?: TuxMapLevelNumber;
  /** Initial level (1, 2, 3, 4, 5...) */
  initialLevel?: TuxMapLevelNumber;
  /** Controlled focused container/node ID when at Level 3 or Level 5+ (`v-model:focus`) */
  focus?: string | null;
  /** Initial focused container/node ID when starting at Level 3 or Level 5+ */
  initialFocus?: string | null;
  /** Controlled selected element ID (`v-model:selectedId`) */
  selectedId?: string | null;
  /** Initial selected element ID */
  initialSelectedId?: string | null;
  /** Controlled planned visibility toggle (`v-model:showPlanned`) */
  showPlanned?: boolean;
  /** Whether to show planned elements and links initially */
  initialShowPlanned?: boolean;
  /** Controlled PR Blast-Radius / Diff overlay toggle (`v-model:showBlastRadius`) */
  showBlastRadius?: boolean;
  /** Whether to show PR Blast-Radius / Diff overlay initially */
  initialShowBlastRadius?: boolean;
  /** Controlled semantic intent for Blast-Radius traversal (`v-model:blastIntent`) */
  blastIntent?: TuxMapBlastIntent;
  /** Initial semantic intent for Blast-Radius traversal (`"default"` by default) */
  initialBlastIntent?: TuxMapBlastIntent;
  /** Optional explicit seed node IDs for PR/branch Blast-Radius mode (e.g. `delta.blastSeedIds`) */
  blastSeeds?: string[];
  /** Controlled view mode (`v-model:view`) */
  view?: TuxMapViewMode;
  /** Initial view mode (`"diagram"`, `"list"`, or `"auto"` which opens `"list"` below `autoListBreakpoint`) */
  initialView?: TuxMapViewMode | "auto";
  /** Viewport width breakpoint (in px) below which `initialView="auto"` starts in `"list"` view */
  autoListBreakpoint?: number;
  /** Whether plain mouse wheel over the diagram zooms across levels without requiring Ctrl/Cmd (`true` by default; set `false` to require Ctrl/Cmd + wheel) */
  wheelZoom?: boolean;
  /** Legacy nodes prop (automatically converted into a 4-level model if `model` is omitted) */
  nodes?: TuxMapNode[];
  /** Legacy edges prop */
  edges?: TuxMapEdge[];
  /** Legacy zones prop */
  zones?: TuxMapZone[];
  /** Optional eyebrow label above the map header */
  eyebrow?: string;
  /** Optional map title */
  title?: string;
  /** Optional caption below the map */
  caption?: string;
  /** Accessible label for the diagram region */
  ariaLabel?: string;
  /** Optional minimum viewport height */
  height?: string;
  /** Legacy LoD override prop for compatibility */
  lodMode?: "auto" | TuxMapLoDLevel;
  /** Initial zoom scale compatibility prop */
  initialZoom?: number;
  /** Multi-user remote collaborator cursors */
  collaborators?: TuxMapCollaborator[];
  /** Freehand ink strokes */
  strokes?: TuxMapInkStroke[];
  /** Sticky callout notes */
  notes?: TuxMapStickyNote[];
  /** Default ink color */
  penColor?: string;
  /** Show radar minimap */
  showMinimap?: boolean;
}

const props = withDefaults(defineProps<TuxArchitectureMapProps>(), {
  model: undefined,
  level: undefined,
  initialLevel: 2,
  focus: undefined,
  initialFocus: "c-api",
  selectedId: undefined,
  initialSelectedId: null,
  showPlanned: undefined,
  initialShowPlanned: false,
  showBlastRadius: undefined,
  initialShowBlastRadius: false,
  blastIntent: undefined,
  initialBlastIntent: "default",
  blastSeeds: undefined,
  view: undefined,
  initialView: "diagram",
  autoListBreakpoint: 760,
  wheelZoom: true,
  nodes: () => [],
  edges: () => [],
  zones: () => [],
  eyebrow: "TUX · MULTI-LEVEL ARCHITECTURE MAP (M.A.P.)",
  title: "Master Architecture Plan",
  caption: "",
  ariaLabel: "Interactive multi-level architecture map",
  height: "auto",
  lodMode: "auto",
  initialZoom: 1,
  collaborators: () => [],
  strokes: () => [],
  notes: () => [],
  penColor: "#5C0025",
  showMinimap: false,
});

const emit = defineEmits<{
  (e: "update:level", level: TuxMapLevelNumber): void;
  (e: "update:focus", focusId: string | null): void;
  (e: "update:selectedId", selectedId: string | null): void;
  (e: "update:showPlanned", showPlanned: boolean): void;
  (e: "update:showBlastRadius", showBlastRadius: boolean): void;
  (e: "update:blastIntent", blastIntent: TuxMapBlastIntent): void;
  (e: "update:view", view: TuxMapViewMode): void;
  (e: "update:lodMode", mode: "auto" | TuxMapLoDLevel): void;
  (e: "node-select", item: TuxMapLevelElement | TuxMapDeploymentNode | TuxMapNode | null): void;
  (e: "drill-down", payload: { level: number; focusId: string; subgraph: TuxMapSubgraph | null }): void;
  (e: "update:strokes", strokes: TuxMapInkStroke[]): void;
  (e: "update:notes", notes: TuxMapStickyNote[]): void;
  (e: "cursor-move", payload: { x: number; y: number; tool: TuxMapTool }): void;
  (e: "laser-move", points: TuxMapStrokePoint[]): void;
}>();

const instanceId = useId();
const arrowMarkerId = `tux-map-arrow-${instanceId}`;
const goToListboxId = `tux-map-goto-listbox-${instanceId}`;

// ============================================================================
// 1. RESOLVED 4-LEVEL + FRACTAL N-DEPTH MODEL & LOOKUP MAPS
// ============================================================================

const activeModel = computed<TuxMapLevelModel>(() => {
  if (props.model) return props.model;
  if (props.nodes && props.nodes.length > 0) {
    return buildLevelModelFromLegacyNodes(props.nodes, props.edges, props.zones);
  }
  return EMPTY_TTI_LEVEL_MODEL;
});

function resolveInitialIsListView(): boolean {
  // "auto" starts as the diagram on the server and in the browser alike, and switches after mount
  // (#106): deciding from window.innerWidth during setup rendered the diagram on the server and the
  // list in a phone's browser, a hydration mismatch Vue leaves unrepaired in production
  return (props.view ?? props.initialView) === "list";
}

function applyAutoListView() {
  const mode = props.view ?? props.initialView;
  if (mode !== "list" && mode !== "diagram" && typeof window !== "undefined") {
    isListView.value = window.innerWidth < (props.autoListBreakpoint || 760);
  }
}

const currentLevel = ref<TuxMapLevelNumber>(props.level ?? props.initialLevel);
const focusId = ref<string | null>(props.focus !== undefined ? props.focus : props.initialFocus);
const drillStack = ref<{ level: number; focusId: string }[]>([]);
const selectedId = ref<string | null>(
  props.selectedId !== undefined ? props.selectedId : props.initialSelectedId,
);
const showPlanned = ref<boolean>(
  props.showPlanned !== undefined ? props.showPlanned : props.initialShowPlanned,
);
const showBlastRadius = ref<boolean>(
  props.showBlastRadius !== undefined ? props.showBlastRadius : props.initialShowBlastRadius,
);
const blastIntent = ref<TuxMapBlastIntent>(
  props.blastIntent !== undefined ? props.blastIntent : props.initialBlastIntent,
);
const isListView = ref<boolean>(resolveInitialIsListView());
const searchQuery = ref<string>("");
const liveAnnouncement = ref<string>("");

// A live region reads a change, and the same message twice is no change: clear it,
// then set it a moment later, so a key pressed again is answered again
let announceTimer: ReturnType<typeof setTimeout> | null = null;
function announce(msg: string) {
  liveAnnouncement.value = "";
  if (announceTimer) clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    liveAnnouncement.value = msg;
    announceTimer = null;
  }, 100);
}

// Sync controlled props when updated by parent
watch(
  () => props.level,
  (lvl) => {
    if (lvl !== undefined && lvl !== currentLevel.value) {
      currentLevel.value = lvl;
    }
  },
);
watch(
  () => props.focus,
  (f) => {
    if (f !== undefined && f !== focusId.value) {
      focusId.value = f;
      // a parent moved the focus: the stack zooming in would have built, so zooming out works
      drillStack.value = currentLevel.value >= 5 && f ? drillStackFor(f) : [];
    }
  },
);
watch(
  () => props.selectedId,
  (sel) => {
    if (sel !== undefined && sel !== selectedId.value) {
      selectedId.value = sel;
    }
  },
);
watch(
  () => props.showPlanned,
  (sp) => {
    if (sp !== undefined && sp !== showPlanned.value) {
      showPlanned.value = sp;
    }
  },
);
watch(
  () => props.showBlastRadius,
  (br) => {
    if (br !== undefined && br !== showBlastRadius.value) {
      showBlastRadius.value = br;
    }
  },
);
watch(
  () => props.blastIntent,
  (bi) => {
    if (bi !== undefined && bi !== blastIntent.value) {
      blastIntent.value = bi;
    }
  },
);
watch(
  () => props.view,
  (v) => {
    if (v !== undefined) {
      const wantList = v === "list";
      if (wantList !== isListView.value) {
        isListView.value = wantList;
      }
    }
  },
);

// Emit v-model updates when internal state changes
watch(focusId, (f) => {
  emit("update:focus", f);
});
watch(showPlanned, (sp) => {
  emit("update:showPlanned", sp);
});
watch(showBlastRadius, (br) => {
  emit("update:showBlastRadius", br);
});
watch(blastIntent, (bi) => {
  emit("update:blastIntent", bi);
});
watch(isListView, (lv) => {
  emit("update:view", lv ? "list" : "diagram");
});

// Sync legacy `lodMode` prop if changed externally
watch(
  () => props.lodMode,
  (mode) => {
    if (mode === "executive") currentLevel.value = 1;
    else if (mode === "resources") currentLevel.value = 2;
    else if (mode === "packages") {
      if (!focusId.value) {
        const firstZoomable = activeModel.value.level2.elements.find(
          (e) => !e.ref && (activeModel.value.level3[e.id]?.length ?? 0) > 0,
        );
        focusId.value = firstZoomable?.id ?? null;
      }
      if (focusId.value) currentLevel.value = 3;
    }
  },
);

function getSubgraphForNode(nodeId: string | null | undefined): TuxMapSubgraph | null {
  if (!nodeId) return null;
  const M = activeModel.value;
  if (hasOwn(M.subgraphs, nodeId) && M.subgraphs![nodeId]!.elements.length > 0) {
    return M.subgraphs![nodeId]!;
  }
  const el = hasOwn(byId.value, nodeId) ? byId.value[nodeId] : undefined;
  if (
    el?.subgraphRef &&
    hasOwn(M.subgraphs, el.subgraphRef) &&
    M.subgraphs![el.subgraphRef]!.elements.length
  ) {
    return M.subgraphs![el.subgraphRef]!;
  }
  if (el?.children?.length) {
    return {
      stratum: `Internal Modules (${el.name})`,
      elements: el.children,
      rels: el.childRels,
    };
  }
  const dn = hasOwn(resById.value, nodeId) ? resById.value[nodeId] : undefined;
  if (
    dn?.subgraphRef &&
    hasOwn(M.subgraphs, dn.subgraphRef) &&
    M.subgraphs![dn.subgraphRef]!.elements.length
  ) {
    return M.subgraphs![dn.subgraphRef]!;
  }
  if (dn?.children?.length) {
    return {
      stratum: `Internal Modules (${dn.title})`,
      elements: dn.children,
      rels: dn.childRels,
    };
  }
  return null;
}

const byId = computed<Record<string, TuxMapLevelElement>>(() => {
  const map: Record<string, TuxMapLevelElement> = Object.create(null);
  const indexChildren = (parentId: string, kids: TuxMapLevelElement[], depth = 0) => {
    if (depth >= 64) return;
    kids.forEach((k, i) => {
      const id = k.id || `${parentId}/${i}`;
      map[id] = { ...k, id, kind: k.kind ?? "component", parent: parentId };
      if (k.children?.length) {
        indexChildren(id, k.children, depth + 1);
      }
    });
  };

  for (const e of activeModel.value.level1.elements) {
    map[e.id] = e;
    if (e.children?.length) indexChildren(e.id, e.children);
  }
  for (const e of activeModel.value.level2.elements) {
    if (e.ref && map[e.id]) {
      map[e.id] = { ...map[e.id]!, ...e };
    } else {
      // a reference whose Level 1 element is missing is still named
      map[e.id] = { ...e, name: e.name ?? e.id };
    }
    if (e.children?.length) indexChildren(e.id, e.children);
  }
  for (const [parentId, kids] of Object.entries(activeModel.value.level3)) {
    indexChildren(parentId, kids);
  }
  for (const n of activeModel.value.level4.nodes) {
    if (n.children?.length) indexChildren(n.id, n.children);
  }
  if (activeModel.value.subgraphs) {
    for (const [parentId, sg] of Object.entries(activeModel.value.subgraphs)) {
      indexChildren(parentId, sg.elements);
    }
  }
  return map;
});

const resById = computed<Record<string, TuxMapDeploymentNode>>(() => {
  const map: Record<string, TuxMapDeploymentNode> = Object.create(null);
  for (const n of activeModel.value.level4.nodes) {
    map[n.id] = n;
  }
  return map;
});

// child → parent below Level 2 (components, subgraph elements, inline children): what code links
// are lifted through, and how a part far from the current view is reached (revealElement)
const parentOf = computed(() => buildMapParentIndex(activeModel.value));

/** The level that shows the children of `fid`: 3 inside a container, 5 inside a component or
 *  deployment node, one more for each subgraph below that. */
function levelForFocus(fid: string): number {
  return computeLevelForFocus(fid, activeModel.value, parentOf.value);
}

/** The drill stack a person builds zooming in step by step to the children of `fid`. */
function drillStackFor(fid: string): { level: number; focusId: string }[] {
  return mapAncestorsOf(fid, parentOf.value)
    .slice(1)
    .reverse()
    .map((a) => ({ level: levelForFocus(a), focusId: a }))
    .filter((e) => e.level >= 3);
}

// opened below Level 4 (a deep link): the stack zooming in would have built, so zooming out works
if (currentLevel.value >= 5 && focusId.value) drillStack.value = drillStackFor(focusId.value);

// The deepest level this model really has: each element with something inside opens at
// levelForFocus(id), so the count follows the nesting, not how the subgraphs are named.
// Its own computed: it walks every element once per model, not on every level change.
const modelDepth = computed<number>(() => {
  let max = 4;
  for (const id of [...Object.keys(byId.value), ...Object.keys(resById.value)]) {
    if (hasFractalSubgraph(id)) max = Math.max(max, Math.max(5, levelForFocus(id)));
  }
  return max;
});

const maxAvailableLevel = computed<number>(() => Math.max(modelDepth.value, currentLevel.value));

// Ensure focusId is always valid for the active model
watch(
  activeModel,
  (m) => {
    if (
      !focusId.value ||
      (!hasOwn(m.level3, focusId.value) && !hasOwn(m.subgraphs, focusId.value))
    ) {
      const firstContainer = m.level2.elements.find(
        (e) => !e.ref && (hasOwn(m.level3, e.id) ? (m.level3[e.id]?.length ?? 0) : 0) > 0,
      );
      focusId.value = firstContainer?.id ?? null;
    }
  },
  { immediate: true },
);

// ============================================================================
// 2. LEVEL VIEW COMPUTATION (LEVEL 1..N) & RIGHT-ANGLE WIRE ROUTING
// ============================================================================

const TYPE_LABELS: Record<string, string> = {
  ...TUX_MAP_ELEMENT_KIND_LABELS,
};

const STATE_LABELS: Record<string, [string, string]> = {
  running: ["ok", "Running"],
  active: ["ok", "Running"],
  present: ["ok", "Installed"],
  success: ["ok", "Last run fine"],
  inactive: ["warn", "Off"],
  "declared-not-installed": ["warn", "Not installed"],
  failed: ["bad", "Failed"],
  unknown: ["", "State unknown"],
};

function isShownStatus(status?: string): boolean {
  return showPlanned.value || status !== "planned";
}

function hasFractalSubgraph(id: string): boolean {
  const M = activeModel.value;
  if (hasOwn(M.subgraphs, id) && M.subgraphs![id]!.elements.length > 0) return true;
  const el = byId.value[id];
  if (el && (el.children?.length || el.subgraphRef)) return true;
  const dn = resById.value[id];
  if (dn && (dn.children?.length || dn.subgraphRef)) return true;
  return false;
}

function canZoomElement(e: TuxMapLevelElement): boolean {
  if (hasFractalSubgraph(e.id)) return true;
  if (currentLevel.value === 1) return e.zoom === 2 || e.kind === "system";
  if (currentLevel.value === 2) {
    return !e.ref && (activeModel.value.level3[e.id]?.length ?? 0) > 0;
  }
  if (currentLevel.value === 3) {
    return !e.mini && activeModel.value.level4.nodes.length > 0;
  }
  // Below Level 4 only something inside opens (the subgraph check above): a card that is
  // merely deployed somewhere has no level inside it, and its '+' led nowhere
  return false;
}

function canZoomDeployNode(n: TuxMapDeploymentNode): boolean {
  return hasFractalSubgraph(n.id);
}

function formatLiveState(e: TuxMapLevelElement): [string, string] | null {
  const L = e.live;
  if (!L) return null;
  if (L.total && L.total > 1) {
    return [(STATE_LABELS[L.state ?? "running"] || [""])[0], `${L.running ?? L.total}/${L.total} running`];
  }
  if (L.last_run && L.last_run.result) {
    return [L.last_run.result === "failed" ? "bad" : "ok", `Last run ${L.last_run.result}`];
  }
  if (L.state) {
    return STATE_LABELS[L.state] || ["", L.state];
  }
  return null;
}

function getCardChip(e: TuxMapLevelElement): [string, string] | null {
  const up = e.live && (e.live.updates || (e.live.update ? 1 : 0));
  if (e.status === "planned") return ["planned", "Planned"];
  if (e.status === "paused") return ["paused", "Paused"];
  if (up) return ["upd", up > 1 ? `${up} updates` : "Update"];
  return null;
}

interface ComputedStageData {
  els: TuxMapLevelElement[];
  deployNodes: TuxMapDeploymentNode[];
  rels: TuxMapLevelRel[];
  bounds: TuxMapPlacedBoundary[];
  rects: Record<string, TuxMapGridCellRect>;
  outsideLinkCounts: Record<string, number>;
  moreOutside: number;
  width: number;
  height: number;
}

const stageData = computed<ComputedStageData>(() => {
  const { CW, CH, GX, GY, PAD, MH, NW, NH } = GRID_METRICS;
  const M = activeModel.value;
  const lookup = byId.value;

  if (currentLevel.value === 4) {
    const nodes = M.level4.nodes.filter((n) => showPlanned.value || n.status !== "planned");
    const rects: Record<string, TuxMapGridCellRect> = {};
    const bounds: TuxMapPlacedBoundary[] = [];
    const top = PAD + 6;

    function placeList(list: TuxMapDeploymentNode[], bx: number, by: number, cols: number) {
      list.forEach((n, i) => {
        const nx = bx + (i % cols) * (NW + 16);
        const ny = by + Math.floor(i / cols) * (NH + 14);
        rects[n.id] = { x: nx, y: ny, w: NW, h: NH };
      });
    }

    function placeColumn(
      regions: { title: string; zones: string[]; planned?: boolean }[],
      x: number,
    ): number {
      let y = top;
      for (const r of regions) {
        const list = nodes.filter((n) => n.zone && r.zones.includes(n.zone));
        if (!list.length) continue;
        const h = list.length * (NH + 14) - 14 + 50;
        bounds.push({
          label: r.title,
          cls: `region${r.planned ? " planned" : ""}`,
          x: x - 14,
          y,
          w: NW + 28,
          h,
        });
        placeList(list, x, y + 34, 1);
        y += h + 22;
      }
      return y;
    }

    const customZones: TuxMapDeploymentZone[] | undefined = M.level4.zones;
    const defaultLeftRegions: { title: string; zones: string[]; planned?: boolean }[] = [
      { title: "Users & clients", zones: ["people"] },
      { title: "Identity & SSO", zones: ["entra", "identity"] },
    ];
    const defaultRightRegions: { title: string; zones: string[]; planned?: boolean }[] = [
      { title: "External & monitoring", zones: ["outside"] },
      { title: "On-Premises Cluster", zones: ["azure-local", "on-prem"], planned: true },
      { title: "Dedicated Build Enclave", zones: ["campus", "build-enclave"], planned: true },
      { title: "Isolated Enclaves (Planned)", zones: ["planned-only", "quarantine"], planned: true },
    ];

    const leftRegions = customZones
      ? customZones
          .filter(
            (z) =>
              z.column === "left" ||
              (!z.column && ["people", "entra", "identity"].includes(z.id)),
          )
          .map((z) => ({
            title: z.title,
            zones: z.zones?.length ? [z.id, ...z.zones] : [z.id],
            planned: z.planned,
          }))
      : defaultLeftRegions;

    const rightRegions = customZones
      ? customZones
          .filter(
            (z) =>
              z.column === "right" ||
              (!z.column &&
                z.column !== "center" &&
                !["people", "entra", "identity"].includes(z.id)),
          )
          .map((z) => ({
            title: z.title,
            zones: z.zones?.length ? [z.id, ...z.zones] : [z.id],
            planned: z.planned,
          }))
      : defaultRightRegions;

    const centerRegionTitle =
      M.level4.centerTitle ||
      customZones?.find((z) => z.column === "center")?.title ||
      "Cloud Region · Resource Groups";

    const leftEnd = placeColumn(leftRegions, PAD + 14);

    const gx0 = PAD + NW + 80;
    const GW = 2 * NW + 16 + 28;
    const gcol: [number, number] = [0, 0];
    const inner: {
      g: { id: string; title: string };
      list: TuxMapDeploymentNode[];
      x: number;
      y: number;
      h: number;
      cols: number;
    }[] = [];

    for (const g of M.level4.groups) {
      const list = nodes.filter((n) => n.group === g.id);
      if (!list.length) continue;
      const k = gcol[0] <= gcol[1] ? 0 : 1;
      const cols = list.length > 1 ? 2 : 1;
      const h = Math.ceil(list.length / cols) * (NH + 14) - 14 + 50;
      inner.push({
        g,
        list,
        x: gx0 + 14 + k * (GW + 16),
        y: top + 40 + gcol[k],
        h,
        cols,
      });
      gcol[k] += h + 16;
    }

    const azH = Math.max(gcol[0], gcol[1]) + 50;
    const azW = 2 * GW + 16 + 28;
    bounds.push({
      label: centerRegionTitle,
      cls: "region",
      x: gx0,
      y: top,
      w: azW,
      h: azH,
    });

    for (const it of inner) {
      bounds.push({
        label: it.g.title,
        cls: "",
        x: it.x,
        y: it.y,
        w: GW,
        h: it.h,
      });
      placeList(it.list, it.x + 14, it.y + 34, it.cols);
    }

    const rx = gx0 + azW + 60;
    const rightEnd = placeColumn(rightRegions, rx);

    const W = rx + NW + PAD;
    const H = Math.max(leftEnd, top + azH, rightEnd) + PAD;
    return {
      els: [],
      deployNodes: nodes,
      rels: [],
      bounds,
      rects,
      outsideLinkCounts: {},
      moreOutside: 0,
      width: W,
      height: H,
    };
  }

  // Levels 1, 2, or 3
  let rawEls: TuxMapLevelElement[] = [];
  let rawRels: TuxMapLevelRel[] = [];
  let stageMoreOutside = 0;
  const codeEdgeCounts: Record<string, number> = Object.create(null);
  const rawBounds: {
    id?: string;
    label: string;
    type: string;
    of: string[];
    box?: { x: number; y: number; w: number; h: number };
  }[] = [];

  if (currentLevel.value === 1) {
    rawEls = M.level1.elements;
    rawRels = M.level1.rels;
  } else if (currentLevel.value === 2) {
    rawEls = M.level2.elements.map((e) =>
      e.ref && lookup[e.id] ? { ...lookup[e.id]!, ...e } : { ...e, name: e.name ?? e.id },
    );
    rawRels = M.level2.rels;
    const boundTarget = lookup[M.level2.boundary];
    rawBounds.push({
      label: boundTarget ? boundTarget.name : "Primary System",
      type: "Software system",
      of: rawEls.filter((e) => !e.ref).map((e) => e.id),
    });
  } else if (currentLevel.value === 3 || currentLevel.value >= 5) {
    const sg = currentLevel.value >= 5 ? getSubgraphForNode(focusId.value) : null;
    const fId =
      currentLevel.value >= 5
        ? focusId.value || Object.keys(M.subgraphs || {})[0] || "c-api"
        : focusId.value && M.level3[focusId.value]
          ? focusId.value
          : Object.keys(M.level3)[0] || "c-api";

    const parentEl = lookup[fId];
    const parentDn = resById.value[fId];
    const cName = parentEl?.name || parentDn?.title || fId;
    const cKind = parentEl?.kind || parentDn?.kind || "container";
    const cTech = parentEl?.tech || parentDn?.facts?.type || "";

    const kids = sg ? sg.elements : M.level3[fId] || [];
    const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(kids.length * 1.6))));
    const rows = Math.max(1, Math.ceil(kids.length / cols));
    const ins: string[] = [];
    const outs: string[] = [];

    if (currentLevel.value === 3) {
      for (const r of M.level2.rels) {
        if (!isShownStatus(r.status)) continue;
        if (r.to === fId && !ins.includes(r.from)) ins.push(r.from);
        if (r.from === fId && !outs.includes(r.to)) outs.push(r.to);
      }
    } else if (parentDn) {
      for (const l of M.level4.links) {
        if (!showPlanned.value && l.state === "planned") continue;
        if (l.to === fId && !ins.includes(l.from)) ins.push(l.from);
        if (l.from === fId && !outs.includes(l.to)) outs.push(l.to);
      }
    }

    // The model's code links, lifted onto this view: wires between the cards inside and, below
    // Level 4, the parts outside that they depend on (right) or that depend on them (left)
    const kidIds = kids.map((k, i) => k.id || `${fId}/${i}`);
    const lifted = M.links?.length
      ? liftLinksToView(M.links, fId, kidIds, parentOf.value, {
          isKnown: (id) => Boolean(lookup[id] || resById.value[id]),
        })
      : null;
    const codeEdge = currentLevel.value >= 5 && !parentDn ? lifted : null;
    if (codeEdge) {
      for (const o of codeEdge.ins) {
        if (!ins.includes(o.id)) ins.push(o.id);
        codeEdgeCounts[o.id] = (codeEdgeCounts[o.id] ?? 0) + o.count;
      }
      // a part on both sides is drawn once, on the left; its wires keep their own directions
      for (const o of codeEdge.outs) {
        if (!outs.includes(o.id) && !ins.includes(o.id)) outs.push(o.id);
        codeEdgeCounts[o.id] = (codeEdgeCounts[o.id] ?? 0) + o.count;
      }
    }

    const stackH = (n: number) => (n ? n * MH + (n - 1) * 14 : 0);
    const gridH = rows * CH + (rows - 1) * GY;
    const H = Math.max(gridH, stackH(ins.length), stackH(outs.length));
    const top = PAD + 40;

    kids.forEach((k, i) => {
      const id = k.id || `${fId}/${i}`;
      const col = 1 + (i % cols);
      const row = Math.floor(i / cols);
      rawEls.push({
        ...k,
        id,
        kind: k.kind ?? "component",
        parent: fId,
        at: [col, row],
        px: [PAD + col * (CW + GX), top + (H - gridH) / 2 + row * (CH + GY), CH],
      });
      if (k.next != null && (!sg?.rels || sg.rels.length === 0) && !lifted?.rels.length) {
        const nextKid = kids[k.next];
        const nextId = nextKid?.id || `${fId}/${k.next}`;
        rawRels.push({
          from: id,
          to: nextId,
          label: "",
          status: k.status,
        });
      }
    });

    if (lifted) {
      // the links stand in for the subgraph's own rels; a hand-written one they do not cover stays
      const pairs = new Set(lifted.rels.map((r) => `${r.from}\u0000${r.to}`));
      rawRels.push(...lifted.rels, ...(sg?.rels || []).filter((r) => !pairs.has(`${r.from}\u0000${r.to}`)));
    } else if (sg?.rels?.length) {
      rawRels.push(...sg.rels);
    }

    const resolvePerimeterCard = (id: string): TuxMapLevelElement | null => {
      if (lookup[id]) return lookup[id]!;
      const dn = resById.value[id];
      if (dn) {
        return {
          id: dn.id,
          kind: "resource",
          name: dn.title,
          tech: dn.facts?.type || dn.kind,
          desc: dn.role,
        };
      }
      return null;
    };

    // an outside card from the code links says where it lives ("in AI gateway › Routing, sign-in and config")
    const edgeCard = (id: string): TuxMapLevelElement | null => {
      const base = resolvePerimeterCard(id);
      if (!base || !codeEdge || !parentOf.value.has(id)) return base;
      const where = mapAncestorsOf(id, parentOf.value)
        .slice(1)
        .reverse()
        .map((a) => lookup[a]?.name || resById.value[a]?.title)
        .filter(Boolean)
        .join(" › ");
      return where ? { ...base, tech: `in ${where}` } : base;
    };

    ins.forEach((id, i) => {
      const base = edgeCard(id);
      if (!base) return;
      rawEls.push({
        ...base,
        at: [0, i],
        side: "in",
        mini: true,
        px: [PAD, top + (H - stackH(ins.length)) / 2 + i * (MH + 14), MH],
      });
    });

    outs.forEach((id, i) => {
      const base = edgeCard(id);
      if (!base) return;
      rawEls.push({
        ...base,
        at: [cols + 1, i],
        side: "out",
        mini: true,
        px: [
          PAD + (cols + 1) * (CW + GX),
          top + (H - stackH(outs.length)) / 2 + i * (MH + 14),
          MH,
        ],
      });
    });

    if (currentLevel.value === 3) {
      for (const r of M.level2.rels) {
        if (r.to === fId) rawRels.push({ ...r, to: "@bound" });
        else if (r.from === fId) rawRels.push({ ...r, from: "@bound" });
      }
    } else if (parentDn) {
      for (const l of M.level4.links) {
        if (!showPlanned.value && l.state === "planned") continue;
        if (l.to === fId) rawRels.push({ from: l.from, to: "@bound", label: l.label });
        else if (l.from === fId) rawRels.push({ from: "@bound", to: l.to, label: l.label });
      }
    }
    if (codeEdge) {
      for (const o of codeEdge.ins) for (const w of o.wires) rawRels.push({ from: o.id, to: w.kid, label: w.label });
      for (const o of codeEdge.outs) for (const w of o.wires) rawRels.push({ from: w.kid, to: o.id, label: w.label });
    }
    const moreOutside = codeEdge ? codeEdge.moreIns + codeEdge.moreOuts : 0;
    stageMoreOutside = moreOutside;

    rawBounds.push({
      id: "@bound",
      label: cName,
      type:
        (sg?.stratum || (TYPE_LABELS[cKind] || "Container") + (cTech ? `: ${cTech}` : "")) +
        (moreOutside ? ` · ${moreOutside} more outside, not drawn` : ""),
      of: [],
      box: {
        x: PAD + CW + GX - 24,
        y: top - 40,
        w: cols * CW + (cols - 1) * GX + 48,
        h: H + 64,
      },
    });
  }

  const els = rawEls.filter((e) => isShownStatus(e.status));
  const rels = rawRels.filter((r) => isShownStatus(r.status));
  const outsideLinkCounts: Record<string, number> = Object.create(null);
  const miniIds = new Set(els.filter((e) => e.mini).map((e) => e.id));
  if (miniIds.size > 0) {
    for (const id of miniIds) {
      if (codeEdgeCounts[id]) outsideLinkCounts[id] = codeEdgeCounts[id]!;
    }
    for (const r of rels) {
      const mult = Number(/^(\d+)×/.exec(r.label || "")?.[1] || 1);
      if (miniIds.has(r.from) && !codeEdgeCounts[r.from]) {
        outsideLinkCounts[r.from] = (outsideLinkCounts[r.from] ?? 0) + mult;
      }
      if (r.to !== r.from && miniIds.has(r.to) && !codeEdgeCounts[r.to]) {
        outsideLinkCounts[r.to] = (outsideLinkCounts[r.to] ?? 0) + mult;
      }
    }
  }
  const rects: Record<string, TuxMapGridCellRect> = {};
  const bounds: TuxMapPlacedBoundary[] = [];
  let W = 0;
  let H = 0;

  for (const b of rawBounds) {
    let box = b.box;
    if (!box) {
      const ins = els.filter((e) => b.of.includes(e.id) && e.at);
      if (!ins.length) continue;
      const c0 = Math.min(...ins.map((e) => e.at![0]));
      const c1 = Math.max(...ins.map((e) => e.at![0]));
      const r0 = Math.min(...ins.map((e) => e.at![1]));
      const r1 = Math.max(...ins.map((e) => e.at![1]));
      const p0 = gridCellToPx([c0, r0]);
      const p1 = gridCellToPx([c1, r1]);
      box = {
        x: p0.x - 22,
        y: p0.y - 34,
        w: p1.x + CW - p0.x + 44,
        h: p1.y + CH - p0.y + 56,
      };
    }
    W = Math.max(W, box.x + box.w);
    H = Math.max(H, box.y + box.h);
    bounds.push({
      id: b.id,
      label: b.label,
      type: b.type,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
    });
    if (b.id) {
      rects[b.id] = { x: box.x, y: box.y, w: box.w, h: box.h, bound: true };
    }
  }

  els.forEach((e, idx) => {
    const fallbackAt: [number, number] = e.at ?? [idx % 4, Math.floor(idx / 4)];
    const p = e.px ? { x: e.px[0], y: e.px[1] } : gridCellToPx(fallbackAt);
    const h = e.px ? e.px[2] : CH;
    rects[e.id] = {
      x: p.x,
      y: p.y,
      w: CW,
      h,
      c: fallbackAt[0],
      r: fallbackAt[1],
      ...(e.mini ? { mini: true } : {}),
      ...(e.side ? { side: e.side } : {}),
    };
    W = Math.max(W, p.x + CW);
    H = Math.max(H, p.y + h);
  });

  W += PAD;
  H += PAD;

  return {
    els,
    deployNodes: [],
    rels,
    bounds,
    rects,
    outsideLinkCounts,
    moreOutside: stageMoreOutside,
    width: Math.max(680, W),
    height: Math.max(420, H),
  };
});

const routedSvg = computed(() => {
  if (currentLevel.value === 4) {
    const links = activeModel.value.level4.links.filter(
      (l) =>
        (showPlanned.value || l.state !== "planned") &&
        stageData.value.rects[l.from] &&
        stageData.value.rects[l.to],
    );
    return {
      wires: routeDeploymentWires(links, stageData.value.rects, "*"),
      labels: [],
    };
  }
  return routeGridWires(stageData.value.rels, stageData.value.rects, stageData.value.els);
});

// ============================================================================
// 3. PRECOMPUTED CARD VIEW-MODELS, BLAST RADIUS, SEARCH & ZERO-QUERY HOVER
// ============================================================================

interface BlastRadiusComputation {
  directIds: Set<string>;
  impactedIds: Set<string>;
  impactedWires: Set<string>;
  rollupCountById: Map<string, number>;
  /** With a selection and code links: how many parts inside each card its change reaches */
  reachCountById?: Map<string, number>;
  /** Dependents in the radius that live on other levels not represented on the current stage */
  offStageCount?: number;
}

// Maps each element ID to the Level 4 deployment node IDs that host or deploy it
const hostIdsByElement = computed<Map<string, string[]>>(() => {
  const M = activeModel.value;
  const out = new Map<string, Set<string>>();
  const add = (elId: string, hostId: string) => {
    if (!elId || !hostId) return;
    let s = out.get(elId);
    if (!s) {
      s = new Set();
      out.set(elId, s);
    }
    s.add(hostId);
  };
  for (const [id, el] of Object.entries(byId.value)) {
    const dep = !el.deployed ? [] : Array.isArray(el.deployed) ? el.deployed : [el.deployed];
    for (const h of dep) add(id, h);
  }
  for (const n of M.level4.nodes) {
    add(n.id, n.id);
    for (const cid of n.hosts || []) add(cid, n.id);
  }
  const final = new Map<string, string[]>();
  for (const [k, s] of out) final.set(k, [...s]);
  return final;
});

function liftToDeployHosts(
  id: string,
  stageHostIds: ReadonlySet<string>,
): string[] {
  const found = new Set<string>();
  for (const anc of mapAncestorsOf(id, parentOf.value)) {
    for (const hid of hostIdsByElement.value.get(anc) ?? []) {
      if (stageHostIds.has(hid)) found.add(hid);
    }
  }
  return [...found];
}

const effectiveModelLinks = computed<TuxMapLink[]>(() =>
  extractModelLinks(activeModel.value, {
    includePlanned: showPlanned.value,
    bridgeUncoveredPairs: true,
  }),
);

const legendLinkKinds = computed<{ kind: string; label: string; quiet: boolean }[]>(() => {
  const rawLinks = activeModel.value.links;
  if (!rawLinks?.length) return [];
  const present = new Set<string>();
  for (const l of rawLinks) {
    if (l.kind) present.add(l.kind);
  }
  const knownOrder = Object.keys(TUX_MAP_LINK_KIND_LABELS);
  const ordered = [
    ...knownOrder.filter((k) => present.has(k)),
    ...[...present].filter((k) => !hasOwn(TUX_MAP_LINK_KIND_LABELS, k)).sort(cmpCodepoint),
  ];
  return ordered.map((kind) => ({
    kind,
    label: (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) ? TUX_MAP_LINK_KIND_LABELS[kind] : undefined) || kind,
    quiet: TUX_MAP_QUIET_LINK_KINDS.has(kind),
  }));
});

const hasModelDiffs = computed<boolean>(() => {
  if (props.blastSeeds?.length) return true;
  for (const el of Object.values(byId.value)) {
    if (!el.ref && el.diff) return true;
  }
  for (const n of activeModel.value.level4.nodes) {
    if (n.diff) return true;
  }
  return false;
});

// Find Usages controls (#119): distance tab, Show all expansion, and per-kind chips
// (docs `mentions` hidden by default; all other link kinds enabled by default).
const usagesTab = ref<"direct" | "two-steps">("two-steps");
const usagesShowAll = ref<boolean>(false);
const usageKindOverrides = ref<Record<string, boolean>>({});

watch(selectedId, () => {
  usagesShowAll.value = false;
});

function isUsageKindEnabled(kind: string): boolean {
  const key = kind || "uses";
  if (hasOwn(usageKindOverrides.value, key)) {
    return Boolean(usageKindOverrides.value[key]);
  }
  return key !== "mentions";
}

function toggleUsageKind(kind: string) {
  const key = kind || "uses";
  usageKindOverrides.value = {
    ...usageKindOverrides.value,
    [key]: !isUsageKindEnabled(key),
  };
}

const allPresentLinkKinds = computed<string[]>(() => {
  const s = new Set<string>();
  for (const l of effectiveModelLinks.value) {
    s.add(l.kind || "uses");
  }
  return [...s].sort(cmpCodepoint);
});

const activeUsageKindsSet = computed<Set<string>>(() => {
  const out = new Set<string>();
  for (const k of allPresentLinkKinds.value) {
    if (isUsageKindEnabled(k)) out.add(k);
  }
  return out;
});

// Unfiltered blast radius of the selection (includes `mentions` at hop 1 so kind chips can count & toggle it)
const selectionBlastBase = computed(() => {
  const M = activeModel.value;
  const id = selectedId.value;
  const links = effectiveModelLinks.value;
  if (!links.length || !id || (!byId.value[id] && !resById.value[id])) return null;
  return computeLinkBlastRadius(links, id, parentOf.value, {
    model: M,
    intent: blastIntent.value,
  });
});

const usageKindChips = computed<{ kind: string; label: string; count: number; active: boolean }[]>(() => {
  const base = selectionBlastBase.value;
  if (!base) return [];
  const counts = new Map<string, number>();
  for (const [, hit] of base.hits) {
    const k = hit.via.kind || "uses";
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  for (const l of effectiveModelLinks.value) {
    if (!base.seeds.has(l.from) && base.seeds.has(l.to)) {
      const k = l.kind || "uses";
      if (!counts.has(k)) counts.set(k, 1);
    }
  }
  const knownOrder = Object.keys(TUX_MAP_LINK_KIND_LABELS);
  const keys = [
    ...knownOrder.filter((k) => counts.has(k)),
    ...[...counts.keys()].filter((k) => !hasOwn(TUX_MAP_LINK_KIND_LABELS, k)).sort(cmpCodepoint),
  ];
  return keys.map((kind) => ({
    kind,
    label: (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) ? TUX_MAP_LINK_KIND_LABELS[kind] : undefined) || kind,
    count: counts.get(kind) ?? 0,
    active: isUsageKindEnabled(kind),
  }));
});

// The blast radius of the selected element through the model's links, filtered by active kind chips:
// everything that depends on it or on anything inside it (including Level 4 hosts and C4 rels).
const selectionBlast = computed(() => {
  const M = activeModel.value;
  const id = selectedId.value;
  const links = effectiveModelLinks.value;
  if (!links.length || !id || (!byId.value[id] && !resById.value[id])) return null;
  return computeLinkBlastRadius(links, id, parentOf.value, {
    model: M,
    intent: blastIntent.value,
    kinds: activeUsageKindsSet.value,
  });
});

interface UsageRowItem {
  id: string;
  locLabel: string;
  symbolLabel: string;
  hop: number;
  via: TuxMapLink;
  how: string;
  whyDetail: string;
  href: string | null;
  groupKey: string;
  groupLabel: string;
}

function describeUsageGroup(id: string, basePath: string): { key: string; label: string } {
  const M = activeModel.value;
  const lookup = byId.value;
  const dn = resById.value[id];
  if (dn) {
    const gTitle = M.level4.groups.find((g) => g.id === dn.group)?.title || dn.zone || "Infrastructure";
    return { key: `l4:${gTitle}`, label: gTitle };
  }
  const ancs = mapAncestorsOf(id, parentOf.value);
  const compId = ancs.find((a) => {
    const p = parentOf.value.get(a);
    return Boolean(p && hasOwn(M.level3, p));
  });
  const topId = ancs[ancs.length - 1] || id;
  const topName = lookup[topId]?.name || topId;
  const compName =
    compId && compId !== topId && lookup[compId]?.name
      ? `${topName} › ${lookup[compId]!.name}`
      : topName;
  const dirAncId = ancs.find((a) => a.startsWith("d:"));
  let folder = dirAncId ? lookup[dirAncId]?.name || "" : "";
  if (!folder && basePath.includes("/")) {
    folder = `${basePath.slice(0, basePath.lastIndexOf("/"))}/`;
  }
  const label = folder ? `${compName} · ${folder}` : compName;
  return { key: `${compId || topId}::${folder}`, label };
}

const selectionUsages = computed(() => {
  const sb = selectionBlast.value;
  if (!sb) return null;

  const activeKinds = activeUsageKindsSet.value;
  let directLinkCount = 0;
  for (const l of effectiveModelLinks.value) {
    if (sb.seeds.has(l.from) || !sb.seeds.has(l.to)) continue;
    const k = l.kind || "uses";
    if (!activeKinds.has(k)) continue;
    const siteMult = l.sites?.length ? l.sites.length : 1;
    directLinkCount += siteMult;
  }

  let hiddenMentionsCount = 0;
  if (!isUsageKindEnabled("mentions") && selectionBlastBase.value) {
    for (const [, hit] of selectionBlastBase.value.hits) {
      if ((hit.via.kind || "") === "mentions") hiddenMentionsCount++;
    }
  }

  const allRows: UsageRowItem[] = [];
  for (const [id, hit] of sb.hits) {
    const e = byId.value[id];
    const dn = resById.value[id];
    const [atPath, atLine] = (hit.via.at || "").split(/:(?=\d+$)/);
    const fallbackFile = id.startsWith("f:")
      ? id.slice(2)
      : id.startsWith("s:")
        ? id.slice(2).split("#")[0] || ""
        : "";
    const basePath =
      atPath ||
      e?.source?.path ||
      dn?.source?.path ||
      fallbackFile ||
      e?.name ||
      dn?.title ||
      id;
    const lineNum = atLine
      ? Number(atLine)
      : e?.source?.lineRange?.length
        ? e.source.lineRange[0]
        : undefined;
    const locLabel = lineNum ? `${basePath}:${lineNum}` : basePath;
    const itemTitle = e?.name || dn?.title || "";
    const symbolLabel =
      itemTitle && itemTitle !== basePath && !basePath.endsWith(`/${itemTitle}`) ? itemTitle : "";
    const kindKey = hit.via.kind || "";
    const how =
      (hasOwn(TUX_MAP_LINK_KIND_LABELS, kindKey) ? TUX_MAP_LINK_KIND_LABELS[kindKey] : undefined) ||
      kindKey ||
      "uses";
    const viaFromName =
      byId.value[hit.via.from]?.name || resById.value[hit.via.from]?.title || hit.via.from;
    const viaToName =
      byId.value[hit.via.to]?.name || resById.value[hit.via.to]?.title || hit.via.to;
    const whyDetail = `${viaFromName} ${how} → ${viaToName}${hit.via.at ? ` (${hit.via.at})` : ""}`;
    const grp = describeUsageGroup(id, basePath);
    allRows.push({
      id,
      locLabel,
      symbolLabel,
      hop: hit.hop,
      via: hit.via,
      how,
      whyDetail,
      href:
        atPath || e?.source?.path
          ? buildSourceHref({
              path: atPath || e!.source!.path,
              lineRange: lineNum ? [lineNum, lineNum] : undefined,
            })
          : null,
      groupKey: grp.key,
      groupLabel: grp.label,
    });
  }

  allRows.sort(
    (a, b) =>
      a.hop - b.hop ||
      Number(Boolean(a.via.stop)) - Number(Boolean(b.via.stop)) ||
      compareBlastLinks(a.via, b.via) ||
      cmpCodepoint(a.id, b.id),
  );

  const directRows = allRows.filter((r) => r.hop === 1);
  const twoStepRows = allRows.filter((r) => r.hop <= 2);
  const directCount = directRows.length;
  const twoStepCount = twoStepRows.length;
  const totalCount = allRows.length;
  const deeperCount = Math.max(0, totalCount - twoStepCount);

  if (directCount > 0 && directLinkCount < directCount) {
    directLinkCount = directCount;
  }

  const SHOWN = 60;
  const candidateRows =
    usagesTab.value === "direct"
      ? directRows
      : usagesShowAll.value
        ? allRows
        : twoStepRows;
  const shownRows = usagesShowAll.value ? candidateRows : candidateRows.slice(0, SHOWN);
  const targetFullCount = usagesTab.value === "direct" ? directRows.length : allRows.length;
  const hasMore = !usagesShowAll.value && targetFullCount > shownRows.length;

  const groupsMap = new Map<string, { key: string; label: string; rows: UsageRowItem[] }>();
  for (const r of shownRows) {
    let g = groupsMap.get(r.groupKey);
    if (!g) {
      g = { key: r.groupKey, label: r.groupLabel, rows: [] };
      groupsMap.set(r.groupKey, g);
    }
    g.rows.push(r);
  }

  return {
    directCount,
    directLinkCount,
    twoStepCount,
    totalCount,
    deeperCount,
    hiddenMentionsCount,
    groups: [...groupsMap.values()],
    shownCount: shownRows.length,
    showAllTotal: targetFullCount,
    hasMore,
    truncated: sb.truncated,
  };
});

function countOffStageHits(hits: ReadonlyMap<string, unknown>): number {
  let off = 0;
  if (currentLevel.value === 4) {
    const stageHostIds = new Set(stageData.value.deployNodes.map((n) => n.id));
    for (const x of hits.keys()) {
      if (liftToDeployHosts(x, stageHostIds).length === 0) off++;
    }
    return off;
  }
  const stageIds = new Set(stageData.value.els.map((e) => e.id));
  for (const x of hits.keys()) {
    if (!liftToSet(x, stageIds, parentOf.value)) off++;
  }
  return off;
}

function projectBlastOntoStage(
  seeds: ReadonlySet<string>,
  hits: ReadonlyMap<string, unknown>,
  rollupCountById: Map<string, number>,
  presetDirectIds?: ReadonlySet<string>,
): BlastRadiusComputation {
  const offStageCount = countOffStageHits(hits);
  if (currentLevel.value === 4) {
    const stageHostIds = new Set(stageData.value.deployNodes.map((n) => n.id));
    const directIds = new Set<string>(presetDirectIds ?? []);
    for (const x of seeds) {
      for (const hid of liftToDeployHosts(x, stageHostIds)) directIds.add(hid);
    }
    const reachCountById = new Map<string, number>();
    for (const x of hits.keys()) {
      for (const hid of liftToDeployHosts(x, stageHostIds)) {
        if (!directIds.has(hid)) reachCountById.set(hid, (reachCountById.get(hid) ?? 0) + 1);
      }
    }
    const impactedIds = new Set(reachCountById.keys());
    const impactedWires = new Set(
      routedSvg.value.wires
        .filter(
          (w) =>
            (directIds.has(w.from) || impactedIds.has(w.from)) &&
            (directIds.has(w.to) || impactedIds.has(w.to)) &&
            (impactedIds.has(w.from) || impactedIds.has(w.to)),
        )
        .map((w) => w.id),
    );
    return { directIds, impactedIds, impactedWires, rollupCountById, reachCountById, offStageCount };
  }

  const stageIds = new Set(stageData.value.els.map((e) => e.id));
  const directIds = new Set<string>(presetDirectIds ?? []);
  for (const x of seeds) {
    const on = liftToSet(x, stageIds, parentOf.value);
    if (on) directIds.add(on);
  }
  const reachCountById = new Map<string, number>();
  for (const x of hits.keys()) {
    const on = liftToSet(x, stageIds, parentOf.value);
    if (on && !directIds.has(on)) reachCountById.set(on, (reachCountById.get(on) ?? 0) + 1);
  }
  const impactedIds = new Set(reachCountById.keys());
  // a wire is in the radius when its dependent end is reached and the other end is lit
  const impactedWires = new Set(
    routedSvg.value.wires
      .filter((w) => impactedIds.has(w.from) && (directIds.has(w.to) || impactedIds.has(w.to)))
      .map((w) => w.id),
  );
  return { directIds, impactedIds, impactedWires, rollupCountById, reachCountById, offStageCount };
}

const blastRadiusState = computed<BlastRadiusComputation | null>(() => {
  if (!showBlastRadius.value) return null;

  // A selection with links: light what its change reaches, lifted onto the cards on stage
  const sb = selectionBlast.value;
  if (sb) {
    return projectBlastOntoStage(sb.seeds, sb.hits, new Map());
  }

  const M = activeModel.value;
  const directIds = new Set<string>();
  const rollupCountById = new Map<string, number>();

  // Walk full ancestor chains across Levels 1..7+ so deep symbol/file diffs roll up to every ancestor
  const allDiffIds = new Set<string>();
  const diffById = new Map<string, TuxMapDiffInfo>();
  const diffAncestorsWithDiffChild = new Set<string>();
  for (const [id, el] of Object.entries(byId.value)) {
    if (!el.ref && el.diff) {
      allDiffIds.add(id);
      diffById.set(id, el.diff);
    }
  }
  for (const n of M.level4.nodes) {
    if (n.diff) {
      allDiffIds.add(n.id);
      diffById.set(n.id, n.diff);
    }
  }

  const l2ContainerIds = new Set(M.level2.elements.filter((e) => !e.ref).map((e) => e.id));
  let totalContainerDiffs = 0;

  for (const id of allDiffIds) {
    const chain = mapAncestorsOf(id, parentOf.value);
    for (const anc of chain.slice(1)) {
      rollupCountById.set(anc, (rollupCountById.get(anc) ?? 0) + 1);
      if (allDiffIds.has(anc)) diffAncestorsWithDiffChild.add(anc);
    }
    const topAnc = chain[chain.length - 1]!;
    if (l2ContainerIds.has(topAnc)) {
      totalContainerDiffs++;
    }
  }

  if (totalContainerDiffs > 0 && M.level2.boundary) {
    rollupCountById.set(M.level2.boundary, totalContainerDiffs);
  }

  if (currentLevel.value === 4) {
    for (const n of stageData.value.deployNodes) {
      if (n.diff || rollupCountById.has(n.id)) {
        directIds.add(n.id);
      } else if (n.hosts?.some((cid) => Boolean(byId.value[cid]?.diff || rollupCountById.has(cid)))) {
        directIds.add(n.id);
      }
    }
  } else {
    for (const e of stageData.value.els) {
      if (e.diff || rollupCountById.has(e.id)) {
        directIds.add(e.id);
      }
    }
  }

  // Propagate via multi-seed computeLinkBlastRadius across effective links
  const links = effectiveModelLinks.value;
  if (links.length && (allDiffIds.size > 0 || props.blastSeeds?.length)) {
    const seedIds = props.blastSeeds?.length
      ? props.blastSeeds
      : [...allDiffIds].filter((id) => {
          if (!diffAncestorsWithDiffChild.has(id)) return true;
          const d = diffById.get(id);
          // Keep non-body-patched ancestors (added, deleted, moved, sig-changed)
          return d?.changeType !== "modified" || Boolean(d.summary && d.summary !== "Body patched");
        });
    const diffBlast = computeLinkBlastRadius(links, seedIds, parentOf.value, {
      model: M,
      intent: blastIntent.value,
    });
    return projectBlastOntoStage(diffBlast.seeds, diffBlast.hits, rollupCountById, directIds);
  }

  const impactedIds = new Set<string>();
  const impactedWires = new Set<string>();

  // Upstream-only stage-wire fallback when model has zero links
  const hop1 = new Set<string>(directIds);
  for (const w of routedSvg.value.wires) {
    const toDirect =
      directIds.has(w.to) ||
      (w.to === "@bound" && focusId.value && (directIds.has(focusId.value) || rollupCountById.has(focusId.value)));

    if (toDirect) {
      impactedWires.add(w.id);
      if (w.from !== "@bound" && !directIds.has(w.from)) {
        impactedIds.add(w.from);
        hop1.add(w.from);
      }
    }
  }

  for (const w of routedSvg.value.wires) {
    if (impactedWires.has(w.id)) continue;
    if (hop1.has(w.to)) {
      impactedWires.add(w.id);
      if (w.from !== "@bound" && !directIds.has(w.from)) impactedIds.add(w.from);
    }
  }

  return { directIds, impactedIds, impactedWires, rollupCountById };
});

function formatDiffBadge(
  id: string,
  diff?: TuxMapDiffInfo,
): [string, string] | null {
  const br = blastRadiusState.value;
  if (!br) return null;
  if (diff) {
    const prefix =
      diff.changeType === "added"
        ? "+ Added"
        : diff.changeType === "deleted"
          ? "− Deleted"
          : diff.summary?.startsWith("Moved")
            ? "⇄ Moved"
            : diff.summary?.startsWith("Signature")
              ? "△ Signature"
              : "△ Modified";
    return [
      diff.changeType,
      diff.filesChanged ? `${prefix} · ${diff.filesChanged}f` : prefix,
    ];
  }
  const rollup = br.rollupCountById.get(id);
  if (rollup) {
    return ["modified", `△ ${rollup} inner changed`];
  }
  const reach = br.reachCountById?.get(id);
  if (reach) {
    return ["impact", `${reach} affected`];
  }
  if (br.impactedIds.has(id)) {
    return ["impact", "⚡ Impacted"];
  }
  return null;
}

const offStageImpactCount = computed<number>(() => {
  if (blastRadiusState.value?.offStageCount) return blastRadiusState.value.offStageCount;
  if (selectionBlast.value) return countOffStageHits(selectionBlast.value.hits);
  return stageData.value.moreOutside || 0;
});

const renderedCards = computed(() =>
  stageData.value.els.map((e) => {
    const r = stageData.value.rects[e.id];
    const kind = e.kind || "container";
    const baseType = TYPE_LABELS[kind] || "";
    const typeLabel = baseType || e.tech ? `[${baseType}${e.tech ? `: ${e.tech}` : ""}]` : "";
    const live = !e.mini ? formatLiveState(e) : null;
    const outsideLinks = e.mini ? stageData.value.outsideLinkCounts[e.id] || 0 : 0;
    const chip: [string, string] | null = !e.mini
      ? getCardChip(e)
      : outsideLinks > 0
        ? ["links", `${outsideLinks} link${outsideLinks === 1 ? "" : "s"}`]
        : null;
    const zoomable = canZoomElement(e);
    const br = blastRadiusState.value;
    const isDirect = Boolean(br?.directIds.has(e.id));
    const isImpacted = Boolean(!isDirect && br?.impactedIds.has(e.id));
    const diffBadge = formatDiffBadge(e.id, e.diff);
    return {
      el: e,
      id: e.id,
      parent: e.parent || "",
      name: e.name,
      desc: !e.mini ? e.desc : undefined,
      mini: Boolean(e.mini),
      statusCls: e.status ? `tux-map__el--st-${e.status}` : "",
      kindCls: `tux-map__el--k-${kind}`,
      blastCls: isDirect
        ? "tux-map__el--diff-direct"
        : isImpacted
          ? "tux-map__el--diff-impact"
          : "",
      icon: elementIconName(kind),
      typeLabel,
      live,
      chip,
      diffBadge,
      zoomable,
      style: {
        left: `${r?.x ?? 0}px`,
        top: `${r?.y ?? 0}px`,
        width: `${r?.w ?? 212}px`,
        height: `${r?.h ?? 128}px`,
      },
    };
  }),
);

const searchIndexById = computed<Map<string, string>>(() => {
  const map = new Map<string, string>();
  if (currentLevel.value === 4) {
    for (const n of stageData.value.deployNodes) {
      map.set(
        n.id,
        [
          n.title,
          n.kind,
          n.role,
          n.group ?? "",
          n.zone ?? "",
          ...(n.hosts ?? []),
          n.facts?.size ?? "",
          n.facts?.sku ?? "",
          n.facts?.version ?? "",
          n.facts?.ingress ?? "",
          n.facts?.type ?? "",
        ]
          .join(" ")
          .toLowerCase(),
      );
    }
    return map;
  }

  for (const e of stageData.value.els) {
    map.set(
      e.id,
      [
        e.name,
        e.kind ?? "",
        e.tech ?? "",
        e.desc ?? "",
        ...(Array.isArray(e.runs) ? e.runs : e.runs ? [e.runs] : []),
        ...(Array.isArray(e.deployed) ? e.deployed : e.deployed ? [e.deployed] : []),
      ]
        .join(" ")
        .toLowerCase(),
    );
  }
  return map;
});

const activeLitId = computed<string | null>(() => selectedId.value);

const litKey = computed<string | null>(() => {
  const id = activeLitId.value;
  if (!id) return null;
  if (currentLevel.value === 3 && id === focusId.value) return "@bound";
  return id;
});

const litNeighbors = computed<Set<string>>(() => {
  const set = new Set<string>();
  const key = litKey.value;
  if (!key) return set;
  set.add(key);
  if (activeLitId.value) set.add(activeLitId.value);

  for (const w of routedSvg.value.wires) {
    if (w.from === key || w.to === key) {
      set.add(w.from);
      set.add(w.to);
    }
  }
  return set;
});

const stageTotalCount = computed<number>(() =>
  currentLevel.value === 4 ? stageData.value.deployNodes.length : stageData.value.els.length,
);

const matchingSearchIds = computed<Set<string> | null>(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return null;
  const set = new Set<string>();
  for (const [id, hay] of searchIndexById.value.entries()) {
    if (hay.includes(q)) set.add(id);
  }
  return set;
});

watch([searchQuery, currentLevel, focusId], () => {
  const m = matchingSearchIds.value;
  if (!m) return;
  const msg = `${m.size} of ${stageTotalCount.value} here`;
  if (liveAnnouncement.value === msg) {
    announce(msg);
  } else {
    if (announceTimer) {
      clearTimeout(announceTimer);
      announceTimer = null;
    }
    liveAnnouncement.value = msg;
  }
});

// ============================================================================
// 3B. CROSS-LEVEL GO-TO SEARCH PALETTE (#120)
// ============================================================================

const GOTO_ROW_H = 44;
const GOTO_VIEWPORT_ROWS = 8;
const GOTO_OVERSCAN = 6;

const mapRootRef = ref<HTMLElement | null>(null);
const goToOpen = ref<boolean>(false);
const goToQuery = ref<string>("");
const goToActiveIdx = ref<number>(0);
const goToScrollTop = ref<number>(0);
const goToInputRef = ref<HTMLInputElement | null>(null);
const goToListRef = ref<HTMLDivElement | null>(null);
let goToReturnFocusEl: HTMLElement | null = null;

const mapSearchIndex = computed<TuxMapSearchEntry[]>(() =>
  buildMapSearchIndex(activeModel.value),
);

const goToGroupResults = computed<TuxMapSearchGroupResult[]>(() =>
  searchArchitectureMap(mapSearchIndex.value, goToQuery.value, {
    includePlanned: showPlanned.value,
  }).groups,
);

type GoToFlatItem =
  | { type: "header"; key: string; group: string; count: number }
  | { type: "hit"; key: string; hit: TuxMapSearchHit; hitOrdinal: number; rowIndex: number };

const goToFlatModel = computed(() => {
  const items: GoToFlatItem[] = [];
  const hits: TuxMapSearchHit[] = [];
  const rowIndexByOrdinal: number[] = [];
  for (const grp of goToGroupResults.value) {
    items.push({
      type: "header",
      key: `hdr-${grp.group}`,
      group: grp.group,
      count: grp.hits.length,
    });
    for (const h of grp.hits) {
      const hitOrdinal = hits.length;
      const rowIndex = items.length;
      hits.push(h);
      rowIndexByOrdinal.push(rowIndex);
      items.push({
        type: "hit",
        key: `hit-${h.entry.id}-${hitOrdinal}`,
        hit: h,
        hitOrdinal,
        rowIndex,
      });
    }
  }
  return { items, hits, rowIndexByOrdinal };
});

watch([goToQuery, showPlanned], () => {
  goToActiveIdx.value = 0;
  goToScrollTop.value = 0;
  if (goToListRef.value) goToListRef.value.scrollTop = 0;
});

const goToVirtualSlice = computed(() => {
  const all = goToFlatModel.value.items;
  const total = all.length;
  const start = Math.max(0, Math.floor(goToScrollTop.value / GOTO_ROW_H) - GOTO_OVERSCAN);
  const end = Math.min(total, start + GOTO_VIEWPORT_ROWS + GOTO_OVERSCAN * 2);
  const visible = all.slice(start, end);
  const activeInSlice = visible.some(
    (it) => it.type === "hit" && it.hitOrdinal === goToActiveIdx.value,
  );
  return {
    visible,
    topPx: start * GOTO_ROW_H,
    bottomPx: Math.max(0, (total - end) * GOTO_ROW_H),
    activeOptionId: activeInSlice ? `${goToListboxId}-opt-${goToActiveIdx.value}` : undefined,
  };
});

function scrollActiveGoToIntoView() {
  const rowIdx = goToFlatModel.value.rowIndexByOrdinal[goToActiveIdx.value];
  if (rowIdx === undefined) return;
  const rowTop = rowIdx * GOTO_ROW_H;
  const rowBottom = rowTop + GOTO_ROW_H;
  const viewH = GOTO_VIEWPORT_ROWS * GOTO_ROW_H;
  let nextScroll = goToScrollTop.value;
  if (rowTop < nextScroll) {
    nextScroll = Math.max(0, rowTop - GOTO_ROW_H);
  } else if (rowBottom > nextScroll + viewH) {
    nextScroll = rowBottom - viewH;
  }
  goToScrollTop.value = nextScroll;
  if (goToListRef.value) goToListRef.value.scrollTop = nextScroll;
}

function onGoToScroll(ev: Event) {
  const el = ev.target as HTMLElement | null;
  if (el) goToScrollTop.value = el.scrollTop;
}

function openGoToPalette() {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    goToReturnFocusEl = document.activeElement;
  }
  goToQuery.value = "";
  goToActiveIdx.value = 0;
  goToScrollTop.value = 0;
  goToOpen.value = true;
  nextTick(() => {
    goToInputRef.value?.focus({ preventScroll: true });
  });
}

function closeGoToPalette(restoreFocus = false) {
  goToOpen.value = false;
  if (restoreFocus) {
    const ret = goToReturnFocusEl;
    goToReturnFocusEl = null;
    nextTick(() => {
      if (ret && ret.isConnected) {
        ret.focus({ preventScroll: true });
      } else {
        viewportRef.value?.focus({ preventScroll: true });
      }
    });
  }
}

function isElementLit(id: string, parentId?: string): boolean {
  if (matchingSearchIds.value) {
    return matchingSearchIds.value.has(id);
  }
  const br = blastRadiusState.value;
  if (!activeLitId.value) {
    if (br && (br.directIds.size > 0 || br.impactedIds.size > 0)) {
      return br.directIds.has(id) || br.impactedIds.has(id);
    }
    return true;
  }
  if (br && (br.directIds.has(id) || br.impactedIds.has(id))) return true;
  if (litNeighbors.value.has(id)) return true;
  if (litNeighbors.value.has("@bound") && parentId) return true;
  return false;
}

function isWireLit(from: string, to: string, wireId?: string): boolean {
  const br = blastRadiusState.value;
  if (br && wireId && br.impactedWires.has(wireId)) {
    return true;
  }
  const key = litKey.value;
  if (key) {
    return from === key || to === key;
  }
  return false;
}

// ============================================================================
// 4. VIEWPORT AUTO-FIT, KEEP-CLEAR DRAWER SLIDE & ORIGIN-ANCHORED ZOOM
// ============================================================================

const viewportRef = ref<HTMLDivElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

let currentHoveredId: string | null = null;

// Pre-indexed stage DOM cache so pointer hover runs in O(degree) with 0 querySelectorAll calls
interface StageDomCache {
  bgSvg: SVGSVGElement | null;
  cards: { el: HTMLElement; id: string; parent: string }[];
  fgWiresByNode: Map<string, SVGElement[]>;
  fgWiresById: Map<string, SVGElement[]>;
  labelsByNode: Map<string, { el: HTMLElement; forced: boolean }[]>;
  neighborsByNode: Map<string, Set<string>>;
  litWires: SVGElement[];
  litLabels: { el: HTMLElement; forced: boolean }[];
}

let stageDomCache: StageDomCache | null = null;

function queryCardById(root: ParentNode | null | undefined, id: string): HTMLElement | null {
  if (!root || !id) return null;
  const cards = root.querySelectorAll<HTMLElement>(".tux-map__el");
  for (let i = 0; i < cards.length; i++) {
    if (cards[i]!.dataset.id === id) return cards[i]!;
  }
  return null;
}

function queryListCardById(root: ParentNode | null | undefined, id: string): HTMLElement | null {
  if (!root || !id) return null;
  const cards = root.querySelectorAll<HTMLElement>("[data-list-id]");
  for (let i = 0; i < cards.length; i++) {
    if (cards[i]!.dataset.listId === id) return cards[i]!;
  }
  return null;
}

function rebuildStageDomCache() {
  const stage = stageRef.value;
  if (!stage) {
    stageDomCache = null;
    return;
  }

  const bgSvg = stage.querySelector<SVGSVGElement>("svg.tux-map__wires");
  const cards: { el: HTMLElement; id: string; parent: string }[] = [];
  const cardEls = stage.querySelectorAll<HTMLElement>(".tux-map__el");
  for (let i = 0; i < cardEls.length; i++) {
    const el = cardEls[i]!;
    cards.push({
      el,
      id: el.dataset.id || "",
      parent: el.dataset.parent || "",
    });
  }

  const fgWiresByNode = new Map<string, SVGElement[]>();
  const fgWiresById = new Map<string, SVGElement[]>();
  const neighborsByNode = new Map<string, Set<string>>();
  const litWires: SVGElement[] = [];

  function pushMapItem<T>(map: Map<string, T[]>, k: string, item: T) {
    const arr = map.get(k);
    if (arr) arr.push(item);
    else map.set(k, [item]);
  }

  function addNeighbor(a: string, b: string) {
    let set = neighborsByNode.get(a);
    if (!set) {
      set = new Set<string>([a]);
      neighborsByNode.set(a, set);
    }
    set.add(b);
  }

  const fgWireEls = stage.querySelectorAll<SVGElement>(".tux-map__wire-fg");
  for (let i = 0; i < fgWireEls.length; i++) {
    const w = fgWireEls[i]!;
    const wid = w.dataset.id || "";
    const from = w.dataset.from || "";
    const to = w.dataset.to || "";
    if (wid) pushMapItem(fgWiresById, wid, w);
    pushMapItem(fgWiresByNode, from, w);
    if (to !== from) pushMapItem(fgWiresByNode, to, w);
    addNeighbor(from, to);
    addNeighbor(to, from);
    if (w.classList.contains("tux-map__wire-fg--on")) {
      litWires.push(w);
    }
  }

  const labelsByNode = new Map<string, { el: HTMLElement; forced: boolean }[]>();
  const litLabels: { el: HTMLElement; forced: boolean }[] = [];
  const labEls = stage.querySelectorAll<HTMLElement>(".tux-map__lab");
  for (let i = 0; i < labEls.length; i++) {
    const el = labEls[i]!;
    const from = el.dataset.from || "";
    const to = el.dataset.to || "";
    const entry = { el, forced: el.dataset.forced === "1" };
    pushMapItem(labelsByNode, from, entry);
    if (to !== from) pushMapItem(labelsByNode, to, entry);
    if (el.classList.contains("tux-map__lab--on")) {
      litLabels.push(entry);
    }
  }

  stageDomCache = {
    bgSvg,
    cards,
    fgWiresByNode,
    fgWiresById,
    labelsByNode,
    neighborsByNode,
    litWires,
    litLabels,
  };
}

/**
 * O(degree) direct DOM class toggling using `stageDomCache` so `@pointerover` / `@pointerleave`
 * highlights wires, labels, and neighbor cards in < 0.01ms with ZERO `querySelectorAll` calls,
 * ZERO Vue VDOM re-renders, and ZERO CSS transition lag.
 */
function applyStageHighlight(rawId: string | null) {
  const stage = stageRef.value;
  if (!stage) return;
  if (!stageDomCache) {
    rebuildStageDomCache();
  }
  const cache = stageDomCache;
  if (!cache) return;

  // Turn off previously lit wires and labels in O(k)
  for (let i = 0; i < cache.litWires.length; i++) {
    cache.litWires[i]!.classList.remove("tux-map__wire-fg--on");
  }
  cache.litWires.length = 0;

  for (let i = 0; i < cache.litLabels.length; i++) {
    const item = cache.litLabels[i]!;
    item.el.classList.remove("tux-map__lab--on");
    if (item.forced) item.el.style.display = "none";
  }
  cache.litLabels.length = 0;

  const searchSet = matchingSearchIds.value;
  if (searchSet) {
    cache.bgSvg?.classList.remove("tux-map__wires--has-on");
    stage.classList.add("tux-map__stage--dim");
    for (let i = 0; i < cache.cards.length; i++) {
      const c = cache.cards[i]!;
      c.el.classList.toggle("tux-map__el--lit", searchSet.has(c.id));
    }
    return;
  }

  if (!rawId) {
    const br = blastRadiusState.value;
    if (br && (br.directIds.size > 0 || br.impactedIds.size > 0)) {
      cache.bgSvg?.classList.add("tux-map__wires--has-on");
      stage.classList.add("tux-map__stage--dim");
      for (let i = 0; i < cache.cards.length; i++) {
        const c = cache.cards[i]!;
        c.el.classList.toggle(
          "tux-map__el--lit",
          br.directIds.has(c.id) || br.impactedIds.has(c.id),
        );
      }
      for (const wid of br.impactedWires) {
        const ws = cache.fgWiresById.get(wid);
        if (!ws) continue;
        for (let i = 0; i < ws.length; i++) {
          const w = ws[i]!;
          if (!w.classList.contains("tux-map__wire-fg--on")) {
            w.classList.add("tux-map__wire-fg--on");
            cache.litWires.push(w);
          }
        }
      }
      return;
    }
    cache.bgSvg?.classList.remove("tux-map__wires--has-on");
    stage.classList.remove("tux-map__stage--dim");
    for (let i = 0; i < cache.cards.length; i++) {
      cache.cards[i]!.el.classList.add("tux-map__el--lit");
    }
    return;
  }

  const key = currentLevel.value === 3 && rawId === focusId.value ? "@bound" : rawId;
  cache.bgSvg?.classList.add("tux-map__wires--has-on");
  stage.classList.add("tux-map__stage--dim");

  const activeWires = cache.fgWiresByNode.get(key);
  if (activeWires) {
    for (let i = 0; i < activeWires.length; i++) {
      const w = activeWires[i]!;
      w.classList.add("tux-map__wire-fg--on");
      cache.litWires.push(w);
    }
  }

  const activeLabels = cache.labelsByNode.get(key);
  if (activeLabels) {
    for (let i = 0; i < activeLabels.length; i++) {
      const item = activeLabels[i]!;
      item.el.classList.add("tux-map__lab--on");
      if (item.forced) item.el.style.display = "";
      cache.litLabels.push(item);
    }
  }

  const neighborSet = cache.neighborsByNode.get(key);
  const boundLit = Boolean(neighborSet?.has("@bound") || key === "@bound");
  const br = rawId === selectedId.value ? blastRadiusState.value : null;
  if (br) {
    for (const wid of br.impactedWires) {
      const ws = cache.fgWiresById.get(wid);
      if (!ws) continue;
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i]!;
        if (!w.classList.contains("tux-map__wire-fg--on")) {
          w.classList.add("tux-map__wire-fg--on");
          cache.litWires.push(w);
        }
      }
    }
  }
  for (let i = 0; i < cache.cards.length; i++) {
    const c = cache.cards[i]!;
    const isLit =
      c.id === rawId ||
      c.id === key ||
      Boolean(neighborSet?.has(c.id)) ||
      Boolean(boundLit && c.parent) ||
      Boolean(br && (br.directIds.has(c.id) || br.impactedIds.has(c.id)));
    c.el.classList.toggle("tux-map__el--lit", isLit);
  }
}

const proximityFrameRef = ref<HTMLDivElement | null>(null);
const proximityTetherSvgRef = ref<SVGSVGElement | null>(null);
const proximityTetherBeamRef = ref<SVGPathElement | null>(null);
const proximityCursorDotRef = ref<SVGCircleElement | null>(null);
const proximityAnchorDotRef = ref<SVGCircleElement | null>(null);
const proximityCard = ref<{
  id: string;
  name: string;
  zoomable: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
} | null>(null);

function isCardIdZoomable(id: string): boolean {
  if (currentLevel.value === 4) {
    const dn = resById.value[id];
    return dn ? canZoomDeployNode(dn) : false;
  }
  const el = byId.value[id];
  return el ? canZoomElement(el) : false;
}

function getCardDisplayName(id: string): string {
  return byId.value[id]?.name || resById.value[id]?.title || id;
}

function findNearestCardToPoint(
  stageX: number,
  stageY: number,
  maxDist = 36,
  preferZoomable = true,
  requireZoomable = false,
): {
  id: string;
  name: string;
  zoomable: boolean;
  rect: { x: number; y: number; w: number; h: number };
  anchorX: number;
  anchorY: number;
  dist: number;
} | null {
  let best: {
    id: string;
    name: string;
    zoomable: boolean;
    rect: { x: number; y: number; w: number; h: number };
    anchorX: number;
    anchorY: number;
    dist: number;
    score: number;
  } | null = null;

  for (const [id, r] of Object.entries(stageData.value.rects)) {
    if (r.bound) continue;
    const zoomable = isCardIdZoomable(id);
    if (requireZoomable && !zoomable) continue;

    const anchorX = Math.max(r.x, Math.min(r.x + r.w, stageX));
    const anchorY = Math.max(r.y, Math.min(r.y + r.h, stageY));
    const dist = Math.hypot(stageX - anchorX, stageY - anchorY);
    if (dist > maxDist) continue;

    // When in empty space, give zoomable cards a slight magnetic attraction advantage
    const score = dist === 0 ? 0 : preferZoomable && zoomable ? dist * 0.78 : dist;
    if (!best || score < best.score) {
      best = {
        id,
        name: getCardDisplayName(id),
        zoomable,
        rect: r,
        anchorX,
        anchorY,
        dist,
        score,
      };
    }
  }

  return best;
}

function hideProximityTetherDom() {
  if (proximityTetherSvgRef.value) {
    proximityTetherSvgRef.value.style.opacity = "0";
  }
}

function setProximityClassOnDom(nextId: string | null) {
  const stage = stageRef.value;
  if (!stage) return;
  if (!stageDomCache) rebuildStageDomCache();
  const cache = stageDomCache;
  if (!cache) return;
  for (let i = 0; i < cache.cards.length; i++) {
    const c = cache.cards[i]!;
    c.el.classList.toggle("tux-map__el--proximity", c.id === nextId);
  }
}

function renderProximityMatch(
  nearest: NonNullable<ReturnType<typeof findNearestCardToPoint>>,
  stageX: number,
  stageY: number,
  glideProgress = 0,
) {
  if (proximityCard.value?.id !== nearest.id) {
    clearPreZoomCardTransform();
    proximityCard.value = {
      id: nearest.id,
      name: nearest.name,
      zoomable: nearest.zoomable,
      x: nearest.rect.x,
      y: nearest.rect.y,
      w: nearest.rect.w,
      h: nearest.rect.h,
    };
    setProximityClassOnDom(nearest.id);
    if (!selectedId.value) {
      applyStageHighlight(nearest.id);
    }
  }

  const svgEl = proximityTetherSvgRef.value;
  const beamEl = proximityTetherBeamRef.value;
  const curDot = proximityCursorDotRef.value;
  const ancDot = proximityAnchorDotRef.value;
  if (svgEl && beamEl && curDot && ancDot) {
    if (nearest.dist > 3) {
      // As the user scrolls the wheel, glide the magnetic cursor dot along the path toward the card!
      const startX = stageX + (nearest.anchorX - stageX) * glideProgress * 0.75;
      const startY = stageY + (nearest.anchorY - stageY) * glideProgress * 0.75;
      const midX = (startX + nearest.anchorX) / 2;
      const midY = (startY + nearest.anchorY) / 2;
      const cardCx = nearest.rect.x + nearest.rect.w / 2;
      const cardCy = nearest.rect.y + nearest.rect.h / 2;
      const ctrlX = midX + (cardCx - midX) * 0.18;
      const ctrlY = midY + (cardCy - midY) * 0.18;
      beamEl.setAttribute(
        "d",
        `M${startX.toFixed(1)},${startY.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${nearest.anchorX.toFixed(1)},${nearest.anchorY.toFixed(1)}`,
      );
      curDot.setAttribute("cx", startX.toFixed(1));
      curDot.setAttribute("cy", startY.toFixed(1));
      ancDot.setAttribute("cx", nearest.anchorX.toFixed(1));
      ancDot.setAttribute("cy", nearest.anchorY.toFixed(1));
      const strength =
        glideProgress > 0
          ? Math.min(0.95, 0.45 + glideProgress * 0.5)
          : Math.max(0.28, 1 - nearest.dist / 42);
      svgEl.style.opacity = strength.toFixed(2);
    } else {
      svgEl.style.opacity = "0";
    }
  }
}

function updateProximityAtStagePoint(stageX: number, stageY: number) {
  if (activeTool.value !== "select" || isListView.value) {
    if (proximityCard.value) {
      proximityCard.value = null;
      setProximityClassOnDom(null);
    }
    hideProximityTetherDom();
    return;
  }

  const nearest = findNearestCardToPoint(stageX, stageY, 36, true, false);
  if (!nearest) {
    if (proximityCard.value) {
      proximityCard.value = null;
      setProximityClassOnDom(null);
      if (!selectedId.value && !currentHoveredId) {
        applyStageHighlight(null);
      }
    }
    hideProximityTetherDom();
    return;
  }

  renderProximityMatch(nearest, stageX, stageY, 0);
}

function onStagePointerOver(ev: PointerEvent) {
  if (activeTool.value !== "select") return;
  const card = (ev.target as HTMLElement | null)?.closest?.(".tux-map__el") as HTMLElement | null;
  const nextId = card?.dataset?.id ?? null;
  if (nextId === currentHoveredId) return;
  clearPreZoomCardTransform();
  currentHoveredId = nextId;
  if (selectedId.value) return;
  applyStageHighlight(nextId ?? proximityCard.value?.id ?? null);
}

function onStagePointerLeave() {
  clearPreZoomCardTransform();
  currentHoveredId = null;
  if (proximityCard.value) {
    proximityCard.value = null;
    setProximityClassOnDom(null);
  }
  hideProximityTetherDom();
  if (selectedId.value) return;
  applyStageHighlight(null);
}

watch([currentLevel, focusId, showPlanned, showBlastRadius, activeModel], () => {
  stageDomCache = null;
  proximityCard.value = null;
  hideProximityTetherDom();
  nextTick(() => {
    rebuildStageDomCache();
    applyStageHighlight(selectedId.value ?? currentHoveredId);
  });
});

watch([selectedId, matchingSearchIds, blastRadiusState], () => {
  nextTick(() => {
    applyStageHighlight(selectedId.value ?? currentHoveredId ?? proximityCard.value?.id ?? null);
  });
});

const portalRef = ref<HTMLDivElement | null>(null);
const viewportWidth = ref<number>(1280);
const panX = ref<number>(0);
const isPanningStage = ref<boolean>(false);
const zoomHudText = ref<string>("");
const zoomHudDirection = ref<"in" | "out">("in");
let zoomHudTimer: ReturnType<typeof setTimeout> | null = null;
let activeStageAnim: Animation | null = null;
let activePortalAnim: Animation | null = null;
let lastPointerClient: { x: number; y: number } | null = null;

function showZoomHud(direction: "in" | "out", label: string) {
  zoomHudDirection.value = direction;
  zoomHudText.value = label;
  if (zoomHudTimer) clearTimeout(zoomHudTimer);
  zoomHudTimer = setTimeout(() => {
    zoomHudText.value = "";
  }, 1150);
}

const fitScale = computed<number>(() => {
  const avail = Math.max(320, viewportWidth.value - 2);
  const W = stageData.value.width;
  return Math.min(1, Number((avail / W).toFixed(4)));
});

// Magnification (#106). The stage fits the width by default, which on a phone or a tablet, or under
// browser zoom, draws 14px text at 3-6px. "Larger" scales it past the fit and the viewport scrolls:
// a finger, a scrollbar or the arrow keys move it, with no dragging (WCAG 1.4.4, 2.5.7).
const MAGNIFY_SCALES = [0.5, 0.75, 1, 1.5, 2];
const zoomScale = ref<number | null>(null);
const stageScale = computed<number>(() =>
  zoomScale.value !== null && zoomScale.value > fitScale.value ? zoomScale.value : fitScale.value,
);
const isMagnified = computed<boolean>(() => stageScale.value > fitScale.value + 0.001);
const canMagnify = computed<boolean>(() => MAGNIFY_SCALES.some((m) => m > stageScale.value + 0.01));
const magnifyLabel = computed<string>(() =>
  isMagnified.value ? `${Math.round(stageScale.value * 100)}%` : "Fit",
);

function magnifyBy(dir: 1 | -1) {
  const s = stageScale.value;
  if (dir > 0) {
    const next = MAGNIFY_SCALES.find((m) => m > s + 0.01);
    if (next !== undefined) zoomScale.value = next;
  } else {
    const prev = [...MAGNIFY_SCALES].reverse().find((m) => m < s - 0.01 && m > fitScale.value + 0.001);
    zoomScale.value = prev ?? null;
  }
  afterMagnify();
  liveAnnouncement.value = isMagnified.value
    ? `Diagram at ${Math.round(stageScale.value * 100)}%: scroll or swipe to move around it`
    : "Diagram fitted to the width";
}

function magnifyFit() {
  zoomScale.value = null;
  afterMagnify();
  liveAnnouncement.value = "Diagram fitted to the width";
}

// Magnified, the viewport scrolls instead of the stage sliding (panX), so the slide goes and the
// selection is scrolled to; back at Fit, the slide that keeps it clear of the panel comes back
function afterMagnify() {
  nextTick(() => {
    if (isMagnified.value) {
      panX.value = 0;
      scrollSelectionIntoView();
    } else {
      keepClear(selectedId.value);
    }
  });
}

const computedViewportHeight = computed<string>(() => {
  if (props.height && props.height !== "auto") {
    return props.height;
  }
  const fitH = Math.max(440, Math.ceil(stageData.value.height * fitScale.value));
  if (!isMagnified.value) return `${fitH}px`;
  // magnified: tall enough to read, never taller than most of the screen; the rest scrolls
  return `max(${fitH}px, min(${Math.ceil(stageData.value.height * stageScale.value)}px, 75vh))`;
});

function measureViewport() {
  if (viewportRef.value && viewportRef.value.clientWidth > 0) {
    viewportWidth.value = viewportRef.value.clientWidth;
  }
}

/** The details panel follows the map instead of overlaying it: the list view, or a narrow map */
function panelFollowsMap(): boolean {
  if (isListView.value) return true;
  const el = panelRef.value;
  return Boolean(el && typeof window !== "undefined" && window.getComputedStyle(el).position === "static");
}

function keepClear(id: string | null) {
  const r = id ? stageData.value.rects[id] : undefined;
  let want = 0;
  if (panelFollowsMap()) id = null;
  // magnified, the viewport scrolls; sliding the stage under it as well would fight the scroll
  if (r && id && !isListView.value && !isMagnified.value) {
    const pWidth = panelRef.value?.offsetWidth || 380;
    const free = viewportWidth.value - pWidth - 36;
    const right = (r.x + r.w) * stageScale.value;
    if (right > free) {
      want = Math.max(
        -(stageData.value.width * stageScale.value - free),
        Math.round(free - right - 24),
      );
    }
  }
  if (want === panX.value) return;
  panX.value = want;
  isPanningStage.value = true;
  setTimeout(() => {
    isPanningStage.value = false;
  }, 260);
}

let resizeObserver: ResizeObserver | null = null;
// a touch screen gets help that speaks of taps and swipes, not hover and the mouse wheel
const coarsePointer = ref<boolean>(false);
let coarseQuery: MediaQueryList | null = null;
const onCoarseChange = () => {
  coarsePointer.value = Boolean(coarseQuery?.matches);
};

// The help names the wheel only as it works here: a plain wheel zooms unless
// `wheelZoom` is off or the diagram is magnified, where it scrolls and zooming
// needs Ctrl (a trackpad pinch sends it too). It counts the levels this map has.
const wheelZooms = computed<boolean>(() => props.wheelZoom && !isMagnified.value);
const hintText = computed<string>(() => {
  const scroll = wheelZooms.value ? "scroll" : "Ctrl+scroll";
  if (isListView.value) {
    return "Choose an item to see what it depends on, what uses it and its details. The level buttons go in and out.";
  }
  if (currentLevel.value === 4) {
    const deeper = stageData.value.deployNodes.some((n) => canZoomDeployNode(n));
    return coarsePointer.value
      ? "Tap a deployment resource to see its connections, firewall rules and hosted containers." +
          (deeper ? " Double-tap a '+' node, or use the level buttons, to go inside it." : "")
      : "Choose a deployment resource to draw its connections and inspect its firewall rules and hosted containers." +
          (deeper ? ` Double-click or ${scroll} up on nodes with '+' to drill into Level 5 internal modules/schemas.` : "");
  }
  // '+' talk only where a card in view has a '+': the bottom of the code has none
  const deeper = renderedCards.value.some((c) => c.zoomable);
  if (coarsePointer.value) {
    return (
      "Tap a card to see its links and details." +
      (deeper ? " Double-tap a '+' card, or use the level buttons, to go inside it." : " The level buttons go in and out.") +
      " Larger magnifies the diagram; then swipe to move around it."
    );
  }
  if (currentLevel.value >= 5) {
    return deeper
      ? `Inspecting deep internal modules & code symbols. Double-click or ${scroll} up on '+' cards to drill deeper, or ${scroll} down / press Escape to return to the parent level.`
      : `Inspecting deep internal modules & code symbols. ${wheelZooms.value ? "Scroll" : "Ctrl+scroll"} down or press Escape to return to the parent level.`;
  }
  const levels = `Levels 1–${maxAvailableLevel.value}`;
  return wheelZooms.value
    ? `Hover over any card to highlight its links, or scroll the mouse wheel over a card (or double-click / press +) to zoom in and out across ${levels}.`
    : `Hover over any card to highlight its links, or hold Ctrl and scroll over a card (or double-click / press +) to zoom in and out across ${levels}.`;
});

function onWindowKeydown(ev: KeyboardEvent) {
  if (ev.defaultPrevented || typeof document === "undefined") return;
  const root = mapRootRef.value;
  if (!root || !root.isConnected) return;
  const t = ev.target;
  if (t instanceof Node && root.contains(t)) return;
  if (t !== document.body && t !== document.documentElement && t !== window) return;
  if (document.querySelector(".tux-map") !== root) return;
  if ((ev.metaKey || ev.ctrlKey) && !ev.altKey && (ev.key === "k" || ev.key === "K")) {
    ev.preventDefault();
    if (goToOpen.value) closeGoToPalette(true);
    else openGoToPalette();
    return;
  }
  if (ev.key === "/" && !goToOpen.value && !ev.metaKey && !ev.ctrlKey && !ev.altKey) {
    ev.preventDefault();
    openGoToPalette();
  }
}

onMounted(() => {
  applyAutoListView();
  measureViewport();
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onWindowKeydown);
    if (window.matchMedia) {
      coarseQuery = window.matchMedia("(pointer: coarse)");
      onCoarseChange();
      coarseQuery.addEventListener?.("change", onCoarseChange);
    }
  }
  if (typeof ResizeObserver !== "undefined" && viewportRef.value) {
    resizeObserver = new ResizeObserver(() => {
      measureViewport();
    });
    resizeObserver.observe(viewportRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onWindowKeydown);
  }
  coarseQuery?.removeEventListener?.("change", onCoarseChange);
  if (zoomHudTimer) clearTimeout(zoomHudTimer);
  if (announceTimer) clearTimeout(announceTimer);
  if (laserRaf !== null && typeof window !== "undefined") {
    window.cancelAnimationFrame(laserRaf);
  }
});

function resolveItemById(id: string | null): TuxMapLevelElement | TuxMapDeploymentNode | null {
  if (!id) return null;
  if (currentLevel.value === 4) {
    return resById.value[id] ?? byId.value[id] ?? null;
  }
  return byId.value[id] ?? resById.value[id] ?? null;
}

function setSelectionAndEmit(id: string | null) {
  const prev = selectedId.value;
  selectedId.value = id;

  // Issue #103 (1): Selecting a container on Level 2 (or Level 4 host) that has Level 3 children sets `focusId`
  if (id) {
    if (currentLevel.value === 2 && (activeModel.value.level3[id]?.length ?? 0) > 0) {
      focusId.value = id;
    } else if (currentLevel.value === 4 && resById.value[id]?.hosts) {
      const hostedContainer = resById.value[id]!.hosts!.find(
        (cid) => (activeModel.value.level3[cid]?.length ?? 0) > 0,
      );
      if (hostedContainer) {
        focusId.value = hostedContainer;
      }
    }
  }

  if (id !== prev) {
    emit("update:selectedId", id);
    emit("node-select", resolveItemById(id));
  }
}

function selectElement(id: string | null) {
  if (activeTool.value !== "select") return;
  const prev = selectedId.value;
  currentHoveredId = null;
  setSelectionAndEmit(id);
  applyStageHighlight(id);

  // When the details follow the map (the list, a phone's default, or a narrow map), they are out of
  // sight below it: take focus there, and back
  if (panelFollowsMap()) {
    nextTick(() => {
      const root = panelRef.value?.closest(".tux-map");
      if (id) {
        (panelRef.value?.querySelector(".tux-map__panel-title") as HTMLElement | null)?.focus();
      } else if (prev) {
        // the list item, or in the diagram the card itself (the hidden diagram's cards stay in the list's DOM)
        const sel = isListView.value ? "[data-list-id]" : ".tux-map__el[data-id]";
        const items = root?.querySelectorAll<HTMLElement>(sel) ?? [];
        [...items].find((el) => (el.dataset.listId ?? el.dataset.id) === prev)?.focus();
      }
    });
  }

  if (!id) {
    keepClear(null);
    return;
  }

  nextTick(() => {
    keepClear(id);
  });
}

function goToLevel(
  nextLevel: TuxMapLevelNumber,
  opts: {
    nextFocus?: string | null;
    nextSel?: string | null;
    fromCardId?: string | null;
    targetCardId?: string | null;
    inward?: boolean;
    hudLabel?: string;
  } = {},
) {
  const prevLevel = currentLevel.value;
  const prevScale = stageScale.value;
  const prevPanX = panX.value;
  const prevFocus = focusId.value;
  const inward = opts.inward ?? nextLevel > prevLevel;

  // Capture outgoing card / boundary viewport rectangle BEFORE switching levels
  let fromViewportRect: {
    x: number;
    y: number;
    w: number;
    h: number;
    cx: number;
    cy: number;
  } | null = null;

  if (opts.fromCardId && stageData.value.rects[opts.fromCardId]) {
    const r = stageData.value.rects[opts.fromCardId]!;
    fromViewportRect = {
      x: prevPanX + r.x * prevScale,
      y: r.y * prevScale,
      w: r.w * prevScale,
      h: r.h * prevScale,
      cx: prevPanX + (r.x + r.w / 2) * prevScale,
      cy: (r.y + r.h / 2) * prevScale,
    };
  } else if (!inward && stageData.value.bounds.length > 0) {
    const b = stageData.value.bounds[0]!;
    fromViewportRect = {
      x: prevPanX + b.x * prevScale,
      y: b.y * prevScale,
      w: b.w * prevScale,
      h: b.h * prevScale,
      cx: prevPanX + (b.x + b.w / 2) * prevScale,
      cy: (b.y + b.h / 2) * prevScale,
    };
  }

  currentLevel.value = nextLevel;
  if (opts.nextFocus !== undefined) {
    focusId.value = opts.nextFocus;
  } else if (nextLevel === 3 && !focusId.value) {
    const firstZoomable = activeModel.value.level2.elements.find(
      (e) => !e.ref && (activeModel.value.level3[e.id]?.length ?? 0) > 0,
    );
    focusId.value = firstZoomable?.id ?? null;
  }

  panX.value = 0;
  setSelectionAndEmit(opts.nextSel ?? null);
  currentHoveredId = null;
  emit("update:level", nextLevel);

  const resolvedHud =
    opts.hudLabel ||
    `Level ${prevLevel} → Level ${nextLevel}${
      nextLevel === 3 && focusId.value && byId.value[focusId.value]
        ? ` · ${byId.value[focusId.value]!.name}`
        : ""
    }`;
  showZoomHud(inward ? "in" : "out", resolvedHud);

  nextTick(() => {
    rebuildStageDomCache();
    if (opts.nextSel) {
      keepClear(opts.nextSel);
    }

    // Re-evaluate hovered & proximity-attached card under stationary cursor after level switch
    if (
      lastPointerClient &&
      typeof document !== "undefined" &&
      !selectedId.value &&
      activeTool.value === "select"
    ) {
      const underEl =
        typeof document.elementFromPoint === "function"
          ? (document.elementFromPoint(
              lastPointerClient.x,
              lastPointerClient.y,
            ) as HTMLElement | null)
          : null;
      const cardUnder = underEl?.closest?.(".tux-map__el") as HTMLElement | null;
      currentHoveredId = cardUnder?.dataset?.id ?? null;
      const ptAfter = getStageCoordsFromClient(lastPointerClient.x, lastPointerClient.y);
      updateProximityAtStagePoint(ptAfter.x, ptAfter.y);
      applyStageHighlight(currentHoveredId ?? proximityCard.value?.id ?? null);
    }

    if (
      isListView.value ||
      isMagnified.value ||
      (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    const stage = stageRef.value;
    if (!stage || typeof stage.animate !== "function") return;

    const nextScale = stageScale.value;
    const nextPanX = panX.value;

    // Resolve target card or boundary on the incoming level
    const resolvedTargetId =
      opts.targetCardId ||
      (!inward && prevLevel === 3 ? prevFocus : null) ||
      (!inward && prevLevel === 2 ? activeModel.value.level2.boundary : null) ||
      opts.nextSel ||
      null;

    const rTarget = resolvedTargetId ? stageData.value.rects[resolvedTargetId] : undefined;
    const bNext = stageData.value.bounds[0];

    let toViewportRect: {
      x: number;
      y: number;
      w: number;
      h: number;
      cx: number;
      cy: number;
    };

    if (!inward && rTarget) {
      toViewportRect = {
        x: nextPanX + rTarget.x * nextScale,
        y: rTarget.y * nextScale,
        w: rTarget.w * nextScale,
        h: rTarget.h * nextScale,
        cx: nextPanX + (rTarget.x + rTarget.w / 2) * nextScale,
        cy: (rTarget.y + rTarget.h / 2) * nextScale,
      };
    } else if (inward && rTarget) {
      toViewportRect = {
        x: nextPanX + rTarget.x * nextScale,
        y: rTarget.y * nextScale,
        w: rTarget.w * nextScale,
        h: rTarget.h * nextScale,
        cx: nextPanX + (rTarget.x + rTarget.w / 2) * nextScale,
        cy: (rTarget.y + rTarget.h / 2) * nextScale,
      };
    } else if (bNext) {
      toViewportRect = {
        x: nextPanX + bNext.x * nextScale,
        y: bNext.y * nextScale,
        w: bNext.w * nextScale,
        h: bNext.h * nextScale,
        cx: nextPanX + (bNext.x + bNext.w / 2) * nextScale,
        cy: (bNext.y + bNext.h / 2) * nextScale,
      };
    } else {
      toViewportRect = {
        x: nextPanX + 24 * nextScale,
        y: 24 * nextScale,
        w: (stageData.value.width - 48) * nextScale,
        h: (stageData.value.height - 48) * nextScale,
        cx: nextPanX + (stageData.value.width / 2) * nextScale,
        cy: (stageData.value.height / 2) * nextScale,
      };
    }

    // Stage focal point in incoming stage coordinates
    const focalStageX =
      !inward && rTarget
        ? rTarget.x + rTarget.w / 2
        : bNext
          ? bNext.x + bNext.w / 2
          : stageData.value.width / 2;
    const focalStageY =
      !inward && rTarget
        ? rTarget.y + rTarget.h / 2
        : bNext
          ? bNext.y + bNext.h / 2
          : stageData.value.height / 2;

    const anchorViewportX = fromViewportRect ? fromViewportRect.cx : toViewportRect.cx;
    const anchorViewportY = fromViewportRect ? fromViewportRect.cy : toViewportRect.cy;

    const startScale = nextScale * (inward ? 0.42 : 1.82);
    const startTx = Math.round(anchorViewportX - focalStageX * startScale);
    const startTy = Math.round(anchorViewportY - focalStageY * startScale);

    activeStageAnim?.cancel();
    activeStageAnim = stage.animate(
      [
        {
          transform: `translate3d(${startTx}px, ${startTy}px, 0) scale(${startScale})`,
          opacity: 0,
        },
        {
          transform: `translate3d(${nextPanX}px, 0px, 0) scale(${nextScale})`,
          opacity: 1,
        },
      ],
      {
        duration: 380,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );

    // Portal frame expanding from hovered card -> new boundary (or contracting boundary -> parent card)
    const portal = portalRef.value;
    if (portal && fromViewportRect && typeof portal.animate === "function") {
      activePortalAnim?.cancel();
      portal.style.display = "block";
      activePortalAnim = portal.animate(
        [
          {
            transform: `translate3d(${Math.round(fromViewportRect.x)}px, ${Math.round(fromViewportRect.y)}px, 0)`,
            width: `${Math.max(40, Math.round(fromViewportRect.w))}px`,
            height: `${Math.max(28, Math.round(fromViewportRect.h))}px`,
            opacity: 0.92,
          },
          {
            transform: `translate3d(${Math.round(toViewportRect.x)}px, ${Math.round(toViewportRect.y)}px, 0)`,
            width: `${Math.max(40, Math.round(toViewportRect.w))}px`,
            height: `${Math.max(28, Math.round(toViewportRect.h))}px`,
            opacity: 0,
          },
        ],
        {
          duration: 420,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
      );
      activePortalAnim.onfinish = () => {
        if (portal) portal.style.display = "none";
      };
    }

    // Vue Flow–style staggered spring node reveal across incoming cards
    if (stageDomCache?.cards) {
      const cards = stageDomCache.cards;
      for (let i = 0; i < cards.length; i++) {
        const cardEl = cards[i]!.el;
        if (typeof cardEl.animate === "function") {
          cardEl.animate(
            [
              {
                transform: inward
                  ? "translate3d(0, 10px, 0) scale(0.92)"
                  : "translate3d(0, -8px, 0) scale(1.06)",
                opacity: 0.25,
              },
              {
                transform: "translate3d(0, 0, 0) scale(1)",
                opacity: 1,
              },
            ],
            {
              duration: 340,
              delay: Math.min(140, i * 16),
              easing: "cubic-bezier(0.22, 1.28, 0.36, 1)",
              fill: "both",
            },
          );
        }
      }
    }

    // Pulse the landed card when zooming out (or when focusing a specific host on Level 4)
    if (resolvedTargetId) {
      const landedCard = queryCardById(stage, resolvedTargetId);
      if (landedCard && typeof landedCard.animate === "function") {
        landedCard.animate(
          [
            {
              boxShadow:
                "0 0 0 0px color-mix(in srgb, var(--brand-primary) 75%, transparent), 0 12px 28px rgba(0, 0, 0, 0.22)",
            },
            {
              boxShadow:
                "0 0 0 8px color-mix(in srgb, var(--brand-primary) 0%, transparent), 0 2px 6px rgba(0, 0, 0, 0.08)",
            },
          ],
          {
            duration: 620,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
        );
      }
    }
  });
}

/** Go to where `id` lives: the level that shows it among its siblings, with it chosen. */
function revealElement(id: string) {
  const p = parentOf.value.get(id);
  if (!p) return;
  const lvl = levelForFocus(p);
  const name = byId.value[id]?.name || id;
  drillStack.value = lvl >= 5 ? drillStackFor(p) : [];
  goToLevel(lvl, {
    nextFocus: p,
    nextSel: id,
    targetCardId: id,
    inward: lvl >= currentLevel.value,
    hudLabel: `Level ${currentLevel.value} → Level ${lvl} · ${name}`,
  });
  liveAnnouncement.value = `Went to Level ${lvl}: ${name}.`;
  nextTick(() => {
    if (typeof document === "undefined") return;
    const active = document.activeElement;
    if (!active || active === document.body || mapRootRef.value?.contains(active)) {
      if (isListView.value) {
        queryListCardById(mapRootRef.value, id)?.focus({ preventScroll: true });
      } else {
        queryCardById(stageRef.value, id)?.focus({ preventScroll: true });
      }
    }
  });
}

function isCurrentViewChild(id: string): boolean {
  if (currentLevel.value === 4) {
    return stageData.value.deployNodes.some((n) => n.id === id);
  }
  const stageEl = stageData.value.els.find((x) => x.id === id);
  if (stageEl) return !stageEl.side;
  if (currentLevel.value === 3 || currentLevel.value >= 5) {
    return Boolean(focusId.value && parentOf.value.get(id) === focusId.value);
  }
  return true;
}

function fractalZoomLevelFor(id: string): number {
  if (isCurrentViewChild(id)) {
    return currentLevel.value >= 5 ? currentLevel.value + 1 : 5;
  }
  return Math.max(5, levelForFocus(id));
}

function zoomBucketTitleFor(id: string, mini: boolean): string {
  const scroll = wheelZooms.value ? "Scroll up" : "Ctrl+scroll up";
  if (mini && currentLevel.value >= 5 && parentOf.value.has(id)) {
    const insideLvl = fractalZoomLevelFor(id);
    const stratum = getSubgraphForNode(id)?.stratum || "inside";
    const homeParent = parentOf.value.get(id)!;
    const homeLvl = levelForFocus(homeParent);
    return `${scroll} or press + to open Level ${insideLvl} (${stratum}); double-click to go to Level ${homeLvl} where it lives`;
  }
  return `${scroll} or double-click to zoom in a level`;
}

function zoomIntoElement(id: string) {
  const e = byId.value[id];
  const dn = resById.value[id];
  const itemName = e?.name || dn?.title || id;

  // Fractal Subgraph Drill-Down (Level 3 component -> Level 5, Level 4 host -> Level 5, Level 5 -> Level 6+)
  if (currentLevel.value >= 3 && hasFractalSubgraph(id)) {
    const inCurrentView = isCurrentViewChild(id);
    const nextLvl = inCurrentView
      ? currentLevel.value >= 5
        ? currentLevel.value + 1
        : 5
      : Math.max(5, levelForFocus(id));
    drillStack.value = inCurrentView
      ? [
          ...drillStack.value,
          { level: currentLevel.value, focusId: focusId.value || "" },
        ]
      : drillStackFor(id);
    const sg = getSubgraphForNode(id);
    emit("drill-down", { level: nextLvl, focusId: id, subgraph: sg });
    goToLevel(nextLvl, {
      nextFocus: id,
      nextSel: null,
      fromCardId: id,
      inward: true,
      hudLabel: `Level ${currentLevel.value} → Level ${nextLvl} · ${itemName}`,
    });
    liveAnnouncement.value = `Zoomed in to Level ${nextLvl}: ${sg?.stratum || itemName}.`;
    return;
  }

  if (!e) return;

  if (currentLevel.value === 1) {
    const isBoundarySystem = id === activeModel.value.level2.boundary || canZoomElement(e);
    goToLevel(2, {
      nextFocus: focusId.value,
      nextSel: isBoundarySystem ? null : id,
      fromCardId: id,
      inward: true,
      hudLabel: `Level 1 → Level 2 · ${e.name}`,
    });
    liveAnnouncement.value = "Zoomed in to Level 2: containers and services.";
    return;
  }

  if (currentLevel.value === 2) {
    if (canZoomElement(e)) {
      goToLevel(3, {
        nextFocus: id,
        nextSel: null,
        fromCardId: id,
        inward: true,
        hudLabel: `Level 2 → Level 3 · ${e.name}`,
      });
      liveAnnouncement.value = `Zoomed in to Level 3: internal components of ${e.name}.`;
      return;
    }
    const deployedHosts = normalizeArray(e.deployed);
    if (deployedHosts.length > 0) {
      goToLevel(4, {
        nextSel: deployedHosts[0] ?? null,
        fromCardId: id,
        targetCardId: deployedHosts[0] ?? null,
        inward: true,
        hudLabel: `Level 2 → Level 4 · ${e.name}`,
      });
      liveAnnouncement.value = `Zoomed in to Level 4: deployment infrastructure for ${e.name}.`;
      return;
    }
    const r = stageData.value.rects[id];
    const nearestZoomable = findNearestCardToPoint(
      r ? r.x + r.w / 2 : stageData.value.width / 2,
      r ? r.y + r.h / 2 : stageData.value.height / 2,
      Infinity,
      true,
      true,
    );
    if (nearestZoomable) {
      goToLevel(3, {
        nextFocus: nearestZoomable.id,
        nextSel: null,
        fromCardId: nearestZoomable.id,
        inward: true,
        hudLabel: `Level 2 → Level 3 · ${nearestZoomable.name}`,
      });
      liveAnnouncement.value = `Zoomed in to Level 3: internal components of ${nearestZoomable.name}.`;
    }
    return;
  }

  if (currentLevel.value === 3) {
    const parentContainer = focusId.value ? byId.value[focusId.value] : undefined;
    const hostIds = [
      ...normalizeArray(e.deployed),
      ...normalizeArray(parentContainer?.deployed),
    ];
    const targetHostId = hostIds.find((hid) => Boolean(resById.value[hid])) ?? null;
    goToLevel(4, {
      nextSel: targetHostId,
      fromCardId: id,
      targetCardId: targetHostId,
      inward: true,
      hudLabel: `Level 3 → Level 4 · ${
        targetHostId && resById.value[targetHostId]
          ? resById.value[targetHostId]!.title
          : e.name
      }`,
    });
    liveAnnouncement.value = "Zoomed in to Level 4: deployment and infrastructure.";
  }
}

function zoomOutLevel(fromHoveredId?: string | null) {
  if (currentLevel.value >= 5) {
    const currentF = focusId.value;
    const prevEntry = drillStack.value[drillStack.value.length - 1];
    if (prevEntry) {
      drillStack.value = drillStack.value.slice(0, -1);
      const prevName =
        byId.value[prevEntry.focusId]?.name ||
        resById.value[prevEntry.focusId]?.title ||
        (prevEntry.level === 4 ? "Infrastructure & Deployment" : `Level ${prevEntry.level}`);
      goToLevel(prevEntry.level, {
        nextFocus: prevEntry.focusId || focusId.value,
        nextSel: null,
        fromCardId: fromHoveredId ?? null,
        targetCardId: currentF,
        inward: false,
        hudLabel: `Level ${currentLevel.value} → Level ${prevEntry.level} · ${prevName}`,
      });
      liveAnnouncement.value = `Zoomed out to Level ${prevEntry.level}.`;
      return;
    }
    // Fallback if entered Level 5+ directly without drillStack: the focus's parent
    const isDeployParent = Boolean(currentF && resById.value[currentF]);
    const up = currentF ? parentOf.value.get(currentF) : undefined;
    const targetLevel = isDeployParent ? 4 : up ? levelForFocus(up) : 3;
    if (up && targetLevel >= 5) drillStack.value = drillStackFor(up);
    goToLevel(targetLevel, {
      nextFocus: isDeployParent ? focusId.value : up || currentF?.split("/")[0] || focusId.value,
      nextSel: null,
      fromCardId: fromHoveredId ?? null,
      targetCardId: currentF,
      inward: false,
      hudLabel: `Level ${currentLevel.value} → Level ${targetLevel}`,
    });
    liveAnnouncement.value = `Zoomed out to Level ${targetLevel}.`;
    return;
  }

  if (currentLevel.value === 4) {
    const node = fromHoveredId
      ? resById.value[fromHoveredId]
      : selectedId.value
        ? resById.value[selectedId.value]
        : undefined;
    const hostedContainer = node?.hosts?.find(
      (cid) => (activeModel.value.level3[cid]?.length ?? 0) > 0,
    );
    const targetFocus = hostedContainer || focusId.value;
    if (targetFocus && (activeModel.value.level3[targetFocus]?.length ?? 0) > 0) {
      const cName = byId.value[targetFocus]?.name ?? targetFocus;
      goToLevel(3, {
        nextFocus: targetFocus,
        nextSel: null,
        fromCardId: node?.id ?? null,
        inward: false,
        hudLabel: `Level 4 → Level 3 · ${cName}`,
      });
      liveAnnouncement.value = `Zoomed out to Level 3: ${cName}.`;
    } else {
      goToLevel(2, {
        nextSel: null,
        fromCardId: node?.id ?? null,
        targetCardId: node?.hosts?.[0] ?? null,
        inward: false,
        hudLabel: "Level 4 → Level 2 · Containers & services",
      });
      liveAnnouncement.value = "Zoomed out to Level 2.";
    }
  } else if (currentLevel.value === 3) {
    const f = focusId.value;
    const cName = f && byId.value[f] ? byId.value[f]!.name : "Containers";
    goToLevel(2, {
      nextFocus: f,
      nextSel: null,
      fromCardId: fromHoveredId ?? null,
      targetCardId: f,
      inward: false,
      hudLabel: `Level 3 → Level 2 · ${cName}`,
    });
    liveAnnouncement.value = "Zoomed out to Level 2.";
  } else if (currentLevel.value === 2) {
    const sysId = activeModel.value.level2.boundary;
    const sysName = byId.value[sysId]?.name ?? "System context";
    goToLevel(1, {
      nextSel: null,
      fromCardId: fromHoveredId ?? null,
      targetCardId: sysId,
      inward: false,
      hudLabel: `Level 2 → Level 1 · ${sysName}`,
    });
    liveAnnouncement.value = "Zoomed out to Level 1.";
  }
}

function openLevel3FromToolbar() {
  const candidate =
    selectedId.value && (activeModel.value.level3[selectedId.value]?.length ?? 0) > 0
      ? selectedId.value
      : focusId.value;
  if (!candidate) return;
  goToLevel(3, {
    nextFocus: candidate,
    fromCardId: currentLevel.value === 2 ? candidate : null,
    inward: currentLevel.value < 3,
  });
}

const currentStratumShort = computed(() => {
  if (currentLevel.value === 1) return "Ecosystem";
  if (currentLevel.value === 2) return "Containers";
  if (currentLevel.value === 3) {
    return (focusId.value && byId.value[focusId.value]?.name) || "Components";
  }
  if (currentLevel.value === 4) return "Infrastructure";
  return getSubgraphForNode(focusId.value)?.stratum || `Level ${currentLevel.value}`;
});

const stepInTargetId = computed<string | null>(() => {
  const sel = selectedId.value;
  if (sel) {
    const e = byId.value[sel];
    const dn = resById.value[sel];
    if ((e && canZoomElement(e)) || (dn && canZoomDeployNode(dn))) {
      return sel;
    }
  }
  if (currentLevel.value === 1) {
    return activeModel.value.level2.boundary || null;
  }
  if (currentLevel.value === 2) {
    if (focusId.value && (activeModel.value.level3[focusId.value]?.length ?? 0) > 0) {
      return focusId.value;
    }
    return null;
  }
  if (currentLevel.value === 3) {
    const fractalChild = stageData.value.els.find((e) => !e.mini && hasFractalSubgraph(e.id));
    if (fractalChild) return fractalChild.id;
    return stageData.value.els.find((e) => !e.mini)?.id ?? null;
  }
  if (currentLevel.value === 4) {
    const fractalDeploy = stageData.value.deployNodes.find((n) => hasFractalSubgraph(n.id));
    return fractalDeploy?.id ?? null;
  }
  const deeperChild = stageData.value.els.find((e) => !e.mini && hasFractalSubgraph(e.id));
  return deeperChild?.id ?? null;
});

const canStepIn = computed(() => Boolean(stepInTargetId.value));

// `+` acts on the card keyboard focus is on, never on the selection: a keyboard
// user who tabs to a card means that card, whatever was clicked before.
function cardIdOf(target: EventTarget | null): string | null {
  const card = (target as Element | null)?.closest?.(".tux-map__el") as HTMLElement | null;
  return card?.dataset.id ?? null;
}

function canZoomCard(id: string): boolean {
  const e = byId.value[id];
  const dn = resById.value[id];
  return Boolean((e && canZoomElement(e)) || (dn && canZoomDeployNode(dn)));
}

function stepInLevel() {
  const target = stepInTargetId.value;
  if (!target) return;
  if (currentLevel.value === 2 && target === focusId.value && !selectedId.value) {
    openLevel3FromToolbar();
    return;
  }
  zoomIntoElement(target);
}

function toggleInfrastructureView() {
  if (currentLevel.value === 4) {
    zoomOutLevel();
  } else {
    drillStack.value = [];
    goToLevel(4, {
      inward: true,
      hudLabel: `Level ${currentLevel.value} → Level 4 · Infrastructure`,
    });
  }
}

let lastWheelZoomAt = 0;
let lastWheelEventAt = 0;
let wheelDeltaAccum = 0;
let preZoomCardEl: HTMLElement | null = null;
let lockedWheelCardId: string | null = null;

function clearPreZoomCardTransform() {
  if (preZoomCardEl) {
    preZoomCardEl.style.transform = "";
    preZoomCardEl = null;
  }
  if (proximityFrameRef.value) {
    proximityFrameRef.value.style.transform = "";
  }
}

function onViewportWheel(ev: WheelEvent) {
  lastPointerClient = { x: ev.clientX, y: ev.clientY };

  const isPinchOrMod = ev.ctrlKey || ev.metaKey;
  // magnified, the wheel scrolls the diagram; a trackpad pinch (ctrl) still changes level
  if (isMagnified.value && !isPinchOrMod) return;
  if (!props.wheelZoom && !isPinchOrMod) {
    clearPreZoomCardTransform();
    return;
  }

  // Always suppress native browser page scroll while the cursor is inside the diagram viewport
  // so moving the mouse or hitting Level 1 / Level 4 bounds never jerks the surrounding page.
  ev.preventDefault();
  ev.stopPropagation();

  const pt = getStageCoordsFromClient(ev.clientX, ev.clientY);
  updateProximityAtStagePoint(pt.x, pt.y);

  const targetEl = (ev.target as HTMLElement | null)?.closest?.(
    ".tux-map__el",
  ) as HTMLElement | null;

  const isZoomIn = ev.deltaY < 0;
  const isZoomOut = ev.deltaY > 0;
  const now = Date.now();

  // Cooldown lock after a level transition so trackpad inertia doesn't skip multiple levels
  if (now - lastWheelZoomAt < 520) {
    return;
  }

  if (now - lastWheelEventAt > 240) {
    wheelDeltaAccum = 0;
    lockedWheelCardId = null;
  }

  // When a wheel gesture begins anywhere on the canvas, always find the closest card to the cursor
  // (requiring a zoomable card when zooming in) so we never fall back to a stale memory of `focusId`
  const directCardId = targetEl?.dataset?.id ?? null;
  if (!lockedWheelCardId) {
    if (directCardId && (!isZoomIn || isCardIdZoomable(directCardId))) {
      lockedWheelCardId = directCardId;
    } else {
      const closestMatch =
        findNearestCardToPoint(pt.x, pt.y, Infinity, isZoomIn, isZoomIn) ||
        findNearestCardToPoint(pt.x, pt.y, Infinity, isZoomIn, false);
      lockedWheelCardId =
        closestMatch?.id ||
        proximityCard.value?.id ||
        currentHoveredId ||
        selectedId.value ||
        null;
    }
  }

  const candidateId =
    lockedWheelCardId ||
    directCardId ||
    proximityCard.value?.id ||
    currentHoveredId ||
    selectedId.value;
  const canZoomInCandidate =
    currentLevel.value < 4 ||
    Boolean(candidateId && hasFractalSubgraph(candidateId));

  // Boundary check: if already at deepest available level (zooming in) or Level 1 (zooming out),
  // absorb the wheel without scrolling the page.
  if (isZoomIn && !canZoomInCandidate) {
    clearPreZoomCardTransform();
    wheelDeltaAccum = 0;
    return;
  }
  if (isZoomOut && currentLevel.value <= 1) {
    clearPreZoomCardTransform();
    wheelDeltaAccum = 0;
    return;
  }

  lastWheelEventAt = now;
  wheelDeltaAccum += ev.deltaY;

  // Visually attach the magnetic frame to the closest card and glide the magnetic cursor dot
  // along the tether toward that card as the wheel turns. Under reduced motion nothing
  // glides or pulls: the wheel still counts toward the level change (2.3.3).
  const still =
    typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const progress = still ? 0 : Math.min(1, Math.abs(wheelDeltaAccum) / 26);
  if (candidateId && stageData.value.rects[candidateId]) {
    const r = stageData.value.rects[candidateId]!;
    const anchorX = Math.max(r.x, Math.min(r.x + r.w, pt.x));
    const anchorY = Math.max(r.y, Math.min(r.y + r.h, pt.y));
    const dist = Math.hypot(pt.x - anchorX, pt.y - anchorY);
    renderProximityMatch(
      {
        id: candidateId,
        name: getCardDisplayName(candidateId),
        zoomable: isCardIdZoomable(candidateId),
        rect: r,
        anchorX,
        anchorY,
        dist,
      },
      pt.x,
      pt.y,
      progress,
    );
  }

  // Physical pre-zoom response: attach to the closest card, pull it slightly along the
  // cursor vector, and scale it as the wheel turns
  const activeCardEl =
    (candidateId ? queryCardById(stageRef.value, candidateId) : null) || targetEl;

  if (activeCardEl && Math.abs(wheelDeltaAccum) < 26) {
    if (still) {
      clearPreZoomCardTransform();
      return;
    }
    if (preZoomCardEl && preZoomCardEl !== activeCardEl) {
      preZoomCardEl.style.transform = "";
    }
    preZoomCardEl = activeCardEl;
    const r = candidateId ? stageData.value.rects[candidateId] : undefined;
    const cardCx = r ? r.x + r.w / 2 : pt.x;
    const cardCy = r ? r.y + r.h / 2 : pt.y;
    const pullSign = isZoomIn ? 0.14 : -0.09;
    const pullX = Math.max(-14, Math.min(14, (pt.x - cardCx) * progress * pullSign));
    const pullY = Math.max(-10, Math.min(10, (pt.y - cardCy) * progress * pullSign));
    const scaleDelta = isZoomIn
      ? 1 + Math.min(0.068, Math.abs(wheelDeltaAccum) / 360)
      : 1 - Math.min(0.052, Math.abs(wheelDeltaAccum) / 380);
    const tf = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0) scale(${scaleDelta.toFixed(3)})`;
    activeCardEl.style.transform = tf;
    if (proximityFrameRef.value && proximityCard.value?.id === candidateId) {
      proximityFrameRef.value.style.transform = tf;
    }
    return;
  }

  if (Math.abs(wheelDeltaAccum) < 26) {
    return;
  }

  clearPreZoomCardTransform();
  wheelDeltaAccum = 0;
  lastWheelZoomAt = now;
  const resolvedId = candidateId;
  lockedWheelCardId = null;

  if (isZoomIn) {
    let id = resolvedId;
    if (!id) {
      id = findNearestCardToPoint(pt.x, pt.y, Infinity, true, true)?.id ?? null;
    }
    if (!id && currentLevel.value === 1) {
      id = activeModel.value.level2.boundary;
    } else if (!id && currentLevel.value === 3) {
      id = stageData.value.els.find((e) => !e.mini)?.id ?? stageData.value.els[0]?.id ?? null;
    }
    if (id && (byId.value[id] || resById.value[id])) {
      zoomIntoElement(id);
    } else if (currentLevel.value === 3) {
      goToLevel(4, { inward: true, hudLabel: "Level 3 → Level 4 · Deployment" });
    }
  } else {
    zoomOutLevel(resolvedId);
  }
}

function jumpToSearchEntry(entry: TuxMapSearchEntry) {
  const targetId = entry.revealId || entry.id;
  goToOpen.value = false;
  goToReturnFocusEl = null;

  const M = activeModel.value;
  if (parentOf.value.has(targetId)) {
    revealElement(targetId);
  } else if (M.level2.elements.some((e) => !e.ref && e.id === targetId)) {
    drillStack.value = [];
    goToLevel(2, {
      nextSel: targetId,
      targetCardId: targetId,
      inward: currentLevel.value < 2,
      hudLabel: `Level ${currentLevel.value} → Level 2 · ${entry.name}`,
    });
    liveAnnouncement.value = `Went to Level 2: ${entry.name}.`;
  } else if (M.level1.elements.some((e) => e.id === targetId)) {
    drillStack.value = [];
    goToLevel(1, {
      nextSel: targetId,
      targetCardId: targetId,
      inward: false,
      hudLabel: `Level ${currentLevel.value} → Level 1 · ${entry.name}`,
    });
    liveAnnouncement.value = `Went to Level 1: ${entry.name}.`;
  } else if (resById.value[targetId]) {
    drillStack.value = [];
    goToLevel(4, {
      nextSel: targetId,
      targetCardId: targetId,
      inward: true,
      hudLabel: `Level ${currentLevel.value} → Level 4 · ${entry.name}`,
    });
    liveAnnouncement.value = `Went to Level 4: ${entry.name}.`;
  } else if (byId.value[targetId]) {
    selectElement(targetId);
  }

  nextTick(() => {
    nextTick(() => {
      if (isListView.value) {
        queryListCardById(mapRootRef.value, targetId)?.focus({ preventScroll: true });
      } else {
        (queryCardById(stageRef.value, targetId) ?? viewportRef.value)?.focus({
          preventScroll: true,
        });
      }
    });
  });
}

function onGoToKeydown(ev: KeyboardEvent) {
  const totalHits = goToFlatModel.value.hits.length;
  if (ev.key === "Escape") {
    ev.preventDefault();
    ev.stopPropagation();
    closeGoToPalette(true);
    return;
  }
  if (ev.key === "ArrowDown") {
    ev.preventDefault();
    if (totalHits > 0) {
      goToActiveIdx.value = (goToActiveIdx.value + 1) % totalHits;
      scrollActiveGoToIntoView();
    }
    return;
  }
  if (ev.key === "ArrowUp") {
    ev.preventDefault();
    if (totalHits > 0) {
      goToActiveIdx.value = (goToActiveIdx.value - 1 + totalHits) % totalHits;
      scrollActiveGoToIntoView();
    }
    return;
  }
  if (ev.key === "Enter") {
    ev.preventDefault();
    const chosen = goToFlatModel.value.hits[goToActiveIdx.value];
    if (chosen) {
      jumpToSearchEntry(chosen.entry);
    }
  }
}

function onMapRootKeydown(ev: KeyboardEvent) {
  if ((ev.metaKey || ev.ctrlKey) && !ev.altKey && (ev.key === "k" || ev.key === "K")) {
    ev.preventDefault();
    ev.stopPropagation();
    if (goToOpen.value) closeGoToPalette(true);
    else openGoToPalette();
    return;
  }
  if (
    ev.key === "/" &&
    !goToOpen.value &&
    !ev.metaKey &&
    !ev.ctrlKey &&
    !ev.altKey &&
    !(
      ev.target instanceof HTMLInputElement ||
      ev.target instanceof HTMLTextAreaElement ||
      ev.target instanceof HTMLSelectElement ||
      (ev.target instanceof HTMLElement && ev.target.isContentEditable)
    )
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    openGoToPalette();
  }
}

function onStageKeydown(ev: KeyboardEvent) {
  if (
    ev.target instanceof HTMLInputElement ||
    ev.target instanceof HTMLTextAreaElement ||
    ev.target instanceof HTMLSelectElement
  ) {
    return;
  }
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  const view = `${currentLevel.value}|${focusId.value}`;
  onStageKey(ev);
  if (`${currentLevel.value}|${focusId.value}` !== view) keepFocusInMap();
}

// A key that changes the view can remove the card that had focus with it. Keep focus
// in the map, on the viewport that takes the keys, so the next key still works. Only
// focus that was really lost (on the body) comes back: focus the host page moved on
// purpose, say to its own drawer in answer to node-select, stays where it is.
function keepFocusInMap() {
  nextTick(() => {
    const vp = viewportRef.value;
    if (!vp || typeof document === "undefined") return;
    const a = document.activeElement;
    if (!a || a === document.body) vp.focus({ preventScroll: true });
  });
}

function onStageKey(ev: KeyboardEvent) {
  if (ev.key === "1") {
    ev.preventDefault();
    drillStack.value = [];
    goToLevel(1, { inward: false });
  } else if (ev.key === "2") {
    ev.preventDefault();
    drillStack.value = [];
    goToLevel(2, { inward: currentLevel.value < 2 });
  } else if (ev.key === "3" && focusId.value) {
    ev.preventDefault();
    drillStack.value = [];
    goToLevel(3, { nextFocus: focusId.value, inward: true });
  } else if (ev.key === "4") {
    ev.preventDefault();
    drillStack.value = [];
    goToLevel(4, { inward: true });
  } else if (ev.key === "Escape") {
    if (selectedId.value) {
      selectElement(null);
    } else if (activeTool.value !== "select") {
      activeTool.value = "select";
    } else {
      zoomOutLevel();
    }
  } else if (ev.key === "-" || ev.key === "_") {
    ev.preventDefault();
    zoomOutLevel();
  } else if (ev.key === "+" || ev.key === "=") {
    const cardId = cardIdOf(ev.target);
    if (cardId) {
      // from a card, '+' means that card and nothing else
      ev.preventDefault();
      if (canZoomCard(cardId)) {
        zoomIntoElement(cardId);
      } else {
        announce(`${getCardDisplayName(cardId)} has no level inside it.`);
      }
    } else if (canStepIn.value) {
      ev.preventDefault();
      stepInLevel();
    }
  } else if (ev.key === "/") {
    ev.preventDefault();
    openGoToPalette();
  } else if (ev.key === "v" || ev.key === "V") {
    activeTool.value = "select";
  } else if (ev.key === "p" || ev.key === "P") {
    activeTool.value = "pen";
  } else if (ev.key === "l" || ev.key === "L") {
    activeTool.value = "laser";
  } else if (ev.key === "n" || ev.key === "N") {
    activeTool.value = "note";
  }
}

// ============================================================================
// 5. BREADCRUMBS, SUMMARY, DETAILS PANEL & LIST VIEW
// ============================================================================

const breadcrumbs = computed<
  { label: string; level: TuxMapLevelNumber; focusId?: string | null; current: boolean }[]
>(() => {
  const M = activeModel.value;
  const lookup = byId.value;
  const sysName = lookup[M.level2.boundary]?.name || "System";

  if (currentLevel.value === 1) {
    return [{ label: "Level 1 · Ecosystem in Context", level: 1, current: true }];
  }
  if (currentLevel.value === 2) {
    return [
      { label: "Level 1 · Ecosystem", level: 1, current: false },
      { label: `Level 2 · ${sysName}`, level: 2, current: true },
    ];
  }
  if (currentLevel.value === 3) {
    const fName = (focusId.value && lookup[focusId.value]?.name) || "Container";
    return [
      { label: "Level 1 · Ecosystem", level: 1, current: false },
      { label: `Level 2 · ${sysName}`, level: 2, current: false },
      { label: `Level 3 · ${fName}`, level: 3, focusId: focusId.value, current: true },
    ];
  }
  if (currentLevel.value === 4) {
    return [
      { label: "Level 1 · Ecosystem", level: 1, current: false },
      { label: `Level 2 · ${sysName}`, level: 2, current: false },
      { label: "Level 4 · Infrastructure & Deployment", level: 4, current: true },
    ];
  }

  // Fractal Level 5, Level 6+
  const crumbs: {
    label: string;
    level: TuxMapLevelNumber;
    focusId?: string | null;
    current: boolean;
  }[] = [
    { label: "Level 1 · Ecosystem", level: 1, current: false },
    { label: `Level 2 · ${sysName}`, level: 2, current: false },
  ];

  for (const step of drillStack.value) {
    if (step.level === 4) {
      crumbs.push({ label: "Level 4 · Deployment", level: 4, current: false });
    } else if (step.level >= 3) {
      const sName =
        lookup[step.focusId]?.name ||
        resById.value[step.focusId]?.title ||
        step.focusId ||
        `Level ${step.level}`;
      crumbs.push({
        label: `Level ${step.level} · ${sName}`,
        level: step.level,
        focusId: step.focusId,
        current: false,
      });
    }
  }

  const curName =
    (focusId.value && (lookup[focusId.value]?.name || resById.value[focusId.value]?.title)) ||
    getSubgraphForNode(focusId.value)?.stratum ||
    `Level ${currentLevel.value}`;
  crumbs.push({
    label: `Level ${currentLevel.value} · ${curName}`,
    level: currentLevel.value,
    focusId: focusId.value,
    current: true,
  });
  return crumbs;
});

const summaryText = computed(() => {
  const M = activeModel.value;
  const cs = M.level2.elements.filter((e) => !e.ref);
  const liveCount = cs.filter((e) => e.status !== "planned").length;
  const plannedCount = cs.filter((e) => e.status === "planned").length;
  const mappedResources = M.level4.nodes.filter((n) => n.status !== "planned").length;

  if (currentLevel.value >= 5) {
    const sg = getSubgraphForNode(focusId.value);
    const parentName =
      (focusId.value &&
        (byId.value[focusId.value]?.name || resById.value[focusId.value]?.title)) ||
      "node";
    const desc =
      sg?.summary ||
      `Inside ${parentName} (${sg?.stratum || `Level ${currentLevel.value}`}): ${sg?.elements.length ?? 0} inner modules/symbols mapped.`;
    return `${desc} ${liveCount} containers active${plannedCount ? ` and ${plannedCount} planned` : ""}; ${mappedResources} infrastructure nodes mapped.`;
  }

  const prefix: Record<number, string> = {
    1: M.level1.summary || "Who uses the platform and the systems around it.",
    2: M.level2.summary || "What the platform is made of: each box runs or holds data.",
    3: `Inside ${focusId.value && byId.value[focusId.value] ? byId.value[focusId.value]!.name : "container"}: what uses it on the left, what it uses on the right.`,
    4: M.level4.summary || "Where it all runs: resource groups, VMs, storage, and firewall rules.",
  };

  return `${prefix[currentLevel.value]} ${liveCount} containers active${plannedCount ? ` and ${plannedCount} planned` : ""}; ${mappedResources} infrastructure nodes mapped.`;
});

const selectedLevelElement = computed<TuxMapLevelElement | null>(() => {
  if (!selectedId.value || currentLevel.value === 4) return null;
  return byId.value[selectedId.value] ?? null;
});

const selectedDeployNode = computed<TuxMapDeploymentNode | null>(() => {
  if (!selectedId.value || currentLevel.value !== 4) return null;
  return resById.value[selectedId.value] ?? null;
});

const selectedPanelEntity = computed<TuxMapLevelElement | TuxMapDeploymentNode | null>(
  () => selectedLevelElement.value ?? selectedDeployNode.value,
);

const selectedUsedByRels = computed(() => {
  if (!selectedId.value || currentLevel.value === 4) return [];
  const key = currentLevel.value === 3 && selectedId.value === focusId.value ? "@bound" : selectedId.value;
  return stageData.value.rels
    .filter((r) => r.to === key && r.label && byId.value[r.from])
    .map((r) => ({ rel: r, other: byId.value[r.from]! }));
});

const selectedUsesRels = computed(() => {
  if (!selectedId.value || currentLevel.value === 4) return [];
  const key = currentLevel.value === 3 && selectedId.value === focusId.value ? "@bound" : selectedId.value;
  return stageData.value.rels
    .filter((r) => r.from === key && r.label && byId.value[r.to])
    .map((r) => ({ rel: r, other: byId.value[r.to]! }));
});

const selectedDeployInLinks = computed(() => {
  if (!selectedId.value || currentLevel.value !== 4) return [];
  return activeModel.value.level4.links
    .filter(
      (l) =>
        l.to === selectedId.value &&
        (showPlanned.value || l.state !== "planned") &&
        resById.value[l.from],
    )
    .map((l) => ({ link: l, other: resById.value[l.from]! }));
});

const selectedDeployOutLinks = computed(() => {
  if (!selectedId.value || currentLevel.value !== 4) return [];
  return activeModel.value.level4.links
    .filter(
      (l) =>
        l.from === selectedId.value &&
        (showPlanned.value || l.state !== "planned") &&
        resById.value[l.to],
    )
    .map((l) => ({ link: l, other: resById.value[l.to]! }));
});

const selectedPanelDiffBadge = computed(() => {
  const ent = selectedPanelEntity.value;
  return ent ? formatDiffBadge(ent.id, ent.diff) : null;
});

const selectedHasInRels = computed(() =>
  selectedLevelElement.value
    ? selectedUsedByRels.value.length > 0
    : selectedDeployInLinks.value.length > 0,
);

// A new view, magnified, opens at its selection or its top-left. Choosing a card at Level 2 or 4 sets
// focusId too, but keeps the view, so only a focus that is the view's parent (Level 3, 5+) counts.
watch([currentLevel, focusId], ([lvl, f], [oldLvl, oldF]) => {
  if (lvl === oldLvl && (f === oldF || (lvl !== 3 && lvl < 5))) return;
  if (!isMagnified.value) return;
  nextTick(() => scrollSelectionIntoView(true));
});

/** Magnified, bring the selected card into the viewport (or, with `orTopLeft`, start at the corner) */
function scrollSelectionIntoView(orTopLeft = false) {
  const vp = viewportRef.value;
  const r = selectedId.value ? stageData.value.rects[selectedId.value] : undefined;
  if (!vp) return;
  if (!r) {
    if (orTopLeft) vp.scrollTo?.(0, 0);
    return;
  }
  const s = stageScale.value;
  vp.scrollTo?.({
    left: Math.max(0, (r.x + r.w / 2) * s - vp.clientWidth / 2),
    top: Math.max(0, (r.y + r.h / 2) * s - vp.clientHeight / 2),
  });
}

/** What each card in view depends on and what depends on it, from the wires the diagram draws: the
 *  list is the map's text alternative, so it carries them too (WCAG 1.3.1) */

/** The selection is an outside card (Level 5+): the panel offers what double-clicking it does (2.1.1) */
const selectedIsOutside = computed<boolean>(() => {
  const id = selectedId.value;
  if (!id || currentLevel.value < 5 || !parentOf.value.has(id)) return false;
  return Boolean(stageData.value.els.find((e) => e.id === id)?.side);
});

const listRelsById = computed(() => {
  const S = stageData.value;
  const names = new Map<string, string>();
  for (const e of S.els) names.set(e.id, e.name);
  for (const n of S.deployNodes) names.set(n.id, n.title);
  const fid = focusId.value;
  names.set("@bound", (fid && (byId.value[fid]?.name || resById.value[fid]?.title)) || "its parent");
  const nameOf = (id: string) => names.get(id) ?? byId.value[id]?.name ?? resById.value[id]?.title ?? id;
  const max = 8;
  const out = new Map<string, { uses: string[]; usedBy: string[] }>();
  const at = (id: string) => {
    let r = out.get(id);
    if (!r) out.set(id, (r = { uses: [], usedBy: [] }));
    return r;
  };
  // Level 4 draws its wires from level4.links, not from the stage's rels
  const rels: { from: string; to: string; label?: string; status?: string }[] =
    currentLevel.value === 4
      ? activeModel.value.level4.links.filter((l) => showPlanned.value || l.state !== "planned")
      : S.rels;
  for (const r of rels) {
    if (!isShownStatus(r.status)) continue;
    const how = r.label ? ` (${r.label})` : "";
    const a = at(r.from).uses;
    const b = at(r.to).usedBy;
    const to = nameOf(r.to) + how;
    const from = nameOf(r.from) + how;
    if (!a.includes(to)) a.push(to);
    if (!b.includes(from)) b.push(from);
  }
  const cap = (xs: string[]) => (xs.length > max ? [...xs.slice(0, max), `and ${xs.length - max} more`] : xs);
  for (const r of out.values()) {
    r.uses = cap(r.uses);
    r.usedBy = cap(r.usedBy);
  }
  return out;
});

const listViewGroups = computed(() => {
  const match = matchingSearchIds.value;
  if (currentLevel.value === 4) {
    const baseNodes = match
      ? stageData.value.deployNodes.filter((n) => match.has(n.id))
      : stageData.value.deployNodes;
    const groups = activeModel.value.level4.groups.map((g) => ({
      title: g.title,
      deployNodes: baseNodes.filter((n) => n.group === g.id),
      els: [] as TuxMapLevelElement[],
    }));
    const otherNodes = baseNodes.filter((n) => !n.group);
    if (otherNodes.length) {
      groups.push({
        title: "Identity, External & Planned Enclaves",
        deployNodes: otherNodes,
        els: [],
      });
    }
    return groups.filter((g) => g.deployNodes.length > 0);
  }

  const els = match
    ? stageData.value.els.filter((e) => match.has(e.id))
    : stageData.value.els;
  return [
    {
      title: "People & Actors",
      els: els.filter((e) => e.kind === "person"),
      deployNodes: [] as TuxMapDeploymentNode[],
    },
    {
      title:
        currentLevel.value === 3 && focusId.value && byId.value[focusId.value]
          ? `Components of ${byId.value[focusId.value]!.name}`
          : currentLevel.value === 2
            ? "Containers & Services"
            : "Primary Systems",
      els: els.filter((e) => e.kind !== "person" && e.kind !== "external" && !e.side),
      deployNodes: [] as TuxMapDeploymentNode[],
    },
    {
      title: "Connected & External Systems",
      els: els.filter((e) => e.kind === "external" || (e.side && e.kind !== "person")),
      deployNodes: [] as TuxMapDeploymentNode[],
    },
  ].filter((g) => g.els.length > 0);
});

// ============================================================================
// 6. LIGHTWEIGHT ON-DEMAND ANNOTATION TOOLS (PEN, LASER, STICKY NOTES)
// ============================================================================

const activeTool = ref<TuxMapTool>("select");
const localStrokes = ref<TuxMapInkStroke[]>([...props.strokes]);
watch(
  () => props.strokes,
  (v) => {
    localStrokes.value = [...v];
  },
);

const localNotes = ref<TuxMapStickyNote[]>([...props.notes]);
watch(
  () => props.notes,
  (v) => {
    localNotes.value = [...v];
  },
);

const editingNoteId = ref<string | null>(null);
const draggingNoteId = ref<string | null>(null);
const noteDragOrigin = ref({ startX: 0, startY: 0, noteX: 0, noteY: 0 });

const activePenPoints = ref<TuxMapStrokePoint[]>([]);
const activeLaserPoints = ref<TuxMapStrokePoint[]>([]);
const laserNow = ref<number>(Date.now());
let laserRaf: number | null = null;

function startLaserLoop() {
  if (laserRaf !== null || typeof window === "undefined") return;
  const tick = () => {
    laserNow.value = Date.now();
    activeLaserPoints.value = activeLaserPoints.value.filter(
      (p) => laserNow.value - (p.timestamp ?? laserNow.value) < 950,
    );
    if (activeLaserPoints.value.length > 0) {
      laserRaf = window.requestAnimationFrame(tick);
    } else {
      laserRaf = null;
    }
  };
  laserRaf = window.requestAnimationFrame(tick);
}

function getStageCoordsFromClient(clientX: number, clientY: number): { x: number; y: number } {
  const el = viewportRef.value;
  if (!el) return { x: 0, y: 0 };
  const rect = el.getBoundingClientRect();
  const s = stageScale.value || 1;
  return {
    x: Math.round((clientX - rect.left + el.scrollLeft - panX.value) / s),
    y: Math.round((clientY - rect.top + el.scrollTop) / s),
  };
}

function getStageCoords(e: PointerEvent): { x: number; y: number } {
  return getStageCoordsFromClient(e.clientX, e.clientY);
}

function findCardIdAtStagePoint(x: number, y: number): string | null {
  for (const [id, r] of Object.entries(stageData.value.rects)) {
    if (r.bound) continue;
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
      return id;
    }
  }
  return null;
}

function isAnnotationVisibleInCurrentView(item: {
  level?: TuxMapLevelNumber;
  focusId?: string | null;
}): boolean {
  if (item.level == null) return true;
  if (item.level !== currentLevel.value) return false;
  if ((currentLevel.value === 3 || currentLevel.value >= 5) && item.focusId) {
    return item.focusId === focusId.value;
  }
  return true;
}

const visibleStrokes = computed(() =>
  localStrokes.value.filter(isAnnotationVisibleInCurrentView),
);

const visibleNotes = computed(() =>
  localNotes.value.filter(isAnnotationVisibleInCurrentView),
);

function onStagePointerDown(e: PointerEvent) {
  if (e.button !== 0) return;
  const target = e.target as HTMLElement | null;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
    return;
  }

  const pt = getStageCoords(e);

  if (activeTool.value === "pen") {
    e.preventDefault();
    if (typeof window !== "undefined") window.getSelection?.()?.removeAllRanges?.();
    (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
    activePenPoints.value = [
      { x: pt.x, y: pt.y, pressure: e.pressure || 0.5, timestamp: Date.now() },
    ];
    return;
  }

  if (activeTool.value === "laser") {
    e.preventDefault();
    if (typeof window !== "undefined") window.getSelection?.()?.removeAllRanges?.();
    (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
    activeLaserPoints.value.push({ x: pt.x, y: pt.y, timestamp: Date.now() });
    startLaserLoop();
    return;
  }

  if (activeTool.value === "note") {
    e.preventDefault();
    if (typeof window !== "undefined") window.getSelection?.()?.removeAllRanges?.();
    const pinnedId = findCardIdAtStagePoint(pt.x, pt.y);
    const newNote: TuxMapStickyNote = {
      id: `note-${Date.now()}`,
      x: Math.max(12, pt.x - 90),
      y: Math.max(12, pt.y - 36),
      text: "Architecture review note — double-click to edit.",
      author: "Reviewer",
      tone: "gold",
      level: currentLevel.value,
      focusId:
        currentLevel.value === 3 || currentLevel.value >= 5 ? focusId.value : null,
      targetNodeId: pinnedId,
    };
    localNotes.value = [...localNotes.value, newNote];
    emit("update:notes", localNotes.value);
    activeTool.value = "select";
    return;
  }

  // Clicking empty background in Select mode clears selection
  if (
    selectedId.value &&
    !target?.closest?.(".tux-map__el") &&
    !target?.closest?.(".tux-map__panel") &&
    !target?.closest?.(".tux-map__note")
  ) {
    selectElement(null);
  }
}

function onStagePointerMove(e: PointerEvent) {
  lastPointerClient = { x: e.clientX, y: e.clientY };
  const pt = getStageCoords(e);

  if (
    activeTool.value === "select" &&
    !draggingNoteId.value &&
    activePenPoints.value.length === 0
  ) {
    updateProximityAtStagePoint(pt.x, pt.y);
    return;
  }

  if (activeTool.value === "pen" && activePenPoints.value.length > 0) {
    e.preventDefault();
    activePenPoints.value.push({
      x: pt.x,
      y: pt.y,
      pressure: e.pressure || 0.5,
      timestamp: Date.now(),
    });
    return;
  }

  if (activeTool.value === "laser" && e.buttons === 1) {
    e.preventDefault();
    activeLaserPoints.value.push({ x: pt.x, y: pt.y, timestamp: Date.now() });
    emit("laser-move", activeLaserPoints.value);
    startLaserLoop();
    return;
  }

  if (draggingNoteId.value) {
    e.preventDefault();
    const dx = pt.x - noteDragOrigin.value.startX;
    const dy = pt.y - noteDragOrigin.value.startY;
    const nextX = Math.round(noteDragOrigin.value.noteX + dx);
    const nextY = Math.round(noteDragOrigin.value.noteY + dy);
    const pinnedId = findCardIdAtStagePoint(nextX + 90, nextY + 36);
    localNotes.value = localNotes.value.map((n) =>
      n.id === draggingNoteId.value
        ? {
            ...n,
            x: nextX,
            y: nextY,
            targetNodeId: pinnedId ?? n.targetNodeId,
          }
        : n,
    );
  }
}

function onStagePointerUp(e: PointerEvent) {
  (e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  if (activeTool.value === "pen" && activePenPoints.value.length > 1) {
    const firstPt = activePenPoints.value[0]!;
    const stroke: TuxMapInkStroke = {
      id: `stroke-${Date.now()}`,
      color: props.penColor,
      size: 6,
      points: [...activePenPoints.value],
      level: currentLevel.value,
      focusId:
        currentLevel.value === 3 || currentLevel.value >= 5 ? focusId.value : null,
      targetNodeId: findCardIdAtStagePoint(firstPt.x, firstPt.y),
    };
    localStrokes.value = [...localStrokes.value, stroke];
    emit("update:strokes", localStrokes.value);
  }
  if (draggingNoteId.value) {
    emit("update:notes", localNotes.value);
  }
  activePenPoints.value = [];
  draggingNoteId.value = null;
}

function onNotePointerDown(note: TuxMapStickyNote, e: PointerEvent) {
  if (activeTool.value !== "select" || editingNoteId.value === note.id) return;
  e.preventDefault();
  e.stopPropagation();
  if (typeof window !== "undefined") window.getSelection?.()?.removeAllRanges?.();
  const pt = getStageCoords(e);
  draggingNoteId.value = note.id;
  noteDragOrigin.value = {
    startX: pt.x,
    startY: pt.y,
    noteX: note.x,
    noteY: note.y,
  };
}

function onViewportSelectStart(e: Event) {
  if (!(e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement)) {
    e.preventDefault();
  }
}

function updateNoteText(id: string, text: string) {
  localNotes.value = localNotes.value.map((n) => (n.id === id ? { ...n, text } : n));
  emit("update:notes", localNotes.value);
}

function removeNote(id: string) {
  localNotes.value = localNotes.value.filter((n) => n.id !== id);
  emit("update:notes", localNotes.value);
}

function clearAnnotations() {
  localStrokes.value = [];
  localNotes.value = [];
  emit("update:strokes", []);
  emit("update:notes", []);
}

const renderedInkPaths = computed(() =>
  visibleStrokes.value.map((s) => ({
    id: s.id,
    color: s.color,
    d: getSmoothedFreehandSvgPath(s.points, { size: s.size }),
  })),
);

const activePenSvgPath = computed(() =>
  getSmoothedFreehandSvgPath(activePenPoints.value, { size: 6 }),
);

const activeLaserSvgPath = computed(() =>
  getLaserPointerSvgPath(activeLaserPoints.value, laserNow.value, 7, 950, 48),
);

function elementIconName(kind?: TuxMapElementKind | string): string {
  switch (kind) {
    case "person":
    case "people":
    case "entra-group":
      return "lucide:users";
    case "system":
    case "vm":
      return "lucide:server";
    case "container":
    case "containerapp":
      return "lucide:box";
    case "database":
    case "postgres":
    case "schema":
      return "lucide:database";
    case "storage":
    case "backup":
    case "snapshot":
      return "lucide:archive";
    case "disk":
      return "lucide:hard-drive";
    case "keyvault":
      return "lucide:key-round";
    case "entra-app":
      return "lucide:shield-check";
    case "quarantine":
      return "lucide:scan-search";
    case "cluster":
      return "lucide:cpu";
    case "mac":
      return "lucide:laptop";
    case "external":
      return "lucide:globe";
    case "module":
      return "lucide:package";
    case "route":
      return "lucide:arrow-left-right";
    case "symbol":
      return "lucide:code-2";
    default:
      return "lucide:circle-dot";
  }
}

function normalizeArray(v?: string | string[]): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// A model's URLs are data: only web and relative links reach an href, so a
// `javascript:`, `data:`, or scheme-relative `//` value never runs or redirects cross-origin.
const DUMMY_HREF_BASE = "https://tux-map.invalid/";
function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || /^[/\\]{2}/.test(trimmed)) return null;
  try {
    const parsed = new URL(trimmed, DUMMY_HREF_BASE);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (!/^https?:\/\//i.test(trimmed) && parsed.origin !== "https://tux-map.invalid") {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

function buildIssueHref(issueNum: number): string | null {
  const base = safeHref(activeModel.value.issueBaseUrl);
  if (!base) return null;
  return `${base.replace(/\/+$/, "")}/${issueNum}`;
}

function buildSourceHref(src?: {
  path: string;
  lineRange?: [number, number];
  url?: string;
}): string | null {
  if (!src) return null;
  if (src.url) {
    const direct = safeHref(src.url);
    if (!direct) return null;
    const base = safeHref(activeModel.value.sourceBaseUrl);
    if (base) {
      try {
        const baseUrl = new URL(base, DUMMY_HREF_BASE);
        const targetUrl = new URL(direct, baseUrl);
        if (baseUrl.origin !== "https://tux-map.invalid" && targetUrl.origin !== baseUrl.origin) {
          return null;
        }
      } catch {
        return null;
      }
    }
    return direct;
  }
  const base = safeHref(activeModel.value.sourceBaseUrl);
  if (!base) return null;
  // Normalize slashes and reject empty, '.', or '..' path traversal segments
  const norm = src.path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!norm) return null;
  const segs = norm.split("/");
  if (segs.some((seg) => !seg || seg === "." || seg === "..")) return null;
  const cleanPath = segs.map(encodeURIComponent).join("/");
  const validRange =
    Array.isArray(src.lineRange) &&
    src.lineRange.length >= 2 &&
    Number.isFinite(src.lineRange[0]) &&
    Number.isFinite(src.lineRange[1]);
  const lineHash = validRange
    ? src.lineRange![0] === src.lineRange![1]
      ? `#L${src.lineRange![0]}`
      : `#L${src.lineRange![0]}-L${src.lineRange![1]}`
    : "";
  return `${base.replace(/\/+$/, "")}/${cleanPath}${lineHash}`;
}
</script>

<template>
  <figure ref="mapRootRef" class="tux-map" @keydown="onMapRootKeydown">
    <!-- Header Bar -->
    <div v-if="eyebrow || title" class="tux-map__header">
      <div>
        <p v-if="eyebrow" class="tux-map__eyebrow">{{ eyebrow }}</p>
        <h3 v-if="title" class="tux-map__title">{{ title }}</h3>
      </div>
      <div class="tux-map__level-pill" role="status" aria-live="polite">
        <span class="tux-map__level-dot" />
        <span class="tux-map__level-text">Level {{ currentLevel }} of {{ maxAvailableLevel }}</span>
      </div>
    </div>

    <!-- Primary Toolbar: N+1 Progressive Zoom Stepper + Infrastructure Perspective + Show Planned + Blast Radius + Annotations + Search + View Mode -->
    <div class="tux-map__tools" role="toolbar" aria-label="Architecture map controls">
      <div class="tux-map__stepper" role="group" aria-label="Semantic zoom level">
        <button
          type="button"
          class="tux-map__iconbtn"
          :disabled="currentLevel === 1"
          aria-label="Zoom out a level"
          title="Zoom out to parent level (N−1)"
          @click="zoomOutLevel()"
        >
          −
        </button>
        <div class="tux-map__stepper-stratum" aria-live="polite">
          <span class="tux-map__stepper-lvl">L{{ currentLevel }}</span>
          <span class="tux-map__stepper-name">{{ currentStratumShort }}</span>
        </div>
        <button
          type="button"
          class="tux-map__iconbtn"
          :disabled="!canStepIn"
          aria-label="Zoom in on the chosen element"
          title="Drill into N+1 view (+)"
          @click="stepInLevel()"
        >
          +
        </button>
      </div>

      <!-- Magnify (#106): past fitting the width, the diagram scrolls -->
      <div v-if="!isListView" class="tux-map__stepper tux-map__magnify" role="group" aria-label="Magnify the diagram">
        <button
          type="button"
          class="tux-map__iconbtn"
          :disabled="!isMagnified"
          aria-label="Make the diagram smaller"
          title="Smaller"
          @click="magnifyBy(-1)"
        >
          A−
        </button>
        <button
          type="button"
          class="tux-map__magnify-fit"
          :aria-pressed="!isMagnified"
          :aria-label="isMagnified ? `Fit the diagram to the width (now ${magnifyLabel})` : 'The diagram fits the width'"
          title="Fit to the width"
          @click="magnifyFit()"
        >
          {{ magnifyLabel }}
        </button>
        <button
          type="button"
          class="tux-map__iconbtn"
          :disabled="!canMagnify"
          aria-label="Make the diagram larger"
          title="Larger: then scroll or swipe to move around it"
          @click="magnifyBy(1)"
        >
          A+
        </button>
      </div>

      <!-- Orthogonal Infrastructure & Deployment Perspective Toggle -->
      <div class="tux-map__seg" role="group" aria-label="Topology perspective">
        <button
          type="button"
          :aria-pressed="currentLevel === 4"
          title="Toggle physical deployment & infrastructure topology"
          @click="toggleInfrastructureView()"
        >
          <Icon name="lucide:server" aria-hidden="true" />
          <span>Infrastructure</span>
        </button>
      </div>

      <!-- Show Planned Switch -->
      <label class="tux-map__switch">
        <input v-model="showPlanned" type="checkbox" />
        <span class="tux-map__switch-track" />
        <span>Show planned</span>
      </label>

      <!-- Show Blast Radius Switch -->
      <label class="tux-map__switch">
        <input v-model="showBlastRadius" type="checkbox" />
        <span class="tux-map__switch-track tux-map__switch-track--blast" />
        <span>Blast radius</span>
      </label>

      <select
        v-if="showBlastRadius"
        v-model="blastIntent"
        class="tux-map__intent-select"
        aria-label="Blast radius intent"
        title="Filter blast radius propagation by change intent"
      >
        <option value="default">Intent: General</option>
        <option value="patch">Intent: Body patch</option>
        <option value="refactor">Intent: Refactor</option>
        <option value="cut">Intent: Cut / remove</option>
        <option value="supply-chain">Intent: Supply chain</option>
      </select>

      <!-- Lightweight Annotation Tools -->
      <div class="tux-map__seg" role="group" aria-label="Annotation tools">
        <button
          type="button"
          :aria-pressed="activeTool === 'select'"
          title="Select & Inspect (V)"
          @click="activeTool = 'select'"
        >
          <Icon name="lucide:mouse-pointer" aria-hidden="true" />
          <span>Select</span>
        </button>
        <button
          type="button"
          :aria-pressed="activeTool === 'pen'"
          title="Freehand Pen (P)"
          @click="activeTool = 'pen'"
        >
          <Icon name="lucide:pen-tool" aria-hidden="true" />
          <span>Pen</span>
        </button>
        <button
          type="button"
          :aria-pressed="activeTool === 'laser'"
          title="Laser Pointer (L)"
          @click="activeTool = 'laser'"
        >
          <Icon name="lucide:wand-sparkles" aria-hidden="true" />
          <span>Laser</span>
        </button>
        <button
          type="button"
          :aria-pressed="activeTool === 'note'"
          title="Sticky Note (N)"
          @click="activeTool = 'note'"
        >
          <Icon name="lucide:sticky-note" aria-hidden="true" />
          <span>Note</span>
        </button>
        <button
          v-if="localStrokes.length > 0 || localNotes.length > 0"
          type="button"
          title="Clear annotations"
          @click="clearAnnotations"
        >
          <Icon name="lucide:trash-2" aria-hidden="true" />
          <span>Clear</span>
        </button>
      </div>

      <span class="tux-map__spacer" />

      <!-- Cross-Level Go-To Palette Trigger (#120) -->
      <button
        type="button"
        class="tux-map__goto-btn"
        aria-haspopup="dialog"
        :aria-expanded="goToOpen"
        title="Go to any component, folder, file, function, or route (/ or Ctrl+K)"
        @click="openGoToPalette()"
      >
        <Icon name="lucide:scan-search" aria-hidden="true" />
        <span>Go to…</span>
        <kbd class="tux-map__goto-kbd" aria-hidden="true">/</kbd>
      </button>

      <!-- Per-Level Search Filter (#120) -->
      <div class="tux-map__search-wrap">
        <Icon name="lucide:search" class="tux-map__search-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          class="tux-map__search-input"
          placeholder="Filter this level…"
          aria-label="Filter architecture elements"
        />
        <span v-if="matchingSearchIds" class="tux-map__search-count" aria-hidden="true">
          {{ matchingSearchIds.size }} of {{ stageTotalCount }} here
        </span>
      </div>

      <!-- Diagram / List View Switch -->
      <div class="tux-map__seg" role="group" aria-label="Display mode">
        <button
          type="button"
          :aria-pressed="!isListView"
          @click="isListView = false"
        >
          Diagram
        </button>
        <button
          type="button"
          :aria-pressed="isListView"
          @click="isListView = true"
        >
          List
        </button>
      </div>
    </div>

    <!-- Breadcrumb Trail -->
    <nav aria-label="Architecture level breadcrumb">
      <ol class="tux-map__crumbs">
        <li v-for="(crumb, idx) in breadcrumbs" :key="idx">
          <span v-if="crumb.current" aria-current="page">{{ crumb.label }}</span>
          <button
            v-else
            type="button"
            @click="
              drillStack = crumb.level < 5 ? [] : drillStack.slice(0, Math.max(0, idx - 2));
              goToLevel(crumb.level, {
                nextFocus: crumb.focusId ?? focusId,
                nextSel: null,
                inward: false,
              });
            "
          >
            {{ crumb.label }}
          </button>
        </li>
      </ol>
    </nav>

    <p class="tux-map__hint">{{ hintText }}</p>
    <p class="tux-map__summary">{{ summaryText }}</p>

    <!-- Visual Key Legend -->
    <ul v-if="!isListView" class="tux-map__legend" aria-label="Diagram key">
      <template v-if="currentLevel === 4">
        <li><i class="tux-map__swatch tux-map__swatch--card" /> Resource</li>
        <li><i class="tux-map__swatch tux-map__swatch--region" /> Region or resource group</li>
        <li><i class="tux-map__swatch tux-map__swatch--planned" /> Planned</li>
      </template>
      <template v-else>
        <li><i class="tux-map__swatch tux-map__swatch--person" /> Person</li>
        <li><i class="tux-map__swatch tux-map__swatch--system" /> Primary system</li>
        <li><i class="tux-map__swatch tux-map__swatch--card" /> Container / component / module</li>
        <li><i class="tux-map__swatch tux-map__swatch--route" /> HTTP route</li>
        <li><i class="tux-map__swatch tux-map__swatch--external" /> External system</li>
        <li><i class="tux-map__swatch tux-map__swatch--planned" /> Planned</li>
      </template>
      <template v-if="showBlastRadius">
        <li><i class="tux-map__swatch tux-map__swatch--diff-direct" /> {{ hasModelDiffs ? "PR Modified" : "Selected" }}</li>
        <li><i class="tux-map__swatch tux-map__swatch--diff-impact" /> {{ hasModelDiffs ? "Blast-Radius Impacted" : "Depends on selection" }}</li>
      </template>
      <li>
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path d="M0,4 L28,4" stroke="var(--text-secondary)" stroke-width="1.6" />
        </svg>
        Uses
      </li>
      <li v-for="lk in legendLinkKinds" :key="lk.kind" :data-link-kind="lk.kind">
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path
            d="M0,4 L28,4"
            stroke="var(--text-secondary)"
            stroke-width="1.6"
            :stroke-dasharray="lk.quiet ? '3 3' : undefined"
          />
        </svg>
        {{ lk.label }}
      </li>
      <li>
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path d="M0,4 L28,4" stroke="var(--text-muted)" stroke-width="1.6" stroke-dasharray="6 5" />
        </svg>
        Planned link
      </li>
    </ul>
    <div v-if="!isListView && offStageImpactCount > 0" class="tux-map__other-levels">
      +{{ offStageImpactCount }} on other levels
    </div>

    <!-- Main Canvas Container (Diagram + Accessible List View + Sliding Right Drawer) -->
    <div class="tux-map__canvas" :class="{ 'tux-map__canvas--list': isListView }">
      <!-- Diagram Viewport -->
      <div
        v-show="!isListView"
        ref="viewportRef"
        class="tux-map__viewport"
        :class="[
          `tux-map__viewport--tool-${activeTool}`,
          {
            'tux-map__viewport--has-proximity': Boolean(proximityCard && activeTool === 'select'),
            'tux-map__viewport--proximity-zoom': Boolean(
              proximityCard?.zoomable && activeTool === 'select',
            ),
            'tux-map__viewport--magnified': isMagnified,
          },
        ]"
        :style="{ height: computedViewportHeight }"
        tabindex="0"
        role="region"
        :aria-label="ariaLabel"
        @wheel="onViewportWheel"
        @selectstart="onViewportSelectStart"
        @dragstart.prevent
        @pointerdown="onStagePointerDown"
        @pointermove="onStagePointerMove"
        @pointerup="onStagePointerUp"
        @pointercancel="onStagePointerUp"
        @keydown="onStageKeydown"
      >
        <div
          v-if="isMagnified"
          class="tux-map__sizer"
          aria-hidden="true"
          :style="{ width: `${Math.ceil(stageData.width * stageScale)}px`, height: `${Math.ceil(stageData.height * stageScale)}px` }"
        />
        <div
          ref="stageRef"
          class="tux-map__stage"
          :class="{
            'tux-map__stage--pan': isPanningStage,
            'tux-map__stage--dim': Boolean(activeLitId || matchingSearchIds || blastRadiusState),
          }"
          :style="{
            width: `${stageData.width}px`,
            height: `${stageData.height}px`,
            transform: `translate3d(${panX}px, 0px, 0) scale(${stageScale})`,
          }"
          @pointerover="onStagePointerOver"
          @pointerleave="onStagePointerLeave"
        >
          <!-- Layer 0 (z-index: 0): Dashed C4 Boundaries & Region Enclaves -->
          <div
            v-for="(b, bIdx) in stageData.bounds"
            :key="`bound-${bIdx}-${b.label}`"
            class="tux-map__bound"
            :class="b.cls"
            :style="{
              left: `${b.x}px`,
              top: `${b.y}px`,
              width: `${b.w}px`,
              height: `${b.h}px`,
            }"
          >
            <span class="tux-map__bound-label">
              <b>{{ b.label }}</b>
              <template v-if="b.type"> [{{ b.type }}]</template>
            </span>
          </div>

          <!-- Layer 1 (z-index: 1): Base Orthogonal Wires SVG -->
          <svg
            class="tux-map__wires"
            :class="{
              'tux-map__wires--has-on': Boolean(activeLitId || blastRadiusState),
              'tux-map__wires--level4': currentLevel === 4,
            }"
            :width="stageData.width"
            :height="stageData.height"
            aria-hidden="true"
          >
            <defs>
              <marker
                :id="arrowMarkerId"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="9"
                markerHeight="9"
                markerUnits="userSpaceOnUse"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
              </marker>
            </defs>

            <path
              v-for="w in routedSvg.wires"
              :key="w.id"
              :d="w.d"
              :data-id="w.id"
              :data-from="w.from"
              :data-to="w.to"
              class="tux-map__wire"
              :class="{ 'tux-map__wire--planned': w.planned }"
              :marker-end="`url(#${arrowMarkerId})`"
            />
          </svg>

          <!-- Layer 4 (z-index: 4): Foreground Active Wires SVG (Always Above Dimmed Cards & Dimmed Labels) -->
          <svg
            class="tux-map__wires-fg"
            :width="stageData.width"
            :height="stageData.height"
            aria-hidden="true"
          >
            <template v-for="w in routedSvg.wires" :key="`fg-${w.id}`">
              <path
                :d="w.d"
                :data-id="w.id"
                :data-from="w.from"
                :data-to="w.to"
                class="tux-map__wire-fg"
                :class="{
                  'tux-map__wire-fg--planned': w.planned,
                  'tux-map__wire-fg--blast': Boolean(blastRadiusState?.impactedWires.has(w.id)),
                  'tux-map__wire-fg--on': isWireLit(w.from, w.to, w.id),
                }"
                :marker-end="`url(#${arrowMarkerId})`"
              />
              <path
                :d="w.d"
                :data-id="w.id"
                :data-from="w.from"
                :data-to="w.to"
                class="tux-map__wire-fg tux-map__wire-fg--stream"
                :class="{
                  'tux-map__wire-fg--blast': Boolean(blastRadiusState?.impactedWires.has(w.id)),
                  'tux-map__wire-fg--on': isWireLit(w.from, w.to, w.id),
                }"
              />
            </template>
          </svg>

          <!-- Layer 2 / 5 (z-index: 2 at rest, 1 when dimmed, 5 when lit): Element Cards -->
          <template v-if="currentLevel !== 4">
            <button
              v-for="c in renderedCards"
              :key="c.id"
              type="button"
              :data-id="c.id"
              :data-parent="c.parent"
              class="tux-map__el"
              :class="[
                c.kindCls,
                c.statusCls,
                c.blastCls,
                {
                  'tux-map__el--mini': c.mini,
                  'tux-map__el--zoomable': c.zoomable,
                  'tux-map__el--lit': isElementLit(c.id, c.parent),
                },
              ]"
              :style="c.style"
              :aria-pressed="selectedId === c.id"
              @click="selectElement(selectedId === c.id ? null : c.id)"
              @dblclick.stop="c.mini && currentLevel >= 5 && parentOf.has(c.id) ? revealElement(c.id) : c.zoomable && zoomIntoElement(c.id)"
            >
              <span class="tux-map__el-nm">
                <Icon :name="c.icon" class="tux-map__el-ic" aria-hidden="true" />
                <span>{{ c.name }}</span>
              </span>
              <span v-if="c.typeLabel" class="tux-map__el-ty" :title="c.typeLabel">
                {{ c.typeLabel }}
              </span>
              <span v-if="c.desc" class="tux-map__el-ds" :title="c.desc">{{ c.desc }}</span>
              <span
                v-if="c.live || c.chip || c.diffBadge"
                class="tux-map__el-ft"
              >
                <template v-if="c.live">
                  <i
                    class="tux-map__dot"
                    :class="c.live[0] ? `tux-map__dot--${c.live[0]}` : ''"
                    aria-hidden="true"
                  />
                  <span>{{ c.live[1] }}</span>
                </template>
                <span
                  v-if="c.chip"
                  class="tux-map__chip"
                  :class="`tux-map__chip--${c.chip[0]}`"
                >
                  {{ c.chip[1] }}
                </span>
                <span
                  v-if="c.diffBadge"
                  class="tux-map__chip"
                  :class="`tux-map__chip--diff-${c.diffBadge[0]}`"
                >
                  {{ c.diffBadge[1] }}
                </span>
              </span>
              <span
                v-if="c.zoomable"
                class="tux-map__el-zb"
                :title="zoomBucketTitleFor(c.id, c.mini)"
                aria-hidden="true"
              >
                +
              </span>
            </button>
          </template>

          <!-- Level 4 Deployment Resource Cards -->
          <template v-else>
            <button
              v-for="n in stageData.deployNodes"
              :key="n.id"
              type="button"
              :data-id="n.id"
              class="tux-map__el tux-map__el--k-resource"
              :class="[
                n.status && n.status !== 'now' ? `tux-map__el--st-${n.status}` : '',
                blastRadiusState?.directIds.has(n.id)
                  ? 'tux-map__el--diff-direct'
                  : blastRadiusState?.impactedIds.has(n.id)
                    ? 'tux-map__el--diff-impact'
                    : '',
                {
                  'tux-map__el--zoomable': canZoomDeployNode(n),
                  'tux-map__el--lit': isElementLit(n.id),
                },
              ]"
              :style="{
                left: `${stageData.rects[n.id]?.x ?? 0}px`,
                top: `${stageData.rects[n.id]?.y ?? 0}px`,
                width: `${stageData.rects[n.id]?.w ?? 210}px`,
                height: `${stageData.rects[n.id]?.h ?? 92}px`,
              }"
              :aria-pressed="selectedId === n.id"
              @click="selectElement(selectedId === n.id ? null : n.id)"
              @dblclick.stop="canZoomDeployNode(n) && zoomIntoElement(n.id)"
            >
              <span class="tux-map__el-nm">
                <Icon :name="elementIconName(n.kind)" class="tux-map__el-ic" aria-hidden="true" />
                <span>{{ n.title }}</span>
              </span>
              <span
                v-if="n.facts?.size || n.facts?.sku || n.facts?.version || n.facts?.ingress"
                class="tux-map__el-ty"
                :title="n.facts?.size || n.facts?.sku || n.facts?.version || n.facts?.ingress"
              >
                {{ n.facts?.size || n.facts?.sku || n.facts?.version || n.facts?.ingress }}
              </span>
              <span class="tux-map__el-ft">
                <span v-if="n.hosts?.length">
                  Hosts {{ n.hosts.length }} container{{ n.hosts.length === 1 ? "" : "s" }}
                </span>
                <span v-if="n.status === 'planned'" class="tux-map__chip tux-map__chip--planned">
                  Planned
                </span>
                <span
                  v-if="formatDiffBadge(n.id, n.diff)"
                  class="tux-map__chip"
                  :class="`tux-map__chip--diff-${formatDiffBadge(n.id, n.diff)![0]}`"
                >
                  {{ formatDiffBadge(n.id, n.diff)![1] }}
                </span>
              </span>
              <span
                v-if="canZoomDeployNode(n)"
                class="tux-map__el-zb"
                :title="`${wheelZooms ? 'Scroll up' : 'Ctrl+scroll up'} or double-click to zoom in to Level 5 internal modules/schemas`"
                aria-hidden="true"
              >
                +
              </span>
            </button>
          </template>

          <!-- Layer 3 / 10 (z-index: 3 at rest, 1 when dimmed, 10 when popped out / lit): HTML Wire Label Pills -->
          <div
            v-for="lbl in routedSvg.labels"
            :key="lbl.id"
            :data-from="lbl.from"
            :data-to="lbl.to"
            :data-forced="lbl.forced ? '1' : ''"
            class="tux-map__lab"
            :class="{ 'tux-map__lab--on': isWireLit(lbl.from, lbl.to) }"
            :style="{
              left: `${lbl.x + lbl.w / 2}px`,
              top: `${lbl.y + lbl.h / 2}px`,
              display: lbl.forced && !isWireLit(lbl.from, lbl.to) ? 'none' : undefined,
            }"
          >
            <span class="tux-map__lab-t1">{{ lbl.t1 }}</span>
            <span v-if="lbl.t2" class="tux-map__lab-t2">[{{ lbl.t2 }}]</span>
          </div>

          <!-- Sticky Notes Overlay (Scoped to Current Level & Focus) -->
          <div
            v-for="note in visibleNotes"
            :key="note.id"
            class="tux-map__note"
            :style="{
              transform: `translate3d(${note.x}px, ${note.y}px, 0)`,
            }"
            @pointerdown="onNotePointerDown(note, $event)"
            @dblclick.stop="editingNoteId = note.id"
          >
            <div class="tux-map__note-head">
              <span>
                {{ note.author ?? "M.A.P. Note" }}
                <template v-if="note.targetNodeId"> · #{{ note.targetNodeId }}</template>
              </span>
              <button
                type="button"
                class="tux-map__note-close"
                :aria-label="`Remove note by ${note.author ?? 'reviewer'}`"
                @click.stop="removeNote(note.id)"
              >
                ×
              </button>
            </div>
            <textarea
              v-if="editingNoteId === note.id"
              :value="note.text"
              class="tux-map__note-input"
              rows="3"
              aria-label="Edit sticky note text"
              @input="updateNoteText(note.id, ($event.target as HTMLTextAreaElement).value)"
              @blur="editingNoteId = null"
              @keydown.escape.stop="editingNoteId = null"
            />
            <p v-else class="tux-map__note-body">{{ note.text }}</p>
          </div>

          <!-- Vue Flow–Style Magnetic Proximity Frame & Connection Handles -->
          <div
            v-if="proximityCard && activeTool === 'select'"
            ref="proximityFrameRef"
            class="tux-map__proximity-frame"
            :class="{ 'tux-map__proximity-frame--zoomable': proximityCard.zoomable }"
            :style="{
              left: `${proximityCard.x - 6}px`,
              top: `${proximityCard.y - 6}px`,
              width: `${proximityCard.w + 12}px`,
              height: `${proximityCard.h + 12}px`,
            }"
            aria-hidden="true"
          >
            <i class="tux-map__port tux-map__port--n" />
            <i class="tux-map__port tux-map__port--e" />
            <i class="tux-map__port tux-map__port--s" />
            <i class="tux-map__port tux-map__port--w" />
            <span
              v-if="proximityCard.zoomable || currentLevel > 1"
              class="tux-map__proximity-pill"
            >
              <span class="tux-map__proximity-pill-ic">
                {{ proximityCard.zoomable ? "⊕" : "⊖" }}
              </span>
              <span>
                {{
                  isMagnified
                    ? proximityCard.zoomable
                      ? `Double-click to zoom · ${proximityCard.name}`
                      : `Esc to zoom out · ${proximityCard.name}`
                    : proximityCard.zoomable
                      ? `${wheelZooms ? "Scroll" : "Ctrl+scroll"} to zoom · ${proximityCard.name}`
                      : `${wheelZooms ? "Scroll" : "Ctrl+scroll"} out · ${proximityCard.name}`
                }}
              </span>
            </span>
          </div>

          <!-- Elastic Magnetic Proximity Tether SVG (Connects Cursor in Empty Space to Attached Card) -->
          <svg
            ref="proximityTetherSvgRef"
            class="tux-map__proximity-tether"
            :width="stageData.width"
            :height="stageData.height"
            aria-hidden="true"
          >
            <path ref="proximityTetherBeamRef" class="tux-map__proximity-beam" d="M0,0 L0,0" />
            <circle ref="proximityAnchorDotRef" class="tux-map__proximity-anchor" cx="0" cy="0" r="4.5" />
            <circle ref="proximityCursorDotRef" class="tux-map__proximity-cursor" cx="0" cy="0" r="6" />
          </svg>

          <!-- On-Demand Freehand Ink & Laser SVG Overlay (Only Mounted When Used) -->
          <svg
            v-if="
              renderedInkPaths.length > 0 ||
              activePenSvgPath ||
              activeLaserSvgPath
            "
            class="tux-map__ink-overlay"
            :width="stageData.width"
            :height="stageData.height"
            aria-hidden="true"
          >
            <path
              v-for="stroke in renderedInkPaths"
              :key="stroke.id"
              :d="stroke.d"
              :fill="stroke.color"
              fill-opacity="0.88"
            />
            <path
              v-if="activePenSvgPath"
              :d="activePenSvgPath"
              :fill="props.penColor"
              fill-opacity="0.9"
            />
            <path
              v-if="activeLaserSvgPath"
              :d="activeLaserSvgPath"
              fill="var(--status-critical)"
            />
          </svg>
        </div>

        <!-- Portal Frame Shockwave Overlay (Paired with Mouse Wheel & Level Zoom) -->
        <div ref="portalRef" class="tux-map__zoom-portal" aria-hidden="true" />

        <!-- Floating Wheel Zoom Level HUD -->
        <div
          v-if="zoomHudText"
          class="tux-map__zoom-hud"
          :class="`tux-map__zoom-hud--${zoomHudDirection}`"
          aria-hidden="true"
        >
          <span class="tux-map__zoom-hud-ic">{{ zoomHudDirection === "in" ? "⊕" : "⊖" }}</span>
          <span>{{ zoomHudText }}</span>
        </div>
      </div>

      <!-- Accessible List View (Only Mounted When Active) -->
      <div v-if="isListView" class="tux-map__list">
        <section v-for="grp in listViewGroups" :key="grp.title">
          <h4>{{ grp.title }}</h4>
          <ul>
            <li v-for="e in grp.els" :key="e.id">
              <button
                type="button"
                class="tux-map__el"
                :class="`tux-map__el--k-${e.kind || 'container'}`"
                :data-list-id="e.id"
                :aria-pressed="selectedId === e.id"
                @click="selectElement(selectedId === e.id ? null : e.id)"
              >
                <span class="tux-map__el-nm">
                  <Icon :name="elementIconName(e.kind)" class="tux-map__el-ic" aria-hidden="true" />
                  <span>{{ e.name }}</span>
                </span>
                <span v-if="e.tech" class="tux-map__el-ty">[{{ e.tech }}]</span>
                <span v-if="e.desc" class="tux-map__el-ds">{{ e.desc }}</span>
              </button>
              <dl v-if="listRelsById.get(e.id)" class="tux-map__list-rels">
                <template v-if="listRelsById.get(e.id)!.uses.length">
                  <dt>Depends on</dt>
                  <dd>{{ listRelsById.get(e.id)!.uses.join(", ") }}</dd>
                </template>
                <template v-if="listRelsById.get(e.id)!.usedBy.length">
                  <dt>Used by</dt>
                  <dd>{{ listRelsById.get(e.id)!.usedBy.join(", ") }}</dd>
                </template>
              </dl>
            </li>
            <li v-for="n in grp.deployNodes" :key="n.id">
              <button
                type="button"
                class="tux-map__el tux-map__el--k-resource"
                :data-list-id="n.id"
                :aria-pressed="selectedId === n.id"
                @click="selectElement(selectedId === n.id ? null : n.id)"
              >
                <span class="tux-map__el-nm">
                  <Icon :name="elementIconName(n.kind)" class="tux-map__el-ic" aria-hidden="true" />
                  <span>{{ n.title }}</span>
                </span>
                <span class="tux-map__el-ds">{{ n.role }}</span>
              </button>
              <dl v-if="listRelsById.get(n.id)" class="tux-map__list-rels">
                <template v-if="listRelsById.get(n.id)!.uses.length">
                  <dt>Depends on</dt>
                  <dd>{{ listRelsById.get(n.id)!.uses.join(", ") }}</dd>
                </template>
                <template v-if="listRelsById.get(n.id)!.usedBy.length">
                  <dt>Used by</dt>
                  <dd>{{ listRelsById.get(n.id)!.usedBy.join(", ") }}</dd>
                </template>
              </dl>
            </li>
          </ul>
        </section>
      </div>

      <!-- Right-Side Details Drawer -->
      <aside
        ref="panelRef"
        class="tux-map__panel"
        :class="{ 'tux-map__panel--open': Boolean(selectedPanelEntity) }"
        :aria-live="isListView ? 'off' : 'polite'"
        aria-label="Selected element details"
        @keydown.escape="isListView && selectElement(null)"
      >
        <template v-if="selectedPanelEntity">
          <button
            type="button"
            class="tux-map__iconbtn tux-map__panel-close"
            aria-label="Close details panel"
            @click="selectElement(null)"
          >
            ×
          </button>

          <template v-if="selectedLevelElement">
            <h4 class="tux-map__panel-title" tabindex="-1">
              <Icon :name="elementIconName(selectedLevelElement.kind)" class="tux-map__panel-ic" aria-hidden="true" />
              <span>{{ selectedLevelElement.name }}</span>
            </h4>
            <p class="tux-map__panel-ty">
              {{ TYPE_LABELS[selectedLevelElement.kind || "container"] }}
              <template v-if="selectedLevelElement.tech"> · {{ selectedLevelElement.tech }}</template>
            </p>

            <div
              v-if="selectedLevelElement.status === 'planned' || selectedLevelElement.status === 'paused'"
              class="tux-map__panel-chips"
            >
              <span
                v-if="selectedLevelElement.status === 'planned'"
                class="tux-map__chip tux-map__chip--planned"
              >
                Planned
              </span>
              <span
                v-if="selectedLevelElement.status === 'paused'"
                class="tux-map__chip tux-map__chip--paused"
              >
                Paused
              </span>
            </div>

            <p v-if="selectedLevelElement.desc" class="tux-map__panel-role">
              {{ selectedLevelElement.desc }}
            </p>

            <button
              v-if="selectedIsOutside"
              type="button"
              class="tux-map__panel-btn"
              @click="revealElement(selectedLevelElement.id)"
            >
              Go to where it lives
            </button>
            <button
              v-if="canZoomElement(selectedLevelElement)"
              type="button"
              class="tux-map__panel-btn"
              @click="zoomIntoElement(selectedLevelElement.id)"
            >
              {{
                hasFractalSubgraph(selectedLevelElement.id)
                  ? `Zoom in to Level ${fractalZoomLevelFor(selectedLevelElement.id)}: ${getSubgraphForNode(selectedLevelElement.id)?.stratum || "internal modules"}`
                  : currentLevel === 1
                    ? "Zoom in to Level 2: containers & services"
                    : currentLevel === 2
                      ? `Zoom in to Level 3: its ${(activeModel.level3[selectedLevelElement.id] || []).length} components`
                      : "Zoom in to Level 4: deployment host"
              }}
            </button>
          </template>
          <template v-else-if="selectedDeployNode">
            <h4 class="tux-map__panel-title" tabindex="-1">
              <Icon :name="elementIconName(selectedDeployNode.kind)" class="tux-map__panel-ic" aria-hidden="true" />
              <span>{{ selectedDeployNode.title }}</span>
            </h4>
            <p class="tux-map__panel-ty">
              Deployment node
              <template v-if="selectedDeployNode.facts?.type">
                · {{ selectedDeployNode.facts.type }}
              </template>
            </p>

            <p class="tux-map__panel-role">{{ selectedDeployNode.role }}</p>

            <div v-if="selectedDeployNode.placement" class="tux-map__panel-place">
              {{ selectedDeployNode.placement }}
            </div>

            <button
              v-if="canZoomDeployNode(selectedDeployNode)"
              type="button"
              class="tux-map__panel-btn"
              @click="zoomIntoElement(selectedDeployNode.id)"
            >
              Zoom in to Level 5: {{ getSubgraphForNode(selectedDeployNode.id)?.stratum || "internal modules & schemas" }}
            </button>
          </template>

          <!-- PR Diff / Blast Radius Summary -->
          <template v-if="selectedPanelEntity.diff || selectedPanelDiffBadge">
            <h5 class="tux-map__panel-h">{{ selectedPanelEntity.diff || hasModelDiffs ? "PR Change & Blast Radius" : "Selection & Blast Radius" }}</h5>
            <div class="tux-map__panel-diff">
              <span
                v-if="selectedPanelDiffBadge"
                class="tux-map__chip"
                :class="`tux-map__chip--diff-${selectedPanelDiffBadge[0]}`"
              >
                {{ selectedPanelDiffBadge[1] }}
              </span>
              <p v-if="selectedPanelEntity.diff?.summary" class="tux-map__panel-diff-sum">
                {{ selectedPanelEntity.diff.summary }}
              </p>
            </div>
          </template>

          <!-- Find usages of the selection, through the model's code & C4 links (#119) -->
          <template v-if="selectionUsages">
            <h5 class="tux-map__panel-h">Find usages</h5>
            <div class="tux-map__panel-blast">
              <p class="tux-map__panel-blast-sum">
                {{
                  selectionUsages.totalCount
                    ? `${selectionUsages.directCount} direct dependent${selectionUsages.directCount === 1 ? "" : "s"} (${selectionUsages.directLinkCount} direct link${selectionUsages.directLinkCount === 1 ? "" : "s"}); ${selectionUsages.twoStepCount} within 2 steps${selectionUsages.deeperCount ? `, ${selectionUsages.totalCount} total` : ""}.`
                    : selectionUsages.hiddenMentionsCount
                      ? `No code or runtime dependents (${selectionUsages.hiddenMentionsCount} doc mention${selectionUsages.hiddenMentionsCount === 1 ? "" : "s"} hidden).`
                      : selectedHasInRels && blastIntent !== "default"
                        ? "No upstream impact under the current blast intent."
                        : "Nothing on the map depends on it."
                }}
              </p>
              <div
                v-if="selectionUsages.totalCount > 0"
                class="tux-map__seg tux-map__blast-tabs"
                role="group"
                aria-label="Usage distance"
              >
                <button
                  type="button"
                  :aria-pressed="usagesTab === 'direct'"
                  @click="usagesTab = 'direct'"
                >
                  Direct <span class="tux-map__seg-n">({{ selectionUsages.directCount }})</span>
                </button>
                <button
                  type="button"
                  :aria-pressed="usagesTab === 'two-steps'"
                  @click="usagesTab = 'two-steps'"
                >
                  Within 2 steps <span class="tux-map__seg-n">({{ selectionUsages.twoStepCount }})</span>
                </button>
              </div>
              <div
                v-if="usageKindChips.length > 0"
                class="tux-map__blast-kinds"
                role="group"
                aria-label="Filter by link kind"
              >
                <button
                  v-for="kc in usageKindChips"
                  :key="kc.kind"
                  type="button"
                  class="tux-map__blast-kind"
                  :aria-pressed="kc.active"
                  @click="toggleUsageKind(kc.kind)"
                >
                  {{ kc.label }} <span class="tux-map__seg-n">({{ kc.count }})</span>
                </button>
              </div>
              <button
                v-if="selectionUsages.totalCount && !showBlastRadius"
                type="button"
                class="tux-map__panel-btn"
                @click="showBlastRadius = true"
              >
                Show it on the map
              </button>
              <ol v-if="selectionUsages.groups.length > 0" class="tux-map__blast-list">
                <li v-for="grp in selectionUsages.groups" :key="grp.key" class="tux-map__blast-group">
                  <div class="tux-map__blast-group-hdr">{{ grp.label }}</div>
                  <ol class="tux-map__blast-sublist">
                    <li v-for="f in grp.rows" :key="f.id" class="tux-map__blast-row">
                      <span class="tux-map__blast-hop" :title="`${f.hop} step${f.hop === 1 ? '' : 's'} away`">{{ f.hop }}<span class="tux-map__blast-sr"> step{{ f.hop === 1 ? "" : "s" }} away</span></span>
                      <button
                        v-if="parentOf.has(f.id)"
                        type="button"
                        class="tux-map__blast-go"
                        :title="`Go to ${f.locLabel} on the map`"
                        @click="revealElement(f.id)"
                      >
                        <code>{{ f.locLabel }}</code>
                        <span v-if="f.symbolLabel" class="tux-map__blast-sym">{{ f.symbolLabel }}</span>
                        <span class="tux-map__blast-how">{{ f.how }}</span>
                        <span class="tux-map__blast-why">Why? {{ f.whyDetail }}</span>
                      </button>
                      <span v-else class="tux-map__blast-go tux-map__blast-go--static">
                        <code>{{ f.locLabel }}</code>
                        <span v-if="f.symbolLabel" class="tux-map__blast-sym">{{ f.symbolLabel }}</span>
                        <span class="tux-map__blast-how">{{ f.how }}</span>
                        <span class="tux-map__blast-why">Why? {{ f.whyDetail }}</span>
                      </span>
                      <a
                        v-if="f.href"
                        :href="f.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="tux-map__blast-src"
                        :title="`Open the line in ${f.locLabel}`"
                        :aria-label="`${f.how}: ${f.locLabel} (opens in a new tab)`"
                      >
                        <Icon name="lucide:file-code" aria-hidden="true" />
                      </a>
                    </li>
                  </ol>
                </li>
              </ol>
              <button
                v-if="selectionUsages.hasMore"
                type="button"
                class="tux-map__panel-btn tux-map__blast-more"
                @click="usagesShowAll = true"
              >
                Show all ({{ selectionUsages.showAllTotal }})
              </button>
              <p v-if="selectionUsages.truncated" class="tux-map__panel-blast-sum">
                Stopped at hop limit; deeper dependents exist.
              </p>
            </div>
          </template>

          <!-- Source Code Reference -->
          <template v-if="selectedPanelEntity.source">
            <h5 class="tux-map__panel-h">Source Code</h5>
            <div class="tux-map__panel-source">
              <a
                v-if="buildSourceHref(selectedPanelEntity.source)"
                :href="buildSourceHref(selectedPanelEntity.source)!"
                target="_blank"
                rel="noopener noreferrer"
                class="tux-map__source-lnk"
              >
                <code>{{ selectedPanelEntity.source.path }}</code>
                <span v-if="selectedPanelEntity.source.lineRange && selectedPanelEntity.source.lineRange.length >= 2">
                  :L{{ selectedPanelEntity.source.lineRange[0] }}–L{{ selectedPanelEntity.source.lineRange[1] }}
                </span>
              </a>
              <code v-else class="tux-map__source-pill">
                {{ selectedPanelEntity.source.path }}
              </code>
              <div v-if="selectedPanelEntity.source.symbol" class="tux-map__source-sym">
                Symbol: <code>{{ selectedPanelEntity.source.symbol }}</code>
              </div>
            </div>
          </template>

          <template v-if="selectedLevelElement">
            <!-- Live Operational Telemetry -->
            <template v-if="selectedLevelElement.live">
              <h5 class="tux-map__panel-h">Live State</h5>
              <dl class="tux-map__panel-dl">
                <template v-if="formatLiveState(selectedLevelElement)">
                  <dt>State</dt>
                  <dd>{{ formatLiveState(selectedLevelElement)![1] }}</dd>
                </template>
                <template v-if="selectedLevelElement.live.version">
                  <dt>Version</dt>
                  <dd>{{ selectedLevelElement.live.version }}</dd>
                </template>
                <template v-if="selectedLevelElement.live.updates">
                  <dt>Updates</dt>
                  <dd>{{ selectedLevelElement.live.updates }}</dd>
                </template>
              </dl>
            </template>

            <!-- Cross-Jump to Level 4 Infrastructure Hosts -->
            <template v-if="normalizeArray(selectedLevelElement.deployed).length > 0">
              <h5 class="tux-map__panel-h">Runs on (Level 4)</h5>
              <ul class="tux-map__panel-rels">
                <li
                  v-for="rid in normalizeArray(selectedLevelElement.deployed)"
                  :key="rid"
                >
                  <button
                    v-if="resById[rid]"
                    type="button"
                    class="tux-map__lnk"
                    @click="goToLevel(4, { nextSel: rid, inward: true })"
                  >
                    {{ resById[rid]!.title }}
                  </button>
                  <span v-else>{{ rid }}</span>
                </li>
              </ul>
            </template>

            <!-- Used By / Uses -->
            <template
              v-for="sec in [
                { key: 'ub', title: 'Used by', list: selectedUsedByRels },
                { key: 'us', title: 'Uses', list: selectedUsesRels },
              ]"
              :key="sec.key"
            >
              <template v-if="sec.list.length > 0">
                <h5 class="tux-map__panel-h">{{ sec.title }} ({{ sec.list.length }})</h5>
                <ul class="tux-map__panel-rels">
                  <li v-for="(item, idx) in sec.list" :key="`${sec.key}-${idx}`">
                    <button
                      type="button"
                      class="tux-map__lnk"
                      @click="selectElement(item.other.id)"
                    >
                      {{ item.other.name }}
                    </button>
                    <span>: {{ item.rel.label }}</span>
                    <span v-if="item.rel.tech" class="tux-map__panel-tech">{{ item.rel.tech }}</span>
                    <span v-if="item.rel.roadmap?.length" class="tux-map__panel-roadmap-inline">
                      <template v-for="iss in item.rel.roadmap" :key="iss">
                        <a
                          v-if="buildIssueHref(iss)"
                          :href="buildIssueHref(iss)!"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="tux-map__issue-lnk"
                        >
                          #{{ iss }}
                        </a>
                        <span v-else class="tux-map__issue-pill">#{{ iss }}</span>
                      </template>
                    </span>
                  </li>
                </ul>
              </template>
            </template>
          </template>

          <template v-else-if="selectedDeployNode">
            <template v-if="selectedDeployNode.hosts?.length">
              <h5 class="tux-map__panel-h">Hosts (Level 2)</h5>
              <ul class="tux-map__panel-rels">
                <li v-for="cid in selectedDeployNode.hosts" :key="cid">
                  <button
                    v-if="byId[cid]"
                    type="button"
                    class="tux-map__lnk"
                    @click="goToLevel(2, { nextSel: cid, inward: false })"
                  >
                    {{ byId[cid]!.name }}
                  </button>
                  <span v-if="byId[cid]?.tech" class="tux-map__panel-tech">
                    {{ byId[cid]!.tech }}
                  </span>
                </li>
              </ul>
            </template>

            <template v-if="selectedDeployNode.facts?.size || selectedDeployNode.facts?.sku">
              <h5 class="tux-map__panel-h">Specifications</h5>
              <dl class="tux-map__panel-dl">
                <template v-if="selectedDeployNode.facts?.size">
                  <dt>Size</dt>
                  <dd>{{ selectedDeployNode.facts.size }}</dd>
                </template>
                <template v-if="selectedDeployNode.facts?.sku">
                  <dt>SKU</dt>
                  <dd>{{ selectedDeployNode.facts.sku }}</dd>
                </template>
              </dl>
            </template>

            <template v-if="selectedDeployNode.facts?.rules?.length">
              <h5 class="tux-map__panel-h">Firewall rules</h5>
              <table class="tux-map__panel-table">
                <thead>
                  <tr>
                    <th>Dir</th>
                    <th>Ports</th>
                    <th>From</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, rIdx) in selectedDeployNode.facts.rules" :key="rIdx">
                    <td>{{ r.direction === "in" ? "In" : "Out" }}, {{ r.access }}</td>
                    <td>{{ r.ports.join(", ") }}</td>
                    <td>{{ r.from.join(", ") }}</td>
                  </tr>
                </tbody>
              </table>
            </template>

            <template
              v-for="sec in [
                { key: 'din', title: 'Connections in', list: selectedDeployInLinks },
                { key: 'dout', title: 'Connections out', list: selectedDeployOutLinks },
              ]"
              :key="sec.key"
            >
              <template v-if="sec.list.length > 0">
                <h5 class="tux-map__panel-h">{{ sec.title }}</h5>
                <ul class="tux-map__panel-rels">
                  <li v-for="(it, idx) in sec.list" :key="`${sec.key}-${idx}`">
                    <button
                      type="button"
                      class="tux-map__lnk"
                      @click="selectElement(it.other.id)"
                    >
                      {{ it.other.title }}
                    </button>
                    <span v-if="it.link.label">: {{ it.link.label }}</span>
                  </li>
                </ul>
              </template>
            </template>
          </template>

          <!-- Roadmap Issues -->
          <template v-if="selectedPanelEntity.roadmap?.length">
            <h5 class="tux-map__panel-h">Roadmap</h5>
            <div class="tux-map__panel-roadmap">
              <template v-for="iss in selectedPanelEntity.roadmap" :key="iss">
                <a
                  v-if="buildIssueHref(iss)"
                  :href="buildIssueHref(iss)!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="tux-map__issue-lnk"
                >
                  #{{ iss }}
                </a>
                <span v-else class="tux-map__issue-pill">#{{ iss }}</span>
              </template>
            </div>
          </template>
        </template>
      </aside>
    </div>

    <!-- Local Cross-Level Go-To Search Palette (#120) -->
    <div
      v-if="goToOpen"
      class="tux-map__goto-backdrop"
      @mousedown.self="closeGoToPalette(true)"
    >
      <div
        class="tux-map__goto-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Go to architecture element"
      >
        <div class="tux-map__goto-bar">
          <Icon name="lucide:scan-search" class="tux-map__goto-ic" aria-hidden="true" />
          <input
            ref="goToInputRef"
            v-model="goToQuery"
            type="text"
            role="combobox"
            aria-label="Search components, folders, files, functions, and routes"
            aria-autocomplete="list"
            aria-expanded="true"
            :aria-controls="goToListboxId"
            :aria-activedescendant="goToVirtualSlice.activeOptionId"
            class="tux-map__goto-input"
            placeholder="Type a file, symbol, folder, component, or /v1/… route"
            @keydown="onGoToKeydown"
          />
          <button
            type="button"
            class="tux-map__iconbtn tux-map__goto-close"
            aria-label="Close Go to palette"
            @click="closeGoToPalette(true)"
          >
            ×
          </button>
        </div>

        <div
          :id="goToListboxId"
          ref="goToListRef"
          role="listbox"
          aria-label="Matching architecture elements"
          class="tux-map__goto-list"
          @scroll="onGoToScroll"
        >
          <template v-if="goToFlatModel.hits.length > 0">
            <div
              v-if="goToVirtualSlice.topPx > 0"
              aria-hidden="true"
              :style="{ height: `${goToVirtualSlice.topPx}px` }"
            />
            <template v-for="item in goToVirtualSlice.visible" :key="item.key">
              <div
                v-if="item.type === 'header'"
                class="tux-map__goto-hdr"
                aria-hidden="true"
              >
                <span>{{ item.group }}</span>
                <span class="tux-map__goto-hdr-cnt">{{ item.count }}</span>
              </div>
              <div
                v-else
                :id="`${goToListboxId}-opt-${item.hitOrdinal}`"
                role="option"
                class="tux-map__goto-opt"
                :class="{ 'tux-map__goto-opt--active': item.hitOrdinal === goToActiveIdx }"
                :aria-selected="item.hitOrdinal === goToActiveIdx"
                @mouseenter="goToActiveIdx = item.hitOrdinal"
                @mousedown.prevent
                @click="jumpToSearchEntry(item.hit.entry)"
              >
                <span class="tux-map__goto-opt-grp">{{ item.hit.entry.group }}</span>
                <span class="tux-map__goto-opt-main">
                  <span class="tux-map__goto-opt-nm">{{ item.hit.entry.name }}</span>
                  <span
                    v-if="item.hit.entry.path || item.hit.entry.ancestorsText"
                    class="tux-map__goto-opt-meta"
                  >
                    {{ item.hit.entry.path || item.hit.entry.ancestorsText }}
                  </span>
                </span>
                <span class="tux-map__goto-opt-lvl">L{{ item.hit.entry.level }}</span>
              </div>
            </template>
            <div
              v-if="goToVirtualSlice.bottomPx > 0"
              aria-hidden="true"
              :style="{ height: `${goToVirtualSlice.bottomPx}px` }"
            />
          </template>
          <div
            v-else
            role="option"
            aria-disabled="true"
            aria-selected="false"
            class="tux-map__goto-empty"
          >
            No matching elements{{ goToQuery ? ` for “${goToQuery}”` : "" }}.
          </div>
        </div>
      </div>
    </div>

    <figcaption v-if="caption" class="tux-map__caption">{{ caption }}</figcaption>
    <div class="tux-map__sr" aria-live="polite">{{ liveAnnouncement }}</div>
  </figure>
</template>

<style scoped>
.tux-map {
  margin: 1.5rem 0;
  font-family: var(--font-body);
  color: var(--text-primary);
  /* the map's own width decides its narrow layout, not the window's: it may sit in a sidebar */
  container: tux-map / inline-size;
  /* WCAG 2.2 AAA (7:1) in every TUX theme and colour-vision palette, measured across all 20 (#106).
     Text on a brand fill falls to 3.1:1 (soft dark, tritan) and brand-coloured text to 3.6:1, and
     TUX's --text-on-brand is 2.1-2.4:1 in the dark themes. Body text on a brand tint holds 9.1:1 or
     more everywhere, so text stays --text-primary: the brand carries borders, bars, tints, icons and
     link underlines, never the letters */
  --tux-map-brand-ink: var(--text-primary);
  --tux-map-brand-tint: color-mix(in srgb, var(--brand-primary) 18%, var(--surface-raised));
  /* 2.5.5 Target Size (Enhanced); TUX's field-sunlight mode asks 48px for gloved hands */
  --tux-map-target: 44px;
}

[data-vision-comfort="field-sunlight"] .tux-map {
  --tux-map-target: 48px;
}

.tux-map__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.tux-map__eyebrow {
  margin: 0 0 0.2rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--tux-map-brand-ink);
}

.tux-map__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.tux-map__level-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
}

.tux-map__level-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--brand-primary);
}

/* Toolbar & Segmented Level Controls */
.tux-map__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.85rem;
  margin: 0.5rem 0 0.55rem;
}

.tux-map__seg {
  display: inline-flex;
  flex-wrap: wrap;
  max-width: 100%;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-raised);
}

.tux-map__seg button {
  min-height: var(--tux-map-target);
  font: inherit;
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.45rem 0.75rem;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.tux-map__seg button + button {
  border-left: 1px solid var(--surface-border);
}

.tux-map__seg button:hover:not(:disabled):not([aria-pressed="true"]) {
  color: var(--text-primary);
  background: var(--surface-sunken);
}

.tux-map__seg button[aria-pressed="true"],
.tux-map__seg button[aria-pressed="true"]:hover {
  background: var(--tux-map-brand-tint);
  color: var(--text-primary);
  /* a bar as well as a tint: pressed reads without colour (1.4.1) */
  box-shadow: inset 0 -3px 0 var(--brand-primary);
}

.tux-map__seg button:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.tux-map__seg-n {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  opacity: 0.8;
}

.tux-map__stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  overflow: hidden;
}

.tux-map__stepper .tux-map__iconbtn {
  border: 0;
  border-radius: 0;
  height: var(--tux-map-target);
  width: var(--tux-map-target);
}

.tux-map__stepper .tux-map__iconbtn:hover:not(:disabled) {
  background: var(--surface-sunken);
}

.tux-map__stepper-stratum {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.7rem;
  height: 32px;
  border-left: 1px solid var(--surface-border);
  border-right: 1px solid var(--surface-border);
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-map__stepper-lvl {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-sm);
  background: var(--tux-map-brand-tint);
  color: var(--text-primary);
}

.tux-map__stepper-name {
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tux-map__iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--tux-map-target);
  height: var(--tux-map-target);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  color: var(--text-primary);
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  line-height: 1;
}

.tux-map__iconbtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tux-map__switch {
  display: inline-flex;
  align-items: center;
  min-height: var(--tux-map-target);
  gap: 0.45rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.tux-map__switch input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.tux-map__switch-track {
  width: 34px;
  height: 20px;
  border-radius: 10px;
  background: var(--surface-border);
  position: relative;
  transition: background 0.15s;
  flex: none;
}

.tux-map__switch-track::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--surface-raised);
  transition: transform 0.15s;
}

.tux-map__switch input:checked + .tux-map__switch-track {
  background: var(--brand-primary);
}

.tux-map__switch input:checked + .tux-map__switch-track::after {
  transform: translateX(14px);
}

.tux-map__intent-select {
  min-height: var(--tux-map-target);
  padding: 0.3rem 0.55rem;
  font: inherit;
  font-size: 0.75rem;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.tux-map__spacer {
  flex: 1;
}

.tux-map__search-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.tux-map__search-icon {
  position: absolute;
  left: 0.5rem;
  width: 0.85rem;
  height: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
}

.tux-map__search-input {
  min-height: var(--tux-map-target);
  padding: 0.35rem 0.6rem 0.35rem 1.7rem;
  width: 11.5rem;
  font: inherit;
  font-size: 0.75rem;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.tux-map__search-count {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.tux-map__goto-btn {
  min-height: var(--tux-map-target);
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.35rem 0.68rem;
  font: inherit;
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.tux-map__goto-btn:hover {
  border-color: var(--brand-primary);
  background: var(--tux-map-brand-tint);
}

.tux-map__goto-kbd {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.05rem 0.35rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.tux-map__magnify-fit {
  min-width: 3.4rem;
  min-height: var(--tux-map-target);
  padding: 0 0.4rem;
  border: 0;
  border-inline: 1px solid var(--surface-border);
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
}

.tux-map__magnify-fit[aria-pressed="true"] {
  color: var(--text-secondary);
}

.tux-map__list-rels {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.15rem 0.5rem;
  margin: 0.35rem 0 0.2rem 0.85rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-map__list-rels dt {
  font-family: var(--font-bold);
  font-weight: 700;
  color: var(--text-primary);
}

.tux-map__list-rels dd {
  margin: 0;
}

/* Breadcrumbs, Hint, Summary, Legend */
.tux-map__crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0.25rem 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.tux-map__crumbs li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.tux-map__crumbs li + li::before {
  content: "›";
  color: var(--text-muted);
}

.tux-map__crumbs button {
  all: unset;
  display: inline-flex;
  align-items: center;
  min-height: var(--tux-map-target);
  cursor: pointer;
  color: var(--tux-map-brand-ink);
  text-decoration: underline;
  text-decoration-color: var(--brand-primary);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.tux-map__crumbs [aria-current] {
  font-family: var(--font-bold);
  font-weight: 700;
  color: var(--text-primary);
}

.tux-map__hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.2rem 0 0.35rem;
}

.tux-map__summary {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.6rem;
}

.tux-map__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.1rem;
  margin: 0 0 0.65rem;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-map__legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.tux-map__swatch {
  display: inline-block;
  width: 18px;
  height: 12px;
  border-radius: 3px;
}

.tux-map__swatch--person {
  background: #3C0018;
}

.tux-map__swatch--system {
  background: var(--tux-map-brand-tint);
  border: 2.5px solid var(--brand-primary);
}

.tux-map__swatch--card {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
}

.tux-map__swatch--route {
  background: var(--tux-map-brand-tint);
  border: 1.5px solid var(--brand-primary);
  border-radius: 999px;
}

.tux-map__other-levels {
  display: inline-flex;
  align-items: center;
  margin: 0 0 0.55rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-primary);
}

.tux-map__swatch--region {
  background: var(--surface-page);
  border: 1px solid var(--surface-border);
}

.tux-map__swatch--external {
  background: var(--surface-page);
  border: 1px solid var(--text-muted);
}

.tux-map__swatch--planned {
  background: transparent;
  border: 1.5px dashed var(--text-muted);
}

.tux-map__swatch--diff-direct {
  background: var(--surface-raised);
  border: 2px solid var(--status-warning);
}

.tux-map__swatch--diff-impact {
  background: var(--surface-raised);
  border: 2px dashed var(--status-critical);
}

.tux-map__legend svg {
  width: 28px;
  height: 8px;
  overflow: visible;
}

/* Canvas, Viewport & Color-Mode-Aware Custom Cursors */
.tux-map__canvas {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  /* Light mode custom SVG cursors (Aggie Maroon #500000 + crisp white halo) */
  --tux-cursor-nav: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='9' fill='rgba(80,0,0,0.08)' stroke='%23FFFFFF' stroke-width='2.6'/%3E%3Ccircle cx='14' cy='14' r='9' fill='none' stroke='%23500000' stroke-width='1.5' stroke-dasharray='4 2.5'/%3E%3Ccircle cx='14' cy='14' r='2.6' fill='%23500000' stroke='%23FFFFFF' stroke-width='1.4'/%3E%3C/svg%3E") 14 14, grab;
  --tux-cursor-zoom: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='10.5' fill='rgba(80,0,0,0.14)' stroke='%23FFFFFF' stroke-width='2.8'/%3E%3Ccircle cx='15' cy='15' r='10.5' fill='none' stroke='%23500000' stroke-width='1.8'/%3E%3Cpath d='M15 10.5v9M10.5 15h9' stroke='%23FFFFFF' stroke-width='3.2' stroke-linecap='round'/%3E%3Cpath d='M15 10.5v9M10.5 15h9' stroke='%23500000' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 15 15, pointer;
  --tux-cursor-card: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'%3E%3Cpath d='M5 3.5L21 11.5L13.5 14L11 21.5L5 3.5Z' fill='%23500000' stroke='%23FFFFFF' stroke-width='2.2' stroke-linejoin='round'/%3E%3C/svg%3E") 5 4, pointer;
}

[data-theme="tti-dark"] .tux-map__canvas {
  /* Dark mode custom SVG cursors (Luminous Aggie Gold #F5D580 + deep #15100F halo) */
  --tux-cursor-nav: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='9' fill='rgba(245,213,128,0.12)' stroke='%2315100F' stroke-width='2.8'/%3E%3Ccircle cx='14' cy='14' r='9' fill='none' stroke='%23F5D580' stroke-width='1.6' stroke-dasharray='4 2.5'/%3E%3Ccircle cx='14' cy='14' r='2.6' fill='%23F5D580' stroke='%2315100F' stroke-width='1.4'/%3E%3C/svg%3E") 14 14, grab;
  --tux-cursor-zoom: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='10.5' fill='rgba(245,213,128,0.18)' stroke='%2315100F' stroke-width='2.8'/%3E%3Ccircle cx='15' cy='15' r='10.5' fill='none' stroke='%23F5D580' stroke-width='1.8'/%3E%3Cpath d='M15 10.5v9M10.5 15h9' stroke='%2315100F' stroke-width='3.2' stroke-linecap='round'/%3E%3Cpath d='M15 10.5v9M10.5 15h9' stroke='%23F5D580' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") 15 15, pointer;
  --tux-cursor-card: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'%3E%3Cpath d='M5 3.5L21 11.5L13.5 14L11 21.5L5 3.5Z' fill='%23F5D580' stroke='%2315100F' stroke-width='2.2' stroke-linejoin='round'/%3E%3C/svg%3E") 5 4, pointer;
}

[data-theme="tti-hc"] .tux-map__canvas,
[data-cvd-mode]:not([data-cvd-mode="brand"]) .tux-map__canvas {
  /* High-contrast & Colorblind-safe dual-ring SVG cursors (#00E5FF + #000000 + #FFFFFF) */
  --tux-cursor-nav: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='9.5' fill='rgba(0,229,255,0.16)' stroke='%23000000' stroke-width='3.2'/%3E%3Ccircle cx='14' cy='14' r='9.5' fill='none' stroke='%2300E5FF' stroke-width='1.8'/%3E%3Ccircle cx='14' cy='14' r='3' fill='%23FFD600' stroke='%23000000' stroke-width='1.5'/%3E%3C/svg%3E") 14 14, grab;
  --tux-cursor-zoom: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='11' fill='rgba(0,229,255,0.22)' stroke='%23000000' stroke-width='3.2'/%3E%3Ccircle cx='15' cy='15' r='11' fill='none' stroke='%2300E5FF' stroke-width='2'/%3E%3Cpath d='M15 10v10M10 15h10' stroke='%23000000' stroke-width='3.6' stroke-linecap='round'/%3E%3Cpath d='M15 10v10M10 15h10' stroke='%23FFD600' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 15 15, pointer;
  --tux-cursor-card: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'%3E%3Cpath d='M5 3.5L21 11.5L13.5 14L11 21.5L5 3.5Z' fill='%23FFD600' stroke='%23000000' stroke-width='2.4' stroke-linejoin='round'/%3E%3C/svg%3E") 5 4, pointer;
}

.tux-map__viewport {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  background-image: radial-gradient(
    color-mix(in srgb, var(--text-muted) 25%, transparent) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
  cursor: var(--tux-cursor-nav);
  user-select: none;
  -webkit-user-select: none;
  /* a finger scrolls the page past the map and pinches to zoom; only the drawing tools take the gesture */
  touch-action: manipulation;
  overscroll-behavior: contain;
}

.tux-map__viewport--magnified {
  overflow: auto;
}

.tux-map__sizer {
  pointer-events: none;
}

.tux-map__viewport--has-proximity {
  cursor: var(--tux-cursor-card);
}

.tux-map__viewport--proximity-zoom {
  cursor: var(--tux-cursor-zoom);
}

.tux-map__viewport--tool-pen,
.tux-map__viewport--tool-laser,
.tux-map__viewport--tool-note {
  touch-action: none;
  cursor: crosshair;
  user-select: none;
  -webkit-user-select: none;
}

.tux-map__viewport--tool-pen .tux-map__el,
.tux-map__viewport--tool-laser .tux-map__el,
.tux-map__viewport--tool-note .tux-map__el,
.tux-map__viewport--tool-pen .tux-map__bound,
.tux-map__viewport--tool-laser .tux-map__bound,
.tux-map__viewport--tool-note .tux-map__bound,
.tux-map__viewport--tool-pen .tux-map__lab,
.tux-map__viewport--tool-laser .tux-map__lab,
.tux-map__viewport--tool-note .tux-map__lab {
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.tux-map__stage {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  will-change: transform, opacity;
  user-select: none;
  -webkit-user-select: none;
}

.tux-map__stage--pan {
  transition: transform 0.25s ease;
}

/* Portal Frame Shockwave & Floating Wheel Zoom HUD */
.tux-map__zoom-portal {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
  pointer-events: none;
  will-change: transform, width, height, opacity;
  border-radius: 12px;
  border: 2px solid var(--brand-primary);
  background: radial-gradient(
    circle at center,
    color-mix(in srgb, var(--brand-primary) 16%, transparent) 0%,
    color-mix(in srgb, var(--brand-primary) 4%, transparent) 70%,
    transparent 100%
  );
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--brand-primary) 18%, transparent),
    0 12px 32px rgba(0, 0, 0, 0.16);
}

.tux-map__zoom-hud {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: var(--surface-raised);
  border: 1.5px solid var(--brand-primary);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--text-primary);
  animation: tux-map-hud-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.tux-map__zoom-hud-ic {
  color: var(--tux-map-brand-ink);
  font-size: 0.9rem;
  line-height: 1;
}

@keyframes tux-map-hud-pop {
  from {
    opacity: 0;
    transform: translate(-50%, -8px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

/* Boundaries & Regions */
.tux-map__bound {
  position: absolute;
  z-index: 0;
  border: 1.5px dashed var(--text-muted);
  border-radius: 12px;
  background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-map__bound-label {
  position: absolute;
  left: 14px;
  top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.tux-map__bound-label b {
  font-family: var(--font-bold);
  font-weight: 700;
  color: var(--text-primary);
  font-size: 13px;
}

.tux-map__bound.region {
  border-style: solid;
  border-color: var(--surface-border);
  background: var(--surface-page);
}

.tux-map__bound.region.planned {
  border-style: dashed;
  border-color: var(--text-muted);
  background: transparent;
}

/* Layer 1 (z-index: 1): Base Orthogonal Wires SVG */
.tux-map__wires {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.tux-map__wire {
  fill: none;
  stroke: var(--text-secondary);
  stroke-width: 1.4;
  opacity: 0.8;
  transition: none !important;
}

.tux-map__wires--level4 .tux-map__wire {
  opacity: 0;
}

.tux-map__wire--planned {
  stroke: var(--text-muted);
  stroke-dasharray: 6 5;
}

.tux-map__wires--has-on .tux-map__wire {
  opacity: 0.12;
}

[data-vision-stroke="heavy"] .tux-map__wire {
  stroke-width: 2.4;
  opacity: 1;
}

[data-vision-stroke="heavy"] .tux-map__wire-fg {
  stroke-width: 3.2;
}

[data-vision-stroke="heavy"] .tux-map__el:not(.tux-map__el--k-system) {
  border-width: 2px;
}

[data-vision-stroke="heavy"] .tux-map__el--k-system {
  border-width: 3.5px;
}

/* Layer 4 (z-index: 4): Foreground Active Wires SVG (Above Dimmed Cards & Dimmed Labels) */
.tux-map__wires-fg {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 4;
}

.tux-map__wire-fg {
  display: none;
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 2;
  opacity: 0.42;
  transition: none !important;
}

.tux-map__wire-fg--planned {
  stroke-dasharray: 6 5;
}

.tux-map__wire-fg--blast {
  stroke: var(--status-warning);
  stroke-width: 2.3;
}

.tux-map__wire-fg--stream {
  stroke: var(--brand-primary);
  stroke-width: 2.4;
  stroke-dasharray: 8 11;
  stroke-linecap: round;
  opacity: 0.95;
  animation: tux-map-wire-flow 0.62s linear infinite;
}

.tux-map__wire-fg--stream.tux-map__wire-fg--blast {
  stroke: var(--status-warning);
}

.tux-map__wire-fg--on {
  display: inline;
}

@keyframes tux-map-wire-flow {
  from {
    stroke-dashoffset: 19;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Vue Flow–Style Magnetic Proximity Frame, Port Handles & Elastic Tether */
.tux-map__proximity-frame {
  position: absolute;
  z-index: 6;
  pointer-events: none;
  border-radius: 13px;
  border: 1.5px dashed color-mix(in srgb, var(--brand-primary) 72%, transparent);
  background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 10%, transparent);
  transition:
    left 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.12s cubic-bezier(0.22, 1, 0.36, 1);
}

.tux-map__proximity-frame--zoomable {
  border-style: solid;
  border-color: var(--brand-primary);
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--brand-primary) 14%, transparent),
    0 8px 24px rgba(0, 0, 0, 0.12);
}

.tux-map__port {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--surface-raised);
  border: 2px solid var(--brand-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}

.tux-map__port--n {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.tux-map__port--e {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.tux-map__port--s {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.tux-map__port--w {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.tux-map__proximity-pill {
  position: absolute;
  left: 8px;
  top: -24px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--surface-raised);
  border: 1px solid var(--brand-primary);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.14);
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 10.5px;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-map__proximity-pill-ic {
  color: var(--tux-map-brand-ink);
  font-size: 12px;
  line-height: 1;
}

.tux-map__proximity-tether {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 12;
  opacity: 0;
  transition: opacity 0.14s ease;
}

.tux-map__proximity-beam {
  fill: none;
  stroke: var(--brand-primary);
  stroke-width: 1.75;
  stroke-dasharray: 5 5;
  stroke-linecap: round;
  animation: tux-map-wire-flow 0.55s linear infinite;
}

.tux-map__proximity-anchor {
  fill: var(--brand-primary);
  stroke: var(--surface-raised);
  stroke-width: 1.8;
}

.tux-map__proximity-cursor {
  fill: color-mix(in srgb, var(--brand-primary) 22%, transparent);
  stroke: var(--brand-primary);
  stroke-width: 1.8;
}

/* Layer 3 / 10: HTML Wire Label Pills (z-index: 3 at rest, 1 when dimmed, 10 when popped out) */
.tux-map__lab {
  position: absolute;
  z-index: 3;
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  line-height: 1.25;
  transition: none !important;
}

.tux-map__lab-t1 {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-primary);
}

.tux-map__lab-t2 {
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--text-muted);
}

.tux-map__stage--dim .tux-map__lab:not(.tux-map__lab--on) {
  z-index: 1;
  opacity: 0.15;
}

.tux-map__stage--dim .tux-map__lab--on,
.tux-map__lab--on {
  z-index: 10;
  opacity: 1;
  border-color: var(--brand-primary);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
}

/* Layer 2 / 5: C4 Element Cards (z-index: 2 at rest, 1 when dimmed, 5 when lit) */
.tux-map__el {
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  cursor: var(--tux-cursor-card);
  overflow: hidden;
  padding: 0.6rem 0.7rem 0.55rem;
  border-radius: 10px;
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  text-align: left;
  font: inherit;
  transition:
    transform 0.16s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.16s ease,
    border-color 0.14s ease;
}

.tux-map__el--zoomable {
  cursor: var(--tux-cursor-zoom);
}

.tux-map__el--proximity {
  border-color: color-mix(in srgb, var(--brand-primary) 78%, var(--surface-border));
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  z-index: 6;
}

.tux-map__el:hover {
  border-color: var(--brand-primary);
  z-index: 8;
  height: auto !important;
  min-height: 128px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
}

.tux-map__el--mini:hover,
.tux-map__el--k-resource:hover {
  min-height: 82px;
}

.tux-map__el:hover .tux-map__el-ty,
.tux-map__el[aria-pressed="true"] .tux-map__el-ty {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.tux-map__el:hover .tux-map__el-ds,
.tux-map__el[aria-pressed="true"] .tux-map__el-ds {
  -webkit-line-clamp: unset;
  overflow: visible;
}

.tux-map__el:focus-visible {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
}

.tux-map__el[aria-pressed="true"] {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px var(--brand-primary);
  z-index: 7;
  height: auto !important;
}

.tux-map__el-nm {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
  color: var(--text-primary);
  flex: none;
}

.tux-map__el-nm > span {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tux-map__el-ic {
  width: 16px;
  height: 16px;
  flex: none;
  margin-top: 1px;
}

.tux-map__el--zoomable .tux-map__el-nm {
  padding-right: 24px;
}

.tux-map__el-ty {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: none;
}

.tux-map__el-ds {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 0 1 auto;
  min-height: 0;
}

.tux-map__el-ft {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 11px;
  color: var(--text-secondary);
  min-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  flex: none;
}

.tux-map__el-zb {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  color: var(--tux-map-brand-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
  font-family: var(--font-bold);
  font-weight: 700;
}

.tux-map__el:hover .tux-map__el-zb {
  background: var(--tux-map-brand-tint);
  border-color: var(--brand-primary);
  color: var(--text-primary);
}

.tux-map__el--mini {
  padding: 0.45rem 0.6rem;
  gap: 0.1rem;
}

.tux-map__el--mini .tux-map__el-nm {
  font-size: 13px;
}

.tux-map__el--k-person {
  background: #3C0018;
  border-color: #3C0018;
  border-radius: 22px 22px 10px 10px;
}

.tux-map__el--k-person .tux-map__el-nm,
.tux-map__el--k-person .tux-map__el-ds,
.tux-map__el--k-person .tux-map__el-ty {
  color: #FFFFFF;
}

.tux-map__el--k-person .tux-map__el-ty,
.tux-map__el--k-person .tux-map__el-ds {
  opacity: 0.88;
}

.tux-map__el--k-system {
  background: var(--tux-map-brand-tint);
  border: 2.5px solid var(--brand-primary);
}

.tux-map__el--k-system .tux-map__el-nm,
.tux-map__el--k-system .tux-map__el-ds,
.tux-map__el--k-system .tux-map__el-ty,
.tux-map__el--k-system .tux-map__el-ft,
.tux-map__el--k-system .tux-map__el-zb {
  color: var(--text-primary);
}

.tux-map__el--k-container,
.tux-map__el--k-database,
.tux-map__el--k-storage,
.tux-map__el--k-component,
.tux-map__el--k-module,
.tux-map__el--k-schema,
.tux-map__el--k-symbol,
.tux-map__el--k-route,
.tux-map__el--k-resource {
  box-shadow:
    inset 4px 0 0 var(--brand-primary),
    0 1px 2px rgba(0, 0, 0, 0.06);
}

.tux-map__el--k-route {
  background: color-mix(in srgb, var(--brand-primary) 7%, var(--surface-raised));
}

.tux-map__el--k-container .tux-map__el-ic,
.tux-map__el--k-database .tux-map__el-ic,
.tux-map__el--k-storage .tux-map__el-ic,
.tux-map__el--k-component .tux-map__el-ic,
.tux-map__el--k-module .tux-map__el-ic,
.tux-map__el--k-schema .tux-map__el-ic,
.tux-map__el--k-symbol .tux-map__el-ic,
.tux-map__el--k-route .tux-map__el-ic,
.tux-map__el--k-resource .tux-map__el-ic {
  color: var(--tux-map-brand-ink);
}

.tux-map__el--diff-direct {
  border-color: var(--status-warning) !important;
  box-shadow:
    inset 4px 0 0 var(--status-warning),
    0 0 0 2px color-mix(in srgb, var(--status-warning) 45%, transparent);
}

.tux-map__el--diff-impact {
  border-color: var(--status-critical) !important;
  border-style: dashed;
  box-shadow:
    inset 4px 0 0 var(--status-critical),
    0 0 0 1.5px color-mix(in srgb, var(--status-critical) 35%, transparent);
}

.tux-map__el--k-external {
  background: var(--surface-page);
  border-color: var(--surface-border);
}

.tux-map__el--k-external .tux-map__el-ic {
  color: var(--text-muted);
}

.tux-map__el--st-planned {
  background: transparent;
  border: 1.5px dashed var(--text-muted);
  box-shadow: none;
}

.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) {
  z-index: 1;
  opacity: 0.28;
}

.tux-map__stage--dim .tux-map__el--lit {
  z-index: 5;
}

.tux-map__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  background: var(--text-muted);
}

.tux-map__dot--ok {
  background: var(--color-success, #15803D);
}

.tux-map__dot--warn {
  background: var(--color-warning, #B45309);
}

.tux-map__dot--bad {
  background: var(--color-error, #B91C1C);
}

.tux-map__chip {
  display: inline-block;
  padding: 0.05em 0.5em;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1.6;
  background: var(--surface-sunken);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
}

.tux-map__chip--diff-modified,
.tux-map__chip--diff-added {
  background: color-mix(in srgb, var(--status-warning) 22%, var(--surface-raised));
  color: var(--text-primary);
  border-color: var(--status-warning);
}

.tux-map__chip--diff-deleted,
.tux-map__chip--diff-impact {
  background: color-mix(in srgb, var(--status-critical) 18%, var(--surface-raised));
  color: var(--text-primary);
  border-color: var(--status-critical);
}

/* Sticky Notes & Ink Overlay */
.tux-map__note {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;
  width: 196px;
  padding: 0.55rem 0.65rem;
  border-radius: var(--radius-sm);
  background: #FEF9C3;
  color: #1F1614;
  border: 1px solid #CA8A04;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
  cursor: move;
}

.tux-map__note-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
}

.tux-map__note-close {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.875rem;
}

.tux-map__note-body {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.35;
}

.tux-map__note-input {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 0.72rem;
  padding: 0.2rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  user-select: text;
  -webkit-user-select: text;
}

.tux-map__ink-overlay {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 20;
}

/* Sliding Right Details Drawer */
.tux-map__panel {
  position: absolute;
  z-index: 25;
  top: 12px;
  right: 12px;
  width: min(380px, calc(100% - 24px));
  max-height: calc(100% - 24px);
  overflow: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  padding: 1rem 1.1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  transform: translateX(calc(100% + 24px));
  visibility: hidden;
  transition:
    transform 0.22s ease,
    visibility 0.22s;
}

.tux-map__panel--open {
  transform: none;
  visibility: visible;
}

.tux-map__panel-close {
  position: absolute;
  top: 8px;
  right: 8px;
}

.tux-map__panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding-right: 2.2rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.25;
}

.tux-map__panel-ic {
  width: 20px;
  height: 20px;
  color: var(--tux-map-brand-ink);
  flex: none;
}

.tux-map__panel-ty {
  margin: 0.25rem 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.tux-map__panel-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.45rem;
}

.tux-map__panel-role {
  margin: 0.6rem 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.45;
}

.tux-map__panel-btn {
  min-height: var(--tux-map-target);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.8rem;
  padding: 0.5rem 0.8rem;
  border-radius: var(--radius-md);
  border: 0;
  cursor: pointer;
  background: var(--tux-map-brand-tint);
  color: var(--text-primary);
  box-shadow: inset 0 0 0 2px var(--brand-primary);
  font: inherit;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 13px;
}

.tux-map__panel-h {
  margin: 1.1rem 0 0.4rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.tux-map__panel-dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 0.9rem;
  margin: 0;
  font-size: 13px;
}

.tux-map__panel-dl dt {
  color: var(--text-muted);
}

.tux-map__panel-dl dd {
  margin: 0;
  color: var(--text-primary);
}

.tux-map__panel-rels {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 13px;
}

.tux-map__panel-rels li {
  padding: 0.35rem 0;
  border-top: 1px solid var(--surface-border);
}

.tux-map__panel-rels li:first-child {
  border-top: 0;
}

.tux-map__panel-tech {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}

.tux-map__lnk {
  all: unset;
  display: inline-flex;
  align-items: center;
  min-height: var(--tux-map-target);
  cursor: pointer;
  color: var(--tux-map-brand-ink);
  font-family: var(--font-bold);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tux-map__panel-roadmap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tux-map__panel-roadmap-inline {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-left: 0.35rem;
}

.tux-map__issue-lnk,
.tux-map__issue-pill {
  display: inline-flex;
  align-items: center;
  min-height: var(--tux-map-target);
  padding: 0.1rem 0.42rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--tux-map-brand-ink);
  text-decoration: none;
}

.tux-map__issue-lnk:hover {
  border-color: var(--brand-primary);
  text-decoration: underline;
}

.tux-map__panel-diff {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

.tux-map__panel-diff-sum {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-secondary);
}

.tux-map__panel-blast {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

.tux-map__panel-blast-sum {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-secondary);
}

.tux-map__blast-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  max-height: 22rem;
  overflow-y: auto;
  /* the containing block of each row's hidden hop text: without it that text
     escapes the scrolled list and lengthens the panel's own scroll */
  position: relative;
}

.tux-map__blast-row {
  display: grid;
  grid-template-columns: 1.6rem minmax(0, 1fr) auto;
  column-gap: 0.35rem;
  align-items: center;
  font-size: 12px;
}

.tux-map__blast-hop {
  grid-row: span 2;
  justify-self: center;
  min-width: 1.1rem;
  padding: 0 0.2rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-align: center;
}

/* "N steps away": read aloud with the hop number, never shown */
.tux-map__blast-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.tux-map__blast-go {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.1rem;
  min-width: 0;
  min-height: var(--tux-map-target);
  padding: 0.3rem 0.4rem;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--tux-map-brand-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.tux-map__blast-go code {
  font-family: var(--font-mono);
  font-size: 12px;
  word-break: break-all;
}

.tux-map__blast-go--static {
  color: var(--text-primary);
  cursor: default;
}

.tux-map__blast-go:not(.tux-map__blast-go--static):hover,
.tux-map__blast-go:focus-visible {
  background: var(--surface-sunken);
}

.tux-map__blast-how {
  color: var(--text-secondary);
  font-size: 12px;
}

.tux-map__blast-sym {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-primary);
}

.tux-map__blast-why {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.3;
}

.tux-map__blast-tabs {
  width: 100%;
}

.tux-map__blast-tabs button {
  flex: 1 1 auto;
  justify-content: center;
}

.tux-map__blast-kinds {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  width: 100%;
}

.tux-map__blast-kind {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-secondary);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.tux-map__blast-kind[aria-pressed="true"] {
  background: var(--tux-map-brand-tint);
  border-color: var(--brand-primary);
  color: var(--text-primary);
  font-weight: 700;
}

.tux-map__blast-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.tux-map__blast-group + .tux-map__blast-group {
  margin-top: 0.35rem;
  padding-top: 0.35rem;
  border-top: 1px solid var(--surface-border);
}

.tux-map__blast-group-hdr {
  font-family: var(--font-bold);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 0.1rem 0.2rem;
}

.tux-map__blast-sublist {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.tux-map__blast-more {
  width: 100%;
  justify-content: center;
}

/* Cross-Level Go-To Search Palette (#120) */
.tux-map__goto-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8vh 1rem 1rem;
  background: rgba(15, 12, 12, 0.52);
}

.tux-map__goto-dialog {
  width: min(640px, 100%);
  border-radius: var(--radius-md);
  border: 1.5px solid var(--brand-primary);
  background: var(--surface-raised);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.34);
  overflow: hidden;
}

.tux-map__goto-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  border-bottom: 1px solid var(--surface-border);
}

.tux-map__goto-ic {
  width: 18px;
  height: 18px;
  flex: none;
  color: var(--tux-map-brand-ink);
}

.tux-map__goto-input {
  flex: 1;
  min-width: 0;
  min-height: var(--tux-map-target);
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.9375rem;
  outline: none;
}

.tux-map__goto-close {
  flex: none;
}

.tux-map__goto-list {
  max-height: 352px;
  overflow-y: auto;
}

.tux-map__goto-hdr {
  box-sizing: border-box;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.85rem;
  background: var(--surface-sunken);
  border-top: 1px solid var(--surface-border);
  font-family: var(--font-bold);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.tux-map__goto-hdr-cnt {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.tux-map__goto-opt {
  box-sizing: border-box;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0 0.85rem;
  cursor: pointer;
  color: var(--text-primary);
}

.tux-map__goto-opt--active,
.tux-map__goto-opt:hover {
  background: var(--tux-map-brand-tint);
  box-shadow: inset 3px 0 0 var(--brand-primary);
}

.tux-map__goto-opt-grp {
  flex: none;
  padding: 0.08rem 0.42rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-primary);
}

.tux-map__goto-opt-main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  overflow: hidden;
}

.tux-map__goto-opt-nm {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-map__goto-opt-meta {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tux-map__goto-opt-lvl {
  flex: none;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.tux-map__goto-empty {
  padding: 1rem 0.85rem;
  font-size: 13px;
  color: var(--text-secondary);
}

.tux-map__blast-src {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--tux-map-target);
  height: var(--tux-map-target);
  border-radius: var(--radius-sm);
  color: var(--tux-map-brand-ink);
}

.tux-map__blast-src:hover,
.tux-map__blast-src:focus-visible {
  background: var(--surface-sunken);
}

.tux-map__panel-source {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 12px;
}

.tux-map__source-lnk,
.tux-map__source-pill {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.15rem;
  padding: 0.2rem 0.45rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--tux-map-brand-ink);
  text-decoration: none;
  word-break: break-all;
}

.tux-map__source-lnk:hover {
  border-color: var(--brand-primary);
  text-decoration: underline;
}

.tux-map__source-sym {
  font-size: 11px;
  color: var(--text-muted);
}

.tux-map__source-sym code {
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.tux-map__panel-place {
  margin-top: 0.6rem;
  font-size: 12px;
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.5rem;
}

.tux-map__panel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.tux-map__panel-table th {
  text-align: left;
  font-weight: 700;
  color: var(--text-muted);
  padding: 0.2rem 0.3rem 0.2rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.tux-map__panel-table td {
  padding: 0.3rem 0.3rem 0.3rem 0;
  border-bottom: 1px solid var(--surface-border);
  vertical-align: top;
}

/* Accessible List View */
.tux-map__list section {
  margin-bottom: 1.2rem;
}

.tux-map__list h4 {
  font-family: var(--font-bold);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 0.4rem;
}

.tux-map__list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.tux-map__list .tux-map__el {
  position: relative;
  width: 100%;
}

.tux-map__canvas--list .tux-map__panel {
  position: static;
  transform: none;
  visibility: visible;
  width: auto;
  max-height: none;
  margin-top: 1rem;
  box-shadow: none;
}

.tux-map__canvas--list .tux-map__panel:not(.tux-map__panel--open) {
  display: none;
}

/* A narrow map (a phone, a sidebar): the details follow the diagram instead of covering it */
@container tux-map (max-width: 640px) {
  .tux-map__panel {
    position: static;
    transform: none;
    visibility: visible;
    width: auto;
    max-height: none;
    margin-top: 1rem;
    box-shadow: none;
  }

  .tux-map__panel:not(.tux-map__panel--open) {
    display: none;
  }
}

.tux-map__caption {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
  max-width: 44rem;
  margin: 0.75rem auto 0;
  line-height: 1.5;
}

.tux-map__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .tux-map__stage--anim,
  .tux-map__stage--pan,
  .tux-map__panel,
  .tux-map__proximity-frame,
  .tux-map__switch-track::after {
    transition: none;
  }
  .tux-map__el {
    transition:
      box-shadow 0.16s ease,
      border-color 0.14s ease;
  }
  /* the flowing dashes and the zoom pop are motion: the wire keeps its dash
     pattern and colour, so what it marks is still there, standing still */
  .tux-map__wire-fg--stream,
  .tux-map__proximity-beam,
  .tux-map__zoom-hud {
    animation: none;
  }
}
</style>
