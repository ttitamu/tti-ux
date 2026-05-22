# Platform awareness

> **Status:** doctrine (2026-05-22). Captures the multi-platform
> strategy that grounds the Tauri-targeted absorption sweep
> (Apple suite, Material 3, Android, scrollbar kit, layout grids).
> Components that ship platform-aware behavior reference this doc.

TUX is a **single component tree** that adapts at the **chrome
layer** to the host operating system. We don't fork the codebase
per OS. We don't compile to native widgets. We compile **once to
Vue 3 + Web Components inside a Tauri WebView**, and let a thin
platform-detection layer adjust the parts of the UI that are
genuinely OS-bound (window chrome, scrollbar, modifier-key labels,
system fonts, native menu bar, accent color).

## The "two layers" mental model

Every TUX surface decomposes into two layers:

1. **Brand layer — invariant across platforms.**
   Maroon-led palette, paper-grain surfaces, editorial chrome
   (eyebrow / display-face title / signature rule / source line),
   real photography, restrained motion, Heroicons. This is TTI's
   identity and **never changes** with the host OS. A Landscape
   chart looks like TTI on Windows, macOS, and Linux.

2. **Chrome layer — adapts to the host.**
   Window-frame controls, scrollbar rendering, modifier-key
   symbols, system font fallback, drag regions, native menu bar,
   accent-color tints, share-sheet invocation, notification API,
   file-dialog style. This is what makes the app **feel native
   in its window**.

The split is on purpose: TUX's editorial-research identity is what
TTI is selling; OS-feel is what makes the user not flinch when the
window opens. Keep them separated.

## Target host matrix

| Host | TUX runtime | Chrome notes |
|---|---|---|
| **Web (Nuxt SSR + hydration)** | Native Vue/Nuxt | Browser-default scrollbar; no window chrome; ⌘/Ctrl auto-detect via navigator.platform; system fonts via `-apple-system, "Segoe UI Variable", system-ui` cascade |
| **Tauri on macOS 26 (Liquid Glass)** | Vue/Nuxt inside WKWebView | Traffic-light controls top-left; titlebar drag region; overlay scrollbar; San Francisco font; sheet-style modals; native menu bar at top of screen; accent color from system; ⌘ modifier |
| **Tauri on Windows 11 25H2** | Vue/Nuxt inside WebView2 | Min/max/close top-right with snap-layout hover; titlebar drag region; persistent slim scrollbar; Segoe UI Variable font; in-window menu bar; Mica-backdrop materials available; Ctrl modifier |
| **Tauri on Linux (Ubuntu 24/26, Fedora, etc.)** | Vue/Nuxt inside WebKitGTK | Depends on DE — GNOME server-side decorations on right, KDE on right, others vary; Adwaita or Breeze scrollbar; Inter / Ubuntu Sans / system-ui; in-window menu bar or global (GNOME); Ctrl modifier; Super available |
| **Tauri Mobile on iOS** _(future)_ | Vue/Nuxt inside WKWebView | No window chrome; safe-area-inset for notch/home-indicator; bottom-sheet idiom; iOS share sheet; system font stack |
| **Tauri Mobile on Android** _(future)_ | Vue/Nuxt inside WebView | Status-bar + nav-bar safe areas; bottom-nav / bottom-sheet idiom; Material gestures; Roboto / system font |

## Dimensions of variation

Eight things change per platform. Everything else stays TUX-brand.

### 1. Window chrome (titlebar + traffic lights)

- **macOS 26**: traffic-light controls (close / minimize / zoom) at
  **top-left**; titlebar is a 28px drag region; Liquid Glass tint
  can frost the titlebar.
- **Windows 11 25H2**: minimize / maximize / close at **top-right**;
  maximize hover reveals snap-layout grid (hover for 600ms);
  titlebar drag region is the whole top strip excluding controls.
- **Linux (GNOME)**: close button at top-right (server-side
  decorations); no traffic lights; titlebar may show app name.
- **Linux (KDE / others)**: vary; respect the DE's CSD/SSD choice.

**Implementation hook:** future `<TuxAppFrame>` wrapper composes
a fake titlebar (Tauri runs with `decorations: false`) and renders
the right buttons at the right place per platform. Reads
`useTuxPlatform().os`.

### 2. Scrollbar style

- **macOS**: overlay scrollbar (auto-hides); thin track; appears on
  hover/scroll.
- **Windows 11**: persistent thin scrollbar; **always visible**;
  ~12px wide.
- **Linux**: depends on GTK/Qt theme — Adwaita is thin overlay
  similar to macOS; Breeze is persistent like Windows.

**Implementation hook:** future `tux-scrollbar` utility class
applies `::-webkit-scrollbar` styles conditional on
`html[data-platform="mac"]` / `data-platform="win"` /
`data-platform="linux"`. Doctrine: don't fight the host; if the
user expects scrollbar-on-hover on macOS, give them that.

### 3. Modifier-key labels

- **Apple**: ⌘ (cmd), ⌥ (option), ⌃ (control), ⇧ (shift).
- **Windows / Linux**: Ctrl, Alt, Shift, Win/Super.

