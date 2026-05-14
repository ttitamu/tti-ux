# Visual language evolution — tti-ux

A running ledger of token-level changes informed by external influence
libraries (Apple HIG, Ant Design, Microsoft Fabric, Material 3, shadcn/ui,
MCP Apps for Claude). Identity decisions — typography, palette, signature
rules — are non-negotiable; what's tracked here is **finishing details**:
focus rings, motion, elevation, density, micro-interaction rhythm.

Keep this short. Each entry should answer: *what changed*, *why*,
*what we lifted from where*.

---

## Batch E-prelude — 2026-05

A token-only refresh shipped before Batch E (data density). All component
families inherit the changes automatically; no per-component edits
required for the base behavior.

### 1 · Two-ring focus token

**Before:** Single 3px maroon ring at 35% alpha (`--shadow-focus`).
**After:** Outer 2px maroon (full opacity) + inner 2px sand halo.

```css
--focus-ring-outer: var(--brand-primary);
--focus-ring-inner: #F2E6C9;            /* sand inner halo */
--shadow-focus:
  0 0 0 2px var(--focus-ring-inner),
  0 0 0 4px var(--focus-ring-outer);
```

**Why:** Reads cleanly on dense surfaces (data tables, form rows) where a
single soft ring gets lost. The sand inner halo is the tux-specific
signature — Ant uses white inner, Fabric uses the surface color; we use
sand to keep the maroon-and-sand color story coherent.

**Variants:** Dark theme uses softened maroon outer + warm-gold inner
halo. HC theme uses pure black outer + white inner at 5px total width.

**Lineage:** Anatomy from Ant Design (two-ring concept) and Fabric (focus
discipline on data-rich surfaces). Color story is tux-original.

### 2 · Transportation-tempo easings

**New tokens** (existing `--ease-standard/emphasis/exit` retained as
back-compat aliases):

| Token              | Curve                             | Use                                |
|--------------------|-----------------------------------|------------------------------------|
| `--ease-survey`    | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | Data tables, forms, disclosures    |
| `--ease-corridor`  | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | Page-level, sheets, modals         |
| `--ease-arrival`   | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Toasts, banners, snapshots locking in |

**Why:** Named for the system's research domain so picking one feels
intentional rather than generic. Three distinct curves give us "measured
/ smooth / decelerate-only" coverage without overshoot, which suits
research-data UIs where playful springs feel out of register.

**Lineage:** Material 3's standard-effects family — `0.2, 0.0, 0.0, 1.0`
maps directly to M3's "emphasized" curve. The naming is tux-original.

### 3 · Four-tier elevation system

**New tokens** layered on top of existing `--shadow-sm/md/lg`:

```css
--elevation-flat:    none;                /* border-only cards */
--elevation-rest:    var(--shadow-sm);    /* quietly lifted (tables, list rows) */
--elevation-hover:   var(--shadow-md);    /* + translateY(-1px) on hover */
--elevation-overlay: var(--shadow-lg);    /* popovers, sheets, modals */
--elevation-pinned:  /* bottom-shadow only */;  /* sticky toolbars/headers */
```

**Why:** Old system had `sm/md/lg` as primitives without role guidance —
some pages used `lg` for cards, others for modals, with no rule. The
four named tiers give every component a predictable elevation language.

**Variants:** Dark theme reduces overlay alpha but keeps the same tier
count. HC theme nukes shadows and uses 2px borders for the overlay tier.

**Lineage:** Microsoft Fabric's elevation discipline (rest/hover/lifted/
dragged). We collapsed their four into a more web-appropriate four with
different role splits.

### 4 · Warm-neutral ramp extension (12 → 18 stops)

**Added intermediate stops** at 150, 250, 450, 550, 650, 750, 850. Tints
warmer/sand-leaning to harmonize with maroon over extended viewing.

| Stop | Hex     | Role                                     |
|------|---------|------------------------------------------|
| 150  | #EFEEED | Row stripe (light), table hover surface  |
| 250  | #DCDBD8 | Sunken-2, sand-leaning                   |
| 450  | #9B9A96 | Warm muted text                          |
| 550  | #86847F | Warm muted-2                             |
| 650  | #6B6964 | Warm secondary                           |
| 750  | #535048 | Warm primary-soft                        |
| 850  | #3A3833 | Warm darkest non-black                   |

**Why:** 6-stop ramp couldn't support row-stripe / hover / selected
states on data tables without using transparent tints (which compound
poorly when stacked).

**Lineage:** shadcn's stone/zinc 12-stop ramps (anatomy reference). Our
hex values are tux-original — warmer than shadcn's neutral grays.

### 5 · Survey-rhythm density baseline

**New rhythm tokens** for data-dense families. Use these *instead of* the
general `--space-*` ramp inside tables, forms, descriptions, lists.

```css
--rhythm-tight:   4px;   /* between input rows in tables; chip-to-chip */
--rhythm-snug:    8px;   /* cell padding, chip padding, icon gap */
--rhythm-normal:  12px;  /* button padding, list-item gap, label-to-input */
--rhythm-loose:   16px;  /* form field gap, card section padding */
--rhythm-roomy:   24px;  /* section breaks, descriptions row gap */
```

**Why:** General `--space-*` is a 4px ramp going up to 96px — too coarse
inside dense data UIs. The rhythm tokens give us a 4-8-12-16-24 baseline
specifically tuned for tables/forms/descriptions, decoupled from
section/page-level spacing decisions.

