<script setup lang="ts">
import tuxTabsSource from "~/components/TuxTabs.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxTabs · TUX" });

const playgroundActive = ref<string | number>("overview");
const horizontalActive = ref<string | number>("overview");
const verticalActive = ref<string | number>("appearance");
const boldActive = ref<string | number>("results");

const horizontalItems = [
  { value: "overview", label: "Overview" },
  { value: "methods",  label: "Methods" },
  { value: "results",  label: "Results", badge: "4" },
  { value: "appendix", label: "Appendix" },
];

const verticalItems = [
  { value: "appearance",   label: "Appearance",   icon: "lucide:palette" },
  { value: "notifications", label: "Notifications", icon: "lucide:bell" },
  { value: "data",         label: "Data controls", icon: "lucide:database" },
  { value: "security",     label: "Security",     icon: "lucide:lock" },
];

const boldItems = [
  { value: "results",       label: "Results" },
  { value: "discussion",    label: "Discussion" },
  { value: "limitations",   label: "Limitations" },
];

const tabsControls: TuxPropControl[] = [
  {
    prop: "orientation",
    label: "Tab Orientation",
    type: "select",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
    description: "Horizontal report section flow or vertical settings panel",
  },
  {
    prop: "variant",
    label: "Typography Variant",
    type: "select",
    options: ["default", "bold"],
    defaultValue: "default",
    description: "Sentence-case medium or uppercase tracked bold eyebrow rhythm",
  },
  {
    prop: "size",
    label: "Surface Size",
    type: "select",
    options: ["md", "slim"],
    defaultValue: "md",
    description: "Standard editorial height (md) or compact density (slim)",
  },
];

const tabsPresets: TuxPlaygroundPreset[] = [
  {
    name: "report-horizontal",
    label: "Report Navigation (Horizontal)",
    description: "Flagship horizontal tab bar with 2px maroon indicator rule",
    icon: "lucide:layout-list",
    values: {
      orientation: "horizontal",
      variant: "default",
      size: "md",
    },
  },
  {
    name: "settings-vertical",
    label: "Settings Navigation (Vertical)",
    description: "Dense vertical settings navigation with right-aligned active rule",
    icon: "lucide:sliders",
    values: {
      orientation: "vertical",
      variant: "default",
      size: "slim",
    },
  },
  {
    name: "caps-bold",
    label: "Uppercase Tracked (Bold)",
    description: "Header-level tabs matching institutional eyebrow rhythm",
    icon: "lucide:type",
    values: {
      orientation: "horizontal",
      variant: "bold",
      size: "md",
    },
  },
];

const horizontalVue = `<tux-tabs v-model="active" :items="items" />`;
const verticalVue = `<tux-tabs
  v-model="active"
  :items="settingsItems"
  orientation="vertical"
/>`;
const boldVue = `<tux-tabs v-model="active" :items="items" variant="bold" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · navigation" title="TuxTabs">
      Editorial-flavored tabs. Thin wrapper around <code>UTabs</code>
      that swaps the default accent for a 2px maroon underline + adds
      a <code>bold</code> intent (uppercase tracked) for navigational
      contexts where tabs should read in the same rhythm as eyebrows.
      Vertical orientation covers the roadmap's separate
      <code>TuxTabsVertical</code> entry — same component, different
      prop.
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-tabs"
        component-name="TuxTabs"
        title="TuxTabs Workbench"
        eyebrow="Interactive Component Playground"
        :controls="tabsControls"
        :presets="tabsPresets"
        :source="tuxTabsSource"
        :code-template="(values) => {
          const orientAttr = values.orientation !== 'horizontal' ? ` orientation=\x22${values.orientation}\x22` : '';
          const variantAttr = values.variant !== 'default' ? ` variant=\x22${values.variant}\x22` : '';
          const sizeAttr = values.size !== 'md' ? ` size=\x22${values.size}\x22` : '';
          const itemsVar = values.orientation === 'vertical' ? 'settingsItems' : 'reportItems';
          return `<tux-tabs v-model=\x22activeTab\x22 :items=\x22${itemsVar}\x22${orientAttr}${variantAttr}${sizeAttr} />`;
        }"
      >
        <template #default="{ values }">
          <div class="w-full max-w-xl">
            <TuxTabs
              v-model="playgroundActive"
              :items="values.orientation === 'vertical' ? verticalItems : horizontalItems"
              :orientation="values.orientation"
              :variant="values.variant"
              :size="values.size"
            >
              <div class="mt-4 p-4 rounded-md border border-surface-border bg-surface-sunken/50 text-sm text-text-secondary">
                Viewing tab panel: <strong class="text-text-primary">{{ playgroundActive }}</strong>
              </div>
            </TuxTabs>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">flagship · horizontal</p>
      <h2 class="heading--bold text-xl font-bold">Section nav inside a report</h2>
      <TuxExample class="mt-4" :vue="horizontalVue" :source="tuxTabsSource">
        <TuxTabs v-model="horizontalActive" :items="horizontalItems">
          <p class="text-sm text-text-secondary">
            Active tab: <strong>{{ horizontalActive }}</strong>. Content
            slot would render the matching section here.
          </p>
        </TuxTabs>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">vertical · settings panel</p>
      <h2 class="heading--bold text-xl font-bold">Settings-style vertical tabs</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        For settings panels with 4–6 sections. The maroon active rule
        moves to the right edge of the tab list.
      </p>
      <TuxExample class="mt-4" :vue="verticalVue" :source="tuxTabsSource">
        <TuxTabs
          v-model="verticalActive"
          :items="verticalItems"
          orientation="vertical"
        >
          <p class="text-sm text-text-secondary">
            Settings section: <strong>{{ verticalActive }}</strong>.
          </p>
        </TuxTabs>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bold intent · eyebrow rhythm</p>
      <h2 class="heading--bold text-xl font-bold">Uppercase tracked tabs</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use <code>variant="bold"</code> when tabs sit next to other
        eyebrow-styled labels (research-report navigation, public
        landing pages). Reads as a section header, not a control.
      </p>
      <TuxExample class="mt-4" :vue="boldVue" :source="tuxTabsSource">
        <TuxTabs v-model="boldActive" :items="boldItems" variant="bold">
          <p class="text-sm text-text-secondary">
            Tab: <strong>{{ boldActive }}</strong>.
          </p>
        </TuxTabs>
      </TuxExample>
    </section>
  </div>
</template>
