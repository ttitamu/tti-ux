import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCitationExport from "../../app/components/TuxCitationExport.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCitationExport Component", () => {
  const sampleCitation = {
    authors: ["Guevara, A.", "Perez, M."],
    title: "Connected Vehicle Signal Priority in Rural Freight Corridors",
    venue: "Transportation Research Record",
    year: 2025,
    volume: 2679,
    issue: 4,
    pages: "112-124",
    doi: "10.1177/0361198125123456",
  };

  it("renders cite button trigger with accessible name and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxCitationExport, {
      props: {
        citation: sampleCitation,
        label: "Cite Paper",
      },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain("Cite Paper");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports default Cite label and variant styling", async () => {
    const wrapper = await mountSuspended(TuxCitationExport, {
      props: {
        citation: sampleCitation,
        variant: "solid",
      },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain("Cite");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
