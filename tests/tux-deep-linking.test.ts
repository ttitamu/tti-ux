import { describe, expect, it } from "vitest";
import {
  getTuxHealthCatalog,
  filterHealthCatalog,
} from "../app/utils/tuxHealthCatalog";

describe("TUX Deep-Linking & State Serialization Invariants", () => {
  it("filters Component Health catalog correctly when query parameters are parsed", () => {
    const catalog = getTuxHealthCatalog();

    // Simulate URL: ?category=actions
    const query1 = { category: "actions" };
    const filtered1 = filterHealthCatalog(catalog, {
      category: query1.category,
    });
    expect(filtered1.length).toBeGreaterThan(0);
    expect(filtered1.every((c) => c.category === "actions")).toBe(true);

    // Simulate URL: ?gaps=true
    const queryGaps = { gaps: "true" };
    const filteredGaps = filterHealthCatalog(catalog, {
      gapsOnly: queryGaps.gaps === "true",
    });
    expect(filteredGaps.every((c) => c.healthScore < 80)).toBe(true);

    // Simulate URL: ?query=button
    const query2 = { query: "button" };
    const filtered2 = filterHealthCatalog(catalog, {
      query: query2.query,
    });
    expect(filtered2.some((c) => c.name === "TuxButton")).toBe(true);

    // Simulate URL: ?tier=excellent
    const query3 = { tier: "excellent" };
    const filtered3 = filterHealthCatalog(catalog, {
      tier: query3.tier as any,
    });
    expect(filtered3.every((c) => c.healthTier === "excellent")).toBe(true);
    expect(filtered3.length).toBeGreaterThanOrEqual(18); // 18 verified Tier 1 components
  });

  it("handles deep-linking query parameter serialization cleanly", () => {
    function serializePlaygroundQuery(
      currentValues: Record<string, any>,
      defaultValues: Record<string, any>,
      activePresetName: string | null,
      existingQuery: Record<string, any> = {}
    ) {
      const q: Record<string, string> = { ...existingQuery };
      if (activePresetName) {
        q.preset = activePresetName;
      } else {
        delete q.preset;
      }
      for (const [k, v] of Object.entries(currentValues)) {
        if (v !== defaultValues[k] && v !== "" && v !== undefined) {
          q[k] = String(v);
        } else {
          delete q[k];
        }
      }
      return q;
    }

    const defaults = { intent: "primary", shape: "default", disabled: false };

    // When identical to defaults, query is clean
    const cleanQuery = serializePlaygroundQuery(defaults, defaults, null);
    expect(cleanQuery).toEqual({});

    // When preset is active
    const presetQuery = serializePlaygroundQuery(
      { intent: "primary", shape: "sharp", disabled: false },
      defaults,
      "kadence"
    );
    expect(presetQuery).toEqual({ preset: "kadence", shape: "sharp" });

    // Preserves foreign query parameters
    const foreignQuery = serializePlaygroundQuery(
      { intent: "destructive", shape: "default", disabled: true },
      defaults,
      null,
      { theme: "dark", lang: "en" }
    );
    expect(foreignQuery).toEqual({
      theme: "dark",
      lang: "en",
      intent: "destructive",
      disabled: "true",
    });
  });

  it("hydrates playground properties correctly from parsed URL query parameters", () => {
    function hydrateProps(
      query: Record<string, string>,
      controls: Array<{ prop: string; type: string; defaultValue: any }>
    ) {
      const result: Record<string, any> = {};
      controls.forEach((ctrl) => {
        if (query[ctrl.prop] !== undefined) {
          const raw = query[ctrl.prop];
          if (ctrl.type === "boolean") result[ctrl.prop] = raw === "true" || raw === "1";
          else if (ctrl.type === "number") result[ctrl.prop] = Number(raw);
          else result[ctrl.prop] = raw;
        } else {
          result[ctrl.prop] = ctrl.defaultValue;
        }
      });
      return result;
    }

    const controls = [
      { prop: "shape", type: "select", defaultValue: "default" },
      { prop: "disabled", type: "boolean", defaultValue: false },
      { prop: "level", type: "number", defaultValue: 2 },
    ];

    const hydrated = hydrateProps({ shape: "sharp", disabled: "true", level: "1" }, controls);
    expect(hydrated).toEqual({
      shape: "sharp",
      disabled: true,
      level: 1,
    });
  });
});
