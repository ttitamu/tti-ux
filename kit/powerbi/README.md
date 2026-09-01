# TUX for Power BI

Drop-in report themes and PBIR fragments, generated from
`design/tokens.json`. A Power BI report built with these renders the same
system as a TUX web page — same palette, same type lanes, same chart
foundations.

Everything here is **generated and committed**. Do not hand-edit: edit
`design/tokens.json`, run `npm run build:kit`, commit both.
`tests/tux-kit-targets.test.ts` fails CI if a committed file drifts from
its generator.

---

## What's in the box

```
kit/powerbi/
├── tti-theme.json              light  — import into Desktop or Fabric
├── tti-theme-dark.json         dark
├── tti-theme-hc.json           high contrast
└── pbir/
    ├── schema-lock.json        pinned $schema URLs + format versions
    ├── geometry.json           canvas, chrome bands, pills, z-order
    ├── tmdl/                   ThemeMode + TuxThemeColors (light/dark)
    ├── dax/                    same module for Desktop's UI
    ├── shell/                  drop-in page chrome, per canvas variant
    │   ├── classic/            15 visuals (10 shell + 5 pill templates)
    │   └── fluent2/
    └── fragments/
        ├── tti/                static colours, light
        ├── tti-dark/           static colours, dark
        ├── tti-hc/             static colours, high contrast
        └── themed/             measure-bound — follows an in-report toggle
```

**Themes** are the zero-tooling path: import one file, every native
visual inherits the system. They carry `dataColors`, the structural
colour set, sentiment and divergent ramps, `textClasses`, and
`visualStyles` for 26 visual types.

**PBIR fragments** are JSON objects you splice into a `visual.json`. They
cover the part that repeats on every visual and that a theme file
*cannot* express.

| Fragment | Splice as | Applies to |
|---|---|---|
| `card-chrome.json` | `visualContainerObjects` | every **content** visual |
| `table-chrome.json` | `visual.objects` | `tableEx` |
| `chart-cartesian.json` | `visual.objects` | bar / column / line / area / scatter |

Card chrome goes on charts, tables, slicers and cards — **not** on shell
shapes, textboxes or buttons, which carry their own.

---

## Applying a theme

Three edits, and all three are required. A theme file dropped into
`StaticResources/` without the other two is silently ignored.

1. File at `<Report>/StaticResources/RegisteredResources/tti-theme.json`
2. `report.json` → `resourcePackages` entry:

```json
{
  "name": "RegisteredResources",
  "type": "RegisteredResources",
  "items": [
    { "name": "tti-theme.json", "path": "tti-theme.json", "type": "CustomTheme" }
  ]
}
```

3. `report.json` → `themeCollection.customTheme`:

```json
"customTheme": {
  "name": "tti-theme.json",
  "type": "RegisteredResources",
  "reportVersionAtImport": { "visual": "2.9.0", "page": "2.3.1", "report": "3.3.0" }
}
```

The theme name, the resource item name, the item path, and the on-disk
filename must all match **including the extension**. A mismatch is one of
the most common causes of a report that opens with no styling and no
error.

> **`reportVersionAtImport` is an object, not a string.** Report schema
> 3.0.0 changed it, and Microsoft's own published example still shows the
> old flat `"5.53"` form. Copying from the docs produces a `report.json`
> that fails validation. The current values are in
> `pbir/schema-lock.json`.

> **During PBIR preview, a *new* theme cannot be registered by file drop
> alone.** `report.json` and `definition.pbir` are not externally
> editable, and `RegisteredResources` can only be edited for
> already-registered resources. Introduce the theme once through Desktop
> (View → Theme → Browse for themes), then subsequent updates are a file
> replace.

---

## Light and dark