**Implementation hook:** `TuxKbd` already does this for Mac vs PC
post-hydration. Extend to map "super" → "Win" on Windows and
"Super" on Linux when the OS is known.

### 4. System font fallback

The TUX font stack today is brand-led (Maroon Sans + Inter / system).
For native-feel touches inside chrome surfaces (titlebar text, menu
items, system dialogs), the host font should win:

- **Apple**: `-apple-system, BlinkMacSystemFont, "SF Pro"`.
- **Windows 11**: `"Segoe UI Variable Display", "Segoe UI"`.
- **Linux**: `Inter, "Ubuntu Sans", system-ui` (Inter is already in
  TUX, so the cross-Linux variation is small).

**Implementation hook:** a `--font-system` token resolves to the
right cascade per host. Brand surfaces (TuxPageHeader,
TuxChartFrame display-face titles) keep `--font-brand`; chrome
surfaces use `--font-system`.

### 5. Drag regions

Tauri custom titlebars need explicit `data-tauri-drag-region`
markers on the titlebar element. Buttons inside (traffic lights,
min/max/close) need explicit `data-tauri-drag-region="false"` to
remain clickable. `TuxAppFrame` will handle this; consumers don't.

### 6. Menu bar (native vs in-window)

- **macOS**: menu bar is at the **top of the screen** (system-wide
  strip); Tauri populates it via the Rust side.
- **Windows / Linux**: menu bar lives **inside the window**, either
  in the titlebar (modern Windows apps) or as a row below it
  (legacy / GNOME).

**Doctrine:** define menus in Tauri Rust config (`tauri.conf.json`
+ Rust menu builder). The Vue layer doesn't render a fake menu bar
— it would conflict with the macOS system menu. For in-window
fallback on Win/Linux when a Tauri menu isn't set up, render a
`TuxMenuBar` component **only** if `platform.os !== "mac"`.

### 7. Accent color + system tints

macOS and Windows 11 both expose a user-chosen accent color via
the OS. TUX's maroon is the brand anchor and **always wins** —
don't recolor TUX charts or CTAs to the system accent.

Where the system accent **can** show through:
- Selection highlight on text inputs (macOS draws this in accent;
  Windows uses the accent for input borders on focus).
- Native-feeling outline focus rings on chrome controls inside
  `TuxAppFrame` (titlebar buttons).
- Nowhere else. The chart palette and CTA buttons stay maroon.

### 8. Share / file / notification APIs

These are Tauri-mediated, not CSS-driven. They affect components
that invoke them:

- `TuxArtifact` "Share" action: uses the OS share sheet on
  Apple/Android, falls back to copy-link on Windows/Linux.
- `TuxCodeBlock` "Download" + Tauri file dialogs.
- `TuxStatusToast` background notifications: prefer Tauri's
  `notification` API on desktop hosts; fall back to in-app toast.

Future doc: `design/tauri-bindings.md` will list which TUX
components call which Tauri APIs. For now, those bindings live in
the consumer app, not in TUX components themselves (TUX stays
runtime-agnostic).

## The detection mechanism: `useTuxPlatform()`

A future composable will surface the host environment to Vue
components:

```ts
// app/composables/useTuxPlatform.ts (not yet shipped)
export interface TuxPlatform {
  /** Coarse OS family for chrome decisions. */
  os: "mac" | "win" | "linux" | "ios" | "android" | "web";
  /** Tauri runtime detected? If false, treat as plain web. */
  tauri: boolean;
  /** Native UI rendering mode the host prefers. */
  prefersOverlayScrollbars: boolean;
  /** ⌘ vs Ctrl primary modifier. */
  primaryModifier: "meta" | "ctrl";
  /** User-set accent color from the OS, if exposed. */
  accentColor?: string;
}

export function useTuxPlatform(): Readonly<TuxPlatform>;
```

**SSR safety:** detection runs **post-hydration only** (same
trade-off `TuxKbd` already makes). Server renders a neutral
default (`os: "web"`, `tauri: false`, `primaryModifier: "ctrl"`),
client swaps after mount. Components that need pre-render
platform-correctness (rare) should accept the default and update
in-place.

**Tauri detection:** `window.__TAURI_INTERNALS__` or the
`@tauri-apps/api/os` import. Plain web sets `tauri: false` and OS
falls back to `navigator.userAgent` parsing.

**Body attribute:** the composable sets
`document.documentElement.dataset.platform = os` after mount, so
**CSS can branch** without each component asking JS:

```css
:root[data-platform="mac"] ::-webkit-scrollbar { /* overlay */ }
:root[data-platform="win"] ::-webkit-scrollbar { /* persistent */ }
```

## What we don't do

- **Don't fork the codebase per OS.** One component tree, branched
  at the chrome layer. The component author writes one Vue file.

- **Don't compile to platform-native widgets.** No SwiftUI / WinUI /
  Compose targets. Tauri's WebView is our native runtime; we don't
  re-implement components in three other frameworks.

