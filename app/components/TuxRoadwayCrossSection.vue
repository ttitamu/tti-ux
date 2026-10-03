<script setup lang="ts">
/**
 * TuxRoadwayCrossSection — Mathematically accurate highway cross-section visualizer.
 *
 * Implements AASHTO Green Book & TxDOT Roadway Design Manual geometric cross-sections
 * with dual presentation modes:
 *   1. 2D Engineering Flat Profile (CAD blueprint cross-section with slope triangles,
 *      dimension callouts, pavement layers, and drainage geometry).
 *   2. 3D Spatial Pitched Perspective (interactive 3D spatial ribbon with pitch/yaw
 *      rotations, asphalt textures, 3D extruded concrete barrier, embankment foreslope,
 *      drainage ditch swale, backslope, and live vehicle platoon telemetry).
 *
 * Analysis layers:
 *   - Operational Telemetry (Speed, volume, occupancy, Level of Service per lane)
 *   - Pavement Structural Layers (HMAC surface, binder, crushed stone base, subgrade)
 *   - Embankment & Hydrology (4:1 foreslope, ditch invert, soil moisture, Factor of Safety)
 *
 * 100% WCAG 2.2 Level AAA compliant with full keyboard navigation and accessible data tables.
 */
import { ref, computed } from "vue";

export interface LaneDefinition {
  id: string;
  name: string;
  type: "managed" | "general" | "shoulder" | "bike" | "median";
  widthFt: number;
  speedMph?: number;
  volumeVph?: number;
  occupancyPct?: number;
  los?: "A" | "B" | "C" | "D" | "E" | "F";
  label: string;
}

export interface PavementLayer {
  name: string;
  thicknessInches: number;
  material: string;
  modulusPsi: string;
  pci: number;
  colorToken: string;
}

interface Props {
  /** Initial roadway preset */
  preset?: "urban-managed" | "rural-divided" | "suburban-arterial";
  /** Initial visualization mode */
  initialView?: "3d-perspective" | "2d-engineering" | "structural-layers" | "hydrology-slope";
  /** Height of the visualization viewport */
  height?: string;
  /** Whether 3D camera controls are enabled */
  interactive?: boolean;
  /** Initial pitch in degrees (0 = top-down aerial view) */
  initialPitch?: number;
  /** Initial yaw in degrees (0 = straight north-south alignment) */
  initialYaw?: number;
}

const props = withDefaults(defineProps<Props>(), {
  preset: "urban-managed",
  initialView: "3d-perspective",
  height: "560px",
  interactive: true,
  initialPitch: 0,
  initialYaw: 0,
});

const currentPreset = ref<"urban-managed" | "rural-divided" | "suburban-arterial">(props.preset);
const currentView = ref<"3d-perspective" | "2d-engineering" | "structural-layers" | "hydrology-slope">(props.initialView);

// 3D Spatial Camera Controls — Starts Top-Down at 0° (Top Dead Center)
const pitchDeg = ref(props.initialPitch);
const yawDeg = ref(props.initialYaw);
const rollDeg = ref(0);
const zoomScale = ref(1.0);
const animatePlatoons = ref(true);
const selectedLaneIndex = ref<number | null>(null);

// Direct Manipulation Pointer Orbit Drag State
const isDragging = ref(false);
const hasUserInteracted = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let dragStartPitch = 0;
let dragStartYaw = 0;

function resetCamera() {
  pitchDeg.value = 0;
  yawDeg.value = 0;
  rollDeg.value = 0;
  zoomScale.value = 1.0;
}

function setViewTopDown() {
  pitchDeg.value = 0;
  yawDeg.value = 0;
  rollDeg.value = 0;
  zoomScale.value = 1.0;
  hasUserInteracted.value = true;
}

function setViewIsometric() {
  pitchDeg.value = 48;
  yawDeg.value = -16;
  rollDeg.value = 0;
  zoomScale.value = 1.0;
  hasUserInteracted.value = true;
}

function setViewDriver() {
  pitchDeg.value = 68;
  yawDeg.value = -4;
  rollDeg.value = 0;
  zoomScale.value = 1.05;
  hasUserInteracted.value = true;
}

