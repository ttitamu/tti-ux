/**
 * Port-fidelity locks for the TuxHeroCanvasSol React port — verifies
 * blend modes, presentation modes, accessible playback toggle, and foreground slot.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxHeroCanvasSol } from "./TuxHeroCanvasSol";

describe("TuxHeroCanvasSol (react port)", () => {
  it("renders default seamless adaptive stage with canvas, bottom bleed, and foreground children", () => {
    const { container } = render(
      <TuxHeroCanvasSol>
        <h1>Autonomous Freight Telemetry</h1>
      </TuxHeroCanvasSol>,
    );

    const root = container.querySelector(".tux-hero-canvas-sol") as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.className).toContain("tux-hero-canvas-sol--blend-seamless");
    expect(root.className).toContain("tux-hero-canvas-sol--mode-adaptive");
    expect(root.style.minHeight).toBe("34rem");

    expect(root.querySelector("canvas.tux-hero-canvas-sol__layer")).toBeTruthy();
    expect(root.querySelector(".tux-hero-canvas-sol__bottom-bleed")).toBeTruthy();
    expect(screen.getByText("Autonomous Freight Telemetry")).toBeTruthy();
  });

  it("toggles playback state via accessible control button and omits bleed when contained", () => {
    const { container } = render(
      <TuxHeroCanvasSol blend="contained" mode="cinematic-dark" minHeight="28rem" />,
    );

    const root = container.querySelector(".tux-hero-canvas-sol") as HTMLElement;
    expect(root.className).toContain("tux-hero-canvas-sol--blend-contained");
    expect(root.className).toContain("tux-hero-canvas-sol--mode-cinematic-dark");
    expect(root.querySelector(".tux-hero-canvas-sol__bottom-bleed")).toBeNull();

    const btn = screen.getByRole("button", { name: /pause interactive animation/i });
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /play interactive animation/i })).toBeTruthy();
  });

  it("hides playback controls when showControls is false", () => {
    const { container } = render(<TuxHeroCanvasSol showControls={false} />);
    expect(container.querySelector(".tux-hero-canvas-sol__controls")).toBeNull();
  });
});
