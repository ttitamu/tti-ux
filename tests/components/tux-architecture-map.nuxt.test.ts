import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { EMPTY_TTI_LEVEL_MODEL, type TuxMapLevelModel } from "../../packages/diagrams/app/utils/tuxArchitectureMap";
import { DEFAULT_TTI_LEVEL_MODEL } from "../../packages/diagrams/app/utils/tuxArchitectureMapSample";
import { runComponentAxe } from "../axe-helper";

describe("TuxArchitectureMap Component", () => {
  it("opens an outside card's wires on hover without rebuilding the stage (#141)", async () => {
    const model: TuxMapLevelModel = {
      level1: { title: "x", elements: [{ id: "sys", kind: "system", name: "S", at: [1, 1] }], rels: [] },
      level2: {
        title: "c",
        boundary: "sys",
        elements: [{ id: "c-gw", kind: "container", name: "GW", at: [1, 1] }],
        rels: [],
      },
      level3: {
        "c-gw": [
          { id: "comp-a", kind: "component", name: "A", at: [1, 1] },
          { id: "comp-b", kind: "component", name: "B", at: [3, 1] },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "comp-a": { stratum: "Files", elements: [{ id: "f:a.py", kind: "module", name: "a.py", at: [1, 1] }] },
        "comp-b": {
          stratum: "Files",
          elements: [
            { id: "f:b1.py", kind: "module", name: "b1.py", at: [1, 1] },
            { id: "f:b2.py", kind: "module", name: "b2.py", at: [2, 1] },
          ],
        },
      },
      links: [
        { from: "f:a.py", to: "f:b1.py", kind: "calls" },
        { from: "f:a.py", to: "f:b2.py", kind: "calls" },
      ],
    } as unknown as TuxMapLevelModel;
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 5, initialFocus: "comp-b" },
    });
    await nextTick();
    const state = (wrapper.vm as unknown as { $: { setupState: Record<string, any> } }).$.setupState;
    const stageBefore = state.stageData;
    const targets = () => state.routedSvg.wires.map((w: { to: string }) => w.to).sort();

    // At rest the outside card has one wire, to the boundary.
    expect(targets()).toEqual(["@bound"]);

    const card = wrapper.find('.tux-map__el[data-id="f:b1.py"]').element as HTMLElement;
    card.dispatchEvent(new window.MouseEvent("pointerover", { bubbles: true }));
    await nextTick();

    // Hovering an inner card it reaches opens that wire card by card, and the
    // stage (folding, lifting, layout) is not computed again.
    expect(state.hoveredStageCardId).toBe("f:b1.py");
    expect(targets()).toEqual(["f:b1.py", "f:b2.py"]);
    expect(state.stageData).toBe(stageBefore);
  });

  it("warns once in the console when the model a host passes has no schema name, or an unknown one (#162)", async () => {
    const bare = (): TuxMapLevelModel => ({
      level1: { elements: [{ id: "sys", kind: "system", name: "S" }], rels: [] },
      level2: { boundary: "sys", elements: [{ id: "c-a", kind: "container", name: "A" }], rels: [] },
      level3: {},
      level4: { groups: [], nodes: [], links: [] },
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const schemaWarnings = () => warn.mock.calls.map((c) => String(c[0])).filter((m) => m.includes("schema"));

      // Unstamped: one warning, and the map still draws the model.
      const unstamped = await mountSuspended(TuxArchitectureMap, { props: { model: bare() } });
      await nextTick();
      expect(schemaWarnings()).toHaveLength(1);
      expect(schemaWarnings()[0]).toContain("[TuxArchitectureMap]");
      expect(schemaWarnings()[0]).toContain("no 'schema' field");
      expect(schemaWarnings()[0]).toContain('"tux-map/1"');
      expect(unstamped.find('.tux-map__el[data-id="c-a"]').exists()).toBe(true);
      expect(unstamped.text()).not.toContain("Model diagnostics");
      // A recompute of the same model (a lazily resolved subgraph) does not repeat it.
      const state = (unstamped.vm as unknown as { $: { setupState: Record<string, any> } }).$.setupState;
      state.resolvedSubgraphs = { "c-a": { stratum: "Files", elements: [{ id: "f:x.py", kind: "module", name: "x.py" }] } };
      await nextTick();
      expect(schemaWarnings()).toHaveLength(1);
      // A different model object is a different document: it is checked again.
      await unstamped.setProps({ model: bare() });
      await nextTick();
      expect(schemaWarnings()).toHaveLength(2);
      unstamped.unmount();

      // Stamped, and the no-model default: silent.
      warn.mockClear();
      (await mountSuspended(TuxArchitectureMap, { props: { model: { ...bare(), schema: "tux-map/1" } } })).unmount();
      (await mountSuspended(TuxArchitectureMap, { props: { model: DEFAULT_TTI_LEVEL_MODEL } })).unmount();
      (await mountSuspended(TuxArchitectureMap, { props: {} })).unmount();
      await nextTick();
      expect(schemaWarnings()).toHaveLength(0);

      // A schema name this release does not know: one warning naming both, and the map still draws.
      const future = await mountSuspended(TuxArchitectureMap, {
        props: { model: { ...bare(), schema: "tux-map/2" } as unknown as TuxMapLevelModel },
      });
      await nextTick();
      expect(schemaWarnings()).toHaveLength(1);
      expect(schemaWarnings()[0]).toContain('"tux-map/2"');
      expect(schemaWarnings()[0]).toContain('"tux-map/1"');
      expect(future.find('.tux-map__el[data-id="c-a"]').exists()).toBe(true);
      future.unmount();
    } finally {
      warn.mockRestore();
    }
  });

  it("renders Level 2 by default and passes axe accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
      },
    });

    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 2 of 6");
    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("updates focusId when selecting a Level 2 container with Level 3 children and opens it on Level 3 click (#103)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
        initialFocus: "c-edge",
      },
    });

    // Select a different drillable container (c-search) on Level 2
    const searchCard = wrapper.find('.tux-map__el[data-id="c-search"]');
    expect(searchCard.exists()).toBe(true);
    await searchCard.trigger("click");
    await nextTick();

    // Emits update:focus and node-select
    expect(wrapper.emitted("update:focus")?.at(-1)).toEqual(["c-search"]);
    expect(wrapper.emitted("update:selectedId")?.at(-1)).toEqual(["c-search"]);
    expect(wrapper.emitted("node-select")?.at(-1)?.[0]).toMatchObject({ id: "c-search" });

    // Click the N+1 Zoom-In (+) stepper button — should open c-search in Level 3, not the initial c-edge
    const zoomInBtn = wrapper.find('.tux-map__iconbtn[aria-label="Zoom in on the chosen element"]');
    await zoomInBtn.trigger("click");
    await nextTick();

    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 3 of 6");
    expect(wrapper.find(".tux-map__bound-label b").text()).toBe("AI Search Service");
    // Switching levels clears selection and emits node-select(null)
    expect(wrapper.emitted("node-select")?.at(-1)).toEqual([null]);
  });

  it("emits update:showPlanned and update:view and supports initialView='list' (#103)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
        initialView: "list",
      },
    });

    expect(wrapper.find(".tux-map__list").exists()).toBe(true);

    const plannedCheckbox = wrapper.find('.tux-map__switch input[type="checkbox"]');
    await plannedCheckbox.setValue(true);
    await nextTick();
    expect(wrapper.emitted("update:showPlanned")?.at(-1)).toEqual([true]);

    const displayButtons = wrapper.findAll('.tux-map__seg[aria-label="Display mode"] button');
    await displayButtons[0]!.trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:view")?.at(-1)).toEqual(["diagram"]);
    expect(wrapper.find(".tux-map__list").exists()).toBe(false);
  });

  it("renders custom level4.zones titles and roadmap links when issueBaseUrl is provided (#103)", async () => {
    const customModel: TuxMapLevelModel = {
      ...DEFAULT_TTI_LEVEL_MODEL,
      issueBaseUrl: "https://code.tti.tamu.edu/nis/forgejo-stack/issues",
      level2: {
        ...DEFAULT_TTI_LEVEL_MODEL.level2,
        elements: DEFAULT_TTI_LEVEL_MODEL.level2.elements.map((e) =>
          e.id === "c-api" ? { ...e, roadmap: [376, 412] } : e,
        ),
      },
      level4: {
        ...DEFAULT_TTI_LEVEL_MODEL.level4,
        centerTitle: "Custom Cloud Enclave",
        zones: [
          { id: "people", title: "Campus Browsers", column: "left" },
          { id: "azure-local", title: "Campus Mac Mini Closet", column: "right", planned: true },
        ],
      },
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: customModel,
        initialLevel: 2,
        initialSelectedId: "c-api",
        initialShowPlanned: true,
      },
    });

    // Roadmap links rendered in the inspector drawer
    const issueLinks = wrapper.findAll(".tux-map__issue-lnk");
    expect(issueLinks.length).toBeGreaterThanOrEqual(2);
    expect(issueLinks[0]!.attributes("href")).toBe(
      "https://code.tti.tamu.edu/nis/forgejo-stack/issues/376",
    );
    expect(issueLinks[0]!.text()).toBe("#376");

    // Switch to Level 4 via Infrastructure perspective toggle and verify custom zone boundary titles
    const infraBtn = wrapper.find('.tux-map__seg[aria-label="Topology perspective"] button');
    await infraBtn.trigger("click");
    await nextTick();

    const boundLabels = wrapper.findAll(".tux-map__bound-label b").map((b) => b.text());
    expect(boundLabels).toContain("Custom Cloud Enclave");
    expect(boundLabels).toContain("Campus Browsers");
    expect(boundLabels).toContain("Campus Mac Mini Closet");
  });

  it("supports fractal Level 5 & Level 6 drill-down from Level 4 deployment nodes and Level 3 components", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 4,
      },
    });

    // Level 4 deployment node `ai-search-app` has a Level 5 subgraph
    const deployCard = wrapper.find('.tux-map__el[data-id="ai-search-app"]');
    expect(deployCard.exists()).toBe(true);
    expect(deployCard.classes()).toContain("tux-map__el--zoomable");

    // Double-click `ai-search-app` to drill into Level 5
    await deployCard.trigger("dblclick");
    await nextTick();

    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 5 of 6");
    expect(wrapper.emitted("drill-down")?.at(-1)?.[0]).toMatchObject({
      level: 5,
      focusId: "ai-search-app",
    });

    // Level 5 module `ai-search-app/retriever` has a Level 6 AST subgraph
    const retrieverCard = wrapper.find('.tux-map__el[data-id="ai-search-app/retriever"]');
    expect(retrieverCard.exists()).toBe(true);
    expect(retrieverCard.classes()).toContain("tux-map__el--zoomable");

    await retrieverCard.trigger("dblclick");
    await nextTick();

    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 6 of 6");
    const symCard = wrapper.find('.tux-map__el[data-id="ai-search-app/retriever/rrf"]');
    expect(symCard.exists()).toBe(true);

    // Clicking zoom-out (−) pops drillStack back to Level 5 and then Level 4
    const zoomOutBtn = wrapper.find('.tux-map__iconbtn[aria-label="Zoom out a level"]');
    await zoomOutBtn.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 5 of 6");

    await zoomOutBtn.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 4 of 6");
  });

  it("highlights modified and impacted nodes when Blast Radius is toggled and renders source code links", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
        initialSelectedId: "c-api",
        initialShowBlastRadius: true,
      },
    });

    // Direct modified container (`c-api`) and impacted neighbors (`c-edge`, `c-db`) get blast classes
    const apiCard = wrapper.find('.tux-map__el[data-id="c-api"]');
    const edgeCard = wrapper.find('.tux-map__el[data-id="c-edge"]');
    expect(apiCard.classes()).toContain("tux-map__el--diff-direct");
    expect(edgeCard.classes()).toContain("tux-map__el--diff-impact");

    // Source code link rendered in inspector drawer
    const srcLink = wrapper.find(".tux-map__source-lnk");
    expect(srcLink.exists()).toBe(true);
    expect(srcLink.attributes("href")).toContain("services/api/cmd/server/main.go#L1-L148");
  });

  it("scopes sticky notes to the level and focusId where they were created", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
        notes: [
          {
            id: "n-lvl2",
            x: 100,
            y: 100,
            text: "Level 2 note",
            level: 2,
          },
          {
            id: "n-lvl3-api",
            x: 120,
            y: 120,
            text: "Level 3 API note",
            level: 3,
            focusId: "c-api",
          },
        ],
      },
    });

    // Only Level 2 note is visible on Level 2
    expect(wrapper.findAll(".tux-map__note").length).toBe(1);
    expect(wrapper.find(".tux-map__note-body").text()).toBe("Level 2 note");

    // Step in to Level 3 focused on c-api via N+1 Zoom-In (+) stepper
    const zoomInBtn = wrapper.find('.tux-map__iconbtn[aria-label="Zoom in on the chosen element"]');
    await zoomInBtn.trigger("click");
    await nextTick();

    expect(wrapper.findAll(".tux-map__note").length).toBe(1);
    expect(wrapper.find(".tux-map__note-body").text()).toBe("Level 3 API note");
  });

  it("attaches the magnetic proximity frame in the 36px halo and glides to the closest zoomable card on wheel scroll instead of stale focusId", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
        initialFocus: "c-edge",
      },
    });

    // Vue Flow–style animated wire streams are rendered
    expect(wrapper.findAll(".tux-map__wire-fg--stream").length).toBeGreaterThan(0);

    const stageStyle = wrapper.find(".tux-map__stage").attributes("style") || "";
    const scaleMatch = stageStyle.match(/scale\(([\d.]+)\)/);
    const scale = Number(scaleMatch?.[1] ?? 1);

    const searchCard = wrapper.find('.tux-map__el[data-id="c-search"]');
    const styleAttr = searchCard.attributes("style") || "";
    const leftMatch = styleAttr.match(/left:\s*(\d+)px/);
    const topMatch = styleAttr.match(/top:\s*(\d+)px/);
    const cardLeft = Number(leftMatch?.[1] ?? 500);
    const cardTop = Number(topMatch?.[1] ?? 200);

    // 1. Passive pointermove outside the 36px halo (e.g., 55px above c-search) does NOT activate proximity frame
    const viewport = wrapper.find(".tux-map__viewport");
    const openSpaceClientX = Math.round((cardLeft + 40) * scale);
    const openSpaceClientY = Math.round((cardTop - 55) * scale);
    viewport.element.dispatchEvent(
      new MouseEvent("pointermove", {
        clientX: openSpaceClientX,
        clientY: openSpaceClientY,
        bubbles: true,
      }),
    );
    await nextTick();
    expect(wrapper.find(".tux-map__proximity-frame").exists()).toBe(false);

    // 2. Initiating a mouse wheel scroll in that empty space (55px away from c-search) snaps proximity
    // to the closest zoomable card (`c-search`, NOT the stale `c-edge`) and glides the tether toward it
    viewport.element.dispatchEvent(
      new WheelEvent("wheel", {
        clientX: openSpaceClientX,
        clientY: openSpaceClientY,
        deltaY: -14,
        bubbles: true,
        cancelable: true,
      }),
    );
    await nextTick();

    const proxFrame = wrapper.find(".tux-map__proximity-frame");
    expect(proxFrame.exists()).toBe(true);
    expect(proxFrame.findAll(".tux-map__port").length).toBe(4);
    expect(proxFrame.text()).toContain("AI Search Service");
    expect(viewport.classes()).toContain("tux-map__viewport--proximity-zoom");

    // 3. Continuing the wheel scroll completes the zoom into `c-search` (AI Search Service)
    viewport.element.dispatchEvent(
      new WheelEvent("wheel", {
        clientX: openSpaceClientX,
        clientY: openSpaceClientY,
        deltaY: -24,
        bubbles: true,
        cancelable: true,
      }),
    );
    await nextTick();

    expect(wrapper.find(".tux-map__level-text").text()).toBe("Level 3 of 6");
    expect(wrapper.find(".tux-map__bound-label b").text()).toBe("AI Search Service");
  });

  it("lifts code links onto Level 5+, draws outside cards, goes to one on double-click, and lists a selection's blast radius", async () => {
    const codeModel: TuxMapLevelModel = {
      ...DEFAULT_TTI_LEVEL_MODEL,
      sourceBaseUrl: "https://code.tti.tamu.edu/nis/forgejo-stack/src/commit/abc",
      subgraphs: {
        "c-api/0": {
          stratum: "Files",
          elements: [{ id: "f:routes.py", kind: "module", name: "routes.py", source: { path: "routes.py" } }],
        },
        "c-api/1": {
          stratum: "Files",
          elements: [{ id: "f:forge.py", kind: "module", name: "forge.py", source: { path: "forge.py" } }],
        },
        "f:routes.py": {
          stratum: "Functions",
          elements: [
            { id: "s:routes.py#data", kind: "symbol", name: "data()", source: { path: "routes.py", lineRange: [3, 9] } },
            { id: "s:routes.py#who", kind: "symbol", name: "who()", source: { path: "routes.py", lineRange: [11, 14] } },
          ],
        },
      },
      links: [
        { from: "s:routes.py#data", to: "s:routes.py#who", kind: "calls", at: "routes.py:5" },
        { from: "s:routes.py#who", to: "f:forge.py", kind: "imports", at: "routes.py:1" },
        { from: "f:forge.py", to: "s:routes.py#data", kind: "calls", at: "forge.py:40" },
      ],
    };
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: codeModel, initialLevel: 6, initialFocus: "f:routes.py" },
    });

    // the two functions, the call between them, and forge.py outside on both sides (it calls in, who() imports it)
    expect(wrapper.find('.tux-map__el[data-id="s:routes.py#data"]').exists()).toBe(true);
    const outside = wrapper.findAll('.tux-map__el--mini[data-id="f:forge.py"]');
    expect(outside.length).toBeGreaterThan(0);
    expect(outside[0]!.text()).toContain("forge.py");

    // choosing who(): the panel lists what depends on it, nearest first, with the line each link was read from
    await wrapper.find('.tux-map__el[data-id="s:routes.py#who"]').trigger("click");
    await nextTick();
    const rows = wrapper.findAll(".tux-map__blast-row");
    expect(rows.map((r) => r.find(".tux-map__blast-hop").text())).toEqual(["1 step away", "2 steps away"]);
    expect(rows[0]!.text()).toContain("routes.py");
    expect(rows[1]!.text()).toContain("forge.py");
    expect(rows[1]!.find("a.tux-map__blast-src").attributes("href")).toBe(
      "https://code.tti.tamu.edu/nis/forgejo-stack/src/commit/abc/forge.py#L40",
    );
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // double-clicking the outside card goes to where forge.py lives: Level 5 inside its component
    await outside[0]!.trigger("dblclick");
    await nextTick();
    expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 5 /);
    expect(wrapper.emitted("update:selectedId")?.at(-1)).toEqual(["f:forge.py"]);
  });

  // ── #106: phones, tablets, touch and WCAG 2.2 AAA ──────────────────────────────

  const codeModel106: TuxMapLevelModel = {
    ...DEFAULT_TTI_LEVEL_MODEL,
    subgraphs: {
      "c-api/0": { stratum: "Files", elements: [{ id: "f:routes.py", kind: "module", name: "routes.py" }] },
      "c-api/1": { stratum: "Files", elements: [{ id: "f:forge.py", kind: "module", name: "forge.py" }] },
      "f:routes.py": {
        stratum: "Functions",
        elements: [
          { id: "s:routes.py#data", kind: "symbol", name: "data()" },
          { id: "s:routes.py#who", kind: "symbol", name: "who()" },
        ],
      },
    },
    links: [
      { from: "s:routes.py#data", to: "s:routes.py#who", kind: "calls" },
      { from: "s:routes.py#who", to: "f:forge.py", kind: "imports" },
    ],
  };

  it("magnifies past fitting the width, where the viewport scrolls, and Fit returns (1.4.4, 2.5.7)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
    });
    const scale = () => Number(/scale\(([\d.]+)\)/.exec(wrapper.find(".tux-map__stage").attributes("style") || "")![1]);
    const fit = scale();
    expect(wrapper.find(".tux-map__magnify-fit").text()).toBe("Fit");
    await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await nextTick();
    expect(scale()).toBeGreaterThan(fit);
    expect(wrapper.find(".tux-map__viewport").classes()).toContain("tux-map__viewport--magnified");
    expect(wrapper.find(".tux-map__sizer").exists()).toBe(true);
    expect(wrapper.find(".tux-map__magnify-fit").text()).toMatch(/^\d+%$/);
    await wrapper.find(".tux-map__magnify-fit").trigger("click");
    await nextTick();
    expect(scale()).toBe(fit);
    expect(wrapper.find(".tux-map__viewport").classes()).not.toContain("tux-map__viewport--magnified");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });

  it("keeps the scroll when a card is chosen while magnified: only a new view moves it", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
    });
    await wrapper.find('[aria-label="Make the diagram larger"]').trigger("click");
    await nextTick();
    const vp = wrapper.find(".tux-map__viewport").element as HTMLElement;
    // the test DOM's scrollTo moves nothing, so record the calls instead
    const scrolls: unknown[][] = [];
    vp.scrollTo = ((...args: unknown[]) => void scrolls.push(args)) as typeof vp.scrollTo;
    // choosing a container with Level 3 children sets focusId, but the view stays Level 2
    await wrapper.find('.tux-map__el[data-id="c-search"]').trigger("click");
    await nextTick();
    await nextTick();
    expect(scrolls).toEqual([]);
  });

  it("lists Level 4's connections too, from level4.links", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 4, initialView: "list", initialShowPlanned: true },
    });
    const text = wrapper.findAll(".tux-map__list-rels").map((r) => r.text()).join(" ");
    expect(DEFAULT_TTI_LEVEL_MODEL.level4.links.length).toBeGreaterThan(0);
    expect(text).toMatch(/Depends on|Used by/);
  });

  it("carries the wires in the list: what each card depends on and what depends on it (1.3.1)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialView: "list" },
    });
    const text = wrapper.findAll(".tux-map__list-rels").map((r) => r.text()).join(" ");
    expect(text).toContain("Depends on");
    expect(text).toContain("Used by");
    expect(wrapper.find(".tux-map__magnify").exists()).toBe(false);
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });

  it("moves focus to the details when a list item is chosen, and back to it when they close", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialView: "list" },
      attachTo: document.body,
    });
    const item = wrapper.find(".tux-map__list button[data-list-id]");
    await item.trigger("click");
    await nextTick();
    await nextTick();
    expect(document.activeElement?.classList.contains("tux-map__panel-title")).toBe(true);
    await wrapper.find(".tux-map__panel-close").trigger("click");
    await nextTick();
    await nextTick();
    expect(document.activeElement?.getAttribute("data-list-id")).toBe(item.attributes("data-list-id"));
    wrapper.unmount();
  });

  it("offers a button for what double-clicking an outside card does, so a keyboard can do it (2.1.1)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: codeModel106, initialLevel: 6, initialFocus: "f:routes.py" },
    });
    await wrapper.find('.tux-map__el--mini[data-id="f:forge.py"]').trigger("click");
    await nextTick();
    const go = wrapper.findAll(".tux-map__panel-btn").find((b) => b.text() === "Go to where it lives");
    expect(go).toBeTruthy();
    await go!.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 5 /);
    expect(wrapper.emitted("update:selectedId")?.at(-1)).toEqual(["f:forge.py"]);
  });

  it("opens 'auto' as the diagram and switches to the list after mount on a narrow screen", async () => {
    const was = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    try {
      const wrapper = await mountSuspended(TuxArchitectureMap, {
        props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialView: "auto" },
      });
      await nextTick();
      expect(wrapper.find(".tux-map__list").exists()).toBe(true);
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: was });
    }
  });

  // ── #109 (3.9.1) ───────────────────────────────────────────────────────────────
  // The test DOM does not load the component's scoped styles, so what the
  // stylesheet must keep is read from the component's own source.

  it("hides the screen-reader-only text it renders, and the scrolled blast list contains it", () => {
    const srClasses = [...new Set([...TEMPLATE.matchAll(/class="(tux-map__[\w-]*sr)"/g)].map((m) => m[1]!))];
    expect(srClasses).toEqual(expect.arrayContaining(["tux-map__blast-sr", "tux-map__sr"]));
    // Every value any rule naming the class gives these properties must hide the text: a
    // later rule, a more specific one, a container query or an !important override all
    // count, whatever the cascade would pick. (.tux-map__blast-src is another class.)
    const HIDES: Record<string, (v: string) => boolean> = {
      position: (v) => v === "absolute",
      "clip-path": (v) => v === "inset(50%)",
      clip: (v) => v === "rect(0 0 0 0)",
      width: (v) => v === "1px",
      height: (v) => v === "1px",
      overflow: (v) => v === "hidden",
    };
    for (const cls of srClasses) {
      const bodies = rulesFor(cls);
      for (const [prop, hides] of Object.entries(HIDES)) {
        expect(values(bodies, prop).filter((v) => !hides(v)), `${cls} ${prop}`).toEqual([]);
      }
      for (const prop of ["position", "width", "height", "overflow"]) expect(values(bodies, prop), `${cls} ${prop}`).not.toEqual([]);
      expect([...values(bodies, "clip-path"), ...values(bodies, "clip")], cls).not.toEqual([]);
    }
    const list = rulesFor("tux-map__blast-list");
    expect(values(list, "overflow-y")).toContain("auto");
    expect(values(list, "position")).toEqual(["relative"]);
  });

  it("stops every animation and every moving transition under prefers-reduced-motion (2.3.3)", () => {
    // What may still change under reduced motion: colour, light and visibility, never place or
    // size. Anything else (all, var(--…), a longhand, an unlisted property) counts as moving.
    const STILL = new Set(["none", "opacity", "color", "background", "background-color", "border-color",
      "outline-color", "box-shadow", "visibility", "fill", "stroke", "filter", "text-decoration-color"]);
    const TIME_OR_EASE = /^(-?[\d.]+m?s|ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|allow-discrete|normal|(cubic-bezier|steps|linear)\(.*\))$/;
    const effect = (body: string) => {
      let animation: "none" | "runs" | undefined;
      let props: string[] = [];
      const important = { animation: false, transition: false };
      // -webkit- spellings are the same properties; !important is remembered per family
      for (const m of body.matchAll(/(?:^|[;\s])(?:-webkit-)?(transition|transition-property|animation|animation-name)\s*:\s*([^;}]+)/g)) {
        const [, prop, raw] = m;
        const imp = /!important\s*$/.test(raw!);
        const value = raw!.replace(/!important\s*$/, "").trim();
        if (prop!.startsWith("animation")) {
          animation = /^none\b/.test(value) ? "none" : "runs";
          important.animation = imp;
        } else {
          props = prop === "transition-property"
            ? topLevel(value)
            : topLevel(value).map((item) => item.split(/\s+(?![^(]*\))/).find((t) => !TIME_OR_EASE.test(t)) ?? "all");
          important.transition = imp;
        }
      }
      return { animated: animation === "runs", stilled: animation === "none", moving: props.filter((p) => !STILL.has(p)), transitions: props.length > 0, important };
    };
    const reduced = rules(REDUCED.body);
    const stops = (sel: string, ok: (e: ReturnType<typeof effect>) => boolean) =>
      reduced.some(([sels, body]) => sels.includes(sel) && ok(effect(body)));
    const outside = rules(STYLE.slice(0, REDUCED.start) + STYLE.slice(REDUCED.end)).map(([sels, b]) => ({ sels, e: effect(b) }));
    const animated = outside.filter((o) => o.e.animated).flatMap((o) => o.sels.map((s) => ({ s, imp: o.e.important.animation })));
    const sliding = outside.filter((o) => o.e.moving.length > 0).flatMap((o) => o.sels.map((s) => ({ s, imp: o.e.important.transition })));
    expect(animated.length).toBeGreaterThan(0);
    expect(sliding.length).toBeGreaterThan(0);
    // the reduced block itself must say animation: none, and a transition that moves nothing,
    // as !important as what it overrides (a plain rule loses to an !important one)
    expect(animated.filter(({ s, imp }) => !stops(s, (e) => e.stilled && (!imp || e.important.animation))).map(({ s }) => s)).toEqual([]);
    expect(
      sliding.filter(({ s, imp }) => !stops(s, (e) => e.transitions && e.moving.length === 0 && (!imp || e.important.transition))).map(({ s }) => s),
    ).toEqual([]);
  });

  it("'+' opens the card keyboard focus is on, not the one chosen earlier", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
    });
    await wrapper.find('.tux-map__el[data-id="c-search"]').trigger("click");
    await nextTick();
    await wrapper.find('.tux-map__el[data-id="c-edge"]').trigger("keydown", { key: "+" });
    await nextTick();
    expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 3 /);
    expect(wrapper.emitted("update:focus")?.at(-1)).toEqual(["c-edge"]);
  });

  it("never puts a script URL in a link, and encodes a source path", async () => {
    const withSource = (id: string, source: { path: string; lineRange?: [number, number]; url?: string }) =>
      DEFAULT_TTI_LEVEL_MODEL.level2.elements.map((e) => (e.id === id ? { ...e, source } : e));
    const model: TuxMapLevelModel = {
      ...DEFAULT_TTI_LEVEL_MODEL,
      sourceBaseUrl: "https://forge.example/o/r/src/commit/abc",
      level2: {
        ...DEFAULT_TTI_LEVEL_MODEL.level2,
        elements: withSource("c-search", { path: "docs/a b#c?.md", lineRange: [3, 3] }).map((e) =>
          e.id === "c-edge" ? { ...e, source: { path: "edge.ts", url: "java\tscript:alert(1)" } } : e,
        ),
      },
    };
    const wrapper = await mountSuspended(TuxArchitectureMap, { props: { model, initialLevel: 2 } });
    await wrapper.find('.tux-map__el[data-id="c-search"]').trigger("click");
    await nextTick();
    expect(wrapper.find("a.tux-map__source-lnk").attributes("href")).toBe(
      "https://forge.example/o/r/src/commit/abc/docs/a%20b%23c%3F.md#L3",
    );
    await wrapper.find('.tux-map__el[data-id="c-edge"]').trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__panel-title").text()).toBeTruthy();
    expect(wrapper.find("a.tux-map__source-lnk").exists()).toBe(false);
  });

  it("speaks of the wheel only as it works: Ctrl+scroll when the plain wheel does not zoom", async () => {
    const on = await mountSuspended(TuxArchitectureMap, { props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 } });
    expect(on.find(".tux-map__hint").text()).toContain("scroll the mouse wheel");
    const off = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, wheelZoom: false },
    });
    expect(off.find(".tux-map__hint").text()).toContain("hold Ctrl and scroll");
    expect(off.find(".tux-map__hint").text()).not.toContain("mouse wheel");
  });

  it("'+' on a card with nothing inside stays put and says so, whatever was chosen before", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
    });
    await wrapper.find('.tux-map__el[data-id="c-search"]').trigger("click");
    await nextTick();
    const users = wrapper.find('.tux-map__el[data-id="p-users"]');
    await users.trigger("keydown", { key: "+" });
    await new Promise((r) => setTimeout(r, 150));
    expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 2 /);
    expect(wrapper.find(".tux-map__sr").text()).toContain("has no level inside it");
    // pressed again, the same words are spoken again: the region clears, then refills
    await users.trigger("keydown", { key: "+" });
    expect(wrapper.find(".tux-map__sr").text()).toBe("");
    await new Promise((r) => setTimeout(r, 150));
    expect(wrapper.find(".tux-map__sr").text()).toContain("has no level inside it");
  });

  it("never takes focus back from where the host page moved it in answer to the map's own events", async () => {
    const outside = document.createElement("button");
    outside.textContent = "Host drawer";
    document.body.appendChild(outside);
    let moved = 0;
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
        "onUpdate:level": () => {
          moved++;
          outside.focus();
        },
      },
      attachTo: document.body,
    });
    try {
      const edge = wrapper.find('.tux-map__el[data-id="c-edge"]').element as HTMLElement;
      edge.focus();
      edge.dispatchEvent(new KeyboardEvent("keydown", { key: "+", bubbles: true, cancelable: true }));
      await nextTick();
      await nextTick();
      expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 3 /);
      expect(moved).toBeGreaterThan(0);
      expect(document.activeElement).toBe(outside);
    } finally {
      wrapper.unmount();
      outside.remove();
    }
  });

  it("gives no '+' to a card that is only deployed somewhere, and '+' on it says so", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 5, initialFocus: "ai-search-app" },
    });
    const pool = wrapper.find('.tux-map__el[data-id="ai-search-app/pgclient"]');
    expect(pool.exists()).toBe(true);
    expect(pool.classes()).not.toContain("tux-map__el--zoomable");
    expect(wrapper.find('.tux-map__el[data-id="ai-search-app/retriever"]').classes()).toContain("tux-map__el--zoomable");
    await pool.trigger("keydown", { key: "+" });
    await new Promise((r) => setTimeout(r, 150));
    expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 5 /);
    expect(wrapper.find(".tux-map__sr").text()).toBe("PgVector Pool Client has no level inside it.");
  });

  it("counts the levels the model really has, however its subgraphs are named or nested", async () => {
    const hint = async (model: TuxMapLevelModel) =>
      (await mountSuspended(TuxArchitectureMap, { props: { model, initialLevel: 2 } })).find(".tux-map__hint").text();
    const flat = { ...DEFAULT_TTI_LEVEL_MODEL, subgraphs: undefined, links: undefined };
    // a host with inline children opens a Level 5
    const inline: TuxMapLevelModel = {
      ...flat,
      level4: {
        ...flat.level4,
        nodes: flat.level4.nodes.map((n) => (n.id === "app-vm-01" ? { ...n, children: [{ id: "app-vm-01/svc", name: "svc" }] } : n)),
      },
    };
    expect(await hint(inline)).toContain("Levels 1–5");
    // three levels of code under one component: files, functions, methods
    const chain: TuxMapLevelModel = {
      ...flat,
      subgraphs: {
        "c-api/0": { stratum: "Files", elements: [{ id: "f:a.py", kind: "module", name: "a.py" }] },
        "f:a.py": { stratum: "Functions and classes", elements: [{ id: "s:a.py#C", kind: "symbol", name: "C" }] },
        "s:a.py#C": { stratum: "Methods", elements: [{ id: "s:a.py#C.m", kind: "symbol", name: "m()" }] },
      },
    };
    expect(await hint(chain)).toContain("Levels 1–7");
    expect(await hint(DEFAULT_TTI_LEVEL_MODEL)).toContain("Levels 1–6");
  });

  it("says nothing of '+' cards where none is in view", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 6, initialFocus: "ai-search-app/retriever" },
    });
    expect(wrapper.findAll(".tux-map__el--zoomable").length).toBe(0);
    expect(wrapper.find(".tux-map__hint").text()).not.toContain("'+'");
    expect(wrapper.find(".tux-map__hint").text()).toContain("Escape");
  });

  it("keeps keyboard focus in the map when '+' opens the focused card, so '-' still works (2.1.1)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
      attachTo: document.body,
    });
    try {
      const key = (el: Element, k: string) =>
        el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
      const edge = wrapper.find('.tux-map__el[data-id="c-edge"]').element as HTMLElement;
      edge.focus();
      key(edge, "+");
      await nextTick();
      await nextTick();
      expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 3 /);
      expect(document.querySelector(".tux-map")!.contains(document.activeElement)).toBe(true);
      key(document.activeElement!, "-");
      await nextTick();
      await nextTick();
      expect(wrapper.find(".tux-map__level-text").text()).toMatch(/^Level 2 /);
    } finally {
      wrapper.unmount();
    }
  });

  it("under reduced motion the wheel changes the level without pulling or growing the card (2.3.3)", async () => {
    const run = async (reduce: boolean) => {
      const restore = stubReducedMotion(reduce);
      try {
        const wrapper = await mountSuspended(TuxArchitectureMap, {
          props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 },
        });
        await nextTick();
        const card = wrapper.find('.tux-map__el[data-id="c-search"]').element as HTMLElement;
        const moved: string[] = [];
        for (let i = 0; i < 8; i++) {
          card.dispatchEvent(new WheelEvent("wheel", { deltaY: -4, clientX: 40, clientY: 40, bubbles: true, cancelable: true }));
          await nextTick();
          if (card.style.transform) moved.push(card.style.transform);
        }
        return { moved, level: wrapper.find(".tux-map__level-text").text() };
      } finally {
        restore();
      }
    };
    const usual = await run(false);
    expect(usual.moved.length).toBeGreaterThan(0); // the control: without the preference the card is pulled
    const still = await run(true);
    expect(still.moved).toEqual([]);
    expect(still.level).toMatch(/^Level 3 /); // the wheel still changes the level
  });

  it("under reduced motion the tether's dot and the proximity frame stay put while the wheel turns (2.3.3)", async () => {
    const run = async (reduce: boolean) => {
      const restore = stubReducedMotion(reduce);
      try {
        const wrapper = await mountSuspended(TuxArchitectureMap, {
          props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialFocus: "c-edge" },
        });
        const scale = Number(/scale\(([\d.]+)\)/.exec(wrapper.find(".tux-map__stage").attributes("style") || "")?.[1] ?? 1);
        const style = wrapper.find('.tux-map__el[data-id="c-search"]').attributes("style") || "";
        const left = Number(/left:\s*(\d+)px/.exec(style)?.[1] ?? 500);
        const top = Number(/top:\s*(\d+)px/.exec(style)?.[1] ?? 200);
        const viewport = wrapper.find(".tux-map__viewport").element;
        const dots: string[] = [];
        const frames: string[] = [];
        // the pointer in the gap above the card, where the tether shows; three turns stay below the level change
        for (let i = 0; i < 3; i++) {
          viewport.dispatchEvent(
            new WheelEvent("wheel", {
              deltaY: -4,
              clientX: Math.round((left + 40) * scale),
              clientY: Math.round((top - 55) * scale),
              bubbles: true,
              cancelable: true,
            }),
          );
          await nextTick();
          dots.push(wrapper.find(".tux-map__proximity-cursor").attributes("cy") ?? "-");
          const frame = wrapper.find(".tux-map__proximity-frame");
          frames.push(frame.exists() ? (frame.element as HTMLElement).style.transform : "");
        }
        return { dots, frames };
      } finally {
        restore();
      }
    };
    const usual = await run(false);
    expect(new Set(usual.dots).size).toBeGreaterThan(1); // the control: the dot glides toward the card
    const still = await run(true);
    expect(new Set(still.dots).size).toBe(1);
    expect(still.frames.filter(Boolean)).toEqual([]);
  });

  it("puts no script URL behind any link: issue links, source links and blast rows", async () => {
    const mount = async (base: string) => {
      const model: TuxMapLevelModel = {
        ...DEFAULT_TTI_LEVEL_MODEL,
        sourceBaseUrl: base,
        issueBaseUrl: base,
        level2: {
          ...DEFAULT_TTI_LEVEL_MODEL.level2,
          elements: DEFAULT_TTI_LEVEL_MODEL.level2.elements.map((e) =>
            e.id === "c-api" ? { ...e, roadmap: [376], source: { path: "api/main.py" } } : e,
          ),
        },
        subgraphs: {
          "c-api/0": { stratum: "Files", elements: [{ id: "f:routes.py", kind: "module", name: "routes.py", source: { path: "routes.py" } }] },
          "c-api/1": { stratum: "Files", elements: [{ id: "f:forge.py", kind: "module", name: "forge.py", source: { path: "forge.py" } }] },
          "f:routes.py": { stratum: "Functions", elements: [{ id: "s:routes.py#who", kind: "symbol", name: "who()", source: { path: "routes.py" } }] },
        },
        links: [{ from: "f:forge.py", to: "s:routes.py#who", kind: "calls", at: "forge.py:40" }],
      };
      const level2 = await mountSuspended(TuxArchitectureMap, {
        props: { model, initialLevel: 2, initialSelectedId: "c-api" },
      });
      const code = await mountSuspended(TuxArchitectureMap, {
        props: { model, initialLevel: 6, initialFocus: "f:routes.py", initialSelectedId: "s:routes.py#who" },
      });
      await nextTick();
      return {
        issue: level2.findAll("a.tux-map__issue-lnk").length,
        source: level2.findAll("a.tux-map__source-lnk").length,
        blast: code.findAll("a.tux-map__blast-src").length,
      };
    };
    const web = await mount("https://forge.example/o/r");
    expect(web).toEqual({ issue: 1, source: 1, blast: 1 }); // the control: each sink draws a link
    for (const hostile of ["javascript:alert(1)//", " JAVASCRIPT:alert(1)", "java\tscript:alert(1)", "data:text/html,x", "vbscript:x"]) {
      expect(await mount(hostile), hostile).toEqual({ issue: 0, source: 0, blast: 0 });
    }
  });

  it("names the wheel only where it zooms, and counts only the levels the map has", async () => {
    const magnified = await mountSuspended(TuxArchitectureMap, { props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2 } });
    await magnified.find('[aria-label="Make the diagram larger"]').trigger("click");
    await nextTick();
    expect(magnified.find(".tux-map__hint").text()).toContain("hold Ctrl and scroll");
    const list = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 2, initialView: "list" },
    });
    expect(list.find(".tux-map__hint").text()).toMatch(/^Choose an item/);
    const noCode: TuxMapLevelModel = { ...DEFAULT_TTI_LEVEL_MODEL, subgraphs: undefined, links: undefined };
    const four = await mountSuspended(TuxArchitectureMap, { props: { model: noCode, initialLevel: 2 } });
    expect(four.find(".tux-map__hint").text()).toContain("Levels 1–4");
    const infra = await mountSuspended(TuxArchitectureMap, { props: { model: noCode, initialLevel: 4 } });
    expect(infra.find(".tux-map__hint").text()).not.toContain("Level 5");
  });

  it("names a Level 2 reference whose Level 1 element is missing by its id", async () => {
    const model: TuxMapLevelModel = {
      ...DEFAULT_TTI_LEVEL_MODEL,
      level2: {
        ...DEFAULT_TTI_LEVEL_MODEL.level2,
        elements: [...DEFAULT_TTI_LEVEL_MODEL.level2.elements, { id: "x-gone", ref: true, at: [5, 4] }],
      },
    };
    const wrapper = await mountSuspended(TuxArchitectureMap, { props: { model, initialLevel: 2 } });
    expect(wrapper.find('.tux-map__el[data-id="x-gone"]').text()).toContain("x-gone");
  });

  // ── #110 (3.11.0): unified blast-radius contract on Level 4 and diff rollup ────

  it("computes upstream blast radius on Level 4 Infrastructure instead of bailing out (#110)", async () => {
    const infraCodeModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "System", zoom: 2 }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-api", kind: "container", name: "Orders API", deployed: ["vm-api-1"] },
          { id: "c-web", kind: "container", name: "Storefront Web", deployed: ["vm-web-1"] },
          { id: "c-worker", kind: "container", name: "Sync Worker", deployed: ["vm-worker-1"] },
        ],
        rels: [],
      },
      level3: {
        "c-api": [{ id: "c-api/core", kind: "component", name: "Core" }],
        "c-web": [{ id: "c-web/ui", kind: "component", name: "UI" }],
        "c-worker": [{ id: "c-worker/jobs", kind: "component", name: "Jobs" }],
      },
      level4: {
        groups: [{ id: "rg-prod", zone: "cloud-prod", title: "rg-prod" }],
        nodes: [
          { id: "vm-api-1", group: "rg-prod", kind: "vm", title: "vm-api-1", role: "API host", hosts: ["c-api"] },
          { id: "vm-web-1", group: "rg-prod", kind: "vm", title: "vm-web-1", role: "Web host", hosts: ["c-web"] },
          { id: "vm-worker-1", group: "rg-prod", kind: "vm", title: "vm-worker-1", role: "Worker host", hosts: ["c-worker"] },
        ],
        links: [{ from: "vm-web-1", to: "vm-api-1", label: "HTTPS 443", kind: "traffic", state: "now" }],
      },
      subgraphs: {
        "c-api/core": { elements: [{ id: "f:api/auth.py", kind: "module", name: "auth.py", source: { path: "api/auth.py" } }] },
        "c-web/ui": { elements: [{ id: "f:web/app.ts", kind: "module", name: "app.ts", source: { path: "web/app.ts" } }] },
        "c-worker/jobs": { elements: [{ id: "f:worker/sync.py", kind: "module", name: "sync.py", source: { path: "worker/sync.py" } }] },
      },
      links: [
        { from: "f:web/app.ts", to: "f:api/auth.py", kind: "calls", at: "web/app.ts:9" },
        { from: "f:worker/sync.py", to: "f:web/app.ts", kind: "imports", at: "worker/sync.py:3" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: infraCodeModel,
        initialLevel: 4,
        initialSelectedId: "vm-api-1",
        initialShowBlastRadius: true,
      },
    });
    await nextTick();
    // Selecting vm-api-1 on Level 4 lists web/app.ts (1 hop) and worker/sync.py (2 hops) and lights vm-web-1 & vm-worker-1
    const rows = wrapper.findAll(".tux-map__blast-row");
    expect(rows.length).toBe(2);
    expect(rows[0]!.text()).toContain("web/app.ts");
    expect(rows[1]!.text()).toContain("worker/sync.py");
    expect(wrapper.find('.tux-map__el[data-id="vm-api-1"]').classes()).toContain("tux-map__el--diff-direct");
    expect(wrapper.find('.tux-map__el[data-id="vm-web-1"]').classes()).toContain("tux-map__el--diff-impact");
    expect(wrapper.find('.tux-map__el[data-id="vm-worker-1"]').classes()).toContain("tux-map__el--diff-impact");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });

  it("rolls deep symbol diffs up to Level 2 containers and traces multi-hop code links in Blast Radius mode (#110)", async () => {
    const deepDiffModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "System", zoom: 2 }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-core", kind: "container", name: "Core Library", at: [0, 0] },
          { id: "c-api", kind: "container", name: "Orders API", at: [1, 0] },
          { id: "c-web", kind: "container", name: "Storefront Web", at: [2, 0] },
        ],
        rels: [],
      },
      level3: {
        "c-core": [{ id: "c-core/auth", kind: "component", name: "Auth" }],
        "c-api": [{ id: "c-api/routes", kind: "component", name: "Routes" }],
        "c-web": [{ id: "c-web/ui", kind: "component", name: "UI" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "c-core/auth": { elements: [{ id: "d:c-core/auth:core", kind: "module", name: "core/" }] },
        "d:c-core/auth:core": { elements: [{ id: "f:core/auth.py", kind: "module", name: "auth.py" }] },
        "f:core/auth.py": {
          elements: [
            {
              id: "s:core/auth.py#verify",
              kind: "symbol",
              name: "verify()",
              diff: { changeType: "modified", summary: "Patched token check" },
            },
          ],
        },
        "c-api/routes": { elements: [{ id: "f:api/orders.py", kind: "module", name: "orders.py" }] },
        "c-web/ui": { elements: [{ id: "f:web/app.ts", kind: "module", name: "app.ts" }] },
      },
      links: [
        { from: "f:api/orders.py", to: "s:core/auth.py#verify", kind: "calls" },
        { from: "f:web/app.ts", to: "f:api/orders.py", kind: "calls" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: deepDiffModel,
        initialLevel: 2,
        initialShowBlastRadius: true,
      },
    });
    await nextTick();

    // Level 7 symbol diff rolls all the way up to Level 2 c-core, and multi-hop M.links lights both c-api (hop 1) and c-web (hop 2)
    expect(wrapper.find('.tux-map__el[data-id="c-core"]').classes()).toContain("tux-map__el--diff-direct");
    expect(wrapper.find('.tux-map__el[data-id="c-api"]').classes()).toContain("tux-map__el--diff-impact");
    expect(wrapper.find('.tux-map__el[data-id="c-web"]').classes()).toContain("tux-map__el--diff-impact");
  });

  it("keeps 2-hop blast wires lit on selection, prefers strongest symbol link per file, switches blast intent, and hardens href/selector inputs (#110)", async () => {
    const gateModel: TuxMapLevelModel = {
      sourceBaseUrl: "https://code.tti.tamu.edu/nis/forgejo-stack/src/branch/main",
      level1: { elements: [{ id: "sys", kind: "system", name: "System", zoom: 2 }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          {
            id: "c-core",
            kind: "container",
            name: "Core Auth",
            at: [0, 0],
            source: { path: "../../etc/passwd", lineRange: [1, 5] },
          },
          {
            id: "c-api",
            kind: "container",
            name: "Orders API",
            at: [1, 0],
            source: { path: "bff/orders.py", url: "https://evil.example/phish" },
          },
          {
            id: 'c-web["quote"]',
            kind: "container",
            name: "Web Portal",
            at: [2, 0],
            source: { path: "web/app.ts", url: "//evil.example/proto" },
          },
        ],
        rels: [
          { from: "c-api", to: "c-core", label: "Verifies token" },
          { from: 'c-web["quote"]', to: "c-api", label: "Calls /v1/orders" },
        ],
      },
      level3: {
        "c-core": [{ id: "c-core/auth", kind: "component", name: "Auth" }],
        "c-api": [{ id: "c-api/routes", kind: "component", name: "Routes" }],
        'c-web["quote"]': [{ id: "c-web/ui", kind: "component", name: "UI" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "c-core/auth": {
          elements: [{ id: "f:core/auth.py", kind: "module", name: "auth.py", source: { path: "core/auth.py" } }],
        },
        "f:core/auth.py": {
          elements: [{ id: "s:core/auth.py#verify", kind: "symbol", name: "verify()", source: { path: "core/auth.py" } }],
        },
        "c-api/routes": {
          elements: [{ id: "f:bff/orders.py", kind: "module", name: "orders.py", source: { path: "bff/orders.py" } }],
        },
        "f:bff/orders.py": {
          elements: [{ id: "s:bff/orders.py#create", kind: "symbol", name: "create()", source: { path: "bff/orders.py" } }],
        },
        "c-web/ui": {
          elements: [{ id: "f:web/app.ts", kind: "module", name: "app.ts", source: { path: "web/app.ts" } }],
        },
      },
      links: [
        // Both file-level type-only import and symbol-level runtime call from bff/orders.py at hop 1: symbol `calls` must win!
        { from: "f:bff/orders.py", to: "s:core/auth.py#verify", kind: "imports", coupling: "type-only", at: "bff/orders.py:2" },
        { from: "s:bff/orders.py#create", to: "s:core/auth.py#verify", kind: "calls", at: "bff/orders.py:24" },
        { from: "f:web/app.ts", to: "s:bff/orders.py#create", kind: "imports", coupling: "type-only", at: "web/app.ts:4" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model: gateModel,
        initialLevel: 2,
        initialSelectedId: "c-core",
        initialShowBlastRadius: true,
      },
    });
    await nextTick();

    // 1. 2-hop wire (`c-web["quote"] -> c-api`) stays `.tux-map__wire-fg--on` even when `c-core` is selected (F-03)
    const twoHopWire = wrapper
      .findAll(".tux-map__wire-fg")
      .find((w) => w.attributes("data-from") === 'c-web["quote"]' && w.attributes("data-to") === "c-api");
    expect(twoHopWire).toBeDefined();
    expect(twoHopWire!.classes()).toContain("tux-map__wire-fg--on");

    // 2. Strongest symbol link (`calls it`) beats file-level `imports` on `bff/orders.py` (F-07)
    const rows = wrapper.findAll(".tux-map__blast-row");
    expect(rows[0]!.text()).toContain("bff/orders.py");
    expect(rows[0]!.text()).toContain("calls it");

    // 3. `..` path traversal on `c-core` renders inert `<code>` pill instead of `<a class="tux-map__source-lnk">` (S-05)
    expect(wrapper.find(".tux-map__source-lnk").exists()).toBe(false);
    expect(wrapper.find(".tux-map__source-pill").text()).toContain("../../etc/passwd");

    // 4. Toolbar intent `<select>` switches to `patch`, skipping hop-2 `type-only` (`web/app.ts`) and emitting `update:blastIntent` (N-09)
    const intentSelect = wrapper.find("select.tux-map__intent-select");
    expect(intentSelect.exists()).toBe(true);
    await intentSelect.setValue("patch");
    await nextTick();
    expect(wrapper.emitted("update:blastIntent")?.at(-1)).toEqual(["patch"]);
    expect(wrapper.findAll(".tux-map__blast-row").length).toBe(1);

    // 5. Cross-origin `src.url` on `c-api` and protocol-relative `//evil.example` on `c-web["quote"]` are rejected, and quote/bracket IDs do not throw (S-05)
    await wrapper.find('.tux-map__el[data-id="c-api"]').trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__source-lnk").exists()).toBe(false);

    const webCard = wrapper.findAll(".tux-map__el").find((el) => el.attributes("data-id") === 'c-web["quote"]')!;
    await webCard.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__source-lnk").exists()).toBe(false);
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });

  // ==========================================================================
  // SLICE 5A COMPONENT & ACCESSIBILITY TESTS (#114, #122, #130, #120, #119)
  // ==========================================================================

  it("mounts EMPTY_TTI_LEVEL_MODEL by default without shipping sample prose, while docs sample remains mountable (#114)", async () => {
    const emptyWrapper = await mountSuspended(TuxArchitectureMap);
    expect(emptyWrapper.findAll(".tux-map__el").length).toBe(0);
    expect(emptyWrapper.text()).not.toContain("TTI Cloud Platform");
    expect(await runComponentAxe(emptyWrapper.element)).toEqual([]);

    const sampleWrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model: DEFAULT_TTI_LEVEL_MODEL, initialLevel: 1 },
    });
    expect(sampleWrapper.findAll(".tux-map__el").length).toBeGreaterThan(2);
    expect(await runComponentAxe(sampleWrapper.element)).toEqual([]);
  });

  it("selects, focuses, and reveals IDs with backslashes, quotes, and brackets without CSS.escape, and renders route & link-kind legend entries (#122)", async () => {
    const trickyRouteId = `r:GET /v1/re\\\\pos\\["id"\\]/'items'[0]`;
    const trickyHandlerId = `s:bff\\win["q"]'x'[0]#handle`;
    const newKinds = [
      "copies",
      "copies-logic-of",
      "forks",
      "reads-format",
      "suppresses",
      "provenance",
      "links",
      "reads",
      "generates",
      "denies",
      "handled-by",
      "sends",
      "routes",
    ] as const;

    const model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "System" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [{ id: "c-api", kind: "container", name: "API" }],
        rels: [],
      },
      level3: {
        "c-api": [{ id: "c-api/routes", kind: "component", name: "Routes" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "c-api/routes": {
          elements: [
            { id: trickyRouteId, kind: "route", name: "GET /v1/repos/[id]/items" },
            { id: trickyHandlerId, kind: "function", name: "handle_items", source: { path: "bff/items.py", lineRange: [10, 20] } },
          ],
        },
      },
      links: newKinds.map((kind) => ({
        from: trickyRouteId,
        to: trickyHandlerId,
        kind,
        at: "bff/items.py:12",
      })),
    };

    const origCss = (globalThis as Record<string, unknown>).CSS;
    try {
      // Simulate happy-dom / minimal DOM with zero `CSS.escape`
      (globalThis as Record<string, unknown>).CSS = undefined;

      const wrapper = await mountSuspended(TuxArchitectureMap, {
        props: { model, initialLevel: 2 },
        attachTo: document.body,
      });

      // At Level 2, off-screen `HTTP route` and Level 5 link kinds are NOT in the legend (#115)
      expect(wrapper.find(".tux-map__legend").text()).not.toContain("HTTP route");

      // Open Go-To palette (`/`), search `handle_items`, and hit Enter to reveal & focus the tricky ID
      await wrapper.find(".tux-map__viewport").trigger("keydown", { key: "/" });
      await nextTick();
      const goToInput = wrapper.find("input.tux-map__goto-input");
      expect(goToInput.exists()).toBe(true);
      await goToInput.setValue("handle_items");
      await nextTick();
      await goToInput.trigger("keydown", { key: "Enter" });
      await nextTick();
      await nextTick();

      expect(wrapper.emitted("update:selectedId")?.at(-1)).toEqual([trickyHandlerId]);
      expect(wrapper.find(".tux-map__panel-title").text()).toContain("handle_items");
      expect((document.activeElement as HTMLElement | null)?.dataset?.id).toBe(trickyHandlerId);

      // Enable all wire categories so prod + tests + ci + docs link kinds are on screen, then check legend (#115, #118, #122)
      await wrapper.setProps({ wireFilters: ["prod", "tests", "ci", "docs"] });
      await nextTick();
      const legendText = wrapper.find(".tux-map__legend").text();
      expect(legendText).toContain("HTTP route");
      for (const k of newKinds) {
        expect(wrapper.find(`.tux-map__legend li[data-link-kind="${k}"]`).exists(), `legend entry for ${k}`).toBe(true);
      }

      // Select the backslash/quote/bracket `route` card directly and verify `"HTTP route"` type label
      const routeCard = wrapper.findAll(".tux-map__el").find((el) => el.attributes("data-id") === trickyRouteId);
      expect(routeCard).toBeDefined();
      await routeCard!.trigger("click");
      await nextTick();
      expect(wrapper.find(".tux-map__panel-ty").text()).toContain("HTTP route");

      expect(await runComponentAxe(wrapper.element)).toEqual([]);
      wrapper.unmount();
    } finally {
      (globalThis as Record<string, unknown>).CSS = origCss;
    }
  });

  it("zooms into an outside collaborator card (forge.py from routes.py functions) at its true level with matching badge title and parent back-step (#130)", async () => {
    const codeLinksModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "TTI Code" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [{ id: "c-api", kind: "container", name: "BFF Gateway" }],
        rels: [],
      },
      level3: {
        "c-api": [{ id: "c-api/1", kind: "component", name: "Gateway Core" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "c-api/1": {
          stratum: "Python modules",
          elements: [
            { id: "f:routes.py", kind: "module", name: "routes.py", source: { path: "bff/routes.py" } },
            { id: "f:forge.py", kind: "module", name: "forge.py", source: { path: "bff/forge.py" } },
          ],
        },
        "f:routes.py": {
          stratum: "route functions",
          elements: [
            { id: "s:routes.py#list_repos", kind: "function", name: "list_repos" },
          ],
        },
        "f:forge.py": {
          stratum: "forge functions",
          elements: [
            { id: "s:forge.py#fetch_repo", kind: "function", name: "fetch_repo" },
          ],
        },
      },
      links: [
        { from: "s:routes.py#list_repos", to: "f:forge.py", kind: "imports", at: "bff/routes.py:18" },
      ],
    };

    const navigateToRoutesLevel6 = async () => {
      const w = await mountSuspended(TuxArchitectureMap, {
        props: { model: codeLinksModel, initialLevel: 2 },
        attachTo: document.body,
      });
      // Drill: c-api (L2->L3) -> c-api/1 (L3->L5) -> f:routes.py (L5->L6)
      await w.find('.tux-map__el[data-id="c-api"]').trigger("dblclick");
      await nextTick();
      await w.find('.tux-map__el[data-id="c-api/1"]').trigger("dblclick");
      await nextTick();
      await w.find('.tux-map__el[data-id="f:routes.py"]').trigger("dblclick");
      await nextTick();
      expect(w.find(".tux-map__level-text").text()).toContain("Level 6");
      return w;
    };

    // 1. Panel button zoom + badge title verification + `-` zoom out to `c-api/1` (Level 5)
    const w1 = await navigateToRoutesLevel6();
    const forgeCard1 = w1.find('.tux-map__el[data-id="f:forge.py"]');
    expect(forgeCard1.exists()).toBe(true);
    const badgeTitle = w1.find('.tux-map__el-zb[data-zb-for="f:forge.py"]').attributes("title") || "";
    expect(badgeTitle).toContain("Level 6");
    expect(badgeTitle).not.toContain("Level 7");

    await forgeCard1.trigger("click");
    await nextTick();
    const panelZoomBtn = w1
      .findAll("button.tux-map__panel-btn")
      .find((b) => b.text().includes("Zoom in to Level"));
    expect(panelZoomBtn).toBeDefined();
    expect(panelZoomBtn!.text()).toContain("Zoom in to Level 6");
    await panelZoomBtn!.trigger("click");
    await nextTick();

    expect(w1.find(".tux-map__level-text").text()).toContain("Level 6");
    expect(w1.find('.tux-map__el[data-id="s:forge.py#fetch_repo"]').exists()).toBe(true);
    // `-` steps back to `f:forge.py`'s parent (`c-api/1` at Level 5), NOT `f:routes.py`!
    await w1.find(".tux-map__viewport").trigger("keydown", { key: "-" });
    await nextTick();
    expect(w1.find(".tux-map__level-text").text()).toContain("Level 5");
    expect(w1.emitted("update:focus")?.at(-1)).toEqual(["c-api/1"]);
    w1.unmount();

    // 2. `+` key on focused outside card `f:forge.py` -> Level 6 `f:forge.py` -> `-` -> Level 5 `c-api/1`
    const w2 = await navigateToRoutesLevel6();
    const forgeCard2 = w2.find('.tux-map__el[data-id="f:forge.py"]');
    (forgeCard2.element as HTMLElement).focus();
    await forgeCard2.trigger("keydown", { key: "+" });
    await nextTick();
    expect(w2.find(".tux-map__level-text").text()).toContain("Level 6");
    expect(w2.find('.tux-map__el[data-id="s:forge.py#fetch_repo"]').exists()).toBe(true);
    await w2.find(".tux-map__viewport").trigger("keydown", { key: "-" });
    await nextTick();
    expect(w2.find(".tux-map__level-text").text()).toContain("Level 5");
    expect(w2.emitted("update:focus")?.at(-1)).toEqual(["c-api/1"]);
    w2.unmount();

    // 3. Wheel zoom-in (`deltaY < 0`) over outside card `f:forge.py` -> Level 6 `f:forge.py` -> `-` -> Level 5 `c-api/1`
    const w3 = await navigateToRoutesLevel6();
    const forgeCard3 = w3.find('.tux-map__el[data-id="f:forge.py"]');
    await forgeCard3.trigger("wheel", { deltaY: -120 });
    await nextTick();
    expect(w3.find(".tux-map__level-text").text()).toContain("Level 6");
    expect(w3.find('.tux-map__el[data-id="s:forge.py#fetch_repo"]').exists()).toBe(true);
    await w3.find(".tux-map__viewport").trigger("keydown", { key: "-" });
    await nextTick();
    expect(w3.find(".tux-map__level-text").text()).toContain("Level 5");
    expect(w3.emitted("update:focus")?.at(-1)).toEqual(["c-api/1"]);
    w3.unmount();
  });

  it("reaches a file from Level 1 in 3 keys + Enter via Go-To palette, resolves route handlers, filters List view, announces 'N of M here', and passes axe (#120)", async () => {
    const model: TuxMapLevelModel = {
      level1: {
        elements: [
          { id: "p-dev", kind: "person", name: "Engineer" },
          { id: "sys-code", kind: "system", name: "TTI Code" },
        ],
        rels: [{ from: "p-dev", to: "sys-code", label: "Pushes code" }],
      },
      level2: {
        boundary: "sys-code",
        elements: [
          { id: "c-api", kind: "container", name: "BFF Gateway" },
          { id: "c-db", kind: "database", name: "State DB" },
        ],
        rels: [{ from: "c-api", to: "c-db", label: "Reads & writes" }],
      },
      level3: {
        "c-api": [{ id: "c-api/core", kind: "component", name: "Gateway Core" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "c-api/core": {
          elements: [
            { id: "f:bff/ttibff/forge.py", kind: "module", name: "forge.py", source: { path: "bff/ttibff/forge.py" } },
            { id: "f:bff/ttibff/map.py", kind: "module", name: "map.py", source: { path: "bff/ttibff/map.py" } },
          ],
        },
        "f:bff/ttibff/map.py": {
          elements: [
            { id: "s:bff/ttibff/map.py#org_arch", kind: "function", name: "org_arch", source: { path: "bff/ttibff/map.py", lineRange: [50, 88] } },
          ],
        },
      },
      routes: [
        {
          method: "GET",
          pattern: "/v1/orgs/{org}/architecture",
          handler: "s:bff/ttibff/map.py#org_arch",
          framework: "FastAPI",
        },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 1 },
      attachTo: document.body,
    });

    // 1. From Level 1: `/` + 3 keys (`"for"`) + `Enter` lands focus directly on `f:bff/ttibff/forge.py`!
    await wrapper.find(".tux-map__viewport").trigger("keydown", { key: "/" });
    await nextTick();
    const goToInput = wrapper.find("input.tux-map__goto-input");
    await goToInput.setValue("for");
    await nextTick();
    expect(wrapper.find(".tux-map__goto-opt--active").text()).toContain("forge.py");
    await goToInput.trigger("keydown", { key: "Enter" });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".tux-map__level-text").text()).toContain("Level 5");
    expect((document.activeElement as HTMLElement | null)?.dataset?.id).toBe("f:bff/ttibff/forge.py");

    // 2. `Meta+k` opens palette; route pattern resolves to its handler `s:bff/ttibff/map.py#org_arch`
    await wrapper.find(".tux-map__viewport").trigger("keydown", { key: "k", metaKey: true });
    await nextTick();
    const goToInput2 = wrapper.find("input.tux-map__goto-input");
    await goToInput2.setValue("/v1/orgs/{org}/architecture");
    await nextTick();
    expect(wrapper.find(".tux-map__goto-hdr").text()).toContain("Routes");
    await goToInput2.trigger("keydown", { key: "Enter" });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".tux-map__level-text").text()).toContain("Level 6");
    expect((document.activeElement as HTMLElement | null)?.dataset?.id).toBe("s:bff/ttibff/map.py#org_arch");

    // 3. Per-level filter announces `"1 of 2 here"` via `.tux-map__sr` and hides non-matching List view items
    await wrapper.setProps({ level: 1 });
    await nextTick();
    const filterInput = wrapper.find("input.tux-map__search-input");
    await filterInput.setValue("Engineer");
    await nextTick();
    expect(wrapper.find(".tux-map__sr").text()).toContain("1 of 2 here");

    await wrapper.setProps({ view: "list" });
    await nextTick();
    const listCards = wrapper.findAll("[data-list-id]");
    expect(listCards.length).toBe(1);
    expect(listCards[0]!.attributes("data-list-id")).toBe("p-dev");

    // 4. Open Go-To palette in both hit and zero-hit states and verify 0 axe violations
    //    (runComponentAxe detaches wrapper.element on cleanup, so run after activeElement checks)
    await wrapper.setProps({ view: "diagram" });
    await nextTick();
    await wrapper.find(".tux-map__viewport").trigger("keydown", { key: "k", ctrlKey: true });
    await nextTick();
    await wrapper.find("input.tux-map__goto-input").setValue("forge");
    await nextTick();
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    await wrapper.find("input.tux-map__goto-input").setValue("zzzz-no-match-999");
    await nextTick();
    expect(wrapper.find(".tux-map__goto-empty").exists()).toBe(true);
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    wrapper.unmount();
  });

  it("renders Find Usages with distinct direct dependents vs links, Show all (>60 rows), C4 database rels, mentions toggle, outside card badges, and non-PR legend (#119)", async () => {
    const manyCallers = Array.from({ length: 63 }, (_, i) => ({
      id: `f:bff/routes/ep_${String(i).padStart(2, "0")}.py`,
      kind: "module" as const,
      name: `ep_${String(i).padStart(2, "0")}.py`,
      source: { path: `bff/routes/ep_${String(i).padStart(2, "0")}.py` },
    }));

    const model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "TTI Code" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-api", kind: "container", name: "BFF Gateway" },
          { id: "c-worker", kind: "container", name: "Sync Worker" },
          { id: "c-db", kind: "database", name: "PostgreSQL State DB" },
        ],
        rels: [
          { from: "c-api", to: "c-db", label: "Reads & writes state" },
          { from: "c-worker", to: "c-db", label: "Writes audit rows" },
        ],
      },
      level3: {
        "c-api": [
          { id: "c-api/lib", kind: "component", name: "Shared Auth" },
          { id: "c-api/routes", kind: "component", name: "HTTP Routes" },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "c-api/lib": {
          elements: [
            { id: "f:bff/lib/auth.py", kind: "module", name: "auth.py", source: { path: "bff/lib/auth.py" } },
          ],
        },
        "c-api/routes": {
          elements: [
            ...manyCallers,
            { id: "f:docs/AUTH.md", kind: "module", name: "AUTH.md", source: { path: "docs/AUTH.md" } },
          ],
        },
      },
      links: [
        // `ep_00.py` has TWO direct links (`calls` + `imports`) to `auth.py` so directLinkCount = 63 while directCount = 62!
        { from: "f:bff/routes/ep_00.py", to: "f:bff/lib/auth.py", kind: "calls", at: "bff/routes/ep_00.py:14" },
        { from: "f:bff/routes/ep_00.py", to: "f:bff/lib/auth.py", kind: "imports", at: "bff/routes/ep_00.py:3" },
        ...manyCallers.slice(1, 62).map((c, idx) => ({
          from: c.id,
          to: "f:bff/lib/auth.py",
          kind: "calls",
          at: `${c.source.path}:${10 + idx}`,
        })),
        // 2-step caller (`ep_62.py` -> `ep_00.py` -> `auth.py`)
        { from: "f:bff/routes/ep_62.py", to: "f:bff/routes/ep_00.py", kind: "calls", at: "bff/routes/ep_62.py:21" },
        // Doc `mentions` link (hidden by default)
        { from: "f:docs/AUTH.md", to: "f:bff/lib/auth.py", kind: "mentions", stop: true, at: "docs/AUTH.md:8" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: { model, initialLevel: 2, showBlastRadius: true },
    });

    // 1. Non-PR legend wording when `!hasModelDiffs`
    const legendText = wrapper.find(".tux-map__legend").text();
    expect(legendText).toContain("Selected");
    expect(legendText).toContain("Depends on selection");
    expect(legendText).not.toContain("PR Modified");

    // 2. Selecting C4 database container `c-db` lists `c-api` and `c-worker` from Level 2 `rels`, and every row is a clickable button
    await wrapper.find('.tux-map__el[data-id="c-db"]').trigger("click");
    await nextTick();
    const dbBlastText = wrapper.find(".tux-map__panel-blast").text();
    expect(dbBlastText).not.toContain("Nothing on the map depends on it");
    expect(dbBlastText).toContain("2 direct dependents");
    expect(dbBlastText).toContain("BFF Gateway");
    expect(dbBlastText).toContain("Sync Worker");
    const dbGoBtns = wrapper.findAll("button.tux-map__blast-go");
    expect(dbGoBtns.length).toBe(2);
    expect(wrapper.findAll(".tux-map__blast-go--static").length).toBe(0);
    await dbGoBtns.find((b) => b.text().includes("Sync Worker"))!.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__panel-title").text()).toContain("Sync Worker");

    // 3. Drill to `c-api/lib` (Level 5) and select `f:bff/lib/auth.py`
    await wrapper.find('.tux-map__el[data-id="c-api"]').trigger("dblclick");
    await nextTick();
    await wrapper.find('.tux-map__el[data-id="c-api/lib"]').trigger("dblclick");
    await nextTick();
    await wrapper.find('.tux-map__el[data-id="f:bff/lib/auth.py"]').trigger("click");
    await nextTick();

    // Summary distinguishes `62 direct dependents` from `63 direct links`, and `63 within 2 steps`
    const sumText = wrapper.find(".tux-map__panel-blast-sum").text();
    expect(sumText).toContain("62 direct dependents (63 direct links); 63 within 2 steps");
    expect(wrapper.text()).not.toContain("And ");

    // Under LCA lifting (#118), `c-api/routes` rolls up all 62 route files (`63 links`); clicking splits it one level
    const rolledRoutesCard = wrapper.find('.tux-map__el--mini[data-id="c-api/routes"]');
    expect(rolledRoutesCard.exists()).toBe(true);
    expect(rolledRoutesCard.find(".tux-map__chip--links").text()).toBe("63 links");
    await rolledRoutesCard.trigger("click");
    await nextTick();

    // Outside collaborator cards show link count (`2 links` on ep_00.py), diff/impact badge, and `+N on other levels` strip
    expect(
      wrapper.find('.tux-map__el--mini[data-id="f:bff/routes/ep_00.py"] .tux-map__chip--links').text(),
    ).toBe("2 links");
    expect(wrapper.find(".tux-map__el--mini .tux-map__chip--diff-impact").exists()).toBe(true);
    expect(wrapper.find(".tux-map__other-levels").text()).toMatch(/\+\d+\s+on other levels/);

    // Default tab is `Within 2 steps` (capped at 60 initially with `Show all (63)`)
    const tabs = wrapper.findAll(".tux-map__blast-tabs button");
    expect(tabs[0]!.attributes("aria-pressed")).toBe("false");
    expect(tabs[1]!.attributes("aria-pressed")).toBe("true");
    expect(wrapper.findAll(".tux-map__blast-row").length).toBe(60);

    const showAllBtn = wrapper.find("button.tux-map__blast-more");
    expect(showAllBtn.exists()).toBe(true);
    expect(showAllBtn.text()).toBe("Show all (63)");
    await showAllBtn.trigger("click");
    await nextTick();
    expect(wrapper.findAll(".tux-map__blast-row").length).toBe(63);
    expect(wrapper.find(".tux-map__blast-row").text()).toContain("Why?");

    // Switch to `Direct` tab -> 62 rows
    await tabs[0]!.trigger("click");
    await nextTick();
    expect(wrapper.findAll(".tux-map__blast-row").length).toBe(62);

    // `mentions it` chip is off by default (`AUTH.md` hidden); toggling it on includes `AUTH.md` (63 direct!)
    const mentionsChip = wrapper
      .findAll("button.tux-map__blast-kind")
      .find((b) => b.text().includes("mentions it"));
    expect(mentionsChip).toBeDefined();
    expect(mentionsChip!.attributes("aria-pressed")).toBe("false");
    expect(wrapper.find(".tux-map__panel-blast").text()).not.toContain("AUTH.md");

    await mentionsChip!.trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__panel-blast").text()).toContain("AUTH.md");
    expect(await runComponentAxe(wrapper.element)).toEqual([]);
  });

  // ── #115 & #123: on-screen wire key, interactive wire link inspector & rule violations ──
  it("scopes the wire legend to on-screen link kinds and opens an accessible Wire Link Inspector with violations (#115, #123)", async () => {
    const model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "System" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [{ id: "c-app", kind: "container", name: "App" }],
        rels: [],
      },
      level3: {
        "c-app": [
          { id: "comp-ui", kind: "component", name: "UI Layer" },
          { id: "comp-db", kind: "component", name: "DB Layer" },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
      sourceBaseUrl: "https://code.tti.tamu.edu/tti/demo/src/branch/main",
      links: [
        { from: "comp-ui", to: "comp-db", kind: "imports", at: "ui/repo.ts:14" },
        {
          from: "comp-ui",
          to: "comp-db",
          kind: "imports",
          at: "ui/view.ts:14",
          sites: [14, 28],
        },
        {
          from: "comp-ui",
          to: "comp-db",
          kind: "calls",
          at: "ui/repo.ts:42",
          lineRange: [42, 42],
          violations: [
            {
              rule: "no-ui-to-db",
              message: "UI Layer cannot query DB Layer directly.",
              fix: "Call DomainService instead.",
            },
          ],
        },
        { from: "comp-ui", to: "comp-db", kind: "reads", at: "ui/repo.ts:60" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      attachTo: document.body,
      props: {
        model,
        initialLevel: 3,
        initialFocus: "c-app",
      },
    });

    // On-screen-only wire key: includes `imports`, `calls`, `reads`, NOT off-screen kinds like `forks`
    const legendKinds = wrapper
      .findAll(".tux-map__legend li[data-link-kind]")
      .map((li) => li.attributes("data-link-kind"));
    expect(legendKinds).toEqual(expect.arrayContaining(["imports", "calls", "reads"]));
    expect(legendKinds).not.toContain("forks");

    // Violation wire class & warning glyph on wire label button
    expect(wrapper.find(".tux-map__wire--violation").exists()).toBe(true);
    const wireBtn = wrapper.find('button.tux-map__lab[data-from="comp-ui"][data-to="comp-db"]');
    expect(wireBtn.exists()).toBe(true);
    expect(wireBtn.classes()).toContain("tux-map__lab--violation");
    expect(wireBtn.text()).toContain("⚠");

    // Clicking the wire label opens the Wire Link Inspector dialog
    await wireBtn.trigger("click");
    await nextTick();
    const pop = wrapper.find('.tux-map__wire-pop[role="dialog"]');
    expect(pop.exists()).toBe(true);
    expect(pop.find(".tux-map__wire-pop-sum").text()).toContain("2");
    expect(pop.find(".tux-map__wire-pop-cut").text()).toContain("reads");
    expect(pop.find(".tux-map__wire-pop-violations").text()).toContain("no-ui-to-db");
    expect(pop.find(".tux-map__wire-pop-fix").text()).toContain("Call DomainService instead.");
    const siteHrefs = pop
      .findAll("a.tux-map__source-lnk")
      .map((a) => a.attributes("href"));
    expect(siteHrefs).toEqual(
      expect.arrayContaining([
        "https://code.tti.tamu.edu/tti/demo/src/branch/main/ui/view.ts#L14",
        "https://code.tti.tamu.edu/tti/demo/src/branch/main/ui/view.ts#L28",
        "https://code.tti.tamu.edu/tti/demo/src/branch/main/ui/repo.ts#L42",
      ]),
    );
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Escape closes the wire inspector
    await pop.trigger("keydown", { key: "Escape" });
    await nextTick();
    expect(wrapper.find(".tux-map__wire-pop").exists()).toBe(false);

    // Selecting `comp-ui` renders `.tux-map__panel-violations` in the inspector panel
    await wrapper.find('.tux-map__el[data-id="comp-ui"]').trigger("click");
    await nextTick();
    const panelViols = wrapper.find(".tux-map__panel-violations");
    expect(panelViols.exists()).toBe(true);
    expect(panelViols.text()).toContain("no-ui-to-db");
    expect(panelViols.text()).toContain("UI Layer cannot query DB Layer directly.");
    expect(panelViols.text()).toContain("Fix: Call DomainService instead.");
    wrapper.unmount();
  });

  // ── #116: plain crumbs, sibling zoom badges, inherited Runs-on, Infra toggle restore, outside owner & disambiguation ──
  it("renders plain breadcrumbs, sibling zoom buttons only on zoomable cards, inherited Runs-on, and Infra state restore (#116)", async () => {
    const model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "TTI Platform" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-bff", kind: "container", name: "BFF Gateway", deployed: ["vm-bff"] },
          { id: "c-wrk", kind: "container", name: "Worker Service" },
        ],
        rels: [],
      },
      level3: {
        "c-bff": [
          { id: "bff-auth", kind: "component", name: "Auth Module" },
          { id: "bff-leaf", kind: "component", name: "Leaf Component" },
        ],
        "c-wrk": [{ id: "wrk-sync", kind: "component", name: "Sync Runner" }],
      },
      level4: {
        groups: [{ id: "rg-prod", zone: "cloud-prod", title: "Prod RG" }],
        nodes: [{ id: "vm-bff", group: "rg-prod", kind: "vm", title: "vm-bff-01", role: "Gateway VM", hosts: ["c-bff"] }],
        links: [],
      },
      subgraphs: {
        "bff-auth": {
          stratum: "Files",
          elements: [
            { id: "f:bff/sub1/auth.py", kind: "file", name: "auth.py", source: { path: "bff/sub1/auth.py" } },
            { id: "f:bff/sub2/auth.py", kind: "file", name: "auth.py", source: { path: "bff/sub2/auth.py" } },
          ],
          rels: [],
        },
        "wrk-sync": {
          stratum: "Files",
          elements: [
            { id: "f:wrk/runner.py", kind: "file", name: "runner.py", source: { path: "wrk/runner.py" } },
          ],
          rels: [],
        },
      },
      links: [
        { from: "f:wrk/runner.py", to: "f:bff/sub1/auth.py", kind: "calls" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      attachTo: document.body,
      props: {
        model,
        initialLevel: 3,
        initialFocus: "c-bff",
        initialSelectedId: "bff-auth",
      },
    });

    // Breadcrumbs omit `"Level N · "` prefixes
    const crumbsText = wrapper.find(".tux-map__crumbs").text();
    expect(crumbsText).not.toMatch(/Level\s+\d/);

    // `.tux-map__el-zb` is a sibling on `.tux-map__stage` (NEVER nested inside `button.tux-map__el`)
    // and ONLY rendered for `bff-auth` (which has a subgraph), NOT `bff-leaf`!
    expect(wrapper.find("button.tux-map__el button.tux-map__el-zb").exists()).toBe(false);
    expect(wrapper.find('button.tux-map__el-zb[data-zb-for="bff-auth"]').exists()).toBe(true);
    expect(wrapper.find('button.tux-map__el-zb[data-zb-for="bff-leaf"]').exists()).toBe(false);

    // Inherited `Runs on` (`c-bff` deployed on `vm-bff-01` -> inherited by child `bff-auth`!)
    expect(wrapper.find('.tux-map__el[data-id="bff-auth"]').text()).toContain("vm-bff-01");
    expect(wrapper.find(".tux-map__panel").text()).toContain("Runs on (Level 4)");
    expect(wrapper.find(".tux-map__panel").text()).toContain("vm-bff-01");

    // Pressing `Infrastructure` jumps to Level 4; pressing `Infrastructure` a second time restores Level 3 + `c-bff` + `bff-auth`!
    const infraBtn = wrapper
      .findAll(".tux-map__seg button")
      .find((b) => b.text().includes("Infrastructure"))!;
    await infraBtn.trigger("click");
    await nextTick();
    expect(infraBtn.attributes("aria-pressed")).toBe("true");
    await infraBtn.trigger("click");
    await nextTick();
    expect(infraBtn.attributes("aria-pressed")).toBe("false");
    expect(wrapper.find('.tux-map__el[data-id="bff-auth"]').attributes("aria-pressed")).toBe("true");

    // Zoom into `bff-auth` (Level 5): sibling `auth.py` files disambiguate (`sub1/auth.py`, `sub2/auth.py`)
    // and outside collaborator `runner.py` displays its owning component/container line `.tux-map__el-own`!
    await wrapper.find('button.tux-map__el-zb[data-zb-for="bff-auth"]').trigger("click");
    await nextTick();
    const cardNames = wrapper.findAll(".tux-map__el:not(.tux-map__el--mini) .tux-map__el-nm").map((n) => n.text());
    expect(cardNames).toEqual(expect.arrayContaining(["sub1/auth.py", "sub2/auth.py"]));
    const outsideCard = wrapper.find('.tux-map__el--mini[data-id="f:wrk/runner.py"]');
    expect(outsideCard.exists()).toBe(true);
    expect(outsideCard.find(".tux-map__el-own").exists()).toBe(true);
    wrapper.unmount();
  });

  // ── #117: roving tabindex, ? shortcuts modal, guarded tool keys, aria-live="off" panel, forced-colors ──
  it("supports arrow-key roving tabindex, ? keyboard shortcuts modal, guarded tool keys, and forced-colors wire cues (#117)", async () => {
    const wrapper = await mountSuspended(TuxArchitectureMap, {
      attachTo: document.body,
      props: {
        model: DEFAULT_TTI_LEVEL_MODEL,
        initialLevel: 2,
      },
    });

    // Inspector panel has `aria-live="off"` so only `.tux-map__sr` announces selection changes once
    expect(wrapper.find(".tux-map__panel").attributes("aria-live")).toBe("off");
    expect(wrapper.find(".tux-map__level-pill").attributes("aria-live")).toBeUndefined();

    // Roving tabindex across `.tux-map__el`: exactly 1 card has `tabindex="0"`, others `-1`; ArrowRight moves focus
    const cards = wrapper.findAll("button.tux-map__el");
    expect(cards.length).toBeGreaterThan(1);
    expect(cards.filter((c) => c.attributes("tabindex") === "0")).toHaveLength(1);
    (cards[0]!.element as HTMLButtonElement).focus();
    await cards[0]!.trigger("keydown", { key: "ArrowRight" });
    await nextTick();
    expect(document.activeElement).not.toBe(cards[0]!.element);
    expect((document.activeElement as HTMLElement)?.classList.contains("tux-map__el")).toBe(true);

    // Single-letter tool keys (`p`, `n`) do NOT activate annotation tools when `annotations` is false or card has focus
    await cards[0]!.trigger("keydown", { key: "p" });
    await nextTick();
    expect(wrapper.find('[aria-label="Annotation tools"]').exists()).toBe(false);

    // `?` button opens Keyboard Shortcuts modal (`axe` clean) and Escape closes & restores focus
    const helpBtn = wrapper.find("button.tux-map__shortcuts-btn");
    expect(helpBtn.exists()).toBe(true);
    (helpBtn.element as HTMLButtonElement).focus();
    await helpBtn.trigger("click");
    await nextTick();
    const dlg = wrapper.find('.tux-map__shortcuts-dialog[role="dialog"]');
    expect(dlg.exists()).toBe(true);
    expect(dlg.attributes("aria-modal")).toBe("true");

    await dlg.trigger("keydown", { key: "Escape" });
    await nextTick();
    await nextTick();
    expect(wrapper.find(".tux-map__shortcuts-dialog").exists()).toBe(false);
    expect(document.activeElement).toBe(helpBtn.element);

    // Re-open to verify 0 axe violations on the open dialog (runComponentAxe detaches wrapper.element on cleanup)
    await helpBtn.trigger("click");
    await nextTick();
    expect(await runComponentAxe(wrapper.element)).toEqual([]);

    // Verify `@media (forced-colors: active)` block defines distinct non-colour stroke cues
    const forcedIdx = STYLE.indexOf("@media (forced-colors: active)");
    expect(forcedIdx).toBeGreaterThan(-1);
    const forcedBlock = blockAt(STYLE, forcedIdx).body;
    expect(forcedBlock).toContain(".tux-map__wire-fg--blast");
    expect(forcedBlock).toContain("stroke-dasharray: 10 4");
    expect(forcedBlock).toContain(".tux-map__wire--violation");
    expect(forcedBlock).toContain("stroke-dasharray: 2 4");
    expect(forcedBlock).toContain(".tux-map__wire-fg--trace");
    wrapper.unmount();
  });

  // ── #118 & #121: LCA outside splitting, wire category filters & vendored-copy folding ──
  it("splits LCA-rolled outside cards on click, filters wire categories, and folds vendored copies (#118, #121)", async () => {
    const model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-core", kind: "container", name: "Core" },
          { id: "c-clients", kind: "container", name: "Clients" },
          { id: "c-qa", kind: "container", name: "QA Suite" },
        ],
        rels: [],
      },
      level3: {
        "c-core": [{ id: "core-mod", kind: "component", name: "Core Module" }],
        "c-clients": [
          { id: "cli-web", kind: "component", name: "Web Client" },
          { id: "cli-mob", kind: "component", name: "Mobile Client" },
        ],
        "c-qa": [{ id: "qa-e2e", kind: "component", name: "E2E Tests" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "core-mod": {
          stratum: "Files",
          elements: [
            { id: "f:core/lib.ts", kind: "file", name: "lib.ts", source: { path: "core/lib.ts" } },
            { id: "f:core/vendor_lib.ts", kind: "file", name: "vendor_lib.ts", source: { path: "core/vendor_lib.ts" } },
          ],
          rels: [],
        },
        "cli-web": {
          elements: [{ id: "f:web/app.ts", kind: "file", name: "app.ts", source: { path: "web/app.ts" } }],
          rels: [],
        },
        "cli-mob": {
          elements: [{ id: "f:mob/app.ts", kind: "file", name: "app.ts", source: { path: "mob/app.ts" } }],
          rels: [],
        },
        "qa-e2e": {
          elements: [{ id: "f:tests/test_lib.ts", kind: "file", name: "test_lib.ts", source: { path: "tests/test_lib.ts" } }],
          rels: [],
        },
      },
      links: [
        { from: "f:core/vendor_lib.ts", to: "f:core/lib.ts", kind: "copies", stop: true },
        { from: "f:web/app.ts", to: "f:core/lib.ts", kind: "imports" },
        { from: "f:mob/app.ts", to: "f:core/lib.ts", kind: "calls" },
        { from: "f:tests/test_lib.ts", to: "f:core/lib.ts", kind: "tests", stop: true },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model,
        initialLevel: 5,
        initialFocus: "core-mod",
      },
    });

    // `#121`: `f:core/vendor_lib.ts` is folded into `f:core/lib.ts` with `"vendored copy"` chip
    expect(wrapper.find('.tux-map__el[data-id="f:core/vendor_lib.ts"]').exists()).toBe(false);
    const libCard = wrapper.find('.tux-map__el[data-id="f:core/lib.ts"]');
    expect(libCard.exists()).toBe(true);
    expect(libCard.text()).toContain("vendored copy");

    // `#118`: Default wire filter is `Prod` only -> `qa-e2e` / `c-qa` test caller is hidden; `c-clients` LCA card is shown!
    expect(wrapper.find('.tux-map__el--mini[data-id="c-clients"]').exists()).toBe(true);
    expect(wrapper.find('.tux-map__el--mini[data-id="f:tests/test_lib.ts"]').exists()).toBe(false);

    // Clicking `c-clients` splits it one level into `f:web/app.ts` and `f:mob/app.ts` and emits `update:splitIds`
    await wrapper.find('.tux-map__el--mini[data-id="c-clients"]').trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:splitIds")?.[0]?.[0]).toEqual(["c-clients"]);
    expect(wrapper.find('.tux-map__el--mini[data-id="f:web/app.ts"]').exists()).toBe(true);
    expect(wrapper.find('.tux-map__el--mini[data-id="f:mob/app.ts"]').exists()).toBe(true);

    // Enabling `Tests` wire filter brings in `f:tests/test_lib.ts` and emits `update:wireFilters`
    const testsFilterBtn = wrapper
      .findAll("button.tux-map__wire-filter-btn")
      .find((b) => b.text().includes("Tests"))!;
    await testsFilterBtn.trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:wireFilters")).toBeTruthy();
    expect(wrapper.find('.tux-map__el--mini[data-id="f:tests/test_lib.ts"]').exists()).toBe(true);
  });

  // ── #124: non-throwing diagnostics, collapsed folder aliases, >24 bands, >40 auto-list, >30 hidden labels ──
  it("handles cyclic models without throwing, resolves collapsed aliases, bands >24 cards, auto-lists >40 cards, and hides >30 wire labels via opacity (#124)", async () => {
    // 1. Cyclic model shows `.tux-map__diag-note` and never throws
    const cyclicModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "C1" }], rels: [] },
      level3: { c1: [{ id: "comp1", kind: "component", name: "Comp 1" }] },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        comp1: { elements: [{ id: "d:x", kind: "folder", name: "x/" }], rels: [] },
        "d:x": { elements: [{ id: "d:y", kind: "folder", name: "y/" }], rels: [] },
        "d:y": { elements: [{ id: "d:x", kind: "folder", name: "x/" }], rels: [] },
      },
    } as unknown as TuxMapLevelModel;

    const diagWrap = await mountSuspended(TuxArchitectureMap, {
      props: { model: cyclicModel, initialLevel: 3, initialFocus: "c1" },
    });
    expect(diagWrap.find(".tux-map__diag-note").exists()).toBe(true);

    // 2. 28 cards + 34 wires -> horizontal bands (`.tux-map__bound--band` / multiple `.tux-map__bound`) + `.tux-map__lab--forced` (`opacity: 0`, never `display: none`)
    const cards28 = Array.from({ length: 28 }, (_, i) => ({
      id: `f:mod/m${i}.ts`,
      kind: "file" as const,
      name: `m${i}.ts`,
      tech: i < 14 ? "API" : "Worker",
    }));
    const rels34 = Array.from({ length: 34 }, (_, i) => ({
      from: `f:mod/m${i % 28}.ts`,
      to: `f:mod/m${(i * 3 + 1) % 28}.ts`,
      label: "imports",
    })).filter((r) => r.from !== r.to);
    while (rels34.length < 32) {
      rels34.push({
        from: `f:mod/m${rels34.length % 14}.ts`,
        to: `f:mod/m${14 + (rels34.length % 14)}.ts`,
        label: "calls",
      });
    }
    const dense28Model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "C1" }], rels: [] },
      level3: { c1: [{ id: "comp-28", kind: "component", name: "Comp 28" }] },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "comp-28": { stratum: "Files", elements: cards28, rels: rels34 },
      },
    };
    const dense28Wrap = await mountSuspended(TuxArchitectureMap, {
      props: { model: dense28Model, initialLevel: 5, initialFocus: "comp-28" },
    });
    expect(dense28Wrap.findAll(".tux-map__bound").length).toBeGreaterThan(1);
    expect(dense28Wrap.findAll("button.tux-map__lab--forced").length).toBeGreaterThan(30);
    // Forced labels hide via opacity: 0, NEVER display: none
    expect(values(rulesFor("tux-map__lab--forced"), "display")).not.toContain("none");
    expect(values(rulesFor("tux-map__lab--forced"), "opacity")).toContain("0");

    // 3. 44 cards (> default `denseListThreshold` of 40) -> auto-opens bounded `.tux-map__list`
    const cards44 = Array.from({ length: 44 }, (_, i) => ({
      id: `f:big/item_${i}.ts`,
      kind: "file" as const,
      name: `item_${i}.ts`,
    }));
    const dense44Model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "C1" }], rels: [] },
      level3: { c1: [{ id: "comp-44", kind: "component", name: "Comp 44" }] },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "comp-44": { stratum: "Files", elements: cards44, rels: [] },
      },
    };
    const dense44Wrap = await mountSuspended(TuxArchitectureMap, {
      props: { model: dense44Model, initialLevel: 5, initialFocus: "comp-44" },
    });
    expect(dense44Wrap.find(".tux-map__list").exists()).toBe(true);
    expect(values(rulesFor("tux-map__list"), "max-height").length).toBeGreaterThan(0);
  });

  // ── #125 & #126: opt-in annotations, outline rail & crumb switcher, directed path trace & lazy resolveSubgraph ──
  it("supports opt-in annotations, outline tree rail, crumb sibling switcher, directed Trace to…, and lazy resolveSubgraph (#125, #126)", async () => {
    let resolvePending!: (sg: { stratum: string; elements: { id: string; kind: "file"; name: string }[]; rels: [] }) => void;
    const resolveSubgraph = vi.fn(
      () =>
        new Promise<{ stratum: string; elements: { id: string; kind: "file"; name: string }[]; rels: [] }>((res) => {
          resolvePending = res;
        }),
    );

    const model: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [{ id: "c1", kind: "container", name: "Service Container" }],
        rels: [],
      },
      level3: {
        c1: [
          { id: "comp-lazy", kind: "component", name: "Lazy Component", subgraphRef: "sg-lazy" },
          { id: "comp-peer", kind: "component", name: "Peer Component", subgraphRef: "sg-peer" },
          { id: "comp-sink", kind: "component", name: "Sink Component" },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
      links: [
        { from: "comp-lazy", to: "comp-peer", kind: "calls", at: "lazy.ts:8" },
        { from: "comp-peer", to: "comp-sink", kind: "imports", at: "peer.ts:3" },
      ],
    };

    const wrapper = await mountSuspended(TuxArchitectureMap, {
      props: {
        model,
        initialLevel: 3,
        initialFocus: "c1",
        initialSelectedId: "comp-lazy",
        annotations: true,
        modelRef: "abc1234",
        resolveSubgraph,
      },
    });

    // `annotations: true` renders annotation tool buttons
    expect(wrapper.find('[aria-label="Annotation tools"]').exists()).toBe(true);

    // Collapsible `.tux-map__outline` tree rail opens on toggle
    await wrapper.find("button.tux-map__outline-toggle").trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__outline").exists()).toBe(true);
    expect(wrapper.findAll(".tux-map__outline-item").length).toBeGreaterThan(0);

    // Directed `"Trace to…"` highlights `.tux-map__el--trace` and `.tux-map__wire-fg--trace`
    const tracePickerBtn = wrapper
      .findAll(".tux-map__trace-picker button.tux-map__panel-btn")
      .find((b) => b.text().includes("Trace to"))!;
    await tracePickerBtn.trigger("click");
    await nextTick();
    const sinkOpt = wrapper
      .findAll("button.tux-map__trace-opt")
      .find((b) => b.text().includes("Sink Component"))!;
    await sinkOpt.trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:traceTarget")?.[0]?.[0]).toBe("comp-sink");
    expect(wrapper.find('.tux-map__el--trace[data-id="comp-peer"]').exists()).toBe(true);
    expect(wrapper.find(".tux-map__wire-fg--trace").exists()).toBe(true);

    // Lazy `resolveSubgraph` (`#126`): `comp-lazy` has `subgraphRef` + `resolveSubgraph` -> zoom badge exists!
    const lazyZb = wrapper.find('button.tux-map__el-zb[data-zb-for="comp-lazy"]');
    expect(lazyZb.exists()).toBe(true);
    await lazyZb.trigger("click");
    await nextTick();

    // While in flight: `resolveSubgraph("sg-lazy", "abc1234")` called, card has `aria-busy="true"` + `.tux-map__el-busy` `"Loading…"`
    expect(resolveSubgraph).toHaveBeenCalledTimes(1);
    expect(resolveSubgraph).toHaveBeenCalledWith("sg-lazy", "abc1234");
    const lazyCardBusy = wrapper.find('.tux-map__el[data-id="comp-lazy"]');
    expect(lazyCardBusy.attributes("aria-busy")).toBe("true");
    expect(lazyCardBusy.find(".tux-map__el-busy").text()).toBe("Loading…");

    // Resolve promise -> map zooms into Level 5 showing `f:lazy/worker.ts`!
    resolvePending({
      stratum: "Files",
      elements: [{ id: "f:lazy/worker.ts", kind: "file", name: "worker.ts" }],
      rels: [],
    });
    await Promise.resolve();
    await nextTick();
    await nextTick();
    expect(wrapper.find('.tux-map__el[data-id="f:lazy/worker.ts"]').exists()).toBe(true);

    // Crumb sibling switcher (`#125`): `Lazy Component` crumb has siblings (`Peer Component`, `Sink Component`)
    expect(wrapper.find("button.tux-map__crumb-sib-btn").exists()).toBe(true);
    await wrapper.find("button.tux-map__crumb-sib-btn").trigger("click");
    await nextTick();
    expect(wrapper.find(".tux-map__crumb-menu").text()).toContain("Peer Component");

    // Zoom out to `Service Container` (Level 3) and zoom back into `comp-lazy` -> cached, so `resolveSubgraph` is NOT called a second time!
    await wrapper
      .findAll("button.tux-map__crumb-btn")
      .find((b) => b.text() === "Service Container")!
      .trigger("click");
    await nextTick();
    await wrapper.find('button.tux-map__el-zb[data-zb-for="comp-lazy"]').trigger("click");
    await nextTick();
    expect(resolveSubgraph).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.tux-map__el[data-id="f:lazy/worker.ts"]').exists()).toBe(true);
  });

  // ── Slice 7 Three-Pass Audit Regressions (P0-1..P0-3, P1-1..P1-5, S7-04, S7-08, S7-10) ──
  it("covers resting @bound/@more-in wire inspection, Level 5+ rel filtering, lazy Outline expand + Escape cancel, narrow crumbs, alias level sync, vendored copy folding, and origin/issue URL guards", async () => {
    // 1. Resting `@bound` + `@more-in` Wire Inspector & sibling outside card disambiguation (`P0-1`, `P1-2`, `S7-04`)
    const overComps = Array.from({ length: 12 }, (_, i) => ({
      id: `comp-over-${i}`,
      kind: "component" as const,
      name: `Over ${i}`,
    }));
    const overSubgraphs = Object.fromEntries(
      overComps.map((c, i) => [
        c.id,
        {
          stratum: "Files",
          elements: [{ id: `f:over/o${i}.ts`, kind: "file" as const, name: `o${i}.ts` }],
          rels: [],
        },
      ]),
    );
    const outsideModel: TuxMapLevelModel = {
      sourceBaseUrl: "https://code.tti.tamu.edu/tti/demo/src/branch/main",
      issueBaseUrl: "https://code.tti.tamu.edu/tti/demo/issues",
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: {
        boundary: "sys",
        elements: [
          { id: "c-core", kind: "container", name: "Core Container" },
          { id: "c-ext-b", kind: "container", name: "Ext B" },
        ],
        rels: [],
      },
      level3: {
        "c-core": [
          { id: "comp-core", kind: "component", name: "Core Comp" },
          { id: "comp-a", kind: "component", name: "Comp A" },
          ...overComps,
        ],
        "c-ext-b": [{ id: "comp-b", kind: "component", name: "Comp B" }],
      },
      level4: { groups: [], nodes: [], links: [] },
      subgraphs: {
        "comp-core": {
          stratum: "Files",
          elements: [
            {
              id: "f:core/lib.mjs",
              kind: "file",
              name: "lib.mjs",
              source: { path: "core/lib.mjs", url: "https://evil.example/phish" },
              roadmap: [12.5, 42],
            },
            { id: "f:vendor/lib.mjs", kind: "file", name: "vendor/lib.mjs" },
            { id: "f:core/only-copy.mjs", kind: "file", name: "only-copy.mjs" },
          ],
          rels: [
            { from: "f:core/lib.mjs", to: "f:core/only-copy.mjs", label: "imports" },
          ],
        },
        "comp-a": {
          stratum: "Files",
          elements: [
            { id: "f:pkg-a/src/index.ts", kind: "file", name: "index.ts", source: { path: "pkg-a/src/index.ts" } },
            { id: "f:pkg-b/src/index.ts", kind: "file", name: "index.ts", source: { path: "pkg-b/src/index.ts" } },
          ],
          rels: [],
        },
        "comp-b": {
          stratum: "Files",
          elements: [{ id: "f:ext-b/caller.ts", kind: "file", name: "caller.ts", source: { path: "ext-b/caller.ts" } }],
          rels: [],
        },
        ...overSubgraphs,
      },
      links: [
        { from: "f:vendor/lib.mjs", to: "f:core/lib.mjs", kind: "copies", stop: true },
        { from: "f:core/only-copy.mjs", to: "f:ext-b/caller.ts", kind: "copies", stop: true },
        { from: "f:pkg-a/src/index.ts", to: "f:core/lib.mjs", kind: "calls", at: "pkg-a/src/index.ts:9" },
        { from: "f:pkg-a/src/index.ts", to: "f:core/lib.mjs", kind: "imports", at: "pkg-a/src/index.ts:2" },
        { from: "f:pkg-b/src/index.ts", to: "f:core/lib.mjs", kind: "imports", at: "pkg-b/src/index.ts:4" },
        { from: "f:pkg-b/src/index.ts", to: "f:core/lib.mjs", kind: "calls", at: "pkg-b/src/index.ts:12" },
        ...overComps.map((_, i) => ({
          from: `f:over/o${i}.ts`,
          to: "f:core/lib.mjs",
          kind: "calls",
          at: `over/o${i}.ts:2`,
        })),
        { from: "f:ext-b/caller.ts", to: "f:vendor/lib.mjs", kind: "tests", stop: true, at: "ext-b/caller.ts:15" },
        { from: "f:core/lib.mjs", to: "f:core/only-copy.mjs", kind: "tests", stop: true, at: "core/lib.spec.ts:5" },
      ],
    };

    // Mount with `initialSelectedId: "f:vendor/lib.mjs"` (folded copy) and >12 incoming outside buckets so `@more-in` renders!
    const w1 = await mountSuspended(TuxArchitectureMap, {
      attachTo: document.body,
      props: {
        model: outsideModel,
        initialLevel: 5,
        initialFocus: "comp-core",
        initialSelectedId: "f:vendor/lib.mjs",
      },
    });

    // Folded vendored copy (`P1-5`): `f:vendor/lib.mjs` folded into `f:core/lib.mjs`, selection remapped to `f:core/lib.mjs`
    expect(w1.find('.tux-map__el[data-id="f:vendor/lib.mjs"]').exists()).toBe(false);
    const canonCard = w1.find('.tux-map__el[data-id="f:core/lib.mjs"]');
    expect(canonCard.exists()).toBe(true);
    expect(canonCard.attributes("aria-pressed")).toBe("true");
    expect(canonCard.find(".tux-map__chip--vendored").text()).toBe("1 vendored copy");

    // Standalone vendored copy (`f:core/only-copy.mjs` whose canonical `f:ext-b/caller.ts` is off-stage) shows `"vendored copy"`, NEVER `"0 vendored copies"`
    const standaloneCopyCard = w1.find('.tux-map__el[data-id="f:core/only-copy.mjs"]');
    expect(standaloneCopyCard.find(".tux-map__chip--vendored").text()).toBe("vendored copy");

    // Inspector panel shows `.tux-map__panel-vendored` list, rejects cross-origin `source.url`, and rejects non-integer issue `12.5` (`S7-08`, `S7-10`)
    expect(w1.find(".tux-map__panel-vendored").text()).toContain("vendor/lib.mjs");
    const panelSourceHrefs = w1.findAll(".tux-map__panel a.tux-map__source-lnk").map((a) => a.attributes("href"));
    expect(panelSourceHrefs.some((h) => h?.includes("evil.example"))).toBe(false);
    const panelIssueHrefs = w1.findAll(".tux-map__panel a.tux-map__issue-lnk").map((a) => a.attributes("href"));
    expect(panelIssueHrefs.some((h) => h?.endsWith("/issues/12.5"))).toBe(false);
    expect(panelIssueHrefs).toContain("https://code.tti.tamu.edu/tti/demo/issues/42");

    // Clear selection so outside wires route to `@bound` at rest, then click both the resting `@bound` wire and `@more-in` wire (`P0-1`, `S7-04`)
    await canonCard.trigger("click");
    await nextTick();
    const restingOutWire = w1.find('button.tux-map__lab[data-from="comp-a"][data-to="@bound"]');
    expect(restingOutWire.exists()).toBe(true);
    await restingOutWire.trigger("click");
    await nextTick();
    const restingPop = w1.find('.tux-map__wire-pop[role="dialog"]');
    expect(restingPop.exists()).toBe(true);
    expect(restingPop.find(".tux-map__wire-pop-sum").text()).not.toContain("0 underlying");
    expect(restingPop.text()).toContain("pkg-a/src/index.ts:9");

    const moreInWire = w1.find('button.tux-map__lab[data-from^="@more-in:"][data-to="@bound"]');
    expect(moreInWire.exists()).toBe(true);
    await moreInWire.trigger("click");
    await nextTick();
    expect(w1.find('.tux-map__wire-pop[role="dialog"]').text()).toContain("over/o");

    // Click `comp-a` to split it and verify sibling outside disambiguation (`pkg-a/src` vs `pkg-b/src`, `P1-2`), `Fold split (1)`, and `"Fold back into Comp A"`
    await w1.find('.tux-map__el[data-id="comp-a"]').trigger("click");
    await nextTick();
    const outCardTexts = w1.findAll(".tux-map__el--mini").map((el) => el.text());
    expect(outCardTexts.some((t) => t.includes("pkg-a/src"))).toBe(true);
    expect(outCardTexts.some((t) => t.includes("pkg-b/src"))).toBe(true);
    expect(w1.find("button.tux-map__fold-split-btn").text()).toContain("Fold split (1)");
    await w1.find('.tux-map__el--mini[data-id="f:pkg-a/src/index.ts"]').trigger("click");
    await nextTick();
    expect(w1.find(".tux-map__panel").text()).toContain("Fold back into Comp A");

    // Level 5+ Wire Category Filter (`P0-2`): toggling `Prod` off hides `sg.rels` `imports` wire while keeping `tests` wire when `Tests` is toggled on
    await w1.find('button.tux-map__wire-filter-btn[data-wire-filter="prod"]').trigger("click");
    await nextTick();
    expect(
      w1.find('button.tux-map__lab[data-from="f:core/lib.mjs"][data-to="f:core/only-copy.mjs"]').exists(),
    ).toBe(false);
    await w1.find('button.tux-map__wire-filter-btn[data-wire-filter="tests"]').trigger("click");
    await nextTick();
    expect(
      w1.find('button.tux-map__lab[data-from="f:core/lib.mjs"][data-to="f:core/only-copy.mjs"]').exists(),
    ).toBe(true);
    w1.unmount();

    // 2. Lazy Outline expand + `Escape` cancels pending lazy zoom (`P0-3`, `P1-1`, `S7-10`)
    let resolveOutline!: (sg: { stratum: string; elements: { id: string; kind: "file"; name: string }[]; rels: [] }) => void;
    let resolveZoom!: (sg: { stratum: string; elements: { id: string; kind: "file"; name: string }[]; rels: [] }) => void;
    let callNum = 0;
    const lazyResolver = vi.fn(
      () =>
        new Promise<{ stratum: string; elements: { id: string; kind: "file"; name: string }[]; rels: [] }>((res) => {
          callNum += 1;
          if (callNum === 1) resolveOutline = res;
          else resolveZoom = res;
        }),
    );
    const lazyModel: TuxMapLevelModel = {
      level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
      level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "C1" }], rels: [] },
      level3: {
        c1: [
          { id: "comp-outline", kind: "component", name: "Outline Lazy", subgraphRef: "sg-outline" },
          { id: "comp-cancel", kind: "component", name: "Cancel Lazy", subgraphRef: "sg-cancel" },
        ],
      },
      level4: { groups: [], nodes: [], links: [] },
    };
    const w2 = await mountSuspended(TuxArchitectureMap, {
      props: { model: lazyModel, initialLevel: 3, initialFocus: "c1", resolveSubgraph: lazyResolver },
    });
    await w2.find("button.tux-map__outline-toggle").trigger("click");
    await nextTick();
    const expBtn = w2.find('button.tux-map__outline-exp[aria-label="Expand Outline Lazy"]');
    expect(expBtn.exists()).toBe(true);
    await expBtn.trigger("click");
    await nextTick();
    expect(lazyResolver).toHaveBeenCalledWith("sg-outline", undefined);
    resolveOutline({
      stratum: "Files",
      elements: [{ id: "f:outline/item.ts", kind: "file", name: "item.ts" }],
      rels: [],
    });
    await Promise.resolve();
    await nextTick();
    await nextTick();
    expect(w2.find('[data-outline-id="f:outline/item.ts"]').exists()).toBe(true);

    // Start zoom on `comp-cancel`, press Escape while in-flight, then resolve -> must STAY at Level 3 (`c1`)!
    await w2.find('button.tux-map__el-zb[data-zb-for="comp-cancel"]').trigger("click");
    await nextTick();
    expect(lazyResolver).toHaveBeenCalledWith("sg-cancel", undefined);
    await w2.find(".tux-map").trigger("keydown", { key: "Escape" });
    await nextTick();
    resolveZoom({
      stratum: "Files",
      elements: [{ id: "f:cancel/hijack.ts", kind: "file", name: "hijack.ts" }],
      rels: [],
    });
    await Promise.resolve();
    await nextTick();
    await nextTick();
    expect(w2.find('.tux-map__el[data-id="f:cancel/hijack.ts"]').exists()).toBe(false);
    expect(w2.find('.tux-map__el[data-id="comp-cancel"]').exists()).toBe(true);
    w2.unmount();

    // 3. Narrow (`375px`) deep Level 7 breadcrumb `…` overflow collapse (`P1-3`) + aliased bookmark `currentLevel` sync (`P1-4`)
    const prevInnerW = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { value: 375, configurable: true });
    try {
      const deepFiles = Array.from({ length: 10 }, (_, i) => ({
        id: `f:deep/f${i}.ts`,
        kind: "file" as const,
        name: `f${i}.ts`,
      }));
      const deepAndAliasModel: TuxMapLevelModel = {
        level1: { elements: [{ id: "sys", kind: "system", name: "Sys" }], rels: [] },
        level2: { boundary: "sys", elements: [{ id: "c1", kind: "container", name: "C1" }], rels: [] },
        level3: {
          c1: [
            { id: "comp-deep", kind: "component", name: "Deep Comp" },
            { id: "comp-small", kind: "component", name: "Small Comp" },
          ],
        },
        level4: { groups: [], nodes: [], links: [] },
        subgraphs: {
          "comp-deep": {
            stratum: "Folders",
            elements: [
              { id: "d:sub1", kind: "folder", name: "sub1/" },
              { id: "d:peer1", kind: "folder", name: "peer1/" },
            ],
            rels: [],
          },
          "d:peer1": { stratum: "Files", elements: deepFiles.map((f, i) => ({ ...f, id: `f:p1/${i}.ts` })), rels: [] },
          "d:sub1": { stratum: "Files", elements: deepFiles, rels: [] },
          "f:deep/f0.ts": {
            stratum: "Symbols",
            elements: [{ id: "fn:deep/f0.ts#run", kind: "function", name: "run()" }],
            rels: [],
          },
          "comp-small": {
            stratum: "Folders",
            elements: [{ id: "d:sm/api", kind: "folder", name: "api/" }],
            rels: [],
          },
          "d:sm/api": {
            stratum: "Files",
            elements: [{ id: "f:sm/api/routes.ts", kind: "file", name: "routes.ts" }],
            rels: [],
          },
        },
      };

      const wNarrow = await mountSuspended(TuxArchitectureMap, {
        props: {
          model: deepAndAliasModel,
          initialLevel: 7,
          initialFocus: "f:deep/f0.ts",
          eyebrow: "Test",
          title: "Deep Narrow Map",
        },
      });
      window.dispatchEvent(new Event("resize"));
      await nextTick();
      expect(wNarrow.find("button.tux-map__crumb-overflow-btn").exists()).toBe(true);
      wNarrow.unmount();

      // Bookmark to `d:sm/api` at `initialLevel: 6` -> `d:sm/api` collapsed into `comp-small` (Level 5), so `currentLevel` syncs to `5`!
      const wAlias = await mountSuspended(TuxArchitectureMap, {
        props: {
          model: deepAndAliasModel,
          initialLevel: 6,
          initialFocus: "d:sm/api",
          title: "Alias Map",
        },
      });
      await nextTick();
      expect(wAlias.find(".tux-map__level-text").text()).toContain("Level 5");
      wAlias.unmount();
    } finally {
      Object.defineProperty(window, "innerWidth", { value: prevInnerW, configurable: true });
    }
  });
});

