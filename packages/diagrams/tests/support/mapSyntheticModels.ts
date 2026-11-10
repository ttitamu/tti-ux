/**
 * Synthetic architecture-map models shared by the unit tests and the map
 * benchmark (`tti/tti-ux#153`). Test support only: nothing here is imported by
 * `app/` or `runtime/`, and the package's `files` list does not ship it.
 *
 * Two families:
 *
 * - The fixed fixtures the unit tests have always used (a flat 2,500-node
 *   component, a 2,650-file link tree, a dense routed view, a 2,400-entry
 *   Go-To model). They were inline in `diagrams.test.ts`; they live here so the
 *   benchmark draws the same shapes instead of a second copy.
 * - `buildSyntheticMapModel`, a seeded generator for whole repositories at a
 *   chosen symbol count (system -> containers -> components -> folders ->
 *   files -> symbols, with code links and lazy subgraphs). No `Math.random`:
 *   the same options give the same model, byte for byte, on every machine.
 */
import {
  GRID_METRICS,
  type TuxMapGridCellRect,
  type TuxMapLevelElement,
  type TuxMapLevelModel,
  type TuxMapLevelRel,
  type TuxMapLink,
  type TuxMapRouteEntry,
  type TuxMapSubgraph,
} from "../../app/utils/tuxArchitectureMap";

// ---------------------------------------------------------------------------
// Seeded randomness
// ---------------------------------------------------------------------------

export interface SeededRandom {
  /** Uniform float in [0, 1). */
  next(): number;
  /** Uniform integer in [min, max], both inclusive. */
  int(min: number, max: number): number;
  /** One item of a non-empty list. */
  pick<T>(items: readonly T[]): T;
}

/** mulberry32: 32 bits of state, good enough to shape a test model, and tiny. */
export function createSeededRandom(seed: number): SeededRandom {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  return {
    next,
    int,
    pick: (items) => items[int(0, items.length - 1)]!,
  };
}

// ---------------------------------------------------------------------------
// Fixed fixtures (extracted from diagrams.test.ts)
// ---------------------------------------------------------------------------

/** One component holding `count` flat module cards with long descriptions (unknown-ID and paging tests, #111). */
export function buildFlatModuleModel(count = 2496): TuxMapLevelModel {
  const largeElements = Array.from({ length: count }, (_, i) => ({
    id: `f:packages/mod_${String(i).padStart(4, "0")}/service_${i}.ts`,
    kind: "module" as const,
    name: `service_${i}.ts`,
    desc: "A".repeat(160),
  }));
  return {
    level1: { elements: [{ id: "sys-big", kind: "system", name: "Big System" }], rels: [] },
    level2: {
      boundary: "sys-big",
      elements: [{ id: "c-core", kind: "container", name: "Core Container" }],
      rels: [],
    },
    level3: {
      "c-core": [{ id: "c-core/app", kind: "component", name: "App Component" }],
    },
    level4: {
      groups: [{ id: "rg-1", zone: "cloud-prod", title: "rg-1" }],
      nodes: [{ id: "vm-1", group: "rg-1", kind: "vm", title: "vm-1", role: "Host", hosts: ["c-core"] }],
      links: [],
    },
    subgraphs: {
      "c-core/app": { elements: largeElements },
    },
    links: [],
  };
}

/**
 * One container holding `count` files, each with a maximal signature and two
 * hashes, and one link per file to the file at a quarter of its index: a
 * repository-scale payload for the MCP size ceilings (#112).
 */
export function buildFileTreeLinkModel(count = 2650): {
  model: TuxMapLevelModel;
  elements: Array<Record<string, unknown>>;
  links: Array<{ from: string; to: string; kind: string }>;
} {
  const elements: Array<Record<string, unknown>> = [];
  const links: Array<{ from: string; to: string; kind: string }> = [];
  for (let i = 0; i < count; i += 1) {
    const fid = `f:pkg/mod_${i}.ts`;
    elements.push({
      id: fid,
      name: `mod_${i}.ts`,
      kind: i % 5 === 0 ? "test" : "file",
      source: {
        path: `pkg/mod_${i}.ts`,
        hash: `h_${i}_0123456789abcdef`,
        moduleHash: `mh_${i}_0123456789abcdef`,
        signature: `export function mod_${i}(${"arg: string, ".repeat(35)}): Promise<void>`,
      },
    });
    if (i > 0) {
      links.push({
        from: fid,
        to: `f:pkg/mod_${Math.floor(i / 4)}.ts`,
        kind: i % 5 === 0 ? "tests" : "imports",
      });
    }
  }
  const model = {
    level1: { elements: [{ id: "s-forge", name: "Platform", kind: "system" }], rels: [] },
    level2: {
      boundary: "s-forge",
      elements: [{ id: "c-gateway", name: "Gateway", kind: "container", deployed: ["vm-prod"] }],
      rels: [],
    },
    level4: {
      groups: [],
      nodes: [{ id: "vm-prod", title: "Prod VM", kind: "vm", hosts: ["c-gateway"] }],
      links: [],
    },
    subgraphs: { "c-gateway": { elements, rels: [] } } as unknown as TuxMapLevelModel["subgraphs"],
    links: links as unknown as TuxMapLevelModel["links"],
  } as TuxMapLevelModel;
  return { model, elements, links };
}

