# Calendar Interactive UI Kit (Community)

**Source:** Figma file `ckWPZlsKJwhIxI5qdhDKfG`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium
**Status:** absorbed — no new components

![cover](./cover.png)

## What it is

A month-grid calendar in light + dark themes, marketed as "interactive
prototype demo" — meaning the value-add isn't the visual (it's the
standard month grid) but the auto-layout-driven Figma prototype where
clicking a day cell updates the selected state. A pure Figma teaching
artifact more than a TUX-relevant component.

## Pages (2)

- `0:1` — Cover _(1 frame)_
- `2:173` — UI Kit _(7 top-level frames: light/dark month grids at
  several sizes; selected-day variant)_

## Skip

- **The "interactive prototype" angle.** Figma prototypes don't
  translate to Vue components — TUX consumers wire interactivity in
  code, not via Figma's prototype connectors.
- **Visual style.** Blue accent + flat fills; not TUX (maroon-led,
  hairline rules, restrained color).
- **Building a TuxCalendar from scratch.** Nuxt UI 4 already ships
  `UCalendar` (Reka UI primitive) with keyboard navigation, range
  selection, multi-select, locale, and disabled-dates support — all
  the table-stakes a TUX wrapper would re-implement. Wrapping it
  earns nothing until a real consumer needs editorial chrome
  (eyebrow / signature rule / source) around a date picker, which is
  not on Landscape or tti-ai-studio's surface.

## Absorb

1. **Pattern only — date-range selection sits next to filter chips.**
   When Landscape needs a "filter by date" affordance, the natural
   shape is `<UCalendar range>` rendered inside a `TuxFilterPanel`,
   with selected ranges echoed as `TuxRemovableChip` tokens in the
   active-filters row. No new TUX component; document the
   composition in `design/components.md` only **if** a Landscape
   surface demands it. Until then, this is a private mental note.
2. **Dark-mode month grid sanity check.** Their dark grid uses pure
   black `#000` plus blue accent — too high-contrast vs surrounding
   chrome. TUX's `--surface-1` / `--surface-2` token pair already
   gives the right "panel inside panel" depth in dark theme; when a
   calendar lands, use the existing surface tokens, not a blacker
   panel.

## Tension

- **The "interactive prototype" framing tempts a `TuxCalendar`
  showcase route.** Resist: building a wrapper just to demo Reka's
  calendar adds maintenance burden without adding TUX-specific
  value. The threshold is editorial chrome or a behavior Reka
  doesn't ship (e.g. "highlight TTI fiscal-year boundaries").
- **Blue-accent default vs maroon-led palette.** If/when we wrap, the
  selected-day swatch should be `--brand-maroon`, not blue.

## Decisions

- **No new TuxCalendar component now.** Reka's `UCalendar` is the
  current recommendation for any consumer that needs date selection.
- **No new design-doc entry.** Premature; revisit when Landscape
  actually adds a date-range filter (no current surface needs it —
  Landscape's window selector is "Last 7d / 30d / 90d" preset chips,
  not arbitrary date ranges).

## Open follow-ups

- If/when a TUX consumer needs arbitrary date-range selection,
  spec a thin `TuxCalendar` wrapper that:
  - Re-themes the selected-day swatch to `--brand-maroon`.
  - Optionally shows TTI fiscal-year boundary rules.
  - Surfaces a presets row above the grid (Last 7d / 30d / 90d /
    YTD / Custom) — the actual interaction Landscape uses.
- File reads as "skip-or-skim" in retrospect; downgrade priority
  from medium to skip on next INDEX rebuild.
