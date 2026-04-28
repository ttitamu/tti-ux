<script setup lang="ts">
useHead({ title: "TuxQACollection · TUX" });

const items = [
  {
    question: "How does the agent watcher detect file moves vs. delete-and-create?",
    answer: "On POSIX it uses inode tracking — a `move` event preserves the inode and the watcher correlates the rename atomically. On Windows, where ReadDirectoryChangesW doesn't surface inodes, the watcher computes a fast SHA-256 hash on rename to correlate. Both paths emit a single `move` event upstream rather than a delete+create pair.",
    seeAlso: [
      { label: "agent-watching.md", to: "#" },
      { label: "ADR 0011 · move detection", to: "#" },
    ],
  },
  {
    question: "Why was the squarified treemap implemented natively instead of using ECharts?",
    answer: "ECharts would have been a 1.5MB dependency for one chart. The squarified algorithm (Bruls, Huijsen, van Wijk · 1999) is ~80 lines of self-contained code — same visual quality, zero new dependencies. We do reach for ECharts when the chart needs are richer (sankey, sunburst, geographic), but for size-keyed treemaps the lift wasn't justified.",
    seeAlso: [
      { label: "TuxTreemap source", to: "/components/treemap" },
    ],
  },
  {
    question: "Are container queries safe to use given the consumer base?",
    answer: "Yes. Tux's three downstream consumers (PECAN, tti-ai-studio, marcom WordPress) all target current Chrome / Edge / Firefox / Safari. Container queries shipped in Chrome 105 (2022-09), Safari 16 (2022-09), Firefox 110 (2023-02) — all evergreen. We have no user agents predating that.",
    seeAlso: [
      { label: "ADR 0007", to: "#" },
    ],
  },
];

const exampleVue = `<TuxQACollection :items="items" />`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxQACollection">
      Long-form Q&amp;A editorial pattern. Always-expanded — designed
      to be read top-to-bottom. Distinct from
      <code>TuxAccordion kind="faq"</code> which is collapsible for
      scanning. Use this for explainers, methodology sections, and
      "frequently considered questions" where the answer is the
      reason to render the item.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Default · technical Q&amp;A</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxQACollection :items="items" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">style variants</p>
      <h2 class="heading--bold text-xl font-bold">Per-variant Q. marker + question face</h2>
      <p class="text-sm text-text-secondary mb-3">
        Default = Oswald Q. + Work Sans question. Bold = Work Sans
        bold-italic Q. Elegant = Georgia italic both — for research
        publications and policy explainers where the rest of the page
        is also Georgia.
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-8">
          <TuxQACollection
            variant="bold"
            :items="[items[0]]"
          />
          <TuxQACollection
            variant="elegant"
            :items="[items[1]]"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">slot composition</p>
      <h2 class="heading--bold text-xl font-bold">Rich answer content</h2>
      <p class="text-sm text-text-secondary mb-3">
        Each item exposes an <code>#answer-{idx}</code> slot for richer
        content than a plain string — lists, code, embedded components.
      </p>
      <TuxExample class="mt-4">
        <TuxQACollection
          :items="[
            { question: 'What does the four-family typography rule actually enforce?' },
          ]"
        >
          <template #answer-0>
            <p>Four font families, one job each:</p>
            <ul>
              <li><code>--font-body</code> — Open Sans for body, eyebrows, H4+</li>
              <li><code>--font-display</code> — Oswald for default-style H1–H3 only</li>
              <li><code>--font-bold</code> — Work Sans for bold-style H1–H3 + all buttons + inputs</li>
              <li><code>--font-elegant</code> — Georgia for elegant-style H1–H3 only</li>
            </ul>
            <p>Plus <code>--font-mono</code> (JetBrains Mono) for paths and code.
            The rigidity is the point — using a face outside its lane is the signal that the surface is off-system.</p>
          </template>
        </TuxQACollection>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + item shape</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>items</code> — array of <code>{ question, answer?, seeAlso? }</code>. Required.</li>
        <li><code>seeAlso</code> — array of <code>{ label, to?, href? }</code> rendered as a "See also" line under the answer.</li>
        <li><code>variant</code> — <code>"default" | "bold" | "elegant"</code>. Affects Q. marker and question face.</li>
        <li><code>#answer-{idx}</code> slot — replace plain <code>answer</code> string with rich content.</li>
      </ul>
    </section>
  </div>
</template>
