import { describe, it, expect } from "vitest";
import { existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const LOGO_DIR = join(process.cwd(), "public", "resources", "logos");

describe("brand-logos (<10KB transparent PNG resources)", () => {
  const expectedLockups = [
    "tti-logo-color.png",
    "tti-logo-black.png",
    "tti-logo-white.png",
    "tti-logo-maroon.png",
  ];

  const expectedGlyphs = [
    "tti-glyph-color.png",
    "tti-glyph-color-square.png",
    "tti-glyph-black.png",
    "tti-glyph-black-square.png",
    "tti-glyph-white.png",
    "tti-glyph-white-square.png",
    "tti-glyph-maroon.png",
    "tti-glyph-maroon-square.png",
  ];

  it("all expected lockups exist and are strictly under 10 KB (10,240 B)", async () => {
    for (const filename of expectedLockups) {
      const p = join(LOGO_DIR, filename);
      expect(existsSync(p), `File exists: ${filename}`).toBe(true);

      const stat = statSync(p);
      expect(stat.size, `${filename} size <= 10,240 bytes`).toBeLessThan(10240);
      expect(stat.size, `${filename} size < 10,000 bytes`).toBeLessThan(10000);

      const meta = await sharp(p).metadata();
      expect(meta.hasAlpha, `${filename} hasAlpha`).toBe(true);
      expect(meta.width, `${filename} width`).toBe(680);
      expect(meta.height, `${filename} height`).toBe(131);

      // Verify top-left pixel is 100% transparent
      const { data } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
      expect(data[3], `${filename} top-left alpha is 0`).toBe(0);
    }
  });

  it("all square and cropped glyphs exist and are well under 5 KB", async () => {
    for (const filename of expectedGlyphs) {
      const p = join(LOGO_DIR, filename);
      expect(existsSync(p), `File exists: ${filename}`).toBe(true);

      const stat = statSync(p);
      expect(stat.size, `${filename} size < 5,000 bytes`).toBeLessThan(5000);

      const meta = await sharp(p).metadata();
      expect(meta.hasAlpha, `${filename} hasAlpha`).toBe(true);
      if (filename.includes("square")) {
        expect(meta.width).toBe(512);
        expect(meta.height).toBe(512);
      }
    }
  });

  it("high-res master archive exists in hires/", () => {
    const hiresDir = join(LOGO_DIR, "hires");
    expect(existsSync(join(hiresDir, "tti-logo-color-hires.png"))).toBe(true);
    expect(existsSync(join(hiresDir, "tti-logo-black-hires.png"))).toBe(true);
    expect(existsSync(join(hiresDir, "tti-logo-white-hires.png"))).toBe(true);
  });
});
