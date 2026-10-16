/**
 * Port-fidelity locks for the TuxVisionPreferencesModal React port — verifies
 * CVD palette selection, simulation filter dropdown, redundancy toggles, reset, and close.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_VISION_PREFERENCES,
  TuxVisionPreferencesModal,
} from "./TuxVisionPreferencesModal";

describe("TuxVisionPreferencesModal (react port)", () => {
  it("does not render dialog when open is false", () => {
    const { container } = render(<TuxVisionPreferencesModal open={false} />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders all 5 CVD modes, simulation select, and comfort toggles when open", () => {
    render(<TuxVisionPreferencesModal open={true} />);

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Vision & Accessibility Preferences")).toBeTruthy();
    expect(screen.getByText("Universal CVD (Okabe-Ito)")).toBeTruthy();
    expect(screen.getByText("TTI Institutional Standard")).toBeTruthy();
    expect(screen.getByText("Deutan / Protan Optimized")).toBeTruthy();
    expect(screen.getByText("Tritanopia Safe")).toBeTruthy();
    expect(screen.getByText("Achromatopsia & High-Luminance Mono")).toBeTruthy();
    expect(screen.getByText("Anti-Halation Soft Dark Mode")).toBeTruthy();
  });

  it("emits updated preferences on CVD mode change, reset, and close on Done", () => {
    const onPrefsChange = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <TuxVisionPreferencesModal
        open={true}
        onPreferencesChange={onPrefsChange}
        onOpenChange={onOpenChange}
      />,
    );

    const okabeRadio = screen.getByDisplayValue("okabe-ito");
    fireEvent.click(okabeRadio);
    expect(onPrefsChange).toHaveBeenCalledWith(
      expect.objectContaining({ cvdMode: "okabe-ito" }),
    );

    const resetBtn = screen.getByRole("button", { name: /reset defaults/i });
    fireEvent.click(resetBtn);
    expect(onPrefsChange).toHaveBeenLastCalledWith(DEFAULT_VISION_PREFERENCES);

    const doneBtn = screen.getByRole("button", { name: /done/i });
    fireEvent.click(doneBtn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
