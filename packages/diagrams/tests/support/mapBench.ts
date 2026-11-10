/**
 * The architecture-map benchmark's stopwatch and gate (`tti/tti-ux#153`).
 * Test support only: not imported by `app/` or `runtime/`, not in the
 * package's `files` list.
 *
 * What it measures: one scenario at three model sizes, interleaved, after a
 * warm-up, as the median and 90th percentile of at least nine samples.
 *
 * What it asserts: never a number of milliseconds. A shared CI runner is easily
 * five times slower than a laptop and twice as slow as itself a minute ago, so
 * a fixed budget either fails at random or is too loose to catch anything. The
 * gate is the RATIO between two sizes measured in the same process, seconds
 * apart: time(2,500) / time(500) and time(10,000) / time(2,500). Machine speed
 * cancels out; what is left is how the code scales, which is what a
 * quadratic scan changes. The milliseconds are written to a JSON file for
 * people to read and are compared by nothing.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { Session } from "node:inspector";
import { join } from "node:path";
import { buildSyntheticMapModel, createSeededRandom, type SyntheticMap } from "./mapSyntheticModels";

export const MAP_BENCH_SIZES = [
  { key: "s500", label: "500", symbols: 500, cardsPerView: 30 },
  { key: "s2500", label: "2,500", symbols: 2500, cardsPerView: 60 },
  { key: "s10000", label: "10,000", symbols: 10000, cardsPerView: 120 },
] as const;

export type MapBenchSizeKey = (typeof MAP_BENCH_SIZES)[number]["key"];

/** The three synthetic repositories, built once per process. */
let cachedModels: Record<MapBenchSizeKey, SyntheticMap> | null = null;
export function mapBenchModels(): Record<MapBenchSizeKey, SyntheticMap> {
  if (!cachedModels) {
    const out = {} as Record<MapBenchSizeKey, SyntheticMap>;
    for (const s of MAP_BENCH_SIZES) {
      out[s.key] = buildSyntheticMapModel({ symbols: s.symbols, cardsPerView: s.cardsPerView });
    }
    cachedModels = out;
  }
  return cachedModels;
}

export interface BenchStat {
  /** Milliseconds per call. */
  median: number;
  p90: number;
  min: number;
  max: number;
  /** Timed samples behind the numbers above. */
  runs: number;
  /** Calls per sample (more than one when a single call is too short to time). */
  batch: number;
}

export interface BenchCase {
  /** The work to time. May be async; a sync function is not awaited. */
  run: () => void | Promise<void>;
  /** Untimed: put things back before the next sample (forces one call per sample). */
  reset?: () => void | Promise<void>;
}

export interface BenchOptions {
  /** Timed samples per size; at least 9. */
  runs?: number;
  /** Untimed calls per size before sampling. */
  warmup?: number;
  /** A sample shorter than this is batched until it is not. */
  minSampleMs?: number;
}

export function summarize(samples: number[], batch = 1): BenchStat {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1))]!;
  return {
    median: at(0.5),
    p90: at(0.9),
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    runs: sorted.length,
    batch,
  };
}

async function timeCalls(c: BenchCase, batch: number): Promise<number> {
  const t0 = performance.now();
  for (let i = 0; i < batch; i++) {
    const r = c.run();
    if (r) await r;
  }
  return (performance.now() - t0) / batch;
}

/**
 * Times every case: warm-up first, then `runs` rounds, each round visiting
 * every size once, so a slow moment on the machine lands on all sizes rather
 * than on one.
 */
export async function measureCases<K extends string>(
  cases: Record<K, BenchCase>,
  opts: BenchOptions = {},
): Promise<Record<K, BenchStat>> {
  const runs = Math.max(9, opts.runs ?? 9);
  const warmup = Math.max(1, opts.warmup ?? 2);
  const minSampleMs = opts.minSampleMs ?? 1;
  const keys = Object.keys(cases) as K[];
  const batch = {} as Record<K, number>;
  const samples = {} as Record<K, number[]>;

  for (const k of keys) {
    const c = cases[k];
    let last = 0;
    for (let i = 0; i < warmup; i++) {
      last = await timeCalls(c, 1);
      if (c.reset) await c.reset();
    }
    batch[k] = c.reset || last >= minSampleMs ? 1 : Math.min(2000, Math.ceil(minSampleMs / Math.max(last, 0.0005)));
    if (batch[k] > 1) await timeCalls(c, batch[k]);
    samples[k] = [];
  }
  for (let r = 0; r < runs; r++) {
    for (const k of keys) {
      const c = cases[k];
      samples[k].push(await timeCalls(c, batch[k]));
      if (c.reset) await c.reset();
    }
  }
  const out = {} as Record<K, BenchStat>;
  for (const k of keys) out[k] = summarize(samples[k], batch[k]);
  return out;
}

export interface ScenarioSpec {
  id: string;
  title: string;
  /** `utils`: the exported functions alone. `component`: through the mounted component. */
  via: "utils" | "component";
  /** What grows with the model here; printed beside the numbers. */
  scalesWith: string;
  /**
   * Ceilings for [time(2,500) / time(500), time(10,000) / time(2,500)]. Set from
   * the recorded baseline with room for noise, and below what the next
   * complexity class up would give.
   */
  bounds: readonly [number, number];
  cases: Record<MapBenchSizeKey, BenchCase>;
  options?: BenchOptions;
  /** `false` keeps the result out of the published numbers (the gate's own self-test). */
  record?: boolean;
}

export interface ScenarioResult {
  id: string;
  title: string;
  via: "utils" | "component";
  scalesWith: string;
  sizes: Record<MapBenchSizeKey, BenchStat>;
  ratios: { midOverSmall: number; largeOverMid: number };
  bounds: { midOverSmall: number; largeOverMid: number };
  /** Measurement rounds taken; more than one means the first was over a bound. */
  attempts: number;
  pass: boolean;
}

