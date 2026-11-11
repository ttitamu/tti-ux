/**
 * `extractModelLinks` and `levelForFocus` read the caller's parent index when one is passed, and
 * build one only when it is not (#160).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildMapParentIndex,
  collapseModelSubgraphs,
  extractModelLinks,
  levelForFocus,
  sanitizeMapModel,
  type TuxMapLevelModel,
} from "../app/utils/tuxArchitectureMap";
import { resolveFixtureModels } from "./helpers/mapFixture.ts";
import { buildSyntheticMapModel } from "./support/mapSyntheticModels";

const FIXTURE_DIR = join(import.meta.dirname, "fixtures");

function fixtureModels(): Record<string, TuxMapLevelModel> {
  const fixture = JSON.parse(readFileSync(join(FIXTURE_DIR, "map-conformance.json"), "utf8")) as {
    models: Record<string, unknown>;
  };
  const models = resolveFixtureModels<TuxMapLevelModel>(fixture.models, FIXTURE_DIR);
  const synthetic = buildSyntheticMapModel({ symbols: 500, cardsPerView: 12 });
  models.synthetic_500 = collapseModelSubgraphs(sanitizeMapModel(synthetic.model).model).model;
  return models;
}

const LINK_OPTS = [
  {},
  { includePlanned: true },
  { bridgeUncoveredPairs: true },
  { includePlanned: true, bridgeUncoveredPairs: true },
  { bridgeUncovered: false },
  { includeC4Rels: true },
] as const;

/**
 * A Map that counts its reads and throws on any write, so a test can tell that the index it passed
 * was the one read, and that it was only read.
 */
class CountingIndex extends Map<string, string> {
  reads = 0;
  private sealed = false;
  constructor(entries: Iterable<[string, string]>) {
    super();
    for (const [k, v] of entries) super.set(k, v);
    this.sealed = true;
  }
  override get(key: string) {
    this.reads++;
    return super.get(key);
  }
  override set(key: string, value: string) {
    if (this.sealed) throw new Error("the passed parent index was written to");
    return super.set(key, value);
  }
  override delete(): boolean {
    throw new Error("the passed parent index was written to");
  }
  override clear() {
    throw new Error("the passed parent index was written to");
  }
}

describe("a parent index passed by the caller (#160)", () => {
  const models = fixtureModels();

  it("extractModelLinks returns the same links with and without `parentOf`, on every fixture model", () => {
    let bridged = 0;
    for (const [name, model] of Object.entries(models)) {
      const parentOf = buildMapParentIndex(model);
      for (const opts of LINK_OPTS) {
        const without = extractModelLinks(model, opts);
        const withIndex = extractModelLinks(model, { ...opts, parentOf });
        expect(withIndex, `${name} ${JSON.stringify(opts)}`).toEqual(without);
        if (without.length > (model.links?.length ?? 0)) bridged++;
      }
    }
    // The comparison is empty unless some model takes the path that reads the index
    expect(bridged).toBeGreaterThan(0);
  });

  it("levelForFocus returns the same level with and without `parentOf`, for every id of every fixture model", () => {
    let checked = 0;
    for (const [name, model] of Object.entries(models)) {
      const parentOf = buildMapParentIndex(model);
      const ids = new Set<string>([...parentOf.keys(), ...parentOf.values()]);
      for (const e of model.level2?.elements ?? []) if (e.id) ids.add(e.id);
      for (const id of ids) {
        expect(levelForFocus(id, model, parentOf), `${name}: ${id}`).toBe(levelForFocus(id, model));
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  it("extractModelLinks reads the passed index and does not build another", () => {
    // Two components under one container; code links cover comp_a only through its child, and
    // only the parent index says that child is under comp_a
    const model = {
      schema: "tux-map/1",
      level1: { elements: [], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "web", name: "Web", kind: "container" },
          { id: "api", name: "API", kind: "container" },
        ],
        rels: [{ from: "web", to: "api", label: "calls" }],
      },
      level3: {
        web: [{ id: "comp_a", name: "A", kind: "component" }],
        api: [{ id: "comp_b", name: "B", kind: "component" }],
      },
      subgraphs: {
        comp_a: { elements: [{ id: "a.ts", name: "a.ts", kind: "file" }], rels: [] },
        comp_b: { elements: [{ id: "b.ts", name: "b.ts", kind: "file" }], rels: [] },
      },
      links: [{ from: "a.ts", to: "b.ts", kind: "import" }],
    } as unknown as TuxMapLevelModel;

    const real = buildMapParentIndex(model);
    const counting = new CountingIndex(real);
    const opts = { bridgeUncoveredPairs: true } as const;
    const expected = extractModelLinks(model, opts);
    expect(extractModelLinks(model, { ...opts, parentOf: counting })).toEqual(expected);
    expect(counting.reads).toBeGreaterThan(0);
    // The code link covers web → api through the index, so the C4 relationship is not bridged
    expect(expected.some((l) => l.from === "web" && l.to === "api")).toBe(false);

    // An index that knows no parents gives a different, predictable answer: nothing is covered
    // above the two files, so the relationship is bridged. Had the function built its own index
    // from the model, the answer would be `expected` again.
    const empty = new CountingIndex([]);
    const withEmpty = extractModelLinks(model, { ...opts, parentOf: empty });
    expect(withEmpty.some((l) => l.from === "web" && l.to === "api")).toBe(true);
    expect(withEmpty).not.toEqual(expected);
  });

  it("levelForFocus reads the passed index and does not build another", () => {
    const model = models.synthetic_500!;
    const real = buildMapParentIndex(model);
    // The deepest id: the one with the longest chain of parents
    let deepest = "";
    let depth = -1;
    for (const id of real.keys()) {
      let d = 0;
      for (let cur: string | undefined = id; cur && d < 64; cur = real.get(cur)) d++;
      if (d > depth) [deepest, depth] = [id, d];
    }
    const expected = levelForFocus(deepest, model);
    expect(expected).toBeGreaterThan(5);

    const counting = new CountingIndex(real);
    expect(levelForFocus(deepest, model, counting)).toBe(expected);
    expect(counting.reads).toBeGreaterThan(0);

    // With an index that knows no parents the walk stops at once: level 5, not the real level
    const empty = new CountingIndex([]);
    expect(levelForFocus(deepest, model, empty)).toBe(5);
    expect(empty.reads).toBe(1);
  });
});
