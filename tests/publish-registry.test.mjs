// The registry publish rules (scripts/publish-registry.mjs): which tags publish,
// which dist-tag a version gets, and what the published manifest may carry.
import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { BETA_TAG, checkReact, checkSublayer, DIST_TAG_RE, distTagFor, normalise, PublishError, SUBLAYERS, TAG_RE, tagPlan } from "../scripts/publish-registry.mjs";

function expectDie(fn, message) {
  expect(fn).toThrow(PublishError);
  expect(fn).toThrow(message);
}

describe("release tags", () => {
  it("accepts v<semver> with an optional prerelease", () => {
    for (const t of ["v1.6.0", "v3.1.0", "v2.3.0-work-surface.0", "v3.1.1-vision.0", "v3.13.0-rc.1"]) {
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
    expect(distTagFor("3.2.0-0", "0", "3.1.0")).toBe("next");
    expect(distTagFor("3.2.0-rc1.2", "rc1.2", "3.1.0")).toBe("next");
  });
  it("never lets a prerelease take latest or backfill (latest could then move backwards)", () => {
    expect(distTagFor("3.2.0-latest.1", "latest.1", "3.1.0")).toBe("next");
    expect(distTagFor("3.2.0-backfill.1", "backfill.1", "3.1.0")).toBe("next");
  });
  it("never lets a prerelease take beta: beta names the newest release", () => {
    expect(distTagFor("3.2.0-beta.1", "beta.1", "3.1.0")).toBe("next");
  });
  it("never yields a tag the forge refuses (no digits: go-version would read it as a version)", () => {
    for (const t of ["latest", "backfill", "next", "work-surface", "vision", BETA_TAG]) expect(DIST_TAG_RE.test(t), t).toBe(true);
    for (const t of ["release-1.x", "v1-line", "1.7", "Rc"]) expect(DIST_TAG_RE.test(t), t).toBe(false);
  });
});

// TUX is beta: the version that holds "latest" holds "beta" too.
describe("the beta dist-tag", () => {
  const packument = (tags, versions) => ({ "dist-tags": tags, versions: Object.fromEntries(versions.map((v) => [v, {}])) });
  it("follows a publish that takes latest, on a first publish too", () => {
    expect(tagPlan("3.13.0", undefined, packument({ latest: "3.12.0" }, ["3.12.0"]))).toMatchObject({ publishTag: "latest", exists: false, moveBeta: true });
    expect(tagPlan("3.13.0", undefined, packument({ latest: "3.12.0", beta: "3.12.0" }, ["3.12.0"]))).toMatchObject({ publishTag: "latest", moveBeta: true, beta: "3.12.0" });
    expect(tagPlan("3.12.0", undefined, null)).toMatchObject({ publishTag: "latest", exists: false, moveBeta: true });
  });
  it("is not moved by a backfill or a prerelease", () => {
    expect(tagPlan("3.9.2", undefined, packument({ latest: "3.12.0", beta: "3.12.0" }, ["3.12.0"]))).toMatchObject({ publishTag: "backfill", moveBeta: false });
    expect(tagPlan("3.13.0-rc.1", "rc.1", packument({ latest: "3.12.0" }, ["3.12.0"]))).toMatchObject({ publishTag: "rc", moveBeta: false });
    expect(tagPlan("3.13.0-beta.1", "beta.1", packument({ latest: "3.12.0" }, ["3.12.0"]))).toMatchObject({ publishTag: "next", moveBeta: false });
  });
  it("is given to a release that already is latest, once, with nothing uploaded", () => {
    expect(tagPlan("3.12.0", undefined, packument({ latest: "3.12.0" }, ["3.11.0", "3.12.0"]))).toMatchObject({ exists: true, moveBeta: true });
    expect(tagPlan("3.12.0", undefined, packument({ latest: "3.12.0", beta: "3.11.0" }, ["3.11.0", "3.12.0"]))).toMatchObject({ exists: true, moveBeta: true });
    expect(tagPlan("3.12.0", undefined, packument({ latest: "3.12.0", beta: "3.12.0" }, ["3.11.0", "3.12.0"]))).toMatchObject({ exists: true, moveBeta: false });
  });
  it("is never moved back to an older published version", () => {
    expect(tagPlan("3.11.0", undefined, packument({ latest: "3.12.0" }, ["3.11.0", "3.12.0"]))).toMatchObject({ exists: true, moveBeta: false });
  });
});

// The script itself, --dry-run, against a registry that records every request: the beta step is
// announced and nothing but anonymous reads of the packument is sent.
describe("--dry-run", () => {
  const script = fileURLToPath(new URL("../scripts/publish-registry.mjs", import.meta.url));
  async function dryRun(packumentFor) {
    const seen = [];
    const server = createServer((req, res) => {
      seen.push(`${req.method} ${req.url}`);
      const body = req.method === "GET" ? packumentFor(decodeURIComponent(req.url)) : null;
      res.writeHead(body ? 200 : 404, { "content-type": "application/json" });
      res.end(JSON.stringify(body ?? {}));
    });
    await new Promise((done) => server.listen(0, "127.0.0.1", done));
    const dir = mkdtempSync(join(tmpdir(), "tux-publish-test-"));
    try {
      writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "@tti/tti-ux", version: "3.0.0", files: ["index.js"] }));
      writeFileSync(join(dir, "index.js"), "export {};\n");
      const env = { ...process.env, PUBLISH_TOKEN: "" };
      delete env.GITHUB_STEP_SUMMARY;
      const out = await new Promise((done, fail) => execFile(process.execPath,
        [script, "--dry-run", "--package", "layer", "--tag", "v3.0.0", "--pkg-dir", dir, "--registry", `http://127.0.0.1:${server.address().port}/npm/`],
        { env, encoding: "utf8" }, (err, stdout, stderr) => (err ? fail(new Error(`${err.message}\n${stdout}\n${stderr}`)) : done(stdout))));
      return { out, seen };
    } finally {
      rmSync(dir, { recursive: true, force: true });
      await new Promise((done) => server.close(done));
    }
  }
  it("says a new release would take latest and then beta, and sends nothing", async () => {
    const { out, seen } = await dryRun(() => null);
    expect(out).toMatch(/dry run: @tti\/tti-ux@3\.0\.0 stops before the upload; would publish with dist-tag "latest", then move dist-tag "beta" to it\. Nothing sent\./);
    expect(seen).toEqual(["GET /npm/%40tti%2Ftti-ux"]);
  });
  it("says a release that already is latest would be given beta, and sends nothing", async () => {
    const { out, seen } = await dryRun(() => ({ "dist-tags": { latest: "3.0.0" }, versions: { "3.0.0": { dist: { integrity: "sha512-other" } } } }));
    expect(out).toMatch(/dry run: @tti\/tti-ux@3\.0\.0 is "latest"; would move dist-tag "beta" to it \(now \(none\)\)\. Nothing sent\./);
    expect(seen).toEqual(["GET /npm/%40tti%2Ftti-ux"]);
  });
  it("leaves beta alone for a backfill", async () => {
    const { out, seen } = await dryRun(() => ({ "dist-tags": { latest: "3.1.0", beta: "3.1.0" }, versions: { "3.1.0": {} } }));
    expect(out).toMatch(/would publish with dist-tag "backfill", and leave dist-tag "beta" where it is\. Nothing sent\./);
    expect(seen).toEqual(["GET /npm/%40tti%2Ftti-ux"]);
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
