<script setup lang="ts">
useHead({ title: "Select · Forms · TUX" });

const tiers = [
  { label: "Public",     value: "public",     description: "Discoverable by default" },
  { label: "Internal",   value: "internal",   description: "TAMUS-only" },
  { label: "Sensitive",  value: "sensitive",  description: "PII / confidential" },
  { label: "Restricted", value: "restricted", description: "Export-controlled / legal" },
];

const sponsors = [
  { label: "Texas DOT",         value: "txdot" },
  { label: "FHWA",              value: "fhwa" },
  { label: "NSF",               value: "nsf" },
  { label: "NIH",               value: "nih" },
  { label: "Texas A&M System",  value: "tamus" },
  { label: "City of Bryan",     value: "bryan" },
  { label: "City of College Station", value: "cs" },
];

const tier = ref(tiers[2]!);
const sponsor = ref(sponsors[0]!);
const multi = ref<typeof sponsors>([sponsors[0]!, sponsors[1]!]);
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="forms · primitive" title="Select">
      Single-select dropdown with optional search (combobox). Built on
      <code>USelectMenu</code>. Items can carry a <code>description</code>
      that renders below the label — useful for the TAMUS data
      classification tiers and any tier-coded value list.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">With descriptions</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Data classification" required>
          <USelectMenu v-model="tier" :items="tiers" />
          <template #help>
            <span class="text-xs text-text-muted">{{ tier.description }}</span>
          </template>
        </UFormField>
        <UFormField label="Default · without descriptions">
          <USelectMenu v-model="sponsor" :items="sponsors" />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">searchable</p>
      <h2 class="heading--bold text-xl font-bold">Combobox</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Sponsor" help="Type to filter.">
          <USelectMenu v-model="sponsor" :items="sponsors" searchable />
        </UFormField>
        <UFormField label="With creatable values" help="Add a new entry inline.">
          <USelectMenu v-model="sponsor" :items="sponsors" searchable creatable />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">multi-select</p>
      <h2 class="heading--bold text-xl font-bold">Tag-shaped multi</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Sponsors" help="Select multiple.">
          <USelectMenu v-model="multi" :items="sponsors" multiple searchable />
        </UFormField>
        <UFormField label="Disabled">
          <USelectMenu :model-value="tiers[0]" :items="tiers" disabled />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">when not to reach for this</p>
      <h2 class="heading--bold text-lg font-bold">Three near-neighbors</h2>
      <ul class="mt-2 text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
        <li>≤ 4 short choices, all visible at once → use a radio group (<NuxtLink to="/forms/choice" class="link-tti">/forms/choice</NuxtLink>).</li>
        <li>Free-text + suggestions, not a closed set → use <code>UInputMenu</code> autocomplete.</li>
        <li>Multi-select with topic-tag affordances → see the chip-input pattern in <NuxtLink to="/forms/all-in-one" class="link-tti">all-in-one</NuxtLink>.</li>
      </ul>
    </section>
  </div>
</template>
