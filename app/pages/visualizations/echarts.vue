<script setup lang="ts">
/**
 * Visualization Gallery: TuxECharts — Advanced Storytelling & Telemetry Suite
 *
 * Implements high-impact Apache ECharts visualizations designed for transportation
 * research storytelling, executive proposals, and high-density scientific telemetry.
 * Pre-configured with TUX design tokens and 100% WCAG 2.2 AAA accessibility.
 */
import type { EChartsCoreOption } from "echarts";
import { GALLERY_PRESETS, type GalleryPreset } from "~/utils/tuxEChartsGallery";

useHead({ title: "TuxECharts · Advanced Storytelling, Geographic Intelligence & Live Transitions · TUX" });

const categories = [
  { id: "all", label: "All Showcase Presets" },
  { id: "executive", label: "Executive & Policy" },
  { id: "realtime", label: "Real-Time & Racing" },
  { id: "spatial", label: "Spatial & Maps" },
  { id: "hierarchical", label: "Hierarchical & Composition" },
  { id: "custom", label: "Unstructured & Custom" },
] as const;

const activeCategory = ref<string>("all");
const selectedPresetId = ref<string>("pie-rose");
const showCodeSnippet = ref<boolean>(false);

const filteredPresets = computed(() => {
  if (activeCategory.value === "all") return GALLERY_PRESETS;
  return GALLERY_PRESETS.filter((p) => p.category === activeCategory.value);
});

const currentPreset = computed<GalleryPreset>(() => {
  return GALLERY_PRESETS.find((p) => p.id === selectedPresetId.value) || GALLERY_PRESETS[0];
});

// Reactivity to dark/light theme switch
const isDark = ref(false);
onMounted(() => {
  if (typeof window !== "undefined") {
    isDark.value = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
      document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      isDark.value = document.documentElement.getAttribute("data-theme") === "tti-dark" ||
        document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
  }
});

function selectPreset(id: string) {
  selectedPresetId.value = id;
}

// ============================================================================
// 1. DYNAMIC RACING BAR ENGINE (2015–2026)
// ============================================================================
const racingYear = ref<number>(2026);
const isRacingPlaying = ref<boolean>(false);
const racingSpeed = ref<number>(1);
let racingTimer: ReturnType<typeof setInterval> | null = null;

const RACING_DATA_HISTORY: Record<number, { name: string; value: number }[]> = {
  2015: [
    { name: "I-35 Austin Central", value: 182 },
    { name: "Loop 610 West Houston", value: 165 },
    { name: "I-69 / US-59 Houston", value: 154 },
    { name: "I-10 Katy Houston", value: 142 },
    { name: "I-30 Dallas Central", value: 131 },
    { name: "I-35W Fort Worth", value: 122 },
    { name: "US-75 Dallas", value: 114 },
    { name: "I-45 North Houston", value: 108 },
    { name: "Loop 1 Mopac Austin", value: 96 },
    { name: "I-410 San Antonio", value: 84 },
  ],
  2016: [
    { name: "I-35 Austin Central", value: 194 },
    { name: "Loop 610 West Houston", value: 178 },
    { name: "I-69 / US-59 Houston", value: 162 },
    { name: "I-10 Katy Houston", value: 149 },
    { name: "I-35W Fort Worth", value: 136 },
    { name: "I-30 Dallas Central", value: 138 },
    { name: "US-75 Dallas", value: 121 },
    { name: "I-45 North Houston", value: 115 },
    { name: "Loop 1 Mopac Austin", value: 102 },
    { name: "I-410 San Antonio", value: 90 },
  ],
  2017: [
    { name: "I-35 Austin Central", value: 208 },
    { name: "Loop 610 West Houston", value: 192 },
    { name: "I-69 / US-59 Houston", value: 175 },
    { name: "I-35W Fort Worth", value: 152 },
    { name: "I-10 Katy Houston", value: 156 },
    { name: "I-30 Dallas Central", value: 146 },
    { name: "US-75 Dallas", value: 130 },
    { name: "I-45 North Houston", value: 124 },
    { name: "Loop 1 Mopac Austin", value: 110 },
    { name: "I-410 San Antonio", value: 98 },
  ],
  2018: [
    { name: "I-35 Austin Central", value: 224 },
    { name: "Loop 610 West Houston", value: 206 },
    { name: "I-69 / US-59 Houston", value: 188 },
    { name: "I-35W Fort Worth", value: 168 },
    { name: "I-10 Katy Houston", value: 164 },
    { name: "I-30 Dallas Central", value: 155 },
    { name: "US-75 Dallas", value: 141 },
    { name: "I-45 North Houston", value: 132 },
    { name: "Loop 1 Mopac Austin", value: 119 },
    { name: "I-410 San Antonio", value: 106 },
  ],
  2019: [
    { name: "I-35 Austin Central", value: 242 },
    { name: "Loop 610 West Houston", value: 221 },
    { name: "I-69 / US-59 Houston", value: 204 },
    { name: "I-35W Fort Worth", value: 186 },
    { name: "I-10 Katy Houston", value: 172 },
    { name: "I-30 Dallas Central", value: 164 },
    { name: "US-75 Dallas", value: 150 },
    { name: "I-45 North Houston", value: 142 },
    { name: "Loop 1 Mopac Austin", value: 128 },
    { name: "I-410 San Antonio", value: 115 },
  ],
  2020: [
    // Pandemic dip in peak hours
    { name: "I-35 Austin Central", value: 170 },
    { name: "Loop 610 West Houston", value: 160 },
    { name: "I-69 / US-59 Houston", value: 148 },
    { name: "I-35W Fort Worth", value: 135 },
    { name: "I-10 Katy Houston", value: 125 },
    { name: "I-30 Dallas Central", value: 120 },
    { name: "US-75 Dallas", value: 110 },
    { name: "I-45 North Houston", value: 104 },
    { name: "Loop 1 Mopac Austin", value: 92 },
    { name: "I-410 San Antonio", value: 82 },
  ],
  2021: [
    { name: "I-35 Austin Central", value: 215 },
    { name: "Loop 610 West Houston", value: 202 },
    { name: "I-69 / US-59 Houston", value: 185 },
    { name: "I-35W Fort Worth", value: 174 },
    { name: "I-10 Katy Houston", value: 158 },
    { name: "I-30 Dallas Central", value: 152 },
    { name: "US-75 Dallas", value: 140 },
    { name: "I-45 North Houston", value: 134 },
    { name: "Loop 1 Mopac Austin", value: 120 },
    { name: "I-410 San Antonio", value: 108 },
  ],
  2022: [
    { name: "I-35 Austin Central", value: 252 },
    { name: "Loop 610 West Houston", value: 236 },
    { name: "I-69 / US-59 Houston", value: 218 },
    { name: "I-35W Fort Worth", value: 205 },
    { name: "I-10 Katy Houston", value: 184 },
    { name: "I-30 Dallas Central", value: 176 },
    { name: "US-75 Dallas", value: 162 },
    { name: "I-45 North Houston", value: 154 },
    { name: "Loop 1 Mopac Austin", value: 138 },
    { name: "I-410 San Antonio", value: 125 },
  ],
  2023: [
    { name: "I-35 Austin Central", value: 275 },
    { name: "Loop 610 West Houston", value: 258 },
    { name: "I-69 / US-59 Houston", value: 239 },
    { name: "I-35W Fort Worth", value: 224 },
    { name: "I-10 Katy Houston", value: 201 },
    { name: "I-30 Dallas Central", value: 194 },
    { name: "US-75 Dallas", value: 178 },
    { name: "I-45 North Houston", value: 170 },
    { name: "Loop 1 Mopac Austin", value: 152 },
    { name: "I-410 San Antonio", value: 140 },
  ],
  2024: [
    { name: "I-35 Austin Central", value: 295 },
    { name: "Loop 610 West Houston", value: 278 },
    { name: "I-69 / US-59 Houston", value: 256 },
    { name: "I-35W Fort Worth", value: 242 },
    { name: "I-10 Katy Houston", value: 216 },
    { name: "I-30 Dallas Central", value: 210 },
    { name: "US-75 Dallas", value: 195 },
    { name: "I-45 North Houston", value: 186 },
    { name: "Loop 1 Mopac Austin", value: 168 },
    { name: "I-410 San Antonio", value: 155 },
  ],
  2025: [
    { name: "I-35 Austin Central", value: 312 },
    { name: "Loop 610 West Houston", value: 294 },
    { name: "I-69 / US-59 Houston", value: 272 },
    { name: "I-35W Fort Worth", value: 258 },
    { name: "I-30 Dallas Central", value: 228 },
    { name: "I-10 Katy Houston", value: 224 },
    { name: "US-75 Dallas", value: 210 },
    { name: "I-45 North Houston", value: 201 },
    { name: "Loop 1 Mopac Austin", value: 184 },
    { name: "I-410 San Antonio", value: 170 },
  ],
  2026: [
    { name: "I-35 Austin Central", value: 328 },
    { name: "Loop 610 West Houston", value: 308 },
    { name: "I-69 / US-59 Houston", value: 286 },
    { name: "I-35W Fort Worth", value: 274 },
    { name: "I-30 Dallas Central", value: 245 },
    { name: "I-10 Katy Houston", value: 236 },
    { name: "US-75 Dallas", value: 224 },
    { name: "I-45 North Houston", value: 214 },
    { name: "Loop 1 Mopac Austin", value: 198 },
    { name: "I-410 San Antonio", value: 182 },
  ],
};

function startRacingPlayback() {
  if (isRacingPlaying.value) return;
  isRacingPlaying.value = true;
  if (racingYear.value >= 2026) {
    racingYear.value = 2015;
  }
  const intervalMs = Math.round(1200 / racingSpeed.value);
  racingTimer = setInterval(() => {
    if (racingYear.value < 2026) {
      racingYear.value += 1;
    } else {
      pauseRacingPlayback();
    }
  }, intervalMs);
}

function pauseRacingPlayback() {
  isRacingPlaying.value = false;
  if (racingTimer) {
    clearInterval(racingTimer);
    racingTimer = null;
  }
}

function toggleRacingPlayback() {
  if (isRacingPlaying.value) {
    pauseRacingPlayback();
  } else {
    startRacingPlayback();
  }
}

function stepRacingYear(delta: number) {
  pauseRacingPlayback();
  const next = racingYear.value + delta;
  if (next >= 2015 && next <= 2026) {
    racingYear.value = next;
  }
}

function setRacingSpeed(speed: number) {
  racingSpeed.value = speed;
  if (isRacingPlaying.value) {
    pauseRacingPlayback();
    startRacingPlayback();
  }
}

