<script setup lang="ts">
/**
 * TuxAppFrame — custom Tauri-aware titlebar wrapper.
 *
 * Replaces the OS-drawn window decoration with a TUX-branded strip
 * that hosts platform-correct controls + brand surfaces (eyebrow /
 * display-face title / breadcrumbs / search slot / toolbar items).
 *
 * Composes one of three chrome variants per host:
 *
 *   - macOS / iPadOS — traffic lights (close / minimize / zoom) on the
 *     **left**, drag region across the rest of the strip, optional
 *     "title-toolbar unification" (one ~52px strip combining titlebar
 *     and toolbar — Tahoe's idiom).
 *   - Windows 11 — min / max / close on the **right** with the
 *     maximize button hover-triggering native snap-layouts (forwarded
 *     by Tauri Rust side via WM_NCHITTEST when decorations are off).
 *     ~32px tall.
 *   - Linux — defers to the host DE's server-side decorations by
 *     default; if Tauri runs `decorations: false`, render close-only
 *     top-right as a conservative fallback. Most GNOME / KDE users
 *     prefer server-side decorations and that's what they get.
 *
 * Plain-web fallback: when `useTuxPlatform().tauri === false`, the
 * frame still renders — but the controls are hidden and the strip
 * acts as a normal brand bar (eyebrow + title). Useful for testing.
 *
 * Slots (all optional):
 *
 *   #left     — anchored to the left edge after traffic-light area
 *               (or before min/max/close on Win/Linux). Typical: brand
 *               mark + product name.
 *   #center   — center of the strip. Typical: search input,
 *               breadcrumbs.
 *   #right    — anchored to the right edge before min/max/close area
 *               (or after Mac traffic lights). Typical: toolbar
 *               icons, user menu.
 *
 * The brand-layer / chrome-layer split lives in
 * `design/platform-awareness.md`. Read that doctrine before tuning.
 */
import { computed, onMounted, ref } from "vue";

interface Props {
  /** Optional title rendered if no `#center` slot is provided. */
  title?: string;
  /** Optional eyebrow above the title (small uppercase tracked label). */
  eyebrow?: string;
  /** Show the system accent color on focus rings for chrome controls.
   *  Brand maroon stays everywhere else. */
  useSystemAccent?: boolean;
  /** Opt into the macOS title-toolbar unification (one ~52px strip).
   *  Default true on Mac; ignored on other hosts. */
  unifiedToolbar?: boolean;
  /** Force the frame to render Tauri-style chrome even on plain web.
   *  Useful for the showcase route + screenshots. Default false. */
  forceChrome?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  eyebrow: undefined,
  useSystemAccent: false,
  unifiedToolbar: true,
  forceChrome: false,
});

const emit = defineEmits<{
  close: [];
  minimize: [];
  zoom: [];  // macOS: zoom (maximize / restore). Win/Linux: maximize.
}>();

const platform = useTuxPlatform();

const shouldRenderChrome = computed(() => props.forceChrome || platform.value.tauri);
const chromeClass = computed(() => {
  const os = platform.value.os;
  if (os === "mac" || os === "ios") return "tux-app-frame--mac";
  if (os === "win") return "tux-app-frame--win";
  if (os === "linux") return "tux-app-frame--linux";
  return "tux-app-frame--web";
});

// Best-effort Tauri window control invocation. We avoid a static
// `@tauri-apps/api` import to keep the component runtime-agnostic;
// the dynamic import gracefully no-ops in non-Tauri builds.
async function invokeWindow(action: "close" | "minimize" | "toggleMaximize") {
  emit(action === "toggleMaximize" ? "zoom" : action);
  if (!platform.value.tauri) return;
  try {
    const mod = await import(/* @vite-ignore */ "@tauri-apps/api/window");
    const win = mod.getCurrentWindow ? mod.getCurrentWindow() : (mod as Record<string, unknown>).appWindow;
    if (!win) return;
    const w = win as Record<string, () => Promise<void>>;
    if (action === "close" && w.close) await w.close();
    if (action === "minimize" && w.minimize) await w.minimize();
    if (action === "toggleMaximize" && w.toggleMaximize) await w.toggleMaximize();
  } catch {
    // Tauri not installed (e.g., dev-server preview); fall through.
  }
}

const isMaximized = ref(false);
onMounted(async () => {
  if (!platform.value.tauri) return;
  try {
    const mod = await import(/* @vite-ignore */ "@tauri-apps/api/window");
    const win = mod.getCurrentWindow ? mod.getCurrentWindow() : (mod as Record<string, unknown>).appWindow;
    if (!win) return;
    const w = win as Record<string, () => Promise<boolean>>;
    if (w.isMaximized) isMaximized.value = await w.isMaximized();
  } catch {
    // No-op.
  }
});
</script>

