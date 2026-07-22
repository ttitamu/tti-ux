# ADR 0012 — Cross-framework distribution via single-source Web Components

- **Date**: 2026-06-03
- **Status**: Accepted — the gating feasibility spike passed (see "Spike
  outcome" below); the "compile directly from current source" path is
  confirmed, so the fallback re-author path is not required.

## Spike outcome (2026-06-03)

A spike under `spike/web-components/` compiled two **unmodified** real
components to **light-DOM** custom elements (`shadowRoot: false`) and loaded
them in a plain HTML host:

- **`TuxBigStat`** (tux-native, scoped styles + token vars) — rendered
  pixel-correct; `data-theme` switching (`tti` → `tti-dark`) re-themed it
  with zero JS (maroon → documented lifted-teal).
- **`TuxBadge`** (wraps Nuxt UI `UBadge` + `UIcon`) — **rendered with zero
  console errors/warnings.** Nuxt UI survives the custom-element boundary
  via `@nuxt/ui/vue-plugin` installed through Vue 3.5's
  `defineCustomElement({ configureApp })`, with `@nuxt/ui/vite` providing
  the same auto-imports as Nuxt.

Two requirements for full **brand parity** were confirmed as config ports,
not blockers: (1) load the same CSS chain (Tailwind + `@nuxt/ui` + tokens +
tux utilities) globally — light DOM lets it apply; (2) replicate
`app/app.config.ts` `ui.colors` (e.g. `primary → maroon`) into the build —
the maroon shade vars already live in `tokens.css`. With both, the
Nuxt-UI-wrapped badges mapped onto the TTI palette correctly.

**Known consumer caveat (React):** custom elements pass complex props as
attributes; React < 19 needs the generated wrapper (or refs) to bind
object/array props and custom events. React 19 handles them natively.
String/number props (most components) work as plain attributes today. This
is exactly the boilerplate the CEM-driven generator removes.

## Context

tux is authored in Vue 3 + Nuxt UI and today only ships to Nuxt apps via
the layer model (ADR-0003). But the real consumer landscape across TTI is
not Nuxt:

- **~190 WordPress sites** (research microsites + the intranet
  `my.tti.tamu.edu`, which runs **Kadence theme + Kadence Blocks** — i.e.
  already Gutenberg/React, with in-house custom plugins). Page-building
  across the fleet spans **Gutenberg/Kadence Blocks and Elementor**; both
  must be covered.
- **ASP.NET MVC 5.3 Razor** apps (`rims.tti.tamu.edu`) — server-rendered
  `.cshtml`, **Bootstrap 4** + jQuery + FontAwesome, mostly stock classes.
- **Vue 2 SPAs** (`bims.tti.tamu.edu`, Vue CLI on an ASP.NET/IIS backend) —
  **Bootstrap 4** + a hand-rolled `bg-maroon`. Vue 2 is EOL.

The goal is to make tux **easily consumable by everything** as a *bridge*
until consumers migrate to Nuxt/Vue, and to make it cheap for developers:
when they write or update one component, native support for every target
should be **generated**, not hand-maintained.

The migration thesis behind this is deliberate: **change the visuals first,
swap the structure later.** Get every app *looking* like tux through the
shared visual layer while it keeps its existing WordPress / Razor / Vue 2
internals, so that the eventual re-platform to Vue/Nuxt is **invisible to
end users** — nothing appears to change on "upgrade" because the pixels
were already tux. This makes **pixel-level visual parity across every
target a hard requirement**, not a nice-to-have: it is the property the
whole migration depends on.

Two hard constraints shaped the decision:

1. **There is no reliable Vue→React/C# transpiler** for arbitrary
   components. "Author in Vue, get idiomatic React/Razor for free" is not
   real at production quality.
2. **Hand-writing idiomatic components per framework does not scale** to
   190+ consumers with a single maintainer. The maintenance cost, not the
   per-target polish, is the binding constraint.

The only primitive that genuinely runs unmodified in WordPress, React,
Razor, and plain HTML — and can be produced from our existing Vue source —
is the **Web Component (Custom Element)**.

## Decision

1. **Web Components are the cross-framework distribution primitive.** tux
   ships a `<tux-*>` custom-element bundle built from Vue via
   `defineCustomElement`. This is a generated artifact, not a second source
   tree.
2. **The Vue SFC stays the canonical authoring format.** Developers keep
   writing Tux components as they do today.
3. **A Custom Elements Manifest (CEM) is the codegen source of truth.** A
   build step analyzes the components and emits CEM JSON (props/slots/
   events), from which we **auto-generate** the thin per-framework
   adapters: React wrappers (which in turn power Gutenberg `edit`/`save`
   blocks), Razor tag helpers, TypeScript types, and docs. Generated code
   is binding glue, never a reimplementation.
4. **Distribution = CDN-via-jsDelivr now, npm later.** We do not stand up
   or pay for a CDN. jsDelivr serves directly from GitHub
   (`cdn.jsdelivr.net/gh/ttitamu/tti-ux@<tag>/dist/...`), giving WordPress
   sites a `<script>` + `<link>` story **today**, before the npm org of
   ADR-0003 exists. When npm lands, the same artifacts mirror to
   jsDelivr/unpkg and we switch the URL base. This supplements ADR-0003;
   it does not supersede it.
5. **A compiled, Tailwind-free CSS + token kit ships first and broadest —
   it is the visual layer the migration thesis rides on.** It includes a
   **Bootstrap-4 theme variant** (tux tokens → BS4 SCSS variables) and a
   WordPress **global-styles / `theme.json` mapping**. One artifact re-skins
   RIMS (Razor) and BIMS (Vue 2), and — critically for WordPress — restyles
   **Gutenberg/Kadence Blocks *and* Elementor at once**, since both render
   into DOM the global CSS can target. This is the "dogfood the visuals"
   shipment: apps adopt it without changing how content is built. Builds on
   ADR-0004 (tokens already live outside the Nuxt UI theme).
6. **WordPress gets two layers.** Layer 1 is the global-styles CSS above
   (visual parity for the whole fleet, both builders, immediately). Layer 2
   is *authoring* adapters generated from the CEM: native **Gutenberg
   blocks** (via the React adapters) **and Elementor widgets** (Elementor's
   PHP widget + controls API), so authors get first-class tux components in
   whichever builder a site uses. Layer 1 is the priority; Layer 2 follows.
7. **This reverses an earlier informal lean toward hand-idiomatic
   per-framework components.** We consciously trade some native-feel in
   React/Razor (consumers use a `<tux-*>` element rather than a native
   component) for single-source authoring + automatic generation. At
   190-consumer, bridge-period scale, single-source wins.

## Consequences

- **Gating spike — RESOLVED (see "Spike outcome" above):** the concern was
  that the ~70% of Tux components wrapping Nuxt UI primitives might not
  survive the custom-element boundary. The spike proved they do, compiling
  **directly from current source**. The fallback (re-authoring the core as
  tux-native) is therefore not needed. Remaining boundary work — light-DOM
  style loading and the `app.config` color port — is confirmed mechanical.
  The plain-HTML host stands in for any non-Vue host; React/WP differ only
  in the thin prop-binding wrapper noted above, not in whether the element
  runs.
- **Authoring discipline:** a component is cross-framework-eligible only if
  it exposes a clean props/slots/events contract with no reliance on Nuxt
  app context. Some components will remain Nuxt-only, and that is an
  acceptable, documented tier — not every Tux component must cross the
  boundary.
- **New build + CI surface:** compile custom elements, emit CEM, run the
  adapter generators, publish `dist/`, and push versioned tags so jsDelivr
  has stable URLs. This is the first time tux produces a distributable
  build rather than running only as a Nuxt layer.
- **Versioned CDN tags become the update story** for non-npm consumers
  (especially WordPress): pin `@v1.6.0`, bump deliberately. This is the
  cross-framework analog of ADR-0003's "pull and restart."
- **Known custom-element caveats to handle:** form participation
  (form-associated custom elements), SSR/hydration in Razor and WP, and
  style isolation vs. the shared token CSS. These are tracked as pipeline
  work, not blockers.
- **Gutenberg blocks are generated** (the React adapters double as block
  implementations) so they ride the same pipeline. **Elementor widgets are
  the one bespoke WordPress adapter** (Elementor's PHP widget API has no
  React/CEM bridge); they still consume the shared CSS contract, so they
  inherit visual parity even where the generator can't reach.
- **Visual parity is now an acceptance criterion, not a goal.** Because the
  migration thesis depends on the structural swap being invisible, the
  pipeline needs **cross-target visual-regression testing** — the same
  component rendered as Vue (canonical), custom element, Razor, and WP block
  must diff to ~zero against a reference. This is new CI surface beyond the
  existing AAA-contrast and lint/typecheck gates.
- **Rollout order follows the thesis:** ship the global-styles CSS layer
  first (visual parity everywhere, fastest adoption), then the custom-
  element bundle + generated adapters, then per-builder authoring widgets.
  Structure swaps to Vue/Nuxt happen last, per consumer, after the pixels
  already match.