const dynamicRacingBarOption = computed<EChartsCoreOption>(() => {
  const currentData = RACING_DATA_HISTORY[racingYear.value] || RACING_DATA_HISTORY[2026];
  const sorted = [...currentData].sort((a, b) => a.value - b.value);

  return {
    grid: { top: 20, bottom: 30, left: 160, right: 80 },
    xAxis: {
      max: "dataMax",
      name: "Delay (k Hours / Mile)",
      nameLocation: "middle",
      nameGap: 24,
      splitLine: {
        lineStyle: {
          color: isDark.value ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
      },
    },
    yAxis: {
      type: "category",
      data: sorted.map((d) => d.name),
      inverse: false,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 9,
      axisLabel: {
        fontFamily: "var(--font-display)",
        fontWeight: "bold",
        fontSize: 11,
      },
    },
    series: [
      {
        realtimeSort: true,
        name: "Annual Delay",
        type: "bar",
        data: sorted.map((d, idx) => ({
          value: d.value,
          itemStyle: {
            color: idx >= 8
              ? (isDark.value ? "#A02D20" : "#500000")
              : idx >= 6
                ? "#CA6702"
                : idx >= 4
                  ? "#005F73"
                  : "#0A9396",
            borderRadius: [0, 4, 4, 0],
          },
        })),
        label: {
          show: true,
          position: "right",
          valueAnimation: true,
          fontFamily: "var(--font-mono)",
          fontWeight: "bold",
          formatter: "{c}k hrs",
        },
      },
    ],
    graphic: [
      {
        type: "text",
        right: 40,
        bottom: 50,
        style: {
          text: String(racingYear.value),
          font: "bolder 68px var(--font-display)",
          fill: isDark.value ? "rgba(255,255,255,0.12)" : "rgba(80,0,0,0.1)",
        },
        z: 100,
      },
    ],
    animationDuration: 0,
    animationDurationUpdate: Math.round(900 / racingSpeed.value),
    animationEasing: "linear",
    animationEasingUpdate: "linear",
  };
});

// ============================================================================
// 2. UNIVERSAL MORPH TRANSITION LAB (Rose <-> Bar <-> Donut & UTP Drilldown)
// ============================================================================
type MorphDataset = "commute" | "utp";
const morphActiveDataset = ref<MorphDataset>("commute");
const morphViewMode = ref<"rose" | "bar" | "donut">("rose");
const utpDrilldownLevel = ref<"statewide" | "projects">("statewide");

const modalCommuteData = [
  { id: "sov", name: "Single-Occupancy Vehicle", value: 62, miles: 18.4, color: "#500000", darkColor: "#A02D20" },
  { id: "bus", name: "Express Commuter Bus", value: 14, miles: 12.2, color: "#005F73", darkColor: "#0A9396" },
  { id: "carpool", name: "Carpool & Vanpool", value: 11, miles: 16.1, color: "#CA6702", darkColor: "#EE9B00" },
  { id: "active", name: "Active Cycling & Walk", value: 8, miles: 2.4, color: "#2B9348", darkColor: "#94D2BD" },
  { id: "micro", name: "Micro-Mobility / Scooter", value: 5, miles: 3.1, color: "#BB3E03", darkColor: "#E9D8A6" },
];

const utpStatewideData = [
  { id: "preservation", name: "Highway Pavement Preservation", value: 6200, color: "#500000", darkColor: "#A02D20" },
  { id: "congestion", name: "Major Metropolitan Congestion Relief", value: 5300, color: "#005F73", darkColor: "#0A9396" },
  { id: "bridge", name: "Statewide Bridge Replacement & Rehab", value: 1900, color: "#CA6702", darkColor: "#EE9B00" },
  { id: "rural", name: "Rural Connectivity Corridors", value: 1800, color: "#EE9B00", darkColor: "#E9D8A6" },
  { id: "safety", name: "Vision Zero Safety Improvements", value: 1100, color: "#AE2012", darkColor: "#F87171" },
];

const utpProjectData = [
  { id: "nhhip", name: "I-45 NHHIP Downtown Houston", value: 9700, district: "Houston", color: "#500000", darkColor: "#A02D20" },
  { id: "capex", name: "I-35 Capital Express Central", value: 4500, district: "Austin", color: "#005F73", darkColor: "#0A9396" },
  { id: "lbj", name: "I-635 East LBJ Project", value: 1740, district: "Dallas", color: "#CA6702", darkColor: "#EE9B00" },
  { id: "se-conn", name: "I-35W Southeast Connector", value: 1600, district: "Fort Worth", color: "#0A9396", darkColor: "#94D2BD" },
  { id: "loop1604", name: "Loop 1604 North Expansion", value: 1400, district: "San Antonio", color: "#BB3E03", darkColor: "#E9D8A6" },
  { id: "harbor", name: "Harbor Bridge Replacement US-181", value: 1200, district: "Corpus Christi", color: "#2B9348", darkColor: "#94D2BD" },
  { id: "i10-ep", name: "I-10 Downtown Managed Lanes", value: 820, district: "El Paso", color: "#AE2012", darkColor: "#F87171" },
];

function toggleUtpDrilldown() {
  utpDrilldownLevel.value = utpDrilldownLevel.value === "statewide" ? "projects" : "statewide";
}

const morphTransitionOption = computed<EChartsCoreOption>(() => {
  const dark = isDark.value;

  // Branch A: TxDOT UTP Statewide-to-Projects Drilldown Morph
  if (morphActiveDataset.value === "utp") {
    const isStatewide = utpDrilldownLevel.value === "statewide";
    const data = isStatewide ? utpStatewideData : utpProjectData;
    const sorted = [...data].sort((a, b) => b.value - a.value);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any) => {
          const item = params[0];
          return `<strong>${item.name}</strong><br/>Allocated Portfolio: <strong>$${item.value.toLocaleString()}M</strong>`;
        },
      },
      grid: { containLabel: true, left: "2%", right: "14%", top: "8%", bottom: "12%" },
      xAxis: {
        type: "value",
        name: "Budget",
        axisLabel: {
          formatter: (v: number) => `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}B`,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        },
        splitLine: { lineStyle: { color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" } },
      },
      yAxis: {
        type: "category",
        data: sorted.map((d) => d.name),
        inverse: true,
        axisLabel: {
          fontFamily: "var(--font-display)",
          fontWeight: "bold",
          fontSize: 11,
          width: 165,
          overflow: "break",
        },
      },
      series: [
        {
          name: isStatewide ? "Statewide Programs" : "Flagship Projects",
          type: "bar",
          data: sorted.map((d) => ({
            value: d.value,
            groupId: d.id,
            itemStyle: { color: dark ? d.darkColor : d.color, borderRadius: [0, 4, 4, 0] },
          })),
          label: {
            show: true,
            position: "right",
            formatter: "${c}M",
            fontFamily: "var(--font-mono)",
            fontWeight: "bold",
          },
          universalTransition: { enabled: true, divideShape: "clone" },
          animationDurationUpdate: 1200,
        },
      ],
    };
  }

  // Branch B: Commuter Modal Split Morph (Rose <-> Bar <-> Donut)
  const isRose = morphViewMode.value === "rose";
  const isBar = morphViewMode.value === "bar";

  if (isBar) {
    const sorted = [...modalCommuteData].sort((a, b) => b.value - a.value);
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: "{b}: <strong>{c}%</strong> of daily passenger trips",
      },
      grid: { containLabel: true, left: "4%", right: "8%", top: "8%", bottom: "12%" },
      xAxis: {
        type: "value",
        max: 70,
        axisLabel: { formatter: "{value}%", fontFamily: "var(--font-mono)" },
        splitLine: { lineStyle: { color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" } },
      },
      yAxis: {
        type: "category",
        data: sorted.map((d) => d.name),
        inverse: true,
        axisLabel: { fontFamily: "var(--font-display)", fontWeight: "bold" },
      },
      series: [
        {
          name: "Trip Share",
          type: "bar",
          data: sorted.map((d) => ({
            value: d.value,
            groupId: d.id,
            itemStyle: { color: dark ? d.darkColor : d.color, borderRadius: [0, 4, 4, 0] },
          })),
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            fontFamily: "var(--font-mono)",
            fontWeight: "bold",
          },
          universalTransition: { enabled: true, divideShape: "clone" },
          animationDurationUpdate: 1200,
        },
      ],
    };
  }

  // Rose or Donut pie
  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}: <strong>{c}%</strong> trip share ({d}% total)",
    },
    legend: {
      bottom: "2%",
      textStyle: { fontFamily: "var(--font-display)" },
    },
    series: [
      {
        name: "Trip Share",
        type: "pie",
        radius: isRose ? ["18%", "72%"] : ["40%", "70%"],
        center: ["50%", "46%"],
        roseType: isRose ? "area" : false,
        itemStyle: {
          borderRadius: 6,
          borderColor: dark ? "#171717" : "#FFFFFF",
          borderWidth: 2,
        },
        label: {
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: "bold",
          formatter: "{b}\n{c}%",
        },
        data: modalCommuteData.map((d) => ({
          name: d.name,
          value: d.value,
          groupId: d.id,
          itemStyle: { color: dark ? d.darkColor : d.color },
        })),
        universalTransition: { enabled: true, divideShape: "clone" },
        animationDurationUpdate: 1200,
      },
    ],
  };
});

// ============================================================================
// 3. REAL-TIME CAN-BUS TELEMETRY STREAMER
// ============================================================================
const isStreamingActive = ref<boolean>(false);
let telemetryInterval: ReturnType<typeof setInterval> | null = null;
const streamTimeWindow = ref<string[]>([
  "14:02:10", "14:02:11", "14:02:12", "14:02:13", "14:02:14",
  "14:02:15", "14:02:16", "14:02:17", "14:02:18", "14:02:19",
  "14:02:20", "14:02:21", "14:02:22", "14:02:23", "14:02:24",
]);
const streamSpeed = ref<number[]>([45, 52, 58, 64, 68, 70, 71, 69, 65, 58, 54, 59, 66, 69, 71]);
const streamThrottle = ref<number[]>([55, 62, 70, 75, 52, 48, 45, 30, 10, 0, 15, 45, 60, 68, 72]);
const streamBrake = ref<number[]>([0, 0, 0, 0, 0, 0, 5, 24, 45, 38, 12, 0, 0, 0, 0]);
const streamLatency = ref<number[]>([8.2, 8.5, 9.1, 8.7, 9.4, 11.2, 10.4, 9.0, 8.8, 8.4, 9.2, 8.6, 9.5, 9.1, 8.9]);

function toggleTelemetryStreaming() {
  if (isStreamingActive.value) {
    isStreamingActive.value = false;
    if (telemetryInterval) {
      clearInterval(telemetryInterval);
      telemetryInterval = null;
    }
  } else {
    isStreamingActive.value = true;
    telemetryInterval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      
      const lastSpd = streamSpeed.value[streamSpeed.value.length - 1];
      const deltaSpd = (Math.random() - 0.48) * 4;
      const nextSpd = Math.max(20, Math.min(80, Math.round((lastSpd + deltaSpd) * 10) / 10));

      const nextThrottle = nextSpd > 65 ? Math.round(30 + Math.random() * 30) : Math.round(50 + Math.random() * 40);
      const nextBrake = Math.random() > 0.85 ? Math.round(20 + Math.random() * 30) : 0;
      const nextLatency = Math.round((7.5 + Math.random() * 4) * 10) / 10;

      streamTimeWindow.value = [...streamTimeWindow.value.slice(1), timeStr];
      streamSpeed.value = [...streamSpeed.value.slice(1), nextSpd];
      streamThrottle.value = [...streamThrottle.value.slice(1), nextThrottle];
      streamBrake.value = [...streamBrake.value.slice(1), nextBrake];
      streamLatency.value = [...streamLatency.value.slice(1), nextLatency];
    }, 800);
  }
}

const streamingTelemetryOption = computed<EChartsCoreOption>(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
  },
  legend: {
    data: ["Vehicle Speed (MPH)", "Throttle Position (%)", "Brake Line (PSI)", "C-V2X Latency (ms)"],
    top: 5,
    textStyle: { fontFamily: "var(--font-display)" },
  },
  grid: { left: "4%", right: "4%", bottom: "10%", top: "16%", containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: streamTimeWindow.value,
    axisLabel: { fontFamily: "var(--font-mono)", fontSize: 10 },
  },
  yAxis: [
    {
      type: "value",
      name: "Speed / Throttle",
      min: 0,
      max: 100,
    },
    {
      type: "value",
      name: "Brake / Latency",
      min: 0,
      max: 60,
    },
  ],
  series: [
    {
      name: "Vehicle Speed (MPH)",
      type: "line",
      smooth: true,
      data: streamSpeed.value,
      lineStyle: { width: 3, color: isDark.value ? "#A02D20" : "#500000" },
      itemStyle: { color: isDark.value ? "#A02D20" : "#500000" },
    },
    {
      name: "Throttle Position (%)",
      type: "line",
      smooth: true,
      data: streamThrottle.value,
      lineStyle: { width: 2, color: "#005F73" },
      itemStyle: { color: "#005F73" },
    },
    {
      name: "Brake Line (PSI)",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      data: streamBrake.value,
      lineStyle: { width: 2.5, color: "#AE2012" },
      itemStyle: { color: "#AE2012" },
    },
    {
      name: "C-V2X Latency (ms)",
      type: "line",
      yAxisIndex: 1,
      smooth: true,
      data: streamLatency.value,
      lineStyle: { width: 2, type: "dashed", color: "#EE9B00" },
      itemStyle: { color: "#EE9B00" },
    },
  ],
  animation: false,
}));

// ============================================================================
// 4. INTERACTIVE GEOGRAPHIC & SPATIAL COMMAND CENTER ("The Map Stuff")
// ============================================================================
type MapMode = "txdot-districts" | "texas-counties" | "texas-flow" | "gulf-maritime" | "border-gateways" | "usa-albers";
const activeMapMode = ref<MapMode>("txdot-districts");

