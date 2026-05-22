# Android UI Kit (Community)

**Source:** Figma file `8lAR3eebfnw9GB57I7sa8q`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 (platform-aware lens)
**Priority:** medium (re-bucketed from skip)
**Status:** absorbed — no new components; supplements Material 3

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> "@AndroidDesign"-authored kit showing Android-native patterns
> grouped by app area (Communication, Core App, Navigation,
> Camera). Supplements Material 3 with real-app composition.

## What it is

An "AndroidDesign"-authored UI kit showing how Material 3 atoms
compose into real Android apps. 8 pages organized by **app
function** (Communication / Core App / Navigation & Settings /
Camera & Media), unlike Material 3's atom-by-atom catalog.

Most useful for **gesture conventions** and **navigation idioms**
that don't show up in the Material 3 atom kit.

## Pages (8)

- `0:1` — **Guide** _(5 frames — meta about the kit + style intro)_
- `1:65` — Styles _(3 frames — type, color)_
- `337:27122` — **Communication** _(7 frames — messaging / chat /
  email patterns)_
- `341:27123` — **Core App** _(2 frames — full-app composition
  references)_
- `337:23462` — **Navigation & Settings** _(4 frames — nav
  drawer + settings screen idioms)_
- `1:6609` — Camera & Media _(1 frame — camera capture UI)_

## Pattern → TUX-on-Tauri-Android mapping (future)

| Android surface | TUX mapping | Source |
|---|---|---|
| **Bottom-nav with 3-5 destinations** | Future `TuxTabBar` | This file + Material 3 + 50-mobile-bottom-nav |
| **Nav drawer** (swipe from left) | `app/layouts/sidebar.vue` adapted for swipe-open on mobile | sidebar.vue mobile mode |
| **Settings screen** with grouped list | `TuxLinkList` grouped variant | Existing TuxLinkList |
| Communication / chat layouts | `TuxChatMessage` + `TuxComposer` | Already shipped |
| **Camera UI** | Out of scope — no TTI surface uses camera | N/A |
| Material gestures (swipe-to-dismiss on list rows) | `useTuxSwipe` opt-in composable, deferred | Future |

## Skip

- **Camera & Media patterns.** No TTI consumer surface uses
  camera capture.
- **Communication patterns wholesale.** TUX already has
  `TuxChatMessage` + `TuxComposer` from the AI-studio absorption;
  Android-specific chat patterns add no signal.
- **Re-implementing Material 3 atoms.** Covered by
  [`material-3-design-kit`](../material-3-design-kit/NOTES.md).

## Absorb

1. **Swipe-to-dismiss on list rows.** Material idiom: swipe a row
   left to reveal a "delete" action. TUX doesn't have this; defer
   to a future `useTuxSwipe` composable when a mobile consumer
   asks. Capture the pattern here.

2. **Nav drawer for sidebar on mobile.** `app/layouts/sidebar.vue`
   today is desktop-first (always-visible left rail). On mobile
   (Tauri-Android or web < md), the rail collapses to a drawer
   that swipes open from the left. Today the sidebar layout
   handles this via `UDashboardSidebar`'s mobile mode; verify
   when Tauri-Android lands.

3. **Settings-screen grouped list pattern.** Settings on Android
   conventionally render as grouped list rows with section
   headings + 1-line description + right-aligned chevron / toggle.
   `TuxLinkList` already does most of this; the optional toggle/
   chevron variant is a slot addition when needed.

## Tension

- **The "Communication" page is rich** (messaging shapes, presence,
  typing indicators) but it's all Material-flavored; TUX already
  ships its own chat surface (`TuxChatMessage` from the AI-studio
  absorption). Don't drift Android-direction.
- **Swipe gestures vs accessibility.** Swipe-to-dismiss is great
  on touch; on keyboard/screen-reader, every swipe action needs a
  visible alternative (a button). When `useTuxSwipe` ships,
  require an a11y-pair button.

## Decisions

- **No new components today.**
- **Defer `useTuxSwipe`** and `TuxTabBar` to Tauri-Android arrival.
- **`sidebar.vue` mobile drawer mode** already exists via
  Nuxt UI 4 — verify on first Android target.
- **Move file from skip → medium** in priority sets.

## Open follow-ups

- When Tauri-Android ships, build `useTuxSwipe` for swipe-to-
  dismiss; require an a11y-pair button (no swipe-only actions).
- Verify `sidebar.vue` mobile drawer mode works on Tauri-Android
  via WebView at first opportunity.
