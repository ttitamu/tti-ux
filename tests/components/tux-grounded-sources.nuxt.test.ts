import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxGroundedSources from "../../app/components/TuxGroundedSources.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxGroundedSources Component", () => {
  it("renders grounded retrieval sources with DLP status and passes axe checks", async () => {
    const wrapper = await mountSuspended(TuxGroundedSources, {
      props: {
        dlpLabel: "Zero-PII DLP Verified",
        sources: [
          {
            id: 1,
            title: "TxDOT Work Zone Safety Guidelines 2026",
            domain: "tti.tamu.edu",
            snippet: "Longitudinal channelizing devices reduced work-zone intrusions by 18.4%.",
            url: "https://tti.tamu.edu/reports/work-zone-2026",
            dlpChecked: true,
          },
          {
            id: 2,
            title: "FHWA MUTCD 11th Edition Part 6",
            domain: "fhwa.dot.gov",
            snippet: "Temporary traffic control zone taper length formulas.",
            url: "https://mutcd.fhwa.dot.gov",
            dlpChecked: true,
          },
        ],
      },
    });

    expect(wrapper.text()).toContain("Grounded in 2 verified sources");
    expect(wrapper.text()).toContain("Zero-PII DLP Verified");
    expect(wrapper.text()).toContain("TxDOT Work Zone Safety Guidelines 2026");
    expect(wrapper.findAll("a").length).toBe(2);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
