import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxFrameworkSwitcher from "../../app/components/TuxFrameworkSwitcher.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFrameworkSwitcher Component", () => {
  it("renders segmented tablist with framework options and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxFrameworkSwitcher, {
      props: {
        mode: "segmented",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("tux-framework-switcher");

    const tablist = wrapper.find("[role='tablist']");
    expect(tablist.exists()).toBe(true);
    expect(tablist.attributes("aria-label")).toBe("Preferred code framework");

    const tabs = wrapper.findAll("[role='tab']");
    expect(tabs.length).toBe(8);
    expect(wrapper.text()).toContain("Vue");
    expect(wrapper.text()).toContain("React");
    expect(wrapper.text()).toContain("Web Comp");
    expect(wrapper.text()).toContain(".NET");
    expect(wrapper.text()).toContain("Python");
    expect(wrapper.text()).toContain("PHP");
    expect(wrapper.text()).toContain("Swift");
    expect(wrapper.text()).toContain("Kotlin");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches active tab when clicked", async () => {
    const wrapper = await mountSuspended(TuxFrameworkSwitcher, {
      props: {
        mode: "segmented",
      },
    });

    const reactTab = wrapper
      .findAll("[role='tab']")
      .find((t) => t.text().includes("React"));
    expect(reactTab).toBeDefined();

    await reactTab?.trigger("click");
    expect(reactTab?.attributes("aria-selected")).toBe("true");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders compact trigger button with accessible label", async () => {
    const wrapper = await mountSuspended(TuxFrameworkSwitcher, {
      props: {
        mode: "compact",
      },
    });

    const btn = wrapper.find("button.tux-framework-btn");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toBe("Select preferred framework syntax");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
