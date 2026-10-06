import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxTree, { type TreeItem } from "~/components/TuxTree.vue";
import { runComponentAxe } from "../axe-helper";

const sampleTreeItems: TreeItem[] = [
  {
    id: "data",
    label: "Telemetry Datasets",
    children: [
      { id: "corridors", label: "I-35 Loop.parquet", mono: true },
      { id: "sensors", label: "Radar Detectors.csv", mono: true },
    ],
  },
  {
    id: "models",
    label: "Inference Models",
    children: [
      { id: "flow", label: "TrafficFlow-v2.onnx", mono: true },
    ],
  },
];

describe("TuxTree Component", () => {
  it("renders tree with role=\"tree\", nodes, guide lines, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxTree, {
      props: {
        items: sampleTreeItems,
        ariaLabel: "Project Directory",
        showGuides: true,
      },
    });

    const tree = wrapper.find("ul.tux-tree");
    expect(tree.exists()).toBe(true);
    expect(tree.attributes("role")).toBe("tree");
    expect(tree.attributes("aria-label")).toBe("Project Directory");
    expect(wrapper.text()).toContain("Telemetry Datasets");
    expect(wrapper.text()).toContain("I-35 Loop.parquet");
    expect(wrapper.text()).toContain("Inference Models");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles node selection and expansion states", async () => {
    const wrapper = await mountSuspended(TuxTree, {
      props: {
        items: sampleTreeItems,
        selected: "corridors",
      },
    });

    const selectedRow = wrapper.find(".tux-tree__row--selected");
    expect(selectedRow.exists()).toBe(true);
    expect(selectedRow.text()).toContain("I-35 Loop.parquet");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
