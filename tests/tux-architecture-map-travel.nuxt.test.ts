// @vitest-environment nuxt
/**
 * The camera's travel in the mounted map (#212): a zoom into a card grows the
 * level out of the card's rectangle and a zoom out shrinks it back, a move to
 * another card on the level follows the wire between them and ends with the
 * card clear of the details panel, a jump to a level is a short fade, a second
 * input ends a travel on its target, and reduced motion plays none of it.
 *
 * The test DOM has no Web Animations and lays nothing out. `animate` and the
 * animation frames are recorded, and what the component asks of them is the
 * assertion; the rectangles are the stage's own (`stageData.rects`), which is
 * what the component reads. The curve itself was sampled in a browser.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";
import {
  TRAVEL_EASING,
  TRAVEL_FADE_MS,
  travelDuration,
  wirePolyline,
} from "../packages/diagrams/app/utils/internal/tuxArchitectureMapTravel";

type SetupState = Record<string, any>;
type Rect = { x: number; y: number; w: number; h: number };
type Recorded = {
  el: Element;
  frames: Record<string, unknown>[];
  options: KeyframeAnimationOptions;
  cancelled: boolean;
};

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
const undo: (() => void)[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
  for (const fn of undo.splice(0).reverse()) fn();
  vi.unstubAllGlobals();
});

async function settle() {
  for (let i = 0; i < 6; i++) await nextTick();
}

async function mountMap(props: Record<string, unknown> = {}) {
  const wrapper = await mountSuspended(TuxArchitectureMap, {
    props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await settle();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  const root = wrapper.find(".tux-map").element as HTMLElement;
  const stage = wrapper.find(".tux-map__stage").element as HTMLElement;
  const vp = wrapper.find(".tux-map__viewport").element as HTMLElement;
  const pill = () => wrapper.find(".tux-map__zoom-hud");
  return { wrapper, state, root, stage, vp, pill };
}

/** Record what the component asks of Web Animations, and whether it took each one back. */
function recordAnimations() {
  const calls: Recorded[] = [];
  const proto = window.HTMLElement.prototype as unknown as Record<string, unknown>;
  const had = Object.prototype.hasOwnProperty.call(proto, "animate");
  const prev = proto.animate;
  proto.animate = function (this: Element, frames: Record<string, unknown>[], options: KeyframeAnimationOptions) {
    const call: Recorded = { el: this, frames, options, cancelled: false };
    calls.push(call);
    return {
      cancel() {
        call.cancelled = true;
      },
      onfinish: null,
    };
  };
  undo.push(() => {
    if (had) proto.animate = prev;
    else delete proto.animate;
  });
  return calls;
}

function reducedMotion() {
  const orig = window.matchMedia;
  window.matchMedia = ((q: string) =>
    ({
      matches: /prefers-reduced-motion:\s*reduce/.test(q),
      media: q,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
  undo.push(() => {
    window.matchMedia = orig;
  });
}

/** Animation frames the test runs by hand, on a clock it moves. */
function frames() {
  let t = 1000;
  let next = 1;
  const queue = new Map<number, () => void>();
  vi.stubGlobal("requestAnimationFrame", (cb: () => void) => (queue.set(next, cb), next++));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => void queue.delete(id));
  const spy = vi.spyOn(performance, "now").mockImplementation(() => t);
  undo.push(() => spy.mockRestore());
  return {
    pending: () => queue.size,
    run(ms: number) {
      t += ms;
      const [id, cb] = [...queue][0] ?? [];
      if (id === undefined) return false;
      queue.delete(id);
      cb!();
      return true;
    },
  };
}

/** `translate3d(x, y, 0) scale(k)` as numbers. */
function transformOf(frame: Record<string, unknown>) {
  const m = String(frame.transform).match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px, 0\) scale\((-?[\d.]+)\)/);
  if (!m) throw new Error(`not a stage transform: ${String(frame.transform)}`);
  return { x: Number(m[1]), y: Number(m[2]), k: Number(m[3]) };
}

/** Where a rectangle of the stage is on screen under a stage transform. */
const onScreen = (r: Rect, t: { x: number; y: number; k: number }): Rect => ({
  x: t.x + r.x * t.k,
  y: t.y + r.y * t.k,
  w: r.w * t.k,
  h: r.h * t.k,
});

