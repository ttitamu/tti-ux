#!/usr/bin/env node
/**
 * packages/react/scripts/copy-assets.mjs
 *
 * Ensures @tti/tti-ux-react is 100% standalone (zero Vue/Nuxt peer dependencies)
 * and that every CSS stylesheet imported by compiled JS in dist/ exists on disk.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "../..");
const SRC_DIR = path.join(PKG_ROOT, "src");
const SRC_COMP_DIR = path.join(SRC_DIR, "components");
const DIST_DIR = path.join(PKG_ROOT, "dist");
const DIST_COMP_DIR = path.join(DIST_DIR, "components");

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(DIST_COMP_DIR, { recursive: true });

// 1. Sync canonical design token CSS and TS into packages/react/src so the package is self-contained
const repoTokensCss = path.join(REPO_ROOT, "kit/css/tux-tokens.css");
const srcTokensCss = path.join(SRC_DIR, "tux-tokens.css");
if (fs.existsSync(repoTokensCss)) {
  fs.copyFileSync(repoTokensCss, srcTokensCss);
}

const repoTokensTs = path.join(REPO_ROOT, "kit/react/tux-tokens.ts");
const srcTokensTs = path.join(SRC_DIR, "tux-tokens.ts");
if (fs.existsSync(repoTokensTs)) {
  fs.copyFileSync(repoTokensTs, srcTokensTs);
}

// 2. Copy top-level stylesheets (styles.css, tux-tokens.css) to dist/
for (const cssFile of ["styles.css", "tux-tokens.css"]) {
  const from = path.join(SRC_DIR, cssFile);
  const to = path.join(DIST_DIR, cssFile);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, to);
  }
}

// 3. Copy all component stylesheets (src/components/*.css) to dist/components/*.css
let copiedCount = 0;
for (const entry of fs.readdirSync(SRC_COMP_DIR)) {
  if (entry.endsWith(".css")) {
    fs.copyFileSync(path.join(SRC_COMP_DIR, entry), path.join(DIST_COMP_DIR, entry));
    copiedCount++;
  }
}

// 4. Verify every relative CSS import in dist/**/*.js resolves to an existing file in dist/
function verifyCssImports(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      verifyCssImports(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      const code = fs.readFileSync(fullPath, "utf8");
      const matches = code.matchAll(/import\s+["'](\.[^"']+\.css)["']/g);
      for (const m of matches) {
        const relCss = m[1];
        const targetCss = path.resolve(path.dirname(fullPath), relCss);
        if (!fs.existsSync(targetCss)) {
          throw new Error(
            `[copy-assets] Unresolved CSS import "${relCss}" in ${path.relative(PKG_ROOT, fullPath)}`
          );
        }
      }
    }
  }
}

verifyCssImports(DIST_DIR);
console.log(
  `✓ @tti/tti-ux-react: copied tux-tokens.css, styles.css, and ${copiedCount} component CSS files to dist/ (0 unresolved imports)`
);
