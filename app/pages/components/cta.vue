<script setup lang="ts">
useHead({ title: "TuxCTA · TUX" });

const exampleVue = `<TuxCTA
  eyebrow="get started"
  title="Point PECAN at your first directory"
  dek="Five minutes, no commitment, runs entirely in your tenant."
>
  <template #actions>
    <TuxButton intent="primary" size="lg">Start scan</TuxButton>
    <TuxButton intent="ghost"   size="lg">Read the docs</TuxButton>
  </template>
</TuxCTA>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCTA">
      The loudest editorial surface short of a page header. Solid-color
      block, oversized heading, action area on the right (stacks below on
      narrow viewports). Use sparingly — it's meant to interrupt. Three
      tones: <strong>maroon</strong> (canonical), <strong>gold</strong>
      (friendlier), <strong>neutral</strong> (info-only).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Maroon · primary CTA</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxCTA
          eyebrow="get started"
          title="Point PECAN at your first directory"
          dek="Five minutes, no commitment, runs entirely in your tenant."
        >
          <template #actions>
            <TuxButton intent="primary" size="lg">Start scan</TuxButton>
            <TuxButton intent="ghost"   size="lg">Read the docs</TuxButton>
          </template>
        </TuxCTA>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">tones</p>
      <h2 class="heading--bold text-xl font-bold">Maroon / gold / neutral</h2>
      <p class="text-sm text-text-secondary mb-3">
        Maroon for primary calls. Gold for secondary, friendly framings
        ("subscribe", "join the cohort"). Neutral for informational blocks
        that need a CTA but shouldn't shout.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxCTA
            tone="maroon"
            eyebrow="ship it"
            title="Build production surfaces with tux"
            dek="Eleven Tux components, three style variants, themeable per institution."
          >
            <template #actions>
              <TuxButton intent="primary" size="lg">Browse components</TuxButton>
            </template>
          </TuxCTA>

          <TuxCTA
            tone="gold"
            eyebrow="stay current"
            title="Quarterly research bulletin, in your inbox"
            dek="Three-paragraph summaries of our most-read reports. No marketing copy, no upsell."
          >
            <template #actions>
              <TuxButton intent="primary" size="lg">Subscribe</TuxButton>
            </template>
          </TuxCTA>

          <TuxCTA
            tone="neutral"
            eyebrow="reference"
            title="Token + theme documentation"
            dek="The authoritative source for color, typography, and spacing across all tux consumers."
          >
            <template #actions>
              <TuxButton intent="secondary" size="lg">View tokens</TuxButton>
            </template>
          </TuxCTA>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant heading face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default = Oswald (italic uppercase, gold-bar). Bold = Work Sans 800
        with stacked-bar punctuation. Elegant = Georgia italic.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxCTA variant="default" eyebrow="default" title="Editorial flagship — Oswald display"
                  dek="The most common framing. Reads as institutional, not promotional." />
          <TuxCTA variant="bold" eyebrow="bold" title="Athletic flagship — Work Sans bold"
                  dek="Mixed-case, heavy weight. Right for events and student-facing surfaces." />
          <TuxCTA variant="elegant" tone="neutral" eyebrow="elegant" title="Refined flagship — Georgia italic"
                  dek="Mixed-case serif. Right for research bulletins and policy announcements." />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + slots</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>title</code> — headline. Required.</li>
        <li><code>eyebrow</code> — tracked-out lead-in. Optional.</li>
        <li><code>dek</code> — one- or two-sentence description. Optional.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "neutral"</code>. Defaults to <code>"maroon"</code>.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>.</li>
        <li>Default slot — richer body content (replaces <code>dek</code> when present).</li>
        <li><code>#actions</code> slot — buttons, form, or link list. Sits in the right column on ≥48rem viewports, stacked below otherwise.</li>
      </ul>
    </section>
  </div>
</template>
