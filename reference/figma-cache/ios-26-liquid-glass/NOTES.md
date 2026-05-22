# iOS 26 Liquid Glass (Community)

**Source:** Figma file `hyEON2VLGEZ5nRsdJTk0zJ`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 (platform-aware lens)
**Priority:** medium (re-bucketed from skip)
**Status:** absorbed — 0 new components; concise material study

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> A focused single-page study of the Liquid Glass material itself,
> not a whole iOS kit (see `ios-and-ipados-26/` for the full system).

## What it is

A single-page deep-dive on Apple's **Liquid Glass material**, the
hero visual language Apple introduced across iOS 26 / iPadOS 26 /
macOS 26 (Tahoe). The cover is just a Yosemite landscape with two
glass-pill buttons floating over it ("Continue" + "Skip"),
demonstrating the refractive material.

Two frames total. The whole file is "what does Liquid Glass look
like, exactly," not a system catalog.

## Pages (1)

- `0:1` — **Liquid Glass Recreated** _(2 frames — the material at
  two backdrop scenes)_

## What Liquid Glass is, technically

- A translucent backdrop with **frosted blur** + **refractive
  distortion** at the edges (like a glass lens warping the
  background).
- Rounded "pill" shape for buttons; the material tints subtly
  toward the dominant color of what's behind it.
- A subtle inner highlight along the top edge (specular
  reflection).
- A subtle outer shadow when sitting on a surface.

CSS approximation:
```css
.tux-liquid-glass {
  background: color-mix(in srgb, var(--surface-1) 65%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid color-mix(in srgb, white 12%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, white 6%, transparent) inset, /* top highlight */
    0 8px 24px rgb(0 0 0 / 0.15);
}
```

## Skip

- **Adoption as a TUX-wide material.** Apple's identity, not
  TTI's. TUX surfaces stay **paper-grain**: matte, opaque,
  noise-textured paper with the maroon signature rule as the
  visual anchor.
- **Mimicking refractive distortion** in CSS. The edge-warp effect
  requires SVG filters with displacement maps — expensive to render,
  hard to make accessible, and visually a *signature* Apple
  treatment. Don't.

## Absorb

1. **Constrained-use of glass-style backdrops.** As documented in
   `design/platform-awareness.md` and the `macos-26/NOTES.md`
   absorption, we allow a glass-like backdrop on:
   - `TuxAppFrame` titlebar strip on `[data-platform="mac"]`
     (optional, off by default)
   - `TuxPopover` / `TuxTooltip` backdrop on `[data-platform="mac"]`
     (optional, off by default)

   Nowhere else. Cards, alerts, dashboard tiles, chart frames — all
   stay paper.

2. **The CSS recipe above is the canonical TUX implementation.**
   When `TuxAppFrame` ships and exposes a `glass` prop on its
   titlebar slot, that's the class it applies. Reduced motion +
   contrast accessibility: the backdrop-filter blur falls back to
   a flat tint on `prefers-reduced-transparency: reduce`.

3. **Reduced-transparency fallback.** macOS users can disable
   transparency system-wide (Accessibility → Display → Reduce
   transparency). CSS exposes this:
   ```css
   @media (prefers-reduced-transparency: reduce) {
     .tux-liquid-glass {
       background: var(--surface-2);
       backdrop-filter: none;
     }
   }
   ```
   Required for any glass use.

## Tension

- **"It looks great, let's use it everywhere."** This is the
  trap. Liquid Glass on iOS popovers + macOS sidebars + Windows
  Mica strips creates a unified "modern OS chrome" feel — but it
  would erase TUX's editorial-research character, which depends on
  matte paper as the visual anchor. Hold the line.
- **The Apple-style "pill" button shape.** Liquid Glass pills are
  highly rounded (full pill, not 8px corners). TUX buttons use
  `--radius-md` (~8px). Don't change button radius to mimic
  Apple's pills; that's chrome creep into brand.

## Decisions

- **No new components.**
- **`.tux-liquid-glass` utility class** is reserved for future use
  in `TuxAppFrame` + `TuxPopover` on Mac only. Spec captured here;
  implementation deferred.
- **Required accessibility fallback:** `prefers-reduced-transparency`
  collapses to flat surface. Document on every glass-using component.

## Open follow-ups

- When `TuxAppFrame` ships its `glass` prop, lift the CSS recipe
  from §1 above. Reference this file as the source.
- Add a row to `design/components.md` under "Conventions" for
  "When to use Liquid Glass material" — capture the constrained-
  use stance so it's not re-litigated.
