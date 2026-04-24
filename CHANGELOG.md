# Changelog

All notable changes to tti-ux. Follows [Keep a Changelog](https://keepachangelog.com/)
conventions and [Semantic Versioning](https://semver.org/) — though while we're
pre-1.0 and not-yet-published, "breaking changes" just mean "update consumers
when you pull." No npm publish, no version tags, yet.

## Unreleased

### Changed
- **Theme toggle split** — the header toggle is now **light ↔ dark only**
  (`tti ↔ tti-dark`). High-contrast mode (`tti-hc`) moved to a dedicated
  footer button, because WCAG AAA's line weights read as "broken" in a
  casual theme cycle and users shouldn't be pushed through an
  accessibility mode as part of aesthetic preference. See
  [ADR 0006](docs/adr/0006-separate-hc-from-casual-theme-toggle.md) —
  supersedes the three-way cycle from ADR 0005 (the palette itself
  stays).

### Added
- **Initial scaffold** (2026-04-24) — Nuxt 4 runnable style guide, extracted
  from PECAN's frontend so tti-ux can serve as the source of truth for
  downstream Nuxt apps.
- **7 Tux\* components** wrapping Nuxt UI primitives where TTI branding
  requires deviation:
  - `TuxAlert` — 8 admonition variants (note/tip/info/important/success/
    warning/danger/compliance) with left-bar treatment.
  - `TuxBadge` — 5 shapes (tier/status/tag/count/default).
  - `TuxButton` — single `intent` prop for primary/secondary/ghost/destructive.
  - `TuxCard` — static or linked; linked has corner-drop hover signature.
  - `TuxModal` — editorial rhythm (eyebrow + gold-bar title).
  - `TuxSectionHeader` — aggieux ALL-CAPS heading with maroon underline.
  - `TuxTable` — maroon-wash header, auto status-cell rendering via TuxBadge.
- **3 themes** — `tti` (default), `tti-dark` (warm-charcoal dark), `tti-hc`
  (WCAG AAA high-contrast). Three-way cycle in the header toggle.
- **Style-guide pages**:
  - `/` — landing with foundations + components grid.
  - `/tokens` — brand palette, semantic roles, status colors, maroon ramp,
    shadows, radii.
  - `/typography` — heading utilities, type scale, inline treatments.
  - `/motion` — spacing ramp, duration tiers, corner-drop demo, Transition
    example.
  - `/components` + `/components/{alert,badge,button,card,modal,
    section-header,table}` — per-component demos.
  - `/forms` — inputs, textarea, select, radio, checkboxes, switch, slider,
    chip input, date, validation + focus-ring notes.
  - `/patterns` — empty state, loading skeleton, table-state cycle,
    confirmation flow pointer, admonition stack.
- **Placeholder tuxedo SVG logo** — maroon jacket, gold bow tie, white shirt
  front, charcoal frame. Needs iteration with a polished mark.
- **Design docs** (`design/`) — `aggieux.md`, `components.md`, `palette.md`,
  `tokens.json` — carried from PECAN.
- **Dev server binds :3030** — avoids collision with PECAN and docs-tti-tamu-edu
  on :3000.

### Known gaps

- No npm publish yet — downstream apps must consume via `file:../tti-ux`
  and `extends: ['tti-ux']` in their nuxt.config.ts.
- No git remote yet — local repo only; will push to `ttitamu/tti-ux` when
  the empty remote exists.
- PECAN still ships its own copies of the 5 `Pecan*` wrappers. Layer
  consumption wiring is a separate follow-up.
- Style Dictionary pipeline for `design/tokens.json` → `tokens.css` isn't
  wired; `tokens.css` is hand-maintained for now.
- `warning` Nuxt UI color = Tailwind `amber`; a TTI-gold-anchored palette
  would back it properly — inherited TODO from PECAN.
