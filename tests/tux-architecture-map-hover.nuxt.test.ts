// @vitest-environment nuxt
/**
 * Hovering a card on a code level (5 or 6) opens the outside cards that touch
 * it into one wire per inner card. That must cost the opened wires and nothing
 * else: the wires of the stage at rest are routed once per stage, and the
 * stage's DOM index is built once per card set (#154).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import * as mapUtils from "../packages/diagrams/app/utils/tuxArchitectureMap";
import type { TuxMapLevelModel, TuxMapLevelRel } from "../packages/diagrams/app/utils/tuxArchitectureMap";

vi.mock("../packages/diagrams/app/utils/tuxArchitectureMap", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../packages/diagrams/app/utils/tuxArchitectureMap")>();
  return { ...actual, routeGridWires: vi.fn(actual.routeGridWires) };
});

const routeSpy = vi.mocked(mapUtils.routeGridWires);

/**
 * One component of three files, focused at Level 5. Outside it, `a.py` calls
 * two of the files and one of the files calls `c.py`; inside, b1 calls b3.
 */
const model = {
  level1: { title: "x", elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1] }], rels: [] },
  level2: {
    title: "c",
    boundary: "sys",
    elements: [{ id: "c-gw", kind: "container", name: "GW", at: [1, 1] }],
    rels: [],
  },
  level3: {
    "c-gw": [
      { id: "comp-a", kind: "component", name: "A", at: [1, 1] },
      { id: "comp-b", kind: "component", name: "B", at: [3, 1] },
      { id: "comp-c", kind: "component", name: "C", at: [5, 1] },
    ],
  },
  level4: { groups: [], nodes: [], links: [] },
  subgraphs: {
    "comp-a": { stratum: "Files", elements: [{ id: "f:a.py", kind: "module", name: "a.py", at: [1, 1] }] },
    "comp-b": {
      stratum: "Files",
      elements: [
        { id: "f:b1.py", kind: "module", name: "b1.py", at: [1, 1] },
        { id: "f:b2.py", kind: "module", name: "b2.py", at: [2, 1] },
        { id: "f:b3.py", kind: "module", name: "b3.py", at: [3, 1] },
      ],
    },
    "comp-c": { stratum: "Files", elements: [{ id: "f:c.py", kind: "module", name: "c.py", at: [1, 1] }] },
  },
  links: [
    { from: "f:a.py", to: "f:b1.py", kind: "calls" },
    { from: "f:a.py", to: "f:b2.py", kind: "calls" },
    { from: "f:b1.py", to: "f:b3.py", kind: "calls" },
    { from: "f:b2.py", to: "f:c.py", kind: "calls" },
  ],
} as unknown as TuxMapLevelModel;

type SetupState = Record<string, any>;
type Wire = { id: string; from: string; to: string; d: string };

const pair = (w: { from: string; to: string }) => `${w.from} -> ${w.to}`;
const pairs = (ws: { from: string; to: string }[]) => ws.map(pair).sort();

