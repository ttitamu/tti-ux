import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxTreeNode from "~/components/TuxTreeNode.vue";
import type { TreeItem } from "~/components/TuxTree.vue";
import { runComponentAxe } from "../axe-helper";

const sampleBranchNode: TreeItem = {
  id: "datasets",
  label: "Connected Corridors",
  description: "Real-time telemetry feeds",
  badge: "Active",
  children: [
    { id: "stream-1", label: "Austin Loop 1" },
    { id: "stream-2", label: "Houston I-610" },
  ],
};

const sampleLeafNode: TreeItem = {
  id: "file-doc",
  label: "Protocol-Specifications.pdf",
  mono: true,
  badge: "1.2 MB",
};

describe("TuxTreeNode Component", () => {
  it("renders branch treeitem with label, description, badge, and emits toggle/select", async () => {
    const wrapper = await mountSuspended(TuxTreeNode, {
      props: {
        node: sampleBranchNode,
        depth: 0,
        selectedId: "datasets",
        isExpanded: (id: string) => id === "datasets",
        showGuides: true,
      },
    });

    expect(wrapper.text()).toContain("Connected Corridors");
    expect(wrapper.text()).toContain("Real-time telemetry feeds");
    expect(wrapper.text()).toContain("Active");
    expect(wrapper.text()).toContain("Austin Loop 1");
    expect(wrapper.attributes("role")).toBe("treeitem");
    expect(wrapper.attributes("aria-expanded")).toBe("true");

    const row = wrapper.find(".tux-tree__row");
    await row.trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("toggle")).toBeTruthy();

    // Check accessibility with parent ul[role=tree] wrapper to satisfy treeitem parent requirement
    const container = document.createElement("ul");
    container.setAttribute("role", "tree");
    container.setAttribute("aria-label", "Test Tree");
    container.appendChild(wrapper.element.cloneNode(true));
    const violations = await runComponentAxe(container);
    expect(violations).toEqual([]);
  });

  it("renders leaf node with monospace styling and keyboard support", async () => {
    const wrapper = await mountSuspended(TuxTreeNode, {
      props: {
        node: sampleLeafNode,
        depth: 1,
        selectedId: undefined,
        isExpanded: () => false,
        showGuides: false,
      },
    });

    expect(wrapper.find(".tux-tree__row--mono").exists()).toBe(true);
    expect(wrapper.text()).toContain("Protocol-Specifications.pdf");
    expect(wrapper.text()).toContain("1.2 MB");

    const row = wrapper.find(".tux-tree__row");
    await row.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("select")?.[0]).toEqual(["file-doc"]);

    const container = document.createElement("ul");
    container.setAttribute("role", "tree");
    container.setAttribute("aria-label", "Test Tree");
    container.appendChild(wrapper.element.cloneNode(true));
    const violations = await runComponentAxe(container);
    expect(violations).toEqual([]);
  });
});
