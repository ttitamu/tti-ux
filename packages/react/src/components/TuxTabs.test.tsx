import { describe, expect, it, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TuxTabs } from "./TuxTabs";

describe("TuxTabs (React)", () => {
  const items = [
    { value: "overview", label: "Overview", badge: 4, content: "Overview panel" },
    { value: "telemetry", label: "Telemetry", content: "Telemetry panel" },
    { value: "settings", label: "Settings", disabled: true, content: "Settings panel" },
  ];

  it("renders tabs with roles and selects active tab", () => {
    const handleChange = vi.fn();
    render(<TuxTabs items={items} onChange={handleChange} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(3);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Overview panel")).toBeDefined();

    fireEvent.click(tabs[1]);
    expect(handleChange).toHaveBeenCalledWith("telemetry");
    expect(screen.getByText("Telemetry panel")).toBeDefined();
  });

  it("prevents selecting disabled tab", () => {
    const handleChange = vi.fn();
    render(<TuxTabs items={items} onChange={handleChange} />);

    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[2]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("supports vertical orientation and bold variant", () => {
    const { container } = render(
      <TuxTabs items={items} orientation="vertical" variant="bold" />
    );
    expect((container.firstChild as HTMLElement).classList.contains("tux-tabs--vertical")).toBe(true);
    const list = container.querySelector(".tux-tabs__list");
    expect(list?.getAttribute("aria-orientation")).toBe("vertical");
  });
});
