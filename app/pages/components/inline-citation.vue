<script setup lang="ts">
import tuxInlineCitationSource from "~/components/TuxInlineCitation.vue?raw";

useHead({ title: "TuxInlineCitation · TUX" });

const basicVue = `<p>
  CLS-211 outperforms CLS-204 on ITAR-tier documents<tux-inline-citation
    :n="1"
    title="CLS retrain methodology · v3.1"
    href="https://example.com/cls-retrain"
    excerpt="The retrain pipeline runs nightly on the grants-2024-2026 corpus and emits both classifier checkpoints to the model registry."
    score="0.91"
  /> by ~5 percentage points<tux-inline-citation
    :n="2"
    title="ITAR rubric · §3.2 boundary cases"
    excerpt="Boundary-case classification follows §3.2 (dual-use determination) with a 0.62 confidence threshold."
    score="0.88"
  />.
</p>`;

const noScoreVue = `<p>
  See the source for full context<tux-inline-citation
    :n="3"
    title="DoD-XR contract addendum"
    href="https://example.com/dod-xr"
  />.
</p>`;

const clickVue = `<tux-inline-citation
  :n="4"
  title="Click-mode citation"
  excerpt="Use mode='click' for keyboard-first or touch-heavy surfaces; defaults to hover (Vercel convention)."
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxInlineCitation">
      Academic-style inline reference pill. Renders as a superscripted
      <code>[N]</code> inside body text; hover/focus reveals a popover
      with title + URL + optional excerpt + optional retrieval score.
      Distinct from <code>TuxCitations</code> (the footer list); the two
      compose — inline pills index into the footer list. One source per
      pill, matching the academic convention (not Vercel's "+5"
      aggregation).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">In prose</h2>
      <p class="text-sm text-text-secondary mb-3">
        Place the tag right against the preceding word (no leading
        space) — citation pills are superscripted and bump up to the
        word they reference.
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxInlineCitationSource">
        <p>
          CLS-211 outperforms CLS-204 on ITAR-tier documents<TuxInlineCitation
            :n="1"
            title="CLS retrain methodology · v3.1"
            href="https://example.com/cls-retrain"
            excerpt="The retrain pipeline runs nightly on the grants-2024-2026 corpus and emits both classifier checkpoints to the model registry."
            score="0.91"
          /> by ~5 percentage points<TuxInlineCitation
            :n="2"
            title="ITAR rubric · §3.2 boundary cases"
            excerpt="Boundary-case classification follows §3.2 (dual-use determination) with a 0.62 confidence threshold."
            score="0.88"
          />.
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">minimal</p>
      <h2 class="heading--bold text-xl font-bold">Title only</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>excerpt</code> and <code>score</code> are optional. Pass
        only <code>title</code> for a minimal citation pill.
      </p>
      <TuxExample :vue="noScoreVue">
        <p>
          See the source for full context<TuxInlineCitation
            :n="3"
            title="DoD-XR contract addendum"
            href="https://example.com/dod-xr"
          />.
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">trigger</p>
      <h2 class="heading--bold text-xl font-bold">Click mode</h2>
      <p class="text-sm text-text-secondary mb-3">
        Defaults to hover (matches Vercel). Pass
        <code>trigger="click"</code> when keyboard-only or touch-first
        users matter more.
      </p>
      <TuxExample :vue="clickVue">
        <span>
          Click the pill instead of hovering →
          <TuxInlineCitation
            :n="4"
            title="Click-mode citation"
            excerpt="Use trigger='click' for keyboard-first or touch-heavy surfaces; defaults to hover (Vercel convention)."
            trigger="click"
          />
        </span>
      </TuxExample>
    </section>
  </div>
</template>
