# AggieUX reference

Snapshots of the [AggieUX](https://aux.tamu.edu/) design system, pulled from
the Texas A&M public CDN at `aux.tamu.edu`. **Not loaded at runtime** — these
files exist only as reference for cherry-picking patterns into `aggieux.css`
and the Tux\* components.

## What's here

```
reference/aggieux/v2.0.1/
  ├── aux-styles.css    (~523 KB — full system stylesheet)
  └── aux-script.js     (~21 KB — component behaviors; upstream name is aux.js)
```

> **Note on the JS filename.** Upstream ships the file as `aux.js`, but `AUX`
> is a reserved device name on Windows — git-for-windows refuses to index
> it. The sync script renames on download; when referencing the upstream
> location, it's still `https://aux.tamu.edu/v2/2.0.1/js/aux.js`.

## Why not load them

Two reasons:

1. **Our tokens and AggieUX's would collide.** `tokens.css` defines
   `--brand-primary`, `--surface-page`, etc. AggieUX uses different variable
   names for similar concepts but also defines some of the same editorial
   utilities (`.heading--bold`, `.eyebrow`). Loading both would produce
   unpredictable cascade order.
2. **AggieUX is Aggie-branded (TAMU maroon + white + the Corps aesthetic),
   not TTI-branded.** tti-ux deliberately borrows *editorial rhythm* — gold
   bars, ALL-CAPS eyebrows, the card corner-drop — not the full Aggie visual
   identity.

## Refresh

AggieUX updates at [aux.tamu.edu](https://aux.tamu.edu/). To pull the
current published version:

```sh
npm run sync:aggieux
```

That hits the CDN and overwrites the files under the current
`v{semver}/` directory. Bump the directory name when AggieUX ships a new
major version so the old snapshot stays around for diffing.

Current snapshot:

- **Source**: `https://aux.tamu.edu/v2/2.0.1/`
- **Pulled**: 2026-04-24
- **Upstream Last-Modified**: 2026-03-27

## How to use this

When you're writing a Tux component or extending `aggieux.css`:

1. Grep `aux-styles.css` for the pattern you're reaching for (e.g. `grep
   'card' aux-styles.css`).
2. Read the upstream implementation — note the variable names, selector
   structure, animation curves.
3. Reimplement in our system using our tokens. Don't just copy —
   AggieUX uses its own variable namespace and our `--brand-primary`
   won't resolve there.

If the pattern is too entangled with AggieUX's cascade to cleanly lift,
that's a signal to either simplify or leave it alone.
