#!/usr/bin/env node
/**
 * audit-a11y.mjs — structural accessibility audit via jsdom + axe-core.
 *
 * Makes the ad-hoc "tested via jsdom + axe-core" pass from the polish
 * sprint into a committed, repeatable, gateable script. Runs axe-core
 * against the prerendered HTML of every generated page and fails on any
 * violation — catching the class of bug that escaped the last batch
 * (`nested-interactive`, `landmark-unique`, `html-has-lang`,
 * `aria-allowed-role`), all of which are pure-DOM-structure rules that
 * don't need a real layout engine.
 *
 * Why jsdom and not puppeteer: these rules read the DOM tree, roles, and
 * attributes — no paint required. jsdom is ~100× lighter than spinning up
 * Chromium per page, so the whole site audits in seconds. The one thing
 * jsdom can't do is real color rendering, so `color-contrast` is disabled
 * here — that's the dedicated job of `npm run audit:contrast` (puppeteer).
 *
 * Operates on the same generated output as the contrast audit
 * (`.output/public`), so in CI it reuses the existing `npm run generate`
 * step. Run order locally:
 *   npm run generate
 *   npm run audit:a11y
 *
 * Env:
 *   AUDIT_A11Y_PAGES   comma-separated route filter (e.g.
 *                      "components/popover,components/mobile-frame") to audit
 *                      a subset while iterating on one component.
 *   AUDIT_A11Y_DEBUG   "1" → print each page as it's audited.
 *   AUDIT_A11Y_JSON    path → write the full per-page violation report (all
 *                      nodes, not truncated) to this file for analysis.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import axe from "axe-core";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STATIC_DIR = path.join(ROOT, ".output", "public");

if (!existsSync(STATIC_DIR)) {
  console.error(
    `ERROR: ${path.relative(ROOT, STATIC_DIR)} doesn't exist. Run ` +
      `\`npm run generate\` first.`
  );
  process.exit(2);
}

// ── discover prerendered pages ──────────────────────────────────────────────
// Each route is a directory with an index.html (Nuxt's prerender layout).
function findPages(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "_nuxt" || entry === "_payload") continue;
      findPages(full, out);
    } else if (entry === "index.html") {
      out.push(full);
    }
  }
  return out;
}

const routeOf = (htmlPath) =>
  "/" + (path.relative(STATIC_DIR, path.dirname(htmlPath)) || "");

let pages = findPages(STATIC_DIR).sort();

const filter = process.env.AUDIT_A11Y_PAGES?.split(",").map((s) => s.trim()).filter(Boolean);
if (filter?.length) {
  pages = pages.filter((p) => filter.some((f) => routeOf(p).includes(f)));
  if (pages.length === 0) {
    console.error(`ERROR: AUDIT_A11Y_PAGES=${filter.join(",")} matched no pages.`);
    process.exit(2);
  }
}

console.log(`Auditing ${pages.length} page(s) with axe-core ${axe.version}\n`);

// ── axe options ─────────────────────────────────────────────────────────────
// color-contrast (+ its enhanced AAA variant) need real rendering — that's
// the contrast audit's job. Everything else is structural and runs in jsdom.
const AXE_OPTIONS = {
  resultTypes: ["violations"],
  rules: {
    "color-contrast": { enabled: false },
    "color-contrast-enhanced": { enabled: false },
  },
};

// ── run ──────────────────────────────────────────────────────────────────────
// ── known third-party-framework artifacts ───────────────────────────────────
// Violations in markup WE DO NOT AUTHOR (a dependency emits invalid ARIA in
// its own SSR output). These are NOT silently dropped — they are counted and
// logged loudly on every run, so they stay visible and can't mask one of our
// own regressions. Each entry is keyed as tightly as possible (rule + a
// node-html signature unique to the offending component) so it can only ever
// match the exact upstream artifact it documents.
// Intentionally empty. The Nuxt UI <UNavigationMenu> collapsible-chevron
// artifact that first populated this list was retired by replacing that
// component with the native-<details> <TuxRailNav> in the two example
// shells (see CHANGELOG 2026-06-02). Keep the mechanism in place as the
// documented home for any future genuine third-party artifact.
const KNOWN_UPSTREAM = [];

const isKnownUpstream = (ruleId, node) =>
  KNOWN_UPSTREAM.some((k) => k.rule === ruleId && k.match(node));

const debug = process.env.AUDIT_A11Y_DEBUG === "1";
const pageFailures = []; // { route, violations: [...] }
const suppressed = []; // { route, rule, reason }
let totalViolations = 0;

for (const htmlPath of pages) {
  const route = routeOf(htmlPath);
  const html = readFileSync(htmlPath, "utf8");

  // runScripts "outside-only" lets us inject axe via window.eval without
  // executing the page's own <script> tags — we audit the prerendered DOM
  // exactly as it ships, no hydration, no network.
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;

  // Inject axe into the page's realm and run it against that document.
  window.eval(axe.source);
  let results;
  try {
    results = await window.axe.run(window.document, AXE_OPTIONS);
  } catch (err) {
    console.error(`  ✗ ${route} — axe failed to run: ${err.message}`);
    pageFailures.push({ route, violations: [{ id: "axe-run-error", help: err.message, nodes: [] }] });
    window.close();
    continue;
  }
  window.close();

  // Partition each violation's nodes into known-upstream (suppressed but
  // logged) vs. real (ours — these fail the gate). A violation left with no
  // real nodes is dropped.
  const realViolations = [];
  for (const v of results.violations) {
    const realNodes = [];
    for (const node of v.nodes) {
      if (isKnownUpstream(v.id, node)) {
        const reason = KNOWN_UPSTREAM.find((k) => k.rule === v.id && k.match(node)).reason;
        suppressed.push({ route, rule: v.id, reason });
      } else {
        realNodes.push(node);
      }
    }
    if (realNodes.length) realViolations.push({ ...v, nodes: realNodes });
  }

  if (debug) console.log(`  ${realViolations.length ? "✗" : "·"} ${route}`);

  if (realViolations.length) {
    pageFailures.push({ route, violations: realViolations });
    totalViolations += realViolations.reduce((n, v) => n + v.nodes.length, 0);
  }
}

if (suppressed.length) {
  console.log(
    `ℹ ${suppressed.length} known-upstream artifact(s) suppressed (logged, not gated):`
  );
  for (const s of suppressed) console.log(`    ${s.route}  [${s.rule}]  ${s.reason}`);
  console.log("");
}

// ── report ──────────────────────────────────────────────────────────────────
if (process.env.AUDIT_A11Y_JSON) {
  const report = pageFailures.map(({ route, violations }) => ({
    route,
    violations: violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => ({ target: n.target, html: n.html, summary: n.failureSummary })),
    })),
  }));
  writeFileSync(process.env.AUDIT_A11Y_JSON, JSON.stringify(report, null, 2));
  console.log(`Wrote full report to ${process.env.AUDIT_A11Y_JSON}`);
}

if (pageFailures.length === 0) {
  console.log(`✓ a11y OK — zero axe violations across ${pages.length} page(s).`);
  process.exit(0);
}

console.error(
  `\n✗ ${totalViolations} axe violation(s) on ${pageFailures.length} page(s):\n`
);
for (const { route, violations } of pageFailures) {
  console.error(`  ${route}`);
  for (const v of violations) {
    console.error(`      [${v.impact ?? "n/a"}] ${v.id} — ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) {
      console.error(`          ${node.target?.join(" ") ?? ""}`);
    }
    if (v.nodes.length > 3) console.error(`          …and ${v.nodes.length - 3} more`);
    if (v.helpUrl) console.error(`          ${v.helpUrl}`);
  }
}
console.error(
  `\nFix the markup (roles, landmarks, names, nesting) in the offending\n` +
    `component(s), re-run \`npm run generate && npm run audit:a11y\`. Contrast\n` +
    `is audited separately by \`npm run audit:contrast\`.`
);
process.exit(1);
