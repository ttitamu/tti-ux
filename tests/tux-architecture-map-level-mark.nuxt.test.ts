// @vitest-environment nuxt
/**
 * The canvas keeps its size from level to level (#261), and names the level faintly in its
 * bottom-right corner (#260).
 *
 * The test DOM does no layout, so the heights are the ones the component sets on the viewport
 * (its inline `height`, which is also what the computed style reads back), and the centring is the
 * stage's `top`. The sample model's Level 2 is the tallest when fitted; Levels 3 and 4 are shorter.
 * In a browser the docs page was measured at 1504 and 792 px.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
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

/** The declarations of every rule whose selector list has exactly `selector`, in source order. */
function declarations(selector: string, css = STYLE): string[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => m[1]!.split(",").some((s) => s.trim().replace(/\s+/g, " ") === selector))
    .map((m) => m[2]!);
}

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountMap(props: Record<string, unknown> = {}) {
  const wrapper = await mountSuspended(TuxArchitectureMap, {
    props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await nextTick();
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  const viewport = () => wrapper.find(".tux-map__viewport").element as HTMLElement;
  const stage = () => wrapper.find(".tux-map__stage").element as HTMLElement;
  const go = async (level: number) => {
    state.goToLevel(level);
    await nextTick();
    await nextTick();
  };
  return { wrapper, state, viewport, stage, go };
}

/** What the viewport's height is set to, and what the computed style reads back. */
const heightOf = (el: HTMLElement) => [el.style.height, window.getComputedStyle(el).height];

/** The level drawn in the middle of `inner` px of viewport, at the scale it is drawn at. */
const centredTop = (state: SetupState, inner: number) =>
  Math.floor((inner - state.stageData.height * state.stageScale) / 2);

describe("TuxArchitectureMap: the canvas keeps its size from level to level (#261)", () => {
  it("keeps the viewport's height from a large level to a small one, and centres the small one in it", async () => {
    const { state, viewport, stage, go } = await mountMap();
    const tall = state.stageData.height * state.fitScale;
    const before = heightOf(viewport());
    expect(before[0]).toBe(`${Math.max(440, Math.ceil(tall))}px`);
    expect(before[1]).toBe(before[0]);
    expect(stage().style.top).toBe("0px");

    for (const level of [3, 4, 1, 2, 3]) {
      await go(level);
      expect(state.currentLevel).toBe(level);
      expect(heightOf(viewport()), `Level ${level}`).toEqual(before);
      if (level === 2) continue;
      // a shorter level than the one that set the height: in the middle of it, not at its top
      expect(state.stageData.height * state.fitScale).toBeLessThan(tall - 40);
      const top = centredTop(state, Number.parseFloat(before[0]!) - 2);
      expect(top).toBeGreaterThan(10);
      expect(stage().style.top, `Level ${level}`).toBe(`${top}px`);
    }
  });

  it("maps a pointer on a centred level to the card under it", async () => {
    const { state, go } = await mountMap();
    await go(3);
    const id = Object.keys(state.stageData.rects).find((k) => !state.stageData.rects[k].bound)!;
    const r = state.stageData.rects[id];
    const s = state.stageScale;
    expect(state.stageOffsetY).toBeGreaterThan(10);
    // the test DOM puts the viewport at the page's origin
    const at = state.getStageCoordsFromClient(state.panX + (r.x + 5) * s, state.stageOffsetY + (r.y + 5) * s);
    expect(Math.abs(at.x - (r.x + 5))).toBeLessThanOrEqual(1);
    expect(Math.abs(at.y - (r.y + 5))).toBeLessThanOrEqual(1);
    expect(state.findCardIdAtStagePoint(at.x, at.y)).toBe(id);
  });

  it("draws the trailing cursor where the pointer is on a centred level: the stage's offset is undone on it", async () => {
    // The cursor sits inside the stage (#256), which a centred level moves down by stageOffsetY: its
    // own transform must take that back, as it takes back the stage's scale and pan, or the disc lands
    // that far below the card it rests on (seen in a browser: 137 px)
    // a fine pointer with motion allowed: the only device the cursor is drawn for
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: /pointer: fine|reduced-motion: no-preference/.test(q),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    }));
    try {
      const { wrapper, state, go } = await mountMap({ cursor: true });
      await go(3);
      expect(state.stageOffsetY).toBeGreaterThan(10);
      const cursor = wrapper.find(".tux-map__cursor");
      expect(cursor.exists()).toBe(true);
      const t = (cursor.element as HTMLElement).style.transform.replace(/\s+/g, " ");
      expect(t).toContain(`translateY(${-state.stageOffsetY}px)`);
      expect(t.indexOf("scale(")).toBeLessThan(t.indexOf("translateY("));
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("starts again from the level on screen when the map's width changes", async () => {
    const { state, viewport, go } = await mountMap();
    const held = viewport().style.height;
    await go(3);
    expect(viewport().style.height).toBe(held);
    state.viewportWidth = 900;
    state.containerWidth = 902;
    await nextTick();
    const own = Math.max(440, Math.ceil(state.stageData.height * state.fitScale));
    expect(viewport().style.height).toBe(`${own}px`);
    expect(viewport().style.height).not.toBe(held);
    // and holds that from here on
    await go(2);
    const raised = viewport().style.height;
    expect(Number.parseFloat(raised)).toBeGreaterThan(own);
    await go(3);
    expect(viewport().style.height).toBe(raised);
  });

  it("keeps a host's `height` as it is at every level, and centres a shorter level in it", async () => {
    const { state, viewport, stage, go } = await mountMap({ height: "900px" });
    expect(viewport().style.height).toBe("900px");
    // the browser reports the box it drew; the test DOM has none, so it is given one
    Object.defineProperty(viewport(), "offsetHeight", { value: 900, configurable: true });
    state.measureViewport();
    await nextTick();
    for (const level of [3, 4, 2]) {
      await go(level);
      expect(viewport().style.height).toBe("900px");
      expect(stage().style.top, `Level ${level}`).toBe(`${Math.max(0, centredTop(state, 898))}px`);
    }
  });

  // It asked for the diagram's own height up to 75vh until #271: with a continuous zoom that resized
  // the canvas on every step of a pinch, moved the page, and let the centring catch up a frame late.
  it("magnified, keeps the held height: a zoom changes what is in the canvas, not its box (#271)", async () => {
    const { wrapper, state, viewport, go } = await mountMap();
    const held = viewport().style.height;
    await go(3);
    for (let i = 0; i < 3; i++) {
      await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
      await nextTick();
      expect(state.isMagnified).toBe(true);
      expect(state.computedViewportHeight).toBe(held);
      expect(viewport().style.height).toBe(held);
    }
  });
});

describe("TuxArchitectureMap: the level, faint in the canvas's corner (#260)", () => {
  it("names the level after every change, and is hidden from assistive technology", async () => {
    const { wrapper, state, go } = await mountMap();
    const mark = () => wrapper.find(".tux-map__level-mark");
    expect(mark().attributes("aria-hidden")).toBe("true");
    expect(mark().text()).toBe("LEVEL 2");
    for (const level of [3, 4, 1, 2]) {
      await go(level);
      expect(mark().text()).toBe(`LEVEL ${level}`);
      expect(mark().attributes("aria-hidden")).toBe("true");
    }
    // and after a zoom into a card
    state.zoomIntoElement("c-api");
    await nextTick();
    await nextTick();
    expect(mark().text()).toBe(`LEVEL ${state.currentLevel}`);
    expect(state.currentLevel).toBe(3);
    // nothing in it to reach or press
    expect(mark().findAll("a,button,input,[tabindex]")).toHaveLength(0);
  });

  it("is drawn behind the diagram: in the viewport, before the stage, and takes no pointer", async () => {
    const { wrapper } = await mountMap();
    const vp = wrapper.find(".tux-map__viewport").element;
    const el = wrapper.find(".tux-map__level-mark").element as HTMLElement;
    const stage = wrapper.find(".tux-map__stage").element;
    expect(el.parentElement).toBe(vp);
    expect(el.compareDocumentPosition(stage) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // as tall as the viewport, and taking none of its room
    expect(el.style.marginBottom).toBe(`-${el.style.height}`);
    const box = declarations(".tux-map__level-mark")[0]!;
    expect(box).toMatch(/position:\s*sticky/);
    expect(box).toMatch(/pointer-events:\s*none/);
    const text = declarations(".tux-map__level-mark-text")[0]!;
    expect(text).toMatch(/right:/);
    expect(text).toMatch(/bottom:/);
    expect(text).toMatch(/font-family:\s*var\(--font-bold\)/);
    expect(text).toMatch(/color:\s*color-mix\(in srgb, var\(--text-primary\) \d+%, transparent\)/);
    // under forced colours it would be drawn solid
    const forced = STYLE.slice(STYLE.indexOf("@media (forced-colors: active)"));
    expect(declarations(".tux-map__level-mark", forced).some((d) => /display:\s*none/.test(d))).toBe(true);
  });

  it("goes with the diagram in the list view", async () => {
    const { wrapper, state } = await mountMap();
    state.setExplicitViewMode("list");
    await nextTick();
    const vp = wrapper.find(".tux-map__viewport").element as HTMLElement;
    expect(vp.style.display).toBe("none");
    expect(vp.contains(wrapper.find(".tux-map__level-mark").element)).toBe(true);
  });
});
