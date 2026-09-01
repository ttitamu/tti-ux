<script setup lang="ts">
// /install — the one page for the whole kit/ tier.
//
// kit/ ships nine generated framework targets that a consumer installs
// into their own stack, and until now none of them had a page. This is
// deliberately ONE page with a target list rather than a nav group: the
// owner rejected "Kit targets" / "Platforms" / "Integrations" as sidebar
// sections, and a directory listing wearing an intent label is the same
// thing. Targets that grow their own setup story (Power BI has one) get
// a child page; the rest are a row here.
//
// Doctrine body comes from design/kit-pipeline.md, rendered the same way
// design/[doc].vue does it — raw import + parseMarkdown at SSR so fenced
// code ships pre-highlighted.

useHead({ title: "Install · TUX" });

const doctrine = import.meta.glob("../../../design/kit-pipeline.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const source = Object.values(doctrine)[0] ?? "";

const { data: parsed } = await useAsyncData("install-doctrine", () =>
  parseMarkdown(source),
);

interface Target {
  label: string;
  path: string;
  consumer: string;
  blurb: string;
  to?: string;
}

/** Tier-1 emitted targets. Every one is generated from design/tokens.json
 *  and byte-locked by tests/tux-kit-targets.test.ts. */
const targets: Target[] = [
  {
    label: "Nuxt layer",
    path: "@tti/tti-ux",
    consumer: "Nuxt 4 apps",
    blurb: "The full system — components, tokens, and the app shell. `extends: ['@tti/tti-ux']` in nuxt.config.ts. Everything else on this page exists for consumers who can't run the Nuxt layer.",
  },
  {
    label: "CSS custom properties",
    path: "kit/css/tux-tokens.css",
    consumer: "any web page",
    blurb: "Every token as a CSS custom property, per theme. Zero build step — link it and the variables are live. Pairs with tux-bootstrap.css to re-skin a Bootstrap 4 app with no markup changes.",
  },
  {
    label: "SCSS partial",
    path: "kit/scss/_tux-bootstrap.scss",
    consumer: "Bootstrap builds",
    blurb: "Bootstrap variable overrides for builds that compile SCSS rather than loading the prebuilt CSS.",
  },
  {
    label: "React tokens",
    path: "kit/react/tux-tokens.ts",
    consumer: "React / TS apps",
    blurb: "Per-theme resolved token maps plus a tuxVar() helper. Component ports ship separately as @tti/tti-ux-react.",
  },
  {
    label: "C# tokens",
    path: "kit/csharp/TuxTokens.cs",
    consumer: ".NET — WPF, MAUI, Blazor",
    blurb: "Per-theme static classes of resolved literals plus an All dictionary for dynamic lookup. For report generators and desktop surfaces with no CSS layer.",
  },
  {
    label: "WordPress theme.json",
    path: "kit/wp/theme.json",
    consumer: "block themes",
    blurb: "Palette, font families, spacing and radius as block-theme settings — for marcom sites.",
  },
  {
    label: "Brand env",
    path: "kit/env/brand.env",
    consumer: "CI, scripts, containers",
    blurb: "The brand constants as shell variables, for anything that needs a hex without parsing JSON.",
  },
  {
    label: "Power BI",
    path: "kit/powerbi/",
    consumer: "Power BI · Fabric",
    blurb: "Report themes, PBIR fragments, a drop-in page shell, and the DAX module behind the in-report light/dark toggle. The largest target by some distance — 51 files — and the only one with its own setup page.",
    to: "/install/power-bi",
  },
];
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install' }]" />

    <TuxPageHeader eyebrow="kit" title="Install">
      TUX ships to consumers that can't run the Nuxt layer — .NET report
      generators, plain React apps, WordPress marcom sites, Power BI.
      Everything below is generated from
      <code>design/tokens.json</code> and committed, so the same token
      edit reaches every target in one build.
    </TuxPageHeader>

    <TuxCallout kind="info" title="Same input, same bytes">
      These are deterministic emitters, not ports. A lock test fails CI if
      a committed artifact drifts from its generator, so no model ever
      transcribes a hex value into one of these files.
    </TuxCallout>

    <section class="space-y-3">
      <TuxSectionHeader title="Targets" />
      <div class="grid gap-3 sm:grid-cols-2">
        <TuxCard
          v-for="t in targets"
          :key="t.path"
          :to="t.to"
          class="h-full"
        >
          <p class="eyebrow">{{ t.consumer }}</p>
          <h3 class="mt-1 text-base font-semibold">{{ t.label }}</h3>
          <p class="mt-1 text-sm text-[var(--text-muted)]">
            <code>{{ t.path }}</code>
          </p>
          <p class="mt-2 text-sm">{{ t.blurb }}</p>
        </TuxCard>
      </div>
    </section>

    <section class="space-y-3">
      <TuxSectionHeader
        title="How the pipeline works"
        subtitle="design/kit-pipeline.md"
      />
      <TuxProse>
        <MDCRenderer v-if="parsed" :body="parsed.body" :data="parsed.data" />
      </TuxProse>
    </section>
  </div>
</template>
