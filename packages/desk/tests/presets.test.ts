import { describe, it, expect } from "vitest";
import {
  TUX_DESK_PRESETS,
  getDeskPresets,
  getDeskPreset,
  clonePresetDoc,
} from "../../app/utils/desk/presets";
import { asTipTapDoc, splitDeskBlocks } from "../../app/utils/desk/render";

describe("Tux Desk Presets Catalog", () => {
  it("registers all 5 canonical institutional presets", () => {
    const presets = getDeskPresets();
    expect(presets).toHaveLength(5);

    const ids = presets.map((p) => p.id);
    expect(ids).toContain("research-program");
    expect(ids).toContain("field-evaluation");
    expect(ids).toContain("academic-publication");
    expect(ids).toContain("corridor-advisory");
    expect(ids).toContain("minimal-starter");
  });

  it("contains complete metadata and valid categories on each preset", () => {
    const validCategories = ["research", "technical", "academic", "operations", "starter"];

    for (const preset of TUX_DESK_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(validCategories).toContain(preset.category);
      expect(preset.categoryLabel).toBeTruthy();
      expect(preset.icon).toMatch(/^lucide:/);
      expect(preset.suggestedSlug).toBeTruthy();
      expect(preset.reviewCadenceDays).toBeGreaterThan(0);
      expect(preset.blocksSummary.length).toBeGreaterThan(0);
      expect(preset.doc.type).toBe("doc");
      expect(Array.isArray(preset.doc.content)).toBe(true);
    }
  });

  it("ensures every preset doc validates against asTipTapDoc AST parser", () => {
    for (const preset of TUX_DESK_PRESETS) {
      const parsed = asTipTapDoc(preset.doc);
      expect(parsed).not.toBeNull();
      expect(parsed?.type).toBe("doc");
      expect(parsed?.content?.length).toBeGreaterThan(0);
    }
  });

  it("ensures splitDeskBlocks decomposes every preset into prose and modules", () => {
    for (const preset of TUX_DESK_PRESETS) {
      const blocks = splitDeskBlocks(preset.doc);
      expect(blocks.length).toBeGreaterThan(0);

      // Verify that modules have kinds and payloads
      const modules = blocks.filter((b) => b.type === "module");
      expect(modules.length).toBeGreaterThan(0);
      for (const mod of modules) {
        if (mod.type === "module") {
          expect(mod.kind).toBeTruthy();
          expect(typeof mod.payload).toBe("object");
        }
      }
    }
  });

  it("clones preset docs without mutating the source catalog", () => {
    const cloned = clonePresetDoc("field-evaluation");
    expect(cloned).not.toBeNull();
    expect(cloned?.type).toBe("doc");

    // Mutate clone
    if (cloned?.content?.[0]?.attrs?.payload) {
      cloned.content[0].attrs.payload.title = "MUTATED TITLE";
    }

    // Original must remain untouched
    const original = getDeskPreset("field-evaluation");
    expect(original?.doc?.content?.[0]?.attrs?.payload?.title).toBe(
      "Automated Freight Platooning Field Trial"
    );
  });

  it("returns undefined or null for invalid preset IDs", () => {
    expect(getDeskPreset("non-existent")).toBeUndefined();
    expect(clonePresetDoc("non-existent")).toBeNull();
  });
});
