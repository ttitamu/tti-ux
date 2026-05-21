# UI Kit — tux (PECAN)

High-fidelity React recreation of the tti-ux component family, demonstrated inside a mocked PECAN (the institute's internal sensitive-data classifier) shell. This is not the production Nuxt app — it is a static click-through built to mirror visual decisions 1:1 so design work can compose real screens without pulling in the Nuxt UI runtime.

## Files

| File | Purpose |
|---|---|
| `index.html` | Mounts the app. Use as the canonical "what the product looks like" view. |
| `TuxComponents.jsx` | Ported components: `TuxSectionHeader`, `TuxPageHeader`, `TuxButton`, `TuxBadge`, `TuxCard`, `TuxAlert`, `LucideIcon`. |
| `AppShell.jsx` | `Sidebar` + `TopBar` chrome. |
| `Pages.jsx` | `OverviewPage`, `ScansPage`, `NewScanPage`, `ClassifiersPage`. |

## What's exercised

- **Sidebar nav** — Overview, Scans, Classifiers, Indices, Settings. Active state uses a 3px maroon left-bar + tinted background.
- **Top bar** — breadcrumb-style route label + JetBrains-Mono search input.
- **Overview** — stats grid, `compliance` alert (solid maroon), section header with gold-bar rule, recent-activity table with status/tier badges, tool cards with corner-drop hover.
- **Scans** — pill filter row, full table with classifier tag chips.
- **New scan** — two-column form with checkbox classifier list + warning/important alert pair.
- **Classifiers** — catalog cards; drifting classifier gets the 2px maroon accent border.

## What's cut

- No real Nuxt UI runtime; `UTable`/`UBadge`/`UAlert` are re-implemented from scratch to match visuals.
- No router; `useState("route")` switches views.
- No data layer; all values are hardcoded to read as a plausible snapshot.
- Indices + Settings pages are stubs — the ported components already cover their likely building blocks.

## Deviation notes

- Lucide icons are hand-drawn SVGs (tiny subset, stroked); the real app uses `@nuxt/icon`'s Lucide set. The stroke weight (1.75) matches Lucide defaults.
- The logo at `../../assets/logo.svg` is the placeholder mark flagged in the root README.
