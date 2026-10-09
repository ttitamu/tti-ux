// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Vendored upstream code — sync'd via scripts/sync-aggieux.mjs, so
  // linting it serves no purpose; fixes would be overwritten on next sync.
  // `spike/**` is exploratory throwaway code (ADR-0012 feasibility spikes),
  // intentionally outside the Nuxt app and not subject to the app's rules.
  {
    ignores: [
      'reference/**',
      'spike/**',
      'packages/**',
      'scripts/**',
      'tests/**',
      'server/**',
      'kit/**',
      'public/**',
      'dist/**',
      '.output/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'warn',
      'no-useless-escape': 'off',
      'vue/no-deprecated-filter': 'warn',
      'vue/no-parsing-error': 'warn',
      'no-useless-assignment': 'warn',
      'no-empty': 'warn',
      'import/first': 'warn',
      'prefer-const': 'warn',
    },
  },
)