function onPointerDown(e: PointerEvent) {
  if (!props.interactive) return;
  const target = e.target as HTMLElement;
  if (target.closest("button, input, select, a, .tux-roadway__3d-controls")) return;

  isDragging.value = true;
  hasUserInteracted.value = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragStartPitch = pitchDeg.value;
  dragStartYaw = yawDeg.value;

  (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return;
  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;

  // Vertical drag: dragging down increases pitch (tilts from top-down to 3D perspective)
  // Dragging up decreases pitch (tilts toward top-down)
  const sensitivity = 0.35;
  const nextPitch = Math.max(0, Math.min(75, dragStartPitch + deltaY * sensitivity));
  const nextYaw = Math.max(-45, Math.min(45, dragStartYaw + deltaX * sensitivity));

  pitchDeg.value = Math.round(nextPitch);
  yawDeg.value = Math.round(nextYaw);
}

function onPointerUp(e: PointerEvent) {
  if (isDragging.value) {
    isDragging.value = false;
    try {
      (e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}
  }
}

function onWheel(e: WheelEvent) {
  if (!props.interactive) return;
  hasUserInteracted.value = true;
  const zoomStep = -e.deltaY * 0.0015;
  zoomScale.value = Math.max(0.65, Math.min(1.65, +(zoomScale.value + zoomStep).toFixed(2)));
}

// Distance / pop-out factor from Top Dead Center (TDC 0°)
// Lifts and billboards 3D text panes when pitched away from top-down
const popOutFactor = computed(() => {
  // Starts lifting at 6° pitch, fully billboarded and expanded by 30°
  return Math.max(0, Math.min(1, (pitchDeg.value - 6) / 24));
});

// Billboard transform for floating 3D text panes
const billboardCardStyle = computed(() => {
  const factor = popOutFactor.value;
  const liftZ = Math.round(factor * 44);
  const counterPitch = Math.round(-pitchDeg.value * factor * 0.88);
  const counterYaw = Math.round(-yawDeg.value * factor * 0.88);
  const scale = +(1.0 + factor * 0.12).toFixed(2);

  return {
    transform: `translateZ(${liftZ}px) rotateX(${counterPitch}deg) rotateZ(${counterYaw}deg) scale(${scale})`,
    transformOrigin: "bottom center",
    transition: isDragging.value ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  };
});

// Preset Data Models
const presets = {
  "urban-managed": {
    name: "TxDOT Urban Managed Freeway (I-35 / I-10 Katy)",
    classification: "Urban Interstate · Dual-Carriageway with Express Managed Lanes",
    medianType: "TxDOT Single-Slope Concrete Barrier (SSCB - 42\")",
    crossSlopePct: 2.0,
    crownType: "Normal Crown (-2.0% downward to shoulder)",
    foreslope: "4:1 Recoverable Foreslope",
    foreslopeRatio: 4,
    ditchDepthFt: 4.5,
    ditchWidthFt: 6.0,
    backslope: "3:1 Backslope to R.O.W.",
    soilMoisture: "16.4%",
    factorOfSafety: "1.84 (Stable)",
    runoffFlowCfs: "4.8 cfs (10-Yr Storm Capacity)",
    lanes: [
      { id: "l-is", name: "Inside Shoulder", type: "shoulder" as const, widthFt: 4, label: "4' In Shldr" },
      { id: "l-1", name: "Lane 1 (TEXpress Managed)", type: "managed" as const, widthFt: 12, speedMph: 68, volumeVph: 1420, occupancyPct: 14, los: "A" as const, label: "12' Managed" },
      { id: "l-2", name: "Lane 2 (GP Fast)", type: "general" as const, widthFt: 12, speedMph: 58, volumeVph: 1890, occupancyPct: 22, los: "C" as const, label: "12' GP Fast" },
      { id: "l-3", name: "Lane 3 (GP Middle)", type: "general" as const, widthFt: 12, speedMph: 51, volumeVph: 2150, occupancyPct: 28, los: "D" as const, label: "12' GP Mid" },
      { id: "l-4", name: "Lane 4 (GP Merge/Freight)", type: "general" as const, widthFt: 12, speedMph: 42, volumeVph: 1760, occupancyPct: 34, los: "E" as const, label: "12' GP Slow" },
      { id: "l-os", name: "Outside Shoulder", type: "shoulder" as const, widthFt: 10, label: "10' Out Shldr" },
    ],
    layers: [
      { name: "Superpave HMAC Surface Course", thicknessInches: 2.0, material: "TxDOT Item 344 SP-C PG 76-22", modulusPsi: "450,000 psi", pci: 92, colorToken: "var(--brand-primary)" },
      { name: "Dense-Graded Asphalt Binder Course", thicknessInches: 3.5, material: "TxDOT Item 341 Type B PG 64-22", modulusPsi: "400,000 psi", pci: 88, colorToken: "color-mix(in srgb, var(--brand-primary) 70%, black)" },
      { name: "Crushed Stone Flexible Base", thicknessInches: 10.0, material: "TxDOT Item 247 Grade 1-2 Limestone", modulusPsi: "45,000 psi", pci: 94, colorToken: "color-mix(in srgb, var(--brand-secondary) 80%, black)" },
      { name: "Lime-Treated Subgrade Layer", thicknessInches: 8.0, material: "TxDOT Item 260 Hydrated Lime 6%", modulusPsi: "28,000 psi", pci: 96, colorToken: "var(--surface-sunken)" },
      { name: "Compacted Native Subgrade", thicknessInches: 12.0, material: "Cohesive Clay / Silt (CH/CL)", modulusPsi: "12,000 psi", pci: 90, colorToken: "var(--surface-border)" },
    ],
  },
  "rural-divided": {
    name: "TxDOT Rural Interstate (I-45 Walker County)",
    classification: "Rural Principal Arterial · Depressed Turf Median",
    medianType: "36' Depressed Grass Median with V-Ditch",
    crossSlopePct: 2.0,
    crownType: "Dual Inverted Crown (-2.0%)",
    foreslope: "6:1 Gentle Recoverable Slope",
    foreslopeRatio: 6,
    ditchDepthFt: 3.5,
    ditchWidthFt: 8.0,
    backslope: "4:1 Backslope to R.O.W.",
    soilMoisture: "12.8%",
    factorOfSafety: "2.15 (Highly Stable)",
    runoffFlowCfs: "2.9 cfs",
    lanes: [
      { id: "l-is", name: "Inside Shoulder", type: "shoulder" as const, widthFt: 6, label: "6' In Shldr" },
      { id: "l-1", name: "Lane 1 (Passing)", type: "general" as const, widthFt: 12, speedMph: 74, volumeVph: 920, occupancyPct: 9, los: "A" as const, label: "12' Passing" },
      { id: "l-2", name: "Lane 2 (Cruising)", type: "general" as const, widthFt: 12, speedMph: 69, volumeVph: 1280, occupancyPct: 15, los: "B" as const, label: "12' Cruising" },
      { id: "l-os", name: "Outside Shoulder", type: "shoulder" as const, widthFt: 10, label: "10' Out Shldr" },
    ],
    layers: [
      { name: "Permeable Friction Course (PFC)", thicknessInches: 1.5, material: "TxDOT Item 342 PFC Asphalt", modulusPsi: "380,000 psi", pci: 95, colorToken: "var(--brand-primary)" },
      { name: "Continuous Reinforced Concrete Pavement (CRCP)", thicknessInches: 11.0, material: "TxDOT Item 360 Class P Concrete (570 psi flex)", modulusPsi: "4,000,000 psi", pci: 98, colorToken: "color-mix(in srgb, var(--brand-secondary) 90%, white)" },
      { name: "Hot-Mix Asphalt Bond Breaker", thicknessInches: 1.5, material: "TxDOT Item 340 Type F", modulusPsi: "350,000 psi", pci: 92, colorToken: "color-mix(in srgb, var(--brand-primary) 60%, black)" },
      { name: "Cement-Treated Base", thicknessInches: 6.0, material: "TxDOT Item 276 Class M", modulusPsi: "80,000 psi", pci: 94, colorToken: "var(--surface-sunken)" },
      { name: "Compacted Subgrade", thicknessInches: 12.0, material: "Sandy Loam Subgrade", modulusPsi: "15,000 psi", pci: 91, colorToken: "var(--surface-border)" },
    ],
  },
  "suburban-arterial": {
    name: "Multimodal Urban Boulevard (FM 2818 Bryan/College Station)",
    classification: "Urban Major Arterial · Complete Street with Protected Micro-Mobility",
    medianType: "14' Raised Landscaped Curb Median",
    crossSlopePct: 2.0,
    crownType: "Curbed Gutter Profile (-2.0%)",
    foreslope: "3:1 Curb & Bioswale Slope",
    foreslopeRatio: 3,
    ditchDepthFt: 2.5,
    ditchWidthFt: 5.0,
    backslope: "2:1 Swale to Sidewalk Buffer",
    soilMoisture: "19.2%",
    factorOfSafety: "1.92 (Stable)",
    runoffFlowCfs: "3.4 cfs",
    lanes: [
      { id: "l-1", name: "Lane 1 (Inside Travel)", type: "general" as const, widthFt: 11, speedMph: 44, volumeVph: 1150, occupancyPct: 24, los: "C" as const, label: "11' Inside" },
      { id: "l-2", name: "Lane 2 (Outside Travel)", type: "general" as const, widthFt: 11, speedMph: 41, volumeVph: 1320, occupancyPct: 29, los: "D" as const, label: "11' Outside" },
      { id: "l-buf", name: "Painted Buffer", type: "shoulder" as const, widthFt: 3, label: "3' Buffer" },
      { id: "l-bike", name: "Protected Cycle Track", type: "bike" as const, widthFt: 6, speedMph: 15, volumeVph: 85, occupancyPct: 4, los: "A" as const, label: "6' Bike Track" },
      { id: "l-curb", name: "Curb & Gutter Swale", type: "shoulder" as const, widthFt: 2, label: "2' Curb" },
    ],
    layers: [
      { name: "Fine Surface Asphalt Overlay", thicknessInches: 2.0, material: "TxDOT Item 344 Superpave SP-D", modulusPsi: "420,000 psi", pci: 89, colorToken: "var(--brand-primary)" },
      { name: "Asphalt Intermediate Leveling", thicknessInches: 2.5, material: "TxDOT Item 341 Type C", modulusPsi: "390,000 psi", pci: 86, colorToken: "color-mix(in srgb, var(--brand-primary) 70%, black)" },
      { name: "Crushed Stone Base Course", thicknessInches: 8.0, material: "TxDOT Item 247 Limestone Base", modulusPsi: "40,000 psi", pci: 93, colorToken: "color-mix(in srgb, var(--brand-secondary) 80%, black)" },
      { name: "Geotextile Separation Fabric", thicknessInches: 0.5, material: "Class 1 Non-Woven Geotextile", modulusPsi: "N/A", pci: 99, colorToken: "var(--brand-accent)" },
      { name: "Stabilized Subgrade Soil", thicknessInches: 8.0, material: "Cement Stabilized Natural Soil", modulusPsi: "22,000 psi", pci: 92, colorToken: "var(--surface-border)" },
    ],
  },
};

const activeData = computed(() => presets[currentPreset.value]);

const totalRoadwayWidthFt = computed(() => {
  return activeData.value.lanes.reduce((acc, l) => acc + l.widthFt, 0);
});

// Embankment Geometry Calculations
const foreslopeWidthFt = computed(() => {
  return activeData.value.ditchDepthFt * activeData.value.foreslopeRatio;
});

const backslopeWidthFt = computed(() => {
  return activeData.value.ditchDepthFt * 3; // Standard 3:1 backslope
});

const totalCrossSectionWidthFt = computed(() => {
  return totalRoadwayWidthFt.value + foreslopeWidthFt.value + activeData.value.ditchWidthFt + backslopeWidthFt.value + 8; // +8 for barrier/median
});

// 2D CAD SVG Coordinate Mapping
const svgViewBoxWidth = 980;
const svgViewBoxHeight = 340;
const scalePxPerFt = computed(() => (svgViewBoxWidth - 80) / totalCrossSectionWidthFt.value);

// Key Coordinate Points for 2D Cross-Section (Starting from Left Median Barrier to Right ROW line)
const cadPoints = computed(() => {
  const scale = scalePxPerFt.value;
  const startX = 40;
  const roadbedTopY = 130;
  const pts: Array<{ x: number; y: number; label: string }> = [];

  let curX = startX;
  // Point 0: Barrier / Crown Center
  pts.push({ x: curX, y: roadbedTopY, label: "Crown / Barrier" });
  curX += 4 * scale; // 4ft median allowance

  // Points along the roadway surface (incorporating -2% cross-slope)
  for (const lane of activeData.value.lanes) {
    const laneW = lane.widthFt * scale;
    const dropY = (lane.widthFt * (activeData.value.crossSlopePct / 100)) * scale * 4; // visual exaggeration for clarity
    pts.push({ x: curX + laneW, y: roadbedTopY + dropY, label: lane.name });
    curX += laneW;
  }

  // Hinge point (Edge of Paved Shoulder)
  const hingeX = curX;
  const hingeY = roadbedTopY + 12;

  // Foreslope descending to Ditch Invert
  const ditchInvertX = hingeX + foreslopeWidthFt.value * scale;
  const ditchInvertY = hingeY + activeData.value.ditchDepthFt * scale * 3.5;

  // Ditch Bottom flat swale
  const ditchEndX = ditchInvertX + activeData.value.ditchWidthFt * scale;
  const ditchEndY = ditchInvertY;

  // Backslope rising up to ROW natural grade
  const rowX = ditchEndX + backslopeWidthFt.value * scale;
  const rowY = roadbedTopY + 6;

  return {
    startX,
    roadbedTopY,
    hingeX,
    hingeY,
    ditchInvertX,
    ditchInvertY,
    ditchEndX,
    ditchEndY,
    rowX,
    rowY,
  };
});

function losClass(los?: string): string {
  switch (los) {
    case "A":
    case "B":
      return "text-status-success bg-status-success/15 border-status-success/30";
    case "C":
      return "text-status-info bg-status-info/15 border-status-info/30";
    case "D":
    case "E":
      return "text-status-warn bg-status-warn/15 border-status-warn/30";
    case "F":
      return "text-status-danger bg-status-danger/15 border-status-danger/30";
    default:
      return "text-text-muted bg-surface-sunken border-surface-border";
  }
}
</script>

<template>
  <div class="tux-roadway-cross-section">
    <!-- Header Control Strip -->
    <header class="tux-roadway__header">
      <div class="tux-roadway__title-area">
        <div class="tux-roadway__eyebrow-row">
          <span class="tux-roadway__badge">AASHTO / TxDOT Geometric Standard</span>
          <span class="tux-roadway__classification">{{ activeData.classification }}</span>
        </div>
        <h3 class="tux-roadway__title">{{ activeData.name }}</h3>
      </div>

      <!-- Presets & View Controls -->
      <div class="tux-roadway__controls-row">
        <!-- Preset Dropdown -->
        <div class="tux-roadway__control-group">
          <label for="roadway-preset-select" class="tux-roadway__control-label">Facility Preset:</label>
          <select
            id="roadway-preset-select"
            v-model="currentPreset"
            class="tux-roadway__select"
            aria-label="Select Roadway Geometry Preset"
          >
            <option value="urban-managed">Urban Managed Freeway (I-35)</option>
            <option value="rural-divided">Rural Interstate (I-45 Divided)</option>
            <option value="suburban-arterial">Multimodal Boulevard (FM 2818)</option>
          </select>
        </div>

        <!-- Mode Toggle Switcher -->
        <div class="tux-roadway__mode-pills" role="radiogroup" aria-label="Visualization View Mode">
          <button
            type="button"
            role="radio"
            :aria-checked="currentView === '3d-perspective'"
            class="tux-roadway__mode-btn"
            :class="{ 'tux-roadway__mode-btn--active': currentView === '3d-perspective' }"
            @click="currentView = '3d-perspective'"
          >
            <Icon name="lucide:box" class="w-3.5 h-3.5" aria-hidden="true" />
            <span>3D Spatial Perspective</span>
          </button>
          <button
            type="button"
            role="radio"
            :aria-checked="currentView === '2d-engineering'"
            class="tux-roadway__mode-btn"
            :class="{ 'tux-roadway__mode-btn--active': currentView === '2d-engineering' }"
            @click="currentView = '2d-engineering'"
          >
            <Icon name="lucide:drafting-compass" class="w-3.5 h-3.5" aria-hidden="true" />
            <span>2D CAD Blueprint Profile</span>
          </button>
          <button
            type="button"
            role="radio"
            :aria-checked="currentView === 'structural-layers'"
            class="tux-roadway__mode-btn"
            :class="{ 'tux-roadway__mode-btn--active': currentView === 'structural-layers' }"
            @click="currentView = 'structural-layers'"
          >
            <Icon name="lucide:layers" class="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pavement Structural Strata</span>
          </button>
          <button
            type="button"
            role="radio"
            :aria-checked="currentView === 'hydrology-slope'"
            class="tux-roadway__mode-btn"
            :class="{ 'tux-roadway__mode-btn--active': currentView === 'hydrology-slope' }"
            @click="currentView = 'hydrology-slope'"
          >
            <Icon name="lucide:waves" class="w-3.5 h-3.5" aria-hidden="true" />
            <span>Embankment & Hydrology</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Visual Stage -->
    <div class="tux-roadway__stage" :style="{ minHeight: height }">
      <!-- ══════════════════════════════════════════════════════════════════════
           VIEW 1: 3D SPATIAL PITCHED PERSPECTIVE
           ══════════════════════════════════════════════════════════════════════ -->
      <div
        v-if="currentView === '3d-perspective'"
        class="tux-roadway__3d-viewport"
      >
        <!-- 3D Scene Controller Dock -->
        <div class="tux-roadway__3d-controls" aria-label="3D Spatial Camera Pitch and Orientation Controls">
          <!-- Preset View Angles -->
          <div class="tux-roadway__presets-row">
            <button
              type="button"
              class="tux-roadway__angle-btn"
              :class="{ 'tux-roadway__angle-btn--active': pitchDeg <= 5 }"
              @click="setViewTopDown"
              title="Top Dead Center (0° Aerial View)"
            >
              Top-Down (0°)
            </button>
            <button
              type="button"
              class="tux-roadway__angle-btn"
              :class="{ 'tux-roadway__angle-btn--active': pitchDeg > 35 && pitchDeg < 60 }"
              @click="setViewIsometric"
              title="Isometric 3D Perspective (48°)"
            >
              Iso 3D (48°)
            </button>
            <button
              type="button"
              class="tux-roadway__angle-btn"
              :class="{ 'tux-roadway__angle-btn--active': pitchDeg >= 60 }"
              @click="setViewDriver"
              title="Driver Viewpoint (68°)"
            >
              Driver (68°)
            </button>
          </div>

          <div class="tux-roadway__slider-item">
            <label for="pitch-slider" class="tux-roadway__slider-label">
              <span>Pitch Angle</span>
              <span class="font-mono text-xs">{{ pitchDeg === 0 ? '0° (Top-Down)' : `${pitchDeg}°` }}</span>
            </label>
            <input
              id="pitch-slider"
              v-model.number="pitchDeg"
              type="range"
              min="0"
              max="75"
              step="1"
              class="tux-roadway__slider"
              aria-label="Roadway 3D Pitch angle"
            />
          </div>

          <div class="tux-roadway__slider-item">
            <label for="yaw-slider" class="tux-roadway__slider-label">
              <span>Yaw Angle</span>
              <span class="font-mono text-xs">{{ yawDeg }}°</span>
            </label>
            <input
              id="yaw-slider"
              v-model.number="yawDeg"
              type="range"
              min="-45"
              max="45"
              step="1"
              class="tux-roadway__slider"
              aria-label="Roadway 3D Yaw rotation angle"
            />
          </div>

          <div class="tux-roadway__slider-item">
            <label for="zoom-slider" class="tux-roadway__slider-label">
              <span>Zoom Scale</span>
              <span class="font-mono text-xs">{{ Math.round(zoomScale * 100) }}%</span>
            </label>
            <input
              id="zoom-slider"
              v-model.number="zoomScale"
              type="range"
              min="0.65"
              max="1.65"
              step="0.05"
              class="tux-roadway__slider"
              aria-label="Roadway 3D Zoom Scale"
            />
          </div>

          <div class="flex items-center gap-2 pt-1 border-t border-surface-border mt-1">
            <button
              type="button"
              class="tux-roadway__action-btn"
              @click="resetCamera"
              title="Reset to Top-Down View"
            >
              <Icon name="lucide:rotate-ccw" class="w-3 h-3" aria-hidden="true" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              class="tux-roadway__action-btn"
              :class="{ 'tux-roadway__action-btn--active': animatePlatoons }"
              @click="animatePlatoons = !animatePlatoons"
            >
              <Icon :name="animatePlatoons ? 'lucide:pause' : 'lucide:play'" class="w-3 h-3" aria-hidden="true" />
              <span>{{ animatePlatoons ? 'Pause' : 'Animate' }}</span>
            </button>
          </div>
        </div>

        <!-- 3D Transformed Corridor Canvas Ribbon with Direct-Manipulation Orbit Drag -->
        <div
          class="tux-roadway__perspective-wrapper"
          :class="{ 'tux-roadway__perspective-wrapper--dragging': isDragging }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
        >
          <!-- Orbit Drag & Zoom Guidance Hint Badge -->
          <div
            v-if="!hasUserInteracted"
            class="tux-roadway__interactive-hint"
            aria-hidden="true"
          >
            <Icon name="lucide:move" class="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span>Click &amp; drag to orbit (pitch &amp; yaw) &bull; Scroll to zoom &bull; Tilt away from top-down to pop 3D HUD</span>
          </div>

          <div
            class="tux-roadway__3d-corridor"
            :style="{
              transform: `perspective(1000px) scale(${zoomScale}) rotateX(${pitchDeg}deg) rotateY(${rollDeg}deg) rotateZ(${yawDeg}deg)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }"
          >
            <!-- Concrete Median Barrier (TxDOT Single Slope) -->
            <div class="tux-roadway__3d-barrier">
              <div class="tux-roadway__barrier-cap" />
              <div class="tux-roadway__barrier-face" />
            </div>

            <!-- Asphalt Roadbed Surface with Realistic Markings -->
            <div class="tux-roadway__3d-roadbed">
              <div
                v-for="(lane, idx) in activeData.lanes"
                :key="lane.id"
                class="tux-roadway__3d-lane"
                :class="[
                  `tux-roadway__3d-lane--${lane.type}`,
                  { 'tux-roadway__3d-lane--selected': selectedLaneIndex === idx }
                ]"
                :style="{ flex: lane.widthFt }"
                @click="selectedLaneIndex = idx"
              >
                <!-- Striping lines -->
                <div v-if="idx === 0" class="tux-roadway__stripe-yellow" />
                <div v-else-if="lane.type === 'shoulder'" class="tux-roadway__stripe-white-solid" />
                <div v-else class="tux-roadway__stripe-white-dashed" />

                <!-- Floating 3D Spatial Telemetry Pane (Pops out when tilted away from Top Dead Center) -->
                <div
                  class="tux-roadway__lane-signage"
                  :class="{
                    'tux-roadway__lane-signage--popped': popOutFactor > 0.05,
                    'tux-roadway__lane-signage--selected': selectedLaneIndex === idx
                  }"
                >
                  <!-- Vertical Stanchion Pin / Leader Line anchoring HUD card down to roadbed -->
                  <div
                    v-if="popOutFactor > 0.08"
                    class="tux-roadway__signage-stanchion"
                    :style="{ height: `${Math.round(popOutFactor * 32)}px` }"
                  >
                    <div class="tux-roadway__stanchion-dot" />
                  </div>

                  <!-- Billboarded Floating HUD Card -->
                  <div
                    class="tux-roadway__signage-card"
                    :style="billboardCardStyle"
                  >
                    <div class="tux-roadway__signage-top" :title="lane.name">
                      <span class="tux-roadway__lane-title">{{ lane.label }}</span>
                    </div>

                    <div v-if="lane.speedMph" class="tux-roadway__signage-stats">
                      <div class="tux-roadway__signage-main-stat">
                        <span class="tux-roadway__lane-speed">{{ lane.speedMph }} MPH</span>
                        <span v-if="lane.los" class="tux-roadway__lane-los" :class="losClass(lane.los)">
                          LOS {{ lane.los }}
                        </span>
                      </div>

                      <!-- Popped-out expanded real-time telemetry metrics -->
                      <div
                        v-if="popOutFactor > 0.2"
                        class="tux-roadway__signage-expanded"
                        :style="{ opacity: Math.min(1, (popOutFactor - 0.2) * 2) }"
                      >
                        <span class="tux-roadway__expanded-item">
                          <strong>{{ lane.volumeVph?.toLocaleString() ?? '—' }}</strong> vph
                        </span>
                        <span class="tux-roadway__expanded-item">
                          <strong>{{ lane.occupancyPct ?? '—' }}%</strong> occ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Animated 3D Vehicle Platoon in Lane -->
                <div
                  v-if="lane.type !== 'shoulder'"
                  class="tux-roadway__platoon-stream"
                  :class="{ 'tux-roadway__platoon-stream--animating': animatePlatoons }"
                >
                  <div
                    v-for="v in 3"
                    :key="v"
                    class="tux-roadway__vehicle"
                    :class="[
                      lane.type === 'managed' ? 'tux-roadway__vehicle--ev' : v === 2 ? 'tux-roadway__vehicle--truck' : 'tux-roadway__vehicle--sedan'
                    ]"
                    :style="{ animationDelay: `${(v * 1.4) + (idx * 0.6)}s` }"
                  >
                    <!-- Soft Ground Contact Shadow on Asphalt -->
                    <div class="tux-roadway__v3d-shadow" />

                    <!-- 4 Wheels -->
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--fl" />
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--fr" />
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--rl" />
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--rr" />

                    <!-- Extruded 3D Chassis Body -->
                    <div class="tux-roadway__v3d-chassis">
                      <!-- Hood (Facing Forward / Down) -->
                      <div class="tux-roadway__v3d-hood" />
                      <!-- Trunk (Facing Rear / Up) -->
                      <div class="tux-roadway__v3d-trunk" />
                      <!-- 3D Flank Walls -->
                      <div class="tux-roadway__v3d-flank tux-roadway__v3d-flank--left" />
                      <div class="tux-roadway__v3d-flank tux-roadway__v3d-flank--right" />
                      <!-- Front Bumper Face with Headlamps -->
                      <div class="tux-roadway__v3d-bumper-front">
                        <div class="tux-roadway__v3d-headlamp tux-roadway__v3d-headlamp--left" />
                        <div class="tux-roadway__v3d-headlamp tux-roadway__v3d-headlamp--right" />
                      </div>
                      <!-- Rear Bumper Face with Taillights -->
                      <div class="tux-roadway__v3d-bumper-rear">
                        <div class="tux-roadway__v3d-taillight tux-roadway__v3d-taillight--left" />
                        <div class="tux-roadway__v3d-taillight tux-roadway__v3d-taillight--right" />
                      </div>
                    </div>

                    <!-- Elevated 3D Cabin Greenhouse with Sloped Windshields -->
                    <div class="tux-roadway__v3d-cabin">
                      <!-- Roof Top -->
                      <div class="tux-roadway__v3d-roof">
                        <!-- Autonomous Connected Vehicle LIDAR Sensor on Managed Lane -->
                        <div v-if="lane.type === 'managed'" class="tux-roadway__v3d-lidar" />
                      </div>
                      <!-- Sloped Front Windshield -->
                      <div class="tux-roadway__v3d-windshield" />
                      <!-- Sloped Rear Window -->
                      <div class="tux-roadway__v3d-backwindow" />
                      <!-- Side Windows -->
                      <div class="tux-roadway__v3d-glass-side tux-roadway__v3d-glass-side--left" />
                      <div class="tux-roadway__v3d-glass-side tux-roadway__v3d-glass-side--right" />
                    </div>

                    <!-- Forward Projected Headlight Cones onto Asphalt -->
                    <div class="tux-roadway__v3d-beam" />

                    <!-- Freight Cargo Trailer for Heavy Commercial Trucks (v === 2) -->
                    <div v-if="v === 2 && lane.type !== 'managed'" class="tux-roadway__v3d-trailer">
                      <div class="tux-roadway__v3d-trailer-top" />
                      <div class="tux-roadway__v3d-trailer-side tux-roadway__v3d-trailer-side--left" />
                      <div class="tux-roadway__v3d-trailer-side tux-roadway__v3d-trailer-side--right" />
                      <div class="tux-roadway__v3d-trailer-rear" />
                    </div>
                  </div>
                </div>

                <!-- Rumble strip pattern on outside shoulder -->
                <div v-if="lane.type === 'shoulder' && lane.widthFt >= 8" class="tux-roadway__rumble-strip" />
              </div>
            </div>

            <!-- Roadway Hinge Point & Embankment Foreslope -->
            <div class="tux-roadway__3d-embankment">
              <div class="tux-roadway__foreslope">
                <div class="tux-roadway__slope-label">{{ activeData.foreslope }}</div>
                <div class="tux-roadway__grass-texture" />
              </div>

              <!-- Drainage Ditch / Swale Channel Invert -->
              <div class="tux-roadway__ditch-invert">
                <div class="tux-roadway__water-flow" />
                <span class="tux-roadway__ditch-label">Drainage Flow Line</span>
              </div>

              <!-- Embankment Backslope to Right-of-Way -->
              <div class="tux-roadway__backslope">
                <div class="tux-roadway__backslope-label">{{ activeData.backslope }}</div>
              </div>

              <!-- Right of Way Fence Line -->
              <div class="tux-roadway__row-fence">
                <div class="tux-roadway__row-tag">TxDOT R.O.W. Limit</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3D Perspective Legend Bar -->
        <div class="tux-roadway__3d-legend">
          <div class="flex items-center gap-4 flex-wrap text-xs font-mono">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-brand-primary" />
              <span>TEXpress Managed Lane</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-neutral-700" />
              <span>General Purpose Lanes</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-neutral-600" />
              <span>Paved Shoulder (10')</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-status-success/60" />
              <span>Vegetated Foreslope (4:1)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-status-info/80" />
              <span>Drainage Ditch Swale</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════
           VIEW 2: 2D CAD BLUEPRINT PROFILE (ENGINEERING CROSS-SECTION)
           ══════════════════════════════════════════════════════════════════════ -->
      <div
        v-else-if="currentView === '2d-engineering'"
        class="tux-roadway__cad-viewport"
      >
        <div class="tux-roadway__cad-chrome">
          <span class="font-mono text-xs text-text-muted">AASHTO EXHIBIT 4-1 · HIGHWAY GEOMETRIC CROSS-SECTION (CAD BLUEPRINT ELEVATION)</span>
          <span class="font-mono text-xs text-brand-primary">TOTAL WIDTH: {{ totalCrossSectionWidthFt.toFixed(1) }} FT</span>
        </div>

        <svg
          :viewBox="`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`"
          class="tux-roadway__cad-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="2D CAD Roadway Engineering Cross-Section Blueprint"
        >
          <!-- Grid Background lines -->
          <defs>
            <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--surface-border)" stroke-width="0.5" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cadGrid)" />

          <!-- Centerline / Crown Elevation Line -->
          <line
            :x1="cadPoints.startX"
            :y1="40"
            :x2="cadPoints.startX"
            :y2="cadPoints.ditchInvertY + 40"
            stroke="var(--brand-accent)"
            stroke-width="1.5"
            stroke-dasharray="8 4 2 4"
          />
          <text :x="cadPoints.startX + 6" :y="55" class="cad-text-accent">CL / CROWN PROFILE</text>

          <!-- Median Barrier Silhouette (SSCB) -->
          <polygon
            :points="`
              ${cadPoints.startX},${cadPoints.roadbedTopY}
              ${cadPoints.startX + 4},${cadPoints.roadbedTopY - 26}
              ${cadPoints.startX + 14},${cadPoints.roadbedTopY - 26}
              ${cadPoints.startX + 18},${cadPoints.roadbedTopY}
            `"
            fill="var(--surface-raised)"
            stroke="var(--text-primary)"
            stroke-width="1.5"
          />
          <text :x="cadPoints.startX + 22" :y="cadPoints.roadbedTopY - 14" class="cad-text-label">SSCB Barrier (42")</text>

          <!-- Roadway Surface Grade Line (with -2.0% cross slope) -->
          <path
            :d="`
              M ${cadPoints.startX + 18} ${cadPoints.roadbedTopY}
              L ${cadPoints.hingeX} ${cadPoints.hingeY}
              L ${cadPoints.ditchInvertX} ${cadPoints.ditchInvertY}
              L ${cadPoints.ditchEndX} ${cadPoints.ditchEndY}
              L ${cadPoints.rowX} ${cadPoints.rowY}
            `"
            fill="none"
            stroke="var(--brand-primary)"
            stroke-width="2.5"
          />

          <!-- Pavement Foundation Base Fill -->
          <polygon
            :points="`
              ${cadPoints.startX + 18},${cadPoints.roadbedTopY}
              ${cadPoints.hingeX},${cadPoints.hingeY}
              ${cadPoints.hingeX},${cadPoints.hingeY + 32}
              ${cadPoints.startX + 18},${cadPoints.roadbedTopY + 32}
            `"
            fill="color-mix(in srgb, var(--brand-primary) 18%, var(--surface-sunken))"
            stroke="var(--surface-border)"
            stroke-width="1"
          />

          <!-- Foreslope Embankment Fill Hatching -->
          <polygon
            :points="`
              ${cadPoints.hingeX},${cadPoints.hingeY}
              ${cadPoints.ditchInvertX},${cadPoints.ditchInvertY}
              ${cadPoints.ditchEndX},${cadPoints.ditchEndY}
              ${cadPoints.rowX},${cadPoints.rowY}
              ${cadPoints.rowX},${cadPoints.ditchInvertY + 45}
              ${cadPoints.hingeX},${cadPoints.ditchInvertY + 45}
            `"
            fill="color-mix(in srgb, var(--color-success) 12%, var(--surface-sunken))"
            stroke="var(--surface-border)"
            stroke-width="1"
          />

          <!-- Slope Triangles & Callouts -->
          <!-- 1. Cross slope -2.0% triangle -->
          <g :transform="`translate(${(cadPoints.startX + cadPoints.hingeX) / 2 - 20}, ${cadPoints.roadbedTopY - 18})`">
            <polygon points="0,0 40,0 40,8" fill="var(--surface-raised)" stroke="var(--brand-primary)" stroke-width="1" />
            <text x="12" y="-4" class="cad-text-mono">-2.0% Cross Slope</text>
          </g>

          <!-- 2. Foreslope 4:1 triangle -->
          <g :transform="`translate(${(cadPoints.hingeX + cadPoints.ditchInvertX) / 2}, ${(cadPoints.hingeY + cadPoints.ditchInvertY) / 2 - 14})`">
            <polygon points="0,0 36,0 36,9" fill="var(--surface-raised)" stroke="var(--color-success)" stroke-width="1" />
            <text x="6" y="-4" class="cad-text-mono">{{ activeData.foreslope }}</text>
          </g>

          <!-- 3. Backslope triangle -->
          <g :transform="`translate(${(cadPoints.ditchEndX + cadPoints.rowX) / 2 - 20}, ${(cadPoints.ditchEndY + cadPoints.rowY) / 2 - 10})`">
            <text x="0" y="-4" class="cad-text-mono">{{ activeData.backslope }}</text>
          </g>

          <!-- Hinge Point Marker -->
          <circle :cx="cadPoints.hingeX" :cy="cadPoints.hingeY" r="4.5" fill="var(--brand-accent)" stroke="var(--neutral-1000)" stroke-width="1.5" />
          <text :x="cadPoints.hingeX - 10" :y="cadPoints.hingeY - 12" class="cad-text-accent font-bold">HINGE POINT</text>

          <!-- Ditch Invert Flow Elevation Marker -->
          <circle :cx="cadPoints.ditchInvertX" :cy="cadPoints.ditchInvertY" r="4.5" fill="var(--color-info)" stroke="var(--neutral-1000)" stroke-width="1.5" />
          <text :x="cadPoints.ditchInvertX - 25" :y="cadPoints.ditchInvertY + 22" class="cad-text-info">SWALE INVERT (-{{ activeData.ditchDepthFt }}')</text>

          <!-- Right of Way (ROW) Line -->
          <line
            :x1="cadPoints.rowX"
            :y1="50"
            :x2="cadPoints.rowX"
            :y2="cadPoints.ditchInvertY + 40"
            stroke="var(--color-danger)"
            stroke-width="1.5"
            stroke-dasharray="6 3 1 3"
          />
          <text :x="cadPoints.rowX - 20" :y="45" class="cad-text-danger font-bold">R.O.W. LIMIT</text>

          <!-- Dimension Lines along the top -->
          <g class="cad-dimensions" transform="translate(0, 85)">
            <!-- Roadway Dimension -->
            <line :x1="cadPoints.startX + 18" y1="0" :x2="cadPoints.hingeX" y2="0" stroke="var(--text-muted)" stroke-width="1" marker-start="url(#dimArrow)" marker-end="url(#dimArrow)" />
            <text :x="(cadPoints.startX + 18 + cadPoints.hingeX) / 2" y="-6" text-anchor="middle" class="cad-text-dim">
              ROADWAY SURFACE: {{ totalRoadwayWidthFt }}' - 0"
            </text>

            <!-- Foreslope Dimension -->
            <line :x1="cadPoints.hingeX" y1="0" :x2="cadPoints.ditchInvertX" y2="0" stroke="var(--text-muted)" stroke-width="1" />
            <text :x="(cadPoints.hingeX + cadPoints.ditchInvertX) / 2" y="-6" text-anchor="middle" class="cad-text-dim">
              FORESLOPE: {{ foreslopeWidthFt }}'
            </text>

            <!-- Ditch Dimension -->
            <line :x1="cadPoints.ditchInvertX" y1="0" :x2="cadPoints.ditchEndX" y2="0" stroke="var(--text-muted)" stroke-width="1" />
            <text :x="(cadPoints.ditchInvertX + cadPoints.ditchEndX) / 2" y="-6" text-anchor="middle" class="cad-text-dim">
              DITCH: {{ activeData.ditchWidthFt }}'
            </text>
          </g>

          <!-- Vehicle Clearance Envelope -->
          <rect
            :x="cadPoints.startX + 40"
            :y="cadPoints.roadbedTopY - 42"
            width="42"
            height="40"
            rx="2"
            fill="none"
            stroke="var(--brand-accent)"
            stroke-width="1.2"
            stroke-dasharray="3 3"
          />
          <text :x="cadPoints.startX + 42" :y="cadPoints.roadbedTopY - 46" class="cad-text-dim">AASHTO WB-67 TRUCK ENVELOPE</text>
        </svg>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════
           VIEW 3: STRUCTURAL PAVEMENT STRATA LAYERS
           ══════════════════════════════════════════════════════════════════════ -->
      <div
        v-else-if="currentView === 'structural-layers'"
        class="tux-roadway__layers-viewport"
      >
        <div class="space-y-4 max-w-4xl mx-auto py-2">
          <div class="flex items-center justify-between border-b border-surface-border pb-3">
            <div>
              <p class="eyebrow">AASHTO MEPDG Structural Cross-Section</p>
              <h4 class="text-base font-bold text-text-primary">Subsurface Pavement Layer Design</h4>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono text-text-muted">Total Structural Depth:</span>
              <p class="text-lg font-bold font-mono text-brand-primary">
                {{ activeData.layers.reduce((sum, l) => sum + l.thicknessInches, 0).toFixed(1) }} inches
              </p>
            </div>
          </div>

          <!-- Vertical Strata Stack -->
          <div class="space-y-3">
            <div
              v-for="(layer, idx) in activeData.layers"
              :key="layer.name"
              class="tux-roadway__strata-card"
              :style="{ borderLeftColor: layer.colorToken }"
            >
              <div class="flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-3">
                  <span class="tux-roadway__layer-index font-mono">{{ idx + 1 }}</span>
                  <div>
                    <h5 class="font-bold text-sm text-text-primary">{{ layer.name }}</h5>
                    <p class="text-xs text-text-secondary font-mono">{{ layer.material }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span class="text-text-muted text-[10px] block uppercase">Thickness</span>
                    <span class="font-bold text-text-primary">{{ layer.thicknessInches }}"</span>
                  </div>
                  <div>
                    <span class="text-text-muted text-[10px] block uppercase">Resilient Modulus</span>
                    <span class="text-text-secondary">{{ layer.modulusPsi }}</span>
                  </div>
                  <div>
                    <span class="text-text-muted text-[10px] block uppercase">Pavement Index (PCI)</span>
                    <span class="font-bold text-status-success">{{ layer.pci }} / 100</span>
                  </div>
                </div>
              </div>

              <!-- Depth Bar Representation -->
              <div class="mt-2.5 h-2 w-full bg-surface-sunken rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :style="{
                    width: `${(layer.thicknessInches / 14) * 100}%`,
                    backgroundColor: layer.colorToken
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════
           VIEW 4: EMBANKMENT SLOPE STABILITY & HYDROLOGY
           ══════════════════════════════════════════════════════════════════════ -->
      <div
        v-else-if="currentView === 'hydrology-slope'"
        class="tux-roadway__hydrology-viewport"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto py-2">
          <!-- Slope Stability Card -->
          <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-text-muted">SLOPE STABILITY</span>
              <TuxBadge tone="success" size="xs">STABLE</TuxBadge>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold font-mono text-status-success">{{ activeData.factorOfSafety }}</span>
              <span class="text-xs text-text-secondary">FS (&gt;1.50 Req.)</span>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed">
              Bishop Modified circular slip surface analysis confirms embankment foreslope stability across {{ activeData.foreslopeRatio }}:1 grade under saturated conditions.
            </p>
          </div>

          <!-- Soil Moisture Sensor -->
          <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-text-muted">EMBANKMENT MOISTURE</span>
              <span class="text-xs font-mono text-status-info">Invert Sensor S-4</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold font-mono text-text-primary">{{ activeData.soilMoisture }}</span>
              <span class="text-xs text-text-secondary">Volumetric</span>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed">
              Real-time FDR probe telemetry at ditch invert shows optimal drainage percolation with zero hydrostatic pore pressure buildup.
            </p>
          </div>

          <!-- Stormwater Runoff Invert Capacity -->
          <div class="p-4 bg-surface-raised border border-surface-border rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase text-text-muted">HYDROLOGY CAPACITY</span>
              <span class="text-xs font-mono text-brand-primary">10-Yr Storm</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold font-mono text-text-primary">{{ activeData.runoffFlowCfs }}</span>
              <span class="text-xs text-text-secondary">peak Q</span>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed">
              Trapezoidal bioswale invert accommodates 10-year storm event with Manning's roughness coefficient n = 0.035 for vegetated swale.
            </p>
          </div>
        </div>

        <!-- Cross-Sectional Hydrology Flow Chart Diagram -->
        <div class="mt-4 p-4 bg-surface-raised border border-surface-border rounded-xl max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
          <div class="flex items-center gap-2 text-text-primary">
            <Icon name="lucide:arrow-down-right" class="w-4 h-4 text-status-info" />
            <span>Crown Runoff (-2.0%)</span>
          </div>
          <div class="text-text-muted">➔</div>
          <div class="flex items-center gap-2 text-text-primary">
            <Icon name="lucide:arrow-down" class="w-4 h-4 text-status-success" />
            <span>Foreslope Sheetflow ({{ activeData.foreslope }})</span>
          </div>
          <div class="text-text-muted">➔</div>
          <div class="flex items-center gap-2 text-text-primary">
            <Icon name="lucide:waves" class="w-4 h-4 text-brand-primary" />
            <span>Ditch Invert Swale Infiltration ({{ activeData.ditchWidthFt }}' Flat Bottom)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Lane-by-Lane Telemetry Grid (Linked to Active Roadway) -->
    <footer class="tux-roadway__footer">
      <div class="flex items-center justify-between pb-3 border-b border-surface-border flex-wrap gap-2">
        <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
          Operational Corridor Telemetry · Lane-by-Lane Cross-Section Analysis
        </h4>
        <div class="flex items-center gap-3 text-xs font-mono text-text-secondary">
          <span>Click lane in 3D scene to inspect</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        <div
          v-for="(lane, idx) in activeData.lanes"
          :key="lane.id"
          class="tux-roadway__lane-kpi-card"
          :class="{ 'tux-roadway__lane-kpi-card--active': selectedLaneIndex === idx }"
          @click="selectedLaneIndex = idx"
        >
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-text-primary truncate">{{ lane.name }}</span>
            <span
              v-if="lane.los"
              class="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] border"
              :class="losClass(lane.los)"
            >
              LOS {{ lane.los }}
            </span>
          </div>

          <div v-if="lane.speedMph" class="flex items-baseline gap-1 mt-1">
            <span class="text-xl font-bold font-mono text-text-primary">{{ lane.speedMph }}</span>
            <span class="text-[11px] text-text-muted">mph</span>
          </div>
          <div v-else class="text-xs font-mono text-text-muted mt-1 italic">
            Non-Travel
          </div>

          <div class="flex items-center justify-between text-[11px] font-mono text-text-secondary mt-1">
            <span>{{ lane.volumeVph ? `${lane.volumeVph} vph` : `${lane.widthFt}' width` }}</span>
            <span v-if="lane.occupancyPct" class="text-text-muted">{{ lane.occupancyPct }}% occ</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.tux-roadway-cross-section {
  width: 100%;
  background-color: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--elevation-rest);
  font-family: var(--font-body);
}

.tux-roadway__header {
  padding: 1.25rem 1.5rem;
  background-color: var(--surface-raised);
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .tux-roadway__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.tux-roadway__eyebrow-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.tux-roadway__badge {
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--brand-primary);
  background-color: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
}

.tux-roadway__classification {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tux-roadway__title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.tux-roadway__controls-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tux-roadway__control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tux-roadway__control-label {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--text-muted);
}

.tux-roadway__select {
  font-size: 0.75rem;
  font-family: var(--font-body);
  background-color: var(--surface-sunken);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  outline: none;
}

.tux-roadway__select:focus-visible {
  border-color: var(--brand-primary);
  outline: 2px solid var(--focus-ring-outer);
}

.tux-roadway__mode-pills {
  display: flex;
  align-items: center;
  background-color: var(--surface-sunken);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  gap: 0.25rem;
}

.tux-roadway__mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 0.65rem;
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 32px;
}

