import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeAll, describe, expect, it } from "vitest";
import TuxAppFrame from "~/components/TuxAppFrame.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxAppFrame Component", () => {
  beforeAll(() => {
    if (typeof window !== "undefined") {
      if (!window.ResizeObserver) {
        window.ResizeObserver = class {
          observe() {}
          unobserve() {}
          disconnect() {}
        };
      }
    }
  });

  it("renders with title, eyebrow, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxAppFrame, {
      props: {
        title: "Mobility Analyst Desktop",
        eyebrow: "TTI Connected Suite",
      },
    });

    expect(wrapper.text()).toContain("Mobility Analyst Desktop");
    expect(wrapper.text()).toContain("TTI Connected Suite");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports forceChrome and emits window events", async () => {
    const wrapper = await mountSuspended(TuxAppFrame, {
      props: {
        title: "Tauri Console",
        forceChrome: true,
      },
      slots: {
        center: () => "Search Corridors",
        right: () => "User Profile",
      },
    });

    expect(wrapper.text()).toContain("Search Corridors");
    expect(wrapper.text()).toContain("User Profile");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
