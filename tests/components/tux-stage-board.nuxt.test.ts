import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxStageBoard, {
  type StageCardItem,
  type StageLane,
} from "~/components/TuxStageBoard.vue";
import { runComponentAxe } from "../axe-helper";

const sampleStages: StageLane[] = [
  { id: "intake", label: "Field Intake", description: "New requests" },
  { id: "bench", label: "Bench Calibration" },
  { id: "deployed", label: "Roadside Cutover" },
];

const sampleItems: StageCardItem[] = [
  {
    id: "card-1",
    stageId: "intake",
    code: "SIG-101",
    title: "SH-6 Progression Audit",
    subtitle: "Arterial coordination",
    owner: "A. Morales",
    metricValue: 12,
    tags: ["arterial"],
    priority: "high",
  },
  {
    id: "card-2",
    stageId: "bench",
    code: "WIM-202",
    title: "US-290 Axle Sensor",
    owner: "K. Lindqvist",
    metricValue: 16,
    priority: "critical",
  },
  {
    id: "card-3",
    stageId: "bench",
    title: "FM-2818 Radar Unit",
    metricValue: 4,
  },
];

describe("TuxStageBoard Component", () => {
  it("groups cards by lane, computes numeric metric rollups, and passes axe accessibility", async () => {
    const wrapper = await mountSuspended(TuxStageBoard, {
      props: {
        stages: sampleStages,
        items: sampleItems,
        metricSuffix: " nodes",
      },
    });

    expect(wrapper.text()).toContain("Field Intake");
    expect(wrapper.text()).toContain("Bench Calibration");
    expect(wrapper.text()).toContain("Total: 20 nodes");
    expect(wrapper.text()).toContain("Total: 12 nodes");
    expect(wrapper.text()).toContain("Total: 0 nodes");
    expect(wrapper.text()).toContain("No items in this stage");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits move and select payloads via accessible buttons and supports movable=false", async () => {
    const wrapper = await mountSuspended(TuxStageBoard, {
      props: {
        stages: sampleStages,
        items: sampleItems,
      },
    });

    const moveNextBtn = wrapper.find(
      'button[aria-label="Move US-290 Axle Sensor to Roadside Cutover"]',
    );
    expect(moveNextBtn.exists()).toBe(true);
    await moveNextBtn.trigger("click");

    expect(wrapper.emitted("move")?.[0]).toEqual([
      {
        itemId: "card-2",
        fromStageId: "bench",
        toStageId: "deployed",
      },
    ]);

    const movePrevBtn = wrapper.find(
      'button[aria-label="Move US-290 Axle Sensor to Field Intake"]',
    );
    expect(movePrevBtn.exists()).toBe(true);
    await movePrevBtn.trigger("click");

    expect(wrapper.emitted("move")?.[1]).toEqual([
      {
        itemId: "card-2",
        fromStageId: "bench",
        toStageId: "intake",
      },
    ]);

    const selectBtn = wrapper.find('button[aria-label="Select SH-6 Progression Audit"]');
    await selectBtn.trigger("click");
    expect(wrapper.emitted("select")?.[0]).toEqual([sampleItems[0]]);

    const staticWrapper = await mountSuspended(TuxStageBoard, {
      props: {
        stages: sampleStages,
        items: sampleItems,
        movable: false,
      },
    });
    expect(staticWrapper.find(".tux-stage-board__move-btn").exists()).toBe(false);

    const staticViolations = await runComponentAxe(staticWrapper.element);
    expect(staticViolations).toEqual([]);
  });
});
