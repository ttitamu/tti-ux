# Authoring Sites with TUX and Nuxt Studio

This guide explains how content creators, researchers, and developers can use **Nuxt Studio** with **TTI-UX** to build and manage research portals, lab sites, and publications visually.

## Architecture

Nuxt Studio connects to a Nuxt Content repository and provides a browser-based, visual WYSIWYG editor. 

Because `tti-ux` registers all components globally (`global: true` in `nuxt.config.ts`), the MDC (Markdown Components) parser recognizes every `Tux*` component inside markdown:

```
Markdown Document (.md)
   ├── Standard Markdown (# headings, lists, links)
   └── MDC Components (::tux-big-stat, ::tux-card, ::tux-alert)
          │
          ▼
   Nuxt Content / MDC Renderer
          │
          ▼
   Tux*.vue Component from @tti/tti-ux Layer
          │
          ▼
   Rendered DOM + TTI Tokens & Accessible Styles
```

## How Non-Technical Staff Edit Content

1. Open the project in **Nuxt Studio**.
2. Navigate the live site preview to the target page.
3. Click any text block to edit prose directly.
4. **Inserting Components**:
   - Type `/` on a blank line to open the block inserter.
   - Select a TUX component (e.g. *Big Stat*, *Card*, *Alert*, *Factoid*).
   - Use the **Properties Panel** on the right side to adjust options:
     - `value`: Number or text
     - `suffix`: Units like `%`, `M`, `mi`
     - `tone`: `maroon`, `gold`, or `neutral`
     - `variant`: `default`, `bold`, or `elegant`
5. Click **Publish** to commit changes to the Git repository.

## Comparison: Nuxt Studio vs. WordPress

| Dimension | Traditional WordPress | Nuxt Studio + TUX |
|---|---|---|
| **Hosting & Infrastructure** | MySQL + PHP / Apache server | Static HTML (CDN / Pages) |
| **Security Risk** | Requires regular core/plugin CVE patching | Zero database, zero attack surface |
| **Performance** | Database query latency, caching plugins | Instant TTFB (served from edge) |
| **Brand Fidelity** | Custom themes drift over time | Byte-locked to canonical TUX tokens |
| **Accessibility** | Dependent on theme and plugin markup | Verified WCAG 2.2 AAA color contrast |
| **Authoring Experience** | Gutenberg / Kadence block editor | Modern visual editor committing to Git |

## Deploying

Sites built with the `tux-starter-content` template pre-render to static files:
```bash
npm run generate
```
The output directory (`.output/public`) can be served from:
- GitHub Pages
- Forgejo Pages (`code.tti.tamu.edu`)
- Internal Nginx / IIS / Caddy static file hosting
- Cloudflare Pages / AWS S3
