#!/usr/bin/env node
/**
 * build-map-runtime.mjs — Compiles `app/utils/tuxArchitectureMap.ts` and
 * `app/utils/tuxArchitectureMapSample.ts` into zero-dependency ESM modules
 * (`runtime/tuxArchitectureMap.mjs`, `runtime/tuxArchitectureMapSample.mjs`)
 * plus self-contained NodeNext declaration files (`runtime/*.d.mts`) so
 * Node 22+ CLI consumers (`scripts/tux-mcp.mjs`), external TypeScript
 * consumers (`moduleResolution: "nodenext"`), and test suites run the exact
 * same M.A.P. engine without bundling the sample model (`tti/tti-ux#112`, `#114`).
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
const runtimeDir = path.join(pkgRoot, "runtime");

const TARGETS = [
  {
    name: "tuxArchitectureMap",
    srcPath: path.join(pkgRoot, "app", "utils", "tuxArchitectureMap.ts"),
    outJsPath: path.join(runtimeDir, "tuxArchitectureMap.mjs"),
    outDmtsPath: path.join(runtimeDir, "tuxArchitectureMap.d.mts"),
    legacyDtsPath: path.join(runtimeDir, "tuxArchitectureMap.d.ts"),
    rewriteRelativeSpecifiers: false,
  },
  {
    name: "tuxArchitectureMapSample",
    srcPath: path.join(pkgRoot, "app", "utils", "tuxArchitectureMapSample.ts"),
    outJsPath: path.join(runtimeDir, "tuxArchitectureMapSample.mjs"),
    outDmtsPath: path.join(runtimeDir, "tuxArchitectureMapSample.d.mts"),
    legacyDtsPath: path.join(runtimeDir, "tuxArchitectureMapSample.d.ts"),
    rewriteRelativeSpecifiers: true,
  },
];

function makeHeader(relSrc, sha256) {
  return (
    `// AUTO-GENERATED from ${relSrc} by scripts/build-map-runtime.mjs — DO NOT EDIT.\n` +
    "// SPDX-License-Identifier: Apache-2.0 (adapts MIT geometry/graph routines; see app/utils/tuxArchitectureMap.ts)\n" +
    `// SOURCE-SHA256: ${sha256}\n`
  );
}

const isCheck = process.argv.includes("--check");
const preparedTargets = TARGETS.map((t) => {
  const relSrc = path.relative(pkgRoot, t.srcPath).replace(/\\/g, "/");
  const srcNormalized = readFileSync(t.srcPath, "utf8").replace(/\r\n/g, "\n");
  const sha256 = createHash("sha256").update(srcNormalized).digest("hex");
  return {
    ...t,
    relSrc,
    srcNormalized,
    header: makeHeader(relSrc, sha256),
  };
});

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
  for (const t of preparedTargets) {
    if (!existsSync(t.outJsPath) || !existsSync(t.outDmtsPath) || existsSync(t.legacyDtsPath)) {
      console.error(
        `runtime/${t.name}.{mjs,d.mts} is missing or stale; run \`npm --prefix packages/diagrams run build:runtime\`.`,
      );
      process.exit(1);
    }
    const curJs = readFileSync(t.outJsPath, "utf8");
    const curDmts = readFileSync(t.outDmtsPath, "utf8");
    if (!curJs.startsWith(t.header) || !curDmts.startsWith(t.header)) {
      console.error(
        `runtime/${t.name}.{mjs,d.mts} SOURCE-SHA256 is out of date with ${t.relSrc}; run \`npm --prefix packages/diagrams run build:runtime\`.`,
      );
      process.exit(1);
    }
  }
  console.log("runtime/tuxArchitectureMap*.{mjs,d.mts} source SHA-256 verified.");
  process.exit(0);
}

function rewriteNodeNextImports(text) {
  return text.replace(
    /(from\s+["'])(\.\/tuxArchitectureMap)(["'])/g,
    "$1./tuxArchitectureMap.mjs$3",
  );
}

function compileAllArtifacts(tsApi) {
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
  const emittedByStem = new Map();
  const host = tsApi.createCompilerHost(dtsOptions);
  host.writeFile = (fileName, text) => {
    if (fileName.endsWith(".d.ts") || fileName.endsWith(".d.mts")) {
      const stem = path.basename(fileName).replace(/\.d\.m?ts$/, "");
      emittedByStem.set(stem, text);
    }
  };
  const program = tsApi.createProgram(
    preparedTargets.map((t) => t.srcPath),
    dtsOptions,
    host,
  );
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

  return preparedTargets.map((t) => {
    const transpiled = tsApi.transpileModule(t.srcNormalized, {
      fileName: `${t.name}.ts`,
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
    const emittedDts = emittedByStem.get(t.name);
    if (!emittedDts) {
      console.error(`build-map-runtime: TypeScript failed to emit declaration output for ${t.name}.`);
      process.exit(1);
    }
    let jsBody = transpiled.outputText.replace(/\r\n/g, "\n");
    let dmtsBody = emittedDts.replace(/\r\n/g, "\n");
    if (t.rewriteRelativeSpecifiers) {
      jsBody = rewriteNodeNextImports(jsBody);
      dmtsBody = rewriteNodeNextImports(dmtsBody);
    }
    return {
      ...t,
      jsContent: `${t.header}${jsBody}`,
      dmtsContent: `${t.header}${dmtsBody}`,
    };
  });
}

const compiledTargets = compileAllArtifacts(ts);

if (isCheck) {
  for (const t of compiledTargets) {
    if (!existsSync(t.outJsPath) || !existsSync(t.outDmtsPath) || existsSync(t.legacyDtsPath)) {
      console.error(
        `runtime/${t.name}.{mjs,d.mts} is missing or stale; run \`npm --prefix packages/diagrams run build:runtime\`.`,
      );
      process.exit(1);
    }
    const curJs = readFileSync(t.outJsPath, "utf8");
    const curDmts = readFileSync(t.outDmtsPath, "utf8");
    if (curJs !== t.jsContent || curDmts !== t.dmtsContent) {
      console.error(
        `runtime/${t.name}.{mjs,d.mts} is out of date with ${t.relSrc}; run \`npm --prefix packages/diagrams run build:runtime\`.`,
      );
      process.exit(1);
    }
  }
  console.log("runtime/tuxArchitectureMap*.{mjs,d.mts} are up to date.");
  process.exit(0);
}

mkdirSync(runtimeDir, { recursive: true });
for (const t of compiledTargets) {
  rmSync(t.legacyDtsPath, { force: true });
  writeFileSync(t.outJsPath, t.jsContent, "utf8");
  writeFileSync(t.outDmtsPath, t.dmtsContent, "utf8");
  console.log(
    `Wrote ${path.relative(pkgRoot, t.outJsPath)} (${t.jsContent.length} bytes) and ${path.relative(pkgRoot, t.outDmtsPath)} (${t.dmtsContent.length} bytes).`,
  );
}
