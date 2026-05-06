# tti-ux

Living style guide for the **tux** design system. A runnable Nuxt 4 app that
IS the source of truth for components — if a visual changes, this site shows
it first.

Built for Texas A&amp;M Transportation Institute apps (PECAN, tti-ai-studio,
the TTI docs site, marcom WordPress kit) but the components and tokens are
domain-agnostic. The example data in showcase pages (project titles, status
badges, form fields) is illustrative — intentionally spread across
transportation-research domains so no single consuming app's identity leaks
into the design system.

**Current release:** v1.1.0 · WCAG 2.2 AA conformance · color contrast
verified at AAA across all three themes (light, dark, high-contrast).

## What's in here

- **~50 Tux\* components** under [`app/components/`](app/components/) —
  alerts, badges, accordions, breadcrumbs, buttons, cards, code blocks,
  diagrams (Mermaid), the unified institutional footer, the doc-site
  sidebar + TOC, the marketing-shape page header, table, treemap, and
  the rest of the catalog. All demoed at `/components/<kebab-name>`.
- **Foundations** — tokens, typography, motion, icons, the three
  style variants. Pages under `/tokens`, `/typography`, etc.
- **Composition examples** — three real-shape pages showing the system in
  context: a [PECAN dashboard](app/pages/examples/pecan-dashboard.vue), a
  [research-program landing](app/pages/examples/research-landing.vue), a
  [tti-ai-studio session](app/pages/examples/tti-ai-studio-session.vue).
- **Tooling** — [`/contrast-audit`](app/pages/contrast-audit.vue) renders
  every contrast-risk surface in three themed columns side-by-side;
  [`/accessibility`](app/pages/accessibility.vue) carries the formal
  conformance statement; [`scripts/audit-contrast.mjs`](scripts/audit-contrast.mjs)
  is the puppeteer-based WCAG ratio checker that gates CI.
- **Design docs** — [`design/tux.md`](design/tux.md) (manifesto),
  [`design/components.md`](design/components.md) (doctrine + pattern
  coverage map), [`design/palette.md`](design/palette.md) (visual
  identity), [`design/tokens.json`](design/tokens.json), and seven ADRs
  under [`docs/adr/`](docs/adr/).

## Run it

```sh
npm install
npm run dev
# → http://localhost:3030
```

Every page under `/components/*` is a live demo rendered by the same
component your app imports. The header carries a light/dark toggle; the
footer's preferences strip carries the WCAG AAA high-contrast toggle.

## Themes

Three themes ship: `tti` (default light), `tti-dark` (warm-charcoal dark),
and `tti-hc` (WCAG AAA high-contrast). Toggle via the chrome controls or
set `data-theme` on `<html>`. New institutions theme by adding a
`[data-theme="<name>"]` block to [`app/assets/css/tokens.css`](app/assets/css/tokens.css)
overriding only the `--brand-*` slots.

## Accessibility

- **Target:** WCAG 2.2 Level AA conformance for the design system.
- **Color contrast:** verified at **WCAG 2.2 Level AAA** (7:1 normal text,
  4.5:1 large text) across all three themes. CI fails if any pair regresses.
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
  extends: ["github:ttitamu/tti-ux#v1.1.0"],
});
```

Or if you'd rather see it in `package.json`:

```jsonc
{
  "dependencies": {
    "tti-ux": "github:ttitamu/tti-ux#v1.1.0"
  }
}
```

For local dev with a sibling checkout, swap to a file URL:
`"tti-ux": "file:../tti-ux"`.

Either path pulls in `app/components/`, `app/assets/css/`, and
`app/app.config.ts` automatically — the consuming app gets `Tux*`
auto-imports, tokens loaded, Nuxt UI themed to maroon, and access to the
markdown rendering pipeline (`@nuxtjs/mdc` with Shiki syntax highlighting).

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
Services: PECAN (sensitive-data classifier), tti-ai-studio (LLM tooling for
researchers), and this style guide itself. The system supports all three
plus an emerging marcom WordPress kit. See [`design/tux.md`](design/tux.md)
for the full manifesto.

## License

Apache 2.0 — matches PECAN and the other TAMUS/TTI open-source projects.
