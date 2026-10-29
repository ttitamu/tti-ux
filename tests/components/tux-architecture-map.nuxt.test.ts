import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxArchitectureMap from "../../packages/diagrams/app/components/TuxArchitectureMap.vue";
import { DEFAULT_TTI_LEVEL_MODEL, type TuxMapLevelModel } from "../../packages/diagrams/app/utils/tuxArchitectureMap";
import { runComponentAxe } from "../axe-helper";

describe("TuxArchitectureMap Component", () => {
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
    const all = rules(STYLE);
    for (const cls of srClasses) {
      const body = all.find(([sel]) => sel.includes(`.${cls}`))?.[1] ?? "";
      expect(body, cls).toMatch(/position:\s*absolute/);
      expect(body, cls).toMatch(/clip-path:\s*inset\(50%\)|clip:\s*rect\(0 0 0 0\)/);
    }
    const list = all.find(([sel]) => sel.includes(".tux-map__blast-list"))?.[1] ?? "";
    expect(list).toMatch(/overflow-y:\s*auto/);
    expect(list).toMatch(/position:\s*relative/);
  });

  it("stops every animation and every moving transition under prefers-reduced-motion (2.3.3)", () => {
    const reduced = rules(REDUCED.body);
    const covered = (sel: string, ok: (body: string) => boolean) =>
      reduced.some(([sels, body]) => sels.includes(sel) && ok(body));
    // the property each comma-separated item names (cubic-bezier's own commas leave numbers, which never match)
    const MOVES = new Set(["all", "transform", "translate", "scale", "rotate", "inset", "left", "top", "right", "bottom", "width", "height"]);
    const moving = (value: string) => value.split(",").some((item) => MOVES.has(item.trim().split(/\s+/)[0]!));
    const elsewhere = rules(STYLE.slice(0, REDUCED.start) + STYLE.slice(REDUCED.end));
    const animated: string[] = [];
    const sliding: string[] = [];
    for (const [sels, body] of elsewhere) {
      if (/animation:\s*(?!none\b)[\w-]/.test(body)) animated.push(...sels);
      const t = /transition:\s*([^;]+);/.exec(body)?.[1];
      if (t && t.trim() !== "none" && moving(t)) sliding.push(...sels);
    }
    expect(animated.length).toBeGreaterThan(0);
    expect(animated.filter((s) => !covered(s, (b) => /animation:\s*none/.test(b)))).toEqual([]);
    expect(sliding.filter((s) => !covered(s, (b) => !moving(/transition:\s*([^;]+);/.exec(b)?.[1] ?? "")))).toEqual([]);
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

