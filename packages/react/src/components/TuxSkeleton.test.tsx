import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TuxSkeleton } from "./TuxSkeleton";

describe("TuxSkeleton (React)", () => {
  it("renders primitive skeleton with accessible status role and label", () => {
    render(<TuxSkeleton label="Loading corridor summary..." />);
    const status = screen.getByRole("status");
    expect(status).toBeDefined();
    expect(status.getAttribute("aria-label")).toBe("Loading corridor summary...");
    expect(status.className).toContain("tux-skeleton-wrap--primitive");
    expect(status.className).toContain("tux-skeleton-wrap--shimmer");
  });

  it("renders card preset with composed child elements", () => {
    const { container } = render(<TuxSkeleton kind="card" />);
    const card = container.querySelector(".tux-skeleton__card");
    expect(card).not.toBeNull();
    expect(container.querySelector(".tux-skeleton__media")).not.toBeNull();
    expect(container.querySelector(".tux-skeleton__heading")).not.toBeNull();
  });

  it("renders list preset with requested count of rows", () => {
    const { container } = render(<TuxSkeleton kind="list" count={4} />);
    const items = container.querySelectorAll(".tux-skeleton__list-item");
    expect(items.length).toBe(4);
  });
});
