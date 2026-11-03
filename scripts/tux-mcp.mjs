#!/usr/bin/env node
/**
 * tux-mcp.mjs — Zero-Dependency Model Context Protocol (MCP) Server for TUX
 *
 * Exposes the Texas A&M Transportation Institute (TTI) Design System (TUX)
 * catalog, structured component AST (props/defaults/slots/events), semantic
 * tokens, WCAG 2.2 AAA contrast engine (with hue-preserving AAA hex snapping),
 * MCP Resources, MCP Prompts, and 4-layer static snippet auto-fixer over
 * JSON-RPC 2.0 (stdio — both newline-delimited and Content-Length framed).
 *
 * Usage:
 *   npx tux-audit mcp [--model <path>] [--base-model <path>]
 *   npx tux-audit mcp [--model <path>] --list-tools
 *   npx tux-audit mcp [--model <path>] --call <tool> [jsonArgs]
 */

import { readFileSync, readdirSync, existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let mapRuntime = null;
let mapRuntimeLoadError = null;
try {
  mapRuntime = await import("../packages/diagrams/runtime/tuxArchitectureMap.mjs");
} catch {
  try {
    mapRuntime = await import("@tti/tti-ux-diagrams/runtime/tuxArchitectureMap.mjs");
  } catch (err) {
    mapRuntimeLoadError = err;
  }
}

function requireMapRuntime() {
  if (!mapRuntime) {
    throw new Error(
      `TUX M.A.P. runtime could not be loaded (install @tti/tti-ux-diagrams or run build:runtime): ${
        mapRuntimeLoadError instanceof Error ? mapRuntimeLoadError.message : String(mapRuntimeLoadError)
      }`,
    );
  }
  return mapRuntime;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IS_MAIN = (() => {
  if (!process.argv[1]) return false;
  try {
    return (
      realpathSync(path.resolve(process.argv[1])) ===
      realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
  }
})();

export const CANONICAL_TOKEN_ALIASES = Object.freeze(
  Object.assign(Object.create(null), {
    "--surface-base": "--surface-page",
    "--bg-page": "--surface-page",
    "--bg-card": "--surface-raised",
    "--surface-card": "--surface-raised",
    "--text-default": "--text-primary",
    "--text-main": "--text-primary",
    "--danger": "--color-danger",
    "--status-info": "--color-info",
    "--status-success": "--color-success",
    "--status-warning": "--color-warning",
    "--status-error": "--color-error",
    "--border-subtle": "--surface-border-subtle",
    "--border-default": "--surface-border",
    "--font-sans": "--font-body",
  }),
);

const WASH_LADDER = [4, 6, 8, 12, 18, 22, 35, 50];

function kebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function snapWashStep(pct) {
  let best = WASH_LADDER[0];
  let bestDiff = Math.abs(pct - best);
  for (const step of WASH_LADDER) {
    const diff = Math.abs(pct - step);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = step;
    }
  }
  return best;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function suggestClosestToken(token, defsMap) {
  if (Object.hasOwn(CANONICAL_TOKEN_ALIASES, token)) return CANONICAL_TOKEN_ALIASES[token];
  let best = null;
  let bestDist = 3; // distance <= 2
  for (const cand of defsMap.keys()) {
    if (Math.abs(cand.length - token.length) > 2) continue;
    const d = levenshtein(token, cand);
    if (d < bestDist) {
      bestDist = d;
      best = cand;
    }
  }
  return best;
}

let cachedTokens = null;
function loadTokenDefinitions() {
  if (cachedTokens) return cachedTokens;
  const tokensCssPath = path.join(ROOT, "app", "assets", "css", "tokens.css");
  const globalsCssPath = path.join(ROOT, "app", "assets", "css", "globals.css");
  const map = new Map();

  for (const file of [tokensCssPath, globalsCssPath]) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    const re = /(--[a-z][a-z0-9-]*)\s*:\s*([^;\n]+);/g;
    for (const m of text.matchAll(re)) {
      if (!map.has(m[1])) {
        map.set(m[1], m[2].trim());
      }
    }
  }
  cachedTokens = map;
  return map;
}

let cachedCatalog = null;
function loadCatalogMetadata() {
  if (cachedCatalog) return cachedCatalog;
  const catalogPath = path.join(ROOT, "app", "utils", "tuxCatalog.ts");
  const entries = new Map();
  if (existsSync(catalogPath)) {
    const src = readFileSync(catalogPath, "utf8");
    const entryRe = /\{\s*name:\s*"([^"]+)"[\s\S]*?blurb:\s*"([^"]+)"\s*\}/g;
    for (const m of src.matchAll(entryRe)) {
      const block = m[0];
      const name = m[1];
      const blurb = m[2];
      const to = block.match(/to:\s*"([^"]+)"/)?.[1] || "";
      const family = block.match(/family:\s*"([^"]+)"/)?.[1] || "components";
      const category =
        block.match(/category:\s*"([^"]+)"/)?.[1] ||
        block.match(/vizCategory:\s*"([^"]+)"/)?.[1] ||
        "general";
      const wraps = block.match(/wraps:\s*"([^"]+)"/)?.[1] || "tux native";
      entries.set(name, { name, to, family, category, wraps, blurb });
    }
  }
  cachedCatalog = entries;
  return entries;
}

// Workspace package name -> its directory under packages/ (dotnet/, php/ and
// wordpress/ have no package.json). Since 3.4.1 the root's shims re-export a
// sub-layer by package name ("@tti/tti-ux-charts/app/components/TuxECharts.vue");
// the workspaces link each name to packages/<dir>, and the published layer
// ships the same packages/ copies. sync-engine's workspaceFile() reads it alike.
let cachedWorkspaceDirs = null;
function loadWorkspaceDirs() {
  if (cachedWorkspaceDirs) return cachedWorkspaceDirs;
  const map = new Map();
  const packagesDir = path.join(ROOT, "packages");
  if (existsSync(packagesDir)) {
    for (const dir of readdirSync(packagesDir)) {
      try {
        const { name } = JSON.parse(readFileSync(path.join(packagesDir, dir, "package.json"), "utf8"));
        if (name) map.set(name, dir);
      } catch {
        continue;
      }
    }
  }
  cachedWorkspaceDirs = map;
  return map;
}

function workspaceFile(specifier) {
  const m = specifier.match(/^(@[^/]+\/[^/]+)\/(.+)$/);
  const dir = m && loadWorkspaceDirs().get(m[1]);
  return dir ? path.join(ROOT, "packages", dir, m[2]) : null;
}

