/**
 * Architecture-map benchmark, utils half (`tti/tti-ux#153`): the exported
 * functions of `tuxArchitectureMap.ts` timed on synthetic repositories of
 * about 500, 2,500 and 10,000 symbols. The component half, which times the
 * same steps through the mounted component (its `stageData` and `routedSvg`
 * computeds are not reachable from here), is
 * `tests/tux-architecture-map-bench.nuxt.test.ts` at the repo root.
 *
 * Every assertion is a ratio between two sizes; see `support/mapBench.ts`.
 * `npm run bench:map` runs both halves and prints the milliseconds.
 */
import { afterAll, describe, expect, it } from "vitest";
import {
  buildMapParentIndex,
  buildMapSearchIndex,
  buildMapSearchIndexKept,
  collapseModelSubgraphs,
  computeLinkBlastRadius,
  extractModelLinks,
  extractModelLinksKept,
  extendMapParentIndex,
  foldVendoredCopies,
  levelForFocus,
  liftLinksToView,
  liftToSet,
  mergeLazyMapSubgraphs,
  resolveModelRawLinks,
  routeGridWires,
  sanitizeMapModel,
  searchArchitectureMap,
  validateMapModel,
  type TuxMapLevelModel,
  type TuxMapLevelRel,
  type TuxMapLink,
} from "../app/utils/tuxArchitectureMap";
import {
  MAP_BENCH_SIZES,
  describeScenario,
  flushScenarioResults,
  mapBenchModels,
  measureReference,
  runScenario,
  type BenchCase,
  type BenchStat,
  type MapBenchSizeKey,
  type ScenarioSpec,
} from "./support/mapBench";
import { buildSyntheticMapModel, layoutDenseView, type SyntheticMap } from "./support/mapSyntheticModels";

const PROD_WIRES = new Set(["prod"] as const);
/** Three measurement rounds of the slowest scenario on a runner several times slower than a laptop. */
const GATE_TIMEOUT_MS = 180_000;

/** What the component holds once a model is loaded: the same calls, in the same order. */
function prepare(g: SyntheticMap) {
  const sanitized = sanitizeMapModel(g.model);
  const collapsed = collapseModelSubgraphs(sanitized.model);
  const model = collapsed.model;
  const parentOf = buildMapParentIndex(model);
  const alias = (id: string) => collapsed.aliases[id] ?? id;
  return {
    g,
    model,
    parentOf,
    rawLinks: resolveModelRawLinks(model),
    effectiveLinks: extractModelLinks(model, { includePlanned: false, bridgeUncoveredPairs: true }),
    fileId: alias(g.focus.fileId),
    folderId: alias(g.focus.folderId),
    symbolId: alias(g.focus.symbolId),
    searchIndex: buildMapSearchIndex(model),
  };
}
type Prepared = ReturnType<typeof prepare>;

/**
 * The link half of the component's `stageData` for one code view: fold vendored
 * copies, find which inner pairs the code links cover, lift every link onto
 * the view (lowest-common-ancestor roll-up, 12 outside cards a side).
 */
function liftView(model: TuxMapLevelModel, rawLinks: TuxMapLink[], parentOf: Map<string, string>, focusId: string) {
  const sg = model.subgraphs?.[focusId];
  const baseKids = (sg?.elements ?? []).map((k) => ({ ...k, parent: focusId }));
  const folded = foldVendoredCopies(baseKids, sg?.rels ?? [], rawLinks);
  const kidIds = folded.elements.map((k) => k.id);
  const kidIdSet = new Set(kidIds);
  const covered = new Set<string>();
  for (const l of folded.links) {
    const lf = liftToSet(l.from, kidIdSet, parentOf);
    const lt = liftToSet(l.to, kidIdSet, parentOf);
    if (lf && lt && lf !== lt) covered.add(`${lf}\u0000${lt}`);
  }
  const lifted = liftLinksToView(folded.links, focusId, kidIds, parentOf, {
    lift: "lca",
    categories: PROD_WIRES,
    maxPerSide: 12,
  });
  return { kids: folded.elements, lifted, covered };
}
type LiftedView = ReturnType<typeof liftView>;

