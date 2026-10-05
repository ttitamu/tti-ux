<script setup lang="ts">
import { ref, computed } from "vue";
import { useTuxClipboard } from "~/composables/useTuxClipboard";

useHead({ title: "Documentation & SDK Reference · TUX" });

const { copiedKey, copy } = useTuxClipboard({ resetAfterMs: 2000 });

interface SdkTarget {
  id: string;
  name: string;
  platform: string;
  package: string;
  command: string;
  badge: string;
  icon: string;
  to?: string;
  docsUrl?: string;
  summary: string;
}

const sdkTargets: SdkTarget[] = [
  {
    id: "nuxt",
    name: "Nuxt 4 / Vue 3",
    platform: "Web & Enterprise Apps",
    package: "@tti/tti-ux",
    command: "npm install @tti/tti-ux",
    badge: "Canonical Layer",
    icon: "lucide:file-code",
    to: "/getting-started",
    summary: "Canonical design system layer with 183 auto-imported primitives, design tokens, and reactive application shell.",
  },
  {
    id: "react",
    name: "React 19 / TSX",
    platform: "React & Next.js Stacks",
    package: "@tti/tti-ux-react",
    command: "npm install @tti/tti-ux-react",
    badge: "TSX & Hooks",
    icon: "lucide:atom",
    to: "/install/react",
    summary: "Native React components, useTuxTheme() hooks, TypeScript interfaces, and token stylesheets.",
  },
  {
    id: "elements",
    name: "Web Components",
    platform: "Vanilla HTML & Any Host",
    package: "@tti/tti-ux-elements",
    command: '<script src="https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/packages/elements/dist/tux-elements.js"><\/script>',
    badge: "Custom Elements",
    icon: "lucide:code-xml",
    to: "/install#elements",
    summary: "Zero-dependency Custom Elements for legacy applications, Angular, Svelte, or plain HTML.",
  },
  {
    id: "dotnet",
    name: "C# / ASP.NET / Blazor",
    platform: ".NET 8/9 Enterprise",
    package: "Tti.Tux.AspNetCore / Blazor",
    command: "dotnet add package Tti.Tux.AspNetCore",
    badge: "NuGet Package",
    icon: "lucide:hash",
    to: "/install/dotnet",
    summary: "ASP.NET Core Tag Helpers, Blazor components, and C# design token constants.",
  },
  {
    id: "wordpress",
    name: "WordPress & Kadence",
    platform: "WordPress CMS & Intranets",
    package: "tti-ux-core / kadence-child-tti",
    command: "wp theme activate kadence-child-tti",
    badge: "Turnkey Theme & Plugin",
    icon: "lucide:file-type-2",
    to: "/install/wordpress",
    summary: "Kadence child theme, 0px button geometry, utility bar, Gutenberg block patterns, and shortcodes.",
  },
  {
    id: "powerbi",
    name: "Power BI & Fabric",
    platform: "Analytics & Business Intelligence",
    package: "kit/powerbi/",
    command: "git clone https://github.com/ttitamu/tti-ux.git kit/powerbi",
    badge: "PBIR & Themes",
    icon: "lucide:chart-column",
    to: "/install/power-bi",
    summary: "Standard report themes, PBIR visual fragments, page shell chrome, and DAX measures.",
  },
  {
    id: "python",
    name: "Python (Streamlit/Dash)",
    platform: "Data Science & Telemetry",
    package: "tti-ux-python",
    command: "pip install tti-ux-python",
    badge: "Python 3.10+",
    icon: "lucide:terminal",
    to: "/design/platform-awareness",
    summary: "Python dataclasses, Streamlit widgets, Dash components, and telemetry analysis utilities.",
  },
  {
    id: "mobile",
    name: "Mobile (Swift & Kotlin)",
    platform: "iOS & Android Applications",
    package: "TtiUxSwift / edu.tamu.tti.ux",
    command: "pod 'TtiUxSwift' / implementation 'edu.tamu.tti.ux:components:3.0.0'",
    badge: "SwiftUI & Compose",
    icon: "lucide:smartphone",
    to: "/design/platform-awareness",
    summary: "Native SwiftUI views and Jetpack Compose composables with shared design tokens.",
  },
];

interface GuideLink {
  title: string;
  category: string;
  to: string;
  icon: string;
  blurb: string;
}