function resolveVueSource(compPath) {
  let currentPath = compPath;
  let code = readFileSync(currentPath, "utf8");
  const reExportMatch =
    code.match(/export\s+\{\s*default\s*\}\s+from\s+["']([^"']+\.vue)["']/) ||
    code.match(/import\s+\w+\s+from\s+["']([^"']+\.vue)["']/);
  if (reExportMatch && !code.includes("defineProps")) {
    const targetPath = reExportMatch[1].startsWith(".")
      ? path.resolve(path.dirname(currentPath), reExportMatch[1])
      : workspaceFile(reExportMatch[1]);
    if (targetPath && existsSync(targetPath)) {
      currentPath = targetPath;
      code = readFileSync(currentPath, "utf8");
    }
  }
  const relSource = path.relative(ROOT, currentPath).replace(/\\/g, "/");
  let layerPackage = "@tti/tti-ux";
  const pkgMatch = relSource.match(/^packages\/([^/]+)\//);
  if (pkgMatch) {
    layerPackage = `@tti/tti-ux-${pkgMatch[1]}`;
  }
  return { code, sourcePath: currentPath, relSource, layerPackage };
}

let cachedComponentFiles = null;
function loadComponentFileMap() {
  if (cachedComponentFiles) return cachedComponentFiles;
  const map = new Map();
  const compDir = path.join(ROOT, "app", "components");
  if (existsSync(compDir)) {
    for (const f of readdirSync(compDir)) {
      if (f.startsWith("Tux") && f.endsWith(".vue")) {
        const name = f.replace(/\.(?:client|server)\.vue$/, "").replace(/\.vue$/, "");
        map.set(name, path.join(compDir, f));
      }
    }
    const deskDir = path.join(compDir, "desk");
    if (existsSync(deskDir)) {
      for (const f of readdirSync(deskDir)) {
        if (f.startsWith("Tux") && f.endsWith(".vue")) {
          const name = f.replace(/\.(?:client|server)\.vue$/, "").replace(/\.vue$/, "");
          if (!map.has(name)) {
            map.set(name, path.join(deskDir, f));
          }
        }
      }
    }
  }
  cachedComponentFiles = map;
  return map;
}

function loadComponentList() {
  return [...loadComponentFileMap().keys()].sort();
}

const cachedComponentDetails = new Map();
function parseComponentDetails(compName) {
  if (cachedComponentDetails.has(compName)) {
    return cachedComponentDetails.get(compName);
  }
  const compPath = loadComponentFileMap().get(compName);
  if (!compPath || !existsSync(compPath)) return null;

  const { code, relSource, layerPackage } = resolveVueSource(compPath);
  const tagName = kebabCase(compName);
  const catalogMeta = loadCatalogMetadata().get(compName) || null;

  // Extract top doc comment
  let docComment = "";
  const docMatch = code.match(/<script[^>]*>[\s\n]*\/\*\*?([\s\S]*?)\*\//);
  if (docMatch) {
    docComment = docMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter(Boolean)
      .join(" ");
  }

  // Extract defaults from withDefaults(defineProps<...>(), { ... })
  const defaultsMap = new Map();
  const defaultsMatch = code.match(/withDefaults\s*\(\s*defineProps<[\s\S]*?>\(\)\s*,\s*\{([\s\S]*?)\}\s*\)/);
  if (defaultsMatch) {
    const body = defaultsMatch[1];
    for (const line of body.split("\n")) {
      const m = line.trim().match(/^([a-zA-Z0-9_$]+)\s*:\s*(.+?)\s*,?$/);
      if (m && m[2] !== "undefined") {
        defaultsMap.set(m[1], m[2]);
      }
    }
  }

  // Extract Props from interface Props { ... } or defineProps<{ ... }>()
  const props = [];
  const interfaceMatch = code.match(/interface\s+\w*Props\s*\{([\s\S]*?)\n\}/);
  const inlinePropsMatch = code.match(/defineProps<\{([\s\S]*?)\}>\(\)/);
  const propsBlock = interfaceMatch
    ? interfaceMatch[1]
    : inlinePropsMatch
      ? inlinePropsMatch[1]
      : "";

  if (propsBlock) {
    const propLines = propsBlock
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
    for (const rawLine of propLines) {
      const propDocMatch = rawLine.match(/\/\*\*?([\s\S]*?)\*\//);
      const propDescription = propDocMatch
        ? propDocMatch[1].replace(/\s*\*\s?/g, " ").trim()
        : undefined;
      const cleanLine = rawLine
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
        .trim();
      const match = cleanLine.match(/^(?:readonly\s+)?([a-zA-Z0-9_$]+)(\??)\s*:\s*([\s\S]+)$/);
      if (match) {
        const [, pName, optional, pType] = match;
        const trimmedName = pName.trim();
        props.push({
          name: trimmedName,
          type: pType.trim().replace(/\s+/g, " "),
          required: optional !== "?",
          default: defaultsMap.get(trimmedName) ?? undefined,
          description: propDescription,
        });
      }
    }
  }

  // Extract Slots
  const slots = [];
  const seenSlots = new Set();
  for (const m of code.matchAll(/<slot\s*(?:name=["']([^"']+)["'])?/g)) {
    const slotName = m[1] || "default";
    if (!seenSlots.has(slotName)) {
      seenSlots.add(slotName);
      slots.push(slotName);
    }
  }

  // Extract Events (supports call signatures, union event literals, and Vue 3.3+ tuple syntax)
  const events = [];
  const seenEvents = new Set();
  for (const m of code.matchAll(/defineEmits<\{([\s\S]*?)\}>\(\)/g)) {
    const block = m[1];
    // 1. Call signature style: (e: "foo" | "bar", ...) => void
    for (const callMatch of block.matchAll(/\(e:\s*([^,)]+)/g)) {
      for (const lit of callMatch[1].matchAll(/["']([^"']+)["']/g)) {
        const ev = lit[1];
        if (ev && !seenEvents.has(ev)) {
          seenEvents.add(ev);
          events.push(ev);
        }
      }
    }
    // 2. Vue 3.3+ shorthand tuple style: "update:modelValue": [...] or dismiss: []
    for (const propMatch of block.matchAll(/(?:^|[;\n])\s*(?:["']([^"']+)["']|([a-zA-Z_$][a-zA-Z0-9_$:-]*))\s*:\s*\[/g)) {
      const ev = propMatch[1] || propMatch[2];
      if (ev && !seenEvents.has(ev)) {
        seenEvents.add(ev);
        events.push(ev);
      }
    }
  }

  // Build framework usage snippets
  const sampleProps = props
    .slice(0, 2)
    .map((p) => {
      const cleaned = p.default ? String(p.default).replace(/['"]/g, "") : "";
      const val = cleaned && cleaned !== "undefined" && cleaned !== "null" ? cleaned : "...";
      return `${p.name}="${val}"`;
    })
    .join(" ");
  const propSuffix = sampleProps ? ` ${sampleProps}` : "";

  const details = {
    name: compName,
    tagName,
    file: relSource,
    layerPackage,
    docsRoute: catalogMeta?.to || `/components/${tagName.replace(/^tux-/, "")}`,
    family: catalogMeta?.family || (compName.startsWith("TuxDesk") ? "publishing" : "components"),
    category: catalogMeta?.category || (compName.startsWith("TuxDesk") ? "publishing" : "general"),
    wraps: catalogMeta?.wraps || "tux native",
    description: catalogMeta?.blurb || docComment || `${compName} TUX component`,
    props,
    slots,
    events,
    examples: {
      vue: slots.includes("default")
        ? `<${compName}${propSuffix}>\n  Content\n</${compName}>`
        : `<${compName}${propSuffix} />`,
      react: `import { ${compName} } from "@tti/tti-ux-react";\n\n<${compName}${propSuffix} />`,
      webComponent: `<${tagName}${propSuffix}></${tagName}>`,
    },
  };
  cachedComponentDetails.set(compName, details);
  return details;
}

// ── WCAG 2.2 Contrast & Hue-Preserving AAA Snapper ──────────────────────────
function parseHexRgb(hex) {
  const clean = String(hex || "#000000").trim().replace(/^#/, "");
  if (clean.length === 3) {
    return [
      Number.parseInt(clean[0] + clean[0], 16) || 0,
      Number.parseInt(clean[1] + clean[1], 16) || 0,
      Number.parseInt(clean[2] + clean[2], 16) || 0,
    ];
  }
  return [
    Number.parseInt(clean.slice(0, 2), 16) || 0,
    Number.parseInt(clean.slice(2, 4), 16) || 0,
    Number.parseInt(clean.slice(4, 6), 16) || 0,
  ];
}

function relativeLuminance(hex) {
  const [r8, g8, b8] = parseHexRgb(hex);
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r8) + 0.7152 * toLinear(g8) + 0.0722 * toLinear(b8);
}

function computeContrast(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  const sn = Math.max(0, Math.min(100, s)) / 100;
  const ln = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h >= 60 && h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h >= 120 && h < 180) [r1, g1, b1] = [0, c, x];
  else if (h >= 180 && h < 240) [r1, g1, b1] = [0, x, c];
  else if (h >= 240 && h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const toHex = (n) =>
    Math.round(Math.max(0, Math.min(255, (n + m) * 255)))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

function snapHexToTargetContrast(fgHex, bgHex, targetRatio = 7.0) {
  if (computeContrast(fgHex, bgHex) >= targetRatio) return fgHex.toUpperCase();
  const [r, g, b] = parseHexRgb(fgHex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const darken = relativeLuminance(bgHex) > 0.5;
  let low = darken ? 0 : l;
  let high = darken ? l : 100;
  let bestHex = darken ? "#000000" : "#FFFFFF";
  for (let i = 0; i < 28; i++) {
    const mid = (low + high) / 2;
    const cand = hslToHex(h, s, mid);
    if (computeContrast(cand, bgHex) >= targetRatio) {
      bestHex = cand;
      if (darken) low = mid;
      else high = mid;
    } else {
      if (darken) high = mid;
      else low = mid;
    }
  }
  return bestHex;
}

// ── Architecture Map (M.A.P.) Explicit Model Loader (#112) ──────────────────
function parseCliOption(argv, flag) {
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === flag) {
      const val = argv[i + 1];
      if (!val || val.startsWith("--")) {
        throw new Error(`Missing file path after ${flag}.`);
      }
      return val;
    }
    if (arg.startsWith(`${flag}=`)) {
      const val = arg.slice(flag.length + 1).trim();
      if (!val) {
        throw new Error(`Empty file path in ${flag}=...`);
      }
      return val;
    }
  }
  return null;
}

const MAX_MODEL_BYTES = 64 * 1024 * 1024;
export const MAX_STDIO_BUFFER_BYTES = 16 * 1024 * 1024;
const MAX_STDIO_HEADER_BYTES = 8 * 1024;
const normalizedModelCache = new WeakMap();
const normalizedBaseModelCache = new WeakMap();

function normalizeModelObject(raw, { allowEmpty = false } = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Architecture model must be a JSON object.");
  }
  const cache = allowEmpty ? normalizedBaseModelCache : normalizedModelCache;
  if (cache.has(raw)) return cache.get(raw);
  const { normalizeArchitectureModelInput } = requireMapRuntime();
  const normalized = normalizeArchitectureModelInput(raw, { allowEmpty });
  cache.set(raw, normalized);
  return normalized;
}

export function loadArchitectureModelFile(modelPath, { allowEmpty = false } = {}) {
  const resolved = path.resolve(modelPath);
  if (!existsSync(resolved)) {
    throw new Error(`Architecture model file not found: ${resolved}`);
  }
  const st = statSync(resolved);
  if (!st.isFile()) {
    throw new Error(`Architecture model path is not a regular file: ${resolved}`);
  }
  if (st.size > MAX_MODEL_BYTES) {
    throw new Error(
      `Architecture model '${resolved}' exceeds 64 MiB limit (${st.size} bytes).`,
    );
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(resolved, "utf8"));
  } catch (err) {
    throw new Error(
      `Invalid JSON in architecture model '${resolved}': ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Architecture model '${resolved}' must be a JSON object.`);
  }
  return normalizeModelObject(parsed, { allowEmpty });
}

const cliContext = {
  model: null,
  baseModel: null,
};

if (IS_MAIN) {
  try {
    const cliModelPath =
      parseCliOption(process.argv, "--model") || (process.env.TUX_MCP_MODEL || "").trim() || null;
    if (cliModelPath) cliContext.model = loadArchitectureModelFile(cliModelPath, { allowEmpty: false });
    const cliBasePath =
      parseCliOption(process.argv, "--base-model") || (process.env.TUX_MCP_BASE_MODEL || "").trim() || null;
    if (cliBasePath) cliContext.baseModel = loadArchitectureModelFile(cliBasePath, { allowEmpty: true });
  } catch (err) {
    console.error(`tux-mcp: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

function resolveModel(opts) {
  const raw = opts?.model ?? cliContext.model ?? null;
  return raw ? normalizeModelObject(raw, { allowEmpty: false }) : null;
}

function resolveBaseModel(opts) {
  const raw = opts?.baseModel ?? cliContext.baseModel ?? null;
  return raw ? normalizeModelObject(raw, { allowEmpty: true }) : null;
}

function parseOptInt(val, paramName) {
  if (val === undefined || val === null || val === "") return undefined;
  if (typeof val === "boolean") {
    throw new Error(`Invalid numeric parameter '${paramName}': expected a finite number.`);
  }
  const str = typeof val === "string" ? val.trim() : null;
  if (str === "") return undefined;
  const num = typeof val === "number" ? val : Number(str);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid numeric parameter '${paramName}': expected a finite number.`);
  }
  return Math.trunc(num);
}

function parseOptBool(val, paramName) {
  if (val === undefined || val === null || val === "") return undefined;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const norm = val.trim().toLowerCase();
    if (norm === "") return undefined;
    if (norm === "true") return true;
    if (norm === "false") return false;
  }
  throw new Error(`Invalid boolean parameter '${paramName}': expected true or false.`);
}

// ── MCP Tools, Resources, and Prompts Definitions ───────────────────────────
export const TUX_MCP_DESIGN_TOOLS = [
  {
    name: "tux_list_components",
    description:
      "List all canonical TUX (Texas A&M Transportation Institute Design System) components with category, family, description, and docs route.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          description: "Optional substring filter on component name, category, or blurb.",
        },
        category: {
          type: "string",
          description:
            "Optional category filter (actions, navigation, data-display, feedback, forms, ai, publishing, timeseries, geospatial, statistical, embeds).",
        },
      },
    },
  },
  {
    name: "tux_get_component",
    description:
      "Inspect a specific Tux* component's structured TypeScript props, default values, slots, emitted events, and Vue/React/Web-Component usage snippets.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Component name, e.g. 'TuxButton', 'TuxCard', 'TuxUnitValue', 'TuxChartFrame'.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "tux_search_tokens",
    description:
      "Search canonical TUX CSS custom properties (--brand-*, --surface-*, --text-*, --wash-*, --color-*) and resolve legacy or typo aliases.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Token substring or legacy alias (e.g. 'surface', '--surface-base', 'brand').",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "tux_validate_contrast",
    description:
      "Validate WCAG 2.2 AA (4.5:1) and AAA (7.0:1) contrast ratio between two hex colors and compute a hue-preserving AAA-safe hex recommendation.",
    inputSchema: {
      type: "object",
      properties: {
        foreground: { type: "string", description: "Foreground hex color (e.g. '#500000' or '#CFA935')." },
        background: { type: "string", description: "Background hex color (e.g. '#FFFFFF' or '#09090B')." },
      },
      required: ["foreground", "background"],
    },
  },
  {
    name: "tux_audit_snippet",
    description:
      "Audit a Vue/CSS snippet against TUX's 4 strict CI guardrails (undefined/legacy tokens, off-ladder color-mix washes, deprecated --font-sans / dead font fallbacks, and WCAG 2.5.3 button aria-label mismatch) and return auto-fixed code.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Vue or CSS snippet to audit and auto-fix." },
      },
      required: ["code"],
    },
  },
];

