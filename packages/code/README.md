# @tti/tti-ux-code

> **Status: Beta.** TUX is beta, and so is this package: a minor release may change behavior or remove a deprecated name, and versions stay on 3.x while the beta lasts. Pin an exact version and read the [changelog](https://code.tti.tamu.edu/tti/tti-ux/src/branch/main/CHANGELOG.md) before you bump it.

Shiki syntax highlighting integration, code block presentation, and clipboard tooling for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install --save-exact @tti/tti-ux @tti/tti-ux-code
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
