#!/usr/bin/env node
/**
 * audit-contrast.mjs — WCAG contrast audit over the /contrast-audit page.
 *
 * Workflow:
 *   1. Confirms `.output/public/contrast-audit/index.html` exists (build first).
 *   2. Serves `.output/public/` on a local port.
 *   3. Launches headless Chromium via puppeteer, navigates to the audit page.
 *   4. In-page: walks every text-containing element inside each [data-theme]
 *      column, computes the effective foreground + background color (walking
 *      up parents through transparent ancestors), then the WCAG 2.1 contrast
 *      ratio for the pair.
 *   5. Determines the threshold by font size + weight (large text = 3.0:1,
 *      otherwise 4.5:1). Reports failures.
 *   6. Writes contrast-report.json with full details, prints a console
 *      summary, and exits non-zero if any pair fails.
 *
 * Usage:
 *   npm run build      # produce .output/public/
 *   npm run audit:contrast
 *
 * The audit page lives at app/pages/contrast-audit.vue. To extend the
 * surfaces audited, drop new components into that page; the auditor picks
 * them up automatically — it crawls every text node in every theme column.
 */

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";
import handler from "serve-handler";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const STATIC_DIR = path.join(ROOT, ".output", "public");
const REPORT_PATH = path.join(ROOT, "contrast-report.json");

// Static github_pages builds use NUXT_APP_BASE_URL=/tti-ux/ as the base. The
// dev/server build uses /. Both are valid `npm run generate` outputs; we
// detect which by looking at the root index.html for the baseURL hint, then
// build the audit URL accordingly.
const BASE_URL = process.env.NUXT_APP_BASE_URL || "/";
const PORT = Number.parseInt(process.env.AUDIT_PORT ?? "7878", 10);
const AUDIT_PATH = `${BASE_URL.replace(/\/$/, "")}/contrast-audit/`;

if (!existsSync(STATIC_DIR)) {
  console.error(
    `ERROR: ${STATIC_DIR} doesn't exist. Run \`npm run generate\` first.`
  );
  process.exit(2);
}

if (!existsSync(path.join(STATIC_DIR, "contrast-audit", "index.html"))) {
  console.error(
    "ERROR: contrast-audit page wasn't generated. Make sure /contrast-audit " +
    "is reachable in the build (check nuxt.config.ts prerender ignore list)."
  );
  process.exit(2);
}

// ── Local server ──────────────────────────────────────────────────────────
// Strip the configured base URL prefix from incoming paths so requests
// resolve against STATIC_DIR regardless of how the build was generated.
// The github_pages build emits assets at /tti-ux/_nuxt/... but serve-
// handler treats STATIC_DIR as root.
const baseStrip = BASE_URL.replace(/\/$/, "");
const server = createServer((req, res) => {
  if (baseStrip && req.url?.startsWith(baseStrip + "/")) {
    req.url = req.url.slice(baseStrip.length) || "/";
  } else if (baseStrip && req.url === baseStrip) {
    req.url = "/";
  }
  return handler(req, res, { public: STATIC_DIR });
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(PORT, "127.0.0.1", resolve);
});

console.log(`Serving ${STATIC_DIR} at http://127.0.0.1:${PORT}`);
console.log(`Auditing ${AUDIT_PATH}\n`);

// ── Browser ───────────────────────────────────────────────────────────────
const browser = await puppeteer.launch({
  // Match the resolution used to render the audit page; smaller viewports
  // collapse the columns and the audit becomes single-column.
  defaultViewport: { width: 1600, height: 1200 },
});

const page = await browser.newPage();
const navResp = await page.goto(`http://127.0.0.1:${PORT}${AUDIT_PATH}`, {
  waitUntil: "networkidle0",
  timeout: 30_000,
});
if (navResp?.status() !== 200) {
  console.error(`ERROR: audit page returned ${navResp?.status()} at ${navResp?.url()}`);
  await browser.close();
  server.close();
  process.exit(2);
}

// Wait extra ticks for client-only components, fonts, and var resolution
// to settle. Empirically a single 500ms tick wasn't enough on some runs.
await new Promise((r) => setTimeout(r, 2000));

// ── optional diagnostic ─────────────────────────────────────────────────
// Set AUDIT_DEBUG=1 to dump var-resolution + swatch-bg per theme. Useful
// when an unexpected failure suggests a token or cascade issue.
if (process.env.AUDIT_DEBUG === "1") {
  const diag = await page.evaluate(() => {
    const results = {};
    for (const col of document.querySelectorAll(".audit__column[data-theme]")) {
      const theme = col.dataset.theme;
      const colCs = window.getComputedStyle(col);
      results[theme] = {
        brandPrimary: colCs.getPropertyValue("--brand-primary").trim(),
        brandFill: colCs.getPropertyValue("--brand-fill").trim(),
        textSecondary: colCs.getPropertyValue("--text-secondary").trim(),
        colorTextSecondary: colCs.getPropertyValue("--color-text-secondary").trim(),
      };
    }
    return results;
  });
  console.log("Token resolution by theme:");
  console.log(JSON.stringify(diag, null, 2));
  console.log("");
}

