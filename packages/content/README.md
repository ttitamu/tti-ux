# @tti/tti-ux-content

> **Status: Beta.** TUX is beta, and so is this package: a minor release may change behavior or remove a deprecated name, and versions stay on 3.x while the beta lasts. Pin an exact version and read the [changelog](https://code.tti.tamu.edu/tti/tti-ux/src/branch/main/CHANGELOG.md) before you bump it.

Markdown (MDC), KaTeX math rendering, and technical publication formatting for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install --save-exact @tti/tti-ux @tti/tti-ux-content
```

## Nuxt Layer Setup

Add `@tti/tti-ux-content` to `extends` in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    "@tti/tti-ux",
    "@tti/tti-ux-content",
  ],
});
```

## Features

- **`@nuxtjs/mdc` Integration**: First-class Markdown Component (MDC) syntax allowing inline embedding of TUX components (`::tux-alert{...}`, `::tux-card{...}`) in Markdown documents.
- **KaTeX LaTeX Math Rendering**: Fast client and server math expression rendering (`$inline$` and `$$display$$`) via `remark-math` and `rehype-katex`.
- **Institutional Link Normalization**: Automatic remark AST link rewrites converting relative markdown repository paths (`../design/palette.md`) into live application routes (`/design/palette`).
- **Code Block Highlighting**: Pre-configured Shiki themes matching TTI light and dark color schemes.
