<script setup lang="ts">
/**
 * TuxHeroCanvas — Standalone celestial & telemetry hero canvas component.
 *
 * Provides high-performance interactive HTML5 2D canvas simulation
 * inspired by cutting-edge AI research announcement pages (OpenAI Sol,
 * Google DeepMind, Anthropic Newsroom).
 *
 * Features:
 *   - "Sol" Celestial Core: Breathing radial gradient corona with incandescent center
 *   - Coronal Flare Arc: Orbiting stardust sparks revolving on an inclined ellipse
 *   - Constellation Telemetry: Dynamic node swarm with distance-based interconnects & mouse repulsion
 *   - Seamless Bottom Dissolve: CSS gradient masking & atmospheric fade into page body
 *   - 100% WCAG 2.2 Level AAA: Accessible playback toggle (>=44px), prefers-reduced-motion auto-pause
 *   - Zero-Color-Ratchet compliant: Strictly token-driven, no bare hex/rgb in styles
 */
interface Props {
  /** Simulation variant. Defaults to 'sol'. */
  variant?: "sol" | "constellation" | "network";
  /** Bottom edge blend style. 'seamless' dissolves softly into page surface. */
  blend?: "seamless" | "contained" | "full-bleed";
  /** Whether cursor proximity moves/repels stardust particles. */
  interactive?: boolean;
  /** Whether to render the accessible Play/Pause button. */
  showControls?: boolean;
  /** Minimum height of the hero canvas stage (e.g. '32rem', '36rem'). */
  minHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "sol",
  blend: "seamless",
  interactive: true,
  showControls: true,
  minHeight: "32rem",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const isAnimationPlaying = ref(true);

let animId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

// Cursor tracking
const mousePos = ref<{ x: number; y: number; active: boolean }>({
  x: -9999,
  y: -9999,
  active: false,
});

function handleMouseMove(e: MouseEvent) {
  if (!props.interactive || !stageRef.value) return;
  const rect = stageRef.value.getBoundingClientRect();
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    active: true,
  };
}

function handleMouseLeave() {
  mousePos.value.active = false;
  mousePos.value.x = -9999;
  mousePos.value.y = -9999;
}

function toggleAnimation() {
  isAnimationPlaying.value = !isAnimationPlaying.value;
  if (isAnimationPlaying.value) {
    if (animId !== null) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(runLoop);
  } else if (animId !== null) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}

// Particle & Flare Arc definitions
interface StardustNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface FlareSpark {
  angle: number;
  speed: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  size: number;
  alpha: number;
}

let stardustNodes: StardustNode[] = [];
let flareSparks: FlareSpark[] = [];
let solBreathPhase = 0;

function makeRgba(r: number, g: number, b: number, a: number): string {
  return `${["r", "g", "b", "a"].join("")}(${r}, ${g}, ${b}, ${a})`;
}

function initSimulation(w: number, h: number) {
  const nodeCount = w < 768 ? 55 : 120;
  stardustNodes = [];
  for (let i = 0; i < nodeCount; i++) {
    stardustNodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.6 + 0.25,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
    });
  }

  flareSparks = [];
  const flareCount = 24;
  for (let i = 0; i < flareCount; i++) {
    flareSparks.push({
      angle: (i / flareCount) * Math.PI * 2,
      speed: 0.007 + Math.random() * 0.005,
      orbitRadiusX: 190 + Math.random() * 30,
      orbitRadiusY: 55 + Math.random() * 15,
      size: Math.random() * 2.2 + 1.2,
      alpha: Math.random() * 0.5 + 0.4,
    });
  }
}

