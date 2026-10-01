import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxReactiveSidebar from "../../app/components/TuxReactiveSidebar.vue";

const mockSections = [
  {
    label: "01 // Doctrine",
    icon: "lucide:book-open",
    children: [
      { label: "Doctrine", to: "/design/tux", icon: "lucide:book-open" },
      { label: "Palette", to: "/design/palette", icon: "lucide:swatch-book" },
    ],
  },
  {
    label: "02 // Foundations",
    icon: "lucide:palette",
    children: [
      { label: "Tokens", to: "/tokens", icon: "lucide:palette" },
      { label: "Typography", to: "/typography", icon: "lucide:type" },
    ],
  },
];

describe("TuxReactiveSidebar Component", () => {
  it("renders with defaultExpanded: true showing section links", async () => {
    const wrapper = await mountSuspended(TuxReactiveSidebar, {
      props: {
        sections: mockSections,
        collapsed: false,
        activeAreaTitle: "Design Language",
        activeAreaIcon: "lucide:palette",
        defaultExpanded: true,
      },
    });

    expect(wrapper.find("[data-testid='tux-reactive-sidebar']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Design Language");
    expect(wrapper.text()).toContain("01 // Doctrine");
    expect(wrapper.text()).toContain("Doctrine");
    expect(wrapper.text()).toContain("Tokens");
  });

  it("starts compacted by default and reveals links on section toggle or expandAll", async () => {
    const wrapper = await mountSuspended(TuxReactiveSidebar, {
      props: {
        sections: mockSections,
        collapsed: false,
        activeAreaTitle: "Design Language",
      },
    });

    expect(wrapper.text()).toContain("01 // Doctrine");
    // Initially compacted: child links like Palette are not rendered
    expect(wrapper.text()).not.toContain("Palette");

    // Click section header to expand
    const sectionHeader = wrapper.findAll(".cursor-pointer").find((w) => w.text().includes("01 // Doctrine"));
    await sectionHeader?.trigger("click");

    expect(wrapper.text()).toContain("Palette");

    // Click section header again to compact
    await sectionHeader?.trigger("click");
    expect(wrapper.text()).not.toContain("Palette");
  });

  it("filters pages when search query is entered even if initially compacted", async () => {
    const wrapper = await mountSuspended(TuxReactiveSidebar, {
      props: {
        sections: mockSections,
        collapsed: false,
      },
    });

    const searchInput = wrapper.find("input[type='search']");
    expect(searchInput.exists()).toBe(true);

    await searchInput.setValue("Typography");
    expect(wrapper.text()).toContain("Typography");
    expect(wrapper.text()).not.toContain("Doctrine");
  });

  it("renders in collapsed mode as a compact rail with action icons", async () => {
    const wrapper = await mountSuspended(TuxReactiveSidebar, {
      props: {
        sections: mockSections,
        collapsed: true,
      },
    });

    expect(wrapper.classes()).toContain("w-16");
    expect(wrapper.find("input[type='search']").exists()).toBe(false);
    // Expand toggle button exists in collapsed mode
    const expandBtn = wrapper.find("button[title='Expand sidebar']");
    expect(expandBtn.exists()).toBe(true);

    // Should emit toggle-collapse when clicked
    await expandBtn.trigger("click");
    expect(wrapper.emitted("toggle-collapse")).toBeTruthy();
  });
});
