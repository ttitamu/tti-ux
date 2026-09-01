/**
 * scripts/build-pbir-components.mjs — emit the PBIR half of kit/powerbi.
 *
 * A Power BI report theme can only carry colour, type, and per-visual
 * style. It cannot express chrome that responds to state, because
 * Microsoft is explicit that "You can't add conditional formatting rules
 * to a custom theme". Everything below that line — card chrome bound to
 * the in-report light/dark toggle, shell geometry, the z-order scheme —
 * has to live in the report's own PBIR JSON.
 *
 * So this emitter produces the drop-in half of the kit:
 *
 *   kit/powerbi/pbir/schema-lock.json      pinned $schema URLs + versions
 *   kit/powerbi/pbir/geometry.json         canvas, bands, pills, z-order
 *   kit/powerbi/pbir/fragments/<theme>/    static-colour fragments
 *   kit/powerbi/pbir/fragments/themed/     measure-bound fragments
 *
 * A "fragment" is a JSON object you splice into a visual.json — not a
 * whole visual. `card-chrome` is a `visualContainerObjects` value;
 * `table-chrome` and `chart-cartesian` are `visual.objects` values. They
 * are the pieces that repeat on every visual of a given kind, which is
 * exactly the part a design system should own and an author should never
 * retype.
 *
 * TWO COLOUR LANES, and the choice is the consumer's:
 *   fragments/<theme>/  hard literals. Works in any report with no
 *                       semantic-model dependency. Fixed appearance.
 *   fragments/themed/   measureRef bindings to a TuxThemeColors table.
 *                       Follows the in-report Dark/Light slicer. Requires
 *                       the consuming model to expose that table.
 * Power BI has no native dark mode for report content in Desktop, the
 * service, or mobile — verified 2026-08-31 — so the themed lane is the
 * only way a report responds to a viewer's choice at all. It is not a
 * workaround pending a platform fix; it is the mechanism.
 *
 * DOCTRINE — Tier 1 (design/kit-pipeline.md): every literal resolves
 * from design/tokens.json through the SAME palette() the theme emitter
 * uses, so a theme and its fragments cannot drift apart. Committed
 * output, locked by tests/tux-kit-targets.test.ts.
 *
 * Run via `npm run build:pbir` (part of `npm run build:kit`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { palette } from "./build-powerbi-theme.mjs";
import {
  PBIR_SCHEMAS,
  PBIR_FORMAT_VERSIONS,
  THEME_SCHEMA_URL,
  THEME_SCHEMA_VERSION,
  BASE_THEMES,
  REPORT_VERSION_AT_IMPORT,
  PBIR_LIMITS,
  VISUAL_TYPE_MIGRATIONS,
  PBIR_STATUS,
} from "./pbir-schema-lock.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const tokens = JSON.parse(
  fs.readFileSync(path.join(ROOT, "design/tokens.json"), "utf8"),
);

const px = (v) => Number(String(v).replace("px", ""));
const SPACE = (k) => px(tokens.globals.space[k].$value ?? tokens.globals.space[k]);
/** radius.lg is 0.5rem; PBIR wants px integers. */
const RADIUS_LG = 8;

// ---------------------------------------------------------------------------
// PBIR value encoders
//
// Unlike the theme file, PBIR visual.json wraps EVERY scalar in a
// Literal expr, and the suffix carries the type. This is the detail that
// costs the most time to rediscover: "0L" and "0D" are different values
// to Power BI, and the wrong one is silently ignored rather than
// rejected — e.g. a slicer's orientation is a list at 0L and a tile
// strip at 1D.
// ---------------------------------------------------------------------------

const litStr = (v) => ({ expr: { Literal: { Value: `'${v}'` } } });
const litNum = (v) => ({ expr: { Literal: { Value: `${v}D` } } });
const litInt = (v) => ({ expr: { Literal: { Value: `${v}L` } } });
const litBool = (v) => ({ expr: { Literal: { Value: String(v) } } });

/** A static colour. */
const solid = (color) => ({ solid: { color } });

/**
 * A colour bound to a DAX measure — the mechanism the whole light/dark
 * system rests on. `Entity` is the table name as it appears in the
 * consuming semantic model, so it is a hard contract between this kit
 * and that model.
 */
