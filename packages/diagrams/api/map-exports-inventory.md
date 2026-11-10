# Architecture map runtime: export inventory

A record of how each export of `app/utils/tuxArchitectureMap.ts` was sorted into `@public` and
`@internal` at 3.12.0 (tti/tti-ux#161): who used it in this repository at the time, and why it
landed where it did. It is written once and is not regenerated; the current surface is
[`map-runtime.api.md`](./map-runtime.api.md), which the tests keep in step with the code.

155 exports: 114 public, 41 internal. The sample entry point exports one more name,
`DEFAULT_TTI_LEVEL_MODEL` (public: the docs site and the tests render it).

## How the line was drawn

- **Public** is what a renderer, a build tool or an agent needs to read, check, query and compare a
  map model: the model types, the validators, the link and blast-radius engine, the delta, the
  queries and the search, and every type one of those declarations names.
- **Internal** is how the component draws: pixel geometry, path builders, the wire router, caches,
  comparators and object helpers.
- In doubt, public. Nothing was removed or renamed, and internal exports stay importable and typed;
  the tag says only that they may change without notice.
- No public declaration names an internal type; `scripts/build-map-api.mjs` refuses one that does.

## Reading the table

The consumers column counts the references outside the module itself, by where they are: the
component, the sample model, the MCP server script, the conformance generator, the docs site, the
tests, the README, and the docs and changelog. The React and elements packages and the kit use the
component and none of these exports directly. Packages outside this repository cannot be counted;
that is why internal exports were kept in the typings rather than stripped.

| Export | Kind | Consumers in this repository | Surface | Reason |
|---|---|---|---|---|
| `EMPTY_TTI_LEVEL_MODEL` | const | component (3), package tests (8), root tests (2), docs and changelog (1) | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `FreehandStrokeOptions` | interface | none outside the module | public | Named by public `getSmoothedFreehandSvgPath`. |
| `GRID_METRICS` | const | component (2), package tests (2) | internal | Pixel metrics of the component's grid; they change with the design. |
| `LOD_THRESHOLDS` | const | none outside the module | internal | Rendering detail of the component's semantic zoom; the `lodMode` prop is the contract. |
| `SmoothStepEdgeResult` | interface | none outside the module | internal | SVG path builder for the legacy canvas edges; a drawing detail. |
| `TUX_MAP_ELEMENT_KIND_LABELS` | const | component (1), package tests (2) | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TUX_MAP_LINK_KIND_LABELS` | const | component (20), package tests (3), docs and changelog (1) | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TUX_MAP_LINK_STRENGTH_ORDER` | const | package tests (3) | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TUX_MAP_QUIET_LINK_KINDS` | const | component (3), docs and changelog (1) | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TUX_MAP_SEARCH_GROUPS` | const | none outside the module | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TUX_MAP_VALID_BLAST_INTENTS` | const | none outside the module | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TUX_MAP_WIRE_CATEGORIES` | const | component (2) | public | Model vocabulary a renderer or an agent needs to label and order what it reads. |
| `TuxMapAcpLease` | interface | docs and changelog (1) | public | Named by public `coordinateAcpSubgraphLease`. |
| `TuxMapBlastHit` | interface | none outside the module | public | Named by public `TuxMapBlastResult`. |
| `TuxMapBlastIntent` | type | component (5), conformance generator (2), package tests (7) | public | Type of a component prop or event. |
| `TuxMapBlastOptions` | interface | none outside the module | public | Named by public `computeLinkBlastRadius` and 2 more public declarations. |
| `TuxMapBlastResult` | interface | none outside the module | public | Named by public `computeLinkBlastRadius`. |
| `TuxMapCoarseParentStep` | interface | none outside the module | public | Named by public `TuxMapImpactQueryResult`. |
| `TuxMapCollaborator` | interface | docs and changelog (1) | public | Model vocabulary named in the docs; kept public when in doubt. |
| `TuxMapCompactNodeRecord` | interface | none outside the module | public | Named by public `queryArchitectureNodes`. |
| `TuxMapComputeResource` | interface | none outside the module | public | Named by public `TuxMapResource`. |
| `TuxMapDeploymentGroup` | interface | none outside the module | public | Named by public `TuxMapLevelModel`. |
| `TuxMapDeploymentLink` | interface | none outside the module | public | Named by public `TuxMapLevelModel`. |
| `TuxMapDeploymentNode` | interface | component (14) | public | Type of a component prop or event. |
| `TuxMapDeploymentZone` | interface | component (2) | public | Named by public `TuxMapLevelModel`. |
| `TuxMapDiffInfo` | interface | component (3) | public | Named by public `TuxMapLevelElement` and 2 more public declarations. |
| `TuxMapEdge` | interface | component (2), package tests (2) | public | Type of a component prop or event. |
| `TuxMapElementChangeKind` | type | none outside the module | public | Named by public `TuxMapNodeDelta`. |
| `TuxMapElementKind` | type | component (2), docs and changelog (1) | public | Named by public `TUX_MAP_ELEMENT_KIND_LABELS` and 1 more public declaration. |
| `TuxMapElementLiveInfo` | interface | none outside the module | public | Named by public `TuxMapLevelElement`. |
| `TuxMapElementStatus` | type | none outside the module | public | Named by public `TuxMapLevelElement` and 1 more public declaration. |
| `TuxMapFirewallRule` | interface | none outside the module | public | Named by public `TuxMapDeploymentNode`. |
| `TuxMapGraphDelta` | interface | none outside the module | public | Named by public `computeGraphDelta`. |
| `TuxMapGraphDeltaOptions` | interface | none outside the module | public | Named by public `computeGraphDelta`. |
| `TuxMapGraphEdgeRecord` | interface | none outside the module | public | Named by public `buildUnifiedArchitectureGraph` and 4 more public declarations. |
| `TuxMapGraphNodeRecord` | interface | none outside the module | public | Named by public `buildUnifiedArchitectureGraph` and 7 more public declarations. |
| `TuxMapGridCellRect` | interface | component (4), package tests (6) | internal | Pixel metrics of the component's grid; they change with the design. |
| `TuxMapHandlePosition` | type | none outside the module | internal | Canvas geometry helper; nothing outside the module uses it. |
| `TuxMapImpactHit` | interface | none outside the module | public | Named by public `TuxMapImpactQueryResult`. |
| `TuxMapImpactQueryOptions` | interface | none outside the module | public | Named by public `queryArchitectureImpact`. |
| `TuxMapImpactQueryResult` | interface | none outside the module | public | Named by public `queryArchitectureImpact`. |
| `TuxMapInkStroke` | interface | component (5), docs site (2) | public | Type of a component prop or event. |
| `TuxMapLevelElement` | interface | component (27), package tests (3) | public | Type of a component prop or event. |
| `TuxMapLevelModel` | interface | component (4), sample model (2), MCP server script (1), conformance generator (17), docs site (2), package tests (34), root tests (30) | public | Type of a component prop or event. |
| `TuxMapLevelNumber` | type | component (16) | public | Type of a component prop or event. |
| `TuxMapLevelRef` | type | docs and changelog (1) | public | Named by public `TuxMapLevelModel`. |
| `TuxMapLevelRel` | interface | component (13), package tests (3) | public | Named by public `TuxMapSubgraph` and 5 more public declarations. |
| `TuxMapLiftedSide` | interface | component (6) | public | Named by public `liftLinksToView`. |
| `TuxMapLink` | interface | component (6) | public | Named by public `TuxMapLevelModel` and 12 more public declarations. |
| `TuxMapLinkCoupling` | type | none outside the module | public | Named by public `TuxMapLink` and 2 more public declarations. |
| `TuxMapLinkPhase` | type | none outside the module | public | Named by public `TuxMapLink` and 2 more public declarations. |
| `TuxMapLinkViolation` | interface | component (5) | public | Named by public `TuxMapLevelRel` and 4 more public declarations. |
| `TuxMapLoDLevel` | type | component (3) | public | Type of a component prop or event. |
| `TuxMapNeighborResource` | interface | none outside the module | public | Named by public `TuxMapLevelModel`. |
| `TuxMapNode` | interface | component (3), package tests (2) | public | Type of a component prop or event. |
| `TuxMapNodeDelta` | interface | none outside the module | public | Named by public `TuxMapGraphDelta`. |
| `TuxMapNodeQueryOptions` | interface | none outside the module | public | Named by public `queryArchitectureNodes`. |
| `TuxMapPackageDep` | interface | none outside the module | public | Named by public `TuxMapNode`. |
| `TuxMapPathQueryOptions` | interface | none outside the module | public | Named by public `findArchitecturePath`. |
| `TuxMapPathQueryResult` | interface | none outside the module | public | Named by public `findArchitecturePath`. |
| `TuxMapPersonResource` | interface | none outside the module | public | Named by public `TuxMapResource`. |
| `TuxMapPlacedBoundary` | interface | component (4) | internal | Wire router of the component's stage; its output is pixels for one layout, not a model. |
| `TuxMapQueryIndex` | interface | none outside the module | internal | Per-model cache behind the query functions; its shape follows the engine. |
| `TuxMapRect` | interface | none outside the module | internal | Canvas geometry helper; nothing outside the module uses it. |
| `TuxMapResource` | type | none outside the module | public | Named by public `TuxMapNode`. |
| `TuxMapResourceKind` | type | none outside the module | public | Named by public `TuxMapComputeResource`. |
| `TuxMapRouteEntry` | interface | none outside the module | public | Named by public `TuxMapLevelModel`. |
| `TuxMapRoutedLabel` | interface | none outside the module | internal | Wire router of the component's stage; its output is pixels for one layout, not a model. |
| `TuxMapRoutedWire` | interface | none outside the module | internal | Wire router of the component's stage; its output is pixels for one layout, not a model. |
| `TuxMapSearchEntry` | interface | component (3) | public | Named by public `TuxMapSearchHit` and 2 more public declarations. |
| `TuxMapSearchGroup` | type | none outside the module | public | Named by public `TuxMapSearchEntry` and 1 more public declaration. |
| `TuxMapSearchGroupResult` | interface | component (2) | public | Named by public `searchArchitectureMap`. |
| `TuxMapSearchHit` | interface | component (3) | public | Named by public `TuxMapSearchGroupResult` and 1 more public declaration. |
| `TuxMapSourceRef` | interface | component (1) | public | Named by public `TuxMapLevelElement` and 6 more public declarations. |
| `TuxMapStatus` | type | none outside the module | public | Named by public `TuxMapComputeResource` and 1 more public declaration. |
| `TuxMapStickyNote` | interface | component (6), docs site (2) | public | Type of a component prop or event. |
| `TuxMapStrokePoint` | interface | component (4) | public | Type of a component prop or event. |
| `TuxMapSubgraph` | interface | component (7), docs and changelog (1) | public | Type of a component prop or event. |
| `TuxMapTool` | type | component (2) | public | Named by public `TuxMapCollaborator`. |
| `TuxMapTraceHop` | interface | none outside the module | public | Named by public `TuxMapTraceResult`. |
| `TuxMapTraceResult` | interface | component (2) | public | Named by public `traceSpreadingPath`. |
| `TuxMapUnknownNodeError` | interface | none outside the module | public | Named by public `queryArchitectureImpact` and 1 more public declaration. |
| `TuxMapValidationIssue` | interface | none outside the module | public | Named by public `TuxMapValidationResult`. |
| `TuxMapValidationIssueCode` | type | none outside the module | public | Named by public `TuxMapValidationIssue`. |
| `TuxMapValidationResult` | interface | none outside the module | public | Named by public `validateMapModel` and 1 more public declaration. |
| `TuxMapViewport` | interface | none outside the module | internal | Viewport arithmetic of the component's canvas. |
| `TuxMapWireCategory` | type | component (7) | public | Type of a component prop or event. |
| `TuxMapWireDelta` | interface | none outside the module | public | Named by public `TuxMapGraphDelta`. |
| `TuxMapWireInspectorDetail` | interface | component (6) | public | Named by public `liftLinksToView`. |
| `TuxMapWireInspectorLinkItem` | interface | none outside the module | public | Named by public `TuxMapWireInspectorDetail`. |
| `TuxMapZone` | interface | component (2) | public | Type of a component prop or event. |
| `buildLevelModelFromLegacyNodes` | function | component (2), package tests (2) | public | Model-level helper with a stable meaning; kept public when in doubt. |
| `buildMapParentIndex` | function | component (4), conformance generator (3), package tests (15) | public | Used by the conformance generator, which other engines are checked against. |
| `buildMapSearchIndex` | function | component (2), package tests (3) | public | Named as public API in the issue. |
| `buildUnifiedArchitectureGraph` | function | MCP server script (2), conformance generator (2), package tests (7), docs and changelog (1) | public | Used by the MCP server script through the runtime. |
| `buildVendoredCopyIndex` | function | component (2) | internal | Building block of a public function (`liftLinksToView`, `foldVendoredCopies`). |
| `classifyBlastLink` | function | component (2), package tests (2) | public | Model-level helper with a stable meaning; kept public when in doubt. |
| `classifyLinkDependencyCategory` | function | component (4), package tests (6), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `cmpCodepoint` | function | component (8) | internal | Sort comparator used inside the engine. |
| `collapseModelSubgraphs` | function | component (2), package tests (6), docs and changelog (1) | public | Named as public API in the issue. |
| `compareBlastLinks` | function | component (2) | internal | Sort comparator used inside the engine. |
| `computeDependencyBlastRadius` | function | package tests (4), docs and changelog (1) | public | Deprecated alias: still public until its removal is scheduled. |
| `computeGraphDelta` | function | MCP server script (2), conformance generator (2), package tests (4), README (1), docs and changelog (2) | public | Named as public API in the issue. |
| `computeLinkBlastRadius` | function | component (5), conformance generator (2), package tests (15), README (2), docs and changelog (4) | public | Named as public API in the issue. |
| `computeMapAutoLayout` | function | package tests (2) | internal | Auto-layout of the legacy flat canvas; a drawing detail. |
| `coordinateAcpSubgraphLease` | function | package tests (6), docs and changelog (2) | public | Deprecated alias: still public until its removal is scheduled. |
| `deriveLinkId` | function | none outside the module | internal | Id-format helper; the id format is described by the model, the parser is not a contract. |
| `extractModelLinks` | function | component (2), MCP server script (2), conformance generator (3), package tests (6), docs and changelog (1) | public | Used by the MCP server script through the runtime. |
| `filterLinksByCategories` | function | component (2), package tests (2), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `findArchitecturePath` | function | MCP server script (2), package tests (22), README (1), docs and changelog (2) | public | Named as public API in the issue. |
| `findShortestArchitecturePath` | function | package tests (3), docs and changelog (3) | public | Deprecated alias: still public until its removal is scheduled. |
| `foldVendoredCopies` | function | component (4), package tests (5), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `getBezierEdgePath` | function | package tests (2) | internal | SVG path builder for the legacy canvas edges; a drawing detail. |
| `getBoundsOfRects` | function | none outside the module | internal | Canvas geometry helper; nothing outside the module uses it. |
| `getLaserPointerSvgPath` | function | component (2), package tests (3), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `getMapQueryIndex` | function | package tests (9) | internal | Per-model cache behind the query functions; its shape follows the engine. |
| `getNodeDimensionsForLoD` | function | none outside the module | internal | Rendering detail of the component's semantic zoom; the `lodMode` prop is the contract. |
| `getSmoothStepEdgePath` | function | package tests (2) | internal | SVG path builder for the legacy canvas edges; a drawing detail. |
| `getSmoothedFreehandSvgPath` | function | component (3), package tests (2), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `getStraightEdgePath` | function | package tests (2) | internal | SVG path builder for the legacy canvas edges; a drawing detail. |
| `getSvgPathFromStrokeOutline` | function | none outside the module | internal | Low-level step of the ink path builders; the two ink functions are the public form. |
| `getViewportForBounds` | function | none outside the module | internal | Canvas geometry helper; nothing outside the module uses it. |
| `gridCellToPx` | function | component (4), package tests (2) | internal | Pixel metrics of the component's grid; they change with the design. |
| `hasOwn` | function | component (88), conformance generator (2) | internal | Prototype-safe object helper; generic, not about maps. |
| `inferLinkCoupling` | function | conformance generator (1), package tests (2) | public | Used by the conformance generator, which other engines are checked against. |
| `inferLinkPhase` | function | conformance generator (1), package tests (2) | public | Used by the conformance generator, which other engines are checked against. |
| `isKindNodeId` | function | component (14) | internal | Id-format helper; the id format is described by the model, the parser is not a contract. |
| `levelForFocus` | function | component (16), conformance generator (2), package tests (3), docs and changelog (1) | public | Used by the conformance generator, which other engines are checked against. |
| `liftLinksToView` | function | component (3), package tests (10), README (2), docs and changelog (2) | public | Named as public API in the issue. |
| `liftToSet` | function | component (10) | internal | Building block of a public function (`liftLinksToView`, `foldVendoredCopies`). |
| `mapAncestorsOf` | function | component (17), package tests (6) | public | Model-level helper with a stable meaning; kept public when in doubt. |
| `normalizeArchitectureModelInput` | function | MCP server script (2), package tests (11) | public | Named as public API in the issue. |
| `plainElementKindLabel` | function | component (10), package tests (7), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `queryArchitectureImpact` | function | MCP server script (2), package tests (27), README (1), docs and changelog (4) | public | Named as public API in the issue. |
| `queryArchitectureLayer` | function | package tests (3), docs and changelog (3) | public | Deprecated alias: still public until its removal is scheduled. |
| `queryArchitectureNodes` | function | MCP server script (2), conformance generator (2), package tests (7), README (1), docs and changelog (2) | public | Named as public API in the issue. |
| `queryMultiLevelBlastRadius` | function | package tests (3), docs and changelog (3) | public | Deprecated alias: still public until its removal is scheduled. |
| `resetArchitectureDeprecationWarnings` | function | package tests (3) | internal | Test hook: resets the warn-once state of the deprecated aliases. |
| `resolveModelRawLinks` | function | component (3), package tests (3), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `resolveOptimalEdgeAnchors` | function | none outside the module | internal | Canvas geometry helper; nothing outside the module uses it. |
| `resolveSemanticLoD` | function | package tests (5) | internal | Rendering detail of the component's semantic zoom; the `lodMode` prop is the contract. |
| `roundOrthogonalCorners` | function | none outside the module | internal | Pixel metrics of the component's grid; they change with the design. |
| `routeDeploymentWires` | function | component (2), package tests (4), docs and changelog (2) | internal | Wire router of the component's stage; its output is pixels for one layout, not a model. |
| `routeGridWires` | function | component (2), package tests (3), docs and changelog (2) | internal | Wire router of the component's stage; its output is pixels for one layout, not a model. |
| `sanitizeMapModel` | function | component (2), package tests (7), docs and changelog (1) | public | Named as public API in the issue. |
| `screenToWorld` | function | package tests (3) | internal | Viewport arithmetic of the component's canvas. |
| `searchArchitectureMap` | function | component (2), package tests (5), README (1) | public | Named as public API in the issue. |
| `setOwnProp` | function | component (7) | internal | Prototype-safe object helper; generic, not about maps. |
| `splitNodeId` | function | component (6) | internal | Id-format helper; the id format is described by the model, the parser is not a contract. |
| `stripNodeKindPrefix` | function | component (5) | internal | Id-format helper; the id format is described by the model, the parser is not a contract. |
| `suggestCloseNodeIds` | function | package tests (2) | internal | Builds the suggestions inside a query error; the error is the public form. |
| `traceSpreadingPath` | function | component (3), package tests (8), docs and changelog (1) | public | Named in the docs or the changelog; kept public when in doubt. |
| `validateMapModel` | function | package tests (3), docs and changelog (1) | public | Named as public API in the issue. |
| `worldToScreen` | function | package tests (2) | internal | Viewport arithmetic of the component's canvas. |
| `zoomAroundScreenPoint` | function | package tests (2) | internal | Viewport arithmetic of the component's canvas. |