/** A stage transform as drawn: the stage's own top is where a shorter level is centred (#261). */
const drawn = (t: { x: number; y: number; k: number }, top: number) => ({ ...t, y: t.y + top });

const centre = (r: Rect) => [r.x + r.w / 2, r.y + r.h / 2] as const;

const stageCalls = (calls: Recorded[], stage: Element) => calls.filter((c) => c.el === stage);

const key = (el: Element, k: string) =>
  el.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));

describe("TuxArchitectureMap: a zoom into a card grows the level out of it (#212)", () => {
  it("starts with the level's frame inside the card's rectangle, and ends where the level is", async () => {
    const { state, stage, pill } = await mountMap();
    const card = onScreen(state.stageData.rects["c-api"], { x: state.panX, y: state.stageOffsetY, k: state.stageScale });
    const calls = recordAnimations();
    state.zoomIntoElement("c-api");
    await settle();
    expect(state.currentLevel).toBe(3);

    const [travel, ...rest] = stageCalls(calls, stage);
    expect(rest).toEqual([]);
    const frame = state.stageData.bounds[0] as Rect;
    const from = onScreen(frame, drawn(transformOf(travel!.frames[0]!), state.stageOffsetY));
    // inside the card, centred on it, and as large as fits: one axis touches
    expect(centre(from)[0]).toBeCloseTo(centre(card)[0], 0);
    expect(centre(from)[1]).toBeCloseTo(centre(card)[1], 0);
    expect(from.w).toBeLessThanOrEqual(card.w + 0.5);
    expect(from.h).toBeLessThanOrEqual(card.h + 0.5);
    expect(Math.min(card.w - from.w, card.h - from.h)).toBeLessThan(0.5);
    // it ends on the transform the stage has, so nothing moves when the animation lets go
    expect(travel!.frames[1]!.transform).toBe(`translate3d(${state.panX}px, 0px, 0) scale(${state.stageScale})`);
    expect(stage.style.transform).toBe(travel!.frames[1]!.transform);
    expect(travel!.frames.map((f) => Object.keys(f))).toEqual([["transform"], ["transform"]]);

    // one curve, and a duration by how far the frame's furthest corner goes
    expect(travel!.options.easing).toBe(TRAVEL_EASING);
    const to = onScreen(frame, { x: state.panX, y: state.stageOffsetY, k: state.stageScale });
    const far = Math.max(
      ...[0, 1].flatMap((i) =>
        [0, 1].map((j) => Math.hypot(to.x + i * to.w - (from.x + i * from.w), to.y + j * to.h - (from.y + j * from.h))),
      ),
    );
    expect(travel!.options.duration).toBeGreaterThanOrEqual(travelDuration(far) - 2);
    expect(travel!.options.duration).toBeLessThanOrEqual(travelDuration(far) + 2);
    expect(travel!.options.duration).toBeLessThanOrEqual(600);
    expect(pill().text()).toContain("Level 2 → Level 3");
  });

  it("fades in what is inside the frame as it arrives, and never the frame", async () => {
    const { state, stage } = await mountMap();
    const calls = recordAnimations();
    state.zoomIntoElement("c-api");
    await settle();
    const travel = stageCalls(calls, stage)[0]!;
    const fades = calls.filter((c) => c.el !== stage);
    const cards = [...stage.querySelectorAll<HTMLElement>(".tux-map__el")];
    expect(cards.length).toBeGreaterThan(0);
    expect(fades.filter((c) => c.el.classList.contains("tux-map__el")).map((c) => c.el)).toEqual(cards);
    expect(fades.some((c) => c.el.classList.contains("tux-map__bound"))).toBe(false);
    for (const f of fades) {
      expect(f.el.parentElement).toBe(stage);
      expect(f.frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
      expect(f.options.duration).toBe(TRAVEL_FADE_MS);
      // over the last 120ms of the travel, and held back until then
      expect(f.options.delay).toBe(Number(travel.options.duration) - TRAVEL_FADE_MS);
      expect(f.options.fill).toBe("backwards");
      expect(f.options.easing).toBe(TRAVEL_EASING);
    }
  });

  it("shrinks the level back into the card it came from on the way out", async () => {
    const { state, stage, pill } = await mountMap({ initialLevel: 3, initialFocus: "c-api" });
    const frame = onScreen(state.stageData.bounds[0], { x: state.panX, y: state.stageOffsetY, k: state.stageScale });
    const calls = recordAnimations();
    state.zoomOutLevel();
    await settle();
    expect(state.currentLevel).toBe(2);

    // the stage alone: nothing fades on the way out, the card is what the level shrinks into
    expect(calls.map((c) => c.el)).toEqual([stage]);
    const travel = calls[0]!;
    const card = state.stageData.rects["c-api"] as Rect;
    const from = onScreen(card, drawn(transformOf(travel.frames[0]!), state.stageOffsetY));
    expect(centre(from)[0]).toBeCloseTo(centre(frame)[0], 0);
    expect(centre(from)[1]).toBeCloseTo(centre(frame)[1], 0);
    expect(from.w).toBeLessThanOrEqual(frame.w + 0.5);
    expect(from.h).toBeLessThanOrEqual(frame.h + 0.5);
    expect(from.w).toBeGreaterThan(card.w * state.stageScale);
    expect(travel.frames[1]!.transform).toBe(stage.style.transform);
    expect(travel.options.easing).toBe(TRAVEL_EASING);
    expect(travel.options.duration).toBeLessThanOrEqual(600);
    expect(pill().text()).toContain("Level 3 → Level 2");
    // the card it came from is in the view it ends on
    const end = onScreen(card, { x: state.panX, y: 0, k: state.stageScale });
    expect(end.x).toBeGreaterThanOrEqual(0);
    expect(end.x + end.w).toBeLessThanOrEqual(state.viewportWidth);
  });

  it("keeps focus in the map after the zoom, on a card of the level it lands on", async () => {
    const { wrapper, state, root } = await mountMap();
    recordAnimations();
    (wrapper.find('.tux-map__el[data-id="c-api"]').element as HTMLElement).focus();
    state.zoomIntoElement("c-api");
    await settle();
    expect(root.contains(document.activeElement)).toBe(true);
    expect((document.activeElement as HTMLElement).classList.contains("tux-map__el")).toBe(true);
  });
});

describe("TuxArchitectureMap: a second input ends the travel on its target (#212)", () => {
  async function zoomed() {
    const m = await mountMap();
    const calls = recordAnimations();
    m.state.zoomIntoElement("c-api");
    await settle();
    expect(calls.length).toBeGreaterThan(1);
    expect(calls.some((c) => c.cancelled)).toBe(false);
    expect(m.pill().exists()).toBe(true);
    return { ...m, calls };
  }

  async function landed(m: Awaited<ReturnType<typeof zoomed>>) {
    await nextTick();
    // every animation is taken back: the stage is on its own transform and the cards on their own opacity
    expect(m.calls.filter((c) => !c.cancelled)).toEqual([]);
    expect(m.state.currentLevel).toBe(3);
    expect(m.state.focusId).toBe("c-api");
    expect(m.stage.style.transform).toBe(`translate3d(${m.state.panX}px, 0px, 0) scale(${m.state.stageScale})`);
    expect(m.pill().exists()).toBe(false);
  }

  it("a key", async () => {
    const m = await zoomed();
    key(m.root, "Shift");
    await landed(m);
  });

  it("a press of the pointer", async () => {
    const m = await zoomed();
    m.stage.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, button: 0, buttons: 1 }));
    await landed(m);
  });

  it("a click", async () => {
    const m = await zoomed();
    m.wrapper.find(".tux-map__level-text").element.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await landed(m);
  });

  it("the wheel, once the turn that changed the level is over", async () => {
    const m = await mountMap();
    const calls = recordAnimations();
    const card = () => m.wrapper.find(".tux-map__el").element;
    const turn = (el: Element) =>
      el.dispatchEvent(new WheelEvent("wheel", { deltaY: -30, clientX: 40, clientY: 40, bubbles: true, cancelable: true }));
    const clock = vi.spyOn(Date, "now");
    undo.push(() => clock.mockRestore());
    clock.mockReturnValue(50_000);
    turn(m.wrapper.find('.tux-map__el[data-id="c-api"]').element);
    await settle();
    expect(m.state.currentLevel).toBe(3);
    expect(calls.length).toBeGreaterThan(1);
    // the rest of the same turn of the wheel (a trackpad's inertia) is not a second input
    clock.mockReturnValue(50_300);
    turn(card());
    await nextTick();
    expect(calls.some((c) => c.cancelled)).toBe(false);
    expect(m.pill().exists()).toBe(true);
    // a turn after it is (sideways, so it asks for no level of its own)
    clock.mockReturnValue(50_530);
    m.vp.dispatchEvent(new WheelEvent("wheel", { deltaX: 30, deltaY: 0, clientX: 40, clientY: 40, bubbles: true, cancelable: true }));
    await nextTick();
    expect(calls.filter((c) => !c.cancelled)).toEqual([]);
    expect(m.pill().exists()).toBe(false);
    expect(m.state.currentLevel).toBe(3);
  });

  it("a second zoom takes the first one's animations back before it starts its own", async () => {
    const m = await zoomed();
    const first = [...m.calls];
    m.state.zoomOutLevel();
    await settle();
    expect(first.filter((c) => !c.cancelled)).toEqual([]);
    const second = m.calls.slice(first.length);
    expect(second.map((c) => c.el)).toEqual([m.stage]);
    expect(second[0]!.cancelled).toBe(false);
    expect(m.state.currentLevel).toBe(2);
  });
});

