<script setup lang="ts">
/**
 * TuxTabs — editorial-flavored tabs.
 *
 * Thin wrapper around Nuxt UI 4's `UTabs`. Adds:
 *   - maroon underline on the active tab (replaces UTabs' default
 *     accent rule)
 *   - uppercase tracked label option (`bold`) for navigational tabs
 *     that match the rest of the catalog's eyebrow rhythm
 *   - editorial default sizing (`md`) and a separate `slim` size for
 *     dense surfaces (settings panels, sidebar embeds)
 *
 * `orientation="vertical"` is supported pass-through for settings-
 * style panels (covers the roadmap's `TuxTabsVertical` entry — same
 * component, different prop).
 *
 * State is host-driven via v-model. UTabs' `items` array passes
 * through; consumers also use the default + `#item` slots for
 * richer renderings.
 */

interface TabItem {
  value: string | number;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

interface Props {
  /** Tab items array (consumer can also use UTabs slots directly). */
  items: TabItem[];
  /** Currently active tab. */
  modelValue?: string | number;
  /** Horizontal (default) or vertical orientation. */
  orientation?: "horizontal" | "vertical";
  /** Default size, or `slim` for dense surfaces. */
  size?: "slim" | "md";
  /** Label treatment. `bold` → uppercase + tracked + Work-Sans bold;
   *  `default` → sentence-case + medium weight. */
  intent?: "default" | "bold";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  orientation: "horizontal",
  size: "md",
  intent: "default",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const local = computed({
  get: () => props.modelValue ?? props.items[0]?.value,
  set: (v) => emit("update:modelValue", v as string | number),
});
</script>

<template>
  <UTabs
    v-model="local"
    :items="items"
    :orientation="orientation"
    :ui="{
      root: 'tux-tabs',
      list: ['tux-tabs__list', `tux-tabs__list--${orientation}`, `tux-tabs__list--${size}`].join(' '),
      trigger: ['tux-tabs__trigger', `tux-tabs__trigger--${intent}`].join(' '),
      indicator: 'tux-tabs__indicator',
      content: 'tux-tabs__content',
    }"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </UTabs>
</template>

<style scoped>
.tux-tabs :deep(.tux-tabs__list) {
  position: relative;
  border-bottom: 1px solid var(--surface-border);
  gap: 0;
}
.tux-tabs :deep(.tux-tabs__list--vertical) {
  border-bottom: none;
  border-right: 1px solid var(--surface-border);
  flex-direction: column;
}
.tux-tabs :deep(.tux-tabs__trigger) {
  position: relative;
  padding: 0.75rem 1rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 120ms ease;
}
.tux-tabs :deep(.tux-tabs__trigger--bold) {
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.8125rem;
}
.tux-tabs :deep(.tux-tabs__trigger:hover) {
  color: var(--text-primary);
}
.tux-tabs :deep(.tux-tabs__trigger[data-state="active"]) {
  color: var(--brand-primary);
}
.tux-tabs :deep(.tux-tabs__indicator) {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--brand-primary);
  border-radius: 1px;
  transition: width 180ms ease, transform 180ms ease;
}
.tux-tabs :deep(.tux-tabs__list--vertical .tux-tabs__indicator) {
  bottom: auto;
  top: 0;
  left: auto;
  right: -1px;
  width: 2px;
  height: auto;
  transition: height 180ms ease, transform 180ms ease;
}
.tux-tabs :deep(.tux-tabs__list--slim .tux-tabs__trigger) {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
}
.tux-tabs :deep(.tux-tabs__content) {
  padding: 1rem 0;
}
</style>
