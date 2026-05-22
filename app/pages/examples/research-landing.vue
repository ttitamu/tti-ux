<script setup lang="ts">
useHead({ title: "Example · Research program landing · TUX" });

const factoids = [
  { value: "412", suffix: " mi", label: "Continuously instrumented freight corridor coming online by year's end.", source: "TTI Freight Operations Group · 2025" },
  { value: "37",  suffix: "%",   label: "Reduction in stop-line non-compliance at twelve treated rural intersections.", source: "Hassan et al. · 36-mo follow-up" },
  { value: "2.1", suffix: "M",   label: "Vehicles per day across the Texas Triangle's monitored corridors.", source: "TTI MovementLab · Q3 2025" },
];

const programCards = [
  { eyebrow: "Program", title: "Connected & Automated Vehicles", to: "/examples/research-landing", tone: "maroon" as const },
  { eyebrow: "Program", title: "Roadway Safety",                 to: "/examples/research-landing", tone: "charcoal" as const },
  { eyebrow: "Program", title: "Mobility & Economics",           to: "/examples/research-landing", tone: "gold" as const },
];

const focusAreas = [
  {
    icon: "lucide:radar",
    title: "Field instrumentation",
    body: "Sensor networks across rural intersections + freight corridors. Longitudinal data feeds both safety findings and operational dashboards.",
    cta: { label: "Browse data", to: "#" },
  },
  {
    icon: "lucide:users",
    title: "Equity-weighted outcomes",
    body: "DOT performance frameworks that surface equity outcomes alongside efficiency metrics. Validated across three years of corridor data.",
    cta: { label: "Read the framework", to: "#" },
  },
  {
    icon: "lucide:landmark",
    title: "Policy translation",
    body: "Research-to-guidance pipelines for TxDOT, FHWA, and member institutions. Evidence-based recommendations, no advocacy.",
    cta: { label: "Browse briefs", to: "#" },
  },
];

const newsItems = [
  { date: "2026-04-22", category: "Research",      title: "Twelve-county roadway study reaches 36-month follow-up", dek: "Compliance gains held; three sites also showed late-night crash reductions.", to: "#", tone: "maroon" as const },
  { date: "2026-04-08", category: "Press release", title: "412-mile freight corridor enters phase 2",                dek: "MovementLab announces next deployment window for continuous-instrumentation sensors.",          to: "#", tone: "charcoal" as const },
  { date: "2026-03-30", category: "Event",         title: "2026 Transportation Symposium · early-bird open",          dek: "Three-day program at Rellis. Two keynotes, four workshops, grad-student poster session.",         to: "#", tone: "gold" as const },
];

const testimonials = [
  { quote: "Engineering-only treatments rarely hold past 24 months — this one is doing something different.", name: "Dr. Lina Hassan", role: "PI · Roadway Safety" },
  { quote: "The before/after framework is finally giving us answers that survive replication.",                 name: "Marcus Reilly",   role: "Field Research Coordinator" },
  { quote: "We needed equity-weighted outcomes to be a first-class measurement, not a footnote.",                name: "Dr. Imani Park",  role: "Director, Center for Transportation Equity" },
];
</script>

