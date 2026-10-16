// The registry publish rules (scripts/publish-registry.mjs): which tags publish,
// which dist-tag a version gets, and what the published manifest may carry.
import { describe, expect, it } from "vitest";
import { DIST_TAG_RE, distTagFor, normalise, PublishError, TAG_RE } from "../scripts/publish-registry.mjs";

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
