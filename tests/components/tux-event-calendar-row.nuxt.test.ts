import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxEventCalendarRow from "../../app/components/TuxEventCalendarRow.vue";

describe("TuxEventCalendarRow Component", () => {
  it("renders signature green date chip and event information", async () => {
    const wrapper = await mountSuspended(TuxEventCalendarRow, {
      props: {
        day: "30",
        month: "SEP",
        title: "Autonomous Corridor Telemetry Briefing",
        time: "Wednesday, September 30, 2026 @ 10:00 am - 11:30 am",
        location: "TTI Headquarters Room 102",
        category: "Symposium",
        actionText: "View Event",
      },
    });

    expect(wrapper.text()).toContain("30");
    expect(wrapper.text()).toContain("SEP");
    expect(wrapper.text()).toContain("Autonomous Corridor Telemetry Briefing");
    expect(wrapper.text()).toContain("Wednesday, September 30, 2026 @ 10:00 am - 11:30 am");
    expect(wrapper.text()).toContain("TTI Headquarters Room 102");
    expect(wrapper.text()).toContain("Symposium");
    expect(wrapper.text()).toContain("View Event");

    const chip = wrapper.find("[aria-hidden='true'].flex-shrink-0");
    expect(chip.classes()).toContain("bg-emerald-900"); // Default high-contrast green

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports internal route linking and external URLs", async () => {
    const internalWrapper = await mountSuspended(TuxEventCalendarRow, {
      props: {
        day: "15",
        month: "OCT",
        title: "Internal All-Hands",
        to: "/events/internal",
      },
    });
    expect(internalWrapper.find("a").attributes("href")).toBe("/events/internal");

    const externalWrapper = await mountSuspended(TuxEventCalendarRow, {
      props: {
        day: "22",
        month: "OCT",
        title: "National TRB Conference",
        href: "https://www.trb.org",
      },
    });
    const externalLink = externalWrapper.find("a[target='_blank']");
    expect(externalLink.exists()).toBe(true);
    expect(externalLink.attributes("href")).toBe("https://www.trb.org");

    const violations = await runComponentAxe(externalWrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports chip tone variants and triggers action click", async () => {
    const wrapper = await mountSuspended(TuxEventCalendarRow, {
      props: {
        day: "04",
        month: "NOV",
        title: "Executive Policy Meeting",
        chipTone: "maroon",
        actionText: "Register",
      },
    });

    const chip = wrapper.find("[aria-hidden='true'].flex-shrink-0");
    expect(chip.classes()).toContain("bg-brand-primary");

    const button = wrapper.findComponent({ name: "TuxButton" });
    await button.trigger("click");
    expect(wrapper.emitted("action-click")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
