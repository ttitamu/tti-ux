import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxAccordion from "../../app/components/TuxAccordion.vue";

describe("TuxAccordion Component", () => {
  const sampleItems = [
    {
      title: "What is the Texas A&M Transportation Institute?",
      eyebrow: "agency overview",
      content: "TTI is the largest higher education-affiliated transportation research agency in the United States.",
      defaultOpen: true,
    },
    {
      title: "How are research projects funded?",
      meta: "Sponsored Research · TxDOT / FHWA",
      content: "Research is funded through state DOTs, federal research grants, and private industry partnerships.",
    },
  ];

  it("renders disclosure items with native details/summary elements and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxAccordion, {
      props: {
        items: sampleItems,
      },
    });

    const details = wrapper.findAll("details");
    expect(details.length).toBe(2);
    expect(details[0].attributes("open")).toBeDefined();
    expect(wrapper.text()).toContain("What is the Texas A&M Transportation Institute?");
    expect(wrapper.text()).toContain("agency overview");
    expect(wrapper.text()).toContain("TTI is the largest higher education-affiliated");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports publication citation rhythm with meta information", async () => {
    const wrapper = await mountSuspended(TuxAccordion, {
      props: {
        items: sampleItems,
        kind: "publication",
      },
    });

    expect(wrapper.classes()).toContain("tux-accordion--publication");
    expect(wrapper.text()).toContain("Sponsored Research · TxDOT / FHWA");
  });

  it("scopes details into a single mutually-exclusive group when single prop is true", async () => {
    const wrapper = await mountSuspended(TuxAccordion, {
      props: {
        items: sampleItems,
        single: true,
      },
    });

    const details = wrapper.findAll("details");
    const groupName = details[0].attributes("name");
    expect(groupName).toBeTruthy();
    expect(details[1].attributes("name")).toBe(groupName);
  });
});
