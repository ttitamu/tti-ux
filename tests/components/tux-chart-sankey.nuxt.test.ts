import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxChartSankey, { type SankeyLink, type SankeyNode } from "~/components/TuxChartSankey.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxChartSankey Component", () => {
  const sampleNodes: SankeyNode[] = [
    { id: "north", label: "North Origin" },
    { id: "south", label: "South Origin" },
    { id: "managed", label: "Managed Corridor" },
    { id: "mainlane", label: "Mainlanes" },
    { id: "transit", label: "Express Transit" },
    { id: "auto", label: "Auto Commute" },
  ];

  const sampleLinks: SankeyLink[] = [
    { source: "north", target: "managed", value: 24 },
    { source: "north", target: "mainlane", value: 36 },
    { source: "south", target: "managed", value: 16 },
    { source: "south", target: "mainlane", value: 28 },
    { source: "managed", target: "transit", value: 25 },
    { source: "managed", target: "auto", value: 15 },
    { source: "mainlane", target: "auto", value: 64 },
  ];

  it("infers multi-stage topology, renders cubic-Bezier ribbons and node totals, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxChartSankey, {
      props: {
        nodes: sampleNodes,
        links: sampleLinks,
        units: "k trips",
      },
    });

    expect(wrapper.find(".tux-chart-sankey").exists()).toBe(true);
    const svg = wrapper.find("svg.tux-chart-sankey__svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("tabindex")).toBe("0");
    expect(svg.attributes("role")).toBe("img");

    const linkPaths = wrapper.findAll(".tux-chart-sankey__link");
    expect(linkPaths.length).toBe(sampleLinks.length);
    expect(linkPaths[0]!.attributes("d")).toContain("C");

    const nodeRects = wrapper.findAll(".tux-chart-sankey__node");
    expect(nodeRects.length).toBe(sampleNodes.length);

    // Stage 0 origin x should precede Stage 1 corridor x, which precedes Stage 2 destination x
    const xNorth = Number(nodeRects[0]!.attributes("x"));
    const xManaged = Number(nodeRects[2]!.attributes("x"));
    const xTransit = Number(nodeRects[4]!.attributes("x"));
    expect(xNorth).toBeLessThan(xManaged);
    expect(xManaged).toBeLessThan(xTransit);

    expect(wrapper.text()).toContain("North Origin");
    expect(wrapper.text()).toContain("60 k trips");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports keyboard roving cursor, hover emit, CVD palette, and tooltip disabling", async () => {
    const wrapper = await mountSuspended(TuxChartSankey, {
      props: {
        nodes: sampleNodes,
        links: sampleLinks,
        palette: "cvd",
      },
    });

    expect(wrapper.classes()).toContain("tux-chart--cvd");

    const svg = wrapper.find("svg.tux-chart-sankey__svg");
    await svg.trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted("hover")).toBeTruthy();
    expect(wrapper.find(".tux-chart-sankey__tooltip").exists()).toBe(true);

    await svg.trigger("keydown", { key: "Escape" });
    expect(wrapper.find(".tux-chart-sankey__tooltip").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);

    const staticWrapper = await mountSuspended(TuxChartSankey, {
      props: {
        nodes: sampleNodes,
        links: sampleLinks,
        tooltip: false,
      },
    });
    await staticWrapper.find("svg.tux-chart-sankey__svg").trigger("keydown", { key: "ArrowRight" });
    expect(staticWrapper.find(".tux-chart-sankey__tooltip").exists()).toBe(false);
  });
});
