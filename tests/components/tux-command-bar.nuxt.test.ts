// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCommandBar from "../../app/components/TuxCommandBar.vue";

describe("TuxCommandBar Component", () => {
  it("renders action buttons in default mode with accessible toolbar role", async () => {
    const wrapper = await mountSuspended(TuxCommandBar, {
      slots: {
        actions: () => h("button", { class: "btn-action", "aria-label": "New Page" }, "New Page"),
        views: () => h("div", { class: "view-switcher" }, "Switcher"),
      },
    });

    expect(wrapper.find("[data-testid='tux-command-bar']").exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("toolbar");
    expect(wrapper.attributes("aria-label")).toBe("Command actions");
    expect(wrapper.find(".btn-action").text()).toBe("New Page");
    expect(wrapper.find(".view-switcher").text()).toBe("Switcher");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches to selection mode when selectedCount > 0 and handles clear-selection", async () => {
    const wrapper = await mountSuspended(TuxCommandBar, {
      props: {
        selectedCount: 4,
      },
      slots: {
        "selection-actions": () => h("button", { class: "batch-delete", "aria-label": "Batch Delete" }, "Batch Delete"),
      },
    });

    expect(wrapper.text()).toContain("4 selected");
    expect(wrapper.find(".batch-delete").text()).toBe("Batch Delete");

    // Click deselect button
    const deselectBtn = wrapper.findAll("button").find(b => b.text().includes("Deselect"));
    expect(deselectBtn).toBeDefined();
    await deselectBtn!.trigger("click");
    expect(wrapper.emitted("clear-selection")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports comfortable density and unbordered mode", async () => {
    const wrapper = await mountSuspended(TuxCommandBar, {
      props: {
        density: "comfortable",
        bordered: false,
      },
    });

    expect(wrapper.classes()).toContain("px-4");
    expect(wrapper.classes()).not.toContain("border");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});

