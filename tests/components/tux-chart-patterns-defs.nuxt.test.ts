import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartPatternsDefs from "~/components/TuxChartPatternsDefs.vue";

describe("TuxChartPatternsDefs Component", () => {
  it("renders all 7 SVG pattern definitions with default prefix", async () => {
    const wrapper = await mountSuspended(TuxChartPatternsDefs);
    expect(wrapper.find("defs.tux-chart-patterns-defs").exists()).toBe(true);

    const patterns = wrapper.findAll("pattern");
    expect(patterns).toHaveLength(7);
    expect(wrapper.find("#tux-pat-diag-right").exists()).toBe(true);
    expect(wrapper.find("#tux-pat-diag-left").exists()).toBe(true);
    expect(wrapper.find("#tux-pat-dots").exists()).toBe(true);
    expect(wrapper.find("#tux-pat-crosshatch").exists()).toBe(true);
    expect(wrapper.find("#tux-pat-horizontal").exists()).toBe(true);
    expect(wrapper.find("#tux-pat-vertical").exists()).toBe(true);
    expect(wrapper.find("#tux-pat-diamonds").exists()).toBe(true);
  });

  it("supports custom prefix prop", async () => {
    const wrapper = await mountSuspended(TuxChartPatternsDefs, {
      props: {
        prefix: "bar-pat-",
      },
    });

    expect(wrapper.find("#bar-pat-diag-right").exists()).toBe(true);
    expect(wrapper.find("#bar-pat-diamonds").exists()).toBe(true);
  });
});
