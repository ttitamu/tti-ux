// @vitest-environment nuxt
/**
 * TuxDependencyGraph — the interaction contract. The layout itself is
 * pure and tested without a DOM in tests/tux-dependency-graph.test.ts;
 * this half locks what a person touches: cards are real buttons in step
 * order that emit `select`, arrow keys move focus, "Waiting on N" counts
 * open blockers only, unlinked items go to the strip, `selected` and
 * hover trace the chain, the loop banner says what it says and its
 * members are one click away, bad links are counted in words, and the
 * empty / unlinked / loading / hideDone states.
 */
import { afterEach, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxDependencyGraph from "../../app/components/TuxDependencyGraph.vue";
import type { TuxGraphEdge, TuxGraphNode } from "../../app/utils/tuxDependencyGraph";

const n = (id: string, extra: Partial<TuxGraphNode> = {}): TuxGraphNode => ({
  id,
  label: `Item ${id}`,
  ref: `#${id}`,
  ...extra,
});
const e = (from: string, to: string): TuxGraphEdge => ({ from, to });

const roadmap: TuxGraphNode[] = [
  n("180", { label: "Entra group export", group: "Identity", status: { label: "Done", tone: "success" }, done: true }),
  n("181", { label: "Team mapping rules", group: "Identity", status: { label: "In progress", tone: "info" } }),
  n("184", { label: "Nightly sync job", group: "Identity" }),
  n("190", { label: "Offboarding sweep", group: "Identity" }),
  n("tti/other#9", { ref: "tti/other#9", label: "Shared token store", external: true }),
  n("200", { label: "Unlinked chore" }),
];
const links: TuxGraphEdge[] = [e("180", "184"), e("181", "184"), e("184", "190"), e("tti/other#9", "181")];

afterEach(() => {
  document.body.innerHTML = "";
});

describe("TuxDependencyGraph — mounted", () => {
  it("renders cards as buttons in step order with descriptions; click emits select", async () => {
    const w = await mountSuspended(TuxDependencyGraph, { props: { nodes: roadmap, edges: links } });
    const cards = w.findAll(".tux-dependency-graph__node");
    expect(cards.map((c) => c.attributes("data-node-id"))).toEqual(["180", "tti/other#9", "181", "184", "190"]);
    for (const c of cards) {
      expect(c.element.tagName).toBe("BUTTON"); // Enter and Space come from the platform
      expect(c.attributes("type")).toBe("button");
      const desc = w.find(`[id="${c.attributes("aria-describedby")}"]`);
      expect(desc.exists()).toBe(true);
    }
    expect(w.find(`[id="${cards[3]!.attributes("aria-describedby")}"]`).text()).toContain("Waits on #180 (done), #181");
    await cards[3]!.trigger("click");
    expect(w.emitted("select")?.at(-1)).toEqual(["184"]);
  });

  it("says 'Waiting on N' for open blockers only, and marks external cards", async () => {
    const w = await mountSuspended(TuxDependencyGraph, { props: { nodes: roadmap, edges: links } });
    const card = (id: string) => w.find(`[data-node-id="${id}"]`);
    expect(card("184").text()).toContain("Waiting on 1");
    expect(card("190").text()).toContain("Waiting on 1");
    expect(card("181").text()).toContain("Waiting on 1");
    expect(card("180").text()).not.toContain("Waiting");
    expect(card("tti/other#9").classes()).toContain("tux-dependency-graph__node--external");
  });

  it("puts unlinked items in the 'Not linked' strip, not the graph", async () => {
    const w = await mountSuspended(TuxDependencyGraph, { props: { nodes: roadmap, edges: links } });
    const strip = w.find(".tux-dependency-graph__strip");
    expect(strip.text()).toContain("Not linked");
    expect(strip.find('[data-node-id="200"]').exists()).toBe(true);
    expect(w.find('.tux-dependency-graph__canvas [data-node-id="200"]').exists()).toBe(false);
    await strip.find('[data-node-id="200"]').trigger("click");
    expect(w.emitted("select")?.at(-1)).toEqual(["200"]);
  });

  it("arrow keys move focus to the nearest card", async () => {
    const w = await mountSuspended(TuxDependencyGraph, {
      props: { nodes: roadmap, edges: links },
      attachTo: document.body,
    });
    const card = (id: string) => w.find(`[data-node-id="${id}"]`);
    (card("181").element as HTMLElement).focus();
    await card("181").trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement?.getAttribute("data-node-id")).toBe("184");
    await card("184").trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement?.getAttribute("data-node-id")).toBe("190");
    await card("190").trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement?.getAttribute("data-node-id")).toBe("184");
    w.unmount();
  });

  it("`selected` traces the whole chain and dims the rest", async () => {
    const w = await mountSuspended(TuxDependencyGraph, {
      props: { nodes: [...roadmap, n("300"), n("301")], edges: [...links, e("300", "301")], selected: "181" },
    });
    expect(w.find(".tux-dependency-graph").classes()).toContain("tux-dependency-graph--tracing");
    const dim = (id: string) => w.find(`[data-node-id="${id}"]`).classes().includes("tux-dependency-graph__node--dim");
    expect(dim("tti/other#9")).toBe(false); // upstream
    expect(dim("184")).toBe(false); // downstream
    expect(dim("190")).toBe(false); // further downstream
    expect(dim("180")).toBe(true); // a sibling blocker of 184, not on 181's chain
    expect(dim("300")).toBe(true);
    expect(w.find('[data-node-id="181"]').attributes("aria-current")).toBe("true");
    const chainEdges = w.findAll(".tux-dependency-graph__edge--chain");
    expect(chainEdges).toHaveLength(3);
  });

  it("hover previews a chain, and leaving restores the untraced view", async () => {
    const w = await mountSuspended(TuxDependencyGraph, { props: { nodes: roadmap, edges: links } });
    const root = () => w.find(".tux-dependency-graph").classes();
    expect(root()).not.toContain("tux-dependency-graph--tracing");
    await w.find('[data-node-id="190"]').trigger("mouseenter");
    expect(root()).toContain("tux-dependency-graph--tracing");
    await w.find('[data-node-id="190"]').trigger("mouseleave");
    expect(root()).not.toContain("tux-dependency-graph--tracing");
  });

  it("a loop gets the banner, a framed band, red links — and its members are one click away", async () => {
    const w = await mountSuspended(TuxDependencyGraph, {
      props: {
        nodes: [n("1"), n("2"), n("3"), n("4")],
        edges: [e("1", "2"), e("2", "3"), e("3", "1"), e("3", "4"), e("4", "4"), e("4", "404")],
      },
    });
    const banner = w.find(".tux-dependency-graph__banner");
    expect(banner.text()).toContain(
      "These items wait on each other in a loop — nothing in it can finish until one link is removed.",
    );
    expect(banner.text().replace(/\s+/g, " ")).toContain("#1 → #2 → #3 → back to #1");
    expect(w.findAll(".tux-dependency-graph__frame")).toHaveLength(1);
    expect(w.findAll(".tux-dependency-graph__edge--loop")).toHaveLength(3);
    expect(w.find('[data-node-id="4"]').text()).toContain("Waiting on 1");
    await banner.findAll("button")[1]!.trigger("click");
    expect(w.emitted("select")?.at(-1)).toEqual(["2"]);
    // The ignored links are counted in words, not drawn.
    expect(w.find(".tux-dependency-graph__note").text()).toBe(
      "Not drawn: 1 link from an item to itself; 1 link to an item not in this view.",
    );
  });

  it("empty, all-unlinked and loading states", async () => {
    const empty = await mountSuspended(TuxDependencyGraph, { props: { nodes: [], edges: [] } });
    expect(empty.find(".tux-dependency-graph__empty").text()).toContain("Nothing to order yet");
    expect(empty.find(".tux-dependency-graph__canvas").exists()).toBe(false);

    const unlinked = await mountSuspended(TuxDependencyGraph, { props: { nodes: [n("1"), n("2")], edges: [] } });
    expect(unlinked.text()).toContain("None of these items wait on each other yet.");
    expect(unlinked.findAll(".tux-dependency-graph__chip")).toHaveLength(2);

    const loading = await mountSuspended(TuxDependencyGraph, { props: { nodes: roadmap, edges: links, loading: true } });
    expect(loading.find('[role="status"]').text()).toContain("Loading");
    expect(loading.find(".tux-dependency-graph__node").exists()).toBe(false);
  });

  it("hideDone removes done cards and says how many are hidden", async () => {
    const w = await mountSuspended(TuxDependencyGraph, { props: { nodes: roadmap, edges: links, hideDone: true } });
    expect(w.find('[data-node-id="180"]').exists()).toBe(false);
    expect(w.find(".tux-dependency-graph__note").text()).toBe("1 done item is hidden.");
  });
});
