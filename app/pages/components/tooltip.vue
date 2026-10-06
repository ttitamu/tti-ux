<script setup lang="ts">
import tuxTooltipSource from "~/components/TuxTooltip.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxTooltip · TUX" });

const tooltipControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Tooltip Title",
    type: "text",
    defaultValue: "Drift Reconciler",
    description: "Header text rendered with signature editorial hairline divider",
  },
  {
    prop: "text",
    label: "Body Text",
    type: "text",
    defaultValue: "Closes stale index entries every 30 minutes by scanning live telemetry storage.",
    description: "Descriptive body text tuned to 22ch reading column width",
  },
  {
    prop: "side",
    label: "Placement Side",
    type: "select",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "top",
    description: "Anchor position relative to trigger element",
  },
  {
    prop: "arrow",
    label: "Show Pointer Arrow",
    type: "boolean",
    defaultValue: true,
    description: "Renders floating pointer triangle toward trigger",
  },
];

const tooltipPresets: TuxPlaygroundPreset[] = [
  {
    name: "concept-explainer",
    label: "Concept Explainer",
    description: "Title with hairline divider and descriptive body",
    icon: "lucide:help-circle",
    values: {
      title: "Drift Reconciler",
      text: "Closes stale index entries every 30 minutes by scanning live telemetry storage.",
      side: "top",
      arrow: true,
    },
  },
  {
    name: "quick-action",
    label: "Quick Action Label",
    description: "Compact single-line tooltip for buttons and controls",
    icon: "lucide:mouse-pointer",
    values: {
      title: "",
      text: "Sync real-time sensor streams now",
      side: "top",
      arrow: true,
    },
  },
  {
    name: "side-status",
    label: "Side Badge Helper",
    description: "Right-anchored explanation for telemetry and status indicators",
    icon: "lucide:arrow-right-circle",
    values: {
      title: "Operational Tier 1",
      text: "Full sensor redundancy across all active monitoring loops.",
      side: "right",
      arrow: true,
    },
  },
];

const basicVue = `<tux-tooltip text="Last updated 8 minutes ago">
  <tux-button intent="ghost" icon="lucide:refresh-cw">Refresh</tux-button>
</tux-tooltip>`;

const titledVue = `<tux-tooltip
  title="Drift reconciler"
  text="Closes stale index entries every 30 minutes."
>
  <span class="info-anchor">i</span>
</tux-tooltip>`;

const kbdVue = `<tux-tooltip text="Open command palette" :kbds="['⌘', 'K']">
  <tux-button intent="ghost" icon="lucide:command">Palette</tux-button>
</tux-tooltip>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · help" title="TuxTooltip">
      Keyboard-accessible hover-help. Thin wrapper around
      <code>UTooltip</code> that adds a hairline rule under the
      title and tunes max-width to ~22ch for a comfortable 2–3 line
      body. Show / hide on hover or focus; reka-ui handles edge
      collision and keyboard accessibility.
      <br><br>
      <span class="text-sm text-text-muted">
        For richer floating panels (title + body + CTA + dismiss),
        use <code>TuxTeachingPopover</code> (onboarding) or
        <code>UPopover</code> directly. This is short hover-help only.
      </span>
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-tooltip"
        component-name="TuxTooltip"
        title="TuxTooltip Workbench"
        eyebrow="Interactive Component Playground"
        :controls="tooltipControls"
        :presets="tooltipPresets"
        :source="tuxTooltipSource"
        :code-template="(values) => {
          const titleAttr = values.title ? ` title=\x22${values.title}\x22` : '';
          const sideAttr = values.side !== 'top' ? ` side=\x22${values.side}\x22` : '';
          const arrowAttr = values.arrow === false ? ' :arrow=\x22false\x22' : '';
          return `<tux-tooltip text=\x22${values.text}\x22${titleAttr}${sideAttr}${arrowAttr}>\n  <tux-button intent=\x22secondary\x22 icon=\x22lucide:info\x22>Inspect Details</tux-button>\n</tux-tooltip>`;
        }"
      >
        <template #default="{ values }">
          <div class="flex flex-col items-center justify-center p-6 gap-2">
            <TuxTooltip
              :title="values.title || undefined"
              :text="values.text"
              :side="values.side"
              :arrow="values.arrow"
            >
              <TuxButton intent="secondary" icon="lucide:info">
                Hover or Focus Me
              </TuxButton>
            </TuxTooltip>
            <p class="text-xs text-text-muted">Hover or Tab-focus the button to inspect tooltip placement.</p>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Text only</h2>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxTooltipSource">
        <TuxTooltip text="Last updated 8 minutes ago">
          <TuxButton intent="ghost" icon="lucide:refresh-cw">Refresh</TuxButton>
        </TuxTooltip>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">title + body</p>
      <h2 class="heading--bold text-xl font-bold">Concept explainer</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use the <code>title</code> prop when the trigger doesn't name
        the concept by itself — e.g., an <code>(i)</code> icon next to
        a field. The hairline rule under the title is the editorial
        cue.
      </p>
      <TuxExample class="mt-4" :vue="titledVue" :source="tuxTooltipSource">
        <span class="info-row">
          Drift reconciler status
          <TuxTooltip
            title="Drift reconciler"
            text="Closes stale index entries every 30 minutes by comparing the live filesystem against the OpenSearch index."
          >
            <span class="info-anchor" tabindex="0">i</span>
          </TuxTooltip>
        </span>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">keyboard shortcut</p>
      <h2 class="heading--bold text-xl font-bold">Shortcut hint</h2>
      <TuxExample class="mt-4" :vue="kbdVue" :source="tuxTooltipSource">
        <TuxTooltip text="Open command palette" :kbds="['⌘', 'K']">
          <TuxButton intent="ghost" icon="lucide:command">Palette</TuxButton>
        </TuxTooltip>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.info-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}
.info-anchor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: var(--radius-full);
  background: var(--wash-brand-12);
  color: var(--brand-primary);
  font-family: var(--font-bold);
  font-size: 0.7rem;
  font-weight: 700;
  font-style: italic;
  cursor: help;
}
</style>
