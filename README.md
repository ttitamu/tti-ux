# tti-ux

Living style guide for the **tux** design system. A runnable Nuxt 4 app that
IS the source of truth for components — if a visual changes, this site shows
it first.

Built for Texas A&amp;M Transportation Institute apps (Landscape, TTI AI
Studio, TTI Code, the TTI docs site, marcom WordPress kit) and now
shipping as a **Tauri desktop layer** for Windows 11 / macOS Tahoe /
Ubuntu, with Tauri Mobile (iOS / Android) on the near horizon. Components
and tokens are domain-agnostic. The example data in showcase pages (project
titles, status badges, form fields) is illustrative — intentionally spread
across transportation-research domains so no single consuming app's identity
leaks into the design system.

**Current release:** see [`CHANGELOG.md`](CHANGELOG.md) — consumers pin a
git tag (never a branch) · WCAG 2.2 AA conformance · color contrast
verified at AAA across all three themes (light, dark, high-contrast) ·
platform-adaptive at the chrome layer (web + Tauri desktop + Tauri mobile).

## What's in here

- **140+ Tux\* components + 6 composables** (the exact census lives in
  [`app/utils/tuxCatalog.ts`](app/utils/tuxCatalog.ts), enforced against
  the filesystem by `tests/tux-catalog.test.ts`) under
  [`app/components/`](app/components/) and
  [`app/composables/`](app/composables/) — alerts, badges, accordions,
  the editorial page header, chart family (line / bar / area / scatter /
  donut / gauge / geographic / sunburst / sparkline), research-publishing
  cluster (abstract / author byline / paper meta / footnote / citation
  export), TTI identity cluster (researcher / lab / program / funding
  source / center badge), geospatial cluster (map embed / legend /
  marker / corridor strip), forms wrapper cluster (form field / markdown
  editor / file dropzone / validation summary / confirm dialog), Tauri
  app-shell primitives (app frame / menu bar / splash screen / tab bar /
  FAB / focus view), the unified institutional footer, the doc-site
  sidebar + TOC, the prose wrapper for long-form markdown, table, tree,
  treemap, the keyboard-shortcut overlay, the edge-anchored slide-over,
  and the rest of the catalog. All demoed at `/components/<kebab-name>`
  (tightly-coupled clusters share a single route under
  `/components/<family-name>`).
- **Foundations** — tokens, typography, motion, icons, the three
  style variants. Pages under `/tokens`, `/typography`, etc.
- **Composition examples** — six real-shape pages showing the system in
  context: a [Landscape dashboard](app/pages/examples/landscape-dashboard.vue),
  a [research-program landing](app/pages/examples/research-landing.vue),
  a [tti-ai-studio session](app/pages/examples/tti-ai-studio-session.vue),
  a [research paper](app/pages/examples/paper-page.vue), a
  [TTI center landing](app/pages/examples/center-landing.vue), and the
  [sidebar shell](app/pages/examples/sidebar-shell.vue).
- **Tooling** — [`/contrast-audit`](app/pages/contrast-audit.vue) renders
  every contrast-risk surface in three themed columns side-by-side;
  [`/accessibility`](app/pages/accessibility.vue) carries the formal
  conformance statement; [`scripts/audit-contrast.mjs`](scripts/audit-contrast.mjs)
  is the puppeteer-based WCAG ratio checker that gates CI.
- **Framework-neutral kit** — [`kit/`](kit/) ships the generated
  [`kit/css/tux-tokens.css`](kit/css/tux-tokens.css) token drop and the
  Bootstrap 4 re-skin for non-Vue consumers (WordPress, RIMS, BIMS,
  Forgejo overlays), CDN-served via jsDelivr at a pinned tag. See
  [`kit/README.md`](kit/README.md).
- **Design docs** — under [`design/`](design/):
  [`tux.md`](design/tux.md) (manifesto),
  [`unification-plan.md`](design/unification-plan.md) (the suite
  unification doctrine — one chrome, many voices),
  [`components.md`](design/components.md) (doctrine + pattern coverage map),
  [`compositions.md`](design/compositions.md) (composability doctrine),
  [`palette.md`](design/palette.md) (visual identity),
  [`roadmap.md`](design/roadmap.md),
  [`chart-foundations.md`](design/chart-foundations.md),
  [`platform-awareness.md`](design/platform-awareness.md) (Tauri /
  multi-platform doctrine),
  [`tauri-bindings.md`](design/tauri-bindings.md) (Tauri API surface
  per component),
  [`visual-language-evolution.md`](design/visual-language-evolution.md),
  plus the canonical [`tokens.json`](design/tokens.json) source and the
  [`apps.json`](design/apps.json) TTI Portals registry. Twelve ADRs
  under [`docs/adr/`](docs/adr/) record architectural decisions.

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

**The canonical install source is the Forgejo npm registry** on
code.tti.tamu.edu — every `vX.Y.Z` tag publishes `@tti/tti-ux`
automatically. (The GitHub repo is a mirror whose only job is the
GitHub Pages deploy of ux.tti.tamu.edu; don't install from it.)

One-time setup in the consuming app (or your `~/.npmrc`):

```ini
# .npmrc
@tti:registry=https://code.tti.tamu.edu/api/packages/tti/npm/
```

(If the repo/package isn't public to you, add
`//code.tti.tamu.edu/api/packages/tti/npm/:_authToken=<your token>`.)

Then depend on a pinned version and extend the layer:

```sh
npm install @tti/tti-ux@2.0.0
```

```ts
// nuxt.config.ts of the consuming app
export default defineNuxtConfig({
  extends: ["@tti/tti-ux"],
});
```

Bumping the pinned version is how you opt in to a new tux release —
check [`CHANGELOG.md`](CHANGELOG.md) for what each version contains.

For local dev with a sibling checkout, swap to a file URL:
`"@tti/tti-ux": "file:../tti-ux"`. A direct git pin also works on
the internal network:
`"@tti/tti-ux": "git+https://code.tti.tamu.edu/tti/tti-ux.git#v2.0.0"`.
(Legacy consumers pinned to `github:ttitamu/tti-ux#v1.x` keep
working, but new pins should not use the mirror.)

**Deploying behind a reverse proxy?** Set `icon: { mode: "svg" }` in
your `nuxt.config.ts`. `@nuxt/icon`'s default CSS-mask mode fetches
icon CSS through `/api/*` routes, which proxies commonly route
elsewhere — the failure mode is invisible 0×0 icon spans (ghost
buttons). Landscape hit exactly this behind Caddy; svg mode inlines
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
| SCSS (Bootstrap) | `kit/scss/_tux-bootstrap.scss` | Bootstrap recompiles |
| C# | `kit/csharp/TuxTokens.cs` | WPF / MAUI / Blazor / report generators |
| React / TS | `kit/react/tux-tokens.ts` | React apps outside Nuxt |
| WordPress | `kit/wp/theme.json` | block-theme marcom sites |
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

tti-ux is one of three concurrent products at TTI Networking & Information
Services: Landscape (sensitive-data classifier),
tti-ai-studio (LLM tooling for researchers), and this style guide itself.
The system supports all three plus an emerging marcom WordPress kit and
the Tauri desktop shells the consumer apps now ship as. See
[`design/tux.md`](design/tux.md) for the full manifesto.

## License

Apache 2.0 — matches Landscape and the other TAMUS/TTI open-source projects.
