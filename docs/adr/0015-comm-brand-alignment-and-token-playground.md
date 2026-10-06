# ADR 0015 — Brand Alignment with TTI Communications & Interactive Design Token Playground

- **Date**: 2026-09-23
- **Status**: Accepted / Proposed Idea

## Context

A forensic design audit of the official Texas A&M Transportation Institute web estate (`https://tti.tamu.edu/` and `https://my.tti.tamu.edu/`) revealed the core visual language maintained by the TTI Communications & Marketing team:

1. **Host Stack**: WordPress on WP Engine using the **Kadence Theme** and **Kadence Blocks** (`wp-block-kadence`, `kb-button`), with NitroCDN and Cloudflare.
2. **Typography**: Universal use of `Roboto, sans-serif` for headers, body copy, and UI controls.
3. **Institutional Heading Rhythm**: Prominent section headings (`H1`, `H2`) feature bold Aggie Maroon (`#500000` / `var(--brand-primary)`) paired with a signature horizontal **Warm Gold underline accent rule** (`#CFA935` / `var(--brand-accent)`) extending across the section width.
4. **Button Geometry**: Rectangular profiles with sharp 0px border radius (`rounded-none`), solid maroon fill, and generous padding.
5. **Intranet & Security**: `my.tti.tamu.edu` operates behind Microsoft Entra ID (Azure AD SSO) for State of Texas compliance (TTI Security Control PL-04).

Developer-oriented design systems risk alienating brand guardians when they default to dark "terminal" surfaces, monospaced all-caps labeling (`03C // DATA DISPLAY`), and rounded pill geometry that conflicts with established institutional web patterns.

## Decision

1. **Institutional Brand Harmony over Invasion**:
   - TUX 3.0 adopts the role of an authentic brand custodian that complements rather than replaces existing WordPress and Kadence workflows.
   - Enhanced [`TuxSectionHeader.vue`](file:///Users/A-Guevara/Code/tti-ux/app/components/TuxSectionHeader.vue) with an `institutional` variant that implements the exact maroon title + horizontal gold underline rule seen on `tti.tamu.edu`.
   - Added a `shape="sharp"` (or `"square"`) prop to [`TuxButton.vue`](file:///Users/A-Guevara/Code/tti-ux/app/components/TuxButton.vue) for Kadence-matching rectangular buttons (`!rounded-none`).
   - Softened sidebar navigation headers in [`TuxReactiveSidebar.vue`](file:///Users/A-Guevara/Code/tti-ux/app/components/TuxReactiveSidebar.vue) from developer monospace into clean, human-friendly titles (`Data Display & Tables`) while retaining a subtle numeric index tag (`03C`).

2. **Interactive Design Token Playground (`/tokens/playground`)**:
   - Provide an in-browser live studio enabling real-time experimentation with corner radii (0px to pill), typography (Roboto, Inter, serif), brand colors, and component densities.
   - Include turnkey presets: **"TTI Kadence Institutional"** (full parity with `tti.tamu.edu`), **"TUX Modern App"**, and **"Operations Console"**.
   - Live multi-component preview canvas reacting instantly via CSS custom properties.
   - Export synchronizers generating standard CSS custom properties, Tailwind config, and WordPress/Kadence **`theme.json`** snippets.

3. **Forgejo Idea Submission Workflow**:
   - Provide an in-app "Submit Idea to Forgejo" modal in the playground that packages chosen token configurations into a structured proposal with a 1-click URL targeting `https://code.tti.tamu.edu/tti/tti-ux/issues/new`.

## Consequences

- Applications built with TUX can instantly match `tti.tamu.edu` by selecting the "TTI Kadence Institutional" token configuration or using `shape="sharp"`.
- Communications and design teams gain a live, visual testing bench to evaluate design token changes across all components simultaneously without modifying source code.
- Generates valid `theme.json` blocks that can be directly vendored into TTI's Kadence child themes, ensuring cross-platform token alignment across WordPress and custom applications.
