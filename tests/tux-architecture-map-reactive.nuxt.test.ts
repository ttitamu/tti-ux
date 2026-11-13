// @vitest-environment nuxt
/**
 * A `model` passed as a deep `reactive()` object (#222). The map reads it raw:
 * nothing it builds from the model holds a proxy, and a mount costs about what
 * the same model costs passed plain. A lazily resolved subgraph is kept raw too.
 *
 * What is seen of a change: a new `model` object always. An edit made in place
 * inside a reactive `model` only with `watchModelDeep`, which reads the whole
 * model through its proxies so that any edit in it is a dependency.
 *
 * The DOM is jsdom, so the milliseconds are not a browser's; the timing check
 * compares two mounts of the same model in the same run.
 */
import { describe, expect, it } from "vitest";
import { isProxy, nextTick, reactive, toRaw } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import {
  buildMapParentIndex,
  collapseModelSubgraphs,
  levelForFocus,
  sanitizeMapModel,
  type TuxMapLevelModel,
  type TuxMapSubgraph,
} from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { buildSyntheticMapModel } from "../packages/diagrams/tests/support/mapSyntheticModels";

type Mounted = Awaited<ReturnType<typeof mountSuspended>>;
type SetupState = Record<string, any>;
const stateOf = (w: Mounted) => (w.vm as unknown as { $: { setupState: SetupState } }).$.setupState;

/** The first proxy found in `root`, by its path, or null. Maps and sets are read too. */
function findProxy(root: unknown, label: string): string | null {
  const seen = new Set<unknown>();
  const stack: Array<[unknown, string]> = [[root, label]];
  while (stack.length > 0) {
    const [v, path] = stack.pop()!;
    if (v === null || typeof v !== "object" || seen.has(v)) continue;
    if (isProxy(v)) return path;
    seen.add(v);
    if (v instanceof Map) {
      for (const [k, x] of v) stack.push([x, `${path}.get(${String(k)})`]);
    } else if (v instanceof Set) {
      for (const x of v) stack.push([x, `${path}.has(…)`]);
    } else if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) stack.push([v[i], `${path}[${i}]`]);
    } else {
      for (const k of Object.keys(v)) stack.push([(v as Record<string, unknown>)[k], `${path}.${k}`]);
    }
  }
  return null;
}

const g = buildSyntheticMapModel({ symbols: 2500, cardsPerView: 60 });
const collapsed = collapseModelSubgraphs(sanitizeMapModel(g.model).model);
const fileId = collapsed.aliases[g.focus.fileId] ?? g.focus.fileId;
const fileLevel = levelForFocus(fileId, collapsed.model, buildMapParentIndex(collapsed.model));

const clone = (): TuxMapLevelModel => structuredClone(g.model);

async function mountFile(model: TuxMapLevelModel, extra: Record<string, unknown> = {}) {
  const w = await mountSuspended(TuxArchitectureMap, {
    props: { model, initialLevel: fileLevel, initialFocus: fileId, ...extra },
  });
  await nextTick();
  return w;
}

async function timedMount(model: TuxMapLevelModel): Promise<number> {
  const t0 = performance.now();
  const w = await mountFile(model);
  const ms = performance.now() - t0;
  w.unmount();
  return ms;
}

describe("TuxArchitectureMap with a reactive model (#222)", () => {
  it("keeps no proxy in what it builds from the model", async () => {
    const w = await mountFile(reactive(clone()) as TuxMapLevelModel);
    const s = stateOf(w);
    expect(w.findAll(".tux-map__el:not(.tux-map__el--mini)").length).toBeGreaterThanOrEqual(60);
    expect(findProxy(s.mergedModel.model, "mergedModel.model")).toBeNull();
    expect(findProxy(s.stageData, "stageData")).toBeNull();
    expect(findProxy(s.byId, "byId")).toBeNull();
    w.unmount();
  });

  it("mounts within 1.5 times the time of the same model passed plain", async () => {
    // warm-up, then the best of three of each, alternated
    await timedMount(clone());
    let plain = Number.POSITIVE_INFINITY;
    let deep = Number.POSITIVE_INFINITY;
    for (let i = 0; i < 3; i++) {
      deep = Math.min(deep, await timedMount(reactive(clone()) as TuxMapLevelModel));
      plain = Math.min(plain, await timedMount(clone()));
    }
    expect(deep, `reactive ${deep.toFixed(1)} ms, plain ${plain.toFixed(1)} ms`).toBeLessThanOrEqual(plain * 1.5);
  }, 120_000);

  it("keeps a lazily resolved subgraph raw, and replaces the record when one arrives", async () => {
    const lazy = reactive(structuredClone(g.lazySubgraphs[g.focus.lazyRef]!)) as TuxMapSubgraph;
    const w = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: clone(),
        initialLevel: fileLevel,
        initialFocus: fileId,
        resolveSubgraph: (ref: string) => Promise.resolve(ref === g.focus.lazyRef ? lazy : null),
      },
    });
    const s = stateOf(w);
    const before = s.resolvedSubgraphs;
    await s.hydrateLazySubgraph(g.focus.lazyFileId);
    for (let i = 0; i < 10; i++) await nextTick();
    expect(s.resolvedSubgraphs).not.toBe(before);
    expect(isProxy(s.resolvedSubgraphs)).toBe(false);
    expect(s.resolvedSubgraphs[g.focus.lazyRef]).toBe(toRaw(lazy));
    expect(findProxy(s.mergedModel.model, "mergedModel.model")).toBeNull();
    w.unmount();
  });

  it("draws a new model object, reactive or not", async () => {
    const w = await mountFile(reactive(clone()) as TuxMapLevelModel);
    const s = stateOf(w);
    const next = clone();
    next.level1.elements[0]!.name = "Renamed system";
    await w.setProps({ model: reactive(next) });
    await nextTick();
    expect(s.byId[next.level1.elements[0]!.id]?.name).toBe("Renamed system");
    await w.setProps({ model: clone() });
    await nextTick();
    expect(s.byId[next.level1.elements[0]!.id]?.name).not.toBe("Renamed system");
    w.unmount();
  });

  it("sees an edit in place inside a reactive model with watchModelDeep, and only with it", async () => {
    const id = g.model.level1.elements[0]!.id;
    for (const deep of [false, true]) {
      const model = reactive(clone()) as TuxMapLevelModel;
      const w = await mountFile(model, { watchModelDeep: deep });
      const s = stateOf(w);
      const was = s.byId[id]?.name;
      model.level1.elements[0]!.name = "Edited in place";
      await nextTick();
      await nextTick();
      expect(s.byId[id]?.name, `watchModelDeep: ${deep}`).toBe(deep ? "Edited in place" : was);
      expect(findProxy(s.mergedModel.model, "mergedModel.model")).toBeNull();
      w.unmount();
    }
  });
});
