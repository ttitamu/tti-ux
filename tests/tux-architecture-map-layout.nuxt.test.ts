// @vitest-environment nuxt
/**
 * Layout faults of the mounted map (#205): the list view's details with the
 * outline open, a toolbar that re-flowed by level and view, clipped card text,
 * faded wires and labels, the magnify steps, dragging the background, the
 * level-change pill, the blast-radius key, planned links and the More menu.
 *
 * The test DOM does no layout. What is logic is tested mounted: the order of
 * the controls, the labels, the handlers, the classes. What is a rule of the
 * stylesheet is read from its source, as the reduced-motion test does; the
 * pixels were measured in a browser at 1504, 1272 and 792 px.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";

type SetupState = Record<string, any>;

const SFC = readFileSync(
  join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"),
  "utf8",
);
const STYLE = SFC.slice(SFC.lastIndexOf("<style")).replace(/\/\*[\s\S]*?\*\//g, "");

/** The braces-balanced block that opens after `at`. */
function blockAt(css: string, at: number): string {
  const open = css.indexOf("{", at);
  for (let i = open, depth = 0; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  return "";
}

/** The declarations of every rule whose selector list has exactly `selector`, in source order. */
function declarations(selector: string, css = STYLE): string[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1]!.split(",").some((s) => s.trim().replace(/\s+/g, " ") === selector))
    .map((m) => m[2]!);
}

/** Every `@container tux-map (max-width: <px>)` block, joined. */
function containerBlocks(px: number): string {
  const head = `@container tux-map (max-width: ${px}px)`;
  let out = "";
  for (let at = STYLE.indexOf(head); at !== -1; at = STYLE.indexOf(head, at + 1)) out += blockAt(STYLE, at);
  return out;
}

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountMap(props: Record<string, unknown>, attach = false) {
  const wrapper = await mountSuspended(TuxArchitectureMap, {
    props: { model: DEFAULT_TTI_LEVEL_MODEL, ...props },
    ...(attach ? { attachTo: document.body } : {}),
  });
  mounted.push(wrapper);
  await nextTick();
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  return { wrapper, state };
}