// ── In-page audit ─────────────────────────────────────────────────────────
const results = await page.evaluate(() => {
  // ── color helpers ───────────────────────────────────────────────────────
  function parseColor(str) {
    if (!str) return null;
    const m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map((p) => Number.parseFloat(p));
    if (parts.length < 3) return null;
    const [r, g, b, a = 1] = parts;
    return { r, g, b, a };
  }

  function blend(fg, bg) {
    // Alpha-composite fg over bg.
    const a = fg.a;
    return {
      r: Math.round(fg.r * a + bg.r * (1 - a)),
      g: Math.round(fg.g * a + bg.g * (1 - a)),
      b: Math.round(fg.b * a + bg.b * (1 - a)),
      a: 1,
    };
  }

  function relativeLuminance({ r, g, b }) {
    const [R, G, B] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function contrastRatio(c1, c2) {
    const L1 = relativeLuminance(c1);
    const L2 = relativeLuminance(c2);
    const [bright, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (bright + 0.05) / (dark + 0.05);
  }

  function rgbToHex({ r, g, b }) {
    const h = (n) => n.toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
  }

  function effectiveBackground(el) {
    // Walk up the DOM until we find an opaque background (alpha = 1). If we
    // reach the document root without finding one, return the page bg.
    let current = el;
    let stack = [];
    while (current && current !== document.documentElement) {
      const cs = window.getComputedStyle(current);
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) {
        stack.push(c);
        if (c.a === 1) break;
      }
      current = current.parentElement;
    }
    // Default white for the root.
    let acc = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) {
      const layer = stack[i];
      if (layer.a === 1) {
        acc = layer;
      } else {
        acc = blend(layer, acc);
      }
    }
    return acc;
  }

  function selectorFor(el) {
    // Build a short, readable selector — prefer data-audit-group, then class.
    const parts = [];
    let cur = el;
    while (cur && cur !== document.body && parts.length < 5) {
      let s = cur.tagName.toLowerCase();
      if (cur.id) s += `#${cur.id}`;
      else if (cur.classList.length) s += `.${[...cur.classList].slice(0, 2).join(".")}`;
      const group = cur.dataset?.auditGroup;
      if (group) s += `[group=${group}]`;
      parts.unshift(s);
      cur = cur.parentElement;
    }
    return parts.join(" > ");
  }

  // ── walk text elements ──────────────────────────────────────────────────
  const reports = [];
  const columns = document.querySelectorAll(".audit__column[data-theme]");
  for (const col of columns) {
    const theme = col.dataset.theme;
    // Walk every element with directly-rendered text (i.e., owning a child
    // text node). Skip elements whose only contribution is wrapping
    // children — those are audited at the leaf level.
    const all = col.querySelectorAll("*");
    for (const el of all) {
      const directText = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent.trim())
        .filter(Boolean)
        .join(" ");
      if (!directText) continue;

      // Skip invisible elements.
      const cs = window.getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") {
        continue;
      }

      const fgRaw = parseColor(cs.color);
      if (!fgRaw) continue;
      const bg = effectiveBackground(el);
      // If the foreground is semi-transparent, alpha-composite it onto bg.
      const fg = fgRaw.a < 1 ? blend(fgRaw, bg) : fgRaw;

      const ratio = contrastRatio(fg, bg);

      const fontSize = Number.parseFloat(cs.fontSize);
      const fontWeight = Number.parseInt(cs.fontWeight, 10) || 400;
      // Per WCAG: large text is ≥ 18pt (~24px) or ≥ 14pt bold (~18.66px bold).
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const threshold = isLarge ? 3.0 : 4.5;

      // Round ratio to 2 decimals for stability.
      const roundedRatio = Math.round(ratio * 100) / 100;

      reports.push({
        theme,
        text: directText.slice(0, 80),
        fg: rgbToHex(fg),
        bg: rgbToHex(bg),
        ratio: roundedRatio,
        threshold,
        fontSize,
        fontWeight,
        isLarge,
        passes: ratio >= threshold,
        selector: selectorFor(el),
        auditGroup: el.closest("[data-audit-group]")?.dataset.auditGroup ?? null,
      });
    }
  }

  return reports;
});

// ── teardown + report ─────────────────────────────────────────────────────
await browser.close();
server.close();

const failures = results.filter((r) => !r.passes);
const passes = results.length - failures.length;

writeFileSync(REPORT_PATH, JSON.stringify({ summary: { total: results.length, passes, failures: failures.length }, results }, null, 2));

console.log(`Audited ${results.length} text/bg pairs across themes.`);
console.log(`  ${passes} pass`);
console.log(`  ${failures.length} fail`);
console.log(`Wrote ${path.relative(ROOT, REPORT_PATH)}\n`);

if (failures.length > 0) {
  // Group by theme for readability.
  const byTheme = {};
  for (const f of failures) {
    (byTheme[f.theme] ??= []).push(f);
  }
  for (const [theme, items] of Object.entries(byTheme)) {
    console.log(`── ${theme} (${items.length} failures) ──`);
    // Sort by ratio (worst first).
    items.sort((a, b) => a.ratio - b.ratio);
    for (const f of items.slice(0, 30)) {
      const sizeNote = f.isLarge ? "large" : "normal";
      console.log(
        `  ${f.ratio.toFixed(2)}:1 (need ${f.threshold}, ${sizeNote})  ` +
        `${f.fg} on ${f.bg}  ` +
        `[${f.auditGroup ?? "-"}]  "${f.text.slice(0, 50)}"`
      );
    }
    if (items.length > 30) {
      console.log(`  … ${items.length - 30} more in contrast-report.json`);
    }
    console.log("");
  }
  process.exit(1);
}

console.log("All pairs pass WCAG 2.1 AA.");
process.exit(0);
