import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxSectionHeader from "../../app/components/TuxSectionHeader.vue";

describe("TuxSectionHeader Component", () => {
  it("renders institutional heading with maroon title and gold accent rule", async () => {
    const wrapper = await mountSuspended(TuxSectionHeader, {
      props: {
        title: "Active Research Programs",
        subtitle: "Multimodal transportation analytics",
        kicker: "Division 04",
      },
    });

    expect(wrapper.find("h2").text()).toBe("Active Research Programs");
    expect(wrapper.find("h2").classes()).toContain("text-brand-primary");
    expect(wrapper.find("[role='presentation']").classes()).toContain("bg-brand-accent");
    expect(wrapper.text()).toContain("Division 04");
    expect(wrapper.text()).toContain("Multimodal transportation analytics");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports level 1 heading and default slot content", async () => {
    const wrapper = await mountSuspended(TuxSectionHeader, {
      props: {
        level: 1,
      },
      slots: {
        default: () => "Institutional Knowledge Base",
      },
    });

    const h1 = wrapper.find("h1");
    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe("Institutional Knowledge Base");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders classic, rule-full, and minimal variants cleanly", async () => {
    const classicWrapper = await mountSuspended(TuxSectionHeader, {
      props: {
        variant: "classic",
        title: "Classic Tracked Header",
      },
    });
    expect(classicWrapper.text()).toContain("Classic Tracked Header");

    const ruleFullWrapper = await mountSuspended(TuxSectionHeader, {
      props: {
        variant: "rule-full",
        title: "Full Width Keyline",
      },
    });
    expect(ruleFullWrapper.find(".w-full").exists()).toBe(true);

    const minimalWrapper = await mountSuspended(TuxSectionHeader, {
      props: {
        variant: "minimal",
        title: "Minimal Divider",
      },
    });
    expect(minimalWrapper.find(".border-surface-border").exists()).toBe(true);

    const violations = await runComponentAxe(minimalWrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders two-tone-rule variant with bold and light titles and trailing keyline", async () => {
    const wrapper = await mountSuspended(TuxSectionHeader, {
      props: {
        variant: "two-tone-rule",
        title: "RESEARCH",
        secondaryTitle: "CAPABILITIES",
        subtitle: "Key multidisciplinary operational strengths across Texas and the nation",
      },
    });

    expect(wrapper.text()).toContain("RESEARCH");
    expect(wrapper.text()).toContain("CAPABILITIES");
    expect(wrapper.text()).toContain("Key multidisciplinary operational strengths");
    const keyline = wrapper.find("[role='presentation']");
    expect(keyline.exists()).toBe(true);
    expect(keyline.classes()).toContain("bg-brand-accent");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
