<script setup lang="ts">
useHead({ title: "useTuxSwipe · TUX" });

const card = ref<HTMLElement | null>(null);
const verticalCard = ref<HTMLElement | null>(null);

const lastSwipe = ref<string>("(none yet)");
const lastVerticalSwipe = ref<string>("(none yet)");

const showHorizontal = ref(true);

useTuxSwipe(card, {
  direction: "horizontal",
  threshold: 48,
  onSwipeLeft: () => {
    lastSwipe.value = "left → dismissed";
    showHorizontal.value = false;
  },
  onSwipeRight: () => {
    lastSwipe.value = "right → revealed actions";
  },
});

useTuxSwipe(verticalCard, {
  direction: "vertical",
  threshold: 48,
  onSwipeUp:   () => (lastVerticalSwipe.value = "up → expand"),
  onSwipeDown: () => (lastVerticalSwipe.value = "down → collapse"),
});

function resetHorizontal() {
  showHorizontal.value = true;
  lastSwipe.value = "(reset)";
}

const usageVue = [
  '<' + 'script setup>',
  'const card = ref<HTMLElement | null>(null);',
  'useTuxSwipe(card, {',
  '  direction: "horizontal",',
  '  threshold: 48,',
  '  onSwipeLeft:  () => dismiss(),',
  '  onSwipeRight: () => reveal(),',
  '});',
  '</' + 'script>',
  '',
  '<template>',
  '  <div ref="card">…content…</div>',
  '</template>',
].join("\n");
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="composable · mobile gestures" title="useTuxSwipe">
      Pointer / touch swipe detection on a target element. Captured from
      the Android UI Kit absorption (swipe-to-dismiss list rows, nav
      drawer swipe-from-edge). Pure pointer events — works on Tauri
      Mobile, Tauri Desktop, and plain web.
      <br><br>
      <span class="text-sm text-text-muted">
        <strong>Accessibility rule:</strong> every swipe action MUST
        have a visible alternative (button, link, or keyboard shortcut).
        Swipe-only is a screen-reader and keyboard trap. Don't ship
        swipe-only — the showcase below pairs swipe-left with a "Reset"
        button for keyboard parity.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">usage</p>
      <h2 class="heading--bold text-xl font-bold">Bind to a ref</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Call the composable with a template ref + a configuration
        object. Directional callbacks fire on pointer-up when the
        gesture crosses the threshold and matches the configured axis.
      </p>
      <TuxExample class="mt-4" :vue="usageVue">
        <div class="text-sm text-text-secondary italic">
          (See live demos below)
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">horizontal · row dismiss</p>
      <h2 class="heading--bold text-xl font-bold">Swipe-to-dismiss list row</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Swipe the card left to dismiss; swipe right to "reveal actions".
        Use a mouse, trackpad, or touch — pointer events handle all
        three. The "Reset" button is the **a11y-pair** alternative.
      </p>
      <div class="mt-4 space-y-3">
        <div
          v-if="showHorizontal"
          ref="card"
          class="flex items-center justify-between gap-3 p-4 rounded-md border border-surface-border bg-surface-page cursor-grab select-none touch-pan-y"
        >
          <div>
            <p class="font-semibold">Research run · landscape-2026-q2</p>
            <p class="text-sm text-text-muted">Swipe left to dismiss, right to reveal actions</p>
          </div>
          <UButton variant="ghost" icon="lucide:dots-vertical" />
        </div>
        <UButton v-else variant="outline" @click="resetHorizontal">Reset row</UButton>
        <p class="text-sm">Last gesture: <code>{{ lastSwipe }}</code></p>
      </div>
    </section>

    <section>
      <p class="eyebrow">vertical · expand / collapse</p>
      <h2 class="heading--bold text-xl font-bold">Swipe-up / swipe-down</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use vertical swipes for "expand to full sheet" / "collapse
        back to peek" interactions on bottom sheets. Direction lock to
        <code>"vertical"</code> ignores diagonal motions.
      </p>
      <div class="mt-4 space-y-3">
        <div
          ref="verticalCard"
          class="p-6 rounded-md border border-surface-border bg-surface-sunken text-center cursor-grab select-none"
        >
          Swipe up or down on this card
        </div>
        <p class="text-sm">Last gesture: <code>{{ lastVerticalSwipe }}</code></p>
      </div>
    </section>
  </div>
</template>
