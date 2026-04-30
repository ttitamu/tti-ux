<script setup lang="ts">
useHead({ title: "Forms · TUX" });

const tiles = [
  {
    label: "TuxTextField",
    to: "/forms/text-field",
    icon: "lucide:type",
    primitive: "UInput · UTextarea",
    blurb: "Single-line + textarea. State matrix: default · focus · filled · error · disabled · readonly · with helper · with counter.",
  },
  {
    label: "TuxSelect",
    to: "/forms/select",
    icon: "lucide:list",
    primitive: "USelectMenu",
    blurb: "Single-select dropdown + searchable combobox. With descriptions, tier-coded values, and the chips fallback.",
  },
  {
    label: "TuxChoice",
    to: "/forms/choice",
    icon: "lucide:check-square",
    primitive: "UCheckbox · URadioGroup",
    blurb: "Checkbox-group + radio-group with select-all and indeterminate states.",
  },
  {
    label: "TuxDatePicker",
    to: "/forms/date-picker",
    icon: "lucide:calendar",
    primitive: "UInput type=date",
    blurb: "Native date input with helper copy + min/max bounds.",
  },
  {
    label: "TuxFileUpload",
    to: "/forms/file-upload",
    icon: "lucide:upload",
    primitive: "tux native",
    blurb: "Drag-drop dropzone, file list, progress, multi-file upload pattern.",
  },
  {
    label: "TuxInlineValidation",
    to: "/forms/inline-validation",
    icon: "lucide:check-circle-2",
    primitive: "UInput + composables",
    blurb: "Live validation patterns — masked inputs (phone, NIH grant), character counters, async \"this is taken\".",
  },
];
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="primitives" title="Forms">
      Nuxt UI form primitives with TTI theming — maroon focus rings,
      consistent label styling, and the tux <code>heading--bold</code>
      for section titles inside forms. No Tux wrappers here yet:
      Nuxt UI's form primitives don't need deviation to fit the brand.
      <br><br>
      <span class="text-sm text-text-muted">
        These pages document the full state matrix per primitive.
        For an end-to-end form composing all of them at once, see
        <NuxtLink to="/forms/all-in-one" class="link-tti">the all-in-one demo</NuxtLink>.
      </span>
    </TuxPageHeader>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink
        v-for="t in tiles"
        :key="t.to"
        :to="t.to"
        class="card-linked p-5 flex gap-4 items-start"
      >
        <UIcon :name="t.icon" class="w-6 h-6 text-text-brand flex-shrink-0 mt-1" />
        <div>
          <p class="eyebrow">{{ t.primitive }}</p>
          <h3 class="heading--bold text-base font-bold">{{ t.label }}</h3>
          <p class="mt-1 text-sm text-text-secondary leading-relaxed">{{ t.blurb }}</p>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>
