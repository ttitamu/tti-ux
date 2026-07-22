// useTuxPlatform — host-OS + Tauri detection for platform-adaptive chrome.
//
// Lifts the platform-awareness doctrine from `design/platform-awareness.md`
// into a runtime signal. Components that need to branch behavior by host
// (custom titlebar in TuxAppFrame, scrollbar styling in tux-scrollbar.css,
// modifier-key labels in TuxKbd, modal animation in TuxModal) read from
// this composable.
//
// Usage:
//
//   const platform = useTuxPlatform();
//   // platform.os: "mac" | "win" | "linux" | "ios" | "android" | "web"
//   // platform.tauri: boolean
//   // platform.primaryModifier: "meta" | "ctrl"
//   // platform.prefersOverlayScrollbars: boolean
//   // platform.accentColor: string | undefined  (system accent if known)
//
// Side effect: sets `document.documentElement.dataset.platform` on
// mount so CSS can branch via `:root[data-platform="mac"] ...` without
// touching JS. Single source of truth for the whole app.
//
// SSR safety: detection runs post-hydration only. Server renders a
// neutral default (`os: "web"`, `tauri: false`, `primaryModifier:
// "ctrl"`), client swaps after mount. Components that need
// pre-render platform-correctness should accept the default and
// update in-place — same trade-off TuxKbd makes.
//
// Tauri detection: looks at `globalThis.__TAURI_INTERNALS__` and the
// `__TAURI_OS_PLUGIN_INTERNALS__` set by Tauri 2.x. No `@tauri-apps/api`
// import — keeps the composable runtime-agnostic so plain-web builds
// don't drag in a Tauri dependency.

export type TuxOS = "mac" | "win" | "linux" | "ios" | "android" | "web";

export interface TuxPlatform {
  /** Coarse OS family for chrome decisions. */
  os: TuxOS;
  /** Tauri runtime detected? If false, treat as plain web. */
  tauri: boolean;
  /** ⌘ vs Ctrl primary modifier. */
  primaryModifier: "meta" | "ctrl";
  /** True on macOS — scrollbars auto-hide and overlay content. Used by
   *  any UI that needs to reserve space differently. */
  prefersOverlayScrollbars: boolean;
  /** User-set system accent color from the OS, if exposed. Hex or named.
   *  TUX brand maroon stays the anchor; the system accent appears only
   *  in chrome focus rings on `TuxAppFrame`. */
  accentColor?: string;
  /** Hydrated yet? False during SSR + first paint; flips true after mount.
   *  Components can read this to defer decisions that need to be
   *  client-only. */
  ready: boolean;
}

const DEFAULT_STATE: TuxPlatform = {
  os: "web",
  tauri: false,
  primaryModifier: "ctrl",
  prefersOverlayScrollbars: false,
  accentColor: undefined,
  ready: false,
};

// Module-level reactive singleton — every call site sees the same state.
const state = ref<TuxPlatform>({ ...DEFAULT_STATE });

function detectOS(): TuxOS {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent || "";
  const platform = (navigator.platform || "").toLowerCase();

  // iPad on iPadOS 13+ reports as Mac; check for touch.
  if (/iphone|ipod/i.test(ua)) return "ios";
  if (/ipad/i.test(ua)) return "ios";
  if (
    platform === "macintel" &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  ) {
    return "ios";
  }
  if (/android/i.test(ua)) return "android";
  if (/mac/i.test(platform) || /mac/i.test(ua)) return "mac";
  if (/win/i.test(platform) || /win/i.test(ua)) return "win";
  if (/linux/i.test(platform) || /linux/i.test(ua)) return "linux";
  return "web";
}

function detectTauri(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.__TAURI_INTERNALS__ || w.__TAURI_OS_PLUGIN_INTERNALS__);
}

function detectAccentColor(): string | undefined {
  if (typeof window === "undefined") return undefined;
  // CSS `accent-color: AccentColor` reads the system accent on
  // modern browsers; reflect via computed style on a hidden element.
  try {
    const probe = document.createElement("span");
    probe.style.color = "AccentColor";
    probe.style.display = "none";
    document.body.appendChild(probe);
    const c = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    if (c && c !== "rgba(0, 0, 0, 0)" && c !== "rgb(0, 0, 0)") return c;
  } catch {
    // Headless / older browsers — ignore.
  }
  return undefined;
}

let initialized = false;

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const os = detectOS();
  const tauri = detectTauri();
  const primaryModifier = os === "mac" || os === "ios" ? "meta" : "ctrl";
  const prefersOverlayScrollbars = os === "mac" || os === "ios";
  const accentColor = detectAccentColor();

  state.value = {
    os,
    tauri,
    primaryModifier,
    prefersOverlayScrollbars,
    accentColor,
    ready: true,
  };

  // Set body / html attribute so CSS can branch.
  document.documentElement.dataset.platform = os;
  if (tauri) document.documentElement.dataset.tauri = "true";
}

export function useTuxPlatform(): Readonly<Ref<TuxPlatform>> {
  // Run once per client. Server-side calls just return the default.
  if (typeof window !== "undefined") {
    if (!initialized) {
      // Try to set as early as possible — onMounted is normally fine,
      // but components that mount synchronously may want the data right
      // after hydration. We run inline if window is available; the
      // `data-platform` attribute then exists before paint of the next
      // tick.
      initialize();
    }
  }
  return readonly(state);
}

// Internal — for testing & for components that need to force-refresh
// (e.g., user switches OS theme that changes accent color). Not exposed
// via the named export.
export function _refreshTuxPlatform() {
  initialized = false;
  initialize();
}
