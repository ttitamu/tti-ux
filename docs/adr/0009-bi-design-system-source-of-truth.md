# ADR 0009 — tti-ux is the source of truth for TTI's BI design system

- **Date**: 2026-05-08
- **Status**: Accepted

## Context

TTI's visual identity for Power BI / Microsoft Fabric reporting currently lives in three places:

1. **`tti-ux`** — brand tokens (color, typography, spacing), the 8-series categorical chart palette, 5-step sequential ramps, three themes (light / dark / HC). Authored here; consumed by web surfaces.
2. **`docs-it-tamu-edu`** (and its clone `docs-tti-tamu-edu`) — the canonical AggieBI/AggieDB/Aggie Viz documentation under `nuxt-site/content/docs/tamu/M365/Power-BI-Fabric/`. This is where the Power BI shell spec, palette rationale, light/dark mode architecture, contrast matrices, CVD optimization, textbox-height piecewise rules, nav-pill geometry, and card-styling specs live.
3. **`tti-reporting`** (the new BI/Fabric monorepo at [`ttitamu/tti-reporting`](https://github.com/ttitamu/tti-reporting)) — derived consumers: `core/themes/tokens.json` (a snapshot of `tti-ux` tokens), `core/themes/TTI-PowerBI-Theme*.json`, `core/ttiviz/SHELL_SPEC.md` (a TTI-rebranded port of the Aggie Viz shell spec).

Three places means three drift surfaces and a coordination tax that's already showing up: a brand-color edit needs to land in `tti-ux`, get re-snapshotted into `tti-reporting/core/themes/`, and (separately) get reconciled with whatever hex values the `docs-tti-tamu-edu` clone still has from the original AggieBI documentation.

The maintainer (same author across all four repos) has flagged the multi-repo overhead as the bottleneck.

## Decision

**`tti-ux` is the single source of truth for TTI's visual identity, including the BI surface.** That means:

1. **Brand tokens** (color, typography, spacing, easing, shadow, focus, radius) — already here. Stay here.
2. **Data-viz tokens** (categorical chart palette, sequential ramps, map outline / flow colors) — already here. Stay here.
3. **Power BI theme JSON** (light + dark) — to be **built** here from tokens, then consumed by `tti-reporting`. Replaces the manually-snapshotted theme JSONs currently in `tti-reporting/core/themes/`.
4. **Aggie Viz / Tti Viz visual spec** (shell anatomy, z-order scheme, canvas dimensions, nav-pill geometry, textbox height rules, card styling) — to be **ported here** from `docs-it-tamu-edu/nuxt-site/content/docs/tamu/M365/Power-BI-Fabric/aggiebi-viz/` with TTI rebranding. The current copy in `tti-reporting/core/ttiviz/SHELL_SPEC.md` is a starting point that should be moved (or re-rooted) here.
5. **`docs-it-tamu-edu` and `docs-tti-tamu-edu`** become **reference-only consumers**: when those docs sites need to show Power BI standards content, they link to `tti-ux` rather than maintaining their own copy. The `docs-tti-tamu-edu` mirror's BI section should be either deleted or reduced to a "see tti-ux" stub.

`tti-reporting` consumes `tti-ux` for both tokens *and* viz specs — not just tokens.

## What needs to be ported in (from docs-it-tamu-edu)

The authoritative Power BI / Fabric documentation currently lives at `docs-it-tamu-edu/nuxt-site/content/docs/tamu/M365/Power-BI-Fabric/`. The mirrored copy in `docs-tti-tamu-edu` is unchanged from the original. Port targets:

| Source | Target in tti-ux | Notes |
|---|---|---|
| `aggiebi-brand-theme/index.md` | `design/bi-theme.md` | Rationale, audience, governance |
| `aggiebi-brand-theme/palette-rationale.md` | merge into `design/palette.md` | TTI palette rationale already in tti-ux; merge what's relevant from the BI side (CVD-optimization notes, contrast matrix) |
| `aggiebi-brand-theme/light-dark-mode.md` | `design/bi-theme-modes.md` | Theme-slicer architecture, DAX measure pattern |
| `aggiebi-brand-theme/organizational-visuals.md` | `design/bi-org-visuals.md` | Per-workload customization rules |
| `aggiebi-brand-theme/component-reference.md` | `design/bi-components.md` | Power BI visual-type policy + approved/pilot/on-hold matrix |
| `aggiebi-brand-theme/implementation-guide.md` | move to tti-reporting (it's deployment-specific) | Stays close to deployment pipeline |
| `aggiebi-viz/index.md` | `design/bi-viz.md` | Page anatomy overview |
| `aggiebi-viz/shell-visual-system.md` | `design/bi-shell.md` (currently mirrored at `tti-reporting/core/ttiviz/SHELL_SPEC.md`) | Z-order, canvas dimensions, 10-visual anatomy. Authoritative copy here; tti-reporting becomes a consumer. |
| `aggiebi-viz/textboxes-and-buttons.md` | `design/bi-textboxes.md` | Piecewise textbox-height rules |
| `aggiebi-viz/nav-pill-system.md` | `design/bi-nav-pills.md` | Active/inactive pill geometry, hit targets |
| `aggiebi-viz/aggieux-card-styling.md` | `design/bi-cards.md` | Card chrome (border radius, shadow, padding, eyebrow rule) |
| `aggiebi-viz/pbip-property-reference.md` | `design/bi-pbip-properties.md` | Reference for PBIR JSON properties used by the shell |
| `aggiedb/index.md` + `aggiedb/schema-design.md` | `design/bi-schema.md` (or stays in tti-reporting) | The TtiDB schema standard. Already lifted into tti-reporting at `core/ttidb/`; **decide** whether the canonical home is here or there. Default: tti-reporting, since schema is BI-specific in a way colors aren't. |
| Theme JSONs at `nuxt-site/public/themes/TAMU-PowerBI-Theme-v0.9.{0,1,2}-{Light,Dark}.json` | replaced by generated artifacts at `dist/` (built from tokens) | Current versions are TAMU-branded; tti-ux generates TTI-branded equivalents from tokens. |

## Consequences

### Positive

- **One repo to edit when brand changes.** Maroon shade adjustment becomes a single PR in `tti-ux`; web + BI surfaces follow on next consumer pin-bump.
- **`tti-reporting` consumers don't manually port.** Eventually `tti-reporting/core/themes/tokens.json` is replaced by a `npm run build` output (or equivalent in the consumer's pipeline) that pulls from `tti-ux`. Same for the Power BI theme JSON.
- **Doc sites become consumers.** `docs-tti-tamu-edu` stops being a stale clone of `docs-it-tamu-edu` for the BI section; it links to `tti-ux` instead. Smaller maintenance surface.

### Negative

- **Up-front porting cost.** ~12 documents to bring across (table above), each with mermaid diagrams, code samples, and tables. Estimated 1–2 days focused work.
- **`tti-ux` repo grows.** The catalog gains a "BI" navigation section. Acceptable trade — better to have the design-system catalog be the place to look than to chase three repos.
- **`tti-reporting` has a temporary inconsistency.** `core/ttiviz/SHELL_SPEC.md` is currently the authoritative shell spec; once `tti-ux` adopts it, `tti-reporting`'s copy becomes a snapshot/reference link. Documented in `tti-reporting/core/ttiviz/README.md`.

## Implementation status (2026-05-08)

- ✅ Brand tokens already here: `design/tokens.json`, `app/assets/css/tokens.css`
- ✅ 8-series chart palette already here: `app/assets/css/tokens.css:240–253` (light), `:361–368` (dark), `:462–469` (HC)
- ✅ 5-step sequential ramps already here: `app/assets/css/tokens.css:263–272`
- ✅ Snapshot of these consumed by `tti-reporting/core/themes/tokens.json` (manual port; commit `a346819` in `ttitamu/tti-reporting`)
- ⏳ **TODO**: port the 12 BI/Aggie Viz docs from `docs-it-tamu-edu` (table above)
- ⏳ **TODO**: build script that emits Power BI theme JSON from tokens (`scripts/build-bi-theme.mjs`?). Replaces the hand-maintained JSON in `tti-reporting/core/themes/`.
- ⏳ **TODO**: update `docs-tti-tamu-edu`'s BI section to reference tti-ux (or delete the mirrored stubs)

## Related

- [ADR 0004](0004-tux-tokens-separate-from-nuxt-ui-theme.md) — tokens architecture
- [ADR 0005](0005-three-theme-palette.md) — three-theme system (light/dark/HC) inherited by BI consumers
- [ADR 0008](0008-data-display-and-reports-section.md) — Reports vs Visualizations distinction; this ADR extends that frame to *embedded BI dashboards* specifically
- [`design/palette.md`](../../design/palette.md) — current palette doctrine
- [`tti-reporting/core/ttiviz/SHELL_SPEC.md`](https://github.com/ttitamu/tti-reporting/blob/main/core/ttiviz/SHELL_SPEC.md) — current TTI shell spec (will move here)
- Upstream lineage: `docs-it-tamu-edu/nuxt-site/content/docs/tamu/M365/Power-BI-Fabric/`
