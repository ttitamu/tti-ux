<script setup lang="ts">
/**
 * TTI Code (Forgejo) Developer Portal Showcase.
 *
 * Demonstrates:
 *   - Developer-facing git collaboration tool branded in authentic TTI Comm language
 *   - Sharp rectangular buttons, Warm Gold keylines, and Aggie Maroon tabs
 *   - 5-Band Division Spectrum badging (Connected & Automated Vehicles · #005480)
 *   - Repository file explorer, commit metadata bar, and README presentation
 *   - 100% WCAG 2.2 Level AAA compliance
 */

definePageMeta({
  layout: false,
});

useHead({
  title: "TTI Code · trans-analytics-engine · Forgejo Showcase · TUX",
});

const codeNav = [
  { label: "Explore Repositories", to: "/examples/forgejo-code" },
  { label: "Pull Requests", to: "#prs" },
  { label: "Issues", to: "#issues" },
  {
    label: "Divisions & Orgs",
    children: [
      { label: "Connected & Automated Vehicles", to: "#cav", description: "V2X, roadside unit telemetry, autonomous shuttle models" },
      { label: "Infrastructure & Materials", to: "#infra", description: "Pavement mechanics, sensor embed firmware, finite element models" },
      { label: "Safety & Human Factors", to: "#safety", description: "Eye-tracking analysis, driving simulator scenarios, crash stats" },
      { label: "AI & Advanced Analytics", to: "#ai", description: "Corridor foundation models, edge inferencing, computer vision" },
    ],
  },
  { label: "CI/CD Runners", to: "#runners" },
  { label: "Help & Docs", to: "#docs" },
];

const activeTab = ref("code");

const repoTabs = [
  { id: "code", label: "Code", icon: "lucide:code-2", count: null },
  { id: "issues", label: "Issues", icon: "lucide:circle-dot", count: 14 },
  { id: "prs", label: "Pull Requests", icon: "lucide:git-pull-request", count: 3 },
  { id: "actions", label: "CI/CD", icon: "lucide:play-circle", count: null },
  { id: "releases", label: "Releases", icon: "lucide:tag", count: 8 },
  { id: "settings", label: "Settings", icon: "lucide:settings", count: null },
];

const fileList = [
  { name: "packages/core", type: "dir", message: "refactor: optimize corridor telemetry streaming loop", time: "2 hours ago" },
  { name: "packages/v2x-ingest", type: "dir", message: "feat: add SAE J2735 BSM packet decoder", time: "yesterday" },
  { name: "packages/edge-agent", type: "dir", message: "chore: upgrade rust toolchain to 1.82", time: "3 days ago" },
  { name: "tests", type: "dir", message: "test: add synthetic detector flow scenario suites", time: "4 days ago" },
  { name: ".gitignore", type: "file", message: "chore: ignore target and cache outputs", time: "2 weeks ago" },
  { name: "Cargo.toml", type: "file", message: "build: bump workspace version to 3.4.0", time: "2 hours ago" },
  { name: "LICENSE", type: "file", message: "docs: add TTI academic & research license", time: "3 months ago" },
  { name: "README.md", type: "file", message: "docs: update corridor analytics installation guide", time: "5 hours ago" },
];

const cloneUrl = ref("https://code.tti.tamu.edu/tti/trans-analytics-engine.git");
const copied = ref(false);

