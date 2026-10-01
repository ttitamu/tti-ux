import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxPageContainer from "~/components/TuxPageContainer.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxPageContainer Component", () => {
  it("renders container with default width and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxPageContainer, {
      slots: {
        default: () => "<p>Container content</p>",
      },
    });

    expect(wrapper.find(".tux-page-container--default").exists()).toBe(true);
    expect(wrapper.text()).toContain("Container content");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom width, flush padding, and custom tag element", async () => {
    const wrapper = await mountSuspended(TuxPageContainer, {
      props: {
        width: "wide",
        flush: true,
        as: "section",
      },
      slots: {
        default: () => "<h2>Full-bleed research section</h2>",
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe("section");
    expect(wrapper.find(".tux-page-container--wide").exists()).toBe(true);
    expect(wrapper.find(".tux-page-container--flush").exists()).toBe(true);
    expect(wrapper.text()).toContain("Full-bleed research section");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
