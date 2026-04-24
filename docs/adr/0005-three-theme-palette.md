# ADR 0005 — Three-theme palette (tti / tti-dark / tti-hc)

- **Date**: 2026-04-24
- **Status**: Accepted (three-theme palette); three-way toggle cycle is
  **superseded by [ADR 0006](0006-separate-hc-from-casual-theme-toggle.md)**

## Context

Texas A&M Transportation Institute is a unit of the Texas A&M University
System and a state agency. State agency web presences must meet Texas
Government Code §2054.459 (state web accessibility standards) and the
TAMUS Accessibility Policy, both of which reference WCAG 2.1 AA as a floor
and recommend AAA where feasible.

Separately, developer and designer audiences increasingly expect dark mode
as table stakes, and dark mode isn't automatically an accessibility
feature — it's a user-preference feature.

These are two distinct axes:

1. **Light ↔ Dark** — aesthetic preference.
2. **Standard ↔ High-contrast** — accessibility compliance ceiling.

A single toggle that conflates them (e.g. dark = high-contrast) is worse
than either axis alone: a user wanting AAA in daylight gets forced dark;
a user wanting dark at night gets forced to see black-on-white text.

## Decision

Three named themes, driven by `[data-theme]` on `<html>`:

- **`tti`** — the default. Maroon #5C0025 on warm white, WCAG AA+.
- **`tti-dark`** — warm charcoal surfaces with the maroon lightened to
  ~#b14a6c (maroon-400) so it stays visible on dark. Gold accent
  unchanged. Targets WCAG AA.
- **`tti-hc`** — pulled directly from TTI's 508-accessible PPTX palette.
  Pure black text on pure white, darker maroon (#500000), zero
  color-mixing. WCAG AAA.

Theme toggle cycles through all three: tti → tti-dark → tti-hc → tti.
Icon signals the next state (sun = "click to go back to light," moon =
"click for dark," contrast icon = "click for high-contrast").

## Consequences

- Three blocks in `tokens.css`, each a full override of every semantic
  token. When we add a new token, we must add it to all three blocks —
  missing a theme shows as "falls back to :root value," which is usually
  wrong.
- Color mixing via `color-mix(in srgb, ...)` works in tti and tti-dark but
  produces washed-out results in tti-hc (pure-color palette). The tti-hc
  block overrides surface tints to solid values to sidestep this.
- Future additions (sepia, solarized, anything else) should land as ADR-
  supersedes-0005 rather than quietly growing the cycle — three is
  already near the UX ceiling for "click-to-cycle." A fourth theme wants
  a dropdown or preference page instead.
- Meeting AAA in tti-hc is a compliance claim, not a claim about tti or
  tti-dark. Those are targeted at AA. Audit reports should run against
  all three.
