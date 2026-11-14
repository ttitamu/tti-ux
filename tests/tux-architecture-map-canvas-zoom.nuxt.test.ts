// @vitest-environment nuxt
/**
 * The canvas zoom and pan (#271): a zoom group in the canvas's top-right corner (−, the percentage,
 * +, Fit), Ctrl/Cmd + wheel and a pinch around the pointer, Shift + wheel sideways, a drag of the
 * background or Space + drag anywhere, and + − 0 and the arrows on the focused canvas.
 *
 * The test DOM does no layout and scrolls nothing: the viewport's size, its place on the page and its
 * scroll are held here, as the travel and minimap tests do. What a browser does with them (the point
 * under the pointer staying put, the frames at rest) was measured with puppeteer and is in the PR.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";

type SetupState = Record<string, any>;

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const VP = { left: 100, top: 50, width: 800, height: 440 };

async function mountMap(props: Record<string, unknown> = {}) {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"] });
  const wrapper = await mountSuspended(TuxArchitectureMap, {
    props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  const vp = wrapper.find(".tux-map__viewport").element as HTMLElement;
  const scroll = { left: 0, top: 0 };
  // a browser clamps the scroll to the content; so does this
  const maxLeft = () => Math.max(0, Math.ceil(state.stageData.width * state.stageScale) - VP.width);
  const maxTop = () => Math.max(0, Math.ceil(state.stageData.height * state.stageScale) - innerHeight());
  Object.defineProperty(vp, "scrollLeft", {
    get: () => scroll.left,
    set: (v: number) => void (scroll.left = Math.max(0, Math.min(maxLeft(), v))),
    configurable: true,
  });
  Object.defineProperty(vp, "scrollTop", {
    get: () => scroll.top,
    set: (v: number) => void (scroll.top = Math.max(0, Math.min(maxTop(), v))),
    configurable: true,
  });
  Object.defineProperty(vp, "clientWidth", { get: () => VP.width, configurable: true });
  // fitted, the viewport is as tall as the level (#261); magnified, it is the height held here
  const innerHeight = () => (state.isMagnified ? VP.height : state.heldFitHeight - 2);
  Object.defineProperty(vp, "clientHeight", { get: innerHeight, configurable: true });
  Object.defineProperty(vp, "offsetHeight", { get: () => innerHeight() + 2, configurable: true });
  Object.defineProperty(vp, "scrollWidth", { get: () => VP.width + maxLeft(), configurable: true });
  Object.defineProperty(vp, "scrollHeight", { get: () => VP.height + maxTop(), configurable: true });
  vp.getBoundingClientRect = () =>
    ({ left: VP.left, top: VP.top, right: VP.left + VP.width, bottom: VP.top + VP.height, width: VP.width, height: VP.height, x: VP.left, y: VP.top }) as DOMRect;
  vp.setPointerCapture = (() => {}) as typeof vp.setPointerCapture;
  vp.releasePointerCapture = (() => {}) as typeof vp.releasePointerCapture;
  state.measureViewport();
  await nextTick();
  const settle = async () => {
    await nextTick();
    vi.advanceTimersByTime(20);
    await nextTick();
    await nextTick();
  };
  const wheel = async (init: WheelEventInit) => {
    const ev = new window.WheelEvent("wheel", { bubbles: true, cancelable: true, ...init });
    vp.dispatchEvent(ev);
    await settle();
    return ev.defaultPrevented;
  };
  const key = async (k: string, target: Element = vp) => {
    const ev = new window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
    target.dispatchEvent(ev);
    await settle();
    return ev.defaultPrevented;
  };
  const send = async (type: string, target: Element, x: number, y: number, buttons = type === "pointerup" ? 0 : 1) => {
    const ev = new window.MouseEvent(type, { bubbles: true, cancelable: true, button: 0, buttons, clientX: x, clientY: y });
    Object.defineProperty(ev, "pointerId", { value: 3 });
    Object.defineProperty(ev, "pointerType", { value: "mouse" });
    target.dispatchEvent(ev);
    await nextTick();
    return ev;
  };
  const pct = () => wrapper.find("[data-zoom-percent]").text();
  /** The diagram point under a viewport point, from the scale and the scroll the map holds. */
  const pointAt = (ax: number, ay: number) => [
    (scroll.left + ax - state.panX) / state.stageScale,
    (scroll.top + ay - state.stageOffsetY) / state.stageScale,
  ];
  return { wrapper, state, vp, scroll, settle, wheel, key, send, pct, pointAt };
}

