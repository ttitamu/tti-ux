import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxFooter from "~/components/TuxFooter.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFooter Component", () => {
  it("renders default institutional identity and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxFooter);

    expect(wrapper.text()).toContain("Texas A&M Transportation Institute");
    expect(wrapper.text()).toContain("College Station, TX");
    expect(wrapper.text()).toContain("(979) 317-2000");
    expect(wrapper.text()).toContain("Coordinated Statewide Transportation Research Program");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders social links and resource columns", async () => {
    const wrapper = await mountSuspended(TuxFooter, {
      props: {
        social: [
          { label: "LinkedIn", href: "https://www.linkedin.com/company/texas-a&m-transportation-institute", icon: "lucide:linkedin" },
          { label: "Twitter / X", href: "https://twitter.com/TTITAMU", icon: "lucide:twitter" },
        ],
        columns: [
          {
            heading: "Research Centers",
            links: [
              { label: "Center for Transportation Safety", href: "https://tti.tamu.edu/cts" },
              { label: "Texas Connected Freight Corridor", href: "https://tti.tamu.edu/freight" },
            ],
          },
          {
            heading: "Statewide Compliance",
            links: [
              { label: "Texas Veterans Portal", href: "https://veterans.portal.texas.gov" },
              { label: "Open Records", href: "https://tti.tamu.edu/open-records" },
            ],
          },
        ],
      },
    });

    expect(wrapper.text()).toContain("Research Centers");
    expect(wrapper.text()).toContain("Center for Transportation Safety");
    expect(wrapper.text()).toContain("Statewide Compliance");
    expect(wrapper.text()).toContain("Texas Veterans Portal");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
