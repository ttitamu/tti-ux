/**
 * Demo data for /visualizations/chart-heatmap. Deterministic (seeded
 * PRNG, no Date/Math.random at module scope) so SSR and CSR render
 * the identical matrix — the house hydration discipline.
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

export const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const heatmapHours = Array.from({ length: 24 }, (_, h) => {
  if (h === 0) return "12a";
  if (h < 12) return `${h}a`;
  if (h === 12) return "12p";
  return `${h - 12}p`;
});

/** Crash counts by day-of-week × hour: AM/PM commute peaks on
 *  weekdays, a flat late-night weekend shelf. */
export const crashMatrix: number[][] = (() => {
  const rand = mulberry32(20260819);
  return heatmapDays.map((_, day) => {
    const weekday = day < 5;
    return heatmapHours.map((_, hour) => {
      const am = Math.exp(-((hour - 8) ** 2) / 4.5);
      const pm = Math.exp(-((hour - 17) ** 2) / 5.5);
      const lateNight = Math.exp(-(((hour + 24 - 25) % 24) ** 2) / 8);
      const base = weekday
        ? 4 + 34 * am + 42 * pm + 6 * lateNight
        : 6 + 8 * am + 12 * pm + 22 * lateNight;
      return Math.max(0, Math.round(base + (rand() - 0.5) * 6));
    });
  });
})();

export const corridorNames = ["I-35 Austin", "I-45 Houston", "US-75 Dallas", "I-10 San Antonio", "I-27 Lubbock"];

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Travel-time index by corridor × month; two sensor outages leave
 *  honest null holes. */
export const ttiMatrix: Array<Array<number | null>> = (() => {
  const rand = mulberry32(35);
  const summerBump = (m: number) => 0.08 * Math.exp(-((m - 6.5) ** 2) / 6);
  const severity = [0.42, 0.35, 0.26, 0.2, 0.05];
  const matrix: Array<Array<number | null>> = corridorNames.map((_, c) =>
    monthNames.map((_, m) =>
      Number((1.08 + severity[c]! + summerBump(m) + (rand() - 0.5) * 0.07).toFixed(2)),
    ),
  );
  matrix[1]![3] = null; // I-45 sensor outage, April
  matrix[4]![9] = null; // I-27 sensor outage, October
  return matrix;
})();
