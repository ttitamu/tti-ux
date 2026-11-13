/**
 * packages/diagrams/app/utils/internal/tuxArchitectureMapStage.ts
 *
 * What `<TuxArchitectureMap>` draws at one level, the "stage": its cards,
 * wires, boundaries and their rectangles. Plain functions with explicit
 * inputs, so the component holds two computeds and no layout code (#158).
 *
 * Every level is built in two steps:
 *
 *   base  `buildStageBase`  reads the model and the focus only: vendored
 *                           copies folded, the cards inside, the grid or bands
 *                           they sit on, which pairs the code links cover.
 *   lift  `buildStageData`  applies the toggles to a base: planned visibility,
 *                           wire categories, split outside cards. It places the
 *                           cards, lifts the links onto the view and fills the
 *                           wire details.
 *
 * A toggle therefore runs the lift step alone. A base is never changed after it
 * is built: the lift step copies what it has to change.
 *
 * This module is internal to the package. It is imported by the component
 * only, is not part of the published runtime (`runtime/`), and is not
 * auto-imported (Nuxt scans the top level of `app/utils`).
 */
import {
  GRID_METRICS,
  TUX_MAP_LINK_KIND_LABELS,
  classifyLinkDependencyCategory,
  cmpCodepoint,
  filterLinksByCategories,
  foldVendoredCopies,
  gridCellToPx,
  hasOwn,
  isKindNodeId,
  liftLinksToView,
  liftToSet,
  mapAncestorsOf,
  plainElementKindLabel,
  stripNodeKindPrefix,
  type TuxMapDeploymentNode,
  type TuxMapDeploymentZone,
  type TuxMapGridCellRect,
  type TuxMapLevelElement,
  type TuxMapNormalizedModel,
  type TuxMapNormalizedSubgraph,
  type TuxMapLevelRel,
  type TuxMapLiftedSide,
  type TuxMapLink,
  type TuxMapLinkViolation,
  type TuxMapPlacedBoundary,
  type TuxMapRoutedLabel,
  type TuxMapWireCategory,
  type TuxMapWireInspectorDetail,
} from "../tuxArchitectureMap";

// ============================================================================
// Types
// ============================================================================

/** @internal */
export interface OutsideCardMeta {
  ownerLabel?: string;
  parts?: number;
  splittable?: boolean;
  alsoInParts?: number;
  isOverflowRollup?: boolean;
}

/**
 * An outside card's one resting wire, and the card-by-card wires it opens into.
 * @internal
 */
export interface StageExpandableSide {
  id: string;
  aggregate: TuxMapLevelRel;
  wires: TuxMapLevelRel[];
}

/** @internal */
export interface ComputedStageData {
  els: TuxMapLevelElement[];
  deployNodes: TuxMapDeploymentNode[];
  rels: TuxMapLevelRel[];
  listRels: TuxMapLevelRel[];
  expandableSides: StageExpandableSide[];
  bounds: TuxMapPlacedBoundary[];
  rects: Record<string, TuxMapGridCellRect>;
  outsideLinkCounts: Record<string, number>;
  outsideMetaById: Record<string, OutsideCardMeta>;
  displayNameById: Record<string, string>;
  wireDetails: Record<string, TuxMapWireInspectorDetail>;
  foldedToRepresentative: ReadonlyMap<string, string>;
  codeEdgeHoverIds: Set<string>;
  innerCardCount: number;
  moreOutside: number;
  width: number;
  height: number;
}

/**
 * The model as the component holds it once loaded. Nothing here changes with a toggle.
 * @internal
 */
export interface StageModelContext {
  model: TuxMapNormalizedModel;
  /** `resolveModelRawLinks(model)` */
  rawLinks: TuxMapLink[];
  /** Every element of the model by id */
  lookup: Record<string, TuxMapLevelElement>;
  /** Every deployment node by id */
  resById: Record<string, TuxMapDeploymentNode>;
  parentOf: Map<string, string>;
}

/**
 * What the reader switches on a view. A change here runs the lift step only.
 *
 * The component passes getters, so a level that does not read a toggle (split cards above
 * Level 5, say) is not rebuilt when that toggle changes.
 * @internal
 */
export interface StageToggles {
  showPlanned: boolean;
  wireCategories: ReadonlySet<TuxMapWireCategory>;
  splitIds: ReadonlySet<string>;
  /** In how many other parts the directory of an outside card also appears */
  countOtherSharedParts: (id: string, el?: TuxMapLevelElement) => number;
}

type FoldedView = ReturnType<typeof foldVendoredCopies>;
type LiftedView = ReturnType<typeof liftLinksToView>;

interface DeploymentRegion {
  title: string;
  planned?: boolean;
  /** Every node of the region's zones, in model order, planned ones included */
  nodes: TuxMapDeploymentNode[];
}

/** @internal */
export interface Level1StageBase {
  level: 1;
  ctx: StageModelContext;
  folded: FoldedView;
}

/** @internal */
export interface Level2StageBase {
  level: 2;
  ctx: StageModelContext;
  folded: FoldedView;
  /** For each pair of cards a code link joins: the categories of those links */
  codePairCategories: Map<string, Set<TuxMapWireCategory>>;
  boundaryLabel: string;
  boundaryOf: string[];
}

/** @internal */
export interface Level4StageBase {
  level: 4;
  ctx: StageModelContext;
  leftRegions: DeploymentRegion[];
  rightRegions: DeploymentRegion[];
  centerRegionTitle: string;
  groups: { g: { id: string; title: string }; nodes: TuxMapDeploymentNode[] }[];
}

interface StageBand {
  title: string;
  items: TuxMapLevelElement[];
  rows: number;
  yOffset: number;
  height: number;
}

/**
 * Level 3 (the components of one container) and Level 5+ (one subgraph): the cards inside a boundary.
 * @internal
 */
export interface ViewStageBase {
  level: number;
  ctx: StageModelContext;
  /** The container or node whose inside is on stage */
  fId: string;
  sg: TuxMapNormalizedSubgraph | null;
  parentDn: TuxMapDeploymentNode | undefined;
  boundaryLabel: string;
  boundaryType: string;
  baseKids: TuxMapLevelElement[];
  folded: FoldedView;
  kids: TuxMapLevelElement[];
  kidIds: string[];
  /** Pairs of inner cards a code link joins, in any category */
  codeCoveredInnerPairs: Set<string>;
  /** Level 3 only: for each pair of Level 2 cards a code link joins, the categories of those links */
  boundaryPairCategories: Map<string, Set<TuxMapWireCategory>>;
  useBands: boolean;
  cols: number;
  bands: StageBand[];
  gridH: number;
}

/** @internal */
export type StageBase = Level1StageBase | Level2StageBase | ViewStageBase | Level4StageBase;

interface RawBoundary {
  id?: string;
  label: string;
  type: string;
  cls?: string;
  of: string[];
  box?: { x: number; y: number; w: number; h: number };
}

/** A level's cards and wires before planned ones are dropped and rectangles are computed. */
interface StageDraft {
  rawEls: TuxMapLevelElement[];
  rawRels: TuxMapLevelRel[];
  rawListRels: TuxMapLevelRel[];
  rawBounds: RawBoundary[];
  innerCardCount: number;
  activeFocusContainerId: string;
  foldedLinks: TuxMapLink[];
  foldedToRepresentative: ReadonlyMap<string, string>;
  codeEdgeCounts: Record<string, number>;
  outsideMetaById: Record<string, OutsideCardMeta>;
  wireDetails: Record<string, TuxMapWireInspectorDetail>;
  codeEdgeHoverIds: Set<string>;
  expandableSides: StageExpandableSide[];
}

