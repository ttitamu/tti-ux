// TUX is beta and stays on 3.x: no file in the repository may name, plan or
// imply a later major, and the architecture map has no version of its own.
// The rules live in scripts/audit-release-language.mjs; this suite runs them
// over the repository (so `npm test` and `npm run test:root` hold the rule)
// and proves each rule on a planted line, so a rule that stops matching
// cannot pass for a clean tree.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { auditFiles, auditText, listFiles } from "../scripts/audit-release-language.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rules = (text) => auditText(text).map((f) => f.rule);

describe("release language: the repository", () => {
  it("reads the files a reader or installer meets", () => {
    const files = listFiles();
    for (const f of ["README.md", "CHANGELOG.md", "package.json", "app/app.vue", "packages/react/package.json",
      "scripts/publish-registry.mjs", ".forgejo/workflows/publish-package.yml"]) {
      expect(files, f).toContain(f);
    }
    expect(files).not.toContain("package-lock.json");
  });

  it("promises no release beyond the beta", () => {
    const findings = auditFiles(listFiles()).map((f) => `${f.file}:${f.line}: [${f.rule}] ${f.text}`);
    expect(findings).toEqual([]);
  });
});

describe("release language: what the rules catch", () => {
  it.each([
    ["tux-major", "TUX 4 will drop the legacy aliases."],
    ["tux-major", "Upgrade to tti-ux v4.0 when it lands."],
    ["tux-major", "npm install @tti/tti-ux@4"],
    ["tux-major", "npm install @tti/tti-ux-diagrams@4.0.0"],
    ["tag", "git tag v4.0.0-rc.1"],
    ["tag", "The 4.0.0 milestone holds the removals."],
    ["release-talk", "`subtitle` is deprecated and will be removed in 4.0."],
    ["release-talk", "Planned for v4: the renamed props."],
    ["release-talk", "The alias stays until 4.x."],
    ["next-major", "These names go away in the next major."],
    ["map-version", "M.A.P. v3.12 · wire inspector"],
    ["map-version", "The architecture map 1.0 ships with it."],
  ])("%s: %s", (rule, line) => {
    expect(rules(line)).toEqual([rule]);
  });

  it("names TUX with a later major even beside a third party", () => {
    expect(rules("TUX 4 moves to Nuxt 5.")).toEqual(["tux-major"]);
  });

  it("reports the line number and the text", () => {
    expect(auditText("fine\nremoved in 4.0\n")).toEqual([{ line: 2, rule: "release-talk", text: "removed in 4.0" }]);
  });
});

describe("release language: what stays", () => {
  it.each([
    "TUX is beta; versions stay on 3.x and a deprecated name is removed when TUX goes Live.",
    "Built on Nuxt 4 and Tailwind v4.",
    "Tailwind v4 removed the config file; migrate to @theme.",
    "uses: actions/checkout@v4",
    "    \"tailwindcss\": \"^4.0.0\",",
    "    \"vitest\": \"^4.0.0\",",
    "Licensed under CC-BY 4.0.",
    "The PBIR definition version is 4.0.",
    "A v4 UUID identifies the token.",
    "micromatch 4.0.8 is pinned until the next major of its parent.",
    "Median delay fell to 4.0 seconds, a 4.0% change.",
    "TUX 3.12.0, @tti/tti-ux@3.4.0 and tti-ux v3.4.0 are releases.",
    "const [v4, setV4] = useState(false);",
    "model: axle-class-v4",
    "chi v5.0.0 and .NET 8.0.0",
    "The architecture map ships inside TUX 3.12.0.",
  ])("%s", (line) => {
    expect(rules(line)).toEqual([]);
  });
});

describe("release language: the beta says so where it is met", () => {
  const read = (f) => readFileSync(join(ROOT, f), "utf8");

  it.each([
    "README.md", "kit/README.md", "packages/charts/README.md", "packages/code/README.md",
    "packages/content/README.md", "packages/desk/README.md", "packages/diagrams/README.md",
  ])("%s carries the status line", (f) => {
    expect(read(f)).toMatch(/\*\*Status: Beta\.\*\*/);
  });

  it.each([
    "package.json", "packages/charts/package.json", "packages/code/package.json", "packages/content/package.json",
    "packages/desk/package.json", "packages/diagrams/package.json", "packages/elements/package.json",
    "packages/react/package.json",
  ])("%s says beta in the description the registry lists", (f) => {
    expect(JSON.parse(read(f)).description).toMatch(/^Beta\. /);
  });

  it("the changelog header and the docs chrome say beta", () => {
    expect(read("CHANGELOG.md").slice(0, 2000)).toMatch(/TUX is beta/);
    expect(read("app/app.vue")).toMatch(/<TuxBadge tone="warning" label="Beta"/);
  });
});