describe("TuxArchitectureMap: reduced motion plays no travel (#212)", () => {
  it("goes straight to the level on a zoom in and a zoom out, with the pill as a confirmation", async () => {
    reducedMotion();
    const { state, stage, pill } = await mountMap();
    const calls = recordAnimations();
    state.zoomIntoElement("c-api");
    await settle();
    expect(state.currentLevel).toBe(3);
    expect(calls).toEqual([]);
    expect(stage.style.transform).toBe(`translate3d(${state.panX}px, 0px, 0) scale(${state.stageScale})`);
    expect(pill().text()).toContain("Level 2 → Level 3");
    state.zoomOutLevel();
    await settle();
    expect(state.currentLevel).toBe(2);
    expect(calls).toEqual([]);
  });

  it("moves the stage clear of the panel at once, and scrolls a magnified diagram at once", async () => {
    reducedMotion();
    const m = await mountMap();
    const calls = recordAnimations();
    const f = frames();
    overlayPanel(m, 700);
    const id = farRightCard(m.state);
    m.state.selectElement(id);
    await settle();
    expect(m.state.panX).toBeLessThan(0);
    expect(calls).toEqual([]);

    const scroll = magnify(m, 300);
    await m.wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await settle();
    scroll.left = 0;
    scroll.top = 0;
    m.state.selectElement(null);
    await settle();
    m.state.selectElement(id);
    await settle();
    expect(f.pending()).toBe(0);
    expect(scroll.left).toBeGreaterThan(0);
    expect(calls).toEqual([]);
  });
});

