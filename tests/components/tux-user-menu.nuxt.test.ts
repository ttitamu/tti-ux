import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxUserMenu from "~/components/TuxUserMenu.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxUserMenu Component", () => {
  it("renders signed-in user menu with name, department, and passes accessibility checks", async () => {
    const wrapper = await mountSuspended(TuxUserMenu, {
      props: {
        state: "signed-in",
        identity: {
          name: "Dr. Elena Rostova",
          email: "e-rostova@tti.tamu.edu",
          department: "Center for Transportation Safety",
          initials: "ER",
        },
        items: [
          { label: "Research Profiles", to: "/people/elena-rostova" },
        ],
        prefs: [
          { label: "High Contrast Theme" },
        ],
      },
    });

    expect(wrapper.text()).toContain("ER");
    const trigger = wrapper.find("button");
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes("aria-label")).toContain("Account: Dr. Elena Rostova");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports signed-out, rail-footer placement, and local-only state", async () => {
    const signedOutWrapper = await mountSuspended(TuxUserMenu, {
      props: {
        state: "signed-out",
        signInHref: "/auth/login",
        signInLabel: "Sign In via TAMU NetID",
      },
    });

    expect(signedOutWrapper.text()).toContain("Sign In via TAMU NetID");
    const violationsSignedOut = await runComponentAxe(signedOutWrapper.element);
    expect(violationsSignedOut).toEqual([]);

    const railWrapper = await mountSuspended(TuxUserMenu, {
      props: {
        state: "local-only",
        placement: "rail-footer",
        identity: {
          name: "Local Researcher",
        },
        statusLine: "Local Workspace Active",
      },
    });

    expect(railWrapper.text()).toContain("Local Researcher");
    expect(railWrapper.text()).toContain("Local Workspace Active");
    const violationsRail = await runComponentAxe(railWrapper.element);
    expect(violationsRail).toEqual([]);
  });
});
