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
import { createTuxEChartsTheme, adaptOptionsForVision } from "~/utils/tuxEChartsTheme";
import { useTuxVisionPrefs } from "~/composables/useTuxVisionPrefs";

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
  /** Optional explicit extension names: 'wordcloud' | 'liquidfill' */
  extensions?: ("wordcloud" | "liquidfill")[];
  /** Optional map names to register */
  maps?: ("USA_ALBERS" | "TEXAS_COUNTIES" | "TXDOT_DISTRICTS")[];
  /** Loading state */
  loading?: boolean;
  /** Whether to avoid merging options on change. Default is false (enables smooth animations/transitions) */
  notMerge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "380px",
  width: "100%",
  ariaTitle: "Interactive data visualization",
  ariaSummary: "",
  loading: false,
  notMerge: false,
});

const emit = defineEmits<{
  (e: "chartClick", params: any): void;
  (e: "chartHover", params: any): void;
}>();

const { prefs: visionPrefs } = useTuxVisionPrefs();
const chartContainerRef = ref<HTMLDivElement | null>(null);
let chartInstance: ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

async function initChart() {
  if (!chartContainerRef.value || typeof window === "undefined") return;

  // JSDOM / headless guard: check if HTML5 2D canvas context is supported
  const probeCanvas = document.createElement("canvas");
  if (!probeCanvas.getContext || !probeCanvas.getContext("2d")) return;

  const echarts = await import("echarts");

  // Determine dark or light mode
  const isDark = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
    document.documentElement.classList.contains("dark") ||
    visionPrefs.value.softDark;

  const themeName = isDark
    ? (visionPrefs.value.softDark ? "tux-soft-dark" : "tux-dark")
    : "tux-light";
  echarts.registerTheme(themeName, createTuxEChartsTheme(isDark, visionPrefs.value));

  // Dynamically load extensions if option requires them
  const optStr = JSON.stringify(props.options || {});
  if (optStr.includes('"wordCloud"') || props.extensions?.includes("wordcloud")) {
    try {
      // @ts-ignore
      await import("echarts-wordcloud");
    } catch (e) {
      console.warn("echarts-wordcloud extension notice:", e);
    }
  }
  if (optStr.includes('"liquidFill"') || props.extensions?.includes("liquidfill")) {
    try {
      // @ts-ignore
      await import("echarts-liquidfill");
    } catch (e) {
      console.warn("echarts-liquidfill extension notice:", e);
    }
  }

  // Register SVG maps if requested
  if (optStr.includes('"USA_ALBERS"') || props.maps?.includes("USA_ALBERS")) {
    try {
      const { usStates, US_VIEWBOX } = await import("~/assets/geo/us-states");
      const svg = `<svg viewBox="0 0 ${US_VIEWBOX[0]} ${US_VIEWBOX[1]}" xmlns="http://www.w3.org/2000/svg">
        ${usStates.map((s: any) => `<path name="${s.name}" id="${s.code}" d="${s.path}" />`).join("")}
      </svg>`;
      echarts.registerMap("USA_ALBERS", { svg });
    } catch (e) {
      console.warn("USA_ALBERS map load notice:", e);
    }
  }

  if (optStr.includes('"TEXAS_COUNTIES"') || props.maps?.includes("TEXAS_COUNTIES")) {
    try {
      const { texasCounties } = await import("~/assets/geo/texas-counties");
      const { TX_VIEWBOX } = await import("~/assets/geo/texas-outline");
      const svg = `<svg viewBox="0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}" xmlns="http://www.w3.org/2000/svg">
        ${texasCounties.map((c: any) => `<path name="${c.name}" id="${c.fips}" d="${c.path}" />`).join("")}
      </svg>`;
      echarts.registerMap("TEXAS_COUNTIES", { svg });
    } catch (e) {
      console.warn("TEXAS_COUNTIES map load notice:", e);
    }
  }

  if (optStr.includes('"TXDOT_DISTRICTS"') || props.maps?.includes("TXDOT_DISTRICTS")) {
    try {
      const { txdotDistricts } = await import("~/assets/geo/txdot-districts");
      const { TX_VIEWBOX } = await import("~/assets/geo/texas-outline");
      const svg = `<svg viewBox="0 0 ${TX_VIEWBOX[0]} ${TX_VIEWBOX[1]}" xmlns="http://www.w3.org/2000/svg">
        ${txdotDistricts.map((d: any) => `<path name="${d.name}" id="${d.abbr}" d="${d.path}" />`).join("")}
      </svg>`;
      echarts.registerMap("TXDOT_DISTRICTS", { svg });
    } catch (e) {
      console.warn("TXDOT_DISTRICTS map load notice:", e);
    }
  }

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartContainerRef.value, themeName, {
    renderer: "canvas",
  });

  chartInstance.on("click", (params: any) => {
    emit("chartClick", params);
  });
  chartInstance.on("mouseover", (params: any) => {
    emit("chartHover", params);
  });

  const adapted = adaptOptionsForVision(props.options, isDark, visionPrefs.value);
  chartInstance.setOption(adapted);

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
      const isDark = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
        document.documentElement.classList.contains("dark") ||
        visionPrefs.value.softDark;
      const adapted = adaptOptionsForVision(newOpts, isDark, visionPrefs.value);
      chartInstance.setOption(adapted, props.notMerge);
    }
  },
  { deep: true },
);

watch(
  visionPrefs,
  () => {
    initChart();
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

    // Theme & Vision mutation observer on document.documentElement
    if (typeof MutationObserver !== "undefined") {
      themeObserver = new MutationObserver(() => {
        initChart();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [
          "data-theme",
          "class",
          "data-cvd-mode",
          "data-cvd-simulation",
          "data-cvd-patterns",
          "data-cvd-markers",
          "data-vision-comfort",
          "data-vision-stroke",
        ],
      });
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
  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
});

defineExpose({
  getChartInstance: () => chartInstance,
  setOption: (opt: EChartsCoreOption, notMerge?: boolean) => {
    const isDark = typeof document !== "undefined" && (
      document.documentElement.getAttribute("data-theme") === "tti-dark" ||
      document.documentElement.classList.contains("dark") ||
      visionPrefs.value.softDark
    );
    const adapted = adaptOptionsForVision(opt, Boolean(isDark), visionPrefs.value);
    chartInstance?.setOption(adapted, notMerge);
  },
  resize: handleResize,
  dispatchAction: (payload: any) => chartInstance?.dispatchAction(payload),
});
</script>

<template>
  <div
    class="tux-echarts"
    :style="{ height, width }"
    :data-cvd-mode="visionPrefs.cvdMode"
    :data-vision-stroke="visionPrefs.heavyStrokes ? 'heavy' : undefined"
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
  max-width: 100%;
  border-radius: var(--radius-sm);
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  padding: var(--space-2);
  overflow: hidden;
  transition: border-color 0.15s ease;
}

@media (min-width: 640px) {
  .tux-echarts {
    padding: var(--space-4);
  }
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
