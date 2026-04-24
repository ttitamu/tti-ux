# ADR 0002 — `Tux*` as the component prefix

- **Date**: 2026-04-24
- **Status**: Accepted

## Context

When tti-ux extracted from PECAN, the components inherited PECAN's `Pecan*`
prefix (PecanAlert, PecanCard, etc.). If tti-ux is the source of truth,
the prefix needs to be app-agnostic — otherwise a consuming app like
tti-ai-chat importing `PecanAlert` reads as a leaky abstraction.

Candidate prefixes considered:

| Prefix          | Pro                                            | Con                                         |
| --------------- | ---------------------------------------------- | ------------------------------------------- |
| `Tti*`          | Org-aligned, matches the file naming elsewhere | Org rebrands happen; reads awkward in text  |
| `Ux*`           | Short, generic                                 | Collides with the literal term "UX"         |
| `Tux*`          | Short, unique, maps to repo name `tti-ux`      | Not a word — requires a one-time learning   |
| `Pecan*` (keep) | Zero churn in PECAN                            | Wrong semantics for a shared library        |

The `Tux*` option has the additional win of a built-in visual identity — a
tuxedo icon in TTI colors (maroon jacket, gold bow tie) works as the repo
mark and carries forward into merch / internal slide decks without feeling
corporate-generic.

## Decision

Component filenames are PascalCase with a `Tux` prefix (`TuxAlert.vue`).
Templates can use either `<TuxAlert>` or `<tux-alert>` — Nuxt auto-imports
resolve both. Imports in `<script setup>` use PascalCase.

## Consequences

- PECAN's existing `Pecan*` components keep working in place until the
  Nuxt-layer migration lands; at that point we delete them and add a
  re-export shim in PECAN if call-site churn gets painful.
- The style guide runs at port 3030 (not 3000) to coexist with PECAN and
  docs-tti-tamu-edu local dev servers.
- The tuxedo logo is explicitly load-bearing — this ADR assumes the mark
  survives. If TTI brand guidance ever disallows the tuxedo, we'd supersede
  this ADR with a new naming decision rather than awkwardly divorce the
  prefix from the visual.
