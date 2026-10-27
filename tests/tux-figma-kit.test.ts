/**
 * Unit & structural verification tests for the Zero-Subscription TUX Figma Kit (`kit/figma/`).
 */
import { describe, expect, it } from "vitest";
import { tuxCatalog } from "../app/utils/tuxCatalog";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generate, parseColorToFigmaRgba, parseDimensionPx } from "../scripts/build-figma-kit.mjs";

const artifacts: Map<string, string> = generate();

describe("TUX Zero-Subscription Figma Kit (kit/figma/)", () => {
  it("parses hex and rgba colors into Figma 0..1 RGBA floats accurately", () => {
    const maroon = parseColorToFigmaRgba("#5C0025");
    expect(maroon).not.toBeNull();
    expect(maroon.hex).toBe("#5C0025");
    expect(maroon.rgba.r).toBeCloseTo(92 / 255, 3);
    expect(maroon.rgba.g).toBe(0);
    expect(maroon.rgba.b).toBeCloseTo(37 / 255, 3);
    expect(maroon.rgba.a).toBe(1);

    const wash = parseColorToFigmaRgba("rgba(92, 0, 37, 0.08)");
    expect(wash).not.toBeNull();
    expect(wash.hex).toBe("#5C0025");
    expect(wash.rgba.a).toBe(0.08);
  });

  it("converts CSS dimensions to numeric pixels for Figma FLOAT variables", () => {
    expect(parseDimensionPx("0")).toBe(0);
    expect(parseDimensionPx("16px")).toBe(16);
    expect(parseDimensionPx("0.375rem")).toBe(6);
    expect(parseDimensionPx("80rem")).toBe(1280);
  });

  it("emits valid W3C DTCG 2025.10 tokens with 3-mode TUX extensions", () => {
    const dtcg = JSON.parse(artifacts.get("kit/figma/tokens.dtcg.json")!);
    expect(dtcg.$schema).toBe("https://tr.designtokens.org/format/");
    expect(dtcg.$metadata.modes).toEqual(["tti", "tti-dark", "tti-hc"]);
    expect(dtcg.brand.primary.$type).toBe("color");
    expect(dtcg.brand.primary.$value).toBe("#5C0025");
    expect(dtcg.brand.primary.$extensions["edu.tamu.tti.tux"].modes).toEqual({
      tti: "#5C0025",
      "tti-dark": "#6BB4C0",
      "tti-hc": "#500000",
    });
  });

  it("emits valid Tokens Studio for Figma multi-mode sets and $themes", () => {
    const studio = JSON.parse(artifacts.get("kit/figma/tokens-studio.json")!);
    expect(studio.$metadata.tokenSetOrder).toEqual(["tti", "tti-dark", "tti-hc"]);
    expect(studio.$themes).toHaveLength(3);
    expect(studio.tti.brand.primary.value).toBe("#5C0025");
    expect(studio["tti-dark"].brand.primary.value).toBe("#6BB4C0");
    expect(studio["tti-hc"].brand.primary.value).toBe("#500000");
  });

  it("emits native Figma Variables with COLOR, FLOAT, and STRING types and scopes", () => {
    const vars = JSON.parse(artifacts.get("kit/figma/figma-variables.json")!);
    expect(vars.collection).toBe("TUX Institutional Tokens");
    expect(vars.modes.map((m: { modeId: string }) => m.modeId)).toEqual([
      "tti",
      "tti-dark",
      "tti-hc",
    ]);
    expect(vars.variables.length).toBeGreaterThan(80);

    const brandPrimary = vars.variables.find(
      (v: { name: string }) => v.name === "brand/primary",
    );
    expect(brandPrimary).toBeDefined();
    expect(brandPrimary.resolvedType).toBe("COLOR");
    expect(brandPrimary.codeSyntax.WEB).toBe("var(--brand-primary)");
    expect(brandPrimary.valuesByMode.tti.hex).toBe("#5C0025");
    expect(brandPrimary.valuesByMode["tti-dark"].hex).toBe("#6BB4C0");

    const radiusMd = vars.variables.find((v: { name: string }) => v.name === "radius/md");
    expect(radiusMd).toBeDefined();
    expect(radiusMd.resolvedType).toBe("FLOAT");
    expect(radiusMd.scopes).toContain("CORNER_RADIUS");
    expect(radiusMd.valuesByMode.tti).toBe(6);
  });

  it("maps every single entry in tuxCatalog.ts into kit/figma/code-connect.json", () => {
    const cc = JSON.parse(artifacts.get("kit/figma/code-connect.json")!);
    expect(cc.totalCatalogCount).toBe(tuxCatalog.length);
    expect(cc.components).toHaveLength(tuxCatalog.length);

    const buttonEntry = cc.components.find(
      (c: { name: string }) => c.name === "TuxButton",
    );
    expect(buttonEntry).toBeDefined();
    expect(buttonEntry.tagName).toBe("tux-button");
    expect(buttonEntry.a11y.wcagLevel).toBe("AAA");
    expect(buttonEntry.snippets.vue).toContain("<TuxButton");
    expect(buttonEntry.snippets.react).toContain("@tti/tti-ux-react");
    expect(buttonEntry.snippets.webComponents).toBe("<tux-button></tux-button>");
  });

  it("emits 12 Copy-to-Figma SVG component sheets with resolved hex literals and zero var()", () => {
    const manifest = JSON.parse(
      artifacts.get("kit/figma/svg-components/manifest.json")!,
    );
    expect(manifest.count).toBe(12);
    expect(manifest.sheets).toHaveLength(12);

    for (const sheet of manifest.sheets) {
      const svg = artifacts.get(sheet.file);
      expect(svg, sheet.file).toBeDefined();
      expect(svg).toContain("<svg xmlns=\"http://www.w3.org/2000/svg\"");
      expect(svg).not.toContain("var(--");
      expect(svg).toContain("#5C0025");
    }
  });

  it("ships a zero-network local Figma plugin with Free Starter Plan 1-mode fallback", () => {
    const manifest = JSON.parse(artifacts.get("kit/figma/plugin/manifest.json")!);
    expect(manifest.id).toBe("edu.tamu.tti.tux.figma-kit");
    expect(manifest.networkAccess.allowedDomains).toEqual(["none"]);
    expect(manifest.editorType).toEqual(["figma", "dev"]);

    const pluginCode = artifacts.get("kit/figma/plugin/code.js")!;
    expect(pluginCode).toContain("syncPaintAndTextStyles");
    expect(pluginCode).toContain("syncFigmaVariables");
    expect(pluginCode).toContain("generateAutoLayoutKitOnCanvas");
    // Ensures Free Starter plan 1-mode fallback is baked into the plugin
    expect(pluginCode).toContain("multiModeSupported = false");
    expect(pluginCode).toContain("TUX Tokens — Dark (tti-dark)");
  });
});
