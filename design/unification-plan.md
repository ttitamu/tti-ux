# Unification plan — one suite, one system

> **Status:** doctrine (2026-07-28, reconstructed + extended 2026-07-30).
> The cross-portal unification plan for the TTI product family —
> **Landscape** (landscape.tti.tamu.edu), **TTI Code**
> (code.tti.tamu.edu), the **TUX docs site**, and **TTI AI Studio**
> (Tauri desktop) — plus the satellite consumers (TTI docs platform,
> Power BI reporting, external collaboration stacks). The original v4
> plan document was authored in-session on 2026-07-28 and reviewed
> through seven lenses; this file is its permanent, public-safe home.
> Ratified decisions below are **law** unless a dated amendment
> supersedes them.
>
> Companion to [`compositions.md`](./compositions.md) §Suite chrome
> (how to build the chrome), [`components.md`](./components.md) (the
> catalog), and [`platform-awareness.md`](./platform-awareness.md)
> (per-platform chrome doctrine).

---

## Index

- [Why — the diagnosis](#why--the-diagnosis)
- [Ratified laws](#ratified-laws)
- [Distribution artifacts](#distribution-artifacts)
- [Guardrails](#guardrails)
- [Execution log](#execution-log)
- [Satellite workstreams](#satellite-workstreams)
- [Open owner decisions](#open-owner-decisions)

---

## Why — the diagnosis

A 2026-07 survey of every product in the estate reached one clear
conclusion: **the unification gap is adoption, enforcement, and
distribution — not component inventory.**

- tti-ux ships ~140 components; the two largest Vue consumers used
  7–11 of them, reaching past the system for raw Nuxt UI primitives,
  raw HTML elements, and hand-rolled equivalents of components that
  already exist.
- Non-Vue consumers (the Forgejo overlay, Power BI theming, external
  collaboration stacks) each independently invented a token
  translation layer and a hand-sync step — three parallel token
  vocabularies for one design system, with palettes drifting apart at
  every stop (`#500000` vs `#5C0025` anchors, stale ramps, dead
  `--tamu-*` names).
- Consumers invented semantic tokens the system never defined
  (`--surface-base`, `--text-default`, `--status-*`) — undefined
  references that render transparent, precisely the bug class
  `audit:tokens` exists to catch, but no consumer runs the audits.
- The system's own registries (sidebar nav, index grid, doctrine
  tables, homepage count) were four hand-maintained lists that
  disagreed with each other and with the filesystem.

So the plan invests in four things, in order: **doctrine written down**
(this file), **truthful self-description** (registry consolidation +
CI), **the missing 10%** (toast, layout primitives, semantic-token
gaps, upstream debt fixes), and **distribution + guardrails as
products** (the kit, brand.env, Power BI themes, `tux-audit`).

What it deliberately does *not* do: rebuild form controls, add
speculative components, or flatten per-product identity. The estate
does not need more parts; it needs the existing parts reachable,
enforced, and adopted.

---

## Ratified laws

### The two-shape identity rule (2026-07-28, user-confirmed)

Every portal's chrome fits one of exactly two shapes, and identity has
exactly one blessed home in each:

| Shell shape | Products | Waffle (app switcher) | Identity/account |
|---|---|---|---|
| **Site shape** — global top header | Landscape, TTI Code, TUX docs | Top-right, **second-from-last** | **Last** item, top-right (`TuxUserMenu placement="cluster"`) |
| **Workbench shape** — persistent left rail | TTI AI Studio | Titlebar, second-from-last | **Rail footer** (`TuxUserMenu placement="rail-footer"`) — the Copilot/Claude/ChatGPT genre convention |

There is **never a third home**. Component anatomy and menu content
order are identical in both mounts. The utility cluster's DOM order is
law-fixed: `search · notifications · theme · waffle · identity`
(`TuxUtilityCluster` enforces it).

### One chrome, many voices (2026-07-28)

The chrome band is **identical across portals** — same components,
same order, same behavior. Products differentiate through their
**wordmark** and content voice, never through chrome structure.

- Per-product accent colors are **deferred**; the `toneIndex`
  mechanism was **rejected** (chart colors are data colors; teal is
  triple-booked and off-limits as an accent).
- The replacement identity workstream is: product lockup spec +
  `TuxIdentity level="product"` + a status-chip grammar.

### Registry doctrine (2026-07-28, security-reviewed)

- [`design/apps.json`](./apps.json) is the **TTI Portals registry** —
  public tile metadata **only** (id, name, blurb, accessUrl,
  audience, discoverable, glyph). It is **baked at build/deploy time,
  never fetched at runtime**, and never served from a third-party CDN
  in a runtime path.
- **Entitlement mappings live server-side, per portal** (distributed
  "my-apps" resolvers sharing a mapping file). No central directory
  endpoint; no group identifiers in client-delivered artifacts —
  `tests/useTuxApps.test.ts` asserts the shipped registry contains
  none.
- Tile order is a pure function of the registry (spatial constancy —
  current app sorts in place, never last). Audience filtering:
  public / authenticated / entitled, Tier-0 fail-open; not-entitled
  portals that remain discoverable render a visible tile with a lock
  and a request-access affordance, never a dead-disabled tile.
- Behavior law (focus, same-tab default, "Desktop app" affix, heading
  "TTI Portals") lives in [`compositions.md`](./compositions.md)
  §Cross-app navigation — one home, not duplicated here.

### Web-component waffle: cut (2026-07-28, round-2 review)

The Forgejo (TTI Code) waffle is a **server-rendered Go-template
partial, permanently** — not the ADR-0012 web-component build. The WC
path stays justified for WordPress; it is the wrong tool for the forge
(payload size, light-DOM CSS collisions, NuxtLink/icon coverage).
`apps.json` public metadata is baked into the overlay at
apply-branding time from a pinned tti-ux ref.

### Desktop links: launcher interstitial, never raw scheme (2026-07-28)

Waffle tiles for the desktop app point at a **parameter-free launcher
page** (e.g. `/launch/ai-studio` on the forge), which fires the
registered URL scheme with a fixed route and offers an install
fallback. Raw `tti-ai-studio://` URLs never appear in tiles, and
launcher pages accept and forward **zero** query parameters.
Desktop-side, outbound navigation goes through an allowlisted opener
command (exact-host https allowlist), and the single-instance plugin
is a prerequisite for desktop tiles.

### Pinning + release discipline (2026-07-28)

- Consumers pin **immutable git tags**: `github:ttitamu/tti-ux#vX.Y.Z`
  (`extends` + `package.json` dependency, lockfile committed). Never
  a branch, never a sibling `file:` path in CI or production builds.
  `file:../tti-ux` is for local development only.
- npm publishing is reserved for the framework-neutral **kit** only.
- Estate CI verification is **unit tests + fixtures + container CI**
  (local Forgejo container for overlay changes; mocked dev servers for
  consumers) — not a live four-portal browser battery (Entra MFA and
  Tauri webviews make that battery brittle by construction).

### Theming laws

- Three shipped themes: `tti` (light), `tti-dark`, `tti-hc`
  (WCAG-AAA high contrast), applied via `data-theme` on `<html>`.
  High-contrast must remain reachable in every product (footer
  affordance per ADR-0006).
- **Fixed-brand surfaces** (always-maroon mastheads, footers, CTAs)
  must use theme-invariant on-brand text — never `--text-inverse`,
  which flips in dark mode. (Token lands as `--text-on-brand`,
  v1.8.0.)
- The canonical light anchor is **`#5C0025`** (`--tti-maroon`);
  `#500000` is the *high-contrast* theme's anchor and the legacy
  Aggie deep-maroon. Any consumer whose "light" palette anchors at
  `#500000` has vendored the wrong theme (this happened — see
  Satellite workstreams).
- Dark mode already reads as one family estate-wide; **light mode is
  where the visual-unification effort belongs**. The light-mode
  family signature (working proposal: editorial-white chrome + maroon
  wordmark + gold keyline + tracked eyebrow) awaits owner
  ratification — see Open decisions.

### Feel + native workstreams (2026-07-28, round-2 review)

- **Feel**: motion signature derives from the existing tempo tokens;
  a waffle coach-mark may appear on the second session (never the
  first); guided tours use a shared composable with the "last step is
  a verb" grammar; **Reveille appears only where a live assistant
  answers** — the mascot is never decorative chrome. Kitsch is
  written, never gamified onto people.
- **Native**: the menu-mirror law (native macOS menus mirror in-app
  commands — Settings ⌘,, mode switching, a Portals section); 52px
  macOS titlebar; banners render below the titlebar in Tauri;
  Windows snap-layouts are implemented, not asserted; DWM theme sync;
  window-state persistence; `presentation` prop reserved on
  `TuxAppSwitcher` for the sheet variant ahead of Tauri Mobile.

### Form controls: the hybrid doctrine (2026-07-30, owner-decided)

The estate's form drift (hundreds of raw `UButton`/`UInput` call
sites; raw `<button>` elements with bespoke CSS) is fixed by
**theming, not wrapping**:

- The layer's Nuxt UI theme is hardened (fonts, radii, focus rings,
  sizes, density via `app.config.ts` `ui.*`) so **`U*` controls are
  branded automatically in every consumer** at pin-bump.
- **No `TuxInput`/`TuxSelect` wrapper set ships.** `U*` is the
  blessed spelling for app controls. `TuxFormField` (label/help/error
  anatomy) stays; `TuxButton` is re-scoped as the **editorial**
  button (gold-bar signature, CTA contexts).
- Lint/guardrails target what is unambiguously wrong in any doctrine:
  raw `<button>`/`<input>` elements and hex literals — never `U*`.

This amends the earlier "form input → Nuxt UI native, no wrappers yet"
line in components.md with an explicit division of labor: Nuxt UI owns
behavior and a11y; the layer owns the brand.

---

## Distribution artifacts

One source of truth, four artifacts, each generated from
[`design/tokens.json`](./tokens.json) by `npm run build:tokens` and
siblings — hand-vendored hex is a defect everywhere:

| Artifact | Consumer shape | Path |
|---|---|---|
| Nuxt layer | Vue/Nuxt products | `extends: ["github:ttitamu/tti-ux#vX.Y.Z"]` |
| `kit/css/tux-tokens.css` | Any framework (link or vendor at a pinned tag) | `kit/css/` + jsDelivr CDN |
| `kit/env/brand.env` *(v1.8.0)* | Shell/Go/Python theming scripts (Forgejo overlay, compose stacks) | generated flat `KEY=#hex` |
| `kit/powerbi/*.json` *(v1.8.0)* | Power BI / Fabric report themes | generated light + dark |

Consumers never rename tokens. A translation prefix (`--tux-*`,
`--tamu-*`, private `--bg/--panel` namespaces) is a migration smell —
vendor the artifact verbatim and reference canonical names.

---

## Guardrails

- **In-repo**: lint, typecheck, unit tests (registry + catalog
  invariants), `audit:tokens` (every `var(--x)` resolves),
  `audit:a11y` (axe across all prerendered routes), `audit:contrast`
  (AAA across all three themes) — all blocking in CI.
- **For consumers** *(v1.8.0)*: `tux-audit tokens` ships as a bin —
  zero-dependency, catches the undefined-token bug class in any
  consumer's CSS in one CI line. Contrast/a11y audits delegate
  honestly (they need the consumer's own puppeteer/axe devDeps).
- **Known blind spot**: the audits check token pairs, not rendered
  compositions (a composition-level dark-mode failure once passed AAA
  CI). Composition visual regression is the ADR-0012 follow-up, not
  yet built.

---

## Execution log

| Date | Slice | What shipped |
|---|---|---|
| 2026-07-28 | Pre-flight | v1.6.1 — `TuxAppSwitcher` A2b semantic pre-flight (registry order, focusable current tile, list semantics, same-tab default) + `TuxSiteNav` focus-restoration fix (A2c) + dependency hygiene. Consumers moved from sibling-checkout `file:` deps to pinned git tags. |
| 2026-07-28 | v1.7.0 "suite chrome" | `design/apps.json` + `useTuxApps()` registry, `TuxUtilityCluster`, `TuxUserMenu` (cluster + rail-footer), registry-invariant unit tests, docs site dogfoods the cluster. |
| 2026-07-28 | B1 (Landscape) | One `LandscapeUtilityCluster` wrapper wires the cluster + identity + waffle; triplicated layout chrome deleted. **Two portals wear the family chrome** (docs site + Landscape). |
| 2026-07-28 | B3 handoff | AI Studio's unification work (allowlisted opener, titlebar waffle, rail-footer identity, single-instance) handed to its own dedicated workstream. One session per working tree. |
| 2026-07-30 | Plan reconstruction | This document committed; estate survey folded in; owner decisions #1–4 below resolved. v1.7.1: catalog single-source (`app/utils/tuxCatalog.ts` + invariant test), doc truth pass, tests wired into CI. |
| *(next)* | B2 (TTI Code) | Token consolidation onto the kit artifact, shell-fragment consolidation, server-rendered waffle partial, `/launch/ai-studio` interstitial, overlay integrity manifest, deploy-from-git-ref. **Three portals.** |
| *(next)* | v1.8.0 | `--text-on-brand` + `--border-subtle` + spacing scale + warning→gold, typography doctrine fix, `TuxStatusToast`, `TuxPageContainer`, `TuxAvatar`, Nuxt UI theme hardening, consumer-debt fixes (mega-menu cap, measured nav height, demo-route stripping, dark-bridge tolerance), kit shipped in package `files`, `brand.env` + Power BI artifacts, `tux-audit` bin. |
| *(later)* | v1.9.0 | `TuxKanban` family promotion (from AI Studio, re-implemented tokens-clean), lint-rule guardrails. |

---

## Satellite workstreams

Slices owned by other sessions/repos; listed here so the doctrine and
sequencing stay in one place.

- **TTI docs platform** (docs site consolidation repo) — pin bump to
  current; **SSO login surface rebrand first** (it ships off-brand
  today and every authenticated user sees it); maroon-ramp
  reconciliation onto the canonical ramp; chrome migration
  smallest-first (identity + theme toggle → `TuxUserMenu` +
  `TuxUtilityCluster`, footer → `TuxFooter`, search →
  `TuxCommandPalette`, TOC → `TuxTOC`, navbar last); legacy
  AggieUX-era vocabulary retired alias-then-delete over two releases.
- **Power BI reporting** — generate report themes from
  `design/tokens.json` (consumes `kit/powerbi/` once v1.8.0 ships, or
  builds locally from the same source); refresh its token snapshot
  (pinned to v1.1.0 as of the survey — six minors stale); reconcile
  its spec/validator/theme three-way drift; keep brand surfaces
  theme-invariant (already its documented, correct decision).
- **External collaboration stack** — its "light" theme vendored the
  `tti-hc` values by accident (owner-confirmed 2026-07-30): re-vendor
  `kit/css/tux-tokens.css` verbatim after v1.8.0 and swap its bespoke
  on-brand token for `--text-on-brand`. Its token→env fan-out script
  and per-surface contrast gate are the upstream inspiration for
  `brand.env` and the kit's on-brand recipe — credit where due.
- **TTI AI Studio** — owns B3 (see execution log). Its `TuxKanban*`
  components migrate upstream in v1.9.0; the app deletes its copies
  at its own pin-bump.

---

## Open owner decisions

Carried so they stop living only in session state. Resolved decisions
move to the laws above with a date.

| # | Decision | State |
|---|---|---|
| 1 | **Family name** — waffle heading ships as "TTI Portals"; the umbrella marketing name ("TTI Research Suite"? "TTI Tools"?) is unratified | open |
| 2 | **Light-mode family signature** — editorial-white chrome + maroon wordmark + gold keyline + tracked eyebrow, incl. whether TTI Code keeps its maroon navbar or adopts the white chrome | open |
| 3 | **Landscape anonymous surface** — purpose-built anonymous endpoints vs authenticated-only (path-exclusion on the auth proxy was reviewed and **withdrawn as unsafe**) | open |
| 4 | **AI Studio in the anonymous waffle** — show (with launcher) or hide until signed in | open (currently signed-in only) |
| 5 | **Follow-OS theme default for web portals** (+ maroon floor); desktop shell already ratified follow-OS | open |
| 6 | **Classification-banner scope** — which portals carry the data-classification banner (compliance question) | open |
| 7 | **Vibrancy/Mica asymmetry** — macOS gets vibrancy, Windows does not; ratify or converge | open |
| 8 | **Forge-registry seed package** — regenerate from canonical tokens (recommended) vs retire, pending whether any registry consumer installed the stale version | open |
| 9 | ~~Form controls~~ — **resolved 2026-07-30**: hybrid (theme `U*`, no wrapper set) | ratified |
| 10 | ~~Warning semantic~~ — **resolved 2026-07-30**: TTI gold backs `warning` (v1.8.0) | ratified |
| 11 | ~~Collab-stack hc-as-light~~ — **resolved 2026-07-30**: accident; fix to canonical `tti` light | ratified |
| 12 | ~~Docs-platform ownership~~ — **resolved 2026-07-30**: separate workstream, spawned with a handoff | ratified |
