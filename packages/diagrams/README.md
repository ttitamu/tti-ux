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
    - **Magnify:** the diagram fits the width by default. **A+** magnifies it to 50–200% of its real size, and the button between **A−** and **A+** says how large that is against the fitted diagram (the first step up reads more than 100%). Magnified, it scrolls: by swipe, scrollbar or arrow keys, and a mouse may also drag the background; no dragging is ever required. While it moves, an overview of the level shows in the bottom-left corner with the part in view framed (`minimap`); a press on it goes there. **Fit** returns. A finger scrolls the page past the map and pinches to zoom; only the pen, laser and note tools take the gesture.
    - **The list carries the relationships.** Each item says what it depends on and what uses it. `initialView="auto"` switches to the list below `autoListBreakpoint` after mount, so a server-rendered page hydrates cleanly. Choosing an item moves focus to its details; closing them returns it.
    - **Keyboard:** an outside card's panel has **Go to where it lives**, the button for what double-clicking it does.
    - **Contrast:** text stays `--text-primary` on brand tints, never on brand fills, and holds 7:1 in every TUX theme and colour-vision palette (`tti`, `tti-dark`, `tti-soft-dark`, `tti-hc` × `okabe-ito`, `deutan-protan`, `tritan`, `monochrome`).
    - **Targets:** controls are 44 px (48 px under `data-vision-comfort="field-sunlight"`).
    - **Vision modes:** `data-vision-stroke="heavy"` thickens the wires and borders. Change markers use TUX's status tokens, which the palettes remap.
    - **Help text:** on a touch screen it talks about taps and swipes; where a plain wheel does not zoom (`wheelZoom` off, or magnified) it says Ctrl+scroll; under the `wheelZoom="click"` veil it says to click the diagram first; it counts the levels the model has, says that Level 4 is the Infrastructure view (so zooming in goes from Level 3 to Level 5) where the model has code below its components, and mentions `+` cards only where one is in view.
    - **The camera travels (#212):** zooming into a card (double-click, `+`, the wheel, Enter) grows the new level out of the card's rectangle, one transform on the stage, and the cards inside fade in as it arrives; zooming out shrinks the level back into the card it came from. Moving to another card on the same level (a link in the details panel, a Go to result on this level, Trace) slides the fitted diagram, or scrolls a magnified one along the wire between the two cards (straight where there is none), and stops once the card is clear of the details panel. A jump to another level (a number key, a breadcrumb, a Go to result elsewhere) is a 120 ms fade with its pill. Every travel lasts 180 ms plus 0.25 ms a pixel, 600 ms at most, on one cubic ease-out (`cubic-bezier(0.333, 1, 0.667, 1)`), and the pill goes when it ends. A key, a press, a click or a new turn of the wheel ends a travel on its target at once. There is no prop to turn it off: reduced motion is the switch.
    - **Reduced motion (3.9.1):** under `prefers-reduced-motion` nothing on the map moves: wires keep their dashes without flowing, cards and frames change without sliding, the wheel changes the level without pulling the card, and the camera does not travel: a zoom, a move to another card and a jump go straight to where they end.
    - **Trailing cursor (`cursor`, #208):** decoration, never information: `aria-hidden`, `pointer-events: none`, and nothing it shows is not also shown by the map's own outline on the card near the pointer. It is off for a coarse pointer and under `prefers-reduced-motion` (nothing is drawn; the map's still outline on the nearest card stays), and keyboard users never lose the system cursor: it is hidden only over the background, only while the disc is drawn, and only for a fine pointer.
    - **Keyboard (3.9.1):** `+` acts on the card that has focus and says so when it has nothing inside; after a zoom, focus stays in the map, unless the host page moved it.
- **`<TuxDiagram>`**: Accessible, responsive Mermaid diagram wrapper supporting flowcharts, sequence diagrams, ERDs, state machines, and Gantt charts.
- **`useTuxMermaid()`**: Coordinated singleton Mermaid renderer with automatic layout-shift prevention via server-side height estimation.
- **TUX Color Synchronization**: Direct mapping of Texas A&M Maroon (`#500000`), Dark Mode accents, and typography tokens into Mermaid theme variables.
- **WCAG 2.2 AAA Accessibility**: Automatic markup remediation converting untyped ARIA labels into accessible image roles.

## API surface

The architecture map has two contracts, and each has a committed snapshot that the tests keep in step with the code:

- **The component**, `<TuxArchitectureMap>`: its props and defaults, events, `v-model` bindings, slots and exposed members. Snapshot: [`api/map-component.api.md`](./api/map-component.api.md).
- **The runtime**, `@tti/tti-ux-diagrams/runtime/tuxArchitectureMap` (the same exports as `app/utils/tuxArchitectureMap.ts`, which a Nuxt app that extends this layer gets as auto-imports) and `@tti/tti-ux-diagrams/runtime/tuxArchitectureMapSample`. Snapshot: [`api/map-runtime.api.md`](./api/map-runtime.api.md).

### The component: props

`<TuxArchitectureMap>` takes 43 props, all optional. A state the host may own comes as a pair: the plain name is the controlled value, bound with `v-model:<name>`, and `initial<Name>` is the starting value used when the plain name is not passed. A controlled prop left `undefined` leaves that state to the component.

**The model**

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `model` | `TuxMapLevelModel` | `undefined` | The model to draw. Without it the component builds one from `nodes`, and with neither it draws `EMPTY_TTI_LEVEL_MODEL`. |
| `resolveSubgraph` | `(id: string, ref?: string) => Promise<TuxMapSubgraph \| null>` | `undefined` | Loads the inside of a card that names a `subgraphRef`, when the reader zooms into it. A card that resolves to nothing is asked once; a rejection is not remembered. Pass the same function between renders: a new one is asked again. |
| `modelRef` | `string` | `undefined` | A commit or ref, passed as the second argument of `resolveSubgraph`. |
| `nodes` | `TuxMapNode[]` | `[]` | Legacy input. Converted with `buildLevelModelFromLegacyNodes()` when `model` is not passed. |
| `edges` | `TuxMapEdge[]` | `[]` | Legacy input: the edges between `nodes`. |
| `zones` | `TuxMapZone[]` | `[]` | Legacy input: the zones of `nodes`. |

**Where the map is**

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `level` | `TuxMapLevelNumber` | `undefined` | Controlled level: 1 to 4, and 5 or more inside a subgraph (`v-model:level`). From 5 on, the number is where `focus` sits in the model as the map draws it (`levelForFocus()` on the collapsed model): a different number is corrected, and `update:level` reports the one in use. |
| `initialLevel` | `TuxMapLevelNumber` | `2` | Starting level. |
| `focus` | `string \| null` | `undefined` | Controlled id of the element whose inside is shown at Level 3 and at Level 5 or deeper (`v-model:focus`). |
| `initialFocus` | `string \| null` | `"c-api"` | Starting focus. The default is an id of the sample model: pass your own, or `null`. |
| `selectedId` | `string \| null` | `undefined` | Controlled id of the selected element, the one the details panel shows (`v-model:selectedId`). |
| `initialSelectedId` | `string \| null` | `null` | Starting selection. |
| `view` | `"diagram" \| "list"` | `undefined` | Controlled view (`v-model:view`). |
| `initialView` | `"diagram" \| "list" \| "auto"` | `"diagram"` | Starting view. `"auto"` opens the list when the window is narrower than `autoListBreakpoint`, after mount. |
| `autoListBreakpoint` | `number` | `760` | Window width in px below which `initialView="auto"` opens the list. |
| `denseListThreshold` | `number` | `40` | A view with more inner cards than this opens as the list, except at Level 4, when `view` is passed, or after the reader chose a view. |

**What is shown**

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `showPlanned` | `boolean` | `undefined` | Controlled: planned elements and links are shown (`v-model:showPlanned`). |
| `initialShowPlanned` | `boolean` | `false` | Starting value of the same. |
| `showBlastRadius` | `boolean` | `undefined` | Controlled Blast radius switch (`v-model:showBlastRadius`). |
| `initialShowBlastRadius` | `boolean` | `false` | Starting value of the same. |
| `blastIntent` | `TuxMapBlastIntent` | `undefined` | Controlled kind of change the blast radius is computed for: `"default"`, `"patch"`, `"refactor"`, `"cut"` or `"supply-chain"` (`v-model:blastIntent`). |
| `initialBlastIntent` | `TuxMapBlastIntent` | `"default"` | Starting intent. |
| `blastSeeds` | `string[]` | `undefined` | Ids the branch blast radius starts from, for example `blastSeedIds` of `computeGraphDelta()`. Without it the seeds are taken from the elements that carry a `diff`. |
| `splitIds` | `string[]` | `undefined` | Controlled ids of the rolled-up outside cards that are expanded (`v-model:splitIds`). |
| `initialSplitIds` | `string[]` | `[]` | Starting value of the same. |
| `wireFilters` | `TuxMapWireCategory[]` | `undefined` | Controlled categories of wire that are drawn: `"prod"`, `"tests"`, `"ci"`, `"docs"` (`v-model:wireFilters`). |
| `initialWireFilters` | `TuxMapWireCategory[]` | `["prod"]` | Starting value of the same. |
| `traceTarget` | `string \| null` | `undefined` | Controlled id a trace runs to (`v-model:traceTarget`). |
| `initialTraceTarget` | `string \| null` | `null` | Starting value of the same. |

**Around the diagram**

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `eyebrow` | `string` | `"TUX · MODULAR ARCHITECTURE MAP (M.A.P.)"` | The line above the title. Empty hides it. |
| `title` | `string` | `"Modular Architecture Map"` | The heading. Empty hides it. |
| `caption` | `string` | `""` | The caption below the map. Empty hides it. |
| `ariaLabel` | `string` | `"Interactive multi-level architecture map"` | Accessible name of the diagram region. |
| `height` | `string` | `"auto"` | CSS height of the diagram's viewport. `"auto"` sizes it to the diagram. |
| `wheelZoom` | `boolean \| "click"` | `true` | A plain mouse wheel over the diagram changes the level, and the page does not scroll while the pointer is on it. `false` leaves the plain wheel to the page and requires Ctrl or Cmd with the wheel. `"click"` starts the canvas under a "Click to explore" veil and works as `false` until the reader clicks the veil or moves keyboard focus into the canvas, then as `true` until Escape (with nothing else to close and no level to leave), a pointer-down outside the map, focus leaving the map, or the pointer staying outside it for 3 seconds. Ctrl or Cmd with the wheel, and a pinch, change the level in every mode. A touch screen (`pointer: coarse`) gets no veil, and `"click"` works there as `false`. |
| `cursor` | `boolean` | `false` | A dot sits on the pointer over the diagram and a 40 px disc follows it on a spring. Near a card (the card the map already outlines), or over a control inside the canvas, the disc comes to rest on that target's rounded box and thins to a wash. It inverts what is under it (`mix-blend-mode: difference`), so it reads on light and dark cards in every theme. Decoration only: hidden from assistive technology, never takes a pointer event, and drawn only for a fine pointer with motion allowed and not under the `wheelZoom="click"` veil. While it is drawn the system cursor is hidden over the background only; cards, controls and a drag keep theirs. While the background is dragged the disc is small and stays on the pointer. Its frame loop stops when the disc is at rest or the pointer leaves. |
| `minimap` | `boolean` | `true` | A small overview of the level in the bottom-left corner of the canvas: every card in its place and a frame around the part in view. It is there only where the level is larger than its viewport (magnified, or under a fixed `height`), it fades in while the view scrolls, is dragged, is magnified or changes level, and fades out 1.2 seconds after the view rests, unless the pointer is over it or it has keyboard focus. A press or a drag on it moves the view, and so do the arrow keys while it has focus. It is not drawn in the list view, under the `wheelZoom="click"` veil, or on a touch screen narrower than `autoListBreakpoint`. `false` turns it off. |

**Pen, laser and notes**

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `annotations` | `boolean` | `false` | Shows the pen, laser and sticky-note tools. |
| `strokes` | `TuxMapInkStroke[]` | `[]` | The pen strokes drawn on the map (`v-model:strokes`). |
| `notes` | `TuxMapStickyNote[]` | `[]` | The sticky notes on the map (`v-model:notes`). |
| `penColor` | `string` | `"#5C0025"` | Color of a new pen stroke. |

**Kept for compatibility**

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `lodMode` | `"auto" \| "executive" \| "resources" \| "packages"` | `"auto"` | Legacy. A change after mount moves the map to Level 1 (`"executive"`), Level 2 (`"resources"`) or Level 3 (`"packages"`). The value at mount is not read: use `level`. |
| `initialZoom` | `number` | `1` | Legacy. Accepted and not read. |

### The component: events, slots and exposed members

| Event | Payload | When |
|---|---|---|
| `node-select` | `TuxMapLevelElement \| TuxMapDeploymentNode \| TuxMapNode \| null` | The selection changes. `null` when it is cleared. |
| `drill-down` | `{ level: number; focusId: string; subgraph: TuxMapSubgraph \| null }` | The map zooms into an element. |
| `laser-move` | `TuxMapStrokePoint[]` | The laser pointer moves. |
| `update:<prop>` | the prop's type | The matching state changes: `level`, `focus`, `selectedId`, `view`, `showPlanned`, `showBlastRadius`, `blastIntent`, `splitIds`, `wireFilters`, `traceTarget`, `strokes`, `notes`. |

`update:lodMode` is declared, which is why the snapshot lists `v-model:lodMode`, and this release never emits it.

The component has no slots and calls no `defineExpose()`: a template ref gives access to nothing. Its file exports two types, `TuxArchitectureMapProps` and `TuxMapViewMode`.

### The runtime: public exports

Every runtime export carries `@public` or `@internal` in its TSDoc comment, and the comment travels into the published `.d.mts`, so an editor shows it on hover. The entry point has 119 public exports: 9 constants, 35 functions and 75 types. The constants and functions, by purpose:

**Reading and checking a model**

| Export | What it does |
|---|---|
| `TUX_MAP_SCHEMA` | The schema name of the canonical model, `"tux-map/1"`. |
| `normalizeArchitectureModelInput()` | Reads any of the three accepted document shapes and returns a level model, stamped and sanitized. |
| `validateMapModel()` | Reports what is wrong with a document, as `issues` and `warnings`. It never throws. |
| `sanitizeMapModel()` | Returns a model that is safe to draw, a `TuxMapNormalizedModel`, with the validation beside it. The one place defaults are filled. |
| `collapseModelSubgraphs()` | Joins single-child folder chains and skips the folder level of small components, and returns the `aliases` from the ids it removed. |
| `buildLevelModelFromLegacyNodes()` | Builds a level model from the legacy `nodes`, `edges` and `zones`. |
| `EMPTY_TTI_LEVEL_MODEL` | A model with four empty levels: what the component draws when it is given nothing. |
| `DEFAULT_TTI_LEVEL_MODEL` | The sample model, from the `runtime/tuxArchitectureMapSample` entry point. |

**Vocabulary**

| Export | What it does |
|---|---|
| `TUX_MAP_ELEMENT_KIND_LABELS` | The label of each `TuxMapElementKind`. |
| `plainElementKindLabel()` | The plain name of an element's kind: folder, file, function, class, HTTP route. |
| `elementTypeLabel()` | An element's type line, its kind and its `tech`, as the card shows it. A `tech` that starts with the kind does not repeat it: "folder · 4 files". |
| `TUX_MAP_LINK_KIND_LABELS` | What each link kind means, read from the part it points at. |
| `TUX_MAP_LINK_STRENGTH_ORDER` | The link kinds from strongest to weakest. It breaks ties in the blast radius. |
| `TUX_MAP_QUIET_LINK_KINDS` | The link kinds drawn on no stage (`mentions`). They still count in the blast radius. |
| `TUX_MAP_VALID_BLAST_INTENTS` | The set of valid `TuxMapBlastIntent` values. |
| `TUX_MAP_WIRE_CATEGORIES` | Every `TuxMapWireCategory`, in display order. |

**Levels and parents**

| Export | What it does |
|---|---|
| `buildMapParentIndex()` | The parent of every element below Level 2, as a `Map` from child id to parent id. |
| `mapAncestorsOf()` | An id and its ancestors, nearest first. |
| `levelForFocus()` | The level that shows the children of an element. |

**Links and blast radius**

| Export | What it does |
|---|---|
| `resolveModelRawLinks()` | The model's code links from `links` and `linkTiers`, with `stopKinds` applied. |
| `extractModelLinks()` | The links the map works with: the code links, bridged or replaced by links made from the level relationships where the code links do not reach. |
| `liftLinksToView()` | The links lifted onto one view: wires between the children on screen, and the outside parts on each side. |
| `computeLinkBlastRadius()` | Everything that depends on the seeds or on anything inside them, nearest first. |
| `classifyBlastLink()` | Whether a blast-radius walk spreads through a link, stops at it or skips it. |
| `traceSpreadingPath()` | The shortest directed walk over spreading links from one element to another. |
| `inferLinkCoupling()` | The `coupling` of a link that does not state one. |
| `inferLinkPhase()` | The `phase` of a link that does not state one. |
| `classifyLinkDependencyCategory()` | The wire category of a link: `prod`, `tests`, `ci` or `docs`. |
| `filterLinksByCategories()` | The links in the given categories. |
| `foldVendoredCopies()` | Folds the cards of vendored copies into the card of their source. |

**Branch delta**

| Export | What it does |
|---|---|
| `computeGraphDelta()` | What changed between a base model and a head model: nodes, wires, the blast seeds, a recommended intent and a merged model to draw. |

**Queries**

| Export | What it does |
|---|---|
| `buildUnifiedArchitectureGraph()` | Every node and edge of the model, all levels, in one graph. |
| `queryArchitectureNodes()` | The nodes at a level, under a parent, of a kind or matching a text, in pages. |
| `queryArchitectureImpact()` | The upstream blast radius of one or more nodes, sorted into triage buckets. |
| `findArchitecturePath()` | The shortest directed dependency path between two nodes. |

**Search**

| Export | What it does |
|---|---|
| `buildMapSearchIndex()` | The Go-To search index of a model, cached per model. |
| `searchArchitectureMap()` | Searches the index and returns the hits by group. |
| `TUX_MAP_SEARCH_GROUPS` | The result groups, in display order: Components, Folders, Files, Functions, Routes. |

**Ink**

| Export | What it does |
|---|---|
| `getSmoothedFreehandSvgPath()` | The SVG path of a pen stroke, from its pointer coordinates. |
| `getLaserPointerSvgPath()` | The SVG path of a laser trail that fades with time and length. |

**Deprecated, still public**

| Export | Use instead |
|---|---|
| `computeDependencyBlastRadius()` | `computeLinkBlastRadius()` or `queryArchitectureImpact()` |
| `queryArchitectureLayer()` | `queryArchitectureNodes()` |
| `queryMultiLevelBlastRadius()` | `queryArchitectureImpact()` |
| `findShortestArchitecturePath()` | `findArchitecturePath()` |
| `coordinateAcpSubgraphLease()` | `computeGraphDelta()` and `queryArchitectureImpact()`: a lease does not coordinate across processes |

The 75 public types are the model (`TuxMapLevelModel`, `TuxMapNormalizedModel` and what they are made of), the legacy `TuxMapNode`, `TuxMapEdge` and `TuxMapZone`, and the option and result types of the functions above. [`api/map-runtime.api.md`](./api/map-runtime.api.md) is the full list, with the declaration of each; it is generated and never edited.

**`links` and `parentOf` are read-only once passed.** `computeLinkBlastRadius()` and `liftLinksToView()` build lookup tables from the `links` array and the `parentOf` map and cache them against those two objects, so a repeat call with the same array and map does not read either of them whole. The tables are rebuilt when the array's length or the map's size changes. A change in place that keeps the count (a link replaced, a link's `from` or `to` rewritten, a child given another parent) is not seen: pass a new array or map, which is what `extractModelLinks()` and `buildMapParentIndex()` return on every call, or pass `verifyInputs: true`, which hashes both inputs on that call and rebuilds on a difference.

**`@internal` exports may change or be removed in any release, without notice and without a changelog entry.** They are how the component draws (pixel geometry, path builders, the wire router, caches, comparators, object helpers). They remain exported and typed for now, so marking them broke no import; do not build on them. [`api/map-exports-inventory.md`](./api/map-exports-inventory.md) records how each export was sorted.

Changing the surface on purpose: tag a new export `@public` or `@internal`, then run `npm run build:runtime -w @tti/tti-ux-diagrams` and `npm run build:api -w @tti/tti-ux-diagrams` and commit the regenerated snapshots with the change. `npm test` fails with the list of added, removed and changed names until they match.

## The model document: one canonical form, two accepted for compatibility

`normalizeArchitectureModelInput()` reads three shapes of JSON. One of them is the model; the other two are older documents it converts.

| | Shape | Recognized by | Status |
|---|---|---|---|
| (a) | **The level model**, `TuxMapLevelModel`: `level1` to `level4`, optional `subgraphs`, `links`, `linkTiers`, `routes` | not being (b) or (c) | **Canonical.** Carries `"schema": "tux-map/1"` at the top level. |
| (b) | A site document: `c4` (`context`, `containers`, `components`), deployment `groups` / `nodes` / `links` at the top level, code under `code` | a `c4` object | Accepted for compatibility. |
| (c) | A bare code graph: `subgraphs` and `links`, no levels | `subgraphs` and none of `level1` to `level4` | Accepted for compatibility. |

The three are told apart in that order of precedence: a document with a `c4` object is read as (b) whatever else it has, and a document with `subgraphs` is read as (c) only when it has none of `level1` to `level4`. Anything else that is a JSON object is read as (a). There is no fourth shape: a value that is not an object is refused with a `TypeError`, and a placement config (a `rules` list and none of `level1`, `level2`, `c4`, `subgraphs`) is refused with an error that says what it is. With `{ allowEmpty: false }` a document that yields no element at all is refused too.

What the normalizer reads from the two older shapes:

- **(b)** `c4.context`, `c4.containers` and `c4.components` become Levels 1, 2 and 3. The top-level `groups`, `nodes`, `links` and `neighbors` become Level 4. The code graph is read from the top level or from under `code`, the top level first: `subgraphs`, `linkTiers`, `stopKinds`, `routes`, `sourceBaseUrl`, and the links as `codeLinks` or `code.links`. Three spellings are accepted beside the canonical one: `generated_at` for `generatedAt`, a neighbor's `"resource group"` for `resourceGroup`, and an element's `zoom` as `"context"`, `"containers"`, `"components"` or `"deployment"` for 1 to 4.
- **(c)** `subgraphs`, `links`, `linkTiers`, `stopKinds`, `routes`, `generatedAt` and `sourceBaseUrl` are kept. Levels 1, 3 and 4 are empty. Level 2 gets one element for each subgraph key that is neither the id of an element in a subgraph nor the target of a `subgraphRef`: a `component` when the key has a `/`, a `container` otherwise, named by the key.

`<TuxArchitectureMap>` has one more input, which is not a document: the legacy `nodes`, `edges` and `zones` props, converted by `buildLevelModelFromLegacyNodes()` when `model` is not passed.

### `TuxMapLevelModel`: required and optional fields

`TuxMapLevelModel` is the type of the canonical document: what a producer writes, what the `model` prop takes and what every function that reads a model takes. Its top level:

| Field | Required | What it holds |
|---|---|---|
| `schema` | optional | The schema name, `"tux-map/1"`. |
| `generatedAt` | optional | When the document was written. |
| `issueBaseUrl`, `sourceBaseUrl` | optional | The base URLs for an element's `roadmap` numbers and for its `source.path`. |
| `level1` | required | The context: `elements` and `rels` (both required), `title`, `summary`. |
| `level2` | required | The containers: `boundary`, `elements` and `rels` (all required), `title`, `summary`. An element here is a `TuxMapLevelElement`, or a `TuxMapLevelRef` to a Level 1 element (`{ id, ref: true }`). |
| `level3` | required | The components: an object from a Level 2 container's id to the list of its elements. |
| `level4` | required | The deployment: `groups`, `nodes` and `links` (all required), `title`, `summary`, `zones`, `centerTitle`, `neighbors`. |
| `subgraphs` | optional | Level 5 and deeper: an object from an element's or a deployment node's id to a `TuxMapSubgraph` (`elements` required; `rels`, `stratum`, `summary`). |
| `links` | optional | The code links, `TuxMapLink[]`: `from` depends on `to`. |
| `linkTiers` | optional | The same links already split into `spread` and `stop`. |
| `stopKinds` | optional | The link kinds read as `stop: true` when a link does not say. |
| `aliases` | optional | Old ids and the ids they now resolve to, so a saved `focus` still opens. |
| `routes` | optional | The HTTP routes and their handlers, `TuxMapRouteEntry[]`. |

`sanitizeMapModel()` returns a `TuxMapNormalizedModel`: a `TuxMapLevelModel` in which the fields marked "filled" below are always there, so code that holds one reads them without a guard. It is what `<TuxArchitectureMap>` lays out, and what `collapseModelSubgraphs()` returns when it is given one. The table is the one in the doc comment of `TuxMapNormalizedModel` in `app/utils/tuxArchitectureMap.ts`, which is the source. "Required" is what the type says and what `validateMapModel()` reports when a document lacks it; "filled" is what `sanitizeMapModel()` puts there, so a document that lacks it still renders.

| Field | In a document | `validateMapModel()` when absent | In a normalized model |
|---|---|---|---|
| `level1`, `level2`, `level3`, `level4` | required | issue `missing-level` (`valid: false`) | filled: an empty level |
| `level1.elements`, `level1.rels` | required | warning `missing-field` | filled: `[]` |
| `level2.elements`, `level2.rels` | required | warning `missing-field` | filled: `[]` |
| `level2.boundary` | required | warning `missing-field` | filled: `""` (no boundary drawn) |
| `level3[containerId]` | required to be a list | none | filled: `[]` |
| `level4.groups`, `level4.nodes`, `level4.links` | required | warning `missing-field` | filled: `[]` |
| `subgraphs` | optional | none | filled: `{}` |
| `subgraphs[key].elements` | required | warning `missing-field` | filled: `[]` |
| `subgraphs[key].rels` | optional | none | filled: `[]` |
| `level4.zones`, `level4.neighbors`, `level4.centerTitle` | optional | none | left absent: absence selects the built-in columns and title |
| `links`, `linkTiers`, `stopKinds` | optional | none | left absent: read together through `resolveModelRawLinks()`, where a present `stopKinds` means something an empty default would not |
| `routes`, `aliases` | optional | none | left absent (`aliases` is cleaned when present; `collapseModelSubgraphs()` returns the full alias table) |
| `schema`, titles, summaries, base URLs | optional | `missing-schema` for `schema`, none for the rest | left absent |
| on an element or a deployment node: `kind`, `status`, `at`, `source`, `children`, `childRels`, `hosts`, `deps`, `runs`, `deployed`, `roadmap`, `live`, `diff`, `facts`, … | optional | none | left absent: absence is the value (no source link, no inline children, hosts nothing) |
| on a relationship or a link: `label`, `tech`, `status`, `kind`, `stop`, `at`, `sites`, `coupling`, `phase`, `violations` | optional | none | left absent |
| `id`, `name` on an element | required | warning `missing-field` (and the issues for ids) | filled: `id` is `""` (the readers take it as "has none"), `name` is the id |
| `id`, `kind`, `title`, `role` on a deployment node | required | warning `missing-field` | filled: `id`, `kind` and `role` are `""`, `title` is the id |
| `from`, `to` on a relationship or link | required | warning `missing-field` (and the issues for ends) | not filled: a relationship or link without both ends is dropped |
| any other field the types require (`path` of a source, `rule` of a violation, `pattern` and `handler` of a route, …) | required | warning `missing-field` | left absent |

A field that is there with a value of another JSON type than its type (a number for a `label`, an object for a list) is reported as `invalid-type` and read as absent, before the filling above.

**The schema name.** A canonical document names its schema in a top-level `schema` field, and the name is exported as `TUX_MAP_SCHEMA`:

```json
{ "schema": "tux-map/1", "generatedAt": "2026-11-09T00:00:00Z", "level1": { "elements": [], "rels": [] }, "level2": { "boundary": "", "elements": [], "rels": [] }, "level3": {}, "level4": { "groups": [], "nodes": [], "links": [] } }
```

The field is optional in the type, and nothing about it stops a map from rendering:

- **The normalizer stamps it.** Whatever it is given, (a), (b) or (c), the level model it returns carries `schema: "tux-map/1"`. A site document's own numeric `schema` (for example `2`) is a different field on a different document and is not copied. The caller's object is not written to.
- **`validateMapModel()` warns when a level model lacks it.** The result has a `warnings` array beside `issues`: `missing-schema` when the field is absent, `unknown-schema` when it holds anything other than `"tux-map/1"` (the message names the value found and the value supported). Warnings never change `valid`, and the document is read as `tux-map/1`, best effort.
- **An unknown name survives the normalizer.** A level model that says, for example, `"schema": "tux-map/2"` keeps that value through `normalizeArchitectureModelInput()`, so the warning is still there for whoever validates the result. Stamping over it would hide the mismatch at the one place that sees it.
- **`<TuxArchitectureMap>` reports the warning once.** The component validates the `model` prop as the host passed it, before it changes anything, and writes each schema warning to the console once per model object (`[TuxArchitectureMap] …`). It draws no notice for it.

What a host sees, by what it passes to `model`:

| The host passes | Outcome |
|---|---|
| A level model with `"schema": "tux-map/1"`, or the output of `normalizeArchitectureModelInput()` | No warning. |
| A level model with no `schema` | One console warning (`missing-schema`). It renders as before. |
| A level model with another `schema` | One console warning (`unknown-schema`). It renders, best effort. |
| (b) or (c), unconverted | No schema warning: these are not level models, and the name is not theirs to carry. The component does not read them; it shows its "Model diagnostics" note for the missing levels, as it did before. Convert them with `normalizeArchitectureModelInput()` first. |
| (b) or (c) through `normalizeArchitectureModelInput()` | No warning: the result is a stamped level model. |

To check a file where it is produced, call `validateMapModel()` on the document as written, not on the normalizer's output, which is already stamped.

### The schema file, and what the validator checks with it

`schema/tux-map-1.schema.json` is the JSON Schema (draft 2020-12) of `tux-map/1`: `TuxMapLevelModel` and every type it is made of, with their doc comments as descriptions. It is generated from the TypeScript types by `scripts/build-map-schema.mjs` and never edited; the package's tests fail when the file is out of date with the types (`npm run check:schema -w @tti/tti-ux-diagrams`, and `build:schema` to write it). Import it as `@tti/tti-ux-diagrams/schema/tux-map-1.schema.json` to check a document in a producer written in any language. Any JSON Schema 2020-12 validator reads it; in JavaScript, `validateMapModel()` does the same check with no validator to install.

The schema says what the types say and no more. No object is closed, so a property the types do not name passes: a document written for a later release is still a `tux-map/1` document to this one.

`validateMapModel()` checks every document against the same schema and adds what it finds to `warnings`, each with the `path` (a JSON Pointer) of the value. It carries its own copy of the schema and reads it with an interpreter: it has no dependency and generates no code, so it runs under a Content Security Policy without `unsafe-eval`.

| Code | The document has | The map |
|---|---|---|
| `missing-field` | No value (or `null`) for a field the types require. | Fills a required list with an empty one, an element's `name` and a deployment node's `title` with the id, and leaves the rest absent. |
| `invalid-type` | A value of another JSON type than the types have: a number for a `label`, an object for a list, a tuple of another length. | Leaves the value out, and then treats the field as missing. |
| `unknown-kind` | An element `kind` outside `TuxMapElementKind`. | Keeps it and shows the element under that kind. |
| `unknown-enum-value` | Any other value outside a closed list (`status`, `coupling`, `phase`, a violation's `severity`, …). | Keeps it; the element or link is drawn without the styling of a value it does not know. |

All four are warnings: they never change `valid`, and a document with any of them renders. The last two are warnings for a second reason, which is forward compatibility: a kind or an enum value this release does not list is exactly what a document from a later producer looks like, and a consumer that gates on `valid` must not refuse a model the day its producer is upgraded. One rule broken in many places is one warning, with the `path` of the first place and a `count`. `<TuxArchitectureMap>` writes them to the console once per model, like the schema-name warnings.

## Benchmarking the architecture map

A change to the map's performance should land with a number. The benchmark gives one, and keeps a regression in how the map scales from merging.

```bash
npm run bench:map -w @tti/tti-ux-diagrams               # both halves: about 2 minutes
npm run bench:map -w @tti/tti-ux-diagrams -- --utils    # the utils half: about 20 seconds
npm run bench:map -w @tti/tti-ux-diagrams -- --record   # also rewrite the committed baseline
npm run bench:map -w @tti/tti-ux-diagrams -- --report   # print what the last run wrote
npm run bench:map -w @tti/tti-ux-diagrams -- --profile=links   # a CPU profile of one scenario at 10,000 symbols
```

It builds three synthetic repositories from a seeded generator (`tests/support/mapSyntheticModels.ts`, no `Math.random`): about 500, 2,500 and 10,000 symbols, 2 to 5 links a symbol, and 30, 60 and 120 cards in the deepest view. Each has containers, components, folders, files and symbols, cross-component links, tests, routes, single-child folder chains and lazy files. Every scenario is timed at all three sizes in one process: a warm-up, then nine samples a size, interleaved, reported as the median and the 90th percentile.

| Scenario | Measured | What it times |
|---|---|---|
| `pipeline` | utils | `sanitizeMapModel` → `collapseModelSubgraphs` → `buildMapParentIndex` → `resolveModelRawLinks` → `liftLinksToView` → `routeGridWires` for the deepest view |
| `sanitize`, `collapse`, `parent-index`, `links`, `lift-view`, `route`, `search-index` | utils | one stage each (`links` is `extractModelLinks`) |
| `hover` | utils | `routeGridWires` for the wires the hovered card opens, and no others |
| `selection` | utils | `computeLinkBlastRadius` for one symbol, unfiltered and by kind |
| `lazy-merge` | utils | one resolved subgraph merged: sanitize, collapse and index again |
| `lazy-merge-first`, `lazy-merge-next` | utils | the first and a later resolved subgraph added to the merged model, and the parent index extended |
| `lazy-links-next`, `lazy-search-next` | utils | a later resolved subgraph worked into the links and the search index kept from the model before |
| `go-to` | utils | `searchArchitectureMap`, four queries over the built index |
| `c-mount` | component | mounting `<TuxArchitectureMap>` on the deepest view |
| `c-stage` | component | navigating to the deepest view: the `stageData` and `routedSvg` computeds and the render |
| `c-hover` | component | a `pointerover` on one card |
| `c-select` | component | `selectElement()` with the blast radius on |
| `c-lazy-merge` | component | `resolveSubgraph` for one lazy file, through to the re-staged view |
| `c-lazy-merge-next`, `c-lazy-merge-next-derived` | component | the same for a later lazy file, with one already resolved; `-derived` also reads the links and the search index afterwards, as a selection and the open palette do |
| `c-go-to` | component | one query typed into the open Go-To palette |

The **utils** rows call the exported functions directly (`tests/map-bench.test.ts`, Node). The **component** rows go through the mounted component (`tests/tux-architecture-map-bench.nuxt.test.ts` at the repository root, jsdom), because `stageData`, `routedSvg`, hover and selection live inside the `.vue` file. jsdom is not a browser: rendering costs more there than on screen and layout costs nothing, so read the component rows against each other and against their own baseline, not as frame times.

**How to read it.** The milliseconds are for people. Nothing asserts on them, because a shared CI runner is several times slower than a laptop and not even as fast as itself a minute ago. What `npm test` asserts is the two ratios printed beside them: `time(2,500) / time(500)` and `time(10,000) / time(2,500)`, measured seconds apart in the same process, each with a ceiling. A step that walks the whole model once lands near 5 and 4, the size of the steps. A step that only touches one view grows with the view, not the model, and lands between 1 and 4. Add a scan inside a scan and the ratio heads for 25 and 16, through the ceiling. A round over its ceiling is measured again, twice at most, and the best round counts: noise adds time to one size at a time; a real regression fails all three rounds. The suite proves the gate on itself with a linear scan that must pass and the same scan with a quadratic term that must fail.

`--profile=<scenario>` answers where the time goes: it runs that one scenario and writes `<out>/profile/<scenario>.cpuprofile`, a V8 CPU profile of five calls at 10,000 symbols, which a browser's DevTools opens in the Performance tab.

The committed baseline (`tests/support/map-bench.baseline.json`) records the machine, the Node version and the commit it was taken at. When it exists, the table's last column compares the 10,000-symbol median with it, divided by a fixed reference workload timed in the same run, so two machines can be read side by side. That column is information, not a gate. For a before and after, run `bench:map` on `main` and on the branch on the same machine and quote both rows; re-record the baseline when a change moves a number on purpose, and raise or lower that scenario's `bounds` in the test to about twice its new ratio.

## What the architecture map's tests cover

Three groups of tests run in `npm test`. None of them runs in a browser.

| Suite | Where | What it runs |
|---|---|---|
| Unit | `packages/diagrams/tests/*.test.ts`, Node | The exported functions of `app/utils/tuxArchitectureMap.ts`, called directly |
| Mounted | `tests/components/tux-architecture-map.nuxt.test.ts` and `tests/tux-architecture-map-*.nuxt.test.ts` at the repository root, jsdom | `<TuxArchitectureMap>` mounted in a Nuxt test app |
| MCP | the server requests in `packages/diagrams/tests/diagrams.test.ts`, and `tests/tux-mcp-cli.test.mjs` at the repository root | `scripts/tux-mcp.mjs`, in process and as a child process |

**Covered.**

- **Unit:** the geometry of the level's overview (`minimap`); validating, sanitizing and collapsing a model; the travel's duration, curve and path (`map-travel.test.ts`); the parent index; reading the links and lifting them onto a view; the blast radius and the branch delta; the node, impact and path queries; the Go-To search; the freehand path builders; merging a lazy subgraph into the model, compared with a full rebuild on generated models; wire-label placement, compared with a recorded snapshot, and the port labels, which no level of the docs sample, the real producer's output or the synthetic repositories draws over a card; every case of the published conformance fixture; the API snapshots; this README's tables of props, events, public exports and model fields, compared with the code; and the growth ratios of the benchmark.
- **Mounted:** the levels and moving between them by button, breadcrumb, double-click and mouse wheel; the camera's travel (`tests/tux-architecture-map-travel.nuxt.test.ts`, with Web Animations and animation frames recorded; the curve was sampled in a browser); the list view; magnify and Fit; the level's overview (when it is rendered, shown and held, and what a press and the arrow keys do, with the viewport's size supplied by the test); the details panel and where focus goes; the blast radius switch; sticky notes by level; reduced motion; two axe checks; a lazy subgraph's arrival, and one that resolves empty; what a toggle rebuilds; one mount of a 2,500-symbol model; and the growth ratios of the mounted benchmark.
- **MCP:** the four architecture tools (`tux_query_architecture_nodes`, `tux_query_architecture_impact`, `tux_find_architecture_path`, `tux_compute_graph_delta`) and the resource list, as JSON-RPC requests handled in process, with and without a model. As a child process: `--call` and `--list-tools` writing a result larger than a pipe's buffer, the exit codes, and the errors written to stderr.

**Not covered.**

- **Anything a browser does.** jsdom does no layout, so no test asserts on rendered sizes, on the container-query layout or on scrolling. Where a wire label is drawn at its port, and how far a selection slides the stage, are asserted on the rectangles the component computes and the styles it writes (`tests/tux-architecture-map-hover-select.nuxt.test.ts`, `packages/diagrams/tests/map-port-labels.test.ts`), with the panel's position supplied by the test; that drawn text fits the box the router kept clear is not. The 44 px targets and the 7:1 contrast are not asserted by these suites, and no audit script in this repository reads the map's styles.
- **Touch and pinch.** No test sends a touch event, or a pointer event from a finger or a pen. The only pointer events sent are `pointerover`, `pointermove` and `pointerleave` from a mouse. No test sends a wheel event with Ctrl held, which is what a trackpad pinch sends. The help text for a touch screen (`pointer: coarse`) is not tested either.
- **Drawing.** The path builders for the pen and the laser are unit-tested. Drawing a stroke on the mounted map is not.
- **`resize` and `autoListBreakpoint`.** One test sends a `resize` event, to check that the breadcrumb collapses at 375 px. One test opens `initialView="auto"` at 375 px with the default breakpoint. No test passes `autoListBreakpoint`, and none resizes a mounted map across the breakpoint. jsdom has no `ResizeObserver`, so the code that observes the map's own width does not run.
- **The hover re-route.** `tests/tux-architecture-map-hover.nuxt.test.ts` counts the calls to the wire router on one hand-built model: three files at Level 5. On larger models a hover is timed (the 2,500-symbol mount, and the benchmark's `hover` and `c-hover` rows), and its calls are not counted.
- **MCP over stdio.** Of the four architecture tools, the child-process tests call only `tux_query_architecture_nodes`. No test runs the server as a long-lived process that reads requests from stdin.
- **The custom element.** `packages/elements` has no tests. Its only check is that the bundle builds, which `npm test` runs.
- **The React shell.** `packages/react/src/components/TuxArchitectureMap.tsx` has no test file. The next section says what that file is.

## The architecture map outside Vue

The map is one Vue component, `app/components/TuxArchitectureMap.vue`. The files that carry its name elsewhere in the repository are these.

| File | What it is |
|---|---|
| `packages/react/src/components/TuxArchitectureMap.tsx` | A shell written by `scripts/sync-engine.mjs`: 23 lines, a `<figure class="tux-architecture-map">` around its children. It takes `children`, `className` and `style`. It takes no model and draws no map. The index of `@tti/tti-ux-react` does not export it. |
| `kit/js`, `kit/python`, `kit/kotlin`, `kit/php`, `kit/swift`, `kit/csharp` (one file each under `components/`) | The same shell from the same script, 12 to 28 lines each: a `figure` element or its counterpart, with the class name and nothing inside. |
| `packages/elements/src/index.ts` | The custom element `<tux-architecture-map>`, written by `scripts/build-elements.mjs`. It is Vue's `defineCustomElement` of the component itself, so it is the whole map. |

The custom element is the only surface outside Vue that draws the map. What it needs from the page that hosts it:

- **Vue.** The bundle does not contain Vue. `dist/tux-elements.js` imports `vue` and `@nuxt/ui/vue-plugin`, and the build that consumes it resolves both. `@nuxt/ui/vue-plugin` is a module that Nuxt UI's Vite plugin (`@nuxt/ui/vite`) supplies; the `@nuxt/ui` package holds only its types.
- **Styles.** The element is defined with `shadowRoot: false`, so it renders into the page and takes its styles from the page. The component styles are in `dist/tti-ux-elements.css`. The package's `exports` list `./styles.css` and `./tux-tokens.css`, which are the tokens, and do not list that file.
- **The model as a property.** `model` is an object, so it is set as a DOM property, not as an attribute.

It has no tests (see the section above).

**Decision: there will be no React rewrite of the map.** A React application wraps the custom element:

```tsx
import { createElement, useEffect, useRef } from "react";
import "@tti/tti-ux-elements";

export function ArchitectureMap({ model }: { model: object }) {
  const el = useRef<HTMLElement & { model?: object }>(null);
  useEffect(() => { if (el.current) el.current.model = model; }, [model]);
  return createElement("tux-architecture-map", { ref: el });
}
```

The `ref` is needed. Vue declares the element's properties when the element connects to the document, and React 19 sets a prop before that, so `model` passed as a prop arrives as the attribute `model="[object Object]"`.
