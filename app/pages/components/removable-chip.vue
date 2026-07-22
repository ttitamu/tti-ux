<script setup lang="ts">
import tuxRemovableChipSource from "~/components/TuxRemovableChip.vue?raw";

useHead({ title: "TuxRemovableChip · TUX" });

const removed = ref<string[]>([]);

const filters = ref([
  { facet: "tier",  label: "ITAR" },
  { facet: "tier",  label: "Restricted" },
  { facet: "owner", label: "R. Chen" },
]);

function dropFilter(label: string) {
  removed.value.push(label);
  filters.value = filters.value.filter(f => f.label !== label);
}

const basicVue = `<tux-removable-chip removable @remove="onRemove">
  Filter label
</tux-removable-chip>`;

const filterChipVue = `<tux-removable-chip
  v-for="f in filters"
  :key="f.label"
  size="sm"
  removable
  click-to-remove
  @remove="dropFilter(f.label)"
>
  <span class="text-text-muted">{{ f.facet }}:</span>
  <strong class="ml-1">{{ f.label }}</strong>
</tux-removable-chip>`;

const selectedVue = `<tux-removable-chip selected icon="lucide:filter">
  Active filter
</tux-removable-chip>
<tux-removable-chip icon="lucide:filter">
  Inactive filter
</tux-removable-chip>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxRemovableChip">
      Interactive dismissible pill primitive. Distinct from
      <code>TuxBadge</code> (decorative): this is button-shaped,
      focusable, and emits events. Use for applied-filter chips, tag-input
      pills, recipient lists, selected-corpus indicators. Three sizes,
      optional leading icon, <code>selected</code> fills with brand color,
      <code>removable</code> shows an <code>×</code> (or
      <code>clickToRemove</code> makes the whole pill the hit target).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">With remove button</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>removable</code> to show a separate
        <code>×</code> button at the right. Clicking the
        <code>×</code> emits <code>@remove</code>; the rest of the pill
        is non-interactive.
      </p>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxRemovableChipSource">
        <div class="flex flex-wrap gap-2">
          <TuxRemovableChip removable>Filter label</TuxRemovableChip>
          <TuxRemovableChip removable icon="lucide:filter">With icon</TuxRemovableChip>
          <TuxRemovableChip size="lg" removable>Large</TuxRemovableChip>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">click-to-remove</p>
      <h2 class="heading--bold text-xl font-bold">Whole-pill click removes</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>click-to-remove</code> for the applied-filter
        pattern: the <code>×</code> renders as a decorative glyph and
        the whole pill is the click target. Used inside
        <code>TuxFilterPanel</code> for applied-filter chips.
      </p>
      <TuxExample :vue="filterChipVue">
        <div class="flex flex-wrap gap-2">
          <TuxRemovableChip
            v-for="f in filters"
            :key="f.label"
            size="sm"
            removable
            click-to-remove
            :remove-label="`Remove ${f.facet}: ${f.label}`"
            @remove="dropFilter(f.label)"
          >
            <span class="text-text-muted">{{ f.facet }}:</span>
            <strong class="ml-1">{{ f.label }}</strong>
          </TuxRemovableChip>
          <p v-if="filters.length === 0" class="text-xs text-text-muted italic self-center">
            (all removed — refresh page to restore)
          </p>
        </div>
        <p v-if="removed.length" class="mt-3 text-xs text-text-muted">
          dropped: <code>{{ removed.join(", ") }}</code>
        </p>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">selected state</p>
      <h2 class="heading--bold text-xl font-bold">Selected vs default</h2>
      <p class="text-sm text-text-secondary mb-3">
        <code>selected</code> fills with brand color — useful for
        toggle-style chips (a facet that's currently applied vs. one
        that isn't).
      </p>
      <TuxExample :vue="selectedVue">
        <div class="flex flex-wrap gap-2">
          <TuxRemovableChip selected icon="lucide:filter">Active filter</TuxRemovableChip>
          <TuxRemovableChip icon="lucide:filter">Inactive filter</TuxRemovableChip>
          <TuxRemovableChip selected removable icon="lucide:filter">Active + removable</TuxRemovableChip>
        </div>
      </TuxExample>
    </section>
  </div>
</template>
