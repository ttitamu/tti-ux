/**
 * useTuxClipboard — copy-to-clipboard with the "Copied" flash the
 * copy affordances share. Replaces three byte-similar hand-rolled
 * copies (TuxCodeBlock / TuxExample / TuxCitationExport), which each
 * leaked their reset setTimeout on unmount; this one clears it.
 *
 * Tux-owned equivalent of VueUse's useClipboard (owner-decided
 * 2026-08-12 — own the ~30 lines instead of shipping @vueuse/*).
 * `copiedKey` supports the keyed variant (a menu of copyable rows
 * where only the copied row shows the flash).
 */
import { onUnmounted, ref } from "vue";

export function useTuxClipboard(options: { resetAfterMs?: number } = {}) {
  const resetAfterMs = options.resetAfterMs ?? 1500;
  const copied = ref(false);
  const copiedKey = ref<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy(text: string, key?: string): Promise<boolean> {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (insecure context, permissions) —
      // report failure, show no flash.
      return false;
    }
    copied.value = true;
    copiedKey.value = key ?? null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      copied.value = false;
      copiedKey.value = null;
    }, resetAfterMs);
    return true;
  }

  onUnmounted(() => clearTimeout(timer));

  return { copied, copiedKey, copy };
}
