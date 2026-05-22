# Apple Widgets UI Kit (Community)

**Source:** Figma file `CMD3wL5TlhBOPwfrEPxFjn`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 (platform-aware lens)
**Priority:** medium (re-bucketed from skip)
**Status:** absorbed — no new components; speculative future widget framing

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> A Doist-designed catalog of widget mockups for iOS / iPadOS /
> macOS Home Screen + Notification Center widgets. **Speculative
> for TUX** — only relevant if TTI ships a "Landscape Today" desktop
> widget.

## What it is

A community Figma file by the Doist design team showing **68 widget
mockups** across Apple's four widget size tiers (Small, Medium,
Large, Extra Large). Calendar, Today schedule, Photos, Reminders,
Notes, Maps, weather, music, podcasts.

For TUX, the only realistic application: **a future "Landscape
Today" widget** that surfaces a single KPI (e.g., "today's research
runs · 8 in progress · 2 errors") on the macOS Home Screen / iOS
lock screen.

## Pages (5)

- `73:899` — Thumbnail _(skip)_
- `0:1` — **UI Mockups** _(18 frames — widget-on-home-screen
  scenes)_
- `6:59` — **Widgets** _(68 frames — the widget catalog)_
- `10:12` — iOS 14 Wallpaper _(skip — marketing backdrop)_
- `10:23` — iPhone Frames _(skip — device mockups)_

## The Apple widget size grid

Apple widgets come in four sizes; this file confirms the standard
proportions:

| Size | iOS (pts) | macOS (pts) |
|---|---|---|
| Small | 158 × 158 | 155 × 155 |
| Medium | 338 × 158 | 329 × 155 |
| Large | 338 × 354 | 345 × 343 |
| Extra Large | n/a (iOS) | 715 × 343 |

Useful as a **future Landscape KPI tile inventory** — if Landscape
ever ships a widget, the small/medium variants get one KPI each;
large variants compose 2-4 KPIs in a grid.

## Skip

- **Building widget Vue components today.** No consumer surface
  asks. Capture the geometry; defer the build.
- **Widget timeline / refresh patterns.** Apple's widget model
  (WidgetKit + Swift) is fundamentally outside the Tauri / web
  runtime. A Landscape widget would have to be a tiny separate
  app, not a TUX component.
- **Decorative widget styles.** Most widgets shown here are
  consumer-content widgets (Photos, Music); not TUX patterns.

## Absorb

1. **Widget tier inventory.** Recorded above. When Landscape needs
   a widget surface (speculative), the small/medium/large/XL grid
   informs the KPI count per tile:
   - Small: 1 KPI (current value + tiny sparkline)
   - Medium: 1 KPI + 7-day spark + delta
   - Large: 3-4 KPI grid (TuxBigStat-shaped)
   - XL: full mini-dashboard (KPI row + chart)

2. **TUX KPI tiles already align.** `TuxBigStat` + `TuxFactoid` +
   `TuxSparkline` compositions already produce widget-shaped
   surfaces at the right ratios. A future widget app could embed
   a `TuxBigStat` directly, sized to Apple's grid.

3. **No new TUX component.** A widget is an *application*, not a
   component. The pieces (`TuxBigStat`, `TuxSparkline`) are
   ready.

## Tension

- **"Build a `TuxWidget` component" temptation.** No — a widget
  is a deliverable, not a component. TUX provides the building
  blocks; an app composes them.
- **Doist's color palette is bright + saturated** (Reminders red,
  Notes yellow, Tasks blue). TUX widgets, if shipped, stay
  maroon-led.

## Decisions

- **No new components.**
- **No widget-app commitment.** Speculative future surface only.
- **Move file from skip → medium** in priority sets — it has
  legitimate future relevance.
- **Record widget tier dimensions** above so they're recoverable
  without re-reading the file.

## Open follow-ups

- If a "Landscape Today" widget app is ever proposed, the size
  grid in §1 is the starting point. The widget app would be a
  separate Swift / SwiftUI deliverable (not a TUX component),
  but it would consume TUX tokens for color + type.
