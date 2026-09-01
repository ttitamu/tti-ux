/**
 * Framework-target locks — the committed kit outputs must match the
 * generator byte-for-byte (the build-tokens --check discipline: edit
 * design/tokens.json, run `npm run build:framework`, commit both), and
 * a handful of known values pin the resolution semantics so a resolver
 * regression can't ship plausible-but-wrong literals.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generate } from "../scripts/build-framework-targets.mjs";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { check as portsCheck } from "../scripts/ports-manifest.mjs";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generate as generateThemes } from "../scripts/build-powerbi-theme.mjs";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { generate as generatePbir } from "../scripts/build-pbir-components.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const files: Map<string, string> = generate();
const powerbi: Map<string, string> = new Map([
  ...generateThemes(),
  ...generatePbir(),
]);

describe("committed kit targets ↔ generator", () => {
  it("every target is committed exactly as generated", () => {
    for (const [rel, content] of files) {
      expect(readFileSync(join(ROOT, rel), "utf8"), rel).toBe(content);
    }
  });

  it("no unresolved var() escapes into any target", () => {
    for (const [rel, content] of files) {
      if (rel.endsWith("tux-tokens.ts")) {
        // The tuxVar() helper + its doc comment legitimately spell
        // var(--…) — strip comments and the helper before checking
        // the DATA carries only resolved literals.
        const data = content
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/[^\n]*/g, "")
          .replace(/return `var\(--\$\{name\}\)`;/, "");
        expect(data, rel).not.toContain("var(");
      } else {
        expect(content, rel).not.toContain("var(");
      }
    }
  });
});

describe("port ledger ↔ component census", () => {
  it("kit/ports/manifest.json tracks exactly the shipped components", () => {
    const { missing, ghosts } = portsCheck();
    expect({ missing, ghosts }).toEqual({ missing: [], ghosts: [] });
  });
});

