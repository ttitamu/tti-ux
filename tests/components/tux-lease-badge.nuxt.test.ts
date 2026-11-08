import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxLeaseBadge from "~/components/TuxLeaseBadge.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxLeaseBadge Component", () => {
  it("computes active, expiring, expired, and indefinite countdown states and passes axe", async () => {
    const activeWrapper = await mountSuspended(TuxLeaseBadge, {
      props: {
        label: "Runway Pad B",
        remainingHours: 342,
        expiresLabel: "2026-11-15",
      },
    });
    expect(activeWrapper.classes()).toContain("tux-lease-badge--active");
    expect(activeWrapper.text()).toContain("Runway Pad B");
    expect(activeWrapper.text()).toContain("14d 6h left");
    expect(activeWrapper.text()).toContain("2026-11-15");
    expect(await runComponentAxe(activeWrapper.element)).toEqual([]);

    const expiringWrapper = await mountSuspended(TuxLeaseBadge, {
      props: {
        label: "WIM Trailer",
        remainingHours: 18,
        warningHours: 72,
      },
    });
    expect(expiringWrapper.classes()).toContain("tux-lease-badge--expiring");
    expect(expiringWrapper.text()).toContain("18h left");

    const expiredWrapper = await mountSuspended(TuxLeaseBadge, {
      props: {
        label: "Radar Pod",
        remainingHours: -48,
      },
    });
    expect(expiredWrapper.classes()).toContain("tux-lease-badge--expired");
    expect(expiredWrapper.text()).toContain("Expired 2d ago");

    const indefiniteWrapper = await mountSuspended(TuxLeaseBadge, {
      props: {
        label: "Reference Station",
      },
    });
    expect(indefiniteWrapper.classes()).toContain("tux-lease-badge--indefinite");
    expect(indefiniteWrapper.text()).toContain("No expiration");
  });

  it("renders inline lifecycle buttons and emits extend and release events", async () => {
    const wrapper = await mountSuspended(TuxLeaseBadge, {
      props: {
        label: "LiDAR Van #04",
        remainingHours: 24,
        extendable: true,
        releasable: true,
        extendLabel: "Renew",
        releaseLabel: "Return",
      },
    });

    const extendBtn = wrapper.find(".tux-lease-badge__btn--extend");
    const releaseBtn = wrapper.find(".tux-lease-badge__btn--release");
    expect(extendBtn.text()).toBe("Renew");
    expect(releaseBtn.text()).toBe("Return");

    await extendBtn.trigger("click");
    expect(wrapper.emitted("extend")).toBeTruthy();

    await releaseBtn.trigger("click");
    expect(wrapper.emitted("release")).toBeTruthy();

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
