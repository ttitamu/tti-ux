#!/usr/bin/env node
/**
 * publish-registry.mjs — publish one tagged tux release to the forge's npm
 * registry: scope @tti, owner tti, https://code.tti.tamu.edu/api/packages/tti/npm/.
 *
 * Run by .forgejo/workflows/publish-package.yml (a tag push, or a dispatch that
 * names an existing tag). It packs the tree in --pkg-dir (a checkout of that
 * tag) and publishes the tarball, after three checks:
 *
 *   1. The tag names the version. "v<version>" must equal package.json's
 *      "version": a release commit sets the version, and the tag never
 *      overrides it.
 *   2. The package is @tti/tti-ux. Tags before v2.0.0 still say "tti-ux" (the
 *      scope arrived in 2.0.0). Those are published under the scope with only
 *      `name` rewritten, so the v1 consumers can leave their GitHub git pins
 *      without taking an upgrade; v1 also said `private: true` (it was only
 *      ever a git dependency), which is lifted for the same tags. Any other
 *      name, or `private` on 2.0.0 and later, stops the publish.
 *   3. The package runs nothing at install time. Every tag through 3.1.0 has
 *      `postinstall: nuxt prepare`, which prepares the layer's OWN .nuxt for
 *      working on tux itself. A consumer's `nuxt prepare` already covers the
 *      layer; the forge's packument never advertises scripts, so `npm ci` in a
 *      consumer never ran it anyway; and npm 12 blocks dependency install
 *      scripts by default. It is dropped from the published manifest (main runs
 *      it as `prepare`, which npm never runs for a registry dependency). Any
 *      other preinstall/install/postinstall stops the publish.
 *
 * The tarball is packed from the tag, unpacked, given the rewritten
 * package.json, and packed again, so the checkout is never modified and the
 * files are exactly what `files` selects at the tag.
 *
 * A version already on the registry is not published again (a registry never
 * overwrites one): the run prints both integrities and exits 0.
 *
 * dist-tags: a stable version above the current "latest" becomes "latest"; an
 * older stable version (a backfill) goes to "backfill", so "latest" never moves
 * backwards; a prerelease goes to its first identifier when that is a word
 * ("work-surface" for 2.3.0-work-surface.0), else to "next". Forgejo refuses a
 * dist-tag that hashicorp/go-version can read as a version, which is any name
 * with a digit in it ("release-1.x", "v1-line"), and it refuses it only AFTER
 * storing the version, so the tag is checked here first: letters and hyphens.
 *
 * Usage:
 *   node scripts/publish-registry.mjs --tag v3.1.0 --pkg-dir <checkout> \
 *     --registry https://code.tti.tamu.edu/api/packages/tti/npm/ [--dry-run]
 *
 * The token comes from the environment, PUBLISH_TOKEN: a write:package token
 * of the Entra service account that publishes (svc-tti-packages), never a
 * person's. --dry-run needs none, reads the registry anonymously, and stops
 * before the upload.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync, chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SCOPED_NAME = "@tti/tti-ux";
const LEGACY_NAME = "tti-ux";
const INSTALL_HOOKS = ["preinstall", "install", "postinstall"];
// The one install script tux has ever shipped, and why it may go: see header, check 3.
const DEV_ONLY_POSTINSTALL = /^nuxt prepare( \|\| exit 0)?$/;
const DIST_TAG_RE = /^[a-z][a-z-]*$/;
const TAG_RE = /^v((0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?)$/;

// Thrown, not exited: the cleanup in main()'s finally must run, since the temp dir holds the
// token's userconfig once the upload starts. Only the entry point turns it into an exit status.
class PublishError extends Error {}
function die(msg) {
  throw new PublishError(msg);
}

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--tag" || a === "--pkg-dir" || a === "--registry") {
      if (i + 1 >= argv.length) die(`${a} needs a value`);
      out[a.slice(2).replace("-d", "D")] = argv[++i];
    } else die(`unknown argument: ${a}`);
  }
  for (const k of ["tag", "pkgDir", "registry"]) if (!out[k]) die(`missing --${k === "pkgDir" ? "pkg-dir" : k}`);
  if (!/^https?:\/\/[^/]+\/.*\/$/.test(out.registry)) die(`--registry must be an http(s) URL ending in "/": ${out.registry}`);
  return out;
}

// Stable versions only: a prerelease never becomes "latest", so it is never compared.
function cmpStable(a, b) {
  const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}

function distTagFor(version, prerelease, latest) {
  if (prerelease) {
    const first = prerelease.split(".")[0];
    return DIST_TAG_RE.test(first) ? first : "next";
  }
  if (!latest || latest.includes("-") || cmpStable(version, latest) > 0) return "latest";
  return "backfill";
}

function normalise(pkg, version) {
  const notes = [];
  if (pkg.name !== SCOPED_NAME) {
    if (pkg.name === LEGACY_NAME && Number(version.split(".")[0]) < 2) {
      pkg.name = SCOPED_NAME;
      notes.push(`name "${LEGACY_NAME}" -> "${SCOPED_NAME}" (the scope arrived in 2.0.0)`);
      // The v1 line was consumed only as a git dependency, and said so with private: true.
      if (pkg.private) {
        delete pkg.private;
        notes.push("dropped private: true (v1 was consumed only as a git dependency)");
      }
    } else die(`package.json name is "${pkg.name}", expected "${SCOPED_NAME}"`);
  }
  if (pkg.private) die("package.json says private: true");
  const scripts = pkg.scripts || {};
  for (const hook of INSTALL_HOOKS) {
    if (!(hook in scripts)) continue;
    if (hook === "postinstall" && DEV_ONLY_POSTINSTALL.test(scripts[hook])) {
      notes.push(`dropped postinstall "${scripts[hook]}" (dev-only; consumers run their own nuxt prepare)`);
      delete scripts[hook];
    } else die(`refusing to publish an install script: ${hook}: ${JSON.stringify(scripts[hook])}`);
  }
  return notes;
}

function npm(args, opts = {}) {
  return execFileSync("npm", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], ...opts });
}

// `npm pack` into destDir; returns the tarball's path. `--json` is an array on npm 11 and an
// object keyed by package name on npm 12.
function pack(dir, destDir) {
  const out = JSON.parse(npm(["pack", "--json", "--ignore-scripts", "--pack-destination", destDir], { cwd: dir }));
  const entries = Array.isArray(out) ? out : Object.values(out);
  if (entries.length !== 1 || !entries[0].filename) die(`npm pack in ${dir} did not report one tarball`);
  return join(destDir, entries[0].filename);
}

async function getPackument(registry) {
  const url = registry + encodeURIComponent(SCOPED_NAME);
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (res.status === 404) return null;
  if (!res.ok) die(`GET ${url}: HTTP ${res.status}`);
  return res.json();
}

function summary(lines) {
  const f = process.env.GITHUB_STEP_SUMMARY;
  if (f) appendFileSync(f, lines.join("\n") + "\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const m = TAG_RE.exec(args.tag);
  if (!m) die(`not a release tag: ${args.tag} (want v<major>.<minor>.<patch>[-<prerelease>])`);
  const version = m[1], prerelease = m[5];

  const pkgDir = resolve(args.pkgDir);
  const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  if (pkg.version !== version) die(`tag ${args.tag} != package.json version ${pkg.version}: tag the release commit that sets ${version}`);

  const work = mkdtempSync(join(tmpdir(), "tux-publish-"));
  try {
    // Pack the tag as-is, unpack it, rewrite only package.json, pack again.
    const first = pack(pkgDir, work);
    const stage = join(work, "stage");
    mkdirSync(stage);
    execFileSync("tar", ["-xzf", first, "-C", stage]);
    const stagedDir = join(stage, "package");
    const staged = JSON.parse(readFileSync(join(stagedDir, "package.json"), "utf8"));
    const notes = normalise(staged, version);
    writeFileSync(join(stagedDir, "package.json"), JSON.stringify(staged, null, 2) + "\n");
    const outDir = join(work, "out");
    mkdirSync(outDir);
    const tgz = pack(stagedDir, outDir);

    // The final tarball's own manifest is the one consumers get: check it, not our copy.
    const shipped = JSON.parse(execFileSync("tar", ["-xzOf", tgz, "package/package.json"], { encoding: "utf8" }));
    if (shipped.name !== SCOPED_NAME || shipped.version !== version) die("repacked tarball has the wrong name/version");
    const left = INSTALL_HOOKS.filter((h) => shipped.scripts && h in shipped.scripts);
    if (left.length) die(`repacked tarball still has install scripts: ${left.join(", ")}`);
    const bytes = readFileSync(tgz);
    const integrity = "sha512-" + createHash("sha512").update(bytes).digest("base64");
    const files = execFileSync("tar", ["-tzf", tgz], { encoding: "utf8" }).trim().split("\n").length;

    const packument = await getPackument(args.registry);
    const latest = packument?.["dist-tags"]?.latest;
    const distTag = distTagFor(version, prerelease, latest);
    if (!DIST_TAG_RE.test(distTag)) die(`dist-tag "${distTag}" would be refused by the registry (letters and hyphens only)`);
    console.log(`${SCOPED_NAME}@${version} from ${args.tag}: ${files} files, ${bytes.length} bytes, ${integrity}`);
    for (const n of notes) console.log(`  manifest: ${n}`);
    console.log(`  registry ${args.registry} latest=${latest ?? "(none)"} -> dist-tag "${distTag}"`);

    const existing = packument?.versions?.[version];
    if (existing) {
      const same = existing.dist?.integrity === integrity;
      console.log(`::notice::${SCOPED_NAME}@${version} is already on the registry (${existing.dist?.integrity}); `
        + (same ? "identical tarball, nothing to do." : "this pack differs, and a published version is never overwritten."));
      summary([`### ${SCOPED_NAME}@${version}`, "", `Already published; ${same ? "identical" : "this pack differs"}. Nothing uploaded.`]);
      return;
    }
    if (args.dryRun) {
      console.log("dry run: stopping before the upload");
      return;
    }

    const token = process.env.PUBLISH_TOKEN;
    if (!token) die("PUBLISH_TOKEN is not set (the publishing service account's write:package token)");
    // Auth goes in a throwaway userconfig (0600), keyed to the registry's host+path, and the
    // publish runs from the temp dir, so no project .npmrc or publishConfig can redirect it.
    const userconfig = join(work, "npmrc");
    writeFileSync(userconfig, `//${args.registry.replace(/^https?:\/\//, "")}:_authToken=${token}\n`, { mode: 0o600 });
    chmodSync(userconfig, 0o600);
    npm(["publish", tgz, "--tag", distTag, "--registry", args.registry, `--@tti:registry=${args.registry}`,
      "--userconfig", userconfig, "--ignore-scripts"], { cwd: work, stdio: ["ignore", "inherit", "inherit"] });

    const after = await getPackument(args.registry);
    const got = after?.versions?.[version]?.dist?.integrity;
    if (got !== integrity) die(`registry reports ${got} for ${version}, expected ${integrity}`);
    if (after["dist-tags"]?.[distTag] !== version) die(`dist-tag ${distTag} is ${after["dist-tags"]?.[distTag]}, expected ${version}`);
    console.log(`published ${SCOPED_NAME}@${version} (dist-tag ${distTag}); dist-tags now ${JSON.stringify(after["dist-tags"])}`);
    summary([`### Published ${SCOPED_NAME}@${version}`, "", `- from \`${args.tag}\`, dist-tag \`${distTag}\``,
      `- ${files} files, ${bytes.length} bytes, \`${integrity}\``, ...notes.map((n) => `- manifest: ${n}`)]);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(`::error::${e instanceof PublishError ? e.message : e?.stack || String(e)}`);
    process.exit(1);
  });
}

export { DIST_TAG_RE, distTagFor, normalise, PublishError, TAG_RE };
