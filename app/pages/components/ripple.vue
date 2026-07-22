<script setup lang="ts">
useHead({ title: "useTuxRipple · TUX" });

const button = ref<HTMLElement | null>(null);
const card = ref<HTMLElement | null>(null);

useTuxRipple(button, {
  color: "rgba(255, 255, 255, 0.45)",
});

useTuxRipple(card, {
  color: "color-mix(in srgb, var(--brand-primary) 22%, transparent)",
  duration: 800,
});

const usageVue = [
  '<' + 'script setup>',
  'const btn = ref<HTMLElement | null>(null);',
  'useTuxRipple(btn, { color: "rgba(255, 255, 255, 0.4)" });',
  '</' + 'script>',
  '',
  '<template>',
  '  <button ref="btn">Tap me</button>',
  '</template>',
  '',
  '<style scoped>',
  'button {',
  '  position: relative;',
  '  overflow: hidden;',
  '}',
  '</style>',
].join("\n");
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="composable · mobile feedback" title="useTuxRipple">
      Material-style tap-feedback ripple on a target element. Captured
      from the Material 3 absorption as an <strong>opt-in</strong>
      affordance for <code>[data-platform="android"]</code> surfaces;
      not enabled globally on TuxButton or other interactive
      components. Use sparingly — TUX motion restraint applies.
      <br><br>
      <span class="text-sm text-text-muted">
        Honors <code>prefers-reduced-motion</code> — skips the ripple
        animation entirely when the user has reduce-motion set. The
        target element must have <code>position: relative</code> +
        <code>overflow: hidden</code> for the ripple to be clipped
        correctly.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Bind to a ref</h2>
      <TuxExample class="mt-4" :vue="usageVue">
        <div class="text-sm text-text-secondary italic">(See live demos below)</div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">brand-primary button</p>
      <h2 class="heading--bold text-xl font-bold">Maroon button with white ripple</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        White (45% opacity) ripple over a maroon background. Click /
        tap the button to see the feedback.
      </p>
      <div class="mt-4">
        <button
          ref="button"
          class="px-6 py-3 rounded-md bg-brand-primary text-white font-semibold relative overflow-hidden cursor-pointer"
        >
          Tap me
        </button>
      </div>
    </section>

    <section>
      <p class="eyebrow">tonal card</p>
      <h2 class="heading--bold text-xl font-bold">Maroon ripple over paper</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        For lighter surfaces (cards, list rows), use a maroon-tinted
        ripple at low opacity. Custom <code>duration</code> = 800ms for
        a softer feel.
      </p>
      <div class="mt-4">
        <div
          ref="card"
          class="p-5 rounded-md border border-surface-border bg-surface-page relative overflow-hidden cursor-pointer"
        >
          <p class="font-semibold">Click this card</p>
          <p class="text-sm text-text-muted">A maroon-tinted ripple emanates from the click origin.</p>
        </div>
      </div>
    </section>
  </div>
</template>
