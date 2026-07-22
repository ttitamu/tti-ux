# Primer Web (Community)

**Source:** Figma file `VPvp3itFIwCej3iLiHWx6R`
**Captured:** 2026-05-19
**Priority:** high
**Status:** absorbed — TuxRemovableChip shipped + TuxFilterPanel refactored 2026-05-20; deferred follow-ups for minor verifications

![cover](./cover.png)

## What it actually is

**GitHub's design system** — open-sourced as `@primer/react` /
`@primer/css` / `@primer/primitives`. 67 pages, biggest sample we've
absorbed yet. Editorial-leaning, institutional tone, light/dark/HC
theme model that mirrors TUX's own `themes.tti` / `themes.tti-hc`
split. This is the closest **principle-aligned** Figma reference in
the project.

Frames rendered into this folder for visual reference:
- `tokens-overview.png`, `tokens-colors.png` — Primer's "Token"
  component (dismissible chip), not a token catalog
- `page-header-various.png` — 8 PageHeader implementations
- `blankslate-set.png` — 6 Blankslate variants
- `markdown-formatting.png` — turned out to be a CSS-grid placeholder,
  not the actual MD spec; skipped
- `form-control-validation.png` — tiny validation-message render

## What I rendered vs. what I didn't

Primer's Figma file is huge (67 pages, many with sub-component frames
rather than overview demos). I focused on six strategically-chosen
pages and described the rest from inventory rather than render every
component. The pages I didn't visually render but DID consider via
inventory:

- **DataTable** (17 frames at 1500×10285) — too tall to render usefully
- **ActionList** (36 frames), **ActionMenu** (4 frames) — menu/list family
- **Avatars**, **Labels**, **CounterLabel**, **StateLabel** — badge family
- **Banner**, **Announcement**, **Toast**, **InlineMessage** — alert family
- **Header**, **NavList**, **TabNav**, **UnderlineNav**, **UnderlinePanels**,
  **SegmentedControl** — nav/tab family
- **Button**, **IconButton**, **ButtonGroup** — button family
- **CommentBox**, **Dialog**, **Overlay**, **Popovers**, **Tooltips**,
  **TreeView**, **Pagination**, **SelectPanel**, **Autocomplete**,
  **FilterInput**, **FilterTabs**, **ProgressBar**, **Skeleton loaders**,
  **Spinner**, **Footer** — covered by TUX or Nuxt UI 4 (audited via name)
- **BranchName**, **Diffstat**, **Cursors**, **Subhead (deprecated)**,
  **SubNav (deprecated)**, **Lifecycle Label** — git-specific or
  deprecated; skip

## Three-bucket coverage analysis

### 1. TUX already has it — confirm parity

Primer ships these as separate components; TUX has equivalents.

| Primer | TUX | Notes |
|---|---|---|
| Avatars | (Nuxt UI `UAvatar`) | TUX uses UAvatar directly |
| Banner / InlineMessage / Toast | [TuxAlert](../../../app/components/TuxAlert.vue) (+ Nuxt UI `UToaster`) | TUX adds `tip` and `compliance` variants Primer doesn't have |
| Blankslate | [TuxEmptyState](../../../app/components/TuxEmptyState.vue) | Verify TuxEmptyState supports compact/bordered variants from `blankslate-set.png` |
| Breadcrumbs | [TuxBreadcrumbs](../../../app/components/TuxBreadcrumbs.vue) | |
| Button, IconButton, ButtonGroup | [TuxButton](../../../app/components/TuxButton.vue) + `UButton`/`UFieldGroup` | TUX has 4-intent reduction; Primer has size×variant matrix |
| DataTable | [TuxDataTable](../../../app/components/TuxDataTable.vue) + [TuxRichDataGrid](../../../app/components/TuxRichDataGrid.vue) | TUX uses TanStack Table; Primer's 17 frames worth a future cross-check for column-header sort indicators, row-selection patterns |
| Dialog | [TuxModal](../../../app/components/TuxModal.vue) | |
| Footer | [TuxFooter](../../../app/components/TuxFooter.vue) | |
| Heading | (TuxProse / TuxSectionHeader) | TUX has explicit section-header component with TTI editorial signature (gold underline) |
| Labels (StateLabel, CounterLabel) | [TuxBadge](../../../app/components/TuxBadge.vue) | TUX has `tier` / `status` / `kind` modes |
| Markdown formatting | TUX MDC + [TuxProse](../../../app/components/TuxProse.vue) | Same comparison as Vercel pass: math + code-download are gaps |
| NavList / TreeView | [TuxDocsSidebar](../../../app/components/TuxDocsSidebar.vue) + [TuxTree](../../../app/components/TuxTree.vue) | TUX has both |
| PageHeader | [TuxPageHeader](../../../app/components/TuxPageHeader.vue) | **Philosophical difference — see Tension below** |
| Pagination | [TuxPagination](../../../app/components/TuxPagination.vue) | |
| Popovers / Tooltips | `UPopover` / `UTooltip` | |
| SelectPanel / Autocomplete | `UInputMenu` / `USelectMenu` | |
| Spinner | inline `Icon` w/ `animate-spin` | |

