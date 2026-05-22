# tti-ux

Living style guide for the **tux** design system. A runnable Nuxt 4 app that
IS the source of truth for components — if a visual changes, this site shows
it first.

Built for Texas A&amp;M Transportation Institute apps (Landscape — formerly
PECAN — tti-ai-studio, the TTI docs site, marcom WordPress kit) and now
shipping as a **Tauri desktop layer** for Windows 11 / macOS Tahoe /
Ubuntu, with Tauri Mobile (iOS / Android) on the near horizon. Components
and tokens are domain-agnostic. The example data in showcase pages (project
titles, status badges, form fields) is illustrative — intentionally spread
across transportation-research domains so no single consuming app's identity
leaks into the design system.

**Current release:** v1.4.2 · WCAG 2.2 AA conformance · color contrast
verified at AAA across all three themes (light, dark, high-contrast) ·
platform-adaptive at the chrome layer (web + Tauri desktop + Tauri mobile).

## What's in here

- **~130 Tux\* components + 5 composables** under
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
- **Design docs** — ten files under [`design/`](design/):
  [`tux.md`](design/tux.md) (manifesto),
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
  plus the canonical [`tokens.json`](design/tokens.json) source. Ten
  ADRs under [`docs/adr/`](docs/adr/) record architectural decisions.

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

Pin to a tagged release straight from GitHub — no npm registry needed.
Bumping the consumer's pin is how you opt in to a new tux version:

```ts
// nuxt.config.ts of the consuming app
export default defineNuxtConfig({
  extends: ["github:ttitamu/tti-ux#v1.4.2"],
});
```

Or if you'd rather see it in `package.json`:

```jsonc
{
  "dependencies": {
    "tti-ux": "github:ttitamu/tti-ux#v1.4.2"
  }
}
```

For local dev with a sibling checkout, swap to a file URL:
`"tti-ux": "file:../tti-ux"`.

Either path pulls in `app/components/`, `app/composables/`,
`app/assets/css/`, and `app/app.config.ts` automatically — the consuming
app gets `Tux*` auto-imports, all composables (`useTuxPlatform`,
`useTuxSwipe`, `useTuxRipple`, `useTuxHighlighter`, `useTuxMermaid`)
auto-imported, tokens loaded, Nuxt UI themed to maroon, and access to
the markdown rendering pipeline (`@nuxtjs/mdc` with Shiki syntax
highlighting + KaTeX math).

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
Services: Landscape (sensitive-data classifier; previously named PECAN),
tti-ai-studio (LLM tooling for researchers), and this style guide itself.
The system supports all three plus an emerging marcom WordPress kit and
the Tauri desktop shells the consumer apps now ship as. See
[`design/tux.md`](design/tux.md) for the full manifesto.

## License

Apache 2.0 — matches Landscape and the other TAMUS/TTI open-source projects.
