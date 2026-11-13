/**
 * A card the highlight does not reach fades by colour, not by opacity (#229).
 *
 * At opacity 0.28 a faded card let the wires behind it show through (they are drawn at 0.6 in the
 * same layer), its text fell to about 2:1 on the canvas, and each card was its own opacity group
 * to paint. A faded card now keeps an opaque surface mixed toward the canvas colour, a quieter
 * border, diagonal hatching under its text so the fade shows by a pattern and not by a shade alone
 * (1.4.1), and --text-secondary for all its text, which holds 7:1 on a hatch line as well as between
 * them. The legend's swatch is hatched the same; the overview's faded cards fade by colour.
 *
 * Both halves read the source: the rules from the component's stylesheet, the colours from the
 * TUX token files of the four themes, with `var()` and `color-mix(in srgb, …)` worked out here.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
const uncomment = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const styleOf = (sfc: string) => uncomment(sfc.slice(sfc.lastIndexOf("<style")).replace(/^<style[^>]*>/, ""));

const MAP = styleOf(read("packages/diagrams/app/components/TuxArchitectureMap.vue"));
const MINIMAP = styleOf(read("packages/diagrams/app/utils/internal/TuxArchitectureMapMinimap.vue"));

type Rule = { selectors: string[]; body: string };

/** Every innermost rule of a stylesheet (an at-rule's own rules included). */
function rules(css: string): Rule[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
    selectors: m[1]!.split(",").map((s) => s.trim().replace(/\s+/g, " ")),
    body: m[2]!,
  }));
}

function declarationsOf(css: string, selector: string): string {
  return rules(css)
    .filter((r) => r.selectors.includes(selector))
    .map((r) => r.body)
    .join(";");
}

function property(body: string, name: string): string | undefined {
  const all = [...body.matchAll(new RegExp(`(?:^|[;\\s])${name.replace(/[-]/g, "\\-")}\\s*:\\s*([^;]+)`, "g"))];
  return all.at(-1)?.[1]?.replace(/!important/, "").trim();
}

/** The opacities a body sets, as numbers. */
const opacities = (body: string) => [...body.matchAll(/(?:^|[;\s])opacity\s*:\s*([\d.]+)/g)].map((m) => Number(m[1]));

// --- the four themes' tokens -------------------------------------------------------------------

function block(css: string, head: string): string {
  const at = css.indexOf(head);
  if (at === -1) throw new Error(`no block ${head}`);
  const open = css.indexOf("{", at);
  return css.slice(open + 1, css.indexOf("}", open));
}

function customProperties(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of uncomment(body).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]!] = m[2]!.replace(/!important/, "").trim();
  return out;
}

const TOKENS = read("app/assets/css/tokens.css");
const GLOBALS = read("app/assets/css/globals.css");
const BASE = customProperties(block(TOKENS, ':root,\n[data-theme="tti"]'));
const THEMES: Record<string, Record<string, string>> = {
  tti: BASE,
  "tti-dark": { ...BASE, ...customProperties(block(TOKENS, '[data-theme="tti-dark"] {')) },
  "tti-soft-dark": { ...BASE, ...customProperties(block(GLOBALS, '[data-theme="tti-dark"][data-theme-variant="soft"],')) },
  "tti-hc": { ...BASE, ...customProperties(block(TOKENS, '[data-theme="tti-hc"] {')) },
};

type RGB = [number, number, number];

function hex(v: string): RGB {
  let h = v.trim().replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[\da-f]{6}$/i.test(h)) throw new Error(`not a colour: ${v}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
}

/** Split at the commas of this level, not of a nested function. */
function args(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  return [...out, cur.trim()];
}

/** A colour value worked out in a theme: `#hex`, `var(--x[, fallback])`, `color-mix(in srgb, …)`. */
function colour(value: string, vars: Record<string, string>, scope: Record<string, string> = {}): RGB {
  const v = value.trim();
  const fn = /^([\w-]+)\(([\s\S]*)\)$/.exec(v);
  if (!fn) return hex(v);
  const [, name, inner] = fn;
  const parts = args(inner!);
  if (name === "var") {
    const own = scope[parts[0]!] ?? vars[parts[0]!];
    if (own !== undefined) return colour(own, vars, scope);
    if (parts[1] !== undefined) return colour(parts[1], vars, scope);
    throw new Error(`${parts[0]} is not defined`);
  }
  if (name === "color-mix") {
    expect(parts[0]).toBe("in srgb");
    const [a, pa] = /^(.*?)(?:\s+([\d.]+)%)?$/.exec(parts[1]!)!.slice(1);
    const [b, pb] = /^(.*?)(?:\s+([\d.]+)%)?$/.exec(parts[2]!)!.slice(1);
    const p = pa !== undefined ? Number(pa) / 100 : pb !== undefined ? 1 - Number(pb) / 100 : 0.5;
    const ca = colour(a!, vars, scope);
    const cb = colour(b!, vars, scope);
    return [0, 1, 2].map((i) => ca[i]! * p + cb[i]! * (1 - p)) as RGB;
  }
  throw new Error(`cannot work out ${v}`);
}

const luminance = (c: RGB) =>
  c
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    .reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i]!, 0);

