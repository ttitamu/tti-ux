import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxDeskInspector from "../../app/components/desk/TuxDeskInspector.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskInspector Component", () => {
  it("renders document metadata inspection form and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDeskInspector, {
      props: {
        pageMeta: {
          title: "Connected Corridors Research Brief",
          slug: "connected-corridors-brief",
          reviewCadenceDays: 90,
          status: "draft",
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Page Settings");
    expect(wrapper.text()).toContain("Document Title");
    const titleInput = wrapper.find<HTMLInputElement>("input[type='text']");
    expect(titleInput.exists()).toBe(true);
    expect(titleInput.element.value).toBe("Connected Corridors Research Brief");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders module properties when a desk module node is selected", async () => {
    const wrapper = await mountSuspended(TuxDeskInspector, {
      props: {
        selectedNode: {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              title: "Important Safety Advisory",
              description: "Mandatory speed reduction during automated vehicle trials.",
            },
          },
        },
        selectedIndex: 0,
      },
    });

    expect(wrapper.text()).toContain("Block Properties");
    expect(wrapper.text()).toContain("12-Column Grid Matrix");
    const input = wrapper.find<HTMLInputElement>("input[type='text']");
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe("Important Safety Advisory");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
