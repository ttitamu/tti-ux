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

describe("TuxArchitectureMap: a card shows whole rows (#205)", () => {
  it("clamps each description to the whole lines its card has room for", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 3, initialFocus: "c-api" });
    const cards = state.renderedCards as { id: string; mini: boolean; desc?: string; descLines: number }[];
    const inner = cards.filter((c) => !c.mini && c.desc);
    expect(inner.length).toBeGreaterThan(3);
    for (const c of inner) {
      const ds = wrapper.find(`.tux-map__el[data-id="${c.id}"] .tux-map__el-ds`);
      expect(ds.attributes("data-lines"), c.id).toBe(String(c.descLines));
    }
    // a title is one line however long (#258): a long one leaves the description the lines a short one does
    const lines = (name: string) =>
      (state.renderedCards as { fullName: string; descLines: number }[]).find((c) => c.fullName === name)!.descLines;
    expect(lines("Webhook & Event Dispatcher")).toBe(lines("Audit Log Writer"));
    expect(declarations('.tux-map__el-ds[data-lines="1"]')[0]).toMatch(/-webkit-line-clamp:\s*1/);
    expect(declarations('.tux-map__el-ds[data-lines="0"]')[0]).toMatch(/display:\s*none/);
    // hovered or chosen, the description stays clamped: an unclamped one grew the card past its ring (#257)
    expect(declarations(".tux-map__el:hover .tux-map__el-ds")).toEqual([]);
    expect(declarations('.tux-map__el[aria-pressed="true"] .tux-map__el-ds')).toEqual([]);
  });

  it("keeps the rows that are one line whole: they do not shrink with the description", () => {
    for (const row of ["nm", "own", "ty", "runs", "ft"]) {
      expect(declarations(`.tux-map__el-${row}`).join(";"), row).toMatch(/flex:\s*none/);
    }
  });

  it("shows one row of chips, and hides a chip that does not fit whole", () => {
    const ft = declarations(".tux-map__el-ft")[0]!;
    expect(ft).toMatch(/flex-wrap:\s*wrap/);
    expect(ft).toMatch(/max-height:\s*1\.2rem/);
    expect(ft).toMatch(/overflow:\s*hidden/);
    // and still one row hovered or chosen (#257)
    expect(declarations(".tux-map__el:hover .tux-map__el-ft")).toEqual([]);
  });

  it("keeps a path title on one line, cut at its end, the whole path in its tooltip (#258)", async () => {
    const nm = declarations(".tux-map__el-nm > span").join(";");
    expect(nm).toMatch(/white-space:\s*nowrap/);
    expect(nm).toMatch(/text-overflow:\s*ellipsis/);
    expect(nm).not.toMatch(/line-clamp/);
    const model = {
      ...DEFAULT_TTI_LEVEL_MODEL,
      level3: {
        ...DEFAULT_TTI_LEVEL_MODEL.level3,
        "c-api": [
          { id: "c-api/x", kind: "file", name: "services/api/internal/router.go" },
          { id: "c-api/y", name: "Plain name" },
        ],
      },
    };
    const { wrapper } = await mountMap({ model, initialLevel: 3, initialFocus: "c-api" });
    const title = (id: string) => wrapper.find(`.tux-map__el[data-id="${id}"] .tux-map__el-nm > span:last-child`);
    expect(title("c-api/x").text()).toContain("/");
    expect(title("c-api/x").attributes("title")).toBe("services/api/internal/router.go");
    expect(title("c-api/x").element.querySelectorAll("wbr").length).toBe(0);
    expect(title("c-api/y").text()).toBe("Plain name");
    expect(title("c-api/y").attributes("title")).toBe("Plain name");
  });
});

