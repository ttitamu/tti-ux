import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TuxStatComparison } from "./TuxStatComparison";

describe("TuxStatComparison (React)", () => {
  it("renders positive delta with success tone and percent change", () => {
    const { container } = render(
      <TuxStatComparison
        eyebrow="Indexed Corpus"
        current={47.2}
        previous={45.8}
        suffix=" TB"
        label="vs last week"
      />
    );

    const root = container.querySelector(".tux-stat-comparison");
    expect(root).not.toBeNull();
    expect(root?.className).toContain("tux-stat-comparison--success");
    expect(screen.getByText("Indexed Corpus")).toBeDefined();
    expect(screen.getByText("47.2")).toBeDefined();
    expect(screen.getAllByText("TB").length).toBeGreaterThan(0);
    expect(screen.getByText("vs last week")).toBeDefined();
    expect(screen.getByText("+1.4")).toBeDefined();
    expect(screen.getByText("(+3.1%)")).toBeDefined();
  });

  it("renders inverted polarity when decrease is positive", () => {
    const { container } = render(
      <TuxStatComparison
        eyebrow="Response Latency"
        current={120}
        previous={180}
        suffix=" ms"
        polarity="invert"
      />
    );

    const root = container.querySelector(".tux-stat-comparison");
    expect(root?.className).toContain("tux-stat-comparison--success");
    expect(screen.getByText("-60.0")).toBeDefined();
  });
});
