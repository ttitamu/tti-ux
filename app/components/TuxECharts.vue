<script setup lang="ts">
/**
 * TuxECharts.vue — Re-export from @tti/tti-ux-charts package for backward compatibility.
 */
import TuxECharts from "../../packages/charts/app/components/TuxECharts.vue";
</script>

<template>
  <TuxECharts v-bind="$attrs">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </TuxECharts>
</template>