**Lineage:** Ant Design's 4/8/12/16/24 rhythm. Tokens are tux-original;
the underlying values match Ant exactly.

### 6 · Identity primitives

New asset: `public/identity-primitives.svg`. Exports four `<symbol>`s:

- `#tux-star` — Lone-star reference, geometric 5-point
- `#tux-chevron` — TAMUS-style downward angle bracket
- `#tux-compass` — Compass rose for map-related families
- `#tux-row-grid` — Parallel-lines-getting-denser pavement-stripe pattern

**Use:** `<svg><use href="/identity-primitives.svg#tux-star"/></svg>`,
or inline-include the symbol in a host SVG. All draw with currentColor.

**Why:** We have logos and the wordmark, but no smaller-scale visual
primitives that read as "TTI/TAMUS" without leaning on the full marks.
These are restraint-grade identity moves — corner accents, section
brackets, map decorators.

**Lineage:** None — these are tux-original visual moves.

---

## Batch J — 2026-05

**Visual-language application sweep.** A surface-level pass that applies
the Batch E-prelude tokens across the existing kit *without* needing to
edit every component file. Everything in Batch J is opt-in via CSS
attribute selectors (`data-tux-overlay`, `data-tux-elevation`, etc.) or
new utility classes; the one global rule (J.1) only sets a default
`transition-timing-function`, which inline-declared transitions still
override.

The CSS lives in `app/assets/css/tux.css` under the `BATCH J` heading.
The matching tokens already shipped in `app/assets/css/tokens.css` as
part of the Batch E-prelude.

### J.1 · Transportation-tempo easings applied to common controls

`button`, `a`, `input`, `select`, `textarea`, `[role="button"]`,
`[role="tab"]`, `[role="option"]`, `.tux-card`, and `.card-linked*`
inherit `transition-timing-function: var(--ease-survey)` with
`transition-duration: var(--motion-base)` when the user hasn't requested
reduced motion. Inline JS transitions still win — this is just the
default for any property animated without an explicit curve.

Two opt-in attributes layer onto specific roles:

- `data-tux-overlay` → corridor curve (smoother acceleration, used by
  modals / sheets / popovers / command palette).
- `data-tux-arrival` → arrival curve (decelerate-only, used by toasts /
  banners / snapshots locking in place).

**Why:** Most existing transitions were declared without a curve, which
meant the browser default ease was running. Pinning a curve at the
surface level produces consistent motion even on un-refit components.

### J.2 · Elevation roles via `data-tux-elevation`

```html
<div data-tux-elevation="rest">…</div>
<div data-tux-elevation="overlay">…</div>
```

Maps the five elevation tiers to a single attribute. Strictly additive —
only elements carrying the data-attr get the new shadows. The `hover`
value also applies `transform: translateY(-1px)` so a one-line opt-in
produces the full hover lift.

### J.3 · `.tux-hoverlift` utility

For surfaces that should lift on hover without writing the transition
by hand:

```html
<article class="tux-hoverlift" data-tux-elevation="rest">…</article>
```

The class adds the easing + duration; the hover/focus-within state pulls
in `--elevation-hover` and the -1px translate.

### J.4 · `.tux-mark` utility for identity primitives

Sizes and tints any of the four `<symbol>` primitives from
`/identity-primitives.svg`:

```html
<svg class="tux-mark tux-mark--lg" style="--mark-color: var(--brand-accent)">
  <use href="/identity-primitives.svg#tux-star" />
</svg>
```

Defaults: 16×16, currentColor = `--brand-primary`. Use `tux-mark--lg`
(32px) for section accents, `tux-mark--xl` (56px) for hero marks.

### J.5 · `.tux-section-divider` helper

Eyebrow-with-trailing-rule pattern from the signature library, packaged
as a one-class utility:

```html
<div class="tux-section-divider">Section label</div>
```

Renders the label + a maroon-to-transparent gradient rule. The rule
fades at the right edge, matching the default-style signature rhythm.

### J.6 · ROW grid background via `data-tux-rowgrid`

Subtle vertical-line pattern at 6% maroon, applied as a background
image. Use on hero surfaces, large empty-state panels, or the section-
divider between major page zones. Off by default — opt in:

```html
<section data-tux-rowgrid>Hero content here</section>
```

**Why:** Carries the right-of-way visual DNA without requiring a host to
embed the SVG sprite or manage opacity manually.

### What's not in J

- No component file got rewritten. Everything lives in `tux.css` as
  either a global default (J.1 only, gated by `prefers-reduced-motion`)
  or an opt-in attribute / class.
- No new tokens added — Batch J consumes the existing prelude tokens
  from `tokens.css`.
- No JS changes — the application is pure CSS.

If a future component wants the full visual-language treatment, the
typical opt-in pattern is:

```vue
<aside
  data-tux-overlay
  data-tux-elevation="overlay"
  class="tux-hoverlift">
  …
</aside>
```

**Path note:** In the standalone skill payload these utilities use
`assets/identity-primitives.svg`. Here in the Nuxt repo the asset
lives at `public/identity-primitives.svg`, addressed at runtime as
`/identity-primitives.svg`.

---

## How to use this doc

When you make a token-level change in `app/assets/css/tokens.css` (and
its distributable mirror `public/colors_and_type.css`), add an entry
here:

1. **What changed** (before → after, with code)
2. **Why** (the design pressure that made it necessary)
3. **Variants** (theme-specific overrides if any)
4. **Lineage** (what library informed the anatomy, if any; or "tux-original")

Keep entries short. The point is a traceable history, not a manual.
