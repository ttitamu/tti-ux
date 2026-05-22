<script setup lang="ts">
useHead({ title: "TuxTabBar · TUX" });

const tabs3 = [
  { label: "Home", to: "/components/tab-bar", icon: "lucide:home" },
  { label: "Browse", to: "/components/tab-bar?demo=browse", icon: "lucide:search" },
  { label: "Profile", to: "/components/tab-bar?demo=profile", icon: "lucide:user" },
];

const tabs5 = [
  { label: "Home", to: "/components/tab-bar", icon: "lucide:home" },
  { label: "Search", to: "/components/tab-bar?demo=search", icon: "lucide:search" },
  { label: "Notes", to: "/components/tab-bar?demo=notes", icon: "lucide:notebook" },
  { label: "Tasks", to: "/components/tab-bar?demo=tasks", icon: "lucide:check-square", badge: 3 },
  { label: "Profile", to: "/components/tab-bar?demo=profile", icon: "lucide:user" },
];

const basicVue = `<tux-tab-bar :items="tabs" />`;
const badgeVue = `<tux-tab-bar
  :items="[
    { label: 'Home', to: '/', icon: 'lucide:home' },
    { label: 'Search', to: '/search', icon: 'lucide:search' },
    { label: 'Tasks', to: '/tasks', icon: 'lucide:check-square', badge: 3 },
    { label: 'Profile', to: '/me', icon: 'lucide:user' },
  ]"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · mobile navigation" title="TuxTabBar">
      Bottom-anchored mobile navigation bar (3-5 tabs). Canonical shape
      distilled from the 50-mobile-bottom-navigation absorption: flat
      bar, icon + label, <strong>maroon top-edge rule</strong> as the
      active indicator (TUX signature, not Material's underline-bottom
      or iOS 26's filled glass pill).
      <br><br>
      <span class="text-sm text-text-muted">
        Honors <code>env(safe-area-inset-bottom)</code> automatically —
        clears the iOS home indicator and Android gesture nav. Designed
        for Tauri Mobile targets; pair desktop / wide-viewport pages
        with <code>app/layouts/sidebar.vue</code> instead.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">three tabs</p>
      <h2 class="heading--bold text-xl font-bold">Canonical 3-tab bar</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Active tab gets a maroon top-edge hairline, slightly bolder
        label, and brand-primary tint. The component clips at 5
        items + logs a console warning in dev if you pass more (move
        overflow into a sidebar or more menu).
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="rounded-md border border-surface-border overflow-hidden">
          <TuxTabBar :items="tabs3" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">five tabs with badge</p>
      <h2 class="heading--bold text-xl font-bold">Maximum width</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Five tabs is the consensus maximum. Any <code>badge</code> field
        renders a small brand-primary pill at the top-right of the icon
        (good for unread counts, pending items).
      </p>
      <TuxExample class="mt-4" :vue="badgeVue">
        <div class="rounded-md border border-surface-border overflow-hidden">
          <TuxTabBar :items="tabs5" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="heading--bold text-xl font-bold">aria-current + 44px tap targets</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Active tab carries <code>aria-current="page"</code>; the parent
        nav has the <code>aria-label</code> ("Primary navigation" by
        default). Tap targets are min 44×44px per Apple HIG — the
        component pads to that minimum even on dense 5-tab layouts.
      </p>
    </section>
  </div>
</template>
