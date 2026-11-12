/**
 * `validateMapModel` checks the shape of a document against the JSON Schema generated from the model types
 * (`schema/tux-map-1.schema.json`), and reports what it finds as warnings (#163).
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildMapSearchIndex,
  buildUnifiedArchitectureGraph,
  collapseModelSubgraphs,
  extractModelLinks,
  mergeLazyMapSubgraphs,
  searchArchitectureMap,
  sanitizeMapModel,
  TUX_MAP_SCHEMA,
  validateMapModel,
  type TuxMapValidationIssue,
} from "../app/utils/tuxArchitectureMap";
import { everyShapeError } from "./support/mapShapeErrors";
import { buildEveryStage } from "./support/mapStages";
import { buildSyntheticMapModel } from "./support/mapSyntheticModels";

const pkgPath = (rel: string): string => fileURLToPath(new URL(`../${rel}`, import.meta.url));
const readJson = (rel: string): Record<string, any> => JSON.parse(readFileSync(pkgPath(rel), "utf8"));

const SHAPE_CODES = new Set(["missing-field", "invalid-type", "unknown-kind", "unknown-enum-value"]);

/** A document with nothing to report. Each test breaks one thing in it. */
const cleanDocument = (): Record<string, any> => ({
  schema: TUX_MAP_SCHEMA,
  level1: { elements: [{ id: "sys", name: "Sys" }], rels: [] },
  level2: { boundary: "sys", elements: [{ id: "c-a", name: "A" }], rels: [] },
  level3: { "c-a": [{ id: "k-one", name: "One" }] },
  level4: { groups: [], nodes: [{ id: "vm", kind: "vm", title: "VM", role: "host" }], links: [] },
});

/** `[code, path, count]` of every warning the schema produced. */
const shape = (doc: unknown): Array<[string, string | undefined, number | undefined]> =>
  validateMapModel(doc)
    .warnings.filter((w) => SHAPE_CODES.has(w.code))
    .map((w) => [w.code, w.path, w.count]);

const only = (doc: unknown): TuxMapValidationIssue => {
  const v = validateMapModel(doc);
  expect(v.issues).toEqual([]);
  expect(v.valid).toBe(true);
  expect(v.warnings).toHaveLength(1);
  return v.warnings[0]!;
};

