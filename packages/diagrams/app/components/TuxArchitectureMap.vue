<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import {
  DEFAULT_TTI_LEVEL_MODEL,
  GRID_METRICS,
  buildLevelModelFromLegacyNodes,
  getLaserPointerSvgPath,
  getSmoothedFreehandSvgPath,
  gridCellToPx,
  routeDeploymentWires,
  routeGridWires,
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
  type TuxMapLoDLevel,
  type TuxMapNode,
  type TuxMapPlacedBoundary,
  type TuxMapSourceRef,
  type TuxMapStickyNote,
  type TuxMapStrokePoint,
  type TuxMapSubgraph,
  type TuxMapTool,
  type TuxMapZone,
} from "../utils/tuxArchitectureMap";

export type TuxMapViewMode = "diagram" | "list";

export interface TuxArchitectureMapProps {
  /** Optional 4-Level + N-Depth C4 model (Level 1 -> Level 2 -> Level 3 -> Level 4 -> Level 5+). Defaults to TTI Code model if neither `model` nor `nodes` is provided. */
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
  (e: "update:view", view: TuxMapViewMode): void;
  (e: "update:lodMode", mode: "auto" | TuxMapLoDLevel): void;
  (e: "node-select", item: TuxMapLevelElement | TuxMapDeploymentNode | TuxMapNode | null): void;
  (e: "drill-down", payload: { nodeId: string; level: number; subgraphRef?: string }): void;
  (e: "update:strokes", strokes: TuxMapInkStroke[]): void;
  (e: "update:notes", notes: TuxMapStickyNote[]): void;
  (e: "cursor-move", payload: { x: number; y: number; tool: TuxMapTool }): void;
  (e: "laser-move", points: TuxMapStrokePoint[]): void;
}>();

const instanceId = useId();
const arrowMarkerId = `tux-map-arrow-${instanceId}`;

// ============================================================================
// 1. RESOLVED 4-LEVEL + FRACTAL N-DEPTH MODEL & LOOKUP MAPS
// ============================================================================

const activeModel = computed<TuxMapLevelModel>(() => {
  if (props.model) return props.model;
  if (props.nodes && props.nodes.length > 0) {
    return buildLevelModelFromLegacyNodes(props.nodes, props.edges, props.zones);
  }
  return DEFAULT_TTI_LEVEL_MODEL;
});

