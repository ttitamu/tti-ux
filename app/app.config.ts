/**
 * Nuxt UI theme binding — maps Nuxt UI's semantic color aliases to the
 * Tailwind palettes defined in globals.css `@theme` / tokens.css ramps.
 * `maroon` is the TTI brand palette generated around #5C0025 (pinned at
 * shade 500).
 *
 * `tip` is added as a custom alias (see nuxt.config.ts `ui.theme.colors`) so
 * TuxAlert's tip variant can own the violet family, distinct from success's
 * green. `warning` is backed by the TTI gold ramp (#DDAC37 anchor,
 * --color-gold-*) — owner-ratified 2026-07-30, replacing the amber
 * stand-in. Landscape's local warning→gold override becomes redundant at
 * its next pin-bump.
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: "maroon",
      neutral: "stone",
      info: "teal",
      success: "emerald",
      warning: "gold",
      error: "red",
      tip: "violet",
    },
  },
});