describe("TuxArchitectureMap: wires and labels the highlight does not reach stay legible (#205)", () => {
  const REST = ':not(.tux-map__lab--on):not(:hover):not(:focus-visible):not([aria-expanded="true"])';

  it("steps a label back by its surface and its text colour, not by fading it", () => {
    const box = declarations(`.tux-map__stage--dim .tux-map__lab${REST}`).join(";");
    // opacity took the text to 1.3:1 on the canvas; the tokens hold 7:1 (measured in the four themes)
    expect(box).not.toMatch(/opacity/);
    expect(box).toMatch(/background:\s*var\(--surface-sunken\)/);
    // the first line has no colour of its own: it takes the label's
    expect(box).toMatch(/(?:^|[;\s])color:\s*var\(--text-secondary\)/);
    expect(declarations(".tux-map__lab-t1").join(";")).not.toMatch(/color:/);
    expect(declarations(".tux-map__lab")[0]).toMatch(/(?:^|[;\s])color:\s*var\(--text-primary\)/);
    // a crowded label is still hidden until its wire is lit
    expect(declarations(`.tux-map__stage--dim .tux-map__lab--forced${REST}`).join(";")).toMatch(/opacity:\s*0\b/);
  });

  it("keeps a wire the highlight does not reach at 3:1 or more against the canvas", () => {
    const opacity = /opacity:\s*([\d.]+)/.exec(declarations(".tux-map__wires--has-on .tux-map__wire").join(";"))?.[1];
    // --text-secondary over the canvas: 3.09:1 at 0.6 in the light theme, the lowest of the four
    expect(Number(opacity)).toBeGreaterThanOrEqual(0.6);
    expect(Number(opacity)).toBeLessThan(Number(/opacity:\s*([\d.]+)/.exec(declarations(".tux-map__wire")[0]!)![1]));
  });
});

describe("TuxArchitectureMap: magnify says how much larger than Fit (#205)", () => {
  it("labels each step against the fitted size, so the first step up reads more than 100%", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 2 });
    // a narrow viewport: the diagram fits at well under its real size, and the first step is 0.5 or 0.75
    state.viewportWidth = 700;
    await nextTick();
    const fit = state.fitScale as number;
    expect(fit).toBeLessThan(0.75);
    const label = () => wrapper.find(".tux-map__magnify-fit").text();
    expect(label()).toBe("Fit");
    const seen: number[] = [];
    while (!(wrapper.find('[aria-label="Make the diagram larger"]').element as HTMLButtonElement).disabled) {
      await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
      await nextTick();
      expect(label()).toBe(`${Math.round(((state.stageScale as number) / fit) * 100)}%`);
      seen.push(Number.parseInt(label(), 10));
    }
    expect(seen.length).toBeGreaterThanOrEqual(3);
    expect(seen[0]).toBeGreaterThan(100);
    expect([...seen].sort((a, b) => a - b)).toEqual(seen);
    // the scale itself still tops out at twice the real size
    expect(state.stageScale).toBe(2);
    expect(wrapper.find(".tux-map__magnify-fit").attributes("aria-label")).toContain(`${seen.at(-1)}% of the fitted size`);
    expect(state.liveAnnouncement).toContain(`${seen.at(-1)}% of the fitted size`);
  });

  it("does not scroll down a magnified viewport that is as tall as the diagram", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 2 }, true);
    await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await nextTick();
    const vp = wrapper.find(".tux-map__viewport");
    const full = Math.ceil(state.stageData.height * state.stageScale) + 2;
    // the height the component asks for includes the viewport's border
    expect(state.computedViewportHeight).toContain(`min(${full}px, 75vh)`);
    expect(declarations(".tux-map__viewport")[0]).toMatch(/box-sizing:\s*border-box/);
    const measure = async (h: number) => {
      Object.defineProperty(vp.element, "offsetHeight", { value: h, configurable: true });
      state.measureViewport();
      await nextTick();
      return vp.classes().includes("tux-map__viewport--full-height");
    };
    expect(await measure(full)).toBe(true);
    // most of a short screen: the rest scrolls
    expect(await measure(full - 300)).toBe(false);
    expect(declarations(".tux-map__viewport--full-height")[0]).toMatch(/overflow-y:\s*hidden/);
  });
});

