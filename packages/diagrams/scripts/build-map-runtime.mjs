#!/usr/bin/env node
/**
 * build-map-runtime.mjs — Compiles `app/utils/tuxArchitectureMap.ts` into a
 * zero-dependency ESM module (`runtime/tuxArchitectureMap.mjs`) so Node 22+
 * CLI consumers (`scripts/tux-mcp.mjs`) and test suites run the exact same
 * M.A.P. engine without type-stripping flags (`tti/tti-ux#112`).
 *
 * Usage:
 *   node packages/diagrams/scripts/build-map-runtime.mjs          # write runtime files
 *   node packages/diagrams/scripts/build-map-runtime.mjs --check  # verify up to date
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const srcPath = path.join(pkgRoot, "app", "utils", "tuxArchitectureMap.ts");
const runtimeDir = path.join(pkgRoot, "runtime");
const outJsPath = path.join(runtimeDir, "tuxArchitectureMap.mjs");
const outDtsPath = path.join(runtimeDir, "tuxArchitectureMap.d.ts");

const HEADER =
  "// AUTO-GENERATED from app/utils/tuxArchitectureMap.ts by scripts/build-map-runtime.mjs — DO NOT EDIT.\n";

const DTS_CONTENT = `${HEADER}export * from "../app/utils/tuxArchitectureMap";\n`;

const srcText = readFileSync(srcPath, "utf8");
const transpiled = ts.transpileModule(srcText, {
  fileName: "tuxArchitectureMap.ts",
  reportDiagnostics: true,
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
    removeComments: false,
    newLine: ts.NewLineKind.LineFeed,
  },
});

if (transpiled.diagnostics && transpiled.diagnostics.length > 0) {
  const formatted = ts.formatDiagnostics(transpiled.diagnostics, {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => pkgRoot,
    getNewLine: () => "\n",
  });
  console.error(formatted);
  process.exit(1);
}

const jsContent = `${HEADER}${transpiled.outputText.replace(/\r\n/g, "\n")}`;

if (process.argv.includes("--check")) {
  if (!existsSync(outJsPath) || !existsSync(outDtsPath)) {
    console.error(
      "runtime/tuxArchitectureMap.mjs is missing; run `npm --prefix packages/diagrams run build:runtime`.",
    );
    process.exit(1);
  }
  const curJs = readFileSync(outJsPath, "utf8");
  const curDts = readFileSync(outDtsPath, "utf8");
  if (curJs !== jsContent || curDts !== DTS_CONTENT) {
    console.error(
      "runtime/tuxArchitectureMap.mjs is out of date with app/utils/tuxArchitectureMap.ts; run `npm --prefix packages/diagrams run build:runtime`.",
    );
    process.exit(1);
  }
  console.log("runtime/tuxArchitectureMap.mjs is up to date.");
  process.exit(0);
}

mkdirSync(runtimeDir, { recursive: true });
writeFileSync(outJsPath, jsContent, "utf8");
writeFileSync(outDtsPath, DTS_CONTENT, "utf8");
console.log(`Wrote ${path.relative(pkgRoot, outJsPath)} (${jsContent.length} bytes).`);
