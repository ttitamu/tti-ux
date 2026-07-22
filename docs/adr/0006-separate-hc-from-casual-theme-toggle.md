# ADR 0006 — Separate high-contrast mode from the casual theme toggle

- **Date**: 2026-04-24
- **Status**: Accepted
- **Supersedes (in part)**: [ADR 0005](0005-three-theme-palette.md) — the
  three-way cycle decision. The three-theme palette itself stays; the
  single-toggle-cycles-all-three UX is what changes.

## Context

ADR 0005 picked a three-way cycle for the header theme toggle: tti →
tti-dark → tti-hc → tti. Rationale was a single control covering all
three named themes.

In practice, that design pushes every casual theme-switcher through
tti-hc — and because tti-hc uses WCAG AAA line weights (near-black text,
dark borders), it reads visually unpolished next to tti's lighter,
editorial feel. Users who just wanted to toggle dark mode now see a
"phase" of their theme cycle that looks broken even though it's
intentional.

The underlying tension: **dark mode is a preference, high-contrast is an
accessibility accommodation.** Conflating them in one cycle means we
either:

1. Compromise on HC's contrast to make it look like a normal theme
   (degrading accessibility), or
2. Keep HC strong and accept that most users stumble through it thinking
   something's broken.

Neither is good.

## Decision

Split the controls by purpose:

- **Header toggle** — light ↔ dark only. Cycles between `tti` and
  `tti-dark`. Icon shows the next state (moon when light, sun when dark),
  mirroring OS-level theme toggles.
- **Footer link** — "High-contrast mode" button with an `aria-pressed`
  state. Toggles `tti-hc` on/off independently. Uses
  `lucide:accessibility` icon so it signals "accessibility option," not
  "aesthetic preference."
- From `tti-hc`, the header toggle exits to `tti` (light) — the most
  conservative default. Users who want dark from HC can click the header
  toggle a second time.

## Consequences

- Users on `tti-hc` who haven't clicked the footer button are invisible
  to the header toggle's state — the moon icon still shows regardless.
  That's acceptable because HC users who deliberately enabled it from
  the footer already know where the exit is.
- The footer is now a place where small utilities live (HC toggle is the
  first). Future accessibility affordances — reduced motion, font-size
  bump, keyboard-nav hints — would land there too.
- The three-theme palette from ADR 0005 is unchanged. `tti-hc` still
  exists as a first-class theme with full token coverage; it's just not
  in the casual cycle.
- ADR 0005's "three blocks in tokens.css, each a full override" decision
  stands. Adding a new token still requires adding it to all three
  blocks.
