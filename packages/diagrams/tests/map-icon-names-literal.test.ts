/**
 * Every icon the map draws is named in full in its source (`lucide:name`), never built at run time.
 * A host that ships only the icons it uses (a sprite generated from a list) finds them by reading the
 * source; a name built as "lucide:" + x is one no list can see, and it draws nothing there.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const APP = join(__dirname, "..", "app");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? files(join(dir, d.name)) : /\.(vue|ts)$/.test(d.name) ? [join(dir, d.name)] : [],
  );

describe("the map names its icons in full", () => {
  it("builds no icon name at run time", () => {
    for (const f of files(APP)) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/lucide:\$\{|["'`]lucide:["'`]\s*\+/);
    }
  });
});
