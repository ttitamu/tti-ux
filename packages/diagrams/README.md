# @tti/tti-ux-diagrams

> **Status: Beta.** TUX is beta, and so is this package: a minor release may change behavior or remove a deprecated name, and versions stay on 3.x while the beta lasts. Pin an exact version and read the [changelog](https://code.tti.tamu.edu/tti/tti-ux/src/branch/main/CHANGELOG.md) before you bump it.

Mermaid diagrams-as-code integration and institutional styling for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install --save-exact @tti/tti-ux @tti/tti-ux-diagrams
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

## API surface

The architecture map has two contracts, and each has a committed snapshot that the tests keep in step with the code:

- **The component**, `<TuxArchitectureMap>`: its props and defaults, events, `v-model` bindings, slots and exposed members. Snapshot: [`api/map-component.api.md`](./api/map-component.api.md).
- **The runtime**, `@tti/tti-ux-diagrams/runtime/tuxArchitectureMap` (the same exports as `app/utils/tuxArchitectureMap.ts`, which a Nuxt app that extends this layer gets as auto-imports) and `@tti/tti-ux-diagrams/runtime/tuxArchitectureMapSample`. Snapshot: [`api/map-runtime.api.md`](./api/map-runtime.api.md).

Every runtime export carries `@public` or `@internal` in its TSDoc comment, and the comment travels into the published `.d.mts`, so an editor shows it on hover. The public exports, by group:

| Group | Exports |
|---|---|
| Model | The `TuxMap*` model types (`TuxMapLevelModel` and what it is made of); `EMPTY_TTI_LEVEL_MODEL`, `DEFAULT_TTI_LEVEL_MODEL` (sample entry); `normalizeArchitectureModelInput()`, `validateMapModel()`, `sanitizeMapModel()`, `collapseModelSubgraphs()`, `buildLevelModelFromLegacyNodes()`, `extractModelLinks()`, `resolveModelRawLinks()` |
| Vocabulary | `TUX_MAP_ELEMENT_KIND_LABELS`, `TUX_MAP_LINK_KIND_LABELS`, `TUX_MAP_LINK_STRENGTH_ORDER`, `TUX_MAP_QUIET_LINK_KINDS`, `TUX_MAP_VALID_BLAST_INTENTS`, `TUX_MAP_WIRE_CATEGORIES`, `plainElementKindLabel()` |
| Levels | `buildMapParentIndex()`, `levelForFocus()`, `mapAncestorsOf()` |
| Links and blast radius | `liftLinksToView()`, `computeLinkBlastRadius()`, `classifyBlastLink()`, `inferLinkCoupling()`, `inferLinkPhase()`, `classifyLinkDependencyCategory()`, `filterLinksByCategories()`, `foldVendoredCopies()`, `traceSpreadingPath()` |
| Branch delta | `computeGraphDelta()` |
| Queries | `buildUnifiedArchitectureGraph()`, `queryArchitectureNodes()`, `queryArchitectureImpact()`, `findArchitecturePath()` |
| Search | `TUX_MAP_SEARCH_GROUPS`, `buildMapSearchIndex()`, `searchArchitectureMap()` |
| Ink | `getSmoothedFreehandSvgPath()`, `getLaserPointerSvgPath()` |
| Deprecated, still public | `computeDependencyBlastRadius()`, `queryArchitectureLayer()`, `queryMultiLevelBlastRadius()`, `findShortestArchitecturePath()`, `coordinateAcpSubgraphLease()` |

The result and option types of those functions are public with them; the snapshot lists every declaration.

**`@internal` exports may change or be removed in any release, without notice and without a changelog entry.** They are how the component draws (pixel geometry, path builders, the wire router, caches, comparators, object helpers). They remain exported and typed for now, so marking them broke no import; do not build on them. [`api/map-exports-inventory.md`](./api/map-exports-inventory.md) records how each export was sorted.

Changing the surface on purpose: tag a new export `@public` or `@internal`, then run `npm run build:runtime -w @tti/tti-ux-diagrams` and `npm run build:api -w @tti/tti-ux-diagrams` and commit the regenerated snapshots with the change. `npm test` fails with the list of added, removed and changed names until they match.