const THEME_ENTITY = "TuxThemeColors";
const measure = (property) => ({
  solid: {
    color: {
      expr: {
        Measure: {
          Expression: { SourceRef: { Entity: THEME_ENTITY } },
          Property: property,
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/**
 * Shell chrome bands. These are LAYOUT CONSTANTS, not derived tokens —
 * design/tokens.json has no vocabulary for report chrome, and inventing
 * a derivation would be false precision. They are type-driven: 52px is
 * what a 14pt title plus breathing room occupies.
 */
const BANDS = { header: 52, accentRule: 2, nav: 52, footer: 32 };

/** Width reserved for the page-context title before the nav pills start. */
const CONTEXT_TITLE_WIDTH = 384;

const PILL = {
  width: 100,
  height: 30,
  gap: SPACE(8),
  radius: RADIUS_LG,
};

/**
 * The z-order scheme, carried over intact from the reference
 * implementation because it is proven across ~1,100 generated visuals.
 * Bands are spaced by 1000 so content can be renumbered without touching
 * chrome. Content visuals live in 9000–15000; everything outside that
 * window is reserved.
 */
const Z = {
  canvasBackground: 0,
  contentTray: 1000,
  footerBar: 2000,
  headerBar: 3000,
  accentRule: 4000,
  footerText: 5000,
  pageTitle: 6000,
  themeSlicer: 7000,
  navBar: 8000,
  contentMin: 9000,
  contentMax: 15000,
  contextTitle: 17000,
  pillInactive: 18000,
  pillActive: 19000,
  pillLabelInactive: 20000,
  pillLabelActive: 21000,
  pillHitTarget: 22000,
};

function canvasVariant(width, height, baseTheme) {
  const gutter = SPACE(16);
  const contentTop = BANDS.header + BANDS.accentRule + BANDS.nav;
  return {
    width,
    height,
    baseTheme,
    gutter,
    bands: {
      header: { x: 0, y: 0, width, height: BANDS.header },
      accentRule: {
        x: 0,
        y: BANDS.header,
        width,
        height: BANDS.accentRule,
      },
      nav: {
        x: gutter,
        y: BANDS.header + BANDS.accentRule,
        width: width - gutter * 2,
        height: BANDS.nav,
      },
      footer: {
        x: gutter,
        y: height - BANDS.footer,
        width: width - gutter * 2,
        height: BANDS.footer,
      },
    },
    content: {
      x: gutter,
      y: contentTop + gutter,
      width: width - gutter * 2,
      height: height - contentTop - BANDS.footer - gutter * 2,
    },
    pills: {
      ...PILL,
      startX: gutter + CONTEXT_TITLE_WIDTH,
      y: BANDS.header + BANDS.accentRule + (BANDS.nav - PILL.height) / 2,
      /** x of pill n (0-based) = startX + n * (width + gap) */
      stride: PILL.width + PILL.gap,
    },
  };
}

function geometry() {
  return {
    $comment:
      "Generated by scripts/build-pbir-components.mjs from design/tokens.json. " +
      "Layout constants for the TUX Power BI report shell. Two canvas " +
      "variants are emitted because Fluent 2 (GA Aug 2026) moved the " +
      "default canvas to 1920x1080 while existing reports remain at " +
      "1280x920 — pick the one matching your report's baseTheme.",
    bands: BANDS,
    contextTitleWidth: CONTEXT_TITLE_WIDTH,
    zOrder: Z,
    card: {
      radius: RADIUS_LG,
      borderWidth: 1,
      padding: { top: SPACE(4) + 2, bottom: SPACE(4) + 2, left: SPACE(10), right: SPACE(10) },
      shadow: { preset: "Center", blur: 6, spread: 1, transparency: 88 },
    },
    canvas: {
      classic: canvasVariant(1280, 920, BASE_THEMES.classic),
      fluent2: canvasVariant(1920, 1080, BASE_THEMES.fluent2),
    },
  };
}

// ---------------------------------------------------------------------------
// Fragments
// ---------------------------------------------------------------------------

const G = geometry();

/**
 * Card chrome — the single most reusable artifact in the whole system.
 * Goes on EVERY content visual (charts, tables, slicers, cards) and on
 * NO shell visual (shapes, textboxes, buttons carry their own).
 *
 * Splice as the value of `visualContainerObjects`.
 */
function cardChrome(c) {
  const { radius, borderWidth, padding, shadow } = G.card;
  return {
    background: [
      { properties: { show: litBool(true), color: c.cardBackground } },
    ],
    border: [
      {
        properties: {
          show: litBool(true),
          color: c.border,
          radius: litInt(radius),
          width: litNum(borderWidth),
        },
      },
    ],
    dropShadow: [
      {
        properties: {
          show: litBool(true),
          // `dropShadow` here, NOT `shadow`. visualContainerObjects
          // rejects `shadow` outright ("Property 'shadow' has not been
          // defined and the schema does not allow additional
          // properties"); objects.shadow is the shape-internal one.
          preset: litStr(shadow.preset),
          shadowBlur: litInt(shadow.blur),
          shadowSpread: litInt(shadow.spread),
          transparency: litInt(shadow.transparency),
          color: solid("#000000"),
        },
      },
    ],
    padding: [
      {
        properties: {
          top: litNum(padding.top),
          bottom: litNum(padding.bottom),
          left: litNum(padding.left),
          right: litNum(padding.right),
        },
      },
    ],
  };
}

/** Table chrome — splice as `visual.objects` on a tableEx visual. */
function tableChrome(c, fonts) {
  return {
    columnHeaders: [
      {
        properties: {
          fontFamily: litStr(fonts.bold),
          fontSize: litNum(11),
          bold: litBool(true),
          fontColor: c.textPrimary,
          backColor: c.cardBackground,
          outlineColor: c.accent,
          outlineWeight: litInt(2),
        },
      },
    ],
    values: [
      {
        properties: {
          fontFamily: litStr(fonts.body),
          fontSize: litNum(9),
          fontColor: c.textPrimary,
          backColor: c.cardBackground,
        },
      },
    ],
    grid: [
      {
        properties: {
          gridHorizontal: litBool(true),
          gridHorizontalColor: c.gridline,
          gridVertical: litBool(false),
        },
      },
    ],
  };
}

/** Cartesian chart chrome — splice as `visual.objects`. */
function chartCartesian(c, fonts) {
  const axis = (extra) => [
    {
      properties: {
        fontFamily: litStr(fonts.body),
        fontSize: litNum(10),
        labelColor: c.textSecondary,
        showAxisTitle: litBool(false),
        ...extra,
      },
    },
  ];
  return {
    categoryAxis: axis({ gridlineShow: litBool(false) }),
    valueAxis: axis({
      gridlineShow: litBool(true),
      gridlineColor: c.gridline,
      gridlineThickness: litNum(1),
    }),
    legend: [
      {
        properties: {
          show: litBool(true),
          position: litStr("Top"),
          showTitle: litBool(false),
          fontFamily: litStr(fonts.body),
          fontSize: litNum(9),
          labelColor: c.textSecondary,
        },
      },
    ],
    labels: [
      {
        properties: {
          fontFamily: litStr(fonts.body),
          fontSize: litNum(9),
          color: c.textSecondary,
        },
      },
    ],
  };
}

const FONTS = { body: "Open Sans", bold: "Work Sans", display: "Oswald" };

/** Static colour set for one resolved theme. */
function staticColors(themeName) {
  const p = palette(themeName);
  return {
    cardBackground: solid(p.raised),
    pageBackground: solid(p.sunken),
    border: solid(p.border),
    gridline: solid(p.borderSubtle),
    textPrimary: solid(p.textPrimary),
    textSecondary: solid(p.textSecondary),
    accent: solid(p.brandPrimary),
    // Brand chrome — invariant in both lanes by doctrine.
    shellHeaderBg: solid(p.brandFill),
    shellAccentRule: solid(p.brandAccent),
  };
}

/**
 * Measure-bound colour set. The measure names ARE the contract with the
 * consuming semantic model — changing one is a breaking change for every
 * report that has already dropped these fragments in.
 */
const themedColors = {
  cardBackground: measure("CardBackground"),
  pageBackground: measure("PageBackground"),
  border: measure("BorderColor"),
  gridline: measure("ChartGridline"),
  textPrimary: measure("TextPrimary"),
  textSecondary: measure("TextSecondary"),
  accent: measure("AccentPrimary"),
  // Bound to measures for consistency, but both roles resolve to the
  // same value in either mode — the masthead does not flip.
  shellHeaderBg: measure("ShellHeaderBg"),
  shellAccentRule: measure("ShellAccentRule"),
};

const THEME_LANES = ["tti", "tti-dark", "tti-hc"];

const stamp = (kind, spliceAs, lane) => ({
  $comment:
    `TUX PBIR fragment — ${kind}. Splice as the value of \`${spliceAs}\`. ` +
    (lane === "themed"
      ? `Colours bind to the '${THEME_ENTITY}' semantic-model table and follow the in-report Dark/Light slicer.`
      : `Colours are static literals from the '${lane}' theme; no semantic-model dependency.`) +
    " Generated by scripts/build-pbir-components.mjs — do not hand-edit.",
});

function fragmentsFor(lane) {
  const c = lane === "themed" ? themedColors : staticColors(lane);
  return {
    "card-chrome.json": {
      ...stamp("card chrome", "visualContainerObjects", lane),
      ...cardChrome(c),
    },
    "table-chrome.json": {
      ...stamp("tableEx chrome", "visual.objects", lane),
      ...tableChrome(c, FONTS),
    },
    "chart-cartesian.json": {
      ...stamp("cartesian chart chrome", "visual.objects", lane),
      ...chartCartesian(c, FONTS),
    },
  };
}

// ---------------------------------------------------------------------------
// Semantic-model module — the light/dark switch
//
// Power BI has no native dark mode for report content, so a report that
// responds to a viewer at all has to do it in the model: a disconnected
// ThemeMode table feeds a slicer, and one measure per colour role
// returns a hex conditioned on that selection. Visuals bind to the
// measures through conditional formatting (measureRef), so flipping the
// slicer repaints the report live.
//
// Superseded alternatives, recorded so they are not retried: duplicating
// pages per mode with bookmarks (maintenance doubles per page, slicer
// sync is fragile), and field parameters with GENERATESERIES (works for
// a couple of colours, does not scale to a full role set).
//
// These measures MUST return hex literals. Power BI's newer "named theme
// colors" let a measure return a token name like "background" instead,
// but that resolves against whichever theme is currently applied — and a
// report has exactly one. It makes a report theme-portable; it cannot
// drive a live toggle. Refactoring onto it silently collapses both
// branches to the same colour.
// ---------------------------------------------------------------------------

/** The measure home table. Fragments bind to this name — see THEME_ENTITY. */
const MODE_TABLE = "ThemeMode";

/**
 * Colour roles. Each is a function of a resolved palette, so light and
 * dark values come from themes.tti and themes.tti-dark respectively and
 * cannot drift from the emitted theme JSON.
 *
 * Note the three tooltip roles inverting for free: a tooltip wants the
 * OPPOSITE surface, and `textPrimary` is already near-black in light and
 * near-white in dark, so the same expression yields both.
 */
const COLOR_ROLES = [
  ["PageBackground", "Surface", (p) => p.sunken, "Page canvas behind the cards."],
  ["CardBackground", "Surface", (p) => p.raised, "Fill for every content visual."],
  ["SecondaryBackground", "Surface", (p) => p.page, "Secondary surface."],
  ["BorderColor", "Surface", (p) => p.border, "Card and control borders."],

  ["TextPrimary", "Text", (p) => p.textPrimary, "Body and heading text."],
  ["TextSecondary", "Text", (p) => p.textSecondary, "Labels, captions, axis text."],
  ["TextMuted", "Text", (p) => p.textMuted, "De-emphasised text."],
  ["TextOnAccent", "Text", (p) => p.textOnBrand, "Text on a brand surface."],

  ["AccentPrimary", "Accent", (p) => p.brandPrimary, "Theme-adapted brand anchor."],
  ["AccentGold", "Accent", (p) => p.brandAccent, "Secondary accent."],

  ["TableHeaderBg", "Table", (p) => p.raised, "Table header fill."],
  ["TableHeaderText", "Table", (p) => p.textPrimary, "Table header text."],
  ["TableRowBg", "Table", (p) => p.raised, "Table row fill."],
  ["TableAltRowBg", "Table", (p) => p.sunken, "Banded row fill."],
  ["TableRowText", "Table", (p) => p.textPrimary, "Table body text."],
  ["TableTotalBg", "Table", (p) => p.sunken, "Total row fill."],
  ["TableGrid", "Table", (p) => p.borderSubtle, "Table gridlines."],

  ["ChartGridline", "Chart", (p) => p.borderSubtle, "Value-axis gridlines."],
  ["ChartLabelText", "Chart", (p) => p.textSecondary, "Axis and data labels."],
  ["ChartBackground", "Chart", (p) => p.raised, "Plot-area fill."],

  ["SemanticGood", "Semantic", (p) => p.success, "Positive / on-target."],
  ["SemanticBad", "Semantic", (p) => p.error, "Negative / off-target."],
  ["SemanticWarning", "Semantic", (p) => p.warning, "Caution."],
  ["SemanticNeutral", "Semantic", (p) => p.sunken, "No signal."],

  // Brand surfaces are theme-INVARIANT by doctrine — the masthead stays
  // maroon in dark mode. brand.fill resolves identically in both themes,
  // so this is stated by construction rather than special-cased.
  ["ShellHeaderBg", "Shell", (p) => p.brandFill, "Masthead / footer fill (theme-invariant)."],
  ["ShellHeaderText", "Shell", (p) => p.textOnBrand, "Masthead text."],
  ["ShellAccentRule", "Shell", (p) => p.brandAccent, "Accent rule under the masthead."],

  ["TooltipBackground", "Tooltip", (p) => p.textPrimary, "Tooltip fill (inverts)."],
  ["TooltipTitle", "Tooltip", (p) => p.raised, "Tooltip title (inverts)."],
  ["TooltipValue", "Tooltip", (p) => p.sunken, "Tooltip value (inverts)."],
];

function roleValues() {
  const light = palette("tti");
  const dark = palette("tti-dark");
  return COLOR_ROLES.map(([name, folder, pick, doc]) => ({
    name,
    folder,
    doc,
    light: pick(light),
    dark: pick(dark),
  }));
}

/**
 * SELECTEDVALUE with a "Light" fallback: the report must render sanely
 * when nothing is selected or the slicer is multi-selected, which is the
 * state every report opens in before a viewer touches anything.
 */
const modeExpr = (r) =>
  `IF(SELECTEDVALUE(${MODE_TABLE}[Mode], "Light") = "Dark", "${r.dark}", "${r.light}")`;

function themeModeTmdl() {
  return [
    "/// Disconnected table driving the in-report light/dark toggle.",
    `table ${MODE_TABLE}`,
    "",
    "\tcolumn Mode",
    "\t\tdataType: string",
    "\t\tsummarizeBy: none",
    "\t\tsourceColumn: Mode",
    "",
    "\tcolumn SortOrder",
    "\t\tdataType: int64",
    "\t\tsummarizeBy: none",
    "\t\tsourceColumn: SortOrder",
    "\t\tisHidden",
    "",
    `\tpartition ${MODE_TABLE} = calculated`,
    "\t\tmode: import",
    '\t\tsource = DATATABLE("Mode", STRING, "SortOrder", INTEGER, {{"Dark", 1}, {"Light", 2}})',
    "",
  ].join("\n");
}

function themeColorsTmdl() {
  const lines = [
    "/// Colour roles for the in-report light/dark toggle. One measure per",
    "/// role, each returning a hex literal chosen by the ThemeMode slicer.",
    `table ${THEME_ENTITY}`,
    "",
  ];
  for (const r of roleValues()) {
    lines.push(`\t/// ${r.doc}`);
    lines.push(`\tmeasure ${r.name} = ${modeExpr(r)}`);
    lines.push(`\t\tdisplayFolder: ${r.folder}`);
    lines.push("");
  }
  lines.push("\tcolumn Placeholder");
  lines.push("\t\tdataType: int64");
  lines.push("\t\tsummarizeBy: none");
  lines.push("\t\tsourceColumn: Placeholder");
  lines.push("\t\tisHidden");
  lines.push("");
  lines.push(`\tpartition ${THEME_ENTITY} = calculated`);
  lines.push("\t\tmode: import");
  lines.push('\t\tsource = ROW("Placeholder", 1)');
  lines.push("");
  return lines.join("\n");
}

/** Same module for authors working in Desktop's UI instead of TMDL. */
function themeTablesDax() {
  const out = [
    "// TUX theme tables — paste into Power BI Desktop.",
    "// Generated by scripts/build-pbir-components.mjs; do not hand-edit.",
    "//",
    "// 1. Modeling > New table, for each of the two table expressions.",
    "// 2. Modeling > New measure, once per measure below, with",
    `//    ${THEME_ENTITY} selected as the home table.`,
    "// 3. Put a slicer on ThemeMode[Mode] and sync it across pages.",
    "",
    "// ---- Tables ----",
    "",
    `${MODE_TABLE} = DATATABLE("Mode", STRING, "SortOrder", INTEGER, {{"Dark", 1}, {"Light", 2}})`,
    "",
    `${THEME_ENTITY} = ROW("Placeholder", 1)`,
    "",
    "// ---- Measures ----",
  ];
  let folder = null;
  for (const r of roleValues()) {
    if (r.folder !== folder) {
      folder = r.folder;
      out.push("", `// ${folder}`);
    }
    out.push("", `${r.name} = ${modeExpr(r)}`);
  }
  out.push("");
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// Shell visuals
//
// Ten visuals that wrap every report page. They are identical across the
// pages of a report and near-identical across reports — only the page
// title and the footer support label vary — which is exactly what makes
// them worth generating rather than placing by hand.
//
// The split that matters: brand chrome (masthead, accent rule, footer)
// is HARDCODED to brand colours and does not respond to the toggle,
// because the maroon stays maroon in dark mode. Everything else binds to
// TuxThemeColors. Getting this backwards produces a report whose
// letterhead changes colour when a viewer flips the switch.
// ---------------------------------------------------------------------------

/**
 * Textbox sizing. Piecewise, NOT one multiplier — calibrated by hand in
 * Desktop, because a textbox can be perfectly valid PBIR and still clip
 * glyphs or grow an editor scrollbar. Under-sizing a *titled* textbox
 * also makes a bounding box appear around the text.
 */
function textboxHeight(fontPt) {
  if (fontPt >= 15) return Math.ceil(fontPt * 2.25);
  if (fontPt >= 11) return Math.ceil(fontPt * 2.45);
  return Math.ceil(fontPt * 3.05);
}

/** Calibrated minimums for title-rendered text, which needs more room. */
const TITLED_MIN = { contentLabel: 64, navLabel: 46, pageTitle: 55 };

/**
 * Theme slicer. y centres it in the header band; the right inset is a
 * calibrated constant that reproduces the reference x=1093 on the 1280
 * canvas and right-aligns correctly on any width.
 */
const SLICER = { width: 160, height: 30, rightInset: 27 };

const schemaOf = (v) => ({ $schema: PBIR_SCHEMAS[v] });

function visualFile({ name, x, y, z, width, height, visual }) {
  return {
    ...schemaOf("visualContainer"),
    name,
    position: { x, y, z, width, height },
    visual,
  };
}

/** objects.shadow is a TWO-entry array; the second carries a selector. */
function shapeShadow({ blur, transparency, preset = "center", distance = 8 }) {
  return [
    { properties: { show: litBool(true) } },
    {
      properties: {
        shadowBlur: litNum(blur),
        transparency: litNum(transparency),
        shadowPositionPreset: litStr(preset),
        shadowDistance: litNum(distance),
        angle: litNum(90),
      },
      selector: { id: "default" },
    },
  ];
}

function shapeVisual({ fill, transparency, shapeType = "rectangle", curve, roundEdge, shadow }) {
  const objects = {
    general: [{ properties: { keepLayerOrder: litBool(true) } }],
    fill: [
      {
        properties: {
          fillColor: fill,
          ...(transparency == null ? {} : { transparency: litNum(transparency) }),
        },
      },
    ],
    line: [{ properties: { show: litBool(false) } }],
    rotation: [{ properties: { angle: litInt(0) } }],
    shape: [
      {
        properties: {
          shapeType: litStr(shapeType),
          ...(curve == null ? {} : { curve: litNum(curve) }),
          ...(roundEdge == null ? {} : { roundEdge: litInt(roundEdge) }),
        },
      },
    ],
    ...(shadow ? { shadow: shapeShadow(shadow) } : {}),
  };
  return {
    visualType: "shape",
    objects,
    visualContainerObjects: {
      background: [{ properties: { show: litBool(false) } }],
      border: [{ properties: { show: litBool(false) } }],
      title: [{ properties: { show: litBool(false) } }],
    },
  };
}

/** Paragraph textbox — static colour. Cannot respond to the toggle. */
function paragraphTextbox({ text, font, sizePt, color, bold = true, align = "Center" }) {
  return {
    visualType: "textbox",
    objects: {
      general: [
        {
          properties: {
            paragraphs: [
              {
                textRuns: [
                  {
                    value: text,
                    textStyle: {
                      fontFamily: `'${font}'`,
                      fontSize: `'${sizePt}pt'`,
                      bold: `'${bold}'`,
                      color: `'${color}'`,
                    },
                  },
                ],
                horizontalTextAlignment: `'${align}'`,
              },
            ],
          },
        },
      ],
    },
    visualContainerObjects: {
      background: [{ properties: { show: litBool(false) } }],
      border: [{ properties: { show: litBool(false) } }],
      title: [{ properties: { show: litBool(false) } }],
    },
  };
}

/**
 * Titled textbox — the workaround for theme-responsive text.
 *
 * Paragraph `textStyle.color` is a plain string and cannot take a
 * measureRef, so a label that must follow the toggle is rendered through
 * the visual's TITLE instead: paragraph text is cleared to empty and
 * `title.text` carries the copy while `title.fontColor` carries the
 * measure. Note the property is `text` — `titleText` is an embedded-JS-API
 * concept and hard-fails PBIR schema validation.
 */
function titledTextbox({ text, font, sizePt, colorMeasure, bold = true, align = "Left" }) {
  return {
    visualType: "textbox",
    objects: {
      general: [{ properties: { paragraphs: [{ textRuns: [{ value: "" }] }] } }],
    },
    visualContainerObjects: {
      background: [{ properties: { show: litBool(false) } }],
      border: [{ properties: { show: litBool(false) } }],
      title: [
        {
          properties: {
            show: litBool(true),
            text: litStr(text),
            fontColor: colorMeasure,
            fontFamily: litStr(font),
            fontSize: litNum(sizePt),
            bold: litBool(bold),
            alignment: litStr(align),
          },
        },
      ],
    },
  };
}

/**
 * The Dark/Light toggle.
 *
 * Tile appearance requires BOTH properties together: data.mode 'Basic'
 * AND general.orientation "1D". "0L" is a vertical list and "1D" is a
 * tile strip — the suffix is the whole difference, and the wrong one is
 * silently ignored rather than rejected.
 *
 * syncGroup lives inside `visual` (sibling to drillFilterOtherVisuals),
 * not in any separate config file. Without it the toggle resets on every
 * page change.
 */
function themeSlicerVisual(c) {
  return {
    visualType: "slicer",
    query: {
      queryState: {
        Values: {
          projections: [
            {
              field: {
                Column: {
                  Expression: { SourceRef: { Entity: MODE_TABLE } },
                  Property: "Mode",
                },
              },
              queryRef: `${MODE_TABLE}.Mode`,
              nativeQueryRef: "Mode",
            },
          ],
        },
      },
    },
    objects: {
      data: [{ properties: { mode: litStr("Basic") } }],
      // "1D" (double) = tile strip. "0L" (integer) = vertical list.
      general: [{ properties: { orientation: litNum(1) } }],
      selection: [
        {
          properties: {
            singleSelect: litBool(true),
            selectAllCheckboxEnabled: litBool(false),
          },
        },
      ],
      header: [{ properties: { show: litBool(false) } }],
      items: [
        {
          properties: {
            fontColor: c.textPrimary,
            background: c.cardBackground,
            fontFamily: litStr(FONTS.body),
            fontSize: litNum(9),
          },
        },
      ],
    },
    visualContainerObjects: {
      background: [{ properties: { show: litBool(false) } }],
      border: [{ properties: { show: litBool(false) } }],
      title: [{ properties: { show: litBool(false) } }],
      visualHeader: [{ properties: { show: litBool(false) } }],
    },
    syncGroup: { groupName: "Mode", fieldChanges: true, filterChanges: true },
    drillFilterOtherVisuals: true,
  };
}

/** The ten shell visuals for one canvas variant. */
function shellVisuals(variant, c, opts) {
  const v = G.canvas[variant];
  const { bands, content, width, height } = v;
  const brandFill = c.shellHeaderBg;
  const out = [];

  out.push(
    visualFile({
      name: "shell_canvas_bg",
      x: 0, y: 0, z: Z.canvasBackground, width, height,
      visual: shapeVisual({ fill: c.pageBackground }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_btn_content_tray",
      x: content.x, y: content.y - G.canvas[variant].gutter, z: Z.contentTray,
      width: content.width, height: content.height + G.canvas[variant].gutter,
      visual: shapeVisual({
        fill: c.border, transparency: 97,
        shapeType: "rectangleRounded", curve: 5, roundEdge: 90,
        shadow: { blur: 18, transparency: 92, preset: "center", distance: 8 },
      }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_btn_footer_bg",
      x: bands.footer.x, y: bands.footer.y, z: Z.footerBar,
      width: bands.footer.width, height: bands.footer.height,
      visual: shapeVisual({
        fill: brandFill, shapeType: "rectangleRounded", curve: 5, roundEdge: 88,
        shadow: { blur: 12, transparency: 94, preset: "custom", distance: 6 },
      }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_btn_header_bg",
      x: 0, y: 0, z: Z.headerBar, width, height: bands.header.height,
      visual: shapeVisual({ fill: brandFill }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_btn_header_accent_rule",
      x: 0, y: bands.accentRule.y, z: Z.accentRule,
      width, height: bands.accentRule.height,
      visual: shapeVisual({ fill: c.shellAccentRule }),
    }),
  );

  // Footer + page title are STATIC colour: both sit on the invariant
  // maroon, where white is always readable, so they need no measure.
  out.push(
    visualFile({
      name: "nav_title_footer_support",
      x: width - 268, y: bands.footer.y + 3, z: Z.footerText,
      width: 240, height: bands.footer.height,
      visual: paragraphTextbox({
        text: opts.footerText, font: FONTS.body, sizePt: 9,
        color: opts.onBrandMuted, bold: false, align: "Right",
      }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_title_page",
      x: 33, y: 9, z: Z.pageTitle,
      width: 640, height: textboxHeight(14),
      visual: paragraphTextbox({
        text: opts.pageTitle, font: FONTS.bold, sizePt: 14,
        color: opts.onBrand, bold: true, align: "Left",
      }),
    }),
  );

  out.push(
    visualFile({
      name: "shell_theme_slicer",
      x: width - SLICER.width - SLICER.rightInset,
      y: Math.round((bands.header.height - SLICER.height) / 2),
      z: Z.themeSlicer, width: SLICER.width, height: SLICER.height,
      visual: themeSlicerVisual(c),
    }),
  );

  out.push(
    visualFile({
      name: "nav_btn_nav_bg",
      x: bands.nav.x, y: bands.nav.y, z: Z.navBar,
      width: bands.nav.width, height: bands.nav.height,
      visual: shapeVisual({
        fill: c.cardBackground, transparency: 4,
        shapeType: "rectangleRounded", curve: 5, roundEdge: 92,
        shadow: { blur: 14, transparency: 95, preset: "custom", distance: 6 },
      }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_title_context",
      x: 28, y: bands.nav.y + 7, z: Z.contextTitle,
      width: G.contextTitleWidth - 28, height: TITLED_MIN.contentLabel,
      visual: titledTextbox({
        text: opts.contextTitle, font: FONTS.bold, sizePt: 14,
        colorMeasure: c.textPrimary, bold: true, align: "Left",
      }),
    }),
  );

  return out;
}

/**
 * Nav pills. One pill per page, so the count is per-report and these are
 * TEMPLATES positioned at index 0 (active) and index 1 (inactive) —
 * x of pill n = pills.startX + n * pills.stride.
 *
 * Each pill is three or four layered visuals rather than one button,
 * because actionButton text rendering is unreliable in generated PBIR:
 * the label disappears or misaligns, and `text.fontColor` cannot take a
 * measureRef at all. Splitting chrome / label / click target is stable.
 */
function navPills(variant, c) {
  const v = G.canvas[variant];
  const p = v.pills;
  const at = (i) => p.startX + i * p.stride;
  const out = [];

  const pillShape = (fill, transparency) =>
    shapeVisual({
      fill, transparency, shapeType: "rectangleRounded",
      curve: 8, roundEdge: 100,
      shadow: { blur: 10, transparency: 95, preset: "center", distance: 4 },
    });

  out.push(
    visualFile({
      name: "nav_pill_active",
      x: at(0), y: p.y, z: Z.pillActive, width: p.width, height: p.height,
      visual: pillShape(c.shellHeaderBg),
    }),
  );

  // Active label is PARAGRAPH text with a static white fill — it sits on
  // the invariant maroon pill, so it never needs to follow the toggle.
  // y = pillY + 2 because paragraph text carries internal top padding.
  out.push(
    visualFile({
      name: "nav_pill_active_label",
      x: at(0), y: p.y + 2, z: Z.pillLabelActive, width: p.width, height: 36,
      visual: paragraphTextbox({
        text: "Overview", font: FONTS.bold, sizePt: 10,
        color: "#FFFFFF", bold: true, align: "Center",
      }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_pill_inactive",
      x: at(1), y: p.y, z: Z.pillInactive, width: p.width, height: p.height,
      visual: pillShape(c.cardBackground, 4),
    }),
  );

  // Inactive label is TITLE text so its colour can follow the toggle.
  // y = pillY + 8 because title text renders at the top of its box with
  // no internal padding — without the offset it sits above the active
  // label rather than level with it.
  out.push(
    visualFile({
      name: "nav_pill_inactive_label",
      x: at(1), y: p.y + 8, z: Z.pillLabelInactive,
      width: p.width, height: TITLED_MIN.navLabel,
      visual: titledTextbox({
        text: "Detail", font: FONTS.bold, sizePt: 10,
        colorMeasure: c.textSecondary, bold: true, align: "Center",
      }),
    }),
  );

  out.push(
    visualFile({
      name: "nav_pill_inactive_hit",
      x: at(1), y: p.y, z: Z.pillHitTarget, width: p.width, height: p.height,
      visual: {
        visualType: "actionButton",
        objects: {
          icon: [{ properties: { shapeType: litStr("noShape") } }],
          fill: [{ properties: { transparency: litNum(100) } }],
          outline: [{ properties: { show: litBool(false) } }],
          text: [{ properties: { show: litBool(false) } }],
        },
        visualContainerObjects: {
          background: [{ properties: { show: litBool(false) } }],
          border: [{ properties: { show: litBool(false) } }],
          title: [{ properties: { show: litBool(false) } }],
          visualHeader: [{ properties: { show: litBool(false) } }],
        },
        drillFilterOtherVisuals: true,
      },
    }),
  );

  return out;
}

const SHELL_TEXT = {
  pageTitle: "TEXAS A&M TRANSPORTATION INSTITUTE | Analytics",
  contextTitle: "Overview",
  footerText: "Analytics Support | tti.tamu.edu",
};

// ---------------------------------------------------------------------------
// Schema lock
// ---------------------------------------------------------------------------

function schemaLock() {
  return {
    $comment:
      "Pinned Power BI / PBIR format versions for the TUX kit. Generated " +
      "from scripts/pbir-schema-lock.mjs — do not hand-edit. Every URL " +
      `was verified live on ${PBIR_STATUS.verifiedOn} (200, with the next ` +
      "version up returning 404).",
    verifiedOn: PBIR_STATUS.verifiedOn,
    status: { ga: PBIR_STATUS.ga, note: PBIR_STATUS.note },
    pbirSchemas: PBIR_SCHEMAS,
    pbirFormatVersions: PBIR_FORMAT_VERSIONS,
    theme: {
      schemaVersion: THEME_SCHEMA_VERSION,
      schemaUrl: THEME_SCHEMA_URL,
      baseThemes: BASE_THEMES,
      /**
       * Breaking change in report schema 3.0.0 — this used to be a flat
       * string. Microsoft's own published example still shows the old
       * form, so copying from the docs yields an invalid report.json.
       */
      reportVersionAtImport: REPORT_VERSION_AT_IMPORT,
    },
    limits: PBIR_LIMITS,
    deprecatedVisualTypes: VISUAL_TYPE_MIGRATIONS,
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const json = (o) => JSON.stringify(o, null, 2) + "\n";

export function generate() {
  const files = new Map([
    ["kit/powerbi/pbir/schema-lock.json", json(schemaLock())],
    ["kit/powerbi/pbir/geometry.json", json(geometry())],
    [`kit/powerbi/pbir/tmdl/${MODE_TABLE}.tmdl`, themeModeTmdl()],
    [`kit/powerbi/pbir/tmdl/${THEME_ENTITY}.tmdl`, themeColorsTmdl()],
    ["kit/powerbi/pbir/dax/theme-tables.dax", themeTablesDax()],
  ]);
  for (const lane of [...THEME_LANES, "themed"]) {
    for (const [name, body] of Object.entries(fragmentsFor(lane))) {
      files.set(`kit/powerbi/pbir/fragments/${lane}/${name}`, json(body));
    }
  }

  // Shell + pills are emitted in the THEMED lane only. A shell whose
  // chrome cannot follow the toggle is just a picture of a shell, and the
  // static lanes already cover the no-model case at the fragment level.
  const light = palette("tti");
  const opts = {
    ...SHELL_TEXT,
    onBrand: light.textOnBrand,
    onBrandMuted: light.textOnBrand,
  };
  for (const variant of Object.keys(G.canvas)) {
    for (const v of shellVisuals(variant, themedColors, opts)) {
      files.set(`kit/powerbi/pbir/shell/${variant}/${v.name}/visual.json`, json(v));
    }
    for (const v of navPills(variant, themedColors)) {
      files.set(`kit/powerbi/pbir/shell/${variant}/${v.name}/visual.json`, json(v));
    }
  }
  return files;
}

/** `--verify` re-checks every pinned URL against the live endpoint. */
async function verify() {
  const urls = [...Object.values(PBIR_SCHEMAS), THEME_SCHEMA_URL];
  let bad = 0;
  for (const u of urls) {
    const res = await fetch(u, { method: "HEAD" }).catch(() => null);
    const ok = res && res.ok;
    if (!ok) bad++;
    process.stdout.write(`${ok ? "  ok" : "FAIL"}  ${u}\n`);
  }
  process.stdout.write(
    bad ? `\n${bad} pinned schema URL(s) unreachable\n` : "\nall pinned schema URLs reachable\n",
  );
  return bad;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--verify")) {
    process.exit((await verify()) ? 1 : 0);
  }
  const files = generate();
  for (const [rel, content] of files) {
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  process.stdout.write(`Wrote ${files.size} PBIR kit files under kit/powerbi/pbir/\n`);
}
