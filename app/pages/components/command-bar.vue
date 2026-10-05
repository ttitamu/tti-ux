<script setup lang="ts">
import tuxCommandBarSource from "~/components/TuxCommandBar.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxCommandBar · TUX" });

const demoSelected = ref(0);
const demoView = ref("table");
const demoQuery = ref("");

const commandBarControls: TuxPropControl[] = [
  {
    prop: "selectedCount",
    label: "Selected Records Count",
    type: "select",
    options: [0, 1, 4, 12],
    defaultValue: 0,
  },
  {
    prop: "density",
    label: "Bar Density",
    type: "select",
    options: ["compact", "comfortable"],
    defaultValue: "compact",
  },
  {
    prop: "bordered",
    label: "Show Border Frame",
    type: "boolean",
    defaultValue: true,
  },
];

const commandBarPresets: TuxPlaygroundPreset[] = [
  {
    name: "default-ribbon",
    label: "Standard Action Ribbon",
    description: "Compact toolbar with search filter and quick export triggers",
    icon: "lucide:sliders-horizontal",
    values: {
      selectedCount: 0,
      density: "compact",
      bordered: true,
    },
  },
  {
    name: "selection-batch",
    label: "Bulk Selection Active",
    description: "Switches to batch selection state with counter and action triggers",
    icon: "lucide:check-square",
    values: {
      selectedCount: 4,
      density: "compact",
      bordered: true,
    },
  },
  {
    name: "comfortable-clean",
    label: "Comfortable Unbordered",
    description: "Roomy action bar suited for top-level view controls and primary page headers",
    icon: "lucide:maximize-2",
    values: {
      selectedCount: 0,
      density: "comfortable",
      bordered: false,
    },
  },
];

const defaultVue = `<TuxCommandBar>
  <template #actions>
    <TuxButton intent="primary" size="sm" icon="lucide:plus">New Corridor</TuxButton>
    <TuxButton intent="ghost" size="sm" icon="lucide:upload">Import Data</TuxButton>
    <TuxButton intent="ghost" size="sm" icon="lucide:download">Export</TuxButton>
  </template>
  <template #filter>
    <div class="relative">
      <UIcon name="lucide:search" class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
      <input type="search" placeholder="Filter corridors..." class="pl-8 pr-2.5 py-1 text-xs rounded bg-surface-raised border border-surface-border" />
    </div>
  </template>
</TuxCommandBar>`;

