# ADR 0003 — Standalone repo until an npm team is provisioned

- **Date**: 2026-04-24
- **Status**: Accepted

## Context

Three ways to distribute tti-ux to consuming apps:

1. **Published npm package** (`@ttitamu/tti-ux`). Cleanest consumer story —
   `npm install @ttitamu/tti-ux`. Requires an npm org, access tokens in CI,
   a release workflow, and a private registry (GitHub Packages works).
2. **Monorepo / pnpm workspace** — tti-ux, PECAN, tti-ai-chat, and the
   docs site all live in one workspace with live-linking. Fastest inner
   loop but forces every consumer into the monorepo.
3. **Standalone repo + local `file:` linking** during development,
   optionally publishing later.

As of 2026-04-24, TTI doesn't have an npm team provisioned; getting one
requires lead time we don't have. Moving PECAN + tti-ai-chat + the docs
site into a monorepo is a significant restructure with coordination cost
across multiple people.

## Decision

tti-ux is a standalone git repo at `github.com/ttitamu/tti-ux`. Downstream
apps consume it during development via `"tti-ux": "file:../tti-ux"` in
their `package.json` and `extends: ['tti-ux']` in `nuxt.config.ts` (Nuxt
layers).

When the npm team lands, we'll publish to the TTI private scope and cut
consumers over to a versioned dependency in a single ADR-0003-supersedes
PR.

## Consequences

- No version numbers, no release cadence. "Pull and restart" is the update
  story.
- Breaking changes to Tux component APIs land whenever we push — downstream
  apps break until they update their call sites. We mitigate via the
  CHANGELOG and by the fact that there's only one maintainer right now.
- Nuxt layer extension gives us auto-import of Tux\* components, the
  aggieux CSS chain, and `app.config.ts` theming without the consumer
  writing boilerplate — the layer model fits this distribution style
  naturally.
- Cloning for new developers is a two-step dance (clone tti-ux, then clone
  the consuming app beside it). Documented in each consumer's README.
- The standalone repo ALSO runs as its own Nuxt app — the living style
  guide at localhost:3030 doubles as dev-time validation that the
  components work.
