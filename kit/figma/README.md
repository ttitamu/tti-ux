# TUX Figma Design Kit (`kit/figma/`)

**Zero-subscription, 100% offline-capable Figma & W3C Design Token kit** for the Texas A&M Transportation Institute (**TUX**) design system.

Every artifact in `kit/figma/` is deterministically compiled from [`design/tokens.json`](../../design/tokens.json) and [`app/utils/tuxCatalog.ts`](../../app/utils/tuxCatalog.ts) via `npm run build:figma`.

---

## How Does This Work Without a Paid Figma Subscription?

Figma normally gates three enterprise features behind paid plans:
1. **Variables REST API** (requires Figma Enterprise)
2. **Multi-Mode Variable Collections** (requires Figma Professional/Organization for >1 mode)
3. **Figma Code Connect CLI / Dev Mode** (requires paid Organization/Enterprise Dev Mode seats)

**TUX bypasses all three paywalls legally and natively using standard client-side interfaces:**

| Enterprise Feature | TUX Zero-Subscription Mechanism | Plan Required |
|---|---|---|
| **Variables REST API** | Local Figma Plugin (`kit/figma/plugin/manifest.json`) executes `figma.variables.*` directly inside the client sandbox | **Free Starter Plan** |
| **Multi-Mode Variables** | Plugin auto-detects the Free Starter 1-mode limit and creates 3 linked single-mode collections (`Light`, `Dark`, `High Contrast AAA`) + full Paint Styles | **Free Starter Plan** |
| **Canvas Component Kit** | **Copy-to-Figma SVG Sheets** (`kit/figma/svg-components/*.svg`) paste directly into Figma Web or Desktop as editable vector frames & text layers | **Free Starter Plan (Web or Desktop)** |
| **Dev Mode / Code Connect** | Built-in **TUX Code Connect Inspector** inside the local plugin + `kit/figma/code-connect.json` surfaces Vue, React, Web Components, Blazor & WordPress snippets | **Free Starter Plan** |
| **Open-Source Alternative** | `kit/figma/tokens.dtcg.json` (W3C DTCG 2025.10) + SVG component sheets import directly into **Penpot** (100% free & self-hostable) | **Free / Open Source** |

---

## Emitted Artifacts

| File | Purpose |
|---|---|
| `kit/figma/tokens.dtcg.json` | **W3C Design Tokens (DTCG 2025.10)** — canonical tokens with `$type`, `$value`, and 3-mode extensions (`tti`, `tti-dark`, `tti-hc`). Compatible with Figma, Penpot, and Style Dictionary. |
| `kit/figma/tokens-studio.json` | **Tokens Studio for Figma** multi-mode token set with pre-configured `$themes` (`Light (tti)`, `Dark (tti-dark)`, `High Contrast AAA (tti-hc)`). |
| `kit/figma/figma-variables.json` | **Native Figma Variables payload** with `COLOR`, `FLOAT`, and `STRING` types, `0..1` RGBA floats, variable scopes (`FRAME_FILL`, `TEXT_FILL`, `CORNER_RADIUS`), and platform `codeSyntax`. |
| `kit/figma/code-connect.json` | **183-Component Code Connect Registry** mapping every `Tux*` primitive to its Vue 3, React, Web Component, Blazor, and WordPress code snippets + WCAG 2.2 AAA contracts. |
| `kit/figma/svg-components/*.svg` | **12 Copy-to-Figma Vector Component Sheets** (`TuxButton`, `TuxBadge`, `TuxAlert`, `TuxCard`, `TuxBigStat`, `TuxStatus`, `TuxSpectrumRibbon`, `TuxPortalHeader`, `TuxSectionHeader`, `TuxDataTable`, `TuxFormControls`, `TuxCorridorStrip`). |
| `kit/figma/plugin/manifest.json` | **Local Figma Builder & Code Connect Plugin** (`allowedDomains: ["none"]`). Generates Auto-Layout components, Paint Styles, and Variables in 1 click. |

---

## Three Ways to Use the Kit (For Designers — Zero Code, Git, or Terminal Required)

A designer who **only knows Figma** can use the entire kit directly from [`/install/figma`](/install/figma) in their web browser:

### Workflow 1 — The 5-Second Copy & Paste *(Easiest — Works in Figma Web or Desktop)*

1. Open [`/install/figma`](/install/figma) in any web browser.
2. Scroll through the visual gallery (**Buttons**, **Badges & LOS Pills**, **Alerts**, **Cards**, **KPI BigStats**, **Data Tables**, **TTI Masthead**, **5-Band Spectrum Ribbon**, etc.).
3. Click the maroon **Copy SVG to Figma** button under any component sheet.
4. Switch to your Figma canvas and press **`Cmd+V`** (Mac) or **`Ctrl+V`** (Windows).
5. **What happens in Figma:** Figma automatically converts that clipboard paste into real, editable Figma frames, vector shapes, and text layers with exact TTI Maroon (`#5C0025`), Warm Gold (`#DDAC37`), and WCAG AAA sizing (`44px` click targets). Edit text normally or press `Cmd+Option+K` (`Ctrl+Alt+K`) to turn any group into a reusable Figma Component.

### Workflow 2 — Loading All TTI Colors & Themes *(Via the Free "Tokens Studio" Community Plugin)*

If you want all TTI Light, Dark, and High-Contrast color swatches inside Figma without touching files on disk:
1. On [`/install/figma`](/install/figma), click **Copy Tokens Studio JSON** (or select the **Tokens Studio (Multi-Mode)** tab and click **Copy Full Tokens Studio**).
2. In Figma, open the free **Tokens Studio for Figma** plugin from the Figma Community.
3. Switch to the **JSON** (`{ }`) tab inside the plugin, paste (`Cmd+V` / `Ctrl+V`), and click **Save**.
4. All TTI colors, 5-Band Spectrum divisions, spacing, and radii (`Light`, `Dark`, and `High Contrast AAA`) are now loaded and ready to apply to any layer.

### Workflow 3 — The 1-Click Auto-Layout & Styles Builder *(Figma Desktop App)*

If you want native **Figma Color Styles**, **Figma Variables**, and **Auto-Layout Components** built automatically into your document:
1. On [`/install/figma`](/install/figma), click **Download All 3 Plugin Files** (`manifest.json`, `code.js`, `ui.html`) and save them into a folder on your computer (or use `kit/figma/plugin/` from a repo checkout).
2. In the **Figma Desktop app**, open any design file and go to **Plugins → Development → Import plugin from manifest...** and select `manifest.json`.
3. Run **TUX Design System — Zero-Subscription Kit Builder & Code Connect** to open the TTI window with three 1-click buttons:
   - **⚡ Generate Auto-Layout Component Kit on Canvas** — draws a master component sheet with real Figma Auto-Layout (`Shift+A`) frames and components directly onto your page.
   - **🎨 Sync All Paint Styles** — adds all TTI Light, Dark, and High-Contrast colors to Figma's native right-hand **Color Styles** panel.
   - **🔢 Sync Figma Variables** — populates Figma's native **Local Variables** panel (and automatically works around the Free plan's 1-mode restriction by creating separate Light, Dark, and High-Contrast collections).
   - **Open-Source Penpot Alternative:** Import `kit/figma/tokens.dtcg.json` in Penpot's Design Tokens tab and drag `kit/figma/svg-components/*.svg` onto the Penpot canvas.
