// @vitest-environment nuxt
/**
 * The stage is built in two steps. The base follows from the model, the level
 * and the focus; the reader's toggles (planned, wire categories, split cards)
 * are applied to it afterwards. A toggle must rebuild the second step and
 * leave the first alone (#158).
 */
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import {
  buildMapParentIndex,
  collapseModelSubgraphs,
  levelForFocus,
  sanitizeMapModel,
} from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { mapBenchModels } from "../packages/diagrams/tests/support/mapBench";

type SetupState = Record<string, any>;

describe("TuxArchitectureMap: a toggle rebuilds the stage, not its base (#158)", () => {
  const mounted: Awaited<ReturnType<typeof mountSuspended>>[] = [];
  afterEach(() => {
    for (const w of mounted.splice(0)) w.unmount();
  });

  async function mountAt(which: "top" | "file" | "folder") {
    const g = mapBenchModels().s500;
    let props: Record<string, unknown> = { model: g.model };
    if (which !== "top") {
      const collapsed = collapseModelSubgraphs(sanitizeMapModel(g.model).model);
      const parentOf = buildMapParentIndex(collapsed.model);
      const raw = which === "file" ? g.focus.fileId : g.focus.folderId;
      const fid = collapsed.aliases[raw] ?? raw;
      props = { model: g.model, initialLevel: levelForFocus(fid, collapsed.model, parentOf), initialFocus: fid };
    }
    const w = await mountSuspended(TuxArchitectureMap, { props });
    mounted.push(w);
    await nextTick();
    return (w.vm as unknown as { $: { setupState: SetupState } }).$.setupState;
  }

  for (const which of ["top", "file", "folder"] as const) {
    it(`keeps the base through every toggle (${which} view)`, async () => {
      const state = await mountAt(which);
      const base = state.stageBase;
      let stage = state.stageData;
      expect(stage.els.length).toBeGreaterThan(0);

      const rebuilt = () => {
        const next = state.stageData;
        const changed = next !== stage;
        stage = next;
        return changed;
      };

      state.toggleWireCategory("tests");
      expect(state.stageBase).toBe(base);
      // Level 1 reads the categories only when a code link joins two of its cards, so the
      // rebuild is asserted on the code levels alone
      if (which !== "top") expect(rebuilt()).toBe(true);

      state.showPlanned = !state.showPlanned;
      expect(state.stageBase).toBe(base);
      expect(rebuilt()).toBe(true);

      const meta = state.stageData.outsideMetaById as Record<string, { splittable?: boolean }>;
      const splitId = Object.keys(meta).find((id) => meta[id]?.splittable);
      if (which !== "top") expect(splitId).toBeTruthy();
      if (splitId) {
        state.toggleSplitCard(splitId);
        expect(state.stageBase).toBe(base);
        expect(rebuilt()).toBe(true);
      }
    });
  }

  it("rebuilds the base when the focus moves", async () => {
    const state = await mountAt("file");
    const base = state.stageBase;
    state.currentLevel = 1;
    state.focusId = null;
    await nextTick();
    expect(state.stageBase).not.toBe(base);
    expect(state.stageBase.level).toBe(1);
  });
});
