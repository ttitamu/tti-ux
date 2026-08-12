/**
 * Vitest config — two kinds of tests, one runner:
 *
 * - Pure/unit tests (tests/*.test.ts) run in the default node
 *   environment: catalog conformance, registry invariants, chart scale
 *   math. Fast, no DOM.
 * - Mounted component tests (tests/components/*.nuxt.test.ts) opt into
 *   the `nuxt` environment with a `// @vitest-environment nuxt`
 *   docblock. That environment boots the real Nuxt app context, so
 *   auto-imports (computed, useId, useTuxChartHover, tuxSeriesTone, …)
 *   resolve exactly as they do in the app — mounting a Tux* component
 *   with plain @vue/test-utils would fail on every bare auto-imported
 *   global. Mount with `mountSuspended` from @nuxt/test-utils/runtime.
 *
 * The DOM inside the nuxt environment is jsdom (already a devDep — the
 * a11y audit runs on it); happy-dom is not installed.
 */
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        domEnvironment: "jsdom",
      },
    },
  },
});
