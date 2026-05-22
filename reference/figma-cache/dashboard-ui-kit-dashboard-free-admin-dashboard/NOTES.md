# Dashboard UI Kit - Dashboard, Free Admin Dashboard (Community)

**Source:** Figma file `WLILByePF6ZOKKEnD7ERpx`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium → skip (Snow-derivative)
**Status:** absorbed — no new components

![cover](./cover.png)

## What it is

A teaser-page extraction from the **Snow Dashboard UI Kit**
(`tqAV0JlxQFwFALbBYU5S28`) marketing itself as "330+ Screens,
Everything uses variables, Fully Customizable, Reusable Components."
The cover is a hero collage of Snow's main analytics dashboard
plus a sidebar nav strip and the project links ("More pages",
"Made with SnowUI", "See how components work").

Functionally a marketing slide, not a new design system.

## Pages (4)

- `0:1` — Dashboard _(8 frames: same screens as the main Snow kit —
  Default, eCommerce, Projects, Online Courses; cropped previews)_
- `509:2201` — Design system _(skip — Snow's token grid)_
- `401:9440` — Made with SnowUI _(skip — promo)_
- `1:9655` — Cover _(skip)_

## Mapping (delta vs Snow parent)

**Zero new patterns.** Every screen shown is already inventoried in
the parent Snow audit. The "330+ Screens" framing is a count of
permutations (light/dark × density × page), not 330 distinct
patterns.

See the canonical record:
[`../snow-dashboard-ui-kit/NOTES.md`](../snow-dashboard-ui-kit/NOTES.md).

## Skip

- **The whole file.** It's a promo cover for the parent kit.
- **The "Everything uses variables" angle.** TUX is already tokens-
  first via `design/tokens.json` → Style Dictionary → CSS vars.
  No new lesson.

## Absorb

- **None.** This file is duplicative of the parent Snow audit.

## Tension

- **Re-absorbing the same kit twice.** Same risk as the Order list
  file. The Figma project listing accidentally caches three Snow
  surfaces as separate files (`snow-dashboard-ui-kit`,
  `order-list-page`, this one). One audit is enough.

## Decisions

- **No new components.** Same conclusion as the parent Snow audit.
- **Downgrade priority** to skip on next INDEX rebuild. This is
  the third Snow surface and adds nothing new.
- **Cross-reference Snow** as the canonical record.

## Open follow-ups

- After the next INDEX rebuild, both this file and the Order list
  file should sit in the **skip** bucket, not medium. The medium
  bucket should reflect "files that earned their audit"; these are
  duplicates that didn't.
