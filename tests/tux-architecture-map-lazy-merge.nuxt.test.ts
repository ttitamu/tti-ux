// A lazily resolved subgraph arriving in a mounted <TuxArchitectureMap> (#157):
// the arrival is added to the model and to the indexes built from it, so what
// was indexed before stays the same objects, and the result equals a map that
// was given the same subgraphs from the start. A new model, or an edit inside a
// reactive one under `watchModelDeep` (#222), starts over.
import { describe, expect, it } from "vitest";
import { nextTick, reactive } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import type {
  TuxMapLevelElement,
  TuxMapLevelModel,
  TuxMapSubgraph,
} from "../packages/diagrams/app/utils/tuxArchitectureMap";

type SetupState = {
  byId: Record<string, TuxMapLevelElement>;
  parentOf: Map<string, string>;
  activeModel: TuxMapLevelModel;
  mergedModel: { added?: { key: string } };
  hydrateLazySubgraph: (id: string) => Promise<unknown>;
};

const files = (dir: string, n: number): TuxMapLevelElement[] =>
  Array.from({ length: n }, (_, i) => ({ id: `f:${dir}/f${i}.ts`, kind: "file", name: `f${i}.ts` }));

/** More files than a small component holds, so nothing is flattened and each arrival can be added. */
const LAZY: Record<string, TuxMapSubgraph> = {
  "sg-one": {
    stratum: "Files",
    elements: [
      ...files("one", 11),
      { id: "d:one/in", kind: "folder", name: "in/", children: files("one/in", 2) },
    ],
    rels: [{ from: "f:one/f0.ts", to: "f:one/f1.ts", label: "imports" }],
  },
  "sg-two": { stratum: "Files", elements: files("two", 12), rels: [] },
};

function lazyModel(inline: string[] = []): TuxMapLevelModel {
  const subgraphs: Record<string, TuxMapSubgraph> = { "sg-own": { stratum: "Files", elements: files("own", 12), rels: [] } };
  for (const k of inline) subgraphs[k] = LAZY[k]!;
  return {
    level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
    level2: {
      boundary: "sys",
      elements: [{ id: "c1", kind: "container", name: "Service Container" }],
      rels: [],
    },
    level3: {
      c1: [
        { id: "comp-one", kind: "component", name: "One", subgraphRef: "sg-one" },
        { id: "comp-two", kind: "component", name: "Two", subgraphRef: "sg-two" },
        { id: "comp-own", kind: "component", name: "Own", subgraphRef: "sg-own" },
      ],
    },
    level4: { groups: [], nodes: [], links: [] },
    subgraphs,
  };
}

async function settle() {
  for (let i = 0; i < 40; i++) {
    await Promise.resolve();
    await nextTick();
  }
}

async function mountMap(model: TuxMapLevelModel, extra: Record<string, unknown> = {}) {
  return mountSuspended(TuxArchitectureMap, {
    props: {
      model,
      initialLevel: 3,
      initialFocus: "c1",
      resolveSubgraph: (ref: string) => Promise.resolve(LAZY[ref] ?? null),
      ...extra,
    },
  });
}

type Mounted = Awaited<ReturnType<typeof mountMap>>;
const stateOf = (w: Mounted) => (w.vm as unknown as { $: { setupState: SetupState } }).$.setupState;

async function arrive(w: Mounted, id: string) {
  await stateOf(w).hydrateLazySubgraph(id);
  await settle();
}

/** The indexes of `w` equal those of a map mounted with `inline` in its model from the start. */
async function expectSameAsMountedWith(w: Mounted, model: TuxMapLevelModel) {
  const ref = await mountMap(model);
  const got = stateOf(w);
  const want = stateOf(ref);
  expect(got.activeModel).toEqual(want.activeModel);
  expect(Object.keys(got.activeModel.subgraphs ?? {})).toEqual(Object.keys(want.activeModel.subgraphs ?? {}));
  expect(got.byId).toEqual(want.byId);
  expect(Object.keys(got.byId)).toEqual(Object.keys(want.byId));
  expect([...got.parentOf]).toEqual([...want.parentOf]);
  ref.unmount();
}

