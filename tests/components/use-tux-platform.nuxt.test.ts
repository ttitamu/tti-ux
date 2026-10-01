import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { useTuxPlatform, _refreshTuxPlatform } from "~/composables/useTuxPlatform";
import { runComponentAxe } from "../axe-helper";

describe("useTuxPlatform Composable", () => {
  it("detects runtime platform attributes, binds to html dataset, and passes accessibility checks", async () => {
    const TestComponent = defineComponent({
      setup() {
        const platform = useTuxPlatform();
        return { platform };
      },
      render() {
        return h(
          "div",
          {
            class: "platform-inspector",
            role: "region",
            "aria-label": "Platform Inspector",
          },
          [
            h("p", { class: "os-label" }, `OS: ${this.platform.os}`),
            h("p", { class: "mod-label" }, `Modifier: ${this.platform.primaryModifier}`),
            h("p", { class: "tauri-label" }, `Tauri: ${this.platform.tauri}`),
            h("p", { class: "ready-label" }, `Ready: ${this.platform.ready}`),
          ]
        );
      },
    });

    const wrapper = await mountSuspended(TestComponent);

    expect(wrapper.find(".os-label").text()).toContain("OS:");
    expect(wrapper.find(".mod-label").text()).toContain("Modifier:");
    expect(wrapper.find(".ready-label").text()).toBe("Ready: true");

    // dataset on document.documentElement should reflect platform
    expect(document.documentElement.dataset.platform).toBeDefined();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("exposes primaryModifier and responds to _refreshTuxPlatform", () => {
    _refreshTuxPlatform();
    const platform = useTuxPlatform();
    expect(["meta", "ctrl"]).toContain(platform.value.primaryModifier);
    expect(["mac", "win", "linux", "ios", "android", "web"]).toContain(platform.value.os);
    expect(typeof platform.value.tauri).toBe("boolean");
  });
});
