# Power BI Design Tokens & Report Assets

Pre-configured report themes and PBIR visual fragments generated from `design/tokens.json`. Reports styled with these assets reflect official Texas A&M Transportation Institute typography, palette hierarchies, and chart foundations.

All assets are generated deterministically and verified by automated lock tests in CI (`tests/tux-kit-targets.test.ts`).

---

## Package Contents

The Power BI target includes complete theme files and PBIR fragments:

```text
kit/powerbi/
├── tti-theme.json              Light theme for Power BI Desktop & Fabric
├── tti-theme-dark.json         Dark theme
├── tti-theme-hc.json           High-contrast theme (WCAG AAA)
└── pbir/
    ├── schema-lock.json        Pinned $schema URLs and format versions
    ├── geometry.json           Canvas dimensions, chrome bands, and layout offsets
    ├── tmdl/                   ThemeMode and TuxThemeColors semantic model definitions
    ├── dax/                    DAX measures for theme switching in Desktop
    ├── shell/                  Drop-in page chrome visual templates
    │   ├── classic/            1280 × 920 canvas layout
    │   └── fluent2/            1920 × 1080 canvas layout
    └── fragments/
        ├── tti/                Static light color definitions
        ├── tti-dark/           Static dark color definitions
        ├── tti-hc/             High-contrast color definitions
        └── themed/             Measure-bound colors for live in-report toggle
```

---

## Applying a Theme

### Option A: Power BI Desktop GUI (Zero-Tooling)

1. Open Power BI Desktop.
2. In the top ribbon, select **View** → **Themes** dropdown.
3. Select **Browse for themes...** and choose `tti-theme.json` (or `tti-theme-dark.json` / `tti-theme-hc.json`).
4. All native visual types automatically inherit the TTI color palette, typography hierarchy, and margin tokens.

### Option B: PBIR Project Registration

To bind the theme directly in a PBIR Git-integrated report repository:

1. Copy `tti-theme.json` to `<Report>/StaticResources/RegisteredResources/tti-theme.json`.
2. In `report.json`, register the resource under `resourcePackages`:

```json
{
  "name": "RegisteredResources",
  "type": "RegisteredResources",
  "items": [
    {
      "name": "tti-theme.json",
      "path": "tti-theme.json",
      "type": "CustomTheme"
    }
  ]
}
```

3. In `report.json`, reference the custom theme:

```json
"customTheme": {
  "name": "tti-theme.json",
  "type": "RegisteredResources",
  "reportVersionAtImport": {
    "visual": "2.9.0",
    "page": "2.3.1",
    "report": "3.3.0"
  }
}
```

Ensure the theme name, item path, and on-disk filename match exactly.

---

## Theme Modes (Light, Dark, High-Contrast)

### Static Theming
For fixed-appearance reports, select one of the three pre-compiled themes:
- **Light (`tti-theme.json`)**: Off-white canvas with TTI Maroon headers and high-contrast data series.
- **Dark (`tti-theme-dark.json`)**: Deep charcoal surfaces with calibrated glowing chart markers.
- **High-Contrast (`tti-theme-hc.json`)**: Strict WCAG 2.2 Level AAA compliant contrast ($\ge 7.0:1$) for accessibility compliance.

### Interactive In-Report Toggle
For reports requiring a runtime viewer toggle between light and dark modes:
1. Import `pbir/tmdl/ThemeMode.tmdl` and `pbir/tmdl/TuxThemeColors.tmdl` into your semantic model.
2. Use visual fragments from `pbir/fragments/themed/`, where color properties bind to DAX measures rather than static hex values.
3. Add a slicer visual connected to `ThemeMode[Mode]` set to tile mode and sync across pages.

---

## PBIR Visual Fragments

Fragments provide standardized styling for individual visual containers that themes cannot express directly:

| Fragment | Target Property | Supported Visuals |
|---|---|---|
| `card-chrome.json` | `visualContainerObjects` | KPI cards, metrics, callouts |
| `table-chrome.json` | `visual.objects` | Data tables (`tableEx`) |
| `chart-cartesian.json` | `visual.objects` | Bar, Column, Line, Area, and Scatter charts |

### Splicing a Fragment

Splice the JSON fragment directly into the visual's `visual.json` file inside your PBIR page directory:

```bash
# Example: Apply cartesian chart chrome to a visual
jq -s '.[0] * .[1]' visual.json kit/powerbi/pbir/fragments/chart-cartesian.json > visual.tmp.json && mv visual.tmp.json visual.json
```

---

## Page Shell Chrome

Templates in `pbir/shell/<canvas>/` provide standardized header mastheads, navigation ribbons, and footer bars:
- **Classic**: Designed for 1280 × 920 canvas size.
- **Fluent 2**: Designed for 1920 × 1080 modern widescreen canvas.

Shell chrome keeps navigation and branding fixed across pages while reserving z-order layers `9000–15000` for report content visuals.

---

## Schema Verification

To verify that all emitted PBIR fragments and themes conform to Microsoft's current schemas:

```bash
# Verify schema URL availability
npm run verify:pbir

# Validate a full report folder with Microsoft's authoring CLI
npx @microsoft/powerbi-report-authoring-cli validate <report-path>
```
