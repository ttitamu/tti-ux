# Skip-rationale — 22 remaining stub files

**Status:** consolidated audit (2026-05-22) covering the files in
the skip-bucket of [`INDEX.md`](./INDEX.md) that **don't warrant
their own `NOTES.md` deep-dive**. Each entry below explains why
the file is reference-only and what TUX-equivalent surface (if
any) already covers the patterns it contains.

This doc exists so future contributors don't have to wonder whether
a stub file was "skipped intentionally" or "forgotten." It was
intentional — the per-file `NOTES.md` already records the page
inventory; the rationale below is the missing "why."

After the 2026-05-22 absorption marathons (high-signal, medium-
signal, platform-aware, chart-family closure), 47 of 70 files are
absorbed. The 22 below + 1 file already audited as duplicate
(Material UI for Figma ×2) round out the remaining skip-bucket.

## The 22

### Other design systems we're not adopting

| File | Why skip |
|---|---|
| **Ant Design Open Source** (70 pages) | Different framework (Ant Design React/Vue), different visual identity (clean enterprise, not editorial-research). Patterns are well-covered by Nuxt UI 4 + TUX wrappers. Re-walking 70 pages would yield 0 net components. |
| **Bootstrap 5 Design System UI Kit** (62 pages) | Older design system (2020-era); Bootstrap's component vocabulary maps cleanly to Nuxt UI primitives. No 2026-relevant patterns missing from TUX. |
| **Bootstrap 5 UI Kit** (6 pages) | Smaller Bootstrap variant; subsumed by the larger Bootstrap 5 Design System file above. |
| **Design System / UI kit / +6000 Components** (24 pages) | Kitchen-sink kit with no curated POV. By definition the 6000 components include duplicates of every Nuxt UI primitive; no signal beyond noise. |
| **DesignCode UI** (32 pages) | Consumer-app design system (Swift/SwiftUI-flavored). Apple-suite absorptions already cover the platform-aware ground for Tauri-Mac targets. |
| **HeroUI Figma Kit** (38 pages) | NextUI rebrand; React-focused. TUX is Vue + Nuxt UI 4 on Reka primitives — different framework path. |
| **Material UI for Figma (and MUI X)** ×2 (70 pages each, duplicate keys) | MUI is React-only; Material 3 absorption already captured the relevant Android / cross-platform patterns. |
| **Vibe UI Kit by monday.com** (55 pages) | monday.com's product design system; consumer-SaaS chrome very different from research-editorial. |
| **Component library** (45 pages) | Generic kitchen-sink kit; same reasoning as the +6000 Components entry above. |
| **Essential UI** (3 pages) | Single-author minimalist kit; nothing TUX-specific. |
| **ACS UI Library Design Kit** (4 pages) | Niche consumer kit; no relevant patterns. |
| **Base Gallery** (2 pages) | Promotional gallery, not a design system. |

### Mockup / wireframe / authoring tools

| File | Why skip |
|---|---|
| **Figma's Trending Most Powerfull Mockup UI Kit Minimal Devices (Zara)** (16 pages) | Device-frame mockup library — useful for marketing screenshots, not for TUX runtime. If a TTI marketing designer needs to show Landscape inside a device frame, this file is the asset. |
| **Figma's Trending Most Powerfull Wireframing UI kit Design System (Zara)** (16 pages) | Wireframing kit — low-fidelity boxes + lorem ipsum. TUX doesn't ship wireframe primitives; we ship the polished components. |
| **Mobile UI kit** (3 pages) | Three-page generic mobile mockup library; subsumed by the iOS / iPadOS / Android absorptions. |

### Single-pattern / specialty kits

| File | Why skip |
|---|---|
| **LOGIFY - WEB LOGIN UI KIT** (2 pages) | Single login-form mockup; trivial. TTI consumer apps inherit auth from upstream identity providers (CAS / Microsoft SSO); no login-form surface to design. |
| **App Icon Template** (2 pages) | iOS/macOS app-icon design template; not a UI surface. If TTI ships a native app shell (currently no roadmap), the platform-awareness doctrine points at SF Symbols / platform conventions. |
| **Template for VS Code Color Mapper** (3 pages) | Tooling artifact for building VS Code themes; out of scope. |
| **monday.com project template** (9 pages) | monday.com Vibe variant; same skip reasoning as Vibe UI Kit above. |
| **Neumorphism UI Kit** (4 pages) | Neumorphism is a specific visual style (soft-shadow extruded surfaces) — TUX uses flat paper-grain surfaces with hairline rules. Adopting neumorphism would contradict the visual identity. |

## How this list could shrink

A few of these could earn a future absorption pass if circumstances
change:

- **If TTI ever ships a native macOS / iOS app shell** (not just
  Tauri), the App Icon Template + DesignCode UI would gain
  relevance.
- **If a TTI marketing designer asks for device-frame mockups**,
  the Mockup UI Kit (Zara) is the source of truth.
- **If the "build wireframes first" workflow ever becomes a TTI
  convention**, the Wireframing UI kit could inform a future
  `TuxSketch` family. Currently we go straight from spec to Vue.

Otherwise — skip. The medium + platform-aware buckets are cleared;
remaining absorption value is concentrated here, and it's small.

## See also

- [`INDEX.md`](./INDEX.md) — the running aggregator.
- Three companion deep-audits committed alongside this doc:
  - [`accessible-design-toolkit/NOTES.md`](./accessible-design-toolkit/NOTES.md)
  - [`omnichart-customizable-ux-flow-chart/NOTES.md`](./omnichart-customizable-ux-flow-chart/NOTES.md)
  - [`59-charts-ui-responsive-components-chart-js-chartist-apex-ch/NOTES.md`](./59-charts-ui-responsive-components-chart-js-chartist-apex-ch/NOTES.md)

These three are bucketed as **medium → skip** (audited, kept for
reference); they have proper `NOTES.md` files because they had
enough signal to warrant a documented decision.
