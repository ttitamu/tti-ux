# Microsoft Fluent 2 Web (Community)

**Source:** Figma file `eBAffcmxuw7rPGDK5VQpsE`
**Captured:** 2026-05-19
**Priority:** high
**Status:** absorbed — confirmation pass; no new code, two small candidate patterns for future consideration

![cover](./cover.png)

## What it actually is

Microsoft Fluent 2's **web** kit — the parent of the Windows UI kit we
already absorbed, applied to browser surfaces instead of native Windows
chrome. 51 components, broad coverage of typical product UI. Microsoft
has done the dashboard / institutional / product-app patterning at scale
for two decades, so this is the right "thoroughness check" — if Fluent
ships something TUX is missing, it's worth seeing.

Frames rendered for visual reference (six strategic pages — the
Microsoft-specific patterns most likely to surface gaps):
- `persona.png` — Microsoft's user-attribution component
- `info-label.png` — label + `(i)` help tooltip pattern
- `teaching-popover.png` — onboarding/guided-tour tooltip
- `interaction-tag.png` — Microsoft's TuxRemovableChip-equivalent
- `datagrid.png` — Fluent DataGrid variant matrix
- `nav.png` — Fluent Nav (sidebar) component family

## Three-bucket coverage analysis

### 1. TUX or Nuxt UI 4 already has it — confirm no gap

| Fluent | TUX / Nuxt UI 4 |
|---|---|
| Accordion | [TuxAccordion](../../../app/components/TuxAccordion.vue) / `UAccordion` |
| Avatars | `UAvatar` (+ `UAvatarGroup`) |
| Badge | [TuxBadge](../../../app/components/TuxBadge.vue) |
| Breadcrumb | [TuxBreadcrumbs](../../../app/components/TuxBreadcrumbs.vue) |
| Button | [TuxButton](../../../app/components/TuxButton.vue) |
| Card | [TuxCard](../../../app/components/TuxCard.vue) / [TuxCardSlab](../../../app/components/TuxCardSlab.vue) |
| Carousel | `UCarousel` |
| Checkbox | `UCheckbox` |
| DataGrid | [TuxDataTable](../../../app/components/TuxDataTable.vue) + [TuxRichDataGrid](../../../app/components/TuxRichDataGrid.vue) — see Tension below |
| Dialog | [TuxModal](../../../app/components/TuxModal.vue) |
| Divider | `USeparator` |
| Drawer | `UDrawer` / [TuxSlideover](../../../app/components/TuxSlideover.vue) |
| Dropdown | [TuxDropdown](../../../app/components/TuxDropdown.vue) / `UDropdownMenu` |
| Field | `UFormField` |
| Input | `UInput` |
| Label | `ULabel` |
| Link | (`NuxtLink` + Tux link styling in tux.css) |
| List | `UCommandPalette` / inline `<ul>` |
| Menu | `UDropdownMenu` / `UMenubar` (TUX leans on Nuxt UI directly) |
| Message bar | [TuxAlert](../../../app/components/TuxAlert.vue) (TUX adds `compliance` + `tip` variants) |
| **Nav** | [TuxDocsSidebar](../../../app/components/TuxDocsSidebar.vue) (doc-site) + `UDashboardSidebar` (app shell via `app/layouts/sidebar.vue`) |
| **Persona** | [TuxContactCard](../../../app/components/TuxContactCard.vue) (business-card variant) + [TuxChatMessage](../../../app/components/TuxChatMessage.vue) avatar slot (inline-author variant). Different shapes for different uses |
| Popover | `UPopover` |
| Progress bar | `UProgress` |
| Radio group | `URadioGroup` |
| SearchBox | `UInput` w/ search icon + Cmd-K / [TuxSearch](../../../app/components/TuxSearch.vue) |
| Skeleton | [TuxSkeleton](../../../app/components/TuxSkeleton.vue) / `USkeleton` |
| Slider | `USlider` |
| Spin button | `UInputNumber` |
| Spinner | inline `Icon` w/ `animate-spin` |
| Switch | `USwitch` |
| Tablist | `UTabs` |
| **Tag & Interaction tag** | [TuxRemovableChip](../../../app/components/TuxRemovableChip.vue) + [TuxBadge](../../../app/components/TuxBadge.vue). Fluent splits decorative (Tag) vs interactive (Interaction tag); TUX makes the same split |
| Tag picker | Compose `UInputMenu` + `TuxRemovableChip` |
| Textarea | `UTextarea` |
| Toast | `UToaster` / `useToast()` |
| Toolbar | composition pattern; no dedicated wrapper needed |
| Tooltip | `UTooltip` |
| Tree | [TuxTree](../../../app/components/TuxTree.vue) / `UTree` |

### 2. Genuine gaps — Fluent ships, TUX + Nuxt UI 4 don't

Two patterns surfaced. Both are small. Both have a clear "build when
surface demands" criterion. **Not shipping pre-emptively** — same
discipline as the Vercel and Primer passes.

