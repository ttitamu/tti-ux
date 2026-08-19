/**
 * Framework-target locks — the committed kit outputs must match the
 * generator byte-for-byte (the build-tokens --check discipline: edit
 * design/tokens.json, run `npm run build:framework`, commit both), and
 * a handful of known values pin the resolution semantics so a resolver
 * regression can't ship plausible-but-wrong literals.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generate } from "../scripts/build-framework-targets.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const files: Map<string, string> = generate();

describe("committed kit targets ↔ generator", () => {
  it("every target is committed exactly as generated", () => {
    for (const [rel, content] of files) {
      expect(readFileSync(join(ROOT, rel), "utf8"), rel).toBe(content);
    }
  });

  it("no unresolved var() escapes into any target", () => {
    for (const [rel, content] of files) {
      if (rel.endsWith("tux-tokens.ts")) {
        // The tuxVar() helper + its doc comment legitimately spell
        // var(--…) — strip comments and the helper before checking
        // the DATA carries only resolved literals.
        const data = content
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/[^\n]*/g, "")
          .replace(/return `var\(--\$\{name\}\)`;/, "");
        expect(data, rel).not.toContain("var(");
      } else {
        expect(content, rel).not.toContain("var(");
      }
    }
  });
});

describe("resolution semantics", () => {
  const cs = files.get("kit/csharp/TuxTokens.cs")!;
  const react = files.get("kit/react/tux-tokens.ts")!;
  const wp = JSON.parse(files.get("kit/wp/theme.json")!);

  it("brand anchor resolves per theme (maroon light, teal dark)", () => {
    expect(cs).toContain('public const string BrandPrimary = "#5C0025";');
    expect(cs).toContain('"#6BB4C0"'); // dark anchor present in TtiDark
    const themes = react.match(/"brand-primary": "(#[0-9A-Fa-f]{6})"/g)!;
    expect(themes[0]).toContain("#5C0025");
    expect(themes[1]).toContain("#6BB4C0");
  });

  it("wash ladder computes to rgba over the THEME's anchor", () => {
    expect(react).toContain('"wash-brand-8": "rgba(92, 0, 37, 0.08)"'); // tti
    expect(react).toContain('"wash-brand-8": "rgba(107, 180, 192, 0.08)"'); // tti-dark
  });

  it("WordPress theme.json carries the palette and the four families + mono", () => {
    expect(wp.version).toBe(3);
    expect(wp.settings.color.palette.length).toBeGreaterThanOrEqual(25);
    expect(wp.settings.typography.fontFamilies).toHaveLength(5);
    const primary = wp.settings.color.palette.find(
      (p: { slug: string }) => p.slug === "tux-brand-primary",
    );
    expect(primary.color).toBe("#5C0025");
  });
});