export interface DenseViewLayout {
  rects: Record<string, TuxMapGridCellRect>;
  els: TuxMapLevelElement[];
  /** Where the columns sit, for tests that check wires against the gaps between them. */
  frame: {
    leftX: number;
    rightX: number;
    outW: number;
    outH: number;
    innerOriginX: number;
    innerOriginY: number;
    innerSpanW: number;
    innerSpanH: number;
  };
}

/**
 * Places one view the way the stage does: a grid of inner cards inside the
 * `@bound` box, a column of compact outside cards on the left (`side: "in"`)
 * and one on the right (`side: "out"`). Ids and names are the caller's.
 */
export function layoutDenseView(opts: {
  inner: ReadonlyArray<{ id: string; name: string }>;
  ins: ReadonlyArray<{ id: string; name: string }>;
  outs: ReadonlyArray<{ id: string; name: string }>;
  cols: number;
}): DenseViewLayout {
  const { CW, CH, GX, GY } = GRID_METRICS;
  const rects: Record<string, TuxMapGridCellRect> = {};
  const els: TuxMapLevelElement[] = [];
  const cols = Math.max(1, opts.cols);
  const rows = Math.max(1, Math.ceil(opts.inner.length / cols));

  const outW = 176;
  const outH = 60;
  const leftX = 24;
  const innerOriginX = leftX + outW + GX;
  const innerOriginY = 96;

  opts.inner.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    rects[card.id] = {
      x: innerOriginX + col * (CW + GX),
      y: innerOriginY + row * (CH + GY),
      w: CW,
      h: CH,
    };
    els.push({ id: card.id, name: card.name, kind: "module" });
  });

  const innerSpanW = cols * CW + (cols - 1) * GX;
  const innerSpanH = rows * CH + (rows - 1) * GY;
  rects["@bound"] = {
    x: innerOriginX - 28,
    y: innerOriginY - 52,
    w: innerSpanW + 56,
    h: innerSpanH + 80,
    bound: true,
  };

  const rightX = innerOriginX + innerSpanW + GX;
  const sideCount = Math.max(opts.ins.length, opts.outs.length);
  for (let i = 0; i < sideCount; i++) {
    const y = innerOriginY + i * (outH + 26);
    const inCard = opts.ins[i];
    if (inCard) {
      rects[inCard.id] = { x: leftX, y, w: outW, h: outH, mini: true, side: "in" };
      els.push({ id: inCard.id, name: inCard.name, kind: "module", mini: true, side: "in" });
    }
    const outCard = opts.outs[i];
    if (outCard) {
      rects[outCard.id] = { x: rightX, y, w: outW, h: outH, mini: true, side: "out" };
      els.push({ id: outCard.id, name: outCard.name, kind: "module", mini: true, side: "out" });
    }
  }
  return { rects, els, frame: { leftX, rightX, outW, outH, innerOriginX, innerOriginY, innerSpanW, innerSpanH } };
}

/**
 * The dense routed view of #113: `rows` x `cols` inner cards, `perSide` outside
 * cards on each side, three wires per outside card and `innerRels` wires
 * between inner cards (long horizontal jumps, column jumps, diagonals, shared
 * corridors). The defaults are the 30-card, 16-outside, 100-wire case.
 */
