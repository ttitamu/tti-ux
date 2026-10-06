# TUX Starter Content Template

A turnkey, Git-backed content site and microsite template powered by **TTI-UX (TUX)**, **Nuxt Content**, and **Nuxt Studio**.

## Highlights

- **Visual In-Browser Editing**: Non-technical authors can edit content, write articles, and tweak TUX components visually using [Nuxt Studio](https://nuxt.studio).
- **183 TUX Components**: Seamlessly author using MDC (Markdown Component) syntax like `::tux-big-stat`, `::tux-card`, `::tux-alert`, and `::tux-researcher`.
- **Zero-Server Hosting**: Pre-renders to 100% static HTML via GitHub Actions or Forgejo CI. Deployable directly to GitHub Pages, Forgejo Pages, or Cloudflare Pages.
- **Institutional Brand & WCAG AAA Parity**: Ships with Texas A&M maroon palette (`#500000`, `#3C0000`, `#CFA935`), typography (`Roboto`, `Oswald`, `Work Sans`), and light/dark theme switcher.

## Quick Start (Developers)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
# -> http://localhost:3000
```

## Quick Start (Content Authors & Marcom)

1. Connect this repository to [Nuxt Studio](https://nuxt.studio).
2. Use the visual editor to navigate to any page (`/` or `/research/smart-corridors`).
3. Click any paragraph or component to edit text, or click `+` to insert a new TUX component.
4. Hit **Save** to commit directly to Git or open a Pull Request.

## Component Syntax Reference in Markdown

```markdown
::tux-page-header{eyebrow="Research Center" title="Connected Corridors"}
Summary of the project.
::

::tux-big-stat{value="42" suffix="%" label="Energy savings" tone="maroon"}
::

::tux-card
### In-Card Header
Card content here.
::

::tux-alert{variant="info" title="Note"}
Informational note body.
::
```
