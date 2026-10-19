<script setup lang="ts">
import TuxDiagramImpl from "../../packages/diagrams/app/components/TuxDiagram.vue";

interface Props {
  /** Mermaid source. Required. */
  code: string;
  /** Optional caption shown below the rendered diagram (figcaption). */
  caption?: string;
  /** Optional eyebrow above the diagram (e.g. "Figure 3"). */
  eyebrow?: string;
}

const props = withDefaults(defineProps<Props>(), {
  caption: undefined,
  eyebrow: undefined,
});
</script>

<template>
  <TuxDiagramImpl v-bind="props" />
</template>
