#!/usr/bin/env node
/*
 * Sync self-hosted font files from @fontsource/* npm packages into
 * `public/fonts/<family>/`. Run on demand (not via postinstall — fonts
 * change rarely and committing the WOFF2 files keeps builds offline).
 *
 *   node scripts/sync-fonts.mjs
 *
 * Source of truth for which families + weights ship is the FONTS array
 * below — matches what `app/assets/css/fonts.css` declares @font-face
 * rules for and what tti-ux components actually request. Adding a new
 * family is: install the @fontsource package, add a row here, run the
 * script, add @font-face rules to fonts.css.
 *
 * Only WOFF2 + latin subset for now. The fontsource packages also ship
 * .woff (older-browser fallback) and other subsets (cyrillic, greek,
 * vietnamese) — none of which we need today. Add later if a user-
 * facing reason emerges.
 */
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const nodeModules = resolve(repoRoot, "node_modules");
const publicFonts = resolve(repoRoot, "public", "fonts");

// Each row: [pkg name, family slug, weights, has-italics].
// Weights match what nuxt.config.ts requested before the local switch
// (Public Sans + JetBrains Mono were Google-served; Open Sans / Oswald /
// Work Sans had partial TTF coverage already, completed here).
const FONTS = [
  ["public-sans", "public-sans", [400, 500, 600, 700], true],
  ["jetbrains-mono", "jetbrains-mono", [400, 500], true],
  ["open-sans", "open-sans", [300, 400, 500, 600, 700, 800], true],
  ["oswald", "oswald", [200, 300, 400, 500, 600, 700], false],
  ["work-sans", "work-sans", [100, 200, 300, 400, 500, 600, 700, 800, 900], true],
];

async function syncFamily(pkgName, slug, weights, hasItalics) {
  const srcDir = resolve(nodeModules, "@fontsource", pkgName, "files");
  const destDir = resolve(publicFonts, slug);

  // Clear stale files in destination so the script is idempotent and
  // weight-set changes don't leave orphans behind. Skipped for the
  // legacy TTF directories — we keep the old .ttf alongside the new
  // .woff2 so cached CSS pointing at old paths still resolves during
  // the transition. Once those are removed from any consumer CSS, the
  // .ttf cleanup is a follow-up.
  try {
    const existing = await readdir(destDir);
    for (const f of existing) {
      if (f.endsWith(".woff2")) {
        await rm(resolve(destDir, f));
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  await mkdir(destDir, { recursive: true });

  const styles = hasItalics ? ["normal", "italic"] : ["normal"];
  let copied = 0;
  for (const weight of weights) {
    for (const style of styles) {
      const file = `${pkgName}-latin-${weight}-${style}.woff2`;
      const src = resolve(srcDir, file);
      const dest = resolve(destDir, file);
      try {
        await copyFile(src, dest);
        copied++;
      } catch (e) {
        if (e.code === "ENOENT") {
          console.warn(
            `  ⚠  missing in fontsource: ${pkgName} ${weight} ${style}`
          );
        } else {
          throw e;
        }
      }
    }
  }
  console.log(`  ${slug.padEnd(16)} ${copied} files → public/fonts/${slug}/`);
}

console.log("Syncing self-hosted fonts from node_modules/@fontsource/*");
for (const [pkg, slug, weights, italics] of FONTS) {
  await syncFamily(pkg, slug, weights, italics);
}
console.log("Done.");
