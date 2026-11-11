/**
 * A lazily resolved subgraph merged into the model on arrival (`tti/tti-ux#157`):
 * `mergeLazyMapSubgraphs`, given the state it returned before, must return what
 * sanitizing and collapsing the whole merged model returns, whether it added the
 * arrival to the previous model or fell back to building it all again.
 */
import { describe, expect, it } from "vitest";
import {
  buildMapParentIndex,
  collapseModelSubgraphs,
  extendMapParentIndex,
  mergeLazyMapSubgraphs,
  sanitizeMapModel,
  type TuxMapLazyMergeState,
  type TuxMapLevelElement,
  type TuxMapLevelModel,
  type TuxMapLevelRel,
  type TuxMapSubgraph,
} from "../app/utils/tuxArchitectureMap";

type Lazy = Record<string, unknown>;

/** The merged model as the component built it before #157, and what it derived from it. */
function fullBuild(raw: unknown, lazy: Lazy) {
  let merged = raw;
  const keys = Object.keys(lazy);
  if (keys.length > 0 && raw !== null && typeof raw === "object" && !Array.isArray(raw)) {
    const base = raw as Record<string, unknown>;
    const subgraphs: Record<string, unknown> = Object.create(null);
    const own = base.subgraphs;
    if (own !== null && typeof own === "object" && !Array.isArray(own)) {
      for (const [k, v] of Object.entries(own)) subgraphs[k] = v;
    }
    for (const k of keys) subgraphs[k] = lazy[k];
    merged = { ...base, subgraphs };
  }
  const sanitized = sanitizeMapModel(merged);
  const collapsed = collapseModelSubgraphs(sanitized.model);
  return { model: collapsed.model, aliases: collapsed.aliases, validation: sanitized.validation };
}

const subgraphKeys = (m: TuxMapLevelModel) => Object.keys(m.subgraphs ?? {});

/** `state` equals the full build of the same inputs, down to subgraph key order and the parent index. */
function expectSameAsFull(
  state: TuxMapLazyMergeState,
  raw: unknown,
  lazy: Lazy,
  prevParents?: Map<string, string>,
): Map<string, string> {
  const full = fullBuild(raw, lazy);
  expect(state.model).toEqual(full.model);
  expect(subgraphKeys(state.model)).toEqual(subgraphKeys(full.model));
  expect(state.aliases).toEqual(full.aliases);
  expect(state.validation).toEqual(full.validation);
  const fullParents = buildMapParentIndex(full.model);
  if (state.added && prevParents) {
    const extended = extendMapParentIndex(prevParents, state.added.owner, state.added.elements);
    expect([...extended]).toEqual([...fullParents]);
  }
  return fullParents;
}

/** Feeds `arrivals` one at a time, checking every step; returns how many were added without a rebuild. */
function feed(raw: unknown, arrivals: Array<[string, unknown]>): { added: number; state: TuxMapLazyMergeState } {
  let lazy: Lazy = Object.create(null);
  let state = mergeLazyMapSubgraphs(raw, lazy);
  let parents = expectSameAsFull(state, raw, lazy);
  let added = 0;
  for (const [key, sg] of arrivals) {
    const prevModel = state.model;
    lazy = Object.assign(Object.create(null), lazy, { [key]: sg });
    state = mergeLazyMapSubgraphs(raw, lazy, state);
    parents = expectSameAsFull(state, raw, lazy, parents);
    if (state.added) {
      added++;
      expect(state.added.from).toBe(prevModel);
    }
  }
  return { added, state };
}

function baseModel(extra: Partial<TuxMapLevelModel> = {}): TuxMapLevelModel {
  return {
    level1: { elements: [{ id: "sys", kind: "system", name: "System" }], rels: [] },
    level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "API" }], rels: [] },
    level3: {
      c1: [
        { id: "comp-a", kind: "component", name: "A", subgraphRef: "sg-a" },
        { id: "comp-b", kind: "component", name: "B" },
      ],
    },
    level4: { groups: [], nodes: [], links: [] },
    ...extra,
  };
}

const file = (path: string, extra: Partial<TuxMapLevelElement> = {}): TuxMapLevelElement => ({
  id: `f:${path}`,
  kind: "file",
  name: path.split("/").pop()!,
  ...extra,
});
const folder = (path: string, extra: Partial<TuxMapLevelElement> = {}): TuxMapLevelElement => ({
  id: `d:${path}`,
  kind: "folder",
  name: `${path.split("/").pop()}/`,
  ...extra,
});
const files = (dir: string, n: number) => Array.from({ length: n }, (_, i) => file(`${dir}/f${i}.ts`));

