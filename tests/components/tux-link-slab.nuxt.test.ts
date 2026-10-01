import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxLinkSlab from "../../app/components/TuxLinkSlab.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxLinkSlab Component", () => {
  const sampleLinks = [
    { label: "Overview", to: "/research/overview", description: "Program scope and mission", icon: "lucide:book-open" },
    { label: "Corridor Testbeds", to: "/research/testbeds", description: "Active connected infrastructure", icon: "lucide:activity" },
    { label: "Publications", href: "https://tti.tamu.edu/publications", description: "Peer-reviewed papers", icon: "lucide:file-text" },
  ];

  it("renders navigation landmark with links, icons, and descriptions", async () => {
    const wrapper = await mountSuspended(TuxLinkSlab, {
      props: {
        links: sampleLinks,
        tone: "maroon",
        ariaLabel: "Corridor research navigation",
      },
    });

    expect(wrapper.element.tagName).toBe("NAV");
    expect(wrapper.classes()).toContain("tux-link-slab");
    expect(wrapper.classes()).toContain("tux-link-slab--maroon");
    expect(wrapper.attributes("aria-label")).toBe("Corridor research navigation");

    const items = wrapper.findAll(".tux-link-slab__item");
    expect(items.length).toBe(3);
    expect(items[0].text()).toContain("Overview");
    expect(items[0].text()).toContain("Program scope and mission");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders plain and neutral tones", async () => {
    const wrapper = await mountSuspended(TuxLinkSlab, {
      props: {
        links: sampleLinks.slice(0, 1),
        tone: "neutral",
      },
    });

    expect(wrapper.classes()).toContain("tux-link-slab--neutral");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
