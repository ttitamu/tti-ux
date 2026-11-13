/**
 * The map does not flicker between two sizes when its host resizes to fit it (#268).
 *
 * Seen live in a page that sizes its frame to the map: on every animation frame the fit scale went
 * 0.760 → 0.770 → 0.760 and the height 625 → 634 → 625 px. A slightly taller map made a scrollbar
 * appear for a frame, the viewport lost ~15 px of width, the fit and the held height (#261) dropped,
 * the scrollbar went, the width came back. The width the map lays itself out for now takes a narrower
 * width at once and a wider one only past a scrollbar's width, so the loop ends in one step.
 */
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../app/utils/tuxArchitectureMapSample";

type SetupState = Record<string, any>;
const mounted: { unmount: () => void }[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountAt(width: number) {
  const wrapper = await mountSuspended(TuxArchitectureMap, {
    props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await nextTick();
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  const els = [".tux-map__viewport", ".tux-map"].map((s) => wrapper.find(s).element as HTMLElement);
  /** The browser reports this width for the viewport and the map's root, and the observer fires. */
  const resize = async (w: number) => {
    for (const el of els) Object.defineProperty(el, "clientWidth", { configurable: true, get: () => w });
    state.measureViewport();
    await nextTick();
  };
  await resize(width);
  return { state, resize };
}

describe("TuxArchitectureMap: a host that resizes to fit the map does not make it flicker (#268)", () => {
  it("settles after one narrowing when the width alternates by a scrollbar's width", async () => {
    const { state, resize } = await mountAt(1000);
    // the scrollbar comes and goes, as it did on every frame
    await resize(985);
    const settled = [state.fitScale, state.computedViewportHeight];
    for (const w of [1000, 985, 1000, 985, 1000]) {
      await resize(w);
      expect([state.fitScale, state.computedViewportHeight], `at ${w}px`).toEqual(settled);
    }
  });

  it("follows a narrower width at once, so the diagram never overflows", async () => {
    const { state, resize } = await mountAt(1000);
    const wide = state.fitScale;
    await resize(990);
    expect(state.fitScale).toBeLessThan(wide);
  });

  it("follows a real widening, and the sum of small ones", async () => {
    const { state, resize } = await mountAt(900);
    const narrow = state.fitScale;
    await resize(1000);
    expect(state.fitScale).toBeGreaterThan(narrow);
    const { state: s2, resize: r2 } = await mountAt(900);
    const at900 = s2.fitScale;
    for (const w of [915, 930, 945]) await r2(w);
    // 915 and 930 are within a scrollbar of 900, 945 is not: the map widens once the growth is real
    expect(s2.fitScale).toBeGreaterThan(at900);
  });
});
