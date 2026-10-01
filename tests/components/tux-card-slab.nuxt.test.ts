import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCardSlab from "../../app/components/TuxCardSlab.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCardSlab Component", () => {
  const sampleCards = [
    { title: "Connected Work Zones", eyebrow: "Operations", to: "/research/work-zones" },
    { title: "Freight Mobility", eyebrow: "Logistics", to: "/research/freight" },
    { title: "Crash Analytics", eyebrow: "Safety", to: "/research/safety" },
  ];

  it("renders card slab with heading, eyebrow, and card items", async () => {
    const wrapper = await mountSuspended(TuxCardSlab, {
      props: {
        cards: sampleCards,
        heading: "Explore TTI Research Programs",
        eyebrow: "Institutional Initiatives",
        columns: 3,
      },
    });

    expect(wrapper.classes()).toContain("tux-card-slab");
    expect(wrapper.find(".tux-card-slab__heading").text()).toBe("Explore TTI Research Programs");
    expect(wrapper.find(".tux-card-slab__eyebrow").text()).toBe("Institutional Initiatives");

    const cards = wrapper.findAll(".tux-card-slab__card");
    expect(cards.length).toBe(3);
    expect(cards[0].text()).toContain("Connected Work Zones");
    expect(cards[0].text()).toContain("Operations");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders 2-column layout with external links", async () => {
    const wrapper = await mountSuspended(TuxCardSlab, {
      props: {
        cards: [
          { title: "USDOT University Transportation Center", href: "https://www.transportation.gov", eyebrow: "Federal" },
        ],
        columns: 2,
        inset: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-card-slab--inset");
    const link = wrapper.find('a[href="https://www.transportation.gov"]');
    expect(link.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