export const TUX_MCP_ARCHITECTURE_TOOLS = [
  {
    name: "tux_query_architecture_nodes",
    description:
      "Query nodes (and optional matching edges) at a semantic level, parent subgraph, kind, or text filter from the loaded TUX Architecture Map (M.A.P.) model, with compact output and paging.",
    inputSchema: {
      type: "object",
      properties: {
        level: {
          type: "number",
          description: "Optional semantic level number (1 = Context, 2 = Containers, 3 = Components, 4 = Deployment, 5+ = Code/Subgraphs).",
        },
        focusId: {
          type: "string",
          description: "Optional parent container, resource, folder, or file ID to inspect.",
        },
        kind: {
          oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
          description: "Optional node kind or list of kinds to filter on.",
        },
        query: {
          type: "string",
          description: "Optional case-insensitive substring filter on id, name, tech, desc, or source path.",
        },
        includePlanned: {
          type: "boolean",
          description: "Whether to include planned nodes and edges (default true).",
        },
        includeEdges: {
          type: "boolean",
          description: "Whether to include matching edges (defaults to false in compact mode).",
        },
        compact: {
          type: "boolean",
          description: "Return compact node summaries (default true).",
        },
        limit: {
          type: "number",
          description: "Maximum number of nodes to return.",
        },
        offset: {
          type: "number",
          description: "Zero-based pagination offset (default 0).",
        },
      },
    },
  },
  {
    name: "tux_query_architecture_impact",
    description:
      "Compute the deterministic upstream dependency blast radius and triage buckets (blockers, testsToRun, coCutCandidates, stampsToRebuild, buildExecImpacted, hostsImpacted) for one or more seed IDs using the canonical M.A.P. contract.",
    inputSchema: {
      type: "object",
      properties: {
        seedIds: {
          oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
          description: "One or more seed architecture node IDs (e.g. 'f:src/auth.ts' or ['c-api']).",
        },
        seed: {
          oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
          description: "Alias for `seedIds`.",
        },
        nodeId: {
          type: "string",
          description: "Single seed node ID alias when `seedIds` is omitted.",
        },
        maxHops: {
          type: "number",
          description: "Maximum upstream spreading hops (default 32).",
        },
        intent: {
          type: "string",
          enum: ["default", "patch", "refactor", "cut", "supply-chain"],
          description: "Change intent controlling propagation and triage buckets (default 'default').",
        },
        kinds: {
          type: "array",
          items: { type: "string" },
          description: "Optional allowlist of link kinds to traverse.",
        },
        quietSeedOnly: {
          type: "boolean",
          description: "Follow prose `mentions` only at hop 1 directly from seeds (default true).",
        },
        includePlanned: {
          type: "boolean",
          description: "Include planned relationships (default false).",
        },
        includeDownstream: {
          type: "boolean",
          description: "Opt in to directed downstream dependencies (default false).",
        },
        bridgeUncovered: {
          type: "boolean",
          description: "Bridge uncovered coarse C4 relationships via extractModelLinks (default false).",
        },
        allowCoarseParentStep: {
          type: "boolean",
          description: "Allow hop-1 parent containment fallback when leaf code links are absent (default false).",
        },
        compact: {
          type: "boolean",
          description: "Omit full node objects on each hit to bound response size (default true).",
        },
        includeNodes: {
          type: "boolean",
          description: "Attach full node metadata onto hits and seeds (default false when compact is true).",
        },
        maxSummaryItems: {
          type: "number",
          description: "Maximum items per summary array (seeds, blockers, testsToRun, impactedSourceFiles) in compact mode.",
        },
        limit: {
          type: "number",
          description: "Maximum number of hits to return.",
        },
        offset: {
          type: "number",
          description: "Zero-based pagination offset into hits (default 0).",
        },
      },
    },
  },
  {
    name: "tux_find_architecture_path",
    description:
      "Find the shortest directed architectural dependency path between two node IDs across Levels 1..N (descending, labelled, into own code when needed).",
    inputSchema: {
      type: "object",
      properties: {
        fromNodeId: { type: "string", description: "Starting node ID." },
        toNodeId: { type: "string", description: "Destination node ID." },
        from: { type: "string", description: "Alias for `fromNodeId`." },
        to: { type: "string", description: "Alias for `toNodeId`." },
        direction: {
          type: "string",
          enum: ["downstream", "upstream"],
          description: "'downstream' (default, from -> to) or 'upstream' (reverse dependencies).",
        },
        includePlanned: { type: "boolean", description: "Include planned edges (default false)." },
        compact: { type: "boolean", description: "Omit full node objects from path output (default false)." },
      },
      required: ["fromNodeId", "toNodeId"],
    },
  },
  {
    name: "tux_compute_graph_delta",
    description:
      "Compute structural graph delta (added, deleted, moved, sig-changed, body-patched, danglingWires, blastSeedIds, recommendedIntent) between a base model and the loaded head model.",
    inputSchema: {
      type: "object",
      properties: {
        baseModel: {
          type: "object",
          description: "Base TuxMapLevelModel JSON object (optional when --base-model <path> was supplied at startup).",
        },
        includeMergedModel: {
          type: "boolean",
          description: "Include annotated mergedModel in response (default false).",
        },
        maxItems: {
          type: "number",
          description: "Maximum items per delta array before summarizing counts (default 40).",
        },
      },
    },
  },
];