describe("the shape of a document (#163)", () => {
  it("reports nothing on a document that has the shape of the types", () => {
    const doc = cleanDocument();
    // What the types allow and a first reading of them might not: a `ref` element at Level 2 has no name, a
    // property the types do not name is not an error, and `null` is read as a field that is not there
    doc.level2.elements.push({ id: "sys", ref: true });
    doc.level1.elements[0].madeUp = { anything: [1, "two"] };
    doc.addedByALaterRelease = true;
    doc.level1.elements[0].tech = null;
    doc.links = null;
    doc.level1.elements[0].runs = "vm";
    doc.level2.elements[0].runs = ["vm"];
    expect(validateMapModel(doc)).toMatchObject({ valid: true, issues: [], warnings: [] });
  });

  it("missing-field: a required field that is not a container is reported too, as a warning", () => {
    const doc = cleanDocument();
    delete doc.level1.elements[0].name;
    const w = only(doc);
    expect(w).toMatchObject({ code: "missing-field", path: "/level1/elements/0/name" });
    expect(w.count).toBeUndefined();
    expect(w.message).toContain("/level1/elements/0/name");

    // `null` on a required field is the same finding, not a type error
    const withNull = cleanDocument();
    withNull.level4.nodes[0].role = null;
    expect(shape(withNull)).toEqual([["missing-field", "/level4/nodes/0/role", undefined]]);

    // A Level 1 element is not a reference: `ref: true` does not excuse the name there
    const refAtLevel1 = cleanDocument();
    refAtLevel1.level1.elements[0] = { id: "sys", ref: true };
    expect(shape(refAtLevel1)).toEqual([["missing-field", "/level1/elements/0/name", undefined]]);
  });

  it("invalid-type: a value of another JSON type than the schema has", () => {
    const cases: Array<[(doc: Record<string, any>) => void, string, string]> = [
      // a container that is there and is not a list
      [(d) => (d.level1.elements = { sys: { id: "sys", name: "Sys" } }), "/level1/elements", "an object"],
      [(d) => (d.subgraphs = []), "/subgraphs", "a list of 0"],
      [(d) => (d.subgraphs = { "k-one": "f-a" }), "/subgraphs/k-one", '"f-a"'],
      // an item that is not an object
      [(d) => d.level3["c-a"].push("k-two"), "/level3/c-a/1", '"k-two"'],
      [(d) => d.level1.rels.push(null), "/level1/rels/0", "null"],
      // a scalar of the wrong type
      [(d) => (d.level1.elements[0].name = 5), "/level1/elements/0/name", "5"],
      [(d) => (d.level1.elements[0].mini = "yes"), "/level1/elements/0/mini", '"yes"'],
      // a tuple of the wrong length, and one with the wrong item
      [(d) => (d.level1.elements[0].at = [1]), "/level1/elements/0/at", "a list of 1"],
      [(d) => (d.level1.elements[0].at = [1, "2"]), "/level1/elements/0/at/1", '"2"'],
      // neither side of a union
      [(d) => (d.level1.elements[0].runs = 7), "/level1/elements/0/runs", "7"],
      // the side of a union it is closest to
      [(d) => (d.level1.elements[0].runs = ["vm", 7]), "/level1/elements/0/runs/1", "7"],
    ];
    for (const [breakIt, path, found] of cases) {
      const doc = cleanDocument();
      breakIt(doc);
      const w = only(doc);
      expect(w, path).toMatchObject({ code: "invalid-type", path });
      expect(w.message, path).toContain(`has ${found} at '${path}'`);
    }
  });

  it("unknown-kind: an element kind this release does not list is a warning, so a later producer still renders", () => {
    const doc = cleanDocument();
    doc.level1.elements[0].kind = "queue";
    const w = only(doc);
    expect(w).toMatchObject({ code: "unknown-kind", path: "/level1/elements/0/kind" });
    expect(w.message).toContain('"queue"');
    // The element is kept as written
    expect(sanitizeMapModel(doc).model.level1.elements[0]).toMatchObject({ id: "sys", kind: "queue" });

    // A kind that is not a string is a type error, not an unknown kind
    doc.level1.elements[0].kind = 3;
    expect(shape(doc)).toEqual([["invalid-type", "/level1/elements/0/kind", undefined]]);

    // The kind of a deployment node or of a link is free text
    const free = cleanDocument();
    free.level4.nodes[0].kind = "anything";
    free.links = [{ from: "k-one", to: "c-a", kind: "anything" }];
    expect(shape(free)).toEqual([]);
  });

  it("unknown-enum-value: any other closed list of values, as a warning for the same reason", () => {
    const cases: Array<[(doc: Record<string, any>) => void, string]> = [
      [(d) => (d.level1.elements[0].status = "retired"), "/level1/elements/0/status"],
      [(d) => (d.level4.nodes[0].status = "retired"), "/level4/nodes/0/status"],
      [(d) => (d.links = [{ from: "k-one", to: "c-a", coupling: "quantum" }]), "/links/0/coupling"],
      [(d) => (d.level1.elements[0].side = "up"), "/level1/elements/0/side"],
    ];
    for (const [breakIt, path] of cases) {
      const doc = cleanDocument();
      breakIt(doc);
      const w = only(doc);
      expect(w, path).toMatchObject({ code: "unknown-enum-value", path });
      expect(w.message, path).toContain("this release knows one of");
    }
  });

  it("reports one rule broken in many places once, with the first path and the count", () => {
    const doc = cleanDocument();
    doc.level1.elements.push({ id: "sys-2", name: "Two", kind: "queue" }, { id: "sys-3", name: "Three", kind: "topic" });
    doc.subgraphs = {
      "k-one": { elements: [{ id: "f-a", name: "a.ts", kind: "queue" }] },
      "f-a": { elements: [{ id: "s-x", name: "x", kind: "queue", status: "retired" }] },
    };
    expect(shape(doc)).toEqual([
      ["unknown-kind", "/level1/elements/1/kind", 4],
      ["unknown-enum-value", "/subgraphs/f-a/elements/0/status", undefined],
    ]);
    expect(validateMapModel(doc).warnings[0]!.message).toContain("(and 3 more like it)");
  });

  it("does not repeat what the validator already says about `schema` and a missing level", () => {
    const doc = cleanDocument();
    doc.schema = 7;
    doc.level3 = [];
    delete doc.level4;
    const v = validateMapModel(doc);
    expect(v.issues.map((i) => i.code)).toEqual(["missing-level", "missing-level"]);
    expect(v.warnings.map((w) => w.code)).toEqual(["unknown-schema"]);
  });

  it("a document with every kind of shape error is still valid, and still renders", () => {
    const doc = everyShapeError();

    const { model, validation } = sanitizeMapModel(doc);
    expect(validation.valid).toBe(true);
    expect(validation.issues).toEqual([]);
    const codes = new Set(validation.warnings.map((w) => w.code));
    expect([...codes].sort()).toEqual(["invalid-type", "missing-field", "unknown-enum-value", "unknown-kind"]);
    for (const w of validation.warnings) expect(w.path, w.message).toMatch(/^\//);

    expect(buildEveryStage(model)).toEqual([1, 2, 3, 4]);
    expect(buildEveryStage(collapseModelSubgraphs(model).model, "k-one")).toEqual([1, 2, 3, 4, 5]);
  }, 20_000);

  it("reads a value of the wrong type, anywhere the schema names one, without failing", () => {
    // A document with every property the schema names, each with a value of its type
    const schema = readJson("schema/tux-map-1.schema.json");
    const fill = (node: Record<string, any>, depth: number): unknown => {
      if (node.$ref) return fill(schema.$defs[node.$ref.slice("#/$defs/".length)], depth + 1);
      if (node.anyOf) return fill(node.anyOf[0], depth);
      if (node.const !== undefined) return node.const;
      if (node.enum) return node.enum[0];
      if (node.type === "string") return "x";
      if (node.type === "number") return 1;
      if (node.type === "boolean") return true;
      if (node.type === "array") {
        if (node.prefixItems) return node.prefixItems.map((n: Record<string, any>) => fill(n, depth));
        return node.items && depth < 4 ? [fill(node.items, depth)] : [];
      }
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node.properties ?? {})) out[k] = fill(v as any, depth);
      if (node.additionalProperties) out.x = fill(node.additionalProperties, depth);
      return out;
    };
    const full = (): Record<string, any> => {
      const doc = fill(schema, 0) as Record<string, any>;
      doc.level1.elements[0].id = "sys";
      doc.level2.boundary = "sys";
      doc.level2.elements[0].id = "c-a";
      doc.level2.elements[0].ref = false;
      doc.level3 = { "c-a": doc.level3.x };
      doc.level3["c-a"][0].id = "k-one";
      doc.level4.nodes[0].id = "vm";
      doc.subgraphs = { "k-one": doc.subgraphs.x };
      doc.subgraphs["k-one"].elements[0].id = "f-a";
      return doc;
    };
    // The readers behind the stage, the search box, the links and the queries, on the model as the map holds it
    const stages = (doc: unknown): number[] => {
      const model = collapseModelSubgraphs(sanitizeMapModel(doc).model).model;
      searchArchitectureMap(buildMapSearchIndex(model), "x");
      extractModelLinks(model, { includePlanned: true, includeC4Rels: true });
      buildUnifiedArchitectureGraph(model);
      return buildEveryStage(model, "k-one");
    };
    expect(shape(full())).toEqual([]);
    expect(stages(full())).toEqual([1, 2, 3, 4, 5]);

    // Every place in it, in turn, with a value of another type, with `null`, and left out
    const places: Array<Array<string | number>> = [];
    const visit = (value: unknown, trail: Array<string | number>): void => {
      if (trail.length > 0) places.push(trail);
      if (Array.isArray(value)) value.forEach((v, i) => visit(v, [...trail, i]));
      else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) visit(v, [...trail, k]);
      }
    };
    visit(full(), []);
    expect(places.length).toBeGreaterThan(300);
    const LEFT_OUT = Symbol("left out");
    const wrong = [7, "wrong", true, [], [7], {}, { x: 7 }, null, LEFT_OUT];
    let tried = 0;
    // Some of them are a document the schema allows (an optional field left out, the other side of a union)
    let warned = 0;
    for (const trail of places) {
      if (trail.length === 1 && /^(schema|level[1-4])$/.test(String(trail[0]))) continue;
      for (const bad of wrong) {
        const doc = full();
        let at: any = doc;
        for (const t of trail.slice(0, -1)) at = at[t];
        const last = trail[trail.length - 1]!;
        if (bad !== null && typeof at[last] === typeof bad && Array.isArray(at[last]) === Array.isArray(bad)) continue;
        if (bad === LEFT_OUT) {
          if (Array.isArray(at)) continue;
          delete at[last];
        } else {
          at[last] = bad;
        }
        const where = `${bad === LEFT_OUT ? "nothing" : JSON.stringify(bad)} at /${trail.join("/")}`;
        try {
          expect(stages(doc), where).toEqual([1, 2, 3, 4, 5]);
        } catch (err) {
          throw new Error(`${where}: ${(err as Error).message}`, { cause: err });
        }
        if (validateMapModel(doc).warnings.length > 0) warned++;
        tried++;
      }
    }
    expect(tried).toBeGreaterThan(1500);
    expect(warned / tried).toBeGreaterThan(0.7);
  }, 120_000);

  it("on a lazy arrival, checks the shape of what arrived and reports the same as a full validation", () => {
    const raw = cleanDocument();
    raw.subgraphs = { "k-one": { elements: [{ id: "f-a", name: "a.ts", kind: "queue" }] } };
    const first = { "f-a": { elements: [{ id: "s-x", name: "x", kind: "topic" }] } };
    const second = { ...first, "s-x": { elements: [{ id: "s-y", status: "retired" }] } };

    const one = mergeLazyMapSubgraphs(raw, first);
    const whole = (lazy: Record<string, unknown>) =>
      validateMapModel({ ...raw, subgraphs: { ...raw.subgraphs, ...lazy } }).warnings;
    expect(one.validation.warnings).toEqual(whole(first));
    expect(shape({ ...raw, subgraphs: { ...raw.subgraphs, ...first } })).toEqual([
      ["unknown-kind", "/subgraphs/k-one/elements/0/kind", 2],
    ]);

    const two = mergeLazyMapSubgraphs(raw, second, one);
    expect(two.validation.warnings).toEqual(whole(second));
    expect(two.validation.warnings.map((w) => [w.code, w.path, w.count])).toEqual([
      ["unknown-kind", "/subgraphs/k-one/elements/0/kind", 2],
      ["missing-field", "/subgraphs/s-x/elements/0/name", undefined],
      ["unknown-enum-value", "/subgraphs/s-x/elements/0/status", undefined],
    ]);

    // The parts validated before are read back, not walked again: a change made to one in place (which the
    // lazy merge does not allow) is not seen by the next arrival, and is seen by a validation from scratch.
    raw.level1.elements[0].kind = "stream";
    const third = { ...second, "s-y": { elements: [] } };
    const three = mergeLazyMapSubgraphs(raw, third, two);
    expect(three.validation.warnings).toEqual(two.validation.warnings);
    expect(whole(third)[0]).toMatchObject({ code: "unknown-kind", path: "/level1/elements/0/kind", count: 3 });
    expect(mergeLazyMapSubgraphs(raw, third).validation.warnings).toEqual(whole(third));
  });

  it("fills the required strings of an element and a deployment node, at every level they are read", () => {
    const doc = cleanDocument();
    doc.level1.elements.push({ id: "ext", name: 5 });
    doc.level2.elements.push({ id: "c-b" }, { id: "c-c", name: ["C"], children: [{ id: "c-c-1" }] });
    doc.level3["c-a"].push({ id: "k-two", name: null });
    doc.level4.nodes.push({ id: "bare" }, { id: "typed", kind: 1, title: {}, role: false });
    const { model } = sanitizeMapModel(doc as never);
    const names = (list: Array<{ id: string; name?: string }>) => list.map((e) => [e.id, e.name]);
    expect(names(model.level1.elements)).toEqual([["sys", "Sys"], ["ext", "ext"]]);
    expect(names(model.level2.elements as never)).toEqual([["c-a", "A"], ["c-b", "c-b"], ["c-c", "c-c"]]);
    expect(names((model.level2.elements[2] as any).children)).toEqual([["c-c-1", "c-c-1"]]);
    expect(names(model.level3["c-a"]!)).toEqual([["k-one", "One"], ["k-two", "k-two"]]);
    expect(model.level4.nodes.map((n) => [n.id, n.kind, n.title, n.role])).toEqual([
      ["vm", "vm", "VM", "host"],
      ["bare", "", "bare", ""],
      ["typed", "", "typed", ""],
    ]);
  });

  it("on a lazy arrival, reads back the findings of a part only at the place it was checked", () => {
    const raw = cleanDocument();
    raw.subgraphs = { "k-one": { elements: [{ id: "f-a", name: "a.ts" }, { id: "f-b", name: "b.ts" }] } };
    const arrived = { elements: [{ id: "s-x", name: "x", kind: "topic" }] };
    const one = mergeLazyMapSubgraphs(raw, { "f-a": arrived });
    expect(one.validation.warnings.map((w) => [w.code, w.path])).toEqual([
      ["unknown-kind", "/subgraphs/f-a/elements/0/kind"],
    ]);
    // The same object, now under another key: its findings are the same, their paths are not
    const two = mergeLazyMapSubgraphs(raw, { "f-b": arrived }, one);
    expect(two.validation.warnings.map((w) => [w.code, w.path])).toEqual([
      ["unknown-kind", "/subgraphs/f-b/elements/0/kind"],
    ]);
  });

  it("on a lazy arrival with a value of the wrong type, builds what a build from scratch builds", () => {
    const raw = cleanDocument();
    raw.subgraphs = { "k-one": { elements: [{ id: "f-a", name: "a.ts" }] } };
    const first = { "f-a": { elements: [{ id: "s-x", name: "x" }] } };
    const second = { ...first, "s-x": { elements: [{ id: "s-y", name: "y", desc: 7, roadmap: "one" }] } };
    const one = mergeLazyMapSubgraphs(raw, first);
    const two = mergeLazyMapSubgraphs(raw, second, one);
    const scratch = mergeLazyMapSubgraphs(raw, second);
    expect(two.validation.warnings.map((w) => [w.code, w.path])).toEqual([
      ["invalid-type", "/subgraphs/s-x/elements/0/desc"],
      ["invalid-type", "/subgraphs/s-x/elements/0/roadmap"],
    ]);
    expect(two.model).toEqual(scratch.model);
    const arrived = (two.model.subgraphs as Record<string, any>)["s-x"].elements[0];
    expect(arrived).toMatchObject({ id: "s-y", name: "y" });
    expect(arrived.desc).toBeUndefined();
    expect(arrived.roadmap).toBeUndefined();
  });
});

