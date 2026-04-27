<script setup lang="ts">
useHead({ title: "TuxCardSlab · tti-ux" });

const programCards = [
  { eyebrow: "Program", title: "Connected & Automated Vehicles", to: "/research/cav",     tone: "maroon" as const },
  { eyebrow: "Program", title: "Roadway Safety",                  to: "/research/safety", tone: "charcoal" as const },
  { eyebrow: "Program", title: "Mobility & Economics",            to: "/research/mobility", tone: "gold" as const },
];

const exampleVue = `<TuxCardSlab
  eyebrow="Research"
  heading="Browse our programs"
  :cards="programCards"
  :columns="3"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCardSlab">
      Full-bleed band of media-forward cards. The "browse our programs" /
      "explore the research" pattern — image-led cards with overlay
      title, optional eyebrow, whole-card click. Distinct from
      <code>TuxPhotoGrid</code> (caption-forward) and
      <code>TuxNewsCollection</code> grid (copy-forward) — this one is
      image-forward with minimal text.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Three programs · 4:5 portrait</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxCardSlab
          eyebrow="Research"
          heading="Browse our programs"
          :cards="programCards"
          :columns="3"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">aspect ratios</p>
      <h2 class="heading--bold text-xl font-bold">3:4 portrait / 4:5 / 1:1</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pick the aspect ratio that matches the source imagery and the
        density target — taller = more drama, square = more cards-per-row.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxCardSlab :cards="programCards" :columns="3" aspect="3/4" />
          <TuxCardSlab :cards="programCards" :columns="3" aspect="1/1" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">4-up</p>
      <h2 class="heading--bold text-xl font-bold">Four-card slab</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:columns="4"</code> for "all programs" / "all centers"
        bands. Cards are tighter; consider 1:1 aspect to keep them
        readable.
      </p>
      <TuxExample class="mt-4">
        <TuxCardSlab
          heading="All centers"
          :columns="4"
          aspect="1/1"
          :cards="[
            { eyebrow: 'Center', title: 'Connected Vehicles',            to: '/center/cav',     tone: 'maroon' },
            { eyebrow: 'Center', title: 'Transportation Safety',         to: '/center/safety',  tone: 'charcoal' },
            { eyebrow: 'Center', title: 'Mobility & Economics',          to: '/center/mobility', tone: 'gold' },
            { eyebrow: 'Center', title: 'Transportation Equity',         to: '/center/equity',  tone: 'maroon' },
          ]"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + card shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>cards</code> — array of <code>{ title, eyebrow?, image?, alt?, to?, href?, tone? }</code>.</li>
        <li><code>columns</code> — <code>2 | 3 | 4</code>. Defaults to <code>3</code>.</li>
        <li><code>aspect</code> — <code>"3/4" | "1/1" | "4/5"</code>. Defaults to <code>"4/5"</code>.</li>
        <li><code>heading</code> + <code>eyebrow</code> — optional band header above the cards.</li>
        <li><code>tone</code> — placeholder gradient tone (cycles maroon/charcoal/gold).</li>
        <li><code>to</code> / <code>href</code> — internal/external link. Whole card becomes clickable with corner-drop hover + reveal arrow.</li>
      </ul>
    </section>
  </div>
</template>
