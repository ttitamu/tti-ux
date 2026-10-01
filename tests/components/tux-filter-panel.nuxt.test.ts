import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFilterPanel from "../../app/components/TuxFilterPanel.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFilterPanel Component", () => {
  const sampleFacets = [
    {
      name: "type",
      label: "Document Type",
      buckets: [
        { value: "report", label: "Research Report", count: 42 },
        { value: "dataset", label: "Telemetry Dataset", count: 18 },
      ],
    },
    {
      name: "access",
      label: "Access Tier",
      buckets: [
        { value: "public", label: "Public Domain", count: 55 },
        { value: "restricted", label: "Restricted / Sponsor", count: 5 },
      ],
    },
  ];

  it("renders facet accordion and applied filter chips", async () => {
    const wrapper = await mountSuspended(TuxFilterPanel, {
      props: {
        facets: sampleFacets,
        title: "Filter Artifacts",
        modelValue: {
          type: ["report"],
        },
      },
    });

    expect(wrapper.element.tagName).toBe("ASIDE");
    expect(wrapper.classes()).toContain("tux-filter-panel");
    expect(wrapper.find(".tux-filter-panel__title").text()).toBe("Filter Artifacts");

    const appliedChips = wrapper.findAllComponents({ name: "TuxRemovableChip" });
    expect(appliedChips.length).toBe(1);
    expect(wrapper.text()).toContain("Document Type:");
    expect(wrapper.text()).toContain("Research Report");

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(4);
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[1].element as HTMLInputElement).checked).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits updated filter selections when toggling checkboxes", async () => {
    const wrapper = await mountSuspended(TuxFilterPanel, {
      props: {
        facets: sampleFacets,
        modelValue: {},
      },
    });

    const firstCheckbox = wrapper.find('input[type="checkbox"]');
    await firstCheckbox.setValue(true);

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([{ type: ["report"] }]);
  });
});
