# @tti/tti-ux-charts

> **Status: Beta.** TUX is beta, and so is this package: a minor release may change behavior or remove a deprecated name, and versions stay on 3.x while the beta lasts. Pin an exact version and read the [changelog](https://code.tti.tamu.edu/tti/tti-ux/src/branch/main/CHANGELOG.md) before you bump it.

Apache ECharts integration, theme generation, and storytelling presets for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install --save-exact @tti/tti-ux @tti/tti-ux-charts
```

## Nuxt Layer Setup

Add `@tti/tti-ux-charts` to `extends` in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    "@tti/tti-ux",
    "@tti/tti-ux-charts",
  ],
});
```

## Features

- **`<TuxECharts>`**: First-class, responsive, accessible Apache ECharts component with SSR safety.
- **TUX Palette Themes**: Automatic adaptation to Maroon-led palette (`--chart-1` through `--chart-8`), light/dark themes, and vision-comfort modes.
- **Extensions**: Dynamic on-demand loading for `echarts-wordcloud` and `echarts-liquidfill`.
- **Geographic SVG Maps**: Built-in support for `USA_ALBERS`, `TEXAS_COUNTIES`, and `TXDOT_DISTRICTS`.
- **WCAG 2.2 AAA**: Screen-reader accessible summaries and keyboard focusable canvas containers.