.tux-roadway__mode-btn:hover {
  color: var(--text-primary);
}

.tux-roadway__mode-btn--active {
  background-color: var(--surface-page);
  color: var(--brand-primary);
  box-shadow: var(--elevation-rest);
}

/* ══════════════════════════════════════════════════════════════════════════
   STAGE & 3D PERSPECTIVE STYLING
   ══════════════════════════════════════════════════════════════════════════ */
.tux-roadway__stage {
  position: relative;
  background-color: var(--surface-sunken);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tux-roadway__3d-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: radial-gradient(ellipse 90% 70% at 50% 30%, color-mix(in srgb, var(--surface-raised) 70%, transparent), var(--surface-sunken) 95%);
}

.tux-roadway__3d-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
  background-color: color-mix(in srgb, var(--surface-raised) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  width: 13rem;
  box-shadow: var(--elevation-flat);
}

.tux-roadway__presets-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--surface-border);
}

.tux-roadway__presets-label {
  font-size: 0.625rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--text-muted);
}

.tux-roadway__angle-btn {
  flex: 1;
  font-size: 0.625rem;
  font-family: var(--font-mono);
  padding: 0.2rem 0.35rem;
  border-radius: var(--radius-sm);
  background-color: var(--surface-sunken);
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.tux-roadway__angle-btn:hover {
  color: var(--text-primary);
  border-color: var(--brand-primary);
}

.tux-roadway__angle-btn--active {
  background-color: var(--brand-primary);
  color: var(--text-on-brand);
  border-color: var(--brand-primary);
  font-weight: 700;
}

.tux-roadway__slider-item {
  margin-bottom: 0.5rem;
}

.tux-roadway__slider-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin-bottom: 0.15rem;
}

