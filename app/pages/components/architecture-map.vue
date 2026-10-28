<script setup lang="ts">
import {
  DEFAULT_TTI_LEVEL_MODEL,
  type TuxMapInkStroke,
  type TuxMapLevelModel,
  type TuxMapStickyNote,
} from "~/utils/tuxArchitectureMap";

useHead({ title: "TuxArchitectureMap (M.A.P.) · Multi-Level Semantic Zoom · TUX" });

const mapModel = ref<TuxMapLevelModel>(DEFAULT_TTI_LEVEL_MODEL);
const strokes = ref<TuxMapInkStroke[]>([]);
const notes = ref<TuxMapStickyNote[]>([]);

const exampleCode = `<TuxArchitectureMap
  v-model:strokes="strokes"
  v-model:notes="notes"
  eyebrow="EXHIBIT 1.0 · MASTER ARCHITECTURE PLAN (M.A.P.)"
  title="Enterprise Cloud Platform Topology (Levels 1–6)"
  caption="Scroll the mouse wheel inside the canvas, double-click any card with '+', or use the N+1 stepper (− / +), breadcrumbs, and Infrastructure toggle to zoom across Levels 1–6 (including Level 5 internal modules/schemas and Level 6 AST code symbols). Toggle 'Blast radius' to visualize PR change propagation."
  :model="mapModel"
  :initial-level="2"
  initial-view="auto"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component · @tti/tti-ux-diagrams" title="TuxArchitectureMap">
      Native TUX <strong>Master Architecture Plan (M.A.P.)</strong> with instantaneous
      <strong>Level 1 → Level 2 → Level 3 → Level 4 → Level 5/6+</strong> fractal semantic zoom,
      right-angle grid-gap wire routing, PR blast-radius overlay, source code &amp; roadmap links,
      and level-scoped freehand ink &amp; sticky-note annotations.
    </TuxPageHeader>

    <section class="space-y-4">
      <div>
        <p class="eyebrow">canonical · n-depth fractal semantic zoom m.a.p.</p>
        <h2 class="heading--bold text-xl font-bold">
          Interactive Multi-Level Architecture Map (Levels 1–6 &amp; PR Blast Radius)
        </h2>
      </div>

      <p class="text-sm text-text-secondary max-w-4xl leading-relaxed">
        Zooming changes the architectural level, not just the pixel scale:
        <strong>Level 1</strong> (people, primary systems, and external platforms),
        <strong>Level 2</strong> (containers, services, worker pools, and data stores inside the
        system boundary), <strong>Level 3</strong> (internal components, routes, and packages
        inside a container), <strong>Level 4</strong> (cloud regions, resource groups, VMs,
        firewall rules, and hosted containers), and <strong>Levels 5–6+</strong> (internal
        modules, database schemas, and AST code symbols inside a component or deployment node).
        Toggle <strong>Blast radius</strong> in the toolbar to highlight PR-modified nodes and
        their 1–2 hop upstream/downstream dependencies.
      </p>

      <TuxExample :vue="exampleCode">
        <TuxArchitectureMap
          v-model:strokes="strokes"
          v-model:notes="notes"
          eyebrow="EXHIBIT 1.0 · MASTER ARCHITECTURE PLAN (M.A.P.)"
          title="Enterprise Cloud Platform Topology (Levels 1–6)"
          caption="Scroll the mouse wheel inside the canvas, double-click any card with '+', or use the N+1 stepper (− / +), breadcrumbs, and Infrastructure toggle to zoom across Levels 1–6. Toggle 'Blast radius' to inspect PR change impact."
          :model="mapModel"
          :initial-level="2"
        />
      </TuxExample>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TuxCard title="1. Fractal N-Depth Semantic Zoom (Levels 1–6+)">
        <p class="text-sm text-text-secondary leading-relaxed">
          Transition smoothly across <strong>Level 1</strong> (Context), <strong>Level 2</strong>
          (Containers), <strong>Level 3</strong> (Components), <strong>Level 4</strong>
          (Infrastructure), and arbitrary <code>subgraphs</code> at <strong>Level 5</strong>
          (Modules / Schemas) and <strong>Level 6+</strong> (AST Code Symbols) with an
          origin-anchored portal transition.
        </p>
      </TuxCard>

      <TuxCard title="2. PR Blast-Radius Overlay &amp; Source Links">
        <p class="text-sm text-text-secondary leading-relaxed">
          Attach <code>diff</code> metadata and <code>source</code> file/line references to any
          element or deployment node. Toggling <strong>Blast radius</strong> rolls up inner
          changes to parent containers, highlights 1–2 hop impacted neighbors and wires, and
          links directly to source files and roadmap issues in the inspector drawer.
        </p>
      </TuxCard>

      <TuxCard title="3. Deep-Link v-models, Scoped Notes &amp; Kit Usage">
        <p class="text-sm text-text-secondary leading-relaxed">
          Supports two-way binding (<code>v-model:level</code>, <code>v-model:focus</code>,
          <code>v-model:selected-id</code>, <code>v-model:show-planned</code>,
          <code>v-model:show-blast-radius</code>, <code>v-model:view</code>), custom
          <code>level4.zones</code>, and level-scoped sticky notes &amp; ink strokes. Consume the
          interactive component via <code>@tti/tti-ux-diagrams</code> (Vue) or
          <code>packages/elements/dist/tux-elements.js</code>.
        </p>
      </TuxCard>
    </section>
  </div>
</template>