// ============================================================================
// Shared helpers
// ============================================================================

/** @internal */
export function wirePairKey(from: string, to: string): string {
  return `${from}\u0000${to}`;
}

// ----------------------------------------------------------------------------
// What a card's text needs (#205)
//
// A card has a fixed height, set here, and its rows are drawn by the stylesheet.
// Nothing measured the text against the height, so a card with one row more
// than its height allows had its last row cut by its own bottom edge. The
// numbers below are the stylesheet's (`.tux-map__el` and its rows, in px at the
// stage's own scale): change one side and change the other.
// ----------------------------------------------------------------------------

/**
 * Advance widths of the printable ASCII characters (space to `~`) in the title face, Work Sans
 * Bold, read from the font in a browser. One character per character: its code less 8 is the
 * width in hundredths of an em (`A` is 68, `i` is 29, `W` is 100).
 */
const TITLE_CHAR_WIDTHS =
  "%&5MHfI!..CD%=%)H3DCIBFEGF&&DDDDeLLLPGEPR(FMDcRRKRMHIOLlJHG/)/E>:DGAGB0@F%%F)fFDGG3=0F@bC@<2(2D";

/**
 * The width of a card title in px, estimated: no font is measured, so the stage is the same on a
 * server, in a test and in a browser. A character outside ASCII counts as a wide letter, and the
 * sum is taken 4% wide, so an estimate errs wide and a title is given a second line sooner than
 * it needs one: the cost of that is a few pixels of room, the cost of the other a cut row.
 * @internal
 */
export function estimateCardTitleWidth(text: string, fontPx: number): number {
  let em = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    em += code >= 32 && code < 127 ? TITLE_CHAR_WIDTHS.charCodeAt(code - 32) - 8 : 93;
  }
  return (em / 100) * fontPx * 1.04;
}

/** Text widths inside a 212px card: the card less its padding, border, icon and the icon's gap. */
const MINI_TITLE_WIDTH = 168;
const CARD_TITLE_WIDTH = 165;
/** A card with a `+` badge keeps 24px clear of it. */
const ZOOM_BADGE_CLEARANCE = 24;

/**
 * The lines an inner card's title takes: 1 or 2 (the stylesheet clamps a title at two).
 * @internal
 */
export function cardTitleLines(name: string, zoomable: boolean): 1 | 2 {
  const width = CARD_TITLE_WIDTH - (zoomable ? ZOOM_BADGE_CLEARANCE : 0);
  return estimateCardTitleWidth(name, 14) > width ? 2 : 1;
}

/**
 * The height of an outside card, from the rows it shows: its title on one line or two, the line
 * that says where it lives, its type and its chips. Every outside card was 60px, which holds a
 * one-line title and one more row: the chips of every card were cut by its bottom edge, and a card
 * with a two-line title or an owner line lost them altogether.
 *
 * Whether the card will carry a `+` is not known here, so the title is measured against the
 * narrower width.
 * @internal
 */
export function outsideCardHeight(name: string, rows: { owner?: boolean; type?: boolean } = {}): number {
  const twoLines = estimateCardTitleWidth(name, 13) > MINI_TITLE_WIDTH - ZOOM_BADGE_CLEARANCE;
  // padding and border 16.4, a title line 17 (the icon's height), the chips 19, a 1.6 gap per row
  let h = 16.4 + (twoLines ? 31.2 : 17) + 1.6 + 19;
  if (rows.type !== false) h += 14.3 + 1.6;
  if (rows.owner) h += 13.2 + 1.6;
  return Math.ceil(h);
}

/**
 * How many lines of its description an inner card of height `height` has room for, 0 to 2, after
 * the rows that are always shown in full. The description was the row that gave way, by however
 * many pixels were missing, so its last line was cut through the letters.
 * @internal
 */
export function cardDescriptionLines(
  height: number,
  rows: { titleLines: 1 | 2; type: boolean; runsOn: boolean; footer: boolean },
): 0 | 1 | 2 {
  const GAP = 2.56;
  // padding and border 20.4; a title line is 17 (the icon's height), two are 33.6
  let used = 20.4 + (rows.titleLines === 2 ? 33.6 : 17);
  if (rows.type) used += 14.3 + GAP;
  if (rows.runsOn) used += 13 + GAP;
  if (rows.footer) used += 19.2 + GAP;
  const lines = Math.floor((height - used - GAP) / 16.2);
  return lines >= 2 ? 2 : lines === 1 ? 1 : 0;
}

/** @internal */
export function middleEllipsizeFolderName(name: string, kind?: string, id?: string, maxLen = 28): string {
  const isFolderLike =
    kind === "folder" ||
    (id ? isKindNodeId(id, "d") : false) ||
    (name.includes("/") && !name.includes(" "));
  if (!isFolderLike || name.length <= maxLen) return name;
  const parts = name.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const head = parts[0]!;
    const tail = parts[parts.length - 1]!;
    if (head.length + tail.length + 3 <= maxLen) {
      return `${head}/…/${tail}`;
    }
  }
  const keep = Math.max(4, Math.floor((maxLen - 1) / 2));
  return `${name.slice(0, keep)}…${name.slice(name.length - keep)}`;
}

function mergeWireDetails(
  a: TuxMapWireInspectorDetail | undefined,
  b: TuxMapWireInspectorDetail,
  from: string,
  to: string,
): TuxMapWireInspectorDetail {
  if (!a) {
    return { ...b, from, to };
  }
  const kindCounts = new Map<string, number>();
  for (const pk of a.perKindCounts) kindCounts.set(pk.kind, (kindCounts.get(pk.kind) ?? 0) + pk.count);
  for (const pk of b.perKindCounts) kindCounts.set(pk.kind, (kindCounts.get(pk.kind) ?? 0) + pk.count);
  const perKindCounts = [...kindCounts.entries()]
    .sort((x, y) => y[1] - x[1] || cmpCodepoint(x[0], y[0]))
    .map(([kind, count]) => ({
      kind,
      count,
      label: (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) ? TUX_MAP_LINK_KIND_LABELS[kind] : undefined) || kind,
    }));
  const seenViol = new Set<string>();
  const violations: TuxMapLinkViolation[] = [];
  for (const v of [...a.violations, ...b.violations]) {
    const vk = `${v.rule}\u0000${v.message ?? ""}\u0000${v.fix ?? ""}`;
    if (!seenViol.has(vk)) {
      seenViol.add(vk);
      violations.push(v);
    }
  }
  return {
    from,
    to,
    totalCount: perKindCounts.reduce((acc, item) => acc + item.count, 0),
    perKindCounts,
    cutKinds: perKindCounts.slice(2),
    links: [...a.links, ...b.links],
    violations,
  };
}

const isShown = (status: string | undefined, showPlanned: boolean): boolean =>
  showPlanned || status !== "planned";

/** The dependency category of a hand-authored relationship, read from its label and its ends' paths. */
function relCategory(r: TuxMapLevelRel, lookup: Record<string, TuxMapLevelElement>): TuxMapWireCategory {
  const rawKind = (r.label || "").trim().toLowerCase();
  const fromPath = hasOwn(lookup, r.from) ? lookup[r.from]?.source?.path : undefined;
  const toPath = hasOwn(lookup, r.to) ? lookup[r.to]?.source?.path : undefined;
  return classifyLinkDependencyCategory({
    from: fromPath || r.from,
    to: toPath || r.to,
    kind: rawKind || "uses",
    at: fromPath,
  });
}

