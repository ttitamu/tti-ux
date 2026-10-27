import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import TuxVisionPreferencesModal from "~/components/TuxVisionPreferencesModal.vue";
import { useTuxVisionPrefs } from "~/composables/useTuxVisionPrefs";

// UModal portals the dialog to <body>, so the controls are found there.
function checkbox(labelText: string): HTMLInputElement {
  const label = [...document.body.querySelectorAll("label")].find((l) => l.textContent?.includes(labelText));
  const input = label?.querySelector("input");
  if (!input) throw new Error(`no checkbox labelled ${labelText}`);
  return input;
}
const highContrast = () => checkbox("High-Contrast Mode (tti-hc)");
const softDark = () => checkbox("Anti-Halation Soft Dark Mode");

async function click(el: HTMLElement) {
  el.click();
  await nextTick();
  await nextTick();
}

function resetButton(): HTMLButtonElement {
  const button = [...document.body.querySelectorAll("button")].find((b) => b.textContent?.includes("Reset Defaults"));
  if (!button) throw new Error("no Reset Defaults button");
  return button;
}

describe("TuxVisionPreferencesModal Component", () => {
  let wrapper: VueWrapper | undefined;
  // The Nuxt app exists once the environment's setup has run, not while
  // vitest collects this describe block.
  let colorMode: ReturnType<typeof useColorMode>;

  beforeEach(() => {
    colorMode = useColorMode();
    window.localStorage.clear();
    useTuxVisionPrefs().reset();
    colorMode.preference = "tti";
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  async function mountModal(open = true) {
    wrapper = await mountSuspended(TuxVisionPreferencesModal, { props: { open } });
    await nextTick();
    return wrapper;
  }

  it("mounts closed by default and accepts open prop", async () => {
    await mountModal(false);
    expect(wrapper!.exists()).toBe(true);
  });

  // TTI Code's dialog (nis/forgejo-stack branding/tux/tti-a11y.js) puts high
  // contrast first; this one had it fourth, after three colour-vision sections.
  it("lists high contrast first, in TTI Code's section order", async () => {
    await mountModal();
    const headings = [...document.body.querySelectorAll("section h3, section label[for]")]
      .map((el) => el.textContent?.trim().replace(/\s+/g, " "))
      .filter((text) => /^\d\./.test(text ?? ""));
    expect(headings).toEqual([
      "1. High Contrast, Astigmatism & Field Comfort",
      "2. Institutional Typography Profile",
      "3. Categorical Color Vision Palette",
      "4. Live Colorblindness Simulation Filter",
      "5. Multi-Channel Redundancy (Non-Color Encodings)",
    ]);
  });

  it("turning high contrast off returns to light when it was turned on from light", async () => {
    await mountModal();
    await click(highContrast());
    expect(colorMode.preference).toBe("tti-hc");

    await click(highContrast());
    expect(colorMode.preference).toBe("tti");
  });

  it("turning high contrast off returns to dark when it was turned on from dark", async () => {
    colorMode.preference = "tti-dark";
    await mountModal();
    await click(highContrast());
    expect(colorMode.preference).toBe("tti-hc");

    await click(highContrast());
    expect(colorMode.preference).toBe("tti-dark");
  });

  it("Reset Defaults from high contrast returns to the mode before it", async () => {
    await mountModal();
    await click(highContrast());
    expect(colorMode.preference).toBe("tti-hc");

    await click(resetButton());
    expect(colorMode.preference).toBe("tti");
  });

  // The next two start from dark: with nothing remembered the dialog falls
  // back to light, so dark is what tells "remembered" from "fell back".
  it("remembers the mode when high contrast was turned on by another switch", async () => {
    colorMode.preference = "tti-dark";
    // The dialog is mounted (closed) while the cluster's or footer's
    // high-contrast button turns it on.
    await mountModal(false);
    colorMode.preference = "tti-hc";
    await nextTick();

    await wrapper!.setProps({ open: true });
    await nextTick();
    expect(highContrast().checked).toBe(true);
    await click(highContrast());
    expect(colorMode.preference).toBe("tti-dark");
  });

  it("remembers the mode across a reload", async () => {
    colorMode.preference = "tti-dark";
    await mountModal();
    await click(highContrast());
    wrapper!.unmount();

    // A new page: high contrast is on from the start.
    await mountModal();
    expect(colorMode.preference).toBe("tti-hc");
    await click(highContrast());
    expect(colorMode.preference).toBe("tti-dark");
  });

  it("soft dark from high contrast still goes to dark", async () => {
    await mountModal();
    await click(highContrast());
    await click(softDark());
    expect(colorMode.preference).toBe("tti-dark");
  });
});
