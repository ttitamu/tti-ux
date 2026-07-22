# Windows UI kit — App UI Examples (page 7)

**Source:** Figma file `gngcSNotsStVdOdZD9zff5`, page `169220:24874`
**Captured:** 2026-05-19
**Frames in this folder:** `starter-1.png` (light), `starter-2.png` (dark),
`variant-1.png` … `variant-6.png` (rendered at 0.5x scale)

## What it actually is

It's not 8 separate things — it's **one Win11 app shell shown at 6 responsive
breakpoints**, plus the same shell in light + dark.

| Frame        | Width band   | State of the rail                              |
|--------------|--------------|------------------------------------------------|
| starter-1/2  | ≥1252        | Full rail (icons + Settings pinned at bottom)  |
| variant-1    | ≥1252        | (same as starter, in the variants grid)        |
| variant-2    | 1020–1251    | Rail icons-only, labels hidden                 |
| variant-3    | 708–1019     | Rail collapses to hamburger overlay            |
| variant-4    | 660–707      | No rail; hamburger lives in titlebar           |
| variant-5    | 348–660      | Tablet portrait; no rail                       |
| variant-6    | <348         | Mobile portrait; no rail                       |

## Skip

- The Win32 titlebar with min/max/close glyphs — TUX is a web layer
- "App name" chip in the titlebar — TUX surfaces app identity through
  `TuxSiteNav` on editorial routes; on app-shell routes the consumer
  app supplies it via the `header` slot
- Mica/acrylic blur and the elevation glow around the window frame —
  pure desktop-OS idiom
- The "break me / copy me" duplicate-template workflow — TUX is
  component-based, not template-duplication based

## Absorb

- The breakpoint **ladder** itself. Microsoft has thought through where
  each navigation state should switch. Their numbers (348/660/708/1020/1252)
  don't match TUX's Tailwind-default content widths, so we rebased — see
  `design/tokens.json` → `breakpoint`.
- Collapsible rail with **three** states (labels / icons-only / overlay),
  not just two. Cleaner than a binary expanded/collapsed toggle.
- Settings pinned at the rail bottom, visually separated from primary
  nav. Small but a real convention.

## Tension

- TUX principle #1: "editorial, not dashboard-y." The Windows shell is
  the *archetypal* dashboard chrome. Resolution: this pattern is opt-in
  via `definePageMeta({ layout: "sidebar" })` and only appropriate on
  data-dense surfaces (PECAN dashboard, tti-ai-studio session). Marketing
  and editorial pages stay on `default.vue` + `TuxSiteNav`.

## Decisions landed

- Added `breakpoint` block to [`design/tokens.json`](../../../../design/tokens.json)
  with TUX-anchored values and `$description` per breakpoint
- Scaffolded [`app/layouts/sidebar.vue`](../../../../app/layouts/sidebar.vue) — fills the slot the
  default-layout comment already anticipated
- Did **not** touch Tailwind config or Nuxt UI app config — the Style
  Dictionary pipeline will pick up the new tokens on the next rebuild

## Open follow-ups

- Wire the `breakpoint` tokens into the Tailwind v4 `@theme` block in
  `globals.css` so utility classes and the token source agree
- Build a `TuxRailNav` component (or extend `TuxSiteNav`) for the
  three-state rail pattern, then plug it into `sidebar.vue`'s `rail` slot
- Try the new layout on [`app/pages/examples/pecan-dashboard.vue`](../../../../app/pages/examples/pecan-dashboard.vue)
  and [`app/pages/examples/tti-ai-studio-session.vue`](../../../../app/pages/examples/tti-ai-studio-session.vue) — see whether
  it earns its keep on real surfaces
