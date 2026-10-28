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
 *   npx tux-audit mcp                  # Start JSON-RPC 2.0 stdio MCP server
 *   npx tux-audit mcp --list-tools     # Print registered MCP tools as JSON
 *   npx tux-audit mcp --call <tool> [jsonArgs]  # Invoke a tool from CLI
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export const CANONICAL_TOKEN_ALIASES = {
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
};

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
  if (CANONICAL_TOKEN_ALIASES[token]) return CANONICAL_TOKEN_ALIASES[token];
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
  const defaultsMap = {};
  const defaultsMatch = code.match(/withDefaults\s*\(\s*defineProps<[\s\S]*?>\(\)\s*,\s*\{([\s\S]*?)\}\s*\)/);
  if (defaultsMatch) {
    const body = defaultsMatch[1];
    for (const line of body.split("\n")) {
      const m = line.trim().match(/^([a-zA-Z0-9_$]+)\s*:\s*(.+?)\s*,?$/);
      if (m && m[2] !== "undefined") {
        defaultsMap[m[1]] = m[2];
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
          default: defaultsMap[trimmedName] ?? undefined,
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

// ── Architecture Map (M.A.P.) Code Property Graph & ACP Lease Engine ────────
const activeAcpLeases = new Map();

function loadDefaultArchitectureGraph() {
  // Dynamically builds the unified 6-level C4 + Code Property Graph from packages/diagrams
  const nodes = new Map([
    [
      "p-users",
      {
        id: "p-users",
        level: 1,
        kind: "person",
        name: "Product users & analysts",
        desc: "Sign in to explore dashboards, run reports, manage projects, and collaborate.",
      },
    ],
    [
      "p-admins",
      {
        id: "p-admins",
        level: 1,
        kind: "person",
        name: "Platform admins & SREs",
        desc: "Configure access policies, review system health, and manage releases.",
      },
    ],
    [
      "s-platform",
      {
        id: "s-platform",
        level: 1,
        kind: "system",
        name: "Enterprise Cloud Platform",
        tech: "Web Portal · Core API · Workers · Data",
      },
    ],
    [
      "x-sso",
      {
        id: "x-sso",
        level: 1,
        kind: "external",
        name: "Identity Provider (SSO)",
        tech: "OIDC · SAML 2.0",
      },
    ],
    [
      "c-edge",
      {
        id: "c-edge",
        level: 2,
        kind: "container",
        name: "Edge Reverse Proxy",
        tech: "Envoy / Caddy",
        parentId: "s-platform",
        deployed: ["app-vm-01"],
      },
    ],
    [
      "c-web",
      {
        id: "c-web",
        level: 2,
        kind: "container",
        name: "Web Portal",
        tech: "Nuxt · TypeScript",
        parentId: "s-platform",
        deployed: ["app-vm-01"],
      },
    ],
    [
      "c-api",
      {
        id: "c-api",
        level: 2,
        kind: "container",
        name: "Core API Service",
        tech: "Go · REST & GraphQL",
        parentId: "s-platform",
        deployed: ["app-vm-01"],
        source: { path: "services/api/cmd/server/main.go", lineRange: [1, 148], symbol: "main()" },
        diff: { changeType: "modified", filesChanged: 3, summary: "Updated RBAC token claims & search proxy" },
      },
    ],
    [
      "c-db",
      {
        id: "c-db",
        level: 2,
        kind: "database",
        name: "Primary Database",
        tech: "PostgreSQL 16",
        parentId: "s-platform",
        deployed: ["app-vm-01", "app-data-disk"],
      },
    ],
    [
      "c-search",
      {
        id: "c-search",
        level: 2,
        kind: "container",
        name: "AI Search Service",
        tech: "Python · Vector Index",
        parentId: "s-platform",
        deployed: ["ai-search-app", "vector-db-01"],
        source: { path: "services/ai-search/src/main.py", lineRange: [1, 96], symbol: "create_search_app()" },
        diff: { changeType: "modified", filesChanged: 2, summary: "Added hybrid RRF reranker & 1536d HNSW index" },
      },
    ],
    [
      "c-workers",
      {
        id: "c-workers",
        level: 2,
        kind: "container",
        name: "Background Workers",
        tech: "Worker Pool (2 Nodes)",
        parentId: "s-platform",
        deployed: ["worker-node-01", "worker-node-02"],
      },
    ],
    [
      "c-cache",
      {
        id: "c-cache",
        level: 2,
        kind: "database",
        name: "Cache & Job Queue",
        tech: "Valkey / Redis",
        parentId: "s-platform",
        deployed: ["app-vm-01"],
      },
    ],
    [
      "c-api/0",
      {
        id: "c-api/0",
        level: 3,
        kind: "component",
        name: "REST & GraphQL Router",
        parentId: "c-api",
        source: { path: "services/api/internal/http/router.go", lineRange: [24, 182], symbol: "NewRouter()" },
      },
    ],
    [
      "c-api/1",
      {
        id: "c-api/1",
        level: 3,
        kind: "component",
        name: "Auth & RBAC Guard",
        parentId: "c-api",
        source: { path: "services/api/internal/auth/rbac.go", lineRange: [18, 134], symbol: "VerifyRBAC()" },
        diff: { changeType: "modified", filesChanged: 2, summary: "Enforce scoped subgraph leases" },
      },
    ],
    [
      "c-api/1/jwks",
      {
        id: "c-api/1/jwks",
        level: 5,
        kind: "symbol",
        name: "JWKSKeyCache",
        parentId: "c-api/1",
        source: { path: "services/api/internal/auth/rbac.go", lineRange: [24, 62], symbol: "type JWKSKeyCache struct" },
      },
    ],
    [
      "c-api/1/verify",
      {
        id: "c-api/1/verify",
        level: 5,
        kind: "symbol",
        name: "VerifyRBAC()",
        parentId: "c-api/1",
        source: { path: "services/api/internal/auth/rbac.go", lineRange: [66, 134], symbol: "func VerifyRBAC(ctx, token)" },
      },
    ],
    [
      "app-vm-01",
      {
        id: "app-vm-01",
        level: 4,
        kind: "vm",
        name: "app-vm-01",
        hosts: ["c-edge", "c-web", "c-api", "c-db", "c-cache"],
      },
    ],
    [
      "ai-search-app",
      {
        id: "ai-search-app",
        level: 4,
        kind: "containerapp",
        name: "ai-search-app",
        hosts: ["c-search"],
        source: { path: "services/ai-search/Dockerfile", lineRange: [1, 44] },
      },
    ],
    [
      "vector-db-01",
      {
        id: "vector-db-01",
        level: 4,
        kind: "postgres",
        name: "vector-db-01",
        hosts: ["c-search"],
        source: { path: "infra/opentofu/vector-db.tf", lineRange: [12, 88] },
      },
    ],
    [
      "ai-search-app/router",
      {
        id: "ai-search-app/router",
        level: 5,
        kind: "module",
        name: "Search API Router",
        parentId: "ai-search-app",
        source: { path: "services/ai-search/src/api/routes.py", lineRange: [14, 92], symbol: "POST /v1/search" },
      },
    ],
    [
      "ai-search-app/retriever",
      {
        id: "ai-search-app/retriever",
        level: 5,
        kind: "module",
        name: "Hybrid Retriever",
        parentId: "ai-search-app",
        source: { path: "services/ai-search/src/search/retriever.py", lineRange: [1, 184], symbol: "class HybridRetriever" },
      },
    ],
    [
      "ai-search-app/reranker",
      {
        id: "ai-search-app/reranker",
        level: 5,
        kind: "module",
        name: "Cross-Encoder Reranker",
        parentId: "ai-search-app",
        source: { path: "services/ai-search/src/search/reranker.py", lineRange: [10, 76], symbol: "rerank_candidates()" },
      },
    ],
    [
      "ai-search-app/pgclient",
      {
        id: "ai-search-app/pgclient",
        level: 5,
        kind: "module",
        name: "PgVector Pool Client",
        parentId: "ai-search-app",
        source: { path: "services/ai-search/src/db/pgvector_pool.py", lineRange: [22, 118], symbol: "AsyncVectorPool" },
      },
    ],
    [
      "ai-search-app/retriever/embed",
      {
        id: "ai-search-app/retriever/embed",
        level: 6,
        kind: "symbol",
        name: "encode_query_vector()",
        parentId: "ai-search-app/retriever",
        source: { path: "services/ai-search/src/search/retriever.py", lineRange: [28, 64] },
      },
    ],
    [
      "ai-search-app/retriever/dense",
      {
        id: "ai-search-app/retriever/dense",
        level: 6,
        kind: "symbol",
        name: "query_hnsw_chunks()",
        parentId: "ai-search-app/retriever",
        source: { path: "services/ai-search/src/search/retriever.py", lineRange: [68, 119] },
      },
    ],
    [
      "ai-search-app/retriever/rrf",
      {
        id: "ai-search-app/retriever/rrf",
        level: 6,
        kind: "symbol",
        name: "fuse_reciprocal_ranks()",
        parentId: "ai-search-app/retriever",
        source: { path: "services/ai-search/src/search/retriever.py", lineRange: [123, 178] },
      },
    ],
    [
      "vector-db-01/docs_chunks",
      {
        id: "vector-db-01/docs_chunks",
        level: 5,
        kind: "schema",
        name: "table: document_chunks",
        parentId: "vector-db-01",
        source: { path: "services/ai-search/migrations/004_document_chunks.sql", lineRange: [1, 58] },
      },
    ],
    [
      "vector-db-01/hnsw_idx",
      {
        id: "vector-db-01/hnsw_idx",
        level: 5,
        kind: "schema",
        name: "index: idx_chunks_hnsw_cosine",
        parentId: "vector-db-01",
        source: { path: "services/ai-search/migrations/005_hnsw_index.sql", lineRange: [1, 32] },
      },
    ],
  ]);

  const edges = [
    { id: "e-l1-1", from: "p-users", to: "s-platform", level: 1, kind: "rel", label: "Uses web app & API" },
    { id: "e-l1-2", from: "s-platform", to: "x-sso", level: 1, kind: "rel", label: "OIDC / SCIM" },
    { id: "e-l2-1", from: "p-users", to: "c-edge", level: 2, kind: "rel", label: "HTTPS 443" },
    { id: "e-l2-2", from: "c-edge", to: "c-web", level: 2, kind: "rel", label: "HTTP 3000" },
    { id: "e-l2-3", from: "c-edge", to: "c-api", level: 2, kind: "rel", label: "HTTP 8080" },
    { id: "e-l2-4", from: "c-web", to: "c-api", level: 2, kind: "rel", label: "REST / GraphQL" },
    { id: "e-l2-5", from: "c-web", to: "c-search", level: 2, kind: "rel", label: "Semantic queries" },
    { id: "e-l2-6", from: "c-api", to: "c-db", level: 2, kind: "rel", label: "SQL 5432" },
    { id: "e-l2-7", from: "c-api", to: "c-cache", level: 2, kind: "rel", label: "RESP 6379" },
    { id: "e-l2-8", from: "c-api", to: "x-sso", level: 2, kind: "rel", label: "OIDC" },
    { id: "e-l2-9", from: "c-workers", to: "c-cache", level: 2, kind: "rel", label: "Pulls jobs" },
    { id: "e-l2-10", from: "c-workers", to: "c-db", level: 2, kind: "rel", label: "Writes results" },
    { id: "e-l4-1", from: "app-vm-01", to: "ai-search-app", level: 4, kind: "deployment", label: "Search queries" },
    { id: "e-l4-2", from: "ai-search-app", to: "vector-db-01", level: 4, kind: "deployment", label: "Vector SQL" },
    { id: "e-l5-1", from: "ai-search-app/router", to: "ai-search-app/retriever", level: 5, kind: "rel", label: "Dispatches query" },
    { id: "e-l5-2", from: "ai-search-app/retriever", to: "ai-search-app/pgclient", level: 5, kind: "rel", label: "Queries HNSW" },
    { id: "e-l5-3", from: "ai-search-app/retriever", to: "ai-search-app/reranker", level: 5, kind: "rel", label: "Top-50 chunks" },
    { id: "e-l6-1", from: "ai-search-app/retriever/embed", to: "ai-search-app/retriever/dense", level: 6, kind: "rel", label: "1536d vector" },
    { id: "e-l6-2", from: "ai-search-app/retriever/dense", to: "ai-search-app/retriever/rrf", level: 6, kind: "rel", label: "Candidate rows" },
  ];

  for (const n of nodes.values()) {
    if (n.parentId && nodes.has(n.parentId)) {
      edges.push({
        id: `p-${n.parentId}-${n.id}`,
        from: n.parentId,
        to: n.id,
        level: n.level,
        kind: "parent-child",
      });
    }
    for (const hid of n.deployed || []) {
      if (nodes.has(hid)) {
        edges.push({
          id: `dep-${n.id}-${hid}`,
          from: n.id,
          to: hid,
          level: 4,
          kind: "hosts",
        });
      }
    }
  }

  return { nodes, edges };
}

// ── MCP Tools, Resources, and Prompts Definitions ───────────────────────────
export const TUX_MCP_TOOLS = [
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
  {
    name: "tux_query_architecture_layer",
    description:
      "Query a semantic level (Level 1..6) or parent subgraph from the TUX Architecture Map (M.A.P.) Code Property Graph, returning nodes, relationships, source file bindings, and PR diff status.",
    inputSchema: {
      type: "object",
      properties: {
        level: {
          type: "number",
          description: "Optional semantic level number (1 = Context, 2 = Containers, 3 = Components, 4 = Deployment, 5 = Modules/Schemas, 6 = AST Symbols).",
        },
        focusId: {
          type: "string",
          description: "Optional parent container, resource, or module ID to inspect (e.g. 'c-api', 'ai-search-app', 'ai-search-app/retriever').",
        },
      },
    },
  },
  {
    name: "tux_get_blast_radius",
    description:
      "Compute the deterministic k-hop upstream/downstream dependency blast radius and impacted source code files for any architecture node ID before refactoring or editing code.",
    inputSchema: {
      type: "object",
      properties: {
        nodeId: {
          type: "string",
          description: "Target architecture node ID (e.g. 'c-api', 'c-search', 'ai-search-app', 'ai-search-app/retriever').",
        },
        maxHops: {
          type: "number",
          description: "Maximum traversal hops (default 2).",
        },
      },
      required: ["nodeId"],
    },
  },
  {
    name: "tux_find_shortest_path",
    description:
      "Find the shortest architectural call/dependency path between two nodes across Levels 1..6.",
    inputSchema: {
      type: "object",
      properties: {
        fromNodeId: { type: "string", description: "Starting node ID (e.g. 'p-users' or 'c-web')." },
        toNodeId: { type: "string", description: "Destination node ID (e.g. 'vector-db-01/hnsw_idx' or 'c-db')." },
      },
      required: ["fromNodeId", "toNodeId"],
    },
  },
  {
    name: "tux_acp_subgraph_lease",
    description:
      "ACP (Agent Communication Protocol) Subgraph Lease Coordinator: acquire, release, or list exclusive non-overlapping architectural subgraph leases so parallel AI coding agents never collide on shared components or files.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["acquire", "release", "list"],
          description: "Lease operation ('acquire', 'release', or 'list').",
        },
        agentId: {
          type: "string",
          description: "Identifier of the AI agent requesting or releasing the lease (e.g. 'agent-backend-01').",
        },
        rootNodeId: {
          type: "string",
          description: "Root architecture node ID to lock along with its descendant subgraph (e.g. 'c-api' or 'ai-search-app').",
        },
        ttlSeconds: {
          type: "number",
          description: "Optional lease duration in seconds (default 900).",
        },
      },
      required: ["action"],
    },
  },
];

