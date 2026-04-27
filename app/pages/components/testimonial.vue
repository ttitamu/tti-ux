<script setup lang="ts">
useHead({ title: "TuxTestimonial · tti-ux" });

const testimonials = [
  { quote: "Engineering-only treatments rarely hold past 24 months — this one is doing something different.", name: "Dr. Lina Hassan", role: "Principal Investigator · Roadway Safety", color: "maroon" as const },
  { quote: "The before/after framework is finally giving us answers that survive replication. That hasn't always been true.", name: "Marcus Reilly", role: "Field Research Coordinator", color: "navy" as const },
  { quote: "We needed equity-weighted outcomes to be a first-class measurement, not a footnote on the executive summary.", name: "Dr. Imani Park", role: "Director, Center for Transportation Equity", color: "gold" as const },
  { quote: "What surprised us most was how much the corridor-level data changed our intuitions about what counts as risky driving.", name: "Sarah Okonkwo", role: "Senior Data Engineer · MovementLab", color: "maroon" as const },
];

const exampleVue = `<TuxTestimonial :items="testimonials" :columns="3" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxTestimonial">
      Collection of attributed quotes with portrait + name + role. Two
      layouts: <strong>grid</strong> (cards, 2 or 3 columns — landing pages,
      "what people say" sections) and <strong>row</strong> (denser
      horizontal stack — editorial pages). Portraits use a circular
      gradient placeholder by default; pass <code>image</code> per item to
      use a real photo.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Grid · 3-up</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxTestimonial :items="testimonials" :columns="3" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">grid · 2-up</p>
      <h2 class="heading--bold text-xl font-bold">Wider cards</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:columns="2"</code> for fewer, wider cards — useful when
        the quotes are longer or the section needs to breathe.
      </p>
      <TuxExample class="mt-4">
        <TuxTestimonial :items="testimonials.slice(0, 2)" :columns="2" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">row layout</p>
      <h2 class="heading--bold text-xl font-bold">Editorial stack</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="row"</code>. Larger portraits, italic quote body,
        hairline separators between rows. Right for editorial pages where
        density matters more than visual hierarchy.
      </p>
      <TuxExample class="mt-4">
        <TuxTestimonial :items="testimonials" layout="row" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant body face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default = Open Sans upright. Bold = Open Sans italic. Elegant =
        Georgia italic.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxTestimonial variant="default" :items="testimonials.slice(0, 2)" :columns="2" />
          <TuxTestimonial variant="bold"    :items="testimonials.slice(2, 4)" :columns="2" />
          <TuxTestimonial variant="elegant" :items="testimonials.slice(0, 2)" :columns="2" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array. Required.</li>
        <li>Each item — <code>{ quote, name, role?, initial?, color?, image? }</code>.</li>
        <li><code>color</code> — <code>"maroon" | "gold" | "navy"</code> for the portrait gradient. Cycles automatically if omitted.</li>
        <li><code>image</code> — real portrait URL. Overrides the initial placeholder.</li>
        <li><code>layout</code> — <code>"grid" | "row"</code>. Defaults to <code>"grid"</code>.</li>
        <li><code>columns</code> — <code>2 | 3</code>. Grid layout only. Defaults to <code>3</code>.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>.</li>
      </ul>
    </section>
  </div>
</template>
