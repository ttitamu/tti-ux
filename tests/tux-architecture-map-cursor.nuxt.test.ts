// @vitest-environment nuxt
/**
 * `cursor` (#208): a dot on the pointer and a disc that trails it over the canvas,
 * and comes to rest on the card the map's proximity has picked or on the control
 * under the pointer.
 *
 * It is decoration. Off by default; drawn only for a fine pointer with motion
 * allowed; not under the `wheelZoom="click"` veil; hidden from assistive
 * technology and from the pointer; and its frame loop stops when the disc is
 * where it is going.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
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
type Pointer = { fine: boolean; reduce: boolean };

/** matchMedia for a device: answers the queries the map asks, by their terms. */
function stubPointer(p: Pointer) {
  vi.stubGlobal("matchMedia", (q: string) => {
    const terms: [string, boolean][] = [
      ["(pointer: fine)", p.fine],
      ["(pointer: coarse)", !p.fine],
      ["(prefers-reduced-motion: no-preference)", !p.reduce],
      ["(prefers-reduced-motion: reduce)", p.reduce],
    ];
    const asked = terms.filter(([t]) => q.includes(t));
    return {
      matches: asked.length > 0 && asked.every(([, yes]) => yes),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    };
  });
}

/** requestAnimationFrame held in a queue the test runs one frame at a time, 1/60 s apart. */
function stubFrames() {
  let queue = new Map<number, FrameRequestCallback>();
  let id = 0;
  let now = 1000;
  const counts = { requested: 0, cancelled: 0, run: 0 };
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    counts.requested++;
    queue.set(++id, cb);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (h: number) => {
    if (queue.delete(h)) counts.cancelled++;
  });
  /** Runs one frame; false when nothing was waiting. */
  const step = () => {
    if (queue.size === 0) return false;
    const due = queue;
    queue = new Map();
    now += 1000 / 60;
    for (const cb of due.values()) {
      counts.run++;
      cb(now);
    }
    return true;
  };
  /** Runs frames until none is waiting; returns how many it took. */
  const settle = (max = 600) => {
    let n = 0;
    while (n < max && step()) n++;
    return n;
  };
  return { counts, step, settle, pending: () => queue.size };
}

/** `translate(Xpx,Ypx) scale(SX,SY)` as numbers. */
function readTransform(el: HTMLElement) {
  const m = /translate\(([-\d.e]+)px,\s*([-\d.e]+)px\)(?:\s*scale\(([-\d.e]+),\s*([-\d.e]+)\))?/.exec(el.style.transform);
  if (!m) throw new Error(`no transform on the element: "${el.style.transform}"`);
  return { x: Number(m[1]), y: Number(m[2]), sx: Number(m[3] ?? 1), sy: Number(m[4] ?? 1) };
}

