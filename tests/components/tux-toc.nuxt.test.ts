import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeAll, describe, expect, it } from "vitest";
import TuxTOC from "~/components/TuxTOC.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxTOC Component", () => {
  beforeAll(() => {
    if (typeof window !== "undefined") {
      if (!window.IntersectionObserver) {
        window.IntersectionObserver = class {
          observe() {}
          unobserve() {}
          disconnect() {}
        } as any;
      }
    }
  });

  const sampleItems = [
    { id: "overview", label: "Overview & Methodology", depth: 2 },
    { id: "sensor-grid", label: "Sensor Grid Deployment", depth: 3 },
    { id: "findings", label: "Statewide Findings", depth: 2 },
  ];

  it("renders table of contents list and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxTOC, {
      props: {
        items: sampleItems,
        title: "On this page",
      },
    });

    expect(wrapper.text()).toContain("On this page");
    expect(wrapper.text()).toContain("Overview & Methodology");
    expect(wrapper.text()).toContain("Sensor Grid Deployment");
    expect(wrapper.text()).toContain("Statewide Findings");

    const links = wrapper.findAll("a.tux-toc__link");
    expect(links.length).toBe(3);
    expect(links[0]!.attributes("href")).toBe("#overview");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports noTitle prop to omit title banner", async () => {
    const wrapper = await mountSuspended(TuxTOC, {
      props: {
        items: sampleItems,
        noTitle: true,
      },
    });

    expect(wrapper.find(".tux-toc__title").exists()).toBe(false);
    expect(wrapper.text()).toContain("Overview & Methodology");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