describe("TuxArchitectureMap: dragging the background moves the diagram (#205)", () => {
  type PointerInit = { x: number; y: number; buttons?: number; pointerType?: string };

  async function mountMagnified(props: Record<string, unknown> = {}) {
    const m = await mountMap({ initialLevel: 2, ...props }, true);
    await m.wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await nextTick();
    const vp = m.wrapper.find(".tux-map__viewport").element as HTMLElement;
    // the test DOM scrolls nothing: hold what the component sets
    const scroll = { left: 100, top: 80 };
    Object.defineProperty(vp, "scrollLeft", { get: () => scroll.left, set: (v: number) => void (scroll.left = v), configurable: true });
    Object.defineProperty(vp, "scrollTop", { get: () => scroll.top, set: (v: number) => void (scroll.top = v), configurable: true });
    const captured: number[] = [];
    vp.setPointerCapture = ((id: number) => void captured.push(id)) as typeof vp.setPointerCapture;
    vp.releasePointerCapture = (() => {}) as typeof vp.releasePointerCapture;
    const send = async (type: string, target: Element, init: PointerInit) => {
      const ev = new window.MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        button: 0,
        buttons: init.buttons ?? (type === "pointerup" ? 0 : 1),
        clientX: init.x,
        clientY: init.y,
      });
      Object.defineProperty(ev, "pointerId", { value: 7 });
      Object.defineProperty(ev, "pointerType", { value: init.pointerType ?? "mouse" });
      target.dispatchEvent(ev);
      await nextTick();
      return ev;
    };
    const stage = m.wrapper.find(".tux-map__stage").element;
    const dragging = () => vp.classList.contains("tux-map__viewport--dragging");
    return { ...m, vp, stage, scroll, captured, send, dragging };
  }

  it("scrolls the viewport with the pointer, captures it, and shows the grabbing cursor", async () => {
    const { vp, stage, scroll, captured, send, dragging } = await mountMagnified();
    await send("pointerdown", stage, { x: 400, y: 300 });
    expect(dragging()).toBe(false);
    const moved = await send("pointermove", stage, { x: 340, y: 270 });
    expect(dragging()).toBe(true);
    expect(captured).toEqual([7]);
    expect(moved.defaultPrevented).toBe(true);
    expect(scroll).toEqual({ left: 160, top: 110 });
    await send("pointermove", stage, { x: 420, y: 330 });
    expect(scroll).toEqual({ left: 80, top: 50 });
    await send("pointerup", vp, { x: 420, y: 330 });
    expect(dragging()).toBe(false);
    // released: the pointer moves the diagram no more
    await send("pointermove", stage, { x: 100, y: 100, buttons: 0 });
    expect(scroll).toEqual({ left: 80, top: 50 });
    expect(declarations(".tux-map__viewport--magnified")[0]).toMatch(/cursor:\s*grab\b/);
    expect(declarations(".tux-map__viewport--dragging").join(";")).toMatch(/cursor:\s*grabbing/);
  });

  it("keeps the selection through a drag, and clears it on a click of the background as before", async () => {
    const { wrapper, state, stage, scroll, send, dragging } = await mountMagnified();
    await wrapper.find('.tux-map__el[data-id="c-db"]').trigger("click");
    await nextTick();
    expect(state.selectedId).toBe("c-db");
    await send("pointerdown", stage, { x: 400, y: 300 });
    await send("pointermove", stage, { x: 360, y: 300 });
    await send("pointerup", stage, { x: 360, y: 300 });
    expect(scroll.left).toBe(140);
    expect(state.selectedId).toBe("c-db");
    // under 4px is a click, not a drag
    await send("pointerdown", stage, { x: 400, y: 300 });
    await send("pointermove", stage, { x: 402, y: 302 });
    expect(dragging()).toBe(false);
    expect(scroll.left).toBe(140);
    await send("pointerup", stage, { x: 402, y: 302 });
    expect(state.selectedId).toBeNull();
  });

  it("does not start on a card, a `+`, a wire label or a control", async () => {
    const { wrapper, scroll, send, dragging } = await mountMagnified();
    for (const sel of [".tux-map__el", ".tux-map__el-zb", ".tux-map__lab"]) {
      const el = wrapper.find(`.tux-map__stage ${sel}`).element;
      await send("pointerdown", el, { x: 400, y: 300 });
      await send("pointermove", el, { x: 300, y: 200 });
      expect(dragging(), sel).toBe(false);
      await send("pointerup", el, { x: 300, y: 200 });
    }
    expect(scroll).toEqual({ left: 100, top: 80 });
  });

  it("does not start under the click-to-explore veil", async () => {
    const m = await mountMap({ initialLevel: 2, wheelZoom: "click" }, true);
    const veil = m.wrapper.find(".tux-map__wheel-veil").element;
    const down = new window.MouseEvent("pointerdown", { bubbles: true, button: 0, buttons: 1, clientX: 10, clientY: 10 });
    veil.dispatchEvent(down);
    const move = new window.MouseEvent("pointermove", { bubbles: true, cancelable: true, buttons: 1, clientX: 90, clientY: 90 });
    veil.dispatchEvent(move);
    await nextTick();
    expect(m.wrapper.find(".tux-map__viewport").classes()).not.toContain("tux-map__viewport--dragging");
    expect(move.defaultPrevented).toBe(false);
  });

  it("leaves a finger to the browser, which already scrolls with it", async () => {
    const { wrapper, state, stage, scroll, send, dragging } = await mountMagnified();
    await wrapper.find('.tux-map__el[data-id="c-db"]').trigger("click");
    await nextTick();
    await send("pointerdown", stage, { x: 400, y: 300, pointerType: "touch" });
    // a touch on the background clears the selection at once, as it did
    expect(state.selectedId).toBeNull();
    // choosing the card may have scrolled it into sight (#212); the finger moves nothing
    const at = { ...scroll };
    await send("pointermove", stage, { x: 300, y: 200, pointerType: "touch" });
    expect(dragging()).toBe(false);
    expect(scroll).toEqual(at);
  });

  it("drops a drag whose button came up outside the map, and does not take the drawing tools' strokes", async () => {
    const { wrapper, state, stage, scroll, send, dragging } = await mountMagnified({ annotations: true });
    await send("pointerdown", stage, { x: 400, y: 300 });
    await send("pointermove", stage, { x: 380, y: 300 });
    expect(dragging()).toBe(true);
    await send("pointermove", stage, { x: 200, y: 300, buttons: 0 });
    expect(dragging()).toBe(false);
    expect(scroll.left).toBe(120);
    state.activeTool = "pen";
    await nextTick();
    await send("pointerdown", stage, { x: 400, y: 300 });
    await send("pointermove", stage, { x: 300, y: 300 });
    expect(dragging()).toBe(false);
    expect(scroll.left).toBe(120);
    expect(wrapper.find(".tux-map__viewport").classes()).toContain("tux-map__viewport--tool-pen");
  });
});

