# Microsoft Teams UI Kit (Community)

**Source:** Figma file `8ZDRRywU9F7iyInG8Mj9df`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium
**Status:** absorbed — no new components; three patterns confirmed for roadmap

![cover](./cover.png)

## What it is

The most substantial of the Microsoft suite files at 41 pages —
the design system for **building third-party Teams apps**. Like
the M365 file, the framing is "your app lives inside Teams" — so
the chrome (left rail of apps, top app bar) is Teams', and the
file shows what slots a third-party app gets to fill.

Three parts of this file are genuinely TUX-relevant; the rest is
out-of-scope Teams ecosystem:
1. **Data visualization** (25 frames!) — Teams' built-in chart
   styles for embedding analytics in a tab/personal-app.
2. **Filter & Sort** (7 frames) — the chip-row + sort-menu pattern.
3. **Activity feed notifications** (3 frames) — the "X commented
   on Y" notification list, plus the **Stage view / Lightbox view**
   full-screen content pattern.

## Pages (41)

Selected highlights (full list in stub above):

**Design system** (skip mostly — Teams-specific tokens):
- Layout & Scaling _(6 frames — Teams app-shell breakpoints)_
- Avatars · Icons · App icon · Type · Colors · Shape and elevation ·
  Copy and content — internal to Teams' brand

**App capabilities** (skip — Teams plug-in semantics):
- App structure / Template UI screens / Personal apps / Tabs / Bots /
  Meeting extensions / Messaging extensions

**UI components** (mixed):
- `6150:160` — Basic UI components _(27 frames — Fluent atoms)_
- `13384:34909` — **Adaptive Cards** _(16 frames — JSON-rendered
  in-chat embeds; see Skip)_
- `218:27878` — Card Design Toolkit _(2 frames — Adaptive Cards
  builder)_
- `6150:162` — Task modules _(6 frames — Teams modal dialogs)_
- `6150:163` — **Stage view** _(6 frames — full-screen pinned
  content; see Absorb #3)_
- `9324:774063` — **Lightbox view** _(11 frames — modal media
  viewer; see Absorb #3)_
- `6150:164` — Secondary left navigation _(7 frames — covered by
  TUX sidebar.vue today)_
- `6150:165` — Toolbar _(7 frames — compose UButtonGroup)_
- `6150:166` — Notification bar _(7 frames — covered by TuxAlert)_
- `6150:167` — Breadcrumb _(6 frames — TuxBreadcrumbs)_
- `6150:168` — **Activity feed notifications** _(3 frames — see
  Absorb #2)_
- `8120:450380` — **Data visualization** _(25 frames — see Absorb #1)_
- `8120:450381` — **Filter & Sort** _(7 frames — see Absorb #2)_

## Skip

- **Adaptive Cards as a TUX target.** Microsoft's Adaptive Cards
  are JSON-schema mini-UIs rendered inside chat threads. We
  already absorbed the equivalent pattern from
  [MCP Apps for Claude](../mcp-apps-for-claude/NOTES.md) and
  shipped `TuxCardCarousel` as the inline-carousel analog. The
  three-tier display taxonomy (inline card / inline carousel /
  full screen) is documented in `design/components.md`. We don't
  adopt Adaptive Cards' JSON schema; we render rich content in
  Vue templates inside `TuxChatMessage`.

- **Teams app-shell chrome.** The Teams left rail, top app bar,
  meeting overlays — all are host-app surfaces. TUX consumers are
  standalone web apps, not Teams plug-ins.

- **Plug-in capability matrix** (Personal apps / Tabs / Bots /
  Meeting extensions / Messaging extensions). Same M365 lesson:
  plug-in slots don't map to standalone-app TUX.

- **Bots conversation patterns.** TTI's chat product
  (tti-ai-studio) is a direct conversation surface, not a Teams
  bot. `TuxChatMessage` + `TuxComposer` cover it.

## Absorb

1. **Data visualization (25 frames) — confirmation of the
   `chart-foundations` doctrine.** Teams' chart styles span line,
   bar, stacked bar, area, donut, gauge, KPI tile, table.
   Maps 1:1 to:
   - Already shipped: `TuxChartLine` (with previous-period overlay
     + confidence band)
   - Roadmap Priority B: `TuxChartBar`, `TuxChartDonut`,
     `TuxChartArea`
   - Already shipped equivalents: `TuxBigStat` (KPI tile),
     `TuxTable` (mini-table)
   - **Gauge** — Teams shows a 270° arc with a needle. No TUX
     equivalent; not on the roadmap. Defer — research dashboards
     rarely use gauges (they imply a single normative target, which
     research data doesn't have).

   The Data viz section in `design/chart-foundations.md` already
   covers the right scope. **Reaffirms the doctrine; no change.**

2. **Filter & Sort (7 frames) — confirms TuxFilterPanel.**
   Chip-row of active filters + sort dropdown + reset link. Already
   covered by `TuxFilterPanel` (which uses `TuxRemovableChip` for
   each active filter) + `UDropdownMenu` for the sort menu.

3. **Stage view + Lightbox view (17 frames combined) — genuine
   gap.** Both are full-screen overlays for inspecting media or
   pinning a content panel:
   - **Stage view**: pin a chart/table from the dashboard into a
     full-screen overlay with a top bar (back + title + actions).
     For research, this would be "open this chart in focus mode."
   - **Lightbox view**: modal media viewer with prev/next,
     download, full-size image.

   TUX has `UModal` for arbitrary content modals, but **no
   dedicated "stage" or "lightbox" wrapper**. The use case is real
   for Landscape — researchers often want to focus on one chart
   without sidebar distraction. **Roadmap candidate:**
   `TuxFocusView` (or similar — name TBD) that opens a full-
   viewport overlay with back/title/actions chrome and a content
   slot. Defer until a Landscape page explicitly needs it.

## Tension

- **"Microsoft has Adaptive Cards, we should ship a JSON renderer
  for chat-embedded UIs."** No. Adaptive Cards are a cross-vendor
  spec (Microsoft, Bot Framework, Outlook actionable messages).
  TUX is Vue templates inside `TuxChatMessage` — strictly more
  flexible, vendor-neutral, and we own the rendering. Don't
  retrofit a JSON UI spec on top.
- **Stage view temptation.** Easy to over-engineer. If we build
  `TuxFocusView`, keep it minimal: a slot, a back button, an
  Escape-closes contract, and Esc/click-backdrop dismissal.

## Decisions

- **No new components today.** Three roadmap candidates noted
  (`TuxFocusView`, gauge chart, `TuxAppSwitcher` from the Fabric
  audit) — all deferred until consumer pull.
- **Reaffirm `chart-foundations.md`** — Teams' chart inventory
  validates our Priority B roadmap.
- **Reaffirm `TuxFilterPanel`** — Teams' filter pattern matches
  what we shipped.
- **Hold the line on no Adaptive Cards adoption.** Vue templates
  in `TuxChatMessage` is the right path.

## Open follow-ups

- **Roadmap note: `TuxFocusView`** — full-viewport overlay
  composing a back button + title + actions + content slot. Use
  case: Landscape "open chart in focus mode." Defer; no
  consumer asks yet.
- Continue treating Adaptive Cards as **a system we read for
  patterns, not a system we adopt**. The MCP three-tier taxonomy
  in `design/components.md` is our analog.
