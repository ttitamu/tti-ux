import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxSignupFeature from "~/components/TuxSignupFeature.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxSignupFeature Component", () => {
  it("renders title, dek, eyebrow, input placeholder, consent, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxSignupFeature, {
      props: {
        title: "Subscribe to the Mobility Newsletter",
        eyebrow: "Stay Informed",
        dek: "Receive quarterly insights on transportation safety and autonomous systems.",
        placeholder: "researcher@tti.tamu.edu",
        actionLabel: "Join Bulletin",
        consent: "We respect your privacy. Unsubscribe anytime.",
      },
    });

    expect(wrapper.classes()).toContain("tux-signup");
    expect(wrapper.text()).toContain("Stay Informed");
    expect(wrapper.text()).toContain("Subscribe to the Mobility Newsletter");
    expect(wrapper.text()).toContain("Receive quarterly insights on transportation safety");
    expect(wrapper.text()).toContain("Join Bulletin");
    expect(wrapper.text()).toContain("We respect your privacy. Unsubscribe anytime.");

    const input = wrapper.find("input[type='email']");
    expect(input.exists()).toBe(true);
    expect(input.attributes("placeholder")).toBe("researcher@tti.tamu.edu");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("handles form submit event and supports tone and variant classes", async () => {
    const wrapper = await mountSuspended(TuxSignupFeature, {
      props: {
        title: "Sign Up",
        tone: "maroon",
        variant: "bold",
        modelValue: "test@tamu.edu",
      },
    });

    expect(wrapper.classes()).toContain("tux-signup--maroon");
    expect(wrapper.classes()).toContain("tux-signup--bold");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")![0]).toEqual(["test@tamu.edu"]);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
