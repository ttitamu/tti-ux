# Changelog

All notable changes to tti-ux. Follows [Keep a Changelog](https://keepachangelog.com/)
conventions and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed — self-hosted fonts via `@fontsource/*` + `scripts/sync-fonts.mjs`

Replaces the `@nuxt/fonts` module (Google-provider auto-fetch) with
explicit `@font-face` declarations in `app/assets/css/fonts.css`,
sourced from `@fontsource/*` npm packages and synced into
`public/fonts/<family>/*.woff2` via [`scripts/sync-fonts.mjs`](scripts/sync-fonts.mjs).
Air-gapped-build clean — no CDN dependency at runtime or build time,
which matters for state-agency deploys and consumer apps that ship
behind enterprise proxies.

- **`@fontsource/{open-sans,oswald,work-sans,public-sans,jetbrains-mono}`**
  added as devDependencies. Re-sync with `npm run sync:fonts`.
- **`app/assets/css/fonts.css`** declares every face/weight/style
  combination the four-family rule uses; loaded first in the CSS
  cascade so subsequent rules can reference the families.
- **`nuxt.config.ts`** drops `@nuxt/fonts` from `modules` and its
  `fonts` block; prepends `fonts.css` to the `css` array.

### Changed — dark theme brand accent retuned to lifted-TTI-teal

Dark theme's `--brand-primary` switches from lightened maroon
(`#e795a8`) to lifted TTI teal (`#6BB4C0` — the tertiary swatch from
`design/palette.md`, lifted for dark-page contrast). Earlier values
read too pink in the studio where most accent points live on small
chrome elements (composer border, focus rings, active-tab text);
teal reads more institutional at small sizes.

- **`--brand-primary` / `--brand-primary-deep`** retuned in
  `[data-theme="tti-dark"]` to `#6BB4C0` / `#5B9CA8`. Clears AAA on
  every dark surface (7.1:1 on raised, ~8.2:1 on page, ~8.7:1 on
  sunken).
- **`--color-maroon-400 = #7A1233`** override added — Nuxt UI v4's
  solid-variant button fill uses primary-400 in dark themes; the
  unmodified palette value (#b14a6c) reads as raspberry pink against
  the teal accent. Deepening to wine keeps the brand maroon presence
  on loud CTAs (New chat, Send) without losing AAA on white text.
- **`--text-brand`** repointed to the new teal-deep so brand-tinted
  inline text stays coherent with the accent.

Maroon brand presence preserved via `--brand-fill` (always #5C0025)
on marketing panels, the `--color-maroon-400` override on solid
buttons, and `--chart-1` pinned to a wine-leaning value so the brand
chart series doesn't silently shift to teal.

### Added — `TuxSlideover` (edge-anchored drawer)

Slice 4 (final) of the Nuxt UI gap-analysis follow-through. Distinct
affordance from `TuxModal` — `TuxSlideover` slides in from a viewport
edge and preserves the reading context behind the scrim. Use for row
detail (click a `TuxRichDataGrid` row → slide in field metadata),
filter panels, mobile nav reveals, and bottom action sheets.

- **`TuxSlideover`** ([`app/components/TuxSlideover.vue`](app/components/TuxSlideover.vue),
  [`/components/slideover`](app/pages/components/slideover.vue)) —
  edge-anchored panel built on the native `<dialog>` element so focus
  trap, escape handling, scrim rendering, and ARIA semantics come from
  the platform. Slide animation rides Batch J's `--ease-corridor`
  curve over `--motion-base` duration. The panel itself opts into
  `data-tux-overlay` (Batch J easing) and `data-tux-elevation="overlay"`
  (Batch J shadow tier) so it inherits the system's anchored-surface
  rhythm without duplicate CSS.
- **Three sides** —
  - `right` (default) — row detail, filter panel. 28rem wide, full
    viewport height, rounded on the left edge.
  - `left` — mobile nav drawer. Mirror of right.
  - `bottom` — action sheet. Full viewport width, 24rem tall, rounded
    on the top edge.
- **Props** —
  - `v-model: boolean` — open / closed
  - `side: "left" | "right" | "bottom"` (default `"right"`)
  - `size: string` — CSS length for width (left/right) or height (bottom)
  - `title` + `eyebrow` — header heading + optional eyebrow above
  - `showClose: boolean` — top-right close button (default `true`)
  - `closeOnBackdrop: boolean` — dismiss on scrim click (default `true`)
- **Slots** — default (body), `#header` (replace eyebrow + title region),
  `#footer` (action row with sunken-surface tint).
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)`
  skips the slide animation; the panel appears in place.
- **Doctrine note** — added "Slideover vs Modal" section to the demo
  page: choose slideover when the user is drilling into the page
  they're on (row detail, filter panel, side-by-side editor); choose
  modal when the underlying page doesn't matter (confirmation, fatal
  error, full-attention form).

### Added — `TuxTree` (hierarchical list)

Slice 3 of the Nuxt UI gap-analysis follow-through. Fills the
sitemap / corpus / BI-dataset-explorer gap identified in the Nuxt UI
audit. Native (not a `UTree` wrapper) since the visual is
brand-specific and the keyboard semantics are simple enough to own.

- **`TuxTree`** ([`app/components/TuxTree.vue`](app/components/TuxTree.vue))
  — recursive hierarchical list. Each node carries
  `{ id, label, icon?, description?, mono?, to?, href?, badge?, children? }`.
  Pass `to` for internal nav (renders `<NuxtLink>`), `href` for
  external, or leave both off for a pure toggle/select row (renders
  `<div role="button" tabindex="0">` to sidestep Tailwind v4's
  `@layer base` button reset, which would otherwise win over scoped
  CSS via layer cascade order). Set `mono: true` on a node to render
  its label in JetBrains Mono — useful for path / id / hash leaf
  rows.
- **`TuxTreeNode`** ([`app/components/TuxTreeNode.vue`](app/components/TuxTreeNode.vue))
  — single-row recursive child component. Owns the row chrome
  (chevron, icon, label-block, badge) and indents by depth via
  `padding-left`. Expand state lives in the parent tree; this
  component just queries it via a callback prop.
- **Props (`TuxTree`)** —
  - `items: TreeItem[]` (required)
  - `defaultExpanded?: string[]` — initial open IDs (defaults to every root node)
  - `storageKey?: string` — sessionStorage key for collapse persistence
  - `showGuides: boolean` — 1px sand guide lines under expanded branches (default `true`)
  - `v-model:selected` — currently-selected node ID
  - `ariaLabel: string` — passed to `[role="tree"]`
  - Exposes `expandAll()` / `collapseAll()` via template ref
- **Visual rhythm** — maroon chevron + maroon label tint on the
  selected row (anchored by a 2px maroon left bar, mirroring
  `.tux-cmd__item--active` so cross-component selection reads
  consistently). Sand guide lines under expanded branches help deep
  hierarchies stay scan-able. Container query
  (`@container tux-tree (max-width: 280px)`) drops the description
  line and tightens padding at narrow widths — per CLAUDE.md rule 1.
- **Keyboard nav** — `Enter` / `Space` toggle+select,
  `ArrowRight` expands a collapsed branch, `ArrowLeft` collapses an
  expanded branch. Up/down navigation uses native focus order through
  the row elements (which are all focusable).
- **Demo page** [`/components/tree`](app/pages/components/tree.vue)
  shows three example trees: sitemap (route links + badges), corpus /
  filesystem browser (mono leaf labels, row-count badges), and a
  BI dataset hierarchy (per ADR-0009) with `v-model:selected` driving
  a focused-field side panel.
- **Nav wiring** — `app/app.vue` sidebar, `app/pages/components/index.vue`
  catalog, and `design/components.md` doctrine table.

### Added — `TuxProse`, `/typography` refresh, doc-page surround nav

Slice 2 of the Nuxt UI gap-analysis follow-through. Consolidates the
prose typography that was duplicated across three pages, refreshes the
`/typography` foundation page to reflect the four-family rule from
`design/tux.md`, and adds a prev/next surround at the bottom of every
`/design/[doc]` page.

- **`TuxProse`** ([`app/components/TuxProse.vue`](app/components/TuxProse.vue),
  [`/components/prose`](app/pages/components/prose.vue)) — typographic shell for
  long-form markdown. Single `:deep()` block covering H1/H2/H3/H4/p/ul/ol/li/
  strong/em/code/pre/a/table/th/td/hr/blockquote/img. Default wrapper is
  `<article>`; pass `as="div"` when the parent already provides the
  landmark. Replaces three duplicate ~130-line `.prose-tux :deep(…)`
  blocks that lived inline in `app/pages/changelog.vue`,
  `app/pages/design/[doc].vue`, and `app/pages/markdown.vue` (~400
  lines of duplication eliminated).
- **`[`/design/[doc]`](app/pages/design/[doc].vue)` rewrite** — wraps `<MDCRenderer>`
  in `<TuxProse>` and adds a Nuxt-UI-style `ContentSurround` at article
  bottom (prev / next sibling design docs, sorted by slug). The
  surround cards opt into Batch J's `data-tux-elevation="rest"` for
  consistent shadow tier.
- **[`/changelog`](app/pages/changelog.vue)** — wraps `<MDCRenderer>` in
  `<TuxProse>`. Drops the 90-line scoped prose CSS block.
- **[`/markdown`](app/pages/markdown.vue)** — wraps the MDC preview in
  `<TuxProse as="div">` so the prose rhythm renders inside the
  card without doubling up the `<article>` landmark. Drops the
  110-line scoped prose CSS block.
- **[`/typography`](app/pages/typography.vue) refresh** — dek now opens with "Four families,
  three style variants, one mono" instead of the stale Public Sans /
  JetBrains Mono framing. Adds:
  - **Family roster** — five articles, one per token
    (`--font-body`, `--font-display`, `--font-bold`, `--font-elegant`,
    `--font-mono`), each showing role + sample. Each card opts into
    Batch J's `data-tux-elevation="rest"`.
  - **`heading--elegant`** section with both the upright and italic
    forms (the page mentioned the utility before but never showed it).
  - **Style variants triptych** — three side-by-side cards
    demonstrating `default` / `.style--bold` / `.style--elegant`
    applied to the same heading text.
  - **`TuxProse` wrapper demo** — renders a sample H1 / p / H2 / list /
    blockquote stack inside the wrapper to make the prose rhythm
    legible to designers landing on the foundation page.
  - Cross-links to `/design/tux`, `/tokens`, `/components/kbd`,
    `/style-variants`, and `/changelog`.
- **Nav wiring** — `app/app.vue` sidebar, `app/pages/components/index.vue`
  catalog, and `design/components.md` doctrine table all gain the
  `TuxProse` row.

### Added — `TuxKbd`, `TuxShortcutsHelp`, global `defineShortcuts`

Slice 1 of the Nuxt UI gap-analysis follow-through. Consolidates the
three hand-rolled `<kbd>` styling blocks that lived inside
`TuxCommandPalette` into one component, leans on Nuxt UI's
`defineShortcuts` for platform-correct hotkey wiring, and mounts a
global command palette + shortcuts-help overlay at the shell so every
page benefits from `⌘K`, `/`, and `?`.

- **`TuxKbd`** ([`app/components/TuxKbd.vue`](app/components/TuxKbd.vue), [`/components/kbd`](app/pages/components/kbd.vue)) — token-styled `<kbd>` with Mac
  vs PC modifier normalization (post-hydration to avoid SSR mismatch).
  Three sizes (`xs`/`sm`/`lg`), single-key + combo + sequence forms,
  built-in glyphs for arrows / enter / escape / tab / space, default
  slot for custom content (function keys, icons). Uses the same
  `defineShortcuts` key grammar (`meta`, `ctrl`, `shift`, …) so a
  binding declaration and its rendered hint share a vocabulary.
- **`TuxShortcutsHelp`** ([`app/components/TuxShortcutsHelp.vue`](app/components/TuxShortcutsHelp.vue)) — modal
  overlay listing every wired shortcut, grouped. Auto-classifies items
  as combo (modifier+key, rendered as one `TuxKbd` group) or sequence
  (no modifier, rendered as `TuxKbd "then" TuxKbd`). Built on
  `<dialog>` for free focus trap + scrim + escape semantics, same
  anatomy as `TuxCommandPalette`. Opt-in `data-tux-overlay` +
  `data-tux-elevation="overlay"` so it picks up the Batch J easing
  curve and shadow.
- **`TuxCommandPalette` refactor** — replaces the hand-rolled
  `keydown` listener with `defineShortcuts({ meta_k: …, usingInput: true })`
  for platform-correct meta/ctrl handling. Replaces the inline `<kbd>`
  markup (esc hint, per-item shortcut, footer hints) with `<TuxKbd>`.
  Drops the now-redundant `.tux-cmd__esc-hint`,
  `.tux-cmd__item-shortcut`, and `.tux-cmd__footer-hint kbd` scoped
  CSS blocks. Arrow / enter / escape stay on the dialog's local input
  handler since they're list-nav, not app-level shortcuts.
- **Shell-level wiring in [`app/app.vue`](app/app.vue)** — mounts one
  `<TuxCommandPalette>` and one `<TuxShortcutsHelp>` globally, with
  `paletteGroups` derived from the existing `navTree` so a single
  source of truth drives sidebar nav and palette search.
  `defineShortcuts` at the shell wires:
  - `meta_k` — open the global palette (handled by `TuxCommandPalette` internally)
  - `/` — open the global palette (GitHub idiom)
  - `?` — toggle the shortcuts-help overlay
  - `g-c` / `g-t` / `g-d` / `g-h` — sequence shortcuts to
    `/components`, `/tokens`, `/design/tux`, `/`
- **`/components/command-palette` demo** — adds `:disable-hotkey="true"`
  on the page's local palette instance so `⌘K` only fires the global
  one. Replaces the page's hand-rolled `<kbd>` markup with `<TuxKbd>`.
- **Nav wiring** — `app/app.vue` sidebar tree, `app/pages/components/index.vue`
  catalog table, and `design/components.md` doctrine table all gain
  the `TuxKbd` row.

### Added — Batch J: visual-language application sweep

A surface-level pass that applies the Batch E-prelude tokens (focus,
easing, elevation, identity primitives) across the existing kit without
touching every component file. Pure CSS, additive, opt-in via attribute
selectors and utility classes. Imported from the standalone
`tti-ux-design` skill payload (2026-05-14), where the doctrine and
implementation were authored alongside.

- **`app/assets/css/tux.css`** gains a `BATCH J` section with six rules:
  - **J.1** — `transition-timing-function: var(--ease-survey)` default
    for `button, a, input, select, textarea, [role="button"],
    [role="tab"], [role="option"], .tux-card, .card-linked*` (gated by
    `prefers-reduced-motion`). Opt-in `data-tux-overlay` →
    `--ease-corridor`; `data-tux-arrival` → `--ease-arrival`. Inline JS
    transitions and component-declared curves still win.
  - **J.2** — `[data-tux-elevation="flat|rest|hover|overlay|pinned"]`
    maps the five elevation tiers to a single attribute. The `hover`
    value also applies `translateY(-1px)` for the canonical lift.
  - **J.3** — `.tux-hoverlift` utility: one-class opt-in for the
    rest → hover transition pairing.
  - **J.4** — `.tux-mark` / `.tux-mark--lg` / `.tux-mark--xl` for sizing
    and tinting identity-primitive `<symbol>`s from
    `/identity-primitives.svg` (already shipping in `public/`). Default
    16×16, currentColor = `--brand-primary`; `--mark-size` and
    `--mark-color` are the per-instance hooks.
  - **J.5** — `.tux-section-divider`: eyebrow label + maroon-to-
    transparent gradient rule packaged as a one-class utility.
  - **J.6** — `[data-tux-rowgrid]`: subtle 6%-maroon repeating-vertical-
    lines background, opt-in on heroes / empty-state panels / section
    breaks.
- **`design/visual-language-evolution.md`** gains the matching `Batch J
  — 2026-05` section documenting each rule, the opt-in pattern, and the
  Nuxt-vs-skill path note (`assets/identity-primitives.svg` in the
  skill payload → `/identity-primitives.svg` here).
- **No new tokens, no new components, no JS changes.** Batch J consumes
  the prelude tokens (`--ease-survey/corridor/arrival`, `--motion-base/
  fast`, `--elevation-flat/rest/hover/overlay/pinned`, etc.) already in
  `app/assets/css/tokens.css`. The mapping `--font-body-bold` →
  `--font-bold` reconciles the skill payload's token name with the
  four-family typography rule.

### Added — `public/kits/aggieux/` major expansion

Refresh of the TTI-curated AggieUX preview catalog at
`public/kits/aggieux/` from the skill payload (`ui_kits/aggieux/`).
**Not** a change to `reference/aggieux/v2.0.1/` (the frozen upstream
CDN snapshot at `aux.tamu.edu`, untouched per CLAUDE.md).

- **43 new `Aggie*.jsx` demo pages** covering chart foundations,
  charts/maps/treatments/viz, data tables, descriptions, directory,
  forms (core + advanced + field grid + date range + dropdown-
  combobox), filters, status states, banners, sectioning, templates,
  hover/focus disclosures, accessibility, image lightbox, load-more,
  feedback, toggle/slider, toolbar, transfer, tree, rate, rich data
  grid, sidebar banner, specialized patterns, AI-studio surface,
  corridor strip, collab, descriptions, guidance, map legend, news
  contact (sectioning, etc.). Net 23 → 66 files in the kit folder.
- **10 updated pages** — `AggieCatalog` (registers every new section),
  `AggieButtonsAlerts`, `AggieCards`, `AggieChrome`, `AggieIconLink`,
  `AggieMenus`, `AggieNewsContact`, `AggiePageHeaders`, `AggiePages`,
  `App.jsx`.
- **`index.html`** updated to register all 64 JSX modules via
  `<script type="text/babel">` tags.
- **`AggieDisclosure.jsx`** (Batch 10: accordions / publication
  accordion / Q&A) and **`AggieDisclosures.jsx`** (Batch A.1: tooltips
  and popovers) are intentionally distinct — both ship.

### Added — `StructuredOutput.jsx` for tti-ai-chat kit

Imported from the skill payload's `tti-ai-studio` kit (collapsed-naming
mirror of our `tti-ai-chat`).

- **`public/kits/tti-ai-chat/StructuredOutput.jsx`** ships three
  primitives for AI-generated structured tool output inline in a
  conversation: `InlineCard`, `InlineCarousel`, `ResponseCard`. Anatomy
  lineage is MCP Apps for Claude; translated to tti-ux's typography,
  color, and signature language. Globals: `React`, `LucideIcon`,
  `TuxBadge` — all already provided by other kit scripts.
- **`public/kits/tti-ai-chat/index.html`** rewritten to register
  `StructuredOutput.jsx` and to demonstrate the new primitives — the
  assistant Message in the demo conversation now renders an
  `InlineCarousel` of six citation cards, a `ResponseCard` for the
  Linear ticket draft (with `toolName`, `status`, `footer`), and a
  compact `InlineCard` for the related runbook. Title kept as
  `tti-ai-chat` to match the local kit naming.

## [1.3.0] — 2026-05-12

Shell + sidebar + footer alignment batch. The style-guide chrome
now dogfoods `TuxDocsSidebar` (and gets the same exclusive-open
disclosure UX as the AggieUX reference kit), the institutional
footer is reconciled to the comm-team's Kadence source so we ship
the same handles + link inventory as production tti.tamu.edu, and
the shell adopts the tapered-hairline pattern from tti-ai-studio
for cross-product consistency. No breaking API changes — every
component prop added below is optional with a sensible default.

### Direction — tti-ux as source of truth for the BI design system

- **ADR 0009 accepted** ([`docs/adr/0009-bi-design-system-source-of-truth.md`](docs/adr/0009-bi-design-system-source-of-truth.md)). tti-ux becomes the canonical home for TTI's Power BI / Microsoft Fabric design system: brand tokens (already here), data-viz tokens (already here), Power BI theme JSON (to be generated here from tokens), and the Aggie Viz / Tti Viz shell spec (to be ported here from `docs-it-tamu-edu`).
- **Consumers**: `tti-reporting` ([`ttitamu/tti-reporting`](https://github.com/ttitamu/tti-reporting)) currently snapshots tokens into `core/themes/tokens.json` and ports the Aggie Viz shell into `core/ttiviz/SHELL_SPEC.md`. Once tti-ux owns these, those become reference snapshots that follow tti-ux releases.
- **`docs-tti-tamu-edu`** stops being a stale clone of the docs-it-tamu-edu Power BI section and instead links to tti-ux for canonical BI standards.
- **Pending port** (from `docs-it-tamu-edu/nuxt-site/content/docs/tamu/M365/Power-BI-Fabric/`): ~12 documents covering AggieBI brand-theme rationale, light/dark mode architecture, organizational visuals, component/visual-type policy, and the Aggie Viz visual spec family (shell, textboxes, nav pills, card styling, PBIP property reference). See ADR 0009 for the full mapping.

### Changed — Style-guide shell dogfoods TuxDocsSidebar

- **Shell sidebar collapses** by group. The flat list in
  `app/app.vue` is replaced with `<TuxDocsSidebar>` (the component
  was already shipping for downstream consumers and even documented
  the style-guide shell as a TODO migration). Auto-opens the group
  containing the active route, persists collapse state in
  sessionStorage under `tti-ux-sidebar`, and exposes the inline
  filter as "Filter the system…". Eliminates the wall-of-69
  problem when scanning the catalog.
- **Exclusive-open root**: a new `exclusiveTopLevel` prop on
  `TuxDocsSidebar` makes opening any root group explicitly close
  every other root group. Without this you could expand 5 groups
  and lose the sidebar's "where am I" affordance. Opt-in (default
  `false`) so existing consumers (PECAN docs shells, etc.) aren't
  surprised.
- **Long-name truncation**: leaf-link labels now share the
  `__label` truncation class with summary rows. Component names
  like `TuxAnnouncementBanner` were blowing past the 240px lane
  and — combined with the CSS spec coercing `overflow-x` to `auto`
  whenever `overflow-y` is non-visible — surfaced a horizontal
  scrollbar inside `__nav`. The root cause was `__sublist`'s
  `display: grid` auto-sizing the column to `max-content`; pinning
  to `grid-template-columns: minmax(0, 1fr)` lets the column
  shrink below max-content so the ellipsis actually kicks in.
  `__nav` also gets an explicit `overflow-x: hidden` as belt-and-
  braces against future inner-layout drift.
- **Sticky sidebar shell**: the shell wrapper in `app.vue` is now
  `md:sticky md:top-[57px] md:self-start md:max-h-[calc(100vh-57px)]`
  on desktop with `overflow-y: auto; overflow-x: hidden`. Before,
  the wrapper stretched to match the main content's full height,
  so scrolling the page scrolled the sidebar out of view and the
  tapered hairline rode down into the footer. `self-start` opts
  out of the flex parent's default stretch so sticky can actually
  take effect; mobile keeps its `fixed inset-y-0 top-[57px]`
  slide-in shell unchanged.
- **Content width**: shell content cap raised from `max-w-5xl`
  (1024px) to `max-w-6xl` (1152px). Modest bump — leaves room for
  the future right-rail `TuxTOC` and the persistent left sidebar.

### Changed — TuxFooter aligned to the comm-team Kadence source

The comm team's authoritative footer (Kadence block source for
production tti.tamu.edu) now defines the institutional shape. We
were close on structure but drifted on handles, URLs, and the
TAMUS lockup styling. Reconciled in one pass.

- **Social handles flipped** to the canonical `ttitamu` (no S)
  forms: LinkedIn `linkedin.com/company/texasa-mtransportationinstitute`,
  Facebook `facebook.com/ttitamu`, Instagram `instagram.com/ttitamu/`,
  YouTube `youtube.com/ttitamu`, Twitter/X `twitter.com/TTITAMU`.
  Previously we shipped a stale `TTIVideoChannel` YouTube link and
  `TTITAMUS` (with S) for several others.
- **Threads added** (sixth social, matching production). Lucide
  doesn't ship a Threads glyph, so `TuxFooter` now accepts an
  optional `svg?: string` field on `SocialLink` as an alternative
  to `icon` — pass raw `<svg>` markup. Threads renders via the
  Simple Icons path (CC0). Force-set `fill="currentColor"` on the
  `<svg>` and `<path>` plus a descendant CSS rule so the icon
  picks up the footer's white color reliably across v-html paths.
- **Social-link tap targets** bumped from 40×40 to **44×44px** —
  WCAG 2.5.5 (AAA) target-size minimum, matching the Kadence 44px
  setting. Icon glyph scaled from 1.125rem to 1.25rem for
  proportion.
- **State Resources URLs** corrected to match Kadence: Texas
  Homeland Security points at `gov.texas.gov/` root, Statewide
  Search at `tsl.texas.gov/trail/index.html`.
- **Policies column restructured** to the 9-item TTI-owned list
  (TAMUS Risk/Fraud Hotline → Digital Accessibility → Site
  Policies → Open Records → Statutorily Required Reports → TTI
  Rules → Veterans → Equal Opportunity → Jobs) — all pointing at
  `tti.tamu.edu/notices-policies/…` rather than the upstream
  `tamus.edu` URLs we previously linked. The internal WCAG-audit
  page is kept as the column's last entry (style-guide-only extra,
  not in production).
- **Tagline dropped** from the marketing section. Kadence's
  production footer doesn't render the "Coordinated Statewide
  Transportation Research Program" tagline — institutional name
  carries it. The `tagline` prop still defaults to that string for
  back-compat; the shell passes `tagline=""` to suppress it.
- **TAMUS lockup → plain link**. The black legal strip's left
  side previously rendered as a two-line eyebrow + name lockup.
  Kadence ships a single plain "A member of the Texas A&M
  University System" link. Lockup CSS removed; replaced with a
  single `__tamus-link` rule.
- **© line now linked**. Two new optional props on `TuxFooter`:
  `copyrightText` (full override of the default "© {year} {name}"
  rendering) and `copyrightHref` (wraps the line in an external
  link). The shell passes
  `© Copyright 2026 Texas A&M Transportation Institute (TTI)`
  pointing at the copyright-statement page, matching production.

### Added — Tapered hairlines (cross-product shell pattern)

- **`.tti-shell-header::after` / `.tti-shell-sidebar::after`** —
  the hard `border-b` / `border-r` Tailwind utilities on the shell
  header and sidebar are replaced with 1px pseudo-elements drawn
  via `linear-gradient(transparent 0% → var(--surface-border)
  18%–82% → transparent 100%)`. Reads as a soft ruled line that
  fades into the surface rather than a hard corner-to-corner
  stroke. Lifted verbatim from tti-ai-studio's `studio-shell`
  (same 18%/82% stops) so the two products feel like one family
  at the chrome level. Promote to a shared utility when a third
  surface needs it.

### Removed — Home page Components grid

- The 69-card Components grid on the welcome page is gone. The
  same inventory is now reachable in one click via the (newly
  collapsible) sidebar's Components group and the dedicated
  `/components/` catalog page, both of which already shipped. The
  grid was duplicating navigation and dominating the home page
  scroll. `catalogCount` constant added for the hero meta line
  ("70+ components · 5 foundations") so we don't have to maintain
  a parallel array.

## [1.2.0] — 2026-05-08

Cuts the accumulated post-v1.1.0 work into a tagged release. Two
component batches (data density + geographic charts) recovered from
a worktree wipe, the visual-language evolution prelude that should
have shipped before them, and an `npm audit` cleanup. No breaking
changes — pin bump from `#v1.1.0` to `#v1.2.0` is additive only.

### Added — Visual-language evolution prelude (2026-05)

Token-only refresh that should have shipped *before* the data-density
batch below. No per-component edits required for the base behavior;
families inherit the changes automatically.

- **Two-ring focus token** — outer 2px maroon + inner 2px sand halo
  replaces the prior single 3px maroon-at-35% ring. Reads cleanly on
  data tables and form rows where a single soft ring gets lost. New
  tokens: `--focus-ring-outer`, `--focus-ring-inner`. Variants: dark
  uses softened maroon + warm-gold inner; HC uses pure black + white
  inner at 5px total width. Lineage: Ant (two-ring concept) and
  Fabric (focus discipline on data-rich surfaces); color story is
  tux-original.
- **Transportation-tempo easings** — `--ease-survey` (tables/forms/
  disclosures), `--ease-corridor` (page-level/sheets/modals), and
  `--ease-arrival` (toasts/banners/snapshots locking in). Three
  distinct curves giving "measured / smooth / decelerate-only"
  coverage without overshoot. Legacy `--ease-standard/emphasis/exit`
  retained as back-compat aliases. Lineage: Material 3
  standard-effects family.
- **Four-tier elevation system** — `--elevation-flat/rest/hover/
  overlay/pinned`, layered on existing `--shadow-sm/md/lg`. Gives
  every component a predictable elevation role; old `sm/md/lg` are
  still available as primitives but new work should use the named
  tiers. Variants: dark bumps overlay alpha so sheets stay readable
  on warm charcoal; HC nukes shadows across the board and uses a
  2px border for the overlay tier. Lineage: Microsoft Fabric.
- **Warm-neutral ramp extension** — added intermediate stops at
  `--neutral-150/250/450/550/650/750/850`. Sand-leaning tints that
  harmonize with maroon over extended viewing. Use for row-stripe,
  hover, and selected states on data-table surfaces (the original
  6-stop ramp couldn't carry those without compounding transparent
  tints). Lineage: shadcn's stone/zinc 12-stop ramps; hex values
  tux-original.
- **Survey-rhythm density tokens** — `--rhythm-tight/snug/normal/
  loose/roomy` (4/8/12/16/24px). Use *instead of* the general
  `--space-*` ramp inside dense surfaces (tables, forms,
  descriptions); `--space-*` stays for section/page-level rhythm.
  Lineage: Ant Design's 4/8/12/16/24 cadence.
- **`public/identity-primitives.svg`** — four `<symbol>`s exported
  as a single shared sprite: `#tux-star` (5-point Lone-star
  reference), `#tux-chevron` (TAMUS-style downward angle bracket),
  `#tux-compass` (compass rose for map-related families), and
  `#tux-row-grid` (parallel-lines-getting-denser pavement-stripe
  pattern). Restraint-grade identity moves for corner accents,
  section brackets, and map decorators. All draw with currentColor.
- **`design/visual-language-evolution.md`** — running ledger that
  documents each entry above (what changed / why / variants /
  lineage). Future token-level changes get appended here.

### Added — Data density + geographic charts (2026-05)

Two batches recovered after a worktree got wiped by a parallel
session before any of its work was committed. Rebuilt verbatim
from chat memory + the official source of truth (us-atlas +
TxDOT MapServer).

**Data density:**

- **`TuxRichDataGrid`** — interactive grid for PECAN-class
  operational surfaces. Sticky header, row selection w/
  indeterminate header checkbox, expandable detail rows, sortable
  columns, active-filter chip strip, bulk-action bar (visible
  only when ≥1 row selected), footer pagination strip. State is
  host-driven via v-models (`selected` / `expanded` / `sortKey` /
  `sortDir`) and events (`search`, `filter-remove`,
  `bulk-action`, `page`, `toolbar`). Slots: `cell-<key>` per
  column, `expanded` for row body, `bulk-actions` to override
  the default action trio.
- **`TuxDataTable`** — research-flavored static table for
  finished deliverables. Numbered caption (`Table 4-2`) over an
  Oswald display title + optional descriptive lede; tabular-
  figure body cells; uncertainty cells auto-rendered as
  `value ± CI` when a column declares `ciKey`; footnote anchors
  wired to a formal note block; optional row groups banded by
  category; optional sticky header w/ max-height for appendix
  density; optional totals row w/ maroon top-rule; source
  citation line. Sort is host-driven.

**Geographic charts (real geometry):**

- **`TuxChartGeographic`** — five Texas-flavored map kinds in
  one component:

  - `county` — 254 real TIGER/Line counties projected with
    d3-geoAlbers (Texas-centered, parallels 27°N–35°N).
  - `districts` — TxDOT's 25 engineering districts using the
    official boundary geometry from the TxDOT MapServer feature
    service, Visvalingam-simplified at weight 0.05.
  - `us-context` — All 50 US states + DC using the AlbersUsa
    composite projection (handles AK / HI as insets natively).
    Highlighted state shifts to maroon.
  - `dot-density` — Dots are rejection-sampled inside the actual
    Texas state outline using a deterministic Mulberry32 RNG so
    SSR + CSR produce the same scatter.
  - `flow` — Origin-destination curved arcs between Texas's
    seven primary metros, projected from real lat/lng.

- **`TuxMetroInset`** — single-metro neighborhood-grid companion
  for 4-up drill-downs (Houston · DFW · Austin · SAT). Cell
  pattern seeded by metro name so SSR + CSR match.
- **`TuxChartSunburst`** — two-ring radial breakdown sister to
  `TuxTreemap`. Inner ring = top-level groups, outer ring =
  children with stepped opacity, center carries total in
  tabular numerals. Container-queried legend collapse below
  36rem.
- **`TuxChartFrame`** — editorial wrapper (eyebrow + Oswald
  title + 2px maroon signature rule + body slot + source/notes
  footer) used by `/visualizations/*` showcase pages so a
  multi-exhibit report reads as one document.

**Geometry pipeline (build-time only):**

- `scripts/build-geo.mjs` runs at build time only — pulls
  us-atlas (npm; TIGER/Line 1:10m) and the official TxDOT
  MapServer feature service, simplifies via `topojson-simplify`,
  projects with `d3-geoAlbers` (Texas) / `d3-geoAlbersUsa` (US),
  emits three TS modules under `app/assets/geo/` (`texas.ts`,
  `texas-counties.ts`, `us-states.ts`). Outputs are checked in;
  re-run via `npm run build:geo` when upstream sources change.
  No runtime projection or topology library — the component
  imports static SVG path strings.
- New devDependencies: `d3-geo`, `topojson-client`,
  `topojson-server`, `topojson-simplify`, `us-atlas`.
- New tokens: `--chart-1` through `--chart-8` (categorical
  palette across light / dark / HC), `--map-seq-maroon-1..5`,
  `--map-seq-slate-1..5`, `--map-outline`, `--map-flow`. All
  three theme variants override.
- `data/source/` added to `.gitignore` (raw GeoJSON is 13MB+
  and re-fetchable from the TxDOT MapServer).

### Security — `npm audit` cleanup, 8 → 0 vulnerabilities (2026-05)

- `npm audit fix` (no `--force`) applied patch upgrades to
  `nitropack` (open-redirect via wildcard route rules + proxy
  scope bypass), `uuid` (missing buffer-bounds check in v3/v5/v6),
  and `basic-ftp` (unbounded multiline FTP control buffer DoS,
  transitive via Puppeteer's proxy-agent chain).
- `potrace` removed from `devDependencies`. The remaining five
  vulns were a single root cause counted across the
  `phin@2.x → @jimp/core → @jimp/custom → jimp → potrace` chain.
  Potrace was a build-time-only utility (the SVGs it produced
  ship in `public/`); the script
  [`scripts/png-to-svg-logo.mjs`](scripts/png-to-svg-logo.mjs)
  now starts with a fail-fast that prints regen instructions
  (`npm install --no-save potrace jimp@0.16`).

`npm audit` reports `found 0 vulnerabilities` on a clean install.

### Docs — doctrine catch-up

- `design/components.md` — added rows for `TuxDataTable`,
  `TuxRichDataGrid` (main table) and `TuxChartFrame`,
  `TuxChartGeographic`, `TuxChartSunburst`, `TuxMetroInset`
  (Visualizations table). "Want X? use Y" pattern map gains
  five entries (rich data grid, static research table, Texas
  map, multi-metro inset, two-ring radial). Component count
  bumped ~60 → ~70.
- `design/roadmap.md` — new "Recently shipped" section covering
  the data-density and geographic-charts batches plus the
  visual-language evolution prelude. Notes that data-density
  wasn't on the original roadmap and the geographic-charts work
  is adjacent to (not a replacement for) the still-aspirational
  `TuxMapEmbed` Mapbox/Leaflet line.

## [1.1.0] — 2026-05-06

Cuts the accumulated post-v1.0.0 work into a tagged release so
consumers can pin to `github:ttitamu/tti-ux#v1.1.0` and upgrade
deliberately. Substantial new features in the hybrid-chrome family
(below) plus packaging changes that make the GitHub-tag consumption
path real.

### Added — packaging for GitHub-tag consumption
- **`public/CNAME` for `ux.tti.tamu.edu`.** Pins the custom domain
  in the Pages artifact so deploys don't drop the Settings → Pages
  custom-domain value on republish — the source of recent HTTPS
  cert flakiness, since the cert is provisioned per-domain and only
  after the domain is locked in.
- **`main` + `files` in `package.json`** so consumers get a clean
  package shape: layer config (`nuxt.config.ts`), `app/`, `design/`,
  `docs/`, `public/`, plus README/CHANGELOG/tsconfig. Everything
  else (scripts, contrast-report, dist, node_modules) stays out.
- **Runtime deps moved from `devDependencies` to `dependencies`** —
  `@iconify-json/lucide`, `@tailwindcss/vite`, `@tanstack/vue-table`,
  `@tanstack/vue-virtual`, `tailwindcss`. These are needed at build
  time in any consumer that extends the layer or installs the
  package, so they have to be runtime deps. (The pure tooling deps
  — `@nuxt/devtools`, `puppeteer`, `potrace`, `serve-handler`,
  `typescript` — stay in devDependencies.)
- **README consumption guide** rewritten around
  `extends: ["github:ttitamu/tti-ux#v1.1.0"]` as the primary path,
  with `file:../tti-ux` kept as a local-dev fallback.

### Hybrid chrome (PECAN-driven)

App-shape consumers (PECAN, tti-ai-studio) need a "I'm in an
application" chrome that wasn't quite expressible with the current
TuxSiteNav + TuxDropdown + TuxMegaMenu set. v1.1.0 adds the missing
hooks so the institutional + docs + app patterns can all share one
component family. All changes additive; no breaking changes for
marketing-surface consumers.

### Added — hybrid chrome
- **`TuxSiteNav` `#trailing` slot** — renders inside
  `.tux-site-nav__bar-inner` after the primary nav, with a
  left-border separator from the nav. App-shape consumers drop
  a utility cluster (search trigger, notifications bell, theme
  toggle, user dropdown) into the slot; marketing surfaces leave
  it empty and rely on the upper utility bar (`utilityNav` prop).
- **`PrimaryNavItem.to`** — now valid alongside `dropdown` /
  `megaMenu`. When set, the trigger LABEL becomes a real
  `NuxtLink` (clicking → navigate; hover/focus still opens the
  panel). Use the route the operator most likely wants when
  they "just click on the section name" — typically the area's
  overview/index.
- **Route-aware active states on TuxDropdown + TuxMegaMenu.**
  Each menu computes:
  - `isTriggerActive` — true when the route matches `to` exactly
    OR is a strict descendant path OR matches any descendant
    item's `to`. Renders the trigger with a 2px maroon
    bottom-border (with reserved-slot pattern so the active
    state doesn't shift the label vertically).
  - `isItemActive(item)` — exact-route match. Renders the item
    with `--active` modifier: 9% maroon background tint + 2px
    maroon left rail (via `box-shadow: inset`) + bold label +
    `aria-current="page"`.
  - Auto-close on navigation via `watch(() => route.fullPath, …)`.
  Same `--active` shape applied to plain primary-nav links via
  `TuxSiteNav.isPlainLinkActive` so all three primary-nav variants
  share one visual language.

### Fixed
- **Active-state on `?query=` and `#hash` routes** —
  `TuxDropdown.isItemActive`, `TuxMegaMenu.isItemActive`, and
  `TuxSiteNav.isPlainLinkActive` were comparing `route.path === target`
  which strips both the query and hash. Items like
  `/policies?tab=approvals` and `/admin#fleet` never lit up; worse, on
  a query-filtered route the bare-path sibling (`/policies`) STAYED
  active, so two siblings claimed the indicator at once. Extracted the
  matching rules into a shared `app/utils/nav-active.ts` helper with
  two functions:
  - `isExactActive(target, route)` — segment-aware exact match (path +
    query + hash). A bare-path target only lights up on a "neutral"
    route (no query, no hash); a query/hash target requires an exact
    match. This is what individual items + `aria-current="page"` use.
  - `isSectionActive(target, route)` — path-only prefix match. This is
    what triggers and section indicators use, since `?tab=` / `#anchor`
    don't change which section the operator is in.
  Also picked up by `TuxDocsSidebar` so doc anchors work the same way.
- **Trigger + item clickability under hover-open state** —
  `TuxDropdown` / `TuxMegaMenu` / `TuxSiteNav` / `TuxFooter` were
  rendering navigable elements via `<component :is="triggerComponent">`
  + `v-bind="linkAttrs(item)"` where `triggerComponent` resolved a
  `NuxtLink` from a string at runtime. Under hover-open state, clicks
  on the trigger were being eaten intermittently (vue-router didn't
  always have the resolved component reference at click-handling time).
  Replaced with explicit `<NuxtLink v-if> / <a v-else-if> / <button
  v-else>` branches across all four components — vue-router gets the
  static component reference at compile time and clicks land
  reliably. Verbose, but the cost is cheap and the bug it prevents is
  user-visible.

### Changed
- **`TuxMegaMenu` panel sizing** — was `position: absolute; left:
  0; right: 0; max-width: 80rem` but anchored to the trigger
  `<li>` (which had `position: relative` for TuxDropdown's
  per-trigger panels). Result: panel inherited the narrow
  trigger box; columns stacked vertically because
  `auto-fit minmax(11rem, 1fr)` had no horizontal room. Fixed by
  anchoring the panel right-edge-to-trigger
  (`right: 0; left: auto`), sizing it to its content
  (`width: max-content`), capping at
  `min(48rem, calc(100vw - 2rem))` with a `min-width: 20rem`.
  Three columns now lay out side-by-side; visually consistent
  with TuxDropdown (same border, shadow, density).
- **Layer-rooted CSS paths in `nuxt.config.ts`** — `~/` resolves
  to the consumer's `app/`, not the layer's, so
  `~/assets/css/tokens.css` in the layer's nuxt.config breaks
  consumers when they `extends` the layer. Now uses
  `dirname(fileURLToPath(import.meta.url))` →
  `resolve(layerDir, "app/assets/css/...")`. Same fix applied
  to `app/pages/icons.vue`'s import (was `~/utils/lucide-names`,
  now `../utils/lucide-names`).

### Token additions
- **TTI gold palette** added to `app/assets/css/tokens.css`
  (50→950 anchored at #DDAC37 = 500). Was a planned follow-up
  documented in v1.0.0; now upstream so any consumer can flip
  `warning: amber → gold` in their `app.config.ts` without a
  local `tokens.css` shim.

### Documentation
- **Internal-tool footer exception**. The "one footer component,
  vary content via `columns` and `social` props" guidance still
  applies to public institutional surfaces. But internal-tool
  consumers (PECAN, future internal admin tools) should drop
  TuxFooter entirely — the marcom shape (state-resource columns,
  social row, TAMUS legal strip) is sized for tti.tamu.edu, not
  for single-audience tools whose operators already know they
  work for the institute. PECAN ships its own `PecanOpsFooter`
  (~40px slim strip with version pill + helpdesk + © anchor)
  as the documented exception.

## [1.0.0] — 2026-04-27

First versioned release. The catalog has been stable for three product
consumers (PECAN, tti-ai-studio, the style guide itself) for several
weeks; cutting v1 makes the consumption story (`file:../tti-ux` for
now, npm package later) explicit instead of implicit.

### Added — accessibility tooling + AAA conformance
- **`/accessibility` page** with the formal conformance statement:
  WCAG 2.2 AA target; color contrast verified at AAA across all
  three themes (light, dark, high-contrast).
- **`/contrast-audit` page** renders every contrast-risk surface
  in three themed columns simultaneously (one per `data-theme`).
- **`scripts/audit-contrast.mjs`** uses puppeteer + the WCAG 2.1/2.2
  contrast formula to compute ratios for every text/background
  pair on the audit page. Reports both AA and AAA pass counts in
  one run; gates on AAA when `AUDIT_LEVEL=AAA` is set (CI default).
- **`audit-contrast.yml`** workflow runs on every push + PR. CI
  fails if any contrast pair drops below AAA.
- **Token revisions** to clear AAA across the board:
  - light `--text-secondary` #5d5d5d → #424242 (8.97:1 on white)
  - light `--text-muted` #6F6F6F → #525252 (7.05:1 on white)
  - light `--color-success` → #3D5328, `--color-error` → #A02828,
    `--color-info` → #1F5D66
  - dark `--brand-primary` #d2718c → #e795a8 (7.92:1 on dark page)
  - dark `--brand-secondary` → #8ab7e2, `--color-error` → #F59292,
    `--color-success` → #ABCC8E, `--color-info` → #9BD4E0
  - HC `--text-muted` → #4D4D4D, `--color-error` → #A02828
  - new `--brand-fill` token for filled maroon panels (always
    #5C0025 in light/dark, #500000 in HC) so brand-primary can
    lighten in dark mode for text legibility without compromising
    panel contrast.
- **Tailwind v4 `@theme` cascade workaround**: re-bound every
  `--color-*` alias inside `[data-theme="tti-dark"]` and
  `[data-theme="tti-hc"]` because Chrome freezes `@theme`
  variable references at `:root` scope. Without this, theme
  overrides on raw tokens didn't propagate to Tailwind utility
  classes.

### Changed — BREAKING
- **`TuxFooter` is now the unified institutional footer.** Earlier
  releases shipped three separate components for the page anchor
  (slim `TuxFooter`, `TuxMarketingFooter`, `TuxSubfooter`); they're
  collapsed into a single `TuxFooter` that renders the maroon
  marketing block + the mandatory TAMUS legal strip in one
  component. Every shipped TTI surface needs the same anchor —
  having three pieces was over-decomposition.
  - **Migration**: replace `<TuxFooter ... /><TuxSubfooter />` (and
    any `<TuxMarketingFooter />` usage) with a single
    `<TuxFooter :columns="..." :social="..." />`. Pass empty
    arrays for `columns` and `social` to get the slim app-shape
    (just identity block + legal strip).
  - **Removed components**: `TuxMarketingFooter` (lived for one
    commit), `TuxSubfooter` (replaced by the legal-strip section
    of the new TuxFooter).

### Added
- **`/changelog` page** — renders this file via the same MDC pipeline
  as `/design/[doc]`. Linked from the welcome page header and the
  "What's new" section.
- **"Welcome" sidebar group** — Home + Changelog above Foundations.
- **`v1.0.0` version pill** — surfaced in the header lockup and the
  welcome eyebrow, sourced from `package.json`.
- **Welcome-page polish** — "Recent updates" timeline, CTA buttons
  (Doctrine / Components / Repo), tighter pitch covering all three
  downstream consumers.

## Unreleased

### Added — Priority A roadmap batch (2026-04-29)
Status states, banners & tags, and dedicated form-primitive
state-matrix pages. Closes Priority A in `design/roadmap.md`;
~60 Tux\* components total now in the catalog.

**Status states (3 new components):**
- **`TuxErrorPage`** ([app/components/TuxErrorPage.vue](app/components/TuxErrorPage.vue))
  — full-page 404 / 500 / 403 / 503 template. Editorial display-type
  status numeral, icon medallion, title + lede, recovery actions
  (TuxButton row), optional support / status-page slot. Per-code
  defaults (icons, copy, actions); slots and props override anything.
  Use as Nuxt's `error.vue` or inline via the `inline` prop.
- **`TuxSkeleton`** ([app/components/TuxSkeleton.vue](app/components/TuxSkeleton.vue))
  — placeholder shapes for loading states. Six composed presets
  (`card` / `list` / `table` / `article` / `media` / `stat`) plus
  primitive mode (`width` / `height` / `variant`). Three animation
  modes: shimmer (default · 1.6s linear gradient sweep), pulse
  (cheaper opacity oscillation for dense lists), never (opt-out for
  print / screenshots). **Honors `prefers-reduced-motion: reduce`
  automatically** — collapses to a static tint, no movement, per
  the roadmap spec. SR-only "Loading…" label on a `role="status"`
  region; decorative shapes are `aria-hidden`.
- **`TuxStepper`** ([app/components/TuxStepper.vue](app/components/TuxStepper.vue))
  — numbered-circle multi-step indicator. Status auto-derives from
  `currentIndex` (done · active · todo); per-step `error` override.
  Two orientations (`horizontal` collapses to `vertical` below
  ~30rem container width via container query, not viewport). Optional
  `to` per step renders the node as `NuxtLink` for jump-back
  navigation. Renders as `<nav aria-label>` with `aria-current="step"`
  on the active item. Use for funding applications, IRB
  submissions, study onboarding.

**Banners & tags (3 new components):**
- **`TuxAnnouncementBanner`** ([app/components/TuxAnnouncementBanner.vue](app/components/TuxAnnouncementBanner.vue))
  — top-of-page dismissable strip for site-wide notices. Distinct
  from `TuxAlert` (page-body admonition) — this is chrome that sits
  above the page header, full-width, persists across routes.
  Dismissal persists in `localStorage` keyed by `id` prop; emits
  `dismiss` for consumers driving their own persistence. Four
  tones: `info` (blue), `success` (green), `warning` (gold),
  `urgent` (maroon fill — reserves for service outages, security
  advisories).
- **`TuxCookieConsent`** ([app/components/TuxCookieConsent.vue](app/components/TuxCookieConsent.vue))
  — privacy notice required on public TTI surfaces. Bottom-right
  floating card or full-width bottom strip (`position` prop).
  Decision (`accepted` / `rejected` / `custom`) persists in
  `localStorage` and emits via `decision` event so consumers can
  gate analytics. **Surface only**; per-category UI lives in the
  `#categories` slot — the host owns category names and wiring.
  Necessary cookies are implicitly accepted (no toggle).
- **`TuxBetaRibbon`** ([app/components/TuxBetaRibbon.vue](app/components/TuxBetaRibbon.vue))
  — environment / lifecycle label. Three variants picked by host
  context, not aesthetic preference: `corner` (diagonal ribbon in
  the page corner — full-deploy preview environments / staging),
  `stripe` (top-of-page horizontal full-width — production-shaped
  deploys with non-prod data, public betas), `pill` (inline — feature-
  level beta tags, per-page indicators). Three tones: `preview`
  (gold), `beta` (navy), `dev` (warning red). Maintenance windows
  belong on `TuxAnnouncementBanner tone="urgent"` — content notice,
  not chrome label.

**Form primitives — 6 dedicated state-matrix pages, no new
components:** the existing `/forms` page explicitly stated "No Tux
wrappers here yet" — Nuxt UI's form primitives don't need deviation
to fit the brand. The roadmap's intent was breaking the inline
catch-all into focused per-primitive pages, not new wrappers.
- **`/forms` is now a landing** ([app/pages/forms/index.vue](app/pages/forms/index.vue))
  with 6 tiles + a link to the legacy all-in-one demo (now at
  `/forms/all-in-one`).
- **`/forms/text-field`** — `UInput` + `UTextarea` state matrix:
  default · focus · filled · disabled · readonly · error · with
  helper · with counter · auto-resize · trailing button · leading icon.
- **`/forms/select`** — `USelectMenu` with descriptions (TAMUS
  classification tiers), searchable combobox, creatable values,
  multi-select.
- **`/forms/choice`** — `UCheckbox` group with select-all +
  indeterminate parent; `URadioGroup` with descriptions and inline
  orientation; "when to reach for which" decision section.
- **`/forms/date-picker`** — native `UInput type="date"` with
  helper, min/max bounds, range-input pattern, plus
  `time` / `datetime-local` / `month` / `week`.
- **`/forms/file-upload`** — drag-drop dropzone, file list with
  per-file progress + status icons, error and complete states.
  Working sketch; consuming apps wire the actual upload backend.
- **`/forms/inline-validation`** — live patterns: character counter,
  phone-number mask, NIH grant ID mask, async "this email is taken"
  with debounced check. Inline patterns; "why no Tux wrapper"
  rationale.

**Wiring:**
- Sidebar nav: 6 new entries in the alpha-sorted Components group
  (`TuxAnnouncementBanner`, `TuxBetaRibbon`, `TuxCookieConsent`,
  `TuxErrorPage`, `TuxSkeleton`, `TuxStepper`); the "Forms" entry
  in the Composition group is replaced by a dedicated **Forms**
  group with an overview link and 6 sub-pages + the all-in-one
  demo. Components catalog ([components/index.vue](app/pages/components/index.vue))
  + home grid ([pages/index.vue](app/pages/index.vue)) + doctrine
  table + pattern coverage map all updated.
- New `pattern-coverage` entries: "Loading placeholder" → Skeleton,
  "404 / 500 page" → ErrorPage, "Multi-step flow indicator" →
  Stepper, "Site-wide notice strip" → AnnouncementBanner, "This
  isn't production label" → BetaRibbon, "Privacy / cookie consent" →
  CookieConsent.

### Added — design-kit port (chat primitives + reports section)
- **Chat primitives — five components** ported from the tti-ai-chat
  React/JSX kit. They were previously demo mocks; now they're real
  Vue SFCs in the catalog so a future tti-ai-chat Nuxt project can
  consume them via the same `file:../tti-ux` link the other consumers
  use.
  - **`TuxChatMessage`** ([app/components/TuxChatMessage.vue](app/components/TuxChatMessage.vue)) —
    one conversation turn. `role="user"` or `role="assistant"`; the
    assistant variant sits on `--surface-sunken` so model output reads
    as a distinct visual lane. Slots for citations, tools, and
    avatar.
  - **`TuxCitations`** ([app/components/TuxCitations.vue](app/components/TuxCitations.vue)) —
    numbered source list under an assistant message. Three-column
    grid (rank · body · score) so paths can ellipsize without
    pushing the score off-screen.
  - **`TuxComposer`** ([app/components/TuxComposer.vue](app/components/TuxComposer.vue)) —
    chat input with optional compliance scope banner. Two-zone layout
    (textarea + toolbar). Built-in model picker, corpus-attach,
    char counter, and ⌘↵-to-send. Slot in a `TuxAlert variant="compliance"`
    via the `#scope` slot for ITAR / restricted-corpus framing.
  - **`TuxConversationList`** ([app/components/TuxConversationList.vue](app/components/TuxConversationList.vue))
    — left-rail history grouped by temporal bucket (TODAY · YESTERDAY
    · THIS WEEK · …). 3px maroon left border + 10%-tint background
    on the active item.
  - **`TuxContextPanel`** ([app/components/TuxContextPanel.vue](app/components/TuxContextPanel.vue))
    — right-rail surface for grounding context (corpus, retrieval,
    usage). Slot-driven; the panel contributes the chrome (border,
    scroll, width, padding scheme) and the host arranges sections.
- **New `/reports` section — finished-narrative deliverables.**
  Paper · PDF · print. The reader reads top-to-bottom.
  - **`TuxReportFrame`** ([app/components/TuxReportFrame.vue](app/components/TuxReportFrame.vue))
    — page-sized canvas (letter / a4, portrait or landscape) for
    PDF export and print. Editorial or compact density. Draws a
    paper-sheet shadow on screen; goes flush borderless under
    `@media print`. Visualizations, stats, and prose go inside.
  - **`TuxReportPrintSheet`** ([app/components/TuxReportPrintSheet.vue](app/components/TuxReportPrintSheet.vue))
    — drop-in print stylesheet. Renders nothing on screen; injects
    a `<style media="print">` into the head via `useHead`. Hides
    chrome marked `data-print="hide"`; paginates with
    `data-print-break="before|after|avoid"`.
  - **Reports landing** ([app/pages/reports/index.vue](app/pages/reports/index.vue))
    — overview tiles, scope explainer (what's a report vs a viz).
- **New `/visualizations` section — interactive data surfaces.**
  BI dashboards · R artifacts · future native charts. The reader
  pivots, filters, drills in. Distinct from Reports because the
  chrome and posture are different (provider chip, sandbox, source
  caption), and the deliverable lives inside the app, not on paper.
  - **`TuxVizEmbed`** ([app/components/TuxVizEmbed.vue](app/components/TuxVizEmbed.vue))
    — branded chrome around a Tableau / Power BI / Apache Superset
    / Grafana iframe. Provider chip + open-in-new + per-provider
    sandbox + loading/error states. New `posterSrc` prop renders a
    static image fallback when the live tenant isn't reachable
    (style-guide demos, air-gapped previews).
  - **`TuxVizRPlot`** ([app/components/TuxVizRPlot.vue](app/components/TuxVizRPlot.vue))
    — branded chrome around an R-language plot artifact. Three
    kinds (`image` PNG/JPG, `svg` via `<object>`, `html` for
    htmlwidgets in a sandboxed iframe). Source-line caption for
    `sessionInfo()` or script path.
  - **Visualizations landing** ([app/pages/visualizations/index.vue](app/pages/visualizations/index.vue))
    — overview tiles, reports-vs-viz explainer, link to roadmap
    for native charts.
- **Demo poster artwork** so visualization demos render even
  without a live tenant: `public/viz-poster-tableau.svg`
  (TTI-corridor crash-rate bars), `public/viz-poster-powerbi.svg`
  (sponsored-research executive overview), `public/viz-poster-grafana.svg`
  (PECAN ingestion time-series + heatmap),
  `public/viz-rplot-grants.svg` (faceted ggplot2 by quarter).
- **TTI road-glyph SVG** ([public/TTI-glyph.svg](public/TTI-glyph.svg))
  — institutional road mark isolated from the full TTI lockup.
  Used as the `TuxChatMessage` assistant avatar (replaces the
  earlier `tx` italic placeholder).
- **Sidebar nav: new "Reports" + "Visualizations" groups** between
  "Composition" and "Tooling". Reports group has Frame + PrintSheet;
  Visualizations group has Embed + RPlot.
- **Sidebar housekeeping**: added "Roadmap" link in the Design
  group (`/design/roadmap` was reachable but unlinked); collapsed
  the redundant `TuxSiteNav` / `TuxDropdown` / `TuxMegaMenu` trio
  (all three pointed at the same demo page) into a single
  `TuxSiteNav` entry.

### Added — reports + visualizations build-out (2026-04-29)
Rounds out both new sections so they read as more than the
two-component minimum the design-kit port shipped with.

- **`TuxReportWebFrame`** ([app/components/TuxReportWebFrame.vue](app/components/TuxReportWebFrame.vue))
  — long-form, web-hosted narrative canvas. Same Reports family as
  `TuxReportFrame` (finished narrative, read top-to-bottom), but
  rendered as an HTML page rather than an 8.5×11 sheet. Cover
  (eyebrow / title / lede), byline + date + reading-time row,
  optional sticky right-rail TOC, body slot with editorial
  typography rhythm, footer slot for source / publication line.
  Three measure widths (`narrow` ≈ 56ch, `default` ≈ 70ch, `wide`
  ≈ 82ch). Sibling sidebar entry under Reports.
  - **Why a new component instead of just composing TuxPageHeader
    + free sections:** TTI's web-hosted reports (annual report,
    research findings, accreditation summaries) want a deliberately
    bounded reading frame with cover, byline, optional TOC, and
    closing source line. Composing those primitives ad-hoc per page
    drifted; the frame canonicalizes the rhythm.
  - **Why it's a Report, not a Visualization:** the reader still
    reads top-to-bottom. The web/paper distinction is output medium,
    not posture. A Visualization is something the reader pivots and
    filters.
  - Demo at [/reports/web-frame](app/pages/reports/web-frame.vue)
    with a full sponsored-research example (cover · TOC · summary ·
    findings with a TuxFactoid · methods · data · what's next).
- **`TuxSparkline`** ([app/components/TuxSparkline.vue](app/components/TuxSparkline.vue))
  — inline mini trend line. No axes, no legend, no tooltip. Native
  SVG; no chart library. Five tones (`brand` / `success` / `error`
  / `warning` / `neutral`), all theme-aware across light / dark /
  HC. Optional area fill, last-point marker, and right-aligned
  delta arrow (`+12%` percent or `+4.9` absolute). The SVG carries
  an auto-derived `aria-label` and matching `<title>` summarizing
  the trend ("Trend: 10 points, low 61, high 84, last 84 (+35.5%
  from first)"); pass `units="$M awarded"` to suffix the summary.
  - **First native chart in the catalog.** Shipped ahead of the
    full `TuxChartBar` / `TuxChartLine` family because it's small
    (no axes, no legend, no library) and the demand was already
    clear: pair with `TuxBigStat` / `TuxFactoid` for KPI rows.
  - Demo at [/visualizations/sparkline](app/pages/visualizations/sparkline.vue).
- **`TuxVizGrid`** ([app/components/TuxVizGrid.vue](app/components/TuxVizGrid.vue))
  — small-multiples layout primitive for the Visualizations
  section. 2-, 3-, or 4-up panes of `TuxVizEmbed` / `TuxVizRPlot`
  (or any visualization-shaped child) with shared editorial header
  (eyebrow / title / dek), consistent gap, and optional footer
  slot for source / data-cutoff / caveat copy. Container-queried —
  collapses to single-column under ~32rem and to 2-up between
  ~32rem and ~56rem. Doesn't repaint pane chrome; layout only.
  - **Why a layout primitive instead of just CSS Grid in the host:**
    a shared editorial header above N panes is a recurring pattern
    (an exec dashboard with three Power BI tiles; a regional
    small-multiples set of one Tableau viz). The grid implies "these
    belong together" — meaningful editorial signal, worth a
    component.
  - Demo at [/visualizations/grid](app/pages/visualizations/grid.vue)
    with two-up Tableau + Power BI and three-up Grafana stages.
- **Reports landing rewritten** ([app/pages/reports/index.vue](app/pages/reports/index.vue))
  — three tiles instead of two, each tagged with the output medium
  (paper · PDF / print stylesheet / web-hosted). New "Pick by
  output medium" decision section.
- **Visualizations landing rewritten** ([app/pages/visualizations/index.vue](app/pages/visualizations/index.vue))
  — four tiles, each tagged with kind (BI iframe wrapper / R
  artifact wrapper / layout primitive / native mini chart). Scope
  note now reads "TuxSparkline ships as the first native chart;
  the broader family is still on the roadmap" instead of "all
  native charts are pending".
- **Doctrine table updates** ([design/components.md](design/components.md))
  — Reports table grows an "Output medium" column (`paper · PDF` /
  `print stylesheet` / `web (HTML page)`). Visualizations table
  picks up TuxVizGrid + TuxSparkline rows. Pattern coverage map
  picks up six new "want X? use Y" entries (sparkline, the three
  report flavors, BI dashboard, R artifact, small-multiples).
- **Roadmap reconciled** ([design/roadmap.md](design/roadmap.md))
  — "Recently shipped" block updated to current names
  (`TuxReportEmbed` / `TuxReportRPlot` were renamed to
  `TuxVizEmbed` / `TuxVizRPlot` mid-batch and the roadmap still
  carried the old names). TuxSparkline crossed off Priority B.

### Renamed (since 1.0.0; not yet released)
- `TuxReportEmbed` → **`TuxVizEmbed`**, demo route
  `/reports/embed` → **`/visualizations/embed`**
- `TuxReportRPlot` → **`TuxVizRPlot`**, demo route
  `/reports/rplot` → **`/visualizations/rplot`**
- Rationale: Tableau / Power BI / Grafana / R artifacts are
  *visualizations*, not *reports*. TTI uses both words and they
  mean different things (reports = finished narrative on paper;
  visualizations = interactive surface in the app). The split
  makes the IA match the institutional vocabulary.
- **`design/roadmap.md`** — Vue-shaped backlog adapted from the
  aggieux JSX-kit roadmap. Charts, maps, tabs, side-sheet, comments,
  tooltips, and a11y-doc pages organized by priority tier. Replaces
  the previous "we know what's missing but it's not written down" gap.
- **ADR-0008 — Data-display components stay flat; reports get their
  own section.** ([docs/adr/0008-data-display-and-reports-section.md](docs/adr/0008-data-display-and-reports-section.md))
  Documents the decision and the criteria for adding a future route
  group (chrome, discoverability, mass).
- **Motion + spacing tokens** in `tokens.css`:
  - `--motion-fast: 0.15s` · `--motion-base: 0.25s` · `--motion-slow: 0.35s`
  - `--ease-standard` (default), `--ease-emphasis` (overshoot for the
    corner-drop signature), `--ease-exit` (symmetric ease-in-out).
  - `--space-0`, `--space-4`, `--space-10`, `--radius-none` —
    supplements for places Tux components reach into a CSS var
    directly (inline styles, `calc()`).

### Added
- **TuxFooter `brandLockup` prop — official institutional artwork
  beneath the social row.** The footer's identity column has the
  square glyph + HTML wordmark for chrome-density purposes; the new
  prop layers in the official horizontal lockup PNG (logo + wordmark
  in one piece) so consumers see the canonical institutional artwork
  on the maroon marketing ground. Defaults to `/TTI_white.png` for
  TTI; sibling institutions override with their own white-on-
  transparent variant; pass `null` to hide. Capped at 16rem × 2.75rem
  so it doesn't compete with the institution name above it.
  - Three new public assets: `TTI-Color.png` (maroon road glyph,
    light backgrounds), `TTI-black.png` (mono black, print/legal),
    `TTI_white.png` (light variant, dark/maroon backgrounds).
- **Doc-site chrome batch — TuxDocsSidebar, TuxTOC, TuxSiteNav,
  TuxDropdown, TuxMegaMenu.** Fills the navigation-and-doc-shape gap
  identified after the previous batch. The catalog had `TuxIdentity`
  (the lockup) but no actual menu components, and no doc-site
  sidebar / TOC for technical documentation.
  - **`TuxDocsSidebar`** ([app/components/TuxDocsSidebar.vue](app/components/TuxDocsSidebar.vue)) — hierarchical
    sidebar built on native `<details>` + recursive
    `TuxDocsSidebarNode`. Active-route highlighting (including
    ancestors), inline search filter with match highlighting,
    sessionStorage-persisted collapse state per consumer.
  - **`TuxTOC`** ([app/components/TuxTOC.vue](app/components/TuxTOC.vue)) — article table-of-contents.
    Auto-detects H2/H3 from a target element on mount, tracks active
    heading via `IntersectionObserver`, smooth-scrolls on click,
    updates URL hash without triggering a full navigation. Pairs
    with `TuxDocsSidebar` for the canonical three-column doc layout.
  - **`TuxSiteNav`** ([app/components/TuxSiteNav.vue](app/components/TuxSiteNav.vue)) — institutional top-bar
    with TuxIdentity lockup + optional utility strip + primary nav.
    Mobile hamburger drawer included. Five AggieUX site types
    (University / Center / Department / Application+nav / Application-only)
    all expressible via composition.
  - **`TuxDropdown`** ([app/components/TuxDropdown.vue](app/components/TuxDropdown.vue)) — single-column
    dropdown panel. Used as a primary-nav item in TuxSiteNav, also
    works standalone for inline "more actions" patterns.
    Hover/focus open with diagonal-path delay; Escape closes.
  - **`TuxMegaMenu`** ([app/components/TuxMegaMenu.vue](app/components/TuxMegaMenu.vue)) — full-width
    multi-column panel from a top-bar item, with optional featured
    tile (eyebrow + title + description + image) on the right.

### Changed
- **TuxFooter legal strip drops the gold "A" medallion** next to the
  TAMUS lockup. The medallion was a placeholder glyph standing in
  for an actual TAMUS-system mark and read as ornament rather than
  signal; the eyebrow + name lockup carries the affordance on its
  own.
- **TuxDiagram styling pass.** Swapped from Mermaid's `default` theme
  to `base` so all themeVariables actually apply; expanded the
  brand-mapping (primary/secondary/tertiary fills, sequence-actor
  styling, note styling for both light + dark modes); type sized
  down from 16px to 13px Open Sans so diagrams don't dominate
  editorial body context. Error surface replaced the raw parser
  dump with a hint about quoting unquoted special characters + a
  collapsible details for the parser output. Demo source for the
  flowchart fixed (the `<br/>` inside an unquoted node label was
  failing to parse — wrapped in `"…"` per Mermaid's syntax).

### Added
- **Authoring + content batch — TuxCodeBlock, TuxDiagram, MDC integration.**
  Closes the gap between "components for app surfaces" and "components
  for prose surfaces" (docs, blog, ADRs, marcom WordPress migration).
  - **`TuxCodeBlock`** ([app/components/TuxCodeBlock.vue](app/components/TuxCodeBlock.vue)) — standalone
    Shiki-backed code block. Distinct from `TuxExample` (which is for
    component demos with Vue/HTML reveal tabs) — this one is for
    embedded code samples in docs/blog/ADRs. Lazy-loads the requested
    grammar on mount so the SSR bundle stays clean. Theme tracks
    page color-mode (light / dark / high-contrast). Filename caption
    + line numbers + copy button optional.
  - **`TuxDiagram`** ([app/components/TuxDiagram.vue](app/components/TuxDiagram.vue)) — Mermaid wrapper for
    diagrams-as-code (flowcharts, sequence diagrams, ERDs, gantt).
    Mermaid is a real ~3MB dep, so the component lazy-imports it on
    mount — pages that don't render a diagram pay nothing. Brand
    palette mapped into Mermaid's themeVariables. Render errors
    surface inline with the parser message. Pulse + spin animations
    respect `prefers-reduced-motion`.
  - **`@nuxtjs/mdc` integration** — markdown rendering with Vue
    components inline. Configured in `nuxt.config.ts` with the same
    Shiki theme set the rest of the system uses. Tux components are
    auto-imported via Nuxt's existing resolver, so authors can
    invoke them with the `::tux-alert{variant="warning"}` block
    syntax without per-component setup. Live demo + syntax crib
    sheet at `/markdown` shows source + rendered side-by-side.

- **Pattern coverage map** in [design/components.md](design/components.md) — explicit
  "want X? use Y" table covering tags (`TuxBadge kind="tag"`),
  admonitions (`TuxAlert`), inline callouts, blockquotes, Q&A, code,
  diagrams, MDC, forms, tables, search, A–Z nav, sidebar widgets,
  signups, big stats, factoid rows. Surfaces the catalog's
  easiest-to-miss component names so newcomers don't ship duplicates.

- **`TuxCodeMaroon`** ([app/components/TuxCodeMaroon.vue](app/components/TuxCodeMaroon.vue)) — institutional
  emergency alert banner. TAMUS's Code Maroon is the mandatory
  emergency-notification system; Rellis Campus (where TTI lives)
  routes through `https://rellis.tamus.edu/emergency/` —
  `detailsUrl` defaults to that for TTI consumers, override for
  non-Rellis sites. Three severities (alert/warning/info) with
  hard-coded colors that **don't theme** (no `tti-dark` / `tti-hc`
  override — visual recognition matters more than palette
  consistency during emergencies). Defaults to non-dismissible per
  institutional convention; pass `dismissible` + v-model to allow
  dismissal. Sticky-position support via `sticky` prop. Pulsing
  siren icon respects `prefers-reduced-motion`. Demo at
  `/components/code-maroon`.
- **Catalog mop-up — five last components** closing out every
  AggieUX catalog entry relevant for the three target consumers.
  Shipping these makes the system feature-complete for the marcom
  reveal:
  - **`TuxLinkSlab`** ([app/components/TuxLinkSlab.vue](app/components/TuxLinkSlab.vue)) — full-width
    horizontal band of prominent links. The "footer-of-section
    navigation" pattern; distinct from `TuxLinkList`'s multi-column
    grouped list. Three tones (plain / neutral / maroon).
  - **`TuxSidebarBlock`** ([app/components/TuxSidebarBlock.vue](app/components/TuxSidebarBlock.vue)) — generic
    sidebar widget wrapper. Eyebrow + maroon-underline title +
    content slot. Three variants (default / bordered / filled).
    Compose any content inside — lists of NuxtLinks (auto-styled),
    `TuxDescriptionList`, prose, etc.
  - **`TuxQACollection`** ([app/components/TuxQACollection.vue](app/components/TuxQACollection.vue)) — long-form
    Q&A editorial pattern. Always expanded — designed to be read
    top-to-bottom. Companion to `TuxAccordion kind="faq"` (which is
    collapsible for scanning). Maroon "Q." marker + bold question +
    flowing answer prose, with optional "see also" link list per item.
  - **`TuxSignupFeature`** ([app/components/TuxSignupFeature.vue](app/components/TuxSignupFeature.vue)) —
    newsletter signup block. Heading + dek + bordered email input +
    uppercase action + consent line. Three tones, three style
    variants. Self-contained.
  - **`TuxAlphaNav`** ([app/components/TuxAlphaNav.vue](app/components/TuxAlphaNav.vue)) — A–Z jump bar
    for directory and glossary pages. Two modes: anchor (sets
    `window.location.hash` for in-page jumps) or emit
    (filter-in-place via v-model). Letters not in the dataset
    render dimmed and disabled.

  All five use container queries per ADR 0007. The catalog's
  "Ideas not yet shipped" section is now empty — every aspirational
  entry the AggieUX kit catalogued has shipped.

- **Composition examples** — three "what does this enable" pages
  assembling 9–13 Tux\* components each into real-shape surfaces:
  - **`/examples/pecan-dashboard`** ([app/pages/examples/pecan-dashboard.vue](app/pages/examples/pecan-dashboard.vue)) —
    IT-facing index overview. TuxBreadcrumbs, TuxPageHeader (with
    media slot), TuxFactoid, TuxAlert, TuxTreemap, TuxFilterPanel,
    TuxSearch, TuxBadge, TuxPagination, TuxDescriptionList,
    TuxSectionHeader, TuxCallout. (13 components.)
  - **`/examples/research-landing`** ([app/pages/examples/research-landing.vue](app/pages/examples/research-landing.vue)) —
    public-facing program hero. TuxPageHeader (hero + maroon),
    TuxFactoid, TuxBlockquote (drop-cap), TuxMediaSlab (split),
    TuxIconFeature, TuxCardSlab, TuxNewsCollection, TuxTestimonial,
    TuxCTA, TuxLinkList. (10 components.)
  - **`/examples/tti-ai-studio-session`** ([app/pages/examples/tti-ai-studio-session.vue](app/pages/examples/tti-ai-studio-session.vue)) —
    LLM/agent session view. TuxBreadcrumbs, TuxPageHeader, TuxAlert
    (compliance), TuxSectionHeader, TuxCallout, TuxDescriptionList,
    TuxFactoid, TuxAccordion, TuxCommandPalette. (9 components.)
  - **`/examples`** ([app/pages/examples/index.vue](app/pages/examples/index.vue)) — the
    index page. Cards on the landing page promote it.
- **ADR 0007** ([docs/adr/0007-container-queries-over-viewport-media-queries.md](docs/adr/0007-container-queries-over-viewport-media-queries.md)) —
  captures the WHY behind the container-query convention. Cross-
  references the gitignored CLAUDE.md and the
  `design/components.md` guidance section that enforce it for
  human + AI contributors.
- **`#extra` slot on TuxFooter** — for inline left-side content
  alongside the version + © (high-contrast toggle in the style
  guide; system-status indicators or session counts in product
  consumers).

### Changed
- **Style-guide chrome eats its own dogfood.** The repo's `app.vue`
  no longer hand-rolls the header lockup or footer — it uses
  `<TuxIdentity level="center" superhead="Texas A&M Transportation
  Institute" name="tti-ux">` for the header, `<TuxFooter>` for the
  app-level strip, and `<TuxSubfooter>` for the mandatory TAMUS
  legal block. The high-contrast toggle moves into TuxFooter's
  new `#extra` slot. Net effect: the live style guide is now a
  real example of itself, and any rough edges in the chrome
  components surface in the place they're most visible.

- **Container queries replace viewport media queries on layout-shifting
  components** ([TuxPageHeader](app/components/TuxPageHeader.vue),
  [TuxMediaSlab](app/components/TuxMediaSlab.vue),
  [TuxCardSlab](app/components/TuxCardSlab.vue),
  [TuxCTA](app/components/TuxCTA.vue),
  [TuxNewsCollection](app/components/TuxNewsCollection.vue),
  [TuxBreadcrumbs](app/components/TuxBreadcrumbs.vue)).
  Each component declares its own `container-type: inline-size` +
  named container, then uses `@container <name> (min-width: …)` for
  layout breakpoints. **Why:** with the old viewport-based queries, a
  component embedded in a 600px demo wrapper inside a 1200px viewport
  would think it had room for a two-column layout it couldn't fit. With
  container queries, breakpoints fire on the component's own width — so
  the same component renders correctly whether it's at full page width,
  inside a sidebar tile, or inside a narrow article column.
- **Hero typography uses `clamp()` with `cqi` units** for fluid scaling.
  Hero-rhythm titles, slab titles, news titles, and CTA titles now
  scale smoothly with the container width instead of jumping at a
  breakpoint. e.g. `font-size: clamp(2rem, 1.2rem + 4.5cqi, 3.5rem)`
  on the hero page-header title.
- **TuxTreemap tooltip flips on canvas edges** instead of overflowing.
  When the cursor is past the canvas midpoint, the tooltip anchors to
  the cursor's opposite side using `right`/`bottom` instead of
  `left`/`top`. Removes the bug where hovering near a corner sent the
  tooltip off-screen.

### Added
- **Catalog completion + tier 2/3 product batch** — seven components
  closing out the AggieUX catalog backlog and unblocking the tier 2/3
  product surfaces:
  - **`TuxContactCard`** ([app/components/TuxContactCard.vue](app/components/TuxContactCard.vue)) — faculty / staff
    directory card. Portrait + credentials + role + typed contact rows
    (email/phone/web/office/location, with auto `mailto:` and `tel:`).
    Vertical or horizontal layout.
  - **TuxPageHeader extended** — same component, three new dimensions:
    `tone="neutral|maroon"` for backgrounded panels,
    `rhythm="hero"` for landing-page sized headings,
    `#media` slot for two-column hero treatments,
    `#actions` slot for trailing CTAs. Existing call sites unchanged.
  - **`TuxMediaSlab`** ([app/components/TuxMediaSlab.vue](app/components/TuxMediaSlab.vue)) — full-bleed hero
    band, "big photo moment". Overlay or split layout, three heights,
    three placeholder tones.
  - **`TuxCardSlab`** ([app/components/TuxCardSlab.vue](app/components/TuxCardSlab.vue)) — full-bleed band of
    media-forward cards. The "browse our programs" pattern. Three
    aspect ratios, 2/3/4-up grid, whole-card click w/ corner-drop hover.
  - **`TuxPagination`** ([app/components/TuxPagination.vue](app/components/TuxPagination.vue)) — page-number
    controls. Native Vue (not UPagination) — squarified active page,
    ellipsis truncation, optional status line, configurable
    sibling/boundary count.
  - **`TuxCommandPalette`** ([app/components/TuxCommandPalette.vue](app/components/TuxCommandPalette.vue)) — global
    ⌘K jump bar. Native `<dialog>` (free focus trap + scrim + ESC),
    grouped commands w/ live filter, keyboard navigation, action or
    navigation per command. Single instance at app root.
  - **`TuxTreemap`** ([app/components/TuxTreemap.vue](app/components/TuxTreemap.vue)) — squarified
    hierarchical-size visualization, PECAN's headline chart. Pure SVG
    implementation of the Bruls-Huijsen-van Wijk algorithm — no viz
    library dependency. Click to drill, breadcrumb to zoom out, log-
    scaled maroon ramp, hover tooltip. 4 unit modes
    (bytes/count/percent).
- **Marketing surface batch** — five components that round out the
  marketing/landing surface coverage. Marcom's eventual review now sees
  every common content block, not gaps:
  - **`TuxPhotoGrid`** ([app/components/TuxPhotoGrid.vue](app/components/TuxPhotoGrid.vue)) — uniform image
    grid. `kind="photo"` (4:3, captions, full color) or
    `kind="logo"` (1:1, grayscale-on-hover wall). Auto-fits columns,
    placeholder gradients for design mocks before real assets land.
  - **`TuxCaptionedMedia`** ([app/components/TuxCaptionedMedia.vue](app/components/TuxCaptionedMedia.vue)) — single
    inline image (or video frame via `#media` slot). Four aspect ratios
    (16:9 / 4:3 / 1:1 / 3:4), three alignment treatments
    (full / wide / right-floated for prose).
  - **`TuxNewsCollection`** ([app/components/TuxNewsCollection.vue](app/components/TuxNewsCollection.vue)) — institutional
    news-index pattern. Stacked list (thumb left, copy right) for /news
    landing pages, or grid (thumb above, 2 or 3 cols) for hub-page
    "recent news" sections. Dates render as `<time>` with ISO datetime.
  - **`TuxIconFeature`** ([app/components/TuxIconFeature.vue](app/components/TuxIconFeature.vue)) — the classic
    "our services" / "focus areas" block. Icon-in-tinted-circle +
    headline + body + CTA. Three tones cycle (maroon/navy/gold). Grid
    or list layout.
  - **`TuxLinkList`** ([app/components/TuxLinkList.vue](app/components/TuxLinkList.vue)) — categorized resource
    list. "For sponsors / for partners / for students" footer-of-section
    pattern. Optional descriptions per link, auto-detected external
    arrows, `featured: true` for maroon left-bar emphasis.
- **Editorial breadth batch** — four components that round out the
  marketing/content surface coverage so marcom's eventual review sees a
  finished system rather than a partial scaffold:
  - **`TuxBlockquote`** ([app/components/TuxBlockquote.vue](app/components/TuxBlockquote.vue)) — standalone
    editorial pull quote. Two layouts (centered with rules above/below;
    magazine-style drop-cap) and three style variants. Companion to
    `TuxCallout` (which is the inline aside).
  - **`TuxTestimonial`** ([app/components/TuxTestimonial.vue](app/components/TuxTestimonial.vue)) — attributed
    quote collection with portrait + name + role. Grid (cards, 2 or 3
    cols) or row layout. Circular gradient portrait placeholders cycle
    through maroon/navy/gold; pass `image` for real photos.
  - **`TuxAccordion`** ([app/components/TuxAccordion.vue](app/components/TuxAccordion.vue)) — FAQ + publication
    disclosure. Native `<details>`/`<summary>` (zero-JS, perfect a11y).
    `kind="publication"` switches to citation rhythm with italic title +
    meta line. `single` mode for mutually-exclusive groups.
  - **`TuxDescriptionList`** ([app/components/TuxDescriptionList.vue](app/components/TuxDescriptionList.vue)) — term /
    definition pairs as native `<dl>`. `editorial` emphasis for marketing
    surfaces (event details, exhibit captions); `data` emphasis for
    product metadata (PECAN file detail, classifier specs).
- **Tier 1 navigation + chrome batch** — five components that unblock
  shipping PECAN, tti-ai-studio, and tux's own surfaces:
  - **`TuxSearch`** ([app/components/TuxSearch.vue](app/components/TuxSearch.vue)) — branded inline search bar
    with attached uppercase action button. Two sizes (regular 60px / slim
    51px), real working v-model, custom action label/icon. Demos at
    `/components/search`.
  - **`TuxFilterPanel`** ([app/components/TuxFilterPanel.vue](app/components/TuxFilterPanel.vue)) — left-rail
    facet panel for list pages. Collapsible facet groups via native
    `<details>` (zero-JS, perfect a11y), checkbox lists with counts,
    applied-filter chips, Clear all. v-modeled as flat
    `Record<string, string[]>` for easy wiring to OpenSearch / TanStack.
    Demos at `/components/filter-panel`.
  - **`TuxIdentity`** ([app/components/TuxIdentity.vue](app/components/TuxIdentity.vue)) — institutional header
    lockup. Two kinds (lockup / text-only) × two orientations (horizontal /
    stacked) × three hierarchy levels (institution / center / department).
    Replaces the aspirational header rhythm work. Demos at
    `/components/identity`.
  - **`TuxFooter`** + **`TuxSubfooter`** ([app/components/TuxFooter.vue](app/components/TuxFooter.vue),
    [app/components/TuxSubfooter.vue](app/components/TuxSubfooter.vue)) — paired closer for every TTI surface.
    TuxFooter is the slim app-level compliance strip (version + © +
    utility links); TuxSubfooter is the **mandatory TAMUS legal strip**
    (Texas A&M University System requirement). Per AggieUX guidance the
    subfooter content is fixed — only the institute name + address +
    year are configurable. Demos at `/components/footer`.
- **Earlier in this Unreleased cycle: four editorial/data Tux\* components**
  driven by the same product needs:
  - **`TuxBigStat`** ([app/components/TuxBigStat.vue](app/components/TuxBigStat.vue)) — single oversized metric
    with three sizes (lg/md/sm), three tones (maroon/gold/neutral), and
    style-variant-aware numeral face. Demos at `/components/big-stat`.
    Replaces the aspirational `BigStat` from `design/components.md`.
  - **`TuxCallout`** ([app/components/TuxCallout.vue](app/components/TuxCallout.vue)) — pulled-aside editorial
    accent (fact / stat / quote) with style-variant left rule (gradient /
    stacked-bars / diagonal-hash). Demos at `/components/callout`.
  - **`TuxBreadcrumbs`** ([app/components/TuxBreadcrumbs.vue](app/components/TuxBreadcrumbs.vue)) — page-depth
    navigation. Home icon, italic intermediates, pipe-rule separators
    that collapse to chevron under 35rem. Demos at `/components/breadcrumbs`.
    Replaces the aspirational `PathCrumbs` from `design/components.md`.
  - **`TuxCTA`** ([app/components/TuxCTA.vue](app/components/TuxCTA.vue)) — big promotional block, three tones,
    two-column at ≥48rem with action slot. Demos at `/components/cta`.
- **Three style variants — `.style--bold` / `.style--elegant` / default** —
  CSS scopes in `tux.css` plus a live `/style-variants` page demoing
  side-by-side. `.style--bold` rebinds `--font-display` to Work Sans and
  introduces the stacked-bar section signature + `.dot-grid` accent +
  `.card-static--bold` rectangular top-bar variant. `.style--elegant`
  rebinds to Georgia and introduces the diagonal `.hash-pattern` +
  dotted maroon borders + `.card-static--elegant`. Default style is
  implicit (no class needed) and renders the Oswald + maroon-hairline
  rhythm via `.section-header`.
- **Four-family lane tokens** in `tokens.css` — `--font-body` (Open Sans),
  `--font-display` (Oswald), `--font-bold` (Work Sans),
  `--font-elegant` (Georgia). Additive — legacy `--font-sans`
  (Public Sans) unchanged.
- **`TuxFactoid` component + `/components/factoid` demo page** — the
  institutional "by the numbers" block. Numeral face changes per
  variant (Open Sans 700 / Work Sans 800-italic / Georgia italic),
  three densities (3/4/5-up at 96/72/56px). Replaces the aspirational
  `<BigStat>` from `design/components.md`.
- **`/preview` page + `public/preview/`** — 28 standalone HTML specimen
  cards (typography, color, spacing, components, brand motifs) served
  from `/preview/*.html` and indexed via iframe grid. Each loads
  `/colors_and_type.css` directly — framework-free — so designers can
  lift one into a deck without pulling Nuxt. `colors_and_type.css` and
  `fonts/` mirrored into `public/` for portable use.
- **`/kits` page + `public/kits/`** — five static reference kits carried
  from the portable design-system download: `aggieux` (~57-family
  component catalog), `pecan` / `tti-docs` / `tti-ai-chat` (three
  application-shape demos showing tux primitives composed into product
  surfaces), and `slides` (deck-stage slide system). All five render in
  vanilla CSS + React via Babel-in-the-browser. Treat as frozen design
  reference — the Tux*.vue components are authoritative when they
  disagree.

### Changed
- **Renamed `app/assets/css/aggieux.css` → `tux.css`** — completes the
  aggieux → tux rename. `nuxt.config.ts` and all comments/blurbs in
  components, pages, ADRs, and design docs updated to match. The
  `aggieux` name now refers exclusively to the upstream Texas A&M
  MarCom AggieUX kit (snapshot in `reference/aggieux/`, copy in
  `public/kits/aggieux/`, sync scripts in `scripts/sync-aggieux*.mjs`)
  — not to our own design system. ADR 0004 file renamed to
  `0004-tux-tokens-separate-from-nuxt-ui-theme.md`.
- **Renamed `design/aggieux.md` → `design/tux.md`** — the system is named
  tux (Aggie + UX); the older `aggieux.md` filename was a holdover from
  the initial PECAN extraction. Content also adopts the **four-family
  typography rule** (Open Sans / Oswald / Work Sans / Georgia +
  JetBrains Mono) and documents the three section styles
  (`default`/`bold`/`elegant`) — superseding the earlier Public
  Sans-as-default framing. Public Sans remains loaded by `@nuxt/fonts`
  for legacy components.
- **Theme toggle split** — the header toggle is now **light ↔ dark only**
  (`tti ↔ tti-dark`). High-contrast mode (`tti-hc`) moved to a dedicated
  footer button, because WCAG AAA's line weights read as "broken" in a
  casual theme cycle and users shouldn't be pushed through an
  accessibility mode as part of aesthetic preference. See
  [ADR 0006](docs/adr/0006-separate-hc-from-casual-theme-toggle.md) —
  supersedes the three-way cycle from ADR 0005 (the palette itself
  stays).

### Added
- **Initial scaffold** (2026-04-24) — Nuxt 4 runnable style guide, extracted
  from PECAN's frontend so tti-ux can serve as the source of truth for
  downstream Nuxt apps.
- **7 Tux\* components** wrapping Nuxt UI primitives where TTI branding
  requires deviation:
  - `TuxAlert` — 8 admonition variants (note/tip/info/important/success/
    warning/danger/compliance) with left-bar treatment.
  - `TuxBadge` — 5 shapes (tier/status/tag/count/default).
  - `TuxButton` — single `intent` prop for primary/secondary/ghost/destructive.
  - `TuxCard` — static or linked; linked has corner-drop hover signature.
  - `TuxModal` — editorial rhythm (eyebrow + gold-bar title).
  - `TuxSectionHeader` — aggieux ALL-CAPS heading with maroon underline.
  - `TuxTable` — maroon-wash header, auto status-cell rendering via TuxBadge.
- **3 themes** — `tti` (default), `tti-dark` (warm-charcoal dark), `tti-hc`
  (WCAG AAA high-contrast). Three-way cycle in the header toggle.
- **Style-guide pages**:
  - `/` — landing with foundations + components grid.
  - `/tokens` — brand palette, semantic roles, status colors, maroon ramp,
    shadows, radii.
  - `/typography` — heading utilities, type scale, inline treatments.
  - `/motion` — spacing ramp, duration tiers, corner-drop demo, Transition
    example.
  - `/components` + `/components/{alert,badge,button,card,modal,
    section-header,table}` — per-component demos.
  - `/forms` — inputs, textarea, select, radio, checkboxes, switch, slider,
    chip input, date, validation + focus-ring notes.
  - `/patterns` — empty state, loading skeleton, table-state cycle,
    confirmation flow pointer, admonition stack.
- **Placeholder tuxedo SVG logo** — maroon jacket, gold bow tie, white shirt
  front, charcoal frame. Needs iteration with a polished mark.
- **Design docs** (`design/`) — `aggieux.md`, `components.md`, `palette.md`,
  `tokens.json` — carried from PECAN.
- **Dev server binds :3030** — avoids collision with PECAN and docs-tti-tamu-edu
  on :3000.

### Known gaps

- No npm publish yet — downstream apps must consume via `file:../tti-ux`
  and `extends: ['tti-ux']` in their nuxt.config.ts.
- No git remote yet — local repo only; will push to `ttitamu/tti-ux` when
  the empty remote exists.
- PECAN still ships its own copies of the 5 `Pecan*` wrappers. Layer
  consumption wiring is a separate follow-up.
- Style Dictionary pipeline for `design/tokens.json` → `tokens.css` isn't
  wired; `tokens.css` is hand-maintained for now.
- `warning` Nuxt UI color = Tailwind `amber`; a TTI-gold-anchored palette
  would back it properly — inherited TODO from PECAN.
