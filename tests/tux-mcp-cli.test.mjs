// The one-shot paths of scripts/tux-mcp.mjs (--call, --list-tools) run as a
// child with stdout as a pipe, the way a shell pipeline or another program
// reads them. Where a pipe write is asynchronous (macOS, for one), a process
// that exits right after writing loses whatever the pipe had not yet taken:
// the output stopped at the pipe's capacity, 65,536 bytes.
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = join(ROOT, "scripts/tux-mcp.mjs");
// A model an independent producer emitted for this repository (2,048 symbols),
// large enough that an uncapped node query is several times the pipe capacity.
const MODEL = join(ROOT, "packages/diagrams/tests/fixtures/map-real-producer.json");
const PIPE_CAPACITY = 65_536;

function runPiped(args) {
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    const out = [];
    const err = [];
    child.on("error", fail);
    child.stdout.on("data", (chunk) => out.push(chunk));
    child.stderr.on("data", (chunk) => err.push(chunk));
    child.on("close", (code) => {
      done({ code, stdout: Buffer.concat(out), stderr: Buffer.concat(err).toString("utf8") });
    });
  });
}

describe("tux-mcp one-shot output into a pipe", () => {
  it("--call writes a result larger than the pipe capacity in full", async () => {
    const run = await runPiped([
      "--model", MODEL,
      "--call", "tux_query_architecture_nodes",
      JSON.stringify({ compact: false, limit: 200 }),
    ]);
    expect(run.stderr).toBe("");
    expect(run.code).toBe(0);
    expect(run.stdout.length).toBeGreaterThan(PIPE_CAPACITY);
    const text = run.stdout.toString("utf8");
    expect(text.endsWith("}\n")).toBe(true);
    const result = JSON.parse(text);
    expect(result.nodeCount).toBe(200);
    expect(result.nodes).toHaveLength(200);
  });

  it("--call without a model writes the whole component list", async () => {
    const run = await runPiped(["--call", "tux_list_components", "{}"]);
    expect(run.code).toBe(0);
    expect(run.stdout.length).toBeGreaterThan(PIPE_CAPACITY);
    const result = JSON.parse(run.stdout.toString("utf8"));
    expect(result.count).toBe(result.components.length);
  });

  it("--list-tools writes a complete tool list", async () => {
    const run = await runPiped(["--model", MODEL, "--list-tools"]);
    expect(run.code).toBe(0);
    const tools = JSON.parse(run.stdout.toString("utf8"));
    expect(tools.map((t) => t.name)).toContain("tux_query_architecture_nodes");
  });

  it("--call exits 1 and still writes the whole result when the tool returns an error", async () => {
    const run = await runPiped(["--call", "tux_get_component", JSON.stringify({ name: "NoSuchComponent" })]);
    expect(run.code).toBe(1);
    expect(JSON.parse(run.stdout.toString("utf8")).error).toBeTruthy();
  });

  it("a failure before any tool runs is written to stderr in full, with exit 1", async () => {
    const missing = await runPiped(["--model", join(ROOT, "no-such-model.json"), "--list-tools"]);
    expect(missing.code).toBe(1);
    expect(missing.stdout.length).toBe(0);
    expect(missing.stderr).toMatch(/^tux-mcp: .+\n$/);

    const badArgs = await runPiped(["--call", "tux_list_components", "[1]"]);
    expect(badArgs.code).toBe(1);
    expect(badArgs.stdout.length).toBe(0);
    expect(badArgs.stderr).toBe("tux-mcp: Tool arguments JSON after --call must be an object.\n");
  });
});
