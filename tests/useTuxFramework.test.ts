import { describe, expect, it } from "vitest";
import { TUX_FRAMEWORKS } from "../app/composables/useTuxFramework";

describe("TUX_FRAMEWORKS registry & metadata", () => {
  it("defines the core cross-framework targets", () => {
    const ids = TUX_FRAMEWORKS.map((f) => f.id);
    expect(ids).toContain("vue");
    expect(ids).toContain("react");
    expect(ids).toContain("wc");
    expect(ids).toContain("razor");
    expect(ids).toContain("python");
    expect(ids).toContain("php");
    expect(ids).toContain("swift");
    expect(ids).toContain("kotlin");
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

    const python = TUX_FRAMEWORKS.find((f) => f.id === "python");
    expect(python?.targetPackage).toBe("tti-ux-python");

    const php = TUX_FRAMEWORKS.find((f) => f.id === "php");
    expect(php?.targetPackage).toBe("tti-ux-php");

    const swift = TUX_FRAMEWORKS.find((f) => f.id === "swift");
    expect(swift?.targetPackage).toBe("TtiUxSwift");

    const kotlin = TUX_FRAMEWORKS.find((f) => f.id === "kotlin");
    expect(kotlin?.targetPackage).toBe("edu.tamu.tti.ux");
  });
});
