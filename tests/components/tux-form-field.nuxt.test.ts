import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxFormField from "../../app/components/TuxFormField.vue";

describe("TuxFormField Component", () => {
  it("renders label, wires input IDs, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxFormField, {
      props: {
        label: "Corridor Identifier",
        hint: "Enter official TxDOT highway code (e.g. IH-35).",
        inputId: "corridor-id",
        required: true,
      },
      slots: {
        default: (slotProps: any) =>
          h("input", {
            id: slotProps.inputId,
            "aria-describedby": slotProps.ariaDescribedby,
            "aria-required": slotProps.ariaRequired,
            class: "test-input",
          }),
      },
    });

    const label = wrapper.find("label");
    expect(label.exists()).toBe(true);
    expect(label.attributes("for")).toBe("corridor-id");
    expect(wrapper.text()).toContain("Corridor Identifier");
    expect(wrapper.text()).toContain("Enter official TxDOT highway code");
    expect(wrapper.text()).toContain("*");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders error message and applies invalid state", async () => {
    const wrapper = await mountSuspended(TuxFormField, {
      props: {
        label: "Speed Sensor Reading",
        error: "Sensor speed must be a positive integer.",
        inputId: "sensor-speed",
      },
      slots: {
        default: (slotProps: any) =>
          h("input", {
            id: slotProps.inputId,
            "aria-describedby": slotProps.ariaDescribedby,
            "aria-invalid": slotProps.ariaInvalid,
          }),
      },
    });

    expect(wrapper.classes()).toContain("tux-form-field--invalid");
    expect(wrapper.text()).toContain("Sensor speed must be a positive integer.");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });
});
