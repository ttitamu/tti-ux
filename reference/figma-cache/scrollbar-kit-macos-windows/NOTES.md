# Scrollbar Kit MacOS & Windows (Community)

**Source:** Figma file `nN7KgiU9gvKaZ9SgnxKKcX`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 (platform-aware lens)
**Priority:** medium (re-bucketed from skip — high practical value)
**Status:** absorbed — no new components; canonical `tux-scrollbar` spec

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> **The highest-leverage file in the platform-aware sweep.** Pure
> reference for macOS vs Windows scrollbar geometry. Direct input
> for the future `tux-scrollbar` utility.

## What it is

A focused 5-page reference comparing **macOS vs Windows scrollbar
styles** side-by-side: track + thumb dimensions, color tokens,
hover states, idle states. Exactly the practical data needed to
implement platform-aware scrollbars in CSS.

## Pages (5)

- `5:3` — Cover _(2 frames — kit intro)_
- `201:1197` — Presentation _(skip)_
- `5:125` — **Elements Overview** _(4 frames — track + thumb specs)_
- `0:1` — **Components** _(4 frames — full scrollbar variants in
  light + dark)_

## Canonical TUX `tux-scrollbar` spec

Distilled from the file:

### macOS (overlay, auto-hide)

```css
:root[data-platform="mac"] *::-webkit-scrollbar {
  width: 0;
  height: 0;
}
:root[data-platform="mac"] *:hover::-webkit-scrollbar,
:root[data-platform="mac"] *:focus-within::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
:root[data-platform="mac"] *::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--text-muted) 35%, transparent);
  border-radius: 4px;
  /* No track; the thumb floats over content. */
}
:root[data-platform="mac"] *::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--text-muted) 55%, transparent);
}
:root[data-platform="mac"] *::-webkit-scrollbar-track {
  background: transparent;
}
```

### Windows 11 (persistent slim)

```css
:root[data-platform="win"] *::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
:root[data-platform="win"] *::-webkit-scrollbar-track {
  background: var(--surface-1);
}
:root[data-platform="win"] *::-webkit-scrollbar-thumb {
  background: var(--surface-3);
  border: 3px solid var(--surface-1); /* creates breathing space */
  border-radius: 6px;
}
:root[data-platform="win"] *::-webkit-scrollbar-thumb:hover {
  background: var(--surface-4);
}
:root[data-platform="win"] *::-webkit-scrollbar-thumb:active {
  background: var(--text-muted);
}
```

### Linux (defer to host theme)

```css
:root[data-platform="linux"] * {
  /* Trust the GTK/Qt theme; do not override. */
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
}
```

### Web fallback (no platform detection)

```css
:root[data-platform="web"] * {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
}
```

## Skip

- **Skeuomorphic scrollbar variants.** The file shows a few
  gradient/3D shapes; not used in modern macOS or Win11.
- **iOS / Android scrollbars.** Mobile scrollbars are
  system-owned; CSS shouldn't touch them. Document this in the
  utility's JSDoc when it ships.

## Absorb

1. **The CSS recipes above.** They become the body of
   `app/assets/css/tux-scrollbar.css`, imported globally in
   `globals.css`. Cost: ~40 lines of CSS for all four platforms.

2. **Container-level opt-out.** Add a `.tux-scrollbar-default`
   class that resets to native scrollbar styling for cases where
   a third-party component (e.g., a deep-rendered embed) breaks
   with custom scrollbars.

3. **`useTuxPlatform()` is the prerequisite.** The CSS branches
   on `[data-platform=*]` set by the composable on
   `document.documentElement`. Both ship together.

4. **`prefers-reduced-transparency` fallback.** macOS users with
   "reduce transparency" enabled get a solid scrollbar instead of
   overlay. Add the media query in the CSS.

## Tension

- **CSS `::-webkit-scrollbar` is non-standard.** Firefox uses
  `scrollbar-width` + `scrollbar-color` (CSS standard). For
  TUX-on-Tauri we only care about WebKit / Chromium engines
  (Mac WKWebView, Win WebView2, Linux WebKitGTK) — `-webkit-`
  prefixed works everywhere. For TUX-on-web (Firefox in the
  browser), the standard properties take over via the Linux/web
  fallback above. Both paths covered.
- **Overriding native scrollbars on Linux is risky.** GTK and Qt
  scrollbars vary by DE; users have strong expectations. Defer
  to the host theme via `scrollbar-width: thin`.

## Decisions

- **No new components.** A pure CSS utility shipping with
  `useTuxPlatform()`.
- **Spec recorded above** — direct copy-paste when implementation
  ships.
- **Linux: defer to host theme.** Don't override.
- **Move file from skip → medium** — practical value is high.

## Open follow-ups

- When `useTuxPlatform()` ships, ship `tux-scrollbar.css`
  alongside. Import in `globals.css` once.
- Document opt-out via `.tux-scrollbar-default` class in JSDoc.
- If a Linux DE-specific issue surfaces, add a `data-de="gnome|kde|..."`
  branch — but only on real consumer complaint.