describe("TuxArchitectureMap: a jump to a level by number key does not linger (#205)", () => {
  type Recorded = { el: Element; frames: Record<string, unknown>[]; duration: number };

  /** The test DOM has no Web Animations: record what the component asks for. */
  function recordAnimations() {
    const calls: Recorded[] = [];
    const proto = window.HTMLElement.prototype as unknown as Record<string, unknown>;
    const had = Object.prototype.hasOwnProperty.call(proto, "animate");
    const prev = proto.animate;
    proto.animate = function (this: Element, frames: Record<string, unknown>[], o: { duration: number }) {
      calls.push({ el: this, frames, duration: o.duration });
      return { cancel() {}, onfinish: null };
    };
    return {
      calls,
      restore() {
        if (had) proto.animate = prev;
        else delete proto.animate;
      },
    };
  }

  const key = async (el: Element, k: string) => {
    el.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
    await nextTick();
    await nextTick();
  };

  it("draws the level where it is with a short fade: no travel, no frame, no reveal of the cards", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 3, initialFocus: "c-api" }, true);
    const rec = recordAnimations();
    try {
      await key(wrapper.find(".tux-map__viewport").element, "1");
      expect(state.currentLevel).toBe(1);
      expect(rec.calls).toHaveLength(1);
      const [fade] = rec.calls;
      expect(fade!.el).toBe(wrapper.find(".tux-map__stage").element);
      expect(fade!.frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
      expect(fade!.duration).toBeLessThanOrEqual(150);
      // the frame that grew over a change of level is gone with the travel that drew it (#212)
      expect(wrapper.find(".tux-map__zoom-portal").exists()).toBe(false);
    } finally {
      rec.restore();
    }
  });

  it("still travels when a card is zoomed into", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 2 }, true);
    const rec = recordAnimations();
    try {
      state.zoomIntoElement("c-api");
      await nextTick();
      await nextTick();
      expect(state.currentLevel).toBe(3);
      const stage = rec.calls.find((c) => c.el === wrapper.find(".tux-map__stage").element)!;
      expect(String(stage.frames[0]!.transform)).toContain("scale(");
      expect(rec.calls.length).toBeGreaterThan(1);
    } finally {
      rec.restore();
    }
  });

  it("takes the pill down after 600ms on a jump, and when the travel ends on a zoom (#212)", async () => {
    const { wrapper, state } = await mountMap({ initialLevel: 3, initialFocus: "c-api" }, true);
    const pill = () => wrapper.find(".tux-map__zoom-hud");
    const waits: number[] = [];
    const realSetTimeout = window.setTimeout;
    // the announcer's 100ms and the double-click's timers are not the pill's
    const spy = ((fn: TimerHandler, ms?: number, ...rest: unknown[]) => {
      if (ms !== undefined && ms >= 150) waits.push(ms);
      return realSetTimeout(fn, ms, ...rest);
    }) as typeof window.setTimeout;
    window.setTimeout = spy;
    globalThis.setTimeout = spy as typeof globalThis.setTimeout;
    const rec = recordAnimations();
    try {
      await key(wrapper.find(".tux-map__viewport").element, "1");
      expect(pill().text()).toContain("Level 3 → Level 1");
      expect(waits).toEqual([600]);
      state.zoomIntoElement(state.activeModel.level2.boundary);
      await nextTick();
      await nextTick();
      const travel = rec.calls.find((c) => c.el === wrapper.find(".tux-map__stage").element && c.frames[0]!.transform)!;
      expect(travel.duration).toBeGreaterThanOrEqual(180);
      expect(travel.duration).toBeLessThanOrEqual(600);
      // armed for a confirmation when the level changed, and again for as long as the travel lasts
      expect(waits).toEqual([600, 600, travel.duration]);
      expect(pill().text()).toContain("Level 1 → Level 2");
    } finally {
      rec.restore();
      window.setTimeout = realSetTimeout;
      globalThis.setTimeout = realSetTimeout as typeof globalThis.setTimeout;
    }
  });
});

