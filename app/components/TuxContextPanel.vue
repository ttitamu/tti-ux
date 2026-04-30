<script setup lang="ts">
/**
 * TuxContextPanel — right-rail surface for showing the assistant's
 * grounding context: corpora attached, retrieval settings, usage
 * metrics. The body is fully slot-driven so callers can put whatever
 * fits. The component contributes the panel chrome (border, scroll,
 * width) and a consistent inner padding scheme.
 *
 * Pattern from tti-ai-chat: three vertical zones — CORPUS · RETRIEVAL
 * · USAGE — each typically a TuxSectionHeader followed by a body. The
 * panel doesn't enforce that grouping; it just gives you the rail.
 */
interface Props {
  width?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 320,
});

const computedWidth = computed(() =>
  typeof props.width === "number" ? `${props.width}px` : props.width
);
</script>

<template>
  <aside
    class="tux-context-panel"
    :style="{ width: computedWidth }"
    aria-label="Conversation context"
  >
    <slot />
  </aside>
</template>

<style scoped>
.tux-context-panel {
  border-left: 1px solid var(--surface-border);
  background: var(--surface-raised);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: 1.375rem;
  gap: 0.5rem;
  container-type: inline-size;
  container-name: tux-context-panel;
}
</style>
