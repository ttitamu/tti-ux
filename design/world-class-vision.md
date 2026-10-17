# World-Class Vision — TUX Next-Horizon Roadmap

Strategic blueprint for elevating **tux** (`@tti/tti-ux`) from a first-class institutional design system into the global benchmark for research, transportation engineering, and public-sector UX.

This document records:
1. **External UX Systems, Figma & Scientific Sources to Absorb Next**
2. **Core Improvements to the Existing 183-Component & 11-Language Ecosystem**
3. **Wow-Factor Initiatives for Developers, Designers, and Accessibility/Compliance Officers**
4. **Texas A&M Transportation Institute (TTI) Physical-World & Domain DNA**

See [roadmap.md](roadmap.md) for sprint tracking and [visual-language-evolution.md](visual-language-evolution.md) for token-level ledger entries.

---

## 1. Absorbing from External UX Systems, Figma & Scientific Sources

With 70 general UI reference files already triaged in `reference/figma-cache/INDEX.md` (shadcn/ui, Fluent 2, Primer, Vercel AI, Apple/Windows shells), the next wave of absorption draws from **scientific, federal/civic, mission-control, and design-engineering ecosystems**:

| Source / System | Core Idea to Absorb | TUX Implementation Target |
|---|---|---|
| **Figma Code Connect & Variables API** | Bi-directional token & component binding between code and Figma Dev Mode | Add `scripts/build-figma-tokens.mjs` (W3C DTCG format) and `.figma.ts` Code Connect definitions so inspecting any component in Figma surfaces the exact `<Tux*>` Vue, React, Blazor, or WordPress snippet. |
| **USWDS 3.0 & UK GOV.UK Design System** | Civic trust patterns, plain-language executive briefs, and multi-step form resilience | Extend `TuxAbstract` and `TuxReportWebFrame` with a **"Plain-Language / Legislative Brief"** mode (translating dense technical findings for TxDOT legislators and the public) and automatic local-storage form progress recovery. |
| **NASA OpenMCT & Linear** | High-density telemetry time-scrubbing, synchronized cursors, and local-first command velocity | Ship `useTuxSyncCursor()` + `TuxTimeScrubber` to link `TuxECharts`, `TuxChartLine`, `TuxCorridorStrip`, and roadside sensor feeds on a shared timestamp crosshair. |
| **Stripe Docs & Observable Plot** | Scrollytelling and reactive inline prose metrics | Introduce inline metric tokens inside `TuxProse` where hovering a cited statistic highlights the corresponding series or Texas county in an adjacent `TuxChartGeographic` or `TuxChartLine`. |
| **IBM Carbon & Palantir Blueprint** | Enterprise data-grid power controls and provenance | Complete `TuxRichDataGrid` column-header menus (pin, freeze, density switch, unit converter, and CSV/JSON export with embedded citation metadata). |

---

## 2. Improving Upon What We Already Have

### 2.1 Typography Profile Reconciliation (`[data-type-profile]`)
- **Context:** [tux.md](tux.md) enforces the four-family rule (**Open Sans**, **Oswald**, **Work Sans**, **Georgia**), [palette.md](palette.md) notes **Public Sans** from earlier factsheets, and [ADR-0015](../docs/adr/0015-comm-brand-alignment-and-token-playground.md) / [ADR-0016](../docs/adr/0016-legacy-bridge-and-wcag-aaa.md) introduce **Roboto / Inter** for `tti.tamu.edu` WordPress Kadence parity.
- **Improvement:** Formalize first-class **Typography Profiles** (`[data-type-profile="editorial" | "kadence-comm" | "ops-dense"]`) so applications and marketing portals can switch cleanly between the Oswald/Open Sans editorial voice and the Roboto Kadence communications voice without doctrinal ambiguity.

### 2.2 Unifying `/accessibility` with Clinical Vision & AAA Tooling
- **Context:** `/accessibility` previously showed static April summary numbers and listed Criterion `1.4.11 Non-text Contrast` and `2.5.8 Target Size` as manual-only, even though `scripts/audit-wcag-aaa.mjs`, [ADR-0016](../docs/adr/0016-legacy-bridge-and-wcag-aaa.md), and `TuxVisionPreferencesModal` now enforce `7.0:1` text contrast, `3.0:1` UI boundary contrast, `44×44px` AAA touch targets, Okabe-Ito CVD palettes, and anti-halation soft dark mode.
- **Improvement:** Upgrade `/accessibility` into a live **Institutional Conformance & Clinical Vision Portal** with interactive clinical preference controls, automated WCAG 2.2 AAA + Texas DIR §2054.459 / Revised Section 508 matrices, and 1-click downloadable **VPAT 2.5 / OpenACR conformance reports**.

