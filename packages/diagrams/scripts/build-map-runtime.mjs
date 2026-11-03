#!/usr/bin/env node
/**
 * build-map-runtime.mjs — Compiles `app/utils/tuxArchitectureMap.ts` into a
 * zero-dependency ESM module (`runtime/tuxArchitectureMap.mjs`) plus a
 * self-contained NodeNext declaration file (`runtime/tuxArchitectureMap.d.mts`)
 * so Node 22+ CLI consumers (`scripts/tux-mcp.mjs`), external TypeScript
 * consumers (`moduleResolution: "nodenext"`), and test suites run the exact
 * same M.A.P. engine (`tti/tti-ux#112`).
 *
 * Usage:
 *   node packages/diagrams/scripts/build-map-runtime.mjs          # write runtime files
 *   node packages/diagrams/scripts/build-map-runtime.mjs --check  # verify up to date
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const srcPath = path.join(pkgRoot, "app", "utils", "tuxArchitectureMap.ts");
const runtimeDir = path.join(pkgRoot, "runtime");
const outJsPath = path.join(runtimeDir, "tuxArchitectureMap.mjs");
const outDmtsPath = path.join(runtimeDir, "tuxArchitectureMap.d.mts");
const legacyDtsPath = path.join(runtimeDir, "tuxArchitectureMap.d.ts");

const isCheck = process.argv.includes("--check");
const srcRaw = readFileSync(srcPath, "utf8");
const srcNormalized = srcRaw.replace(/\r\n/g, "\n");
const srcSha256 = createHash("sha256").update(srcNormalized).digest("hex");

const HEADER =
  "// AUTO-GENERATED from app/utils/tuxArchitectureMap.ts by scripts/build-map-runtime.mjs — DO NOT EDIT.\n" +
  "// SPDX-License-Identifier: Apache-2.0 (adapts MIT geometry/graph routines; see app/utils/tuxArchitectureMap.ts)\n" +
  `// SOURCE-SHA256: ${srcSha256}\n`;

let ts = null;
try {
  const mod = await import("typescript");
  ts = mod.default ?? mod;
} catch {
  if (!isCheck) {
    console.error("build-map-runtime: `typescript` is required to build runtime artifacts (`npm ci`).");
    process.exit(1);
  }
}

if (isCheck && !ts) {
  // Zero-dependency CI path (`layer-check.yml`, `publish-package.yml` before `npm ci`):
  // verify artifacts exist, legacy `.d.ts` is gone, and embedded SHA-256 matches source.
  if (!existsSync(outJsPath) || !existsSync(outDmtsPath) || existsSync(legacyDtsPath)) {
    console.error(
      "runtime/tuxArchitectureMap.{mjs,d.mts} is missing or stale; run `npm --prefix packages/diagrams run build:runtime`.",
    );
    process.exit(1);
  }
  const curJs = readFileSync(outJsPath, "utf8");
  const curDmts = readFileSync(outDmtsPath, "utf8");
  if (!curJs.startsWith(HEADER) || !curDmts.startsWith(HEADER)) {
    console.error(
      "runtime/tuxArchitectureMap.{mjs,d.mts} SOURCE-SHA256 is out of date with app/utils/tuxArchitectureMap.ts; run `npm --prefix packages/diagrams run build:runtime`.",
    );
    process.exit(1);
  }
  console.log("runtime/tuxArchitectureMap.{mjs,d.mts} source SHA-256 verified.");
  process.exit(0);
}

function compileArtifacts(tsApi) {
  const transpiled = tsApi.transpileModule(srcNormalized, {
    fileName: "tuxArchitectureMap.ts",
    reportDiagnostics: true,
    compilerOptions: {
      target: tsApi.ScriptTarget.ES2022,
      module: tsApi.ModuleKind.ES2022,
      removeComments: true,
      newLine: tsApi.NewLineKind.LineFeed,
    },
  });

  if (transpiled.diagnostics && transpiled.diagnostics.length > 0) {
    const formatted = tsApi.formatDiagnostics(transpiled.diagnostics, {
      getCanonicalFileName: (f) => f,
      getCurrentDirectory: () => pkgRoot,
      getNewLine: () => "\n",
    });
    console.error(formatted);
    process.exit(1);
  }

  const dtsOptions = {
    declaration: true,
    emitDeclarationOnly: true,
    target: tsApi.ScriptTarget.ES2022,
    module: tsApi.ModuleKind.ES2022,
    moduleResolution: tsApi.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    removeComments: false,
    newLine: tsApi.NewLineKind.LineFeed,
  };
  const host = tsApi.createCompilerHost(dtsOptions);
  let emittedDts = "";
  host.writeFile = (fileName, text) => {
    if (fileName.endsWith(".d.ts") || fileName.endsWith(".d.mts")) {
      emittedDts = text;
    }
  };
  const program = tsApi.createProgram([srcPath], dtsOptions, host);
  const emitRes = program.emit();
  if (emitRes.diagnostics && emitRes.diagnostics.length > 0) {
    const formatted = tsApi.formatDiagnostics(emitRes.diagnostics, {
      getCanonicalFileName: (f) => f,
      getCurrentDirectory: () => pkgRoot,
      getNewLine: () => "\n",
    });
    console.error(formatted);
    process.exit(1);
  }
  if (!emittedDts) {
    console.error("build-map-runtime: TypeScript failed to emit declaration output.");
    process.exit(1);
  }

  return {
    jsContent: `${HEADER}${transpiled.outputText.replace(/\r\n/g, "\n")}`,
    dmtsContent: `${HEADER}${emittedDts.replace(/\r\n/g, "\n")}`,
  };
}

const { jsContent, dmtsContent } = compileArtifacts(ts);

if (isCheck) {
  if (!existsSync(outJsPath) || !existsSync(outDmtsPath) || existsSync(legacyDtsPath)) {
    console.error(
      "runtime/tuxArchitectureMap.{mjs,d.mts} is missing or stale; run `npm --prefix packages/diagrams run build:runtime`.",
    );
    process.exit(1);
  }
  const curJs = readFileSync(outJsPath, "utf8");
  const curDmts = readFileSync(outDmtsPath, "utf8");
  if (curJs !== jsContent || curDmts !== dmtsContent) {
    console.error(
      "runtime/tuxArchitectureMap.{mjs,d.mts} is out of date with app/utils/tuxArchitectureMap.ts; run `npm --prefix packages/diagrams run build:runtime`.",
    );
    process.exit(1);
  }
  console.log("runtime/tuxArchitectureMap.{mjs,d.mts} is up to date.");
  process.exit(0);
}

mkdirSync(runtimeDir, { recursive: true });
rmSync(legacyDtsPath, { force: true });
writeFileSync(outJsPath, jsContent, "utf8");
writeFileSync(outDmtsPath, dmtsContent, "utf8");
console.log(
  `Wrote ${path.relative(pkgRoot, outJsPath)} (${jsContent.length} bytes) and ${path.relative(pkgRoot, outDmtsPath)} (${dmtsContent.length} bytes).`,
);
