// @vitest-environment nuxt
/**
 * What a selection and a level change compute in a mounted map (#227):
 *
 * - A selection computes its radius twice, unfiltered and by kind chip, and a
 *   kind chip turned on or off computes only the filtered one again; what the
 *   walk reads from the model is built once for the model (unit tests:
 *   `packages/diagrams/tests/map-blast-cache.test.ts`).
 * - The branch's blast radius (a model that carries diffs, nothing selected)
 *   is computed once for the model; a level change projects it onto the new
 *   level's cards and does not walk the links again.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import * as mapUtils from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { TUX_MAP_SCHEMA, type TuxMapLevelModel } from "../packages/diagrams/app/utils/tuxArchitectureMap";

vi.mock("../packages/diagrams/app/utils/tuxArchitectureMap", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../packages/diagrams/app/utils/tuxArchitectureMap")>();
  return { ...mod, computeLinkBlastRadius: vi.fn(mod.computeLinkBlastRadius) };
});

const walks = vi.mocked(mapUtils.computeLinkBlastRadius);
const realWalk = (await vi.importActual<typeof import("../packages/diagrams/app/utils/tuxArchitectureMap")>(
  "../packages/diagrams/app/utils/tuxArchitectureMap",
)).computeLinkBlastRadius;

type Mounted = Awaited<ReturnType<typeof mountSuspended>>;
const stateOf = (w: Mounted) => (w.vm as unknown as { $: { setupState: Record<string, any> } }).$.setupState;

function model(withDiff = false): TuxMapLevelModel {
  return {
    schema: TUX_MAP_SCHEMA,
    level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
    level2: {
      boundary: "sys",
      elements: [
        { id: "c-a", kind: "container", name: "A" },
        { id: "c-b", kind: "container", name: "B" },
      ],
      rels: [{ from: "c-b", to: "c-a", label: "calls" }],
    },
    level3: {
      "c-a": [
        {
          id: "f:a/one.ts",
          kind: "file",
          name: "one.ts",
          ...(withDiff ? { diff: { changeType: "modified" as const, summary: "Signature changed" } } : {}),
        },
        { id: "f:a/two.ts", kind: "file", name: "two.ts" },
        { id: "f:a/README.md", kind: "file", name: "README.md" },
      ],
      "c-b": [{ id: "f:b/three.ts", kind: "file", name: "three.ts" }],
    },
    level4: { groups: [], nodes: [], links: [] },
    links: [
      { from: "f:a/two.ts", to: "f:a/one.ts", kind: "imports" },
      { from: "f:b/three.ts", to: "f:a/two.ts", kind: "calls" },
      { from: "f:a/README.md", to: "f:a/one.ts", kind: "mentions" },
    ],
  };
}

beforeEach(() => {
  walks.mockClear();
});

describe("TuxArchitectureMap: what a selection and a level change compute (#227)", () => {
  it("computes the radius and the radius by kind once per selection, and only the second for a chip", async () => {
    const w = await mountSuspended(TuxArchitectureMap, { props: { model: model(), initialLevel: 3, initialFocus: "c-a" } });
    const s = stateOf(w);
    s.selectElement("f:a/one.ts");
    await nextTick();
    const base = s.selectionBlastBase;
    const filtered = s.selectionBlast;
    expect(walks).toHaveBeenCalledTimes(2);
    // `mentions` is off by default: the README is in the unfiltered radius only
    expect(base.hits.has("f:a/README.md")).toBe(true);
    expect(filtered.hits.has("f:a/README.md")).toBe(false);
    expect(filtered.hits.has("f:b/three.ts")).toBe(true);
    const opts = { model: s.activeModel, intent: s.blastIntent };
    expect(filtered).toEqual(
      realWalk(s.effectiveModelLinks, "f:a/one.ts", s.parentOf, { ...opts, kinds: s.activeUsageKindsSet }),
    );

    // a kind chip turned on filters again; the unfiltered radius stays
    s.toggleUsageKind("mentions");
    await nextTick();
    expect(s.selectionBlast.hits.has("f:a/README.md")).toBe(true);
    expect(s.selectionBlastBase).toBe(base);
    expect(walks).toHaveBeenCalledTimes(3);
    w.unmount();
  });

  it("computes the branch's radius once for the model, whatever the level", async () => {
    const w = await mountSuspended(TuxArchitectureMap, {
      props: { model: model(true), initialLevel: 3, initialFocus: "c-a", initialShowBlastRadius: true },
    });
    const s = stateOf(w);
    await nextTick();
    expect(s.blastRadiusState.directIds.has("f:a/one.ts")).toBe(true);
    expect(s.blastRadiusState.impactedIds.has("f:a/two.ts")).toBe(true);
    expect(walks).toHaveBeenCalledTimes(1);

    s.goToLevel(2, {});
    await nextTick();
    expect(s.blastRadiusState.directIds.has("c-a")).toBe(true);
    expect(s.blastRadiusState.impactedIds.has("c-b")).toBe(true);
    s.goToLevel(3, { nextFocus: "c-a" });
    await nextTick();
    expect(s.blastRadiusState.impactedIds.has("f:a/two.ts")).toBe(true);
    expect(walks).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});
