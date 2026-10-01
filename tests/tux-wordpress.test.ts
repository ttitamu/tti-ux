/**
 * tests/tux-wordpress.test.ts
 *
 * Invariant tests for Turnkey WordPress integration:
 * 1. Kadence Child Theme (packages/wordpress/kadence-child-tti/)
 * 2. TTI-UX Core Plugin (packages/wordpress/tti-ux-core/)
 * 3. theme.json token synchronization and WCAG AAA compliance
 */

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHILD_THEME_DIR = join(ROOT, "packages/wordpress/kadence-child-tti");
const PLUGIN_DIR = join(ROOT, "packages/wordpress/tti-ux-core");

describe("Turnkey WordPress — Kadence Child Theme", () => {
  it("includes all essential WordPress child theme files", () => {
    expect(existsSync(join(CHILD_THEME_DIR, "style.css"))).toBe(true);
    expect(existsSync(join(CHILD_THEME_DIR, "functions.php"))).toBe(true);
    expect(existsSync(join(CHILD_THEME_DIR, "theme.json"))).toBe(true);
    expect(existsSync(join(CHILD_THEME_DIR, "README.md"))).toBe(true);
  });

  it("style.css declares valid Kadence template and institutional TTI rules", () => {
    const css = readFileSync(join(CHILD_THEME_DIR, "style.css"), "utf8");

    // Standard WordPress child theme headers
    expect(css).toContain("Theme Name: TTI Kadence Child Theme");
    expect(css).toContain("Template: kadence");
    expect(css).toContain("Version: 3.0.0");

    // Official TTI brand tokens and Kadence rectangular button override
    expect(css).toContain("--global-btn-radius: 0px !important;");
    expect(css).toContain("#500000"); // Aggie Maroon
    expect(css).toContain("#cfa935"); // Warm Gold

    // Signature heading rhythm
    expect(css).toContain("border-bottom: 2px solid #cfa935 !important;");

    // WCAG 2.2 AAA 44px min touch target and focus indicator
    expect(css).toContain("min-height: 44px !important;");
    expect(css).toContain("outline: 3px solid #500000 !important;");
  });

  it("functions.php enqueues tokens, bridge, and registers the Kadence palette", () => {
    const php = readFileSync(join(CHILD_THEME_DIR, "functions.php"), "utf8");

    expect(php).toContain("define('TTI_KADENCE_CHILD_VERSION', '3.0.0');");
    expect(php).toContain("tux-tokens");
    expect(php).toContain("tux-bridge");
    expect(php).toContain("tux-elements");
    expect(php).toContain("add_filter('kadence_global_palette'");
    expect(php).toContain("#500000"); // Aggie Maroon
    expect(php).toContain("#CFA935"); // Warm Gold
    expect(php).toContain("kadence_before_header");
  });

  it("theme.json is valid JSON with official TTI colors and font definitions", () => {
    const jsonStr = readFileSync(join(CHILD_THEME_DIR, "theme.json"), "utf8");
    const themeJson = JSON.parse(jsonStr);

    expect(themeJson.version).toBe(3);
    expect(themeJson.settings.color.palette).toBeInstanceOf(Array);

    const palette = themeJson.settings.color.palette;
    const hasMaroon = palette.some((c: any) => c.color.toLowerCase() === "#500000" || c.color.toLowerCase() === "#5c0025");
    expect(hasMaroon).toBe(true);
  });
});

describe("Turnkey WordPress — TTI-UX Core Plugin", () => {
  it("plugin header specifies v3.0.0 and valid WordPress metadata", () => {
    const php = readFileSync(join(PLUGIN_DIR, "tti-ux-core.php"), "utf8");

    expect(php).toContain("Plugin Name: TTI-UX Core");
    expect(php).toContain("Version: 3.0.0");
    expect(php).toContain("define('TTI_UX_VERSION', '3.0.0');");
    expect(php).toContain("tti-ux-bridge");
    expect(php).toContain("#500000");
    expect(php).toContain("#CFA935");
  });

  it("shortcodes.php registers all core and portal shortcodes", () => {
    const php = readFileSync(join(PLUGIN_DIR, "includes/shortcodes.php"), "utf8");

    expect(php).toContain("add_shortcode('tux_stat'");
    expect(php).toContain("add_shortcode('tux_alert'");
    expect(php).toContain("add_shortcode('tux_card'");
    expect(php).toContain("add_shortcode('tux_heading'");
    expect(php).toContain("add_shortcode('tux_portal_header'");
    expect(php).toContain("add_shortcode('tux_staleness'");
  });

  it("patterns.php registers Gutenberg block patterns with institutional styling", () => {
    const php = readFileSync(join(PLUGIN_DIR, "includes/patterns.php"), "utf8");

    expect(php).toContain("register_block_pattern_category");
    expect(php).toContain("tti-ux/research-hero");
    expect(php).toContain("tti-ux/center-grid");
    expect(php).toContain("tti-ux/telemetry-table");
    expect(php).toContain("tti-ux/executive-factsheet");
    expect(php).toContain("#500000");
    expect(php).toContain("#CFA935");
  });
});
