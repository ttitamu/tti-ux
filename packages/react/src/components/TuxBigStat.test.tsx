/**
 * Port-fidelity locks for the TuxBigStat React port — asserts the
 * prop surface and rendered semantics the Vue original defines, so
 * the two implementations can't drift apart silently.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxBigStat } from "./TuxBigStat";

describe("TuxBigStat (react port)", () => {
  it("renders value, label, and BEM structure matching the Vue original", () => {
    const { container } = render(<TuxBigStat value="47.2" suffix="TB" label="Indexed across all corpora" />);
    const root = container.querySelector(".tux-big-stat")!;
    expect(root).toBeTruthy();
    expect(root.querySelector(".tux-big-stat__value")!.textContent).toBe("47.2TB");
    expect(root.querySelector(".tux-big-stat__suffix")!.textContent).toBe("TB");
    expect(root.querySelector(".tux-big-stat__label")!.textContent).toBe(
      "Indexed across all corpora",
    );
    expect(root.querySelector(".tux-big-stat__source")).toBeNull();
  });

  it("defaults: maroon tone, body face 700, md size — the BigStat numeral doctrine", () => {
    const { container } = render(<TuxBigStat value={412} label="corridors" />);
    const value = container.querySelector(".tux-big-stat__value") as HTMLElement;
    expect(value.style.color).toBe("var(--brand-primary)");
    expect(value.style.fontFamily).toBe("var(--font-body)");
    expect(value.style.fontWeight).toBe("700");
    expect(value.style.fontSize).toBe("6rem");
  });

  it("variant + tone + size map exactly as the Vue component", () => {
    const { container } = render(
      <TuxBigStat value="126" suffix="M" label="expenditure" variant="elegant" tone="gold" size="lg" />,
    );
    const value = container.querySelector(".tux-big-stat__value") as HTMLElement;
    expect(value.style.fontFamily).toBe("var(--font-elegant)");
    expect(value.style.fontStyle).toBe("italic");
    expect(value.style.color).toBe("var(--brand-accent)");
    expect(value.style.fontSize).toBe("9rem");
    expect(
      (container.querySelector(".tux-big-stat__suffix") as HTMLElement).style.fontSize,
    ).toBe("3rem");
  });

  it("source line renders only when provided", () => {
    render(<TuxBigStat value={1} label="l" source="TxDOT CRIS, 2025" />);
    expect(screen.getByText("TxDOT CRIS, 2025").className).toBe("tux-big-stat__source");
  });
});
