/**
 * Unit tests for TuxEmptyState React port.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxEmptyState } from "./TuxEmptyState";

describe("TuxEmptyState (React port)", () => {
  it("renders with preset configuration for no-results", () => {
    const { container } = render(<TuxEmptyState kind="no-results" />);
    expect(screen.getByRole("heading", { level: 3, name: "No matches" })).toBeDefined();
    expect(
      screen.getByText("Try a broader query, or clear the active filters."),
    ).toBeDefined();

    const root = container.querySelector(".tux-empty-state");
    expect(root?.className).toContain("tux-empty-state--card");
    expect(root?.className).toContain("tux-empty-state--regular");
  });

  it("allows title and description overrides on top of presets", () => {
    render(
      <TuxEmptyState
        kind="no-data"
        title="No Corridor Sensors"
        description="Connect a physical detector or activate simulated telemetry."
      />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "No Corridor Sensors" }),
    ).toBeDefined();
    expect(
      screen.getByText("Connect a physical detector or activate simulated telemetry."),
    ).toBeDefined();
  });

  it("supports compact sizing variant", () => {
    const { container } = render(<TuxEmptyState kind="not-found" compact />);
    const root = container.querySelector(".tux-empty-state");
    expect(root?.className).toContain("tux-empty-state--compact");
  });

  it("supports noCard prop to drop card frame styling", () => {
    const { container } = render(<TuxEmptyState kind="first-run" noCard />);
    const root = container.querySelector(".tux-empty-state");
    expect(root?.className).not.toContain("tux-empty-state--card");
  });

  it("renders action buttons in children CTA slot", () => {
    render(
      <TuxEmptyState kind="no-permissions">
        <button type="button">Request Clearance</button>
      </TuxEmptyState>,
    );
    expect(screen.getByRole("button", { name: "Request Clearance" })).toBeDefined();
  });

  it("renders custom icon when provided", () => {
    const { container } = render(
      <TuxEmptyState
        icon={<span data-testid="custom-icon">CUSTOM</span>}
        title="Custom State"
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeDefined();
    expect(screen.getByText("Custom State")).toBeDefined();
  });
});
