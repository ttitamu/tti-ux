// @vitest-environment nuxt
/**
 * A card's type line does not repeat its kind (#231), on the card, in its accessible name and in
 * the list view: all three come from `elementTypeLabel()`. A folder whose producer wrote
 * `tech: "folder · 4 files"` read "folder · folder · 4 files".
 */
import { afterEach, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import type { TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";

const model = {
  level1: { title: "x", elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1] }], rels: [] },
  level2: {
    title: "c",
    boundary: "sys",
    elements: [
      { id: "c-a", kind: "container", name: "A", tech: "Go · REST", at: [1, 1] },
      { id: "c-b", kind: "container", name: "B", at: [3, 1] },
    ],
    rels: [{ from: "c-a", to: "c-b", label: "calls" }],
  },
  level3: {
    "c-a": [
      { id: "c-a:d:src", kind: "folder", name: "src/", tech: "folder · 4 files", at: [1, 1] },
      { id: "c-a:d:lib", kind: "folder", name: "lib/", tech: "Folder: 2 files", at: [2, 1] },
    ],
  },
  level4: { groups: [], nodes: [], links: [] },
} as unknown as TuxMapLevelModel;

describe("TuxArchitectureMap: a card's type line does not repeat its kind (#231)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
  });

  it("on the card and in its accessible name", async () => {
    const w = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 3, initialFocus: "c-a", minimap: false },
    });
    mounted.push(w);
    const card = (id: string) => w.find(`.tux-map__el[data-id="${id}"]`);
    expect(card("c-a:d:src").find(".tux-map__el-ty").text()).toBe("folder · 4 files");
    expect(card("c-a:d:lib").find(".tux-map__el-ty").text()).toBe("folder · 2 files");
    for (const id of ["c-a:d:src", "c-a:d:lib"]) {
      const name = card(id).attributes("aria-label") ?? "";
      expect(name).toMatch(/folder · \d files/);
      expect(name.toLowerCase()).not.toMatch(/folder\W+folder/);
    }
  });

  it("in the list view", async () => {
    const w = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 3, initialFocus: "c-a", initialView: "list", minimap: false },
    });
    mounted.push(w);
    const lines = w.findAll(".tux-map__el-ty").map((t) => t.text());
    expect(lines).toContain("[folder · 4 files]");
    expect(lines).toContain("[folder · 2 files]");
    expect(lines.join(" ").toLowerCase()).not.toMatch(/folder\W+folder/);
  });
});
