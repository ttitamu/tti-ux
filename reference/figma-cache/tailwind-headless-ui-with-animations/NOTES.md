# Tailwind Headless UI with Animations (Community)

**Source:** Figma file `I72wYjh4YigkUgbbVCaY4B`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22 (platform-aware lens)
**Priority:** medium (re-bucketed from skip)
**Status:** absorbed — no new components; motion-primitive reference

![cover](./cover.png)

> Grounded by [`design/platform-awareness.md`](../../design/platform-awareness.md).
> A community Figma file showing Headless UI components (Tailwind's
> unstyled primitives) with **animation prototypes** added in
> Figma's prototype mode. Useful for motion-primitive vocabulary.

## What it is

The "UNOFFICIAL" community kit for Tailwind Labs' **Headless UI**
library, expanded with **Figma prototype animations** showing how
each component transitions: tabs / options menus / toggles / popovers /
modals / accordions. Demonstrates the canonical "enter / leave"
transition patterns the React Headless UI library exposes.

## Pages (5)

- `0:1` — Cover _(1 frame)_
- `1:2` — separator _(skip)_
- `1:3` — **Prototype** _(12 frames — animated states of the
  components)_
- `1:4` — separator _(skip)_
- `1:5` — **Components** _(8 frames — static states for reference)_

## The motion-primitive vocabulary

The file confirms 6 canonical enter/leave transition patterns,
all of which TUX surfaces should use consistently:

| Component class | Enter | Leave | Duration |
|---|---|---|---|
| **Tooltip / Popover** | fade + scale 0.95 → 1 | fade + scale 1 → 0.95 | fast (~150ms) |
| **Dropdown menu** | slide-down (-8px → 0) + fade | reverse | fast (~150ms) |
| **Modal / Dialog** | fade + scale 0.95 → 1 (or sheet slide on Mac) | reverse | normal (~200ms) |
| **Slideover / Drawer** | slide-from-edge | reverse | normal (~250ms) |
| **Toast / Notification** | slide-from-top (or bottom) + fade | fade-out | normal (~200ms) |
| **Accordion / Disclosure** | height auto + fade | reverse | fast (~150ms) |

## Pattern → TUX mapping

TUX components today use Nuxt UI 4's built-in transitions, which
align closely with these primitives (Reka UI primitives are
shape-compatible with Headless UI's React equivalents). No work
needed — but capturing the vocabulary makes future contributors
write consistent motion.

**Existing TUX motion tokens** (from tokens.json):
- `--motion-duration-fast: 150ms`
- `--motion-duration-base: 200ms`
- `--motion-duration-slow: 300ms`
- Easings: standard / decelerate / accelerate

The 6 transition patterns above map cleanly onto these tokens.

## Skip

- **Adopting a full motion-token system** like Material 3's
  12-tier scale. TUX's 3-tier (`fast / base / slow`) covers the
  patterns; adding more would tempt over-motion.
- **Adopting Headless UI as a library.** TUX is on Reka UI (via
  Nuxt UI 4), which is the same shape primitive set with
  different framework bindings. No need to migrate.
- **Animated examples that ignore `prefers-reduced-motion`.** TUX
  policy: every transition collapses to instant on `reduce`.

## Absorb

1. **The 6-primitive vocabulary above.** Document in
   `design/components.md` Conventions section: "Motion
   primitives — which transition to use." A short table makes
   future contributors consistent.

2. **`prefers-reduced-motion` is non-negotiable.** Already TUX
   policy; the file's prototype animations remind us to verify
   every TUX component honors the preference. Audit candidate:
   sweep `TuxModal`, `TuxSlideover`, `TuxStatusToast`,
   `TuxBranchNav` for `@media (prefers-reduced-motion: reduce)`
   coverage.

3. **No need for a `TuxTransition` wrapper.** Reka/Nuxt UI's
   transition props (`<UModal>`, `<UPopover>`, `<USlideover>`)
   already implement the primitives. Wrapping them earns
   nothing.

## Tension

- **"Motion makes UI feel premium" temptation.** True in
  consumer-SaaS contexts; less true for research-publishing
  surfaces where the data is the focus. TUX's restraint —
  fast transitions only, reduced-motion respected — is the right
  posture. Hold the line on minimal motion.
- **Designers asking for richer micro-interactions.** Fine in
  isolated cases (`TuxArtifact` reveal, `TuxSparkline` line
  draw), but the **default** for every TUX component is "fade
  + minor scale, fast, reduced-motion-aware."

## Decisions

- **No new components.** No `TuxTransition` wrapper needed.
- **Document the 6 motion primitives** in `design/components.md`
  Conventions section as a "which transition do I use" reference.
  Defer until the next docs-pass.
- **Audit candidate** (future): sweep TUX components for
  `prefers-reduced-motion` coverage. Don't block this round.
- **Move file from skip → medium** in priority sets.

## Open follow-ups

- Add "Motion primitives" subsection to `design/components.md`
  Conventions on the next docs-pass.
- Run a sweep for `@media (prefers-reduced-motion: reduce)`
  coverage across TUX components. Defer.
