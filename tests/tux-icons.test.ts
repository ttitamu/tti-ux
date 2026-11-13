/**
 * TUX's own icons (`tux:`, app/assets/icons/tux): the few that are not Lucide's (#253).
 *
 * The layer reads the SVG files; other consumers (a sprite, a plain-HTML page) read tux-icons.json.
 * The two must hold the same drawings, each icon must draw in currentColor, and the licence of the
 * set they come from travels with them.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const DIR = join(process.cwd(), "app/assets/icons/tux");
const collection = JSON.parse(readFileSync(join(DIR, "tux-icons.json"), "utf8"));
const svgs = readdirSync(DIR).filter((f) => f.endsWith(".svg"));
const inner = (svg: string) => /^<svg[^>]*viewBox="0 0 24 24"[^>]*>([\s\S]*)<\/svg>\s*$/.exec(svg)?.[1];

describe("TUX icons (tux:)", () => {
  it("holds the accessibility icon and its active form", () => {
    expect(Object.keys(collection.icons).sort()).toEqual(["accessibility", "accessibility-active"]);
    expect(collection.prefix).toBe("tux");
  });

  it("keeps each SVG file and the Iconify collection in step", () => {
    expect(svgs.map((f) => f.replace(/\.svg$/, "")).sort()).toEqual(Object.keys(collection.icons).sort());
    for (const f of svgs) {
      const body = inner(readFileSync(join(DIR, f), "utf8"));
      expect(body, f).toBe(collection.icons[f.replace(/\.svg$/, "")].body);
    }
  });

  it("draws in currentColor only, so an icon takes its text's colour in every theme", () => {
    for (const { body } of Object.values<{ body: string }>(collection.icons)) {
      const colours = [...body.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1]);
      expect(colours.length).toBeGreaterThan(0);
      for (const c of colours) expect(["currentColor", "none"]).toContain(c);
    }
    // the active form is filled: it differs from the rest form by its shape, not by colour alone
    expect(collection.icons["accessibility-active"].body).not.toMatch(/fill="none"/);
    expect(collection.icons.accessibility.body).toMatch(/fill="none"/);
  });

  it("carries the licence of the set it comes from", () => {
    expect(readFileSync(join(DIR, "LICENSE-tabler"), "utf8")).toMatch(/^MIT License[\s\S]*Paweł Kuna/);
    expect(collection.info.license.spdx).toBe("MIT");
  });

  it("is registered as the layer's tux collection", () => {
    const config = readFileSync(join(process.cwd(), "nuxt.config.ts"), "utf8");
    expect(config).toMatch(/customCollections: \[\{ prefix: "tux", dir: resolve\(layerDir, "app\/assets\/icons\/tux"\) \}\]/);
  });
});
