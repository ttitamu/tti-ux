# aggieux — design system

**aggieux** (/ˈæ.ɡi.uː/) is the design system behind tti-ux. The name is
Aggie + UX. It ships with a **TTI flavor** out of the box and re-themes
cleanly for any Texas A&M University System member institution — or any
institution outside TAMUS that wants to borrow the pattern.

## Principles

1. **Editorial, not dashboard-y.** TTI's marketing output (reviewed in
   `design/palette.md`) reads as an institutional research report, not a
   SaaS dashboard. aggieux follows: generous white space, real
   photography in marketing surfaces, restrained color, authoritative
   headline treatments.
2. **Data-dense where it counts.** Research and institutional apps can
   show thousands of rows at a time. When we get dense, we get dense
   *well* — virtualized tables, clear hierarchy, no flicker.
3. **Accessible by default.** WCAG AA is the floor, not the ceiling.
   Texas state agencies have §2054.459 obligations; every color token
   ships with a documented contrast pair and a high-contrast (AAA)
   variant.
4. **Themeable by institution.** Brand colors are the only thing that
   changes. Spacing, typography scale, component behavior — identical
   everywhere. Clone the TTI token file, swap four hex values, ship a
   sibling-institution build.
5. **Framework-light.** Headless primitives (Nuxt UI / Reka UI) +
   Tailwind v4 + CSS custom properties. If a future consumer ever needs
   a React or Svelte port, the token layer ports cleanly.

## Stack

| Layer          | Tool                                | Why                                                                        |
| -------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| Tokens source  | `design/tokens.json`                | Single source of truth (Style Dictionary transforms → CSS vars, Figma JSON) |
| Utilities      | Tailwind v4                         | `@theme` directive consumes CSS custom properties directly                  |
| Primitives     | Nuxt UI 4 (on Reka UI)              | Headless, a11y-complete Vue primitives with theming layer                  |
| Tables         | TanStack Table v8 + TanStack Virtual| Headless, virtualized — composes with our styling                          |
| Icons          | Iconify via `@nuxt/icon`, Lucide set| On-demand, 1,700+ icons bundled — extensible to any Iconify family         |
| Catalog        | This Nuxt app                       | The living style guide IS the documentation; `npm run dev` shows it        |

## Signature moves

Three visual ideas make aggieux recognizably TTI/TAMUS and not generic
shadcn:

### The gold bar

Under every editorial heading: a 100×8px **TTI gold** rule. Three
utility variants — `heading--bold` (upright), `heading--display`
(italic uppercase, editorial maximalist), and `TuxSectionHeader`
(ALL-CAPS with a maroon underline). Used sparingly; not on every `<h1>`.

### The card corner-drop

Linked `TuxCard` on hover: translates `+6px` right and `-6px` up while a
maroon slab box-shadow drops into the gap left behind. Signals
navigation without the cargo-cult hover-lift every SaaS uses.

### The eyebrow + subhead rhythm

Small ALL-CAPS tracked-out labels above or below a heading — pulled
from TTI's print collateral. The component showcase pages dogfood this
heavily via `TuxPageHeader`.

## Theme variants

Themes ship in `design/tokens.json` under `themes.*` and in
`app/assets/css/tokens.css` as `[data-theme="<name>"]` blocks. Swap by
setting `data-theme` on `<html>`.

| Theme         | Anchor           | Accent          | Notes                                                      |
| ------------- | ---------------- | --------------- | ---------------------------------------------------------- |
| `tti`         | maroon `#5C0025` | gold `#DDAC37`  | Default. Matches TTI collateral                             |
| `tti-dark`    | maroon-400       | gold            | Warm-charcoal dark theme; for editor-by-evening use         |
| `tti-hc`      | dark-red `#500000` | gold `#DCAA37` | WCAG AAA. Drawn from the 508-accessible PPTX template      |
| `tamu`        | maroon `#500000` | white / gray    | Texas A&M University primary *(placeholder, unverified)*   |
| `pvamu`       | purple `#500778` | gold `#FFD700`  | Prairie View A&M *(placeholder, unverified)*               |
| `tarleton`    | purple `#4C1D95` | white           | Tarleton State *(placeholder, unverified)*                 |
| `wtamu`       | maroon `#642667` | navy            | West Texas A&M *(placeholder, unverified)*                 |

**Placeholder themes have unverified hex values** — don't ship a release
for that institution until their brand/marketing team confirms.

## Adding a new institution

1. Add a block under `themes.<name>` in `design/tokens.json` — override
   only `brand.*` slots.
2. Add a matching `[data-theme="<name>"]` block to
   `app/assets/css/tokens.css`.
3. Switch via `data-theme="<name>"` on `<html>` and every token rebinds.

## Typography

- **Display + heading:** Franklin Gothic ATF if the institution
  licenses it; **Public Sans** (USWDS, open) as the default — visually
  close to Franklin Gothic and safer for public-sector distribution.
- **Body:** same family, Regular and Medium.
- **Mono:** **JetBrains Mono** (paths, IDs, code).
- **AggieUX parity** (on-demand): Open Sans, Oswald, Work Sans, Georgia
  — registered but not loaded by default. See `reference/aggieux/`.

Scale follows a 1.25 modular scale anchored at 14px body.

## What we're deliberately not doing

- **Not copying shadcn.** Fine system, but aggieux has an
  institutional voice — editorial, not product-y. We draw *patterns*
  from Radix/shadcn and put a TTI/TAMUS skin on them.
- **Not Material.** It's opinionated visually in ways that fight the
  editorial feel.
- **Not dark-mode-first.** Most sites run during business hours on
  managed desktops. Dark mode is supported via `data-theme` but isn't
  the default.
