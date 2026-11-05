import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxResourceMeter, {
  type ResourceChannelMetric,
} from "~/components/TuxResourceMeter.vue";
import { runComponentAxe } from "../axe-helper";

const sampleChannels: ResourceChannelMetric[] = [
  {
    id: "vcpu",
    label: "vCPU Cores",
    capacity: 128,
    allocated: 96,
    utilized: 18,
    unit: "cores",
  },
  {
    id: "memory",
    label: "System Memory",
    capacity: 1024,
    allocated: 768,
    utilized: 614,
    unit: "GiB",
  },
  {
    id: "gpu",
    label: "GPU Accelerators",
    capacity: 16,
    allocated: 12,
    utilized: 2,
    unit: "GPUs",
  },
  {
    id: "nvme",
    label: "NVMe Pool",
    capacity: 64,
    allocated: 60,
    utilized: 58,
    unit: "TiB",
  },
];

describe("TuxResourceMeter Component", () => {
  it("renders dual-overlay channel readouts, efficiency metrics, waste/saturation flags, and passes axe", async () => {
    const wrapper = await mountSuspended(TuxResourceMeter, {
      props: {
        title: "On-Prem GPU Cluster",
        subtitle: "Study 02-411085 · Corridor Vision Batch Quota",
        poolStatus: "warning",
        channels: sampleChannels,
      },
    });

    expect(wrapper.text()).toContain("On-Prem GPU Cluster");
    expect(wrapper.text()).toContain("Study 02-411085");
    expect(wrapper.text()).toContain("Pool Efficiency");
    expect(wrapper.text()).toContain("2 over-reserved");
    expect(wrapper.text()).toContain("1 saturated");
    expect(wrapper.text()).toContain("19% eff");
    expect(wrapper.text()).toContain("Idle Waste");
    expect(wrapper.text()).toContain("Saturated");
    expect(wrapper.text()).toContain("Balanced");
    expect(wrapper.text()).toContain("Reclaim Idle");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits reclaim with flagged idle-waste channels and selectChannel on channel activation", async () => {
    const wrapper = await mountSuspended(TuxResourceMeter, {
      props: {
        title: "On-Prem GPU Cluster",
        channels: sampleChannels,
        reclaimLabel: "Reclaim Quota",
      },
    });

    const reclaimBtn = wrapper.find(".tux-resource-meter__reclaim-btn");
    expect(reclaimBtn.exists()).toBe(true);
    expect(reclaimBtn.text()).toContain("Reclaim Quota");
    await reclaimBtn.trigger("click");

    const reclaimed = wrapper.emitted("reclaim")?.[0]?.[0] as ResourceChannelMetric[];
    expect(reclaimed).toHaveLength(2);
    expect(reclaimed.map((c) => c.id)).toEqual(["vcpu", "gpu"]);

    const channelBtns = wrapper.findAll(".tux-resource-meter__channel-btn");
    expect(channelBtns).toHaveLength(4);
    await channelBtns[1]!.trigger("click");
    expect(wrapper.emitted("selectChannel")?.[0]).toEqual([sampleChannels[1]]);
  });

  it("hides reclaim action when showReclaimAction is false or no channels breach waste threshold", async () => {
    const balanced: ResourceChannelMetric[] = [
      {
        id: "workers",
        label: "Worker Slots",
        capacity: 64,
        allocated: 48,
        utilized: 42,
        unit: "slots",
      },
    ];

    const wrapper = await mountSuspended(TuxResourceMeter, {
      props: {
        title: "Distributed Query Pool",
        poolStatus: "maintenance",
        channels: balanced,
        showReclaimAction: true,
      },
    });

    expect(wrapper.find(".tux-resource-meter__reclaim-btn").exists()).toBe(false);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
