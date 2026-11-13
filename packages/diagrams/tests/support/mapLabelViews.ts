/**
 * Every view of the fixtures the wire-label tests read (#210): the docs sample model, the real
 * producer's output and the three synthetic repositories of the benchmark, each at Level 1, Level 2,
 * every Level 3 container and every subgraph (Level 5 and deeper), built the way the component
 * builds its stage. Level 4 draws no wire labels and is left out.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  collapseModelSubgraphs,
  levelForFocus,
  sanitizeMapModel,
  type TuxMapGridCellRect,
  type TuxMapLevelElement,
  type TuxMapLevelRel,
  type TuxMapNormalizedModel,
  type TuxMapWireCategory,
} from "../../app/utils/tuxArchitectureMap";
import { DEFAULT_TTI_LEVEL_MODEL } from "../../app/utils/tuxArchitectureMapSample";
import { buildStageBase, buildStageData } from "../../app/utils/internal/tuxArchitectureMapStage";
import { mapBenchModels, MAP_BENCH_SIZES } from "./mapBench";
import { STAGE_TOGGLES, stageContext } from "./mapStages";

export interface LabelView {
  fixture: string;
  level: number;
  focus: string | null;
  rels: TuxMapLevelRel[];
  rects: Record<string, TuxMapGridCellRect>;
  els: TuxMapLevelElement[];
}

function prepared(raw: unknown): TuxMapNormalizedModel {
  return collapseModelSubgraphs(sanitizeMapModel(raw).model).model;
}

export function labelFixtureModels(): Record<string, TuxMapNormalizedModel> {
  const out: Record<string, TuxMapNormalizedModel> = {
    sample: prepared(DEFAULT_TTI_LEVEL_MODEL),
    "real-producer": prepared(
      JSON.parse(readFileSync(join(import.meta.dirname, "..", "fixtures", "map-real-producer.json"), "utf8")),
    ),
  };
  const synthetic = mapBenchModels();
  for (const s of MAP_BENCH_SIZES) out[`synthetic-${s.key.slice(1)}`] = prepared(synthetic[s.key].model);
  return out;
}

/**
 * The views of one model, built the way the component builds its stage: Level 1, Level 2, every
 * Level 3 container, then every subgraph. `deepEvery` keeps one subgraph in that many, for a model
 * whose every view costs a pass over tens of thousands of links.
 */
export function labelViewsOf(fixture: string, model: TuxMapNormalizedModel, deepEvery = 1): LabelView[] {
  const ctx = stageContext(model);
  // as the component does: a Level 2 reference carries the fields of the Level 1 element it names
  for (const e of model.level2.elements) {
    if (!e.ref) continue;
    const named = model.level1.elements.find((x) => x.id === e.id);
    ctx.lookup[e.id] = { ...named, ...e, name: e.name ?? named?.name ?? e.id } as TuxMapLevelElement;
  }
  const toggles = { ...STAGE_TOGGLES, wireCategories: new Set<TuxMapWireCategory>(["prod"]) };
  const views: [number, string | null][] = [
    [1, null],
    [2, null],
    ...Object.keys(model.level3).map((id): [number, string] => [3, id]),
    ...Object.keys(model.subgraphs)
      .filter((_, i) => i % deepEvery === 0)
      .map((id): [number, string] => [levelForFocus(id, model, ctx.parentOf), id]),
  ];
  return views.map(([level, focus]) => {
    const sg = level >= 5 && focus ? (model.subgraphs[focus] ?? null) : null;
    const data = buildStageData(buildStageBase(ctx, level, focus, sg), toggles);
    return { fixture, level, focus, rels: data.rels, rects: data.rects, els: data.els };
  });
}

/** How many of the largest synthetic model's subgraphs the unit test skips between two it reads. */
export const LARGEST_FIXTURE_DEEP_EVERY = 16;

/** Every view the port-label test reads; `all` reads every subgraph of the largest model too (90 s). */
export function labelFixtureViews(all = false): LabelView[] {
  const out: LabelView[] = [];
  for (const [name, model] of Object.entries(labelFixtureModels())) {
    out.push(...labelViewsOf(name, model, !all && name === "synthetic-10000" ? LARGEST_FIXTURE_DEEP_EVERY : 1));
  }
  return out;
}
