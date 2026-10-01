import { describe, expect, it } from "vitest";
import { TUX_FRAMEWORKS } from "../app/composables/useTuxFramework";

describe("TUX_FRAMEWORKS registry & metadata", () => {
  it("defines the 4 core cross-framework targets", () => {
    const ids = TUX_FRAMEWORKS.map((f) => f.id);
    expect(ids).toEqual(["vue", "react", "wc", "razor"]);
  });

  it("assigns valid icons and labels to every target", () => {
    for (const f of TUX_FRAMEWORKS) {
      expect(f.label).toBeTruthy();
      expect(f.shortLabel).toBeTruthy();
      expect(f.icon).toMatch(/^lucide:/);
      expect(f.targetPackage).toBeTruthy();
      expect(f.badge).toBeTruthy();
      expect(f.description).toBeTruthy();
    }
  });

  it("targets official TTI-UX distribution packages", () => {
    const react = TUX_FRAMEWORKS.find((f) => f.id === "react");
    expect(react?.targetPackage).toBe("@tti/tti-ux-react");

    const wc = TUX_FRAMEWORKS.find((f) => f.id === "wc");
    expect(wc?.targetPackage).toBe("@tti/tti-ux-elements");

    const razor = TUX_FRAMEWORKS.find((f) => f.id === "razor");
    expect(razor?.targetPackage).toContain("Tti.Tux.AspNetCore");
  });
});