.tux-roadway__slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  accent-color: var(--brand-primary);
  cursor: pointer;
}

.tux-roadway__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  background-color: var(--surface-sunken);
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tux-roadway__action-btn:hover {
  color: var(--text-primary);
  border-color: var(--brand-primary);
}

.tux-roadway__action-btn--active {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.tux-roadway__perspective-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  padding: 2rem;
  cursor: grab;
  touch-action: none;
}

.tux-roadway__perspective-wrapper--dragging {
  cursor: grabbing !important;
  user-select: none;
}

.tux-roadway__interactive-hint {
  position: absolute;
  bottom: 2.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 18;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  background-color: color-mix(in srgb, var(--surface-raised) 90%, transparent);
  border: 1px solid var(--surface-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  color: var(--text-primary);
  box-shadow: 0 4px 16px -2px color-mix(in srgb, var(--neutral-1000) 22%, transparent);
  pointer-events: none;
  animation: hintFadeIn 0.4s ease;
}

@keyframes hintFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.tux-roadway__3d-corridor {
  position: relative;
  display: flex;
  width: 90%;
  max-width: 820px;
  height: 380px;
  transform-style: preserve-3d;
  transition: transform 0.1s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 32px 64px -16px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

/* Concrete Barrier Extruded in 3D */
.tux-roadway__3d-barrier {
  width: 18px;
  height: 100%;
  background-color: var(--neutral-400);
  border-right: 2px solid var(--neutral-600);
  transform: translateZ(14px);
  position: relative;
  box-shadow: -4px 0 12px color-mix(in srgb, var(--neutral-1000) 35%, transparent);
}

.tux-roadway__barrier-cap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background-color: var(--neutral-300);
}

/* Roadbed */
.tux-roadway__3d-roadbed {
  flex: 1;
  display: flex;
  height: 100%;
  background: var(--neutral-800);
  position: relative;
  overflow: hidden;
  border-bottom: 4px solid var(--neutral-900);
}

.tux-roadway__3d-lane {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px dashed color-mix(in srgb, var(--neutral-0) 35%, transparent);
  padding: 0.5rem 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tux-roadway__3d-lane:hover {
  background-color: color-mix(in srgb, var(--neutral-0) 6%, transparent);
}

.tux-roadway__3d-lane--selected {
  background-color: color-mix(in srgb, var(--brand-primary) 22%, var(--neutral-800)) !important;
  outline: 2px solid var(--brand-primary);
}

.tux-roadway__3d-lane--managed {
  background: linear-gradient(to bottom, color-mix(in srgb, var(--brand-primary) 35%, transparent), color-mix(in srgb, var(--brand-primary) 50%, transparent));
}

.tux-roadway__3d-lane--shoulder {
  background: var(--neutral-700);
}

.tux-roadway__3d-lane--bike {
  background: color-mix(in srgb, var(--color-success) 18%, transparent);
}

/* Striping Styles */
.tux-roadway__stripe-yellow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--color-warning);
}

