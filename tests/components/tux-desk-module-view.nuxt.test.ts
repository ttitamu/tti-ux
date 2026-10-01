import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import TuxDeskModuleView from "../../app/components/desk/TuxDeskModuleView.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDeskModuleView Component", () => {
  function createMockProps(overrides: Record<string, any> = {}) {
    return {
      node: {
        attrs: {
          kind: "callout",
          payload: {
            title: "Safety Advisory Notice",
            description: "High-visibility vests and helmets must be worn on testing premises.",
            tone: "warning",
            _colStart: "1",
            _colSpan: "12",
          },
        },
        nodeSize: 10,
      },
      editor: {
        isEditable: true,
        state: {
          doc: {
            resolve: () => ({
              index: () => 0,
              posAtIndex: () => 0,
              parent: { childCount: 1, child: () => ({ nodeSize: 10 }) },
            }),
          },
          tr: {
            delete: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
          },
        },
        view: {
          dispatch: vi.fn(),
        },
      },
      getPos: () => 0,
      updateAttributes: vi.fn(),
      deleteNode: vi.fn(),
      selected: false,
      decorations: [],
      extension: {},
      ...overrides,
    };
  }

  it("renders module header ribbon, preview, and passes accessibility checks", async () => {
    const props = createMockProps();
    const wrapper = await mountSuspended(TuxDeskModuleView, { props });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("tux-desk-node-view");
    expect(wrapper.text()).toContain("Callout Alert");
    expect(wrapper.text()).toContain("Safety Advisory Notice");

    // Grid footprint indicator
    expect(wrapper.text()).toContain("Cols 1–12 (12/12)");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders configuration inspector when selected and editable", async () => {
    const props = createMockProps({ selected: true });
    const wrapper = await mountSuspended(TuxDeskModuleView, { props });

    expect(wrapper.classes()).toContain("tux-desk-node-view--selected");
    expect(wrapper.find(".tux-desk-node-view__inspector").exists()).toBe(true);
    expect(wrapper.text()).toContain("Configure Callout Alert");

    // Form inputs rendered in inspector
    const titleInput = wrapper.find<HTMLInputElement>("input[type='text']");
    expect(titleInput.exists()).toBe(true);
    expect(titleInput.element.value).toBe("Safety Advisory Notice");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("triggers deleteNode when remove button is clicked", async () => {
    const deleteNode = vi.fn();
    const props = createMockProps({ deleteNode });
    const wrapper = await mountSuspended(TuxDeskModuleView, { props });

    const removeBtn = wrapper.find("button[title='Remove module']");
    expect(removeBtn.exists()).toBe(true);
    await removeBtn.trigger("click");

    expect(deleteNode).toHaveBeenCalledOnce();
  });
});
