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
 * package.json, and packed again, so the checkout's tracked files are never
 * modified and the files are exactly what `files` selects at the tag.
 *
 * The React ports, @tti/tti-ux-react (packages/react), ride the same tag when
 * they are version-locked to it: same version as the root, built with tsc
 * (`npm ci --ignore-scripts` in the checkout, then the workspace's build),
 * checked the same way (its own name, no install script), and published after
 * the layer. A tag whose packages/react has another version (the prereleases of
 * pinned trees) or none (v1) publishes the layer only, and says so.
 *
 * A version already on the registry is not published again (a registry never
 * overwrites one): the run prints both integrities and moves on, so re-running a
 * tag that failed half-way publishes only what is missing.
 *
 * dist-tags: a stable version above the current "latest" becomes "latest"; an
 * older stable version (a backfill) goes to "backfill", so "latest" never moves
 * backwards; a prerelease goes to its first identifier when that is a word
 * ("work-surface" for 2.3.0-work-surface.0), else to "next", and never to
 * "latest" or "backfill". Forgejo refuses a dist-tag that hashicorp/go-version
 * can read as a version, which is any name with a digit in it ("release-1.x",
 * "v1-line"), and it refuses it only AFTER storing the version, so the tag is
 * checked here first: letters and hyphens.
 *
 * Usage:
 *   node scripts/publish-registry.mjs --tag v3.1.0 --pkg-dir <checkout> \
 *     --registry https://code.tti.tamu.edu/api/packages/tti/npm/ \
 *     [--package layer|react|all] [--dry-run]
 * The workflow runs --package layer, then --package react as its own step, so a
 * React build failure shows as its own red step after the layer is out.
 *
 * The token comes from the environment, PUBLISH_TOKEN: a write:package token
 * of the Entra service account that publishes (svc-tti-packages), never a
 * person's. --dry-run needs none, reads the registry anonymously, still builds
 * and packs everything, and stops before the upload.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SCOPED_NAME = "@tti/tti-ux";
const LEGACY_NAME = "tti-ux";
const REACT_NAME = "@tti/tti-ux-react";
const REACT_DIR = "packages/react";
const INSTALL_HOOKS = ["preinstall", "install", "postinstall"];
// The one install script tux has ever shipped, and why it may go: see header, check 3.
const DEV_ONLY_POSTINSTALL = /^nuxt prepare( \|\| exit 0)?$/;
const DIST_TAG_RE = /^[a-z][a-z-]*$/;
// dist-tags a prerelease must never take: either would let "latest" move backwards.
const RESERVED_TAGS = new Set(["latest", "backfill"]);
const TAG_RE = /^v((0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?)$/;

// Thrown, not exited: the cleanup in main()'s finally must run, since the temp dir holds the
// token's userconfig once an upload starts. Only the entry point turns it into an exit status.
class PublishError extends Error {}
function die(msg) {
  throw new PublishError(msg);
}

function parseArgs(argv) {
  const out = { dryRun: false, package: "all" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--tag" || a === "--pkg-dir" || a === "--registry" || a === "--package") {
      if (i + 1 >= argv.length) die(`${a} needs a value`);
      out[a.slice(2).replace("-d", "D")] = argv[++i];
    } else die(`unknown argument: ${a}`);
  }
  for (const k of ["tag", "pkgDir", "registry"]) if (!out[k]) die(`missing --${k === "pkgDir" ? "pkg-dir" : k}`);
  if (!["all", "layer", "react"].includes(out.package)) die(`--package must be layer, react or all: ${out.package}`);
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
    return DIST_TAG_RE.test(first) && !RESERVED_TAGS.has(first) ? first : "next";
  }
  if (!latest || latest.includes("-") || cmpStable(version, latest) > 0) return "latest";
  return "backfill";
}

function refuseInstallScripts(pkg) {
  for (const hook of INSTALL_HOOKS) {
    if (pkg.scripts && hook in pkg.scripts) {
      die(`refusing to publish an install script: ${hook}: ${JSON.stringify(pkg.scripts[hook])}`);
    }
  }
}

// The layer's manifest: see the header's checks 2 and 3.
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
  if (DEV_ONLY_POSTINSTALL.test(scripts.postinstall ?? "")) {
    notes.push(`dropped postinstall "${scripts.postinstall}" (dev-only; consumers run their own nuxt prepare)`);
    delete scripts.postinstall;
  }
  refuseInstallScripts(pkg);
  return notes;
}