**Power BI has no native dark mode for report content.** Verified
2026-08-31 against Microsoft's own documentation: Desktop dark mode is
application chrome only ("Dark mode is not applied to the Report view
Canvas, including the Filter Pane and Wallpaper"), mobile explicitly
excludes report content, and the service has none. The theme schema has
no `colorScheme` key and is `additionalProperties: false`, so it cannot
be extended.

That leaves two real options, and they do different jobs:

**Static** — ship `tti-theme.json` or `tti-theme-dark.json` and use the
matching `fragments/<theme>/`. The report has one fixed appearance.
No semantic-model dependency. Use this unless you need a viewer-facing
toggle.

**Themed** — use `fragments/themed/`, whose colours bind to DAX measures
instead of literals. A slicer on a disconnected `ThemeMode` table drives
every bound colour, so a viewer flips the whole report at view time. This
is the only mechanism that gives a live in-report toggle.

The model module that backs it is generated from the same tokens:

```
pbir/tmdl/ThemeMode.tmdl          the two-row mode table
pbir/tmdl/TuxThemeColors.tmdl     30 measures, one per colour role
pbir/dax/theme-tables.dax         the same thing for Desktop's UI
```

**TMDL projects** — copy both `.tmdl` files into
`<Model>.SemanticModel/definition/tables/` and add a `ref table` line for
each in `model.tmdl`. A table file without its `ref table` entry is
silently ignored, with no error.

**Desktop** — open `dax/theme-tables.dax` and follow the header: two
*New table* expressions, then one *New measure* per role with
`TuxThemeColors` as the home table.

Then put a slicer on `ThemeMode[Mode]`, set it to tile mode, and sync it
across pages.

Roles are grouped into display folders — Surface, Text, Accent, Table,
Chart, Semantic, Shell, Tooltip. Two behaviours worth knowing, both of
which fall out of the tokens rather than being special-cased:

- `Shell*` roles are **theme-invariant** — the masthead stays maroon in
  dark mode, per the on-brand rule.
- `Tooltip*` roles **invert**, because a tooltip wants the opposite
  surface from the page it sits on.

The measure names are a **hard contract** with the fragments. Renaming
one breaks every report that has already spliced them in.

> The measures return hex literals on purpose. Power BI's newer *named
> theme colors* feature — where a measure returns `"background"` instead
> of `#FFFFFF` — resolves against whichever theme is currently applied,
> and a report has exactly one. It makes a report theme-portable; it
> **cannot** drive a live toggle, because both branches of the `IF`
> collapse to the same colour. Do not refactor these measures onto it.

Two approaches that were tried and abandoned upstream, recorded so they
aren't retried: **bookmarks** with duplicated per-mode pages (maintenance
doubles with every page, slicer sync is fragile), and **field parameters
with `GENERATESERIES`** (fine for two or three colours, doesn't scale to
a full role set).

High contrast is **not** a toggle state — it's a separately applied
theme. Use `tti-theme-hc.json` with the static `fragments/tti-hc/` lane.

---

## Geometry

`pbir/geometry.json` carries the report shell layout: chrome band
heights, content area, nav pill stride, and the z-order scheme.

Two canvas variants are emitted because Fluent 2 (GA August 2026) moved
the default canvas to 1920×1080 while existing reports stay at 1280×920:

| Variant | Canvas | Base theme |
|---|---|---|
| `classic` | 1280 × 920 | `CY26SU08` |
| `fluent2` | 1920 × 1080 | `Fluent2-CY26SU08` |

Chrome bands are type-driven and do **not** scale with the canvas — only
the content area does. Pick the variant matching your report's base
theme.

The z-order scheme reserves **9000–15000** for content visuals.
Everything outside that window is shell chrome. Keep content inside it
and chrome never collides.

---

## The report shell

`pbir/shell/<canvas>/` holds ready-to-copy visuals — one folder per
visual, matching PBIR's on-disk layout exactly:

```
cp -R kit/powerbi/pbir/shell/fluent2/* \
      MyReport.Report/definition/pages/<page>/visuals/
```

Ten of them are the page chrome, and they are identical on every page of
a report — only `nav_title_page`, `nav_title_context` and
`nav_title_footer_support` carry copy you'll want to change:

| Visual | Type | Follows the toggle? |
|---|---|---|
| `shell_canvas_bg` | shape | yes — `PageBackground` |
| `nav_btn_content_tray` | shape | yes — `BorderColor` @97% |
| `nav_btn_footer_bg` | shape | **no** — brand |
| `nav_btn_header_bg` | shape | **no** — brand |
| `nav_btn_header_accent_rule` | shape | **no** — brand |
| `nav_title_footer_support` | textbox | **no** — static on brand |
| `nav_title_page` | textbox | **no** — static on brand |
| `shell_theme_slicer` | slicer | — the control itself |
| `nav_btn_nav_bg` | shape | yes — `CardBackground` @4% |
| `nav_title_context` | textbox | yes — titled, `TextPrimary` |

