<script setup lang="ts">
useHead({ title: "tti-ux — Living style guide" });

const components = [
  { name: "TuxAlert",  to: "/components/alert",  blurb: "Docusaurus-style admonitions — 8 variants." },
  { name: "TuxBadge",  to: "/components/badge",  blurb: "Classification tiers, scan states, tags, counts." },
  { name: "TuxButton", to: "/components/button", blurb: "Four semantic intents incl. destructive fill-on-hover." },
  { name: "TuxCard",   to: "/components/card",   blurb: "Static or linked — corner-drop hover choreography." },
  { name: "TuxModal",  to: "/components/modal",  blurb: "UModal with eyebrow + gold-bar title." },
  { name: "TuxTable",  to: "/components/table",  blurb: "UTable with aggieux chrome + auto status cells." },
];
</script>

<template>
  <div class="space-y-10">
    <section>
      <p class="eyebrow">tti-ux</p>
      <h1 class="heading--display text-4xl">TTI Design System</h1>
      <p class="mt-4 max-w-2xl text-text-secondary leading-relaxed">
        A living style guide for Texas A&amp;M Transportation Institute apps built on Nuxt 4.
        Every page you see is rendered by the same components your app imports — so this site
        <span class="link-tti">is</span> the source of truth, not a doc of it.
      </p>
    </section>

    <section>
      <p class="eyebrow">get started</p>
      <h2 class="heading--bold text-2xl font-bold">Foundations</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TuxCard to="/tokens">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Tokens</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Brand colors, surfaces, text roles, shadows, radii — every CSS variable
            the system exposes, visible at a glance.
          </p>
        </TuxCard>
        <TuxCard to="/typography">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Typography</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Public Sans + JetBrains Mono. The <code>heading--bold</code>,
            <code>heading--display</code>, and eyebrow utilities in context.
          </p>
        </TuxCard>
        <TuxCard to="/motion">
          <p class="eyebrow">foundations</p>
          <h3 class="text-xl font-bold">Motion &amp; spacing</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Three durations, the 4px spacing ramp, and the aggieux corner-drop
            signature.
          </p>
        </TuxCard>
        <TuxCard to="/patterns">
          <p class="eyebrow">beyond components</p>
          <h3 class="text-xl font-bold">Patterns</h3>
          <p class="mt-2 text-sm text-text-secondary">
            Empty states, loading skeletons, confirmation flows, admonition stacks —
            conventions for the decisions components don't answer.
          </p>
        </TuxCard>
      </div>
    </section>

    <section>
      <p class="eyebrow">primitives</p>
      <h2 class="heading--bold text-2xl font-bold">Components</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TuxCard v-for="c in components" :key="c.name" :to="c.to">
          <p class="eyebrow">component</p>
          <h3 class="text-xl font-bold">{{ c.name }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ c.blurb }}</p>
        </TuxCard>
      </div>
    </section>
  </div>
</template>
