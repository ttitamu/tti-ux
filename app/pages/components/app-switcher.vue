<script setup lang="ts">
useHead({ title: "TuxAppSwitcher · TUX" });

// The canonical registry (design/apps.json) via useTuxApps() — the app
// list is never hand-declared in a consumer. This page demos both auth
// states the composable filters for.
const signedOut = useTuxApps({ current: "tux", signedIn: false });
const signedIn = useTuxApps({ current: "tux", signedIn: true });

const basicVue = `const { apps, heading, footerText } = useTuxApps({
  current: "tux",
  signedIn: identity.authenticated,
});

<tux-app-switcher :apps="apps" :heading="heading" :footer-text="footerText" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · platform-aware chrome" title="TuxAppSwitcher">
      Waffle-button trigger + popover grid for hopping between TTI's
      portals (TTI ↔ my.TTI ↔ TUX docs ↔ Landscape ↔ Atlas ↔ TTI Code).
      Lives in <code>TuxAppFrame</code>'s <code>#right</code> slot
      on Tauri shells or in <code>TuxSiteNav</code>'s utility row on
      plain-web consumers. Source: Microsoft Fabric "Suite header"
      absorption. The app list comes from the canonical registry
      (<code>design/apps.json</code>) via <code>useTuxApps()</code> —
      never hand-declared.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">signed in · registry order</p>
      <h2 class="heading--bold text-xl font-bold">Click the waffle</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Tiles render in registry order on every portal — spatial
        constancy builds the muscle memory. The current app's tile stays
        a focusable link with <code>aria-current="page"</code> and the
        "You are here" badge. Desktop apps carry a "Desktop app" affix
        and point at the launcher, never a raw scheme. Below ~30rem
        width the grid drops to one column.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="flex justify-start p-4 rounded-md border border-surface-border bg-surface-sunken">
          <TuxAppSwitcher
            :apps="signedIn.apps.value"
            :heading="signedIn.heading"
            footer-text="Need access to another app? Email it-support@tti.tamu.edu."
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">anonymous · audience filtering</p>
      <h2 class="heading--bold text-xl font-bold">Signed-out state</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Anonymous visitors see only <code>audience: "public"</code>
        apps, with a footer count pointing at sign-in. Filtering is
        navigation, not authentication — every destination enforces its
        own gate.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="flex justify-start p-4 rounded-md border border-surface-border bg-surface-sunken">
          <TuxAppSwitcher
            :apps="signedOut.apps.value"
            :heading="signedOut.heading"
            :footer-text="signedOut.footerText.value"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">composition</p>
      <h2 class="heading--bold text-xl font-bold">Place it where it belongs</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        On <code>TuxAppFrame</code>, drop the switcher in the
        <code>#right</code> slot alongside user-menu and
        notifications. On <code>TuxSiteNav</code>, place it in the
        utility row before TuxIdentity. Single instance per app —
        not a navigation pattern, an inter-app handoff. The
        <code>presentation</code> prop is reserved for compact/touch
        hosts (<code>"sheet"</code>); only <code>"popover"</code> is
        implemented today.
      </p>
    </section>
  </div>
</template>
