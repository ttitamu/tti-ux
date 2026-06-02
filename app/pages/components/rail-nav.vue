<script setup lang="ts">
useHead({ title: "TuxRailNav · TUX" });

// Two groups: a primary set (with one collapsible group) and a
// secondary set that sits below a divider — the canonical app-shell
// rail shape the example shells use.
const items = [
  [
    {
      label: "Sessions",
      icon: "lucide:message-square-text",
      defaultOpen: true,
      children: [
        { label: "Today",     icon: "lucide:circle-dot", to: "/components/rail-nav" },
        { label: "This week", icon: "lucide:circle",     to: "#" },
        { label: "Archived",  icon: "lucide:archive",    to: "#" },
      ],
    },
    { label: "Corpora",  icon: "lucide:database",  to: "#" },
    { label: "Models",   icon: "lucide:cpu",       to: "#" },
    { label: "API keys", icon: "lucide:key-round", to: "#" },
  ],
  [
    { label: "Documentation", icon: "lucide:book-open", to: "#" },
    { label: "Changelog",     icon: "lucide:scroll",    to: "#" },
  ],
];

const basicVue = `<tux-rail-nav :items="items" aria-label="Studio navigation" />`;
const collapsedVue = `<tux-rail-nav :items="items" collapsed aria-label="Studio navigation" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · navigation" title="TuxRailNav">
      Collapsible sidebar/rail navigation for app shells. Grouped
      entries; any entry with <code>children</code> becomes a
      <strong>native <code>&lt;details&gt;</code> disclosure</strong> —
      the same "zero-JS, perfect-a11y" pattern as
      <code>TuxFilterPanel</code>, so the group header is a real
      browser-wired disclosure button (correct
      <code>aria-expanded</code>, keyboard, focus) with no roleless
      ARIA.
      <br><br>
      <span class="text-sm text-text-muted">
        This is the tux-owned replacement for Nuxt UI's
        <code>UNavigationMenu</code> in vertical mode, whose collapsible
        chevron renders as a roleless <code>&lt;span aria-expanded&gt;</code>
        (axe <code>aria-allowed-attr</code>). Used in
        <code>app/layouts/sidebar.vue</code>'s rail.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">expanded</p>
      <h2 class="heading--bold text-xl font-bold">Full rail with a collapsible group</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Leaf entries are links; the "Sessions" entry has
        <code>children</code>, so it renders as an open
        <code>&lt;details&gt;</code> (<code>defaultOpen</code>). The
        second group sits below a hairline divider. Active route gets a
        maroon tint via <code>router-link-active</code>.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="w-64 rounded-md border border-surface-border bg-surface-raised p-2">
          <TuxRailNav :items="items" aria-label="Rail demo — expanded" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">collapsed</p>
      <h2 class="heading--bold text-xl font-bold">Icon-only rail</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pass <code>collapsed</code> for the narrow rail state: labels
        hide, groups fold to a single icon link, and every link keeps an
        <code>aria-label</code> so it stays named for screen readers.
        The layout drives this from its breakpoint (icon-only at
        <code>lg</code>, full at <code>xl+</code>).
      </p>
      <TuxExample class="mt-4" :vue="collapsedVue">
        <div class="w-16 rounded-md border border-surface-border bg-surface-raised p-2">
          <TuxRailNav :items="items" collapsed aria-label="Rail demo — collapsed" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-xl font-bold">Native disclosure, real landmark</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The root is a <code>&lt;nav&gt;</code> landmark named by
        <code>aria-label</code> (override it per instance when several
        rails share a page, so each landmark is unique). Collapsible
        groups use <code>&lt;details&gt;/&lt;summary&gt;</code> — the
        browser supplies the disclosure semantics, so there is never a
        roleless element carrying <code>aria-expanded</code>. Verified
        by <code>npm run audit:a11y</code>.
      </p>
    </section>
  </div>
</template>
