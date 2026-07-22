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
| `demo/bootstrap.html` | A self-contained demo: stock Bootstrap 4 + the two kit links, with a theme switcher. |

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
