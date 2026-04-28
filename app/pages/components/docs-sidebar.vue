<script setup lang="ts">
useHead({ title: "TuxDocsSidebar · TUX" });

const tree = [
  {
    label: "Get started",
    icon: "lucide:rocket",
    children: [
      { label: "Install",      to: "#" },
      { label: "First scan",   to: "#" },
      { label: "Architecture", to: "#" },
    ],
  },
  {
    label: "Agent",
    icon: "lucide:satellite-dish",
    children: [
      { label: "Watcher",       to: "#" },
      { label: "Heartbeat",     to: "#" },
      { label: "Drift reconciler", to: "#" },
      {
        label: "Configuration",
        children: [
          { label: "watches.yaml", to: "#" },
          { label: "Environment",  to: "#" },
          { label: "Tokens",       to: "#" },
        ],
      },
    ],
  },
  {
    label: "Index",
    icon: "lucide:database",
    children: [
      { label: "Corpora",     to: "#" },
      { label: "Classifiers", to: "#" },
      { label: "Search API",  to: "/components/docs-sidebar" },
      { label: "Treemap",     to: "#" },
    ],
  },
  {
    label: "Operations",
    icon: "lucide:wrench",
    children: [
      { label: "Deployment",  to: "#" },
      { label: "Monitoring",  to: "#" },
      { label: "Backups",     to: "#" },
      { label: "Runbook",     to: "#" },
    ],
  },
  {
    label: "Reference",
    icon: "lucide:book-open",
    children: [
      { label: "API",      to: "#" },
      { label: "CLI",      to: "#" },
      { label: "Schema",   to: "#" },
      { label: "Glossary", to: "#" },
    ],
  },
];

const exampleVue = `<TuxDocsSidebar
  title="PECAN docs"
  :tree="[
    { label: 'Get started', children: [...] },
    { label: 'Agent',       children: [...] },
    { label: 'Index',       children: [...] },
  ]"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxDocsSidebar">
      Hierarchical sidebar for documentation sites — distinct from the
      flat catalog sidebar in the style guide. Collapsible parent
      sections via native <code>&lt;details&gt;</code>, inline search
      filtering with match highlighting, sessionStorage-persisted
      collapse state. The active item renders as a soft pink pill;
      neutral indent guides + horizontal connector ticks carry the
      parent-child structure. Same visual pattern as the production
      docs.tti.tamu.edu and docs.it.tamu.edu sidebars.
    </TuxPageHeader>

    <section class="space-y-3">
      <p class="eyebrow">visual language</p>
      <h2 class="heading--bold text-xl font-bold">Indent guides + connector ticks</h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        Each nesting level renders a thin vertical guide line on the
        left of its children — that's the indent guide. Every child
        gets a short horizontal tick connecting from the guide to
        its row, so the parent-child relationship is unambiguous
        without going full ASCII tree. Both stay neutral gray; the
        active item alone carries the "you are here" affordance.
      </p>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        The demo below has its <strong>Search API</strong> entry
        wired to <code>/components/docs-sidebar</code> — this very
        page. That entry renders as a maroon-tinted pill so you can
        see the active treatment in context, with the section
        heading "Index" picking up the brand color above it.
      </p>
    </section>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">PECAN-shaped tree · 5 sections</h2>
      <p class="text-sm text-text-secondary mb-3">
        Type in the filter to narrow the tree — matches highlight in
        labels and parent groups expand to reveal hits. The "Search
        API" link is wired live to this page so you can see the active
        treatment.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="border border-surface-border rounded-md bg-surface-page p-4">
          <TuxDocsSidebar
            title="PECAN docs"
            :tree="tree"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">production wiring</p>
      <h2 class="heading--bold text-xl font-bold">Three-column doc layout</h2>
      <p class="text-sm text-text-secondary mb-3">
        The canonical pattern: TuxDocsSidebar on the left,
        TuxBreadcrumbs + article in the middle, TuxTOC on the right.
        Wire it once in a Nuxt layout (<code>layouts/docs.vue</code>)
        and any page declaring <code>definePageMeta({ layout: "docs" })</code>
        gets the full chrome.
      </p>
      <TuxCodeBlock
        lang="vue"
        filename="layouts/docs.vue"
        :code="`<template>
  <div class=&quot;docs-layout&quot;>
    <aside>
      <TuxDocsSidebar :tree=&quot;docsTree&quot; />
    </aside>
    <main>
      <TuxBreadcrumbs :trail=&quot;crumbs&quot; />
      <article>
        <slot />
      </article>
    </main>
    <aside class=&quot;toc&quot;>
      <TuxTOC />
    </aside>
  </div>
</template>

<style>
.docs-layout {
  display: grid;
  grid-template-columns: 16rem 1fr 14rem;
  gap: 2.5rem;
  max-width: 84rem;
  margin: 0 auto;
}
@media (max-width: 64rem) {
  .docs-layout { grid-template-columns: 1fr; }
}
</style>`"
      />
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + tree shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>tree</code> — array of <code>{ label, to?, icon?, children? }</code>. Required.</li>
        <li><code>title</code> — heading above the tree. Defaults to <code>"Docs"</code>.</li>
        <li><code>search</code> — show inline filter input. Defaults to <code>true</code>.</li>
        <li><code>searchPlaceholder</code> — placeholder text. Defaults to <code>"Filter docs…"</code>.</li>
        <li><code>storageKey</code> — sessionStorage key for collapse persistence. Set <code>null</code> to disable.</li>
        <li>Section without <code>to</code> + <code>children</code> — renders as a non-link parent. The tree expands when an active descendant matches the current route.</li>
      </ul>
    </section>
  </div>
</template>
