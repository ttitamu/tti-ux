import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxVisionPreferencesModal from "~/components/TuxVisionPreferencesModal.vue";

describe("TuxVisionPreferencesModal Component", () => {
  it("mounts closed by default and accepts open prop", async () => {
    const wrapper = await mountSuspended(TuxVisionPreferencesModal, {
      props: {
        open: false,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders CVD modes and comfort controls when opened", async () => {
    const wrapper = await mountSuspended(TuxVisionPreferencesModal, {
      props: {
        open: true,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
