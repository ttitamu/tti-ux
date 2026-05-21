# figma-cache scripts

Sync the "Figs" Figma project (`603237365`) into this cache. Idempotent,
sequential, rate-limit-aware.

## Files

- `sync.py` — fetches missing file structures + cover thumbnails, writes
  stub `NOTES.md` per file. Skips files that already have a fleshed-out
  inventory unless you pass `--force`.
- `rebuild-index.py` — reads on-disk state to regenerate the top-level
  `INDEX.md`. No API calls; safe to run any time.

## Requirements

- Python 3.9+ (uses only stdlib)
- `~/.figma_token` with a Figma personal access token (perm 600).
  Required scopes: `File content > Read`, `Library content > Read`.

## Usage

```sh
# Sync any files missing data (default):
python3 sync.py

# Re-fetch the project listing (e.g. after adding files in Figma):
python3 sync.py --refresh-list

# Overwrite all stubs (DESTRUCTIVE — only use if you haven't fleshed
# out any NOTES.md yet):
python3 sync.py --force

# Sync, then rebuild INDEX.md in one pass:
python3 sync.py --rebuild-index

# Rebuild only:
python3 rebuild-index.py
```

## Rate-limit notes

Figma's REST API throttles aggressively above ~3 req/s; parallelizing
trips HTTP 429 immediately. `sync.py` runs sequentially with a 1.5s
floor between requests and exponential backoff on 429 (30s, 60s, …).
Expect ~3–4 minutes to sync all 70 files from cold cache.

## Convention reminder

Each cached file lives in `reference/figma-cache/<slug>/` containing:

- `NOTES.md` — page inventory + Skip / Absorb / Tension / Decisions
- `cover.png` — representative frame at 0.25× scale
- `<page-slug>/NOTES.md` + frame renders — per-page deep dives (added
  by hand as we absorb specific pages)

Edit the `HIGH` / `MED` sets at the top of both scripts when you
re-triage. The priority column on `INDEX.md` re-renders from those
sets each time `rebuild-index.py` runs.
