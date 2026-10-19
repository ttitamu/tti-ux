import { describe, expect, it } from "vitest";
import { GALLERY_PRESETS } from "../app/utils/tuxEChartsGallery";
import { adaptOptionsForVision, createTuxEChartsTheme } from "../app/utils/tuxEChartsTheme";

describe("@tti/tti-ux-charts Package", () => {
  it("exports createTuxEChartsTheme and creates valid light and dark theme definitions", () => {
    const lightTheme = createTuxEChartsTheme(false);
    expect(lightTheme.color).toHaveLength(8);
    expect(lightTheme.backgroundColor).toBe("transparent");
    expect(lightTheme.textStyle.fontFamily).toContain("Open Sans");

    const darkTheme = createTuxEChartsTheme(true);
    expect(darkTheme.color).toHaveLength(8);
    expect(darkTheme.textStyle.color).toBe("#E6E6E6");
  });

  it("adapts chart options for deutan-protan vision mode", () => {
    const baseOpt = {
      series: [
        { type: "bar", data: [10, 20] },
      ],
    };

    const adapted = adaptOptionsForVision(baseOpt, false, {
      cvdMode: "deutan-protan",
      highContrast: false,
      antiHalation: false,
      softDark: false,
    });

    expect(adapted.color).toBeDefined();
    expect(adapted.color?.length).toBeGreaterThan(0);
  });

  it("contains all 32 institutional gallery presets and each returns valid option objects", () => {
    expect(GALLERY_PRESETS.length).toBe(32);

    for (const preset of GALLERY_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.category).toBeTruthy();
      expect(preset.story).toBeTruthy();

      const lightOption = preset.getOption(false);
      const darkOption = preset.getOption(true);

      expect(typeof lightOption).toBe("object");
      expect(typeof darkOption).toBe("object");
      expect(lightOption.series || lightOption.xAxis).toBeDefined();
      expect(darkOption.series || darkOption.xAxis).toBeDefined();
    }
  });
});
