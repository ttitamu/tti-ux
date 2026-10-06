<script setup lang="ts">
useHead({ title: "Install React · TUX" });

const npmrcSnippet = `@tti:registry=https://code.tti.tamu.edu/api/packages/tti/npm/`;

const installCmd = `npm install @tti/tti-ux-react react react-dom`;

const usageSnippet = `import React from "react";
import {
  TuxButton,
  TuxBadge,
  TuxAlert,
  TuxCard,
  TuxBigStat,
  useTuxTheme
} from "@tti/tti-ux-react";
import "@tti/tti-ux-react/styles.css"; // Canonical tokens + WCAG AAA reset

export default function Dashboard() {
  const { theme, toggleTheme } = useTuxTheme();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Research Dashboard</h1>
        <TuxButton
          shape="sharp"
          intent="secondary"
          size="sm"
          onClick={toggleTheme}
        >
          Theme: {theme}
        </TuxButton>
      </div>

      <TuxAlert variant="info" title="System Status">
        All telemetry feeds are operating under WCAG 2.2 Level AAA compliance.
      </TuxAlert>

      <TuxCard padded>
        <div className="flex items-center justify-between">
          <TuxBigStat
            value="126"
            suffix="M"
            label="Annual research expenditure"
            tone="maroon"
          />
          <TuxBadge tier="restricted" variant="solid">Restricted</TuxBadge>
        </div>
      </TuxCard>
    </div>
  );
}`;

interface PortedCategory {
  category: string;
  components: {
    name: string;
    slug: string;
    blurb: string;
    keyProps: string;
  }[];
}

const componentCategories: PortedCategory[] = [
  {
    category: "Actions & Overlays",
    components: [
      { name: "TuxButton", slug: "button", blurb: "Sharp 0px geometry, 4 intents, 5 sizes, loading spinners", keyProps: "intent, shape, size, loading" },
      { name: "TuxDropdown", slug: "popover", blurb: "Accessible menu with keyboard navigation and active link markers", keyProps: "label, items, to, href" },
      { name: "TuxKbd", slug: "kbd", blurb: "Platform-aware keyboard shortcut visual hints", keyProps: "value, keys, size, separator" },
    ],
  },
  {
    category: "Feedback & Status",
    components: [
      { name: "TuxBadge", slug: "badge", blurb: "Institutional classification badges across 4 security tiers", keyProps: "tier, tone, variant, dot" },
      { name: "TuxAlert", slug: "alert", blurb: "7:1 contrast alert callouts with live ARIA announcements", keyProps: "variant, title, dismissible" },
      { name: "TuxStatus", slug: "status", blurb: "ADR-0013 operational system status (nominal to critical)", keyProps: "state, kind, acked, label" },
      { name: "TuxEmptyState", slug: "empty-state", blurb: "Zero-data feedback states with 5 turnkey presets", keyProps: "kind, icon, title, description" },
      { name: "TuxBetaRibbon", slug: "beta-ribbon", blurb: "Corner ribbon and banner non-production indicators", keyProps: "variant, kind, label, corner" },
    ],
  },
  {
    category: "Data & Telemetry",
    components: [
      { name: "TuxCard", slug: "card", blurb: "Elevation-aware container with subtle hover lift and focus rings", keyProps: "padded, to, href, target" },
      { name: "TuxBigStat", slug: "big-stat", blurb: "Hero KPI metric displays with trend badges and maroon tones", keyProps: "value, label, tone, suffix" },
      { name: "TuxStatComparison", slug: "stat-comparison", blurb: "Before/after KPI comparisons with automatic delta calculation", keyProps: "current, previous, deltaFormat" },
      { name: "TuxFactoid", slug: "factoid", blurb: "High-density multi-column statistical summary block", keyProps: "items, variant, columns" },
      { name: "TuxTableCaption", slug: "table-caption", blurb: "Academic figure and table captions with citation metadata", keyProps: "number, caption, source" },
    ],
  },
  {
    category: "Navigation & Content Structure",
    components: [
      { name: "TuxBreadcrumbs", slug: "breadcrumbs", blurb: "Hierarchical page navigation with maroon origin crumb", keyProps: "trail, homeIcon, chevron" },
      { name: "TuxTabs", slug: "tabs", blurb: "Accessible WAI-ARIA tabs with maroon underline indicators", keyProps: "items, value, onChange" },
      { name: "TuxAccordion", slug: "accordion", blurb: "Accessible disclosure groups with native details/summary", keyProps: "items, kind, single" },
      { name: "TuxLinkList", slug: "link-list", blurb: "Categorized resource links with external markers", keyProps: "groups, layout, columns" },
      { name: "TuxLinkSlab", slug: "link-slab", blurb: "Full-width section navigation bands with tone treatments", keyProps: "links, tone, ariaLabel" },
    ],
  },
  {
    category: "Layout & Editorial",
    components: [
      { name: "TuxSectionHeader", slug: "section-header", blurb: "Editorial headings with signature 2px Warm Gold underline keyline", keyProps: "level, title, subtitle, kicker" },
      { name: "TuxCallout", slug: "callout", blurb: "Editorial callout boxes with brand left-rule accents", keyProps: "kind, eyebrow, variant" },
      { name: "TuxAvatar", slug: "avatar", blurb: "Profile identity primitive with photo and initials fallback", keyProps: "name, initials, photoUrl, size" },
      { name: "TuxFormField", slug: "form-field", blurb: "Accessible form field orchestrating label, hint, and error", keyProps: "label, help, hint, error" },
      { name: "TuxDescriptionList", slug: "description-list", blurb: "Semantic key-value metadata list (<dl>)", keyProps: "items, layout, emphasis" },
      { name: "TuxSkeleton", slug: "skeleton", blurb: "Accessible loading placeholders with reduced-motion safety", keyProps: "kind, variant, animated" },
      { name: "TuxCodeBlock", slug: "code-block", blurb: "Syntax-highlighted code display with copy-to-clipboard", keyProps: "code, lang, filename" },
    ],
  },
];
</script>

