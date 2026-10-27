# @tti/tti-ux-diagrams

Mermaid diagrams-as-code integration and institutional styling for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install @tti/tti-ux @tti/tti-ux-diagrams
```

## Nuxt Layer Setup

Add `@tti/tti-ux-diagrams` to `extends` in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    "@tti/tti-ux",
    "@tti/tti-ux-diagrams",
  ],
});
```

## Features

- **`<TuxArchitectureMap>`**: Infinite-canvas Master Architecture Plan (M.A.P.) component with 3-tier semantic zoom (Products → People/VMs/Containers → Package Dependencies), upstream/downstream blast-radius BFS traversal, smoothed freehand ink (`perfect-freehand`), decaying laser pointer trails, and transport-agnostic multi-user cursors.
- **`<TuxDiagram>`**: Accessible, responsive Mermaid diagram wrapper supporting flowcharts, sequence diagrams, ERDs, state machines, and Gantt charts.
- **`useTuxMermaid()`**: Coordinated singleton Mermaid renderer with automatic layout-shift prevention via server-side height estimation.
- **TUX Color Synchronization**: Direct mapping of Texas A&M Maroon (`#500000`), Dark Mode accents, and typography tokens into Mermaid theme variables.
- **WCAG 2.2 AAA Accessibility**: Automatic markup remediation converting untyped ARIA labels into accessible image roles.