// TxDOT District metric selection
type DistrictMetric = "utpScore" | "letting" | "laneMiles" | "defBridges";
const activeDistrictMetric = ref<DistrictMetric>("utpScore");

interface DistrictRecord {
  name: string;
  abbr: string;
  utpScore: number;
  letting: number; // in $M
  laneMiles: number;
  defBridges: number; // in %
  hq: string;
  corridors: string;
}

const TXDOT_DISTRICT_DATABASE: Record<string, DistrictRecord> = {
  Houston: { name: "Houston", abbr: "HOU", utpScore: 94, letting: 1420, laneMiles: 11450, defBridges: 1.8, hq: "Houston, TX", corridors: "I-10, I-45, US-59/I-69, Loop 610" },
  Dallas: { name: "Dallas", abbr: "DAL", utpScore: 92, letting: 1280, laneMiles: 11200, defBridges: 2.1, hq: "Dallas, TX", corridors: "I-30, I-35E, I-635, US-75" },
  Austin: { name: "Austin", abbr: "AUS", utpScore: 89, letting: 940, laneMiles: 8900, defBridges: 1.5, hq: "Austin, TX", corridors: "I-35, US-183, US-290, Loop 1" },
  "San Antonio": { name: "San Antonio", abbr: "SAT", utpScore: 86, letting: 880, laneMiles: 10500, defBridges: 1.9, hq: "San Antonio, TX", corridors: "I-10, I-35, Loop 410, Loop 1604" },
  Odessa: { name: "Odessa", abbr: "ODA", utpScore: 85, letting: 790, laneMiles: 8400, defBridges: 3.8, hq: "Odessa, TX", corridors: "I-20, US-285, US-385 (Permian Energy)" },
  "Fort Worth": { name: "Fort Worth", abbr: "FTW", utpScore: 84, letting: 820, laneMiles: 9800, defBridges: 2.4, hq: "Fort Worth, TX", corridors: "I-20, I-30, I-35W, Loop 820" },
  Pharr: { name: "Pharr", abbr: "PHR", utpScore: 82, letting: 710, laneMiles: 6900, defBridges: 2.2, hq: "Pharr, TX", corridors: "I-2, I-69C, US-83, Pharr Bridge" },
  Laredo: { name: "Laredo", abbr: "LRD", utpScore: 80, letting: 640, laneMiles: 7200, defBridges: 2.0, hq: "Laredo, TX", corridors: "I-35, US-59, World Trade Bridge" },
  "El Paso": { name: "El Paso", abbr: "ELP", utpScore: 78, letting: 610, laneMiles: 5800, defBridges: 2.5, hq: "El Paso, TX", corridors: "I-10, Loop 375, Border Highway" },
  "Corpus Christi": { name: "Corpus Christi", abbr: "CRP", utpScore: 74, letting: 540, laneMiles: 7600, defBridges: 2.8, hq: "Corpus Christi, TX", corridors: "I-37, US-77, Harbor Bridge" },
  Beaumont: { name: "Beaumont", abbr: "BMT", utpScore: 72, letting: 510, laneMiles: 7100, defBridges: 3.4, hq: "Beaumont, TX", corridors: "I-10, US-69, US-96" },
  Waco: { name: "Waco", abbr: "WAC", utpScore: 71, letting: 490, laneMiles: 8100, defBridges: 2.6, hq: "Waco, TX", corridors: "I-35, US-84, State Hwy 6" },
  Bryan: { name: "Bryan", abbr: "BRY", utpScore: 68, letting: 460, laneMiles: 7400, defBridges: 2.1, hq: "Bryan, TX", corridors: "State Hwy 6, State Hwy 21, US-190" },
  Lubbock: { name: "Lubbock", abbr: "LBB", utpScore: 66, letting: 430, laneMiles: 12100, defBridges: 1.9, hq: "Lubbock, TX", corridors: "I-27, US-84, Loop 289" },
  Tyler: { name: "Tyler", abbr: "TYL", utpScore: 65, letting: 420, laneMiles: 8800, defBridges: 3.1, hq: "Tyler, TX", corridors: "I-20, US-69, Loop 323" },
  Amarillo: { name: "Amarillo", abbr: "AMA", utpScore: 64, letting: 390, laneMiles: 10200, defBridges: 2.2, hq: "Amarillo, TX", corridors: "I-40, I-27, US-287" },
  Abilene: { name: "Abilene", abbr: "ABL", utpScore: 62, letting: 370, laneMiles: 9400, defBridges: 2.7, hq: "Abilene, TX", corridors: "I-20, US-83, US-277" },
  "Wichita Falls": { name: "Wichita Falls", abbr: "WFS", utpScore: 60, letting: 350, laneMiles: 8600, defBridges: 2.9, hq: "Wichita Falls, TX", corridors: "I-44, US-287, US-82" },
  Yoakum: { name: "Yoakum", abbr: "YKM", utpScore: 59, letting: 340, laneMiles: 8900, defBridges: 2.5, hq: "Yoakum, TX", corridors: "I-10, US-59, US-77" },
  Lufkin: { name: "Lufkin", abbr: "LFK", utpScore: 58, letting: 320, laneMiles: 7900, defBridges: 3.5, hq: "Lufkin, TX", corridors: "US-59/I-69, US-69, US-287" },
  Paris: { name: "Paris", abbr: "PAR", utpScore: 56, letting: 300, laneMiles: 7700, defBridges: 2.4, hq: "Paris, TX", corridors: "US-82, US-271, State Hwy 19" },
  Atlanta: { name: "Atlanta", abbr: "ATL", utpScore: 54, letting: 280, laneMiles: 6800, defBridges: 3.0, hq: "Atlanta, TX", corridors: "I-30, I-369, US-59" },
  "San Angelo": { name: "San Angelo", abbr: "SJT", utpScore: 52, letting: 260, laneMiles: 9600, defBridges: 2.3, hq: "San Angelo, TX", corridors: "US-67, US-87, US-277" },
  Brownwood: { name: "Brownwood", abbr: "BWD", utpScore: 48, letting: 220, laneMiles: 7100, defBridges: 2.9, hq: "Brownwood, TX", corridors: "US-67, US-84, US-183" },
  Childress: { name: "Childress", abbr: "CHS", utpScore: 44, letting: 180, laneMiles: 5200, defBridges: 2.6, hq: "Childress, TX", corridors: "US-287, US-83, US-62" },
};

const selectedDistrict = ref<DistrictRecord>(TXDOT_DISTRICT_DATABASE["Houston"]);

// Maritime Ports Database
interface MaritimePortRecord {
  name: string;
  county: string;
  coords: [number, number];
  tonnage: number;
  dwell: number;
  tradeVal: number;
  draftDepth: number;
  commodities: string;
  rank: string;
}

const GULF_PORTS_DATABASE: Record<string, MaritimePortRecord> = {
  "Port of Houston": {
    name: "Port of Houston",
    county: "Harris County",
    coords: [458.0, 254.0],
    tonnage: 287,
    dwell: 44,
    tradeVal: 240,
    draftDepth: 46.5,
    commodities: "Petroleum, Chemicals, Containers, Steel",
    rank: "#1 in US Waterborne Foreign Commerce",
  },
  "Port of Corpus Christi": {
    name: "Port of Corpus Christi",
    county: "Nueces County",
    coords: [392.0, 332.0],
    tonnage: 187,
    dwell: 32,
    tradeVal: 95,
    draftDepth: 54.0,
    commodities: "Crude Oil Exports, LNG, Refined Products",
    rank: "#1 US Crude Oil Export Gateway",
  },
  "Port of Beaumont": {
    name: "Port of Beaumont",
    county: "Jefferson County",
    coords: [515.0, 238.0],
    tonnage: 85,
    dwell: 28,
    tradeVal: 38,
    draftDepth: 40.0,
    commodities: "Military Logistics, Heavy Grain, Crude",
    rank: "#1 Strategic Military Outload Port in North America",
  },
  "Port Arthur": {
    name: "Port Arthur",
    county: "Jefferson County",
    coords: [520.0, 246.0],
    tonnage: 72,
    dwell: 26,
    tradeVal: 32,
    draftDepth: 40.0,
    commodities: "Petrochemicals, Forest Products, Steel",
    rank: "Major Sabine-Neches Waterway Energy Hub",
  },
  "Port Freeport": {
    name: "Port Freeport",
    county: "Brazoria County",
    coords: [452.0, 281.0],
    tonnage: 42,
    dwell: 22,
    tradeVal: 24,
    draftDepth: 51.0,
    commodities: "Chemicals, Automotive RO/RO, Perishables",
    rank: "Fastest-Growing Deep-Water Container Terminal",
  },
  "Port of Texas City": {
    name: "Port of Texas City",
    county: "Galveston County",
    coords: [462.0, 262.0],
    tonnage: 38,
    dwell: 24,
    tradeVal: 22,
    draftDepth: 45.0,
    commodities: "Petroleum Refining, Chemical Intermediates",
    rank: "Top 15 US Energy Transshipment Port",
  },
  "Port of Galveston": {
    name: "Port of Galveston",
    county: "Galveston County",
    coords: [468.0, 268.0],
    tonnage: 14,
    dwell: 16,
    tradeVal: 18,
    draftDepth: 45.0,
    commodities: "Passenger Cruise Vessels, RO/RO Vehicles, Grain",
    rank: "#4 Cruise Hub in North America",
  },
  "Port of Brownsville": {
    name: "Port of Brownsville",
    county: "Cameron County",
    coords: [380.0, 402.0],
    tonnage: 12,
    dwell: 18,
    tradeVal: 11,
    draftDepth: 42.0,
    commodities: "Steel Slabs, Wind Turbine Blades, Ship Recycling",
    rank: "Only Deep-Water Port on US-Mexico Border",
  },
};

const selectedPort = ref<MaritimePortRecord>(GULF_PORTS_DATABASE["Port of Houston"]);

// Border Gateways Database
interface BorderGatewayRecord {
  name: string;
  city: string;
  county: string;
  coords: [number, number];
  tradeVal: number;
  truckVolume: number;
  peakWait: number;
  lanes: number;
  fastLanes: number;
  commodities: string;
  rank: string;
}

const BORDER_GATEWAYS_DATABASE: Record<string, BorderGatewayRecord> = {
  "World Trade Bridge": {
    name: "World Trade Bridge",
    city: "Laredo",
    county: "Webb County",
    coords: [330.0, 355.0],
    tradeVal: 320,
    truckVolume: 2850,
    peakWait: 48,
    lanes: 16,
    fastLanes: 4,
    commodities: "Automotive Parts, Electronics, Heavy Machinery",
    rank: "#1 Commercial Port of Entry in the United States",
  },
  "Pharr-Reynosa International": {
    name: "Pharr-Reynosa International",
    city: "Pharr",
    county: "Hidalgo County",
    coords: [365.0, 402.0],
    tradeVal: 42,
    truckVolume: 740,
    peakWait: 62,
    lanes: 8,
    fastLanes: 2,
    commodities: "Agricultural Produce (Avocados, Berries), Auto Parts",
    rank: "#1 US Crossing for Fresh Produce & Refrigerated Cargo",
  },
  "Bridge of the Americas / Ysleta": {
    name: "Bridge of the Americas / Ysleta",
    city: "El Paso",
    county: "El Paso County",
    coords: [95.6, 173.0],
    tradeVal: 88,
    truckVolume: 820,
    peakWait: 55,
    lanes: 10,
    fastLanes: 2,
    commodities: "Medical Devices, Consumer Electronics, Auto Wiring",
    rank: "Flagship Gateway for Juarez High-Tech Maquiladora Network",
  },
  "Camino Real International": {
    name: "Camino Real International",
    city: "Eagle Pass",
    county: "Maverick County",
    coords: [295.0, 305.0],
    tradeVal: 34,
    truckVolume: 210,
    peakWait: 42,
    lanes: 6,
    fastLanes: 1,
    commodities: "Brewery Logistics, Vehicle Assembly, Steel",
    rank: "Major Rail and Commercial Highway Transshipment Hub",
  },
  "Colombia-Solidarity Bridge": {
    name: "Colombia-Solidarity Bridge",
    city: "Laredo",
    county: "Webb County",
    coords: [322.0, 345.0],
    tradeVal: 28,
    truckVolume: 490,
    peakWait: 18,
    lanes: 8,
    fastLanes: 3,
    commodities: "Hazmat Freight, Specialized Auto Parts, Pre-cleared Express",
    rank: "Preferred Express Bypass for C-TPAT & FAST Cargo",
  },
  "Veterans International Bridge": {
    name: "Veterans International Bridge",
    city: "Brownsville",
    county: "Cameron County",
    coords: [382.0, 412.0],
    tradeVal: 18,
    truckVolume: 260,
    peakWait: 38,
    lanes: 6,
    fastLanes: 1,
    commodities: "Automotive Stamping, Aerospace Hardware, Agrochemicals",
    rank: "Easternmost Strategic POE on the Texas-Mexico Border",
  },
  "Del Rio International Bridge": {
    name: "Del Rio International Bridge",
    city: "Del Rio",
    county: "Val Verde County",
    coords: [265.0, 280.0],
    tradeVal: 12,
    truckVolume: 110,
    peakWait: 35,
    lanes: 4,
    fastLanes: 1,
    commodities: "Textiles, Electronic Harnesses, Livestock",
    rank: "Key Regional Industrial Crossing for Acuña Free Trade Zone",
  },
  "Presidio International Port of Entry": {
    name: "Presidio International Port of Entry",
    city: "Presidio",
    county: "Presidio County",
    coords: [168.0, 258.0],
    tradeVal: 4,
    truckVolume: 45,
    peakWait: 20,
    lanes: 3,
    fastLanes: 0,
    commodities: "Agricultural Produce, Mineral Ores, Cattle",
    rank: "Strategic Trans-Chihuahua Pacific Corridor Rail/Road Gate",
  },
};

