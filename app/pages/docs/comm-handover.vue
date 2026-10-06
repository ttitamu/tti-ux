<script setup lang="ts">
import { ref } from "vue";
import { useTuxClipboard } from "~/composables/useTuxClipboard";

useHead({ title: "Communications Handover Runbook · TUX" });

const { copiedKey, copy } = useTuxClipboard({ resetAfterMs: 2000 });

const bridgeSnippet = `@import url('https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-tokens.css');
@import url('https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@v3.0.0/kit/css/tux-bridge.css');`;

const cloneMicrositeSnippet = `git clone https://github.com/ttitamu/tux-starter-content.git my-microsite
cd my-microsite
npm install
npm run dev`;

const qualityGateSnippet = `node scripts/test-all-suites.mjs`;

const shortcodes = [
  { tag: '[tux_portal_header agency="Texas A&M Transportation Institute" search="true"]', label: "Tier 1 Utility Bar", desc: "Top maroon navigation with institutional agency link, Jobs, Pressroom, Directory, Contact" },
  { tag: '[tux_stat value="650" suffix="+" label="Active Connected Testbeds" tone="maroon"]', label: "BigStat Metric", desc: "Oversized metric with tabular numerals and official maroon/gold accents" },
  { tag: '[tux_heading title="Connected Corridors Research" level="2"]', label: "Signature Heading", desc: "Maroon H2 header with 2px Warm Gold underline keyline" },
  { tag: '[tux_alert variant="warning" title="Operations Advisory"]Corridor test in progress.[/tux_alert]', label: "WCAG AAA Alert", desc: "Accessible advisory banner with 7:1 contrast ratio" },
  { tag: '[tux_card to="/safety" padded="true"]Card content here[/tux_card]', label: "Container Card", desc: "Interactive card with rectangular geometry and subtle hover elevation" },
  { tag: '[tux_staleness stale="true" date="2026-09-01" owner="Mobility Division"]', label: "Freshness Notice", desc: "Telemetry data freshness metadata notice" },
];

async function handleCopy(text: string, id: string) {
  await copy(text, id);
}
</script>