describe("TuxArchitectureMap lazy subgraph arrival (#157)", () => {
  it("keeps the indexed elements and parents it had, and adds the arrival", async () => {
    const w = await mountMap(lazyModel());
    const s = stateOf(w);
    const byIdBefore = s.byId;
    const elementsBefore = { ...byIdBefore };
    const parentsBefore = [...s.parentOf];
    expect(elementsBefore["f:own/f0.ts"]).toBeDefined();
    expect(elementsBefore["f:one/f0.ts"]).toBeUndefined();

    await arrive(w, "comp-one");
    expect(s.mergedModel.added?.key).toBe("sg-one");
    expect(s.byId).not.toBe(byIdBefore);
    for (const id of Object.keys(elementsBefore)) expect(s.byId[id], id).toBe(elementsBefore[id]);
    expect(Object.keys(s.byId).slice(0, Object.keys(elementsBefore).length)).toEqual(Object.keys(elementsBefore));
    expect([...s.parentOf].slice(0, parentsBefore.length)).toEqual(parentsBefore);
    expect(s.byId["f:one/in/f1.ts"]?.name).toBe("f1.ts");
    expect(s.parentOf.get("f:one/f0.ts")).toBe("comp-one");
    expect(s.parentOf.get("f:one/in/f1.ts")).toBe("d:one/in");
    await expectSameAsMountedWith(w, lazyModel(["sg-one"]));

    // a second arrival is added to the first
    const afterOne = { ...s.byId };
    await arrive(w, "comp-two");
    expect(s.mergedModel.added?.key).toBe("sg-two");
    for (const id of Object.keys(afterOne)) expect(s.byId[id], id).toBe(afterOne[id]);
    await expectSameAsMountedWith(w, lazyModel(["sg-one", "sg-two"]));
    w.unmount();
  });

  it("gives the same indexes whichever subgraph arrives first", async () => {
    const w = await mountMap(lazyModel());
    await arrive(w, "comp-two");
    await arrive(w, "comp-one");
    await expectSameAsMountedWith(w, lazyModel(["sg-two", "sg-one"]));
    w.unmount();
  });

  it("starts over when the model changes", async () => {
    const w = await mountMap(lazyModel());
    await arrive(w, "comp-one");
    const s = stateOf(w);
    const before = s.byId["comp-own"];

    const next = lazyModel();
    next.level3.c1!.push({ id: "comp-new", kind: "component", name: "New" });
    await w.setProps({ model: next });
    await settle();
    expect(s.mergedModel.added).toBeUndefined();
    expect(s.byId["comp-own"]).not.toBe(before);
    expect(s.byId["f:one/f0.ts"]).toBeUndefined();
    await expectSameAsMountedWith(w, next);

    // and an arrival in the new model is added to the new model
    await arrive(w, "comp-one");
    expect(s.mergedModel.added?.key).toBe("sg-one");
    const withOne = lazyModel(["sg-one"]);
    withOne.level3.c1!.push({ id: "comp-new", kind: "component", name: "New" });
    await expectSameAsMountedWith(w, withOne);
    w.unmount();
  });

  it("starts over when a reactive model is edited in place, with watchModelDeep (#222)", async () => {
    const model = reactive(lazyModel()) as TuxMapLevelModel;
    const w = await mountMap(model, { watchModelDeep: true });
    await arrive(w, "comp-one");
    const s = stateOf(w);
    expect(s.mergedModel.added?.key).toBe("sg-one");

    model.level3.c1!.push({ id: "comp-new", kind: "component", name: "New" });
    await settle();
    expect(s.byId["comp-new"]?.name).toBe("New");
    expect(s.mergedModel.added).toBeUndefined();

    await arrive(w, "comp-two");
    const want = lazyModel(["sg-one", "sg-two"]);
    want.level3.c1!.push({ id: "comp-new", kind: "component", name: "New" });
    await expectSameAsMountedWith(w, want);
    w.unmount();
  });
});

