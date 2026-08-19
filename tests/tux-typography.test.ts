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
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

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
});
