<script setup lang="ts">
import { computed, isReactive, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, toRaw, useId, watch } from "vue";
import {
  EMPTY_TTI_LEVEL_MODEL,
  TUX_MAP_BLAST_INTENTS,
  TUX_MAP_BLAST_LINK_CLASS_LABELS,
  TUX_MAP_ELEMENT_KIND_LABELS,
  TUX_MAP_LINK_KIND_LABELS,
  TUX_MAP_QUIET_LINK_KINDS,
  TUX_MAP_WIRE_CATEGORIES,
  buildLevelModelFromLegacyNodes,
  buildMapParentIndex,
  buildMapSearchIndexKept,
  buildVendoredCopyIndex,
  classifyBlastLink,
  cmpCodepoint,
  compareBlastLinks,
  computeLinkBlastRadius,
  elementTypeLabel,
  extendMapParentIndex,
  extractModelLinksKept,
  hasOwn,
  isKindNodeId,
  levelForFocus as computeLevelForFocus,
  liftToSet,
  mapAncestorsOf,
  mergeLazyMapSubgraphs,
  plainElementKindLabel,
  resolveModelRawLinks,
  setOwnProp,
  splitNodeId,
  stripNodeKindPrefix,
  traceSpreadingPath,
  getLaserPointerSvgPath,
  getSmoothedFreehandSvgPath,
  routeDeploymentWires,
  routeGridWires,
  searchArchitectureMap,
  type TuxMapBlastIntent,
  type TuxMapBlastLinkClass,
  type TuxMapDeploymentNode,
  type TuxMapDiffInfo,
  type TuxMapEdge,
  type TuxMapElementKind,
  type TuxMapInkStroke,
  type TuxMapLazyMergeState,
  type TuxMapLevelElement,
  type TuxMapLevelModel,
  type TuxMapNormalizedModel,
  type TuxMapNormalizedSubgraph,
  type TuxMapLevelNumber,
  type TuxMapLevelRel,
  type TuxMapLink,
  type TuxMapLoDLevel,
  type TuxMapNode,
  type TuxMapRoutedLabel,
  type TuxMapRoutedWire,
  type TuxMapSearchEntry,
  type TuxMapSearchGroupResult,
  type TuxMapSearchHit,
  type TuxMapStickyNote,
  type TuxMapStrokePoint,
  type TuxMapSubgraph,
  type TuxMapValidationIssue,
  type TuxMapTool,
  type TuxMapTraceResult,
  type TuxMapWireCategory,
  type TuxMapZone,
} from "../utils/tuxArchitectureMap";
import {
  buildStageBase,
  buildStageData,
  cardDescriptionLines,
  middleEllipsizeFolderName,
  wireLabelAttrs,
  wirePairKey,
  type ComputedStageData,
  type StageBase,
  type StageToggles,
} from "../utils/internal/tuxArchitectureMapStage";
import { useTuxMapCursor } from "../composables/useTuxMapCursor";
import {
  TRAVEL_EASING,
  TRAVEL_FADE_MS,
  cameraAlong,
  clearOffset,
  flipStart,
  startTravel,
  travelDuration,
  wirePolyline,
  type TravelPoint,
} from "../utils/internal/tuxArchitectureMapTravel";
import TuxArchitectureMapMinimap from "../utils/internal/TuxArchitectureMapMinimap.vue";

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
  /** Inner card count threshold above which dense views automatically open compact list view (`40` by default; `#124`) */
  denseListThreshold?: number;
  /** Controlled expanded LCA outside-card IDs (`v-model:splitIds`; `#118`) */
  splitIds?: string[];
  /** Initial expanded LCA outside-card IDs (`#118`) */
  initialSplitIds?: string[];
  /** Controlled active wire dependency categories (`v-model:wireFilters`; `#118`) */
  wireFilters?: TuxMapWireCategory[];
  /** Initial active wire dependency categories (`["prod"]` by default; `#118`) */
  initialWireFilters?: TuxMapWireCategory[];
  /** Controlled directed trace target node ID (`v-model:traceTarget`; `#125`) */
  traceTarget?: string | null;
  /** Initial directed trace target node ID (`#125`) */
  initialTraceTarget?: string | null;
  /** Whether to show interactive Pen, Laser, and Sticky Note authoring tools in the toolbar (`false` by default; `#125`) */
  annotations?: boolean;
  /** Optional lazy subgraph loader invoked on demand when zooming into a card with `subgraphRef` (`#126`). A card that resolves to null, to no elements or to elements sanitizing removes is asked once; a rejection is not remembered. Pass the same function between renders: a new one is a new source and is asked again (`#156`) */
  resolveSubgraph?: (id: string, ref?: string) => Promise<TuxMapSubgraph | null>;
  /** Optional commit SHA or ref passed as the second argument to `resolveSubgraph(id, modelRef)` (`#126`) */
  modelRef?: string;
  /** Whether an edit made in place inside a reactive `model` is drawn (`false` by default). The map reads `model` raw, and sees a new `model` object; with this on, it also reads the whole of a reactive `model` through its proxies, so any edit inside it starts the map over. That read costs about as much as sanitizing the model, on every mount and every edit (`#222`) */
  watchModelDeep?: boolean;
  /** Whether plain mouse wheel over the diagram zooms across levels without requiring Ctrl/Cmd (`true` by default; set `false` to require Ctrl/Cmd + wheel; `"click"` puts the canvas under a "Click to explore" veil and leaves the wheel to the page until the reader clicks it or moves keyboard focus into the canvas; `#209`) */
  wheelZoom?: boolean | "click";
  /** Whether a disc trails the pointer over the diagram and comes to rest on the card the pointer is near, or on the control it is over (`false` by default). Decoration: it is drawn only for a fine pointer with motion allowed, and not under the `wheelZoom="click"` veil (`#208`) */
  cursor?: boolean;
  /** Whether a small overview of the level fades in over the canvas while the view scrolls, magnifies or changes level (`true` by default; it is rendered only where the level is larger than its viewport; `#211`) */
  minimap?: boolean;
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
  /** CSS height of the diagram's viewport (`"auto"` by default: as tall as the tallest level shown at this width when fitted, 440px at least; it does not shrink on a change of level). A fixed height scrolls a taller diagram; a shorter level is centred in either */
  height?: string;
  /**
   * Legacy level-of-detail switch. A change after mount moves the map to Level 1 (`"executive"`),
   * Level 2 (`"resources"`) or Level 3 (`"packages"`) and emits `update:level`; the value at mount
   * is not read (`#230`).
   * @deprecated Use `level` (`v-model:level`) or `initialLevel`.
   */
  lodMode?: "auto" | TuxMapLoDLevel;
  /** Stage scale to open at, 1 being the diagram's real size: the map opens magnified at the nearest magnify step (0.5, 0.75, 1, 1.5 or 2; halfway, the larger). A scale at or under the fitted one opens at Fit, as does no value (`undefined` by default; `#230`) */
  initialZoom?: number;
  /** Freehand ink strokes */
  strokes?: TuxMapInkStroke[];
  /** Sticky callout notes */
  notes?: TuxMapStickyNote[];
  /** Default ink color */
  penColor?: string;
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
  denseListThreshold: 40,
  splitIds: undefined,
  initialSplitIds: () => [],
  wireFilters: undefined,
  initialWireFilters: () => ["prod"],
  traceTarget: undefined,
  initialTraceTarget: null,
  annotations: false,
  resolveSubgraph: undefined,
  modelRef: undefined,
  watchModelDeep: false,
  wheelZoom: true,
  cursor: false,
  minimap: true,
  nodes: () => [],
  edges: () => [],
  zones: () => [],
  eyebrow: "TUX · MODULAR ARCHITECTURE MAP (M.A.P.)",
  title: "Modular Architecture Map",
  caption: "",
  ariaLabel: "Interactive multi-level architecture map",
  height: "auto",
  lodMode: "auto",
  initialZoom: undefined,
  strokes: () => [],
  notes: () => [],
  penColor: "#5C0025",
});

const emit = defineEmits<{
  (e: "update:level", level: TuxMapLevelNumber): void;
  (e: "update:focus", focusId: string | null): void;
  (e: "update:selectedId", selectedId: string | null): void;
  (e: "update:showPlanned", showPlanned: boolean): void;
  (e: "update:showBlastRadius", showBlastRadius: boolean): void;
  (e: "update:blastIntent", blastIntent: TuxMapBlastIntent): void;
  (e: "update:view", view: TuxMapViewMode): void;
  (e: "update:splitIds", splitIds: string[]): void;
  (e: "update:wireFilters", wireFilters: TuxMapWireCategory[]): void;
  (e: "update:traceTarget", traceTarget: string | null): void;
  (e: "node-select", item: TuxMapLevelElement | TuxMapDeploymentNode | TuxMapNode | null): void;
  (e: "drill-down", payload: { level: number; focusId: string; subgraph: TuxMapSubgraph | null }): void;
  (e: "update:strokes", strokes: TuxMapInkStroke[]): void;
  (e: "update:notes", notes: TuxMapStickyNote[]): void;
  (e: "laser-move", points: TuxMapStrokePoint[]): void;
}>();

const instanceId = useId();
const arrowMarkerId = `tux-map-arrow-${instanceId}`;
const goToListboxId = `tux-map-goto-listbox-${instanceId}`;
const wireInspectorId = `tux-map-wire-pop-${instanceId}`;
const blastIntentKeyId = `tux-map-intent-${instanceId}`;

function getLevel3Kids(
  M: TuxMapLevelModel,
  id: string | null | undefined,
): TuxMapLevelElement[] | undefined {
  return id && hasOwn(M.level3, id) ? M.level3[id] : undefined;
}

// ============================================================================
// 1. RESOLVED 4-LEVEL + FRACTAL N-DEPTH MODEL & LOOKUP MAPS
// ============================================================================

// Replaced, never edited, on each arrival: a shallow ref keeps what the resolver returned raw (#222)
const resolvedSubgraphs = shallowRef<Record<string, TuxMapSubgraph>>(Object.create(null));
const loadingSubgraphId = ref<string | null>(null);
/**
 * Cards whose lazy subgraph resolved to nothing the map can show, by card id, so
 * each is asked once (#156): `resolveSubgraph` returned null or no elements, or
 * elements that sanitizing all removed. The second kind is also a model problem,
 * and `sanitizedEmptySubgraphs` holds its one validation issue per card.
 */
const emptyResolvedSubgraphs = ref<Record<string, boolean>>(Object.create(null));
const sanitizedEmptySubgraphs = ref<Record<string, TuxMapValidationIssue>>(Object.create(null));
let resolveReqSeq = 0;

function cancelPendingSubgraphResolve() {
  resolveReqSeq++;
  loadingSubgraphId.value = null;
}

watch([() => props.model, () => props.modelRef], () => {
  resolvedSubgraphs.value = Object.create(null);
  cancelPendingSubgraphResolve();
});

/**
 * The model as it was passed (or built from the legacy `nodes`): one object until those change. A reactive
 * `model` is read raw (#222): read through its proxies, every object the merge keeps from it stayed a proxy,
 * and everything built from the model after it paid for one on each read.
 */
const rawModelInput = computed<unknown>(() =>
  props.model !== undefined
    ? toRaw(props.model)
    : props.nodes && props.nodes.length > 0
      ? buildLevelModelFromLegacyNodes(props.nodes, props.edges, props.zones)
      : EMPTY_TTI_LEVEL_MODEL,
);

// A reactive `model` can be changed in place, with no new object to tell by. With `watchModelDeep`, a deep
// watch reads all of it, so this stamp moves on any such change and the next merge starts over (#157). Off by
// default (#222): the read goes through a proxy for every object of the model and keeps a dependency on each
// of its fields, about as long as sanitizing the model and a large share of its heap.
const modelEditStamp = ref(0);
watch(
  () => (props.watchModelDeep && isReactive(props.model) ? props.model : null),
  () => modelEditStamp.value++,
  { deep: true, flush: "sync" },
);

// The model with its lazily resolved subgraphs, sanitized and collapsed. A subgraph that arrives is
// sanitized and collapsed alone and added to the model before it, when the rest of the model is not
// affected by it; `added` then names what was added, for the indexes below (#157).
let lastMerge: TuxMapLazyMergeState | undefined;
let lastMergeStamp = 0;
const mergedModel = computed<TuxMapLazyMergeState>(() => {
  const stamp = modelEditStamp.value;
  const prev = stamp === lastMergeStamp ? lastMerge : undefined;
  lastMergeStamp = stamp;
  lastMerge = mergeLazyMapSubgraphs(rawModelInput.value, resolvedSubgraphs.value, prev);
  return lastMerge;
});

const modelBundle = computed(() => {
  const merged = mergedModel.value;
  // One issue per card whose lazily resolved subgraph had nothing usable in it (#156).
  const resolvedEmpty = Object.values(sanitizedEmptySubgraphs.value);
  return {
    model: merged.model,
    aliases: merged.aliases,
    validation:
      resolvedEmpty.length > 0
        ? {
            ...merged.validation,
            valid: false,
            issues: [...merged.validation.issues, ...resolvedEmpty],
          }
        : merged.validation,
  };
});

// Normalized: `subgraphs` and each subgraph's `rels` are there, so nothing below guards them (#164).
const activeModel = computed<TuxMapNormalizedModel>(() => modelBundle.value.model);
const modelAliases = computed<Record<string, string>>(() => modelBundle.value.aliases);
const modelValidationSummary = computed<string>(() => {
  if (props.model === undefined) return "";
  const v = modelBundle.value.validation;
  const critical = v.issues.filter(
    (i) =>
      i.code === "parent-cycle" ||
      i.code === "duplicate-id" ||
      i.code === "reserved-id" ||
      i.code === "missing-level" ||
      i.code === "max-depth-exceeded",
  );
  const resolvedEmpty = v.issues.filter((i) => i.code === "resolved-empty-subgraph");
  const parts: string[] = [];
  if (critical.length > 0) {
    parts.push(
      `${critical.length} structural issue${critical.length === 1 ? "" : "s"} sanitized (${critical[0]!.message})`,
    );
  }
  if (resolvedEmpty.length > 0) {
    parts.push(
      `${resolvedEmpty.length} lazy subgraph${resolvedEmpty.length === 1 ? "" : "s"} resolved empty (${resolvedEmpty[0]!.message})`,
    );
  }
  return parts.length > 0 ? `Model diagnostics: ${parts.join("; ")}` : "";
});

// The validator's warnings go to the console, once per `model` object the host hands in: the validation ran on
// that object as given, before anything here touched it. The schema-name ones (`missing-schema`, `unknown-schema`,
// #162) change nothing in the map; the rest are what the model's schema finds (#163, #164): a required field left
// out, a value of the wrong type, a kind or an enum value this release does not list. The map draws all of them
// (filled, left out, or kept). A lazily resolved subgraph recomputes `modelBundle` but is the same `model`.
let schemaWarnedModel: unknown;
watch(
  () => modelBundle.value.validation.warnings,
  (warnings) => {
    if (props.model === undefined || props.model === schemaWarnedModel) return;
    schemaWarnedModel = props.model;
    for (const w of warnings) console.warn(`[TuxArchitectureMap] ${w.message}`);
  },
  { immediate: true },
);

// A new model, ref or resolver is a new source: every card may be asked again.
// The subgraphs already loaded outlive a new resolver; only a new model or ref drops them.
watch([() => props.model, () => props.modelRef, () => props.resolveSubgraph], () => {
  emptyResolvedSubgraphs.value = Object.create(null);
  sanitizedEmptySubgraphs.value = Object.create(null);
});

function resolveAliasId(id: string | null | undefined): string | null {
  if (!id) return null;
  const collapsedMap = modelAliases.value;
  const explicitMap = activeModel.value.aliases;
  let cur = id;
  const seen = new Set<string>([cur]);
  while (seen.size < 32) {
    const next =
      (hasOwn(collapsedMap, cur) ? collapsedMap[cur] : undefined) ||
      (explicitMap && hasOwn(explicitMap, cur) ? explicitMap[cur] : undefined);
    if (!next || next === cur || seen.has(next)) break;
    seen.add(next);
    cur = next;
  }
  return cur;
}

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

const rawInitLevel = props.level ?? props.initialLevel;
const rawInitFocus = props.focus !== undefined ? props.focus : props.initialFocus;
const resolvedInitFocus = rawInitFocus ? resolveAliasId(rawInitFocus) ?? rawInitFocus : rawInitFocus;
const initLevelAfterAlias: TuxMapLevelNumber =
  rawInitFocus &&
  resolvedInitFocus &&
  resolvedInitFocus !== rawInitFocus &&
  rawInitLevel >= 5
    ? (computeLevelForFocus(
        resolvedInitFocus,
        activeModel.value,
        buildMapParentIndex(activeModel.value),
      ) as TuxMapLevelNumber)
    : rawInitLevel;
const currentLevel = ref<TuxMapLevelNumber>(initLevelAfterAlias);
const focusId = ref<string | null>(resolvedInitFocus);
const drillStack = ref<{ level: number; focusId: string }[]>([]);
const rawInitSelected = props.selectedId !== undefined ? props.selectedId : props.initialSelectedId;
const selectedId = ref<string | null>(
  rawInitSelected ? resolveAliasId(rawInitSelected) ?? rawInitSelected : rawInitSelected,
);
watch(modelAliases, () => {
  if (focusId.value) {
    const rf = resolveAliasId(focusId.value);
    if (rf && rf !== focusId.value) {
      focusId.value = rf;
      emit("update:focus", rf);
      if (currentLevel.value >= 5) {
        const nextLvl = computeLevelForFocus(rf, activeModel.value, parentOf.value) as TuxMapLevelNumber;
        if (nextLvl !== currentLevel.value) {
          currentLevel.value = nextLvl;
          emit("update:level", nextLvl);
        }
      }
    }
  }
  if (selectedId.value) {
    const rs = resolveAliasId(selectedId.value);
    if (rs && rs !== selectedId.value) {
      selectedId.value = rs;
      emit("update:selectedId", rs);
    }
  }
});
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
const userForcedView = ref<boolean>(props.view !== undefined || props.initialView === "list");
const localSplitIds = ref<string[]>(
  props.splitIds !== undefined ? [...props.splitIds] : [...props.initialSplitIds],
);
const localWireFilters = ref<TuxMapWireCategory[]>(
  props.wireFilters !== undefined ? [...props.wireFilters] : [...props.initialWireFilters],
);
const localTraceTarget = ref<string | null>(
  props.traceTarget !== undefined ? props.traceTarget : props.initialTraceTarget,
);
const outlineOpen = ref<boolean>(false);
const expandedOutlineIds = ref<Record<string, boolean>>(Object.create(null));
const moreMenuOpen = ref<boolean>(false);
const shortcutsOpen = ref<boolean>(false);
const openCrumbMenuIdx = ref<number | null>(null);
const inspectedWireKey = ref<string | null>(null);
const rovingCardId = ref<string | null>(null);
const hoveredStageCardId = ref<string | null>(null);
const tracePickerOpen = ref<boolean>(false);
const traceQuery = ref<string>("");
const preInfraState = ref<{
  level: TuxMapLevelNumber;
  focusId: string | null;
  drillStack: { level: number; focusId: string }[];
  selectedId: string | null;
} | null>(null);
const searchQuery = ref<string>("");
const liveAnnouncement = ref<string>("");

const effectiveSplitSet = computed<Set<string>>(() => new Set(localSplitIds.value));
const activeWireCategoriesSet = computed<Set<TuxMapWireCategory>>(
  () => new Set(localWireFilters.value),
);

function toggleSplitCard(id: string) {
  const next = new Set(localSplitIds.value);
  const wasSplit = next.has(id);
  if (wasSplit) next.delete(id);
  else next.add(id);
  const arr = [...next];
  localSplitIds.value = arr;
  emit("update:splitIds", arr);
  nextTick(() => {
    if (typeof document === "undefined" || effectiveIsListView.value) return;
    const active = document.activeElement;
    const focusDropped =
      !active ||
      active === document.body ||
      (rovingCardId.value && !stageData.value.els.some((e) => e.id === rovingCardId.value));
    if (focusDropped) {
      const nextCard =
        stageData.value.els.find((e) => e.mini && mapAncestorsOf(e.id, parentOf.value).includes(id)) ??
        stageData.value.els.find((e) => e.id === id) ??
        stageData.value.els[0];
      if (nextCard) {
        rovingCardId.value = nextCard.id;
        queryCardById(stageRef.value, nextCard.id)?.focus({ preventScroll: true });
      }
    }
  });
}

function clearSplitCards() {
  if (localSplitIds.value.length === 0) return;
  localSplitIds.value = [];
  emit("update:splitIds", []);
  announce("Folded split outside cards");
  nextTick(() => {
    if (typeof document === "undefined" || effectiveIsListView.value) return;
    const active = document.activeElement;
    if (!active || active === document.body) {
      const firstMini = stageData.value.els.find((e) => e.mini) ?? stageData.value.els[0];
      if (firstMini) {
        rovingCardId.value = firstMini.id;
        queryCardById(stageRef.value, firstMini.id)?.focus({ preventScroll: true });
      }
    }
  });
}

function toggleWireCategory(cat: TuxMapWireCategory) {
  const next = new Set(localWireFilters.value);
  if (next.has(cat)) {
    next.delete(cat);
  } else {
    next.add(cat);
  }
  const ordered = TUX_MAP_WIRE_CATEGORIES.filter((c) => next.has(c));
  localWireFilters.value = ordered;
  emit("update:wireFilters", ordered);
}

function setTraceTarget(targetId: string | null) {
  localTraceTarget.value = targetId;
  emit("update:traceTarget", targetId);
  // the camera goes to a traced card that is on this level, from the selection (#212)
  if (targetId && stageData.value.rects[targetId]) nextTick(() => keepClear(targetId, selectedId.value));
}

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
    if (lvl === undefined) return;
    // the focus arrives in the same update, and its watcher runs after this one
    const next = deepLevelFor(props.focus !== undefined ? props.focus : focusId.value, lvl);
    if (next !== currentLevel.value) {
      if (next !== 4) preInfraState.value = null;
      currentLevel.value = next;
    }
    if (next !== lvl) emit("update:level", next);
  },
);
watch(
  () => props.focus,
  (f) => {
    if (f !== undefined) {
      const resolved = f ? resolveAliasId(f) ?? f : f;
      if (resolved && currentLevel.value >= 5) {
        const aliasedLvl =
          resolved !== f ? (levelForFocus(resolved) as TuxMapLevelNumber) : deepLevelFor(resolved, currentLevel.value);
        if (aliasedLvl !== currentLevel.value) {
          currentLevel.value = aliasedLvl;
          emit("update:level", aliasedLvl);
        }
      }
      if (resolved !== focusId.value) {
        focusId.value = resolved;
        if (resolved !== f) emit("update:focus", resolved);
        // a parent moved the focus: the stack zooming in would have built, so zooming out works
        drillStack.value = currentLevel.value >= 5 && resolved ? drillStackFor(resolved) : [];
      }
    }
  },
);
watch(
  () => props.selectedId,
  (sel) => {
    if (sel !== undefined) {
      const aliased = sel ? resolveAliasId(sel) ?? sel : null;
      const resolved =
        aliased && currentLevel.value !== 4
          ? stageData.value.foldedToRepresentative.get(aliased) ?? aliased
          : aliased;
      if (resolved !== selectedId.value) {
        selectedId.value = resolved;
        if (resolved) rovingCardId.value = resolved;
        nextTick(() => {
          keepClear(resolved);
        });
      }
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
      userForcedView.value = true;
      const wantList = v === "list";
      if (wantList !== isListView.value) {
        isListView.value = wantList;
      }
    }
  },
);
watch(
  () => props.splitIds,
  (ids) => {
    if (ids !== undefined) {
      localSplitIds.value = [...ids];
    }
  },
);
watch(
  () => props.wireFilters,
  (wf) => {
    if (wf !== undefined) {
      localWireFilters.value = [...wf];
    }
  },
);
watch(
  () => props.traceTarget,
  (tt) => {
    if (tt !== undefined && tt !== localTraceTarget.value) {
      localTraceTarget.value = tt;
    }
  },
);

const openCrumbOverflow = ref<boolean>(false);

watch([currentLevel, focusId], () => {
  inspectedWireKey.value = null;
  openCrumbMenuIdx.value = null;
  openCrumbOverflow.value = false;
  tracePickerOpen.value = false;
  hoveredStageCardId.value = null;
  if (props.view === undefined && props.initialView !== "list") {
    userForcedView.value = false;
  }
});

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

// Sync legacy `lodMode` prop if changed externally (deprecated: `level`). The level it moves to is
// said on `update:level`, as any other change of level is (#230)
watch(
  () => props.lodMode,
  (mode) => {
    const fromLevel = currentLevel.value;
    const fromFocus = focusId.value;
    if (mode === "executive") currentLevel.value = 1;
    else if (mode === "resources") currentLevel.value = 2;
    else if (mode === "packages") {
      if (!focusId.value) {
        const firstZoomable = activeModel.value.level2.elements.find(
          (e) => !e.ref && (getLevel3Kids(activeModel.value, e.id)?.length ?? 0) > 0,
        );
        focusId.value = firstZoomable?.id ?? null;
      }
      if (focusId.value) currentLevel.value = 3;
    }
    if (focusId.value !== fromFocus) emit("update:focus", focusId.value);
    if (currentLevel.value !== fromLevel) emit("update:level", currentLevel.value);
  },
);

function getSubgraphForNode(nodeId: string | null | undefined): TuxMapNormalizedSubgraph | null {
  if (!nodeId) return null;
  const canonical = resolveAliasId(nodeId) ?? nodeId;
  const M = activeModel.value;
  if (hasOwn(M.subgraphs, canonical) && M.subgraphs[canonical]!.elements.length > 0) {
    return M.subgraphs[canonical]!;
  }
  const el = hasOwn(byId.value, canonical) ? byId.value[canonical] : undefined;
  if (
    el?.subgraphRef &&
    hasOwn(M.subgraphs, el.subgraphRef) &&
    M.subgraphs[el.subgraphRef]!.elements.length
  ) {
    return M.subgraphs[el.subgraphRef]!;
  }
  if (el?.children?.length) {
    return {
      stratum: `Internal Modules (${el.name})`,
      elements: el.children,
      rels: el.childRels ?? [],
    };
  }
  const dn = hasOwn(resById.value, canonical) ? resById.value[canonical] : undefined;
  if (
    dn?.subgraphRef &&
    hasOwn(M.subgraphs, dn.subgraphRef) &&
    M.subgraphs[dn.subgraphRef]!.elements.length
  ) {
    return M.subgraphs[dn.subgraphRef]!;
  }
  if (dn?.children?.length) {
    return {
      stratum: `Internal Modules (${dn.title})`,
      elements: dn.children,
      rels: dn.childRels ?? [],
    };
  }
  return null;
}

