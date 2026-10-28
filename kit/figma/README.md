# TUX Figma Design Kit (`kit/figma/`)

Offline-capable Figma and W3C Design Token kit for the Texas A&M Transportation Institute (**TUX**) design system.

Every artifact in `kit/figma/` is deterministically compiled from [`design/tokens.json`](../../design/tokens.json) and [`app/utils/tuxCatalog.ts`](../../app/utils/tuxCatalog.ts) via `npm run build:figma`.

## Emitted Artifacts

| File | Purpose |
|---|---|
| `kit/figma/tokens.dtcg.json` | **W3C Design Tokens (DTCG 2025.10)** with `$type`, `$value`, and 3-mode extensions (`tti`, `tti-dark`, `tti-hc`). Compatible with Figma, Penpot, and Style Dictionary. |
| `kit/figma/tokens-studio.json` | **Tokens Studio for Figma** multi-mode token set with pre-configured `$themes` (`Light (tti)`, `Dark (tti-dark)`, `High Contrast AAA (tti-hc)`). |
| `kit/figma/figma-variables.json` | **Figma Variables payload** with `COLOR`, `FLOAT`, and `STRING` types, `0..1` RGBA floats, variable scopes, and platform `codeSyntax`. |
| `kit/figma/code-connect.json` | **183-Component Code Connect Registry** mapping every `Tux*` primitive to Vue 3, React, Web Component, Blazor, and WordPress snippets. |
| `kit/figma/svg-components/*.svg` | **18 Copy-to-Figma Vector Component Sheets** (`TuxColorPalette`, `TuxButton`, `TuxBadge`, `TuxAlert`, `TuxCard`, `TuxBigStat`, `TuxStatus`, `TuxSpectrumRibbon`, `TuxPortalHeader`, `TuxSectionHeader`, `TuxDataTable`, `TuxFormControls`, `TuxCorridorStrip`, `TuxTabs`, `TuxBreadcrumbs`, `TuxModal`, `TuxToast`, `TuxDocsSidebar`, `TuxFooter`, `TuxStatComparison`, `TuxEmptyState`, `TuxGroundedSources`, `TuxToolCall`). |
| `kit/figma/plugin/manifest.json` | **Local Figma Plugin** (`allowedDomains: ["none"]`) that builds Auto-Layout components, Paint/Text/Effect Styles, and Variables on the Figma Free Starter plan. |

## Quick Start

1. **Copy & Paste Vector Sheets (Web or Desktop):** On [`/install/figma`](/install/figma), click **Copy SVG** on any component sheet and press `Cmd+V` (macOS) or `Ctrl+V` (Windows) in Figma to paste editable vector frames and text layers.
2. **Tokens Studio Plugin:** Copy `kit/figma/tokens-studio.json` into the JSON tab of the free **Tokens Studio for Figma** plugin to load Light, Dark, and High-Contrast themes.
3. **Local Figma Desktop Plugin:** In Figma Desktop, select **Plugins → Development → Import plugin from manifest...** and choose `kit/figma/plugin/manifest.json` to generate Auto-Layout components, Paint Styles, and Variables (with automatic single-mode collection fallback on the Free Starter plan).
