# UI Kit — tti-docs

The living style guide itself, rebuilt as a static React artifact. This is what a consumer of tti-ux sees when they go to browse tokens, typography, and components. It's the editorial counterpoint to the PECAN and tti-ai-chat app kits — same design language, different surface.

## Files

| File | Purpose |
|---|---|
| `index.html` | Mount + client router (simple useState-based). |
| `TuxComponents.jsx` | Shared tux primitives (copied from `ui_kits/pecan/`). |
| `DocsChrome.jsx` | `DocsHeader` (sticky nav + search) and `DocsFooter` (4-column editorial footer with HC toggle). |
| `Pages.jsx` | `HomePage`, `FoundationsPage`, `TokensPage`, `TypographyPage`, `MotionPage`, `ComponentsPage`, plus the signature `BigStat` component. |

## What's exercised

- **Home** — display-italic hero, 3-column foundations card grid, 9-tile component catalog, and the institutional BigStat block ($126M · annual research expenditure) that anchors TTI's voice.
- **Foundations** — numbered 01/02/03 row list linking to Tokens, Typography, Motion. This layout is the "read these first" rhythm from the docs.
- **Tokens** — three TokenTables (brand, surfaces, status) with swatches + hex + role columns.
- **Typography** — three heading specimens with utility class, metadata, and "when to use" notes; full 7-step body scale.
- **Motion** — live corner-drop card pair + motion tokens table.
- **Components** — catalog with the BigStat component at the top ("9 · Tux wrappers").

## High-contrast toggle

The footer has a WCAG AAA toggle that flips `data-theme="tti"` → `"tti-hc"` on `<html>`. The whole doc re-renders against the 508-accessible palette (deeper maroon, deeper gold, unchanged neutrals).

## What's cut

- No actual router — `useState("route")` switches pages. `window.scrollTo` is called on nav to simulate routing.
- Individual component detail pages (Button, Card, Alert, etc.) aren't built out — `ComponentCard` clicks all route to the catalog page.
- Search ⌘K is visual only.
- The "Repo" link goes to the source repo but otherwise no external navigation works.
