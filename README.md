# tti-ux

Living style guide for the TTI design system. A runnable Nuxt 4 app that IS the
source of truth for components — if a visual changes, this site shows it first.

Built for Texas A&amp;M Transportation Institute apps (PECAN, tti-ai-chat, the
TTI docs site, Aggie BI, etc.) but the components and tokens are domain-
agnostic. Example data in the showcase pages (project titles, status badges,
form fields) is illustrative — intentionally spread across
transportation-research domains so no single consuming app's identity leaks
into the design system.

## What's in here

- **Tokens** — TTI maroon + gold, semantic surfaces/text roles, the maroon
  ramp anchoring `color="primary"` in Nuxt UI. See `app/assets/css/tokens.css`.
- **Typography utilities** — `heading--bold`, `heading--display`, `eyebrow`,
  `subhead`, `link-tti`. See `app/assets/css/globals.css`.
- **Five Tux\* components** wrapping Nuxt UI primitives:
  - `TuxAlert` (wraps `UAlert`) — 8 admonition variants incl. compliance
  - `TuxBadge` (wraps `UBadge`) — tiers, statuses, tags, counts
  - `TuxCard` (aggieux native) — static or linked with corner-drop hover
  - `TuxModal` (wraps `UModal`) — eyebrow + gold-bar title
  - `TuxTable` (wraps `UTable`) — maroon header, auto status cells
- **Design docs** — `design/` carries `aggieux.md`, `components.md`,
  `palette.md`, `tokens.json`.

## Run it

```sh
npm install
npm run dev
# open http://localhost:3000
```

Every page under `/components/*` is a live demo rendered by the same component
your app will import. The tokens page shows the full palette and redraws when
you flip the contrast toggle in the header.

## Consuming from another app (pre-npm-team)

Until an npm team is provisioned, downstream Nuxt apps can consume tti-ux
locally:

```jsonc
// package.json of the consuming app
{
  "dependencies": {
    "tti-ux": "file:../tti-ux"
  }
}
```

Then extend the Nuxt layer:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["tti-ux"],
});
```

This pulls in `app/components/`, `app/assets/css/`, and `app/app.config.ts`
automatically — the consuming app gets Tux\* auto-imports, tokens loaded,
and Nuxt UI themed to maroon.

## Theming

Two themes ship today: `tti` (default) and `tti-hc` (WCAG AAA high-contrast).
Toggle from the header or via `data-theme` on `<html>`. A true dark theme is
TODO — add a `[data-theme="tti-dark"]` block to `tokens.css` when it lands.

## Naming

Components are PascalCase on disk (`TuxAlert.vue`) to match Nuxt UI's `UAlert`
convention. In templates, use either form — Vue auto-imports resolve both:

```html
<TuxAlert variant="compliance" title="…" />
<tux-alert variant="compliance" title="…" />
```

Prefer the hyphenated form in showcase code samples; PascalCase in imports.

## License

Apache 2.0 — matches PECAN and the other TAMUS/TTI open-source projects.