describe("the shape of the models this repository ships (#163)", () => {
  it("finds nothing in the real producer's model", () => {
    const real = readJson("tests/fixtures/map-real-producer.json");
    expect(Object.keys(real.subgraphs).length).toBeGreaterThan(100);
    expect(shape(real)).toEqual([]);
  });

  it("finds nothing in the large generated models", () => {
    for (const symbols of [500, 10_000]) {
      const { model } = buildSyntheticMapModel({ symbols, cardsPerView: 12 });
      expect(shape(model), `${symbols} symbols`).toEqual([]);
    }
  }, 30_000);

  it("finds, in the conformance fixture, the one shape error that fixture holds on purpose", () => {
    const fixture = readJson("tests/fixtures/map-conformance.json");
    const found: Record<string, unknown> = {};
    for (const [name, model] of Object.entries(fixture.models as Record<string, any>)) {
      if (model.$file) continue;
      const list = shape(model);
      if (list.length > 0) found[name] = list;
    }
    expect(found).toEqual({
      hybrid_c4_and_edge_cases: [
        ["invalid-type", "/subgraphs/sg-aliased-api/elements/0/source/lineRange", undefined],
      ],
    });
  });
});

describe("the generated schema (#163)", () => {
  const run = (script: string) =>
    spawnSync(process.execPath, [pkgPath(`scripts/${script}`), "--check"], { encoding: "utf8" });

  it("is up to date with the model types, in the published file and in the copy the validator reads", () => {
    const res = run("build-map-schema.mjs");
    expect(res.stderr).toBe("");
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("are up to date");
  }, 60_000);

  it("is named for the schema name, lists the four levels as required, and closes no object", () => {
    const fileName = `${TUX_MAP_SCHEMA.replace(/[^A-Za-z0-9]+/g, "-")}.schema.json`;
    expect(fileName).toBe("tux-map-1.schema.json");
    const schema = readJson(`schema/${fileName}`);
    expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(schema.title).toBe(TUX_MAP_SCHEMA);
    expect(schema.properties.schema).toMatchObject({ const: TUX_MAP_SCHEMA });
    expect(schema.required).toEqual(["level1", "level2", "level3", "level4"]);
    expect(schema.properties.level1.required).toEqual(["elements", "rels"]);
    expect(schema.$defs.TuxMapLevelElement.required).toEqual(["id", "name"]);
    expect(schema.$defs.TuxMapSubgraph.required).toEqual(["elements"]);
    expect(schema.$defs.TuxMapElementKind.enum).toContain("container");
    // Forward compatibility: no object refuses a property the schema does not name
    const text = JSON.stringify(schema);
    expect(text).not.toContain('"additionalProperties":false');
    expect(text).not.toContain('"unevaluatedProperties"');
    // Every reference resolves inside the file
    for (const ref of text.match(/"\$ref":"[^"]+"/g) ?? []) {
      const name = ref.slice('"$ref":"#/$defs/'.length, -1);
      expect(schema.$defs, ref).toHaveProperty(name);
    }
    // The package ships it
    expect(readJson("package.json").files).toContain("schema");
  });

  it("is read by an interpreter: the runtime builds no code from a string", () => {
    const runtime = readFileSync(pkgPath("runtime/tuxArchitectureMap.mjs"), "utf8");
    expect(runtime).toContain("MAP_SHAPE_SCHEMA");
    expect(runtime).not.toMatch(/\bnew Function\b|\beval\s*\(|\bFunction\s*\(/);
  });
});
