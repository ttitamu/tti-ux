/**
 * Nuxt UI theme binding — maps Nuxt UI's semantic color aliases to the
 * Tailwind palettes defined in globals.css `@theme`. `maroon` is the TTI
 * brand palette generated around #5C0025 (pinned at shade 500).
 *
 * `tip` is added as a custom alias (see nuxt.config.ts `ui.theme.colors`) so
 * TuxAlert's tip variant can own the violet family, distinct from success's
 * green. Still a stand-in: `warning` = amber. A TTI gold palette (#DDAC37
 * anchor) would back warning properly — follow-up.
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: "maroon",
      neutral: "stone",
      info: "teal",
      success: "emerald",
      warning: "amber",
      error: "red",
      tip: "violet",
    },
  },
});
