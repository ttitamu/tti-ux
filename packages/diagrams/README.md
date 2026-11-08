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
  - **Code links (3.8):** a model's `links` are fine-grained dependencies between any two elements at any level (`{ from, to, kind, stop?, at? }`; `from` depends on `to`), usually read from code: imports, calls, script runs, page loads, CI checks. On Level 3 and 5+ the map lifts them onto the cards on screen: wires between the cards inside and, below Level 4, in/out cards for the parts outside (double-click one to go to it). Choosing an element lists its blast radius in the details panel (everything that depends on it or on anything inside it, nearest first, with the line each link was read from), and the Blast radius switch lights it on the stage. A `stop` link (a test, a doc, a deploy step) is followed one step and no further. `liftLinksToView()` and `computeLinkBlastRadius()` are exported for other renderers and agents.
  - **Phones, tablets, touch and WCAG 2.2 AAA (3.9):**
    - **Magnify:** the diagram fits the width by default. **A+** magnifies it to 50–200% of its real size, after which it scrolls: by swipe, scrollbar or arrow keys, with no dragging. **Fit** returns. A finger scrolls the page past the map and pinches to zoom; only the pen, laser and note tools take the gesture.
    - **The list carries the relationships.** Each item says what it depends on and what uses it. `initialView="auto"` switches to the list below `autoListBreakpoint` after mount, so a server-rendered page hydrates cleanly. Choosing an item moves focus to its details; closing them returns it.
    - **Keyboard:** an outside card's panel has **Go to where it lives**, the button for what double-clicking it does.
    - **Contrast:** text stays `--text-primary` on brand tints, never on brand fills, and holds 7:1 in every TUX theme and colour-vision palette (`tti`, `tti-dark`, `tti-soft-dark`, `tti-hc` × `okabe-ito`, `deutan-protan`, `tritan`, `monochrome`).
    - **Targets:** controls are 44 px (48 px under `data-vision-comfort="field-sunlight"`).
    - **Vision modes:** `data-vision-stroke="heavy"` thickens the wires and borders. Change markers use TUX's status tokens, which the palettes remap.
    - **Help text:** on a touch screen it talks about taps and swipes; where a plain wheel does not zoom (`wheelZoom` off, or magnified) it says Ctrl+scroll; it counts the levels the model has and mentions `+` cards only where one is in view.
    - **Reduced motion (3.9.1):** under `prefers-reduced-motion` nothing on the map moves: wires keep their dashes without flowing, cards and frames change without sliding, and the wheel changes the level without pulling the card.
    - **Keyboard (3.9.1):** `+` acts on the card that has focus and says so when it has nothing inside; after a zoom, focus stays in the map, unless the host page moved it.
- **`<TuxDiagram>`**: Accessible, responsive Mermaid diagram wrapper supporting flowcharts, sequence diagrams, ERDs, state machines, and Gantt charts.
- **`useTuxMermaid()`**: Coordinated singleton Mermaid renderer with automatic layout-shift prevention via server-side height estimation.
- **TUX Color Synchronization**: Direct mapping of Texas A&M Maroon (`#500000`), Dark Mode accents, and typography tokens into Mermaid theme variables.
- **WCAG 2.2 AAA Accessibility**: Automatic markup remediation converting untyped ARIA labels into accessible image roles.
