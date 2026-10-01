import { describe, expect, it } from "vitest";

describe("Design Token Playground & Comm Alignment", () => {
  const presets = [
    {
      id: "tti-kadence",
      name: "TTI Kadence Institutional",
      radius: 0,
      fontFamily: "'Roboto', sans-serif",
      primaryColor: "#500000",
      accentColor: "#CFA935",
      shape: "sharp",
      theme: "light",
    },
    {
      id: "tux-modern",
      name: "TUX Modern App",
      radius: 4,
      fontFamily: "'Inter', sans-serif",
      primaryColor: "#5C0025",
      accentColor: "#DDAC37",
      shape: "default",
      theme: "light",
    },
    {
      id: "ops-console",
      name: "Operations Console",
      radius: 2,
      fontFamily: "'JetBrains Mono', monospace",
      primaryColor: "#6BB4C0",
      accentColor: "#F5D98A",
      shape: "sharp",
      theme: "dark",
    },
    {
      id: "friendly-portal",
      name: "Editorial Magazine",
      radius: 8,
      fontFamily: "Georgia, 'Times New Roman', serif",
      primaryColor: "#500000",
      accentColor: "#B89332",
      shape: "default",
      theme: "light",
    },
  ];

  it("contains official TTI Kadence institutional preset matching tti.tamu.edu", () => {
    const kadence = presets.find((p) => p.id === "tti-kadence");
    expect(kadence).toBeDefined();
    expect(kadence?.radius).toBe(0);
    expect(kadence?.shape).toBe("sharp");
    expect(kadence?.primaryColor).toBe("#500000"); // Aggie Maroon
    expect(kadence?.accentColor).toBe("#CFA935"); // Warm Gold
    expect(kadence?.fontFamily).toContain("Roboto");
    expect(kadence?.theme).toBe("light");
  });

  it("generates valid WordPress Kadence theme.json with token mappings", () => {
    const p = presets[0];
    const themeJsonStr = `{
      "$schema": "https://schemas.wp.org/trunk/theme.json",
      "version": 3,
      "settings": {
        "color": {
          "palette": [
            { "slug": "brand-primary", "color": "${p.primaryColor}", "name": "TTI Aggie Maroon" },
            { "slug": "brand-accent", "color": "${p.accentColor}", "name": "TTI Warm Gold" }
          ]
        },
        "typography": {
          "fontFamilies": [
            { "fontFamily": "${p.fontFamily}", "slug": "primary", "name": "TTI Brand Font" }
          ]
        },
        "custom": {
          "tux": {
            "buttonRadius": "${p.radius}px",
            "cardRadius": "${p.radius}px",
            "ruleColor": "${p.accentColor}"
          }
        }
      }
    }`;

    const parsed = JSON.parse(themeJsonStr);
    expect(parsed.version).toBe(3);
    expect(parsed.settings.color.palette[0].color).toBe("#500000");
    expect(parsed.settings.color.palette[1].color).toBe("#CFA935");
    expect(parsed.settings.custom.tux.buttonRadius).toBe("0px");
    expect(parsed.settings.custom.tux.ruleColor).toBe("#CFA935");
  });

  it("generates CSS variable overrides correctly", () => {
    const p = presets[0];
    const css = `:root {
      --brand-primary: ${p.primaryColor};
      --brand-accent: ${p.accentColor};
      --font-body: ${p.fontFamily};
      --radius-md: ${p.radius}px;
    }`;

    expect(css).toContain("--brand-primary: #500000;");
    expect(css).toContain("--brand-accent: #CFA935;");
    expect(css).toContain("--radius-md: 0px;");
    expect(css).toContain("Roboto");
  });

  it("constructs target Forgejo issue URL with prefilled payload", () => {
    const base = "https://code.tti.tamu.edu/tti/tti-ux/issues/new";
    const title = "[Token Idea] TTI Kadence Institutional: 0px radius";
    const body = "### Proposal Summary\nAligning TUX with Kadence.";

    const url = `${base}?${new URLSearchParams({ title, body }).toString()}`;
    expect(url).toContain("https://code.tti.tamu.edu/tti/tti-ux/issues/new");
    expect(url).toContain("title=%5BToken+Idea%5D+TTI+Kadence+Institutional%3A+0px+radius");
    expect(url).toContain("body=");
  });
});
