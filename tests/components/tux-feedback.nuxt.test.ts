// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxFeedback from "../../app/components/TuxFeedback.vue";

describe("TuxFeedback Component", () => {
  it("renders prompt and buttons initially with clean accessibility", async () => {
    const wrapper = await mountSuspended(TuxFeedback, {
      props: {
        pageId: "docs/adr/0001",
        title: "Was this architecture doc helpful?",
      },
    });

    expect(wrapper.find("[data-testid='tux-feedback']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Was this architecture doc helpful?");
    expect(wrapper.text()).toContain("Yes");
    expect(wrapper.text()).toContain("No");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("submits 'up' vote immediately and shows success with accessible status", async () => {
    const wrapper = await mountSuspended(TuxFeedback, {
      props: {
        pageId: "docs/adr/0001",
      },
    });

    const yesBtn = wrapper.findAll("button").find(b => b.text().includes("Yes"));
    expect(yesBtn).toBeDefined();
    await yesBtn!.trigger("click");

    expect(wrapper.emitted("submit")).toBeTruthy();
    const payload = wrapper.emitted("submit")?.[0]?.[0] as any;
    expect(payload.vote).toBe("up");
    expect(payload.pageId).toBe("docs/adr/0001");
    expect(wrapper.find("[data-testid='tux-feedback-success']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Thank you!");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("reveals details panel on 'no' vote and submits categorized feedback with zero a11y violations", async () => {
    const wrapper = await mountSuspended(TuxFeedback, {
      props: {
        pageId: "design/palette",
      },
    });

    const noBtn = wrapper.findAll("button").find(b => b.text().includes("No"));
    expect(noBtn).toBeDefined();
    await noBtn!.trigger("click");

    expect(wrapper.find("[data-testid='tux-feedback-details']").exists()).toBe(true);
    expect(wrapper.text()).toContain("How can we make this page better?");

    // Check accessibility of the revealed form
    const formViolations = await runComponentAxe(wrapper.element);
    expect(formViolations).toEqual([]);

    // Select reason
    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    await select.setValue("outdated");

    // Enter note
    const textarea = wrapper.find("textarea");
    expect(textarea.exists()).toBe(true);
    await textarea.setValue("Hex values don't match the new 2026 guidelines.");

    // Submit details
    const submitBtn = wrapper.find(".tux-feedback__submit-btn");
    await submitBtn.trigger("click");

    expect(wrapper.emitted("submit")).toBeTruthy();
    const payload = wrapper.emitted("submit")?.[0]?.[0] as any;
    expect(payload.vote).toBe("down");
    expect(payload.reason).toBe("outdated");
    expect(payload.note).toBe("Hex values don't match the new 2026 guidelines.");
    expect(wrapper.find("[data-testid='tux-feedback-success']").exists()).toBe(true);
  });
});

