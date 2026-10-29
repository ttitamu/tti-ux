import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import TuxCopyToken from "~/components/TuxCopyToken.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCopyToken Component", () => {
  const rawUri = "urn:tti:corridor:ih35:station-0482-northbound";

  it("renders prefix label, middle-truncated value, verified badge, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxCopyToken, {
      props: {
        label: "URI",
        value: rawUri,
        maxLength: 20,
        verified: true,
        copyLabel: "Copy corridor dataset URI",
      },
    });

    expect(wrapper.classes()).toContain("tux-copy-token");
    expect(wrapper.classes()).toContain("tux-copy-token--verified");
    expect(wrapper.find(".tux-copy-token__label").text()).toBe("URI");

    const codeText = wrapper.find(".tux-copy-token__value").text();
    expect(codeText).toContain("…");
    expect(codeText.length).toBe(20);
    expect(codeText.startsWith("urn:tti:co")).toBe(true);
    expect(codeText.endsWith("rthbound")).toBe(true);
    expect(wrapper.find(".tux-copy-token__value").attributes("title")).toBe(rawUri);

    expect(wrapper.find(".tux-copy-token__verified").exists()).toBe(true);

    const btn = wrapper.find("button.tux-copy-token__button");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toBe("Copy corridor dataset URI");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("copies full raw value, announces polite Copied status, and handles missing clipboard safely", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    try {
      const wrapper = await mountSuspended(TuxCopyToken, {
        props: {
          value: rawUri,
          maxLength: 18,
        },
      });

      const btn = wrapper.find("button.tux-copy-token__button");
      await btn.trigger("click");

      expect(writeTextMock).toHaveBeenCalledWith(rawUri);
      expect(wrapper.emitted("copy")).toEqual([[rawUri]]);
      expect(wrapper.find('[aria-live="polite"]').text()).toBe("Copied");

      const violations = await runComponentAxe(wrapper.element);
      expect(violations).toEqual([]);
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        value: originalClipboard,
        configurable: true,
      });
    }

    // Verify safe fallback when navigator.clipboard is unavailable
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    try {
      const fallbackWrapper = await mountSuspended(TuxCopyToken, {
        props: {
          value: "WIM-TX-IH10-0194",
        },
      });

      await fallbackWrapper.find("button.tux-copy-token__button").trigger("click");
      expect(fallbackWrapper.emitted("copy")).toEqual([["WIM-TX-IH10-0194"]]);
      expect(fallbackWrapper.find('[aria-live="polite"]').text()).toBe("Copied");
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        value: originalClipboard,
        configurable: true,
      });
    }
  });
});
