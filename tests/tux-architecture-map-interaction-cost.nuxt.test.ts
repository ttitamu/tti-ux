// @vitest-environment nuxt
/**
 * What the map costs the page while the pointer is near it, and while nothing happens (#221).
 *
 * - The proximity beam's flowing dashes run only while the beam is drawn (#223): an idle map
 *   with a running animation repaints its stage every frame.
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
});