<template>
  <div class="space-y-10 pb-16">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Docs', to: '/docs' }, { label: 'Comm Handover' }]" />

    <TuxPageHeader
      eyebrow="GOVERNANCE & HANDOVER"
      title="Communications Team Handover Runbook"
    >
      The complete operational manual for the Texas A&amp;M Transportation Institute Communications &amp; Marketing team.
      TUX 3.0 is turnkey and self-governing: consume brand assets, maintain WordPress sites, author microsites, and run automated verification without software engineering overhead.
      <template #actions>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <TuxBadge tone="brand" variant="soft" class="font-mono text-xs">
            Turnkey Ownership
          </TuxBadge>
          <TuxBadge tone="success" variant="soft" class="font-mono text-xs">
            <UIcon name="lucide:shield-check" class="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
            100% WCAG 2.2 AAA
          </TuxBadge>
          <TuxBadge tone="neutral" variant="outline" class="font-mono text-xs">
            Zero Engineering Hand-Holding
          </TuxBadge>
        </div>
      </template>
    </TuxPageHeader>

    <!-- Key Principles Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl border border-surface-border bg-surface-raised space-y-1">
        <span class="text-xs font-mono font-bold text-brand-primary">1. Single Source of Truth</span>
        <p class="text-xs text-text-secondary">All colors, fonts, and geometry live in <code>tokens.json</code> and compile across 11 targets automatically.</p>
      </div>
      <div class="p-4 rounded-xl border border-surface-border bg-surface-raised space-y-1">
        <span class="text-xs font-mono font-bold text-brand-primary">2. WordPress &amp; Kadence Parity</span>
        <p class="text-xs text-text-secondary">Turnkey child theme and core plugin matching <code>tti.tamu.edu</code> and <code>my.tti.tamu.edu</code>.</p>
      </div>
      <div class="p-4 rounded-xl border border-surface-border bg-surface-raised space-y-1">
        <span class="text-xs font-mono font-bold text-brand-primary">3. No-Code Microsites</span>
        <p class="text-xs text-text-secondary">Nuxt Studio visual in-browser editor lets authors write papers and lab portals without code.</p>
      </div>
      <div class="p-4 rounded-xl border border-surface-border bg-surface-raised space-y-1">
        <span class="text-xs font-mono font-bold text-color-success">4. Automated Quality Gate</span>
        <p class="text-xs text-text-secondary">One command (<code>node scripts/test-all-suites.mjs</code>) verifies all 5 quality tiers and 0 violations.</p>
      </div>
    </div>

    <!-- Section 1: The 3 Ways Comm Consumes TUX -->
    <section class="space-y-6">
      <TuxSectionHeader title="1. How Communications Consumes TUX" subtitle="Three primary production publishing workflows" />

      <!-- Workflow A: WordPress -->
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">A</div>
            <div>
              <h3 class="text-sm font-bold text-text-primary">WordPress &amp; Kadence Sites</h3>
              <p class="text-xs text-text-muted">For tti.tamu.edu, my.tti.tamu.edu, research centers, and division blogs</p>
            </div>
          </div>
          <NuxtLink to="/install/wordpress" class="text-xs text-brand-primary hover:underline font-medium inline-flex items-center gap-1">
            <span>Open WordPress Guide</span>
            <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div class="p-3.5 rounded-lg bg-surface-sunken border border-surface-border space-y-2">
            <h4 class="font-bold text-text-primary">Turnkey Child Theme (kadence-child-tti)</h4>
            <p class="text-text-secondary">Pre-wires Aggie Maroon (<code>#500000</code>) and Warm Gold (<code>#CFA935</code>) palette, 0px button geometry, and top utility bar directly into Kadence.</p>
            <p class="text-text-muted font-mono">Location: packages/wordpress/kadence-child-tti</p>
          </div>
          <div class="p-3.5 rounded-lg bg-surface-sunken border border-surface-border space-y-2">
            <h4 class="font-bold text-text-primary">TTI-UX Core Plugin (v3.0)</h4>
            <p class="text-text-secondary">Enqueues typography, CSS tokens, and web components runtime across Gutenberg, Classic Editor, and Elementor.</p>
            <p class="text-text-muted font-mono">Location: packages/wordpress/tti-ux-core</p>
          </div>
        </div>

        <!-- Shortcodes cheat sheet -->
        <div class="space-y-2 pt-2">
          <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Turnkey Shortcodes Cheat Sheet</h4>
          <div class="divide-y divide-surface-border border border-surface-border rounded-lg bg-surface-raised overflow-hidden text-xs">
            <div v-for="(sc, idx) in shortcodes" :key="idx" class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="min-w-0">
                <span class="font-bold text-text-primary block">{{ sc.label }}</span>
                <span class="text-text-muted text-[11px] block">{{ sc.desc }}</span>
                <code class="text-[11px] font-mono text-brand-primary block truncate mt-1 bg-surface-sunken px-1.5 py-0.5 rounded">{{ sc.tag }}</code>
              </div>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-mono font-medium rounded bg-surface-sunken border border-surface-border text-text-primary hover:bg-surface-card transition-colors shrink-0 self-start sm:self-center"
                @click="handleCopy(sc.tag, `sc-${idx}`)"
              >
                {{ copiedKey === `sc-${idx}` ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 60 second CSS bridge -->
        <div class="p-4 rounded-lg bg-surface-sunken border border-surface-border space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs text-text-primary">Instant 60-Second WCAG AAA Retrofit</h4>
            <button
              type="button"
              class="px-2 py-0.5 text-xs font-mono rounded bg-surface-raised border border-surface-border text-text-primary"
              @click="handleCopy(bridgeSnippet, 'bridge')"
            >
              {{ copiedKey === 'bridge' ? 'Copied' : 'Copy CSS' }}
            </button>
          </div>
          <p class="text-xs text-text-muted">Paste into <strong>Appearance &rarr; Customize &rarr; Additional CSS</strong> to instantly upgrade raw tables, buttons, and forms on older sites without touching PHP templates.</p>
          <TuxCodeBlock :code="bridgeSnippet" language="css" filename="Additional CSS" />
        </div>
      </div>

      <!-- Workflow B: Nuxt Studio Microsites -->
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">B</div>
            <div>
              <h3 class="text-sm font-bold text-text-primary">Research Microsites &amp; Visual Authoring</h3>
              <p class="text-xs text-text-muted">Launch standalone lab sites and project reports without code</p>
            </div>
          </div>
          <NuxtLink to="/install/nuxt-studio" class="text-xs text-brand-primary hover:underline font-medium inline-flex items-center gap-1">
            <span>Open Studio Guide</span>
            <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div class="space-y-2 text-xs">
          <p class="text-text-secondary leading-relaxed">
            The <code>templates/tux-starter-content</code> repository is pre-configured with Nuxt Studio.
            Writers log into the browser UI to edit markdown pages visually, drop in <code>::tux-big-stat</code> or <code>::tux-card</code> components via the slash inserter, and save directly to Git with automated static deployment.
          </p>
          <TuxCodeBlock :code="cloneMicrositeSnippet" language="sh" filename="terminal" />
        </div>
      </div>

      <!-- Workflow C: Editorial Articles -->
      <div class="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">C</div>
            <div>
              <h3 class="text-sm font-bold text-text-primary">Flagship Digital Articles &amp; Reports</h3>
              <p class="text-xs text-text-muted">High-impact publications with reading ergonomics</p>
            </div>
          </div>
          <NuxtLink to="/news/next-gen-computing-cluster-expands-transportation-ai" class="text-xs text-brand-primary hover:underline font-medium inline-flex items-center gap-1">
            <span>View Live Article</span>
            <UIcon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
        <p class="text-xs text-text-secondary leading-relaxed">
          The <code>&lt;TuxEditorialArticle&gt;</code> component supports 5 interchangeable hero layouts (<code>ai-modern</code>, <code>boxed</code>, <code>full-bleed</code>, <code>split</code>, <code>inset-banner</code>), a sticky Table of Contents rail, real-time scroll progress indicators, and one-click BibTeX/APA citation export.
        </p>
      </div>
    </section>

    <!-- Section 2: Quality & Maintenance Runbook -->
    <section class="space-y-4">
      <TuxSectionHeader title="2. Maintenance &amp; Quality Runbook" subtitle="How to verify and keep the repository healthy" />

      <div class="p-5 rounded-xl border border-surface-border bg-surface-raised space-y-4">
        <div>
          <h3 class="text-sm font-bold text-text-primary">The Single Verification Gate</h3>
          <p class="text-xs text-text-secondary mt-1">
            Before publishing changes or after updating brand tokens, run the unified quality runner. If all 5 tiers pass, your build is guaranteed to be 100% compliant:
          </p>
        </div>

        <div class="flex items-center justify-between gap-2">
          <TuxCodeBlock :code="qualityGateSnippet" language="sh" filename="terminal" class="flex-1" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs pt-1">
          <div class="p-2.5 rounded bg-surface-card border border-surface-border">
            <span class="font-bold text-text-primary block">Tier 1: Tokens</span>
            <span class="text-text-muted text-[11px]">0 undefined tokens, OKLab status ladder</span>
          </div>
          <div class="p-2.5 rounded bg-surface-card border border-surface-border">
            <span class="font-bold text-text-primary block">Tier 2: Math AAA</span>
            <span class="text-text-muted text-[11px]">&ge;7:1 text, &ge;44px touch targets</span>
          </div>
          <div class="p-2.5 rounded bg-surface-card border border-surface-border">
            <span class="font-bold text-text-primary block">Tier 3: Vitest</span>
            <span class="text-text-muted text-[11px]">764 mounted component tests</span>
          </div>
          <div class="p-2.5 rounded bg-surface-card border border-surface-border">
            <span class="font-bold text-text-primary block">Tier 4: Axe-Core</span>
            <span class="text-text-muted text-[11px]">253 prerendered pages (0 violations)</span>
          </div>
          <div class="p-2.5 rounded bg-surface-card border border-surface-border">
            <span class="font-bold text-text-primary block">Tier 5: Health</span>
            <span class="text-text-muted text-[11px]">Sync official AAA ledger</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Brand Governance & Assets -->
    <section class="space-y-4">
      <TuxSectionHeader title="3. Brand Governance &amp; Official Assets" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2">
          <h3 class="font-bold text-text-primary">Official Vector Logos</h3>
          <p class="text-text-secondary">Official TTI primary marks, maroon badges, and reversed white wordmarks in SVG format.</p>
          <NuxtLink to="/resources/logos" class="text-brand-primary hover:underline font-medium inline-block pt-1">
            Download Logo Assets &rarr;
          </NuxtLink>
        </div>

        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2">
          <h3 class="font-bold text-text-primary">5-Band Division Spectrum</h3>
          <p class="text-text-secondary">Official division colors: Mobility (Maroon), Infrastructure (Blue), Safety (Teal), Planning (Green), Operations (Gold).</p>
          <NuxtLink to="/tokens" class="text-brand-primary hover:underline font-medium inline-block pt-1">
            Inspect Spectrum Tokens &rarr;
          </NuxtLink>
        </div>

        <div class="p-4 rounded-xl border border-surface-border bg-surface-card space-y-2">
          <h3 class="font-bold text-text-primary">183-Component Catalog</h3>
          <p class="text-text-secondary">Explore interactive playgrounds, live props knobs, and accessibility notes for every primitive.</p>
          <NuxtLink to="/components" class="text-brand-primary hover:underline font-medium inline-block pt-1">
            Browse Component Lab &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
