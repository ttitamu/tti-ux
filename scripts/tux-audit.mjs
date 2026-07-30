#!/usr/bin/env node
/**
 * tux-audit — the consumable guardrail dispatcher (unification-plan.md
 * §Guardrails). Ships as the package's bin so any consumer of the tti-ux
 * git dep can run the design-system audits without copying scripts.
 *
 *   npx tux-audit tokens [dirs…]   zero-dependency undefined-token audit
 *                                  (the --surface-base bug class). One CI
 *                                  line; see README "Consuming".
 *   npx tux-audit contrast         AAA contrast audit — needs YOUR
 *                                  devDeps (puppeteer) + a generated site.
 *   npx tux-audit a11y             axe audit — needs YOUR devDeps
 *                                  (puppeteer + axe-core) + generated site.
 *
 * The honest split: `tokens` is pure node:fs and works everywhere;
 * contrast/a11y need heavyweight deps tti-ux deliberately does not force
 * on consumers, so they delegate when present and explain when absent.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [, , cmd, ...rest] = process.argv;

function run(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script), ...args], {
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
}

function hasDep(name) {
  // Consumer's own install — cwd-anchored, not this package's tree.
  return existsSync(path.join(process.cwd(), "node_modules", name));
}

switch (cmd) {
  case "tokens":
    run("audit-tokens.mjs", rest);
    break;

  case "contrast":
    if (!hasDep("puppeteer")) {
      console.error(
        "tux-audit contrast needs `puppeteer` in YOUR devDependencies plus a\n" +
          "generated site to crawl (tti-ux doesn't force the ~300MB dep on\n" +
          "consumers). Install it, generate your site, then re-run — or run\n" +
          "the audit inside the tti-ux repo itself (`npm run audit:contrast`).",
      );
      process.exit(2);
    }
    run("audit-contrast.mjs", rest);
    break;

  case "a11y":
    if (!hasDep("puppeteer") || !hasDep("axe-core")) {
      console.error(
        "tux-audit a11y needs `puppeteer` + `axe-core` in YOUR devDependencies\n" +
          "plus a generated site to crawl. Install them, generate, then re-run —\n" +
          "or run inside the tti-ux repo itself (`npm run audit:a11y`).",
      );
      process.exit(2);
    }
    run("audit-a11y.mjs", rest);
    break;

  default:
    console.error(
      "usage: tux-audit <tokens|contrast|a11y> [args]\n" +
        "  tokens [dirs…]  undefined-token audit (zero-dep; defaults to ./app)\n" +
        "  contrast        WCAG AAA contrast audit (needs your puppeteer)\n" +
        "  a11y            axe accessibility audit (needs your puppeteer + axe-core)",
    );
    process.exit(cmd ? 2 : 0);
}
