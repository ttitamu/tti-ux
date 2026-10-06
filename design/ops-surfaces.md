# Operational surfaces

Nagios Core overlay work (2026-09) showed that TUX already had the
wrong *shape* of answer for monitoring: sentiment tokens, maroon
chrome used as state, and a Vue catalog with no drop-in for apps
that cannot change their markup. The status ramp landed in
[ADR-0013](../docs/adr/0013-operational-status-ramp.md). This note
is the rest of the lesson: how an ops board consumes TUX.

## Two documents

| Dimension | Overlay | Owned board |
|---|---|---|
| Markup | The host's (CGI, AAP, a vendor admin) | Ours |
| CSS | `kit/css/tux-ops.css` mapped onto host classes | Same file, plus Vue (`TuxStatus`) |
| Constraint | Do not move, hide, or relabel what operators already know | Same URLs / column order / scan; new HTML is allowed |
| Where host selectors live | **The consuming repo** | Nowhere |

The kit never learns `.serviceOK`. A wrong selector in tti-ux is
invisible on every other consumer and untestable here. Recipes
(gold keyline, hairline rail, `--status-*` chip) are portable;
`.statusBGCRITICAL` is not.

## Vue, HTML, CSS, Source

`TuxExample` already showed Vue, rendered HTML, and optional SFC
source. Power BI reports got a fourth tab because they are a real
target. Ops boards are the same: the CSS tab on
[`/components/status`](../app/pages/components/status.vue) is
`kit/css/tux-ops.css`, not a transcription.

| Tab | Who it is for |
|---|---|
| Vue | Nuxt / Vue apps (`<TuxStatus state="critical" />`) |
| HTML | What actually rendered (auto) |
| CSS | Overlay / static HTML (`tux-ops.css`) |
| Source | The SFC, when the brand contract is load-bearing |

## What the recipes encode

- **Status is `--status-*`, never `--brand-primary`.** Maroon is
  chrome. CRITICAL is true red.
- **Gold is a keyline** (`.tux-ops-heading`), never heading text.
  `--warn-text` (or `--status-warning` as text) is for warning
  words on white.
- **Chrome is a hairline**, not a colored slab. `.tux-ops-rail` and
  `.tux-ops-table` use `--surface-border` on `--surface-page` /
  `--surface-raised`.
- **ACK ≠ MAINT.** Acknowledged sinks (`--surface-sunken`).
  Scheduled downtime is `--status-maintenance`.
- **TuxBadge `status` is a different word.** Queued / running /
  completed is job lifecycle on the semantic palette. Do not feed
  OK/WARNING/CRITICAL through `TuxBadge`.

## Composition

[`/examples/ops-board`](../app/pages/examples/ops-board.vue) is the
assembly: KPI tiles with `TuxStatus`, a `TuxSparkline` on poller
load, gold `.tux-ops-heading`, hairline `.tux-ops-table`. Same
scan density as a monitoring pane, not Landscape's 96px numerals.
`TuxBigStat` stays on IT / marcom dashboards — maroon numerals
are chrome, not state.
