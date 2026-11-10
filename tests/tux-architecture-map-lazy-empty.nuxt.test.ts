// The lazy-load path of <TuxArchitectureMap> when `resolveSubgraph` answers with
// nothing the map can show (#156): the resolver is asked once per card, a
// failure is not remembered, and a new source or a new model is asked again.
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../packages/diagrams/app/components/TuxArchitectureMap.vue";
import type { TuxMapLevelModel, TuxMapSubgraph } from "../packages/diagrams/app/utils/tuxArchitectureMap";

type Resolver = (id: string, ref?: string) => Promise<TuxMapSubgraph | null>;

function lazyModel(): TuxMapLevelModel {
  return {
    level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
    level2: {
      boundary: "sys",
      elements: [{ id: "c1", kind: "container", name: "Service Container" }],
      rels: [],
    },
    level3: {
      c1: [
        { id: "comp-lazy", kind: "component", name: "Lazy Component", subgraphRef: "sg-lazy" },
        { id: "comp-peer", kind: "component", name: "Peer Component" },
      ],
    },
    level4: { groups: [], nodes: [], links: [] },
  };
}

/**
 * A resolver that answers `answer(n)` on its n-th call. Unfixed, the map asked
 * again from inside the same promise chain, with no timer between calls, so a
 * test could never time out: past `ceiling` calls the resolver rejects, which
 * ends that chain and leaves the call count as the evidence.
 */
function countingResolver(answer: (n: number) => TuxMapSubgraph | null, ceiling = 8) {
  let n = 0;
  return vi.fn<Resolver>(() => {
    n++;
    if (n > ceiling) return Promise.reject(new Error("asked again without end"));
    return Promise.resolve(answer(n));
  });
}

async function settle() {
  for (let i = 0; i < 40; i++) {
    await Promise.resolve();
    await nextTick();
  }
}

async function mountLazy(resolveSubgraph: Resolver, model: TuxMapLevelModel = lazyModel()) {
  return mountSuspended(TuxArchitectureMap, {
    props: { model, initialLevel: 3, initialFocus: "c1", resolveSubgraph },
  });
}

type Mounted = Awaited<ReturnType<typeof mountLazy>>;

const zoomBadge = (w: Mounted) => w.find('button.tux-map__el-zb[data-zb-for="comp-lazy"]');

/** Zooms into the lazy card by its badge, or by a double-click once the badge is gone. */
async function interact(w: Mounted) {
  const zb = zoomBadge(w);
  if (zb.exists()) await zb.trigger("click");
  else await w.find('.tux-map__el[data-id="comp-lazy"]').trigger("dblclick");
  await settle();
}

const diagNote = (w: Mounted) => w.find('[data-map-diagnostic="true"]');

/** Non-empty as returned, empty once sanitized: its only element is the card that owns it (a cycle). */
const selfCycle = (): TuxMapSubgraph => ({
  stratum: "Files",
  elements: [{ id: "comp-lazy", kind: "file", name: "self.ts" }],
  rels: [],
});

