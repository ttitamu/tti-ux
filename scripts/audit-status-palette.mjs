#!/usr/bin/env node
/**
 * audit-status-palette.mjs — guard the operational status ramp.
 *
 * `themes.<t>.status` is the only colour family in tokens.json that is DERIVED
 * against explicit rules rather than sampled from brand artifacts, so it is the
 * only one that can be silently broken by a plausible-looking hand edit. This
 * re-derives the constraints from the authored values and fails on any breach.
 *
 * It is deliberately standalone: audit-contrast.mjs needs a full Nuxt build and
 * a headless browser, and only sees pairs the /contrast-audit page happens to
 * render. This needs neither, so it can gate every commit.
 *
 * The rules, and why each exists (see ADR-0013):
 *
 *   1. HUE IDENTITY. Hues track the colours Nagios Core ships — green #33FF00,
 *      yellow #FFFF00, orange #FF9900, red #F83838, grey #ACACAC — because
 *      that ordered ramp is muscle memory for operators. UNKNOWN carries a
 *      documented offset: stock sits at 64.6deg, brand gold at ~80deg, and in
 *      dark mode a stock-hue UNKNOWN chip read as a cousin of the gold keyline.
 *
 *   2. SEPARATION. Any two chips at least 0.075 apart in OKLab. A flat chip
 *      lightness once left UNKNOWN and CRITICAL 0.043 apart — pale orange
 *      beside pale salmon — which is indistinguishable at a glance.
 *
 *   3. SEVERITY ORDER. Chip lightness descends across the WARM hues —
 *      warning > unknown > critical — so severity reads as weight as well as
 *      hue, the channel that still works for a reader who cannot separate the
 *      hues at all. Deliberately not extended to ok: yellow's natural
 *      lightness is above green's, and forcing it below turns it olive.
 *
 *   4. BRAND DISTANCE. No status colour within 0.10 OKLab of brand maroon.
 *      An unconstrained solve once put CRITICAL at #77020b — 0.076 from maroon,
 *      i.e. "down" painted the colour of the chrome. Gold proximity is
 *      advisory: WARNING is yellow and TTI's yellow is gold, which is a
 *      coincidence of hue, not a collision of meaning.
 *
 *   5. WCAG 2.2. AA (4.5:1) is the floor for ink-on-fill and base-on-page;
 *      tti-hc is held to AAA (7:1). AAA elsewhere is reported, not enforced:
 *      the heaviest chips cannot reach it without undoing rule 3.
 *
 * Usage:  npm run audit:status
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(path.join(ROOT, "design/tokens.json"), "utf8"));

const STATES = ["ok", "warning", "unknown", "critical", "maintenance", "pending"];
const STOCK = {
  ok: "#33FF00", warning: "#FFFF00", unknown: "#FF9900",
  critical: "#F83838", pending: "#ACACAC",
  // Nagios ships no maintenance colour — it is not a point on the severity
  // ramp, it is "expected, not a fault". It takes TTI's own blue instead:
  // brand.secondary #15457E, whose hue is far from all five severity hues.
  maintenance: "#15457E",
};
const HUE_TOLERANCE = 14;           // degrees
const HUE_OFFSET = { unknown: -12.6 };
const MIN_PAIR = 0.075;
const MIN_BRAND = 0.10;
const AA = 4.5;
const AAA = 7.0;

// --- colour maths (sRGB <-> OKLab, WCAG) ------------------------------------
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const hexToRgb = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
};
function oklab([r, g, b]) {
  const [R, G, B] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const hue = (rgb) => { const [, a, b] = oklab(rgb); return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360; };
const lightness = (rgb) => oklab(rgb)[0];
const dist = (p, q) => Math.hypot(...oklab(p).map((v, i) => v - oklab(q)[i]));
const lum = ([r, g, b]) => { const [R, G, B] = [r, g, b].map(toLinear); return 0.2126 * R + 0.7152 * G + 0.0722 * B; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)]; const [hi, lo] = x > y ? [x, y] : [y, x]; return (hi + 0.05) / (lo + 0.05); };
const hueDelta = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

// --- token resolution -------------------------------------------------------
function resolve(ref, theme) {
  let v = typeof ref === "object" && ref !== null && "$value" in ref ? ref.$value : ref;
  let guard = 0;
  while (typeof v === "string" && v.startsWith("{")) {
    if (++guard > 8) throw new Error(`alias cycle at ${ref}`);
    const parts = v.slice(1, -1).split(".");
    let node = tokens;
    for (const p of parts) node = node?.[p];
    if (node === undefined) throw new Error(`unresolved alias ${v}`);
    v = typeof node === "object" && "$value" in node ? node.$value : node;
  }
  return v;
}
const statusOf = (theme, key) => resolve(tokens.themes[theme].status[key], theme);
function surfaceOf(theme) {
  const t = tokens.themes[theme];
  return resolve(t.surface?.page ?? tokens.themes.tti.surface.page, theme);
}

// --- run --------------------------------------------------------------------
const failures = [];
const advisories = [];
let checks = 0;
const fail = (m) => failures.push(m);
const pass = () => checks++;

const MAROON = hexToRgb(resolve(tokens.color.tti.maroon, "tti"));
const GOLD = hexToRgb(resolve(tokens.color.tti.gold, "tti"));

for (const theme of ["tti", "tti-dark", "tti-hc"]) {
  if (!tokens.themes[theme]?.status) { fail(`${theme}: no status block`); continue; }
  const page = hexToRgb(surfaceOf(theme));
  const outlined = theme === "tti-hc";
  const target = outlined ? AAA : AA;
  const chips = {};
  const lights = {};
  console.log(`\n=== ${theme} ===`);

  for (const state of STATES) {
    const base = hexToRgb(statusOf(theme, state));
    const fill = hexToRgb(statusOf(theme, `${state}-fill`));
    const ink = hexToRgb(statusOf(theme, `${state}-ink`));
    chips[state] = outlined ? base : fill;
    lights[state] = lightness(fill);

    // 1. hue identity (achromatic states exempt)
    if (state !== "pending") {
      const want = (hue(hexToRgb(STOCK[state])) + (HUE_OFFSET[state] ?? 0) + 360) % 360;
      for (const [role, rgb] of [["base", base], ["fill", fill]]) {
        if (outlined && role === "fill") continue; // fill is the page surface
        const d = hueDelta(hue(rgb), want);
        d <= HUE_TOLERANCE
          ? pass()
          : fail(`${theme} ${state} ${role}: hue ${hue(rgb).toFixed(1)}deg is ${d.toFixed(1)}deg from the Nagios hue ${want.toFixed(1)}deg (tolerance ${HUE_TOLERANCE})`);
      }
    }

    // 5. WCAG
    const inkRatio = contrast(ink, fill);
    const baseRatio = contrast(base, page);
    inkRatio >= target ? pass() : fail(`${theme} ${state}: ink on fill ${inkRatio.toFixed(2)}:1 below ${target}`);
    baseRatio >= target ? pass() : fail(`${theme} ${state}: base on page ${baseRatio.toFixed(2)}:1 below ${target}`);

    // 4. brand distance
    for (const [role, rgb] of [["base", base], ["fill", fill]]) {
      const dm = dist(rgb, MAROON);
      dm >= MIN_BRAND
        ? pass()
        : fail(`${theme} ${state} ${role} is ${dm.toFixed(3)} from brand maroon (floor ${MIN_BRAND})`);
      const dg = dist(rgb, GOLD);
      if (dg < MIN_BRAND && state !== "warning") advisories.push(`${theme} ${state} ${role} is ${dg.toFixed(3)} from brand gold`);
    }

    console.log(
      `  ${state.padEnd(9)} base ${statusOf(theme, state).padEnd(8)} ${baseRatio.toFixed(2).padStart(6)}:1` +
      `   fill ${statusOf(theme, `${state}-fill`).padEnd(18)} ink ${inkRatio.toFixed(2).padStart(6)}:1` +
      `${inkRatio >= AAA && baseRatio >= AAA ? "  AAA" : ""}`
    );
  }

  // 2. separation
  let worst = [Infinity, "", ""];
  for (let i = 0; i < STATES.length; i++)
    for (let j = i + 1; j < STATES.length; j++) {
      const d = dist(chips[STATES[i]], chips[STATES[j]]);
      if (d < worst[0]) worst = [d, STATES[i], STATES[j]];
    }
  worst[0] >= MIN_PAIR
    ? pass()
    : fail(`${theme} ${worst[1]}/${worst[2]} are ${worst[0].toFixed(3)} apart (floor ${MIN_PAIR})`);
  console.log(`  closest pair: ${worst[1]}/${worst[2]} = ${worst[0].toFixed(3)} OKLab`);

  // 3. severity order (filled themes only — outlined chips share one fill).
  //
  //    WARM HUES ONLY. This rule started as ok > warning > unknown > critical
  //    and that was wrong: sRGB gives each hue a very different lightness at
  //    full chroma (yellow ~0.97, green ~0.87, orange ~0.77, red ~0.64), so a
  //    monotonic ramp across all four forces yellow below green — where it
  //    stops being yellow and turns olive. Hue identity outranks weight
  //    ordering. The ordering exists to keep ADJACENT WARM hues apart, which
  //    is where the collision actually was (orange beside salmon); green is
  //    far enough away in hue that its weight does not matter.
  if (!outlined) {
    const order = ["warning", "unknown", "critical"];
    for (let i = 0; i < order.length - 1; i++) {
      lights[order[i]] > lights[order[i + 1]]
        ? pass()
        : fail(`${theme}: ${order[i]} fill is not lighter than ${order[i + 1]} — severity must descend in weight`);
    }
  }
}

if (advisories.length) {
  console.log("\nAdvisories (not failures):");
  for (const a of advisories) console.log(`  ~~ ${a}`);
}
if (failures.length) {
  console.error("\n✗ audit:status — the status ramp broke its rules:");
  for (const f of failures) console.error(`  ${f}`);
  console.error("\nSee docs/adr/0013-operational-status-ramp.md for what each rule protects.");
  process.exit(1);
}
console.log(`\n✓ audit:status OK — ${checks} assertions across tti, tti-dark, tti-hc.`);
