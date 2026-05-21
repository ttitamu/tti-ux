# Chat Input Box (Community)

**Source:** Figma file `IRqWt0cn37ySESHUptUrML`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-21
**Priority:** medium
**Status:** absorbed — 0 new components; confirms TuxComposer's slot shape

![cover](./cover.png)

## What it is

A focused composer-only kit: 16 frames of "ChatGPT Chat Input"
variants on a single Components page. Mostly the same input box in
different states (empty / filled / multi-chip / modal-pair / send-
disabled / etc.) — a visual catalog of *all* the affordances a
modern AI composer might surface.

## Pages (4)

- `1:2` — 🔶 Components _(16 frames; the inventory)_
- `33:647` — 🟡 Design system _(2 frames; tokens, skip)_
- `1:3` — ❄️ Made with SnowUI _(upsell, skip)_
- `0:1` — 🔶 Cover _(thumbnail)_

## Frames inspected

`components/`:
- `chatgpt-input-variants.png` — 6 stacked variants (no-attach,
  with chips, error/disabled, modal-pair Cancel/Send, etc.)
- `chatgpt-input-2.png` — single "Ask anything" variant + 4 chips
  (Attach / Search / Study / Voice) + footer disclaimer

## Existing TUX surface (audit before proposing)

**`TuxComposer`** (`app/components/TuxComposer.vue`) covers the
canonical shape with three slots:

- `#scope` (top) — compliance scope banner (TuxAlert variant)
- default — textarea body (v-model)
- `#toolbar-extra` (bottom toolbar row) — consumer-supplied
  chips/buttons next to the built-in attach + model picker

Plus configurable `attachLabel` / `attachIcon` for the primary
attach chip. The "Attach / Search / Study / Voice" stack from this
kit is exactly the `#toolbar-extra` use case.

**`UChatPrompt`** / **`UChatPromptSubmit`** (Nuxt UI 4) cover the
lower-level primitive if a consumer wants a bare composer without
the editorial chrome.

## Skip

- **The whole rendered chrome.** Tight rounded-rectangle border,
  drop-shadow ring, blue accents — SaaS-modern, not editorial.
  TuxComposer uses the 2px maroon frame instead; that stays.
- **"Voice" / "Mic" affordance as a built-in.** No TTI consumer
  surface needs voice input today. If a future surface does, it
  composes via `#toolbar-extra` like any other action chip.
- **The send-button "→" arrow glyph** vs the explicit "Send" label.
  TuxComposer ships an icon-only send; consumers add a label slot
  if they want one. Not a built-in toggle.

## Absorb

1. **Confirmation that 4–5 toolbar chips is a real shape.** Earlier
   we shipped `#toolbar-extra` (CHANGELOG entry: "Add TuxComposer
   #toolbar-extra slot for consumer-supplied chips"). This kit
   shows it was the right move — every variant has 3–5 chips
   under the input (Attach, Search, Study, Voice + Send). The
   slot already lets consumers compose that.
2. **Cancel/Send modal-style pair.** Two of the variants flip the
   send affordance into a `[Cancel] [Send]` pair, typically for
   in-modal composer usage. **TuxComposer doesn't natively support
   this** — `@submit` emits, and the host wires Send; there's no
   `cancelLabel` prop or `@cancel` emit. **Defer** as roadmap note:
   if a consumer wraps TuxComposer in a TuxModal and needs an
   explicit Cancel, expose a `#toolbar-extra` button or build a
   `cancelable` boolean later. Not worth shipping speculatively.

## Tension

- **Density of chips** — 4 visible chips + send + model picker +
  attach is a lot of real estate. TuxComposer keeps the toolbar to
  a single row; if a consumer overloads `#toolbar-extra`, the row
  should wrap rather than overflow. Worth a CSS check next time
  TuxComposer is touched.
- **Hint vs. footer disclaimer.** The kit's "ChatGPT can make
  mistakes" sits below the composer as a generic disclaimer.
  TuxComposer's `hint` prop ("⌘↵ send · / corpus to switch …") is
  shortcut-oriented. Different audiences; both legitimate. The
  hint stays a shortcut hint, not a disclaimer.

## Decisions

- **No new components.** TuxComposer's `#toolbar-extra` already
  covers the multi-chip pattern.
- **Carry-forward:** if a consumer surface composes TuxComposer
  inside TuxModal, evaluate adding a `cancelable` + `@cancel`
  pair. Not building speculatively.

## Open follow-ups

- **`TuxComposer.toolbar-extra` overflow check** — verify the
  toolbar row wraps cleanly when 4+ chips are stacked next to the
  attach + model picker + send. CSS-only check next time the file
  is touched.
- **`TuxComposer.cancelable`** (roadmap candidate, defer): when a
  consumer wraps it in a modal and needs an explicit Cancel
  button alongside Send. Build only when forced.
