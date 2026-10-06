import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ErrorView from "~/error.vue";

describe("Root Error Boundary (app/error.vue)", () => {
  it("renders 404 error condition with institutional header and actions", async () => {
    const errorObj = {
      statusCode: 404,
      statusMessage: "Page Not Found",
      message: "The requested route does not exist in TUX.",
    };

    const wrapper = await mountSuspended(ErrorView, {
      props: {
        error: errorObj as any,
      },
    });

    expect(wrapper.text()).toContain("TTI UX Framework");
    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Page Not Found");
    expect(wrapper.text()).toContain("Return to Homepage");
    expect(wrapper.text()).toContain("Browse Component Lab");
    expect(wrapper.text()).toContain("Texas A&M Transportation Institute · System Error Boundary");
  });

  it("renders 500 error condition with diagnostic trace details", async () => {
    const errorObj = {
      statusCode: 500,
      statusMessage: "Internal System Error",
      message: "Database connection failed",
      stack: "Error: DB Connection refused\n    at queryServer (/app/server.ts:42:15)",
    };

    const wrapper = await mountSuspended(ErrorView, {
      props: {
        error: errorObj as any,
      },
    });

    expect(wrapper.text()).toContain("500");
    expect(wrapper.text()).toContain("Internal System Error");
    expect(wrapper.text()).toContain("Diagnostic Details");
    expect(wrapper.text()).toContain("DB Connection refused");
  });
});
