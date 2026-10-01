<script setup lang="ts">
// /install — the one page for the whole kit/ tier.
//
// kit/ ships generated framework targets plus hand-maintained recipe
// CSS (tux-bootstrap, tux-ops) that a consumer installs into their own
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
    label: "Ops CSS",
    path: "kit/css/tux-ops.css",
    consumer: "monitoring overlays",
    blurb: "Status chips, row tints, gold heading keyline, hairline chrome. Drop in after tux-tokens.css. The CSS tab on TuxStatus. Host selectors stay in the consuming repo.",
  },
  {
    label: "SCSS partial",
    path: "kit/scss/_tux-bootstrap.scss",
    consumer: "Bootstrap builds",
    blurb: "Bootstrap variable overrides for builds that compile SCSS rather than loading the prebuilt CSS.",
  },
  {
    label: "React ecosystem",
    path: "@tti/tti-ux-react",
    consumer: "React / TS apps",
    blurb: "Native React components and hooks, token stylesheet, and CEM-driven wrappers. Full guide available.",
    to: "/install/react",
  },
  {
    label: "C# / .NET / ASP.NET",
    path: "Tti.Tux.AspNetCore / Blazor",
    consumer: ".NET — Razor, Blazor, MVC",
    blurb: "ASP.NET Core Tag Helpers, Blazor component library, and MVC 5.3 Bootstrap bridge.",
    to: "/install/dotnet",
  },
  {
    label: "WordPress & PHP",
    path: "tti-ux-core / tux-php",
    consumer: "WordPress & PHP sites",
    blurb: "Turnkey plugin with Kadence theme hooks, Gutenberg blocks & block patterns, and PHP view helper.",
    to: "/install/wordpress",
  },
  {
    label: "Nuxt Studio",
    path: "templates/tux-starter-content",
    consumer: "Content & Microsites",
    blurb: "Visual, browser-based authoring for researchers and marcom teams with Git-backed static deployment.",
    to: "/install/nuxt-studio",
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
    blurb: "Report themes, PBIR fragments, an accessible page shell, and DAX modules supporting in-report theme toggling.",
    to: "/install/power-bi",
  },
];
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install' }]" />

    <TuxPageHeader eyebrow="kit" title="Install">
      TUX distributes tokens and assets across multiple application platforms —
      Nuxt applications, React web apps, .NET services, WordPress sites, and Power BI dashboards.
      All artifacts compile from <code>design/tokens.json</code> to ensure unified styling.
    </TuxPageHeader>

    <TuxAlert variant="info" title="Deterministic Token Generation">
      <template #description>
        Target files are generated deterministically from <code>design/tokens.json</code>.
        Automated tests verify that compiled artifacts match source tokens on every build.
      </template>
    </TuxAlert>

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
