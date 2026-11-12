/**
 * A lazily resolved subgraph merged into the model on arrival (`tti/tti-ux#157`):
 * `mergeLazyMapSubgraphs`, given the state it returned before, must return what
 * sanitizing and collapsing the whole merged model returns, whether it added the
 * arrival to the previous model or fell back to building it all again.
 */
import { describe, expect, it } from "vitest";
import {
  buildMapParentIndex,
  buildMapSearchIndex,
  buildMapSearchIndexKept,
  collapseModelSubgraphs,
  extendMapParentIndex,
  extractModelLinks,
  extractModelLinksKept,
  mergeLazyMapSubgraphs,
  sanitizeMapModel,
  type TuxMapLazyMergeState,
  type TuxMapLevelElement,
  type TuxMapLevelModel,
  type TuxMapLevelRel,
  type TuxMapLink,
  type TuxMapSearchEntry,
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

describe("mergeLazyMapSubgraphs: arrivals that are not added in place", () => {
  // Each case is one test in `addLazySubgraph`: without it the arrival is added in place and the
  // result is not the full build's. `feed` compares every step, so that is what fails.

  it("a key the model has, under a value that is not a subgraph", () => {
    // the full build puts the arrival where the key already is: before comp-b, not after
    const raw = baseModel({
      subgraphs: { "sg-a": null, "comp-b": { elements: files("b", 12) } } as unknown as TuxMapLevelModel["subgraphs"],
    });
    const { added, state } = feed(raw, [["sg-a", { elements: files("a", 12) }]]);
    expect(added).toBe(0);
    expect(subgraphKeys(state.model)).toEqual(["sg-a", "comp-b"]);
  });

  it("a key that was folded away, as an alias", () => {
    // comp-a is small: its one folder, whose files are under "ref:x", is skipped, and both the
    // folder's id and "ref:x" become aliases of sg-a. A subgraph under the folder's id is folded
    // away with it.
    const raw = baseModel({
      subgraphs: {
        "sg-a": { stratum: "Folders", elements: [folder("a/x", { subgraphRef: "ref:x" })] },
        "ref:x": { elements: files("a/x", 2) },
        "comp-b": { elements: files("b", 12) },
      },
    });
    const { added, state } = feed(raw, [["d:a/x", { elements: files("stray", 12) }]]);
    expect(added).toBe(0);
    expect(state.aliases["d:a/x"]).toBe("sg-a");
    expect(subgraphKeys(state.model)).toEqual(["sg-a", "comp-b"]);
  });

  it("a key that a reserved key of the model was renamed to", () => {
    // "@bound" is kept as "id:@bound": the arrival replaces that subgraph, it is not a new one
    const raw = baseModel({ subgraphs: { "@bound": { elements: files("reserved", 12) }, "comp-b": { elements: files("b", 12) } } });
    const { added, state } = feed(raw, [["id:@bound", { elements: files("late", 12) }]]);
    expect(added).toBe(0);
    expect(subgraphKeys(state.model)).toEqual(["id:@bound", "comp-b"]);
    expect(state.model.subgraphs!["id:@bound"]!.elements[0]!.id).toBe("f:late/f0.ts");
  });

  it("an element that names a subgraph by the name its reserved key is kept under", () => {
    // the model's "@bound" subgraph is kept as "id:@bound", which is what the arriving folder names:
    // no raw key matches, but the folder owns that subgraph and its files get the folder as parent
    const raw = baseModel({ subgraphs: { "@bound": { elements: files("reserved", 12) } } });
    const { added, state } = feed(raw, [
      ["sg-a", { elements: [...files("a", 12), folder("a/x", { subgraphRef: "id:@bound" }), folder("a/y")] }],
    ]);
    expect(added).toBe(0);
    expect(buildMapParentIndex(state.model).get("f:reserved/f0.ts")).toBe("d:a/x");
  });

  it("a model whose subgraph owners took more than one pass to settle", () => {
    // "late" holds a card with no id that names "late/0": its own position, until comp-b claims
    // "late" and the card becomes "comp-b/0". What such a card owns depends on the order the whole
    // model is read in, so nothing is added to a model like this one.
    const anon = (subgraphRef: string) => ({ kind: "module", name: "no id", subgraphRef }) as TuxMapLevelElement;
    const raw = baseModel({
      level3: {
        c1: [
          { id: "comp-a", kind: "component", name: "A", subgraphRef: "sg-a" },
          { id: "comp-b", kind: "component", name: "B", subgraphRef: "sg-b" },
        ],
      },
      subgraphs: {
        late: { elements: [anon("late/0"), ...files("late", 12)] },
        "sg-b": { elements: [...files("b", 12), folder("b/x", { subgraphRef: "late" }), folder("b/y")] },
      },
    });
    const { added } = feed(raw, [
      ["late/0", { elements: [anon("deep"), ...files("late/zero", 12)] }],
      ["deep", { elements: files("deep", 12) }],
      ["sg-a", { elements: files("a", 12) }],
    ]);
    expect(added).toBe(0);
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

// ---------------------------------------------------------------------------
// What is derived from the merged model: the links and the search index
// ---------------------------------------------------------------------------

/** The links as the component asks for them, from the whole model. */
const fullLinks = (model: TuxMapLevelModel, includePlanned: boolean) =>
  extractModelLinks(model, { includePlanned, bridgeUncoveredPairs: true });

interface DerivedCounts {
  arrivals: number;
  /** arrivals the model took in place */
  added: number;
  /** of those: the links were extended (per `includePlanned`), and came back as the same array */
  linksExtended: number;
  linksSame: number;
  /** of those: the search index was extended */
  searchExtended: number;
}

/**
 * Feeds `arrivals` one at a time the way the component does: the model through
 * `mergeLazyMapSubgraphs`, the parent index extended or rebuilt, and each kept result handed back
 * with what was added. After every step the links (with and without planned ones) and the search
 * index must equal, order included, what the whole merged model gives.
 */
function feedDerived(raw: unknown, arrivals: Array<[string, unknown]>, counts?: DerivedCounts) {
  let lazy: Lazy = Object.create(null);
  let state = mergeLazyMapSubgraphs(raw, lazy);
  let parents = buildMapParentIndex(state.model);
  const links: TuxMapLink[][] = [false, true].map((includePlanned) =>
    extractModelLinksKept(state.model, { includePlanned, parentOf: parents }),
  );
  let search = buildMapSearchIndexKept(state.model, parents);
  const check = (step: string) => {
    const full = fullBuild(raw, lazy).model;
    expect(links[0], `${step}: links`).toStrictEqual(fullLinks(full, false));
    expect(links[1], `${step}: links with planned`).toStrictEqual(fullLinks(full, true));
    expect(search, `${step}: search index`).toStrictEqual(buildMapSearchIndex(full));
  };
  check("start");
  const steps: Array<{ added: boolean; linksExtended: boolean[]; linksSame: boolean[]; searchExtended: boolean }> = [];
  for (const [key, sg] of arrivals) {
    lazy = Object.assign(Object.create(null), lazy, { [key]: sg });
    state = mergeLazyMapSubgraphs(raw, lazy, state);
    parents = state.added
      ? extendMapParentIndex(parents, state.added.owner, state.added.elements)
      : buildMapParentIndex(state.model);
    const step = { added: Boolean(state.added), linksExtended: [false, false], linksSame: [false, false], searchExtended: false };
    [false, true].forEach((includePlanned, i) => {
      const prev = links[i]!;
      const bridgedBefore = new Set(prev);
      const next = extractModelLinksKept(state.model, { includePlanned, parentOf: parents }, prev, state.added);
      // a bridged relationship that is the object it was: built on, not extracted again
      step.linksSame[i] = next === prev;
      step.linksExtended[i] = next === prev || next.some((l) => isBridged(l) && bridgedBefore.has(l));
      links[i] = next;
    });
    const prevSearch = search;
    search = buildMapSearchIndexKept(state.model, parents, prevSearch, state.added);
    step.searchExtended = prevSearch.length > 0 && search[0] === prevSearch[0];
    steps.push(step);
    check(`after ${key}`);
    if (counts) {
      counts.arrivals++;
      if (step.added) counts.added++;
      for (const i of [0, 1]) {
        if (step.linksExtended[i]) counts.linksExtended++;
        if (step.linksSame[i]) counts.linksSame++;
      }
      if (step.searchExtended) counts.searchExtended++;
    }
  }
  return { state, parents, links, search, steps };
}

/** A link the extraction made from a relationship, not one of the model's code links. */
const isBridged = (l: TuxMapLink) => l.coupling === "runtime" && l.phase === "prod-runtime";

const names = (entries: TuxMapSearchEntry[]) => entries.map((e) => e.id);
const pairs = (ls: TuxMapLink[]) => ls.map((l) => `${l.from} -> ${l.to} (${l.kind})`);

describe("extractModelLinksKept", () => {
  /** Two components with a file subgraph each; `sg-a` is lazy unless the test loads it. */
  const linked = (extra: Partial<TuxMapLevelModel> = {}): TuxMapLevelModel =>
    baseModel({
      level2: {
        boundary: "sys",
        elements: [{ id: "c1", kind: "container", name: "API" }],
        rels: [],
      },
      subgraphs: { "comp-b": { stratum: "Files", elements: files("b", 12), rels: [] } },
      ...extra,
    });
  const sgA = (rels: TuxMapLevelRel[] = [], extra: TuxMapLevelElement[] = []) => ({
    stratum: "Files",
    elements: [...files("a", 12), ...extra],
    rels,
  });

  it("adds an arriving subgraph's relationships after the ones it had, before the Level 4 links", () => {
    const raw = linked({
      level4: {
        groups: [],
        nodes: [{ id: "vm", kind: "vm", title: "VM", role: "host" }],
        links: [{ from: "comp-a", to: "vm", kind: "runs-on" }],
      },
      subgraphs: {
        "comp-b": { stratum: "Files", elements: files("b", 12), rels: [{ from: "f:b/f0.ts", to: "f:b/f1.ts" }] },
      },
    });
    const r = feedDerived(raw, [["sg-a", sgA([{ from: "f:a/f0.ts", to: "f:a/f1.ts", label: "reads" }])]]);
    expect(r.steps[0]).toMatchObject({ added: true, linksExtended: [true, true], linksSame: [false, false] });
    expect(pairs(r.links[0]!)).toEqual([
      "f:b/f0.ts -> f:b/f1.ts (uses)",
      "f:a/f0.ts -> f:a/f1.ts (uses)",
      "comp-a -> vm (runs-on)",
    ]);
  });

  it("returns the array it was given when the arrival changes no link", () => {
    const raw = linked({ links: [{ from: "f:b/f0.ts", to: "f:b/f1.ts", kind: "imports" }] });
    const r = feedDerived(raw, [
      ["sg-a", sgA()],
      // relationships that are bridged already, or are planned
      ["f:b/f2.ts", { elements: [{ id: "s:b/f2.ts#x", kind: "function", name: "x()" }], rels: [] }],
    ]);
    expect(r.steps.map((s) => s.linksSame)).toEqual([
      [true, true],
      [true, true],
    ]);
  });

  it("drops a relationship the arrival puts under a code link", () => {
    // the code link runs between two symbols; until their files have a parent it covers nothing above them
    const raw = linked({
      links: [{ from: "s:a/f0.ts#run", to: "s:b/f0.ts#run", kind: "calls" }],
      level4: { groups: [], nodes: [], links: [{ from: "comp-a", to: "comp-b", kind: "uses" }] },
      subgraphs: {
        "comp-b": {
          stratum: "Files",
          elements: files("b", 12),
          rels: [{ from: "f:a/f0.ts", to: "f:b/f0.ts" }, { from: "comp-a", to: "comp-b" }, { from: "f:b/f1.ts", to: "f:b/f2.ts" }],
        },
        "f:a/f0.ts": { stratum: "Symbols", elements: [{ id: "s:a/f0.ts#run", kind: "function", name: "run()" }], rels: [] },
        "f:b/f0.ts": { stratum: "Symbols", elements: [{ id: "s:b/f0.ts#run", kind: "function", name: "run()" }], rels: [] },
      },
    });
    const start = feedDerived(raw, []);
    expect(pairs(start.links[0]!)).toEqual([
      "s:a/f0.ts#run -> s:b/f0.ts#run (calls)",
      "comp-a -> comp-b (uses)",
      "f:b/f1.ts -> f:b/f2.ts (uses)",
    ]);
    // f:a/f0.ts gets comp-a as its parent: the code link now covers comp-a -> comp-b
    const r = feedDerived(raw, [["sg-a", sgA()]]);
    expect(r.steps[0]).toMatchObject({ added: true, linksExtended: [true, true], linksSame: [false, false] });
    expect(pairs(r.links[0]!)).toEqual(["s:a/f0.ts#run -> s:b/f0.ts#run (calls)", "f:b/f1.ts -> f:b/f2.ts (uses)"]);
  });

  it("an arriving relationship takes the place of a Level 4 link with the same ends", () => {
    const raw = linked({
      level4: {
        groups: [],
        nodes: [],
        links: [
          { from: "f:a/f0.ts", to: "f:a/f1.ts" },
          { from: "f:a/f2.ts", to: "f:a/f3.ts", label: "kept" },
        ],
      },
      subgraphs: {
        "comp-b": { stratum: "Files", elements: files("b", 12), rels: [{ from: "f:b/f0.ts", to: "f:b/f1.ts", label: "had" }] },
      },
    });
    const r = feedDerived(raw, [["sg-a", sgA([{ from: "f:a/f0.ts", to: "f:a/f1.ts", label: "from the subgraph" }])]]);
    expect(r.steps[0]).toMatchObject({ added: true, linksExtended: [true, true] });
    expect(r.links[0]!.map((l) => l.label)).toEqual(["had", "from the subgraph", "kept"]);
  });

  it("extracts again when an arriving element names a host, and code links read hosts", () => {
    const raw = linked({
      links: [{ from: "f:a/f0.ts", to: "f:b/f0.ts", kind: "imports" }],
      level4: {
        groups: [],
        nodes: [{ id: "vm", kind: "vm", title: "VM", role: "host" }],
        links: [],
      },
      subgraphs: {
        "comp-b": { stratum: "Files", elements: files("b", 12), rels: [{ from: "vm", to: "comp-b" }] },
      },
    });
    // f:a/f0.ts is deployed on vm, so its link to comp-b's file covers vm -> comp-b
    const r = feedDerived(raw, [["sg-a", sgA([], [file("a/host.ts", { deployed: "vm" })])]]);
    expect(r.steps[0]!.added).toBe(true);
    const deployedOn = feedDerived(raw, [
      ["sg-a", { stratum: "Files", elements: [file("a/f0.ts", { deployed: "vm" }), ...files("a", 12).slice(1)], rels: [] }],
    ]);
    expect(deployedOn.steps[0]).toMatchObject({ added: true, linksExtended: [false, false] });
    expect(pairs(deployedOn.links[0]!)).toEqual(["f:a/f0.ts -> f:b/f0.ts (imports)"]);
    // with no code links nothing is covered, and the host is not read
    const noLinks = linked({ subgraphs: { "comp-b": { stratum: "Files", elements: files("b", 12), rels: [{ from: "vm", to: "comp-b" }] } } });
    const r2 = feedDerived(noLinks, [["sg-a", sgA([{ from: "f:a/f0.ts", to: "vm" }], [file("a/host.ts", { deployed: "vm" })])]]);
    expect(r2.steps[0]).toMatchObject({ added: true, linksExtended: [true, true] });
  });

  it("extracts again for another model, another planned setting, or a result it was not given", () => {
    const raw = linked({
      subgraphs: { "comp-b": { stratum: "Files", elements: files("b", 12), rels: [{ from: "f:b/f0.ts", to: "f:b/f1.ts" }] } },
    });
    const first = mergeLazyMapSubgraphs(raw, {});
    const p0 = buildMapParentIndex(first.model);
    const lazy = { "sg-a": sgA([{ from: "f:a/f0.ts", to: "f:a/f1.ts", status: "planned" }]) };
    const next = mergeLazyMapSubgraphs(raw, lazy, first);
    const p1 = extendMapParentIndex(p0, next.added!.owner, next.added!.elements);
    const wantShown = fullLinks(next.model, true);
    const wantHidden = fullLinks(next.model, false);
    expect(wantShown).toHaveLength(2);
    expect(wantHidden).toHaveLength(1);

    // the planned setting changed between the two calls
    const hidden = extractModelLinksKept(first.model, { includePlanned: false, parentOf: p0 });
    const shown = extractModelLinksKept(next.model, { includePlanned: true, parentOf: p1 }, hidden, next.added);
    expect(shown).toStrictEqual(wantShown);
    expect(shown[0]).not.toBe(hidden[0]);

    // a result is used once: handing the first one back again starts from the model
    const again = extractModelLinksKept(next.model, { includePlanned: false, parentOf: p1 }, hidden, next.added);
    expect(again).toStrictEqual(wantHidden);
    expect(again).not.toBe(hidden);

    // a result for some other model
    const other = extractModelLinksKept(mergeLazyMapSubgraphs(linked(), {}).model, { parentOf: p0 });
    expect(extractModelLinksKept(next.model, { parentOf: p1 }, other, next.added)).toStrictEqual(wantHidden);
    // an array this function did not return, and no `added`
    expect(extractModelLinksKept(next.model, { parentOf: p1 }, [...wantHidden], next.added)).toStrictEqual(wantHidden);
    const kept = extractModelLinksKept(first.model, { parentOf: p0 });
    expect(extractModelLinksKept(next.model, { parentOf: p1 }, kept)).toStrictEqual(wantHidden);
  });
});

describe("buildMapSearchIndexKept", () => {
  const searchable = (extra: Partial<TuxMapLevelModel> = {}): TuxMapLevelModel =>
    baseModel({ subgraphs: { "comp-b": { stratum: "Files", elements: files("b", 12), rels: [] } }, ...extra });
  const sgA = (extra: TuxMapLevelElement[] = []) => ({ stratum: "Files", elements: [...files("a", 12), ...extra], rels: [] });

  it("adds the arrival's entries after every other card's, before the route table's", () => {
    const raw = searchable({ routes: [{ method: "get", pattern: "/health", handler: "f:a/f0.ts" }] });
    const before = feedDerived(raw, []);
    const r = feedDerived(raw, [["sg-a", sgA()]]);
    expect(r.steps[0]).toMatchObject({ added: true, searchExtended: true });
    const n = before.search.length;
    // what was indexed stays the same entries; the route table's entry is made again, with its handler found
    expect(names(r.search).slice(0, n - 1)).toEqual(names(before.search).slice(0, n - 1));
    expect(names(r.search).slice(n - 1)).toEqual([...files("a", 12).map((f) => f.id), "route:GET /health->f:a/f0.ts"]);
    expect(r.search[r.search.length - 1]!.handlerName).toBe("f0.ts");
    expect(before.search[n - 1]!.handlerName).toBe("f:a/f0.ts");
  });

  it("builds again when the arrival gives a name to an id other entries pass through", () => {
    // the Level 4 node sits in a group that is no card, until sg-a shows one with the group's id
    const raw = searchable({
      level4: {
        groups: [],
        nodes: [{ id: "vm", kind: "vm", title: "VM", role: "host", group: "grp" }],
        links: [],
      },
    });
    expect(feedDerived(raw, []).search.find((e) => e.id === "vm")!.ancestors).toEqual(["grp"]);
    const r = feedDerived(raw, [["sg-a", sgA([{ id: "grp", kind: "module", name: "Group Card" }])]]);
    expect(r.steps[0]).toMatchObject({ added: true, searchExtended: false });
    expect(r.search.find((e) => e.id === "vm")!.ancestors).toEqual(["Group Card"]);
  });

  it("builds again when what an arriving subgraph hangs under was read for another's level", () => {
    // d:x/in's cards were indexed under comp-b first, so only a child's level reads d:x/in's parents
    const shared: TuxMapLevelElement = { id: "g:shared", kind: "module", name: "shared", children: [file("shared/k.ts")] };
    const raw = searchable({
      subgraphs: {
        "comp-b": { stratum: "Files", elements: [...files("b", 12), { id: "g:shared", kind: "module", name: "shared" }], rels: [] },
        "d:x/in": { stratum: "Files", elements: [shared, { id: "f:b/f0.ts", kind: "file", name: "f0.ts" }], rels: [] },
      },
    });
    const before = feedDerived(raw, []);
    const r = feedDerived(raw, [["sg-a", sgA([folder("x/in"), folder("x/not-loaded")])]]);
    expect(r.steps[0]).toMatchObject({ added: true, searchExtended: false });
    const lvl = (s: TuxMapSearchEntry[]) => s.find((e) => e.id === "f:shared/k.ts")!.level;
    expect(lvl(r.search)).toBe(lvl(before.search) + 1);
  });

  it("builds again when the arrival puts a parent over a card it had", () => {
    const raw = searchable({ subgraphs: { "f:a/f0.ts": { stratum: "Symbols", elements: [{ id: "s:a/f0.ts#run", kind: "function", name: "run()" }] } } });
    const before = feedDerived(raw, []);
    const r = feedDerived(raw, [["sg-a", sgA()]]);
    expect(r.steps[0]).toMatchObject({ added: true, searchExtended: false });
    const lvl = (s: TuxMapSearchEntry[]) => s.find((e) => e.id === "s:a/f0.ts#run")!.level;
    expect(lvl(r.search)).not.toBe(lvl(before.search));
  });

  it("builds again when the arrival is the handler of a route it had", () => {
    const route: TuxMapLevelElement = { id: "r:GET /items", kind: "route", name: "GET /items" };
    const raw = searchable({
      links: [{ from: "r:GET /items", to: "f:a/f3.ts", kind: "handled-by" }],
      subgraphs: { "comp-b": { stratum: "Files", elements: [...files("b", 12), route], rels: [] } },
    });
    const before = feedDerived(raw, []);
    expect(before.search.find((e) => e.id === "r:GET /items")!.revealId).toBe("r:GET /items");
    const r = feedDerived(raw, [["sg-a", sgA()]]);
    expect(r.steps[0]).toMatchObject({ added: true, searchExtended: false });
    expect(r.search.find((e) => e.id === "r:GET /items")!.revealId).toBe("f:a/f3.ts");
    // a route that arrives with its handler already there is added in place
    const raw2 = searchable({ links: [{ from: "r:GET /items", to: "f:b/f3.ts", kind: "handled-by" }] });
    const r2 = feedDerived(raw2, [["sg-a", sgA([route])]]);
    expect(r2.steps[0]).toMatchObject({ added: true, searchExtended: true });
    expect(r2.search.find((e) => e.id === "r:GET /items")!.revealId).toBe("f:b/f3.ts");
  });

  it("builds again when a container with no components gets a subgraph of its own", () => {
    const raw = searchable({
      level2: {
        boundary: "sys",
        elements: [
          { id: "c1", kind: "container", name: "API" },
          { id: "c2", kind: "container", name: "Worker" },
        ],
        rels: [],
      },
      level3: {
        c1: [
          { id: "comp-a", kind: "component", name: "A", subgraphRef: "sg-a" },
          { id: "comp-b", kind: "component", name: "B" },
        ],
        c2: [],
      },
    });
    const r = feedDerived(raw, [["c2", { stratum: "Files", elements: files("worker", 12), rels: [] }]]);
    expect(r.steps[0]!.searchExtended).toBe(false);
  });

  it("builds again for another model, or a result it was not given", () => {
    const raw = searchable();
    const first = mergeLazyMapSubgraphs(raw, {});
    const p0 = buildMapParentIndex(first.model);
    const next = mergeLazyMapSubgraphs(raw, { "sg-a": sgA() }, first);
    const p1 = extendMapParentIndex(p0, next.added!.owner, next.added!.elements);
    const want = buildMapSearchIndex(next.model);
    const kept = buildMapSearchIndexKept(first.model, p0);
    const extended = buildMapSearchIndexKept(next.model, p1, kept, next.added);
    expect(extended).toStrictEqual(want);
    expect(extended[0]).toBe(kept[0]);
    // used once
    const again = buildMapSearchIndexKept(next.model, p1, kept, next.added);
    expect(again).toStrictEqual(want);
    expect(again[0]).not.toBe(kept[0]);
    // some other model's result, an array this function did not return, no `added`
    const other = buildMapSearchIndexKept(mergeLazyMapSubgraphs(searchable(), {}).model, p0);
    expect(buildMapSearchIndexKept(next.model, p1, other, next.added)[0]).not.toBe(other[0]);
    expect(buildMapSearchIndexKept(next.model, p1, [...want], next.added)).toStrictEqual(want);
    const kept2 = buildMapSearchIndexKept(first.model, p0);
    expect(buildMapSearchIndexKept(next.model, p1, kept2)[0]).not.toBe(kept2[0]);
  });
});

/**
 * `generate(seed)` with what the links and the search index read added to it: code links (plain and
 * tiered) between cards at every depth, loaded or not; relationships at Levels 1 and 2 and `next`
 * steps at Level 3; Level 4 nodes with hosts and links, some repeating a subgraph's relationship;
 * `deployed` cards; planned ones; routes as cards, as links and in the route table.
 */
function generateLinked(seed: number): Generated {
  const g = generate(seed);
  const r = rng(seed * 7919 + 13);
  const chance = (p: number) => r() < p;
  const int = (n: number) => Math.floor(r() * n);
  const raw = g.raw as TuxMapLevelModel & Record<string, unknown>;
  const comps = raw.level3.c1!;
  const sgs: TuxMapSubgraph[] = [...Object.values(raw.subgraphs ?? {}), ...g.arrivals.map((a) => a[1])];

  const ids: string[] = ["sys", "c1", ...comps.map((c) => c.id)];
  const relPairs: Array<[string, string]> = [];
  const visit = (els: TuxMapLevelElement[]) => {
    for (const e of els) {
      if (e.id) ids.push(e.id);
      if (e.children) visit(e.children);
    }
  };
  let routeNo = 0;
  for (const sg of sgs) {
    for (const e of sg.elements) {
      if (chance(0.04)) e.deployed = chance(0.5) ? "vm1" : ["vm1", "db1"];
      if (chance(0.06)) e.status = "planned";
      if (chance(0.1)) e.tech = chance(0.5) ? "TypeScript" : `GET /t${int(4)}`;
      if (chance(0.1) && e.id) e.source = { path: `src/${e.id.replace(/^\w+:/, "")}` };
    }
    if (chance(0.15)) sg.elements.push({ id: `r:GET /api/r${routeNo}`, kind: "route", name: `GET /api/r${routeNo++}` });
    if (chance(0.1)) sg.elements.push({ id: `e:route${routeNo}`, kind: "route", name: `POST /api/r${int(6)}` });
    visit(sg.elements);
    for (const rel of sg.rels ?? []) {
      if (chance(0.15)) rel.status = "planned";
      if (chance(0.3)) rel.label = "uses";
      relPairs.push([rel.from, rel.to]);
    }
  }
  const pick = () => (chance(0.05) ? `f:nowhere/${int(3)}.ts` : ids[int(ids.length)]!);

  // Levels 1 to 4
  raw.level1.elements.push({ id: "ext", kind: "external", name: "Other system" });
  raw.level1.rels = [{ from: "sys", to: "ext", ...(chance(0.3) ? { status: "planned" as const } : {}) }];
  if (chance(0.6)) {
    raw.level2.elements.push({ id: "c2", kind: "container", name: "Worker", ...(chance(0.3) ? { deployed: "vm1" } : {}) });
    raw.level2.rels = [{ from: "c1", to: "c2" }, { from: pick(), to: pick() }];
    raw.level3.c2 = chance(0.5) ? [] : [{ id: "comp-w", kind: "component", name: "W" }];
    if (chance(0.3)) g.arrivals.splice(int(g.arrivals.length + 1), 0, ["c2", { stratum: "Files", elements: files("worker", 1 + int(12)) }]);
  }
  comps.forEach((c, i) => {
    if (chance(0.3)) c.next = int(comps.length + 1);
    if (chance(0.15)) c.status = "planned";
    if (chance(0.25)) c.deployed = "vm1";
    if (chance(0.1)) c.name = `GET /c${i}`;
  });
  if (chance(0.7)) {
    raw.level4 = {
      groups: [],
      nodes: [
        { id: "vm1", kind: "vm", title: "VM", role: "host", hosts: [pick(), "c1"], ...(chance(0.3) ? { children: [file("vm/unit.service")] } : {}) },
        { id: "db1", kind: "database", title: "DB", role: "data", ...(chance(0.3) ? { status: "planned" as const } : {}) },
      ],
      links: [
        { from: "vm1", to: "db1", kind: "reads", ...(chance(0.3) ? { state: "planned" as const } : {}) },
        ...Array.from({ length: int(4) }, () => ({ from: pick(), to: pick(), ...(chance(0.5) ? { kind: "uses" } : {}) })),
        // the ends of a subgraph's relationship: whichever is bridged first wins
        ...relPairs.filter(() => chance(0.2)).map(([from, to]) => ({ from, to, label: "deploy" })),
      ],
    };
  }

  // Code links
  const kinds = ["imports", "calls", "handled-by", "routes", "copies", "mentions", "tests"];
  const link = (): TuxMapLink => {
    const kind = kinds[int(kinds.length)]!;
    const from = (kind === "routes" || kind === "handled-by") && chance(0.7) ? `r:GET /api/r${int(routeNo + 1)}` : pick();
    return { from, to: pick(), kind, ...(chance(0.1) ? { stop: chance(0.5) } : {}) };
  };
  const nLinks = chance(0.2) ? 0 : 2 + int(14);
  const made = Array.from({ length: nLinks }, link);
  // and one under a relationship, so the relationship is covered as soon as both ends have their parents
  for (const [from, to] of relPairs) if (chance(0.25)) made.push({ from, to, kind: "imports" });
  if (chance(0.3)) raw.linkTiers = { spread: made.filter((_, i) => i % 2 === 0), stop: made.filter((_, i) => i % 2 === 1) };
  else raw.links = made;
  if (chance(0.2)) raw.stopKinds = ["mentions"];

  if (chance(0.6)) {
    raw.routes = Array.from({ length: 1 + int(5) }, () => ({
      ...(chance(0.8) ? { method: chance(0.5) ? "GET" : "post" } : {}),
      pattern: `/api/r${int(routeNo + 2)}`,
      handler: chance(0.1) ? "" : pick(),
      ...(chance(0.3) ? { framework: "express" } : {}),
    }));
  }
  return g;
}

describe("the links and the search index on generated models", () => {
  it("after every arrival, extended or built again, they equal the whole model's", () => {
    const counts: DerivedCounts = { arrivals: 0, added: 0, linksExtended: 0, linksSame: 0, searchExtended: 0 };
    for (let seed = 1; seed <= 400; seed++) {
      const g = generateLinked(seed);
      feed(g.raw, g.arrivals);
      feedDerived(g.raw, g.arrivals, counts);
    }
    expect(counts.arrivals).toBeGreaterThan(1500);
    // both paths are exercised for each of them: a fair share extended, a fair share built again
    const links = counts.linksExtended / (2 * counts.arrivals);
    const search = counts.searchExtended / counts.arrivals;
    expect(links).toBeGreaterThan(0.5);
    expect(links).toBeLessThan(0.95);
    expect(counts.linksSame).toBeGreaterThan(100);
    expect(counts.linksSame).toBeLessThan(counts.linksExtended);
    expect(search).toBeGreaterThan(0.5);
    expect(search).toBeLessThan(0.95);
    // 400 models, three full extractions per arrival: give the shared CI runner (about 7x a laptop) room
  }, 180_000);
});