const TUX_MCP_BASE_RESOURCES = [
  {
    uri: "tux://catalog/components",
    name: "TUX Component Catalog",
    description: "Complete catalog of TUX components, categories, layer packages, and routes.",
    mimeType: "application/json",
  },
  {
    uri: "tux://tokens/all",
    name: "TUX Canonical CSS Custom Properties",
    description: "All defined CSS custom properties from app/assets/css/tokens.css and migration aliases.",
    mimeType: "application/json",
  },
  {
    uri: "tux://architecture/layers-and-api",
    name: "TUX Modular Nuxt Layers & Desk API Routes",
    description:
      "Authoritative reference of TUX modular Nuxt layers (@tti/tti-ux, -charts, -diagrams, -code, -desk, -content, -react) and exact HTTP API route schemas.",
    mimeType: "application/json",
  },
  {
    uri: "tux://vision/roadmap",
    name: "TUX World-Class Vision & Engineering Roadmap",
    description: "Strategic 4-pillar roadmap for the Texas A&M Transportation Institute Design System.",
    mimeType: "text/markdown",
  },
];

const TUX_MCP_C4_GRAPH_RESOURCE = {
  uri: "tux://architecture/c4-graph",
  name: "TUX Architecture Map (M.A.P.) Unified Code Property Graph",
  description:
    "Unified multi-level C4 + Code Property Graph built from the explicitly loaded --model.",
  mimeType: "application/json",
};

export function getTuxMcpTools(opts = {}) {
  return resolveModel(opts)
    ? [...TUX_MCP_DESIGN_TOOLS, ...TUX_MCP_ARCHITECTURE_TOOLS]
    : [...TUX_MCP_DESIGN_TOOLS];
}

export function getTuxMcpResources(opts = {}) {
  return resolveModel(opts)
    ? [...TUX_MCP_BASE_RESOURCES, TUX_MCP_C4_GRAPH_RESOURCE]
    : [...TUX_MCP_BASE_RESOURCES];
}

export const TUX_MCP_TOOLS = getTuxMcpTools();
export const TUX_MCP_RESOURCES = getTuxMcpResources();

export const TUX_MCP_PROMPTS = [
  {
    name: "tux-build-tti-view",
    description:
      "Generate a WCAG 2.2 AAA compliant TTI research or telemetry view using canonical TUX components, 5-band division spectrum accents, and TuxUnitValue.",
    arguments: [
      {
        name: "topic",
        description: "The transportation research or operations topic (e.g. 'I-35 Freight Corridor Telemetry').",
        required: true,
      },
      {
        name: "division",
        description: "Optional TTI research spectrum division (maroon, blue, teal, green, gold).",
        required: false,
      },
    ],
  },
];

function auditColorMixWashes(src, issues) {
  let out = "";
  let cursor = 0;
  const needle = "color-mix(";
  while (cursor < src.length) {
    const idx = src.indexOf(needle, cursor);
    if (idx === -1) {
      out += src.slice(cursor);
      break;
    }
    out += src.slice(cursor, idx);
    const maxEnd = Math.min(src.length, idx + 320);
    let depth = 1;
    let j = idx + needle.length;
    const commas = [];
    while (j < maxEnd && depth > 0) {
      const ch = src[j];
      if (ch === "(") depth += 1;
      else if (ch === ")") {
        depth -= 1;
        if (depth === 0) break;
      } else if (ch === "," && depth === 1) {
        commas.push(j);
      }
      j += 1;
    }
    if (depth !== 0) {
      out += needle;
      cursor = idx + needle.length;
      continue;
    }
    const full = src.slice(idx, j + 1);
    if (commas.length === 2) {
      const p0 = src
        .slice(idx + needle.length, commas[0])
        .trim()
        .replace(/\s+/g, " ");
      const p1 = src.slice(commas[0] + 1, commas[1]).trim();
      const p2 = src.slice(commas[1] + 1, j).trim();
      if (p0 === "in srgb" && p2 === "transparent" && p1.endsWith("%")) {
        const pctMatch = /(\d+(?:\.\d+)?)%$/.exec(p1);
        if (pctMatch && pctMatch.index > 0) {
          const colorExpr = p1.slice(0, pctMatch.index).trim();
          const pct = Number(pctMatch[1]);
          if (colorExpr && pct < 60 && !WASH_LADDER.includes(pct)) {
            const snapped = snapWashStep(pct);
            issues.push({
              type: "off-ladder-wash",
              originalPercent: pct,
              snappedPercent: snapped,
              message: `Snapped color-mix wash ${pct}% to canonical ladder step ${snapped}%`,
            });
            out += `color-mix(in srgb, ${colorExpr} ${snapped}%, transparent)`;
            cursor = j + 1;
            continue;
          }
        }
      }
    }
    out += full;
    cursor = j + 1;
  }
  return out;
}

function findTagCloseQuoteAware(src, startIdx) {
  let quote = "";
  for (let i = startIdx; i < src.length; i += 1) {
    const ch = src[i];
    if (quote) {
      if (ch === quote) quote = "";
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return i;
    }
  }
  return -1;
}

