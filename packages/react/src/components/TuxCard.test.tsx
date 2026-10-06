/**
 * Unit tests for TuxCard React port.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxCard } from "./TuxCard";

describe("TuxCard (React port)", () => {
  it("renders as static card with default padding", () => {
    const { container } = render(
      <TuxCard>
        <h3>Research Initiative</h3>
        <p>Connected corridor testing.</p>
      </TuxCard>,
    );

    const card = container.querySelector(".card-static");
    expect(card).toBeDefined();
    expect(card?.className).toContain("card-padded");
    expect(screen.getByText("Research Initiative")).toBeDefined();
    expect(container.querySelector(".card-linked__arrow")).toBeNull();
  });

  it("renders as an anchor with arrow icon when `to` or `href` is provided", () => {
    const { container } = render(
      <TuxCard to="/components/alert">
        <h3>TuxAlert</h3>
      </TuxCard>,
    );

    const link = screen.getByRole("link", { name: /tuxalert/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/components/alert");
    expect(link.className).toContain("card-linked");
    expect(container.querySelector(".card-linked__arrow")).not.toBeNull();
  });

  it("supports linked chrome on a div when `linked` is true without `to`", () => {
    const { container } = render(
      <TuxCard linked padded={false}>
        <h3>
          <a href="https://tti.tamu.edu">External Report</a>
        </h3>
      </TuxCard>,
    );

    const card = container.querySelector(".card-linked");
    expect(card).toBeDefined();
    expect(card?.tagName.toLowerCase()).toBe("div");
    expect(card?.className).not.toContain("card-padded");
    expect(container.querySelector(".card-linked__arrow")).not.toBeNull();
  });
});
