// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Vendored upstream code — sync'd via scripts/sync-aggieux.mjs, so
  // linting it serves no purpose; fixes would be overwritten on next sync.
  {
    ignores: ['reference/**'],
  },
)
