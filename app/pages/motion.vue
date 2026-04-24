<script setup lang="ts">
useHead({ title: "Motion &amp; spacing · tti-ux" });

const spaceSteps = [
  { name: "0.5",  rem: "0.125rem", px: "2px" },
  { name: "1",    rem: "0.25rem",  px: "4px" },
  { name: "2",    rem: "0.5rem",   px: "8px" },
  { name: "3",    rem: "0.75rem",  px: "12px" },
  { name: "4",    rem: "1rem",     px: "16px" },
  { name: "6",    rem: "1.5rem",   px: "24px" },
  { name: "8",    rem: "2rem",     px: "32px" },
  { name: "12",   rem: "3rem",     px: "48px" },
  { name: "16",   rem: "4rem",     px: "64px" },
];

const trigger = ref(0);

function bump() {
  trigger.value += 1;
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="foundations" title="Motion &amp; spacing">
      Transitions should feel intentional, not incidental. Spacing follows Tailwind's
      4px-base ramp — stick to the ramp so rhythms match across the app.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">rhythm</p>
      <h2 class="heading--bold text-xl font-bold">Spacing scale</h2>
      <p class="mt-2 text-sm text-text-secondary max-w-xl">
        4px base. Prefer <code>space-y-4</code> / <code>gap-4</code> for content, <code>gap-6</code>
        for card grids, <code>gap-2</code> for tight clusters (badge rows, button groups).
      </p>
      <div class="mt-4 space-y-2">
        <div v-for="s in spaceSteps" :key="s.name" class="flex items-center gap-4 text-sm">
          <div class="w-16 font-mono text-text-secondary">.{{ s.name }}</div>
          <div class="w-20 font-mono text-xs text-text-muted">{{ s.rem }}</div>
          <div class="w-16 font-mono text-xs text-text-muted">{{ s.px }}</div>
          <div
            class="h-3 rounded"
            :style="{
              width: s.rem,
              background: 'var(--brand-primary)',
            }"
          />
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">timing</p>
      <h2 class="heading--bold text-xl font-bold">Duration &amp; easing</h2>
      <p class="mt-2 text-sm text-text-secondary max-w-xl">
        Three durations cover 95% of UI transitions:
      </p>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-md border border-surface-border p-4">
          <div class="text-sm font-semibold">150ms · fast</div>
          <div class="text-xs font-mono text-text-muted mt-1">hover, focus rings, color swaps</div>
          <div class="mt-4 h-12 bg-surface-sunken rounded-sm transition-colors duration-150 hover:bg-brand-primary" />
          <p class="text-xs text-text-muted mt-2">Hover the strip.</p>
        </div>
        <div class="rounded-md border border-surface-border p-4">
          <div class="text-sm font-semibold">250ms · default</div>
          <div class="text-xs font-mono text-text-muted mt-1">card hover, translate, transform</div>
          <div class="mt-4 h-12 bg-surface-sunken rounded-sm transition-transform duration-250 hover:translate-x-2" />
          <p class="text-xs text-text-muted mt-2">Hover to slide.</p>
        </div>
        <div class="rounded-md border border-surface-border p-4">
          <div class="text-sm font-semibold">350ms · slow</div>
          <div class="text-xs font-mono text-text-muted mt-1">shadow grows, modals, content swaps</div>
          <div class="mt-4 h-12 bg-surface-sunken rounded-sm transition-shadow duration-350 hover:shadow-lg" />
          <p class="text-xs text-text-muted mt-2">Hover for shadow.</p>
        </div>
      </div>
    </section>

    <section>
      <p class="eyebrow">signature</p>
      <h2 class="heading--bold text-xl font-bold">Card corner-drop</h2>
      <p class="mt-2 text-sm text-text-secondary max-w-xl">
        The <code>card-linked</code> hover is the aggieux signature motion: translate
        (+6px right, -6px up) + box-shadow drops a maroon slab into the gap it
        leaves behind. Hover the card to see it. <code>TuxCard</code> uses this
        automatically when <code>to</code> is set.
      </p>
      <div class="mt-4 max-w-sm">
        <TuxCard to="/components/card">
          <p class="eyebrow">component</p>
          <h3 class="text-xl font-bold">TuxCard</h3>
          <p class="mt-2 text-sm text-text-secondary">
            See the full spec →
          </p>
        </TuxCard>
      </div>
    </section>

    <section>
      <p class="eyebrow">entering content</p>
      <h2 class="heading--bold text-xl font-bold">Vue transition wrapper</h2>
      <p class="mt-2 text-sm text-text-secondary max-w-xl">
        For content that enters / leaves (toasts, inline alerts, revealed form fields),
        Vue's <code>&lt;Transition&gt;</code> gives a 4-phase lifecycle. Below: 250ms
        slide-down + fade on enter, fade on leave.
      </p>
      <div class="mt-4 flex items-start gap-4">
        <TuxButton intent="primary" icon="lucide:plus" @click="bump">Add item</TuxButton>
        <div class="flex-1 space-y-2">
          <Transition
            v-for="i in trigger"
            :key="i"
            appear
            enter-active-class="transition duration-250 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <TuxAlert
              variant="success"
              :title="`Item ${i} added`"
              description="Slides down + fades in."
            />
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>
