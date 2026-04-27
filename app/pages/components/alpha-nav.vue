<script setup lang="ts">
useHead({ title: "TuxAlphaNav · tti-ux" });

// Mock dataset — letters with at least one entry
const availableLetters = ["A", "B", "C", "D", "G", "H", "I", "L", "M", "N", "P", "R", "S", "T", "V"];

const selectedLetter = ref<string | null>(null);

const exampleVue = `<TuxAlphaNav :available="['A','B','C','D','G','H','I']" />`;

// Mock glossary entries
const glossary = [
  { term: "Agent", letter: "A", definition: "Long-running process on a host machine that watches one or more directories and ships file events to PECAN's central index." },
  { term: "Beat",  letter: "B", definition: "Heartbeat ping from an agent confirming it's alive. Default cadence: every 60 seconds." },
  { term: "Corpus", letter: "C", definition: "A logical grouping of indexed documents — typically scoped to a research grant, a collection, or an access tier." },
  { term: "Drift",  letter: "D", definition: "Disagreement between the agent's local index and the central record. The drift reconciler runs hourly to close drift entries." },
  { term: "Grant",  letter: "G", definition: "A funded research project. Drives corpus boundaries; ITAR-marked grants get tier-3 access controls." },
  { term: "Heartbeat", letter: "H", definition: "Liveness signal from an agent. Stale heartbeats (no signal in 6 minutes) trigger an investigation chip in the dashboard." },
  { term: "ITAR",   letter: "I", definition: "International Traffic in Arms Regulations. Files marked ITAR can't leave TAMUS without tier-3 token verification." },
];
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxAlphaNav">
      A–Z jump bar for directory + glossary pages. Letters with entries
      are clickable; letters without entries render dimmed and
      disabled. Two modes: <strong>anchor</strong> (default — sets
      <code>window.location.hash</code> for in-page jumps) and
      <strong>emit</strong> (for filter-in-place patterns).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical · anchor mode</p>
      <h2 class="heading--bold text-xl font-bold">A–Z jump to in-page sections</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>:available</code> with the letters that exist in
        your dataset. The bar dims unavailable letters automatically.
        Click any letter to jump to its anchor section below.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxAlphaNav :available="availableLetters" sticky />

        <div class="mt-6 space-y-8">
          <section
            v-for="(letterGroup, idx) in availableLetters"
            :id="letterGroup"
            :key="idx"
            class="scroll-mt-20"
          >
            <h3 class="text-2xl font-bold mb-3">{{ letterGroup }}</h3>
            <ul class="space-y-3">
              <li
                v-for="entry in glossary.filter(g => g.letter === letterGroup)"
                :key="entry.term"
                class="border-b border-surface-border pb-3"
              >
                <p class="font-bold">{{ entry.term }}</p>
                <p class="text-sm text-text-secondary mt-1">{{ entry.definition }}</p>
              </li>
              <li
                v-if="!glossary.some(g => g.letter === letterGroup)"
                class="text-sm text-text-muted italic"
              >
                (Demo glossary doesn't have entries for this letter — but
                the bar still treats it as available based on the
                <code>:available</code> prop.)
              </li>
            </ul>
          </section>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">emit mode · filter in place</p>
      <h2 class="heading--bold text-xl font-bold">Filter rather than scroll</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>mode="emit"</code> + <code>v-model</code> for filter-
        in-place behavior. Clicking a letter doesn't navigate — it sets
        the model value, and the consumer filters/queries based on
        that.
      </p>
      <TuxExample class="mt-4">
        <TuxAlphaNav
          v-model="selectedLetter"
          mode="emit"
          show-all
          :available="availableLetters"
        />
        <p class="mt-4 font-mono text-xs text-text-muted">
          selected: <code>{{ selectedLetter ?? "All" }}</code>
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + events</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>letters</code> — letter set. Defaults to A–Z.</li>
        <li><code>available</code> — letters in the dataset. Letters not in this set render dimmed + disabled.</li>
        <li><code>mode</code> — <code>"anchor" | "emit"</code>. Defaults to <code>"anchor"</code>.</li>
        <li><code>v-model</code> — current letter (emit mode).</li>
        <li><code>showAll</code> — render an "All" link at the start (emit mode).</li>
        <li><code>sticky</code> — sticky-position the bar at the top of the container.</li>
        <li>Emits <code>@select</code> with the clicked letter (or <code>null</code> for "All").</li>
      </ul>
    </section>
  </div>
</template>
