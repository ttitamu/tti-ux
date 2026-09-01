/**
 * scripts/build-powerbi-theme.mjs — generate Power BI report themes from
 * design/tokens.json.
 *
 * Emits kit/powerbi/tti-theme.json (light), tti-theme-dark.json, and
 * tti-theme-hc.json (high contrast). A report theme is the ONLY
 * standardisation surface Power BI gives you that needs no tooling on
 * the consuming end: a report author imports one file and every native
 * visual inherits the system.
 *
 * v2 (this file) emits a COMPLETE theme, not the colours-and-fonts
 * skeleton v1 shipped:
 *   - $schema + baseTheme pin  — v1 had neither, so themes silently
 *     inherited whichever base theme the consuming report carried. Since
 *     Fluent 2 (GA Aug 2026) changed padding, corner radius, canvas size
 *     and title defaults, that is now a visible difference, not a
 *     theoretical one.
 *   - structural colours (firstLevelElements..fourthLevelElements,
 *     secondaryBackground, sentiment, divergent, hyperlink, shapeStroke)
 *     — v1 emitted 3 of the 42 legal colour keys.
 *   - visualStyles across the chart families TUX ships components for,
 *     so a Power BI report and a TUX web page render the same system.
 *
 * v1 also emitted a `_generated` provenance key. The theme schema is
 * additionalProperties:false with exactly 42 named properties, so that
 * key made every emitted theme technically invalid. Provenance now lives
 * in kit/powerbi/README.md and the lock test, where it cannot break a
 * consumer.
 *
 * DOCTRINE — Tier 1 of the two-tier kit pipeline (design/kit-pipeline.md):
 * deterministic, no AI, same input same bytes forever. Every literal
 * below resolves from design/tokens.json; nothing is hand-mixed. Schema
 * URLs and base-theme names come from scripts/pbir-schema-lock.mjs.
 * `tests/tux-kit-targets.test.ts` locks the committed output.
 *
 * Run via `npm run build:powerbi` (part of `npm run build:kit`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { THEME_SCHEMA_URL, BASE_THEMES } from "./pbir-schema-lock.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const tokens = JSON.parse(
  fs.readFileSync(path.join(ROOT, "design/tokens.json"), "utf8"),
);

const val = (node) => (node && typeof node === "object" ? node.$value : node);

function resolveRef(v, theme, seen = new Set()) {
  if (typeof v !== "string") return v;
  const alias = v.match(/^\{([^}]+)\}$/);
  const cssVar = v.match(/^var\(--([a-z0-9-]+)\)$/);
  if (cssVar) {
    // A stored CSS-var literal like var(--brand-primary): resolve against
    // the same theme's groups (brand-primary → theme.brand.primary).
    const name = cssVar[1];
    for (const group of ["brand", "surface", "text", "semantic"]) {
      for (const key of Object.keys(theme[group] ?? {})) {
        if (`${group}-${key}` === name) {
          return resolveRef(val(theme[group][key]), theme, seen);
        }
      }
    }
    throw new Error(`unresolvable css-var reference: ${v}`);
  }
  if (!alias) return v;
  const pathStr = alias[1];
  if (seen.has(pathStr)) throw new Error(`circular reference: ${pathStr}`);
  seen.add(pathStr);
  let node = tokens;
  for (const key of pathStr.split(".")) {
    node = node?.[key];
    if (node == null) throw new Error(`unresolvable reference: {${pathStr}}`);
  }
  return resolveRef(val(node), theme, seen);
}

// Fonts: Power BI wants family names, not CSS stacks.
const family = (stack) =>
  resolveRef(stack, tokens.themes.tti).match(/^"?([^",]+)/)[1];
const FONT_BODY = family(val(tokens.globals.font.body)); // Open Sans
const FONT_BOLD = family(val(tokens.globals.font.bold)); // Work Sans
const FONT_DISPLAY = family(val(tokens.globals.font.display)); // Oswald

/**
 * Resolve one theme to the flat literal palette every emitted artifact
 * draws from. Exported so scripts/build-pbir-components.mjs binds the
 * SAME literals into PBIR fragments — one resolution path, so a theme
 * and its fragments cannot disagree.
 */