// What is read from the model after the indexes: the links, the search index and the
// vendored-copy index. Each is extended, or kept, by an arrival, and must equal a full build.
type DerivedState = SetupState & {
  effectiveModelLinks: { from: string; to: string; kind?: string }[];
  mapSearchIndex: { id: string }[];
  vendoredCopyIndex: { copyToCanonical: Map<string, string>; copiesByCanonical: Map<string, string[]> };
};

const LAZY_EXT: TuxMapSubgraph = {
  stratum: "Files",
  elements: [...files("ext", 11), { id: "x:ext", kind: "external", name: "Elsewhere" }],
  rels: [],
};

function linkedModel(inline: string[] = []): TuxMapLevelModel {
  const model = lazyModel(inline.filter((k) => k !== "sg-ext"));
  model.level3.c1!.push({ id: "comp-ext", kind: "component", name: "Ext", subgraphRef: "sg-ext" });
  if (inline.includes("sg-ext")) {
    // in the order they were asked for
    const subgraphs: Record<string, TuxMapSubgraph> = { "sg-own": model.subgraphs!["sg-own"]! };
    for (const k of inline) subgraphs[k] = k === "sg-ext" ? LAZY_EXT : LAZY[k]!;
    model.subgraphs = subgraphs;
  }
  model.links = [
    { from: "f:own/f0.ts", to: "f:own/f1.ts", kind: "copies" },
    { from: "f:own/f2.ts", to: "x:ext", kind: "copies" },
    { from: "f:own/f3.ts", to: "f:own/f4.ts", kind: "imports" },
  ];
  return model;
}

async function mountLinked(model: TuxMapLevelModel) {
  return mountSuspended(TuxArchitectureMap, {
    props: {
      model,
      initialLevel: 3,
      initialFocus: "c1",
      resolveSubgraph: (ref: string) => Promise.resolve(ref === "sg-ext" ? LAZY_EXT : (LAZY[ref] ?? null)),
    },
  });
}

const derivedOf = (w: Mounted) => stateOf(w) as DerivedState;

async function expectDerivedAsMountedWith(w: Mounted, model: TuxMapLevelModel) {
  const ref = await mountLinked(model);
  const got = derivedOf(w);
  const want = derivedOf(ref);
  expect(got.activeModel).toEqual(want.activeModel);
  expect(got.effectiveModelLinks).toStrictEqual(want.effectiveModelLinks);
  expect(got.mapSearchIndex).toStrictEqual(want.mapSearchIndex);
  expect([...got.vendoredCopyIndex.copyToCanonical]).toEqual([...want.vendoredCopyIndex.copyToCanonical]);
  expect([...got.vendoredCopyIndex.copiesByCanonical]).toEqual([...want.vendoredCopyIndex.copiesByCanonical]);
  ref.unmount();
}

