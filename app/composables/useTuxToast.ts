/**
 * useTuxToast — the suite's transient-notification bus.
 *
 * Owns its own item state (rendered by a single `<TuxStatusToast>` host
 * mounted in the app shell) rather than piggybacking Nuxt UI's toaster,
 * so tux controls the live-region semantics, the motion signature, and
 * the Tauri escalation without fighting UApp's built-in `<Toaster>`.
 * Migration from Nuxt UI is a rename: `useToast().add({ title,
 * description, color })` → `useTuxToast().show({ title, description,
 * tone })`, or use the tone shortcuts.
 *
 * Tauri escalation (design/tauri-bindings.md §TuxStatusToast): when the
 * window is hidden/unfocused inside a Tauri shell, the toast ALSO fires
 * an OS notification via `@tauri-apps/plugin-notification` — guarded
 * dynamic import, capability-optional, silent no-op on plain web or
 * when the plugin/permission is absent. The in-page toast always
 * renders regardless.
 */

export type TuxToastTone = "info" | "success" | "warning" | "error";

export interface TuxToastAction {
  label: string;
  onClick: () => void;
}

export interface TuxToastOptions {
  title: string;
  description?: string;
  tone?: TuxToastTone;
  /** ms before auto-dismiss. Errors default sticky (0 = no auto-dismiss). */
  duration?: number;
  action?: TuxToastAction;
}

export interface TuxToastItem extends Required<Pick<TuxToastOptions, "title" | "tone">> {
  id: number;
  description?: string;
  duration: number;
  action?: TuxToastAction;
}

let nextId = 1;

/** Dynamic, guarded OS-notification escalation — never a static import. */
async function escalateToOs(item: TuxToastItem) {
  try {
    if (typeof document === "undefined") return;
    const hidden = document.hidden || !document.hasFocus();
    if (!hidden) return;
    const platform = useTuxPlatform();
    if (!platform.value.tauri) return;
    const specifier = ["@tauri-apps", "plugin-notification"].join("/");
    const mod = await import(/* @vite-ignore */ specifier);
    let granted = await mod.isPermissionGranted();
    if (!granted) granted = (await mod.requestPermission()) === "granted";
    if (granted) {
      mod.sendNotification({ title: item.title, body: item.description });
    }
  } catch {
    // Plugin not installed / capability not granted — in-page toast stands alone.
  }
}

export function useTuxToast() {
  const items = useState<TuxToastItem[]>("tux-toasts", () => []);

  function dismiss(id: number) {
    items.value = items.value.filter((t) => t.id !== id);
  }

  function clear() {
    items.value = [];
  }

  function show(opts: TuxToastOptions): number {
    const tone = opts.tone ?? "info";
    const item: TuxToastItem = {
      id: nextId++,
      title: opts.title,
      description: opts.description,
      tone,
      // Errors stick around until dismissed; everything else auto-clears.
      duration: opts.duration ?? (tone === "error" ? 0 : 5000),
      action: opts.action,
    };
    items.value = [...items.value, item];
    if (item.duration > 0 && typeof window !== "undefined") {
      window.setTimeout(() => dismiss(item.id), item.duration);
    }
    void escalateToOs(item);
    return item.id;
  }

  return {
    /** Render-side state — consumed by the TuxStatusToast host. */
    items,
    show,
    dismiss,
    clear,
    info: (title: string, description?: string) => show({ title, description, tone: "info" }),
    success: (title: string, description?: string) => show({ title, description, tone: "success" }),
    warning: (title: string, description?: string) => show({ title, description, tone: "warning" }),
    error: (title: string, description?: string) => show({ title, description, tone: "error" }),
  };
}
