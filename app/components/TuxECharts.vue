<script setup lang="ts">
/**
 * TuxECharts — First-class Apache ECharts integration for TUX and Nuxt.
 *
 * Provides high-performance Canvas / WebGL interactive telemetry charts,
 * large-scale scientific simulations, and real-time streaming data displays.
 *
 * Features:
 *   - Canonical TTI/TUX palette registration (Maroon-led, --chart-1..8)
 *   - Automatic Light / Dark mode theme adaptation
 *   - Responsive auto-resizing via ResizeObserver
 *   - SSR safety via <ClientOnly> with accessible loading skeleton
 *   - WCAG 2.2 Level AAA compliant with screen-reader summary & keyboard focus
 *   - Zero-Color-Ratchet compliant styles
 */
import type { ECharts, EChartsCoreOption } from "echarts";
import { createTuxEChartsTheme } from "~/utils/tuxEChartsTheme";

interface Props {
  /** ECharts option specification */
  options: EChartsCoreOption;
  /** Chart container height, e.g. '380px', '450px' */
  height?: string;
  /** Chart container width, e.g. '100%' */
  width?: string;
  /** Accessible title for assistive technologies */
  ariaTitle?: string;
  /** Screen-reader summary explaining key findings or data trends */
  ariaSummary?: string;
  /** Loading state */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "380px",
  width: "100%",
  ariaTitle: "Interactive data visualization",
  ariaSummary: "",
  loading: false,
});

const chartContainerRef = ref<HTMLDivElement | null>(null);
let chartInstance: ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

async function initChart() {
  if (!chartContainerRef.value || typeof window === "undefined") return;

  // JSDOM / headless guard: check if HTML5 2D canvas context is supported
  const probeCanvas = document.createElement("canvas");
  if (!probeCanvas.getContext || !probeCanvas.getContext("2d")) return;

  const echarts = await import("echarts");

  // Determine dark or light mode
  const isDark = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
    document.documentElement.classList.contains("dark");

  const themeName = isDark ? "tux-dark" : "tux-light";
  echarts.registerTheme(themeName, createTuxEChartsTheme(isDark));

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartContainerRef.value, themeName, {
    renderer: "canvas",
  });

  chartInstance.setOption(props.options);

  if (props.loading) {
    chartInstance.showLoading();
  } else {
    chartInstance.hideLoading();
  }
}

function handleResize() {
  if (chartInstance) {
    chartInstance.resize();
  }
}

watch(
  () => props.options,
  (newOpts) => {
    if (chartInstance) {
      chartInstance.setOption(newOpts, true);
    }
  },
  { deep: true },
);

watch(
  () => props.loading,
  (isLoading) => {
    if (!chartInstance) return;
    if (isLoading) chartInstance.showLoading();
    else chartInstance.hideLoading();
  },
);

onMounted(() => {
  if (typeof window === "undefined") return;

  nextTick(async () => {
    await initChart();
    if (typeof ResizeObserver !== "undefined" && chartContainerRef.value) {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(chartContainerRef.value);
    }
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

defineExpose({
  getChartInstance: () => chartInstance,
  resize: handleResize,
});
</script>

<template>
  <div
    class="tux-echarts"
    :style="{ height, width }"
    role="img"
    :aria-label="ariaTitle"
    tabindex="0"
  >
    <ClientOnly>
      <div
        ref="chartContainerRef"
        class="tux-echarts__container"
        :style="{ height, width }"
        aria-hidden="true"
      />
      <template #fallback>
        <div class="tux-echarts__fallback" :style="{ height, width }">
          <div class="tux-echarts__skeleton" />
          <span class="sr-only">Loading interactive chart...</span>
        </div>
      </template>
    </ClientOnly>

    <!-- Accessible text breakdown for screen readers (WCAG 2.2 AAA) -->
    <div v-if="ariaSummary" class="sr-only">
      <p>{{ ariaSummary }}</p>
    </div>
  </div>
</template>

<style scoped>
.tux-echarts {
  position: relative;
  width: 100%;
  border-radius: var(--radius-sm);
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  padding: var(--space-4);
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.tux-echarts:focus-visible {
  outline: 2px solid var(--focus-ring-outer);
  outline-offset: 2px;
  box-shadow: var(--shadow-focus);
}

.tux-echarts__container {
  width: 100%;
  height: 100%;
}

.tux-echarts__fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-sunken);
  border-radius: var(--radius-sm);
}

.tux-echarts__skeleton {
  width: 80%;
  height: 60%;
  background: linear-gradient(90deg, color-mix(in srgb, var(--neutral-1000) 4%, transparent) 0%, color-mix(in srgb, var(--neutral-1000) 8%, transparent) 50%, color-mix(in srgb, var(--neutral-1000) 4%, transparent) 100%);
  border-radius: var(--radius-sm);
  animation: tux-echarts-shimmer 1.8s infinite ease-in-out;
}

@keyframes tux-echarts-shimmer {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
