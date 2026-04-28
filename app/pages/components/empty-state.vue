<script setup lang="ts">
import tuxEmptyStateSource from "~/components/TuxEmptyState.vue?raw";

useHead({ title: "TuxEmptyState · TUX" });

const basicVue = `<tux-empty-state
  icon="lucide:folder-plus"
  title="No projects yet"
  description="Create your first project to start tracking deliverables."
>
  <tux-button intent="primary" icon="lucide:plus">
    Create project
  </tux-button>
</tux-empty-state>`;

const minimalVue = `<tux-empty-state
  icon="lucide:inbox"
  title="No records found"
/>`;

const noCardVue = `<tux-empty-state
  no-card
  icon="lucide:search-x"
  title="Nothing matches \`bridge inspections\`"
  description="Try a broader keyword or clear filters."
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxEmptyState">
      The "no data yet" pattern extracted. Icon in a tinted circle, heading,
      one sentence of context, and a CTA — always tell users what to do
      next, not just that there's nothing here.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">first-run</p>
      <h2 class="heading--bold text-xl font-bold">With action</h2>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxEmptyStateSource">
        <TuxEmptyState
          icon="lucide:folder-plus"
          title="No projects yet"
          description="Create your first project to start tracking deliverables."
        >
          <TuxButton intent="primary" icon="lucide:plus">
            Create project
          </TuxButton>
        </TuxEmptyState>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">compact</p>
      <h2 class="heading--bold text-xl font-bold">Minimal</h2>
      <p class="text-sm text-text-secondary mb-3">
        No description, no action. Fine for transient "loaded zero rows"
        cases where there's nothing actionable the user can do.
      </p>
      <TuxExample :vue="minimalVue">
        <TuxEmptyState icon="lucide:inbox" title="No records found" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">inline</p>
      <h2 class="heading--bold text-xl font-bold">Without card frame</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>no-card</code> when the empty state IS the page — e.g. a
        "no search results" state that fills the content column directly.
      </p>
      <TuxExample :vue="noCardVue">
        <TuxEmptyState
          no-card
          icon="lucide:search-x"
          title="Nothing matches `bridge inspections`"
          description="Try a broader keyword or clear filters."
        />
      </TuxExample>
    </section>
  </div>
</template>
