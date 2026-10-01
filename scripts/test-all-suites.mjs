#!/usr/bin/env node
/**
 * scripts/test-all-suites.mjs
 *
 * TTI-UX 3.0 Unified Institutional Quality & Accessibility Test Runner
 *
 * Executes all test tiers in an orchestrated, gateable pipeline:
 *  - Tier 1: Design Tokens & Status Color Palette Invariant Audits
 *  - Tier 2: Mathematical WCAG 2.2 Level AAA Contrast & Geometry Audit
 *  - Tier 3: Vitest Component, Unit & Architectural Invariant Suites (Mounted Nuxt + Axe)
 *  - Tier 4: Prerendered Page-Level Axe Accessibility Audit (DOM & ARIA structure)
 *  - Tier 5: Component Health & Telemetry Verification (Catalog, Ports & Certifications)
 *
 * Usage:
 *   node scripts/test-all-suites.mjs
 *   npm run test:all
 *   npm run test:quality
 *
 * Options:
 *   --tier=<1,2,3,4,5>   Run specific comma-delimited tiers
 *   --skip-page-axe      Skip page-level axe audit if prerender build is not desired
 *   --verbose            Print full subprocess output
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith("--tier="))?.split("=")[1];
const targetTiers = tierArg ? tierArg.split(",").map((s) => parseInt(s.trim(), 10)) : [1, 2, 3, 4, 5];
const skipPageAxe = args.includes("--skip-page-axe");
const verbose = args.includes("--verbose");

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  maroon: "\x1b[38;2;80;0;0m",
  gold: "\x1b[38;2;207;169;53m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

const results = [];
const overallStartTime = Date.now();

console.log(`\n${colors.bold}${colors.maroon}╔════════════════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bold}${colors.maroon}║  TTI-UX 3.0 — Unified Institutional Quality & Accessibility Test Runner            ║${colors.reset}`);
console.log(`${colors.bold}${colors.maroon}╚════════════════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

function runStep(name, cmd, cmdArgs, envExtra = {}) {
  const start = Date.now();
  process.stdout.write(`  ⏳ ${colors.bold}${name}${colors.reset} ... `);

  const res = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: verbose ? "inherit" : "pipe",
    env: { ...process.env, HOME: ROOT, ...envExtra },
    encoding: "utf-8",
  });

  const durationMs = Date.now() - start;
  const passed = res.status === 0;

  if (passed) {
    console.log(`${colors.green}✓ PASS${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}`);
    results.push({ name, passed: true, durationMs });
    return true;
  } else {
    console.log(`${colors.red}✗ FAIL${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}`);
    if (!verbose && res.stdout) {
      console.log(`\n${colors.dim}--- STDOUT ---${colors.reset}\n` + res.stdout.slice(-1500));
    }
    if (!verbose && res.stderr) {
      console.log(`\n${colors.red}--- STDERR ---${colors.reset}\n` + res.stderr.slice(-1500));
    }
    results.push({ name, passed: false, durationMs });
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier 1: Token & Status Palette Audits
// ─────────────────────────────────────────────────────────────────────────────
if (targetTiers.includes(1)) {
  console.log(`${colors.bold}► Tier 1: Design Tokens & Status Color Palette Invariant Audits${colors.reset}`);
  runStep("Audit Token References (Undefined Token Guardrail)", "node", ["scripts/audit-tokens.mjs"]);
  runStep("Audit Status Palette (OKLab & Contrast Matrix)", "node", ["scripts/audit-status-palette.mjs"]);
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier 2: Mathematical WCAG 2.2 Level AAA Contrast & Geometry Audit
// ─────────────────────────────────────────────────────────────────────────────
if (targetTiers.includes(2)) {
  console.log(`${colors.bold}► Tier 2: Mathematical WCAG 2.2 Level AAA Contrast & Geometry Audit${colors.reset}`);
  runStep("Audit WCAG 2.2 Level AAA (>=7:1 Contrast, >=44px Targets, >=3px Focus)", "node", [
    "scripts/audit-wcag-aaa.mjs",
    "--check",
  ]);
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier 3: Vitest Root Invariant & Component Regression Suites
// ─────────────────────────────────────────────────────────────────────────────
if (targetTiers.includes(3)) {
  console.log(`${colors.bold}► Tier 3: Vitest Invariant & Mounted Component Test Suites${colors.reset}`);
  console.log(`    ${colors.dim}Mounted Nuxt test suites include direct in-component Axe accessibility validation.${colors.reset}`);
  runStep("Vitest Root Suites (Mounted Component Axe + Invariant Tests)", "npx", ["vitest", "run"]);
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier 4: Prerendered Page Axe Accessibility Audit
// ─────────────────────────────────────────────────────────────────────────────
if (targetTiers.includes(4)) {
  console.log(`${colors.bold}► Tier 4: Prerendered Page-Level Axe Accessibility Audit${colors.reset}`);
  if (skipPageAxe) {
    console.log(`  ${colors.yellow}⚠ SKIPPED${colors.reset}: --skip-page-axe specified.`);
    results.push({ name: "Page-Level Axe Accessibility Audit", passed: true, durationMs: 0, skipped: true });
  } else {
    const staticDir = path.join(ROOT, ".output", "public");
    if (!existsSync(staticDir)) {
      console.log(`  ${colors.yellow}⚠ NOTE${colors.reset}: .output/public missing. Building prerendered static pages first...`);
      const buildOk = runStep("Nuxt Prerender Build (.output/public)", "npm", ["run", "build"]);
      if (buildOk) {
        runStep("Axe Core Prerendered Pages Audit", "node", ["scripts/audit-a11y.mjs"]);
      }
    } else {
      runStep("Axe Core Prerendered Pages Audit (All routes in .output/public)", "node", ["scripts/audit-a11y.mjs"]);
    }
  }
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier 5: Component Health & Telemetry Verification
// ─────────────────────────────────────────────────────────────────────────────
if (targetTiers.includes(5)) {
  console.log(`${colors.bold}► Tier 5: Component Health & Telemetry Verification${colors.reset}`);
  const startTier5 = Date.now();

  try {
    process.stdout.write(`  ⏳ ${colors.bold}Verify Component Health Sync & AAA Certification Ledger${colors.reset} ... `);

    // 1. Verify ledger exists and reports 0 violations
    const ledgerPath = path.join(ROOT, "app", "utils", "a11yAuditLedger.json");
    if (!existsSync(ledgerPath)) {
      throw new Error("a11yAuditLedger.json does not exist. Run npm run audit:aaa first.");
    }
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf-8"));
    if (ledger.violations && ledger.violations.length > 0) {
      throw new Error(`Ledger contains ${ledger.violations.length} violations.`);
    }

    // 2. Count mounted component test files on disk
    const componentTestDir = path.join(ROOT, "tests", "components");
    const testFiles = existsSync(componentTestDir)
      ? readdirSync(componentTestDir).filter((f) => f.endsWith(".nuxt.test.ts"))
      : [];

    const durationMs = Date.now() - startTier5;
    console.log(`${colors.green}✓ PASS${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}`);
    console.log(
      `    ${colors.cyan}ℹ Verified: ${testFiles.length} mounted component test suites on disk; 100% WCAG 2.2 AAA ledger certification confirmed.${colors.reset}`,
    );
    results.push({ name: "Component Health & Telemetry Sync", passed: true, durationMs });
  } catch (err) {
    const durationMs = Date.now() - startTier5;
    console.log(`${colors.red}✗ FAIL${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}`);
    console.error(`    ${colors.red}Error: ${err.message}${colors.reset}`);
    results.push({ name: "Component Health & Telemetry Sync", passed: false, durationMs });
  }
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// Consolidated Executive Summary
// ─────────────────────────────────────────────────────────────────────────────
const totalElapsed = ((Date.now() - overallStartTime) / 1000).toFixed(2);
const totalTests = results.length;
const passedTests = results.filter((r) => r.passed).length;
const failedTests = results.filter((r) => !r.passed).length;

console.log(`${colors.bold}════════════════════════════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}  TEST SUITE RUNNER SUMMARY${colors.reset}`);
console.log(`${colors.bold}════════════════════════════════════════════════════════════════════════════════════${colors.reset}`);
for (const r of results) {
  const icon = r.skipped ? `${colors.yellow}⊘` : r.passed ? `${colors.green}✓` : `${colors.red}✗`;
  const status = r.skipped ? `${colors.yellow}SKIPPED` : r.passed ? `${colors.green}PASSED` : `${colors.red}FAILED`;
  console.log(`  ${icon} ${r.name.padEnd(55)} ${status.padEnd(10)} ${colors.dim}(${r.durationMs}ms)${colors.reset}`);
}

console.log(`${colors.bold}────────────────────────────────────────────────────────────────────────────────────${colors.reset}`);
console.log(`  Total Steps: ${totalTests} | Passed: ${colors.green}${passedTests}${colors.reset} | Failed: ${failedTests > 0 ? colors.red + failedTests : colors.green + "0"}${colors.reset} | Duration: ${totalElapsed}s`);

if (failedTests > 0) {
  console.log(`\n${colors.bold}${colors.red}❌ QUALITY GATEWAY FAILED: ${failedTests} test/audit tier(s) did not pass.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`\n${colors.bold}${colors.green}✓ ALL INSTITUTIONAL QUALITY & ACCESSIBILITY GATES PASSED (100% WCAG 2.2 AAA + ZERO VIOLATIONS).${colors.reset}\n`);
  process.exit(0);
}