/**
 * Lifts every code link onto a set of cards and records, per pair it joins, the categories of
 * the links behind it. A hand-authored relationship over such a pair is shown when one of those
 * categories is active.
 */
function collectCodePairCategories(
  links: readonly TuxMapLink[],
  endpoints: ReadonlySet<string>,
  parentOf: Map<string, string>,
): Map<string, Set<TuxMapWireCategory>> {
  const out = new Map<string, Set<TuxMapWireCategory>>();
  for (const l of links) {
    const lf = liftToSet(l.from, endpoints, parentOf);
    const lt = liftToSet(l.to, endpoints, parentOf);
    if (lf && lt && lf !== lt) {
      const pk = wirePairKey(lf, lt);
      let cats = out.get(pk);
      if (!cats) {
        cats = new Set();
        out.set(pk, cats);
      }
      cats.add(classifyLinkDependencyCategory(l));
    }
  }
  return out;
}

/** Whether a hand-authored relationship is drawn under the active wire categories. */
function isRelAllowed(
  r: TuxMapLevelRel,
  codePairCategories: ReadonlyMap<string, ReadonlySet<TuxMapWireCategory>>,
  active: ReadonlySet<TuxMapWireCategory>,
  lookup: Record<string, TuxMapLevelElement>,
): boolean {
  const cats = codePairCategories.get(wirePairKey(r.from, r.to));
  if (!cats) return active.has(relCategory(r, lookup));
  for (const c of cats) {
    if (active.has(c)) return true;
  }
  return false;
}

function newDraft(folded: FoldedView): StageDraft {
  return {
    rawEls: [],
    rawRels: [],
    rawListRels: [],
    rawBounds: [],
    innerCardCount: 0,
    activeFocusContainerId: "",
    foldedLinks: folded.links,
    foldedToRepresentative: folded.foldedToRepresentative,
    codeEdgeCounts: Object.create(null),
    outsideMetaById: Object.create(null),
    wireDetails: Object.create(null),
    codeEdgeHoverIds: new Set<string>(),
    expandableSides: [],
  };
}

// ============================================================================
// Level 4: deployment
// ============================================================================

const LEFT_ZONE_IDS: ReadonlySet<string> = new Set(["people", "entra", "identity"]);

function buildLevel4Base(ctx: StageModelContext): Level4StageBase {
  const M = ctx.model;
  const all = M.level4.nodes;

  // One pass over the nodes; a region or group then reads its own list
  const indexByZone = new Map<string, number[]>();
  const nodesByGroup = new Map<unknown, TuxMapDeploymentNode[]>();
  all.forEach((n, i) => {
    if (n.zone) {
      const at = indexByZone.get(n.zone);
      if (at) at.push(i);
      else indexByZone.set(n.zone, [i]);
    }
    const inGroup = nodesByGroup.get(n.group);
    if (inGroup) inGroup.push(n);
    else nodesByGroup.set(n.group, [n]);
  });
  const region = (r: { title: string; zones: string[]; planned?: boolean }): DeploymentRegion => {
    const indexes: number[] = [];
    for (const z of new Set(r.zones)) {
      const at = indexByZone.get(z);
      if (at) indexes.push(...at);
    }
    // A node has one zone, so no index repeats; sorting restores model order across zones
    indexes.sort((a, b) => a - b);
    return { title: r.title, planned: r.planned, nodes: indexes.map((i) => all[i]!) };
  };

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
        .filter((z) => z.column === "left" || (!z.column && LEFT_ZONE_IDS.has(z.id)))
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
            (!z.column && z.column !== "center" && !LEFT_ZONE_IDS.has(z.id)),
        )
        .map((z) => ({
          title: z.title,
          zones: z.zones?.length ? [z.id, ...z.zones] : [z.id],
          planned: z.planned,
        }))
    : defaultRightRegions;

  return {
    level: 4,
    ctx,
    leftRegions: leftRegions.map(region),
    rightRegions: rightRegions.map(region),
    centerRegionTitle:
      M.level4.centerTitle ||
      customZones?.find((z) => z.column === "center")?.title ||
      "Cloud Region · Resource Groups",
    groups: M.level4.groups.map((g) => ({ g, nodes: nodesByGroup.get(g.id) ?? [] })),
  };
}

