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
| Model | The `TuxMap*` model types (`TuxMapLevelModel` and what it is made of); `TUX_MAP_SCHEMA`; `EMPTY_TTI_LEVEL_MODEL`, `DEFAULT_TTI_LEVEL_MODEL` (sample entry); `normalizeArchitectureModelInput()`, `validateMapModel()`, `sanitizeMapModel()`, `collapseModelSubgraphs()`, `buildLevelModelFromLegacyNodes()`, `extractModelLinks()`, `resolveModelRawLinks()` |
| Vocabulary | `TUX_MAP_ELEMENT_KIND_LABELS`, `TUX_MAP_LINK_KIND_LABELS`, `TUX_MAP_LINK_STRENGTH_ORDER`, `TUX_MAP_QUIET_LINK_KINDS`, `TUX_MAP_VALID_BLAST_INTENTS`, `TUX_MAP_WIRE_CATEGORIES`, `plainElementKindLabel()` |
| Levels | `buildMapParentIndex()`, `levelForFocus()`, `mapAncestorsOf()` |
| Links and blast radius | `liftLinksToView()`, `computeLinkBlastRadius()`, `classifyBlastLink()`, `inferLinkCoupling()`, `inferLinkPhase()`, `classifyLinkDependencyCategory()`, `filterLinksByCategories()`, `foldVendoredCopies()`, `traceSpreadingPath()` |
| Branch delta | `computeGraphDelta()` |
| Queries | `buildUnifiedArchitectureGraph()`, `queryArchitectureNodes()`, `queryArchitectureImpact()`, `findArchitecturePath()` |
| Search | `TUX_MAP_SEARCH_GROUPS`, `buildMapSearchIndex()`, `searchArchitectureMap()` |
| Ink | `getSmoothedFreehandSvgPath()`, `getLaserPointerSvgPath()` |
| Deprecated, still public | `computeDependencyBlastRadius()`, `queryArchitectureLayer()`, `queryMultiLevelBlastRadius()`, `findShortestArchitecturePath()`, `coordinateAcpSubgraphLease()` |

The result and option types of those functions are public with them; the snapshot lists every declaration.

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

A fourth kind of file, a placement config (`rules` and no model), is refused with an error that says what it is.

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

- **Unit:** validating, sanitizing and collapsing a model; the parent index; reading the links and lifting them onto a view; the blast radius and the branch delta; the node, impact and path queries; the Go-To search; the freehand path builders; merging a lazy subgraph into the model, compared with a full rebuild on generated models; wire-label placement, compared with the full scans; every case of the published conformance fixture; the API snapshots; and the growth ratios of the benchmark.
- **Mounted:** the levels and moving between them by button, breadcrumb, double-click and mouse wheel; the list view; magnify and Fit; the details panel and where focus goes; the blast radius switch; sticky notes by level; reduced motion; two axe checks; a lazy subgraph's arrival, and one that resolves empty; what a toggle rebuilds; one mount of a 2,500-symbol model; and the growth ratios of the mounted benchmark.
- **MCP:** the four architecture tools (`tux_query_architecture_nodes`, `tux_query_architecture_impact`, `tux_find_architecture_path`, `tux_compute_graph_delta`) and the resource list, as JSON-RPC requests handled in process, with and without a model. As a child process: `--call` and `--list-tools` writing a result larger than a pipe's buffer, the exit codes, and the errors written to stderr.

**Not covered.**

- **Anything a browser does.** jsdom does no layout, so no test asserts on rendered sizes, on the container-query layout or on scrolling. The 44 px targets and the 7:1 contrast are not asserted by these suites, and no audit script in this repository reads the map's styles.
- **Touch and pinch.** No test sends a touch event, or a pointer event from a finger or a pen. The only pointer events sent are `pointerover` and `pointermove` from a mouse. No test sends a wheel event with Ctrl held, which is what a trackpad pinch sends. The help text for a touch screen (`pointer: coarse`) is not tested either.
- **Drawing.** The path builders for the pen and the laser are unit-tested. Drawing a stroke on the mounted map is not.
- **`resize` and `autoListBreakpoint`.** One test sends a `resize` event, to check that the breadcrumb collapses at 375 px. One test opens `initialView="auto"` at 375 px with the default breakpoint. No test passes `autoListBreakpoint`, and none resizes a mounted map across the breakpoint. jsdom has no `ResizeObserver`, so the code that observes the map's own width does not run.
- **The hover re-route.** `tests/tux-architecture-map-hover.nuxt.test.ts` counts the calls to the wire router on one hand-built model: three files at Level 5. On larger models a hover is timed (the 2,500-symbol mount, and the benchmark's `hover` and `c-hover` rows), and its calls are not counted.
- **MCP over stdio.** Of the four architecture tools, the child-process tests call only `tux_query_architecture_nodes`. No test runs the server as a long-lived process that reads requests from stdin.
- **The custom element.** `packages/elements` has no tests. Its only check is that the bundle builds, which `npm test` runs.
- **The React shell.** `packages/react/src/components/TuxArchitectureMap.tsx` has no test file. The next section says what that file is.
