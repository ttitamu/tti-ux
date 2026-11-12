// <TuxArchitectureMap> given a document with every kind of shape error the
// schema reports (#163): the validator warns and the map still draws each
// level, which is why those findings are warnings and not errors.
import { describe, expect, it, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { validateMapModel, type TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { everyShapeError } from "../packages/diagrams/tests/support/mapShapeErrors";

describe("<TuxArchitectureMap> on a document with shape errors (#163)", () => {
  it("draws every level, and says what it found once", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const doc = everyShapeError();
      const validation = validateMapModel(doc);
      expect(validation.valid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(20);

      const views: Array<[1 | 2 | 3 | 4, string | undefined, string]> = [
        [1, undefined, "sys"],
        [2, undefined, "c-a"],
        [3, "c-a", "k-one"],
        [4, undefined, "vm"],
      ];
      for (const [initialLevel, initialFocus, card] of views) {
        const w = await mountSuspended(TuxArchitectureMap, {
          props: { model: doc as unknown as TuxMapLevelModel, initialLevel, initialFocus },
        });
        expect(w.find(`[data-id="${card}"]`).exists(), `level ${initialLevel}`).toBe(true);
        expect(w.find('[data-map-diagnostic="true"]').exists(), `level ${initialLevel}`).toBe(false);
        w.unmount();
      }
      expect(error).not.toHaveBeenCalled();
      const said = warn.mock.calls.map((c) => String(c[0])).join("\n");
      expect(said).toContain("/level1/elements/0/kind");
    } finally {
      warn.mockRestore();
      error.mockRestore();
    }
  });
});
