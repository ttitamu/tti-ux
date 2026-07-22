<script setup lang="ts">
import pkg from "../../package.json";

useHead({ title: "Getting started · TUX" });

const version = pkg.version;

// Step-by-step onboarding for new visitors. The home page is a
// landing/marketing surface; this page is the actual "what is tux,
// how do I use it, where do I go next" tour. Six sections matched
// to the six sidebar groups + the three product shapes tux serves.
const steps = [
  {
    n: 1,
    title: "Install + run",
    body: "Clone the repo, npm install, npm run dev. Every page under /components is a live demo rendered by the same component your app imports.",
  },
  {
    n: 2,
    title: "Read the manifesto",
    body: "Doctrine (/design/tux) frames what tux is for, what it deliberately is not, and the editorial-research voice that shows up in tokens, motion, and copy.",
  },
  {
    n: 3,
    title: "Skim the catalog",
    body: "Components (/components) lists every Tux* in the system. Tightly-coupled clusters (research-publishing, TTI identity, geospatial, forms wrapper) share a single demo route.",
  },
  {
    n: 4,
    title: "See it composed",
    body: "Examples (/examples) shows six real-shape pages — Landscape dashboard, research-program landing, tti-ai-studio session, research paper, TTI center landing, sidebar shell. Each composes 9-15 Tux* components.",
  },
  {
    n: 5,
    title: "Pin a release",
    body: "Add `extends: [\"github:ttitamu/tti-ux#v" + version + "\"]` to your consuming app's nuxt.config.ts. You get auto-imports, tokens, themed Nuxt UI, and the markdown pipeline.",
  },
  {
    n: 6,
    title: "Ship + report regressions",
    body: "File issues against the GitHub repo. CHANGELOG.md is the canonical history; the home page's recent-updates feed is the glance-able version.",
  },
];

// Product-shape map — answers the question "what do I build this
// system into?" The same three shapes are called out in tux.md and
// the /examples landing copy.
const productShapes = [
  {
    icon: "lucide:layout-dashboard",
    title: "Data-dense IT chrome",
    body: "Landscape (sensitive-data classifier, formerly PECAN). Sidebar shell + KPI rows + treemap + faceted search + activity rail. Operational density at editorial-research quality.",
    example: { label: "Landscape dashboard", to: "/examples/landscape-dashboard" },
  },
  {
    icon: "lucide:newspaper",
    title: "Marketing / research surfaces",
    body: "Public-facing program landings, center identity pages, published papers. Hero rhythm, factoids, testimonials, blockquotes, identity primitives, full author-byline + citation-export.",
    example: { label: "Research-program landing", to: "/examples/research-landing" },
  },
  {
    icon: "lucide:bot",
    title: "Chat / agent product views",
    body: "tti-ai-studio. ChatMessage with tool calls + artifacts + branch nav + citations + context meter + composer + suggestion chips. All the AI-surface idioms TUX absorbed from Vercel + Fluent + OpenAI/Anthropic.",
    example: { label: "tti-ai-studio session", to: "/examples/tti-ai-studio-session" },
  },
];

// Component family map — six clusters that tightly couple. The other
// ~100 components are listed individually in the sidebar; these are
// the ones where reading them together is the point.
const componentFamilies = [
  {
    eyebrow: "research-publishing",
    title: "Editorial-research paper",
    blurb: "Abstract · AuthorByline · PaperMeta · FigureCaption · TableCaption · Footnote · CitationExport · Acknowledgments. The published-paper shape.",
    to: "/components/research-publishing",
    count: 8,
  },
  {
    eyebrow: "tti-identity",
    title: "TTI identity / brand",
    blurb: "Researcher · Lab · Program · FundingSource · CenterBadge. The institutional-identity surfaces that map directly to TTI organizational structure.",
    to: "/components/tti-identity",
    count: 5,
  },
  {
    eyebrow: "geospatial",
    title: "Maps + corridors",
    blurb: "MapEmbed · MapLegend · MapMarker · CorridorStrip. Closes the Priority B geospatial roadmap section.",
    to: "/components/geospatial",
    count: 4,
  },
  {
    eyebrow: "forms-wrapper",
    title: "Form composition layer",
    blurb: "FormField · MarkdownEditor · FileDropzone · ValidationSummary · ConfirmDialog. The TUX wrapper above Nuxt UI form primitives.",
    to: "/components/forms-wrapper",
    count: 5,
  },
  {
    eyebrow: "charts",
    title: "Native chart family",
    blurb: "Line · Bar · Area · Scatter · Donut · Gauge · Geographic · Sunburst · Sparkline. Native SVG rendering with maroon-led palette and reduced-motion-safe entrance animations.",
    to: "/visualizations",
    count: 9,
  },
  {
    eyebrow: "platform-aware",
    title: "Tauri app-shell primitives",
    blurb: "AppFrame · MenuBar · SplashScreen · TabBar · FAB · FocusView · AppSwitcher · SplitPane. Plus useTuxPlatform() + useTuxSwipe() + useTuxRipple().",
    to: "/design/platform-awareness",
    count: 8,
  },
];

