<script setup lang="ts">
useHead({ title: "Install React · TUX" });

const installCmd = "npm install @tti/tti-ux-react react react-dom";
const usageSnippet = `import React from "react";
import {
  TuxButton,
  TuxBadge,
  TuxAlert,
  TuxCard,
  TuxBigStat,
  useTuxTheme
} from "@tti/tti-ux-react";
import "@tti/tti-ux-react/styles.css"; // Load canonical tokens once at root

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

const portedComponents = [
  {
    name: "TuxButton",
    description: "Standard action button with Kadence sharp profile support, 4 intents, 5 sizes, loading spinner, and icon slots.",
    props: "intent, shape, size, loading, disabled, to, href, icon, trailingIcon",
  },
  {
    name: "TuxBadge",
    description: "Institutional classification badge supporting 4 security tiers, status tones, tag/count kinds, and 5 visual variants.",
    props: "tier, status, tone, kind, variant, dot, uppercase",
  },
  {
    name: "TuxAlert",
    description: "8 semantic alert banners with high-contrast left-bar accents, live ARIA announcements, and dismiss actions.",
    props: "variant, title, dismissible, onClose",
  },
  {
    name: "TuxCard",
    description: "Static and interactive card containers with hover lift, focus rings, padding control, and corner arrow affordances.",
    props: "padded, to, href, target",
  },
  {
    name: "TuxBigStat",
    description: "Hero KPI metric displays with trend badges, prefixes, suffixes, subtext, and TTI Maroon branding.",
    props: "value, label, tone, prefix, suffix, trend, trendLabel, subtext",
  },
  {
    name: "TuxAccordion",
    description: "Accessible disclosure groups with native details/summary, FAQ and publication kinds, and single-mode toggle.",
    props: "items, kind, single, className",
  },
  {
    name: "TuxAvatar",
    description: "Identity mark primitive with photo support, initials fallback generation, and status dot indicators.",
    props: "name, initials, photoUrl, size, dot, decorative, alt",
  },
  {
    name: "TuxDropdown",
    description: "Single-column dropdown navigation menu with keyboard navigation, escape handling, and active link indicators.",
    props: "label, items, to, href, className",
  },
  {
    name: "TuxTabs",
    description: "Accessible tabs with role='tablist', maroon underline indicators, bold typography variant, and slim sizing.",
    props: "items, value, defaultValue, onChange, orientation, size, variant",
  },
  {
    name: "TuxSkeleton",
    description: "Placeholder shapes for loading states with card/list/table presets, shimmer animation, and reduced-motion safety.",
    props: "kind, variant, width, height, radius, count, animated, label",
  },
  {
    name: "TuxKbd",
    description: "Token-styled keyboard key hints with OS detection (Mac/Win/Linux), key combinations, and separator support.",
    props: "value, keys, size, separator, className, children",
  },
  {
    name: "TuxTableCaption",
    description: "Auto-numbered academic captions for HTML or framework tables with above/below placement and source citations.",
    props: "label, number, caption, source, placement, className",
  },
  {
    name: "TuxStatComparison",
    description: "Before/after KPI stat block with computed delta values, percentage shifts, trend arrows, and polarity inversion.",
    props: "eyebrow, current, previous, suffix, label, layout, decimals, polarity, deltaFormat",
  },
  {
    name: "TuxCodeBlock",
    description: "Standalone code display container with Shiki HTML support, copy-to-clipboard, blob download, and optional line numbers.",
    props: "code, lang, filename, lineNumbers, noCopy, noDownload, downloadName, highlightedHtml",
  },
  {
    name: "TuxCallout",
    description: "Pulled-aside editorial accent with brand left rule signatures (default, bold 3-bar, elegant hash) and note semantics.",
    props: "kind, eyebrow, variant, children",
  },
  {
    name: "TuxFormField",
    description: "Form input wrapper orchestrating label, help popover trigger, hint copy, input slot/render-prop, and error alert.",
    props: "label, help, hint, error, required, inputId, layout, children",
  },
  {
    name: "TuxDescriptionList",
    description: "Semantic definition list (<dl>) with inline grid or stacked layout, and editorial or data typography emphasis.",
    props: "items, layout, emphasis, title",
  },
  {
    name: "TuxLinkList",
    description: "Categorized resource list with column or stacked layouts, featured left-bar emphasis, and external link indicators.",
    props: "groups, layout, columns, className",
  },
  {
    name: "TuxLinkSlab",
    description: "Full-width section navigation link band with plain, neutral, and maroon tone treatments, hover arrow translation, and icon slots.",
    props: "links, tone, ariaLabel, className",
  },
  {
    name: "TuxFactoid",
    description: "Institutional 'by the numbers' oversized statistic block with 3/4/5-column density tiers, Open Sans/bold/elegant numeral variants, and dek.",
    props: "items, variant, columns, eyebrow, title, dek, className",
  },
  {
    name: "TuxBetaRibbon",
    description: "Non-production deployment indicator with diagonal corner ribbon, top-of-page stripe, and inline status pill variants.",
    props: "variant, kind, label, corner, message, children, className",
  },
  {
    name: "TuxBreadcrumbs",
    description: "Page-depth navigation trail with Maroon home crumb, italic intermediate links, responsive pipe/chevron separators, and landmark accessibility.",
    props: "trail, homeIcon, chevron, ariaLabel",
  },
  {
    name: "TuxSectionHeader",
    description: "TTI editorial section heading with bold Maroon typography, signature 3px Warm Gold underline rule, and optional kicker eyebrow.",
    props: "level, title, subtitle, kicker, variant, children",
  },
  {
    name: "TuxEmptyState",
    description: "No-data feedback container with 5 named presets (no-data, no-results, not-found, no-permissions, first-run), circular icon badge, and CTA slot.",
    props: "kind, icon, title, description, noCard, compact, children",
  },
  {
    name: "TuxStatus",
    description: "Operational system health indicator (ADR-0013/0014) supporting 6 operational states, chip/text/dot display modes, and acknowledged problem sinking.",
    props: "state, kind, acked, label",
  },
];
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install', to: '/install' }, { label: 'React' }]" />

    <TuxPageHeader eyebrow="Target · React" title="Using TUX in React">
      Consume TUX components and tokens natively in React applications outside the Nuxt layer.
      Published to the Forgejo npm registry as <code>@tti/tti-ux-react</code>.
    </TuxPageHeader>

    <section class="space-y-3">
      <TuxSectionHeader title="1. Installation" />
      <p class="text-sm text-text-secondary">
        Configure your <code>.npmrc</code> with <code>@tti:registry=https://code.tti.tamu.edu/api/packages/tti/npm/</code>, then install:
      </p>
      <TuxCodeBlock :code="installCmd" language="sh" filename="terminal" />
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="2. Quick Start Example" />
      <p class="text-sm text-text-secondary">
        Import the components, token stylesheet, and theme hooks directly into your application:
      </p>
      <TuxCodeBlock :code="usageSnippet" language="tsx" filename="Dashboard.tsx" />
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="3. Theme Reactivity" />
      <p class="text-sm text-text-secondary leading-relaxed">
        TUX React components respond to the <code>data-theme</code> attribute on <code>&lt;html&gt;</code> (<code>tti</code>, <code>tti-dark</code>, <code>tti-hc</code>). Use the <code>useTuxTheme()</code> hook to read and toggle themes with persistent memory.
      </p>
    </section>

    <section class="space-y-4">
      <TuxSectionHeader :title="`4. Available React Components (${portedComponents.length} Primitives)`" />
      <p class="text-sm text-text-secondary">
        The following {{ portedComponents.length }} canonical components have been fully ported with native React TSX implementations, full prop parity, and dedicated unit test suites:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="comp in portedComponents"
          :key="comp.name"
          class="p-4 rounded-xl border border-surface-border bg-surface-raised/40 space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono font-bold text-brand-primary text-sm">{{ comp.name }}</span>
            <TuxBadge tone="success" variant="soft" class="text-[10px]">
              <UIcon name="lucide:check" class="w-3 h-3 inline mr-0.5 text-emerald-500" />
              Native TSX
            </TuxBadge>
          </div>
          <p class="text-xs text-text-secondary">{{ comp.description }}</p>
          <div class="pt-1">
            <span class="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-1">Props</span>
            <code class="text-[11px] font-mono text-text-secondary bg-surface-sunken px-1.5 py-0.5 rounded border border-surface-border block truncate">
              {{ comp.props }}
            </code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
