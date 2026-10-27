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
  eyebrow="EXHIBIT 1.0 · MASTER ARCHITECTURE PLAN (M.A.P.)"
  title="Enterprise Cloud Platform Topology (Levels 1–4)"
  caption="Use the Level 1–4 buttons, double-click any card with '+', or press + / − / Escape to zoom between levels. Hover or click any element to bring its wires forward and inspect its live state, dependencies, and infrastructure hosts."
  :model="mapModel"
  :initial-level="2"
  v-model:strokes="strokes"
  v-model:notes="notes"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component · @tti/tti-ux-diagrams" title="TuxArchitectureMap">
      Native TUX <strong>Master Architecture Plan (M.A.P.)</strong> with instantaneous
      <strong>Level 1 → Level 2 → Level 3 → Level 4</strong> semantic zoom, right-angle
      grid-gap wire routing that never crosses cards, sliding details drawer with automatic
      stage pan, and on-demand freehand ink &amp; laser pointer tools.
    </TuxPageHeader>

    <section class="space-y-4">
      <div>
        <p class="eyebrow">canonical · 4-level semantic zoom m.a.p.</p>
        <h2 class="heading--bold text-xl font-bold">
          Interactive Multi-Level Architecture Map (Level 1 → Level 2 → Level 3 → Level 4)
        </h2>
      </div>

      <p class="text-sm text-text-secondary max-w-4xl leading-relaxed">
        Zooming changes the architectural level, not just the pixel scale:
        <strong>Level 1</strong> (people, primary systems, and external platforms),
        <strong>Level 2</strong> (containers, services, worker pools, and data stores inside the
        system boundary), <strong>Level 3</strong> (internal components, routes, and packages
        inside a container), and <strong>Level 4</strong> (cloud regions, resource
        groups, VMs, firewall rules, and hosted containers). Double-click any card with a
        <code>+</code> badge (or press <code>+</code> / <code>−</code> / <code>Escape</code>) to
        zoom across levels.
      </p>

      <TuxExample :vue="exampleCode">
        <TuxArchitectureMap
          eyebrow="EXHIBIT 1.0 · MASTER ARCHITECTURE PLAN (M.A.P.)"
          title="Enterprise Cloud Platform Topology (Levels 1–4)"
          caption="Double-click any card with '+' (or use the Level 1–4 buttons, + / −, or Escape) to zoom between levels. Hover or click any element to bring its right-angle wires forward."
          :model="mapModel"
          :initial-level="2"
          v-model:strokes="strokes"
          v-model:notes="notes"
        />
      </TuxExample>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TuxCard title="1. Multi-Level Semantic Zoom (Levels 1–4)">
        <p class="text-sm text-text-secondary leading-relaxed">
          Instead of cramming every detail onto a single oversized canvas, zooming transitions
          smoothly across <strong>Level 1</strong>, <strong>Level 2</strong>,
          <strong>Level 3</strong>, and <strong>Level 4</strong> with a 320ms origin-anchored
          scale transition that grows the next level directly out of the chosen card.
        </p>
      </TuxCard>

      <TuxCard title="2. Grid-Gap Orthogonal Wire Routing">
        <p class="text-sm text-text-secondary leading-relaxed">
          Cards sit on each level's grid and wires are routed at right angles strictly through
          the column and row gaps — never across a card — with automatic lane offsets, port
          distribution, and collision-checked labels that come forward on hover or selection.
        </p>
      </TuxCard>

      <TuxCard title="3. Cross-Level Drawer & On-Demand Ink">
        <p class="text-sm text-text-secondary leading-relaxed">
          Selecting any element opens the sliding details drawer (automatically panning the
          stage if needed to keep the chosen card in view) with one-click jumps between
          <strong>Level 2 containers</strong> and <strong>Level 4 VMs/resources</strong>, plus
          optional smoothed pen, laser pointer, and sticky notes.
        </p>
      </TuxCard>
    </section>
  </div>
</template>
