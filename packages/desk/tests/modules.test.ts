import { describe, it, expect } from "vitest";
import {
  MODULE_KINDS,
  MODULES,
  isModuleKind,
  sanitizePayload,
  calloutTone,
  moduleCards,
  moduleSteps,
  moduleStats,
  moduleAction,
  sanitizeHref,
  moduleGridStyle,
  calcGridColumnFromCoord,
} from "../../app/utils/desk/modules";

describe("Tux Desk Modules", () => {
  it("defines all canonical modules", () => {
    expect(MODULE_KINDS).toEqual(["hero", "callout", "split", "cards", "steps", "cta", "stats"]);
    for (const kind of MODULE_KINDS) {
      expect(MODULES[kind]).toBeDefined();
      expect(MODULES[kind].kind).toBe(kind);
      expect(MODULES[kind].fields.length).toBeGreaterThan(0);
    }
  });

  it("sanitizes hrefs safely", () => {
    expect(sanitizeHref("/research/v2x")).toBe("/research/v2x");
    expect(sanitizeHref("https://tti.tamu.edu")).toBe("https://tti.tamu.edu");
    expect(sanitizeHref("mailto:research@tti.tamu.edu")).toBe("mailto:research@tti.tamu.edu");
    expect(sanitizeHref("javascript:alert(1)")).toBe("");
    expect(sanitizeHref("//evil.com")).toBe("");
  });

  it("sanitizes payload and fills defaults", () => {
    const payload = sanitizePayload("hero", {
      title: "Custom Title",
      actionHref: "https://tti.tamu.edu",
    });
    expect(payload.title).toBe("Custom Title");
    expect(payload.actionHref).toBe("https://tti.tamu.edu");
    expect(payload.eyebrow).toBe(MODULES.hero.defaults.eyebrow);
  });

  it("extracts structured items from payload", () => {
    const cardPayload = {
      c1Title: "First",
      c1Body: "First body",
      c1Href: "/one",
      c2Title: "Second",
      c2Body: "",
      c2Href: "",
    };
    const cards = moduleCards(cardPayload);
    expect(cards.length).toBe(2);
    expect(cards[0].title).toBe("First");
    expect(cards[0].href).toBe("/one");

    const statPayload = {
      v1: "$126M",
      l1: "Expenditures",
      v2: "700+",
      l2: "Researchers",
    };
    const stats = moduleStats(statPayload);
    expect(stats.length).toBe(2);
    expect(stats[0].value).toBe("$126M");
  });

  it("validates callout tone", () => {
    expect(calloutTone({ tone: "warn" })).toBe("warn");
    expect(calloutTone({ tone: "tip" })).toBe("tip");
    expect(calloutTone({ tone: "invalid" })).toBe("warn");
  });

  it("preserves _width layout attribute in sanitizePayload", () => {
    const payload75 = sanitizePayload("hero", {
      title: "Hero Title",
      _width: "75%",
    });
    expect(payload75._width).toBe("75%");

    const payloadDynamic = sanitizePayload("hero", {
      title: "Dynamic Width",
      _width: "83%",
    });
    expect(payloadDynamic._width).toBe("83%");

    const payloadInvalid = sanitizePayload("hero", {
      title: "Invalid Width",
      _width: "10%",
    });
    expect(payloadInvalid._width).toBeUndefined();
  });

  it("sanitizes 12-column positioning attributes and calculates grid styles", () => {
    const payloadGrid = sanitizePayload("hero", {
      title: "Grid Block",
      _colStart: "5",
      _colSpan: "8",
      _align: "left",
    });
    expect(payloadGrid._colStart).toBe("5");
    expect(payloadGrid._colSpan).toBe("8");
    expect(payloadGrid._align).toBe("left");

    // Test moduleGridStyle with left alignment
    const styleLeft = moduleGridStyle(payloadGrid);
    expect(styleLeft.marginLeft).toBe("0");
    expect(styleLeft.marginRight).toBe("auto");
    expect(styleLeft.width).toBe("67%");

    // Test moduleGridStyle with center alignment
    const styleCenter = moduleGridStyle({ _colStart: "3", _colSpan: "8", _align: "center" });
    expect(styleCenter.marginLeft).toBe("auto");
    expect(styleCenter.marginRight).toBe("auto");

    // Test moduleGridStyle with right alignment
    const styleRight = moduleGridStyle({ _colStart: "7", _colSpan: "6", _align: "right" });
    expect(styleRight.marginLeft).toBe("auto");
    expect(styleRight.marginRight).toBe("0");

    // Test custom track offset (col 5 to 12) without explicit align
    const styleCustom = moduleGridStyle({ _colStart: "5", _colSpan: "8" });
    expect(styleCustom.marginLeft).toBe("33.33%");
    expect(styleCustom.width).toBe("66.67%");
  });
});