describe("Power BI kit ↔ generators", () => {
  it("every Power BI artifact is committed exactly as generated", () => {
    for (const [rel, content] of powerbi) {
      expect(readFileSync(join(ROOT, rel), "utf8"), rel).toBe(content);
    }
  });

  it("no unresolved var() or token alias escapes into any artifact", () => {
    for (const [rel, content] of powerbi) {
      expect(content, rel).not.toContain("var(");
      expect(content, rel).not.toMatch(/"\{[a-z][\w.-]*\}"/);
    }
  });

  // The theme schema is additionalProperties:false over exactly 42 named
  // properties, so a stray key invalidates the whole file. v1 shipped a
  // `_generated` provenance key and was silently non-conforming.
  it("themes carry only schema-legal top-level keys", () => {
    const LEGAL = new Set([
      "$schema", "name", "baseTheme", "visualStyles", "dataColors", "icons",
      "textClasses", "foreground", "firstLevelElements", "secondLevelElements",
      "thirdLevelElements", "fourthLevelElements", "background",
      "secondaryBackground", "good", "neutral", "bad", "maximum", "center",
      "minimum", "null", "accent", "tableAccent", "foregroundLight",
      "foregroundDark", "foregroundNeutralLight", "foregroundNeutralDark",
      "foregroundNeutralSecondary", "foregroundNeutralSecondaryAlt",
      "foregroundNeutralSecondaryAlt2", "foregroundNeutralTertiary",
      "foregroundNeutralTertiaryAlt", "foregroundSelected", "foregroundButton",
      "backgroundLight", "backgroundNeutral", "backgroundDark", "hyperlink",
      "visitedHyperlink", "shapeStroke", "disabledText", "mapPushpin",
    ]);
    expect(LEGAL.size).toBe(42);
    const themes = [...powerbi.keys()].filter((rel) =>
      /^kit\/powerbi\/tti-theme[\w-]*\.json$/.test(rel),
    );
    expect(themes).toHaveLength(3);
    for (const rel of themes) {
      const illegal = Object.keys(JSON.parse(powerbi.get(rel)!)).filter(
        (k) => !LEGAL.has(k),
      );
      expect(illegal, rel).toEqual([]);
    }
  });

  it("every theme pins a base theme and a versioned schema", () => {
    for (const rel of [
      "kit/powerbi/tti-theme.json",
      "kit/powerbi/tti-theme-dark.json",
      "kit/powerbi/tti-theme-hc.json",
    ]) {
      const t = JSON.parse(powerbi.get(rel)!);
      expect(t.baseTheme, rel).toBe("Fluent2-CY26SU08");
      expect(t.$schema, rel).toMatch(/reportThemeSchema-\d+\.\d+\.json$/);
      expect(t.dataColors.length, rel).toBeGreaterThanOrEqual(8);
    }
  });

  // Light chart-1 aliases the brand anchor. Dark does NOT: the dark ramp
  // is an independently lifted set, because inverting a palette does not
  // preserve contrast against a dark surface. Asserting both shapes keeps
  // a future "simplification" from aliasing dark back onto the anchor.
  it("chart ramp is brand-anchored in light and independently lifted in dark", () => {
    const light = JSON.parse(powerbi.get("kit/powerbi/tti-theme.json")!);
    const dark = JSON.parse(powerbi.get("kit/powerbi/tti-theme-dark.json")!);
    expect(light.dataColors[0]).toBe("#5C0025"); // var(--brand-primary)
    expect(dark.dataColors[0]).toBe("#c47585");
    expect(dark.dataColors).not.toEqual(light.dataColors);
    // Structural colours still follow the theme's own surfaces.
    expect(light.background).toBe("#FFFFFF");
    expect(dark.background).toBe("#221F1F");
  });

  // "0L" and "1D" are different values to Power BI and the wrong one is
  // ignored rather than rejected, so the suffix is load-bearing.
  it("PBIR fragments encode every scalar as a suffixed Literal", () => {
    const frag = JSON.parse(
      powerbi.get("kit/powerbi/pbir/fragments/themed/card-chrome.json")!,
    );
    expect(frag.border[0].properties.radius.expr.Literal.Value).toBe("8L");
    expect(frag.border[0].properties.width.expr.Literal.Value).toBe("1D");
    expect(frag.padding[0].properties.left.expr.Literal.Value).toBe("10D");
    // `dropShadow`, never `shadow` — visualContainerObjects rejects the
    // latter outright.
    expect(frag).toHaveProperty("dropShadow");
    expect(frag).not.toHaveProperty("shadow");
  });

  it("themed fragments bind colours to the TuxThemeColors contract", () => {
    const frag = JSON.parse(
      powerbi.get("kit/powerbi/pbir/fragments/themed/card-chrome.json")!,
    );
    const ref = frag.background[0].properties.color.solid.color.expr.Measure;
    expect(ref.Expression.SourceRef.Entity).toBe("TuxThemeColors");
    expect(ref.Property).toBe("CardBackground");
  });

  it("static fragments carry literal hex and no measure bindings", () => {
    for (const lane of ["tti", "tti-dark", "tti-hc"]) {
      const rel = `kit/powerbi/pbir/fragments/${lane}/card-chrome.json`;
      expect(powerbi.get(rel), rel).not.toContain("SourceRef");
      expect(powerbi.get(rel), rel).toMatch(/"#[0-9A-Fa-f]{6}"/);
    }
  });

  it("schema lock pins the verified tips and flags deprecated visuals", () => {
    const lock = JSON.parse(powerbi.get("kit/powerbi/pbir/schema-lock.json")!);
    expect(lock.pbirSchemas.report).toContain("/report/3.3.0/");
    expect(lock.pbirSchemas.visualContainer).toContain("/visualContainer/2.9.0/");
    // platformProperties lives under gitIntegration/, not item/report/ —
    // the single most common wrong URL in circulation.
    expect(lock.pbirSchemas.platformProperties).toContain("/gitIntegration/");
    // Breaking change in report 3.0.0: object, not a flat string.
    expect(typeof lock.theme.reportVersionAtImport).toBe("object");
    expect(lock.deprecatedVisualTypes.table).toBe("tableEx");
    expect(lock.deprecatedVisualTypes.card).toBe("cardVisual");
  });

  // The themed fragments are useless without the model module that backs
  // them, so the measure set is a contract: every Property a fragment
  // binds to must exist as a measure, or the report renders unstyled.
  it("every measure the themed fragments bind to exists in the TMDL", () => {
    const tmdl = powerbi.get("kit/powerbi/pbir/tmdl/TuxThemeColors.tmdl")!;
    const defined = new Set(
      [...tmdl.matchAll(/measure (\w+) =/g)].map((m) => m[1]),
    );
    const referenced = new Set<string>();
    for (const [rel, content] of powerbi) {
      if (!rel.includes("/fragments/themed/")) continue;
      for (const m of content.matchAll(/"Property": "(\w+)"/g)) {
        referenced.add(m[1]);
      }
      for (const m of content.matchAll(/"Entity": "(\w+)"/g)) {
        expect(m[1], rel).toBe("TuxThemeColors");
      }
    }
    expect(referenced.size).toBeGreaterThan(0);
    expect([...referenced].filter((r) => !defined.has(r))).toEqual([]);
  });

  // TMDL is whitespace-significant and fails with an "Indentation" error
  // that names no line. These two traps cost the most time to find.
  it("TMDL avoids the indentation traps", () => {
    for (const [rel, content] of powerbi) {
      if (!rel.endsWith(".tmdl")) continue;
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        expect(line.startsWith(" "), `${rel}:${i + 1} space-indented`).toBe(false);
        if (line.trim().startsWith("///")) {
          expect(lines[i + 1]?.trim(), `${rel}:${i + 1} blank after ///`).not.toBe("");
        }
        if (line.startsWith("\t")) {
          const bare = line.trim().startsWith("//") && !line.trim().startsWith("///");
          expect(bare, `${rel}:${i + 1} bare // in indented block`).toBe(false);
        }
      });
    }
  });

  // Measures must return hex, not named theme colors: a named color
  // resolves against the single applied theme, which collapses both
  // branches to one value and silently kills the toggle.
  it("theme measures switch between two hex literals", () => {
    const tmdl = powerbi.get("kit/powerbi/pbir/tmdl/TuxThemeColors.tmdl")!;
    const measures = [...tmdl.matchAll(/measure (\w+) = (IF\(.+)/g)];
    expect(measures.length).toBe(30);
    for (const [, name, expr] of measures) {
      expect(expr, name).toContain('SELECTEDVALUE(ThemeMode[Mode], "Light")');
      expect([...expr.matchAll(/"#[0-9A-Fa-f]{6}"/g)].length, name).toBe(2);
    }
  });

  it("brand surfaces stay invariant across modes; tooltips invert", () => {
    const tmdl = powerbi.get("kit/powerbi/pbir/tmdl/TuxThemeColors.tmdl")!;
    const pair = (name: string) => {
      const line = tmdl.split("\n").find((l) => l.includes(`measure ${name} =`))!;
      return [...line.matchAll(/"(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
    };
    // The masthead is maroon in dark mode too — the on-brand rule.
    const [shellDark, shellLight] = pair("ShellHeaderBg");
    expect(shellDark).toBe("#5C0025");
    expect(shellDark).toBe(shellLight);
    // A tooltip wants the opposite surface in each mode.
    const [tipDark, tipLight] = pair("TooltipBackground");
    expect(tipDark).not.toBe(tipLight);
  });

  const shell = (variant: string, name: string) =>
    JSON.parse(powerbi.get(`kit/powerbi/pbir/shell/${variant}/${name}/visual.json`)!);

  it("every shell visual carries the three schema-required keys", () => {
    const files = [...powerbi.keys()].filter((r) => r.includes("/pbir/shell/"));
    expect(files).toHaveLength(30); // 15 visuals × 2 canvas variants
    for (const rel of files) {
      const v = JSON.parse(powerbi.get(rel)!);
      // visualContainer/2.9.0 required: ["$schema", "name", "position"]
      expect(v.$schema, rel).toContain("/visualContainer/2.9.0/");
      expect(typeof v.name, rel).toBe("string");
      expect(Object.keys(v.position).sort(), rel).toEqual(
        ["height", "width", "x", "y", "z"],
      );
      // `titleText` is an embedded-JS-API concept; it hard-fails PBIR.
      expect(powerbi.get(rel), rel).not.toContain("titleText");
    }
  });

  // Tile appearance needs BOTH properties. "0L" would render a vertical
  // list instead, and Power BI ignores the wrong type silently.
  it("theme slicer pairs Basic mode with 1D orientation and syncs pages", () => {
    for (const variant of ["classic", "fluent2"]) {
      const s = shell(variant, "shell_theme_slicer").visual;
      expect(s.objects.data[0].properties.mode.expr.Literal.Value).toBe("'Basic'");
      expect(s.objects.general[0].properties.orientation.expr.Literal.Value).toBe("1D");
      // syncGroup lives inside `visual`, not a separate config file.
      expect(s.syncGroup).toEqual({
        groupName: "Mode",
        fieldChanges: true,
        filterChanges: true,
      });
      const proj = s.query.queryState.Values.projections[0].field.Column;
      expect(proj.Expression.SourceRef.Entity).toBe("ThemeMode");
      expect(proj.Property).toBe("Mode");
    }
  });

  it("brand chrome is invariant while the canvas follows the toggle", () => {
    for (const variant of ["classic", "fluent2"]) {
      const fill = (n: string) =>
        shell(variant, n).visual.objects.fill[0].properties.fillColor.solid.color
          .expr.Measure.Property;
      expect(fill("nav_btn_header_bg")).toBe("ShellHeaderBg");
      expect(fill("nav_btn_footer_bg")).toBe("ShellHeaderBg");
      expect(fill("nav_btn_header_accent_rule")).toBe("ShellAccentRule");
      expect(fill("shell_canvas_bg")).toBe("PageBackground");
      expect(fill("nav_btn_nav_bg")).toBe("CardBackground");
    }
  });

  // Active label sits on invariant maroon so it can be static white.
  // Inactive must follow the toggle, so it uses the title-text
  // workaround — paragraph textStyle.color cannot take a measureRef.
  it("nav pill labels use the right rendering mode for their surface", () => {
    for (const variant of ["classic", "fluent2"]) {
      const active = shell(variant, "nav_pill_active_label").visual;
      const run = active.objects.general[0].properties.paragraphs[0].textRuns[0];
      expect(run.textStyle.color).toBe("'#FFFFFF'");
      expect(run.value).not.toBe("");

      const inactive = shell(variant, "nav_pill_inactive_label").visual;
      // Paragraph cleared to empty; the copy moves to title.text.
      expect(
        inactive.objects.general[0].properties.paragraphs[0].textRuns[0].value,
      ).toBe("");
      const title = inactive.visualContainerObjects.title[0].properties;
      expect(title.text.expr.Literal.Value).toBe("'Detail'");
      expect(title.fontColor.solid.color.expr.Measure.Property).toBe("TextSecondary");

      // Calibrated offsets: paragraph text has internal top padding,
      // title text does not, so they need different y to sit level.
      const pillY = shell(variant, "nav_pill_active").position.y;
      expect(shell(variant, "nav_pill_active_label").position.y).toBe(pillY + 2);
      expect(shell(variant, "nav_pill_inactive_label").position.y).toBe(pillY + 8);
    }
  });

  it("shell visuals sit at their reserved z-levels", () => {
    const z = (n: string) => shell("classic", n).position.z;
    expect(z("shell_canvas_bg")).toBe(0);
    expect(z("nav_btn_content_tray")).toBe(1000);
    expect(z("nav_btn_header_bg")).toBe(3000);
    expect(z("shell_theme_slicer")).toBe(7000);
    expect(z("nav_title_context")).toBe(17000);
    expect(z("nav_pill_inactive_hit")).toBe(22000);
    // Nothing in the shell may squat in the content window.
    for (const [rel, content] of powerbi) {
      if (!rel.includes("/pbir/shell/")) continue;
      const { z: zz } = JSON.parse(content).position;
      expect(zz < 9000 || zz > 15000, rel).toBe(true);
    }
  });

  it("the theme slicer right-aligns on both canvases", () => {
    const x = (v: string) => shell(v, "shell_theme_slicer").position.x;
    const w = (v: string) => shell(v, "shell_theme_slicer").position.width;
    // Reproduces the hand-calibrated x=1093 on the 1280 canvas.
    expect(x("classic")).toBe(1093);
    expect(1280 - x("classic") - w("classic")).toBe(
      1920 - x("fluent2") - w("fluent2"),
    );
  });

  it("geometry emits both canvas variants with matching chrome bands", () => {
    const g = JSON.parse(powerbi.get("kit/powerbi/pbir/geometry.json")!);
    const { classic, fluent2 } = g.canvas;
    expect([classic.width, classic.height]).toEqual([1280, 920]);
    expect([fluent2.width, fluent2.height]).toEqual([1920, 1080]);
    // Chrome is type-driven, so band heights do NOT scale with canvas;
    // only the content area does.
    expect(classic.pills.y).toBe(fluent2.pills.y);
    expect(fluent2.content.width).toBeGreaterThan(classic.content.width);
    // Content visuals must stay inside the reserved z-window.
    expect(g.zOrder.contentMin).toBe(9000);
    expect(g.zOrder.contentMax).toBe(15000);
  });
});

describe("resolution semantics", () => {
  const cs = files.get("kit/csharp/TuxTokens.cs")!;
  const react = files.get("kit/react/tux-tokens.ts")!;
  const wp = JSON.parse(files.get("kit/wp/theme.json")!);

  it("brand anchor resolves per theme (maroon light, teal dark)", () => {
    expect(cs).toContain('public const string BrandPrimary = "#5C0025";');
    expect(cs).toContain('"#6BB4C0"'); // dark anchor present in TtiDark
    const themes = react.match(/"brand-primary": "(#[0-9A-Fa-f]{6})"/g)!;
    expect(themes[0]).toContain("#5C0025");
    expect(themes[1]).toContain("#6BB4C0");
  });

  it("wash ladder computes to rgba over the THEME's anchor", () => {
    expect(react).toContain('"wash-brand-8": "rgba(92, 0, 37, 0.08)"'); // tti
    expect(react).toContain('"wash-brand-8": "rgba(107, 180, 192, 0.08)"'); // tti-dark
  });

  it("WordPress theme.json carries the palette and the four families + mono", () => {
    expect(wp.version).toBe(3);
    expect(wp.settings.color.palette.length).toBeGreaterThanOrEqual(25);
    expect(wp.settings.typography.fontFamilies).toHaveLength(5);
    const primary = wp.settings.color.palette.find(
      (p: { slug: string }) => p.slug === "tux-brand-primary",
    );
    expect(primary.color).toBe("#5C0025");
  });
});
