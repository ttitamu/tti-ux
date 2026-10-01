import { describe, expect, it } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { TuxAccordion } from "./TuxAccordion";

describe("TuxAccordion (React)", () => {
  const items = [
    { title: "What is TUX?", content: "The Texas A&M Transportation Institute User Experience system.", defaultOpen: true },
    { title: "How do I install it?", content: "Via npm or yarn.", eyebrow: "Setup" },
  ];

  it("renders accordion items and respects defaultOpen", () => {
    const { container } = render(<TuxAccordion items={items} />);
    expect(screen.getByText("What is TUX?")).toBeDefined();
    expect(screen.getByText("How do I install it?")).toBeDefined();
    expect(screen.getByText("Setup")).toBeDefined();

    const details = container.querySelectorAll("details");
    expect(details.length).toBe(2);
    expect(details[0].open).toBe(true);
  });

  it("supports publication kind styling", () => {
    const { container } = render(
      <TuxAccordion
        items={[{ title: "Connected Vehicles in Rural Corridors", content: "Abstract text" }]}
        kind="publication"
      />
    );
    expect((container.firstChild as HTMLElement).classList.contains("tux-accordion--publication")).toBe(true);
  });

  it("sets mutually exclusive name attribute when single is true", () => {
    const { container } = render(<TuxAccordion items={items} single />);
    const details = container.querySelectorAll("details");
    expect(details[0].getAttribute("name")).toBeTruthy();
    expect(details[0].getAttribute("name")).toBe(details[1].getAttribute("name"));
  });
});