describe("TuxArchitectureMap lazy subgraph that resolves empty (#156)", () => {
  it("asks once for a subgraph with no elements, and once for null", async () => {
    for (const answer of [{ stratum: "Files", elements: [], rels: [] } as TuxMapSubgraph, null]) {
      const resolveSubgraph = countingResolver(() => answer);
      const w = await mountLazy(resolveSubgraph);
      expect(zoomBadge(w).exists()).toBe(true);
      await interact(w);
      await interact(w);
      await interact(w);
      expect(resolveSubgraph).toHaveBeenCalledTimes(1);
      expect(resolveSubgraph).toHaveBeenCalledWith("sg-lazy", undefined);
      // The card stops offering a level it does not have, and the map stays where it was.
      expect(zoomBadge(w).exists()).toBe(false);
      expect(w.find('.tux-map__el[data-id="comp-peer"]').exists()).toBe(true);
      // Nothing inside is an answer, not a problem with the model.
      expect(diagNote(w).exists()).toBe(false);
      w.unmount();
    }
  });

  it("asks once for a subgraph that is non-empty as returned and empty after sanitizing", async () => {
    const resolveSubgraph = countingResolver(selfCycle);
    const w = await mountLazy(resolveSubgraph);
    await interact(w);
    expect(resolveSubgraph).toHaveBeenCalledTimes(1);
    await interact(w);
    await interact(w);
    expect(resolveSubgraph).toHaveBeenCalledTimes(1);
    expect(zoomBadge(w).exists()).toBe(false);
    expect(w.find('.tux-map__el[data-id="comp-peer"]').exists()).toBe(true);
    w.unmount();
  });

  it("asks once when the elements are not objects at all", async () => {
    const resolveSubgraph = countingResolver(
      () => ({ stratum: "Files", elements: ["a.ts", 7, null], rels: [] }) as unknown as TuxMapSubgraph,
    );
    const w = await mountLazy(resolveSubgraph);
    await interact(w);
    await interact(w);
    expect(resolveSubgraph).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it("reports the emptied subgraph once in the model diagnostics", async () => {
    const resolveSubgraph = countingResolver(selfCycle);
    const w = await mountLazy(resolveSubgraph);
    expect(diagNote(w).exists()).toBe(false);
    await interact(w);
    const first = diagNote(w).text();
    expect(first).toContain("1 lazy subgraph resolved empty");
    expect(first).toContain('"sg-lazy"');
    expect(first.split('"sg-lazy"').length - 1).toBe(1);
    await interact(w);
    await interact(w);
    expect(diagNote(w).text()).toBe(first);
    w.unmount();
  });

  it("does not remember a failure: a rejection or a throw is asked again on the next interaction", async () => {
    const rejecting = vi.fn<Resolver>(() => Promise.reject(new Error("offline")));
    const w1 = await mountLazy(rejecting);
    await interact(w1);
    expect(rejecting).toHaveBeenCalledTimes(1);
    expect(zoomBadge(w1).exists()).toBe(true);
    expect(w1.find(".tux-map__el-busy").exists()).toBe(false);
    await interact(w1);
    expect(rejecting).toHaveBeenCalledTimes(2);
    expect(diagNote(w1).exists()).toBe(false);
    w1.unmount();

    const throwing = vi.fn<Resolver>(() => {
      throw new Error("bad resolver");
    });
    const w2 = await mountLazy(throwing);
    await interact(w2);
    await interact(w2);
    expect(throwing).toHaveBeenCalledTimes(2);
    expect(zoomBadge(w2).exists()).toBe(true);
    w2.unmount();

    // A failure, then an answer: the answer is used.
    let n = 0;
    const flaky = vi.fn<Resolver>(() => {
      n++;
      if (n === 1) return Promise.reject(new Error("offline"));
      return Promise.resolve({
        stratum: "Files",
        elements: [{ id: "f:lazy/worker.ts", kind: "file", name: "worker.ts" }],
        rels: [],
      });
    });
    const w3 = await mountLazy(flaky);
    await interact(w3);
    await interact(w3);
    expect(flaky).toHaveBeenCalledTimes(2);
    expect(w3.find('.tux-map__el[data-id="f:lazy/worker.ts"]').exists()).toBe(true);
    w3.unmount();
  });

  it("asks a new resolveSubgraph again, and uses what it returns", async () => {
    const first = countingResolver(selfCycle);
    const w = await mountLazy(first);
    await interact(w);
    await interact(w);
    expect(first).toHaveBeenCalledTimes(1);
    expect(diagNote(w).text()).toContain("resolved empty");

    const second = countingResolver(() => ({
      stratum: "Files",
      elements: [{ id: "f:lazy/worker.ts", kind: "file", name: "worker.ts" }],
      rels: [],
    }));
    await w.setProps({ resolveSubgraph: second });
    await settle();
    expect(zoomBadge(w).exists()).toBe(true);
    expect(diagNote(w).exists()).toBe(false);
    await interact(w);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(w.find('.tux-map__el[data-id="f:lazy/worker.ts"]').exists()).toBe(true);
    w.unmount();
  });

  it("asks again after a new model or a new modelRef", async () => {
    for (const answer of [selfCycle, () => null]) {
      const resolveSubgraph = countingResolver(answer);
      const w = await mountLazy(resolveSubgraph);
      await interact(w);
      await interact(w);
      expect(resolveSubgraph).toHaveBeenCalledTimes(1);

      await w.setProps({ model: lazyModel() });
      await settle();
      expect(zoomBadge(w).exists()).toBe(true);
      expect(diagNote(w).exists()).toBe(false);
      await interact(w);
      await interact(w);
      expect(resolveSubgraph).toHaveBeenCalledTimes(2);

      await w.setProps({ modelRef: "def5678" });
      await settle();
      await interact(w);
      await interact(w);
      expect(resolveSubgraph).toHaveBeenCalledTimes(3);
      expect(resolveSubgraph).toHaveBeenLastCalledWith("sg-lazy", "def5678");
      w.unmount();
    }
  });

  it("does not record an answer that arrives from a resolver the map no longer has", async () => {
    let release!: (sg: TuxMapSubgraph | null) => void;
    const slow = vi.fn<Resolver>(() => new Promise((res) => (release = res)));
    const w = await mountLazy(slow);
    await zoomBadge(w).trigger("click");
    await nextTick();
    expect(slow).toHaveBeenCalledTimes(1);

    const next = countingResolver(() => ({
      stratum: "Files",
      elements: [{ id: "f:lazy/worker.ts", kind: "file", name: "worker.ts" }],
      rels: [],
    }));
    await w.setProps({ resolveSubgraph: next });
    release(selfCycle());
    await settle();
    expect(diagNote(w).exists()).toBe(false);
    expect(zoomBadge(w).exists()).toBe(true);
    await interact(w);
    expect(next).toHaveBeenCalledTimes(1);
    expect(w.find('.tux-map__el[data-id="f:lazy/worker.ts"]').exists()).toBe(true);
    w.unmount();
  });
});
