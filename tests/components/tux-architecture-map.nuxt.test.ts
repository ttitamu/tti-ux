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

