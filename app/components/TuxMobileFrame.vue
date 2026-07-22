<script setup lang="ts">
/**
 * TuxMobileFrame — iPhone or Pixel device chrome for screenshots.
 *
 * Documentation / marketing nicety. Wraps a slot in a stylized
 * device frame so stakeholder reviews and marketing surfaces can
 * preview mobile screenshots without exporting from Figma.
 *
 * **Not for runtime use.** When TTI apps actually need mobile
 * chrome, reach for `TuxAppFrame` (Tauri titlebar) + `TuxTabBar`
 * (mobile tabs) per `design/platform-awareness.md`. This component
 * is for static screenshot framing only — the screen slot doesn't
 * react to orientation, safe areas, or platform APIs.
 *
 * `platform="ios"` renders an iPhone 16 Pro shape (19.5:9 screen,
 * Dynamic Island, home indicator). `platform="android"` renders a
 * Pixel 9 shape (20:9 screen, center punch-hole camera, gesture or
 * three-button nav). Both share the same `:width` pivot so they sit
 * cleanly side-by-side in cross-platform mockups.
 *
 * Usage:
 *   <tux-mobile-frame platform="ios" :width="280" color="natural">
 *     <img src="/screenshots/landscape-mobile.png" alt="" />
 *   </tux-mobile-frame>
 */

type Platform = "ios" | "android";

// Color tokens differ by platform — iPhone uses Apple finishes,
// Pixel uses Google finishes. The shared "maroon" wires to the
// TTI brand for marketing surfaces.
type IosColor     = "natural" | "black" | "white" | "maroon";
type AndroidColor = "obsidian" | "porcelain" | "hazel" | "maroon";
type NavStyle     = "gesture" | "three-button" | "none";

