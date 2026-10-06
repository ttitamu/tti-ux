<script setup lang="ts">
import pkg from "../../package.json";

useHead({ title: "Getting started · TUX" });

const version = pkg.version;

// Step-by-step onboarding for new visitors. The home page is a
// landing/marketing surface; this page is the actual "what is tux,
// how do I use it, where do I go next" tour. Six sections matched
// to the six sidebar groups + the three product shapes tux serves.
interface Step {
  n: number;
  title: string;
  body: string;
  command?: string;
  code?: string;
  language?: string;
  filename?: string;
  details?: string[];
  to?: string;
  toLabel?: string;
}

const steps: Step[] = [
  {
    n: 1,
    title: "Clone repository and run local development",
    body: "Clone the repository, install dependencies, and start the local preview server. Prerendered documentation and live component sandboxes serve at port 3030.",
    command: "git clone https://github.com/ttitamu/tti-ux.git\ncd tti-ux\nnpm install\nnpm run dev",
    details: [
      "Binds to http://localhost:3030 to prevent port collisions with other local services.",
      "Vite hot-module replacement (HMR) reloads automatically on token, component, or doc edits.",
    ],
    to: "/install",
    toLabel: "View all install targets",
  },
  {
    n: 2,
    title: "Extend TUX in your Nuxt 4 configuration",
    body: "In your application nuxt.config.ts, extend TUX as a layer. All 183 Tux* components and composables are auto-imported and immediately available in templates.",
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@tti/tti-ux"],
});`,
    language: "ts",
    filename: "nuxt.config.ts",
    details: [
      "Global component registration ensures both Vue SFC templates and Markdown (via MDC) resolve primitives without imports.",
      "Tailwind v4 theme variables and typography tokens are injected automatically.",
    ],
    to: "/components",
    toLabel: "Browse 183 components",
  },
  {
    n: 3,
    title: "Consume standalone tokens and CSS (Non-Nuxt stacks)",
    body: "For static HTML, React, ASP.NET, or WordPress projects that cannot run the Nuxt layer, link pre-compiled tokens and operational classes directly from the kit distribution.",
    code: `<!-- Include in your document <head> -->
<link rel="stylesheet" href="@tti/tti-ux/kit/css/tux-tokens.css">
<link rel="stylesheet" href="@tti/tti-ux/kit/css/tux-ops.css">`,
    language: "html",
    filename: "index.html",
    details: [
      "kit/css/tux-tokens.css provides pure CSS custom properties for all three themes without any build tooling.",
      "kit/css/tux-bridge.css upgrades raw HTML tables, buttons, and form inputs to WCAG 2.2 AAA standards.",
    ],
    to: "/tokens",
    toLabel: "Explore token reference",
  },
  {
    n: 4,
    title: "Compose templates using accessible primitives",
    body: "Assemble user interfaces using verified TTI primitives. Every component strictly satisfies WCAG 2.2 Level AAA requirements, including >= 7.0:1 text contrast and full keyboard navigation.",
    code: `<template>
  <div class="space-y-4">
    <TuxSectionHeader title="Analysis Parameters" />
    <TuxAlert variant="info" title="Sensor Array Online">
      Data feed synchronized across all 12 monitoring stations.
    </TuxAlert>
    <TuxButton intent="primary">Export Dataset</TuxButton>
  </div>
</template>`,
    language: "vue",
    filename: "AnalysisView.vue",
    details: [
      "Form controls integrate with validation summaries, field wrappers, and accessible error descriptors.",
      "Status chips and badges enforce consistent semantic status semantics (nominal, warning, critical, info, subtle).",
    ],
    to: "/examples/landscape-dashboard",
    toLabel: "View dashboard composition",
  },
  {
    n: 5,
    title: "Configure themes and high-contrast accessibility",
    body: "TUX supports 3 certified themes: tti (default light), tti-dark (warm charcoal), and tti-hc (dedicated WCAG AAA high-contrast). Themes switch instantly via the data-theme attribute on <html>.",
    code: `<!-- Set data-theme on <html> -->
