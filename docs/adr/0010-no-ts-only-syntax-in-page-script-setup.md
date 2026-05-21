# ADR 0010 — No TypeScript-only syntax in `pages/**/*.vue` `<script setup>`

- **Date**: 2026-05-21
- **Status**: Accepted

## Context

While shipping
[`TuxChartLine`](../../app/components/TuxChartLine.vue) and its
showcase route at
[`/visualizations/chart-line`](../../app/pages/visualizations/chart-line.vue),
the page failed to load with a cryptic Babel error:

```
Unexpected token, expected ','
```

The offending line was a perfectly valid TypeScript cast on a band-
tuple literal:

```ts
const bandSeries = [
  {
    band: [[38, 46], [44, 52], ...] as Array<[number, number]>,
  },
];
```

Same syntax in
[`app/components/TuxChartLine.vue`](../../app/components/TuxChartLine.vue)'s
`<script setup>` loads fine. The error reproduces consistently in
`pages/**/*.vue` files and only there.

### Root cause

Nuxt's macro-extraction pipeline re-parses each page's `<script
setup>` block by appending `?macro=true` to the module specifier
and running it through Babel **without** the TypeScript plugin —
just JavaScript syntax + Vue macros. The point is to discover
`definePageMeta`, `definePageLayout`, and similar without paying
the full TS parse cost.

The side effect: any TS-only syntax — `as` casts, explicit type
annotations on `const`, `satisfies` operator — makes the macro
parse fail and the whole route module 500.

This is **not** a `vue-tsc` problem (vue-tsc handles the syntax
fine). It's not an ESLint problem either. It's specific to Nuxt's
route-module loader, and the error surface is a route 500 with a
generic Babel message.

## Decision

In `pages/**/*.vue` `<script setup>` blocks, **don't use TypeScript-
only syntax**. Specifically:

- ❌ `as` casts (`[...] as const`, `value as Foo`, etc.)
- ❌ Explicit type annotations on `const` (`const x: Foo[] = [...]`)
- ❌ `satisfies` operator
- ❌ `enum`, `namespace`, `declare`, other TS-only declarations

What's fine:

- ✅ `interface` / `type` declarations
- ✅ `defineProps<Props>()` (Nuxt unwraps this macro itself)
- ✅ `withDefaults(defineProps<Props>(), { ... })`
- ✅ `defineEmits<{ ... }>()`
- ✅ `defineSlots<{ ... }>()`
- ✅ Generic type parameters on macros (`ref<Foo>(...)`)
- ✅ Type-only imports (`import type { Foo } from "..."`)

The common case is letting inference do the work. If a tuple-typed
literal would benefit from a cast, restructure the call instead:

```ts
// In a page <script setup>:
//
// ❌ const band: Array<[number, number]> = [[1, 2], [3, 4]];
// ❌ const band = [[1, 2], [3, 4]] as Array<[number, number]>;
// ✅ const band = [[1, 2], [3, 4]];  // inferred number[][]
```

For runtime consumers that iterate pairs (TuxChartLine's band path,
TuxCardCarousel's items), `number[][]` is functionally equivalent to
`Array<[number, number]>`. The cast was only for intellisense.

If a page genuinely needs a TS-only construct — say, a complex type
discriminator on a union — extract the typed code to a sibling
`*.ts` file or a `composables/`/`utils/` helper and import it. The
page's `<script setup>` stays Babel-compatible.

## Why not adjust Nuxt's macro extractor

Nuxt's macro pipeline is upstream tooling we don't own. The "no
TS-only syntax in pages" rule is cheap (a contributor convention),
self-enforcing (the page literally won't load otherwise), and
maintains a clean separation between page-shape config (macros) and
business logic (composables/components).

## Why not push it into a lint rule

There's no off-the-shelf ESLint rule for this exact restriction.
Writing a custom rule would catch it earlier but adds maintenance
burden; the route-500 failure mode is loud enough that the rule
self-enforces in practice. Revisit if we hit this more than
~2 times/year.

## Consequences

- **Contributor docs**: this ADR is the canonical reference.
  Discipline doc ([`tti-ux-shipping-discipline`][1] memory)
  carries the short form.
- **Existing pages**: the `pages/visualizations/chart-line.vue`
  fix landed in the 2026-05-21 roadmap-clear push (remove the
  `as Array<[number, number]>` cast; let inference give
  `number[][]`).
- **Component files** (`components/**/*.vue`) are unaffected — they
  go through a different code path that includes the TS plugin.
- **Future Tux page components** with chart/data literals: use the
  inference pattern. If a contributor adds a TS cast and gets the
  Babel error, this ADR is the doc to point them at.

[1]: external memory; not in-repo.

## References

- The chart-line file's inline comment:
  [`app/pages/visualizations/chart-line.vue`](../../app/pages/visualizations/chart-line.vue)
  lines 25–31.
- Nuxt route-module loader uses `?macro=true` query — see
  `@nuxt/kit`'s template-utils for the parse path.
