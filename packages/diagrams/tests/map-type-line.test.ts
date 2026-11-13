/**
 * A card's type line does not repeat its kind (#231). A producer writes `tech: "folder · 4 files"`
 * on a folder, and the card read "folder · folder · 4 files". The kind and `tech` are joined by one
 * helper, `elementTypeLabel()`, on the card, in the list view, at a boundary and in the card's
 * accessible name.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  collapseModelSubgraphs,
  elementTypeLabel,
  levelForFocus,
  sanitizeMapModel,
  type TuxMapLevelElement,
} from "../app/utils/tuxArchitectureMap";
import { buildStageBase } from "../app/utils/internal/tuxArchitectureMapStage";
import { stageContext } from "./support/mapStages";

const PRODUCER = JSON.parse(readFileSync(join(import.meta.dirname, "fixtures", "map-real-producer.json"), "utf8"));
const FOLDER_ID = "tti/tti-ux:d:charts";

function producerElement(id: string): TuxMapLevelElement {
  for (const sg of Object.values(PRODUCER.subgraphs) as { elements: TuxMapLevelElement[] }[]) {
    const el = sg.elements.find((e) => e.id === id);
    if (el) return el;
  }
  throw new Error(`no ${id} in the fixture`);
}

describe("elementTypeLabel (#231)", () => {
  it("reads the producer fixture's folder card as folder · 4 files", () => {
    const folder = producerElement(FOLDER_ID);
    // what the producer wrote, and the kind the map names it by
    expect(folder.tech).toBe("folder · 4 files");
    expect(elementTypeLabel(folder)).toBe("folder · 4 files");
  });

  it("joins the kind and a tech that does not start with it", () => {
    expect(elementTypeLabel({ id: "c", kind: "container", name: "API", tech: "Go · REST" })).toBe("Container · Go · REST");
    expect(elementTypeLabel({ id: "c", kind: "component", name: "x", tech: "TypeScript · 8 files" })).toBe(
      "Component · TypeScript · 8 files",
    );
    // no tech: the kind alone
    expect(elementTypeLabel({ id: "c", kind: "container", name: "API" })).toBe("Container");
    expect(elementTypeLabel({ id: "c", kind: "container", name: "API", tech: "   " })).toBe("Container");
    // a kind label with a separator of its own
    expect(elementTypeLabel({ id: "c", kind: "database", name: "DB", tech: "Container: database · PostgreSQL" })).toBe(
      "Container: database · PostgreSQL",
    );
  });

  it("drops a leading kind word whatever its case and separator, and only a whole word", () => {
    const folder = (tech: string) => elementTypeLabel({ id: "x", kind: "folder", name: "src/", tech });
    expect(folder("Folder: 12 files")).toBe("folder · 12 files");
    expect(folder("folder - 2 files")).toBe("folder · 2 files");
    expect(folder("folder 3 files")).toBe("folder · 3 files");
    expect(folder("folder")).toBe("folder");
    expect(folder("FOLDER · ")).toBe("folder");
    // a longer word that starts with the kind is not the kind
    expect(folder("folders of tests")).toBe("folder · folders of tests");
    expect(folder("foldered")).toBe("folder · foldered");
    // the kind later in the text is the producer's
    expect(folder("4 files · folder")).toBe("folder · 4 files · folder");
    // a kind label of two words
    expect(elementTypeLabel({ id: "r", kind: "route", name: "GET /x", tech: "HTTP route · GET" })).toBe("HTTP route · GET");
  });

  it("takes a separator of the caller's", () => {
    expect(elementTypeLabel({ id: "x", kind: "folder", name: "src/", tech: "folder · 4 files" }, { separator: ": " })).toBe(
      "folder: 4 files",
    );
  });

  it("names a boundary with no stratum the same way", () => {
    // the producer's subgraphs carry a stratum, which names their boundary; without one the
    // boundary is named by its card's kind and tech
    const raw = structuredClone(PRODUCER);
    const model = collapseModelSubgraphs(sanitizeMapModel(raw).model).model;
    const sgId = Object.keys(model.subgraphs).find((id) => id === FOLDER_ID || id.endsWith(":d:desk"))!;
    expect(sgId).toBeTruthy();
    const sg = { ...model.subgraphs[sgId]!, stratum: undefined };
    const ctx = stageContext(model);
    const parent = ctx.lookup[sgId]!;
    expect(parent.tech).toMatch(/^folder · \d+ files$/);
    const base = buildStageBase(ctx, levelForFocus(sgId, model, ctx.parentOf), sgId, sg) as { boundaryType: string };
    expect(base.boundaryType).toBe(`folder: ${parent.tech!.replace(/^folder · /, "")}`);
  });
});
