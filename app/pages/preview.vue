<script setup lang="ts">
useHead({ title: "Preview specimens · tti-ux" });

// Specimen index. Each entry maps to an HTML file in /public/preview/.
// The HTML files are deliberately framework-free — vanilla CSS, no Vue —
// so they can be lifted into a deck, mock, or third-party doc without
// pulling in Nuxt. They link colors_and_type.css from /public/ so they
// render with the live token values.
//
// Group + height tuning is per-specimen; tall ramps and full-spectrum
// type grids need more vertical room than a one-line button row.
interface Specimen {
  file: string;
  label: string;
  height: number;
}

const groups: { title: string; eyebrow: string; specs: Specimen[] }[] = [
  {
    eyebrow: "type",
    title: "Typography",
    specs: [
      { file: "type-families.html",        label: "Four families",         height: 280 },
      { file: "type-scale.html",           label: "Modular scale",         height: 320 },
      { file: "type-display.html",         label: "Display heading",       height: 200 },
      { file: "type-bold.html",            label: "Bold-style heading",    height: 200 },
      { file: "type-elegant.html",         label: "Elegant-style heading", height: 280 },
      { file: "type-eyebrow.html",         label: "Eyebrow + subhead",     height: 200 },
      { file: "type-mono.html",            label: "Mono — JetBrains",      height: 200 },
      { file: "type-style-variants.html",  label: "Style variants table",  height: 480 },
    ],
  },
  {
    eyebrow: "color",
    title: "Color",
    specs: [
      { file: "color-brand.html",       label: "Brand anchors",       height: 220 },
      { file: "color-semantic.html",    label: "Semantic roles",      height: 220 },
      { file: "color-neutrals.html",    label: "Neutrals",            height: 220 },
      { file: "color-maroon-ramp.html", label: "Maroon ramp (50–950)",height: 260 },
      { file: "color-dark-theme.html",  label: "tti-dark surfaces",   height: 240 },
      { file: "color-hc-theme.html",    label: "tti-hc · WCAG AAA",   height: 240 },
    ],
  },
  {
    eyebrow: "spacing",
    title: "Spacing & elevation",
    specs: [
      { file: "spacing-ramp.html",    label: "4px spacing ramp", height: 220 },
      { file: "spacing-radii.html",   label: "Corner radii",     height: 200 },
      { file: "spacing-shadows.html", label: "Soft elevation",   height: 200 },
    ],
  },
  {
    eyebrow: "components",
    title: "Components",
    specs: [
      { file: "component-buttons.html",        label: "Buttons",        height: 140 },
      { file: "component-alerts.html",         label: "Alerts",         height: 360 },
      { file: "component-badges.html",         label: "Badges",         height: 160 },
      { file: "component-cards.html",          label: "Cards",          height: 320 },
      { file: "component-section-header.html", label: "Section header", height: 220 },
      { file: "component-table.html",          label: "Table",          height: 320 },
      { file: "component-empty-state.html",    label: "Empty state",    height: 280 },
      { file: "component-forms.html",          label: "Form controls",  height: 280 },
    ],
  },
  {
    eyebrow: "brand",
    title: "Brand motifs",
    specs: [
      { file: "brand-logo.html",       label: "Logo placeholder", height: 160 },
      { file: "brand-voice.html",      label: "Voice + casing",   height: 280 },
      { file: "brand-card-hover.html", label: "Card-hover signature", height: 280 },
    ],
  },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="reference" title="Preview specimens">
      Twenty-eight standalone HTML cards, one per token group or component
      pattern, served from <code>/preview/*.html</code>. Each loads
      <code>/colors_and_type.css</code> directly — no Vue, no Nuxt UI — so a
      designer can lift one into a deck or external doc and have it render
      with the live token values. Click any specimen to open the raw HTML in
      a new tab.
    </TuxPageHeader>

    <section v-for="group in groups" :key="group.title" class="space-y-4">
      <p class="eyebrow">{{ group.eyebrow }}</p>
      <h2 class="heading--bold text-2xl font-bold">{{ group.title }}</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <figure
          v-for="spec in group.specs"
          :key="spec.file"
          class="border border-surface-border rounded-md overflow-hidden bg-surface-raised"
        >
          <iframe
            :src="`/preview/${spec.file}`"
            :title="spec.label"
            :height="spec.height"
            class="w-full block border-0"
            loading="lazy"
          />
          <figcaption class="flex items-center justify-between px-3 py-2 border-t border-surface-border text-xs">
            <span class="font-medium text-text-primary">{{ spec.label }}</span>
            <a
              :href="`/preview/${spec.file}`"
              target="_blank"
              rel="noopener"
              class="link-tti font-mono text-text-muted"
            >{{ spec.file }} ↗</a>
          </figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>
