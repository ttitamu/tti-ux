<script setup lang="ts">
import tuxBreadcrumbsSource from "~/components/TuxBreadcrumbs.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxBreadcrumbs · TUX" });

const breadcrumbsControls: TuxPropControl[] = [
  {
    prop: "trailDepth",
    label: "Breadcrumb Depth",
    type: "select",
    options: ["article", "research", "home-only"],
    defaultValue: "article",
  },
  {
    prop: "delimiter",
    label: "Delimiter Glyph",
    type: "select",
    options: ["pipe", "chevron", "slash"],
    defaultValue: "pipe",
  },
  {
    prop: "homeIcon",
    label: "Show Root Home Icon",
    type: "boolean",
    defaultValue: true,
  },
];

const breadcrumbsPresets: TuxPlaygroundPreset[] = [
  {
    name: "article",
    label: "Deep Article Trail",
    description: "4-level deep research article trail with terminal page label",
    icon: "lucide:route",
    values: {
      trailDepth: "article",
      delimiter: "pipe",
      homeIcon: true,
    },
  },
  {
    name: "research",
    label: "Section Level 2",
    description: "2-level shallow trail for high-level division index pages",
    icon: "lucide:folder",
    values: {
      trailDepth: "research",
      delimiter: "pipe",
      homeIcon: true,
    },
  },
  {
    name: "chevron-delimit",
    label: "Chevron Delimited",
    description: "Mobile and narrow layout chevron delimiter style",
    icon: "lucide:chevron-right",
    values: {
      trailDepth: "article",
      delimiter: "chevron",
      homeIcon: true,
    },
  },
];

const exampleVue = `<TuxBreadcrumbs :trail="[
  { label: 'Home',                       to: '/' },
  { label: 'Research',                   to: '/research' },
  { label: 'Transportation safety',      to: '/research/safety' },
  { label: 'Connected Vehicle Pilot' },
]" />`;

const depthsVue = `<TuxBreadcrumbs :trail="trailL2" />
<TuxBreadcrumbs :trail="trailL3" />
<TuxBreadcrumbs :trail="trailArticle" />`;

const trailHome = [{ label: "Home" }];

const trailL2 = [
  { label: "Home", to: "/" },
  { label: "Research" },
];

const trailL3 = [
  { label: "Home", to: "/" },
  { label: "Research", to: "/research" },
  { label: "Transportation safety" },
];

const trailArticle = [
  { label: "Home", to: "/" },
  { label: "Research", to: "/research" },
  { label: "Transportation safety", to: "/research/safety" },
  { label: "Connected Vehicle Pilot" },
];

function resolveTrail(depth: string) {
  if (depth === "home-only") return trailHome;
  if (depth === "research") return trailL2;
  return trailArticle;
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxBreadcrumbs">
      Page-depth navigation. Sits <strong>above the page header</strong> on
      every non-landing page. Home crumb always present (icon + label, navy
      underlined). Intermediate crumbs are italic navy links. The final
      crumb is plain text — not a link to itself. Pipe separators at
      ≥35rem viewports, chevron below.
    </TuxPageHeader>

    <!-- Interactive Component Playground with Presets & Deep-Linking -->
    <section>
      <TuxPlayground
        tag="tux-breadcrumbs"
        component-name="TuxBreadcrumbs"
        title="TuxBreadcrumbs Workbench"
        eyebrow="Interactive Component Playground"
        :controls="breadcrumbsControls"
        :presets="breadcrumbsPresets"
        :source="tuxBreadcrumbsSource"
      >
        <template #default="{ values }">
          <div class="p-6 bg-surface-raised rounded-xl border border-surface-border w-full">
            <TuxBreadcrumbs
              :trail="resolveTrail(values.trailDepth)"
              :delimiter="values.delimiter"
              :home-icon="values.homeIcon"
              aria-label="Playground breadcrumb preview"
            />
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">L3 article trail</h2>
      <TuxExample class="mt-4" :vue="exampleVue" :source="tuxBreadcrumbsSource">
        <TuxBreadcrumbs :trail="trailArticle" aria-label="Breadcrumb — canonical" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">depths</p>
      <h2 class="heading--bold text-xl font-bold">L2 / L3 / Article</h2>
      <p class="text-sm text-text-secondary mb-3">
        Same component handles every depth. Final crumb is always
        non-link, plain-text, current page.
      </p>
      <TuxExample class="mt-4" :vue="depthsVue" :source="tuxBreadcrumbsSource">
        <div class="space-y-5">
          <TuxBreadcrumbs :trail="trailL2" aria-label="Breadcrumb — L2 depth" />
          <TuxBreadcrumbs :trail="trailL3" aria-label="Breadcrumb — L3 depth" />
          <TuxBreadcrumbs :trail="trailArticle" aria-label="Breadcrumb — article depth" />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
