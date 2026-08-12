/**
 * useTuxPersistedRef — a ref persisted to local/sessionStorage,
 * SSR-safe by construction: the server (and the client's first paint)
 * render the default; the stored value loads onMounted, exactly the
 * discipline the hand-rolled sites already followed — reading storage
 * during setup would hydration-mismatch.
 *
 * This is the tux-owned equivalent of VueUse's useStorage
 * (owner-decided 2026-08-12: own the ~40 lines instead of shipping
 * @vueuse/* to every consumer). The `serializer` option exists so
 * migrated components keep their exact wire format — e.g.
 * TuxAnnouncementBanner has been writing `"1"` flags to real users'
 * browsers since it shipped; changing the format would resurrect
 * every dismissed banner.
 */
import { onMounted, ref, watch, type Ref } from "vue";

export interface TuxPersistedRefOptions<T> {
  /** Which storage area. Default "local". */
  storage?: "local" | "session";
  /** Exact wire format control. Default JSON.stringify/parse. */
  serializer?: {
    read: (raw: string) => T;
    write: (value: T) => string;
  };
}

export function useTuxPersistedRef<T>(
  /** Getter so a missing key (e.g. an optional `id` prop) disables
   *  persistence cleanly instead of writing under "undefined". */
  key: () => string | null | undefined,
  defaultValue: T,
  options: TuxPersistedRefOptions<T> = {},
): Ref<T> {
  const value = ref(defaultValue) as Ref<T>;
  const serializer = options.serializer ?? {
    read: (raw: string) => JSON.parse(raw) as T,
    write: (v: T) => JSON.stringify(v),
  };

  function area(): Storage | null {
    // Touching window.*Storage can throw (SSR, disabled cookies,
    // some privacy modes) — treat every failure as "no persistence".
    try {
      if (typeof window === "undefined") return null;
      return options.storage === "session" ? window.sessionStorage : window.localStorage;
    } catch {
      return null;
    }
  }

  onMounted(() => {
    const k = key();
    const s = area();
    if (!k || !s) return;
    try {
      const raw = s.getItem(k);
      if (raw !== null) value.value = serializer.read(raw);
    } catch {
      // Unreadable or corrupt entry — keep the default.
    }
  });

  watch(
    value,
    (v) => {
      const k = key();
      const s = area();
      if (!k || !s) return;
      try {
        s.setItem(k, serializer.write(v));
      } catch {
        // Quota exceeded / unavailable — state stays session-only.
      }
    },
    { deep: true },
  );

  return value;
}
