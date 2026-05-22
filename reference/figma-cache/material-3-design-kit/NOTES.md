# Material 3 Design Kit (Community)

**Source:** Figma file `6gfRZduXViu124cHw9RFRn`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 (platform-aware lens)
**Priority:** medium (re-bucketed from skip)
**Status:** absorbed — no new components; doctrine inputs for Tauri-on-Android (future)

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> Google's **Material 3** (Material You) design system. Anchor for
> Android-native conventions; future Tauri Mobile Android target.
> Today no TTI consumer ships to Android — absorbed as
> doctrine-grounding for the bottom-nav, FAB, and gesture
> conventions Material defines.

## What it is

The official **Material 3 (Material You)** design kit from Google.
33 pages covering Material's full atom catalog plus the
**dynamic-theming-from-wallpaper** system that's Material 3's hero
feature.

## Pages (33)

Selected highlights:

- `11:1833` — Getting started _(kit docs)_
- `55879:3580` — Table of contents
- `55595:3788` — Avatars
- `55594:2483` — Icons
- `49823:12141` — **Styles** _(5 frames — Material 3 type, color,
  elevation system)_
- `58548:7093` — Shape _(2 frames — corner radius scale)_
- `55141:14169` — **App bars** _(3 frames — top-app-bar variants)_
- `55141:14168` — Buttons _(7 frames — Filled / Tonal / Outlined /
  Text / Elevated / FAB)_
- `55141:14172` — Carousel
- `55141:14175` — Date & time pickers _(2 frames)_
- `55141:14176` — Dialogs
- `55141:14249` — **Lists** _(2 frames — Material list idioms)_
- `55141:14252` — Loading & progress
- `55141:14251` — **Navigation** _(5 frames — bottom nav, nav rail,
  nav drawer)_

## Pattern → TUX-on-Tauri-Android mapping (future)

| Material 3 surface | TUX-on-Android behavior | Implementation hook |
|---|---|---|
| **Bottom nav** (3-5 destinations) | `TuxTabBar` (future; same component as iOS) | Container-query trigger on mobile |
| **FAB** (Floating Action Button) | Optional `TuxFAB` for "compose new" actions; bottom-right anchored | Future; defer until Android target |
| **Top app bar** (Material's titlebar) | `TuxAppFrame` adapts: Material elevation tier, no traffic lights | `[data-platform="android"]` styles |
| **Status bar** | Tauri controls visibility + tint (light/dark icons) | Tauri config |
| **Snackbar** | TUX has `TuxStatusToast` — covers it | No change |
| **Bottom sheet** | Same as iOS sheet pattern: `TuxModal` mobile variant | Shared with iOS |
| **Tonal palette** (Material's M3 color-from-wallpaper system) | **Don't adopt** — TUX brand maroon stays | N/A |
| **Elevation as color** (shadows replaced by tinted surfaces) | **Don't adopt** — TUX uses both shadows + flat paper-grain | N/A |
| **Dynamic Type / scaling** | TUX already uses `rem` everywhere | No change |
| **Ripple effect on tap** | Subtle ripple on touch surfaces — optional opt-in on `[data-platform="android"]` only | Future composable |

## Skip

- **Material's tonal palette / dynamic theming.** Material 3's
  hero feature is extracting an accent palette from the user's
  wallpaper. TUX brand maroon is the anchor; we don't recolor.
- **Elevation-as-color.** Material 3 replaces shadows with tinted
  surface variants ("Surface Container Lowest" through "Surface
  Container Highest"). TUX paper-grain surfaces use light shadows
  + maroon signature rules; we don't translate elevation into
  color.
- **Material's full atom catalog.** Buttons / Inputs / Switches /
  Sliders — all covered by Nuxt UI 4 (Reka) primitives already.
- **FAB as a default Android pattern.** TUX-on-Android, if it
  ships, may include an opt-in `TuxFAB` for compose-new actions,
  but it's not on the roadmap.

## Absorb

1. **Bottom-nav geometry.** Material 3 nav-bar is ~80px tall on
   mobile, 3-5 destinations, icon (24×24) + label (12pt). When
   `TuxTabBar` ships, this is one of two source references
   (iOS being the other). See
   [`50-mobile-bottom-navigation-bar`](../50-mobile-bottom-navigation-bar/NOTES.md)
   for the canonical merged spec.

2. **Material motion tokens.** Material 3 has named motion durations
   (Short 1-4 / Medium 1-4 / Long 1-4) and easings. TUX has
   `--motion-duration-fast / --motion-duration-slow` tokens; we
   stay simpler. **Reaffirm:** don't expand TUX's motion token
   surface to match Material's 12-tier system.

3. **Ripple effect.** Material's tap-feedback affordance. For
   Tauri-on-Android, an opt-in `useTuxRipple` composable could
   layer this on `TuxButton` when `useTuxPlatform().os ===
   "android"`. Defer until consumer pull.

4. **Status-bar dark/light icons.** Android exposes a setting for
   status-bar icon tint. Tauri's Android target handles this via
   config; no Vue work. Captured here as a "remember the knob
   exists" note.

## Tension

- **Material 3 is well-executed and widely understood.** Adopting
  some of its idioms (bottom nav, ripple) on Android targets is
  fine — these are Android-platform conventions. Adopting its
  visual language (tonal palette, elevation-as-color) would
  override TUX brand. Hold the line on visual; accept the
  platform conventions.
- **"Use Material on Android for native feel."** A real argument,
  but only for chrome / nav / surface-level conventions. Charts,
  cards, callouts, and dashboard tiles stay TUX paper-grain.

## Decisions

- **No new components today.** Defer `TuxTabBar`, `TuxFAB`,
  `useTuxRipple` until Tauri-Android becomes real.
- **Reject tonal palette adoption.** Maroon brand stays.
- **Reject elevation-as-color.** Paper-grain stays.
- **Accept bottom-nav as the Android nav idiom** when the time
  comes; `TuxTabBar` will be shared with iOS.
- **Move file from skip → medium** in priority sets.

## Open follow-ups

- When Tauri-Android ships, `TuxTabBar` geometry from
  `55141:14251` (Navigation). `TuxFAB` from `55141:14168`
  (Buttons → FAB variant).
- If a "ripple feedback on Android" need surfaces, build
  `useTuxRipple` as an opt-in composable; do not enable
  globally.
