<script setup lang="ts">
useHead({ title: "TuxMediaSlab · TUX" });

const exampleVue = `<TuxMediaSlab
  eyebrow="Field deployment"
  title="412 miles of continuously-instrumented freight corridor"
  dek="The Texas Triangle's monitored network came online during Q3 2025. Real-time corridor data feeds both safety research and operational decisions."
  tone="maroon"
>
  <template #actions>
    <TuxButton intent="primary">Read the field report</TuxButton>
    <TuxButton intent="ghost">Watch the deployment video</TuxButton>
  </template>
</TuxMediaSlab>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxMediaSlab">
      Full-bleed hero band — the "big photo moment". Edge-to-edge image,
      one headline, minimal copy. Use at the top of feature pages,
      between major sections, or as the first impression on a research-
      program landing. For a band of multiple cards, use
      <code>TuxCardSlab</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Overlay · standard height</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxMediaSlab
          eyebrow="Field deployment"
          title="412 miles of continuously-instrumented freight corridor"
          dek="The Texas Triangle's monitored network came online during Q3 2025. Real-time corridor data feeds both safety research and operational decisions."
          tone="maroon"
        >
          <template #actions>
            <TuxButton intent="primary">Read the field report</TuxButton>
            <TuxButton intent="ghost">Watch the deployment video</TuxButton>
          </template>
        </TuxMediaSlab>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">split layout</p>
      <h2 class="heading--bold text-xl font-bold">Image left, copy right</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="split"</code>. Two columns at ≥60rem; stacks at
        narrower viewports. Use <code>imageSide="left"</code> or <code>"right"</code>
        to pick the photo placement.
      </p>
      <TuxExample class="mt-4">
        <TuxMediaSlab
          layout="split"
          imageSide="left"
          eyebrow="Roadway safety"
          title="Twelve-county roadway treatment study"
          dek="Compliance gains held steady through the 36-month follow-up window. Three of twelve treated sites also showed measurable reductions in late-night crashes."
          tone="charcoal"
        >
          <template #actions>
            <TuxButton intent="primary">Browse findings</TuxButton>
          </template>
        </TuxMediaSlab>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">heights</p>
      <h2 class="heading--bold text-xl font-bold">tall / standard / short</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>tall</code> (32rem) for landing-page openers, <code>standard</code>
        (24rem, default) for between-section breaks, <code>short</code> (16rem)
        for inline hero accents.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxMediaSlab
            height="tall"
            eyebrow="Tall · 32rem"
            title="Landing-page opener"
            tone="maroon"
          />
          <TuxMediaSlab
            height="short"
            eyebrow="Short · 16rem"
            title="Inline hero accent"
            dek="Brief headline, small section break."
            tone="gold"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>title</code> — headline. Required.</li>
        <li><code>src</code> + <code>alt</code> — image. If omitted, renders a tone-keyed gradient placeholder.</li>
        <li><code>eyebrow</code>, <code>dek</code> — optional text rhythm.</li>
        <li><code>layout</code> — <code>"overlay" | "split"</code>. Defaults to <code>"overlay"</code>.</li>
        <li><code>imageSide</code> — <code>"left" | "right"</code>. Split layout only.</li>
        <li><code>height</code> — <code>"tall" | "standard" | "short"</code>.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "charcoal"</code>. Placeholder gradient tone.</li>
        <li><code>#actions</code> slot — buttons or link list below the dek.</li>
      </ul>
    </section>
  </div>
</template>
