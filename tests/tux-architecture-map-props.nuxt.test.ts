// @vitest-environment nuxt
/**
 * The compatibility props of the architecture map say what they do (#230): `initialZoom` was
 * accepted and never read, and `update:lodMode` was declared and never emitted.
 *
 * `initialZoom` is now the stage scale the map opens at (1 is the diagram's real size), taken to the
 * nearest magnify step. A scale at or under the fitted one opens at Fit, as before.
 */
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";

type SetupState = Record<string, any>;

const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount();
});

async function mountMap(props: Record<string, unknown>) {
  const wrapper = await mountSuspended(TuxArchitectureMap, {
    props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, minimap: false, ...props },
  });
  mounted.push(wrapper);
  const state = (wrapper.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  // a narrow viewport: Fit is well under the real size
  state.viewportWidth = 700;
  await nextTick();
  await nextTick();
  return { wrapper, state };
}

describe("TuxArchitectureMap: initialZoom opens the map magnified (#230)", () => {
  it("opens at Fit when it is not given", async () => {
    const { wrapper, state } = await mountMap({});
    expect(state.fitScale).toBeLessThan(0.5);
    expect(state.isMagnified).toBe(false);
    expect(state.stageScale).toBe(state.fitScale);
    // the canvas zoom (#271) shows the size against Fit, 100% at Fit; Fit is its own button
    expect(wrapper.find("[data-zoom-percent]").text()).toBe("100%");
    expect(wrapper.find(".tux-map__magnify-fit").attributes("aria-pressed")).toBe("true");
  });

  it.each([
    [1, 1],
    [1.5, 1.5],
    [1.2, 1],
    [1.3, 1.5],
    // halfway between two steps: the larger
    [1.25, 1.5],
    [0.6, 0.5],
    [9, 2],
  ])("opens at the magnify step nearest %s (%s)", async (given, step) => {
    const { wrapper, state } = await mountMap({ initialZoom: given });
    expect(state.isMagnified).toBe(true);
    expect(state.stageScale).toBe(step);
    expect(wrapper.find("[data-zoom-percent]").text()).toBe(`${Math.round((step / state.fitScale) * 100)}%`);
  });

  it("opens at Fit for a scale at or under the fitted one, or one that is not a scale", async () => {
    for (const given of [0.5, 0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      const { state } = await mountMap({ initialZoom: given });
      state.viewportWidth = 4000;
      await nextTick();
      // the whole diagram fits at its real size: nothing is larger than Fit below 1
      if (given === 0.5) expect(state.fitScale).toBe(1);
      expect(state.isMagnified, String(given)).toBe(false);
    }
  });

  it("is a starting value: the magnify buttons move on from it", async () => {
    const { wrapper, state } = await mountMap({ initialZoom: 1.5 });
    await wrapper.find('[aria-label="Make the diagram smaller"]').trigger("click");
    expect(state.stageScale).toBe(1);
    await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    expect(state.stageScale).toBe(2);
  });
});

describe("TuxArchitectureMap: lodMode is deprecated and update:lodMode is gone (#230)", () => {
  it("declares no update:lodMode event", () => {
    const emits = (TuxArchitectureMap as unknown as { emits?: string[] | Record<string, unknown> }).emits ?? [];
    const names = Array.isArray(emits) ? emits : Object.keys(emits);
    expect(names).toContain("update:level");
    expect(names).not.toContain("update:lodMode");
  });

  it("still moves the map on a change of lodMode after mount", async () => {
    const { wrapper, state } = await mountMap({});
    await wrapper.setProps({ lodMode: "executive" });
    expect(state.currentLevel).toBe(1);
    // and says so on update:level, the event that replaces it
    expect(wrapper.emitted("update:level")?.at(-1)).toEqual([1]);
  });
});