<template>
  <header
    class="tux-app-frame"
    :class="[chromeClass, { 'tux-app-frame--unified': platform.os === 'mac' && unifiedToolbar }]"
    data-tauri-drag-region
  >
    <!-- macOS: traffic lights on the left -->
    <div
      v-if="shouldRenderChrome && (platform.os === 'mac' || platform.os === 'ios')"
      class="tux-app-frame__controls tux-app-frame__controls--mac"
      data-tauri-drag-region="false"
    >
      <button
        type="button"
        class="tux-traffic-light tux-traffic-light--close"
        aria-label="Close window"
        @click="invokeWindow('close')"
      />
      <button
        type="button"
        class="tux-traffic-light tux-traffic-light--minimize"
        aria-label="Minimize window"
        @click="invokeWindow('minimize')"
      />
      <button
        type="button"
        class="tux-traffic-light tux-traffic-light--zoom"
        aria-label="Zoom window"
        @click="invokeWindow('toggleMaximize')"
      />
    </div>

    <!-- Optional left slot — brand / app name. After Mac traffic lights;
         before Win/Linux right-side controls. -->
    <div v-if="$slots.left || eyebrow || title" class="tux-app-frame__left" data-tauri-drag-region>
      <slot name="left">
        <div class="tux-app-frame__title-stack">
          <p v-if="eyebrow" class="tux-app-frame__eyebrow">{{ eyebrow }}</p>
          <p v-if="title" class="tux-app-frame__title">{{ title }}</p>
        </div>
      </slot>
    </div>

    <!-- Center slot — search, breadcrumbs. Stretches to fill. -->
    <div class="tux-app-frame__center" data-tauri-drag-region>
      <slot name="center" />
    </div>

    <!-- Right slot — toolbar items, user menu. Before Win/Linux
         controls; after on Mac. -->
    <div v-if="$slots.right" class="tux-app-frame__right" data-tauri-drag-region>
      <slot name="right" />
    </div>

    <!-- Windows / Linux: min / max / close on the right -->
    <div
      v-if="shouldRenderChrome && (platform.os === 'win' || platform.os === 'linux')"
      class="tux-app-frame__controls tux-app-frame__controls--right"
      data-tauri-drag-region="false"
    >
      <button
        v-if="platform.os === 'win'"
        type="button"
        class="tux-win-control"
        aria-label="Minimize window"
        @click="invokeWindow('minimize')"
      >
        <span aria-hidden="true">&#xE921;</span>
        <Icon name="lucide:minus" :size="14" />
      </button>
      <button
        v-if="platform.os === 'win'"
        type="button"
        class="tux-win-control"
        :aria-label="isMaximized ? 'Restore window' : 'Maximize window'"
        @click="invokeWindow('toggleMaximize')"
      >
        <Icon :name="isMaximized ? 'lucide:copy' : 'lucide:square'" :size="13" />
      </button>
      <button
        type="button"
        class="tux-win-control tux-win-control--close"
        aria-label="Close window"
        @click="invokeWindow('close')"
      >
        <Icon name="lucide:x" :size="14" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.tux-app-frame {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background: var(--surface-page);
  border-bottom: 1px solid var(--surface-border);
  user-select: none;
  /* Default web height — gets overridden per platform below. */
  height: 36px;
  padding-inline: 0.5rem;
}

.tux-app-frame__left,
.tux-app-frame__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tux-app-frame__center {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  justify-content: center;
}

.tux-app-frame__title-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.tux-app-frame__eyebrow {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.05em);
  color: var(--text-muted);
}

.tux-app-frame__title {
  font-family: var(--font-display, var(--font-sans));
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* ---- macOS chrome ---- */
.tux-app-frame--mac {
  height: 28px;
  padding-left: 78px; /* 12px (edge) + 3×(12+8) (lights+gaps) = 78px reserved */
  padding-right: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
}
.tux-app-frame--mac.tux-app-frame--unified {
  height: 52px;
}
.tux-app-frame__controls--mac {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}
.tux-app-frame--mac {
  position: relative;
}

.tux-traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 0.85;
  transition: opacity 120ms ease-out;
}
.tux-traffic-light--close { background: #ff5f57; }
.tux-traffic-light--minimize { background: #ffbd2e; }
.tux-traffic-light--zoom { background: #28c940; }
.tux-app-frame:hover .tux-traffic-light,
.tux-app-frame:focus-within .tux-traffic-light {
  opacity: 1;
}

/* ---- Windows 11 chrome ---- */
.tux-app-frame--win {
  height: 32px;
  padding-right: 0;
  font-family: "Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif;
}
.tux-app-frame__controls--right {
  display: flex;
  margin-left: auto;
}
.tux-win-control {
  width: 46px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 80ms ease-out;
}
.tux-win-control:hover {
  background: color-mix(in srgb, var(--text-primary) 8%, transparent);
}
.tux-win-control--close:hover {
  background: #e81123;
  color: #ffffff;
}

/* ---- Linux chrome (conservative close-only fallback) ---- */
.tux-app-frame--linux {
  height: 32px;
  padding-right: 0;
  font-family: Inter, "Ubuntu Sans", system-ui, sans-serif;
}
.tux-app-frame--linux .tux-win-control:first-child,
.tux-app-frame--linux .tux-win-control:nth-child(2) {
  /* Linux fallback shows close-only — Tauri Rust side usually owns
     min/max with server-side decorations. Hide the extras on Linux. */
  display: none;
}

/* ---- Web fallback ---- */
.tux-app-frame--web {
  height: 36px;
}

/* Reduced-transparency / reduced-motion polish */
@media (prefers-reduced-motion: reduce) {
  .tux-traffic-light,
  .tux-win-control {
    transition: none;
  }
}
</style>