function resolveInitialIsListView(): boolean {
  const mode = props.view ?? props.initialView;
  if (mode === "list") return true;
  if (mode === "diagram") return false;
  if (typeof window !== "undefined") {
    return window.innerWidth < (props.autoListBreakpoint || 760);
  }
  return false;
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
const isListView = ref<boolean>(resolveInitialIsListView());
const searchQuery = ref<string>("");
const liveAnnouncement = ref<string>("");

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
  if (M.subgraphs?.[nodeId] && M.subgraphs[nodeId]!.elements.length > 0) {
    return M.subgraphs[nodeId]!;
  }
  const el = byId.value[nodeId];
  if (el?.subgraphRef && M.subgraphs?.[el.subgraphRef]?.elements.length) {
    return M.subgraphs[el.subgraphRef]!;
  }
  if (el?.children?.length) {
    return {
      stratum: `Internal Modules (${el.name})`,
      elements: el.children,
      rels: el.childRels,
    };
  }
  const dn = resById.value[nodeId];
  if (dn?.subgraphRef && M.subgraphs?.[dn.subgraphRef]?.elements.length) {
    return M.subgraphs[dn.subgraphRef]!;
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
  const map: Record<string, TuxMapLevelElement> = {};
  const indexChildren = (parentId: string, kids: TuxMapLevelElement[]) => {
    kids.forEach((k, i) => {
      const id = k.id || `${parentId}/${i}`;
      map[id] = { ...k, id, kind: k.kind ?? "component", parent: parentId };
      if (k.children?.length) {
        indexChildren(id, k.children);
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
      map[e.id] = e;
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
  const map: Record<string, TuxMapDeploymentNode> = {};
  for (const n of activeModel.value.level4.nodes) {
    map[n.id] = n;
  }
  return map;
});

const maxAvailableLevel = computed<number>(() => {
  const M = activeModel.value;
  let max = 4;
  if (M.subgraphs && Object.keys(M.subgraphs).length > 0) {
    max = Math.max(max, 5);
    for (const key of Object.keys(M.subgraphs)) {
      if (key.includes("/")) max = Math.max(max, 6);
    }
  }
  return Math.max(max, currentLevel.value);
});

// Ensure focusId is always valid for the active model
watch(
  activeModel,
  (m) => {
    if (
      !focusId.value ||
      (!m.level3[focusId.value] && !m.subgraphs?.[focusId.value])
    ) {
      const firstContainer = m.level2.elements.find(
        (e) => !e.ref && (m.level3[e.id]?.length ?? 0) > 0,
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
  person: "Person",
  system: "Software system",
  container: "Container",
  database: "Container: database",
  storage: "Container: storage",
  component: "Component",
  module: "Module / package",
  schema: "Data schema / index",
  symbol: "Code symbol (AST)",
  external: "External system",
  resource: "Deployment node",
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
  if (M.subgraphs?.[id] && M.subgraphs[id]!.elements.length > 0) return true;
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
  if (currentLevel.value >= 5) {
    return Boolean(!e.mini && normalizeArray(e.deployed).length > 0);
  }
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
      width: W,
      height: H,
    };
  }

  // Levels 1, 2, or 3
  let rawEls: TuxMapLevelElement[] = [];
  let rawRels: TuxMapLevelRel[] = [];
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
    rawEls = M.level2.elements.map((e) => (e.ref && lookup[e.id] ? { ...lookup[e.id]!, ...e } : e));
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
      if (k.next != null && (!sg?.rels || sg.rels.length === 0)) {
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

    if (sg?.rels?.length) {
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

    ins.forEach((id, i) => {
      const base = resolvePerimeterCard(id);
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
      const base = resolvePerimeterCard(id);
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

    rawBounds.push({
      id: "@bound",
      label: cName,
      type: sg?.stratum || (TYPE_LABELS[cKind] || "Container") + (cTech ? `: ${cTech}` : ""),
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
}

const blastRadiusState = computed<BlastRadiusComputation | null>(() => {
  if (!showBlastRadius.value) return null;

  const M = activeModel.value;
  const directIds = new Set<string>();
  const rollupCountById = new Map<string, number>();

  // Count inner modified nodes per container / system / subgraph parent
  let totalContainerDiffs = 0;
  for (const e of M.level2.elements) {
    let innerDiffs = 0;
    for (const k of M.level3[e.id] || []) {
      const kidId = k.id || "";
      if (k.diff) innerDiffs++;
      if (kidId && M.subgraphs?.[kidId]) {
        innerDiffs += M.subgraphs[kidId]!.elements.filter((se) => Boolean(se.diff)).length;
      }
    }
    if (M.subgraphs?.[e.id]) {
      innerDiffs += M.subgraphs[e.id]!.elements.filter((se) => Boolean(se.diff)).length;
    }
    if (innerDiffs > 0) {
      rollupCountById.set(e.id, innerDiffs);
      totalContainerDiffs += innerDiffs;
    }
    if (e.diff) totalContainerDiffs++;
  }

  if (totalContainerDiffs > 0 && M.level2.boundary) {
    rollupCountById.set(M.level2.boundary, totalContainerDiffs);
  }

  for (const [parentId, sg] of Object.entries(M.subgraphs || {})) {
    const inner = sg.elements.filter((se) => Boolean(se.diff)).length;
    if (inner > 0 && !rollupCountById.has(parentId)) {
      rollupCountById.set(parentId, inner);
    }
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

  const impactedIds = new Set<string>();
  const impactedWires = new Set<string>();

  // 1-hop and 2-hop dependency propagation across active stage wires
  const hop1 = new Set<string>(directIds);
  for (const w of routedSvg.value.wires) {
    const fromDirect =
      directIds.has(w.from) ||
      (w.from === "@bound" && focusId.value && (directIds.has(focusId.value) || rollupCountById.has(focusId.value)));
    const toDirect =
      directIds.has(w.to) ||
      (w.to === "@bound" && focusId.value && (directIds.has(focusId.value) || rollupCountById.has(focusId.value)));

    if (fromDirect || toDirect) {
      impactedWires.add(w.id);
      if (w.from !== "@bound" && !directIds.has(w.from)) {
        impactedIds.add(w.from);
        hop1.add(w.from);
      }
      if (w.to !== "@bound" && !directIds.has(w.to)) {
        impactedIds.add(w.to);
        hop1.add(w.to);
      }
    }
  }

  for (const w of routedSvg.value.wires) {
    if (impactedWires.has(w.id)) continue;
    if (hop1.has(w.from) || hop1.has(w.to)) {
      impactedWires.add(w.id);
      if (w.from !== "@bound" && !directIds.has(w.from)) impactedIds.add(w.from);
      if (w.to !== "@bound" && !directIds.has(w.to)) impactedIds.add(w.to);
    }
  }

  return { directIds, impactedIds, impactedWires, rollupCountById };
});

function formatDiffBadge(
  id: string,
  diff?: { changeType: "added" | "modified" | "deleted"; filesChanged?: number },
): [string, string] | null {
  const br = blastRadiusState.value;
  if (!br) return null;
  if (diff) {
    const prefix =
      diff.changeType === "added" ? "+ Added" : diff.changeType === "deleted" ? "− Deleted" : "△ Modified";
    return [
      diff.changeType,
      diff.filesChanged ? `${prefix} · ${diff.filesChanged}f` : prefix,
    ];
  }
  const rollup = br.rollupCountById.get(id);
  if (rollup) {
    return ["modified", `△ ${rollup} inner changed`];
  }
  if (br.impactedIds.has(id)) {
    return ["impact", "⚡ Impacted"];
  }
  return null;
}

const renderedCards = computed(() =>
  stageData.value.els.map((e) => {
    const r = stageData.value.rects[e.id];
    const kind = e.kind || "container";
    const baseType = TYPE_LABELS[kind] || "";
    const typeLabel = baseType || e.tech ? `[${baseType}${e.tech ? `: ${e.tech}` : ""}]` : "";
    const live = !e.mini ? formatLiveState(e) : null;
    const chip = !e.mini ? getCardChip(e) : null;
    const zoomable = canZoomElement(e);
    const br = blastRadiusState.value;
    const isDirect = Boolean(br?.directIds.has(e.id));
    const isImpacted = Boolean(!isDirect && br?.impactedIds.has(e.id));
    const diffBadge = !e.mini ? formatDiffBadge(e.id, e.diff) : null;
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

const matchingSearchIds = computed<Set<string> | null>(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return null;
  const set = new Set<string>();
  for (const [id, hay] of searchIndexById.value.entries()) {
    if (hay.includes(q)) set.add(id);
  }
  return set;
});

function isElementLit(id: string, parentId?: string): boolean {
  if (matchingSearchIds.value) {
    return matchingSearchIds.value.has(id);
  }
  if (!activeLitId.value) {
    const br = blastRadiusState.value;
    if (br && (br.directIds.size > 0 || br.impactedIds.size > 0)) {
      return br.directIds.has(id) || br.impactedIds.has(id);
    }
    return true;
  }
  if (litNeighbors.value.has(id)) return true;
  if (litNeighbors.value.has("@bound") && parentId) return true;
  return false;
}

function isWireLit(from: string, to: string, wireId?: string): boolean {
  const key = litKey.value;
  if (key) {
    return from === key || to === key;
  }
  const br = blastRadiusState.value;
  if (br && wireId) {
    return br.impactedWires.has(wireId);
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
  labelsByNode: Map<string, { el: HTMLElement; forced: boolean }[]>;
  neighborsByNode: Map<string, Set<string>>;
  litWires: SVGElement[];
  litLabels: { el: HTMLElement; forced: boolean }[];
}

let stageDomCache: StageDomCache | null = null;

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
    const from = w.dataset.from || "";
    const to = w.dataset.to || "";
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
      for (const w of stage.querySelectorAll<SVGElement>(".tux-map__wire-fg")) {
        const wid = w.dataset.id || "";
        if (br.impactedWires.has(wid)) {
          w.classList.add("tux-map__wire-fg--on");
          cache.litWires.push(w);
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
  for (let i = 0; i < cache.cards.length; i++) {
    const c = cache.cards[i]!;
    const isLit =
      c.id === rawId ||
      c.id === key ||
      Boolean(neighborSet?.has(c.id)) ||
      Boolean(boundLit && c.parent);
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
    const anchorX = Math.max(r.x, Math.min(r.x + r.w, stageX));
    const anchorY = Math.max(r.y, Math.min(r.y + r.h, stageY));
    const dist = Math.hypot(stageX - anchorX, stageY - anchorY);
    if (dist > maxDist) continue;

    const zoomable = isCardIdZoomable(id);
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

function updateProximityAtStagePoint(stageX: number, stageY: number) {
  if (activeTool.value !== "select" || isListView.value) {
    if (proximityCard.value) {
      proximityCard.value = null;
      setProximityClassOnDom(null);
    }
    hideProximityTetherDom();
    return;
  }

  const nearest = findNearestCardToPoint(stageX, stageY, 36, true);
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

  // Update elastic magnetic tether SVG in O(1) direct DOM when cursor is in the tight 36px halo around the card
  const svgEl = proximityTetherSvgRef.value;
  const beamEl = proximityTetherBeamRef.value;
  const curDot = proximityCursorDotRef.value;
  const ancDot = proximityAnchorDotRef.value;
  if (svgEl && beamEl && curDot && ancDot) {
    if (nearest.dist > 3) {
      const midX = (stageX + nearest.anchorX) / 2;
      const midY = (stageY + nearest.anchorY) / 2;
      const cardCx = nearest.rect.x + nearest.rect.w / 2;
      const cardCy = nearest.rect.y + nearest.rect.h / 2;
      // Slight magnetic curve toward card center axis
      const ctrlX = midX + (cardCx - midX) * 0.18;
      const ctrlY = midY + (cardCy - midY) * 0.18;
      beamEl.setAttribute(
        "d",
        `M${stageX.toFixed(1)},${stageY.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${nearest.anchorX.toFixed(1)},${nearest.anchorY.toFixed(1)}`,
      );
      curDot.setAttribute("cx", stageX.toFixed(1));
      curDot.setAttribute("cy", stageY.toFixed(1));
      ancDot.setAttribute("cx", nearest.anchorX.toFixed(1));
      ancDot.setAttribute("cy", nearest.anchorY.toFixed(1));
      const strength = Math.max(0.28, 1 - nearest.dist / 42);
      svgEl.style.opacity = strength.toFixed(2);
    } else {
      svgEl.style.opacity = "0";
    }
  }
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

const stageScale = computed<number>(() => {
  const avail = Math.max(320, viewportWidth.value - 2);
  const W = stageData.value.width;
  return Math.min(1, Number((avail / W).toFixed(4)));
});

const computedViewportHeight = computed<string>(() => {
  if (props.height && props.height !== "auto") {
    return props.height;
  }
  const scaledH = Math.ceil(stageData.value.height * stageScale.value);
  return `${Math.max(440, scaledH)}px`;
});

function measureViewport() {
  if (viewportRef.value && viewportRef.value.clientWidth > 0) {
    viewportWidth.value = viewportRef.value.clientWidth;
  }
}

function keepClear(id: string | null) {
  const r = id ? stageData.value.rects[id] : undefined;
  let want = 0;
  if (r && id && !isListView.value) {
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
onMounted(() => {
  measureViewport();
  if (typeof ResizeObserver !== "undefined" && viewportRef.value) {
    resizeObserver = new ResizeObserver(() => {
      measureViewport();
    });
    resizeObserver.observe(viewportRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (zoomHudTimer) clearTimeout(zoomHudTimer);
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
  currentHoveredId = null;
  setSelectionAndEmit(id);
  applyStageHighlight(id);

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
      const landedCard = stage.querySelector<HTMLElement>(
        `.tux-map__el[data-id="${resolvedTargetId}"]`,
      );
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

function zoomIntoElement(id: string) {
  const e = byId.value[id];
  const dn = resById.value[id];
  const itemName = e?.name || dn?.title || id;

  // Fractal Subgraph Drill-Down (Level 3 component -> Level 5, Level 4 host -> Level 5, Level 5 -> Level 6+)
  if (currentLevel.value >= 3 && hasFractalSubgraph(id)) {
    const nextLvl = currentLevel.value >= 5 ? currentLevel.value + 1 : 5;
    drillStack.value = [
      ...drillStack.value,
      { level: currentLevel.value, focusId: focusId.value || "" },
    ];
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
    if (focusId.value) {
      const fName = byId.value[focusId.value]?.name ?? focusId.value;
      goToLevel(3, {
        nextFocus: focusId.value,
        nextSel: null,
        fromCardId: id,
        inward: true,
        hudLabel: `Level 2 → Level 3 · ${fName}`,
      });
      liveAnnouncement.value = `Zoomed in to Level 3: internal components of ${fName}.`;
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
    // Fallback if entered Level 5+ directly without drillStack
    const isDeployParent = Boolean(currentF && resById.value[currentF]);
    const targetLevel = isDeployParent ? 4 : 3;
    goToLevel(targetLevel, {
      nextFocus: isDeployParent ? focusId.value : currentF?.split("/")[0] || focusId.value,
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

  // Lock onto the proximity-attached card when the wheel gesture begins so the scroll wheel
  // physically attaches to the nearest card and follows its zoom path even if the cursor is in empty space
  if (!lockedWheelCardId) {
    const nearMatch = findNearestCardToPoint(pt.x, pt.y, 44, isZoomIn);
    lockedWheelCardId =
      targetEl?.dataset?.id ||
      nearMatch?.id ||
      proximityCard.value?.id ||
      currentHoveredId ||
      selectedId.value ||
      null;
  }

  const candidateId =
    lockedWheelCardId ||
    targetEl?.dataset?.id ||
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

  // Physical pre-zoom response: attach to the proximity/hovered card, pull it slightly along the
  // cursor vector, and scale it as the wheel turns
  const activeCardEl =
    targetEl ||
    (candidateId && stageRef.value
      ? stageRef.value.querySelector<HTMLElement>(`.tux-map__el[data-id="${candidateId}"]`)
      : null);

  if (activeCardEl && Math.abs(wheelDeltaAccum) < 26) {
    if (preZoomCardEl && preZoomCardEl !== activeCardEl) {
      preZoomCardEl.style.transform = "";
    }
    preZoomCardEl = activeCardEl;
    const r = candidateId ? stageData.value.rects[candidateId] : undefined;
    const cardCx = r ? r.x + r.w / 2 : pt.x;
    const cardCy = r ? r.y + r.h / 2 : pt.y;
    const progress = Math.min(1, Math.abs(wheelDeltaAccum) / 26);
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
    if (!id && currentLevel.value === 1) {
      id = activeModel.value.level2.boundary;
    } else if (!id && currentLevel.value === 2) {
      id = focusId.value;
    } else if (!id && currentLevel.value === 3) {
      id = stageData.value.els.find((e) => !e.mini)?.id ?? stageData.value.els[0]?.id ?? null;
    }
    if (id && (byId.value[id] || resById.value[id])) {
      zoomIntoElement(id);
    } else if (currentLevel.value === 2 && focusId.value) {
      zoomIntoElement(focusId.value);
    } else if (currentLevel.value === 3) {
      goToLevel(4, { inward: true, hudLabel: "Level 3 → Level 4 · Deployment" });
    }
  } else {
    zoomOutLevel(resolvedId);
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
  } else if ((ev.key === "+" || ev.key === "=") && canStepIn.value) {
    ev.preventDefault();
    stepInLevel();
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

const listViewGroups = computed(() => {
  if (currentLevel.value === 4) {
    const groups = activeModel.value.level4.groups.map((g) => ({
      title: g.title,
      deployNodes: stageData.value.deployNodes.filter((n) => n.group === g.id),
      els: [] as TuxMapLevelElement[],
    }));
    const otherNodes = stageData.value.deployNodes.filter((n) => !n.group);
    if (otherNodes.length) {
      groups.push({
        title: "Identity, External & Planned Enclaves",
        deployNodes: otherNodes,
        els: [],
      });
    }
    return groups.filter((g) => g.deployNodes.length > 0);
  }

  const els = stageData.value.els;
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
    x: Math.round((clientX - rect.left - panX.value) / s),
    y: Math.round((clientY - rect.top) / s),
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

function buildIssueHref(issueNum: number): string | null {
  const base = activeModel.value.issueBaseUrl;
  if (!base) return null;
  return `${base.replace(/\/+$/, "")}/${issueNum}`;
}

function buildSourceHref(src?: {
  path: string;
  lineRange?: [number, number];
  url?: string;
}): string | null {
  if (!src) return null;
  if (src.url) return src.url;
  const base = activeModel.value.sourceBaseUrl;
  if (!base) return null;
  const cleanPath = src.path.replace(/^\/+/, "");
  const lineHash = src.lineRange
    ? src.lineRange[0] === src.lineRange[1]
      ? `#L${src.lineRange[0]}`
      : `#L${src.lineRange[0]}-L${src.lineRange[1]}`
    : "";
  return `${base.replace(/\/+$/, "")}/${cleanPath}${lineHash}`;
}
</script>

<template>
  <figure class="tux-map">
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

      <!-- Search Filter -->
      <div class="tux-map__search-wrap">
        <Icon name="lucide:search" class="tux-map__search-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          class="tux-map__search-input"
          placeholder="Filter elements, tech, hosts…"
          aria-label="Filter architecture elements"
        />
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

    <p class="tux-map__hint">
      {{
        currentLevel === 4
          ? "Choose a deployment resource to draw its connections and inspect its firewall rules and hosted containers. Double-click or scroll up on nodes with '+' to drill into Level 5 internal modules/schemas."
          : currentLevel >= 5
            ? "Inspecting deep internal modules & code symbols. Double-click or scroll up on '+' cards to drill deeper, or scroll down / press Escape to return to the parent level."
            : "Hover over any card to highlight its links, or scroll the mouse wheel over a card (or double-click / press +) to zoom in and out across Levels 1–6."
      }}
    </p>
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
        <li><i class="tux-map__swatch tux-map__swatch--external" /> External system</li>
        <li><i class="tux-map__swatch tux-map__swatch--planned" /> Planned</li>
      </template>
      <template v-if="showBlastRadius">
        <li><i class="tux-map__swatch tux-map__swatch--diff-direct" /> PR Modified</li>
        <li><i class="tux-map__swatch tux-map__swatch--diff-impact" /> Blast-Radius Impacted</li>
      </template>
      <li>
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path d="M0,4 L28,4" stroke="var(--text-secondary)" stroke-width="1.6" />
        </svg>
        Uses
      </li>
      <li>
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path d="M0,4 L28,4" stroke="var(--text-muted)" stroke-width="1.6" stroke-dasharray="6 5" />
        </svg>
        Planned link
      </li>
    </ul>

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
              @dblclick.stop="c.zoomable && zoomIntoElement(c.id)"
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
                title="Scroll up or double-click to zoom in a level"
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
                title="Scroll up or double-click to zoom in to Level 5 internal modules/schemas"
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
                  proximityCard.zoomable
                    ? `Scroll to zoom · ${proximityCard.name}`
                    : `Scroll out · ${proximityCard.name}`
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
              fill="#E11D48"
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
            </li>
            <li v-for="n in grp.deployNodes" :key="n.id">
              <button
                type="button"
                class="tux-map__el tux-map__el--k-resource"
                :aria-pressed="selectedId === n.id"
                @click="selectElement(selectedId === n.id ? null : n.id)"
              >
                <span class="tux-map__el-nm">
                  <Icon :name="elementIconName(n.kind)" class="tux-map__el-ic" aria-hidden="true" />
                  <span>{{ n.title }}</span>
                </span>
                <span class="tux-map__el-ds">{{ n.role }}</span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      <!-- Right-Side Details Drawer -->
      <aside
        ref="panelRef"
        class="tux-map__panel"
        :class="{ 'tux-map__panel--open': Boolean(selectedLevelElement || selectedDeployNode) }"
        aria-live="polite"
        aria-label="Selected element details"
      >
        <template v-if="selectedLevelElement">
          <button
            type="button"
            class="tux-map__iconbtn tux-map__panel-close"
            aria-label="Close details panel"
            @click="selectElement(null)"
          >
            ×
          </button>

          <h4 class="tux-map__panel-title">
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
            v-if="canZoomElement(selectedLevelElement)"
            type="button"
            class="tux-map__panel-btn"
            @click="zoomIntoElement(selectedLevelElement.id)"
          >
            {{
              hasFractalSubgraph(selectedLevelElement.id)
                ? `Zoom in to Level ${currentLevel >= 5 ? currentLevel + 1 : 5}: ${getSubgraphForNode(selectedLevelElement.id)?.stratum || "internal modules"}`
                : currentLevel === 1
                  ? "Zoom in to Level 2: containers & services"
                  : currentLevel === 2
                    ? `Zoom in to Level 3: its ${(activeModel.level3[selectedLevelElement.id] || []).length} components`
                    : "Zoom in to Level 4: deployment host"
            }}
          </button>

          <!-- PR Diff / Blast Radius Summary -->
          <template v-if="selectedLevelElement.diff || formatDiffBadge(selectedLevelElement.id, selectedLevelElement.diff)">
            <h5 class="tux-map__panel-h">PR Change &amp; Blast Radius</h5>
            <div class="tux-map__panel-diff">
              <span
                v-if="formatDiffBadge(selectedLevelElement.id, selectedLevelElement.diff)"
                class="tux-map__chip"
                :class="`tux-map__chip--diff-${formatDiffBadge(selectedLevelElement.id, selectedLevelElement.diff)![0]}`"
              >
                {{ formatDiffBadge(selectedLevelElement.id, selectedLevelElement.diff)![1] }}
              </span>
              <p v-if="selectedLevelElement.diff?.summary" class="tux-map__panel-diff-sum">
                {{ selectedLevelElement.diff.summary }}
              </p>
            </div>
          </template>

          <!-- Source Code Reference -->
          <template v-if="selectedLevelElement.source">
            <h5 class="tux-map__panel-h">Source Code</h5>
            <div class="tux-map__panel-source">
              <a
                v-if="buildSourceHref(selectedLevelElement.source)"
                :href="buildSourceHref(selectedLevelElement.source)!"
                target="_blank"
                rel="noopener noreferrer"
                class="tux-map__source-lnk"
              >
                <code>{{ selectedLevelElement.source.path }}</code>
                <span v-if="selectedLevelElement.source.lineRange">
                  :L{{ selectedLevelElement.source.lineRange[0] }}–L{{ selectedLevelElement.source.lineRange[1] }}
                </span>
              </a>
              <code v-else class="tux-map__source-pill">
                {{ selectedLevelElement.source.path }}
              </code>
              <div v-if="selectedLevelElement.source.symbol" class="tux-map__source-sym">
                Symbol: <code>{{ selectedLevelElement.source.symbol }}</code>
              </div>
            </div>
          </template>

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

          <!-- Used By (Upstream) -->
          <template v-if="selectedUsedByRels.length > 0">
            <h5 class="tux-map__panel-h">Used by ({{ selectedUsedByRels.length }})</h5>
            <ul class="tux-map__panel-rels">
              <li v-for="(item, idx) in selectedUsedByRels" :key="`ub-${idx}`">
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

          <!-- Uses (Downstream) -->
          <template v-if="selectedUsesRels.length > 0">
            <h5 class="tux-map__panel-h">Uses ({{ selectedUsesRels.length }})</h5>
            <ul class="tux-map__panel-rels">
              <li v-for="(item, idx) in selectedUsesRels" :key="`us-${idx}`">
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

          <!-- Roadmap Issues (Element) -->
          <template v-if="selectedLevelElement.roadmap?.length">
            <h5 class="tux-map__panel-h">Roadmap</h5>
            <div class="tux-map__panel-roadmap">
              <template v-for="iss in selectedLevelElement.roadmap" :key="iss">
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

        <!-- Level 4 Deployment Node Details -->
        <template v-else-if="selectedDeployNode">
          <button
            type="button"
            class="tux-map__iconbtn tux-map__panel-close"
            aria-label="Close details panel"
            @click="selectElement(null)"
          >
            ×
          </button>

          <h4 class="tux-map__panel-title">
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

          <!-- PR Diff / Blast Radius Summary (Deployment Node) -->
          <template v-if="selectedDeployNode.diff || formatDiffBadge(selectedDeployNode.id, selectedDeployNode.diff)">
            <h5 class="tux-map__panel-h">PR Change &amp; Blast Radius</h5>
            <div class="tux-map__panel-diff">
              <span
                v-if="formatDiffBadge(selectedDeployNode.id, selectedDeployNode.diff)"
                class="tux-map__chip"
                :class="`tux-map__chip--diff-${formatDiffBadge(selectedDeployNode.id, selectedDeployNode.diff)![0]}`"
              >
                {{ formatDiffBadge(selectedDeployNode.id, selectedDeployNode.diff)![1] }}
              </span>
              <p v-if="selectedDeployNode.diff?.summary" class="tux-map__panel-diff-sum">
                {{ selectedDeployNode.diff.summary }}
              </p>
            </div>
          </template>

          <!-- Source Code Reference (Deployment Node) -->
          <template v-if="selectedDeployNode.source">
            <h5 class="tux-map__panel-h">Source Code</h5>
            <div class="tux-map__panel-source">
              <a
                v-if="buildSourceHref(selectedDeployNode.source)"
                :href="buildSourceHref(selectedDeployNode.source)!"
                target="_blank"
                rel="noopener noreferrer"
                class="tux-map__source-lnk"
              >
                <code>{{ selectedDeployNode.source.path }}</code>
                <span v-if="selectedDeployNode.source.lineRange">
                  :L{{ selectedDeployNode.source.lineRange[0] }}–L{{ selectedDeployNode.source.lineRange[1] }}
                </span>
              </a>
              <code v-else class="tux-map__source-pill">
                {{ selectedDeployNode.source.path }}
              </code>
              <div v-if="selectedDeployNode.source.symbol" class="tux-map__source-sym">
                Symbol: <code>{{ selectedDeployNode.source.symbol }}</code>
              </div>
            </div>
          </template>

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

          <template v-if="selectedDeployInLinks.length > 0">
            <h5 class="tux-map__panel-h">Connections in</h5>
            <ul class="tux-map__panel-rels">
              <li v-for="(it, idx) in selectedDeployInLinks" :key="`din-${idx}`">
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

          <template v-if="selectedDeployOutLinks.length > 0">
            <h5 class="tux-map__panel-h">Connections out</h5>
            <ul class="tux-map__panel-rels">
              <li v-for="(it, idx) in selectedDeployOutLinks" :key="`dout-${idx}`">
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

          <!-- Roadmap Issues (Deployment Node) -->
          <template v-if="selectedDeployNode.roadmap?.length">
            <h5 class="tux-map__panel-h">Roadmap</h5>
            <div class="tux-map__panel-roadmap">
              <template v-for="iss in selectedDeployNode.roadmap" :key="iss">
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

    <figcaption v-if="caption" class="tux-map__caption">{{ caption }}</figcaption>
    <div class="tux-map__sr" aria-live="polite">{{ liveAnnouncement }}</div>
  </figure>
</template>

<style scoped>
.tux-map {
  margin: 1.5rem 0;
  font-family: var(--font-body);
  color: var(--text-primary);
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
  color: var(--brand-primary);
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
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-raised);
}

.tux-map__seg button {
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
  background: var(--brand-primary);
  color: #FFFFFF;
}

[data-theme="tti-dark"] .tux-map__seg button[aria-pressed="true"],
[data-theme="tti-dark"] .tux-map__seg button[aria-pressed="true"]:hover {
  color: #15100F;
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
  height: 32px;
  width: 32px;
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
  background: color-mix(in srgb, var(--brand-primary) 14%, transparent);
  color: var(--brand-primary);
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
  width: 34px;
  height: 34px;
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

.tux-map__spacer {
  flex: 1;
}

.tux-map__search-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
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
  padding: 0.35rem 0.6rem 0.35rem 1.7rem;
  width: 12.5rem;
  font: inherit;
  font-size: 0.75rem;
  color: var(--text-primary);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
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
  cursor: pointer;
  color: var(--brand-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
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
  background: var(--brand-primary);
}

.tux-map__swatch--card {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
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
  border: 2px solid #D97706;
}

.tux-map__swatch--diff-impact {
  background: var(--surface-raised);
  border: 2px dashed #E11D48;
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

[data-contrast="high"] .tux-map__canvas,
[data-vision-mode] .tux-map__canvas {
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
  touch-action: none;
  overscroll-behavior: contain;
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
  color: var(--brand-primary);
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
  opacity: 0.55;
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
  stroke: #D97706;
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
  stroke: #D97706;
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
  color: var(--brand-primary);
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
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
  font-family: var(--font-bold);
  font-weight: 700;
}

.tux-map__el:hover .tux-map__el-zb {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #FFFFFF;
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
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.tux-map__el--k-system .tux-map__el-nm,
.tux-map__el--k-system .tux-map__el-ds,
.tux-map__el--k-system .tux-map__el-ty,
.tux-map__el--k-system .tux-map__el-ft,
.tux-map__el--k-system .tux-map__el-zb {
  color: #FFFFFF;
}

[data-theme="tti-dark"] .tux-map__el--k-system .tux-map__el-nm,
[data-theme="tti-dark"] .tux-map__el--k-system .tux-map__el-ds,
[data-theme="tti-dark"] .tux-map__el--k-system .tux-map__el-ty,
[data-theme="tti-dark"] .tux-map__el--k-system .tux-map__el-ft,
[data-theme="tti-dark"] .tux-map__el--k-system .tux-map__el-zb {
  color: #15100F;
}

.tux-map__el--k-container,
.tux-map__el--k-database,
.tux-map__el--k-storage,
.tux-map__el--k-component,
.tux-map__el--k-module,
.tux-map__el--k-schema,
.tux-map__el--k-symbol,
.tux-map__el--k-resource {
  box-shadow:
    inset 4px 0 0 var(--brand-primary),
    0 1px 2px rgba(0, 0, 0, 0.06);
}

.tux-map__el--k-container .tux-map__el-ic,
.tux-map__el--k-database .tux-map__el-ic,
.tux-map__el--k-storage .tux-map__el-ic,
.tux-map__el--k-component .tux-map__el-ic,
.tux-map__el--k-module .tux-map__el-ic,
.tux-map__el--k-schema .tux-map__el-ic,
.tux-map__el--k-symbol .tux-map__el-ic,
.tux-map__el--k-resource .tux-map__el-ic {
  color: var(--brand-primary);
}

.tux-map__el--diff-direct {
  border-color: #D97706 !important;
  box-shadow:
    inset 4px 0 0 #D97706,
    0 0 0 2px color-mix(in srgb, #D97706 45%, transparent);
}

.tux-map__el--diff-impact {
  border-color: #E11D48 !important;
  border-style: dashed;
  box-shadow:
    inset 4px 0 0 #E11D48,
    0 0 0 1.5px color-mix(in srgb, #E11D48 35%, transparent);
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
  background: #FEF3C7;
  color: #78350F;
  border-color: #D97706;
}

.tux-map__chip--diff-deleted,
.tux-map__chip--diff-impact {
  background: #FFE4E6;
  color: #881337;
  border-color: #E11D48;
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
  color: var(--brand-primary);
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
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.8rem;
  padding: 0.5rem 0.8rem;
  border-radius: var(--radius-md);
  border: 0;
  cursor: pointer;
  background: var(--brand-primary);
  color: #FFFFFF;
  font: inherit;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 13px;
}

[data-theme="tti-dark"] .tux-map__panel-btn {
  color: #15100F;
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
  cursor: pointer;
  color: var(--brand-primary);
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
  padding: 0.1rem 0.42rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-primary);
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
  color: var(--brand-primary);
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
  .tux-map__panel {
    transition: none;
  }
}
</style>
