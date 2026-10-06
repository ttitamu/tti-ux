# Multi-Platform Kit Pipeline

TUX distributes design tokens and component implementations across multiple software stacks. The kit pipeline ensures that applications outside the Nuxt 4 ecosystem inherit identical brand standards, color palettes, and accessibility contracts.

---

## Architecture Overview

The distribution pipeline is organized into two distinct tiers:

| Tier | Category | Artifacts | Automation Model |
|---|---|---|---|
| **Tier 1** | Deterministic Emitters | CSS variables, SCSS partials, TS constants, C# classes, Power BI themes | Pure computation from `design/tokens.json` |
| **Tier 2** | Component Ports | React components, .NET Tag Helpers/Blazor, WordPress plugins, Web Components | Behavioral translations verified by test suites |

---

## Tier 1 — Deterministic Token Emitters

Tier 1 targets are mathematically derived from `design/tokens.json`. Any update to a design token compiles directly into all target formats without manual transcription.

### Emitted Artifacts

- **`kit/css/tux-tokens.css`**: CSS custom properties for all three themes (`tti`, `tti-dark`, `tti-hc`). Zero build step required.
- **`kit/css/tux-ops.css`**: Operational status chips, table row tints, and keyline styles.
- **`kit/css/tux-bridge.css`**: Drop-in stylesheet elevating raw HTML tables, buttons, and forms to WCAG 2.2 AAA standards.
- **`kit/scss/_tux-bootstrap.scss`**: Variable overrides for SCSS-based Bootstrap builds.
- **`kit/react/tux-tokens.ts`**: TypeScript constant definitions and typed theme objects for React applications.
- **`kit/csharp/TuxTokens.cs`**: Strongly-typed C# constants for ASP.NET and Blazor backends.
- **`kit/python/tux_tokens.py`**: Resolved design-token constants for Python (Streamlit, Dash, Jupyter, Matplotlib).
- **`kit/php/TuxTokens.php`**: PHP 8 constants and theme associative arrays for WordPress and Kadence.
- **`kit/swift/TuxTokens.swift`**: Swift / SwiftUI color definitions and theme enums for iOS and macOS.
- **`kit/kotlin/TuxTokens.kt`**: Kotlin & Jetpack Compose color constants for Android applications.
- **`kit/js/tux-tokens.js`**: Vanilla JavaScript ESM constants and token dictionaries.
- **`kit/wp/theme.json`**: WordPress block-theme palette, font families, and rhythm rules.
- **`kit/powerbi/`**: JSON theme files (`tti-theme.json`, `tti-theme-dark.json`, `tti-theme-hc.json`) for Power BI Desktop and Fabric.
- **`kit/env/brand.env`**: POSIX shell environment variables for CI pipelines and container builds.

### Build and Verification

The emitter scripts compile tokens in a single execution:

```bash
# Compile all framework targets from design/tokens.json
npm run build:kit

# Verify that committed files match source tokens (CI gate)
npm run test:tokens
```

Automated lock tests (`tests/tux-kit-targets.test.ts`) verify that committed targets never drift from their generators.

---

## Tier 2 — Universal Component Synchronization Engine

Tier 2 provides native component implementations across all 11 target languages, orchestrated by the Universal Multi-Language Component Synchronization Engine (`scripts/sync-engine.mjs`).

Whenever a component is modified or added in **any** of the supported languages, the engine ingests the source file into a canonical `ComponentSchema` Intermediate Representation (IR) and regenerates idiomatic components across all other target languages with zero visual or behavioral drift.

### Supported Language & Framework Targets

1. **Vue 3 / Nuxt 4 (`app/components/`)**: Canonical SFCs with auto-import and SSR pre-rendering.
2. **React 19 JSX / TSX (`packages/react/src/components/` & `kit/react/components/`)**: Typed React functional components.
3. **HTML5 Web Components (`kit/elements/`)**: Standard Custom Elements with Shadow DOM.
4. **CSS & Tokens (`kit/css/`)**: Pre-compiled custom properties and utility classes.
5. **PHP / WordPress (`kit/php/components/`)**: PHP 8 classes and Gutenberg block render callbacks.
6. **.NET Blazor / Razor (`kit/csharp/components/`)**: Razor components and Tag Helpers.
7. **C# .NET Core (`kit/csharp/components/`)**: Strongly typed C# TagHelper controls.
8. **Python (`kit/python/components/`)**: Dataclasses and Streamlit/Dash HTML builders.
9. **Modern JavaScript (`kit/js/components/`)**: ESM/CJS DOM renderers and utility helpers.
10. **Swift / SwiftUI (`kit/swift/components/`)**: Native SwiftUI View structs for iOS and macOS.
11. **Kotlin / Compose (`kit/kotlin/components/`)**: Jetpack Compose Composable functions for Android.

### Engine Operations

```bash
# Synchronize all components across all 11 languages
npm run sync:engine

# Start continuous multi-language file watcher
npm run watch:sync
```

### Active Component Packages & Bindings

- **Vue 3 / Nuxt 4 (`@tti/tti-ux`)**: Canonical design system layer.
- **React (`@tti/tti-ux-react`)**: Native React 18/19 components, TypeScript interfaces, and Tailwind wrappers (`/install/react`).
- **.NET / Blazor (`Tti.Tux.AspNetCore` & `Tti.Tux.Blazor`)**: Razor Tag Helpers and Blazor component library (`/install/dotnet`).
- **WordPress & Kadence (`tti-ux-core`)**: Gutenberg block patterns and Kadence theme styling hooks (`/install/wordpress`).
- **Web Components (`@tti/tti-ux-elements`)**: Framework-agnostic custom element bundle (`dist/tux-elements.js`).
- **Python (`tti-ux-python`)**: Dataclasses and Streamlit/Dash layout primitives.
- **Swift (`TTIUXSwift`)**: SwiftUI views and design token bindings for iOS/macOS.
- **Kotlin (`tti-ux-kotlin`)**: Jetpack Compose composables and Material 3 palettes for Android.

### Quality and Drift Management

To maintain parity between the Vue source of truth and framework ports:

1. **Parity Ledger**: Component signatures and hashes are tracked in `kit/ports/manifest.json`.
2. **Behavior Verification**: Ports must satisfy identical prop, emit, and accessibility contracts verified by axe-core and component unit tests.
3. **Change Control**: Component additions and revisions undergo formal pull request review with automated test suite validation.

---

## Target Consumption Guide

To consume specific targets in downstream projects:

```bash
# Install the core distribution package
npm install @tti/tti-ux
```

Refer to the [Install Directory](/install) for detailed setup instructions and code examples for each platform.
