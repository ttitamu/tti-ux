# Windows UI kit (Community)

**Source:** Figma file `gngcSNotsStVdOdZD9zff5`
**Captured:** 2026-05-19
**First absorbed:** 2026-05-19 (breakpoint ladder only)
**Re-absorbed:** 2026-05-22 (platform-aware lens for Tauri target)
**Priority:** medium (re-bucketed from skip)
**Status:** absorbed — 0 new components; doctrine inputs for Tauri-on-Win11

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> Captures what changes for **TUX shipped via Tauri on Windows 11
> 25H2**, not what we'd build on top of TUX's brand layer.

## What it is

The "Windows UI Kit Core" Figma file — Microsoft's reference for
Windows 11's design language. 21 pages span shell chrome, every
basic control, and primitive type/color tokens. The previous
absorption (2026-05-19) lifted only the breakpoint ladder; this
pass reads it as a **host-OS reference** for Tauri.

## Pages (21)

Selected highlights with the new lens:

- `32021:96` — **Shell** _(7 frames — Win11 app frame, titlebar, snap
  layouts, the things Tauri needs to mimic)_
- `165332:67172` — **Guidance & Charts** _(15 frames — breakpoint
  ladder, color, type)_
- `72491:280393` — Lists & collections _(9 frames — Fluent's list
  shapes; covered by TuxRichDataGrid)_
- `72491:280391` — Basic input _(32 frames — atoms; covered by
  Fluent 2 Web absorption)_
- `72491:280398` — **Menus & toolbars** _(5 frames — menu bar
  pattern for in-window display)_
- `72491:280399` — Navigation _(4 frames — sidebar nav)_
- `72491:280396` — **Scrolling** _(4 frames — Win11 scrollbar style)_
- `72491:280394` — Dialogs & flyouts _(3 frames — modal patterns)_
- `72491:280402` — Splash screen _(1 frame — app-launch pattern)_
- `72491:280397` — Status & info _(4 frames — Fluent alerts, badges)_

## Pattern → TUX-on-Tauri-Win mapping

| Win11 surface | TUX-on-Tauri-Win behavior | Implementation hook |
|---|---|---|
| Min / max / close (top-right) | Render right-aligned in `TuxAppFrame` | `useTuxPlatform().os === "win"` |
| **Snap-layouts** (maximize hover) | Tauri-Win exposes this natively; pass-through. The maximize button shows the snap-grid popover after 600ms hover | Tauri's `set_decorations(false)` + handle WM_NCHITTEST is needed — Rust side |
| Titlebar height | ~32px (Win11 default) | `--titlebar-height: 32px` token on `[data-platform="win"]` |
| **Mica / Acrylic backdrop** | TUX is paper-grain; **don't adopt Mica wholesale**. Optional: Mica on the titlebar strip only, paper-grain inside | Tauri's `effect: "mica"` on window config; CSS keeps surfaces opaque |
| Persistent slim scrollbar (~12px) | Apply via `[data-platform="win"] ::-webkit-scrollbar { width: 12px; ... }` | Future `tux-scrollbar` utility |
| **Segoe UI Variable Display** | `--font-system: "Segoe UI Variable Display", "Segoe UI", system-ui` on `[data-platform="win"]` | tokens.css |
| Ctrl modifier | `TuxKbd` uses `Ctrl` (already correct on PC path) | No change |
| In-window menu bar | `TuxMenuBar` rendered under titlebar; Tauri Rust menus skip Win in favor of in-window | Future component |
| Splash screen | Tauri config + a `TuxSplashScreen` showing brand mark + maroon hairline | Future component |
| Focus rings on inputs | Use system accent color when available; fall back to maroon | `--focus-ring-system` CSS var |

## Skip

- **Mica / Acrylic as a TUX-wide material.** Translucent backdrops
  conflict with TUX paper-grain surfaces. We allow it **only on the
  titlebar strip** as a "feel native in the chrome" affordance.
- **Fluent's full type ramp.** TUX has its own brand type stack
  (Maroon Sans + Inter). System font is a chrome-only fallback.
- **Win11 color palette wholesale.** TUX palette is maroon-led; the
  Win11 accent applies only to chrome controls (titlebar buttons,
  input focus rings).
- **Splash screen as a full TUX component today.** Most TTI
  consumers will run in a browser; splash is Tauri-only.
- **The Lists & collections page in detail.** Covered by Fluent 2
  Web and our TuxRichDataGrid + TuxDataTable family.

## Absorb

1. **Titlebar geometry for `TuxAppFrame`.** Win11's titlebar is
   ~32px tall, controls 46×32px each, drag region is the strip
   minus the controls minus an optional logo+title slot on the
   left. Snap-layout popover hovers 600ms after the maximize
   button — that's a Tauri Rust-side hook, not Vue.

2. **Scrollbar spec for `tux-scrollbar` utility.**
   - Track: transparent
   - Thumb: ~8px wide; `var(--surface-3)` at rest, `var(--surface-4)` on hover
   - Always visible (no auto-hide on Win)
   - Total scrollbar gutter: ~12px

3. **In-window menu bar (`TuxMenuBar`) sizing.**
   - Height: ~28px
   - Padding: 8px horizontal
   - Hover: subtle bg tint, no border
   - Click opens dropdown menu (Fluent flyout shape) using existing
     `UDropdownMenu`

4. **System-accent → focus-ring binding.** Win11 exposes the user's
   accent color via Tauri APIs (and via `accent-color` CSS in modern
   browsers). TUX's brand maroon stays for charts/CTAs; chrome
   focus rings (in `TuxAppFrame` controls only) light up with the
   system accent.

## Tension

- **Mica vs paper.** Mica is Microsoft's signature material — a
  noise-textured translucent layer that picks up the wallpaper.
  Adopting it wholesale would make TUX-on-Win look like a Win11
  app and lose its TTI editorial identity. Constraining Mica to
  the titlebar only is the compromise.
- **Snap-layouts vs custom titlebar.** Win11 expects the OS to
  draw the maximize button so snap-layouts appear on hover. If
  we render a fake titlebar (which we have to, to host TUX
  branding), we need to forward the right native messages so
  snap-layouts still work. Tauri 2.x has a way; spec it on
  `TuxAppFrame` build.

## Decisions

- **No new components today.** All Win11 chrome behavior is
  deferred to the platform-awareness roadmap:
  `TuxAppFrame`, `TuxMenuBar`, `tux-scrollbar`, `TuxSplashScreen`.
- **No Mica adoption beyond the titlebar.** Document this stance
  in the future `TuxAppFrame` JSDoc when it ships.
- **Move file from skip → medium** in the priority sets (it earned
  this on re-read).
- **Promote breakpoint-ladder absorption** into the doctrine doc
  (already done in `platform-awareness.md`).

## Open follow-ups

- When `TuxAppFrame` ships, the Win11 reference page is
  `32021:96` (Shell). Recreate the geometry there.
- When `tux-scrollbar` ships, anchor the spec in §3 above and
  cross-reference [`scrollbar-kit-macos-windows`](../scrollbar-kit-macos-windows/NOTES.md).
- **Tauri Rust hook:** snap-layouts require WM_NCHITTEST forwarding
  when `decorations: false`. Document in a future
  `design/tauri-bindings.md`.
