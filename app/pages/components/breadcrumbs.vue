<script setup lang="ts">
useHead({ title: "TuxBreadcrumbs · tti-ux" });

const exampleVue = `<TuxBreadcrumbs :trail="[
  { label: 'Home',                       to: '/' },
  { label: 'Research',                   to: '/research' },
  { label: 'Transportation safety',      to: '/research/safety' },
  { label: 'Connected Vehicle Pilot' },
]" />`;

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

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">L3 article trail</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxBreadcrumbs :trail="trailArticle" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">depths</p>
      <h2 class="heading--bold text-xl font-bold">L2 / L3 / Article</h2>
      <p class="text-sm text-text-secondary mb-3">
        Same component handles every depth. Final crumb is always
        non-link, plain-text, current page.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-5">
          <TuxBreadcrumbs :trail="trailL2" />
          <TuxBreadcrumbs :trail="trailL3" />
          <TuxBreadcrumbs :trail="trailArticle" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">no home icon</p>
      <h2 class="heading--bold text-xl font-bold">Without the home glyph</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:home-icon="false"</code> when the first crumb shouldn't
        be the home root — for example, an embedded sub-app where the
        breadcrumb starts mid-tree.
      </p>
      <TuxExample class="mt-4">
        <TuxBreadcrumbs :home-icon="false" :trail="trailArticle" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">chevron mode</p>
      <h2 class="heading--bold text-xl font-bold">Chevron at all sizes</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>chevron</code> to use <code>›</code> separators at every
        viewport. Useful in tight chrome where the pipe rule looks heavy.
      </p>
      <TuxExample class="mt-4">
        <TuxBreadcrumbs chevron :trail="trailArticle" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>trail</code> — array of <code>{ label, to?, href? }</code>. Required. Last item is the current page (no link).</li>
        <li><code>homeIcon</code> — show the home icon on the first crumb. Defaults to <code>true</code>.</li>
        <li><code>chevron</code> — use <code>›</code> separators at every viewport. Defaults to <code>false</code> (pipe rule, collapsing to chevron under 35rem).</li>
      </ul>
    </section>
  </div>
</template>