describe("TuxArchitectureMap: the trailing cursor (#208)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function mountMap(props: Record<string, unknown> = {}) {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      // The overview of the level (#211) asks for frames of its own; these tests count the cursor's.
      props: { model, initialLevel: 2, minimap: false, ...props },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await nextTick();
    await nextTick();
    const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
    const viewport = wrapper.find(".tux-map__viewport").element as HTMLElement;
    const stage = wrapper.find(".tux-map__stage").element as HTMLElement;
    const cursor = () => wrapper.find(".tux-map__cursor");
    const dot = () => cursor().element.firstElementChild as HTMLElement;
    const disc = () => cursor().element.lastElementChild as HTMLElement;
    const shown = () => viewport.classList.contains("tux-map__viewport--cursor");
    const send = async (type: string, target: Element, x: number, y: number, init: { buttons?: number; pointerType?: string } = {}) => {
      const ev = new window.MouseEvent(type, {
        bubbles: type !== "pointerleave",
        cancelable: true,
        button: 0,
        buttons: init.buttons ?? 0,
        clientX: x,
        clientY: y,
      });
      Object.defineProperty(ev, "pointerId", { value: 7 });
      Object.defineProperty(ev, "pointerType", { value: init.pointerType ?? "mouse" });
      target.dispatchEvent(ev);
      await nextTick();
      return ev;
    };
    /** Where a card is inside the viewport, in px: its stage box through the stage's scale and pan. */
    const cardBox = (id: string) => {
      const r = state.stageData.rects[id] as { x: number; y: number; w: number; h: number };
      const s = state.stageScale as number;
      // in the viewport: the stage is drawn lower where a shorter level is centred (#261)
      return { x: r.x * s + (state.panX as number), y: (state.stageOffsetY as number) + r.y * s, w: r.w * s, h: r.h * s };
    };
    return { wrapper, state, viewport, stage, cursor, dot, disc, shown, send, cardBox };
  }

  it("off by default: nothing is rendered, and a pointer over the canvas starts no frame loop", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    for (const props of [{}, { cursor: false }]) {
      const { cursor, stage, send, shown } = await mountMap(props);
      const before = frames.counts.requested;
      await send("pointermove", stage, 700, 20);
      expect(cursor().exists()).toBe(false);
      expect(shown()).toBe(false);
      expect(frames.counts.requested).toBe(before);
    }
  });

  it("on: rendered inside the viewport, hidden from assistive technology, and takes no pointer event", async () => {
    stubPointer({ fine: true, reduce: false });
    stubFrames();
    const { cursor, viewport } = await mountMap({ cursor: true });
    expect(cursor().exists()).toBe(true);
    expect(cursor().element.parentElement).toBe(viewport);
    expect(cursor().attributes("aria-hidden")).toBe("true");
    expect(cursor().element.children.length).toBe(2);
    expect(cursor().element.querySelector("button, a, [tabindex]")).toBeNull();

    // the stylesheet's own rule: the test DOM does not apply a scoped style
    const sfc = readFileSync(join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"), "utf8");
    const rule = /\n\.tux-map__cursor \{([^}]*)\}/.exec(sfc)?.[1] ?? "";
    expect(rule).toMatch(/pointer-events:\s*none;/);
    expect(rule).toMatch(/mix-blend-mode:\s*difference;/);
    // not drawn, and the pointer's own cursor kept, until a pointer is over the canvas
    expect(rule).toMatch(/display:\s*none;/);
    expect(sfc).toMatch(/\n\.tux-map__viewport--cursor > \.tux-map__cursor \{\s*display:\s*block;\s*\}/);
    expect(sfc).toMatch(/\n\.tux-map__viewport--cursor \{\s*cursor:\s*none;\s*\}/);
  });

  it("a coarse pointer gets nothing", async () => {
    stubPointer({ fine: false, reduce: false });
    const frames = stubFrames();
    const { cursor, stage, send, shown } = await mountMap({ cursor: true });
    await send("pointermove", stage, 700, 20);
    expect(cursor().exists()).toBe(false);
    expect(shown()).toBe(false);
    expect(frames.counts.requested).toBe(0);
  });

  it("a touch on a device whose main pointer is fine does not bring the disc out", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { stage, send, shown } = await mountMap({ cursor: true });
    await send("pointermove", stage, 700, 20, { pointerType: "touch" });
    expect(shown()).toBe(false);
    expect(frames.counts.requested).toBe(0);
  });

  it("reduced motion gets nothing: the map's own frame on the card near the pointer is the still outline", async () => {
    stubPointer({ fine: true, reduce: true });
    const frames = stubFrames();
    const { wrapper, cursor, stage, send, shown, state, cardBox } = await mountMap({ cursor: true });
    const b = cardBox("c-a");
    await send("pointermove", stage, b.x + b.w / 2, b.y + b.h / 2);
    expect(cursor().exists()).toBe(false);
    expect(shown()).toBe(false);
    expect(frames.counts.requested).toBe(0);
    expect(state.proximityCard?.id).toBe("c-a");
    expect(wrapper.find(".tux-map__proximity-frame").exists()).toBe(true);
  });

  it('under the wheelZoom="click" veil it is not rendered; armed, it is', async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { wrapper, cursor, send, shown } = await mountMap({ cursor: true, wheelZoom: "click" });
    const veil = wrapper.find(".tux-map__wheel-veil");
    expect(veil.exists()).toBe(true);
    expect(cursor().exists()).toBe(false);
    await send("pointermove", veil.element, 700, 20);
    expect(shown()).toBe(false);
    expect(frames.counts.requested).toBe(0);

    await veil.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__wheel-veil").exists()).toBe(false);
    expect(cursor().exists()).toBe(true);
  });

  it("the dot is on the pointer at once; the disc trails it, arrives, and the frame loop stops", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { stage, viewport, send, shown, dot, disc } = await mountMap({ cursor: true });

    // it comes in where the pointer does: nothing to travel, so one frame and no more
    await send("pointermove", stage, 700, 20);
    expect(shown()).toBe(true);
    expect(readTransform(dot())).toMatchObject({ x: 700, y: 20 });
    expect(frames.settle()).toBe(1);
    expect(readTransform(disc())).toEqual({ x: 700, y: 20, sx: 1, sy: 1 });
    expect(disc().style.borderRadius).toBe("20px/20px");
    expect(disc().style.opacity).toBe("1");

    await send("pointermove", stage, 760, 30);
    expect(readTransform(dot())).toMatchObject({ x: 760, y: 30 });
    expect(readTransform(disc()).x).toBe(700); // not yet: it moves in frames
    frames.step();
    const first = readTransform(disc()).x;
    expect(first).toBeGreaterThan(700);
    expect(first).toBeLessThan(760);
    let prev = first;
    let n = 1;
    while (frames.step()) {
      const x = readTransform(disc()).x;
      expect(x).toBeGreaterThanOrEqual(prev); // towards the pointer, never back
      expect(x).toBeLessThanOrEqual(760); // and never past it
      prev = x;
      n++;
    }
    expect(readTransform(disc())).toEqual({ x: 760, y: 30, sx: 1, sy: 1 });
    expect(n).toBeGreaterThan(5);
    expect(n).toBeLessThan(60); // at rest inside a second

    // at rest: no frame waiting, and time passing asks for none
    const asked = frames.counts.requested;
    expect(frames.pending()).toBe(0);
    expect(frames.settle()).toBe(0);
    expect(frames.counts.requested).toBe(asked);

    // many moves inside one frame ask for one frame
    await send("pointermove", stage, 770, 30);
    await send("pointermove", stage, 780, 30);
    await send("pointermove", stage, 790, 30);
    expect(frames.pending()).toBe(1);

    // the pointer leaves mid-flight: the waiting frame is cancelled and the disc is put away
    const cancelled = frames.counts.cancelled;
    await send("pointerleave", viewport, 900, 30);
    expect(shown()).toBe(false);
    expect(frames.counts.cancelled).toBe(cancelled + 1);
    expect(frames.pending()).toBe(0);
  });

  it("near a card the disc comes to rest on the card's box and 6 px around it; away from it, it is a disc again", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { stage, send, disc, dot, state, cardBox } = await mountMap({ cursor: true });
    const b = cardBox("c-a");
    expect(b.w).toBeGreaterThan(40);

    await send("pointermove", stage, 700, 20);
    frames.settle();
    // 10 px inside the card's corner: the proximity the map already computes picks the card
    await send("pointermove", stage, b.x + 10, b.y + 10);
    expect(state.proximityCard?.id).toBe("c-a");
    expect(readTransform(dot())).toMatchObject({ x: b.x + 10, y: b.y + 10 });
    expect(frames.settle()).toBeGreaterThan(5);
    const at = readTransform(disc());
    expect(at.x).toBeCloseTo(b.x + b.w / 2, 6);
    expect(at.y).toBeCloseTo(b.y + b.h / 2, 6);
    expect(at.sx * 40).toBeCloseTo(b.w + 12, 6);
    expect(at.sy * 40).toBeCloseTo(b.h + 12, 6);
    // a 13 px corner as drawn: the radius is divided by the scale on each axis
    const [rx, ry] = disc().style.borderRadius.split("/").map((v) => Number.parseFloat(v));
    expect(rx! * at.sx).toBeCloseTo(13, 6);
    expect(ry! * at.sy).toBeCloseTo(13, 6);
    // on the card it is a wash, so the card keeps its own colours under it
    expect(Number(disc().style.opacity)).toBeLessThanOrEqual(0.25);
    expect(Number(disc().style.opacity)).toBeGreaterThan(0);

    // the map drops the card (a change of level does) with the pointer still: the disc goes back to it
    state.proximityCard = null;
    await nextTick();
    expect(frames.settle()).toBeGreaterThan(5);
    expect(readTransform(disc())).toEqual({ x: b.x + 10, y: b.y + 10, sx: 1, sy: 1 });
    expect(disc().style.opacity).toBe("1");
    expect(frames.pending()).toBe(0);
  });

  it("a scroll under a still pointer keeps the dot on the pointer", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { viewport, stage, send, dot, disc } = await mountMap({ cursor: true });
    const scroll = { left: 0, top: 0 };
    Object.defineProperty(viewport, "scrollLeft", { get: () => scroll.left, configurable: true });
    Object.defineProperty(viewport, "scrollTop", { get: () => scroll.top, configurable: true });
    await send("pointermove", stage, 700, 20);
    frames.settle();
    scroll.left = 120;
    scroll.top = 40;
    viewport.dispatchEvent(new window.Event("scroll"));
    await nextTick();
    // the cursor is placed in the scrolled content, so the same place in the window is further in
    expect(readTransform(dot())).toMatchObject({ x: 820, y: 60 });
    frames.settle();
    expect(readTransform(disc())).toMatchObject({ x: 820, y: 60 });

    // and a scroll with no pointer over the canvas starts nothing
    await send("pointerleave", viewport, 900, 30);
    const asked = frames.counts.requested;
    viewport.dispatchEvent(new window.Event("scroll"));
    await nextTick();
    expect(frames.counts.requested).toBe(asked);
  });

  it("over a control inside the canvas the disc rests on the control's box and 4 px around it", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { viewport, stage, send, disc } = await mountMap({ cursor: true });
    const control = document.createElement("button");
    stage.appendChild(control);
    control.getBoundingClientRect = () => ({ left: 300, top: 200, width: 24, height: 20 }) as DOMRect;

    await send("pointermove", stage, 700, 20);
    frames.settle();
    await send("pointermove", control, 310, 210);
    frames.settle();
    const vr = viewport.getBoundingClientRect();
    const at = readTransform(disc());
    expect(at.x).toBeCloseTo(312 - vr.left - viewport.clientLeft, 6);
    expect(at.y).toBeCloseTo(210 - vr.top - viewport.clientTop, 6);
    expect(at.sx * 40).toBeCloseTo(32, 6);
    expect(at.sy * 40).toBeCloseTo(28, 6);
    control.remove();
  });

  it("while the background is dragged the disc is small and on the pointer, with no trailing", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { wrapper, viewport, stage, send, disc, state } = await mountMap({ cursor: true });
    await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await nextTick();
    viewport.setPointerCapture = (() => {}) as typeof viewport.setPointerCapture;
    viewport.releasePointerCapture = (() => {}) as typeof viewport.releasePointerCapture;
    // the test DOM scrolls nothing: hold what the component sets, and stop at the edge as a browser does
    const scroll = { left: 10, top: 10 };
    Object.defineProperty(viewport, "scrollLeft", { get: () => scroll.left, set: (v: number) => void (scroll.left = Math.max(0, v)), configurable: true });
    Object.defineProperty(viewport, "scrollTop", { get: () => scroll.top, set: (v: number) => void (scroll.top = Math.max(0, v)), configurable: true });

    await send("pointermove", stage, 700, 20);
    frames.settle();
    // the disc is placed in the scrolled content: 10 px further in than the pointer is in the window
    expect(readTransform(disc())).toMatchObject({ x: 710, y: 30 });
    await send("pointerdown", stage, 700, 20, { buttons: 1 });
    // the drag reaches the edge after 10 px, so the pointer travels on over the content
    await send("pointermove", stage, 760, 60, { buttons: 1 });
    expect(state.isDraggingStage).toBe(true);
    expect(scroll).toEqual({ left: 0, top: 0 });
    frames.step();
    // on the pointer after one frame, where a trailing disc would be part of the way
    expect(readTransform(disc())).toMatchObject({ x: 760, y: 60 });
    frames.settle();
    expect(readTransform(disc())).toEqual({ x: 760, y: 60, sx: 0.3, sy: 0.3 });
    await send("pointerup", stage, 760, 60);
  });

  it("unmounting mid-flight cancels the frame it was waiting for", async () => {
    stubPointer({ fine: true, reduce: false });
    const frames = stubFrames();
    const { wrapper, stage, send } = await mountMap({ cursor: true });
    await send("pointermove", stage, 700, 20);
    frames.settle();
    await send("pointermove", stage, 900, 200);
    expect(frames.pending()).toBe(1);
    mounted.splice(mounted.indexOf(wrapper), 1);
    wrapper.unmount();
    expect(frames.pending()).toBe(0);
  });
});