function ratio(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

// --- the rules ---------------------------------------------------------------------------------

const FADED = ".tux-map__stage--dim .tux-map__el:not(.tux-map__el--lit)";
/** The map's own custom properties, from its root rule. */
const MAP_VARS = customProperties(declarationsOf(MAP, ".tux-map"));

describe("TuxArchitectureMap: a faded card fades by colour, not by opacity (#229)", () => {
  it("sets no opacity under 1 on a faded card, on anything inside one, on the swatch or the overview", () => {
    const faded = rules(MAP).filter((r) => r.selectors.some((s) => s.startsWith(FADED)));
    // the card, its planned variant, its text and its chips
    expect(faded.length).toBeGreaterThanOrEqual(3);
    for (const r of faded) for (const o of opacities(r.body)) expect(o, r.selectors.join(", ")).toBeGreaterThanOrEqual(1);
    for (const o of opacities(declarationsOf(MAP, ".tux-map__swatch--faded"))) expect(o).toBeGreaterThanOrEqual(1);
    for (const o of opacities(declarationsOf(MINIMAP, ".tux-map__minimap-card--faded"))) expect(o).toBeGreaterThanOrEqual(1);
    // and the opacity is not hidden in a filter or a background with alpha either
    for (const r of faded) expect(r.body).not.toMatch(/filter\s*:|transparent|rgba\(/);
  });

  it("keeps the card's surface opaque, mixed toward the canvas, and the planned card dashed", () => {
    const card = declarationsOf(MAP, FADED);
    expect(property(card, "background-color")).toBe("var(--tux-map-faded-surface)");
    expect(property(card, "background-image")).toBe("var(--tux-map-faded-pattern)");
    expect(property(card, "border-color")).toBe("var(--tux-map-faded-border)");
    // the canvas is the viewport's own colour
    expect(property(declarationsOf(MAP, ".tux-map__viewport"), "background")).toBe("var(--surface-sunken)");
    expect(MAP_VARS["--tux-map-faded-surface"]).toMatch(/^color-mix\(in srgb, var\(--surface-raised\) [\d.]+%, var\(--surface-sunken\)\)$/);
    // the hatch: opaque stripes of the faded surface and a line colour mixed into it, never a gap
    expect(MAP_VARS["--tux-map-faded-hatch"]).toMatch(/^color-mix\(in srgb, var\(--text-muted\) [\d.]+%, var\(--tux-map-faded-surface\)\)$/);
    const pattern = MAP_VARS["--tux-map-faded-pattern"]!.replace(/\s+/g, " ");
    expect(pattern).toMatch(/^repeating-linear-gradient\( ?-?\d+deg, var\(--tux-map-faded-hatch\) 0 [\d.]+px, var\(--tux-map-faded-surface\) [\d.]+px [\d.]+px ?\)$/);
    expect(pattern).not.toMatch(/transparent|rgba\(/);
    // a planned card is hatched as the others are (no rule of its own resets the pattern) and keeps its dashes
    expect(declarationsOf(MAP, ".tux-map__stage--dim .tux-map__el--st-planned:not(.tux-map__el--lit)")).toBe("");
    const plannedOwn = declarationsOf(MAP, ".tux-map__el--st-planned");
    expect(property(plannedOwn, "border")).toMatch(/dashed/);
    expect(plannedOwn).not.toMatch(/background-(image|color)\s*:/);
    // the key draws the card it names
    const swatch = declarationsOf(MAP, ".tux-map__swatch--faded");
    expect(property(swatch, "background-color")).toBe("var(--tux-map-faded-surface)");
    expect(property(swatch, "background-image")).toBe("var(--tux-map-faded-pattern)");
    expect(property(swatch, "border-color")).toBe("var(--tux-map-faded-border)");
    expect(property(declarationsOf(MINIMAP, ".tux-map__minimap-card--faded"), "fill")).toMatch(/^color-mix\(in srgb, /);
  });

  describe.each(Object.keys(THEMES))("in %s", (theme) => {
    const vars = THEMES[theme]!;
    const c = (v: string) => colour(v, vars, MAP_VARS);
    let surface: RGB;
    let hatch: RGB;
    let canvas: RGB;
    beforeEach(() => {
      surface = c("var(--tux-map-faded-surface)");
      hatch = c("var(--tux-map-faded-hatch)");
      canvas = c("var(--surface-sunken)");
    });

    it("holds its text at 7:1 or more on the faded surface and on a hatch line", () => {
      const name = property(declarationsOf(MAP, `${FADED} .tux-map__el-nm`), "color")!;
      const lines = property(declarationsOf(MAP, `${FADED} .tux-map__el-ty`), "color")!;
      expect(name).toBe("var(--text-secondary)");
      expect(lines).toBe("var(--text-secondary)");
      for (const ground of [surface, hatch]) {
        expect(ratio(c(name), ground)).toBeGreaterThanOrEqual(7);
        expect(ratio(c(lines), ground)).toBeGreaterThanOrEqual(7);
      }
      // a chip's text on its own plain fill, which covers the hatch
      const chip = declarationsOf(MAP, `${FADED} .tux-map__chip`);
      expect(ratio(c(property(chip, "color")!), c(property(chip, "background")!))).toBeGreaterThanOrEqual(7);
    });

    it("draws hatch lines that show (1.2:1 or more on the surface) and stay quieter than the text", () => {
      expect(ratio(hatch, surface)).toBeGreaterThanOrEqual(1.2);
      expect(ratio(hatch, surface)).toBeLessThan(1.5);
    });

    it("steps back from a resting card: a surface nearer the canvas, a border no louder", () => {
      const raised = c("var(--surface-raised)");
      expect(ratio(surface, canvas)).toBeLessThanOrEqual(ratio(raised, canvas));
      const border = c("var(--tux-map-faded-border)");
      expect(ratio(border, canvas)).toBeLessThanOrEqual(ratio(c("var(--surface-border)"), canvas) + 1e-9);
      // the high-contrast theme's border is the card's edge: it keeps 3:1 on the canvas (1.4.11)
      if (theme === "tti-hc") expect(ratio(border, canvas)).toBeGreaterThanOrEqual(3);
    });
  });
});