<html data-theme="tti">
<html data-theme="tti-dark">
<html data-theme="tti-hc">`,
    language: "html",
    filename: "app.html",
    details: [
      "High-contrast mode is decoupled from standard dark mode to ensure persistent accessibility accommodations (ADR-0006).",
      "Use the useTuxTheme() composable to read or switch themes programmatically in Vue apps.",
    ],
    to: "/docs/adr/0006-separate-hc-from-casual-theme-toggle",
    toLabel: "Read ADR-0006",
  },
  {
    n: 6,
    title: "Run automated quality and contrast verification",
    body: "Verify component contracts and accessibility standards using the institutional 6-gate test harness before deploying changes.",
    command: "# Run full 6-gate verification (tokens, status palette, WCAG AAA math, Vitest, Axe prerender)\nnode scripts/test-all-suites.mjs\n\n# Run mathematical luminance contrast audit\nnpm run audit:aaa",
    details: [
      "Evaluates luminance ratios mathematically against WCAG 2.2 Level AAA (>= 7.0:1 text, >= 3.0:1 UI boundaries).",
      "Checks 245 prerendered routes with axe-core to ensure 0 accessibility violations.",
    ],
    to: "/components/health",
    toLabel: "View 183-component Health Matrix",
  },
];

// Product-shape map — three core interface profiles
const productShapes = [
  {
    icon: "lucide:layout-dashboard",
    title: "Operational dashboards",
    body: "High-density data views, table pagination, faceted filters, and responsive metrics displays designed for administrative and analysis workflows.",
    example: { label: "Landscape dashboard", to: "/examples/landscape-dashboard" },
  },
  {
    icon: "lucide:newspaper",
    title: "Research and communications",
    body: "Public-facing program pages, center overviews, technical reports, author bylines, and citation export tools aligned with TTI identity standards.",
    example: { label: "Research landing", to: "/examples/research-landing" },
  },
  {
    icon: "lucide:bot",
    title: "Conversational interfaces",
    body: "Chat layouts, tool invocation displays, document artifacts, suggestion chips, and context meters for AI-assisted research workflows.",
    example: { label: "TTI AI Studio session", to: "/examples/tti-ai-studio-session" },
  },
];

// Component family map — six clusters that tightly couple. The other
// ~140 components are listed individually in the sidebar; these are
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
  { to: "/design/ops-surfaces",              label: "Operational surfaces", blurb: "Overlay class API vs owned ops board. Vue / HTML / CSS / Source." },
  { to: "/design/chart-foundations",         label: "Chart foundations",    blurb: "Axis/grid/legend tokens, value-label placement, brush selectors, alt-text patterns." },
  { to: "/design/platform-awareness",        label: "Platform awareness",   blurb: "Tauri / multi-platform doctrine. \"One tree, platform-adaptive at the chrome layer.\"" },
  { to: "/design/tauri-bindings",            label: "Tauri bindings",       blurb: "Which Tux* components call which Tauri APIs + capability allowlist template." },
  { to: "/design/visual-language-evolution", label: "Visual language",      blurb: "Token-only refresh notes — two-ring focus, transportation-tempo easings, four-tier elevation." },
  { to: "/design/roadmap",                   label: "Roadmap",              blurb: "What's shipped, what's deferred, what's carry-forward." },
];

// Example pages — eight composition surfaces.
const examplePages = [
  { to: "/examples/landscape-dashboard",   eyebrow: "product · IT-facing",       title: "Landscape dashboard",    components: 15 },
  { to: "/examples/ops-board",             eyebrow: "product · operations",      title: "Ops board",              components: 4  },
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
      eyebrow="documentation"
      title="Getting started"
      rhythm="hero"
    >
      A guide to installing, configuring, and building with TUX design tokens and components.
      <template #actions>
        <TuxButton intent="primary" to="/components">Browse components</TuxButton>
        <TuxButton intent="ghost" to="/design/tux">System doctrine</TuxButton>
      </template>
    </TuxPageHeader>

    <!-- Quick-fact strip — system metrics -->
    <section>
      <TuxFactoid
        variant="default"
        :columns="3"
        :items="[
          { value: '183', label: 'Tux* components and composables, fully auto-imported.' },
          { value: '12+', label: 'Composition examples across operational and public research surfaces.' },
          { value: '3',   label: 'Themes: Light, Dark, and WCAG AAA High-Contrast.' },
        ]"
        eyebrow="At a glance"
        :title="factoidTitle"
      />
    </section>

    <!-- The six-step tour. -->
    <section class="space-y-4">
      <TuxSectionHeader>Implementation steps</TuxSectionHeader>
      <ol class="gs-steps">
        <li
          v-for="step in steps"
          :key="step.n"
          class="gs-step"
        >
          <span class="gs-step__n" aria-hidden="true">{{ step.n }}</span>
          <div class="gs-step__body flex-1 min-w-0">
            <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
              <h3 class="gs-step__title">{{ step.title }}</h3>
              <NuxtLink
                v-if="step.to"
                :to="step.to"
                class="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
              >
                <span>{{ step.toLabel }}</span>
                <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" aria-hidden="true" />
              </NuxtLink>
            </div>
            <p class="gs-step__copy mb-3">{{ step.body }}</p>

            <div v-if="step.command" class="my-3">
              <TuxCodeBlock
                :code="step.command"
                language="sh"
                filename="terminal"
              />
            </div>
            <div v-else-if="step.code" class="my-3">
              <TuxCodeBlock
                :code="step.code"
                :language="step.language || 'ts'"
                :filename="step.filename"
              />
            </div>

            <ul v-if="step.details?.length" class="space-y-1 mt-2 text-xs text-text-secondary list-disc pl-4">
              <li v-for="(d, idx) in step.details" :key="idx">{{ d }}</li>
            </ul>
          </div>
        </li>
      </ol>
    </section>

    <!-- Three product shapes. -->
    <section class="space-y-4">
      <TuxSectionHeader>Application profiles</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Standardized patterns tailored for three core interface types:
      </p>
      <TuxIconFeature :items="productShapes" :columns="3" />
    </section>

    <!-- Component family map. -->
    <section class="space-y-4">
      <TuxSectionHeader>Component families</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Six tightly-coupled clusters where reading the components
        <em>together</em> provides cohesive patterns. The remaining components
        are cataloged individually in the sidebar.
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
      <TuxSectionHeader>Composition examples</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Production-grade layouts assembling 5–15 Tux* components into
        realistic application surfaces.
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
      <TuxSectionHeader>System doctrine</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Ten architectural design documents under
        <code>design/</code>, plus the canonical
        <code>tokens.json</code> source.
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
      <TuxSectionHeader>Theme configuration</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Three themes ship: <code>tti</code> (default light),
        <code>tti-dark</code> (dark), and
        <code>tti-hc</code> (WCAG AAA high-contrast). Toggle via the
        navigation controls or set <code>data-theme</code> on
        <code>&lt;html&gt;</code>. Applications customize brand tokens via
        <code>[data-theme]</code> selectors without modifying core component templates.
      </p>
      <TuxCallout intent="info" title="Dedicated High-Contrast Mode">
        High-contrast mode is an accessibility accommodation rather than an aesthetic preference.
        It is controlled independently to ensure continuous compliance without unintended switches.
        See <NuxtLink to="/docs/adr/0006-separate-hc-from-casual-theme-toggle" class="link-tti">ADR-0006</NuxtLink>.
      </TuxCallout>
    </section>

    <!-- Platform-aware. -->
    <section class="space-y-3">
      <TuxSectionHeader>Cross-platform support</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        TUX components adapt across responsive web layouts and desktop application environments (such as Tauri).
        The underlying design tokens preserve brand hierarchy while adapting navigation chrome to the target platform.
      </p>
      <div class="flex flex-wrap gap-2">
        <TuxButton intent="ghost" to="/design/platform-awareness">Read platform guidelines</TuxButton>
        <TuxButton intent="ghost" to="/design/tauri-bindings">View platform bindings</TuxButton>
      </div>
    </section>

    <!-- Accessibility. -->
    <section class="space-y-3">
      <TuxSectionHeader>Accessibility</TuxSectionHeader>
      <ul class="gs-bullets text-sm text-text-secondary leading-relaxed max-w-3xl">
        <li><strong>Contrast standard:</strong> WCAG 2.2 Level AAA (minimum 7:1 for normal text, 4.5:1 for large text) across all themes.</li>
        <li><strong>Keyboard navigation:</strong> all interactive primitives are fully operable via keyboard with prominent focus indicators.</li>
        <li><strong>Reduced motion:</strong> all transitions and animations respect <code>prefers-reduced-motion: reduce</code>.</li>
        <li><strong>Target size:</strong> interactive controls meet or exceed WCAG 2.2 touch target requirements.</li>
      </ul>
      <div class="flex flex-wrap gap-2">
        <TuxButton intent="ghost" to="/accessibility">Read accessibility statement</TuxButton>
        <TuxButton intent="ghost" to="/contrast-audit">View contrast audit</TuxButton>
      </div>
    </section>

    <!-- Consuming + close. -->
    <section class="space-y-3">
      <TuxSectionHeader>Consuming from another app</TuxSectionHeader>
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        Pin to a tagged release in your application configuration:
      </p>
      <TuxCodeBlock
        :code="consumeSnippet"
        language="ts"
        filename="nuxt.config.ts"
      />
      <p class="text-sm text-text-secondary leading-relaxed max-w-3xl">
        See <NuxtLink to="/changelog" class="link-tti">CHANGELOG.md</NuxtLink>
        for version release history.
      </p>
    </section>

    <TuxCTA
      eyebrow="next steps"
      title="Continue exploring"
      dek="Browse components, review composition patterns, or check the project roadmap."
    >
      <template #actions>
        <TuxButton intent="primary" size="lg" to="/components">Browse components</TuxButton>
        <TuxButton intent="ghost" size="lg" to="/design/compositions">Composition patterns</TuxButton>
        <TuxButton intent="ghost" size="lg" to="/design/roadmap">System roadmap</TuxButton>
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
  background: var(--wash-brand-8);
  border: 1px solid var(--wash-brand-22);
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
  border-color: color-mix(in srgb, var(--brand-accent) 22%, transparent);
}
</style>
