// @vitest-environment nuxt
/**
 * The overview of the current level (#211): a small drawing of the stage's cards and of the
 * part in view, in a corner of the canvas. It is there only where the level is larger than
 * its viewport, it shows while the view moves and goes 1.2 s after it rests, and a press on
 * it moves the view. It is drawn from the stage data the map already built.
 *
 * jsdom does no layout: the viewport's size is supplied by the test, and a scroll is the
 * scroll position set and the event sent.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import * as stageBuilders from "../packages/diagrams/app/utils/internal/tuxArchitectureMapStage";
import {
  MINIMAP_REST_MS,
  minimapScale,
  minimapScrollTarget,
} from "../packages/diagrams/app/utils/internal/tuxArchitectureMapMinimap";
import type { TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { runComponentAxe } from "./axe-helper";

vi.mock("../packages/diagrams/app/utils/internal/tuxArchitectureMapStage", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../packages/diagrams/app/utils/internal/tuxArchitectureMapStage")>();
  return {
    ...actual,
    buildStageBase: vi.fn(actual.buildStageBase),
    buildStageData: vi.fn(actual.buildStageData),
  };
});

const baseSpy = vi.mocked(stageBuilders.buildStageBase);
const dataSpy = vi.mocked(stageBuilders.buildStageData);

const model = {
  level1: { title: "x", elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1] }], rels: [] },
  level2: {
    title: "c",
    boundary: "sys",
    elements: [
      { id: "c-a", kind: "container", name: "A", at: [1, 1] },
      { id: "c-b", kind: "container", name: "B", at: [3, 1] },
      { id: "c-c", kind: "container", name: "C", at: [1, 2] },
      { id: "c-d", kind: "container", name: "D", at: [3, 2] },
    ],
    rels: [{ from: "c-a", to: "c-b", label: "calls" }],
  },
  level3: {
    "c-a": [
      { id: "k-1", kind: "component", name: "K1", at: [1, 1] },
      { id: "k-2", kind: "component", name: "K2", at: [2, 1] },
    ],
  },
  level4: { groups: [], nodes: [], links: [] },
} as unknown as TuxMapLevelModel;

type SetupState = Record<string, any>;

const FRAME_MS = 20;

/** A pointer event with a position: jsdom's own MouseEvent, under the pointer event's name. */
function pointer(el: Element, type: string, init: MouseEventInit & { pointerId?: number }) {
  const ev = new window.MouseEvent(type, { bubbles: true, cancelable: true, ...init });
  Object.defineProperty(ev, "pointerId", { value: init.pointerId ?? 1 });
  el.dispatchEvent(ev);
}