describe("TuxArchitectureMap lazy subgraph arrival: links, search and vendored copies (#157)", () => {
  it(
    "keeps what an arrival cannot change and extends the rest, equal to a full build",
    async () => {
      const w = await mountLinked(linkedModel());
      const s = derivedOf(w);
      const links0 = s.effectiveModelLinks;
      const search0 = s.mapSearchIndex;
      const vendored0 = s.vendoredCopyIndex;
      expect(links0.length).toBeGreaterThan(0);
      expect(vendored0.copyToCanonical.get("f:own/f2.ts")).toBe("x:ext");
      await expectDerivedAsMountedWith(w, linkedModel());

      // no rels, no end of a copy: the same links and the same copy index, more to search
      await arrive(w, "comp-two");
      expect(s.mergedModel.added?.key).toBe("sg-two");
      expect(s.effectiveModelLinks).toBe(links0);
      expect(s.vendoredCopyIndex).toBe(vendored0);
      const search1 = s.mapSearchIndex;
      expect(search1).not.toBe(search0);
      expect(search1.length).toBeGreaterThan(search0.length);
      search0.forEach((entry, i) => expect(search1[i], entry.id).toBe(entry));
      expect(search1.some((e) => e.id === "f:two/f0.ts")).toBe(true);
      await expectDerivedAsMountedWith(w, linkedModel(["sg-two"]));

      // a rel arrives: the links before are the same objects, the arrival's rel is among them
      await arrive(w, "comp-one");
      expect(s.mergedModel.added?.key).toBe("sg-one");
      const links2 = s.effectiveModelLinks;
      expect(links2).not.toBe(links0);
      for (const l of links0) expect(links2).toContain(l);
      expect(links2.some((l) => l.from === "f:one/f0.ts" && l.to === "f:one/f1.ts")).toBe(true);
      expect(s.vendoredCopyIndex).toBe(vendored0);
      expect(s.mapSearchIndex.some((e) => e.id === "f:one/in/f1.ts")).toBe(true);
      await expectDerivedAsMountedWith(w, linkedModel(["sg-two", "sg-one"]));

      // the end of a copy arrives with a kind that is not folded: the copy index is built again
      await arrive(w, "comp-ext");
      expect(s.mergedModel.added?.key).toBe("sg-ext");
      expect(s.vendoredCopyIndex).not.toBe(vendored0);
      expect(s.vendoredCopyIndex.copyToCanonical.has("f:own/f2.ts")).toBe(false);
      expect(s.vendoredCopyIndex.copyToCanonical.get("f:own/f0.ts")).toBe("f:own/f1.ts");
      await expectDerivedAsMountedWith(w, linkedModel(["sg-two", "sg-one", "sg-ext"]));
      w.unmount();
    },
    120_000,
  );

  it(
    "builds the copy index again after an arrival that was not read indexed the end of a copy",
    async () => {
      const w = await mountLinked(linkedModel());
      const s = derivedOf(w);
      expect(s.vendoredCopyIndex.copyToCanonical.get("f:own/f2.ts")).toBe("x:ext");
      // two arrivals in one turn: the copy index is read after the second only
      const held: Record<string, TuxMapSubgraph> = Object.create(null);
      held["sg-ext"] = LAZY_EXT;
      (s as unknown as { resolvedSubgraphs: Record<string, TuxMapSubgraph> }).resolvedSubgraphs = held;
      expect(s.mergedModel.added?.key).toBe("sg-ext");
      await arrive(w, "comp-two");
      expect(s.mergedModel.added?.key).toBe("sg-two");
      expect(s.vendoredCopyIndex.copyToCanonical.has("f:own/f2.ts")).toBe(false);
      await expectDerivedAsMountedWith(w, linkedModel(["sg-ext", "sg-two"]));
      w.unmount();
    },
    120_000,
  );

  it(
    "builds all three again when the model changes",
    async () => {
      const w = await mountLinked(linkedModel());
      const s = derivedOf(w);
      await arrive(w, "comp-two");
      const links = s.effectiveModelLinks;
      const first = s.mapSearchIndex[0];
      const vendored = s.vendoredCopyIndex;

      const next = linkedModel();
      next.links = [{ from: "f:own/f5.ts", to: "f:own/f6.ts", kind: "copies" }];
      await w.setProps({ model: next });
      await settle();
      expect(s.mergedModel.added).toBeUndefined();
      expect(s.effectiveModelLinks).not.toBe(links);
      expect(s.mapSearchIndex[0]).not.toBe(first);
      expect(s.vendoredCopyIndex).not.toBe(vendored);
      await expectDerivedAsMountedWith(w, next);

      await arrive(w, "comp-ext");
      const withExt = linkedModel(["sg-ext"]);
      withExt.links = next.links;
      await expectDerivedAsMountedWith(w, withExt);
      w.unmount();
    },
    120_000,
  );
});