- **Don't adopt the host's visual language wholesale.** macOS 26's
  Liquid Glass is striking but **conflicts with TUX paper grain
  + maroon signature rule**. We absorb Liquid Glass for the
  *interaction patterns* (drag, traffic lights, sheet animations)
  — not the translucent material itself.

  Same for Material 3's elevation-as-color, dynamic theming from
  wallpaper, and Fluent's Mica/Acrylic. We're not transparent. The
  TUX surface is paper.

- **Don't render a fake macOS menu bar at the top of a Vue app.**
  macOS users expect the system menu strip. Render menus in Tauri
  Rust config; on Win/Linux, optionally render `TuxMenuBar`
  in-window.

- **Don't gate functionality on Tauri.** Every TUX component must
  work in plain web (Nuxt SSR + browser). Tauri-only enhancements
  (share sheet, native notification, file dialog) are progressive
  enrichments — the fallback path is always plain HTML.

## What we will ship (roadmap, deferred to consumer pull)

In rough dependency order. Each item ships when a consumer app
actually needs it — not pre-emptively.

1. **`useTuxPlatform()` composable** — the detection layer. Lands
   first since every other piece depends on it.

2. **`TuxAppFrame`** — Tauri custom-titlebar wrapper. Renders
   traffic lights left on Mac, min/max/close right on Win, follows
   DE on Linux. Accepts `#left`, `#center` (title), `#right`
   slots. Sets drag regions. Owns the platform-specific window
   chrome.

3. **`tux-scrollbar` utility + tokens** — `::-webkit-scrollbar`
   styles per platform. Doctrine: respect host expectations.

4. **`TuxKbd` extension** — map "super" key, "win" key on
   Windows / Linux. Today Mac/PC only.

5. **`TuxMenuBar`** — in-window menu strip for Win/Linux when
   Tauri Rust menus aren't set up. Skipped on macOS.

6. **Accent-color binding** — let `--accent-system` resolve to the
   OS accent (via Tauri or `accentcolor` CSS media query). Brand
   maroon stays; accent appears in chrome controls only.

7. **`design/tauri-bindings.md`** — companion doc enumerating which
   TUX components call which Tauri APIs and how the web fallback
   works.

## Why not just use Tauri's default decorations

Tauri can run with native window decorations (the OS-drawn
titlebar). That works, but:

- The titlebar height varies by OS (28px Mac, ~32px Win, varies
  Linux) — content layout has to react.
- The titlebar font differs from TUX brand surfaces.
- The titlebar can't host TUX-branded surfaces (eyebrow + display-
  face title + signature rule).
- We can't put context (breadcrumb / search / tab strip) in the
  titlebar when the OS draws it.

For Landscape-class research apps, a **custom titlebar with TUX
brand + platform-correct controls** is the right shape.
`TuxAppFrame` is that wrapper.

## Why not native multi-platform implementations

We considered shipping SwiftUI / WinUI / Compose mirrors of TUX
components — one code path per OS, sharing tokens only. Rejected
because:

- **3× the surface to maintain** for the same TTI brand outcome.
- **Web parity matters more than native parity.** Web is where
  Landscape lives day-to-day; the Tauri shell is a packaging
  detail.
- **WebView fidelity in 2026 is high.** WKWebView (Apple), WebView2
  (Microsoft), and WebKitGTK (Linux) render modern CSS uniformly
  enough that a Vue component looks the same in all three.

The trade-off is accepted: Tauri WebView is the runtime. Native
platform implementations are not on the roadmap.

## References

This doctrine cites and is grounded by these absorbed Figma files:

- [Windows UI kit](../reference/figma-cache/windows-ui-kit/NOTES.md) —
  Win11 25H2 chrome, Segoe UI Variable, snap layouts, Mica.
- [macOS 26](../reference/figma-cache/macos-26/NOTES.md) — Liquid
  Glass, traffic lights, sheet animations, San Francisco font.
- [iOS 26 Liquid Glass](../reference/figma-cache/ios-26-liquid-glass/NOTES.md)
  — refractive materials, depth.
- [iOS and iPadOS 26](../reference/figma-cache/ios-and-ipados-26/NOTES.md) —
  safe areas, bottom sheets, action sheets.
- [Material 3 Design Kit](../reference/figma-cache/material-3-design-kit/NOTES.md) —
  Android gestures, elevation-as-color (rejected), motion tokens.
- [Android UI Kit](../reference/figma-cache/android-ui-kit/NOTES.md) —
  status bar, bottom nav, FAB.
- [Scrollbar Kit MacOS & Windows](../reference/figma-cache/scrollbar-kit-macos-windows/NOTES.md) —
  concrete scrollbar specs per host.
- [Tailwind Headless UI with Animations](../reference/figma-cache/tailwind-headless-ui-with-animations/NOTES.md) —
  motion primitives + reduced-motion fallbacks.
- [UI Prep Layout Grids 8.0](../reference/figma-cache/ui-prep-layout-grids-8-0/NOTES.md) —
  12-col grid reference.
- [visionOS 26](../reference/figma-cache/visionos-26/NOTES.md) —
  out-of-scope; capture depth + parallax patterns for future-proofing.
