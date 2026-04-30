<script setup lang="ts">
useHead({ title: "TuxBetaRibbon · TUX" });

const showCorner = ref(false);

const cornerVue = `<tux-beta-ribbon variant="corner" tone="preview" corner="top-right" />`;
const stripeVue = `<tux-beta-ribbon variant="stripe" tone="dev" />`;
const pillVue = `<h2>
  Corridor dashboard <tux-beta-ribbon variant="pill" tone="beta" />
</h2>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="banners & tags" title="TuxBetaRibbon">
      Environment / lifecycle label that signals "this isn't the
      production deploy". Three variants: <code>corner</code> (diagonal
      ribbon in the page corner), <code>stripe</code> (top-of-page
      horizontal full-width), <code>pill</code> (inline). Pick by host
      context, not aesthetic preference.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">corner</p>
      <h2 class="heading--bold text-xl font-bold">Diagonal ribbon</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Eye-catching, hard to miss. Right reach for full-deploy preview
        environments and staging. Click below to toggle a fixed-position
        ribbon in this page's top-right corner.
      </p>
      <div class="mt-4 flex items-center gap-3">
        <TuxButton
          intent="primary"
          :icon="showCorner ? 'lucide:eye-off' : 'lucide:eye'"
          @click="showCorner = !showCorner"
        >
          {{ showCorner ? "Hide" : "Show" }} corner ribbon
        </TuxButton>
        <code class="font-mono text-sm">tone: preview</code>
      </div>
      <TuxBetaRibbon
        v-if="showCorner"
        variant="corner"
        tone="preview"
        corner="top-right"
      />

      <TuxExample class="mt-6" :vue="cornerVue">
        <div class="card-static p-6 relative overflow-hidden" style="min-height: 8rem;">
          <p class="text-sm text-text-muted italic">
            (Inline preview — the live ribbon above is fixed-positioned to
            the page; this card just shows the visual.)
          </p>
          <div class="absolute" style="top: 0; right: 0; width: 8.5rem; height: 8.5rem; overflow: hidden;">
            <span
              class="absolute"
              style="
                top: 1.875rem; right: -3rem; width: 12rem;
                padding: 0.4375rem 0; text-align: center;
                font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.08em;
                background: var(--brand-accent); color: #1f1c1c;
                transform: rotate(45deg);
              "
            >preview</span>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stripe</p>
      <h2 class="heading--bold text-xl font-bold">Top-of-page horizontal</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Right reach for production-shaped deploys with non-prod data
        (a real-feeling demo with seeded fixtures), or lifecycle labels
        on the canonical product (a public beta).
      </p>
      <TuxExample class="mt-4" :vue="stripeVue">
        <TuxBetaRibbon variant="stripe" tone="dev" />
      </TuxExample>
      <TuxExample class="mt-4">
        <TuxBetaRibbon variant="stripe" tone="beta" />
      </TuxExample>
      <TuxExample class="mt-4">
        <TuxBetaRibbon variant="stripe" tone="preview" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">pill</p>
      <h2 class="heading--bold text-xl font-bold">Inline label</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Right reach for feature-level beta tags, per-page indicators,
        and headers. Flows in normal page chrome.
      </p>
      <TuxExample class="mt-4" :vue="pillVue">
        <h3 class="heading--bold text-xl font-bold flex items-center gap-2">
          Corridor dashboard
          <TuxBetaRibbon variant="pill" tone="beta" />
        </h3>
        <h3 class="heading--bold text-xl font-bold flex items-center gap-2 mt-4">
          Funding application v2
          <TuxBetaRibbon variant="pill" tone="preview" />
        </h3>
        <h3 class="heading--bold text-xl font-bold flex items-center gap-2 mt-4">
          PECAN sandbox
          <TuxBetaRibbon variant="pill" tone="dev" />
        </h3>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">when not to reach for this</p>
      <h2 class="heading--bold text-lg font-bold">Beta ribbon vs announcement banner</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Beta ribbons signal a <em>persistent state</em> of the
        environment or feature. For one-off content notices
        (maintenance windows, new content drops, security advisories),
        use <NuxtLink to="/components/announcement-banner" class="link-tti">TuxAnnouncementBanner</NuxtLink>
        — a content notice doesn't belong in chrome.
      </p>
    </section>
  </div>
</template>
