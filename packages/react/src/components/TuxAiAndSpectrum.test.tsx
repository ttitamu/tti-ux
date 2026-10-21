import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TuxGroundedSources } from "./TuxGroundedSources";
import { TuxReasoning } from "./TuxReasoning";
import { TuxToolCall } from "./TuxToolCall";
import { TuxSpectrumRibbon, TUX_SPECTRUM_BANDS } from "./TuxSpectrumRibbon";

describe("React SDK Parity — AI & Spectrum Components", () => {
  it("renders TuxGroundedSources with numbered citations and DLP badge", () => {
    render(
      <TuxGroundedSources
        dlpLabel="TTI-PUBLIC"
        sources={[
          {
            id: "1",
            title: "TxDOT Roadway Design Manual",
            url: "https://tti.tamu.edu",
            snippet: "Section 4: Cross-Section Elements",
            page: 42,
          },
        ]}
      />
    );
    expect(screen.getByText("Grounded Citations (1)")).toBeTruthy();
    expect(screen.getByText("DLP: TTI-PUBLIC")).toBeTruthy();
    expect(screen.getByText("TxDOT Roadway Design Manual")).toBeTruthy();
    expect(screen.getByText("p. 42")).toBeTruthy();
  });

  it("renders TuxReasoning and toggles reasoning trace on click", () => {
    render(
      <TuxReasoning duration={2.5} tokensPerSec={48}>
        Step 1: Verify WCAG 2.2 AAA contrast.
      </TuxReasoning>
    );
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Step 1: Verify WCAG 2.2 AAA contrast.")).toBeTruthy();
  });

  it("renders TuxToolCall and expands diff payload", () => {
    render(
      <TuxToolCall
        verb="Edited"
        arg="app/components/TuxBadge.vue"
        status="completed"
        elapsedMs={115}
        diff="+min-height: 44px;"
      />
    );
    const trigger = screen.getByRole("button");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("+min-height: 44px;")).toBeTruthy();
  });

  it("renders TuxSpectrumRibbon with the 5 brand color bands and zero internal division names", () => {
    const { container } = render(<TuxSpectrumRibbon showLabels={true} />);
    expect(TUX_SPECTRUM_BANDS).toHaveLength(5);
    expect(screen.getByText("Maroon")).toBeTruthy();
    expect(screen.getByText("Slate Blue")).toBeTruthy();
    expect(screen.getByText("Slate Teal")).toBeTruthy();
    expect(screen.getByText("Sage Green")).toBeTruthy();
    expect(screen.getByText("Ochre Gold")).toBeTruthy();
    expect(container.textContent).not.toContain("Safety");
    expect(container.textContent).not.toContain("Mobility");
  });
});