/** The details panel over the map, as it is on a wide one, and a viewport `width` wide. */
function overlayPanel(m: Awaited<ReturnType<typeof mountMap>>, width: number) {
  (m.wrapper.find(".tux-map__panel").element as HTMLElement).style.position = "absolute";
  Object.defineProperty(m.vp, "clientWidth", { value: width, configurable: true });
  m.state.measureViewport();
  expect(m.state.panelFollowsMap()).toBe(false);
  expect(m.state.viewportWidth).toBe(width);
}

/** The test DOM scrolls nothing: hold what the component sets, and give the viewport a height. */
function magnify(m: Awaited<ReturnType<typeof mountMap>>, height: number) {
  const scroll = { left: 0, top: 0, sets: [] as [number, number][] };
  Object.defineProperty(m.vp, "scrollLeft", {
    get: () => scroll.left,
    set: (v: number) => void (scroll.left = v),
    configurable: true,
  });
  Object.defineProperty(m.vp, "scrollTop", {
    get: () => scroll.top,
    set: (v: number) => {
      scroll.top = v;
      scroll.sets.push([scroll.left, v]);
    },
    configurable: true,
  });
  Object.defineProperty(m.vp, "clientHeight", { value: height, configurable: true });
  return scroll;
}

/** The card of the level whose right edge is furthest right (`own`: of the level's own cards, not one from outside). */
function farRightCard(state: SetupState, own = false): string {
  const rects = state.stageData.rects as Record<string, Rect>;
  const outside = new Set(
    (state.activeModel.level2.elements as { id: string; ref?: unknown }[]).filter((e) => e.ref).map((e) => e.id),
  );
  return (state.stageData.els as { id: string }[])
    .map((e) => e.id)
    .filter((id) => !own || !outside.has(id))
    .sort((a, b) => rects[b]!.x + rects[b]!.w - (rects[a]!.x + rects[a]!.w))[0]!;
}