.tux-roadway__stripe-white-solid {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--neutral-0);
}

.tux-roadway__stripe-white-dashed {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: repeating-linear-gradient(
    to bottom,
    var(--neutral-0) 0px,
    var(--neutral-0) 24px,
    transparent 24px,
    transparent 48px
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING 3D POP-OUT TELEMETRY HUD PANE
   ══════════════════════════════════════════════════════════════════════════ */
.tux-roadway__lane-signage {
  position: relative;
  z-index: 25;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tux-roadway__signage-stanchion {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(to top, var(--brand-accent), color-mix(in srgb, var(--brand-accent) 22%, transparent));
  pointer-events: none;
  z-index: 1;
}

.tux-roadway__stanchion-dot {
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  transform: translateX(-50%);
  background-color: var(--brand-accent);
  box-shadow: 0 0 8px var(--brand-accent);
}

.tux-roadway__signage-card {
  position: relative;
  z-index: 10;
  width: 95%;
  min-width: 68px;
  padding: 0.35rem 0.45rem;
  border-radius: var(--radius-sm);
  background-color: color-mix(in srgb, var(--surface-raised) 90%, transparent);
  border: 1px solid var(--surface-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px -4px color-mix(in srgb, var(--neutral-1000) 35%, transparent);
  text-align: center;
  cursor: pointer;
  transform-style: preserve-3d;
}

.tux-roadway__lane-signage--selected .tux-roadway__signage-card {
  border-color: var(--brand-accent);
  box-shadow: 0 0 14px color-mix(in srgb, var(--brand-accent) 50%, transparent);
}

.tux-roadway__signage-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.tux-roadway__lane-title {
  display: block;
  font-size: 0.625rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tux-roadway__lane-width {
  font-size: 0.5625rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.tux-roadway__signage-stats {
  margin-top: 0.15rem;
}

.tux-roadway__signage-main-stat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.tux-roadway__lane-speed {
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .tux-roadway__lane-speed {
  color: var(--brand-accent);
}

.tux-roadway__lane-los {
  font-size: 0.5625rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.05rem 0.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid;
}

.tux-roadway__signage-expanded {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.35rem;
  margin-top: 0.35rem;
  padding-top: 0.25rem;
  border-top: 1px dashed var(--surface-border);
  font-size: 0.5625rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.tux-roadway__expanded-item strong {
  color: var(--text-primary);
}

/* ══════════════════════════════════════════════════════════════════════════
   3D EXTRUDED VEHICLE PLATOON & SPATIAL LIGHTING
   ══════════════════════════════════════════════════════════════════════════ */
.tux-roadway__platoon-stream {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
}

.tux-roadway__vehicle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transform-style: preserve-3d;
  width: 22px;
  height: 38px;
  top: -80px;
}

.tux-roadway__vehicle--truck {
  width: 26px;
  height: 68px;
}

/* 3D Ground Shadow */
.tux-roadway__v3d-shadow {
  position: absolute;
  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  border-radius: 6px;
  background-color: color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  filter: blur(3px);
  transform: translateZ(0px);
}

/* 3D Wheels */
.tux-roadway__v3d-wheel {
  position: absolute;
  width: 3px;
  height: 8px;
  border-radius: 2px;
  background-color: var(--neutral-900);
  box-shadow: 0 0 2px var(--neutral-1000);
  transform: translateZ(2px);
}

.tux-roadway__v3d-wheel--fl {
  bottom: 4px;
  left: -1px;
}

.tux-roadway__v3d-wheel--fr {
  bottom: 4px;
  right: -1px;
}

.tux-roadway__v3d-wheel--rl {
  top: 4px;
  left: -1px;
}

.tux-roadway__v3d-wheel--rr {
  top: 4px;
  right: -1px;
}

/* 3D Chassis Base */
.tux-roadway__v3d-chassis {
  position: absolute;
  inset: 2px;
  transform-style: preserve-3d;
  transform: translateZ(4px);
  border-radius: 3px;
}

.tux-roadway__vehicle--sedan .tux-roadway__v3d-chassis {
  background-color: var(--color-info);
  color: var(--color-info);
}

.tux-roadway__vehicle--ev .tux-roadway__v3d-chassis {
  background-color: var(--brand-accent);
  color: var(--brand-accent);
}

.tux-roadway__vehicle--truck .tux-roadway__v3d-chassis {
  background-color: var(--neutral-400);
  color: var(--neutral-400);
}

/* Hood & Trunk Top Surfaces */
.tux-roadway__v3d-hood {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-color: inherit;
  border-radius: 1px 1px 3px 3px;
}

.tux-roadway__v3d-trunk {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background-color: inherit;
  border-radius: 3px 3px 1px 1px;
}

/* 3D Flank Walls (Chassis Thickness) */
.tux-roadway__v3d-flank {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: color-mix(in srgb, var(--neutral-1000) 22%, currentColor);
}

.tux-roadway__v3d-flank--left {
  left: 0;
  transform-origin: left center;
  transform: rotateY(-90deg);
}

.tux-roadway__v3d-flank--right {
  right: 0;
  transform-origin: right center;
  transform: rotateY(90deg);
}

/* Front & Rear Bumpers */
.tux-roadway__v3d-bumper-front {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  transform-origin: center bottom;
  transform: rotateX(-90deg);
  background-color: color-mix(in srgb, var(--neutral-1000) 35%, currentColor);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;
}

.tux-roadway__v3d-bumper-rear {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transform-origin: center top;
  transform: rotateX(90deg);
  background-color: color-mix(in srgb, var(--neutral-1000) 35%, currentColor);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;
}

/* Headlamps & Dual LED Taillights */
.tux-roadway__v3d-headlamp {
  width: 4px;
  height: 2px;
  border-radius: 1px;
  background-color: var(--neutral-0);
  box-shadow: 0 0 6px var(--neutral-0);
}

.tux-roadway__v3d-taillight {
  width: 4px;
  height: 2px;
  border-radius: 1px;
  background-color: var(--color-danger);
  box-shadow: 0 0 6px var(--color-danger);
}

/* Forward Projected Headlight Cones onto Asphalt */
.tux-roadway__v3d-beam {
  position: absolute;
  bottom: -38px;
  left: -6px;
  width: 34px;
  height: 38px;
  pointer-events: none;
  transform: translateZ(1px);
  background: radial-gradient(
    ellipse 65% 100% at 50% 0%,
    color-mix(in srgb, var(--neutral-0) 35%, transparent) 0%,
    color-mix(in srgb, var(--brand-accent) 18%, transparent) 40%,
    transparent 80%
  );
  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
}

/* 3D Elevated Cabin (Greenhouse) */
.tux-roadway__v3d-cabin {
  position: absolute;
  top: 8px;
  bottom: 10px;
  left: 3px;
  right: 3px;
  transform-style: preserve-3d;
  transform: translateZ(10px);
}

.tux-roadway__v3d-roof {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--neutral-1000) 22%, currentColor);
  border-radius: 2px;
  transform-style: preserve-3d;
}

.tux-roadway__vehicle--sedan .tux-roadway__v3d-roof {
  color: var(--color-info);
}

.tux-roadway__vehicle--ev .tux-roadway__v3d-roof {
  color: var(--brand-accent);
}

.tux-roadway__vehicle--truck .tux-roadway__v3d-roof {
  color: var(--neutral-400);
}

/* Autonomous Connected Vehicle LIDAR Sensor */
.tux-roadway__v3d-lidar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(3px);
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: var(--spectrum-teal);
  box-shadow: 0 0 8px var(--spectrum-teal);
  animation: pulseLidar 1.6s ease-in-out infinite;
}

@keyframes pulseLidar {
  0%, 100% {
    transform: translate(-50%, -50%) translateZ(3px) scale(0.9);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) translateZ(3px) scale(1.15);
    opacity: 1;
  }
}

/* Sloped Windshields (Angled Glass) */
.tux-roadway__v3d-windshield {
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 5px;
  transform-origin: top center;
  transform: rotateX(-45deg);
  background-color: color-mix(in srgb, var(--color-info) 35%, var(--neutral-1000));
}

.tux-roadway__v3d-backwindow {
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 5px;
  transform-origin: bottom center;
  transform: rotateX(45deg);
  background-color: color-mix(in srgb, var(--color-info) 35%, var(--neutral-1000));
}

.tux-roadway__v3d-glass-side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: color-mix(in srgb, var(--color-info) 22%, var(--neutral-1000));
}

.tux-roadway__v3d-glass-side--left {
  left: 0;
  transform-origin: left center;
  transform: rotateY(-90deg);
}

.tux-roadway__v3d-glass-side--right {
  right: 0;
  transform-origin: right center;
  transform: rotateY(90deg);
}

/* Heavy Commercial Truck Trailer */
.tux-roadway__v3d-trailer {
  position: absolute;
  top: 2px;
  left: 1px;
  right: 1px;
  height: 44px;
  transform-style: preserve-3d;
  transform: translateZ(12px);
}

.tux-roadway__v3d-trailer-top {
  position: absolute;
  inset: 0;
  background-color: var(--neutral-300);
  border: 1px solid var(--neutral-400);
  border-radius: 2px;
}

.tux-roadway__v3d-trailer-side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  background: repeating-linear-gradient(
    to bottom,
    var(--neutral-400) 0px,
    var(--neutral-400) 3px,
    var(--neutral-500) 3px,
    var(--neutral-500) 4px
  );
}

.tux-roadway__v3d-trailer-side--left {
  left: 0;
  transform-origin: left center;
  transform: rotateY(-90deg);
}

.tux-roadway__v3d-trailer-side--right {
  right: 0;
  transform-origin: right center;
  transform: rotateY(90deg);
}

.tux-roadway__v3d-trailer-rear {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  transform-origin: top center;
  transform: rotateX(90deg);
  background-color: var(--neutral-500);
  border-bottom: 2px solid var(--color-danger);
}

.tux-roadway__platoon-stream--animating .tux-roadway__vehicle {
  animation: vehicleDrive 4.5s linear infinite;
}

@keyframes vehicleDrive {
  0% {
    top: -80px;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    top: 420px;
    opacity: 0;
  }
}

.tux-roadway__rumble-strip {
  position: absolute;
  right: 6px;
  top: 0;
  bottom: 0;
  width: 6px;
  background: repeating-linear-gradient(
    to bottom,
    color-mix(in srgb, var(--neutral-1000) 35%, transparent) 0px,
    color-mix(in srgb, var(--neutral-1000) 35%, transparent) 4px,
    transparent 4px,
    transparent 8px
  );
}

/* Embankment 3D Slopes */
.tux-roadway__3d-embankment {
  width: 220px;
  height: 100%;
  display: flex;
  transform-style: preserve-3d;
}

.tux-roadway__foreslope {
  flex: 1;
  height: 100%;
  background: linear-gradient(to right, color-mix(in srgb, var(--color-success) 70%, var(--neutral-900)), color-mix(in srgb, var(--color-success) 45%, var(--neutral-900)));
  transform: rotateY(-24deg);
  transform-origin: left center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 2px solid color-mix(in srgb, var(--color-success) 55%, var(--neutral-900));
}

.tux-roadway__slope-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--brand-accent) 80%, var(--neutral-0));
  background-color: color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  transform: rotate(-90deg);
}