describe("TuxArchitectureMap: the canvas zoom control (#271)", () => {
  it("sits in the canvas, says the size against Fit, and its buttons step, fit and announce", async () => {
    const { wrapper, state, pct, settle } = await mountMap();
    const group = wrapper.find(".tux-map__canvas > .tux-map__zoomctl");
    expect(group.attributes("role")).toBe("group");
    expect(group.attributes("aria-label")).toBe("Magnify the diagram");
    expect(pct()).toBe("100%");
    const larger = () => wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram larger"]');
    const smaller = () => wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram smaller"]');
    const fit = () => wrapper.find(".tux-map__zoomctl .tux-map__magnify-fit");
    expect((smaller().element as HTMLButtonElement).disabled).toBe(true);
    expect(fit().attributes("aria-pressed")).toBe("true");

    await larger().trigger("click");
    await settle();
    expect(state.isMagnified).toBe(true);
    expect(pct()).toBe(`${Math.round((state.stageScale / state.fitScale) * 100)}%`);
    expect(state.liveAnnouncement).toContain(`${pct()} of the fitted size`);
    expect(fit().attributes("aria-pressed")).toBe("false");
    const one = state.stageScale;
    await larger().trigger("click");
    await settle();
    expect(state.stageScale).toBeGreaterThan(one);
    await smaller().trigger("click");
    await settle();
    expect(state.stageScale).toBe(one);
    await fit().trigger("click");
    await settle();
    expect(state.isMagnified).toBe(false);
    expect(pct()).toBe("100%");
    expect(state.liveAnnouncement).toBe("Diagram fitted to the width");
  });

  it("moves beside the details panel while it is open over the map", async () => {
    const { wrapper, state, settle } = await mountMap();
    const group = () => wrapper.find(".tux-map__zoomctl");
    expect(group().classes()).not.toContain("tux-map__zoomctl--beside-panel");
    state.selectElement("c-api");
    await settle();
    expect(group().classes()).toContain("tux-map__zoomctl--beside-panel");
  });
});

describe("TuxArchitectureMap: Ctrl + wheel, a pinch and Shift + wheel (#271)", () => {
  it("Ctrl + wheel zooms around the pointer, kept from the page, and keeps the level", async () => {
    const { state, wheel, scroll, pointAt } = await mountMap();
    const at = [500, 300] as const;
    const before = pointAt(at[0] - VP.left, at[1] - VP.top);
    expect(await wheel({ ctrlKey: true, deltaY: -100, clientX: at[0], clientY: at[1] })).toBe(true);
    expect(state.currentLevel).toBe(2);
    expect(state.isMagnified).toBe(true);
    expect(scroll.left + scroll.top).toBeGreaterThan(0);
    const after = pointAt(at[0] - VP.left, at[1] - VP.top);
    expect(after[0]).toBeCloseTo(before[0]!, 0);
    expect(after[1]).toBeCloseTo(before[1]!, 0);
    // and back down: Cmd (a Mac's) does the same, and lands on Fit rather than a hair above it
    for (let i = 0; i < 12; i++) await wheel({ metaKey: true, deltaY: 100, clientX: at[0], clientY: at[1] });
    expect(state.isMagnified).toBe(false);
    expect(state.zoomScale).toBe(null);
  });

  it("sums a pinch's small steps in a frame and tops out at twice the real size", async () => {
    const { state, vp, settle } = await mountMap();
    for (let i = 0; i < 5; i++) {
      vp.dispatchEvent(new window.WheelEvent("wheel", { bubbles: true, cancelable: true, ctrlKey: true, deltaY: -4, clientX: 400, clientY: 200 }));
    }
    await settle();
    // five steps of 4px: e^(20/100) of Fit, applied once
    expect(state.stageScale / state.fitScale).toBeCloseTo(Math.exp(0.2), 3);
    for (let i = 0; i < 60; i++) {
      vp.dispatchEvent(new window.WheelEvent("wheel", { bubbles: true, cancelable: true, ctrlKey: true, deltaY: -100, clientX: 400, clientY: 200 }));
      await settle();
    }
    expect(state.stageScale).toBe(2);
  });

  it("Shift + wheel pans sideways where there is something to pan, and is the page's where there is not", async () => {
    const { state, wheel, scroll, wrapper, settle } = await mountMap();
    expect(await wheel({ shiftKey: true, deltaY: 100, clientX: 400, clientY: 200 })).toBe(false);
    expect(state.currentLevel).toBe(2);
    // two steps up: wide enough to pan a few hundred px
    for (let i = 0; i < 2; i++) await wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram larger"]').trigger("click");
    await settle();
    scroll.left = 0;
    const left = scroll.left;
    expect(await wheel({ shiftKey: true, deltaY: 100, clientX: 400, clientY: 200 })).toBe(true);
    expect(scroll.left).toBe(left + 100);
    // a trackpad's sideways swipe with Shift sends deltaX
    expect(await wheel({ shiftKey: true, deltaX: -40, clientX: 400, clientY: 200 })).toBe(true);
    expect(scroll.left).toBe(left + 60);
    expect(state.currentLevel).toBe(2);
  });

  it("does not animate a zoom: the scale and the scroll are set in one frame (reduced motion or not)", async () => {
    const { wrapper, wheel } = await mountMap();
    const stage = wrapper.find(".tux-map__stage").element as HTMLElement;
    const animate = vi.fn();
    stage.animate = animate as unknown as typeof stage.animate;
    await wheel({ ctrlKey: true, deltaY: -100, clientX: 400, clientY: 200 });
    await wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram larger"]').trigger("click");
    expect(animate).not.toHaveBeenCalled();
  });
});

