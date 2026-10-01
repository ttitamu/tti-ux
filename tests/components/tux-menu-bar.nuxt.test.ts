import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMenuBar from "~/components/TuxMenuBar.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMenuBar Component", () => {
  const sampleMenus = [
    {
      label: "File",
      items: [
        [{ label: "New Telemetry Session", icon: "lucide:plus" }],
        [{ label: "Export CSV", icon: "lucide:download" }],
      ],
    },
    {
      label: "View",
      items: [
        [{ label: "Toggle Map", icon: "lucide:map" }],
      ],
    },
  ];

  it("renders menubar with items and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMenuBar, {
      props: {
        menus: sampleMenus,
        renderOnMac: true,
      },
    });

    expect(wrapper.find(".tux-menu-bar").exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("menubar");
    expect(wrapper.text()).toContain("File");
    expect(wrapper.text()).toContain("View");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("respects renderOnMac false on macOS platform", async () => {
    const wrapper = await mountSuspended(TuxMenuBar, {
      props: {
        menus: sampleMenus,
        renderOnMac: false,
      },
    });

    // On macOS, it defaults to deferring to native OS menu
    const isMac = typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("mac");
    if (isMac) {
      expect(wrapper.find(".tux-menu-bar").exists()).toBe(false);
    }
  });
});
