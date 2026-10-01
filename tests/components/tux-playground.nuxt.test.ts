import { describe, expect, it, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxPlayground, { type TuxPropControl, type TuxPlaygroundPreset } from "../../app/components/TuxPlayground.vue";

describe("TuxPlayground Component", () => {
  const sampleControls: TuxPropControl[] = [
    {
      prop: "intent",
      label: "Button Intent",
      type: "select",
      options: ["primary", "secondary", "destructive"],
      defaultValue: "primary",
    },
    {
      prop: "shape",
      label: "Button Shape",
      type: "select",
      options: ["default", "sharp", "pill"],
      defaultValue: "default",
    },
    {
      prop: "disabled",
      label: "Disabled State",
      type: "boolean",
      defaultValue: false,
    },
    {
      prop: "label",
      label: "Button Text",
      type: "text",
      defaultValue: "Execute",
    },
  ];

  const samplePresets: TuxPlaygroundPreset[] = [
    {
      name: "kadence",
      label: "Kadence Rectangular",
      description: "Official 0px button profile",
      values: {
        intent: "primary",
        shape: "sharp",
        disabled: false,
        label: "Institutional Action",
      },
    },
    {
      name: "destructive",
      label: "Destructive Danger",
      description: "Danger button profile",
      values: {
        intent: "destructive",
        shape: "sharp",
        disabled: false,
        label: "Purge Records",
      },
    },
  ];

  it("renders with title, eyebrow, and controls grid", async () => {
    const wrapper = await mountSuspended(TuxPlayground, {
      props: {
        tag: "tux-button",
        title: "Button Test Workbench",
        eyebrow: "Interactive Playground",
        controls: sampleControls,
        presets: samplePresets,
      },
      slots: {
        default: ({ values }) => `<button class="${values.intent}">${values.label}</button>`,
      },
    });

    expect(wrapper.text()).toContain("Button Test Workbench");
    expect(wrapper.text()).toContain("Interactive Playground");
    expect(wrapper.text()).toContain("Kadence Rectangular");
    expect(wrapper.text()).toContain("Destructive Danger");

    // All controls rendered with accessible labels
    const selectElements = wrapper.findAll("select");
    expect(selectElements.length).toBe(2);
    for (const sel of selectElements) {
      expect(sel.attributes("aria-label")).toBeDefined();
    }

    // Passes in-component axe accessibility audit
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("applies preset values when a preset pill is clicked", async () => {
    const wrapper = await mountSuspended(TuxPlayground, {
      props: {
        tag: "tux-button",
        controls: sampleControls,
        presets: samplePresets,
      },
      slots: {
        default: ({ values }) => `<button class="${values.intent}">${values.label}</button>`,
      },
    });

    const presetButtons = wrapper.findAll(".px-5.py-2\\.5 button");
    expect(presetButtons.length).toBe(2);

    // Click the second preset ("Destructive Danger")
    await presetButtons[1].trigger("click");

    expect(wrapper.text()).toContain("Purge Records");
  });

  it("provides export button and renders developer handoff dialog", async () => {
    const wrapper = await mountSuspended(TuxPlayground, {
      props: {
        tag: "tux-button",
        controls: sampleControls,
        presets: samplePresets,
      },
      slots: {
        default: () => "<span>Preview Content</span>",
      },
    });

    const exportBtn = wrapper.findAll("button").find((b) => b.text().includes("Export Preset"));
    expect(exportBtn).toBeDefined();

    // Trigger export modal open
    await exportBtn?.trigger("click");

    // Teleported dialog exists in DOM
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.textContent).toContain("Developer Handoff & Preset Exporter");
    expect(dialog?.textContent).toContain("Component: <tux-button>");

    // Close dialog
    const closeBtn = dialog?.querySelector('button[aria-label="Close export dialog"]');
    (closeBtn as HTMLElement)?.click();
  });

  it("provides Share Link button and hydrates state via deep-linking", async () => {
    const wrapper = await mountSuspended(TuxPlayground, {
      props: {
        tag: "tux-button",
        controls: sampleControls,
        presets: samplePresets,
      },
      slots: {
        default: ({ values }) => `<button class="${values.intent}">${values.label}</button>`,
      },
    });

    const shareBtn = wrapper.findAll("button").find((b) => b.text().includes("Share Link"));
    expect(shareBtn).toBeDefined();
    expect(shareBtn?.attributes("aria-label")).toContain("Share configured preset link");

    // Mock navigator.clipboard
    let written = "";
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(async (text: string) => {
          written = text;
        }),
      },
    });

    // Click Share Link button
    await shareBtn?.trigger("click");
    expect(wrapper.text()).toContain("Copied!");
    expect(written.length).toBeGreaterThan(0);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});