async function copyCloneUrl() {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(cloneUrl.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface-eggshell text-text-primary font-sans flex flex-col">
    <!-- Institutional Header (Comm Mode) -->
    <TuxPortalHeader
      mode="comm"
      portal-title="TTI Code"
      portal-badge="Forgejo"
      portal-badge-variant="maroon"
      :nav-items="codeNav"
      :show-spectrum="true"
    />

    <!-- Main Repository Container -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Repository Breadcrumb & Actions Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <!-- Repo Lockup with Spectrum Division Indicator -->
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <NuxtLink to="/examples/forgejo-code" class="text-sm font-bold text-brand-primary hover:underline">
              tti
            </NuxtLink>
            <span class="text-text-muted">/</span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              trans-analytics-engine
            </h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-surface-raised border border-surface-border text-text-secondary">
              Public
            </span>
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-spectrum-blue/10 text-spectrum-blue border border-spectrum-blue/30">
              <span class="w-1.5 h-1.5 rounded-full bg-spectrum-blue" />
              <span>Connected &amp; Automated Vehicles</span>
            </span>
          </div>
          <p class="text-xs text-text-muted font-sans">
            High-throughput corridor telemetry, detector aggregation, and V2X edge streaming engine for Texas smart corridors.
          </p>
        </div>

        <!-- Repo Header Action Buttons (Sharp Geometry) -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-primary bg-surface-raised border border-surface-border hover:bg-surface-sunken hover:border-brand-primary transition-all rounded-none cursor-pointer shadow-xs"
            aria-label="Star this repository (42 stars)"
          >
            <UIcon name="lucide:star" class="w-3.5 h-3.5 text-brand-accent" />
            <span>Star</span>
            <span class="px-1.5 py-0.2 font-mono text-[10px] bg-surface-sunken rounded-none border-l border-surface-border">42</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-primary bg-surface-raised border border-surface-border hover:bg-surface-sunken hover:border-brand-primary transition-all rounded-none cursor-pointer shadow-xs"
            aria-label="Fork this repository (8 forks)"
          >
            <UIcon name="lucide:git-fork" class="w-3.5 h-3.5 text-text-muted" />
            <span>Fork</span>
            <span class="px-1.5 py-0.2 font-mono text-[10px] bg-surface-sunken rounded-none border-l border-surface-border">8</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-primary bg-surface-raised border border-surface-border hover:bg-surface-sunken hover:border-brand-primary transition-all rounded-none cursor-pointer shadow-xs"
            aria-label="Watch repository updates"
          >
            <UIcon name="lucide:eye" class="w-3.5 h-3.5 text-text-muted" />
            <span>Watch</span>
          </button>
        </div>
      </div>

      <!-- Forgejo Navigation Tabs (Sharp Maroon Underline Style) -->
      <nav class="flex items-center gap-1 border-b border-surface-border overflow-x-auto" aria-label="Repository navigation">
        <button
          v-for="tab in repoTabs"
          :key="tab.id"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px rounded-none cursor-pointer"
          :class="[
            activeTab === tab.id
              ? 'border-brand-accent text-brand-primary bg-surface-raised'
              : 'border-transparent text-text-muted hover:text-text-primary hover:border-surface-border'
          ]"
          @click="activeTab = tab.id"
        >
          <UIcon :name="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count !== null"
            class="px-1.5 py-0.2 text-[10px] font-mono rounded-full"
            :class="activeTab === tab.id ? 'bg-brand-primary text-text-inverse' : 'bg-surface-sunken text-text-muted'"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>

      <!-- Main Layout: Code Explorer + Repo Details Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Left 3 Cols: File Explorer & README -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Branch Selector, Search, & Clone Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <!-- Branch Button -->
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-surface-raised border border-surface-border hover:bg-surface-sunken rounded-none cursor-pointer shadow-xs"
                aria-label="Current branch: main. Click to switch branch."
              >
                <UIcon name="lucide:git-branch" class="w-3.5 h-3.5 text-brand-primary" />
                <span>main</span>
                <UIcon name="lucide:chevron-down" class="w-3 h-3 text-text-muted" />
              </button>
              <span class="text-xs font-mono text-text-muted">
                <strong>428</strong> commits · <strong>3</strong> branches
              </span>
            </div>

            <!-- Clone Bar with 1-Click Copy -->
            <div class="flex items-center">
              <span class="px-2.5 py-1.5 text-[11px] font-mono font-bold uppercase bg-surface-sunken border border-r-0 border-surface-border text-text-muted">
                HTTPS
              </span>
              <input
                :value="cloneUrl"
                readonly
                aria-label="Repository Git clone URL"
                class="px-2.5 py-1.5 text-xs font-mono bg-surface-raised border border-surface-border text-text-primary w-52 sm:w-64 truncate focus:outline-none"
              />
              <button
                type="button"
                class="px-2.5 py-1.5 text-xs font-bold font-mono bg-brand-primary text-text-inverse hover:bg-brand-primary-deep transition-colors cursor-pointer border border-l-0 border-brand-primary"
                aria-label="Copy clone URL to clipboard"
                @click="copyCloneUrl"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>

          <!-- Commit Metadata Bar -->
          <div class="bg-surface-sunken border border-surface-border px-4 py-2.5 rounded-none flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-6 h-6 rounded-full bg-brand-primary text-text-on-brand font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                AG
              </div>
              <span class="font-bold text-text-primary truncate">A. Guevara</span>
              <span class="text-text-muted truncate">feat: integrate 5-band spectrum telemetry metrics</span>
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px] text-text-muted flex-shrink-0">
              <span class="bg-surface-raised px-1.5 py-0.5 border border-surface-border text-brand-primary font-bold">a8f3b21</span>
              <span>2 hours ago</span>
            </div>
          </div>

          <!-- File Explorer Table -->
          <div class="bg-surface-raised border border-surface-border rounded-none overflow-hidden shadow-xs">
            <table class="w-full text-left text-xs border-collapse">
              <caption class="sr-only">Repository files and directories</caption>
              <thead>
                <tr class="sr-only">
                  <th scope="col">Name</th>
                  <th scope="col">Last Commit</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-border">
                <tr v-for="file in fileList" :key="file.name" class="hover:bg-surface-eggshell/60 transition-colors">
                  <td class="py-2.5 px-4 font-mono font-medium flex items-center gap-2.5">
                    <UIcon
                      :name="file.type === 'dir' ? 'lucide:folder' : 'lucide:file-code'"
                      class="w-4 h-4 flex-shrink-0"
                      :class="file.type === 'dir' ? 'text-brand-accent' : 'text-text-muted'"
                    />
                    <a href="#" class="text-text-primary hover:text-brand-primary hover:underline">
                      {{ file.name }}
                    </a>
                  </td>
                  <td class="py-2.5 px-3 text-text-muted truncate max-w-xs">
                    {{ file.message }}
                  </td>
                  <td class="py-2.5 px-4 text-right text-text-muted font-mono text-[11px] whitespace-nowrap">
                    {{ file.time }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- README Presentation in Eggshell Well -->
          <article class="bg-surface-raised border border-surface-border rounded-none overflow-hidden shadow-xs">
            <header class="bg-surface-sunken border-b border-surface-border px-4 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-text-primary">
              <div class="flex items-center gap-2">
                <UIcon name="lucide:book-open" class="w-4 h-4 text-brand-primary" />
                <span>README.md</span>
              </div>
              <span class="text-[11px] text-text-muted">7.4 KB</span>
            </header>
            <div class="p-6 sm:p-8 space-y-6 prose max-w-none text-sm text-text-primary">
              <!-- Two-Tone Comm Style Readme Title -->
              <TuxSectionHeader
                :level="2"
                title="Transportation Analytics"
                secondary-title="Engine (TAE)"
                variant="two-tone-rule"
                kicker="RESEARCH COMPUTING SUITE"
                subtitle="High-performance stream processor for roadside radar, connected vehicle BSM broadcasts, and Bluetooth MAC-matching detectors."
              />

              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 text-xs font-mono font-bold bg-brand-primary text-text-on-brand">Rust 1.82</span>
                <span class="px-2 py-0.5 text-xs font-mono font-bold bg-spectrum-blue text-text-inverse">SAE J2735</span>
                <span class="px-2 py-0.5 text-xs font-mono font-bold bg-spectrum-teal text-text-inverse">Apache Arrow</span>
                <span class="px-2 py-0.5 text-xs font-mono font-bold bg-spectrum-gold text-text-primary">WCAG 2.2 AAA</span>
              </div>

              <div class="space-y-2">
                <h3 class="text-base font-bold text-brand-primary uppercase tracking-tight">Quick Start &amp; Deployment</h3>
                <div class="bg-surface-sunken border border-surface-border p-4 font-mono text-xs text-text-primary overflow-x-auto">
                  <code># Clone and initialize local pipeline<br>git clone https://code.tti.tamu.edu/tti/trans-analytics-engine.git<br>cd trans-analytics-engine &amp;&amp; cargo build --release</code>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Right 1 Col: Repository Metadata Sidebar -->
        <aside class="space-y-6" aria-label="Repository details and metadata">
          <div class="space-y-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">About</h2>
            <p class="text-xs text-text-primary leading-relaxed">
              Official transportation analytics core powering Texas connected vehicle pilot programs and real-time corridor monitoring.
            </p>
            <div class="space-y-2 text-xs pt-2 border-t border-surface-border">
              <div class="flex items-center gap-2 text-text-muted">
                <UIcon name="lucide:link" class="w-3.5 h-3.5" />
                <a href="https://tti.tamu.edu/cav" class="text-brand-primary hover:underline truncate">tti.tamu.edu/cav</a>
              </div>
              <div class="flex items-center gap-2 text-text-muted">
                <UIcon name="lucide:scale" class="w-3.5 h-3.5" />
                <span>Texas A&amp;M University System Research License</span>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-4 border-t border-surface-border">
            <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">Research Division</h2>
            <div class="p-3 bg-surface-raised border border-surface-border space-y-1.5">
              <div class="font-bold text-xs text-brand-primary">Connected &amp; Automated Vehicles</div>
              <p class="text-[11px] text-text-muted">
                Principal Investigator: Dr. K. Balke, P.E.
              </p>
              <NuxtLink to="/examples/comm-portal" class="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1">
                <span>Division Portal</span>
                <UIcon name="lucide:arrow-right" class="w-3 h-3" />
              </NuxtLink>
            </div>
          </div>

          <div class="space-y-3 pt-4 border-t border-surface-border">
            <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">Languages</h2>
            <div class="space-y-2">
              <div class="h-2 w-full flex overflow-hidden rounded-none">
                <div class="bg-brand-primary" style="width: 68%" title="Rust 68%" />
                <div class="bg-spectrum-blue" style="width: 18%" title="TypeScript 18%" />
                <div class="bg-spectrum-teal" style="width: 10%" title="Python 10%" />
                <div class="bg-brand-accent" style="width: 4%" title="Shell 4%" />
              </div>
              <div class="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-muted">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-primary" />
                  <span>Rust 68%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-spectrum-blue" />
                  <span>TypeScript 18%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-spectrum-teal" />
                  <span>Python 10%</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-brand-accent" />
                  <span>Shell 4%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Institutional Footer -->
    <TuxFooter
      :columns="[
        {
          heading: 'TTI Code & Forgejo',
          links: [
            { label: 'Repository Explore', href: '#' },
            { label: 'CI/CD Fleet Telemetry', href: '#' },
            { label: 'Developer Guidelines', href: '#' },
          ]
        },
        {
          heading: 'TTI Engineering',
          links: [
            { label: 'Open Source Software Policy', href: '#' },
            { label: 'IT Security & Vulnerability Disclosure', href: '#' },
            { label: 'TAMUS Research Code Repository', href: '#' },
          ]
        }
      ]"
      copyright-text="© 2026 Texas A&M Transportation Institute · TTI Code Developer Platform"
      copyright-href="https://tti.tamu.edu/notices-policies/copyright-statement/"
    />
  </div>
</template>
