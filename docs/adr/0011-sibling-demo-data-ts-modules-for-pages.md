# ADR 0011 — Sibling `*.demo-data.ts` modules for typed page data

- **Date**: 2026-05-23
- **Status**: Accepted
- **Supplements**: [ADR-0010](0010-no-ts-only-syntax-in-page-script-setup.md)

## Context

[ADR-0010](0010-no-ts-only-syntax-in-page-script-setup.md) ruled
TypeScript-only syntax out of `pages/**/*.vue` `<script setup>` blocks
because Nuxt's macro-extraction pipeline re-parses each page with a
JS-only Babel pass. The ADR's prescription was "let inference do the
work" — for the chart-page tuple literals at the time, `number[][]`
was "functionally equivalent" to `Array<[number, number]>` since the
component's runtime just iterates pairs.

That prescription held until we wired `npm run typecheck` into the
CI `quality` job as a blocking gate (2026-05-23). vue-tsc IS strict
about the tuple type and reports four real errors in two showcase
pages:

- `app/pages/visualizations/chart-gauge.vue` — `utilizationBands` /
  `slaBands` infer `intent: string`, but `TuxChartGauge`'s `Band.intent`
  is `"ok" | "warn" | "alert"`.
- `app/pages/visualizations/chart-line.vue` — `bandSeries[].band`
  infers `number[][]`, but `TuxChartLine`'s `Series.band` is
  `[number, number][]`; `brushRange = ref([2, 9])` infers
  `Ref<number[]>`, but `v-model:range` expects `Ref<[number, number]>`.

We tried three in-file workarounds, all of which fail:

| Attempt | Why it fails |
|---|---|
| JSDoc `@type` on the const | TS evaluates the RHS first and checks assignability — doesn't coerce literal widening. |
| Inline JSDoc `@type {const}` casts on each literal | vue-tsc doesn't honor `@type {const}` as a const assertion on expressions. |
| JSDoc `@satisfies` on the const | Same issue as `@type` — the RHS type is computed before the assertion. |

The only mechanisms that actually narrow are `as const`, explicit
type annotations on the literal positions, contextual typing through
a typed function call, or import from a TS module — and the first
three are forbidden by ADR-0010.

## Decision

When a `pages/**/*.vue` `<script setup>` block needs typed data that
inference can't narrow, extract the data to a **sibling `.demo-data.ts`
module** and `import` it.

The naming convention is `<page-name>.demo-data.ts` co-located with
the page. The suffix:

- Makes it obvious at a glance that the file isn't a route or a
  reusable utility — it's data for the adjacent showcase page.
- Won't be picked up by Nuxt's `pages/` routing (only `.vue` files
  are routed by default; `.ts` files in `pages/` are ignored).
- Is greppable as a pattern.

### Concrete shape

```ts
// app/pages/visualizations/chart-line.demo-data.ts
import { ref, type Ref } from "vue";

type BandSeries = {
  key: string;
  label: string;
  data: number[];
  /** [low, high] tuples; same length as `data`. */
  band: [number, number][];
};

export const bandSeries: BandSeries[] = [
  {
    key: "estimate",
    label: "Estimated rate (95% CI)",
    data: [42, 48, 54, 58, 61, 65, 68, 72, 78, 84, 88, 92],
    band: [[38, 46], [44, 52], /* … */],
  },
];

export const brushRange: Ref<[number, number]> = ref<[number, number]>([2, 9]);
```

```vue
<!-- app/pages/visualizations/chart-line.vue -->
<script setup lang="ts">
import { bandSeries, brushRange } from "./chart-line.demo-data";
// rest of the page is plain-JS-friendly as ADR-0010 requires.
</script>
```

The import sits at the top of `<script setup>` — `import/first` ESLint
rule applies. Type-only imports (`import type { … }`) are still allowed
in the page itself per ADR-0010's "fine" list.

## Why not loosen the component prop type instead

The opposite move — widening `Series.band` from `[number, number][]`
to `number[][]` — would let the inferred showcase data through, but
silently breaks the contract for non-showcase consumers (Landscape,
tti-ai-studio) who pass real tuples and rely on the type to catch
mistakes. The showcase pages are demos; they should bend, not the
component contract.

## Why not a typed-factory helper at the top of the page

A pattern like:

```ts
function bands(rows) { return rows; }
const utilizationBands = bands([{ from: 0, to: 60, intent: "ok" }, …]);
```

…can narrow via contextual typing IF the helper has TS parameter
annotations. But TS annotations on the function parameter are TS-only
syntax — forbidden by ADR-0010. The helper would need to live in a
separate `.ts` module anyway, at which point exporting the data
directly (this ADR's pattern) is one fewer indirection.

## Consequences

- **New file convention**: any showcase page that needs typed data
  gets a sibling `<page>.demo-data.ts`. Reviewers should flag inline
  data with non-trivial type narrowing.
- **First adoptions**: `chart-gauge.demo-data.ts` and
  `chart-line.demo-data.ts` shipped 2026-05-23 alongside the typecheck
  CI gate flip to blocking.
- **`pages/` directory contents**: now contains both `.vue` routes and
  occasional `.ts` companions. Nuxt's default routing ignores the
  `.ts` files. If we ever enable `.ts` page extensions, revisit
  the naming (e.g., move to `_demo-data/` subfolders).
- **ADR-0010 isn't superseded** — its constraint and "let inference
  do the work" prescription still apply to most page data. This ADR
  is the escape hatch when inference and the component contract
  disagree.

## References

- [ADR-0010](0010-no-ts-only-syntax-in-page-script-setup.md) — the
  underlying constraint.
- [`app/pages/visualizations/chart-gauge.demo-data.ts`](../../app/pages/visualizations/chart-gauge.demo-data.ts) — first adoption.
- [`app/pages/visualizations/chart-line.demo-data.ts`](../../app/pages/visualizations/chart-line.demo-data.ts) — second adoption.
- [`.github/workflows/audit-contrast.yml`](../../.github/workflows/audit-contrast.yml) — the `quality` job whose blocking typecheck step prompted this work.
