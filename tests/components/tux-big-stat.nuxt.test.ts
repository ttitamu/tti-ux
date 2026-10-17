import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxBigStat from "../../app/components/TuxBigStat.vue";

describe("TuxBigStat Component", () => {
  it("renders with required props and default tone/variant", async () => {
    const wrapper = await mountSuspended(TuxBigStat, {
      props: {
        value: "99.4",
        suffix: "%",
        label: "Corridor System Reliability Index",
      },
    });

    expect(wrapper.find(".tux-big-stat__value").text()).toContain("99.4%");
    expect(wrapper.find(".tux-big-stat__label").text()).toBe("Corridor System Reliability Index");
    expect(wrapper.find(".tux-big-stat__source").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports tone, size, and source line options", async () => {
    const wrapper = await mountSuspended(TuxBigStat, {
      props: {
        value: "$126M",
        label: "Annual Research Expenditure",
        source: "TTI Annual Financial Report FY2025",
        tone: "gold",
        size: "lg",
        variant: "bold",
      },
    });

    expect(wrapper.find(".tux-big-stat__value").text()).toContain("$126M");
    expect(wrapper.find(".tux-big-stat__source").text()).toBe("TTI Annual Financial Report FY2025");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders small and neutral variant cleanly", async () => {
    const wrapper = await mountSuspended(TuxBigStat, {
      props: {
        value: "4,820",
        suffix: "vph",
        label: "Peak Hourly Vehicle Volume",
        tone: "neutral",
        size: "sm",
      },
    });

    expect(wrapper.find(".tux-big-stat__suffix").text()).toBe("vph");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders statistical provenance pills (sampleSize, confidenceInterval, doi) and division accent", async () => {
    const wrapper = await mountSuspended(TuxBigStat, {
      props: {
        value: "18.4",
        suffix: "%",
        label: "Peak Delay Reduction",
        sampleSize: 14200,
        confidenceInterval: "± 1.2% (95% CI)",
        doi: "TxDOT 0-7142",
        division: "teal",
      },
    });

    expect(wrapper.classes()).toContain("tux-big-stat--division-teal");
    expect(wrapper.text()).toContain("n = 14,200");
    expect(wrapper.text()).toContain("± 1.2% (95% CI)");
    expect(wrapper.text()).toContain("TxDOT 0-7142");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
