/**
 * Demo data for /visualizations/chart-histogram. Deterministic
 * (seeded PRNG + Box–Muller, no Math.random at module scope) so SSR
 * and CSR agree — the house hydration discipline.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(rand: () => number): [number, number] {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
}

/** 240 corridor travel-time observations (minutes) — right-skewed
 *  lognormal, the shape real travel times take: a tight free-flow
 *  cluster and a long incident tail. */
export const travelTimes: number[] = (() => {
  const rand = mulberry32(3548);
  const out: number[] = [];
  while (out.length < 240) {
    const [z1, z2] = gaussianPair(rand);
    for (const z of [z1, z2]) {
      if (out.length >= 240) break;
      out.push(Number(Math.exp(3.05 + 0.28 * z).toFixed(1)));
    }
  }
  return out;
})();

/** 180 signalized-intersection delay observations (seconds) — a
 *  near-normal spread for the normalized-share demo. */
export const controlDelays: number[] = (() => {
  const rand = mulberry32(97);
  const out: number[] = [];
  while (out.length < 180) {
    const [z1, z2] = gaussianPair(rand);
    for (const z of [z1, z2]) {
      if (out.length >= 180) break;
      out.push(Number(Math.max(2, 34 + 9 * z).toFixed(1)));
    }
  }
  return out;
})();
