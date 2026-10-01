import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMcpEmbed from "~/components/TuxMcpEmbed.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMcpEmbed Component", () => {
  it("renders MCP app identity, controls, slot content, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMcpEmbed, {
      props: {
        appName: "Corridor Simulation Studio",
        source: "v2.4.0 · TxDOT MCP Server",
        appIcon: "lucide:cpu",
      },
      slots: {
        default: '<div class="sim-content">Interactive Simulation Canvas</div>',
      },
    });

    expect(wrapper.text()).toContain("Corridor Simulation Studio");
    expect(wrapper.text()).toContain("v2.4.0 · TxDOT MCP Server");
    expect(wrapper.text()).toContain("Interactive Simulation Canvas");

    const controls = wrapper.find("[role='toolbar']");
    expect(controls.exists()).toBe(true);
    expect(controls.attributes("aria-label")).toContain("Corridor Simulation Studio window controls");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles collapse toggling, loading skeleton state, and control event emissions", async () => {
    const wrapper = await mountSuspended(TuxMcpEmbed, {
      props: {
        appName: "Linear Tracker",
        loading: false,
        collapsible: true,
        expandable: true,
        closable: true,
      },
      slots: {
        default: "<p>Board content</p>",
      },
    });

    // Check expand button
    const expandBtn = wrapper.find("button[aria-label='Expand to full screen']");
    expect(expandBtn.exists()).toBe(true);
    await expandBtn.trigger("click");
    expect(wrapper.emitted("expand")).toBeTruthy();

    // Check exit button
    const closeBtn = wrapper.find("button[aria-label='Close']");
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger("click");
    expect(wrapper.emitted("exit")).toBeTruthy();

    // Check collapse button toggle
    const collapseBtn = wrapper.find("button[aria-label='Collapse']");
    expect(collapseBtn.exists()).toBe(true);
    expect(collapseBtn.attributes("aria-expanded")).toBe("true");
    await collapseBtn.trigger("click");
    expect(wrapper.emitted("collapse")).toBeTruthy();
    expect(wrapper.classes()).toContain("tux-mcp-embed--collapsed");

    // Loading state test
    const loadingWrapper = await mountSuspended(TuxMcpEmbed, {
      props: {
        appName: "Query Engine",
        loading: true,
      },
    });
    expect(loadingWrapper.find(".tux-mcp-embed__skeleton").exists()).toBe(true);
    expect(loadingWrapper.attributes("aria-busy")).toBe("true");

    const violations = await runComponentAxe(loadingWrapper.element);
    expect(violations).toEqual([]);
  });
});
