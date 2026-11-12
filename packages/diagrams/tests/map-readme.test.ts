/**
 * The README's tables about the architecture map say what the code says (#169): the props of
 * `<TuxArchitectureMap>` with their defaults, its events, the public constants and functions of the
 * runtime, and the top-level fields of `TuxMapLevelModel`. The code side is read from
 * `scripts/build-map-api.mjs --json` and from the published schema, not from the committed snapshots,
 * so a README that agrees with a stale snapshot still fails.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pkgPath = (rel: string): string => fileURLToPath(new URL(`../${rel}`, import.meta.url));
const readme = readFileSync(pkgPath("README.md"), "utf8");

interface ApiSurface {
  runtime: { entry: string; items: { name: string; kind: string; release: string }[] }[];
  component: {
    props: { name: string; type: string; default: string }[];
    events: { name: string }[];
    slots: unknown[];
    exposed: unknown[];
  };
}

const api = ((): ApiSurface => {
  const res = spawnSync(process.execPath, [pkgPath("scripts/build-map-api.mjs"), "--json"], {
    cwd: pkgPath("."),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.status !== 0) throw new Error(`build-map-api.mjs --json failed:\n${res.stderr}`);
  return JSON.parse(res.stdout) as ApiSurface;
})();

/** The text from a heading line to the next heading of the same or a higher level. */
function section(heading: string): string {
  const start = readme.indexOf(`\n${heading}\n`);
  expect(start, `README.md has no "${heading}" heading`).toBeGreaterThanOrEqual(0);
  const depth = heading.match(/^#+/)![0].length;
  const rest = readme.slice(start + heading.length + 2);
  const next = rest.search(new RegExp(`^#{1,${depth}} `, "m"));
  return next === -1 ? rest : rest.slice(0, next);
}

/** The cells of every table row whose first cell is one name in backticks. `\|` inside a cell is a pipe. */
function namedRows(text: string): Map<string, string[]> {
  const rows = new Map<string, string[]>();
  for (const line of text.split("\n")) {
    if (!line.startsWith("| `")) continue;
    const cells = line
      .slice(1, line.lastIndexOf("|"))
      .split(/(?<!\\)\|/)
      .map((c) => c.trim().replace(/\\\|/g, "|"));
    const name = cells[0]!.match(/^`([^`]+)`$/)?.[1];
    if (!name) continue;
    expect(rows.has(name), `README.md lists \`${name}\` twice in one section`).toBe(false);
    rows.set(name, cells);
  }
  return rows;
}

const sorted = (names: Iterable<string>): string[] => [...names].sort();

describe("the diagrams README and the architecture map's code (tti/tti-ux#169)", () => {
  it("has one props row for every prop of <TuxArchitectureMap>, and no row for a prop that is not there", () => {
    const rows = namedRows(section("### The component: props"));
    expect(sorted(rows.keys())).toEqual(sorted(api.component.props.map((p) => p.name)));
    expect(section("### The component: props")).toContain(`takes ${api.component.props.length} props`);
  });

  it("gives every prop the default the component gives it", () => {
    const rows = namedRows(section("### The component: props"));
    for (const prop of api.component.props) {
      // a factory default (`() => []`) is written as its value
      const want = `\`${prop.default.replace(/^\(\) => /, "")}\``;
      expect(rows.get(prop.name)?.[2], `default of \`${prop.name}\``).toBe(want);
    }
  });

  it("names every event the component declares, and no other", () => {
    const text = section("### The component: events, slots and exposed members");
    const rows = namedRows(text);
    const updateRow = rows.get("update:<prop>");
    expect(updateRow, "the `update:<prop>` row").toBeDefined();
    const named = new Set<string>();
    for (const name of rows.keys()) if (name !== "update:<prop>") named.add(name);
    for (const m of updateRow![2]!.matchAll(/`([^`]+)`/g)) named.add(`update:${m[1]}`);
    // declared and never emitted: the README says so in a sentence of its own
    for (const m of text.matchAll(/^`(update:[A-Za-z]+)` is declared/gm)) named.add(m[1]!);
    expect(sorted(named)).toEqual(sorted(api.component.events.map((e) => e.name)));

    expect(api.component.slots).toHaveLength(0);
    expect(api.component.exposed).toHaveLength(0);
    expect(text).toContain("has no slots and calls no `defineExpose()`");
  });

  it("lists every public constant and function of the runtime, and none that is internal or gone", () => {
    const text = section("### The runtime: public exports");
    const rows = namedRows(text);
    const listed = sorted([...rows.keys()].map((n) => n.replace(/\(\)$/, "")));
    const items = api.runtime.flatMap((e) => e.items);
    const isValue = (i: { kind: string }): boolean => i.kind === "const" || i.kind === "function";
    const publicValues = new Set(items.filter((i) => i.release === "public" && isValue(i)).map((i) => i.name));
    expect(listed).toEqual(sorted(publicValues));
    for (const [name] of rows) {
      const item = items.find((i) => i.name === name.replace(/\(\)$/, ""))!;
      expect(name.endsWith("()"), `\`${name}\` is a ${item.kind}`).toBe(item.kind === "function");
    }

    const main = api.runtime.find((e) => e.entry.endsWith("/tuxArchitectureMap"))!.items.filter((i) => i.release === "public");
    const count = (kinds: string[]): number => main.filter((i) => kinds.includes(i.kind)).length;
    expect(text).toContain(
      `${main.length} public exports: ${count(["const"])} constants, ${count(["function"])} functions and ${count(["interface", "type"])} types`,
    );
    expect(text).toContain(`The ${count(["interface", "type"])} public types`);
  });

  it("marks the top-level fields of TuxMapLevelModel required or optional as the schema does", () => {
    const schema = JSON.parse(readFileSync(pkgPath("schema/tux-map-1.schema.json"), "utf8")) as {
      properties: Record<string, { required?: string[] }>;
      required: string[];
    };
    const text = section("### `TuxMapLevelModel`: required and optional fields");
    const topLevel = text.slice(0, text.indexOf("| Field | In a document |"));
    const fields = new Map<string, string>();
    for (const line of topLevel.split("\n")) {
      if (!line.startsWith("| `")) continue;
      const cells = line.split("|").map((c) => c.trim());
      for (const m of cells[1]!.matchAll(/`([^`]+)`/g)) fields.set(m[1]!, cells[2]!);
    }
    expect(sorted(fields.keys())).toEqual(sorted(Object.keys(schema.properties)));
    for (const [name, required] of fields) {
      expect(required, `\`${name}\``).toBe(schema.required.includes(name) ? "required" : "optional");
    }
    // the required fields inside a level are the ones its row says are required
    for (const level of ["level1", "level2", "level4"]) {
      const row = topLevel.split("\n").find((l) => l.startsWith(`| \`${level}\` |`))!;
      const said = row.match(/: ((?:`[a-z]+`(?:, | and )?)+) \((?:both|all) required\)/)?.[1] ?? "";
      expect(sorted([...said.matchAll(/`([^`]+)`/g)].map((m) => m[1]!)), level).toEqual(
        sorted(schema.properties[level]!.required ?? []),
      );
    }
  });
});
