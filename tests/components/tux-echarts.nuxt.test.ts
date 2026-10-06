import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxECharts from "~/components/TuxECharts.vue";
import { GALLERY_PRESETS } from "~/utils/tuxEChartsGallery";
import { runComponentAxe } from "../axe-helper";

describe("TuxECharts Component", () => {
  const sampleOptions = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  };

  it("renders with img role, aria label, and zero accessibility violations", async () => {
    const wrapper = await mountSuspended(TuxECharts, {
      props: {
        options: sampleOptions,
        ariaTitle: "Weekly cluster compute utilization",
        ariaSummary: "Peak utilization reached 260 TFLOPS on Sunday, low of 135 TFLOPS on Friday.",
        height: "350px",
      },
    });

    expect(wrapper.find(".tux-echarts").exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Weekly cluster compute utilization");
    expect(wrapper.find(".sr-only").text()).toContain("Peak utilization reached 260 TFLOPS");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("verifies gallery presets generate valid light and dark options", () => {
    expect(GALLERY_PRESETS.length).toBeGreaterThanOrEqual(12);

    for (const preset of GALLERY_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.title).toBeDefined();
      expect(preset.ariaSummary).toBeDefined();

      const lightOpt = preset.getOption(false);
      const darkOpt = preset.getOption(true);

      expect(lightOpt.series).toBeDefined();
      expect(darkOpt.series).toBeDefined();
    }
  });

  it("mounts with custom extensions and maps without throwing", async () => {
    const wrapper = await mountSuspended(TuxECharts, {
      props: {
        options: {
          series: [{ type: "gauge", data: [{ value: 65, name: "MPH" }] }],
        },
        extensions: ["liquidfill", "wordcloud"],
        maps: ["USA_ALBERS"],
        ariaTitle: "Speed gauge",
      },
    });

    expect(wrapper.exists()).toBe(true);
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
