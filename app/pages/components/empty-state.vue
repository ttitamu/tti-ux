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

const compactVue = `<tux-empty-state
  compact
  icon="lucide:filter-x"
  title="No matches in this facet"
  description="Try widening one of the active filters."
/>`;

const presetVue = `<!-- Five preset kinds: no-data, no-results, not-found,
     no-permissions, first-run. Each fills sensible defaults. -->
<tux-empty-state kind="no-results">
  <tux-button intent="ghost" icon="lucide:filter-x">Clear filters</tux-button>
</tux-empty-state>`;

const presetOverrideVue = `<!-- Override one field; preset fills the rest. -->
<tux-empty-state kind="first-run" title="Welcome to Landscape">
  <tux-button intent="primary" icon="lucide:plus">Create your first index</tux-button>
</tux-empty-state>`;
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

    <section>
      <p class="eyebrow">compact</p>
      <h2 class="heading--bold text-xl font-bold">Smaller-scale variant</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>compact</code> when the empty state lives inside a
        narrow column or tight panel — facet results, inline list area,
        sidebar widget. Reduces icon, heading, and padding without
        changing the content shape.
      </p>
      <TuxExample :vue="compactVue">
        <TuxEmptyState
          compact
          icon="lucide:filter-x"
          title="No matches in this facet"
          description="Try widening one of the active filters."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">presets</p>
      <h2 class="heading--bold text-xl font-bold">Named preset kinds</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>kind</code> to use one of the five most-reused empty-
        state shapes. Each preset pre-fills icon + title + description;
        explicit <code>icon</code> / <code>title</code> /
        <code>description</code> props still win when set.
      </p>
      <TuxExample :vue="presetVue">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TuxEmptyState kind="no-data" compact />
          <TuxEmptyState kind="no-results" compact>
            <TuxButton intent="ghost" icon="lucide:filter-x">Clear filters</TuxButton>
          </TuxEmptyState>
          <TuxEmptyState kind="not-found" compact>
            <TuxButton intent="ghost" icon="lucide:arrow-left">Back to index</TuxButton>
          </TuxEmptyState>
          <TuxEmptyState kind="no-permissions" compact />
          <TuxEmptyState kind="first-run" compact>
            <TuxButton intent="primary" icon="lucide:plus">Get started</TuxButton>
          </TuxEmptyState>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">preset override</p>
      <h2 class="heading--bold text-xl font-bold">Preset + per-field override</h2>
      <p class="text-sm text-text-secondary mb-3">
        Mix and match: use a preset as the baseline, then override the
        title or description to match the surface's voice. The icon
        still defaults from the preset unless you replace it too.
      </p>
      <TuxExample :vue="presetOverrideVue">
        <TuxEmptyState kind="first-run" title="Welcome to Landscape">
          <TuxButton intent="primary" icon="lucide:plus">Create your first index</TuxButton>
        </TuxEmptyState>
      </TuxExample>
    </section>
  </div>
</template>
