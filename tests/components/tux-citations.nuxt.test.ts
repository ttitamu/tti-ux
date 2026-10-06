import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCitations from "../../app/components/TuxCitations.vue";

describe("TuxCitations Component", () => {
  const sampleCitations = [
    {
      title: "2025 Urban Mobility Report",
      path: "reports/mobility/2025-umr.pdf",
      score: "0.94",
      href: "/reports/mobility/2025",
    },
    {
      title: "Automated Driving Systems Roadway Readiness",
      path: "studies/ads-readiness.pdf",
      score: "0.89",
    },
  ];

  it("renders numbered citations list and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxCitations, {
      props: {
        items: sampleCitations,
        label: "research sources",
      },
    });

    expect(wrapper.text()).toContain("research sources · 2");
    expect(wrapper.text()).toContain("[1]");
    expect(wrapper.text()).toContain("2025 Urban Mobility Report");
    expect(wrapper.text()).toContain("reports/mobility/2025-umr.pdf");
    expect(wrapper.text()).toContain("0.94");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits select event on citation click", async () => {
    const wrapper = await mountSuspended(TuxCitations, {
      props: {
        items: sampleCitations,
      },
    });

    const link = wrapper.findAll(".tux-citations__link")[1];
    await link.trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0][0]).toEqual(sampleCitations[1]);
    expect(wrapper.emitted("select")?.[0][1]).toBe(1);
  });
});