/** Card rectangles for the lifted view, four columns as the component's banded layout uses. */
function layoutView(view: LiftedView) {
  return layoutDenseView({
    inner: view.kids.map((k) => ({ id: k.id, name: k.name ?? k.id })),
    ins: view.lifted.ins.map((s) => ({ id: s.id, name: s.id })),
    outs: view.lifted.outs.map((s) => ({ id: s.id, name: s.id })),
    cols: 4,
  });
}

/**
 * The wires of the view at rest, as the component hands them to the router once
 * a stage: an outside card has one wire, to the view's boundary.
 */
function viewRels(view: LiftedView): TuxMapLevelRel[] {
  const rels: TuxMapLevelRel[] = [...view.lifted.rels];
  const side = (s: LiftedView["lifted"]["ins"][number], inbound: boolean) => {
    const label = `${s.count} ${s.count === 1 ? "link" : "links"}`;
    rels.push(inbound ? { from: s.id, to: "@bound", label } : { from: "@bound", to: s.id, label });
  };
  for (const s of view.lifted.ins) side(s, true);
  for (const s of view.lifted.outs) side(s, false);
  return rels;
}

/**
 * The wires a hovered or selected card opens, the only ones the component routes
 * then: every outside card that touches it, as one wire per inner card it reaches.
 */
function openedRels(view: LiftedView, activeId: string): TuxMapLevelRel[] {
  const rels: TuxMapLevelRel[] = [];
  const side = (s: LiftedView["lifted"]["ins"][number], inbound: boolean) => {
    if (s.id !== activeId && !s.wires.some((w) => w.kid === activeId)) return;
    for (const w of s.wires) {
      rels.push(inbound ? { from: s.id, to: w.kid, label: w.label } : { from: w.kid, to: s.id, label: w.label });
    }
  };
  for (const s of view.lifted.ins) side(s, true);
  for (const s of view.lifted.outs) side(s, false);
  return rels;
}

/**
 * Thirty wires between the view's first eight cards, every one labelled and with a technology:
 * sixty port labels on a few crowded sides, so that many find no free spot and are hidden at rest,
 * on a view that grows in cards.
 */
function crowdedLabelRels(view: LiftedView): TuxMapLevelRel[] {
  const ids = view.kids.slice(0, 8).map((k) => k.id);
  return Array.from({ length: 30 }, (_, k) => {
    const a = k % 6;
    return {
      from: ids[a]!,
      to: ids[(a + 1 + (k % 3)) % ids.length]!,
      label: `passes the validated result ${k} over to`,
      tech: "JSON over HTTPS",
    };
  });
}

function perSize(make: (p: Prepared, key: MapBenchSizeKey) => BenchCase, prepared: Record<MapBenchSizeKey, Prepared>) {
  const out = {} as Record<MapBenchSizeKey, BenchCase>;
  for (const s of MAP_BENCH_SIZES) out[s.key] = make(prepared[s.key], s.key);
  return out;
}