interface Props {
  /** Which platform shape to render. Default `"ios"`. */
  platform?: Platform;
  /** Device width in pixels. Default 280. Screen scales proportionally. */
  width?: number;
  /** Bezel color. Set of options depends on `platform`. */
  color?: IosColor | AndroidColor;
  /** Show the platform-appropriate status bar. Default true. */
  statusBar?: boolean;
  /** Time displayed in the status bar. Default `9:41` (Apple's
   *  canonical screenshot time — adopted by both platforms here for
   *  consistency in cross-platform mockups). */
  time?: string;
  /** iOS: show Dynamic-Island pill. Android: show camera punch-hole. */
  notch?: boolean;
  /** iOS: show home indicator. Android: ignored (use `navStyle`
   *  instead). */
  homeIndicator?: boolean;
  /** Android: nav bar style. Ignored on iOS. */
  navStyle?: NavStyle;
  /** Accessible label for the frame. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  platform: "ios",
  width: 280,
  color: undefined,
  statusBar: true,
  time: "9:41",
  notch: true,
  homeIndicator: true,
  navStyle: "gesture",
  ariaLabel: undefined,
});

const isIos = computed(() => props.platform === "ios");

// Per-platform defaults when consumer doesn't pass `color`.
const resolvedColor = computed(() => {
  if (props.color) return props.color;
  return isIos.value ? "natural" : "obsidian";
});

const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  return isIos.value ? "iPhone preview" : "Android preview";
});

const scale = computed(() => props.width / 280);
const px = (n: number) => `${n * scale.value}px`;

// iOS: 19.5:9 screen aspect with ~8px bezel. Android (Pixel 9):
// 20:9 with ~10px bezel and a tighter corner radius.
const frameStyles = computed(() => {
  if (isIos.value) {
    return {
      width: `${props.width}px`,
      height: px(588),
      borderRadius: px(46),
      padding: px(8),
    };
  }
  return {
    width: `${props.width}px`,
    height: px(598),
    borderRadius: px(36),
    padding: px(10),
  };
});

const screenStyles = computed(() => ({
  borderRadius: isIos.value ? px(38) : px(26),
}));
</script>

<template>
  <figure
    class="tux-mobile-frame"
    :class="[
      `tux-mobile-frame--${platform}`,
      `tux-mobile-frame--${platform}-${resolvedColor}`,
    ]"
    :style="frameStyles"
    :aria-label="resolvedAriaLabel"
  >
    <!-- iOS side buttons: silent switch + vol-up + vol-down (left),
         power (right). Pixel: power + vol stack (right). -->
    <template v-if="isIos">
      <span class="tux-mobile-frame__btn tux-mobile-frame__btn--ios-silent" aria-hidden="true" />
      <span class="tux-mobile-frame__btn tux-mobile-frame__btn--ios-vol-up" aria-hidden="true" />
      <span class="tux-mobile-frame__btn tux-mobile-frame__btn--ios-vol-down" aria-hidden="true" />
      <span class="tux-mobile-frame__btn tux-mobile-frame__btn--ios-power" aria-hidden="true" />
    </template>
    <template v-else>
      <span class="tux-mobile-frame__btn tux-mobile-frame__btn--android-power" aria-hidden="true" />
      <span class="tux-mobile-frame__btn tux-mobile-frame__btn--android-vol" aria-hidden="true" />
    </template>

    <div class="tux-mobile-frame__screen" :style="screenStyles">
      <div
        v-if="statusBar"
        class="tux-mobile-frame__statusbar"
        :class="isIos ? 'tux-mobile-frame__statusbar--ios' : 'tux-mobile-frame__statusbar--android'"
        :style="{ height: px(isIos ? 44 : 34), padding: `0 ${px(isIos ? 22 : 18)}` }"
      >
        <span class="tux-mobile-frame__statusbar-time">{{ time }}</span>
        <span class="tux-mobile-frame__statusbar-icons" :style="{ gap: px(isIos ? 5 : 6) }">
          <UIcon name="lucide:signal" :style="{ width: px(isIos ? 13 : 12), height: px(isIos ? 13 : 12) }" />
          <UIcon name="lucide:wifi" :style="{ width: px(isIos ? 13 : 12), height: px(isIos ? 13 : 12) }" />
          <UIcon name="lucide:battery-full" :style="{ width: px(isIos ? 17 : 16), height: px(isIos ? 13 : 12) }" />
        </span>
      </div>

      <!-- iOS Dynamic Island -->
      <div
        v-if="isIos && notch"
        class="tux-mobile-frame__island"
        aria-hidden="true"
        :style="{
          width: px(110),
          height: px(32),
          borderRadius: px(20),
          top: px(11),
        }"
      />

      <!-- Android camera punch-hole -->
      <div
        v-if="!isIos && notch"
        class="tux-mobile-frame__camera"
        aria-hidden="true"
        :style="{
          width: px(10),
          height: px(10),
          top: px(12),
        }"
      />

      <div class="tux-mobile-frame__content">
        <slot />
      </div>

      <!-- iOS home indicator -->
      <div
        v-if="isIos && homeIndicator"
        class="tux-mobile-frame__home-indicator"
        aria-hidden="true"
        :style="{
          width: px(120),
          height: px(4),
          bottom: px(8),
          borderRadius: px(3),
        }"
      />

      <!-- Android gesture pill -->
      <div
        v-if="!isIos && navStyle === 'gesture'"
        class="tux-mobile-frame__nav-gesture"
        aria-hidden="true"
        :style="{
          width: px(108),
          height: px(4),
          bottom: px(7),
          borderRadius: px(3),
        }"
      />

      <!-- Android three-button nav -->
      <div
        v-else-if="!isIos && navStyle === 'three-button'"
        class="tux-mobile-frame__nav-three"
        aria-hidden="true"
        :style="{ height: px(28), gap: px(36), padding: `0 ${px(36)}`, bottom: 0 }"
      >
        <span class="tux-mobile-frame__nav-icon" :style="{ width: px(10), height: px(10) }">
          <UIcon name="lucide:triangle" />
        </span>
        <span class="tux-mobile-frame__nav-icon" :style="{ width: px(11), height: px(11) }">
          <UIcon name="lucide:circle" />
        </span>
        <span class="tux-mobile-frame__nav-icon" :style="{ width: px(10), height: px(10) }">
          <UIcon name="lucide:square" />
        </span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.tux-mobile-frame {
  position: relative;
  margin: 0;
  background: var(--frame-body);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, white 6%, transparent),
    0 12px 24px -8px color-mix(in srgb, black 30%, transparent),
    0 4px 8px -2px color-mix(in srgb, black 15%, transparent);
}

/* iOS color variants — realistic iPhone 16 Pro finishes + a TTI
   maroon for marketing surfaces. */
.tux-mobile-frame--ios-natural { --frame-body: oklch(0.45 0.012 80); }
.tux-mobile-frame--ios-black   { --frame-body: oklch(0.22 0.005 250); }
.tux-mobile-frame--ios-white   { --frame-body: oklch(0.88 0.005 250); }
.tux-mobile-frame--ios-maroon  { --frame-body: var(--brand-primary); }

/* Android color variants — Pixel 9 finishes + TTI maroon. */
.tux-mobile-frame--android-obsidian  { --frame-body: oklch(0.22 0.005 250); }
.tux-mobile-frame--android-porcelain { --frame-body: oklch(0.92 0.008 80); }
.tux-mobile-frame--android-hazel     { --frame-body: oklch(0.52 0.022 120); }
.tux-mobile-frame--android-maroon    { --frame-body: var(--brand-primary); }

.tux-mobile-frame__screen {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--surface-raised);
  overflow: hidden;
  isolation: isolate;
}

