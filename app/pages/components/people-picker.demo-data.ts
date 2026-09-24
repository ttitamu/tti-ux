// Relative path (not `~/`) so this resolves the same whether tti-ux is
// built standalone or consumed as a Nuxt layer.
import type { TuxPerson } from "../../utils/tuxPeople";
import { tuxFilterPeople } from "../../utils/tuxPeople";

// Sibling demo data per ADR-0011 — the page's <script setup> stays plain
// JS; the `tone` literals need the TuxPerson type to narrow.
//
// The shape mirrors what the forge feeds TuxPeoplePicker: Forgejo's
// assignable users for a repo, each enriched with the person's Entra ID
// profile (display name in directory order, job title · department).
// People and titles are fictional.

/** Forgejo's default avatars are identicons; this stands in for a photo
 *  without shipping one (a 5×5 mirrored grid from the login). */
function identicon(login: string, hue: number): string {
  let h = 2166136261;
  for (const ch of login) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const cells: string[] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if ((h >>> (y * 3 + x)) & 1) {
        cells.push(`<rect x="${x * 10}" y="${y * 10}" width="10" height="10"/>`);
        if (x < 2) cells.push(`<rect x="${(4 - x) * 10}" y="${y * 10}" width="10" height="10"/>`);
      }
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 60 60">` +
    `<rect x="-5" y="-5" width="60" height="60" fill="hsl(${hue} 35% 92%)"/>` +
    `<g fill="hsl(${hue} 45% 38%)">${cells.join("")}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** The repo's assignable users (collaborators + team members). */
export const assignable: TuxPerson[] = [
  { id: "arojo", name: "Rojo, Alex", subtitle: "Student Technician · NET" },
  { id: "lnguyen", name: "Nguyen, Linh", subtitle: "Systems Administrator II · NIS", avatar: identicon("lnguyen", 200) },
  { id: "cokafor", name: "Okafor, Chidi", subtitle: "Software Applications Developer III · NIS" },
  { id: "jhollis", name: "Hollis, Jordan", subtitle: "Network Engineer · NET", avatar: identicon("jhollis", 25) },
  {
    id: "pnair",
    name: "Nair, Priya",
    subtitle: "IT Security Analyst · NIS",
    status: { label: "Out until Oct 6", tone: "muted" },
  },
  { id: "rdelgado", name: "Delgado, Ramona", subtitle: "Associate Research Scientist · Mobility" },
  { id: "spena", name: "Peña, Sofía", subtitle: "Program Manager · Transit Mobility" },
  // A photo URL that 404s — TuxAvatar falls back to initials.
  { id: "wchen", name: "Chen, Wei", subtitle: "Research Engineer · Roadway Safety", avatar: "/missing-photos/wchen.jpg" },
  // Entra enrichment missing (profile not synced yet): the login stands in.
  { id: "kpatel", name: "Patel, Kiran", subtitle: "@kpatel" },
  // Offboarded in Entra; the forge account lingers until the sync runs.
  {
    id: "bmorales",
    name: "Morales, Beto",
    subtitle: "Systems Analyst · NIS",
    status: { label: "Left TTI", tone: "neutral" },
    disabled: true,
  },
];

/** TTI people in the directory who cannot be assigned here yet. */
export const directoryOnly: TuxPerson[] = [
  {
    id: "tkaur",
    name: "Kaur, Tanvir",
    subtitle: "Graduate Research Assistant · Mobility",
    status: { label: "Needs access", tone: "warning" },
    disabled: true,
  },
  {
    id: "swhitaker",
    name: "Whitaker, Sam",
    subtitle: "Research Specialist · Freight Mobility",
    status: { label: "Needs access", tone: "warning" },
    disabled: true,
  },
  {
    id: "mvillarreal",
    name: "Villarreal, Marisol",
    subtitle: "Communications Specialist · Communications",
    status: { label: "Needs access", tone: "warning" },
    disabled: true,
  },
  {
    id: "obrandt",
    name: "Brandt, Oskar",
    subtitle: "Assistant Research Engineer · Freight Mobility",
    status: { label: "Needs access", tone: "warning" },
    disabled: true,
  },
];

const everyone = [...assignable, ...directoryOnly];

export function personById(id: string): TuxPerson | undefined {
  return everyone.find((p) => p.id === id);
}

/** A few people for the state demos: one of each shape. */
export const sample: TuxPerson[] = [
  assignable[0]!,
  assignable[1]!,
  directoryOnly[0]!,
  assignable[4]!,
];

/** The fake server: filters the repo (or the whole directory) after a
 *  delay, like the gateway's people search would. */
export function searchPeople(
  query: string,
  scope: "repo" | "directory",
  delayMs = 450,
): Promise<TuxPerson[]> {
  const pool = scope === "directory" ? everyone : assignable;
  return new Promise((resolve) => {
    setTimeout(() => resolve(tuxFilterPeople(pool, query)), delayMs);
  });
}
