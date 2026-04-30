<script setup lang="ts">
useHead({ title: "Choice (checkbox + radio) · Forms · TUX" });

const checks = ref({
  ingest: true,
  classify: true,
  publish: false,
  archive: false,
});

const radio = ref<"report" | "memo" | "brief" | "letter">("report");

const allChecks = computed({
  get: () => Object.values(checks.value).every(Boolean),
  set: (v: boolean) => {
    checks.value = {
      ingest: v, classify: v, publish: v, archive: v,
    };
  },
});

const someChecks = computed(() =>
  Object.values(checks.value).some(Boolean) && !allChecks.value
);
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="forms · primitive" title="Choice">
      Checkbox groups + radio groups. Built on Nuxt UI's
      <code>UCheckbox</code> + <code>URadioGroup</code>. The two
      patterns answer different questions: <em>checkbox</em> = "any
      number of these"; <em>radio</em> = "exactly one of these".
    </TuxPageHeader>

    <section>
      <p class="eyebrow">checkbox group</p>
      <h2 class="heading--bold text-xl font-bold">With select-all + indeterminate</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Pipeline stages">
          <UCheckbox
            label="Run all stages"
            :model-value="allChecks"
            :indeterminate="someChecks"
            @update:model-value="(v) => allChecks = !!v"
          />
          <div class="mt-3 ml-6 space-y-2">
            <UCheckbox v-model="checks.ingest"   label="Ingest" />
            <UCheckbox v-model="checks.classify" label="Classify" />
            <UCheckbox v-model="checks.publish"  label="Publish" />
            <UCheckbox v-model="checks.archive"  label="Archive" />
          </div>
        </UFormField>

        <UFormField label="States">
          <div class="space-y-3">
            <UCheckbox label="Default unchecked" />
            <UCheckbox label="Checked" model-value />
            <UCheckbox label="Indeterminate" indeterminate />
            <UCheckbox label="Disabled unchecked" disabled />
            <UCheckbox label="Disabled checked" disabled model-value />
          </div>
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">radio group</p>
      <h2 class="heading--bold text-xl font-bold">Single choice from a bounded set</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Document type" required>
          <URadioGroup v-model="radio" :items="[
            { label: 'Report', value: 'report', description: 'Full technical report with findings + methodology' },
            { label: 'Memo',   value: 'memo',   description: 'Internal memorandum, shorter format' },
            { label: 'Brief',  value: 'brief',  description: 'Executive summary, 1\u20132 pages' },
            { label: 'Letter', value: 'letter', description: 'Sponsor-facing cover letter' },
          ]" />
        </UFormField>

        <UFormField label="Inline (no descriptions)">
          <URadioGroup
            v-model="radio"
            :items="[
              { label: 'Public',     value: 'public' },
              { label: 'Internal',   value: 'internal' },
              { label: 'Sensitive',  value: 'sensitive' },
              { label: 'Restricted', value: 'restricted' },
            ]"
            orientation="horizontal"
          />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">When to reach for which</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li><strong>Checkbox group</strong> when "any subset, possibly none" — pipeline stages, optional features, multiple categories.</li>
        <li><strong>Radio group</strong> when "exactly one, never zero" — document type, classification tier, single status.</li>
        <li><strong>Switch</strong> (<code>USwitch</code>) when the choice is binary <em>and</em> the action takes effect immediately — privacy toggle, dark mode.</li>
        <li>If choices exceed ~6 items, switch to <NuxtLink to="/forms/select" class="link-tti">a select dropdown</NuxtLink>.</li>
      </ul>
    </section>
  </div>
</template>
