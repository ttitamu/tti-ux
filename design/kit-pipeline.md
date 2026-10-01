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

## Tier 2 — Component Ports

Tier 2 encompasses native component implementations in other frontend ecosystems. Unlike token files, component ports require explicit translation of component lifecycle, slot mechanics, keyboard navigation models, and ARIA contracts.

### Active Component Packages

1. **React (`@tti/tti-ux-react`)**:
   - Native React 18/19 components, TypeScript interfaces, and Tailwind wrappers.
   - Comprehensive Vitest unit tests verifying DOM rendering and accessibility.
   - Documentation guide available at `/install/react`.

2. **.NET / Blazor (`Tti.Tux.AspNetCore` & `Tti.Tux.Blazor`)**:
   - Razor Tag Helpers and Blazor component library for C# enterprise services.
   - Full guide available at `/install/dotnet`.

3. **WordPress & Kadence (`tti-ux-core`)**:
   - Turnkey WordPress plugin providing Gutenberg block patterns and Kadence theme styling hooks.
   - Full guide available at `/install/wordpress`.

4. **Web Components (`@tti/tti-ux-elements`)**:
   - Framework-agnostic custom element custom bundle (`dist/tux-elements.js`) for embedding in legacy or arbitrary web stacks.

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