export function palette(themeName) {
  const theme = tokens.themes[themeName];
  if (!theme) throw new Error(`unknown theme: ${themeName}`);
  const r = (v) => resolveRef(v, theme);

  const chart = Object.keys(theme.chart)
    .filter((k) => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => r(val(theme.chart[k])));

  return {
    chart,
    // Surfaces. `raised` is the visual/card fill; `sunken` is the page
    // canvas behind it, which is what produces the card-on-tray read.
    raised: r(val(theme.surface.raised)),
    sunken: r(val(theme.surface.sunken)),
    page: r(val(theme.surface.page)),
    border: r(val(theme.surface.border)),
    borderSubtle: r(val(theme.surface["border-subtle"])),
    // Text.
    textPrimary: r(val(theme.text.primary)),
    textSecondary: r(val(theme.text.secondary)),
    textMuted: r(val(theme.text.muted)),
    textOnBrand: r(val(theme.text["on-brand"])),
    // Brand. `primary` is theme-adapted (maroon light, teal dark) and is
    // the data-ink anchor; `fill` is the theme-INVARIANT maroon used for
    // brand surfaces like mastheads, per the on-brand rule.
    brandPrimary: r(val(theme.brand.primary)),
    brandPrimaryDeep: r(val(theme.brand["primary-deep"])),
    brandAccent: r(val(theme.brand.accent)),
    brandFill: r(val(theme.brand.fill)),
    // Semantic.
    success: r(val(theme.semantic.success)),
    warning: r(val(theme.semantic.warning)),
    error: r(val(theme.semantic.error)),
  };
}

// ---------------------------------------------------------------------------
// visualStyles value encoders
//
// The theme JSON uses TWO different encodings and mixing them up is a
// silent no-op rather than an error:
//   colours  ->  { "solid": { "color": "#RRGGBB" } }        (plain)
//   scalars  ->  { "expr": { "Literal": { "Value": "…" } } } (wrapped)
// and inside a Literal, the suffix carries the type: 'text' for string,
// 10D for double, 8L for integer, bare true/false for boolean.
// ---------------------------------------------------------------------------

const solid = (color) => ({ solid: { color } });
const litStr = (v) => ({ expr: { Literal: { Value: `'${v}'` } } });
const litNum = (v) => ({ expr: { Literal: { Value: `${v}D` } } });
const litInt = (v) => ({ expr: { Literal: { Value: `${v}L` } } });
const litBool = (v) => ({ expr: { Literal: { Value: String(v) } } });

/** Fully transparent, in Power BI's #AARRGGBB spelling. */
const TRANSPARENT = "#00FFFFFF";

const TYPE = { axis: 10, label: 9, header: 11, total: 10 };