function auditButtonLabels(src, issues) {
  const lower = src.toLowerCase();
  let cursor = 0;
  let lastClose = -1;
  while (cursor < src.length) {
    const openIdx = lower.indexOf("<button", cursor);
    if (openIdx === -1) break;
    const afterName = src[openIdx + 7];
    if (afterName && !/[\s>/]/.test(afterName)) {
      cursor = openIdx + 7;
      continue;
    }
    const tagEnd = findTagCloseQuoteAware(src, openIdx + 7);
    if (tagEnd === -1) break;
    if (src[tagEnd - 1] === "/") {
      cursor = tagEnd + 1;
      continue;
    }
    if (lastClose <= tagEnd) {
      lastClose = lower.indexOf("</button>", tagEnd + 1);
      if (lastClose === -1) break;
    }
    const nextOpen = lower.indexOf("<button", tagEnd + 1);
    if (nextOpen !== -1 && nextOpen < lastClose) {
      cursor = nextOpen;
      continue;
    }
    const attrs = src.slice(openIdx + 7, tagEnd);
    const labelMatch = /(?:^|\s)aria-label\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(attrs);
    if (labelMatch) {
      const ariaLabel = (labelMatch[1] ?? labelMatch[2] ?? "").trim();
      const rawInner = src.slice(tagEnd + 1, lastClose);
      const innerText = rawInner.replace(/<[^>]+>/g, "").replace(/\{\{[\s\S]*?\}\}/g, "").trim();
      if (
        ariaLabel &&
        innerText &&
        innerText.length > 1 &&
        !ariaLabel.toLowerCase().includes(innerText.toLowerCase())
      ) {
        issues.push({
          type: "wcag-2.5.3-label-content-mismatch",
          ariaLabel,
          visibleText: innerText,
          message: `WCAG 2.5.3 violation: button aria-label "${ariaLabel}" must contain its visible text "${innerText}".`,
        });
      }
    }
    cursor = lastClose + 9;
  }
}

const ARCHITECTURE_TOOL_NAMES = new Set([
  "tux_query_architecture_nodes",
  "tux_query_architecture_layer",
  "tux_query_architecture_impact",
  "tux_get_blast_radius",
  "tux_find_architecture_path",
  "tux_find_shortest_path",
  "tux_compute_graph_delta",
]);

function fitsMcpWireBudget(payload, maxWireBytes = 15_800) {
  const serialized = JSON.stringify(payload);
  return Buffer.byteLength(JSON.stringify(serialized), "utf8") + 96 <= maxWireBytes;
}

