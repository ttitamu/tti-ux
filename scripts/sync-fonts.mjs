#!/usr/bin/env node
/*
 * Sync self-hosted font files from @fontsource/* npm packages into
 * `public/fonts/<family>/`, validating WOFF2 header invariants and
 * recording SHA-256 digests in `public/fonts/integrity.json`.
 *
 * Run on demand (not via postinstall — fonts change rarely and
 * committing the WOFF2 files keeps builds offline):
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
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const nodeModules = resolve(repoRoot, "node_modules");
const publicFonts = resolve(repoRoot, "public", "fonts");
const integrityManifestPath = resolve(publicFonts, "integrity.json");

// W3C WOFF2 header constants & safety bounds (woff2shell / CVE-2026-111497 guard)
const WOFF2_MAGIC = 0x774f4632; // 'wOF2'
const WOFF2_HEADER_SIZE = 48;
const ALLOWED_FLAVORS = new Set([
  0x00010000, // TrueType
  0x4f54544f, // 'OTTO' (CFF / OpenType)
  0x74727565, // 'true'
  0x74746366, // 'ttcf' (TrueType Collection)
]);
const MAX_TABLES = 64;
const MAX_UNCOMPRESSED_SFNT_BYTES = 4 * 1024 * 1024; // 4 MiB ceiling for a single subset face

/**
 * Validate WOFF2 48-byte header structure without invoking a Brotli decoder.
 * Rejects truncated, malformed, or zip-bomb-like WOFF2 binaries before they
 * can be committed to `public/fonts/`.
 */
export function validateWoff2Header(buf, label = "woff2") {
  if (buf.length < WOFF2_HEADER_SIZE) {
    throw new Error(`${label}: file too small (${buf.length}B < ${WOFF2_HEADER_SIZE}B WOFF2 header)`);
  }
  const signature = buf.readUInt32BE(0);
  if (signature !== WOFF2_MAGIC) {
    throw new Error(`${label}: invalid WOFF2 magic 0x${signature.toString(16)} (expected 0x774f4632 'wOF2')`);
  }
  const flavor = buf.readUInt32BE(4);
  if (!ALLOWED_FLAVORS.has(flavor)) {
    throw new Error(`${label}: unrecognized SFNT flavor 0x${flavor.toString(16)}`);
  }
  const declaredLength = buf.readUInt32BE(8);
  if (declaredLength !== buf.length) {
    throw new Error(`${label}: declared length (${declaredLength}B) !== actual byte length (${buf.length}B)`);
  }
  const numTables = buf.readUInt16BE(12);
  if (numTables === 0 || numTables > MAX_TABLES) {
    throw new Error(`${label}: invalid numTables (${numTables}; expected 1..${MAX_TABLES})`);
  }
  const reserved = buf.readUInt16BE(14);
  if (reserved !== 0) {
    throw new Error(`${label}: WOFF2 reserved header field must be 0 (got ${reserved})`);
  }
  const totalSfntSize = buf.readUInt32BE(16);
  if (totalSfntSize <= 0 || totalSfntSize > MAX_UNCOMPRESSED_SFNT_BYTES) {
    throw new Error(`${label}: totalSfntSize (${totalSfntSize}B) outside safe bounds (1..${MAX_UNCOMPRESSED_SFNT_BYTES}B)`);
  }
  const totalCompressedSize = buf.readUInt32BE(20);
  if (totalCompressedSize === 0 || totalCompressedSize > buf.length - WOFF2_HEADER_SIZE) {
    throw new Error(
      `${label}: totalCompressedSize (${totalCompressedSize}B) exceeds available payload (${buf.length - WOFF2_HEADER_SIZE}B)`
    );
  }
  return {
    flavor: `0x${flavor.toString(16).padStart(8, "0")}`,
    bytes: buf.length,
    numTables,
    totalSfntSize,
    totalCompressedSize,
  };
}

// Each row: [pkg name, family slug, weights, has-italics].
// Weights match what nuxt.config.ts requested before the local switch
// (Public Sans + JetBrains Mono were Google-served; Open Sans / Oswald /
// Work Sans had partial TTF coverage already, completed here).
export const FONTS = [
  ["public-sans", "public-sans", [400, 500, 600, 700], true],
  ["jetbrains-mono", "jetbrains-mono", [400, 500], true],
  ["open-sans", "open-sans", [300, 400, 500, 600, 700, 800], true],
  ["oswald", "oswald", [200, 300, 400, 500, 600, 700], false],
  ["work-sans", "work-sans", [100, 200, 300, 400, 500, 600, 700, 800, 900], true],
];

async function syncFamily(pkgName, slug, weights, hasItalics, manifestFiles) {
  const pkgJsonPath = resolve(nodeModules, "@fontsource", pkgName, "package.json");
  const pkgJson = JSON.parse(await readFile(pkgJsonPath, "utf8"));
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
      const relKey = `${slug}/${file}`;
      try {
        const buf = await readFile(src);
        const headerMeta = validateWoff2Header(buf, relKey);
        const sha256 = createHash("sha256").update(buf).digest("hex");
        await writeFile(dest, buf);
        manifestFiles[relKey] = {
          sha256,
          bytes: headerMeta.bytes,
          numTables: headerMeta.numTables,
          totalSfntSize: headerMeta.totalSfntSize,
          totalCompressedSize: headerMeta.totalCompressedSize,
          sourcePackage: `@fontsource/${pkgName}@${pkgJson.version}`,
        };
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

async function main() {
  console.log("Syncing self-hosted fonts from node_modules/@fontsource/*");
  const manifestFiles = {};
  for (const [pkg, slug, weights, italics] of FONTS) {
    await syncFamily(pkg, slug, weights, italics, manifestFiles);
  }
  const sortedFiles = Object.fromEntries(
    Object.entries(manifestFiles).sort(([a], [b]) => a.localeCompare(b))
  );
  const manifest = {
    schemaVersion: 1,
    description:
      "WOFF2 header & SHA-256 integrity manifest for self-hosted TUX web fonts (woff2shell / CVE-2026-111497 supply-chain guard). Generated by scripts/sync-fonts.mjs.",
    files: sortedFiles,
  };
  await writeFile(integrityManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`  integrity.json   ${Object.keys(sortedFiles).length} hashes → public/fonts/integrity.json`);
  console.log("Done.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
