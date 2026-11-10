#!/usr/bin/env node
/**
 * packages/diagrams/scripts/bench-map.mjs
 *
 * The architecture-map benchmark, with its milliseconds (#153).
 *
 * `npm test` already runs the benchmark as a gate: two vitest files time every
 * scenario at three model sizes and assert on the RATIO between sizes, never
 * on a number of milliseconds. This script runs the same two files, collects
 * what they measured and prints it, so a performance change can cite a before
 * and an after.
 *
 *   tests/map-bench.test.ts                                   the exported utils alone
 *   ../../tests/components/tux-architecture-map-bench.nuxt.test.ts   through the mounted component (jsdom)
 *
 * Usage (from the repository root):
 *   npm run bench:map -w @tti/tti-ux-diagrams               both halves, table + JSON
 *   npm run bench:map -w @tti/tti-ux-diagrams -- --utils    the utils half only (about 20 s)
 *   npm run bench:map -w @tti/tti-ux-diagrams -- --record   also rewrite the committed baseline
 *   npm run bench:map -w @tti/tti-ux-diagrams -- --report   run nothing: print what the last run wrote
 *
 * Options:
 *   --utils | --component   one half only
 *   --report                do not run vitest; read <out>/utils.json and <out>/component.json
 *   --record                write tests/support/map-bench.baseline.json from this run (both halves)
 *   --out=<dir>             where the JSON goes (default: <repo>/.cache/map-bench, or $TUX_MAP_BENCH_OUT)
 *
 * Output: <out>/result.json (everything) and <out>/result.md (the table).
 * Exit code: vitest's, so a ratio over its ceiling fails here as it does in
 * `npm test`. The comparison with the baseline never fails anything: the
 * baseline was taken on another machine on another day.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(PKG, "..", "..");
const BASELINE = path.join(PKG, "tests", "support", "map-bench.baseline.json");
const COMPONENT_TEST = "tests/components/tux-architecture-map-bench.nuxt.test.ts";
const SIZES = ["s500", "s2500", "s10000"];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const outArg = args.find((a) => a.startsWith("--out="))?.slice("--out=".length);
const OUT = path.resolve(outArg || process.env.TUX_MAP_BENCH_OUT || path.join(ROOT, ".cache", "map-bench"));
const only = flag("utils") ? "utils" : flag("component") ? "component" : null;
const reportOnly = flag("report");
const record = flag("record");

if (record && (only || reportOnly)) {
  console.error("--record needs a full run of both halves: drop --utils, --component and --report.");
  process.exit(2);
}

function runVitest(suite, cwd, file) {
  rmSync(path.join(OUT, `${suite}.json`), { force: true });
  console.log(`\n▶ ${suite}: vitest run ${file}`);
  const res = spawnSync("npx", ["vitest", "run", file], {
    cwd,
    stdio: "inherit",
    env: { ...process.env, TUX_MAP_BENCH_OUT: OUT },
  });
  return res.status ?? 1;
}

function readSuite(suite) {
  const file = path.join(OUT, `${suite}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}

function gitCommit() {
  const res = spawnSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" });
  return res.status === 0 ? res.stdout.trim() : null;
}

const ms = (n) => (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n >= 1 ? n.toFixed(2) : n.toFixed(3));
const cell = (stat) => `${ms(stat.median)} (${ms(stat.p90)})`;

function table(result, baseline) {
  const factor =
    baseline?.reference && result.reference ? result.reference.median / baseline.reference.median : null;
  const head = ["scenario", "via", "500", "2,500", "10,000", "2,500/500", "10,000/2,500"];
  if (baseline) head.push("10,000 vs baseline");
  const rows = result.scenarios.map((s) => {
    const row = [
      s.id,
      s.via,
      ...SIZES.map((k) => cell(s.sizes[k])),
      `${s.ratios.midOverSmall.toFixed(2)} (≤ ${s.bounds.midOverSmall})`,
      `${s.ratios.largeOverMid.toFixed(2)} (≤ ${s.bounds.largeOverMid})`,
    ];
    if (baseline) {
      const b = baseline.scenarios.find((x) => x.id === s.id);
      if (!b) row.push("new");
      else {
        const raw = s.sizes.s10000.median / b.sizes.s10000.median;
        row.push(factor ? `${(raw / factor).toFixed(2)}× (raw ${raw.toFixed(2)}×)` : `${raw.toFixed(2)}×`);
      }
    }
    return s.pass ? row : [...row.slice(0, -1), `${row[row.length - 1]}  OVER`];
  });
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (r) => `| ${r.map((c, i) => c.padEnd(widths[i])).join(" | ")} |`;
  return [line(head), `|${widths.map((w) => "-".repeat(w + 2)).join("|")}|`, ...rows.map(line)].join("\n");
}

// ── Run ────────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
let status = 0;
if (!reportOnly) {
  if (only !== "component") status ||= runVitest("utils", PKG, "tests/map-bench.test.ts");
  if (only !== "utils") {
    if (existsSync(path.join(ROOT, COMPONENT_TEST))) status ||= runVitest("component", ROOT, COMPONENT_TEST);
    else console.log(`\n(${COMPONENT_TEST} is not in this checkout: the component half is skipped)`);
  }
}

const utils = only === "component" ? null : readSuite("utils");
const component = only === "utils" ? null : readSuite("component");
const suites = [utils, component].filter(Boolean);
if (suites.length === 0) {
  console.error(`\nNo results in ${OUT}. Run without --report first.`);
  process.exit(status || 1);
}

const cpus = os.cpus();
const result = {
  schema: 1,
  recorded: new Date().toISOString(),
  machine: {
    node: process.version,
    platform: `${process.platform} ${process.arch}`,
    cpu: cpus[0]?.model?.trim() ?? "unknown",
    cores: cpus.length,
  },
  commit: gitCommit(),
  note:
    "Milliseconds per call: median and 90th percentile of 9 samples after a warm-up. " +
    "The component half runs in jsdom. Nothing compares these numbers; the gate reads the ratios.",
  models: suites[0].models,
  reference: utils?.reference ?? null,
  scenarios: suites.flatMap((s) => s.scenarios),
};
writeFileSync(path.join(OUT, "result.json"), `${JSON.stringify(result, null, 2)}\n`);

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;
const lines = [];
lines.push(`Architecture map benchmark: ${result.machine.cpu}, ${result.machine.cores} cores, Node ${result.machine.node}, ${result.machine.platform}`);
lines.push(
  `Models: ${SIZES.map((k) => {
    const c = result.models[k].counts;
    return `${result.models[k].label} = ${c.symbols} symbols, ${c.links} links, ${c.files} files, ${result.models[k].cardsPerView} cards in the deepest view`;
  }).join("; ")}`,
);
if (result.reference) lines.push(`Reference workload: ${ms(result.reference.median)} ms`);
if (baseline) {
  lines.push(
    `Baseline: ${baseline.machine.cpu}, Node ${baseline.machine.node}, ${baseline.recorded.slice(0, 10)}` +
      (baseline.commit ? `, commit ${baseline.commit}` : "") +
      (baseline.reference ? `, reference ${ms(baseline.reference.median)} ms` : "") +
      ". The last column divides by the two reference times, so machines can be read side by side.",
  );
}
lines.push("Milliseconds are median (p90). Ratios are between medians, with the gate's ceiling.", "");
lines.push(table(result, record ? null : baseline));
const text = lines.join("\n");
writeFileSync(path.join(OUT, "result.md"), `${text}\n`);
console.log(`\n${text}\n\nWritten: ${path.join(OUT, "result.json")}`);

if (record) {
  if (status !== 0 || !utils || !component) {
    console.error("\nNot recording a baseline from a failed or partial run.");
    process.exit(status || 1);
  }
  // The baseline keeps what a reader compares against, not every field
  const slim = {
    ...result,
    scenarios: result.scenarios.map(({ id, title, via, scalesWith, sizes, ratios, bounds }) => ({
      id,
      title,
      via,
      scalesWith,
      sizes: Object.fromEntries(
        SIZES.map((k) => [k, { median: +sizes[k].median.toFixed(4), p90: +sizes[k].p90.toFixed(4) }]),
      ),
      ratios: { midOverSmall: +ratios.midOverSmall.toFixed(3), largeOverMid: +ratios.largeOverMid.toFixed(3) },
      bounds,
    })),
    reference: { median: +result.reference.median.toFixed(4), p90: +result.reference.p90.toFixed(4) },
  };
  writeFileSync(BASELINE, `${JSON.stringify(slim, null, 2)}\n`);
  console.log(`Baseline recorded: ${path.relative(ROOT, BASELINE)}`);
}
process.exit(status);
