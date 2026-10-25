/**
 * Typography-discipline guards — the four-family rule as a unit test.
 *
 * The 2026-08-19 visual-language pass found 78 references to the
 * deprecated `--font-sans` (Public Sans) across 44 files: the token
 * was deprecated in v1.8.0 but nothing enforced it, so new components
 * kept copy-pasting it from old ones. Same doctrine as
 * tests/tux-catalog.test.ts: cross-file consistency as a unit test.
 *
 * `--font-sans` stays *defined* (tokens.css aliases it to the body
 * stack for legacy consumers) — this suite only bans *references*
 * from app code, plus the fallback idioms that smuggle it back in.
 */
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error -- .mjs build script without .d.ts
import { validateWoff2Header } from "../scripts/sync-fonts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(vue|ts|css)$/.test(name)) out.push(p);
  }
  return out;
}

const appFiles = ["components", "pages", "layouts", "composables", "utils"]
  .flatMap((d) => walk(join(ROOT, "app", d)));

describe("four-family typography rule", () => {
  it("no app code references the deprecated --font-sans token", () => {
    const offenders = appFiles
      .filter((f) => readFileSync(f, "utf8").includes("var(--font-sans"))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it("no dead-fallback font chains (every --font-* token is always defined)", () => {
    // `var(--font-display, var(--font-x))` documents a dependency that
    // can never fire — tokens.css defines all five families.
    const offenders = appFiles
      .filter((f) => /var\(--font-\w+,\s*var\(--font-/.test(readFileSync(f, "utf8")))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it("no hardcoded font stacks outside the sanctioned exceptions", () => {
    // Font names live in tokens.css / fonts.css. Components reference
    // tokens. Exceptions: TuxAppFrame simulates native OS chrome
    // (commented as sanctioned in-file); useTuxMermaid carries the
    // body stack as a non-DOM fallback only.
    const sanctioned = new Set([
      "app/components/TuxAppFrame.vue",
      "app/composables/useTuxMermaid.ts",
    ]);
    const namedFaces = /font-family:\s*(?!var\()[^;]*("Open Sans"|"Public Sans"|Oswald|"Work Sans"|Georgia|JetBrains|-apple-system|Segoe|Inter)/;
    const offenders = appFiles
      .filter((f) => !sanctioned.has(relative(ROOT, f)))
      .filter((f) => namedFaces.test(readFileSync(f, "utf8")))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it("disables @nuxt/fonts auto-registration and WOFF2 parsing (woff2shell / CVE-2026-111497 guard)", () => {
    const configSrc = readFileSync(join(ROOT, "nuxt.config.ts"), "utf8");
    // Ensure @nuxt/ui is configured with `fonts: false` so @nuxt/fonts (and fontkitten's WOFF2 Brotli decoder) is not loaded
    expect(configSrc).toMatch(/ui:\s*\{[\s\S]*?fonts:\s*false/);
    // Ensure local and remote providers in `fonts.providers` are explicitly disabled as defense-in-depth
    expect(configSrc).toMatch(/providers:\s*\{[\s\S]*?local:\s*false/);
    expect(configSrc).toMatch(/providers:\s*\{[\s\S]*?google:\s*false/);
  });

  it("verifies WOFF2 header invariants and SHA-256 integrity for all self-hosted fonts", () => {
    const fontsDir = join(ROOT, "public", "fonts");
    const manifestPath = join(fontsDir, "integrity.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      schemaVersion: number;
      files: Record<
        string,
        {
          sha256: string;
          bytes: number;
          numTables: number;
          totalSfntSize: number;
          totalCompressedSize: number;
        }
      >;
    };
    expect(manifest.schemaVersion).toBe(1);

    // Collect every .woff2 file on disk under public/fonts/
    const onDiskWoff2: string[] = [];
    for (const entry of readdirSync(fontsDir)) {
      const sub = join(fontsDir, entry);
      if (!statSync(sub).isDirectory()) continue;
      for (const f of readdirSync(sub)) {
        if (f.endsWith(".woff2")) {
          onDiskWoff2.push(`${entry}/${f}`);
        }
      }
    }
    onDiskWoff2.sort();

    // Every on-disk .woff2 must be in integrity.json and vice versa
    expect(onDiskWoff2).toEqual(Object.keys(manifest.files).sort());

    // Every @font-face url("/fonts/<rel>") in fonts.css must resolve to a verified file
    const fontsCss = readFileSync(join(ROOT, "app", "assets", "css", "fonts.css"), "utf8");
    const referencedUrls = [...fontsCss.matchAll(/url\("\/fonts\/([^"]+)"\)/g)].map((m) => m[1]!);
    expect(referencedUrls.length).toBeGreaterThan(0);
    for (const rel of referencedUrls) {
      expect(manifest.files[rel], `fonts.css references unverified font: ${rel}`).toBeDefined();
    }

    // Validate binary WOFF2 headers and SHA-256 digests
    for (const rel of onDiskWoff2) {
      const buf = readFileSync(join(fontsDir, rel));
      const meta = validateWoff2Header(buf, rel);
      const sha256 = createHash("sha256").update(buf).digest("hex");
      const expected = manifest.files[rel]!;
      expect(sha256, `SHA-256 mismatch for ${rel}`).toBe(expected.sha256);
      expect(meta.bytes, `Byte length mismatch for ${rel}`).toBe(expected.bytes);
      expect(meta.numTables, `Table count mismatch for ${rel}`).toBe(expected.numTables);
      expect(meta.totalSfntSize, `SFNT size mismatch for ${rel}`).toBe(expected.totalSfntSize);
      expect(meta.totalCompressedSize, `Compressed size mismatch for ${rel}`).toBe(expected.totalCompressedSize);
    }
  });

  it("no third-party font CDN links (fonts.googleapis.com / fonts.gstatic.com) in app, public, or packages", () => {
    const walkAll = (dir: string, out: string[] = []): string[] => {
      for (const name of readdirSync(dir)) {
        if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue;
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walkAll(p, out);
        else if (/\.(vue|ts|js|mjs|css|html|php)$/.test(name)) out.push(p);
      }
      return out;
    };
    const scanFiles = ["app", "public", "packages", "kit", "templates"]
      .flatMap((d) => walkAll(join(ROOT, d)));
    const cdnRe = /fonts\.googleapis\.com|fonts\.gstatic\.com|fonts\.bunny\.net|api\.fontshare\.com/;
    const offenders = scanFiles
      .filter((f) => cdnRe.test(readFileSync(f, "utf8")))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });
});
