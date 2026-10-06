<script setup lang="ts">
// /install — Central installation and distribution hub for TUX.
// Provides setup instructions for Nuxt 4, React, .NET, WordPress,
// standalone CSS tokens, and Power BI.

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
  badge?: string;
}

const targets: Target[] = [
  {
    label: "Nuxt 4 Layer",
    path: "@tti/tti-ux",
    consumer: "Nuxt 4 applications",
    blurb: "The complete system — 183 auto-imported components, design tokens, and the responsive application shell via extends: ['@tti/tti-ux'].",
    badge: "Recommended",
  },
  {
    label: "CSS Custom Properties",
    path: "kit/css/tux-tokens.css",
    consumer: "Any web application",
    blurb: "Zero build step required. Pre-compiled CSS custom properties covering Light, Dark, and High-Contrast themes.",
  },
  {
    label: "Operational Utility CSS",
    path: "kit/css/tux-ops.css",
    consumer: "Dashboards & telemetry",
    blurb: "Status chips, table row tints, gold heading keylines, and hairline chrome classes for rapid administrative styling.",
  },
  {
    label: "WCAG AAA Bridge",
    path: "kit/css/tux-bridge.css",
    consumer: "Legacy HTML & tables",
    blurb: "Drop-in stylesheet elevating raw HTML tables, form elements, and buttons to WCAG 2.2 Level AAA standards.",
  },
  {
    label: "React Ecosystem",
    path: "@tti/tti-ux-react",
    consumer: "React & TypeScript apps",
    blurb: "Native React 18/19 components, TypeScript interfaces, and token stylesheets for single-page applications.",
    to: "/install/react",
  },
  {
    label: "C# / ASP.NET / Blazor",
    path: "Tti.Tux.AspNetCore / Blazor",
    consumer: ".NET enterprise services",
    blurb: "ASP.NET Core Tag Helpers, Blazor component library, and MVC 5.3 Bootstrap compatibility bridge.",
    to: "/install/dotnet",
  },
  {
    label: "WordPress & Kadence",
    path: "tti-ux-core / tux-php",
    consumer: "WordPress sites",
    blurb: "Turnkey plugin with Kadence theme styling hooks, Gutenberg block patterns, and PHP view helpers.",
    to: "/install/wordpress",
  },
  {
    label: "Power BI & Fabric",
    path: "kit/powerbi/",
    consumer: "Business Intelligence",
    blurb: "Report themes, PBIR visual fragments, page shell chrome, and DAX measures for light/dark reporting.",
    to: "/install/power-bi",
  },
  {
    label: "Nuxt Studio Starter",
    path: "templates/tux-starter-content",
    consumer: "Microsites & publishing",
    blurb: "Browser-based visual authoring for researchers and communication teams with Git-backed deployment.",
    to: "/install/nuxt-studio",
  },
  {
    label: "Brand Environment",
    path: "kit/env/brand.env",
    consumer: "CI/CD & container scripts",
    blurb: "Brand color constants exported as POSIX shell variables for build pipelines and scripts.",
  },
];

const nuxtInstallCode = `npm install @tti/tti-ux`;
const nuxtConfigCode = `// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@tti/tti-ux"],
});`;

const cssInstallCode = `<!-- Add to <head> of any web page -->
<link rel="stylesheet" href="node_modules/@tti/tti-ux/kit/css/tux-tokens.css">
<link rel="stylesheet" href="node_modules/@tti/tti-ux/kit/css/tux-ops.css">`;
</script>

<template>
  <div class="space-y-10">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install' }]" />

    <TuxPageHeader eyebrow="distribution" title="Install & Setup">
      TUX distributes design tokens and components across multiple development stacks.
      Applications can extend the full Nuxt 4 layer or consume standalone stylesheets,
      React packages, .NET libraries, WordPress plugins, or Power BI themes.
    </TuxPageHeader>

    <!-- Quick Start: Primary Nuxt 4 Installation -->
    <section class="space-y-4">
      <TuxSectionHeader title="Nuxt 4 Installation (Recommended)" />
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <p class="text-sm font-semibold text-text-primary">1. Install package</p>
          <TuxCodeBlock :code="nuxtInstallCode" language="sh" filename="terminal" />
        </div>
        <div class="space-y-2">
          <p class="text-sm font-semibold text-text-primary">2. Extend layer in nuxt.config.ts</p>
          <TuxCodeBlock :code="nuxtConfigCode" language="ts" filename="nuxt.config.ts" />
        </div>
      </div>
      <p class="text-xs text-text-muted">
        Extending the layer automatically configures Tailwind v4 theme variables, KaTeX math styles,
        and auto-imports all 183 Tux* components for use in both Vue templates and Markdown content.
      </p>
    </section>

    <!-- Quick Start: Standalone CSS -->
    <section class="space-y-4">
      <TuxSectionHeader title="Standalone CSS (Non-Nuxt Apps)" />
      <div class="space-y-2">
        <p class="text-sm text-text-secondary">
          For static HTML, React, Angular, or legacy PHP stacks, link pre-compiled tokens directly.
          No compilation or Node.js runtime required:
        </p>
        <TuxCodeBlock :code="cssInstallCode" language="html" filename="index.html" />
      </div>
    </section>

    <!-- Available Distribution Targets -->
    <section class="space-y-4">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <TuxSectionHeader title="Available Targets" />
        <span class="text-xs text-text-muted">10 compiled framework targets</span>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <TuxCard
          v-for="t in targets"
          :key="t.path"
          :to="t.to"
          class="h-full"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="eyebrow">{{ t.consumer }}</p>
            <span
              v-if="t.badge"
              class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-brand-primary text-white"
            >
              {{ t.badge }}
            </span>
            <span
              v-else-if="t.to"
              class="inline-flex items-center gap-1 text-xs text-brand-primary font-medium"
            >
              <span>Setup Guide</span>
              <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>
          <h3 class="mt-1 text-base font-semibold text-text-primary">{{ t.label }}</h3>
          <p class="mt-1 text-xs font-mono text-text-muted">
            {{ t.path }}
          </p>
          <p class="mt-2 text-sm text-text-secondary">{{ t.blurb }}</p>
        </TuxCard>
      </div>
    </section>

    <!-- Technical Pipeline Documentation -->
    <section class="space-y-4">
      <TuxSectionHeader
        title="Distribution Architecture"
        subtitle="design/kit-pipeline.md"
      />
      <TuxProse>
        <MDCRenderer v-if="parsed" :body="parsed.body" :data="parsed.data" />
      </TuxProse>
    </section>
  </div>
</template>
