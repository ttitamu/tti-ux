/**
 * useTuxApps — the canonical app list for TuxAppSwitcher.
 *
 * Reads design/apps.json (the TTI Portals registry) and projects it into
 * `TuxAppSwitcherApp[]`, filtered for the caller's auth state. Suite
 * doctrine (design/compositions.md): the app list is NEVER hand-declared
 * in a consumer — every portal renders the same tiles in the same order,
 * because spatial constancy is the switcher's whole value.
 *
 * The registry ships PUBLIC metadata only. Entitlement filtering beyond
 * `audience` happens per portal, same-origin, via each portal's own
 * `my-apps` resolver (see the unification plan §2.2) — pass its result
 * as `entitled`.
 *
 * Audience semantics:
 *   - "public"        → always visible.
 *   - "authenticated" → visible when `signedIn` is true.
 *   - "entitled"      → visible when the portal's my-apps resolver
 *     grants it (`entitled` contains the id). Until a portal wires a
 *     resolver (`entitled` omitted / undefined), signed-in users see
 *     entitled apps too — Tier-0 behavior, honest because every
 *     destination enforces its own gate. Pass an explicit array (even
 *     empty) to enable real filtering.
 *
 * Usage:
 *   const { apps, heading, hiddenCount } = useTuxApps({
 *     current: "tux",
 *     signedIn: identity.value.authenticated,
 *     entitled: myApps.value,        // optional, Tier 1/2
 *   });
 *   <TuxAppSwitcher :apps="apps" :heading="heading" />
 */
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import type { TuxAppSwitcherApp } from "../components/TuxAppSwitcher.vue";
import registry from "../../design/apps.json";

export type TuxAppAudience = "public" | "authenticated" | "entitled";

export interface TuxRegistryApp {
  id: string;
  name: string;
  tagline?: string;
  icon: string;
  /** Reserved for a future product mark; Lucide `icon` is the fallback. */
  glyph?: string | null;
  /** Canonical destination. For kind:"desktop" this is the launcher
   *  interstitial URL — never a raw scheme. */
  url: string;
  /** Desktop transport only (fired by the launcher / native shells). */
  deepLink?: string;
  audience: TuxAppAudience;
  kind?: "web" | "desktop";
}

export interface UseTuxAppsOptions {
  /** Registry id of the app the user is currently in. */
  current?: MaybeRefOrGetter<string | undefined>;
  /** Whether the current user is signed in. Default false (anonymous). */
  signedIn?: MaybeRefOrGetter<boolean>;
  /** Ids granted by the portal's my-apps resolver. Omit for Tier-0
   *  behavior (signed-in users see `entitled` apps unfiltered). */
  entitled?: MaybeRefOrGetter<string[] | undefined>;
}

const REGISTRY_APPS = registry.apps as TuxRegistryApp[];

export function useTuxApps(options: UseTuxAppsOptions = {}) {
  const visible = computed<TuxAppSwitcherApp[]>(() => {
    const signedIn = toValue(options.signedIn) ?? false;
    const entitled = toValue(options.entitled);
    const current = toValue(options.current);

    return REGISTRY_APPS.filter((app) => {
      if (app.audience === "public") return true;
      if (!signedIn) return false;
      if (app.audience === "authenticated") return true;
      // audience === "entitled"
      return entitled === undefined || entitled.includes(app.id);
    }).map((app) => ({
      id: app.id,
      name: app.name,
      tagline: app.tagline,
      icon: app.icon,
      to: app.url,
      current: app.id === current || undefined,
      kind: app.kind,
    }));
  });

  const hiddenCount = computed(
    () => REGISTRY_APPS.length - visible.value.length,
  );

  /** Ready-made footerText for the filtered state, or undefined when
   *  nothing is hidden. */
  const footerText = computed(() => {
    if (hiddenCount.value === 0) return undefined;
    const shown = visible.value.length;
    const total = REGISTRY_APPS.length;
    const signedIn = toValue(options.signedIn) ?? false;
    return signedIn
      ? `Showing ${shown} of ${total} apps`
      : `Showing ${shown} of ${total} apps · Sign in to see all`;
  });

  return {
    apps: visible,
    heading: registry.heading as string,
    hiddenCount,
    footerText,
  };
}
