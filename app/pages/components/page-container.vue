<script setup lang="ts">
import tuxPageContainerSource from "~/components/TuxPageContainer.vue?raw";

useHead({ title: "TuxPageContainer · TUX" });

const basicVue = `<!-- The page's main region at the standard measure (80rem). -->
<TuxPageContainer as="main">
  <h1>Corpus inventory</h1>
  …
</TuxPageContainer>`;

const widthsVue = `<TuxPageContainer width="wide">   <!-- 96rem — data grids -->
<TuxPageContainer width="prose">  <!-- 72ch — long-form reading -->
<TuxPageContainer flush>          <!-- no gutter — full-bleed children -->`;

const stickyVue = `/* Pair with the measured nav height TuxSiteNav/TuxAppFrame publish —
   no more hardcoded 4rem/5rem offsets: */
.sidebar {
  position: sticky;
  top: calc(var(--tux-nav-height, 4rem) + 1rem);
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxPageContainer">
      The content-width primitive. Three token-backed measures
      (<code>--layout-content-max/wide/prose-max</code>) so every product
      shares the same page geometry instead of inventing max-widths per
      layout.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basics</p>
      <h2 class="heading--bold text-xl font-bold">Default measure</h2>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxPageContainerSource">
        <TuxPageContainer class="border border-dashed border-surface-border py-4">
          <p class="text-sm text-text-secondary">
            Centered at <code>--layout-content-max</code> (80rem) with the
            standard 1.5rem gutter.
          </p>
        </TuxPageContainer>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">variants</p>
      <h2 class="heading--bold text-xl font-bold">Wide · prose · flush</h2>
      <TuxExample class="mt-4" :vue="widthsVue" :source="tuxPageContainerSource">
        <div class="space-y-3">
          <TuxPageContainer width="wide" class="border border-dashed border-surface-border py-2">
            <p class="text-xs text-text-muted">wide — 96rem</p>
          </TuxPageContainer>
          <TuxPageContainer width="prose" class="border border-dashed border-surface-border py-2">
            <p class="text-xs text-text-muted">prose — 72ch</p>
          </TuxPageContainer>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">chrome math</p>
      <h2 class="heading--bold text-xl font-bold">Sticky offsets without magic numbers</h2>
      <TuxExample class="mt-4" :vue="stickyVue" :source="tuxPageContainerSource">
        <p class="text-sm text-text-secondary">
          <code>--tux-nav-height</code> is published on
          <code>&lt;html&gt;</code> by TuxSiteNav and TuxAppFrame
          (ResizeObserver-measured), in both shell shapes.
        </p>
      </TuxExample>
    </section>
  </div>
</template>
