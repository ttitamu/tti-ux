# Material UI for Figma (and MUI X) (Community)

**Source:** Figma file `okkZzLjRiczR8YfafHjbcX`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** skip
**Status:** absorbed — no new components; framework mismatch

![cover](./cover.png)

> Audited as part of the coverage-gap close (2026-05-22). The
> Figma project listing accidentally cached this kit twice with
> different file keys; the sibling at
> [`../material-ui-for-figma-and-mui-x-1/`](../material-ui-for-figma-and-mui-x-1/NOTES.md)
> is functionally identical. Treat as duplicates.

## What it is

The official **Material UI (MUI) for Figma** library — Google's
Material Design as implemented by the MUI team for React. 70 pages
spanning the full MUI atom catalog plus MUI X advanced data
components (DataGrid, DatePicker, TreeView, etc.).

## Skip

- **MUI is React-only.** TUX is Vue + Nuxt UI 4 (on Reka UI
  primitives) — different framework runtime. Patterns transfer
  conceptually; React-specific composition does not.
- **Material 3 absorption already covered the relevant ground**
  for Android / cross-platform Material-style patterns. See
  [`../material-3-design-kit/NOTES.md`](../material-3-design-kit/NOTES.md)
  for the full pattern table + the rejection rationale for
  tonal-palette / elevation-as-color / dynamic theming.
- **MUI X data components** (DataGrid, TreeView, DatePicker) —
  TUX has `TuxRichDataGrid`, `TuxTree`, and Reka's `UCalendar`
  covering the same surfaces. Shape-equivalent but framework-
  incompatible.
- **The 70-page atom walk** would mostly mirror Material 3 with
  MUI-specific styling tweaks. Re-walking yields 0 net additions.

## Absorb

- **None.** Re-walking 70 pages of React-shaped Material patterns
  would yield 0 net additions.

## Decisions

- **No new components.** Framework + visual-language mismatch.
- **Cross-reference Material 3** for the canonical Material-side
  absorption ([`../material-3-design-kit/NOTES.md`](../material-3-design-kit/NOTES.md)).
- **The duplicate file (`-1` suffix) shares this rationale.**

## Open follow-ups

- None. Audit closed.
