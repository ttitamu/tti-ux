<script setup lang="ts">
// Vite's `?raw` query: the SFC file contents land here as a plain string,
// no duplication. That powers the `Source` tab on the gallery example below.
import tuxAlertSource from "~/components/TuxAlert.vue?raw";

useHead({ title: "TuxAlert · TUX" });

const variants = [
  "note",
  "tip",
  "info",
  "important",
  "success",
  "warning",
  "danger",
  "compliance",
] as const;

const galleryVue = `<!-- renders all 8 variants with the same props shape -->
<tux-alert
  v-for="v in variants"
  :key="v"
  :variant="v"
  :title="v"
  :description="\`This is a \${v} admonition.\`"
/>`;

const compactVue = `<tux-alert
  variant="tip"
  title="Use \`heading--bold\` for section titles, not page chrome."
/>`;

const iconVue = `<tux-alert
  variant="info"
  icon="lucide:database"
  title="Saved to server"
  description="Pass any Lucide icon name via \`icon\` to override the variant default."
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxAlert">
      Wraps <code>UAlert</code>. Adds a 4px left border in the admonition's
      own color family — Docusaurus-style rhythm that Nuxt UI's <code>subtle</code>
      variant omits by default. <code>important</code> and <code>compliance</code>
      both lean on brand maroon but at different visual weights (subtle vs. solid).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">all variants</p>
      <h2 class="heading--bold text-xl font-bold">Gallery</h2>
      <TuxExample
        class="mt-4"
        title="All 8 variants"
        :vue="galleryVue"
        :source="tuxAlertSource"
      >
        <div class="space-y-3">
          <TuxAlert
            v-for="v in variants"
            :key="v"
            :variant="v"
            :title="v.charAt(0).toUpperCase() + v.slice(1)"
            :description="`This is a ${v} admonition. Left bar picks up the variant's color family.`"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">title only</p>
      <h2 class="heading--bold text-xl font-bold">Compact form</h2>
      <p class="text-sm text-text-secondary mb-4">
        Omit <code>description</code> for a single-line admonition — good for
        inline heads-up messages in table cells or form fields.
      </p>
      <TuxExample :vue="compactVue">
        <TuxAlert variant="tip" title="Use `heading--bold` for section titles, not page chrome." />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">custom icon</p>
      <h2 class="heading--bold text-xl font-bold">Override icon</h2>
      <TuxExample :vue="iconVue">
        <TuxAlert
          variant="info"
          icon="lucide:database"
          title="Saved to server"
          description="Pass any Lucide icon name via `icon` to override the variant default."
        />
      </TuxExample>
    </section>
  </div>
</template>