// Doctrine docs — the design/ directory. Ten files. Listed in the
// order a newcomer should read them.
const doctrineDocs = [
  { to: "/design/tux",                       label: "Doctrine",             blurb: "The manifesto. What tux is for, deliberately is not." },
  { to: "/design/components",                label: "Components",           blurb: "Doctrine + the full pattern-coverage map." },
  { to: "/design/compositions",              label: "Compositions",         blurb: "\"X + Y composes more value than they do alone.\" Seven composition patterns." },
  { to: "/design/palette",                   label: "Palette",              blurb: "Visual identity — maroon-led palette across three themes." },
  { to: "/design/chart-foundations",         label: "Chart foundations",    blurb: "Axis/grid/legend tokens, value-label placement, brush selectors, alt-text patterns." },
  { to: "/design/platform-awareness",        label: "Platform awareness",   blurb: "Tauri / multi-platform doctrine. \"One tree, platform-adaptive at the chrome layer.\"" },
  { to: "/design/tauri-bindings",            label: "Tauri bindings",       blurb: "Which Tux* components call which Tauri APIs + capability allowlist template." },
  { to: "/design/visual-language-evolution", label: "Visual language",      blurb: "Token-only refresh notes — two-ring focus, transportation-tempo easings, four-tier elevation." },
  { to: "/design/roadmap",                   label: "Roadmap",              blurb: "What's shipped, what's deferred, what's carry-forward." },
];

// Example pages — six composition surfaces.
const examplePages = [
  { to: "/examples/landscape-dashboard",   eyebrow: "product · IT-facing",       title: "Landscape dashboard",    components: 15 },
  { to: "/examples/research-landing",      eyebrow: "marketing · public",        title: "Research-program landing", components: 10 },
  { to: "/examples/tti-ai-studio-session", eyebrow: "product · chat",            title: "tti-ai-studio session",  components: 9  },
  { to: "/examples/sidebar-shell",         eyebrow: "layout · app shell",        title: "Sidebar shell",          components: 5  },
  { to: "/examples/paper-page",            eyebrow: "publishing · academic",     title: "Research paper",         components: 12 },
  { to: "/examples/center-landing",        eyebrow: "marketing · TTI identity",  title: "TTI center landing",     components: 8  },
];