describe("TuxArchitectureMap: the overview of the level (#211)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /**
   * Mounted at Level 2 with a viewport of the given size. `overflow` magnifies the diagram
   * one step, which makes it larger than a 600 × 300 viewport and counts as the view moving.
   */
  async function mountMap(
    props: Record<string, unknown> = {},
    opts: { size?: [number, number]; overflow?: boolean; early?: (state: SetupState) => void } = {},
  ) {
    vi.useFakeTimers({
      toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"],
    });
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 2, ...props },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await nextTick();
    await nextTick();
    const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
    const viewport = wrapper.find(".tux-map__viewport").element as HTMLElement;
    const [w, h] = opts.size ?? [600, 300];
    Object.defineProperty(viewport, "clientWidth", { configurable: true, get: () => w });
    Object.defineProperty(viewport, "clientHeight", { configurable: true, get: () => h });

    const settle = async (ms = FRAME_MS) => {
      await nextTick();
      vi.advanceTimersByTime(ms);
      await nextTick();
      await nextTick();
    };
    const minimap = () => wrapper.find(".tux-map__minimap");
    const shown = () => minimap().exists() && minimap().classes().includes("tux-map__minimap--shown");
    const scrollTo = async (left: number, top: number) => {
      viewport.scrollLeft = left;
      viewport.scrollTop = top;
      viewport.dispatchEvent(new window.Event("scroll"));
      await settle();
    };
    const rest = async () => {
      await settle(MINIMAP_REST_MS + 50);
    };
    // the first frame after the map is on the page: what moves before it is the map settling
    opts.early?.(state);
    await settle();
    if (opts.overflow ?? true) {
      state.magnifyBy(1);
      await settle();
    }
    return { wrapper, state, viewport, minimap, shown, scrollTo, settle, rest };
  }

  it("is not rendered when the whole level fits in the viewport", async () => {
    const { minimap, scrollTo, state, settle } = await mountMap({}, { size: [5000, 5000], overflow: false });
    await scrollTo(0, 0);
    expect(minimap().exists()).toBe(false);
    // magnified and still inside the viewport: still nothing to scroll to
    state.magnifyBy(1);
    await settle();
    expect(state.isMagnified).toBe(true);
    expect(minimap().exists()).toBe(false);
  });

  it("draws every card of the level from the stage's rectangles, and the part in view", async () => {
    const { minimap, state, scrollTo } = await mountMap();
    expect(minimap().exists()).toBe(true);
    const stage = state.stageData;
    const k = minimapScale(stage);
    const cards = minimap().findAll(".tux-map__minimap-card");
    expect(cards.map((c) => c.attributes("data-id")).sort()).toEqual(stage.els.map((e: { id: string }) => e.id).sort());
    for (const c of cards) {
      const r = stage.rects[c.attributes("data-id")!];
      expect(Number(c.attributes("x"))).toBeCloseTo(r.x * k, 1);
      expect(Number(c.attributes("y"))).toBeCloseTo(r.y * k, 1);
      expect(Number(c.attributes("width"))).toBeCloseTo(r.w * k, 1);
    }
    // the part in view: 600 × 300 of the scaled stage, from the scroll position
    const s = state.stageScale as number;
    await scrollTo(90, 30);
    const view = minimap().find(".tux-map__minimap-view");
    expect(Number(view.attributes("x"))).toBeCloseTo((90 / s) * k, 1);
    expect(Number(view.attributes("y"))).toBeCloseTo((30 / s) * k, 1);
    expect(Number(view.attributes("width"))).toBeCloseTo((600 / s) * k, 1);
  });

  it("tells the selected, the faded and the changed cards apart", async () => {
    const { minimap, state, settle } = await mountMap();
    const card = (id: string) => minimap().find(`.tux-map__minimap-card[data-id="${id}"]`);
    expect(card("c-a").classes()).not.toContain("tux-map__minimap-card--selected");
    state.selectElement("c-a");
    await settle();
    expect(card("c-a").classes()).toContain("tux-map__minimap-card--selected");
    // c-b is on a wire of the selection and stays; c-d is on none and steps back, as on the stage
    expect(card("c-b").classes()).not.toContain("tux-map__minimap-card--faded");
    expect(card("c-d").classes()).toContain("tux-map__minimap-card--faded");
    expect(card("c-d").classes()).not.toContain("tux-map__minimap-card--changed");
  });

  it("marks the cards the branch changed when the blast radius is on", async () => {
    const changed = JSON.parse(JSON.stringify(model)) as TuxMapLevelModel;
    (changed.level2.elements[2] as { diff?: unknown }).diff = { changeType: "modified" };
    const { minimap } = await mountMap({ model: changed, initialShowBlastRadius: true });
    const card = (id: string) => minimap().find(`.tux-map__minimap-card[data-id="${id}"]`);
    expect(card("c-c").classes()).toContain("tux-map__minimap-card--changed");
    expect(card("c-a").classes()).not.toContain("tux-map__minimap-card--changed");
  });

  it("shows while the view scrolls and goes 1.2 s after it rests", async () => {
    const { shown, scrollTo, settle, rest, minimap } = await mountMap();
    // magnifying moved the view
    expect(shown()).toBe(true);
    await rest();
    // at rest it is still in the document, where a keyboard reaches it, and it is not shown
    expect(minimap().exists()).toBe(true);
    expect(shown()).toBe(false);

    await scrollTo(40, 0);
    expect(shown()).toBe(true);
    await settle(MINIMAP_REST_MS - 200);
    expect(shown()).toBe(true);
    // a second scroll starts the wait again
    await scrollTo(80, 0);
    await settle(MINIMAP_REST_MS - 200);
    expect(shown()).toBe(true);
    await settle(400);
    expect(shown()).toBe(false);
  });

  it("does not show for a level that overflows as it loads, or when the window is resized", async () => {
    // the scale settles before the first frame, as it does when the map measures itself on mount
    const { minimap, shown, settle, scrollTo } = await mountMap(
      {},
      { overflow: false, early: (state) => state.magnifyBy(1) },
    );
    expect(minimap().exists()).toBe(true);
    expect(shown()).toBe(false);
    window.dispatchEvent(new window.Event("resize"));
    await settle();
    expect(shown()).toBe(false);
    await scrollTo(0, 30);
    expect(shown()).toBe(true);
  });

  it("shows when the level changes and when the diagram is magnified", async () => {
    const { shown, state, settle, rest } = await mountMap();
    await rest();
    expect(shown()).toBe(false);
    state.goToLevel(1, { inward: false, jump: true });
    await settle();
    expect(state.currentLevel).toBe(1);
    expect(shown()).toBe(true);
    await rest();
    expect(shown()).toBe(false);
    state.magnifyBy(1);
    await settle();
    expect(shown()).toBe(true);
  });

  it("stays while the pointer is over it", async () => {
    const { shown, scrollTo, settle, rest, minimap } = await mountMap();
    await rest();
    await scrollTo(40, 0);
    await minimap().trigger("pointerenter");
    await settle(MINIMAP_REST_MS * 5);
    expect(shown()).toBe(true);
    await minimap().trigger("pointerleave");
    await settle(MINIMAP_REST_MS - 200);
    expect(shown()).toBe(true);
    await settle(400);
    expect(shown()).toBe(false);
  });

  it("is one focusable control: focus shows it and holds it, and the arrow keys move the view", async () => {
    const { shown, settle, rest, minimap, viewport } = await mountMap();
    await rest();
    expect(shown()).toBe(false);
    const el = minimap().element as HTMLElement;
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toMatch(/^Overview of this level: 4 cards/);
    expect(minimap().findAll("[tabindex]")).toHaveLength(0);

    el.focus();
    await settle();
    expect(shown()).toBe(true);
    await settle(MINIMAP_REST_MS * 5);
    expect(shown()).toBe(true);

    const key = async (k: string) => {
      const ev = new window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
      el.dispatchEvent(ev);
      await settle();
      return ev.defaultPrevented;
    };
    expect(await key("ArrowRight")).toBe(true);
    expect(viewport.scrollLeft).toBe(150);
    expect(await key("ArrowDown")).toBe(true);
    expect(viewport.scrollTop).toBe(75);
    expect(await key("ArrowLeft")).toBe(true);
    expect(await key("ArrowLeft")).toBe(true);
    expect(viewport.scrollLeft).toBe(0);
    expect(await key("ArrowUp")).toBe(true);
    expect(viewport.scrollTop).toBe(0);
    // any other key is not the overview's
    expect(await key("a")).toBe(false);

    el.blur();
    await rest();
    expect(shown()).toBe(false);
  });

  it("a press on it centres the view on that point, and a drag follows", async () => {
    const { minimap, viewport, state, settle, rest, shown } = await mountMap();
    const stage = state.stageData;
    const s = state.stageScale as number;
    const k = minimapScale(stage);
    const view = { left: 0, top: 0, width: 600, height: 300 };
    const el = minimap().element as HTMLElement;
    // the overview's own place on the page, which jsdom does not lay out
    el.getBoundingClientRect = () => ({ left: 100, top: 400, right: 268, bottom: 512, width: 168, height: 112, x: 100, y: 400, toJSON: () => ({}) });

    const at = (x: number, y: number) => ({ clientX: 100 + x, clientY: 400 + y, button: 0, buttons: 1, pointerId: 7 });
    pointer(el, "pointerdown", at(60, 30));
    await settle();
    const first = minimapScrollTarget({ x: 60, y: 30 }, stage, s, 0, view, k);
    expect(first.left).toBeGreaterThan(0);
    expect(viewport.scrollLeft).toBe(first.left);
    expect(viewport.scrollTop).toBe(first.top);

    pointer(el, "pointermove", at(90, 40));
    await settle();
    const second = minimapScrollTarget({ x: 90, y: 40 }, stage, s, 0, view, k);
    expect(second.left).toBeGreaterThan(first.left);
    expect(viewport.scrollLeft).toBe(second.left);
    expect(viewport.scrollTop).toBe(second.top);

    // a drag holds it; it goes after the button comes up and the view rests
    await settle(MINIMAP_REST_MS * 3);
    expect(shown()).toBe(true);
    pointer(el, "pointerup", { ...at(90, 40), buttons: 0 });
    // a move with no button down moves nothing
    pointer(el, "pointermove", { ...at(10, 10), buttons: 0 });
    await settle();
    expect(viewport.scrollLeft).toBe(second.left);
    await rest();
    expect(shown()).toBe(false);
  });

  it("is not there in the list view, under the click-to-explore veil, or with the prop off", async () => {
    const list = await mountMap();
    expect(list.minimap().exists()).toBe(true);
    list.state.setExplicitViewMode("list");
    await list.settle();
    expect(list.minimap().exists()).toBe(false);

    const off = await mountMap({ minimap: false });
    expect(off.state.isMagnified).toBe(true);
    await off.scrollTo(40, 0);
    expect(off.minimap().exists()).toBe(false);

    // under the veil the diagram is not magnified: a fixed height is what makes it overflow
    const veiled = await mountMap({ wheelZoom: "click", height: "200px" }, { size: [600, 100], overflow: false });
    expect(veiled.wrapper.find(".tux-map__wheel-veil").exists()).toBe(true);
    await veiled.scrollTo(0, 20);
    expect(veiled.minimap().exists()).toBe(false);
    await veiled.wrapper.find(".tux-map__wheel-veil").trigger("click");
    await veiled.scrollTo(0, 40);
    expect(veiled.wrapper.find(".tux-map__wheel-veil").exists()).toBe(false);
    expect(veiled.minimap().exists()).toBe(true);
  });

  it("is not there on a touch screen narrower than the auto-list breakpoint", async () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("pointer: coarse"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const was = window.innerWidth;
    try {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: 600 });
      const narrow = await mountMap({ initialView: "diagram" });
      expect(narrow.state.coarsePointer).toBe(true);
      await narrow.scrollTo(40, 0);
      expect(narrow.minimap().exists()).toBe(false);
      // the same touch screen, wider than the breakpoint
      Object.defineProperty(window, "innerWidth", { configurable: true, value: 900 });
      window.dispatchEvent(new window.Event("resize"));
      await narrow.scrollTo(80, 0);
      expect(narrow.minimap().exists()).toBe(true);
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: was });
    }
  });

  it("builds no stage of its own: the same builder calls with it and without it", async () => {
    const run = async (minimap: boolean) => {
      baseSpy.mockClear();
      dataSpy.mockClear();
      const m = await mountMap({ minimap });
      expect(m.minimap().exists()).toBe(minimap);
      await m.scrollTo(60, 20);
      m.state.goToLevel(1, { inward: false, jump: true });
      await m.settle();
      m.state.selectElement("sys");
      await m.settle();
      await m.scrollTo(10, 0);
      const built = { base: baseSpy.mock.calls.length, data: dataSpy.mock.calls.length };
      if (minimap) {
        // nothing done on the overview builds a stage either
        await m.minimap().trigger("pointerenter");
        const el = m.minimap().element;
        pointer(el, "pointerdown", { clientX: 30, clientY: 20, button: 0, buttons: 1, pointerId: 3 });
        pointer(el, "pointermove", { clientX: 50, clientY: 30, button: 0, buttons: 1, pointerId: 3 });
        pointer(el, "pointerup", { clientX: 50, clientY: 30, button: 0, pointerId: 3 });
        await m.settle();
        await m.minimap().trigger("pointerleave");
        await m.rest();
        expect({ base: baseSpy.mock.calls.length, data: dataSpy.mock.calls.length }).toEqual(built);
      }
      return built;
    };
    const without = await run(false);
    const withIt = await run(true);
    expect(without.base).toBeGreaterThan(0);
    expect(without.data).toBeGreaterThan(0);
    expect(withIt).toEqual(without);
  });

  it("reads the viewport once a frame, however many scroll events arrive", async () => {
    const { viewport, settle } = await mountMap();
    await settle(100);
    let reads = 0;
    Object.defineProperty(viewport, "clientWidth", {
      configurable: true,
      get: () => {
        reads += 1;
        return 600;
      },
    });
    for (let i = 1; i <= 25; i += 1) {
      viewport.scrollLeft = i * 4;
      viewport.dispatchEvent(new window.Event("scroll"));
    }
    expect(reads).toBe(0);
    await settle();
    expect(reads).toBe(1);
  });

  it("passes axe with the overview shown", async () => {
    const { wrapper, shown } = await mountMap();
    expect(shown()).toBe(true);
    vi.useRealTimers();
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });

  it("does not fade under prefers-reduced-motion, and is out of the pointer's way when it is not shown", () => {
    const sfc = readFileSync(
      join(process.cwd(), "packages/diagrams/app/utils/internal/TuxArchitectureMapMinimap.vue"),
      "utf8",
    );
    const css = sfc.slice(sfc.indexOf("<style"));
    expect(css).toMatch(/\.tux-map__minimap\s*\{[^}]*opacity:\s*0;[^}]*pointer-events:\s*none;[^}]*transition:\s*opacity/s);
    expect(css).toMatch(/\.tux-map__minimap--shown\s*\{[^}]*opacity:\s*1;[^}]*pointer-events:\s*auto;/s);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.tux-map__minimap\s*\{\s*transition:\s*none;/);
  });
});