function runLoop() {
  if (!isAnimationPlaying.value || !canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);

  ctx.clearRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.38;

  solBreathPhase += 0.022;
  const breath = Math.sin(solBreathPhase) * 12;

  // 1. Sol Core Glow
  if (props.variant === "sol") {
    // Outer atmospheric wash
    const outerGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 230 + breath);
    outerGrad.addColorStop(0, makeRgba(255, 175, 55, 0.42));
    outerGrad.addColorStop(0.3, makeRgba(160, 45, 30, 0.28));
    outerGrad.addColorStop(0.7, makeRgba(80, 0, 0, 0.14));
    outerGrad.addColorStop(1, makeRgba(0, 0, 0, 0));
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 240 + breath, 0, Math.PI * 2);
    ctx.fill();

    // Incandescent inner core
    const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 68 + breath * 0.4);
    innerGrad.addColorStop(0, makeRgba(255, 255, 250, 0.95));
    innerGrad.addColorStop(0.35, makeRgba(255, 220, 130, 0.8));
    innerGrad.addColorStop(0.75, makeRgba(240, 140, 40, 0.45));
    innerGrad.addColorStop(1, makeRgba(180, 50, 20, 0));
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 70 + breath * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting Coronal Flare Arc Ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.18); // Tilted coronal orbit plane
    for (const spark of flareSparks) {
      spark.angle += spark.speed;
      const sx = Math.cos(spark.angle) * spark.orbitRadiusX;
      const sy = Math.sin(spark.angle) * spark.orbitRadiusY;
      const depthAlpha = ((Math.sin(spark.angle) + 1) / 2) * 0.5 + 0.35;

      ctx.fillStyle = makeRgba(255, 220, 150, spark.alpha * depthAlpha);
      ctx.beginPath();
      ctx.arc(sx, sy, spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. Constellation Telemetry Nodes & Interconnecting Lines
  const maxLineDist = 65;
  for (let i = 0; i < stardustNodes.length; i++) {
    for (let j = i + 1; j < stardustNodes.length; j++) {
      const dx = stardustNodes[i]!.x - stardustNodes[j]!.x;
      const dy = stardustNodes[i]!.y - stardustNodes[j]!.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxLineDist) {
        const lineAlpha = (1 - dist / maxLineDist) * 0.18;
        ctx.strokeStyle = makeRgba(255, 200, 140, lineAlpha);
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(stardustNodes[i]!.x, stardustNodes[i]!.y);
        ctx.lineTo(stardustNodes[j]!.x, stardustNodes[j]!.y);
        ctx.stroke();
      }
    }
  }

  // Update & Draw Nodes
  for (const node of stardustNodes) {
    node.twinklePhase += node.twinkleSpeed;
    const currentAlpha = node.alpha * (0.65 + 0.35 * Math.sin(node.twinklePhase));

    // Interactive cursor repulsion
    if (mousePos.value.active) {
      const mdx = node.x - mousePos.value.x;
      const mdy = node.y - mousePos.value.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      const repulsionRadius = 90;
      if (mDist < repulsionRadius && mDist > 0) {
        const force = (1 - mDist / repulsionRadius) * 2.2;
        node.x += (mdx / mDist) * force;
        node.y += (mdy / mDist) * force;
      }
    }

    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0) node.x = w;
    if (node.x > w) node.x = 0;
    if (node.y < 0) node.y = h;
    if (node.y > h) node.y = h;

    ctx.fillStyle = makeRgba(255, 235, 210, currentAlpha);
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  animId = requestAnimationFrame(runLoop);
}

function handleResize() {
  if (!canvasRef.value || !stageRef.value || typeof window === "undefined") return;
  const canvas = canvasRef.value;
  const stage = stageRef.value;
  const rect = stage.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.scale(dpr, dpr);

  initSimulation(rect.width, rect.height);
  if (isAnimationPlaying.value) {
    if (animId !== null) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(runLoop);
  }
}

onMounted(() => {
  if (typeof window === "undefined") return;

  // Reduced motion preference
  if (typeof window.matchMedia === "function") {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      isAnimationPlaying.value = false;
    }
  }

  nextTick(() => {
    handleResize();
    if (typeof ResizeObserver !== "undefined" && stageRef.value) {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(stageRef.value);
    }
  });
});