export function callTuxMcpTool(name, args = {}, opts = {}) {
  switch (name) {
    case "tux_list_components": {
      const filter = String(args.filter || "").toLowerCase();
      const catFilter = String(args.category || "").toLowerCase();
      const catalogMeta = loadCatalogMetadata();
      const fileMap = loadComponentFileMap();
      const all = loadComponentList()
        .map((compName) => {
          const meta = catalogMeta.get(compName);
          const compPath = fileMap.get(compName);
          const { layerPackage } = compPath ? resolveVueSource(compPath) : { layerPackage: "@tti/tti-ux" };
          const defaultCategory = compName.startsWith("TuxDesk") ? "publishing" : "internal";
          return {
            name: compName,
            layerPackage,
            family: meta?.family || (compName.startsWith("TuxDesk") ? "publishing" : "components"),
            category: meta?.category || defaultCategory,
            to: meta?.to || `/components/${kebabCase(compName).replace(/^tux-/, "")}`,
            blurb: meta?.blurb || "",
          };
        })
        .filter((item) => {
          if (catFilter && item.category.toLowerCase() !== catFilter) return false;
          if (!filter) return true;
          return (
            item.name.toLowerCase().includes(filter) ||
            item.category.toLowerCase().includes(filter) ||
            item.layerPackage.toLowerCase().includes(filter) ||
            item.blurb.toLowerCase().includes(filter)
          );
        });

      return {
        count: all.length,
        components: all.map((c) => c.name),
        entries: all,
      };
    }

    case "tux_get_component": {
      const rawName = String(args.name || "").replace(/\.vue$/, "");
      const normalized = rawName.startsWith("Tux")
        ? rawName
        : `Tux${rawName.charAt(0).toUpperCase()}${rawName.slice(1)}`;
      const details = parseComponentDetails(normalized) || parseComponentDetails(rawName);
      if (!details) {
        return {
          error: `Component '${rawName}' not found in app/components/.`,
          available: loadComponentList(),
        };
      }
      return details;
    }

    case "tux_search_tokens": {
      const q = String(args.query || "").trim().toLowerCase();
      const defs = loadTokenDefinitions();
      const canonicalMigration = suggestClosestToken(q, defs);
      const matches = [];
      for (const [token, value] of defs.entries()) {
        if (token.toLowerCase().includes(q) || value.toLowerCase().includes(q)) {
          matches.push({ token, value });
        }
      }
      return {
        query: q,
        canonicalReplacementForAlias: canonicalMigration,
        matchCount: matches.length,
        matches: matches.slice(0, 50),
      };
    }

    case "tux_validate_contrast": {
      const fg = String(args.foreground || "#500000");
      const bg = String(args.background || "#FFFFFF");
      const ratio = computeContrast(fg, bg);
      const passesAAA = ratio >= 7.0;
      const passesAA = ratio >= 4.5;
      const recommendedAAAHex = passesAAA ? fg.toUpperCase() : snapHexToTargetContrast(fg, bg, 7.0);
      const recommendedAAHex = passesAA ? fg.toUpperCase() : snapHexToTargetContrast(fg, bg, 4.5);
      return {
        foreground: fg,
        background: bg,
        ratio,
        passesAA,
        passesAAA,
        wcagLevel: passesAAA ? "AAA" : passesAA ? "AA" : "Fail",
        recommendedAAAHex,
        recommendedAAHex,
      };
    }

    case "tux_audit_snippet": {
      const defs = loadTokenDefinitions();
      let fixed = String(args.code || "");
      const issues = [];

      // 1. Check dead font fallback chains: var(--font-display, var(--font-body))
      const deadFontFallbackRe = /var\(\s*(--font-[a-z0-9-]+)\s*,\s*var\(\s*--font-[a-z0-9-]+\s*\)\s*\)/g;
      fixed = fixed.replace(deadFontFallbackRe, (_full, primaryFontToken) => {
        const canonicalFont =
          primaryFontToken === "--font-sans" ? "--font-body" : primaryFontToken;
        issues.push({
          type: "dead-font-fallback-chain",
          message: `Simplified dead font fallback chain to var(${canonicalFont})`,
        });
        return `var(${canonicalFont})`;
      });

      // 2. Check var(--token) references (legacy aliases + Levenshtein typos, single linear pass)
      const varRe = /var\(\s*(--[a-z][a-z0-9-]*)\s*\)/g;
      const seenVarIssues = new Set();
      fixed = fixed.replace(varRe, (full, token) => {
        if (Object.hasOwn(CANONICAL_TOKEN_ALIASES, token)) {
          const replacement = CANONICAL_TOKEN_ALIASES[token];
          if (!seenVarIssues.has(token)) {
            seenVarIssues.add(token);
            issues.push({
              type: "legacy-token-alias",
              token,
              replacement,
              message: `Replaced ${token} with canonical ${replacement}`,
            });
          }
          return `var(${replacement})`;
        }
        if (!defs.has(token) && !token.startsWith("--ui-")) {
          const suggested = suggestClosestToken(token, defs);
          if (!seenVarIssues.has(token)) {
            seenVarIssues.add(token);
            issues.push({
              type: "undefined-token",
              token,
              suggested,
              message: suggested
                ? `Token ${token} is undefined; auto-replaced with closest match ${suggested}`
                : `Token ${token} is not defined in TUX tokens.css`,
            });
          }
          if (suggested && defs.has(suggested)) {
            return `var(${suggested})`;
          }
        }
        return full;
      });

      // 3. Check color-mix wash ladder steps (< 60% against transparent) in strictly O(N) time
      fixed = auditColorMixWashes(fixed, issues);

      // 4. Check WCAG 2.5.3 label-content-name-mismatch on <button aria-label="..."> in strictly O(N) time
      auditButtonLabels(fixed, issues);

      return {
        valid: issues.length === 0,
        issueCount: issues.length,
        issues,
        autoFixedCode: fixed,
      };
    }

    case "tux_query_architecture_nodes":
    case "tux_query_architecture_layer": {
      const model = resolveModel(opts);
      if (!model) {
        throw new Error(
          `Architecture tool '${name}' requires an explicit architecture model; start tux-mcp with --model <path> (or set TUX_MCP_MODEL).`,
        );
      }
      const { queryArchitectureNodes } = requireMapRuntime();
      const compact = parseOptBool(args.compact, "compact") ?? (name === "tux_query_architecture_nodes");
      const explicitLimit = parseOptInt(args.limit, "limit");
      const res = queryArchitectureNodes(model, {
        level: parseOptInt(args.level, "level"),
        focusId: args.focusId != null && String(args.focusId).trim() !== "" ? String(args.focusId).trim() : undefined,
        kind: args.kind,
        query: args.query != null ? String(args.query) : undefined,
        includePlanned: parseOptBool(args.includePlanned, "includePlanned"),
        includeEdges: parseOptBool(args.includeEdges, "includeEdges"),
        compact,
        limit: explicitLimit ?? (compact ? 30 : undefined),
        offset: parseOptInt(args.offset, "offset"),
      });
      if (compact && explicitLimit === undefined) {
        while (res.nodes.length > 1 && !fitsMcpWireBudget(res)) {
          res.nodes = res.nodes.slice(0, Math.max(1, Math.floor(res.nodes.length * 0.75)));
          if (res.edges.length > 0) {
            const keepIds = new Set(res.nodes.map((n) => n.id));
            res.edges = res.edges.filter((e) => keepIds.has(e.from) || keepIds.has(e.to));
            res.edgeCount = res.edges.length;
          }
          res.nodeCount = res.nodes.length;
          res.hasMore = res.offset + res.nodeCount < res.totalNodeCount;
        }
      }
      return res;
    }

    case "tux_query_architecture_impact":
    case "tux_get_blast_radius": {
      const model = resolveModel(opts);
      if (!model) {
        throw new Error(
          `Architecture tool '${name}' requires an explicit architecture model; start tux-mcp with --model <path> (or set TUX_MCP_MODEL).`,
        );
      }
      const { queryArchitectureImpact } = requireMapRuntime();
      const rawSeeds = args.seedIds ?? args.seed ?? args.nodeId ?? [];
      const seeds = Array.isArray(rawSeeds)
        ? rawSeeds.map((s) => String(s).trim()).filter(Boolean)
        : String(rawSeeds).trim()
          ? [String(rawSeeds).trim()]
          : [];
      const compact = parseOptBool(args.compact, "compact") ?? true;
      const includeNodes = parseOptBool(args.includeNodes, "includeNodes");
      const explicitLimit = parseOptInt(args.limit, "limit");
      const explicitSummaryCap = parseOptInt(args.maxSummaryItems, "maxSummaryItems");
      const res = queryArchitectureImpact(seeds, model, {
        maxHops: parseOptInt(args.maxHops, "maxHops"),
        intent: args.intent != null && String(args.intent).trim() !== "" ? String(args.intent).trim() : undefined,
        kinds: Array.isArray(args.kinds) ? args.kinds.map(String) : undefined,
        quietSeedOnly: parseOptBool(args.quietSeedOnly, "quietSeedOnly"),
        includePlanned: parseOptBool(args.includePlanned, "includePlanned"),
        includeDownstream: parseOptBool(args.includeDownstream, "includeDownstream"),
        bridgeUncovered: parseOptBool(args.bridgeUncovered, "bridgeUncovered"),
        allowCoarseParentStep: parseOptBool(args.allowCoarseParentStep, "allowCoarseParentStep"),
        compact,
        includeNodes,
        omitRedundantDescendants: compact && !includeNodes,
        maxSummaryItems: explicitSummaryCap ?? (compact && !includeNodes ? 25 : undefined),
        limit: explicitLimit ?? (compact && !includeNodes ? 100 : undefined),
        offset: parseOptInt(args.offset, "offset"),
      });
      if (compact && !includeNodes && explicitLimit === undefined && res && !res.error && Array.isArray(res.hits)) {
        while (
          (res.hits.length > 1 || (Array.isArray(res.impactedSourceFiles) && res.impactedSourceFiles.length > 5)) &&
          !fitsMcpWireBudget(res)
        ) {
          if (res.hits.length > 1) {
            res.hits = res.hits.slice(0, Math.max(1, Math.floor(res.hits.length * 0.75)));
            res.hitCount = res.hits.length;
            res.hasMore = res.offset + res.hitCount < res.totalHitCount;
          } else if (Array.isArray(res.impactedSourceFiles) && res.impactedSourceFiles.length > 5) {
            res.impactedSourceFiles = res.impactedSourceFiles.slice(0, Math.max(5, Math.floor(res.impactedSourceFiles.length * 0.6)));
          } else {
            break;
          }
        }
      }
      return res;
    }

    case "tux_find_architecture_path":
    case "tux_find_shortest_path": {
      const model = resolveModel(opts);
      if (!model) {
        throw new Error(
          `Architecture tool '${name}' requires an explicit architecture model; start tux-mcp with --model <path> (or set TUX_MCP_MODEL).`,
        );
      }
      const { findArchitecturePath } = requireMapRuntime();
      const fromNodeId = String(args.fromNodeId ?? args.from ?? "").trim();
      const toNodeId = String(args.toNodeId ?? args.to ?? "").trim();
      if (args.direction != null && args.direction !== "downstream" && args.direction !== "upstream") {
        throw new Error(`Invalid parameter 'direction': expected 'downstream' or 'upstream'.`);
      }
      return findArchitecturePath(fromNodeId, toNodeId, model, {
        direction: args.direction === "upstream" ? "upstream" : "downstream",
        includePlanned: parseOptBool(args.includePlanned, "includePlanned"),
        compact: parseOptBool(args.compact, "compact") ?? true,
      });
    }

    case "tux_compute_graph_delta": {
      const model = resolveModel(opts);
      if (!model) {
        throw new Error(
          "Architecture tool 'tux_compute_graph_delta' requires an explicit architecture model; start tux-mcp with --model <path> (or set TUX_MCP_MODEL).",
        );
      }
      const { computeGraphDelta } = requireMapRuntime();
      const argBase =
        args.baseModel && typeof args.baseModel === "object" && !Array.isArray(args.baseModel)
          ? normalizeModelObject(args.baseModel, { allowEmpty: true })
          : null;
      const baseModel = argBase ?? resolveBaseModel(opts);
      if (!baseModel) {
        return {
          error:
            "Base architecture model required: start tux-mcp with --base-model <path> (or TUX_MCP_BASE_MODEL) or pass a baseModel JSON object.",
        };
      }
      const includeMergedModel = parseOptBool(args.includeMergedModel, "includeMergedModel") ?? false;
      const explicitMaxItems = parseOptInt(args.maxItems, "maxItems");
      const maxItems = explicitMaxItems ?? (includeMergedModel ? undefined : 30);
      const delta = computeGraphDelta(baseModel, model, {
        includeMergedModel,
      });
      if (!includeMergedModel) {
        const { mergedModel: _omitted, ...compactDelta } = delta;
        if (maxItems !== undefined && maxItems >= 0) {
          let cap = Math.max(1, maxItems);
          const totalAddedCount = compactDelta.addedIds.length;
          const totalDeletedCount = compactDelta.deletedIds.length;
          const totalMovedCount = compactDelta.movedIds.length;
          const totalSigChangedCount = compactDelta.sigChangedIds.length;
          const totalBodyPatchedCount = compactDelta.bodyPatchedIds.length;
          const totalBlastSeedCount = compactDelta.blastSeedIds.length;
          const totalAddedWires = compactDelta.addedWires.length;
          const totalRemovedWires = compactDelta.removedWires.length;
          const totalDanglingWires = compactDelta.danglingWires.length;
          const totalNodeChanges = compactDelta.nodeChanges.length;
          const buildBoundedDelta = (c) => ({
            ...compactDelta,
            addedIds: compactDelta.addedIds.slice(0, c),
            deletedIds: compactDelta.deletedIds.slice(0, c),
            movedIds: compactDelta.movedIds.slice(0, c),
            sigChangedIds: compactDelta.sigChangedIds.slice(0, c),
            bodyPatchedIds: compactDelta.bodyPatchedIds.slice(0, c),
            blastSeedIds: compactDelta.blastSeedIds.slice(0, c),
            nodeChanges: compactDelta.nodeChanges.slice(0, c),
            addedWires: compactDelta.addedWires.slice(0, c),
            removedWires: compactDelta.removedWires.slice(0, c),
            danglingWires: compactDelta.danglingWires.slice(0, c),
            totalAddedCount,
            totalDeletedCount,
            totalMovedCount,
            totalSigChangedCount,
            totalBodyPatchedCount,
            totalBlastSeedCount,
            totalNodeChanges,
            totalAddedWires,
            totalRemovedWires,
            totalDanglingWires,
            deltaTruncated:
              totalAddedCount > c ||
              totalDeletedCount > c ||
              totalMovedCount > c ||
              totalSigChangedCount > c ||
              totalBodyPatchedCount > c ||
              totalBlastSeedCount > c ||
              totalAddedWires > c ||
              totalRemovedWires > c ||
              totalDanglingWires > c ||
              totalNodeChanges > c,
          });
          let out = buildBoundedDelta(cap);
          if (explicitMaxItems === undefined) {
            while (cap > 1 && !fitsMcpWireBudget(out)) {
              cap = Math.max(1, Math.floor(cap * 0.7));
              out = buildBoundedDelta(cap);
            }
          }
          return out;
        }
        return compactDelta;
      }
      return delta;
    }

    default:
      throw new Error(`Unknown TUX MCP tool: ${name}`);
  }
}

