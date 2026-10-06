import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxProgram from "~/components/TuxProgram.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxProgram Component", () => {
  it("renders program card with hero, summary, leads, metrics, funders, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxProgram, {
      props: {
        name: "Connected Transportation Initiative",
        eyebrow: "Strategic Research Program",
        summary: "Accelerating connected and automated vehicle deployments through real-world corridor testing and vehicle-to-everything (V2X) communication standards.",
        hero: "/images/connected-vehicles.jpg",
        leads: ["Dr. Robert Benz", "Dr. Beverly Kuhn"],
        funders: ["USDOT", "TxDOT", "NSF"],
        metrics: [
          { label: "Active Testbeds", value: 3 },
          { label: "Publications", value: 45 },
          { label: "Connected Corridors", value: "120 mi" },
        ],
        to: "/programs/connected-transportation",
      },
    });

    expect(wrapper.text()).toContain("Connected Transportation Initiative");
    expect(wrapper.text()).toContain("Strategic Research Program");
    expect(wrapper.text()).toContain("Accelerating connected and automated vehicle deployments");
    expect(wrapper.text()).toContain("Dr. Robert Benz, Dr. Beverly Kuhn");
    expect(wrapper.text()).toContain("USDOT");
    expect(wrapper.text()).toContain("Active Testbeds");
    expect(wrapper.text()).toContain("120 mi");

    const img = wrapper.find("img.tux-program__hero");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("Connected Transportation Initiative");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports compact and featured layouts", async () => {
    const compactWrapper = await mountSuspended(TuxProgram, {
      props: {
        name: "Roadway Safety Program",
        summary: "Pioneering roadside safety hardware and crash analytics.",
        layout: "compact",
      },
    });

    expect(compactWrapper.find(".tux-program--compact").exists()).toBe(true);
    expect(compactWrapper.text()).toContain("Roadway Safety Program");

    const violationsCompact = await runComponentAxe(compactWrapper.element);
    expect(violationsCompact).toEqual([]);

    const featuredWrapper = await mountSuspended(TuxProgram, {
      props: {
        name: "Freight Mobility & Logistics",
        eyebrow: "Flagship Initiative",
        hero: "/images/freight.jpg",
        layout: "featured",
      },
    });

    expect(featuredWrapper.find(".tux-program--featured").exists()).toBe(true);
    expect(featuredWrapper.find(".tux-program__hero-overlay").exists()).toBe(true);

    const violationsFeatured = await runComponentAxe(featuredWrapper.element);
    expect(violationsFeatured).toEqual([]);
  });
});