export function buildDenseViewFixture(
  opts: { rows?: number; cols?: number; perSide?: number; innerRels?: number } = {},
): DenseViewLayout & { rels: TuxMapLevelRel[] } {
  const rows = opts.rows ?? 5;
  const cols = opts.cols ?? 6;
  const perSide = opts.perSide ?? 8;
  const innerRels = opts.innerRels ?? 52;

  const inner: { id: string; name: string }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      inner.push({ id: `in_${row}_${col}`, name: `Module ${row}:${col}` });
    }
  }
  const { rects, els, frame } = layoutDenseView({
    inner,
    ins: Array.from({ length: perSide }, (_, i) => ({ id: `out_in_${i}`, name: `Caller ${i}` })),
    outs: Array.from({ length: perSide }, (_, i) => ({ id: `out_out_${i}`, name: `Dep ${i}` })),
    cols,
  });

  const rels: TuxMapLevelRel[] = [];
  // Three outside-in -> inner wires per left card, across different rows and columns
  for (let i = 0; i < perSide; i++) {
    rels.push({ from: `out_in_${i}`, to: `in_${i % rows}_0`, label: "calls" });
    rels.push({ from: `out_in_${i}`, to: `in_${(i + 2) % rows}_1`, label: "imports" });
    rels.push({ from: `out_in_${i}`, to: `in_${(i + 4) % rows}_2`, label: "reads" });
  }
  // Three inner -> outside-out wires per right card
  for (let i = 0; i < perSide; i++) {
    rels.push({ from: `in_${i % rows}_${cols - 1}`, to: `out_out_${i}`, label: "calls" });
    rels.push({ from: `in_${(i + 1) % rows}_${cols - 2}`, to: `out_out_${i}`, label: "writes" });
    rels.push({ from: `in_${(i + 3) % rows}_${cols - 3}`, to: `out_out_${i}`, label: "sends" });
  }
  // Dense inner -> inner wires
  for (let k = 0; k < innerRels; k++) {
    const r1 = (k * 3) % rows;
    const c1 = k % cols;
    const r2 = (k * 2 + 1) % rows;
    let c2 = (k * 5 + 2) % cols;
    if (r1 === r2 && c1 === c2) c2 = (c2 + 1) % cols;
    rels.push({
      from: `in_${r1}_${c1}`,
      to: `in_${r2}_${c2}`,
      label: k % 4 === 0 ? `hop-${k}` : "",
    });
  }
  return { rects, els, rels, frame };
}

/**
 * 2,400 cross-level Go-To entries under one component: 120 folders, 901 files,
 * 1,250 functions and 131 routes (#120).
 */
export function buildGoToModel(): TuxMapLevelModel {
  const folders = Array.from({ length: 120 }, (_, i) => ({
    id: `d:bff/pkg_${String(i).padStart(3, "0")}`,
    kind: "module" as const,
    name: `pkg_${String(i).padStart(3, "0")}`,
    source: { path: `bff/pkg_${String(i).padStart(3, "0")}` },
  }));
  const files = Array.from({ length: 900 }, (_, i) => ({
    id: `f:bff/pkg_${String(i % 120).padStart(3, "0")}/mod_${i}.py`,
    kind: "module" as const,
    name: `mod_${i}.py`,
    tech: "Python",
    source: { path: `bff/pkg_${String(i % 120).padStart(3, "0")}/mod_${i}.py` },
  }));
  files.push({
    id: "f:bff/ttibff/forge.py",
    kind: "module",
    name: "forge.py",
    tech: "Python",
    source: { path: "bff/ttibff/forge.py" },
  });
  const funcs = Array.from({ length: 1250 }, (_, i) => ({
    id: `s:bff/pkg_${String(i % 120).padStart(3, "0")}/mod_${i % 900}.py#fn_${i}`,
    kind: "function" as const,
    name: `fn_handler_${i}`,
    source: {
      path: `bff/pkg_${String(i % 120).padStart(3, "0")}/mod_${i % 900}.py`,
      symbol: `fn_handler_${i}`,
      lineRange: [10, 25] as [number, number],
    },
  }));
  const routes = Array.from({ length: 130 }, (_, i) => ({
    method: i % 2 === 0 ? "GET" : "POST",
    pattern: `/v1/orgs/{org}/items/${i}`,
    handler: funcs[i]!.id,
    framework: "FastAPI",
  }));
  routes.push({
    method: "GET",
    pattern: "/v1/orgs/{org}/architecture",
    handler: "f:bff/ttibff/forge.py",
    framework: "FastAPI",
  });

  const subgraphs: TuxMapLevelModel["subgraphs"] = {
    "c-api/1": { elements: folders },
  };
  for (let i = 0; i < 120; i++) {
    const fId = folders[i]!.id;
    subgraphs[fId] = {
      elements: files.filter((fl) => fl.id.startsWith(`f:bff/pkg_${String(i).padStart(3, "0")}/`)),
    };
  }
  subgraphs["c-api/1"]!.elements.push(files[files.length - 1]!);
  subgraphs["f:bff/pkg_000/mod_0.py"] = { elements: funcs };

  return {
    level1: { elements: [{ id: "sys-code", kind: "system", name: "TTI Code" }], rels: [] },
    level2: {
      boundary: "sys-code",
      elements: [{ id: "c-api", kind: "container", name: "BFF Gateway", tech: "FastAPI" }],
      rels: [],
    },
    level3: {
      "c-api": [{ id: "c-api/1", kind: "component", name: "BFF Routes", tech: "Python" }],
    },
    level4: {
      groups: [{ id: "rg-prod", zone: "cloud-prod", title: "rg-prod" }],
      nodes: [{ id: "vm-code", group: "rg-prod", kind: "vm", title: "vm-code", role: "App VM", hosts: ["c-api"] }],
      links: [],
    },
    subgraphs,
    routes,
  };
}

