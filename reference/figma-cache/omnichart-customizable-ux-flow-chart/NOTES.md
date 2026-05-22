# Omnichart - Customizable UX Flow Chart (Community)

**Source:** Figma file `CsEjqkMBvFFFsacFXrLCXn`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium → skip (audited; out of scope)
**Status:** absorbed — no new components; TuxDiagram covers it

![cover](./cover.png)

> Reviewed during the post-platform-aware sweep. Marketed as a
> "customizable UX flow chart" — node-and-arrow diagram primitives
> for Figma authoring. Out of scope for TUX runtime.

## What it is

A 3-page Figma toolkit for **building UX flowcharts in Figma**.
Tile-shaped nodes (start / decision / page / end / popup / link)
in five tones, connected by directional arrows. Cover shows a
sample auth-flow with ~12 nodes.

Pages:
- `35:1208` — Cover (1 frame)
- `0:1` — **Design Component** _(5 frames — the node library)_
- `35:128` — **Example** _(25 frames — finished flowcharts as
  reference)_

## Pattern → TUX coverage

| Omnichart pattern | TUX coverage |
|---|---|
| Node-and-arrow flowchart | [`TuxDiagram`](../../app/components/TuxDiagram.vue) — Mermaid-based, lazy-loaded ~3MB, brand-themed |
| Decision diamond / process rectangle / popup oval | All Mermaid `flowchart` shapes — covered |
| Directional arrows | Mermaid `-->`, `-.->`, etc. — covered |
| Color-coded node tones | Mermaid `classDef` styling — covered (TUX adds maroon-themed class defs) |
| Multi-page authentication flow example | Reference only — consumers write their own diagrams as Mermaid in markdown |

## Skip

- **Adopting Omnichart's node library.** It's a Figma-authoring
  artifact; TUX consumers write Mermaid in markdown via
  `TuxDiagram`. The Vue runtime renders SVG, not Figma frames.
- **The visual style.** Omnichart's node fills use saturated dark
  colors against a black background — opposite of TUX's
  editorial-paper character.
- **Building a custom node-link primitive.** `TuxDiagram` already
  ships with Mermaid; adding a parallel Vue-native flowchart
  authoring surface is a multi-week build with no consumer ask.

## Absorb

- **None.** TuxDiagram is the canonical TUX answer. Mermaid's
  `flowchart` syntax covers every Omnichart node shape.

## Tension

- **"Visual authoring would be nice."** True — Mermaid requires
  contributors to write a text DSL. But the TTI editorial
  workflow (Vue + markdown) is text-led already, and Mermaid's
  syntax is the most-supported diagram-DSL in the ecosystem. The
  trade-off is accepted.

## Decisions

- **No new components.**
- **No TuxDiagram changes** — already covers the surface area.
- **Move file from skip → medium → skip on next rebuild.** The
  audit is closed.

## Open follow-ups

- None.