const selectedBorder = ref<BorderGatewayRecord>(BORDER_GATEWAYS_DATABASE["World Trade Bridge"]);

function onChartClick(params: any) {
  if (activeMapMode.value === "txdot-districts" && params.name && TXDOT_DISTRICT_DATABASE[params.name]) {
    selectedDistrict.value = TXDOT_DISTRICT_DATABASE[params.name];
  } else if (activeMapMode.value === "gulf-maritime" && params.name && GULF_PORTS_DATABASE[params.name]) {
    selectedPort.value = GULF_PORTS_DATABASE[params.name];
  } else if (activeMapMode.value === "border-gateways" && params.name && BORDER_GATEWAYS_DATABASE[params.name]) {
    selectedBorder.value = BORDER_GATEWAYS_DATABASE[params.name];
  }
}

function onChartHover(params: any) {
  if (activeMapMode.value === "txdot-districts" && params.name && TXDOT_DISTRICT_DATABASE[params.name]) {
    selectedDistrict.value = TXDOT_DISTRICT_DATABASE[params.name];
  } else if (activeMapMode.value === "gulf-maritime" && params.name && GULF_PORTS_DATABASE[params.name]) {
    selectedPort.value = GULF_PORTS_DATABASE[params.name];
  } else if (activeMapMode.value === "border-gateways" && params.name && BORDER_GATEWAYS_DATABASE[params.name]) {
    selectedBorder.value = BORDER_GATEWAYS_DATABASE[params.name];
  }
}

// Flow mode selector for Texas Triangle
const activeFlowMode = ref<"all" | "truck" | "rail" | "air">("all");

// Maritime mode selector
const activeMaritimeMetric = ref<"all" | "energy" | "container" | "dwell">("all");

// Border mode selector
const activeBorderMetric = ref<"trade" | "trucks" | "wait" | "fast">("trade");

const commandCenterMapOption = computed<EChartsCoreOption>(() => {
  const dark = isDark.value;

  // 1. TXDOT DISTRICTS VIEW
  if (activeMapMode.value === "txdot-districts") {
    const metricKey = activeDistrictMetric.value;
    const metricConfig = {
      utpScore: { min: 40, max: 95, label: "UTP Priority Score (1–100)", unit: "/ 100" },
      letting: { min: 150, max: 1500, label: "Annual Letting ($M)", unit: "M" },
      laneMiles: { min: 5000, max: 13000, label: "Lane Miles", unit: " mi" },
      defBridges: { min: 1.0, max: 4.0, label: "Deficient Bridges (%)", unit: "%" },
    }[metricKey];

    const data = Object.values(TXDOT_DISTRICT_DATABASE).map((d) => ({
      name: d.name,
      value: d[metricKey],
    }));

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const rec = TXDOT_DISTRICT_DATABASE[params.name];
          if (!rec) return `${params.name}: ${params.value}`;
          return `<strong>TxDOT ${rec.name} District (${rec.abbr})</strong><br/>
                  ${metricConfig.label}: <strong>${params.value}${metricConfig.unit}</strong><br/>
                  Annual Letting: <strong>$${rec.letting}M</strong><br/>
                  Lane Miles: <strong>${rec.laneMiles.toLocaleString()} mi</strong>`;
        },
      },
      visualMap: {
        min: metricConfig.min,
        max: metricConfig.max,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        text: ["High", "Low"],
        inRange: {
          color: dark
            ? ["#1F2937", "#005F73", "#EE9B00", "#A02D20"]
            : ["#94D2BD", "#0A9396", "#CA6702", "#500000"],
        },
        calculable: true,
      },
      series: [
        {
          name: metricConfig.label,
          type: "map",
          map: "TXDOT_DISTRICTS",
          roam: true,
          zoom: 1.15,
          emphasis: {
            label: { show: true, fontFamily: "var(--font-display)", fontWeight: "bold" },
            itemStyle: { areaColor: dark ? "#EE9B00" : "#CA6702" },
          },
          data,
        },
      ],
    };
  }

  // 2. TEXAS 254-COUNTIES CHOROPLETH
  if (activeMapMode.value === "texas-counties") {
    return {
      tooltip: {
        trigger: "item",
        formatter: "{b} County<br/>Crash Severity Rate: <strong>{c}</strong> per 100M VMT",
      },
      visualMap: {
        min: 0.8,
        max: 2.8,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        text: ["High Severity", "Low Severity"],
        inRange: {
          color: dark
            ? ["#1F2937", "#005F73", "#EE9B00", "#A02D20"]
            : ["#E9D8A6", "#EE9B00", "#CA6702", "#500000"],
        },
        calculable: true,
      },
      series: [
        {
          name: "Crash Rate",
          type: "map",
          map: "TEXAS_COUNTIES",
          roam: true,
          zoom: 1.15,
          emphasis: {
            label: { show: true, fontFamily: "var(--font-display)" },
            itemStyle: { areaColor: dark ? "#A02D20" : "#500000" },
          },
          data: [
            { name: "Harris", value: 1.84 },
            { name: "Dallas", value: 1.76 },
            { name: "Tarrant", value: 1.42 },
            { name: "Bexar", value: 1.58 },
            { name: "Travis", value: 1.22 },
            { name: "El Paso", value: 1.48 },
            { name: "Collin", value: 0.94 },
            { name: "Denton", value: 1.05 },
            { name: "Hidalgo", value: 2.12 },
            { name: "Cameron", value: 1.95 },
            { name: "Midland", value: 2.45 },
            { name: "Ector", value: 2.68 },
            { name: "Lubbock", value: 1.52 },
            { name: "Potter", value: 1.89 },
            { name: "McLennan", value: 1.64 },
            { name: "Brazos", value: 1.15 },
            { name: "Bell", value: 1.55 },
            { name: "Nueces", value: 1.72 },
            { name: "Webb", value: 2.05 },
          ],
        },
      ],
    };
  }

  // 3. TEXAS TRIANGLE FLOW ARCS WITH TRAILING PARTICLES
  if (activeMapMode.value === "texas-flow") {
    const metroCoords: Record<string, [number, number]> = {
      DFW: [402.3, 139.4],
      HOU: [451.9, 251.0],
      SAT: [350.7, 266.4],
      AUS: [374.5, 234.3],
      ELP: [159.2, 222.8],
      MCA: [358.1, 369.8],
      LBB: [237.3, 107.7],
    };

    let flows = [
      { from: "DFW", to: "HOU", value: 95, mode: "truck" },
      { from: "AUS", to: "SAT", value: 60, mode: "truck" },
      { from: "AUS", to: "DFW", value: 55, mode: "truck" },
      { from: "AUS", to: "HOU", value: 45, mode: "truck" },
      { from: "HOU", to: "SAT", value: 38, mode: "rail" },
      { from: "DFW", to: "SAT", value: 30, mode: "rail" },
      { from: "ELP", to: "DFW", value: 24, mode: "rail" },
      { from: "LBB", to: "DFW", value: 16, mode: "truck" },
      { from: "MCA", to: "SAT", value: 28, mode: "truck" },
      { from: "DFW", to: "ELP", value: 32, mode: "air" },
      { from: "HOU", to: "ELP", value: 26, mode: "air" },
    ];

    if (activeFlowMode.value !== "all") {
      flows = flows.filter((f) => f.mode === activeFlowMode.value);
    }

    const linesData = flows.map((f) => ({
      coords: [metroCoords[f.from], metroCoords[f.to]],
      value: f.value,
    }));

    const scatterData = Object.entries(metroCoords).map(([code, coords]) => ({
      name: code,
      value: [...coords, 100],
    }));

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params.seriesType === "lines") {
            return `Logistics Vector: <strong>${params.data.value}k tons / day</strong>`;
          }
          return `${params.name} Inter-Metro Hub`;
        },
      },
      geo: {
        map: "TXDOT_DISTRICTS",
        roam: true,
        zoom: 1.15,
        silent: true,
        itemStyle: {
          areaColor: dark ? "rgba(255, 255, 255, 0.04)" : "rgba(80, 0, 0, 0.04)",
          borderColor: dark ? "rgba(255, 255, 255, 0.15)" : "rgba(80, 0, 0, 0.12)",
          borderWidth: 1,
        },
        emphasis: {
          disabled: true,
        },
      },
      series: [
        {
          name: "Corridor Arcs",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 1,
          effect: {
            show: true,
            period: 3.2,
            trailLength: 0.65,
            color: dark ? "#EE9B00" : "#500000",
            symbol: "arrow",
            symbolSize: 8,
          },
          lineStyle: {
            color: dark ? "#0A9396" : "#005F73",
            width: 3.5,
            opacity: 0.7,
            curveness: 0.25,
          },
          data: linesData,
        },
        {
          name: "Metropolitan Hubs",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke",
            scale: 3.8,
            period: 2.2,
          },
          label: {
            show: true,
            position: "top",
            formatter: "{b}",
            fontFamily: "var(--font-display)",
            color: dark ? "#F5F5F5" : "#1A1A1A",
            fontSize: 12,
            fontWeight: "bold",
          },
          symbolSize: 14,
          itemStyle: {
            color: dark ? "#A02D20" : "#500000",
            shadowBlur: 12,
            shadowColor: "#500000",
          },
          data: scatterData,
        },
      ],
    };
  }

  // 4. GULF DEEP-WATER MARITIME PORTS & SHIPPING CHANNELS
  if (activeMapMode.value === "gulf-maritime") {
    const shippingChannels = [
      { name: "Houston Ship Channel", coords: [[458, 254], [468, 268], [510, 310]], tons: 287 },
      { name: "Corpus Christi Ship Channel", coords: [[392, 332], [415, 345], [455, 375]], tons: 187 },
      { name: "Sabine-Neches Waterway (Beaumont/Pt Arthur)", coords: [[520, 246], [538, 270], [568, 305]], tons: 157 },
      { name: "Freeport Harbor Channel", coords: [[452, 281], [472, 305], [495, 335]], tons: 42 },
      { name: "Brazos Santiago Pass (Brownsville)", coords: [[380, 402], [405, 410], [435, 420]], tons: 12 },
    ];

    const portsList = Object.values(GULF_PORTS_DATABASE);

    const scatterData = portsList.map((p) => ({
      name: p.name,
      value: [...p.coords, p.tonnage],
      dwell: p.dwell,
      depth: p.draftDepth,
      trade: p.tradeVal,
      county: p.county,
      rank: p.rank,
    }));

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params.seriesType === "lines") {
            return `<strong>${params.name}</strong><br/>Annual Channel Flux: <strong>${params.data.value}M tons</strong>`;
          }
          const d = params.data;
          return `<strong>${params.name} (${d.county})</strong><br/>
                  Annual Cargo: <strong>${d.value[2]}M short tons</strong><br/>
                  Channel Draft Depth: <strong>${d.depth} ft</strong><br/>
                  Vessel Queue Dwell: <strong>${d.dwell} hours</strong><br/>
                  Annual Bilateral Trade: <strong>$${d.trade}B</strong>`;
        },
      },
      geo: {
        map: "TXDOT_DISTRICTS",
        roam: true,
        zoom: 1.15,
        silent: true,
        itemStyle: {
          areaColor: dark ? "rgba(255, 255, 255, 0.04)" : "rgba(80, 0, 0, 0.04)",
          borderColor: dark ? "rgba(255, 255, 255, 0.15)" : "rgba(80, 0, 0, 0.12)",
          borderWidth: 1,
        },
        emphasis: {
          disabled: true,
        },
      },
      series: [
        {
          name: "Deep-Water Shipping Channels",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 1,
          effect: {
            show: true,
            period: 3.8,
            trailLength: 0.7,
            color: dark ? "#EE9B00" : "#500000",
            symbol: "arrow",
            symbolSize: 8,
          },
          lineStyle: {
            color: dark ? "#0A9396" : "#005F73",
            width: 3.5,
            opacity: 0.75,
            curveness: 0.15,
          },
          data: shippingChannels.map((c) => ({
            name: c.name,
            coords: c.coords,
            value: c.tons,
          })),
        },
        {
          name: "Deep-Water Maritime Ports",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke",
            scale: 3.5,
            period: 2.4,
          },
          symbolSize: (val: any) => Math.max(14, Math.sqrt(val[2]) * 1.8),
          itemStyle: {
            color: dark ? "#A02D20" : "#500000",
            shadowBlur: 14,
            shadowColor: "#500000",
          },
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
            fontFamily: "var(--font-display)",
            fontWeight: "bold",
            color: dark ? "#F5F5F5" : "#1A1A1A",
            fontSize: 11,
          },
          data: scatterData,
        },
      ],
    };
  }

  // 5. INTERNATIONAL BORDER GATEWAYS & COMMERCIAL PORTS OF ENTRY
  if (activeMapMode.value === "border-gateways") {
    const gatewaysList = Object.values(BORDER_GATEWAYS_DATABASE);

    const tradeConnectors = [
      { from: "World Trade Bridge", toCoords: [350.7, 266.4], name: "I-35 NAFTA / USMCA Superhighway" },
      { from: "Pharr-Reynosa International", toCoords: [350.7, 266.4], name: "I-69C / US-281 Produce Corridor" },
      { from: "Bridge of the Americas / Ysleta", toCoords: [402.3, 139.4], name: "I-10 Trans-Continental Express" },
      { from: "Camino Real International", toCoords: [350.7, 266.4], name: "US-57 Eagle Pass Corridor" },
      { from: "Veterans International Bridge", toCoords: [451.9, 251.0], name: "US-77 Gulf Coast Freight Corridor" },
      { from: "Del Rio International Bridge", toCoords: [350.7, 266.4], name: "US-90 International Trade Link" },
      { from: "Colombia-Solidarity Bridge", toCoords: [350.7, 266.4], name: "State Hwy 255 FAST Bypass" },
    ];

    const linesData = tradeConnectors.map((c) => ({
      name: c.name,
      coords: [BORDER_GATEWAYS_DATABASE[c.from].coords, c.toCoords],
    }));

    const scatterData = gatewaysList.map((g) => ({
      name: g.name,
      value: [...g.coords, g.tradeVal],
      city: g.city,
      county: g.county,
      trucks: g.truckVolume,
      wait: g.peakWait,
      lanes: g.lanes,
      fast: g.fastLanes,
      commodities: g.commodities,
      rank: g.rank,
    }));

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params.seriesType === "lines") {
            return `<strong>${params.name}</strong><br/>Inland Port-of-Entry Distribution Corridor`;
          }
          const d = params.data;
          return `<strong>${params.name} (${d.city}, ${d.county})</strong><br/>
                  Annual Bilateral Trade: <strong>$${d.value[2]}B</strong><br/>
                  Commercial Trucks: <strong>${d.trucks.toLocaleString()}k / year</strong><br/>
                  Peak Customs Wait Time: <strong>${d.wait} minutes</strong><br/>
                  Inspection Lanes: <strong>${d.lanes} (${d.fast} dedicated FAST)</strong>`;
        },
      },
      geo: {
        map: "TXDOT_DISTRICTS",
        roam: true,
        zoom: 1.15,
        silent: true,
        itemStyle: {
          areaColor: dark ? "rgba(255, 255, 255, 0.04)" : "rgba(80, 0, 0, 0.04)",
          borderColor: dark ? "rgba(255, 255, 255, 0.15)" : "rgba(80, 0, 0, 0.12)",
          borderWidth: 1,
        },
        emphasis: {
          disabled: true,
        },
      },
      series: [
        {
          name: "Inland Customs Corridors",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 1,
          effect: {
            show: true,
            period: 3.4,
            trailLength: 0.65,
            color: dark ? "#EE9B00" : "#500000",
            symbol: "arrow",
            symbolSize: 7,
          },
          lineStyle: {
            color: dark ? "#0A9396" : "#005F73",
            width: 2.8,
            opacity: 0.7,
            curveness: 0.18,
          },
          data: linesData,
        },
        {
          name: "Commercial Ports of Entry",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke",
            scale: 3.6,
            period: 2.2,
          },
          symbolSize: (val: any) => Math.max(12, Math.sqrt(val[2]) * 2.2),
          itemStyle: {
            color: (params: any) => {
              const wait = params.data.wait;
              if (wait > 50) return dark ? "#F87171" : "#AE2012";
              if (wait > 30) return "#CA6702";
              return dark ? "#0A9396" : "#005F73";
            },
            shadowBlur: 14,
            shadowColor: "#500000",
          },
          label: {
            show: true,
            position: "top",
            formatter: (params: any) => `${params.data.city} POE`,
            fontFamily: "var(--font-display)",
            fontWeight: "bold",
            color: dark ? "#F5F5F5" : "#1A1A1A",
            fontSize: 11,
          },
          data: scatterData,
        },
      ],
    };
  }

  // 6. USA ALBERS NATIONAL FREIGHT DENSITY
  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>National Freight Activity Index: <strong>{c} / 100</strong>",
    },
    visualMap: {
      min: 10,
      max: 100,
      orient: "horizontal",
      left: "center",
      bottom: "2%",
      text: ["High Volume", "Low Volume"],
      inRange: {
        color: dark
          ? ["#1F2937", "#005F73", "#EE9B00", "#A02D20"]
          : ["#E9D8A6", "#0A9396", "#CA6702", "#500000"],
      },
      calculable: true,
    },
    series: [
      {
        name: "National Freight",
        type: "map",
        map: "USA_ALBERS",
        roam: true,
        zoom: 1.15,
        emphasis: {
          label: { show: true, fontFamily: "var(--font-display)" },
          itemStyle: { areaColor: dark ? "#A02D20" : "#500000" },
        },
        data: [
          { name: "Texas", value: 100 },
          { name: "California", value: 92 },
          { name: "Illinois", value: 84 },
          { name: "Florida", value: 78 },
          { name: "New York", value: 76 },
          { name: "Georgia", value: 72 },
          { name: "Ohio", value: 68 },
          { name: "Pennsylvania", value: 66 },
          { name: "Louisiana", value: 70 },
          { name: "Oklahoma", value: 58 },
        ],
      },
    ],
  };
});

