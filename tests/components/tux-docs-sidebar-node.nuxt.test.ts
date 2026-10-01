import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import TuxDocsSidebarNode from "../../app/components/TuxDocsSidebarNode.vue";
import { runComponentAxe } from "../axe-helper";

// Container wrapper providing <ul> context for <li> list item component
const TuxDocsSidebarNodeHarness = defineComponent({
  name: "TuxDocsSidebarNodeHarness",
  props: {
    section: { type: Object, required: true },
    path: { type: String, default: "" },
    query: { type: String, default: "" },
    openMap: { type: Object, default: () => ({}) },
    isOpen: { type: Function, default: () => true },
    isActive: { type: Function, default: () => false },
    onToggle: { type: Function, default: () => {} },
    depth: { type: Number, default: 0 },
  },
  setup(props) {
    return () => h("ul", { role: "list", class: "tux-test-sidebar-list" }, [
      h(TuxDocsSidebarNode, props as any),
    ]);
  },
});

describe("TuxDocsSidebarNode Component", () => {
  it("renders a collapsible group with children and passes accessibility checks", async () => {
    const section = {
      label: "Component Doctrine",
      icon: "lucide:layers",
      children: [
        { label: "Design Principles", to: "/docs/principles" },
        { label: "Token Conventions", to: "/docs/tokens" },
      ],
    };

    const wrapper = await mountSuspended(TuxDocsSidebarNodeHarness, {
      props: {
        section,
        path: "Component Doctrine",
        query: "",
        openMap: { "Component Doctrine": true },
        isOpen: () => true,
        isActive: () => false,
        onToggle: vi.fn(),
        depth: 0,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Component Doctrine");
    expect(wrapper.text()).toContain("Design Principles");
    expect(wrapper.text()).toContain("Token Conventions");

    // Details/summary group rendered
    const summary = wrapper.find("summary");
    expect(summary.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders a leaf navigation link and highlights query matches", async () => {
    const section = {
      label: "Autonomous Freight Corridor",
      to: "/docs/freight-corridor",
    };

    const wrapper = await mountSuspended(TuxDocsSidebarNodeHarness, {
      props: {
        section,
        path: "Autonomous Freight Corridor",
        query: "Freight",
        openMap: {},
        isOpen: () => false,
        isActive: (s: any) => s.to === "/docs/freight-corridor",
        onToggle: vi.fn(),
        depth: 1,
      },
    });

    expect(wrapper.find("a").exists()).toBe(true);
    expect(wrapper.find("a").attributes("href")).toBe("/docs/freight-corridor");
    expect(wrapper.find("mark").exists()).toBe(true);
    expect(wrapper.find("mark").text()).toBe("Freight");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
