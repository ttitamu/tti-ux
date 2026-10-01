/**
 * Unit tests for TuxStatus React port.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxStatus } from "./TuxStatus";

describe("TuxStatus (React port)", () => {
  it("renders with default chip kind and mapped state label", () => {
    render(<TuxStatus state="critical" />);
    const status = screen.getByText("CRITICAL");
    expect(status).toBeDefined();
    expect(status.className).toContain("tux-status--critical");
    expect(status.className).not.toContain("tux-status--dot");
  });

  it("supports text kind modifier", () => {
    render(<TuxStatus state="ok" kind="text" />);
    const status = screen.getByText("OK");
    expect(status.className).toContain("tux-status--ok");
    expect(status.className).toContain("tux-status--text");
  });

  it("renders accessible dot indicator with role='status' and aria-label", () => {
    const { container } = render(<TuxStatus state="warning" kind="dot" />);
    const dot = container.querySelector(".tux-status--dot");
    expect(dot).toBeDefined();
    expect(dot?.getAttribute("role")).toBe("status");
    expect(dot?.getAttribute("aria-label")).toBe("WARNING");
    expect(dot?.textContent).toBe("");
  });

  it("supports acked problem modifier", () => {
    render(<TuxStatus state="critical" acked />);
    const status = screen.getByText("CRITICAL");
    expect(status.className).toContain("tux-status--acked");
  });

  it("allows custom label override", () => {
    render(<TuxStatus state="maintenance" label="SCHEDULED" />);
    expect(screen.getByText("SCHEDULED")).toBeDefined();
  });
});
