<script setup lang="ts">
// /install/power-bi — platform-level setup for the Power BI target.
//
// The seam: how to style ONE chart lives on that chart's page (a Power
// BI tab in TuxExample, beside Vue and HTML); how to set up a REPORT
// lives here. Theme registration, schema pinning, the page shell, and
// the semantic-model module are all irreducibly platform-level — no
// per-component tab can hold them.
//
// Body is kit/powerbi/README.md verbatim, so the site and the npm
// package are single-source. Editing the README updates this page.

useHead({ title: "Power BI setup · TUX" });

const readme = import.meta.glob("../../../kit/powerbi/README.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const source = Object.values(readme)[0] ?? "";

const { data: parsed } = await useAsyncData("install-powerbi", () =>
  parseMarkdown(source),
);
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs
      :trail="[
        { label: 'Home', to: '/' },
        { label: 'Install', to: '/install' },
        { label: 'Power BI' },
      ]"
    />

    <TuxPageHeader eyebrow="kit · power bi" title="Power BI setup">
      Report themes, PBIR fragments, a drop-in page shell, and the DAX
      module behind the in-report light/dark toggle. For styling an
      individual chart, see the <strong>Power BI</strong> tab on that
      chart's page under
      <NuxtLink to="/visualizations">Visualizations</NuxtLink>.
    </TuxPageHeader>

    <TuxCallout kind="warning" title="Not yet verified in Power BI Desktop">
      Every emitted file validates against Microsoft's live PBIR and theme
      schemas, but structural validity doesn't imply a correct render —
      Power BI ignores a wrong literal type silently rather than
      rejecting it. A Desktop smoke test on Windows is still outstanding.
    </TuxCallout>

    <TuxProse>
      <MDCRenderer v-if="parsed" :body="parsed.body" :data="parsed.data" />
    </TuxProse>
  </div>
</template>
