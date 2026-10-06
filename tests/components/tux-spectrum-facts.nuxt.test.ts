import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxSpectrumFacts from "../../app/components/TuxSpectrumFacts.vue";

describe("TuxSpectrumFacts Component", () => {
  it("renders 5 canonical institutional metric items in dark tone", async () => {
    const wrapper = await mountSuspended(TuxSpectrumFacts, {
      props: {
        title: "QUICK FACTS",
        subtitle: "FY 2025 Telemetry",
        tone: "dark",
      },
    });

    expect(wrapper.find("h2").text()).toBe("QUICK FACTS");
    expect(wrapper.text()).toContain("FY 2025 Telemetry");
    expect(wrapper.text()).toContain("$140M");
    expect(wrapper.text()).toContain("Research Expenditures");
    expect(wrapper.text()).toContain("Active Projects");
    expect(wrapper.text()).toContain("Research Sponsors");
    expect(wrapper.text()).toContain("Student Researchers");
    expect(wrapper.text()).toContain("Transportation Staff");

    expect(wrapper.classes()).toContain("bg-neutral-900");
    expect(wrapper.findComponent({ name: "TuxSpectrumRibbon" }).exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports light surface tone and can hide top ribbon", async () => {
    const wrapper = await mountSuspended(TuxSpectrumFacts, {
      props: {
        tone: "light",
        showTopRibbon: false,
      },
    });

    expect(wrapper.classes()).toContain("bg-surface-raised");
    expect(wrapper.findComponent({ name: "TuxSpectrumRibbon" }).exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders custom metric items with custom bands", async () => {
    const wrapper = await mountSuspended(TuxSpectrumFacts, {
      props: {
        title: "ATLAS LAB METRICS",
        items: [
          { value: "48", label: "Sensors Online", band: "green" },
          { value: "99.9%", label: "Pipeline Uptime", band: "teal" },
        ],
      },
    });

    expect(wrapper.text()).toContain("ATLAS LAB METRICS");
    expect(wrapper.text()).toContain("Sensors Online");
    expect(wrapper.text()).toContain("48");
    expect(wrapper.text()).toContain("Pipeline Uptime");
    expect(wrapper.text()).toContain("99.9%");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