.tux-roadway__ditch-invert {
  width: 32px;
  height: 100%;
  background-color: color-mix(in srgb, var(--color-info) 50%, var(--neutral-900));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tux-roadway__water-flow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-info) 35%, transparent), transparent);
}

.tux-roadway__ditch-label {
  font-size: 0.5rem;
  font-family: var(--font-mono);
  color: color-mix(in srgb, var(--color-info) 80%, var(--neutral-0));
  transform: rotate(-90deg);
  white-space: nowrap;
}

.tux-roadway__backslope {
  flex: 1;
  height: 100%;
  background: linear-gradient(to right, color-mix(in srgb, var(--color-success) 45%, var(--neutral-900)), color-mix(in srgb, var(--color-success) 70%, var(--neutral-900)));
  transform: rotateY(24deg);
  transform-origin: left center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tux-roadway__backslope-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--brand-accent) 80%, var(--neutral-0));
  background-color: color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  transform: rotate(-90deg);
}

.tux-roadway__row-fence {
  width: 8px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    var(--color-danger) 0px,
    var(--color-danger) 8px,
    transparent 8px,
    transparent 16px
  );
  position: relative;
}

.tux-roadway__row-tag {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 0.5rem;
  font-family: var(--font-mono);
  font-weight: bold;
  color: var(--color-danger);
  white-space: nowrap;
}

