<script setup lang="ts">
useHead({ title: "TuxFAB · TUX" });

const fabCount = ref(0);

const basicVue = `<tux-fab icon="lucide:plus" aria-label="New project" @click="onCreate" />`;
const extendedVue = `<tux-fab icon="lucide:plus" extended @click="onCreate">
  New project
</tux-fab>`;
const sideVue = `<tux-fab icon="lucide:message-square" size="sm" side="left" aria-label="Chat" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · mobile-first action" title="TuxFAB">
      Floating Action Button. Material-pattern primary action anchored
      to the bottom-right of the viewport (or a positioned ancestor).
      Use sparingly — exactly <strong>one FAB per screen</strong>, for
      the single "create new" / "compose" action.
      <br><br>
      <span class="text-sm text-text-muted">
        Respects <code>env(safe-area-inset-*)</code> so it stays clear
        of the iOS home indicator and Android gesture nav. Three sizes
        (sm / md), and an extended pill form for label clarity.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Icon-only circle</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The default 56px circular form is Material's standard FAB.
        Requires <code>aria-label</code> for screen readers since
        there's no visible text.
        Clicked: <strong>{{ fabCount }}</strong> times.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="relative h-32 rounded-md border border-surface-border bg-surface-sunken">
          <TuxFAB
            icon="lucide:plus"
            aria-label="Create new"
            style="position: absolute; bottom: 1rem; right: 1rem;"
            @click="fabCount++"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">extended · with label</p>
      <h2 class="heading--bold text-xl font-bold">Pill form</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use the extended form when the action's intent isn't obvious from
        the icon alone. The pill expands to fit the label; height stays
        48px.
      </p>
      <TuxExample class="mt-4" :vue="extendedVue">
        <div class="relative h-32 rounded-md border border-surface-border bg-surface-sunken">
          <TuxFAB
            icon="lucide:plus"
            extended
            style="position: absolute; bottom: 1rem; right: 1rem;"
            @click="fabCount++"
          >
            New project
          </TuxFAB>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">side + size</p>
      <h2 class="heading--bold text-xl font-bold">Left-anchored small variant</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Override <code>side="left"</code> for right-to-left layouts or
        when the bottom-right is occupied (e.g., by a TuxTabBar). Use
        <code>size="sm"</code> (40px) for compact surfaces.
      </p>
      <TuxExample class="mt-4" :vue="sideVue">
        <div class="relative h-24 rounded-md border border-surface-border bg-surface-sunken">
          <TuxFAB
            icon="lucide:message-square"
            size="sm"
            side="left"
            aria-label="Open chat"
            style="position: absolute; bottom: 0.75rem; left: 0.75rem;"
          />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
