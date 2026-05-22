# Interactive Dropdown (Community)

**Source:** Figma file `BBRfDY5aAHIAc9yYag87nJ`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium
**Status:** absorbed — no new components

![cover](./cover.png)

> **Note:** This file and
> [`interactive-dropdown-1/`](../interactive-dropdown-1/NOTES.md) are
> functionally identical (same page IDs, same ListBox sample,
> same 9-frame layout). Treat as duplicates. This NOTES.md is the
> canonical record; the sibling links here.

## What it is

A single-pattern Figma file demoing one ListBox/native-select
component (`Occupation` → Businessman / Employee / Freelancer /
Retired). The "interactive" framing is the same Figma prototype
trick we already noted on the Calendar file — the dropdown opens
on click in Figma's preview mode. There is no design system; this
is a tutorial artifact.

## Pages (2)

- `44:0` — Thumbnail _(2 frames — cover + author credit)_
- `0:1` — ListBox _(9 frames: closed / open / per-option-selected
  states + an animated GIF preview)_

## Skip

- **The component itself.** Native HTML `<select>`-equivalent
  rendering is a solved problem. TUX has access to:
  - Nuxt UI 4 / Reka's `USelectMenu` (single + multi-select, keyboard
    nav, search filter, virtualization) — the BIG one consumers reach
    for. Used today across `app/pages/forms/select.vue` etc.
  - Nuxt UI 4 / Reka's `UDropdownMenu` for action-menus (different
    semantics — actions, not value-picking).
  - `TuxDropdown` for top-bar nav columns (different again — a
    hover-open nav affordance, not a form input).
  - `TuxFilterPanel` for dashboard filter clusters that compose
    multiple `USelectMenu`s with `TuxRemovableChip` echoes.
- **The "interactive prototype" framing.** Same lesson as the
  Calendar file: Figma's prototype connectors don't translate to
  Vue. Visual identity = standard rounded-corner panel; nothing
  TTI-specific to absorb.
- **The green accent + Figma-branded layout.** Not on the TUX
  palette.

## Absorb

- **None.** Every variant in the file (closed / open / hovered-row
  / selected-row) maps cleanly to `USelectMenu`'s built-in states.
  TUX gains nothing by re-implementing or wrapping.

## Tension

- **"We don't have a TuxSelect" temptation.** True — we don't, on
  purpose. `USelectMenu` is the recommendation. The only reason to
  wrap would be to enforce TUX label/help-text composition (using
  `TuxInfoLabel`) or to surface a "pick from a curated list with
  source citations" form (Landscape-specific). Neither exists yet.

## Decisions

- **No new TuxSelect / TuxListBox component.** Continue
  recommending `USelectMenu` directly. If/when a TUX surface needs
  consistent label+help+select composition, ship a
  `TuxField` (label-help-input cluster) rather than a `TuxSelect` —
  the wrapping target is the label-stack, not the select itself.
- **Downgrade priority** to skip on next INDEX rebuild. Doesn't
  warrant medium status.

## Open follow-ups

- If a `TuxField` (label + help + input cluster) is ever needed,
  reference `TuxInfoLabel` for the label semantics and bind to
  `USelectMenu` / `UInput` / `UTextarea` as the input slot.
- No code changes from this file.
