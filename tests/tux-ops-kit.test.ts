/**
 * tux-ops.css — recipes, not a host fork.
 *
 * Hex literals and foreign selectors (Nagios .serviceOK, Bootstrap .btn)
 * belong in the consuming overlay, never in the kit.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "kit/css/tux-ops.css"), "utf8");

describe("tux-ops.css", () => {
  it("references tokens only — no hex literals", () => {
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(withoutComments).not.toMatch(/#[0-9A-Fa-f]{3,8}\b/);
  });

  it("does not ship host-application selectors", () => {
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(withoutComments).not.toMatch(/\.service(OK|WARNING|CRITICAL|UNKNOWN)/);
    expect(withoutComments).not.toMatch(/\.status(OK|WARNING|CRITICAL|UNKNOWN|BG)/i);
    expect(withoutComments).not.toMatch(/\.btn-primary/);
  });

  it("exposes the status class API TuxStatus wraps", () => {
    for (const state of [
      "ok",
      "warning",
      "unknown",
      "critical",
      "pending",
      "maintenance",
    ]) {
      expect(css).toContain(`.tux-status--${state}`);
      expect(css).toContain(`.tux-status-row--${state}`);
    }
    expect(css).toContain(".tux-ops-heading");
    expect(css).toContain(".tux-ops-table");
    expect(css).toContain(".tux-status--acked");
  });
});

describe("TuxExample CSS tab", () => {
  it("treats css as a first-class kit tab, parallel to powerbi", () => {
    const example = readFileSync(
      join(ROOT, "app/components/TuxExample.vue"),
      "utf8",
    );
    expect(example).toContain("css?: string");
    expect(example).toContain('{ id: "css", label: "CSS" }');
    const statusPage = readFileSync(
      join(ROOT, "app/pages/components/status.vue"),
      "utf8",
    );
    expect(statusPage).toContain("tux-ops.css?raw");
    expect(statusPage).toContain(':css="tuxOpsCss"');
  });
});