### 2.3 Behavioral & Visual Parity Across All 11 Kit Targets
- **Context:** [kit-pipeline.md](kit-pipeline.md) and `scripts/sync-engine.mjs` synchronize tokens and component schemas across 11 languages (Vue, React, Web Components, CSS, PHP/WordPress, Blazor, C#, Python, JS, Swift, Kotlin).
- **Improvement:** Expand automated behavioral and keyboard state-machine verification across React (`@tti/tti-ux-react`) and Custom Elements (`@tti/tti-ux-elements`) so complex interactive primitives match Vue's exact ARIA and focus contracts.

---

## 3. Wowing Our Three Core Audiences

### 3.1 For Developers — Zero-Friction Velocity & AI-Native Ergonomics
- **Built-in TUX MCP Server (`scripts/tux-mcp.mjs`)**: Expose `tuxCatalog`, `design/tokens.json`, [compositions.md](compositions.md), and component prop schemas via Model Context Protocol so AI coding assistants (TTI AI Studio, Claude Code, Cursor, Antigravity) generate 100% token-verified, AAA-compliant `Tux*` code on the first prompt.
- **Auto-Fixing Audit CLI (`npx tux-audit tokens --fix`)**: Upgrade `scripts/tux-audit.mjs` to automatically suggest or codemod raw hex values and legacy classes into canonical `--brand-*`, `--surface-*`, and `--rhythm-*` tokens.
- **Interactive Prop & Token X-Ray on Showcase Pages**: Let developers inspect resolved CSS custom properties, contrast ratios, and framework code tabs (Vue, React, Web Components, Blazor, WordPress, `tux-bridge.css`) live on every component demo.

### 3.2 For Designers — Tactile Precision & Round-Trip Token Studio
- **OKLCH AAA Snap-Guardrails in `/tokens/playground`**: When experimenting with custom brand or division palettes in the Token Playground, display real-time WCAG 2.2 AAA (`7.0:1`) and UI boundary (`3.0:1`) badges with 1-click snapping to the nearest AAA-compliant lightness stop.
- **W3C Design Tokens (DTCG) & Figma Variables Round-Trip**: Export tokens directly to W3C DTCG JSON, Figma Variables, Tailwind v4 `@theme`, and WordPress Kadence `theme.json`.
- **Interactive Composition Blueprints**: Visual page-shell composer based on [compositions.md](compositions.md).

### 3.3 For Accessibility & Compliance Officers — Continuous Proof & Multi-Sensory Access
- **Live VPAT 2.5 / OpenACR & Texas §2054.459 Export**: Generate machine-readable OpenACR JSON and print-ready VPAT 2.5 conformance tables directly from `/accessibility`.
- **Multi-Sensory Data Visualization (Web Audio API Sonification + Tabular Drawer)**: Equip `TuxChartFrame` and `useTuxSonification()` with acoustic data sonification (mapping series values to musical pitch and stereo pan across time) and a 1-click **"Accessible Data Table"** disclosure so blind, low-vision, and neurodivergent researchers can hear and inspect every chart without barriers.
- **RELLIS Field-Sunlight Vision Mode (`[data-vision-comfort="field-sunlight"]`)**: Clinical outdoor high-glare comfort mode engineered for TTI researchers on tablets at the RELLIS proving grounds and roadside crash sites—maximizing daylight luminance contrast (`#FFFFFF` canvas, `#000000` ink, `#3C0000` deep maroon, `2px` structural borders, and `48px+` glove-friendly touch targets).

---

## 4. Evoking Texas A&M Transportation Institute in Every Component

What separates TUX from a generic themed component library is **TTI's physical-world transportation engineering heritage**:

### 4.1 MUTCD & Highway-Engineering Micro-Details ("Wayfinding Chrome")
- **Engineering Stationing & Milepost Notation**: Support civil-engineering stationing (`STA 01+00`, `RM 240.5`) in `TuxStepper`, `TuxActivityTimeline`, and `TuxCorridorStrip`.
- **Expanded Identity Primitives (`public/identity-primitives.svg`)**: Alongside `tux-star`, `tux-chevron`, `tux-compass`, and `tux-row-grid`, add **RELLIS Test Track geometry**, **TxDOT District boundary badges**, and **CAD dimension ticks** (`├─ 24px ─┤`).

### 4.2 Domain-Native Transportation Primitives
- **`TuxUnitValue` & `useTuxUnits()`**: Scientific measurement primitive formatting transportation units (`AADT`, `VMT`, `mph`/`km/h`, `kip`, `PCE`, `g`, `± CI`) with tabular numerals and a global **US Customary ↔ Metric (SI)** toggle.
- **`TuxLinearReference` (`TuxMilepostScrubber`)**: Linear Referencing System (LRS) corridor selector by Highway Route + Reference Marker / DFO, pairing natively with `TuxCorridorStrip` and `TuxRoadwayCrossSection`.
- **`TuxLOSBadge` & Intersection Schematics**: Highway Capacity Manual (HCM) Level of Service (`LOS A`–`LOS F`) semantic badges with triple-redundant shape/pattern encoding.

### 4.3 The 5-Band Research Spectrum as a Universal Thread
- Extend `TUX_SPECTRUM_DIVISIONS` (`maroon`, `blue`, `teal`, `green`, `gold`) across `TuxCard`, `TuxPageHeader`, `TuxSectionHeader`, and `TuxBadge` via a `division` prop so any surface can key its signature rule or corner-drop accent to one of TTI's five core research pillars while preserving 100% WCAG 2.2 AAA contrast.

### 4.4 Provenance & Citation by Default
- At TTI, every metric has a methodology and funding source. `TuxChartFrame`, `TuxBigStat`, and `TuxDataTable` surface first-class provenance metadata (DOI, grant/project ID, sample size $n$, confidence interval, and 1-click citation export).

---

## Execution Order

- **Phase 1 (Completed & Verified — Accessibility & Compliance Wow-Factor)**:
  1. **RELLIS Field-Sunlight Mode** (`fieldSunlight` in `useTuxVisionPrefs`, `TuxVisionPreferencesModal`, and `globals.css`).
  2. **Acoustic Chart Sonification & Accessible Data Table Drawer** (`useTuxSonification` composable + `TuxChartFrame` interactive toolbar).
  3. **Live VPAT 2.5 / Texas §2054.459 Conformance & Clinical Accessibility Portal** (`/accessibility` upgrade with live vision controls, OpenACR JSON export, print-ready VPAT mode, and interactive chart sonification demo).
- **Phase 2 (Completed & Verified — TTI Domain Soul & Engineering Primitives)**:
  1. `TuxUnitValue` + `useTuxUnits()` (live US Customary ↔ Metric SI toggle, confidence intervals, and civil-engineering stationing).
  2. 5-Band Research Spectrum `division` prop across `TuxCard` and `TuxPageHeader`.
  3. Expanded `public/identity-primitives.svg` CAD (`#tux-cad-station`) & RELLIS proving ground (`#tux-rellis-track`) geometry.
- **Phase 3 (Completed & Verified — Developer & Designer Superpowers)**:
  1. TUX MCP Server (`scripts/tux-mcp.mjs`, `npx tux-audit mcp`, `.mcp.json`) + `npx tux-audit tokens --fix` auto-migration & Levenshtein suggestions.
  2. Token Playground (`/tokens/playground`) live WCAG 2.2 AAA (`7.0:1`) snap-guardrails & W3C DTCG / Figma Variables multi-mode JSON exports.
- **Phase 4 (Completed & Verified — Civic Trust, Research Provenance & HCM Level-of-Service)**:
  1. Plain-Language / Legislative Brief mode (`plainSummary`, `policyTakeaways`) & 1-click provenance citation copy (`projectNumber`, `doi`, `citation`) on `TuxAbstract`.
  2. Highway Capacity Manual (HCM) Level-of-Service (`los="A".."F"`) with triple-redundant shape/text/color encoding on `TuxBadge`, plus 5-band `division` spectrum across `TuxBadge`, `TuxSectionHeader`, `TuxAbstract`, and `TuxBigStat`.
  3. Statistical provenance pills (`sampleSize` $n$, `confidenceInterval`, `doi`) on `TuxBigStat`.
- **Phase 5 (Completed & Verified — Synchronized Telemetry Cursor Bus & Engineering Stationing)**:
  1. `useTuxSyncCursor()` reactive telemetry & corridor crosshair channel bus (`milepost`, `stationFeet`, `timestamp`, `eventId`).
  2. Civil-engineering stationing (`tickFormat="station"` / `"rm"`), interactive range scrubber (`interactiveScrub`), and live crosshair readout on `TuxCorridorStrip`.
  3. Stationing badges (`station`, `milepost`), 5-band `division` spine, and bi-directional cursor sync (`syncChannel`) on `TuxActivityTimeline`.
- **Phase 6 (Completed & Verified — Live Token & A11y X-Ray, Typography Profiles & Enterprise Grid Provenance)**:
  1. **Live Token & A11y X-Ray Drawer on `TuxExample.vue`**: Interactive toolbar toggle (`Token X-Ray`) that inspects the live preview container to display detected `Tux*` primitives, active theme/WCAG 2.2 AAA posture, and resolved CSS custom property bindings (`--brand-primary`, `--brand-accent`, `--surface-page`, `--surface-raised`, `--surface-border`, `--text-primary`, `--font-display`, `--font-body`) with live swatches.
  2. **First-Class Institutional Typography Profiles (`[data-type-profile]`)**: Formalized `"editorial"` (Oswald + Open Sans + Georgia), `"kadence-comm"` (TTI Communications / Kadence WordPress parity), and `"ops-dense"` (TMC Operations & tabular telemetry) across `useTuxVisionPrefs`, `TuxVisionPreferencesModal`, and `globals.css`.
  3. **Civil-Engineering Stationing on `TuxStepper.vue`**: Added `stationFormat` (`"number" | "station" | "rm"`), per-step `station` / `milepost` badges (`STA 12+00`, `RM 240.5`), and 5-band `division` spectrum connectors.
  4. **Provenance Citation & Unit-System Export on `TuxRichDataGrid.vue`**: Added `projectNumber`, `doi`, `citation`, `showUnitToggle` (`US Customary` $\leftrightarrow$ `Metric (SI)`), 1-click `Copy Citation` footer strip, and `export-csv` payloads with embedded `# Provenance` and `# Unit System` metadata headers.