const guides: GuideLink[] = [
  {
    title: "Getting Started Tour",
    category: "Quickstart",
    to: "/getting-started",
    icon: "lucide:compass",
    blurb: "Step-by-step developer onboarding, local preview workflow, and template composition.",
  },
  {
    title: "Multi-Target Install Hub",
    category: "Installation",
    to: "/install",
    icon: "lucide:package-plus",
    blurb: "Central installation matrix covering Nuxt, React, .NET, WordPress, Power BI, and CSS tokens.",
  },
  {
    title: "Design Tokens & Palettes",
    category: "Foundations",
    to: "/tokens",
    icon: "lucide:palette",
    blurb: "CSS custom properties, semantic status ladder, and interactive token sandbox.",
  },
  {
    title: "Component Lab Catalog",
    category: "Components",
    to: "/components",
    icon: "lucide:blocks",
    blurb: "183 enterprise primitives with interactive TuxPlayground workbenches and multi-framework code.",
  },
  {
    title: "Data & Telemetry Lab",
    category: "Visualizations",
    to: "/visualizations",
    icon: "lucide:chart-line",
    blurb: "Native SVG charts and Apache ECharts storytelling suite for transportation data.",
  },
  {
    title: "Publication & Reports Studio",
    category: "Reports",
    to: "/reports",
    icon: "lucide:file-text",
    blurb: "Editorial layouts, print sheets, and report frame chrome for research publications.",
  },
  {
    title: "Application Suites & Kits",
    category: "Workflows",
    to: "/kits",
    icon: "lucide:workflow",
    blurb: "10 institutional application templates with live viewport simulator and starter scaffolding.",
  },
  {
    title: "Component Health Matrix",
    category: "Quality",
    to: "/components/health",
    icon: "lucide:heart-pulse",
    blurb: "Readiness ledger tracking test coverage, multi-framework ports, and WCAG AAA compliance.",
  },
];

interface AdrItem {
  number: string;
  title: string;
  to: string;
  status: string;
}

const adrs: AdrItem[] = [
  { number: "0001", title: "Nuxt 4 + Nuxt UI as Foundation", to: "/docs/adr/0001-nuxt-4-and-nuxt-ui", status: "Accepted" },
  { number: "0002", title: "Tux* as Component Prefix", to: "/docs/adr/0002-tux-prefix-naming", status: "Accepted" },
  { number: "0004", title: "TUX Tokens Standalone Architecture", to: "/docs/adr/0004-tux-tokens-separate-from-nuxt-ui-theme", status: "Accepted" },
  { number: "0005", title: "Three-Theme Palette (tti / tti-dark / tti-hc)", to: "/docs/adr/0005-three-theme-palette", status: "Accepted" },
  { number: "0006", title: "Dedicated WCAG AAA High-Contrast Toggle", to: "/docs/adr/0006-separate-hc-from-casual-theme-toggle", status: "Accepted" },
  { number: "0007", title: "Container Queries over Media Queries", to: "/docs/adr/0007-container-queries-over-viewport-media-queries", status: "Accepted" },
  { number: "0009", title: "Single Source of Truth for Power BI Themes", to: "/docs/adr/0009-bi-design-system-source-of-truth", status: "Accepted" },
  { number: "0012", title: "Cross-Framework Distribution via Web Components", to: "/docs/adr/0012-cross-framework-distribution-via-web-components", status: "Accepted" },
  { number: "0013", title: "Operational Status Ramp (Nominal to Critical)", to: "/docs/adr/0013-operational-status-ramp", status: "Accepted" },
  { number: "0015", title: "TTI Communications Brand Alignment", to: "/docs/adr/0015-comm-brand-alignment-and-token-playground", status: "Accepted" },
  { number: "0016", title: "Legacy Modernization Bridge (tux-bridge.css)", to: "/docs/adr/0016-legacy-bridge-and-wcag-aaa", status: "Accepted" },
];

const searchQuery = ref("");

const filteredSdks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return sdkTargets;
  return sdkTargets.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.platform.toLowerCase().includes(q) ||
      s.package.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q),
  );
});

async function copyCommand(item: SdkTarget, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  await copy(item.command, item.id);
}
</script>

