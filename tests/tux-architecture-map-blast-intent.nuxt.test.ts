// @vitest-environment nuxt
/**
 * The blast radius intent in a mounted map (#259): the select says what each intent is, the key
 * under the legend names what the chosen one follows, stops at and skips, switching it changes the
 * lit cards where the model's links tell the intents apart, and where they do not the key says the
 * cards are General's. The definitions themselves are checked against the walk in
 * `packages/diagrams/tests/map-blast-intents.test.ts`.
 */
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { TUX_MAP_BLAST_INTENTS } from "../packages/diagrams/app/utils/tuxArchitectureMap";
import { DEFAULT_TTI_LEVEL_MODEL } from "../packages/diagrams/app/utils/tuxArchitectureMapSample";

type Mounted = Awaited<ReturnType<typeof mountSuspended>>;

const mountAt = (selected: string) =>
  mountSuspended(TuxArchitectureMap, {
    props: {
      model: DEFAULT_TTI_LEVEL_MODEL,
      initialLevel: 2,
      initialSelectedId: selected,
      initialShowBlastRadius: true,
    },
  });

/** The cards lit as depending on the selection, by id. */
const litCards = (w: Mounted): string[] =>
  w
    .findAll(".tux-map__el--diff-impact")
    .map((c) => c.attributes("data-id")!)
    .sort();

async function choose(w: Mounted, intent: string): Promise<void> {
  await w.find("select.tux-map__intent-select").setValue(intent);
  await nextTick();
}

const key = (w: Mounted) => w.find("[data-blast-intent-key]");

describe("TuxArchitectureMap: the blast radius intent (#259)", () => {
  it("describes each intent on its option and the chosen one on the select and in the key", async () => {
    const w = await mountAt("c-workers");
    const select = w.find("select.tux-map__intent-select");
    const options = select.findAll("option");
    expect(options.map((o) => o.attributes("value"))).toEqual(TUX_MAP_BLAST_INTENTS.map((d) => d.id));
    expect(options.map((o) => o.attributes("title"))).toEqual(TUX_MAP_BLAST_INTENTS.map((d) => d.description));
    expect(select.attributes("aria-describedby")).toBe(key(w).attributes("id"));

    await choose(w, "patch");
    expect(select.attributes("title")).toContain("keeps its signature, types and build");
    const text = key(w).text();
    expect(text).toContain("Intent: Body patch.");
    expect(text).toContain("Follows contracts (routes, code imports), calls and uses");
    expect(text).toContain("skips type-only imports, build-time steps, page links");
  });

  it("lights a different set of cards for each walk where the links tell the intents apart", async () => {
    const w = await mountAt("c-workers");
    const general = litCards(w);
    expect(general).toEqual(expect.arrayContaining(["c-edge", "c-observability", "c-scheduler", "c-web"]));
    expect(key(w).find("[data-blast-intent-vs]").exists()).toBe(false);

    await choose(w, "patch");
    expect(litCards(w)).toEqual(["c-web"]);
    expect(key(w).find("[data-blast-intent-vs]").text()).toBe(
      `Body patch lights 1 card here; General lights ${general.length}.`,
    );

    await choose(w, "supply-chain");
    expect(litCards(w)).toEqual(["c-scheduler", "c-web"]);

    await choose(w, "refactor");
    expect(litCards(w)).toEqual(["c-observability", "c-scheduler", "c-web"]);

    await choose(w, "cut");
    expect(litCards(w)).toEqual(["c-observability", "c-scheduler", "c-web"]);

    await choose(w, "default");
    expect(litCards(w)).toEqual(general);
  });

  it("says the cards are General's where the intent changes nothing on the view", async () => {
    // what depends on the Core API reaches it through C4 relationships only, which every intent follows
    const w = await mountAt("c-api");
    const general = litCards(w);
    expect(general.length).toBeGreaterThan(0);
    await choose(w, "supply-chain");
    expect(litCards(w)).toEqual(general);
    expect(key(w).find("[data-blast-intent-vs]").text()).toBe(
      "Same cards as General on this view: nothing here that Supply chain skips or stops at changes what is lit.",
    );
  });
});