describe("architecture map benchmark: utils (#153)", () => {
  const models = mapBenchModels();
  const prepared = {} as Record<MapBenchSizeKey, Prepared>;
  for (const s of MAP_BENCH_SIZES) prepared[s.key] = prepare(models[s.key]);
  let reference: BenchStat | null = null;
  let sink = 0;

  afterAll(() => {
    flushScenarioResults("utils", { reference });
    expect(sink).toBeGreaterThan(0);
  });

  const gate = (spec: Omit<ScenarioSpec, "via" | "cases"> & { make: (p: Prepared, key: MapBenchSizeKey) => BenchCase }) =>
    it(
      `${spec.id}: ${spec.title}`,
      async () => {
        const { make, ...rest } = spec;
        const r = await runScenario({ ...rest, via: "utils", cases: perSize(make, prepared) });
        expect(r.ratios.midOverSmall, describeScenario(r)).toBeLessThanOrEqual(r.bounds.midOverSmall);
        expect(r.ratios.largeOverMid, describeScenario(r)).toBeLessThanOrEqual(r.bounds.largeOverMid);
      },
      GATE_TIMEOUT_MS,
    );

  it("generates the same valid model for the same seed, at about the size asked for", () => {
    for (const s of MAP_BENCH_SIZES) {
      const g = models[s.key];
      const again = buildSyntheticMapModel({ symbols: s.symbols, cardsPerView: s.cardsPerView });
      expect(JSON.stringify(again), `${s.label} symbols: deterministic`).toBe(JSON.stringify(g));
      const v = validateMapModel(g.model);
      expect(v.issues, `${s.label} symbols: valid`).toEqual([]);
      expect(v.valid).toBe(true);
      expect(Math.abs(g.counts.symbols - s.symbols) / s.symbols, `${s.label} symbols: within 10%`).toBeLessThan(0.1);
      // 2 to 5 links per symbol, plus file imports
      const perSymbol = g.counts.links / g.counts.symbols;
      expect(perSymbol).toBeGreaterThan(2);
      expect(perSymbol).toBeLessThan(5);

      // The views the scenarios open hold `cardsPerView` cards, and survive sanitizing and collapsing
      const p = prepared[s.key];
      expect(p.model.subgraphs?.[p.fileId]?.elements.length, `${s.label}: symbols in the hot file`).toBe(s.cardsPerView);
      expect(p.model.subgraphs?.[p.folderId]?.elements.length, `${s.label}: files in the hot folder`).toBe(s.cardsPerView);
      expect(levelForFocus(p.fileId, p.model, p.parentOf)).toBeGreaterThanOrEqual(6);
      expect(Object.keys(collapseModelSubgraphs(sanitizeMapModel(g.model).model).aliases).length).toBeGreaterThan(0);
      // Lazy files hold nothing until resolved
      expect(g.model.subgraphs?.[g.focus.lazyFileId]).toBeUndefined();
      expect(g.lazySubgraphs[g.focus.lazyRef]?.elements.length).toBe(s.cardsPerView);
      // The selection has dependents, and every Go-To query has a hit
      const blast = computeLinkBlastRadius(p.effectiveLinks, p.symbolId, p.parentOf, { model: p.model });
      expect(blast.hits.size, `${s.label}: blast radius of the selection`).toBeGreaterThan(0);
      for (const q of g.queries) {
        expect(searchArchitectureMap(p.searchIndex, q).totalHits, `${s.label}: hits for "${q}"`).toBeGreaterThan(0);
      }
      // The deepest view: about two wires a card inside, and outside cards that open on the selection
      const view = liftView(p.model, p.rawLinks, p.parentOf, p.fileId);
      expect(view.lifted.rels.length, `${s.label}: inner wires`).toBeGreaterThanOrEqual(s.cardsPerView);
      expect(view.lifted.ins.length, `${s.label}: outside cards`).toBeGreaterThan(0);
      expect(openedRels(view, p.symbolId).length, `${s.label}: wires opened by the hover`).toBeGreaterThan(0);
    }
  });

  it("times the reference workload", async () => {
    reference = await measureReference();
    expect(reference.median).toBeGreaterThan(0);
  });

  it(
    "the gate itself: passes a linear scan and fails the same scan with a quadratic term",
    async () => {
      const work = (quadratic: boolean) =>
        perSize((p) => {
          const ids = [...p.parentOf.keys()];
          return {
            run: () => {
              let n = 0;
              for (const id of ids) n += id.length;
              // Every fourth element against every fourth: one sixteenth of a full pairwise scan
              if (quadratic) {
                for (let i = 0; i < ids.length; i += 4) for (let j = 0; j < ids.length; j += 4) n += ids[j]!.length & 1;
              }
              sink += n;
            },
          };
        }, prepared);
      const spec = { title: "self-test", via: "utils", scalesWith: "whole model", bounds: [12, 12], record: false } as const;
      const linear = await runScenario({ ...spec, id: "self-linear", cases: work(false) });
      expect(linear.pass, describeScenario(linear)).toBe(true);
      const quadratic = await runScenario({ ...spec, id: "self-quadratic", cases: work(true) });
      expect(quadratic.pass, describeScenario(quadratic)).toBe(false);
      expect(quadratic.attempts).toBe(3);
    },
    GATE_TIMEOUT_MS,
  );

  // ── The pipeline, whole and by stage ───────────────────────────────────────

  gate({
    id: "pipeline",
    title: "sanitize, collapse, parent index, links, lift the deepest view, route it",
    scalesWith: "whole model, then one view",
    bounds: [10, 9],
    make: (p) => ({
      run: () => {
        const sanitized = sanitizeMapModel(p.g.model);
        const collapsed = collapseModelSubgraphs(sanitized.model);
        const parentOf = buildMapParentIndex(collapsed.model);
        const rawLinks = resolveModelRawLinks(collapsed.model);
        const view = liftView(collapsed.model, rawLinks, parentOf, p.fileId);
        const { rects, els } = layoutView(view);
        sink += routeGridWires(viewRels(view), rects, els).wires.length + 1;
      },
    }),
  });

  gate({
    id: "sanitize",
    title: "sanitizeMapModel",
    scalesWith: "whole model",
    bounds: [12, 12],
    make: (p) => ({ run: () => void (sink += Object.keys(sanitizeMapModel(p.g.model).model.level3).length) }),
  });

  gate({
    id: "collapse",
    title: "collapseModelSubgraphs",
    scalesWith: "whole model",
    bounds: [12, 12],
    make: (p) => {
      const sanitized = sanitizeMapModel(p.g.model).model;
      return { run: () => void (sink += Object.keys(collapseModelSubgraphs(sanitized).aliases).length) };
    },
  });

  gate({
    id: "parent-index",
    title: "buildMapParentIndex",
    scalesWith: "whole model",
    bounds: [12, 12],
    make: (p) => ({ run: () => void (sink += buildMapParentIndex(p.model).size) }),
  });

  gate({
    id: "links",
    title: "extractModelLinks (the links the blast radius walks)",
    scalesWith: "whole model",
    bounds: [13, 12],
    make: (p) => ({
      run: () =>
        void (sink += extractModelLinks(p.model, { includePlanned: false, bridgeUncoveredPairs: true }).length),
    }),
  });

  gate({
    id: "lift-view",
    title: "fold copies and liftLinksToView for the deepest view",
    scalesWith: "all links, onto one view",
    bounds: [12, 10],
    make: (p) => ({
      run: () => void (sink += liftView(p.model, p.rawLinks, p.parentOf, p.fileId).lifted.rels.length + 1),
    }),
  });

  gate({
    id: "route",
    title: "routeGridWires for the deepest view at rest",
    scalesWith: "cards and wires in one view",
    bounds: [8, 6],
    make: (p) => {
      const view = liftView(p.model, p.rawLinks, p.parentOf, p.fileId);
      const { rects, els } = layoutView(view);
      const rels = viewRels(view);
      return { run: () => void (sink += routeGridWires(rels, rects, els).wires.length + 1) };
    },
  });

  gate({
    id: "route-labels",
    title: "routeGridWires placing the port labels of 30 crowded wires in the deepest view",
    scalesWith: "cards in one view (30 wires at every size)",
    bounds: [4, 4],
    make: (p) => {
      const view = liftView(p.model, p.rawLinks, p.parentOf, p.fileId);
      const { rects, els } = layoutView(view);
      const rels = crowdedLabelRels(view);
      const routed = routeGridWires(rels, rects, els);
      // The scenario times nothing unless labels are searched for, and many find no free spot: two
      // labels a wire since #210, what it does at its source port and its technology at its target
      expect(routed.wires.length).toBe(30);
      expect(routed.labels.length).toBe(60);
      expect(routed.labels.filter((l) => l.forced).length).toBeGreaterThanOrEqual(15);
      expect(routed.labels.some((l) => !l.forced)).toBe(true);
      return { run: () => void (sink += routeGridWires(rels, rects, els).labels.length + 1) };
    },
  });

  // ── One interaction each ───────────────────────────────────────────────────

  gate({
    id: "hover",
    title: "route the wires one hovered card opens in the deepest view",
    scalesWith: "wires the hovered card opens",
    bounds: [4, 4.5],
    make: (p) => {
      const view = liftView(p.model, p.rawLinks, p.parentOf, p.fileId);
      const { rects, els } = layoutView(view);
      const rels = openedRels(view, p.symbolId);
      return { run: () => void (sink += routeGridWires(rels, rects, els).wires.length + 1) };
    },
  });

  gate({
    id: "selection",
    title: "computeLinkBlastRadius for one selected symbol (unfiltered, then by kind)",
    scalesWith: "whole model",
    bounds: [13, 12],
    make: (p) => {
      const kinds = new Set(p.effectiveLinks.map((l) => l.kind || "uses"));
      return {
        run: () => {
          const base = computeLinkBlastRadius(p.effectiveLinks, p.symbolId, p.parentOf, {
            model: p.model,
            intent: "default",
          });
          const filtered = computeLinkBlastRadius(p.effectiveLinks, p.symbolId, p.parentOf, {
            model: p.model,
            intent: "default",
            kinds,
          });
          sink += base.hits.size + filtered.hits.size + 1;
        },
      };
    },
  });

  gate({
    id: "lazy-merge",
    title: "merge one resolved subgraph: sanitize, collapse and index the model again",
    scalesWith: "whole model",
    bounds: [12, 12],
    make: (p) => {
      const merged = {
        ...p.g.model,
        subgraphs: { ...p.g.model.subgraphs, [p.g.focus.lazyRef]: p.g.lazySubgraphs[p.g.focus.lazyRef]! },
      };
      return {
        run: () => {
          const collapsed = collapseModelSubgraphs(sanitizeMapModel(merged).model);
          sink += buildMapParentIndex(collapsed.model).size;
        },
      };
    },
  });

  // What the component does since #157: the arrival is added to the model the previous merge left.
  // The first arrival after a full build also reads the whole model once, for what later ones need.
  const lazyAdd = (p: Prepared, held: number): BenchCase => {
    const refs = [p.g.focus.lazyRef, ...Object.keys(p.g.lazySubgraphs).filter((k) => k !== p.g.focus.lazyRef)];
    const lazyOf = (n: number) => {
      const lazy: Record<string, unknown> = Object.create(null);
      for (const k of refs.slice(refs.length - n)) lazy[k] = p.g.lazySubgraphs[k]!;
      return lazy;
    };
    const before = lazyOf(held);
    const after = lazyOf(held);
    after[refs[0]!] = p.g.lazySubgraphs[refs[0]!]!;
    let prev = mergeLazyMapSubgraphs(p.g.model, Object.create(null));
    let parents = buildMapParentIndex(prev.model);
    const reset = () => {
      prev = mergeLazyMapSubgraphs(p.g.model, Object.create(null));
      if (held > 0) prev = mergeLazyMapSubgraphs(p.g.model, before, prev);
      parents = buildMapParentIndex(prev.model);
    };
    reset();
    return {
      run: () => {
        const next = mergeLazyMapSubgraphs(p.g.model, after, prev);
        if (!next.added) throw new Error("the arrival was not added in place");
        sink += extendMapParentIndex(parents, next.added.owner, next.added.elements).size;
      },
      reset,
    };
  };

  gate({
    id: "lazy-merge-first",
    title: "add the first resolved subgraph to the merged model, and extend the parent index",
    scalesWith: "whole model",
    bounds: [12, 12],
    make: (p) => lazyAdd(p, 0),
  });

  gate({
    id: "lazy-merge-next",
    title: "add a later resolved subgraph to the merged model, and extend the parent index",
    scalesWith: "whole model",
    bounds: [12, 12],
    make: (p) => lazyAdd(p, 1),
  });

  // What is read from the model after the indexes, when a later subgraph arrives: the links and the
  // search index kept from the model before, with the arrival worked into them (#157). The merge and
  // the parent index are `lazy-merge-next`, and are not timed here.
  const lazyDerived = (p: Prepared, what: "links" | "search"): BenchCase => {
    const refs = [p.g.focus.lazyRef, ...Object.keys(p.g.lazySubgraphs).filter((k) => k !== p.g.focus.lazyRef)];
    const held: Record<string, unknown> = Object.create(null);
    held[refs[refs.length - 1]!] = p.g.lazySubgraphs[refs[refs.length - 1]!]!;
    const after: Record<string, unknown> = Object.assign(Object.create(null), held);
    // The generated subgraphs hold symbols and no links, and an arrival with no link hands the kept
    // links back untouched. One link between its first two symbols makes this the path that copies.
    const arriving = p.g.lazySubgraphs[refs[0]!]!;
    const [a, b] = arriving.elements;
    after[refs[0]!] = what === "links" ? { ...arriving, rels: [{ from: a!.id!, to: b!.id!, label: "calls" }] } : arriving;
    let run: () => number = () => 0;
    const reset = () => {
      const prev = mergeLazyMapSubgraphs(p.g.model, held, mergeLazyMapSubgraphs(p.g.model, Object.create(null)));
      const prevParents = buildMapParentIndex(prev.model);
      const kept =
        what === "links"
          ? extractModelLinksKept(prev.model, { includePlanned: false, parentOf: prevParents })
          : buildMapSearchIndexKept(prev.model, prevParents);
      const next = mergeLazyMapSubgraphs(p.g.model, after, prev);
      if (!next.added) throw new Error("the arrival was not added in place");
      const parents = extendMapParentIndex(prevParents, next.added.owner, next.added.elements);
      run =
        what === "links"
          ? () => {
              const links = extractModelLinksKept(
                next.model,
                { includePlanned: false, parentOf: parents },
                kept as TuxMapLink[],
                next.added,
              );
              if (links.length !== kept.length + 1) throw new Error("the arrival's link was not added");
              return links.length;
            }
          : () =>
              buildMapSearchIndexKept(next.model, parents, kept as ReturnType<typeof buildMapSearchIndexKept>, next.added)
                .length;
    };
    reset();
    return { run: () => void (sink += run()), reset };
  };

  gate({
    id: "lazy-links-next",
    title: "work a later resolved subgraph into the links kept from the model before",
    scalesWith: "all links, copied once",
    bounds: [4, 8],
    make: (p) => lazyDerived(p, "links"),
  });

  gate({
    id: "lazy-search-next",
    title: "work a later resolved subgraph into the search index kept from the model before",
    scalesWith: "all entries, copied once",
    bounds: [6, 9],
    make: (p) => lazyDerived(p, "search"),
  });

  gate({
    id: "search-index",
    title: "buildMapSearchIndex",
    scalesWith: "whole model",
    bounds: [12, 11],
    make: (p) => ({ run: () => void (sink += buildMapSearchIndex(p.model).length) }),
  });

  gate({
    id: "go-to",
    title: "searchArchitectureMap, four queries over the built index",
    scalesWith: "whole model",
    bounds: [14, 10],
    make: (p) => ({
      run: () => {
        for (const q of p.g.queries) sink += searchArchitectureMap(p.searchIndex, q).totalHits;
      },
    }),
  });
});
