import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TuxKbd } from "./TuxKbd";

describe("TuxKbd (React)", () => {
  it("renders single key with size modifier", () => {
    const { container } = render(<TuxKbd value="k" size="lg" />);
    const group = container.querySelector(".tux-kbd-group");
    expect(group).not.toBeNull();
    expect(group?.className).toContain("tux-kbd-group--lg");
    expect(screen.getByText("K")).toBeDefined();
  });

  it("renders multi-key shortcut combo with separator", () => {
    const { container } = render(
      <TuxKbd keys={["ctrl", "shift", "p"]} separator="+" />
    );
    const kbds = container.querySelectorAll("kbd");
    expect(kbds.length).toBe(3);
    const seps = container.querySelectorAll(".tux-kbd-sep");
    expect(seps.length).toBe(2);
    expect(seps[0].textContent).toBe("+");
  });

  it("renders children fallback when no keys provided", () => {
    render(<TuxKbd>?</TuxKbd>);
    expect(screen.getByText("?")).toBeDefined();
  });
});
