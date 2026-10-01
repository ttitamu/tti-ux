/**
 * Unit tests for TuxBadge React port.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxBadge } from "./TuxBadge";

describe("TuxBadge (React port)", () => {
  it("renders with tone, subtle variant, and label text", () => {
    render(<TuxBadge tone="success" label="Active Corridor" />);
    const badge = screen.getByText("Active Corridor").closest(".tux-badge");
    expect(badge).toBeDefined();
    expect(badge?.className).toContain("tux-badge--success");
    expect(badge?.className).toContain("tux-badge--subtle");
  });

  it("maps operational status values to semantic tones", () => {
    const { rerender } = render(<TuxBadge status="completed" />);
    let badge = screen.getByText("completed").closest(".tux-badge");
    expect(badge?.className).toContain("tux-badge--success");

    rerender(<TuxBadge status="failed" />);
    badge = screen.getByText("failed").closest(".tux-badge");
    expect(badge?.className).toContain("tux-badge--error");

    rerender(<TuxBadge status="running" />);
    badge = screen.getByText("running").closest(".tux-badge");
    expect(badge?.className).toContain("tux-badge--warning");
  });

  it("supports security tier mappings", () => {
    render(<TuxBadge tier="restricted" />);
    const badge = screen.getByText("restricted").closest(".tux-badge");
    expect(badge?.className).toContain("tux-badge--brand");
  });

  it("renders dot status indicator and tag kind", () => {
    const { container } = render(<TuxBadge dot kind="tag" label="v3.0.0" />);
    const dot = container.querySelector(".tux-badge__dot");
    expect(dot).toBeDefined();
    const badge = container.querySelector(".tux-badge");
    expect(badge?.className).toContain("tux-badge--tag");
  });

  it("supports bold styling and size modifiers", () => {
    const { container } = render(<TuxBadge bold size="lg" label="URGENT" />);
    const badge = container.querySelector(".tux-badge");
    expect(badge?.className).toContain("tux-badge--bold");
    expect(badge?.className).toContain("tux-badge--lg");
  });
});
