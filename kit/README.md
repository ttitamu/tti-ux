# tux CSS kit

Framework-neutral, drop-in TTI brand styling for apps that **aren't** (yet) on
Nuxt/Vue. This is the "dogfood the visuals" layer from
[ADR-0012](../docs/adr/0012-cross-framework-distribution-via-web-components.md):
add a `<link>` or two and an existing app takes on the TTI look with **no markup
changes**, so a later re-platform to Vue/Nuxt is visually invisible.

Everything here is **generated** from [`design/tokens.json`](../design/tokens.json)
via `npm run build:tokens` — the single source of truth. Don't hand-edit
generated files (`css/tux-tokens.css`, `scss/_tux-bootstrap.scss`).

## What's here

| File | What it is |
|---|---|
| `css/tux-tokens.css` | All tux design tokens as CSS custom properties, for all three themes (`tti`, `tti-dark`, `tti-hc`). Generated. |
| `css/tux-bootstrap.css` | A **Bootstrap 4 re-skin** that maps Bootstrap's class API onto the tux tokens. Theme-reactive. |
| `scss/_tux-bootstrap.scss` | Bootstrap 4 SCSS `$variable` overrides (tti light literals) for apps that **recompile** Bootstrap. Generated. |
| `env/brand.env` | Flat resolved `TUX_<THEME>_<GROUP>_<TOKEN>=#hex` pairs for **shell / Go-template / Python** consumers (Forgejo overlay `apply-branding.sh`, compose-stack `make brand` fan-outs). Generated (`npm run build:brand-env`) with atomic-rename fail-safety. |
| `powerbi/tti-theme.json` + `powerbi/tti-theme-dark.json` | **Power BI report themes** — 10-series dataColors from the chart ramp, tux fonts, theme-invariant brand block. Generated (`npm run build:powerbi`); the reporting repo re-vendors at a pinned tag. |
| `demo/bootstrap.html` | A self-contained demo: stock Bootstrap 4 + the two kit links, with a theme switcher. |

## Which artifact for which consumer

| Consumer shape | Artifact | Mechanism |
|---|---|---|
| Vue/Nuxt product | the Nuxt layer itself | `extends: ["github:ttitamu/tti-ux#vX.Y.Z"]` |
| Any web app with its own CSS (Forgejo overlay pages, static sites, WordPress) | `css/tux-tokens.css` | `<link>` from jsDelivr at a pinned tag, or vendor verbatim with the source ref in a comment |
| Bootstrap 4 apps (RIMS, BIMS) | `css/tux-tokens.css` + `css/tux-bootstrap.css` | see below |
| Shell / Go templates / Python theming scripts | `env/brand.env` | `source` it / parse KEY=value; re-vendor at pin-bump |
| Power BI / Fabric reports | `powerbi/*.json` | import as report theme; re-vendor at pin-bump |

All five are generated from `design/tokens.json` — the same anchors, ramps,
and semantic decisions everywhere. CDN base:
`https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@<tag>/kit/…`

## Token naming — rename, don't alias

Consumers never rename tokens: vendor `css/tux-tokens.css` verbatim and
reference the canonical names. A private prefix layer (`--tux-*`,
`--tamu-*`, `--bg`/`--panel` namespaces) means hand-mapping on every
re-vendor — the exact drift class this kit exists to end. If your app
already invented names, migrate them:

| Invented name (seen in the wild) | Canonical token |
|---|---|
| `--surface-base`, `--surface`, `--surface-default`, `--bg` | `--surface-page` |
| `--panel` | `--surface-raised` |
| `--text-default`, `--text` | `--text-primary` |
| `--muted` | `--text-muted` |
| `--line`, `--border-muted` | `--surface-border` |
| `--border-subtle` | `--surface-border-subtle` *(canonical since v1.8.0)* |
| `--danger`, `--color-destructive`, `--intent-danger` | `--color-danger` (brand-aligned) or `--color-error` (true-red failure) |
| `--status-info` / `--status-success` / `--status-warn` / `--status-error` | `--color-info` / `--color-success` / `--color-warning` / `--color-error` |
| `--tux-on-brand`, hardcoded `#fff` on maroon | `--text-on-brand` *(canonical since v1.8.0)* |
| `--primary`, `--accent` | `--brand-primary`, `--brand-accent` |

**The on-brand rule.** Content sitting on an always-maroon surface
(masthead, footer, CTA panel) uses `background: var(--brand-fill)` +
`color: var(--text-on-brand)` — both theme-invariant. Never
`--text-inverse` (it flips dark in dark mode → dark-on-maroon) and never
`--brand-primary` as a fill (it lifts to a light accent in dark mode →
white text at ~2.4:1). This pair is contrast-gated in CI across all
three themes.

## Use it — Bootstrap 4 apps (RIMS, BIMS, …)

**Drop-in, no rebuild** (recommended to start). Load the kit *after* your stock
Bootstrap stylesheet:

```html
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@<tag>/kit/css/tux-tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@<tag>/kit/css/tux-bootstrap.css">
```

Switch themes by setting `data-theme="tti" | "tti-dark" | "tti-hc"` on `<html>`.
Buttons, navbars, forms, alerts, badges, tables, pagination, etc. re-skin
automatically and stay readable in every theme (on-accent text uses the
theme-flipping `--text-inverse`; filled brand panels use the always-dark
`--brand-fill`).

**Recompile path** (cleaner output, if you build Bootstrap from SCSS):

```scss
@import "tux-bootstrap";              // scss/_tux-bootstrap.scss
@import "bootstrap/scss/bootstrap";   // Bootstrap 4 source
```

## Use it — any app (just the tokens)

Load `css/tux-tokens.css` and consume the custom properties directly:
`var(--brand-primary)`, `var(--surface-page)`, `var(--text-primary)`, etc.

## CDN

`cdn.jsdelivr.net/gh/ttitamu/tti-ux@<tag>/kit/<path>` serves these straight from
the repo at a pinned tag — no npm install required (ideal for the WordPress
fleet). Pin a tag; bump deliberately.