// The index the previous model gave, kept so one arriving subgraph is added to a copy of it (#157)
let byIdBuilt: { model: TuxMapLevelModel; map: Record<string, TuxMapLevelElement> } | undefined;
const byId = computed<Record<string, TuxMapLevelElement>>(() => {
  const model = activeModel.value;
  const added = mergedModel.value.added;
  const before = added && byIdBuilt?.model === added.from ? byIdBuilt.map : undefined;
  const map: Record<string, TuxMapLevelElement> = Object.create(null);
  if (before) Object.assign(map, before);
  byIdBuilt = { model, map };
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

  if (added && before) {
    // the subgraphs are indexed last and in key order, and the one that arrived is the last key
    indexChildren(added.key, added.elements);
    return map;
  }
  for (const e of activeModel.value.level1.elements) {
    map[e.id] = e;
    if (e.children?.length) indexChildren(e.id, e.children);
  }
  for (const e of activeModel.value.level2.elements) {
    if (e.ref && hasOwn(map, e.id)) {
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
  for (const [parentId, sg] of Object.entries(activeModel.value.subgraphs)) {
    indexChildren(parentId, sg.elements);
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
let parentOfBuilt: { model: TuxMapLevelModel; map: Map<string, string> } | undefined;
const parentOf = computed(() => {
  const model = activeModel.value;
  const added = mergedModel.value.added;
  const map =
    added && parentOfBuilt?.model === added.from
      ? extendMapParentIndex(parentOfBuilt.map, added.owner, added.elements)
      : buildMapParentIndex(model);
  parentOfBuilt = { model, map };
  return map;
});

// The index reads the code links, which an arriving subgraph leaves alone, and the kind of each end
// of a `copies` link: it is the one before unless the arrival indexes such an end (#157)
let vendoredBuilt:
  | { model: TuxMapLevelModel; index: ReturnType<typeof buildVendoredCopyIndex>; copyEnds?: Set<string> }
  | undefined;
const vendoredCopyIndex = computed(() => {
  const model = activeModel.value;
  const added = mergedModel.value.added;
  if (added && vendoredBuilt?.model === added.from) {
    if (!vendoredBuilt.copyEnds) {
      vendoredBuilt.copyEnds = new Set<string>();
      for (const l of resolveModelRawLinks(model)) {
        if (l.kind === "copies") vendoredBuilt.copyEnds.add(l.from).add(l.to);
      }
    }
    const ends = vendoredBuilt.copyEnds;
    // the ids `byId` writes for the arrival
    const indexesAnEnd = (parentId: string, kids: TuxMapLevelElement[], depth = 0): boolean =>
      depth < 64 &&
      kids.some((k, i) => {
        const id = k.id || `${parentId}/${i}`;
        return ends.has(id) || Boolean(k.children?.length && indexesAnEnd(id, k.children, depth + 1));
      });
    if (ends.size === 0 || !indexesAnEnd(added.key, added.elements)) {
      vendoredBuilt.model = model;
      return vendoredBuilt.index;
    }
  }
  const kindMap = new Map<string, string>();
  for (const [id, el] of Object.entries(byId.value)) {
    if (el.kind) kindMap.set(id, el.kind);
  }
  const index = buildVendoredCopyIndex(resolveModelRawLinks(model), kindMap);
  vendoredBuilt = { model, index };
  return index;
});

/** The level that shows the children of `fid`: 3 inside a container, 5 inside a component or
 *  deployment node, one more for each subgraph below that. */
function levelForFocus(fid: string): number {
  return computeLevelForFocus(fid, activeModel.value, parentOf.value);
}

/**
 * The number of the view inside `fid` when `asked` is 5 or more. Below Level 4 a view has no number
 * of its own: it is where its focus sits in the model as the map draws it. A host that counts the
 * document's own nesting gets another number where the map left a folder level out, so the map's
 * number stands and `update:level` says so (#205).
 */
function deepLevelFor(fid: string | null | undefined, asked: TuxMapLevelNumber): TuxMapLevelNumber {
  if (asked < 5 || !fid) return asked;
  const id = resolveAliasId(fid) ?? fid;
  if (!hasFractalSubgraph(id) && !hasLazySubgraphRef(id)) return asked;
  return Math.max(5, levelForFocus(id)) as TuxMapLevelNumber;
}

/** The drill stack a person builds zooming in step by step to the children of `fid`. */
function drillStackFor(fid: string): { level: number; focusId: string }[] {
  return mapAncestorsOf(fid, parentOf.value)
    .slice(1)
    .reverse()
    .map((a) => ({ level: levelForFocus(a), focusId: a }))
    .filter((e) => e.level >= 3);
}

function hasLazySubgraphRef(id: string): boolean {
  if (typeof props.resolveSubgraph !== "function") return false;
  if (hasOwn(emptyResolvedSubgraphs.value, id) && emptyResolvedSubgraphs.value[id]) return false;
  return lacksLazySubgraph(id);
}

/** True while the model has no elements for the subgraph `id` owns or points at with `subgraphRef`. */
function lacksLazySubgraph(id: string): boolean {
  const M = activeModel.value;
  if (hasOwn(M.subgraphs, id) && M.subgraphs[id]!.elements.length > 0) return false;
  const el = hasOwn(byId.value, id) ? byId.value[id] : undefined;
  if (el?.subgraphRef) {
    if (hasOwn(M.subgraphs, el.subgraphRef) && M.subgraphs[el.subgraphRef]!.elements.length > 0) {
      return false;
    }
    return true;
  }
  const dn = hasOwn(resById.value, id) ? resById.value[id] : undefined;
  if (dn?.subgraphRef) {
    if (hasOwn(M.subgraphs, dn.subgraphRef) && M.subgraphs[dn.subgraphRef]!.elements.length > 0) {
      return false;
    }
    return true;
  }
  return false;
}

function hasFractalSubgraph(id: string): boolean {
  const M = activeModel.value;
  if (hasOwn(M.subgraphs, id) && M.subgraphs[id]!.elements.length > 0) return true;
  const el = hasOwn(byId.value, id) ? byId.value[id] : undefined;
  if (el) {
    if (el.children?.length) return true;
    if (
      el.subgraphRef &&
      hasOwn(M.subgraphs, el.subgraphRef) &&
      M.subgraphs[el.subgraphRef]!.elements.length > 0
    ) {
      return true;
    }
  }
  const dn = hasOwn(resById.value, id) ? resById.value[id] : undefined;
  if (dn) {
    if (dn.children?.length) return true;
    if (
      dn.subgraphRef &&
      hasOwn(M.subgraphs, dn.subgraphRef) &&
      M.subgraphs[dn.subgraphRef]!.elements.length > 0
    ) {
      return true;
    }
  }
  return false;
}

// Ensure focusId & selectedId resolve collapsed folder aliases and stay valid for activeModel
watch(
  [activeModel, modelAliases],
  ([m]) => {
    if (focusId.value) {
      const aliasedFocus = resolveAliasId(focusId.value);
      if (aliasedFocus && aliasedFocus !== focusId.value) {
        focusId.value = aliasedFocus;
        if (currentLevel.value >= 5) {
          currentLevel.value = levelForFocus(aliasedFocus) as TuxMapLevelNumber;
        }
      }
    }
    if (selectedId.value) {
      const aliasedSel = resolveAliasId(selectedId.value);
      if (aliasedSel && aliasedSel !== selectedId.value) {
        selectedId.value = aliasedSel;
      }
    }
    const f = focusId.value;
    const validFocus =
      Boolean(f) &&
      (Boolean(getLevel3Kids(m, f)?.length) ||
        hasFractalSubgraph(f!) ||
        hasLazySubgraphRef(f!));
    if (!validFocus) {
      const firstContainer = m.level2.elements.find(
        (e) => !e.ref && (getLevel3Kids(m, e.id)?.length ?? 0) > 0,
      );
      focusId.value = firstContainer?.id ?? null;
    }
    if (currentLevel.value >= 5 && focusId.value) {
      const lvl = deepLevelFor(focusId.value, currentLevel.value);
      if (lvl !== currentLevel.value) {
        currentLevel.value = lvl;
        emit("update:level", lvl);
      }
      drillStack.value = drillStackFor(focusId.value);
    }
  },
  { immediate: true },
);

// The deepest level this model really has: each element with something inside opens at
// levelForFocus(id), so the count follows the nesting, not how the subgraphs are named.
// Its own computed: it walks every element once per model, not on every level change.
const modelDepth = computed<number>(() => {
  let max = 4;
  for (const id of [...Object.keys(byId.value), ...Object.keys(resById.value)]) {
    if (hasFractalSubgraph(id) || hasLazySubgraphRef(id)) {
      max = Math.max(max, Math.max(5, levelForFocus(id)));
    }
  }
  return max;
});

const maxAvailableLevel = computed<number>(() => Math.max(modelDepth.value, currentLevel.value));

// ============================================================================
// 2. LEVEL VIEW COMPUTATION (LEVEL 1..N) & RIGHT-ANGLE WIRE ROUTING
// ============================================================================

const TYPE_LABELS: Record<string, string> = {
  ...TUX_MAP_ELEMENT_KIND_LABELS,
};

// What a card's status line says for each `live.state`, and its dot: each phrase says what the
// state means, not only its name (#258). The meanings are on `TuxMapElementLiveInfo.state`.
const STATE_LABELS: Record<string, [string, string]> = {
  running: ["ok", "Running"],
  active: ["ok", "Running"],
  present: ["ok", "Installed"],
  success: ["ok", "Last run succeeded"],
  inactive: ["warn", "Installed, not running"],
  "declared-not-installed": ["warn", "Declared, not installed"],
  failed: ["bad", "Failed: stopped with an error"],
  unknown: ["", "State not reported"],
};

const LAST_RUN_LABELS: Record<string, [string, string]> = {
  success: ["ok", "Last run succeeded"],
  failed: ["bad", "Last run failed"],
};

function isShownStatus(status?: string): boolean {
  return showPlanned.value || status !== "planned";
}

function hasPrimaryLevel2Interior(): boolean {
  return activeModel.value.level2.elements.some((x) => !x.ref);
}

function canZoomElement(e: TuxMapLevelElement): boolean {
  if (e.id.startsWith("@more-")) return false;
  if (hasFractalSubgraph(e.id) || hasLazySubgraphRef(e.id)) return true;
  if (currentLevel.value === 1) {
    return (
      e.zoom === 2 ||
      (e.id === activeModel.value.level2.boundary && hasPrimaryLevel2Interior())
    );
  }
  if (currentLevel.value === 2) {
    return !e.ref && (getLevel3Kids(activeModel.value, e.id)?.length ?? 0) > 0;
  }
  // At Level 3 and below, ONLY cards with real inner subgraph/lazy children show `+` (#116):
  // never fall back to Level 4 just because deployment nodes exist in the model.
  return false;
}

function canZoomDeployNode(n: TuxMapDeploymentNode): boolean {
  return hasFractalSubgraph(n.id) || hasLazySubgraphRef(n.id);
}

// Tracks how many distinct Level 3 components share files from a given directory prefix (#116: "Also in N parts")
const sharedDirectoryPartsMap = computed<Map<string, Set<string>>>(() => {
  const M = activeModel.value;
  const l3Set = new Set<string>();
  for (const kids of Object.values(M.level3)) {
    for (const k of kids) {
      if (k.id) l3Set.add(k.id);
    }
  }
  const dirToComps = new Map<string, Set<string>>();
  if (l3Set.size === 0) return dirToComps;
  for (const [id, el] of Object.entries(byId.value)) {
    const comp = mapAncestorsOf(id, parentOf.value).find((a) => l3Set.has(a));
    if (!comp) continue;
    const rawPath =
      el.source?.path ||
      (isKindNodeId(id, "f") || isKindNodeId(id, "d")
        ? splitNodeId(id).rest
        : "");
    if (!rawPath) continue;
    const norm = rawPath.replace(/^\/+|\/+$/g, "");
    const segs = norm.split("/");
    const maxSeg = isKindNodeId(id, "d") || el.kind === "folder" ? segs.length : segs.length - 1;
    let prefix = "";
    for (let i = 0; i < maxSeg; i++) {
      prefix = prefix ? `${prefix}/${segs[i]!}` : segs[i]!;
      let s = dirToComps.get(prefix);
      if (!s) {
        s = new Set();
        dirToComps.set(prefix, s);
      }
      s.add(comp);
    }
  }
  return dirToComps;
});

function countOtherSharedParts(id: string, el?: TuxMapLevelElement): number {
  const rawPath =
    el?.source?.path ||
    (isKindNodeId(id, "d") ? splitNodeId(id).rest : "");
  if (!rawPath) return 0;
  const dirKey =
    el?.kind === "folder" || isKindNodeId(id, "d")
      ? rawPath.replace(/^\/+|\/+$/g, "")
      : rawPath.includes("/")
        ? rawPath.slice(0, rawPath.lastIndexOf("/"))
        : "";
  if (!dirKey) return 0;
  const comps = sharedDirectoryPartsMap.value.get(dirKey);
  if (!comps || comps.size < 2) return 0;
  return comps.size - 1;
}

/**
 * A card's status line and its dot, from `live` (#258). A count says what it counts: `total` is the
 * element's instances, `running` how many of them run ("8 of 10 instances running"), and the dot
 * turns amber when some are not running and red when none are.
 */
function formatLiveState(e: TuxMapLevelElement): [string, string] | null {
  const L = e.live;
  if (!L) return null;
  if (L.total && L.total > 1) {
    const running = Math.max(0, Math.min(L.running ?? L.total, L.total));
    const tone = running === 0 ? "bad" : running < L.total ? "warn" : (STATE_LABELS[L.state ?? "running"] || [""])[0];
    return [tone, `${running} of ${L.total} instances running`];
  }
  if (L.last_run && L.last_run.result) {
    return LAST_RUN_LABELS[L.last_run.result] || ["", `Last run: ${L.last_run.result}`];
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

/**
 * The stage is built in two steps (`../utils/internal/tuxArchitectureMapStage`).
 *
 * `stageBase` follows from the model, the level and the focus: vendored copies folded, the cards
 * inside, their grid or bands, the pairs the code links cover. `stageData` applies the reader's
 * toggles to it (planned, wire categories, split cards), so a toggle rebuilds `stageData` alone.
 */
const stageBase = computed<StageBase>(() => {
  const M = activeModel.value;
  const level = currentLevel.value;
  return buildStageBase(
    {
      model: M,
      rawLinks: resolveModelRawLinks(M),
      lookup: byId.value,
      resById: resById.value,
      parentOf: parentOf.value,
    },
    level,
    focusId.value,
    level >= 5 ? getSubgraphForNode(focusId.value) : null,
  );
});

// Getters: a level is rebuilt by the toggles its lift step reads, and by no other
const stageToggles: StageToggles = {
  get showPlanned() {
    return showPlanned.value;
  },
  get wireCategories() {
    return activeWireCategoriesSet.value;
  },
  get splitIds() {
    return effectiveSplitSet.value;
  },
  countOtherSharedParts,
};

const stageData = computed<ComputedStageData>(() => buildStageData(stageBase.value, stageToggles));

watch(
  () => stageData.value.foldedToRepresentative,
  (foldedMap) => {
    if (selectedId.value && currentLevel.value !== 4) {
      const rep = foldedMap.get(selectedId.value);
      if (rep && rep !== selectedId.value) {
        selectedId.value = rep;
        rovingCardId.value = rep;
        emit("update:selectedId", rep);
      }
    }
  },
  { immediate: true },
);

/**
 * The stage's wires at rest: every outside card has its one wire, to the boundary.
 * They are routed once per stage. A hover or a selection opens outside cards by
 * drawing `openStageWires` over them, and never routes these again (#154).
 */
const baseRoutedSvg = computed<{ wires: TuxMapRoutedWire[]; labels: TuxMapRoutedLabel[] }>(() => {
  if (currentLevel.value === 4) {
    const links = activeModel.value.level4.links.filter(
      (l) =>
        (showPlanned.value || l.state !== "planned") &&
        hasOwn(stageData.value.rects, l.from) &&
        hasOwn(stageData.value.rects, l.to),
    );
    return {
      wires: routeDeploymentWires(links, stageData.value.rects, "*"),
      labels: [],
    };
  }
  return routeGridWires(stageData.value.rels, stageData.value.rects, stageData.value.els);
});

/** Per stage: the routed wire and label each outside card's resting wire became, and the sides each card opens. */
const stageSideIndex = computed(() => {
  const { expandableSides } = stageData.value;
  const slots = new Map<TuxMapLevelRel, { wireId: string; labelId: string | null }>();
  const sidesByCard = new Map<string, number[]>();
  if (currentLevel.value === 4 || expandableSides.length === 0) return { slots, sidesByCard };

  const addSide = (cardId: string, i: number) => {
    const list = sidesByCard.get(cardId);
    if (!list) sidesByCard.set(cardId, [i]);
    else if (list[list.length - 1] !== i) list.push(i);
  };
  const aggregates = new Set<TuxMapLevelRel>();
  expandableSides.forEach((side, i) => {
    aggregates.add(side.aggregate);
    addSide(side.id, i);
    for (const w of side.wires) {
      addSide(w.from, i);
      addSide(w.to, i);
    }
  });

  // An outside card has one resting wire a direction, to or from the boundary:
  // its two ends name it among the routed wires and labels.
  const { wires, labels } = baseRoutedSvg.value;
  const ends = (r: { from: string; to: string }) => `${r.from}\u0000${r.to}`;
  const wanted = new Map<string, TuxMapLevelRel>();
  for (const r of aggregates) wanted.set(ends(r), r);
  for (const w of wires) {
    const r = wanted.get(ends(w));
    if (r && !slots.has(r)) slots.set(r, { wireId: w.id, labelId: null });
  }
  for (const l of labels) {
    const r = wanted.get(ends(l));
    const slot = r && slots.get(r);
    if (slot && slot.labelId === null) slot.labelId = l.id;
  }
  return { slots, sidesByCard };
});

/** The wires drawn over the stage while outside cards are open, and the resting wires they stand in for. */
interface OpenStageWires {
  wires: TuxMapRoutedWire[];
  labels: TuxMapRoutedLabel[];
  closedWireIds: ReadonlySet<string>;
  closedLabelIds: ReadonlySet<string>;
}

/** Per stage, per set of open outside cards: routed the first time that set opens, kept until the stage changes. */
const openStageWiresMemo = new WeakMap<ComputedStageData, Map<string, OpenStageWires>>();

/**
 * The hovered (else selected) card's outside sides, opened card by card: only
 * those wires are routed, over the cards and apart from the wires at rest, which
 * stay where they are. `null` while nothing is open. This stays out of
 * `stageData` and `baseRoutedSvg`, so a hover rebuilds neither (#141, #154).
 */
const openStageWires = computed<OpenStageWires | null>(() => {
  const data = stageData.value;
  const active = hoveredStageCardId.value || selectedId.value;
  if (!active || data.expandableSides.length === 0) return null;
  const { slots, sidesByCard } = stageSideIndex.value;
  const sideIdxs = sidesByCard.get(active);
  if (!sideIdxs) return null;

  let memo = openStageWiresMemo.get(data);
  if (!memo) {
    memo = new Map();
    openStageWiresMemo.set(data, memo);
  }
  const memoKey = sideIdxs.join(",");
  const known = memo.get(memoKey);
  if (known) return known;

  const closedWireIds = new Set<string>();
  const closedLabelIds = new Set<string>();
  const rels: TuxMapLevelRel[] = [];
  for (const i of sideIdxs) {
    const side = data.expandableSides[i]!;
    const slot = slots.get(side.aggregate);
    if (slot) {
      closedWireIds.add(slot.wireId);
      if (slot.labelId) closedLabelIds.add(slot.labelId);
    }
    for (const w of side.wires) rels.push(w);
  }
  const routed = routeGridWires(rels, data.rects, data.els);
  const opened: OpenStageWires = {
    // Ids of their own: the router numbers each call's wires from zero
    wires: routed.wires.map((w) => ({ ...w, id: `w-open-${w.id.slice(2)}` })),
    labels: routed.labels.map((l) => ({ ...l, id: `lbl-open-${l.id.slice(4)}` })),
    closedWireIds,
    closedLabelIds,
  };
  memo.set(memoKey, opened);
  return opened;
});

/** The resting wires' labels; the ones in `openStageWires.closedLabelIds` are hidden. */
const baseStageLabels = computed<TuxMapRoutedLabel[]>(() => baseRoutedSvg.value.labels);
/** The open wires' labels. */
const openStageLabels = computed<TuxMapRoutedLabel[]>(() => openStageWires.value?.labels ?? []);

/**
 * Every wire and label on the stage as it is drawn now: the wires at rest, less
 * the ones an open outside card hides, plus the open ones. What the legend, the
 * blast radius, a trace and the wire inspector read.
 */
const routedSvg = computed<{ wires: TuxMapRoutedWire[]; labels: TuxMapRoutedLabel[] }>(() => {
  const base = baseRoutedSvg.value;
  const open = openStageWires.value;
  if (!open) {
    const labels = baseStageLabels.value;
    return labels === base.labels ? base : { wires: base.wires, labels };
  }
  return {
    wires: [...base.wires.filter((w) => !open.closedWireIds.has(w.id)), ...open.wires],
    labels: [...baseStageLabels.value.filter((l) => !open.closedLabelIds.has(l.id)), ...openStageLabels.value],
  };
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

function effectiveDeployedHostIds(id: string | null | undefined): string[] {
  if (!id) return [];
  const found = new Set<string>();
  for (const anc of mapAncestorsOf(id, parentOf.value)) {
    for (const hid of hostIdsByElement.value.get(anc) ?? []) {
      found.add(hid);
    }
  }
  return [...found];
}

function liftToDeployHosts(
  id: string,
  stageHostIds: ReadonlySet<string>,
): string[] {
  const found = new Set<string>();
  for (const hid of effectiveDeployedHostIds(id)) {
    if (stageHostIds.has(hid)) found.add(hid);
  }
  return [...found];
}

// The links of the model before, kept so one arriving subgraph is worked into them (#157)
let linksBuilt: TuxMapLink[] | undefined;
const effectiveModelLinks = computed<TuxMapLink[]>(() => {
  linksBuilt = extractModelLinksKept(
    activeModel.value,
    { includePlanned: showPlanned.value, parentOf: parentOf.value },
    linksBuilt,
    mergedModel.value.added,
  );
  return linksBuilt;
});

// On-screen-only link kinds in `TUX_MAP_LINK_KIND_LABELS` wording (`tti/tti-ux#115`)
const legendLinkKinds = computed<{ kind: string; label: string; quiet: boolean }[]>(() => {
  const present = new Set<string>();
  if (currentLevel.value === 4) {
    const visiblePairs = new Set(routedSvg.value.wires.map((w) => wirePairKey(w.from, w.to)));
    for (const l of activeModel.value.level4.links) {
      if (l.kind && visiblePairs.has(wirePairKey(l.from, l.to))) {
        present.add(l.kind);
      }
    }
  } else {
    const details = stageData.value.wireDetails;
    for (const w of routedSvg.value.wires) {
      const det = details[wirePairKey(w.from, w.to)];
      if (!det) continue;
      for (const pk of det.perKindCounts) {
        if (pk.kind) present.add(pk.kind);
      }
    }
  }
  if (present.size === 0) return [];
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

// On-screen-only element & wire swatches (`tti/tti-ux#115`, `#123`)
const legendFlags = computed(() => {
  const S = stageData.value;
  const R = routedSvg.value;
  if (currentLevel.value === 4) {
    return {
      hasResource: S.deployNodes.length > 0,
      hasRegion: S.bounds.length > 0,
      hasPerson: false,
      hasSystem: false,
      hasCard: false,
      hasRoute: false,
      hasExternal: false,
      hasPlanned:
        S.deployNodes.some((n) => n.status === "planned") ||
        S.bounds.some((b) => Boolean(b.cls?.includes("planned"))) ||
        R.wires.some((w) => w.planned),
      hasGenericWires: R.wires.length > 0 && legendLinkKinds.value.length === 0,
      hasViolation: R.wires.some((w) => Boolean(w.violating)),
    };
  }
  return {
    hasResource: false,
    hasRegion: false,
    hasPerson: S.els.some((e) => e.kind === "person"),
    hasSystem: S.els.some((e) => e.kind === "system"),
    hasCard: S.els.some(
      (e) =>
        e.kind !== "person" &&
        e.kind !== "system" &&
        e.kind !== "route" &&
        e.kind !== "external" &&
        !isKindNodeId(e.id, "r"),
    ),
    hasRoute: S.els.some((e) => e.kind === "route" || isKindNodeId(e.id, "r")),
    hasExternal: S.els.some((e) => e.kind === "external"),
    hasPlanned:
      S.els.some((e) => e.status === "planned") || R.wires.some((w) => w.planned),
    hasGenericWires: R.wires.length > 0 && legendLinkKinds.value.length === 0,
    hasViolation: R.wires.some((w) => Boolean(w.violating)),
  };
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

watch(selectedId, (sel) => {
  usagesShowAll.value = false;
  tracePickerOpen.value = false;
  traceQuery.value = "";
  if (!sel && props.traceTarget === undefined) {
    setTraceTarget(null);
  }
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
  // the links are read for a selection only: with none, the map's first render does not build them (#226)
  if (!id || (!byId.value[id] && !resById.value[id])) return null;
  const links = effectiveModelLinks.value;
  if (!links.length) return null;
  return computeLinkBlastRadius(links, id, parentOf.value, {
    model: M,
    intent: blastIntent.value,
  });
});

const usageKindChips = computed<{ kind: string; label: string; count: number; active: boolean }[]>(() => {
  const base = selectionBlastBase.value;
  if (!base) return [];
  const seenByKind = new Map<string, Set<string>>();
  const record = (kind: string, fromId: string) => {
    const k = kind || "uses";
    let set = seenByKind.get(k);
    if (!set) {
      set = new Set<string>();
      seenByKind.set(k, set);
    }
    set.add(fromId);
  };
  for (const [depId, hit] of base.hits) {
    record(hit.via.kind || "uses", depId);
  }
  for (const l of effectiveModelLinks.value) {
    if (!base.seeds.has(l.from) && base.seeds.has(l.to)) {
      if (classifyBlastLink(l, 0, blastIntent.value) !== "skip") {
        record(l.kind || "uses", l.from);
      }
    }
  }
  const knownOrder = Object.keys(TUX_MAP_LINK_KIND_LABELS);
  const keys = [
    ...knownOrder.filter((k) => seenByKind.has(k)),
    ...[...seenByKind.keys()].filter((k) => !hasOwn(TUX_MAP_LINK_KIND_LABELS, k)).sort(cmpCodepoint),
  ];
  return keys.map((kind) => ({
    kind,
    label: (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) ? TUX_MAP_LINK_KIND_LABELS[kind] : undefined) || kind,
    count: seenByKind.get(kind)?.size ?? 0,
    active: isUsageKindEnabled(kind),
  }));
});

// The blast radius of the selected element through the model's links, filtered by active kind chips:
// everything that depends on it or on anything inside it (including Level 4 hosts and C4 rels). It reads
// what the walk needs from the model out of the tables the unfiltered one left (#227).
const selectionBlast = computed(() => {
  const id = selectedId.value;
  return (
    selectionBlastBase.value &&
    computeLinkBlastRadius(effectiveModelLinks.value, id!, parentOf.value, {
      model: activeModel.value,
      intent: blastIntent.value,
      kinds: activeUsageKindsSet.value,
    })
  );
});

// Selected element's incoming & outgoing dependency-rule violations (`tti/tti-ux#123`)
interface SelectedViolationEntry {
  key: string;
  direction: "in" | "out";
  peerId: string;
  peerName: string;
  kindLabel: string;
  at?: string;
  href: string | null;
  rule: string;
  message?: string;
  fix?: string;
  severity: "error" | "warning";
}

const selectedViolations = computed<SelectedViolationEntry[]>(() => {
  const sel = selectedId.value;
  if (!sel) return [];
  const inSubtree = (id: string): boolean =>
    id === sel || mapAncestorsOf(id, parentOf.value).includes(sel);
  const out: SelectedViolationEntry[] = [];
  const seen = new Set<string>();
  for (const l of effectiveModelLinks.value) {
    if (!l.violations?.length) continue;
    const fromIn = inSubtree(l.from);
    const toIn = inSubtree(l.to);
    if (!fromIn && !toIn) continue;
    const direction: "in" | "out" = fromIn && !toIn ? "out" : "in";
    const peerId = direction === "out" ? l.to : l.from;
    const peerName = byId.value[peerId]?.name || resById.value[peerId]?.title || stripNodeKindPrefix(peerId);
    const k = l.kind || "uses";
    const kindLabel =
      (hasOwn(TUX_MAP_LINK_KIND_LABELS, k) ? TUX_MAP_LINK_KIND_LABELS[k] : undefined) || k;
    const [atPath, atLine] = (l.at || "").split(/:(?=\d+$)/);
    const href = atPath
      ? buildSourceHref({
          path: atPath,
          lineRange: atLine ? [Number(atLine), Number(atLine)] : undefined,
        })
      : null;
    for (const v of l.violations) {
      if (!v || typeof v.rule !== "string") continue;
      const dedupKey = `${direction}\u0000${peerId}\u0000${v.rule}\u0000${v.message ?? ""}\u0000${l.at ?? ""}`;
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);
      out.push({
        key: dedupKey,
        direction,
        peerId,
        peerName,
        kindLabel,
        ...(l.at ? { at: l.at } : {}),
        href,
        rule: v.rule,
        ...(v.message ? { message: v.message } : {}),
        ...(v.fix ? { fix: v.fix } : {}),
        severity: v.severity === "warning" ? "warning" : "error",
      });
    }
  }
  return out;
});

// Directed spreading path view between `selectedId` and `localTraceTarget` (`tti/tti-ux#125`)
const activeTraceResult = computed<(TuxMapTraceResult & { from: string; to: string; peerId: string }) | null>(() => {
  const sel = selectedId.value;
  const tgt = localTraceTarget.value;
  if (!sel || !tgt || sel === tgt || !effectiveModelLinks.value.length) return null;
  const fromDependent = traceSpreadingPath(tgt, sel, activeModel.value, {
    allowStoppingLastHop: true,
  });
  if (fromDependent.found) {
    return { ...fromDependent, from: tgt, to: sel, peerId: tgt };
  }
  const forward = traceSpreadingPath(sel, tgt, activeModel.value, {
    allowStoppingLastHop: false,
  });
  return { ...forward, from: sel, to: tgt, peerId: tgt };
});

const stageTraceState = computed<{ nodeIds: Set<string>; wireIds: Set<string> } | null>(() => {
  const tr = activeTraceResult.value;
  if (!tr || !tr.found || tr.nodeIds.length === 0) return null;
  const nodeIds = new Set<string>();
  const wireIds = new Set<string>();
  if (currentLevel.value === 4) {
    const stageHostIds = new Set(stageData.value.deployNodes.map((n) => n.id));
    for (const nid of tr.nodeIds) {
      for (const hid of liftToDeployHosts(nid, stageHostIds)) nodeIds.add(hid);
    }
    for (const w of routedSvg.value.wires) {
      if (nodeIds.has(w.from) && nodeIds.has(w.to)) wireIds.add(w.id);
    }
    return { nodeIds, wireIds };
  }
  const stageIds = new Set(stageData.value.els.map((e) => e.id));
  const miniSet = new Set(stageData.value.els.filter((e) => e.mini).map((e) => e.id));
  const foldedMap = stageData.value.foldedToRepresentative;
  const fId = focusId.value;
  const liftStageNode = (rawNid: string): string | null => {
    const nid = foldedMap.get(rawNid) ?? rawNid;
    const direct = liftToSet(nid, stageIds, parentOf.value);
    if (direct) return direct;
    if (fId && mapAncestorsOf(nid, parentOf.value).includes(fId)) return "@bound";
    return null;
  };
  for (const nid of tr.nodeIds) {
    const on = liftStageNode(nid);
    if (on && on !== "@bound") nodeIds.add(on);
  }
  const hopPairs = new Set<string>();
  for (const h of tr.hops) {
    const sf = liftStageNode(h.from);
    const st = liftStageNode(h.to);
    if (sf && st && sf !== st) {
      hopPairs.add(wirePairKey(sf, st));
      if (sf !== "@bound" && (st === "@bound" || (miniSet.has(sf) && !miniSet.has(st)))) {
        hopPairs.add(wirePairKey(sf, "@bound"));
      }
      if (st !== "@bound" && (sf === "@bound" || (!miniSet.has(sf) && miniSet.has(st)))) {
        hopPairs.add(wirePairKey("@bound", st));
      }
    }
  }
  for (const w of routedSvg.value.wires) {
    if (hopPairs.has(wirePairKey(w.from, w.to))) {
      wireIds.add(w.id);
    }
  }
  return { nodeIds, wireIds };
});

const traceCandidateItems = computed<{ id: string; name: string; sub: string }[]>(() => {
  const sel = selectedId.value;
  if (!sel) return [];
  const q = traceQuery.value.trim().toLowerCase();
  const out: { id: string; name: string; sub: string }[] = [];
  const seen = new Set<string>([sel]);
  const pushItem = (id: string, subHint?: string) => {
    if (!id || seen.has(id) || id.startsWith("@more-")) return;
    const el = hasOwn(byId.value, id) ? byId.value[id] : undefined;
    const dn = hasOwn(resById.value, id) ? resById.value[id] : undefined;
    const name = el?.name || dn?.title || stripNodeKindPrefix(id);
    const sub = subHint || el?.source?.path || plainElementKindLabel(el || dn?.kind || "resource");
    if (q && !name.toLowerCase().includes(q) && !sub.toLowerCase().includes(q) && !id.toLowerCase().includes(q)) {
      return;
    }
    seen.add(id);
    out.push({ id, name, sub });
  };
  if (selectionBlast.value) {
    for (const [depId, hit] of selectionBlast.value.hits) {
      pushItem(depId, `${hit.hop} ${hit.hop === 1 ? "step" : "steps"} away`);
      if (out.length >= 24) return out;
    }
  }
  // Also surface direct downstream dependencies (`sel` -> `l.to`) so forward tracing works out of the box
  const selSubtree = (id: string): boolean =>
    id === sel || mapAncestorsOf(id, parentOf.value).includes(sel);
  for (const l of effectiveModelLinks.value) {
    if (!l.stop && !TUX_MAP_QUIET_LINK_KINDS.has(l.kind || "uses") && selSubtree(l.from) && !selSubtree(l.to)) {
      pushItem(l.to, "direct dependency");
      if (out.length >= 24) return out;
    }
  }
  for (const e of stageData.value.els) {
    if (!e.ref) pushItem(e.id);
    if (out.length >= 24) return out;
  }
  for (const entry of mapSearchIndex.value) {
    pushItem(entry.id, entry.ancestorsText || entry.path || entry.group);
    if (out.length >= 24) break;
  }
  return out;
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
  const dirAncId = ancs.find((a) => isKindNodeId(a, "d"));
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
    const fallbackFile = isKindNodeId(id, "f")
      ? splitNodeId(id).rest
      : isKindNodeId(id, "s")
        ? splitNodeId(id).rest.split("#")[0] || ""
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

function liftStageOrFoldedElement(
  rawId: string,
  stageIds: ReadonlySet<string>,
): string | null {
  const foldedRep = stageData.value.foldedToRepresentative.get(rawId);
  if (foldedRep && stageIds.has(foldedRep)) return foldedRep;
  const direct = liftToSet(rawId, stageIds, parentOf.value);
  if (direct) return direct;
  if (foldedRep) return liftToSet(foldedRep, stageIds, parentOf.value);
  return null;
}

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
    if (!liftStageOrFoldedElement(x, stageIds)) off++;
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
    const on = liftStageOrFoldedElement(x, stageIds);
    if (on) directIds.add(on);
  }
  const reachCountById = new Map<string, number>();
  for (const x of hits.keys()) {
    const on = liftStageOrFoldedElement(x, stageIds);
    if (on && !directIds.has(on)) reachCountById.set(on, (reachCountById.get(on) ?? 0) + 1);
  }
  const impactedIds = new Set(reachCountById.keys());
  const fId = focusId.value;
  const directOnFocus = Boolean(fId && [...seeds].some((s) => mapAncestorsOf(s, parentOf.value).includes(fId)));
  // a wire is in the radius when its dependent end is reached and the other end is lit (including resting `@bound` wires)
  const impactedWires = new Set(
    routedSvg.value.wires
      .filter(
        (w) =>
          impactedIds.has(w.from) &&
          (directIds.has(w.to) || impactedIds.has(w.to) || (w.to === "@bound" && directOnFocus)),
      )
      .map((w) => w.id),
  );
  return { directIds, impactedIds, impactedWires, rollupCountById, reachCountById, offStageCount };
}

// The branch's blast radius over the whole model: what carries a diff, its roll-up onto every ancestor, and
// the radius through the links. None of it depends on the level, so a level change only projects it (#227).
const branchBlast = computed(() => {
  const M = activeModel.value;
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

  // Propagate via multi-seed computeLinkBlastRadius across effective links
  const links = allDiffIds.size > 0 || props.blastSeeds?.length ? effectiveModelLinks.value : [];
  if (!links.length) return { rollupCountById, diffBlast: null };
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
  return { rollupCountById, diffBlast };
});

const blastRadiusState = computed<BlastRadiusComputation | null>(() => {
  if (!showBlastRadius.value) return null;

  // A selection with links: light what its change reaches, lifted onto the cards on stage
  const sb = selectionBlast.value;
  if (sb) {
    return projectBlastOntoStage(sb.seeds, sb.hits, new Map());
  }

  const { rollupCountById, diffBlast } = branchBlast.value;
  const directIds = new Set<string>();
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

  if (diffBlast) return projectBlastOntoStage(diffBlast.seeds, diffBlast.hits, rollupCountById, directIds);

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

/**
 * Why cards are faded while the Blast radius switch is on (#205). With a model that carries a
 * change, switching it on fades every card the change does not reach, and nothing on the page
 * said so. `of` is whose radius is lit: the selection's when the model has links to follow from
 * it, the change's otherwise. `null` when the radius lights nothing here, so nothing is faded.
 */
const blastFade = computed<{ of: "selection" | "change"; text: string } | null>(() => {
  const br = blastRadiusState.value;
  if (!br || effectiveIsListView.value || matchingSearchIds.value) return null;
  if (br.directIds.size === 0 && br.impactedIds.size === 0) return null;
  const rest = "The rest of this view is faded.";
  const id = selectedId.value;
  if (id && selectionBlast.value) {
    const name =
      (hasOwn(byId.value, id) ? byId.value[id]?.name : undefined) ||
      (hasOwn(resById.value, id) ? resById.value[id]?.title : undefined) ||
      id;
    return { of: "selection", text: `Blast radius of ${name}: it and what depends on it are lit. ${rest}` };
  }
  return hasModelDiffs.value
    ? { of: "change", text: `Blast radius: the changed parts and what depends on them are lit. ${rest}` }
    : { of: "selection", text: `Blast radius: the selection and what depends on it are lit. ${rest}` };
});

/** The chosen intent's definition, and what its walk follows, stops at and skips in words (#259). */
const blastIntentDef = computed(() => TUX_MAP_BLAST_INTENTS.find((d) => d.id === blastIntent.value) ?? TUX_MAP_BLAST_INTENTS[0]!);
const blastIntentRule = computed<string>(() => {
  const d = blastIntentDef.value;
  const say = (cs: readonly TuxMapBlastLinkClass[]) => cs.map((c) => TUX_MAP_BLAST_LINK_CLASS_LABELS[c]).join(", ");
  return `Follows ${say(d.follows)}; stops one step out at ${say(d.stops)}${d.skips.length ? `; skips ${say(d.skips)}` : ""}.`;
});

/**
 * What the chosen intent lights on this view next to General (#259), so switching it never looks dead:
 * `same` when the cards lit are General's. `null` under General.
 */
const blastIntentVsGeneral = computed<{ n: number; general: number; same: boolean } | null>(() => {
  const br = blastRadiusState.value;
  if (!br || blastIntent.value === "default") return null;
  const sb = selectionBlast.value;
  const walk = sb || branchBlast.value.diffBlast;
  // no links to walk: the change's neighbours are lit by the wires, whatever the intent
  if (!walk) return { n: br.impactedIds.size, general: br.impactedIds.size, same: true };
  const g = computeLinkBlastRadius(effectiveModelLinks.value, walk.seeds, parentOf.value, {
    model: activeModel.value,
    kinds: sb ? activeUsageKindsSet.value : undefined,
  });
  const lit = projectBlastOntoStage(g.seeds, g.hits, br.rollupCountById, sb ? undefined : br.directIds).impactedIds;
  return {
    n: br.impactedIds.size,
    general: lit.size,
    same: lit.size === br.impactedIds.size && [...lit].every((id) => br.impactedIds.has(id)),
  };
});

const offStageImpactCount = computed<number>(() => {
  if (blastRadiusState.value?.offStageCount) return blastRadiusState.value.offStageCount;
  if (selectionBlast.value) return countOffStageHits(selectionBlast.value.hits);
  return stageData.value.moreOutside || 0;
});

function countInnerItemsForCard(e: TuxMapLevelElement): number {
  const M = activeModel.value;
  if (currentLevel.value === 1 && e.id === M.level2.boundary) {
    return M.level2.elements.filter((x) => !x.ref && isShownStatus(x.status)).length;
  }
  const l3 = getLevel3Kids(M, e.id);
  if (currentLevel.value === 2 && !e.ref && l3?.length) {
    return l3.filter((x) => isShownStatus(x.status)).length;
  }
  const sg = getSubgraphForNode(e.id);
  if (sg?.elements.length) {
    return sg.elements.filter((x) => isShownStatus(x.status)).length;
  }
  return 0;
}

/** The key's first blast-radius entry stands for the selection, not for a change the model carries. */
const blastKeyOfSelection = computed<boolean>(() => !(hasModelDiffs.value && blastFade.value?.of !== "selection"));

const renderedCards = computed(() =>
  stageData.value.els.map((e) => {
    const r = hasOwn(stageData.value.rects, e.id) ? stageData.value.rects[e.id] : undefined;
    const kind = e.kind || "container";
    const plainKind = plainElementKindLabel(e);
    const typeLabel = elementTypeLabel(e);
    const live = !e.mini ? formatLiveState(e) : null;
    const outsideLinks = e.mini ? stageData.value.outsideLinkCounts[e.id] || 0 : 0;
    const outMeta = stageData.value.outsideMetaById[e.id];
    const chip: [string, string] | null = !e.mini
      ? getCardChip(e)
      : outsideLinks > 0
        ? ["links", `${outsideLinks} link${outsideLinks === 1 ? "" : "s"}`]
        : null;
    const extraChips: { cls: string; text: string }[] = [];
    if (e.isVendoredCopy || e.vendoredCopies?.length) {
      const vcCount = e.vendoredCopies?.length ?? 0;
      const totalCopies = e.vendoredFrom ? vcCount + 1 : vcCount;
      extraChips.push({
        cls: "vendored",
        text:
          vcCount > 0
            ? `${totalCopies} vendored ${totalCopies === 1 ? "copy" : "copies"}`
            : "vendored copy",
      });
    }
    if (e.mini && (outMeta?.parts ?? 0) > 1 && !outMeta?.isOverflowRollup) {
      extraChips.push({
        cls: "parts",
        text: `${outMeta!.parts} parts`,
      });
    }
    const sharedOther = outMeta?.alsoInParts ?? countOtherSharedParts(e.id, e);
    if (sharedOther > 0) {
      extraChips.push({
        cls: "shared",
        text: `Also in ${sharedOther} ${sharedOther === 1 ? "part" : "parts"}`,
      });
    }
    const hostIds = !e.mini && !e.ref && currentLevel.value >= 2 ? effectiveDeployedHostIds(e.id) : [];
    const runsOnLabel =
      hostIds.length > 0
        ? (() => {
            const firstId = hostIds[0]!;
            const firstTitle = (hasOwn(resById.value, firstId) ? resById.value[firstId]?.title : undefined) || firstId;
            return hostIds.length > 1
              ? `Runs on ${firstTitle} +${hostIds.length - 1}`
              : `Runs on ${firstTitle}`;
          })()
        : "";
    const zoomable = canZoomElement(e);
    const innerCount = countInnerItemsForCard(e);
    const br = blastRadiusState.value;
    const isDirect = Boolean(br?.directIds.has(e.id));
    const isImpacted = Boolean(!isDirect && br?.impactedIds.has(e.id));
    const isTraced = Boolean(stageTraceState.value?.nodeIds.has(e.id));
    const diffBadge = formatDiffBadge(e.id, e.diff);
    const displayName = stageData.value.displayNameById[e.id] || e.name;
    // WCAG 2.5.3 Label-in-Name: begin accessible name with visible title + visible card metadata
    const ariaParts = [displayName];
    if (displayName !== e.name) ariaParts.push(e.name);
    if (e.mini && outMeta?.ownerLabel) ariaParts.push(outMeta.ownerLabel);
    else if (typeLabel) ariaParts.push(typeLabel);
    else if (plainKind) ariaParts.push(plainKind);
    if (!e.mini && runsOnLabel) ariaParts.push(runsOnLabel);
    // the status line as the card shows it (#258)
    if (live) ariaParts.push(live[1]);
    if (chip) ariaParts.push(chip[1]);
    for (const ec of extraChips) ariaParts.push(ec.text);
    if (diffBadge) ariaParts.push(diffBadge[1]);
    if (innerCount > 0) {
      ariaParts.push(`${innerCount} inner ${innerCount === 1 ? "item" : "items"}`);
    }
    const ariaLabel = ariaParts.join(", ");
    const isSplittable = Boolean(e.mini && outMeta?.splittable && (outMeta.parts ?? 0) > 1);
    const isLoadingSubgraph = loadingSubgraphId.value === e.id;
    // The description gets the whole lines the card has room for after its other rows (#205)
    const descLines =
      e.mini || !e.desc
        ? 0
        : cardDescriptionLines(r?.h ?? 128, {
            type: Boolean(typeLabel),
            runsOn: Boolean(runsOnLabel),
            footer: Boolean(live || chip || extraChips.length > 0 || diffBadge),
          });
    return {
      el: e,
      id: e.id,
      parent: e.parent || "",
      name: displayName,
      fullName: e.name,
      ariaLabel,
      ownerLabel: outMeta?.ownerLabel || "",
      runsOnLabel,
      desc: !e.mini ? e.desc : undefined,
      descLines,
      mini: Boolean(e.mini),
      splittable: isSplittable,
      isOverflowRollup: Boolean(outMeta?.isOverflowRollup),
      parts: outMeta?.parts ?? 1,
      isLoadingSubgraph,
      statusCls: e.status ? `tux-map__el--st-${e.status}` : "",
      kindCls: `tux-map__el--k-${kind}`,
      traceCls: isTraced ? "tux-map__el--trace" : "",
      blastCls: isDirect
        ? "tux-map__el--diff-direct"
        : isImpacted
          ? "tux-map__el--diff-impact"
          : "",
      icon: elementIconName(kind),
      typeLabel,
      live,
      chip,
      extraChips,
      diffBadge,
      zoomable,
      style: {
        left: `${r?.x ?? 0}px`,
        top: `${r?.y ?? 0}px`,
        width: `${r?.w ?? 212}px`,
        height: `${r?.h ?? 128}px`,
      },
      zbStyle: {
        left: `${(r?.x ?? 0) + (r?.w ?? 212) - 28}px`,
        top: `${(r?.y ?? 0) + 6}px`,
      },
    };
  }),
);

const activeRovingCardId = computed<string | null>(() => {
  if (currentLevel.value === 4) {
    const nodes = stageData.value.deployNodes;
    if (!nodes.length) return null;
    if (rovingCardId.value && nodes.some((n) => n.id === rovingCardId.value)) {
      return rovingCardId.value;
    }
    if (selectedId.value && nodes.some((n) => n.id === selectedId.value)) {
      return selectedId.value;
    }
    return nodes[0]!.id;
  }
  const cards = renderedCards.value;
  if (!cards.length) return null;
  if (rovingCardId.value && cards.some((c) => c.id === rovingCardId.value)) {
    return rovingCardId.value;
  }
  if (selectedId.value && cards.some((c) => c.id === selectedId.value)) {
    return selectedId.value;
  }
  return cards[0]!.id;
});

const isAutoDenseList = computed<boolean>(
  () =>
    !userForcedView.value &&
    props.view === undefined &&
    currentLevel.value !== 4 &&
    stageData.value.innerCardCount > (props.denseListThreshold || 40),
);

const effectiveIsListView = computed<boolean>(() => isListView.value || isAutoDenseList.value);

function setExplicitViewMode(mode: TuxMapViewMode) {
  userForcedView.value = true;
  isListView.value = mode === "list";
}

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

watch([searchQuery, currentLevel, focusId], ([, , ], [prevQ]) => {
  const m = matchingSearchIds.value;
  if (!m) {
    if (prevQ && prevQ.trim() && !searchQuery.value.trim()) {
      liveAnnouncement.value = `All ${stageTotalCount.value} shown here`;
    }
    return;
  }
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

// The index of the model before, kept so one arriving subgraph's entries are added to it (#157)
let searchIndexBuilt: TuxMapSearchEntry[] | undefined;
const mapSearchIndex = computed<TuxMapSearchEntry[]>(() => {
  searchIndexBuilt = buildMapSearchIndexKept(
    activeModel.value,
    parentOf.value,
    searchIndexBuilt,
    mergedModel.value.added,
  );
  return searchIndexBuilt;
});

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
  if (stageTraceState.value?.nodeIds.has(id)) return true;
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
  if (wireId && stageTraceState.value?.wireIds.has(wireId)) return true;
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

/**
 * The open outside cards' wires and labels (#154): a handful of elements, read
 * from their own template refs, so opening a card never indexes the stage again.
 */
interface StageOpenDom {
  fgWires: { el: SVGElement; id: string; from: string; to: string }[];
  labels: { el: HTMLElement; forced: boolean; from: string; to: string }[];
}

const openFgGroupRef = ref<SVGGElement | null>(null);
const openLabelEls = ref<HTMLElement[]>([]);
let stageOpenDom: StageOpenDom | null = null;

function indexStageOpenDom() {
  const group = openStageWires.value ? openFgGroupRef.value : null;
  if (!group) {
    stageOpenDom = null;
    return;
  }
  const fgWires: StageOpenDom["fgWires"] = [];
  const paths = group.children;
  for (let i = 0; i < paths.length; i++) {
    const el = paths[i] as SVGElement;
    fgWires.push({
      el,
      id: el.dataset.id || "",
      from: el.dataset.from || "",
      to: el.dataset.to || "",
    });
  }
  const labels: StageOpenDom["labels"] = [];
  for (const el of openLabelEls.value) {
    labels.push({
      el,
      forced: el.dataset.forced === "1",
      from: el.dataset.from || "",
      to: el.dataset.to || "",
    });
  }
  stageOpenDom = { fgWires, labels };
}

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
    if (w.dataset.open) continue; // indexed apart, by indexStageOpenDom
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
    if (el.dataset.open) continue;
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
  indexStageOpenDom();
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
  const openDom = stageOpenDom;
  /** A wire's foreground paths by id, among the resting wires and the open ones. */
  const fgWiresFor = (wid: string): SVGElement[] | undefined => {
    const ws = cache.fgWiresById.get(wid);
    if (ws || !openDom) return ws;
    const found: SVGElement[] = [];
    for (let i = 0; i < openDom.fgWires.length; i++) {
      if (openDom.fgWires[i]!.id === wid) found.push(openDom.fgWires[i]!.el);
    }
    return found.length ? found : undefined;
  };

  // Turn off previously lit wires and labels in O(k)
  for (let i = 0; i < cache.litWires.length; i++) {
    cache.litWires[i]!.classList.remove("tux-map__wire-fg--on");
  }
  cache.litWires.length = 0;

  for (let i = 0; i < cache.litLabels.length; i++) {
    cache.litLabels[i]!.el.classList.remove("tux-map__lab--on");
  }
  cache.litLabels.length = 0;

  const tr = stageTraceState.value;
  if (tr) {
    for (const wid of tr.wireIds) {
      const ws = fgWiresFor(wid);
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
          br.directIds.has(c.id) || br.impactedIds.has(c.id) || Boolean(tr?.nodeIds.has(c.id)),
        );
      }
      for (const wid of br.impactedWires) {
        const ws = fgWiresFor(wid);
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

  // While outside cards are open, their resting wires are hidden: they light
  // nothing and make no neighbour; the open wires do, in their place.
  const openNeighbors: Set<string> | null = openDom ? new Set<string>([key]) : null;

  const activeWires = cache.fgWiresByNode.get(key);
  if (activeWires) {
    for (let i = 0; i < activeWires.length; i++) {
      const w = activeWires[i]!;
      if (openNeighbors) {
        if (w.classList.contains("tux-map__wire-fg--closed")) continue;
        openNeighbors.add(w.dataset.from || "");
        openNeighbors.add(w.dataset.to || "");
      }
      w.classList.add("tux-map__wire-fg--on");
      cache.litWires.push(w);
    }
  }

  const activeLabels = cache.labelsByNode.get(key);
  if (activeLabels) {
    for (let i = 0; i < activeLabels.length; i++) {
      const item = activeLabels[i]!;
      if (openDom && item.el.classList.contains("tux-map__lab--closed")) continue;
      item.el.classList.add("tux-map__lab--on");
      cache.litLabels.push(item);
    }
  }

  if (openDom && openNeighbors) {
    for (let i = 0; i < openDom.fgWires.length; i++) {
      const w = openDom.fgWires[i]!;
      if (w.from !== key && w.to !== key) continue;
      openNeighbors.add(w.from);
      openNeighbors.add(w.to);
      w.el.classList.add("tux-map__wire-fg--on");
      cache.litWires.push(w.el);
    }
    for (let i = 0; i < openDom.labels.length; i++) {
      const item = openDom.labels[i]!;
      if (item.from !== key && item.to !== key) continue;
      item.el.classList.add("tux-map__lab--on");
      cache.litLabels.push(item);
    }
  }

  const neighborSet = openNeighbors ?? cache.neighborsByNode.get(key);
  const boundLit = Boolean(neighborSet?.has("@bound") || key === "@bound");
  const br = rawId === selectedId.value ? blastRadiusState.value : null;
  if (br) {
    for (const wid of br.impactedWires) {
      const ws = fgWiresFor(wid);
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
      Boolean(br && (br.directIds.has(c.id) || br.impactedIds.has(c.id))) ||
      Boolean(tr?.nodeIds.has(c.id));
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

// The cards of the stage that zoom, one table a stage: a pointer move looks one up only for a
// card within reach (#224)
const stageZoomable = computed<Set<string>>(() => {
  const ids = new Set<string>();
  for (const id in stageData.value.rects) if (isCardIdZoomable(id)) ids.add(id);
  return ids;
});

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

  const rects = stageData.value.rects;
  for (const id in rects) {
    const r = rects[id]!;
    if (r.bound) continue;
    const anchorX = Math.max(r.x, Math.min(r.x + r.w, stageX));
    const anchorY = Math.max(r.y, Math.min(r.y + r.h, stageY));
    const dist = Math.hypot(stageX - anchorX, stageY - anchorY);
    if (dist > maxDist) continue;
    const zoomable = stageZoomable.value.has(id);
    if (requireZoomable && !zoomable) continue;

    // When in empty space, give zoomable cards a slight magnetic attraction advantage
    const score = dist === 0 ? 0 : preferZoomable && zoomable ? dist * 0.78 : dist;
    if (!best || score < best.score) {
      best = {
        id,
        name: "",
        zoomable,
        rect: r,
        anchorX,
        anchorY,
        dist,
        score,
      };
    }
  }
  if (best) best.name = getCardDisplayName(best.id);
  return best;
}

// The beam's dashes run only under `--on`, set with its opacity: an always-mounted
// beam that animated while transparent repainted the stage every frame (#223)
function setProximityTether(svg: SVGSVGElement | null, opacity: string) {
  if (!svg) return;
  svg.style.opacity = opacity;
  svg.classList.toggle("tux-map__proximity-tether--on", opacity !== "0");
}

function hideProximityTetherDom() {
  setProximityTether(proximityTetherSvgRef.value, "0");
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
      setProximityTether(svgEl, strength.toFixed(2));
    } else {
      setProximityTether(svgEl, "0");
    }
  }
}

function updateProximityAtStagePoint(stageX: number, stageY: number) {
  if (activeTool.value !== "select" || effectiveIsListView.value) {
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
  if (currentLevel.value >= 5 && stageData.value.codeEdgeHoverIds.size > 0) {
    hoveredStageCardId.value =
      nextId && stageData.value.codeEdgeHoverIds.has(nextId) ? nextId : null;
  }
  if (selectedId.value) return;
  applyStageHighlight(nextId ?? proximityCard.value?.id ?? null);
}

function onStagePointerLeave() {
  clearPreZoomCardTransform();
  currentHoveredId = null;
  if (hoveredStageCardId.value !== null) {
    hoveredStageCardId.value = null;
  }
  if (proximityCard.value) {
    proximityCard.value = null;
    setProximityClassOnDom(null);
  }
  hideProximityTetherDom();
  if (selectedId.value) return;
  applyStageHighlight(null);
}

// The stage's own index lasts as long as its cards and resting wires do; a hover
// or a selection that opens an outside card leaves both in place (#154).
watch([currentLevel, focusId, showPlanned, showBlastRadius, activeModel, baseRoutedSvg], () => {
  stageDomCache = null;
  proximityCard.value = null;
  hideProximityTetherDom();
  nextTick(() => {
    rebuildStageDomCache();
    applyStageHighlight(selectedId.value ?? currentHoveredId);
  });
});

// Opening or closing an outside card swaps a few wires: index those, and light
// the stage again, once they are drawn.
watch(openStageWires, () => {
  nextTick(() => {
    indexStageOpenDom();
    applyStageHighlight(selectedId.value ?? currentHoveredId ?? proximityCard.value?.id ?? null);
  });
});

watch([selectedId, matchingSearchIds, blastRadiusState, stageTraceState], () => {
  nextTick(() => {
    applyStageHighlight(selectedId.value ?? currentHoveredId ?? proximityCard.value?.id ?? null);
  });
});

const viewportWidth = ref<number>(1280);
const containerWidth = ref<number>(1280);
const viewportScrollLeft = ref<number>(0);
const viewportScrollTop = ref<number>(0);
const panX = ref<number>(0);
const zoomHudText = ref<string>("");
const zoomHudDirection = ref<"in" | "out">("in");
let zoomHudTimer: ReturnType<typeof setTimeout> | null = null;
let lastPointerClient: { x: number; y: number } | null = null;

// The camera's travel (#212). What is playing: the stage's own animation and the fades that
// go with it, and the scroll of a magnified diagram. The state is on its target before any of
// it starts, so ending a travel is dropping it: the view is where it was going.
let travelAnims: Animation[] = [];
let endScrollTravel: (() => void) | null = null;

function landTravel() {
  for (const a of travelAnims.splice(0)) a.cancel();
  endScrollTravel?.();
  endScrollTravel = null;
}

/** A second input (a key, a press, a click, the wheel) ends the travel where it was going, and its pill with it. */
function cancelTravel() {
  landTravel();
  if (zoomHudTimer) clearTimeout(zoomHudTimer);
  zoomHudText.value = "";
}

/** Under `prefers-reduced-motion` nothing travels (2.3.3). */
const prefersStill = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

// How long the pill that names a change of level stays where there is no travel to go with it
// (a jump, the list, reduced motion): a confirmation. With a travel it goes when the travel ends.
const ZOOM_HUD_JUMP_MS = 600;

function showZoomHud(direction: "in" | "out", label: string, ms = ZOOM_HUD_JUMP_MS) {
  zoomHudDirection.value = direction;
  zoomHudText.value = label;
  if (zoomHudTimer) clearTimeout(zoomHudTimer);
  zoomHudTimer = setTimeout(() => {
    zoomHudText.value = "";
  }, ms);
}

const fitScale = computed<number>(() => {
  const avail = Math.max(320, viewportWidth.value - 2);
  const W = stageData.value.width;
  return Math.min(1, Number((avail / W).toFixed(4)));
});

// Magnification (#106). The stage fits the width by default, which on a phone or a tablet, or under
// browser zoom, draws 14px text at 3-6px. "Larger" scales it past the fit and the viewport scrolls:
// a finger, a scrollbar or the arrow keys move it, and no dragging is required (WCAG 1.4.4, 2.5.7).
const MAGNIFY_SCALES = [0.5, 0.75, 1, 1.5, 2];
/** The magnify step nearest a scale (halfway, the larger), or `null` for no scale (`initialZoom`, #230). */
function nearestMagnifyStep(scale: number | undefined): number | null {
  if (typeof scale !== "number" || !Number.isFinite(scale) || scale <= 0) return null;
  return MAGNIFY_SCALES.reduce((best, m) => (Math.abs(m - scale) <= Math.abs(best - scale) ? m : best));
}
const zoomScale = ref<number | null>(nearestMagnifyStep(props.initialZoom));
const stageScale = computed<number>(() =>
  zoomScale.value !== null && zoomScale.value > fitScale.value ? zoomScale.value : fitScale.value,
);
const isMagnified = computed<boolean>(() => stageScale.value > fitScale.value + 0.001);
const canMagnify = computed<boolean>(() => MAGNIFY_SCALES.some((m) => m > stageScale.value + 0.01));
// The size the reader is told is the size against Fit, which is what "larger" is larger than.
// The stage's own scale read 75% after the first "larger" on a screen where Fit is 0.72 (#205)
const magnifyPercent = computed<number>(() => Math.round((stageScale.value / fitScale.value) * 100));
const magnifyLabel = computed<string>(() => (isMagnified.value ? `${magnifyPercent.value}%` : "Fit"));

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
    ? `Diagram at ${magnifyPercent.value}% of the fitted size: scroll, swipe or drag the background to move around it`
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

// The viewport keeps its size from level to level (#261). A level's own fitted height decided it,
// so a level with fewer cards made the map shorter and moved the page under it. Without a host
// `height` the viewport is as tall as the tallest level shown at this width, 440px at least: the
// first level sets it, a taller one raises it (a shorter one would clip it), none lowers it, and a
// change of the map's width starts again from the level on screen. A shorter level is centred in it.
const VIEWPORT_MIN_HEIGHT = 440;
const levelFitHeight = computed<number>(() =>
  Math.max(VIEWPORT_MIN_HEIGHT, Math.ceil(stageData.value.height * fitScale.value)),
);
const heldFitHeight = ref<number>(0);
let heldForWidth = -1;
watch(
  [levelFitHeight, containerWidth],
  ([h, w]) => {
    if (w !== heldForWidth || h > heldFitHeight.value) heldFitHeight.value = h;
    heldForWidth = w;
  },
  { immediate: true, flush: "sync" },
);
const computedViewportHeight = computed<string>(() => {
  if (props.height && props.height !== "auto") {
    return props.height;
  }
  const fitH = heldFitHeight.value;
  if (!isMagnified.value) return `${fitH}px`;
  // magnified: tall enough to read, never taller than most of the screen; the rest scrolls.
  // The 2px are the viewport's border: without them a viewport as tall as the diagram still
  // scrolled by those 2px, and showed a scrollbar thumb as tall as itself (#205)
  return `max(${fitH}px, min(${Math.ceil(stageData.value.height * stageScale.value) + VIEWPORT_BORDER}px, 75vh))`;
});

const VIEWPORT_BORDER = 2;
const viewportOuterHeight = ref<number>(0);
/** Magnified and as tall as the diagram: only the width scrolls. */
const magnifiedShowsFullHeight = computed<boolean>(
  () =>
    isMagnified.value &&
    viewportOuterHeight.value > 0 &&
    viewportOuterHeight.value >= Math.ceil(stageData.value.height * stageScale.value) + VIEWPORT_BORDER - 0.5,
);

/**
 * How far down the stage is drawn so that a level shorter than the viewport sits in its middle
 * (#261), in px. Fitted and without a host `height` the viewport's height is known here; otherwise
 * it is the one last measured. Only the stage's `top` moves: its transform, and the travels that
 * animate it, keep their own origin.
 */
const viewportInnerHeight = computed<number>(() => {
  const outer =
    !isMagnified.value && (!props.height || props.height === "auto")
      ? heldFitHeight.value
      : viewportOuterHeight.value;
  return Math.max(0, outer - VIEWPORT_BORDER);
});
const stageOffsetY = computed<number>(() => {
  const free = viewportInnerHeight.value - stageData.value.height * stageScale.value;
  return free > 1 ? Math.floor(free / 2) : 0;
});

// The More menu of a narrow map opens under its button. Where the button is near the right
// edge the menu ran past the map and was cut by the window or the frame around it (#205)
const moreMenuRef = ref<HTMLElement | null>(null);

function placeMoreMenu() {
  const menu = moreMenuRef.value;
  const root = mapRootRef.value;
  if (!menu || !root) return;
  menu.style.removeProperty("--tux-map-more-shift");
  if (!moreMenuOpen.value) return;
  const m = menu.getBoundingClientRect();
  const r = root.getBoundingClientRect();
  // as far left as keeps its right edge in the map, and no further than the map's left edge
  const shift = Math.max(Math.min(0, r.right - m.right), Math.min(0, r.left - m.left));
  if (shift < 0) menu.style.setProperty("--tux-map-more-shift", `${Math.round(shift)}px`);
}

watch(moreMenuOpen, () => nextTick(placeMoreMenu));

function measureViewport() {
  vpBox = null;
  if (moreMenuOpen.value) placeMoreMenu();
  if (viewportRef.value && viewportRef.value.clientWidth > 0) {
    viewportWidth.value = viewportRef.value.clientWidth;
  }
  viewportOuterHeight.value = viewportRef.value?.offsetHeight ?? 0;
  const rootW =
    mapRootRef.value?.clientWidth ||
    viewportRef.value?.clientWidth ||
    (typeof window !== "undefined" ? window.innerWidth : 1280);
  if (rootW > 0) {
    containerWidth.value = rootW;
  }
}

// The viewport's content box on the page and its scroll position, kept between pointer moves:
// a move reads neither, so it forces no layout after the last one's writes (#224). The box is
// read again after a resize, a scroll of the page or the pointer leaving the viewport; the
// scroll position in the viewport's own scroll event, and after the map scrolls it.
let vpBox: number[] | null = null;
let vpScroll: number[] | null = null;
const dropViewportBox = () => void (vpBox = null);
const onPageScroll = (e: Event) => e.target !== viewportRef.value && dropViewportBox();

function viewportBox(): number[] {
  const el = viewportRef.value;
  if (!el) return [0, 0];
  if (!vpBox) {
    const r = el.getBoundingClientRect();
    vpBox = [r.left + el.clientLeft, r.top + el.clientTop];
  }
  return vpBox;
}

/** Where the viewport's scrolled content starts, in client px. */
function viewportOrigin(): number[] {
  const el = viewportRef.value;
  const b = viewportBox();
  if (el && !vpScroll) vpScroll = [el.scrollLeft, el.scrollTop];
  return [b[0]! - (vpScroll?.[0] ?? 0), b[1]! - (vpScroll?.[1] ?? 0)];
}

function scrollViewport(vp: HTMLElement, left: number, top: number) {
  vp.scrollLeft = left;
  vp.scrollTop = top;
  vpScroll = null;
}

function onViewportScroll() {
  const el = viewportRef.value;
  if (!el) return;
  vpScroll = [el.scrollLeft, el.scrollTop];
  viewportScrollLeft.value = vpScroll[0]!;
  viewportScrollTop.value = vpScroll[1]!;
  mapCursor.move();
}

/** The details panel follows the map instead of overlaying it: the list view, or a narrow map */
function panelFollowsMap(): boolean {
  if (effectiveIsListView.value) return true;
  const el = panelRef.value;
  // in the flow the panel is `relative` (its close button is placed against it); over the map, `absolute`
  if (!el || typeof window === "undefined") return false;
  const position = window.getComputedStyle(el).position;
  return position === "static" || position === "relative";
}

/**
 * Moves the view so the details panel does not cover the card `id`, and no further (#205).
 * The view stays where it is for a card that is in sight and clear of the panel; one under the
 * panel is brought out to its edge, and one past the left edge is brought back in. Fitted, the
 * stage slides; magnified, the viewport scrolls, along the wire from `fromId` where the two are
 * wired and straight where they are not (#212). Either way the state is the target at once and
 * the move is played over it: `cancelTravel()` leaves the view where it was going.
 */
function keepClear(id: string | null, fromId?: string | null) {
  const r = id ? stageData.value.rects[id] : undefined;
  const scale = stageScale.value;
  const follows = panelFollowsMap();
  const free = viewportWidth.value - (follows ? 0 : (panelRef.value?.offsetWidth || 380) + 36);
  const vp = viewportRef.value;
  if (isMagnified.value) {
    // magnified, the viewport scrolls; sliding the stage under it as well would fight the scroll
    if (!r || !vp || effectiveIsListView.value) return;
    const from: TravelPoint = [vp.scrollLeft, vp.scrollTop];
    const to: TravelPoint = [
      clearOffset(from[0], r.x * scale, (r.x + r.w) * scale, free, follows ? 12 : 24),
      clearOffset(from[1], r.y * scale, (r.y + r.h) * scale, vp.clientHeight, 12),
    ];
    const ms = prefersStill() ? 0 : travelDuration(Math.hypot(to[0] - from[0], to[1] - from[1]));
    const wire = fromId
      ? routedSvg.value.wires.find((w) => (w.from === fromId && w.to === id) || (w.to === fromId && w.from === id))
      : undefined;
    const path = wire ? wirePolyline(wire.d) : [];
    if (wire && wire.from !== fromId) path.reverse();
    landTravel();
    const step = (u: number) => {
      const [x, y] = cameraAlong(from, to, path, scale, u);
      scrollViewport(vp, x, y);
    };
    if (ms) endScrollTravel = startTravel(ms, step);
    else step(1);
    return;
  }
  let want = 0;
  if (r && !follows && !effectiveIsListView.value) {
    const most = Math.max(0, stageData.value.width * scale - free);
    want = -Math.min(most, clearOffset(Math.min(most, Math.max(0, -panX.value)), r.x * scale, (r.x + r.w) * scale, free, 24));
  }
  const was = panX.value;
  if (want === was) return;
  panX.value = want;
  const stage = stageRef.value;
  if (!stage || typeof stage.animate !== "function" || prefersStill()) return;
  landTravel();
  travelAnims.push(
    stage.animate(
      [was, want].map((x) => ({ transform: `translate3d(${x}px, 0px, 0) scale(${scale})` })),
      { duration: travelDuration(Math.abs(want - was)), easing: TRAVEL_EASING },
    ),
  );
}

let resizeObserver: ResizeObserver | null = null;
// a touch screen gets help that speaks of taps and swipes, not hover and the mouse wheel
const coarsePointer = ref<boolean>(false);
let coarseQuery: MediaQueryList | null = null;
const onCoarseChange = () => {
  coarsePointer.value = Boolean(coarseQuery?.matches);
};

// `wheelZoom="click"` (#209): the plain wheel is the page's until the reader arms
// the map, by a click on the veil or by keyboard focus entering the canvas. Armed,
// it works as `true` does. A touch screen has no veil and nothing to arm: a finger
// already scrolls the page past the map, so there the mode works as `false` does.
const WHEEL_DISARM_AFTER_MS = 3000;
const wheelArmed = ref<boolean>(false);
let wheelDisarmTimer: ReturnType<typeof setTimeout> | null = null;
let pointerInsideMap = false;
const wheelMode = computed<"on" | "off" | "click">(() =>
  props.wheelZoom === "click" ? (coarsePointer.value ? "off" : "click") : props.wheelZoom ? "on" : "off",
);
/** The plain wheel changes the level now (Ctrl+wheel and a pinch always do). */
const plainWheelZooms = computed<boolean>(
  () => wheelMode.value === "on" || (wheelMode.value === "click" && wheelArmed.value),
);
// magnified, the wheel scrolls the diagram and there is nothing to arm
const wheelVeilShown = computed<boolean>(
  () => wheelMode.value === "click" && !wheelArmed.value && !isMagnified.value && !effectiveIsListView.value,
);
const wheelVeilHint = computed<string>(() =>
  wheelVeilShown.value ? "Click the diagram first: until then the mouse wheel scrolls the page. " : "",
);

function clearWheelDisarmTimer() {
  if (wheelDisarmTimer) clearTimeout(wheelDisarmTimer);
  wheelDisarmTimer = null;
}

function armWheel() {
  if (wheelMode.value !== "click") return;
  clearWheelDisarmTimer();
  wheelArmed.value = true;
}

function disarmWheel() {
  clearWheelDisarmTimer();
  if (!wheelArmed.value) return;
  wheelArmed.value = false;
  clearPreZoomCardTransform();
}

function onWheelVeilClick() {
  armWheel();
  // the veil is about to go: focus stays in the canvas, not on a removed button
  viewportRef.value?.focus({ preventScroll: true });
}

const isWheelVeil = (n: EventTarget | null) =>
  n instanceof Element && n.classList.contains("tux-map__wheel-veil");

/** Keyboard focus coming into the canvas arms it; focus on the veil itself, or put there by a mouse, does not. */
function onMapFocusIn(ev: FocusEvent) {
  if (!wheelVeilShown.value) return;
  const vp = viewportRef.value;
  const t = ev.target;
  if (!vp || !(t instanceof Element) || !vp.contains(t) || isWheelVeil(t)) return;
  const from = ev.relatedTarget;
  if (from instanceof Node && vp.contains(from) && !isWheelVeil(from)) return;
  let byKeyboard = true;
  try {
    byKeyboard = t.matches(":focus-visible");
  } catch {
    // no :focus-visible here: any focus counts
  }
  if (byKeyboard) armWheel();
}

function onMapFocusOut(ev: FocusEvent) {
  if (!wheelArmed.value) return;
  const to = ev.relatedTarget;
  // focus gone to nothing (a focused card left the stage) is not a reader leaving while the pointer is on the map
  if (to instanceof Node ? !mapRootRef.value?.contains(to) : !pointerInsideMap) disarmWheel();
}

function onMapPointerEnter() {
  pointerInsideMap = true;
  clearWheelDisarmTimer();
}

function onMapPointerLeave() {
  pointerInsideMap = false;
  clearWheelDisarmTimer();
  if (wheelArmed.value) wheelDisarmTimer = setTimeout(disarmWheel, WHEEL_DISARM_AFTER_MS);
}

watch(wheelMode, () => disarmWheel());

// The help names the wheel only as it works here: a plain wheel zooms unless
// `wheelZoom` is off or the diagram is magnified, where it scrolls and zooming
// needs Ctrl (a trackpad pinch sends it too). Under the veil it names the plain
// wheel and `wheelVeilHint` says to click first. It counts the levels this map has.
const wheelZooms = computed<boolean>(() => wheelMode.value !== "off" && !isMagnified.value);
const hintText = computed<string>(() => {
  const scroll = wheelZooms.value ? "scroll" : "Ctrl+scroll";
  if (effectiveIsListView.value) {
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
  // Level 4 is beside the zoom path, so zooming in from Level 3 lands on Level 5: say so (#205)
  const levels =
    `Levels 1–${maxAvailableLevel.value}` +
    (modelDepth.value >= 5 ? ". Level 4 is Infrastructure, on its own button: zooming in goes from Level 3 to Level 5" : "");
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

function onDocumentPointerDown(ev: PointerEvent) {
  const t = ev.target as HTMLElement | null;
  if (!t) return;
  if (wheelArmed.value && !mapRootRef.value?.contains(t)) disarmWheel();
  if (openCrumbMenuIdx.value !== null && !t.closest(".tux-map__crumb-menu-wrap")) {
    openCrumbMenuIdx.value = null;
  }
  if (openCrumbOverflow.value && !t.closest(".tux-map__crumb-overflow-wrap")) {
    openCrumbOverflow.value = false;
  }
  if (moreMenuOpen.value && !t.closest(".tux-map__more-wrap")) {
    moreMenuOpen.value = false;
  }
  if (tracePickerOpen.value && !t.closest(".tux-map__trace-picker")) {
    tracePickerOpen.value = false;
  }
  if (
    inspectedWireKey.value !== null &&
    !t.closest(".tux-map__wire-pop") &&
    !t.closest(".tux-map__lab")
  ) {
    inspectedWireKey.value = null;
  }
}

// Work whose result is not on screen when the map is first drawn runs in idle time after it (#226), one
// task per callback: the Go-To index (the palette's first search), then the model's links (the first
// selection). Either asked for before then is built on demand, and the idle task finds it built. Where
// there is no `requestIdleCallback`, a 50 ms timer: after the first paint, and no animation frame asked for
// (an idle map runs none). The validator's shape check stays in the merge: its findings go to the console,
// but the values it leaves out for their type are what the sanitizer and every reader after it rely on not
// to meet.
let cancelIdle: (() => void) | null = null;
let idleStarted = false;

function scheduleIdleWork(step = 0) {
  cancelIdle?.();
  cancelIdle = null;
  const next = [mapSearchIndex, effectiveModelLinks][step];
  if (!idleStarted || !next) return;
  const run = () => {
    cancelIdle = null;
    void next.value;
    scheduleIdleWork(step + 1);
  };
  if (window.requestIdleCallback) {
    const h = window.requestIdleCallback(run, { timeout: 2000 });
    cancelIdle = () => window.cancelIdleCallback(h);
  } else {
    const t = setTimeout(run, 50);
    cancelIdle = () => clearTimeout(t);
  }
}

// a new model is indexed again
watch(rawModelInput, () => scheduleIdleWork());

onMounted(() => {
  applyAutoListView();
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onWindowKeydown);
    window.addEventListener("resize", dropViewportBox);
    window.addEventListener("scroll", onPageScroll, { capture: true, passive: true });
    document.addEventListener("pointerdown", onDocumentPointerDown);
    if (window.matchMedia) {
      coarseQuery = window.matchMedia("(pointer: coarse)");
      onCoarseChange();
      coarseQuery.addEventListener?.("change", onCoarseChange);
    }
  }
  // The first size comes from the observer, which reports it once the browser has laid the page out for
  // its first frame, rather than from a layout forced inside this task (#226)
  if (typeof ResizeObserver !== "undefined" && (viewportRef.value || mapRootRef.value)) {
    resizeObserver = new ResizeObserver(() => {
      measureViewport();
    });
    if (viewportRef.value) resizeObserver.observe(viewportRef.value);
    if (mapRootRef.value && mapRootRef.value !== viewportRef.value) {
      resizeObserver.observe(mapRootRef.value);
    }
  } else {
    measureViewport();
  }
  idleStarted = true;
  scheduleIdleWork();
  // Run `keepClear` on mount for `initialSelectedId` (#117)
  if (selectedId.value) {
    nextTick(() => {
      keepClear(selectedId.value);
    });
  }
});

onBeforeUnmount(() => {
  cancelPendingSubgraphResolve();
  idleStarted = false;
  cancelIdle?.();
  cancelIdle = null;
  resizeObserver?.disconnect();
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onWindowKeydown);
    window.removeEventListener("resize", dropViewportBox);
    window.removeEventListener("scroll", onPageScroll, { capture: true });
    document.removeEventListener("pointerdown", onDocumentPointerDown);
  }
  coarseQuery?.removeEventListener?.("change", onCoarseChange);
  clearWheelDisarmTimer();
  if (zoomHudTimer) clearTimeout(zoomHudTimer);
  if (announceTimer) clearTimeout(announceTimer);
  if (laserRaf !== null && typeof window !== "undefined") {
    window.cancelAnimationFrame(laserRaf);
  }
});

function resolveItemById(id: string | null): TuxMapLevelElement | TuxMapDeploymentNode | null {
  if (!id) return null;
  if (currentLevel.value === 4) {
    return (hasOwn(resById.value, id) ? resById.value[id] : undefined) ?? (hasOwn(byId.value, id) ? byId.value[id] : undefined) ?? null;
  }
  return (hasOwn(byId.value, id) ? byId.value[id] : undefined) ?? (hasOwn(resById.value, id) ? resById.value[id] : undefined) ?? null;
}

function setSelectionAndEmit(rawId: string | null, silentAnnounce = false) {
  const id =
    rawId && currentLevel.value !== 4
      ? stageData.value.foldedToRepresentative.get(rawId) ?? rawId
      : rawId;
  const prev = selectedId.value;
  selectedId.value = id;
  if (id) rovingCardId.value = id;

  // Issue #103 (1): Selecting a container on Level 2 (or Level 4 host) that has Level 3 children sets `focusId`
  if (id) {
    if (currentLevel.value === 2 && (getLevel3Kids(activeModel.value, id)?.length ?? 0) > 0) {
      focusId.value = id;
    } else if (currentLevel.value === 4 && hasOwn(resById.value, id) && resById.value[id]?.hosts) {
      const hostedContainer = resById.value[id]!.hosts!.find(
        (cid) => (getLevel3Kids(activeModel.value, cid)?.length ?? 0) > 0,
      );
      if (hostedContainer) {
        focusId.value = hostedContainer;
      }
    }
  }

  if (id !== prev) {
    emit("update:selectedId", id);
    const resolved = resolveItemById(id);
    emit("node-select", resolved);
    if (!silentAnnounce && id && resolved) {
      const label = "title" in resolved ? resolved.title : resolved.name;
      announce(`${label} selected`);
    }
  }
}

function onStageCardClick(c: {
  id: string;
  mini: boolean;
  splittable: boolean;
  parts: number;
  isOverflowRollup: boolean;
}) {
  if (activeTool.value !== "select") return;
  if (c.isOverflowRollup) return;
  if (c.mini && c.splittable && c.parts > 1) {
    rovingCardId.value = c.id;
    toggleSplitCard(c.id);
    announce(`Expanded ${byId.value[c.id]?.name || c.id} into ${c.parts} parts`);
    return;
  }
  selectElement(selectedId.value === c.id ? null : c.id);
}

// A double-click is two clicks and a `dblclick`, and the browser sends the second click and the
// `dblclick` to whatever is under the pointer by then. The first click chooses the card, which opens
// the details and slides the diagram clear of them: the card is no longer there, and the second
// click chose another card, opened the details' own controls or met the background. So the card a
// double-click began on is kept for as long as a double-click lasts, the second click is not a
// choice of anything, and the `dblclick` opens that card wherever it lands (#205).
const DOUBLE_CLICK_MS = 600;
let doubleClickStart: { id: string; at: number } | null = null;

function doubleClickCard(): string | null {
  const g = doubleClickStart;
  return g && Date.now() - g.at < DOUBLE_CLICK_MS ? g.id : null;
}

function onMapClickCapture(ev: MouseEvent) {
  cancelTravel();
  if (activeTool.value !== "select") return;
  // `detail` is the browser's click count; a key or a script sends 0
  if (ev.detail >= 2 && doubleClickCard()) {
    ev.stopPropagation();
    ev.preventDefault();
    return;
  }
  const cardEl = (ev.target as Element | null)?.closest?.(".tux-map__el[data-id]") as HTMLElement | null;
  const id = cardEl && stageRef.value?.contains(cardEl) ? cardEl.dataset.id : undefined;
  doubleClickStart = id && ev.detail === 1 ? { id, at: Date.now() } : null;
}

function onMapDblClickCapture(ev: MouseEvent) {
  const id = doubleClickCard();
  doubleClickStart = null;
  if (!id) return;
  const cardEl = (ev.target as Element | null)?.closest?.(".tux-map__el[data-id]") as HTMLElement | null;
  // still under the pointer: the card's own handler opens it
  if (cardEl?.dataset.id === id && stageRef.value?.contains(cardEl)) return;
  ev.stopPropagation();
  ev.preventDefault();
  openCardByDoubleClick(id);
}

/** What a double-click on the card `id` does: go to where an outside card lives, or zoom in. */
function openCardByDoubleClick(id: string) {
  if (currentLevel.value === 4) {
    const dn = hasOwn(resById.value, id) ? resById.value[id] : undefined;
    if (dn && canZoomDeployNode(dn)) zoomIntoElement(id);
    return;
  }
  const c = renderedCards.value.find((x) => x.id === id);
  if (!c) return;
  if (c.mini && currentLevel.value >= 5 && parentOf.value.has(id)) revealElement(id);
  else if (c.zoomable) zoomIntoElement(id);
}

function selectElement(id: string | null) {
  if (activeTool.value !== "select") return;
  if (id && id.startsWith("@more-")) return;
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
        const sel = effectiveIsListView.value ? "[data-list-id]" : ".tux-map__el[data-id]";
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
    keepClear(id, prev);
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
    announcement?: string;
    keepPreInfra?: boolean;
  } = {},
) {
  cancelPendingSubgraphResolve();
  cancelTravel();
  openCrumbMenuIdx.value = null;
  openCrumbOverflow.value = false;
  const prevLevel = currentLevel.value;
  const prevScale = stageScale.value;
  const prevPanX = panX.value;
  const prevFocus = focusId.value;
  const prevSel = selectedId.value;
  const inward = opts.inward ?? nextLevel > prevLevel;
  if (!opts.keepPreInfra && nextLevel !== 4) {
    preInfraState.value = null;
  }

  const hadFocusInsideMap =
    typeof document !== "undefined" &&
    Boolean(document.activeElement && mapRootRef.value?.contains(document.activeElement));
  const hadFocusInsideViewport =
    typeof document !== "undefined" &&
    Boolean(document.activeElement && viewportRef.value?.contains(document.activeElement));

  // Where the travel starts, on screen, read BEFORE the level changes (#212). A zoom is a call that
  // names `fromCardId` (null where no card is known): in, the level grows out of that card; out, it
  // shrinks from its own frame into the card it came from. Every other call is a jump to a level
  // (a number key, a breadcrumb, a Go to result, a link to another level): no card to travel
  // from, so the level is drawn where it is, with a short fade (#205).
  const prevCard = opts.fromCardId ? stageData.value.rects[opts.fromCardId] : undefined;
  const prevRect = inward
    ? prevCard
    : stageData.value.bounds[0] ?? { x: 24, y: 24, w: stageData.value.width - 48, h: stageData.value.height - 48 };
  // `y` is from the viewport's top (#261): the new level may be centred lower or higher
  const prevOffsetY = stageOffsetY.value;
  const travelFrom =
    opts.fromCardId !== undefined && prevRect
      ? { x: prevPanX + prevRect.x * prevScale, y: prevOffsetY + prevRect.y * prevScale, w: prevRect.w * prevScale, h: prevRect.h * prevScale }
      : null;

  currentLevel.value = nextLevel;
  if (opts.nextFocus !== undefined) {
    const resolvedFocus = opts.nextFocus ? resolveAliasId(opts.nextFocus) ?? opts.nextFocus : opts.nextFocus;
    focusId.value = resolvedFocus;
    emit("update:focus", focusId.value);
  } else if (nextLevel === 3 && !focusId.value) {
    const firstZoomable = activeModel.value.level2.elements.find(
      (e) => !e.ref && (getLevel3Kids(activeModel.value, e.id)?.length ?? 0) > 0,
    );
    focusId.value = firstZoomable?.id ?? null;
    emit("update:focus", focusId.value);
  }

  const rawResolvedNextSel = opts.nextSel ? resolveAliasId(opts.nextSel) ?? opts.nextSel : null;
  const resolvedNextSel =
    rawResolvedNextSel && nextLevel !== 4
      ? stageData.value.foldedToRepresentative.get(rawResolvedNextSel) ?? rawResolvedNextSel
      : rawResolvedNextSel;
  panX.value = 0;
  setSelectionAndEmit(resolvedNextSel, true);
  currentHoveredId = null;
  emit("update:level", nextLevel);

  // Single screen-reader announcement per level change (#117)
  liveAnnouncement.value =
    opts.announcement ||
    `Level ${nextLevel}: ${currentStratumShort.value}.`;

  const resolvedHud =
    opts.hudLabel ||
    `Level ${prevLevel} → Level ${nextLevel}${
      nextLevel === 3 && focusId.value && hasOwn(byId.value, focusId.value)
        ? ` · ${byId.value[focusId.value]!.name}`
        : ""
    }`;
  // The same view again (a Go to result or a usage that is on this level; the focus is the view's
  // parent only on Level 3 and from 5 on): nothing to name, and the card is travelled to as any
  // other card on the level is
  const sameView = nextLevel === prevLevel && (nextLevel < 3 || nextLevel === 4 || focusId.value === prevFocus);
  if (!sameView) showZoomHud(inward ? "in" : "out", resolvedHud);

  // Resolve target card or boundary on the incoming level
  const rawTargetCard =
    opts.targetCardId ? resolveAliasId(opts.targetCardId) ?? opts.targetCardId : null;
  const mappedTargetCard =
    rawTargetCard && nextLevel !== 4
      ? stageData.value.foldedToRepresentative.get(rawTargetCard) ?? rawTargetCard
      : rawTargetCard;
  const resolvedTargetId =
    mappedTargetCard ||
    (!inward && prevLevel === 3 ? prevFocus : null) ||
    (!inward && prevLevel === 2 ? activeModel.value.level2.boundary : null) ||
    resolvedNextSel ||
    null;

  nextTick(() => {
    rebuildStageDomCache();
    if (resolvedNextSel) {
      keepClear(resolvedNextSel, sameView ? prevSel : null);
    }

    // Focus preservation after zoom (#117), respecting #109 host-focus invariant
    if (typeof document !== "undefined") {
      const activeAfter = document.activeElement;
      const focusLostToBody = !activeAfter || activeAfter === document.body;
      const stillInViewport = Boolean(activeAfter && viewportRef.value?.contains(activeAfter));
      if ((hadFocusInsideViewport && (focusLostToBody || stillInViewport)) || (hadFocusInsideMap && focusLostToBody)) {
        const fallbackCardId =
          nextLevel === 4
            ? stageData.value.deployNodes[0]?.id ?? null
            : stageData.value.els.find((e) => !e.mini)?.id ?? stageData.value.els[0]?.id ?? null;
        const focusCardId =
          (resolvedTargetId &&
          (nextLevel === 4
            ? stageData.value.deployNodes.some((n) => n.id === resolvedTargetId)
            : stageData.value.els.some((e) => e.id === resolvedTargetId))
            ? resolvedTargetId
            : fallbackCardId) ?? null;
        if (focusCardId) {
          rovingCardId.value = focusCardId;
          if (effectiveIsListView.value) {
            queryListCardById(mapRootRef.value, focusCardId)?.focus({ preventScroll: true });
          } else {
            (queryCardById(stageRef.value, focusCardId) ?? viewportRef.value)?.focus({
              preventScroll: true,
            });
          }
        } else if (!effectiveIsListView.value) {
          viewportRef.value?.focus({ preventScroll: true });
        }
      }
    }

    // Re-evaluate hovered & proximity-attached card under stationary cursor after level switch: the card
    // under the pointer is found in the new level's rectangles, not by a hit test of the page, which laid
    // the new view out inside this task (#226)
    if (
      lastPointerClient &&
      typeof document !== "undefined" &&
      !selectedId.value &&
      activeTool.value === "select"
    ) {
      const ptAfter = getStageCoordsFromClient(lastPointerClient.x, lastPointerClient.y);
      currentHoveredId = findCardIdAtStagePoint(ptAfter.x, ptAfter.y);
      updateProximityAtStagePoint(ptAfter.x, ptAfter.y);
      applyStageHighlight(currentHoveredId ?? proximityCard.value?.id ?? null);
    }

    const stage = stageRef.value;
    if (
      sameView ||
      effectiveIsListView.value ||
      isMagnified.value ||
      prefersStill() ||
      !stage ||
      typeof stage.animate !== "function"
    ) {
      return;
    }

    const scale = stageScale.value;
    const pan = panX.value;
    const data = stageData.value;
    // what of the new level the travel is about: its frame on the way in, the card on the way out
    const inner = inward
      ? data.bounds[0] ?? { x: 24, y: 24, w: data.width - 48, h: data.height - 48 }
      : resolvedTargetId
        ? data.rects[resolvedTargetId]
        : undefined;
    const start =
      travelFrom && inner
        ? flipStart(inner, { ...travelFrom, y: travelFrom.y - stageOffsetY.value }, pan, scale)
        : null;
    const ms = start ? travelDuration(start.px) : 0;
    const easing = TRAVEL_EASING;
    landTravel();
    if (!start || !ms) {
      travelAnims.push(stage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: TRAVEL_FADE_MS, easing }));
      return;
    }

    // One transform on the stage, from the card's rectangle to the level's place: the level is laid
    // out once, where it ends, and no frame of the travel lays anything out again. The pill goes
    // when the travel does.
    showZoomHud(inward ? "in" : "out", resolvedHud, ms);
    travelAnims.push(
      stage.animate(
        [
          { transform: `translate3d(${start.x}px, ${start.y}px, 0) scale(${start.k})` },
          { transform: `translate3d(${pan}px, 0px, 0) scale(${scale})` },
        ],
        { duration: ms, easing },
      ),
    );
    if (!inward) return;
    // On the way in the frame grows first, and what is inside it fades in as it arrives.
    // "backwards" holds a card back until its turn and lets go of it at the end. "both" kept the
    // last frame on the card for good: its opacity 1 outranks the stylesheet, so after any change
    // of level no filter, hover or selection could dim a card (#205)
    for (const el of stage.children) {
      if (el.classList.contains("tux-map__bound") || typeof el.animate !== "function") continue;
      travelAnims.push(
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: TRAVEL_FADE_MS,
          delay: ms - TRAVEL_FADE_MS,
          easing,
          fill: "backwards",
        }),
      );
    }
  });
}

function canRevealElement(rawId: string): boolean {
  const id = resolveAliasId(rawId) ?? rawId;
  if (parentOf.value.has(id)) return true;
  const M = activeModel.value;
  if (M.level2.elements.some((e) => !e.ref && e.id === id)) return true;
  if (M.level1.elements.some((e) => e.id === id)) return true;
  if (hasOwn(resById.value, id)) return true;
  const canon = vendoredCopyIndex.value.copyToCanonical.get(id);
  if (canon && canon !== id) return canRevealElement(canon);
  return false;
}

/** Go to where `id` lives: the level that shows it among its siblings, with it chosen. */
function revealElement(rawId: string) {
  cancelPendingSubgraphResolve();
  let id = resolveAliasId(rawId) ?? rawId;
  let p = parentOf.value.get(id);
  const M = activeModel.value;
  if (
    !p &&
    !M.level2.elements.some((e) => !e.ref && e.id === id) &&
    !M.level1.elements.some((e) => e.id === id) &&
    !hasOwn(resById.value, id)
  ) {
    const canon = vendoredCopyIndex.value.copyToCanonical.get(id);
    if (canon && canon !== id) {
      id = resolveAliasId(canon) ?? canon;
      p = parentOf.value.get(id);
    }
  }
  const name =
    (hasOwn(byId.value, id) ? byId.value[id]?.name : undefined) ||
    (hasOwn(resById.value, id) ? resById.value[id]?.title : undefined) ||
    id;
  if (p) {
    const lvl = levelForFocus(p);
    drillStack.value = lvl >= 5 ? drillStackFor(p) : [];
    goToLevel(lvl, {
      nextFocus: p,
      nextSel: id,
      targetCardId: id,
      inward: lvl >= currentLevel.value,
      hudLabel: `Level ${currentLevel.value} → Level ${lvl} · ${name}`,
      announcement: `Went to Level ${lvl}: ${name}.`,
    });
  } else if (M.level2.elements.some((e) => !e.ref && e.id === id)) {
    drillStack.value = [];
    goToLevel(2, {
      nextSel: id,
      targetCardId: id,
      inward: currentLevel.value < 2,
      hudLabel: `Level ${currentLevel.value} → Level 2 · ${name}`,
      announcement: `Went to Level 2: ${name}.`,
    });
  } else if (M.level1.elements.some((e) => e.id === id)) {
    drillStack.value = [];
    goToLevel(1, {
      nextSel: id,
      targetCardId: id,
      inward: false,
      hudLabel: `Level ${currentLevel.value} → Level 1 · ${name}`,
      announcement: `Went to Level 1: ${name}.`,
    });
  } else if (hasOwn(resById.value, id)) {
    drillStack.value = [];
    goToLevel(4, {
      nextSel: id,
      targetCardId: id,
      inward: true,
      hudLabel: `Level ${currentLevel.value} → Level 4 · ${name}`,
      announcement: `Went to Level 4: ${name}.`,
    });
  } else {
    return;
  }
  nextTick(() => {
    if (typeof document === "undefined") return;
    const focusTarget = selectedId.value ?? id;
    const active = document.activeElement;
    if (!active || active === document.body || mapRootRef.value?.contains(active)) {
      if (effectiveIsListView.value) {
        queryListCardById(mapRootRef.value, focusTarget)?.focus({ preventScroll: true });
      } else {
        queryCardById(stageRef.value, focusTarget)?.focus({ preventScroll: true });
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

async function hydrateLazySubgraph(
  id: string,
): Promise<{ sg: TuxMapSubgraph | null; cancelled: boolean }> {
  const resolver = props.resolveSubgraph;
  if (!resolver) return { sg: null, cancelled: true };
  const seq = ++resolveReqSeq;
  loadingSubgraphId.value = id;
  const el = hasOwn(byId.value, id) ? byId.value[id] : undefined;
  const dn = hasOwn(resById.value, id) ? resById.value[id] : undefined;
  const refKey = el?.subgraphRef || dn?.subgraphRef;
  const key = refKey || id;
  try {
    const sg = await resolver(key, props.modelRef);
    if (seq !== resolveReqSeq) return { sg: null, cancelled: true };
    loadingSubgraphId.value = null;
    // An answer from a resolver the map no longer has says nothing about the new one.
    const stale = props.resolveSubgraph !== resolver;
    let emptied: TuxMapValidationIssue | null = null;
    if (sg && Array.isArray(sg.elements) && sg.elements.length > 0) {
      const prevMap = resolvedSubgraphs.value;
      const knownIssues = new Set(modelBundle.value.validation.issues.map((i) => i.message));
      const nextMap: Record<string, TuxMapSubgraph> = Object.assign(Object.create(null), prevMap);
      setOwnProp(nextMap, key, toRaw(sg));
      resolvedSubgraphs.value = nextMap;
      if (!lacksLazySubgraph(id)) return { sg, cancelled: false };
      // Non-empty as returned, empty in the sanitized model (#156). Recorded by what was
      // returned, the card would be asked again by the zoom that follows, without end.
      const cause = modelBundle.value.validation.issues.find((i) => !knownIssues.has(i.message));
      resolvedSubgraphs.value = prevMap;
      const n = sg.elements.length;
      emptied = {
        code: "resolved-empty-subgraph",
        message:
          `Lazy subgraph "${key}" of "${id}" resolved with ${n} element${n === 1 ? "" : "s"}, none usable after sanitizing` +
          (cause ? `: ${cause.message}` : "."),
        nodeId: id,
        targetId: key,
      };
    }
    if (stale) return { sg: null, cancelled: false };
    const nextEmpty: Record<string, boolean> = Object.assign(
      Object.create(null),
      emptyResolvedSubgraphs.value,
    );
    setOwnProp(nextEmpty, id, true);
    emptyResolvedSubgraphs.value = nextEmpty;
    if (emptied) {
      const nextIssues: Record<string, TuxMapValidationIssue> = Object.assign(
        Object.create(null),
        sanitizedEmptySubgraphs.value,
      );
      setOwnProp(nextIssues, id, emptied);
      sanitizedEmptySubgraphs.value = nextIssues;
    }
    announce(`${getCardDisplayName(id)} has no level inside it.`);
    return { sg: null, cancelled: false };
  } catch {
    if (seq === resolveReqSeq) {
      loadingSubgraphId.value = null;
      announce(`Could not load details for ${getCardDisplayName(id)}.`);
    }
    return { sg: null, cancelled: true };
  }
}

async function resolveAndZoomIntoLazySubgraph(id: string) {
  const { sg, cancelled } = await hydrateLazySubgraph(id);
  if (!cancelled && sg) {
    zoomIntoElement(id);
  }
}

function zoomIntoElement(rawId: string) {
  const id = resolveAliasId(rawId) ?? rawId;
  if (hasLazySubgraphRef(id)) {
    void resolveAndZoomIntoLazySubgraph(id);
    return;
  }

  const e = byId.value[id];
  const dn = resById.value[id];
  const itemName = e?.name || dn?.title || id;

  // Fractal Subgraph Drill-Down (Level 3 component -> Level 5, Level 4 host -> Level 5, Level 5 -> Level 6+)
  if (currentLevel.value >= 3 && hasFractalSubgraph(id)) {
    const inCurrentView = isCurrentViewChild(id);
    const nextLvl = fractalZoomLevelFor(id);
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
      announcement: `Zoomed in to Level ${nextLvl}: ${sg?.stratum || itemName}.`,
    });
    return;
  }

  if (!e) return;

  if (currentLevel.value === 1) {
    if (!canZoomElement(e)) return;
    if (hasFractalSubgraph(id) && !(e.zoom === 2 || id === activeModel.value.level2.boundary)) {
      const nextLvl = Math.max(5, levelForFocus(id));
      drillStack.value = drillStackFor(id);
      const sg = getSubgraphForNode(id);
      emit("drill-down", { level: nextLvl, focusId: id, subgraph: sg });
      goToLevel(nextLvl, {
        nextFocus: id,
        nextSel: null,
        fromCardId: id,
        inward: true,
        hudLabel: `Level 1 → Level ${nextLvl} · ${e.name}`,
        announcement: `Zoomed in to Level ${nextLvl}: ${sg?.stratum || e.name}.`,
      });
      return;
    }
    const isBoundarySystem = id === activeModel.value.level2.boundary || e.zoom === 2;
    goToLevel(2, {
      nextFocus: focusId.value,
      nextSel: isBoundarySystem ? null : id,
      fromCardId: id,
      inward: true,
      hudLabel: `Level 1 → Level 2 · ${e.name}`,
      announcement: "Zoomed in to Level 2: containers and services.",
    });
    return;
  }

  if (currentLevel.value === 2) {
    if (!e.ref && (getLevel3Kids(activeModel.value, id)?.length ?? 0) > 0) {
      goToLevel(3, {
        nextFocus: id,
        nextSel: null,
        fromCardId: id,
        inward: true,
        hudLabel: `Level 2 → Level 3 · ${e.name}`,
        announcement: `Zoomed in to Level 3: internal components of ${e.name}.`,
      });
      return;
    }
    if (hasFractalSubgraph(id)) {
      const nextLvl = Math.max(5, levelForFocus(id));
      drillStack.value = drillStackFor(id);
      const sg = getSubgraphForNode(id);
      emit("drill-down", { level: nextLvl, focusId: id, subgraph: sg });
      goToLevel(nextLvl, {
        nextFocus: id,
        nextSel: null,
        fromCardId: id,
        inward: true,
        hudLabel: `Level 2 → Level ${nextLvl} · ${e.name}`,
        announcement: `Zoomed in to Level ${nextLvl}: ${sg?.stratum || e.name}.`,
      });
    }
    // Never fall back to Level 4 or jump to another sibling card when zooming a leaf (#116)
    return;
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
        announcement: `Zoomed out to Level ${prevEntry.level}.`,
      });
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
      announcement: `Zoomed out to Level ${targetLevel}.`,
    });
    return;
  }

  if (currentLevel.value === 4) {
    if (preInfraState.value) {
      const saved = preInfraState.value;
      preInfraState.value = null;
      drillStack.value = [...saved.drillStack];
      goToLevel(saved.level, {
        nextFocus: saved.focusId,
        nextSel: saved.selectedId,
        targetCardId: saved.selectedId ?? saved.focusId,
        inward: false,
        hudLabel: `Level 4 → Level ${saved.level}`,
        announcement: `Returned to Level ${saved.level}.`,
      });
      return;
    }
    const node = fromHoveredId
      ? resById.value[fromHoveredId]
      : selectedId.value
        ? resById.value[selectedId.value]
        : undefined;
    const hostedContainer = node?.hosts?.find(
      (cid) => (getLevel3Kids(activeModel.value, cid)?.length ?? 0) > 0,
    );
    const targetFocus = hostedContainer || focusId.value;
    if (targetFocus && (getLevel3Kids(activeModel.value, targetFocus)?.length ?? 0) > 0) {
      const cName = (hasOwn(byId.value, targetFocus) ? byId.value[targetFocus]?.name : undefined) ?? targetFocus;
      goToLevel(3, {
        nextFocus: targetFocus,
        nextSel: null,
        fromCardId: node?.id ?? null,
        inward: false,
        hudLabel: `Level 4 → Level 3 · ${cName}`,
        announcement: `Zoomed out to Level 3: ${cName}.`,
      });
    } else {
      goToLevel(2, {
        nextSel: null,
        fromCardId: node?.id ?? null,
        targetCardId: node?.hosts?.[0] ?? null,
        inward: false,
        hudLabel: "Level 4 → Level 2 · Containers & services",
        announcement: "Zoomed out to Level 2.",
      });
    }
  } else if (currentLevel.value === 3) {
    const f = focusId.value;
    const cName = f && hasOwn(byId.value, f) ? byId.value[f]!.name : "Containers";
    goToLevel(2, {
      nextFocus: f,
      nextSel: null,
      fromCardId: fromHoveredId ?? null,
      targetCardId: f,
      inward: false,
      hudLabel: `Level 3 → Level 2 · ${cName}`,
      announcement: "Zoomed out to Level 2.",
    });
  } else if (currentLevel.value === 2) {
    const sysId = activeModel.value.level2.boundary;
    const sysName = (hasOwn(byId.value, sysId) ? byId.value[sysId]?.name : undefined) ?? "System context";
    goToLevel(1, {
      nextSel: null,
      fromCardId: fromHoveredId ?? null,
      targetCardId: sysId,
      inward: false,
      hudLabel: `Level 2 → Level 1 · ${sysName}`,
      announcement: "Zoomed out to Level 1.",
    });
  }
}

function openLevel3FromToolbar() {
  const candidate =
    selectedId.value && (getLevel3Kids(activeModel.value, selectedId.value)?.length ?? 0) > 0
      ? selectedId.value
      : focusId.value;
  if (!candidate) return;
  goToLevel(3, {
    nextFocus: candidate,
    fromCardId: currentLevel.value === 2 ? candidate : null,
    inward: currentLevel.value < 3,
    announcement: `Zoomed in to Level 3: internal components of ${(hasOwn(byId.value, candidate) ? byId.value[candidate]?.name : undefined) || candidate}.`,
  });
}

const currentStratumShort = computed(() => {
  if (currentLevel.value === 1) return "Ecosystem";
  if (currentLevel.value === 2) return "Containers";
  if (currentLevel.value === 3) {
    return (focusId.value && hasOwn(byId.value, focusId.value) ? byId.value[focusId.value]?.name : undefined) || "Components";
  }
  if (currentLevel.value === 4) return "Infrastructure";
  return getSubgraphForNode(focusId.value)?.stratum || `Level ${currentLevel.value}`;
});

const stepInTargetId = computed<string | null>(() => {
  const sel = selectedId.value;
  if (sel) {
    const e = hasOwn(byId.value, sel) ? byId.value[sel] : undefined;
    const dn = hasOwn(resById.value, sel) ? resById.value[sel] : undefined;
    if ((e && canZoomElement(e)) || (dn && canZoomDeployNode(dn))) {
      return sel;
    }
  }
  if (currentLevel.value === 1) {
    const bId = activeModel.value.level2.boundary;
    if (bId && hasOwn(byId.value, bId) && canZoomElement(byId.value[bId]!)) {
      return bId;
    }
    const firstZoomableL1 = stageData.value.els.find((e) => canZoomElement(e));
    return firstZoomableL1?.id ?? null;
  }
  if (currentLevel.value === 2) {
    if (focusId.value && (getLevel3Kids(activeModel.value, focusId.value)?.length ?? 0) > 0) {
      return focusId.value;
    }
    const firstZoomableL2 = stageData.value.els.find((e) => !e.mini && canZoomElement(e));
    return firstZoomableL2?.id ?? null;
  }
  if (currentLevel.value === 3) {
    const fractalChild = stageData.value.els.find(
      (e) => !e.mini && (hasFractalSubgraph(e.id) || hasLazySubgraphRef(e.id)),
    );
    return fractalChild?.id ?? null;
  }
  if (currentLevel.value === 4) {
    const fractalDeploy = stageData.value.deployNodes.find(
      (n) => hasFractalSubgraph(n.id) || hasLazySubgraphRef(n.id),
    );
    return fractalDeploy?.id ?? null;
  }
  const deeperChild = stageData.value.els.find(
    (e) => !e.mini && (hasFractalSubgraph(e.id) || hasLazySubgraphRef(e.id)),
  );
  return deeperChild?.id ?? null;
});

const canStepIn = computed(() => Boolean(stepInTargetId.value));

// Where `+` goes, by number: from Level 3 it is Level 5, Level 4 being the Infrastructure view (#205)
const stepInTitle = computed<string>(() => {
  const target = stepInTargetId.value;
  if (!target) return "Zoom in a level (+)";
  const e = hasOwn(byId.value, target) ? byId.value[target] : undefined;
  let lvl = fractalZoomLevelFor(target);
  if (currentLevel.value === 1 && e && (e.zoom === 2 || target === activeModel.value.level2.boundary)) lvl = 2;
  else if (currentLevel.value === 2 && e && !e.ref && (getLevel3Kids(activeModel.value, target)?.length ?? 0) > 0) lvl = 3;
  return `Zoom in to Level ${lvl} (+)`;
});

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
    if (preInfraState.value) {
      const saved = preInfraState.value;
      preInfraState.value = null;
      drillStack.value = [...saved.drillStack];
      goToLevel(saved.level, {
        nextFocus: saved.focusId,
        nextSel: saved.selectedId,
        targetCardId: saved.selectedId ?? saved.focusId,
        inward: false,
        hudLabel: `Level 4 → Level ${saved.level}`,
        announcement: `Returned to Level ${saved.level}.`,
      });
    } else {
      zoomOutLevel();
    }
  } else {
    preInfraState.value = {
      level: currentLevel.value,
      focusId: focusId.value,
      drillStack: [...drillStack.value],
      selectedId: selectedId.value,
    };
    drillStack.value = [];
    goToLevel(4, {
      inward: true,
      keepPreInfra: true,
      hudLabel: `Level ${currentLevel.value} → Level 4 · Infrastructure`,
      announcement: "Level 4: Infrastructure.",
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

  // The wheel is a second input too, once the turn that changed the level is over: the rest of
  // that turn (a trackpad's inertia) is the same input, and must not end the travel it began
  const now = Date.now();
  if (now - lastWheelZoomAt >= 520) cancelTravel();

  const isPinchOrMod = ev.ctrlKey || ev.metaKey;
  // magnified, the wheel scrolls the diagram; a trackpad pinch (ctrl) still changes level
  if (isMagnified.value && !isPinchOrMod) return;
  if (!plainWheelZooms.value && !isPinchOrMod) {
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
        (!isZoomIn ? findNearestCardToPoint(pt.x, pt.y, Infinity, false, false) : null);
      lockedWheelCardId =
        closestMatch?.id ||
        (!isZoomIn
          ? proximityCard.value?.id || currentHoveredId || selectedId.value
          : null) ||
        null;
    }
  }

  const candidateId =
    lockedWheelCardId ||
    (!isZoomIn
      ? directCardId || proximityCard.value?.id || currentHoveredId || selectedId.value
      : null);
  const canZoomInCandidate =
    Boolean(candidateId && isCardIdZoomable(candidateId)) ||
    (currentLevel.value === 1 &&
      Boolean(
        activeModel.value.level2.boundary &&
          isCardIdZoomable(activeModel.value.level2.boundary),
      ));

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
  const still = prefersStill();
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
    }
    if (id && isCardIdZoomable(id)) {
      zoomIntoElement(id);
    }
  } else {
    zoomOutLevel(resolvedId);
  }
}

function jumpToSearchEntry(entry: TuxMapSearchEntry) {
  const rawTargetId = entry.revealId || entry.id;
  const targetId = resolveAliasId(rawTargetId) ?? rawTargetId;
  // An entry for something the model does not hold (a route whose handler no file here has) opens
  // nothing: the palette stays, and says so (#205)
  if (!canRevealElement(targetId) && !hasOwn(byId.value, targetId)) {
    announce(`${entry.name} is not on this map.`);
    return;
  }
  goToOpen.value = false;
  goToReturnFocusEl = null;

  const M = activeModel.value;
  if (parentOf.value.has(targetId) || vendoredCopyIndex.value.copyToCanonical.has(targetId)) {
    revealElement(targetId);
  } else if (M.level2.elements.some((e) => !e.ref && e.id === targetId)) {
    drillStack.value = [];
    goToLevel(2, {
      nextSel: targetId,
      targetCardId: targetId,
      inward: currentLevel.value < 2,
      hudLabel: `Level ${currentLevel.value} → Level 2 · ${entry.name}`,
      announcement: `Went to Level 2: ${entry.name}.`,
    });
  } else if (M.level1.elements.some((e) => e.id === targetId)) {
    drillStack.value = [];
    goToLevel(1, {
      nextSel: targetId,
      targetCardId: targetId,
      inward: false,
      hudLabel: `Level ${currentLevel.value} → Level 1 · ${entry.name}`,
      announcement: `Went to Level 1: ${entry.name}.`,
    });
  } else if (hasOwn(resById.value, targetId)) {
    drillStack.value = [];
    goToLevel(4, {
      nextSel: targetId,
      targetCardId: targetId,
      inward: true,
      hudLabel: `Level ${currentLevel.value} → Level 4 · ${entry.name}`,
      announcement: `Went to Level 4: ${entry.name}.`,
    });
  } else if (hasOwn(byId.value, targetId)) {
    selectElement(targetId);
  }

  nextTick(() => {
    nextTick(() => {
      const focusTarget = selectedId.value ?? targetId;
      if (effectiveIsListView.value) {
        queryListCardById(mapRootRef.value, focusTarget)?.focus({ preventScroll: true });
      } else {
        (queryCardById(stageRef.value, focusTarget) ?? viewportRef.value)?.focus({
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
  if (ev.key === "Tab") {
    const closeBtn = mapRootRef.value?.querySelector<HTMLElement>(".tux-map__goto-close") ?? null;
    const inputEl = goToInputRef.value;
    if (inputEl && closeBtn) {
      ev.preventDefault();
      if (document.activeElement === inputEl) {
        closeBtn.focus();
      } else {
        inputEl.focus();
      }
    }
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

let shortcutsReturnFocusEl: HTMLElement | null = null;
const shortcutsCloseBtnRef = ref<HTMLButtonElement | null>(null);
let wireReturnFocusEl: HTMLElement | null = null;
const wirePopCloseBtnRef = ref<HTMLButtonElement | null>(null);

function openShortcutsModal(triggerEl?: EventTarget | null) {
  if (triggerEl instanceof HTMLElement) {
    shortcutsReturnFocusEl = triggerEl;
  } else if (typeof document !== "undefined") {
    shortcutsReturnFocusEl = document.activeElement as HTMLElement | null;
  }
  shortcutsOpen.value = true;
  nextTick(() => {
    shortcutsCloseBtnRef.value?.focus({ preventScroll: true });
  });
}

function closeShortcutsModal(restoreFocus = true) {
  const prev = shortcutsReturnFocusEl;
  shortcutsReturnFocusEl = null;
  shortcutsOpen.value = false;
  if (restoreFocus && prev && typeof prev.focus === "function") {
    nextTick(() => prev.focus({ preventScroll: true }));
  }
}

function onShortcutsKeydown(ev: KeyboardEvent) {
  if (ev.key === "Escape") {
    ev.preventDefault();
    ev.stopPropagation();
    closeShortcutsModal(true);
    return;
  }
  if (ev.key === "Tab") {
    ev.preventDefault();
    shortcutsCloseBtnRef.value?.focus({ preventScroll: true });
  }
}

function toggleWireInspector(
  lbl: { from: string; to: string },
  triggerEl?: EventTarget | null,
) {
  const key = wirePairKey(lbl.from, lbl.to);
  if (inspectedWireKey.value === key) {
    closeWireInspector(true);
    return;
  }
  wireReturnFocusEl = (triggerEl as HTMLElement | null) ?? null;
  inspectedWireKey.value = key;
  nextTick(() => {
    wirePopCloseBtnRef.value?.focus({ preventScroll: true });
  });
}

function closeWireInspector(restoreFocus = false) {
  const prev = wireReturnFocusEl;
  wireReturnFocusEl = null;
  inspectedWireKey.value = null;
  if (restoreFocus && prev && typeof prev.focus === "function") {
    nextTick(() => prev.focus({ preventScroll: true }));
  }
}

function onWireInspectorKeydown(ev: KeyboardEvent) {
  if (ev.key === "Escape") {
    ev.preventDefault();
    ev.stopPropagation();
    closeWireInspector(true);
  }
}

function onMapRootKeydown(ev: KeyboardEvent) {
  if (
    ev.key === "Escape" &&
    loadingSubgraphId.value !== null &&
    !goToOpen.value &&
    !shortcutsOpen.value &&
    !inspectedWireKey.value
  ) {
    ev.preventDefault();
    cancelPendingSubgraphResolve();
    announce("Cancelled loading");
    return;
  }
  if ((ev.metaKey || ev.ctrlKey) && !ev.altKey && (ev.key === "k" || ev.key === "K")) {
    ev.preventDefault();
    ev.stopPropagation();
    if (goToOpen.value) closeGoToPalette(true);
    else openGoToPalette();
    return;
  }
  const inEditable =
    ev.target instanceof HTMLInputElement ||
    ev.target instanceof HTMLTextAreaElement ||
    ev.target instanceof HTMLSelectElement ||
    (ev.target instanceof HTMLElement && ev.target.isContentEditable);
  if (
    ev.key === "/" &&
    !goToOpen.value &&
    !shortcutsOpen.value &&
    !ev.metaKey &&
    !ev.ctrlKey &&
    !ev.altKey &&
    !inEditable
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    openGoToPalette();
    return;
  }
  if (
    ev.key === "?" &&
    !goToOpen.value &&
    !ev.metaKey &&
    !ev.ctrlKey &&
    !ev.altKey &&
    !inEditable
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    if (shortcutsOpen.value) closeShortcutsModal(true);
    else openShortcutsModal();
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

function moveRovingCardFocus(
  dir: "ArrowRight" | "ArrowLeft" | "ArrowDown" | "ArrowUp",
  target: EventTarget | null,
) {
  const items: { id: string; cx: number; cy: number }[] =
    currentLevel.value === 4
      ? stageData.value.deployNodes.map((n) => {
          const r = stageData.value.rects[n.id];
          return {
            id: n.id,
            cx: (r?.x ?? 0) + (r?.w ?? 210) / 2,
            cy: (r?.y ?? 0) + (r?.h ?? 92) / 2,
          };
        })
      : renderedCards.value.map((c) => {
          const r = stageData.value.rects[c.id];
          return {
            id: c.id,
            cx: (r?.x ?? 0) + (r?.w ?? 212) / 2,
            cy: (r?.y ?? 0) + (r?.h ?? 128) / 2,
          };
        });
  if (items.length === 0) return;

  const curId = cardIdOf(target) || activeRovingCardId.value || items[0]!.id;
  const curIdx = items.findIndex((it) => it.id === curId);
  if (curIdx < 0) {
    rovingCardId.value = items[0]!.id;
    nextTick(() => queryCardById(stageRef.value, items[0]!.id)?.focus());
    return;
  }
  const cur = items[curIdx]!;
  let bestId: string | null = null;
  let bestScore = Infinity;

  for (const cand of items) {
    if (cand.id === cur.id) continue;
    const dx = cand.cx - cur.cx;
    const dy = cand.cy - cur.cy;
    let score = Infinity;
    if (dir === "ArrowRight" && dx > 6) {
      score = dx + Math.abs(dy) * 1.6;
    } else if (dir === "ArrowLeft" && dx < -6) {
      score = -dx + Math.abs(dy) * 1.6;
    } else if (dir === "ArrowDown" && dy > 6) {
      score = dy + Math.abs(dx) * 1.6;
    } else if (dir === "ArrowUp" && dy < -6) {
      score = -dy + Math.abs(dx) * 1.6;
    }
    if (score < bestScore) {
      bestScore = score;
      bestId = cand.id;
    }
  }

  if (!bestId) {
    const step = dir === "ArrowRight" || dir === "ArrowDown" ? 1 : -1;
    bestId = items[(curIdx + step + items.length) % items.length]!.id;
  }

  rovingCardId.value = bestId;
  nextTick(() => {
    queryCardById(stageRef.value, bestId!)?.focus();
  });
}

function onStageKey(ev: KeyboardEvent) {
  if (
    ev.key === "ArrowRight" ||
    ev.key === "ArrowLeft" ||
    ev.key === "ArrowDown" ||
    ev.key === "ArrowUp"
  ) {
    const targetEl = ev.target as HTMLElement | null;
    if (targetEl?.closest?.(".tux-map__wire-pop")) return;
    ev.preventDefault();
    moveRovingCardFocus(ev.key, ev.target);
    return;
  }

  const onInteractiveChild = Boolean(
    (ev.target as Element | null)?.closest?.(".tux-map__el, .tux-map__el-zb, .tux-map__lab"),
  );

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
    toggleInfrastructureView();
  } else if (ev.key === "Escape") {
    if (loadingSubgraphId.value !== null) {
      ev.preventDefault();
      cancelPendingSubgraphResolve();
      announce("Cancelled loading.");
    } else if (inspectedWireKey.value !== null) {
      ev.preventDefault();
      closeWireInspector(true);
    } else if (localTraceTarget.value) {
      ev.preventDefault();
      setTraceTarget(null);
    } else if (selectedId.value) {
      selectElement(null);
    } else if (activeTool.value !== "select") {
      activeTool.value = "select";
    } else if (wheelArmed.value && currentLevel.value <= 1) {
      // nothing left for Escape to close or leave: it gives the wheel back to the page (#209)
      disarmWheel();
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
  } else if (!onInteractiveChild && (ev.key === "v" || ev.key === "V")) {
    activeTool.value = "select";
  } else if (!onInteractiveChild && props.annotations && (ev.key === "p" || ev.key === "P")) {
    activeTool.value = "pen";
  } else if (!onInteractiveChild && props.annotations && (ev.key === "l" || ev.key === "L")) {
    activeTool.value = "laser";
  } else if (!onInteractiveChild && props.annotations && (ev.key === "n" || ev.key === "N")) {
    activeTool.value = "note";
  }
}

// ============================================================================
// 5. BREADCRUMBS, OUTLINE RAIL, WIRE INSPECTOR, SUMMARY, PANEL & LIST VIEW
// ============================================================================

interface CrumbSiblingItem {
  id: string;
  label: string;
  level: TuxMapLevelNumber;
  active: boolean;
}

interface CrumbEntry {
  label: string;
  level: TuxMapLevelNumber;
  focusId?: string | null;
  current: boolean;
  siblings?: CrumbSiblingItem[];
}

function buildLevel3Siblings(activeFocusId: string | null | undefined): CrumbSiblingItem[] {
  const M = activeModel.value;
  const containers = M.level2.elements.filter(
    (e) =>
      !e.ref &&
      isShownStatus(e.status) &&
      ((getLevel3Kids(M, e.id)?.length ?? 0) > 0 || hasFractalSubgraph(e.id) || hasLazySubgraphRef(e.id)),
  );
  if (containers.length < 2) return [];
  return containers.map((e) => ({
    id: e.id,
    label: e.name || e.id,
    level: 3,
    active: e.id === activeFocusId,
  }));
}

function buildSubgraphSiblings(
  nodeId: string | null | undefined,
  lvl: TuxMapLevelNumber,
): CrumbSiblingItem[] {
  if (!nodeId) return [];
  const p = parentOf.value.get(nodeId);
  if (!p) return [];
  const M = activeModel.value;
  const rawSibs: TuxMapLevelElement[] =
    getLevel3Kids(M, p) || getSubgraphForNode(p)?.elements || [];
  const zoomableSibs = rawSibs.filter(
    (s) =>
      isShownStatus(s.status) &&
      (s.id === nodeId || hasFractalSubgraph(s.id) || hasLazySubgraphRef(s.id)),
  );
  if (zoomableSibs.length < 2) return [];
  return zoomableSibs.map((s) => ({
    id: s.id,
    label: s.name || s.id,
    level: lvl,
    active: s.id === nodeId,
  }));
}

const breadcrumbs = computed<CrumbEntry[]>(() => {
  const M = activeModel.value;
  const lookup = byId.value;
  const sysName = lookup[M.level2.boundary]?.name || "System";

  if (currentLevel.value === 1) {
    return [{ label: "Ecosystem", level: 1, current: true }];
  }
  if (currentLevel.value === 2) {
    return [
      { label: "Ecosystem", level: 1, current: false },
      { label: sysName, level: 2, current: true },
    ];
  }
  if (currentLevel.value === 3) {
    const fName = (focusId.value && lookup[focusId.value]?.name) || "Container";
    return [
      { label: "Ecosystem", level: 1, current: false },
      { label: sysName, level: 2, current: false },
      {
        label: fName,
        level: 3,
        focusId: focusId.value,
        current: true,
        siblings: buildLevel3Siblings(focusId.value),
      },
    ];
  }
  if (currentLevel.value === 4) {
    return [
      { label: "Ecosystem", level: 1, current: false },
      { label: sysName, level: 2, current: false },
      { label: "Infrastructure", level: 4, current: true },
    ];
  }

  // Fractal Level 5, Level 6+
  const crumbs: CrumbEntry[] = [
    { label: "Ecosystem", level: 1, current: false },
    { label: sysName, level: 2, current: false },
  ];

  for (const step of drillStack.value) {
    if (step.level === 4) {
      crumbs.push({ label: "Infrastructure", level: 4, current: false });
    } else if (step.level >= 3) {
      const sName =
        lookup[step.focusId]?.name ||
        resById.value[step.focusId]?.title ||
        step.focusId ||
        `Level ${step.level}`;
      crumbs.push({
        label: middleEllipsizeFolderName(sName, lookup[step.focusId]?.kind, step.focusId, 26),
        level: step.level,
        focusId: step.focusId,
        current: false,
        siblings:
          step.level === 3
            ? buildLevel3Siblings(step.focusId)
            : buildSubgraphSiblings(step.focusId, step.level),
      });
    }
  }

  const curRawName =
    (focusId.value && (lookup[focusId.value]?.name || resById.value[focusId.value]?.title)) ||
    getSubgraphForNode(focusId.value)?.stratum ||
    `Level ${currentLevel.value}`;
  crumbs.push({
    label: middleEllipsizeFolderName(
      curRawName,
      focusId.value ? lookup[focusId.value]?.kind : undefined,
      focusId.value ?? undefined,
      26,
    ),
    level: currentLevel.value,
    focusId: focusId.value,
    current: true,
    siblings: buildSubgraphSiblings(focusId.value, currentLevel.value),
  });
  return crumbs;
});

type DisplayedBreadcrumbItem =
  | { type: "crumb"; key: string; origIdx: number; crumb: CrumbEntry }
  | { type: "overflow"; key: string; hidden: { origIdx: number; crumb: CrumbEntry }[] };

const displayedBreadcrumbs = computed<DisplayedBreadcrumbItem[]>(() => {
  const all = breadcrumbs.value;
  if (containerWidth.value <= 520 && all.length > 4) {
    return [
      { type: "crumb", key: "crumb-0", origIdx: 0, crumb: all[0]! },
      {
        type: "overflow",
        key: "crumb-overflow",
        hidden: all.slice(1, all.length - 2).map((crumb, i) => ({
          origIdx: i + 1,
          crumb,
        })),
      },
      {
        type: "crumb",
        key: `crumb-${all.length - 2}`,
        origIdx: all.length - 2,
        crumb: all[all.length - 2]!,
      },
      {
        type: "crumb",
        key: `crumb-${all.length - 1}`,
        origIdx: all.length - 1,
        crumb: all[all.length - 1]!,
      },
    ];
  }
  return all.map((crumb, origIdx) => ({
    type: "crumb",
    key: `crumb-${origIdx}`,
    origIdx,
    crumb,
  }));
});

function navigateToBreadcrumb(origIdx: number, crumb: CrumbEntry) {
  openCrumbMenuIdx.value = null;
  openCrumbOverflow.value = false;
  drillStack.value = crumb.level < 5 ? [] : drillStack.value.slice(0, Math.max(0, origIdx - 2));
  goToLevel(crumb.level, {
    nextFocus: crumb.focusId ?? focusId.value,
    nextSel: null,
    inward: false,
  });
}

function onCrumbMenuKeydown(ev: KeyboardEvent, closeAndRestoreSelector?: string) {
  const wrap = (ev.currentTarget as HTMLElement | null)?.closest(".tux-map__crumb-menu-wrap, .tux-map__crumb-overflow-wrap");
  if (ev.key === "Escape") {
    ev.preventDefault();
    ev.stopPropagation();
    openCrumbMenuIdx.value = null;
    openCrumbOverflow.value = false;
    const trigger = closeAndRestoreSelector
      ? wrap?.querySelector<HTMLElement>(closeAndRestoreSelector)
      : wrap?.querySelector<HTMLElement>("button");
    nextTick(() => trigger?.focus({ preventScroll: true }));
    return;
  }
  if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
    const items = Array.from(
      wrap?.querySelectorAll<HTMLButtonElement>(".tux-map__crumb-menu-item") ?? [],
    );
    if (!items.length) return;
    ev.preventDefault();
    const cur = typeof document !== "undefined" ? (document.activeElement as HTMLButtonElement | null) : null;
    const idx = cur ? items.indexOf(cur) : -1;
    const step = ev.key === "ArrowDown" ? 1 : -1;
    const nextIdx = idx < 0 ? (step > 0 ? 0 : items.length - 1) : (idx + step + items.length) % items.length;
    items[nextIdx]?.focus({ preventScroll: true });
  }
}

function switchCrumbSibling(_crumbIdx: number, sib: CrumbSiblingItem) {
  openCrumbMenuIdx.value = null;
  openCrumbOverflow.value = false;
  if (sib.level === 3) {
    drillStack.value = [];
    goToLevel(3, {
      nextFocus: sib.id,
      nextSel: null,
      inward: currentLevel.value < 3,
    });
    return;
  }
  drillStack.value = drillStackFor(sib.id);
  const targetLvl = Math.max(5, levelForFocus(sib.id));
  goToLevel(targetLvl, {
    nextFocus: sib.id,
    nextSel: null,
    inward: targetLvl >= currentLevel.value,
  });
}

interface OutlineTreeRow {
  id: string;
  label: string;
  kindLabel: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  active: boolean;
}

const outlineRows = computed<OutlineTreeRow[]>(() => {
  if (!outlineOpen.value) return [];
  const M = activeModel.value;
  const activeChain = new Set<string>();
  if (focusId.value) {
    for (const a of mapAncestorsOf(focusId.value, parentOf.value)) activeChain.add(a);
  }
  if (selectedId.value) {
    for (const a of mapAncestorsOf(selectedId.value, parentOf.value)) activeChain.add(a);
  }
  const rows: OutlineTreeRow[] = [];
  const visited = new Set<string>();
  const getDirectChildren = (id: string): TuxMapLevelElement[] => {
    const l3 = getLevel3Kids(M, id);
    if (l3?.length) return l3.filter((x) => isShownStatus(x.status));
    const sg = getSubgraphForNode(id);
    if (sg?.elements.length) return sg.elements.filter((x) => isShownStatus(x.status));
    return [];
  };
  const visit = (el: TuxMapLevelElement, depth: number) => {
    if (depth > 16 || rows.length >= 400 || visited.has(el.id)) return;
    visited.add(el.id);
    const kids = getDirectChildren(el.id);
    const hasKids = kids.length > 0 || hasLazySubgraphRef(el.id);
    const explicitExp = hasOwn(expandedOutlineIds.value, el.id)
      ? expandedOutlineIds.value[el.id]
      : undefined;
    const isExpanded = Boolean(
      explicitExp ?? (activeChain.has(el.id) && kids.length > 0),
    );
    rows.push({
      id: el.id,
      label: middleEllipsizeFolderName(el.name || el.id, el.kind, el.id, 28),
      kindLabel: plainElementKindLabel(el),
      depth,
      hasChildren: hasKids,
      expanded: isExpanded,
      active: el.id === focusId.value || el.id === selectedId.value,
    });
    if (isExpanded && kids.length > 0) {
      for (const k of kids) visit(k, depth + 1);
    }
  };
  for (const c of M.level2.elements) {
    if (c.ref || !isShownStatus(c.status)) continue;
    visit(c, 0);
  }
  return rows;
});

async function toggleOutlineExpand(id: string) {
  const cur = outlineRows.value.find((r) => r.id === id)?.expanded ?? false;
  const nextExpanded: Record<string, boolean> = Object.assign(
    Object.create(null),
    expandedOutlineIds.value,
  );
  setOwnProp(nextExpanded, id, !cur);
  expandedOutlineIds.value = nextExpanded;
  if (!cur && hasLazySubgraphRef(id)) {
    const { sg, cancelled } = await hydrateLazySubgraph(id);
    if (!cancelled && !sg) {
      const reverted: Record<string, boolean> = Object.assign(
        Object.create(null),
        expandedOutlineIds.value,
      );
      setOwnProp(reverted, id, false);
      expandedOutlineIds.value = reverted;
    }
  }
}

function selectOutlineNode(row: OutlineTreeRow) {
  const M = activeModel.value;
  if (row.depth === 0 && (getLevel3Kids(M, row.id)?.length ?? 0) > 0) {
    drillStack.value = [];
    goToLevel(3, { nextFocus: row.id, nextSel: null, inward: true });
    return;
  }
  if (hasFractalSubgraph(row.id) || hasLazySubgraphRef(row.id)) {
    drillStack.value = drillStackFor(row.id);
    if (hasLazySubgraphRef(row.id)) {
      zoomIntoElement(row.id);
    } else {
      const lvl = Math.max(5, levelForFocus(row.id));
      goToLevel(lvl, { nextFocus: row.id, nextSel: null, inward: true });
    }
    return;
  }
  revealElement(row.id);
}

/** A relationship's status as the wire popover names it; `live` is the unremarkable case and is not shown */
const WIRE_STATUS_LABELS: Record<string, string> = { planned: "Planned", paused: "Paused", neighbor: "Neighbor" };

const inspectedWireDetail = computed(() => {
  const key = inspectedWireKey.value;
  if (!key) return null;
  const det = hasOwn(stageData.value.wireDetails, key) ? stageData.value.wireDetails[key] : undefined;
  if (!det) return null;
  const boundName =
    (focusId.value &&
      ((hasOwn(byId.value, focusId.value) ? byId.value[focusId.value]?.name : undefined) ||
        (hasOwn(resById.value, focusId.value) ? resById.value[focusId.value]?.title : undefined))) ||
    "Current boundary";
  const nameOf = (id: string) =>
    id === "@bound"
      ? boundName
      : (hasOwn(byId.value, id) ? byId.value[id]?.name : undefined) ||
        (hasOwn(resById.value, id) ? resById.value[id]?.title : undefined) ||
        id;
  const lbl = routedSvg.value.labels.find((l) => wirePairKey(l.from, l.to) === key);
  const scale = stageScale.value || 1;
  const outlineLeft =
    outlineOpen.value && containerWidth.value > 920 && !effectiveIsListView.value ? 236 : 0;
  const vpW = viewportWidth.value || 680;
  const vpH =
    viewportRef.value?.clientHeight ||
    Math.max(440, Math.ceil(stageData.value.height * fitScale.value));
  let popLeft = outlineLeft + 24;
  let popTop = 24;
  if (lbl) {
    const anchorX = outlineLeft + panX.value + (lbl.x + lbl.w / 2) * scale - viewportScrollLeft.value;
    const anchorBottomY = stageOffsetY.value + (lbl.y + lbl.h) * scale - viewportScrollTop.value;
    const anchorTopY = stageOffsetY.value + lbl.y * scale - viewportScrollTop.value;
    popLeft = Math.max(
      outlineLeft + 12,
      Math.min(outlineLeft + Math.max(12, vpW - 332), Math.round(anchorX - 160)),
    );
    popTop =
      anchorBottomY + 230 > vpH && anchorTopY > 180
        ? Math.max(12, Math.round(anchorTopY - 210))
        : Math.max(12, Math.round(anchorBottomY + 8));
  }

  const expandedSites: { key: string; kindLabel: string; at: string; href: string | null }[] = [];
  let totalSiteCount = 0;
  for (let idx = 0; idx < det.links.length; idx++) {
    const l = det.links[idx]!;
    const kind = l.kind || "uses";
    const kindLabel =
      (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) ? TUX_MAP_LINK_KIND_LABELS[kind] : undefined) || kind;
    const [atPath, atLineStr] = (l.at || "").split(/:(?=\d+$)/);
    const primaryLine = atLineStr ? Number(atLineStr) : undefined;
    if (atPath && l.sites && l.sites.length > 1) {
      for (const ln of l.sites) {
        totalSiteCount++;
        if (expandedSites.length < 24) {
          const lineValid = Number.isSafeInteger(ln) && ln > 0;
          const siteText = lineValid ? `${atPath}:${ln}` : atPath;
          const href = buildSourceHref({
            path: atPath,
            ...(lineValid ? { lineRange: [ln, ln] as [number, number] } : {}),
          });
          expandedSites.push({
            key: `${idx}-${l.from}-${l.to}-${siteText}`,
            kindLabel,
            at: siteText,
            href,
          });
        }
      }
    } else {
      totalSiteCount++;
      if (expandedSites.length < 24) {
        const href = atPath
          ? buildSourceHref({
              path: atPath,
              ...(primaryLine && Number.isSafeInteger(primaryLine) && primaryLine > 0
                ? { lineRange: [primaryLine, primaryLine] as [number, number] }
                : {}),
            })
          : null;
        expandedSites.push({
          key: `${idx}-${l.from}-${l.to}-${l.at || ""}`,
          kindLabel,
          at: l.at || `${nameOf(l.from)} → ${nameOf(l.to)}`,
          href,
        });
      }
    }
  }
  // What the model says of the relationship itself (#205): a Level 1 or Level 2 wire is a
  // relationship someone wrote, with no code links under it, and its popover had only a title.
  // A lifted wire's label is made from its link kinds, which the summary line already gives.
  const rel =
    stageData.value.rels.find((r) => r.from === det.from && r.to === det.to) ??
    stageData.value.expandableSides.flatMap((side) => side.wires).find((r) => r.from === det.from && r.to === det.to);
  const relLabel = rel?.label || lbl?.t1 || "";
  const relTech = rel?.tech || lbl?.t2 || "";
  const facts: { term: string; text: string; issues?: number[] }[] = [];
  if (relLabel && (det.links.length === 0 || relTech)) facts.push({ term: "Relationship", text: relLabel });
  if (relTech) facts.push({ term: "Over", text: relTech });
  if (rel?.status && hasOwn(WIRE_STATUS_LABELS, rel.status)) {
    facts.push({ term: "Status", text: WIRE_STATUS_LABELS[rel.status]! });
  }
  if (rel?.roadmap?.length) facts.push({ term: "Roadmap", text: "", issues: rel.roadmap });
  return {
    ...det,
    fromName: nameOf(det.from),
    toName: nameOf(det.to),
    facts,
    noCodeLine:
      det.links.length === 0 && det.violations.length === 0
        ? "The model lists no code references for this link."
        : "",
    summaryLine: det.perKindCounts.map((pk) => `${pk.label} ${pk.count}`).join(" · "),
    cutLine: det.cutKinds.map((ck) => `${ck.label} ${ck.count}`).join(", "),
    sites: expandedSites,
    moreSitesCount: Math.max(0, totalSiteCount - expandedSites.length),
    style: {
      left: `${popLeft}px`,
      top: `${popTop}px`,
    },
  };
});

const summaryText = computed(() => {
  const M = activeModel.value;
  if (currentLevel.value >= 5) {
    const sg = getSubgraphForNode(focusId.value);
    const parentName =
      (focusId.value &&
        (byId.value[focusId.value]?.name || resById.value[focusId.value]?.title)) ||
      "node";
    return (
      sg?.summary ||
      `Inside ${parentName} (${sg?.stratum || `Level ${currentLevel.value}`}): ${stageData.value.innerCardCount} ${stageData.value.innerCardCount === 1 ? "item" : "items"} in view.`
    );
  }
  if (currentLevel.value === 1) {
    return M.level1.summary || "Who uses the platform and the systems around it.";
  }
  if (currentLevel.value === 2) {
    return M.level2.summary || "What the platform is made of: each box runs or holds data.";
  }
  if (currentLevel.value === 3) {
    const cName =
      focusId.value && byId.value[focusId.value] ? byId.value[focusId.value]!.name : "container";
    return `Inside ${cName}: ${stageData.value.innerCardCount} internal ${stageData.value.innerCardCount === 1 ? "component" : "components"}, with callers on the left and dependencies on the right.`;
  }
  return M.level4.summary || "Where it all runs: resource groups, VMs, storage, and firewall rules.";
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

const selectedInheritedHosts = computed<string[]>(() => {
  if (!selectedLevelElement.value) return [];
  return effectiveDeployedHostIds(selectedLevelElement.value.id);
});

const selectedSplittableParts = computed<number>(() => {
  const id = selectedId.value;
  if (!id) return 0;
  const meta = stageData.value.outsideMetaById[id];
  const parts = meta?.parts ?? 0;
  if (!meta?.splittable || parts <= 1) return 0;
  return parts;
});

const selectedSplitParent = computed<{ id: string; name: string } | null>(() => {
  const id = selectedId.value;
  if (!id || effectiveSplitSet.value.size === 0 || effectiveSplitSet.value.has(id)) return null;
  for (const anc of mapAncestorsOf(id, parentOf.value).slice(1)) {
    if (effectiveSplitSet.value.has(anc)) {
      const name =
        (hasOwn(byId.value, anc) ? byId.value[anc]?.name : undefined) ||
        (hasOwn(resById.value, anc) ? resById.value[anc]?.title : undefined) ||
        anc;
      return { id: anc, name };
    }
  }
  return null;
});

interface VendoredPanelEntry {
  id: string;
  label: string;
  canReveal: boolean;
  href: string | null;
}

const selectedVendoredInfo = computed<{
  canonical: VendoredPanelEntry | null;
  copies: VendoredPanelEntry[];
} | null>(() => {
  const el = selectedLevelElement.value;
  if (!el) return null;
  const stageEl = stageData.value.els.find((x) => x.id === el.id);
  const idx = vendoredCopyIndex.value;
  const toEntry = (cid: string): VendoredPanelEntry => {
    const target = hasOwn(byId.value, cid) ? byId.value[cid] : undefined;
    const label = target?.source?.path || target?.name || stripNodeKindPrefix(cid);
    const href = target?.source
      ? buildSourceHref(target.source)
      : isKindNodeId(cid, "f")
        ? buildSourceHref({ path: splitNodeId(cid).rest })
        : null;
    return {
      id: cid,
      label,
      canReveal: canRevealElement(cid),
      href,
    };
  };

  const canonId = stageEl?.vendoredFrom || idx.copyToCanonical.get(el.id) || null;
  const canonical = canonId && canonId !== el.id ? toEntry(canonId) : null;

  const copySet = new Set<string>();
  for (const cid of stageEl?.vendoredCopies ?? []) {
    if (cid !== el.id) copySet.add(cid);
  }
  for (const cid of idx.copiesByCanonical.get(el.id) ?? []) {
    if (cid !== el.id) copySet.add(cid);
  }
  if (canonId && canonId !== el.id) {
    for (const cid of idx.copiesByCanonical.get(canonId) ?? []) {
      if (cid !== el.id) copySet.add(cid);
    }
  }
  const copies = [...copySet].sort(cmpCodepoint).map(toEntry);
  if (!canonical && copies.length === 0) return null;
  return { canonical, copies };
});

const zoomableCards = computed(() => renderedCards.value.filter((c) => c.zoomable));

const zoomableDeployNodes = computed(() =>
  stageData.value.deployNodes
    .filter((n) => canZoomDeployNode(n))
    .map((n) => {
      const r = stageData.value.rects[n.id];
      return {
        id: n.id,
        style: {
          left: `${(r?.x ?? 0) + (r?.w ?? 210) - 28}px`,
          top: `${(r?.y ?? 0) + 6}px`,
        },
      };
    }),
);

const selectedUsedByRels = computed(() => {
  if (!selectedId.value || currentLevel.value === 4) return [];
  const key = currentLevel.value === 3 && selectedId.value === focusId.value ? "@bound" : selectedId.value;
  return stageData.value.listRels
    .filter((r) => r.to === key && r.label && byId.value[r.from])
    .map((r) => ({ rel: r, other: byId.value[r.from]! }));
});

const selectedUsesRels = computed(() => {
  if (!selectedId.value || currentLevel.value === 4) return [];
  const key = currentLevel.value === 3 && selectedId.value === focusId.value ? "@bound" : selectedId.value;
  return stageData.value.listRels
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
  vpScroll = null;
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
  // Level 4 draws its wires from level4.links; other levels use listRels (preserving full per-card links)
  const rels: { from: string; to: string; label?: string; status?: string }[] =
    currentLevel.value === 4
      ? activeModel.value.level4.links.filter((l) => showPlanned.value || l.state !== "planned")
      : S.listRels;
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
  const innerGroupTitle =
    currentLevel.value >= 5
      ? getSubgraphForNode(focusId.value)?.stratum ||
        (focusId.value && byId.value[focusId.value]
          ? `Inside ${byId.value[focusId.value]!.name}`
          : `Level ${currentLevel.value} Items`)
      : currentLevel.value === 3 && focusId.value && byId.value[focusId.value]
        ? `Components of ${byId.value[focusId.value]!.name}`
        : currentLevel.value === 2
          ? "Containers & Services"
          : "Primary Systems";
  return [
    {
      title: "People & Actors",
      els: els.filter((e) => e.kind === "person"),
      deployNodes: [] as TuxMapDeploymentNode[],
    },
    {
      title: innerGroupTitle,
      els: els.filter((e) => e.kind !== "person" && e.kind !== "external" && !e.side),
      deployNodes: [] as TuxMapDeploymentNode[],
    },
    {
      title:
        currentLevel.value >= 5
          ? "Callers & Dependencies Outside This View"
          : "Connected & External Systems",
      els: els.filter((e) => e.kind === "external" || (e.side && e.kind !== "person")),
      deployNodes: [] as TuxMapDeploymentNode[],
    },
  ].filter((g) => g.els.length > 0);
});

// ============================================================================
// 6. LIGHTWEIGHT ON-DEMAND ANNOTATION TOOLS (PEN, LASER, STICKY NOTES)
// ============================================================================

const activeTool = ref<TuxMapTool>("select");
watch(
  () => props.annotations,
  (enabled) => {
    if (!enabled && activeTool.value !== "select") {
      activeTool.value = "select";
    }
  },
);
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
  if (!viewportRef.value) return { x: 0, y: 0 };
  const [ox, oy] = viewportOrigin();
  const s = stageScale.value || 1;
  return {
    x: Math.round((clientX - ox! - panX.value) / s),
    y: Math.round((clientY - oy! - stageOffsetY.value) / s),
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
  if (e.button !== 0 || isWheelVeil(e.target)) return;
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

  // A mouse on the background may be the start of a drag: what a press there does is decided
  // when it ends (a click clears the selection, as before) or once it has moved (#205)
  if (isStagePanPointer(e) && isStageBackground(target)) {
    const vp = viewportRef.value;
    stageDrag = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      scrollLeft: vp?.scrollLeft ?? 0,
      scrollTop: vp?.scrollTop ?? 0,
      moved: false,
    };
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

// Drag-to-pan (#205). A mouse pressed on the stage's background and moved scrolls the viewport
// with it. It moves what the scrollbars move, so there is something to drag only where the
// diagram is larger than its viewport: magnified, or under a fixed `height`. A finger and a pen
// are left to the browser, which already scrolls and pinches with them.
const STAGE_DRAG_SLOP = 4;
const isDraggingStage = ref<boolean>(false);

// The trailing cursor (#208): the disc is the visible form of `proximityCard`
const mapCursor = useTuxMapCursor({
  on: () => props.cursor && activeTool.value === "select" && !wheelVeilShown.value,
  // a level centred lower in the viewport (#261) is drawn that much further down
  card: computed(() => {
    const c = proximityCard.value;
    return c && stageOffsetY.value ? { ...c, y: c.y + stageOffsetY.value / (stageScale.value || 1) } : c;
  }),
  scale: stageScale,
  pan: panX,
  drag: isDraggingStage,
  origin: viewportOrigin,
});
const { el: cursorRef, on: cursorOn, shown: cursorShown } = mapCursor;
let stageDrag: {
  pointerId: number;
  x: number;
  y: number;
  scrollLeft: number;
  scrollTop: number;
  moved: boolean;
} | null = null;

function isStagePanPointer(e: PointerEvent): boolean {
  return activeTool.value === "select" && e.pointerType !== "touch" && e.pointerType !== "pen";
}

/** Nothing under the pointer that a press belongs to: a card, its `+`, a wire label, a note, a control. */
function isStageBackground(target: Element | null): boolean {
  if (!target || !viewportRef.value?.contains(target)) return false;
  // cards, their `+`, wire labels and the veil are all buttons
  return !target.closest?.("button, a, input, textarea, select, .tux-map__note");
}

/** Follows a press on the background. True while it is a drag, so the caller does nothing else with the move. */
function moveStageDrag(e: PointerEvent): boolean {
  const drag = stageDrag;
  if (!drag || e.pointerId !== drag.pointerId) return false;
  // the button came up where the map did not hear it
  if (e.buttons !== undefined && (e.buttons & 1) === 0) {
    endStageDrag(e, true);
    return false;
  }
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  if (!drag.moved) {
    if (Math.hypot(dx, dy) < STAGE_DRAG_SLOP) return false;
    drag.moved = true;
    isDraggingStage.value = true;
    try {
      viewportRef.value?.setPointerCapture?.(e.pointerId);
    } catch {
      // a pointer that is already gone cannot be captured: the drag still follows the moves it gets
    }
  }
  e.preventDefault();
  const vp = viewportRef.value;
  if (vp) scrollViewport(vp, drag.scrollLeft - dx, drag.scrollTop - dy);
  return true;
}

/** Ends a press on the background. One that did not move was a click, and clears the selection. */
function endStageDrag(e: PointerEvent, cancelled = false) {
  const drag = stageDrag;
  if (!drag || e.pointerId !== drag.pointerId) return;
  stageDrag = null;
  isDraggingStage.value = false;
  if (!drag.moved && !cancelled && selectedId.value) selectElement(null);
}

const minimapRef = ref<InstanceType<typeof TuxArchitectureMapMinimap> | null>(null);

function onViewportPointerLeave() {
  vpBox = null;
  mapCursor.leave();
}

function onStagePointerMove(e: PointerEvent) {
  lastPointerClient = { x: e.clientX, y: e.clientY };
  if (moveStageDrag(e)) return mapCursor.move(e);
  if (isWheelVeil(e.target)) return;
  // the overview is over the canvas and lets the pointer through until it is inside its box (#228)
  if (minimapRef.value) {
    const [bx, by] = viewportBox();
    minimapRef.value.pointerAt(e.clientX - bx!, e.clientY - by!);
  }
  const pt = getStageCoords(e);

  if (
    activeTool.value === "select" &&
    !draggingNoteId.value &&
    activePenPoints.value.length === 0
  ) {
    updateProximityAtStagePoint(pt.x, pt.y);
    mapCursor.move(e);
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
  endStageDrag(e, e.type === "pointercancel");
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

const SAFE_STROKE_COLOR_RE =
  /^(?:#[0-9a-fA-F]{3,8}|var\(--[a-zA-Z0-9_-]+\)|(?:rgb|hsl)a?\([0-9.,%\s/]+\)|[a-zA-Z]{3,24})$/;

function sanitizeStrokeColor(raw: string | undefined): string {
  if (!raw || typeof raw !== "string") return "var(--brand-primary)";
  const trimmed = raw.trim();
  return SAFE_STROKE_COLOR_RE.test(trimmed) ? trimmed : "var(--brand-primary)";
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

function stripUrlQueryAndHash(url: string): string {
  return url.split(/[?#]/)[0]!.replace(/\/+$/, "");
}

function buildIssueHref(issueNum: number): string | null {
  if (typeof issueNum !== "number" || !Number.isSafeInteger(issueNum) || issueNum <= 0) {
    return null;
  }
  const base = safeHref(activeModel.value.issueBaseUrl);
  if (!base) return null;
  const cleanBase = stripUrlQueryAndHash(base);
  if (!cleanBase) return null;
  return `${cleanBase}/${issueNum}`;
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
    try {
      const baseUrl = base ? new URL(base, DUMMY_HREF_BASE) : null;
      const targetUrl = new URL(direct, baseUrl ?? DUMMY_HREF_BASE);
      if (baseUrl && baseUrl.origin !== "https://tux-map.invalid") {
        if (targetUrl.origin !== baseUrl.origin) return null;
      } else if (targetUrl.origin !== "https://tux-map.invalid") {
        // When `sourceBaseUrl` is omitted or relative, reject external absolute origins
        const docOrigin =
          typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null"
            ? window.location.origin
            : null;
        if (!docOrigin || targetUrl.origin !== docOrigin) return null;
      }
    } catch {
      return null;
    }
    return direct;
  }
  const base = safeHref(activeModel.value.sourceBaseUrl);
  if (!base) return null;
  const cleanBase = stripUrlQueryAndHash(base);
  if (!cleanBase) return null;
  // Normalize slashes and reject empty, '.', or '..' path traversal segments
  const norm = src.path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!norm) return null;
  const segs = norm.split("/");
  if (segs.some((seg) => !seg || seg === "." || seg === "..")) return null;
  const cleanPath = segs.map(encodeURIComponent).join("/");
  const validRange =
    Array.isArray(src.lineRange) &&
    src.lineRange.length >= 2 &&
    Number.isSafeInteger(src.lineRange[0]) &&
    src.lineRange[0] > 0 &&
    Number.isSafeInteger(src.lineRange[1]) &&
    src.lineRange[1] >= src.lineRange[0];
  const lineHash = validRange
    ? src.lineRange![0] === src.lineRange![1]
      ? `#L${src.lineRange![0]}`
      : `#L${src.lineRange![0]}-L${src.lineRange![1]}`
    : "";
  return `${cleanBase}/${cleanPath}${lineHash}`;
}
</script>

<template>
  <figure
    ref="mapRootRef"
    class="tux-map"
    @keydown="onMapRootKeydown"
    @focusin="onMapFocusIn"
    @focusout="onMapFocusOut"
    @pointerenter="onMapPointerEnter"
    @pointerleave="onMapPointerLeave"
    @keydown.capture="cancelTravel"
    @pointerdown.capture="cancelTravel"
    @click.capture="onMapClickCapture"
    @dblclick.capture="onMapDblClickCapture"
  >
    <!-- Header Bar -->
    <div v-if="eyebrow || title" class="tux-map__header">
      <div>
        <p v-if="eyebrow" class="tux-map__eyebrow">{{ eyebrow }}</p>
        <h3 v-if="title" class="tux-map__title">{{ title }}</h3>
      </div>
      <div class="tux-map__level-pill">
        <span class="tux-map__level-dot" />
        <span class="tux-map__level-text">Level {{ currentLevel }} of {{ maxAvailableLevel }}</span>
      </div>
    </div>

    <div
      v-if="modelValidationSummary"
      class="tux-map__diag-note"
      role="note"
      data-map-diagnostic="true"
    >
      {{ modelValidationSummary }}
    </div>

    <!-- Sticky Desktop Chrome: Regrouped Toolbar + Breadcrumbs + Wire Filter Bar (#125, #118) -->
    <div class="tux-map__chrome">
      <div class="tux-map__tools" role="toolbar" aria-label="Architecture map controls">
        <div class="tux-map__stepper" role="group" aria-label="Semantic zoom level">
          <button
            type="button"
            class="tux-map__iconbtn"
            :disabled="currentLevel === 1"
            aria-label="Zoom out a level"
            title="Zoom out a level (−)"
            @click="zoomOutLevel()"
          >
            −
          </button>
          <div class="tux-map__stepper-stratum">
            <span class="tux-map__stepper-lvl">L{{ currentLevel }}</span>
            <span class="tux-map__stepper-name" :title="currentStratumShort">{{ currentStratumShort }}</span>
          </div>
          <button
            type="button"
            class="tux-map__iconbtn"
            :disabled="!canStepIn"
            aria-label="Zoom in on the chosen element"
            :title="stepInTitle"
            @click="stepInLevel()"
          >
            +
          </button>
        </div>

        <!-- Collapsible Outline Tree Rail Toggle (#125) -->
        <div class="tux-map__seg" role="group" aria-label="Wayfinding outline">
          <button
            type="button"
            class="tux-map__outline-toggle"
            :aria-pressed="outlineOpen"
            title="Toggle collapsible architecture outline rail"
            @click="outlineOpen = !outlineOpen"
          >
            <Icon name="lucide:list-tree" aria-hidden="true" />
            <span>Outline</span>
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

        <!-- Narrow-Screen Overflow Menu Trigger + Secondary View Controls (#125) -->
        <div class="tux-map__more-wrap" @keydown.escape.stop="moreMenuOpen = false">
          <button
            type="button"
            class="tux-map__more-btn"
            :aria-expanded="moreMenuOpen"
            aria-label="More view options"
            @click="moreMenuOpen = !moreMenuOpen"
          >
            <span>More</span>
          </button>
          <div
            ref="moreMenuRef"
            class="tux-map__more-inline"
            :class="{ 'tux-map__more-inline--open': moreMenuOpen }"
          >
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
              aria-label="Blast radius intent: the kind of change it is lit for"
              :aria-describedby="blastIntentKeyId"
              :title="`${blastIntentDef.description} ${blastIntentRule}`"
            >
              <option v-for="d in TUX_MAP_BLAST_INTENTS" :key="d.id" :value="d.id" :title="d.description">
                Intent: {{ d.label }}
              </option>
            </select>

            <!-- Lightweight Annotation Tools (opt-in via `annotations` prop, #125) -->
            <div
              v-if="props.annotations"
              class="tux-map__seg"
              role="group"
              aria-label="Annotation tools"
            >
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
          </div>
        </div>

        <!-- Magnify (#106): past fitting the width, the diagram scrolls. Last of the leading controls:
             the list view has no magnify, and nothing after it moves when it goes (#205) -->
        <div
          v-if="!effectiveIsListView"
          class="tux-map__stepper tux-map__magnify"
          role="group"
          aria-label="Magnify the diagram"
        >
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
            :aria-label="
              isMagnified
                ? `Fit the diagram to the width (now ${magnifyLabel} of the fitted size)`
                : 'The diagram fits the width'
            "
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
            title="Larger: then scroll, swipe or drag the background to move around it"
            @click="magnifyBy(1)"
          >
            A+
          </button>
        </div>
        <!-- The list view has nothing to magnify. The group's width stays, empty, so the row
             breaks where it does in the diagram view (#205) -->
        <span v-else class="tux-map__magnify-gap" aria-hidden="true" />

        <!-- The trailing controls wrap as one group, in one order, at every level and in both views (#205) -->
        <div class="tux-map__tools-end">
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

          <!-- The switch and the help button stay together: `?` never wraps alone (#205) -->
          <div class="tux-map__tools-pair">
            <!-- Diagram / List View Switch -->
            <div class="tux-map__seg" role="group" aria-label="Display mode">
              <button
                type="button"
                :aria-pressed="!effectiveIsListView"
                @click="setExplicitViewMode('diagram')"
              >
                Diagram
              </button>
              <button
                type="button"
                :aria-pressed="effectiveIsListView"
                @click="setExplicitViewMode('list')"
              >
                List
              </button>
            </div>

            <!-- Keyboard Shortcuts Help Trigger (#117) -->
            <button
              type="button"
              class="tux-map__iconbtn tux-map__shortcuts-btn"
              aria-haspopup="dialog"
              :aria-expanded="shortcutsOpen"
              aria-label="Keyboard shortcuts (?)"
              title="Keyboard shortcuts (?)"
              @click="shortcutsOpen ? closeShortcutsModal(true) : openShortcutsModal($event.currentTarget)"
            >
              ?
            </button>
          </div>
        </div>
      </div>

      <!-- Breadcrumb Trail with Sibling Switcher Dropdowns & Narrow Overflow Collapse (#116, #125) -->
      <div class="tux-map__subbar">
        <nav aria-label="Architecture level breadcrumb">
          <ol class="tux-map__crumbs">
            <li v-for="item in displayedBreadcrumbs" :key="item.key">
              <div v-if="item.type === 'overflow'" class="tux-map__crumb-overflow-wrap">
                <button
                  type="button"
                  class="tux-map__crumb-btn tux-map__crumb-overflow-btn"
                  :aria-expanded="openCrumbOverflow"
                  aria-label="Intermediate breadcrumb levels"
                  title="Show intermediate levels"
                  @click.stop="openCrumbOverflow = !openCrumbOverflow"
                  @keydown="onCrumbMenuKeydown($event, '.tux-map__crumb-overflow-btn')"
                >
                  …
                </button>
                <ul
                  v-if="openCrumbOverflow"
                  class="tux-map__crumb-menu"
                  aria-label="Intermediate architecture levels"
                  @keydown="onCrumbMenuKeydown($event, '.tux-map__crumb-overflow-btn')"
                >
                  <li v-for="hid in item.hidden" :key="hid.origIdx">
                    <button
                      type="button"
                      class="tux-map__crumb-menu-item"
                      @click="navigateToBreadcrumb(hid.origIdx, hid.crumb)"
                    >
                      {{ hid.crumb.label }}
                    </button>
                  </li>
                </ul>
              </div>
              <template v-else>
                <span v-if="item.crumb.current" class="tux-map__crumb-cur" aria-current="page">{{
                  item.crumb.label
                }}</span>
                <button
                  v-else
                  type="button"
                  class="tux-map__crumb-btn"
                  @click="navigateToBreadcrumb(item.origIdx, item.crumb)"
                >
                  {{ item.crumb.label }}
                </button>
                <div
                  v-if="item.crumb.siblings && item.crumb.siblings.length > 1"
                  class="tux-map__crumb-menu-wrap"
                >
                  <button
                    type="button"
                    class="tux-map__crumb-sib-btn"
                    :aria-expanded="openCrumbMenuIdx === item.origIdx"
                    :aria-label="`Switch sibling for ${item.crumb.label}`"
                    title="Switch to a sibling at this level"
                    @click.stop="
                      openCrumbMenuIdx = openCrumbMenuIdx === item.origIdx ? null : item.origIdx
                    "
                    @keydown="onCrumbMenuKeydown($event, '.tux-map__crumb-sib-btn')"
                  >
                    ▾
                  </button>
                  <ul
                    v-if="openCrumbMenuIdx === item.origIdx"
                    class="tux-map__crumb-menu"
                    :aria-label="`Siblings of ${item.crumb.label}`"
                    @keydown="onCrumbMenuKeydown($event, '.tux-map__crumb-sib-btn')"
                  >
                    <li v-for="sib in item.crumb.siblings" :key="sib.id">
                      <button
                        type="button"
                        class="tux-map__crumb-menu-item"
                        :aria-current="sib.active ? 'true' : undefined"
                        @click="switchCrumbSibling(item.origIdx, sib)"
                      >
                        {{ sib.label }}
                      </button>
                    </li>
                  </ul>
                </div>
              </template>
            </li>
          </ol>
        </nav>

        <!-- Wire Dependency Category Filter Bar + Split Reset at Levels 2, 3, and 5+ (#118) -->
        <div
          v-if="currentLevel === 2 || currentLevel === 3 || currentLevel >= 5"
          class="tux-map__wire-filters"
          role="group"
          aria-label="Wire dependency categories"
        >
          <button
            v-if="effectiveSplitSet.size > 0"
            type="button"
            class="tux-map__wire-filter-btn tux-map__fold-split-btn"
            title="Fold all expanded outside cards back to their rolled-up owners"
            @click="clearSplitCards"
          >
            Fold split ({{ effectiveSplitSet.size }})
          </button>
          <span class="tux-map__wire-filters-lbl">Wires:</span>
          <button
            v-for="cat in [
              { id: 'prod' as const, label: 'Prod' },
              { id: 'tests' as const, label: 'Tests' },
              { id: 'ci' as const, label: 'CI' },
              { id: 'docs' as const, label: 'Docs' },
            ]"
            :key="cat.id"
            type="button"
            class="tux-map__wire-filter-btn"
            :data-wire-filter="cat.id"
            :aria-pressed="activeWireCategoriesSet.has(cat.id)"
            @click="toggleWireCategory(cat.id)"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <p class="tux-map__hint">{{ wheelVeilHint }}{{ hintText }}</p>
    <p class="tux-map__summary">{{ summaryText }}</p>

    <!-- Visual Key Legend: On-Screen Element & Link Kinds Only (#115, #123) -->
    <ul v-if="!effectiveIsListView" class="tux-map__legend" aria-label="Diagram key">
      <template v-if="currentLevel === 4">
        <li v-if="legendFlags.hasResource">
          <i class="tux-map__swatch tux-map__swatch--card" /> Resource
        </li>
        <li v-if="legendFlags.hasRegion">
          <i class="tux-map__swatch tux-map__swatch--region" /> Region or resource group
        </li>
        <li v-if="legendFlags.hasPlanned">
          <i class="tux-map__swatch tux-map__swatch--planned" /> Planned
        </li>
      </template>
      <template v-else>
        <li v-if="legendFlags.hasPerson">
          <i class="tux-map__swatch tux-map__swatch--person" /> Person
        </li>
        <li v-if="legendFlags.hasSystem">
          <i class="tux-map__swatch tux-map__swatch--system" /> Primary system
        </li>
        <li v-if="legendFlags.hasCard">
          <i class="tux-map__swatch tux-map__swatch--card" /> Container / component / module
        </li>
        <li v-if="legendFlags.hasRoute">
          <i class="tux-map__swatch tux-map__swatch--route" /> HTTP route
        </li>
        <li v-if="legendFlags.hasExternal">
          <i class="tux-map__swatch tux-map__swatch--external" /> External system
        </li>
        <li v-if="legendFlags.hasPlanned">
          <i class="tux-map__swatch tux-map__swatch--planned" /> Planned
        </li>
      </template>
      <template v-if="showBlastRadius">
        <li>
          <!-- "Selected" is drawn as the selected card is, "PR Modified" as a changed one (#205) -->
          <i
            class="tux-map__swatch"
            :class="blastKeyOfSelection ? 'tux-map__swatch--selected' : 'tux-map__swatch--diff-direct'"
          />
          {{ blastKeyOfSelection ? "Selected" : "PR Modified" }}
        </li>
        <li>
          <i class="tux-map__swatch tux-map__swatch--diff-impact" />
          {{ blastKeyOfSelection ? "Depends on selection" : "Blast-Radius Impacted" }}
        </li>
        <li v-if="blastFade">
          <i class="tux-map__swatch tux-map__swatch--card tux-map__swatch--faded" />
          Not in the blast radius
        </li>
      </template>
      <li v-if="legendFlags.hasGenericWires">
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
      <li v-if="legendFlags.hasViolation" data-link-violation="true">
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path
            d="M0,4 L28,4"
            stroke="var(--status-critical)"
            stroke-width="2.8"
            stroke-dasharray="2 4"
          />
        </svg>
        ⚠ Rule violation
      </li>
      <li v-if="legendFlags.hasPlanned">
        <svg aria-hidden="true" viewBox="0 0 28 8">
          <path d="M0,4 L28,4" stroke="var(--text-muted)" stroke-width="1.6" stroke-dasharray="6 5" />
        </svg>
        Planned link
      </li>
    </ul>
    <p v-if="blastFade" class="tux-map__blast-note">{{ blastFade.text }}</p>
    <!-- The intent's definition and what it changes here (#259); the intent select is described by it -->
    <p v-if="showBlastRadius" :id="blastIntentKeyId" class="tux-map__blast-intent" data-blast-intent-key>
      <strong>Intent: {{ blastIntentDef.label }}.</strong> {{ blastIntentDef.description }} {{ blastIntentRule }}
      <strong v-if="blastIntentVsGeneral" role="status" data-blast-intent-vs>{{
        blastIntentVsGeneral.same
          ? `Same cards as General on this view: nothing here that ${blastIntentDef.label} skips or stops at changes what is lit.`
          : `${blastIntentDef.label} lights ${blastIntentVsGeneral.n} card${blastIntentVsGeneral.n === 1 ? "" : "s"} here; General lights ${blastIntentVsGeneral.general}.`
      }}</strong>
    </p>
    <div v-if="!effectiveIsListView && offStageImpactCount > 0" class="tux-map__other-levels">
      +{{ offStageImpactCount }} on other levels
    </div>

    <!-- Active Directed Trace Banner (#125) -->
    <div v-if="activeTraceResult && selectedPanelEntity" class="tux-map__trace-banner">
      <span>
        Tracing path:
        <b>{{ byId[activeTraceResult.from]?.name || resById[activeTraceResult.from]?.title || activeTraceResult.from }}</b>
        →
        <b>{{ byId[activeTraceResult.to]?.name || resById[activeTraceResult.to]?.title || activeTraceResult.to }}</b>
        <template v-if="activeTraceResult.found">
          ({{ activeTraceResult.hops.length }} {{ activeTraceResult.hops.length === 1 ? "hop" : "hops" }})
        </template>
        <template v-else>
          (no spreading path found)
        </template>
      </span>
      <button
        type="button"
        class="tux-map__trace-clear"
        @click="setTraceTarget(null)"
      >
        Clear path
      </button>
    </div>

    <!-- Dense View Auto-List Note (#124) -->
    <div v-if="isAutoDenseList" class="tux-map__dense-note">
      <span>
        Showing compact list for {{ stageData.innerCardCount }} items in this view.
      </span>
      <button
        type="button"
        class="tux-map__trace-clear"
        @click="setExplicitViewMode('diagram')"
      >
        Show diagram anyway
      </button>
    </div>

    <!-- Main Canvas Container (Outline Rail + Diagram + Accessible List View + Sliding Right Drawer) -->
    <div
      class="tux-map__canvas"
      :class="{
        'tux-map__canvas--list': effectiveIsListView,
        'tux-map__canvas--with-outline': outlineOpen,
      }"
    >
      <!-- Collapsible Wayfinding Outline Rail (#125) -->
      <nav
        v-if="outlineOpen"
        class="tux-map__outline"
        aria-label="Architecture outline"
      >
        <div class="tux-map__outline-hdr">
          <span>Outline</span>
          <button
            type="button"
            class="tux-map__iconbtn tux-map__outline-close"
            aria-label="Close outline"
            @click="outlineOpen = false"
          >
            ×
          </button>
        </div>
        <ul class="tux-map__outline-list">
          <li
            v-for="row in outlineRows"
            :key="row.id"
            class="tux-map__outline-row"
            :style="{ paddingLeft: `${row.depth * 14 + 6}px` }"
          >
            <button
              v-if="row.hasChildren"
              type="button"
              class="tux-map__outline-exp"
              :aria-expanded="row.expanded"
              :aria-label="`${row.expanded ? 'Collapse' : 'Expand'} ${row.label}`"
              @click="toggleOutlineExpand(row.id)"
            >
              {{ row.expanded ? "▾" : "▸" }}
            </button>
            <span v-else class="tux-map__outline-exp-pad" aria-hidden="true" />
            <button
              type="button"
              class="tux-map__outline-item"
              :class="{ 'tux-map__outline-item--active': row.active }"
              :data-outline-id="row.id"
              :aria-current="row.active ? 'true' : undefined"
              @click="selectOutlineNode(row)"
            >
              <span class="tux-map__outline-nm">{{ row.label }}</span>
              <span v-if="row.kindLabel" class="tux-map__outline-kd">{{ row.kindLabel }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Diagram Viewport -->
      <div
        v-show="!effectiveIsListView"
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
            'tux-map__viewport--full-height': magnifiedShowsFullHeight,
            'tux-map__viewport--dragging': isDraggingStage,
            'tux-map__viewport--page-wheel': !plainWheelZooms && !isMagnified,
            'tux-map__viewport--cursor': cursorShown,
          },
        ]"
        :style="{ height: computedViewportHeight }"
        :tabindex="wheelVeilShown ? -1 : 0"
        role="region"
        :aria-label="ariaLabel"
        @scroll.passive="onViewportScroll"
        @wheel="onViewportWheel"
        @selectstart="onViewportSelectStart"
        @dragstart.prevent
        @pointerdown="onStagePointerDown"
        @pointermove="onStagePointerMove"
        @pointerup="onStagePointerUp"
        @pointercancel="onStagePointerUp"
        @pointerleave="onViewportPointerLeave"
        @keydown="onStageKeydown"
      >
        <!-- Click-to-explore veil: until it is clicked the wheel is the page's (wheelZoom="click", #209) -->
        <button
          v-if="wheelVeilShown"
          type="button"
          class="tux-map__wheel-veil"
          @click="onWheelVeilClick"
          @keydown.enter.stop
          @keydown.space.stop
        >
          <span class="tux-map__wheel-veil-label">Click to explore</span>
        </button>
        <!-- Level mark (#260): decoration, under the stage -->
        <div
          class="tux-map__level-mark"
          aria-hidden="true"
          :style="{ height: `${viewportInnerHeight}px`, marginBottom: `-${viewportInnerHeight}px` }"
        >
          <span class="tux-map__level-mark-text">LEVEL {{ currentLevel }}</span>
        </div>
        <div
          v-if="isMagnified"
          class="tux-map__sizer"
          aria-hidden="true"
          :style="{
            width: `${Math.ceil(stageData.width * stageScale)}px`,
            height: `${Math.ceil(stageData.height * stageScale)}px`,
          }"
        />
        <div
          ref="stageRef"
          class="tux-map__stage"
          :class="{
            'tux-map__stage--blast-selection': showBlastRadius && blastKeyOfSelection,
            'tux-map__stage--dim': Boolean(
              activeLitId || matchingSearchIds || blastRadiusState || stageTraceState,
            ),
          }"
          :style="{
            width: `${stageData.width}px`,
            height: `${stageData.height}px`,
            top: `${stageOffsetY}px`,
            transform: `translate3d(${panX}px, 0px, 0) scale(${stageScale})`,
          }"
          @pointerover="onStagePointerOver"
          @pointerleave="onStagePointerLeave"
        >
          <!-- Layer 0 (z-index: 0): Dashed C4 Boundaries, Horizontal Bands & Region Enclaves -->
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

          <!-- Trailing cursor (#208): a dot on the pointer and the disc that follows it. Decoration only.
               In the stage, after the boundaries and under everything else (#256); the stage's scale,
               pan and top offset (a centred level, #261) are undone on it, so it is placed in the
               viewport's content px -->
          <div
            v-if="cursorOn"
            ref="cursorRef"
            class="tux-map__cursor"
            :style="{ transform: `scale(${1 / stageScale}) translateY(${-stageOffsetY}px) translateX(${-panX}px)` }"
            aria-hidden="true"
          >
            <i /><i />
          </div>

          <!-- Layer 1 (z-index: 1): Base Orthogonal Wires SVG -->
          <svg
            class="tux-map__wires"
            :class="{
              'tux-map__wires--has-on': Boolean(activeLitId || blastRadiusState || stageTraceState),
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
              v-for="w in baseRoutedSvg.wires"
              :key="w.id"
              :d="w.d"
              :data-id="w.id"
              :data-from="w.from"
              :data-to="w.to"
              class="tux-map__wire"
              :class="{
                'tux-map__wire--planned': w.planned,
                'tux-map__wire--violation': Boolean(w.violating),
                'tux-map__wire--closed': Boolean(openStageWires?.closedWireIds.has(w.id)),
              }"
              :marker-end="`url(#${arrowMarkerId})`"
            />
            <!-- An open outside card's own wires, over the resting ones (#154) -->
            <g v-if="openStageWires" class="tux-map__wires-open">
              <path
                v-for="w in openStageWires.wires"
                :key="w.id"
                :d="w.d"
                :data-id="w.id"
                :data-from="w.from"
                :data-to="w.to"
                class="tux-map__wire"
                :class="{
                  'tux-map__wire--planned': w.planned,
                  'tux-map__wire--violation': Boolean(w.violating),
                }"
                :marker-end="`url(#${arrowMarkerId})`"
              />
            </g>
          </svg>

          <!-- Layer 4 (z-index: 4): Foreground Active Wires SVG -->
          <svg
            class="tux-map__wires-fg"
            :width="stageData.width"
            :height="stageData.height"
            aria-hidden="true"
          >
            <template v-for="w in baseRoutedSvg.wires" :key="`fg-${w.id}`">
              <path
                :d="w.d"
                :data-id="w.id"
                :data-from="w.from"
                :data-to="w.to"
                class="tux-map__wire-fg"
                :class="{
                  'tux-map__wire-fg--planned': w.planned,
                  'tux-map__wire-fg--violation': Boolean(w.violating),
                  'tux-map__wire-fg--blast': Boolean(blastRadiusState?.impactedWires.has(w.id)),
                  'tux-map__wire-fg--trace': Boolean(
                    stageTraceState?.wireIds.has(w.id),
                  ),
                  'tux-map__wire-fg--on': isWireLit(w.from, w.to, w.id),
                  'tux-map__wire-fg--closed': Boolean(openStageWires?.closedWireIds.has(w.id)),
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
                  'tux-map__wire-fg--violation': Boolean(w.violating),
                  'tux-map__wire-fg--blast': Boolean(blastRadiusState?.impactedWires.has(w.id)),
                  'tux-map__wire-fg--trace': Boolean(
                    stageTraceState?.wireIds.has(w.id),
                  ),
                  'tux-map__wire-fg--on': isWireLit(w.from, w.to, w.id),
                  'tux-map__wire-fg--closed': Boolean(openStageWires?.closedWireIds.has(w.id)),
                }"
              />
            </template>
            <g v-if="openStageWires" ref="openFgGroupRef" class="tux-map__wires-open">
              <template v-for="w in openStageWires.wires" :key="`fg-${w.id}`">
                <path
                  :d="w.d"
                  :data-id="w.id"
                  :data-from="w.from"
                  :data-to="w.to"
                  data-open="1"
                  class="tux-map__wire-fg"
                  :class="{
                    'tux-map__wire-fg--planned': w.planned,
                    'tux-map__wire-fg--violation': Boolean(w.violating),
                    'tux-map__wire-fg--blast': Boolean(blastRadiusState?.impactedWires.has(w.id)),
                    'tux-map__wire-fg--trace': Boolean(
                      stageTraceState?.wireIds.has(w.id),
                    ),
                    'tux-map__wire-fg--on': isWireLit(w.from, w.to, w.id),
                  }"
                  :marker-end="`url(#${arrowMarkerId})`"
                />
                <path
                  :d="w.d"
                  :data-id="w.id"
                  :data-from="w.from"
                  :data-to="w.to"
                  data-open="1"
                  class="tux-map__wire-fg tux-map__wire-fg--stream"
                  :class="{
                    'tux-map__wire-fg--violation': Boolean(w.violating),
                    'tux-map__wire-fg--blast': Boolean(blastRadiusState?.impactedWires.has(w.id)),
                    'tux-map__wire-fg--trace': Boolean(
                      stageTraceState?.wireIds.has(w.id),
                    ),
                    'tux-map__wire-fg--on': isWireLit(w.from, w.to, w.id),
                  }"
                />
              </template>
            </g>
          </svg>

          <!-- Layer 2 / 5: Element Cards + Sibling Zoom Badges (#116, #117, #118, #121, #126) -->
          <template v-if="currentLevel !== 4">
            <button
              v-for="c in renderedCards"
              :key="c.id"
              type="button"
              :data-id="c.id"
              :data-parent="c.parent"
              :tabindex="c.id === activeRovingCardId ? 0 : -1"
              :aria-label="c.ariaLabel"
              :aria-busy="c.isLoadingSubgraph ? 'true' : undefined"
              class="tux-map__el"
              :class="[
                c.kindCls,
                c.statusCls,
                c.blastCls,
                c.traceCls,
                {
                  'tux-map__el--mini': c.mini,
                  'tux-map__el--zoomable': c.zoomable,
                  'tux-map__el--splittable': c.splittable,
                  'tux-map__el--lit': isElementLit(c.id, c.parent),
                },
              ]"
              :style="c.style"
              :aria-pressed="selectedId === c.id"
              @focus="rovingCardId = c.id"
              @click="onStageCardClick(c)"
              @dblclick.stop="
                c.mini && currentLevel >= 5 && parentOf.has(c.id)
                  ? revealElement(c.id)
                  : c.zoomable && zoomIntoElement(c.id)
              "
            >
              <span class="tux-map__el-nm">
                <Icon :name="c.icon" class="tux-map__el-ic" aria-hidden="true" />
                <!-- one line, cut with an ellipsis: the full name is the tooltip (#258) -->
                <span :title="c.fullName">{{ c.name }}</span>
              </span>
              <span v-if="c.ownerLabel" class="tux-map__el-own" :title="c.ownerLabel">
                {{ c.ownerLabel }}
              </span>
              <span v-if="c.typeLabel" class="tux-map__el-ty" :title="c.typeLabel">
                {{ c.typeLabel }}
              </span>
              <span v-if="c.runsOnLabel" class="tux-map__el-runs" :title="c.runsOnLabel">
                {{ c.runsOnLabel }}
              </span>
              <span v-if="c.desc" class="tux-map__el-ds" :data-lines="c.descLines" :title="c.desc">{{ c.desc }}</span>
              <span
                v-if="c.live || c.chip || c.extraChips.length > 0 || c.diffBadge"
                class="tux-map__el-ft"
              >
                <template v-if="c.live">
                  <i
                    class="tux-map__dot"
                    :class="c.live[0] ? `tux-map__dot--${c.live[0]}` : ''"
                    aria-hidden="true"
                  />
                  <span class="tux-map__el-st" :title="c.live[1]">{{ c.live[1] }}</span>
                </template>
                <span
                  v-if="c.chip"
                  class="tux-map__chip"
                  :class="`tux-map__chip--${c.chip[0]}`"
                >
                  {{ c.chip[1] }}
                </span>
                <span
                  v-for="(ec, ecIdx) in c.extraChips"
                  :key="ecIdx"
                  class="tux-map__chip"
                  :class="`tux-map__chip--${ec.cls}`"
                >
                  {{ ec.text }}
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
                v-if="c.isLoadingSubgraph"
                class="tux-map__el-busy"
                aria-hidden="true"
              >
                Loading…
              </span>
            </button>

            <!-- Sibling `+` Zoom Buttons (never nested inside `<button class="tux-map__el">`) -->
            <button
              v-for="c in zoomableCards"
              :key="`zb-${c.id}`"
              type="button"
              class="tux-map__el-zb"
              :data-zb-for="c.id"
              :style="c.zbStyle"
              :aria-label="`Zoom into ${c.fullName}`"
              :title="zoomBucketTitleFor(c.id, c.mini)"
              @click.stop="zoomIntoElement(c.id)"
            >
              +
            </button>
          </template>

          <!-- Level 4 Deployment Resource Cards + Sibling Zoom Badges -->
          <template v-else>
            <button
              v-for="n in stageData.deployNodes"
              :key="n.id"
              type="button"
              :data-id="n.id"
              :tabindex="n.id === activeRovingCardId ? 0 : -1"
              :aria-busy="loadingSubgraphId === n.id ? 'true' : undefined"
              class="tux-map__el tux-map__el--k-resource"
              :class="[
                n.status && n.status !== 'now' ? `tux-map__el--st-${n.status}` : '',
                blastRadiusState?.directIds.has(n.id)
                  ? 'tux-map__el--diff-direct'
                  : blastRadiusState?.impactedIds.has(n.id)
                    ? 'tux-map__el--diff-impact'
                    : '',
                stageTraceState?.nodeIds.has(n.id) ? 'tux-map__el--trace' : '',
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
              @focus="rovingCardId = n.id"
              @click="selectElement(selectedId === n.id ? null : n.id)"
              @dblclick.stop="canZoomDeployNode(n) && zoomIntoElement(n.id)"
            >
              <span class="tux-map__el-nm">
                <Icon :name="elementIconName(n.kind)" class="tux-map__el-ic" aria-hidden="true" />
                <span :title="n.title">{{ n.title }}</span>
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
                v-if="loadingSubgraphId === n.id"
                class="tux-map__el-busy"
                aria-hidden="true"
              >
                Loading…
              </span>
            </button>

            <button
              v-for="zn in zoomableDeployNodes"
              :key="`zb-dep-${zn.id}`"
              type="button"
              class="tux-map__el-zb"
              :data-zb-for="zn.id"
              :style="zn.style"
              :aria-label="`Zoom into ${resById[zn.id]?.title || zn.id}`"
              :title="`${wheelZooms ? 'Scroll up' : 'Ctrl+scroll up'} or double-click to zoom in to Level 5 internal modules/schemas`"
              @click.stop="zoomIntoElement(zn.id)"
            >
              +
            </button>
          </template>

          <!-- Layer 3 / 10: Wire label buttons, one beside each end of a wire (#115, #123, #210) -->
          <button
            v-for="lbl in baseStageLabels"
            :key="lbl.id"
            type="button"
            :data-from="lbl.from"
            :data-to="lbl.to"
            :data-forced="lbl.forced ? '1' : ''"
            class="tux-map__lab"
            :class="{
              'tux-map__lab--on':
                isWireLit(lbl.from, lbl.to) ||
                inspectedWireKey === wirePairKey(lbl.from, lbl.to),
              'tux-map__lab--forced': Boolean(lbl.forced),
              'tux-map__lab--violation': Boolean(lbl.violating),
              'tux-map__lab--closed': Boolean(openStageWires?.closedLabelIds.has(lbl.id)),
            }"
            :aria-expanded="inspectedWireKey === wirePairKey(lbl.from, lbl.to) ? 'true' : 'false'"
            :aria-controls="wireInspectorId"
            v-bind="wireLabelAttrs(lbl)"
            @click.stop="toggleWireInspector(lbl, $event.currentTarget)"
          >
            <span v-if="lbl.t1" class="tux-map__lab-t1">
              <span v-if="lbl.violating" class="tux-map__lab-warn" aria-hidden="true">⚠ </span>{{ lbl.t1 }}
            </span>
            <span v-else class="tux-map__lab-t2">[{{ lbl.t2 }}]</span>
          </button>
          <button
            v-for="lbl in openStageLabels"
            :key="lbl.id"
            ref="openLabelEls"
            type="button"
            :data-from="lbl.from"
            :data-to="lbl.to"
            :data-forced="lbl.forced ? '1' : ''"
            data-open="1"
            class="tux-map__lab"
            :class="{
              'tux-map__lab--on':
                isWireLit(lbl.from, lbl.to) ||
                inspectedWireKey === wirePairKey(lbl.from, lbl.to),
              'tux-map__lab--forced': Boolean(lbl.forced),
              'tux-map__lab--violation': Boolean(lbl.violating),
            }"
            :aria-expanded="inspectedWireKey === wirePairKey(lbl.from, lbl.to) ? 'true' : 'false'"
            :aria-controls="wireInspectorId"
            v-bind="wireLabelAttrs(lbl)"
            @click.stop="toggleWireInspector(lbl, $event.currentTarget)"
          >
            <span v-if="lbl.t1" class="tux-map__lab-t1">
              <span v-if="lbl.violating" class="tux-map__lab-warn" aria-hidden="true">⚠ </span>{{ lbl.t1 }}
            </span>
            <span v-else class="tux-map__lab-t2">[{{ lbl.t2 }}]</span>
          </button>

          <!-- Sticky Notes Overlay (Scoped to Current Level & Focus) -->
          <div
            v-for="note in visibleNotes"
            :key="note.id"
            class="tux-map__note"
            :style="{
              transform: `translate3d(${note.x}px, ${note.y}px, 0)`,
            }"
            @pointerdown="props.annotations && onNotePointerDown(note, $event)"
            @dblclick.stop="props.annotations && (editingNoteId = note.id)"
          >
            <div class="tux-map__note-head">
              <span>
                {{ note.author ?? "M.A.P. Note" }}
                <template v-if="note.targetNodeId"> · #{{ note.targetNodeId }}</template>
              </span>
              <button
                v-if="props.annotations"
                type="button"
                class="tux-map__note-close"
                :aria-label="`Remove note by ${note.author ?? 'reviewer'}`"
                @click.stop="removeNote(note.id)"
              >
                ×
              </button>
            </div>
            <textarea
              v-if="props.annotations && editingNoteId === note.id"
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
              :fill="sanitizeStrokeColor(stroke.color)"
              fill-opacity="0.88"
            />
            <path
              v-if="activePenSvgPath"
              :d="activePenSvgPath"
              :fill="sanitizeStrokeColor(props.penColor)"
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

      <!-- Overview of the level, while the view moves (#211) -->
      <TuxArchitectureMapMinimap
        v-if="minimap && !effectiveIsListView && !wheelVeilShown"
        ref="minimapRef"
        :viewport="viewportRef"
        :stage="stageData"
        :scale="stageScale"
        :pan-x="panX"
        :selected-id="selectedId"
        :changed-ids="blastRadiusState?.directIds"
        :lit="activeLitId || matchingSearchIds || blastRadiusState || stageTraceState ? isElementLit : null"
        :coarse="coarsePointer"
        :narrow-below="autoListBreakpoint"
      />

      <!-- Unscaled Wire Link Inspector Popover (#115, #123) -->
      <div
        v-if="!effectiveIsListView && inspectedWireDetail"
        :id="wireInspectorId"
        class="tux-map__wire-pop"
        role="dialog"
        :aria-label="`Links from ${inspectedWireDetail.fromName} to ${inspectedWireDetail.toName}`"
        :style="inspectedWireDetail.style"
        @keydown="onWireInspectorKeydown"
        @pointerdown.stop
      >
        <div class="tux-map__wire-pop-hdr">
          <span class="tux-map__wire-pop-title">
            {{ inspectedWireDetail.fromName }} → {{ inspectedWireDetail.toName }}
          </span>
          <button
            ref="wirePopCloseBtnRef"
            type="button"
            class="tux-map__iconbtn tux-map__wire-pop-close"
            aria-label="Close wire inspector"
            @click.stop="closeWireInspector(true)"
          >
            ×
          </button>
        </div>
        <dl v-if="inspectedWireDetail.facts.length > 0" class="tux-map__wire-pop-facts">
          <template v-for="f in inspectedWireDetail.facts" :key="f.term">
            <dt>{{ f.term }}</dt>
            <dd>
              <template v-if="f.issues">
                <template v-for="iss in f.issues" :key="iss">
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
              </template>
              <template v-else>{{ f.text }}</template>
            </dd>
          </template>
        </dl>
        <p v-if="inspectedWireDetail.summaryLine" class="tux-map__wire-pop-sum">
          {{ inspectedWireDetail.summaryLine }}
        </p>
        <p v-if="inspectedWireDetail.cutLine" class="tux-map__wire-pop-cut">
          Also on this wire: {{ inspectedWireDetail.cutLine }}
        </p>
        <div
          v-if="inspectedWireDetail.violations.length > 0"
          class="tux-map__wire-pop-violations"
        >
          <div
            v-for="(v, vIdx) in inspectedWireDetail.violations"
            :key="vIdx"
            class="tux-map__wire-pop-viol"
          >
            <b>⚠ {{ v.rule }}</b>
            <span v-if="v.message"> — {{ v.message }}</span>
            <span v-if="v.fix" class="tux-map__wire-pop-fix">Fix: {{ v.fix }}</span>
          </div>
        </div>
        <ul v-if="inspectedWireDetail.sites.length > 0" class="tux-map__wire-pop-list">
          <li v-for="s in inspectedWireDetail.sites" :key="s.key">
            <span class="tux-map__wire-pop-kind">{{ s.kindLabel }}</span>
            <a
              v-if="s.href"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="tux-map__source-lnk"
            >
              <code>{{ s.at }}</code>
            </a>
            <code v-else class="tux-map__source-pill">{{ s.at }}</code>
          </li>
        </ul>
        <p v-if="inspectedWireDetail.noCodeLine" class="tux-map__wire-pop-cut tux-map__wire-pop-none">
          {{ inspectedWireDetail.noCodeLine }}
        </p>
        <p v-if="inspectedWireDetail.moreSitesCount > 0" class="tux-map__wire-pop-cut">
          +{{ inspectedWireDetail.moreSitesCount }} more link{{
            inspectedWireDetail.moreSitesCount === 1 ? "" : "s"
          }}
        </p>
      </div>

      <!-- Accessible List View (Only Mounted When Active) -->
      <div v-if="effectiveIsListView" class="tux-map__list">
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
                <span v-if="elementTypeLabel(e)" class="tux-map__el-ty">
                  [{{ elementTypeLabel(e) }}]
                </span>
                <span v-if="e.desc" class="tux-map__el-ds">{{ e.desc }}</span>
                <span v-if="formatLiveState(e)" class="tux-map__el-ft">
                  <i
                    class="tux-map__dot"
                    :class="formatLiveState(e)![0] ? `tux-map__dot--${formatLiveState(e)![0]}` : ''"
                    aria-hidden="true"
                  />
                  <span class="tux-map__el-st">{{ formatLiveState(e)![1] }}</span>
                </span>
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
        aria-live="off"
        aria-label="Selected element details"
        @keydown.escape="effectiveIsListView && selectElement(null)"
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
              {{ plainElementKindLabel(selectedLevelElement) || TYPE_LABELS[selectedLevelElement.kind || "container"] }}
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
              v-if="selectedSplittableParts > 1"
              type="button"
              class="tux-map__panel-btn"
              @click="toggleSplitCard(selectedLevelElement.id)"
            >
              {{
                effectiveSplitSet.has(selectedLevelElement.id)
                  ? "Fold parts"
                  : `Split into ${selectedSplittableParts} parts`
              }}
            </button>
            <button
              v-if="selectedSplitParent"
              type="button"
              class="tux-map__panel-btn"
              @click="
                toggleSplitCard(selectedSplitParent.id);
                selectElement(selectedSplitParent.id);
              "
            >
              Fold back into {{ selectedSplitParent.name }}
            </button>
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
                currentLevel === 1
                  ? "Zoom in to Level 2: containers & services"
                  : currentLevel === 2 && (getLevel3Kids(activeModel, selectedLevelElement.id)?.length ?? 0) > 0
                    ? `Zoom in to Level 3: its ${(getLevel3Kids(activeModel, selectedLevelElement.id) || []).length} components`
                    : `Zoom in to Level ${fractalZoomLevelFor(selectedLevelElement.id)}: ${getSubgraphForNode(selectedLevelElement.id)?.stratum || "internal modules"}`
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

          <!-- Directed Spreading Path Picker (#125) -->
          <div class="tux-map__trace-picker" @keydown.escape.stop="tracePickerOpen = false">
            <button
              type="button"
              class="tux-map__panel-btn"
              :aria-expanded="tracePickerOpen"
              @click="tracePickerOpen = !tracePickerOpen"
            >
              {{ localTraceTarget ? "Change traced target…" : "Trace to…" }}
            </button>
            <button
              v-if="localTraceTarget"
              type="button"
              class="tux-map__panel-btn"
              @click="
                setTraceTarget(null);
                tracePickerOpen = false;
              "
            >
              Clear path
            </button>
            <div v-if="tracePickerOpen" class="tux-map__trace-menu">
              <input
                v-model="traceQuery"
                type="search"
                class="tux-map__trace-input"
                aria-label="Search target to trace dependency path"
                placeholder="Filter elements to trace…"
              />
              <ul class="tux-map__trace-list" aria-label="Trace targets">
                <li v-for="cand in traceCandidateItems" :key="cand.id">
                  <button
                    type="button"
                    class="tux-map__trace-opt"
                    @click="
                      setTraceTarget(cand.id);
                      tracePickerOpen = false;
                    "
                  >
                    <span class="tux-map__trace-opt-nm">{{ cand.name }}</span>
                    <span v-if="cand.sub" class="tux-map__trace-opt-sub">{{ cand.sub }}</span>
                  </button>
                </li>
              </ul>
            </div>
            <ol v-if="activeTraceResult && activeTraceResult.hops.length > 0" class="tux-map__trace-hops">
              <li v-for="(hop, hIdx) in activeTraceResult.hops" :key="`${hIdx}-${hop.from}-${hop.to}`">
                <code>{{ byId[hop.from]?.name || resById[hop.from]?.title || hop.from }}</code>
                <span> {{ hop.label }} → </span>
                <code>{{ byId[hop.to]?.name || resById[hop.to]?.title || hop.to }}</code>
                <span v-if="hop.at" class="tux-map__trace-at"> ({{ hop.at }})</span>
              </li>
            </ol>
          </div>

          <!-- Dependency-Rule Violations (#123) -->
          <template v-if="selectedViolations.length > 0">
            <h5 class="tux-map__panel-h">Rule violations ({{ selectedViolations.length }})</h5>
            <ul class="tux-map__panel-violations">
              <li v-for="v in selectedViolations" :key="v.key" class="tux-map__panel-viol">
                <div class="tux-map__panel-viol-hdr">
                  <span class="tux-map__chip tux-map__chip--violation">⚠ {{ v.rule }}</span>
                  <span class="tux-map__panel-viol-dir">
                    {{ v.direction === "out" ? `→ ${v.peerName}` : `← ${v.peerName}` }} · {{ v.kindLabel }}
                  </span>
                </div>
                <p v-if="v.message" class="tux-map__panel-viol-msg">{{ v.message }}</p>
                <p v-if="v.fix" class="tux-map__panel-viol-fix">Fix: {{ v.fix }}</p>
                <a
                  v-if="v.at && v.href"
                  :href="v.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="tux-map__source-lnk"
                >
                  <code>{{ v.at }}</code>
                </a>
                <code v-else-if="v.at" class="tux-map__source-pill">{{ v.at }}</code>
              </li>
            </ul>
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
                        v-if="canRevealElement(f.id)"
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
                      <button
                        type="button"
                        class="tux-map__blast-trace"
                        :aria-label="`Trace dependency path to ${f.locLabel}`"
                        @click="setTraceTarget(f.id)"
                      >
                        Path
                      </button>
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

          <!-- Vendored Copies & Canonical Source (#121) -->
          <template v-if="selectedVendoredInfo">
            <h5 class="tux-map__panel-h">Vendored copies</h5>
            <div class="tux-map__panel-vendored">
              <div v-if="selectedVendoredInfo.canonical" class="tux-map__panel-vend-canon">
                <span>Canonical source: </span>
                <button
                  v-if="selectedVendoredInfo.canonical.canReveal"
                  type="button"
                  class="tux-map__lnk"
                  @click="revealElement(selectedVendoredInfo.canonical.id)"
                >
                  <code>{{ selectedVendoredInfo.canonical.label }}</code>
                </button>
                <a
                  v-else-if="selectedVendoredInfo.canonical.href"
                  :href="selectedVendoredInfo.canonical.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="tux-map__source-lnk"
                >
                  <code>{{ selectedVendoredInfo.canonical.label }}</code>
                </a>
                <code v-else class="tux-map__source-pill">{{ selectedVendoredInfo.canonical.label }}</code>
              </div>
              <ul v-if="selectedVendoredInfo.copies.length > 0" class="tux-map__panel-rels">
                <li v-for="vc in selectedVendoredInfo.copies" :key="vc.id">
                  <button
                    v-if="vc.canReveal"
                    type="button"
                    class="tux-map__lnk"
                    @click="revealElement(vc.id)"
                  >
                    <code>{{ vc.label }}</code>
                  </button>
                  <a
                    v-else-if="vc.href"
                    :href="vc.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tux-map__source-lnk"
                  >
                    <code>{{ vc.label }}</code>
                  </a>
                  <code v-else class="tux-map__source-pill">{{ vc.label }}</code>
                </li>
              </ul>
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

            <!-- Cross-Jump to Level 4 Infrastructure Hosts (Direct or Inherited #116) -->
            <template v-if="selectedInheritedHosts.length > 0">
              <h5 class="tux-map__panel-h">Runs on (Level 4)</h5>
              <ul class="tux-map__panel-rels">
                <li
                  v-for="rid in selectedInheritedHosts"
                  :key="rid"
                >
                  <button
                    v-if="resById[rid]"
                    type="button"
                    class="tux-map__lnk"
                    @click="
                      preInfraState = {
                        level: currentLevel,
                        focusId,
                        drillStack: [...drillStack],
                        selectedId,
                      };
                      drillStack = [];
                      goToLevel(4, { nextSel: rid, inward: true, keepPreInfra: true });
                    "
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
        @keydown="onGoToKeydown"
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

    <!-- Keyboard Shortcuts Modal (#117) -->
    <div
      v-if="shortcutsOpen"
      class="tux-map__shortcuts-backdrop"
      @mousedown.self="closeShortcutsModal(true)"
    >
      <div
        class="tux-map__shortcuts-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        @keydown="onShortcutsKeydown"
      >
        <div class="tux-map__shortcuts-hdr">
          <h4 class="tux-map__shortcuts-title">Keyboard shortcuts</h4>
          <button
            ref="shortcutsCloseBtnRef"
            type="button"
            class="tux-map__iconbtn tux-map__shortcuts-close"
            aria-label="Close keyboard shortcuts"
            @click="closeShortcutsModal(true)"
          >
            ×
          </button>
        </div>
        <dl class="tux-map__shortcuts-dl">
          <dt><kbd>Arrow keys</kbd></dt>
          <dd>Move focus across diagram cards</dd>
          <dt><kbd>Enter</kbd> / <kbd>Space</kbd></dt>
          <dd>Select focused card (or split folded outside card)</dd>
          <dt><kbd>+</kbd> / <kbd>−</kbd></dt>
          <dd>Zoom in to inner view or zoom out a level</dd>
          <dt><kbd>1</kbd> – <kbd>4</kbd></dt>
          <dd>Jump to System, Containers, Components, or Infrastructure</dd>
          <dt><kbd>/</kbd> or <kbd>Ctrl+K</kbd></dt>
          <dd>Open cross-level Go to search palette</dd>
          <dt><kbd>?</kbd></dt>
          <dd>Show or hide keyboard shortcuts</dd>
          <dt><kbd>Esc</kbd></dt>
          <dd>Close open popover/dialog, clear selection, or zoom out</dd>
          <template v-if="props.annotations">
            <dt><kbd>V</kbd> / <kbd>P</kbd> / <kbd>L</kbd> / <kbd>N</kbd></dt>
            <dd>Switch between Select, Pen, Laser, and Sticky Note tools</dd>
          </template>
        </dl>
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
  /* A card the highlight does not reach (#229): opaque, its surface most of the way to the canvas
     (--surface-sunken) and its border quieter. The faded text on it holds 7:1 in the four themes
     (--text-secondary 9.4:1 or more, --text-muted 7.3:1 or more); the border keeps 3:1 on the
     canvas in the high-contrast theme (3.4:1), where it is the card's edge */
  --tux-map-faded-surface: color-mix(in srgb, var(--surface-raised) 25%, var(--surface-sunken));
  --tux-map-faded-border: color-mix(in srgb, var(--surface-border) 75%, var(--surface-sunken));
  /* and hatched: diagonal lines under its text, so "out of the highlight" shows by a pattern and not
     by a shade alone (1.4.1). A line is the faded surface with 14% of --text-muted, 1.23:1 to 1.29:1
     on the surface in the four themes; the faded text is --text-secondary, which holds 7:1 or more
     on a line (7.6:1 in tti) as well as between them */
  --tux-map-faded-hatch: color-mix(in srgb, var(--text-muted) 14%, var(--tux-map-faded-surface));
  --tux-map-faded-pattern: repeating-linear-gradient(
    -45deg,
    var(--tux-map-faded-hatch) 0 1.5px,
    var(--tux-map-faded-surface) 1.5px 7px
  );
  /* 2.5.5 Target Size (Enhanced); TUX's field-sunlight mode asks 48px for gloved hands */
  --tux-map-target: 44px;
  /* The trailing cursor's colour (#256): 3:1 or more on the canvas (--surface-sunken) in every
     theme and colour-vision palette (1.4.11), 4.5:1 at the least (high contrast, Okabe-Ito).
     The light themes take the brand colour; the dark ones the accent, below */
  --tux-map-cursor: var(--brand-primary);
}

/* dark and soft dark: the accent, as the dark map's own pointer is (7.3:1 or more on the canvas) */
[data-theme="tti-dark"] .tux-map {
  --tux-map-cursor: var(--brand-accent);
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

.tux-map__diag-note {
  margin: 0 0 0.55rem;
  padding: 0.38rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Sticky Wayfinding Chrome & Regrouped Toolbar (#125) */
@media (min-width: 761px) {
  .tux-map__chrome {
    position: sticky;
    top: var(--tux-map-sticky-top, 0px);
    z-index: 30;
    background: var(--surface-page);
    padding: 0.15rem 0 0.25rem;
  }
}

/* Toolbar & Segmented Level Controls */
.tux-map__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.85rem;
  margin: 0.5rem 0 0.45rem;
}

.tux-map__more-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tux-map__more-btn {
  display: none;
  min-height: var(--tux-map-target);
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  font: inherit;
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.tux-map__more-inline {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.85rem;
}

@container tux-map (max-width: 760px) {
  .tux-map__more-btn {
    display: inline-flex;
  }

  .tux-map__more-inline {
    display: none;
  }

  .tux-map__more-inline--open {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: calc(100% + 6px);
    /* under its button, moved left by as much as it would pass the map's right edge (#205) */
    left: var(--tux-map-more-shift, 0px);
    z-index: 40;
    min-width: 220px;
    max-width: calc(100cqi - 16px);
    box-sizing: border-box;
    padding: 0.65rem 0.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--surface-border);
    background: var(--surface-raised);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  }
}

.tux-map__subbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem 1rem;
  margin: 0.1rem 0 0.25rem;
}

.tux-map__crumb-menu-wrap,
.tux-map__crumb-overflow-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tux-map__crumbs button.tux-map__crumb-sib-btn {
  text-decoration: none;
  min-width: 36px;
  min-height: var(--tux-map-target);
  justify-content: center;
  padding: 0 0.3rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-map__crumbs button.tux-map__crumb-sib-btn:hover,
.tux-map__crumbs button.tux-map__crumb-sib-btn[aria-expanded="true"] {
  background: var(--surface-raised);
  color: var(--text-primary);
}

.tux-map__crumb-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 45;
  margin: 0;
  padding: 0.3rem;
  list-style: none;
  min-width: 190px;
  max-width: calc(100cqi - 16px);
  box-sizing: border-box;
  max-height: 240px;
  overflow-y: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
}

.tux-map__crumb-menu li {
  display: block;
}

.tux-map__crumb-menu li + li::before {
  content: none;
}

.tux-map__crumbs .tux-map__crumb-menu button {
  width: 100%;
  box-sizing: border-box;
  min-height: var(--tux-map-target);
  padding: 0.3rem 0.55rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 0.8125rem;
}

.tux-map__crumbs .tux-map__crumb-menu button:hover,
.tux-map__crumbs .tux-map__crumb-menu button[aria-current="true"] {
  background: var(--tux-map-brand-tint);
}

@container tux-map (max-width: 520px) {
  .tux-map__crumb-btn:not(.tux-map__crumb-overflow-btn),
  .tux-map__crumb-cur {
    max-width: 9.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}

.tux-map__wire-filters {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}

.tux-map__wire-filters-lbl {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-right: 0.15rem;
}

.tux-map__wire-filter-btn {
  min-height: var(--tux-map-target);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-secondary);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

.tux-map__fold-split-btn {
  border-style: dashed;
  border-color: var(--brand-primary);
  color: var(--text-primary);
}

.tux-map__wire-filter-btn[aria-pressed="true"] {
  background: var(--tux-map-brand-tint);
  border-color: var(--brand-primary);
  color: var(--text-primary);
  font-family: var(--font-bold);
  font-weight: 700;
}

.tux-map__trace-banner,
.tux-map__dense-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 0.55rem;
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--brand-primary);
  background: var(--tux-map-brand-tint);
  font-size: 0.8125rem;
  color: var(--text-primary);
}

.tux-map__trace-clear {
  min-height: var(--tux-map-target);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  font: inherit;
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
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

/* one width for every level's name: the stepper, and so the toolbar after it, does not
   change size from level to level (#205) */
.tux-map__stepper-name {
  width: 8rem;
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

/* The trailing controls (Go to, the filter, Diagram/List, help) are one group at the end of the
   toolbar. They wrap to the next row together and keep their order, so a control is where it was
   at every level and in both views (#205) */
.tux-map__tools-end {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.55rem 0.85rem;
  margin-left: auto;
}

.tux-map__tools-pair {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.85rem;
}

/* a narrow map: the group may break, between the filter and the Diagram/List pair */
@container tux-map (max-width: 620px) {
  .tux-map__tools-end {
    flex-wrap: wrap;
    margin-left: 0;
  }
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

/* the width of the magnify group (two buttons, Fit, the group's border), held in the list view */
.tux-map__magnify-gap {
  flex: none;
  width: calc(var(--tux-map-target) * 2 + 3.4rem + 2px);
  height: var(--tux-map-target);
  visibility: hidden;
}

.tux-map__magnify-fit {
  box-sizing: border-box;
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

/* the ring of `.tux-map__el[aria-pressed="true"]` */
.tux-map__swatch--selected {
  background: var(--surface-raised);
  border: 2px solid var(--brand-primary);
}

/* A card the blast radius does not reach (.tux-map__stage--dim), drawn as the card is (#229) */
.tux-map__swatch--faded {
  background-color: var(--tux-map-faded-surface);
  background-image: var(--tux-map-faded-pattern);
  border-color: var(--tux-map-faded-border);
}

.tux-map__blast-note,
.tux-map__blast-intent {
  margin: 0 0 0.55rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
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

.tux-map__canvas--with-outline {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  gap: 0.65rem;
  align-items: start;
}

@container tux-map (max-width: 760px) {
  .tux-map__canvas--with-outline {
    grid-template-columns: minmax(0, 1fr);
  }
}

.tux-map__outline {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  max-height: min(72vh, 620px);
  overflow-y: auto;
  padding: 0.45rem;
}

.tux-map__outline-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.15rem 0.35rem 0.35rem;
  border-bottom: 1px solid var(--surface-border);
  font-family: var(--font-bold);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.tux-map__outline-close {
  width: var(--tux-map-target);
  height: var(--tux-map-target);
  font-size: 16px;
}

.tux-map__outline-list {
  margin: 0.3rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.tux-map__outline-row {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.tux-map__outline-exp {
  min-width: 36px;
  min-height: var(--tux-map-target);
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tux-map__outline-exp-pad {
  width: 36px;
  flex: none;
}

.tux-map__outline-item {
  flex: 1;
  min-width: 0;
  min-height: var(--tux-map-target);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  padding: 0.2rem 0.4rem;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.78rem;
  text-align: left;
  cursor: pointer;
}

.tux-map__outline-item:hover,
.tux-map__outline-item--active {
  background: var(--tux-map-brand-tint);
}

.tux-map__outline-item--active {
  font-family: var(--font-bold);
  font-weight: 700;
  box-shadow: inset 3px 0 0 var(--brand-primary);
}

.tux-map__outline-nm {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tux-map__outline-kd {
  flex: none;
  font-size: 10px;
  color: var(--text-muted);
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
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  /* a finger scrolls the page past the map and pinches to zoom; only the drawing tools take the gesture */
  touch-action: manipulation;
  overscroll-behavior: contain;
}

/* Trailing cursor (#208). It is a child of the stage, after the boundaries: in the stage's
   stacking context at z-index 0, over the canvas and the boundaries' fills and under their
   labels, the wires, the cards and every control (#256). Resting on a card, the card covers
   it and its padding shows as a ring of --tux-map-cursor around the card. The pointer's own
   cursor goes only from the background, and only while the disc is drawn: a card, a control
   and a drag keep theirs. The disc reaching the card stands in for the tether */
.tux-map__viewport--cursor {
  cursor: none;
}

.tux-map__viewport--cursor .tux-map__proximity-tether {
  display: none;
}

.tux-map__cursor {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  transform-origin: 0 0;
  pointer-events: none;
}

.tux-map__viewport--cursor .tux-map__cursor {
  display: block;
}

/* both are centred on the point they are moved to */
.tux-map__cursor i {
  position: absolute;
  width: 40px;
  height: 40px;
  margin: -20px;
  border-radius: 50%;
  background: var(--tux-map-cursor);
}

.tux-map__cursor i:first-child {
  width: 8px;
  height: 8px;
  margin: -4px;
}

.tux-map__viewport--magnified {
  overflow: auto;
  /* the background drags the diagram about (#205); a card keeps its own cursor */
  cursor: grab;
}

/* As tall as the diagram: nothing to scroll down to. A horizontal scrollbar that takes its
   height from the viewport would otherwise bring a vertical one with it (#205) */
.tux-map__viewport--full-height {
  overflow-y: hidden;
}

.tux-map__viewport--dragging,
.tux-map__viewport--dragging * {
  cursor: grabbing !important;
}

/* where the plain wheel is the page's (`wheelZoom` false, or "click" and not armed)
   the canvas must not hold the scroll it does not use: `contain` on this box stops
   the wheel from reaching the page even when nothing here scrolls (#209) */
.tux-map__viewport--page-wheel {
  overscroll-behavior: auto;
}

/* Click-to-explore veil (#209): a light scrim, so the diagram reads through it,
   and a label on a solid surface, so the words keep their contrast over any card */
.tux-map__wheel-veil {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: inherit;
  background: color-mix(in srgb, var(--surface-sunken) 45%, transparent);
  font: inherit;
  cursor: pointer;
  animation: tux-map-wheel-veil-in 0.18s ease;
}

.tux-map__wheel-veil-label {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: var(--surface-raised);
  border: 1.5px solid var(--text-primary);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.tux-map__wheel-veil:hover .tux-map__wheel-veil-label {
  border-color: var(--brand-primary);
}

.tux-map__wheel-veil:focus-visible {
  outline: none;
}

.tux-map__wheel-veil:focus-visible .tux-map__wheel-veil-label {
  outline: 3px solid var(--brand-primary);
  outline-offset: 3px;
}

@keyframes tux-map-wheel-veil-in {
  from {
    opacity: 0;
  }
}

.tux-map__sizer {
  pointer-events: none;
}

/* The level in the canvas's bottom-right corner (#260), in the type of the faint "TUX" on the
   home page. Decoration (aria-hidden): the stepper names the level and the change is announced.
   It comes before the stage, so every card, wire and label is drawn over it. The box is as tall
   as the viewport, takes no room in it (its height comes off its margin) and sticks to the
   scrolled box's top-left, so the word stays put when a magnified diagram scrolls. Text-primary
   at 7% is faint on the sunken surface of every theme; under forced colours it would be drawn
   solid, so it goes */
.tux-map__level-mark {
  position: sticky;
  top: 0;
  left: 0;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.tux-map__level-mark-text {
  position: absolute;
  right: 0.9rem;
  bottom: 0.6rem;
  font-family: var(--font-bold);
  font-weight: 900;
  font-style: italic;
  font-size: clamp(2.25rem, 7cqi, 4.5rem);
  letter-spacing: -0.05em;
  line-height: 0.8;
  white-space: nowrap;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text-primary) 7%, transparent);
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
.tux-map__viewport--tool-pen .tux-map__el-zb,
.tux-map__viewport--tool-laser .tux-map__el-zb,
.tux-map__viewport--tool-note .tux-map__el-zb,
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

/* Floating pill that names a change of level */
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
  animation: tux-map-hud-pop 0.18s cubic-bezier(0.333, 1, 0.667, 1);
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

/* Boundaries & Regions. A boundary is no stacking context of its own: its fill is under the
   trailing cursor and its label over it (#256) */
.tux-map__bound {
  position: absolute;
  border: 1.5px dashed var(--text-muted);
  border-radius: 12px;
  background: color-mix(in srgb, var(--brand-primary) 4%, transparent);
}

.tux-map__bound-label {
  position: absolute;
  z-index: 1;
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

.tux-map__bound.band {
  border-style: solid;
  border-width: 1px;
  border-color: var(--surface-border);
  background: color-mix(in srgb, var(--surface-raised) 55%, transparent);
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

/* Non-colour violating wire cue (#123): dotted heavy stroke + warning glyph */
.tux-map__wire--violation {
  stroke: var(--status-critical);
  stroke-width: 2.6;
  stroke-dasharray: 2 4;
  opacity: 0.96;
}

/* The resting wire of an outside card whose own wires are open */
.tux-map__wire.tux-map__wire--closed,
.tux-map__wire-fg.tux-map__wire-fg--closed,
.tux-map__lab.tux-map__lab--closed {
  display: none;
}

/* A wire the highlight does not reach steps back and stays a line: 3:1 or more against the
   canvas in every TUX theme (1.4.11). At 0.12 it was 1.2:1, close to the canvas colour (#205) */
.tux-map__wires--has-on .tux-map__wire {
  opacity: 0.6;
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

/* Non-colour blast wire cue (#117): long-short dash + thicker stroke */
.tux-map__wire-fg--blast {
  stroke: var(--status-warning);
  stroke-width: 3;
  stroke-dasharray: 10 4;
  opacity: 0.95;
}

.tux-map__wire-fg--violation {
  stroke: var(--status-critical);
  stroke-width: 2.8;
  stroke-dasharray: 2 4;
  opacity: 0.96;
}

.tux-map__wire-fg--trace {
  stroke: var(--brand-primary);
  stroke-width: 3.2;
  stroke-dasharray: none;
  opacity: 1;
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

.tux-map__wire-fg--stream.tux-map__wire-fg--violation {
  stroke: var(--status-critical);
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
}

.tux-map__proximity-tether--on .tux-map__proximity-beam {
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

/* Layer 3 / 10: Wire label buttons (#115, #123). One sits beside each end of a wire, at its port
   and outside the card (#210): on the stub at a top or bottom port, and hung by the edge that
   faces the card at a left or right one. `max-width` is the box the router kept clear of the cards. */
.tux-map__lab {
  position: absolute;
  z-index: 3;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  box-sizing: border-box;
  height: 17px;
  overflow: hidden;
  padding: 0 6px;
  border-radius: 6px;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  font: inherit;
  line-height: 15px;
  text-align: left;
  color: var(--text-primary);
  transition: none !important;
}

.tux-map__lab[data-side="r"] {
  transform: translate(0, -50%);
}

.tux-map__lab[data-side="l"] {
  transform: translate(-100%, -50%);
}

.tux-map__lab[data-planned] {
  border-style: dashed;
}

.tux-map__lab:hover,
.tux-map__lab:focus-visible,
.tux-map__lab[aria-expanded="true"] {
  z-index: 11;
  opacity: 1 !important;
  pointer-events: auto;
  border-color: var(--brand-primary);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
}

.tux-map__lab:focus-visible {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
}

/* A label with no room at its port (#210): hidden via opacity at rest, so Tab still focuses it */
.tux-map__lab--forced:not(.tux-map__lab--on):not(:hover):not(:focus-visible):not([aria-expanded="true"]) {
  opacity: 0;
  pointer-events: none;
}

.tux-map__lab--violation {
  border-color: var(--status-critical);
  border-style: dashed;
}

.tux-map__lab-t1 {
  font-family: var(--font-body);
  font-size: 11px;
}

.tux-map__lab-t2 {
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--text-muted);
}

/* A label the highlight does not reach steps back by its surface, not by fading: it lies flat on
   the canvas's own colour with quieter text, which holds 7:1 in every TUX theme (9.2:1 or more
   for the first line, 7.1:1 or more for the second). At opacity 0.15 its text was 1.3:1 (#205) */
.tux-map__stage--dim .tux-map__lab:not(.tux-map__lab--on):not(:hover):not(:focus-visible):not([aria-expanded="true"]) {
  z-index: 1;
  background: var(--surface-sunken);
  box-shadow: none;
  /* the first line takes the label's colour */
  color: var(--text-secondary);
}

.tux-map__stage--dim .tux-map__lab--forced:not(.tux-map__lab--on):not(:hover):not(:focus-visible):not([aria-expanded="true"]) {
  opacity: 0;
}

/* Lit by its card or its wire, a label stays at its port and takes the brand border. It stays
   under a hovered or selected card, which grows over the gap to show all its text (#210) */
.tux-map__stage--dim .tux-map__lab--on,
.tux-map__lab--on {
  z-index: 5;
  opacity: 1;
  pointer-events: auto;
  border-color: var(--brand-primary);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
}

/* Wire Link Inspector Popover (#115) */
.tux-map__wire-pop {
  position: absolute;
  z-index: 28;
  width: 312px;
  max-width: calc(100% - 16px);
  box-sizing: border-box;
  max-height: 280px;
  overflow-y: auto;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--brand-primary);
  background: var(--surface-raised);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
  color: var(--text-primary);
  user-select: text;
  -webkit-user-select: text;
}

.tux-map__wire-pop-hdr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.45rem;
  font-size: 12px;
  line-height: 1.3;
}

.tux-map__wire-pop-close {
  width: var(--tux-map-target);
  height: var(--tux-map-target);
  flex: none;
  font-size: 16px;
}

.tux-map__wire-pop-facts {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.2rem 0.6rem;
  margin: 0.35rem 0 0;
  font-size: 12px;
  line-height: 1.35;
}

.tux-map__wire-pop-facts dt {
  color: var(--text-secondary);
}

.tux-map__wire-pop-facts dd {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  color: var(--text-primary);
  overflow-wrap: anywhere;
}

.tux-map__wire-pop-sum {
  margin: 0.35rem 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.tux-map__wire-pop-cut {
  margin: 0.2rem 0 0;
  font-size: 11px;
  color: var(--text-muted);
}

.tux-map__wire-pop-violations,
.tux-map__wire-pop-list {
  margin: 0.45rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 11px;
}

.tux-map__wire-pop-viol {
  padding: 0.28rem 0.45rem;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--status-critical);
  background: color-mix(in srgb, var(--status-critical) 12%, var(--surface-raised));
  line-height: 1.35;
}

.tux-map__wire-pop-fix {
  display: block;
  margin-top: 0.15rem;
  color: var(--text-secondary);
}

.tux-map__wire-pop-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}

.tux-map__wire-pop-kind {
  font-size: 10px;
  color: var(--text-muted);
}

/* Layer 2 / 5: C4 Element Cards (z-index: 2 at rest, 1 when dimmed, 5 when lit) */
.tux-map__el {
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  /* the rows of a card and their heights are also in `cardDescriptionLines()` and
     `outsideCardHeight()` (utils/internal/tuxArchitectureMapStage): keep the two in step. A card is
     the height the stage plans and no other, hovered and chosen too: its ring, its ports and its
     wires are drawn to that box (#257). What does not fit is in the tooltips and the panel */
  gap: 0.16rem;
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

.tux-map__el--splittable {
  border-style: solid;
}

.tux-map__el--trace {
  border-color: var(--brand-primary) !important;
  box-shadow:
    inset 4px 0 0 var(--brand-primary),
    0 0 0 2px var(--brand-primary);
}

.tux-map__el--proximity {
  border-color: color-mix(in srgb, var(--brand-primary) 78%, var(--surface-border));
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  z-index: 6;
}

.tux-map__el:hover {
  border-color: var(--brand-primary);
  z-index: 8;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
}

.tux-map__el:focus-visible {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
}

.tux-map__el[aria-pressed="true"] {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px var(--brand-primary);
  z-index: 7;
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

/* One line, cut with an ellipsis: the full name is the tooltip, the accessible name and the
   panel's heading. Two lines pushed the rows under it down and the description out (#258) */
.tux-map__el-nm > span {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.tux-map__el-own {
  font-size: 10.5px;
  color: var(--text-secondary);
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: none;
}

/* the type line is the body's size, never smaller (#258): `--text-muted` holds 7:1 at 12px */
.tux-map__el-ty {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: none;
}

.tux-map__el-runs {
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.3;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* it shrank with the description, to half a line of text (#205) */
  flex: none;
}

.tux-map__el-busy {
  display: inline-block;
  padding: 0.05em 0.45em;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  border: 1px dashed var(--brand-primary);
  background: var(--tux-map-brand-tint);
  color: var(--text-primary);
}

/* The body: a hairline and 4px of space set it apart from the title, type and host rows (#258) */
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
  border-top: 1px solid var(--surface-border);
  padding-top: 4px;
}

/* The lines the card has room for, counted by `cardDescriptionLines()`: whole lines, the last
   one ending in an ellipsis. Left to shrink, the description was cut through its last line (#205) */
.tux-map__el-ds[data-lines="1"] {
  -webkit-line-clamp: 1;
}

.tux-map__el-ds[data-lines="0"] {
  display: none;
}

.tux-map__el-ft {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  font-size: 11px;
  color: var(--text-secondary);
  min-height: 18px;
  /* one row of chips: a chip that does not fit wraps out of sight whole, never cut in half (#205) */
  max-height: 1.2rem;
  overflow: hidden;
  flex: none;
}

/* the status line: one line; cut, never wrapped out of sight (#258) */
.tux-map__el-st {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sibling Zoom-In `+` Badge Button on Stage (#116: never nested inside card button) */
/* Above every wire label, raised (10) or under the pointer (11): a label never takes its click (#205) */
.tux-map__el-zb {
  position: absolute;
  z-index: 12;
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  border: 1.5px solid var(--brand-primary);
  background: var(--surface-raised);
  color: var(--tux-map-brand-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
  font-family: var(--font-bold);
  font-weight: 700;
  cursor: pointer;
}

.tux-map__el-zb::after {
  content: "";
  position: absolute;
  inset: -11px;
}

[data-vision-comfort="field-sunlight"] .tux-map__el-zb::after {
  inset: -13px;
}

.tux-map__el-zb:hover,
.tux-map__el-zb:focus-visible {
  background: var(--tux-map-brand-tint);
  border-color: var(--brand-primary);
  color: var(--text-primary);
}

.tux-map__el-zb:focus-visible {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
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

/* the body's hairline on the dark person card: its own text colour, faded */
.tux-map__el--k-person .tux-map__el-ds {
  border-top-color: color-mix(in srgb, currentColor 40%, transparent);
}

.tux-map__el--k-system {
  background: var(--tux-map-brand-tint);
  border: 2.5px solid var(--brand-primary);
}

.tux-map__el--k-system .tux-map__el-nm,
.tux-map__el--k-system .tux-map__el-ds,
.tux-map__el--k-system .tux-map__el-ty,
.tux-map__el--k-system .tux-map__el-ft {
  color: var(--text-primary);
}

.tux-map__el--k-container,
.tux-map__el--k-database,
.tux-map__el--k-storage,
.tux-map__el--k-component,
.tux-map__el--k-module,
.tux-map__el--k-folder,
.tux-map__el--k-file,
.tux-map__el--k-function,
.tux-map__el--k-class,
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
.tux-map__el--k-folder .tux-map__el-ic,
.tux-map__el--k-file .tux-map__el-ic,
.tux-map__el--k-function .tux-map__el-ic,
.tux-map__el--k-class .tux-map__el-ic,
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

/* In the radius of a selection the origin is the selected card, and it is drawn as selected:
   the changed card's border under the selection's ring was a colour the key does not have (#205) */
.tux-map__stage--blast-selection .tux-map__el--diff-direct[aria-pressed="true"] {
  border-color: var(--brand-primary) !important;
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

/* A card the highlight does not reach steps back by its colours, not by fading (#229). At opacity
   0.28 the wires behind it showed through, its text fell to about 2:1 and every faded card was a
   layer of its own to paint. Opaque, it hides the wires under it, as a lit card does; its kind still
   shows by its icon and its shape. It is hatched (--tux-map-faded-pattern) and its text is one step
   quieter than a resting card's, --text-secondary throughout; a planned card is hatched the same and
   keeps its dashes. A chip keeps a plain fill, so its small text never lies on a line */
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) {
  z-index: 1;
  background-color: var(--tux-map-faded-surface);
  background-image: var(--tux-map-faded-pattern);
  border-color: var(--tux-map-faded-border);
  box-shadow: none;
}

.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-nm {
  color: var(--text-secondary);
}

.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-ic,
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-own,
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-ty,
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-runs,
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-ds,
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-ft {
  color: var(--text-secondary);
  opacity: 1;
}

.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__chip,
.tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) .tux-map__el-busy {
  background: var(--surface-sunken);
  border-color: var(--tux-map-faded-border);
  color: var(--text-muted);
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
.tux-map__chip--diff-impact,
.tux-map__chip--violation {
  background: color-mix(in srgb, var(--status-critical) 18%, var(--surface-raised));
  color: var(--text-primary);
  border-color: var(--status-critical);
}

.tux-map__chip--vendored,
.tux-map__chip--shared,
.tux-map__chip--parts {
  background: var(--tux-map-brand-tint);
  color: var(--text-primary);
  border-color: var(--brand-primary);
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
  /* a path or an id with no space in it wraps inside the panel instead of running out of it */
  overflow-wrap: anywhere;
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

.tux-map__panel-violations {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.tux-map__panel-viol {
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--status-critical);
  background: color-mix(in srgb, var(--status-critical) 9%, var(--surface-raised));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  font-size: 12px;
}

.tux-map__panel-viol-hdr {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.tux-map__panel-viol-dir {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.tux-map__panel-viol-msg {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.35;
}

.tux-map__panel-viol-fix {
  margin: 0;
  color: var(--text-secondary);
  font-size: 11.5px;
  line-height: 1.35;
}

.tux-map__trace-picker {
  margin-top: 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tux-map__trace-menu {
  padding: 0.45rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tux-map__trace-input {
  min-height: var(--tux-map-target);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
}

.tux-map__trace-list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.tux-map__trace-opt {
  width: 100%;
  box-sizing: border-box;
  min-height: var(--tux-map-target);
  padding: 0.25rem 0.45rem;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.08rem;
}

.tux-map__trace-opt:hover,
.tux-map__trace-opt:focus-visible {
  background: var(--tux-map-brand-tint);
}

.tux-map__trace-opt-nm {
  font-family: var(--font-bold);
  font-weight: 700;
}

.tux-map__trace-opt-sub {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-muted);
}

.tux-map__trace-hops {
  margin: 0.15rem 0 0;
  padding-left: 1.2rem;
  font-size: 11.5px;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.tux-map__trace-hops code {
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.tux-map__trace-at {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-muted);
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
  grid-template-columns: 1.6rem minmax(0, 1fr) auto auto;
  column-gap: 0.35rem;
  align-items: center;
  font-size: 12px;
}

.tux-map__blast-trace {
  min-width: var(--tux-map-target);
  min-height: var(--tux-map-target);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-raised);
  color: var(--text-primary);
  font: inherit;
  font-family: var(--font-bold);
  font-size: 10.5px;
  font-weight: 700;
  cursor: pointer;
}

.tux-map__blast-trace:hover,
.tux-map__blast-trace:focus-visible {
  background: var(--tux-map-brand-tint);
  border-color: var(--brand-primary);
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
  min-height: var(--tux-map-target);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
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

.tux-map__panel-vendored {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8125rem;
}

.tux-map__panel-vend-canon {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
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
  color: var(--tux-map-brand-ink);
  text-decoration: none;
  word-break: break-all;
}

.tux-map__source-lnk {
  min-height: var(--tux-map-target);
  box-sizing: border-box;
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

/* Accessible List View (#124: bounded height so a 400-file folder stays < 2 viewports) */
.tux-map__list {
  max-height: min(72vh, 680px);
  overflow-y: auto;
  padding-right: 0.25rem;
}

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

/* The list view is the map in full text: no row of a card is cut there (#258) */
.tux-map__list .tux-map__el-nm > span,
.tux-map__list .tux-map__el-ty,
.tux-map__list .tux-map__el-st {
  white-space: normal;
  overflow-wrap: anywhere;
}

.tux-map__list .tux-map__el-ds {
  -webkit-line-clamp: unset;
}

.tux-map__list .tux-map__el-ft {
  max-height: none;
}

/* In the flow (the list view, a narrow map, a narrow map with the outline) the panel is
   `relative`, not `static`: its close button is placed against it. Against the canvas it
   floated over the first row of the list (#205) */
.tux-map__canvas--list .tux-map__panel {
  position: relative;
  inset: auto;
  transform: none;
  visibility: visible;
  width: auto;
  max-height: none;
  margin-top: 1rem;
  box-shadow: none;
}

/* With the outline open the list's details stay under the list, beside the outline. Auto-placed,
   they fell into the outline's 236px column (#205) */
.tux-map__canvas--list.tux-map__canvas--with-outline .tux-map__panel {
  grid-column: 2;
}

@container tux-map (max-width: 760px) {
  .tux-map__canvas--list.tux-map__canvas--with-outline .tux-map__panel {
    grid-column: 1 / -1;
  }
}

.tux-map__canvas--list .tux-map__panel:not(.tux-map__panel--open) {
  display: none;
}

/* Keyboard Shortcuts Modal (#117) */
.tux-map__shortcuts-backdrop {
  position: fixed;
  inset: 0;
  z-index: 92;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 12, 12, 0.54);
}

.tux-map__shortcuts-dialog {
  width: min(460px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--brand-primary);
  background: var(--surface-raised);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.34);
  color: var(--text-primary);
}

.tux-map__shortcuts-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tux-map__shortcuts-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
}

.tux-map__shortcuts-dl {
  margin: 0;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 0.45rem 0.9rem;
  align-items: baseline;
  font-size: 0.8125rem;
}

.tux-map__shortcuts-dl dt {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-primary);
}

.tux-map__shortcuts-dl dd {
  margin: 0;
  color: var(--text-secondary);
}

.tux-map__shortcuts-dl kbd {
  display: inline-block;
  padding: 0.08rem 0.38rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-border);
  background: var(--surface-sunken);
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

/* Windows High Contrast / Forced Colors (#117 & #123): distinct dash patterns & system strokes */
@media (forced-colors: active) {
  /* the level mark would be drawn solid (#260) */
  .tux-map__level-mark {
    display: none;
  }

  .tux-map__wire {
    stroke: CanvasText;
    stroke-width: 1.5;
  }

  .tux-map__wire-fg {
    stroke: Highlight;
    stroke-width: 2.4;
  }

  .tux-map__wire-fg--blast {
    stroke: Highlight;
    stroke-width: 3.4;
    stroke-dasharray: 10 4;
  }

  .tux-map__wire-fg--blast.tux-map__wire-fg--stream {
    display: none;
  }

  .tux-map__wire--violation,
  .tux-map__wire-fg--violation {
    stroke: LinkText;
    stroke-width: 3.2;
    stroke-dasharray: 2 4;
  }

  .tux-map__wire-fg--trace {
    stroke: Highlight;
    stroke-width: 3.8;
    stroke-dasharray: none;
  }

  .tux-map__el[aria-pressed="true"],
  .tux-map__el--diff-direct,
  .tux-map__el--trace {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }

  .tux-map__el--diff-impact {
    outline: 2px dashed Highlight;
    outline-offset: 2px;
  }

  /* A faded card (#229) steps back by its surface and its hatch, and forced colours drop both: it
     would read as a lit card. It takes GrayText, the system's colour for what is not active, for its
     border and every line of its text; the key's swatch follows (#233) */
  .tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit),
  .tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) *,
  .tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit) [class],
  .tux-map__swatch--faded {
    border-color: GrayText;
    color: GrayText;
  }
}

/* When the Outline rail (236px) is open on medium/tablet widths, stack the details drawer below instead of crushing the canvas */
@container tux-map (max-width: 920px) {
  .tux-map__canvas--with-outline .tux-map__panel {
    grid-column: 1 / -1;
    position: relative;
    inset: auto;
    transform: none;
    visibility: visible;
    width: auto;
    max-height: none;
    margin-top: 0.5rem;
    box-shadow: none;
  }

  .tux-map__canvas--with-outline .tux-map__panel:not(.tux-map__panel--open) {
    display: none;
  }
}

/* A narrow map (a phone, a sidebar): the details follow the diagram instead of covering it */
@container tux-map (max-width: 640px) {
  .tux-map__panel {
    position: relative;
    inset: auto;
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
  .tux-map__proximity-tether--on .tux-map__proximity-beam,
  .tux-map__zoom-hud,
  .tux-map__wheel-veil {
    animation: none;
  }
}
</style>
