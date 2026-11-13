// @vitest-environment nuxt
/**
 * What the map costs the page while the pointer is near it, and while nothing happens (#221).
 *
 * - The proximity beam's flowing dashes run only while the beam is drawn (#223): an idle map
 *   with a running animation repaints its stage every frame.
 * - A pointer move reads no layout (#224): the viewport's place on the page and its scroll
 *   position are kept between moves, read again after a resize, a scroll or the pointer leaving.
 *   A read after the previous move's writes is a forced layout, so the count is what matters.
 *
 * jsdom does no layout and runs no CSS animation: what a browser would animate is read from the
 * classes the component sets and from the stylesheet's own rules.
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

/** A fine pointer with motion allowed: the trailing cursor (#208) is drawn, and reads what the map reads. */
function stubFinePointer() {
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: !q.includes("coarse") && !q.includes("reduce)"),
    media: q,
    addEventListener() {},
    removeEventListener() {},
  }));
}

/** The cursor's frames held in a queue that the test does not run: only the reads a move makes are counted. */
function holdFrames() {
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", () => ++id);
  vi.stubGlobal("cancelAnimationFrame", () => {});
}

const sfc = readFileSync(join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"), "utf8");
const css = sfc.slice(sfc.indexOf("<style"));

describe("TuxArchitectureMap: the cost of an idle map and of a pointer over it (#221)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function mountMap(props: Record<string, unknown> = {}) {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 2, minimap: false, ...props },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await nextTick();
    await nextTick();
    const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
    const viewport = wrapper.find(".tux-map__viewport").element as HTMLElement;
    const stage = wrapper.find(".tux-map__stage").element as HTMLElement;
    const send = async (type: string, target: Element, x: number, y: number) => {
      const ev = new window.MouseEvent(type, { bubbles: type !== "pointerleave", cancelable: true, clientX: x, clientY: y });
      Object.defineProperty(ev, "pointerId", { value: 1 });
      Object.defineProperty(ev, "pointerType", { value: "mouse" });
      target.dispatchEvent(ev);
      await nextTick();
    };
    /** Where a card is inside the viewport, in px: its stage box through the stage's scale and pan. */
    const cardBox = (id: string) => {
      const r = state.stageData.rects[id] as { x: number; y: number; w: number; h: number };
      const s = state.stageScale as number;
      return { x: r.x * s + (state.panX as number), y: r.y * s, w: r.w * s, h: r.h * s };
    };
    return { wrapper, state, viewport, stage, send, cardBox };
  }

  describe("the proximity beam animates only while it is drawn (#223)", () => {
    it("the stylesheet runs the dashes only under the class the beam is drawn with, and reduced motion still stops them", () => {
      // no rule animates the beam on its own: an always-mounted, transparent beam would repaint every frame
      for (const m of css.matchAll(/([^{}]*)\{([^}]*)\}/g)) {
        if (/\.tux-map__proximity-beam\b/.test(m[1]!) && /animation:\s*tux-map-wire-flow/.test(m[2]!)) {
          expect(m[1]!.trim()).toBe(".tux-map__proximity-tether--on .tux-map__proximity-beam");
        }
      }
      expect(css).toMatch(/\n\.tux-map__proximity-tether--on \.tux-map__proximity-beam \{[^}]*animation:\s*tux-map-wire-flow/);
      // the reduced-motion rule names the same selector, so it is not outweighed by it
      const still = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
      expect(still).toMatch(/\.tux-map__proximity-tether--on \.tux-map__proximity-beam,[^{]*\{\s*animation:\s*none;/);
    });

    it("with nothing near the pointer the beam is not drawn; near a card it is; away again, it is not", async () => {
      const { wrapper, viewport, stage, send, state, cardBox } = await mountMap();
      const tether = () => wrapper.find(".tux-map__proximity-tether").element as SVGElement;
      const on = () => tether().classList.contains("tux-map__proximity-tether--on");
      // mounted, with no pointer anywhere
      expect(on()).toBe(false);

      // far from every card
      await send("pointermove", stage, 4000, 4000);
      expect(state.proximityCard).toBeNull();
      expect(on()).toBe(false);

      // 20 px left of a card: near enough to pick it, far enough to draw the beam to it
      const b = cardBox("c-a");
      const s = state.stageScale as number;
      await send("pointermove", stage, b.x - 20 * s, b.y + b.h / 2);
      expect(state.proximityCard?.id).toBe("c-a");
      expect(on()).toBe(true);
      expect(Number(tether().style.opacity)).toBeGreaterThan(0);

      // on the card itself the beam has no length: not drawn
      await send("pointermove", stage, b.x + b.w / 2, b.y + b.h / 2);
      expect(on()).toBe(false);

      await send("pointermove", stage, b.x - 20 * s, b.y + b.h / 2);
      expect(on()).toBe(true);
      await send("pointerleave", stage, -10, -10);
      expect(on()).toBe(false);
      expect(tether().style.opacity).toBe("0");

      // and away from every card
      await send("pointermove", stage, b.x - 20 * s, b.y + b.h / 2);
      expect(on()).toBe(true);
      await send("pointermove", viewport, 4000, 4000);
      expect(on()).toBe(false);
    });
  });

  describe("a pointer move reads no layout (#224)", () => {
    /** Counts what a move could read from the layout: the viewport's box and its scroll position. */
    function countReads(viewport: HTMLElement) {
      const reads = { box: 0, scroll: 0 };
      const scroll = { left: 0, top: 0 };
      const box = viewport.getBoundingClientRect.bind(viewport);
      viewport.getBoundingClientRect = () => {
        reads.box++;
        return box();
      };
      for (const [prop, key] of [["scrollLeft", "left"], ["scrollTop", "top"]] as const) {
        Object.defineProperty(viewport, prop, {
          configurable: true,
          get: () => {
            reads.scroll++;
            return scroll[key];
          },
          set: (v: number) => void (scroll[key] = Math.max(0, v)),
        });
      }
      const take = () => {
        const r = { ...reads };
        reads.box = 0;
        reads.scroll = 0;
        return r;
      };
      return { take, scroll };
    }

    for (const cursor of [false, true]) {
      it(`reads the viewport's box once, and then not again until something moves it (cursor ${cursor ? "on" : "off"})`, async () => {
        stubFinePointer();
        holdFrames();
        const { viewport, stage, send, state, cardBox, wrapper } = await mountMap({ cursor });
        const reads = countReads(viewport);
        const b = cardBox("c-a");
        const s = state.stageScale as number;
        /** 24 moves, a frame's worth of a fast pointer and more: near the card, on it, and away from it. */
        const batch = async (dx = 0) => {
          for (let i = 0; i < 24; i++) {
            const at = i % 3;
            const x = at === 0 ? b.x - 20 * s : at === 1 ? b.x + b.w / 2 : 4000;
            await send("pointermove", stage, x + dx, b.y + b.h / 2);
          }
        };

        await batch();
        // the first move reads the box and the scroll position, once each
        expect(reads.take()).toEqual({ box: 1, scroll: 2 });
        expect(state.proximityCard).toBeNull();
        await send("pointermove", stage, b.x - 20 * s, b.y + b.h / 2);
        expect(state.proximityCard?.id).toBe("c-a");
        await batch();
        expect(reads.take()).toEqual({ box: 0, scroll: 0 });

        // the viewport's own scroll: its scroll position is read in the scroll event, once, and the box is not
        reads.scroll.left = 30;
        viewport.dispatchEvent(new window.Event("scroll"));
        await nextTick();
        expect(reads.take()).toEqual({ box: 0, scroll: 2 });
        // the scrolled content is 30 px further left: the same card is 30 px nearer the pointer's left
        await send("pointermove", stage, b.x - 20 * s - 30, b.y + b.h / 2);
        expect(state.proximityCard?.id).toBe("c-a");
        await batch(-30);
        expect(reads.take()).toEqual({ box: 0, scroll: 0 });
        if (cursor) {
          // the trailing cursor is placed from the same reads: the dot is on the pointer in the scrolled content
          const dot = wrapper.find(".tux-map__cursor").element.firstElementChild as HTMLElement;
          await send("pointermove", stage, 700, 20);
          expect(dot.style.transform).toBe("translate(730px,20px)");
        }

        // a resize of the window, a scroll of the page and the pointer leaving may each move the box: read again, once
        window.dispatchEvent(new window.Event("resize"));
        await batch(-30);
        expect(reads.take()).toEqual({ box: 1, scroll: 0 });
        document.dispatchEvent(new window.Event("scroll"));
        await batch(-30);
        expect(reads.take()).toEqual({ box: 1, scroll: 0 });
        await send("pointerleave", viewport, -10, -10);
        await batch(-30);
        expect(reads.take()).toEqual({ box: 1, scroll: 0 });

        // the map scrolling the viewport itself (a drag of the background, 60 px) reads the scroll position again
        viewport.setPointerCapture = () => {};
        await send("pointerdown", stage, 700, 20);
        const drag = new window.MouseEvent("pointermove", { bubbles: true, clientX: 640, clientY: 20, buttons: 1 });
        Object.defineProperty(drag, "pointerId", { value: 1 });
        stage.dispatchEvent(drag);
        await send("pointerup", stage, 640, 20);
        expect(reads.scroll.left).toBe(90);
        await send("pointermove", stage, b.x - 20 * s - 90, b.y + b.h / 2);
        expect(state.proximityCard?.id).toBe("c-a");
        reads.take();
        await batch(-90);
        expect(reads.take()).toEqual({ box: 0, scroll: 0 });
      });
    }
  });
});