/** The room the details panel leaves: the test DOM gives it no width, so the component takes 380. */
const freeWidth = (state: SetupState) => state.viewportWidth - 380 - 36;

describe("TuxArchitectureMap: a move to another card on the level (#212)", () => {
  it("fitted, slides the stage from where it was to where the card is clear of the panel, by the one rule", async () => {
    const m = await mountMap();
    overlayPanel(m, 900);
    const calls = recordAnimations();
    const id = farRightCard(m.state);
    const scale = m.state.stageScale;
    const r = m.state.stageData.rects[id] as Rect;
    expect((r.x + r.w) * scale).toBeGreaterThan(freeWidth(m.state));

    m.state.selectElement(id);
    await settle();
    const pan = m.state.panX as number;
    // clear of the panel by 24 and no further, or as far as the stage's own right edge allows (#205)
    const free = freeWidth(m.state);
    const most = m.state.stageData.width * scale - free;
    expect(pan).toBe(Math.max(-most, Math.round(free - (r.x + r.w) * scale - 24)));
    expect(pan).toBeLessThan(0);
    expect((r.x + r.w) * scale + pan).toBeLessThanOrEqual(free);
    const [slide, ...rest] = calls;
    expect(rest).toEqual([]);
    expect(slide!.el).toBe(m.stage);
    expect(slide!.frames).toEqual([
      { transform: `translate3d(0px, 0px, 0) scale(${scale})` },
      { transform: `translate3d(${pan}px, 0px, 0) scale(${scale})` },
    ]);
    expect(slide!.options).toEqual({ duration: travelDuration(Math.abs(pan)), easing: TRAVEL_EASING });
    expect(m.stage.style.transform).toBe(slide!.frames[1]!.transform);

    // a card that is already clear moves nothing
    const clear = (m.state.stageData.els as { id: string }[])
      .map((e) => e.id)
      .find((x) => {
        const c = m.state.stageData.rects[x] as Rect;
        return c.x * scale + pan >= 12 && (c.x + c.w) * scale + pan <= freeWidth(m.state) - 24;
      })!;
    m.state.selectElement(clear);
    await settle();
    expect(m.state.panX).toBe(pan);
    expect(calls).toHaveLength(1);
    // a second input ends the slide where it was going
    key(m.root, "Shift");
    expect(slide!.cancelled).toBe(true);
    expect(m.state.panX).toBe(pan);
  });

  async function magnified() {
    const m = await mountMap();
    overlayPanel(m, 700);
    const scroll = magnify(m, 300);
    await m.wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await settle();
    expect(m.state.isMagnified).toBe(true);
    // a wire with a bend in it, and the card at the end of it that is further right
    const wires = m.state.routedSvg.wires as { from: string; to: string; d: string }[];
    const rects = m.state.stageData.rects as Record<string, Rect>;
    const wire = wires
      .filter((w) => wirePolyline(w.d).length > 2 && rects[w.from] && rects[w.to])
      .sort((a, b) => Math.abs(rects[b.from]!.y - rects[b.to]!.y) - Math.abs(rects[a.from]!.y - rects[a.to]!.y))[0]!;
    expect(wire).toBeTruthy();
    const [from, to] = rects[wire.from]!.x < rects[wire.to]!.x ? [wire.from, wire.to] : [wire.to, wire.from];
    return { ...m, scroll, wire, from, to, rects, scale: m.state.stageScale as number };
  }

  /** Whether `r` is in sight and clear of the panel at this scroll. */
  function clearAt(m: Awaited<ReturnType<typeof magnified>>, id: string) {
    const r = m.rects[id]!;
    const left = r.x * m.scale - m.scroll.left;
    const right = (r.x + r.w) * m.scale - m.scroll.left;
    const top = r.y * m.scale - m.scroll.top;
    const bottom = (r.y + r.h) * m.scale - m.scroll.top;
    return { left, right, top, bottom };
  }

  it("magnified, scrolls the viewport frame by frame and ends with the card clear of the panel, and no further", async () => {
    const m = await magnified();
    const f = frames();
    m.state.selectElement(m.from);
    await settle();
    while (f.run(700)) await nextTick();
    const start = { left: m.scroll.left, top: m.scroll.top };
    m.scroll.sets.length = 0;

    // the link in the details panel: "Uses" and "Used by" choose the card at the other end
    const link = m.wrapper
      .findAll(".tux-map__panel button")
      .find((b) => b.text().includes(m.state.byId[m.to].name) && !b.classes().includes("tux-map__panel-btn"));
    expect(link, "a link to the neighbour in the panel").toBeTruthy();
    await link!.trigger("click");
    await settle();
    expect(m.state.selectedId).toBe(m.to);
    // nothing has moved yet: the travel is played on animation frames
    expect(m.scroll.sets).toEqual([]);
    expect(f.pending()).toBe(1);

    const seen: [number, number][] = [];
    let ran = 0;
    while (f.run(16)) {
      ran++;
      seen.push([m.scroll.left, m.scroll.top]);
      if (ran > 100) throw new Error("the travel never ends");
    }
    const end = seen[seen.length - 1]!;
    const dist = Math.hypot(end[0] - start.left, end[1] - start.top);
    expect(dist).toBeGreaterThan(0);
    // as long as the rule says, in 16ms frames, the first of which starts the clock
    expect(ran).toBe(Math.ceil(travelDuration(dist) / 16) + 1);
    // ease-out: the first frame covers more ground than the last
    const stepLen = (i: number) => Math.hypot(seen[i]![0] - seen[i - 1]![0], seen[i]![1] - seen[i - 1]![1]);
    expect(stepLen(1)).toBeGreaterThan(stepLen(seen.length - 1));

    const at = clearAt(m, m.to);
    const free = freeWidth(m.state);
    expect(at.left).toBeGreaterThanOrEqual(12);
    expect(at.right).toBeLessThanOrEqual(free - 24);
    expect(at.top).toBeGreaterThanOrEqual(12);
    expect(at.bottom).toBeLessThanOrEqual(300 - 12);
    // no further than needed: on each axis it stayed, or it stopped at the edge it had to clear
    const tight = (v: number, edge: number) => Math.abs(v - edge) < 1;
    expect(end[0] === start.left || tight(at.right, free - 24) || tight(at.left, 12)).toBe(true);
    expect(end[1] === start.top || tight(at.bottom, 300 - 12) || tight(at.top, 12)).toBe(true);
    expect(Number.isInteger(end[0]) && Number.isInteger(end[1])).toBe(true);
  });

  it("follows the wire between the two cards: the view leaves the straight line where the wire bends", async () => {
    const m = await magnified();
    const f = frames();
    m.state.selectElement(m.from);
    await settle();
    while (f.run(700)) await nextTick();
    const start: [number, number] = [m.scroll.left, m.scroll.top];
    m.state.selectElement(m.to);
    await settle();
    const seen: [number, number][] = [];
    while (f.run(16)) seen.push([m.scroll.left, m.scroll.top]);
    const end = seen[seen.length - 1]!;
    const len = Math.hypot(end[0] - start[0], end[1] - start[1]);
    expect(len).toBeGreaterThan(0);
    // distance of each sample from the chord between where the view was and where it ends
    const off = seen.map(([x, y]) => Math.abs((x - start[0]) * (end[1] - start[1]) - (y - start[1]) * (end[0] - start[0])) / len);
    expect(Math.max(...off)).toBeGreaterThan(2);
    expect(off[off.length - 1]).toBe(0);

    // back along the same wire, the other way round: with no wire between them it is the chord
    m.state.selectElement(null);
    await settle();
    const unwired = (m.state.stageData.els as { id: string }[])
      .map((e) => e.id)
      .find((id) => !m.state.routedSvg.wires.some((w: { from: string; to: string }) => [w.from, w.to].includes(id) && [w.from, w.to].includes(m.to)) && id !== m.to);
    if (unwired) {
      m.scroll.left = 0;
      m.scroll.top = 0;
      m.state.keepClear(m.to, unwired);
      const line: [number, number][] = [];
      while (f.run(16)) line.push([m.scroll.left, m.scroll.top]);
      const last = line[line.length - 1]!;
      const l = Math.hypot(last[0], last[1]);
      for (const [x, y] of line) expect(Math.abs(x * last[1] - y * last[0]) / l).toBeLessThan(1e-6);
    }
  });

  it("a second input ends the scroll on its target, and no frame moves it after", async () => {
    const m = await magnified();
    const f = frames();
    // the + button keeps the middle of the view (#271): both runs start from the corner
    m.scroll.left = 0;
    m.scroll.top = 0;
    // where it ends when it is left to run
    m.state.selectElement(m.to);
    await settle();
    while (f.run(16));
    const target = [m.scroll.left, m.scroll.top];
    m.state.selectElement(null);
    await settle();
    m.scroll.left = 0;
    m.scroll.top = 0;

    m.state.selectElement(m.to);
    await settle();
    f.run(16);
    f.run(16);
    f.run(16);
    expect([m.scroll.left, m.scroll.top]).not.toEqual(target);
    expect(m.scroll.left + m.scroll.top).toBeGreaterThan(0);
    expect(f.pending()).toBe(1);
    key(m.root, "ArrowDown");
    expect([m.scroll.left, m.scroll.top]).toEqual(target);
    expect(f.pending()).toBe(0);
    expect(f.run(16)).toBe(false);
    expect(m.state.selectedId).toBe(m.to);
  });

  it("travels to a traced card that is on the level, from the selection", async () => {
    const m = await magnified();
    const f = frames();
    m.state.selectElement(m.from);
    await settle();
    while (f.run(700));
    const start = [m.scroll.left, m.scroll.top];
    m.state.setTraceTarget(m.to);
    await settle();
    expect(m.state.selectedId).toBe(m.from);
    expect(f.pending()).toBe(1);
    while (f.run(16));
    expect([m.scroll.left, m.scroll.top]).not.toEqual(start);
    const at = clearAt(m, m.to);
    expect(at.right).toBeLessThanOrEqual(freeWidth(m.state) - 24);
    expect(at.left).toBeGreaterThanOrEqual(12);
    // a target that is not a card of this level moves nothing
    const before = [m.scroll.left, m.scroll.top];
    m.state.setTraceTarget("c-api/not-here");
    await settle();
    expect(f.pending()).toBe(0);
    expect([m.scroll.left, m.scroll.top]).toEqual(before);
  });
});

