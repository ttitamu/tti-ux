import { beforeAll, describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCardCarousel from "../../app/components/TuxCardCarousel.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCardCarousel Component", () => {
  beforeAll(() => {
    if (typeof window !== "undefined" && !window.matchMedia) {
      window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    }

    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    if (typeof window !== "undefined" && !window.ResizeObserver) {
      window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    }
    if (!globalThis.ResizeObserver) {
      globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    }
  });

  it("renders carousel header with title, eyebrow, and slide items", async () => {
    const wrapper = await mountSuspended(TuxCardCarousel, {
      props: {
        title: "Featured Research Initiatives",
        eyebrow: "Sponsored Programs",
        ariaLabel: "Featured research projects carousel",
      },
      slots: {
        default: () => [
          h("div", { class: "tux-card-carousel__slide" }, "Corridor Safety"),
          h("div", { class: "tux-card-carousel__slide" }, "Automated Vehicles"),
        ],
      },
    });

    expect(wrapper.find(".tux-card-carousel__title").text()).toBe("Featured Research Initiatives");
    expect(wrapper.find(".eyebrow").text()).toBe("Sponsored Programs");
    expect(wrapper.text()).toContain("Corridor Safety");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports bare mode without signature rule", async () => {
    const wrapper = await mountSuspended(TuxCardCarousel, {
      props: {
        title: "Compact Carousel",
        bare: true,
      },
    });

    expect(wrapper.find(".tux-card-carousel__title").text()).toBe("Compact Carousel");
    expect(wrapper.find(".tux-card-carousel__rule").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