// vitest runs from the repository root (the Nuxt environment's import.meta.url is not a file: URL)
const SFC = readFileSync(join(process.cwd(), "packages/diagrams/app/components/TuxArchitectureMap.vue"), "utf8");
const TEMPLATE = SFC.slice(SFC.indexOf("\n<template>"), SFC.indexOf("\n</template>"));
const STYLE = SFC.slice(SFC.indexOf("\n<style")).replace(/\/\*[\s\S]*?\*\//g, "");
const REDUCED = blockAt(STYLE, STYLE.indexOf("@media (prefers-reduced-motion: reduce)"));

/** The braces-balanced block that opens after `at`: its body, and where it starts and ends in `css`. */
function blockAt(css: string, at: number): { body: string; start: number; end: number } {
  const open = css.indexOf("{", at);
  for (let i = open, depth = 0; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return { body: css.slice(open + 1, i), start: at, end: i + 1 };
  }
  return { body: "", start: at, end: at };
}

/** [selectors, declarations] for every innermost rule (a block's own rules come out too). */
function rules(css: string): [string[], string][] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [
    m[1]!.split(",").map((s) => s.trim()).filter(Boolean),
    m[2]!,
  ]);
}

/** The declarations of every rule naming the class itself (not a longer class it prefixes), in source order. */
function rulesFor(cls: string): string[] {
  const own = new RegExp(`\\.${cls}(?![\\w-])`);
  return rules(STYLE).filter(([sels]) => sels.some((s) => own.test(s))).map(([, body]) => body);
}

/** Every value `prop` is given across `bodies`, in source order, with any !important removed. */
function values(bodies: string[], prop: string): string[] {
  const re = new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;}]+)`, "g");
  return bodies.flatMap((body) => [...body.matchAll(re)].map((m) => m[1]!.replace(/!important\s*$/, "").trim()));
}

/** A comma-separated CSS value split at its top level only (commas inside cubic-bezier() stay). */
function topLevel(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let item = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(item);
      item = "";
    } else item += ch;
  }
  out.push(item);
  return out.map((s) => s.trim()).filter(Boolean);
}

/** matchMedia answering `reduce` for prefers-reduced-motion, and no to everything else. */
function stubReducedMotion(reduce: boolean): () => void {
  const orig = window.matchMedia;
  window.matchMedia = ((q: string) =>
    ({
      matches: reduce && /prefers-reduced-motion:\s*reduce/.test(q),
      media: q,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
  return () => {
    window.matchMedia = orig;
  };
}

