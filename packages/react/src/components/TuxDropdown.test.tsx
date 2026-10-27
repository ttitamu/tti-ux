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

  it("is a disclosure: the trigger controls the panel, and there are no menu roles", () => {
    const { container } = render(<TuxDropdown label="Programs" items={items} />);
    const trigger = screen.getByRole("button", { name: "Programs" });
    expect(trigger.getAttribute("aria-haspopup")).toBeNull();
    fireEvent.click(trigger);

    const panel = container.querySelector(".tux-dropdown__panel");
    expect(panel?.id).toBeTruthy();
    expect(trigger.getAttribute("aria-controls")).toBe(panel?.id);
    expect(container.querySelectorAll("[role='menu'], [role='menuitem'], [role='none']")).toHaveLength(0);
    expect(screen.getAllByRole("link")).toHaveLength(items.length);
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
