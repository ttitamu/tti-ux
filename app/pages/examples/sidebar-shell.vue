<script setup lang="ts">
useHead({ title: "Example · sidebar shell · TUX" });

// Disable auto-layout so we can use `<NuxtLayout>` explicitly below.
// That's the only way to access a layout's named slots with typed
// scope variables in Nuxt 4 — `definePageMeta({ layout: "sidebar" })`
// would route the page into the layout's default slot only, without
// access to `#rail-header` / `#rail` / `#rail-footer` and without
// slot-scope typing.
definePageMeta({ layout: false });

// Primary rail nav. Top-level icon + label entries; nested children
// render as collapsible groups via UNavigationMenu. "Sessions" is
// `defaultOpen` so the example lands with visible structure rather
// than five flat icons.
const railItems = [
  [
    {
      label: "Sessions",
      icon: "lucide:message-square-text",
      defaultOpen: true,
      children: [
        { label: "Today",     icon: "lucide:circle-dot",    to: "/examples/sidebar-shell" },
        { label: "This week", icon: "lucide:circle",        to: "#" },
        { label: "Archived",  icon: "lucide:archive",       to: "#" },
      ],
    },
    { label: "Corpora",   icon: "lucide:database",  to: "#" },
    { label: "Models",    icon: "lucide:cpu",       to: "#" },
    { label: "API keys",  icon: "lucide:key-round", to: "#" },
  ],
  [
    { label: "Documentation", icon: "lucide:book-open",   to: "#" },
    { label: "Changelog",     icon: "lucide:scroll",      to: "#" },
  ],
];

const headlineFactoids = [
  { value: "8",    suffix: null,  label: "Active sessions" },
  { value: "12.8", suffix: "M",   label: "Tokens this week" },
  { value: "0.04", suffix: " s",  label: "Avg latency · p50" },
];

const recentSessions = [
  { id: "session-04ab", title: "Compare CLS-204 vs CLS-211 on grant subset",   when: "8 min ago" },
  { id: "session-12cd", title: "Draft response to TxDOT IAC 2020-78-104 RFI",  when: "1 hr ago" },
  { id: "session-39ef", title: "Pull rural-roadway findings citations",        when: "Yesterday" },
  { id: "session-7811", title: "Equity framework — literature scan",           when: "2 days ago" },
];
</script>

<template>
  <NuxtLayout name="sidebar">
    <!-- #header: top bar across the whole page (inside UDashboardPanel
         header). Typical content: page title, breadcrumbs, primary
         actions. -->
    <template #header>
      <div class="flex items-center justify-between gap-3 px-6 py-3 border-b border-surface-border bg-surface-page">
        <div class="flex items-center gap-3 min-w-0">
          <UDashboardSidebarToggle />
          <p class="text-sm text-text-muted font-mono truncate">
            /sessions / today / overview
          </p>
        </div>
        <div class="flex items-center gap-2">
          <TuxButton intent="ghost" icon="lucide:plus" size="sm">New session</TuxButton>
          <TuxButton intent="primary" icon="lucide:command" size="sm">⌘K</TuxButton>
        </div>
      </div>
    </template>

    <!-- #rail-header: brand / account lockup at the top of the rail.
         `collapsed` is the rail's icon-only state (true at lg, false
         at xl+). -->
    <template #rail-header="{ collapsed }">
      <div class="px-3 py-3 border-b border-surface-border">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-md bg-brand-primary text-text-inverse grid place-items-center font-bold text-xs flex-shrink-0">
            T
          </div>
          <div v-if="!collapsed" class="min-w-0">
            <p class="text-sm font-bold text-text-primary truncate">tti-ai-studio</p>
            <p class="text-xs text-text-muted truncate">Texas A&amp;M TTI</p>
          </div>
        </div>
      </div>
    </template>

    <!-- #rail: navigation body. TuxRailNav renders the hierarchy with
         native <details> groups (accessible disclosure, no roleless
         aria-expanded); two groups (primary + secondary) sit either
         side of a divider. -->
    <template #rail="{ collapsed }">
      <TuxRailNav
        :items="railItems"
        :collapsed="collapsed"
        aria-label="Studio navigation"
        class="px-2 py-3"
      />
    </template>

    <!-- #rail-footer: user / settings. Pinned to the rail bottom;
         collapses to avatar-only when the rail is icon-only. -->
    <template #rail-footer="{ collapsed }">
      <div class="px-3 py-3 border-t border-surface-border">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-surface-sunken text-text-secondary grid place-items-center font-semibold text-xs flex-shrink-0">
            RC
          </div>
          <div v-if="!collapsed" class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-text-primary truncate">R. Chen</p>
            <p class="text-xs text-text-muted truncate">rchen@tti.tamu.edu</p>
          </div>
          <button
            v-if="!collapsed"
            type="button"
            class="text-text-muted hover:text-brand-primary"
            aria-label="Settings"
          >
            <UIcon name="lucide:settings" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>

    <!-- Default slot: the main panel content. -->
    <div class="p-6 space-y-8">
      <div class="example-demo-notice">
        <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
        <p class="example-demo-notice__text">
          <strong>Composition example.</strong>
          Demonstrates <code>app/layouts/sidebar.vue</code> — the
          opt-in app-shell layout. Wraps Nuxt UI 4's UDashboard*
          primitives; provides four named slots
          (<code>header</code>, <code>rail-header</code>,
          <code>rail</code>, <code>rail-footer</code>) plus the default
          content slot. Note this page uses explicit
          <code>&lt;NuxtLayout&gt;</code> instead of
          <code>definePageMeta</code> so the named slots' typed scope
          (<code>collapsed</code>, <code>collapse</code>) propagates.
        </p>
      </div>

      <TuxPageHeader
        eyebrow="overview"
        title="Today's sessions"
      >
        Eight active research sessions across four scoped corpora.
        Last sync 2 minutes ago.
      </TuxPageHeader>

      <section>
        <TuxFactoid variant="default" :density="3" :items="headlineFactoids" />
      </section>

      <section class="space-y-3">
        <TuxSectionHeader>Recent activity</TuxSectionHeader>
        <ul class="space-y-2 tux-mount-in tux-mount-in--stagger">
          <li
            v-for="(s, idx) in recentSessions"
            :key="s.id"
            class="flex items-center gap-3 p-3 rounded-md border border-surface-border bg-surface-page hover:border-brand-primary transition-colors"
            :style="{ '--tux-mount-stagger-index': idx }"
          >
            <UIcon name="lucide:message-square-text" class="w-4 h-4 text-text-muted flex-shrink-0" />
            <p class="flex-1 text-sm text-text-primary truncate">{{ s.title }}</p>
            <code class="font-mono text-xs text-text-muted">{{ s.id }}</code>
            <span class="text-xs text-text-muted">{{ s.when }}</span>
          </li>
        </ul>
      </section>

      <TuxAlert variant="tip" title="About this layout">
        Try resizing the viewport — at <code>lg</code> (1024px) the
        rail collapses to icon-only, and below <code>md</code> (768px)
        it becomes a slideover overlay accessed via the hamburger
        toggle in the header. State persists across navigation via
        UDashboardGroup's cookie storage.
      </TuxAlert>
    </div>
  </NuxtLayout>
</template>