// Long-form strings pulled out of the template — keeps the attributes
// clean and side-steps the HTML-attribute-vs-JS-template-literal
// escaping mess for code snippets containing double quotes.
const factoidTitle = `tti-ux v${version}`;
const installSnippet = [
  "git clone https://github.com/ttitamu/tti-ux.git",
  "cd tti-ux",
  "npm install",
  "npm run dev",
  "# → http://localhost:3030",
].join("\n");
const consumeSnippet = [
  "// nuxt.config.ts of the consuming app",
  "export default defineNuxtConfig({",
  `  extends: ["github:ttitamu/tti-ux#v${version}"],`,
  "});",
].join("\n");
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader
      eyebrow="welcome"
      title="Getting started"
      rhythm="hero"
    >
      A six-step tour through what tux is, how to consume it, and where
      to go next. New visitors should read this top-to-bottom; returning
      visitors will skim the sections that changed.
      <template #actions>
        <TuxButton intent="primary" to="/components">Browse the catalog</TuxButton>
        <TuxButton intent="ghost" to="/design/tux">Read the manifesto</TuxButton>
      </template>
    </TuxPageHeader>

    <!-- Quick-fact strip — the three numbers that frame the system. -->
    <section>
      <TuxFactoid
        variant="default"
        :density="3"
        :items="[
          { value: '130+', label: 'Tux* components + 5 composables. All auto-imported.' },
          { value: '6',    label: 'Real-shape composition examples across three product surfaces.' },
          { value: '3',    label: 'Themes shipped (light · dark · WCAG AAA high-contrast).' },
        ]"
        eyebrow="At a glance"
        :title="factoidTitle"
      />
    </section>

    <!-- The six-step tour. -->
    <section class="space-y-4">
      <TuxSectionHeader>Six-step tour</TuxSectionHeader>
      <ol class="gs-steps">
        <li
          v-for="step in steps"
          :key="step.n"
          class="gs-step"
        >
          <span class="gs-step__n" aria-hidden="true">{{ step.n }}</span>
          <div class="gs-step__body">
            <h3 class="gs-step__title">{{ step.title }}</h3>
            <p class="gs-step__copy">{{ step.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- Install + run as the first concrete how-to. -->
    <section class="space-y-3">
      <TuxSectionHeader>1 · Install + run</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Local dev surfaces every component at
        <code>http://localhost:3030</code>. The dev server hot-reloads
        on token edits, component edits, and showcase-page edits alike.
      </p>
      <TuxCodeBlock
        :code="installSnippet"
        language="sh"
        filename="terminal"
      />
    </section>

    <!-- Three product shapes. -->
    <section class="space-y-4">
      <TuxSectionHeader>2 · Three product shapes</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        tux serves three concurrent product surfaces at TTI. Each
        example here demonstrates one shape end-to-end so consumers
        can see the system stretched in the direction they care about.
      </p>
      <TuxIconFeature :items="productShapes" :columns="3" />
    </section>

    <!-- Component family map. -->
    <section class="space-y-4">
      <TuxSectionHeader>3 · Component families</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Six tightly-coupled clusters where reading the components
        <em>together</em> is the point. The remaining ~95 components
        are listed individually in the sidebar.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TuxCard
          v-for="family in componentFamilies"
          :key="family.to"
          :to="family.to"
        >
          <p class="eyebrow">{{ family.eyebrow }}</p>
          <h3 class="text-lg font-bold">{{ family.title }}</h3>
          <p class="mt-2 text-sm text-text-secondary leading-relaxed">{{ family.blurb }}</p>
          <p class="mt-3 font-mono text-xs text-text-muted">
            {{ family.count }} components
          </p>
        </TuxCard>
      </div>
    </section>

    <!-- Examples. -->
    <section class="space-y-4">
      <TuxSectionHeader>4 · Examples</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Six real-shape pages that assemble 5-15 Tux* components into
        a realistic surface. Illustrative data, real composition rhythm.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TuxCard
          v-for="ex in examplePages"
          :key="ex.to"
          :to="ex.to"
        >
          <p class="eyebrow">{{ ex.eyebrow }}</p>
          <h3 class="text-base font-bold">{{ ex.title }}</h3>
          <p class="mt-3 font-mono text-xs text-text-muted">
            {{ ex.components }} Tux* components
          </p>
        </TuxCard>
      </div>
    </section>

    <!-- Doctrine + design docs. -->
    <section class="space-y-4">
      <TuxSectionHeader>5 · Doctrine docs</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Nine narrative design documents under
        <code>design/</code>, plus the canonical
        <code>tokens.json</code> source. Read in the order below to
        get the full mental model.
      </p>
      <TuxLinkList
        :columns="3"
        :groups="[
          {
            heading: 'Read first',
            items: doctrineDocs.slice(0, 3).map(d => ({ label: d.label, to: d.to, description: d.blurb })),
          },
          {
            heading: 'Then',
            items: doctrineDocs.slice(3, 6).map(d => ({ label: d.label, to: d.to, description: d.blurb })),
          },
          {
            heading: 'Reference',
            items: doctrineDocs.slice(6).map(d => ({ label: d.label, to: d.to, description: d.blurb })),
          },
        ]"
      />
    </section>

    <!-- Theming. -->
    <section class="space-y-3">
      <TuxSectionHeader>6 · Theming</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Three themes ship: <code>tti</code> (default light),
        <code>tti-dark</code> (warm-charcoal dark), and
        <code>tti-hc</code> (WCAG AAA high-contrast). Toggle via the
        chrome controls or set <code>data-theme</code> on
        <code>&lt;html&gt;</code>. A sister institution themes by
        adding a <code>[data-theme="&lt;name&gt;"]</code> block to
        <code>app/assets/css/tokens.css</code> overriding only the
        <code>--brand-*</code> slots — no fork required.
      </p>
      <TuxCallout intent="info" title="Why three themes, not two?">
        Dark mode is an aesthetic preference. High-contrast is an
        accessibility option. They live on separate controls so users
        don't get pushed through HC during casual theme switching.
        See <NuxtLink to="/docs/adr/0006-separate-hc-from-casual-theme-toggle" class="link-tti">ADR-0006</NuxtLink>.
      </TuxCallout>
    </section>

    <!-- Platform-aware. -->
    <section class="space-y-3">
      <TuxSectionHeader>Platform-aware</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        tux now ships as a <strong>Tauri desktop layer</strong> for
        Windows 11 / macOS Tahoe / Ubuntu, with Tauri Mobile (iOS /
        Android) on the near horizon. The brand layer stays invariant;
        the chrome layer adapts. Platform detection is via
        <code>useTuxPlatform()</code> — a module-singleton that sets
        <code>[data-platform]</code> on <code>&lt;html&gt;</code>
        post-hydration. Library-agnostic Tauri detection (no static
        <code>@tauri-apps/api</code> import) keeps the web build slim.
      </p>
      <div class="flex flex-wrap gap-2">
        <TuxButton intent="ghost" to="/design/platform-awareness">Read platform-awareness</TuxButton>
        <TuxButton intent="ghost" to="/design/tauri-bindings">Read tauri-bindings</TuxButton>
      </div>
    </section>

    <!-- Accessibility. -->
    <section class="space-y-3">
      <TuxSectionHeader>Accessibility</TuxSectionHeader>
      <ul class="gs-bullets text-sm text-text-secondary leading-relaxed max-w-3xl">
        <li><strong>Target:</strong> WCAG 2.2 Level AA conformance.</li>
        <li><strong>Color contrast:</strong> verified at WCAG 2.2 Level AAA across all three themes. CI fails if any pair regresses.</li>
        <li><strong>Motion:</strong> every animation respects <code>prefers-reduced-motion: reduce</code> and collapses to instant. Non-negotiable.</li>
        <li><strong>Touch + gesture:</strong> every swipe action has a visible alternative (keyboard or button). Swipe-only is a screen-reader trap.</li>
      </ul>
      <div class="flex flex-wrap gap-2">
        <TuxButton intent="ghost" to="/accessibility">Read the conformance statement</TuxButton>
        <TuxButton intent="ghost" to="/contrast-audit">View the contrast audit</TuxButton>
      </div>
    </section>

    <!-- Consuming + close. -->
    <section class="space-y-3">
      <TuxSectionHeader>Consuming from another app</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Pin to a tagged release straight from GitHub. Bumping the
        consumer's pin is how you opt in to a new tux version. Tags
        are immutable; upgrade deliberately by bumping the
        <code>#vX.Y.Z</code> ref.
      </p>
      <TuxCodeBlock
        :code="consumeSnippet"
        language="ts"
        filename="nuxt.config.ts"
      />
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        See <NuxtLink to="/changelog" class="link-tti">CHANGELOG.md</NuxtLink>
        for what each version contains.
      </p>
    </section>

    <TuxCTA
      eyebrow="next stops"
      title="Pick a thread"
      dek="Catalog · Compositions · Roadmap. The three places contributors most often start once the tour wraps."
    >
      <template #actions>
        <TuxButton intent="primary" size="lg" to="/components">Browse all components</TuxButton>
        <TuxButton intent="ghost" size="lg" to="/design/compositions">Read the compositions doctrine</TuxButton>
        <TuxButton intent="ghost" size="lg" to="/design/roadmap">See the roadmap</TuxButton>
      </template>
    </TuxCTA>
  </div>
</template>

<style scoped>
/* Numbered step list — matches the survey-rhythm density tokens.
   The number column is its own flex child so multi-line bodies wrap
   under the title, not the digit. */
.gs-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gs-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.gs-step__n {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  border-radius: 50%;
}

.gs-step__body {
  min-width: 0;
}

.gs-step__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.gs-step__copy {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.gs-bullets {
  padding-left: 1.25rem;
  list-style: disc;
}

.gs-bullets li + li {
  margin-top: 0.375rem;
}

[data-theme="tti-dark"] .gs-step__n {
  color: var(--brand-accent);
  background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 28%, transparent);
}
</style>