export function readTuxMcpResource(uri, opts = {}) {
  switch (uri) {
    case "tux://catalog/components": {
      const payload = callTuxMcpTool("tux_list_components", {}, opts);
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(payload, null, 2),
          },
        ],
      };
    }
    case "tux://tokens/all": {
      const defs = Object.fromEntries(loadTokenDefinitions().entries());
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                tokenCount: Object.keys(defs).length,
                canonicalAliases: CANONICAL_TOKEN_ALIASES,
                tokens: defs,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    case "tux://architecture/layers-and-api": {
      const architecture = {
        layers: [
          {
            package: "@tti/tti-ux",
            description: "Slim core Nuxt 4 design system layer (tokens, 75+ core components, composables, layouts).",
          },
          {
            package: "@tti/tti-ux-charts",
            components: ["TuxECharts"],
            description: "Apache ECharts 6 visualization layer.",
          },
          {
            package: "@tti/tti-ux-diagrams",
            components: ["TuxDiagram", "TuxArchitectureMap"],
            description:
              "Mermaid, Graphviz DOT, PlantUML, Markmap, and 6-Level C4 / Code Property Graph Architecture Map (M.A.P.) layer.",
          },
          {
            package: "@tti/tti-ux-code",
            components: ["TuxCodeBlock"],
            description: "Shiki syntax-highlighted code block layer.",
          },
          {
            package: "@tti/tti-ux-desk",
            components: [
              "TuxRichTextEditor",
              "TuxDeskArticle",
              "TuxDeskEditor",
              "TuxDeskInspector",
              "TuxDeskModuleBlock",
              "TuxDeskModulePalette",
              "TuxDeskModuleView",
              "TuxDeskOutline",
              "TuxDeskPresetPicker",
              "TuxDeskSourceEditor",
              "TuxDeskWebBuilder",
            ],
            description: "Visual editorial CMS layer with TipTap editor, PGlite/Postgres storage, and 14 API routes.",
            apiRoutes: [
              { method: "GET", path: "/api/pages", query: ["status", "search", "stale", "limit", "offset"], auth: false },
              { method: "POST", path: "/api/pages", body: ["title", "slug", "summary?", "status?", "bodyJson?", "bodyMd?"], auth: true },
              { method: "GET", path: "/api/pages/:id", auth: false },
              { method: "PUT", path: "/api/pages/:id", body: ["title?", "slug?", "summary?", "status?", "bodyJson?", "bodyMd?", "changeNote?"], auth: true },
              { method: "POST", path: "/api/pages/:id/publish", auth: true },
              { method: "GET", path: "/api/pages/:id/revisions", auth: false },
              { method: "POST", path: "/api/pages/:id/revisions/:revId/rollback", auth: true },
              { method: "GET", path: "/api/public/pages/:slug", auth: false },
              { method: "POST", path: "/api/feedback", body: ["pageId", "vote ('up'|'down')", "reason?", "note?", "sessionId?"], auth: false },
              { method: "GET", path: "/api/issues", query: ["status ('open'|'resolved')", "pageId"], auth: false },
              { method: "POST", path: "/api/issues/:id/resolve", body: ["note?"], auth: true },
              { method: "GET", path: "/api/media", auth: false },
              { method: "POST", path: "/api/media", body: ["filename", "mimeType", "sizeBytes", "url", "altText?"], auth: true },
              { method: "GET", path: "/api/system/stats", auth: false },
            ],
          },
          {
            package: "@tti/tti-ux-content",
            description: "Git-backed Markdown/MDC documentation layer powered by @nuxt/content.",
          },
          {
            package: "@tti/tti-ux-react",
            description: "React 19 JSX/TSX component library.",
          },
        ],
      };
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(architecture, null, 2),
          },
        ],
      };
    }
    case "tux://architecture/c4-graph": {
      const model = resolveModel(opts);
      if (!model) {
        throw new Error(
          "Resource 'tux://architecture/c4-graph' requires an explicit architecture model; start tux-mcp with --model <path> (or set TUX_MCP_MODEL).",
        );
      }
      const { buildUnifiedArchitectureGraph, extractModelLinks } = requireMapRuntime();
      const { nodes, edges } = buildUnifiedArchitectureGraph(model);
      const levelCounts = {};
      const allNodes = [...nodes.values()];
      for (const n of allNodes) {
        levelCounts[String(n.level)] = (levelCounts[String(n.level)] || 0) + 1;
      }
      const levels = Object.keys(levelCounts)
        .map(Number)
        .sort((a, b) => a - b);
      // Bound resource payload (< 16 KB): emit C4/deployment overview (Levels 1-4, capped at 60 nodes & 60 edges)
      // plus per-level counts and drill-down tool names when code-level subgraphs are present.
      const c4Candidates = allNodes.filter((n) => n.level <= 4);
      const overviewSource = c4Candidates.length > 0 ? c4Candidates : allNodes;
      const overviewNodes = overviewSource.slice(0, 60).map((n) => ({
        id: n.id,
        name: n.name,
        kind: n.kind,
        level: n.level,
        ...(n.parentId ? { parentId: n.parentId } : {}),
        ...(n.tech ? { tech: n.tech } : {}),
        ...(Array.isArray(n.hosts) && n.hosts.length > 0 ? { hosts: n.hosts } : {}),
      }));
      const overviewIds = new Set(overviewNodes.map((n) => n.id));
      const rawRels = [
        ...(Array.isArray(model.level1?.rels) ? model.level1.rels : []),
        ...(Array.isArray(model.level2?.rels) ? model.level2.rels : []),
        ...extractModelLinks(model),
      ];
      const seenRel = new Set();
      const overviewEdges = [];
      for (const e of rawRels) {
        if (!e || !overviewIds.has(e.from) || !overviewIds.has(e.to)) continue;
        const kind = e.kind || "rel";
        const key = `${e.from}|${e.to}|${kind}`;
        if (seenRel.has(key)) continue;
        seenRel.add(key);
        overviewEdges.push({
          from: e.from,
          to: e.to,
          kind,
          ...(e.label ? { label: String(e.label).slice(0, 80) } : {}),
        });
        if (overviewEdges.length >= 60) break;
      }
      const truncated = overviewNodes.length < nodes.size || overviewEdges.length < edges.length;
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify({
              schema: "tux-c4-cpg-v2",
              levels,
              levelCounts,
              nodeCount: nodes.size,
              edgeCount: edges.length,
              truncated,
              ...(truncated
                ? {
                    drillDownTools: [
                      "tux_query_architecture_nodes",
                      "tux_query_architecture_impact",
                      "tux_find_architecture_path",
                      "tux_compute_graph_delta",
                    ],
                  }
                : {}),
              nodes: overviewNodes,
              edges: overviewEdges,
            }),
          },
        ],
      };
    }
    case "tux://vision/roadmap": {
      const visionPath = path.join(ROOT, "design", "world-class-vision.md");
      const text = existsSync(visionPath)
        ? readFileSync(visionPath, "utf8")
        : "# TUX World-Class Vision";
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text,
          },
        ],
      };
    }
    default:
      throw new Error(`Unknown TUX MCP resource URI: ${uri}`);
  }
}

let cachedPkgVersion = null;
function getPkgVersion() {
  if (cachedPkgVersion) return cachedPkgVersion;
  try {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
    cachedPkgVersion = pkg.version || "3.3.0";
  } catch {
    cachedPkgVersion = "3.3.0";
  }
  return cachedPkgVersion;
}

