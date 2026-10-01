/**
 * Unit tests for TuxButton React port.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TuxButton } from "./TuxButton";

describe("TuxButton (React port)", () => {
  it("renders with default primary intent, md size, and children text", () => {
    render(<TuxButton>Launch Simulation</TuxButton>);
    const button = screen.getByRole("button", { name: /launch simulation/i });
    expect(button).toBeDefined();
    expect(button.className).toContain("tux-button--primary");
    expect(button.className).toContain("tux-button--md");
    expect(button.className).toContain("tux-button--default");
  });

  it("supports rectangular Kadence shape='sharp' and shape='pill'", () => {
    const { rerender } = render(<TuxButton shape="sharp">About TTI</TuxButton>);
    let button = screen.getByRole("button", { name: /about tti/i });
    expect(button.className).toContain("tux-button--sharp");

    rerender(<TuxButton shape="pill">Pill Action</TuxButton>);
    button = screen.getByRole("button", { name: /pill action/i });
    expect(button.className).toContain("tux-button--pill");
  });

  it("supports semantic intents: secondary, ghost, and destructive", () => {
    const { rerender } = render(<TuxButton intent="secondary">Cancel</TuxButton>);
    expect(screen.getByRole("button").className).toContain("tux-button--secondary");

    rerender(<TuxButton intent="ghost">Settings</TuxButton>);
    expect(screen.getByRole("button").className).toContain("tux-button--ghost");

    rerender(<TuxButton intent="destructive">Delete Item</TuxButton>);
    expect(screen.getByRole("button").className).toContain("tux-button--destructive");
  });

  it("renders as an anchor <a> when `to` or `href` prop is provided", () => {
    render(<TuxButton to="/research/connected-corridors">Read Whitepaper</TuxButton>);
    const link = screen.getByRole("link", { name: /read whitepaper/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/research/connected-corridors");
  });

  it("handles click events and respects disabled / loading states", () => {
    const handleClick = vi.fn();
    const { rerender } = render(<TuxButton onClick={handleClick}>Click Me</TuxButton>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<TuxButton disabled onClick={handleClick}>Disabled</TuxButton>);
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<TuxButton loading onClick={handleClick}>Loading</TuxButton>);
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.className).toContain("tux-button--disabled");
  });
});