describe("TuxArchitectureMap: dragging the canvas (#271)", () => {
  it("a drag of the background pans, and the click that ends it is not a click", async () => {
    const { wrapper, state, scroll, send, settle } = await mountMap();
    await wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram larger"]').trigger("click");
    await settle();
    await wrapper.find('.tux-map__el[data-id="c-db"]').trigger("click");
    await settle();
    expect(state.selectedId).toBe("c-db");
    const stage = wrapper.find(".tux-map__stage").element;
    scroll.left = 0;
    scroll.top = 0;
    const start = { ...scroll };
    await send("pointerdown", stage, 400, 300);
    await send("pointermove", stage, 360, 280);
    await send("pointerup", stage, 360, 280);
    stage.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 }));
    expect([scroll.left, scroll.top]).toEqual([start.left + 40, start.top + 20]);
    // the drag kept the selection, and the click that ended it did not clear it
    expect(state.selectedId).toBe("c-db");
    await settle();
    // a short click on a card is still a click
    const card = wrapper.find('.tux-map__el[data-id="c-api"]').element;
    await send("pointerdown", card, 500, 300);
    await send("pointerup", card, 501, 300);
    await wrapper.find('.tux-map__el[data-id="c-api"]').trigger("click");
    expect(state.selectedId).toBe("c-api");
  });

  it("with Space held, a drag that starts on a card pans and does not choose the card", async () => {
    const { wrapper, state, vp, scroll, send, settle } = await mountMap();
    await wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram larger"]').trigger("click");
    await settle();
    vp.focus();
    const down = new window.KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true, cancelable: true });
    vp.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    await nextTick();
    expect(state.spaceHeld).toBe(true);
    expect(vp.classList.contains("tux-map__viewport--space-pan")).toBe(true);
    const cardEl = wrapper.find('.tux-map__el[data-id="c-api"]').element;
    scroll.left = 0;
    scroll.top = 0;
    const start = { ...scroll };
    await send("pointerdown", cardEl, 500, 300);
    await send("pointermove", cardEl, 470, 290);
    await send("pointerup", vp, 470, 290);
    cardEl.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 }));
    window.dispatchEvent(new window.KeyboardEvent("keyup", { key: " ", code: "Space" }));
    await settle();
    expect([scroll.left, scroll.top]).toEqual([start.left + 30, start.top + 10]);
    expect(state.selectedId).toBe(null);
    expect(state.spaceHeld).toBe(false);
  });
});

describe("TuxArchitectureMap: the canvas's keys (#271)", () => {
  it("+, − and 0 on the focused canvas magnify, shrink and fit it, − at Fit leaves the level; on a card + still opens the card", async () => {
    const { state, key, pct, wrapper } = await mountMap();
    expect(await key("+")).toBe(true);
    expect(state.isMagnified).toBe(true);
    const one = state.stageScale;
    expect(await key("=")).toBe(true);
    expect(state.stageScale).toBeGreaterThan(one);
    expect(await key("-")).toBe(true);
    expect(state.stageScale).toBe(one);
    expect(await key("0")).toBe(true);
    expect(state.isMagnified).toBe(false);
    expect(pct()).toBe("100%");
    expect(state.currentLevel).toBe(2);
    // at Fit there is nothing smaller: − on the canvas goes up a level, as it did
    await key("-");
    await nextTick();
    expect(state.currentLevel).toBe(1);
    await key("2");
    await nextTick();
    expect(state.currentLevel).toBe(2);
    // a key on a card is the card's: + goes into it, a level down
    await key("+", wrapper.find('.tux-map__el[data-id="c-api"]').element);
    await nextTick();
    expect(state.currentLevel).toBe(3);
  });

  it("the arrows pan a magnified canvas, and go into the cards when there is nothing to pan", async () => {
    const { state, key, scroll, wrapper, settle } = await mountMap();
    // fitted: the arrows move focus to a card, as before
    await key("ArrowRight");
    await settle();
    expect(document.activeElement?.classList.contains("tux-map__el")).toBe(true);
    for (let i = 0; i < 2; i++) await wrapper.find('.tux-map__zoomctl [aria-label="Make the diagram larger"]').trigger("click");
    await settle();
    scroll.left = 0;
    scroll.top = 0;
    const step = Math.max(40, Math.round(VP.width / 10));
    expect(await key("ArrowRight")).toBe(true);
    expect(scroll.left).toBe(step);
    expect(await key("ArrowDown")).toBe(true);
    expect(scroll.top).toBe(Math.max(40, Math.round(VP.height / 10)));
    expect(await key("ArrowLeft")).toBe(true);
    expect(scroll.left).toBe(0);
    expect(state.currentLevel).toBe(2);
  });
});
