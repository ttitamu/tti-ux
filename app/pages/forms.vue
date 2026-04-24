<script setup lang="ts">
useHead({ title: "Forms · tti-ux" });

const text = ref("");
const password = ref("");
const textarea = ref("");
const search = ref("");

const selectOptions = [
  { label: "Public",     value: "public",     description: "Discoverable by default" },
  { label: "Internal",   value: "internal",   description: "TAMUS-only" },
  { label: "Sensitive",  value: "sensitive",  description: "PII / confidential" },
  { label: "Restricted", value: "restricted", description: "Export-controlled / legal" },
];
const selected = ref(selectOptions[2]);

const checks = ref({ pii: true, license: false, format: false });
const radio = ref<"tika" | "presidio" | "gliner">("tika");
const toggle = ref(true);
const slider = ref(50);
const date = ref("");

const chips = ref(["pii:us_ssn", "pii:email"]);
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
      label styling, and the aggieux <code>heading--bold</code> for section titles
      inside forms. No Tux wrappers here yet: Nuxt UI's form primitives don't need
      deviation to fit the brand.
    </TuxPageHeader>

    <TuxCard :padded="true">
      <form class="space-y-8" @submit.prevent="submit">
        <TuxSectionHeader :level="2" subtitle="Required fields marked with a maroon dot">
          Text inputs
        </TuxSectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Index name" required>
            <UInput v-model="text" placeholder="q1-research-grants" />
          </UFormField>

          <UFormField label="Admin password" required>
            <UInput v-model="password" type="password" placeholder="••••••••" />
          </UFormField>

          <UFormField label="Search" help="Keyword or semantic.">
            <UInput v-model="search" icon="lucide:search" placeholder="Search scans…" />
          </UFormField>

          <UFormField label="Created after" help="ISO date.">
            <UInput v-model="date" type="date" />
          </UFormField>
        </div>

        <UFormField label="Description" help="Markdown supported. Appears in the index card.">
          <UTextarea v-model="textarea" :rows="3" placeholder="One-line summary of this index…" />
        </UFormField>

        <TuxSectionHeader :level="2" subtitle="Single choice from a bounded set">
          Select &amp; radio
        </TuxSectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Classification tier" required>
            <USelectMenu v-model="selected" :items="selectOptions" />
            <template #help>
              <span class="text-xs text-text-muted">{{ selected.description }}</span>
            </template>
          </UFormField>

          <UFormField label="Text extractor">
            <URadioGroup v-model="radio" :items="[
              { label: 'Tika',     value: 'tika',     description: 'Apache Tika — most formats, slowest' },
              { label: 'Presidio', value: 'presidio', description: 'Microsoft — PII-focused, medium speed' },
              { label: 'GLiNER',   value: 'gliner',   description: 'Zero-shot NER — fastest, needs GPU' },
            ]" />
          </UFormField>
        </div>

        <TuxSectionHeader :level="2" subtitle="Boolean toggles and multi-select">
          Checkboxes &amp; switch
        </TuxSectionHeader>

        <div class="space-y-3">
          <UCheckbox v-model="checks.pii" label="Run PII classifier (Presidio + GLiNER)" />
          <UCheckbox v-model="checks.license" label="Detect software license headers" />
          <UCheckbox v-model="checks.format" label="Record file-format distribution (MIME + extension)" />
        </div>

        <UFormField
          label="Index is publicly discoverable"
          help="When off, only TAMUS-authenticated users can see this index."
        >
          <USwitch v-model="toggle" />
        </UFormField>

        <TuxSectionHeader :level="2" subtitle="Continuous range inputs">
          Slider
        </TuxSectionHeader>

        <UFormField :label="`Classifier confidence threshold (${slider}%)`" help="Below this score, tags are suppressed.">
          <USlider v-model="slider" :min="0" :max="100" :step="5" />
        </UFormField>

        <TuxSectionHeader :level="2" subtitle="Token-style list with inline add">
          Chip input
        </TuxSectionHeader>

        <UFormField label="Required classifier tags" help="Scans fail if any of these are missing from the output.">
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
            <TuxButton intent="primary" type="submit" icon="lucide:check">Save index</TuxButton>
          </div>
        </div>
      </form>
    </TuxCard>

    <TuxAlert
      v-if="submitted"
      variant="success"
      title="Form submitted"
      description="In a real app, this would POST to /api/indices and route to the new index's detail page."
    />

    <section>
      <TuxSectionHeader :level="2">Validation</TuxSectionHeader>
      <p class="text-sm text-text-secondary max-w-2xl">
        Nuxt UI 4 ships with validation via <code>UForm</code> + a schema library
        of your choice (Zod, Valibot, Yup). The showcase above uses bare
        <code>UFormField</code>s for clarity; in production apps, wrap in
        <code>&lt;UForm :schema="..." :state="..."&gt;</code> and Nuxt UI handles
        error display automatically. Errors adopt the maroon focus ring and
        <code>--color-error</code> text — no extra styling needed.
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
