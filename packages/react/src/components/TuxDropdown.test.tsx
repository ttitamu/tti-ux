import { describe, expect, it } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TuxDropdown } from "./TuxDropdown";

describe("TuxDropdown (React)", () => {
  const items = [
    { label: "Corridor Operations", href: "/corridors", description: "Real-time traffic sensors" },
    { label: "Connected Infrastructure", href: "/cv" },
  ];

  it("renders trigger button and opens menu on click", () => {
    render(<TuxDropdown label="Research Areas" items={items} />);
    const trigger = screen.getByRole("button", { name: "Research Areas" });
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    expect(screen.getByText("Corridor Operations")).toBeDefined();
    expect(screen.getByText("Real-time traffic sensors")).toBeDefined();
    expect(screen.getByText("Connected Infrastructure")).toBeDefined();
  });

  it("closes on Escape key press", () => {
    render(<TuxDropdown label="Navigation" items={items} />);
    const trigger = screen.getByRole("button", { name: "Navigation" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
