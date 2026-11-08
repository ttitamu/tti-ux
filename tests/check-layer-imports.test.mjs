import { spawnSync } from "node:child_process";
import { basename, dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

describe("check-layer-imports", () => {
  it("accepts a relative root, as publish-package.yml passes it (#142)", () => {
    const repo = process.cwd();
    const run = spawnSync(process.execPath, [join(repo, "scripts/check-layer-imports.mjs"), basename(repo)], {
      cwd: dirname(repo),
      encoding: "utf8",
    });
    expect(run.stderr).toBe("");
    expect(run.status).toBe(0);
  });
});
