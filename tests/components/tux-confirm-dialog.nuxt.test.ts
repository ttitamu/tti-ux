import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxConfirmDialog from "../../app/components/TuxConfirmDialog.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxConfirmDialog Component", () => {
  it("renders open modal with title, destructive button, and cancel action", async () => {
    const wrapper = await mountSuspended(TuxConfirmDialog, {
      props: {
        open: true,
        title: "Delete Corridor Configuration?",
        eyebrow: "Destructive Action",
        variant: "destructive",
        cancelLabel: "Dismiss",
      },
      slots: {
        default: () => "This action cannot be undone. All sensor feeds will be disassociated.",
      },
    });

    const bodyText = document.body.textContent || wrapper.text();
    expect(bodyText).toContain("Delete Corridor Configuration?");
    expect(bodyText).toContain("Destructive Action");
    expect(bodyText).toContain("This action cannot be undone");
    expect(bodyText).toContain("Dismiss");
    expect(bodyText).toContain("Delete");

    const dialog = document.querySelector("[role='dialog']") || wrapper.element;
    const violations = await runComponentAxe(dialog as Element);
    expect(violations).toEqual([]);
  });

  it("renders primary variant with custom confirm label", async () => {
    const wrapper = await mountSuspended(TuxConfirmDialog, {
      props: {
        open: true,
        title: "Publish Dataset to Repository",
        variant: "primary",
        confirmLabel: "Publish Now",
      },
    });

    const bodyText = document.body.textContent || wrapper.text();
    expect(bodyText).toContain("Publish Dataset to Repository");
    expect(bodyText).toContain("Publish Now");

    const dialog = document.querySelector("[role='dialog']") || wrapper.element;
    const violations = await runComponentAxe(dialog as Element);
    expect(violations).toEqual([]);
  });
});