describe("TuxArchitectureMap: the toolbar keeps its order at every level and in both views (#205)", () => {
  /** The toolbar's controls in document order, each named by its first class or its label. */
  function toolbarOrder(root: Element): string[] {
    const name = (el: Element) => el.getAttribute("aria-label") || el.classList[0] || el.tagName;
    const tools = root.querySelector(".tux-map__tools")!;
    return [...tools.children].flatMap((el) =>
      el.classList.contains("tux-map__tools-end")
        ? [...el.children].flatMap((inner) =>
            inner.classList.contains("tux-map__tools-pair") ? [...inner.children].map(name) : [name(inner)],
          )
        : [name(el)],
    );
  }

  const views: [string, Record<string, unknown>][] = [
    ["Level 1", { initialLevel: 1 }],
    ["Level 2", { initialLevel: 2 }],
    ["Level 3", { initialLevel: 3, initialFocus: "c-api" }],
    ["Level 4", { initialLevel: 4 }],
    ["Level 5", { initialLevel: 5, initialFocus: "c-api/1" }],
    ["Level 2, list", { initialLevel: 2, initialView: "list" }],
    ["Level 5, list", { initialLevel: 5, initialFocus: "c-api/1", initialView: "list" }],
  ];

  it("has the same controls in the same order, the magnify group last of the leading ones", async () => {
    const orders: string[][] = [];
    for (const [, props] of views) {
      const { wrapper } = await mountMap(props);
      // the list view has no magnify group: its place is held, empty
      orders.push(toolbarOrder(wrapper.element).map((n) => (n === "tux-map__magnify-gap" ? "Magnify the diagram" : n)));
    }
    expect(orders[0]).toEqual([
      "Semantic zoom level",
      "Wayfinding outline",
      "Topology perspective",
      "tux-map__more-wrap",
      "Magnify the diagram",
      "tux-map__goto-btn",
      "tux-map__search-wrap",
      "Display mode",
      "Keyboard shortcuts (?)",
    ]);
    for (const [i, [label]] of views.entries()) expect(orders[i], label).toEqual(orders[0]);
  });

  it("holds the magnify group's place in the list view, hidden from everyone", async () => {
    const { wrapper } = await mountMap({ initialLevel: 2, initialView: "list" });
    expect(wrapper.find(".tux-map__magnify").exists()).toBe(false);
    const gap = wrapper.find(".tux-map__magnify-gap");
    expect(gap.exists()).toBe(true);
    expect(gap.attributes("aria-hidden")).toBe("true");
    const rule = declarations(".tux-map__magnify-gap").join(";");
    expect(rule).toMatch(/visibility:\s*hidden/);
    // two icon buttons, the Fit button's min-width and the group's border
    expect(rule).toMatch(/width:\s*calc\(var\(--tux-map-target\) \* 2 \+ 3\.4rem \+ 2px\)/);
    expect(declarations(".tux-map__magnify-fit").join(";")).toMatch(/min-width:\s*3\.4rem/);
  });

  it("wraps the trailing controls as one group, and never `?` alone", () => {
    const end = declarations(".tux-map__tools-end")[0] ?? "";
    expect(end).toMatch(/flex-wrap:\s*nowrap/);
    expect(end).toMatch(/margin-left:\s*auto/);
    expect(declarations(".tux-map__tools-pair")[0] ?? "").toMatch(/flex-wrap:\s*nowrap/);
    // a narrow map may break the group, but only between the filter and the Diagram/List pair
    expect(declarations(".tux-map__tools-end", containerBlocks(620)).join(";")).toMatch(/flex-wrap:\s*wrap/);
    expect(declarations(".tux-map__tools-pair", containerBlocks(620))).toEqual([]);
  });

  it("gives the level's name one width, so the stepper is as wide at every level", async () => {
    const name = declarations(".tux-map__stepper-name").join(";");
    expect(name).toMatch(/(?:^|[;\s])width:\s*8rem/);
    expect(name).not.toMatch(/max-width/);
    expect(name).toMatch(/text-overflow:\s*ellipsis/);
    // a name the width cuts is still there in full
    const { wrapper } = await mountMap({ initialLevel: 3, initialFocus: "c-api" });
    const el = wrapper.find(".tux-map__stepper-name");
    expect(el.attributes("title")).toBe(el.text());
  });
});

describe("TuxArchitectureMap: the list view's details with the outline open (#205)", () => {
  it("places the details in the list's column, not the outline's", () => {
    const both = declarations(".tux-map__canvas--list.tux-map__canvas--with-outline .tux-map__panel");
    expect(both[0]).toMatch(/grid-column:\s*2/);
    // one column on a narrow map: the details span it
    expect(
      declarations(".tux-map__canvas--list.tux-map__canvas--with-outline .tux-map__panel", containerBlocks(760)).join(";"),
    ).toMatch(/grid-column:\s*1 \/ -1/);
  });

  it("places the close button against the panel wherever the panel is in the flow", () => {
    // `static` left the button placed against the canvas, over the first row of the list
    const inFlow = [
      ...declarations(".tux-map__canvas--list .tux-map__panel"),
      ...declarations(".tux-map__canvas--with-outline .tux-map__panel", containerBlocks(920)),
      ...declarations(".tux-map__panel", containerBlocks(640)),
    ];
    expect(inFlow).toHaveLength(3);
    for (const rule of inFlow) {
      expect(rule).toMatch(/position:\s*relative/);
      // and the offsets of the overlay do not shift it
      expect(rule).toMatch(/inset:\s*auto/);
    }
    expect(STYLE).not.toMatch(/tux-map__panel[^{}]*\{[^{}]*position:\s*static/);
    expect(declarations(".tux-map__panel-close")[0]).toMatch(/position:\s*absolute/);
  });

  it("wraps a path with no space in it inside the panel", () => {
    expect(declarations(".tux-map__panel")[0]).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it("still treats an in-flow panel as following the map: a selection does not slide the stage under it", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 2 }, true);
    const panel = wrapper.find(".tux-map__panel").element as HTMLElement;
    for (const [position, follows] of [["relative", true], ["static", true], ["absolute", false]] as const) {
      panel.style.position = position;
      expect(state.panelFollowsMap(), position).toBe(follows);
    }
  });
});
