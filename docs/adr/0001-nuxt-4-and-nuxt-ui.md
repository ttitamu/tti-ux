# ADR 0001 — Nuxt 4 + Nuxt UI as the foundation

- **Date**: 2026-04-24
- **Status**: Accepted

## Context

tti-ux needs to serve every in-house TTI Nuxt app. The candidate apps as of
scaffolding are PECAN, tti-ai-chat, Aggie BI, and the
docs-tti-tamu-edu site — all already on Nuxt 4. A component library built
on a different framework (Vue 3 + raw CSS, or Vite + Vue without Nuxt
conventions) would force those apps into integration work to consume it.

Nuxt UI 4 ships the hard primitives we'd otherwise rewrite: accessible
modal, focus-trapped popovers, a11y-audited form controls, color-mode
integration, and a theming layer that composes with Tailwind v4's `@theme`.
Reinventing those from scratch to stay framework-agnostic would burn
months for no measurable gain.

The trade-off is lock-in: if downstream apps ever move off Nuxt, they'd
have to re-platform tti-ux too. Given that all current consumers are Nuxt
and the broader Nuxt ecosystem is stable and growing, the risk is low.

## Decision

tti-ux is a Nuxt 4 project. Components wrap Nuxt UI primitives where
possible; we only go native (plain Vue + tux CSS) when Nuxt UI doesn't
cover the need or when Nuxt UI's opinions fight the TTI brand too hard to
override cleanly.

## Consequences

- Consuming apps must be on Nuxt 4 or later. Non-Nuxt apps can't use tti-ux
  directly — they'd need to copy the tux CSS tokens and rebuild
  components.
- We inherit Nuxt UI's release cadence. When they release a breaking change
  (e.g. Nuxt UI 5 renaming a prop), we track it in our CHANGELOG and bump.
- Component authoring is lighter — most Tux\* components are 30–100 lines
  wrapping a UXxx primitive with the TTI-flavored defaults.
- The living style guide IS a Nuxt app. Running it is `npm run dev`; every
  component page is an SSR-rendered route.
