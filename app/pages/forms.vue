<script setup lang="ts">
useHead({ title: "Forms · TUX" });

const text = ref("");
const password = ref("");
const textarea = ref("");
const search = ref("");

// Classification tiers reflect the TAMUS data-classification policy —
// public / internal / sensitive / restricted — shared across all consuming
// apps, not specific to any one.
const selectOptions = [
  { label: "Public",     value: "public",     description: "Discoverable by default" },
  { label: "Internal",   value: "internal",   description: "TAMUS-only" },
  { label: "Sensitive",  value: "sensitive",  description: "PII / confidential" },
  { label: "Restricted", value: "restricted", description: "Export-controlled / legal" },
];
const selected = ref(selectOptions[2]);

const checks = ref({ notify: true, archive: false, public: false });
const radio = ref<"report" | "memo" | "brief">("report");
const toggle = ref(true);
const slider = ref(50);
const date = ref("");

const chips = ref(["topic:safety", "topic:mobility"]);
const newChip = ref("");
function addChip() {
  const v = newChip.value.trim();
  if (v && !chips.value.includes(v)) {
    chips.value.push(v);
  }
  newChip.value = "";
}
function removeChip(c: string) {
  chips.value = chips.value.filter((x) => x !== c);
}

const submitted = ref(false);
function submit() {
  submitted.value = true;
  setTimeout(() => (submitted.value = false), 3000);
}
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="primitives" title="Forms">
      Nuxt UI form primitives with TTI theming — maroon focus rings, consistent
      label styling, and the tux <code>heading--bold</code> for section
      titles inside forms. No Tux wrappers here yet: Nuxt UI's form primitives
      don't need deviation to fit the brand.
    </TuxPageHeader>

    <TuxCard :padded="true">
      <form class="space-y-8" @submit.prevent="submit">
        <TuxSectionHeader :level="2" subtitle="Required fields marked with a maroon dot">
          Text inputs
        </TuxSectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Project name" required>
            <UInput v-model="text" placeholder="corridor-speed-study-2026" />
          </UFormField>

          <UFormField label="Admin password" required>
            <UInput v-model="password" type="password" placeholder="••••••••" />
          </UFormField>

          <UFormField label="Search" help="Filter by title or keyword.">
            <UInput v-model="search" icon="lucide:search" placeholder="Search records…" />
          </UFormField>

          <UFormField label="Created after" help="ISO date.">
            <UInput v-model="date" type="date" />
          </UFormField>
        </div>

        <UFormField label="Description" help="Markdown supported. Appears in the project card.">
          <UTextarea v-model="textarea" :rows="3" placeholder="One-line summary…" />
        </UFormField>

        <TuxSectionHeader :level="2" subtitle="Single choice from a bounded set">
          Select &amp; radio
        </TuxSectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Data classification" required>
            <USelectMenu v-model="selected" :items="selectOptions" />
            <template #help>
              <span class="text-xs text-text-muted">{{ selected.description }}</span>
            </template>
          </UFormField>

          <UFormField label="Document type">
            <URadioGroup v-model="radio" :items="[
              { label: 'Report',       value: 'report', description: 'Full technical report with findings + methodology' },
              { label: 'Memo',         value: 'memo',   description: 'Internal memorandum, shorter format' },
              { label: 'Brief',        value: 'brief',  description: 'Executive summary, 1–2 pages' },
            ]" />
          </UFormField>
        </div>

        <TuxSectionHeader :level="2" subtitle="Boolean toggles and multi-select">
          Checkboxes &amp; switch
        </TuxSectionHeader>

        <div class="space-y-3">
          <UCheckbox v-model="checks.notify" label="Notify reviewers when the record is saved" />
          <UCheckbox v-model="checks.archive" label="Archive the previous version on save" />
          <UCheckbox v-model="checks.public" label="Include in the public search index" />
        </div>

        <UFormField
          label="Record is publicly discoverable"
          help="When off, only TAMUS-authenticated users can see this record."
        >
          <USwitch v-model="toggle" />
        </UFormField>

        <TuxSectionHeader :level="2" subtitle="Continuous range inputs">
          Slider
        </TuxSectionHeader>

        <UFormField :label="`Review threshold (${slider}%)`" help="Only records scoring above this threshold are surfaced to reviewers.">
          <USlider v-model="slider" :min="0" :max="100" :step="5" />
        </UFormField>

        <TuxSectionHeader :level="2" subtitle="Token-style list with inline add">
          Chip input
        </TuxSectionHeader>

        <UFormField label="Topic tags" help="Used to cross-link related records.">
          <div class="flex flex-wrap items-center gap-2">
            <TuxBadge v-for="c in chips" :key="c" kind="tag">
              {{ c }}
              <button
                type="button"
                class="ml-1 hover:text-text-brand"
                :aria-label="`Remove ${c}`"
                @click="removeChip(c)"
              >
                <UIcon name="lucide:x" class="w-3 h-3" />
              </button>
            </TuxBadge>
            <UInput
              v-model="newChip"
              size="sm"
              placeholder="add tag…"
              class="w-40"
              @keydown.enter.prevent="addChip"
            />
          </div>
        </UFormField>

        <div class="flex items-center justify-between pt-6 border-t border-surface-border">
          <p class="text-xs text-text-muted">
            State preview:
            <code class="font-mono">
              {{ { text, password: password ? "•".repeat(password.length) : "", search, selected: selected.value, radio, checks, toggle, slider, date, chips } }}
            </code>
          </p>
          <div class="flex gap-2">
            <TuxButton intent="ghost" type="reset">Reset</TuxButton>
            <TuxButton intent="primary" type="submit" icon="lucide:check">Save</TuxButton>
          </div>
        </div>
      </form>
    </TuxCard>

    <TuxAlert
      v-if="submitted"
      variant="success"
      title="Form submitted"
      description="In a real app this would POST to the server and route to the detail page."
    />

    <section>
      <TuxSectionHeader :level="2">Validation</TuxSectionHeader>
      <p class="text-sm text-text-secondary max-w-2xl">
        Nuxt UI 4 ships with validation via <code>UForm</code> + a schema
        library of your choice (Zod, Valibot, Yup). The showcase above uses
        bare <code>UFormField</code>s for clarity; in production apps, wrap in
        <code>&lt;UForm :schema="..." :state="..."&gt;</code> and Nuxt UI
        handles error display automatically. Errors adopt the maroon focus
        ring and <code>--color-error</code> text — no extra styling needed.
      </p>
    </section>

    <section>
      <TuxSectionHeader :level="2">Focus rings</TuxSectionHeader>
      <p class="text-sm text-text-secondary max-w-2xl mb-3">
        All interactive elements get the TTI maroon focus ring via
        <code>--shadow-focus</code> in <code>tokens.css</code>. Tab through the
        form above to see — the ring adapts to theme (lighter in dark mode,
        fully black in high-contrast).
      </p>
    </section>
  </div>
</template>
