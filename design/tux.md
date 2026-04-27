# tux — design system

**tux** (/ˈæ.ɡi.uː/) is the design system behind tti-ux. The name is
Aggie + UX. It ships with a **TTI flavor** out of the box and re-themes
cleanly for any Texas A&M University System member institution — or any
institution outside TAMUS that wants to borrow the pattern.

## Principles

1. **Editorial, not dashboard-y.** TTI's marketing output (reviewed in
   `design/palette.md`) reads as an institutional research report, not a
   SaaS dashboard. tux follows: generous white space, real photography
   in marketing surfaces, restrained color, authoritative headline
   treatments.
2. **Data-dense where it counts.** Research and institutional apps can
   show thousands of rows at a time. When we get dense, we get dense
   *well* — virtualized tables, clear hierarchy, no flicker.
3. **Accessible by default.** **WCAG 2.2 Level AA** is the floor;
   color contrast is verified at **AAA** (7:1 normal text, 4.5:1 large)
   across all three themes by automated audit on every commit. Texas
   state agencies have §2054.459 obligations; every color token ships
   with a documented contrast pair. See [`/accessibility`](../app/pages/accessibility.vue)
   for the formal statement and the per-criterion coverage table.
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

Three visual ideas make tux recognizably TTI/TAMUS and not generic
shadcn:

### The gold bar

Under every editorial heading: a slim **TTI gold** rule (64×3px under
`heading--bold`, 88×3px under `heading--display`, with a 1.5px
border-radius). Earlier drafts used a 100×8px slab; the slim hairline
reads more "refined editorial" and less "marketing 2010" without
losing the editorial-weight signal. `TuxSectionHeader` uses a 2px
maroon underline scoped to text-width as a third variant.

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

| Theme         | Anchor             | Accent          | Notes                                                      |
| ------------- | ------------------ | --------------- | ---------------------------------------------------------- |
| `tti`         | maroon `#5C0025`   | gold `#DDAC37`  | Default light theme. AAA-verified contrast.                 |
| `tti-dark`    | rose `#e795a8`     | gold            | Warm-charcoal dark theme. AAA-verified contrast.            |
| `tti-hc`      | dark-red `#500000` | gold `#DCAA37`  | High-contrast variant. AAA across the board.                |
| `tamu`        | maroon `#500000`   | white / gray    | Texas A&M University primary *(placeholder, unverified)*   |
| `pvamu`       | purple `#500778`   | gold `#FFD700`  | Prairie View A&M *(placeholder, unverified)*               |
| `tarleton`    | purple `#4C1D95`   | white           | Tarleton State *(placeholder, unverified)*                 |
| `wtamu`       | maroon `#642667`   | navy            | West Texas A&M *(placeholder, unverified)*                 |

**Placeholder themes have unverified hex values** — don't ship a release
for that institution until their brand/marketing team confirms.

## Adding a new institution

1. Add a block under `themes.<name>` in `design/tokens.json` — override
   only `brand.*` slots.
2. Add a matching `[data-theme="<name>"]` block to
   `app/assets/css/tokens.css`.
3. Switch via `data-theme="<name>"` on `<html>` and every token rebinds.

## Typography

tux uses **four type families**, with **one rule each**. Rigidly
enforced — if you find yourself using a family outside its lane, you're
off-system.

| Token            | Family            | Where it lives                                                                              |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `--font-body`    | **Open Sans**     | Default body copy, paragraphs, eyebrows, subheads, H4–H6. Anywhere at any size.             |
| `--font-display` | **Oswald**        | Default-style H1–H3 only. Condensed, uppercase. Never body — illegible under ~18px.        |
| `--font-bold`    | **Work Sans**     | Bold-style H1–H3, plus buttons, inputs, selects everywhere. Never long-form.                |
| `--font-elegant` | **Georgia**       | Elegant-style H1–H3 only. System font — no @font-face needed. Never body copy.              |
| `--font-mono`    | **JetBrains Mono**| Paths, IDs, code, numeric stats in tables.                                                  |

Scale follows a 1.25 modular scale anchored at 16px body.

**Public Sans note.** Earlier drafts of tux defaulted to **Public Sans**
(USWDS) as a Franklin-Gothic-adjacent open-source heading face. The
four-family rule above supersedes that — Public Sans remains loaded
by `@nuxt/fonts` for legacy components but new work should commit to
the Oswald / Work Sans / Open Sans / Georgia stack.

### Three section styles — `default`, `bold`, `elegant`

tux ships with three style variants that change the character of a
surface. The product — a research dashboard, a chat window, a marketing
splash, a policy page — usually sits in one style and stays there, but
a page can mix: a bold hero on a default-style dashboard is fair game.

**Default style** *(used most often)*

- **Oswald** heads the page — condensed, uppercase, tight tracking.
- Less embellishment. Maroon underline on `TuxSectionHeader`.
- Right for: dashboards, admin chrome, tables, internal tooling, most
  product surfaces.

**Bold style** *(eye-catching)*

- **Work Sans** heads the page — heavy (800), mixed-case, italic hero
  flourish.
- Rectangular top dividers (6–8px maroon bars above headings),
  dot-grid accents.
- Right for: marketing splashes, athletic/student-oriented surfaces,
  landing pages, event pages.

**Elegant style** *(refined, stately)*

- **Georgia** heads the page — serif, mixed-case, normal weight.
- Hash-pattern accents (diagonal maroon hash blocks), dotted maroon
  borders on cards.
- Right for: administrative pages, research publications, annual
  reports, faculty bios, policy documents, award announcements.

Opt in with `.style--default`, `.style--bold`, or `.style--elegant` on
any ancestor (page-level default) or with a BEM `--bold` / `--elegant`
modifier on an individual component (`.card-static--elegant`,
`.section-header--bold`). The modifier pattern lets you embed a bold
hero or an elegant sidebar inside an otherwise default-style dashboard
without leaking.

### Font sources

Open Sans, Oswald, and Work Sans are open-source and registered via
`@nuxt/fonts` (Google provider in dev; self-hosted is straightforward
for air-gapped deploys). Georgia is a system font — shipped with every
OS, no @font-face needed. JetBrains Mono is loaded the same way. No
license fees, no public-sector procurement questions.

## What we're deliberately not doing

- **Not copying shadcn.** Fine system, but tux has an institutional
  voice — editorial, not product-y. We draw *patterns* from
  Radix/shadcn and put a TTI/TAMUS skin on them.
- **Not Material.** It's opinionated visually in ways that fight the
  editorial feel.
- **Not dark-mode-first.** Most sites run during business hours on
  managed desktops. Dark mode is supported via `data-theme` but isn't
  the default.
