<script setup lang="ts">
useHead({ title: "Reference kits · TUX" });

// Static reference kits — lifted wholesale from the portable design-system
// download. They render in vanilla CSS + React (Babel-in-the-browser, no
// build step) and link `/colors_and_type.css` so they show the live token
// values. Treat them as design source, not production code: the production
// equivalents are the Tux*.vue components.

interface Kit {
  slug: string;
  label: string;
  eyebrow: string;
  blurb: string;
}

const kits: Kit[] = [
  {
    slug: "aggieux",
    eyebrow: "component catalog",
    label: "AggieUX",
    blurb: "Reference catalog organized into Foundations, Navigation, Components, Specialized, and Templates across default, bold, and elegant style variants.",
  },
  {
    slug: "landscape",
    eyebrow: "app shape",
    label: "Landscape",
    blurb: "The institute's sensitive-data classifier (Landscape) — sidebar nav, scans/classifiers/indices pages, compliance alerts, status badges, classifier catalog cards.",
  },
  {
    slug: "tti-docs",
    eyebrow: "app shape",
    label: "tti-docs",
    blurb: "The living style guide rebuilt as a reference artifact — editorial hero, foundations grid, key institutional metrics, and footer-mounted high-contrast toggle.",
  },
  {
    slug: "tti-ai-chat",
    eyebrow: "app shape",
    label: "tti-ai-chat",
    blurb: "Internal chat interface for research staff — conversation list grouped by day, compliance banner, citations block, and context panel.",
  },
  {
    slug: "slides",
    eyebrow: "deck system",
    label: "Slides kit",
    blurb: "A slide presentation template in plain HTML — title slide, content slides, factoid slide, quote slide, and summary layout.",
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="reference" title="Reference kits">
      Five static reference artifacts served from <code>/kits/&lt;name&gt;/</code>.
      These prototypes illustrate pattern composition for application shells (Landscape,
      tti-docs, tti-ai-chat) and presentation templates. Production implementations
      should use the native <code>Tux*</code> components.
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        v-for="kit in kits"
        :key="kit.slug"
        :href="`/kits/${kit.slug}/index.html`"
        target="_blank"
        rel="noopener"
        class="card-linked p-6"
      >
        <p class="eyebrow">{{ kit.eyebrow }}</p>
        <h2 class="text-xl font-bold mt-1">{{ kit.label }}</h2>
        <p class="mt-2 text-sm text-text-secondary leading-relaxed">{{ kit.blurb }}</p>
        <p class="mt-3 font-mono text-xs text-text-muted">/kits/{{ kit.slug }}/ ↗</p>
      </a>
    </section>

    <section>
      <p class="eyebrow">when to use</p>
      <h2 class="heading--bold text-xl font-bold">Reference kits vs Tux components</h2>
      <p class="mt-3 text-sm text-text-secondary leading-relaxed max-w-3xl">
        The kits are <strong>frozen reference</strong> — they encode design
        decisions but they're not what you import in production. New
        consumers pull from the live Vue components under
        <code>app/components/Tux*.vue</code>; designers and reviewers consult
        the kits to see what an end-state surface should feel like. If a
        kit and a Tux component disagree, the Tux component wins — the
        kits date from the portable-download phase and don't get
        line-by-line updates.
      </p>
    </section>
  </div>
</template>