function liftLevel4(base: Level4StageBase, toggles: StageToggles): ComputedStageData {
  const { PAD, NW, NH } = GRID_METRICS;
  const { showPlanned } = toggles;
  const shown = (n: TuxMapDeploymentNode) => showPlanned || n.status !== "planned";
  const nodes = base.ctx.model.level4.nodes.filter(shown);
  const rects: Record<string, TuxMapGridCellRect> = Object.create(null);
  const bounds: TuxMapPlacedBoundary[] = [];
  const top = PAD + 6;

  function placeList(list: TuxMapDeploymentNode[], bx: number, by: number, cols: number) {
    list.forEach((n, i) => {
      const nx = bx + (i % cols) * (NW + 16);
      const ny = by + Math.floor(i / cols) * (NH + 14);
      rects[n.id] = { x: nx, y: ny, w: NW, h: NH };
    });
  }

  function placeColumn(regions: DeploymentRegion[], x: number): number {
    let y = top;
    for (const r of regions) {
      const list = r.nodes.filter(shown);
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

  const leftEnd = placeColumn(base.leftRegions, PAD + 14);

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

  for (const { g, nodes: groupNodes } of base.groups) {
    const list = groupNodes.filter(shown);
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
    label: base.centerRegionTitle,
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
  const rightEnd = placeColumn(base.rightRegions, rx);

  const W = rx + NW + PAD;
  const H = Math.max(leftEnd, top + azH, rightEnd) + PAD;
  return {
    els: [],
    deployNodes: nodes,
    rels: [],
    listRels: [],
    bounds,
    rects,
    outsideLinkCounts: Object.create(null),
    outsideMetaById: Object.create(null),
    displayNameById: Object.create(null),
    wireDetails: Object.create(null),
    foldedToRepresentative: new Map(),
    codeEdgeHoverIds: new Set(),
    expandableSides: [],
    innerCardCount: nodes.length,
    moreOutside: 0,
    width: W,
    height: H,
  };
}

// ============================================================================
// Level 1: system context
// ============================================================================

function buildLevel1Base(ctx: StageModelContext): Level1StageBase {
  const M = ctx.model;
  return { level: 1, ctx, folded: foldVendoredCopies(M.level1.elements, M.level1.rels, ctx.rawLinks) };
}

function liftLevel1(base: Level1StageBase, toggles: StageToggles): StageDraft {
  const draft = newDraft(base.folded);
  draft.rawEls = base.folded.elements;
  draft.rawRels = base.folded.rels;
  draft.rawListRels = base.folded.rels;
  const { showPlanned } = toggles;
  draft.innerCardCount = draft.rawEls.filter((e) => isShown(e.status, showPlanned)).length;
  return draft;
}

// ============================================================================
// Level 2: containers
// ============================================================================

function buildLevel2Base(ctx: StageModelContext): Level2StageBase {
  const { model: M, lookup } = ctx;
  const baseL2 = M.level2.elements.map((e) =>
    e.ref && hasOwn(lookup, e.id) ? { ...lookup[e.id]!, ...e } : { ...e, name: e.name ?? e.id },
  );
  const folded = foldVendoredCopies(baseL2, M.level2.rels, ctx.rawLinks);
  const endpoints = new Set(folded.elements.map((e) => e.id));
  const boundTarget = hasOwn(lookup, M.level2.boundary) ? lookup[M.level2.boundary] : undefined;
  return {
    level: 2,
    ctx,
    folded,
    codePairCategories: collectCodePairCategories(folded.links, endpoints, ctx.parentOf),
    boundaryLabel: boundTarget ? boundTarget.name : "Primary System",
    boundaryOf: folded.elements.filter((e) => !e.ref).map((e) => e.id),
  };
}

function liftLevel2(base: Level2StageBase, toggles: StageToggles): StageDraft {
  const draft = newDraft(base.folded);
  draft.rawEls = base.folded.elements;
  const { showPlanned, wireCategories } = toggles;
  const rels = base.folded.rels.filter((r) =>
    isRelAllowed(r, base.codePairCategories, wireCategories, base.ctx.lookup),
  );
  draft.rawRels = rels;
  draft.rawListRels = rels;
  draft.innerCardCount = draft.rawEls.filter((e) => !e.ref && isShown(e.status, showPlanned)).length;
  draft.rawBounds.push({ label: base.boundaryLabel, type: "Software system", of: base.boundaryOf });
  return draft;
}

// ============================================================================
// Level 3 and Level 5+: the cards inside one boundary
// ============================================================================

function buildViewBase(
  ctx: StageModelContext,
  level: number,
  focusId: string | null,
  subgraph: TuxMapNormalizedSubgraph | null,
): ViewStageBase {
  const { CH, GY } = GRID_METRICS;
  const { model: M, lookup, resById, parentOf } = ctx;
  const level3Kids = (id: string | null): TuxMapLevelElement[] | undefined =>
    id && hasOwn(M.level3, id) ? M.level3[id] : undefined;

  const sg = level >= 5 ? subgraph : null;
  const fId =
    level >= 5
      ? focusId || Object.keys(M.subgraphs)[0] || "c-api"
      : focusId && level3Kids(focusId)
        ? focusId
        : Object.keys(M.level3)[0] || "c-api";

  const parentEl = hasOwn(lookup, fId) ? lookup[fId] : undefined;
  const parentDn = hasOwn(resById, fId) ? resById[fId] : undefined;
  const cName = parentEl?.name || parentDn?.title || fId;
  const cKind = parentEl?.kind || parentDn?.kind || "container";
  const cTech = parentEl?.tech || parentDn?.facts?.type || "";

  const baseKids = (sg ? sg.elements : level3Kids(fId) || []).map((k, i) => ({
    ...k,
    id: k.id || `${fId}/${i}`,
    kind: k.kind ?? "component",
    parent: fId,
  }));
  const folded = foldVendoredCopies(baseKids, sg ? sg.rels : [], ctx.rawLinks);
  const kids = folded.elements;

  const useBands = kids.length > 24;
  const cols = useBands
    ? 4
    : Math.min(4, Math.max(2, Math.ceil(Math.sqrt(Math.max(1, kids.length) * 1.6))));
  const rows = Math.max(1, Math.ceil(kids.length / cols));

  // Level 3 shows the container's Level 2 relationships at its boundary
  let boundaryPairCategories = new Map<string, Set<TuxMapWireCategory>>();
  if (level === 3) {
    const l2StageSet = new Set(M.level2.elements.map((e) => e.id));
    l2StageSet.add(fId);
    boundaryPairCategories = collectCodePairCategories(folded.links, l2StageSet, parentOf);
  }

  // Which inner pairs the model's code links cover, whatever their category
  const kidIds = kids.map((k) => k.id);
  const kidIdSet = new Set(kidIds);
  const codeCoveredInnerPairs = new Set<string>();
  for (const l of folded.links) {
    const lf = liftToSet(l.from, kidIdSet, parentOf);
    const lt = liftToSet(l.to, kidIdSet, parentOf);
    if (lf && lt && lf !== lt) {
      codeCoveredInnerPairs.add(wirePairKey(lf, lt));
    }
  }

  // Inner grid or horizontal bands (#124: > 24 inner cards group into horizontal bands)
  const bands: StageBand[] = [];
  let gridH = rows * CH + (rows - 1) * GY;
  if (useBands) {
    const folderCounts = new Map<string, number>();
    for (const k of kids) {
      const sp = k.source?.path || "";
      const slash = sp.indexOf("/");
      if (slash > 0) {
        const topDir = sp.slice(0, slash);
        folderCounts.set(topDir, (folderCounts.get(topDir) ?? 0) + 1);
      }
    }
    const bandMap = new Map<string, TuxMapLevelElement[]>();
    for (const k of kids) {
      const sp = k.source?.path || "";
      const slash = sp.indexOf("/");
      const topDir = slash > 0 ? sp.slice(0, slash) : "";
      const key =
        topDir && (folderCounts.get(topDir) ?? 0) >= 2
          ? `${topDir}/`
          : plainElementKindLabel(k);
      let arr = bandMap.get(key);
      if (!arr) {
        arr = [];
        bandMap.set(key, arr);
      }
      arr.push(k);
    }
    let cursor = 0;
    for (const [title, items] of bandMap) {
      const bRows = Math.max(1, Math.ceil(items.length / cols));
      const bContentH = bRows * CH + (bRows - 1) * GY;
      bands.push({
        title,
        items,
        rows: bRows,
        yOffset: cursor,
        height: bContentH,
      });
      cursor += bContentH + 62;
    }
    gridH = Math.max(CH, cursor - 62 + 34);
  }

  return {
    level,
    ctx,
    fId,
    sg,
    parentDn,
    boundaryLabel: cName,
    boundaryType: sg?.stratum || plainElementKindLabel(cKind) + (cTech ? `: ${cTech}` : ""),
    baseKids,
    folded,
    kids,
    kidIds,
    codeCoveredInnerPairs,
    boundaryPairCategories,
    useBands,
    cols,
    bands,
    gridH,
  };
}

function liftView(base: ViewStageBase, toggles: StageToggles): StageDraft {
  const { CW, CH, GX, GY, PAD, MH } = GRID_METRICS;
  const { ctx, fId, sg, parentDn, baseKids, folded, kids, kidIds, codeCoveredInnerPairs, useBands, cols, gridH } = base;
  const { model: M, lookup, resById, parentOf } = ctx;
  const { showPlanned, wireCategories: activeWireCats } = toggles;

  const draft = newDraft(folded);
  const { rawEls, rawRels, rawListRels, rawBounds, codeEdgeCounts, outsideMetaById, wireDetails } = draft;
  const { codeEdgeHoverIds, expandableSides } = draft;
  draft.activeFocusContainerId = fId;
  draft.innerCardCount = kids.filter((e) => isShown(e.status, showPlanned)).length;

  // The outside cards of each side, in the order they are stacked; the sets answer "already there?"
  const ins: string[] = [];
  const outs: string[] = [];
  const insSet = new Set<string>();
  const outsSet = new Set<string>();
  const addIn = (id: string) => {
    if (!insSet.has(id)) {
      insSet.add(id);
      ins.push(id);
    }
  };
  const addOut = (id: string) => {
    if (!outsSet.has(id)) {
      outsSet.add(id);
      outs.push(id);
    }
  };

  let allowedL3BoundaryRels: TuxMapLevelRel[] = [];
  if (base.level === 3) {
    allowedL3BoundaryRels = M.level2.rels.filter(
      (r) =>
        isShown(r.status, showPlanned) && isRelAllowed(r, base.boundaryPairCategories, activeWireCats, lookup),
    );
    for (const r of allowedL3BoundaryRels) {
      if (r.to === fId) addIn(r.from);
      if (r.from === fId) addOut(r.to);
    }
  } else if (parentDn) {
    for (const l of M.level4.links) {
      if (!showPlanned && l.state === "planned") continue;
      if (l.to === fId) addIn(l.from);
      if (l.from === fId) addOut(l.to);
    }
  }

  // The model's code links, lifted onto this view via LCA rollup (#118): wires between the cards
  // inside and, below Level 4, at most 12 outside cards per side (11 + 1 overflow rollup when > 12).
  const lifted: LiftedView | null = folded.links.length
    ? liftLinksToView(folded.links, fId, kidIds, parentOf, {
        isKnown: (id) => Boolean(hasOwn(lookup, id) || hasOwn(resById, id)),
        lift: "lca",
        splitIds: toggles.splitIds,
        categories: activeWireCats,
        maxPerSide: 12,
      })
    : null;

  if (lifted) {
    for (const [wk, wd] of Object.entries(lifted.wireDetails)) {
      wireDetails[wk] = wd;
    }
  }

  const codeEdge = base.level >= 5 && !parentDn ? lifted : null;
  const shownInsSides: TuxMapLiftedSide[] = [];
  const shownOutsSides: TuxMapLiftedSide[] = [];
  const outsAlsoOnIns = new Map<string, TuxMapLiftedSide>();
  let overflowInCard: TuxMapLevelElement | null = null;
  let overflowOutCard: TuxMapLevelElement | null = null;

  if (codeEdge) {
    const hasInOverflow = codeEdge.moreIns > 0 && codeEdge.ins.length >= 12;
    const inSlice = hasInOverflow ? codeEdge.ins.slice(0, 11) : codeEdge.ins;
    for (const o of inSlice) {
      shownInsSides.push(o);
      addIn(o.id);
      codeEdgeCounts[o.id] = (codeEdgeCounts[o.id] ?? 0) + o.count;
      outsideMetaById[o.id] = {
        ...outsideMetaById[o.id],
        parts: o.parts,
        splittable: o.splittable,
      };
    }
    if (hasInOverflow) {
      const dropped = codeEdge.ins.slice(11);
      const remBuckets = codeEdge.moreIns + dropped.length;
      const remParts =
        codeEdge.moreInsParts + dropped.reduce((acc, s) => acc + (s.parts ?? 1), 0);
      const remLinks =
        codeEdge.moreInsLinks + dropped.reduce((acc, s) => acc + s.count, 0);
      const moreInId = `@more-in:${fId}`;
      // Stacked last whatever is already there, as an id of this form is no card of the model
      ins.push(moreInId);
      insSet.add(moreInId);
      codeEdgeCounts[moreInId] = remLinks;
      outsideMetaById[moreInId] = {
        parts: remParts,
        splittable: false,
        isOverflowRollup: true,
      };
      overflowInCard = {
        id: moreInId,
        kind: "component",
        name: `+${remBuckets} more dependent${remBuckets === 1 ? "" : "s"}`,
        desc: `${remParts} outside part${remParts === 1 ? "" : "s"} (${remLinks} link${remLinks === 1 ? "" : "s"})`,
      };
      const moreInWireKey = wirePairKey(moreInId, "@bound");
      for (const oid of [...dropped.map((s) => s.id), ...codeEdge.overflowInIds]) {
        const det = wireDetails[wirePairKey(oid, "@bound")];
        if (det) {
          wireDetails[moreInWireKey] = mergeWireDetails(wireDetails[moreInWireKey], det, moreInId, "@bound");
        }
      }
    }

    // Separate outs that already share a card on `ins` from distinct right-hand cards
    const distinctOuts: TuxMapLiftedSide[] = [];
    for (const o of codeEdge.outs) {
      if (insSet.has(o.id)) {
        outsAlsoOnIns.set(o.id, o);
        codeEdgeCounts[o.id] = (codeEdgeCounts[o.id] ?? 0) + o.count;
      } else {
        distinctOuts.push(o);
      }
    }

    const hasOutOverflow = codeEdge.moreOuts > 0 && distinctOuts.length >= 12;
    const outSlice = hasOutOverflow ? distinctOuts.slice(0, 11) : distinctOuts.slice(0, 12);
    for (const o of outSlice) {
      shownOutsSides.push(o);
      addOut(o.id);
      codeEdgeCounts[o.id] = (codeEdgeCounts[o.id] ?? 0) + o.count;
      outsideMetaById[o.id] = {
        ...outsideMetaById[o.id],
        parts: o.parts,
        splittable: o.splittable,
      };
    }
    if (codeEdge.moreOuts > 0 || distinctOuts.length > outSlice.length) {
      const dropped = distinctOuts.slice(outSlice.length);
      const remBuckets = codeEdge.moreOuts + dropped.length;
      const remParts =
        codeEdge.moreOutsParts + dropped.reduce((acc, s) => acc + (s.parts ?? 1), 0);
      const remLinks =
        codeEdge.moreOutsLinks + dropped.reduce((acc, s) => acc + s.count, 0);
      const moreOutId = `@more-out:${fId}`;
      outs.push(moreOutId);
      outsSet.add(moreOutId);
      codeEdgeCounts[moreOutId] = remLinks;
      outsideMetaById[moreOutId] = {
        parts: remParts,
        splittable: false,
        isOverflowRollup: true,
      };
      overflowOutCard = {
        id: moreOutId,
        kind: "component",
        name: `+${remBuckets} more dependenc${remBuckets === 1 ? "y" : "ies"}`,
        desc: `${remParts} outside part${remParts === 1 ? "" : "s"} (${remLinks} link${remLinks === 1 ? "" : "s"})`,
      };
      const moreOutWireKey = wirePairKey("@bound", moreOutId);
      for (const oid of [...dropped.map((s) => s.id), ...codeEdge.overflowOutIds]) {
        const det = wireDetails[wirePairKey("@bound", oid)];
        if (det) {
          wireDetails[moreOutWireKey] = mergeWireDetails(wireDetails[moreOutWireKey], det, "@bound", moreOutId);
        }
      }
    }

    for (const s of [...shownInsSides, ...shownOutsSides, ...outsAlsoOnIns.values()]) {
      codeEdgeHoverIds.add(s.id);
      for (const w of s.wires) codeEdgeHoverIds.add(w.kid);
    }
  }

  const resolvePerimeterCard = (id: string): TuxMapLevelElement | null => {
    if (overflowInCard && id === overflowInCard.id) return overflowInCard;
    if (overflowOutCard && id === overflowOutCard.id) return overflowOutCard;
    if (hasOwn(lookup, id)) return lookup[id]!;
    const dn = hasOwn(resById, id) ? resById[id] : undefined;
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

  // Outside cards show their owning container/component on its own `.tux-map__el-own` line (#116)
  const edgeCard = (id: string): TuxMapLevelElement | null => {
    const card = resolvePerimeterCard(id);
    if (!card) return null;
    if (codeEdge && parentOf.has(id)) {
      const where = mapAncestorsOf(id, parentOf)
        .slice(1)
        .reverse()
        .map((a) => (hasOwn(lookup, a) ? lookup[a]?.name : undefined) || (hasOwn(resById, a) ? resById[a]?.title : undefined))
        .filter(Boolean)
        .join(" › ");
      if (where) {
        outsideMetaById[id] = {
          ...outsideMetaById[id],
          ownerLabel: `in ${where}`,
          alsoInParts: toggles.countOtherSharedParts(id, card),
        };
      }
    }
    return card;
  };

  // The outside cards of each side and the height each needs for its rows (#205)
  const STACK_GAP = 14;
  const stackOf = (ids: string[]) => {
    const cards = ids.map((id) => edgeCard(id));
    const heights = cards.map((card, i) =>
      card
        ? outsideCardHeight(middleEllipsizeFolderName(card.name, card.kind, card.id, 24), {
            owner: Boolean(outsideMetaById[ids[i]!]?.ownerLabel),
          })
        : MH,
    );
    const offsets: number[] = [];
    let height = 0;
    heights.forEach((h, i) => {
      offsets.push(height);
      height += h + (i < heights.length - 1 ? STACK_GAP : 0);
    });
    return { cards, heights, offsets, height };
  };
  const inStack = stackOf(ins);
  const outStack = stackOf(outs);

  // Place the inner cards: the grid's height is the base's, its offset follows the taller outside stack
  const H = Math.max(gridH, inStack.height, outStack.height);
  const top = PAD + 40;
  const innerStartY = top + (H - gridH) / 2;

  if (useBands) {
    let globalRow = 0;
    for (const band of base.bands) {
      const bandTopY = innerStartY + band.yOffset + 28;
      band.items.forEach((k, idx) => {
        const col = 1 + (idx % cols);
        const rInBand = Math.floor(idx / cols);
        const absRow = globalRow + rInBand;
        rawEls.push({
          ...k,
          at: [col, absRow],
          px: [PAD + col * (CW + GX), bandTopY + rInBand * (CH + GY), CH],
        });
      });
      rawBounds.push({
        label: band.title,
        type: `${band.items.length}`,
        cls: "band",
        of: [],
        box: {
          x: PAD + CW + GX - 12,
          y: bandTopY - 26,
          w: cols * CW + (cols - 1) * GX + 24,
          h: band.height + 38,
        },
      });
      globalRow += band.rows;
    }
  } else {
    kids.forEach((k, i) => {
      const col = 1 + (i % cols);
      const row = Math.floor(i / cols);
      rawEls.push({
        ...k,
        at: [col, row],
        px: [PAD + col * (CW + GX), innerStartY + row * (CH + GY), CH],
      });
    });
  }

  kids.forEach((k) => {
    if (k.next != null && folded.rels.length === 0 && codeCoveredInnerPairs.size === 0) {
      const nextKid = baseKids[k.next];
      const nextId = nextKid?.id || `${fId}/${k.next}`;
      const stepRel: TuxMapLevelRel = {
        from: k.id,
        to: nextId,
        label: "",
        status: k.status,
      };
      if (activeWireCats.has(relCategory(stepRel, lookup))) {
        rawRels.push(stepRel);
        rawListRels.push(stepRel);
      }
    }
  });

  // Code links stand in for any inner pair they cover; truly hand-authored rels remain if in active categories
  const uncoveredHandRels = folded.rels.filter(
    (r) => !codeCoveredInnerPairs.has(wirePairKey(r.from, r.to)) && activeWireCats.has(relCategory(r, lookup)),
  );
  if (lifted) {
    const combinedInner = [...lifted.rels, ...uncoveredHandRels];
    rawRels.push(...combinedInner);
    rawListRels.push(...combinedInner);
  } else if (uncoveredHandRels.length) {
    rawRels.push(...uncoveredHandRels);
    rawListRels.push(...uncoveredHandRels);
  }

  inStack.cards.forEach((card, i) => {
    if (!card) return;
    rawEls.push({
      ...card,
      at: [0, i],
      side: "in",
      mini: true,
      px: [PAD, Math.round(top + (H - inStack.height) / 2 + inStack.offsets[i]!), inStack.heights[i]!],
    });
  });

  outStack.cards.forEach((card, i) => {
    if (!card) return;
    rawEls.push({
      ...card,
      at: [cols + 1, i],
      side: "out",
      mini: true,
      px: [
        PAD + (cols + 1) * (CW + GX),
        Math.round(top + (H - outStack.height) / 2 + outStack.offsets[i]!),
        outStack.heights[i]!,
      ],
    });
  });

  if (base.level === 3) {
    for (const r of allowedL3BoundaryRels) {
      if (r.to === fId) {
        rawRels.push({ ...r, to: "@bound" });
        rawListRels.push(r);
      } else if (r.from === fId) {
        rawRels.push({ ...r, from: "@bound" });
        rawListRels.push(r);
      }
    }
  } else if (parentDn) {
    for (const l of M.level4.links) {
      if (!showPlanned && l.state === "planned") continue;
      if (l.to === fId) {
        rawRels.push({ from: l.from, to: "@bound", label: l.label });
        rawListRels.push({ from: l.from, to: fId, label: l.label });
      } else if (l.from === fId) {
        rawRels.push({ from: "@bound", to: l.to, label: l.label });
        rawListRels.push({ from: fId, to: l.to, label: l.label });
      }
    }
  }

  if (codeEdge) {
    const collectSideViolations = (o: TuxMapLiftedSide): TuxMapLinkViolation[] | undefined => {
      const outV: TuxMapLinkViolation[] = [];
      const seen = new Set<string>();
      for (const w of o.wires) {
        for (const v of w.violations ?? []) {
          const vk = `${v.rule}\u0000${v.message ?? ""}\u0000${v.fix ?? ""}`;
          if (!seen.has(vk)) {
            seen.add(vk);
            outV.push(v);
          }
        }
      }
      return outV.length ? outV : undefined;
    };

    for (const o of shownInsSides) {
      for (const w of o.wires) {
        rawListRels.push({ from: o.id, to: w.kid, label: w.label, violations: w.violations });
      }
      const aggKey = wirePairKey(o.id, "@bound");
      if (!hasOwn(wireDetails, aggKey)) {
        for (const w of o.wires) {
          const det = wireDetails[wirePairKey(o.id, w.kid)];
          if (det) wireDetails[aggKey] = mergeWireDetails(wireDetails[aggKey], det, o.id, "@bound");
        }
      }
      const aggViol = collectSideViolations(o);
      const aggregate: TuxMapLevelRel = {
        from: o.id,
        to: "@bound",
        label: `${o.count} ${o.count === 1 ? "link" : "links"}`,
        ...(aggViol ? { violations: aggViol } : {}),
      };
      rawRels.push(aggregate);
      expandableSides.push({
        id: o.id,
        aggregate,
        wires: o.wires.map((w) => ({ from: o.id, to: w.kid, label: w.label, violations: w.violations })),
      });
    }

    for (const o of [...shownOutsSides, ...outsAlsoOnIns.values()]) {
      for (const w of o.wires) {
        rawListRels.push({ from: w.kid, to: o.id, label: w.label, violations: w.violations });
      }
      const aggKey = wirePairKey("@bound", o.id);
      if (!hasOwn(wireDetails, aggKey)) {
        for (const w of o.wires) {
          const det = wireDetails[wirePairKey(w.kid, o.id)];
          if (det) wireDetails[aggKey] = mergeWireDetails(wireDetails[aggKey], det, "@bound", o.id);
        }
      }
      const aggViol = collectSideViolations(o);
      const aggregate: TuxMapLevelRel = {
        from: "@bound",
        to: o.id,
        label: `${o.count} ${o.count === 1 ? "link" : "links"}`,
        ...(aggViol ? { violations: aggViol } : {}),
      };
      rawRels.push(aggregate);
      expandableSides.push({
        id: o.id,
        aggregate,
        wires: o.wires.map((w) => ({ from: w.kid, to: o.id, label: w.label, violations: w.violations })),
      });
    }

    if (overflowInCard) {
      rawRels.push({
        from: overflowInCard.id,
        to: "@bound",
        label: `${codeEdgeCounts[overflowInCard.id] ?? 0} links`,
      });
    }
    if (overflowOutCard) {
      rawRels.push({
        from: "@bound",
        to: overflowOutCard.id,
        label: `${codeEdgeCounts[overflowOutCard.id] ?? 0} links`,
      });
    }
  }

  rawBounds.push({
    id: "@bound",
    label: base.boundaryLabel,
    type: base.boundaryType,
    of: [],
    box: {
      x: PAD + CW + GX - 24,
      y: top - 40,
      w: cols * CW + (cols - 1) * GX + 48,
      h: H + 64,
    },
  });

  return draft;
}

// ============================================================================
// Levels 1, 2, 3 and 5+: from a draft to the stage
// ============================================================================

/**
 * Drops what is planned when planned things are hidden, fills the wire details the lift did not,
 * names cards that would read alike, and computes every rectangle.
 */
function finishStage(
  base: Level1StageBase | Level2StageBase | ViewStageBase,
  draft: StageDraft,
  toggles: StageToggles,
): ComputedStageData {
  const { CW, CH, PAD } = GRID_METRICS;
  const { model: M, lookup, resById, parentOf } = base.ctx;
  const { showPlanned, wireCategories: activeWireCats } = toggles;
  const { activeFocusContainerId, codeEdgeCounts, wireDetails, expandableSides } = draft;

  const els = draft.rawEls.filter((e) => isShown(e.status, showPlanned));
  const rels = draft.rawRels.filter((r) => isShown(r.status, showPlanned));
  const listRels = draft.rawListRels.filter((r) => isShown(r.status, showPlanned));

  // Populate `wireDetails` for C4 / Level 1..3 wires not already populated by `liftLinksToView` (#115)
  if (rels.length > 0) {
    const stageEndpointIds = new Set(els.map((e) => e.id));
    const innerStageIds = new Set(els.filter((e) => !e.mini).map((e) => e.id));
    if (activeFocusContainerId) stageEndpointIds.add(activeFocusContainerId);
    const l2ContainerSet = new Set(
      M.level2.elements.filter((e) => !e.ref).map((e) => e.id),
    );
    const boundaryOnStage = base.level === 1 && stageEndpointIds.has(M.level2.boundary);
    // An id lifts to the same card whichever link names it: looked up once
    const liftedEnd = new Map<string, string | null>();
    const liftForStagePair = (id: string): string | null => {
      const known = liftedEnd.get(id);
      if (known !== undefined) return known;
      let found: string | null = null;
      for (const anc of mapAncestorsOf(id, parentOf)) {
        if (stageEndpointIds.has(anc)) {
          found = anc === activeFocusContainerId ? "@bound" : anc;
          break;
        }
        if (boundaryOnStage && l2ContainerSet.has(anc)) {
          found = M.level2.boundary;
          break;
        }
      }
      liftedEnd.set(id, found);
      return found;
    };
    const filteredCodeLinks =
      base.level === 1
        ? draft.foldedLinks
        : filterLinksByCategories(draft.foldedLinks, activeWireCats);
    const groupedByPair = new Map<string, TuxMapLink[]>();
    const pushPairLink = (pk: string, link: TuxMapLink) => {
      let arr = groupedByPair.get(pk);
      if (!arr) {
        arr = [];
        groupedByPair.set(pk, arr);
      }
      arr.push(link);
    };
    for (const l of filteredCodeLinks) {
      const sf = liftForStagePair(l.from);
      const st = liftForStagePair(l.to);
      if (!sf || !st || sf === st) continue;
      pushPairLink(wirePairKey(sf, st), l);
      if (activeFocusContainerId && sf !== "@bound" && !innerStageIds.has(sf) && innerStageIds.has(st)) {
        pushPairLink(wirePairKey(sf, "@bound"), l);
      } else if (activeFocusContainerId && st !== "@bound" && innerStageIds.has(sf) && !innerStageIds.has(st)) {
        pushPairLink(wirePairKey("@bound", st), l);
      }
    }
    for (const r of [...rels, ...expandableSides.flatMap((side) => side.wires)]) {
      const wk = wirePairKey(r.from, r.to);
      if (hasOwn(wireDetails, wk)) continue;
      const matched = groupedByPair.get(wk) ?? [];
      const kindMap = new Map<string, number>();
      for (const ml of matched) {
        const k = ml.kind || "uses";
        kindMap.set(k, (kindMap.get(k) ?? 0) + 1);
      }
      const perKindCounts = [...kindMap.entries()]
        .sort((a, b) => b[1] - a[1] || cmpCodepoint(a[0], b[0]))
        .map(([kind, count]) => ({
          kind,
          count,
          label: (hasOwn(TUX_MAP_LINK_KIND_LABELS, kind) ? TUX_MAP_LINK_KIND_LABELS[kind] : undefined) || kind,
        }));
      const seenV = new Set<string>();
      const violations: TuxMapLinkViolation[] = [];
      for (const v of r.violations ?? []) {
        const vk = `${v.rule}\u0000${v.message ?? ""}\u0000${v.fix ?? ""}`;
        if (!seenV.has(vk)) {
          seenV.add(vk);
          violations.push(v);
        }
      }
      for (const ml of matched) {
        for (const v of ml.violations ?? []) {
          const vk = `${v.rule}\u0000${v.message ?? ""}\u0000${v.fix ?? ""}`;
          if (!seenV.has(vk)) {
            seenV.add(vk);
            violations.push(v);
          }
        }
      }
      wireDetails[wk] = {
        from: r.from,
        to: r.to,
        totalCount: matched.length || 1,
        perKindCounts,
        cutKinds: perKindCounts.slice(2),
        links: matched.map((ml) => ({
          from: ml.from,
          to: ml.to,
          kind: ml.kind || "uses",
          ...(ml.at ? { at: ml.at } : {}),
          ...(ml.sites?.length ? { sites: [...ml.sites] } : {}),
          ...(ml.stop ? { stop: true } : {}),
          ...(ml.violations?.length ? { violations: ml.violations } : {}),
        })),
        violations,
      };
    }
  }

  // Disambiguate sibling cards that share identical visible names on the same view (#116),
  // including post-ellipsis collisions, shared immediate parent dirs (`src/index.ts`), and trailing `/` ancestors.
  const displayNameById: Record<string, string> = Object.create(null);
  const buildDisambiguationCandidates = (e: TuxMapLevelElement): string[] => {
    const maxChars = e.mini ? 24 : 28;
    const isFolder = e.kind === "folder" || isKindNodeId(e.id, "d") || e.name.endsWith("/");
    const initial = middleEllipsizeFolderName(e.name, e.kind, e.id, maxChars);
    const trimmedName = e.name.replace(/^\/+|\/+$/g, "");
    const nameParts = trimmedName.split("/").filter(Boolean);
    const rawLeaf = nameParts[nameParts.length - 1] || trimmedName || e.name;
    const leaf = isFolder ? `${rawLeaf}/` : rawLeaf;

    const parentSegs: string[] = [];
    const pushSeg = (seg: string) => {
      const clean = seg.trim().replace(/^\/+|\/+$/g, "");
      if (!clean || clean === rawLeaf && parentSegs.length === 0) return;
      if (parentSegs[parentSegs.length - 1] !== clean) parentSegs.push(clean);
    };
    const sp = (e.source?.path || "").replace(/^\/+|\/+$/g, "");
    if (sp.includes("/")) {
      const spParts = sp.split("/").filter(Boolean);
      const limit = spParts[spParts.length - 1] === rawLeaf ? spParts.length - 1 : spParts.length;
      for (let i = limit - 1; i >= 0; i--) pushSeg(spParts[i]!);
    }
    if (nameParts.length > 1) {
      for (let i = nameParts.length - 2; i >= 0; i--) pushSeg(nameParts[i]!);
    }
    for (const ancId of mapAncestorsOf(e.id, parentOf).slice(1)) {
      const ancRaw =
        (hasOwn(lookup, ancId) ? lookup[ancId]?.name : undefined) ||
        (hasOwn(resById, ancId) ? resById[ancId]?.title : undefined) ||
        "";
      const ancParts = ancRaw.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
      for (let i = ancParts.length - 1; i >= 0; i--) pushSeg(ancParts[i]!);
    }

    // Candidates in the order they are tried; the set answers "already listed?"
    const candidates: string[] = [initial];
    const listed = new Set<string>(candidates);
    const addCandidate = (c: string) => {
      if (!listed.has(c)) {
        listed.add(c);
        candidates.push(c);
      }
    };
    for (let depth = 1; depth <= parentSegs.length; depth++) {
      const chain = parentSegs.slice(0, depth).reverse();
      const fullCandidate = `${chain.join("/")}/${leaf}`;
      const formatted =
        fullCandidate.length <= maxChars + 8
          ? fullCandidate
          : `${chain[0]}/…/${leaf}`;
      addCandidate(formatted);
      if (formatted !== fullCandidate) addCandidate(fullCandidate);
    }
    const strippedId = stripNodeKindPrefix(e.id);
    if (strippedId) addCandidate(strippedId);
    addCandidate(e.id);
    return candidates;
  };

  for (const group of [els.filter((e) => Boolean(e.mini)), els.filter((e) => !e.mini)]) {
    if (!group.length) continue;
    const candsById = new Map<string, string[]>();
    const roundById = new Map<string, number>();
    for (const e of group) {
      const cands = buildDisambiguationCandidates(e);
      candsById.set(e.id, cands);
      roundById.set(e.id, 0);
      displayNameById[e.id] = cands[0]!;
    }
    for (let pass = 0; pass < 8; pass++) {
      const counts = new Map<string, number>();
      for (const e of group) {
        const cur = displayNameById[e.id]!;
        counts.set(cur, (counts.get(cur) ?? 0) + 1);
      }
      let advanced = false;
      for (const e of group) {
        const cur = displayNameById[e.id]!;
        if ((counts.get(cur) ?? 0) > 1) {
          const cands = candsById.get(e.id)!;
          const nextRound = (roundById.get(e.id) ?? 0) + 1;
          if (nextRound < cands.length) {
            roundById.set(e.id, nextRound);
            displayNameById[e.id] = cands[nextRound]!;
            advanced = true;
          }
        }
      }
      if (!advanced) break;
    }
  }

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
  const rects: Record<string, TuxMapGridCellRect> = Object.create(null);
  const bounds: TuxMapPlacedBoundary[] = [];
  let W = 0;
  let H = 0;

  for (const b of draft.rawBounds) {
    let box = b.box;
    if (!box) {
      // The boundary wraps the grid cells of the cards it names
      const of = new Set(b.of);
      let c0 = Infinity;
      let c1 = -Infinity;
      let r0 = Infinity;
      let r1 = -Infinity;
      let any = false;
      for (const e of els) {
        if (!e.at || !of.has(e.id)) continue;
        any = true;
        c0 = Math.min(c0, e.at[0]);
        c1 = Math.max(c1, e.at[0]);
        r0 = Math.min(r0, e.at[1]);
        r1 = Math.max(r1, e.at[1]);
      }
      if (!any) continue;
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
      cls: b.cls,
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
    listRels,
    expandableSides,
    bounds,
    rects,
    outsideLinkCounts,
    outsideMetaById: draft.outsideMetaById,
    displayNameById,
    wireDetails,
    foldedToRepresentative: draft.foldedToRepresentative,
    codeEdgeHoverIds: draft.codeEdgeHoverIds,
    innerCardCount: draft.innerCardCount,
    // `@more-in` / `@more-out` rollup cards already display all remaining outside dependents/dependencies on stage
    moreOutside: 0,
    width: Math.max(680, W),
    height: Math.max(420, H),
  };
}

// ============================================================================
// Entry points
// ============================================================================

/**
 * The part of a level's stage that follows from the model and the focus alone.
 *
 * `subgraph` is the subgraph of `focusId` as the component resolves it (aliases, `subgraphRef`);
 * it is read at Level 5 and deeper.
 * @internal
 */
export function buildStageBase(
  ctx: StageModelContext,
  level: number,
  focusId: string | null,
  subgraph: TuxMapNormalizedSubgraph | null,
): StageBase {
  if (level === 4) return buildLevel4Base(ctx);
  if (level === 1) return buildLevel1Base(ctx);
  if (level === 2) return buildLevel2Base(ctx);
  if (level === 3 || level >= 5) return buildViewBase(ctx, level, focusId, subgraph);
  // No such level: an empty stage
  return {
    level: 1,
    ctx,
    folded: { elements: [], rels: [], links: ctx.rawLinks, foldedToRepresentative: new Map() },
  };
}

/**
 * The stage of a base under the reader's toggles.
 * @internal
 */
export function buildStageData(base: StageBase, toggles: StageToggles): ComputedStageData {
  switch (base.level) {
    case 4:
      return liftLevel4(base as Level4StageBase, toggles);
    case 1:
      return finishStage(base as Level1StageBase, liftLevel1(base as Level1StageBase, toggles), toggles);
    case 2:
      return finishStage(base as Level2StageBase, liftLevel2(base as Level2StageBase, toggles), toggles);
    default:
      return finishStage(base as ViewStageBase, liftView(base as ViewStageBase, toggles), toggles);
  }
}

// ============================================================================
// A wire label's button (#210)
// ============================================================================

/**
 * What the template binds on a wire label's button: where it hangs, and what it is called.
 *
 * The router gives the box it kept clear of the cards. A label at a left or right port hangs by
 * the edge that faces the card and one at a top or bottom port is centred on its box, so text that
 * is drawn narrower than estimated stays at the port, and `max-width` keeps wider text inside the
 * box. The short text is what is drawn; the name and the tooltip carry the whole of it. The
 * technology label at the target end opens the same popover as the label at the source end, so it
 * is left out of the Tab order.
 * @internal
 */
export function wireLabelAttrs(lbl: TuxMapRoutedLabel) {
  const name = `${lbl.full ?? lbl.t1}${lbl.planned ? " (planned)" : ""}${lbl.violating ? " (rule violation)" : ""}`;
  const left = lbl.side === "l" ? lbl.x + lbl.w : lbl.side === "r" ? lbl.x : lbl.x + lbl.w / 2;
  return {
    "data-end": lbl.end,
    "data-side": lbl.side,
    "data-planned": lbl.planned ? "" : undefined,
    tabindex: lbl.t2 ? -1 : undefined,
    title: name,
    "aria-label": `Inspect wire ${name}${lbl.t2 ? ", at its target" : ""}`,
    style: { left: `${left}px`, top: `${lbl.y + lbl.h / 2}px`, maxWidth: `${lbl.w}px` },
  };
}
