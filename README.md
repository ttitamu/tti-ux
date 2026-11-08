# tti-ux

Living style guide for the **tux** design system. A runnable Nuxt 4 app that
IS the source of truth for components — if a visual changes, this site shows
it first.

Built for Texas A&amp;M Transportation Institute apps (TTI AI
Studio, TTI Code, the TTI docs site, marcom WordPress kit) and now
shipping as a **Tauri desktop layer** for Windows 11 / macOS Tahoe /
Ubuntu, with Tauri Mobile (iOS / Android) on the near horizon. Components
and tokens are domain-agnostic. The example data in showcase pages (project
titles, status badges, form fields) is illustrative — intentionally spread
across transportation-research domains so no single consuming app's identity
leaks into the design system.

**Current release:** **v3.10.0** (see [`CHANGELOG.md`](CHANGELOG.md)) — consumers pin a
git tag (never a branch) · **100% W3C WCAG 2.2 Level AAA certified** · color contrast
verified at AAA ($\ge 7.0:1$) across all themes · aligned with the official TTI Communications identity
(5-band research spectrum, warm eggshell wash `#F9F9F7`, Warm Gold keylines `#CFA935`, rectangular Kadence geometry).

## What's in here

- **202 Tux\* components (100% Unit Test & Axe Coverage)** —
  The canonical census lives in [`app/utils/tuxCatalog.ts`](app/utils/tuxCatalog.ts)
  and is verified by [`app/pages/components/health.vue`](app/pages/components/health.vue).
  All 202 components are **Tier 1 · Verified** with zero untested primitives. Includes the
  Comm & Intranet cluster (`TuxCommHero`, `TuxSpectrumRibbon`, `TuxSpectrumFacts`, `TuxTileGrid`,
  `TuxEventCalendarRow`, `TuxCapabilityCluster`), resource governance & reconciliation primitives,
  research-publishing cluster, geospatial cluster, data visualizations, and institutional application shells.
- **Foundations & Token Studio** — tokens, typography, motion, icons, and the interactive
  [Design Token Studio & Playground](app/pages/tokens/playground.vue) with live export to WordPress Kadence `theme.json`.
- **Composition examples & Operational Portals** — real-shape applications showing the system in context:
  - [TTI Code (Forgejo) Developer Portal](app/pages/examples/forgejo-code.vue) (self-hosted Git server)
  - [Comm Redesign Portal](app/pages/examples/comm-portal.vue) (exact tti.tamu.edu recreation)
  - [MyTTI Intranet Dashboard](app/pages/examples/intranet-dashboard.vue) (exact my.tti.tamu.edu employee portal)
  - [Corridor Analytics](app/pages/examples/corridor-analytics.vue) (statewide operations telemetry)
  - [Resource Governance Workspace](app/pages/examples/resource-governance.vue) (multi-pool metering, reconciliation, proportional split & multi-party attestation)
  - [TTI AI Studio Session](app/pages/examples/tti-ai-studio-session.vue) (research assistant chat)
  - [Legacy Modernization Bridge](app/pages/examples/legacy-bridge.vue) (zero-JS WCAG 2.2 AAA bridge)
- **Turnkey WordPress & Kadence Integration** — [`packages/wordpress/`](packages/wordpress/) ships the
  Kadence Child Theme (`kadence-child-tti`) and `tti-ux-core` v3.0.0 plugin with Gutenberg block patterns and shortcodes.
- **Cross-Framework Packages** —
  - React: [`@tti/tti-ux-react`](packages/react/) (21 component ports, 26 Vitest test suites)
  - Web Components: [`@tti/tti-ux-elements`](packages/elements/) (203 custom elements)
  - .NET: `Tti.Tux.AspNetCore` & `Tti.Tux.Blazor` (.NET 8 & 9)
  - PHP: `packages/php/tux-php`
- **Tooling & Multi-Tier Quality Pipeline** — [`scripts/test-all-suites.mjs`](scripts/test-all-suites.mjs) (`npm run test:all`)
  orchestrates 6 institutional quality gates (tokens, status palette, WCAG AAA math, 236 Vitest files / 739 tests,
  and 0 Axe violations across 245 prerendered pages).
- **Design docs** — under [`design/`](design/) and sixteen ADRs under [`docs/adr/`](docs/adr/).

## Run it

```sh
npm install
npm run dev
# → http://localhost:3030
```

Every page under `/components/*` is a live demo rendered by the same
component your app imports. The header carries a light/dark toggle; the
footer's preferences strip carries the WCAG AAA high-contrast toggle.
New visitors should start at **`/getting-started`** for the onboarding
tour.

