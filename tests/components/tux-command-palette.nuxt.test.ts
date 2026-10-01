import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeAll, describe, expect, it } from "vitest";
import TuxCommandPalette from "~/components/TuxCommandPalette.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCommandPalette Component", () => {
  beforeAll(() => {
    if (typeof HTMLDialogElement !== "undefined") {
      if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = function () {
          this.setAttribute("open", "");
        };
      }
      if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = function () {
          this.removeAttribute("open");
        };
      }
    }
  });

  const sampleGroups = [
    {
      heading: "Actions",
      category: "actions" as const,
      items: [
        { id: "act-theme", label: "Toggle Dark Mode", shortcut: "⌘D", badge: "Theme" },
      ],
    },
    {
      heading: "Tokens",
      category: "tokens" as const,
      items: [
        { id: "tok-primary", label: "--brand-primary", isColor: true, tokenValue: "#500000" },
      ],
    },
  ];

  it("renders with groups and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxCommandPalette, {
      props: {
        groups: sampleGroups,
        disableHotkey: true,
      },
    });

    expect(wrapper.find(".tux-cmd").exists()).toBe(true);
    expect(wrapper.find("input").attributes("placeholder")).toContain("Type a command");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("opens modal and displays command list items", async () => {
    const wrapper = await mountSuspended(TuxCommandPalette, {
      props: {
        groups: sampleGroups,
        disableHotkey: true,
      },
    });

    wrapper.vm.open();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Toggle Dark Mode");
    expect(wrapper.text()).toContain("--brand-primary");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters items when query is entered", async () => {
    const wrapper = await mountSuspended(TuxCommandPalette, {
      props: {
        groups: sampleGroups,
        disableHotkey: true,
      },
    });

    wrapper.vm.open();
    await wrapper.vm.$nextTick();

    const input = wrapper.find("input");
    await input.setValue("Dark");

    expect(wrapper.text()).toContain("Toggle Dark Mode");
    expect(wrapper.text()).not.toContain("--brand-primary");
  });
});