// ---------------------------------------------------------------------------
// Seeded whole-repository generator
// ---------------------------------------------------------------------------

export interface SyntheticMapOptions {
  /** Symbols (functions, classes, constants) to aim for; the model lands within a few percent. */
  symbols: number;
  /** Cards in the views the benchmark opens: the hot folder's files and the hot file's symbols. */
  cardsPerView: number;
  /** PRNG seed; the default is the one the committed baseline was recorded with. */
  seed?: number;
}

export interface SyntheticMap {
  /** Raw input, as a consumer would pass it to the component (not sanitized, not collapsed). */
  model: TuxMapLevelModel;
  /** What `resolveSubgraph` returns for each lazy `subgraphRef`; none of it is in `model`. */
  lazySubgraphs: Record<string, TuxMapSubgraph>;
  /** The ids the benchmark scenarios open, hover, select and search for. */
  focus: {
    containerId: string;
    componentId: string;
    /** A folder holding `cardsPerView` files. */
    folderId: string;
    /** A file holding `cardsPerView` symbols: the deepest view. */
    fileId: string;
    /** A symbol in `fileId` that other parts depend on: the selection whose blast radius is walked. */
    symbolId: string;
    /** A file in `folderId` whose symbols arrive through `resolveSubgraph`. */
    lazyFileId: string;
    lazyRef: string;
  };
  /** Go-To queries with at least one hit: a symbol name, a path, a route, a short prefix. */
  queries: string[];
  counts: {
    containers: number;
    components: number;
    folders: number;
    files: number;
    symbols: number;
    links: number;
    lazyFiles: number;
    lazySymbols: number;
    routes: number;
  };
}

const SYMBOL_KINDS = ["function", "function", "function", "class", "constant"] as const;
const SPREAD_KINDS = ["calls", "calls", "calls", "imports", "uses"] as const;
const TECHS = ["TypeScript", "Python", "Go", "Rust"] as const;
const EXTS = ["ts", "py", "go", "rs"] as const;

interface GenFile {
  id: string;
  path: string;
  folderIdx: number;
  componentIdx: number;
  containerIdx: number;
  isTest: boolean;
  symbolIds: string[];
}

/**
 * A repository-shaped model at about `symbols` symbols:
 *
 * - Level 1: two people, the system, three outside systems.
 * - Level 2: containers (about one per 800 symbols, at least 2), each from
 *   its own repository (`source.repo`), with rels between them.
 * - Level 3: components, up to 6 per container.
 * - Below: folders (one single-child folder chain per container, so collapsing
 *   has work to do), files (6 to 12 per folder), symbols (6 to 14 per file). The total lands
 *   within a few percent of `symbols`.
 * - One hot folder with `cardsPerView` files and one hot file with
 *   `cardsPerView` symbols, a third of the way through the tree.
 * - Links: 2 to 5 per symbol, most to a symbol defined earlier in the same
 *   folder, some across the component, about one in ten to another container;
 *   plus file imports, test files that `tests` what they cover (stopping
 *   links), and doc `mentions`.
 * - The hot file's symbols also call each other (two wires a card), so the
 *   deepest view's wires grow with its cards.
 * - About 4% of files are lazy: a `subgraphRef` and no symbols until resolved.
 * - One route per 50 symbols, handled by a symbol.
 * - Level 4: one deployment node per container, two resource groups.
 */
