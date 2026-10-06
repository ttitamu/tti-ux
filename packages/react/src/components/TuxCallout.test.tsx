import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxCallout } from "./TuxCallout";

describe("TuxCallout (React)", () => {
  it("renders note role with default eyebrow and children", () => {
    const { container } = render(
      <TuxCallout>
        <p>The state legislature increased transportation research allocations by 14%.</p>
      </TuxCallout>,
    );

    const aside = container.querySelector("aside");
    expect(aside).not.toBeNull();
    expect(aside?.getAttribute("role")).toBe("note");
    expect(aside?.classList.contains("tux-callout")).toBe(true);
    expect(aside?.classList.contains("tux-callout--default")).toBe(true);

    const eyebrow = container.querySelector(".tux-callout__eyebrow");
    expect(eyebrow?.textContent).toBe("Worth noting");
    expect(container.textContent).toContain("transportation research allocations");
  });

  it("renders stat kind with custom eyebrow and bold variant rule bars", () => {
    const { container } = render(
      <TuxCallout kind="stat" variant="bold">
        <p>94% of incident responses occurred within 8 minutes.</p>
      </TuxCallout>,
    );

    const aside = container.querySelector("aside");
    expect(aside?.classList.contains("tux-callout--bold")).toBe(true);

    const eyebrow = container.querySelector(".tux-callout__eyebrow");
    expect(eyebrow?.textContent).toBe("Key finding");

    const bars = container.querySelectorAll(".tux-callout__bar");
    expect(bars.length).toBe(3);
  });

  it("supports quote kind and custom eyebrow override", () => {
    const { container } = render(
      <TuxCallout kind="quote" eyebrow="Agency Director">
        <p>Connecting telemetry to dispatch saved critical minutes.</p>
      </TuxCallout>,
    );

    const eyebrow = container.querySelector(".tux-callout__eyebrow");
    expect(eyebrow?.textContent).toBe("Agency Director");
  });
});