function visualStyles(p) {
  // Shared card bodies, so every chart family agrees.
  const axis = (opts = {}) => [
    {
      properties: {
        fontFamily: litStr(FONT_BODY),
        fontSize: litNum(TYPE.axis),
        fontColor: solid(p.textSecondary),
        // Axis titles off: the field name is almost always redundant
        // with the visual title, and Fluent 2 already defaults them off.
        showAxisTitle: litBool(false),
        ...opts,
      },
    },
  ];

  const legend = [
    {
      properties: {
        fontFamily: litStr(FONT_BODY),
        fontSize: litNum(TYPE.label),
        labelColor: solid(p.textSecondary),
        position: litStr("Top"),
        showTitle: litBool(false),
      },
    },
  ];

  const labels = [
    {
      properties: {
        fontFamily: litStr(FONT_BODY),
        fontSize: litNum(TYPE.label),
        color: solid(p.textSecondary),
      },
    },
  ];

  // Cartesian family: category axis carries no gridlines, value axis
  // does. One horizontal rule per value step is enough to read a bar
  // against; vertical rules just add ink (design/chart-foundations.md §2).
  const cartesian = {
    "*": {
      categoryAxis: axis({ gridlineShow: litBool(false) }),
      valueAxis: axis({
        gridlineShow: litBool(true),
        gridlineColor: solid(p.borderSubtle),
        gridlineThickness: litNum(1),
        gridlineStyle: litStr("solid"),
      }),
      legend,
      labels,
    },
  };

  const cartesianStyles = Object.fromEntries(
    [
      "lineChart",
      "areaChart",
      "stackedAreaChart",
      "barChart",
      "columnChart",
      "clusteredBarChart",
      "clusteredColumnChart",
      "hundredPercentStackedBarChart",
      "hundredPercentStackedColumnChart",
      "lineClusteredColumnComboChart",
      "lineStackedColumnComboChart",
      "ribbonChart",
      "scatterChart",
      "waterfallChart",
    ].map((k) => [k, cartesian]),
  );

  return {
    // Page canvas. Cards sit on `raised`, so the canvas is `sunken`.
    page: {
      "*": {
        background: [
          { properties: { color: solid(p.sunken), transparency: litNum(0) } },
        ],
        wallpaper: [
          { properties: { color: solid(p.sunken), transparency: litNum(0) } },
        ],
      },
    },

    // DELIBERATELY NO global "*" visual entry.
    //
    // Card chrome (background / border / shadow / padding on every
    // content visual) is NOT set here. Two reasons, both load-bearing:
    //
    //  1. The global "*" is the one node where the theme schema is
    //     strict: it takes bare string/number/boolean or a fill, and
    //     rejects the `properties:` wrapper that every named visual
    //     uses. Named-visual cards are effectively unvalidated, so the
    //     wrong shape there passes the schema and then silently no-ops
    //     in Desktop — the worst failure mode available.
    //  2. Chrome that has to respond to the in-report light/dark toggle
    //     must bind to DAX measures, which a theme file cannot express
    //     (Microsoft: "You can't add conditional formatting rules to a
    //     custom theme"). It therefore belongs in the PBIR fragment
    //     kit/powerbi/pbir/fragments/*/card-chrome.json, applied per
    //     visual as visualContainerObjects.
    //
    // The theme owns colour, type and per-visual-type style. The PBIR
    // fragments own chrome. That split is why both can stay Tier-1.
    ...cartesianStyles,

    donutChart: {
      "*": {
        legend,
        labels,
        slices: [{ properties: { innerRadiusRatio: litNum(60) } }],
      },
    },
    pieChart: { "*": { legend, labels } },
    treemap: { "*": { legend, labels } },
    funnel: { "*": { labels } },

    gauge: {
      "*": {
        labels: [
          {
            properties: {
              fontFamily: litStr(FONT_DISPLAY),
              color: solid(p.brandPrimary),
            },
          },
        ],
        calloutValue: [
          {
            properties: {
              fontFamily: litStr(FONT_DISPLAY),
              color: solid(p.brandPrimary),
            },
          },
        ],
      },
    },

    // Modern card. The legacy `card` visual is kept in step because
    // reports predating cardVisual are still in the estate.
    cardVisual: {
      "*": {
        calloutValue: [
          {
            properties: {
              fontFamily: litStr(FONT_DISPLAY),
              color: solid(p.brandPrimary),
            },
          },
        ],
        label: [
          {
            properties: {
              fontFamily: litStr(FONT_BODY),
              fontSize: litNum(TYPE.label),
              color: solid(p.textSecondary),
            },
          },
        ],
      },
    },
    card: {
      "*": {
        labels: [
          {
            properties: {
              fontFamily: litStr(FONT_DISPLAY),
              color: solid(p.brandPrimary),
            },
          },
        ],
        categoryLabels: [
          {
            properties: {
              fontFamily: litStr(FONT_BODY),
              fontSize: litNum(TYPE.label),
              color: solid(p.textSecondary),
            },
          },
        ],
      },
    },
    kpi: {
      "*": {
        indicator: [
          {
            properties: {
              fontFamily: litStr(FONT_DISPLAY),
              color: solid(p.brandPrimary),
            },
          },
        ],
        trendline: [{ properties: { color: solid(p.brandAccent) } }],
      },
    },

    // Tables. The brand bar is the header RULE, not a filled header
    // band: a solid maroon header on every table is a lot of brand ink
    // per page, and it fights the card chrome.
    tableEx: {
      "*": {
        columnHeaders: [
          {
            properties: {
              fontFamily: litStr(FONT_BOLD),
              fontSize: litNum(TYPE.header),
              fontColor: solid(p.textPrimary),
              backColor: solid(p.raised),
              outlineColor: solid(p.brandPrimary),
              outlineWeight: litInt(2),
            },
          },
        ],
        values: [
          {
            properties: {
              fontFamily: litStr(FONT_BODY),
              fontSize: litNum(TYPE.label),
              fontColor: solid(p.textPrimary),
              backColor: solid(p.raised),
              backColorAlternate: solid(p.sunken),
            },
          },
        ],
        grid: [
          {
            properties: {
              gridHorizontal: litBool(true),
              gridHorizontalColor: solid(p.borderSubtle),
              gridVertical: litBool(false),
              outlineColor: solid(p.border),
            },
          },
        ],
        total: [
          {
            properties: {
              fontFamily: litStr(FONT_BOLD),
              fontSize: litNum(TYPE.total),
              fontColor: solid(p.textPrimary),
              backColor: solid(p.sunken),
            },
          },
        ],
      },
    },

    slicer: {
      "*": {
        header: [
          {
            properties: {
              fontFamily: litStr(FONT_BOLD),
              fontSize: litNum(TYPE.label),
              fontColor: solid(p.textPrimary),
            },
          },
        ],
        items: [
          {
            properties: {
              fontFamily: litStr(FONT_BODY),
              fontSize: litNum(TYPE.label),
              fontColor: solid(p.textSecondary),
              background: solid(TRANSPARENT),
            },
          },
        ],
      },
    },

    actionButton: {
      "*": {
        text: [
          {
            properties: {
              fontFamily: litStr(FONT_BOLD),
              fontSize: litNum(TYPE.label),
            },
          },
        ],
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Theme document
// ---------------------------------------------------------------------------

const THEME_NAMES = {
  tti: "TTI (tux)",
  "tti-dark": "TTI Dark (tux)",
  "tti-hc": "TTI High Contrast (tux)",
};

export function buildTheme(themeName) {
  const p = palette(themeName);

  return {
    $schema: THEME_SCHEMA_URL,
    name: THEME_NAMES[themeName],
    // Pin the base theme this was authored against. Without it the theme
    // inherits whatever the consuming report carries, and Fluent 2 vs
    // Classic differ in padding, radius, canvas size and title defaults.
    baseTheme: BASE_THEMES.fluent2,

    dataColors: p.chart,

    // Structural.
    background: p.raised,
    secondaryBackground: p.sunken,
    foreground: p.textPrimary,
    firstLevelElements: p.textPrimary,
    secondLevelElements: p.textSecondary,
    thirdLevelElements: p.border,
    fourthLevelElements: p.textMuted,
    tableAccent: p.brandPrimary,
    shapeStroke: p.border,
    disabledText: p.textMuted,
    hyperlink: p.brandPrimary,
    visitedHyperlink: p.brandPrimaryDeep,

    // Sentiment.
    good: p.success,
    neutral: p.textMuted,
    bad: p.error,

    // Divergent (conditional-formatting ramps). Deliberately a
    // brand-anchored SEQUENTIAL ramp — empty → gold → maroon — rather
    // than red↔green: "high" is not reliably "good", and baking that
    // judgement into the theme mislabels every heatmap where it isn't.
    minimum: p.sunken,
    center: p.brandAccent,
    maximum: p.brandPrimary,
    null: p.borderSubtle,

    textClasses: {
      title: { fontFace: FONT_BOLD, color: p.textPrimary, fontSize: 12 },
      callout: { fontFace: FONT_DISPLAY, color: p.textPrimary, fontSize: 40 },
      label: { fontFace: FONT_BODY, color: p.textSecondary, fontSize: 10 },
      header: { fontFace: FONT_BODY, color: p.textPrimary, fontSize: 11 },
    },

    visualStyles: visualStyles(p),
  };
}

export const THEME_TARGETS = [
  ["tti", "kit/powerbi/tti-theme.json"],
  ["tti-dark", "kit/powerbi/tti-theme-dark.json"],
  ["tti-hc", "kit/powerbi/tti-theme-hc.json"],
];

export function generate() {
  return new Map(
    THEME_TARGETS.map(([themeName, rel]) => [
      rel,
      JSON.stringify(buildTheme(themeName), null, 2) + "\n",
    ]),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = generate();
  for (const [rel, content] of files) {
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  process.stdout.write(`Wrote ${[...files.keys()].join(", ")}\n`);
}
