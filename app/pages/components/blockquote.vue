<script setup lang="ts">
useHead({ title: "TuxBlockquote · TUX" });

const exampleVue = `<TuxBlockquote
  quote="What surprised us was the durability of the effect — three years out, we expected some regression toward baseline. We didn't see it."
  attribution="Dr. R. Hassan"
  role="Principal Investigator, Connected & Automated Vehicles Program"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxBlockquote">
      Standalone editorial pull quote — the focal element of a section, not
      an inline aside. Two layouts: <strong>centered</strong> (default,
      italic body with rules above and below) and
      <strong>drop-cap</strong> (oversized first character, magazine-style).
      For inline quotes interrupting body flow, use
      <code>&lt;TuxCallout kind="quote"&gt;</code> instead.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Centered · default style</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxBlockquote
          quote="What surprised us was the durability of the effect — three years out, we expected some regression toward baseline. We didn't see it."
          attribution="Dr. R. Hassan"
          role="Principal Investigator, Connected & Automated Vehicles Program"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">drop-cap</p>
      <h2 class="heading--bold text-xl font-bold">Magazine-style hero quote</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>layout="drop-cap"</code>. First character renders
        oversized in brand color, rest of the quote flows beside it.
        Reserve for hero / landing surfaces.
      </p>
      <TuxExample class="mt-4">
        <TuxBlockquote
          layout="drop-cap"
          quote="Treatment outcomes from twelve rural intersections, measured through 36 months of post-construction observation, point to enduring infrastructure cues rather than novelty effects."
          attribution="Hassan et al."
          role="Transportation Research Record · Vol. 2671 · 2025"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant rule + face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default + elegant use Georgia italic; bold uses Work Sans uppercase.
        The signature rule above and below changes per variant — gradient
        hairline, stacked bars, or diagonal hash.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-12">
          <TuxBlockquote
            variant="default"
            quote="The most lasting product of TTI is not the technology — it's the people who learn to think about transportation differently."
            attribution="Director Emeritus"
            role="Annual Report · 2025"
          />
          <TuxBlockquote
            variant="bold"
            quote="Twelve counties, three field seasons, one method."
            attribution="J. Hassan"
            role="Q3 Field Symposium"
          />
          <TuxBlockquote
            variant="elegant"
            quote="What three years of follow-up data is telling us is that the treatments work — and they work in ways we didn't predict."
            attribution="L. Velazquez"
            role="Senior Research Scientist · CAV Program"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>quote</code> — the quote text. Required.</li>
        <li><code>attribution</code> — speaker name, ALL-CAPS tracked-out. Optional.</li>
        <li><code>role</code> — speaker role / affiliation. Optional.</li>
        <li><code>layout</code> — <code>"centered" | "drop-cap"</code>. Defaults to <code>"centered"</code>.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>.</li>
      </ul>
    </section>
  </div>
</template>
