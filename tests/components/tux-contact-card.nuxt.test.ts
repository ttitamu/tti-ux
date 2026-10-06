import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxContactCard from "../../app/components/TuxContactCard.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxContactCard Component", () => {
  const sampleContacts = [
    { type: "email" as const, value: "m-blake@tti.tamu.edu" },
    { type: "phone" as const, value: "(979) 317-2000" },
    { type: "office" as const, value: "TTI State Headquarters 314" },
    { type: "web" as const, value: "https://tti.tamu.edu", label: "Research Profile" },
  ];

  it("renders vertical directory card with initials fallback and contact rows", async () => {
    const wrapper = await mountSuspended(TuxContactCard, {
      props: {
        name: "Dr. Marcus Blake",
        role: "Senior Research Scientist",
        affiliation: "Center for Connected Transportation",
        credentials: "Ph.D., P.E.",
        tone: "maroon",
        contacts: sampleContacts,
        layout: "vertical",
      },
    });

    expect(wrapper.classes()).toContain("tux-contact-card");
    expect(wrapper.classes()).toContain("tux-contact-card--vertical");
    expect(wrapper.find(".tux-contact-card__name").text()).toContain("Dr. Marcus Blake");
    expect(wrapper.find(".tux-contact-card__credentials").text()).toBe(", Ph.D., P.E.");
    expect(wrapper.find(".tux-contact-card__role").text()).toBe("Senior Research Scientist");
    expect(wrapper.find(".tux-contact-card__affiliation").text()).toBe("Center for Connected Transportation");
    expect(wrapper.find(".tux-contact-card__portrait").text()).toBe("D");

    const emailLink = wrapper.find('a[href="mailto:m-blake@tti.tamu.edu"]');
    expect(emailLink.exists()).toBe(true);
    const phoneLink = wrapper.find('a[href="tel:9793172000"]');
    expect(phoneLink.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders horizontal layout with image portrait", async () => {
    const wrapper = await mountSuspended(TuxContactCard, {
      props: {
        name: "Elena Rostova",
        role: "Lead Systems Engineer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        layout: "horizontal",
        contacts: [{ type: "email" as const, value: "e-rostova@tti.tamu.edu" }],
      },
    });

    expect(wrapper.classes()).toContain("tux-contact-card--horizontal");
    const img = wrapper.find("img.tux-contact-card__portrait--image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("Portrait of Elena Rostova");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
