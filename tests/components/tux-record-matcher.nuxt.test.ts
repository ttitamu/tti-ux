import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxRecordMatcher, {
  type UnmatchedRecordItem,
} from "~/components/TuxRecordMatcher.vue";
import { runComponentAxe } from "../axe-helper";

const sampleItems: UnmatchedRecordItem[] = [
  {
    id: "rec-1",
    sourceCode: "RAD-241",
    sourceTitle: "Side-Fire Radar · MP 241",
    sourceMeta: "4-lane mainlane feed",
    amountLabel: "24,100 veh/day",
    candidates: [
      {
        id: "cand-low",
        code: "STA-240",
        label: "IH-35 Frontage @ Braker",
        confidence: 68,
        meta: "2-lane arterial",
      },
      {
        id: "cand-high",
        code: "STA-241",
        label: "IH-35 Mainlanes @ Rundberg",
        confidence: 95,
        meta: "Permanent ATR station",
      },
    ],
  },
  {
    id: "rec-2",
    sourceCode: "LID-019",
    sourceTitle: "Intersection LiDAR · University Dr",
    candidates: [
      {
        id: "cand-mid",
        code: "INT-044",
        label: "University Dr & Texas Ave",
        confidence: 82,
      },
    ],
  },
];

describe("TuxRecordMatcher Component", () => {
  it("pre-selects highest-confidence candidate per item and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxRecordMatcher, {
      props: {
        items: sampleItems,
      },
    });

    expect(wrapper.text()).toContain("Side-Fire Radar · MP 241");
    expect(wrapper.text()).toContain("IH-35 Mainlanes @ Rundberg");
    expect(wrapper.text()).toContain("95%");
    expect(wrapper.text()).toContain("1 high-confidence");

    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios.length).toBe(3);
    // Second radio in rec-1 has 95% confidence and should be pre-selected
    expect((radios[1]!.element as HTMLInputElement).checked).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits resolve, resolveBatch, and dismiss events with candidate and rule selections", async () => {
    const wrapper = await mountSuspended(TuxRecordMatcher, {
      props: {
        items: sampleItems,
        allowRuleCreation: true,
        acceptLabel: "Confirm Match",
        dismissLabel: "Defer",
      },
    });

    // Toggle rule creation checkbox on first item
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[0]!.setValue(true);

    // Trigger batch high-confidence action (only rec-1 has >=90%)
    const batchBtn = wrapper.find(".tux-record-matcher__btn--batch");
    await batchBtn.trigger("click");
    expect(wrapper.emitted("resolveBatch")?.[0]).toEqual([
      [{ itemId: "rec-1", candidateId: "cand-high", createRule: true }],
    ]);

    // Switch candidate on rec-1 to cand-low and click Confirm Match
    const radios = wrapper.findAll('input[type="radio"]');
    await radios[0]!.setValue(true);

    const confirmButtons = wrapper
      .findAll("button")
      .filter((btn) => btn.text() === "Confirm Match");
    await confirmButtons[0]!.trigger("click");
    expect(wrapper.emitted("resolve")?.[0]).toEqual([
      { itemId: "rec-1", candidateId: "cand-low", createRule: true },
    ]);

    // Click Defer on second item
    const deferButtons = wrapper
      .findAll("button")
      .filter((btn) => btn.text() === "Defer");
    await deferButtons[1]!.trigger("click");
    expect(wrapper.emitted("dismiss")?.[0]).toEqual(["rec-2"]);
  });

  it("supports allowRuleCreation=false and empty queue state without axe violations", async () => {
    const emptyWrapper = await mountSuspended(TuxRecordMatcher, {
      props: {
        items: [],
        allowRuleCreation: false,
      },
    });

    expect(emptyWrapper.text()).toContain("All unlinked records have been reconciled.");
    const violations = await runComponentAxe(emptyWrapper.element);
    expect(violations).toEqual([]);
  });
});
