// @vitest-environment nuxt
/**
 * The Wires filter (#272): each choice draws the wires it names, on Level 2 as on Level 3, says what
 * it draws on hover and when it has nothing on this view, says when the filter leaves no wire at all,
 * and is TUX's toggle-style chip (TuxRemovableChip, `selected`) inside a native toggle button.
 *
 * What was wrong: Level 2 draws the C4 `rels`, and only gated them by category. A test, CI or doc link
 * between two of its cards that no `rel` joins had no wire, so on the docs sample Tests, CI and Docs
 * drew nothing at Level 2 (the sample's CI link, Scheduled Jobs building the workers' image, was never
 * drawn), and nothing said why. With every choice off the canvas went blank without a word.
 */
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";
import type { TuxMapLink, TuxMapWireCategory } from "../packages/diagrams/app/utils/tuxArchitectureMap";

type SetupState = Record<string, any>;

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

// One code link of each kind between Level 2 cards that no `rel` joins, and one of each between two
// components of the Core API at Level 3. The sample's own links: a CI link (Scheduled Jobs builds the
// workers' image) and two prod links into Background Workers, none of them on a `rel`.
const EXTRA: TuxMapLink[] = [
  { from: "c-edge", to: "c-search", kind: "tests" },
  { from: "c-api", to: "c-storage", kind: "checks" },
  { from: "c-edge", to: "c-observability", kind: "mentions" },
  { from: "c-edge", to: "c-workers", kind: "calls" },
  { from: "c-api/0", to: "c-api/2", kind: "tests" },
  { from: "c-api/3", to: "c-api/4", kind: "checks" },
  { from: "c-api/2", to: "c-api/5", kind: "mentions" },
  { from: "c-api/0", to: "c-api/1", kind: "calls" },
];
const model = { ...DEFAULT_TTI_LEVEL_MODEL, links: [...(DEFAULT_TTI_LEVEL_MODEL.links ?? []), ...EXTRA] };

async function mountMap(props: Record<string, unknown> = {}) {
  const wrapper = await mountSuspended(TuxArchitectureMap, { props: { model, initialLevel: 2, ...props } });
  mounted.push(wrapper);
  await nextTick();
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  const chip = (c: TuxMapWireCategory) => wrapper.find(`[data-wire-filter="${c}"]`);
  /** Leaves exactly `on` pressed, by clicking the chips. */
  const only = async (...on: TuxMapWireCategory[]) => {
    for (const c of ["prod", "tests", "ci", "docs"] as const) {
      if ((chip(c).attributes("aria-pressed") === "true") !== on.includes(c)) await chip(c).trigger("click");
    }
    await nextTick();
    await nextTick();
  };
  /** The drawn wires, as "from>to", in the resting layer. */
  const wires = () =>
    new Set(
      wrapper
        .findAll("svg:not(.tux-map__wires-fg) > path.tux-map__wire")
        .map((w) => `${w.attributes("data-from")}>${w.attributes("data-to")}`),
    );
  const note = () => wrapper.find("[data-wires-empty]").text();
  return { wrapper, state, chip, only, wires, note };
}

const relPairs = new Set(DEFAULT_TTI_LEVEL_MODEL.level2.rels.map((r) => `${r.from}>${r.to}`));

