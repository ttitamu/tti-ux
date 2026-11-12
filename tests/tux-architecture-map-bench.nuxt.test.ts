/**
 * Architecture-map benchmark, component half (`tti/tti-ux#153`): the steps
 * that live inside `TuxArchitectureMap.vue` (its `stageData` and `routedSvg`
 * computeds, hover, selection, lazy merge, the Go-To palette), timed through
 * the mounted component on synthetic repositories of about 500, 2,500 and
 * 10,000 symbols. The utils half is `packages/diagrams/tests/map-bench.test.ts`.
 *
 * The DOM here is jsdom, so the milliseconds are not a browser's: rendering
 * costs more than it does on screen and layout costs nothing. The ratios
 * between sizes are what the gate reads, and they are what a regression in
 * the component's own code moves.
 *
 * Every assertion is a ratio; see `packages/diagrams/tests/support/mapBench.ts`.
 * `npm run bench:map` runs both halves and prints the milliseconds.
 */
import { afterAll, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import {
  buildMapParentIndex,
  collapseModelSubgraphs,
  levelForFocus,
  sanitizeMapModel,
  type TuxMapSubgraph,
} from "../packages/diagrams/app/utils/tuxArchitectureMap";
import {
  MAP_BENCH_SIZES,
  describeScenario,
  flushScenarioResults,
  mapBenchModels,
  runScenario,
  type BenchCase,
  type MapBenchSizeKey,
  type ScenarioSpec,
} from "../packages/diagrams/tests/support/mapBench";
import type { SyntheticMap } from "../packages/diagrams/tests/support/mapSyntheticModels";

/** Three measurement rounds of the slowest scenario on a runner several times slower than a laptop. */
const GATE_TIMEOUT_MS = 600_000;

type SetupState = Record<string, any>;
type Mounted = Awaited<ReturnType<typeof mountSuspended>>;

interface Target {
  g: SyntheticMap;
  fileId: string;
  fileLevel: number;
  folderId: string;
  folderLevel: number;
  symbolId: string;
}

/** Where the scenarios open the map: the hot file and folder, at the level the component gives them. */
function target(g: SyntheticMap): Target {
  const collapsed = collapseModelSubgraphs(sanitizeMapModel(g.model).model);
  const parentOf = buildMapParentIndex(collapsed.model);
  const alias = (id: string) => collapsed.aliases[id] ?? id;
  const fileId = alias(g.focus.fileId);
  const folderId = alias(g.focus.folderId);
  return {
    g,
    fileId,
    fileLevel: levelForFocus(fileId, collapsed.model, parentOf),
    folderId,
    folderLevel: levelForFocus(folderId, collapsed.model, parentOf),
    symbolId: alias(g.focus.symbolId),
  };
}

const stateOf = (w: Mounted) => (w.vm as unknown as { $: { setupState: SetupState } }).$.setupState;

describe("architecture map benchmark: component (#153)", () => {
  const models = mapBenchModels();
  const targets = {} as Record<MapBenchSizeKey, Target>;
  for (const s of MAP_BENCH_SIZES) targets[s.key] = target(models[s.key]);
  const mounted: Mounted[] = [];
  let sink = 0;

  const mountAt = async (t: Target, focus: "file" | "folder", extra: Record<string, unknown> = {}) => {
    const w = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: t.g.model,
        initialLevel: focus === "file" ? t.fileLevel : t.folderLevel,
        initialFocus: focus === "file" ? t.fileId : t.folderId,
        ...extra,
      },
    });
    await nextTick();
    mounted.push(w);
    return w;
  };
  const unmountAll = () => {
    for (const w of mounted.splice(0)) w.unmount();
  };

  afterAll(() => {
    unmountAll();
    flushScenarioResults("component");
    expect(sink).toBeGreaterThan(0);
  });

  const gate = (
    spec: Omit<ScenarioSpec, "via" | "cases"> & { make: (t: Target, key: MapBenchSizeKey) => Promise<BenchCase> },
  ) =>
    it(
      `${spec.id}: ${spec.title}`,
      async () => {
        const { make, ...rest } = spec;
        const cases = {} as Record<MapBenchSizeKey, BenchCase>;
        for (const s of MAP_BENCH_SIZES) cases[s.key] = await make(targets[s.key], s.key);
        // One warm-up call a size: the paths are already compiled by the scenarios before this one
        const r = await runScenario({ options: { warmup: 1 }, ...rest, via: "component", cases });
        unmountAll();
        expect(r.ratios.midOverSmall, describeScenario(r)).toBeLessThanOrEqual(r.bounds.midOverSmall);
        expect(r.ratios.largeOverMid, describeScenario(r)).toBeLessThanOrEqual(r.bounds.largeOverMid);
      },
      GATE_TIMEOUT_MS,
    );

  it("opens the deepest view of every size with its cards, wires and outside cards", async () => {
    for (const s of MAP_BENCH_SIZES) {
      const t = targets[s.key];
      expect(t.fileLevel, `${s.label}: the hot file is a code view`).toBeGreaterThanOrEqual(6);
      const w = await mountAt(t, "file");
      const state = stateOf(w);
      expect(state.focusId).toBe(t.fileId);
      expect(w.findAll(".tux-map__el:not(.tux-map__el--mini)").length, `${s.label}: cards`).toBeGreaterThanOrEqual(
        s.cardsPerView,
      );
      expect(state.stageData.codeEdgeHoverIds.has(t.symbolId), `${s.label}: the hover target opens wires`).toBe(true);
      expect(state.routedSvg.wires.length, `${s.label}: wires`).toBeGreaterThanOrEqual(s.cardsPerView);
      unmountAll();
    }
  });

  gate({
    id: "c-mount",
    title: "mount on the deepest view: the whole pipeline, stageData, routedSvg and the first render",
    scalesWith: "whole model, then one view",
    bounds: [6, 7],
    make: async (t) => {
      let w: Mounted | null = null;
      return {
        run: async () => {
          w = await mountSuspended(TuxArchitectureMap, {
            props: { model: t.g.model, initialLevel: t.fileLevel, initialFocus: t.fileId },
          });
          await nextTick();
          sink += stateOf(w).routedSvg.wires.length + 1;
        },
        reset: () => {
          w?.unmount();
          w = null;
        },
      };
    },
  });

  gate({
    id: "c-stage",
    title: "navigate to the deepest view: stageData, routedSvg and the render",
    scalesWith: "all links, onto one view",
    bounds: [7, 6],
    make: async (t) => {
      const state = stateOf(await mountAt(t, "file"));
      state.goToLevel(2);
      await nextTick();
      return {
        run: async () => {
          state.goToLevel(t.fileLevel, { nextFocus: t.fileId });
          await nextTick();
          sink += state.routedSvg.wires.length + state.stageData.els.length;
        },
        // Back out to the container level, the cheapest view to leave from
        reset: async () => {
          state.goToLevel(2);
          await nextTick();
          sink += state.stageData.els.length;
        },
      };
    },
  });

  gate({
    id: "c-hover",
    title: "hover one card in the deepest view: the wires it opens and the render",
    scalesWith: "cards and wires in one view",
    bounds: [4.5, 4.5],
    make: async (t) => {
      const w = await mountAt(t, "file");
      const state = stateOf(w);
      const card = w.find(`.tux-map__el[data-id="${t.symbolId}"]`).element as HTMLElement;
      const stage = card.parentElement as HTMLElement;
      return {
        run: async () => {
          card.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
          await nextTick();
          if (state.hoveredStageCardId !== t.symbolId) throw new Error("hover did not land on the card");
          sink += state.routedSvg.wires.length;
        },
        reset: async () => {
          stage.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
          await nextTick();
          if (state.hoveredStageCardId !== null) throw new Error("hover did not clear");
          sink += state.routedSvg.wires.length;
        },
      };
    },
  });

  gate({
    id: "c-select",
    title: "select one symbol with the blast radius on: both radius walks, their projection and the render",
    scalesWith: "whole model",
    bounds: [5, 6.5],
    make: async (t) => {
      const state = stateOf(await mountAt(t, "file", { initialShowBlastRadius: true }));
      return {
        run: async () => {
          state.selectElement(t.symbolId);
          await nextTick();
          const blast = state.blastRadiusState;
          if (!blast || blast.impactedIds.size + blast.directIds.size === 0) throw new Error("no blast radius");
          sink += state.routedSvg.wires.length;
        },
        reset: async () => {
          state.selectElement(null);
          await nextTick();
          sink += state.routedSvg.wires.length;
        },
      };
    },
  });

  gate({
    id: "c-lazy-merge",
    title: "resolve one lazy file in the folder view: the model is merged, sanitized, collapsed and staged again",
    scalesWith: "whole model",
    bounds: [7, 8],
    make: async (t) => {
      const resolveSubgraph = (ref: string): Promise<TuxMapSubgraph | null> =>
        Promise.resolve(t.g.lazySubgraphs[ref] ?? null);
      const state = stateOf(await mountAt(t, "folder", { resolveSubgraph }));
      return {
        run: async () => {
          const { sg } = await state.hydrateLazySubgraph(t.g.focus.lazyFileId);
          await nextTick();
          if (!sg) throw new Error("the lazy subgraph did not resolve");
          sink += state.stageData.els.length + state.routedSvg.wires.length;
        },
        reset: async () => {
          state.resolvedSubgraphs = Object.create(null);
          await nextTick();
          sink += state.stageData.els.length;
        },
      };
    },
  });

  // A later arrival: one lazy file is already resolved when the next one arrives, so the arrival is
  // added to the merged model (#157) rather than starting it over as `c-lazy-merge` does each run.
  const laterArrival = async (t: Target, derived: boolean): Promise<BenchCase> => {
    const resolveSubgraph = (ref: string): Promise<TuxMapSubgraph | null> =>
      Promise.resolve(t.g.lazySubgraphs[ref] ?? null);
    const state = stateOf(await mountAt(t, "folder", { resolveSubgraph }));
    const heldRef = Object.keys(t.g.lazySubgraphs)
      .filter((k) => k !== t.g.focus.lazyRef)
      .pop()!;
    const read = () =>
      state.stageData.els.length +
      state.routedSvg.wires.length +
      (derived ? state.effectiveModelLinks.length + state.mapSearchIndex.length : 0);
    const reset = async () => {
      const held: Record<string, TuxMapSubgraph> = Object.create(null);
      held[heldRef] = t.g.lazySubgraphs[heldRef]!;
      state.resolvedSubgraphs = held;
      await nextTick();
      sink += read();
    };
    await reset();
    return {
      run: async () => {
        const { sg } = await state.hydrateLazySubgraph(t.g.focus.lazyFileId);
        await nextTick();
        if (!sg) throw new Error("the lazy subgraph did not resolve");
        if (!state.mergedModel.added) throw new Error("the arrival was not added in place");
        sink += read();
      },
      reset,
    };
  };

  gate({
    id: "c-lazy-merge-next",
    title: "resolve a later lazy file in the folder view: added to the merged model, then staged again",
    scalesWith: "whole model",
    bounds: [7, 8],
    make: (t) => laterArrival(t, false),
  });

  gate({
    id: "c-lazy-merge-next-derived",
    title: "the same later arrival with the links and the search index read after it, as a selection and the open palette do",
    scalesWith: "whole model",
    bounds: [7, 8],
    make: (t) => laterArrival(t, true),
  });

  gate({
    id: "c-go-to",
    title: "one Go-To query in the open palette: the search over the built index and the result list render",
    scalesWith: "whole model",
    bounds: [7, 5.5],
    make: async (t) => {
      const state = stateOf(await mountAt(t, "file"));
      state.openGoToPalette();
      await nextTick();
      sink += state.mapSearchIndex.length;
      const query = t.g.queries[0]!;
      return {
        run: async () => {
          state.goToQuery = query;
          await nextTick();
          if (state.goToGroupResults.length === 0) throw new Error(`no Go-To hits for "${query}"`);
          sink += state.goToGroupResults.length;
        },
        reset: async () => {
          state.goToQuery = "";
          await nextTick();
        },
      };
    },
  });
});
