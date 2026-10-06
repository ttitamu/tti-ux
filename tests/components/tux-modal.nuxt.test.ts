import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxModal from "../../app/components/TuxModal.vue";

describe("TuxModal Component", () => {
  it("renders modal dialog header, eyebrow, and title when open", async () => {
    const wrapper = await mountSuspended(TuxModal, {
      props: {
        open: true,
        title: "Corridor Analysis Settings",
        eyebrow: "Configuration",
      },
      slots: {
        default: () => "Modal body content for analysis parameters.",
      },
    });

    const bodyText = document.body.textContent || wrapper.text();
    expect(bodyText).toContain("Corridor Analysis Settings");
    expect(bodyText).toContain("Configuration");
    expect(bodyText).toContain("Modal body content for analysis parameters.");

    // Run axe against wrapper or document.body dialog element
    const dialog = document.querySelector("[role='dialog']") || wrapper.element;
    const violations = await runComponentAxe(dialog as Element);
    expect(violations).toEqual([]);
  });

  it("renders sheet handle when variant is sheet", async () => {
    await mountSuspended(TuxModal, {
      props: {
        open: true,
        variant: "sheet",
        title: "Mobile Bottom Sheet",
      },
    });

    const sheetHandle = document.querySelector(".tux-modal__sheet-handle");
    expect(sheetHandle).not.toBeNull();
  });

  it("renders custom footer slot content when open", async () => {
    await mountSuspended(TuxModal, {
      props: {
        open: true,
        title: "Confirm Action",
      },
      slots: {
        footer: () => h("button", { id: "confirm-action-btn" }, "Proceed"),
      },
    });

    const confirmBtn = document.querySelector("#confirm-action-btn");
    expect(confirmBtn).not.toBeNull();
    expect(confirmBtn?.textContent).toBe("Proceed");
  });
});
