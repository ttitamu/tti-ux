/**
 * `sanitizeMapModel` is the one place defaults are filled: its result is a `TuxMapNormalizedModel`, and the stage
 * builders read that without guarding its containers (#164).
 */
import { describe, expect, it } from "vitest";
import {
  collapseModelSubgraphs,
  EMPTY_TTI_LEVEL_MODEL,
  mergeLazyMapSubgraphs,
  sanitizeMapModel,
  TUX_MAP_SCHEMA,
  validateMapModel,
} from "../app/utils/tuxArchitectureMap";
import { buildEveryStage } from "./support/mapStages";

/** Only what the model type requires: no optional field anywhere. */
const minimalDocument = () => ({
  level1: { elements: [{ id: "sys", name: "Sys" }], rels: [] },
  level2: { boundary: "sys", elements: [{ id: "c-a", name: "A" }], rels: [] },
  level3: { "c-a": [{ id: "k-one", name: "One" }] },
  level4: { groups: [], nodes: [{ id: "vm", kind: "vm", title: "VM", role: "host" }], links: [] },
});

describe("the normalized model (#164)", () => {
  it("fills the documented default for every optional container, and the stage builders take the result", () => {
    const { model, validation } = sanitizeMapModel({ ...minimalDocument(), schema: TUX_MAP_SCHEMA });
    expect(validation.valid).toBe(true);
    expect(validation.warnings).toEqual([]);

    // Filled: `subgraphs`
    expect(model.subgraphs).toEqual({});
    // Left absent: absence is the value
    for (const key of ["links", "linkTiers", "stopKinds", "routes", "aliases"] as const) {
      expect(model[key], key).toBeUndefined();
    }
    expect(model.level4.zones).toBeUndefined();
    expect(model.level4.neighbors).toBeUndefined();
    const el = model.level1.elements[0]!;
    for (const key of ["kind", "status", "at", "source", "children", "childRels"] as const) {
      expect(el[key], key).toBeUndefined();
    }
    expect(model.level4.nodes[0]!.hosts).toBeUndefined();

    expect(buildEveryStage(model)).toEqual([1, 2, 3, 4]);
    expect(buildEveryStage(collapseModelSubgraphs(model).model)).toEqual([1, 2, 3, 4]);
  }, 20_000);

  it("fills `rels` on a subgraph that has none, without copying the elements", () => {
    const doc = {
      ...minimalDocument(),
      schema: TUX_MAP_SCHEMA,
      subgraphs: {
        "k-one": { elements: [{ id: "f-a", name: "a.ts" }, { id: "f-b", name: "b.ts" }] },
        "f-a": { elements: [{ id: "s-x", name: "x" }], rels: [{ from: "s-x", to: "f-b" }] },
      },
    };
    const { model, validation } = sanitizeMapModel(doc);
    expect(validation.warnings).toEqual([]);
    expect(model.subgraphs["k-one"]!.rels).toEqual([]);
    expect(model.subgraphs["f-a"]!.rels).toEqual([{ from: "s-x", to: "f-b" }]);
    // Identity: an element or a relationship that needed no change is the document's own object
    expect(model.subgraphs["k-one"]!.elements[0]).toBe(doc.subgraphs["k-one"].elements[0]);
    expect(model.subgraphs["f-a"]!.rels[0]).toBe(doc.subgraphs["f-a"].rels[0]);
    expect(model.level1.elements[0]).toBe(doc.level1.elements[0]);
    // The document is not written to
    expect("rels" in doc.subgraphs["k-one"]).toBe(false);

    const collapsed = collapseModelSubgraphs(model).model;
    for (const sg of Object.values(collapsed.subgraphs)) expect(Array.isArray(sg.rels)).toBe(true);
    expect(buildEveryStage(collapsed, "k-one")).toEqual([1, 2, 3, 4, 5]);
  }, 20_000);

  it("fills the required lists a document left out, and says so once per field", () => {
    const { model, validation } = sanitizeMapModel({
      schema: TUX_MAP_SCHEMA,
      level1: {},
      level2: {},
      level3: {},
      level4: {},
      subgraphs: { a: {}, b: { stratum: "Files" }, c: { elements: [] } },
    });
    expect(validation.valid).toBe(true);
    expect(validation.issues).toEqual([]);
    expect(validation.warnings.map((w) => [w.code, w.path, w.count])).toEqual([
      ["missing-field", "/level1/elements", undefined],
      ["missing-field", "/level1/rels", undefined],
      ["missing-field", "/level2/boundary", undefined],
      ["missing-field", "/level2/elements", undefined],
      ["missing-field", "/level2/rels", undefined],
      ["missing-field", "/level4/groups", undefined],
      ["missing-field", "/level4/nodes", undefined],
      ["missing-field", "/level4/links", undefined],
      ["missing-field", "/subgraphs/a/elements", 2],
    ]);
    expect(model.level1).toEqual({ elements: [], rels: [] });
    expect(model.level2).toEqual({ boundary: "", elements: [], rels: [] });
    expect(model.level3).toEqual({});
    expect(model.level4).toEqual({ groups: [], nodes: [], links: [] });
    expect(model.subgraphs).toEqual({
      a: { elements: [], rels: [] },
      b: { stratum: "Files", elements: [], rels: [] },
      c: { elements: [], rels: [] },
    });
    expect(buildEveryStage(model, "a")).toEqual([1, 2, 3, 4, 5]);
  }, 20_000);

  it("reports a missing level as before, and still normalizes it", () => {
    const { model, validation } = sanitizeMapModel({ schema: TUX_MAP_SCHEMA, level1: { elements: [], rels: [] } });
    expect(validation.valid).toBe(false);
    expect(validation.issues.map((i) => i.code)).toEqual(["missing-level", "missing-level", "missing-level"]);
    // A level that is not there is one issue, not one warning per field of it
    expect(validation.warnings).toEqual([]);
    expect(model.level2).toEqual({ boundary: "", elements: [], rels: [] });
    expect(model.subgraphs).toEqual({});
    expect(buildEveryStage(model)).toEqual([1, 2, 3, 4]);

    expect(sanitizeMapModel(null).model).toBe(EMPTY_TTI_LEVEL_MODEL);
    expect(EMPTY_TTI_LEVEL_MODEL.subgraphs).toEqual({});
    expect(buildEveryStage(EMPTY_TTI_LEVEL_MODEL)).toEqual([1, 2, 3, 4]);
  }, 20_000);

  it("escapes a subgraph key in the path of its warning", () => {
    const warnings = validateMapModel({
      ...minimalDocument(),
      schema: TUX_MAP_SCHEMA,
      subgraphs: { "src/a~b": { stratum: "Files" } },
    }).warnings;
    expect(warnings).toHaveLength(1);
    expect(warnings[0]!.path).toBe("/subgraphs/src~1a~0b/elements");
    expect(warnings[0]!.count).toBeUndefined();
  });

  it("normalizes a subgraph that arrives later the same way, with or without the model before it", () => {
    const raw = { ...minimalDocument(), schema: TUX_MAP_SCHEMA };
    const first = mergeLazyMapSubgraphs(raw, {});
    expect(first.model.subgraphs).toEqual({});
    const lazy = { "k-one": { elements: [{ id: "f-a", name: "a.ts" }] } };
    const stepped = mergeLazyMapSubgraphs(raw, lazy, first);
    expect(stepped.added?.key).toBe("k-one");
    expect(stepped.model.subgraphs["k-one"]!.rels).toEqual([]);
    expect(stepped.model).toEqual(mergeLazyMapSubgraphs(raw, lazy).model);
    expect(buildEveryStage(stepped.model, "k-one")).toEqual([1, 2, 3, 4, 5]);
  }, 20_000);
});
