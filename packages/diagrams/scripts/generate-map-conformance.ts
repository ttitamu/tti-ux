#!/usr/bin/env node
/**
 * Deterministic generator and verifier for `packages/diagrams/tests/fixtures/map-conformance.json`
 * (`schemaVersion: "1.0.0"`, `tti/tti-ux#110` / `nis/forgejo-stack#712`).
 *
 * Usage:
 *   node packages/diagrams/scripts/generate-map-conformance.ts
 *   node packages/diagrams/scripts/generate-map-conformance.ts --check
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildMapParentIndex,
  buildUnifiedArchitectureGraph,
  computeGraphDelta,
  computeLinkBlastRadius,
  extractModelLinks,
  hasOwn,
  levelForFocus,
  queryArchitectureLayer,
  type TuxMapBlastIntent,
  type TuxMapLevelModel,
} from "../app/utils/tuxArchitectureMap.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(HERE, "../tests/fixtures/map-conformance.json");

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    throw new Error(`generate-map-conformance invariant failed: ${msg}`);
  }
}

const code7Level: TuxMapLevelModel = {
  level1: {
    elements: [
      { id: "actor-buyer", kind: "person", name: "Buyer" },
      { id: "sys-shop", kind: "system", name: "Commerce Platform", zoom: 2 },
    ],
    rels: [{ from: "actor-buyer", to: "sys-shop", label: "Places orders" }],
  },
  level2: {
    boundary: "sys-shop",
    elements: [
      { id: "actor-buyer", ref: true },
      { id: "c-api", kind: "container", name: "Orders API", deployed: ["vm-api-1"] },
      { id: "c-web", kind: "container", name: "Storefront UI", deployed: ["vm-web-1"] },
      { id: "c-worker", kind: "container", name: "Sync Worker", deployed: ["vm-worker-1"] },
    ],
    rels: [{ from: "c-web", to: "c-api", label: "Calls REST" }],
  },
  level3: {
    "c-api": [
      { id: "c-api/routes", kind: "component", name: "Order Routes" },
      { id: "c-api/core", kind: "component", name: "Auth Core" },
    ],
    "c-web": [{ id: "c-web/ui", kind: "component", name: "Client App" }],
    "c-worker": [{ id: "c-worker/jobs", kind: "component", name: "Worker & Verification" }],
  },
  level4: {
    groups: [{ id: "rg-prod", zone: "cloud-prod", title: "rg-prod" }],
    nodes: [
      { id: "vm-api-1", group: "rg-prod", kind: "vm", title: "vm-api-1", role: "API host", hosts: ["c-api"] },
      { id: "vm-web-1", group: "rg-prod", kind: "vm", title: "vm-web-1", role: "Web host", hosts: ["c-web"] },
      { id: "vm-worker-1", group: "rg-prod", kind: "vm", title: "vm-worker-1", role: "Worker host", hosts: ["c-worker"] },
    ],
    links: [{ from: "vm-web-1", to: "vm-api-1", label: "HTTPS 443", kind: "traffic", state: "now" }],
  },
  subgraphs: {
    "f:core/auth.py": {
      stratum: "Functions and classes",
      elements: [
        {
          id: "s:core/auth.py#verify_token",
          kind: "symbol",
          name: "verify_token()",
          tech: "function",
          source: {
            path: "core/auth.py",
            lineRange: [10, 26],
            symbol: "verify_token",
            signature: "def verify_token(tok: str) -> bool",
            hash: "aa11bb22cc33dd44ee55ff6600112233",
          },
        },
        {
          id: "s:core/auth.py#TokenClaims",
          kind: "symbol",
          name: "TokenClaims",
          tech: "class",
          source: {
            path: "core/auth.py",
            lineRange: [30, 45],
            symbol: "TokenClaims",
            signature: "class TokenClaims",
            hash: "dd44ee55ff6600112233445566778899",
          },
        },
      ],
    },
    "f:routes/orders.py": {
      stratum: "Functions and classes",
      elements: [
        {
          id: "s:routes/orders.py#create_order",
          kind: "symbol",
          name: "create_order()",
          tech: "POST /v1/orders",
          source: {
            path: "routes/orders.py",
            lineRange: [12, 48],
            symbol: "create_order",
            signature: "def create_order(req)",
            hash: "11223344556677889900aabbccddeeff",
          },
        },
        {
          id: "s:routes/orders.py#list_orders",
          kind: "symbol",
          name: "list_orders()",
          tech: "GET /v1/orders",
          source: {
            path: "routes/orders.py",
            lineRange: [52, 74],
            symbol: "list_orders",
            signature: "def list_orders(limit: int)",
            hash: "778899aabbccddeeff00112233445566",
          },
        },
      ],
    },
    "d:c-api/core:core": {
      stratum: "Files",
      elements: [
        {
          id: "f:core/auth.py",
          kind: "module",
          name: "auth.py",
          tech: "Python",
          source: {
            path: "core/auth.py",
            hash: "f_auth_v1_0000000000000000000000",
            moduleHash: "m_auth_v1_0000000000000000000000",
          },
        },
      ],
    },
    "d:c-api/routes:routes": {
      stratum: "Files",
      elements: [
        {
          id: "f:routes/orders.py",
          kind: "module",
          name: "orders.py",
          tech: "Python",
          source: {
            path: "routes/orders.py",
            hash: "f_orders_v1_00000000000000000000",
            moduleHash: "m_orders_v1_00000000000000000000",
          },
        },
      ],
    },
    "c-api/core": {
      stratum: "Folders",
      elements: [{ id: "d:c-api/core:core", kind: "module", name: "core/", tech: "folder · 1 file" }],
    },
    "c-api/routes": {
      stratum: "Folders",
      elements: [{ id: "d:c-api/routes:routes", kind: "module", name: "routes/", tech: "folder · 1 file" }],
    },
    "c-web/ui": {
      stratum: "Files",
      elements: [
        { id: "f:web/app.ts", kind: "module", name: "app.ts", tech: "TypeScript", source: { path: "web/app.ts", hash: "f_app_v1" } },
        { id: "f:web/types.ts", kind: "module", name: "types.ts", tech: "TypeScript", source: { path: "web/types.ts", hash: "f_types_v1" } },
        { id: "f:web/dist/bundle.js", kind: "module", name: "bundle.js", tech: "JavaScript", source: { path: "web/dist/bundle.js", hash: "f_bundle_v1" } },
      ],
    },
    "c-worker/jobs": {
      stratum: "Files",
      elements: [
        { id: "f:worker/sync.py", kind: "module", name: "sync.py", tech: "Python", source: { path: "worker/sync.py", hash: "f_sync_v1" } },
        { id: "f:tests/test_auth_only.py", kind: "module", name: "test_auth_only.py", tech: "Python", source: { path: "tests/test_auth_only.py", hash: "f_tauth_v1" } },
        { id: "f:tests/test_orders.py", kind: "module", name: "test_orders.py", tech: "Python", source: { path: "tests/test_orders.py", hash: "f_tord_v1" } },
        { id: "f:ci/build.sh", kind: "module", name: "build.sh", tech: "Shell", source: { path: "ci/build.sh", hash: "f_build_v1" } },
        { id: "f:docs/auth.md", kind: "module", name: "auth.md", tech: "Markdown", source: { path: "docs/auth.md", hash: "f_dauth_v1" } },
        { id: "f:docs/orders.md", kind: "module", name: "orders.md", tech: "Markdown", source: { path: "docs/orders.md", hash: "f_dord_v1" } },
      ],
    },
  },
  links: [
    {
      from: "s:routes/orders.py#create_order",
      to: "s:core/auth.py#verify_token",
      kind: "calls",
      coupling: "runtime",
      phase: "prod-runtime",
      at: "routes/orders.py:18",
      sites: [18, 42],
    },
    {
      from: "f:web/app.ts",
      to: "s:routes/orders.py#create_order",
      kind: "calls",
      coupling: "runtime",
      phase: "client-bundle",
      at: "web/app.ts:9",
      sites: [9],
    },
    {
      from: "f:web/types.ts",
      to: "s:core/auth.py#verify_token",
      kind: "imports",
      coupling: "type-only",
      phase: "client-bundle",
      at: "web/types.ts:2",
      sites: [2],
    },
    {
      from: "f:worker/sync.py",
      to: "f:web/types.ts",
      kind: "imports",
      coupling: "type-only",
      phase: "prod-runtime",
      at: "worker/sync.py:4",
      sites: [4],
    },
    {
      from: "f:web/dist/bundle.js",
      to: "f:web/app.ts",
      kind: "stamps",
      stop: true,
      coupling: "artifact-stamp",
      phase: "client-bundle",
      at: "web/check-fresh.py:12",
      sites: [12],
    },
    {
      from: "f:ci/build.sh",
      to: "s:core/auth.py#verify_token",
      kind: "runs",
      stop: true,
      coupling: "build-exec",
      phase: "build-exec",
      at: "ci/build.sh:7",
      sites: [7],
    },
    {
      from: "f:tests/test_auth_only.py",
      to: "s:core/auth.py#verify_token",
      kind: "tests",
      stop: true,
      coupling: "verification",
      phase: "ci-test",
      at: "tests/test_auth_only.py:11",
      sites: [11],
    },
    {
      from: "f:tests/test_orders.py",
      to: "s:routes/orders.py#create_order",
      kind: "tests",
      stop: true,
      coupling: "verification",
      phase: "ci-test",
      at: "tests/test_orders.py:15",
      sites: [15],
    },
    {
      from: "f:tests/test_orders.py",
      to: "s:routes/orders.py#list_orders",
      kind: "tests",
      stop: true,
      coupling: "verification",
      phase: "ci-test",
      at: "tests/test_orders.py:29",
      sites: [29],
    },
    {
      from: "f:docs/auth.md",
      to: "s:core/auth.py#verify_token",
      kind: "mentions",
      stop: true,
      coupling: "prose",
      phase: "doc-only",
      at: "docs/auth.md:3",
      sites: [3],
    },
    {
      from: "f:docs/orders.md",
      to: "s:routes/orders.py#create_order",
      kind: "mentions",
      stop: true,
      coupling: "prose",
      phase: "doc-only",
      at: "docs/orders.md:8",
      sites: [8],
    },
  ],
};

const c4RelsOnly: TuxMapLevelModel = {
  level1: {
    elements: [
      { id: "p-analyst", kind: "person", name: "Analyst" },
      { id: "sys-core", kind: "system", name: "Core System", zoom: 2 },
    ],
    rels: [{ from: "p-analyst", to: "sys-core", label: "Queries" }],
  },
  level2: {
    boundary: "sys-core",
    elements: [
      { id: "p-analyst", ref: true },
      { id: "c-gateway", kind: "container", name: "Gateway" },
      { id: "c-service", kind: "container", name: "Service" },
      { id: "c-store", kind: "database", name: "Store" },
      { id: "c-future", kind: "container", name: "Future Exporter", status: "planned" },
    ],
    rels: [
      { from: "p-analyst", to: "c-gateway", label: "HTTPS" },
      { from: "c-gateway", to: "c-service", label: "RPC" },
      { from: "c-service", to: "c-store", label: "SQL" },
      { from: "c-future", to: "c-store", label: "Planned read", status: "planned" },
    ],
  },
  level3: {
    "c-service": [
      { id: "c-service/ingest", kind: "component", name: "Ingest", next: 1 },
      { id: "c-service/validate", kind: "component", name: "Validate" },
    ],
  },
  level4: { groups: [], nodes: [], links: [] },
};

const duplicateIds: TuxMapLevelModel = {
  level1: {
    elements: [{ id: "sys-dup", kind: "system", name: "Dup System" }],
    rels: [],
  },
  level2: {
    boundary: "sys-dup",
    elements: [
      { id: "c-a", kind: "container", name: "Container A" },
      { id: "c-b", kind: "container", name: "Container B" },
    ],
    rels: [],
  },
  level3: {
    "c-a": [{ id: "c-a/comp", kind: "component", name: "Comp A" }],
    "c-b": [{ id: "c-b/comp", kind: "component", name: "Comp B" }],
  },
  level4: { groups: [], nodes: [], links: [] },
  subgraphs: {
    "c-a/comp": {
      elements: [{ id: "f:shared.py", kind: "module", name: "shared.py (first)" }],
    },
    "c-b/comp": {
      elements: [
        { id: "f:shared.py", kind: "module", name: "shared.py (duplicate)" },
        { id: "f:caller.py", kind: "module", name: "caller.py" },
      ],
    },
  },
  links: [
    { from: "f:caller.py", to: "f:shared.py", kind: "mentions", stop: true, at: "caller.py:1" },
    { from: "f:caller.py", to: "f:shared.py", kind: "uses", stop: true, at: "caller.py:8" },
    { from: "f:caller.py", to: "f:shared.py", kind: "tests", stop: true, at: "caller.py:12" },
  ],
};

const longChain: TuxMapLevelModel = {
  level1: { elements: [{ id: "sys-chain", kind: "system", name: "Chain" }], rels: [] },
  level2: {
    boundary: "sys-chain",
    elements: [{ id: "c-chain", kind: "container", name: "Chain" }],
    rels: [],
  },
  level3: { "c-chain": [{ id: "c-chain/0", kind: "component", name: "Chain Comp" }] },
  level4: { groups: [], nodes: [], links: [] },
  subgraphs: {
    "c-chain/0": {
      elements: Array.from({ length: 101 }, (_, i) => ({
        id: `f:n${i}.py`,
        kind: "module" as const,
        name: `n${i}.py`,
      })),
    },
  },
  links: Array.from({ length: 100 }, (_, i) => ({
    from: `f:n${i + 1}.py`,
    to: `f:n${i}.py`,
    kind: "imports",
    at: `n${i + 1}.py:1`,
  })),
};

// Model exercising all 11 link kinds (implicit coupling/phase), anti-spoofing,
// negative coCutCandidates traps, stop-diamond at maxHops, and phase-gated hostsImpacted.
const all11KindsAndAdversarial: TuxMapLevelModel = {
  level1: {
    elements: [{ id: "sys-sec", kind: "system", name: "Quarantine Stack", zoom: 2 }],
    rels: [],
  },
  level2: {
    boundary: "sys-sec",
    elements: [
      { id: "c-edge", kind: "container", name: "Edge Proxy", deployed: ["vm-edge"] },
      { id: "c-app", kind: "container", name: "Backend App", deployed: ["vm-app"] },
      { id: "c-ci", kind: "container", name: "CI & Tooling", deployed: ["vm-ci"] },
    ],
    rels: [],
  },
  level3: {
    "c-edge": [{ id: "c-edge/proxy", kind: "component", name: "Proxy Config" }],
    "c-app": [{ id: "c-app/lib", kind: "component", name: "Core Lib" }],
    "c-ci": [{ id: "c-ci/verify", kind: "component", name: "Verification & Docs" }],
  },
  level4: {
    groups: [{ id: "rg-sec", zone: "cloud-prod", title: "rg-sec" }],
    nodes: [
      { id: "vm-edge", group: "rg-sec", kind: "vm", title: "vm-edge", role: "Edge VM", hosts: ["c-edge"] },
      { id: "vm-app", group: "rg-sec", kind: "vm", title: "vm-app", role: "App VM", hosts: ["c-app"] },
      { id: "vm-ci", group: "rg-sec", kind: "vm", title: "vm-ci", role: "CI VM", hosts: ["c-ci"] },
    ],
    links: [],
  },
  subgraphs: {
    "c-edge/proxy": {
      elements: [
        { id: "f:deploy/Caddyfile", kind: "module", name: "Caddyfile", source: { path: "deploy/Caddyfile" } },
        { id: "f:branding/index.html", kind: "module", name: "index.html", source: { path: "branding/index.html" } },
      ],
    },
    "c-app/lib": {
      elements: [
        { id: "f:lib/target.py", kind: "module", name: "target.py", source: { path: "lib/target.py" } },
        { id: "f:lib/other.py", kind: "module", name: "other.py", source: { path: "lib/other.py" } },
        { id: "f:lib/shell_helper.sh", kind: "module", name: "shell_helper.sh", source: { path: "lib/shell_helper.sh" } },
        { id: "f:lib/spoof_caller.py", kind: "module", name: "spoof_caller.py", source: { path: "lib/spoof_caller.py" } },
        { id: "f:lib/spoof_runner.sh", kind: "module", name: "spoof_runner.sh", source: { path: "lib/spoof_runner.sh" } },
        { id: "f:lib/config_user.py", kind: "module", name: "config_user.py", source: { path: "lib/config_user.py" } },
        { id: "f:ops/ci-queue.sh", kind: "module", name: "ci-queue.sh", tech: "Shell", source: { path: "ops/ci-queue.sh" } },
        { id: "f:ops/runner.sh", kind: "module", name: "runner.sh", tech: "Shell", source: { path: "ops/runner.sh" } },
      ],
    },
    "c-ci/verify": {
      elements: [
        { id: "f:tests/test_target_only.py", kind: "module", name: "test_target_only.py", source: { path: "tests/test_target_only.py" } },
        { id: "f:tests/test_diamond.py", kind: "module", name: "test_diamond.py", source: { path: "tests/test_diamond.py" } },
        { id: "f:tests/test_shared.py", kind: "module", name: "test_shared.py", source: { path: "tests/test_shared.py" } },
        { id: "f:.forgejo/workflows/ci.yml", kind: "module", name: "ci.yml", source: { path: ".forgejo/workflows/ci.yml" } },
        { id: "f:branding/dist/app.js", kind: "module", name: "app.js", source: { path: "branding/dist/app.js" } },
        { id: "f:docs/target_guide.md", kind: "module", name: "target_guide.md", tech: "Markdown", source: { path: "docs/target_guide.md" } },
        { id: "f:docs/design.md", kind: "module", name: "design.md", tech: "Markdown", source: { path: "docs/design.md" } },
      ],
    },
    "f:tests/test_shared.py": {
      elements: [
        { id: "s:tests/test_shared.py#test_other", kind: "symbol", name: "test_other()", source: { path: "tests/test_shared.py" } },
      ],
    },
  },
  links: [
    // Implicit coupling/phase across routes, loads, sources, checks, stamps, uses, tests, mentions
    { from: "f:deploy/Caddyfile", to: "f:lib/target.py", kind: "routes", stop: true, at: "deploy/Caddyfile:14" },
    { from: "f:branding/index.html", to: "f:lib/target.py", kind: "loads", stop: true, at: "branding/index.html:8" },
    { from: "f:lib/shell_helper.sh", to: "f:lib/target.py", kind: "sources", at: "lib/shell_helper.sh:3" },
    { from: "f:lib/config_user.py", to: "f:lib/target.py", kind: "uses", stop: true, at: "lib/config_user.py:5" },
    { from: "f:.forgejo/workflows/ci.yml", to: "f:lib/target.py", kind: "checks", stop: true, at: ".forgejo/workflows/ci.yml:22" },
    { from: "f:branding/dist/app.js", to: "f:lib/target.py", kind: "stamps", stop: true, at: "ops/check-fresh.py:19" },
    { from: "f:tests/test_target_only.py", to: "f:lib/target.py", kind: "tests", stop: true, at: "tests/test_target_only.py:6" },
    // Diamond stop edge: test_diamond.py directly tests target.py (hop 1) AND shell_helper.sh (hop 1 spread) -> not truncated at maxHops=1, and NOT co-cut because it also tests shell_helper.sh!
    { from: "f:tests/test_diamond.py", to: "f:lib/target.py", kind: "tests", stop: true, at: "tests/test_diamond.py:6" },
    { from: "f:tests/test_diamond.py", to: "f:lib/shell_helper.sh", kind: "tests", stop: true, at: "tests/test_diamond.py:12" },
    // Multi-target test file: file tests target.py, child symbol calls other.py -> NEVER co-cut!
    { from: "f:tests/test_shared.py", to: "f:lib/target.py", kind: "tests", stop: true, at: "tests/test_shared.py:4" },
    { from: "s:tests/test_shared.py#test_other", to: "f:lib/other.py", kind: "calls", at: "tests/test_shared.py:18" },
    // Pure doc exclusively mentioning target.py -> CAN co-cut
    { from: "f:docs/target_guide.md", to: "f:lib/target.py", kind: "mentions", stop: true, at: "docs/target_guide.md:2" },
    // Live production script mentioning a design doc while sourced by runner.sh -> NEVER co-cut when cutting design.md!
    { from: "f:ops/ci-queue.sh", to: "f:docs/design.md", kind: "mentions", stop: true, at: "ops/ci-queue.sh:4" },
    { from: "f:ops/runner.sh", to: "f:ops/ci-queue.sh", kind: "sources", at: "ops/runner.sh:9" },
    // Spoofed coupling/phase on runtime link kinds -> rejected by inferLinkCoupling / inferLinkPhase (S-03c)
    {
      from: "f:lib/spoof_caller.py",
      to: "f:lib/target.py",
      kind: "calls",
      coupling: "type-only",
      at: "lib/spoof_caller.py:11",
    },
    {
      from: "f:lib/spoof_runner.sh",
      to: "f:lib/target.py",
      kind: "runs",
      coupling: "prose",
      phase: "doc-only",
      at: "lib/spoof_runner.sh:7",
    },
  ],
};

// Hybrid C4+links model + Object.prototype "constructor" key + subgraphRef + 2-node d: cycle + astral Unicode + empty kind.
const hybridC4AndEdgeCases: TuxMapLevelModel = {
  level1: {
    elements: [{ id: "sys-hyb", kind: "system", name: "Hybrid System", zoom: 2 }],
    rels: [],
  },
  level2: {
    boundary: "sys-hyb",
    elements: [
      { id: "constructor", kind: "container", name: "Constructor Service", deployed: ["vm-app"] },
      { id: "c-empty-l3", kind: "container", name: "Direct Fractal Container" },
    ],
    rels: [],
  },
  level3: {
    constructor: [
      {
        id: "constructor/api",
        kind: "component",
        name: "API Component",
        subgraphRef: "sg-aliased-api",
      },
    ],
    "c-empty-l3": [],
  },
  level4: {
    groups: [{ id: "rg-hyb", zone: "cloud-prod", title: "rg-hyb" }],
    nodes: [
      { id: "vm-app", group: "rg-hyb", kind: "vm", title: "vm-app", role: "App host", hosts: ["constructor"] },
      { id: "kv-secrets", group: "rg-hyb", kind: "keyvault", title: "kv-secrets", role: "Vault" },
      { id: "kv-future", group: "rg-hyb", kind: "keyvault", title: "kv-future", role: "Planned Vault", status: "planned" },
    ],
    links: [
      { from: "vm-app", to: "kv-secrets", label: "Reads secrets", kind: "secret", state: "now" },
      { from: "vm-app", to: "kv-future", label: "Planned vault", kind: "secret", state: "planned" },
    ],
  },
  subgraphs: {
    constructor: {
      elements: [{ id: "f:shadow_ignored.py", kind: "module", name: "shadow_ignored.py" }],
    },
    "c-empty-l3": {
      elements: [{ id: "f:direct_l5.py", kind: "module", name: "direct_l5.py" }],
    },
    "sg-aliased-api": {
      elements: [
        { id: "f:api/handler.py", kind: "module", name: "handler.py", source: { path: "api/handler.py", lineRange: [] as unknown as [number, number] } },
        { id: "f:api/\ufffd.py", kind: "module", name: "bmp_high.py" },
        { id: "f:api/\u{1F680}.py", kind: "module", name: "astral_rocket.py" },
      ],
    },
    "d:cyc/a": {
      elements: [{ id: "d:cyc/b", kind: "module", name: "b/" }],
    },
    "d:cyc/b": {
      elements: [{ id: "d:cyc/a", kind: "module", name: "a/" }],
    },
  },
  links: [
    { from: "f:api/\ufffd.py", to: "f:api/handler.py", kind: "" as "uses", at: "api/\ufffd.py:1" },
    { from: "f:api/\u{1F680}.py", to: "f:api/handler.py", kind: "uses", at: "api/\u{1F680}.py:1" },
  ],
};

const models: Record<string, TuxMapLevelModel> = {
  code_7level: code7Level,
  c4_rels_only: c4RelsOnly,
  duplicate_ids: duplicateIds,
  long_chain: longChain,
  all_11_kinds_and_adversarial: all11KindsAndAdversarial,
  hybrid_c4_and_edge_cases: hybridC4AndEdgeCases,
};

function buildLevelCheck(spec: {
  id: string;
  model: string;
  nodeIds: string[];
  includeLevel7Ids?: boolean;
  focusIds?: string[];
  parentCheckIds?: string[];
}) {
  const m = models[spec.model]!;
  const cpg = buildUnifiedArchitectureGraph(m);
  const parentOf = buildMapParentIndex(m);
  const expectedLevels: Record<string, number> = {};
  for (const nid of spec.nodeIds) {
    const lvl = cpg.nodes.get(nid)?.level;
    assert(lvl !== undefined, `${spec.id}: missing node ${nid}`);
    expectedLevels[nid] = lvl;
  }
  const out: Record<string, unknown> = {
    id: spec.id,
    model: spec.model,
    expectedLevels,
  };
  if (spec.includeLevel7Ids) {
    out.expectedLevel7Ids = queryArchitectureLayer(m, { level: 7 })
      .nodes.map((n) => n.id)
      .sort();
  }
  if (spec.focusIds) {
    const expectedFocusLevels: Record<string, number> = {};
    for (const fid of spec.focusIds) {
      expectedFocusLevels[fid] = levelForFocus(fid, m, parentOf);
    }
    out.expectedFocusLevels = expectedFocusLevels;
  }
  if (spec.parentCheckIds) {
    const expectedParent: Record<string, string> = {};
    for (const cid of spec.parentCheckIds) {
      const pid = parentOf.get(cid);
      assert(pid !== undefined, `${spec.id}: missing parent for ${cid}`);
      expectedParent[cid] = pid;
    }
    out.expectedParent = expectedParent;
  }
  return out;
}

interface BlastCaseSpec {
  id: string;
  model: string;
  useExtractedModelLinks?: boolean;
  seeds: string[];
  opts: {
    maxHops?: number;
    quietSeedOnly?: boolean;
    kinds?: string[];
    intent?: TuxMapBlastIntent;
  };
  summaryOnly?: boolean;
  includeFields?: Array<
    "blockers" | "coCutCandidates" | "testsToRun" | "stampsToRebuild" | "buildExecImpacted" | "hostsImpacted"
  >;
}

function buildBlastCase(spec: BlastCaseSpec) {
  const m = models[spec.model]!;
  const parentOf = buildMapParentIndex(m);
  const links = spec.useExtractedModelLinks ? extractModelLinks(m) : m.links ?? [];
  const res = computeLinkBlastRadius(links, spec.seeds, parentOf, {
    ...spec.opts,
    model: m,
  });
  const hits = [...res.hits.entries()].map(([id, h]) => ({
    id,
    hop: h.hop,
    ...(h.via.kind !== undefined ? { kind: h.via.kind } : {}),
    ...(h.at !== undefined ? { at: h.at } : {}),
    ...(h.sites !== undefined ? { sites: h.sites } : {}),
  }));
  const expected: Record<string, unknown> = {
    truncated: res.truncated,
  };
  if (spec.summaryOnly) {
    expected.hitCount = hits.length;
    if (hits.length > 0) {
      expected.firstHit = { id: hits[0]!.id, hop: hits[0]!.hop };
      expected.lastHit = { id: hits[hits.length - 1]!.id, hop: hits[hits.length - 1]!.hop };
    }
  } else {
    expected.hits = hits;
  }
  for (const field of spec.includeFields ?? []) {
    expected[field] = res[field];
  }
  return {
    id: spec.id,
    model: spec.model,
    ...(spec.useExtractedModelLinks ? { useExtractedModelLinks: true } : {}),
    seeds: spec.seeds,
    opts: spec.opts,
    expected,
  };
}

// --- Delta Cases ---

// Case 1: Original branch delta case (patch + sig-change + move + add + delete + dangling wire)
const delta1Head: TuxMapLevelModel = JSON.parse(JSON.stringify(code7Level));
delta1Head.subgraphs!["f:core/auth.py"]!.elements[0]!.source = {
  path: "core/auth.py",
  lineRange: [10, 31],
  symbol: "verify_token",
  signature: "def verify_token(tok: str) -> bool",
  hash: "aa11bb22cc33_patched_00000000000",
};
delta1Head.subgraphs!["f:core/auth.py"]!.elements[1]!.source!.lineRange = [35, 50];
delta1Head.subgraphs!["f:routes/orders.py"]!.elements[1]!.source = {
  path: "routes/orders.py",
  lineRange: [52, 74],
  symbol: "list_orders",
  signature: "def list_orders(limit: int, cursor: str = '')",
  hash: "778899aabbcc_sigchanged_00000000",
};
delta1Head.subgraphs!["d:c-api/core:core"]!.elements = [
  {
    id: "f:core/auth.py",
    kind: "module",
    name: "auth.py",
    tech: "Python",
    source: {
      path: "core/auth.py",
      hash: "f_auth_v2_0000000000000000000000",
      moduleHash: "m_auth_v1_0000000000000000000000",
    },
  },
  {
    id: "f:web/types.ts",
    kind: "module",
    name: "types.ts",
    tech: "TypeScript",
    source: { path: "web/types.ts", hash: "f_types_v1" },
  },
];
delta1Head.subgraphs!["d:c-api/routes:routes"]!.elements = [
  {
    id: "f:routes/orders.py",
    kind: "module",
    name: "orders.py",
    tech: "Python",
    source: {
      path: "routes/orders.py",
      hash: "f_orders_v2_00000000000000000000",
      moduleHash: "m_orders_v1_00000000000000000000",
    },
  },
  {
    id: "f:routes/refunds.py",
    kind: "module",
    name: "refunds.py",
    tech: "Python",
    source: { path: "routes/refunds.py", hash: "f_refunds_v1" },
  },
];
delta1Head.subgraphs!["c-web/ui"]!.elements = delta1Head.subgraphs!["c-web/ui"]!.elements.filter(
  (e) => e.id !== "f:web/types.ts",
);
delta1Head.subgraphs!["c-worker/jobs"]!.elements = delta1Head.subgraphs!["c-worker/jobs"]!.elements.filter(
  (e) => e.id !== "f:docs/auth.md",
);
delta1Head.links = [
  ...delta1Head.links!.filter((l) => l.from !== "f:docs/auth.md"),
  {
    from: "f:routes/refunds.py",
    to: "s:core/auth.py#verify_token",
    kind: "calls",
    coupling: "runtime",
    phase: "prod-runtime",
    at: "routes/refunds.py:6",
    sites: [6],
  },
  {
    from: "f:ci/build.sh",
    to: "f:docs/auth.md",
    kind: "uses",
    stop: true,
    at: "ci/build.sh:19",
    sites: [19],
  },
];

// Case 2: git mv / symbol move pairing across IDs -> moved (with previousId) & recommendedIntent: "refactor" (N-04 / G-03)
const renameBase: TuxMapLevelModel = {
  level1: { elements: [{ id: "sys-mv", kind: "system", name: "Move System" }], rels: [] },
  level2: {
    boundary: "sys-mv",
    elements: [{ id: "c-svc", kind: "container", name: "Service" }],
    rels: [],
  },
  level3: { "c-svc": [{ id: "c-svc/auth", kind: "component", name: "Auth" }] },
  level4: { groups: [], nodes: [], links: [] },
  subgraphs: {
    "c-svc/auth": {
      elements: [
        {
          id: "f:auth/old_token.py",
          kind: "module",
          name: "old_token.py",
          source: { path: "auth/old_token.py", hash: "deadbeefcafebabe0011223344556677" },
        },
      ],
    },
    "f:auth/old_token.py": {
      elements: [
        {
          id: "s:auth/old_token.py#check_jwt",
          kind: "symbol",
          name: "check_jwt()",
          source: {
            path: "auth/old_token.py",
            symbol: "check_jwt",
            signature: "def check_jwt(raw: str) -> dict",
            hash: "sym_body_edited_during_move_v1_00",
          },
        },
      ],
    },
  },
  links: [],
};

const renameHead: TuxMapLevelModel = {
  ...renameBase,
  subgraphs: {
    "c-svc/auth": {
      elements: [
        {
          id: "f:auth/new_token.py",
          kind: "module",
          name: "new_token.py",
          source: { path: "auth/new_token.py", hash: "deadbeefcafebabe0011223344556677" },
        },
      ],
    },
    "f:auth/new_token.py": {
      elements: [
        {
          id: "s:auth/new_token.py#check_jwt",
          kind: "symbol",
          name: "check_jwt()",
          source: {
            path: "auth/new_token.py",
            symbol: "check_jwt",
            signature: "def check_jwt(raw: str) -> dict",
            hash: "sym_body_edited_during_move_v2_99",
          },
        },
      ],
    },
  },
};

// Case 3: Concurrent moduleHash + child symbol patch keeps module seed, plus wire-change with identical hash (F-04 / G-02 / S-07)
const modHashBase: TuxMapLevelModel = {
  level1: { elements: [{ id: "sys-mh", kind: "system", name: "ModuleHash System" }], rels: [] },
  level2: {
    boundary: "sys-mh",
    elements: [{ id: "c-app", kind: "container", name: "App" }],
    rels: [],
  },
  level3: { "c-app": [{ id: "c-app/core", kind: "component", name: "Core" }] },
  level4: { groups: [], nodes: [], links: [] },
  subgraphs: {
    "c-app/core": {
      elements: [
        {
          id: "f:core/both_changed.py",
          kind: "module",
          name: "both_changed.py",
          source: {
            path: "core/both_changed.py",
            hash: "h_both_v1_0000000000000000000000",
            moduleHash: "mh_both_v1_000000000000000000000",
          },
        },
        {
          id: "f:core/wire_only.py",
          kind: "module",
          name: "wire_only.py",
          source: {
            path: "core/wire_only.py",
            hash: "h_same_0000000000000000000000000",
            moduleHash: "mh_same_000000000000000000000000",
          },
        },
      ],
    },
    "f:core/both_changed.py": {
      elements: [
        {
          id: "s:core/both_changed.py#helper",
          kind: "symbol",
          name: "helper()",
          source: {
            path: "core/both_changed.py",
            symbol: "helper",
            signature: "def helper()",
            hash: "s_helper_v1_00000000000000000000",
          },
        },
      ],
    },
  },
  links: [],
};

const modHashHead: TuxMapLevelModel = {
  ...modHashBase,
  subgraphs: {
    "c-app/core": {
      elements: [
        {
          id: "f:core/both_changed.py",
          kind: "module",
          name: "both_changed.py",
          source: {
            path: "core/both_changed.py",
            hash: "h_both_v2_0000000000000000000000",
            moduleHash: "mh_both_v2_top_const_edited_0000",
          },
        },
        {
          id: "f:core/wire_only.py",
          kind: "module",
          name: "wire_only.py",
          source: {
            path: "core/wire_only.py",
            hash: "h_same_0000000000000000000000000",
            moduleHash: "mh_same_000000000000000000000000",
          },
        },
      ],
    },
    "f:core/both_changed.py": {
      elements: [
        {
          id: "s:core/both_changed.py#helper",
          kind: "symbol",
          name: "helper()",
          source: {
            path: "core/both_changed.py",
            symbol: "helper",
            signature: "def helper()",
            hash: "s_helper_v2_00000000000000000000",
          },
        },
      ],
    },
  },
  links: [
    {
      from: "f:core/wire_only.py",
      to: "s:core/both_changed.py#helper",
      kind: "calls",
      at: "core/wire_only.py:4:9é",
    },
  ],
};

// Case 4: All 5 ghost origins (L1, L2, L3, L4, inline children without synthesizing subgraphs[parentId]) + collapsed d: folder + L2 ref non-dangling (F-05, F-12)
const ghostsBase: TuxMapLevelModel = {
  level1: {
    elements: [
      { id: "p-ops", kind: "person", name: "Ops" },
      { id: "x-legacy-idp", kind: "external", name: "Legacy IdP" },
      { id: "sys-core", kind: "system", name: "Core", zoom: 2 },
    ],
    rels: [],
  },
  level2: {
    boundary: "sys-core",
    elements: [
      { id: "p-ops", ref: true },
      { id: "c-keep", kind: "container", name: "Keep Container" },
      { id: "c-legacy-worker", kind: "container", name: "Legacy Worker" },
    ],
    rels: [],
  },
  level3: {
    "c-keep": [
      {
        id: "c-keep/inline-parent",
        kind: "component",
        name: "Inline Parent",
        children: [
          { id: "in-surviving", kind: "module", name: "in-surviving", source: { path: "in/surviving.ts", hash: "in_v1" } },
          { id: "in-deleted", kind: "module", name: "in-deleted", source: { path: "in/deleted.ts", hash: "in_del" } },
        ],
      },
      { id: "c-keep/collapsed", kind: "component", name: "Collapsed Folder Comp" },
      { id: "c-keep/old-comp", kind: "component", name: "Old Component" },
    ],
  },
  level4: {
    groups: [{ id: "rg-1", zone: "cloud-prod", title: "rg-1" }],
    nodes: [
      {
        id: "vm-keep",
        group: "rg-1",
        kind: "vm",
        title: "vm-keep",
        role: "Main VM",
        children: [{ id: "vm-keep/unit-a", kind: "module", name: "unit-a.service", source: { path: "ops/unit-a.service", hash: "u_v1" } }],
      },
      { id: "vm-decommissioned", group: "rg-1", kind: "vm", title: "vm-decommissioned", role: "Old VM" },
    ],
    links: [],
  },
  subgraphs: {
    "c-keep/collapsed": {
      stratum: "Folders",
      elements: [
        { id: "d:c-keep/collapsed:a", kind: "module", name: "a/" },
        { id: "d:c-keep/collapsed:b", kind: "module", name: "b/" },
      ],
    },
    "d:c-keep/collapsed:a": {
      elements: [{ id: "f:a/keep.py", kind: "module", name: "keep.py", source: { path: "a/keep.py", hash: "ak_1" } }],
    },
    "d:c-keep/collapsed:b": {
      elements: [{ id: "f:b/removed.py", kind: "module", name: "removed.py", source: { path: "b/removed.py", hash: "br_1" } }],
    },
  },
  links: [],
};

const ghostsHead: TuxMapLevelModel = {
  level1: {
    elements: [
      { id: "p-ops", kind: "person", name: "Ops" },
      { id: "sys-core", kind: "system", name: "Core", zoom: 2 },
    ],
    rels: [],
  },
  level2: {
    boundary: "sys-core",
    elements: [
      { id: "p-ops", ref: true },
      { id: "c-keep", kind: "container", name: "Keep Container" },
    ],
    rels: [{ from: "p-ops", to: "c-keep", label: "Operates" }],
  },
  level3: {
    "c-keep": [
      {
        id: "c-keep/inline-parent",
        kind: "component",
        name: "Inline Parent",
        children: [
          { id: "in-surviving", kind: "module", name: "in-surviving", source: { path: "in/surviving.ts", hash: "in_v1" } },
        ],
      },
      { id: "c-keep/collapsed", kind: "component", name: "Collapsed Folder Comp" },
    ],
  },
  level4: {
    groups: [{ id: "rg-1", zone: "cloud-prod", title: "rg-1" }],
    nodes: [
      {
        id: "vm-keep",
        group: "rg-1",
        kind: "vm",
        title: "vm-keep",
        role: "Main VM",
        children: [{ id: "vm-keep/unit-a", kind: "module", name: "unit-a.service", source: { path: "ops/unit-a.service", hash: "u_v2" } }],
      },
    ],
    links: [],
  },
  subgraphs: {
    // Folder level collapsed away because only `a/keep.py` survived!
    "c-keep/collapsed": {
      stratum: "Files",
      elements: [{ id: "f:a/keep.py", kind: "module", name: "keep.py", source: { path: "a/keep.py", hash: "ak_1" } }],
    },
  },
  links: [{ from: "f:a/keep.py", to: "p-ops", kind: "uses", at: "a/keep.py:3" }],
};

interface GhostCheck {
  location: "level1" | "level2" | "level3" | "level4" | "subgraph" | "inline" | "l4-inline";
  parentId?: string;
  id: string;
  changeType: "added" | "modified" | "deleted";
}

function buildDeltaCase(spec: {
  id: string;
  baseModel: TuxMapLevelModel;
  headModel: TuxMapLevelModel;
  ghostChecks?: GhostCheck[];
  absentSubgraphKeys?: string[];
}) {
  const delta = computeGraphDelta(spec.baseModel, spec.headModel);
  const movedPairs = delta.nodeChanges
    .filter((c) => c.change === "moved" && c.previousId)
    .map((c) => ({ id: c.id, previousId: c.previousId! }));

  // Verify ghostChecks against mergedModel right here
  for (const gc of spec.ghostChecks ?? []) {
    let foundDiff: string | undefined;
    if (gc.location === "level1") {
      foundDiff = delta.mergedModel.level1.elements.find((e) => e.id === gc.id)?.diff?.changeType;
    } else if (gc.location === "level2") {
      foundDiff = delta.mergedModel.level2.elements.find((e) => !e.ref && e.id === gc.id)?.diff?.changeType;
    } else if (gc.location === "level3") {
      foundDiff = delta.mergedModel.level3[gc.parentId!]?.find((e) => e.id === gc.id)?.diff?.changeType;
    } else if (gc.location === "level4") {
      foundDiff = delta.mergedModel.level4.nodes.find((n) => n.id === gc.id)?.diff?.changeType;
    } else if (gc.location === "subgraph") {
      foundDiff = delta.mergedModel.subgraphs?.[gc.parentId!]?.elements.find((e) => e.id === gc.id)?.diff?.changeType;
    } else if (gc.location === "inline") {
      const parentEl = delta.mergedModel.level3["c-keep"]?.find((e) => e.id === gc.parentId);
      foundDiff = parentEl?.children?.find((c) => c.id === gc.id)?.diff?.changeType;
    } else if (gc.location === "l4-inline") {
      const parentNode = delta.mergedModel.level4.nodes.find((n) => n.id === gc.parentId);
      foundDiff = parentNode?.children?.find((c) => c.id === gc.id)?.diff?.changeType;
    }
    assert(
      foundDiff === gc.changeType,
      `${spec.id}: ghostCheck ${gc.location}/${gc.id} expected ${gc.changeType}, got ${String(foundDiff)}`,
    );
  }
  for (const k of spec.absentSubgraphKeys ?? []) {
    assert(
      !hasOwn(delta.mergedModel.subgraphs, k),
      `${spec.id}: expected subgraph key "${k}" to remain absent`,
    );
  }

  return {
    id: spec.id,
    baseModel: spec.baseModel,
    headModel: spec.headModel,
    expected: {
      addedIds: delta.addedIds,
      deletedIds: delta.deletedIds,
      movedIds: delta.movedIds,
      ...(movedPairs.length > 0 ? { movedPairs } : {}),
      sigChangedIds: delta.sigChangedIds,
      bodyPatchedIds: delta.bodyPatchedIds,
      blastSeedIds: delta.blastSeedIds,
      recommendedIntent: delta.recommendedIntent,
      addedWires: delta.addedWires.map((w) => ({ from: w.from, to: w.to, kind: w.kind })),
      removedWires: delta.removedWires.map((w) => ({ from: w.from, to: w.to, kind: w.kind })),
      danglingWires: delta.danglingWires.map((w) => ({ from: w.from, to: w.to, kind: w.kind })),
      ...(spec.ghostChecks ? { ghostChecks: spec.ghostChecks } : {}),
      ...(spec.absentSubgraphKeys ? { absentSubgraphKeys: spec.absentSubgraphKeys } : {}),
    },
  };
}

const levelChecks = [
  buildLevelCheck({
    id: "child_before_parent_levels",
    model: "code_7level",
    nodeIds: [
      "actor-buyer",
      "sys-shop",
      "c-api",
      "c-api/core",
      "vm-api-1",
      "d:c-api/core:core",
      "f:core/auth.py",
      "s:core/auth.py#verify_token",
      "s:routes/orders.py#create_order",
      "f:web/app.ts",
    ],
    includeLevel7Ids: true,
    focusIds: ["c-api", "c-api/core", "d:c-api/core:core", "f:core/auth.py"],
  }),
  buildLevelCheck({
    id: "duplicate_id_first_parent_wins",
    model: "duplicate_ids",
    nodeIds: ["f:shared.py", "f:caller.py"],
    parentCheckIds: ["f:shared.py"],
  }),
  buildLevelCheck({
    id: "level3_and_subgraph_coexistence_and_constructor_key",
    model: "hybrid_c4_and_edge_cases",
    nodeIds: ["constructor", "constructor/api", "f:api/handler.py", "f:direct_l5.py"],
    focusIds: ["constructor", "c-empty-l3", "constructor/api"],
    parentCheckIds: ["f:api/handler.py", "f:direct_l5.py"],
  }),
];

const blastCases = [
  buildBlastCase({
    id: "symbol_default_quiet_seed_only",
    model: "code_7level",
    seeds: ["s:core/auth.py#verify_token"],
    opts: {},
    includeFields: ["hostsImpacted"],
  }),
  buildBlastCase({
    id: "symbol_quiet_seed_only_false_includes_downstream_mentions",
    model: "code_7level",
    seeds: ["s:core/auth.py#verify_token"],
    opts: { quietSeedOnly: false },
  }),
  buildBlastCase({
    id: "intent_patch_skips_type_only_and_build_exec",
    model: "code_7level",
    seeds: ["s:core/auth.py#verify_token"],
    opts: { intent: "patch" },
    includeFields: ["hostsImpacted", "stampsToRebuild", "testsToRun"],
  }),
  buildBlastCase({
    id: "intent_refactor_propagates_through_type_only_imports",
    model: "code_7level",
    seeds: ["s:core/auth.py#verify_token"],
    opts: { intent: "refactor" },
    includeFields: ["blockers", "hostsImpacted", "stampsToRebuild", "testsToRun", "coCutCandidates"],
  }),
  buildBlastCase({
    id: "intent_cut_identifies_blockers_and_exclusive_co_cut_candidates",
    model: "code_7level",
    seeds: ["f:core/auth.py"],
    opts: { intent: "cut" },
    includeFields: ["blockers", "coCutCandidates", "testsToRun"],
  }),
  buildBlastCase({
    id: "intent_supply_chain_separates_runtime_stamps_and_build_exec",
    model: "code_7level",
    seeds: ["s:core/auth.py#verify_token"],
    opts: { intent: "supply-chain" },
    includeFields: ["buildExecImpacted", "stampsToRebuild", "hostsImpacted"],
  }),
  buildBlastCase({
    id: "container_seed_expands_descendants_only_never_internal_hits",
    model: "code_7level",
    seeds: ["c-api"],
    opts: {},
  }),
  buildBlastCase({
    id: "multi_seed_union",
    model: "code_7level",
    seeds: ["s:routes/orders.py#create_order", "f:web/types.ts"],
    opts: {},
  }),
  buildBlastCase({
    id: "c4_rels_excludes_planned_by_default",
    model: "c4_rels_only",
    useExtractedModelLinks: true,
    seeds: ["c-store"],
    opts: {},
  }),
  buildBlastCase({
    id: "duplicate_links_strongest_kind_wins_at_equal_hop",
    model: "duplicate_ids",
    seeds: ["f:shared.py"],
    opts: {},
  }),
  buildBlastCase({
    id: "chain_100_hops_truncates_at_default_32",
    model: "long_chain",
    seeds: ["f:n0.py"],
    opts: {},
    summaryOnly: true,
  }),
  buildBlastCase({
    id: "chain_100_hops_completes_when_max_hops_120",
    model: "long_chain",
    seeds: ["f:n0.py"],
    opts: { maxHops: 120 },
    summaryOnly: true,
  }),
  buildBlastCase({
    id: "all_11_kinds_cut_excludes_shared_tests_workflows_and_routes_from_cocut",
    model: "all_11_kinds_and_adversarial",
    seeds: ["f:lib/target.py"],
    opts: { intent: "cut" },
    includeFields: ["blockers", "coCutCandidates", "testsToRun", "stampsToRebuild", "hostsImpacted"],
  }),
  buildBlastCase({
    id: "cutting_doc_never_marks_live_prod_script_mentioning_it_as_cocut",
    model: "all_11_kinds_and_adversarial",
    seeds: ["f:docs/design.md"],
    opts: { intent: "cut" },
    includeFields: ["blockers", "coCutCandidates", "hostsImpacted"],
  }),
  buildBlastCase({
    id: "anti_spoofing_rejects_type_only_and_prose_on_runtime_calls_and_runs",
    model: "all_11_kinds_and_adversarial",
    seeds: ["f:lib/target.py"],
    opts: { intent: "supply-chain" },
    includeFields: ["blockers", "testsToRun", "stampsToRebuild", "hostsImpacted"],
  }),
  buildBlastCase({
    id: "stop_diamond_at_max_hops_1_is_not_falsely_truncated",
    model: "all_11_kinds_and_adversarial",
    seeds: ["f:lib/target.py"],
    opts: { maxHops: 1, intent: "patch" },
    includeFields: ["testsToRun", "stampsToRebuild"],
  }),
  buildBlastCase({
    id: "aux_test_seed_reports_zero_prod_hosts_impacted",
    model: "all_11_kinds_and_adversarial",
    seeds: ["f:tests/test_target_only.py"],
    opts: { intent: "patch" },
    includeFields: ["hostsImpacted"],
  }),
  buildBlastCase({
    id: "hybrid_model_bridges_uncovered_level4_vault_and_skips_planned",
    model: "hybrid_c4_and_edge_cases",
    useExtractedModelLinks: true,
    seeds: ["kv-secrets"],
    opts: {},
  }),
  buildBlastCase({
    id: "astral_unicode_codepoint_order_and_empty_kind_fallback",
    model: "hybrid_c4_and_edge_cases",
    seeds: ["f:api/handler.py"],
    opts: {},
  }),
];

const deltaCases = [
  buildDeltaCase({
    id: "branch_delta_patch_sig_move_add_cut_and_dangling_wire",
    baseModel: code7Level,
    headModel: delta1Head,
    ghostChecks: [
      { location: "subgraph", parentId: "c-worker/jobs", id: "f:docs/auth.md", changeType: "deleted" },
    ],
  }),
  buildDeltaCase({
    id: "rename_pairing_moved_previous_id_and_refactor_intent",
    baseModel: renameBase,
    headModel: renameHead,
    ghostChecks: [
      { location: "subgraph", parentId: "c-svc/auth", id: "f:auth/new_token.py", changeType: "modified" },
    ],
  }),
  buildDeltaCase({
    id: "concurrent_module_hash_and_symbol_patch_plus_wire_change",
    baseModel: modHashBase,
    headModel: modHashHead,
  }),
  buildDeltaCase({
    id: "merged_model_all_five_ghost_origins_and_collapsed_folder",
    baseModel: ghostsBase,
    headModel: ghostsHead,
    ghostChecks: [
      { location: "level1", id: "x-legacy-idp", changeType: "deleted" },
      { location: "level2", id: "c-legacy-worker", changeType: "deleted" },
      { location: "level3", parentId: "c-keep", id: "c-keep/old-comp", changeType: "deleted" },
      { location: "level4", id: "vm-decommissioned", changeType: "deleted" },
      { location: "inline", parentId: "c-keep/inline-parent", id: "in-deleted", changeType: "deleted" },
      { location: "l4-inline", parentId: "vm-keep", id: "vm-keep/unit-a", changeType: "modified" },
      { location: "subgraph", parentId: "c-keep/collapsed", id: "f:b/removed.py", changeType: "deleted" },
    ],
    absentSubgraphKeys: ["c-keep/inline-parent", "sys-core"],
  }),
];

// Hard safety assertions on generated Gate A cases so regressions can never bake into the fixture!
const cutCase = blastCases.find((c) => c.id === "all_11_kinds_cut_excludes_shared_tests_workflows_and_routes_from_cocut")!;
assert(
  JSON.stringify(cutCase.expected.coCutCandidates) === JSON.stringify(["f:docs/target_guide.md", "f:tests/test_target_only.py"]),
  `unexpected coCutCandidates: ${JSON.stringify(cutCase.expected.coCutCandidates)}`,
);
assert(
  (cutCase.expected.blockers as string[]).includes("f:deploy/Caddyfile") &&
    (cutCase.expected.blockers as string[]).includes("f:branding/index.html"),
  "routes and loads must appear in blockers, never testsToRun/stampsToRebuild",
);
assert(
  !(cutCase.expected.testsToRun as string[]).includes("f:deploy/Caddyfile") &&
    !(cutCase.expected.stampsToRebuild as string[]).includes("f:branding/index.html"),
  "Caddyfile/index.html misclassified into testsToRun/stampsToRebuild",
);
assert(
  JSON.stringify(cutCase.expected.hostsImpacted) === JSON.stringify(["vm-app", "vm-edge"]),
  `vm-ci must not appear in hostsImpacted: ${JSON.stringify(cutCase.expected.hostsImpacted)}`,
);

const docCutCase = blastCases.find((c) => c.id === "cutting_doc_never_marks_live_prod_script_mentioning_it_as_cocut")!;
assert(
  JSON.stringify(docCutCase.expected.coCutCandidates) === JSON.stringify([]),
  "live prod script mentioning a doc must never be a coCutCandidate",
);

const spoofCase = blastCases.find((c) => c.id === "anti_spoofing_rejects_type_only_and_prose_on_runtime_calls_and_runs")!;
assert(
  (spoofCase.expected.blockers as string[]).includes("f:lib/spoof_caller.py") &&
    (spoofCase.expected.blockers as string[]).includes("f:lib/spoof_runner.sh"),
  "spoofed type-only/prose on calls/runs must not bypass supply-chain blockers",
);

const diamondStopCase = blastCases.find((c) => c.id === "stop_diamond_at_max_hops_1_is_not_falsely_truncated")!;
assert(diamondStopCase.expected.truncated === false, "stop diamond at maxHops=1 must have truncated=false");

const auxSeedCase = blastCases.find((c) => c.id === "aux_test_seeding" || c.id === "aux_test_seed_reports_zero_prod_hosts_impacted")!;
assert(JSON.stringify(auxSeedCase.expected.hostsImpacted) === JSON.stringify([]), "aux test seed must report 0 prod hosts");

const renameDelta = deltaCases.find((c) => c.id === "rename_pairing_moved_previous_id_and_refactor_intent")!;
assert(renameDelta.expected.recommendedIntent === "refactor", "rename pairing must recommend refactor, not cut");
assert(renameDelta.expected.deletedIds.length === 0 && renameDelta.expected.addedIds.length === 0, "rename must pair 1:1");
assert(
  renameDelta.expected.blastSeedIds.includes("f:auth/new_token.py") &&
    renameDelta.expected.blastSeedIds.includes("f:auth/old_token.py"),
  "rename must seed both new and previous IDs",
);

const modHashDelta = deltaCases.find((c) => c.id === "concurrent_module_hash_and_symbol_patch_plus_wire_change")!;
assert(
  modHashDelta.expected.blastSeedIds.includes("f:core/both_changed.py") &&
    modHashDelta.expected.blastSeedIds.includes("s:core/both_changed.py#helper") &&
    modHashDelta.expected.bodyPatchedIds.includes("f:core/wire_only.py"),
  "moduleHash + wire_only invariants failed",
);

const ghostsDelta = deltaCases.find((c) => c.id === "merged_model_all_five_ghost_origins_and_collapsed_folder")!;
assert(ghostsDelta.expected.danglingWires.length === 0, "L2 ref:true target must not be flagged as danglingWire");

const fixture = {
  schemaVersion: "1.0.0",
  description:
    "Synthetic language-neutral conformance suite for TUX Architecture Map (tuxArchitectureMap.ts) and Forgejo Stack code-graph.py (#110 / #712).",
  models,
  levelChecks,
  blastCases,
  deltaCases,
};

const serialized = `${JSON.stringify(fixture, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const existing = readFileSync(FIXTURE_PATH, "utf8");
  if (existing !== serialized) {
    console.error("DRIFT: packages/diagrams/tests/fixtures/map-conformance.json is out of date.");
    console.error("Run: node packages/diagrams/scripts/generate-map-conformance.ts");
    process.exit(1);
  }
  console.log("map-conformance.json is up to date.");
} else {
  writeFileSync(FIXTURE_PATH, serialized, "utf8");
  console.log(`Wrote ${FIXTURE_PATH} (${Buffer.byteLength(serialized)} bytes).`);
}