/* Side buttons — thin pills protruding from device edges. */
.tux-mobile-frame__btn {
  position: absolute;
  background: color-mix(in srgb, var(--frame-body) 85%, black);
  border-radius: 1px;
}
.tux-mobile-frame__btn--ios-silent   { left: -1px; top: 12%; width: 3px; height: 24px; }
.tux-mobile-frame__btn--ios-vol-up   { left: -2px; top: 18%; width: 4px; height: 40px; }
.tux-mobile-frame__btn--ios-vol-down { left: -2px; top: 27%; width: 4px; height: 40px; }
.tux-mobile-frame__btn--ios-power    { right: -2px; top: 22%; width: 4px; height: 60px; }
.tux-mobile-frame__btn--android-power{ right: -2px; top: 20%; width: 4px; height: 50px; }
.tux-mobile-frame__btn--android-vol  { right: -2px; top: 32%; width: 4px; height: 70px; }

/* Cutouts */
.tux-mobile-frame__island {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: oklch(0.08 0.002 0);
  z-index: 2;
}
.tux-mobile-frame__camera {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 9999px;
  background: oklch(0.08 0.002 0);
  z-index: 2;
}

/* Status bar — shared layout; per-platform tweaks for font weight. */
.tux-mobile-frame__statusbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-sans);
  color: var(--text-primary);
  z-index: 3;
  pointer-events: none;
}
.tux-mobile-frame__statusbar--ios {
  font-size: 0.875rem;
  font-weight: 600;
}
.tux-mobile-frame__statusbar--android {
  font-size: 0.75rem;
  font-weight: 500;
}
.tux-mobile-frame__statusbar-time {
  font-variant-numeric: tabular-nums;
}
.tux-mobile-frame__statusbar-icons {
  display: inline-flex;
  align-items: center;
  color: var(--text-primary);
}

.tux-mobile-frame__content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tux-mobile-frame__content :deep(> *) {
  width: 100%;
}
.tux-mobile-frame__content :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Nav indicators */
.tux-mobile-frame__home-indicator,
.tux-mobile-frame__nav-gesture {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--text-primary) 75%, transparent);
  z-index: 3;
}

.tux-mobile-frame__nav-three {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--surface-raised) 88%, var(--surface-sunken));
  border-top: 1px solid var(--surface-border);
  color: var(--text-secondary);
  z-index: 3;
}
.tux-mobile-frame__nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
