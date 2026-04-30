<script setup lang="ts">
useHead({ title: "Text field · Forms · TUX" });

const text = ref("");
const filled = ref("corridor-speed-study-2026");
const counter = ref("Quarterly summary of corridor program");
const textarea = ref("");
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="forms · primitive" title="Text field">
      Single-line and multi-line text inputs. Built on Nuxt UI's
      <code>UInput</code> + <code>UTextarea</code>; no Tux wrapper —
      the primitives already adopt the TTI maroon focus ring via
      <code>--shadow-focus</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">state matrix</p>
      <h2 class="heading--bold text-xl font-bold">Single-line · UInput</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Default · empty">
          <UInput v-model="text" placeholder="corridor-speed-study-2026" />
        </UFormField>
        <UFormField label="Filled" help="Pre-populated value.">
          <UInput v-model="filled" />
        </UFormField>
        <UFormField label="With leading icon">
          <UInput placeholder="Search records…" icon="lucide:search" />
        </UFormField>
        <UFormField label="With trailing button">
          <UInput placeholder="https://example.org">
            <template #trailing>
              <UButton color="neutral" variant="ghost" size="xs" icon="lucide:copy" />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Disabled">
          <UInput model-value="locked-by-policy" disabled />
        </UFormField>
        <UFormField label="Readonly">
          <UInput model-value="auto-generated-id-091" readonly />
        </UFormField>
        <UFormField label="Error" error="Project name must be unique.">
          <UInput model-value="duplicate-name" />
        </UFormField>
        <UFormField label="With helper" help="Use lowercase, hyphens, no spaces.">
          <UInput placeholder="my-project-name" />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">multi-line</p>
      <h2 class="heading--bold text-xl font-bold">UTextarea</h2>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Default · 3 rows">
          <UTextarea v-model="textarea" :rows="3" placeholder="One-line summary…" />
        </UFormField>
        <UFormField label="With character counter" :help="`${counter.length} / 280`">
          <UTextarea v-model="counter" :rows="3" :maxlength="280" />
        </UFormField>
        <UFormField label="Auto-resize" help="rows scale with content (autoresize prop)">
          <UTextarea autoresize :rows="2" placeholder="Type to expand…" />
        </UFormField>
        <UFormField label="Error" error="Description is required.">
          <UTextarea :rows="3" />
        </UFormField>
      </div>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Validation</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Wrap inputs in <code>&lt;UForm :schema :state&gt;</code> with
        Zod / Valibot / Yup for declarative validation; errors flow
        into <code>UFormField error</code> automatically. For
        per-field live validation patterns (masked input, async
        uniqueness, character counters), see
        <NuxtLink to="/forms/inline-validation" class="link-tti">/forms/inline-validation</NuxtLink>.
      </p>
    </section>
  </div>
</template>