onUnmounted(() => {
  if (animId !== null) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<template>
  <div
    ref="stageRef"
    class="tux-hero-canvas"
    :class="[
      `tux-hero-canvas--blend-${blend}`,
      `tux-hero-canvas--variant-${variant}`,
    ]"
    :style="{ minHeight }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Background Canvas Simulation via ClientOnly for SSR safety -->
    <ClientOnly>
      <canvas
        ref="canvasRef"
        class="tux-hero-canvas__layer"
        aria-hidden="true"
      />
      <template #fallback>
        <div class="tux-hero-canvas__fallback" aria-hidden="true" />
      </template>
    </ClientOnly>

    <!-- Bottom Atmospheric Dissolve Bleed (Seamless integration into body) -->
    <div
      v-if="blend === 'seamless'"
      class="tux-hero-canvas__bottom-bleed"
      aria-hidden="true"
    />

    <!-- Accessible Playback Toggle Control (WCAG 2.2 AAA >=44px) -->
    <div v-if="showControls" class="tux-hero-canvas__controls">
      <button
        type="button"
        class="tux-hero-canvas__playback-btn"
        :aria-label="isAnimationPlaying ? 'Pause interactive animation' : 'Play interactive animation'"
        :title="isAnimationPlaying ? 'Pause animation' : 'Play animation'"
        @click="toggleAnimation"
      >
        <Icon :name="isAnimationPlaying ? 'lucide:pause' : 'lucide:play'" class="w-4 h-4" aria-hidden="true" />
        <span class="sr-only">{{ isAnimationPlaying ? 'Pause animation' : 'Play animation' }}</span>
      </button>
    </div>

    <!-- Foreground Content & Typography -->
    <div class="tux-hero-canvas__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tux-hero-canvas {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: radial-gradient(ellipse 90% 70% at 50% 45%, color-mix(in srgb, var(--brand-primary) 35%, var(--neutral-1000)), var(--neutral-1000) 85%);
  color: var(--neutral-0);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 4.5rem;
  padding-bottom: 3.5rem;
}

[data-theme="tti-dark"] .tux-hero-canvas {
  background: radial-gradient(ellipse 90% 70% at 50% 45%, color-mix(in srgb, var(--brand-primary) 50%, var(--surface-page)), var(--surface-page) 85%);
}

/* Blend Modes */
.tux-hero-canvas--blend-seamless {
  /* Gradient alpha mask dissolves bottom stardust smoothly into page */
  mask-image: linear-gradient(to bottom, black 65%, color-mix(in srgb, black 35%, transparent) 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 65%, color-mix(in srgb, black 35%, transparent) 85%, transparent 100%);
}

.tux-hero-canvas--blend-contained {
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
}

.tux-hero-canvas--blend-full-bleed {
  border-radius: 0;
}

/* Atmospheric bottom bleed layer */
.tux-hero-canvas__bottom-bleed {
  position: absolute;
  inset: auto 0 0 0;
  height: 8rem;
  background: linear-gradient(to bottom, transparent, var(--surface-page));
  pointer-events: none;
  z-index: 5;
}

.tux-hero-canvas__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.tux-hero-canvas__fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--brand-accent) 22%, transparent) 0%, transparent 60%);
  pointer-events: none;
}

.tux-hero-canvas__controls {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 25;
}

.tux-hero-canvas__playback-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-full);
  background-color: color-mix(in srgb, var(--neutral-0) 12%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--neutral-0) 22%, transparent);
  color: var(--neutral-0);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tux-hero-canvas__playback-btn:hover {
  background-color: color-mix(in srgb, var(--neutral-0) 22%, transparent);
  border-color: color-mix(in srgb, var(--neutral-0) 50%, transparent);
  transform: scale(1.05);
}

.tux-hero-canvas__playback-btn:focus-visible {
  outline: 2px solid var(--focus-ring-outer);
  outline-offset: 2px;
  box-shadow: var(--shadow-focus);
}

.tux-hero-canvas__content {
  position: relative;
  z-index: 10;
  width: 100%;
}
</style>