describe("mergeLazyMapSubgraphs", () => {
  it("adds an arriving subgraph to the previous model and leaves everything else the same object", () => {
    const raw = baseModel({
      subgraphs: { "comp-b": { stratum: "Files", elements: files("b", 3) } },
    });
    const first = mergeLazyMapSubgraphs(raw, Object.create(null));
    const lazy = { "sg-a": { stratum: "Folders", elements: [folder("a/x"), folder("a/y"), file("a/main.ts")] } };
    const next = mergeLazyMapSubgraphs(raw, lazy, first);
    expectSameAsFull(next, raw, lazy);
    expect(next.added?.from).toBe(first.model);
    expect(next.added?.key).toBe("sg-a");
    expect(next.added?.owner).toBe("comp-a");
    expect(next.model.level3).toBe(first.model.level3);
    expect(next.model.subgraphs!["comp-b"]).toBe(first.model.subgraphs!["comp-b"]);
    expect(next.aliases).toBe(first.aliases);
    // the previous state's model is not touched
    expect(subgraphKeys(first.model)).toEqual(["comp-b"]);
  });

  it("a model with no subgraphs of its own takes its first one", () => {
    const raw = baseModel();
    const { added } = feed(raw, [
      ["sg-a", { elements: [folder("a/x"), file("a/main.ts")] }],
      ["d:a/x", { elements: files("a/x", 12) }],
      ["f:a/main.ts", { stratum: "Symbols", elements: [{ id: "s:a/main.ts#run", kind: "function", name: "run()" }] }],
    ]);
    expect(added).toBe(3);
  });

  it("a subgraph that sanitizes to empty", () => {
    const raw = baseModel();
    // every element is the card the subgraph hangs under: a cycle, so all of it is dropped
    const { state } = feed(raw, [["sg-a", { elements: [{ id: "comp-a", kind: "component", name: "A" }] }]]);
    expect(state.model.subgraphs!["sg-a"]!.elements).toEqual([]);
    expect(state.validation.valid).toBe(false);
    // and the map taking it out again
    const back = mergeLazyMapSubgraphs(raw, Object.create(null), state);
    expectSameAsFull(back, raw, {});
    expect(back.added).toBeUndefined();
  });

  it("a subgraph arriving twice", () => {
    const raw = baseModel();
    const sg = { elements: [file("a/one.ts")] };
    const lazy1 = { "sg-a": sg };
    const s1 = mergeLazyMapSubgraphs(raw, lazy1, mergeLazyMapSubgraphs(raw, {}));
    expect(s1.added).toBeDefined();
    // the same answer again, in a new map
    const lazy2 = { "sg-a": sg };
    const s2 = mergeLazyMapSubgraphs(raw, lazy2, s1);
    expectSameAsFull(s2, raw, lazy2);
    expect(s2.added).toBeUndefined();
    // another answer under the same key replaces the first
    const lazy3 = { "sg-a": { elements: [file("a/two.ts"), file("a/three.ts")] } };
    const s3 = mergeLazyMapSubgraphs(raw, lazy3, s2);
    expectSameAsFull(s3, raw, lazy3);
    expect(s3.added).toBeUndefined();
    expect(s3.model.subgraphs!["sg-a"]!.elements.map((e) => e.id)).toEqual(["f:a/two.ts", "f:a/three.ts"]);
    // and a subgraph the model already has under that key
    const own = baseModel({ subgraphs: { "sg-a": { elements: [file("a/own.ts")] } } });
    const s4 = mergeLazyMapSubgraphs(own, lazy3, mergeLazyMapSubgraphs(own, {}));
    expectSameAsFull(s4, own, lazy3);
    expect(s4.added).toBeUndefined();
  });

  it("two subgraphs arriving in either order", () => {
    const raw = baseModel();
    const a: [string, unknown] = ["sg-a", { elements: [folder("a/x"), folder("a/y")] }];
    const b: [string, unknown] = ["comp-b", { elements: [file("b/one.ts"), file("a/shared.ts")] }];
    const ab = feed(raw, [a, b]);
    const ba = feed(raw, [b, a]);
    expect(ab.added).toBe(2);
    expect(ba.added).toBe(2);
    expect(subgraphKeys(ab.state.model)).toEqual(["sg-a", "comp-b"]);
    expect(subgraphKeys(ba.state.model)).toEqual(["comp-b", "sg-a"]);
    // a child before the subgraph that shows it, and after
    const parent: [string, unknown] = ["sg-a", { elements: [folder("a/x"), file("a/main.ts")] }];
    const child: [string, unknown] = ["d:a/x", { elements: files("a/x", 3) }];
    feed(raw, [parent, child]);
    feed(raw, [child, parent]);
  });

  it("a model prop change starts over", () => {
    const raw = baseModel();
    const lazy = { "sg-a": { elements: [file("a/one.ts")] } };
    const s1 = mergeLazyMapSubgraphs(raw, lazy, mergeLazyMapSubgraphs(raw, {}));
    const other = baseModel({ subgraphs: { "comp-b": { elements: files("b", 2) } } });
    const lazy2 = { ...lazy, "d:late": { elements: files("late", 2) } };
    const s2 = mergeLazyMapSubgraphs(other, lazy2, s1);
    expectSameAsFull(s2, other, lazy2);
    expect(s2.added).toBeUndefined();
    expect(s2.raw).toBe(other);
    // a state is used once: the one before the change does not come back as a starting point
    const s3 = mergeLazyMapSubgraphs(raw, lazy2, s1);
    expectSameAsFull(s3, raw, lazy2);
    expect(s3.added).toBeUndefined();
  });

  it("input that is not a model, and subgraphs that are not objects", () => {
    for (const raw of [null, undefined, 3, "x", [], { level3: 4, subgraphs: [] }]) {
      feed(raw, [
        ["sg-a", { elements: [file("a/one.ts")] }],
        ["bad", null],
        ["worse", "text"],
        ["d:x", { elements: "none" }],
      ]);
    }
  });

  it("rebuilds when the arrival completes a folder chain", () => {
    const raw = baseModel({
      subgraphs: {
        "sg-a": { elements: [folder("a/x")] },
        "d:a/x/y": { elements: files("a/x/y", 2) },
      },
    });
    // a/x holds only a/x/y, whose files are loaded: a/ -> a/x/y/ in one card
    const { added, state } = feed(raw, [["d:a/x", { elements: [folder("a/x/y")] }]]);
    expect(added).toBe(0);
    expect(state.aliases["d:a/x"]).toBe("d:a/x/y");
    // and the other end: the chain's last link arrives
    const raw2 = baseModel({
      subgraphs: { "sg-a": { elements: [folder("a/x"), file("a/m.ts")] }, "d:a/x": { elements: [folder("a/x/y")] } },
    });
    const r2 = feed(raw2, [["d:a/x/y", { elements: files("a/x/y", 20) }]]);
    expect(r2.added).toBe(0);
    expect(r2.state.aliases["d:a/x"]).toBe("d:a/x/y");
  });

  it("rebuilds when the arrival lets a small component skip its folder level", () => {
    const raw = baseModel({
      subgraphs: {
        "sg-a": { stratum: "Folders", elements: [folder("a/x"), folder("a/y")] },
        "d:a/x": { elements: files("a/x", 2) },
      },
    });
    const { added, state } = feed(raw, [["d:a/y", { elements: files("a/y", 3) }]]);
    expect(added).toBe(0);
    expect(state.model.subgraphs!["sg-a"]!.elements).toHaveLength(5);
    expect(state.aliases["d:a/y"]).toBe("sg-a");
    // the component's own subgraph arriving last does the same
    const raw2 = baseModel({
      subgraphs: { "d:a/x": { elements: files("a/x", 2) }, "d:a/y": { elements: files("a/y", 3) } },
    });
    const r2 = feed(raw2, [["sg-a", { stratum: "Folders", elements: [folder("a/x"), folder("a/y")] }]]);
    expect(r2.added).toBe(0);
    expect(r2.state.aliases["d:a/x"]).toBe("sg-a");
    // too many files to flatten: added in place
    const r3 = feed(raw, [["d:a/y", { elements: files("a/y", 9) }]]);
    expect(r3.added).toBe(1);
    // a sibling folder still not loaded: added in place, then the sibling completes it
    const raw4 = baseModel({ subgraphs: { "sg-a": { elements: [folder("a/x"), folder("a/y")] } } });
    const r4 = feed(raw4, [
      ["d:a/x", { elements: files("a/x", 2) }],
      ["d:a/y", { elements: files("a/y", 2) }],
    ]);
    expect(r4.added).toBe(1);
    expect(r4.state.aliases["d:a/y"]).toBe("sg-a");
  });

  it("rebuilds when the arrival changes the model's cycles or another subgraph's owner", () => {
    const raw = baseModel({ subgraphs: { "sg-a": { elements: [folder("a/x"), file("a/m.ts")] } } });
    // a/x shows the component it is inside of
    const r1 = feed(raw, [["d:a/x", { elements: [{ id: "comp-a", kind: "component", name: "A" }, file("a/x/k.ts")] }]]);
    expect(r1.state.validation.cycleIds.length).toBeGreaterThan(0);
    // an element that names a loaded subgraph as its own
    const raw2 = baseModel({ subgraphs: { "sg-shared": { elements: files("shared", 12) } } });
    const r2 = feed(raw2, [["sg-a", { elements: [folder("a/x", { subgraphRef: "sg-shared" }), file("a/m.ts")] }]]);
    expect(r2.added).toBe(0);
    expect(buildMapParentIndex(r2.state.model).get("f:shared/f0.ts")).toBe("d:a/x");
  });

  it("carries relationships through the aliases the model already has", () => {
    const raw = baseModel({
      subgraphs: {
        "comp-b": { stratum: "Folders", elements: [folder("b/x")] },
        "d:b/x": { elements: files("b/x", 2) },
      },
    });
    const first = mergeLazyMapSubgraphs(raw, {});
    expect(first.aliases["d:b/x"]).toBe("comp-b");
    const rels: TuxMapLevelRel[] = [
      { from: "f:a/one.ts", to: "d:b/x" },
      { from: "f:a/one.ts", to: "comp-b" },
      { from: "f:a/two.ts", to: "f:a/one.ts" },
    ];
    const { added, state } = feed(raw, [["sg-a", { elements: [file("a/one.ts"), file("a/two.ts")], rels }]]);
    expect(added).toBe(1);
    expect(state.model.subgraphs!["sg-a"]!.rels).toEqual([
      { from: "f:a/one.ts", to: "comp-b" },
      { from: "f:a/two.ts", to: "f:a/one.ts" },
    ]);
  });
});

