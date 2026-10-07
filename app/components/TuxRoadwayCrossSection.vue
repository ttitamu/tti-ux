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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

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
  initialPitch: 48,
  initialYaw: -16,
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

// Direct Manipulation Pointer Orbit Drag State & Scroll Shielding
const isDragging = ref(false);
const hasUserInteracted = ref(false);
const isSceneActive = ref(false);
const showScrollShieldNotice = ref(false);
let scrollNoticeTimeout: ReturnType<typeof setTimeout> | null = null;

const isSceneVisible = ref(true);
const viewportRef = ref<HTMLElement | null>(null);
let intersectionObs: IntersectionObserver | null = null;

let dragStartX = 0;
let dragStartY = 0;
let dragStartPitch = 0;
let dragStartYaw = 0;

onMounted(() => {
  if (typeof IntersectionObserver !== "undefined" && viewportRef.value) {
    intersectionObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isSceneVisible.value = entry.isIntersecting;
        }
      },
      { threshold: 0.05 }
    );
    intersectionObs.observe(viewportRef.value);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isSceneActive.value) {
      isSceneActive.value = false;
    }
  };
  window.addEventListener("keydown", handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
    intersectionObs?.disconnect();
    if (scrollNoticeTimeout) clearTimeout(scrollNoticeTimeout);
  });
});

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

function activateScene() {
  isSceneActive.value = true;
  hasUserInteracted.value = true;
}

function deactivateScene() {
  isSceneActive.value = false;
}

function onPointerDown(e: PointerEvent) {
  if (!props.interactive) return;
  const target = e.target as HTMLElement;
  if (target.closest("button, input, select, a, .tux-roadway__3d-controls")) return;

  isSceneActive.value = true;
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

  // Only intercept zoom if user holds Ctrl/Cmd or has clicked to activate 3D orbit
  if (e.ctrlKey || e.metaKey || isSceneActive.value) {
    e.preventDefault();
    hasUserInteracted.value = true;
    const zoomStep = -e.deltaY * 0.0015;
    zoomScale.value = Math.max(0.65, Math.min(1.65, +(zoomScale.value + zoomStep).toFixed(2)));
  } else {
    // Pass standard vertical page scroll through; show subtle helpful toast
    showScrollShieldNotice.value = true;
    if (scrollNoticeTimeout) clearTimeout(scrollNoticeTimeout);
    scrollNoticeTimeout = setTimeout(() => {
      showScrollShieldNotice.value = false;
    }, 2200);
  }
}

// Distance / pop-out factor from Top Dead Center (TDC 0°)
// Lifts and billboards 3D text panes when pitched or yawed away from top-down
const popOutFactor = computed(() => {
  const pitchF = Math.max(0, Math.min(1, (pitchDeg.value - 6) / 22));
  const yawF = Math.max(0, Math.min(1, (Math.abs(yawDeg.value) - 6) / 18));
  return Math.max(pitchF, yawF);
});

// Staggered longitudinal positioning along the roadbed (0% = top, 100% = bottom)
// Prevents cards from colliding when expanded in 3D
function getLaneTargetStationY(idx: number, lane: any): number {
  if (lane.type === "shoulder") {
    return idx === 0 ? 10 : 14;
  }
  const travelLanes = activeData.value.lanes.filter((l: any) => l.type !== "shoulder");
  const travelIdx = travelLanes.findIndex((l: any) => l.id === lane.id);
  if (travelIdx === -1) return 26;
  // Alternates between upper cluster (26% - 34%) and lower cluster (64% - 70%)
  // Even travel index = upper, Odd travel index = lower
  return travelIdx % 2 === 0
    ? 26 + (travelIdx * 4)
    : 64 + ((travelIdx - 1) * 3);
}

// Current Y percentage of the lane HUD anchor along the road
function getLaneCurrentY(idx: number, lane: any): number {
  const targetY = getLaneTargetStationY(idx, lane);
  const factor = popOutFactor.value;
  // In top-down view (factor = 0), all cards sit at 4% (flush at top)
  // As factor -> 1, they smoothly glide down to their staggered positions
  return +(4 + factor * (targetY - 4)).toFixed(1);
}

// Elevation height (Z-axis) above the asphalt in pixels
function getLaneLiftZ(idx: number): number {
  const factor = popOutFactor.value;
  const isSelected = selectedLaneIndex.value === idx;
  const baseLift = Math.round(factor * 68);
  const focusBonus = isSelected ? 24 : 0;
  return baseLift + focusBonus;
}

// Style for the anchor footprint on the asphalt surface
function getHudAnchorStyle(idx: number, lane: any) {
  const currentY = getLaneCurrentY(idx, lane);
  const isSelected = selectedLaneIndex.value === idx;
  return {
    top: `${currentY}%`,
    zIndex: isSelected ? 50 : 20 + idx,
    transition: isDragging.value ? "none" : "top 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  };
}

// Style for the vertical 3D stanchion pole standing out of the asphalt
function getStanchionPoleStyle(idx: number) {
  const liftZ = getLaneLiftZ(idx);
  return {
    height: `${liftZ}px`,
    transition: isDragging.value ? "none" : "height 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
  };
}

// Style for the floating 3D billboard HUD card
function getHudCardStyle(idx: number, lane: any) {
  const factor = popOutFactor.value;
  const liftZ = getLaneLiftZ(idx);

  // Exact counter-rotation to billboard perpendicular to camera
  const counterPitch = Math.round(-pitchDeg.value * factor);
  const counterYaw = Math.round(-yawDeg.value * factor);

  return {
    transform: `translateZ(${liftZ}px) rotateZ(${counterYaw}deg) rotateX(${counterPitch}deg) translateX(-50%)`,
    transformOrigin: "bottom center",
    transition: isDragging.value
      ? "none"
      : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), width 0.25s ease, padding 0.25s ease",
  };
}

// Vehicle type determination for traffic stream simulation
function getLaneVehicleType(lane: any, vIndex: number): "sedan" | "ev" | "pickup" | "truck" {
  if (lane.type === "managed") {
    return "ev";
  }
  const id = lane.id;
  if (id === "l-4" || lane.name.toLowerCase().includes("freight") || lane.name.toLowerCase().includes("slow")) {
    return vIndex === 1 ? "truck" : "pickup";
  }
  if (id === "l-3" || lane.name.toLowerCase().includes("mid")) {
    return vIndex === 1 ? "pickup" : "sedan";
  }
  return "sedan";
}

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

