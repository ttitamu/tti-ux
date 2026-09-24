/**
 * tuxPeople — the pure logic under TuxPeoplePicker: initials for
 * directory-order names, the local filter, the display order, and what
 * a pick does to the selection. Kept out of the SFC so it can be unit
 * tested without a DOM, and so a consumer that renders people elsewhere
 * (an assignee stack, a byline) derives initials the same way.
 *
 * TuxPeoplePicker imports these by relative path, never through Nuxt's
 * utils auto-import, so it works unchanged outside Nuxt (the forge island).
 *
 * Names arrive in Entra ID's directory order — "Rojo, Alex" — so the
 * first-two-words rule TuxAvatar applies on its own would give "RA".
 * `tuxPersonInitials` reads the comma: given name first, then family.
 */

export type TuxPersonTone = "info" | "success" | "warning" | "error" | "neutral" | "muted";

export interface TuxPerson {
  /** Stable id — the forge login. */
  id: string;
  /** Display name, usually directory order: "Rojo, Alex". */
  name: string;
  /** Second line: "Student Technician · NET", or "@login" when no profile. */
  subtitle?: string;
  /** Photo URL; initials when absent or broken. */
  avatar?: string;
  /** Short state label, e.g. { label: "Needs access", tone: "warning" }. */
  status?: { label: string; tone: TuxPersonTone };
  /** Shown but not selectable — `status` should say why. */
  disabled?: boolean;
}

/** Generational suffixes dropped before picking the family initial. */
const SUFFIX = /^(jr|sr|ii|iii|iv|v|phd|pe)\.?$/i;

function words(s: string): string[] {
  return s.split(/[\s,]+/).filter(Boolean);
}

function firstMark(word: string | undefined): string {
  if (!word) return "";
  const m = word.match(/[\p{L}\p{N}]/u);
  return m ? m[0].toUpperCase() : "";
}

/**
 * Initials for a display name.
 *   "Rojo, Alex"          → "AR"   (directory order: given, then family)
 *   "Rojo, Alex M. (TTI)" → "AR"   (middle names and parentheticals ignored)
 *   "Alex M. Rojo Jr."    → "AR"   (first + last word, suffix dropped)
 *   "Alex"                → "A"
 */
export function tuxPersonInitials(name: string): string {
  const clean = (name ?? "").replace(/\([^)]*\)/g, " ").trim();
  if (!clean) return "";
  const comma = clean.indexOf(",");
  if (comma > 0) {
    const family = words(clean.slice(0, comma));
    const given = words(clean.slice(comma + 1)).filter((w) => !SUFFIX.test(w));
    return firstMark(given[0]) + firstMark(family[0]);
  }
  let w = words(clean);
  if (w.length > 2) w = w.filter((x) => !SUFFIX.test(x));
  if (w.length === 1) return firstMark(w[0]);
  return firstMark(w[0]) + firstMark(w[w.length - 1]);
}

/** Case- and accent-insensitive form: "Peña" and "pena" compare equal. */
export function tuxFoldText(s: string): string {
  return (s ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * The local filter: every whitespace-separated query token must appear
 * somewhere in name, subtitle or login, so "alex rojo" finds "Rojo, Alex"
 * and "@arojo" finds the login. An empty query keeps everyone. Input
 * order is preserved (the consumer's order is the relevance order).
 */
export function tuxFilterPeople<T extends TuxPerson>(people: readonly T[], query: string): T[] {
  const tokens = words(tuxFoldText(query))
    .map((t) => t.replace(/^@+/, ""))
    .filter(Boolean);
  if (!tokens.length) return people.slice();
  return people.filter((p) => {
    const hay = tuxFoldText(`${p.name} ${p.subtitle ?? ""} ${p.id}`);
    return tokens.every((t) => hay.includes(t));
  });
}

/**
 * Display order: first occurrence of each id wins (a consumer merging
 * "current assignees" with "search results" will repeat people), then —
 * when `selectedFirst` — the selected people move to the top. The
 * partition is stable: within each group the input order is kept.
 */
export function tuxOrderPeople<T extends TuxPerson>(
  people: readonly T[],
  selectedIds: Iterable<string>,
  selectedFirst = true,
): T[] {
  const seen = new Set<string>();
  const unique = people.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  if (!selectedFirst) return unique;
  const selected = new Set(selectedIds);
  return [
    ...unique.filter((p) => selected.has(p.id)),
    ...unique.filter((p) => !selected.has(p.id)),
  ];
}

export interface TuxPeopleToggle {
  /** The selection after the pick. */
  next: string[];
  /** Every id whose state changed, in emit order. */
  changes: Array<[id: string, selected: boolean]>;
}

/**
 * What picking `id` does. Multiple: add or remove it. Single: a picked
 * person replaces the selection (the old one is reported deselected
 * first), and picking the selected person clears it.
 */
export function tuxTogglePerson(
  current: readonly string[],
  id: string,
  multiple: boolean,
): TuxPeopleToggle {
  if (current.includes(id)) {
    return { next: current.filter((x) => x !== id), changes: [[id, false]] };
  }
  if (multiple) return { next: [...current, id], changes: [[id, true]] };
  return {
    next: [id],
    changes: [...current.map((x): [string, boolean] => [x, false]), [id, true]],
  };
}