<template>
  <div class="space-y-10 pb-16">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Docs & SDKs' }]" />

    <!-- Hub Header -->
    <TuxSectionHeader
      :level="1"
      title="Docs & SDKs"
      secondary-title="Architecture & Reference"
      variant="two-tone-rule"
      kicker="INSTITUTIONAL DEVELOPER REFERENCE"
      subtitle="Comprehensive technical documentation, multi-platform SDK packages, architectural decision records, and integration guides for the Texas A&M Transportation Institute design system."
    />

    <!-- Quick Stats Metric Strip -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Platform Targets</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-brand-primary">11</span>
          <span class="text-xs text-text-secondary">active SDK stacks</span>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Architecture Records</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-text-primary">16</span>
          <span class="text-xs text-text-secondary">historical ADRs</span>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Accessibility Baseline</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-color-success">100%</span>
          <span class="text-xs text-text-secondary">WCAG 2.2 AAA (7:1)</span>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-surface-border bg-surface-raised flex flex-col justify-between">
        <span class="text-[11px] font-mono uppercase tracking-wider text-text-muted">Token Drift</span>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-brand-accent">0</span>
          <span class="text-xs text-text-secondary">single token truth</span>
        </div>
      </div>
    </div>

    <!-- Core Documentation & Guides Hub -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
          <UIcon name="lucide:book-open" class="w-4 h-4 text-brand-primary" />
          <span>System Guides &amp; Catalogs</span>
        </h2>
        <span class="text-xs text-text-muted font-mono">Core Documentation</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <NuxtLink
          v-for="guide in guides"
          :key="guide.to"
          :to="guide.to"
          class="p-4 rounded-xl border border-surface-border bg-surface-raised hover:border-brand-primary transition-all duration-150 flex flex-col justify-between group no-underline"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-muted">
                {{ guide.category }}
              </span>
              <UIcon :name="guide.icon" class="w-4 h-4 text-text-muted group-hover:text-brand-primary transition-colors" />
            </div>
            <h3 class="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              {{ guide.title }}
            </h3>
            <p class="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
              {{ guide.blurb }}
            </p>
          </div>
          <div class="mt-3 pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs text-brand-primary font-medium">
            <span>Explore guide</span>
            <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Platform SDK Distribution Reference -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
            <UIcon name="lucide:package" class="w-4 h-4 text-brand-primary" />
            <span>Multi-Platform SDK Reference</span>
          </h2>
          <p class="text-xs text-text-secondary mt-0.5">
            Production packages and starter templates synchronized across the TTI enterprise ecosystem.
          </p>
        </div>

        <!-- Quick filter -->
        <div class="relative w-full sm:w-64 shrink-0">
          <UIcon name="lucide:search" class="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Filter SDKs…"
            class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-sunken border border-surface-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="sdk in filteredSdks"
          :key="sdk.id"
          class="p-5 rounded-xl border border-surface-border bg-surface-raised flex flex-col justify-between space-y-3"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                  <UIcon :name="sdk.icon" class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-text-primary truncate">{{ sdk.name }}</h3>
                  <span class="text-[11px] text-text-muted font-mono block truncate">{{ sdk.platform }}</span>
                </div>
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-sunken border border-surface-border text-text-secondary shrink-0">
                {{ sdk.badge }}
              </span>
            </div>

            <p class="text-xs text-text-secondary leading-relaxed mt-2">{{ sdk.summary }}</p>
          </div>

          <!-- Command & Install Action -->
          <div class="pt-2 border-t border-surface-border/60 space-y-2">
            <div class="flex items-center justify-between gap-2 bg-surface-sunken p-2 rounded-lg border border-surface-border font-mono text-[11px]">
              <code class="text-text-primary truncate flex-1 min-w-0">{{ sdk.command }}</code>
              <button
                type="button"
                class="px-2 py-0.5 rounded bg-surface-raised hover:bg-surface-sunken border border-surface-border text-text-muted hover:text-brand-primary transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                :title="`Copy command for ${sdk.name}`"
                @click="(e) => copyCommand(sdk, e)"
              >
                <UIcon :name="copiedKey === sdk.id ? 'lucide:check' : 'lucide:copy'" class="w-3 h-3" />
                <span>{{ copiedKey === sdk.id ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>

            <div class="flex items-center justify-between text-xs pt-0.5">
              <span class="font-mono text-[11px] text-text-muted truncate">{{ sdk.package }}</span>
              <NuxtLink
                v-if="sdk.to"
                :to="sdk.to"
                class="text-brand-primary hover:underline font-medium inline-flex items-center gap-1 shrink-0"
              >
                <span>Documentation</span>
                <UIcon name="lucide:arrow-right" class="w-3 h-3" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Architectural Decision Records (ADRs) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
            <UIcon name="lucide:layers" class="w-4 h-4 text-brand-primary" />
            <span>Architectural Decision Records (ADRs)</span>
          </h2>
          <p class="text-xs text-text-secondary mt-0.5">
            Immutable technical decision records shaping TTI-UX naming, themes, accessibility, and platform bridges.
          </p>
        </div>
        <NuxtLink
          to="/docs/adr"
          class="text-xs text-brand-primary font-mono font-medium hover:underline inline-flex items-center gap-1"
        >
          <span>View All 16 ADRs</span>
          <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <div class="rounded-xl border border-surface-border bg-surface-card overflow-hidden">
        <div class="divide-y divide-surface-border text-xs">
          <NuxtLink
            v-for="adr in adrs"
            :key="adr.number"
            :to="adr.to"
            class="flex items-center justify-between p-3.5 hover:bg-surface-raised/60 transition-colors group no-underline text-text-primary"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="font-mono font-bold text-brand-primary text-[11px] px-1.5 py-0.5 rounded bg-brand-primary/10 shrink-0">
                ADR-{{ adr.number }}
              </span>
              <span class="font-medium group-hover:text-brand-primary transition-colors truncate">
                {{ adr.title }}
              </span>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-3">
              <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-color-success/10 text-color-success border border-color-success/30">
                {{ adr.status }}
              </span>
              <UIcon name="lucide:chevron-right" class="w-3.5 h-3.5 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
