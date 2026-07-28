<script setup lang="ts">
useHead({ title: "TuxUtilityCluster · TUX" });

// Demo identities for the TuxUserMenu states.
const signedIn = {
  state: "signed-in" as const,
  identity: {
    name: "Guevara, Anthony",
    email: "a-guevara@tti.tamu.edu",
    department: "NET",
  },
  items: [
    { label: "My activity", icon: "lucide:activity", to: "#" },
    { label: "Settings", icon: "lucide:settings-2", to: "#" },
  ],
  prefs: [{ label: "High contrast", icon: "lucide:contrast", to: "#" }],
};
const localOnly = {
  state: "local-only" as const,
  identity: { name: "Local session" },
  signInHref: "#",
  signInLabel: "Sign in to TTI",
  statusLine: "Local only",
};
const errored = { state: "error" as const, identity: { name: "Unknown" } };

const clusterVue = `<tux-utility-cluster
  current="landscape"
  :signed-in="identity.authenticated"
  :user-menu="{ state, identity, items, prefs }"
  @sign-out="signOut()"
>
  <template #search><!-- ⌘K trigger --></template>
  <template #notifications><!-- bell --></template>
</tux-utility-cluster>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · suite chrome" title="TuxUtilityCluster">
      The trailing app-control cluster and the enforcement point for its
      anatomy law: <code>search · notifications · theme · waffle ·
      identity</code>, fixed DOM order, always. Optional seats are
      absent, never reordered; the waffle and identity never fold. The
      waffle is registry-fed via <code>useTuxApps()</code> — pass
      <code>current</code> and auth state, never an app list. Includes
      <code>TuxUserMenu</code>, the suite's one identity affordance
      (two blessed mounts: <code>cluster</code> here,
      <code>rail-footer</code> for workbench rails).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">signed in · full cluster</p>
      <h2 class="heading--bold text-xl font-bold">The law's order</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Theme toggle (light ↔ dark; announces via a
        <code>role="status"</code> region; high-contrast stays in the
        footer per ADR-0006 and in the menu's prefs section), the
        waffle, and the account chip — identical accessible name in
        both mounts ("Account: {name}").
      </p>
      <TuxExample class="mt-4" :vue="clusterVue">
        <div class="flex justify-end p-4 rounded-md border border-surface-border bg-surface-sunken">
          <TuxUtilityCluster current="tux" :signed-in="true" :user-menu="signedIn" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tux-user-menu · state catalog</p>
      <h2 class="heading--bold text-xl font-bold">Every identity state renders deliberately</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Loading → inert skeleton. Signed-out → a quiet link, not a menu.
        Local-only is first-class, not an error (the AI Studio
        AccountChip doctrine) — the menu offers sign-in. Error tints the
        avatar and offers retry; it never blocks the rest of the chrome.
        An unauthenticated <em>product</em> renders no identity seat at
        all.
      </p>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="p-4 rounded-md border border-surface-border bg-surface-sunken flex items-center justify-center">
          <TuxUserMenu state="loading" />
        </div>
        <div class="p-4 rounded-md border border-surface-border bg-surface-sunken flex items-center justify-center">
          <TuxUserMenu state="signed-out" sign-in-href="#" />
        </div>
        <div class="p-4 rounded-md border border-surface-border bg-surface-sunken flex items-center justify-center">
          <TuxUserMenu v-bind="localOnly" placement="rail-footer" />
        </div>
        <div class="p-4 rounded-md border border-surface-border bg-surface-sunken flex items-center justify-center">
          <TuxUserMenu v-bind="errored" />
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">rail-footer mount</p>
      <h2 class="heading--bold text-xl font-bold">The workbench chip</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Workbench-shaped apps (persistent left rail) mount identity in
        the rail footer — the Copilot/VS Code convention. Same
        component, same menu order, wider chip.
      </p>
      <div class="mt-4 max-w-64 p-3 rounded-md border border-surface-border bg-surface-sunken">
        <TuxUserMenu
          state="signed-in"
          placement="rail-footer"
          :identity="signedIn.identity"
          :items="signedIn.items"
          status-line="Signed in · TTI AI Chat"
        />
      </div>
    </section>
  </div>
</template>
