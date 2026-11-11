import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A model entry of map-conformance.json is either the model itself or a reference to a file beside
 * the fixture: `{ "$file": "map-real-producer.json", "sha256": "…" }` (#165). The referenced file is
 * an independent producer's real output, 1.6 MB, kept out of the fixture and out of the npm package.
 * Resolving checks the hash, so a consumer that holds a different copy fails instead of passing on
 * other data.
 */
export function resolveFixtureModels<T>(models: Record<string, unknown>, fixtureDir: string): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [name, entry] of Object.entries(models)) {
    const ref = entry as { $file?: unknown; sha256?: unknown };
    if (typeof ref.$file !== "string") {
      out[name] = entry as T;
      continue;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(ref.$file)) {
      throw new Error(`fixture model ${name}: $file must be a plain file name, got ${JSON.stringify(ref.$file)}`);
    }
    const bytes = readFileSync(join(fixtureDir, ref.$file));
    const sha = createHash("sha256").update(bytes).digest("hex");
    if (sha !== ref.sha256) {
      throw new Error(`fixture model ${name}: ${ref.$file} has sha256 ${sha}, the fixture pins ${String(ref.sha256)}`);
    }
    out[name] = JSON.parse(bytes.toString("utf8")) as T;
  }
  return out;
}
