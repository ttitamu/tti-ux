<script setup lang="ts">
/**
 * TuxDeskModulePalette — Palette tray for inserting canonical TUX modules into TipTap.
 */
import { MODULE_LIST, type ModuleKind } from "../../utils/desk/modules";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "insert", kind: ModuleKind): void;
}>();

const iconMap: Record<ModuleKind, string> = {
  hero: "lucide:layout-template",
  callout: "lucide:alert-triangle",
  split: "lucide:columns-2",
  cards: "lucide:grid-3x3",
  steps: "lucide:list-ordered",
  cta: "lucide:megaphone",
  stats: "lucide:bar-chart-3",
};

function insert(kind: ModuleKind) {
  if (props.disabled) return;
  emit("insert", kind);
}
</script>

<template>
  <div class="tux-desk-palette" role="group" aria-label="Insert a page module">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <UIcon name="lucide:layout-grid" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
        <span class="text-xs font-bold text-text-primary uppercase tracking-wider">
          TUX Page Modules
        </span>
      </div>
      <span class="text-xs text-text-muted">Click to append block</span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5">
      <button
        v-for="spec in MODULE_LIST"
        :key="spec.kind"
        type="button"
        class="tux-desk-palette__tile"
        :disabled="disabled"
        :title="spec.hint"
        @click="insert(spec.kind)"
      >
        <div class="tux-desk-palette__icon-wrap">
          <UIcon :name="iconMap[spec.kind]" class="w-4 h-4 text-brand-primary" aria-hidden="true" />
        </div>
        <strong class="tux-desk-palette__title">{{ spec.label }}</strong>
        <span class="tux-desk-palette__hint">{{ spec.hint }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tux-desk-palette {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
}

.tux-desk-palette__tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: all var(--motion-fast) var(--ease-standard);
}

.tux-desk-palette__tile:hover:not(:disabled) {
  background: var(--surface-raised);
  border-color: var(--brand-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.tux-desk-palette__tile:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tux-desk-palette__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
  margin-bottom: 0.5rem;
}

.tux-desk-palette__title {
  font-family: var(--font-bold);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.tux-desk-palette__hint {
  margin-top: 0.25rem;
  font-size: 0.6875rem;
  line-height: 1.3;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
