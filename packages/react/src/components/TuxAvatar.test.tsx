import { describe, expect, it } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { TuxAvatar } from "./TuxAvatar";

describe("TuxAvatar (React)", () => {
  it("derives initials from name and renders correctly", () => {
    render(<TuxAvatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeDefined();
  });

  it("respects explicit initials override", () => {
    render(<TuxAvatar name="Anthony Guevara" initials="AG" />);
    expect(screen.getByText("AG")).toBeDefined();
  });

  it("renders status dot when specified", () => {
    const { container } = render(<TuxAvatar name="Test User" dot="success" />);
    const dot = container.querySelector(".tux-avatar__dot--success");
    expect(dot).not.toBeNull();
  });

  it("supports non-decorative role and aria-label", () => {
    render(<TuxAvatar name="Alex Rivera" decorative={false} alt="Alex Rivera Profile" />);
    const img = screen.getByRole("img", { name: "Alex Rivera Profile" });
    expect(img).toBeDefined();
  });
});
