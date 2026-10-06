import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxMobileFrame from "~/components/TuxMobileFrame.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxMobileFrame Component", () => {
  it("renders iOS platform frame, Dynamic Island, time, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxMobileFrame, {
      props: {
        platform: "ios",
        width: 320,
        color: "natural",
        time: "10:30",
        notch: true,
        homeIndicator: true,
      },
      slots: {
        default: "<div class='mock-app'>Mobile Application Content</div>",
      },
    });

    const figure = wrapper.find("figure");
    expect(figure.exists()).toBe(true);
    expect(figure.classes()).toContain("tux-mobile-frame--ios");
    expect(figure.classes()).toContain("tux-mobile-frame--ios-natural");
    expect(figure.attributes("aria-label")).toBe("iPhone preview");

    expect(wrapper.find(".tux-mobile-frame__statusbar-time").text()).toBe("10:30");
    expect(wrapper.find(".tux-mobile-frame__island").exists()).toBe(true);
    expect(wrapper.find(".tux-mobile-frame__home-indicator").exists()).toBe(true);
    expect(wrapper.text()).toContain("Mobile Application Content");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders Android platform frame, camera punch-hole, and custom navStyle", async () => {
    const wrapper = await mountSuspended(TuxMobileFrame, {
      props: {
        platform: "android",
        width: 300,
        color: "obsidian",
        navStyle: "three-button",
        notch: true,
      },
      slots: {
        default: "<div class='pixel-app'>Android Pixel App</div>",
      },
    });

    const figure = wrapper.find("figure");
    expect(figure.classes()).toContain("tux-mobile-frame--android");
    expect(figure.classes()).toContain("tux-mobile-frame--android-obsidian");
    expect(figure.attributes("aria-label")).toBe("Android preview");

    expect(wrapper.find(".tux-mobile-frame__camera").exists()).toBe(true);
    expect(wrapper.find(".tux-mobile-frame__nav-three").exists()).toBe(true);
    expect(wrapper.text()).toContain("Android Pixel App");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