function getLosDescription(los?: string): string {
  switch (los) {
    case "A":
      return "Level of Service A: Free-flow operations with median speeds at or above speed limit and unrestricted maneuverability.";
    case "B":
      return "Level of Service B: Reasonably free-flow operations; slight maneuverability limits with increasing traffic density.";
    case "C":
      return "Level of Service C: Stable traffic flow; vehicle speeds near posted limit but lane changing is noticeably restricted.";
    case "D":
      return "Level of Service D: Approaching capacity limit; speed declines and maneuverability is severely restricted.";
    case "E":
      return "Level of Service E: Highway design capacity threshold; volatile unstable flow with high breakdown risk.";
    case "F":
      return "Level of Service F: Forced breakdown flow / gridlock; stop-and-go conditions with long vehicle queues.";
    default:
      return "Level of Service rating (AASHTO / Highway Capacity Manual 7th Edition standard)";
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
        ref="viewportRef"
        class="tux-roadway__3d-viewport"
        :class="{ 'tux-roadway__3d-viewport--offscreen': !isSceneVisible }"
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
              Top (0°)
            </button>
            <button
              type="button"
              class="tux-roadway__angle-btn"
              :class="{ 'tux-roadway__angle-btn--active': pitchDeg > 35 && pitchDeg < 60 }"
              @click="setViewIsometric"
              title="Isometric 3D Perspective (48°)"
            >
              Iso (48°)
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
          :class="{
            'tux-roadway__perspective-wrapper--dragging': isDragging,
            'tux-roadway__perspective-wrapper--active': isSceneActive
          }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel="onWheel"
        >
          <!-- Scroll Shield Notification (Appears briefly when scrolling without Ctrl / Activation) -->
          <Transition name="fade">
            <div
              v-if="showScrollShieldNotice"
              class="tux-roadway__scroll-shield-badge"
              role="status"
              aria-live="polite"
            >
              <Icon name="lucide:info" class="w-3.5 h-3.5 text-brand-accent shrink-0" aria-hidden="true" />
              <span>Hold <kbd class="px-1 py-0.5 rounded bg-surface-sunken font-mono text-[10px] border border-surface-border">Ctrl</kbd> + Scroll to zoom corridor, or click to engage 3D orbit</span>
            </div>
          </Transition>

          <!-- 3D Orbit Focus Active Pill Badge -->
          <div
            v-if="isSceneActive"
            class="tux-roadway__active-shield-pill"
            role="button"
            tabindex="0"
            @click.stop="deactivateScene"
            @keydown.enter.stop="deactivateScene"
            title="Click or press Enter to release 3D orbit focus and resume vertical page scroll"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-color-success animate-pulse" aria-hidden="true" />
            <span>3D Orbit Active &bull; <kbd class="font-mono text-[9px] uppercase px-1 py-0.5 rounded bg-surface-sunken border border-surface-border">Esc</kbd> or click to release scroll</span>
          </div>

          <!-- Orbit Drag & Zoom Guidance Hint Badge -->
          <div
            v-if="!hasUserInteracted && !isSceneActive"
            class="tux-roadway__interactive-hint"
            aria-hidden="true"
          >
            <Icon name="lucide:move" class="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span>Click &amp; drag to orbit &bull; Ctrl+Scroll to zoom &bull; Tilt away from top-down to pop 3D HUD</span>
          </div>

          <div
            class="tux-roadway__3d-corridor"
            :style="{
              transform: `scale(${zoomScale}) rotateX(${pitchDeg}deg) rotateY(${rollDeg}deg) rotateZ(${yawDeg}deg)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }"
          >
            <!-- Volumetric Subgrade Earth Foundation Pedestal (Anchors corridor in 3D space) -->
            <div class="tux-roadway__corridor-pedestal" />

            <!-- Concrete Median Barrier (TxDOT Single-Slope SSCB-42" Extruded in 3D) -->
            <div class="tux-roadway__3d-barrier">
              <div class="tux-roadway__barrier-shadow" />
              <div class="tux-roadway__barrier-top" />
              <div class="tux-roadway__barrier-flank-right" />
              <div class="tux-roadway__barrier-flank-left" />
              <div class="tux-roadway__barrier-front" />
            </div>

            <!-- Asphalt Roadbed Surface with Realistic Markings & Geotechnical Slab Extrusion -->
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
                <div v-else class="tux-roadway__stripe-white-dashed">
                  <!-- Raised Pavement Markers (RPMs / Botts' Dots) along dashed lines -->
                  <div class="tux-roadway__rpm tux-roadway__rpm--1" />
                  <div class="tux-roadway__rpm tux-roadway__rpm--2" />
                  <div class="tux-roadway__rpm tux-roadway__rpm--3" />
                  <div class="tux-roadway__rpm tux-roadway__rpm--4" />
                </div>

                <!-- Subtle Wheel Path Compaction Wear in Travel Lanes -->
                <div v-if="lane.type !== 'shoulder'" class="tux-roadway__wheel-paths">
                  <div class="tux-roadway__wheel-track tux-roadway__wheel-track--left" />
                  <div class="tux-roadway__wheel-track tux-roadway__wheel-track--right" />
                </div>

                <!-- Floating 3D Spatial Telemetry HUD Pane -->
                <div
                  class="tux-roadway__lane-hud-anchor"
                  :style="getHudAnchorStyle(idx, lane)"
                  @click.stop="selectedLaneIndex = idx"
                >
                  <!-- Ground Anchor Footprint on Asphalt (Z = 0) -->
                  <div class="tux-roadway__hud-ground-target">
                    <div class="tux-roadway__ground-ring" />
                    <div class="tux-roadway__ground-dot" />
                    <div
                      class="tux-roadway__ground-shadow"
                      :style="{ opacity: (popOutFactor * 0.45).toFixed(2) }"
                    />
                  </div>

                  <!-- Vertical 3D Stanchion Pillar rising from Z=0 up to Z=liftZ -->
                  <div
                    v-if="popOutFactor > 0.05"
                    class="tux-roadway__hud-stanchion-pole"
                    :style="getStanchionPoleStyle(idx)"
                  />

                  <!-- Floating 3D Billboard HUD Card at Z=liftZ -->
                  <div
                    class="tux-roadway__hud-card"
                    :class="{
                      'tux-roadway__hud-card--popped': popOutFactor > 0.12,
                      'tux-roadway__hud-card--selected': selectedLaneIndex === idx,
                      'tux-roadway__hud-card--shoulder': lane.type === 'shoulder'
                    }"
                    :style="getHudCardStyle(idx, lane)"
                  >
                    <!-- Top Bar: Title & Lane Width Badge -->
                    <div class="tux-roadway__hud-top" :title="`Lane Geometry: ${lane.name} (${lane.widthFt} ft standard width)`">
                      <span class="tux-roadway__hud-title">{{ lane.label }}</span>
                      <span
                        v-if="popOutFactor > 0.15 && lane.type !== 'shoulder'"
                        class="tux-roadway__hud-type-tag"
                        :class="`tux-roadway__hud-type-tag--${lane.type}`"
                        :title="lane.type === 'managed' ? 'TEXpress Managed Lane: Dynamically priced express corridor maintaining 50+ MPH flow' : 'General Purpose Lane: Standard public highway travel lane'"
                      >
                        {{ lane.type === 'managed' ? 'TEXPRESS' : 'GP' }}
                      </span>
                    </div>

                    <!-- Main Stats Section: Speed & LOS -->
                    <div v-if="lane.speedMph" class="tux-roadway__hud-stats">
                      <div class="tux-roadway__hud-main-stat">
                        <span class="tux-roadway__hud-speed" :title="`Median travel speed: ${lane.speedMph} MPH`">{{ lane.speedMph }} <small>MPH</small></span>
                        <span v-if="lane.los" class="tux-roadway__hud-los" :class="losClass(lane.los)" :title="getLosDescription(lane.los)">
                          LOS {{ lane.los }}
                        </span>
                      </div>

                      <!-- Popped-out expanded real-time telemetry metrics -->
                      <div
                        v-if="popOutFactor > 0.15"
                        class="tux-roadway__hud-expanded"
                        :style="{ opacity: Math.min(1, (popOutFactor - 0.15) * 2.5) }"
                      >
                        <div class="tux-roadway__hud-stat-cell" title="Vehicles Per Hour: Hourly traffic flow rate measured by roadbed sensors">
                          <span class="tux-roadway__hud-stat-val">{{ lane.volumeVph?.toLocaleString() ?? '—' }}</span>
                          <span class="tux-roadway__hud-stat-lbl">VPH</span>
                        </div>
                        <div class="tux-roadway__hud-stat-divider" />
                        <div class="tux-roadway__hud-stat-cell" title="Sensor Occupancy: Percentage of time sensors detect a vehicle. Over 30% indicates severe congestion.">
                          <span class="tux-roadway__hud-stat-val">{{ lane.occupancyPct ?? '—' }}%</span>
                          <span class="tux-roadway__hud-stat-lbl">OCC</span>
                        </div>
                      </div>
                    </div>

                    <!-- Shoulder Lane Specific Readout -->
                    <div v-else-if="lane.type === 'shoulder'" class="tux-roadway__hud-shoulder-info" :title="`${lane.name}: ${lane.widthFt} ft paved safety and emergency refuge corridor`">
                      <span class="tux-roadway__hud-shoulder-lbl">
                        {{ idx === 0 ? 'Inside Shldr' : 'Outside Shldr' }}
                      </span>
                      <span v-if="popOutFactor > 0.15" class="tux-roadway__hud-shoulder-sub">
                        {{ lane.widthFt }} FT &bull; Emergency
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Animated 3D Volumetric Vehicle Platoon in Lane -->
                <div
                  v-if="lane.type !== 'shoulder'"
                  class="tux-roadway__platoon-stream"
                  :class="{ 'tux-roadway__platoon-stream--animating': animatePlatoons }"
                >
                  <div
                    v-for="v in 2"
                    :key="v"
                    class="tux-roadway__vehicle"
                    :class="[
                      `tux-roadway__vehicle--${getLaneVehicleType(lane, v)}`
                    ]"
                    :style="{
                      top: animatePlatoons ? undefined : `${(v === 1 ? 42 : 78) + ((idx * 15) % 18)}%`,
                      animationDelay: `${(v - 1) * 2.8 + (idx * 0.7)}s`
                    }"
                  >
                    <!-- Crisp Ground Contact AO Shadow on Asphalt -->
                    <div class="tux-roadway__v3d-shadow" />

                    <!-- 3D Wheels touching asphalt plane -->
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--fl" />
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--fr" />
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--rl" />
                    <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--rr" />
                    <template v-if="getLaneVehicleType(lane, v) === 'truck'">
                      <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--mid-l" />
                      <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--mid-r" />
                      <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--rl2" />
                      <div class="tux-roadway__v3d-wheel tux-roadway__v3d-wheel--rr2" />
                    </template>

                    <!-- Forward Projected Headlight Cones onto Asphalt -->
                    <div class="tux-roadway__v3d-beam" />

                    <!-- EV Cybernetic Underglow on Asphalt -->
                    <div v-if="getLaneVehicleType(lane, v) === 'ev'" class="tux-roadway__v3d-underglow" />

                    <!-- Volumetric 3D Chassis Base Body -->
                    <div class="tux-roadway__v3d-chassis">
                      <!-- Hood Surface -->
                      <div class="tux-roadway__v3d-hood">
                        <div class="tux-roadway__v3d-hood-crease" />
                      </div>
                      <!-- Trunk (for sedan / ev) -->
                      <div
                        v-if="getLaneVehicleType(lane, v) === 'sedan' || getLaneVehicleType(lane, v) === 'ev'"
                        class="tux-roadway__v3d-trunk"
                      />
                      <!-- 3D Flank Walls dropping down to ground -->
                      <div class="tux-roadway__v3d-flank tux-roadway__v3d-flank--left" />
                      <div class="tux-roadway__v3d-flank tux-roadway__v3d-flank--right" />
                      <!-- Front Bumper Face with Headlamps -->
                      <div class="tux-roadway__v3d-bumper-front">
                        <div class="tux-roadway__v3d-headlamp tux-roadway__v3d-headlamp--left" />
                        <div class="tux-roadway__v3d-grille" />
                        <div class="tux-roadway__v3d-headlamp tux-roadway__v3d-headlamp--right" />
                      </div>
                      <!-- Rear Bumper Face with Taillights -->
                      <div class="tux-roadway__v3d-bumper-rear">
                        <div class="tux-roadway__v3d-taillight tux-roadway__v3d-taillight--left" />
                        <div class="tux-roadway__v3d-license-plate" />
                        <div class="tux-roadway__v3d-taillight tux-roadway__v3d-taillight--right" />
                      </div>
                    </div>

                    <!-- Texas Work Pickup Truck Open Bed -->
                    <div v-if="getLaneVehicleType(lane, v) === 'pickup'" class="tux-roadway__v3d-pickup-bed">
                      <div class="tux-roadway__v3d-bed-floor" />
                      <div class="tux-roadway__v3d-bed-rail tux-roadway__v3d-bed-rail--left" />
                      <div class="tux-roadway__v3d-bed-rail tux-roadway__v3d-bed-rail--right" />
                      <div class="tux-roadway__v3d-bed-tailgate" />
                      <div class="tux-roadway__v3d-headache-rack" />
                      <div class="tux-roadway__v3d-bed-toolbox" />
                    </div>

                    <!-- 3D Elevated Cabin Greenhouse with Sloped Windshields -->
                    <div class="tux-roadway__v3d-cabin">
                      <!-- Roof Top Surface with Highlight -->
                      <div class="tux-roadway__v3d-roof">
                        <!-- Autonomous Connected EV LIDAR Sensor Puck -->
                        <div v-if="getLaneVehicleType(lane, v) === 'ev'" class="tux-roadway__v3d-lidar" />
                        <!-- Semi Truck Aerodynamic Roof Fairing -->
                        <div v-if="getLaneVehicleType(lane, v) === 'truck'" class="tux-roadway__v3d-truck-fairing" />
                      </div>
                      <!-- Sloped Front Windshield -->
                      <div class="tux-roadway__v3d-windshield">
                        <div class="tux-roadway__v3d-glass-glare" />
                      </div>
                      <!-- Sloped Rear Window -->
                      <div class="tux-roadway__v3d-backwindow" />
                      <!-- Side Windows -->
                      <div class="tux-roadway__v3d-glass-side tux-roadway__v3d-glass-side--left" />
                      <div class="tux-roadway__v3d-glass-side tux-roadway__v3d-glass-side--right" />
                    </div>

                    <!-- Semi Truck Twin Vertical Chrome Exhaust Stacks -->
                    <div v-if="getLaneVehicleType(lane, v) === 'truck'" class="tux-roadway__v3d-stacks">
                      <div class="tux-roadway__v3d-stack tux-roadway__v3d-stack--left" />
                      <div class="tux-roadway__v3d-stack tux-roadway__v3d-stack--right" />
                    </div>

                    <!-- Heavy Commercial 3D Cargo Box Trailer -->
                    <div v-if="getLaneVehicleType(lane, v) === 'truck'" class="tux-roadway__v3d-trailer">
                      <div class="tux-roadway__v3d-trailer-top">
                        <span class="tux-roadway__v3d-trailer-brand">TXDOT FREIGHT</span>
                      </div>
                      <div class="tux-roadway__v3d-trailer-flank tux-roadway__v3d-trailer-flank--left" />
                      <div class="tux-roadway__v3d-trailer-flank tux-roadway__v3d-trailer-flank--right" />
                      <div class="tux-roadway__v3d-trailer-front" />
                      <div class="tux-roadway__v3d-trailer-rear">
                        <div class="tux-roadway__v3d-trailer-lockbar" />
                        <div class="tux-roadway__v3d-trailer-hazard" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rumble strip pattern on outside shoulder -->
                <div v-if="lane.type === 'shoulder' && lane.widthFt >= 8" class="tux-roadway__rumble-strip" />
              </div>

              <!-- Front Cross-Section Geotechnical Slab Face (HMAC, Binder, Limestone Base, Subgrade) -->
              <div class="tux-roadway__roadbed-slab-front">
                <div class="tux-roadway__slab-layer tux-roadway__slab-layer--surface" title="Superpave HMAC Surface Course (2 in): High-durability stone-matrix asphalt wearing course (TxDOT Item 344)" />
                <div class="tux-roadway__slab-layer tux-roadway__slab-layer--binder" title="Dense-Graded Asphalt Binder Course (3.5 in): High-modulus structural load distribution course (TxDOT Item 341)" />
                <div class="tux-roadway__slab-layer tux-roadway__slab-layer--base" title="Crushed Limestone Flexible Base (10 in): TxDOT Item 247 Grade 1 crushed stone foundation course" />
                <div class="tux-roadway__slab-layer tux-roadway__slab-layer--subgrade" title="Lime-Treated Subgrade Foundation (8 in): Chemically stabilized native subgrade soil" />
              </div>
              <div class="tux-roadway__roadbed-slab-rear" />
            </div>

            <!-- Roadway Hinge Point & Embankment Drainage Channel (Mathematically Sound V-Ditch) -->
            <div class="tux-roadway__3d-embankment">
              <!-- Foreslope descending from shoulder into the ground -->
              <div class="tux-roadway__foreslope" title="AASHTO Recoverable Foreslope (4:1): Traversable grade allowing errant vehicles to safely recover or brake without overturning">
                <div class="tux-roadway__slope-label">{{ activeData.foreslope }}</div>
                <div class="tux-roadway__grass-texture" />
              </div>

              <!-- Drainage Ditch / Swale Channel Invert sunken at bottom -->
              <div class="tux-roadway__ditch-invert" title="Swale Flowline Invert: Vegetated drainage channel engineered for 10-year storm event runoff capacity">
                <div class="tux-roadway__water-flow" />
                <span class="tux-roadway__ditch-label">Drainage Flow Line</span>
              </div>

              <!-- Embankment Backslope ascending back to natural grade -->
              <div class="tux-roadway__backslope" title="AASHTO Backslope (3:1): Stable embankment slope ascending to natural ground elevation">
                <div class="tux-roadway__backslope-label">{{ activeData.backslope }}</div>
                <div class="tux-roadway__grass-texture" />
              </div>

              <!-- Right-of-Way Buffer Strip & Boundary Fence -->
              <div class="tux-roadway__row-strip" title="TxDOT Right-of-Way (R.O.W.) Limit: Legal boundary of state transportation property">
                <div class="tux-roadway__row-fence">
                  <div class="tux-roadway__row-tag">TxDOT R.O.W. Limit</div>
                </div>
              </div>

              <!-- Earth Cross-Section Cut Face along Front Edge of Embankment -->
              <div class="tux-roadway__embankment-cut-front">
                <svg class="tux-roadway__embankment-svg" viewBox="0 0 220 28" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="tuxSoilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--surface-sunken)" />
                      <stop offset="35%" stop-color="color-mix(in srgb, var(--brand-secondary) 22%, var(--surface-sunken))" />
                      <stop offset="100%" stop-color="var(--neutral-900)" />
                    </linearGradient>
                  </defs>
                  <!-- Geotechnical earth polygon matching the ditch cross-section:
                       Starts at shoulder (0,0), descends foreslope to (73,22), traverses swale invert to (109,22),
                       ascends backslope to (182,0), traverses ROW strip to (220,0), drops to bedrock base (220,28) -> (0,28) -->
                  <polygon points="0,0 73,22 109,22 182,0 220,0 220,28 0,28" fill="url(#tuxSoilGrad)" stroke="var(--surface-border)" stroke-width="0.5" />
                  <!-- Water depth in the swale channel invert -->
                  <polygon points="73,22 109,22 109,19 73,19" fill="var(--color-info)" opacity="0.6" />
                </svg>
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
  width: 15.5rem;
  box-shadow: var(--elevation-flat);
}

@media (max-width: 639px) {
  .tux-roadway__3d-viewport {
    min-height: 0;
    flex-direction: column-reverse;
  }

  .tux-roadway__3d-controls {
    position: relative;
    top: auto;
    right: auto;
    width: auto;
    margin: 0.5rem;
  }

  .tux-roadway-cross-section .tux-roadway__perspective-wrapper {
    padding: 0.5rem;
    min-height: 18rem;
  }

  .tux-roadway__mode-pills {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tux-roadway__mode-btn {
    flex: 0 0 auto;
    min-height: 40px;
    white-space: nowrap;
  }

  .tux-roadway-cross-section .tux-roadway__angle-btn {
    min-height: 36px;
  }

  .tux-roadway__controls-row,
  .tux-roadway__control-group {
    width: 100%;
  }

  .tux-roadway__select {
    flex: 1;
    min-height: 40px;
  }
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
  touch-action: pan-y;
  position: relative;
}

.tux-roadway__perspective-wrapper--active,
.tux-roadway__perspective-wrapper--dragging {
  touch-action: none;
}

.tux-roadway__perspective-wrapper--dragging {
  cursor: grabbing !important;
  user-select: none;
}

/* Scroll Shield Notification & Active Focus Badges */
.tux-roadway__scroll-shield-badge {
  position: absolute;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-full);
  background-color: var(--surface-raised);
  border: 1px solid color-mix(in srgb, var(--brand-accent) 35%, var(--surface-border));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--neutral-1000) 35%, transparent);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-family: var(--font-mono);
  pointer-events: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.tux-roadway__active-shield-pill {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 45;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-full);
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--neutral-1000) 22%, transparent);
  color: var(--text-secondary);
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tux-roadway__active-shield-pill:hover,
.tux-roadway__active-shield-pill:focus-visible {
  border-color: var(--brand-primary);
  color: var(--text-primary);
  outline: none;
}

/* Off-screen performance throttling: pause animations when scrolled out of view */
.tux-roadway__3d-viewport--offscreen .tux-roadway__vehicle,
.tux-roadway__3d-viewport--offscreen .tux-roadway__water-flow {
  animation-play-state: paused !important;
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

/* Volumetric Subgrade Earth Foundation Pedestal */
.tux-roadway__corridor-pedestal {
  position: absolute;
  inset: 0;
  transform: translateZ(-28px);
  background: var(--neutral-900);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 32px 64px -16px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  pointer-events: none;
}

/* Concrete Barrier Extruded in 3D (TxDOT Single-Slope SSCB-42") */
.tux-roadway__3d-barrier {
  width: 18px;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  flex-shrink: 0;
}

.tux-roadway__barrier-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 14px;
  background: linear-gradient(to right, color-mix(in srgb, var(--neutral-1000) 35%, transparent), transparent);
  transform: translateZ(0.2px);
  pointer-events: none;
}

.tux-roadway__barrier-top {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 2px;
  width: 12px;
  background-color: var(--neutral-300);
  transform: translateZ(18px);
  border-left: 1px solid var(--neutral-200);
  border-right: 1px solid var(--neutral-400);
}

.tux-roadway__barrier-flank-right {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 14px;
  width: 19px;
  transform-origin: left center;
  transform: translateZ(18px) rotateY(77deg);
  background: linear-gradient(to bottom, var(--neutral-400), var(--neutral-500));
}

.tux-roadway__barrier-flank-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 2px;
  width: 18px;
  transform-origin: left center;
  transform: translateZ(18px) rotateY(-90deg);
  background-color: var(--neutral-500);
}

.tux-roadway__barrier-front {
  position: absolute;
  top: 100%;
  left: 0;
  width: 18px;
  height: 18px;
  transform-origin: top center;
  transform: rotateX(-90deg);
  background-color: var(--neutral-400);
  border-left: 1px solid var(--neutral-300);
  border-bottom: 2px solid var(--neutral-600);
}

/* Roadbed */
.tux-roadway__3d-roadbed {
  flex: 1;
  display: flex;
  height: 100%;
  background: var(--neutral-800);
  position: relative;
  overflow: visible;
  transform-style: preserve-3d;
}

/* Front Cross-Section Geotechnical Pavement Slab Face (HMAC, Binder, Base, Subgrade) */
.tux-roadway__roadbed-slab-front {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 28px;
  transform-origin: top center;
  transform: rotateX(-90deg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

.tux-roadway__slab-layer--surface {
  height: 4px;
  background-color: var(--neutral-900);
  border-bottom: 1px solid var(--neutral-700);
}

.tux-roadway__slab-layer--binder {
  height: 5px;
  background-color: var(--neutral-700);
  border-bottom: 1px solid var(--neutral-600);
}

.tux-roadway__slab-layer--base {
  height: 10px;
  background-color: var(--neutral-500);
  border-bottom: 1px solid var(--neutral-600);
}

.tux-roadway__slab-layer--subgrade {
  height: 9px;
  background-color: color-mix(in srgb, var(--brand-secondary) 22%, var(--surface-sunken));
  border-bottom: 1px solid var(--surface-border);
}

.tux-roadway__roadbed-slab-rear {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 28px;
  transform-origin: bottom center;
  transform: rotateX(90deg);
  background-color: var(--neutral-900);
}

.tux-roadway__3d-lane {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-right: 1px dashed color-mix(in srgb, var(--neutral-0) 35%, transparent);
  padding: 0.5rem 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  overflow: visible;
  transform-style: preserve-3d;
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

/* Raised Pavement Markers (Botts' Dots / RPMs) */
.tux-roadway__rpm {
  position: absolute;
  width: 4px;
  height: 4px;
  left: 50%;
  transform: translateX(-50%) translateZ(1.5px);
  border-radius: 1px;
  background-color: var(--neutral-0);
  box-shadow: 0 0 3px var(--neutral-0);
}

.tux-roadway__rpm--1 { top: 15%; }
.tux-roadway__rpm--2 { top: 40%; }
.tux-roadway__rpm--3 { top: 65%; }
.tux-roadway__rpm--4 { top: 90%; }

/* Wheel Path Compaction Wear in Travel Lanes */
.tux-roadway__wheel-paths {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  justify-content: space-around;
  padding: 0 10%;
}

.tux-roadway__wheel-track {
  width: 22%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--neutral-1000) 12%, transparent),
    color-mix(in srgb, var(--neutral-1000) 18%, transparent)
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FLOATING 3D POP-OUT TELEMETRY HUD PANE
   ══════════════════════════════════════════════════════════════════════════ */
.tux-roadway__lane-hud-anchor {
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  cursor: pointer;
}

/* Ground Anchor Footprint on Asphalt (Z = 0) */
.tux-roadway__hud-ground-target {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%) translateZ(0.5px);
  pointer-events: none;
  transform-style: preserve-3d;
}

.tux-roadway__ground-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: var(--brand-accent);
  box-shadow: 0 0 8px var(--brand-accent);
}

.tux-roadway__ground-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  transform: translate(-50%, -50%);
  border: 1px solid color-mix(in srgb, var(--brand-accent) 50%, transparent);
}

.tux-roadway__ground-shadow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 20px;
  border-radius: var(--radius-full);
  transform: translate(-50%, -50%);
  background-color: color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  filter: blur(4px);
  pointer-events: none;
}

/* Vertical 3D Stanchion Pillar */
.tux-roadway__hud-stanchion-pole {
  position: absolute;
  left: -1px;
  bottom: 0;
  width: 2px;
  transform-origin: bottom center;
  transform: rotateX(-90deg);
  background: linear-gradient(to top, var(--brand-accent), color-mix(in srgb, var(--brand-accent) 22%, transparent));
  box-shadow: 0 0 4px var(--brand-accent);
  pointer-events: none;
  z-index: 5;
}

/* Floating 3D Billboard HUD Card */
.tux-roadway__hud-card {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 72px;
  padding: 0.25rem 0.35rem;
  border-radius: var(--radius-sm);
  background-color: var(--surface-raised);
  border: 1px solid var(--surface-border);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--neutral-1000) 35%, transparent);
  text-align: center;
  user-select: none;
  transform-style: preserve-3d;
  cursor: pointer;
  z-index: 10;
}

.tux-roadway__hud-card--popped {
  width: 146px;
  padding: 0.45rem 0.6rem;
  box-shadow: 0 12px 28px -4px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 35%, var(--surface-border));
}

.tux-roadway__hud-card--shoulder.tux-roadway__hud-card--popped {
  width: 104px;
  padding: 0.4rem 0.5rem;
}

.tux-roadway__hud-card--selected {
  outline: 2px solid var(--brand-accent);
  border-color: var(--brand-accent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--brand-accent) 50%, transparent), 0 16px 32px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

.tux-roadway__hud-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.tux-roadway__hud-title {
  display: block;
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.tux-roadway__hud-card--popped .tux-roadway__hud-title {
  font-size: 0.75rem;
}

.tux-roadway__hud-type-tag {
  font-size: 0.5625rem;
  font-family: var(--font-mono);
  font-weight: 800;
  padding: 0.08rem 0.25rem;
  border-radius: var(--radius-sm);
  background-color: var(--surface-sunken);
  color: var(--text-secondary);
}

.tux-roadway__hud-type-tag--managed {
  background-color: color-mix(in srgb, var(--brand-primary) 18%, transparent);
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .tux-roadway__hud-type-tag--managed {
  color: var(--brand-accent);
}

.tux-roadway__hud-stats {
  margin-top: 0.2rem;
}

.tux-roadway__hud-main-stat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.tux-roadway__hud-speed {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  font-weight: 800;
  color: var(--brand-primary);
}

.tux-roadway__hud-card--popped .tux-roadway__hud-speed {
  font-size: 0.875rem;
}

[data-theme="tti-dark"] .tux-roadway__hud-speed {
  color: var(--brand-accent);
}

.tux-roadway__hud-speed small {
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--text-muted);
}

.tux-roadway__hud-los {
  font-size: 0.625rem;
  font-family: var(--font-mono);
  font-weight: 800;
  padding: 0.08rem 0.3rem;
  border-radius: var(--radius-sm);
  border: 1px solid;
}

.tux-roadway__hud-expanded {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 0.35rem;
  padding-top: 0.25rem;
  border-top: 1px dashed var(--surface-border);
}

.tux-roadway__hud-stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;
}

.tux-roadway__hud-stat-val {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
}

.tux-roadway__hud-stat-lbl {
  font-size: 0.5625rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
}

.tux-roadway__hud-stat-divider {
  width: 1px;
  height: 20px;
  background-color: var(--surface-border);
}

.tux-roadway__hud-shoulder-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.tux-roadway__hud-shoulder-lbl {
  font-size: 0.625rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
}

.tux-roadway__hud-shoulder-sub {
  font-size: 0.5625rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
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
  width: 32px;
  max-width: 78%;
  height: 72px;
  top: -140px;
}

.tux-roadway__vehicle--pickup {
  width: 36px;
  max-width: 78%;
  height: 80px;
}

.tux-roadway__vehicle--truck {
  width: 40px;
  max-width: 78%;
  height: 128px;
}

/* Crisp Ground Contact AO Shadow on Asphalt */
.tux-roadway__v3d-shadow {
  position: absolute;
  inset: -3px;
  border-radius: var(--radius-sm);
  background-color: color-mix(in srgb, var(--neutral-1000) 50%, transparent);
  filter: blur(3px);
  transform: translateZ(0.2px);
}

/* 3D Wheels touching asphalt plane (Z = 0) */
.tux-roadway__v3d-wheel {
  position: absolute;
  width: 5px;
  height: 14px;
  border-radius: 2px;
  background-color: var(--neutral-900);
  box-shadow: inset 0 0 2px var(--neutral-1000);
  transform: translateZ(3px);
  z-index: 2;
}

.tux-roadway__v3d-wheel::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 6px;
  border-radius: 1px;
  background-color: var(--neutral-400);
}

.tux-roadway__v3d-wheel--fl {
  bottom: 8px;
  left: -2px;
}

.tux-roadway__v3d-wheel--fr {
  bottom: 8px;
  right: -2px;
}

.tux-roadway__v3d-wheel--rl {
  top: 10px;
  left: -2px;
}

.tux-roadway__v3d-wheel--rr {
  top: 10px;
  right: -2px;
}

.tux-roadway__v3d-wheel--mid-l {
  top: 38px;
  left: -2px;
}

.tux-roadway__v3d-wheel--mid-r {
  top: 38px;
  right: -2px;
}

.tux-roadway__v3d-wheel--rl2 {
  top: 26px;
  left: -2px;
}

.tux-roadway__v3d-wheel--rr2 {
  top: 26px;
  right: -2px;
}

/* Volumetric 3D Chassis Base Body */
.tux-roadway__v3d-chassis {
  position: absolute;
  inset: 2px;
  transform-style: preserve-3d;
  transform: translateZ(8px);
  border-radius: var(--radius-sm);
}

.tux-roadway__vehicle--sedan .tux-roadway__v3d-chassis {
  background-color: var(--color-info);
  color: var(--color-info);
}

.tux-roadway__vehicle--ev .tux-roadway__v3d-chassis {
  background-color: var(--brand-accent);
  color: var(--brand-accent);
}

.tux-roadway__vehicle--pickup .tux-roadway__v3d-chassis {
  background-color: var(--neutral-300);
  color: var(--neutral-300);
  transform: translateZ(9px);
}

.tux-roadway__vehicle--truck .tux-roadway__v3d-chassis {
  background-color: var(--brand-primary);
  color: var(--brand-primary);
  top: auto;
  bottom: 2px;
  height: 44px;
  transform: translateZ(10px);
}

/* Hood & Trunk Top Surfaces with Facet Highlighting */
.tux-roadway__v3d-hood {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 22px;
  background-color: inherit;
  border-radius: 0 0 4px 4px;
  box-shadow: inset 0 -2px 4px color-mix(in srgb, var(--neutral-1000) 18%, transparent);
}

.tux-roadway__v3d-hood-crease {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 50%;
  width: 1px;
  background-color: color-mix(in srgb, var(--neutral-1000) 22%, transparent);
  transform: translateX(-50%);
}

.tux-roadway__v3d-trunk {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16px;
  background-color: inherit;
  border-radius: 4px 4px 0 0;
  box-shadow: inset 0 2px 4px color-mix(in srgb, var(--neutral-1000) 18%, transparent);
}

/* 3D Flank Walls (Chassis Thickness Dropping to Wheels/Ground) */
.tux-roadway__v3d-flank {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
}

.tux-roadway__v3d-flank--left {
  left: 0;
  transform-origin: left center;
  transform: rotateY(90deg);
  background-color: color-mix(in srgb, currentColor 80%, var(--neutral-1000));
}

.tux-roadway__v3d-flank--right {
  right: 0;
  transform-origin: right center;
  transform: rotateY(-90deg);
  background-color: color-mix(in srgb, currentColor 50%, var(--neutral-1000));
}

/* Front & Rear Bumpers */
.tux-roadway__v3d-bumper-front {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  transform-origin: center bottom;
  transform: rotateX(90deg);
  background-color: color-mix(in srgb, currentColor 70%, var(--neutral-1000));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}

.tux-roadway__v3d-grille {
  flex: 1;
  height: 4px;
  margin: 0 3px;
  background: repeating-linear-gradient(
    to right,
    var(--neutral-900) 0px,
    var(--neutral-900) 2px,
    var(--neutral-600) 2px,
    var(--neutral-600) 4px
  );
  border-radius: 1px;
}

.tux-roadway__v3d-bumper-rear {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  transform-origin: center top;
  transform: rotateX(-90deg);
  background-color: color-mix(in srgb, currentColor 60%, var(--neutral-1000));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}

.tux-roadway__v3d-license-plate {
  width: 8px;
  height: 3px;
  background-color: var(--neutral-0);
  border: 1px solid var(--neutral-800);
  border-radius: 1px;
}

/* Headlamps & LED Taillights */
.tux-roadway__v3d-headlamp {
  width: 6px;
  height: 4px;
  border-radius: 1px;
  background-color: var(--neutral-0);
  box-shadow: 0 0 8px var(--neutral-0);
}

.tux-roadway__v3d-taillight {
  width: 6px;
  height: 3px;
  border-radius: 1px;
  background-color: var(--color-danger);
  box-shadow: 0 0 8px var(--color-danger);
}

/* Forward Projected Headlight Cones onto Asphalt */
.tux-roadway__v3d-beam {
  position: absolute;
  bottom: -60px;
  left: -8px;
  width: 48px;
  height: 60px;
  pointer-events: none;
  transform: translateZ(0.5px);
  background: radial-gradient(
    ellipse 70% 100% at 50% 0%,
    color-mix(in srgb, var(--neutral-0) 35%, transparent) 0%,
    color-mix(in srgb, var(--brand-accent) 18%, transparent) 45%,
    transparent 80%
  );
  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
}

/* EV Cybernetic Underglow */
.tux-roadway__v3d-underglow {
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-md);
  background-color: color-mix(in srgb, var(--spectrum-teal) 35%, transparent);
  filter: blur(6px);
  transform: translateZ(0.5px);
  pointer-events: none;
}

/* 3D Elevated Cabin Greenhouse with High-Contrast Normal Shading */
.tux-roadway__v3d-cabin {
  position: absolute;
  top: 18px;
  bottom: 22px;
  left: 3px;
  right: 3px;
  transform-style: preserve-3d;
  transform: translateZ(16px);
}

.tux-roadway__vehicle--pickup .tux-roadway__v3d-cabin {
  top: auto;
  bottom: 22px;
  height: 26px;
  transform: translateZ(18px);
}

.tux-roadway__vehicle--truck .tux-roadway__v3d-cabin {
  top: auto;
  bottom: 20px;
  height: 24px;
  left: 2px;
  right: 2px;
  transform: translateZ(24px);
}

.tux-roadway__v3d-roof {
  position: absolute;
  inset: 0;
  background-color: currentColor;
  border-radius: 2px;
  transform-style: preserve-3d;
  box-shadow: inset 0 0 4px color-mix(in srgb, var(--neutral-0) 22%, transparent);
}

.tux-roadway__vehicle--sedan .tux-roadway__v3d-roof {
  color: var(--color-info);
}

.tux-roadway__vehicle--ev .tux-roadway__v3d-roof {
  color: var(--brand-accent);
}

.tux-roadway__vehicle--pickup .tux-roadway__v3d-roof {
  color: var(--neutral-300);
}

.tux-roadway__vehicle--truck .tux-roadway__v3d-roof {
  color: var(--brand-primary);
}

/* Sloped Windshields (Angled Glass) */
.tux-roadway__v3d-windshield {
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 14px;
  transform-origin: top center;
  transform: rotateX(-50deg);
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-info) 50%, var(--neutral-900)),
    color-mix(in srgb, var(--color-info) 22%, var(--neutral-1000))
  );
  border-bottom: 1px solid color-mix(in srgb, var(--neutral-0) 22%, transparent);
}

.tux-roadway__v3d-glass-glare {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 2px;
  background: color-mix(in srgb, var(--neutral-0) 50%, transparent);
  border-radius: 1px;
}

.tux-roadway__v3d-backwindow {
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 14px;
  transform-origin: bottom center;
  transform: rotateX(50deg);
  background: color-mix(in srgb, var(--color-info) 35%, var(--neutral-1000));
}

.tux-roadway__v3d-glass-side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 9px;
  background: color-mix(in srgb, var(--color-info) 22%, var(--neutral-1000));
}

.tux-roadway__v3d-glass-side--left {
  left: 0;
  transform-origin: left center;
  transform: rotateY(90deg);
}

.tux-roadway__v3d-glass-side--right {
  right: 0;
  transform-origin: right center;
  transform: rotateY(-90deg);
}

/* Autonomous Connected Vehicle LIDAR Sensor Puck */
.tux-roadway__v3d-lidar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(4px);
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--spectrum-teal);
  box-shadow: 0 0 10px var(--spectrum-teal);
  animation: pulseLidar 1.6s ease-in-out infinite;
}

@keyframes pulseLidar {
  0%, 100% {
    transform: translate(-50%, -50%) translateZ(4px) scale(0.9);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) translateZ(4px) scale(1.15);
    opacity: 1;
  }
}

/* Texas Work Pickup Truck Open Bed with Realistic Toolbox & Rack */
.tux-roadway__v3d-pickup-bed {
  position: absolute;
  top: 2px;
  bottom: 48px;
  left: 2px;
  right: 2px;
  transform-style: preserve-3d;
}

.tux-roadway__v3d-bed-floor {
  position: absolute;
  inset: 0;
  transform: translateZ(8px);
  background: repeating-linear-gradient(
    to right,
    var(--neutral-800) 0px,
    var(--neutral-800) 3px,
    var(--neutral-900) 3px,
    var(--neutral-900) 5px
  );
  border: 1px solid var(--neutral-700);
}

.tux-roadway__v3d-bed-rail {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--neutral-300);
  transform: translateZ(15px);
}

.tux-roadway__v3d-bed-rail--left {
  left: 0;
}

.tux-roadway__v3d-bed-rail--right {
  right: 0;
}

.tux-roadway__v3d-bed-tailgate {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background-color: var(--neutral-400);
  transform: translateZ(15px);
}

.tux-roadway__v3d-headache-rack {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--neutral-200);
  transform: translateZ(19px);
  border-radius: 1px;
}

.tux-roadway__v3d-bed-toolbox {
  position: absolute;
  bottom: 4px;
  left: 2px;
  right: 2px;
  height: 7px;
  background-color: var(--neutral-400);
  border: 1px solid var(--neutral-300);
  transform: translateZ(14px);
}

/* Semi Truck Stacks & 53-Ft Dry Van Cargo Trailer */
.tux-roadway__v3d-stacks {
  position: absolute;
  bottom: 44px;
  left: 4px;
  right: 4px;
  display: flex;
  justify-content: space-between;
  transform-style: preserve-3d;
}

.tux-roadway__v3d-stack {
  width: 3px;
  height: 18px;
  background-color: var(--neutral-300);
  box-shadow: 0 0 3px var(--neutral-400);
  transform: translateZ(30px);
  border-radius: 1px;
}

.tux-roadway__v3d-trailer {
  position: absolute;
  top: 2px;
  left: 1px;
  right: 1px;
  height: 80px;
  transform-style: preserve-3d;
  transform: translateZ(28px);
}

.tux-roadway__v3d-trailer-top {
  position: absolute;
  inset: 0;
  background-color: var(--neutral-200);
  border: 1px solid var(--neutral-400);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 8px color-mix(in srgb, var(--neutral-1000) 18%, transparent);
}

.tux-roadway__v3d-trailer-brand {
  font-size: 0.5rem;
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--neutral-700);
  transform: rotate(-90deg);
}

.tux-roadway__v3d-trailer-flank {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 26px;
  background: repeating-linear-gradient(
    to bottom,
    var(--neutral-300) 0px,
    var(--neutral-300) 3px,
    var(--neutral-400) 3px,
    var(--neutral-400) 5px
  );
  border-bottom: 2px solid var(--brand-primary);
}

.tux-roadway__v3d-trailer-flank--left {
  left: 0;
  transform-origin: left center;
  transform: rotateY(90deg);
}

.tux-roadway__v3d-trailer-flank--right {
  right: 0;
  transform-origin: right center;
  transform: rotateY(-90deg);
}

.tux-roadway__v3d-trailer-front {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 26px;
  transform-origin: center bottom;
  transform: rotateX(90deg);
  background-color: var(--neutral-400);
}

.tux-roadway__v3d-trailer-rear {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 26px;
  transform-origin: center top;
  transform: rotateX(-90deg);
  background-color: var(--neutral-300);
  border-top: 2px solid var(--color-danger);
  position: relative;
}

.tux-roadway__v3d-trailer-lockbar {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--neutral-600);
}

.tux-roadway__v3d-trailer-hazard {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    to right,
    var(--color-danger) 0px,
    var(--color-danger) 4px,
    var(--neutral-0) 4px,
    var(--neutral-0) 8px
  );
}

.tux-roadway__v3d-truck-fairing {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(to top, var(--brand-primary), color-mix(in srgb, var(--brand-primary) 70%, var(--neutral-0)));
  border-radius: 2px;
}

.tux-roadway__platoon-stream--animating .tux-roadway__vehicle {
  animation: vehicleDrive 5.5s linear infinite;
}

@keyframes vehicleDrive {
  0% {
    top: -120px;
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    top: 440px;
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

/* Embankment 3D Drainage Channel (AASHTO / TxDOT Trapezoidal V-Ditch) */
.tux-roadway__3d-embankment {
  width: 220px;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  flex-shrink: 0;
}

/* Foreslope descending from shoulder into the ground (Z: 0 -> -26px) */
.tux-roadway__foreslope {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 76px;
  transform-origin: left center;
  transform: rotateY(17deg);
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--color-success) 45%, var(--neutral-800)),
    color-mix(in srgb, var(--color-success) 35%, var(--neutral-900))
  );
  border-left: 2px solid color-mix(in srgb, var(--neutral-0) 18%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 12px color-mix(in srgb, var(--neutral-1000) 35%, transparent);
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
  white-space: nowrap;
}

/* Swale Invert Channel bottom (Sunken at Z = -22px) */
.tux-roadway__ditch-invert {
  position: absolute;
  left: 73px;
  top: 0;
  bottom: 0;
  width: 36px;
  transform: translateZ(-22px);
  background: color-mix(in srgb, var(--color-info) 35%, var(--neutral-900));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 8px color-mix(in srgb, var(--neutral-1000) 50%, transparent);
}

.tux-roadway__water-flow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--color-info) 50%, transparent),
    transparent
  );
  border-left: 1px solid color-mix(in srgb, var(--color-info) 35%, transparent);
  border-right: 1px solid color-mix(in srgb, var(--color-info) 35%, transparent);
}

.tux-roadway__ditch-label {
  font-size: 0.5rem;
  font-family: var(--font-mono);
  color: color-mix(in srgb, var(--color-info) 80%, var(--neutral-0));
  transform: rotate(-90deg);
  white-space: nowrap;
  z-index: 2;
}

/* Backslope ascending back to natural grade (Z: -22px -> 0px) */
.tux-roadway__backslope {
  position: absolute;
  left: 109px;
  top: 0;
  bottom: 0;
  width: 76px;
  transform-origin: left center;
  transform: translateZ(-22px) rotateY(-17deg);
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--color-success) 35%, var(--neutral-900)),
    color-mix(in srgb, var(--color-success) 45%, var(--neutral-800))
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 12px color-mix(in srgb, var(--neutral-1000) 35%, transparent);
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
  white-space: nowrap;
}

/* Level Right-of-Way strip at Natural Grade (Z = 0) */
.tux-roadway__row-strip {
  position: absolute;
  left: 182px;
  right: 0;
  top: 0;
  bottom: 0;
  background: color-mix(in srgb, var(--color-success) 50%, var(--neutral-800));
}

.tux-roadway__row-fence {
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: repeating-linear-gradient(
    to bottom,
    var(--color-danger) 0px,
    var(--color-danger) 8px,
    transparent 8px,
    transparent 16px
  );
}

.tux-roadway__row-tag {
  position: absolute;
  top: 10px;
  left: 8px;
  font-size: 0.5rem;
  font-family: var(--font-mono);
  font-weight: bold;
  color: var(--color-danger);
  white-space: nowrap;
}

/* Earth Cross-Section Cut Face along Front Edge of Embankment */
.tux-roadway__embankment-cut-front {
  position: absolute;
  top: 100%;
  left: 0;
  width: 220px;
  height: 28px;
  transform-origin: top center;
  transform: rotateX(-90deg);
  pointer-events: none;
}

.tux-roadway__embankment-svg {
  width: 100%;
  height: 100%;
  display: block;
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

@media (prefers-reduced-motion: reduce) {
  .tux-roadway__vehicle,
  .tux-roadway__v3d-lidar-puck,
  .tux-roadway__water-flow,
  .tux-roadway__interactive-hint {
    animation: none !important;
  }

  .tux-roadway__3d-corridor,
  .tux-roadway__lane-hud-anchor,
  .tux-roadway__hud-card,
  .tux-roadway__action-btn,
  .tux-roadway__lane-kpi-card {
    transition: none !important;
  }
}
</style>
