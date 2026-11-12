// @vitest-environment nuxt
/**
 * `wheelZoom` has three values (#209). `true`: the plain wheel changes the
 * level and the page does not scroll. `false`: the plain wheel is the page's,
 * Ctrl or a pinch changes the level. `"click"`: the canvas starts under a
 * "Click to explore" veil and behaves as `false` until the reader arms it,
 * then as `true` until it is disarmed again.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import type { TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";

const model = {
  level1: { title: "x", elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1] }], rels: [] },
  level2: {
    title: "c",
    boundary: "sys",
    elements: [
      { id: "c-a", kind: "container", name: "A", at: [1, 1] },
      { id: "c-b", kind: "container", name: "B", at: [3, 1] },
    ],
    rels: [],
  },
  level3: {},
  level4: { groups: [], nodes: [], links: [] },
} as unknown as TuxMapLevelModel;

type SetupState = Record<string, any>;
type WheelZoom = boolean | "click";

describe("TuxArchitectureMap: wheelZoom and the click-to-explore veil (#209)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /** Mounted at Level 2, so one wheel notch down has a level to go out to. */
  async function mountMap(wheelZoom?: WheelZoom) {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 2, ...(wheelZoom === undefined ? {} : { wheelZoom }) },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await nextTick();
    await nextTick();
    const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
    const root = wrapper.find(".tux-map").element as HTMLElement;
    const viewport = wrapper.find(".tux-map__viewport").element as HTMLElement;
    const veil = () => wrapper.find(".tux-map__wheel-veil");
    const hint = () => wrapper.find(".tux-map__hint").text();
    /** The class that lets an unused wheel through to the page (the canvas otherwise has `overscroll-behavior: contain`). */
    const releasesScroll = () => viewport.classList.contains("tux-map__viewport--page-wheel");
    /** One notch of the wheel over the canvas: was it taken from the page, and where did it leave the level. */
    const wheel = async (init: WheelEventInit = {}) => {
      const ev = new window.WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true, ...init });
      (veil().exists() ? veil().element : viewport).dispatchEvent(ev);
      await nextTick();
      await nextTick();
      return { prevented: ev.defaultPrevented, level: state.currentLevel as number };
    };
    const arm = async () => {
      await veil().trigger("click");
      await nextTick();
    };
    return { wrapper, state, root, viewport, veil, hint, wheel, arm, releasesScroll };
  }

  it("true (the default): no veil, the plain wheel changes the level and is kept from the page", async () => {
    for (const mode of [undefined, true] as const) {
      const { veil, wheel, hint, releasesScroll } = await mountMap(mode);
      expect(veil().exists()).toBe(false);
      expect(releasesScroll()).toBe(false);
      expect(hint()).toContain("scroll the mouse wheel over a card");
      expect(hint()).not.toMatch(/click the diagram first/i);
      expect(await wheel()).toEqual({ prevented: true, level: 1 });
    }
  });

  it("false: no veil, the plain wheel is the page's, Ctrl+wheel changes the level", async () => {
    const { veil, wheel, hint, releasesScroll } = await mountMap(false);
    expect(veil().exists()).toBe(false);
    expect(releasesScroll()).toBe(true);
    expect(hint()).toContain("hold Ctrl and scroll");
    expect(await wheel()).toEqual({ prevented: false, level: 2 });
    expect(await wheel({ ctrlKey: true })).toEqual({ prevented: true, level: 1 });
  });

  it('"click", not armed: a veil that is a button, the plain wheel is the page\'s, the help says to click first', async () => {
    const { veil, viewport, wheel, hint, state, releasesScroll } = await mountMap("click");
    expect(veil().exists()).toBe(true);
    expect(releasesScroll()).toBe(true);
    expect(veil().element.tagName).toBe("BUTTON");
    expect(veil().attributes("type")).toBe("button");
    expect(veil().attributes("tabindex")).toBeUndefined();
    expect(veil().text()).toBe("Click to explore");
    // the veil is the canvas's tab stop while it is up, and the first thing in it
    expect(viewport.getAttribute("tabindex")).toBe("-1");
    expect(viewport.firstElementChild).toBe(veil().element);
    expect(state.wheelArmed).toBe(false);
    expect(hint()).toMatch(/^Click the diagram first/);
    expect(hint()).toContain("scroll the mouse wheel over a card");
    expect(hint()).not.toContain("Ctrl");
    expect(await wheel()).toEqual({ prevented: false, level: 2 });
    expect(veil().exists()).toBe(true);
  });

  it('"click", not armed: Ctrl+wheel and a pinch still change the level, and do not arm', async () => {
    const { veil, wheel, state } = await mountMap("click");
    expect(await wheel({ ctrlKey: true })).toEqual({ prevented: true, level: 1 });
    expect(state.wheelArmed).toBe(false);
    expect(veil().exists()).toBe(true);
    const second = await mountMap("click");
    expect(await second.wheel({ metaKey: true })).toEqual({ prevented: true, level: 1 });
  });

  it('"click": a click on the veil arms it; the veil goes, focus is in the canvas, the wheel zooms', async () => {
    const { veil, viewport, wheel, hint, arm, state, releasesScroll } = await mountMap("click");
    await arm();
    expect(state.wheelArmed).toBe(true);
    expect(releasesScroll()).toBe(false);
    expect(veil().exists()).toBe(false);
    expect(viewport.getAttribute("tabindex")).toBe("0");
    expect(document.activeElement).toBe(viewport);
    expect(hint()).not.toMatch(/click the diagram first/i);
    expect(hint()).toContain("scroll the mouse wheel over a card");
    expect(await wheel()).toEqual({ prevented: true, level: 1 });
  });

  it('"click": keyboard focus entering the canvas arms it; focus on the veil itself, or by the mouse, does not', async () => {
    const { veil, wrapper, state } = await mountMap("click");
    const card = wrapper.find(".tux-map__el").element as HTMLElement;
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const focusIn = async (el: HTMLElement, keyboard: boolean) => {
      vi.spyOn(el, "matches").mockImplementation((sel: string) =>
        sel === ":focus-visible" ? keyboard : HTMLElement.prototype.matches.call(el, sel),
      );
      el.dispatchEvent(new window.FocusEvent("focusin", { bubbles: true, relatedTarget: outside }));
      await nextTick();
    };
    await focusIn(veil().element as HTMLElement, true);
    expect(state.wheelArmed).toBe(false);
    await focusIn(card, false);
    expect(state.wheelArmed).toBe(false);
    await focusIn(card, true);
    expect(state.wheelArmed).toBe(true);
    expect(veil().exists()).toBe(false);
    outside.remove();
  });

  it('"click": Enter and Space on the veil are the button\'s own, not the canvas\'s keys', async () => {
    const { veil, viewport } = await mountMap("click");
    const seen: string[] = [];
    viewport.parentElement!.addEventListener("keydown", (e) => seen.push((e as KeyboardEvent).key));
    for (const key of ["Enter", " ", "Escape"]) {
      veil().element.dispatchEvent(new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    }
    expect(seen).toEqual(["Escape"]);
  });

  describe("disarming", () => {
    async function armed() {
      const m = await mountMap("click");
      await m.arm();
      expect(m.state.wheelArmed).toBe(true);
      return m;
    }
    const expectDisarmed = async (m: Awaited<ReturnType<typeof armed>>) => {
      await nextTick();
      expect(m.state.wheelArmed).toBe(false);
      expect(m.veil().exists()).toBe(true);
      expect(m.releasesScroll()).toBe(true);
      expect(m.hint()).toMatch(/^Click the diagram first/);
      const level = m.state.currentLevel;
      expect(await m.wheel()).toEqual({ prevented: false, level });
    };

    it("Escape goes out a level first, and disarms only at the top with nothing else to close", async () => {
      const m = await armed();
      const esc = () => m.viewport.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      esc();
      await nextTick();
      expect(m.state.currentLevel).toBe(1);
      expect(m.state.wheelArmed).toBe(true);
      m.state.selectElement("sys");
      await nextTick();
      esc();
      await nextTick();
      expect(m.state.selectedId).toBe(null);
      expect(m.state.wheelArmed).toBe(true);
      esc();
      await expectDisarmed(m);
    });

    it("a pointer-down outside the map disarms; one inside it does not", async () => {
      const m = await armed();
      m.root.querySelector(".tux-map__hint")!.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true }));
      await nextTick();
      expect(m.state.wheelArmed).toBe(true);
      document.body.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true }));
      await expectDisarmed(m);
    });

    it("focus leaving the map disarms; focus moving inside it does not", async () => {
      const m = await armed();
      const outside = document.createElement("button");
      document.body.appendChild(outside);
      const inside = m.root.querySelector("button")!;
      m.viewport.dispatchEvent(new window.FocusEvent("focusout", { bubbles: true, relatedTarget: inside }));
      await nextTick();
      expect(m.state.wheelArmed).toBe(true);
      m.viewport.dispatchEvent(new window.FocusEvent("focusout", { bubbles: true, relatedTarget: outside }));
      await expectDisarmed(m);
      outside.remove();
    });

    it("the pointer staying outside the map for 3 s disarms; coming back in time does not", async () => {
      const m = await armed();
      vi.useFakeTimers();
      const leave = () => m.root.dispatchEvent(new window.MouseEvent("pointerleave"));
      const enter = () => m.root.dispatchEvent(new window.MouseEvent("pointerenter"));
      expect(m.state.WHEEL_DISARM_AFTER_MS).toBe(3000);
      leave();
      vi.advanceTimersByTime(2900);
      enter();
      vi.advanceTimersByTime(5000);
      expect(m.state.wheelArmed).toBe(true);
      leave();
      vi.advanceTimersByTime(2999);
      expect(m.state.wheelArmed).toBe(true);
      vi.advanceTimersByTime(1);
      vi.useRealTimers();
      await expectDisarmed(m);
    });
  });

  it('"click" with a coarse pointer: no veil, nothing to arm, the wheel is the page\'s, Ctrl+wheel zooms', async () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q === "(pointer: coarse)",
      media: q,
      addEventListener() {},
      removeEventListener() {},
    }));
    const { veil, viewport, wrapper, wheel, hint, state } = await mountMap("click");
    expect(state.coarsePointer).toBe(true);
    expect(veil().exists()).toBe(false);
    expect(viewport.getAttribute("tabindex")).toBe("0");
    expect(hint()).not.toMatch(/click the diagram first/i);
    expect(hint()).toMatch(/^Tap a card/);
    const card = wrapper.find(".tux-map__el").element as HTMLElement;
    vi.spyOn(card, "matches").mockReturnValue(true);
    card.dispatchEvent(new window.FocusEvent("focusin", { bubbles: true }));
    await nextTick();
    expect(state.wheelArmed).toBe(false);
    expect(await wheel()).toEqual({ prevented: false, level: 2 });
    expect(await wheel({ ctrlKey: true })).toEqual({ prevented: true, level: 1 });
  });

  it("the veil's fade is off under prefers-reduced-motion, and the page-wheel class gives the scroll back", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("packages/diagrams/app/components/TuxArchitectureMap.vue", "utf8");
    expect(/\.tux-map__viewport--page-wheel \{\s*overscroll-behavior: auto;/.test(src)).toBe(true);
    const reduce = src.slice(src.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
    expect(/\.tux-map__wheel-veil \{[^}]*animation:/.test(src)).toBe(true);
    expect(/\.tux-map__wheel-veil[^{]*\{[^}]*animation: none/.test(reduce)).toBe(true);
  });
});
