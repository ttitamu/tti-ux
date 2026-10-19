# @tti/tti-ux-code

Shiki syntax highlighting integration, code block presentation, and clipboard tooling for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install @tti/tti-ux @tti/tti-ux-code
```

## Nuxt Layer Setup

Add `@tti/tti-ux-code` to `extends` in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    "@tti/tti-ux",
    "@tti/tti-ux-code",
  ],
});
```

## Features

- **`<TuxCodeBlock>`**: SSR-hydrated code block with syntax highlighting, optional line numbers, filename badge, download action, and 1-click clipboard copy.
- **`useTuxHighlighter()`**: High-performance singleton Shiki core engine running WebAssembly Oniguruma regexes for rapid tokenization.
- **Optimized Grammar Chunks**: Pre-configured with the most common engineering languages (TypeScript, JavaScript, Vue, HTML, CSS, SCSS, Python, Bash, SQL, C#, Go, Rust, Swift, Kotlin, JSON, YAML, Markdown).
- **Theme Adaptation**: Automatically maps TTI light, dark, and high-contrast color schemes into GitHub Shiki themes with WCAG 2.2 AAA contrast.