### 2. Nuxt UI 4 has it — use directly

| Primer | Nuxt UI 4 |
|---|---|
| ActionMenu / ActionList | `UDropdownMenu` |
| Checkbox / CheckboxGroup | `UCheckbox` / `UCheckboxGroup` |
| Radio / RadioGroup | `URadioGroup` |
| ToggleSwitch | `USwitch` |
| Select | `USelectMenu` |
| Text Input / Textarea | `UInput` / `UTextarea` |
| FormControls | `UFormField` |
| ProgressBar | `UProgress` |
| Skeleton loaders | `USkeleton` |
| Toast | `useToast()` / `UToaster` |
| TabNav / UnderlineNav | `UTabs` (with `variant="link"`) |
| FilterTabs | `UTabs` (with state) |
| Header | `UHeader` |

### 3. Genuine gaps — Primer ships, TUX + Nuxt UI 4 don't

| Primer pattern | Sketch | Proposed name | Estimated LOC |
|---|---|---|---|
| **Token** (dismissible label/chip — sized, selectable, removable, leading-visual) | Pill with optional leading icon + optional `×` to remove. Variants: size {sm, md, lg, xl} × selected {true, false} × removable {true, false}. Examples: filter chips, tag input pills, recipient chips | `TuxRemovableChip` | ~80 |
| **CommentBox** (markdown editor with toolbar + preview tab) | Toolbar of MD formatting buttons + textarea + preview tab. Probably overlaps with editor surfaces in tti-ai-studio | (defer — too speculative) | n/a |
| **SegmentedControl** (button group with single-select tabbed look) | Like `URadioGroup` styled as connected buttons. Vercel pass also flagged this | `TuxSegmentedControl` (or skip; compose `URadioGroup` ad-hoc) | ~50 |

## Skip

- **Markdown formatting** — Figma frame was a CSS-grid placeholder, not
  the actual GitHub markdown spec. TUX's MDC + Shiki + TuxProse is the
  authoritative reference for what we render
- **BranchName / Diffstat / Cursors** — Git-specific UI for PR/diff
  surfaces; no TUX use case
- **Subhead** ("deprecated, rails only — use PageHeader") — explicitly
  marked deprecated in the page label
- **SubNav** ("deprecated soon") — explicitly marked deprecated
- **Lifecycle Label** — GitHub project-status-specific (Alpha/Beta/Deprecated
  labels). [TuxBetaRibbon](../../../app/components/TuxBetaRibbon.vue) likely covers
  the lifecycle-label slot for TUX
- **GitHub shared components / Maintainers only** — internal Figma
  pages, not consumable patterns

## Absorb

### What surfaced as actionable

**Dismissible chip pattern.** TUX implements this **inside**
[TuxFilterPanel](../../../app/components/TuxFilterPanel.vue) (applied
filters as removable chips at the top). On a closer reading,
[TuxComposer](../../../app/components/TuxComposer.vue) does **not** have a
dismissible chip — its `.tux-composer__chip` class styles the toolbar
trigger button (attach), not a removable label. The attached-corpus
indicator in [`tti-ai-studio-session`](../../../app/pages/examples/tti-ai-studio-session.vue)
is plain `<code>` text, not a chip. So the gap is real but smaller
than initially thought: TuxFilterPanel was the only consumer with
embedded chip code, and extracting it gives a primitive available for
*future* surfaces (tag input, recipient list, multi-select). Primer's
`Token` is exactly this primitive. Shipped as
[`TuxRemovableChip`](../../../app/components/TuxRemovableChip.vue) — slot for
label, optional leading icon, `removable` (emits `@remove`), three
sizes, optional `selected` / `disabled` / `clickToRemove`.

