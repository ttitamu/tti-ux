// The registry publish rules (scripts/publish-registry.mjs): which tags publish,
// which dist-tag a version gets, and what the published manifest may carry.
import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { checkReact, checkSublayer, DIST_TAG_RE, distTagFor, normalise, PublishError, SUBLAYERS, TAG_RE } from "../scripts/publish-registry.mjs";

function expectDie(fn, message) {
  expect(fn).toThrow(PublishError);
  expect(fn).toThrow(message);
}

describe("release tags", () => {
  it("accepts v<semver> with an optional prerelease", () => {
    for (const t of ["v1.6.0", "v3.1.0", "v2.3.0-work-surface.0", "v3.1.1-vision.0", "v4.0.0-rc.1"]) {
      expect(TAG_RE.test(t), t).toBe(true);
    }
  });
  it("rejects anything else", () => {
    for (const t of ["3.1.0", "v3.1", "v03.1.0", "v3.1.0+build.5", "v3.1.0-", "latest", "v3.1.0\nX=1"]) {
      expect(TAG_RE.test(t), JSON.stringify(t)).toBe(false);
    }
  });
});

describe("dist-tags", () => {
  it("moves latest only forwards", () => {
    expect(distTagFor("3.1.0", undefined, "2.0.0")).toBe("latest");
    expect(distTagFor("2.0.0", undefined, undefined)).toBe("latest");
    expect(distTagFor("1.7.0", undefined, "2.0.0")).toBe("backfill");
    expect(distTagFor("2.0.0", undefined, "2.0.0")).toBe("backfill");
  });
  it("sends a prerelease to its first word, else to next", () => {
    expect(distTagFor("2.3.0-work-surface.0", "work-surface.0", "2.0.0")).toBe("work-surface");
    expect(distTagFor("3.1.1-vision.0", "vision.0", "2.0.0")).toBe("vision");
    expect(distTagFor("4.0.0-0", "0", "3.1.0")).toBe("next");
    expect(distTagFor("4.0.0-rc1.2", "rc1.2", "3.1.0")).toBe("next");
  });
  it("never lets a prerelease take latest or backfill (latest could then move backwards)", () => {
    expect(distTagFor("4.0.0-latest.1", "latest.1", "3.1.0")).toBe("next");
    expect(distTagFor("4.0.0-backfill.1", "backfill.1", "3.1.0")).toBe("next");
  });
  it("never yields a tag the forge refuses (no digits: go-version would read it as a version)", () => {
    for (const t of ["latest", "backfill", "next", "work-surface", "vision"]) expect(DIST_TAG_RE.test(t), t).toBe(true);
    for (const t of ["release-1.x", "v1-line", "1.7", "Rc"]) expect(DIST_TAG_RE.test(t), t).toBe(false);
  });
});

describe("the published manifest", () => {
  it("drops the dev-only nuxt prepare postinstall", () => {
    const pkg = { name: "@tti/tti-ux", version: "3.1.0", scripts: { postinstall: "nuxt prepare || exit 0", build: "nuxt build" } };
    const notes = normalise(pkg, "3.1.0");
    expect(pkg.scripts).toEqual({ build: "nuxt build" });
    expect(notes.join(" ")).toMatch(/dropped postinstall/);
  });
  it("puts a v1 tag under the scope and lifts its private flag", () => {
    const pkg = { name: "tti-ux", version: "1.6.0", private: true, scripts: { postinstall: "nuxt prepare" } };
    normalise(pkg, "1.6.0");
    expect(pkg).toEqual({ name: "@tti/tti-ux", version: "1.6.0", scripts: {} });
  });
  it("refuses the unscoped name or private from 2.0.0 on", () => {
    expectDie(() => normalise({ name: "tti-ux", version: "2.0.0" }, "2.0.0"), 'package.json name is "tti-ux"');
    expectDie(() => normalise({ name: "@tti/tti-ux", version: "3.0.0", private: true }, "3.0.0"), "private: true");
  });
  it("refuses any other install script", () => {
    expectDie(() => normalise({ name: "@tti/tti-ux", version: "3.2.0", scripts: { postinstall: "node fetch.js" } }, "3.2.0"),
      "refusing to publish an install script");
    expectDie(() => normalise({ name: "@tti/tti-ux", version: "3.2.0", scripts: { preinstall: "nuxt prepare" } }, "3.2.0"),
      "refusing to publish an install script: preinstall");
  });
});

describe("the React ports' manifest", () => {
  const ok = { name: "@tti/tti-ux-react", version: "3.2.0", scripts: { build: "tsc -p tsconfig.build.json", prepublishOnly: "npm run build" } };
  it("passes when version-locked and free of install scripts", () => {
    expect(checkReact(structuredClone(ok), "3.2.0")).toEqual([]);
  });
  it("refuses another name, another version, private, or an install script", () => {
    expectDie(() => checkReact({ ...ok, name: "@tti/tti-ux" }, "3.2.0"), 'expected "@tti/tti-ux-react"');
    expectDie(() => checkReact(structuredClone(ok), "3.2.1"), "is not 3.2.1");
    expectDie(() => checkReact({ ...ok, private: true }, "3.2.0"), "private: true");
    expectDie(() => checkReact({ ...ok, scripts: { postinstall: "nuxt prepare" } }, "3.2.0"), "refusing to publish an install script");
  });
});

describe("the sub-layers' manifests", () => {
  // 3.4.1's contract, the one scripts/check-layer-imports.mjs enforces: every
  // sub-layer is a dependency of the layer at its own version (3.4.0's optional
  // peers installed nothing), and every sub-layer workspace is version-locked.
  it("names every packages/<sub> layer workspace, each a dependency of the layer at its version", () => {
    const root = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    const layerDirs = readdirSync(new URL("../packages/", import.meta.url))
      .filter((d) => existsSync(new URL(`../packages/${d}/nuxt.config.ts`, import.meta.url))).sort();
    expect(SUBLAYERS.map(([sub]) => sub).sort()).toEqual(layerDirs);
    for (const [sub, name] of SUBLAYERS) {
      const pkg = JSON.parse(readFileSync(new URL(`../packages/${sub}/package.json`, import.meta.url), "utf8"));
      expect(pkg.name, sub).toBe(name);
      expect(pkg.version, sub).toBe(root.version);
      expect(root.dependencies?.[name], name).toBe(root.version);
      expect(root.peerDependencies?.[name], `${name} as a peer`).toBeUndefined();
    }
  });
  const fix = checkSublayer("@tti/tti-ux-charts", "packages/charts");
  it("passes when version-locked, and drops a dev-only nuxt prepare postinstall", () => {
    const pkg = { name: "@tti/tti-ux-charts", version: "3.4.0", scripts: { test: "vitest run", postinstall: "nuxt prepare || exit 0" } };
    expect(fix(pkg, "3.4.0").join(" ")).toMatch(/dropped postinstall/);
    expect(pkg.scripts).toEqual({ test: "vitest run" });
  });
  it("refuses another name, another version, private, or an install script", () => {
    expectDie(() => fix({ name: "@tti/tti-ux-code", version: "3.4.0" }, "3.4.0"), 'name is "@tti/tti-ux-code"');
    expectDie(() => fix({ name: "@tti/tti-ux-charts", version: "3.3.0" }, "3.4.0"), "version 3.3.0 is not 3.4.0");
    expectDie(() => fix({ name: "@tti/tti-ux-charts", version: "3.4.0", private: true }, "3.4.0"), "private: true");
    expectDie(() => fix({ name: "@tti/tti-ux-charts", version: "3.4.0", scripts: { install: "node x" } }, "3.4.0"), "install script");
  });
});
