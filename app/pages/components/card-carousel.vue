<script setup lang="ts">
useHead({ title: "TuxCardCarousel · TUX" });

// Featured-trails set — a tiny demo dataset that exercises the
// carousel without pulling in real research data. Mirrors the
// Anthropic MCP Apps "Find 4 nearby hikes" reference frame.
interface Trail {
  id: string;
  name: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Strenuous";
  distance: string;
  blurb: string;
}
const trails: Trail[] = [
  { id: "ocean-view", name: "Ocean View Trail",        region: "Golden Gate Park", difficulty: "Easy",      distance: "1.4 mi", blurb: "Loops a paved cliffside with sea-stack overlooks; level grade and benches every 0.2 mi." },
  { id: "cascade-falls", name: "Cascade Waterfall",    region: "Smith-Wilderness",  difficulty: "Moderate",  distance: "3.8 mi", blurb: "Out-and-back to a 60ft veil-falls; one short scramble at the 1.6-mile mark." },
  { id: "redwood-loop", name: "Redwood Forest Loop",   region: "Tall-Timber Reg.",  difficulty: "Easy",      distance: "2.1 mi", blurb: "Boardwalk and dirt loop through old-growth coast redwoods; ADA-accessible boardwalk segment." },
  { id: "ridge-summit", name: "Ridge Summit Climb",    region: "Cascades North",    difficulty: "Strenuous", distance: "9.2 mi", blurb: "1,800ft gain; exposed scree above 6,800ft. Bring layers, the saddle wind reads like January." },
  { id: "lake-overlook", name: "Lake Overlook Spur",   region: "Mirror Lake",       difficulty: "Moderate",  distance: "4.6 mi", blurb: "Forested ascent then a panoramic ridge; mirror reflections at sunrise on still days." },
  { id: "alpine-meadow", name: "Alpine Meadow Walk",   region: "High Cascades",     difficulty: "Easy",      distance: "1.9 mi", blurb: "Late-summer wildflower bloom; flat boardwalk through a glacier-carved basin." },
];

// Editorial set — a featured-publications variant. Different shape,
// same carousel mechanism — demonstrates that consumers control
// card chrome.
interface Pub {
  id: string;
  series: string;
  title: string;
  authors: string;
  year: number;
}
const publications: Pub[] = [
  { id: "p1", series: "Exhibit 11.04", title: "Corridor-level travel-time reliability under freight surge",     authors: "L. Velazquez, R. Chen", year: 2025 },
  { id: "p2", series: "Exhibit 11.05", title: "Sensor-loop diagnostics: a survival analysis of TxDOT detectors", authors: "M. Acosta, C. Okafor",   year: 2025 },
  { id: "p3", series: "Exhibit 11.06", title: "Equity weighting in regional planning models",                   authors: "J. Aguirre",             year: 2024 },
  { id: "p4", series: "Exhibit 11.07", title: "Heavy-vehicle braking distance on wet pavement: rural HOV",      authors: "P. Choudhury, K. Boyd",  year: 2024 },
];

const trailVue = `<tux-card-carousel
  eyebrow="nearby trails"
  title="Find 4 nearby hikes"
  :items="trails"
  arrows
  dots
  :slides-to-scroll="2"
>
  <template #item="{ item }">
    <article class="trail-card">
      <h3>{{ item.name }}</h3>
      <p class="meta">{{ item.region }} · {{ item.distance }}</p>
      <p>{{ item.blurb }}</p>
    </article>
  </template>
</tux-card-carousel>`;

const pubVue = `<tux-card-carousel
  eyebrow="featured publications"
  title="Recent reports from TTI"
  :items="publications"
  loop
>
  <template #item="{ item }">
    <tux-card>
      <p class="eyebrow">{{ item.series }} · {{ item.year }}</p>
      <h3 class="font-bold mt-1">{{ item.title }}</h3>
      <p class="text-text-secondary mt-2">{{ item.authors }}</p>
    </tux-card>
  </template>
</tux-card-carousel>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · layout" title="TuxCardCarousel">
      Horizontal scroll of cards with editorial chrome. Thin wrapper
      around <code>UCarousel</code> (embla under the hood) that adds
      a TUX eyebrow + display-face title + signature rule. Cards are
      the consumer's responsibility — TuxCard, TuxArtifact,
      TuxContactCard, or a bare <code>&lt;article&gt;</code> all work.
      <br><br>
      <span class="text-sm text-text-muted">
        Use when a row of comparable items reads better than a vertical
        list — featured projects, image galleries, MCP tool result
        sets, related publications. <code>arrows</code> + <code>dots</code>
        are independent toggles; <code>loop</code> wraps the carousel
        at the ends.
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · MCP-style result set</p>
      <h2 class="heading--bold text-xl font-bold">Nearby trails carousel</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Mirrors the Anthropic MCP Apps "Find 4 nearby hikes" reference
        frame — a tool returns a small set of comparable items, and the
        chat renders them inline as a carousel. Cards advance two at
        a time; pagination dots show position.
      </p>
      <TuxExample class="mt-4" :vue="trailVue">
        <TuxCardCarousel
          eyebrow="nearby trails"
          title="Find 4 nearby hikes"
          :items="trails"
          arrows
          dots
          :slides-to-scroll="2"
          aria-label="Nearby hiking trails"
        >
          <template #item="{ item }">
            <article class="trail-card">
              <h3 class="trail-card__name">{{ item.name }}</h3>
              <p class="trail-card__meta">
                {{ item.region }} · <span class="trail-card__distance">{{ item.distance }}</span>
              </p>
              <p class="trail-card__diff" :data-difficulty="item.difficulty">{{ item.difficulty }}</p>
              <p class="trail-card__blurb">{{ item.blurb }}</p>
            </article>
          </template>
        </TuxCardCarousel>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">editorial · publications shelf</p>
      <h2 class="heading--bold text-xl font-bold">Featured publications</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pairs `TuxCardCarousel` with `TuxCard` to make a featured-
        publications shelf. <code>loop</code> wraps at the ends —
        useful when the set is small and we want continuous browsing.
      </p>
      <TuxExample class="mt-4" :vue="pubVue">
        <TuxCardCarousel
          eyebrow="featured publications"
          title="Recent reports from TTI"
          :items="publications"
          loop
          aria-label="Featured publications"
        >
          <template #item="{ item }">
            <TuxCard class="pub-card">
              <p class="eyebrow">{{ item.series }} · {{ item.year }}</p>
              <h3 class="font-bold mt-1 text-base leading-snug">{{ item.title }}</h3>
              <p class="text-sm text-text-secondary mt-2">{{ item.authors }}</p>
            </TuxCard>
          </template>
        </TuxCardCarousel>
      </TuxExample>
    </section>
  </div>
</template>

<style scoped>
.trail-card {
  width: 18rem;
  padding: 1rem 1.25rem 1.25rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.trail-card__name {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0;
}
.trail-card__meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}
.trail-card__distance {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.trail-card__diff {
  font-family: var(--font-bold);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  padding: 0.125rem 0.4375rem;
  align-self: flex-start;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
}
.trail-card__diff[data-difficulty="Strenuous"] {
  background: color-mix(in srgb, var(--color-error, #b91c1c) 12%, transparent);
  color: var(--color-error, #991b1b);
}
.trail-card__diff[data-difficulty="Easy"] {
  background: color-mix(in srgb, var(--color-success, #16a34a) 12%, transparent);
  color: var(--color-success, #166534);
}
.trail-card__blurb {
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--text-secondary);
  margin: 0;
}
.pub-card {
  width: 20rem;
}
</style>