describe("TuxArchitectureMap: the blast radius key matches the cards (#205)", () => {
  const swatchOf = (root: Element, text: string) =>
    [...root.querySelectorAll(".tux-map__legend li")].find((li) => li.textContent!.trim() === text)?.querySelector("i");

  it('draws "Selected" as the selected card is drawn, and the selected card as selected only', async () => {
    const { wrapper } = await mountMap({ initialLevel: 2, initialShowBlastRadius: true });
    await wrapper.find('.tux-map__el[data-id="c-db"]').trigger("click");
    await nextTick();
    await nextTick();
    const swatch = swatchOf(wrapper.element, "Selected")!;
    expect([...swatch.classList]).toEqual(["tux-map__swatch", "tux-map__swatch--selected"]);
    const card = wrapper.find('.tux-map__el[data-id="c-db"]');
    expect(card.attributes("aria-pressed")).toBe("true");
    // it is the origin of the radius, and in the radius of a selection the origin is drawn as selected:
    // the changed card's border under the selection's ring was a colour the key does not have
    expect(card.classes()).toContain("tux-map__el--diff-direct");
    expect(wrapper.find(".tux-map__stage").classes()).toContain("tux-map__stage--blast-selection");
    expect(
      declarations('.tux-map__stage--blast-selection .tux-map__el--diff-direct[aria-pressed="true"]')[0],
    ).toMatch(/border-color:\s*var\(--brand-primary\)\s*!important/);
    // what depends on it is still marked, and the key's entry for it is unchanged
    expect(wrapper.findAll(".tux-map__stage .tux-map__el--diff-impact").length).toBeGreaterThan(0);
    expect([...swatchOf(wrapper.element, "Depends on selection")!.classList]).toContain("tux-map__swatch--diff-impact");
    // the swatch and the selected card's ring are one token
    expect(declarations(".tux-map__swatch--selected")[0]).toMatch(/border:\s*2px solid var\(--brand-primary\)/);
    expect(declarations('.tux-map__el[aria-pressed="true"]')[0]).toMatch(/box-shadow:\s*0 0 0 2px var\(--brand-primary\)/);
  });

  it('keeps "PR Modified" and the changed cards in the colour of a change', async () => {
    const { wrapper } = await mountMap({ initialLevel: 3, initialFocus: "c-api", initialShowBlastRadius: true });
    const swatch = swatchOf(wrapper.element, "PR Modified")!;
    expect([...swatch.classList]).toEqual(["tux-map__swatch", "tux-map__swatch--diff-direct"]);
    expect(wrapper.findAll(".tux-map__stage .tux-map__el--diff-direct").length).toBeGreaterThan(0);
    expect(wrapper.find(".tux-map__stage").classes()).not.toContain("tux-map__stage--blast-selection");
    expect(declarations(".tux-map__swatch--diff-direct")[0]).toMatch(/var\(--status-warning\)/);
    expect(declarations(".tux-map__el--diff-direct")[0]).toMatch(/border-color:\s*var\(--status-warning\)/);
  });
});

