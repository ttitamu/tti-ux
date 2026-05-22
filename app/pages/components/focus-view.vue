<script setup lang="ts">
useHead({ title: "TuxFocusView · TUX" });

const openBasic = ref(false);
const openChart = ref(false);

const basicVue = `<UButton @click="open = true">Open focus view</UButton>
<tux-focus-view v-model:open="open" title="Document inspector" eyebrow="Focus mode">
  <p>Full-viewport surface with backdrop blur, back button + title +
    actions chrome, content slot fills the surface.</p>
</tux-focus-view>`;

const chartVue = `<tux-focus-view
  v-model:open="open"
  title="Monthly ingest rate"
  eyebrow="Exhibit 11.04"
>
  <template #actions>
    <UButton variant="ghost" icon="lucide:download" />
    <UButton variant="ghost" icon="lucide:share" />
  </template>
  <TuxChartLine :labels="months" :series="singleSeries" />
</tux-focus-view>`;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const singleSeries = [
  { key: "ingest", label: "Files ingested (M)", data: [12.4, 14.8, 18.2, 22.1, 24.7, 28.3, 30.1, 33.4, 35.8, 38.9, 41.2, 44.0] },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · platform-aware chrome" title="TuxFocusView">
      Full-viewport overlay for inspecting one piece of content without
      sidebar / navigation distraction. Lighter-weight than
      <code>TuxModal</code> — content-led, not dialog-led. Back / close
      affordance + title strip + actions, content fills the surface.
      Esc + backdrop click dismiss; focus is trapped; reduced-motion
      respected.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Open the focus view</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Click below to open a full-viewport overlay. Press Esc or click
        the backdrop / close button to dismiss.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <UButton @click="openBasic = true">Open focus view</UButton>
        <TuxFocusView v-model:open="openBasic" title="Document inspector" eyebrow="Focus mode">
          <p>
            Full-viewport surface with backdrop blur, back button + title +
            actions chrome, content slot fills the surface. Press Esc or
            click the backdrop to dismiss.
          </p>
          <p class="mt-4">
            Use case for Landscape: "open this chart in focus mode" — pin a
            chart full-screen for inspection, dismiss returns to the
            dashboard.
          </p>
        </TuxFocusView>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">composition · chart in focus</p>
      <h2 class="heading--bold text-xl font-bold">Chart pinned full-viewport</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Composition pattern: a chart on the dashboard with a
        "expand to focus" button that opens the same chart in
        <code>TuxFocusView</code> with download / share actions in the
        top-bar.
      </p>
      <TuxExample class="mt-4" :vue="chartVue">
        <UButton icon="lucide:expand" @click="openChart = true">Open chart in focus mode</UButton>
        <TuxFocusView v-model:open="openChart" title="Monthly ingest rate" eyebrow="Exhibit 11.04">
          <template #actions>
            <UButton variant="ghost" icon="lucide:download" />
            <UButton variant="ghost" icon="lucide:share-2" />
          </template>
          <TuxChartLine :labels="months" :series="singleSeries" />
        </TuxFocusView>
      </TuxExample>
    </section>
  </div>
</template>
