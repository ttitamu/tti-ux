import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxStatComparison from "../../app/components/TuxStatComparison.vue";

describe("TuxStatComparison Component", () => {
  it("computes direct positive delta and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxStatComparison, {
      props: {
        eyebrow: "Indexed Corpus",
        current: 47.2,
        previous: 45.8,
        suffix: " TB",
        label: "vs last week",
      },
    });

    expect(wrapper.classes()).toContain("tux-stat-comparison");
    expect(wrapper.classes()).toContain("tux-stat-comparison--success");
    expect(wrapper.text()).toContain("Indexed Corpus");
    expect(wrapper.text()).toContain("47.2 TB");
    expect(wrapper.text()).toContain("+1.4 TB");
    expect(wrapper.text()).toContain("(+3.1%)");
    expect(wrapper.text()).toContain("vs last week");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles inverted polarity where decrease is success", async () => {
    const wrapper = await mountSuspended(TuxStatComparison, {
      props: {
        eyebrow: "Median Incident Clearance",
        current: 18.5,
        previous: 24.0,
        suffix: " min",
        label: "vs baseline",
        polarity: "invert",
      },
    });

    expect(wrapper.classes()).toContain("tux-stat-comparison--success");
    expect(wrapper.text()).toContain("18.5 min");
    expect(wrapper.text()).toContain("-5.5 min");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
