import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCommHero from "../../app/components/TuxCommHero.vue";

describe("TuxCommHero Component", () => {
  it("renders 3-tier typography heading rhythm with default props", async () => {
    const wrapper = await mountSuspended(TuxCommHero, {
      props: {
        title: "RESEARCH CENTERS",
        eyebrow: "TEXAS A&M TRANSPORTATION INSTITUTE",
        accentTitle: "ADVANCING TRANSPORTATION INNOVATION",
        lead: "TTI houses state-of-the-art specialized research centers.",
      },
    });

    expect(wrapper.find("h1").text()).toBe("RESEARCH CENTERS");
    expect(wrapper.text()).toContain("TEXAS A&M TRANSPORTATION INSTITUTE");
    expect(wrapper.text()).toContain("ADVANCING TRANSPORTATION INNOVATION");
    expect(wrapper.text()).toContain("TTI houses state-of-the-art specialized research centers.");

    // Anchor block
    expect(wrapper.find("[aria-hidden='true'].bg-brand-accent").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles primary and secondary action buttons with click emits", async () => {
    const wrapper = await mountSuspended(TuxCommHero, {
      props: {
        title: "EXPLORE DIVISIONS",
        primaryActionText: "View Directory",
        secondaryActionText: "Annual Report",
      },
    });

    expect(wrapper.text()).toContain("View Directory");
    expect(wrapper.text()).toContain("Annual Report");

    const buttons = wrapper.findAllComponents({ name: "TuxButton" });
    expect(buttons.length).toBe(2);

    await buttons[0].trigger("click");
    expect(wrapper.emitted("primary-click")).toBeTruthy();

    await buttons[1].trigger("click");
    expect(wrapper.emitted("secondary-click")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders framed image and badge overlay when imageSrc is provided", async () => {
    const wrapper = await mountSuspended(TuxCommHero, {
      props: {
        title: "RELLIS CAMPUS",
        imageSrc: "https://example.com/rellis.jpg",
        imageAlt: "RELLIS Proving Grounds Proving Track",
        imageBadge: "Facility Spotlight",
        chamfer: true,
      },
    });

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/rellis.jpg");
    expect(img.attributes("alt")).toBe("RELLIS Proving Grounds Proving Track");
    expect(wrapper.text()).toContain("Facility Spotlight");
    expect(wrapper.classes()).toContain("pb-12");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