/** A denominator below this is timer noise, not a measurement. */
const RATIO_FLOOR_MS = 0.0005;

function ratiosOf(sizes: Record<MapBenchSizeKey, BenchStat>) {
  return {
    midOverSmall: sizes.s2500.median / Math.max(sizes.s500.median, RATIO_FLOOR_MS),
    largeOverMid: sizes.s10000.median / Math.max(sizes.s2500.median, RATIO_FLOOR_MS),
  };
}

const recorded: ScenarioResult[] = [];

/**
 * Measures one scenario and checks its two ratios. A round over a bound is
 * measured again, twice at most, and the best round counts: noise only ever
 * adds time, and it adds it to one size at a time, so a real regression fails
 * all three rounds and a hiccup does not.
 */
export async function runScenario(spec: ScenarioSpec): Promise<ScenarioResult> {
  const bounds = { midOverSmall: spec.bounds[0], largeOverMid: spec.bounds[1] };
  let best: ScenarioResult | null = null;
  let bestScore = Infinity;
  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    const sizes = await measureCases(spec.cases, spec.options);
    const ratios = ratiosOf(sizes);
    const score = Math.max(ratios.midOverSmall / bounds.midOverSmall, ratios.largeOverMid / bounds.largeOverMid);
    if (score < bestScore) {
      bestScore = score;
      best = {
        id: spec.id,
        title: spec.title,
        via: spec.via,
        scalesWith: spec.scalesWith,
        sizes,
        ratios,
        bounds,
        attempts,
        pass: score <= 1,
      };
    }
    if (score <= 1) break;
  }
  const result = { ...best!, attempts };
  if (spec.record !== false) recorded.push(result);
  if (process.env.TUX_MAP_BENCH_PROFILE === spec.id) await profileCase(spec.id, spec.cases.s10000);
  return result;
}

/**
 * `bench-map.mjs --profile=<scenario>`: a V8 CPU profile of five calls of the
 * scenario at 10,000 symbols, written beside the results as
 * `<scenario>.cpuprofile` (open it in a browser's DevTools, Performance tab).
 * The untimed `reset` between calls is in the profile too.
 */
async function profileCase(id: string, c: BenchCase): Promise<void> {
  const dir = process.env.TUX_MAP_BENCH_OUT;
  if (!dir) return;
  const session = new Session();
  session.connect();
  const post = <T = unknown>(method: string, params?: object) =>
    new Promise<T>((resolve, reject) =>
      session.post(method as never, params as never, (err: Error | null, res: unknown) =>
        err ? reject(err) : resolve(res as T),
      ),
    );
  await post("Profiler.enable");
  await post("Profiler.setSamplingInterval", { interval: 100 });
  await post("Profiler.start");
  for (let i = 0; i < 5; i++) {
    const r = c.run();
    if (r) await r;
    if (c.reset) await c.reset();
  }
  const { profile } = await post<{ profile: unknown }>("Profiler.stop");
  session.disconnect();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${id}.cpuprofile`), JSON.stringify(profile));
}

/** One line a failing gate prints: the ratios, their ceilings and the medians behind them. */
export function describeScenario(r: ScenarioResult): string {
  const ms = (n: number) => (n < 1 ? n.toFixed(3) : n.toFixed(2));
  return (
    `${r.id}: 2,500/500 = ${r.ratios.midOverSmall.toFixed(2)} (ceiling ${r.bounds.midOverSmall}), ` +
    `10,000/2,500 = ${r.ratios.largeOverMid.toFixed(2)} (ceiling ${r.bounds.largeOverMid}); ` +
    `medians ${ms(r.sizes.s500.median)} / ${ms(r.sizes.s2500.median)} / ${ms(r.sizes.s10000.median)} ms ` +
    `after ${r.attempts} round${r.attempts === 1 ? "" : "s"}`
  );
}

/**
 * A fixed piece of work (sort and serialize 20,000 seeded records) timed the
 * same way. It is the unit `bench-map.mjs --compare` divides by, so numbers
 * from two machines can be read side by side. Nothing is gated on it.
 */
export async function measureReference(): Promise<BenchStat> {
  const rnd = createSeededRandom(7);
  const rows = Array.from({ length: 20000 }, (_, i) => ({ id: `row_${i}`, v: rnd.next(), tag: `t${i % 97}` }));
  let sink = 0;
  const stat = await measureCases({
    ref: {
      run: () => {
        const sorted = [...rows].sort((a, b) => a.v - b.v);
        sink += JSON.stringify(sorted).length + new Map(sorted.map((r) => [r.id, r])).size;
      },
    },
  });
  if (sink === 0) throw new Error("reference workload did no work");
  return stat.ref;
}

/**
 * Writes this process's results to `$TUX_MAP_BENCH_OUT/<suite>.json` when the
 * variable is set (`bench-map.mjs` sets it). Without it nothing is written:
 * a plain `npm test` only runs the gate.
 */
export function flushScenarioResults(suite: string, extra: Record<string, unknown> = {}): void {
  const dir = process.env.TUX_MAP_BENCH_OUT;
  if (!dir) return;
  mkdirSync(dir, { recursive: true });
  const models = mapBenchModels();
  writeFileSync(
    join(dir, `${suite}.json`),
    `${JSON.stringify(
      {
        suite,
        models: Object.fromEntries(MAP_BENCH_SIZES.map((s) => [s.key, { ...s, counts: models[s.key].counts }])),
        ...extra,
        scenarios: recorded,
      },
      null,
      2,
    )}\n`,
  );
}