export function handleMcpRequest(req, opts = {}) {
  const { id, method, params } = req || {};

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
        serverInfo: {
          name: "tti-ux-mcp",
          version: getPkgVersion(),
        },
      },
    };
  }

  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return null;
  }

  if (method === "ping") {
    return {
      jsonrpc: "2.0",
      id,
      result: {},
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: getTuxMcpTools(opts),
      },
    };
  }

  if (method === "tools/call") {
    try {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const payload = callTuxMcpTool(toolName, toolArgs, opts);
      const serialized = ARCHITECTURE_TOOL_NAMES.has(toolName)
        ? JSON.stringify(payload)
        : JSON.stringify(payload, null, 2);
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: serialized,
            },
          ],
          isError: Boolean(payload?.error),
        },
      };
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32602,
          message: err instanceof Error ? err.message : String(err),
        },
      };
    }
  }

  if (method === "resources/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        resources: getTuxMcpResources(opts),
      },
    };
  }

  if (method === "resources/read") {
    try {
      const result = readTuxMcpResource(params?.uri, opts);
      return {
        jsonrpc: "2.0",
        id,
        result,
      };
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32602,
          message: err instanceof Error ? err.message : String(err),
        },
      };
    }
  }

  if (method === "prompts/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        prompts: TUX_MCP_PROMPTS,
      },
    };
  }

  if (method === "prompts/get") {
    const promptName = params?.name;
    const topic = params?.arguments?.topic || "TTI Corridor Telemetry";
    const division = params?.arguments?.division || "maroon";
    if (promptName === "tux-build-tti-view") {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          description: `Build a WCAG 2.2 AAA TTI view for ${topic}`,
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Create a TUX Vue template for "${topic}" using <TuxPageHeader division="${division}">, <TuxCard division="${division}">, <TuxUnitValue> for engineering measurements, and <TuxChartFrame> with accessible table/sonification series. Follow TUX's strict token and wash ladder guardrails.`,
              },
            },
          ],
        },
      };
    }
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32602, message: `Unknown prompt: ${promptName}` },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  };
}

export function createTuxMcpServer(opts = {}) {
  return {
    getTools: () => getTuxMcpTools(opts),
    getResources: () => getTuxMcpResources(opts),
    callTool: (name, args = {}) => callTuxMcpTool(name, args, opts),
    readResource: (uri) => readTuxMcpResource(uri, opts),
    handleRequest: (req) => handleMcpRequest(req, opts),
  };
}

// ── Dual-Mode Stdio Framing (Newline JSON-RPC + Content-Length Header) ──────
export function createStdioFrameParser({
  onMessage,
  onError,
  maxBufferBytes = MAX_STDIO_BUFFER_BYTES,
  maxHeaderBytes = MAX_STDIO_HEADER_BYTES,
}) {
  let buffer = Buffer.alloc(0);
  let lastFraming = "newline";

  return {
    push(chunk) {
      const bufChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), "utf8");
      if (buffer.length + bufChunk.length > maxBufferBytes) {
        buffer = Buffer.alloc(0);
        onError?.("Message exceeds maximum stdio buffer size (16 MiB)", lastFraming);
        return;
      }
      buffer = buffer.length === 0 ? bufChunk : Buffer.concat([buffer, bufChunk]);

      while (buffer.length > 0) {
        // Trim leading ASCII whitespace/CRLF between frames
        let wsEnd = 0;
        while (
          wsEnd < buffer.length &&
          (buffer[wsEnd] === 0x20 ||
            buffer[wsEnd] === 0x09 ||
            buffer[wsEnd] === 0x0d ||
            buffer[wsEnd] === 0x0a)
        ) {
          wsEnd += 1;
        }
        if (wsEnd > 0) {
          buffer = buffer.subarray(wsEnd);
          if (buffer.length === 0) break;
        }

        const firstByte = buffer[0];
        const isJsonStart = firstByte === 0x7b || firstByte === 0x5b; // '{' or '['
        const probe = buffer.subarray(0, Math.min(buffer.length, 96)).toString("utf8");

        if (!isJsonStart && /^[A-Za-z0-9-]+$/.test(probe) && buffer.length < 96) {
          // Partial HTTP-style header field name arriving across chunks
          break;
        }

        if (!isJsonStart && /^[A-Za-z0-9-]+:/.test(probe)) {
          lastFraming = "content-length";
          const crlfIdx = buffer.indexOf("\r\n\r\n");
          const lfIdx = buffer.indexOf("\n\n");
          let sepIdx = -1;
          let sepLen = 4;
          if (crlfIdx !== -1 && (lfIdx === -1 || crlfIdx < lfIdx)) {
            sepIdx = crlfIdx;
            sepLen = 4;
          } else if (lfIdx !== -1) {
            sepIdx = lfIdx;
            sepLen = 2;
          }
          if (sepIdx === -1) {
            if (buffer.length > maxHeaderBytes) {
              buffer = Buffer.alloc(0);
              onError?.("Header block exceeds maximum size (8 KiB)", "content-length");
            }
            break;
          }
          if (sepIdx > maxHeaderBytes) {
            buffer = Buffer.alloc(0);
            onError?.("Header block exceeds maximum size (8 KiB)", "content-length");
            break;
          }
          const headerStr = buffer.subarray(0, sepIdx).toString("utf8");
          const lenMatch = headerStr.match(/(?:^|\r?\n)content-length\s*:\s*([^\r\n]+)/i);
          if (!lenMatch) {
            buffer = buffer.subarray(sepIdx + sepLen);
            onError?.("Missing Content-Length header", "content-length");
            continue;
          }
          const rawLen = lenMatch[1].trim();
          const contentLen = /^\d+$/.test(rawLen) ? Number(rawLen) : Number.NaN;
          if (
            !Number.isSafeInteger(contentLen) ||
            contentLen < 0 ||
            contentLen > maxBufferBytes ||
            sepIdx + sepLen + contentLen > maxBufferBytes
          ) {
            buffer = Buffer.alloc(0);
            onError?.("Invalid or oversized Content-Length header", "content-length");
            break;
          }
          const totalNeeded = sepIdx + sepLen + contentLen;
          if (buffer.length < totalNeeded) break;
          const bodyStr = buffer.subarray(sepIdx + sepLen, totalNeeded).toString("utf8");
          buffer = buffer.subarray(totalNeeded);
          onMessage(bodyStr, "content-length");
        } else {
          lastFraming = "newline";
          const nlIdx = buffer.indexOf("\n");
          if (nlIdx === -1) break;
          const lineStr = buffer.subarray(0, nlIdx).toString("utf8").trim();
          buffer = buffer.subarray(nlIdx + 1);
          if (!lineStr) continue;
          onMessage(lineStr, "newline");
        }
      }
    },
  };
}

if (IS_MAIN) {
  if (process.argv.includes("--list-tools")) {
    console.log(JSON.stringify(getTuxMcpTools(), null, 2));
    process.exit(0);
  }

  const callIdx = process.argv.indexOf("--call");
  if (callIdx !== -1) {
    try {
      const toolName = process.argv[callIdx + 1];
      if (!toolName || toolName.startsWith("--")) {
        throw new Error("Missing tool name after --call.");
      }
      const nextArg = process.argv[callIdx + 2];
      const rawArgs = nextArg && !nextArg.startsWith("--") ? nextArg : "{}";
      const parsedArgs = JSON.parse(rawArgs);
      if (!parsedArgs || typeof parsedArgs !== "object" || Array.isArray(parsedArgs)) {
        throw new Error("Tool arguments JSON after --call must be an object.");
      }
      const result = callTuxMcpTool(toolName, parsedArgs);
      console.log(JSON.stringify(result, null, 2));
      process.exit(result && typeof result === "object" && result.error ? 1 : 0);
    } catch (err) {
      console.error(`tux-mcp: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  }

  function sendResponse(resObj, framing) {
    if (!resObj) return;
    const json = JSON.stringify(resObj);
    if (framing === "content-length") {
      const byteLen = Buffer.byteLength(json, "utf8");
      process.stdout.write(`Content-Length: ${byteLen}\r\n\r\n${json}`);
    } else {
      process.stdout.write(`${json}\n`);
    }
  }

  const parser = createStdioFrameParser({
    onMessage(bodyStr, framing) {
      try {
        sendResponse(handleMcpRequest(JSON.parse(bodyStr)), framing);
      } catch {
        sendResponse(
          {
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: "Parse error" },
          },
          framing,
        );
      }
    },
    onError(message, framing) {
      sendResponse(
        {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32700, message },
        },
        framing,
      );
    },
  });

  process.stdin.on("data", (chunk) => {
    parser.push(chunk);
  });
}
