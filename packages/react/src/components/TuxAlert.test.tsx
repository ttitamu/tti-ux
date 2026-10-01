/**
 * Unit tests for TuxAlert React port.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TuxAlert } from "./TuxAlert";

describe("TuxAlert (React port)", () => {
  it("renders with default info variant, title, and description", () => {
    render(
      <TuxAlert
        title="Scheduled Maintenance"
        description="System will reboot at midnight."
      />,
    );

    const alert = screen.getByRole("status");
    expect(alert).toBeDefined();
    expect(alert.className).toContain("tux-alert--info");
    expect(screen.getByText("Scheduled Maintenance")).toBeDefined();
    expect(screen.getByText("System will reboot at midnight.")).toBeDefined();
  });

  it("supports multiple semantic variants with distinctive styling", () => {
    const variants = [
      "note",
      "tip",
      "info",
      "important",
      "success",
      "warning",
      "danger",
      "compliance",
    ] as const;

    for (const v of variants) {
      const { unmount } = render(<TuxAlert variant={v} title={`Alert ${v}`} />);
      const el = screen.getByText(`Alert ${v}`).closest(".tux-alert");
      expect(el?.className).toContain(`tux-alert--${v}`);
      unmount();
    }
  });

  it("uses role='alert' for warning and danger variants", () => {
    const { rerender } = render(<TuxAlert variant="warning" title="Warning Note" />);
    expect(screen.getByRole("alert")).toBeDefined();

    rerender(<TuxAlert variant="danger" title="Critical Failure" />);
    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("supports dismissible close button", () => {
    const handleClose = vi.fn();
    render(
      <TuxAlert
        dismissible
        title="Notice"
        description="Dismiss this message."
        onClose={handleClose}
      />,
    );

    const closeBtn = screen.getByRole("button", { name: /dismiss alert/i });
    expect(closeBtn).toBeDefined();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Notice")).toBeNull();
  });
});