describe("TuxArchitectureMap: each Wires choice draws the wires it names (#272)", () => {
  it("Level 2: Prod is the containers' relationships; Tests, CI and Docs draw their own links", async () => {
    const { only, wires, note } = await mountMap();

    await only("prod");
    const prod = wires();
    expect(prod.size).toBeGreaterThan(10);
    for (const w of prod) expect(relPairs.has(w), w).toBe(true);
    // a prod code link with no relationship is not a Level 2 wire: Prod there is the C4 view
    expect(prod.has("c-edge>c-workers")).toBe(false);
    expect(note()).toBe("");

    await only("tests");
    expect([...wires()]).toEqual(["c-edge>c-search"]);
    await only("ci");
    // the sample's own CI link, and the one added here
    expect(wires()).toEqual(new Set(["c-scheduler>c-workers", "c-api>c-storage"]));
    await only("docs");
    expect([...wires()]).toEqual(["c-edge>c-observability"]);

    await only("prod", "ci");
    expect(wires()).toEqual(new Set([...prod, "c-scheduler>c-workers", "c-api>c-storage"]));
  });

  it("Level 3: each choice draws the inner wires of its kind", async () => {
    const { only, wires } = await mountMap({ initialLevel: 3, initialFocus: "c-api" });
    await only("tests");
    expect(wires().has("c-api/0>c-api/2")).toBe(true);
    expect(wires().has("c-api/3>c-api/4")).toBe(false);
    await only("ci");
    expect(wires().has("c-api/3>c-api/4")).toBe(true);
    expect(wires().has("c-api/0>c-api/2")).toBe(false);
    await only("docs");
    expect(wires().has("c-api/2>c-api/5")).toBe(true);
    await only("prod");
    expect(wires().has("c-api/0>c-api/1")).toBe(true);
    expect(wires().has("c-api/0>c-api/2")).toBe(false);
    expect(wires().has("c-api/2>c-api/5")).toBe(false);
  });

  it("says when the filter leaves no wire: every choice off, or none of the chosen kinds here", async () => {
    const { only, wires, note, chip, state } = await mountMap();
    await only();
    expect(wires().size).toBe(0);
    expect(note()).toBe("No wires drawn: every kind of wire is off. Turn on Prod, Tests, CI or Docs to see them.");
    // the sample alone has no test or doc links: those choices say so on hover, and the note says why
    const plain = await mountMap({ model: DEFAULT_TTI_LEVEL_MODEL });
    await plain.only("tests", "docs");
    expect(plain.wires().size).toBe(0);
    expect(plain.note()).toBe("No wires drawn: this view has no test or doc wires.");
    expect(plain.chip("tests").attributes("title")).toMatch(/None on this view\.$/);
    expect(plain.chip("tests").classes()).toContain("tux-map__wire-chip--none-here");
    expect(plain.chip("ci").attributes("title")).not.toMatch(/None on this view/);
    expect(plain.wrapper.find("[data-wires-empty]").attributes("role")).toBe("status");
    // the choices hold across levels and are emitted in their order
    expect(state.localWireFilters).toEqual([]);
    await chip("docs").trigger("click");
    await chip("prod").trigger("click");
    expect(state.localWireFilters).toEqual(["prod", "docs"]);
  });
});

describe("TuxArchitectureMap: the Wires control is TUX's toggle chip (#272)", () => {
  it("is a labelled group of native toggle buttons, each a TuxRemovableChip that is selected when on, with what it shows on hover", async () => {
    const { wrapper, chip } = await mountMap();
    const group = wrapper.find(".tux-map__wire-chips");
    expect(group.attributes("role")).toBe("group");
    const label = wrapper.find(`#${group.attributes("aria-labelledby")}`);
    expect(label.text()).toBe("Wires");
    const buttons = group.findAll("button");
    expect(buttons.map((b) => b.text())).toEqual(["Prod", "Tests", "CI", "Docs"]);
    for (const b of buttons) {
      expect(b.attributes("type")).toBe("button");
      expect(b.attributes("aria-pressed")).toMatch(/^(true|false)$/);
      expect(b.attributes("title")!.length).toBeGreaterThan(20);
      // the TUX chip draws it: filled and checked when on
      const c = b.find(".tux-removable-chip");
      expect(c.exists()).toBe(true);
      const on = b.attributes("aria-pressed") === "true";
      expect(c.classes().includes("tux-removable-chip--selected")).toBe(on);
      expect(c.find(".tux-removable-chip__icon").exists()).toBe(on);
    }
    expect(chip("prod").attributes("title")).toMatch(/^Production wires/);
    expect(chip("tests").attributes("title")).toMatch(/^Test wires/);
    expect(chip("ci").attributes("title")).toMatch(/^CI wires/);
    expect(chip("docs").attributes("title")).toMatch(/^Doc wires/);
    await chip("tests").trigger("click");
    expect(chip("tests").attributes("aria-pressed")).toBe("true");
    expect(chip("tests").find(".tux-removable-chip").classes()).toContain("tux-removable-chip--selected");
  });

  it("is not drawn at Levels 1 and 4, which have no filter", async () => {
    for (const initialLevel of [1, 4]) {
      const { wrapper, note } = await mountMap({ initialLevel });
      expect(wrapper.find(".tux-map__wire-chips").exists()).toBe(false);
      expect(note()).toBe("");
    }
  });
});
