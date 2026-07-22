<script setup lang="ts">
useHead({ title: "TuxTooltip · TUX" });

const basicVue = `<tux-tooltip text="Last updated 8 minutes ago">
  <tux-button intent="ghost" icon="lucide:refresh-cw" />
</tux-tooltip>`;

const titledVue = `<tux-tooltip
  title="Drift reconciler"
  text="Closes stale index entries every 30 minutes."
>
  <span class="info-anchor">i</span>
</tux-tooltip>`;

const kbdVue = `<tux-tooltip text="Open command palette" :kbds="['⌘', 'K']">
  <tux-button intent="ghost" icon="lucide:command" />
</tux-tooltip>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · help" title="TuxTooltip">
      Keyboard-accessible hover-help. Thin wrapper around
      <code>UTooltip</code> that adds a hairline rule under the
      title and tunes max-width to ~22ch for a comfortable 2–3 line
      body. Show / hide on hover or focus; reka-ui handles edge
      collision and keyboard accessibility.
      <br><br>
      <span class="text-sm text-text-muted">
        For richer floating panels (title + body + CTA + dismiss),
        use <code>TuxTeachingPopover</code> (onboarding) or
        <code>UPopover</code> directly. This is short hover-help only.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Text only</h2>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxTooltip text="Last updated 8 minutes ago">
          <TuxButton intent="ghost" icon="lucide:refresh-cw">Refresh</TuxButton>
        </TuxTooltip>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">title + body</p>
      <h2 class="heading--bold text-xl font-bold">Concept explainer</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Use the <code>title</code> prop when the trigger doesn't name
        the concept by itself — e.g., an <code>(i)</code> icon next to
        a field. The hairline rule under the title is the editorial
        cue.
      </p>
      <TuxExample class="mt-4" :vue="titledVue">
        <span class="info-row">
          Drift reconciler status
          <TuxTooltip
            title="Drift reconciler"
            text="Closes stale index entries every 30 minutes by comparing the live filesystem against the OpenSearch index."
          >
            <span class="info-anchor" tabindex="0">i</span>
          </TuxTooltip>
        </span>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">keyboard shortcut</p>
      <h2 class="heading--bold text-xl font-bold">Shortcut hint</h2>
      <TuxExample class="mt-4" :vue="kbdVue">
        <TuxTooltip text="Open command palette" :kbds="['⌘', 'K']">
          <TuxButton intent="ghost" icon="lucide:command">Palette</TuxButton>
        </TuxTooltip>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.info-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}
.info-anchor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  color: var(--brand-primary);
  font-family: var(--font-bold);
  font-size: 0.7rem;
  font-weight: 700;
  font-style: italic;
  cursor: help;
}
</style>