// ============================================================================
// 5. CORRIDOR TIME-SPACE TRAJECTORY SHOCKWAVE SIMULATOR
// ============================================================================
type ShockwaveIncident = "freeflow" | "minor" | "severe";
const activeIncidentSeverity = ref<ShockwaveIncident>("severe");

const timeSpaceShockwaveOption = computed<EChartsCoreOption>(() => {
  const dark = isDark.value;
  const severity = activeIncidentSeverity.value;

  let trajectories: number[][][] = [];
  let shockwaveLine: number[][] = [];
  let incidentPoint: number[][] = [];

  if (severity === "freeflow") {
    for (let startT = 0; startT <= 80; startT += 7) {
      trajectories.push([
        [startT, 230],
        [startT + 3, 233],
        [startT + 6, 236],
        [startT + 9, 239],
        [startT + 12, 242],
      ]);
    }
  } else if (severity === "minor") {
    incidentPoint = [[15, 238]];
    shockwaveLine = [[15, 238], [35, 235]];
    trajectories = [
      [[0, 230], [5, 233], [10, 236], [15, 239], [20, 242]],
      [[6, 230], [11, 233], [16, 236], [21, 239], [26, 242]],
      [[12, 230], [17, 233], [22, 236], [28, 238], [34, 240], [38, 242]],
      [[18, 230], [24, 233], [30, 236], [38, 238], [44, 240], [48, 242]],
      [[24, 230], [30, 233], [37, 236], [45, 238], [51, 240], [55, 242]],
      [[32, 230], [38, 233], [45, 236], [52, 238], [58, 240], [62, 242]],
      [[42, 230], [48, 233], [54, 236], [60, 239], [65, 242]],
      [[52, 230], [57, 233], [63, 236], [68, 239], [73, 242]],
      [[62, 230], [67, 233], [72, 236], [77, 239], [82, 242]],
      [[72, 230], [77, 233], [82, 236], [87, 239], [90, 241]],
    ];
  } else {
    incidentPoint = [[15, 238]];
    shockwaveLine = [[15, 238], [42, 231.8]];
    trajectories = [
      [[0, 230], [5, 233], [10, 236], [15, 239], [20, 242]],
      [[5, 230], [10, 233], [15, 236], [20, 239], [25, 242]],
      [[10, 230], [15, 233], [20, 236], [25, 239], [30, 242]],
      [[15, 230], [20, 233], [25, 236], [32, 237], [40, 237.5], [48, 238], [52, 240], [55, 242]],
      [[20, 230], [25, 233], [32, 235], [42, 235.8], [52, 237.2], [56, 238], [60, 240], [63, 242]],
      [[25, 230], [30, 232.5], [40, 234], [52, 235.5], [60, 237], [64, 238], [68, 240], [71, 242]],
      [[30, 230], [36, 232], [48, 233.5], [58, 235], [66, 237], [70, 238], [74, 240], [77, 242]],
      [[35, 230], [42, 231.8], [54, 233.2], [64, 235], [72, 237], [76, 238], [80, 240], [83, 242]],
      [[45, 230], [52, 232], [60, 234], [68, 236], [74, 238], [78, 240], [82, 242]],
      [[55, 230], [62, 232.5], [69, 235], [76, 238], [81, 240], [85, 242]],
      [[65, 230], [71, 233], [77, 236], [83, 239], [88, 242]],
      [[75, 230], [80, 233], [85, 236], [90, 239]],
    ];
  }

  return {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        if (params.seriesType === "line") {
          return `Corridor Trajectory: <strong>${params.seriesName}</strong>`;
        }
        return `${params.name}`;
      },
    },
    legend: {
      data: ["Vehicle Trajectories", "Incident Bottleneck", "Backward Shockwave Front"],
      top: 5,
      textStyle: { fontFamily: "var(--font-display)" },
    },
    grid: { left: "8%", right: "6%", bottom: "12%", top: "14%", containLabel: true },
    xAxis: {
      type: "value",
      name: "Time of Day",
      nameLocation: "middle",
      nameGap: 28,
      min: 0,
      max: 90,
      axisLabel: {
        fontFamily: "var(--font-mono)",
        formatter: (v: number) => {
          const hour = 7 + Math.floor(v / 60);
          const min = v % 60;
          return `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;
        },
      },
      splitLine: {
        lineStyle: {
          color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Corridor Location (Milepost)",
      min: 230,
      max: 242,
      axisLabel: { formatter: "MP {value}", fontFamily: "var(--font-mono)" },
      splitLine: {
        lineStyle: {
          color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
      },
    },
    series: [
      ...trajectories.map((traj, idx) => ({
        name: `Vehicle Wave ${idx + 1}`,
        type: "line" as const,
        smooth: true,
        showSymbol: false,
        data: traj,
        lineStyle: {
          width: severity === "severe" && idx >= 3 && idx <= 7 ? 2.8 : 1.8,
          color: severity === "severe" && idx >= 3 && idx <= 7
            ? (dark ? "#AE2012" : "#8B0000")
            : severity === "minor" && idx >= 2 && idx <= 5
              ? "#CA6702"
              : (dark ? "#0A9396" : "#005F73"),
          opacity: 0.85,
        },
      })),
      ...(shockwaveLine.length > 0 ? [{
        name: "Backward Shockwave Front",
        type: "line" as const,
        data: shockwaveLine,
        lineStyle: {
          width: 3.5,
          type: "dashed" as const,
          color: "#EE9B00",
        },
        symbol: "circle",
        symbolSize: 8,
      }] : []),
      ...(incidentPoint.length > 0 ? [{
        name: "Incident Bottleneck",
        type: "scatter" as const,
        data: incidentPoint,
        symbolSize: 18,
        itemStyle: { color: dark ? "#A02D20" : "#500000" },
        label: {
          show: true,
          formatter: severity === "severe" ? "Full Lane Blockage (MP 238)" : "Shoulder Stalling (MP 238)",
          position: "top" as const,
          fontFamily: "var(--font-display)",
          fontWeight: "bold" as const,
          color: dark ? "#F87171" : "#A02D20",
        },
      }] : []),
    ],
  };
});

onUnmounted(() => {
  if (racingTimer) {
    clearInterval(racingTimer);
    racingTimer = null;
  }
  if (telemetryInterval) {
    clearInterval(telemetryInterval);
    telemetryInterval = null;
  }
});
</script>

<template>
  <div class="space-y-16">
    <!-- Header -->
    <TuxPageHeader
      eyebrow="data viz · advanced storytelling, geographic intelligence & telemetry"
      title="TuxECharts"
    >
      First-class Apache ECharts integration engineered for high-density Canvas and WebGL
      scientific telemetry, statewide geographic intelligence, and transformative
      research storytelling. Beyond static tables, dynamic maps and live transitions illuminate
      findings, persuade legislative sponsors, and bring transportation studies to life.
    </TuxPageHeader>

    <!-- ==================================================================== -->
    <!-- SECTION 1: INTERACTIVE TEXAS GEOGRAPHIC & SPATIAL COMMAND CENTER      -->
    <!-- ==================================================================== -->
    <section aria-labelledby="geographic-intelligence-heading" class="p-6 bg-surface-raised border border-surface-border rounded-lg shadow-sm space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-brand-primary/10 border border-brand-primary text-brand-primary text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-brand-primary" aria-hidden="true" />
            <span>Interactive Spatial Intelligence</span>
          </div>
          <h2 id="geographic-intelligence-heading" class="text-2xl font-bold font-display uppercase tracking-tight text-text-primary">
            Texas Spatial Command Deck & Albers Geographic Hub
          </h2>
          <p class="text-xs text-text-secondary mt-1">
            Explore statewide transportation equity, crash severity, and freight flow vectors across administrative and political boundaries.
          </p>
        </div>

        <!-- Map Layer Selector Tabs -->
        <div class="flex flex-wrap items-center gap-2 p-1 bg-surface-sunken border border-surface-border rounded-md" role="tablist" aria-label="Geographic layers">
          <button
            type="button"
            role="tab"
            :aria-selected="activeMapMode === 'txdot-districts'"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeMapMode === 'txdot-districts'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary',
            ]"
            @click="activeMapMode = 'txdot-districts'"
          >
            <span>TxDOT 25 Districts</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeMapMode === 'texas-counties'"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeMapMode === 'texas-counties'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary',
            ]"
            @click="activeMapMode = 'texas-counties'"
          >
            <span>Texas 254 Counties</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeMapMode === 'texas-flow'"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeMapMode === 'texas-flow'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary',
            ]"
            @click="activeMapMode = 'texas-flow'"
          >
            <span>Triangle Flow Vectors</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeMapMode === 'gulf-maritime'"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeMapMode === 'gulf-maritime'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary',
            ]"
            @click="activeMapMode = 'gulf-maritime'"
          >
            <span>Gulf Maritime Ports</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeMapMode === 'border-gateways'"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeMapMode === 'border-gateways'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary',
            ]"
            @click="activeMapMode = 'border-gateways'"
          >
            <span>Border Gateways (POE)</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeMapMode === 'usa-albers'"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeMapMode === 'usa-albers'
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary',
            ]"
            @click="activeMapMode = 'usa-albers'"
          >
            <span>USA Albers National</span>
          </button>
        </div>
      </div>

      <!-- Secondary Sub-Controls for Active Map Mode -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
        <!-- TxDOT District Metric Switcher -->
        <div v-if="activeMapMode === 'txdot-districts'" class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-mono uppercase tracking-wider text-text-muted font-bold mr-1">
            District Metric:
          </span>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeDistrictMetric === 'utpScore' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeDistrictMetric = 'utpScore'"
          >
            UTP Priority (1–100)
          </button>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeDistrictMetric === 'letting' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeDistrictMetric = 'letting'"
          >
            Annual Letting ($M)
          </button>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeDistrictMetric === 'laneMiles' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeDistrictMetric = 'laneMiles'"
          >
            Lane Miles
          </button>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeDistrictMetric === 'defBridges' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeDistrictMetric = 'defBridges'"
          >
            Deficient Bridges (%)
          </button>
        </div>

        <!-- Flow Vectors Mode Switcher -->
        <div v-else-if="activeMapMode === 'texas-flow'" class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-mono uppercase tracking-wider text-text-muted font-bold mr-1">
            Freight Mode:
          </span>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeFlowMode === 'all' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeFlowMode = 'all'"
          >
            All Multimodal
          </button>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeFlowMode === 'truck' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeFlowMode = 'truck'"
          >
            Commercial Trucking
          </button>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeFlowMode === 'rail' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeFlowMode = 'rail'"
          >
            Freight Rail
          </button>
          <button
            type="button"
            class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="activeFlowMode === 'air' ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
            @click="activeFlowMode = 'air'"
          >
            Air Cargo Hubs
          </button>
        </div>

        <!-- Gulf Maritime Sub-info -->
        <div v-else-if="activeMapMode === 'gulf-maritime'" class="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <span class="w-2 h-2 rounded-full bg-teal animate-pulse" aria-hidden="true" />
          <span>Texas Gulf Deep-Water Navigation Channels & Tonnage Convoys · Click or hover a port to inspect.</span>
        </div>

        <!-- Border Gateways Sub-info -->
        <div v-else-if="activeMapMode === 'border-gateways'" class="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <span class="w-2 h-2 rounded-full bg-crimson animate-pulse" aria-hidden="true" />
          <span>USMCA Cross-Border Commercial Logistics Gateways · Color-coded by peak customs wait time.</span>
        </div>

        <div v-else class="text-xs font-mono text-text-muted">
          Pan & Zoom (Roam) enabled. Hover over regions for microdata.
        </div>
      </div>

      <!-- Main Map Display and Live Inspector Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <!-- Interactive Map Canvas (3 cols) -->
        <div class="lg:col-span-3">
          <TuxECharts
            :key="`map-${activeMapMode}-${activeDistrictMetric}-${activeFlowMode}-${isDark}`"
            :options="commandCenterMapOption"
            height="520px"
            aria-title="Interactive Texas Spatial Command Center"
            aria-summary="Displays Texas 254 counties, TxDOT 25 engineering districts, deep-water maritime ports, international border gateways, and multimodal freight flow vectors."
            @chart-click="onChartClick"
            @chart-hover="onChartHover"
          />
        </div>

        <!-- Live Region Detail Inspector Card (1 col) -->
        <div class="lg:col-span-1 p-5 bg-surface-sunken border border-surface-border rounded-md shadow-xs space-y-4">
          <div class="border-b border-surface-border pb-3">
            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-brand-primary text-white rounded-xs font-bold">
              Active Inspector
            </span>
            <h3 class="text-lg font-bold font-display uppercase text-text-primary mt-2">
              {{
                activeMapMode === 'txdot-districts'
                  ? `TxDOT ${selectedDistrict.name}`
                  : activeMapMode === 'texas-counties'
                    ? 'County Analytics'
                    : activeMapMode === 'texas-flow'
                      ? 'Texas Megaregion'
                      : activeMapMode === 'gulf-maritime'
                        ? selectedPort.name
                        : activeMapMode === 'border-gateways'
                          ? selectedBorder.name
                          : 'USA Freight Hub'
              }}
            </h3>
            <p class="text-xs font-mono text-text-muted">
              {{
                activeMapMode === 'txdot-districts'
                  ? `District Code: ${selectedDistrict.abbr} · HQ: ${selectedDistrict.hq}`
                  : activeMapMode === 'gulf-maritime'
                    ? `${selectedPort.county} · ${selectedPort.rank}`
                    : activeMapMode === 'border-gateways'
                      ? `${selectedBorder.city}, ${selectedBorder.county}`
                      : 'Interactive telemetry'
              }}
            </p>
          </div>

          <!-- District Inspector Details -->
          <div v-if="activeMapMode === 'txdot-districts'" class="space-y-3">
            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">UTP Priority Score</p>
              <p class="text-2xl font-black font-mono text-brand-primary">
                {{ selectedDistrict.utpScore }} <span class="text-xs font-normal text-text-muted">/ 100</span>
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Annual Letting Portfolio</p>
              <p class="text-xl font-bold font-mono text-text-primary">
                ${{ selectedDistrict.letting }}M
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Lane Miles Maintained</p>
              <p class="text-sm font-bold font-mono text-text-secondary">
                {{ selectedDistrict.laneMiles.toLocaleString() }} miles
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Structurally Deficient Bridges</p>
              <p class="text-sm font-bold font-mono" :class="selectedDistrict.defBridges > 2.5 ? 'text-crimson' : 'text-forest'">
                {{ selectedDistrict.defBridges }}%
              </p>
            </div>

            <div class="pt-2 border-t border-surface-border">
              <p class="text-[11px] font-mono uppercase text-text-muted mb-1">Key Corridors</p>
              <p class="text-xs text-text-secondary leading-snug">
                {{ selectedDistrict.corridors }}
              </p>
            </div>
          </div>

          <!-- Maritime Inspector Details -->
          <div v-else-if="activeMapMode === 'gulf-maritime'" class="space-y-3">
            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Annual Waterborne Tonnage</p>
              <p class="text-2xl font-black font-mono text-teal">
                {{ selectedPort.tonnage }} <span class="text-xs font-normal text-text-muted">Million Short Tons</span>
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Annual Bilateral Commerce</p>
              <p class="text-xl font-bold font-mono text-text-primary">
                ${{ selectedPort.tradeVal }} Billion
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Authorized Channel Draft</p>
              <p class="text-sm font-bold font-mono text-text-secondary">
                {{ selectedPort.draftDepth }} feet deep-water draft
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Average Vessel Queue Dwell</p>
              <p class="text-sm font-bold font-mono" :class="selectedPort.dwell > 30 ? 'text-gold' : 'text-forest'">
                {{ selectedPort.dwell }} hours dwell time
              </p>
            </div>

            <div class="pt-2 border-t border-surface-border">
              <p class="text-[11px] font-mono uppercase text-text-muted mb-1">Primary Cargo Commodities</p>
              <p class="text-xs text-text-secondary leading-snug">
                {{ selectedPort.commodities }}
              </p>
            </div>
          </div>

          <!-- Border Gateways Inspector Details -->
          <div v-else-if="activeMapMode === 'border-gateways'" class="space-y-3">
            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Annual Cross-Border Trade</p>
              <p class="text-2xl font-black font-mono text-brand-primary">
                ${{ selectedBorder.tradeVal }} <span class="text-xs font-normal text-text-muted">Billion</span>
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Commercial Truck Volume</p>
              <p class="text-xl font-bold font-mono text-text-primary">
                {{ selectedBorder.truckVolume.toLocaleString() }}k <span class="text-xs font-normal text-text-muted">trucks/yr</span>
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Peak Customs Wait Time</p>
              <p class="text-sm font-bold font-mono" :class="selectedBorder.peakWait > 50 ? 'text-crimson' : selectedBorder.peakWait > 30 ? 'text-gold' : 'text-forest'">
                {{ selectedBorder.peakWait }} minutes average peak
              </p>
            </div>

            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Inspection Booths & FAST Lanes</p>
              <p class="text-sm font-bold font-mono text-text-secondary">
                {{ selectedBorder.lanes }} lanes ({{ selectedBorder.fastLanes }} dedicated FAST)
              </p>
            </div>

            <div class="pt-2 border-t border-surface-border">
              <p class="text-[11px] font-mono uppercase text-text-muted mb-1">Strategic Trade Role</p>
              <p class="text-xs text-text-secondary leading-snug">
                {{ selectedBorder.rank }}. Primary freight: {{ selectedBorder.commodities }}.
              </p>
            </div>
          </div>

          <!-- Flow Inspector Details -->
          <div v-else-if="activeMapMode === 'texas-flow'" class="space-y-3">
            <div>
              <p class="text-[11px] font-mono uppercase text-text-muted">Primary Triangle Corridor</p>
              <p class="text-base font-bold font-display uppercase text-brand-primary">
                DFW ↔ Houston
              </p>
              <p class="text-xs text-text-secondary mt-0.5">
                95,000 tons daily commercial freight flux.
              </p>
            </div>

            <div class="pt-2 border-t border-surface-border">
              <p class="text-[11px] font-mono uppercase text-text-muted">Animated Particle Vectors</p>
              <p class="text-xs text-text-secondary leading-relaxed mt-1">
                Trailing vectors indicate real-time directional freight flux across I-35, I-45, and I-10 inter-city arteries.
              </p>
            </div>
          </div>

          <div v-else class="space-y-3 text-xs text-text-secondary leading-relaxed">
            <p>
              Hover or click any geometry feature to inspect real-time corridor metrics, incident rates, and statewide legislative equity scores.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================================================================== -->
    <!-- SECTION 2: SHOWCASE ANIMATIONS & DYNAMIC TRANSITIONS ARENA             -->
    <!-- ==================================================================== -->
    <section aria-labelledby="dynamic-animations-heading" class="space-y-8">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-chart-1/10 border border-chart-1 text-chart-1 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <span class="w-2 h-2 rounded-full bg-chart-1 animate-pulse" aria-hidden="true" />
          <span>Cinematic Live Showcase</span>
        </div>
        <h2 id="dynamic-animations-heading" class="text-2xl font-bold font-display uppercase tracking-tight text-text-primary">
          Dynamic Showcase Animations & Universal Transitions
        </h2>
        <p class="text-xs text-text-secondary mt-1">
          Explore real-time racing bar step engines, universal polygon morphing transitions, and high-frequency streaming telemetry.
        </p>
      </div>

      <!-- Showcase Grid: Racing Bar Arena (Left) & Universal Morph + Streamer (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <!-- ARENA A: DYNAMIC RACING BAR ENGINE -->
        <article class="p-6 bg-surface-raised border border-surface-border rounded-lg shadow-sm space-y-4">
          <div class="flex items-center justify-between gap-4 border-b border-surface-border pb-3">
            <div>
              <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-surface-sunken text-brand-primary rounded-xs border border-surface-border font-bold">
                Dynamic Ranking Engine
              </span>
              <h3 class="text-lg font-bold font-display uppercase text-text-primary mt-1">
                Texas Top 10 Congested Corridors Race (2015–2026)
              </h3>
            </div>

            <!-- Play / Pause Action Button -->
            <button
              type="button"
              class="min-h-[44px] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-2"
              :class="isRacingPlaying ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-primary border-surface-border hover:border-brand-primary'"
              @click="toggleRacingPlayback"
            >
              <span aria-hidden="true">{{ isRacingPlaying ? '⏸' : '▶' }}</span>
              <span>{{ isRacingPlaying ? 'Pause Race' : 'Play Race' }}</span>
            </button>
          </div>

          <p class="text-xs text-text-secondary">
            Watch corridor delay indices actively re-order across 12 consecutive years. Apache ECharts smoothly swaps bar positions with real-time value tweening.
          </p>

          <!-- Interactive Playback Toolbar -->
          <div class="p-3 bg-surface-sunken border border-surface-border rounded-md space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label="Step back one year"
                  class="min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-bold bg-surface-raised border border-surface-border rounded-xs text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center"
                  :disabled="racingYear <= 2015"
                  @click="stepRacingYear(-1)"
                >
                  ◀ -1y
                </button>
                <button
                  type="button"
                  aria-label="Step forward one year"
                  class="min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-bold bg-surface-raised border border-surface-border rounded-xs text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center"
                  :disabled="racingYear >= 2026"
                  @click="stepRacingYear(1)"
                >
                  +1y ▶
                </button>
                <button
                  type="button"
                  class="min-h-[44px] px-3 py-2 text-xs font-mono uppercase bg-surface-raised border border-surface-border rounded-xs text-text-secondary hover:text-text-primary transition-colors"
                  @click="pauseRacingPlayback(); racingYear = 2015;"
                >
                  Reset 2015
                </button>
              </div>

              <!-- Speed Controls -->
              <div class="flex items-center gap-1.5" role="group" aria-label="Playback speed">
                <button
                  v-for="spd in [0.5, 1, 2]"
                  :key="spd"
                  type="button"
                  class="min-h-[44px] min-w-[44px] px-2 py-1.5 text-xs font-mono font-bold rounded-xs border transition-colors flex items-center justify-center"
                  :class="racingSpeed === spd ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-raised text-text-secondary border-surface-border'"
                  @click="setRacingSpeed(spd)"
                >
                  {{ spd }}x
                </button>
              </div>
            </div>

            <!-- Scrub Slider -->
            <div class="space-y-1">
              <div class="flex items-center justify-between text-xs font-mono">
                <span class="text-text-muted">2015</span>
                <span class="font-bold text-brand-primary text-sm">{{ racingYear }}</span>
                <span class="text-text-muted">2026</span>
              </div>
              <label for="racing-year-slider" class="sr-only">Scrub racing year</label>
              <input
                id="racing-year-slider"
                v-model.number="racingYear"
                type="range"
                min="2015"
                max="2026"
                step="1"
                class="w-full accent-brand-primary cursor-pointer min-h-[44px]"
                :aria-valuenow="racingYear"
                :aria-valuemin="2015"
                :aria-valuemax="2026"
              />
            </div>
          </div>

          <!-- Embedded Racing Chart -->
          <TuxECharts
            :key="`racing-bar-${isDark}`"
            :options="dynamicRacingBarOption"
            height="420px"
            aria-title="Top 10 Congested Texas Corridors Racing Bar Chart"
            :aria-summary="`In year ${racingYear}, I-35 Austin Central leads congestion, followed by Loop 610 West Houston and I-69 Southwest Freeway.`"
          />
        </article>

        <!-- ARENA B: UNIVERSAL MORPH TRANSITION LAB -->
        <article class="p-6 bg-surface-raised border border-surface-border rounded-lg shadow-sm space-y-4">
          <div class="flex items-center justify-between gap-4 border-b border-surface-border pb-3">
            <div>
              <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-surface-sunken text-teal rounded-xs border border-surface-border font-bold">
                Universal Morphing
              </span>
              <h3 class="text-lg font-bold font-display uppercase text-text-primary mt-1">
                Universal Morph & Aggregation Transition Lab
              </h3>
            </div>

            <!-- Dataset Switcher: Commute Modes vs UTP Capital Allocation -->
            <div class="flex flex-wrap items-center gap-1.5 p-1 bg-surface-sunken border border-surface-border rounded-md" role="group" aria-label="Morph dataset">
              <button
                type="button"
                class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
                :class="morphActiveDataset === 'commute' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
                @click="morphActiveDataset = 'commute'"
              >
                Modal Commute
              </button>
              <button
                type="button"
                class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
                :class="morphActiveDataset === 'utp' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
                @click="morphActiveDataset = 'utp'"
              >
                UTP Allocation
              </button>
            </div>
          </div>

          <!-- Secondary Sub-Controls for Active Dataset -->
          <div class="flex items-center justify-between gap-3 pt-1 border-t border-surface-border">
            <p class="text-xs text-text-secondary">
              {{
                morphActiveDataset === 'commute'
                  ? 'Universal Transition animates identical data slices between completely different geometric layouts.'
                  : 'Universal Transition explodes high-level capital programs into top regional construction contracts.'
              }}
            </p>

            <!-- Mode selector for Commute -->
            <div v-if="morphActiveDataset === 'commute'" class="flex items-center gap-1 shrink-0" role="group" aria-label="Commute chart shape">
              <button
                type="button"
                class="min-h-[44px] px-2.5 py-1 text-xs font-bold uppercase rounded-xs border transition-all"
                :class="morphViewMode === 'rose' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken border-surface-border text-text-secondary'"
                @click="morphViewMode = 'rose'"
              >
                Rose
              </button>
              <button
                type="button"
                class="min-h-[44px] px-2.5 py-1 text-xs font-bold uppercase rounded-xs border transition-all"
                :class="morphViewMode === 'bar' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken border-surface-border text-text-secondary'"
                @click="morphViewMode = 'bar'"
              >
                Bar
              </button>
              <button
                type="button"
                class="min-h-[44px] px-2.5 py-1 text-xs font-bold uppercase rounded-xs border transition-all"
                :class="morphViewMode === 'donut' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken border-surface-border text-text-secondary'"
                @click="morphViewMode = 'donut'"
              >
                Donut
              </button>
            </div>

            <!-- Drilldown toggle for UTP -->
            <button
              v-else
              type="button"
              class="min-h-[44px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all shrink-0 inline-flex items-center gap-1.5"
              :class="utpDrilldownLevel === 'projects' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-raised text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white'"
              @click="toggleUtpDrilldown"
            >
              <span>{{ utpDrilldownLevel === 'statewide' ? 'Drill Down to Megaprojects ➔' : '◀ Back to Statewide' }}</span>
            </button>
          </div>

          <!-- Embedded Morphing Chart -->
          <TuxECharts
            :key="`morph-${morphActiveDataset}-${utpDrilldownLevel}-${isDark}`"
            :options="morphTransitionOption"
            height="460px"
            aria-title="Interactive universal morph and drilldown chart"
            aria-summary="Demonstrates universal transitions between Rose, Bar, and Donut views for modal commuter share, or between statewide capital allocations and district corridor megaprojects."
          />

          <!-- ARENA C: REAL-TIME TELEMETRY STREAMER WIDGET -->
          <div class="pt-4 border-t border-surface-border space-y-3">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :class="isStreamingActive ? 'bg-forest animate-ping' : 'bg-text-muted'"
                  aria-hidden="true"
                />
                <h4 class="text-xs font-mono uppercase tracking-wider font-bold text-text-primary">
                  Live Connected Vehicle CAN-Bus Stream (RELLIS)
                </h4>
              </div>

              <button
                type="button"
                class="min-h-[44px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
                :class="isStreamingActive ? 'bg-forest text-white border-forest' : 'bg-surface-raised text-text-secondary border-surface-border hover:border-brand-primary'"
                @click="toggleTelemetryStreaming"
              >
                <span>{{ isStreamingActive ? 'Pause Stream' : 'Start Live Stream' }}</span>
              </button>
            </div>

            <!-- Live Telemetry KPI Chips -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div class="p-2.5 bg-surface-sunken border border-surface-border rounded-xs">
                <p class="text-[10px] font-mono text-text-muted uppercase">Speed</p>
                <p class="text-base font-bold font-mono text-brand-primary">
                  {{ streamSpeed[streamSpeed.length - 1] }} <span class="text-[10px] font-normal">MPH</span>
                </p>
              </div>
              <div class="p-2.5 bg-surface-sunken border border-surface-border rounded-xs">
                <p class="text-[10px] font-mono text-text-muted uppercase">Throttle</p>
                <p class="text-base font-bold font-mono text-teal">
                  {{ streamThrottle[streamThrottle.length - 1] }}%
                </p>
              </div>
              <div class="p-2.5 bg-surface-sunken border border-surface-border rounded-xs">
                <p class="text-[10px] font-mono text-text-muted uppercase">Brake Line</p>
                <p class="text-base font-bold font-mono text-crimson">
                  {{ streamBrake[streamBrake.length - 1] }} <span class="text-[10px] font-normal">PSI</span>
                </p>
              </div>
              <div class="p-2.5 bg-surface-sunken border border-surface-border rounded-xs">
                <p class="text-[10px] font-mono text-text-muted uppercase">C-V2X Latency</p>
                <p class="text-base font-bold font-mono text-gold">
                  {{ streamLatency[streamLatency.length - 1] }} <span class="text-[10px] font-normal">ms</span>
                </p>
              </div>
            </div>

            <TuxECharts
              :key="`stream-live-${isDark}`"
              :options="streamingTelemetryOption"
              height="280px"
              aria-title="Live vehicle CAN-Bus telemetry stream"
              aria-summary="Streaming 4-channel telemetry across vehicle speed, throttle position, brake line hydraulic pressure, and C-V2X edge latency."
            />
          </div>
        </article>
      </div>

      <!-- ARENA D: CORRIDOR TIME-SPACE TRAJECTORY SHOCKWAVE SIMULATOR -->
      <article class="p-6 bg-surface-raised border border-surface-border rounded-lg shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-3">
          <div>
            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-surface-sunken text-brand-primary rounded-xs border border-surface-border font-bold">
              Traffic Flow Science · LWR Theory
            </span>
            <h3 class="text-lg font-bold font-display uppercase text-text-primary mt-1">
              I-35 Corridor Vehicle Trajectory Time-Space Simulation & Shockwave Dynamics
            </h3>
          </div>

          <!-- Incident Severity Selector -->
          <div class="flex flex-wrap items-center gap-1.5 p-1 bg-surface-sunken border border-surface-border rounded-md" role="group" aria-label="Incident severity">
            <button
              type="button"
              class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
              :class="activeIncidentSeverity === 'freeflow' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
              @click="activeIncidentSeverity = 'freeflow'"
            >
              Free-Flow (65 MPH)
            </button>
            <button
              type="button"
              class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
              :class="activeIncidentSeverity === 'minor' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
              @click="activeIncidentSeverity = 'minor'"
            >
              Shoulder Stalling (40 MPH)
            </button>
            <button
              type="button"
              class="min-h-[44px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
              :class="activeIncidentSeverity === 'severe' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary'"
              @click="activeIncidentSeverity = 'severe'"
            >
              Lane Blockage (8 MPH)
            </button>
          </div>
        </div>

        <p class="text-xs text-text-secondary">
          Time-space trajectory diagram tracking vehicle progression lines along the I-35 corridor (Mileposts 230 to 242) between 07:00 and 08:30.
          Watch the slope of trajectories flatten as traffic enters the queue, and observe the backwards-forming shockwave propagation boundary.
        </p>

        <!-- Dynamic Simulation KPI Chips -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3 bg-surface-sunken border border-surface-border rounded-xs">
            <p class="text-[10px] font-mono text-text-muted uppercase">Corridor Bottleneck Speed</p>
            <p class="text-xl font-black font-mono" :class="activeIncidentSeverity === 'severe' ? 'text-crimson' : activeIncidentSeverity === 'minor' ? 'text-gold' : 'text-forest'">
              {{ activeIncidentSeverity === 'severe' ? '8.0 MPH' : activeIncidentSeverity === 'minor' ? '40.0 MPH' : '65.0 MPH' }}
            </p>
          </div>
          <div class="p-3 bg-surface-sunken border border-surface-border rounded-xs">
            <p class="text-[10px] font-mono text-text-muted uppercase">Upstream Queue Backlog</p>
            <p class="text-xl font-bold font-mono text-text-primary">
              {{ activeIncidentSeverity === 'severe' ? '4.6 miles' : activeIncidentSeverity === 'minor' ? '1.8 miles' : '0.0 miles' }}
            </p>
          </div>
          <div class="p-3 bg-surface-sunken border border-surface-border rounded-xs">
            <p class="text-[10px] font-mono text-text-muted uppercase">Backward Shockwave Speed</p>
            <p class="text-xl font-bold font-mono text-teal">
              {{ activeIncidentSeverity === 'severe' ? '-14.2 MPH' : activeIncidentSeverity === 'minor' ? '-6.5 MPH' : '0.0 MPH' }}
            </p>
          </div>
          <div class="p-3 bg-surface-sunken border border-surface-border rounded-xs">
            <p class="text-[10px] font-mono text-text-muted uppercase">Passenger Hours of Delay</p>
            <p class="text-xl font-bold font-mono text-brand-primary">
              {{ activeIncidentSeverity === 'severe' ? '3,850 PHD' : activeIncidentSeverity === 'minor' ? '420 PHD' : '0 PHD' }}
            </p>
          </div>
        </div>

        <!-- Embedded Shockwave Chart -->
        <TuxECharts
          :key="`shockwave-${activeIncidentSeverity}-${isDark}`"
          :options="timeSpaceShockwaveOption"
          height="440px"
          aria-title="I-35 Corridor Vehicle Trajectory Time-Space Shockwave Simulation"
          :aria-summary="`Under ${activeIncidentSeverity} incident conditions, bottleneck speeds reach ${activeIncidentSeverity === 'severe' ? '8 MPH with a 4.6-mile queue' : activeIncidentSeverity === 'minor' ? '40 MPH with a 1.8-mile queue' : '65 MPH free-flow'}.`"
        />
      </article>
    </section>

    <!-- ==================================================================== -->
    <!-- SECTION 3: FLAGSHIP FEATURED EXHIBIT SHOWCASE                         -->
    <!-- ==================================================================== -->
    <section aria-labelledby="featured-exhibit-heading" class="pt-8 border-t border-surface-border">
      <div class="flex items-center justify-between gap-4 mb-4">
        <div>
          <p class="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Interactive Presets
          </p>
          <h2 id="featured-exhibit-heading" class="text-xl font-bold font-display uppercase text-text-primary">
            Featured Storytelling Exhibit
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="min-h-[44px] px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-surface-raised border border-surface-border text-text-secondary hover:text-text-primary rounded-xs transition-colors inline-flex items-center gap-1.5"
            @click="showCodeSnippet = !showCodeSnippet"
          >
            <span aria-hidden="true">&lt;/&gt;</span>
            <span>{{ showCodeSnippet ? 'Hide Code' : 'View Code' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Preset Selector Ribbon -->
      <div
        class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin max-w-full min-w-0"
        role="group"
        aria-label="Preset quick switcher"
      >
        <button
          v-for="preset in filteredPresets"
          :key="preset.id"
          type="button"
          class="min-h-[44px] px-3 py-2 text-xs font-bold rounded-xs border whitespace-nowrap transition-all flex items-center gap-2 shrink-0"
          :class="[
            selectedPresetId === preset.id
              ? 'bg-brand-primary/10 border-brand-primary text-brand-primary font-black'
              : 'bg-surface-raised border-surface-border text-text-secondary hover:text-text-primary',
          ]"
          @click="selectPreset(preset.id)"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="selectedPresetId === preset.id ? 'bg-brand-primary' : 'bg-surface-border'"
            aria-hidden="true"
          />
          <span>{{ preset.title }}</span>
        </button>
      </div>

      <!-- Flagship Chart Frame Container -->
      <TuxChartFrame
        :eyebrow="currentPreset.eyebrow"
        :title="currentPreset.title"
        :subtitle="currentPreset.subtitle"
        :source="currentPreset.source"
      >
        <TuxECharts
          :key="`${currentPreset.id}-${isDark}`"
          :options="currentPreset.getOption(isDark)"
          :height="currentPreset.height || '440px'"
          :aria-title="currentPreset.ariaTitle"
          :aria-summary="currentPreset.ariaSummary"
        />
      </TuxChartFrame>

      <!-- Context Narrative & A11y Callout Drawer -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <!-- Story Callout -->
        <div class="p-5 bg-surface-raised border border-surface-border rounded-sm shadow-xs space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-primary" aria-hidden="true" />
            <h3 class="text-xs font-bold uppercase tracking-wider font-display text-text-primary">
              The Research Narrative
            </h3>
          </div>
          <p class="text-xs text-text-secondary leading-relaxed">
            {{ currentPreset.story }}
          </p>
        </div>

        <!-- Accessible Data Summary Callout -->
        <div class="p-5 bg-surface-sunken border border-surface-border rounded-sm shadow-xs space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-chart-1" aria-hidden="true" />
            <h3 class="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
              WCAG 2.2 AAA Screen-Reader Ledger
            </h3>
          </div>
          <p class="text-xs text-text-muted leading-relaxed font-mono">
            {{ currentPreset.ariaSummary }}
          </p>
        </div>
      </div>

      <!-- Copyable Code Snippet Drawer -->
      <div v-if="showCodeSnippet" class="mt-4 p-4 bg-surface-sunken border border-surface-border rounded-md">
        <p class="text-xs font-mono uppercase tracking-wider text-text-muted mb-2 font-bold">
          Nuxt MDC / Component Implementation:
        </p>
        <pre class="p-3 bg-surface-raised rounded-xs border border-surface-border text-xs font-mono text-text-primary overflow-x-auto"><code>&lt;TuxChartFrame
  eyebrow="{{ currentPreset.eyebrow }}"
  title="{{ currentPreset.title }}"
  source="{{ currentPreset.source }}"
&gt;
  &lt;TuxECharts
    :options="chartOptions"
    height="{{ currentPreset.height || '440px' }}"
    aria-title="{{ currentPreset.ariaTitle }}"
    aria-summary="{{ currentPreset.ariaSummary }}"
  /&gt;
&lt;/TuxChartFrame&gt;</code></pre>
      </div>
    </section>

    <!-- ==================================================================== -->
    <!-- SECTION 4: COMPREHENSIVE GALLERY MOSAIC GRID (22 PRESETS)              -->
    <!-- ==================================================================== -->
    <section aria-labelledby="all-presets-heading" class="pt-8 border-t border-surface-border">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Complete Catalog
          </p>
          <h2 id="all-presets-heading" class="text-xl font-bold font-display uppercase text-text-primary">
            All Storytelling Archetypes & Chart Presets ({{ filteredPresets.length }})
          </h2>
          <p class="text-xs text-text-secondary mt-1">
            Explore the full spectrum of Apache ECharts visualizations tailored for institutional transportation reporting.
          </p>
        </div>

        <!-- Category Tabs -->
        <div
          class="flex flex-wrap items-center gap-1.5 p-1 bg-surface-sunken border border-surface-border rounded-md"
          role="tablist"
          aria-label="Storytelling visualization categories"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            role="tab"
            :aria-selected="activeCategory === cat.id"
            class="min-h-[44px] px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="[
              activeCategory === cat.id
                ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                : 'bg-surface-raised text-text-secondary border-surface-border hover:text-text-primary hover:border-text-muted',
            ]"
            @click="activeCategory = cat.id"
          >
            <span>{{ cat.label }}</span>
            <span
              class="px-1.5 py-0.5 rounded-full text-[10px] font-mono"
              :class="activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface-sunken text-text-muted'"
            >
              {{ cat.id === 'all' ? GALLERY_PRESETS.length : GALLERY_PRESETS.filter(p => p.category === cat.id).length }}
            </span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <article
          v-for="preset in filteredPresets"
          :key="preset.id"
          class="bg-surface-raised border border-surface-border rounded-md p-5 shadow-xs flex flex-col justify-between transition-all hover:border-brand-primary/50"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-sunken text-brand-primary rounded-xs border border-surface-border">
                {{ preset.categoryLabel }}
              </span>
              <span v-if="preset.isAnimated" class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-chart-1/10 text-chart-1 rounded-xs">
                Animated
              </span>
            </div>

            <h3 class="text-base font-bold font-display uppercase text-text-primary">
              {{ preset.title }}
            </h3>
            <p class="text-xs text-text-secondary mt-1 line-clamp-2">
              {{ preset.subtitle }}
            </p>

            <!-- Embedded Live Chart -->
            <div class="my-4">
              <TuxECharts
                :key="`mosaic-${preset.id}-${isDark}`"
                :options="preset.getOption(isDark)"
                :height="preset.height || '360px'"
                :aria-title="preset.ariaTitle"
                :aria-summary="preset.ariaSummary"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
            <span class="text-[11px] font-mono text-text-muted truncate max-w-[240px]">
              {{ preset.source }}
            </span>
            <button
              type="button"
              class="min-h-[44px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all inline-flex items-center gap-1.5 shrink-0"
              @click="selectPreset(preset.id); $nextTick(() => { window.scrollTo({ top: 960, behavior: 'smooth' }) })"
            >
              <span>Feature In Main Stage</span>
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