### Pattern confirmations

- **Theme model alignment.** Primer's light/dark/light-high-contrast/
  dark-high-contrast structure mirrors TUX's `themes.tti` /
  `themes.tti-hc` split. Same architecture, different anchor colors.
  Confirms TUX is on a well-trodden path.
- **Blankslate composition** (icon + heading + supporting text +
  primary button + secondary link) matches the standard TuxEmptyState
  composition. Confirm TuxEmptyState supports the compact / bordered
  / non-bordered variants Primer ships; if any are missing, add as
  small prop additions

## Tension

### Compositional vs. integrated PageHeader

Primer's PageHeader is **integrated** — `page-header-various.png` shows
8 implementations where the same component renders title + breadcrumb +
state badge + actions + below-tabs. TUX takes the **compositional**
approach — [TuxPageHeader](../../../app/components/TuxPageHeader.vue) +
[TuxBreadcrumbs](../../../app/components/TuxBreadcrumbs.vue) + ad-hoc
tabs (UTabs) compose separately.

The compositional approach is more flexible (any combination), the
integrated approach is more ergonomic (one component, one config). TUX
defaults to flexibility per the "editorial, not dashboard-y" lean —
editorial surfaces vary widely, dashboards converge.

**Resolution:** keep TUX compositional. If a tti-ai-studio or PECAN
surface starts repeating the same composition pattern (breadcrumb +
TuxPageHeader + UTabs), add a *thin* `TuxAppHeader` that bundles them
— but only when the same pattern appears ≥3 times. Don't pre-build.

### Editorial discipline holds

Across Aggie UX (TAMU) → shadcn (GitHub clones) → Vercel (AI tools) →
Primer (GitHub itself), the pattern is consistent: TUX has more
**institutional / editorial / research** components than any reference
system, and slightly fewer **primitive / dashboard / web-app** ones
(because TUX leans on Nuxt UI 4 for those). Primer doesn't change this.

## Decisions

- Designated Primer as TUX's **theme-model + foundational-patterns
  parity reference**. Less directly actionable than shadcn or Vercel
  (no AI-specific gaps); more confirmation than redirect
- **2026-05-20: Shipped [`TuxRemovableChip`](../../../app/components/TuxRemovableChip.vue)**
  as a standalone primitive for dismissible chips. Distinct from
  TuxBadge (decorative) — this is *interactive*: click-toggleable via
  `selected`, removable via `×` button emitting `@remove`. Props: `icon`,
  `removable`, `size` (sm/md/lg), `selected`, `disabled`, `removeLabel`,
  `clickToRemove` (whole pill removes; × shown as decorative glyph).
  Slot for label.
- **2026-05-20: Refactored [`TuxFilterPanel`](../../../app/components/TuxFilterPanel.vue)**
  to use `TuxRemovableChip` (size `sm`, `clickToRemove`) for the
  applied-filter pills row. Removed ~30 LOC of hand-rolled chip
  markup/styles; behavior preserved (whole-pill click removes; ×
  rendered as decorative affordance). The two-tone label
  (muted-facet-name + bold-value) lives in the page-local styles
  scoped to the slot content.
- **2026-05-20: TuxComposer NOT refactored.** Initial scan suggested
  it had a hand-rolled removable chip; closer reading shows
  `.tux-composer__chip` styles the *attach trigger button*, not a
  dismissible label. No removable-chip code to extract.
- Confirmed TUX's compositional PageHeader approach over Primer's
  integrated one; recorded the threshold (3+ uses) for revisiting

## Open follow-ups

In rough priority order:

1. **Verify [TuxEmptyState](../../../app/components/TuxEmptyState.vue)** supports
   compact / bordered / non-bordered variants matching Primer's
   `blankslate-set.png`. Small prop additions if any are missing
2. **DataTable deep-cross-check** — when [TuxDataTable](../../../app/components/TuxDataTable.vue)
   gets material updates, look at Primer's 17 frames for sort-indicator
   conventions, row-selection patterns, sticky-header treatments. Don't
   pre-do the comparison
3. **`TuxSegmentedControl`** — only if a TUX surface needs a tabbed
   button group that `UTabs` doesn't cleanly express. Probably never.
4. **`TuxCommentBox`** — defer; markdown editor with toolbar is a
   bigger build than is justified speculatively. Possibly relevant for
   tti-ai-studio drafting / annotation surfaces eventually
