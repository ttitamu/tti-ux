/**
 * The stage builders, run over a normalized model outside the component: what a test calls to say "this model
 * renders" without mounting anything.
 */
import { expect } from "vitest";
import {
  buildMapParentIndex,
  resolveModelRawLinks,
  type TuxMapDeploymentNode,
  type TuxMapLevelElement,
  type TuxMapNormalizedModel,
  type TuxMapWireCategory,
} from "../../app/utils/tuxArchitectureMap";
import {
  buildStageBase,
  buildStageData,
  type StageModelContext,
  type StageToggles,
} from "../../app/utils/internal/tuxArchitectureMapStage";

function stageContext(model: TuxMapNormalizedModel): StageModelContext {
  const lookup: Record<string, TuxMapLevelElement> = Object.create(null);
  const index = (kids: TuxMapLevelElement[], parent?: string) => {
    kids.forEach((k, i) => {
      const id = k.id || `${parent}/${i}`;
      lookup[id] = parent ? { ...k, id, parent } : k;
      if (Array.isArray(k.children)) index(k.children, id);
    });
  };
  index(model.level1.elements);
  index(model.level2.elements as TuxMapLevelElement[]);
  for (const [cid, kids] of Object.entries(model.level3)) index(kids, cid);
  for (const [key, sg] of Object.entries(model.subgraphs)) index(sg.elements, key);
  const resById: Record<string, TuxMapDeploymentNode> = Object.create(null);
  for (const n of model.level4.nodes) resById[n.id] = n;
  return { model, rawLinks: resolveModelRawLinks(model), lookup, resById, parentOf: buildMapParentIndex(model) };
}

const TOGGLES: StageToggles = {
  showPlanned: true,
  wireCategories: new Set<TuxMapWireCategory>(),
  splitIds: new Set<string>(),
  countOtherSharedParts: () => 0,
};

/**
 * Builds every level's stage the way the component does and returns the levels built. Level 3 is built for the
 * container `c-a`, level 5 for `level5Focus` when it is given. A reader that meets a shape it cannot take throws here.
 */
export function buildEveryStage(model: TuxMapNormalizedModel, level5Focus?: string): number[] {
  const ctx = stageContext(model);
  const built: number[] = [];
  for (const [level, focus] of [
    [1, null],
    [2, null],
    [3, "c-a"],
    [4, null],
    ...(level5Focus ? ([[5, level5Focus]] as const) : []),
  ] as const) {
    const sg = level >= 5 && focus ? (model.subgraphs[focus] ?? null) : null;
    const data = buildStageData(buildStageBase(ctx, level, focus, sg), TOGGLES);
    expect(data).toBeTypeOf("object");
    built.push(level);
  }
  return built;
}
