// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Vendored upstream code — sync'd via scripts/sync-aggieux.mjs, so
  // linting it serves no purpose; fixes would be overwritten on next sync.
  // `spike/**` is exploratory throwaway code (ADR-0012 feasibility spikes),
  // intentionally outside the Nuxt app and not subject to the app's rules.
  {
    ignores: ['reference/**', 'spike/**'],
  },
)