<template>
  <div class="space-y-12">
    <div class="example-demo-notice">
      <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
      <p class="example-demo-notice__text">
        <strong>Composition example.</strong>
        Real-shape research-program landing — hero, factoids, media
        slab, focus areas, program cards, news, testimonials, CTA.
        Eleven Tux* components, marketing-shape register.
      </p>
    </div>

    <TuxBreadcrumbs
      :trail="[
        { label: 'Home',     to: '/' },
        { label: 'Research', to: '#' },
        { label: 'Connected & Automated Vehicles' },
      ]"
    />

    <!-- Hero with stats anchor -->
    <TuxPageHeader
      tone="maroon"
      rhythm="hero"
      eyebrow="research"
      title="Connected & Automated Vehicles"
    >
      Field-deployed sensor networks across the Texas Triangle, with
      longitudinal corridor data feeding both safety research and policy
      frameworks.
      <template #actions>
        <TuxButton intent="primary">Browse projects</TuxButton>
        <TuxButton intent="ghost">Read the 2025 report</TuxButton>
      </template>
      <template #media>
        <TuxBigStat
          :value="60"
          suffix=" yrs"
          label="Of transportation research at Texas A&M"
          tone="gold"
          size="lg"
        />
      </template>
    </TuxPageHeader>

    <!-- Center badge + program leads byline + funder badges.
         Added 2026-05-22 dogfood pass: sprinkles the TTI identity
         cluster into the existing research-program landing rhythm. -->
    <section class="research-landing__identity">
      <div class="flex items-center gap-2 flex-wrap">
        <TuxCenterBadge center="safety" />
        <TuxCenterBadge center="mobility" />
        <span class="text-xs text-text-muted">·  Cross-division program</span>
      </div>
      <TuxAuthorByline
        layout="compact"
        :authors="[
          { name: 'M. Hassan',    affiliations: [1], orcid: '0000-0002-1234-5678', corresponding: true },
          { name: 'L. Velazquez', affiliations: [1] },
          { name: 'R. Chen',      affiliations: [2] },
        ]"
        :affiliations="[
          'Texas A&M Transportation Institute, Roadway Safety Division',
          'Texas A&M Transportation Institute, Mobility Division',
        ]"
      />
      <div class="flex flex-wrap items-center gap-2 mt-2">
        <span class="text-xs uppercase tracking-wider text-text-muted font-semibold">Funded by:</span>
        <TuxFundingSource funder="FHWA" abbrev="FHWA" grant="HRDS-30-2022-04" size="sm" />
        <TuxFundingSource funder="TxDOT" grant="0-7042" size="sm" />
        <TuxFundingSource funder="Bloomberg" grant="BP-EQT-2024" size="sm" />
      </div>
    </section>

    <!-- By-the-numbers row -->
    <section>
      <TuxFactoid
        variant="default"
        :density="3"
        :items="factoids"
        eyebrow="By the numbers"
        title="What three years of follow-up data is telling us."
        dek="Treatment outcomes from twelve rural intersections, measured through 36 months of post-construction observation."
      />

      <!-- Year-over-year deltas — composed below the factoid row to
           show *how* the headline metrics moved, not just the latest
           value. Demonstrates TuxStatComparison alongside the
           existing TuxFactoid for the "summary + comparison" rhythm.
           tux-mount-in stagger gives the row a subtle entrance. -->
      <div class="research-landing__deltas mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 tux-mount-in tux-mount-in--stagger">
        <TuxStatComparison
          eyebrow="freight corridors"
          :current="412"
          :previous="368"
          suffix=" mi"
          :decimals="0"
          label="vs end of FY24"
          layout="stack"
          :style="{ '--tux-mount-stagger-index': 0 }"
        />
        <TuxStatComparison
          eyebrow="non-compliance rate"
          :current="37"
          :previous="49"
          suffix="%"
          :decimals="0"
          label="vs pre-treatment baseline"
          polarity="invert"
          layout="stack"
          :style="{ '--tux-mount-stagger-index': 1 }"
        />
        <TuxStatComparison
          eyebrow="monitored vehicles / day"
          :current="2.1"
          :previous="1.8"
          suffix="M"
          label="vs Q3 last year"
          layout="stack"
          :style="{ '--tux-mount-stagger-index': 2 }"
        />
      </div>
    </section>

    <!-- Featured publication callout -->
    <section>
      <TuxBlockquote
        layout="drop-cap"
        quote="Treatment outcomes from twelve rural intersections, measured through 36 months of post-construction observation, point to enduring infrastructure cues rather than novelty effects."
        attribution="Hassan et al."
        role="Transportation Research Record · Vol. 2671 · 2025"
      />
    </section>

    <!-- Big media moment -->
    <section>
      <TuxMediaSlab
        layout="split"
        image-side="right"
        eyebrow="Field deployment"
        title="The corridor that made it real"
        dek="412 miles of continuously-instrumented freight corridor came online during Q3 2025. Real-time data feeds both research and operational decisions."
        tone="charcoal"
      >
        <template #actions>
          <TuxButton intent="primary">Watch the deployment video</TuxButton>
        </template>
      </TuxMediaSlab>
    </section>

    <!-- Three focus areas -->
    <section class="space-y-6">
      <header class="max-w-2xl space-y-2">
        <p class="eyebrow">focus areas</p>
        <h2 class="heading--bold text-3xl font-bold">What we work on</h2>
        <p class="text-text-secondary leading-relaxed">
          Our portfolio spans corridor instrumentation, outcome
          measurement, and the policy translation that turns findings
          into deployable guidance. Each area runs on multi-year
          sponsored research with TxDOT, FHWA, and federal partners.
        </p>
      </header>

      <TuxIconFeature :items="focusAreas" :columns="3" />
    </section>

    <!-- Card slab — browse programs -->
    <section>
      <TuxCardSlab
        eyebrow="Research"
        heading="Browse our programs"
        :cards="programCards"
        :columns="3"
      />
    </section>

    <!-- Recent news -->
    <section class="space-y-4">
      <header class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p class="eyebrow">latest</p>
          <h2 class="heading--bold text-3xl font-bold">News &amp; events</h2>
        </div>
        <NuxtLink to="#" class="link-tti font-mono text-sm">All news ↗</NuxtLink>
      </header>

      <TuxNewsCollection :items="newsItems" layout="grid" :columns="3" />
    </section>

    <!-- Testimonials -->
    <section class="space-y-4">
      <header class="max-w-2xl">
        <p class="eyebrow">voices</p>
        <h2 class="heading--bold text-3xl font-bold">From the field</h2>
      </header>

      <TuxTestimonial :items="testimonials" :columns="3" />
    </section>

    <!-- CTA -->
    <section>
      <TuxCTA
        eyebrow="get in touch"
        title="Sponsoring research, or looking to collaborate?"
        dek="Industry partnership, sponsored studies, joint research, and graduate-assistantship sponsorship — the program lead can route any inquiry."
      >
        <template #actions>
          <TuxButton intent="primary" size="lg">Contact the program</TuxButton>
          <TuxButton intent="ghost" size="lg">Browse open RFPs</TuxButton>
        </template>
      </TuxCTA>
    </section>

    <!-- Footer-of-section link list -->
    <section>
      <TuxLinkList
        :columns="3"
        :groups="[
          {
            heading: 'For sponsors',
            items: [
              { label: 'Active solicitations',   to: '#' },
              { label: 'Sponsored research FAQ', to: '#' },
              { label: 'Past project archive',   to: '#' },
            ],
          },
          {
            heading: 'For partners',
            items: [
              { label: 'Industry liaison',         to: '#', description: 'Single point of contact for IP, licensing, joint research.' },
              { label: 'Co-funded programs',       to: '#' },
              { label: 'Collaboration agreement',  href: 'https://tamus.edu/legal/cra' },
            ],
          },
          {
            heading: 'For students',
            items: [
              { label: 'Graduate assistantships', to: '#', featured: true },
              { label: 'Internship program',      to: '#' },
              { label: 'Career portal',           href: 'https://careers.tti.tamu.edu' },
            ],
          },
        ]"
      />
    </section>
  </div>
</template>

<style scoped>
.research-landing__identity {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: var(--surface-sunken);
  border-left: 3px solid var(--brand-primary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin: -0.5rem 0 1.5rem 0;
}
</style>