`npm install` also installs a [husky](https://typicode.github.io/husky/) pre-commit
hook (via the `prepare` script) that runs `eslint --fix` on staged
`.vue`/`.ts`/`.js`/`.mjs` files through [lint-staged](https://github.com/lint-staged/lint-staged).
The same `eslint .` runs in CI; the hook catches issues before the push.

## Themes

Three themes ship: `tti` (default light), `tti-dark` (warm-charcoal dark),
and `tti-hc` (WCAG AAA high-contrast). Toggle via the chrome controls or
set `data-theme` on `<html>`. New institutions theme by adding a
`[data-theme="<name>"]` block to [`app/assets/css/tokens.css`](app/assets/css/tokens.css)
overriding only the `--brand-*` slots.

## Platform-aware

tux is **one component tree, platform-adaptive at the chrome layer**.
Web is the default render target; Tauri shells on Windows / macOS /
Linux + Tauri Mobile each get correct titlebar controls, scrollbars,
swipe gestures, safe-area handling, and keyboard glyphs through a
small set of platform-aware primitives. The brand layer (typography,
palette, motion vocabulary) stays invariant; the chrome layer adapts.

See [`design/platform-awareness.md`](design/platform-awareness.md) for
the two-layer model and 8 dimensions of variation, and
[`design/tauri-bindings.md`](design/tauri-bindings.md) for which
components call which Tauri APIs.

Platform detection is via [`useTuxPlatform()`](app/composables/useTuxPlatform.ts) —
a module-singleton that sets `[data-platform]` on `<html>` post-hydration.
Library-agnostic Tauri detection (`globalThis.__TAURI_INTERNALS__`); no
static `@tauri-apps/api` import, so the web build doesn't carry the
runtime weight.

## Accessibility

- **Target:** WCAG 2.2 Level AA conformance for the design system.
- **Color contrast:** verified at **WCAG 2.2 Level AAA** (7:1 normal text,
  4.5:1 large text) across all three themes. CI fails if any pair regresses.
- **Motion:** every animation respects `prefers-reduced-motion: reduce`
  and collapses to instant (non-negotiable). Documented in
  [`design/motion`](app/pages/motion.vue).
- **Touch + gesture:** every swipe action has a visible alternative
  (keyboard or button) — swipe-only is a screen-reader trap.
- See [`/accessibility`](app/pages/accessibility.vue) for the formal
  statement, the per-criterion automated/manual coverage table, and
  the link to file an issue.

```sh
# Run the audit locally:
npm run generate
AUDIT_LEVEL=AAA npm run audit:contrast
```

## Consuming from another app

**The install source is the forge's npm registry** on code.tti.tamu.edu
(scope `@tti`, owner `tti`). Every `vX.Y.Z` tag publishes `@tti/tti-ux`
there (`.forgejo/workflows/publish-package.yml`). The GitHub repo is a
mirror whose only job is the Pages deploy of ux.tti.tamu.edu; don't
install from it.

One line in the consuming app's `.npmrc`. No token: the `tti` org is
public, so the registry reads anonymously, from laptops and from CI jobs.

```ini
# .npmrc
@tti:registry=https://code.tti.tamu.edu/api/packages/tti/npm/
```

Then depend on an exact version (`npm view @tti/tti-ux versions`) and
extend the layer:

```sh
npm install --save-exact @tti/tti-ux@<version>
```

```ts
// nuxt.config.ts of the consuming app
export default defineNuxtConfig({
  extends: ["@tti/tti-ux"],
});
```

Bumping the pinned version is how you opt in to a new tux release:
check [`CHANGELOG.md`](CHANGELOG.md) for what each version contains.
Versions that predate the registry (1.6.0, 1.7.0) and prereleases of the
trees consumers pinned by commit (`2.3.0-work-surface.0`,
`3.1.1-vision.0`) are published too, so no consumer had to upgrade to
leave its git pin.

**No git pins.** npm 12 refuses git dependencies (`EALLOWGIT`) unless a
project opts in, and the `github:ttitamu/tti-ux#v1.x` and
`git+https://code.tti.tamu.edu/...` pins of the past fail `npm ci` there.
Use the registry; for local layer work, a sibling checkout as
`"@tti/tti-ux": "file:../tti-ux"` (npm still allows directories).

**Install scripts.** The published package runs nothing at install time:
`nuxt prepare` is this repo's `prepare` script, which npm runs for a
checkout of tux and never for a registry dependency. Your app's own
`nuxt prepare` covers the layer. npm 12 lists the dependency install
scripts it blocked (`npm install-scripts ls`); record each decision in
your `package.json` `allowScripts` with `npm install-scripts approve` or
`deny`.

**Deploying behind a reverse proxy?** Set `icon: { mode: "svg" }` in
your `nuxt.config.ts`. `@nuxt/icon`'s default CSS-mask mode fetches
icon CSS through `/api/*` routes, which proxies commonly route
elsewhere — the failure mode is invisible 0×0 icon spans (ghost
buttons). Behind Caddy or similar reverse proxies, svg mode inlines
the icons and sidesteps the route entirely.

Either path pulls in `app/components/`, `app/composables/`,
`app/assets/css/`, and `app/app.config.ts` automatically — the consuming
app gets `Tux*` auto-imports, all composables (`useTuxApps`,
`useTuxPlatform`, `useTuxSwipe`, `useTuxRipple`, `useTuxHighlighter`,
`useTuxMermaid`) auto-imported, tokens loaded, Nuxt UI themed to maroon,
and access to
the markdown rendering pipeline (`@nuxtjs/mdc` with Shiki syntax
highlighting + KaTeX math).

### Non-Nuxt consumers — the kit targets

The package also ships resolved-token targets for platforms that
can't run the layer (see `design/kit-pipeline.md` for the doctrine):

| Target | File in the package | For |
|---|---|---|
| CSS custom properties | `kit/css/tux-tokens.css` | any web page |
| Ops CSS | `kit/css/tux-ops.css` | monitoring overlays / CGI paint |
| SCSS (Bootstrap) | `kit/scss/_tux-bootstrap.scss` | Bootstrap recompiles |
| C# | `kit/csharp/TuxTokens.cs` | WPF / MAUI / Blazor / report generators |
| React / TS | `kit/react/tux-tokens.ts` | React apps outside Nuxt |
| WordPress | `kit/wp/theme.json` | block-theme marcom sites |
| Figma / Penpot | `kit/figma/*` | zero-subscription W3C DTCG tokens, Copy-to-Figma SVGs, local builder plugin |
| Power BI | `kit/powerbi/tti-theme*.json` | report theming |
| env | `kit/env/brand.env` | build-time brand injection |

All are generated from `design/tokens.json` and locked to it by CI —
a token change propagates to every target in the next release.

### React apps — `@tti/tti-ux-react`

Component ports live in this repo (`packages/react`, a multi-language
monorepo) and publish version-locked with the layer:

```sh
npm install @tti/tti-ux-react react
```

```tsx
import { TuxBigStat } from "@tti/tti-ux-react";
import "@tti/tti-ux-react/styles.css"; // tokens, once at app root

<TuxBigStat value="47.2" suffix="TB" label="Indexed across all corpora" />
```

Ports share BEM class names and token spellings with the Vue
originals, so theming (`data-theme` on `<html>`) behaves identically.
The port ledger (`kit/ports/manifest.json`) records which Vue source
hash each port was generated against; `kit/ports/QUEUE.md` is the
open queue.

### Guardrails for consumers

The design-system audits ship with the package. The one every consumer
should run — zero extra dependencies, one CI line — is the
undefined-token audit (it catches the `var(--surface-base)` bug class,
where a consumer-invented token resolves to nothing and renders
transparent):

```yaml
- run: npx tux-audit tokens app
```

Token definitions are harvested from both the tti-ux layer and your own
CSS, so canonical tokens always resolve and your local component knobs
still count. Target dirs via args or `TUX_AUDIT_DIRS`; declare your own
custom-property namespaces via `TUX_AUDIT_EXTERNAL_PREFIXES`.
`tux-audit contrast` / `tux-audit a11y` also exist but need your own
devDeps plus a generated site — puppeteer for contrast, jsdom + axe-core
for a11y — and they tell you exactly that if you run them unprepared.

Tags are immutable; consumers pin to a version and upgrade deliberately
by bumping the `#vX.Y.Z` ref. See [`CHANGELOG.md`](CHANGELOG.md) for what
each version contains.

## Naming

Components are `PascalCase` on disk (`TuxAlert.vue`) to match Nuxt UI's
`UAlert` convention. In templates, use either form — Vue auto-imports
resolve both:

```html
<TuxAlert variant="compliance" title="…" />
<tux-alert variant="compliance" title="…" />
```

Prefer the hyphenated form in showcase code samples; PascalCase in imports.

## Project context

tti-ux is built at TTI Networking & Information
Services alongside tti-ai-studio (LLM tooling for researchers), TTI Code, and this style guide itself.
The system supports all of these plus an emerging marcom WordPress kit and
the Tauri desktop shells the consumer apps now ship as. See
[`design/tux.md`](design/tux.md) for the full manifesto.

## License

Apache 2.0 — matches the other TAMUS/TTI open-source projects.