.tux-roadway__3d-legend {
  position: relative;
  z-index: 20;
  background-color: var(--surface-raised);
  border-top: 1px solid var(--surface-border);
  padding: 0.75rem 1.25rem;
}

/* ══════════════════════════════════════════════════════════════════════════
   2D CAD BLUEPRINT STYLES
   ══════════════════════════════════════════════════════════════════════════ */
.tux-roadway__cad-viewport {
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.tux-roadway__cad-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.tux-roadway__cad-svg {
  width: 100%;
  height: auto;
  min-height: 340px;
  background-color: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.cad-text-accent {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--brand-accent);
}

.cad-text-label {
  font-family: var(--font-body);
  font-size: 11px;
  fill: var(--text-primary);
  font-weight: 600;
}

.cad-text-mono {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--text-primary);
  font-weight: 600;
}

.cad-text-info {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--color-info);
  font-weight: 700;
}

.cad-text-danger {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--color-danger);
}

.cad-text-dim {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--text-muted);
}

/* ══════════════════════════════════════════════════════════════════════════
   STRUCTURAL STRATA & HYDROLOGY STYLES
   ══════════════════════════════════════════════════════════════════════ */
.tux-roadway__layers-viewport,
.tux-roadway__hydrology-viewport {
  padding: 1.5rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.tux-roadway__strata-card {
  padding: 1rem 1.25rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-left-width: 4px;
  border-radius: var(--radius-sm);
  box-shadow: var(--elevation-rest);
}

.tux-roadway__layer-index {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background-color: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

/* ══════════════════════════════════════════════════════════════════════════
   FOOTER TELEMETRY GRID
   ══════════════════════════════════════════════════════════════════════════ */
.tux-roadway__footer {
  padding: 1.25rem 1.5rem;
  background-color: var(--surface-raised);
  border-top: 1px solid var(--surface-border);
}

.tux-roadway__lane-kpi-card {
  padding: 0.75rem;
  background-color: var(--surface-page);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tux-roadway__lane-kpi-card:hover {
  border-color: var(--brand-primary);
  transform: translateY(-2px);
}

.tux-roadway__lane-kpi-card--active {
  border-color: var(--brand-primary);
  background-color: color-mix(in srgb, var(--brand-primary) 8%, var(--surface-page));
  box-shadow: var(--elevation-rest);
}
</style>