// ---------------------------------------------------------------------------
// Generated models: every arrival order must give the full build's result
// ---------------------------------------------------------------------------

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Generated {
  raw: TuxMapLevelModel;
  arrivals: Array<[string, TuxMapSubgraph]>;
}

/**
 * A small repository: components -> folders -> files -> symbols, with the things that make an
 * arrival more than an append: one-folder chains, components small enough to flatten, shared and
 * repeated ids, `subgraphRef`s that are not the id, cycles, cards with no id, reserved ids.
 */
function generate(seed: number): Generated {
  const r = rng(seed);
  const chance = (p: number) => r() < p;
  const int = (n: number) => Math.floor(r() * n);
  const all: Array<[string, TuxMapSubgraph, number]> = [];
  const seenIds: string[] = [];

  const relsAmong = (els: TuxMapLevelElement[]): TuxMapLevelRel[] | undefined => {
    if (els.length < 2 || chance(0.5)) return undefined;
    const ids = [...els.map((e) => e.id).filter(Boolean), ...seenIds.slice(0, 6)];
    return Array.from({ length: 1 + int(4) }, () => ({ from: ids[int(ids.length)]!, to: ids[int(ids.length)]! }));
  };

  const fill = (key: string, path: string, ownerId: string, depth: number) => {
    const els: TuxMapLevelElement[] = [];
    const chain = depth < 4 && chance(0.3);
    const nFolders = chain ? 1 : depth < 3 ? int(4) : 0;
    const nFiles = chain ? 0 : chance(0.2) ? 9 + int(4) : int(5);
    for (let i = 0; i < nFolders; i++) {
      const p = `${path}/d${i}`;
      const el: TuxMapLevelElement = chance(0.15)
        ? { id: `m:${p}`, kind: "module", name: `d${i}/` }
        : folder(p);
      if (chance(0.2)) el.subgraphRef = `ref:${p}`;
      els.push(el);
      if (chance(0.85)) fill(el.subgraphRef || el.id, p, el.id, depth + 1);
    }
    for (let i = 0; i < nFiles; i++) {
      const p = `${path}/f${i}.ts`;
      const el = file(p);
      if (chance(0.1)) el.subgraphRef = `ref:${p}`;
      els.push(el);
      if (chance(0.3)) {
        const syms: TuxMapLevelElement[] = Array.from({ length: 1 + int(3) }, (_, j) => ({
          id: `s:${p}#fn${j}`,
          kind: "function",
          name: `fn${j}()`,
        }));
        if (chance(0.2)) syms.push({ kind: "function", name: "anonymous" } as TuxMapLevelElement);
        all.push([el.subgraphRef || el.id, { stratum: "Symbols", elements: syms }, depth + 1]);
      }
    }
    // the unusual cards
    if (chance(0.12) && seenIds.length > 0) els.push({ ...file("dup"), id: seenIds[int(seenIds.length)]! });
    if (chance(0.08)) els.push({ id: ownerId, kind: "folder", name: "self/" });
    if (chance(0.08) && seenIds.length > 0) {
      els.push({ id: `x:${path}`, kind: "module", name: "x", subgraphRef: seenIds[int(seenIds.length)]! });
    }
    if (chance(0.05)) els.push({ id: "@bound", kind: "file", name: "reserved" });
    if (chance(0.08)) {
      els.push({
        id: `g:${path}`,
        kind: "module",
        name: "group",
        children: [{ id: `g:${path}/k`, kind: "file", name: "k", subgraphRef: `ref:g:${path}` }],
      });
    }
    for (const e of els) if (e.id) seenIds.push(e.id);
    all.push([key, { stratum: depth === 0 ? "Folders" : "Files", elements: els, rels: relsAmong(els) }, depth]);
  };

  const comps: TuxMapLevelElement[] = [];
  const nComps = 2 + int(3);
  for (let i = 0; i < nComps; i++) {
    const comp: TuxMapLevelElement = { id: `comp${i}`, kind: "component", name: `Comp ${i}` };
    if (chance(0.5)) comp.subgraphRef = `sg:comp${i}`;
    comps.push(comp);
    seenIds.push(comp.id);
    if (chance(0.9)) fill(comp.subgraphRef || comp.id, `c${i}`, comp.id, 0);
  }
  if (chance(0.1)) all.push(["12", { elements: [file("numeric/key.ts")] }, 1]);
  if (chance(0.1)) all.push(["@more-1", { elements: [file("reserved/key.ts")] }, 1]);

  // What the model ships with, and the order the rest arrives in
  const pBase = [0, 0.3, 0.6, 0.9][int(4)]!;
  const baseSubgraphs: Record<string, TuxMapSubgraph> = {};
  const arrivals: Array<[string, TuxMapSubgraph]> = [];
  const order = chance(0.5)
    ? [...all].sort((x, y) => x[2] - y[2]) // as a person drills: parents first
    : [...all].map((x) => [r(), x] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  for (const [key, sg] of order) {
    if (chance(pBase)) baseSubgraphs[key] = sg;
    else arrivals.push([key, sg]);
  }
  const raw: TuxMapLevelModel = {
    level1: { elements: [{ id: "sys", kind: "system", name: "System" }], rels: [] },
    level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "API" }], rels: [] },
    level3: { c1: comps },
    level4: { groups: [], nodes: [], links: [] },
    ...(Object.keys(baseSubgraphs).length > 0 || chance(0.3) ? { subgraphs: baseSubgraphs } : {}),
    ...(chance(0.15) ? { aliases: { "old-id": comps[0]!.id } } : {}),
  };
  return { raw, arrivals };
}

describe("mergeLazyMapSubgraphs on generated models", () => {
  it("every arrival, added in place or rebuilt, equals the full build", () => {
    let arrivals = 0;
    let added = 0;
    for (let seed = 1; seed <= 400; seed++) {
      const g = generate(seed);
      arrivals += g.arrivals.length;
      added += feed(g.raw, g.arrivals).added;
    }
    // both paths are exercised: a fair share added in place, a fair share rebuilt
    expect(arrivals).toBeGreaterThan(1500);
    expect(added / arrivals).toBeGreaterThan(0.3);
    expect(added / arrivals).toBeLessThan(0.97);
    // 400 models, each arrival compared against a full build: a few seconds on a laptop, 7 s on a shared CI runner
  }, 60_000);
});