// The React ports' manifest: published as-is, so it only has to pass.
function checkReact(pkg, version) {
  if (pkg.name !== REACT_NAME) die(`${REACT_DIR}/package.json name is "${pkg.name}", expected "${REACT_NAME}"`);
  if (pkg.version !== version) die(`${REACT_DIR} version ${pkg.version} is not ${version}`);
  if (pkg.private) die(`${REACT_DIR}/package.json says private: true`);
  refuseInstallScripts(pkg);
  return [];
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

async function getPackument(registry, name) {
  const url = registry + encodeURIComponent(name);
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (res.status === 404) return null;
  if (!res.ok) die(`GET ${url}: HTTP ${res.status}`);
  return res.json();
}

function summary(lines) {
  const f = process.env.GITHUB_STEP_SUMMARY;
  if (f) appendFileSync(f, lines.join("\n") + "\n");
}

// Pack dir, unpack, run `fix` on the manifest, repack, and publish unless the version is there.
async function publishOne({ name, dir, version, prerelease, tag, registry, dryRun, work, fix }) {
  const slot = mkdtempSync(join(work, "pkg-"));
  const first = pack(dir, slot);
  const stage = join(slot, "stage");
  mkdirSync(stage);
  execFileSync("tar", ["-xzf", first, "-C", stage]);
  const stagedDir = join(stage, "package");
  const staged = JSON.parse(readFileSync(join(stagedDir, "package.json"), "utf8"));
  const notes = fix(staged, version);
  writeFileSync(join(stagedDir, "package.json"), JSON.stringify(staged, null, 2) + "\n");
  const outDir = join(slot, "out");
  mkdirSync(outDir);
  const tgz = pack(stagedDir, outDir);

  // The final tarball's own manifest is the one consumers get: check it, not our copy.
  const shipped = JSON.parse(execFileSync("tar", ["-xzOf", tgz, "package/package.json"], { encoding: "utf8" }));
  if (shipped.name !== name || shipped.version !== version) die(`repacked ${name} tarball has the wrong name/version`);
  refuseInstallScripts(shipped);
  const bytes = readFileSync(tgz);
  const integrity = "sha512-" + createHash("sha512").update(bytes).digest("base64");
  const files = execFileSync("tar", ["-tzf", tgz], { encoding: "utf8" }).trim().split("\n").length;

  const packument = await getPackument(registry, name);
  const latest = packument?.["dist-tags"]?.latest;
  const distTag = distTagFor(version, prerelease, latest);
  if (!DIST_TAG_RE.test(distTag)) die(`dist-tag "${distTag}" would be refused by the registry (letters and hyphens only)`);
  console.log(`${name}@${version} from ${tag}: ${files} files, ${bytes.length} bytes, ${integrity}`);
  for (const n of notes) console.log(`  manifest: ${n}`);
  console.log(`  registry ${registry} latest=${latest ?? "(none)"} -> dist-tag "${distTag}"`);

  const existing = packument?.versions?.[version];
  if (existing) {
    const same = existing.dist?.integrity === integrity;
    console.log(`::notice::${name}@${version} is already on the registry (${existing.dist?.integrity}); `
      + (same ? "identical tarball, nothing to do." : "this pack differs, and a published version is never overwritten."));
    summary([`### ${name}@${version}`, "", `Already published; ${same ? "identical" : "this pack differs"}. Nothing uploaded.`]);
    return;
  }
  if (dryRun) {
    console.log(`dry run: ${name}@${version} stops before the upload`);
    return;
  }

  const token = process.env.PUBLISH_TOKEN;
  if (!token) die("PUBLISH_TOKEN is not set (the publishing service account's write:package token)");
  // Auth goes in a throwaway userconfig (0600), keyed to the registry's host+path, and the
  // publish runs from the temp dir, so no project .npmrc or publishConfig can redirect it.
  const userconfig = join(slot, "npmrc");
  writeFileSync(userconfig, `//${registry.replace(/^https?:\/\//, "")}:_authToken=${token}\n`, { mode: 0o600 });
  try {
    npm(["publish", tgz, "--tag", distTag, "--registry", registry, `--@tti:registry=${registry}`,
      "--userconfig", userconfig, "--ignore-scripts"], { cwd: slot, stdio: ["ignore", "inherit", "inherit"] });
  } finally {
    rmSync(userconfig, { force: true });
  }

  const after = await getPackument(registry, name);
  const got = after?.versions?.[version]?.dist?.integrity;
  if (got !== integrity) die(`registry reports ${got} for ${name}@${version}, expected ${integrity}`);
  if (after["dist-tags"]?.[distTag] !== version) die(`${name} dist-tag ${distTag} is ${after["dist-tags"]?.[distTag]}, expected ${version}`);
  console.log(`published ${name}@${version} (dist-tag ${distTag}); dist-tags now ${JSON.stringify(after["dist-tags"])}`);
  summary([`### Published ${name}@${version}`, "", `- from \`${tag}\`, dist-tag \`${distTag}\``,
    `- ${files} files, ${bytes.length} bytes, \`${integrity}\``, ...notes.map((n) => `- manifest: ${n}`)]);
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
  const common = { version, prerelease, tag: args.tag, registry: args.registry, dryRun: args.dryRun, work };
  try {
    // The layer first, packed before anything is installed in the checkout.
    if (args.package !== "react") await publishOne({ ...common, name: SCOPED_NAME, dir: pkgDir, fix: normalise });
    if (args.package === "layer") return;

    const reactPkg = join(pkgDir, REACT_DIR, "package.json");
    const reactVersion = existsSync(reactPkg) ? JSON.parse(readFileSync(reactPkg, "utf8")).version : null;
    if (reactVersion !== version) {
      console.log(`${REACT_NAME}: ${reactVersion ? `${REACT_DIR} is ${reactVersion}, not version-locked to ${version}` : `no ${REACT_DIR} at ${args.tag}`}; layer only.`);
      return;
    }
    // tsc needs the workspace's dependencies; no install script is needed (or run) for that.
    npm(["ci", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: pkgDir, stdio: ["ignore", "ignore", "inherit"] });
    npm(["run", "build", "-w", REACT_NAME], { cwd: pkgDir, stdio: ["ignore", "inherit", "inherit"] });
    await publishOne({ ...common, name: REACT_NAME, dir: join(pkgDir, REACT_DIR), fix: checkReact });
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

export { checkReact, DIST_TAG_RE, distTagFor, normalise, PublishError, TAG_RE };
