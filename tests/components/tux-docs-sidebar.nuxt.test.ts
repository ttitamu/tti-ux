import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeAll, describe, expect, it } from "vitest";
import TuxDocsSidebar from "~/components/TuxDocsSidebar.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxDocsSidebar Component", () => {
  beforeAll(() => {
    if (typeof window !== "undefined") {
      const storageMap = new Map<string, string>();
      const mockStorage = {
        getItem: (k: string) => storageMap.get(k) ?? null,
        setItem: (k: string, v: string) => storageMap.set(k, String(v)),
        removeItem: (k: string) => storageMap.delete(k),
        clear: () => storageMap.clear(),
        length: 0,
        key: () => null,
      };
      try {
        Object.defineProperty(window, "sessionStorage", {
          value: mockStorage,
          writable: true,
          configurable: true,
        });
      } catch {
        // Already defined or non-configurable
      }
    }
  });

  const sampleTree = [
    {
      label: "Getting Started",
      children: [
        { label: "Introduction", to: "/docs/intro" },
        { label: "Installation", to: "/docs/install" },
      ],
    },
    {
      label: "Architecture",
      children: [
        { label: "Design Tokens", to: "/docs/tokens" },
        { label: "Cross-Platform Bridge", to: "/docs/bridge" },
      ],
    },
  ];

  it("renders docs sidebar hierarchy and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxDocsSidebar, {
      props: {
        tree: sampleTree,
        title: "TUX Documentation",
        storageKey: null,
      },
    });

    expect(wrapper.text()).toContain("TUX Documentation");
    expect(wrapper.text()).toContain("Getting Started");
    expect(wrapper.text()).toContain("Introduction");
    expect(wrapper.text()).toContain("Architecture");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("filters doc items when query is entered in search bar", async () => {
    const wrapper = await mountSuspended(TuxDocsSidebar, {
      props: {
        tree: sampleTree,
        search: true,
        storageKey: null,
      },
    });

    const searchInput = wrapper.find("input[type='search']");
    expect(searchInput.exists()).toBe(true);

    await searchInput.setValue("Bridge");

    expect(wrapper.text()).toContain("Cross-Platform Bridge");
    expect(wrapper.text()).not.toContain("Introduction");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
