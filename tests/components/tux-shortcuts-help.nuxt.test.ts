import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxShortcutsHelp from "../../app/components/TuxShortcutsHelp.vue";
import { runComponentAxe } from "../axe-helper";

// Polyfill showModal/close for happy-dom if needed
if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    };
  }
}

describe("TuxShortcutsHelp Component", () => {
  const sampleGroups = [
    {
      heading: "Navigation",
      items: [
        { keys: ["g", "t"], label: "Go to Design Tokens", description: "Jump to /tokens" },
        { keys: ["g", "c"], label: "Go to Component Health", description: "Jump to /components/health" },
      ],
    },
    {
      heading: "System",
      items: [
        { keys: ["meta", "k"], label: "Command Palette", description: "Open search overlay" },
        { keys: ["?"], label: "Help & Shortcuts" },
      ],
    },
  ];

  it("renders shortcut groups and items", async () => {
    const wrapper = await mountSuspended(TuxShortcutsHelp, {
      props: {
        groups: sampleGroups,
        sequenceSeparator: "then",
      },
    });

    expect(wrapper.element.tagName).toBe("DIALOG");
    expect(wrapper.classes()).toContain("tux-shortcuts");
    expect(wrapper.find(".tux-shortcuts__title").text()).toBe("Shortcuts");

    const headings = wrapper.findAll(".tux-shortcuts__group-heading");
    expect(headings.length).toBe(2);
    expect(headings[0].text()).toBe("Navigation");
    expect(headings[1].text()).toBe("System");

    expect(wrapper.text()).toContain("Go to Design Tokens");
    expect(wrapper.text()).toContain("Command Palette");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("exposes open and close methods", async () => {
    const wrapper = await mountSuspended(TuxShortcutsHelp, {
      props: {
        groups: sampleGroups,
      },
    });

    const vm = wrapper.vm as unknown as { open: () => void; close: () => void };
    vm.open();
    expect(wrapper.element.hasAttribute("open")).toBe(true);

    vm.close();
    expect(wrapper.element.hasAttribute("open")).toBe(false);
  });
});
