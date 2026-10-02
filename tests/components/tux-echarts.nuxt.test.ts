import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxECharts from "~/components/TuxECharts.vue";
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
});
