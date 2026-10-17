import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxExample from "../../app/components/TuxExample.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxExample Component", () => {
  it("renders live preview slot, framework tabs, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxExample, {
      props: {
        title: "Primary Action Button",
        vue: '<TuxButton variant="primary">Launch Simulation</TuxButton>',
      },
      slots: {
        default: () => "Live Button Preview Content",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("tux-example");
    expect(wrapper.text()).toContain("Primary Action Button");
    expect(wrapper.text()).toContain("Live Button Preview Content");

    // Code tabs
    expect(wrapper.text()).toContain("Vue");
    expect(wrapper.text()).toContain("React");
    expect(wrapper.text()).toContain("Web Component");
    expect(wrapper.text()).toContain("Razor (.NET)");
    expect(wrapper.text()).toContain("Python");
    expect(wrapper.text()).toContain("PHP");
    expect(wrapper.text()).toContain("Swift");
    expect(wrapper.text()).toContain("Kotlin");
    expect(wrapper.text()).toContain("HTML (DOM)");

    // Copy button
    const copyBtn = wrapper.find("button[aria-label*='Copy']");
    expect(copyBtn.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("switches code tab when clicked", async () => {
    const wrapper = await mountSuspended(TuxExample, {
      props: {
        vue: '<TuxButton variant="secondary">Cancel</TuxButton>',
      },
    });

    const reactTab = wrapper
      .findAll("button")
      .find((b) => b.text().trim() === "React");
    expect(reactTab).toBeDefined();

    await reactTab?.trigger("click");
    expect(reactTab?.classes()).toContain("border-brand-primary");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("toggles Token & A11y X-Ray drawer and displays detected primitives and semantic tokens", async () => {
    const wrapper = await mountSuspended(TuxExample, {
      props: {
        title: "Corridor Status Card",
        vue: '<TuxCard division="mobility"><TuxBadge los="B" /></TuxCard>',
      },
      slots: {
        default: () => "Preview content",
      },
    });

    const xrayBtn = wrapper.find('[data-testid="tux-example-xray-toggle"]');
    expect(xrayBtn.exists()).toBe(true);
    expect(wrapper.find('[data-testid="tux-example-xray"]').exists()).toBe(false);

    await xrayBtn.trigger("click");

    const xrayDrawer = wrapper.find('[data-testid="tux-example-xray"]');
    expect(xrayDrawer.exists()).toBe(true);
    expect(xrayDrawer.text()).toContain("TuxCard");
    expect(xrayDrawer.text()).toContain("TuxBadge");
    expect(xrayDrawer.text()).toContain("--brand-primary");
    expect(xrayDrawer.text()).toContain("--surface-raised");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});