const selectionVue = `<TuxCommandBar
  :selected-count="selectedItems.length"
  @clear-selection="selectedItems = []"
>
  <template #selection-actions>
    <TuxButton intent="secondary" size="sm" icon="lucide:file-output">Export Selected</TuxButton>
    <TuxButton intent="danger" size="sm" icon="lucide:trash-2">Batch Archive</TuxButton>
  </template>
</TuxCommandBar>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxCommandBar">
      Standard horizontal action ribbon inspired by Microsoft Fluent 2 Command Bar and IBM Carbon
      Data Table Toolbar. Connects view switchers, instant search filters, primary/secondary action
      buttons, and bulk selection controls.
    </TuxPageHeader>

    <!-- Interactive Component Playground with Presets & Deep-Linking -->
    <section>
      <TuxPlayground
        tag="tux-command-bar"
        component-name="TuxCommandBar"
        title="TuxCommandBar Workbench"
        eyebrow="Interactive Component Playground"
        :controls="commandBarControls"
        :presets="commandBarPresets"
        :source="tuxCommandBarSource"
      >
        <template #default="{ values }">
          <div class="p-6 bg-surface-raised rounded-xl border border-surface-border w-full">
            <TuxCommandBar
              :selected-count="Number(values.selectedCount)"
              :density="values.density"
              :bordered="values.bordered"
              @clear-selection="values.selectedCount = 0"
            >
              <template #actions>
                <TuxButton intent="primary" size="sm" icon="lucide:plus">New Corridor</TuxButton>
                <TuxButton intent="ghost" size="sm" icon="lucide:upload">Import</TuxButton>
                <TuxButton intent="ghost" size="sm" icon="lucide:download">Export</TuxButton>
              </template>

              <template #views>
                <div class="flex items-center gap-0.5 bg-surface-raised p-0.5 rounded border border-surface-border text-xs">
                  <span class="px-2 py-0.5 rounded bg-brand-primary text-text-on-brand font-bold text-xs">Table</span>
                </div>
              </template>

              <template #filter>
                <div class="relative flex items-center">
                  <UIcon name="lucide:search" class="w-3.5 h-3.5 absolute left-2.5 text-text-muted pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Filter corridors..."
                    class="pl-8 pr-2.5 py-1 text-xs rounded bg-surface-raised border border-surface-border text-text-primary focus:outline-none focus:border-brand-primary"
                    aria-label="Filter corridors in playground"
                  />
                </div>
              </template>

              <template #selection-actions>
                <TuxButton intent="secondary" size="sm" icon="lucide:file-output">Export Selected</TuxButton>
                <TuxButton intent="destructive" size="sm" icon="lucide:trash-2">Batch Archive</TuxButton>
              </template>
            </TuxCommandBar>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">default state</p>
      <h2 class="heading--bold text-xl font-bold">Standard Action Ribbon</h2>
      <p class="text-sm text-text-secondary mb-3">
        Houses primary actions, search filters, and view-mode segments.
      </p>
      <TuxExample :vue="defaultVue" :source="tuxCommandBarSource">
        <TuxCommandBar>
          <template #actions>
            <TuxButton intent="primary" size="sm" icon="lucide:plus">New Corridor</TuxButton>
            <TuxButton intent="ghost" size="sm" icon="lucide:upload">Import</TuxButton>
            <TuxButton intent="ghost" size="sm" icon="lucide:download">Export</TuxButton>
          </template>

          <template #views>
            <div class="flex items-center gap-0.5 bg-surface-raised p-0.5 rounded border border-surface-border text-xs">
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors"
                :class="demoView === 'table' ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
                @click="demoView = 'table'"
              >
                Table
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors"
                :class="demoView === 'grid' ? 'bg-brand-primary text-text-on-brand font-bold' : 'text-text-muted hover:text-text-primary'"
                @click="demoView = 'grid'"
              >
                Cards
              </button>
            </div>
          </template>

          <template #filter>
            <div class="relative flex items-center">
              <UIcon name="lucide:search" class="w-3.5 h-3.5 absolute left-2.5 text-text-muted pointer-events-none" />
              <input
                v-model="demoQuery"
                type="search"
                placeholder="Filter corridors..."
                class="pl-8 pr-2.5 py-1 text-xs rounded bg-surface-raised border border-surface-border text-text-primary focus:outline-none focus:border-brand-primary"
                aria-label="Filter corridors demonstration"
              />
            </div>
          </template>
        </TuxCommandBar>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bulk operations</p>
      <h2 class="heading--bold text-xl font-bold">Selection Mode</h2>
      <p class="text-sm text-text-secondary mb-3">
        When rows or cards are selected (<code>selectedCount > 0</code>), the command bar dynamically transforms into a batch action panel.
      </p>
      <TuxExample :vue="selectionVue" :source="tuxCommandBarSource">
        <div class="space-y-3">
          <div class="flex items-center gap-3 text-xs">
            <span class="text-text-muted font-mono">Simulate selection count:</span>
            <button
              v-for="c in [0, 3, 12]"
              :key="c"
              type="button"
              class="px-2.5 py-1 rounded border text-xs font-mono"
              :class="demoSelected === c ? 'bg-brand-primary text-text-on-brand border-brand-primary font-bold' : 'bg-surface-sunken border-surface-border text-text-primary'"
              @click="demoSelected = c"
            >
              {{ c }} items
            </button>
          </div>

          <TuxCommandBar
            :selected-count="demoSelected"
            @clear-selection="demoSelected = 0"
          >
            <template #actions>
              <TuxButton intent="primary" size="sm" icon="lucide:plus">New Item</TuxButton>
            </template>
            <template #selection-actions>
              <TuxButton intent="secondary" size="sm" icon="lucide:file-output">Export Selected</TuxButton>
              <TuxButton intent="destructive" size="sm" icon="lucide:trash-2">Batch Archive</TuxButton>
            </template>
          </TuxCommandBar>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
