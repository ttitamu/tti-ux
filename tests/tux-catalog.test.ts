/**
 * Catalog↔filesystem↔docs invariants for the component registry.
 *
 * The catalog used to live in four hand-maintained lists (app.vue navTree,
 * /components index grid, design/components.md tables, and the homepage
 * count) and they drifted — 30 components missing from the index grid, 9
 * from the sidebar, 3 from the doc tables. app/utils/tuxCatalog.ts is now
 * the single source; this suite enforces that it and the estate it feeds
 * can never disagree again. Same doctrine as tests/useTuxApps.test.ts:
 * cross-surface consistency as a unit test, not a live-browser battery.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  INTERNAL_COMPONENTS,
  tuxCatalog,
  tuxComponentCount,
} from "../app/utils/tuxCatalog";
import { lucideIconNames } from "../app/utils/lucide-names";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const shippedComponents = readdirSync(join(ROOT, "app/components"))
  .filter((f) => f.endsWith(".vue"))
  .map((f) => f.replace(/\.vue$/, ""));
const shippedComposables = readdirSync(join(ROOT, "app/composables"))
  .filter((f) => f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""));

const catalogNames = tuxCatalog.map((e) => e.name);
const catalogComponents = tuxCatalog
  .filter((e) => e.kind === "component")
  .map((e) => e.name);

describe("tuxCatalog ↔ filesystem", () => {
  it("every shipped component has exactly one catalog entry or is explicitly internal", () => {
    const missing = shippedComponents.filter(
      (n) => !catalogNames.includes(n) && !INTERNAL_COMPONENTS.includes(n),
    );
    expect(missing).toEqual([]);
  });

  it("every catalogued name exists on disk (component .vue or composable .ts)", () => {
    const ghosts = tuxCatalog.filter((e) =>
      e.kind === "component"
        ? !shippedComponents.includes(e.name)
        : !shippedComposables.includes(e.name),
    );
    expect(ghosts.map((e) => e.name)).toEqual([]);
  });

  it("internal components never appear in the catalog", () => {
    expect(catalogNames.filter((n) => INTERNAL_COMPONENTS.includes(n))).toEqual([]);
  });

  it("has no duplicate entries", () => {
    expect(catalogNames.length).toBe(new Set(catalogNames).size);
  });

  it("tuxComponentCount matches the shipped, non-internal component census", () => {
    expect(tuxComponentCount).toBe(
      shippedComponents.length - INTERNAL_COMPONENTS.length,
    );
    expect(tuxComponentCount).toBe(catalogComponents.length);
  });
});

describe("tuxCatalog ↔ routes", () => {
  it("every catalog route resolves to a page file", () => {
    const broken = tuxCatalog.filter(
      (e) => !existsSync(join(ROOT, "app/pages", `${e.to.replace(/^\//, "")}.vue`)),
    );
    expect(broken.map((e) => `${e.name} → ${e.to}`)).toEqual([]);
  });
});

describe("tuxCatalog ↔ design/components.md", () => {
  const md = readFileSync(join(ROOT, "design/components.md"), "utf8");
  const mdNames = [
    ...new Set(
      [...md.matchAll(/^\| `((?:Tux|useTux)\w+)`/gm)].map((m) => m[1]),
    ),
  ];

  it("every catalog entry has a row in the components.md tables", () => {
    expect(catalogNames.filter((n) => !mdNames.includes(n))).toEqual([]);
  });

  it("every components.md row is catalogued, internal, or a shipped composable", () => {
    const unknown = mdNames.filter(
      (n) =>
        !catalogNames.includes(n) &&
        !INTERNAL_COMPONENTS.includes(n) &&
        !shippedComposables.includes(n),
    );
    expect(unknown).toEqual([]);
  });
});

describe("tuxCatalog entry quality", () => {
  it("every entry has a non-empty blurb", () => {
    expect(tuxCatalog.filter((e) => !e.blurb.trim()).map((e) => e.name)).toEqual([]);
  });

  it("every icon is a real lucide name", () => {
    const bad = tuxCatalog.filter(
      (e) => !lucideIconNames.includes(e.icon.replace(/^lucide:/, "")),
    );
    expect(bad.map((e) => `${e.name}: ${e.icon}`)).toEqual([]);
  });
});
