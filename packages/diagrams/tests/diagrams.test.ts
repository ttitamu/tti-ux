import { describe, expect, it } from "vitest";
import { useTuxMermaid } from "../app/composables/useTuxMermaid";

describe("@tti/tti-ux-diagrams composables and utilities", () => {
  it("provides useTuxMermaid with render and estimateHeight methods", () => {
    const { render, estimateHeight } = useTuxMermaid();
    expect(typeof render).toBe("function");
    expect(typeof estimateHeight).toBe("function");
  });

  it("calculates realistic layout-reservation heights based on code density", () => {
    const { estimateHeight } = useTuxMermaid();

    // Short code snippet (min bound is 140)
    const shortCode = "graph TD\n  A --> B";
    expect(estimateHeight(shortCode)).toBeGreaterThanOrEqual(140);

    // Multi-line code should grow dynamically
    const mediumCode = [
      "flowchart TD",
      "  A[Start] --> B[Process 1]",
      "  B --> C[Process 2]",
      "  C --> D[Decision]",
      "  D -->|Yes| E[End]",
      "  D -->|No| B",
    ].join("\n");
    const mediumHeight = estimateHeight(mediumCode);
    expect(mediumHeight).toBeGreaterThan(140);
    expect(mediumHeight).toBeLessThanOrEqual(720);

    // Extremely large code is capped at 720
    const hugeCode = Array.from({ length: 50 }, (_, i) => `  Node${i} --> Node${i + 1}`).join("\n");
    expect(estimateHeight(hugeCode)).toBe(720);
  });

  it("safely returns null during SSR / node rendering where document is undefined", async () => {
    const { render } = useTuxMermaid();
    const result = await render("graph TD; A-->B;", {
      id: "test-diagram-ssr",
      theme: "default",
    });
    // In node environment without browser DOM, returns null gracefully
    expect(result).toBeNull();
  });
});
