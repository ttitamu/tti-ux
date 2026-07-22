/**
 * Refresh the AggieUX reference snapshot under reference/aggieux/.
 *
 * Run: npm run sync:aggieux
 *
 * Pulls the published CSS + JS from the Texas A&M CDN. These files are
 * reference-only — they're not loaded at runtime (see
 * reference/aggieux/README.md for why).
 *
 * Bump AUX_VERSION when AggieUX ships a new release; the old snapshot
 * directory stays around for diffing.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const AUX_VERSION = "2.0.1";
const BASE = `https://aux.tamu.edu/v2/${AUX_VERSION}`;
// Upstream ships the JS as `aux.js`, but `AUX` is a reserved device name on
// Windows (git-for-windows refuses to index it). We rename on disk to
// `aux-script.js` — README flags the rename for anyone grepping for the
// original filename.
const TARGETS = [
  { url: `${BASE}/styles/aux-styles.css`, filename: "aux-styles.css" },
  { url: `${BASE}/js/aux.js`,             filename: "aux-script.js" },
];

const outDir = resolve(process.cwd(), "reference/aggieux", `v${AUX_VERSION}`);
mkdirSync(outDir, { recursive: true });

for (const { url, filename } of TARGETS) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${url} — HTTP ${res.status}`);
    process.exit(1);
  }
  const body = await res.text();
  const outPath = resolve(outDir, filename);
  writeFileSync(outPath, body);
  const kb = (body.length / 1024).toFixed(1);
  console.log(`ok   ${filename}  (${kb} KB)`);
}

console.log(`\nSnapshot written to ${outDir}`);
console.log(`Remember to update the "Pulled" date in reference/aggieux/README.md.`);
