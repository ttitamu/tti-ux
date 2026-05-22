# TailwindCSS v4.2.4 Design System (Community)

**Source:** Figma file `h5ZkgyIFWVzFWRrvxPXCG1`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 — pre-absorbed via tokens + @theme
**Priority:** high (reference-only — system already adopted)
**Status:** absorbed — no new components; system fully integrated

![cover](./cover.png)

## What it is

The Tailwind Labs official Tailwind CSS v4.2.4 design-system Figma
file. A single page with 14 frames covering the v4 token system —
spacing scale, color palette, typography ramp, breakpoints,
shadows, transitions, and the `@theme` syntax for declaring custom
tokens.

## Pages (1)

- `0:1` — **Design System** _(14 frames: spacing / color / type /
  breakpoints / shadows / transitions / @theme syntax)_

## Pre-absorbed status

Unlike most Figma absorptions where we walk the file and extract
patterns into TUX, **this design system is already the substrate
TUX is built on**. Adopting it would be a no-op:

- **TUX runs Tailwind v4** (see [`nuxt.config.ts`](../../nuxt.config.ts)).
- **Tokens live in [`app/assets/css/tokens.css`](../../app/assets/css/tokens.css)**
  and Style-Dictionary'd from [`design/tokens.json`](../../design/tokens.json).
- **`@theme` block in [`globals.css`](../../app/assets/css/globals.css)**
  exposes the maroon-led palette + surface + text tokens as
  Tailwind utility classes.
- **Breakpoint ladder** (`sm: 640 / md: 768 / lg: 1024 / xl: 1280 /
  2xl: 1536`) is the Tailwind v4 default; documented in
  [`app/pages/accessibility/breakpoints.vue`](../../app/pages/accessibility/breakpoints.vue).
- **Spacing scale** — Tailwind v4's `rem`-based scale is the
  spacing primitive everywhere; no overrides.
- **Type ramp** — TUX uses Tailwind's type-scale defaults plus brand
  fonts (Maroon Sans + Inter) declared as `--font-brand` /
  `--font-sans`.

## Pattern → TUX integration

Every concept in the Figma file is already wired:

| Tailwind v4 concept | TUX surface |
|---|---|
| Spacing scale | Tailwind utilities + a few semantic aliases (`--space-section`, `--space-rhythm`) in `tokens.css` |
| Color palette | TUX maroon-led palette via `tokens.css` + `@theme` re-export |
| Type ramp | Tailwind defaults + `--font-brand` (Maroon Sans) / `--font-mono` overrides |
| Breakpoints | Default Tailwind v4 ladder; documented in `accessibility/breakpoints.vue` |
| Shadows | TUX shadow tokens (`--shadow-focus`, `--shadow-popover`, etc.) layered on top |
| Transitions | TUX motion tokens (`--motion-duration-fast/base/slow`) layered on top |
| @theme syntax | Used in `globals.css` to expose every TUX color/surface/text/font token as a utility class |

## Skip

- **Re-walking the 14 frames.** Every concept is already in TUX
  code. The Figma file is reference; TUX's `tokens.css` +
  `globals.css` + `tokens.json` are the source of truth.
- **Adopting any of Tailwind v4's *default* color palettes**
  (slate, gray, zinc, neutral, stone, red, orange, ...). TUX has
  its own maroon-led palette via `tokens.css`; the Tailwind
  default colors aren't exposed as utility classes in this repo.

## Absorb

- **Nothing to absorb.** The system is integrated. This file's
  audit closes with "yes, we already do all of this."

## Tension

- **Tailwind v4 vs Nuxt UI 4 tree-shaking.** Documented in the
  comment at the top of [`globals.css`](../../app/assets/css/globals.css):
  Tailwind v4 tree-shakes `@theme` entries that aren't referenced
  in source CSS/templates. Nuxt UI references them via pre-
  compiled CSS, so we keep palette vars in `tokens.css` as plain
  `:root` vars (not `@theme`) to prevent tree-shaking. This is
  the only "shape mismatch" between Tailwind v4 and our use of it.

## Decisions

- **No code changes.** System is fully adopted.
- **No new doctrine.** Existing `tokens.json` + `tokens.css` +
  `globals.css` patterns are the canonical reference.
- **Promote priority to high+reference** mentally — but keep the
  INDEX bucket as high. This file represents foundational
  validation, not a deferred absorption.

## Open follow-ups

- If Tailwind v5 ships in the future, re-walk this file to spot
  divergences that would need TUX-side updates. No-op until then.
