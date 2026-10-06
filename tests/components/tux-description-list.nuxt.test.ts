import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxDescriptionList from "../../app/components/TuxDescriptionList.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDescriptionList", () => {
  it("renders terms and values in definition list format", async () => {
    const wrapper = await mountSuspended(TuxDescriptionList, {
      props: {
        title: "Specifications",
        items: [
          { term: "Corridor", value: "IH-35 Central" },
          { term: "Length", value: "28.4 mi" },
          { term: "AADT", value: "184,500" },
        ],
      },
    });

    expect(wrapper.text()).toContain("Specifications");
    expect(wrapper.text()).toContain("Corridor");
    expect(wrapper.text()).toContain("IH-35 Central");
    expect(wrapper.text()).toContain("Length");
    expect(wrapper.text()).toContain("28.4 mi");
    expect(wrapper.text()).toContain("184,500");

    const dts = wrapper.findAll("dt");
    const dds = wrapper.findAll("dd");
    expect(dts.length).toBe(3);
    expect(dds.length).toBe(3);
  });

  it("applies layout and emphasis modifier classes", async () => {
    const wrapper = await mountSuspended(TuxDescriptionList, {
      props: {
        layout: "stacked",
        emphasis: "data",
        items: [{ term: "Speed", value: "65 mph" }],
      },
    });

    const dl = wrapper.find("dl");
    expect(dl.classes()).toContain("tux-dl--stacked");
    expect(dl.classes()).toContain("tux-dl--data");
  });

  it("passes WCAG 2.2 AAA accessibility audit with zero violations", async () => {
    const wrapper = await mountSuspended(TuxDescriptionList, {
      props: {
        title: "Metadata",
        items: [
          { term: "Status", value: "Active" },
          { term: "Version", value: "3.0.0" },
        ],
      },
    });

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