export const TUX_MCP_RESOURCES = [
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
    uri: "tux://architecture/c4-graph",
    name: "TUX Architecture Map (M.A.P.) 6-Level Code Property Graph",
    description:
      "Unified 6-level C4 + AST Code Property Graph (nodes, edges, source file bindings, PR diffs, and active ACP agent subgraph leases).",
    mimeType: "application/json",
  },
  {
    uri: "tux://vision/roadmap",
    name: "TUX World-Class Vision & Engineering Roadmap",
    description: "Strategic 4-pillar roadmap for the Texas A&M Transportation Institute Design System.",
    mimeType: "text/markdown",
  },
];

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

export function callTuxMcpTool(name, args = {}) {
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

      // 2. Check var(--token) references (legacy aliases + Levenshtein typos)
      const varRe = /var\(\s*(--[a-z][a-z0-9-]*)\s*\)/g;
      for (const m of [...fixed.matchAll(varRe)]) {
        const token = m[1];
        if (CANONICAL_TOKEN_ALIASES[token]) {
          const replacement = CANONICAL_TOKEN_ALIASES[token];
          issues.push({
            type: "legacy-token-alias",
            token,
            replacement,
            message: `Replaced ${token} with canonical ${replacement}`,
          });
          fixed = fixed.replaceAll(`var(${token})`, `var(${replacement})`);
        } else if (!defs.has(token) && !token.startsWith("--ui-")) {
          const suggested = suggestClosestToken(token, defs);
          issues.push({
            type: "undefined-token",
            token,
            suggested,
            message: suggested
              ? `Token ${token} is undefined; auto-replaced with closest match ${suggested}`
              : `Token ${token} is not defined in TUX tokens.css`,
          });
          if (suggested && defs.has(suggested)) {
            fixed = fixed.replaceAll(`var(${token})`, `var(${suggested})`);
          }
        }
      }

      // 3. Check color-mix wash ladder steps (< 60% against transparent)
      const washRe =
        /color-mix\(\s*in\s+srgb\s*,\s*([^,]+?)\s+(\d+(?:\.\d+)?)%\s*,\s*transparent\s*\)/g;
      fixed = fixed.replace(washRe, (full, colorExpr, pctStr) => {
        const pct = Number(pctStr);
        if (pct < 60 && !WASH_LADDER.includes(pct)) {
          const snapped = snapWashStep(pct);
          issues.push({
            type: "off-ladder-wash",
            originalPercent: pct,
            snappedPercent: snapped,
            message: `Snapped color-mix wash ${pct}% to canonical ladder step ${snapped}%`,
          });
          return `color-mix(in srgb, ${colorExpr} ${snapped}%, transparent)`;
        }
        return full;
      });

      // 4. Check WCAG 2.5.3 label-content-name-mismatch on <button aria-label="...">Visible Text</button>
      const btnRe = /<button([^>]*?)\saria-label=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/button>/g;
      for (const m of fixed.matchAll(btnRe)) {
        const ariaLabel = m[2].trim();
        const innerText = m[4].replace(/<[^>]+>/g, "").replace(/\{\{[\s\S]*?\}\}/g, "").trim();
        if (
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

      return {
        valid: issues.length === 0,
        issueCount: issues.length,
        issues,
        autoFixedCode: fixed,
      };
    }

    case "tux_query_architecture_layer": {
      const { nodes, edges } = loadDefaultArchitectureGraph();
      const level = args.level != null ? Number(args.level) : null;
      const focusId = args.focusId ? String(args.focusId).trim() : null;

      const matchedNodes = [...nodes.values()].filter((n) => {
        if (focusId) return n.parentId === focusId || n.id === focusId;
        if (level != null) return n.level === level;
        return true;
      });
      const matchedIds = new Set(matchedNodes.map((n) => n.id));
      const matchedEdges = edges.filter(
        (e) => matchedIds.has(e.from) || matchedIds.has(e.to),
      );

      return {
        level: level ?? "all",
        focusId,
        nodeCount: matchedNodes.length,
        edgeCount: matchedEdges.length,
        nodes: matchedNodes,
        edges: matchedEdges,
      };
    }

    case "tux_get_blast_radius": {
      const nodeId = String(args.nodeId || "").trim();
      const maxHops = args.maxHops != null ? Math.max(1, Number(args.maxHops)) : 2;
      const { nodes, edges } = loadDefaultArchitectureGraph();
      const root = nodes.get(nodeId);
      if (!root) {
        return {
          error: `Node '${nodeId}' not found in architecture graph.`,
          availableNodeIds: [...nodes.keys()],
        };
      }

      const childTree = new Set();
      const descQ = [nodeId];
      while (descQ.length > 0) {
        const curr = descQ.shift();
        for (const e of edges) {
          if (e.kind === "parent-child" && e.from === curr && !childTree.has(e.to)) {
            childTree.add(e.to);
            descQ.push(e.to);
          }
        }
      }

      const seedSet = new Set([nodeId, ...childTree]);
      if (root.parentId) seedSet.add(root.parentId);

      const upstream = new Map();
      const downstream = new Map();
      const impactedEdgeIds = new Set();

      const downQ = [...seedSet].map((id) => ({ id, hop: 0 }));
      while (downQ.length > 0) {
        const { id, hop } = downQ.shift();
        if (hop >= maxHops) continue;
        for (const e of edges) {
          if (e.kind === "parent-child") continue;
          if (e.from === id) {
            impactedEdgeIds.add(e.id);
            if (!seedSet.has(e.to) && (!downstream.has(e.to) || downstream.get(e.to) > hop + 1)) {
              downstream.set(e.to, hop + 1);
              downQ.push({ id: e.to, hop: hop + 1 });
            }
          }
        }
      }

      const upQ = [...seedSet].map((id) => ({ id, hop: 0 }));
      while (upQ.length > 0) {
        const { id, hop } = upQ.shift();
        if (hop >= maxHops) continue;
        for (const e of edges) {
          if (e.kind === "parent-child") continue;
          if (e.to === id) {
            impactedEdgeIds.add(e.id);
            if (!seedSet.has(e.from) && (!upstream.has(e.from) || upstream.get(e.from) > hop + 1)) {
              upstream.set(e.from, hop + 1);
              upQ.push({ id: e.from, hop: hop + 1 });
            }
          }
        }
      }

      const allTouched = new Set([...seedSet, ...upstream.keys(), ...downstream.keys()]);
      const impactedFiles = [];
      const seenPaths = new Set();
      for (const id of allTouched) {
        const src = nodes.get(id)?.source;
        if (src && !seenPaths.has(src.path)) {
          seenPaths.add(src.path);
          impactedFiles.push(src);
        }
      }

      return {
        rootNode: root,
        maxHops,
        descendantIds: [...childTree],
        upstreamDependents: [...upstream.entries()].map(([id, hop]) => ({
          id,
          hop,
          node: nodes.get(id),
        })),
        downstreamDependencies: [...downstream.entries()].map(([id, hop]) => ({
          id,
          hop,
          node: nodes.get(id),
        })),
        impactedEdgeIds: [...impactedEdgeIds],
        impactedSourceFiles: impactedFiles,
      };
    }

    case "tux_find_shortest_path": {
      const fromNodeId = String(args.fromNodeId || "").trim();
      const toNodeId = String(args.toNodeId || "").trim();
      const { nodes, edges } = loadDefaultArchitectureGraph();
      if (!nodes.has(fromNodeId)) return { error: `Source node '${fromNodeId}' not found.` };
      if (!nodes.has(toNodeId)) return { error: `Target node '${toNodeId}' not found.` };
      if (fromNodeId === toNodeId) {
        return { found: true, hops: 0, nodePath: [nodes.get(fromNodeId)], edges: [] };
      }

      const queue = [fromNodeId];
      const prev = new Map();
      const visited = new Set([fromNodeId]);

      while (queue.length > 0) {
        const curr = queue.shift();
        if (curr === toNodeId) break;
        for (const e of edges) {
          const next = e.from === curr ? e.to : e.to === curr ? e.from : null;
          if (next && !visited.has(next)) {
            visited.add(next);
            prev.set(next, { prevId: curr, edge: e });
            queue.push(next);
          }
        }
      }

      if (!prev.has(toNodeId)) {
        return { found: false, hops: -1, nodePath: [], edges: [] };
      }

      const pathNodes = [];
      const pathEdges = [];
      let cursor = toNodeId;
      while (cursor) {
        const n = nodes.get(cursor);
        if (n) pathNodes.unshift(n);
        const step = prev.get(cursor);
        if (!step) break;
        pathEdges.unshift(step.edge);
        cursor = step.prevId;
      }

      return {
        found: true,
        hops: pathEdges.length,
        nodePath: pathNodes,
        edges: pathEdges,
      };
    }

    case "tux_acp_subgraph_lease": {
      const action = String(args.action || "list").toLowerCase();
      const now = Date.now();
      for (const [id, lease] of activeAcpLeases.entries()) {
        if (Date.parse(lease.expiresAt) <= now) activeAcpLeases.delete(id);
      }

      if (action === "list") {
        return {
          activeLeaseCount: activeAcpLeases.size,
          leases: [...activeAcpLeases.values()],
        };
      }

      if (action === "release") {
        let removed = false;
        for (const [k, v] of activeAcpLeases.entries()) {
          if (
            (args.agentId && v.agentId === args.agentId && (!args.rootNodeId || v.rootNodeId === args.rootNodeId)) ||
            (args.leaseId && k === args.leaseId)
          ) {
            activeAcpLeases.delete(k);
            removed = true;
          }
        }
        return {
          released: removed,
          activeLeaseCount: activeAcpLeases.size,
          leases: [...activeAcpLeases.values()],
        };
      }

      const agentId = String(args.agentId || "agent-anonymous");
      const rootNodeId = String(args.rootNodeId || "").trim();
      if (!rootNodeId) {
        return { acquired: false, error: "rootNodeId is required to acquire an ACP subgraph lease." };
      }

      const blast = callTuxMcpTool("tux_get_blast_radius", { nodeId: rootNodeId, maxHops: 1 });
      if (blast.error) return { acquired: false, error: blast.error };

      const requestedScope = new Set([rootNodeId, ...blast.descendantIds]);
      const { nodes } = loadDefaultArchitectureGraph();
      const requestedFiles = new Set();
      for (const id of requestedScope) {
        const p = nodes.get(id)?.source?.path;
        if (p) requestedFiles.add(p);
      }

      for (const existing of activeAcpLeases.values()) {
        if (existing.agentId === agentId) continue;
        const nodeOverlap = existing.scopeNodeIds.filter((id) => requestedScope.has(id));
        const fileOverlap = existing.lockedFiles.filter((f) => requestedFiles.has(f));
        if (nodeOverlap.length > 0 || fileOverlap.length > 0) {
          return {
            acquired: false,
            conflict: {
              heldByAgent: existing.agentId,
              leaseId: existing.leaseId,
              rootNodeId: existing.rootNodeId,
              overlappingNodes: nodeOverlap,
              overlappingFiles: fileOverlap,
            },
          };
        }
      }

      const ttlMs = (args.ttlSeconds ? Number(args.ttlSeconds) : 900) * 1000;
      const lease = {
        leaseId: `lease-${agentId}-${rootNodeId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        agentId,
        rootNodeId,
        scopeNodeIds: [...requestedScope],
        lockedFiles: [...requestedFiles],
        acquiredAt: new Date(now).toISOString(),
        expiresAt: new Date(now + ttlMs).toISOString(),
      };
      activeAcpLeases.set(lease.leaseId, lease);

      return {
        acquired: true,
        lease,
        activeLeaseCount: activeAcpLeases.size,
      };
    }

    default:
      throw new Error(`Unknown TUX MCP tool: ${name}`);
  }
}

export function readTuxMcpResource(uri) {
  switch (uri) {
    case "tux://catalog/components": {
      const payload = callTuxMcpTool("tux_list_components", {});
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
      const { nodes, edges } = loadDefaultArchitectureGraph();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                schema: "tux-c4-cpg-v1",
                levels: [1, 2, 3, 4, 5, 6],
                nodeCount: nodes.size,
                edgeCount: edges.length,
                nodes: [...nodes.values()],
                edges,
                activeAcpLeases: [...activeAcpLeases.values()],
              },
              null,
              2,
            ),
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

export function handleMcpRequest(req) {
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
        tools: TUX_MCP_TOOLS,
      },
    };
  }

  if (method === "tools/call") {
    try {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const payload = callTuxMcpTool(toolName, toolArgs);
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(payload, null, 2),
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
        resources: TUX_MCP_RESOURCES,
      },
    };
  }

  if (method === "resources/read") {
    try {
      const result = readTuxMcpResource(params?.uri);
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

// ── Dual-Mode Stdio Framing (Newline JSON-RPC + Content-Length Header) ──────
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  if (process.argv.includes("--list-tools")) {
    console.log(JSON.stringify(TUX_MCP_TOOLS, null, 2));
    process.exit(0);
  }

  const callIdx = process.argv.indexOf("--call");
  if (callIdx !== -1) {
    const toolName = process.argv[callIdx + 1];
    const rawArgs = process.argv[callIdx + 2] || "{}";
    const result = callTuxMcpTool(toolName, JSON.parse(rawArgs));
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  let buffer = Buffer.alloc(0);
  let useContentLengthFraming = false;

  function sendResponse(resObj) {
    if (!resObj) return;
    const json = JSON.stringify(resObj);
    if (useContentLengthFraming) {
      const byteLen = Buffer.byteLength(json, "utf8");
      process.stdout.write(`Content-Length: ${byteLen}\r\n\r\n${json}`);
    } else {
      process.stdout.write(`${json}\n`);
    }
  }

  process.stdin.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    while (buffer.length > 0) {
      const headerProbe = buffer.subarray(0, Math.min(buffer.length, 64)).toString("utf8");
      if (headerProbe.startsWith("Content-Length:")) {
        useContentLengthFraming = true;
        const sepIdx = buffer.indexOf("\r\n\r\n");
        if (sepIdx === -1) break;
        const headerStr = buffer.subarray(0, sepIdx).toString("utf8");
        const lenMatch = headerStr.match(/Content-Length:\s*(\d+)/i);
        const contentLen = lenMatch ? Number.parseInt(lenMatch[1], 10) : 0;
        const totalNeeded = sepIdx + 4 + contentLen;
        if (buffer.length < totalNeeded) break;
        const bodyStr = buffer.subarray(sepIdx + 4, totalNeeded).toString("utf8");
        buffer = buffer.subarray(totalNeeded);
        try {
          sendResponse(handleMcpRequest(JSON.parse(bodyStr)));
        } catch {
          sendResponse({
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: "Parse error" },
          });
        }
      } else {
        const nlIdx = buffer.indexOf("\n");
        if (nlIdx === -1) break;
        const lineStr = buffer.subarray(0, nlIdx).toString("utf8").trim();
        buffer = buffer.subarray(nlIdx + 1);
        if (!lineStr) continue;
        try {
          sendResponse(handleMcpRequest(JSON.parse(lineStr)));
        } catch {
          sendResponse({
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: "Parse error" },
          });
        }
      }
    }
  });
}