export function buildSyntheticMapModel(opts: SyntheticMapOptions): SyntheticMap {
  const rnd = createSeededRandom(opts.seed ?? 153);
  const targetSymbols = Math.max(60, Math.floor(opts.symbols));
  const cardsPerView = Math.max(4, Math.floor(opts.cardsPerView));

  const containerCount = Math.max(2, Math.round(targetSymbols / 800));
  const containers: TuxMapLevelElement[] = [];
  const level3: Record<string, TuxMapLevelElement[]> = {};
  const subgraphs: Record<string, TuxMapSubgraph> = {};
  const lazySubgraphs: Record<string, TuxMapSubgraph> = {};
  const links: TuxMapLink[] = [];
  const routes: TuxMapRouteEntry[] = [];
  const files: GenFile[] = [];
  /** Every generated symbol id in definition order, with the file it belongs to. */
  const symbolOrder: { id: string; fileIdx: number }[] = [];

  // --- Plan the tree: folders to reach the symbol target, then components to hold them ---
  // A file averages 10 symbols and a folder 9 files; about 4% of files are lazy and hold none
  // until resolved, so a folder carries about 86 symbols. Each container also gets a small
  // single-child folder chain (about 38 symbols), and one folder and one file are sized to
  // `cardsPerView`.
  const fixedSymbols = cardsPerView + Math.round((cardsPerView - 2) * 10) + containerCount * 38;
  const plainFolders = Math.max(1, Math.ceil((targetSymbols - fixedSymbols) / 86));
  const componentCount = Math.min(
    containerCount * 6,
    Math.max(containerCount, Math.round(plainFolders / 2.5)),
  );
  const componentPlan: { containerIdx: number; folders: number }[] = Array.from(
    { length: componentCount },
    (_, k) => ({ containerIdx: k % containerCount, folders: 0 }),
  );
  for (let f = 0; f < plainFolders; f++) {
    // One each first, then at random: components are uneven but none is skipped while folders last
    const idx = f < componentCount ? f : rnd.int(0, componentCount - 1);
    componentPlan[idx]!.folders++;
  }
  const hotComponentIdx = Math.floor(componentPlan.length / 3);

  let folderSeq = 0;
  let fileSeq = 0;
  let symbolSeq = 0;
  let lazyFiles = 0;
  let lazySymbols = 0;
  let hotFolderId = "";
  let hotFileId = "";
  let hotFileIdx = -1;
  let lazyFileId = "";
  let lazyRef = "";
  const componentIds: string[] = [];
  const containerIdOf = (c: number) => `c-svc-${String(c).padStart(2, "0")}`;

  for (let c = 0; c < containerCount; c++) {
    const id = containerIdOf(c);
    containers.push({
      id,
      kind: c % 5 === 4 ? "database" : "container",
      name: `Service ${String(c).padStart(2, "0")}`,
      tech: TECHS[c % TECHS.length],
      desc: `Synthetic service ${c}: one repository, several components.`,
      deployed: [`vm-${String(c).padStart(2, "0")}`],
      source: { repo: `bench/svc-${String(c).padStart(2, "0")}`, path: "" },
    });
    level3[id] = [];
  }

  const addSymbols = (
    file: GenFile,
    fileIdx: number,
    count: number,
    into: TuxMapLevelElement[],
    lazy: boolean,
    benchView: boolean,
  ) => {
    for (let s = 0; s < count; s++) {
      const kind = SYMBOL_KINDS[rnd.int(0, SYMBOL_KINDS.length - 1)]!;
      const base = kind === "class" ? "Type" : kind === "constant" ? "CONST" : "fn";
      const name = `${base}_${symbolSeq++}`;
      const sid = `s:${file.path}#${name}`;
      const line = 10 + s * 14;
      into.push({
        id: sid,
        kind,
        name,
        tech: kind,
        source: { path: file.path, symbol: name, lineRange: [line, line + rnd.int(3, 12)] },
        // About one symbol in fifty is planned work; the benchmark's own views hold none, so they
        // show exactly `cardsPerView` cards with planned parts hidden.
        ...(rnd.next() < 0.02 && !benchView ? { status: "planned" as const } : {}),
      });
      if (!lazy) {
        file.symbolIds.push(sid);
        symbolOrder.push({ id: sid, fileIdx });
      }
    }
  };

  const addFolder = (
    compIdx: number,
    containerIdx: number,
    parentKey: string,
    parentPath: string,
    fileCount: number,
    hot: boolean,
  ): string => {
    const dirName = `pkg_${String(folderSeq++).padStart(3, "0")}`;
    const dirPath = `${parentPath}/${dirName}`;
    const dirId = `d:${dirPath}`;
    (subgraphs[parentKey] ??= { stratum: "Folders", elements: [] }).elements.push({
      id: dirId,
      kind: "folder",
      name: `${dirName}/`,
      source: { path: dirPath },
    });
    const fileEls: TuxMapLevelElement[] = [];
    subgraphs[dirId] = { stratum: "Files", elements: fileEls };
    const ext = EXTS[containerIdx % EXTS.length]!;
    for (let f = 0; f < fileCount; f++) {
      const isHotFile = hot && f === 0;
      const isLazyTarget = hot && f === 1;
      const isTest = !isHotFile && !isLazyTarget && rnd.next() < 0.12;
      const isLazy = isLazyTarget || (!isHotFile && !isTest && rnd.next() < 0.04);
      const stem = `${isTest ? "test_" : "mod_"}${fileSeq++}`;
      const path = `${dirPath}/${stem}.${ext}`;
      const fid = `f:${path}`;
      const file: GenFile = {
        id: fid,
        path,
        folderIdx: folderSeq - 1,
        componentIdx: compIdx,
        containerIdx,
        isTest,
        symbolIds: [],
      };
      const fileIdx = files.length;
      files.push(file);
      const el: TuxMapLevelElement = {
        id: fid,
        kind: "file",
        name: `${stem}.${ext}`,
        tech: TECHS[containerIdx % TECHS.length],
        source: { path },
      };
      if (isLazy) {
        const ref = `lazy:${path}`;
        el.subgraphRef = ref;
        const held: TuxMapLevelElement[] = [];
        const n = isLazyTarget ? cardsPerView : rnd.int(6, 14);
        addSymbols(file, fileIdx, n, held, true, isLazyTarget);
        lazySubgraphs[ref] = { stratum: "Symbols", elements: held };
        lazyFiles++;
        lazySymbols += n;
        if (isLazyTarget) {
          lazyFileId = fid;
          lazyRef = ref;
        }
      } else {
        const syms: TuxMapLevelElement[] = [];
        addSymbols(file, fileIdx, isHotFile ? cardsPerView : rnd.int(6, 14), syms, false, isHotFile);
        subgraphs[fid] = { stratum: "Symbols", elements: syms };
        if (isHotFile) {
          hotFileId = fid;
          hotFileIdx = fileIdx;
        }
      }
      fileEls.push(el);
    }
    if (hot) hotFolderId = dirId;
    return dirId;
  };

  componentPlan.forEach((plan, compIdx) => {
    const containerId = containerIdOf(plan.containerIdx);
    const compName = `core_${String(compIdx).padStart(2, "0")}`;
    const compId = `${containerId}/${compName}`;
    componentIds.push(compId);
    level3[containerId]!.push({
      id: compId,
      kind: "component",
      name: `Core ${String(compIdx).padStart(2, "0")}`,
      tech: TECHS[plan.containerIdx % TECHS.length],
      desc: `Synthetic component ${compIdx}.`,
      source: { path: `svc${plan.containerIdx}/${compName}` },
    });
    const compPath = `svc${plan.containerIdx}/${compName}`;
    for (let f = 0; f < plan.folders; f++) {
      addFolder(compIdx, plan.containerIdx, compId, compPath, rnd.int(6, 12), false);
    }
    if (compIdx === hotComponentIdx) {
      addFolder(compIdx, plan.containerIdx, compId, compPath, cardsPerView, true);
    }
    // The first component of each container carries a single-child folder chain: nested/only/pkg
    if (compIdx < containerCount) {
      const outerPath = `${compPath}/nested`;
      const outerId = `d:${outerPath}`;
      const innerPath = `${outerPath}/only`;
      const innerId = `d:${innerPath}`;
      (subgraphs[compId] ??= { stratum: "Folders", elements: [] }).elements.push({ id: outerId, kind: "folder", name: "nested/", source: { path: outerPath } });
      subgraphs[outerId] = {
        stratum: "Folders",
        elements: [{ id: innerId, kind: "folder", name: "only/", source: { path: innerPath } }],
      };
      addFolder(compIdx, plan.containerIdx, innerId, innerPath, rnd.int(3, 5), false);
    }
  });

  // --- Links ---
  const filesByFolder = new Map<number, number[]>();
  const filesByComponent = new Map<number, number[]>();
  files.forEach((f, i) => {
    (filesByFolder.get(f.folderIdx) ?? filesByFolder.set(f.folderIdx, []).get(f.folderIdx)!).push(i);
    (filesByComponent.get(f.componentIdx) ?? filesByComponent.set(f.componentIdx, []).get(f.componentIdx)!).push(i);
  });
  const symbolsOfFiles = (idxs: readonly number[]): string[] => idxs.flatMap((i) => files[i]!.symbolIds);
  const folderSymbols = new Map<number, string[]>();
  const componentSymbols = new Map<number, string[]>();
  for (const [k, v] of filesByFolder) folderSymbols.set(k, symbolsOfFiles(v));
  for (const [k, v] of filesByComponent) componentSymbols.set(k, symbolsOfFiles(v));

  const seen = new Set<string>();
  const addLink = (from: string, to: string, kind: string, extra: Partial<TuxMapLink> = {}) => {
    if (from === to) return false;
    const key = `${from}\u0000${to}\u0000${kind}`;
    if (seen.has(key)) return false;
    seen.add(key);
    links.push({ from, to, kind, ...extra });
    return true;
  };
  /** Mostly something defined earlier (code depends on what came before it); now and then anything. */
  const pickEarlier = (pool: readonly string[], selfPos: number): string | null => {
    if (pool.length < 2) return null;
    if (selfPos > 0 && rnd.next() < 0.85) return pool[rnd.int(0, selfPos - 1)]!;
    return pool[rnd.int(0, pool.length - 1)]!;
  };

  symbolOrder.forEach((sym, globalPos) => {
    const file = files[sym.fileIdx]!;
    const want = rnd.int(2, 5);
    const line = 12 + (globalPos % 40) * 3;
    for (let n = 0, tries = 0; n < want && tries < want * 4; tries++) {
      const roll = rnd.next();
      let target: string | null;
      if (roll < 0.6) {
        const pool = folderSymbols.get(file.folderIdx)!;
        target = pickEarlier(pool, pool.indexOf(sym.id));
      } else if (roll < 0.9) {
        const pool = componentSymbols.get(file.componentIdx)!;
        target = pickEarlier(pool, pool.indexOf(sym.id));
      } else {
        target = globalPos > 0 && rnd.next() < 0.85
          ? symbolOrder[rnd.int(0, globalPos - 1)]!.id
          : symbolOrder[rnd.int(0, symbolOrder.length - 1)]!.id;
      }
      if (!target) continue;
      const kind = file.isTest ? "tests" : SPREAD_KINDS[rnd.int(0, SPREAD_KINDS.length - 1)]!;
      if (addLink(sym.id, target, kind, { at: `${file.path}:${line + n}`, ...(file.isTest ? { stop: true } : {}) })) n++;
    }
  });
  files.forEach((file, i) => {
    const siblings = filesByFolder.get(file.folderIdx)!;
    const pos = siblings.indexOf(i);
    const imports = rnd.int(1, 2);
    for (let n = 0; n < imports && pos > 0; n++) {
      addLink(file.id, files[siblings[rnd.int(0, pos - 1)]!]!.id, file.isTest ? "tests" : "imports", {
        at: `${file.path}:${n + 1}`,
        ...(file.isTest ? { stop: true } : {}),
      });
    }
    if (rnd.next() < 0.05 && i > 0) {
      addLink(file.id, files[rnd.int(0, i - 1)]!.id, "mentions", { at: `${file.path}:3` });
    }
  });
  // The deepest view's own wires grow with its cards: every symbol of the hot file calls two
  // defined before it in that file. Then dependents of the selection target (the file's first
  // symbol), so its blast radius is never empty and the view has outside cards to open.
  const hotFile = files[hotFileIdx]!;
  const hotSymbolId = hotFile.symbolIds[0]!;
  for (let i = 1; i < hotFile.symbolIds.length; i++) {
    addLink(hotFile.symbolIds[i]!, hotFile.symbolIds[i - 1]!, "calls", { at: `${hotFile.path}:${11 + i * 14}` });
    if (i > 1) {
      addLink(hotFile.symbolIds[i]!, hotFile.symbolIds[rnd.int(0, i - 2)]!, "calls", {
        at: `${hotFile.path}:${12 + i * 14}`,
      });
    }
  }
  const hotPos = symbolOrder.findIndex((s) => s.id === hotSymbolId);
  for (let n = 0; n < 12 && hotPos + 1 < symbolOrder.length; n++) {
    const dep = symbolOrder[rnd.int(hotPos + 1, symbolOrder.length - 1)]!;
    addLink(dep.id, hotSymbolId, "calls", { at: `${files[dep.fileIdx]!.path}:${20 + n}` });
  }

  // --- Routes ---
  const routeCount = Math.max(4, Math.round(symbolOrder.length / 50));
  for (let r = 0; r < routeCount; r++) {
    routes.push({
      method: r % 3 === 0 ? "POST" : "GET",
      pattern: `/v1/items/${r}/{id}`,
      handler: symbolOrder[rnd.int(0, symbolOrder.length - 1)]!.id,
      framework: "http",
    });
  }

  // --- Levels 1, 2, 4 ---
  const level2Rels: TuxMapLevelRel[] = [];
  for (let c = 1; c < containerCount; c++) {
    level2Rels.push({ from: containerIdOf(c), to: containerIdOf(rnd.int(0, c - 1)), label: "calls", tech: "HTTPS" });
  }
  level2Rels.push({ from: "p-user", to: containerIdOf(0), label: "uses", tech: "HTTPS" });
  level2Rels.push({ from: containerIdOf(0), to: "x-identity", label: "signs in with", tech: "OIDC" });

  const model: TuxMapLevelModel = {
    generatedAt: "2026-01-01T00:00:00Z",
    level1: {
      title: "Synthetic system",
      elements: [
        { id: "p-user", kind: "person", name: "User" },
        { id: "p-admin", kind: "person", name: "Administrator" },
        { id: "sys-bench", kind: "system", name: "Bench System", zoom: 2 },
        { id: "x-identity", kind: "external", name: "Identity provider" },
        { id: "x-mail", kind: "external", name: "Mail relay" },
        { id: "x-store", kind: "external", name: "Object store" },
      ],
      rels: [
        { from: "p-user", to: "sys-bench", label: "uses" },
        { from: "p-admin", to: "sys-bench", label: "operates" },
        { from: "sys-bench", to: "x-identity", label: "signs in with" },
        { from: "sys-bench", to: "x-mail", label: "sends mail through" },
        { from: "sys-bench", to: "x-store", label: "stores files in" },
      ],
    },
    level2: {
      title: "Containers",
      boundary: "sys-bench",
      elements: [
        ...containers,
        { id: "p-user", ref: true },
        { id: "x-identity", ref: true },
      ],
      rels: level2Rels,
    },
    level3,
    level4: {
      groups: [
        { id: "rg-app", zone: "cloud-prod", title: "rg-app" },
        { id: "rg-data", zone: "cloud-prod", title: "rg-data" },
      ],
      nodes: containers.map((c, i) => ({
        id: `vm-${String(i).padStart(2, "0")}`,
        group: i % 5 === 4 ? "rg-data" : "rg-app",
        kind: i % 5 === 4 ? "database" : "vm",
        title: `vm-${String(i).padStart(2, "0")}`,
        role: `Hosts ${c.name}`,
        hosts: [c.id],
      })),
      links: containers.slice(1).map((_, i) => ({
        from: `vm-${String(i + 1).padStart(2, "0")}`,
        to: `vm-${String(i).padStart(2, "0")}`,
        label: "443",
      })),
    },
    subgraphs,
    links,
    routes,
  };

  const hotContainerIdx = componentPlan[hotComponentIdx]!.containerIdx;
  const hotSymbolName = hotSymbolId.slice(hotSymbolId.indexOf("#") + 1);
  return {
    model,
    lazySubgraphs,
    focus: {
      containerId: containerIdOf(hotContainerIdx),
      componentId: componentIds[hotComponentIdx]!,
      folderId: hotFolderId,
      fileId: hotFileId,
      symbolId: hotSymbolId,
      lazyFileId,
      lazyRef,
    },
    queries: [hotSymbolName, hotFile.path, "items/7", "mod"],
    counts: {
      containers: containerCount,
      components: componentPlan.length,
      folders: folderSeq + containerCount * 2,
      files: files.length,
      symbols: symbolOrder.length,
      links: links.length,
      lazyFiles,
      lazySymbols,
      routes: routes.length,
    },
  };
}
