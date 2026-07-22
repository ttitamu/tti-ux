/**
 * Regenerate app/utils/lucide-names.ts from the currently-installed
 * @iconify-json/lucide manifest. Run after bumping that package:
 *
 *   node scripts/gen-lucide-names.mjs
 *
 * We strip everything but the name list so the style guide's icon catalog
 * doesn't bundle 550KB of SVG bodies — Nuxt Icon fetches those on demand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const manifestPath = resolve(
  process.cwd(),
  "node_modules/@iconify-json/lucide/icons.json",
);
const outPath = resolve(process.cwd(), "app/utils/lucide-names.ts");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const names = Object.keys(manifest.icons).sort();

const body = [
  "// Generated from @iconify-json/lucide/icons.json — do not hand-edit.",
  "// Regenerate: node scripts/gen-lucide-names.mjs",
  `export const lucideIconNames: readonly string[] = ${JSON.stringify(names, null, 2)} as const;`,
  `export const lucideIconCount = ${names.length};`,
  "",
].join("\n");

writeFileSync(outPath, body);
console.log(`Wrote ${names.length} icon names to ${outPath}`);
