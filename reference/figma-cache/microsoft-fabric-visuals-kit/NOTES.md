# Microsoft Fabric visuals kit (Community)

**Source:** Figma file `wuWkA8zJtuhWycSbLBiAAD`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium → skip
**Status:** absorbed — no new components

![cover](./cover.png)

## What it is

Despite the name suggesting "data visualizations" (like the Charts
UI Kit), this file is the **iconography + illustration library** for
Microsoft Fabric. The cover even shows the same 3D-rendered glassy
capsule visuals as the Fabric UI kit cover.

Two real content pages:
- **Iconography** (4 frames in Guidance + 1 frame in Libraries) —
  Fabric's icon style + grid + sizing rules.
- **Illustration** (48 frames in Guidance + 9 in Libraries) — the
  rendered-3D capsule library used across Fabric's onboarding /
  empty states / hero panels.

## Pages (11)

- `0:1` — Cover _(skip)_
- `70:12723` — Get started _(4 frames — kit docs, skip)_
- `1399:1162` — Changelog _(skip)_
- `698:63997` — GUIDANCE _(header, skip)_
- `1:13566` — **Iconography (Guidance)** _(4 frames — style + grid +
  sizing + DO/DON'T)_
- `33:42342` — **Illustration (Guidance)** _(48 frames — usage
  examples across surfaces)_
- `1:5` — LIBRARIES _(header, skip)_
- `52:2527` — Iconography (Library) _(1 frame — atom catalog)_
- `698:64140` — Illustration (Library) _(9 frames — illustration
  asset variants)_

## Skip

- **Iconography wholesale.** TUX uses **Heroicons via Iconify**
  through `@nuxt/icon`. Switching icon families is a one-decision
  consideration we don't reopen on a Figma reference. Heroicons +
  Lucide are the two fallbacks; Fabric's icon style (slightly
  rounded outline + filled-variant set) is not adopted.
- **Illustration library.** Fabric's 3D-rendered glassy capsules
  are striking but **categorically incompatible** with TUX's
  editorial-research character. We have a documented
  "no decorative illustrations" stance from the Empty State
  Illustration Kit absorption. This file reinforces, not
  challenges, that stance.
- **Guidance pages.** Useful inside Microsoft; not portable to TUX.

## Absorb

1. **Reaffirmation of "no decorative illustrations."** Fabric's
   library is well-executed, well-documented, and well-themed for
   their product. Even given how polished it is, **it's still wrong
   for TUX**. Our visual-language anchors are:
   - Real photography (research subjects, TTI assets, corridor
     scenes) via `TuxBrandPhoto` family.
   - Editorial chrome: eyebrow / display-face title / signature
     rule / source citation.
   - Restrained color: maroon-led, paper-grain surfaces.

   The stance holds. Document this reaffirmation in NOTES only;
   no change to `design/components.md` needed (the stance is
   already there from Empty State Illustration Kit).

2. **One small icon-grid lesson.** Fabric's icon page documents a
   **24×24 base grid with 1.5px stroke**; TUX uses Heroicons'
   **24×24 outline + 20×20 mini + 16×16 micro** stack. Both kits
   converge on 24×24 as the canonical mid-size. Reaffirms our
   existing icon-size scale in `design/tokens.json`
   (`icon-size.sm/md/lg = 16/20/24`). No change.

## Tension

- **Polish envy.** Their illustration library is great. Resist —
  great illustrations for a different product are still wrong for
  TUX. Our identity is photography + editorial, not 3D-rendered
  metaphors.
- **The temptation to "support Fluent icons too."** No — one icon
  family is the right number. Adding a second pulls maintenance
  surface for zero consumer pull.

## Decisions

- **No new components.** This file is reference, not source.
- **No icon-family change.** Heroicons stays.
- **No illustration library.** "No decorative illustrations"
  stance reaffirmed.
- **Downgrade priority** to skip on next INDEX rebuild — visual-
  assets file with no TUX-compatible payload.

## Open follow-ups

- None. This file's audit is closed.