describe("TuxArchitectureMap: hover on a code level (#154)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
  });

  async function mountStage() {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 5, initialFocus: "comp-b" },
    });
    mounted.push(wrapper);
    await nextTick();
    await nextTick();
    const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
    const stage = wrapper.find(".tux-map__stage").element as HTMLElement;
    const card = (id: string) => wrapper.find(`.tux-map__el[data-id="${id}"]`).element as HTMLElement;
    const hover = async (el: HTMLElement) => {
      el.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
      await nextTick();
      await nextTick();
    };
    /** Wires a reader can see: drawn, and not hidden while their outside card is open. */
    const drawn = (selector: string) =>
      [...stage.querySelectorAll<SVGElement>(selector)]
        .filter((el) => !/--closed\b/.test(el.getAttribute("class") || ""))
        .map((el) => ({ from: el.dataset.from || "", to: el.dataset.to || "", el }));
    return { wrapper, state, stage, card, hover, drawn };
  }

  it("draws at rest one wire per outside card, and the inner wires", async () => {
    const { state, drawn } = await mountStage();
    expect(state.stageData.codeEdgeHoverIds.has("f:b1.py")).toBe(true);
    const rest = ["@bound -> f:c.py", "f:a.py -> @bound", "f:b1.py -> f:b3.py"];
    expect(pairs(state.routedSvg.wires)).toEqual(rest);
    expect(pairs(drawn(".tux-map__wire"))).toEqual(rest);
  });

  it("routes only the opened wires on hover, and never the stage's wires again", async () => {
    const { state, stage, card, hover } = await mountStage();
    const stageBefore = state.stageData;
    const restWires: Wire[] = state.routedSvg.wires.map((w: Wire) => ({ ...w }));
    const restRels: TuxMapLevelRel[] = [...state.stageData.rels];
    routeSpy.mockClear();

    await hover(card("f:b1.py"));
    expect(state.hoveredStageCardId).toBe("f:b1.py");
    expect(state.stageData).toBe(stageBefore);

    // a.py touches b1, so its one wire opens into two; c.py does not, and stays closed
    expect(pairs(state.routedSvg.wires)).toEqual([
      "@bound -> f:c.py",
      "f:a.py -> f:b1.py",
      "f:a.py -> f:b2.py",
      "f:b1.py -> f:b3.py",
    ]);

    // One routing call at most, and only for the wires the hover opened
    expect(routeSpy.mock.calls.length).toBeLessThanOrEqual(1);
    for (const [rels] of routeSpy.mock.calls) {
      expect(pairs(rels)).toEqual(["f:a.py -> f:b1.py", "f:a.py -> f:b2.py"]);
      for (const r of rels) expect(restRels).not.toContain(r);
    }

    // The wires that stayed did not move and kept their ids
    for (const before of restWires) {
      if (before.from === "f:a.py") continue;
      const after = state.routedSvg.wires.find((w: Wire) => w.id === before.id);
      expect(after, `wire ${before.id} is still routed`).toBeTruthy();
      expect(after.d).toBe(before.d);
    }

    // Leaving, and hovering the same card again, routes nothing at all
    routeSpy.mockClear();
    await hover(stage);
    expect(state.hoveredStageCardId).toBe(null);
    expect(pairs(state.routedSvg.wires)).toEqual(pairs(restWires));
    await hover(card("f:b1.py"));
    expect(pairs(state.routedSvg.wires)).toHaveLength(4);
    await hover(card("f:b3.py"));
    expect(pairs(state.routedSvg.wires)).toEqual(pairs(restWires));
    expect(routeSpy).not.toHaveBeenCalled();
  });

  it("does not index the stage's DOM again on hover", async () => {
    const { stage, card, hover } = await mountStage();
    // The stage is indexed once, by the first highlight. From there on, any query over the whole stage is a rebuild.
    await hover(card("f:b3.py"));
    await hover(stage);
    const queryAll = vi.spyOn(stage, "querySelectorAll");
    const query = vi.spyOn(stage, "querySelector");
    const cardEls = [...stage.children].filter((el) => el.classList.contains("tux-map__el"));

    await hover(card("f:b1.py"));
    await hover(stage);
    await hover(card("f:b2.py"));
    await hover(card("f:a.py"));
    await hover(stage);

    expect(queryAll).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
    // The same card elements, in the same order
    expect([...stage.children].filter((el) => el.classList.contains("tux-map__el"))).toEqual(cardEls);
  });

  it("lights the opened wires, their labels and the cards they reach, and puts the stage back on leave", async () => {
    const { stage, card, hover, drawn } = await mountStage();
    const litCards = () =>
      [...stage.querySelectorAll<HTMLElement>(".tux-map__el--lit")].map((el) => el.dataset.id).sort();
    const litWires = () =>
      pairs(drawn(".tux-map__wire-fg--on:not(.tux-map__wire-fg--stream)"));
    const shownLabels = () => pairs(drawn(".tux-map__lab"));
    const restLabels = shownLabels();
    // At rest nothing is dimmed: every card carries the lit class
    const restLit = litCards();
    expect(restLit).toEqual(["f:a.py", "f:b1.py", "f:b2.py", "f:b3.py", "f:c.py"]);
    const restDrawn = pairs(drawn(".tux-map__wire"));

    // An inner card: its own wire, and the wire from the outside card that reaches it
    await hover(card("f:b1.py"));
    expect(pairs(drawn(".tux-map__wire"))).toEqual([
      "@bound -> f:c.py",
      "f:a.py -> f:b1.py",
      "f:a.py -> f:b2.py",
      "f:b1.py -> f:b3.py",
    ]);
    expect(pairs(drawn(".tux-map__wire-fg:not(.tux-map__wire-fg--stream)"))).toEqual(pairs(drawn(".tux-map__wire")));
    expect(litWires()).toEqual(["f:a.py -> f:b1.py", "f:b1.py -> f:b3.py"]);
    expect(litCards()).toEqual(["f:a.py", "f:b1.py", "f:b3.py"]);
    expect(pairs(drawn(".tux-map__lab--on"))).toEqual(["f:a.py -> f:b1.py", "f:b1.py -> f:b3.py"]);
    expect(shownLabels()).not.toContain("f:a.py -> @bound");
    expect(stage.classList.contains("tux-map__stage--dim")).toBe(true);

    // The outside card itself: both of its wires, and no longer the boundary's cards as a whole
    await hover(card("f:a.py"));
    expect(litWires()).toEqual(["f:a.py -> f:b1.py", "f:a.py -> f:b2.py"]);
    expect(litCards()).toEqual(["f:a.py", "f:b1.py", "f:b2.py"]);

    // A card with nothing to open, straight from an open one
    await hover(card("f:b3.py"));
    expect(pairs(drawn(".tux-map__wire"))).toEqual(restDrawn);
    expect(litWires()).toEqual(["f:b1.py -> f:b3.py"]);
    expect(litCards()).toEqual(["f:b1.py", "f:b3.py"]);

    // The outgoing side
    await hover(card("f:c.py"));
    expect(litWires()).toEqual(["f:b2.py -> f:c.py"]);
    expect(litCards()).toEqual(["f:b2.py", "f:c.py"]);
    expect(pairs(drawn(".tux-map__wire"))).toEqual(["f:a.py -> @bound", "f:b1.py -> f:b3.py", "f:b2.py -> f:c.py"]);

    await hover(stage);
    expect(pairs(drawn(".tux-map__wire"))).toEqual(restDrawn);
    expect(shownLabels()).toEqual(restLabels);
    expect(litWires()).toEqual([]);
    expect(litCards()).toEqual(restLit);
    expect(stage.classList.contains("tux-map__stage--dim")).toBe(false);
  });

  it("opens the same wires for a selection, and closes them when it clears", async () => {
    const { state, drawn } = await mountStage();
    routeSpy.mockClear();
    state.selectElement("f:b2.py");
    await nextTick();
    await nextTick();
    const open = ["f:a.py -> f:b1.py", "f:a.py -> f:b2.py", "f:b1.py -> f:b3.py", "f:b2.py -> f:c.py"];
    expect(pairs(state.routedSvg.wires)).toEqual(open);
    expect(pairs(drawn(".tux-map__wire"))).toEqual(open);
    expect(pairs(drawn(".tux-map__wire-fg--on:not(.tux-map__wire-fg--stream)"))).toEqual([
      "f:a.py -> f:b2.py",
      "f:b2.py -> f:c.py",
    ]);
    for (const [rels] of routeSpy.mock.calls) expect(rels.every((r) => r.from !== "@bound" && r.to !== "@bound")).toBe(true);

    state.selectElement(null);
    await nextTick();
    await nextTick();
    expect(pairs(drawn(".tux-map__wire"))).toEqual(["@bound -> f:c.py", "f:a.py -> @bound", "f:b1.py -> f:b3.py"]);
  });
});
