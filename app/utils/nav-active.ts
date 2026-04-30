// Active-state matching for nav primitives (TuxSiteNav, TuxDropdown,
// TuxMegaMenu, TuxDocsSidebar, …).
//
// The naive `route.path === item.to` check fails for two real-world
// link shapes consumers depend on:
//   - hash links     `/admin#fleet`  → `route.path` strips the hash
//   - query links    `/policies?tab=approvals` → ditto for the query
//
// Splitting the logic into a parsed target lets every nav primitive
// share the same matching rules and lets us reason about each segment
// independently. Two helpers cover the two distinct questions a nav
// primitive asks:
//   - `isExactActive`   — "is THIS specific item the active row?"
//                          (used by per-item highlights and ARIA-current)
//   - `isSectionActive` — "is the operator anywhere INSIDE this branch?"
//                          (used by section/trigger highlights)
//
// Keep this dependency-light: tests want to exercise the rules without
// pulling in vue-router. Callers pass `{ path, query, hash, fullPath }`.

import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from "vue-router";

/** Subset of `useRoute()` we actually compare against. Accepting a
 *  structural type instead of `RouteLocationNormalized` keeps tests
 *  trivial (plain object literal) and decouples this helper from
 *  vue-router's exact runtime shape. */
export type NavRoute =
  | RouteLocationNormalized
  | RouteLocationNormalizedLoaded
  | {
      path: string;
      hash?: string;
      query?: Record<string, string | (string | null)[] | null | undefined>;
      fullPath?: string;
    };

interface ParsedTarget {
  path: string;
  query: string;
  hash: string;
}

/** Split `to` into path, query, hash. Doesn't normalize — `?a=1&b=2`
 *  vs `?b=2&a=1` aren't compared as equal. Consumers that want order-
 *  insensitive query comparison can normalize before passing in; we
 *  haven't needed it yet (Tux* nav configs are author-supplied so the
 *  spelling matches the route the link goes to). */
function parseTarget(target: string): ParsedTarget {
  let rest = target;
  let hash = "";
  const hashIdx = rest.indexOf("#");
  if (hashIdx >= 0) {
    hash = rest.slice(hashIdx);
    rest = rest.slice(0, hashIdx);
  }
  let query = "";
  const queryIdx = rest.indexOf("?");
  if (queryIdx >= 0) {
    query = rest.slice(queryIdx);
    rest = rest.slice(0, queryIdx);
  }
  return { path: rest, query, hash };
}

/** Stringified query for `route.query` (object). Vue Router parses
 *  `?a=1&b=2` into `{a: "1", b: "2"}` — to compare against a target
 *  string like `"?a=1&b=2"`, we re-serialize. We use the same key
 *  order vue-router preserves (insertion order). */
function serializeRouteQuery(
  query: NavRoute["query"] | undefined,
): string {
  if (!query) return "";
  const entries: string[] = [];
  for (const [k, v] of Object.entries(query)) {
    if (v === null || v === undefined) {
      entries.push(encodeURIComponent(k));
    } else if (Array.isArray(v)) {
      for (const part of v) {
        if (part === null || part === undefined) {
          entries.push(encodeURIComponent(k));
        } else {
          entries.push(`${encodeURIComponent(k)}=${encodeURIComponent(part)}`);
        }
      }
    } else {
      entries.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }
  return entries.length ? "?" + entries.join("&") : "";
}

/** Per-item active matching.
 *
 *  Rules (least-surprising version):
 *    - Target has a hash → match if path AND hash AND query all match.
 *      Two siblings under the same path with different hashes only
 *      light up on the matching one (`/admin#fleet` vs `/admin#tokens`).
 *    - Target has a query but no hash → match if path AND query match
 *      AND the route has no hash. (A bare `?tab=approvals` shouldn't
 *      claim the active state when the operator scrolled to a
 *      sub-anchor on that page.)
 *    - Target is a bare path → match if path matches AND the route
 *      has no hash AND no query. The "All policies" item with
 *      `to: "/policies"` shouldn't light up while the operator has a
 *      sibling filter (`?kind=placement`) applied.
 *
 *  The third rule is the one that prevents the "everything is
 *  highlighted on filtered pages" bug — operators consistently report
 *  this as confusing.
 */
export function isExactActive(target: string, route: NavRoute): boolean {
  if (!target) return false;
  const parsed = parseTarget(target);
  if (route.path !== parsed.path) return false;

  const routeHash = route.hash ?? "";
  const routeQuery = serializeRouteQuery(route.query);

  if (parsed.hash) {
    return routeHash === parsed.hash && routeQuery === parsed.query;
  }
  if (parsed.query) {
    return routeQuery === parsed.query && !routeHash;
  }
  return !routeHash && !routeQuery;
}

/** Section/trigger active matching — lighter than `isExactActive`.
 *
 *  Only the path segment matters. The operator is "inside Govern" no
 *  matter which `?tab=` or `#anchor` they're on. A target's query/hash
 *  is stripped before comparison.
 *
 *  Match if the route path equals the target path OR is a strict
 *  descendant (`/policies/123` while target is `/policies`). The strict-
 *  descendant check skips the root `/` to avoid matching every page.
 */
export function isSectionActive(target: string, route: NavRoute): boolean {
  if (!target) return false;
  const { path } = parseTarget(target);
  if (!path) return false;
  if (route.path === path) return true;
  if (path === "/") return false;
  return route.path.startsWith(path + "/");
}
