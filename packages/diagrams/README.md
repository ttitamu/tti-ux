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

- **`<TuxArchitectureMap>`**: Modular Architecture Map (M.A.P.) component with multi-level C4 + Code Property Graph semantic zoom (Context → Containers → Components → Infrastructure → Folder/File/Symbol subgraphs), LCA outside-collaborator lifting, multi-intent upstream/downstream blast-radius analysis, branch-diff overlays, Go-To search palette (`/` / `Ctrl/Cmd-K`), opt-in freehand ink (`perfect-freehand`) and decaying laser pointer trails, and lazy subgraph loading (`resolveSubgraph`).
  - **Programmatic & MCP Graph Engine:** `@tti/tti-ux-diagrams/runtime/tuxArchitectureMap` exports `queryArchitectureNodes()`, `queryArchitectureImpact()`, `findArchitecturePath()`, `computeGraphDelta()`, `liftLinksToView()`, `computeLinkBlastRadius()`, and `searchArchitectureMap()` as a zero-Vue ESM runtime for Node/MCP servers and build tools.
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

## Benchmarking the architecture map

A change to the map's performance should land with a number. The benchmark gives one, and keeps a regression in how the map scales from merging.

```bash
npm run bench:map -w @tti/tti-ux-diagrams               # both halves: about 2 minutes
npm run bench:map -w @tti/tti-ux-diagrams -- --utils    # the utils half: about 20 seconds
npm run bench:map -w @tti/tti-ux-diagrams -- --record   # also rewrite the committed baseline
npm run bench:map -w @tti/tti-ux-diagrams -- --report   # print what the last run wrote
```

It builds three synthetic repositories from a seeded generator (`tests/support/mapSyntheticModels.ts`, no `Math.random`): about 500, 2,500 and 10,000 symbols, 2 to 5 links a symbol, and 30, 60 and 120 cards in the deepest view. Each has containers, components, folders, files and symbols, cross-component links, tests, routes, single-child folder chains and lazy files. Every scenario is timed at all three sizes in one process: a warm-up, then nine samples a size, interleaved, reported as the median and the 90th percentile.

| Scenario | Measured | What it times |
|---|---|---|
| `pipeline` | utils | `sanitizeMapModel` → `collapseModelSubgraphs` → `buildMapParentIndex` → `resolveModelRawLinks` → `liftLinksToView` → `routeGridWires` for the deepest view |
| `sanitize`, `collapse`, `parent-index`, `links`, `lift-view`, `route`, `search-index` | utils | one stage each (`links` is `extractModelLinks`) |
| `hover` | utils | `routeGridWires` again with the hovered card's outside wires opened |
| `selection` | utils | `computeLinkBlastRadius` for one symbol, unfiltered and by kind |
| `lazy-merge` | utils | one resolved subgraph merged: sanitize, collapse and index again |
| `go-to` | utils | `searchArchitectureMap`, four queries over the built index |
| `c-mount` | component | mounting `<TuxArchitectureMap>` on the deepest view |
| `c-stage` | component | navigating to the deepest view: the `stageData` and `routedSvg` computeds and the render |
| `c-hover` | component | a `pointerover` on one card |
| `c-select` | component | `selectElement()` with the blast radius on |
| `c-lazy-merge` | component | `resolveSubgraph` for one lazy file, through to the re-staged view |
| `c-go-to` | component | one query typed into the open Go-To palette |

The **utils** rows call the exported functions directly (`tests/map-bench.test.ts`, Node). The **component** rows go through the mounted component (`tests/components/tux-architecture-map-bench.nuxt.test.ts` at the repository root, jsdom), because `stageData`, `routedSvg`, hover and selection live inside the `.vue` file. jsdom is not a browser: rendering costs more there than on screen and layout costs nothing, so read the component rows against each other and against their own baseline, not as frame times.

**How to read it.** The milliseconds are for people. Nothing asserts on them, because a shared CI runner is several times slower than a laptop and not even as fast as itself a minute ago. What `npm test` asserts is the two ratios printed beside them: `time(2,500) / time(500)` and `time(10,000) / time(2,500)`, measured seconds apart in the same process, each with a ceiling. A step that walks the whole model once lands near 5 and 4, the size of the steps. A step that only touches one view grows with the view, not the model, and lands between 1 and 4. Add a scan inside a scan and the ratio heads for 25 and 16, through the ceiling. A round over its ceiling is measured again, twice at most, and the best round counts: noise adds time to one size at a time; a real regression fails all three rounds. The suite proves the gate on itself with a linear scan that must pass and the same scan with a quadratic term that must fail.

The committed baseline (`tests/support/map-bench.baseline.json`) records the machine, the Node version and the commit it was taken at. When it exists, the table's last column compares the 10,000-symbol median with it, divided by a fixed reference workload timed in the same run, so two machines can be read side by side. That column is information, not a gate. For a before and after, run `bench:map` on `main` and on the branch on the same machine and quote both rows; re-record the baseline when a change moves a number on purpose, and raise or lower that scenario's `bounds` in the test to about twice its new ratio.
