import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxThresholdBar, {
  type ThresholdSegment,
} from "~/components/TuxThresholdBar.vue";
import { runComponentAxe } from "../axe-helper";

const sampleSegments: ThresholdSegment[] = [
  { key: "raw", label: "Raw Sensor Video", value: 45, tone: "primary", pattern: "solid" },
  { key: "lidar", label: "LiDAR Sweeps", value: 25, tone: "secondary", pattern: "solid" },
  { key: "forecast", label: "Projected Burst", value: 18, tone: "warning", pattern: "hatched" },
];

describe("TuxThresholdBar Component", () => {
  it("renders committed and hatched segments, warning summary, and passes axe accessibility", async () => {
    const wrapper = await mountSuspended(TuxThresholdBar, {
      props: {
        title: "Telemetry Array Storage",
        segments: sampleSegments,
        limit: 100,
        unit: "TB",
        decimals: 1,
        warningRatio: 0.85,
      },
    });

    expect(wrapper.text()).toContain("Telemetry Array Storage");
    expect(wrapper.text()).toContain("88.0 TB");
    expect(wrapper.text()).toContain("100.0 TB");
    expect(wrapper.text()).toContain("88.0%");
    expect(wrapper.text()).toContain("Approaching limit");
    expect(wrapper.find(".tux-threshold-bar__segment--hatched").exists()).toBe(true);

    const meter = wrapper.find('[role="meter"]');
    expect(meter.exists()).toBe(true);
    expect(meter.attributes("aria-valuenow")).toBe("88");
    expect(meter.attributes("aria-valuemax")).toBe("100");

    const marker = wrapper.find(".tux-threshold-bar__marker");
    expect(marker.attributes("style")).toContain("left: 100%");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("scales proportionally when total exceeds limit (>100%) and supports prefix units", async () => {
    const overSegments: ThresholdSegment[] = [
      { key: "committed", label: "Committed Load", value: 90, tone: "primary" },
      { key: "surge", label: "Projected Surge", value: 35, tone: "danger", pattern: "hatched" },
    ];

    const wrapper = await mountSuspended(TuxThresholdBar, {
      props: {
        title: "Peak Corridor Allocation",
        segments: overSegments,
        limit: 100,
        unit: "$",
        unitPosition: "prefix",
        decimals: 0,
        showLegend: false,
      },
    });

    expect(wrapper.text()).toContain("$125");
    expect(wrapper.text()).toContain("$100");
    expect(wrapper.text()).toContain("Over limit by $25");
    expect(wrapper.find(".tux-threshold-bar__legend").exists()).toBe(false);

    // 100 / 125 = 80% proportional marker position inside the track
    const marker = wrapper.find(".tux-threshold-bar__marker");
    expect(marker.attributes("style")).toContain("left: 80%");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