| Fluent pattern | Proposed name | Sketch | Estimated LOC | When to build |
|---|---|---|---|---|
| **Info label** (label text + `(i)` button → popover with extended explanation) | `TuxInfoLabel` | Composes `ULabel` + `UPopover` w/ chevron-icon trigger. Useful for technical research forms where field meanings need explaining (ITAR rubrics, retention classes, classifier metrics) | ~40 | When 2+ form surfaces use the pattern |
| **Teaching popover** (onboarding/guided-tour tooltip with image + body + Next/Skip buttons) | `TuxTeachingPopover` | Header (optional image), body, primary + secondary actions in footer. Step counter ("2 of 5"). Used for first-run experiences | ~120 | When tti-ai-studio (or PECAN) adds an onboarding tour |

### 3. Skip — desktop-OS, no TTI use case, or covered

- **Material acrylic** — Mica/acrylic surfaces are Windows-native; TUX
  is web
- **Rating** — star rating for content quality. Research apps don't
  typically rate things
- **Swatch picker** — color-swatch selector for design tools. No TTI use case
- **Subcomponents page** — internal Figma scaffolding, not consumable

## Skip

- Same as above (Material acrylic, Rating, Swatch picker, Subcomponents)
- **Persona's "with-coin" variant** — that's Microsoft Office's
  initial-circle avatar. TUX defaults to initials-on-charcoal, the same
  shape. No need to ape the Microsoft style

## Absorb

### Pattern confirmations (no code changes)

- **Tag split: decorative vs interactive.** Fluent splits "Tag"
  (decorative label) and "Interaction tag" (clickable/removable) into
  two separate components. TUX makes the same split with
  [TuxBadge](../../../app/components/TuxBadge.vue) (decorative; tier/status/kind
  modes) and [TuxRemovableChip](../../../app/components/TuxRemovableChip.vue)
  (interactive; removable/selectable). Validates the choice we made in
  the Primer pass to ship TuxRemovableChip as a separate primitive
  rather than fold it into TuxBadge
- **Filled vs outline tag styling.** Fluent's Interaction tag has both
  filled and outline variants per state. TUX's TuxRemovableChip has
  default (outline-style) and `selected` (filled-brand). We're missing
  a "filled but not selected" middle state — likely not needed for the
  research surfaces TUX targets, but worth a note
- **Nav coverage.** Fluent's Nav (14 frames of NavItem/NavCategory/
  NavSubItem variants with rest/hover/pressed/focus/selected states)
  matches what `UDashboardSidebar` provides via its body slot, and
  what [TuxDocsSidebar](../../../app/components/TuxDocsSidebar.vue) covers for
  hierarchical doc-site nav. No gap
- **DataGrid feature checklist** (from `datagrid.png`): sortable
  headers, multi-select checkbox column, single-select radio column,
  cell-action header (icon-only column), brand-selected row highlight
  (multi-step selected/selected-hover/brand-selected/brand-selected-
  hover state stack), resizable columns, four cell sizes (smaller/
  small/medium/large). [TuxDataTable](../../../app/components/TuxDataTable.vue)
  uses TanStack Table; worth a future cross-check when it gets material
  updates, but no proactive work justified

## Tension

- **Microsoft's component density.** Fluent ships ~50 web components.
  TUX ships 79 (now 80 with TuxRemovableChip), Nuxt UI 4 ships ~120.
  Combined surface (TUX + Nuxt UI 4) is 2-3× Microsoft's. The right
  measure isn't *quantity* though — it's whether each component earns
  its keep. The thoroughness pass over Fluent confirms TUX isn't
  *missing* coverage, only stylistically different
- **DataGrid: rich vs lean.** Fluent's DataGrid demo shows 4
  cell-content variants × 6 row states × 4 sizes = elaborate. TUX's
  TuxDataTable + TuxRichDataGrid split is "lean default + opt-in
  rich-grid" — feels cleaner but means a deep audit when extending
  either. Don't conflate

## Decisions

- Designated Fluent 2 Web as TUX's **thoroughness reference for the
  dashboard / product-UI surface area** (Primer covers editorial,
  Vercel covers AI, Aggie covers institutional brand). The trio plus
  Fluent gives us a 4-corner check on whether TUX's component surface
  is well-covered
- **2026-05-20: No code shipped this pass** — confirmation pass, not
  gap pass. Two candidate patterns (TuxInfoLabel, TuxTeachingPopover)
  recorded as deferred follow-ups. Following the discipline that's
  worked through prior passes: build when surface demands
- Validated the Primer-pass decision to ship `TuxRemovableChip` as a
  separate primitive (Fluent makes the same decorative-vs-interactive
  tag split)

## Open follow-ups

Deferred until forcing consumer surface:

1. **`TuxInfoLabel`** (label + `(i)` help popover) — build when 2+
   technical research surfaces use the pattern. Likely candidates:
   PECAN's facet labels (Retention class, Access tier), tti-ai-studio's
   model-config form
2. **`TuxTeachingPopover`** (onboarding tour element) — build when
   tti-ai-studio first-run-experience design lands
3. **DataGrid feature cross-check** — when [TuxDataTable](../../../app/components/TuxDataTable.vue)
   or [TuxRichDataGrid](../../../app/components/TuxRichDataGrid.vue) get
   material updates, validate against Fluent's variant matrix
   (sortable indicators, multi-select column, cell-action header,
   brand-selected row stack, four cell sizes)
4. **Filled-but-unselected variant for TuxRemovableChip** — only if a
   surface needs a third visual state between "outline default" and
   "selected brand-filled". Probably never
