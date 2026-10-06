import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCard from "../../app/components/TuxCard.vue";

describe("TuxCard Component", () => {
  it("renders a static card with default padding and slot content", async () => {
    const wrapper = await mountSuspended(TuxCard, {
      slots: {
        default: () => "Static Research Summary",
      },
    });

    expect(wrapper.classes()).toContain("card-static");
    expect(wrapper.classes()).toContain("p-6");
    expect(wrapper.text()).toContain("Static Research Summary");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders an anchor element with corner arrow when `to` prop is provided", async () => {
    const wrapper = await mountSuspended(TuxCard, {
      props: {
        to: "/research/connected-corridors",
      },
      slots: {
        default: () => "Connected Corridors Initiative",
      },
    });

    expect(wrapper.classes()).toContain("card-linked");
    expect(wrapper.find(".card-linked__arrow").exists()).toBe(true);
    expect(wrapper.find("[aria-hidden='true']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Connected Corridors Initiative");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports `linked` prop without `to` for inner link delegates", async () => {
    const wrapper = await mountSuspended(TuxCard, {
      props: {
        linked: true,
      },
      slots: {
        default: () => "<h3><a href='https://tti.tamu.edu'>External Project</a></h3>",
      },
    });

    expect(wrapper.classes()).toContain("card-linked");
    expect(wrapper.find(".card-linked__arrow").exists()).toBe(true);
  });

  it("supports unpadded flush mode (`padded: false`)", async () => {
    const wrapper = await mountSuspended(TuxCard, {
      props: {
        padded: false,
      },
      slots: {
        default: () => "Flush Image Banner",
      },
    });

    expect(wrapper.classes()).not.toContain("p-6");
  });
});
