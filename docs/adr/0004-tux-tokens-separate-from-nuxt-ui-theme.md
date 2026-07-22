# ADR 0004 — tux tokens live alongside the Nuxt UI theme, not inside it

- **Date**: 2026-04-24
- **Status**: Accepted

## Context

Nuxt UI 4 has its own theming system: `app.config.ts` maps semantic color
aliases (`primary`, `neutral`, `info`) to Tailwind palette names (`maroon`,
`stone`, `teal`). That system covers Nuxt UI's own primitives well — pass
`color="primary"` and UButton fills maroon.

But the TTI brand has more than Nuxt UI's palette slots: editorial
typography utilities (`heading--bold`, `heading--display`, `eyebrow`),
signature motion (the card corner-drop), utility classes consumed by Tux
wrappers (`tux-alert--warning`, `btn-fill-on-hover`), and tokens for
things Nuxt UI doesn't model (shadow-focus, radius-lg, `--brand-accent`
for gold bars).

We considered folding everything into Nuxt UI's theme config as a
"super-theme." But Nuxt UI's theme isn't designed to host arbitrary CSS —
it owns color aliasing and that's it. Forcing our broader token set in
means fighting the tool.

## Decision

Tokens live in three CSS files loaded in strict order:

1. `app/assets/css/tokens.css` — plain `:root` + `[data-theme="..."]`
   custom-property declarations. Theme-switchable. Hand-maintained for
   now; eventually generated from `design/tokens.json` via Style
   Dictionary.
2. `app/assets/css/globals.css` — imports Tailwind + Nuxt UI, then
   re-exposes our custom properties to Tailwind's `@theme` so utilities
   like `bg-surface-page` work. Also hosts editorial utilities
   (`.heading--bold`, `.eyebrow`, `.subhead`).
3. `app/assets/css/tux.css` — the Tux-specific utility layer:
   `card-linked`, `tux-table`, `tux-alert--warning`, `link-tti`,
   `btn-fill-on-hover`, etc. Referenced by Tux components that need
   stylistic deviations Nuxt UI's `:ui` prop can't express cleanly.

Nuxt UI's `app.config.ts` is a thin alias layer pointing at palettes
defined in the CSS: `primary: 'maroon'`, `info: 'teal'`, etc.

## Consequences

- Two theming systems coexist: ours for tokens + utilities, Nuxt UI's for
  color aliasing. They compose cleanly because the alias layer just
  resolves names to our palettes.
- CSS load order is load-bearing — `tokens.css` must come first so
  `@theme` in `globals.css` can reference the vars, and `tux.css`
  last so its rules can layer over Nuxt UI's. Documented inline in
  `nuxt.config.ts`.
- Dark theme and high-contrast theme work by swapping `data-theme`
  attributes — all tokens rebind, all utility classes adapt. Nuxt UI's
  color-mode plugin handles the toggle; our `tokens.css` does the heavy
  lifting.
- When Nuxt UI 5 ships, we audit for theme-config churn but the CSS side
  stays stable (it's just W3C custom properties + Tailwind).
