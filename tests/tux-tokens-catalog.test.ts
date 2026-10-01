import { describe, expect, it } from "vitest";
import {
  tuxTokensCatalog,
  searchTuxTokens,
  type TuxTokenCategory,
} from "../app/utils/tuxTokensCatalog";

describe("tuxTokensCatalog", () => {
  it("contains at least 40 canonical design system tokens", () => {
    expect(tuxTokensCatalog.length).toBeGreaterThanOrEqual(40);
  });

  it("every token name begins with -- and cleanName matches without --", () => {
    for (const token of tuxTokensCatalog) {
      expect(token.name.startsWith("--")).toBe(true);
      expect(token.name.slice(2)).toBe(token.cleanName);
      expect(token.description.length).toBeGreaterThan(5);
    }
  });

  it("includes all expected token categories", () => {
    const categories = new Set(tuxTokensCatalog.map((t) => t.category));
    const expected: TuxTokenCategory[] = [
      "brand",
      "semantic",
      "surface",
      "text",
      "status",
      "ops",
      "wash",
      "radius",
      "shadow",
      "typography",
    ];
    for (const cat of expected) {
      expect(categories.has(cat)).toBe(true);
    }
  });

  it("identifies color tokens and provides valid color values", () => {
    const colorTokens = tuxTokensCatalog.filter((t) => t.isColor);
    expect(colorTokens.length).toBeGreaterThanOrEqual(30);

    for (const token of colorTokens) {
      const isHex = /^#[0-9A-Fa-f]{6}$/.test(token.value);
      const isRgba = /^rgba?\(.+\)$/.test(token.value);
      const isColorMix = /^color-mix\(.+\)$/.test(token.value);
      expect(isHex || isRgba || isColorMix).toBe(true);
    }
  });

  describe("searchTuxTokens", () => {
    it("returns default slice when query is empty", () => {
      const results = searchTuxTokens("");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe("--tti-maroon");
    });

    it("strips -- prefix and finds matching token", () => {
      const results = searchTuxTokens("--brand-primary");
      expect(results.some((t) => t.cleanName === "brand-primary")).toBe(true);
    });

    it("strips token: prefix and finds tokens", () => {
      const results = searchTuxTokens("token:gold");
      expect(results.some((t) => t.cleanName.includes("gold"))).toBe(true);
    });

    it("matches descriptions like maroon or 508", () => {
      const results = searchTuxTokens("508");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].cleanName).toBe("tti-maroon-deep");
    });

    it("matches operational telemetry status ramp", () => {
      const results = searchTuxTokens("ops");
      expect(results.some((t) => t.cleanName.startsWith("status-"))).toBe(true);
    });
  });
});
