import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxErrorPage from "~/components/TuxErrorPage.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxErrorPage Component", () => {
  it("renders 404 error page by default with accessibility compliance", async () => {
    const wrapper = await mountSuspended(TuxErrorPage, {
      props: {
        code: "404",
      },
    });

    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Page Not Found");
    expect(wrapper.text()).toContain("Return to Home");
    expect(wrapper.text()).toContain("Browse Component Lab");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders 401 authentication required preset", async () => {
    const wrapper = await mountSuspended(TuxErrorPage, {
      props: {
        code: "401",
      },
    });

    expect(wrapper.text()).toContain("401");
    expect(wrapper.text()).toContain("Authentication Required");
    expect(wrapper.text()).toContain("Sign in with TTI Account");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders 503 maintenance preset", async () => {
    const wrapper = await mountSuspended(TuxErrorPage, {
      props: {
        code: "503",
      },
    });

    expect(wrapper.text()).toContain("503");
    expect(wrapper.text()).toContain("Service Under Scheduled Maintenance");
    expect(wrapper.text()).toContain("Check System Health");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders 500 server error preset with custom support slot and diagnostic details", async () => {
    const wrapper = await mountSuspended(TuxErrorPage, {
      props: {
        code: "500",
        inline: true,
        details: "Error: Connection timeout at cluster.tti.tamu.edu:9443",
      },
      slots: {
        support: () => "<p class='support-note'>Contact TTI IT Operations at support@tti.tamu.edu</p>",
      },
    });

    expect(wrapper.text()).toContain("500");
    expect(wrapper.text()).toContain("Internal System Error");
    expect(wrapper.text()).toContain("Error: Connection timeout at cluster.tti.tamu.edu:9443");
    expect(wrapper.text()).toContain("Contact TTI IT Operations at support@tti.tamu.edu");
    expect(wrapper.find(".tux-error-page--inline").exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports custom title, lede, and custom action buttons", async () => {
    const wrapper = await mountSuspended(TuxErrorPage, {
      props: {
        code: "403",
        title: "Restricted Corridor Telemetry",
        lede: "Access to this telemetry pipeline requires TAMUS research credentials.",
        actions: [
          { label: "Request Clearance", to: "/tokens", intent: "primary" },
          { label: "Return to Dashboard", to: "/", intent: "ghost" },
        ],
      },
    });

    expect(wrapper.text()).toContain("Restricted Corridor Telemetry");
    expect(wrapper.text()).toContain("Access to this telemetry pipeline requires TAMUS research credentials.");
    expect(wrapper.text()).toContain("Request Clearance");
    expect(wrapper.text()).toContain("Return to Dashboard");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
