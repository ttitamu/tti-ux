<script setup lang="ts">
useHead({ title: "TuxNewsCollection · TUX" });

const items = [
  {
    date: "2026-04-22",
    category: "Research",
    title: "Twelve-county roadway study reaches 36-month follow-up window",
    dek: "Compliance gains held steady; three of twelve sites also showed measurable reductions in late-night crashes — a secondary outcome the team is investigating.",
    to: "/news/twelve-county-followup",
    tone: "maroon" as const,
  },
  {
    date: "2026-04-08",
    category: "Press release",
    title: "412-mile freight corridor enters second phase of instrumentation",
    dek: "MovementLab announces the next deployment window for continuous-instrumentation sensors across the Texas Triangle freight network.",
    to: "/news/freight-corridor-phase-2",
    tone: "charcoal" as const,
  },
  {
    date: "2026-03-30",
    category: "Event",
    title: "2026 Transportation Symposium · early-bird registration opens",
    dek: "Three-day program at the Rellis Conference Center, May 14–16. Two keynotes, four workshops, and a poster session for graduate students.",
    to: "/events/symposium-2026",
    tone: "gold" as const,
  },
  {
    date: "2026-03-12",
    category: "Research",
    title: "Equity-weighted outcome measures published in Transportation Policy",
    dek: "Park & Okonkwo's framework for equity-weighted DOT performance metrics validated against three years of Texas Triangle data.",
    to: "/news/equity-framework-published",
    tone: "maroon" as const,
  },
];

const exampleVue = `<TuxNewsCollection :items="items" layout="stacked" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxNewsCollection">
      Institutional news-index pattern. Each item: thumbnail + date eyebrow
      + headline + dek + read-more link. Two layouts: <strong>stacked</strong>
      (vertical list, thumb left) for /news landing pages, and
      <strong>grid</strong> (card grid, thumb above) for "recent news"
      sections on a hub. Dates render as <code>&lt;time&gt;</code> with ISO
      <code>datetime</code> attributes.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Stacked · /news index</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxNewsCollection :items="items" layout="stacked" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grid · 3-up</p>
      <h2 class="heading--bold text-xl font-bold">Hub-page "recent news"</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="grid"</code> + <code>:columns="3"</code>. Right
        for landing surfaces where news is one section among many — focus
        areas, factoids, testimonials.
      </p>
      <TuxExample class="mt-4">
        <TuxNewsCollection :items="items" layout="grid" :columns="3" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grid · 2-up</p>
      <h2 class="heading--bold text-xl font-bold">Featured pair</h2>
      <p class="text-sm text-text-secondary mb-3">
        Two-column variant for "featured stories" sections — wider cards,
        more reading room for the dek.
      </p>
      <TuxExample class="mt-4">
        <TuxNewsCollection :items="items.slice(0, 2)" layout="grid" :columns="2" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array. Required.</li>
        <li>Each item — <code>{ date, dateLabel?, title, category?, dek?, to?, href?, image?, alt?, tone? }</code>.</li>
        <li><code>date</code> — ISO date for the <code>datetime</code> attribute. <code>dateLabel</code> overrides the rendered text.</li>
        <li><code>category</code> — eyebrow above title. Common values: "Research", "Event", "Press release".</li>
        <li><code>image</code> — thumbnail URL. If omitted, renders a tone-keyed gradient placeholder.</li>
        <li><code>tone</code> — <code>"maroon" | "gold" | "charcoal"</code> for the placeholder. Cycles automatically.</li>
        <li><code>layout</code> — <code>"stacked" | "grid"</code>. Defaults to <code>"stacked"</code>.</li>
        <li><code>columns</code> — <code>2 | 3</code>. Grid layout only. Defaults to <code>3</code>.</li>
        <li><code>readMore</code> — link label. Defaults to <code>"Read more"</code>.</li>
      </ul>
    </section>
  </div>
</template>