describe("TuxArchitectureMap: a planned link the model gives no label (#205)", () => {
  it('is labelled "Planned", so it has a label to open like any other link', async () => {
    const model = {
      ...DEFAULT_TTI_LEVEL_MODEL,
      level2: {
        ...DEFAULT_TTI_LEVEL_MODEL.level2,
        rels: [
          ...DEFAULT_TTI_LEVEL_MODEL.level2.rels,
          { from: "c-sandbox", to: "c-storage", status: "planned" as const },
          { from: "c-web", to: "c-storage" },
        ],
      },
    };
    const { wrapper } = await mountMap({ model, initialLevel: 2, initialShowPlanned: true });
    const label = (from: string, to: string) => wrapper.find(`.tux-map__lab[data-from="${from}"][data-to="${to}"]`);
    expect(wrapper.find('.tux-map__wire--planned[data-from="c-sandbox"][data-to="c-storage"]').exists()).toBe(true);
    expect(label("c-sandbox", "c-storage").find(".tux-map__lab-t1").text()).toBe("Planned");
    // a planned link with a label of its own keeps it, and a live link with none still has none
    expect(label("c-workers", "c-sandbox").find(".tux-map__lab-t1").text()).toBe("Dispa…");
    expect(label("c-workers", "c-sandbox").attributes("title")).toBe("Dispatches plugins [gRPC] (planned)");
    expect(wrapper.find('.tux-map__wire[data-from="c-web"][data-to="c-storage"]').exists()).toBe(true);
    expect(label("c-web", "c-storage").exists()).toBe(false);
  });
});

describe("TuxArchitectureMap: the More menu of a narrow map stays inside it (#205)", () => {
  const rect = (left: number, right: number) => () => ({ left, right, top: 0, bottom: 40, width: right - left, height: 40, x: left, y: 0, toJSON() {} }) as DOMRect;

  async function openAt(menu: [number, number], map: [number, number]) {
    const { wrapper, state } = await mountMap({ initialLevel: 2 }, true);
    const el = wrapper.find(".tux-map__more-inline").element as HTMLElement;
    el.getBoundingClientRect = rect(...menu);
    (wrapper.element as HTMLElement).getBoundingClientRect = rect(...map);
    await wrapper.find(".tux-map__more-btn").trigger("click");
    await nextTick();
    await nextTick();
    return { wrapper, state, shift: () => el.style.getPropertyValue("--tux-map-more-shift") };
  }

  it("moves the menu left by what it would pass the map's right edge", async () => {
    // as measured at 792px: the button at 589, a 220px menu, the map from 16 to 776
    const { wrapper, shift } = await openAt([589, 809], [16, 776]);
    expect(shift()).toBe("-33px");
    // closed, it holds no offset for the next time it opens
    await wrapper.find(".tux-map__more-btn").trigger("click");
    await nextTick();
    await nextTick();
    expect(shift()).toBe("");
  });

  it("leaves a menu that fits where it is, and never moves one past the map's left edge", async () => {
    expect((await openAt([16, 236], [16, 584])).shift()).toBe("");
    // wider than the room to its left: it stays at the left edge and its max-width holds it
    expect((await openAt([12, 500], [12, 378])).shift()).toBe("");
    expect((await openAt([100, 420], [12, 378])).shift()).toBe("-42px");
  });

  it("is placed again when the map is measured while it is open", async () => {
    const { wrapper, state, shift } = await openAt([589, 809], [16, 776]);
    (wrapper.find(".tux-map__more-inline").element as HTMLElement).getBoundingClientRect = rect(500, 720);
    state.measureViewport();
    expect(shift()).toBe("");
    expect(blockAt(STYLE, STYLE.indexOf(".tux-map__more-inline--open {"))).toMatch(/left:\s*var\(--tux-map-more-shift, 0px\)/);
  });
});
