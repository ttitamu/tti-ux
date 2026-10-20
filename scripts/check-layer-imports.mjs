#!/usr/bin/env node
/**
 * check-layer-imports: the two ways 3.4.0 shipped a layer no consuming app
 * could build. Run in CI on every PR, and by publish-package before anything
 * is published.
 *
 * 1. No layer file imports through `~/` or `@/`. Inside a Nuxt layer those
 *    resolve against the CONSUMING app's srcDir, so `~/composables/x` in
 *    node_modules/@tti/tti-ux/... looks for x in the app (3.4.0 had 20). Use a
 *    relative path inside a package, or `#tux/...` (this layer's own app/, an
 *    alias in nuxt.config.ts) from a sub-layer. Demo pages, tests and
 *    stories are exempt: consumers never compile them.
 * 2. Every sub-layer the root extends is one of its dependencies, at the
 *    root's own version. The root extends all of packages/<name> and
 *    registers their components globally, so every app compiles them; their
 *    libraries must install with @tti/tti-ux (3.4.0 listed them as optional
 *    peers, which install nothing).
 *
 * Usage: node scripts/check-layer-imports.mjs [repo-root]   (exit 1 on a finding)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] || process.cwd();
const LAYER_DIRS = ["app/components", "app/composables", "app/utils", "app/assets", "app/plugins", "app/middleware", "app/layouts"];
const EXEMPT = /(^|\/)(pages|demo|demos|__tests__|stories)(\/|$)|\.(test|spec|stories)\.[cm]?[jt]sx?$/;
const SOURCE = /\.(vue|[cm]?[jt]sx?)$/;
const ALIAS_IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(~|@)\/[^"']*\1/g;

function walk(dir, out = []) {
  let names;
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names) {
    if (n === "node_modules" || n.startsWith(".")) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (SOURCE.test(n)) out.push(p);
  }
  return out;
}

const findings = [];
// 3. Layer files import another sub-layer by package name, never by a path into
//    this layer's bundled packages/ copy (which cannot see a sub-layer's nested
//    dependencies). Checked with the imports below.
const BUNDLED_PATH = /(["'])(?:\.\.\/)+packages\/(charts|diagrams|code|desk|content)\//;
const layerRoots = [root, ...readdirSync(join(root, "packages")).map((d) => join(root, "packages", d))
  .filter((d) => { try { return statSync(join(d, "nuxt.config.ts")).isFile(); } catch { return false; } })];
for (const lr of layerRoots) {
  for (const d of LAYER_DIRS) {
    for (const f of walk(join(lr, d))) {
      const rel = relative(root, f);
      if (EXEMPT.test(rel)) continue;
      const lines = readFileSync(f, "utf8").split("\n");
      lines.forEach((line, i) => {
        const b = BUNDLED_PATH.exec(line);
        if (b) findings.push(`${rel}:${i + 1}: imports packages/${b[2]} by path: import "@tti/tti-ux-${b[2]}/..." instead, the installed package`);
        for (const m of line.matchAll(ALIAS_IMPORT)) {
          findings.push(`${rel}:${i + 1}: imports through "${m[2]}/", which resolves in the consuming app, not this layer: `
            + `use a relative path inside the package, or "#tux/..." from a sub-layer`);
        }
      });
    }
  }
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const config = readFileSync(join(root, "nuxt.config.ts"), "utf8");
// extends entries, either form: "@tti/tti-ux-<name>" (3.4.1 on) or resolve(layerDir, "packages/<name>") (3.4.0)
const extended = [...config.matchAll(/"@tti\/tti-ux-([a-z0-9-]+)"|resolve\(layerDir,\s*"packages\/([a-z0-9-]+)"\)/g)]
  .map((m) => m[1] || m[2]).filter((n) => { try { return statSync(join(root, "packages", n, "nuxt.config.ts")).isFile(); } catch { return false; } });
for (const name of new Set(extended)) {
  const m = [null, name];
  const sub = JSON.parse(readFileSync(join(root, "packages", m[1], "package.json"), "utf8"));
  const want = pkg.version;
  const got = pkg.dependencies?.[sub.name];
  if (got !== want) {
    findings.push(`package.json: the root extends packages/${m[1]} (${sub.name}), so it must list it in dependencies at "${want}" `
      + `(found ${got === undefined ? "none" : JSON.stringify(got)}${pkg.peerDependencies?.[sub.name] ? "; a peer installs nothing" : ""})`);
  }
  if (sub.version !== want) findings.push(`packages/${m[1]}/package.json: version ${sub.version}, not the root's ${want}`);
}

if (findings.length) {
  for (const f of findings) console.error(`::error::${f}`);
  console.error(`check-layer-imports: ${findings.length} finding(s)`);
  process.exit(1);
}
console.log(`check-layer-imports: ${layerRoots.length} layers clean; every extended sub-layer is a dependency at ${pkg.version}`);
