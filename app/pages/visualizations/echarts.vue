<script setup lang="ts">
/**
 * Visualization Gallery: TuxECharts
 * High-performance Canvas/WebGL telemetry visualizations and massive dataset exploration
 * powered by Apache ECharts, integrated with canonical TUX design tokens and WCAG 2.2 AAA accessibility.
 */

useHead({ title: "TuxECharts · TUX" });

const activePreset = ref("throughput");
const isStreaming = ref(false);

const throughputOptions = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
  },
  legend: {
    data: ["GPU Inference (k inf/s)", "Fabric Saturation (%)", "p99 Latency (ms)"],
    top: 5,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    top: "14%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    boundaryGap: false,
  },
  yAxis: [
    {
      type: "value",
      name: "Throughput (k inf/s)",
      min: 0,
      max: 180,
    },
    {
      type: "value",
      name: "Latency / Saturation",
      min: 0,
      max: 100,
    },
  ],
  series: [
    {
      name: "GPU Inference (k inf/s)",
      type: "line",
      smooth: true,
      data: [35, 62, 115, 168, 142, 98, 45],
      areaStyle: {
        opacity: 0.25,
      },
    },
    {
      name: "Fabric Saturation (%)",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      data: [22, 41, 78, 92, 85, 61, 30],
    },
    {
      name: "p99 Latency (ms)",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      data: [12, 14, 18, 26, 21, 16, 13],
    },
  ],
}));

const corridorOptions = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
  },
  legend: {
    data: ["Average Travel Speed (mph)", "Vehicle Volume (k veh/hr)"],
    top: 5,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    top: "14%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["Segment A (Downtown)", "Segment B (Uptown)", "Segment C (Loop 610)", "Segment D (Beltway 8)", "Segment E (I-10 Corridor)"],
  },
  yAxis: [
    {
      type: "value",
      name: "Speed (mph)",
      min: 0,
      max: 75,
    },
    {
      type: "value",
      name: "Volume (k veh/hr)",
      min: 0,
      max: 20,
    },
  ],
  series: [
    {
      name: "Average Travel Speed (mph)",
      type: "bar",
      barWidth: "35%",
      data: [24, 38, 45, 62, 58],
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: "Vehicle Volume (k veh/hr)",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 8,
      data: [14.2, 11.8, 9.4, 6.2, 8.1],
    },
  ],
}));

const currentOptions = computed(() => {
  return activePreset.value === "throughput" ? throughputOptions.value : corridorOptions.value;
});

const sampleCode = computed(() => {
  return `<TuxChartFrame
  eyebrow="EXHIBIT 2.0 · TELEMETRY"
  title="Real-Time Research Cluster Telemetry"
  source="Source: Texas A&M Transportation Institute HPC Center"
>
  <TuxECharts
    :options="chartOptions"
    height="380px"
    aria-title="Cluster telemetry chart"
    aria-summary="Throughput peaked at 168k inferences per second with 92% fabric saturation."
  />
</TuxChartFrame>`;
});
</script>

<template>
  <div class="min-h-screen bg-surface-page py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Breadcrumb and title -->
      <div>
        <NuxtLink to="/visualizations" class="text-xs font-mono text-brand-primary uppercase tracking-wider hover:underline">
          &larr; Visualization Catalog
        </NuxtLink>
        <h1 class="mt-2 text-3xl font-display font-bold text-text-primary tracking-tight">
          TuxECharts
        </h1>
        <p class="mt-2 text-base text-text-secondary max-w-3xl leading-relaxed">
          First-class Apache ECharts integration engineered for high-density Canvas and WebGL scientific telemetry,
          multi-node distributed training benchmarks, and real-time corridor sensor streams. Pre-configured with the
          canonical TUX color-token theme, automatic light/dark mode switching, responsive container auto-resizing,
          and WCAG 2.2 AAA accessibility fallbacks.
        </p>
      </div>

      <!-- Controls -->
      <section class="p-6 bg-surface-raised border border-surface-border rounded-md shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Dataset Preset:
          </span>
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activePreset === 'throughput' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="activePreset = 'throughput'"
          >
            GPU Compute Telemetry
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activePreset === 'corridor' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="activePreset = 'corridor'"
          >
            Corridor Travel Volume
          </button>
        </div>

        <div class="text-xs font-mono text-text-muted">
          Renderer: Canvas 2D / WebGL Accelerated
        </div>
      </section>

      <!-- Live Chart Exhibit -->
      <section>
        <h2 class="text-sm font-bold font-mono uppercase tracking-wider text-text-primary mb-3">
          Live Interactive Exhibit
        </h2>
        <TuxChartFrame
          eyebrow="EXHIBIT 1.0 · HIGH-PERFORMANCE COMPUTING"
          :title="activePreset === 'throughput' ? 'Distributed GPU Telemetry & Fabric Saturation' : 'Corridor Speed vs Volume Scaling'"
          :subtitle="activePreset === 'throughput' ? 'Continuous 24-hour hardware telemetry stream across model inference pipelines' : 'Multi-sensor radar and connected vehicle velocity profiling'"
          source="Source: TTI Research Computing Operations & Data Science Initiative"
          notes="Telemetry sampled at 10-second intervals; values smoothed via cubic spline interpolation."
        >
          <TuxECharts
            :options="currentOptions"
            height="400px"
            :aria-title="activePreset === 'throughput' ? 'Distributed GPU telemetry chart' : 'Corridor speed versus volume chart'"
            :aria-summary="activePreset === 'throughput' ? 'GPU inference peaked at 168k inferences/sec at 12:00 with 92% fabric saturation.' : 'Segment D demonstrated highest free-flow velocity at 62 mph.'"
          />
        </TuxChartFrame>
      </section>

      <!-- Code Snippet -->
      <section class="space-y-3">
        <h2 class="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
          Nuxt Template Usage
        </h2>
        <div class="p-4 bg-surface-sunken border border-surface-border rounded-md font-mono text-xs overflow-x-auto text-text-primary">
          <pre>{{ sampleCode }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>
