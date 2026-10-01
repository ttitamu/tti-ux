import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxFileDropzone from "../../app/components/TuxFileDropzone.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxFileDropzone Component", () => {
  it("renders dropzone with label, hint, and file limits", async () => {
    const wrapper = await mountSuspended(TuxFileDropzone, {
      props: {
        label: "Upload Corridor Datasets",
        hint: "Supports CSV, GeoJSON, and Parquet",
        multiple: true,
        maxFiles: 5,
        accept: ".csv,.geojson",
      },
    });

    expect(wrapper.text()).toContain("Upload Corridor Datasets");
    expect(wrapper.text()).toContain("Supports CSV, GeoJSON, and Parquet");
    expect(wrapper.text()).toContain("Up to 5 files");
    expect(wrapper.text()).toContain(".csv,.geojson");

    const input = wrapper.find('input[type="file"]');
    expect(input.exists()).toBe(true);
    expect(input.attributes("aria-label")).toBe("Upload Corridor Datasets");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("renders disabled state with appropriate attributes", async () => {
    const wrapper = await mountSuspended(TuxFileDropzone, {
      props: {
        disabled: true,
        label: "Dropzone disabled",
      },
    });

    const zone = wrapper.find(".tux-file-dropzone__zone");
    expect(zone.classes()).toContain("tux-file-dropzone__zone--disabled");
    expect(zone.attributes("aria-disabled")).toBe("true");

    const input = wrapper.find('input[type="file"]');
    expect(input.attributes("disabled")).toBeDefined();
  });
});