<template>
  <div class="space-y-10 pb-16">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install', to: '/install' }, { label: 'React' }]" />

    <TuxPageHeader eyebrow="SDK · React" title="Using TUX in React">
      Consume canonical TUX components, TypeScript definitions, and design tokens natively in React 18/19 and Next.js applications.
      Published to the Forgejo npm registry as <code>@tti/tti-ux-react</code>.
      <template #actions>
        <div class="flex items-center gap-2 pt-1">
          <TuxBadge tone="success" variant="soft" class="font-mono text-xs">
            <UIcon name="lucide:check-circle-2" class="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
            26 Native TSX Primitives
          </TuxBadge>
          <TuxBadge tone="brand" variant="soft" class="font-mono text-xs">
            React 18 / 19
          </TuxBadge>
        </div>
      </template>
    </TuxPageHeader>

    <!-- 1. Installation -->
    <section class="space-y-4">
      <TuxSectionHeader title="1. Installation" />
      <p class="text-sm text-text-secondary">
        Configure your project <code>.npmrc</code> to resolve the <code>@tti</code> scope from the internal package registry:
      </p>
      <TuxCodeBlock :code="npmrcSnippet" language="ini" filename=".npmrc" />

      <p class="text-sm text-text-secondary mt-3">
        Install the package alongside React:
      </p>
      <TuxCodeBlock :code="installCmd" language="sh" filename="terminal" />
    </section>

    <!-- 2. Quick Start Example -->
    <section class="space-y-4">
      <TuxSectionHeader title="2. Quick Start Example" />
      <p class="text-sm text-text-secondary">
        Import primitives, design token styles, and the <code>useTuxTheme()</code> hook directly into your components:
      </p>
      <TuxCodeBlock :code="usageSnippet" language="tsx" filename="Dashboard.tsx" />
    </section>

    <!-- 3. Theme & Accessibility -->
    <section class="space-y-4">
      <TuxSectionHeader title="3. Theme Reactivity" />
      <div class="p-4 rounded-xl border border-surface-border bg-surface-raised space-y-2 text-sm text-text-secondary">
        <p>
          TUX React components automatically respond to the <code>data-theme</code> attribute on <code>&lt;html&gt;</code> (<code>tti</code>, <code>tti-dark</code>, <code>tti-hc</code>).
        </p>
        <p class="text-xs text-text-muted">
          The <code>useTuxTheme()</code> hook reads from and writes to <code>localStorage</code> with system-preference synchronization, ensuring persistent WCAG 2.2 Level AAA compliance across page reloads.
        </p>
      </div>
    </section>

    <!-- 4. Component Matrix -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <TuxSectionHeader title="4. Ported Component Matrix" subtitle="26 Native TSX Primitives with 100% Test Coverage" />
        <span class="text-xs text-text-muted font-mono">Click any component to open live playground</span>
      </div>

      <div class="space-y-6">
        <div
          v-for="cat in componentCategories"
          :key="cat.category"
          class="space-y-3"
        >
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
            {{ cat.category }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <NuxtLink
              v-for="comp in cat.components"
              :key="comp.name"
              :to="`/components/${comp.slug}`"
              class="p-3.5 rounded-xl border border-surface-border bg-surface-card hover:border-brand-primary hover:bg-surface-raised transition-all duration-150 flex flex-col justify-between group no-underline text-text-primary"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <span class="font-mono font-bold text-brand-primary text-xs group-hover:underline">
                    {{ comp.name }}
                  </span>
                  <UIcon name="lucide:arrow-up-right" class="w-3.5 h-3.5 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p class="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {{ comp.blurb }}
                </p>
              </div>

              <div class="mt-2.5 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span class="truncate max-w-[180px]">{{ comp.keyProps }}</span>
                <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">TSX</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
