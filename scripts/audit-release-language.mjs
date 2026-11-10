#!/usr/bin/env node
/**
 * audit-release-language: TUX is beta, and no text in this repository may
 * promise a release beyond it.
 *
 * The rules, each on one line of text at a time:
 *
 *   tux-major     TUX (or tti-ux, or an @tti/tti-ux package) named with a
 *                 major above 3: "TUX 4", "tti-ux v4.0", "@tti/tti-ux@4".
 *   tag           A release tag or three-part version with a major above 3
 *                 that no third party on the line accounts for: "v4.0.0-rc.1".
 *   release-talk  A 4.0 or v4 beside release wording ("removed in",
 *                 "planned for", "milestone", "upgrade", "version", ...) that
 *                 no third party on the line accounts for.
 *   next-major    "next major", unless the line is about a third party. A
 *                 deprecated name is "removed when TUX goes Live".
 *   map-version   The architecture map given a version of its own
 *                 ("M.A.P. v3.12"). It ships inside TUX and has none.
 *
 * Third-party versions are facts and stay: Nuxt 4, Tailwind v4, vitest 4,
 * actions/checkout@v4, CC-BY 4.0, a PBIR schema's 4.0, a v4 UUID, and any
 * dependency range in a manifest. THIRD_PARTY below is the allowance; a line
 * that names one of them is not judged by `tag`, `release-talk` or
 * `next-major`. Numbers in demo data (4.0 seconds, 4.0%) are not release
 * wording and never match.
 *
 * "Live" is a declaration that ends the beta. It is not a version number, so
 * the fix for a finding is to reword, never to pick another number.
 *
 * Usage:
 *   node scripts/audit-release-language.mjs            # the tracked files
 *   node scripts/audit-release-language.mjs <file>...  # these files
 * Exit 1 with one line per finding. tests/release-language.test.mjs runs the
 * same scan in the root suite (`npm test`, `npm run test:root`).
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Not scanned: lockfiles (third-party versions only), the vendored third-party design
// references, and the two files that spell the forbidden wording out to test for it.
const SKIP = [
  /(^|\/)package-lock\.json$/,
  /^reference\//,
  /^scripts\/audit-release-language\.mjs$/,
  /^tests\/release-language\.test\.mjs$/,
];
const SKIP_DIRS = new Set([".git", "node_modules", ".nuxt", ".output", "dist", ".data", "reference"]);
const TEXT = /\.(md|mdc|txt|vue|ts|tsx|mts|js|jsx|mjs|cjs|json|ya?ml|css|scss|html|php|cs|cshtml|razor|csproj|swift|kt|py|sh|toml|env)$|(^|\/)\.[a-z-]+rc$|(^|\/)[A-Z_]+$/;

// A line that names one of these is talking about that project's version.
const THIRD_PARTY = new RegExp([
  "tailwind", "nuxt", "\\bvite(st)?\\b", "\\bvue\\b", "eslint", "\\bnode(\\.js|js)?\\b", "\\bnpm\\b", "typescript",
  "\\breact\\b", "echarts", "mermaid", "shiki", "katex", "bootstrap", "wordpress", "kadence", "\\bphp\\b", "\\.net\\b",
  "figma", "power ?bi", "pbir", "fabric", "uuid", "cc[- ]by", "creative commons", "actions/", "@v\\d", "micromatch",
  "puppeteer", "tauri", "forgejo", "github", "material ui", "shadcn", "playwright", "apache", "wcag", "ipv4", "http/",
  // a dependency range in a manifest: "name": "^4.0.0"
  "^\\s*\"[^\"]+\":\\s*\"[\\^~<>= ]*\\d",
].join("|"), "i");

const RELEASE_WORDS = /\b(removed?|removal|removing|deprecat\w*|releas\w*|milestone|major|upgrad\w*|migrat\w*|roadmap|plan(s|ned)?|ship(s|ped|ping)?|breaking|version|until|coming|future|next|land(s|ing)?)\b/i;
// 4.0, v4.0, 4.0.0, 4.x or a bare v4: not part of a longer number (3.4.0, 4.0.8, 14.0) or a
// measurement (4.0%, 4.0k), and not an identifier (axle-class-v4, setV4).
const FOUR = /(?<![\w.@/#-])(?:v?4\.0(?:\.0)?(?:-[0-9A-Za-z.-]+)?|v?4\.x|v4)(?![\w%]|\.\d)/;
const TAG = /(?<![\w.@/#-])(?:v[4-9]\.\d+\.\d+|4\.0\.0)(?![\w%]|\.\d)/;
const TUX_MAJOR = /(?:\bTUX|\btti-ux|@tti\/tti-ux[\w-]*)[ @]{1,2}v?(?:[4-9]|[1-9]\d)(?:\.(?:\d+|x))*(?![\w.])/i;
const NEXT_MAJOR = /\bnext major\b/i;
const MAP_VERSION = /(?:M\.A\.P\.?|\barchitecture map)\s+v?\d+\.\d+/i;

/** Findings for one text: [{ line, rule, text }]. */
export function auditText(text) {
  const findings = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length > 4000) continue; // minified or data; not prose
    const thirdParty = THIRD_PARTY.test(line);
    let rule = null;
    if (TUX_MAJOR.test(line)) rule = "tux-major";
    else if (MAP_VERSION.test(line)) rule = "map-version";
    else if (!thirdParty && TAG.test(line)) rule = "tag";
    else if (!thirdParty && FOUR.test(line) && RELEASE_WORDS.test(line)) rule = "release-talk";
    else if (!thirdParty && NEXT_MAJOR.test(line)) rule = "next-major";
    if (rule) findings.push({ line: i + 1, rule, text: line.trim().slice(0, 160) });
  }
  return findings;
}

function walk(dir, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), out);
    } else if (e.isFile()) out.push(relative(ROOT, join(dir, e.name)));
  }
  return out;
}

/** The files the audit reads: git's tracked and untracked-but-not-ignored files, or a walk without git. */
export function listFiles(root = ROOT) {
  let files;
  try {
    files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }).split("\0").filter(Boolean);
  } catch {
    files = walk(root, []);
  }
  return files.map((f) => f.split("\\").join("/")).filter((f) => TEXT.test(f) && !SKIP.some((re) => re.test(f)));
}

/** Findings across files: [{ file, line, rule, text }]. */
export function auditFiles(files, root = ROOT) {
  const findings = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(join(root, file), "utf8");
    } catch {
      continue; // listed by git but deleted in the working tree
    }
    for (const f of auditText(text)) findings.push({ file, ...f });
  }
  return findings;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const files = args.length ? args.map((a) => relative(ROOT, resolve(a))) : listFiles();
  const findings = auditFiles(files);
  for (const f of findings) console.error(`${f.file}:${f.line}: [${f.rule}] ${f.text}`);
  if (findings.length) {
    console.error(`\naudit-release-language: ${findings.length} finding(s). TUX is beta and stays on 3.x; nothing is planned for a later major.`
      + `\nReword: a deprecated name is "removed when TUX goes Live". Live is a declaration, not a version number.`);
    process.exit(1);
  }
  console.log(`audit-release-language: ${files.length} files, no release wording beyond the beta.`);
}
