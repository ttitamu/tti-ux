import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCapabilityCluster from "../../app/components/TuxCapabilityCluster.vue";

describe("TuxCapabilityCluster Component", () => {
  it("renders 6 research capability medallions with default props", async () => {
    const wrapper = await mountSuspended(TuxCapabilityCluster, {
      props: {
        title: "RESEARCH CAPABILITIES",
        kicker: "Multidisciplinary Excellence",
        subtitle: "Specialized transportation operational disciplines.",
      },
    });

    expect(wrapper.text()).toContain("RESEARCH CAPABILITIES");
    expect(wrapper.text()).toContain("Multidisciplinary Excellence");
    expect(wrapper.text()).toContain("Specialized transportation operational disciplines.");

    expect(wrapper.text()).toContain("Crash Safety & Roadside Hardware");
    expect(wrapper.text()).toContain("Connected & Automated Transportation");
    expect(wrapper.text()).toContain("Infrastructure & Materials");
    expect(wrapper.text()).toContain("Traffic Operations & Mobility");
    expect(wrapper.text()).toContain("Transit & Multimodal Freight");
    expect(wrapper.text()).toContain("Policy, Economics & Investment");

    const cards = wrapper.findAll(".tux-capability-card");
    expect(cards.length).toBe(6);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders topic tags and halo color variants", async () => {
    const wrapper = await mountSuspended(TuxCapabilityCluster, {
      props: {
        columns: 2,
        capabilities: [
          {
            title: "Artificial Intelligence Studio",
            description: "Agentic modeling and synthetic data simulation.",
            haloColor: "maroon",
            topics: ["Generative UI", "Autonomous Workflows"],
          },
          {
            title: "Geospatial Intelligence",
            description: "TxDOT district telemetry and corridor flow analysis.",
            haloColor: "teal",
            topics: ["ArcGIS", "Vector Tiles"],
          },
        ],
      },
    });

    const grid = wrapper.find(".grid");
    expect(grid.classes()).toContain("sm:grid-cols-2");

    expect(wrapper.text()).toContain("Generative UI");
    expect(wrapper.text()).toContain("Autonomous Workflows");
    expect(wrapper.text()).toContain("ArcGIS");
    expect(wrapper.text()).toContain("Vector Tiles");

    const outerHalos = wrapper.findAll(".border-dashed");
    expect(outerHalos[0].classes()).toContain("border-brand-primary");
    expect(outerHalos[1].classes()).toContain("border-spectrum-teal");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports linked card mode via to / href", async () => {
    const wrapper = await mountSuspended(TuxCapabilityCluster, {
      props: {
        capabilities: [
          {
            title: "Atlas System",
            description: "Core analytics platform",
            to: "/examples/corridor-analytics",
          },
        ],
      },
    });

    const link = wrapper.find("a");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/examples/corridor-analytics");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
