# Spike: tux → Web Components (ADR-0012 gating spike)

**Question:** Can tux components — including the ~70% that wrap Nuxt UI —
compile to framework-neutral custom elements that run outside Nuxt, with
visual parity? (ADR-0012's make-or-break unknown.)

**Answer: Yes.** Verdict 2026-06-03.

## How to run

```sh
npx vite --config spike/web-components/vite.config.ts
# open http://localhost:5199/  → use the theme buttons
```

## What it does

Compiles two **unmodified** real components straight from `app/components/`
into **light-DOM** custom elements (`defineCustomElement(C, { shadowRoot:
false })`) and registers them on a plain HTML page:

- `<tux-big-stat>` — tux-native (scoped styles + token CSS vars).
- `<tux-badge>` — wraps Nuxt UI `UBadge` + `UIcon`.

## Findings

1. **Nuxt UI survives the custom-element boundary.** `TuxBadge` renders
   with **zero console errors/warnings**. The mechanism:
   - `@nuxt/ui/vite` plugin → same component/composable auto-imports as Nuxt.
   - `@nuxt/ui/vue-plugin` installed via Vue 3.5
     `defineCustomElement({ configureApp(app){ app.use(ui) } })`.
2. **Light DOM is the right call.** `shadowRoot: false` lets the global
   stylesheet (Tailwind + `@nuxt/ui` + `tokens.css` + `tux.css`) style the
   elements exactly as in the Nuxt app — the visual-parity mechanism from
   the migration thesis. (Shadow DOM would wall the global CSS off.)
3. **Token theming flows through automatically.** Flipping
   `document.documentElement.dataset.theme` between `tti` / `tti-dark` /
   `tti-hc` re-themes the custom elements with no JS — same `data-theme`
   contract the Nuxt app uses.
4. **Brand parity is a config port, not a blocker.** Out of the box Nuxt
   UI's `primary` defaulted to its own green. Replicating
   `app/app.config.ts` `ui.colors` (`primary → maroon`, …) in the Vite
   plugin mapped the badges onto the TTI palette — the maroon shade vars
   (`--color-maroon-50…950`) already live in `tokens.css`.

## Consumer caveat (for the codegen phase)

Custom elements expose complex props as **attributes**. React < 19 needs a
thin wrapper (or refs) to bind object/array props and custom events; React
19 handles them natively. String/number props (most components) work as
plain attributes already. This wrapper is exactly what the Custom Elements
Manifest–driven generator will emit.

## Files

- `vite.config.ts` — Vite + `vue()` + `@nuxt/ui/vite` (auto-import + colors).
- `main.css` — global CSS chain (Tailwind, @nuxt/ui, tokens, tux utilities).
- `main.ts` — defineCustomElement registrations.
- `index.html` — plain HTML host + theme switcher.
