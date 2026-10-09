<script setup lang="ts">
/**
 * TuxChartPatternsDefs — Reusable SVG `<pattern>` definitions for CVD /
 * monochrome texture hatching across bar charts, donut charts, and area fills.
 *
 * Each pattern utilizes high-contrast dual-line geometry (a surface cutout stroke
 * paired with a subtle contrast keyline) to remain crisp on dark, light, and
 * high-contrast canvases alike.
 */
interface Props {
  prefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: "tux-pat-",
});
</script>

<template>
  <defs class="tux-chart-patterns-defs">
    <!-- 1. Diagonal Right (45°) -->
    <pattern
      :id="`${prefix}diag-right`"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="10" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <line x1="0" y1="0" x2="0" y2="10" stroke="black" stroke-opacity="0.25" stroke-width="1" />
    </pattern>

    <!-- 2. Diagonal Left (135°) -->
    <pattern
      :id="`${prefix}diag-left`"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(-45)"
    >
      <line x1="0" y1="0" x2="0" y2="10" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <line x1="0" y1="0" x2="0" y2="10" stroke="black" stroke-opacity="0.25" stroke-width="1" />
    </pattern>

    <!-- 3. Stipple Dots -->
    <pattern
      :id="`${prefix}dots`"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle cx="5" cy="5" r="2" fill="var(--surface-page, #ffffff)" fill-opacity="0.85" />
      <circle cx="5" cy="5" r="1.2" fill="black" fill-opacity="0.3" />
    </pattern>

    <!-- 4. Crosshatch Grid -->
    <pattern
      :id="`${prefix}crosshatch`"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <line x1="0" y1="5" x2="10" y2="5" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <line x1="5" y1="0" x2="5" y2="10" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <line x1="0" y1="5" x2="10" y2="5" stroke="black" stroke-opacity="0.25" stroke-width="1" />
      <line x1="5" y1="0" x2="5" y2="10" stroke="black" stroke-opacity="0.25" stroke-width="1" />
    </pattern>

    <!-- 5. Horizontal Stripes -->
    <pattern
      :id="`${prefix}horizontal`"
      width="10"
      height="8"
      patternUnits="userSpaceOnUse"
    >
      <line x1="0" y1="4" x2="10" y2="4" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <line x1="0" y1="4" x2="10" y2="4" stroke="black" stroke-opacity="0.25" stroke-width="1" />
    </pattern>

    <!-- 6. Vertical Stripes -->
    <pattern
      :id="`${prefix}vertical`"
      width="8"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <line x1="4" y1="0" x2="4" y2="10" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <line x1="4" y1="0" x2="4" y2="10" stroke="black" stroke-opacity="0.25" stroke-width="1" />
    </pattern>

    <!-- 7. Diamonds Mesh -->
    <pattern
      :id="`${prefix}diamonds`"
      width="12"
      height="12"
      patternUnits="userSpaceOnUse"
    >
      <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="var(--surface-page, #ffffff)" stroke-width="2.5" stroke-opacity="0.8" />
      <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="black" stroke-opacity="0.25" stroke-width="1" />
    </pattern>
  </defs>
</template>
