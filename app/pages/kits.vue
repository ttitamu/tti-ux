<script setup lang="ts">
useHead({ title: "Reference kits · tti-ux" });

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
    blurb: "Exhaustive ~57-family catalog organized into Foundations, Navigation, Components, Specialized, Templates. Mirrors the Texas A&M Marcom + TTI structure. Most families have all three style variants (default / bold / elegant) demonstrated. The richest reference; consult before designing a new pattern.",
  },
  {
    slug: "pecan",
    eyebrow: "app shape",
    label: "PECAN",
    blurb: "The institute's sensitive-data classifier — sidebar nav, scans/classifiers/indices pages, compliance alerts, status badges, classifier catalog cards. The data-density end of the system: how tux composes into a research-IT product surface.",
  },
  {
    slug: "tti-docs",
    eyebrow: "app shape",
    label: "tti-docs",
    blurb: "The living style guide itself, rebuilt as a click-thru artifact — display-italic hero, foundations grid, BigStat institutional brag-numbers, a footer-mounted high-contrast (tti-hc) toggle. The editorial / marketing end of the system.",
  },
  {
    slug: "tti-ai-chat",
    eyebrow: "app shape",
    label: "tti-ai-chat",
    blurb: "Internal LLM chat for research staff — conversation list grouped by day, ITAR-tier compliance banner over the composer, citations block on every assistant turn, right-rail context panel with corpus / retrieval / usage stats. Shows tux primitives in a chat product context.",
  },
  {
    slug: "slides",
    eyebrow: "deck system",
    label: "Slides kit",
    blurb: "A deck-stage slide system in plain HTML — title slide, content slides, factoid slide, quote slide, closer. Use as a starting point for TTI presentations that need to look like the rest of the system, not like generic PowerPoint.",
  },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="reference" title="Reference kits">
      Five static reference artifacts served from <code>/kits/&lt;name&gt;/</code>.
      They predate the Nuxt repo and were carried over as design source: the
      AggieUX component catalog, three application shells (PECAN, tti-docs,
      tti-ai-chat), and a deck-stage slide system. All five render in
      vanilla CSS + React via Babel-in-the-browser — no build step — and
      pull <code>/colors_and_type.css</code> so they reflect the live tokens.
      Use them to see how patterns compose; the production-grade equivalents
      live in the <code>Tux*</code> components.
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
        <h3 class="text-xl font-bold mt-1">{{ kit.label }}</h3>
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
