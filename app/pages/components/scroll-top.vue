<script setup lang="ts">
useHead({ title: "TuxScrollTop · TUX" });

const basicVue = `<tux-scroll-top :threshold="120" position="bottom-right" />`;

const stackedVue = `<!-- Coexists cleanly with a bottom-right floating chat widget or assistant trigger -->
<tux-scroll-top :threshold="100" position="bottom-right-stacked" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · navigation" title="TuxScrollTop">
      EmDash-inspired circular reading-progress button. As readers scroll down a long
      document or report, the SVG radial stroke smoothly loads clockwise from 0% to 100%.
      Once activated via click or keyboard, it smoothly returns the viewport to the top.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">interactive preview</p>
      <h2 class="text-xl font-bold">Radial progress ring &amp; return to top</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <div class="p-8 border border-surface-border rounded-xl bg-surface-raised flex flex-col items-center justify-center gap-4 text-center">
          <p class="text-sm text-text-secondary max-w-md">
            The button floats fixed in the viewport (look in the bottom right corner of your browser window as you scroll down this page).
            Below is an inline demo of the 48px circular radial indicator:
          </p>
          <div class="flex items-center gap-6 p-4 rounded-xl border border-surface-border bg-surface-sunken">
            <div class="w-12 h-12 flex items-center justify-center filter drop-shadow-md text-text-primary">
              <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="var(--surface-raised)" />
                <circle cx="24" cy="24" r="20.5" fill="none" stroke="var(--surface-border)" stroke-width="2.5" opacity="0.8" />
                <circle cx="24" cy="24" r="20.5" fill="none" stroke="var(--brand-primary)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="128.8" stroke-dashoffset="40" transform="rotate(-90 24 24)" />
                <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="24" y1="17.5" x2="24" y2="31.5" />
                  <polyline points="18.5 23.5, 24 17.5, 29.5 23.5" fill="none" />
                </g>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-text-primary">68% Document Read</p>
              <p class="text-xs text-text-muted">Touch target: 48×48px · WCAG AAA</p>
            </div>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">coexistence with assistant</p>
      <h2 class="text-xl font-bold">Stacked positioning for floating widgets</h2>
      <TuxExample class="mt-4" :vue="stackedVue">
        <div class="p-6 border border-surface-border rounded-xl bg-surface-raised space-y-3">
          <p class="text-sm text-text-secondary">
            When paired with floating triggers like <code>TuxChatBubble</code> or an institutional assistant launcher,
            set <code>position="bottom-right-stacked"</code>. This lifts the button to <code>bottom: 5.5rem</code> so the two controls
            stack vertically in perfect harmony without collisions.
          </p>
          <div class="flex items-center gap-3 text-xs font-mono text-text-muted">
            <span class="px-2 py-1 rounded bg-surface-sunken border border-surface-border">bottom: 5.5rem (ScrollTop)</span>
            <span>+</span>
            <span class="px-2 py-1 rounded bg-surface-sunken border border-surface-border">bottom: 1.75rem (ChatBubble)</span>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">accessibility</p>
      <h2 class="text-xl font-bold">WCAG 2.2 Level AAA compliance</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-5 border border-surface-border rounded-xl bg-surface-raised space-y-1.5">
          <p class="font-bold text-sm text-text-primary">Target Size</p>
          <p class="text-xs text-text-secondary">48×48px physical geometry comfortably exceeds the 44×44px Level AAA minimum.</p>
        </div>
        <div class="p-5 border border-surface-border rounded-xl bg-surface-raised space-y-1.5">
          <p class="font-bold text-sm text-text-primary">Reduced Motion</p>
          <p class="text-xs text-text-secondary">Queries <code>prefers-reduced-motion</code>: scrolls instantly without vestibular stress when requested.</p>
        </div>
        <div class="p-5 border border-surface-border rounded-xl bg-surface-raised space-y-1.5">
          <p class="font-bold text-sm text-text-primary">ARIA State</p>
          <p class="text-xs text-text-secondary">Carries <code>aria-valuenow</code> reporting scroll percentage and explicit descriptive labeling.</p>
        </div>
      </div>
    </section>
  </div>
</template>
