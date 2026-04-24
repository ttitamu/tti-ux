# Logo source PNGs

The original Copilot-generated tuxedo logos, 1024×1024 RGBA with
transparent backgrounds. Kept here as source material so the SVG traces
in `public/` can be regenerated with different potrace settings if the
current output ever needs tweaking.

## Files

- `logo.png` — maroon tuxedo, for light/high-contrast themes
- `logo-dark.png` — white tuxedo, for dark theme

## Regenerate the SVGs

```sh
npm run build:logos
# or: node scripts/png-to-svg-logo.mjs
```

Tuning lives in `scripts/png-to-svg-logo.mjs` under `POTRACE_OPTS`. The
ones most likely to matter:

- **`threshold`** — binary cutoff (0–255). Default 128. Irrelevant here
  because we pre-process to pure black/white via the alpha channel.
- **`alphaMax`** — corner smoothness. Current 0.4 preserves sharp
  tuxedo-lapel corners. Bump to 1.0 for more rounded curves.
- **`turdSize`** — minimum detected feature size. Current 2 kills
  single-pixel noise. Bump to ~8 for coarser output.
- **`optTolerance`** — curve-merging aggressiveness. Current 0.2 is
  faithful to the source; 0.5+ simplifies paths at the cost of detail.

## Why not keep PNGs in `public/`?

Two reasons:

1. `public/` files ship to every visitor. The PNGs are ~2MB combined;
   the traced SVGs are ~9KB combined. Serving the PNGs would have been
   ~220× larger than necessary.
2. Sources belong with sources. Everything under `reference/` is vendored
   upstream material we don't serve at runtime — AggieUX CSS, AggieUX
   icons, and now these.