describe("TuxArchitectureMap: Go to, by where the result is (#212)", () => {
  const entry = (id: string, name: string) => ({ id, name, revealId: id });

  it("on this level, chooses the card and plays no change of level: no pill, no fade", async () => {
    const m = await mountMap();
    overlayPanel(m, 900);
    const calls = recordAnimations();
    const id = farRightCard(m.state, true);
    m.state.jumpToSearchEntry(entry(id, m.state.byId[id].name));
    await settle();
    expect(m.state.currentLevel).toBe(2);
    expect(m.state.selectedId).toBe(id);
    expect(m.pill().exists()).toBe(false);
    // the one animation is the slide that clears the panel, the same as a click on the card
    expect(calls).toHaveLength(1);
    expect(calls[0]!.frames.every((fr) => "transform" in fr && !("opacity" in fr))).toBe(true);
    expect(String(calls[0]!.frames[0]!.transform)).toContain(`scale(${m.state.stageScale})`);
  });

  it("on another level, draws that level with the short fade and its pill: no travel", async () => {
    const m = await mountMap({ initialLevel: 3, initialFocus: "c-api" });
    const calls = recordAnimations();
    const id = "c-db";
    m.state.jumpToSearchEntry(entry(id, m.state.byId[id].name));
    await settle();
    expect(m.state.currentLevel).toBe(2);
    expect(m.state.selectedId).toBe(id);
    const onStage = stageCalls(calls, m.stage);
    const fade = onStage[onStage.length - 1]!;
    expect(fade.frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    expect(fade.options).toEqual({ duration: TRAVEL_FADE_MS, easing: TRAVEL_EASING });
    expect(calls.filter((c) => c.el !== m.stage)).toEqual([]);
    expect(onStage.filter((c) => !c.cancelled)).toEqual([fade]);
    expect(m.pill().text()).toContain("Level 3 → Level 2");
  });

  it("a breadcrumb is a jump too", async () => {
    const m = await mountMap({ initialLevel: 3, initialFocus: "c-api" });
    const calls = recordAnimations();
    m.state.navigateToBreadcrumb(0, { level: 2, focusId: null });
    await settle();
    expect(m.state.currentLevel).toBe(2);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    expect(calls[0]!.options.duration).toBe(TRAVEL_FADE_MS);
  });
});
