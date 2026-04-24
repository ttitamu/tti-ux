# aggieux — PECAN design system

**aggieux** (/ˈæ.ɡi.uː/) is PECAN's design system. It takes its name from Aggie + UX. It's built to ship with a **TTI flavor** out of the box and re-theme cleanly for any Texas A&M University System member institution — or any institution outside TAMUS, for that matter.

## Principles

1. **Editorial, not dashboard-y.** TTI's own marketing output (reviewed in `design/palette.md`) reads as an institutional research report, not a SaaS dashboard. aggieux follows: generous white space, real photography in marketing surfaces, restrained color, authoritative headline treatments.
2. **Data-dense where it counts.** File listings can be 100k rows. Dashboards must read at a glance. When we get dense, we get dense *well* — virtualized tables, clear hierarchy, no flicker.
3. **Accessible by default.** WCAG AA is the floor, not the ceiling. PECAN is deployed at public institutions with 508 obligations. Every color token ships with a documented contrast pair.
4. **Themeable by institution.** Brand colors are the only thing that changes. Spacing, typography scale, component behavior — identical everywhere. Clone the TTI token file, change four hex values, ship a WTAMU or Prairie View build.
5. **Framework-light.** Headless primitives (Reka UI) + Tailwind v4 + CSS variables. No framework-specific component library that would lock us into Vue forever — if we ever need a React or Svelte consumer, the token layer ports.

## Stack

| Layer | Tool | Why |
|---|---|---|
| Tokens source | `design/tokens.json` | Single source of truth. Style Dictionary transforms → CSS vars, Tailwind theme, Figma JSON |
| Token pipeline | Style Dictionary 4 | Amazon's token compiler; outputs per-target artifacts |
| Utilities | Tailwind v4 | `@theme` directive consumes CSS variables directly — no JS config sprawl |
| Primitives | Reka UI | Headless, a11y-complete Vue primitives (Radix-equivalent) |
| Chrome | Nuxt UI 4 (Pro) | Built on Reka + Tailwind — uses our tokens automatically |
| Tables | TanStack Table v8 + TanStack Virtual | Headless, virtualized, composes with our styling |
| Charts | ECharts 5 via `vue-echarts` | Treemap, sunburst, bar, sankey — replaces diskover's D3 v3 |
| Icons | Iconify (`@nuxt/icon`) w/ Lucide set | On-demand, 200k+ icons, one module |
| Catalog | Histoire | Vue-native Storybook alternative |

## Signature components

Three components are worth calling out — they're the visual ideas that make aggieux recognizably TTI/TAMUS and not generic shadcn:

### 1. The BigStat

Oversized numerals in **tti-maroon** or **tti-gold** with small tracked-out labels. This is TTI's signature infographic pattern, pulled directly from the fact sheets and overview decks.

```vue
<BigStat value="$126M" label="Annual research expenditure" tone="maroon" />
```

Used for: dashboard headline metrics (total indexed bytes, file counts, active scans).

### 2. The SectionHeader

ALL-CAPS, letter-spaced, with a maroon underline rule. Echoes the editorial rhythm from TTI collateral.

```vue
<SectionHeader>STORAGE OVERVIEW</SectionHeader>
```

### 3. The PathCrumbs

The dir-hierarchy breadcrumb with inline size pills. Closest thing PECAN has to a "signature" functional component — it's on every results and detail view. Replaces diskover's flat path display.

## Theme variants (bundled)

The following institutional themes ship in `design/tokens.json` under `themes.*`. Swap by setting `data-theme="<name>"` on `<html>`.

| Theme | Anchor | Accent | Notes |
|---|---|---|---|
| `tti` *(default)* | maroon `#5C0025` | gold `#DDAC37` | Matches TTI collateral across PDFs + high-contrast PPTX |
| `tti-hc` | dark-red `#500000` | gold `#DCAA37` | WCAG AAA contrast pair, drawn from the 508-accessible PPTX template |
| `tamu` | maroon `#500000` | white / gray | Texas A&M University primary |
| `pvamu` | purple `#500778` | gold `#FFD700` | Prairie View A&M (placeholder — confirm with PVAMU brand team) |
| `tarleton` | purple `#4C1D95` | white | Tarleton State (placeholder) |
| `wtamu` | maroon `#642667` | navy | West Texas A&M (placeholder) |

**Placeholder** themes have unverified hex values — do not ship a release for that institution until we confirm with their brand/marketing team.

## Adding a new institution

1. Add a block under `themes.<name>` in `design/tokens.json` — only override `brand.*` slots.
2. Run `pnpm run tokens:build` (Style Dictionary pipeline — to be added with the frontend scaffold).
3. The output goes to `frontend/assets/themes/<name>.css`.
4. Ship.

## Typography

- **Display + heading:** Franklin Gothic ATF if the institution licenses it; **Public Sans** (US Web Design System, open) as the default fallback — visually very close to Franklin Gothic and safer for public-sector distribution.
- **Body:** same family, Regular and Medium weights.
- **Mono:** JetBrains Mono (for paths, IDs, size values in tables).

Scale follows a 1.25 modular scale anchored at 14px body.

## What we're deliberately not doing

- **Not copying shadcn.** It's a fine system, but aggieux has an institutional voice — editorial, not product-y. We draw component *patterns* from Radix/shadcn and put a TTI/TAMUS skin on them.
- **Not Material.** It's opinionated visually in ways that fight the editorial feel.
- **Not dark-mode-first.** Most use sites are during business hours on managed desktops. Dark mode is supported (via `data-theme` variants) but isn't the default.
