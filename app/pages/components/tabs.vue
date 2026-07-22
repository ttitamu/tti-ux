<script setup lang="ts">
useHead({ title: "TuxTabs · TUX" });

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

const horizontalVue = `<tux-tabs v-model="active" :items="items" />`;
const verticalVue = `<tux-tabs
  v-model="active"
  :items="settingsItems"
  orientation="vertical"
/>`;
const boldVue = `<tux-tabs v-model="active" :items="items" intent="bold" />`;
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

    <section>
      <p class="eyebrow">flagship · horizontal</p>
      <h2 class="heading--bold text-xl font-bold">Section nav inside a report</h2>
      <TuxExample class="mt-4" :vue="horizontalVue">
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
      <TuxExample class="mt-4" :vue="verticalVue">
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
        Use <code>intent="bold"</code> when tabs sit next to other
        eyebrow-styled labels (research-report navigation, public
        landing pages). Reads as a section header, not a control.
      </p>
      <TuxExample class="mt-4" :vue="boldVue">
        <TuxTabs v-model="boldActive" :items="boldItems" intent="bold">
          <p class="text-sm text-text-secondary">
            Tab: <strong>{{ boldActive }}</strong>.
          </p>
        </TuxTabs>
      </TuxExample>
    </section>
  </div>
</template>
