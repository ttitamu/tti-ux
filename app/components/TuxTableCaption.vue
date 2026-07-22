<script setup lang="ts">
/**
 * TuxTableCaption — auto-numbered caption for tables.
 *
 * Identical to `TuxFigureCaption` but defaults to `kind="Table"`
 * + `placement="above"` (the conventional academic placement —
 * figures captioned below, tables captioned above).
 *
 * Composable with both `TuxTable` and `TuxDataTable`. Note: this
 * is a *standalone* caption — TuxDataTable already includes a
 * numbered caption internally. Use this when you need the
 * caption shape over a plain HTML `<table>` or a third-party
 * rendered table (e.g. an R-generated DataFrame).
 */
interface Props {
  kind?: string;
  number: number | string;
  caption?: string;
  source?: string;
  placement?: "above" | "below";
}

withDefaults(defineProps<Props>(), {
  kind: "Table",
  caption: undefined,
  source: undefined,
  placement: "above",
});
</script>

<template>
  <!-- Reuses TuxFigureCaption's geometry — same styling, different
       semantic kind+placement defaults. Consumers can override
       either prop if their convention differs. -->
  <TuxFigureCaption
    :kind="kind"
    :number="number"
    :caption="caption"
    :source="source"
    :placement="placement"
  >
    <slot />
    <template v-if="$slots.caption" #caption><slot name="caption" /></template>
    <template v-if="$slots.source" #source><slot name="source" /></template>
  </TuxFigureCaption>
</template>