Brand chrome deliberately does **not** respond to the toggle: the
masthead stays maroon in dark mode. Anything sitting *on* that maroon
(page title, footer label) is static white for the same reason — it is
always readable there, so it needs no measure.

### Nav pills

The remaining five visuals are pill templates, because the pill count is
per-report. `nav_pill_active*` is positioned at index 0 and
`nav_pill_inactive*` at index 1; replicate the inactive set per page and
place pill *n* at:

```
x = pills.startX + n * pills.stride     (from geometry.json)
```

Each pill is **three or four layered visuals, not one button**. That
looks redundant until you try the obvious thing: `actionButton` text
rendering is unreliable in generated PBIR — labels vanish or misalign —
and `text.fontColor` cannot take a measureRef at all. So chrome, label,
and click target are separated:

| Layer | Visual | Why |
|---|---|---|
| shape | `nav_pill_*` | fill, radius, shadow |
| label | `nav_pill_*_label` | predictable text rendering |
| hit target | `nav_pill_inactive_hit` | invisible `actionButton`, click only |

The active pill needs no hit target — it *is* the current page.

Two calibrated offsets that look like typos and are not: the active
label sits at `pillY + 2` and the inactive at `pillY + 8`. Active uses
paragraph text (internal top padding); inactive uses title text (renders
at the top of its box). Without the different offsets they don't sit
level.

**`nav_pill_inactive_hit` still needs its page-navigation target.** The
invisible button is emitted with its chrome suppressed but no
`navigationSection` binding — that value is the destination page's slug,
which only exists once you have pages. Set it in Desktop, or via the
injector when it lands.

### Theme-responsive text

A textbox's paragraph `textStyle.color` is a plain string and **cannot**
take a measureRef, so any label that must follow the toggle is rendered
through the visual's *title* instead: paragraph text cleared to empty,
copy in `title.text`, colour in `title.fontColor`. `nav_title_context`
and `nav_pill_inactive_label` both use this.

Use `text` — **not** `titleText`, which is an embedded-JS-API property
and fails PBIR schema validation outright.

Titled text needs more vertical room than paragraph text, or a bounding
box appears around it. The calibrated minimums are 64px for 10pt content
labels, 46px for nav labels, 55px for an 18pt page title.

The emitted themes pin `baseTheme: "Fluent2-CY26SU08"`. A custom theme
layers *on top of* a base theme and inherits anything it doesn't define,
so leaving it unpinned means inheriting whatever the consuming report
carries — and Fluent 2 vs Classic differ in padding, corner radius,
canvas size and title defaults.

---

## Deprecated visual types

`schema-lock.json` carries the migration map. Emitting the left-hand
names produces reports that open today and break later:

| Don't emit | Emit |
|---|---|
| `card` | `cardVisual` |
| `table` | `tableEx` |
| `matrix` | `pivotTable` |
| `map`, `filledMap` | `azureMap` |
| `multiRowCard` | `cardVisual` |

---

## Validating

```bash
npm run verify:pbir
```

re-checks every pinned schema URL against the live endpoint.

For structural validation of a whole report, use Microsoft's own offline
validator rather than anything in this repo:

```bash
npx @microsoft/powerbi-report-authoring-cli validate <report-path>
```

Note that structural validity does **not** imply a correct render. Power
BI silently ignores a property with the wrong literal type rather than
rejecting it — `0L` and `1D` are different values, and the wrong one is a
no-op, not an error. Open the report and look at it.

---

## Status

PBIR is still **public preview** as of 2026-08-31 — GA slipped past its
Q3 2026 target. It is already the default format for new reports in the
service (January 2026) and Desktop (March 2026), and Microsoft has stated
it becomes the *only* supported format at GA, so building on it is the
right bet. But schema versions moved roughly monthly before the current
freeze; re-run `npm run verify:pbir` before each release.

Service-enforced limits worth knowing when generating at scale: 1,000
pages per report, 1,000 visuals per page, 1,000 resource files, 300 MB
total. Windows `MAX_PATH` (260 chars) also bites, because PBIR nests a
folder per visual.
